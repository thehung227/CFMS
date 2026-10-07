/* =============================================================================
   File   : 30_P1-5_clustered_for_heaps.sql
   Mức    : P1 - CẦN CỬA SỔ BẢO TRÌ
   Mô tả  : 4 bảng B30BizDocCCMDetail01..04 là HEAP (PK là nonclustered).
            user_seeks trên heap = 0 TUYỆT ĐỐI ở cả 4 bảng
            -> heap chưa bao giờ được seek, chỉ bị quét.

   Số đo ngày 23/09/2026:
     Bảng                   MB      scans     seeks   lookups   updates
     B30BizDocCCMDetail02  453,19   40.761       0      8.374    19.985
     B30BizDocCCMDetail01  361,23   42.346       0     15.804    37.633
     B30BizDocCCMDetail03  233,69   41.277       0      9.516    23.494
     B30BizDocCCMDetail04  198,07   42.612       0     12.642    31.760
                                   -------
                                   166.996 scans (~50 TB logical, ước tính)

   Nguồn scan: usp_Coteccons_CreateFormula_BizDocCCMDetail02 / 03
     IF NOT EXISTS (SELECT 1 FROM dbo.B30BizDocCCMDetail02 WHERE BizDocId = @_BizDocId)
        -> 3.791 lần chạy, 213.997.803 logical reads
     WITH Parents AS (SELECT DISTINCT p.Id FROM B30BizDocCCMDetail02 p
                      JOIN B30BizDocCCMDetail02 c ON c.BizDocId = p.BizDocId ...)
        -> self-join HEAP với HEAP, 987 lần chạy, 115.761.232 logical reads

   Số lần scan gần bằng nhau ở cả 4 bảng -> bị quét theo BỘ, gần chắc là
   UNION ALL trong một view (mô hình partition thủ công bằng hậu tố).

   !!! RISK: TRUNG BÌNH - CAO
       Tạo clustered index sẽ XÂY LẠI TOÀN BỘ BẢNG và MỌI nonclustered index.
       Cần khoảng 2 lần dung lượng tạm. Dù ONLINE = ON vẫn nên làm trong cửa sổ
       bảo trì. LÀM TỪNG BẢNG MỘT, bắt đầu từ bảng NHỎ NHẤT, cách nhau ít nhất
       24 giờ, đo lại bằng 00_baseline_measure.sql sau mỗi bảng.

   Rollback: 99_rollback.sql mục [P1-5]
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* --- Bước 1: B30BizDocCCMDetail04 (198 MB - nhỏ nhất) ----------------------- */
IF NOT EXISTS (SELECT 1 FROM sys.indexes
               WHERE object_id = OBJECT_ID('dbo.B30BizDocCCMDetail04') AND index_id = 1)
    CREATE CLUSTERED INDEX IXCL_B30BizDocCCMDetail04_BizDocId
        ON dbo.B30BizDocCCMDetail04 (BizDocId)
        WITH (ONLINE = ON, SORT_IN_TEMPDB = ON, FILLFACTOR = 90, MAXDOP = 2);
GO

/* ############################################################################
   DỪNG Ở ĐÂY. Đo lại sau 24 giờ bằng 00_baseline_measure.sql.
   Chỉ chạy tiếp Bước 2 nếu AvgWriteLatencyMs và WRITELOG KHÔNG xấu đi.
   ############################################################################ */

/* --- Bước 2: B30BizDocCCMDetail03 (234 MB) - bỏ chú thích khi đến lượt ------
IF NOT EXISTS (SELECT 1 FROM sys.indexes
               WHERE object_id = OBJECT_ID('dbo.B30BizDocCCMDetail03') AND index_id = 1)
    CREATE CLUSTERED INDEX IXCL_B30BizDocCCMDetail03_BizDocId
        ON dbo.B30BizDocCCMDetail03 (BizDocId)
        WITH (ONLINE = ON, SORT_IN_TEMPDB = ON, FILLFACTOR = 90, MAXDOP = 2);
   --------------------------------------------------------------------------- */

/* --- Bước 3: B30BizDocCCMDetail01 (361 MB) ---------------------------------
IF NOT EXISTS (SELECT 1 FROM sys.indexes
               WHERE object_id = OBJECT_ID('dbo.B30BizDocCCMDetail01') AND index_id = 1)
    CREATE CLUSTERED INDEX IXCL_B30BizDocCCMDetail01_BizDocId
        ON dbo.B30BizDocCCMDetail01 (BizDocId)
        WITH (ONLINE = ON, SORT_IN_TEMPDB = ON, FILLFACTOR = 90, MAXDOP = 2);
   --------------------------------------------------------------------------- */

/* --- Bước 4: B30BizDocCCMDetail02 (453 MB - lớn nhất) ----------------------
IF NOT EXISTS (SELECT 1 FROM sys.indexes
               WHERE object_id = OBJECT_ID('dbo.B30BizDocCCMDetail02') AND index_id = 1)
    CREATE CLUSTERED INDEX IXCL_B30BizDocCCMDetail02_BizDocId
        ON dbo.B30BizDocCCMDetail02 (BizDocId)
        WITH (ONLINE = ON, SORT_IN_TEMPDB = ON, FILLFACTOR = 90, MAXDOP = 2);

-- Kèm theo: missing-index score 292.429, impact 99,9%, 6.804 seeks đang chờ
IF NOT EXISTS (SELECT 1 FROM sys.indexes
               WHERE object_id = OBJECT_ID('dbo.B30BizDocCCMDetail02')
                 AND name = 'IX_B30BizDocCCMDetail02_BizDocId_TaxCode')
    CREATE NONCLUSTERED INDEX IX_B30BizDocCCMDetail02_BizDocId_TaxCode
        ON dbo.B30BizDocCCMDetail02 (BizDocId, TaxCode, IsTitleRow)
        WITH (ONLINE = ON, SORT_IN_TEMPDB = ON, FILLFACTOR = 90, MAXDOP = 2);
   --------------------------------------------------------------------------- */
