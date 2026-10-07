# Tối ưu tốc độ màn hình Explorer: Thanh toán & Hợp đồng

Phạm vi:

| Object | Màn hình dùng (Structure.Parent) |
|--------|----------------------------------|
| `vB30BizDocCCM_Explore` | `billpaysupp`, `billpayteam`, `billpaydept`, `billsupp`, `billteam`, `billsettlement`, … (~20 màn) |
| `vB30BizDoc_Explore` | `contract`, `appendix`, `depositcontract`, `creditcontract`, `concreteloss`, `mainlement`, … |
| `vB30CCMBudget_Explore` | `paymentproposal`, `paymentccmproposal`, `paymentextraproposal`, `paymentmeproposal`, `plan*`, … |
| `ufn_Coteccons_GoiThau_Theo_NhanVien` | 379 chỗ / 237 file frontend (FilterKey + lookupfilter) và `usp_CCM_PlanRevenue` |

Ràng buộc: **không làm chậm ghi dữ liệu**.

## 1. Hiện trạng (đọc từ DB production ngày 14/09/2026, chỉ đọc)

| Bảng | Số dòng | Dung lượng | Index hiện có |
|------|--------:|-----------:|---------------|
| `B30BizDocCCM` | 199.433 | 199 MB | clustered `BizDocId`, PK `Id` |
| `B30BizDoc` | 46.070 | 79 MB | clustered `BizDocId`, PK `Id` |
| `B30CCMBudget` | 15.826 | 13 MB | clustered `CCMBudgetId`, PK `Id` |
| `B30BizDocApprove` | 885.299 | 322 MB + 5 NCI (167 MB) | `BizDocId` (**không INCLUDE**), `DeptCode`, `EmployeeCode`, `EmployeeCodeApprove`, `PositionCode` |
| `B30BizDocCCMDetail` | 14,4 triệu | 10,7 GB | clustered `BizDocId` |
| `B20ProductHuman` | 57.271 | 8 MB | clustered `ProductCostId`, PK `Id` (không có `EmployeeCode`) |

- `BranchCode` chỉ có 1 giá trị (`N01`) → lọc theo nó không giúp gì. Cột lọc chọn lọc thật là `ProductCostId` (~250 dự án).
- Dự án lớn nhất `PROD001658`: 4.008 phiếu P4 (21.306 dòng duyệt), 524 hợp đồng C3 (2.754 dòng duyệt).
  Phiếu P4/C3 của dự án này có **0 dòng** trong bảng detail, nhưng view vẫn aggregate detail cho từng dòng.
- Mỗi lần mở explorer, frontend gửi **2 query** cùng bộ lọc: `fetchData` + `getCountData`
  (`src/app/main/_baseform/base-explorer.component.ts`).
- Server: SQL Server 2019 **RTM 15.0.2000.5 (chưa cài CU)**, Enterprise, compatibility level **130**,
  Query Store **OFF**, `READ_COMMITTED_SNAPSHOT` **OFF**, `ALLOW_SNAPSHOT_ISOLATION` **ON**.
- Mỗi bảng trên đều có trigger `DML_*_ChangeLog` (30–130 nghìn ký tự T-SQL) chạy trên mọi INSERT/UPDATE/DELETE.

## 2. Nguyên nhân chậm (xếp theo mức ảnh hưởng ước lượng)

> Tài khoản MCP không có `VIEW SERVER STATE`, Query Store tắt → **chưa đo được thời gian thật**.
> Các con số dưới đây tính từ số dòng/dung lượng, cần DBA đo lại bằng `00_measure_and_backup.sql`.

1. **Không có index theo `ProductCostId`/`DocCode` trên bảng header.** Mọi query explorer (và query đếm)
   phải quét toàn bộ `B30BizDocCCM` (~25 nghìn trang) hoặc `B30BizDoc` (~10 nghìn trang).
   RCSI đang tắt nên lần quét toàn bảng còn xin shared lock trên mọi dòng. Vì vậy nó bị chặn bởi bất kỳ transaction ghi nào
   đang chạy, và các transaction ghi này giữ lock lâu do trigger ChangeLog lớn.
2. **Truy cập `B30BizDocApprove` lặp lại cho từng dòng.** Mỗi dòng header gọi subquery: 4 lần ở view CCM,
   **9 lần** ở view hợp đồng, 4 lần ở view CCMBudget. Index `BizDocId` không có INCLUDE nên mỗi lần là
   seek + key lookup cho từng dòng duyệt (~5 dòng/phiếu). Ví dụ dự án lớn nhất: ~85 nghìn lookup cho P4, ~25 nghìn cho C3.
3. **Hàm phân quyền là multi-statement TVF.** Ở compat 130, optimizer luôn ước lượng 100 dòng, ghi vào
   table variable, và quét toàn bộ `B20ProductHuman` mỗi lần gọi (không có index `EmployeeCode`).
