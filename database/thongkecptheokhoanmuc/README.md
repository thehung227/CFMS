# `usp_Kqt_ThongKeCPTheoKhoanMuc` — lỗi "Incorrect syntax near '*'"

Lệnh Bravo: `REP07_KQT_CPKMBCH` → form `Reporter_usp_Kqt_ThongKeCPTheoKhoanMuc`.

## Triệu chứng

```
Incorrect syntax near '*'.      (x6)
Incorrect syntax near 't1'.
```

## Nguyên nhân

Mã cột động sinh bằng `STR(..., 2)` — chỉ đủ chỗ cho 2 chữ số:

```sql
SELECT ProductCostId, ShortName, 'C' + REPLACE(STR(ROW_NUMBER()OVER(ORDER BY ProductCostId),2),' ',0) AS ColumnCode
INTO #Column
FROM #tblKq
GROUP BY ProductCostId, ShortName
```

`STR(n, 2)` khi `n >= 100` bị tràn độ rộng và trả về `'**'`:

| n | `STR(n, 2)` | ColumnCode |
|---|---|---|
| 99 | `99` | `C99` |
| 100 | `**` | `C**` |
| 101 | `**` | `C**` |

Số dự án đưa vào `#tblKq` hiện là **101** (`vB20Product`: `IsActive = 1`, `IsGroup = 0`,
`ProductType = 1`, `RowId` có trong `B20ProjectRulesAcount`), tức vừa vượt ngưỡng 99. Hai dự án cuối
đều nhận `ColumnCode = 'C**'`, làm mọi câu lệnh động sau đó sai cú pháp:

```sql
ALTER TABLE #Resurt ADD C** NUMERIC(18,2);          -- near '*'
INSERT INTO #Resurt (..., C**, C**) ...              -- near '*'
SELECT ..., SUM(C**) AS C** FROM (...) t1 PIVOT (...) -- near '*', near 't1'
```

Báo cáo chạy được tới khi số dự án còn <= 99, nên lỗi mới xuất hiện gần đây chứ không phải do sửa
code.

## Cách sửa

Đổi đúng một dòng, dùng đệm số 0 với độ rộng cố định thay cho `STR`:

```sql
-- CŨ
SELECT ProductCostId, ShortName, 'C' + REPLACE(STR(ROW_NUMBER()OVER(ORDER BY ProductCostId),2),' ',0) AS ColumnCode

-- MỚI
SELECT ProductCostId, ShortName,
       'C' + RIGHT(REPLICATE('0', 4) + CAST(ROW_NUMBER()OVER(ORDER BY ProductCostId) AS VARCHAR(10)), 4) AS ColumnCode
```

Mã cột thành `C0001` … `C0101`, đủ tới 9.999 dự án. Độ rộng cố định nên thứ tự chuỗi vẫn trùng thứ
tự số — quan trọng vì `@_ColumnList` và `@_LAYOUT_XML` được nối bằng phép gán tích luỹ trên `#Column`
mà không có `ORDER BY`.

Tên cột thay đổi (`C01` → `C0001`) nhưng không ảnh hưởng mẫu biểu: `@_LAYOUT_XML` sinh động từ chính
`#Column`, không có chỗ nào hard-code `C01`.

Cách làm: SSMS → `usp_Kqt_ThongKeCPTheoKhoanMuc` → Script Procedure as → CREATE To → File (giữ làm
bản backup), đổi `CREATE` thành `CREATE OR ALTER`, sửa dòng trên rồi chạy.

## Phạm vi ảnh hưởng

- `usp_Kqt_ThongKeCPTheoKhoanMuc_CCM` có cùng đoạn code nhưng **đã bị comment** và có `RETURN` đứng
  trước, nên không dính lỗi.
- `usp_CCM_BcDoanhThuChiPhi_KeToan` cũng dùng `STR(..., 2)` cho `'COT' + ...`, đánh số theo
  `EstimatedTimeDeliverySort`. Chưa lỗi, nhưng sẽ hỏng y hệt nếu vượt 99 giá trị — nên sửa cùng kiểu.
- Các proc khác trong DB dùng `STR(..., 3)` (`usp_Kct_BaoCaoTongHopThongTinDuAn`,
  `usp_Vct_BangTongHopBCTC_TheoKeHoachChi`) an toàn tới 999.

## Kiểm tra trước / sau khi sửa

```sql
-- Số cột sẽ sinh ra
SELECT COUNT(*) AS ProjectCols
FROM dbo.vB20Product t2
WHERE t2.IsActive = 1 AND t2.IsGroup = 0 AND t2.ProductType = 1
  AND t2.RowId IN (SELECT ProductCostId FROM dbo.B20ProjectRulesAcount);
-- > 99 => bản chưa sửa chắc chắn lỗi
```

Sau khi sửa: chạy lại `REP07_KQT_CPKMBCH`, kiểm tra không còn mã cột `C**` và số cột dự án đúng bằng
số ở truy vấn trên.
