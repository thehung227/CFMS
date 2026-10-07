# Thống kê chi phí theo khoản mục - VPCTY (cột động theo DeptCode)

Lệnh Bravo: `REP07_KQT_TKCPVPCTY` → `dbo.usp_Kqt_ThongKeChiPhiVPCTY` → `dbo.usp_Kqt_ThongKeChiPhiVPCTY_TinhToan`.
Mẫu biểu: `B10CPKM` (level 6 tổng cộng, 7 nhóm, 8 khoản mục, 9 chi tiết theo tài khoản).

## Thứ tự chạy

1. **Backup** definition hiện tại của 2 thủ tục (SSMS → Script Procedure as → CREATE To → File).
2. `01_usp_Kqt_ThongKeChiPhiVPCTY_TinhToan.sql`
3. `02_usp_Kqt_ThongKeChiPhiVPCTY.sql`

Rollback: chạy lại file backup ở bước 1.

## Thay đổi

| Nội dung | Trước | Sau |
|---|---|---|
| Dạng kết quả | 1 dòng / (khoản mục × phòng ban) | 1 dòng / khoản mục, mỗi phòng ban 1 cột `D_<DeptCode>` |
| `ThisPeriod` | Số của 1 phòng ban | Tổng các phòng ban |
| Subtotal (level ≠ 9) | `usp_sys_SumValue` trên bảng nhân bản `ItemNo` theo phòng ban → mọi phòng ban nhận tổng toàn công ty | Tính theo `Formula` từ bậc sâu nhất lên (8 → 7 → 6) cho **từng cột**. Công thức có `* / ( ) =` dùng `usp_sys_SumValue` trên bảng đã dựng cột |
| Gán phòng ban | `DeptCode LIKE 'X%'` → `PKT` cộng trùng số của `PKTMEP` | Mỗi chứng từ về 1 phòng ban có mã tiền tố khớp dài nhất (`BLD-CTC-001` vẫn về `BLD`) |
| Số lần quét dữ liệu | 92 khoản mục × 41 phòng ban = 3.772 | 92 |
| `_LinkCommand` | Mọi dòng (dòng subtotal ra `Other_Key1 = ()`) | Chỉ dòng level 9 |
| Cột bỏ khỏi kết quả | `ProductName`, `ShortName`, `ColumnCode`, `DeptCode` | (thông tin phòng ban nay nằm trên tiêu đề cột) |

Layout trả về:

- `@_LAYOUT_XML`: `<BravoLayout><Cols><Column_D_xxx>` (Bravo desktop, cùng mẫu `usp_Kqt_ThongKeCPTheoKhoanMuc`).
- `@_LAYOUT_JSON`: `[{"grdReport":[{"header":"Chi phí theo phòng ban","columns":[...]},{"header":"Tổng cộng",...}]}]` (web `readJson`).
- `@_COLUMN_OUPUT`: `D_BCHCT,D_BHSSE,...`

## Kiểm tra sau khi cài

```sql
DECLARE @x NVARCHAR(MAX), @j NVARCHAR(MAX), @c NVARCHAR(4000);
EXEC dbo.usp_Kqt_ThongKeChiPhiVPCTY
     @_DocDate1 = '20260101', @_DocDate2 = '20260831', @_Ma_Dvcs = N'N01',
     @_LAYOUT_XML = @x OUTPUT, @_LAYOUT_JSON = @j OUTPUT, @_COLUMN_OUPUT = @c OUTPUT;
SELECT @c AS ColumnList, ISJSON(@j) AS JsonValid, TRY_CAST(@x AS XML) AS LayoutXml;
```

Đối chiếu:

- Dòng `TỔNG CỘNG` (`ItemNo = ''`): `ThisPeriod` = tổng các cột `D_*`.
- Mỗi dòng level 8 = tổng các dòng level 9 trong `Formula`, trên từng cột.
- Cột `D_PKT` sẽ **giảm** so với trước đúng bằng phần của `PKTMEP` (trước đây bị cộng trùng).

---

# Bản `_CCM`: tách giá trị trực tiếp / phân bổ, header 2 tầng

`dbo.usp_Kqt_ThongKeChiPhiVPCTY_CCM` → `dbo.usp_Kqt_ThongKeChiPhiVPCTY_TinhToan_CCM`.

## Thứ tự chạy

1. **Backup** definition hiện tại của 2 thủ tục `_CCM`.
2. `03_usp_Kqt_ThongKeChiPhiVPCTY_TinhToan_CCM.sql`
3. `04_usp_Kqt_ThongKeChiPhiVPCTY_CCM.sql`

Rollback: chạy lại file backup ở bước 1.

## Phân loại trực tiếp / phân bổ

Quy tắc (giữ nguyên như bản đang chạy trên production):

```sql
UPDATE #K_CtTmp
    SET DeptCode = CreditDeptCode, IsPhanBo = 1
    WHERE DocCode = 'VP' AND CreditDeptCode <> DebitDeptCode
```

→ dòng sổ cái của chứng từ `VP` có bộ phận ghi Có khác bộ phận ghi Nợ được quy về **bộ phận đứng ra chi**
(`CreditDeptCode`) và đánh dấu là giá trị phân bổ. Vì đây là phép *chuyển* (không nhân đôi), tổng
`trực tiếp + phân bổ` toàn công ty vẫn bằng tổng chi phí.

