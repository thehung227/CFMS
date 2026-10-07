# Thống kê chi phí theo khoản mục — cột động theo công trường

`dbo.usp_Kqt_ThongKeCPKhoanMucCongTruong` — mẫu theo `usp_Kqt_ThongKeCPTheoKhoanMuc`, nhưng
**không dùng mẫu biểu khai báo công thức** (`B10KMBCH`): danh sách khoản mục lấy thẳng từ số liệu
phát sinh.

## Phạm vi số liệu

### Chi phí — sổ cái `vB30GeneralLedger` (qua `usp_B30SoCai_GetData`), kỳ `@_DocDate1` – `@_DocDate2`

| Điều kiện | Tham số |
|---|---|
| `DocCode IN ('PK')` | `@_DocCode` (nhiều mã, ngăn cách dấu phẩy) |
| `Account LIKE '621%' OR Account LIKE '627%'` | `@_Account` (nhiều tiền tố, ngăn cách dấu phẩy) |
| `ISNULL(BizDocId_C1, '') = ''` | cố định — chỉ lấy phát sinh **không** gắn phiếu giao thầu / hợp đồng |
| `ProductCostId = ...` | `@_ProductCostId` (rỗng = tất cả công trường) |
| `ExpenseCatgCode = ...` | `@_ExpenseCatgCode` (rỗng = tất cả khoản mục) |

Số tiền mỗi ô = `SUM(DebitAmount - CreditAmount)` (bút toán ghi Có 621/627 bị trừ ra).

### Số lượng nhân sự — `usp_HRIS_ThongKeSoLuongNhanSuDuAn`

- Gọi bản **chi tiết** (`@_IsDetail = 1`) qua `INSERT … EXEC`, vì bản tổng hợp trả về cột động theo
  nhóm nhân sự nên không hứng vào bảng tạm được.
- Chốt tại **một ngày**: `@_DocDateHR` (mặc định = `@_DocDate2`), không phải số bình quân cả kỳ.
- Ghép về công trường qua `B20Product.Code` (`ProductCode` của bản chi tiết); `Code` là duy nhất
  trong nhóm `ProductType = 1`.
- Số người là thuộc tính của **công trường**, nên lặp lại giống nhau trên mọi dòng khoản mục và
  **không** cộng dồn theo dòng — kể cả ở dòng `TỔNG CỘNG`.

## Kết quả

1 dòng / khoản mục, thêm dòng `TỔNG CỘNG` ở đầu (`ItemLevel = 0`, `BuiltinOrder = 0`).

| Cột | Nội dung |
|---|---|
| `ExpenseCatgCode` | Mã khoản mục (`CP0018`…) |
| `Name` / `Description` | Tên khoản mục (`B20ExpenseCatg.Name`) |
| `C_<ProductCostId>` | **Số tiền** của công trường |
| `Q_<ProductCostId>` | **Số người** của công trường |
| `A_<ProductCostId>` | **TB/người** = `C_… / Q_…` (0 khi không có nhân sự) |
| `TotalAmount` | Thực tế — tổng tất cả công trường |
| `TotalQuantity` | Tổng số người của các công trường có cột |
| `TotalAvgAmount` | `TotalAmount / TotalQuantity` |
| `_LinkCommand` | Drill-down `REP09_BKCT` kèm `Other_Key1` = đúng điều kiện đã lọc |
| `Key_Ct`, `ItemNo`, `ItemLevel`, `IsPrint`, `_FormatStyleKey` | phục vụ Bravo |

Chỉ công trường **có phát sinh chi phí trong kỳ** mới sinh cột (dùng `ABS` nên công trường có số
âm/dương triệt tiêu nhau vẫn được giữ) → số cột thay đổi theo kỳ. Công trường có nhân sự nhưng
không có chi phí sẽ không xuất hiện; ngược lại, công trường có chi phí mà HRIS không có nhân sự thì
`Q_… = 0` và `A_… = 0`.

Output layout:

- `@_LAYOUT_XML` — `<BravoLayout><Cols><Column_…>` cho Bravo desktop, header **2 tầng**:
  `Row_0` = tên tắt công trường (`UserData:P_<ProductCostId>` chung cho 3 cột nên Bravo gộp tiêu đề),
  `Row_1` = `Số tiền` / `Số người` / `TB/người`.
- `@_LAYOUT_JSON` + `@_COLUMN_OUPUT` — cho reporter web (`base-reporter.readJson`); chỉ cột số tiền
  đặt `aggregate: Sum`, cột số người và TB/người không cộng tổng theo cột.

## Cài đặt

1. Chạy `01_usp_Kqt_ThongKeCPKhoanMucCongTruong.sql` (thủ tục mới, không sửa thủ tục nào đang chạy
   → rollback = `DROP PROC dbo.usp_Kqt_ThongKeCPKhoanMucCongTruong`).
