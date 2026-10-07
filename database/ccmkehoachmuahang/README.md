# Kế hoạch mua hàng (CCM)

Nhóm menu mới trong sidebar **Cung ứng vật tư → Kế hoạch mua hàng (CCM)**, gồm 5 màn hình
clone từ nhóm "Kế hoạch mua hàng" hiện có.

## Nguyên tắc

- **Dùng chung dữ liệu gốc**: cùng bảng/view, cùng `DocCode`, cùng stored procedure.
  Không tạo thêm loại chứng từ, không đổi schema. Hồ sơ mở trên màn CCM chính là hồ sơ
  công trường đã lập.
- **Không có rule chặn**: bỏ 2 validate "không được thay đổi khi đã gửi duyệt" và
  "không lập mới khi chưa duyệt xong hồ sơ trước".
- **Không có sự kiện tự động ghi đè số liệu**: bỏ các `EvaluatorCaculate` trên lưới chi tiết
  và nút "Tải dữ liệu"; CCM nhập tay mọi cột. Chỉ giữ các evaluator ở `serverUpdated`.
- **Không có màn hình duyệt**: không clone module `approved*`, bỏ nút "Gửi duyệt", ẩn tab
  "Bước duyệt". Các field `ProcessCode` / `ApproveSend` / `CompletedApprove` vẫn giữ để
  dữ liệu không lệch với bản gốc.
- **Vẫn theo Key Permission**: mỗi màn hình có CommandKey riêng, phải seed vào DB.

## Ánh xạ màn hình

| Màn hình | Route gốc | Route CCM |
| --- | --- | --- |
| Kế hoạch thép | `purchasebudget` | `ccmpurchasebudget` |
| KH mua vật tư chính - XD | `purchaseotherbudget` | `ccmpurchaseotherbudget` |
| KH mua vật tư chính - ME | `purchasemeotherbudget` | `ccmpurchasemeotherbudget` |
| Kế hoạch bê tông | `concretebudget` | `ccmconcretebudget` |
| Kế hoạch mua hàng VTP | `auxiliarymaterialsbuget` | `ccmauxiliarymaterialsbuget` |

## Đường đi của quyền

Đã đối chiếu định nghĩa thật trên DB. Web đọc quyền từ **hai** nguồn rồi ghép trong
`Global.getPermissionAll` ([global.ts:438](../../src/app/shared/global.ts#L438)):

| Nguồn | View / SP | Bảng gán quyền | Theo |
| --- | --- | --- | --- |
| `permission` (data1) | `usp_Ctc_GetPositionCode_Permission` → `vB00PermissionWebPosition` | `B00PermissionWebPosition` | PositionCode trong dự án |
| `permission2` (data2) | `vB00PermissionWeb` | `B00PermissionWeb` | UserId / nhóm user |

Cả hai đều join sang danh mục màn hình `B00CommandWeb` qua `CommandId → B00CommandWeb.Id`
(`Id` là IDENTITY, PK là `CommandKey`).

Nếu data1 **có** bản ghi cho CommandKey thì data1 quyết định; không có thì lấy theo data2.
Vì vậy phải seed **cả ba bảng**, chỉ thêm `B00CommandWeb` là chưa đủ.

## Cách chạy

[01_seed_permission.sql](01_seed_permission.sql) làm đủ 3 bước trong một transaction:

| Bước | Bảng | Số dòng sẽ thêm |
| --- | --- | --- |
| 1 | `B00CommandWeb` | 10 |
| 2 | `B00PermissionWebPosition` | 106 |
| 3 | `B00PermissionWeb` | 18 |

1. Để `@Debug = 1` (mặc định) và chạy: script làm đủ 3 lệnh INSERT rồi **ROLLBACK**,
   chỉ in ra số dòng của từng bảng. Không ghi gì.
2. Số liệu đúng thì đổi `@Debug = 0`, chạy lại để COMMIT.
3. Mục 4 trong file: câu SELECT kiểm tra kết quả — phải ra đủ 10 CommandKey với
   số dòng quyền khớp bản gốc.
4. Mục 5: khối `DELETE` gỡ sạch 10 màn hình và quyền của chúng nếu cần rollback.

Script nhân bản **nguyên trạng** bản ghi gốc — mọi cờ quyền, `Module`, `ClassName`,
`PositionCode`, `UserId` giữ y nguyên; chỉ đổi `CommandKey` và thêm hậu tố " (CCM)"
vào `Text` / `Description` để phân biệt trên màn hình phân quyền.
Chạy lại nhiều lần an toàn (bỏ qua phần đã có).

### Hai chỗ có thể muốn sửa trước khi chạy

- **Chỉ mở cho vị trí CCM**: bỏ comment dòng `AND q.PositionCode IN (...)` ở bước 2.
  Không sửa thì ai đang xem được màn gốc cũng xem được màn CCM.
- **`IsApprove`**: đang nhân bản y nguyên. Màn CCM đã gỡ nút "Gửi duyệt" nên cờ này
  không có tác dụng; đổi thành `0` nếu muốn sạch dữ liệu.

Chưa chạy script thì màn hình mới báo *"Người sử dụng hiện thời không có quyền truy cập!"*
và quay về Home.
