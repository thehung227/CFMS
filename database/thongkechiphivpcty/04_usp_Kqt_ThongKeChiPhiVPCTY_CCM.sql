SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON	-- Bắt buộc: dùng FOR XML ... .value()
GO
-- ============================================
-- Description: Báo cáo lãi lỗ
-- 03/12/2011 ThắngĐQ: Cập nhật xử lý Hỗ trợ kê khai thuế: 3.0.1
-- 13/12/2011 ThắngĐQ: Thêm ngôn ngữ cho báo cáo
-- 14/09/2026: - Dựng cột động theo DeptCode: mỗi phòng ban active 1 cột (D_<DeptCode>),
--               ThisPeriod = tổng các phòng ban. Mỗi khoản mục còn 1 dòng.
--             - Ưu tiên tính dòng subtotal (ItemLevel <> 9) theo Formula, từ bậc sâu nhất lên (8 -> 7 -> 6),
--               cho từng cột phòng ban và cột tổng. Công thức phức tạp (* / ( ) =) dùng usp_sys_SumValue.
--             - Trả layout cột động: @_LAYOUT_XML (Bravo), @_LAYOUT_JSON + @_COLUMN_OUPUT (web).
-- 25/09/2026: - Mỗi phòng ban nay sinh 3 cột, gom thành 3 nhóm tiêu đề (header 2 tầng):
--                 D_<DeptCode> "Giá trị trực tiếp" = ThisPeriod  (IsPhanBo = 0)
--                 P_<DeptCode> "Giá trị phân bổ"   = Amount_PhanBo (IsPhanBo = 1)
--                 T_<DeptCode> "Tổng công ty"      = ThisPeriod + Amount_PhanBo
--               Row_0 = tên nhóm (UserData chung -> Bravo gộp tiêu đề), Row_1 = mã bộ phận.
--             - Chỉ dựng cột cho bộ phận có phát sinh trong kỳ (ThisPeriod / Amount_PhanBo <> 0);
--               bộ phận không có số liệu bị loại khỏi báo cáo, số cột thay đổi theo kỳ.
--             - Cột tổng toàn công ty: ThisPeriod (trực tiếp), Amount_PhanBo (phân bổ), TotalAmount (cộng).
--             - Bỏ lệnh debug "SELECT * FROM #tblKq / RETURN" sau khi gọi thủ tục tính.
-- ============================================
CREATE OR ALTER PROC dbo.usp_Kqt_ThongKeChiPhiVPCTY_CCM
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
	-- RowId / DocCode / Debit-CreditDeptCode / IsPhanBo: phục vụ tách giá trị trực tiếp - phân bổ
	-- trong usp_Kqt_ThongKeChiPhiVPCTY_TinhToan_CCM.
	IF Object_Id(N'Tempdb..#K_CtTmp') IS NOT NULL DROP TABLE #K_CtTmp
	SELECT TOP 0 DocDate, Account, CrspAccount, ExpenseCatgCode, TransCode,
			DebitAmount, OriginalDebitAmount, CreditAmount, OriginalCreditAmount,
			Amount, OriginalAmount, ProductCostId, ProductCostId AS CrspProductCostId,
			CustomerCode AS CrspCustomerCode, CustomerCode, CAST('' as NVARCHAR(192))  AS   BizDocId_C1, DeptCode,
			DocCode, RowId, Stt, CAST('' AS NVARCHAR(16)) AS DebitDeptCode, CAST('' AS NVARCHAR(16)) AS CreditDeptCode,
			CAST(0 AS TINYINT) AS IsPhanBo
		INTO #K_CtTmp
		FROM B00CtTmp
