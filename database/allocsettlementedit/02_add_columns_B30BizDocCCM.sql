/* =============================================================================
   Module : Điều chỉnh quyết toán chi phí phân bổ (allocsettlementedit)
   File   : 02_add_columns_B30BizDocCCM.sql
   Mô tả  : Bổ sung 5 cột "tiến độ luân chuyển hồ sơ" cho bill CCM để màn điều
            chỉnh có đủ 8 ô như màn settlement_doc (B30BizDoc).

   HIỆN TRẠNG (đối chiếu DB 01/10/2026)
   ------------------------------------
     Cột                       B30BizDoc   B30BizDocCCM
     ConfirmedDate (GĐDA ký)       có           có
     FinishedDate (đóng dấu)       có           có
     HandoverDate (chuyển KT)      có           có
     Date_CCMPrint                 có           THIẾU  -> thêm smalldatetime NULL
     Ngay_Phan_Phoi                có           THIẾU  -> thêm smalldatetime NULL
     Date_ReceiveFromCustomer      có           THIẾU  -> thêm smalldatetime NULL
     Date_BHC                      có           THIẾU  -> thêm smalldatetime NULL
     Remark2                       có           THIẾU  -> thêm nvarchar(192) NOT NULL DEFAULT ''
   Kiểu dữ liệu lấy đúng như B30BizDoc.

   ĐÁNH GIÁ TÁC ĐỘNG
   -----------------
   - B30BizDocCCM ~201.700 dòng, SQL Server Enterprise: ADD cột NULL, hoặc NOT NULL
     có DEFAULT hằng số, là thao tác chỉ đổi metadata - không ghi lại dữ liệu,
     không làm chậm INSERT/UPDATE sau này. Chỉ cần khóa Sch-M rất ngắn.
   - Không có object WITH SCHEMABINDING tham chiếu bảng / view.
   - 30 object dùng vB30BizDocCCM_Edit đều chọn cột tường minh (SELECT ... INTO
     tạo bảng tạm mới, JOIN lấy cột cụ thể) nên thêm cột vào CUỐI view là an toàn.
   - Các "SELECT *" trên B30BizDocCCM chỉ nằm trong IF EXISTS (...) - không ảnh hưởng.
   - Trigger DML_B30BizDocCCM_ChangeLog được sinh từ _CreateTriggerLog theo danh sách
     cột lúc sinh: 5 cột mới sẽ CHƯA được ghi log thay đổi cho tới khi sinh lại
     trigger (tùy chọn, xem mục 4).

   CÁCH LÀM VỚI VIEW
   -----------------
   Không chép tay định nghĩa view (dài ~10.000 ký tự, dễ sai). Script đọc định nghĩa
   hiện tại bằng OBJECT_DEFINITION, chèn 5 cột ngay sau "bz.IsFixPrice AS IsQLKL"
   (cột cuối cùng) rồi ALTER VIEW. Rollback làm ngược lại - xem 99_rollback.sql.

   CÁCH DÙNG: chạy cả file. Chạy lại nhiều lần an toàn.
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET NOCOUNT ON
GO

/* -----------------------------------------------------------------------------
   1. Thêm cột vào bảng (bỏ qua cột đã có)
   ----------------------------------------------------------------------------- */
BEGIN TRAN;

IF COL_LENGTH('dbo.B30BizDocCCM', 'Date_CCMPrint') IS NULL
    ALTER TABLE dbo.B30BizDocCCM ADD Date_CCMPrint smalldatetime NULL;

IF COL_LENGTH('dbo.B30BizDocCCM', 'Ngay_Phan_Phoi') IS NULL
    ALTER TABLE dbo.B30BizDocCCM ADD Ngay_Phan_Phoi smalldatetime NULL;

IF COL_LENGTH('dbo.B30BizDocCCM', 'Date_ReceiveFromCustomer') IS NULL
    ALTER TABLE dbo.B30BizDocCCM ADD Date_ReceiveFromCustomer smalldatetime NULL;

IF COL_LENGTH('dbo.B30BizDocCCM', 'Date_BHC') IS NULL
    ALTER TABLE dbo.B30BizDocCCM ADD Date_BHC smalldatetime NULL;

