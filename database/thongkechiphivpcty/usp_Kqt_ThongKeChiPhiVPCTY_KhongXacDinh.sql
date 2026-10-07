-- =====================================================================================
-- 05/10/2026: Báo cáo thống kê chi phí VP Công ty - thêm cột "Không xác định"
--   Chứng từ chưa có bộ phận (DeptCode rỗng/NULL) hoặc DeptCode không khớp phòng ban active nào
--   trước đây bị loại bỏ (INNER JOIN #DeptMap) => thiếu cả ở cột Tổng cộng.
--   Nay gom vào cột ảo DeptCode = N'_KXD' (ColumnCode D__KXD), luôn nằm cuối danh sách cột.
-- Chạy lần lượt 2 lệnh ALTER bên dưới (TinhToan trước).
-- =====================================================================================

-- ============================================
-- 1) usp_Kqt_ThongKeChiPhiVPCTY_TinhToan
-- ============================================
ALTER PROC dbo.usp_Kqt_ThongKeChiPhiVPCTY_TinhToan
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
-- 05/10/2026: Chứng từ chưa có bộ phận / bộ phận không khớp phòng ban báo cáo -> gán về N'_KXD' (Không xác định)
--             thay vì bị loại bỏ.
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
			@_AmountExpr NVARCHAR(128)

	-- Phòng ban ảo nhận chứng từ chưa có bộ phận (khớp với usp_Kqt_ThongKeChiPhiVPCTY)
	DECLARE @_UnknownDeptCode NVARCHAR(64) = N'_KXD'

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
		@_Field_GroupBy = N'DocDate,Account,CrspAccount,ExpenseCatgCode,TransCode,ProductCostId,CrspProductCostId,CrspCustomerCode,DeptCode',
		@_Field_Sum = N'DebitAmount,CreditAmount'

	SET @_Key = N''

	-- Tinh tong chi phi phat sinh trong ky
	IF OBJECT_ID(N'Tempdb..#tblKyNay') IS NOT NULL DROP TABLE #tblKyNay
	SELECT Account, CrspAccount, ExpenseCatgCode, TransCode,ProductCostId,CrspProductCostId,CrspCustomerCode,
			SUM(CASE WHEN DocDate >= @_DocDate1 THEN DebitAmount ELSE CAST(0 AS NUMERIC(18, 2)) END) AS DebitAmount,
			SUM(CASE WHEN DocDate >= @_DocDate1 THEN CreditAmount ELSE CAST(0 AS NUMERIC(18, 2)) END) AS CreditAmount,
			SUM(DebitAmount) AS AcumDebitAmount, SUM(CreditAmount) AS AcumCreditAmount, CustomerCode, DocDate, DeptCode
		INTO #tblKyNay
		FROM #K_CtTmp
		WHERE DocDate BETWEEN @_DocDate00 AND @_DocDate2
		GROUP BY Account, CrspAccount, ExpenseCatgCode, TransCode, ProductCostId, CrspProductCostId,CrspCustomerCode,CustomerCode, DocDate, DeptCode

	-- Ánh xạ DeptCode trên chứng từ -> DeptCode báo cáo (1 chứng từ chỉ thuộc 1 cột).
	-- Chọn phòng ban báo cáo có mã là tiền tố dài nhất của mã chứng từ.
	-- Chứng từ không có trong #DeptMap (DeptCode rỗng hoặc không khớp) -> @_UnknownDeptCode khi tổng hợp.
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
		N'			INNER JOIN (SELECT DISTINCT DeptCode FROM ' + @_Kqt021 + N' WHERE ISNULL(DeptCode, N'''') <> N''''' +
						N' AND DeptCode <> @_UnknownDeptCode) d' + NCHAR(13) +
		N'				ON k.DeptCode LIKE REPLACE(REPLACE(d.DeptCode, N''['', N''[[]''), N''_'', N''[_]'') + N''%''' + NCHAR(13) +
		N'		) x' + NCHAR(13) +
		N'	WHERE _RowNo = 1'
	EXECUTE sp_executesql @_strExec, N'@_UnknownDeptCode NVARCHAR(64)', @_UnknownDeptCode

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

		SET @_AmountExpr = CASE @_ItemType
								WHEN N'NO'		THEN N'SUM(DebitAmount - CreditAmount)'
								WHEN N'CO'		THEN N'SUM(CreditAmount - DebitAmount)'
								WHEN N'PS_NO'	THEN N'SUM(DebitAmount)'
								WHEN N'PS_CO'	THEN N'SUM(CreditAmount)'
								ELSE N'CAST(0 AS NUMERIC(18, 2))'
							END

		-- 1 lần quét cho mọi phòng ban của khoản mục; phòng ban không có phát sinh = 0.
		-- Chứng từ không ánh xạ được phòng ban -> @_UnknownDeptCode (cột Không xác định).
		-- Key_Ct không chứa điều kiện phòng ban (dùng cho link xem chi tiết cả dòng).
		SET @_strExec =
			N'UPDATE t' + NCHAR(13) +
			N'	SET ThisPeriod = ISNULL(s.Amount, 0), Key_Ct = @_Key' + NCHAR(13) +
			N'	FROM ' + @_Kqt021 + N' t' + NCHAR(13) +
			N'	LEFT JOIN (SELECT ISNULL(m.ReportDeptCode, @_UnknownDeptCode) AS ReportDeptCode, ' + @_AmountExpr + N' AS Amount' + NCHAR(13) +
			N'				FROM #tblKyNay k LEFT JOIN #DeptMap m ON m.DeptCode = k.DeptCode' + NCHAR(13) +
			N'				WHERE ' + @_Key + NCHAR(13) +
			N'				GROUP BY ISNULL(m.ReportDeptCode, @_UnknownDeptCode)) s ON s.ReportDeptCode = t.DeptCode' + NCHAR(13) +
			N'	WHERE t.Id = @_Id'

		EXECUTE sp_executesql @_strExec, N'@_Key NVARCHAR(4000), @_Id INT, @_UnknownDeptCode NVARCHAR(64)',
				@_Key, @_Id, @_UnknownDeptCode
	END

	DROP TABLE #KqtTmp
	DROP TABLE #DeptMap
	DROP TABLE #tblKyNay


	-- Chung: Cập nhật lại Linkcommand cho những
	UPDATE #Kqt021 SET Key_CT = Key_CT + ''

	-- Dòng subtotal (ItemLevel <> 9) được tính trong usp_Kqt_ThongKeChiPhiVPCTY sau khi dựng cột theo DeptCode.
