SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ============================================
-- Description: BÁO CÁO CÁC CHỈ SỐ DỰ ÁN - NHÓM PRELIM (PRE)
--              (mẫu CCM_THONG KE PRELIM_FORM_rev02.xlsx - sheet CFMS_ BCTC_DA)
--
-- Nguồn dữ liệu (cùng quy tắc với usp_Kct_BaoCaoChiSoHaoPhiDuAn):
--   - Dự án được thống kê: B00ProductView.IsReportHaoPhi = 1.
--   - BCTC công trường: B30CCMBudget / B30CCMBudgetDetail, DocCode = 'K2'.
--     Mỗi gói thầu lấy 1 BCTC mới nhất (DocDate <= @_DocDate) đã qua CHT
--     = đã gửi duyệt, không hủy, hoàn thành bước duyệt đầu tiên (mọi dòng của ApproveGroup nhỏ nhất đã duyệt).
--   - Giá trị dự trù lấy cột BCH = OriginalAmount1 ("Dự trù CT & CCM"), chỉ dòng chi tiết (Formula = '').
--   - Doanh thu (mục A) theo CodeMEXD: chứa 'HST' = HST, chứa 'NSC' = NSC; trực tiếp = tổng doanh thu - NSC - HST.
--   - Ô mở thêm trên BCTC: TongDinhMuc = Giá trị VT BT, thép do CĐT cấp.
--   - Khoản mục PRE = dòng mục B có ItemGroupCode thuộc B20BidPackage.JobCodeGroup = 'PRE'.
--     19 mã GT có cột riêng; "Các khoản mục Prelim còn lại" = tổng nhóm PRE - 19 mã (GT.1607 và mã PRE thêm sau này).
--   - % = dự trù / Doanh thu trực tiếp (đã gồm VT CĐT cấp), làm tròn 3 số lẻ (hiển thị P1, VD 0.005 = 0.5%).
--   - Loại hình dự án: B20Product.ProjectTypeCode (gói thầu, trống thì lấy dự án cha) quy về 6 nhóm của mẫu.
--
-- Kết quả (cột dự trù: Pre_xxx, cột %: TL_xxx):
--   @_LoaiBaoCao = 1: 1 dòng / gói thầu, nhóm theo NhomGDDH_GDDA (web: subTotals theo cột này), _Stt đánh lại trong từng nhóm.
--   @_LoaiBaoCao = 2: 1 dòng / loại hình dự án + dòng Tổng cộng (_Stt NULL);
--                     % = tổng dự trù / tổng doanh thu của nhóm, không cộng dồn % từng dự án.
--
-- EXEC dbo.usp_Kct_BaoCaoChiSoPrelimDuAn @_DocDate = '20260915', @_LoaiBaoCao = 1, @_nUserId = 0, @_Ma_Dvcs = N'N01'
-- EXEC dbo.usp_Kct_BaoCaoChiSoPrelimDuAn @_DocDate = '20260915', @_LoaiBaoCao = 2, @_nUserId = 0, @_Ma_Dvcs = N'N01'
--
-- 15/09/2026: Tạo mới
-- ============================================
CREATE OR ALTER PROC dbo.usp_Kct_BaoCaoChiSoPrelimDuAn
	@_DocDate SMALLDATETIME			= NULL,		-- Ngày xuất báo cáo, NULL = hôm nay
	@_ProductCostId NVARCHAR(4000)	= N'',		-- Lọc gói thầu (nhiều mã cách nhau dấu phẩy), rỗng = tất cả
	@_LoaiBaoCao TINYINT			= 1,		-- 1: chi tiết theo gói thầu, 2: tổng hợp theo loại hình dự án
	@_nUserId INT					= 0,
	@_LangId INT					= 0,
	@_Ma_Dvcs NCHAR(3)				= N'N01',
	@_DocDateStr VARCHAR(10)		= '' OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT	@_DocDate = ISNULL(@_DocDate, CAST(GETDATE() AS DATE)),
			@_ProductCostId = LTRIM(RTRIM(ISNULL(@_ProductCostId, N''))),
			@_LoaiBaoCao = IIF(@_LoaiBaoCao = 2, 2, 1),
			@_Ma_Dvcs = RTRIM(@_Ma_Dvcs)

	SET @_DocDateStr = CONVERT(VARCHAR(10), @_DocDate, 103)

	-- Vị trí nhân sự dự án
	DECLARE @_ViTri TABLE (Nhom VARCHAR(16), PositionCode NVARCHAR(16))

	INSERT INTO @_ViTri (Nhom, PositionCode)
	VALUES	('GDDH',	N'CB-077'),	-- GĐĐH/GĐK/GĐTC/NS TGD UQ
			('GDDA',	N'CB-002'),	-- Giám đốc dự án/ Người được UQ
			('CHT',		N'CB-012'),	-- Chỉ huy trưởng XD
			('CHT',		N'CB-015'),	-- Chỉ huy trưởng ME
			('CCM_XD',	N'CB-008'),	-- Chuyên viên KSCP
			('CCM_MEP',	N'CB-030')	-- Chuyên viên KSCP - ME

	-- Loại hình dự án theo mẫu báo cáo; ThuTu = thứ tự dòng ở bảng tổng hợp
	DECLARE @_LoaiHinh TABLE (MaLoaiHinh TINYINT, TenLoaiHinh NVARCHAR(64), ThuTu TINYINT)

	INSERT INTO @_LoaiHinh (MaLoaiHinh, TenLoaiHinh, ThuTu)
	VALUES	(1, N'Nhà cao tầng',				1),
			(4, N'TTTM/Văn phòng/Trường học',	2),
			(3, N'Nhà xưởng',					3),
			(5, N'Hạ tầng',						4),
			(2, N'Nhà thấp tầng/Biệt thự',		5),
			(6, N'Đầu tư công',					6),
			(0, N'Chưa phân loại',				7)		-- ProjectTypeCode trống / N07 Khác: chỉ hiện khi có dự án

	-- B20Class (ParentCode = 'ProjectType') -> loại hình của mẫu
	DECLARE @_LoaiHinhMa TABLE (ProjectTypeCode NVARCHAR(32), MaLoaiHinh TINYINT)

	INSERT INTO @_LoaiHinhMa (ProjectTypeCode, MaLoaiHinh)
	VALUES	(N'NCT', 1),	-- Nhà Cao Tầng
			(N'NTT', 2),	-- Nhà thấp tầng
			(N'BT',  2),	-- Biệt thự, Resort
			(N'NX',  3),	-- Nhà xưởng
			(N'TM',  4),	-- Trung tâm thương mại
			(N'TH',  4),	-- Trường học
			(N'HT',  5),	-- Hạ tầng
			(N'DTC', 6)		-- Đầu tư công: chưa có mã trong B20Class, cần khai báo thêm

	IF OBJECT_ID('Tempdb..#GoiThau') IS NOT NULL DROP TABLE #GoiThau
	SELECT p.ProductCostId AS ProductCostId
	INTO #GoiThau
	FROM dbo.B00ProductView p
	WHERE p.IsReportHaoPhi = 1
		  AND (@_ProductCostId = N'' OR p.ProductCostId IN (SELECT LTRIM(RTRIM(value)) FROM STRING_SPLIT(@_ProductCostId, ',')))

	-- 1. BCTC mới nhất đã qua CHT (hoàn thành bước duyệt đầu tiên) của từng gói thầu
	IF OBJECT_ID('Tempdb..#BCTC') IS NOT NULL DROP TABLE #BCTC
	;WITH Temp AS
	(
		SELECT	bud.CCMBudgetId, bud.ProductCostId, bud.DocNo, bud.DocDate, bud.TongDinhMuc,
				ROW_NUMBER() OVER (PARTITION BY bud.ProductCostId ORDER BY bud.DocDate DESC, bud.DocNo DESC, bud.Id DESC) AS _Rn
		FROM dbo.B30CCMBudget bud
			 INNER JOIN #GoiThau gt ON bud.ProductCostId = gt.ProductCostId
			 CROSS APPLY (SELECT COUNT(*) AS SoDong,
								 SUM(IIF(a.ApproveStatus = '1', 1, 0)) AS SoDaDuyet
						  FROM dbo.B30BizDocApprove a
						  WHERE a.BizDocId = bud.CCMBudgetId
								AND a.ApproveGroup = (SELECT MIN(a2.ApproveGroup)
													  FROM dbo.B30BizDocApprove a2
													  WHERE a2.BizDocId = bud.CCMBudgetId)) buoc1
		WHERE bud.DocCode = 'K2'
			  AND bud.IsActive = 1
			  AND bud.BranchCode = @_Ma_Dvcs
			  AND bud.DocDate <= @_DocDate
			  AND bud.ApproveSend = 1
			  AND bud.ClosedApprove = 0
			  AND buoc1.SoDong > 0
			  AND buoc1.SoDaDuyet = buoc1.SoDong
	)
	SELECT CCMBudgetId, ProductCostId, DocNo, DocDate, TongDinhMuc
	INTO #BCTC
	FROM Temp
	WHERE _Rn = 1

	-- 2. Tổng hợp số liệu BCTC theo cột BCH (LEFT JOIN: BCTC không có dòng chi tiết vẫn có 1 dòng số liệu = 0)
	IF OBJECT_ID('Tempdb..#SoLieu') IS NOT NULL DROP TABLE #SoLieu
	SELECT	bc.CCMBudgetId,
			SUM(IIF(ma.Muc = 'A', dt.OriginalAmount1, 0)) AS DT_Tong,
			SUM(IIF(ma.Muc = 'A' AND ma.CodeMEXD LIKE '%HST%', dt.OriginalAmount1, 0)) AS DT_HST,
			SUM(IIF(ma.Muc = 'A' AND ma.CodeMEXD NOT LIKE '%HST%' AND ma.CodeMEXD LIKE '%NSC%', dt.OriginalAmount1, 0)) AS DT_NSC,	-- Mã chứa cả HST và NSC tính vào HST
			SUM(IIF(pre.MaPre = 'GT.2409', dt.OriginalAmount1, 0)) AS Pre_BaoHiem,		-- PRE_BẢO HIỂM
			SUM(IIF(pre.MaPre = 'GT.2904', dt.OriginalAmount1, 0)) AS Pre_BaoVe,		-- PRE_BẢO VỆ
			SUM(IIF(pre.MaPre = 'GT.3106', dt.OriginalAmount1, 0)) AS Pre_CCBHLD,		-- PRE_CC BHLĐ
			SUM(IIF(pre.MaPre = 'GT.1414', dt.OriginalAmount1, 0)) AS Pre_CCVatTuPhu,	-- PRE_CC VẬT TƯ PHỤ
			SUM(IIF(pre.MaPre = 'GT.1305', dt.OriginalAmount1, 0)) AS Pre_DienNuoc,		-- PRE_ĐIỆN/NƯỚC TIÊU THỤ
			SUM(IIF(pre.MaPre = 'GT.3102', dt.OriginalAmount1, 0)) AS Pre_DNTC,			-- PRE_ĐNTC
			SUM(IIF(pre.MaPre = 'GT.2801', dt.OriginalAmount1, 0)) AS Pre_LuongATV,		-- PRE_Lương ATV
			SUM(IIF(pre.MaPre = 'GT.2506', dt.OriginalAmount1, 0)) AS Pre_NCCoKhiTam,	-- Pre_NC_CƠ KHÍ TẠM
			SUM(IIF(pre.MaPre = 'GT.2901', dt.OriginalAmount1, 0)) AS Pre_NCCongNhat,	-- PRE_NC_CÔNG NHẬT
			SUM(IIF(pre.MaPre = 'GT.2915', dt.OriginalAmount1, 0)) AS Pre_NCDefect,		-- PRE_NC_DEFECT
			SUM(IIF(pre.MaPre = 'GT.2903', dt.OriginalAmount1, 0)) AS Pre_NCGianGiao,	-- Pre_NC_GIÀN GIÁO BAO CHE
			SUM(IIF(pre.MaPre = 'GT.2911', dt.OriginalAmount1, 0)) AS Pre_NCVanHanhTB,	-- Pre_NC_VẬN HÀNH THIẾT BỊ
			SUM(IIF(pre.MaPre = 'GT.2909', dt.OriginalAmount1, 0)) AS Pre_Rac,			-- PRE_RÁC
			SUM(IIF(pre.MaPre = 'GT.1609', dt.OriginalAmount1, 0)) AS Pre_ThamTra,		-- PRE_THẨM TRA/THÍ NGHIỆM/QUAN TRẮC/ĐÁNH GIÁ TÁC ĐỘNG MT
			SUM(IIF(pre.MaPre = 'GT.1306', dt.OriginalAmount1, 0)) AS Pre_ThueNha,		-- PRE_THUÊ NHÀ
			SUM(IIF(pre.MaPre = 'GT.2507', dt.OriginalAmount1, 0)) AS Pre_TienMat,		-- PRE_Tiền mặt, phân bổ
			SUM(IIF(pre.MaPre = 'GT.2902', dt.OriginalAmount1, 0)) AS Pre_TracDac,		-- PRE_TRẮC ĐẠC
			SUM(IIF(pre.MaPre = 'GT.2914', dt.OriginalAmount1, 0)) AS Pre_VanPhongPham,	-- PRE_VĂN PHÒNG PHẨM
			SUM(IIF(pre.MaPre = 'GT.2910', dt.OriginalAmount1, 0)) AS Pre_VeSinhCN,		-- PRE_VỆ SINH CÔNG NGHIỆP
			SUM(IIF(pre.MaPre IS NOT NULL, dt.OriginalAmount1, 0)) AS Pre_Tong			-- Tổng chi phí Pre
	INTO #SoLieu
	FROM #BCTC bc
		 LEFT OUTER JOIN dbo.B30CCMBudgetDetail dt ON bc.CCMBudgetId = dt.CCMBudgetId AND dt.Formula = ''
		 CROSS APPLY (SELECT LEFT(dt.ItemNo, 1) AS Muc,
							 LTRIM(RTRIM(dt.CodeMEXD)) AS CodeMEXD,
							 LTRIM(RTRIM(dt.ItemGroupCode)) AS MaGT) ma
		 LEFT OUTER JOIN dbo.B20BidPackage bp ON ma.MaGT = bp.Code
		 CROSS APPLY (SELECT IIF(ma.Muc = 'B' AND bp.JobCodeGroup = 'PRE', ma.MaGT, NULL) AS MaPre) pre
	GROUP BY bc.CCMBudgetId

	-- 3. Nhân sự dự án: mỗi nhóm vị trí lấy 1 người có ngày hiệu lực mới nhất (<= ngày báo cáo)
	IF OBJECT_ID('Tempdb..#NhanSu') IS NOT NULL DROP TABLE #NhanSu
	SELECT	bc.ProductCostId,
			nhom.Nhom,
			ns.TenNhanSu
	INTO #NhanSu
	FROM #BCTC bc
		 CROSS JOIN (SELECT DISTINCT Nhom FROM @_ViTri) nhom
		 OUTER APPLY (SELECT TOP 1 e.Name AS TenNhanSu
					  FROM dbo.B20ProductHuman ph
						   INNER JOIN @_ViTri vt ON ph.PositionCode = vt.PositionCode
						   INNER JOIN dbo.B20Employee e ON ph.EmployeeCode = e.Code
					  WHERE ph.ProductCostId = bc.ProductCostId
							AND vt.Nhom = nhom.Nhom
							AND ph.IsActive = 1
							AND (ph.ApplyDate IS NULL OR ph.ApplyDate <= @_DocDate)
					  ORDER BY ISNULL(ph.ApplyDate, '19000101') DESC, ph.Id DESC) ns

	-- 4. Dữ liệu từng gói thầu
	IF OBJECT_ID('Tempdb..#DuLieu') IS NOT NULL DROP TABLE #DuLieu
	SELECT	ISNULL(ns.GDDH, N'Chưa khai báo GĐĐH') AS NhomGDDH_GDDA,
			bc.ProductCostId,
			p.Name AS ProductName,																	-- 2. Dự án
			p.ShortName AS TenRutGon,																-- 2a
			lht.MaLoaiHinh,
			-- DOANH THU BCTC
			sl.DT_Tong,																				-- 3 = tổng mục A
			a.DT_TrucTiep,																			-- 4 = 3 - 5 - 6
			sl.DT_NSC,																				-- 5
			sl.DT_HST,																				-- 6
			a.VT_CDTCap,																			-- 7
			a.DT_TrucTiep + a.VT_CDTCap AS DT_TrucTiepGomVT,										-- 8 = 4 + 7
			-- DỰ TRÙ BCTC (cột BCH)
			sl.Pre_BaoHiem, sl.Pre_BaoVe, sl.Pre_CCBHLD, sl.Pre_CCVatTuPhu, sl.Pre_DienNuoc, sl.Pre_DNTC, sl.Pre_LuongATV,
			sl.Pre_NCCoKhiTam, sl.Pre_NCCongNhat, sl.Pre_NCDefect, sl.Pre_NCGianGiao, sl.Pre_NCVanHanhTB, sl.Pre_Rac,
			sl.Pre_ThamTra, sl.Pre_ThueNha, sl.Pre_TienMat, sl.Pre_TracDac, sl.Pre_VanPhongPham, sl.Pre_VeSinhCN,
			sl.Pre_Tong - (sl.Pre_BaoHiem + sl.Pre_BaoVe + sl.Pre_CCBHLD + sl.Pre_CCVatTuPhu + sl.Pre_DienNuoc
						   + sl.Pre_DNTC + sl.Pre_LuongATV + sl.Pre_NCCoKhiTam + sl.Pre_NCCongNhat + sl.Pre_NCDefect
						   + sl.Pre_NCGianGiao + sl.Pre_NCVanHanhTB + sl.Pre_Rac + sl.Pre_ThamTra + sl.Pre_ThueNha
						   + sl.Pre_TienMat + sl.Pre_TracDac + sl.Pre_VanPhongPham + sl.Pre_VeSinhCN) AS Pre_ConLai,	-- Các khoản mục Prelim còn lại
			sl.Pre_Tong,																			-- Tổng chi phí Pre
			-- THÔNG TIN CHUNG
			p.Code AS SoHoSo,																		-- 33
			ISNULL(pp.Name, p.Name) AS DuAn,														-- 34
			p.ShortName AS TenNganPKT,																-- 35
			ns.GDDH,																				-- 36
			ns.GDDA,																				-- 37
			ns.CHT,																					-- 38
			ns.CCM_XD,																				-- 39
			ns.CCM_MEP,																				-- 40
			ter.Name AS VungMien,																	-- 41
			cdt.Name AS CDT,																		-- 42
			lht.TenLoaiHinh AS LoaiHinhDuAn,														-- 43 (6 nhóm của mẫu)
			cls.Name AS ProjectTypeName,															-- Loại hình khai báo trên gói thầu
			-- Chứng từ nguồn để đối chiếu
			bc.CCMBudgetId,
			bc.DocNo AS DocNo_BCTC,
			bc.DocDate AS DocDate_BCTC
	INTO #DuLieu
	FROM #BCTC bc
		 INNER JOIN #SoLieu sl ON bc.CCMBudgetId = sl.CCMBudgetId
		 INNER JOIN dbo.B20Product p ON bc.ProductCostId = p.RowId
		 LEFT OUTER JOIN dbo.B20Product pp ON p.ParentId = pp.Id AND pp.IsGroup = 1
		 LEFT OUTER JOIN
		 (
			SELECT	ProductCostId,
					MAX(IIF(Nhom = 'GDDH', TenNhanSu, NULL)) AS GDDH,
					MAX(IIF(Nhom = 'GDDA', TenNhanSu, NULL)) AS GDDA,
					MAX(IIF(Nhom = 'CHT', TenNhanSu, NULL)) AS CHT,
					MAX(IIF(Nhom = 'CCM_XD', TenNhanSu, NULL)) AS CCM_XD,
					MAX(IIF(Nhom = 'CCM_MEP', TenNhanSu, NULL)) AS CCM_MEP
			FROM #NhanSu
			GROUP BY ProductCostId
		 ) ns ON bc.ProductCostId = ns.ProductCostId
		 OUTER APPLY (SELECT TOP 1 t.Name
					  FROM dbo.B20Territory t
					  WHERE t.Code = COALESCE(NULLIF(p.TerritoryCode, ''), pp.TerritoryCode)) ter
		 OUTER APPLY (SELECT TOP 1 c.Name
					  FROM dbo.B20Customer c
					  WHERE c.Code = COALESCE(NULLIF(p.InvestorCode, ''), pp.InvestorCode)) cdt
		 CROSS APPLY (SELECT COALESCE(NULLIF(p.ProjectTypeCode, ''), pp.ProjectTypeCode) AS ProjectTypeCode) lhc
		 OUTER APPLY (SELECT TOP 1 cl.Name
					  FROM dbo.B20Class cl
					  WHERE cl.ParentCode = 'ProjectType'
							AND cl.Code = lhc.ProjectTypeCode) cls
		 LEFT OUTER JOIN @_LoaiHinhMa lhm ON lhc.ProjectTypeCode = lhm.ProjectTypeCode
		 INNER JOIN @_LoaiHinh lht ON lht.MaLoaiHinh = ISNULL(lhm.MaLoaiHinh, 0)
		 CROSS APPLY (SELECT sl.DT_Tong - sl.DT_NSC - sl.DT_HST AS DT_TrucTiep,
							 ISNULL(bc.TongDinhMuc, 0) AS VT_CDTCap) a

	-- 5. Kết quả: nhánh chi tiết và nhánh tổng hợp dùng chung công thức %
	;WITH Nguon AS
	(
		SELECT	ROW_NUMBER() OVER (PARTITION BY d.NhomGDDH_GDDA ORDER BY d.SoHoSo) AS _Stt,			-- 1
				d.NhomGDDH_GDDA,
				d.ProductCostId,
				d.ProductName,
				d.MaLoaiHinh,
				1 AS SoDuAn,
				d.DT_Tong, d.DT_TrucTiep, d.DT_NSC, d.DT_HST, d.VT_CDTCap, d.DT_TrucTiepGomVT,
				d.Pre_BaoHiem, d.Pre_BaoVe, d.Pre_CCBHLD, d.Pre_CCVatTuPhu, d.Pre_DienNuoc, d.Pre_DNTC, d.Pre_LuongATV,
				d.Pre_NCCoKhiTam, d.Pre_NCCongNhat, d.Pre_NCDefect, d.Pre_NCGianGiao, d.Pre_NCVanHanhTB, d.Pre_Rac,
				d.Pre_ThamTra, d.Pre_ThueNha, d.Pre_TienMat, d.Pre_TracDac, d.Pre_VanPhongPham, d.Pre_VeSinhCN,
				d.Pre_ConLai, d.Pre_Tong
		FROM #DuLieu d
		WHERE @_LoaiBaoCao = 1

		UNION ALL

		-- GROUPING SETS (): dòng Tổng cộng. Nhóm rỗng vẫn trả 1 dòng nên HAVING phải chặn khi @_LoaiBaoCao = 1
		SELECT	IIF(GROUPING(lh.MaLoaiHinh) = 1, NULL, MIN(lh.ThuTu)),
				NULL,
				NULL,
				IIF(GROUPING(lh.MaLoaiHinh) = 1, N'Tổng cộng', MIN(lh.TenLoaiHinh)),
				lh.MaLoaiHinh,
				COUNT(d.ProductCostId),
				SUM(d.DT_Tong), SUM(d.DT_TrucTiep), SUM(d.DT_NSC), SUM(d.DT_HST), SUM(d.VT_CDTCap), SUM(d.DT_TrucTiepGomVT),
				SUM(d.Pre_BaoHiem), SUM(d.Pre_BaoVe), SUM(d.Pre_CCBHLD), SUM(d.Pre_CCVatTuPhu), SUM(d.Pre_DienNuoc), SUM(d.Pre_DNTC), SUM(d.Pre_LuongATV),
				SUM(d.Pre_NCCoKhiTam), SUM(d.Pre_NCCongNhat), SUM(d.Pre_NCDefect), SUM(d.Pre_NCGianGiao), SUM(d.Pre_NCVanHanhTB), SUM(d.Pre_Rac),
				SUM(d.Pre_ThamTra), SUM(d.Pre_ThueNha), SUM(d.Pre_TienMat), SUM(d.Pre_TracDac), SUM(d.Pre_VanPhongPham), SUM(d.Pre_VeSinhCN),
				SUM(d.Pre_ConLai), SUM(d.Pre_Tong)
		FROM @_LoaiHinh lh
			 LEFT OUTER JOIN #DuLieu d ON lh.MaLoaiHinh = d.MaLoaiHinh
		WHERE @_LoaiBaoCao = 2
		GROUP BY GROUPING SETS ((lh.MaLoaiHinh), ())
		HAVING @_LoaiBaoCao = 2
			   AND (GROUPING(lh.MaLoaiHinh) = 1 OR lh.MaLoaiHinh <> 0 OR COUNT(d.ProductCostId) > 0)
	)
	SELECT	n.*,
			-- % DỰ TRÙ BCTC / DOANH THU TRỰC TIẾP (ĐÃ GỒM VT CĐT CẤP) = cụm dự trù / (8)
			CAST(ROUND(n.Pre_BaoHiem / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_BaoHiem,
			CAST(ROUND(n.Pre_BaoVe / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_BaoVe,
			CAST(ROUND(n.Pre_CCBHLD / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_CCBHLD,
			CAST(ROUND(n.Pre_CCVatTuPhu / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_CCVatTuPhu,
			CAST(ROUND(n.Pre_DienNuoc / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_DienNuoc,
			CAST(ROUND(n.Pre_DNTC / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_DNTC,
			CAST(ROUND(n.Pre_LuongATV / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_LuongATV,
			CAST(ROUND(n.Pre_NCCoKhiTam / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_NCCoKhiTam,
			CAST(ROUND(n.Pre_NCCongNhat / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_NCCongNhat,
			CAST(ROUND(n.Pre_NCDefect / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_NCDefect,
			CAST(ROUND(n.Pre_NCGianGiao / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_NCGianGiao,
			CAST(ROUND(n.Pre_NCVanHanhTB / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_NCVanHanhTB,
			CAST(ROUND(n.Pre_Rac / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_Rac,
			CAST(ROUND(n.Pre_ThamTra / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_ThamTra,
			CAST(ROUND(n.Pre_ThueNha / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_ThueNha,
			CAST(ROUND(n.Pre_TienMat / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_TienMat,
			CAST(ROUND(n.Pre_TracDac / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_TracDac,
			CAST(ROUND(n.Pre_VanPhongPham / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_VanPhongPham,
			CAST(ROUND(n.Pre_VeSinhCN / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_VeSinhCN,
			CAST(ROUND(n.Pre_ConLai / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_ConLai,
			CAST(ROUND(n.Pre_Tong / NULLIF(n.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL_Tong,
			-- THÔNG TIN CHUNG (chỉ có ở báo cáo chi tiết)
			d.TenRutGon,
			d.SoHoSo,
			d.DuAn,
			d.TenNganPKT,
			d.GDDH,
			d.GDDA,
			d.CHT,
			d.CCM_XD,
			d.CCM_MEP,
			d.VungMien,
			d.CDT,
			d.LoaiHinhDuAn,
			d.ProjectTypeName,
			d.CCMBudgetId,
			d.DocNo_BCTC,
			d.DocDate_BCTC
	FROM Nguon n
		 LEFT OUTER JOIN #DuLieu d ON n.ProductCostId = d.ProductCostId
	ORDER BY n.NhomGDDH_GDDA, ISNULL(n._Stt, 255)

	DROP TABLE #GoiThau;
	DROP TABLE #BCTC;
	DROP TABLE #SoLieu;
	DROP TABLE #NhanSu;
	DROP TABLE #DuLieu;
END
GO
