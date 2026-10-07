/* =============================================================================
   Module : Admin điều chỉnh số liệu kế hoạch (tách khỏi form gốc)
              /main/planrevenueadjustedit  - Điều chỉnh KH Doanh thu (KD)
              /main/plancashflowsiteedit   - Điều chỉnh KH Dòng tiền (K6)
   File   : 01_seed_permission.sql
   Mô tả  : Đăng ký 4 CommandKey mới và nhân bản quyền từ một màn điều chỉnh admin
            có sẵn (mặc định billeditpayequipment).

   VÌ SAO KHÔNG NHÂN BẢN TỪ planrevenueadjust / plancashflowsite
   ---------------------------------------------------------------
   Hai màn này cho sửa số liệu hồ sơ đã gửi duyệt / đã duyệt mà KHÔNG validate và
   KHÔNG chạy lại quy trình duyệt. Chép quyền từ màn gốc sẽ mở cho mọi người lập
   kế hoạch. billeditpayequipment là màn điều chỉnh admin đã giới hạn cho nhóm phụ
   trách điều chỉnh -> dùng làm nguồn. Muốn nguồn khác: đổi @SourceRoute.
   Sau khi chạy có thể thu hẹp thêm bằng cách xoá dòng quyền không cần trong
   B00PermissionWebPosition / B00PermissionWeb của 4 CommandKey mới.

   zCommandKey suy ra TỪ URL:
       /main/planrevenueadjustedit/index      -> 'planrevenueadjustedit-explorer'
       /main/planrevenueadjustedit/detail/:id -> 'planrevenueadjustedit-editor'
       /main/plancashflowsiteedit/index       -> 'plancashflowsiteedit-explorer'
       /main/plancashflowsiteedit/detail/:id  -> 'plancashflowsiteedit-editor'

   Cờ quyền dùng trên màn hình: IsDisplay (menu), IsEdit (nút Mở), IsSave (nút Lưu
   điều chỉnh), IsPrint (Mẫu in). Màn hình không có nút Thêm / Xóa / Gửi duyệt.

   CÁCH DÙNG
   ---------
   @Debug = 1 : chỉ in số dòng sẽ thêm, ROLLBACK, không ghi gì. Chạy cái này trước.
   @Debug = 0 : ghi thật trong một transaction.
   Chạy lại nhiều lần an toàn (bỏ qua phần đã có).
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

DECLARE @Debug       bit         = 1;                       -- <<< đổi thành 0 để ghi thật
DECLARE @SourceRoute varchar(48) = 'billeditpayequipment';  -- màn hình lấy quyền mẫu

IF OBJECT_ID('tempdb..#Key') IS NOT NULL DROP TABLE #Key;
CREATE TABLE #Key (CommandKeyGoc varchar(48), CommandKeyMoi varchar(48), TextMoi nvarchar(64));
INSERT INTO #Key (CommandKeyGoc, CommandKeyMoi, TextMoi) VALUES
    (@SourceRoute + '-explorer', 'planrevenueadjustedit-explorer', N'Điều chỉnh KH Doanh thu (Admin)'),
    (@SourceRoute + '-editor',   'planrevenueadjustedit-editor',   N'Điều chỉnh KH Doanh thu (Admin)'),
    (@SourceRoute + '-explorer', 'plancashflowsiteedit-explorer',  N'Điều chỉnh KH Dòng tiền (Admin)'),
    (@SourceRoute + '-editor',   'plancashflowsiteedit-editor',    N'Điều chỉnh KH Dòng tiền (Admin)');

IF (SELECT COUNT(DISTINCT c.CommandKey) FROM dbo.B00CommandWeb c JOIN #Key k ON k.CommandKeyGoc = c.CommandKey) <> 2
BEGIN
    PRINT '!! Khong tim du 2 CommandKey goc cua ' + @SourceRoute + ' trong B00CommandWeb - dung lai.';
    SELECT * FROM #Key;
    RETURN;
END

BEGIN TRAN;

/* 1. dbo.B00CommandWeb - đăng ký màn hình (Id là IDENTITY, timestamp bỏ qua) */
INSERT INTO dbo.B00CommandWeb
    (ParentId, IsGroup, Module, CommandKey, Text, ClassName, Description,
     LayoutData, IsActive, CreatedBy, CreatedAt, ModifiedBy, ModifiedAt)
SELECT
     s.ParentId, s.IsGroup, s.Module,
     k.CommandKeyMoi,
     k.TextMoi,
     s.ClassName,                                -- 'Explorer' / 'Editor'
     LEFT(k.TextMoi, 50),
     s.LayoutData, s.IsActive,
     -1, GETUTCDATE(), -1, GETUTCDATE()
FROM dbo.B00CommandWeb s
JOIN #Key k ON k.CommandKeyGoc = s.CommandKey
WHERE NOT EXISTS (SELECT 1 FROM dbo.B00CommandWeb d WHERE d.CommandKey = k.CommandKeyMoi);

PRINT '1. B00CommandWeb           : them ' + CAST(@@ROWCOUNT AS varchar(10)) + ' dong';

