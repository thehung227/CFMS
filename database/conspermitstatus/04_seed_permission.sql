/* =============================================================================
   Module : Tình trạng giấy phép xây dựng (GPXD)
   File   : 04_seed_permission.sql
   Mô tả  : Dữ liệu danh mục ban đầu + đăng ký quyền truy cập màn hình.
   Chạy   : sau 03_functions_procedures.sql

   LƯU Ý: đổi @BranchCode cho đúng đơn vị đang dùng (src/assets/config.json
          đang là "N01").
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

DECLARE @BranchCode char(3) = 'N01';

/* =============================================================================
   1-2. Danh mục dùng chung (lookupKey 'Class')
        - ParentCode = 'ConsPermitStage'  : Giai đoạn
        - ParentCode = 'ConsPermitStatus' : Tình trạng GPXD ('0' Chưa có, '1' Đã có)

   Dùng SQL động vì batch ad-hoc sẽ lỗi biên dịch ngay nếu bảng B20Category
   không tồn tại (deferred name resolution chỉ áp dụng bên trong procedure).
   ============================================================================= */
IF OBJECT_ID('dbo.B20Category', 'U') IS NOT NULL
BEGIN
    DECLARE @Sql nvarchar(max) = N'
    INSERT INTO dbo.B20Category (ParentCode, Code, Name, IsGroup, IsActive, BranchCode)
    SELECT v.ParentCode, v.Code, v.Name, 0, 1, @BranchCode
    FROM (VALUES
            (''ConsPermitStage'',  ''CB'', N''Chuẩn bị''),
            (''ConsPermitStage'',  ''TC'', N''Thi công''),
            (''ConsPermitStage'',  ''HT'', N''Hoàn thiện''),
            (''ConsPermitStatus'', ''0'',  N''Chưa có''),
            (''ConsPermitStatus'', ''1'',  N''Đã có'')
         ) AS v(ParentCode, Code, Name)
    WHERE NOT EXISTS (SELECT 1 FROM dbo.B20Category c
                      WHERE c.ParentCode = v.ParentCode AND c.Code = v.Code
                        AND ISNULL(c.BranchCode, '''') IN ('''', @BranchCode));';

    EXEC sp_executesql @Sql, N'@BranchCode char(3)', @BranchCode = @BranchCode;
    PRINT 'Seeded B20Category: ConsPermitStage, ConsPermitStatus';
END
ELSE
BEGIN
    PRINT '!! Khong tim thay dbo.B20Category.';
    PRINT '!! Hay them tay 2 nhom danh muc sau vao bang danh muc dung chung (lookupKey ''Class''):';
    PRINT '     ParentCode = ConsPermitStage  : CB/Chuan bi, TC/Thi cong, HT/Hoan thien';
    PRINT '     ParentCode = ConsPermitStatus : 0/Chua co, 1/Da co';
END
GO


/* =============================================================================
   3. Danh mục checklist tài liệu đính kèm của hồ sơ GPXD
      (nguồn cho usp_Newtecons_B30ConsPermitDocument_GetData)
   ============================================================================= */
DECLARE @BranchCode char(3) = 'N01';

INSERT INTO dbo.B20ConsPermitDocument (Code, Name, Attached, BuiltinOrder, IsGroup, IsActive, BranchCode)
SELECT v.Code, v.Name, v.Attached, v.BuiltinOrder, 0, 1, @BranchCode
FROM (VALUES
        ('GPXD_PDN', N'Phiếu đề nghị phê duyệt triển khai thi công (Dự án mới)', CAST(1 AS bit), 1),
        ('GPXD_01',  N'Giấy phép XD 01',                                         CAST(1 AS bit), 2),
        ('GPXD_02',  N'Giấy phép XD 02',                                         CAST(0 AS bit), 3)
     ) AS v(Code, Name, Attached, BuiltinOrder)
WHERE NOT EXISTS (SELECT 1 FROM dbo.B20ConsPermitDocument d
                  WHERE d.BranchCode = @BranchCode AND d.Code = v.Code);

PRINT 'Seeded B20ConsPermitDocument';
GO


/* =============================================================================
   4. Đăng ký quyền truy cập màn hình

      zCommandKey được base-editor/base-explorer suy ra TỪ URL:
          /main/conspermitstatus/index      -> 'conspermitstatus-explorer'
          /main/conspermitstatus/detail/:id -> 'conspermitstatus-editor'

      Thiếu 2 bản ghi này, người dùng mở màn hình sẽ bị
      alert('Người sử dụng hiện thời không có quyền truy cập!') và đá về Home
      (base-editor.component.ts:192-195).

      Tên bảng phân quyền khác nhau giữa các bản triển khai nên script chỉ DÒ và
      in ra lệnh mẫu; hãy đối chiếu định nghĩa usp_Ctc_GetPositionCode_Permission
      rồi chạy lệnh nhân bản quyền cho phù hợp.
   ============================================================================= */
DECLARE @PermissionTable sysname = NULL;

IF OBJECT_ID('dbo.B00PermissionWeb', 'U') IS NOT NULL
    SET @PermissionTable = 'B00PermissionWeb';
ELSE IF OBJECT_ID('dbo.B00WebRoleData', 'U') IS NOT NULL
    SET @PermissionTable = 'B00WebRoleData';

IF @PermissionTable IS NULL
BEGIN
    PRINT '!! Khong xac dinh duoc bang phan quyen.';
    PRINT '!! Hay them thu cong 2 CommandKey sau, cap day du IsDisplay / IsSave / IsApprove / IsPrint / IsExport:';
    PRINT '     conspermitstatus-explorer';
    PRINT '     conspermitstatus-editor';
END
ELSE
BEGIN
    PRINT '>> Bang phan quyen phat hien duoc: dbo.' + @PermissionTable;
    PRINT '>> Nhan ban quyen tu mot module tuong duong (vi du consdocument) sang 2 CommandKey moi:';
    PRINT '     conspermitstatus-explorer  <- consdocument-explorer';
    PRINT '     conspermitstatus-editor    <- consdocument-editor';
    PRINT '>> Mau lenh (doi ten cot cho khop schema thuc te roi chay):';
    PRINT '     INSERT INTO dbo.' + @PermissionTable + ' (CommandKey, PositionCode, IsDisplay, IsSave, IsApprove, IsPrint, IsExport)';
    PRINT '     SELECT REPLACE(CommandKey, ''consdocument'', ''conspermitstatus''),';
    PRINT '            PositionCode, IsDisplay, IsSave, IsApprove, IsPrint, IsExport';
    PRINT '     FROM dbo.' + @PermissionTable;
    PRINT '     WHERE CommandKey IN (''consdocument-explorer'', ''consdocument-editor'');';
END
GO


/* =============================================================================
   5. Quy trình duyệt cho DocCode = 'GP'

      Màn hình dùng LookupBoxInput lookupKey 'Approve' với bộ lọc
      "IsActive = 1 AND Ma_Ct = '{EXPR=DocCode}'" (DocCode = 'GP').
      Cần ít nhất một quy trình duyệt gắn với DocCode 'GP', nếu không dropdown
      "Quy trình duyệt" sẽ rỗng và không lưu được (trường bắt buộc).
   ============================================================================= */
PRINT '>> Tao quy trinh duyet cho DocCode = ''GP'' trong danh muc Quy trinh duyet.';
PRINT '>> Nhanh nhat: nhan ban mot quy trinh dang dung cua module consdocument (Ma_Ct = ''UL'')';
PRINT '   va doi Ma_Ct thanh ''GP'', sau do gan cac buoc duyet / cap bac duyet tuong ung.';
GO

PRINT '=== 04_seed_permission.sql completed ===';
GO
