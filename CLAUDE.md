# CLAUDE.md

## SQL MCP Rules

MCP server `newtecons-sql-readonly` (source: `tools/mssql-readonly-mcp`) kết nối Microsoft SQL Server bằng account read-only `claude_mcp_ro`.

**Database được xem là Production database.** Mọi thao tác phải an toàn, tối thiểu và chỉ đọc.

### Claude được phép

- inspect schema (`list_tables`, `get_table_schema`)
- inspect table
- inspect view (`list_views`, `get_object_definition`)
- inspect stored procedure definition (`list_procedures`, `get_object_definition`)
- inspect function definition (`list_functions`, `get_object_definition`)
- inspect relationships (`get_foreign_keys`)
- inspect index (`get_indexes`)
- SELECT data (`read_query` — chỉ `SELECT` hoặc `WITH`/CTE)

### Claude không được

- INSERT
- UPDATE
- DELETE
- EXEC
- ALTER
- DROP
- CREATE
- TRUNCATE
- MERGE

Không tìm cách vượt qua validator của `read_query`, không đề xuất cấp thêm quyền cho `claude_mcp_ro`, không chạy migration hay script DDL. Nếu cần thay đổi dữ liệu/schema: chỉ viết script ra để người dùng tự review và tự chạy.

### Trình tự trace khi debug application

Angular Component
→ Angular Service
→ Backend API
→ Stored Procedure / View
→ SQL Table
→ Actual Data

### Giới hạn lượng dữ liệu

- Chỉ query lượng dữ liệu tối thiểu cần thiết.
- Luôn ưu tiên `TOP`, `WHERE`, `COUNT`, `GROUP BY` trước khi đọc dữ liệu lớn.
- Xem `ApproxRowCount` trong `list_tables` trước; với table lớn: COUNT/aggregate trước, filter trước, rồi `SELECT TOP (n)` theo từng phạm vi nhỏ.
- Database có hàng nghìn object: `list_tables` / `list_views` / `list_procedures` / `list_functions` trả theo trang (mặc định 500, xem `totalCount` / `nextOffset`). Ưu tiên lọc bằng `nameContains` (vd. tên module trong Angular) thay vì đọc hết.
- Không `SELECT *` toàn bộ table lớn. `read_query` tự cắt ở `MCP_SQL_MAX_ROWS` (mặc định 500 dòng).
- Chỉ chọn các cột cần thiết; tránh đọc cột dữ liệu lớn (`nvarchar(max)`, `varbinary`) khi không cần.

### Build MCP (sau khi clone hoặc sửa source)

```powershell
cd tools/mssql-readonly-mcp
npm install
npm run build
npm test
```

MCP chạy bằng `node tools/mssql-readonly-mcp/dist/index.js` (khai báo trong `.mcp.json`), đọc cấu hình từ biến môi trường `MCP_SQL_SERVER`, `MCP_SQL_PORT`, `MCP_SQL_DATABASE`, `MCP_SQL_USER`, `MCP_SQL_PASSWORD`, `MCP_SQL_MAX_ROWS`. Không bao giờ ghi password vào file trong repo.

## Browser test với SSO

Test / nhập liệu trên trình duyệt dùng skill `agent-skills:browser-testing-with-devtools` với MCP `chrome-devtools` (khai báo trong `.mcp.json`, gắn vào Chrome đang mở ở `http://127.0.0.1:9222`).

1. Tài khoản SSO nằm trong `.env.sso` ở gốc repo (gitignore; mẫu `.env.sso.example`): `SSO_EMAIL`, `SSO_PASSWORD`, `APP_URL`.
2. Trước khi dùng tool `chrome-devtools`, chạy `node tools/browser-sso/login.mjs`: mở Chrome profile riêng (`~/.cache/cfms-sso-chrome-profile`), điền form Keycloak `sso.newtecons.vn`, chờ tới `#/main/`. Phiên hết hạn / MCP báo không kết nối được Chrome → chạy lại script.
3. Claude **không** đọc, in hay tự gõ nội dung `.env.sso`; không dùng tool `fill` của MCP cho ô password — việc đăng nhập để script làm.
4. `ApiEndpoint` của cả `localhost` lẫn `cfms.newtecons.vn` trong `src/assets/config.json` đều là `https://cfms.newtecons.vn` (production): thao tác Lưu / Duyệt / Xoá trên trình duyệt ghi vào dữ liệu thật → hỏi người dùng trước khi bấm.
5. Test parser: `node --test tools/browser-sso/lib.test.mjs`.