/* 2. dbo.B00PermissionWebPosition - quyền theo vị trí.
      Màn hình không gửi duyệt / thêm / xóa nên tắt các cờ đó. */
INSERT INTO dbo.B00PermissionWebPosition
    (ParentId, IsGroup, BuiltinOrder, CommandId, PositionCode,
     IsDisplay, IsAddNew, IsEdit, IsDelete, IsRecall, IsPrint, IsSave, IsApprove, IsExport,
     IsActive, CreatedBy, CreatedAt, ModifiedBy, ModifiedAt)
SELECT
     q.ParentId, q.IsGroup, q.BuiltinOrder,
     cNew.Id,
     q.PositionCode,
     q.IsDisplay, 0, q.IsEdit, 0, q.IsRecall, q.IsPrint, q.IsSave, 0, q.IsExport,
     q.IsActive,
     -1, GETUTCDATE(), -1, GETUTCDATE()
FROM dbo.B00PermissionWebPosition q
JOIN dbo.B00CommandWeb cOld ON cOld.Id = q.CommandId
JOIN #Key k                ON k.CommandKeyGoc = cOld.CommandKey
JOIN dbo.B00CommandWeb cNew ON cNew.CommandKey = k.CommandKeyMoi
WHERE NOT EXISTS (SELECT 1 FROM dbo.B00PermissionWebPosition d WHERE d.CommandId = cNew.Id);

PRINT '2. B00PermissionWebPosition: them ' + CAST(@@ROWCOUNT AS varchar(10)) + ' dong';

/* 3. dbo.B00PermissionWeb - quyền theo user / nhóm user */
INSERT INTO dbo.B00PermissionWeb
    (ParentId, IsGroup, BuiltinOrder, CommandId, UserId,
     IsDisplay, IsAddNew, IsEdit, IsDelete, IsRecall, IsPrint, IsSave, IsApprove, IsExport,
     IsActive, CreatedBy, CreatedAt, ModifiedBy, ModifiedAt)
SELECT
     p.ParentId, p.IsGroup, p.BuiltinOrder,
     cNew.Id,
     p.UserId,
     p.IsDisplay, 0, p.IsEdit, 0, p.IsRecall, p.IsPrint, p.IsSave, 0, p.IsExport,
     p.IsActive,
     -1, GETUTCDATE(), -1, GETUTCDATE()
FROM dbo.B00PermissionWeb p
JOIN dbo.B00CommandWeb cOld ON cOld.Id = p.CommandId
JOIN #Key k                ON k.CommandKeyGoc = cOld.CommandKey
JOIN dbo.B00CommandWeb cNew ON cNew.CommandKey = k.CommandKeyMoi
WHERE NOT EXISTS (SELECT 1 FROM dbo.B00PermissionWeb d WHERE d.CommandId = cNew.Id);

PRINT '3. B00PermissionWeb        : them ' + CAST(@@ROWCOUNT AS varchar(10)) + ' dong';

IF @Debug = 1
BEGIN
    ROLLBACK TRAN;
    PRINT '>> @Debug = 1 nen da ROLLBACK, khong ghi gi. Doi @Debug = 0 de ghi that.';
END
ELSE
BEGIN
    COMMIT TRAN;
    PRINT '>> Da COMMIT.';
END

DROP TABLE #Key;
GO


/* 4. Kiểm tra sau khi chạy - 4 dòng mới, số quyền khớp màn nguồn */
SELECT c.CommandKey, c.Id AS CommandId, c.Module, c.ClassName, c.Text, c.IsActive,
       (SELECT COUNT(*) FROM dbo.B00PermissionWeb p         WHERE p.CommandId = c.Id) AS SoDong_TheoUser,
       (SELECT COUNT(*) FROM dbo.B00PermissionWebPosition q WHERE q.CommandId = c.Id) AS SoDong_TheoViTri
FROM dbo.B00CommandWeb c
WHERE c.CommandKey LIKE 'planrevenueadjustedit-%' OR c.CommandKey LIKE 'plancashflowsiteedit-%'
   OR c.CommandKey LIKE 'billeditpayequipment-%'
ORDER BY c.CommandKey;
GO


/* 5. Rollback thủ công - gỡ màn hình và quyền */
/*
BEGIN TRAN;
DELETE q FROM dbo.B00PermissionWebPosition q JOIN dbo.B00CommandWeb c ON c.Id = q.CommandId
WHERE c.CommandKey LIKE 'planrevenueadjustedit-%' OR c.CommandKey LIKE 'plancashflowsiteedit-%';
DELETE p FROM dbo.B00PermissionWeb p JOIN dbo.B00CommandWeb c ON c.Id = p.CommandId
WHERE c.CommandKey LIKE 'planrevenueadjustedit-%' OR c.CommandKey LIKE 'plancashflowsiteedit-%';
DELETE FROM dbo.B00CommandWeb WHERE CommandKey LIKE 'planrevenueadjustedit-%' OR CommandKey LIKE 'plancashflowsiteedit-%';
COMMIT TRAN;
*/
