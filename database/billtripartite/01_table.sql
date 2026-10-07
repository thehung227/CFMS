/* =============================================================================
   Module : Tab "Thanh toán 3 bên" trên Bill thanh toán NTP/NCC (billsupp, DocCode B4)
            và Bill quyết toán (billsettlement, DocCode QT)
   File   : 01_table.sql
   Mô tả  : Bảng lưu tab "Thanh toán 3 bên" của Bill.
            - Dòng được nạp từ tab "Thanh toán 3 bên" của hợp đồng (B20TripartitePayment),
              người dùng chỉ nhập PayPercent; các cột số tiền do hệ thống tính.
            - Số tiền lưu dạng lũy kế: đến kỳ trước / kỳ này / tổng cộng.
            - Bộ cột chuẩn giống B20TripartitePayment (bảng tab 3 bên của hợp đồng).
            - Không tạo FOREIGN KEY; liên kết qua BizDocId (Bill) và BizDocId_C1 (hợp đồng).
   Chạy   : chạy lại nhiều lần được (bảng đã tạo trước đó sẽ được bổ sung cột lũy kế).
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF OBJECT_ID('dbo.B30BizDocCCMTripartite', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.B30BizDocCCMTripartite
    (
        Id              int             IDENTITY(1,1)   NOT NULL,

        /* --- cột chuẩn hệ thống --- */
        ParentId        int             NOT NULL CONSTRAINT DF_B30BizDocCCMTripartite_ParentId     DEFAULT (-1),
        IsGroup         bit             NOT NULL CONSTRAINT DF_B30BizDocCCMTripartite_IsGroup      DEFAULT (0),
        BizDocId        varchar(16)     NOT NULL CONSTRAINT DF_B30BizDocCCMTripartite_BizDocId     DEFAULT (''),   -- Bill (B30BizDocCCM.BizDocId)
        BuiltinOrder    int             NOT NULL CONSTRAINT DF_B30BizDocCCMTripartite_BuiltinOrder DEFAULT (0),    -- STT
        BranchCode      nvarchar(3)     NOT NULL CONSTRAINT DF_B30BizDocCCMTripartite_BranchCode   DEFAULT (''),

        /* --- nghiệp vụ --- */
        CustomerCode    nvarchar(24)    NOT NULL CONSTRAINT DF_B30BizDocCCMTripartite_CustomerCode DEFAULT (''),   -- Mã đối tượng (NCC ở tab 3 bên của HĐ)
        BizDocId_C1     varchar(16)     NOT NULL CONSTRAINT DF_B30BizDocCCMTripartite_BizDocId_C1  DEFAULT (''),   -- Id hợp đồng của đối tượng (B30BizDoc.BizDocId)
        PayPercent      numeric(15,4)   NOT NULL CONSTRAINT DF_B30BizDocCCMTripartite_PayPercent   DEFAULT (0),    -- % thanh toán (0..1) - cột DUY NHẤT người dùng nhập
        PayAmount       numeric(18,2)   NOT NULL CONSTRAINT DF_B30BizDocCCMTripartite_PayAmount    DEFAULT (0),    -- Thanh toán kỳ này = PayPercent x Amount_DeNghiTT của Bill
        PayAmountPrev   numeric(18,2)   NOT NULL CONSTRAINT DF_B30BizDocCCMTripartite_PayAmountPrev  DEFAULT (0),  -- Thanh toán đến kỳ trước (lũy kế PayAmount các Bill trước)
        PayAmountTotal  numeric(18,2)   NOT NULL CONSTRAINT DF_B30BizDocCCMTripartite_PayAmountTotal DEFAULT (0),  -- Tổng cộng = PayAmountPrev + PayAmount

        CreatedBy       int             NOT NULL CONSTRAINT DF_B30BizDocCCMTripartite_CreatedBy    DEFAULT (-1),
        CreatedAt       datetime        NOT NULL CONSTRAINT DF_B30BizDocCCMTripartite_CreatedAt    DEFAULT (GETUTCDATE()),
        ModifiedBy      int             NOT NULL CONSTRAINT DF_B30BizDocCCMTripartite_ModifiedBy   DEFAULT (-1),
        ModifiedAt      datetime        NOT NULL CONSTRAINT DF_B30BizDocCCMTripartite_ModifiedAt   DEFAULT (GETUTCDATE()),
        [timestamp]     timestamp       NOT NULL,

        CONSTRAINT PK_B30BizDocCCMTripartite PRIMARY KEY CLUSTERED (Id),
        CONSTRAINT CK_B30BizDocCCMTripartite_PayPercent CHECK (PayPercent BETWEEN 0 AND 1)
    );

    PRINT 'Created table dbo.B30BizDocCCMTripartite';
END
ELSE
    PRINT 'Table dbo.B30BizDocCCMTripartite already exists - skipped';
GO

/* --- Bổ sung cột lũy kế cho bảng đã được tạo bằng phiên bản script trước --- */
IF COL_LENGTH('dbo.B30BizDocCCMTripartite', 'PayAmountPrev') IS NULL
BEGIN
    ALTER TABLE dbo.B30BizDocCCMTripartite
        ADD PayAmountPrev numeric(18,2) NOT NULL
            CONSTRAINT DF_B30BizDocCCMTripartite_PayAmountPrev DEFAULT (0);
    PRINT 'Added column PayAmountPrev';
END
GO

IF COL_LENGTH('dbo.B30BizDocCCMTripartite', 'PayAmountTotal') IS NULL
BEGIN
    ALTER TABLE dbo.B30BizDocCCMTripartite
        ADD PayAmountTotal numeric(18,2) NOT NULL
            CONSTRAINT DF_B30BizDocCCMTripartite_PayAmountTotal DEFAULT (0);
    PRINT 'Added column PayAmountTotal';
END
GO

/* --- Index nạp lưới theo Bill ---
   Không đặt UNIQUE (BizDocId, BizDocId_C1): khi "Tải dữ liệu", framework xoá dòng cũ và
   thêm dòng mới trong cùng một lần lưu, thứ tự thực thi không đảm bảo. */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_B30BizDocCCMTripartite_BizDocId' AND object_id = OBJECT_ID('dbo.B30BizDocCCMTripartite'))
    CREATE NONCLUSTERED INDEX IX_B30BizDocCCMTripartite_BizDocId
        ON dbo.B30BizDocCCMTripartite (BizDocId)
        INCLUDE (BizDocId_C1, CustomerCode, PayPercent);
GO

PRINT '=== 01_table.sql completed ===';
GO
