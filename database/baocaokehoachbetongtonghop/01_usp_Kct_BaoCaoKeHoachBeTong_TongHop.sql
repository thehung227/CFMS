SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON	-- Bắt buộc: dùng FOR XML PATH ... .value()
GO
-- ============================================
-- Description: THỐNG KÊ SẢN LƯỢNG BÊ TÔNG KẾ HOẠCH - TỔNG HỢP ALL DA
--              (mẫu "Copy of TONG HOP_Rev06.xlsx" - sheet TỔNG HỢP ALL DA)
--
-- Nguồn dữ liệu:
--   - Kế hoạch bê tông (module concretebudget): B30Budget DocCode = 'H9', BudgetTypeCode = '6'
--     (DocNo dạng D.25.026-01/KHBT/002). Mỗi gói thầu lấy 1 phiếu mới nhất (BudgetDate <= @_DocDate)
--     ĐÃ QUA CHT = đã gửi duyệt, không hủy, hoàn thành bước duyệt đầu tiên
--     (mọi dòng của ApproveGroup nhỏ nhất có ApproveStatus = '1'; bước 1 của quy trình P-261 là CB-012 CHT XD).
--   - Dòng BOQ bê tông: B30BudgetDetail (ItemGroupCode = 'BETONG'), mác = ProductSizeName,
--     độ sụt = ItemSpeciesName, đơn giá BĐ chưa VAT = UnitCostBD, % hao hụt cho phép = ConcerlossRate.
--   - Khối lượng theo tháng: B30ConcreteBudget (DocCode 'Z1', ParentBizDocId = B30BudgetDetail.Id)
--     + B30ConcreteBudgetDetail (Description = năm 'yyyy', Quantity01..Quantity12 = KL tháng 1..12).
--     Một dòng BOQ có thể có nhiều phiếu Z1 (mở nút "..." nhiều lần) -> lấy phiếu mới nhất CÓ dòng chi tiết;
--     trong phiếu, mỗi năm bị trùng thì lấy dòng mới nhất (Id lớn nhất).
--   - Cột "Năm" (Description) trên lưới chi tiết tháng KHÔNG bắt buộc nên có dòng bỏ trống:
--     những dòng này được suy năm = YEAR(B30Budget.BudgetDate) của phiếu kế hoạch và bật cờ IsThieuNam = 1
--     (dòng dự án / miền / tổng có cờ = 1 nếu chứa ít nhất 1 số liệu bị suy năm -> client tô màu để QS sửa lại kế hoạch).
--   - Miền = B20Product.TerritoryCode (MN/MB/MT, tên lấy B20Territory); tên ngắn DA = B20Product.ShortName;
--     "tên ngắn PKT" = B20Product.Code2 (VD B5GIALAM, BLANCA-CT-GD1).
--   - Nhân sự dự án: B20ProductHuman theo PositionCode - GĐĐH CB-077, GĐDA CB-002/CB-083,
--     CHT CB-012/CB-015, PTDA XD (tạm lấy QS-XD chính) CB-112.
--
-- Kết quả: 2 result set, cột SINH ĐỘNG theo dữ liệu thật (dynamic pivot). Giá trị = KL x UnitCostBD
-- (đơn giá BĐ, chưa VAT); khối lượng và giá trị luôn chạy cùng lúc, không phải chọn.
--
--   OUTPUT 1 - BẢNG TỔNG HỢP (phần đầu sheet Excel): 1 dòng / miền, có dòng TỔNG 3 MIỀN
--     Cột cố định: _Stt, RowLevel (0 = tổng, 1 = miền), Mien, _FormatStyleKey
--     Cột động   : TONG_KL, TONG_GT, rồi mỗi năm N<yyyy>_KL, N<yyyy>_GT, N<yyyy>_TBKL, N<yyyy>_TBGT
--     TB/tháng = tổng của năm / số tháng CÓ SỐ LIỆU của chính dòng đó trong năm đó
--     (khối TỔNG CỘNG không có TB/tháng, giống mẫu Excel).
--
--   OUTPUT 2 - BẢNG CHI TIẾT theo dự án:
--     Cột cố định: _Stt, RowLevel, RowName, TerritoryName, ShortName, ProductName, ShortNamePKT,
--                  ProductSizeName, GDDH, GDDA, CHT, PTDA_XD, IsThieuNam, _FormatStyleKey
--     Cột động   : 2 khối SONG SONG như Excel - khối lượng (m3) trước, rồi giá trị (VNĐ):
--                  KL_TONG, KL_NAM_2026, KL_T01_2026 ... KL_NAM_2027 ...
--                  GT_TONG, GT_NAM_2026, GT_T01_2026 ... GT_NAM_2027 ...
--     Dòng (RowLevel): 0 = TỔNG 3 MIỀN, 1 = miền, 2 = dự án, 3 = mác bê tông (khi @_ChiTietMac = 1)
--
-- Layout lưới cho app nội bộ: @_LAYOUT_XML OUTPUT (<BravoLayout>)
--   - Lưới chính  = bảng tổng hợp, tiêu đề 2 dòng (TỔNG CỘNG / NĂM yyyy -> chỉ tiêu)
--   - <SubReports><grdReport1> = bảng chi tiết, tiêu đề 3 dòng
--     (khối KL/GT -> TỔNG / NĂM yyyy -> Cả năm / Tháng n)
--   Format N2 cho khối lượng, N0 cho giá trị; zSumCols của từng lưới (TB/tháng không cộng dồn).
--   Dòng tổng / miền in đậm bằng cột _FormatStyleKey (BOLDYCOLOR / BOLDGCOLOR), app tự áp style.
--
-- DECLARE @_Xml NVARCHAR(MAX)
-- EXEC dbo.usp_Kct_BaoCaoKeHoachBeTong_TongHop @_DocDate = '20260924', @_LoaiBaoCao = 1,
--		@_LAYOUT_XML = @_Xml OUTPUT
-- SELECT CAST(@_Xml AS XML)
-- EXEC dbo.usp_Kct_BaoCaoKeHoachBeTong_TongHop @_DocDate = '20260924', @_LoaiBaoCao = 2, @_ChiTietMac = 1
--
-- 24/09/2026: Tạo mới
-- 24/09/2026: Thêm @_LAYOUT_XML (layout cột động cho app nội bộ) và cột _FormatStyleKey
-- 24/09/2026: Bỏ @_LoaiSoLieu - dựng cùng lúc 2 khối cột Khối lượng (m3) và Giá trị (VNĐ) như mẫu Excel
-- ============================================
CREATE OR ALTER PROC dbo.usp_Kct_BaoCaoKeHoachBeTong_TongHop
	@_DocDate SMALLDATETIME			= NULL,		-- Ngày báo cáo, NULL = hôm nay
	@_LoaiBaoCao TINYINT			= 1,		-- 1: Toàn bộ (chạy all các tháng), 2: Còn lại (chỉ tháng > tháng báo cáo)
	@_ChiTietMac BIT				= 0,		-- 1: thêm dòng chi tiết theo mác bê tông dưới từng dự án
	@_GomHaoHut BIT					= 0,		-- 0: chưa gồm hao hụt (theo mẫu), 1: gồm hao hụt = KL x (1 + ConcerlossRate)
	@_TerritoryCode NVARCHAR(256)	= N'',		-- Lọc miền (MN,MB,MT - nhiều mã cách nhau dấu phẩy), rỗng = tất cả
	@_ProductCostId NVARCHAR(4000)	= N'',		-- Lọc gói thầu (nhiều mã cách nhau dấu phẩy), rỗng = tất cả
	@_GDDH NVARCHAR(4000)			= N'',		-- Lọc theo mã nhân viên GĐĐH (B20Employee.Code), rỗng = tất cả
	@_GDDA NVARCHAR(4000)			= N'',		-- Lọc theo mã nhân viên GĐDA, rỗng = tất cả
	@_nUserId INT					= 0,
	@_LangId INT					= 0,
	@_Ma_Dvcs NCHAR(3)				= N'N01',
	@_DocDateStr VARCHAR(10)		= '' OUTPUT,
	@_LAYOUT_XML NVARCHAR(MAX)		= N'' OUTPUT		-- Layout lưới cột động cho app nội bộ (<BravoLayout>)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT	@_DocDate = ISNULL(@_DocDate, CAST(GETDATE() AS DATE)),
			@_LoaiBaoCao = ISNULL(@_LoaiBaoCao, 1),
			@_ChiTietMac = ISNULL(@_ChiTietMac, 0),
			@_GomHaoHut = ISNULL(@_GomHaoHut, 0),
			@_TerritoryCode = LTRIM(RTRIM(ISNULL(@_TerritoryCode, N''))),
			@_ProductCostId = LTRIM(RTRIM(ISNULL(@_ProductCostId, N''))),
			@_GDDH = LTRIM(RTRIM(ISNULL(@_GDDH, N''))),
			@_GDDA = LTRIM(RTRIM(ISNULL(@_GDDA, N''))),
			@_Ma_Dvcs = RTRIM(@_Ma_Dvcs)

	SET @_DocDateStr = CONVERT(VARCHAR(10), @_DocDate, 103)

	DECLARE @_NamThangBC INT = YEAR(@_DocDate) * 100 + MONTH(@_DocDate)		-- Mốc cho loại báo cáo "Còn lại"

	-- Vị trí nhân sự dự án (SortNo: ưu tiên vị trí XD trước ME khi 1 nhóm có nhiều vị trí)
	DECLARE @_ViTri TABLE (Nhom VARCHAR(16), PositionCode NVARCHAR(16), SortNo TINYINT)

	INSERT INTO @_ViTri (Nhom, PositionCode, SortNo)
	VALUES	('GDDH',	N'CB-077', 1),	-- GĐĐH/GĐK/GĐTC/NS TGD UQ
			('GDDA',	N'CB-002', 1),	-- Giám đốc dự án/ Người được UQ
			('GDDA',	N'CB-083', 2),	-- Giám đốc Dự án-MEP/ Người được UQ
			('CHT',		N'CB-012', 1),	-- Chỉ huy trưởng XD
			('CHT',		N'CB-015', 2),	-- Chỉ huy trưởng ME
			('PTDA_XD',	N'CB-112', 1)	-- QS-XD (Chính) - tạm dùng cho cột "PTDA XD" của mẫu Excel

	-- Phân quyền: admin xem tất cả, còn lại chỉ các gói thầu nhân viên tham gia
	DECLARE @_Ma_CbNv NVARCHAR(16) = N'',
			@_IsAdmin BIT = 1

	IF ISNULL(@_nUserId, 0) > 0
	BEGIN
		SET @_IsAdmin = 0

		SELECT	@_Ma_CbNv = ISNULL(u.Ma_CbNv, N''),
				@_IsAdmin = IIF(ISNULL(u.IsAdmin, 0) = 1 OR ISNULL(u.IsSystemAdmin, 0) = 1
								OR EXISTS (SELECT 1 FROM dbo.vB00UserRole r WHERE r.UserId = u.Id AND r.RoleId = 1), 1, 0)
		FROM dbo.B00UserList u
		WHERE u.Id = @_nUserId
	END

	-- 1. Gói thầu + miền + tên dự án
	IF OBJECT_ID('Tempdb..#GoiThau') IS NOT NULL DROP TABLE #GoiThau
	SELECT	p.RowId AS ProductCostId,
			mien.TerritoryCode,
			mien.TerritoryName,
			mien.SortNo AS SortTerritory,
			IIF(RTRIM(p.ShortName) = N'', RTRIM(p.Name), RTRIM(p.ShortName)) AS ShortName,
			RTRIM(p.Name) AS ProductName,
			RTRIM(p.Code2) AS ShortNamePKT
	INTO #GoiThau
	FROM dbo.B20Product p
		 CROSS APPLY (SELECT RTRIM(p.TerritoryCode) AS Ma) mc
		 LEFT OUTER JOIN dbo.B20Territory t ON mc.Ma = t.Code
		 CROSS APPLY (SELECT IIF(mc.Ma IN ('MN', 'MB', 'MT'), mc.Ma, N'#KHAC') AS TerritoryCode,	-- Mã lạ / rỗng gom về 1 nhóm
							 IIF(mc.Ma IN ('MN', 'MB', 'MT'), UPPER(RTRIM(t.Name)), N'KHÔNG XÁC ĐỊNH MIỀN') AS TerritoryName,
							 CASE mc.Ma WHEN 'MN' THEN 1 WHEN 'MB' THEN 2 WHEN 'MT' THEN 3 ELSE 9 END AS SortNo) mien
	WHERE p.IsGroup = 0
		  AND p.IsActive = 1
		  AND p.IsTest = 0
		  AND p.ProductType IN (1, 3)
		  AND (@_ProductCostId = N'' OR p.RowId IN (SELECT LTRIM(RTRIM(value)) FROM STRING_SPLIT(@_ProductCostId, ',')))
		  AND (@_TerritoryCode = N'' OR mc.Ma IN (SELECT LTRIM(RTRIM(value)) FROM STRING_SPLIT(@_TerritoryCode, ',')))
		  AND (@_IsAdmin = 1 OR p.RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien(@_Ma_CbNv)))

	-- 2. Nhân sự dự án: mỗi nhóm vị trí lấy 1 người (ưu tiên vị trí XD, rồi ngày hiệu lực mới nhất <= ngày báo cáo)
	IF OBJECT_ID('Tempdb..#NhanSu') IS NOT NULL DROP TABLE #NhanSu
	SELECT	gt.ProductCostId,
			MAX(IIF(nhom.Nhom = 'GDDH',		ns.TenNhanSu, NULL)) AS GDDH,
			MAX(IIF(nhom.Nhom = 'GDDA',		ns.TenNhanSu, NULL)) AS GDDA,
			MAX(IIF(nhom.Nhom = 'CHT',		ns.TenNhanSu, NULL)) AS CHT,
			MAX(IIF(nhom.Nhom = 'PTDA_XD',	ns.TenNhanSu, NULL)) AS PTDA_XD,
			MAX(IIF(nhom.Nhom = 'GDDH',		ns.MaNhanSu, NULL)) AS MaGDDH,
			MAX(IIF(nhom.Nhom = 'GDDA',		ns.MaNhanSu, NULL)) AS MaGDDA
	INTO #NhanSu
	FROM #GoiThau gt
		 CROSS JOIN (SELECT DISTINCT Nhom FROM @_ViTri) nhom
		 OUTER APPLY (SELECT TOP 1 RTRIM(e.Name) AS TenNhanSu, RTRIM(ph.EmployeeCode) AS MaNhanSu
					  FROM dbo.B20ProductHuman ph
						   INNER JOIN @_ViTri vt ON ph.PositionCode = vt.PositionCode
						   INNER JOIN dbo.B20Employee e ON ph.EmployeeCode = e.Code
					  WHERE ph.ProductCostId = gt.ProductCostId
							AND vt.Nhom = nhom.Nhom
							AND ph.IsActive = 1
							AND (ph.ApplyDate IS NULL OR ph.ApplyDate <= @_DocDate)
					  ORDER BY vt.SortNo, ISNULL(ph.ApplyDate, '19000101') DESC, ph.Id DESC) ns
	GROUP BY gt.ProductCostId

	-- Lọc theo GĐĐH / GĐDA (mã nhân viên)
	IF @_GDDH <> N'' OR @_GDDA <> N''
		DELETE gt
		FROM #GoiThau gt
			 LEFT OUTER JOIN #NhanSu ns ON gt.ProductCostId = ns.ProductCostId
		WHERE (@_GDDH <> N'' AND ISNULL(ns.MaGDDH, N'') NOT IN (SELECT LTRIM(RTRIM(value)) FROM STRING_SPLIT(@_GDDH, ',')))
			  OR (@_GDDA <> N'' AND ISNULL(ns.MaGDDA, N'') NOT IN (SELECT LTRIM(RTRIM(value)) FROM STRING_SPLIT(@_GDDA, ',')))

	-- 3. Kế hoạch bê tông mới nhất đã qua CHT của từng gói thầu
	IF OBJECT_ID('Tempdb..#KeHoach') IS NOT NULL DROP TABLE #KeHoach
	;WITH Temp AS
	(
		SELECT	bud.Stt, bud.ProductCostId, RTRIM(bud.DocNo) AS DocNo, bud.BudgetDate,
				ROW_NUMBER() OVER (PARTITION BY bud.ProductCostId ORDER BY bud.BudgetDate DESC, bud.DocNo DESC, bud.Id DESC) AS _Rn
		FROM dbo.B30Budget bud
			 INNER JOIN #GoiThau gt ON bud.ProductCostId = gt.ProductCostId
			 CROSS APPLY (SELECT COUNT(*) AS SoDong,
								 SUM(IIF(a.ApproveStatus = '1', 1, 0)) AS SoDaDuyet
						  FROM dbo.B30BizDocApprove a
						  WHERE a.BizDocId = bud.Stt
								AND a.IsActive = 1
								AND a.ApproveGroup = (SELECT MIN(a2.ApproveGroup)
													  FROM dbo.B30BizDocApprove a2
													  WHERE a2.BizDocId = bud.Stt AND a2.IsActive = 1)) buoc1
		WHERE bud.DocCode = 'H9'
			  AND bud.BudgetTypeCode = '6'
			  AND bud.IsActive = 1
			  AND bud.BranchCode = @_Ma_Dvcs
			  AND bud.BudgetDate <= @_DocDate
			  AND bud.ApproveSend = 1
			  AND bud.ClosedApprove = 0
			  AND buoc1.SoDong > 0
			  AND buoc1.SoDaDuyet = buoc1.SoDong
	)
	SELECT Stt, ProductCostId, DocNo, BudgetDate
	INTO #KeHoach
	FROM Temp
	WHERE _Rn = 1

	-- 4. Dòng BOQ bê tông + phiếu chi tiết tháng (Z1) mới nhất của dòng đó
	IF OBJECT_ID('Tempdb..#Dong') IS NOT NULL DROP TABLE #Dong
	SELECT	kh.ProductCostId,
			dt.Id AS BudgetDetailId,
			RTRIM(dt.ProductSizeName) AS ProductSizeName,
			dt.UnitCostBD,
			dt.ConcerlossRate,
			YEAR(kh.BudgetDate) AS NamMacDinh,		-- Dùng khi dòng chi tiết tháng bỏ trống cột Năm
			cb.BizDocId AS BizDocId_Z1
	INTO #Dong
	FROM #KeHoach kh
		 INNER JOIN dbo.B30BudgetDetail dt ON kh.Stt = dt.Stt
		 OUTER APPLY (SELECT TOP 1 c.BizDocId
					  FROM dbo.B30ConcreteBudget c
					  WHERE c.ParentBizDocId = CAST(dt.Id AS VARCHAR(16))
							AND c.IsActive = 1
							AND EXISTS (SELECT 1 FROM dbo.B30ConcreteBudgetDetail d
										WHERE d.BizDocId = c.BizDocId AND d.IsActive = 1)
					  ORDER BY c.Id DESC) cb
	WHERE dt.IsActive = 1
		  AND dt.IsGroup = 0
		  AND dt.IsTitleRow = 0
		  AND dt.ItemGroupCode = 'BETONG'
		  AND cb.BizDocId IS NOT NULL

	-- 5. Số liệu theo từng tháng (bung Quantity01..Quantity12 thành dòng)
	IF OBJECT_ID('Tempdb..#Fact') IS NOT NULL DROP TABLE #Fact
	;WITH Nam AS
	(
		-- Cột "Năm" bỏ trống (hoặc không phải năm hợp lệ) -> suy từ ngày phiếu kế hoạch, bật cờ IsThieuNam
		SELECT	g.ProductCostId, g.BudgetDetailId, g.ProductSizeName, g.UnitCostBD, g.ConcerlossRate,
				nam.YearNo, nam.IsThieuNam, cd.Id AS ChiTietId,
				cd.Quantity01, cd.Quantity02, cd.Quantity03, cd.Quantity04, cd.Quantity05, cd.Quantity06,
				cd.Quantity07, cd.Quantity08, cd.Quantity09, cd.Quantity10, cd.Quantity11, cd.Quantity12
		FROM #Dong g
			 INNER JOIN dbo.B30ConcreteBudgetDetail cd ON g.BizDocId_Z1 = cd.BizDocId
			 CROSS APPLY (SELECT IIF(LEN(RTRIM(cd.Description)) = 4 AND ISNUMERIC(RTRIM(cd.Description)) = 1, 1, 0) AS CoNam) kt
			 CROSS APPLY (SELECT IIF(kt.CoNam = 1, TRY_CAST(RTRIM(cd.Description) AS INT), g.NamMacDinh) AS YearNo,
								 CAST(1 - kt.CoNam AS TINYINT) AS IsThieuNam) nam
		WHERE cd.IsActive = 1
	),
	ChiTiet AS
	(
		-- Cùng 1 dòng BOQ + cùng năm (kể cả năm đã suy) có thể bị nhập trùng -> lấy 1 dòng:
		-- ưu tiên dòng CÓ khối lượng (thực tế có phiếu tạo sau nhưng để trống 12 tháng), rồi mới đến dòng mới nhất
		SELECT	n.*,
				ROW_NUMBER() OVER (PARTITION BY n.BudgetDetailId, n.YearNo
								   ORDER BY IIF(tong.TongKL <> 0, 0, 1), n.ChiTietId DESC) AS _Rn
		FROM Nam n
			 CROSS APPLY (SELECT ISNULL(n.Quantity01, 0) + ISNULL(n.Quantity02, 0) + ISNULL(n.Quantity03, 0) + ISNULL(n.Quantity04, 0)
								+ ISNULL(n.Quantity05, 0) + ISNULL(n.Quantity06, 0) + ISNULL(n.Quantity07, 0) + ISNULL(n.Quantity08, 0)
								+ ISNULL(n.Quantity09, 0) + ISNULL(n.Quantity10, 0) + ISNULL(n.Quantity11, 0) + ISNULL(n.Quantity12, 0) AS TongKL) tong
		WHERE n.YearNo IS NOT NULL
	)
	SELECT	ct.ProductCostId,
			gt.TerritoryCode,
			ct.ProductSizeName,
			ct.YearNo,
			thang.MonthNo,
			ct.IsThieuNam,
			CAST(sl.KhoiLuong AS NUMERIC(28, 4)) AS Quantity,						-- m3
			CAST(sl.KhoiLuong * ct.UnitCostBD AS NUMERIC(28, 4)) AS Amount			-- VNĐ, giá BĐ chưa VAT
	INTO #Fact
	FROM ChiTiet ct
		 INNER JOIN #GoiThau gt ON ct.ProductCostId = gt.ProductCostId
		 CROSS APPLY (VALUES (1, ct.Quantity01), (2, ct.Quantity02), (3, ct.Quantity03), (4, ct.Quantity04),
							 (5, ct.Quantity05), (6, ct.Quantity06), (7, ct.Quantity07), (8, ct.Quantity08),
							 (9, ct.Quantity09), (10, ct.Quantity10), (11, ct.Quantity11), (12, ct.Quantity12)
					 ) thang (MonthNo, Quantity)
		 CROSS APPLY (SELECT IIF(@_GomHaoHut = 1, thang.Quantity * (1 + ct.ConcerlossRate), thang.Quantity) AS KhoiLuong) sl
	WHERE ct._Rn = 1
		  AND ISNULL(thang.Quantity, 0) <> 0
		  AND (@_LoaiBaoCao <> 2 OR ct.YearNo * 100 + thang.MonthNo > @_NamThangBC)

	-- 6. Danh sách cột động: 2 khối (khối lượng, giá trị) x (tổng + từng năm + từng tháng có số liệu)
	--    YearNo IS NULL = cột TỔNG của khối; MonthNo IS NULL = cột tổng cả năm
	IF OBJECT_ID('Tempdb..#Cot') IS NOT NULL DROP TABLE #Cot
	;WITH Ky AS
	(
		SELECT 0 AS KyOrder, CAST(NULL AS INT) AS YearNo, CAST(NULL AS INT) AS MonthNo
		UNION ALL
		SELECT DISTINCT 1, f.YearNo, NULL FROM #Fact f
		UNION ALL
		SELECT DISTINCT 1, f.YearNo, f.MonthNo FROM #Fact f
	)
	SELECT	ROW_NUMBER() OVER (ORDER BY kh.LoaiOrder, k.KyOrder, ISNULL(k.YearNo, 0),
									   IIF(k.MonthNo IS NULL, 0, 1), ISNULL(k.MonthNo, 0)) AS ColOrder,
			kh.LoaiOrder, kh.Loai, k.YearNo, k.MonthNo,
			kh.Prefix + IIF(k.YearNo IS NULL, N'TONG',
							IIF(k.MonthNo IS NULL,
								N'NAM_' + CAST(k.YearNo AS NVARCHAR(4)),
								N'T' + RIGHT(N'0' + CAST(k.MonthNo AS NVARCHAR(2)), 2) + N'_' + CAST(k.YearNo AS NVARCHAR(4)))) AS ColName
	INTO #Cot
	FROM Ky k
		 CROSS JOIN (VALUES (1, 'KL', N'KL_'), (2, 'GT', N'GT_')) kh (LoaiOrder, Loai, Prefix)

	-- 7. Khung dòng báo cáo: tổng 3 miền -> miền -> dự án -> mác
	IF OBJECT_ID('Tempdb..#Rows') IS NOT NULL DROP TABLE #Rows
	CREATE TABLE #Rows
	(
		SortTerritory	SMALLINT		NOT NULL,
		SortProduct		NVARCHAR(512)	NOT NULL,
		SortMac			NVARCHAR(128)	NOT NULL,
		RowLevel		TINYINT			NOT NULL,
		RowName			NVARCHAR(512)	NOT NULL,
		TerritoryName	NVARCHAR(128)	NULL,
		ShortName		NVARCHAR(512)	NULL,
		ProductName		NVARCHAR(192)	NULL,
		ShortNamePKT	NVARCHAR(48)	NULL,
		ProductSizeName	NVARCHAR(128)	NULL,
		GDDH			NVARCHAR(192)	NULL,
		GDDA			NVARCHAR(192)	NULL,
		CHT				NVARCHAR(192)	NULL,
		PTDA_XD			NVARCHAR(192)	NULL,
		_FormatStyleKey	NVARCHAR(32)	NOT NULL DEFAULT N'',	-- App tự in đậm / tô màu dòng tổng, dòng miền
		TerritoryKey	NVARCHAR(32)	NULL,		-- NULL = không lọc (dòng tổng)
		ProductKey		VARCHAR(16)		NULL,
		MacKey			NVARCHAR(128)	NULL
	)

	-- Dòng tổng 3 miền
	INSERT INTO #Rows (SortTerritory, SortProduct, SortMac, RowLevel, RowName, _FormatStyleKey)
	VALUES (0, N'', N'', 0, N'TỔNG 3 MIỀN', N'BOLDYCOLOR')

	-- Dòng miền (chỉ miền có số liệu)
	INSERT INTO #Rows (SortTerritory, SortProduct, SortMac, RowLevel, RowName, TerritoryName, _FormatStyleKey, TerritoryKey)
	SELECT DISTINCT gt.SortTerritory, N'', N'', 1, gt.TerritoryName, gt.TerritoryName, N'BOLDGCOLOR', gt.TerritoryCode
	FROM #GoiThau gt
	WHERE EXISTS (SELECT 1 FROM #Fact f WHERE f.TerritoryCode = gt.TerritoryCode)

	-- Dòng dự án (gói thầu có số liệu)
	INSERT INTO #Rows (SortTerritory, SortProduct, SortMac, RowLevel, RowName, TerritoryName, ShortName, ProductName,
					   ShortNamePKT, GDDH, GDDA, CHT, PTDA_XD, _FormatStyleKey, TerritoryKey, ProductKey)
	SELECT	gt.SortTerritory, gt.ShortName, N'', 2, gt.ShortName, gt.TerritoryName, gt.ShortName, gt.ProductName,
			gt.ShortNamePKT, ns.GDDH, ns.GDDA, ns.CHT, ns.PTDA_XD, IIF(@_ChiTietMac = 1, N'BOLD', N''),
			gt.TerritoryCode, gt.ProductCostId
	FROM #GoiThau gt
		 LEFT OUTER JOIN #NhanSu ns ON gt.ProductCostId = ns.ProductCostId
	WHERE EXISTS (SELECT 1 FROM #Fact f WHERE f.ProductCostId = gt.ProductCostId)

	-- Dòng mác bê tông
	IF @_ChiTietMac = 1
		INSERT INTO #Rows (SortTerritory, SortProduct, SortMac, RowLevel, RowName, TerritoryName, ShortName, ProductName,
						   ShortNamePKT, ProductSizeName, TerritoryKey, ProductKey, MacKey)
		SELECT DISTINCT gt.SortTerritory, gt.ShortName, f.ProductSizeName, 3, f.ProductSizeName, gt.TerritoryName,
				gt.ShortName, gt.ProductName, gt.ShortNamePKT, f.ProductSizeName, gt.TerritoryCode, gt.ProductCostId,
				f.ProductSizeName
		FROM #Fact f
			 INNER JOIN #GoiThau gt ON f.ProductCostId = gt.ProductCostId


	-- 8. Cột lưới TỔNG HỢP (miền x năm): khối lượng, giá trị, TB/tháng
	--    YearNo IS NULL = khối "TỔNG CỘNG" (mẫu Excel không có TB/tháng ở khối này)
	IF OBJECT_ID('Tempdb..#CotTH') IS NOT NULL DROP TABLE #CotTH
	;WITH Ky AS
	(
		SELECT 0 AS KyOrder, CAST(NULL AS INT) AS YearNo
		UNION ALL
		SELECT DISTINCT 1, f.YearNo FROM #Fact f
	)
	SELECT	ROW_NUMBER() OVER (ORDER BY k.KyOrder, ISNULL(k.YearNo, 0), lo.LoaiOrder) AS ColOrder,
			k.YearNo, lo.Loai, lo.LoaiOrder, lo.Caption,
			IIF(k.YearNo IS NULL, N'TONG_', N'N' + CAST(k.YearNo AS NVARCHAR(4)) + N'_') + lo.Loai AS ColName,
			IIF(k.YearNo IS NULL, N'TỔNG CỘNG', N'NĂM ' + CAST(k.YearNo AS NVARCHAR(4))) AS GroupCaption,
			IIF(k.YearNo IS NULL, N'TONG', N'NAM_' + CAST(k.YearNo AS NVARCHAR(4))) AS GroupCode
	INTO #CotTH
	FROM Ky k
		 CROSS JOIN (VALUES (1, 'KL', N'KHỐI LƯỢNG (m3)'), (2, 'GT', N'GIÁ TRỊ (VNĐ)'),
							(3, 'TBKL', N'TB/Tháng (m3)'), (4, 'TBGT', N'TB/Tháng (VNĐ)')
					) lo (LoaiOrder, Loai, Caption)
	WHERE k.YearNo IS NOT NULL OR lo.LoaiOrder <= 2

	-- 9. Layout lưới cho app nội bộ
	--    Lưới chính = bảng tổng hợp theo miền (tiêu đề 2 dòng: TỔNG CỘNG / NĂM yyyy -> chỉ tiêu)
	--    Lưới phụ (SubReports/grdReport1) = bảng chi tiết dự án (tiêu đề 3 dòng: khối / năm / tháng)
	DECLARE @_TenKhoiKL NVARCHAR(128)	= N'KHỐI LƯỢNG BÊ TÔNG TÍNH TOÁN - '
										  + IIF(@_GomHaoHut = 1, N'GỒM HAO HỤT', N'CHƯA GỒM HAO HỤT') + N' (m3)',
			@_TenKhoiGT NVARCHAR(128)	= N'GIÁ TRỊ BÊ TÔNG TÍNH TOÁN - '
										  + IIF(@_GomHaoHut = 1, N'GỒM HAO HỤT', N'CHƯA GỒM HAO HỤT')
										  + N' - CHƯA GỒM VAT, THEO GIÁ BĐ (VNĐ)',
			@_ColsXmlTH NVARCHAR(MAX)	= N'',
			@_ColsXml NVARCHAR(MAX)		= N'',
			@_SumColsTH NVARCHAR(MAX)	= N'',
			@_SumCols NVARCHAR(MAX)		= N''

	-- 9.1 Lưới tổng hợp: cột Miền + các cột động
	SET @_ColsXmlTH =
		N'    <Column_Mien>' + NCHAR(13) +
		N'      <Name>Mien</Name>' + NCHAR(13) +
		N'      <Width>160</Width>' + NCHAR(13) +
		N'      <Style>TextAlign:LeftTop;</Style>' + NCHAR(13) +
		N'      <Rows>' + NCHAR(13) +
		N'        <Row_0>' + NCHAR(13) +
		N'          <Caption>' + NCHAR(13) +
		N'            <Vietnamese>MIỀN</Vietnamese>' + NCHAR(13) +
		N'          </Caption>' + NCHAR(13) +
		N'          <Style>UserData:MIEN;</Style>' + NCHAR(13) +
		N'        </Row_0>' + NCHAR(13) +
		N'        <Row_1>' + NCHAR(13) +
		N'          <Caption>' + NCHAR(13) +
		N'            <Vietnamese />' + NCHAR(13) +
		N'          </Caption>' + NCHAR(13) +
		N'          <Style>UserData:Mien;</Style>' + NCHAR(13) +
		N'        </Row_1>' + NCHAR(13) +
		N'      </Rows>' + NCHAR(13) +
		N'    </Column_Mien>' + NCHAR(13) +
		N'    <Column_RowLevel>' + NCHAR(13) +
		N'      <Name>RowLevel</Name>' + NCHAR(13) +
		N'      <Visible>False</Visible>' + NCHAR(13) +
		N'    </Column_RowLevel>' + NCHAR(13) +
		N'    <Column_FormatStyleKey>' + NCHAR(13) +
		N'      <Name>_FormatStyleKey</Name>' + NCHAR(13) +
		N'      <Visible>False</Visible>' + NCHAR(13) +
		N'    </Column_FormatStyleKey>' + NCHAR(13)

	SET @_ColsXmlTH = @_ColsXmlTH + ISNULL(
		(SELECT N'    <Column_' + c.ColName + N'>' + NCHAR(13) +
				N'      <Name>' + c.ColName + N'</Name>' + NCHAR(13) +
				N'      <Width>130</Width>' + NCHAR(13) +
				N'      <Style>TextAlign:RightTop;Format:"' + IIF(c.Loai IN ('KL', 'TBKL'), N'N2', N'N0') + N'";</Style>' + NCHAR(13) +
				N'      <Rows>' + NCHAR(13) +
				N'        <Row_0>' + NCHAR(13) +
				N'          <Caption>' + NCHAR(13) +
				N'            <Vietnamese>' + c.GroupCaption + N'</Vietnamese>' + NCHAR(13) +
				N'          </Caption>' + NCHAR(13) +
				N'          <Style>UserData:' + c.GroupCode + N';</Style>' + NCHAR(13) +
				N'        </Row_0>' + NCHAR(13) +
				N'        <Row_1>' + NCHAR(13) +
				N'          <Caption>' + NCHAR(13) +
				N'            <Vietnamese>' + c.Caption + N'</Vietnamese>' + NCHAR(13) +
				N'          </Caption>' + NCHAR(13) +
				N'          <Style>UserData:' + c.ColName + N';</Style>' + NCHAR(13) +
				N'        </Row_1>' + NCHAR(13) +
				N'      </Rows>' + NCHAR(13) +
				N'    </Column_' + c.ColName + N'>' + NCHAR(13)
		 FROM #CotTH c
		 ORDER BY c.ColOrder
		 FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N'')

	-- Cột cộng tổng của lưới tổng hợp: chỉ khối lượng / giá trị (TB/tháng không cộng dồn được)
	SET @_SumColsTH = ISNULL(STUFF(
		(SELECT N',' + c.ColName
		 FROM #CotTH c
		 WHERE c.Loai IN ('KL', 'GT')
		 ORDER BY c.ColOrder
		 FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, N''), N'')

	-- 9.2 Lưới chi tiết: cột thông tin (tiêu đề 3 dòng để khớp với cột động)
	DECLARE @_ColFix TABLE (ColOrder TINYINT, ColName NVARCHAR(64), ElemName NVARCHAR(64), Caption NVARCHAR(128),
							GroupCode VARCHAR(16), GroupCaption NVARCHAR(128), Width SMALLINT, Style NVARCHAR(128))

	INSERT INTO @_ColFix (ColOrder, ColName, ElemName, Caption, GroupCode, GroupCaption, Width, Style)
	VALUES	(1,  N'_Stt',			N'Stt',				N'STT',			'GR_INFO',	N'THÔNG TIN DỰ ÁN',	50,  N'TextAlign:CenterTop;'),
			(2,  N'RowName',		N'RowName',			N'Miền / Dự án','GR_INFO',	N'THÔNG TIN DỰ ÁN',	260, N'TextAlign:LeftTop;WordWrap:True;'),
			(3,  N'TerritoryName',	N'TerritoryName',	N'Miền',		'GR_INFO',	N'THÔNG TIN DỰ ÁN',	110, N'TextAlign:LeftTop;'),
			(4,  N'ShortName',		N'ShortName',		N'Tên ngắn DA',	'GR_INFO',	N'THÔNG TIN DỰ ÁN',	180, N'TextAlign:LeftTop;'),
			(5,  N'ShortNamePKT',	N'ShortNamePKT',	N'Tên ngắn PKT','GR_INFO',	N'THÔNG TIN DỰ ÁN',	140, N'TextAlign:LeftTop;'),
			(6,  N'ProductName',	N'ProductName',		N'Tên dự án',	'GR_INFO',	N'THÔNG TIN DỰ ÁN',	320, N'TextAlign:LeftTop;WordWrap:True;'),
			(7,  N'ProductSizeName',N'ProductSizeName',	N'Mác BT',		'GR_INFO',	N'THÔNG TIN DỰ ÁN',	90,  N'TextAlign:LeftTop;'),
			(8,  N'IsThieuNam',		N'IsThieuNam',		N'Suy năm',		'GR_INFO',	N'THÔNG TIN DỰ ÁN',	70,  N'TextAlign:CenterTop;'),
			(9,  N'GDDH',			N'GDDH',			N'GĐĐH',		'GR_HR',	N'NHÂN SỰ DỰ ÁN',	150, N'TextAlign:LeftTop;'),
			(10, N'GDDA',			N'GDDA',			N'GĐDA',		'GR_HR',	N'NHÂN SỰ DỰ ÁN',	150, N'TextAlign:LeftTop;'),
			(11, N'CHT',			N'CHT',				N'CHT',			'GR_HR',	N'NHÂN SỰ DỰ ÁN',	150, N'TextAlign:LeftTop;'),
			(12, N'PTDA_XD',		N'PTDA_XD',			N'PTDA XD',		'GR_HR',	N'NHÂN SỰ DỰ ÁN',	150, N'TextAlign:LeftTop;')

	SET @_ColsXml = ISNULL(
		(SELECT N'        <Column_' + c.ElemName + N'>' + NCHAR(13) +
				N'          <Name>' + c.ColName + N'</Name>' + NCHAR(13) +
				N'          <Width>' + CAST(c.Width AS NVARCHAR(8)) + N'</Width>' + NCHAR(13) +
				N'          <Style>' + c.Style + N'</Style>' + NCHAR(13) +
				N'          <Rows>' + NCHAR(13) +
				N'            <Row_0>' + NCHAR(13) +
				N'              <Caption><Vietnamese>' + c.GroupCaption + N'</Vietnamese></Caption>' + NCHAR(13) +
				N'              <Style>UserData:' + c.GroupCode + N';</Style>' + NCHAR(13) +
				N'            </Row_0>' + NCHAR(13) +
				N'            <Row_1>' + NCHAR(13) +
				N'              <Caption><Vietnamese>' + c.Caption + N'</Vietnamese></Caption>' + NCHAR(13) +
				N'              <Style>UserData:' + c.ColName + N';</Style>' + NCHAR(13) +
				N'            </Row_1>' + NCHAR(13) +
				N'            <Row_2>' + NCHAR(13) +
				N'              <Caption><Vietnamese /></Caption>' + NCHAR(13) +
				N'              <Style>UserData:' + c.ColName + N';</Style>' + NCHAR(13) +
				N'            </Row_2>' + NCHAR(13) +
				N'          </Rows>' + NCHAR(13) +
				N'        </Column_' + c.ElemName + N'>' + NCHAR(13)
		 FROM @_ColFix c
		 ORDER BY c.ColOrder
		 FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N'') +
		-- Cột phụ trợ: app không cần hiển thị
		N'        <Column_RowLevel>' + NCHAR(13) +
		N'          <Name>RowLevel</Name>' + NCHAR(13) +
		N'          <Visible>False</Visible>' + NCHAR(13) +
		N'        </Column_RowLevel>' + NCHAR(13) +
		N'        <Column_FormatStyleKey>' + NCHAR(13) +
		N'          <Name>_FormatStyleKey</Name>' + NCHAR(13) +
		N'          <Visible>False</Visible>' + NCHAR(13) +
		N'        </Column_FormatStyleKey>' + NCHAR(13)

	-- Cột động của lưới chi tiết: Row_0 = khối KL/GT, Row_1 = TỔNG / NĂM yyyy, Row_2 = Cả năm / Tháng n
	SET @_ColsXml = @_ColsXml + ISNULL(
		(SELECT N'        <Column_' + c.ColName + N'>' + NCHAR(13) +
				N'          <Name>' + c.ColName + N'</Name>' + NCHAR(13) +
				N'          <Width>' + IIF(c.YearNo IS NULL, N'140', IIF(c.MonthNo IS NULL, N'130', N'110')) + N'</Width>' + NCHAR(13) +
				N'          <Style>TextAlign:RightTop;Format:"' + IIF(c.Loai = 'KL', N'N2', N'N0') + N'";</Style>' + NCHAR(13) +
				N'          <Rows>' + NCHAR(13) +
				N'            <Row_0>' + NCHAR(13) +
				N'              <Caption><Vietnamese>' + IIF(c.Loai = 'KL', @_TenKhoiKL, @_TenKhoiGT) + N'</Vietnamese></Caption>' + NCHAR(13) +
				N'              <Style>UserData:' + c.Loai + N';</Style>' + NCHAR(13) +
				N'            </Row_0>' + NCHAR(13) +
				N'            <Row_1>' + NCHAR(13) +
				N'              <Caption><Vietnamese>' + IIF(c.YearNo IS NULL, N'TỔNG', N'NĂM ' + CAST(c.YearNo AS NVARCHAR(4))) + N'</Vietnamese></Caption>' + NCHAR(13) +
				N'              <Style>UserData:' + c.Loai + N'_' + IIF(c.YearNo IS NULL, N'TONG', N'NAM_' + CAST(c.YearNo AS NVARCHAR(4))) + N';</Style>' + NCHAR(13) +
				N'            </Row_1>' + NCHAR(13) +
				N'            <Row_2>' + NCHAR(13) +
				N'              <Caption><Vietnamese>' +
					IIF(c.YearNo IS NULL, N'Tổng cộng',
						IIF(c.MonthNo IS NULL, N'Cả năm', N'Tháng ' + CAST(c.MonthNo AS NVARCHAR(2)))) + N'</Vietnamese></Caption>' + NCHAR(13) +
				N'              <Style>UserData:' + c.ColName + N';</Style>' + NCHAR(13) +
				N'            </Row_2>' + NCHAR(13) +
				N'          </Rows>' + NCHAR(13) +
				N'        </Column_' + c.ColName + N'>' + NCHAR(13)
		 FROM #Cot c
		 ORDER BY c.ColOrder
		 FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N'')

	SET @_SumCols = ISNULL(STUFF(
		(SELECT N',' + c.ColName
		 FROM #Cot c
		 ORDER BY c.ColOrder
		 FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, N''), N'')

	SET @_LAYOUT_XML =
		N'<BravoLayout>' + NCHAR(13) +
		N'  <bAllowGrandTotal>False</bAllowGrandTotal>' + NCHAR(13) +		-- SP đã trả sẵn dòng TỔNG 3 MIỀN
		N'  <zSumCols>' + @_SumColsTH + N'</zSumCols>' + NCHAR(13) +
		N'  <Cols>' + NCHAR(13) +
		@_ColsXmlTH +
		N'  </Cols>' + NCHAR(13) +
		N'  <SubReports>' + NCHAR(13) +
		N'    <grdReport1>' + NCHAR(13) +
		N'      <bAllowGrandTotal>False</bAllowGrandTotal>' + NCHAR(13) +
		N'      <zSumCols>' + @_SumCols + N'</zSumCols>' + NCHAR(13) +
		N'      <Cols>' + NCHAR(13) +
		@_ColsXml +
		N'      </Cols>' + NCHAR(13) +
		N'    </grdReport1>' + NCHAR(13) +
		N'  </SubReports>' + NCHAR(13) +
		N'</BravoLayout>'

	DECLARE @_ColSql NVARCHAR(MAX) = N'',
			@_Sql NVARCHAR(MAX) = N''

	-- 10. Output 1: BẢNG TỔNG HỢP theo miền (tổng cộng + từng năm, kèm TB/tháng)
	SELECT @_ColSql = ISNULL(
			(SELECT N', ' +
					CASE c.Loai
						WHEN 'KL'	THEN N'SUM(' + bt.Kl + N')'
						WHEN 'GT'	THEN N'SUM(' + bt.Gt + N')'
						WHEN 'TBKL'	THEN N'SUM(' + bt.Kl + N') / NULLIF(COUNT(DISTINCT ' + bt.Thang + N'), 0)'
						ELSE			 N'SUM(' + bt.Gt + N') / NULLIF(COUNT(DISTINCT ' + bt.Thang + N'), 0)'
					END + N' AS ' + QUOTENAME(c.ColName)
			 FROM #CotTH c
				  CROSS APPLY (SELECT IIF(c.YearNo IS NULL, N'f.Quantity',
											 N'CASE WHEN f.YearNo = ' + CAST(c.YearNo AS NVARCHAR(4)) + N' THEN f.Quantity END') AS Kl,
									  IIF(c.YearNo IS NULL, N'f.Amount',
											 N'CASE WHEN f.YearNo = ' + CAST(c.YearNo AS NVARCHAR(4)) + N' THEN f.Amount END') AS Gt,
									  IIF(c.YearNo IS NULL, N'f.YearNo * 100 + f.MonthNo',
											 N'CASE WHEN f.YearNo = ' + CAST(c.YearNo AS NVARCHAR(4)) + N' THEN f.MonthNo END') AS Thang) bt
			 ORDER BY c.ColOrder
			 FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N'')

	SET @_Sql = N'
	SELECT	ROW_NUMBER() OVER (ORDER BY r.SortTerritory) AS _Stt,
			r.RowLevel, r.RowName AS Mien, r._FormatStyleKey' + @_ColSql + N'
	FROM #Rows r
		 LEFT OUTER JOIN #Fact f ON r.TerritoryKey IS NULL OR f.TerritoryCode = r.TerritoryKey
	WHERE r.RowLevel <= 1
	GROUP BY r.SortTerritory, r.RowLevel, r.RowName, r._FormatStyleKey
	ORDER BY r.SortTerritory'

	EXEC sp_executesql @_Sql

	-- 11. Output 2: BẢNG CHI TIẾT theo dự án - pivot động 2 khối khối lượng / giá trị
	SELECT @_ColSql = ISNULL(
			(SELECT N', SUM(' +
					IIF(c.YearNo IS NULL,
						IIF(c.Loai = 'KL', N'f.Quantity', N'f.Amount'),
						N'CASE WHEN f.YearNo = ' + CAST(c.YearNo AS NVARCHAR(4))
						+ IIF(c.MonthNo IS NULL, N'', N' AND f.MonthNo = ' + CAST(c.MonthNo AS NVARCHAR(2)))
						+ N' THEN ' + IIF(c.Loai = 'KL', N'f.Quantity', N'f.Amount') + N' END')
					+ N') AS ' + QUOTENAME(c.ColName)
			 FROM #Cot c
			 ORDER BY c.ColOrder
			 FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), N'')

	SET @_Sql = N'
	SELECT	ROW_NUMBER() OVER (ORDER BY r.SortTerritory, r.SortProduct, r.SortMac) AS _Stt,
			r.RowLevel, r.RowName, r.TerritoryName, r.ShortName, r.ProductName, r.ShortNamePKT,
			r.ProductSizeName, r.GDDH, r.GDDA, r.CHT, r.PTDA_XD, r._FormatStyleKey,
			CAST(ISNULL(MAX(CAST(f.IsThieuNam AS TINYINT)), 0) AS TINYINT) AS IsThieuNam' + @_ColSql + N'
	FROM #Rows r
		 LEFT OUTER JOIN #Fact f ON (r.TerritoryKey IS NULL OR f.TerritoryCode = r.TerritoryKey)
								AND (r.ProductKey IS NULL OR f.ProductCostId = r.ProductKey)
								AND (r.MacKey IS NULL OR f.ProductSizeName = r.MacKey)
	GROUP BY r.SortTerritory, r.SortProduct, r.SortMac, r.RowLevel, r.RowName, r.TerritoryName, r.ShortName,
			 r.ProductName, r.ShortNamePKT, r.ProductSizeName, r.GDDH, r.GDDA, r.CHT, r.PTDA_XD, r._FormatStyleKey
	ORDER BY r.SortTerritory, r.SortProduct, r.SortMac'

	EXEC sp_executesql @_Sql

	DROP TABLE #GoiThau;
	DROP TABLE #NhanSu;
	DROP TABLE #KeHoach;
	DROP TABLE #Dong;
	DROP TABLE #Fact;
	DROP TABLE #Cot;
	DROP TABLE #CotTH;
	DROP TABLE #Rows;
END
GO
