/* =============================================================================
   File   : 21_P1-6_disable_unused_indexes.sql
   Mức    : P1
   Mô tả  : Gỡ ~330 MB index KHÔNG phục vụ query nào nhưng vẫn phải cập nhật
            ở mọi INSERT/UPDATE.  => Việc này LÀM GHI NHANH HƠN, không chậm đi.

   !!! DISABLE trước, KHÔNG DROP.
       DISABLE giữ nguyên định nghĩa index, khôi phục bằng ALTER INDEX ... REBUILD.
       Số liệu dưới đây chỉ bao trùm 249 giờ (10,4 ngày) uptime, CHƯA bao trùm
       chu kỳ cuối tháng / cuối quý. Một index có thể chỉ được dùng bởi báo cáo
       quyết toán. => Theo dõi qua ÍT NHẤT 1 kỳ đóng sổ rồi mới cân nhắc DROP.

   Rollback: 99_rollback.sql mục [P1-6]
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* --- Chụp lại số liệu usage trước khi disable (lưu kết quả lại) ------------- */
SELECT t.name AS TableName, i.name AS IndexName,
       ISNULL(us.user_seeks,0) AS seeks, ISNULL(us.user_scans,0) AS scans,
       ISNULL(us.user_lookups,0) AS lookups, ISNULL(us.user_updates,0) AS updates,
       CONVERT(varchar(19), us.last_user_seek, 120) AS last_seek
FROM sys.indexes AS i
JOIN sys.tables  AS t ON t.object_id = i.object_id
LEFT JOIN sys.dm_db_index_usage_stats AS us
       ON us.object_id = i.object_id AND us.index_id = i.index_id AND us.database_id = DB_ID()
WHERE i.name IN (N'IX_B30BizDocDetail_DocDate', N'IX_B30BizDocApprove_EmployeeCodeApprove',
                 N'IX_B30BizDocApprove_EmployeeCode', N'IX_B30BizDocApprove_DeptCode',
                 N'IX_B30GeneralLedger_Id', N'IX_B30GeneralLedger_BranchCode',
                 N'IX_B30GeneralLedger_CrspCustomerCode', N'IX_B30BizDocPayment_RowId_Unique',
                 N'IX_B30BizDocPayment_DocumentDate', N'IX_B30CtKt_Tk_Co', N'IX_B30CtKt_Han_Tt');
GO

/* --- Nhóm A: 0 read tuyệt đối trong 249 giờ --------------------------------- */
-- 60,87 MB |  0 read | 30.906 update
ALTER INDEX IX_B30BizDocDetail_DocDate              ON dbo.B30BizDocDetail      DISABLE;
-- 40,50 MB |  0 read | 37.010 update
ALTER INDEX IX_B30BizDocApprove_EmployeeCodeApprove ON dbo.B30BizDocApprove     DISABLE;
-- 45,13 MB |  0 read |  2.550 update
ALTER INDEX IX_B30GeneralLedger_Id                  ON dbo.B30GeneralLedger     DISABLE;
-- 38,82 MB |  0 read |  2.550 update
-- (BranchCode chỉ có MỘT giá trị N01 -> độ chọn lọc bằng 0)
ALTER INDEX IX_B30GeneralLedger_BranchCode          ON dbo.B30GeneralLedger     DISABLE;
--  8,42 MB |  0 read |  2.538 update
ALTER INDEX IX_B30BizDocPayment_DocumentDate        ON dbo.B30BizDocPayment     DISABLE;
--  7,44 MB |  0 read |  1.102 update
ALTER INDEX IX_B30CtKt_Tk_Co                        ON dbo.B30AccDocCashPayment DISABLE;
--  5,07 MB |  0 read |  1.103 update
ALTER INDEX IX_B30CtKt_Han_Tt                       ON dbo.B30AccDocCashPayment DISABLE;
GO

/* --- Nhóm B: đọc không đáng kể (< 50 lần / 249 giờ) ------------------------- */
-- 34,55 MB | 14 read | 27.978 update
ALTER INDEX IX_B30BizDocApprove_EmployeeCode        ON dbo.B30BizDocApprove     DISABLE;
-- 25,07 MB | 11 read | 24.194 update (seek cuối 14/09/2026)
ALTER INDEX IX_B30BizDocApprove_DeptCode            ON dbo.B30BizDocApprove     DISABLE;
-- 54,37 MB | 34 read |  2.550 update
ALTER INDEX IX_B30GeneralLedger_CrspCustomerCode    ON dbo.B30GeneralLedger     DISABLE;
GO

/* --- Nhóm C: CẦN XÁC NHẬN NGHIỆP VỤ TRƯỚC -----------------------------------
   IX_B30BizDocPayment_RowId_Unique   9,88 MB | 0 read | 4.741 update
   Index này là UNIQUE. DISABLE nó sẽ BỎ RÀNG BUỘC DUY NHẤT trên cột RowId.
   Xác nhận với team nghiệp vụ rằng không có logic nào dựa vào ràng buộc này,
   rồi mới bỏ chú thích dòng dưới.

ALTER INDEX IX_B30BizDocPayment_RowId_Unique        ON dbo.B30BizDocPayment     DISABLE;
   --------------------------------------------------------------------------- */
GO

/* --- Xác nhận trạng thái ---------------------------------------------------- */
SELECT t.name AS TableName, i.name AS IndexName, i.is_disabled
FROM sys.indexes AS i
JOIN sys.tables  AS t ON t.object_id = i.object_id
WHERE i.is_disabled = 1
ORDER BY t.name, i.name;
GO