IF COL_LENGTH('dbo.B30BizDocCCM', 'Remark2') IS NULL
    ALTER TABLE dbo.B30BizDocCCM ADD Remark2 nvarchar(192) NOT NULL
        CONSTRAINT DF_B30BizDocCCM_Remark2 DEFAULT (N'');

COMMIT TRAN;
PRINT '1. B30BizDocCCM: da co du 5 cot.';
GO

/* -----------------------------------------------------------------------------
   2. Đưa 5 cột vào cuối vB30BizDocCCM_Edit
   ----------------------------------------------------------------------------- */
DECLARE @def    nvarchar(max) = OBJECT_DEFINITION(OBJECT_ID('dbo.vB30BizDocCCM_Edit'));
DECLARE @anchor nvarchar(100) = N'bz.IsFixPrice AS IsQLKL';
DECLARE @add    nvarchar(400) =
      NCHAR(13) + NCHAR(10) + NCHAR(9) + NCHAR(9) + NCHAR(9)
    + N', BizDoc.Date_CCMPrint, BizDoc.Ngay_Phan_Phoi, BizDoc.Date_ReceiveFromCustomer, BizDoc.Date_BHC, BizDoc.Remark2 -- allocsettlementedit 10/2026';
DECLARE @posCreate int, @posAnchor int;

IF @def LIKE N'%BizDoc.Date_CCMPrint%'
BEGIN
    PRINT '2. vB30BizDocCCM_Edit: da co cot moi, bo qua.';
    RETURN;
END

SET @posAnchor = CHARINDEX(@anchor, @def);
IF @posAnchor = 0 OR CHARINDEX(@anchor, @def, @posAnchor + 1) > 0
BEGIN
    PRINT '!! Khong tim thay (hoac co nhieu hon 1) cho chen "' + @anchor + '" - dung lai, khong sua view.';
    RETURN;
END

SET @posCreate = PATINDEX(N'%CREATE%VIEW%', @def);
IF @posCreate = 0
BEGIN
    PRINT '!! Khong tim thay CREATE VIEW trong dinh nghia - dung lai.';
    RETURN;
END

-- Chèn cột mới sau cột cuối, rồi đổi CREATE -> ALTER (chỉ lần xuất hiện đầu tiên).
SET @def = STUFF(@def, @posAnchor + LEN(@anchor), 0, @add);
SET @def = STUFF(@def, @posCreate, LEN(N'CREATE'), N'ALTER');

EXEC sys.sp_executesql @def;
PRINT '2. vB30BizDocCCM_Edit: da them 5 cot.';
GO

/* -----------------------------------------------------------------------------
   3. Kiểm tra: phải ra 8 dòng ở cả bảng và view
   ----------------------------------------------------------------------------- */
SELECT OBJECT_NAME(c.object_id) AS Obj, c.name AS Col, t.name AS Typ, c.max_length, c.is_nullable
FROM sys.columns c
JOIN sys.types t ON t.user_type_id = c.user_type_id
WHERE c.object_id IN (OBJECT_ID('dbo.B30BizDocCCM'), OBJECT_ID('dbo.vB30BizDocCCM_Edit'))
  AND c.name IN ('Date_CCMPrint','Ngay_Phan_Phoi','ConfirmedDate','Date_ReceiveFromCustomer',
                 'FinishedDate','HandoverDate','Date_BHC','Remark2')
ORDER BY Obj, Col;

-- View vẫn đọc được bình thường
SELECT TOP (1) Id, DocNo, Date_CCMPrint, Ngay_Phan_Phoi, Date_ReceiveFromCustomer, Date_BHC, Remark2
FROM dbo.vB30BizDocCCM_Edit
WHERE DocCode = 'P5';
GO

/* -----------------------------------------------------------------------------
   4. (Tùy chọn) Sinh lại trigger log để ghi lịch sử cả 5 cột mới.
      Xem tham số của _CreateTriggerLog trước khi chạy:
        EXEC sp_helptext '_CreateTriggerLog';
   ----------------------------------------------------------------------------- */
