/* =============================================================================
   Module : Khắc phục Disk E 100% / 5,2 TB physical reads
   File   : 10_P0-1_fix_ufn_B00EventLog_GetLastWriteTime.sql
   Mức    : P0 - XỬ LÝ NGAY
   Mô tả  : Hàm kiểm tra cache widget đang quét TOÀN BỘ clustered index
            B00EventLog (20,65 triệu dòng / 4,2 GB) theo chế độ SONG SONG,
            vì không có index nào trên cột LastWriteAt.

            Số đo production 23/09/2026 (dm_exec_query_stats):
              avg_physical_reads = 1.011.303 trang = 7,9 GB MỖI LẦN GỌI
              avg_elapsed        = 59.774 ms
              avg_cpu            =  6.405 ms  (=> 89% thời gian là chờ I/O)
              physical (28,3 M) > logical (15,1 M)  <= read-ahead không tái dụng cache

            Execution plan trong cache:
              Top <- Parallelism(Gather Streams) <- TopN Sort
                  <- Clustered Index Scan [PK_B00EventLogN] (EstRows 20.654.000, Ordered=0)
              Cost 674,68 so với 'cost threshold for parallelism' = 5 (gấp 135 lần)

            Kiểm chứng số học: 762 scans x 1.011.303 trang x 8 KB = 5,9 TB
                               ~ 5,2 TB đo được trên .mdf => hàm này là ~100% tải đọc.

   Cách sửa: Id là IDENTITY và LastWriteAt tăng đơn điệu theo Id
             (kiểm chứng 50/50 mẫu, 0 nghịch đảo) => ORDER BY Id DESC cho cùng
             kết quả nhưng dùng được clustered index sẵn có.
             Lấy MAX trên 1000 dòng cuối để an toàn với insert đồng thời lệch nhẹ.

   Ảnh hưởng tốc độ GHI: KHÔNG. Không tạo index, không đụng đường ghi.
   Rollback : 99_rollback.sql muc [P0-1]
   Chạy   : giờ thấp điểm. Chạy lại nhiều lần được.
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* --- 1. Lưu lại định nghĩa cũ trước khi sửa (dán kết quả vào 99_rollback.sql) --- */
SELECT OBJECT_DEFINITION(OBJECT_ID('dbo.ufn_B00EventLog_GetLastWriteTime')) AS DinhNghiaCu;
GO

/* --- 2. Áp dụng bản sửa --- */
ALTER FUNCTION [dbo].[ufn_B00EventLog_GetLastWriteTime] ()
RETURNS datetime
AS
BEGIN
    -- Hàm/thủ tục được tạo tự động bởi _CreateTriggerLog
    -- Để kiểm tra thời hạn hợp lệ khi caching dữ liệu widgets
    --
    -- 23/09/2026: bỏ "ORDER BY LastWriteAt DESC" (full scan 4,2 GB + TopN Sort
    -- song song) -> dùng clustered key Id (IDENTITY, đồng biến với LastWriteAt).
    DECLARE @dtLastWrite datetime;

    SELECT @dtLastWrite = MAX(x.LastWriteAt)
    FROM (SELECT TOP (1000) LastWriteAt
          FROM dbo.B00EventLog WITH (NOLOCK)
          ORDER BY Id DESC) AS x;

    RETURN @dtLastWrite;
END;
GO

/* --- 3. KIỂM CHỨNG NGAY --- */
-- Kỳ vọng: logical reads < 20, elapsed < 5 ms
-- (trước khi sửa: ~539.854 logical reads / 59.774 ms / 1.011.303 physical reads)
SET STATISTICS IO, TIME ON;
SELECT dbo.ufn_B00EventLog_GetLastWriteTime() AS LastWriteAt_Moi;
SET STATISTICS IO, TIME OFF;
GO

/* --- 4. Đối chiếu tính đúng đắn: giá trị mới phải bằng giá trị cũ ---
   CẢNH BÁO: câu dưới đây chính là câu quét 4,2 GB. CHỈ chạy MỘT LẦN duy nhất
   để đối chiếu, ngoài giờ cao điểm, rồi không bao giờ chạy lại.

SELECT TOP (1) LastWriteAt AS GiaTri_CachCu
FROM dbo.B00EventLog WITH (NOLOCK)
ORDER BY LastWriteAt DESC;
*/
