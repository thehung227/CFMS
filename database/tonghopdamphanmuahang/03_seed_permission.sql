/* =============================================================================
   Báo cáo : Tổng hợp đàm phán mua hàng tập trung  (/main/reportertonghopdamphan/view)
   File    : 03_seed_permission.sql
   Mô tả   : Đăng ký CommandKey 'reportertonghopdamphan' (menu kiểm IsDisplay) và nhân
             bản quyền theo vị trí / user từ màn "Kế hoạch mua hàng (CCM) - VLXD"
             (ccmpurchaseotherbudget-explorer). Đổi @SourceKey nếu muốn nguồn khác.
             Báo cáo chỉ đọc: chỉ giữ IsDisplay / IsPrint / IsExport.

   @Debug = 1 : chạy thử, ROLLBACK. @Debug = 0 : ghi thật. Chạy lại an toàn.
   ============================================================================= */
SET NOCOUNT ON
GO

DECLARE @Debug     bit           = 1;                                  -- <<< đổi thành 0 để ghi thật
DECLARE @SourceKey varchar(48)   = 'ccmpurchaseotherbudget-explorer';
DECLARE @NewKey    varchar(48)   = 'reportertonghopdamphan';
DECLARE @Text      nvarchar(64)  = N'Tổng hợp đàm phán mua hàng tập trung';

IF NOT EXISTS (SELECT 1 FROM dbo.B00CommandWeb WHERE CommandKey = @SourceKey)
BEGIN
    PRINT '!! Khong tim thay CommandKey nguon ' + @SourceKey + ' - dung lai.';
    RETURN;
END

BEGIN TRAN;

INSERT INTO dbo.B00CommandWeb
    (ParentId, IsGroup, Module, CommandKey, Text, ClassName, Description,
     IsActive, CreatedBy, CreatedAt, ModifiedBy, ModifiedAt)
SELECT -1, 0, s.Module, @NewKey, @Text, 'Reporter', LEFT(@Text, 50),
       1, -1, GETUTCDATE(), -1, GETUTCDATE()
FROM dbo.B00CommandWeb s
WHERE s.CommandKey = @SourceKey
      AND NOT EXISTS (SELECT 1 FROM dbo.B00CommandWeb d WHERE d.CommandKey = @NewKey);

PRINT '1. B00CommandWeb           : them ' + CAST(@@ROWCOUNT AS varchar(10)) + ' dong';

INSERT INTO dbo.B00PermissionWebPosition
    (ParentId, IsGroup, BuiltinOrder, CommandId, PositionCode,
     IsDisplay, IsAddNew, IsEdit, IsDelete, IsRecall, IsPrint, IsSave, IsApprove, IsExport,
     IsActive, CreatedBy, CreatedAt, ModifiedBy, ModifiedAt)
SELECT q.ParentId, q.IsGroup, q.BuiltinOrder, cNew.Id, q.PositionCode,
       q.IsDisplay, 0, 0, 0, 0, q.IsDisplay, 0, 0, q.IsDisplay,
       q.IsActive, -1, GETUTCDATE(), -1, GETUTCDATE()
FROM dbo.B00PermissionWebPosition q
     JOIN dbo.B00CommandWeb cOld ON cOld.Id = q.CommandId AND cOld.CommandKey = @SourceKey
     JOIN dbo.B00CommandWeb cNew ON cNew.CommandKey = @NewKey
WHERE NOT EXISTS (SELECT 1 FROM dbo.B00PermissionWebPosition d WHERE d.CommandId = cNew.Id);

PRINT '2. B00PermissionWebPosition: them ' + CAST(@@ROWCOUNT AS varchar(10)) + ' dong';

INSERT INTO dbo.B00PermissionWeb
    (ParentId, IsGroup, BuiltinOrder, CommandId, UserId,
     IsDisplay, IsAddNew, IsEdit, IsDelete, IsRecall, IsPrint, IsSave, IsApprove, IsExport,
     IsActive, CreatedBy, CreatedAt, ModifiedBy, ModifiedAt)
SELECT p.ParentId, p.IsGroup, p.BuiltinOrder, cNew.Id, p.UserId,
       p.IsDisplay, 0, 0, 0, 0, p.IsDisplay, 0, 0, p.IsDisplay,
       p.IsActive, -1, GETUTCDATE(), -1, GETUTCDATE()
FROM dbo.B00PermissionWeb p
     JOIN dbo.B00CommandWeb cOld ON cOld.Id = p.CommandId AND cOld.CommandKey = @SourceKey
     JOIN dbo.B00CommandWeb cNew ON cNew.CommandKey = @NewKey
WHERE NOT EXISTS (SELECT 1 FROM dbo.B00PermissionWeb d WHERE d.CommandId = cNew.Id);

PRINT '3. B00PermissionWeb        : them ' + CAST(@@ROWCOUNT AS varchar(10)) + ' dong';

IF @Debug = 1
BEGIN
    ROLLBACK;
    PRINT '>> @Debug = 1: da ROLLBACK, chua ghi gi.';
END
ELSE
BEGIN
    COMMIT;
    PRINT '>> Da ghi.';
END
GO