2. Bravo Designer: tạo form reporter `Reporter_usp_Kqt_ThongKeCPKhoanMucCongTruong` (lưu vào
   `B00Layout` / `B00LayoutData`), lấy `Reporter_usp_Kqt_ThongKeCPTheoKhoanMuc` làm mẫu: cột cố định
   `ExpenseCatgCode`, `Name`, `TotalAmount`, `TotalQuantity`, `TotalAvgAmount`; phần cột động do
   `@_LAYOUT_XML` dựng.
3. Khai báo lệnh (script dưới đây — **tự review rồi chạy**, cùng nhóm menu `ParentId = 308` với
   `REP07_KQT_CPKMBCH`):

```sql
INSERT INTO dbo.B00Command (ParentId, IsGroup, CommandKey, Text, DLLName, ClassName,
                            CtorArg1, CtorArg2, CtorArgs, MethodName, IsActive)
SELECT 308, 0, 'REP07_KQT_CPKMCT', N'Thống kê chi phí theo khoản mục - Công trường',
       'Bravo.Bravo7.Reporter', 'Reporter',
       'usp_Kqt_ThongKeCPKhoanMucCongTruong',
       'Reporter_usp_Kqt_ThongKeCPKhoanMucCongTruong',
       'CurrencyCode0={VAR=M_Ma_Tte0};', 'Show', 1
WHERE NOT EXISTS (SELECT 1 FROM dbo.B00Command WHERE CommandKey = 'REP07_KQT_CPKMCT');
```

## Kiểm tra sau khi cài

```sql
DECLARE @x NVARCHAR(MAX), @j NVARCHAR(MAX), @c NVARCHAR(4000);
EXEC dbo.usp_Kqt_ThongKeCPKhoanMucCongTruong
     @_DocDate1 = '20260101', @_DocDate2 = '20260930', @_Ma_Dvcs = N'N01',
     @_LAYOUT_XML = @x OUTPUT, @_LAYOUT_JSON = @j OUTPUT, @_COLUMN_OUPUT = @c OUTPUT;
SELECT @c AS ColumnList, ISJSON(@j) AS JsonValid, TRY_CAST(@x AS XML) AS LayoutXml;
```

Số liệu đối chiếu (đo trên production ngày 25/09/2026, kỳ `20260101`–`20260930`, `N01`,
số người chốt ngày `20260930`):

| Chỉ tiêu | Giá trị |
|---|---|
| Dòng sổ cái thoả điều kiện | 8.848 |
| Công trường có phát sinh | 58 |
| Khoản mục có phát sinh | 46 |
| `TỔNG CỘNG` / `TotalAmount` | 24.773.184.515 |
| Khoản mục lớn nhất | `CP0018` Tiếp khách của Phòng/Ban/BCH thực hiện — 13.793.704.897 |
| Cổ Loa (`PROD001810`) | `C_` 1.434.503.020 — `Q_` 144 người — `A_` 9.961.826,53 |

Kiểm tra chéo bằng SELECT thuần:

```sql
-- Tổng chi phí
SELECT SUM(DebitAmount - CreditAmount)
FROM dbo.vB30GeneralLedger
WHERE DocDate BETWEEN '20260101' AND '20260930'
  AND DocCode = 'PK' AND (Account LIKE '621%' OR Account LIKE '627%')
  AND ISNULL(BizDocId_C1, '') = '';

-- Số người từng công trường
EXEC dbo.usp_HRIS_ThongKeSoLuongNhanSuDuAn @_DocDate = '20260930', @_IsDetail = 1;
```

Dòng `TỔNG CỘNG` phải bằng tổng các cột `C_*` và bằng kết quả câu SELECT trên; `Q_*` phải khớp số
dòng chi tiết nhân sự của từng dự án.

## Ghi chú kỹ thuật

- Số liệu chi phí được gom **một lần** tại sổ cái (`@_GroupByCols = 'ExpenseCatgCode,ProductCostId'`),
  `#K_CtTmp` chỉ có 4 cột → không quét lại dữ liệu cho từng khoản mục như `usp_Kqt_ThongKeCPTheoKhoanMuc`.
- Mã cột là `C_`/`Q_`/`A_` + `ProductCostId` (không dùng số thứ tự `C001`…) nên không lặp lại lỗi
  tràn `STR(n, 2)` → `C**` mô tả trong `database/thongkecptheokhoanmuc/README.md`.
- `INSERT … EXEC usp_HRIS_ThongKeSoLuongNhanSuDuAn` kéo theo 2 ràng buộc:
  1. Không thể gọi thủ tục này bằng `INSERT … EXEC` từ bên ngoài (SQL Server không cho lồng).
  2. Thủ tục HRIS đọc qua linked server `HRIS` — thời gian chạy phụ thuộc linked server; nếu môi
     trường báo lỗi giao dịch phân tán (MSDTC) thì kiểm tra cấu hình "Enable Promotion of
     Distributed Transaction" của linked server `HRIS`.
  3. Nếu thủ tục HRIS đổi danh sách cột của bản `@_IsDetail = 1` thì phải sửa `#HR` tương ứng.
- Mọi lệnh động đều `QUOTENAME` tên cột và nhân đôi dấu nháy trong giá trị tham số.
