SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ============================================
-- Description: KPI TÌNH TRẠNG DUYỆT HỒ SƠ - TỔNG HỢP (tỷ lệ đúng hạn)
--
-- Lấy nguyên dữ liệu chi tiết của usp_Kpi_TinhTrangDuyetHoSo_ChiTiet (INSERT ... EXEC) rồi gom nhóm,
-- nên mọi quy tắc tính ngày đến hạn / số ngày duyệt chỉ nằm ở 1 chỗ: SP chi tiết.
-- => Sửa cột đầu ra của SP chi tiết thì phải sửa khai báo #KpiCt bên dưới cho khớp thứ tự cột.
--
-- @_GroupBy: 'NV'      = theo người duyệt (mặc định)
--            'DA'      = theo dự án / gói thầu
--            'DA_NV'   = theo dự án + người duyệt
--            'LOAI_NV' = theo loại hồ sơ + người duyệt
--
-- Chỉ tiêu: SoHoSo (số hồ sơ riêng biệt), SoLuotDuyet (số lượt duyệt = số hồ sơ x số bước người đó duyệt),
--           SoDungHan, SoTreHan, TyLeDungHan (%), SoNgayTreBinhQuan (chỉ trên lượt trễ), SoNgayTreLonNhat,
--           SoNgayDuyetBinhQuan (mang dấu: âm = duyệt sớm hơn hạn).
--
-- EXEC dbo.usp_Kpi_TinhTrangDuyetHoSo_TongHop @_FromDate = '20260101', @_ToDate = '20260930', @_GroupBy = N'NV'
-- EXEC dbo.usp_Kpi_TinhTrangDuyetHoSo_TongHop @_FromDate = '20260101', @_ToDate = '20260930', @_GroupBy = N'DA_NV'
-- EXEC dbo.usp_Kpi_TinhTrangDuyetHoSo_TongHop @_FromDate = '20260901', @_ToDate = '20260930', @_PositionCode = N'CB-006'
--
-- 23/09/2026: Tạo mới
-- 24/09/2026: Đồng bộ tham số theo SP chi tiết (bỏ 6 tham số dò bảng/cột + @_GhiChuNguon,
--             thêm @_PositionCode / @_BuiltinOrder). Thêm cột SoHoSo.
-- ============================================
CREATE OR ALTER PROC dbo.usp_Kpi_TinhTrangDuyetHoSo_TongHop
	@_FromDate SMALLDATETIME			= NULL,
	@_ToDate SMALLDATETIME				= NULL,
	@_DocDateFrom SMALLDATETIME			= NULL,
	@_GroupBy NVARCHAR(16)				= N'NV',
	@_LoaiHoSo VARCHAR(64)				= '',
	@_ProductCostId NVARCHAR(4000)		= N'',
	@_ProjectStatus NVARCHAR(256)		= N'',
	@_EmployeeCode NVARCHAR(1024)		= N'',
	@_PositionCode NVARCHAR(256)		= N'',		-- Lọc cấp bậc duyệt: 'CB-006'... rỗng = tất cả
	@_BuiltinOrder INT					= NULL,		-- Lọc thứ tự bước duyệt (1 = bước đầu), NULL = tất cả
	@_GioLech INT						= 7,
	@_nUserId INT						= 0,
	@_LangId INT						= 0,
	@_BranchCode NCHAR(3)				= N'N01',
	@_FromDateStr VARCHAR(10)			= '' OUTPUT,
	@_ToDateStr VARCHAR(10)				= '' OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

	SET @_GroupBy = UPPER(LTRIM(RTRIM(ISNULL(@_GroupBy, N'NV'))))
	IF @_GroupBy NOT IN (N'NV', N'DA', N'DA_NV', N'LOAI_NV') SET @_GroupBy = N'NV'

	-- Khai báo phải khớp ĐÚNG THỨ TỰ cột kết quả của usp_Kpi_TinhTrangDuyetHoSo_ChiTiet
	IF OBJECT_ID('Tempdb..#KpiCt') IS NOT NULL DROP TABLE #KpiCt
	CREATE TABLE #KpiCt
	(
		LoaiHoSo				NVARCHAR(64) NULL,
		DocCode					NVARCHAR(16) NULL,
		BizDocId				VARCHAR(50) NULL,
		DocNo					NVARCHAR(128) NULL,
		DocDate					DATETIME NULL,
		ProductCostId			NVARCHAR(32) NULL,
		ProductCode				NVARCHAR(64) NULL,
		ProductName				NVARCHAR(512) NULL,
		ProjectCode				NVARCHAR(64) NULL,
		ProjectName				NVARCHAR(512) NULL,
		ProjectStatus			NVARCHAR(32) NULL,
		CustomerCode			NVARCHAR(64) NULL,	-- nguồn B30BizDocCCM/B30BizDoc.CustomerCode là nvarchar(50)
		CustomerName			NVARCHAR(512) NULL,
		GiaTri					DECIMAL(38, 8) NULL,
		ApproveGroup			INT NULL,
		DeptCode				NVARCHAR(32) NULL,
		DeptName				NVARCHAR(256) NULL,
		PositionCode			NVARCHAR(32) NULL,
		EmployeeCode			NVARCHAR(32) NULL,
		EmployeeName			NVARCHAR(256) NULL,
		NgayGuiDuyet			DATE NULL,
		NgayKeHoach				DATE NULL,
		NgayHoaDonBizzi			DATE NULL,
		NgayKeToanDinhKem		DATE NULL,
		NgayDinhKemHopDong		DATE NULL,
		NgayDenHan				DATE NULL,
		NgayDuyetThucTe			DATE NULL,
		SoNgayDuyet				INT NULL,
		SoNgayTre				INT NULL,
		DungHan					BIT NULL,
		TinhTrang				NVARCHAR(16) NULL
	)

	INSERT INTO #KpiCt
	EXEC dbo.usp_Kpi_TinhTrangDuyetHoSo_ChiTiet
		 @_FromDate				= @_FromDate,
		 @_ToDate				= @_ToDate,
		 @_DocDateFrom			= @_DocDateFrom,
		 @_LoaiHoSo				= @_LoaiHoSo,
		 @_ProductCostId		= @_ProductCostId,
		 @_ProjectStatus		= @_ProjectStatus,
		 @_EmployeeCode			= @_EmployeeCode,
		 @_PositionCode			= @_PositionCode,
		 @_BuiltinOrder			= @_BuiltinOrder,
		 @_GioLech				= @_GioLech,
		 @_nUserId				= @_nUserId,
		 @_LangId				= @_LangId,
		 @_BranchCode			= @_BranchCode,
		 @_FromDateStr			= @_FromDateStr OUTPUT,
		 @_ToDateStr			= @_ToDateStr OUTPUT

	-- Khóa nhóm theo @_GroupBy: cột không tham gia nhóm để rỗng (1 layout lưới dùng chung cho mọi kiểu nhóm)
	;WITH g AS
	(
		SELECT	CAST(CASE WHEN @_GroupBy IN (N'DA', N'DA_NV') THEN ISNULL(ct.ProjectName, N'') ELSE N'' END AS NVARCHAR(512)) AS ProjectName,
				CAST(CASE WHEN @_GroupBy IN (N'DA', N'DA_NV') THEN ISNULL(ct.ProductCostId, N'') ELSE N'' END AS NVARCHAR(32)) AS ProductCostId,
				CAST(CASE WHEN @_GroupBy IN (N'DA', N'DA_NV') THEN ISNULL(ct.ProductName, N'') ELSE N'' END AS NVARCHAR(512)) AS ProductName,
				CAST(CASE WHEN @_GroupBy = N'LOAI_NV' THEN ISNULL(ct.LoaiHoSo, N'') ELSE N'' END AS NVARCHAR(64)) AS LoaiHoSo,
				CAST(CASE WHEN @_GroupBy IN (N'NV', N'DA_NV', N'LOAI_NV') THEN ISNULL(ct.EmployeeCode, N'') ELSE N'' END AS NVARCHAR(32)) AS EmployeeCode,
				CAST(CASE WHEN @_GroupBy IN (N'NV', N'DA_NV', N'LOAI_NV') THEN ISNULL(ct.EmployeeName, N'') ELSE N'' END AS NVARCHAR(256)) AS EmployeeName,
				ct.BizDocId,
				ct.SoNgayDuyet,
				ct.SoNgayTre,
				ct.DungHan
		FROM #KpiCt ct
	)
	SELECT	g.ProjectName,												-- Dự án (rỗng nếu không nhóm theo dự án)
			g.ProductCostId,
			g.ProductName,												-- Gói thầu
			g.LoaiHoSo,
			g.EmployeeCode,
			g.EmployeeName,												-- Người duyệt
			COUNT(DISTINCT g.BizDocId) AS SoHoSo,						-- 1 hồ sơ có thể có nhiều lượt duyệt
			COUNT(*) AS SoLuotDuyet,
			SUM(CAST(g.DungHan AS INT)) AS SoDungHan,
			SUM(1 - CAST(g.DungHan AS INT)) AS SoTreHan,
			CAST(100.0 * SUM(CAST(g.DungHan AS INT)) / COUNT(*) AS DECIMAL(9, 2)) AS TyLeDungHan,
			CAST(ISNULL(AVG(CASE WHEN g.DungHan = 0 THEN CAST(g.SoNgayTre AS DECIMAL(18, 2)) END), 0) AS DECIMAL(18, 2)) AS SoNgayTreBinhQuan,
			MAX(g.SoNgayTre) AS SoNgayTreLonNhat,
			CAST(AVG(CAST(g.SoNgayDuyet AS DECIMAL(18, 2))) AS DECIMAL(18, 2)) AS SoNgayDuyetBinhQuan
	FROM g
	GROUP BY g.ProjectName, g.ProductCostId, g.ProductName, g.LoaiHoSo, g.EmployeeCode, g.EmployeeName
	ORDER BY g.ProjectName,
			 g.ProductName,
			 g.LoaiHoSo,
			 CAST(100.0 * SUM(CAST(g.DungHan AS INT)) / COUNT(*) AS DECIMAL(9, 2)),	-- người trễ nhiều nhất lên đầu
			 g.EmployeeName
	OPTION (RECOMPILE)
END
GO
