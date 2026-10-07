SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON	-- Bắt buộc: dùng FOR XML ... .value()
GO
-- ============================================================================
-- dbo.usp_Kqt_ThongKeCPKhoanMucCongTruong
-- Thống kê chi phí theo khoản mục, cột động theo công trường (ProductCostId).
--
-- Nguồn số liệu chi phí: sổ cái (vB30GeneralLedger, qua usp_B30SoCai_GetData)
--   - DocCode      = 'PK'             (@_DocCode, cho phép nhiều mã, ngăn cách dấu phẩy)
--   - Account      LIKE '621%'/'627%' (@_Account, ngăn cách dấu phẩy)
--   - BizDocId_C1  rỗng               (chỉ lấy phát sinh không gắn phiếu giao thầu / hợp đồng)
--
-- Nguồn số lượng nhân sự: usp_HRIS_ThongKeSoLuongNhanSuDuAn (@_IsDetail = 1), chốt tại
--   @_DocDateHR (mặc định = @_DocDate2). Ghép về công trường qua B20Product.Code.
--
-- Kết quả: 1 dòng / khoản mục
--   ExpenseCatgCode   Mã khoản mục
--   Name              Tên khoản mục
--   Mỗi công trường 3 cột động:
--     C_<ProductCostId> Số tiền
--     Q_<ProductCostId> Số người
--     A_<ProductCostId> Chi phí trung bình / người = Số tiền / Số người
--   Cột tổng: TotalAmount (Thực tế), TotalQuantity (Số người), TotalAvgAmount (TB/người)
--   Dòng đầu (ItemLevel = 0) là dòng TỔNG CỘNG.
--
-- Layout cột động: @_LAYOUT_XML (Bravo desktop, header 2 tầng: công trường / loại giá trị),
--                  @_LAYOUT_JSON + @_COLUMN_OUPUT (web).
--
-- 25/09/2026: - Bản đầu tiên. Mẫu theo usp_Kqt_ThongKeCPTheoKhoanMuc và
--               usp_Kqt_ThongKeChiPhiVPCTY_CCM: gom số liệu 1 lần ở sổ cái rồi dựng cột
--               bằng SUM(CASE ...), không quét lại dữ liệu theo từng khoản mục.
--             - Mỗi công trường sinh 3 cột (số tiền / số người / TB một người) và có bộ
--               cột tổng tương ứng. Số người là thuộc tính của công trường nên lặp lại
--               trên mọi dòng khoản mục (không cộng dồn theo dòng).
-- ============================================================================
CREATE OR ALTER PROC dbo.usp_Kqt_ThongKeCPKhoanMucCongTruong
	@_DocDate1 SMALLDATETIME			= '20260101',
	@_DocDate2 SMALLDATETIME			= '20261231',
	@_ForeignCurrencyOnly SMALLINT		= 1,
	@_nUserId INT						= 0,
	@_LangId INT						= 0,
	@_Ma_Dvcs NCHAR(3)					= N'N01',
	@_CurrencyCode0 NVARCHAR(3)			= N'VND',
	@_ProductCostId NVARCHAR(24)		= N'',			-- lọc 1 công trường; rỗng = tất cả
	@_ExpenseCatgCode NVARCHAR(24)		= N'',			-- lọc 1 khoản mục; rỗng = tất cả
	@_DocCode NVARCHAR(64)				= N'PK',		-- danh sách mã chứng từ, ngăn cách dấu phẩy
	@_Account NVARCHAR(256)				= N'621,627',	-- danh sách tiền tố tài khoản, ngăn cách dấu phẩy
	@_DocDateHR SMALLDATETIME			= NULL,			-- ngày chốt số lượng nhân sự; NULL = @_DocDate2
	@_LAYOUT_XML NVARCHAR(MAX)			= N'' OUTPUT,
	@_LAYOUT_JSON NVARCHAR(MAX)			= N'' OUTPUT,
	@_COLUMN_OUPUT NVARCHAR(4000)		= N'' OUTPUT
