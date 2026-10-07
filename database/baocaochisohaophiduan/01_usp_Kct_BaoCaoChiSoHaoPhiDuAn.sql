SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON	-- Bắt buộc: dùng FOR XML PATH ... .value()
GO
-- ============================================
-- Description: BÁO CÁO CÁC CHỈ SỐ DỰ ÁN: CP NHÂN SỰ, PRELIM, DEFECT, HAO HỤT
--              (mẫu THONG HOP CAC CHI SO HAO PHI DU AN.xlsx - sheet CFMS_ BCTC_DA)
--
-- Nguồn dữ liệu:
--   - BCTC công trường: B30CCMBudget / B30CCMBudgetDetail, DocCode = 'K2'.
--     Mỗi gói thầu lấy 1 BCTC mới nhất (DocDate <= @_DocDate) đã qua CHT
--     = đã gửi duyệt, không hủy, hoàn thành bước duyệt đầu tiên (mọi dòng của ApproveGroup nhỏ nhất đã duyệt).
--   - Giá trị dự trù lấy cột BCH = OriginalAmount1 ("Dự trù CT & CCM"), chỉ dòng chi tiết (Formula = '').
--   - Doanh thu (mục A) theo CodeMEXD: chứa 'HST' = HST, chứa 'NSC' = NSC; trực tiếp = tổng doanh thu - NSC - HST.
--   - Mã GT.xxxx = ItemGroupCode (B20BidPackage.Code); nhóm công tác = B20BidPackage.JobCodeGroup (PRE, TB).
--   - Ô mở thêm trên BCTC: TongDinhMuc = Giá trị VT BT, thép do CĐT cấp; HeSoQuanLy = Tỷ lệ CP NS NSC.
--   - Hao hụt thép (D4) / bê tông (D3) trong B30BizDoc: phiếu mới nhất đã được CHT duyệt.
--   - % chia tự động làm tròn 3 số lẻ (hiển thị P1, VD 0.005 = 0.5%).
--
-- Kết quả: 1 dòng / gói thầu, nhóm theo NhomGDDH_GDDA (web: subTotals theo cột này), _Stt đánh lại trong từng nhóm.
--
-- EXEC dbo.usp_Kct_BaoCaoChiSoHaoPhiDuAn @_DocDate = '20260915', @_nUserId = 0, @_Ma_Dvcs = N'N01'
--
-- 15/09/2026: Tạo mới
-- 15/09/2026: Qua CHT = hoàn thành bước duyệt đầu tiên; DT NSC/HST theo CodeMEXD chứa NSC/HST, trực tiếp = tổng - NSC - HST
-- ============================================
CREATE OR ALTER PROC dbo.usp_Kct_BaoCaoChiSoHaoPhiDuAn
	@_DocDate SMALLDATETIME			= NULL,		-- Ngày xuất báo cáo, NULL = hôm nay
	@_ProductCostId NVARCHAR(4000)	= N'',		-- Lọc gói thầu (nhiều mã cách nhau dấu phẩy), rỗng = tất cả
	@_HaoHutTheo TINYINT			= 2,		-- 1: % hao hụt so với KL CĐT (NumberCol8), 2: so với KL tính toán (NumberCol9)
	@_nUserId INT					= 0,
	@_LangId INT					= 0,
	@_Ma_Dvcs NCHAR(3)				= N'N01',
	@_DocDateStr VARCHAR(10)		= '' OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT	@_DocDate = ISNULL(@_DocDate, CAST(GETDATE() AS DATE)),
			@_ProductCostId = LTRIM(RTRIM(ISNULL(@_ProductCostId, N''))),
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

	IF OBJECT_ID('Tempdb..#GoiThau') IS NOT NULL DROP TABLE #GoiThau
	SELECT p.RowId AS ProductCostId
	INTO #GoiThau
	FROM dbo.B20Product p
	WHERE p.IsGroup = 0
		  AND p.IsActive = 1
		  AND p.IsTest = 0
		  AND p.ProductType IN (1, 3)
		  AND (@_ProductCostId = N'' OR p.RowId IN (SELECT LTRIM(RTRIM(value)) FROM STRING_SPLIT(@_ProductCostId, ',')))
		  AND (@_IsAdmin = 1 OR p.RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien(@_Ma_CbNv)))

	-- 1. BCTC mới nhất đã qua CHT (hoàn thành bước duyệt đầu tiên) của từng gói thầu
	IF OBJECT_ID('Tempdb..#BCTC') IS NOT NULL DROP TABLE #BCTC
	;WITH Temp AS
	(
		SELECT	bud.CCMBudgetId, bud.ProductCostId, bud.DocNo, bud.DocDate,
				bud.TongDinhMuc, bud.HeSoQuanLy,
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
	SELECT CCMBudgetId, ProductCostId, DocNo, DocDate, TongDinhMuc, HeSoQuanLy
	INTO #BCTC
	FROM Temp
	WHERE _Rn = 1

	-- 2. Tổng hợp số liệu BCTC theo cột BCH
	IF OBJECT_ID('Tempdb..#SoLieu') IS NOT NULL DROP TABLE #SoLieu
	SELECT	dt.CCMBudgetId,
			SUM(IIF(ma.Muc = 'A', dt.OriginalAmount1, 0)) AS DT_Tong,
			SUM(IIF(ma.Muc = 'A' AND ma.CodeMEXD LIKE '%HST%', dt.OriginalAmount1, 0)) AS DT_HST,
			SUM(IIF(ma.Muc = 'A' AND ma.CodeMEXD NOT LIKE '%HST%' AND ma.CodeMEXD LIKE '%NSC%', dt.OriginalAmount1, 0)) AS DT_NSC,	-- Mã chứa cả HST và NSC tính vào HST
			SUM(IIF(ma.Muc = 'B' AND ma.MaGT = 'GT.1503', dt.OriginalAmount1, 0)) AS CP_NhanSuBCH,		-- BCH_Nhân sự BCH
			SUM(IIF(ma.Muc = 'B' AND ma.MaGT = 'GT.1411', dt.OriginalAmount1, 0)) AS CP_TienMatBCH,		-- BCH_Tiền mặt/Phân bổ
			SUM(IIF(ma.Muc = 'B' AND bp.JobCodeGroup = 'PRE', dt.OriginalAmount1, 0)) AS CP_Prelim,		-- Nhóm PRE, đã gồm defect
			SUM(IIF(ma.Muc = 'B' AND ma.MaGT = 'GT.2901', dt.OriginalAmount1, 0)) AS CP_CongNhat,		-- PRE_NC_CÔNG NHẬT
			SUM(IIF(ma.Muc = 'B' AND ma.MaGT = 'GT.2915', dt.OriginalAmount1, 0)) AS CP_Defect,			-- PRE_NC_DEFECT
			SUM(IIF(ma.Muc = 'B' AND bp.JobCodeGroup = 'TB', dt.OriginalAmount1, 0)) AS CP_TB,			-- Nhóm TB
			SUM(IIF(ma.Muc = 'B' AND ma.MaGT = 'GT.1203', dt.OriginalAmount1, 0)) AS TB_NoiBo,
			SUM(IIF(ma.Muc = 'B' AND ma.MaGT = 'GT.1204', dt.OriginalAmount1, 0)) AS TB_ThueCau,
			SUM(IIF(ma.Muc = 'B' AND ma.MaGT = 'GT.1205', dt.OriginalAmount1, 0)) AS TB_ThueHoist,
			SUM(IIF(ma.Muc = 'B' AND ma.MaGT = 'GT.1206', dt.OriginalAmount1, 0)) AS TB_ThueKhac,
			SUM(IIF(ma.Muc = 'B' AND ma.MaGT = 'GT.1207', dt.OriginalAmount1, 0)) AS TB_VanChuyen
	INTO #SoLieu
	FROM #BCTC bc
		 INNER JOIN dbo.B30CCMBudgetDetail dt ON bc.CCMBudgetId = dt.CCMBudgetId
		 CROSS APPLY (SELECT LEFT(dt.ItemNo, 1) AS Muc,
							 LTRIM(RTRIM(dt.CodeMEXD)) AS CodeMEXD,
							 LTRIM(RTRIM(dt.ItemGroupCode)) AS MaGT) ma
		 LEFT OUTER JOIN dbo.B20BidPackage bp ON ma.MaGT = bp.Code
	WHERE dt.Formula = ''
	GROUP BY dt.CCMBudgetId

	-- 3. Hao hụt mới nhất đã được CHT duyệt: D4 = thép, D3 = bê tông
	IF OBJECT_ID('Tempdb..#HaoHut') IS NOT NULL DROP TABLE #HaoHut
	;WITH Temp AS
	(
		SELECT	biz.DocCode, biz.ProductCostId, RTRIM(biz.DocNo) AS DocNo,
				IIF(@_HaoHutTheo = 1, biz.NumberCol8, biz.NumberCol9) AS TiLeHaoHut,
				ROW_NUMBER() OVER (PARTITION BY biz.DocCode, biz.ProductCostId ORDER BY biz.DocDate DESC, biz.Id DESC) AS _Rn
		FROM dbo.B30BizDoc biz
			 INNER JOIN #BCTC bc ON biz.ProductCostId = bc.ProductCostId
		WHERE biz.DocCode IN ('D3', 'D4')
			  AND biz.IsActive = 1
			  AND biz.BranchCode = @_Ma_Dvcs
			  AND biz.DocDate <= @_DocDate
			  AND EXISTS (SELECT 1
						  FROM dbo.B30BizDocApprove a
						  WHERE a.BizDocId = biz.BizDocId
								AND a.PositionCode IN (SELECT PositionCode FROM @_ViTri WHERE Nhom = 'CHT')
								AND a.ApproveStatus = '1')
	)
	SELECT	ProductCostId,
			MAX(IIF(DocCode = 'D4', TiLeHaoHut, NULL)) AS HH_Thep,
			MAX(IIF(DocCode = 'D3', TiLeHaoHut, NULL)) AS HH_BeTong,
			MAX(IIF(DocCode = 'D4', DocNo, NULL)) AS DocNo_HHThep,
			MAX(IIF(DocCode = 'D3', DocNo, NULL)) AS DocNo_HHBeTong
	INTO #HaoHut
	FROM Temp
	WHERE _Rn = 1
	GROUP BY ProductCostId

	-- 4. Nhân sự dự án: mỗi nhóm vị trí lấy 1 người có ngày hiệu lực mới nhất (<= ngày báo cáo)
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

	-- 5. Kết quả
	SELECT	ROW_NUMBER() OVER (PARTITION BY kq.NhomGDDH_GDDA ORDER BY kq.SoHoSo) AS _Stt,			-- 1
			kq.*
	FROM
	(
		SELECT	ISNULL(ns.GDDH, N'Chưa khai báo GĐĐH') + N' / ' + ISNULL(ns.GDDA, N'Chưa khai báo GĐDA') AS NhomGDDH_GDDA,
				bc.ProductCostId,
				p.Name AS ProductName,																	-- 2. Dự án
				-- DOANH THU BCTC
				a.DT_Tong,																				-- 3 = tổng mục A
				a.DT_TrucTiep,																			-- 4 = 3 - 5 - 6
				a.DT_NSC,																				-- 5
				a.DT_HST,																				-- 6
				a.VT_CDTCap,																			-- 7
				dtt.DT_TrucTiepGomVT,																	-- 8 = 4 + 7
				-- % DỰ TRÙ BCTC / DOANH THU TRỰC TIẾP (GỒM VT BT, thép CĐT cấp) = cụm dự trù / (8)
				CAST(ROUND(tong.CPNS_BCH / NULLIF(dtt.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL1_CPNS_BCH,			-- 9
				CAST(ROUND(cp.CPNS_TrucTiep / NULLIF(dtt.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL1_CPNS_TrucTiep,	-- 10
				CAST(ROUND(cp.TienMatBCH / NULLIF(dtt.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL1_TienMatBCH,		-- 11
				CAST(ROUND(a.CPNS_NSC / NULLIF(dtt.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL1_CPNS_NSC,				-- 12
				CAST(ROUND(cp.Prelim / NULLIF(dtt.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL1_Prelim,				-- 13
				CAST(ROUND(cp.Defect / NULLIF(dtt.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL1_Defect,				-- 14
				CAST(ROUND(cp.CPTB / NULLIF(dtt.DT_TrucTiepGomVT, 0), 3) AS NUMERIC(18, 3)) AS TL1_CPTB,					-- 15
				hh.HH_Thep AS TL1_HH_Thep,																						-- 16
				hh.HH_BeTong AS TL1_HH_BeTong,																					-- 17
				-- % DỰ TRÙ BCTC / DOANH THU TRỰC TIẾP (KO gồm VT BT, thép CĐT cấp) = cụm dự trù / (4)
				CAST(ROUND(tong.CPNS_BCH / NULLIF(a.DT_TrucTiep, 0), 3) AS NUMERIC(18, 3)) AS TL2_CPNS_BCH,				-- 18
				CAST(ROUND(cp.CPNS_TrucTiep / NULLIF(a.DT_TrucTiep, 0), 3) AS NUMERIC(18, 3)) AS TL2_CPNS_TrucTiep,		-- 19
				CAST(ROUND(cp.TienMatBCH / NULLIF(a.DT_TrucTiep, 0), 3) AS NUMERIC(18, 3)) AS TL2_TienMatBCH,			-- 20
				CAST(ROUND(a.CPNS_NSC / NULLIF(a.DT_TrucTiep, 0), 3) AS NUMERIC(18, 3)) AS TL2_CPNS_NSC,				-- 21
				CAST(ROUND(cp.Prelim / NULLIF(a.DT_TrucTiep, 0), 3) AS NUMERIC(18, 3)) AS TL2_Prelim,					-- 22
				CAST(ROUND(cp.Defect / NULLIF(a.DT_TrucTiep, 0), 3) AS NUMERIC(18, 3)) AS TL2_Defect,					-- 23
				CAST(ROUND(cp.CPTB / NULLIF(a.DT_TrucTiep, 0), 3) AS NUMERIC(18, 3)) AS TL2_CPTB,						-- 24
				hh.HH_Thep AS TL2_HH_Thep,																					-- 25
				hh.HH_BeTong AS TL2_HH_BeTong,																				-- 26
				-- DỰ TRÙ BCTC (lấy cột BCH)
				tong.CPNS_BCH AS DTru_CPNS_BCH,															-- 27 = 28 + 29 + 29a
				cp.CPNS_TrucTiep AS DTru_CPNS_TrucTiep,													-- 28 = GT.1503 - 29a
				cp.TienMatBCH AS DTru_TienMatBCH,														-- 29 = GT.1411
				a.CPNS_NSC AS DTru_CPNS_NSC,															-- 29a = DT NSC * Tỷ lệ CP NS NSC
				cp.Prelim AS DTru_Prelim,																-- 30 = nhóm PRE - GT.2915
				ISNULL(sl.CP_CongNhat, 0) AS DTru_CongNhat,												-- 30a = GT.2901
				cp.Defect AS DTru_Defect,																-- 31 = GT.2915
				cp.CPTB AS DTru_CPTB,																	-- 32 = nhóm TB
				ISNULL(sl.TB_NoiBo, 0) AS DTru_TB_NoiBo,												-- 32a = GT.1203
				ISNULL(sl.TB_ThueCau, 0) AS DTru_TB_ThueCau,											-- 32b = GT.1204
				ISNULL(sl.TB_ThueHoist, 0) AS DTru_TB_ThueHoist,										-- 32c = GT.1205
				ISNULL(sl.TB_ThueKhac, 0) AS DTru_TB_ThueKhac,											-- 32d = GT.1206
				ISNULL(sl.TB_VanChuyen, 0) AS DTru_TB_VanChuyen,										-- 32e = GT.1207
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
				lh.Name AS LoaiHinhDuAn,																-- 43
				-- Chứng từ nguồn để đối chiếu
				bc.CCMBudgetId,
				bc.DocNo AS DocNo_BCTC,
				bc.DocDate AS DocDate_BCTC,
				hh.DocNo_HHThep,
				hh.DocNo_HHBeTong
		FROM #BCTC bc
			 INNER JOIN dbo.B20Product p ON bc.ProductCostId = p.RowId
			 LEFT OUTER JOIN dbo.B20Product pp ON p.ParentId = pp.Id AND pp.IsGroup = 1
			 LEFT OUTER JOIN #SoLieu sl ON bc.CCMBudgetId = sl.CCMBudgetId
			 LEFT OUTER JOIN #HaoHut hh ON bc.ProductCostId = hh.ProductCostId
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
			 OUTER APPLY (SELECT TOP 1 cl.Name
						  FROM dbo.B20Class cl
						  WHERE cl.ParentCode = 'ProjectType'
								AND cl.Code = COALESCE(NULLIF(p.ProjectTypeCode, ''), pp.ProjectTypeCode)) lh
			 CROSS APPLY (SELECT ISNULL(sl.DT_Tong, 0) AS DT_Tong,
								 ISNULL(sl.DT_Tong, 0) - ISNULL(sl.DT_NSC, 0) - ISNULL(sl.DT_HST, 0) AS DT_TrucTiep,
								 ISNULL(sl.DT_NSC, 0) AS DT_NSC,
								 ISNULL(sl.DT_HST, 0) AS DT_HST,
								 ISNULL(bc.TongDinhMuc, 0) AS VT_CDTCap,
								 ROUND(ISNULL(sl.DT_NSC, 0) * ISNULL(bc.HeSoQuanLy, 0), 0) AS CPNS_NSC) a
			 CROSS APPLY (SELECT a.DT_TrucTiep + a.VT_CDTCap AS DT_TrucTiepGomVT) dtt
			 CROSS APPLY (SELECT ISNULL(sl.CP_NhanSuBCH, 0) - a.CPNS_NSC AS CPNS_TrucTiep,
								 ISNULL(sl.CP_TienMatBCH, 0) AS TienMatBCH,
								 ISNULL(sl.CP_Prelim, 0) - ISNULL(sl.CP_Defect, 0) AS Prelim,
								 ISNULL(sl.CP_Defect, 0) AS Defect,
								 ISNULL(sl.CP_TB, 0) AS CPTB) cp
			 CROSS APPLY (SELECT cp.CPNS_TrucTiep + cp.TienMatBCH + a.CPNS_NSC AS CPNS_BCH) tong
	) kq
	ORDER BY kq.NhomGDDH_GDDA, kq.SoHoSo

	DROP TABLE #GoiThau;
	DROP TABLE #BCTC;
	DROP TABLE #SoLieu;
	DROP TABLE #HaoHut;
	DROP TABLE #NhanSu;
END
GO
