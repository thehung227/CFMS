SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ============================================
-- Description: CHI TIẾT BÁO CÁO TỔNG HỢP CÔNG NỢ QUÁ HẠN THỜI ĐIỂM (1 dòng / bill hoặc quyết toán)
--
-- Dữ liệu chi tiết của usp_Vct_BaoCaoTongHopCongNoQuaHan cho cột Tạm ứng chưa khấu trừ và 5 cột Công nợ:
--   cộng các dòng của 1 gói thầu = dòng của gói thầu đó trên báo cáo tổng hợp.
--   Mục 1-4 dùng cùng quy tắc với mục 1-4 của usp_Vct_BaoCaoTongHopCongNoQuaHan, sửa bên này thì sửa cả bên kia.
--
--   - Chứng từ: bill P2/P3/P4 + quyết toán C5 có DocDate >= @_DocDate1 (mặc định 01/06/2022),
--     đã qua bước duyệt đầu tiên đến hết @_DocDate2.
--   - Công nợ tính trên từng bill / quyết toán chưa thanh toán hết (còn lại > 50đ).
--   - Tạm ứng / hoàn ứng chỉ lấy ở bill / quyết toán cuối cùng của mỗi hợp đồng (LaChungTuCuoi = 1):
--     hợp đồng = gói thầu + ParentBizDocId + đối tượng, cuối cùng = ngày gửi gần nhất.
--     Không có hợp đồng: bill BCH P3 gom theo gói thầu, chứng từ khác mỗi chứng từ là 1 nhóm.
--   - Trả về chứng từ còn nợ, và chứng từ cuối cùng của hợp đồng còn tạm ứng chưa khấu trừ (dù đã thanh toán hết).
--   - Lọc: @_ProductCostId có giá trị thì chỉ lấy các gói thầu đó (bỏ qua @_ProjectStatus);
--     rỗng thì lấy theo @_ProjectStatus như báo cáo tổng hợp (rỗng = trừ S05).
--
-- EXEC dbo.usp_Vct_BaoCaoTongHopCongNoQuaHan_ChiTiet @_DocDate2 = '20260930', @_ProductCostId = N'PROD001893', @_BranchCode = N'N01'
--
-- 21/09/2026: Tạo mới
-- ============================================
CREATE OR ALTER PROC dbo.usp_Vct_BaoCaoTongHopCongNoQuaHan_ChiTiet
	@_DocDate1 SMALLDATETIME		= NULL,		-- Từ ngày chứng từ bill / quyết toán, NULL = 01/06/2022
	@_DocDate2 SMALLDATETIME		= NULL,		-- Đến ngày, NULL = hôm nay
	@_ProductCostId NVARCHAR(4000)	= N'',		-- Gói thầu (nhiều mã cách nhau dấu phẩy), rỗng = theo @_ProjectStatus
	@_ProjectStatus NVARCHAR(256)	= N'',		-- Trạng thái dự án khi không chọn gói thầu, rỗng = trừ S05
	@_nUserId INT					= 0,
	@_LangId INT					= 0,
	@_BranchCode NCHAR(3)			= N'N01',
	@_FromDateStr VARCHAR(10)		= '' OUTPUT,
	@_ToDateStr VARCHAR(10)			= '' OUTPUT,
	@_ProductName NVARCHAR(512)		= N'' OUTPUT	-- Tên gói thầu khi chỉ chọn 1 gói thầu
