/* =============================================================================
   File   : 20_P1_indexes_online.sql
   Mức    : P1 - ƯU TIÊN CAO
   Mô tả  : 4 index tạo ONLINE (Enterprise) - KHÔNG khoá bảng, không cần downtime.
            Có guard IF NOT EXISTS -> chạy lại nhiều lần được.

   !!! CHẠY TỪNG MỤC MỘT, CÁCH NHAU ÍT NHẤT 24 GIỜ, đo lại bằng
       00_baseline_measure.sql sau mỗi mục. Ràng buộc: KHÔNG LÀM CHẬM GHI.

   Rollback: 99_rollback.sql mục [P1-index]
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* ============================ [P1-2] ========================================
   Problem  : UPDATE dbo.B30CCMBudgetDetail SET BizDocId_C1 = @ WHERE RowId = @
              phải quét toàn bộ 1,67 GB vì KHÔNG có index nào trên RowId.
              (index hiện có: clustered CCMBudgetId, NC PK Id, NC ItemNo)
   Evidence : usp_UpdateB30CCMBudget_FromB30BizDoc
              avg_physical_reads = 404.248 trang (3,16 GB) / 1 lần UPDATE 1 DÒNG
              avg_elapsed        = 25.082 ms
   Impact   : UPDATE 25 giây -> mili-giây. LÀM GHI NHANH HƠN.
              Đồng thời gỡ chuỗi blocking khiến usp_GetDeptCodeFromEmployee
              phải chờ 222 ms x 8.035 lần (đứng #1 toàn DB theo tổng elapsed).
   Risk     : THẤP. Index 1 cột, hẹp. ONLINE = ON.
   ============================================================================ */
IF NOT EXISTS (SELECT 1 FROM sys.indexes
               WHERE object_id = OBJECT_ID('dbo.B30CCMBudgetDetail')
                 AND name = 'IX_B30CCMBudgetDetail_RowId')
    CREATE NONCLUSTERED INDEX IX_B30CCMBudgetDetail_RowId
        ON dbo.B30CCMBudgetDetail (RowId)
        WITH (ONLINE = ON, SORT_IN_TEMPDB = ON, FILLFACTOR = 90, MAXDOP = 2);
GO

/* ============================ [P1-4] ========================================
   Problem  : ParBizziInvoice (245 MB, ~2.860 byte/dòng) chỉ có clustered PK
              trên Id -> mọi truy vấn theo InvoiceId đều full scan.
   Evidence : user_scans = 38.926 vs user_seeks = 420 (99% truy cập là quét bảng)
              missing-index score 738.004, impact 85,2%, 31.317 seeks đang chờ
   Impact   : Loại bỏ ~9,3 TB logical reads (ước tính).
   Risk     : THẤP - bảng gần như read-only (chỉ 463 updates / 249 giờ).
   ============================================================================ */
IF NOT EXISTS (SELECT 1 FROM sys.indexes
               WHERE object_id = OBJECT_ID('dbo.ParBizziInvoice')
                 AND name = 'IX_ParBizziInvoice_InvoiceId')
    CREATE NONCLUSTERED INDEX IX_ParBizziInvoice_InvoiceId
        ON dbo.ParBizziInvoice (InvoiceId)
        INCLUDE (CompanyId, InvoiceItemsFirst, ReceivedAt)
        WITH (ONLINE = ON, SORT_IN_TEMPDB = ON, FILLFACTOR = 90, MAXDOP = 2);
GO

/* ============================ [P1-3a] =======================================
   Problem  : Sinh số chứng từ bằng vòng WHILE, mỗi vòng lặp là một full scan
              B30BizDocCCM (bảng NÓNG NHẤT database):
                WHILE EXISTS(SELECT 1 FROM dbo.B30BizDocCCM
                             WHERE DocNo = @_DocNo AND DocCode = @_DocCode)
   Evidence : ufn_Coteccons_B30BizDocCCM_DefaultDocNo_P4_New
                29.944 lần chạy, 596.572.879 logical reads
              ufn_B30BizDocCCM_CheckUniqueDocNo
                 3.304 lần chạy,  76.392.570 logical reads
              missing-index (DocCode, DocNo): 59.637 seeks đang chờ, impact 99,9%
              B30BizDocCCM tổng cộng 466.911 user_scans - cao nhất toàn DB
   Impact   : Biến full scan 201 MB/vòng lặp thành seek.
   Risk     : TRUNG BÌNH - bảng có 103.528 updates/249h. Ước tính +25-40 MB.
              PHẢI đo tốc độ ghi trước/sau (00_baseline_measure.sql mục 1 và 2).
   ============================================================================ */
