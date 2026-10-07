SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ============================================
-- Description: BÁO CÁO TỔNG HỢP CÔNG NỢ QUÁ HẠN THỜI ĐIỂM (1 dòng / gói thầu)
--
-- Nguồn dữ liệu:
--   - Gói thầu: B20Product ProductType = 1, IsActive = 1, bỏ "Đào tạo công trường".
--     Trạng thái = B20Product.ProjectStatus (B20Class ParentCode = 'ProjectStatus').
--     @_ProjectStatus rỗng = mọi trạng thái trừ S05 "Đã quyết toán (Kết thúc bảo hành)".
--   - Công nợ NTP/NCC: cùng quy tắc usp_Vct_BangTongHopDeNghiThanhToanBill_TheoHanThanhToan
--     (Báo cáo theo dõi công nợ tại thời điểm):
--       + Chứng từ: bill P2/P3/P4 (B30BizDocCCM) + quyết toán C5 (B30BizDoc) có DocDate >= @_DocDate1
--         (mặc định 01/06/2022), đã hoàn thành bước duyệt đầu tiên (BuiltinOrder = 1) đến hết @_DocDate2.
--         @_DocDate1 chỉ lọc chứng từ cho cột Công nợ và Tạm ứng chưa khấu trừ, không lọc các cột khác.
--       + Tính trên từng bill / quyết toán chưa thanh toán hết:
--         công nợ = giá trị đề nghị TT (C5: ValueOfPayPeriod) - đã chi đến @_DocDate2
--         (BN/GN - BC + bù trừ B30AccDocOther), chỉ lấy phần còn lại > 50đ.
--       + Hạn TT = Date_Liquidation + DueDate (DueDate = 0 thì lấy số ngày điều khoản '03' của HĐ C3).
--         HĐ NSC (ClassCode1 = 'CD01'), quyết toán C5, chứng từ chưa có hạn: tính "Trong hạn".
--       + Quá hạn: 1-30 ngày / 31-60 ngày / trên 60 ngày, Tổng quá hạn = 3 cột cộng lại.
--   - Tạm ứng chưa khấu trừ = Amount_TamUng + Amount_HoanTra (lũy kế, hoàn trả mang dấu âm) chỉ lấy ở
--     bill / quyết toán cuối cùng của mỗi hợp đồng (gói thầu + ParentBizDocId + đối tượng), cuối cùng =
--     ngày gửi (MAX B30BizDocApprove.DateSend) gần nhất. Không có hợp đồng: bill BCH P3 gom theo gói thầu,
--     chứng từ khác mỗi chứng từ là 1 nhóm.
--   - Doanh thu BCTC: B30CCMBudget K2 đã duyệt xong, lần duyệt cuối <= @_DocDate2, mới nhất, Amount_DoanhThu <> 0.
--   - Doanh thu thực hiện lũy kế: sổ cái TK 511 (Có - Nợ, bỏ kết chuyển 911) theo CrspProductCostId
--     đến @_DocDate2 (như cột Doanh thu thực tế của usp_SOL_BcDongTienDuAn).
--   - Lũy kế Thu - Chi = cột ChenhLech của usp_Kqt_TongHopThuChiTheoCongTrinh (= ThuLuyKe - ChiLuyKe).
--     Không INSERT ... EXEC trực tiếp SP đó được vì bên trong nó đã INSERT ... EXEC (SQL Server cấm lồng),
--     nên gọi thẳng nguồn của nó: usp_Kqt_ThuChiTheoCongTrinh_NEW_Scan @_IsWeeklyReport = 1
--     (đọc B7R2_NewteconsBackGround.dbo.ReportCashFlow, chỉ có gói thầu trong vB20ProjectRulesAcount).
--     Nếu sửa cách tính ChenhLech trong usp_Kqt_TongHopThuChiTheoCongTrinh thì sửa theo ở mục 7.
--   - Tiền ứng chưa thu hồi (tạm ứng của CĐT): cùng quy tắc cột TienUngChuaThuHoi của
--     usp_Kcd_BaoCaoKiemSoatRuiRoTaiChinh = tổng claim tạm ứng (B30Claim IsTamUng = 1) trừ số đã khấu trừ
--     (OriginalAdvanceAmount) trên các claim đã duyệt (ClaimStatus > 0), ngày claim
--     = ISNULL(ISNULL(DocDateSales, ApprovalDate1), CreateDate1) từ 01/01/2015 đến @_DocDate2.
--   - GĐDA CB-002, CHT XD CB-012, CHT MEP CB-015: B20ProductHuman còn hiệu lực, ApplyDate <= @_DocDate2, người gần nhất.
--
-- Kết quả: sắp theo GĐDA (dự án cùng GĐDA đứng cạnh nhau) rồi tên dự án; chỉ gói thầu có ít nhất 1 số liệu.
-- Binding cột công nợ trùng báo cáo theo dõi công nợ tại thời điểm:
--   NotDueDebt (Trong hạn), NotDueDebt30, NotDueDebt60, NotDueDebt90, OverdueDebt (Tổng quá hạn).
-- Binding cột TienUngChuaThuHoi trùng báo cáo kiểm soát rủi ro tài chính.
-- Chi tiết công nợ / tạm ứng theo từng bill, quyết toán: usp_Vct_BaoCaoTongHopCongNoQuaHan_ChiTiet
--   (cùng quy tắc mục 1-4, sửa bên này thì sửa cả bên kia).
--
-- EXEC dbo.usp_Vct_BaoCaoTongHopCongNoQuaHan @_DocDate2 = '20260930', @_ProjectStatus = N'', @_BranchCode = N'N01'
-- EXEC dbo.usp_Vct_BaoCaoTongHopCongNoQuaHan @_DocDate1 = '20240101', @_DocDate2 = '20260930', @_ProjectStatus = N'S01,S02', @_BranchCode = N'N01'
--
-- 21/09/2026: Tạo mới
-- 23/09/2026: Thêm cột Tiền ứng chưa thu hồi (TienUngChuaThuHoi) lấy theo usp_Kcd_BaoCaoKiemSoatRuiRoTaiChinh
-- ============================================
CREATE OR ALTER PROC dbo.usp_Vct_BaoCaoTongHopCongNoQuaHan
	@_DocDate1 SMALLDATETIME		= NULL,		-- Từ ngày chứng từ bill / quyết toán, NULL = 01/06/2022
	@_DocDate2 SMALLDATETIME		= NULL,		-- Đến ngày, NULL = hôm nay
	@_ProjectStatus NVARCHAR(256)	= N'',		-- Trạng thái dự án (nhiều mã cách nhau dấu phẩy), rỗng = trừ S05
	@_nUserId INT					= 0,
	@_LangId INT					= 0,
	@_BranchCode NCHAR(3)			= N'N01',
	@_FromDateStr VARCHAR(10)		= '' OUTPUT,
	@_ToDateStr VARCHAR(10)			= '' OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT	@_DocDate1 = CAST(ISNULL(@_DocDate1, '20220601') AS DATE),
			@_DocDate2 = CAST(ISNULL(@_DocDate2, GETDATE()) AS DATE),
			@_ProjectStatus = LTRIM(RTRIM(ISNULL(@_ProjectStatus, N''))),
			@_BranchCode = RTRIM(@_BranchCode)

	SELECT	@_FromDateStr = CONVERT(VARCHAR(10), @_DocDate1, 103),
			@_ToDateStr = CONVERT(VARCHAR(10), @_DocDate2, 103)

	-- Giờ duyệt/gửi lưu UTC: cộng 7 giờ rồi so với đầu ngày kế tiếp
	DECLARE @_DocDateEnd SMALLDATETIME = DATEADD(DAY, 1, @_DocDate2)

	-- 1. Gói thầu theo trạng thái dự án
	IF OBJECT_ID('Tempdb..#cnGoiThau') IS NOT NULL DROP TABLE #cnGoiThau
	SELECT	p.RowId AS ProductCostId,
			p.Code AS ProductCode,
			p.Name AS ProductName,
			ISNULL(p.ProjectStatus, N'') AS ProjectStatus
	INTO #cnGoiThau
	FROM dbo.B20Product p
	WHERE p.ProductType = 1
		  AND p.IsActive = 1
		  AND p.Name NOT LIKE N'Đào tạo công%'
		  AND (	(@_ProjectStatus = N'' AND ISNULL(p.ProjectStatus, N'') <> N'S05')
			 OR p.ProjectStatus IN (SELECT LTRIM(RTRIM(Val)) FROM dbo.ufn_sys_SplitString(@_ProjectStatus, ',')))

	CREATE UNIQUE CLUSTERED INDEX ucidx_ProductCostId ON #cnGoiThau(ProductCostId)

	-- 2. Bill / quyết toán đã qua bước duyệt đầu tiên tính đến ngày báo cáo
	IF OBJECT_ID('Tempdb..#cnChungTu') IS NOT NULL DROP TABLE #cnChungTu
	SELECT	ct.BizDocId,
			ct.DocCode,
			ct.DocDate,
			ct.ProductCostId,
			ct.ParentBizDocId,
			ct.Amount_DeNghiTT,
			ct.Amount_TamUng,
			ct.Amount_HoanTra,
			ct.DueDate,
			ct.Date_Liquidation,
			ap.NgayDuyetB1,
			ap.NgayGui,
			CAST(CASE WHEN ct.ParentBizDocId <> '' THEN ct.ParentBizDocId + '|' + ct.CustomerCode
					  WHEN ct.DocCode = 'P3' THEN 'P3'
					  ELSE ct.BizDocId
				 END AS NVARCHAR(256)) AS NhomHD,
			CAST(0 AS BIT) AS LaCuoi
	INTO #cnChungTu
	FROM (
			SELECT	BizDocId, DocCode, DocDate, ProductCostId,
					ISNULL(ParentBizDocId, '') AS ParentBizDocId,
					ISNULL(CustomerCode, '') AS CustomerCode,
					ISNULL(Amount_DeNghiTT, 0) AS Amount_DeNghiTT,
					ISNULL(Amount_TamUng, 0) AS Amount_TamUng,
					ISNULL(Amount_HoanTra, 0) AS Amount_HoanTra,
					ISNULL(DueDate, 0) AS DueDate,
					Date_Liquidation
			FROM dbo.B30BizDocCCM
			WHERE DocCode IN ('P2','P3','P4')
				  AND IsActive = 1
				  AND BranchCode = @_BranchCode
				  AND DocDate >= @_DocDate1
			UNION ALL
			SELECT	BizDocId, DocCode, DocDate, ProductCostId,
					ISNULL(ParentBizDocId, ''),
					ISNULL(CustomerCode, ''),
					ISNULL(ValueOfPayPeriod, 0),
					ISNULL(Amount_TamUng, 0),
					ISNULL(Amount_HoanTra, 0),
					0,
					NULL
			FROM dbo.B30BizDoc
			WHERE DocCode = 'C5'
				  AND IsActive = 1
				  AND BranchCode = @_BranchCode
				  AND DocDate >= @_DocDate1
		 ) ct
		 INNER JOIN #cnGoiThau gt ON ct.ProductCostId = gt.ProductCostId
		 CROSS APPLY (SELECT MAX(IIF(a.BuiltinOrder = 1 AND a.ApproveStatus = '1', DATEADD(HOUR, 7, a.FinishDate), NULL)) AS NgayDuyetB1,
							 MAX(DATEADD(HOUR, 7, a.DateSend)) AS NgayGui
					  FROM dbo.B30BizDocApprove a
					  WHERE a.BizDocId = ct.BizDocId) ap
	WHERE ap.NgayDuyetB1 < @_DocDateEnd
	OPTION (RECOMPILE)	-- @_DocDate1 bị gán lại ở đầu SP (mặc định NULL)

	-- Đánh dấu bill / quyết toán cuối cùng (ngày gửi gần nhất) của mỗi hợp đồng: chỉ lấy tạm ứng / hoàn ứng ở dòng này
	;WITH CuoiCung AS
	(
		SELECT	LaCuoi,
				ROW_NUMBER() OVER (PARTITION BY ProductCostId, NhomHD
								   ORDER BY ISNULL(NgayGui, NgayDuyetB1) DESC, DocDate DESC, BizDocId DESC) AS _Stt
		FROM #cnChungTu
	)
	UPDATE CuoiCung SET LaCuoi = 1 WHERE _Stt = 1

	CREATE UNIQUE CLUSTERED INDEX ucidx_BizDocId ON #cnChungTu(BizDocId)

	-- 3. Số đã chi của từng chứng từ đến ngày báo cáo.
	--    Cộng cho mọi chứng từ có gắn UNC (~80 nghìn mã, ~1 giây) rồi mới LEFT JOIN ở mục 4:
	--    lọc IN (#cnChungTu) ngay tại đây dễ ra kế hoạch nested loop rất chậm vì BizDocId_CCM lệch kiểu
	--    (varchar ở phiếu chi, nvarchar ở phiếu thu / bù trừ). Ép về VARCHAR(50) để cùng kiểu #cnChungTu.
	--    RECOMPILE: @_DocDate2 bị gán lại ở đầu SP nên không dùng giá trị sniff lúc gọi (có thể NULL).
	IF OBJECT_ID('Tempdb..#cnDaChi') IS NOT NULL DROP TABLE #cnDaChi
	SELECT	CAST(a.BizDocId AS VARCHAR(50)) AS BizDocId, SUM(a.Amount) AS AmountUNC
	INTO #cnDaChi
	FROM (
			SELECT t1.BizDocId_CCM AS BizDocId, t1.OriginalAmount9 AS Amount
			FROM dbo.B30AccDocCashPayment t1 INNER JOIN dbo.B30AccDoc t2 ON t1.Stt = t2.Stt
			WHERE t2.BranchCode = @_BranchCode AND t2.DocCode IN ('BN','GN')
				  AND t2.IsActive = 1 AND t2.DocDate <= @_DocDate2 AND t1.BizDocId_CCM <> ''
			UNION ALL
			SELECT t1.BizDocId_CCM, -1 * t1.OriginalAmount9
			FROM dbo.B30AccDocCashReceipt t1 INNER JOIN dbo.B30AccDoc t2 ON t1.Stt = t2.Stt
			WHERE t2.BranchCode = @_BranchCode AND t2.DocCode = 'BC'
				  AND t2.IsActive = 1 AND t2.DocDate <= @_DocDate2 AND t1.BizDocId_CCM <> ''
			UNION ALL
			SELECT t1.DebitBizDocId_CCM, t1.DebitOriginalAmount
			FROM dbo.B30AccDocOther t1 INNER JOIN dbo.B30AccDoc t2 ON t1.Stt = t2.Stt
			WHERE t2.IsActive = 1 AND t2.DocStatus >= 4 AND t2.DocDate <= @_DocDate2 AND t1.DebitBizDocId_CCM <> ''
			UNION ALL
			SELECT t1.CreditBizDocId_CCM, -1 * t1.DebitOriginalAmount
			FROM dbo.B30AccDocOther t1 INNER JOIN dbo.B30AccDoc t2 ON t1.Stt = t2.Stt
			WHERE t2.IsActive = 1 AND t2.DocStatus >= 4 AND t2.DocDate <= @_DocDate2 AND t1.CreditBizDocId_CCM <> ''
		 ) a
	GROUP BY CAST(a.BizDocId AS VARCHAR(50))
	OPTION (RECOMPILE)

	CREATE UNIQUE CLUSTERED INDEX ucidx_BizDocId ON #cnDaChi(BizDocId)

	-- 4. Tạm ứng chưa khấu trừ (chứng từ cuối của hợp đồng) và công nợ theo tuổi nợ (mọi chứng từ) của từng gói thầu
	IF OBJECT_ID('Tempdb..#cnCongNo') IS NOT NULL DROP TABLE #cnCongNo
	SELECT	ct.ProductCostId,
			SUM(IIF(ct.LaCuoi = 1, ct.Amount_TamUng + ct.Amount_HoanTra, 0)) AS TamUngChuaKhauTru,
			SUM(IIF(qh.SoNgay = 0, cl.CongNo, 0)) AS NotDueDebt,
			SUM(IIF(qh.SoNgay BETWEEN 1 AND 30, cl.CongNo, 0)) AS NotDueDebt30,
			SUM(IIF(qh.SoNgay BETWEEN 31 AND 60, cl.CongNo, 0)) AS NotDueDebt60,
			SUM(IIF(qh.SoNgay > 60, cl.CongNo, 0)) AS NotDueDebt90
	INTO #cnCongNo
	FROM #cnChungTu ct
		 LEFT OUTER JOIN #cnDaChi dc ON ct.BizDocId = dc.BizDocId
		 LEFT OUTER JOIN dbo.B30BizDoc hd ON ct.ParentBizDocId = hd.BizDocId AND ct.ParentBizDocId <> ''
		 OUTER APPLY (SELECT MAX(pm.NumberOfDay) AS NumberOfDay
					  FROM dbo.B30BizDocPayment pm
					  WHERE pm.BizDocId = hd.BizDocId AND pm.ClassCode1 = '03' AND hd.DocCode = 'C3') dk
		 CROSS APPLY (SELECT IIF(ct.Amount_DeNghiTT - ISNULL(dc.AmountUNC, 0) > 50,
								 ct.Amount_DeNghiTT - ISNULL(dc.AmountUNC, 0), 0) AS CongNo,
							 IIF(ct.DueDate <> 0, ct.DueDate, ISNULL(dk.NumberOfDay, 0)) AS SoNgayTT) cl
		 CROSS APPLY (SELECT CASE WHEN ct.DocCode = 'C5' OR ISNULL(hd.ClassCode1, '') = 'CD01'
									   OR cl.SoNgayTT = 0 OR ct.Date_Liquidation IS NULL THEN NULL
								  ELSE DATEADD(DAY, cl.SoNgayTT, ct.Date_Liquidation)
							 END AS HanTT) h
		 CROSS APPLY (SELECT IIF(h.HanTT < @_DocDate2, DATEDIFF(DAY, h.HanTT, @_DocDate2), 0) AS SoNgay) qh
	GROUP BY ct.ProductCostId

	-- 5. Doanh thu BCTC: BCTC K2 mới nhất đã duyệt xong tính đến ngày báo cáo
	IF OBJECT_ID('Tempdb..#cnBCTC') IS NOT NULL DROP TABLE #cnBCTC
	SELECT	k.ProductCostId, k.Amount_DoanhThu AS DoanhThuBCTC
	INTO #cnBCTC
	FROM (
			SELECT	bud.ProductCostId, bud.Amount_DoanhThu,
					ROW_NUMBER() OVER (PARTITION BY bud.ProductCostId
									   ORDER BY ap.NgayDuyet DESC, bud.DocDate DESC, bud.Id DESC) AS _Stt
			FROM dbo.B30CCMBudget bud
				 INNER JOIN #cnGoiThau gt ON bud.ProductCostId = gt.ProductCostId
				 CROSS APPLY (SELECT MAX(DATEADD(HOUR, 7, a.FinishDate)) AS NgayDuyet
							  FROM dbo.B30BizDocApprove a
							  WHERE a.BizDocId = bud.CCMBudgetId) ap
			WHERE bud.IsActive = 1
				  AND bud.DocCode = 'K2'
				  AND bud.CompletedApprove = 1
				  AND bud.BranchCode = @_BranchCode
				  AND bud.Amount_DoanhThu <> 0
				  AND ap.NgayDuyet < @_DocDateEnd
		 ) k
	WHERE k._Stt = 1

	-- 6. Doanh thu thực hiện lũy kế: TK 511 đến ngày báo cáo
	IF OBJECT_ID('Tempdb..#cnDoanhThu') IS NOT NULL DROP TABLE #cnDoanhThu
	SELECT	gl.CrspProductCostId AS ProductCostId,
			SUM(gl.CreditAmount - gl.DebitAmount) AS DoanhThuThucHien
	INTO #cnDoanhThu
	FROM dbo.B30GeneralLedger gl
		 INNER JOIN #cnGoiThau gt ON gl.CrspProductCostId = gt.ProductCostId
	WHERE gl.IsActive = 1
		  AND gl.DocDate <= @_DocDate2
		  AND gl.Account LIKE '511%'
		  AND gl.CrspAccount NOT LIKE '911%'
	GROUP BY gl.CrspProductCostId
	OPTION (RECOMPILE)	-- @_DocDate2 bị gán lại ở đầu SP (mặc định NULL)

	-- 7. Lũy kế Thu - Chi = ChenhLech của usp_Kqt_TongHopThuChiTheoCongTrinh.
	--    Gọi cùng tham số SP đó truyền cho usp_Kqt_ThuChiTheoCongTrinh_NEW_Scan rồi tính ChenhLech = ThuLuyKe - ChiLuyKe
	--    như SP đó (ThuLuyKe/ChiLuyKe là lũy kế đến @_DocDate2, không phụ thuộc @_DocDate1).
	IF OBJECT_ID('Tempdb..#cnThuChiScan') IS NOT NULL DROP TABLE #cnThuChiScan
	CREATE TABLE #cnThuChiScan
	(
		ProductCostId NVARCHAR(32),
		ThisPeriod NUMERIC(18, 2),
		ChiTiep NUMERIC(18, 2),
		ThuTiep NUMERIC(18, 2),
		ChiLuyKe NUMERIC(18, 2),
		ThuLuyKe NUMERIC(18, 2)
	)

	INSERT INTO #cnThuChiScan (ProductCostId, ThisPeriod, ChiTiep, ThuTiep, ChiLuyKe, ThuLuyKe)
	EXECUTE dbo.usp_Kqt_ThuChiTheoCongTrinh_NEW_Scan
			@_DocDate1			= '20130101',
			@_DocDate2			= @_DocDate2,
			@_ProductCostId		= N'',
			@_IsWeeklyReport	= 1,
			@_Ma_Dvcs			= @_BranchCode

	IF OBJECT_ID('Tempdb..#cnThuChi') IS NOT NULL DROP TABLE #cnThuChi
	SELECT	ProductCostId,
			SUM(ISNULL(ThuLuyKe, 0) - ISNULL(ChiLuyKe, 0)) AS LuyKeThuChi
	INTO #cnThuChi
	FROM #cnThuChiScan
	GROUP BY ProductCostId

	-- 8. Tiền ứng chưa thu hồi = tạm ứng CĐT đã duyệt - số đã khấu trừ, như cột TienUngChuaThuHoi của
	--    usp_Kcd_BaoCaoKiemSoatRuiRoTaiChinh (bên đó gom theo hợp đồng C2 rồi cộng lại theo gói thầu,
	--    ở đây gom thẳng theo gói thầu nên không phụ thuộc việc quy hợp đồng LOA về hợp đồng gốc).
	--    Đọc thẳng B30Claim thay vì view vB30Claim: chỉ cần 3 cột tiền, tránh 8 nhánh lũy kế của view.
	--    Ngày claim lấy đúng như usp_CTC_B30Claim_GetData: ưu tiên ngày xuất hoá đơn (MIN DocDate của
	--    vB30ClaimPayment_FromAccDocSales), không có thì ngày duyệt, không có nữa thì ngày tạo.
	--    Khác báo cáo kiểm soát rủi ro: không giới hạn gói thầu IsBaoCaoThuChi = 1 và không loại hợp đồng
	--    đã tất toán hết nợ, nên số ở đây là của toàn bộ gói thầu lấy ở mục 1.
	IF OBJECT_ID('Tempdb..#cnTienUng') IS NOT NULL DROP TABLE #cnTienUng
	SELECT	cl.ProductCostId,
			SUM(IIF(cl.IsTamUng = 1, cl.OriginalClaimAmount, 0)) - SUM(cl.OriginalAdvanceAmount) AS TienUngChuaThuHoi
	INTO #cnTienUng
	FROM dbo.B30Claim cl
		 INNER JOIN #cnGoiThau gt ON cl.ProductCostId = gt.ProductCostId
		 LEFT OUTER JOIN (SELECT Stt, MIN(DocDate) AS DocDateSales
						  FROM dbo.vB30ClaimPayment_FromAccDocSales
						  GROUP BY Stt) sa ON cl.Stt = sa.Stt
	WHERE cl.IsActive = 1
		  AND cl.BranchCode = @_BranchCode
		  AND cl.ClaimStatus > 0
		  AND ISNULL(ISNULL(sa.DocDateSales, cl.ApprovalDate1), cl.CreateDate1) BETWEEN '20150101' AND @_DocDate2
	GROUP BY cl.ProductCostId
	OPTION (RECOMPILE)	-- @_DocDate2 bị gán lại ở đầu SP (mặc định NULL)

	-- 9. Nhân sự dự án
	DECLARE @_ViTri TABLE (Cot VARCHAR(8), PositionCode NVARCHAR(16))

	INSERT INTO @_ViTri (Cot, PositionCode)
	VALUES	('GDDA',	N'CB-002'),	-- Giám đốc dự án/ Người được UQ
			('CHTXD',	N'CB-012'),	-- Chỉ huy trưởng XD
			('CHTMEP',	N'CB-015')	-- Chỉ huy trưởng ME

	IF OBJECT_ID('Tempdb..#cnNhanSu') IS NOT NULL DROP TABLE #cnNhanSu
	SELECT	gt.ProductCostId,
			MAX(IIF(vt.Cot = 'GDDA', ns.TenNhanSu, NULL)) AS GDDA,
			MAX(IIF(vt.Cot = 'CHTXD', ns.TenNhanSu, NULL)) AS CHTXD,
			MAX(IIF(vt.Cot = 'CHTMEP', ns.TenNhanSu, NULL)) AS CHTMEP
	INTO #cnNhanSu
	FROM #cnGoiThau gt
		 CROSS JOIN @_ViTri vt
		 CROSS APPLY (SELECT TOP 1 e.Name AS TenNhanSu
					  FROM dbo.B20ProductHuman ph
						   INNER JOIN dbo.B20Employee e ON ph.EmployeeCode = e.Code
					  WHERE ph.ProductCostId = gt.ProductCostId
							AND ph.PositionCode = vt.PositionCode
							AND ph.IsActive = 1
							AND (ph.ApplyDate IS NULL OR ph.ApplyDate <= @_DocDate2)
					  ORDER BY ISNULL(ph.ApplyDate, '19000101') DESC, ph.Id DESC) ns
	GROUP BY gt.ProductCostId

	-- 10. Kết quả
	SELECT	ROW_NUMBER() OVER (ORDER BY IIF(ns.GDDA IS NULL, 1, 0), ns.GDDA, gt.ProductName) AS _Stt,
			gt.ProductCostId,
			gt.ProductCode,
			gt.ProductName,															-- Tên dự án
			gt.ProjectStatus,
			ISNULL(st.Name, N'') AS ProjectStatusName,								-- Trạng thái
			ISNULL(bc.DoanhThuBCTC, 0) AS DoanhThuBCTC,								-- Doanh thu BCTC
			ISNULL(dt.DoanhThuThucHien, 0) AS DoanhThuThucHien,						-- Doanh thu thực hiện lũy kế
			ISNULL(tc.LuyKeThuChi, 0) AS LuyKeThuChi,								-- Lũy kế Thu - Chi
			ISNULL(cn.TamUngChuaKhauTru, 0) AS TamUngChuaKhauTru,					-- Tạm ứng chưa khấu trừ
			ISNULL(tu.TienUngChuaThuHoi, 0) AS TienUngChuaThuHoi,					-- Tiền ứng chưa thu hồi
			ISNULL(cn.NotDueDebt, 0) AS NotDueDebt,									-- Công nợ: Trong hạn
			ISNULL(cn.NotDueDebt30, 0) AS NotDueDebt30,								-- Quá hạn 30 ngày
			ISNULL(cn.NotDueDebt60, 0) AS NotDueDebt60,								-- Quá hạn 30 đến 60 ngày
			ISNULL(cn.NotDueDebt90, 0) AS NotDueDebt90,								-- Quá hạn trên 60 ngày
			ISNULL(cn.NotDueDebt30 + cn.NotDueDebt60 + cn.NotDueDebt90, 0) AS OverdueDebt,	-- Tổng quá hạn
			ISNULL(ns.GDDA, N'') AS GDDA,
			ISNULL(ns.CHTXD, N'') AS CHTXD,
			ISNULL(ns.CHTMEP, N'') AS CHTMEP
	FROM #cnGoiThau gt
		 LEFT OUTER JOIN dbo.B20Class st ON st.ParentCode = 'ProjectStatus' AND st.Code = gt.ProjectStatus
		 LEFT OUTER JOIN #cnBCTC bc ON gt.ProductCostId = bc.ProductCostId
		 LEFT OUTER JOIN #cnDoanhThu dt ON gt.ProductCostId = dt.ProductCostId
		 LEFT OUTER JOIN #cnThuChi tc ON gt.ProductCostId = tc.ProductCostId
		 LEFT OUTER JOIN #cnCongNo cn ON gt.ProductCostId = cn.ProductCostId
		 LEFT OUTER JOIN #cnTienUng tu ON gt.ProductCostId = tu.ProductCostId
		 LEFT OUTER JOIN #cnNhanSu ns ON gt.ProductCostId = ns.ProductCostId
	WHERE ISNULL(bc.DoanhThuBCTC, 0) <> 0
		  OR ISNULL(dt.DoanhThuThucHien, 0) <> 0
		  OR ISNULL(tc.LuyKeThuChi, 0) <> 0
		  OR ISNULL(cn.TamUngChuaKhauTru, 0) <> 0
		  OR ISNULL(tu.TienUngChuaThuHoi, 0) <> 0
		  OR ISNULL(cn.NotDueDebt + cn.NotDueDebt30 + cn.NotDueDebt60 + cn.NotDueDebt90, 0) <> 0
	ORDER BY _Stt

	DROP TABLE #cnGoiThau;
	DROP TABLE #cnChungTu;
	DROP TABLE #cnDaChi;
	DROP TABLE #cnCongNo;
	DROP TABLE #cnBCTC;
	DROP TABLE #cnDoanhThu;
	DROP TABLE #cnThuChiScan;
	DROP TABLE #cnThuChi;
	DROP TABLE #cnTienUng;
	DROP TABLE #cnNhanSu;
END
GO
