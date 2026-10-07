/* =============================================================================
   Module : Tình trạng giấy phép xây dựng (GPXD)
   File   : 02_views.sql
   Mô tả  : Tạo các view mà Layout.ts trỏ tới.

   QUY TẮC QUAN TRỌNG CỦA FRAMEWORK
   --------------------------------
   Khi lưu, base-editor gửi lên server TẤT CẢ cột có trong parentData / trong
   childColumns (xem base-editor.component.ts dòng 2044-2058 và 2186-2190).
   Do đó các view "_Edit" PHẢI updatable:
       -> chỉ SELECT từ ĐÚNG MỘT bảng gốc, không JOIN, không GROUP BY,
          không cột dẫn xuất.
   Tên hiển thị (tên gói thầu, tên giai đoạn, tên tình trạng...) do LookupBoxInput
   / cột dataType 'Array' của lưới tự lấy từ /api/lookup/ - KHÔNG cần đưa vào view.

   Các view "_Explorer" chỉ dùng để đọc nên JOIN thoải mái.
   Chạy   : sau 01_tables.sql
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* -----------------------------------------------------------------------------
   1. vB30ConsPermit_Edit - form nhập liệu (master). PHẢI updatable.
   -------------------------------------------------------------------------- */
IF OBJECT_ID('dbo.vB30ConsPermit_Edit', 'V') IS NOT NULL
    DROP VIEW dbo.vB30ConsPermit_Edit;
GO

CREATE VIEW dbo.vB30ConsPermit_Edit
AS
SELECT
    h.Id,
    h.ParentId,
    h.IsGroup,
    h.BranchCode,
    h.IsActive,
    h.CreatedBy,
    h.CreatedAt,
    h.ModifiedBy,
    h.ModifiedAt,
    h.BizDocId,
    h.DocCode,
    h.DocNo,
    h.DocDate,
    h.DocStatus,
    h.ProductCostId,
    h.ProcessCode,
    h.Description,
    h.ApproveSend,
    h.CompletedApprove,
    h.ClosedApprove,
    h.FinishDate
FROM dbo.B30ConsPermit AS h;
GO

/* -----------------------------------------------------------------------------
   2. vB30ConsPermitDetail_Edit - lưới chi tiết. PHẢI updatable.
   -------------------------------------------------------------------------- */
IF OBJECT_ID('dbo.vB30ConsPermitDetail_Edit', 'V') IS NOT NULL
    DROP VIEW dbo.vB30ConsPermitDetail_Edit;
GO

CREATE VIEW dbo.vB30ConsPermitDetail_Edit
AS
SELECT
    d.Id,
    d.ParentId,
    d.IsGroup,
    d.BranchCode,
    d.IsActive,
    d.CreatedBy,
    d.CreatedAt,
    d.ModifiedBy,
    d.ModifiedAt,
    d.BizDocId,
    d.BuiltinOrder,
    d.DocDate,
    d.StageCode,
    d.ContractLOANo,
    d.PermitStatus,
    d.PermitNo,
    d.IssuedDate,
    d.ExpectedDate,
    d.Description
FROM dbo.B30ConsPermitDetail AS d;
GO

/* -----------------------------------------------------------------------------
   3. vB30ConsPermitDetail_Report - CHỈ ĐỌC, dùng cho mẫu in / báo cáo.
      Có thêm tên giai đoạn, tên tình trạng và cờ "sắp đến hạn".
      KHÔNG khai báo view này trong Layout.Structure.
   -------------------------------------------------------------------------- */
IF OBJECT_ID('dbo.vB30ConsPermitDetail_Report', 'V') IS NOT NULL
    DROP VIEW dbo.vB30ConsPermitDetail_Report;
GO

CREATE VIEW dbo.vB30ConsPermitDetail_Report
AS
SELECT
    d.*,
    StageName        = (SELECT TOP 1 c.Name FROM dbo.B20Category c
                        WHERE c.ParentCode = 'ConsPermitStage' AND c.Code = d.StageCode),
    PermitStatusName = (SELECT TOP 1 c.Name FROM dbo.B20Category c
                        WHERE c.ParentCode = 'ConsPermitStatus' AND c.Code = d.PermitStatus),
    IsDueSoon        = CASE WHEN d.PermitStatus = '0'
                             AND d.ExpectedDate IS NOT NULL
                             AND d.ExpectedDate <= DATEADD(DAY, 30, CAST(GETDATE() AS date))
                            THEN CAST(1 AS bit) ELSE CAST(0 AS bit) END
FROM dbo.B30ConsPermitDetail AS d
WHERE d.IsActive = 1;
GO

/* -----------------------------------------------------------------------------
   4. vB30ConsPermit_Explorer - màn hình danh sách (chỉ đọc).

      LƯU Ý: cột tên gói thầu đang lấy là B20Project.Name.
      Nếu trong CSDL thực tế cột đó mang tên khác (ProductName / TenGoiThau...)
      thì sửa đúng một dòng bên dưới.
   -------------------------------------------------------------------------- */
