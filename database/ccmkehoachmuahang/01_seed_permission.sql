/* =============================================================================
   Module : Kế hoạch mua hàng (CCM) - 5 màn hình clone dùng chung dữ liệu gốc
   File   : 01_seed_permission.sql
   Mô tả  : Đăng ký 10 CommandKey mới và nhân bản quyền của 5 màn hình gốc.

   ĐƯỜNG ĐI CỦA QUYỀN (đã đối chiếu định nghĩa thật trên DB)
   ---------------------------------------------------------
     dbo.B00CommandWeb              : danh mục màn hình. Id IDENTITY, PK = CommandKey.
     dbo.B00PermissionWebPosition   : gán quyền theo PositionCode (CommandId -> B00CommandWeb.Id)
         -> vB00PermissionWebPosition -> usp_Ctc_GetPositionCode_Permission
         -> `permission` (data1) trong base-explorer/base-editor
     dbo.B00PermissionWeb           : gán quyền theo UserId / nhóm user
         -> vB00PermissionWeb -> `permission2` (data2)

   Global.getPermissionAll (global.ts:438): nếu data1 CÓ bản ghi cho CommandKey thì
   data1 quyết định; không có thì lấy theo data2. Vì vậy phải seed CẢ hai bảng quyền
   giống hệt bản gốc, nếu không màn hình CCM sẽ bị chặn.

   zCommandKey suy ra TỪ URL:
       /main/ccmpurchasebudget/index      -> 'ccmpurchasebudget-explorer'
       /main/ccmpurchasebudget/detail/:id -> 'ccmpurchasebudget-editor'
   (base-explorer.component.ts:155, base-editor.component.ts:188)

   Thiếu các bản ghi này, người dùng mở màn hình sẽ bị
   alert('Người sử dụng hiện thời không có quyền truy cập!') và bị đá về Home.

   CÁCH DÙNG
   ---------
   @Debug = 1 : chỉ in số dòng sẽ thêm ở từng bảng, KHÔNG ghi gì. Chạy cái này trước.
   @Debug = 0 : thực thi trong một transaction.
   Chạy lại nhiều lần an toàn (bỏ qua phần đã có).

   HIỆN TRẠNG NGUỒN (đếm lúc viết script)
   --------------------------------------
     CommandKey                          Id    theo User   theo Vị trí
     purchasebudget-explorer             122      11           16
     purchasebudget-editor               123       7           16
     purchaseotherbudget-explorer        435       0           15
     purchaseotherbudget-editor          434       0           15
     purchasemeotherbudget-explorer      512       0            5
     purchasemeotherbudget-editor        511       0            5
     concretebudget-explorer             487       0            8
     concretebudget-editor               488       0            8
     auxiliarymaterialsbuget-explorer    493       0            9
     auxiliarymaterialsbuget-editor      492       0            9
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

DECLARE @Debug bit = 1;          -- <<< đổi thành 0 để ghi thật

/* -----------------------------------------------------------------------------
   0. Ánh xạ màn hình gốc -> màn hình CCM
   ----------------------------------------------------------------------------- */
IF OBJECT_ID('tempdb..#Map') IS NOT NULL DROP TABLE #Map;
CREATE TABLE #Map (SourceRoute varchar(48), TargetRoute varchar(48), ManHinh nvarchar(100));
INSERT INTO #Map (SourceRoute, TargetRoute, ManHinh) VALUES
    ('purchasebudget',          'ccmpurchasebudget',          N'Kế hoạch thép'),
    ('purchaseotherbudget',     'ccmpurchaseotherbudget',     N'KH mua vật tư chính - XD'),
    ('purchasemeotherbudget',   'ccmpurchasemeotherbudget',   N'KH mua vật tư chính - ME'),
    ('concretebudget',          'ccmconcretebudget',          N'Kế hoạch bê tông'),
    ('auxiliarymaterialsbuget', 'ccmauxiliarymaterialsbuget', N'Kế hoạch mua hàng VTP');

/* Cặp CommandKey gốc -> mới, dùng lại ở cả 3 bước */
IF OBJECT_ID('tempdb..#Key') IS NOT NULL DROP TABLE #Key;
CREATE TABLE #Key (CommandKeyGoc varchar(48), CommandKeyMoi varchar(48));
INSERT INTO #Key (CommandKeyGoc, CommandKeyMoi)
SELECT s.CommandKey, REPLACE(s.CommandKey, m.SourceRoute, m.TargetRoute)
FROM dbo.B00CommandWeb s
JOIN #Map m ON s.CommandKey IN (m.SourceRoute + '-explorer', m.SourceRoute + '-editor');

