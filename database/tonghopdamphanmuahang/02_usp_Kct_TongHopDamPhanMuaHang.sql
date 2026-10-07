SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON	-- Bắt buộc: dùng FOR XML PATH ... .value()
GO
-- =============================================================================
-- Description: TỔNG HỢP ĐÀM PHÁN MUA HÀNG TẬP TRUNG (mẫu "TONG HOP_Rev10")
--
-- Nguồn dữ liệu:
--   - Danh sách gói thầu: B00ProductView.BlockBillIsNotBudgetItem = 1.
--   - Kế hoạch mua hàng VLXD: B30Budget DocCode = 'H7', BudgetTypeCode = '6', TypeXDME = 'XD'.
--     Mỗi gói thầu lấy 1 phiếu mới nhất (BudgetDate <= ngày báo cáo) đã qua CHT
--     = đã gửi duyệt, không hủy, mọi dòng của bước duyệt đầu tiên (CHT CB-012) đã duyệt.
--     Chỉ dòng IsTitleRow = 0 có ItemGroupCode thuộc B20BidPackage (mã GT.xxxx "CC ...");
--     mã nhóm cũ (SONNUOC, VLXD, ...) bị bỏ qua.
--   - Gộp nhiều dòng cùng ItemGroupCode: BD = tổng OriginalAmountBD; bắt đầu = MIN(FromDate);
--     kết thúc = MAX(ToDate); tình trạng = mức thấp nhất (trống = Chưa bắt đầu);
--     % hiệu quả = bình quân gia quyền theo BD; thương hiệu = nối các tên khác nhau.
--   - BCTC: B30CCMBudget K2 mới nhất đã qua CHT, cột BCH = OriginalAmount1, dòng lá (Formula = '').
--   - Trễ = tình trạng khác "Đã chốt" và ngày bắt đầu <= ngày báo cáo.
--   - Cảnh báo chênh lệch: |BCTC - BD| / BCTC > @_MucChenhLech (BCTC = 0 mà có BD cũng cảnh báo).
--   - Bỏ các mã gói thầu thép (tên chứa "THÉP", vd. GT.1401 CC THÉP XÂY DỰNG).
--   - Giá trị HĐ/PLHĐ đã ký (dòng 12): HĐ nối qua B30CCMBudgetDetail.BizDocId_C1 của BCTC ở trên (dòng BCTC mang
--     mã gói thầu). Giá trị = HĐ C3.ContractValue + tổng SubContractValue các PLHĐ C4 (ParentBizDocId = HĐ);
--     chỉ tính chứng từ hoàn thiện duyệt, không hủy, ngày chứng từ <= ngày báo cáo. Mỗi HĐ tính 1 lần / gói thầu x mã.
--   - Nhân sự: PTDA = CB-008, GĐĐH = CB-077, GĐDA = CB-002 (B20ProductHuman).
--   - Vùng miền: B20Product.TerritoryCode (MB/MN/MT) của gói thầu, trống thì lấy của dự án cha.
--
-- Kết quả (5 bảng):
--   0. Tổng giá trị BD theo tình trạng x vùng miền (không phụ thuộc lọc tình trạng).
--   1. Hiệu quả đàm phán gói đã chốt x vùng miền.
--   2. Danh sách cột động: ColOrder, ItemGroupCode, ColName.
--   3. Dòng chi tiết: RowNo, RowType, ItemNo, NoiDung, Kind (N số / P phần trăm / T chữ), TongCong, ...
--   4. Ô chi tiết: RowNo, ItemGroupCode, Num, Txt, Style (CHOT / DANGDP / CHUADP / TRE / CHECK).
--
-- EXEC dbo.usp_Kct_TongHopDamPhanMuaHang @_DocDate = '20261006', @_TinhTrang = 1, @_ChiTiet = 1,
--      @_MucChenhLech = 0.2, @_nUserId = 0, @_Ma_Dvcs = N'N01'
--
-- 06/10/2026: Tạo mới
-- 06/10/2026: Thêm bản "Rút gọn - Kế hoạch và BCTC" (@_ChiTiet = 5), bỏ mã thép, thêm dòng 12 Giá trị HĐ/PLHĐ đã ký
-- =============================================================================
CREATE OR ALTER PROC dbo.usp_Kct_TongHopDamPhanMuaHang
	@_DocDate SMALLDATETIME			= NULL,		-- Ngày báo cáo (căn cứ xác định "Trễ"), NULL = hôm nay
	@_TinhTrang TINYINT				= 1,		-- 1: Toàn bộ; 2: Còn lại (bỏ các gói "Đã chốt")
	@_ChiTiet TINYINT				= 1,		-- 1: Đầy đủ; 2: Rút gọn - Gói thầu (1,2,4,5); 3: Rút gọn - Giá trị (1,4,7,8); 4: Chỉ BD (1);
												-- 5: Rút gọn - Kế hoạch và BCTC (1,9,10,11)
	@_MucChenhLech NUMERIC(8, 4)	= 0.2,		-- Mức chênh lệch BCTC và KH muốn cảnh báo (0.2 = 20%)
	@_nUserId INT					= 0,
	@_LangId INT					= 0,
	@_Ma_Dvcs NCHAR(3)				= N'N01',
	@_DocDateStr VARCHAR(10)		= '' OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT	@_DocDate = ISNULL(@_DocDate, CAST(GETDATE() AS DATE)),
			@_TinhTrang = ISNULL(@_TinhTrang, 1),
			@_ChiTiet = ISNULL(@_ChiTiet, 1),
			@_MucChenhLech = ISNULL(NULLIF(@_MucChenhLech, 0), 0.2),
			@_Ma_Dvcs = RTRIM(@_Ma_Dvcs)

	SET @_DocDateStr = CONVERT(VARCHAR(10), @_DocDate, 103)

	-- Danh sách gói thầu được theo dõi
	IF OBJECT_ID('Tempdb..#GoiThau') IS NOT NULL DROP TABLE #GoiThau
	SELECT	p.RowId AS ProductCostId,
			p.Code,
			p.Name AS TenDuAn,
			COALESCE(NULLIF(pp.ShortName, N''), NULLIF(p.ShortName, N''), p.Code) AS TenNganDA,
			p.ShortName AS TenNganPKT,
			CASE COALESCE(NULLIF(p.TerritoryCode, ''), pp.TerritoryCode)
				WHEN 'MB' THEN 'MB' WHEN 'MN' THEN 'MN' WHEN 'MT' THEN 'MT' ELSE 'KHAC' END AS Mien
	INTO #GoiThau
	FROM dbo.B00ProductView v
		 INNER JOIN dbo.B20Product p ON v.ProductCostId = p.RowId
		 LEFT OUTER JOIN dbo.B20Product pp ON p.ParentId = pp.Id AND pp.IsGroup = 1
	WHERE v.BlockBillIsNotBudgetItem = 1
		  AND v.IsActive = 1
		  AND p.IsActive = 1

	-- 1. Kế hoạch mua hàng mới nhất đã qua CHT của từng gói thầu
	IF OBJECT_ID('Tempdb..#KH') IS NOT NULL DROP TABLE #KH
	;WITH Temp AS
	(
		SELECT	bud.Stt, bud.ProductCostId,
				ROW_NUMBER() OVER (PARTITION BY bud.ProductCostId ORDER BY bud.BudgetDate DESC, bud.DocNo DESC, bud.Id DESC) AS _Rn
		FROM dbo.B30Budget bud
			 INNER JOIN #GoiThau gt ON bud.ProductCostId = gt.ProductCostId
			 CROSS APPLY (SELECT COUNT(*) AS SoDong,
								 SUM(IIF(a.ApproveStatus = '1', 1, 0)) AS SoDaDuyet
						  FROM dbo.B30BizDocApprove a
						  WHERE a.BizDocId = bud.Stt
								AND a.ApproveGroup = (SELECT MIN(a2.ApproveGroup)
													  FROM dbo.B30BizDocApprove a2
													  WHERE a2.BizDocId = bud.Stt)) buoc1
		WHERE bud.DocCode = 'H7'
			  AND bud.BudgetTypeCode = '6'
			  AND bud.TypeXDME = 'XD'
			  AND bud.IsActive = 1
			  AND bud.BranchCode = @_Ma_Dvcs
			  AND bud.BudgetDate <= @_DocDate
			  AND bud.ApproveSend = 1
			  AND bud.ClosedApprove = 0
			  AND buoc1.SoDong > 0
			  AND buoc1.SoDaDuyet = buoc1.SoDong
	)
	SELECT Stt, ProductCostId
	INTO #KH
	FROM Temp
	WHERE _Rn = 1

	-- Dòng chi tiết kế hoạch (chỉ mã GT.xxxx)
	IF OBJECT_ID('Tempdb..#KHDong') IS NOT NULL DROP TABLE #KHDong
	SELECT	kh.ProductCostId,
			LTRIM(RTRIM(d.ItemGroupCode)) AS ItemGroupCode,
			d.OriginalAmountBD,
			d.FromDate,
			d.ToDate,
			IIF(d.NegotiationStatus IN (N'2', N'3'), d.NegotiationStatus, N'1') AS TinhTrang,
			d.EfficiencyRate,
			LTRIM(RTRIM(d.TradeMarkCode)) AS TradeMarkCode
	INTO #KHDong
	FROM #KH kh
		 INNER JOIN dbo.B30BudgetDetail d ON kh.Stt = d.Stt
		 INNER JOIN dbo.B20BidPackage bp ON LTRIM(RTRIM(d.ItemGroupCode)) = bp.Code
	WHERE d.IsTitleRow = 0
		  AND bp.Name NOT LIKE N'%THÉP%'

	-- Cột động
	IF OBJECT_ID('Tempdb..#Cot') IS NOT NULL DROP TABLE #Cot
	SELECT	ROW_NUMBER() OVER (ORDER BY bp.Name, bp.Code) AS ColOrder,
			bp.Code AS ItemGroupCode,
			LTRIM(RTRIM(bp.Name)) AS ColName
	INTO #Cot
	FROM dbo.B20BidPackage bp
	WHERE bp.Code IN (SELECT ItemGroupCode FROM #KHDong)

	-- Gộp theo gói thầu x mã nhóm
	IF OBJECT_ID('Tempdb..#KHGoi') IS NOT NULL DROP TABLE #KHGoi
	SELECT	ProductCostId,
			ItemGroupCode,
			SUM(OriginalAmountBD) AS BD,
			MIN(FromDate) AS FromDate,
			MAX(ToDate) AS ToDate,
			MIN(TinhTrang) AS TinhTrang,
			CAST(SUM(OriginalAmountBD * EfficiencyRate) / NULLIF(SUM(OriginalAmountBD), 0) AS NUMERIC(18, 6)) AS HieuQua,
			MAX(IIF(EfficiencyRate <> 0, 1, 0)) AS CoHieuQua
	INTO #KHGoi
	FROM #KHDong
	GROUP BY ProductCostId, ItemGroupCode

	-- 2. BCTC mới nhất đã qua CHT, cột BCH, chỉ các mã đang làm cột
	IF OBJECT_ID('Tempdb..#BCTC') IS NOT NULL DROP TABLE #BCTC
	;WITH Temp AS
	(
		SELECT	bud.CCMBudgetId, bud.ProductCostId,
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
	SELECT CCMBudgetId, ProductCostId
	INTO #BCTCPhieu
	FROM Temp
	WHERE _Rn = 1

	SELECT	t.ProductCostId,
			c.ItemGroupCode,
			SUM(dt.OriginalAmount1) AS BCTC
	INTO #BCTC
	FROM #BCTCPhieu t
		 INNER JOIN dbo.B30CCMBudgetDetail dt ON t.CCMBudgetId = dt.CCMBudgetId
		 INNER JOIN #Cot c ON LTRIM(RTRIM(dt.ItemGroupCode)) = c.ItemGroupCode
	WHERE dt.Formula = ''
	GROUP BY t.ProductCostId, c.ItemGroupCode

	-- HĐ/PLHĐ đã ký: HĐ khai báo trên dòng BCTC (BizDocId_C1), mỗi HĐ 1 lần / gói thầu x mã
	IF OBJECT_ID('Tempdb..#HD') IS NOT NULL DROP TABLE #HD
	;WITH HD AS
	(
		SELECT DISTINCT t.ProductCostId, c.ItemGroupCode, dt.BizDocId_C1 AS BizDocId
		FROM #BCTCPhieu t
			 INNER JOIN dbo.B30CCMBudgetDetail dt ON t.CCMBudgetId = dt.CCMBudgetId
			 INNER JOIN #Cot c ON LTRIM(RTRIM(dt.ItemGroupCode)) = c.ItemGroupCode
		WHERE ISNULL(dt.BizDocId_C1, '') <> ''
	)
	SELECT	hd.ProductCostId,
			hd.ItemGroupCode,
			SUM(h.ContractValue + ISNULL(pl.SubContractValue, 0)) AS GiaTriHD
	INTO #HD
	FROM HD hd
		 INNER JOIN dbo.B30BizDoc h ON hd.BizDocId = h.BizDocId
		 OUTER APPLY (SELECT SUM(p.SubContractValue) AS SubContractValue
					  FROM dbo.B30BizDoc p
					  WHERE p.ParentBizDocId = h.BizDocId
							AND p.DocCode = 'C4'
							AND p.IsActive = 1
							AND p.CompletedApprove = 1
							AND p.ClosedApprove = 0
							AND p.DocDate <= @_DocDate) pl
	WHERE h.DocCode = 'C3'
		  AND h.IsActive = 1
		  AND h.CompletedApprove = 1
		  AND h.ClosedApprove = 0
		  AND h.DocDate <= @_DocDate
	GROUP BY hd.ProductCostId, hd.ItemGroupCode

	-- 3. Ô dữ liệu gói thầu x mã nhóm (hợp KH và BCTC)
	IF OBJECT_ID('Tempdb..#Goi') IS NOT NULL DROP TABLE #Goi
	SELECT	k.ProductCostId,
			k.ItemGroupCode,
			ISNULL(g.BD, 0) AS BD,
			g.FromDate,
			g.ToDate,
			ISNULL(g.TinhTrang, N'1') AS TinhTrang,
			IIF(g.CoHieuQua = 1, g.HieuQua, NULL) AS HieuQua,
			ISNULL(b.BCTC, 0) AS BCTC,
			IIF(ISNULL(g.TinhTrang, N'1') <> N'3' AND g.FromDate <= @_DocDate, 1, 0) AS IsTre,
			IIF(g.ProductCostId IS NULL, 0, 1) AS CoKH,
			IIF(b.ProductCostId IS NULL, 0, 1) AS CoBCTC,
			hd.GiaTriHD,
			CAST(N'' AS NVARCHAR(1000)) AS ThuongHieu
	INTO #Goi
	FROM (SELECT ProductCostId, ItemGroupCode FROM #KHGoi
		  UNION
		  SELECT ProductCostId, ItemGroupCode FROM #BCTC) k
		 LEFT OUTER JOIN #KHGoi g ON k.ProductCostId = g.ProductCostId AND k.ItemGroupCode = g.ItemGroupCode
		 LEFT OUTER JOIN #BCTC b ON k.ProductCostId = b.ProductCostId AND k.ItemGroupCode = b.ItemGroupCode
		 LEFT OUTER JOIN #HD hd ON k.ProductCostId = hd.ProductCostId AND k.ItemGroupCode = hd.ItemGroupCode

	-- Thương hiệu được duyệt: nối các tên khác nhau
	UPDATE g
	SET ThuongHieu = ISNULL(STUFF((SELECT DISTINCT N', ' + ISNULL(tm.Name, d.TradeMarkCode)
								   FROM #KHDong d
										LEFT OUTER JOIN dbo.B20TradeMark tm ON d.TradeMarkCode = tm.Code
								   WHERE d.ProductCostId = g.ProductCostId
										 AND d.ItemGroupCode = g.ItemGroupCode
										 AND d.TradeMarkCode <> N''
								   FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 2, N''), N'')
	FROM #Goi g

	-- 4. Nhân sự dự án
	IF OBJECT_ID('Tempdb..#NhanSu') IS NOT NULL DROP TABLE #NhanSu
	SELECT	gt.ProductCostId,
			(SELECT TOP 1 e.Name FROM dbo.B20ProductHuman ph INNER JOIN dbo.B20Employee e ON ph.EmployeeCode = e.Code
			 WHERE ph.ProductCostId = gt.ProductCostId AND ph.PositionCode = N'CB-008' AND ph.IsActive = 1
				   AND (ph.ApplyDate IS NULL OR ph.ApplyDate <= @_DocDate)
			 ORDER BY ISNULL(ph.ApplyDate, '19000101') DESC, ph.Id DESC) AS PTDA,
			(SELECT TOP 1 e.Name FROM dbo.B20ProductHuman ph INNER JOIN dbo.B20Employee e ON ph.EmployeeCode = e.Code
			 WHERE ph.ProductCostId = gt.ProductCostId AND ph.PositionCode = N'CB-077' AND ph.IsActive = 1
				   AND (ph.ApplyDate IS NULL OR ph.ApplyDate <= @_DocDate)
			 ORDER BY ISNULL(ph.ApplyDate, '19000101') DESC, ph.Id DESC) AS GDDH,
			(SELECT TOP 1 e.Name FROM dbo.B20ProductHuman ph INNER JOIN dbo.B20Employee e ON ph.EmployeeCode = e.Code
			 WHERE ph.ProductCostId = gt.ProductCostId AND ph.PositionCode = N'CB-002' AND ph.IsActive = 1
				   AND (ph.ApplyDate IS NULL OR ph.ApplyDate <= @_DocDate)
			 ORDER BY ISNULL(ph.ApplyDate, '19000101') DESC, ph.Id DESC) AS GDDA
	INTO #NhanSu
	FROM #GoiThau gt
	WHERE gt.ProductCostId IN (SELECT ProductCostId FROM #Goi)

	-- ===== Bảng 0: Tổng giá trị BD theo tình trạng x vùng miền =====
	;WITH Nhom AS
	(
		SELECT	g.BD, g.TinhTrang, g.IsTre, gt.Mien
		FROM #Goi g INNER JOIN #GoiThau gt ON g.ProductCostId = gt.ProductCostId
		WHERE g.CoKH = 1
	),
	Dong AS
	(
		SELECT * FROM (VALUES
			(1, N'Các gói đã đàm phán xong',	'CHOT',		N'= BD các gói có trạng thái "Đã chốt"'),
			(2, N'Các gói đang đàm phán',		'DANGDP',	N'= BD các gói có trạng thái "Đang đàm phán"'),
			(3, N'Trong đó gói trễ',			'TRE',		N'= BD các gói "Đang đàm phán" và "Ngày bắt đầu" <= "Ngày báo cáo"'),
			(4, N'Các gói chưa đàm phán',		'CHUADP',	N'= BD các gói KHÔNG phải "Đã chốt", "Đang đàm phán"'),
			(5, N'Trong đó gói trễ',			'TRE',		N'= BD các gói chưa đàm phán và "Ngày bắt đầu" <= "Ngày báo cáo"')
		) v (Stt, NoiDung, _Style, CachLay)
	)
	SELECT	d.Stt, d.NoiDung, d.CachLay, d._Style,
			SUM(n.BD) AS CaNuoc,
			SUM(IIF(n.Mien = 'MB', n.BD, 0)) AS MienBac,
			SUM(IIF(n.Mien = 'MN', n.BD, 0)) AS MienNam,
			SUM(IIF(n.Mien = 'MT', n.BD, 0)) AS MienTrung
	FROM Dong d
		 LEFT OUTER JOIN Nhom n ON (d.Stt = 1 AND n.TinhTrang = N'3')
								OR (d.Stt = 2 AND n.TinhTrang = N'2')
								OR (d.Stt = 3 AND n.TinhTrang = N'2' AND n.IsTre = 1)
								OR (d.Stt = 4 AND n.TinhTrang = N'1')
								OR (d.Stt = 5 AND n.TinhTrang = N'1' AND n.IsTre = 1)
	GROUP BY d.Stt, d.NoiDung, d.CachLay, d._Style
	ORDER BY d.Stt

	-- ===== Bảng 1: Hiệu quả đàm phán (gói đã chốt) =====
	;WITH Chot AS
	(
		SELECT	gt.Mien, g.BD, g.BD * ISNULL(g.HieuQua, 0) AS HQ
		FROM #Goi g INNER JOIN #GoiThau gt ON g.ProductCostId = gt.ProductCostId
		WHERE g.CoKH = 1 AND g.TinhTrang = N'3'
	),
	Tong AS
	(
		SELECT	SUM(BD) AS BD_CN, SUM(IIF(Mien = 'MB', BD, 0)) AS BD_MB, SUM(IIF(Mien = 'MN', BD, 0)) AS BD_MN, SUM(IIF(Mien = 'MT', BD, 0)) AS BD_MT,
				SUM(HQ) AS HQ_CN, SUM(IIF(Mien = 'MB', HQ, 0)) AS HQ_MB, SUM(IIF(Mien = 'MN', HQ, 0)) AS HQ_MN, SUM(IIF(Mien = 'MT', HQ, 0)) AS HQ_MT
		FROM Chot
	)
	SELECT v.Stt, v.NoiDung, v.Kind, v.CaNuoc, v.MienBac, v.MienNam, v.MienTrung
	FROM Tong t
		 CROSS APPLY (VALUES
			(1, N'Giá trị gói thầu',	'N', t.BD_CN, t.BD_MB, t.BD_MN, t.BD_MT),
			(2, N'Hiệu quả đàm phán',	'N', ROUND(t.HQ_CN, 0), ROUND(t.HQ_MB, 0), ROUND(t.HQ_MN, 0), ROUND(t.HQ_MT, 0)),
			(3, N'% hiệu quả',			'P', t.HQ_CN / NULLIF(t.BD_CN, 0), t.HQ_MB / NULLIF(t.BD_MB, 0), t.HQ_MN / NULLIF(t.BD_MN, 0), t.HQ_MT / NULLIF(t.BD_MT, 0))
		 ) v (Stt, NoiDung, Kind, CaNuoc, MienBac, MienNam, MienTrung)
	ORDER BY v.Stt

	-- ===== Bảng 2: cột động =====
	SELECT ColOrder, ItemGroupCode, ColName FROM #Cot ORDER BY ColOrder

	-- ===== Bảng chi tiết: lọc tình trạng, dựng dòng và ô =====
	IF OBJECT_ID('Tempdb..#GoiLoc') IS NOT NULL DROP TABLE #GoiLoc
	SELECT g.*, gt.Mien
	INTO #GoiLoc
	FROM #Goi g INNER JOIN #GoiThau gt ON g.ProductCostId = gt.ProductCostId
	WHERE @_TinhTrang = 1 OR g.TinhTrang <> N'3'

	-- Danh mục 11 dòng nội dung và dòng được hiện theo mức chi tiết
	DECLARE @_NoiDung TABLE (ItemNo TINYINT, NoiDung NVARCHAR(128), Kind CHAR(1))
	INSERT INTO @_NoiDung (ItemNo, NoiDung, Kind)
	VALUES	(1,  N'Giá trị (BD)', 'N'),
			(2,  N'Thời gian bắt đầu sử dụng', 'T'),
			(3,  N'Thời gian kết thúc sử dụng', 'T'),
			(4,  N'Tình trạng đàm phán', 'T'),
			(5,  N'Cảnh báo tình trạng', 'T'),
			(6,  N'Thương hiệu được duyệt', 'T'),
			(7,  N'Hiệu quả so với BD (%)', 'P'),
			(8,  N'Hiệu quả so với BD (VNĐ)', 'N'),
			(9,  N'Giá trị BCTC', 'N'),
			(10, N'Chênh lệch BCTC và KH MH', 'N'),
			(11, N'Cảnh báo chênh lệch >' + FORMAT(@_MucChenhLech * 100, '0.##') + N'%', 'T'),
			(12, N'Giá trị HĐ/PLHĐ đã ký', 'N')

	DELETE FROM @_NoiDung
	WHERE NOT (@_ChiTiet = 1
			   OR (@_ChiTiet = 2 AND ItemNo IN (1, 2, 4, 5))
			   OR (@_ChiTiet = 3 AND ItemNo IN (1, 4, 7, 8))
			   OR (@_ChiTiet = 4 AND ItemNo = 1)
			   OR (@_ChiTiet = 5 AND ItemNo IN (1, 9, 10, 11)))

	-- Ô chi tiết theo gói thầu
	IF OBJECT_ID('Tempdb..#O') IS NOT NULL DROP TABLE #O
	SELECT	g.ProductCostId, g.ItemGroupCode, v.ItemNo, v.Num, v.Txt, v._Style
	INTO #O
	FROM #GoiLoc g
		 CROSS APPLY (SELECT IIF(g.HieuQua IS NULL, NULL, ROUND(g.BD * g.HieuQua, 0)) AS HQ,
							 g.BCTC - g.BD AS ChenhLech,
							 IIF(g.CoKH = 1 AND (g.BCTC = 0 OR ABS(g.BCTC - g.BD) / NULLIF(g.BCTC, 0) > @_MucChenhLech), 1, 0) AS CanhBao) x
		 CROSS APPLY (VALUES
			(1,  IIF(g.CoKH = 1, g.BD, NULL), NULL, NULL),
			(2,  NULL, CONVERT(NVARCHAR(10), g.FromDate, 103), NULL),
			(3,  NULL, CONVERT(NVARCHAR(10), g.ToDate, 103), NULL),
			(4,  NULL, IIF(g.CoKH = 1, CASE g.TinhTrang WHEN N'3' THEN N'Đã chốt' WHEN N'2' THEN N'Đang đàm phán' ELSE N'Chưa bắt đầu' END, NULL),
					   IIF(g.CoKH = 1, CASE g.TinhTrang WHEN N'3' THEN 'CHOT' WHEN N'2' THEN 'DANGDP' ELSE 'CHUADP' END, NULL)),
			(5,  NULL, IIF(g.IsTre = 1, N'TRỄ', NULL), IIF(g.IsTre = 1, 'TRE', NULL)),
			(6,  NULL, NULLIF(g.ThuongHieu, N''), NULL),
			(7,  g.HieuQua, NULL, NULL),
			(8,  x.HQ, NULL, NULL),
			(9,  IIF(g.CoBCTC = 1, g.BCTC, NULL), NULL, NULL),
			(10, IIF(g.CoKH = 1 OR g.CoBCTC = 1, x.ChenhLech, NULL), NULL, NULL),
			(11, NULL, IIF(x.CanhBao = 1, N'Check lại', NULL), IIF(x.CanhBao = 1, 'CHECK', NULL)),
			(12, g.GiaTriHD, NULL, NULL)
		 ) v (ItemNo, Num, Txt, _Style)
	WHERE v.ItemNo IN (SELECT ItemNo FROM @_NoiDung)
		  AND (v.Num IS NOT NULL OR v.Txt IS NOT NULL)

	-- Khung dòng: tổng cộng, tổng vùng miền, từng gói thầu x nội dung
	IF OBJECT_ID('Tempdb..#Dong') IS NOT NULL DROP TABLE #Dong
	CREATE TABLE #Dong
	(
		RowNo INT IDENTITY(1, 1),
		RowType VARCHAR(16),			-- TONG_KH, TONG_BCTC, MIEN_KH, MIEN_BCTC, CHITIET
		Mien VARCHAR(8),
		ProductCostId NVARCHAR(16),
		STT INT,
		ItemNo TINYINT,
		NoiDung NVARCHAR(256),
		Kind CHAR(1),
		IsTre BIT
	)

	INSERT INTO #Dong (RowType, Mien, ProductCostId, STT, ItemNo, NoiDung, Kind, IsTre)
	VALUES	('TONG_KH', '', NULL, NULL, 1, N'TỔNG CỘNG KẾ HOẠCH MUA HÀNG', 'N', 0),
			('TONG_BCTC', '', NULL, NULL, 9, N'TỔNG CỘNG DỰ TRÙ VẬT TƯ TRONG BCTC', 'N', 0)

	DECLARE @_Mien TABLE (Ord INT, Mien VARCHAR(8), Ten NVARCHAR(64))
	INSERT INTO @_Mien VALUES (1, 'MB', N'MIỀN BẮC'), (2, 'MN', N'MIỀN NAM'), (3, 'MT', N'MIỀN TRUNG'), (4, 'KHAC', N'CHƯA PHÂN VÙNG')

	DECLARE @_Ord INT = 1, @_M VARCHAR(8), @_TenMien NVARCHAR(64)
	WHILE @_Ord <= 4
	BEGIN
		SELECT @_M = Mien, @_TenMien = Ten FROM @_Mien WHERE Ord = @_Ord

		IF EXISTS (SELECT 1 FROM #GoiLoc WHERE Mien = @_M)
		BEGIN
			INSERT INTO #Dong (RowType, Mien, ProductCostId, STT, ItemNo, NoiDung, Kind, IsTre)
			VALUES	('MIEN_KH', @_M, NULL, NULL, 1, @_TenMien + N' (GIÁ TRỊ KẾ HOẠCH MUA HÀNG)', 'N', 0),
					('MIEN_BCTC', @_M, NULL, NULL, 9, @_TenMien + N' (DỰ TRÙ BCTC)', 'N', 0)

			INSERT INTO #Dong (RowType, Mien, ProductCostId, STT, ItemNo, NoiDung, Kind, IsTre)
			SELECT	'CHITIET', @_M, da.ProductCostId, da.STT, nd.ItemNo, nd.NoiDung, nd.Kind,
					IIF(nd.ItemNo = 5 AND EXISTS (SELECT 1 FROM #GoiLoc t WHERE t.ProductCostId = da.ProductCostId AND t.IsTre = 1), 1, 0)
			FROM (SELECT	gt.ProductCostId,
							ROW_NUMBER() OVER (ORDER BY gt.TenNganDA, gt.Code) AS STT
				  FROM #GoiThau gt
				  WHERE gt.Mien = @_M
						AND gt.ProductCostId IN (SELECT ProductCostId FROM #GoiLoc)) da
				 CROSS JOIN @_NoiDung nd
			ORDER BY da.STT, nd.ItemNo
		END

		SET @_Ord += 1
	END

	-- ===== Bảng 3: dòng chi tiết =====
	SELECT	d.RowNo, d.RowType, d.Mien, d.STT, d.ItemNo, d.NoiDung, d.Kind, d.IsTre,
			CASE
				WHEN d.RowType IN ('TONG_KH', 'MIEN_KH')
					THEN (SELECT SUM(o.Num) FROM #O o INNER JOIN #GoiLoc g ON o.ProductCostId = g.ProductCostId AND o.ItemGroupCode = g.ItemGroupCode
						  WHERE o.ItemNo = 1 AND (d.Mien = '' OR g.Mien = d.Mien))
				WHEN d.RowType IN ('TONG_BCTC', 'MIEN_BCTC')
					THEN (SELECT SUM(g.BCTC) FROM #GoiLoc g WHERE d.Mien = '' OR g.Mien = d.Mien)
				WHEN d.Kind = 'N'
					THEN (SELECT SUM(o.Num) FROM #O o WHERE o.ProductCostId = d.ProductCostId AND o.ItemNo = d.ItemNo)
			END AS TongCong,
			gt.TenNganDA,
			ns.PTDA, ns.GDDH, ns.GDDA,
			gt.TenDuAn,
			gt.TenNganPKT,
			gt.Code AS SoHoSo
	FROM #Dong d
		 LEFT OUTER JOIN #GoiThau gt ON d.ProductCostId = gt.ProductCostId
		 LEFT OUTER JOIN #NhanSu ns ON d.ProductCostId = ns.ProductCostId
	ORDER BY d.RowNo

	-- ===== Bảng 4: ô chi tiết =====
	SELECT d.RowNo, o.ItemGroupCode, o.Num, o.Txt, o._Style
	FROM #Dong d
		 INNER JOIN #O o ON d.ProductCostId = o.ProductCostId AND d.ItemNo = o.ItemNo
	WHERE d.RowType = 'CHITIET'
	UNION ALL
	SELECT d.RowNo, g.ItemGroupCode, SUM(IIF(d.ItemNo = 1, IIF(g.CoKH = 1, g.BD, 0), g.BCTC)), NULL, NULL
	FROM #Dong d
		 INNER JOIN #GoiLoc g ON d.Mien = '' OR g.Mien = d.Mien
	WHERE d.RowType <> 'CHITIET'
	GROUP BY d.RowNo, g.ItemGroupCode
	ORDER BY 1, 2

	DROP TABLE #GoiThau;
	DROP TABLE #KH;
	DROP TABLE #KHDong;
	DROP TABLE #Cot;
	DROP TABLE #KHGoi;
	DROP TABLE #BCTCPhieu;
	DROP TABLE #BCTC;
	DROP TABLE #HD;
	DROP TABLE #Goi;
	DROP TABLE #NhanSu;
	DROP TABLE #GoiLoc;
	DROP TABLE #O;
	DROP TABLE #Dong;
END
GO
