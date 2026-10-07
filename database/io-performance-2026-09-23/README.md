# Điều tra Disk E 100% / 5,2 TB physical reads — `B7R2_Newtecons`

**Ngày phân tích:** 23/09/2026
**Server:** SQL Server 2019 RTM (15.0.2000.5), Enterprise, compat level 130
**Cửa sổ quan sát:** 249 giờ uptime (10,4 ngày)
**Phương pháp:** read-only, 23 query metadata/DMV qua MCP `newtecons-sql-readonly`. Không DDL, không tạo/xoá index, không kill session.
**Ràng buộc:** không được làm chậm tốc độ ghi.

---

## Kết luận

> Hàm scalar **`ufn_B00EventLog_GetLastWriteTime`** — dùng để kiểm tra thời hạn cache widget — quét toàn bộ bảng `B00EventLog` (4,2 GB / 20,65 triệu dòng) theo chế độ **song song** mỗi lần được gọi, đọc **7,9 GB vật lý trong 59,8 giây**.
>
> **762 lần gọi × 7,9 GB = 5,9 TB**, so với **5,2 TB** đo được trên `.mdf`. Đây là nguyên nhân của Disk E 100%.

Người gọi là **client desktop Bravo 7 2.9.0.1** từ máy `FIN05` (login `sa`), **không phải** CFMS web.

### Ba phép kiểm chứng độc lập đều khớp

| Phép tính | Kết quả | Số đo thực tế |
|---|---|---|
| 762 scans × 1.011.303 trang × 8 KB | 5,9 TB | **5,2 TB** |
| 770,6 M trang ÷ 74 M I/O ops | 83 KB/IO | **72–77 KB** |
| 1 scan = 7,9 GB ÷ buffer pool 11 GB | 72% cache bị xoá mỗi lần | **PLE = 27 giây** |

---

## Hiện trạng đo được

### Dung lượng

| | |
|---|---:|
| Dữ liệu user (894 bảng) | 38,9 GB |
| MDF `E:\Databases\B7R2_Newtecons.mdf` | cấp 65,4 GB / dùng 40,0 GB |
| LDF `E:\Databases\B7R2_Newtecons.ldf` | cấp 10,0 GB / dùng 0,06 GB |
| Bảng lớn nhất | 12,66 GB — **không bảng nào > 20 GB** |

5,2 TB đọc ÷ 38,9 GB dữ liệu = **đọc lại toàn bộ database 137 lần trong 10 ngày**.

### Cấu hình server — mảnh ghép cốt lõi

| Thông số | Giá trị | Đánh giá |
|---|---:|---|
| Physical RAM | **16.383 MB** | ⚠️ quá nhỏ cho DB 38,9 GB |
| `max server memory` | **2.147.483.647** | 🔴 mặc định, chưa bao giờ cấu hình |
| Total Server Memory | 11.016 MB | chỉ 28% DB có thể nằm trong cache |
| **Page life expectancy** | **27 giây** | 🔴🔴🔴 ngưỡng tối thiểu ≥ 825 s |
| `cost threshold for parallelism` | **5** | 🔴 mặc định, quá thấp |
| MAXDOP | 8 | trên 16 core |
| `optimize for ad hoc workloads` | 1 | ✅ đã bật |

### Wait stats (249 giờ)

| wait_type | wait (giờ) | avg ms | % tổng |
|---|---:|---:|---:|
| **PAGEIOLATCH_SH** | 207,7 | 35,08 | **30,85%** |
| **CXCONSUMER** | 207,1 | 10,67 | **30,76%** |
| **CXPACKET** | 113,8 | 2,91 | **16,90%** |
| LATCH_EX | 67,3 | 0,68 | 9,99% |
| EXECSYNC | 35,9 | 206,78 | 5,33% |
| **WRITELOG** | 9,8 | **26,39** | 1,45% |
| LCK_M_IS | 2,8 | **11.618,21** | 0,42% |

Parallelism (CXCONSUMER + CXPACKET) = **47,66%** — nhóm wait lớn nhất.

---

## Thủ phạm số 1 — chi tiết

