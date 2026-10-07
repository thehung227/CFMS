SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ============================================
-- Description: BÁO CÁO NHANH SẢN LƯỢNG BÊ TÔNG DỰ ÁN
--              (mẫu "Copy of TONG HOP_Rev06.xlsx" - sheet "Báo cáo nhanh _ DA")
--
-- Nguồn dữ liệu: giống usp_Kct_BaoCaoKeHoachBeTong_TongHop (database/baocaokehoachbetongtonghop/)
--   - Kế hoạch bê tông B30Budget DocCode 'H9' / BudgetTypeCode '6' (DocNo .../KHBT/nnn),
--     mỗi gói thầu lấy phiếu mới nhất (BudgetDate <= @_DocDate) ĐÃ QUA CHT
--     (hoàn thành bước duyệt đầu tiên - quy trình P-261 bước 1 là CB-012 Chỉ huy trưởng XD).
--   - Dòng BOQ bê tông: B30BudgetDetail ItemGroupCode = 'BETONG'
--     (QuantityBOQ / OriginalAmountBD = BOQ, UnitCostBD = đơn giá BĐ chưa VAT, ConcerlossRate = % hao hụt).
--   - Khối lượng theo tháng: B30ConcreteBudget (Z1) + B30ConcreteBudgetDetail (Description = năm, Quantity01..12).
--     Dòng chi tiết bỏ trống cột Năm -> suy năm = YEAR(BudgetDate) (cột IsThieuNam của báo cáo tổng hợp).
--     Trùng năm trên cùng dòng BOQ -> ưu tiên dòng có khối lượng, rồi đến dòng mới nhất.
--
-- Kết quả: 1 result set theo tháng, đúng thứ tự mẫu Excel:
--     "Đã thực hiện" (nhóm) -> các tháng <= tháng báo cáo
--     "Chưa thực hiện" (nhóm) -> các tháng > tháng báo cáo
--     "TỔNG"
--   Cột: Thang, RowLevel (0 = nhóm, 1 = tháng, 2 = tổng), _FormatStyleKey,
--        QuantityBOQ, AmountBOQ (BOQ là số của cả dự án, lặp lại ở mọi dòng để lưới web gộp ô dọc),
--        QuantityChuaHH, AmountChuaHH, QuantityGomHH, AmountGomHH
--   Gồm hao hụt = khối lượng x (1 + ConcerlossRate); thành tiền = khối lượng x UnitCostBD (chưa VAT).
--
-- 6 chỉ số tổng ở đầu mẫu Excel trả bằng tham số OUTPUT (web hiển thị qua {VAR=...} ở phần title):
--   @_ProductName, @_DocNo, @_TongKLBOQ, @_TongGTBOQ, @_TongKLChuaHH, @_TongGTChuaHH, @_TongKLGomHH, @_TongGTGomHH
--
-- EXEC dbo.usp_Kct_BaoCaoNhanhSanLuongBeTong_DuAn @_ProductCostId = N'PROD001917', @_DocDate = '20260924'
--
-- 24/09/2026: Tạo mới
-- ============================================
CREATE OR ALTER PROC dbo.usp_Kct_BaoCaoNhanhSanLuongBeTong_DuAn
	@_ProductCostId NVARCHAR(24)	= N'',		-- Gói thầu (bắt buộc)
	@_DocDate SMALLDATETIME			= NULL,		-- Ngày báo cáo, NULL = hôm nay. Tháng <= tháng này = "Đã thực hiện"
	@_nUserId INT					= 0,
	@_LangId INT					= 0,
	@_Ma_Dvcs NCHAR(3)				= N'N01',
	@_DocDateStr VARCHAR(10)		= '' OUTPUT,
	@_ProductName NVARCHAR(256)		= N'' OUTPUT,
	@_DocNo NVARCHAR(64)			= N'' OUTPUT,
	@_TongKLBOQ NVARCHAR(32)		= N'' OUTPUT,
	@_TongGTBOQ NVARCHAR(32)		= N'' OUTPUT,
	@_TongKLChuaHH NVARCHAR(32)		= N'' OUTPUT,
	@_TongGTChuaHH NVARCHAR(32)		= N'' OUTPUT,
	@_TongKLGomHH NVARCHAR(32)		= N'' OUTPUT,
	@_TongGTGomHH NVARCHAR(32)		= N'' OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT	@_DocDate = ISNULL(@_DocDate, CAST(GETDATE() AS DATE)),
			@_ProductCostId = LTRIM(RTRIM(ISNULL(@_ProductCostId, N''))),
			@_Ma_Dvcs = RTRIM(@_Ma_Dvcs)

	SET @_DocDateStr = CONVERT(VARCHAR(10), @_DocDate, 103)

	DECLARE @_NamThangBC INT = YEAR(@_DocDate) * 100 + MONTH(@_DocDate)

	SELECT	@_ProductName = IIF(RTRIM(p.ShortName) = N'', RTRIM(p.Name), RTRIM(p.ShortName) + N' - ' + RTRIM(p.Name))
	FROM dbo.B20Product p
	WHERE p.RowId = @_ProductCostId

	-- Phân quyền: người dùng thường chỉ xem gói thầu mình tham gia (khi tầng API có truyền @_nUserId)
	IF ISNULL(@_nUserId, 0) > 0
	BEGIN
		DECLARE @_Ma_CbNv NVARCHAR(16) = N'',
				@_IsAdmin BIT = 0

		SELECT	@_Ma_CbNv = ISNULL(u.Ma_CbNv, N''),
				@_IsAdmin = IIF(ISNULL(u.IsAdmin, 0) = 1 OR ISNULL(u.IsSystemAdmin, 0) = 1
								OR EXISTS (SELECT 1 FROM dbo.vB00UserRole r WHERE r.UserId = u.Id AND r.RoleId = 1), 1, 0)
		FROM dbo.B00UserList u
		WHERE u.Id = @_nUserId

		IF @_IsAdmin = 0
		   AND NOT EXISTS (SELECT 1 FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien(@_Ma_CbNv) WHERE RowId = @_ProductCostId)
			SET @_ProductCostId = N'##KHONG_CO_QUYEN##'		-- Không có quyền: báo cáo trả rỗng
	END

	-- 1. Kế hoạch bê tông mới nhất đã qua CHT của gói thầu
	IF OBJECT_ID('Tempdb..#KeHoach') IS NOT NULL DROP TABLE #KeHoach
	;WITH Temp AS
	(
		SELECT	bud.Stt, bud.ProductCostId, RTRIM(bud.DocNo) AS DocNo, bud.BudgetDate,
				ROW_NUMBER() OVER (PARTITION BY bud.ProductCostId ORDER BY bud.BudgetDate DESC, bud.DocNo DESC, bud.Id DESC) AS _Rn
		FROM dbo.B30Budget bud
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
			  AND bud.ProductCostId = @_ProductCostId
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

	SELECT TOP (1) @_DocNo = DocNo FROM #KeHoach

	-- 2. Dòng BOQ bê tông + phiếu chi tiết tháng (Z1) mới nhất của dòng đó
	IF OBJECT_ID('Tempdb..#Dong') IS NOT NULL DROP TABLE #Dong
	SELECT	dt.Id AS BudgetDetailId,
			dt.QuantityBOQ,
			dt.OriginalAmountBD,
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

	-- 3. Số liệu theo từng tháng
	IF OBJECT_ID('Tempdb..#Fact') IS NOT NULL DROP TABLE #Fact
	;WITH Nam AS
	(
		SELECT	g.BudgetDetailId, g.UnitCostBD, g.ConcerlossRate, nam.YearNo, cd.Id AS ChiTietId,
				cd.Quantity01, cd.Quantity02, cd.Quantity03, cd.Quantity04, cd.Quantity05, cd.Quantity06,
				cd.Quantity07, cd.Quantity08, cd.Quantity09, cd.Quantity10, cd.Quantity11, cd.Quantity12
		FROM #Dong g
			 INNER JOIN dbo.B30ConcreteBudgetDetail cd ON g.BizDocId_Z1 = cd.BizDocId
			 CROSS APPLY (SELECT IIF(LEN(RTRIM(cd.Description)) = 4 AND ISNUMERIC(RTRIM(cd.Description)) = 1, 1, 0) AS CoNam) kt
			 CROSS APPLY (SELECT IIF(kt.CoNam = 1, TRY_CAST(RTRIM(cd.Description) AS INT), g.NamMacDinh) AS YearNo) nam
		WHERE cd.IsActive = 1
	),
	ChiTiet AS
	(
		SELECT	n.*,
				ROW_NUMBER() OVER (PARTITION BY n.BudgetDetailId, n.YearNo
								   ORDER BY IIF(tong.TongKL <> 0, 0, 1), n.ChiTietId DESC) AS _Rn
		FROM Nam n
			 CROSS APPLY (SELECT ISNULL(n.Quantity01, 0) + ISNULL(n.Quantity02, 0) + ISNULL(n.Quantity03, 0) + ISNULL(n.Quantity04, 0)
								+ ISNULL(n.Quantity05, 0) + ISNULL(n.Quantity06, 0) + ISNULL(n.Quantity07, 0) + ISNULL(n.Quantity08, 0)
								+ ISNULL(n.Quantity09, 0) + ISNULL(n.Quantity10, 0) + ISNULL(n.Quantity11, 0) + ISNULL(n.Quantity12, 0) AS TongKL) tong
		WHERE n.YearNo IS NOT NULL
	)
	SELECT	ct.YearNo,
			thang.MonthNo,
			ct.YearNo * 100 + thang.MonthNo AS NamThang,
			CAST(thang.Quantity AS NUMERIC(28, 4)) AS QuantityChuaHH,
			CAST(thang.Quantity * ct.UnitCostBD AS NUMERIC(28, 4)) AS AmountChuaHH,
			CAST(thang.Quantity * (1 + ct.ConcerlossRate) AS NUMERIC(28, 4)) AS QuantityGomHH,
			CAST(thang.Quantity * (1 + ct.ConcerlossRate) * ct.UnitCostBD AS NUMERIC(28, 4)) AS AmountGomHH
	INTO #Fact
	FROM ChiTiet ct
		 CROSS APPLY (VALUES (1, ct.Quantity01), (2, ct.Quantity02), (3, ct.Quantity03), (4, ct.Quantity04),
							 (5, ct.Quantity05), (6, ct.Quantity06), (7, ct.Quantity07), (8, ct.Quantity08),
							 (9, ct.Quantity09), (10, ct.Quantity10), (11, ct.Quantity11), (12, ct.Quantity12)
					 ) thang (MonthNo, Quantity)
	WHERE ct._Rn = 1
		  AND ISNULL(thang.Quantity, 0) <> 0

	-- 4. Gộp theo tháng + nhóm Đã thực hiện / Chưa thực hiện
	IF OBJECT_ID('Tempdb..#Thang') IS NOT NULL DROP TABLE #Thang
	SELECT	f.NamThang,
			f.YearNo,
			f.MonthNo,
			IIF(f.NamThang <= @_NamThangBC, 1, 2) AS NhomOrder,		-- 1 = đã thực hiện, 2 = chưa thực hiện
			SUM(f.QuantityChuaHH) AS QuantityChuaHH,
			SUM(f.AmountChuaHH) AS AmountChuaHH,
			SUM(f.QuantityGomHH) AS QuantityGomHH,
			SUM(f.AmountGomHH) AS AmountGomHH
	INTO #Thang
	FROM #Fact f
	GROUP BY f.NamThang, f.YearNo, f.MonthNo, IIF(f.NamThang <= @_NamThangBC, 1, 2)

	-- 5. Tổng BOQ của dự án (không chia theo tháng)
	DECLARE @_QuantityBOQ NUMERIC(28, 4) = 0,
			@_AmountBOQ NUMERIC(28, 4) = 0

	SELECT	@_QuantityBOQ = ISNULL(SUM(d.QuantityBOQ), 0),
			@_AmountBOQ = ISNULL(SUM(d.OriginalAmountBD), 0)
	FROM #Dong d

	-- 6. Các chỉ số tổng (OUTPUT cho phần đầu báo cáo)
	SELECT	@_TongKLBOQ = FORMAT(@_QuantityBOQ, 'N2'),
			@_TongGTBOQ = FORMAT(@_AmountBOQ, 'N0'),
			@_TongKLChuaHH = FORMAT(ISNULL((SELECT SUM(QuantityChuaHH) FROM #Thang), 0), 'N2'),
			@_TongGTChuaHH = FORMAT(ISNULL((SELECT SUM(AmountChuaHH) FROM #Thang), 0), 'N0'),
			@_TongKLGomHH = FORMAT(ISNULL((SELECT SUM(QuantityGomHH) FROM #Thang), 0), 'N2'),
			@_TongGTGomHH = FORMAT(ISNULL((SELECT SUM(AmountGomHH) FROM #Thang), 0), 'N0')

	-- 7. Kết quả: nhóm -> tháng -> tổng
	;WITH KetQua AS
	(
		-- Dòng nhóm "Đã thực hiện" / "Chưa thực hiện"
		SELECT	t.NhomOrder AS SortNhom, 0 AS SortThang, 0 AS RowLevel,
				IIF(t.NhomOrder = 1, N'Đã thực hiện', N'Chưa thực hiện') AS Thang,
				N'Subtotal0' AS _FormatStyleKey,
				@_QuantityBOQ AS QuantityBOQ, @_AmountBOQ AS AmountBOQ,
				SUM(t.QuantityChuaHH) AS QuantityChuaHH, SUM(t.AmountChuaHH) AS AmountChuaHH,
				SUM(t.QuantityGomHH) AS QuantityGomHH, SUM(t.AmountGomHH) AS AmountGomHH
		FROM #Thang t
		GROUP BY t.NhomOrder

		UNION ALL

		-- Dòng từng tháng (BOQ lặp lại cùng giá trị để lưới gộp ô dọc như mẫu Excel)
		SELECT	t.NhomOrder, t.NamThang, 1,
				N'T' + CAST(t.MonthNo AS NVARCHAR(2)) + N'/' + CAST(t.YearNo AS NVARCHAR(4)),
				N'',
				@_QuantityBOQ, @_AmountBOQ,
				t.QuantityChuaHH, t.AmountChuaHH, t.QuantityGomHH, t.AmountGomHH
		FROM #Thang t

		UNION ALL

		-- Dòng tổng
		SELECT	9, 0, 2, N'TỔNG', N'GrandTotal',
				@_QuantityBOQ, @_AmountBOQ,
				ISNULL(SUM(t.QuantityChuaHH), 0), ISNULL(SUM(t.AmountChuaHH), 0),
				ISNULL(SUM(t.QuantityGomHH), 0), ISNULL(SUM(t.AmountGomHH), 0)
		FROM #Thang t
	)
	SELECT	ROW_NUMBER() OVER (ORDER BY kq.SortNhom, kq.SortThang) AS _Stt,
			kq.RowLevel, kq.Thang, kq._FormatStyleKey,
			kq.QuantityBOQ, kq.AmountBOQ,
			kq.QuantityChuaHH, kq.AmountChuaHH,
			kq.QuantityGomHH, kq.AmountGomHH
	FROM KetQua kq
	ORDER BY kq.SortNhom, kq.SortThang

	DROP TABLE #KeHoach;
	DROP TABLE #Dong;
	DROP TABLE #Fact;
	DROP TABLE #Thang;
END
GO