IF NOT EXISTS (SELECT 1 FROM sys.indexes
               WHERE object_id = OBJECT_ID('dbo.B30BizDocCCM')
                 AND name = 'IX_B30BizDocCCM_DocCode_DocNo')
    CREATE NONCLUSTERED INDEX IX_B30BizDocCCM_DocCode_DocNo
        ON dbo.B30BizDocCCM (DocCode, DocNo)
        INCLUDE (IsActive, ClosedApprove, BizDocId, BranchCode)
        WITH (ONLINE = ON, SORT_IN_TEMPDB = ON, FILLFACTOR = 90, MAXDOP = 2);
GO

/* ============================ [P1-7] ========================================
   Problem  : B30BizDocApprove bị scan 73.333 lần + 603.626 key lookups vì
              KHÔNG index nào có cột INCLUDE (cả 5 NCI đều single-column).
   Evidence : usp_Coteccons_ApproveNotifications_New
                273 lần chạy, 218.823.021 logical reads (801.549 / lần)
              usp_Vct_...TheoHanThanhToan_XD
                WHERE FinishDate >= @ AND FinishDate < @ AND ApproveGroup = 1
   Impact   : Biến scan + lookup thành seek có covering.
   Risk     : TRUNG BÌNH - bảng có 174.730 updates/249h. Ước tính +60-90 MB.
              Bù lại: mục [P1-6] gỡ 100 MB index chết trên CHÍNH bảng này
              -> tổng chi phí ghi giảm, không tăng.
   ============================================================================ */
IF NOT EXISTS (SELECT 1 FROM sys.indexes
               WHERE object_id = OBJECT_ID('dbo.B30BizDocApprove')
                 AND name = 'IX_B30BizDocApprove_ApproveGroup_FinishDate')
    CREATE NONCLUSTERED INDEX IX_B30BizDocApprove_ApproveGroup_FinishDate
        ON dbo.B30BizDocApprove (ApproveGroup, FinishDate)
        INCLUDE (BizDocId, ApproveStatus, DocDate, EmployeeCodeReal, DeptCode, PositionCode)
        WITH (ONLINE = ON, SORT_IN_TEMPDB = ON, FILLFACTOR = 90, MAXDOP = 2);
GO

/* =============================================================================
   KHÔNG tạo ở đây (đã có sẵn ở nơi khác / cần sửa code kèm theo):

   * IX_B30BizDocCCM_ProductCostId_DocCode
     -> ĐÃ CÓ trong database/explorer-performance/05_indexes.sql (14/09/2026),
        đang chờ DBA đo baseline. KHÔNG tạo trùng. Nếu đã áp dụng file đó thì
        index này phục vụ luôn ufn_B30BizDocCCM_DefaultPayRequireNum_2 và các
        query explorer (SPID 94/116/82 bắt được lúc 23/09).

   * Sửa predicate non-sargable trong usp_Kct_BaoCaoTaiChinhCongTruong:
        CŨ : WHERE DATEADD(hh, 7, FinishDate) <= @_DocDate2
        MỚI: WHERE FinishDate <= DATEADD(hh, -7, @_DocDate2)
     Hàm bọc quanh cột khiến optimizer KHÔNG BAO GIỜ seek được.
     Phải kiểm chứng bằng EXCEPT hai chiều giữa kết quả cũ và mới trước khi áp.

   * KHÔNG tạo index với INCLUDE hàng chục cột như missing-index DMV gợi ý
     (có gợi ý đòi INCLUDE cả 57 cột của B30BizDocCCM) -> sẽ nhân đôi dung lượng
     và phá tốc độ ghi.
   ============================================================================= */