```sql
CREATE FUNCTION [ufn_B00EventLog_GetLastWriteTime] () RETURNS datetime
AS BEGIN
    -- Hàm/thủ tục được tạo tự động bởi _CreateTriggerLog
    -- Để kiểm tra thời hạn hợp lệ khi caching dữ liệu widgets
    DECLARE @dtLastWrite datetime;
    SELECT TOP (1) @dtLastWrite = LastWriteAt
        FROM B00EventLog WITH (NOLOCK) ORDER BY LastWriteAt DESC;   -- THỦ PHẠM
    DECLARE @dtLastWrite1 datetime;   -- biến thừa
    RETURN @dtLastWrite;
END;
```

**Số đo `dm_exec_query_stats`:**

| | |
|---|---:|
| avg physical reads | **1.011.303 trang = 7,9 GB / lần gọi** |
| avg elapsed | **59.774 ms** |
| avg CPU | 6.405 ms → **89% là chờ I/O thuần** |
| total physical (28,3 M) vs logical (15,1 M) | physical > logical → read-ahead không tái dụng cache |

**Execution plan trong cache:**

| NodeId | Operator | EstRows | Cost | Index | Ordered |
|---:|---|---:|---:|---|---|
| 0 | Top | 1 | 674,681 | | |
| 1 | **Parallelism (Gather Streams)** | 1 | 674,681 | | |
| 2 | **Sort (TopN Sort)** | 1 | 674,652 | | |
| 3 | **Clustered Index Scan** | **20.654.000** | 400,444 | `PK_B00EventLogN` | **0** |

**Năm lý do cộng dồn:**

1. Không có index trên `LastWriteAt` (`IndexMB = 0,00`, `NumberOfIndexes = 1`) → bắt buộc quét toàn bộ clustered index.
2. `Ordered = 0` → quét theo thứ tự cấp phát, **không thể dừng sớm**.
3. `TopN Sort` phải nhận đủ 20,65 triệu dòng làm input.
4. Cost 674,68 vs ngưỡng song song 5 → **gấp 135 lần**, luôn chạy MAXDOP 8. Tám luồng cùng phát read-ahead → hàng đợi I/O bão hoà.
5. Buffer pool 11 GB < 2× kích thước bảng → trang bị evict **ngay trong lúc đang quét**, phải đọc lại (1.011.303 trang ≈ 1,88× kích thước bảng).

**Chuỗi nhân quả khép kín:**

```
Trigger DML_*_ChangeLog ──INSERT──► B00EventLog phình 4,2 GB / 20,6 triệu dòng
                                          │
Bravo desktop (FIN05, sa) kiểm tra widget cache
        ▼
ufn_B00EventLog_GetLastWriteTime()
        ├─ không index trên LastWriteAt ──► Clustered Index Scan, Ordered=0
        ├─ cost 674,68 vs threshold 5   ──► chạy SONG SONG MAXDOP 8
        ├─ buffer pool 11 GB < 2x bảng  ──► evict giữa chừng, đọc lại
        ▼
1.011.303 trang = 7,9 GB / lần · 59,8 giây / lần
        ├──► PLE rơi xuống 27 giây — cache của MỌI query khác bị xoá
        ├──► PAGEIOLATCH_SH 30,85% · WRITELOG avg 26,39 ms (GHI CHẬM)
        └──► Disk E: 100% Active Time · latency 350 ms
```

---

## Thứ tự thực thi

| Bước | File | Downtime | Kỳ vọng |
|---:|---|---|---|
| 1 | `00_baseline_measure.sql` | Không | Chụp baseline **trước khi sửa** |
| 2 | `10_P0-1_fix_ufn_B00EventLog_GetLastWriteTime.sql` | Không | 🎯 **Disk E về bình thường** |
| 3 | `00_baseline_measure.sql` sau 24h | — | Xác nhận trước khi làm tiếp |
| 4 | `11_P0-2_P1-1_server_config.sql` | Không | Giảm wait parallelism, chặn OS đói RAM |
| 5 | `20_P1_indexes_online.sql` — **từng mục, cách 24h** | Không (ONLINE) | Sửa UPDATE 25 giây |
| 6 | `21_P1-6_disable_unused_indexes.sql` | Không | **Ghi nhanh hơn** (gỡ 330 MB index chết) |
| 7 | `30_P1-5_clustered_for_heaps.sql` — **từng bảng** | **Có** | Giờ thấp điểm |
| 8 | Hạ tầng (xem mục P1-8 bên dưới) | **Có** | Phối hợp đội VMware |

