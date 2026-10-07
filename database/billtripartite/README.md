# Tab "Thanh toán 3 bên" trên Bill thanh toán / quyết toán

Script CSDL cho tab mới ở `/main/billsupp` (DocCode `B4`) và `/main/billsettlement` (DocCode `QT`),
và 2 ô tổng hợp trên các màn thanh toán / quyết toán / duyệt.

## Thứ tự chạy

Cả 3 file chạy lại nhiều lần được. Nếu đã chạy phiên bản trước, chạy lại đủ 3 file.

| # | File | Nội dung |
|---|------|----------|
| 1 | `01_table.sql` | Bảng `B30BizDocCCMTripartite` (+ bổ sung `PayAmountPrev`, `PayAmountTotal` nếu bảng đã có) |
| 2 | `02_view.sql` | View lưới `vB30BizDocCCMTripartite_Edit` |
| 3 | `03_procedures.sql` | `ufn_Newtecons_BizDocCCMTripartite_LuyKeKyTruoc`, `usp_Newtecons_BillThanhToan_LoadTT3Ben`, `usp_Newtecons_BizDocCCMTripartite_UpdateAmount`, `usp_Newtecons_TT3Ben_GetAmount` |

## Luồng dữ liệu

1. Hợp đồng (`contract`) khai báo NCC ở tab "Thanh toán 3 bên" → `B20TripartitePayment`.
2. Trên Bill, bấm **Tải dữ liệu** (chạy cùng các tab khác) hoặc **Tải thanh toán 3 bên**
   (chỉ nạp riêng tab này) → `usp_Newtecons_BillThanhToan_LoadTT3Ben` liệt kê mọi hợp đồng
   C3/C4 còn hiệu lực của từng NCC đó trong cùng gói thầu + đơn vị (bỏ qua hợp đồng của chính Bill),
   cộng thêm các dòng đã thanh toán ở kỳ trước. % thanh toán đã lưu trước đó được giữ lại.
3. Người dùng chỉ nhập **% thanh toán**. Các cột khác bị khoá, không thêm/xoá dòng được.
4. Số tiền lũy kế trên lưới:

   | Cột | Ý nghĩa |
   |-----|---------|
   | `PayAmountPrev` | Thanh toán đến kỳ trước = tổng `PayAmount` các Bill kỳ trước |
   | `PayAmount` | Thanh toán kỳ này = % × (`Amount_THDenKyNay` − `Amount_TongThucHienKyTruoc`) của Bill |
   | `PayAmountTotal` | Tổng cộng = kỳ trước + kỳ này |

   Bill kỳ trước theo cùng quy tắc với `usp_Coteccons_Bill_TongGiaTriThanhToanDenCacKyTruoc`:
   cùng hợp đồng + gói thầu + đối tác + đơn vị, ngày ≤ ngày Bill, còn hiệu lực, và đã có liên kết
   thanh toán (B4: `B30BizDocCCM.BizDocId_TT`, QT: `B30BizDoc.BizDocId_PL`).

   Client tính kỳ này/tổng cộng ngay khi nhập %; sau khi lưu,
   `usp_Newtecons_BizDocCCMTripartite_UpdateAmount` tính lại cả 3 cột theo dữ liệu đã làm tròn.

Procedure chỉ đọc `B20TripartitePayment` / `B30BizDoc`, không ghi vào dữ liệu hợp đồng.

## 2 ô trên đầu phiếu (không lưu, tính mỗi lần mở phiếu)

| Màn hình | Tổng giá trị thanh toán 3 bên | Số tiền còn lại |
|----------|-------------------------------|-----------------|
| `billsupp`, `billsettlement` | Tổng cột "Thanh toán kỳ này" của tab 3 bên | `Amount_DeNghiTT` − tổng |
| `billpaysupp`, `billpaysuppedit`, `approvedbillpaysupp` | `usp_Newtecons_TT3Ben_GetAmount` theo `BizDocId_TT` | `Amount_DeNghiTT` − tổng |
| `settlement_doc`, `approvedsettlement` | `usp_Newtecons_TT3Ben_GetAmount` theo `BizDocId_PL` | `ValueOfPayPeriod` − tổng |

## Cần kiểm tra sau khi chạy

- Backend lưu child theo tên view. Tên đặt theo đúng quy ước đang chạy
  (`vB30BizDocCCMDetail04_EditP4` → `B30BizDocCCMDetail04`), nếu backend có danh sách view
  được phép thì phải đăng ký thêm `vB30BizDocCCMTripartite_Edit`.
