/* =============================================================================
   Module : Tối ưu Explorer thanh toán / hợp đồng
   File   : 05_indexes.sql
   Mô tả  : Bước 1 (khuyến nghị): 3 index hẹp, cột ít khi bị UPDATE -> chi phí ghi gần như chỉ ở INSERT/DELETE.
            Bước 2 (tuỳ chọn)   : THAY index BizDocId trên B30BizDocApprove bằng bản có INCLUDE
                                  (DROP_EXISTING, không tăng số index). Xem README mục 3 trước khi chạy.
            Không dùng filtered index (tránh lỗi SET option ở procedure ghi).
            ONLINE = ON (Enterprise): không khoá bảng khi tạo. Vẫn nên chạy ngoài giờ cao điểm.
            Chạy lại nhiều lần được.
   Chạy   : sau 02..04 và đã đo lại
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* =========================== BƯỚC 1 ======================================== */

-- 1.1 Explorer thanh toán: FilterKey luôn có ProductCostId + DocCode.
--     INCLUDE các cột lọc còn lại để query đếm (getCountData) không phải đọc bảng.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('dbo.B30BizDocCCM') AND name = 'IX_B30BizDocCCM_ProductCostId_DocCode')
    CREATE NONCLUSTERED INDEX IX_B30BizDocCCM_ProductCostId_DocCode
        ON dbo.B30BizDocCCM (ProductCostId, DocCode)
        INCLUDE (IsActive, IsMaintenance, BranchCode)
        WITH (ONLINE = ON, SORT_IN_TEMPDB = ON, FILLFACTOR = 90);
GO

-- 1.2 Explorer hợp đồng: ProductCostId + DocCode, lọc thêm ApproveSend / IsActive / BranchCode.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('dbo.B30BizDoc') AND name = 'IX_B30BizDoc_ProductCostId_DocCode')
    CREATE NONCLUSTERED INDEX IX_B30BizDoc_ProductCostId_DocCode
        ON dbo.B30BizDoc (ProductCostId, DocCode)
        INCLUDE (IsActive, ApproveSend, BranchCode)
        WITH (ONLINE = ON, SORT_IN_TEMPDB = ON, FILLFACTOR = 90);
GO

-- 1.3 Hàm phân quyền ufn_Coteccons_GoiThau_Theo_NhanVien lọc theo EmployeeCode.
--     ProductCostId là clustered key nên đã có sẵn trong index.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('dbo.B20ProductHuman') AND name = 'IX_B20ProductHuman_EmployeeCode')
    CREATE NONCLUSTERED INDEX IX_B20ProductHuman_EmployeeCode
        ON dbo.B20ProductHuman (EmployeeCode)
        INCLUDE (IsActive)
        WITH (ONLINE = ON, SORT_IN_TEMPDB = ON, FILLFACTOR = 90);
GO

-- 1.4 (không bắt buộc) B30CCMBudget chỉ 13 MB, quét toàn bảng vẫn rẻ.
--     Chỉ bật nếu đo thấy query C (00) còn chậm do chờ lock.
-- IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('dbo.B30CCMBudget') AND name = 'IX_B30CCMBudget_ProductCostId_DocCode')
--     CREATE NONCLUSTERED INDEX IX_B30CCMBudget_ProductCostId_DocCode
--         ON dbo.B30CCMBudget (ProductCostId, DocCode)
--         INCLUDE (IsActive, BranchCode)
--         WITH (ONLINE = ON, SORT_IN_TEMPDB = ON, FILLFACTOR = 90);
-- GO

/* =========================== BƯỚC 2 (TUỲ CHỌN) ============================= */
/* Chỉ chạy khi đo sau bước 1 vẫn thấy key lookup trên B30BizDocApprove lớn.
   Số index giữ nguyên 6, nhưng index này rộng hơn. Mỗi lần gửi/duyệt, mỗi dòng duyệt bị
   UPDATE phát sinh thêm 1 lần cập nhật dòng index. Đo thời gian duyệt trên UAT trước/sau.
   Giữ nguyên tên index để mọi index hint hiện có vẫn chạy. */

-- IF NOT EXISTS (
--     SELECT 1 FROM sys.index_columns ic JOIN sys.indexes i ON i.object_id = ic.object_id AND i.index_id = ic.index_id
--     WHERE i.object_id = OBJECT_ID('dbo.B30BizDocApprove') AND i.name = 'IX_B30BizDocApprove_BizDocId'
--       AND ic.is_included_column = 1)
--     CREATE NONCLUSTERED INDEX IX_B30BizDocApprove_BizDocId
--         ON dbo.B30BizDocApprove (BizDocId)
--         INCLUDE (ApproveGroup, ApproveStatus, BuiltinOrder, EmployeeCode, EmployeeCodeReal,
--                  EmployeeCodeApprove, EmployeeCodeSend, PositionCode, DateSend, FinishDate)
--         WITH (DROP_EXISTING = ON, ONLINE = ON, SORT_IN_TEMPDB = ON, FILLFACTOR = 90);
-- GO