`99_rollback.sql` — đảo ngược từng mục, tất cả đều được chú thích sẵn.

---

## Danh mục đề xuất

### 🔴 P0 — xử lý ngay

| ID | Nội dung | File | Risk |
|---|---|---|---|
| P0-1 | Sửa `ufn_B00EventLog_GetLastWriteTime`: `ORDER BY LastWriteAt DESC` → `ORDER BY Id DESC` | `10_*.sql` | **Thấp** — không tạo index, không đụng đường ghi |
| P0-2 | `max server memory` = 12288 MB (chừa 4 GB cho OS) | `11_*.sql` | **Rất thấp** — đảo ngược tức thì |

**Cơ sở của P0-1:** `Id` là IDENTITY và `LastWriteAt` **tăng đơn điệu theo `Id`** — kiểm chứng 50/50 mẫu, 0 nghịch đảo. Dùng `MAX` trên 1000 dòng cuối để an toàn với insert đồng thời lệch nhẹ.

> **Phương án B** nếu không được sửa code: `CREATE NONCLUSTERED INDEX IX_B00EventLog_LastWriteAt ON dbo.B00EventLog (LastWriteAt DESC) WITH (ONLINE=ON, DATA_COMPRESSION=PAGE)`. Tốn ~430 MB (nén còn ~200–250 MB) buffer pool vốn đã thiếu. `LastWriteAt` đồng biến → insert rơi vào mép phải, **không page split**, chi phí ghi không đáng kể. Vẫn kém P0-1.

### 🟠 P1 — ưu tiên cao

| ID | Nội dung | File | Risk |
|---|---|---|---|
| P1-1 | `cost threshold for parallelism` 5 → 50 | `11_*.sql` | Thấp–TB (gây recompile hàng loạt) |
| P1-2 | Index `B30CCMBudgetDetail(RowId)` — sửa UPDATE 25 giây | `20_*.sql` | Thấp |
| P1-3a | Index `B30BizDocCCM(DocCode, DocNo)` | `20_*.sql` | TB — phải đo tốc độ ghi |
| P1-3b | Index `B30BizDocCCM(ProductCostId, DocCode)` | **đã có sẵn** ở `../explorer-performance/05_indexes.sql` | — |
| P1-4 | Index `ParBizziInvoice(InvoiceId)` INCLUDE | `20_*.sql` | Thấp (bảng gần read-only) |
| P1-5 | Clustered index cho 4 HEAP `B30BizDocCCMDetail01–04` | `30_*.sql` | **TB–Cao**, cần bảo trì |
| P1-6 | DISABLE 11 index chỉ tốn ghi (~330 MB) | `21_*.sql` | Thấp–TB, xem cảnh báo |
| P1-7 | Index `B30BizDocApprove(ApproveGroup, FinishDate)` + sửa predicate non-sargable | `20_*.sql` | TB |
| P1-8 | **Hạ tầng**: RAM 16 → 48 GB; tách LDF sang volume riêng | thủ công | TB, cần downtime |

**P1-7 — sửa code kèm theo** trong `usp_Kct_BaoCaoTaiChinhCongTruong`:

```sql
-- CŨ:  WHERE DATEADD(hh, 7, FinishDate) <= @_DocDate2      -- non-sargable
-- MỚI: WHERE FinishDate <= DATEADD(hh, -7, @_DocDate2)
```
Kiểm chứng bằng `EXCEPT` hai chiều giữa kết quả cũ và mới trước khi áp.

