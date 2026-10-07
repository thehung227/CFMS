# KPI tình trạng duyệt hồ sơ

Hai stored procedure phục vụ đánh giá KPI người duyệt:

| File | SP | Kết quả |
|---|---|---|
| `01_usp_Kpi_TinhTrangDuyetHoSo_ChiTiet.sql` | `usp_Kpi_TinhTrangDuyetHoSo_ChiTiet` | 1 dòng = 1 lượt duyệt của 1 người trên 1 hồ sơ |
| `02_usp_Kpi_TinhTrangDuyetHoSo_TongHop.sql` | `usp_Kpi_TinhTrangDuyetHoSo_TongHop` | Tỷ lệ đúng hạn, gom theo người duyệt / dự án / loại hồ sơ |

SP tổng hợp gọi `INSERT ... EXEC` SP chi tiết, nên logic tính chỉ nằm ở một chỗ.
Chạy file 01 trước, rồi file 02.

## Công thức

```
Số ngày duyệt  = Ngày duyệt thực tế - Ngày đến hạn        (đếm theo ngày làm việc, trừ T7 + CN)
Ngày duyệt thực tế = B30BizDocApprove.FinishDate của chính bước duyệt đó
Ngày đến hạn   = MAX( Ngày kế hoạch = B30BizDocApprove.StartDate
                    ; Ngày nhận hóa đơn Bizzi
                    ; Ngày kế toán đính kèm
                    ; Ngày đính kèm hợp đồng )
Đúng hạn khi Số ngày duyệt <= 0
```

Hồ sơ trong phạm vi: `P4` (bill TT NCC/NTP), `P3` (bill BCH) trên `B30BizDocCCM`;
`C5` (quyết toán), `C3` (hợp đồng) trên `B30BizDoc`.
Hợp đồng C3 không có 3 mốc sau nên ngày đến hạn = ngày kế hoạch của bước duyệt — đúng như yêu cầu.

Ngày lễ **không** được trừ (DB không có bảng lịch nghỉ). Nếu cần, thêm 1 bảng lịch lễ và trừ thêm
trong khối `CROSS APPLY ... AS SoNgayDuyet` ở mục 5 của SP chi tiết.

## Nguồn 3 mốc ngày (đã chốt trên DB ngày 24/09/2026)

Không còn dynamic SQL và không còn tham số dò bảng/cột (`@_TableHoaDonBizzi`, `@_ColNgayNhanHoaDon`,
`@_TableDinhKem`, `@_ColNgayDinhKem`, `@_DocumentCodeKeToan`, `@_DocumentCodeHopDong`) lẫn OUTPUT
`@_GhiChuNguon`. Ba mốc lấy trực tiếp:

| Mốc | Nguồn |
|---|---|
| Ngày nhận hóa đơn Bizzi | `MAX(ParBizziInvoice.ReceivedAt)`, nối qua `B30BizDocContactInfo.InvoiceId`, chỉ dòng `IsSelected = 1` |
| Ngày kế toán đính kèm | `MAX(B30BizDocAtchDoc.CreatedAt)` của hồ sơ, chỉ dòng có `FilePath` |
| Ngày đính kèm hợp đồng | `B30BizDoc.EstimatedCompletionDate` của **hợp đồng cha** (`ParentBizDocId` → `BizDocId`) |

Ghi chú khi đọc code:

- Không dùng view `vB30BizDocContactInfo_Edit` cho mốc Bizzi: view gánh thêm 3 `LEFT JOIN`
  (`B30BizDocCCM` 200k dòng, `B30BizDoc` 46k, `B20Customer`) và bị ép kiểu ngầm `nvarchar(40)` ↔ `varchar(50)`
  trên `BizDocId` nên hai join đó không seek được.
- `B30BizDocAtchDoc.Attached` toàn bảng đang `= 0` nên **không** lọc theo cột đó; dùng `FilePath <> ''`
  (19.430 / 20.022 dòng).
- `B30BizDocAtchDoc.CreatedAt` mặc định `getutcdate()` nên **có** cộng `@_GioLech`, giống `StartDate` /
  `FinishDate`. Thiếu bước này thì mọi lần đính kèm sau 17:00 giờ VN bị lùi về hôm trước và hồ sơ
  bị chấm trễ oan.

## Phải đối chiếu trước khi chốt số liệu

1. **`EstimatedCompletionDate` là "ngày dự kiến hoàn thành" của hợp đồng, không chắc là "ngày đính kèm
   hợp đồng".** Nếu mốc này rơi vào tương lai xa, nó chi phối toàn bộ `MAX()` và làm mọi hồ sơ thành
   "đúng hạn". Chạy thử và so `NgayDenHan` với `NgayKeHoach` trên vài chục dòng trước khi công bố số.