END
GO

-- ============================================
-- 2) usp_Kqt_ThongKeChiPhiVPCTY
-- ============================================
-- ============================================
-- Description: Báo cáo lãi lỗ
-- 03/12/2011 ThắngĐQ: Cập nhật xử lý Hỗ trợ kê khai thuế: 3.0.1
-- 13/12/2011 ThắngĐQ: Thêm ngôn ngữ cho báo cáo
-- 14/09/2026: - Dựng cột động theo DeptCode: mỗi phòng ban active 1 cột (D_<DeptCode>),
--               ThisPeriod = tổng các phòng ban. Mỗi khoản mục còn 1 dòng.
--             - Ưu tiên tính dòng subtotal (ItemLevel <> 9) theo Formula, từ bậc sâu nhất lên (8 -> 7 -> 6),
--               cho từng cột phòng ban và cột tổng. Công thức phức tạp (* / ( ) =) dùng usp_sys_SumValue.
--             - Trả layout cột động: @_LAYOUT_XML (Bravo), @_LAYOUT_JSON + @_COLUMN_OUPUT (web).
-- 05/10/2026: Thêm cột "Không xác định" (DeptCode N'_KXD' -> D__KXD, luôn ở cuối) cho chứng từ chưa có bộ phận.
-- ============================================
ALTER PROC dbo.usp_Kqt_ThongKeChiPhiVPCTY
	@_DocDate1 SMALLDATETIME				= '20250101',
	@_DocDate2 SMALLDATETIME				= '20250131',
	@_ForeignCurrencyOnly SMALLINT			= 1,
	@_nUserId AS INT						= 0,
	@_LangId INT							= 0,
	@_Ma_Dvcs NCHAR(3)						= N'N01',
	@_CurrencyCode0 NVARCHAR(3)				= N'VND',
	@_TableTmp  NVARCHAR(64) = '',
	@_Kd_Cp_Tam NCHAR(1)					= N'K',
	@_DefinitionTableName  NVARCHAR(32)		= N'B10CPKM',
	@_ViewOnWeb BIT							= 0, -- thêm ViewOnWeb loại bỏ ngoặc
	@_HTKK_Exp		TINYINT					= 0,			-- 1: thì tạo, 0-không tạo: 03/12/2011 ThắngĐQ: Cập nhật xử lý Hỗ trợ kê khai thuế: 3.0.1
	@_File_XML		NVARCHAR(MAX)			= '' OUTPUT,		-- Chuỗi XML kết xuất
	@_LAYOUT_XML NVARCHAR(MAX)				= N'' OUTPUT,
	@_Filename_XML  NVARCHAR(254)			= N'' OUTPUT,
	@_LAYOUT_JSON NVARCHAR(MAX)		= N'' OUTPUT,
	@_COLUMN_OUPUT NVARCHAR(4000)	= N'' OUTPUT
--WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	--IF @_LAYOUT_XML = @_DefinitionTableName GOTO _LAYOUT_XML_KQT

	SET @_Ma_Dvcs = RTRIM(@_Ma_Dvcs)

	-- Phòng ban ảo nhận chứng từ chưa có bộ phận (khớp với usp_Kqt_ThongKeChiPhiVPCTY_TinhToan)
	DECLARE @_UnknownDeptCode NVARCHAR(64) = N'_KXD'

	DECLARE @_Kqt NVARCHAR(64)
	SET @_Kqt = @_DefinitionTableName

	IF Object_Id(@_Kqt) IS NULL RETURN

	-- Tao bang temp
	IF Object_Id(N'Tempdb..#Kqt021') IS NOT NULL DROP TABLE #Kqt021
	CREATE TABLE #Kqt021 (Id INT DEFAULT 0)

	EXECUTE usp_sys_CreateTable '#Kqt021', @_Kqt

	ALTER TABLE #Kqt021 ADD Key_CT NVARCHAR(1000)

	DECLARE @_Where_TableSource NVARCHAR(1000)

	SET @_Where_TableSource = 'BranchCode = ' + CHAR(39) + @_Ma_Dvcs + CHAR(39)
	-- Append so lieu tu bang table
	EXECUTE usp_sys_Append @_Kqt, '#Kqt021', @_Where_TableSource

	ALTER TABLE #Kqt021 ADD CrspProductCostId NVARCHAR(16) NOT NULL DEFAULT ''

	-- Tao bang chung tu Tmp
	IF Object_Id(N'Tempdb..#K_CtTmp') IS NOT NULL DROP TABLE #K_CtTmp
	SELECT TOP 0 DocDate, Account, CrspAccount, ExpenseCatgCode, TransCode,
			DebitAmount, OriginalDebitAmount, CreditAmount, OriginalCreditAmount,
			Amount, OriginalAmount, ProductCostId, ProductCostId AS CrspProductCostId,
			CustomerCode AS CrspCustomerCode, CustomerCode, CAST('' as NVARCHAR(192))  AS   BizDocId_C1, DeptCode,
			DocCode, RowId, Stt
		INTO #K_CtTmp
		FROM B00CtTmp