AS
BEGIN
	SET NOCOUNT ON;

	SELECT	@_DocDate1 = CAST(ISNULL(@_DocDate1, '20220601') AS DATE),
			@_DocDate2 = CAST(ISNULL(@_DocDate2, GETDATE()) AS DATE),
			@_ProductCostId = LTRIM(RTRIM(ISNULL(@_ProductCostId, N''))),
			@_ProjectStatus = LTRIM(RTRIM(ISNULL(@_ProjectStatus, N''))),
			@_BranchCode = RTRIM(@_BranchCode)

	SELECT	@_FromDateStr = CONVERT(VARCHAR(10), @_DocDate1, 103),
			@_ToDateStr = CONVERT(VARCHAR(10), @_DocDate2, 103)

	-- Giờ duyệt/gửi lưu UTC: cộng 7 giờ rồi so với đầu ngày kế tiếp
	DECLARE @_DocDateEnd SMALLDATETIME = DATEADD(DAY, 1, @_DocDate2)

	-- 1. Gói thầu
	IF OBJECT_ID('Tempdb..#ctGoiThau') IS NOT NULL DROP TABLE #ctGoiThau
	SELECT	p.RowId AS ProductCostId,
			p.Code AS ProductCode,
			p.Name AS ProductName
	INTO #ctGoiThau
	FROM dbo.B20Product p
	WHERE p.ProductType = 1
		  AND p.IsActive = 1
		  AND p.Name NOT LIKE N'Đào tạo công%'
		  AND (	(@_ProductCostId <> N''
					AND p.RowId IN (SELECT LTRIM(RTRIM(Val)) FROM dbo.ufn_sys_SplitString(@_ProductCostId, ',')))
			 OR (@_ProductCostId = N'' AND @_ProjectStatus = N'' AND ISNULL(p.ProjectStatus, N'') <> N'S05')
			 OR (@_ProductCostId = N''
					AND p.ProjectStatus IN (SELECT LTRIM(RTRIM(Val)) FROM dbo.ufn_sys_SplitString(@_ProjectStatus, ','))))

	CREATE UNIQUE CLUSTERED INDEX ucidx_ProductCostId ON #ctGoiThau(ProductCostId)

	SELECT @_ProductName = IIF(COUNT(*) = 1, MAX(ProductName), N'') FROM #ctGoiThau

	-- 2. Bill / quyết toán đã qua bước duyệt đầu tiên tính đến ngày báo cáo
	IF OBJECT_ID('Tempdb..#ctChungTu') IS NOT NULL DROP TABLE #ctChungTu
	SELECT	ct.BizDocId,
			ct.DocCode,
			ct.DocNo,
			ct.DocDate,
			ct.PayRequireNum,
			ct.ProductCostId,
			ct.ParentBizDocId,
			ct.CustomerCode,
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
	INTO #ctChungTu
	FROM (
			SELECT	BizDocId, DocCode, DocNo, DocDate,
					ISNULL(PayRequireNum, N'') AS PayRequireNum,
					ProductCostId,
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
			SELECT	BizDocId, DocCode, DocNo, DocDate,
					N'QT',
					ProductCostId,
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
		 INNER JOIN #ctGoiThau gt ON ct.ProductCostId = gt.ProductCostId
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
		FROM #ctChungTu
	)
	UPDATE CuoiCung SET LaCuoi = 1 WHERE _Stt = 1

	CREATE UNIQUE CLUSTERED INDEX ucidx_BizDocId ON #ctChungTu(BizDocId)

	-- 3. Số đã chi của từng chứng từ đến ngày báo cáo.
	--    Cộng cho mọi chứng từ có gắn UNC (~80 nghìn mã, ~1 giây) rồi mới LEFT JOIN ở mục 4:
	--    lọc IN (#ctChungTu) ngay tại đây dễ ra kế hoạch nested loop rất chậm vì BizDocId_CCM lệch kiểu
	--    (varchar ở phiếu chi, nvarchar ở phiếu thu / bù trừ). Ép về VARCHAR(50) để cùng kiểu #ctChungTu.
	--    RECOMPILE: @_DocDate2 bị gán lại ở đầu SP nên không dùng giá trị sniff lúc gọi (có thể NULL).
	IF OBJECT_ID('Tempdb..#ctDaChi') IS NOT NULL DROP TABLE #ctDaChi
	SELECT	CAST(a.BizDocId AS VARCHAR(50)) AS BizDocId, SUM(a.Amount) AS AmountUNC
	INTO #ctDaChi
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

	CREATE UNIQUE CLUSTERED INDEX ucidx_BizDocId ON #ctDaChi(BizDocId)

	-- 4. Kết quả: công nợ theo tuổi nợ của từng bill / quyết toán, tạm ứng chưa khấu trừ ở chứng từ cuối của hợp đồng.
	--    Các chứng từ của cùng hợp đồng đứng cạnh nhau, theo thứ tự ngày gửi.
	SELECT	ROW_NUMBER() OVER (ORDER BY gt.ProductName, kh.Name, hd.DocNo, ct.NhomHD,
										ISNULL(ct.NgayGui, ct.NgayDuyetB1), ct.DocDate, ct.BizDocId) AS _Stt,
			ct.ProductCostId,
			gt.ProductCode,
			gt.ProductName,															-- Gói thầu
			ct.DocCode,
			ISNULL(dm.Ten_Ct, N'') AS TenLoaiChungTu,								-- Loại chứng từ
			ct.ParentBizDocId AS ContractBizDocId,
			ISNULL(hd.DocNo, N'') AS ContractNo,									-- Số hợp đồng
			ISNULL(IIF(hd.Description = N'', hd.DocName, hd.Description), N'') AS ContractName,	-- Tên hợp đồng
			ct.CustomerCode,
			ISNULL(kh.Name, N'') AS CustomerName,									-- NTP/NCC
			ct.BizDocId,
			ct.DocNo,																-- Số bill / quyết toán
			ct.DocDate,
			ct.LaCuoi AS LaChungTuCuoi,												-- 1 = bill / quyết toán cuối cùng của hợp đồng
			ct.PayRequireNum,														-- Đợt thanh toán ('QT' = quyết toán)
			ct.NgayGui,																-- Ngày gửi
			ct.NgayDuyetB1,															-- Ngày duyệt bước 1
			ct.Amount_DeNghiTT,														-- Giá trị đề nghị TT
			ISNULL(dc.AmountUNC, 0) AS AmountUNC,									-- Đã chi đến ngày báo cáo
			cl.CongNo,																-- Còn nợ (> 50đ)
			ct.Date_Liquidation,													-- Ngày tính hạn TT
			cl.SoNgayTT,															-- Số ngày được TT
			h.HanTT,																-- Hạn TT
			qh.SoNgay AS SoNgayQuaHan,												-- Số ngày quá hạn
			h.GhiChuHan,															-- Lý do tính trong hạn khi không có hạn TT
			IIF(qh.SoNgay = 0, cl.CongNo, 0) AS NotDueDebt,							-- Công nợ: Trong hạn
			IIF(qh.SoNgay BETWEEN 1 AND 30, cl.CongNo, 0) AS NotDueDebt30,			-- Quá hạn 30 ngày
			IIF(qh.SoNgay BETWEEN 31 AND 60, cl.CongNo, 0) AS NotDueDebt60,			-- Quá hạn 30 đến 60 ngày
			IIF(qh.SoNgay > 60, cl.CongNo, 0) AS NotDueDebt90,						-- Quá hạn trên 60 ngày
			IIF(qh.SoNgay > 0, cl.CongNo, 0) AS OverdueDebt,						-- Tổng quá hạn
			-- Tạm ứng / hoàn ứng chỉ có số ở chứng từ cuối cùng của hợp đồng
			IIF(ct.LaCuoi = 1, ct.Amount_TamUng, 0) AS Amount_TamUng,				-- Tạm ứng lũy kế
			IIF(ct.LaCuoi = 1, ct.Amount_HoanTra, 0) AS Amount_HoanTra,				-- Hoàn ứng lũy kế (âm)
			IIF(ct.LaCuoi = 1, ct.Amount_TamUng + ct.Amount_HoanTra, 0) AS TamUngChuaKhauTru	-- Tạm ứng chưa khấu trừ
	FROM #ctChungTu ct
		 INNER JOIN #ctGoiThau gt ON ct.ProductCostId = gt.ProductCostId
		 LEFT OUTER JOIN #ctDaChi dc ON ct.BizDocId = dc.BizDocId
		 LEFT OUTER JOIN dbo.B30BizDoc hd ON ct.ParentBizDocId = hd.BizDocId AND ct.ParentBizDocId <> ''
		 LEFT OUTER JOIN dbo.B20Customer kh ON ct.CustomerCode = kh.Code
		 LEFT OUTER JOIN dbo.B00DmCt dm ON ct.DocCode = dm.Ma_Ct
		 OUTER APPLY (SELECT MAX(pm.NumberOfDay) AS NumberOfDay
					  FROM dbo.B30BizDocPayment pm
					  WHERE pm.BizDocId = hd.BizDocId AND pm.ClassCode1 = '03' AND hd.DocCode = 'C3') dk
		 CROSS APPLY (SELECT IIF(ct.Amount_DeNghiTT - ISNULL(dc.AmountUNC, 0) > 50,
								 ct.Amount_DeNghiTT - ISNULL(dc.AmountUNC, 0), 0) AS CongNo,
							 IIF(ct.DueDate <> 0, ct.DueDate, ISNULL(dk.NumberOfDay, 0)) AS SoNgayTT) cl
		 CROSS APPLY (SELECT CASE WHEN ct.DocCode = 'C5' OR ISNULL(hd.ClassCode1, '') = 'CD01'
									   OR cl.SoNgayTT = 0 OR ct.Date_Liquidation IS NULL THEN NULL
								  ELSE DATEADD(DAY, cl.SoNgayTT, ct.Date_Liquidation)
							 END AS HanTT,
							 CASE WHEN ISNULL(hd.ClassCode1, '') = 'CD01' THEN N'HĐ NSC: thanh toán sau khi nhận thanh toán từ CĐT'
								  WHEN ct.DocCode = 'C5' THEN N'Quyết toán: không tính hạn'
								  WHEN cl.SoNgayTT = 0 OR ct.Date_Liquidation IS NULL THEN N'Chưa có hạn thanh toán'
								  ELSE N''
							 END AS GhiChuHan) h
		 CROSS APPLY (SELECT IIF(h.HanTT < @_DocDate2, DATEDIFF(DAY, h.HanTT, @_DocDate2), 0) AS SoNgay) qh
	WHERE cl.CongNo <> 0
		  OR (ct.LaCuoi = 1 AND ct.Amount_TamUng + ct.Amount_HoanTra <> 0)
	ORDER BY _Stt

	DROP TABLE #ctGoiThau;
	DROP TABLE #ctChungTu;
	DROP TABLE #ctDaChi;
END
GO
