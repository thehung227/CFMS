/* =============================================================================
   Rollback cho 02_add_columns_B30BizDocCCM.sql
   - Gỡ 5 cột khỏi vB30BizDocCCM_Edit (bỏ đúng dòng đã chèn), rồi
   - DROP 5 cột khỏi B30BizDocCCM.
   CẢNH BÁO: DROP cột làm MẤT dữ liệu đã nhập ở 5 cột này.
   Trước khi chạy: gỡ hoặc ẩn các ô tương ứng trên màn allocsettlementedit.

   Gỡ quyền màn hình: xem mục 5 trong 01_seed_permission.sql.
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

DECLARE @def  nvarchar(max) = OBJECT_DEFINITION(OBJECT_ID('dbo.vB30BizDocCCM_Edit'));
DECLARE @line nvarchar(400) =
      NCHAR(13) + NCHAR(10) + NCHAR(9) + NCHAR(9) + NCHAR(9)
    + N', BizDoc.Date_CCMPrint, BizDoc.Ngay_Phan_Phoi, BizDoc.Date_ReceiveFromCustomer, BizDoc.Date_BHC, BizDoc.Remark2 -- allocsettlementedit 10/2026';
DECLARE @pos int = CHARINDEX(@line, @def);

IF @pos > 0
BEGIN
    SET @def = STUFF(@def, @pos, LEN(@line), N'');
    SET @def = STUFF(@def, PATINDEX(N'%CREATE%VIEW%', @def), LEN(N'CREATE'), N'ALTER');
    EXEC sys.sp_executesql @def;
    PRINT 'Da go 5 cot khoi vB30BizDocCCM_Edit.';
END
ELSE
    PRINT 'vB30BizDocCCM_Edit khong chua dong da chen - bo qua.';
GO

BEGIN TRAN;
IF OBJECT_ID('dbo.DF_B30BizDocCCM_Remark2', 'D') IS NOT NULL
    ALTER TABLE dbo.B30BizDocCCM DROP CONSTRAINT DF_B30BizDocCCM_Remark2;
IF COL_LENGTH('dbo.B30BizDocCCM', 'Remark2') IS NOT NULL
    ALTER TABLE dbo.B30BizDocCCM DROP COLUMN Remark2;
IF COL_LENGTH('dbo.B30BizDocCCM', 'Date_BHC') IS NOT NULL
    ALTER TABLE dbo.B30BizDocCCM DROP COLUMN Date_BHC;
IF COL_LENGTH('dbo.B30BizDocCCM', 'Date_ReceiveFromCustomer') IS NOT NULL
    ALTER TABLE dbo.B30BizDocCCM DROP COLUMN Date_ReceiveFromCustomer;
IF COL_LENGTH('dbo.B30BizDocCCM', 'Ngay_Phan_Phoi') IS NOT NULL
    ALTER TABLE dbo.B30BizDocCCM DROP COLUMN Ngay_Phan_Phoi;
IF COL_LENGTH('dbo.B30BizDocCCM', 'Date_CCMPrint') IS NOT NULL
    ALTER TABLE dbo.B30BizDocCCM DROP COLUMN Date_CCMPrint;
COMMIT TRAN;
PRINT 'Da go 5 cot khoi B30BizDocCCM.';
GO
