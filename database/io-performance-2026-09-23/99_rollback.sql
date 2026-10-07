/* =============================================================================
   File   : 99_rollback.sql
   Mô tả  : Đảo ngược từng thay đổi của bộ script io-performance-2026-09-23.
            KHÔNG chạy cả file. Mọi mục đều được chú thích sẵn -
            chỉ bỏ chú thích đúng mục cần rollback.
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* ===== [P0-1] Khôi phục ufn_B00EventLog_GetLastWriteTime =====================
   CẢNH BÁO: bản gốc dưới đây CHÍNH LÀ nguyên nhân Disk E 100%
   (1.011.303 trang physical / lần gọi, 59.774 ms).
   Chỉ khôi phục nếu bản sửa gây sai lệch nghiệp vụ.
   ============================================================================ */
/*
ALTER FUNCTION [dbo].[ufn_B00EventLog_GetLastWriteTime] ()
RETURNS datetime
AS
BEGIN
    DECLARE @dtLastWrite datetime;
    SELECT TOP (1) @dtLastWrite = LastWriteAt
        FROM B00EventLog WITH (NOLOCK) ORDER BY LastWriteAt DESC;
    DECLARE @dtLastWrite1 datetime;
    RETURN @dtLastWrite;
END;
*/
GO

/* ===== [P0-2] Bỏ giới hạn max server memory ================================ */
/*
EXEC sys.sp_configure 'show advanced options', 1;  RECONFIGURE;
EXEC sys.sp_configure 'max server memory (MB)', 2147483647;  RECONFIGURE;
*/
GO

/* ===== [P1-1] Trả cost threshold for parallelism về 5 ====================== */
/*
EXEC sys.sp_configure 'show advanced options', 1;  RECONFIGURE;
EXEC sys.sp_configure 'cost threshold for parallelism', 5;  RECONFIGURE;
*/
GO

/* ===== [P1-index] Xoá các index đã tạo ở 20_P1_indexes_online.sql ==========
   Xoá RIÊNG từng index tương ứng với mục vừa gây hồi quy, không xoá cả loạt.
   ============================================================================ */
/*
DROP INDEX IF EXISTS IX_B30CCMBudgetDetail_RowId                 ON dbo.B30CCMBudgetDetail;
DROP INDEX IF EXISTS IX_ParBizziInvoice_InvoiceId                ON dbo.ParBizziInvoice;
DROP INDEX IF EXISTS IX_B30BizDocCCM_DocCode_DocNo               ON dbo.B30BizDocCCM;
DROP INDEX IF EXISTS IX_B30BizDocApprove_ApproveGroup_FinishDate ON dbo.B30BizDocApprove;
*/
GO

/* ===== [P1-6] Bật lại các index đã DISABLE ================================= */
/*
ALTER INDEX IX_B30BizDocDetail_DocDate              ON dbo.B30BizDocDetail      REBUILD WITH (ONLINE = ON, MAXDOP = 2);
ALTER INDEX IX_B30BizDocApprove_EmployeeCodeApprove ON dbo.B30BizDocApprove     REBUILD WITH (ONLINE = ON, MAXDOP = 2);
ALTER INDEX IX_B30BizDocApprove_EmployeeCode        ON dbo.B30BizDocApprove     REBUILD WITH (ONLINE = ON, MAXDOP = 2);
ALTER INDEX IX_B30BizDocApprove_DeptCode            ON dbo.B30BizDocApprove     REBUILD WITH (ONLINE = ON, MAXDOP = 2);
ALTER INDEX IX_B30GeneralLedger_Id                  ON dbo.B30GeneralLedger     REBUILD WITH (ONLINE = ON, MAXDOP = 2);
ALTER INDEX IX_B30GeneralLedger_BranchCode          ON dbo.B30GeneralLedger     REBUILD WITH (ONLINE = ON, MAXDOP = 2);
ALTER INDEX IX_B30GeneralLedger_CrspCustomerCode    ON dbo.B30GeneralLedger     REBUILD WITH (ONLINE = ON, MAXDOP = 2);
ALTER INDEX IX_B30BizDocPayment_DocumentDate        ON dbo.B30BizDocPayment     REBUILD WITH (ONLINE = ON, MAXDOP = 2);
ALTER INDEX IX_B30BizDocPayment_RowId_Unique        ON dbo.B30BizDocPayment     REBUILD WITH (ONLINE = ON, MAXDOP = 2);
ALTER INDEX IX_B30CtKt_Tk_Co                        ON dbo.B30AccDocCashPayment REBUILD WITH (ONLINE = ON, MAXDOP = 2);
ALTER INDEX IX_B30CtKt_Han_Tt                       ON dbo.B30AccDocCashPayment REBUILD WITH (ONLINE = ON, MAXDOP = 2);
*/
GO

/* ===== [P1-5] Trả 4 bảng về HEAP ===========================================
   CẢNH BÁO: DROP clustered index sẽ XÂY LẠI TOÀN BỘ BẢNG một lần nữa.
   Cần cửa sổ bảo trì. Làm từng bảng một.
   ============================================================================ */
/*
DROP INDEX IF EXISTS IXCL_B30BizDocCCMDetail04_BizDocId       ON dbo.B30BizDocCCMDetail04;
DROP INDEX IF EXISTS IXCL_B30BizDocCCMDetail03_BizDocId       ON dbo.B30BizDocCCMDetail03;
DROP INDEX IF EXISTS IXCL_B30BizDocCCMDetail01_BizDocId       ON dbo.B30BizDocCCMDetail01;
DROP INDEX IF EXISTS IXCL_B30BizDocCCMDetail02_BizDocId       ON dbo.B30BizDocCCMDetail02;
DROP INDEX IF EXISTS IX_B30BizDocCCMDetail02_BizDocId_TaxCode ON dbo.B30BizDocCCMDetail02;
*/
GO