4. **View hợp đồng có derived table `NK`.** Nó group trên `vB30AccDocEquip_ExploreInventory` (bản thân có subquery tương quan)
   và gọi CLR aggregate `dbo.Concatenate` để tạo cột `Stt`, trong khi view **không dùng** `Stt`.

## 3. Giải pháp và tác động tới ghi

| File | Thay đổi | Đọc | Ghi |
|------|----------|-----|-----|
| `01_ufn_GoiThau_Theo_NhanVien_inline.sql` | Đổi hàm thành inline TVF, giữ nguyên tên, tham số, kiểu cột `RowId VARCHAR(24)` | Optimizer thấy số dòng thật và gộp hàm vào plan của query gọi | Không ảnh hưởng |
| `02_view_vB30BizDocCCM_Explore.sql` | 4 lần đọc `B30BizDocApprove` → 2 | Giảm ~50% đọc bảng duyệt | Không ảnh hưởng |
| `03_view_vB30BizDoc_Explore.sql` | 9 lần đọc → 3; `NK` đọc thẳng `B30AccDocEquip`, bỏ `Concatenate` không dùng | Giảm ~2/3 đọc bảng duyệt | Không ảnh hưởng |
| `04_view_vB30CCMBudget_Explore.sql` | 4 lần đọc → 3; bỏ 3 `OUTER APPLY` không được SELECT (`dt_BTCTA/B/C`) | Giảm nhẹ | Không ảnh hưởng |
| `05_indexes.sql` bước 1 | NCI hẹp `(ProductCostId, DocCode)` trên `B30BizDocCCM`, `B30BizDoc`; `(EmployeeCode)` trên `B20ProductHuman` | Seek theo dự án thay vì quét toàn bảng; query đếm đọc từ index; ít lock hơn | Xem dưới |
| `05_indexes.sql` bước 2 (tuỳ chọn) | **Thay** index `IX_B30BizDocApprove_BizDocId` bằng bản có INCLUDE (`DROP_EXISTING`, **không tăng số index**) | Hết key lookup khi đọc bảng duyệt | Xem dưới |

Tất cả view giữ nguyên tên cột, thứ tự, kiểu dữ liệu. 25 procedure đang dùng các view này không phải sửa.

### Tác động ghi của index (bước 5)

- **Index header (`B30BizDocCCM`, `B30BizDoc`)**: chỉ phải cập nhật khi INSERT/DELETE, hoặc khi UPDATE đổi đúng các cột trong index
  (`ProductCostId`, `DocCode`, `IsActive`, `IsMaintenance`, `BranchCode`, `ApproveSend`). Các lần lưu phiếu và duyệt thông thường
  sửa cột khác nên **không chạm** index này. Kích thước ~10–15 MB/index. `FILLFACTOR = 90` để giảm page split.
- **`B20ProductHuman`**: bảng phân quyền, rất ít khi ghi.
- **`B30BizDocApprove` (tuỳ chọn)**: số index giữ nguyên 6, nhưng index `BizDocId` rộng hơn (ước lượng 41 MB → ~90 MB). Khi gửi hoặc duyệt
  (cập nhật `ApproveStatus`, `FinishDate`, `EmployeeCodeApprove`, `DateSend`…), mỗi dòng duyệt bị sửa phát sinh thêm 1 lần cập nhật dòng index.
  Chi phí này nhỏ so với trigger `DML_B30BizDocApprove_ChangeLog` chạy cùng lệnh, nhưng **không bằng 0**. Chỉ làm bước này
  nếu đo sau bước 1–4 vẫn thấy key lookup trên `B30BizDocApprove` chiếm phần lớn.
- **Không dùng filtered index / indexed view**: chúng bắt buộc session ghi phải có `QUOTED_IDENTIFIER ON` + `ANSI_NULLS ON`,
  nếu không lệnh ghi sẽ **lỗi** (đã có `usp_Kct_SoChiTietCongNoTheoCongTrinh` tạo với SET option OFF).
- Tạo index bằng `ONLINE = ON` (Enterprise) → không khoá bảng khi tạo. Vẫn nên chạy ngoài giờ cao điểm.
- Để bù chi phí ghi: DBA kiểm tra 4 NCI còn lại trên `B30BizDocApprove` (`DeptCode`, `EmployeeCode`, `EmployeeCodeApprove`, `PositionCode`),
  index nào không có seek/scan thì cân nhắc bỏ (query ở cuối `00_measure_and_backup.sql`, cần `VIEW SERVER STATE`).

## 4. Thứ tự chạy

Chạy **từng bước, đo sau mỗi bước** (giữ bước có cải thiện vượt sai số, revert bước không cải thiện):

