/* =============================================================================
   Module : Duyệt tình trạng giấy phép xây dựng (approvedconspermitstatus)
   File   : 05_approve_views.sql
   Mô tả  : Hai view mà Layout.ts của module duyệt trỏ tới.

            vB30BizDocApprove_ConsPermitExplorer : danh sách hồ sơ chờ duyệt
            vB30BizDocApprove_ConsPermitEdit     : màn hình duyệt một hồ sơ

   B30BizDocApprove là bảng dùng chung toàn hệ thống nên script này NHÂN BẢN
   định nghĩa của cặp view đã có sẵn cho module "Tài liệu công trường"
   (approvedconsdocument) rồi đổi:
        ConsDocument -> ConsPermit        (tên view + bảng nghiệp vụ)
        'CD'         -> 'GP'              (DocCode)

   Cách này tránh việc viết lại từ đầu và lệch schema. SAU KHI CHẠY, hãy mở
   định nghĩa 2 view vừa tạo để kiểm tra lại - đặc biệt là các cột lấy từ bảng
   nghiệp vụ (B30ConsPermit có các cột riêng: ProcessCode, ApproveSend,
   CompletedApprove... nhưng KHÔNG có CustomerCode/TaxRegNo như B30ConsDocument).

   Chạy   : sau 04_seed_permission.sql
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* -----------------------------------------------------------------------------
   1. vB30BizDocApprove_ConsPermitExplorer - danh sách hồ sơ chờ duyệt
   -------------------------------------------------------------------------- */
DECLARE @SourceName sysname      = N'vB30BizDocApprove_ConsDocumentExplorer';
DECLARE @TargetName sysname      = N'vB30BizDocApprove_ConsPermitExplorer';
DECLARE @Definition nvarchar(max);
DECLARE @Sql        nvarchar(max);

SET @Definition = OBJECT_DEFINITION(OBJECT_ID('dbo.' + @SourceName));

IF @Definition IS NULL
BEGIN
    PRINT '!! Khong tim thay view mau dbo.' + @SourceName + '.';
    PRINT '!! Hay chon mot view vB30BizDocApprove_*Explorer dang dung duoc, gan vao @SourceName roi chay lai.';
END
ELSE
BEGIN
    IF OBJECT_ID('dbo.' + @TargetName, 'V') IS NOT NULL
        EXEC('DROP VIEW dbo.' + @TargetName);

    SET @Sql = REPLACE(@Definition, 'ConsDocument', 'ConsPermit');
    SET @Sql = REPLACE(@Sql, '''CD''', '''GP''');

    EXEC sp_executesql @Sql;
    PRINT 'Created view dbo.' + @TargetName + ' (nhan ban tu ' + @SourceName + ')';
    PRINT '>> Kiem tra lai cac cot lay tu B30ConsPermit trong view vua tao.';
END
GO


/* -----------------------------------------------------------------------------
   2. vB30BizDocApprove_ConsPermitEdit - màn hình duyệt một hồ sơ

      View này cấp dữ liệu cho đầu phiếu của màn hình duyệt, cần tối thiểu:
        - Cột bước duyệt : Id, BizDocId, ApproveGroup, DeptCode, PositionCode,
                           EmployeeCode, EmployeeCodeApprove, EmployeeCodeNext,
                           NumberOfDays, ApproveStatus, ApproveReturn,
                           RequireReturn, Comment, BranchCode, DocCode
        - Cột hồ sơ GPXD : DocNo, DocDate, ProductCostId, ProcessCode,
                           ApproveSend, CompletedApprove,
                           IdConsPermit (= B30ConsPermit.Id, dùng để gửi mail)
   -------------------------------------------------------------------------- */
DECLARE @SourceName2 sysname      = N'vB30BizDocApprove_ConsDocumentEdit';
DECLARE @TargetName2 sysname      = N'vB30BizDocApprove_ConsPermitEdit';
DECLARE @Definition2 nvarchar(max);
DECLARE @Sql2        nvarchar(max);

SET @Definition2 = OBJECT_DEFINITION(OBJECT_ID('dbo.' + @SourceName2));

IF @Definition2 IS NULL
BEGIN
    PRINT '!! Khong tim thay view mau dbo.' + @SourceName2 + '.';
    PRINT '!! Hay chon mot view vB30BizDocApprove_*Edit dang dung duoc, gan vao @SourceName2 roi chay lai.';
END
ELSE
BEGIN
    IF OBJECT_ID('dbo.' + @TargetName2, 'V') IS NOT NULL
        EXEC('DROP VIEW dbo.' + @TargetName2);

    SET @Sql2 = REPLACE(@Definition2, 'ConsDocument', 'ConsPermit');
    SET @Sql2 = REPLACE(@Sql2, '''CD''', '''GP''');

    EXEC sp_executesql @Sql2;
    PRINT 'Created view dbo.' + @TargetName2 + ' (nhan ban tu ' + @SourceName2 + ')';
    PRINT '>> Kiem tra cot IdConsPermit va cac cot ho so GPXD trong view vua tao.';
END
GO


/* =============================================================================
   3. Quyền truy cập màn hình duyệt

      zCommandKey suy ra từ URL:
          /main/approvedconspermitstatus/index      -> 'approvedconspermitstatus-explorer'
          /main/approvedconspermitstatus/detail/:id -> 'approvedconspermitstatus-editor'

      Quyền IsApprove quyết định nút Duyệt / Trả lại / Đề xuất trả.
   ============================================================================= */
DECLARE @PermissionTable sysname = NULL;

IF OBJECT_ID('dbo.B00PermissionWeb', 'U') IS NOT NULL
    SET @PermissionTable = 'B00PermissionWeb';
ELSE IF OBJECT_ID('dbo.B00WebRoleData', 'U') IS NOT NULL
    SET @PermissionTable = 'B00WebRoleData';

IF @PermissionTable IS NULL
BEGIN
    PRINT '!! Khong xac dinh duoc bang phan quyen.';
    PRINT '!! Hay them thu cong 2 CommandKey sau (nho cap IsApprove):';
    PRINT '     approvedconspermitstatus-explorer';
    PRINT '     approvedconspermitstatus-editor';
END
ELSE
BEGIN
    PRINT '>> Bang phan quyen: dbo.' + @PermissionTable;
    PRINT '>> Nhan ban quyen tu module duyet tuong duong (approvedconsdocument):';
    PRINT '     INSERT INTO dbo.' + @PermissionTable + ' (CommandKey, PositionCode, IsDisplay, IsSave, IsApprove, IsPrint, IsExport)';
    PRINT '     SELECT REPLACE(CommandKey, ''approvedconsdocument'', ''approvedconspermitstatus''),';
    PRINT '            PositionCode, IsDisplay, IsSave, IsApprove, IsPrint, IsExport';
    PRINT '     FROM dbo.' + @PermissionTable;
    PRINT '     WHERE CommandKey IN (''approvedconsdocument-explorer'', ''approvedconsdocument-editor'');';
END
GO

PRINT '=== 05_approve_views.sql completed ===';
GO
