/* =============================================================================
   Module : Tình trạng giấy phép xây dựng (GPXD)
   File   : 01_tables.sql
   Mô tả  : Tạo bảng master + detail.
            - Đính kèm dùng lại bảng chuẩn B30BizDocDocument (KHÔNG tạo bảng mới).
            - Bước duyệt dùng lại B30BizDocApprove / B30BizDocApproveLog.
            - KHÔNG tạo FOREIGN KEY giữa Parent và Detail (theo yêu cầu);
              liên kết bằng BizDocId, ràng buộc do tầng ứng dụng đảm bảo.
   Chạy   : 1 lần, trên database CFMS.
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* -----------------------------------------------------------------------------
   1. B30ConsPermit - Hồ sơ tình trạng giấy phép xây dựng (master)
   -------------------------------------------------------------------------- */
IF OBJECT_ID('dbo.B30ConsPermit', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.B30ConsPermit
    (
        Id                  int             IDENTITY(1,1)   NOT NULL,

        /* --- cột chuẩn hệ thống --- */
        ParentId            int                                 NULL,
        IsGroup             bit                             NOT NULL,
        BranchCode          char(3)                         NOT NULL,
        IsActive            bit                             NOT NULL,
        CreatedBy           int                                 NULL,
        CreatedAt           datetime                            NULL,
        ModifiedBy          int                                 NULL,
        ModifiedAt          datetime                            NULL,

        /* --- khoá liên kết chi tiết (không tạo FK) --- */
        BizDocId            varchar(36)                     NOT NULL,

        /* --- nhận dạng chứng từ --- */
        DocCode             char(2)                         NOT NULL,   -- 'GP'
        DocNo               varchar(50)                     NOT NULL,   -- TTGPXD_01
        DocDate             datetime                        NOT NULL,   -- Ngày lập
        DocStatus           varchar(10)                         NULL,

        /* --- nghiệp vụ --- */
        ProductCostId       varchar(36)                         NULL,   -- Gói thầu
        ProcessCode         varchar(50)                         NULL,   -- Quy trình duyệt
        Description         nvarchar(500)                       NULL,   -- Diễn giải

        /* --- trạng thái duyệt --- */
        ApproveSend         bit                             NOT NULL,   -- Đã gửi duyệt
        CompletedApprove    bit                             NOT NULL,   -- Đã hoàn thành duyệt
        ClosedApprove       bit                             NOT NULL,   -- Hồ sơ hủy
        FinishDate          datetime                            NULL,   -- Ngày hoàn thiện duyệt

        CONSTRAINT PK_B30ConsPermit PRIMARY KEY CLUSTERED (Id)
    );

    ALTER TABLE dbo.B30ConsPermit ADD CONSTRAINT DF_B30ConsPermit_IsGroup          DEFAULT (0)        FOR IsGroup;
    ALTER TABLE dbo.B30ConsPermit ADD CONSTRAINT DF_B30ConsPermit_IsActive         DEFAULT (1)        FOR IsActive;
    ALTER TABLE dbo.B30ConsPermit ADD CONSTRAINT DF_B30ConsPermit_DocCode          DEFAULT ('GP')     FOR DocCode;
    ALTER TABLE dbo.B30ConsPermit ADD CONSTRAINT DF_B30ConsPermit_DocDate          DEFAULT (GETDATE())FOR DocDate;
    ALTER TABLE dbo.B30ConsPermit ADD CONSTRAINT DF_B30ConsPermit_ApproveSend      DEFAULT (0)        FOR ApproveSend;
    ALTER TABLE dbo.B30ConsPermit ADD CONSTRAINT DF_B30ConsPermit_CompletedApprove DEFAULT (0)        FOR CompletedApprove;
    ALTER TABLE dbo.B30ConsPermit ADD CONSTRAINT DF_B30ConsPermit_ClosedApprove    DEFAULT (0)        FOR ClosedApprove;
    ALTER TABLE dbo.B30ConsPermit ADD CONSTRAINT DF_B30ConsPermit_CreatedAt        DEFAULT (GETDATE())FOR CreatedAt;

    PRINT 'Created table dbo.B30ConsPermit';
END
ELSE
    PRINT 'Table dbo.B30ConsPermit already exists - skipped';
GO

/* --- BUSINESS KEY: 1 số hồ sơ là duy nhất trong 1 đơn vị + loại chứng từ ---
   Dùng filtered index để bản ghi đã xoá mềm (IsActive = 0) không chiếm số hồ sơ. */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UQ_B30ConsPermit_BizKey' AND object_id = OBJECT_ID('dbo.B30ConsPermit'))
    CREATE UNIQUE NONCLUSTERED INDEX UQ_B30ConsPermit_BizKey
        ON dbo.B30ConsPermit (BranchCode, DocCode, DocNo)
        WHERE IsActive = 1;
GO

/* --- Khoá nối master <-> detail, phải duy nhất --- */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UQ_B30ConsPermit_BizDocId' AND object_id = OBJECT_ID('dbo.B30ConsPermit'))
    CREATE UNIQUE NONCLUSTERED INDEX UQ_B30ConsPermit_BizDocId
        ON dbo.B30ConsPermit (BizDocId);
GO

/* --- Index phục vụ màn hình danh sách (lọc theo gói thầu) --- */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_B30ConsPermit_Product' AND object_id = OBJECT_ID('dbo.B30ConsPermit'))
    CREATE NONCLUSTERED INDEX IX_B30ConsPermit_Product
        ON dbo.B30ConsPermit (BranchCode, ProductCostId, DocDate DESC)
        INCLUDE (DocNo, ApproveSend, CompletedApprove, IsActive);
GO


/* -----------------------------------------------------------------------------
   2. B30ConsPermitDetail - Chi tiết tình trạng GPXD theo giai đoạn
   -------------------------------------------------------------------------- */
IF OBJECT_ID('dbo.B30ConsPermitDetail', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.B30ConsPermitDetail
    (
        Id                  int             IDENTITY(1,1)   NOT NULL,

        /* --- cột chuẩn hệ thống --- */
        ParentId            int                                 NULL,
        IsGroup             bit                             NOT NULL,
        BranchCode          char(3)                         NOT NULL,
        IsActive            bit                             NOT NULL,
        CreatedBy           int                                 NULL,
        CreatedAt           datetime                            NULL,
        ModifiedBy          int                                 NULL,
        ModifiedAt          datetime                            NULL,

        /* --- khoá liên kết về master (không tạo FK) --- */
        BizDocId            varchar(36)                     NOT NULL,

        BuiltinOrder        int                             NOT NULL,   -- STT
        DocDate             datetime                            NULL,   -- kế thừa từ cha

        /* --- nghiệp vụ, khớp các cột trên giao diện --- */
        StageCode           varchar(50)                         NULL,   -- Giai đoạn (danh mục Class/ConsPermitStage)
        ContractLOANo       varchar(100)                        NULL,   -- ID Hợp đồng CĐT / LOA (nhập tự do)
        PermitStatus        varchar(10)                     NOT NULL,   -- Tình trạng GPXD: '0' Chưa có, '1' Đã có
        PermitNo            varchar(100)                        NULL,   -- Số GPXD / Văn bản
        IssuedDate          datetime                            NULL,   -- Ngày cấp / Phát hành
        ExpectedDate        datetime                            NULL,   -- Ngày có GPXD dự kiến
        Description         nvarchar(500)                       NULL,   -- Ghi chú

        CONSTRAINT PK_B30ConsPermitDetail PRIMARY KEY CLUSTERED (Id)
    );

    ALTER TABLE dbo.B30ConsPermitDetail ADD CONSTRAINT DF_B30ConsPermitDetail_IsGroup      DEFAULT (0)        FOR IsGroup;
    ALTER TABLE dbo.B30ConsPermitDetail ADD CONSTRAINT DF_B30ConsPermitDetail_IsActive     DEFAULT (1)        FOR IsActive;
    ALTER TABLE dbo.B30ConsPermitDetail ADD CONSTRAINT DF_B30ConsPermitDetail_BuiltinOrder DEFAULT (1)        FOR BuiltinOrder;
    ALTER TABLE dbo.B30ConsPermitDetail ADD CONSTRAINT DF_B30ConsPermitDetail_PermitStatus DEFAULT ('0')      FOR PermitStatus;
    ALTER TABLE dbo.B30ConsPermitDetail ADD CONSTRAINT DF_B30ConsPermitDetail_CreatedAt    DEFAULT (GETDATE())FOR CreatedAt;

    PRINT 'Created table dbo.B30ConsPermitDetail';
END
ELSE
    PRINT 'Table dbo.B30ConsPermitDetail already exists - skipped';
GO

/* --- BUSINESS KEY: trong 1 hồ sơ, số thứ tự dòng là duy nhất --- */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UQ_B30ConsPermitDetail_BizKey' AND object_id = OBJECT_ID('dbo.B30ConsPermitDetail'))
    CREATE UNIQUE NONCLUSTERED INDEX UQ_B30ConsPermitDetail_BizKey
        ON dbo.B30ConsPermitDetail (BranchCode, BizDocId, BuiltinOrder)
        WHERE IsActive = 1;
GO

/* --- Index phục vụ thống kê "Tổng quan hồ sơ" / báo cáo sắp đến hạn --- */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_B30ConsPermitDetail_Status' AND object_id = OBJECT_ID('dbo.B30ConsPermitDetail'))
    CREATE NONCLUSTERED INDEX IX_B30ConsPermitDetail_Status
        ON dbo.B30ConsPermitDetail (BizDocId, PermitStatus, ExpectedDate)
        INCLUDE (StageCode, PermitNo, IsActive);
GO

/* -----------------------------------------------------------------------------
   3. B20ConsPermitDocument - Danh mục checklist tài liệu đính kèm của hồ sơ GPXD

      Nguồn dữ liệu cho usp_Newtecons_B30ConsPermitDocument_GetData: khi bấm
      "Tải dữ liệu", các dòng ở đây được đổ vào lưới đính kèm (ghi xuống
      B30BizDocDocument khi lưu). Người dùng tự thêm/bớt tài liệu qua danh mục
      này mà không phải sửa code.
   -------------------------------------------------------------------------- */
IF OBJECT_ID('dbo.B20ConsPermitDocument', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.B20ConsPermitDocument
    (
        Id                  int             IDENTITY(1,1)   NOT NULL,

        /* --- cột chuẩn hệ thống --- */
        ParentId            int                                 NULL,
        IsGroup             bit                             NOT NULL,
        BranchCode          char(3)                         NOT NULL,
        IsActive            bit                             NOT NULL,
        CreatedBy           int                                 NULL,
        CreatedAt           datetime                            NULL,
        ModifiedBy          int                                 NULL,
        ModifiedAt          datetime                            NULL,

        /* --- nghiệp vụ --- */
        Code                varchar(50)                     NOT NULL,   -- mã tài liệu
        Name                nvarchar(500)                   NOT NULL,   -- Diễn giải / nội dung đính kèm
        Attached            bit                             NOT NULL,   -- 1 = Bắt buộc, 0 = Không bắt buộc
        BuiltinOrder        int                             NOT NULL,   -- thứ tự hiển thị

        CONSTRAINT PK_B20ConsPermitDocument PRIMARY KEY CLUSTERED (Id)
    );

    ALTER TABLE dbo.B20ConsPermitDocument ADD CONSTRAINT DF_B20ConsPermitDocument_IsGroup      DEFAULT (0)        FOR IsGroup;
    ALTER TABLE dbo.B20ConsPermitDocument ADD CONSTRAINT DF_B20ConsPermitDocument_IsActive     DEFAULT (1)        FOR IsActive;
    ALTER TABLE dbo.B20ConsPermitDocument ADD CONSTRAINT DF_B20ConsPermitDocument_Attached     DEFAULT (1)        FOR Attached;
    ALTER TABLE dbo.B20ConsPermitDocument ADD CONSTRAINT DF_B20ConsPermitDocument_BuiltinOrder DEFAULT (1)        FOR BuiltinOrder;
    ALTER TABLE dbo.B20ConsPermitDocument ADD CONSTRAINT DF_B20ConsPermitDocument_CreatedAt    DEFAULT (GETDATE())FOR CreatedAt;

    PRINT 'Created table dbo.B20ConsPermitDocument';
END
ELSE
    PRINT 'Table dbo.B20ConsPermitDocument already exists - skipped';
GO

/* --- BUSINESS KEY: mã tài liệu duy nhất trong 1 đơn vị --- */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UQ_B20ConsPermitDocument_BizKey' AND object_id = OBJECT_ID('dbo.B20ConsPermitDocument'))
    CREATE UNIQUE NONCLUSTERED INDEX UQ_B20ConsPermitDocument_BizKey
        ON dbo.B20ConsPermitDocument (BranchCode, Code)
        WHERE IsActive = 1;
GO

PRINT '=== 01_tables.sql completed ===';
GO