--WITH ENCRYPTION
AS
BEGIN
	SET NOCOUNT ON;

	SET @_Ma_Dvcs = RTRIM(@_Ma_Dvcs)
	IF @_DocDateHR IS NULL SET @_DocDateHR = @_DocDate2

	DECLARE @_Key NVARCHAR(MAX) = N'',			-- điều kiện lọc sổ cái (dùng lại cho _LinkCommand)
			@_Tmp NVARCHAR(MAX) = N'',
			@_StrExec NVARCHAR(MAX) = N''

	------------------------------------------------------------------------------------
	-- 1. Điều kiện lọc sổ cái
	------------------------------------------------------------------------------------
	-- Mã chứng từ: (DocCode IN (N'PK'))
	SET @_Tmp = ISNULL(STUFF((SELECT N',N''' + REPLACE(LTRIM(RTRIM(s.value)), N'''', N'''''') + N''''
								FROM STRING_SPLIT(ISNULL(@_DocCode, N''), N',') s
								WHERE LTRIM(RTRIM(s.value)) <> N''
								FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, N''), N'')
	IF @_Tmp <> N''
		SET @_Key = N'(DocCode IN (' + @_Tmp + N'))'

	-- Tài khoản: (Account LIKE N'621%' OR Account LIKE N'627%')
	SET @_Tmp = ISNULL(STUFF((SELECT N' OR Account LIKE N''' + REPLACE(LTRIM(RTRIM(s.value)), N'''', N'''''') + N'%'''
								FROM STRING_SPLIT(ISNULL(@_Account, N''), N',') s
								WHERE LTRIM(RTRIM(s.value)) <> N''
								FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 4, N''), N'')
	IF @_Tmp <> N''
		SET @_Key = @_Key + IIF(@_Key = N'', N'', N' AND ') + N'(' + @_Tmp + N')'

	-- Chỉ lấy phát sinh không gắn phiếu giao thầu / hợp đồng
	SET @_Key = @_Key + IIF(@_Key = N'', N'', N' AND ') + N'(ISNULL(BizDocId_C1, N'''') = N'''')'

	IF ISNULL(@_ProductCostId, N'') <> N''
		SET @_Key = @_Key + N' AND (ProductCostId = N''' + REPLACE(@_ProductCostId, N'''', N'''''') + N''')'

	IF ISNULL(@_ExpenseCatgCode, N'') <> N''
		SET @_Key = @_Key + N' AND (ExpenseCatgCode = N''' + REPLACE(@_ExpenseCatgCode, N'''', N'''''') + N''')'

	------------------------------------------------------------------------------------
	-- 2. Số liệu chi phí: gom sẵn theo (khoản mục x công trường) ngay tại sổ cái
	------------------------------------------------------------------------------------
	IF OBJECT_ID(N'Tempdb..#K_CtTmp') IS NOT NULL DROP TABLE #K_CtTmp
	SELECT TOP 0 ExpenseCatgCode, ProductCostId, DebitAmount, CreditAmount
		INTO #K_CtTmp
		FROM dbo.B00CtTmp

	EXECUTE usp_B30SoCai_GetData
			@_DocDate1		= @_DocDate1,
			@_DocDate2		= @_DocDate2,
			@_Key1			= @_Key,
			@_Key2			= N'',
			@_CtTmp			= N'#K_CtTmp',
			@_GroupByCols	= N'ExpenseCatgCode,ProductCostId',
			@_nUserId		= @_nUserId,
			@_LangId		= @_LangId,
			@_Ma_Dvcs		= @_Ma_Dvcs,
			@_CurrencyCode0	= @_CurrencyCode0

	-- Chi phí = phát sinh Nợ - phát sinh Có (bút toán điều chỉnh ghi Có được trừ ra)
	IF OBJECT_ID(N'Tempdb..#Data') IS NOT NULL DROP TABLE #Data
	SELECT CAST(RTRIM(ISNULL(ExpenseCatgCode, N'')) AS NVARCHAR(32)) AS ExpenseCatgCode,
			CAST(RTRIM(ISNULL(ProductCostId, N'')) AS NVARCHAR(24)) AS ProductCostId,
			CAST(SUM(ISNULL(DebitAmount, 0) - ISNULL(CreditAmount, 0)) AS NUMERIC(18, 2)) AS Amount
		INTO #Data
		FROM #K_CtTmp
		GROUP BY RTRIM(ISNULL(ExpenseCatgCode, N'')), RTRIM(ISNULL(ProductCostId, N''))

	------------------------------------------------------------------------------------
	-- 3. Số lượng nhân sự từng công trường (chốt tại @_DocDateHR)
	------------------------------------------------------------------------------------
	-- Gọi bản chi tiết (@_IsDetail = 1) vì bản tổng hợp trả về cột động theo nhóm nhân sự.
	IF OBJECT_ID(N'Tempdb..#HR') IS NOT NULL DROP TABLE #HR
	CREATE TABLE #HR
	(
		EmployeeGroupName NVARCHAR(512) NULL,
		EmployeeName NVARCHAR(512) NULL,
		ProjectManager NVARCHAR(512) NULL,
		ProductName NVARCHAR(512) NULL,
		ProductCode NVARCHAR(64) NULL,
		ProductCode2 NVARCHAR(64) NULL,
		Quantity INT NULL
	)

	INSERT INTO #HR (EmployeeGroupName, EmployeeName, ProjectManager, ProductName, ProductCode, ProductCode2, Quantity)
		EXECUTE dbo.usp_HRIS_ThongKeSoLuongNhanSuDuAn
				@_DocDate		= @_DocDateHR,
				@_ProductCostId	= @_ProductCostId,
				@_IsDetail		= 1

	IF OBJECT_ID(N'Tempdb..#Human') IS NOT NULL DROP TABLE #Human
	SELECT p.RowId AS ProductCostId, CAST(SUM(ISNULL(h.Quantity, 1)) AS INT) AS Quantity
		INTO #Human
		FROM #HR h INNER JOIN dbo.B20Product p ON p.Code = h.ProductCode AND p.ProductType = 1
		GROUP BY p.RowId

	------------------------------------------------------------------------------------
	-- 4. Danh sách cột động: mỗi công trường có phát sinh -> 3 cột (tiền / người / TB người)
	------------------------------------------------------------------------------------
	-- Dùng ABS để công trường có số dương và âm triệt tiêu nhau vẫn được giữ cột.
	IF OBJECT_ID(N'Tempdb..#Product') IS NOT NULL DROP TABLE #Product
	SELECT ProductCostId, ProductKey, ShortName, ProductName, Quantity,
			ROW_NUMBER() OVER (ORDER BY ShortName, ProductCostId) AS ProductOrder
		INTO #Product
		FROM (SELECT d.ProductCostId,
					CAST(REPLACE(REPLACE(REPLACE(REPLACE(
									IIF(d.ProductCostId = N'', N'KHAC', d.ProductCostId),
									N'-', N'_'), N' ', N'_'), N'.', N'_'), N'/', N'_') AS NVARCHAR(48)) AS ProductKey,
					CAST(COALESCE(NULLIF(RTRIM(p.ShortName), N''),
									NULLIF(RTRIM(p.Code2), N''),
									NULLIF(d.ProductCostId, N''),
									N'Không xác định') AS NVARCHAR(192)) AS ShortName,
					CAST(ISNULL(p.Name, N'') AS NVARCHAR(512)) AS ProductName,
					CAST(ISNULL(h.Quantity, 0) AS INT) AS Quantity
				FROM (SELECT ProductCostId
							FROM #Data
							GROUP BY ProductCostId
							HAVING SUM(ABS(Amount)) <> 0) d
				LEFT JOIN dbo.vB20Product p ON p.RowId = d.ProductCostId
				LEFT JOIN #Human h ON h.ProductCostId = d.ProductCostId) c

	IF OBJECT_ID(N'Tempdb..#ColumnDef') IS NOT NULL DROP TABLE #ColumnDef
	SELECT p.ProductCostId, p.ProductKey, p.ShortName, p.Quantity, p.ProductOrder,
			g.GroupOrder, g.GroupKey, g.GroupCaption,
			CAST(g.Prefix + p.ProductKey AS NVARCHAR(64)) AS ColumnCode,
			CAST(g.SqlType AS NVARCHAR(32)) AS SqlType,
			CAST(g.XmlFormat AS NVARCHAR(16)) AS XmlFormat,
			ROW_NUMBER() OVER (ORDER BY p.ProductOrder, g.GroupOrder) AS ColumnOrder
		INTO #ColumnDef
		FROM #Product p
		CROSS JOIN (VALUES
				(1, N'AMT', N'Số tiền',  N'C_', N'NUMERIC(18, 2)', N'C'),
				(2, N'QTY', N'Số người', N'Q_', N'INT',            N'N0'),
				(3, N'AVG', N'TB/người', N'A_', N'NUMERIC(18, 2)', N'C')
			) g (GroupOrder, GroupKey, GroupCaption, Prefix, SqlType, XmlFormat)

	DECLARE @_TotalQuantity INT = ISNULL((SELECT SUM(Quantity) FROM #Product), 0)

	DECLARE @_ColumnList NVARCHAR(MAX) = N'',	-- ,[C_PROD001810],[Q_PROD001810],[A_PROD001810],...
			@_ColumnAdd NVARCHAR(MAX) = N'',	-- [C_PROD001810] NUMERIC(18, 2) NOT NULL DEFAULT 0,...
			@_ColumnFill NVARCHAR(MAX) = N'',	-- giá trị cho dòng chi tiết
			@_ColumnSum NVARCHAR(MAX) = N'',	-- giá trị cho dòng TỔNG CỘNG
			@_ColumnAvgSet NVARCHAR(MAX) = N''	-- ,[A_x] = CASE WHEN [Q_x] = 0 THEN 0 ELSE [C_x] / [Q_x] END

	SELECT	@_ColumnList = ISNULL((SELECT N',' + QUOTENAME(ColumnCode)
										FROM #ColumnDef ORDER BY ColumnOrder
										FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N''),
			@_ColumnAdd = ISNULL(STUFF((SELECT N',' + QUOTENAME(ColumnCode) + N' ' + SqlType + N' NOT NULL DEFAULT 0'
										FROM #ColumnDef ORDER BY ColumnOrder
										FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, N''), N''),
			-- Số tiền: gom từ #Data. Số người: hằng số của công trường. TB/người: tính ở bước sau.
			@_ColumnFill = ISNULL((SELECT N',' +
										CASE GroupKey
											WHEN N'AMT' THEN N'ISNULL(SUM(CASE WHEN d.ProductCostId = N''' +
																REPLACE(ProductCostId, N'''', N'''''') +
																N''' THEN d.Amount ELSE 0 END), 0)'
											WHEN N'QTY' THEN N'CAST(' + CAST(Quantity AS NVARCHAR(16)) + N' AS INT)'
											ELSE N'CAST(0 AS NUMERIC(18, 2))'
										END
										FROM #ColumnDef ORDER BY ColumnOrder
										FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N''),
			@_ColumnSum = ISNULL((SELECT N',' +
										CASE GroupKey
											WHEN N'AMT' THEN N'ISNULL(SUM(' + QUOTENAME(ColumnCode) + N'), 0)'
											WHEN N'QTY' THEN N'CAST(' + CAST(Quantity AS NVARCHAR(16)) + N' AS INT)'
											ELSE N'CAST(0 AS NUMERIC(18, 2))'
										END
										FROM #ColumnDef ORDER BY ColumnOrder
										FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N''),
			@_ColumnAvgSet = ISNULL((SELECT N',' + QUOTENAME(ColumnCode) +
										N' = CASE WHEN ' + QUOTENAME(N'Q_' + ProductKey) + N' = 0 THEN 0' +
										N' ELSE CAST(' + QUOTENAME(N'C_' + ProductKey) + N' / ' + QUOTENAME(N'Q_' + ProductKey) +
										N' AS NUMERIC(18, 2)) END'
										FROM #ColumnDef WHERE GroupKey = N'AVG' ORDER BY ColumnOrder
										FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N'')

	------------------------------------------------------------------------------------
	-- 5. Bảng kết quả: 1 dòng / khoản mục + dòng TỔNG CỘNG
	------------------------------------------------------------------------------------
	IF OBJECT_ID(N'Tempdb..#Result') IS NOT NULL DROP TABLE #Result
	CREATE TABLE #Result
	(
		BuiltinOrder INT NOT NULL DEFAULT 0,
		ItemNo NVARCHAR(32) NOT NULL DEFAULT N'',
		ExpenseCatgCode NVARCHAR(32) NOT NULL DEFAULT N'',
		Name NVARCHAR(256) NOT NULL DEFAULT N'',
		ItemLevel TINYINT NOT NULL DEFAULT 9,
		IsPrint BIT NOT NULL DEFAULT 1,
		_FormatStyleKey NVARCHAR(64) NOT NULL DEFAULT N'',
		Key_Ct NVARCHAR(4000) NOT NULL DEFAULT N'',
		TotalAmount NUMERIC(18, 2) NOT NULL DEFAULT 0,
		TotalQuantity INT NOT NULL DEFAULT 0,
		TotalAvgAmount NUMERIC(18, 2) NOT NULL DEFAULT 0
	)

	IF @_ColumnAdd <> N''
	BEGIN
		SET @_StrExec = N'ALTER TABLE #Result ADD ' + @_ColumnAdd
		EXECUTE (@_StrExec)
	END

	-- Dòng chi tiết theo khoản mục
	SET @_StrExec =
		N'INSERT INTO #Result (BuiltinOrder, ItemNo, ExpenseCatgCode, Name, ItemLevel, IsPrint, _FormatStyleKey,' + NCHAR(13) +
		N'						TotalAmount, TotalQuantity' + @_ColumnList + N')' + NCHAR(13) +
		N'	SELECT 1, d.ExpenseCatgCode, d.ExpenseCatgCode,' + NCHAR(13) +
		N'			COALESCE(NULLIF(RTRIM(MAX(e.Name)), N''''), NULLIF(d.ExpenseCatgCode, N''''), N''(Không có khoản mục)''),' + NCHAR(13) +
		N'			9, 1, N'''', ISNULL(SUM(d.Amount), 0), ' + CAST(@_TotalQuantity AS NVARCHAR(16)) + @_ColumnFill + NCHAR(13) +
		N'		FROM #Data d LEFT JOIN dbo.B20ExpenseCatg e ON e.Code = d.ExpenseCatgCode' + NCHAR(13) +
		N'		GROUP BY d.ExpenseCatgCode' + NCHAR(13) +
		N'		HAVING SUM(ABS(d.Amount)) <> 0'
	EXECUTE (@_StrExec)

	-- Dòng TỔNG CỘNG (số người không cộng dồn theo dòng: giữ nguyên số người của công trường)
	SET @_StrExec =
		N'INSERT INTO #Result (BuiltinOrder, ItemNo, ExpenseCatgCode, Name, ItemLevel, IsPrint, _FormatStyleKey,' + NCHAR(13) +
		N'						TotalAmount, TotalQuantity' + @_ColumnList + N')' + NCHAR(13) +
		N'	SELECT 0, N'''', N'''', N''TỔNG CỘNG'', 0, 1, N''BOLDGCOLOR'',' + NCHAR(13) +
		N'			ISNULL(SUM(TotalAmount), 0), ' + CAST(@_TotalQuantity AS NVARCHAR(16)) + @_ColumnSum + NCHAR(13) +
		N'		FROM #Result WHERE ItemLevel = 9'
	EXECUTE (@_StrExec)

	-- Chi phí trung bình / người của từng công trường và của toàn bộ
	IF @_ColumnAvgSet <> N''
	BEGIN
		SET @_StrExec = N'UPDATE #Result SET ' + STUFF(@_ColumnAvgSet, 1, 1, N'')
		EXECUTE (@_StrExec)
	END

	UPDATE #Result
		SET TotalAvgAmount = CASE WHEN TotalQuantity = 0 THEN 0
									ELSE CAST(TotalAmount / TotalQuantity AS NUMERIC(18, 2)) END

	-- Điều kiện để xem chi tiết chứng từ của từng khoản mục (drill-down REP09_BKCT)
	UPDATE #Result
		SET Key_Ct = @_Key + N' AND (ExpenseCatgCode = N''' + REPLACE(ExpenseCatgCode, N'''', N'''''') + N''')'
		WHERE ItemLevel = 9

	------------------------------------------------------------------------------------
	-- 6. Layout cột động (header 2 tầng: công trường / loại giá trị)
	------------------------------------------------------------------------------------
	SET @_COLUMN_OUPUT = ISNULL(STUFF((SELECT N',' + ColumnCode
										FROM #ColumnDef ORDER BY ColumnOrder
										FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, N''), N'')

	-- Bravo desktop: Row_0 = tên công trường (UserData chung -> Bravo gộp tiêu đề), Row_1 = loại giá trị
	SET @_LAYOUT_XML =
		N'<BravoLayout>' + NCHAR(13) + N'  <Cols>' +
		ISNULL((SELECT NCHAR(13) +
					N'<Column_' + ColumnCode + N'>' + NCHAR(13) +
					N'  <Name>' + ColumnCode + N'</Name>' + NCHAR(13) +
					N'  <Width>120</Width>' + NCHAR(13) +
					N'  <Style>TextAlign:RightTop;Format:"' + XmlFormat + N'";</Style>' + NCHAR(13) +
					N'  <Rows>' + NCHAR(13) +
					N'    <Row_0>' + NCHAR(13) +
					N'      <Caption><Vietnamese>' +
						REPLACE(REPLACE(REPLACE(ShortName, N'&', N'&amp;'), N'<', N'&lt;'), N'>', N'&gt;') +
						N'</Vietnamese></Caption>' + NCHAR(13) +
					N'      <Style>UserData:P_' + ProductKey + N';</Style>' + NCHAR(13) +
					N'    </Row_0>' + NCHAR(13) +
					N'    <Row_1>' + NCHAR(13) +
					N'      <Caption><Vietnamese>' + GroupCaption + N'</Vietnamese></Caption>' + NCHAR(13) +
					N'      <Style>UserData:' + ColumnCode + N';</Style>' + NCHAR(13) +
					N'    </Row_1>' + NCHAR(13) +
					N'  </Rows>' + NCHAR(13) +
					N'</Column_' + ColumnCode + N'>'
				FROM #ColumnDef ORDER BY ColumnOrder
				FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N'') +
		NCHAR(13) + N'  </Cols>' + NCHAR(13) + N'</BravoLayout>'

	-- Web (base-reporter.readJson): mỗi công trường 1 nhóm tiêu đề gồm 3 cột
	-- Chỉ cột số tiền được cộng tổng; số người và TB/người lặp theo dòng nên không aggregate.
	IF OBJECT_ID(N'Tempdb..#GroupJson') IS NOT NULL DROP TABLE #GroupJson
	SELECT p.ProductOrder, p.ProductKey, p.ShortName, CAST(N'' AS NVARCHAR(MAX)) AS Json
		INTO #GroupJson
		FROM #Product p

	UPDATE gj
		SET Json = N'{"header": "' + STRING_ESCAPE(gj.ShortName, 'json') + N'", "columns": [' +
					ISNULL(STUFF((SELECT N',{"header": "' + STRING_ESCAPE(c.GroupCaption, 'json') +
										N'", "binding": "' + c.ColumnCode + N'"' +
										IIF(c.GroupKey = N'AMT', N', "aggregate": "Sum"', N'') +
										N', "align": "right", "width": 130}'
									FROM #ColumnDef c
									WHERE c.ProductKey = gj.ProductKey
									ORDER BY c.GroupOrder
									FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, N''), N'') + N']}'
		FROM #GroupJson gj

	DECLARE @_JsonGroups NVARCHAR(MAX) =
		ISNULL(STUFF((SELECT N',' + Json
						FROM #GroupJson ORDER BY ProductOrder
						FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, N''), N'')

	SET @_LAYOUT_JSON =
		N'[{"grdReport": [' +
		IIF(@_JsonGroups = N'', N'', @_JsonGroups + N', ') +
		N'{"header": "Tổng cộng", "columns": [' +
		N'{"header": "Thực tế", "binding": "TotalAmount", "aggregate": "Sum", "align": "right", "width": 150},' +
		N'{"header": "Số người", "binding": "TotalQuantity", "align": "right", "width": 110},' +
		N'{"header": "TB/người", "binding": "TotalAvgAmount", "align": "right", "width": 150}]}]}]'

	------------------------------------------------------------------------------------
	-- 7. Kết quả
	------------------------------------------------------------------------------------
	DECLARE @_LinkCommand NVARCHAR(MAX) =
		N'REP09_BKCT DocDate1={VAR=DocDate1};DocDate2={VAR=DocDate2};ExpenseCatgCode={EXPR=ExpenseCatgCode};'

	SET @_StrExec =
		N'SELECT BuiltinOrder, ItemNo, ExpenseCatgCode, Name, Name AS Description, ItemLevel, IsPrint, _FormatStyleKey,' + NCHAR(13) +
		N'		Key_Ct' + @_ColumnList + N', TotalAmount, TotalQuantity, TotalAvgAmount,' + NCHAR(13) +
		N'		IIF(ItemLevel = 9, @_LinkCommand + N''Other_Key1 = ('' + Key_Ct + N'')'', N'''') AS _LinkCommand' + NCHAR(13) +
		N'	FROM #Result' + NCHAR(13) +
		N'	ORDER BY BuiltinOrder, ExpenseCatgCode'
	EXECUTE sp_executesql @_StrExec, N'@_LinkCommand NVARCHAR(MAX)', @_LinkCommand

	RETURN
END
GO