--		ORDER BY DocDate, Tk, Tk_Du

	-- Khoản mục x phòng ban: bảng làm việc để usp_Kqt_ThongKeChiPhiVPCTY_TinhToan_CCM tính số liệu level 9 theo DeptCode
	IF OBJECT_ID(N'Tempdb..#tblKq') IS NOT NULL DROP TABLE #tblKq
	SELECT t1.Id, t1.ExpenseCatgCode, t1.Description AS Name, t1.ThisPeriod,
		CAST(0 AS NUMERIC(18, 2)) AS Amount_PhanBo,
		t2.Name AS ProductName, t1.ProductCostId--, t2.ProductManager AS ProjectName
		, t1.BuiltinOrder, IIF(ISNULL(t2.Name,'') = '', t2.Code, t2.Name) AS ShortName
		, t1.ItemNo, t1._FormatStyleKey, t1.IsPrint, t1.Formula, t1.ItemLevel
		, CAST('' AS NVARCHAR(64)) AS ColumnCode, CAST('' AS NVARCHAR(4000)) AS Key_Ct
		, Account, ItemType, CrspAccount, ExcludedCrspAccount, t2.Code AS DeptCode, CAST('' AS NVARCHAR(3)) AS DocCode
	INTO #tblKq
	FROM #Kqt021 t1 CROSS JOIN dbo.B20Dept t2
	WHERE t2.IsActive = 1 AND t2.IsGroup = 0 --AND t2.SettlementDate IS NOT NULL

	EXECUTE usp_Kqt_ThongKeChiPhiVPCTY_TinhToan_CCM
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
			@_ColumnList NVARCHAR(MAX) = N'',		-- ,[D_BCHCT],...,[P_BCHCT],...,[T_BCHCT],...
			@_ColumnFieldList NVARCHAR(4000) = N'',	-- D_BCHCT,...,ThisPeriod,Amount_PhanBo,TotalAmount (cho usp_sys_SumValue)
			@_ColumnAdd NVARCHAR(MAX) = N'',		-- [D_BCHCT] NUMERIC(18, 2) NOT NULL DEFAULT 0,...
			@_ColumnFill NVARCHAR(MAX) = N'',		-- ,SUM(CASE WHEN DeptCode = N'BCHCT' THEN ... END) AS [D_BCHCT]
			@_ColumnSet NVARCHAR(MAX) = N'',		-- ,[D_BCHCT] = s.[D_BCHCT]
			@_ColumnSumChild NVARCHAR(MAX) = N''	-- ,SUM(m.Multiplier * ISNULL(c.[D_BCHCT], 0)) AS [D_BCHCT]

	------------------------------------------------------------------------------------
	-- 1. Danh sách cột động: (3 nhóm giá trị) x (phòng ban)
	------------------------------------------------------------------------------------
	-- Bộ phận không phát sinh giá trị nào (trực tiếp lẫn phân bổ) thì không dựng cột.
	-- Dùng ABS để bộ phận có số dương và âm triệt tiêu nhau vẫn được giữ lại.
	IF OBJECT_ID(N'Tempdb..#Dept') IS NOT NULL DROP TABLE #Dept
	SELECT DeptCode, DeptName, DeptKey,
			ROW_NUMBER() OVER (ORDER BY DeptCode) AS DeptOrder
	INTO #Dept
	FROM (SELECT DeptCode,
					MAX(ShortName) AS DeptName,
					CAST(REPLACE(REPLACE(REPLACE(REPLACE(RTRIM(DeptCode), N'-', N'_'), N' ', N'_'), N'.', N'_'), N'/', N'_') AS NVARCHAR(120)) AS DeptKey
				FROM #tblKq
				WHERE ItemLevel = 9
				GROUP BY DeptCode
				HAVING SUM(ABS(ISNULL(ThisPeriod, 0)) + ABS(ISNULL(Amount_PhanBo, 0))) <> 0) d

	IF OBJECT_ID(N'Tempdb..#ColumnDef') IS NOT NULL DROP TABLE #ColumnDef
	SELECT g.GroupOrder, g.GroupKey, g.GroupCaption,
			d.DeptCode, d.DeptName, d.DeptOrder,
			CAST(g.Prefix + d.DeptKey AS NVARCHAR(128)) AS ColumnCode,
			CAST(g.ValueExpr AS NVARCHAR(256)) AS ValueExpr,
			ROW_NUMBER() OVER (ORDER BY g.GroupOrder, d.DeptOrder) AS ColumnOrder
	INTO #ColumnDef
	FROM #Dept d
	CROSS JOIN (VALUES
			(1, N'GRP_TRUCTIEP', N'Giá trị trực tiếp', N'D_', N'ISNULL(ThisPeriod, 0)'),
			(2, N'GRP_PHANBO',   N'Giá trị phân bổ',   N'P_', N'ISNULL(Amount_PhanBo, 0)'),
			(3, N'GRP_TONGCTY',  N'Tổng công ty',      N'T_', N'ISNULL(ThisPeriod, 0) + ISNULL(Amount_PhanBo, 0)')
		) g (GroupOrder, GroupKey, GroupCaption, Prefix, ValueExpr)

	SELECT
		@_ColumnList = ISNULL((SELECT N',' + QUOTENAME(ColumnCode)
									FROM #ColumnDef ORDER BY ColumnOrder
									FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N''),
		@_ColumnAdd = ISNULL(STUFF((SELECT N',' + QUOTENAME(ColumnCode) + N' NUMERIC(18, 2) NOT NULL DEFAULT 0'
									FROM #ColumnDef ORDER BY ColumnOrder
									FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, N''), N''),
		@_ColumnFill = ISNULL((SELECT N',SUM(CASE WHEN DeptCode = N''' + REPLACE(DeptCode, N'''', N'''''') +
										N''' THEN ' + ValueExpr + N' ELSE 0 END) AS ' + QUOTENAME(ColumnCode)
									FROM #ColumnDef ORDER BY ColumnOrder
									FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N''),
		@_ColumnSet = ISNULL((SELECT N',' + QUOTENAME(ColumnCode) + N' = s.' + QUOTENAME(ColumnCode)
									FROM #ColumnDef ORDER BY ColumnOrder
									FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N''),
		@_ColumnSumChild = ISNULL((SELECT N',SUM(m.Multiplier * ISNULL(c.' + QUOTENAME(ColumnCode) + N', 0)) AS ' + QUOTENAME(ColumnCode)
									FROM #ColumnDef ORDER BY ColumnOrder
									FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N''),
		@_ColumnFieldList = ISNULL((SELECT ColumnCode + N','
									FROM #ColumnDef ORDER BY ColumnOrder
									FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N'') + N'ThisPeriod,Amount_PhanBo,TotalAmount'

	------------------------------------------------------------------------------------
	-- 2. Bảng kết quả: 1 dòng / khoản mục + cột phòng ban
	------------------------------------------------------------------------------------
	IF OBJECT_ID(N'Tempdb..#Result') IS NOT NULL DROP TABLE #Result
	SELECT t1.Id, t1.ItemNo, t1.Description AS Name, t1.ExpenseCatgCode, t1.BuiltinOrder, t1._FormatStyleKey,
			t1.IsPrint, t1.Formula, t1.ItemLevel, t1.Account, t1.ItemType, t1.CrspAccount, t1.ExcludedCrspAccount,
			t1.ProductCostId, CAST(N'' AS NVARCHAR(4000)) AS Key_Ct,
			CAST(0 AS NUMERIC(18, 2)) AS ThisPeriod,
			CAST(0 AS NUMERIC(18, 2)) AS Amount_PhanBo,
			CAST(0 AS NUMERIC(18, 2)) AS TotalAmount
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

	-- Dòng chi tiết (level 9): số liệu từng phòng ban + tổng toàn công ty
	SET @_StrExec =
		N'UPDATE r' + NCHAR(13) +
		N'	SET ThisPeriod = s.ThisPeriod, Amount_PhanBo = s.Amount_PhanBo, TotalAmount = s.TotalAmount' + @_ColumnSet + NCHAR(13) +
		N'	FROM #Result r' + NCHAR(13) +
		N'	INNER JOIN (SELECT Id, SUM(ISNULL(ThisPeriod, 0)) AS ThisPeriod,' + NCHAR(13) +
		N'						SUM(ISNULL(Amount_PhanBo, 0)) AS Amount_PhanBo,' + NCHAR(13) +
		N'						SUM(ISNULL(ThisPeriod, 0) + ISNULL(Amount_PhanBo, 0)) AS TotalAmount' + @_ColumnFill + NCHAR(13) +
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
				N'	SET ThisPeriod = s.ThisPeriod, Amount_PhanBo = s.Amount_PhanBo, TotalAmount = s.TotalAmount' + @_ColumnSet + NCHAR(13) +
				N'	FROM #Result p' + NCHAR(13) +
				N'	INNER JOIN (SELECT m.ParentItemNo, SUM(m.Multiplier * ISNULL(c.ThisPeriod, 0)) AS ThisPeriod,' + NCHAR(13) +
				N'						SUM(m.Multiplier * ISNULL(c.Amount_PhanBo, 0)) AS Amount_PhanBo,' + NCHAR(13) +
				N'						SUM(m.Multiplier * ISNULL(c.TotalAmount, 0)) AS TotalAmount' + @_ColumnSumChild + NCHAR(13) +
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
	-- 4. Layout cột động (header 2 tầng: nhóm giá trị / bộ phận)
	------------------------------------------------------------------------------------
	SET @_COLUMN_OUPUT = ISNULL(STUFF((SELECT N',' + ColumnCode
										FROM #ColumnDef ORDER BY ColumnOrder
										FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, N''), N'')

	-- Bravo desktop: Row_0 = nhóm (UserData giống nhau -> gộp tiêu đề), Row_1 = mã bộ phận
	SET @_LAYOUT_XML =
		N'<BravoLayout>' + NCHAR(13) + N'  <Cols>' +
		ISNULL((SELECT NCHAR(13) +
					N'<Column_' + ColumnCode + N'>' + NCHAR(13) +
					N'  <Name>' + ColumnCode + N'</Name>' + NCHAR(13) +
					N'  <Width>120</Width>' + NCHAR(13) +
					N'  <Style>TextAlign:RightTop;Format:"C";</Style>' + NCHAR(13) +
					N'  <Rows>' + NCHAR(13) +
					N'    <Row_0>' + NCHAR(13) +
					N'      <Caption><Vietnamese>' +
						REPLACE(REPLACE(REPLACE(GroupCaption, N'&', N'&amp;'), N'<', N'&lt;'), N'>', N'&gt;') +
						N'</Vietnamese></Caption>' + NCHAR(13) +
					N'      <Style>UserData:' + GroupKey + N';</Style>' + NCHAR(13) +
					N'    </Row_0>' + NCHAR(13) +
					N'    <Row_1>' + NCHAR(13) +
					N'      <Caption><Vietnamese>' +
						REPLACE(REPLACE(REPLACE(RTRIM(DeptCode), N'&', N'&amp;'), N'<', N'&lt;'), N'>', N'&gt;') +
						N'</Vietnamese></Caption>' + NCHAR(13) +
					N'      <Style>UserData:' + ColumnCode + N';</Style>' + NCHAR(13) +
					N'    </Row_1>' + NCHAR(13) +
					N'  </Rows>' + NCHAR(13) +
					N'</Column_' + ColumnCode + N'>'
				FROM #ColumnDef ORDER BY ColumnOrder
				FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N'') +
		NCHAR(13) + N'  </Cols>' + NCHAR(13) + N'</BravoLayout>'

	-- Web (base-reporter.readJson): 1 group header / nhóm giá trị + nhóm tổng toàn công ty
	IF OBJECT_ID(N'Tempdb..#GroupJson') IS NOT NULL DROP TABLE #GroupJson
	SELECT g.GroupOrder, g.GroupKey, g.GroupCaption, CAST(N'' AS NVARCHAR(MAX)) AS Json
	INTO #GroupJson
	FROM (SELECT DISTINCT GroupOrder, GroupKey, GroupCaption FROM #ColumnDef) g

	UPDATE gj
		SET Json = N'{"header": "' + STRING_ESCAPE(gj.GroupCaption, 'json') + N'", "columns": [' +
					ISNULL(STUFF((SELECT N',{"header": "' + STRING_ESCAPE(RTRIM(c.DeptCode), 'json') +
										N'", "binding": "' + c.ColumnCode +
										N'", "aggregate": "Sum", "align": "right", "width": 150}'
									FROM #ColumnDef c
									WHERE c.GroupKey = gj.GroupKey
									ORDER BY c.DeptOrder
									FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, N''), N'') + N']}'
	FROM #GroupJson gj

	DECLARE @_JsonGroups NVARCHAR(MAX) =
		ISNULL(STUFF((SELECT N',' + Json
						FROM #GroupJson ORDER BY GroupOrder
						FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, N''), N'')

	SET @_LAYOUT_JSON =
		N'[{"grdReport": [' +
		IIF(@_JsonGroups = N'', N'', @_JsonGroups + N', ') +
		N'{"header": "Tổng cộng", "columns": [' +
		N'{"header": "Trực tiếp", "binding": "ThisPeriod", "aggregate": "Sum", "align": "right", "width": 150},' +
		N'{"header": "Phân bổ", "binding": "Amount_PhanBo", "aggregate": "Sum", "align": "right", "width": 150},' +
		N'{"header": "Tổng", "binding": "TotalAmount", "aggregate": "Sum", "align": "right", "width": 150}]}]}]'

	------------------------------------------------------------------------------------
	-- 5. Kết quả
	------------------------------------------------------------------------------------
	SET @_StrExec =
		N'SELECT Id, ItemNo, Name AS Description, ExpenseCatgCode, BuiltinOrder, _FormatStyleKey, IsPrint, Formula, ItemLevel,' + NCHAR(13) +
		N'		Account, ItemType, CrspAccount, ExcludedCrspAccount, ProductCostId, Key_Ct' + @_ColumnList + N',' + NCHAR(13) +
		N'		ThisPeriod, Amount_PhanBo, TotalAmount,' + NCHAR(13) +
		N'		IIF(ItemLevel = 9 AND ISNULL(Key_Ct, N'''') <> N'''', @_LinkCommand + N''Other_Key1 = ('' + Key_Ct + N'')'', N'''') AS _LinkCommand,' + NCHAR(13) +
		N'		CAST(0 AS NUMERIC(18, 2)) AS PlanAmount, CAST(0 AS NUMERIC(18, 2)) AS DiffAmount' + NCHAR(13) +
		N'	FROM #Result' + NCHAR(13) +
		N'	ORDER BY ItemNo'
	EXECUTE sp_executesql @_StrExec, N'@_LinkCommand NVARCHAR(MAX)', @_LinkCommand

	RETURN
END
GO