2. **Múi giờ** — kiểm tra vài hồ sơ duyệt sau 17h để xác nhận không lệch 1 ngày.
3. Đối chiếu 3–5 hồ sơ: mở bill trên web, tab Duyệt xem cột "Ngày đến hạn" / "Ngày hoàn thành" của từng
   bước, so với `NgayKeHoach` / `NgayDuyetThucTe` trong kết quả.

Kiểm tra nhanh sau khi cài:

```sql
EXEC dbo.usp_Kpi_TinhTrangDuyetHoSo_ChiTiet
     @_FromDate = '20260901', @_ToDate = '20260930', @_BranchCode = N'N01'
```

## Tham số chính

| Tham số | Ý nghĩa |
|---|---|
| `@_FromDate` / `@_ToDate` | Khoảng **ngày duyệt thực tế**. NULL = tháng hiện tại |
| `@_DocDateFrom` | Chặn ngày lập hồ sơ cho nhẹ truy vấn. NULL = `@_FromDate` − 12 tháng |
| `@_LoaiHoSo` | `'P4,P3,C5,C3'`, rỗng = tất cả |
| `@_ProductCostId` | Gói thầu, nhiều mã cách nhau dấu phẩy |
| `@_ProjectStatus` | Trạng thái dự án (S01…S05), rỗng = tất cả trừ S05 |
| `@_EmployeeCode` | Lọc người duyệt |
| `@_PositionCode` | Lọc cấp bậc duyệt (`'CB-006'`, `'CB-002,CB-012'`), **rỗng = tất cả cấp bậc** |
| `@_BuiltinOrder` | Lọc thứ tự bước duyệt (`1` = bước đầu), **NULL = tất cả các bước** |
| `@_GroupBy` (SP tổng hợp) | `NV` \| `DA` \| `DA_NV` \| `LOAI_NV` |

`@_PositionCode` / `@_BuiltinOrder` thay cho điều kiện trước đây hardcode trong SP
(`a.BuiltinOrder = 1`, rồi `a.PositionCode = 'CB-006'`). Mặc định hiện tại là **không lọc** —
muốn về đúng phạm vi cũ thì truyền tham số tương ứng.

## Lưu ý nghiệp vụ

- **Người duyệt** lấy theo thứ tự ưu tiên `EmployeeCodeApprove` → `EmployeeCodeReal` → `EmployeeCode`,
  vì `EmployeeCode` có thể chứa nhiều mã (cấu hình nhiều người cùng cấp bậc).
- Chỉ tính **lượt đã duyệt** (`ApproveStatus = '1'`, có `FinishDate`). Hồ sơ đang nằm chờ không xuất hiện.
  Muốn theo dõi hồ sơ đang trễ, cần bổ sung nhánh lấy các bước chưa duyệt và so với ngày hiện tại.
- Hồ sơ bị **trả lại rồi duyệt lại**: `B30BizDocApprove` chỉ giữ trạng thái cuối cùng, lịch sử nằm ở
  `B30BizDocApproveLog`. Nếu KPI cần đếm cả số lần trả lại thì lấy thêm từ bảng log.
- Dòng không xác định được ngày đến hạn (cả 4 mốc đều NULL) bị loại khỏi kết quả để không làm sai tỷ lệ.
- `SoNgayDuyetBinhQuan` mang dấu (âm = duyệt sớm hơn hạn); `SoNgayTreBinhQuan` chỉ tính trên các lượt trễ.
- SP **không lọc `B20Product.ProductType`**: bill 12 tháng gần nhất nằm ở cả `ProductType = 1` (17.301 bill)
  lẫn `ProductType = 3` (592 bill), lọc `= 1` sẽ đánh rơi 592 bill.

## Ghi chú hiệu năng (24/09/2026)

- Mốc "ngày đính kèm hợp đồng" trước đây join `ParentBizDocId = ParentBizDocId` (cha ghép cha) thay vì
  `ParentBizDocId = BizDocId`. Riêng nhóm `ParentBizDocId = ''` (21.312 dòng `B30BizDoc` × 4.803 bill)
  sinh ~97 triệu dòng trung gian — đây là nguyên nhân SP chạy rất lâu, và kết quả cũng sai
  (lấy `MAX` của các chứng từ anh em cùng cha chứ không phải của hợp đồng cha).
- Khối lượt duyệt (`#KpiBuoc`) được tính **trước** khối mốc ngày: 12 tháng có ~23.000 hồ sơ nhưng
  1 tháng chỉ ~14.000 lượt duyệt, nên `#KpiBizzi` / `#KpiDinhKem` chỉ quét đúng phần hồ sơ cần chấm.
- Các temp table dùng `BizDocId VARCHAR(50)` cho khớp `B30BizDocCCM` / `B30BizDocAtchDoc`,
  tránh ép kiểu ngầm khi join (trước đây khai `NVARCHAR(32)`).