1. `00_measure_and_backup.sql`: sao lưu định nghĩa hiện tại + đo baseline (ghi vào mục 7).
2. `01_ufn_GoiThau_Theo_NhanVien_inline.sql` → đo.
3. `02`, `03`, `04` (view) → đo.
4. `05_indexes.sql` bước 1 → đo lại cả đọc **và** một thao tác ghi điển hình (lưu phiếu P4, duyệt 1 bước) trên UAT.
5. `05_indexes.sql` bước 2 chỉ khi cần (xem mục 3).

Rollback: `99_rollback.sql` (index + hàm). Rollback view bằng file sao lưu ở bước 1.

File `.sql` lưu dạng UTF-8 có BOM (view có chuỗi `N'Đã hoàn thành'`). Nếu mở bằng tool khác SSMS, kiểm tra encoding trước khi chạy.

## 5. Đã kiểm chứng (query chỉ đọc trên production)

Chạy phần thân view lấy **nguyên văn từ file** song song với object gốc, so sánh `SELECT *` bằng `EXCEPT` hai chiều
(tức là so **tất cả cột**, không chỉ cột bị sửa):

| Object | Phạm vi so sánh | Số dòng | Khác biệt |
|--------|-----------------|--------:|----------:|
| `ufn_Coteccons_GoiThau_Theo_NhanVien` | 5 nhân viên có nhiều gói thầu nhất | 1.732 | 0 |
| `vB30BizDocCCM_Explore` | Mọi DocCode của `PROD001865` | 940 | 0 |
| `vB30BizDoc_Explore` | C3 của `PROD001658` (tất cả cột). Riêng các cột bị sửa: so thêm mọi DocCode, 1.805 dòng | 571 | 0 |
| `vB30CCMBudget_Explore` | Dự án nhiều phiếu nhất | 396 | 0 |

Khi so tất cả cột trên mọi DocCode của `PROD001658`, query bị timeout 30 giây (phải chạy view cũ và view mới nhiều lần), nên phải thu hẹp phạm vi.

Lưu ý: view gốc lấy `XuLyTiepTheo` và `CVXuLyTiepTheo` bằng 2 subquery `TOP 1 … ORDER BY ApproveGroup` riêng biệt.
Khi nhiều người cùng một nhóm duyệt đang chờ, 2 cột có thể lấy từ 2 dòng khác nhau. Bản mới lấy cả 2 cột từ cùng 1 dòng.
Trong dữ liệu đã so sánh không có trường hợp này.

## 6. Chưa làm, cần quyết định thêm

| Hạng mục | Lợi ích | Rủi ro / điều kiện |
|----------|---------|--------------------|
| Bật `READ_COMMITTED_SNAPSHOT` | Explorer không còn bị chặn bởi lệnh ghi và ngược lại. `ALLOW_SNAPSHOT_ISOLATION` đã ON nên row version **đã được tạo** cho mọi lệnh ghi, bật RCSI không tăng chi phí ghi | Cần rà code sinh số chứng từ kiểu `SELECT MAX` rồi `INSERT` (vd. `ufn_Coteccons_B30BizDocCCM_DefaultDocNo_P4_New`). Lệnh `ALTER DATABASE` cần vài giây không có session khác. Cách an toàn hơn: backend chạy riêng query explorer bằng `SET TRANSACTION ISOLATION LEVEL SNAPSHOT` |
| Cài CU mới nhất cho SQL Server 2019 | Nhiều bản sửa lỗi optimizer, hiệu năng, bảo mật từ 2019 tới nay | Test trên UAT trước |
| Bật Query Store | Có số đo thời gian thật; ép lại plan cũ nếu bị regression | Overhead thấp. Nên bật **trước** mọi thay đổi khác |
| Nâng compat level 130 → 150 | Batch mode on rowstore, table variable deferred compilation… | Đổi cardinality estimator, cần Query Store + test |
| `paymentccmproposal`: FilterKey không có `ProductCostId` | Hiện mỗi lần mở tính view cho toàn bộ ~6.700 phiếu K9 | Là quyết định nghiệp vụ (màn hình xem tất cả dự án?) |
| View explorer riêng, gọn cho P4 | Bỏ aggregate `B30BizDocCCMDetail` và cột không hiển thị | View hiện dùng chung ~20 màn + 10 procedure nên không sửa trực tiếp |
| `NK` trong `vB30BizDoc_Explore` | Group theo `BizDocId_PO, DocNo` nên PO có nhiều phiếu nhập khác số sẽ **nhân dòng** trên explorer | Hành vi có sẵn, đã giữ nguyên |

## 7. Nhật ký đo (điền khi chạy)

| Bước | Query (00) | Logical reads trước → sau | CPU / Elapsed (ms) trước → sau | Giữ / Revert | Ghi chú |
|------|-----------|---------------------------|--------------------------------|--------------|---------|
| Baseline | A, A-count, B, B-count, C | | | – | |
| 01 hàm | | | | | |
| 02–04 view | | | | | |
| 05 bước 1 | | | | | + thời gian lưu P4 / duyệt |
| 05 bước 2 | | | | | + thời gian duyệt |