**P1-8 — chi tiết hạ tầng:**
- VM 16 GB RAM cho DB 38,9 GB → chỉ 28% dữ liệu vào được cache. Nâng lên 48 GB (tối thiểu 32 GB), rồi đặt `max server memory` ≈ RAM − 6 GB.
- MDF và LDF cùng nằm trên ổ E: → `WRITELOG` avg 26,39 ms (ngưỡng < 5 ms). Chuyển LDF sang volume riêng, giảm cấp phát từ 10 GB xuống 4 GB (hiện chỉ dùng 62 MB).
- **Làm sau P0-1.** Nếu sửa hàm xong mà latency về bình thường thì có thể lùi ưu tiên.

### 🟡 P2 — tối ưu sau

| ID | Nội dung | Bằng chứng | Ghi chú |
|---|---|---|---|
| P2-1 | Archive/drop `B00EventLogOld` (12,66 GB) | **0 seek, 0 scan, 0 update trong 249 giờ**; chiếm 32% DB | ⚠️ Xác nhận chính sách lưu trữ pháp lý trước. Backup + test restore rồi mới drop |
| P2-2 | Tối ưu 2 trigger audit | `DML_B30BizDocCCMDetail_ChangeLog`: **801.306 logical reads/lần kích hoạt** | Nguyên nhân gốc làm `B00EventLog` phình. Cân nhắc `COLUMNS_UPDATED()` |
| P2-3 | Bỏ vòng `WHILE` sinh số chứng từ | 29.944 lần quét `B30BizDocCCM`, 596,6 M logical reads | Thay bằng `SEQUENCE` hoặc bảng cấp số |
| P2-4 | Retention cho `B00CTCMailLog` (1,4 GB) + `B00EditLog` (461 MB) | 0 read, chỉ ghi | Giữ 90 ngày |
| P2-5 | Sửa SQL nối chuỗi ở tầng app | `AND ('false'='True' OR ...)`, `WHERE RowId LIKE @_RowId AND 1 = 1` (2.821.487 logical reads/lần = 21,5 GB) | Liên quan `DeclareLayout.ts` |
| P2-6 | Giảm chattiness `usp_sys_DefaultTable_Web` | **17.379.604 lần gọi** (~20/giây) | Cache metadata schema ở app |
| P2-7 | Compat 130 → 150 (scalar UDF inlining) | ≥7 `ufn_*` chạy row-by-row | 🔴 **RISK CAO** — CE mới có thể gây regression diện rộng. Bắt buộc: lên CU mới nhất trước (đang ở **RTM, chưa CU nào**) → bật Query Store → test trên bản copy → có kế hoạch rollback. Đây là dự án riêng |

---

## Bảng dữ liệu tham chiếu

### TOP 10 bảng theo dung lượng

| # | Bảng | Rows | TotalMB | #Idx | Storage |
|---:|---|---:|---:|---:|---|
| 1 | B00EventLogOld | 63.054.993 | 12.665,59 | 1 | CLUSTERED |
| 2 | B30BizDocCCMDetail | 14.511.523 | 11.431,52 | 2 | CLUSTERED |
| 3 | **B00EventLog** | 20.661.337 | 4.215,26 | 1 | CLUSTERED |
| 4 | B30CCMBudgetDetail | 1.279.480 | 1.860,30 | 3 | CLUSTERED |
| 5 | B00CTCMailLog | 3.700.058 | 1.409,82 | 1 | CLUSTERED |
| 6 | B30BizDocDetail | 1.422.198 | 1.295,80 | 4 | CLUSTERED |
| 7 | B30GeneralLedger | 1.414.472 | 1.005,70 | 9 | CLUSTERED |
| 8 | B30BizDocApprove | 890.709 | 501,47 | 6 | CLUSTERED |
| 9 | B30BizDocCCMDetail02 | 555.151 | 466,42 | 1 | **HEAP** |
| 10 | B00EditLog | 2.151.462 | 461,20 | 1 | CLUSTERED |

### TOP query theo physical reads

