/* =============================================================================
   File   : 00_baseline_measure.sql
   Mô tả  : Đo BASELINE. Chạy TRƯỚC và SAU mỗi thay đổi, so sánh số liệu.
            Toàn bộ chỉ READ (DMV). An toàn chạy trên production.
   Yêu cầu: VIEW SERVER STATE (đã GRANT cho claude_mcp_ro ngày 23/09/2026).
   Chạy   : lần 1 trước khi sửa; lần 2 sau 24h; lấy HIỆU giữa 2 lần.
   ============================================================================= */

/* --- (1) I/O của file dữ liệu / file log ------------------------------------ */
SELECT DB_NAME(vfs.database_id)                                AS DbName,
       mf.physical_name,
       vfs.num_of_reads,
       vfs.num_of_writes,
       vfs.num_of_bytes_read    / 1048576                      AS ReadMB,
       vfs.num_of_bytes_written / 1048576                      AS WriteMB,
       vfs.io_stall_read_ms  / NULLIF(vfs.num_of_reads, 0)     AS AvgReadLatencyMs,
       vfs.io_stall_write_ms / NULLIF(vfs.num_of_writes, 0)    AS AvgWriteLatencyMs
FROM sys.dm_io_virtual_file_stats(DB_ID('B7R2_Newtecons'), NULL) AS vfs
JOIN sys.master_files AS mf
  ON mf.database_id = vfs.database_id AND mf.file_id = vfs.file_id;

/* --- (2) Sức khoẻ cache + độ trễ ghi log ------------------------------------ */
SELECT
  (SELECT cntr_value FROM sys.dm_os_performance_counters
    WHERE counter_name = 'Page life expectancy'
      AND object_name LIKE '%Buffer Manager%')                              AS PLE_sec,
  (SELECT CAST(wait_time_ms/1000.0 AS DECIMAL(18,1)) FROM sys.dm_os_wait_stats
    WHERE wait_type = 'WRITELOG')                                           AS WriteLog_sec,
  (SELECT CAST(wait_time_ms*1.0/NULLIF(waiting_tasks_count,0) AS DECIMAL(18,2))
     FROM sys.dm_os_wait_stats WHERE wait_type = 'WRITELOG')                AS WriteLog_avg_ms,
  (SELECT CAST(wait_time_ms/1000.0 AS DECIMAL(18,1)) FROM sys.dm_os_wait_stats
    WHERE wait_type = 'PAGEIOLATCH_SH')                                     AS PageIOLatchSH_sec,
  (SELECT CAST(wait_time_ms/1000.0 AS DECIMAL(18,1)) FROM sys.dm_os_wait_stats
    WHERE wait_type = 'CXPACKET')                                           AS CXPACKET_sec,
  (SELECT DATEDIFF(hour, sqlserver_start_time, GETDATE())
     FROM sys.dm_os_sys_info)                                               AS UptimeHours;

/* --- (3) TOP 10 query theo physical reads ----------------------------------- */
SELECT TOP (10)
    ISNULL(OBJECT_NAME(st.objectid, st.dbid), '(ad-hoc)')      AS ObjectName,
    qs.execution_count,
    qs.total_physical_reads,
    qs.total_physical_reads / qs.execution_count               AS avg_phys_reads,
    qs.total_elapsed_time / qs.execution_count / 1000          AS avg_elapsed_ms,
    LEFT(REPLACE(REPLACE(SUBSTRING(st.text, (qs.statement_start_offset/2)+1,
        ((CASE qs.statement_end_offset WHEN -1 THEN DATALENGTH(st.text)
          ELSE qs.statement_end_offset END - qs.statement_start_offset)/2)+1),
        CHAR(13),' '), CHAR(10),' '), 200)                     AS QueryText
FROM sys.dm_exec_query_stats AS qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) AS st
CROSS APPLY (SELECT CAST(pa.value AS int) AS dbid
             FROM sys.dm_exec_plan_attributes(qs.plan_handle) AS pa
             WHERE pa.attribute = 'dbid') AS d
WHERE d.dbid = DB_ID()
ORDER BY qs.total_physical_reads DESC;

/* --- (4) Index usage các bảng trọng điểm ------------------------------------ */
SELECT t.name AS TableName, ISNULL(i.name,'(HEAP)') AS IndexName,
       ISNULL(us.user_seeks,0) AS seeks, ISNULL(us.user_scans,0) AS scans,
       ISNULL(us.user_lookups,0) AS lookups, ISNULL(us.user_updates,0) AS updates
FROM sys.tables AS t
JOIN sys.indexes AS i ON i.object_id = t.object_id
LEFT JOIN sys.dm_db_index_usage_stats AS us
       ON us.object_id = i.object_id AND us.index_id = i.index_id
      AND us.database_id = DB_ID()
WHERE t.name IN ('B00EventLog','B30CCMBudgetDetail','B30BizDocApprove',
                 'B30BizDocCCM','ParBizziInvoice','B30BizDocCCMDetail01',
                 'B30BizDocCCMDetail02','B30BizDocCCMDetail03','B30BizDocCCMDetail04')
ORDER BY t.name, i.index_id;

/* =============================================================================
   NGƯỠNG CHẤP NHẬN (đo được ngày 23/09/2026 -> mục tiêu)
     PLE                   :     27 s     ->  > 825 s
     AvgReadLatencyMs      :    350 ms    ->  < 20 ms
     PAGEIOLATCH_SH        :  30,85%      ->  < 10%
     WRITELOG avg          :  26,39 ms    ->  < 5 ms
     CXPACKET + CXCONSUMER :  47,66%      ->  < 20%

   QUY TẮC DỪNG: nếu AvgWriteLatencyMs hoặc WriteLog_avg_ms TĂNG sau khi thêm
   bất kỳ index nào -> rollback index đó ngay (xem 99_rollback.sql).
   ============================================================================= */
