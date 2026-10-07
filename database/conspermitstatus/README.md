# Module "Tình trạng giấy phép xây dựng" (GPXD)

Script CSDL cho màn hình `/main/conspermitstatus` (Angular: `src/app/main/conspermitstatus/`).

## Thứ tự chạy

| # | File | Nội dung |
|---|------|----------|
| 1 | `01_tables.sql` | `B30ConsPermit`, `B30ConsPermitDetail`, `B20ConsPermitDocument` + Business Key |
| 2 | `02_views.sql` | Các view mà `Layout.ts` trỏ tới |
| 3 | `03_functions_procedures.sql` | Sinh số hồ sơ, kiểm tra trùng, nạp đính kèm, đánh lại STT, mẫu in |
| 4 | `04_seed_permission.sql` | Danh mục ban đầu + hướng dẫn cấp quyền |

Các file mã hoá UTF-8 có BOM để SSMS hiển thị đúng tiếng Việt.

## Bảng và khoá

- **Không có FOREIGN KEY** giữa bảng cha và bảng chi tiết (theo yêu cầu); liên kết qua `BizDocId`.
- Mọi bảng đều có bộ cột chuẩn: `Id` (identity, PK), `ParentId`, `IsGroup`, `BranchCode`,
  `IsActive`, `CreatedBy`, `CreatedAt`, `ModifiedBy`, `ModifiedAt`.

| Bảng | Business Key |
|------|--------------|
| `B30ConsPermit` | `(BranchCode, DocCode, DocNo)` — unique, lọc `IsActive = 1` |
| `B30ConsPermitDetail` | `(BranchCode, BizDocId, BuiltinOrder)` — unique, lọc `IsActive = 1` |
| `B20ConsPermitDocument` | `(BranchCode, Code)` — unique, lọc `IsActive = 1` |

Đính kèm dùng lại `B30BizDocDocument`, bước duyệt dùng lại `B30BizDocApprove` /
`B30BizDocApproveLog` — không tạo bảng mới.

## Cần kiểm tra sau khi chạy

1. `02_views.sql` phần 5 nhân bản view bước duyệt từ `vB30BizDocApprove_AEditConsDocument`.
   Nếu CSDL không có view mẫu đó, script sẽ in hướng dẫn — hãy gán `@SourceView` sang một
   view `vB30BizDocApprove_AEdit*` đang dùng được rồi chạy lại đoạn đó.
2. `vB30ConsPermit_Explorer` đang lấy tên gói thầu là `B20Project.Name`. Nếu cột tên khác,
   sửa đúng một dòng đã được đánh dấu trong file.
3. `usp_Newtecons_B30ConsPermitDocument_GetData` đọc `DocumentCode` / `DocumentName` từ
   `vB30BizDocDocument`. Nếu view không có 2 cột này, bỏ chúng khỏi procedure.
4. Cấp quyền cho `conspermitstatus-explorer` và `conspermitstatus-editor`, nếu không màn hình
   sẽ báo "Người sử dụng hiện thời không có quyền truy cập!".
5. Tạo quy trình duyệt với `Ma_Ct = 'GP'`, nếu không dropdown "Quy trình duyệt" sẽ rỗng.

## Lưu ý về view `_Edit`

Khi lưu, framework gửi lên **tất cả** cột đọc được từ view (`base-editor.component.ts`
dòng 2044-2058). Vì vậy các view `_Edit` chỉ SELECT từ **một** bảng gốc, không JOIN và
không có cột dẫn xuất. Tên hiển thị (gói thầu, giai đoạn, tình trạng) do lookup của
control/lưới tự lấy từ `/api/lookup/`.