`usp_Kqt_ThongKeChiPhiVPCTY_TinhToan_CCM` ghi vào `@_Kqt021` (`#tblKq`):

| Cột | Nội dung |
|---|---|
| `ThisPeriod` | `SUM(<biểu thức số tiền>)` của phần `IsPhanBo = 0` |
| `Amount_PhanBo` | `SUM(<biểu thức số tiền>)` của phần `IsPhanBo = 1` |

Biểu thức số tiền vẫn theo `ItemType` (`NO` / `CO` / `PS_NO` / `PS_CO`), chỉ bọc thêm `CASE WHEN IsPhanBo`.

## Cột động: 3 nhóm × bộ phận

| Nhóm (`Row_0`) | Tiền tố cột | Giá trị |
|---|---|---|
| Giá trị trực tiếp | `D_<DeptCode>` | `ThisPeriod` |
| Giá trị phân bổ | `P_<DeptCode>` | `Amount_PhanBo` |
| Tổng công ty | `T_<DeptCode>` | `ThisPeriod + Amount_PhanBo` |

`Row_1` = mã bộ phận; các cột cùng nhóm dùng chung `<Style>UserData:GRP_...;</Style>` ở `Row_0` để
Bravo gộp tiêu đề. Cột được xếp theo nhóm trước, bộ phận sau, nên tiêu đề gộp luôn liền mạch.

**Chỉ dựng cột cho bộ phận có phát sinh.** `#Dept` lọc trên chính số liệu vừa tính:

```sql
WHERE ItemLevel = 9
GROUP BY DeptCode
HAVING SUM(ABS(ISNULL(ThisPeriod, 0)) + ABS(ISNULL(Amount_PhanBo, 0))) <> 0
```

Dùng `ABS` để bộ phận có số dương và âm triệt tiêu nhau (tổng = 0 nhưng thực tế có phát sinh) vẫn
được giữ. Bộ phận bị loại chỉ mất cột hiển thị — `#DeptMap` trong thủ tục tính vẫn ánh xạ đủ 41 bộ
phận active, nên không có chứng từ nào rơi ra ngoài. Số cột động vì vậy thay đổi theo kỳ báo cáo
(tối đa 41 × 3 = 123).

Ba cột tổng toàn công ty nằm ngoài `<Cols>` động: `ThisPeriod`, `Amount_PhanBo`, `TotalAmount`
(nhóm `Tổng cộng` trong `@_LAYOUT_JSON`).

Dòng subtotal (`ItemLevel <> 9`) được cộng theo `Formula` cho **cả 3 họ cột** và cả 3 cột tổng, nên
`T_x = D_x + P_x` đúng ở mọi bậc kể cả khi rơi vào nhánh `usp_sys_SumValue` (công thức có `* / ( ) =`).

## `RowId` trong `@_Field_GroupBy`

`usp_B30SoCai_GetData_Lk` gộp dữ liệu theo `@_Field_GroupBy`, các cột còn lại lấy `MAX(...)`. Cờ
`IsPhanBo` lấy từ `B30AccDocOther` theo `RowId`, nếu `RowId` không nằm trong `@_Field_GroupBy` thì
`MAX(RowId)` chỉ là **một** dòng bất kỳ của nhóm và `Debit/CreditDeptCode` của dòng đó bị áp cho cả
nhóm đã cộng.

Đo trên dữ liệu 01–09/2026: 258 / 22.147 nhóm chứng từ `VP` (~1,2%) có `DebitDeptCode` hoặc
`CreditDeptCode` khác nhau trong cùng nhóm → sai phân loại. Vì vậy `RowId` được thêm vào
`@_Field_GroupBy`.

Chi phí: `#K_CtTmp` không còn gộp, 189.434 dòng thay vì 110.543 (kỳ 01–09/2026, ~1,7×). `#tblKyNay`
vẫn gộp lại ngay sau đó nên phần còn lại của thủ tục không đổi. Muốn quay về cách cũ thì bỏ `,RowId`
ở cuối `@_Field_GroupBy`.

## Kiểm tra sau khi cài

```sql
DECLARE @x NVARCHAR(MAX), @j NVARCHAR(MAX), @c NVARCHAR(4000);
EXEC dbo.usp_Kqt_ThongKeChiPhiVPCTY_CCM
     @_DocDate1 = '20260101', @_DocDate2 = '20260831', @_Ma_Dvcs = N'N01',
     @_LAYOUT_XML = @x OUTPUT, @_LAYOUT_JSON = @j OUTPUT, @_COLUMN_OUPUT = @c OUTPUT;
SELECT LEN(@c) AS ColumnListLen, ISJSON(@j) AS JsonValid, TRY_CAST(@x AS XML) AS LayoutXml;
```

Đối chiếu:

- Mọi dòng: `T_<x>` = `D_<x>` + `P_<x>`; `TotalAmount` = `ThisPeriod` + `Amount_PhanBo`.
- Dòng `TỔNG CỘNG` (`ItemNo = ''`): `TotalAmount` = tổng các cột `T_*` = tổng `ThisPeriod` của bản
  không `_CCM` cùng kỳ (phân bổ chỉ chuyển giữa các bộ phận, không đổi tổng).
- `P_*` chỉ khác 0 ở các bộ phận đứng ra chi hộ. Kỳ 01–09/2026 trên tài khoản `64*` là `BPHC`, `PNS`,
  `CDCTY`, `VPHN`, `BPIT`, `PDAOTAO`.
