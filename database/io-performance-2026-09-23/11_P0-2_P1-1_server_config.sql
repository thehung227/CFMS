/* =============================================================================
   File   : 11_P0-2_P1-1_server_config.sql
   Mức    : P0-2 (max server memory) + P1-1 (cost threshold for parallelism)
   Mô tả  : Hai cấu hình cấp server, có hiệu lực NGAY, KHÔNG cần restart,
            đảo ngược tức thì.

   Hiện trạng đo ngày 23/09/2026:
     max server memory            = 2.147.483.647 MB  <= mặc định, CHƯA BAO GIỜ cấu hình
     Physical RAM                 = 16.383 MB (16 GB)
     Total Server Memory          = 11.016 MB
     Page life expectancy         = 27 giây           <= ngưỡng tối thiểu >= 825 s
     cost threshold parallelism   = 5                 <= mặc định
     MAXDOP                       = 8  (trên 16 core)
     CXCONSUMER + CXPACKET        = 47,66% tổng wait  <= nhóm wait LỚN NHẤT

   Chạy   : P0-2 bất cứ lúc nào. P1-1 nên chạy giờ thấp điểm (gây recompile hàng loạt).
   Rollback: 99_rollback.sql mục [P0-2] và [P1-1]
   ============================================================================= */

EXEC sys.sp_configure 'show advanced options', 1;
RECONFIGURE;
GO

/* --- Ghi lại giá trị hiện tại trước khi đổi --------------------------------- */
SELECT name, value_in_use
FROM sys.configurations
WHERE name IN ('max server memory (MB)', 'cost threshold for parallelism',
               'max degree of parallelism', 'min server memory (MB)');
GO

/* --- [P0-2] Giới hạn bộ nhớ SQL, chừa ~4 GB cho OS -------------------------- */
-- LƯU Ý: nếu máy có cài thêm SSAS / SSIS / SSRS thì phải hạ thấp hơn 12288.
EXEC sys.sp_configure 'max server memory (MB)', 12288;
RECONFIGURE;
GO

/* --- [P1-1] Nâng ngưỡng song song 5 -> 50 ----------------------------------- */
-- Ảnh hưởng: query OLTP nhỏ chạy tuần tự (nhanh, ổn định hơn).
-- Gây recompile hàng loạt ngay sau khi áp dụng -> tải CPU nhất thời.
-- Theo dõi 24h: một vài báo cáo lớn có thể chậm hơn do mất parallelism.
EXEC sys.sp_configure 'cost threshold for parallelism', 50;
RECONFIGURE;
GO

/* --- Xác nhận --------------------------------------------------------------- */
SELECT name, value_in_use
FROM sys.configurations
WHERE name IN ('max server memory (MB)', 'cost threshold for parallelism');
GO