--		ORDER BY DocDate, Tk, Tk_Du

	-- Khoản mục x phòng ban: bảng làm việc để usp_Kqt_ThongKeChiPhiVPCTY_TinhToan tính số liệu level 9 theo DeptCode
	-- Thêm phòng ban ảo @_UnknownDeptCode = "Không xác định" cho chứng từ chưa có bộ phận.
	IF OBJECT_ID(N'Tempdb..#tblKq') IS NOT NULL DROP TABLE #tblKq
	SELECT t1.Id, t1.ExpenseCatgCode, t1.Description AS Name, t1.ThisPeriod,
		t2.Name AS ProductName, t1.ProductCostId--, t2.ProductManager AS ProjectName
		, t1.BuiltinOrder, IIF(ISNULL(t2.Name,'') = '', t2.Code, t2.Name) AS ShortName
		, t1.ItemNo, t1._FormatStyleKey, t1.IsPrint, t1.Formula, t1.ItemLevel
		, CAST('' AS NVARCHAR(64)) AS ColumnCode, CAST('' AS NVARCHAR(4000)) AS Key_Ct
		, Account, ItemType, CrspAccount, ExcludedCrspAccount, t2.Code AS DeptCode, CAST('' AS NVARCHAR(3)) AS DocCode
	INTO #tblKq
	FROM #Kqt021 t1
	CROSS JOIN (SELECT Code, Name FROM dbo.B20Dept
				WHERE IsActive = 1 AND IsGroup = 0 --AND SettlementDate IS NOT NULL
				UNION ALL
				SELECT @_UnknownDeptCode, N'Không xác định') t2

	--UPDATE B20Product
	--SET OrgStructId = t2.Id
	--FROM B20Product pro INNER JOIN HRIS.HRIS_DB.dbo.D03_OrgStructure t1 ON pro.ProjectCode = t1.ProjectType
	--				INNER JOIN HRIS.HRIS_DB.dbo.D03_Project t2 ON t1.Id  = t2.OrgStructureID
	--WHERE ISNULL(pro.OrgStructId,'') = '' AND ISNULL(t1.ProjectType,'') <> ''

	--UPDATE dbo.B20Product
	--SET IsHris = IIF(CAST(t3.Id AS VARCHAR(50)) IS NULL, 0, 1)
	--FROM dbo.B20Product t1 LEFT JOIN HRIS.HRIS_DB.dbo.D03_Project t3 ON t1.OrgStructId = CAST(t3.Id AS VARCHAR(50))
	--	WHERE t3.Status ='Doing'

	EXECUTE usp_Kqt_ThongKeChiPhiVPCTY_TinhToan
			@_DocDate1	= @_DocDate1,
			@_DocDate2	= @_DocDate2,
			@_Kqt021	= N'#tblKq',
			@_ForeignCurrencyOnly	= @_ForeignCurrencyOnly,
			@_LangId	= @_LangId,
			@_nUserId	= @_nUserId,
			@_Ma_Dvcs	= @_Ma_Dvcs,
			@_CurrencyCode0	= @_CurrencyCode0,
			@_Kd_Cp_Tam = @_Kd_Cp_Tam

	DECLARE @_LinkCommand NVARCHAR(MAX) = ''

	SET @_LinkCommand =
				N'REP09_BKCT DocDate1={VAR=DocDate1};DocDate2={VAR=DocDate2};ExpenseCatgCode={EXPR=ExpenseCatgCode};'

	DECLARE @_StrExec NVARCHAR(MAX) = N'',
			@_ColumnList NVARCHAR(MAX) = N'',		-- ,[D_BCHCT],[D_BHSSE],...
			@_ColumnFieldList NVARCHAR(4000) = N'',	-- D_BCHCT,D_BHSSE,...,ThisPeriod (cho usp_sys_SumValue)
			@_ColumnAdd NVARCHAR(MAX) = N'',		-- [D_BCHCT] NUMERIC(18, 2) NOT NULL DEFAULT 0,...
			@_ColumnFill NVARCHAR(MAX) = N'',		-- ,SUM(CASE WHEN DeptCode = N'BCHCT' THEN ... END) AS [D_BCHCT]
			@_ColumnSet NVARCHAR(MAX) = N'',		-- ,[D_BCHCT] = s.[D_BCHCT]
			@_ColumnSumChild NVARCHAR(MAX) = N''	-- ,SUM(m.Multiplier * ISNULL(c.[D_BCHCT], 0)) AS [D_BCHCT]

	------------------------------------------------------------------------------------
	-- 1. Danh sách cột động theo DeptCode (cột Không xác định luôn ở cuối)
	------------------------------------------------------------------------------------
	IF OBJECT_ID(N'Tempdb..#Column') IS NOT NULL DROP TABLE #Column
	SELECT DeptCode,
			MAX(ShortName) AS DeptName,
			CAST(N'D_' + REPLACE(REPLACE(REPLACE(REPLACE(RTRIM(DeptCode), N'-', N'_'), N' ', N'_'), N'.', N'_'), N'/', N'_') AS NVARCHAR(128)) AS ColumnCode,
			ROW_NUMBER() OVER (ORDER BY IIF(DeptCode = @_UnknownDeptCode, 1, 0), DeptCode) AS ColumnOrder
	INTO #Column
	FROM #tblKq
	GROUP BY DeptCode

	SELECT
		@_ColumnList = ISNULL((SELECT N',' + QUOTENAME(ColumnCode)
									FROM #Column ORDER BY ColumnOrder
									FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N''),
		@_ColumnAdd = ISNULL(STUFF((SELECT N',' + QUOTENAME(ColumnCode) + N' NUMERIC(18, 2) NOT NULL DEFAULT 0'
									FROM #Column ORDER BY ColumnOrder
									FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, N''), N''),
		@_ColumnFill = ISNULL((SELECT N',SUM(CASE WHEN DeptCode = N''' + REPLACE(DeptCode, N'''', N'''''') +
										N''' THEN ISNULL(ThisPeriod, 0) ELSE 0 END) AS ' + QUOTENAME(ColumnCode)
									FROM #Column ORDER BY ColumnOrder
									FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N''),
		@_ColumnSet = ISNULL((SELECT N',' + QUOTENAME(ColumnCode) + N' = s.' + QUOTENAME(ColumnCode)
									FROM #Column ORDER BY ColumnOrder
									FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N''),
		@_ColumnSumChild = ISNULL((SELECT N',SUM(m.Multiplier * ISNULL(c.' + QUOTENAME(ColumnCode) + N', 0)) AS ' + QUOTENAME(ColumnCode)
									FROM #Column ORDER BY ColumnOrder
									FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N''),
		@_ColumnFieldList = ISNULL((SELECT ColumnCode + N','
									FROM #Column ORDER BY ColumnOrder
									FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N'') + N'ThisPeriod'

	------------------------------------------------------------------------------------
	-- 2. Bảng kết quả: 1 dòng / khoản mục + cột phòng ban
	------------------------------------------------------------------------------------
	IF OBJECT_ID(N'Tempdb..#Result') IS NOT NULL DROP TABLE #Result
	SELECT t1.Id, t1.ItemNo, t1.Description AS Name, t1.ExpenseCatgCode, t1.BuiltinOrder, t1._FormatStyleKey,
			t1.IsPrint, t1.Formula, t1.ItemLevel, t1.Account, t1.ItemType, t1.CrspAccount, t1.ExcludedCrspAccount,
			t1.ProductCostId, CAST(N'' AS NVARCHAR(4000)) AS Key_Ct, CAST(0 AS NUMERIC(18, 2)) AS ThisPeriod
	INTO #Result
	FROM #Kqt021 t1

	UPDATE r
		SET Key_Ct = k.Key_Ct
	FROM #Result r
	INNER JOIN (SELECT Id, MAX(Key_Ct) AS Key_Ct FROM #tblKq WHERE ItemLevel = 9 GROUP BY Id) k ON k.Id = r.Id

	IF @_ColumnAdd <> N''
	BEGIN
		SET @_StrExec = N'ALTER TABLE #Result ADD ' + @_ColumnAdd
		EXECUTE (@_StrExec)
	END

	-- Dòng chi tiết (level 9): số liệu từng phòng ban + tổng
	SET @_StrExec =
		N'UPDATE r' + NCHAR(13) +
		N'	SET ThisPeriod = s.ThisPeriod' + @_ColumnSet + NCHAR(13) +
		N'	FROM #Result r' + NCHAR(13) +
		N'	INNER JOIN (SELECT Id, SUM(ISNULL(ThisPeriod, 0)) AS ThisPeriod' + @_ColumnFill + NCHAR(13) +
		N'				FROM #tblKq WHERE ItemLevel = 9 GROUP BY Id) s ON s.Id = r.Id' + NCHAR(13) +
		N'	WHERE r.ItemLevel = 9'
	EXECUTE (@_StrExec)

	------------------------------------------------------------------------------------
	-- 3. Ưu tiên tính dòng subtotal (ItemLevel <> 9) theo Formula, từ bậc sâu nhất lên
	------------------------------------------------------------------------------------
	-- Tách công thức: "A.01+A.02-A.03" -> (A, A.01, +1), (A, A.02, +1), (A, A.03, -1)
	IF OBJECT_ID(N'Tempdb..#FormulaMap') IS NOT NULL DROP TABLE #FormulaMap
	SELECT p.ItemNo AS ParentItemNo, p.ItemLevel AS ParentLevel,
			CAST(REPLACE(LTRIM(RTRIM(f.value)), N'-', N'') AS NVARCHAR(128)) AS ChildItemNo,
			CASE WHEN LEFT(LTRIM(f.value), 1) = N'-' THEN -1 ELSE 1 END AS Multiplier
	INTO #FormulaMap
	FROM #Result p
	CROSS APPLY STRING_SPLIT(REPLACE(REPLACE(p.Formula, N' ', N''), N'-', N'+-'), N'+') f
	WHERE p.ItemLevel <> 9 AND ISNULL(p.Formula, N'') <> N'' AND LTRIM(RTRIM(f.value)) <> N''

	-- Chỉ tính set-based khi mọi thành phần là ItemNo có thật, thuộc bậc sâu hơn dòng cha và chỉ có phép +/-
	DECLARE @_IsSimpleFormula BIT = 1
	IF EXISTS (SELECT 1
				FROM #FormulaMap m
				LEFT JOIN #Result c ON c.ItemNo = m.ChildItemNo
				WHERE c.Id IS NULL OR c.ItemLevel <= m.ParentLevel OR m.ChildItemNo LIKE N'%[*/()=<>]%')
		SET @_IsSimpleFormula = 0

	IF @_IsSimpleFormula = 1
	BEGIN
		DECLARE @_Level INT = (SELECT MAX(ParentLevel) FROM #FormulaMap)

		WHILE @_Level IS NOT NULL
		BEGIN
			-- Dòng con thuộc bậc sâu hơn đã được tính ở vòng trước (hoặc là level 9)
			SET @_StrExec =
				N'UPDATE p' + NCHAR(13) +
				N'	SET ThisPeriod = s.ThisPeriod' + @_ColumnSet + NCHAR(13) +
				N'	FROM #Result p' + NCHAR(13) +
				N'	INNER JOIN (SELECT m.ParentItemNo, SUM(m.Multiplier * ISNULL(c.ThisPeriod, 0)) AS ThisPeriod' + @_ColumnSumChild + NCHAR(13) +
				N'				FROM #FormulaMap m INNER JOIN #Result c ON c.ItemNo = m.ChildItemNo' + NCHAR(13) +
				N'				WHERE m.ParentLevel = @_Level' + NCHAR(13) +
				N'				GROUP BY m.ParentItemNo) s ON s.ParentItemNo = p.ItemNo' + NCHAR(13) +
				N'	WHERE p.ItemLevel = @_Level'
			EXECUTE sp_executesql @_StrExec, N'@_Level INT', @_Level

			SET @_Level = (SELECT MAX(ParentLevel) FROM #FormulaMap WHERE ParentLevel < @_Level)
		END
	END
	ELSE
	BEGIN
		-- Công thức phức tạp: dùng thủ tục tính tổng chuẩn trên bảng đã dựng cột (ItemNo là duy nhất)
		EXECUTE usp_sys_SumValue
				@_Table = N'#Result',
				@_FieldList = @_ColumnFieldList,
				@_FieldKey = N'ItemNo',
				@_FieldCal = N'Formula',
				@_FieldBac = N'ItemLevel',
				@_FieldIn_Ck = N'IsPrint',
				@_ResetFormula = 0
	END

	UPDATE #Result
	SET ItemNo = ''
	WHERE ItemNo = 'Z'

	------------------------------------------------------------------------------------
	-- 4. Layout cột động
	------------------------------------------------------------------------------------
	SET @_COLUMN_OUPUT = ISNULL(STUFF((SELECT N',' + ColumnCode
										FROM #Column ORDER BY ColumnOrder
										FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, N''), N'')

	-- Bravo desktop
	SET @_LAYOUT_XML =
		N'<BravoLayout>' + NCHAR(13) + N'  <Cols>' +
		ISNULL((SELECT NCHAR(13) +
					N'<Column_' + ColumnCode + N'>' + NCHAR(13) +
					N'<Name>' + ColumnCode + N'</Name>' +
					N'<Rows>
				<Row_0>
					<Caption>
						<Vietnamese>' + REPLACE(REPLACE(REPLACE(DeptName, N'&', N'&amp;'), N'<', N'&lt;'), N'>', N'&gt;') + N'</Vietnamese>
					</Caption>
					<Style>UserData:'+ColumnCode+N';</Style>
				</Row_0>
				<Row_1>

					<Style>UserData:'+ColumnCode+N';</Style>
				</Row_1>
				</Rows>
				<Width>120</Width>' + NCHAR(13) +
					N'<Style>TextAlign:RightTop;Format:"C";</Style>' + NCHAR(13) +
					N'</Column_' + ColumnCode + N'>'
				FROM #Column ORDER BY ColumnOrder
				FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N'') +
		NCHAR(13) + N'  </Cols>' + NCHAR(13) + N'</BravoLayout>'

	-- Web (base-reporter.readJson)
	SET @_LAYOUT_JSON =
		N'[{"grdReport": [{"header": "Chi phí theo phòng ban", "columns": [' +
		ISNULL(STUFF((SELECT N',{"header": "' + STRING_ESCAPE(DeptName, 'json') + N'", "binding": "' + ColumnCode +
							N'", "aggregate": "Sum", "align": "right", "width": 150}'
						FROM #Column ORDER BY ColumnOrder
						FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, N''), N'') +
		N']}, {"header": "Tổng cộng", "columns": [{"header": "Tổng cộng", "binding": "ThisPeriod", "aggregate": "Sum", "align": "right", "width": 150}]}]}]'

	------------------------------------------------------------------------------------
	-- 5. Kết quả
	------------------------------------------------------------------------------------
	SET @_StrExec =
		N'SELECT Id, ItemNo, Name AS Description, ExpenseCatgCode, BuiltinOrder, _FormatStyleKey, IsPrint, Formula, ItemLevel,' + NCHAR(13) +
		N'		Account, ItemType, CrspAccount, ExcludedCrspAccount, ProductCostId, Key_Ct' + @_ColumnList + N', ThisPeriod,' + NCHAR(13) +
		N'		IIF(ItemLevel = 9 AND ISNULL(Key_Ct, N'''') <> N'''', @_LinkCommand + N''Other_Key1 = ('' + Key_Ct + N'')'', N'''') AS _LinkCommand,' + NCHAR(13) +
		N'		CAST(0 AS NUMERIC(18, 2)) AS PlanAmount, CAST(0 AS NUMERIC(18, 2)) AS DiffAmount' + NCHAR(13) +
		N'	FROM #Result' + NCHAR(13) +
		N'	ORDER BY ItemNo'
	EXECUTE sp_executesql @_StrExec, N'@_LinkCommand NVARCHAR(MAX)', @_LinkCommand

	RETURN
END
GO
