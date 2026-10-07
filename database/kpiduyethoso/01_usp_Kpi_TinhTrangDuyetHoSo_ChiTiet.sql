SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ============================================
-- Description: KPI TÌNH TRẠNG DUYỆT HỒ SƠ - CHI TIẾT
--              1 dòng = 1 lượt duyệt của 1 người trên 1 hồ sơ (1 dòng B30BizDocApprove đã duyệt).
--
-- Phạm vi hồ sơ:
--   - Bill thanh toán NCC/NTP  : B30BizDocCCM DocCode = 'P4'   (bản sao B4 không duyệt nên luôn lọc DocCode)
--   - Bill BCH                 : B30BizDocCCM DocCode = 'P3'
--   - Quyết toán               : B30BizDoc    DocCode = 'C5'
--   - Hợp đồng                 : B30BizDoc    DocCode = 'C3'
--
-- Công thức KPI:
--   Số ngày duyệt = Ngày duyệt thực tế - Ngày đến hạn   (đếm theo NGÀY LÀM VIỆC, trừ T7 + CN, không trừ lễ)
--   Ngày duyệt thực tế = B30BizDocApprove.FinishDate của chính bước duyệt đó
--   Ngày đến hạn = MAX( Ngày kế hoạch          = B30BizDocApprove.StartDate ("Ngày đến hạn" trên tab Duyệt)
--                     ; Ngày nhận hóa đơn Bizzi
--                     ; Ngày kế toán đính kèm
--                     ; Ngày đính kèm hợp đồng )
--   SoNgayDuyet <= 0  => đúng hạn (DungHan = 1); > 0 => trễ.
--   Hợp đồng C3 thường không có 3 mốc sau => Ngày đến hạn = Ngày kế hoạch của bước duyệt.
--
-- Nguồn 3 mốc ngày (đã dò trên DB, không còn dynamic SQL):
--   (1) Ngày nhận hóa đơn Bizzi : ParBizziInvoice.ReceivedAt, nối qua B30BizDocContactInfo.InvoiceId
--                                 (đúng lưới hóa đơn Bizzi trên form bill - view vB30BizDocContactInfo_Edit),
--                                 chỉ lấy dòng IsSelected = 1. Không dùng view vì view gánh thêm 3 join
--                                 và bị ép kiểu ngầm nvarchar/varchar trên BizDocId.
--   (2) Ngày kế toán đính kèm   : MAX(B30BizDocAtchDoc.CreatedAt) của chính hồ sơ, chỉ dòng đã có FilePath.
--                                 CreatedAt mặc định getutcdate() => cộng @_GioLech như StartDate/FinishDate.
--                                 Cột Attached toàn bảng đang = 0 nên KHÔNG lọc theo cột đó.
--   (3) Ngày đính kèm hợp đồng  : B30BizDoc.EstimatedCompletionDate của HỢP ĐỒNG CHA,
--                                 nối ParentBizDocId (con) = BizDocId (cha).
--                                 !! CẦN ĐỐI CHIẾU: EstimatedCompletionDate là "ngày dự kiến hoàn thành"
--                                 của hợp đồng. Nếu mốc này rơi vào tương lai xa thì nó sẽ chi phối
--                                 toàn bộ MAX() và làm mọi hồ sơ thành "đúng hạn" - kiểm tra trước khi chốt số.
--
-- Quy đổi giờ: StartDate / FinishDate / DateSend / B30BizDocAtchDoc.CreatedAt lưu UTC
--              => cộng @_GioLech (mặc định 7) trước khi CAST DATE.
--              ParBizziInvoice.ReceivedAt lấy nguyên (chỉ CAST DATE).
--
-- EXEC dbo.usp_Kpi_TinhTrangDuyetHoSo_ChiTiet @_FromDate = '20260101', @_ToDate = '20260930', @_BranchCode = N'N01'
-- EXEC dbo.usp_Kpi_TinhTrangDuyetHoSo_ChiTiet @_FromDate = '20260901', @_ToDate = '20260930', @_LoaiHoSo = 'P4,C5'
-- EXEC dbo.usp_Kpi_TinhTrangDuyetHoSo_ChiTiet @_FromDate = '20260901', @_ToDate = '20260930', @_PositionCode = N'CB-006'
--
-- 23/09/2026: Tạo mới
-- 24/09/2026: Chốt nguồn 3 mốc ngày, bỏ dynamic SQL + các tham số dò bảng/cột.
--             Sửa join hợp đồng cha (trước join ParentBizDocId = ParentBizDocId, sinh ~97 triệu dòng).
--             Tính lượt duyệt trước rồi mới lấy mốc ngày cho đúng các hồ sơ có lượt duyệt trong kỳ.
--             Thêm @_PositionCode / @_BuiltinOrder thay cho điều kiện hardcode ở khối lượt duyệt.
-- ============================================
CREATE OR ALTER PROC dbo.usp_Kpi_TinhTrangDuyetHoSo_ChiTiet
	@_FromDate SMALLDATETIME			= NULL,		-- Từ ngày duyệt thực tế, NULL = đầu tháng của @_ToDate
	@_ToDate SMALLDATETIME				= NULL,		-- Đến ngày duyệt thực tế, NULL = hôm nay
	@_DocDateFrom SMALLDATETIME			= NULL,		-- Chặn ngày lập hồ sơ để đỡ quét, NULL = @_FromDate - 12 tháng
	@_LoaiHoSo VARCHAR(64)				= '',		-- DocCode cần lấy: 'P4,P3,C5,C3', rỗng = tất cả
	@_ProductCostId NVARCHAR(4000)		= N'',		-- Gói thầu (nhiều mã cách nhau dấu phẩy), rỗng = theo @_ProjectStatus
	@_ProjectStatus NVARCHAR(256)		= N'',		-- Trạng thái dự án khi không chọn gói thầu, rỗng = trừ S05
	@_EmployeeCode NVARCHAR(1024)		= N'',		-- Lọc người duyệt (nhiều mã cách nhau dấu phẩy), rỗng = tất cả
	@_PositionCode NVARCHAR(256)		= N'',		-- Lọc cấp bậc duyệt: 'CB-006', 'CB-002,CB-012'... rỗng = tất cả
	@_BuiltinOrder INT					= NULL,		-- Lọc thứ tự bước duyệt (1 = bước đầu), NULL = tất cả các bước
	@_GioLech INT						= 7,		-- Giờ cộng thêm cho các cột lưu UTC (UTC -> giờ VN)
	@_nUserId INT						= 0,
	@_LangId INT						= 0,
	@_BranchCode NCHAR(3)				= N'N01',
	@_FromDateStr VARCHAR(10)			= '' OUTPUT,
	@_ToDateStr VARCHAR(10)				= '' OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT	@_ToDate = CAST(ISNULL(@_ToDate, GETDATE()) AS DATE)
	SELECT	@_FromDate = CAST(ISNULL(@_FromDate, DATEADD(DAY, 1 - DAY(@_ToDate), @_ToDate)) AS DATE)
	SELECT	@_DocDateFrom = CAST(ISNULL(@_DocDateFrom, DATEADD(MONTH, -12, @_FromDate)) AS DATE),
			@_LoaiHoSo = LTRIM(RTRIM(ISNULL(@_LoaiHoSo, ''))),
			@_ProductCostId = LTRIM(RTRIM(ISNULL(@_ProductCostId, N''))),
			@_ProjectStatus = LTRIM(RTRIM(ISNULL(@_ProjectStatus, N''))),
			@_EmployeeCode = LTRIM(RTRIM(ISNULL(@_EmployeeCode, N''))),
			@_PositionCode = LTRIM(RTRIM(ISNULL(@_PositionCode, N''))),
			@_GioLech = ISNULL(@_GioLech, 0),
			@_BranchCode = RTRIM(@_BranchCode)

	SELECT	@_FromDateStr = CONVERT(VARCHAR(10), @_FromDate, 103),
			@_ToDateStr = CONVERT(VARCHAR(10), @_ToDate, 103)

	-- Khoảng lọc trên cột gốc (UTC) để index còn dùng được
	DECLARE @_FinishFrom DATETIME = DATEADD(HOUR, -@_GioLech, CAST(@_FromDate AS DATETIME)),
			@_FinishTo DATETIME   = DATEADD(HOUR, -@_GioLech, DATEADD(DAY, 1, CAST(@_ToDate AS DATETIME)))

	-- ------------------------------------------------------------------
	-- 1. Gói thầu trong phạm vi báo cáo
	-- ------------------------------------------------------------------
	IF OBJECT_ID('Tempdb..#KpiGoiThau') IS NOT NULL DROP TABLE #KpiGoiThau
	SELECT	p.RowId AS ProductCostId,
			p.Code AS ProductCode,
			p.Name AS ProductName,
			ISNULL(p.ProjectStatus, N'') AS ProjectStatus,
			CAST(ISNULL(pp.Code, N'') AS NVARCHAR(64)) AS ProjectCode,		-- Dự án cha
			CAST(ISNULL(pp.Name, N'') AS NVARCHAR(512)) AS ProjectName
	INTO #KpiGoiThau
	FROM dbo.B20Product p
		 LEFT OUTER JOIN dbo.B20Product pp ON p.ParentId = pp.Id AND pp.IsGroup = 1
	WHERE p.IsActive = 1
		  -- Không lọc ProductType: bill 12 tháng gần nhất nằm ở cả ProductType = 1 (17.301 bill)
		  -- lẫn ProductType = 3 (592 bill); lọc ProductType = 1 sẽ làm mất 592 bill khỏi KPI.
		  AND p.Name NOT LIKE N'Đào tạo công%'
		  AND (	(@_ProductCostId <> N''
					AND p.RowId IN (SELECT LTRIM(RTRIM(Val)) FROM dbo.ufn_sys_SplitString(@_ProductCostId, ',')))
			 OR (@_ProductCostId = N'' AND @_ProjectStatus = N'' AND ISNULL(p.ProjectStatus, N'') <> N'S05')
			 OR (@_ProductCostId = N''
					AND p.ProjectStatus IN (SELECT LTRIM(RTRIM(Val)) FROM dbo.ufn_sys_SplitString(@_ProjectStatus, ','))))

	CREATE UNIQUE CLUSTERED INDEX ucidx_ProductCostId ON #KpiGoiThau(ProductCostId)

	-- ------------------------------------------------------------------
	-- 2. Hồ sơ: bill P4/P3 + quyết toán C5 + hợp đồng C3
	-- ------------------------------------------------------------------
	IF OBJECT_ID('Tempdb..#KpiChungTu') IS NOT NULL DROP TABLE #KpiChungTu
	SELECT	ct.BizDocId,
			ct.ParentBizDocId,											-- Hợp đồng cha (C3), rỗng nếu không có
			ct.DocCode,
			ct.LoaiHoSo,
			ct.DocNo,
			ct.DocDate,
			ct.ProductCostId,
			ct.CustomerCode,
			ct.GiaTri
	INTO #KpiChungTu
	FROM (
			SELECT	CAST(BizDocId AS VARCHAR(50)) AS BizDocId,
					CAST(ISNULL(ParentBizDocId, '') AS VARCHAR(50)) AS ParentBizDocId,
					DocCode,
					CAST(CASE DocCode WHEN 'P4' THEN N'Bill thanh toán NCC/NTP'
									  WHEN 'P3' THEN N'Bill BCH'
									  ELSE N'Bill' END AS NVARCHAR(64)) AS LoaiHoSo,
					DocNo,
					DocDate,
					ProductCostId,
					ISNULL(CustomerCode, '') AS CustomerCode,
					ISNULL(Amount_DeNghiTT, 0) AS GiaTri
			FROM dbo.B30BizDocCCM
			WHERE DocCode IN ('P4', 'P3')
				  AND IsActive = 1
				  AND BranchCode = @_BranchCode
				  AND DocDate >= @_DocDateFrom
			UNION ALL
			SELECT	CAST(BizDocId AS VARCHAR(50)),
					CAST(ISNULL(ParentBizDocId, '') AS VARCHAR(50)),
					DocCode,
					CAST(CASE DocCode WHEN 'C5' THEN N'Quyết toán'
									  WHEN 'C3' THEN N'Hợp đồng'
									  ELSE N'Chứng từ' END AS NVARCHAR(64)),
					DocNo,
					DocDate,
					ProductCostId,
					ISNULL(CustomerCode, ''),
					-- Giá trị chỉ để tham khảo: C5 lấy đề nghị TT kỳ này, C3 (hợp đồng) để 0
					-- vì chưa xác nhận được tên cột giá trị hợp đồng trên B30BizDoc.
					IIF(DocCode = 'C5', ISNULL(ValueOfPayPeriod, 0), 0)
			FROM dbo.B30BizDoc
			WHERE DocCode IN ('C5', 'C3')
				  AND IsActive = 1
				  AND BranchCode = @_BranchCode
				  AND DocDate >= @_DocDateFrom
		 ) ct
		 INNER JOIN #KpiGoiThau gt ON ct.ProductCostId = gt.ProductCostId
	WHERE (@_LoaiHoSo = ''
			OR ct.DocCode IN (SELECT LTRIM(RTRIM(Val)) FROM dbo.ufn_sys_SplitString(@_LoaiHoSo, ',')))
	OPTION (RECOMPILE)	-- các tham số ngày bị gán lại ở đầu SP

	CREATE CLUSTERED INDEX cidx_BizDocId ON #KpiChungTu(BizDocId)

	-- ------------------------------------------------------------------
	-- 3. Các lượt duyệt đã hoàn thành trong kỳ
	--    Tính TRƯỚC các mốc ngày: trong 12 tháng có ~23.000 hồ sơ nhưng 1 tháng chỉ ~14.000 lượt duyệt
	--    (lọc thêm cấp bậc thì còn ~1.700), nên khối 4 bên dưới chỉ phải quét đúng phần hồ sơ cần chấm.
	-- ------------------------------------------------------------------
	IF OBJECT_ID('Tempdb..#KpiBuoc') IS NOT NULL DROP TABLE #KpiBuoc
	SELECT	ct.BizDocId,
			ct.DocCode,
			ct.LoaiHoSo,
			ct.DocNo,
			ct.DocDate,
			ct.ProductCostId,
			ct.CustomerCode,
			ct.GiaTri,
			a.ApproveGroup,
			CAST(ISNULL(RTRIM(a.DeptCode), N'') AS NVARCHAR(32)) AS DeptCode,
			CAST(ISNULL(RTRIM(a.PositionCode), N'') AS NVARCHAR(32)) AS PositionCode,
			-- Người duyệt: ưu tiên người thực sự bấm duyệt, rồi người được chỉ định, cuối cùng là cấu hình
			CAST(COALESCE(NULLIF(RTRIM(a.EmployeeCodeApprove), N''),
						  NULLIF(RTRIM(a.EmployeeCodeReal), N''),
						  RTRIM(a.EmployeeCode), N'') AS NVARCHAR(32)) AS EmployeeCode,
			CAST(DATEADD(HOUR, @_GioLech, a.StartDate) AS DATE) AS NgayKeHoach,
			CAST(DATEADD(HOUR, @_GioLech, a.FinishDate) AS DATE) AS NgayDuyetThucTe,
			CAST(DATEADD(HOUR, @_GioLech, a.DateSend) AS DATE) AS NgayGuiDuyet
	INTO #KpiBuoc
	FROM #KpiChungTu ct
		 INNER JOIN dbo.B30BizDocApprove a ON a.BizDocId = ct.BizDocId
	WHERE a.ApproveStatus = '1'					-- đã duyệt
		  AND a.FinishDate IS NOT NULL
		  AND a.FinishDate >= @_FinishFrom
		  AND a.FinishDate < @_FinishTo
		  AND (@_BuiltinOrder IS NULL OR a.BuiltinOrder = @_BuiltinOrder)
		  AND (@_PositionCode = N''
				OR RTRIM(a.PositionCode) IN (SELECT LTRIM(RTRIM(Val)) FROM dbo.ufn_sys_SplitString(@_PositionCode, ',')))
	OPTION (RECOMPILE)

	CREATE CLUSTERED INDEX cidx_BizDocId ON #KpiBuoc(BizDocId)

	-- Danh sách hồ sơ thực sự phải chấm KPI (1 dòng / hồ sơ) - dùng cho khối mốc ngày bên dưới
	IF OBJECT_ID('Tempdb..#KpiHoSo') IS NOT NULL DROP TABLE #KpiHoSo
	SELECT	ct.BizDocId,
			MAX(ct.ParentBizDocId) AS ParentBizDocId
	INTO #KpiHoSo
	FROM #KpiChungTu ct
	WHERE EXISTS (SELECT 1 FROM #KpiBuoc b WHERE b.BizDocId = ct.BizDocId)
	GROUP BY ct.BizDocId

	CREATE UNIQUE CLUSTERED INDEX ucidx_BizDocId ON #KpiHoSo(BizDocId)

	-- ------------------------------------------------------------------
	-- 4. Các mốc ngày của hồ sơ
	-- ------------------------------------------------------------------
	IF OBJECT_ID('Tempdb..#KpiBizzi') IS NOT NULL DROP TABLE #KpiBizzi
	CREATE TABLE #KpiBizzi
	(
		BizDocId				VARCHAR(50) NOT NULL PRIMARY KEY,
		NgayHoaDonBizzi			DATE NULL
	)

	IF OBJECT_ID('Tempdb..#KpiDinhKem') IS NOT NULL DROP TABLE #KpiDinhKem
	CREATE TABLE #KpiDinhKem
	(
		BizDocId				VARCHAR(50) NOT NULL PRIMARY KEY,
		NgayKeToanDinhKem		DATE NULL,
		NgayDinhKemHopDong		DATE NULL
	)

	-- 4a. Ngày nhận hóa đơn Bizzi = MAX(ReceivedAt) của các hóa đơn ĐÃ CHỌN trên hồ sơ.
	--     B30BizDocContactInfo.BizDocId là nvarchar(40) còn hồ sơ là varchar(50): CAST ở phía bảng
	--     (vốn phải quét hết vì không có index BizDocId) để #KpiHoSo vẫn dùng được clustered index.
	INSERT INTO #KpiBizzi (BizDocId, NgayHoaDonBizzi)
	SELECT	hs.BizDocId,
			MAX(CAST(bi.ReceivedAt AS DATE))
	FROM dbo.B30BizDocContactInfo ci
		 INNER JOIN #KpiHoSo hs ON hs.BizDocId = CAST(ci.BizDocId AS VARCHAR(50))
		 INNER JOIN dbo.ParBizziInvoice bi ON bi.InvoiceId = ci.InvoiceId
	WHERE ci.IsActive = 1
		  AND ci.IsSelected = 1
		  AND bi.ReceivedAt IS NOT NULL
	GROUP BY hs.BizDocId
	OPTION (RECOMPILE)

	-- 4b. Ngày kế toán đính kèm (lần đính kèm file gần nhất trên hồ sơ)
	--     + Ngày đính kèm hợp đồng (lấy trên hợp đồng cha, ParentBizDocId -> BizDocId)
	INSERT INTO #KpiDinhKem (BizDocId, NgayKeToanDinhKem, NgayDinhKemHopDong)
	SELECT	hs.BizDocId,
			dk.NgayKeToanDinhKem,
			CAST(hd.EstimatedCompletionDate AS DATE)
	FROM #KpiHoSo hs
		 LEFT OUTER JOIN (
				SELECT	a.BizDocId,
						MAX(CAST(DATEADD(HOUR, @_GioLech, a.CreatedAt) AS DATE)) AS NgayKeToanDinhKem
				FROM dbo.B30BizDocAtchDoc a
				WHERE a.IsActive = 1
					  AND ISNULL(a.FilePath, N'') <> N''	-- chỉ dòng đã đính kèm file thật
				GROUP BY a.BizDocId
			 ) dk ON dk.BizDocId = hs.BizDocId
		 LEFT OUTER JOIN dbo.B30BizDoc hd ON hd.BizDocId = hs.ParentBizDocId
											 AND hs.ParentBizDocId <> ''
	WHERE dk.NgayKeToanDinhKem IS NOT NULL
		  OR hd.EstimatedCompletionDate IS NOT NULL
	OPTION (RECOMPILE)

	-- ------------------------------------------------------------------
	-- 5. Kết quả: ngày đến hạn + số ngày duyệt (ngày làm việc, trừ T7/CN)
	--    f(n) = số ngày làm việc từ 01/01/1900 (thứ Hai) đến ngày có n = DATEDIFF(DAY,'19000101',ngày)
	--    Số ngày duyệt = f(ngày duyệt) - f(ngày đến hạn); âm = duyệt sớm, 0 = đúng hạn, dương = trễ.
	-- ------------------------------------------------------------------
	SELECT	b.LoaiHoSo,
			b.DocCode,
			b.BizDocId,
			b.DocNo,													-- Số hồ sơ
			b.DocDate,													-- Ngày lập
			gt.ProductCostId,
			gt.ProductCode,
			gt.ProductName,												-- Gói thầu
			gt.ProjectCode,
			gt.ProjectName,												-- Dự án (cha)
			gt.ProjectStatus,
			b.CustomerCode,
			ISNULL(kh.Name, N'') AS CustomerName,						-- NTP / NCC
			b.GiaTri,
			b.ApproveGroup,												-- Bước duyệt
			b.DeptCode,
			ISNULL(dp.Name, N'') AS DeptName,
			b.PositionCode,												-- Cấp bậc duyệt (CB-002, CB-012...).
																		-- Muốn thêm tên cấp bậc: join danh mục cấp bậc
																		-- của DB (chưa xác nhận được tên bảng) theo PositionCode.
			b.EmployeeCode,
			ISNULL(nv.Name, N'') AS EmployeeName,						-- NGƯỜI DUYỆT
			b.NgayGuiDuyet,
			b.NgayKeHoach,												-- Ngày kế hoạch (hạn của bước duyệt)
			bz.NgayHoaDonBizzi,
			dk.NgayKeToanDinhKem,
			dk.NgayDinhKemHopDong,
			dh.NgayDenHan,												-- MAX 4 mốc trên
			b.NgayDuyetThucTe,
			w.SoNgayDuyet,												-- < 0 sớm, 0 đúng hạn, > 0 trễ
			IIF(w.SoNgayDuyet > 0, w.SoNgayDuyet, 0) AS SoNgayTre,
			CAST(IIF(w.SoNgayDuyet <= 0, 1, 0) AS BIT) AS DungHan,
			CAST(IIF(w.SoNgayDuyet <= 0, N'Đúng hạn', N'Trễ hạn') AS NVARCHAR(16)) AS TinhTrang
	FROM #KpiBuoc b
		 INNER JOIN #KpiGoiThau gt ON b.ProductCostId = gt.ProductCostId
		 LEFT OUTER JOIN #KpiBizzi bz ON b.BizDocId = bz.BizDocId
		 LEFT OUTER JOIN #KpiDinhKem dk ON b.BizDocId = dk.BizDocId
		 LEFT OUTER JOIN dbo.B20Customer kh ON b.CustomerCode = kh.Code
		 LEFT OUTER JOIN dbo.B20Employee nv ON b.EmployeeCode = nv.Code
		 LEFT OUTER JOIN dbo.B20Dept dp ON b.DeptCode = dp.Code
		 CROSS APPLY (SELECT MAX(v.d) AS NgayDenHan
					  FROM (VALUES (b.NgayKeHoach),
								   (bz.NgayHoaDonBizzi),
								   (dk.NgayKeToanDinhKem),
								   (dk.NgayDinhKemHopDong)) v(d)) dh
		 CROSS APPLY (SELECT DATEDIFF(DAY, '19000101', dh.NgayDenHan) AS n1,
							 DATEDIFF(DAY, '19000101', b.NgayDuyetThucTe) AS n2) n
		 CROSS APPLY (SELECT ((n.n2 / 7) * 5 + CASE WHEN n.n2 % 7 > 5 THEN 5 ELSE n.n2 % 7 END)
							 - ((n.n1 / 7) * 5 + CASE WHEN n.n1 % 7 > 5 THEN 5 ELSE n.n1 % 7 END) AS SoNgayDuyet) w
	WHERE dh.NgayDenHan IS NOT NULL									-- không có mốc nào => không chấm KPI được
		  AND (@_EmployeeCode = N''
				OR b.EmployeeCode IN (SELECT LTRIM(RTRIM(Val)) FROM dbo.ufn_sys_SplitString(@_EmployeeCode, ',')))
	ORDER BY gt.ProjectName, gt.ProductName, nv.Name, b.NgayDuyetThucTe, b.DocNo, b.ApproveGroup
	OPTION (RECOMPILE)
END
GO
