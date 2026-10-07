/* =============================================================================
   Module : Tối ưu Explorer thanh toán / hợp đồng
   File   : 00_measure_and_backup.sql
   Mô tả  : (1) Sao lưu định nghĩa hiện tại trước khi sửa.
            (2) Đo baseline: chạy lại y hệt sau mỗi bước 01..05, ghi số liệu vào README mục 7.
   Chạy   : SSMS, trước mọi bước khác. Chỉ đọc.
   ============================================================================= */

/* -----------------------------------------------------------------------------
   (1) SAO LƯU
   Trong SSMS, Object Explorer → chuột phải từng object → Script ... as → ALTER To → File:
     - dbo.vB30BizDocCCM_Explore
     - dbo.vB30BizDoc_Explore
     - dbo.vB30CCMBudget_Explore
     - dbo.ufn_Coteccons_GoiThau_Theo_NhanVien   (bản gốc cũng có sẵn trong 99_rollback.sql)
   ----------------------------------------------------------------------------- */

/* -----------------------------------------------------------------------------
   (2) ĐO
   - Thay <MA_NV> bằng mã một nhân viên KHÔNG phải admin, có quyền trên dự án đo.
   - Dùng literal (không dùng biến) để giống câu lệnh backend gửi xuống.
   - Tốt nhất: bắt câu SQL thật của API explorer bằng Profiler / Extended Events
     rồi dán vào đây, vì cú pháp phân trang của backend có thể khác TOP.
   - Chạy mỗi query 3 lần, lấy số của lần 2–3 (cache đã nóng).
   - Đọc tab Messages: "logical reads" từng bảng + "CPU time" / "elapsed time".
   ----------------------------------------------------------------------------- */
SET STATISTICS IO, TIME ON;
GO

-- A. billpaysupp (P4) - trang 1, dự án lớn nhất
SELECT TOP (50) *
FROM dbo.vB30BizDocCCM_Explore
WHERE (ProductCostId = 'PROD001658') AND IsActive = 1 AND IsMaintenance = '' AND BranchCode = 'N01' AND DocCode IN ('P4')
  AND ('False' = 'True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('<MA_NV>')))
ORDER BY ProductName, CustomerName, DocDate DESC, DocNo DESC;
GO

-- A-count. Query đếm tổng số trang
SELECT COUNT(*)
FROM dbo.vB30BizDocCCM_Explore
WHERE (ProductCostId = 'PROD001658') AND IsActive = 1 AND IsMaintenance = '' AND BranchCode = 'N01' AND DocCode IN ('P4')
  AND ('False' = 'True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('<MA_NV>')));
GO

-- B. contract (C3)
SELECT TOP (50) *
FROM dbo.vB30BizDoc_Explore
WHERE (ProductCostId = 'PROD001658') AND ApproveSend = 1 AND BranchCode = 'N01' AND DocCode IN ('C3') AND IsActive = 1
  AND ('False' = 'True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('<MA_NV>')))
ORDER BY ProductName, CustomerName;
GO

-- B-count
SELECT COUNT(*)
FROM dbo.vB30BizDoc_Explore
WHERE (ProductCostId = 'PROD001658') AND ApproveSend = 1 AND BranchCode = 'N01' AND DocCode IN ('C3') AND IsActive = 1
  AND ('False' = 'True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('<MA_NV>')));
GO

-- C. paymentccmproposal (K9, không lọc dự án)
SELECT TOP (50) *
FROM dbo.vB30CCMBudget_Explore
WHERE BranchCode = 'N01' AND DocCode = 'K9' AND IsActive = 1
ORDER BY ProductName, DocDate DESC, DocNo DESC;
GO

SET STATISTICS IO, TIME OFF;
GO

/* -----------------------------------------------------------------------------
   (3) DÀNH CHO DBA (cần VIEW SERVER STATE): mức sử dụng index trên B30BizDocApprove
   Số liệu reset khi restart SQL Server - xem sqlserver_start_time trước khi kết luận.
   Index có user_seeks + user_scans + user_lookups = 0 trong thời gian dài
   là ứng viên để bỏ, bù lại chi phí ghi.
   ----------------------------------------------------------------------------- */
SELECT (SELECT sqlserver_start_time FROM sys.dm_os_sys_info) AS SqlServerStartTime,
       i.name AS IndexName, s.user_seeks, s.user_scans, s.user_lookups, s.user_updates, s.last_user_seek, s.last_user_scan
FROM sys.indexes i
LEFT JOIN sys.dm_db_index_usage_stats s
       ON s.object_id = i.object_id AND s.index_id = i.index_id AND s.database_id = DB_ID()
WHERE i.object_id = OBJECT_ID('dbo.B30BizDocApprove');
GO
