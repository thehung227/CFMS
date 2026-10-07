SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Last kqt021
-- 8/4/2015: Thangnh lấy giá trị tự nhập với cổ phiếu trong kỳ và dự kiến phát hành thêm
-- 14/09/2026: - Tính số liệu dòng level 9 cho TẤT CẢ phòng ban trong 1 lần quét / khoản mục (GROUP BY DeptCode)
--               thay cho vòng lặp khoản mục x phòng ban (92 x 41 = 3.772 lần xuống còn 92 lần).
--             - Chứng từ được gán về DUY NHẤT 1 phòng ban báo cáo có mã là tiền tố khớp dài nhất:
--               PKTMEP -> PKTMEP (trước đây bị cộng trùng vào cả PKT), BLD-CTC-001 -> BLD (giữ như cũ).
--             - Bỏ usp_sys_SumValue: bảng @_Kqt021 nhân bản ItemNo theo phòng ban nên subtotal bị cộng dồn
--               mọi phòng ban. Dòng subtotal (ItemLevel <> 9) nay được tính trong usp_Kqt_ThongKeChiPhiVPCTY
--               sau khi dựng cột theo DeptCode.
--             - Bỏ #tblKyTruoc (chỉ dùng cho kỳ trước, không được ghi vào kết quả).
-- 25/09/2026: - Tách số liệu theo IsPhanBo: ThisPeriod = phần IsPhanBo = 0 (giá trị trực tiếp),
--               Amount_PhanBo = phần IsPhanBo = 1 (giá trị phân bổ). Bảng @_Kqt021 phải có cột
--               Amount_PhanBo NUMERIC(18, 2).
--             - Thêm RowId vào @_Field_GroupBy của usp_B30SoCai_GetData_Lk: cờ IsPhanBo lấy từ
--               B30AccDocOther theo RowId, nếu #K_CtTmp còn gộp nhiều dòng sổ cái thì RowId chỉ là
--               MAX(RowId) của nhóm -> Debit/CreditDeptCode của 1 dòng bất kỳ áp cho cả nhóm.
--               (Đo trên dữ liệu 01-09/2026: 258/22.147 nhóm chứng từ VP có Debit hoặc CreditDeptCode
--               khác nhau trong cùng nhóm, tức ~1,2% số nhóm bị phân loại sai nếu không thêm RowId.)
--             - UPDATE #K_CtTmp: đặt bí danh cho bảng đích (UPDATE t1 ... FROM #K_CtTmp t1) và dùng
--               INNER JOIN để dòng không có trong B30AccDocOther giữ nguyên N'' thay vì bị set NULL.
CREATE OR ALTER PROC dbo.usp_Kqt_ThongKeChiPhiVPCTY_TinhToan_CCM
	@_DocDate1 Smalldatetime = 'Jan 01 2006',
	@_DocDate2 Smalldatetime = 'Jan 31 2006',
	@_Kqt021 NVARCHAR(32) = N'B10Kqt021200',
	@_ForeignCurrencyOnly Integer = 1,
	@_IsSync TINYINT = 0,
	@_nUserId AS INT				= 0,
	@_LangId INT				= 0,
	@_ProductCostId	NVARCHAR(24)			= '',
	@_Ma_Dvcs NCHAR(3) = N'A02',
	@_CurrencyCode0 NVARCHAR(3) = N'VND',
	@_Kd_Cp_Tam NCHAR(1) = N'K',
	@_ResetFormula TINYINT		= NULL	-- Không còn dùng (subtotal tính ở thủ tục gọi), giữ để tương thích
--WITH ENCRYPTION
AS
BEGIN
	/*	Bang bao cao Ket qua kinh doanh phan I	*/
	SET NOCOUNT ON;
	DECLARE @_DocDate01 SmallDatetime,
			@_DocDate02 SmallDatetime,
			@_Ngay_Dau_Nam 	SmallDatetime,
			@_Ngay_Dau_Nam_Truoc SmallDateTime

	SET @_DocDate01 = DATEADD(Month, -12, @_DocDate1) -- Ngay dau ky truoc