IF (SELECT COUNT(*) FROM #Key) <> 10
BEGIN
    PRINT '!! Khong tim du 10 CommandKey goc trong B00CommandWeb - dung lai.';
    SELECT * FROM #Key;
    RETURN;
END

BEGIN TRAN;

/* =============================================================================
   1. dbo.B00CommandWeb - đăng ký 10 màn hình mới
      Nhân bản nguyên trạng bản ghi gốc, chỉ đổi CommandKey và thêm hậu tố
      " (CCM)" vào Text/Description để phân biệt trên màn hình phân quyền.
      Id là IDENTITY nên không liệt kê; timestamp là rowversion nên bỏ qua.
   ============================================================================= */
INSERT INTO dbo.B00CommandWeb
    (ParentId, IsGroup, Module, CommandKey, Text, ClassName, Description,
     LayoutData, IsActive, CreatedBy, CreatedAt, ModifiedBy, ModifiedAt)
SELECT
     s.ParentId,
     s.IsGroup,
     s.Module,                                   -- giữ nguyên module gốc ('ecommerce' / 'ccm')
     k.CommandKeyMoi,
     LEFT(s.Text + N' (CCM)', 64),               -- Text nvarchar(64)
     s.ClassName,                                -- 'Explorer' / 'Editor' - KHÔNG đổi
     LEFT(s.Description + N' (CCM)', 50),        -- Description nvarchar(50)
     s.LayoutData,
     s.IsActive,
     -1, GETUTCDATE(), -1, GETUTCDATE()
FROM dbo.B00CommandWeb s
JOIN #Key k ON k.CommandKeyGoc = s.CommandKey
WHERE NOT EXISTS (SELECT 1 FROM dbo.B00CommandWeb d WHERE d.CommandKey = k.CommandKeyMoi);

PRINT '1. B00CommandWeb          : them ' + CAST(@@ROWCOUNT AS varchar(10)) + ' dong';

/* =============================================================================
   2. dbo.B00PermissionWebPosition - quyền theo vị trí (nguồn chính)
      Muốn chỉ mở cho các vị trí thuộc CCM: bỏ comment dòng AND q.PositionCode IN (...)
      và điền danh sách PositionCode.
   ============================================================================= */
INSERT INTO dbo.B00PermissionWebPosition
    (ParentId, IsGroup, BuiltinOrder, CommandId, PositionCode,
     IsDisplay, IsAddNew, IsEdit, IsDelete, IsRecall, IsPrint, IsSave, IsApprove, IsExport,
     IsActive, CreatedBy, CreatedAt, ModifiedBy, ModifiedAt)
SELECT
     q.ParentId, q.IsGroup, q.BuiltinOrder,
     cNew.Id,
     q.PositionCode,
     q.IsDisplay, q.IsAddNew, q.IsEdit, q.IsDelete, q.IsRecall, q.IsPrint, q.IsSave,
     q.IsApprove,                                -- màn CCM không có nút Gửi duyệt; đổi thành 0 nếu muốn
     q.IsExport,
     q.IsActive,
     -1, GETUTCDATE(), -1, GETUTCDATE()
FROM dbo.B00PermissionWebPosition q
JOIN dbo.B00CommandWeb cOld ON cOld.Id = q.CommandId
JOIN #Key k                ON k.CommandKeyGoc = cOld.CommandKey
JOIN dbo.B00CommandWeb cNew ON cNew.CommandKey = k.CommandKeyMoi
-- AND q.PositionCode IN (N'CB-008', N'CB-016')   -- <<< chỉ mở cho vị trí CCM
WHERE NOT EXISTS (SELECT 1 FROM dbo.B00PermissionWebPosition d WHERE d.CommandId = cNew.Id);

PRINT '2. B00PermissionWebPosition: them ' + CAST(@@ROWCOUNT AS varchar(10)) + ' dong';

/* =============================================================================
   3. dbo.B00PermissionWeb - quyền theo user / nhóm user
      Hiện chỉ purchasebudget có dữ liệu ở bảng này, nhưng vẫn chạy cho đủ 5 màn.
   ============================================================================= */
INSERT INTO dbo.B00PermissionWeb
    (ParentId, IsGroup, BuiltinOrder, CommandId, UserId,
     IsDisplay, IsAddNew, IsEdit, IsDelete, IsRecall, IsPrint, IsSave, IsApprove, IsExport,
     IsActive, CreatedBy, CreatedAt, ModifiedBy, ModifiedAt)
SELECT
     p.ParentId, p.IsGroup, p.BuiltinOrder,
     cNew.Id,
     p.UserId,
     p.IsDisplay, p.IsAddNew, p.IsEdit, p.IsDelete, p.IsRecall, p.IsPrint, p.IsSave,
     p.IsApprove, p.IsExport,
     p.IsActive,
     -1, GETUTCDATE(), -1, GETUTCDATE()
FROM dbo.B00PermissionWeb p
JOIN dbo.B00CommandWeb cOld ON cOld.Id = p.CommandId
JOIN #Key k                ON k.CommandKeyGoc = cOld.CommandKey
JOIN dbo.B00CommandWeb cNew ON cNew.CommandKey = k.CommandKeyMoi
WHERE NOT EXISTS (SELECT 1 FROM dbo.B00PermissionWeb d WHERE d.CommandId = cNew.Id);

PRINT '3. B00PermissionWeb       : them ' + CAST(@@ROWCOUNT AS varchar(10)) + ' dong';

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
DROP TABLE #Map;
GO


/* =============================================================================
   4. Kiểm tra sau khi chạy - phải ra đủ 10 dòng, số quyền khớp bản gốc
   ============================================================================= */
SELECT c.CommandKey, c.Id AS CommandId, c.Module, c.ClassName, c.Text, c.IsActive,
       (SELECT COUNT(*) FROM dbo.B00PermissionWeb p         WHERE p.CommandId = c.Id) AS SoDong_TheoUser,
       (SELECT COUNT(*) FROM dbo.B00PermissionWebPosition q WHERE q.CommandId = c.Id) AS SoDong_TheoViTri
FROM dbo.B00CommandWeb c
WHERE c.CommandKey LIKE 'ccmpurchasebudget-%'
   OR c.CommandKey LIKE 'ccmpurchaseotherbudget-%'
   OR c.CommandKey LIKE 'ccmpurchasemeotherbudget-%'
   OR c.CommandKey LIKE 'ccmconcretebudget-%'
   OR c.CommandKey LIKE 'ccmauxiliarymaterialsbuget-%'
ORDER BY c.CommandKey;
GO


/* =============================================================================
   5. Rollback thủ công - gỡ sạch 10 màn hình CCM và quyền của chúng
   ============================================================================= */
/*
BEGIN TRAN;

DELETE q
FROM dbo.B00PermissionWebPosition q
JOIN dbo.B00CommandWeb c ON c.Id = q.CommandId
WHERE c.CommandKey LIKE 'ccmpurchasebudget-%' OR c.CommandKey LIKE 'ccmpurchaseotherbudget-%'
   OR c.CommandKey LIKE 'ccmpurchasemeotherbudget-%' OR c.CommandKey LIKE 'ccmconcretebudget-%'
   OR c.CommandKey LIKE 'ccmauxiliarymaterialsbuget-%';

DELETE p
FROM dbo.B00PermissionWeb p
JOIN dbo.B00CommandWeb c ON c.Id = p.CommandId
WHERE c.CommandKey LIKE 'ccmpurchasebudget-%' OR c.CommandKey LIKE 'ccmpurchaseotherbudget-%'
   OR c.CommandKey LIKE 'ccmpurchasemeotherbudget-%' OR c.CommandKey LIKE 'ccmconcretebudget-%'
   OR c.CommandKey LIKE 'ccmauxiliarymaterialsbuget-%';

DELETE FROM dbo.B00CommandWeb
WHERE CommandKey LIKE 'ccmpurchasebudget-%' OR CommandKey LIKE 'ccmpurchaseotherbudget-%'
   OR CommandKey LIKE 'ccmpurchasemeotherbudget-%' OR CommandKey LIKE 'ccmconcretebudget-%'
   OR CommandKey LIKE 'ccmauxiliarymaterialsbuget-%';

COMMIT TRAN;
*/