IF OBJECT_ID('dbo.vB30ConsPermit_Explorer', 'V') IS NOT NULL
    DROP VIEW dbo.vB30ConsPermit_Explorer;
GO

CREATE VIEW dbo.vB30ConsPermit_Explorer
AS
SELECT
    h.Id,
    h.BizDocId,
    h.BranchCode,
    h.IsActive,
    h.DocCode,
    h.DocNo,
    h.DocDate,
    h.ProductCostId,
    h.ProcessCode,
    h.Description,
    h.ApproveSend,
    h.CompletedApprove,
    h.ClosedApprove,
    h.FinishDate,
    h.CreatedBy,
    h.CreatedAt,

    ProductName        = pj.Name,           -- <== sửa tại đây nếu tên cột khác

    /* Người lập */
    FullName           = (SELECT TOP 1 u.FullName FROM dbo.B00UserList u WHERE u.Id = h.CreatedBy),

    /* Thống kê tình trạng GPXD của hồ sơ */
    TotalDetail        = (SELECT COUNT(*) FROM dbo.B30ConsPermitDetail d
                          WHERE d.BizDocId = h.BizDocId AND d.IsActive = 1),
    TotalHasPermit     = (SELECT COUNT(*) FROM dbo.B30ConsPermitDetail d
                          WHERE d.BizDocId = h.BizDocId AND d.IsActive = 1 AND d.PermitStatus = '1'),
    TotalNoPermit      = (SELECT COUNT(*) FROM dbo.B30ConsPermitDetail d
                          WHERE d.BizDocId = h.BizDocId AND d.IsActive = 1 AND d.PermitStatus = '0'),
    TotalDueSoon       = (SELECT COUNT(*) FROM dbo.B30ConsPermitDetail d
                          WHERE d.BizDocId = h.BizDocId AND d.IsActive = 1 AND d.PermitStatus = '0'
                            AND d.ExpectedDate IS NOT NULL
                            AND d.ExpectedDate <= DATEADD(DAY, 30, CAST(GETDATE() AS date))),

    /* Bước duyệt đang chờ xử lý */
    XuLyTiepTheo       = (SELECT TOP 1 a.PositionName FROM dbo.B30BizDocApprove a
                          WHERE a.BizDocId = h.BizDocId AND ISNULL(a.ApproveStatus, 0) = 0
                          ORDER BY a.ApproveGroup),
    EmployeeNameSend   = (SELECT TOP 1 a.EmployeeName FROM dbo.B30BizDocApprove a
                          WHERE a.BizDocId = h.BizDocId
                          ORDER BY a.ApproveGroup)
FROM dbo.B30ConsPermit AS h
LEFT JOIN dbo.B20Project AS pj ON pj.RowId = h.ProductCostId;
GO

/* -----------------------------------------------------------------------------
   5. vB30BizDocApprove_AEditConsPermit - lưới "Bước duyệt".

      B30BizDocApprove là bảng dùng chung toàn hệ thống. Thay vì viết lại từ đầu
      (dễ lệch schema), script này NHÂN BẢN định nghĩa của view bước duyệt đã có
      sẵn cho module "Tài liệu công trường" và chỉ đổi DocCode 'UL' -> 'GP'.

      Nếu view mẫu không tồn tại trong CSDL thì script dừng và in hướng dẫn -
      khi đó hãy chọn một view vB30BizDocApprove_AEdit* bất kỳ đang dùng được
      và gán vào @SourceView.
   -------------------------------------------------------------------------- */
DECLARE @SourceView  sysname       = N'dbo.vB30BizDocApprove_AEditConsDocument';
DECLARE @TargetName  sysname       = N'vB30BizDocApprove_AEditConsPermit';
DECLARE @SourceName  sysname       = N'vB30BizDocApprove_AEditConsDocument';
DECLARE @OldDocCode  nvarchar(10)  = N'''UL''';
DECLARE @NewDocCode  nvarchar(10)  = N'''GP''';
DECLARE @Definition  nvarchar(max);
DECLARE @Sql         nvarchar(max);

SET @Definition = OBJECT_DEFINITION(OBJECT_ID(@SourceView));

IF @Definition IS NULL
BEGIN
    PRINT '!! Khong tim thay view mau ' + @SourceView + '.';
    PRINT '!! Hay gan @SourceView bang mot view vB30BizDocApprove_AEdit* dang dung duoc roi chay lai doan nay.';
END
ELSE
BEGIN
    IF OBJECT_ID('dbo.' + @TargetName, 'V') IS NOT NULL
        EXEC('DROP VIEW dbo.' + @TargetName);

    SET @Sql = REPLACE(@Definition, @SourceName, @TargetName);
    SET @Sql = REPLACE(@Sql, @OldDocCode, @NewDocCode);

    EXEC sp_executesql @Sql;
    PRINT 'Created view dbo.' + @TargetName + ' (nhan ban tu ' + @SourceView + ')';
    PRINT '>> Kiem tra lai dieu kien DocCode trong view vua tao.';
END
GO

PRINT '=== 02_views.sql completed ===';
GO