-- Ngay cuoi ky truoc
	IF MONTH(@_DocDate2) = 2 AND DAY(@_DocDate2) = 28 AND
		MONTH(DATEADD(Month, -12, @_DocDate2) + 1) = 2 -- Nam truoc la nam co 29 ngay
		SET @_DocDate02 = DATEADD(Month, -12, @_DocDate2) + 1
	ELSE
		SET @_DocDate02 = DATEADD(Month, -12, @_DocDate2)

	SET @_Ngay_Dau_Nam = dbo.ufn_sys_GetOpenDateOfFinanceYear(@_DocDate1, @_Ma_Dvcs)
	SET @_Ngay_Dau_Nam_Truoc = dbo.ufn_sys_GetOpenDateOfFinanceYear(@_DocDate01, @_Ma_Dvcs)

	SET @_Ma_Dvcs = RTRIM(@_Ma_Dvcs)
	SELECT @_Ngay_Dau_Nam_Truoc = '20180101'
	DECLARE @_DocDate00 SmallDatetime, @_Id INT,
			@_CrspAccount NVARCHAR(128), @_ExcludedCrspAccount NVARCHAR(128),
			@_ExpenseCatgCode NVARCHAR(128), @_ItemType NVARCHAR(16),
			@_strExec NVARCHAR(MAX), @_Key NVARCHAR(4000),
			@_strTmp NVARCHAR(1000), @_ProductCostIdTmp NVARCHAR(24),
			@_AmountCol NVARCHAR(128), @_AmountExpr NVARCHAR(256), @_AmountPbExpr NVARCHAR(256)

	DECLARE @_GetDate NVARCHAR(8) = CONVERT(NVARCHAR(8), GETDATE(), 112)
	SET @_DocDate00 = @_Ngay_Dau_Nam
	SET @_Key =
			N'((DocDate BETWEEN ''' + CAST(@_Ngay_Dau_Nam_Truoc AS NVARCHAR(32)) +
			N''' AND ''' + CAST(@_GetDate AS NVARCHAR(32)) + N'''))'

	IF @_ProductCostId <> ''
		SET @_Key = @_Key + N' AND (ProductCostId = ' + CHAR(39) + @_ProductCostId + CHAR(39) +
					N' OR CrspProductCostId = ' + CHAR(39) + @_ProductCostId + CHAR(39) + ')'


	-- Lay so lieu phat sinh
	-- Dùng Sum thay cho lấy hết số liệu
	-- RowId nằm trong @_Field_GroupBy để mỗi dòng #K_CtTmp còn tương ứng 1 dòng sổ cái,
	-- nhờ đó join B30AccDocOther lấy Debit/CreditDeptCode là chính xác (xem ghi chú đầu file).
	EXECUTE usp_B30SoCai_GetData_Lk
		@_DocDate1 = @_DocDate1,
		@_DocDate2 = @_DocDate2,
		@_Key1 = @_Key,
		@_Key2 = N'',
		@_CtTmp = N'#K_CtTmp',
		@_nUserId	= @_nUserId,
		@_LangId	= @_LangId,
		@_Ma_DvCs = @_Ma_Dvcs,
		@_CurrencyCode0 = @_CurrencyCode0,
		@_Field_GroupBy = N'DocDate,Account,CrspAccount,ExpenseCatgCode,TransCode,ProductCostId,CrspProductCostId,CrspCustomerCode,DeptCode,RowId',
		@_Field_Sum = N'DebitAmount,CreditAmount'

	-- Bộ phận ghi Nợ / ghi Có của dòng chứng từ
	UPDATE t1
		SET DebitDeptCode = t2.DebitDeptCode, CreditDeptCode = t2.CreditDeptCode
		FROM #K_CtTmp t1
		INNER JOIN dbo.B30AccDocOther t2 ON t2.RowId = t1.RowId

	-- Chứng từ VP có bộ phận ghi Có khác bộ phận ghi Nợ = giá trị phân bổ,
	-- quy về bộ phận đứng ra chi (CreditDeptCode).
	UPDATE #K_CtTmp
		SET DeptCode = CreditDeptCode, IsPhanBo = 1
		WHERE DocCode = 'VP' AND CreditDeptCode <> DebitDeptCode

	SET @_Key = N''

	-- Tinh tong chi phi phat sinh trong ky
	IF OBJECT_ID(N'Tempdb..#tblKyNay') IS NOT NULL DROP TABLE #tblKyNay
	SELECT Account, CrspAccount, ExpenseCatgCode, TransCode,ProductCostId,CrspProductCostId,CrspCustomerCode,
			SUM(CASE WHEN DocDate >= @_DocDate1 THEN DebitAmount ELSE CAST(0 AS NUMERIC(18, 2)) END) AS DebitAmount,
			SUM(CASE WHEN DocDate >= @_DocDate1 THEN CreditAmount ELSE CAST(0 AS NUMERIC(18, 2)) END) AS CreditAmount,
			SUM(DebitAmount) AS AcumDebitAmount, SUM(CreditAmount) AS AcumCreditAmount, CustomerCode, DocDate, DeptCode,
			IsPhanBo
		INTO #tblKyNay
		FROM #K_CtTmp
		WHERE DocDate BETWEEN @_DocDate00 AND @_DocDate2
		GROUP BY Account, CrspAccount, ExpenseCatgCode, TransCode, ProductCostId, CrspProductCostId,CrspCustomerCode,CustomerCode, DocDate, DeptCode,
			IsPhanBo

	-- Ánh xạ DeptCode trên chứng từ -> DeptCode báo cáo (1 chứng từ chỉ thuộc 1 cột).
	-- Chọn phòng ban báo cáo có mã là tiền tố dài nhất của mã chứng từ.
	IF OBJECT_ID(N'Tempdb..#DeptMap') IS NOT NULL DROP TABLE #DeptMap
	CREATE TABLE #DeptMap (
		DeptCode NVARCHAR(64) COLLATE DATABASE_DEFAULT NOT NULL PRIMARY KEY,
		ReportDeptCode NVARCHAR(64) COLLATE DATABASE_DEFAULT NOT NULL);

	SET @_strExec =
		N'INSERT INTO #DeptMap (DeptCode, ReportDeptCode)' + NCHAR(13) +
		N'SELECT DeptCode, ReportDeptCode' + NCHAR(13) +
		N'	FROM (SELECT k.DeptCode, d.DeptCode AS ReportDeptCode,' + NCHAR(13) +
		N'				ROW_NUMBER() OVER (PARTITION BY k.DeptCode ORDER BY LEN(d.DeptCode) DESC) AS _RowNo' + NCHAR(13) +
		N'			FROM (SELECT DISTINCT DeptCode FROM #tblKyNay WHERE ISNULL(DeptCode, N'''') <> N'''') k' + NCHAR(13) +
		N'			INNER JOIN (SELECT DISTINCT DeptCode FROM ' + @_Kqt021 + N' WHERE ISNULL(DeptCode, N'''') <> N'''') d' + NCHAR(13) +
		N'				ON k.DeptCode LIKE REPLACE(REPLACE(d.DeptCode, N''['', N''[[]''), N''_'', N''[_]'') + N''%''' + NCHAR(13) +
		N'		) x' + NCHAR(13) +
		N'	WHERE _RowNo = 1'
	EXECUTE(@_strExec)

	-- Mỗi khoản mục level 9 chỉ lấy 1 dòng (bảng @_Kqt021 đang nhân bản theo phòng ban)
	IF OBJECT_ID(N'Tempdb..#KqtTmp') IS NOT NULL DROP TABLE #KqtTmp
	CREATE TABLE #KqtTmp (Id INT, Account NVARCHAR(128), CrspAccount nvarchar(128), ExcludedCrspAccount nvarchar(128),
					ExpenseCatgCode nvarchar(128), ItemType nvarchar(16),
					ProductCostId NVARCHAR(16));

	SET @_strExec = N'INSERT INTO #KqtTmp (Id, Account, CrspAccount, ExcludedCrspAccount, ExpenseCatgCode, ItemType, ProductCostId)' + NCHAR(13) +
					N'	SELECT Id, MAX(Account), MAX(CrspAccount), MAX(ExcludedCrspAccount), MAX(ExpenseCatgCode),
							   MAX(ItemType), MAX(ProductCostId)' + NCHAR(13) +
					N'		FROM ' + @_Kqt021 + N' WHERE ItemLevel = 9 AND Account <> N''''' + NCHAR(13) +
					N'		GROUP BY Id'
	EXECUTE(@_strExec)

	WHILE EXISTS (SELECT 1 FROM #KqtTmp)
	BEGIN
		SELECT TOP 1 @_Id = Id, @_CrspAccount = CrspAccount, @_ExcludedCrspAccount = ExcludedCrspAccount,
					@_ExpenseCatgCode = ExpenseCatgCode,
					@_ItemType = ItemType, @_strTmp = REPLACE(Account, N' ', N''),
					@_ProductCostIdTmp = ProductCostId
				FROM #KqtTmp
				ORDER BY Id

		DELETE FROM #KqtTmp WHERE Id = @_Id

		IF RIGHT(@_strTmp, 1) = N',' SET @_strTmp = LEFT(@_strTmp, LEN(@_strTmp) - 1)
		SET @_strTmp = N'(Account LIKE N''' + REPLACE(@_strTmp, N',', '%'') OR (Account LIKE N''') + N'%'')'

		SET @_Key = N'(' + @_strTmp + N')'

		IF @_CrspAccount <> N''
		BEGIN
			SET @_strTmp = REPLACE(@_CrspAccount, SPACE(1), SPACE(0))
			IF RIGHT(@_strTmp, 1) = N',' SET @_strTmp = LEFT(@_strTmp, LEN(@_strTmp) - 1)
			SET @_strTmp = N'(CrspAccount LIKE N''' + REPLACE(@_strTmp, N',', '%'') OR (CrspAccount LIKE N''') + N'%'')'

			SET @_Key = @_Key + N' AND (' + @_strTmp + N')'
		END

		IF @_ExcludedCrspAccount <> N''
		BEGIN
			SET @_strTmp = REPLACE(@_ExcludedCrspAccount, SPACE(1), SPACE(0))
			IF RIGHT(@_strTmp, 1) = N',' SET @_strTmp = LEFT(@_strTmp, LEN(@_strTmp) - 1)
			SET @_strTmp = N'(CrspAccount LIKE N''' + REPLACE(@_strTmp, N',', '%'') OR (CrspAccount LIKE N''') + N'%'')'

			SET @_Key = @_Key + N' AND NOT (' + @_strTmp + N')'
		END

		IF @_ExpenseCatgCode <> N''
		BEGIN
			SET @_strTmp = REPLACE(@_ExpenseCatgCode, SPACE(1), SPACE(0))
			IF RIGHT(@_strTmp, 1) = N',' SET @_strTmp = LEFT(@_strTmp, LEN(@_strTmp) - 1)
			SET @_strTmp = N'(ExpenseCatgCode LIKE N''' + REPLACE(@_strTmp, N',', '%'') OR (ExpenseCatgCode LIKE N''') + N'%'')'

			SET @_Key = @_Key + N' AND (' + @_strTmp + N')'
		END

		-- Chung
		IF @_ProductCostIdTmp <> ''
		BEGIN
		IF @_ItemType = 'PS_NO'
			SET @_Key = @_Key + N' AND (ProductCostId = ' + CHAR(39) + @_ProductCostIdTmp + CHAR(39) + ')'
		ELSE
			SET @_Key = @_Key + N' AND (CrspProductCostId = ' + CHAR(39) + @_ProductCostIdTmp + CHAR(39) + ')'
		END

		-- Cùng 1 biểu thức số tiền, tách làm 2 theo cờ IsPhanBo
		SET @_AmountCol = CASE @_ItemType
								WHEN N'NO'		THEN N'(k.DebitAmount - k.CreditAmount)'
								WHEN N'CO'		THEN N'(k.CreditAmount - k.DebitAmount)'
								WHEN N'PS_NO'	THEN N'k.DebitAmount'
								WHEN N'PS_CO'	THEN N'k.CreditAmount'
								ELSE NULL
							END

		IF @_AmountCol IS NULL
			SELECT @_AmountExpr = N'CAST(0 AS NUMERIC(18, 2))',
					@_AmountPbExpr = N'CAST(0 AS NUMERIC(18, 2))'
		ELSE
			SELECT @_AmountExpr = N'SUM(CASE WHEN k.IsPhanBo = 0 THEN ' + @_AmountCol + N' ELSE CAST(0 AS NUMERIC(18, 2)) END)',
					@_AmountPbExpr = N'SUM(CASE WHEN k.IsPhanBo = 1 THEN ' + @_AmountCol + N' ELSE CAST(0 AS NUMERIC(18, 2)) END)'

		-- 1 lần quét cho mọi phòng ban của khoản mục; phòng ban không có phát sinh = 0.
		-- Key_Ct không chứa điều kiện phòng ban (dùng cho link xem chi tiết cả dòng).
		SET @_strExec =
			N'UPDATE t' + NCHAR(13) +
			N'	SET ThisPeriod = ISNULL(s.Amount, 0), Amount_PhanBo = ISNULL(s.AmountPhanBo, 0), Key_Ct = @_Key' + NCHAR(13) +
			N'	FROM ' + @_Kqt021 + N' t' + NCHAR(13) +
			N'	LEFT JOIN (SELECT m.ReportDeptCode,' + NCHAR(13) +
			N'					' + @_AmountExpr + N' AS Amount,' + NCHAR(13) +
			N'					' + @_AmountPbExpr + N' AS AmountPhanBo' + NCHAR(13) +
			N'				FROM #tblKyNay k INNER JOIN #DeptMap m ON m.DeptCode = k.DeptCode' + NCHAR(13) +
			N'				WHERE ' + @_Key + NCHAR(13) +
			N'				GROUP BY m.ReportDeptCode) s ON s.ReportDeptCode = t.DeptCode' + NCHAR(13) +
			N'	WHERE t.Id = @_Id'

		EXECUTE sp_executesql @_strExec, N'@_Key NVARCHAR(4000), @_Id INT', @_Key, @_Id
	END

	DROP TABLE #KqtTmp
	DROP TABLE #DeptMap
	DROP TABLE #tblKyNay


	-- Chung: Cập nhật lại Linkcommand cho những
	UPDATE #Kqt021 SET Key_CT = Key_CT + ''

	-- Dòng subtotal (ItemLevel <> 9) được tính trong usp_Kqt_ThongKeChiPhiVPCTY_CCM sau khi dựng cột theo DeptCode.
END
GO