| # | Object | Execs | avg_phys/exec | avg_elapsed |
|---:|---|---:|---:|---:|
| 1 | **`ufn_B00EventLog_GetLastWriteTime`** | 28 | **1.011.303 (7,9 GB)** | **59.774 ms** |
| 2 | `usp_B30CCMBudget_VoucherForm` | 21 | 290.284 (2,27 GB) | 16.489 ms |
| 3 | `usp_UpdateB30CCMBudget_FromB30BizDoc` | 6 | 404.248 (3,16 GB) | **25.082 ms** |
| 4 | `usp_Coteccons_ApproveNotifications_New` | 272 | 8.475 | 2.679 ms |

### TOP query theo logical reads

| # | Object | Execs | total_logical | avg/exec |
|---:|---|---:|---:|---:|
| 1 | `ufn_Coteccons_B30BizDocCCM_DefaultDocNo_P4_New` | 29.944 | 596.572.879 | 19.922 |
| 2 | `ufn_B30BizDocCCM_DefaultPayRequireNum_2` | 9.365 | 254.093.304 | 27.132 |
| 3 | `usp_Coteccons_ApproveNotifications_New` | 273 | 218.823.021 | 801.549 |
| 4 | `usp_Coteccons_CreateFormula_BizDocCCMDetail02` | 3.791 | 213.997.803 | 56.448 |
| 5 | `DML_B30CCMBudgetDetail_ChangeLog` *(trigger)* | 1.311 | 187.667.927 | 143.148 |
| 6 | `DML_B30BizDocCCMDetail_ChangeLog` *(trigger)* | 186 | 149.043.014 | **801.306** |

### Bảng bị scan nhiều nhất

| Bảng | user_scans | Nguyên nhân |
|---|---:|---|
| B30BizDocCCM | 466.911 | 5 UDF/proc lọc theo cột không có index |
| B30BizDoc | 238.659 | tương tự |
| B30BizDocApprove | 73.333 | `usp_Coteccons_ApproveNotifications_New` |
| B30BizDocCCMDetail01–04 | 166.996 | 4 HEAP, lọc `BizDocId` |
| ParBizziInvoice | 38.926 | chỉ có clustered PK trên `Id` |
| **B00EventLog** | **762** | ít lần nhất nhưng **tốn nhất**: 7,9 GB/lần |

> Bài học: `user_scans` cao **không** đồng nghĩa tốn physical I/O. Bảng 200–450 MB bị scan hàng chục nghìn lần vẫn nằm trong cache. Bảng 4,2 GB bị scan 762 lần thì không.

### Index chỉ tốn ghi (~330 MB)

| Bảng | Index | MB | reads | updates |
|---|---|---:|---:|---:|
| B30BizDocDetail | IX_DocDate | 60,87 | **0** | 30.906 |
| B30BizDocApprove | IX_EmployeeCodeApprove | 40,50 | **0** | 37.010 |
| B30BizDocApprove | IX_EmployeeCode | 34,55 | 14 | 27.978 |
| B30BizDocApprove | IX_DeptCode | 25,07 | 11 | 24.194 |
| B30GeneralLedger | IX_CrspCustomerCode | 54,37 | 34 | 2.550 |
| B30GeneralLedger | IX_Id | 45,13 | **0** | 2.550 |
| B30GeneralLedger | IX_BranchCode | 38,82 | **0** | 2.550 |
| B30BizDocPayment | IX_RowId_Unique | 9,88 | **0** | 4.741 |
| B30BizDocPayment | IX_DocumentDate | 8,42 | **0** | 2.538 |
| B30AccDocCashPayment | IX_Tk_Co, IX_Han_Tt | 12,51 | **0** | 2.205 |

### Request bắt được lúc 09:35 ngày 23/09

| SPID | wait_type | wait_ms | blocked_by | host / program | SQL |
|---:|---|---:|---:|---|---|
| **86** | **CXPACKET** | **23.069** | — | **FIN05 / `Bravo 7 2.9.0.1` (sa)** | **`ufn_B00EventLog_GetLastWriteTime`** |
| 77 | CXPACKET | 12.863 | — | SRC-BRAVOWEB | `vB30CCMBudgetDetailRowId WHERE RowId LIKE @` |
| 94 | PAGEIOLATCH_SH | 97 | — | SRC-BRAVOWEB | `SELECT * FROM vB30BizDocCCM_Explore ...` |
| 93 | LCK_M_S | 41 | **95** | SRC-BRAVOWEB | bị chặn bởi UPDATE |
| 95 | **WRITELOG** | **326** | — | SRC-BRAVOWEB | `usp_Coteccons_UpdateValueOfC3C4` |
| 62 | **LCK_M_X** `[COMPILE]` | 1.420 | **118** | SRC-BRAVOWEB | bị chặn bởi compile lock |

---

## Khuyết tật thiết kế hệ thống

1. **Chỉ 1/39 index trong TOP 15 có cột INCLUDE.** Toàn bộ còn lại single-column → mọi seek kéo Key Lookup (`B30AccDoc`: 1.651.764 lookups; `B30BizDocApprove`: 603.626).
2. **Clustered index trên cột non-unique** (`BizDocId`, `CCMBudgetId`, `DocDate`) → uniquifier 4 byte + mọi NC index phải mang cluster key.
3. **`BranchCode` chỉ có một giá trị `N01`** → độ chọn lọc bằng 0, không bao giờ nên làm cột dẫn đầu. Cột chọn lọc thật là `ProductCostId`.
4. **Không tìm thấy duplicate index.** Vấn đề ngược lại: quá nhiều index hẹp, không covering.
5. `PK_B30GeneralLedger` (`UniqueId`): 0 read / 2.550 update — PK không ai tra cứu.

---

## Vấn đề có thể thuộc VMware / storage

**Giới hạn:** phân tích này chỉ nhìn từ bên trong SQL Server. Các điểm dưới đây **cần kiểm chứng phía vSphere**.

| Quan sát | Diễn giải |
|---|---|
| VM 16 GB RAM cho DB 38,9 GB | Cấu hình sai tỉ lệ — vấn đề hạ tầng, không phải SQL |
| Latency 350 ms ở read size 72–77 KB | Ngay cả HDD 7.2k cũng nên < 20 ms. **Nhưng** nhiều khả năng là *hậu quả* của bão hoà hàng đợi do 8 luồng read-ahead song song |
| `PAGEIOLATCH_SH` avg 35 ms ≠ latency file-level 350 ms | Chênh 10 lần → dấu hiệu **queuing**, không phải service time chậm |
| MDF + LDF cùng ổ E: | `WRITELOG` 26,39 ms bị kéo theo I/O đọc |
| MDF thừa 25 GB (38%) khoảng trống | Dấu vết một đợt xoá/archive lớn trước đây |

**Cần đội hạ tầng kiểm tra:** loại datastore (HDD/SSD/NVMe), thin vs thick provisioning, **VM snapshot đang tồn tại** (nguyên nhân rất phổ biến gây latency cao), storage I/O control / QoS limit, datastore latency từ phía vSphere, VM khác cùng datastore đang tranh chấp.

> **Thứ tự:** sửa P0-1 trước, **rồi mới** đo lại latency. Nếu sau khi loại bỏ 5,2 TB đọc mà latency vẫn 350 ms thì đó mới thực sự là vấn đề storage.

---

## Kiểm chứng — chứng minh không làm chậm ghi

Chạy `00_baseline_measure.sql` **trước** và **sau** mỗi thay đổi.

| Chỉ số | 23/09/2026 | Mục tiêu |
|---|---:|---:|
| Page life expectancy | **27 s** | > 825 s |
| AvgReadLatencyMs | **350 ms** | < 20 ms |
| PAGEIOLATCH_SH % | **30,85%** | < 10% |
| WRITELOG avg | **26,39 ms** | < 5 ms |
| CXPACKET + CXCONSUMER | **47,66%** | < 20% |

**Quy tắc dừng:** nếu `AvgWriteLatencyMs` hoặc `WriteLog_avg_ms` **tăng** sau khi thêm bất kỳ index nào → rollback index đó ngay (`99_rollback.sql`).

---

## Liên quan

- `../explorer-performance/` — tối ưu màn hình Explorer (14/09/2026), đang chờ DBA đo baseline. Chứa sẵn `IX_B30BizDocCCM_ProductCostId_DocCode` (= P1-3b), **không tạo trùng**.
