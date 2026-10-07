/* =============================================================================
   Module : Tình trạng giấy phép xây dựng (GPXD)
   File   : 03_functions_procedures.sql

   QUY ƯỚC GỌI CỦA FRAMEWORK (dynamic-form-panel.component.ts)
   -----------------------------------------------------------
   * Command bắt đầu bằng 'ufn_'  -> gọi qua SP hệ thống usp_Web_ExecuteFunction.
     Tham số truyền THEO VỊ TRÍ, đúng thứ tự liệt kê trong ConstraintKey.
     Hàm phải là SCALAR function; kết quả frontend đọc ở cột 'Value'.

   * Command bắt đầu bằng 'usp_'  -> gọi trực tiếp, tham số truyền THEO TÊN với
     tiền tố '@_'. Ví dụ ConstraintKey 'BizDocId,DocDate' -> @_BizDocId, @_DocDate.
     Riêng {VAR=Branch.Ma_Dvcs} -> @_BranchCode, {VAR=User.Id} -> @_nUserId.

   * EvaluatorQueryLoadChild XOÁ SẠCH lưới đích rồi nạp lại toàn bộ kết quả SP,
     nên SP nạp lưới phải trả về ĐẦY ĐỦ danh sách (cả dòng đã nhập trước đó).

   Chạy   : sau 02_views.sql
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* =============================================================================
   1. ufn_Newtecons_B30ConsPermit_DefaultDocNo
      Sinh số hồ sơ tự động: TTGPXD_01, TTGPXD_02, ...
      Dùng ở evaluator serverConstraint (chỉ chạy khi Id < 0 -> thêm mới).

      ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,DocCode,Id'
   ============================================================================= */
IF OBJECT_ID('dbo.ufn_Newtecons_B30ConsPermit_DefaultDocNo', 'FN') IS NOT NULL
    DROP FUNCTION dbo.ufn_Newtecons_B30ConsPermit_DefaultDocNo;
GO

CREATE FUNCTION dbo.ufn_Newtecons_B30ConsPermit_DefaultDocNo
(
    @BranchCode     char(3),
    @ProductCostId  varchar(36),
    @DocCode        char(2),
    @Id             int
)
RETURNS varchar(50)
AS
BEGIN
    DECLARE @Prefix     varchar(20)  = 'TTGPXD_';
    DECLARE @NextNumber int;
    DECLARE @Result     varchar(50);

    /* Đang sửa hồ sơ đã lưu -> giữ nguyên số hiện có */
    IF ISNULL(@Id, -1) > 0
    BEGIN
        SELECT @Result = DocNo FROM dbo.B30ConsPermit WHERE Id = @Id;
        RETURN @Result;
    END

    /* Lấy số lớn nhất đang dùng trong cùng đơn vị + loại chứng từ + gói thầu */
    SELECT @NextNumber = ISNULL(MAX(TRY_CONVERT(int, SUBSTRING(DocNo, LEN(@Prefix) + 1, 10))), 0) + 1
    FROM dbo.B30ConsPermit
    WHERE IsActive        = 1
      AND BranchCode      = @BranchCode
      AND DocCode         = ISNULL(@DocCode, 'GP')
      AND ISNULL(ProductCostId, '') = ISNULL(@ProductCostId, '')
      AND DocNo LIKE @Prefix + '%';

    SET @Result = @Prefix + RIGHT('00' + CAST(@NextNumber AS varchar(10)), 2);

    RETURN @Result;
END
GO
PRINT 'Created dbo.ufn_Newtecons_B30ConsPermit_DefaultDocNo';
GO


/* =============================================================================
   2. ufn_Newtecons_B30ConsPermit_CheckUniqueDocNo
      Kiểm tra Business Key (BranchCode, DocCode, DocNo).
      Trả về 1 = TRÙNG (framework sẽ chặn lưu), 0 = hợp lệ.

      ConstraintKey: '{VAR=Branch.Ma_Dvcs},BizDocId,DocCode,DocNo'
   ============================================================================= */
IF OBJECT_ID('dbo.ufn_Newtecons_B30ConsPermit_CheckUniqueDocNo', 'FN') IS NOT NULL
    DROP FUNCTION dbo.ufn_Newtecons_B30ConsPermit_CheckUniqueDocNo;
GO

CREATE FUNCTION dbo.ufn_Newtecons_B30ConsPermit_CheckUniqueDocNo
(
    @BranchCode varchar(10),
    @BizDocId   varchar(36),
    @DocCode    char(2),
    @DocNo      varchar(50)
)
RETURNS bit
AS
BEGIN
    IF EXISTS (SELECT 1
               FROM dbo.B30ConsPermit
               WHERE IsActive   = 1
                 AND BranchCode = @BranchCode
                 AND DocCode    = @DocCode
                 AND DocNo      = @DocNo
                 AND ISNULL(BizDocId, '') <> ISNULL(@BizDocId, ''))
        RETURN 1;

    RETURN 0;
END
GO
PRINT 'Created dbo.ufn_Newtecons_B30ConsPermit_CheckUniqueDocNo';
GO


/* =============================================================================
   3. usp_Newtecons_B30ConsPermitDocument_GetData
      Nạp tự động danh sách tài liệu đính kèm cho lưới "Danh sách tài liệu đính kèm".

      - Dòng ĐÃ CÓ trong B30BizDocDocument của hồ sơ  -> giữ nguyên (kèm FilePath).
      - Dòng trong danh mục B20ConsPermitDocument mà hồ sơ chưa có -> bổ sung mới.
      - BuiltinOrder  : số thứ tự
        Description   : nội dung đính kèm
        FilePath      : đường dẫn file đính kèm

      Chỉ trả về các cột lưới thực sự dùng + cột khoá; những cột còn lại của
      vB30BizDocDocument được framework tự điền từ default schema của view
      (xem fn_Evaluator_Query_LoadChild, dòng 1456-1461).

      >> Nếu vB30BizDocDocument trong CSDL không có DocumentCode / DocumentName
         thì bỏ 2 cột đó khỏi cả 3 chỗ trong procedure này.

      ConstraintKey: 'BizDocId,DocDate,{VAR=Branch.Ma_Dvcs},DocCode'
      OutputTable  : 1
   ============================================================================= */
IF OBJECT_ID('dbo.usp_Newtecons_B30ConsPermitDocument_GetData', 'P') IS NOT NULL
    DROP PROCEDURE dbo.usp_Newtecons_B30ConsPermitDocument_GetData;
GO

CREATE PROCEDURE dbo.usp_Newtecons_B30ConsPermitDocument_GetData
    @_BizDocId   varchar(36) = NULL,
    @_DocDate    datetime    = NULL,
    @_BranchCode char(3)     = NULL,
    @_DocCode    char(2)     = 'GP'
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Result TABLE
    (
        Id              int             NOT NULL,
        BizDocId        varchar(36)         NULL,
        BuiltinOrder    int                 NULL,
        DocumentCode    varchar(50)         NULL,
        DocumentName    nvarchar(500)       NULL,
        Description     nvarchar(500)       NULL,
        Attached        bit                 NULL,
        FilePath        nvarchar(1000)      NULL,
        DocDate         datetime            NULL
    );

    /* --- 1. Các dòng người dùng đã nhập / đã đính kèm file trước đó --- */
    INSERT INTO @Result (Id, BizDocId, BuiltinOrder, DocumentCode, DocumentName, Description, Attached, FilePath, DocDate)
    SELECT
        ISNULL(d.Id, -1),
        d.BizDocId,
        d.BuiltinOrder,
        d.DocumentCode,
        d.DocumentName,
        d.Description,
        d.Attached,
        d.FilePath,
        d.DocDate
    FROM dbo.vB30BizDocDocument AS d
    WHERE d.BizDocId = @_BizDocId;

    /* --- 2. Bổ sung tài liệu trong danh mục mà hồ sơ chưa có --- */
    INSERT INTO @Result (Id, BizDocId, BuiltinOrder, DocumentCode, DocumentName, Description, Attached, FilePath, DocDate)
    SELECT
        -1,
        @_BizDocId,
        c.BuiltinOrder,
        c.Code,
        c.Name,
        c.Name,          -- Description = nội dung đính kèm
        c.Attached,
        '',              -- FilePath = đường dẫn file, để trống chờ upload
        @_DocDate
    FROM dbo.B20ConsPermitDocument AS c
    WHERE c.IsActive   = 1
      AND c.IsGroup    = 0
      AND c.BranchCode = @_BranchCode
      AND NOT EXISTS (SELECT 1 FROM @Result r WHERE r.Description = c.Name);

    /* --- 3. Chuẩn hoá cột hệ thống + đánh lại số thứ tự liên tục --- */
    UPDATE @Result SET BizDocId = @_BizDocId WHERE ISNULL(BizDocId, '') = '';
    UPDATE @Result SET DocDate  = @_DocDate  WHERE DocDate IS NULL;
    UPDATE @Result SET Attached = 0          WHERE Attached IS NULL;
    UPDATE @Result SET FilePath = ''         WHERE FilePath IS NULL;

    WITH cte AS (
        SELECT BuiltinOrder,
               NewOrder = ROW_NUMBER() OVER (ORDER BY BuiltinOrder, Description)
        FROM @Result
    )
    UPDATE cte SET BuiltinOrder = NewOrder;

    SELECT * FROM @Result ORDER BY BuiltinOrder;
END
GO
PRINT 'Created dbo.usp_Newtecons_B30ConsPermitDocument_GetData';
GO


/* =============================================================================
   4. usp_Newtecons_B30ConsPermitDetail_UpdateBuiltinOrder
      Đánh lại số thứ tự liên tục cho lưới chi tiết SAU khi lưu.
      Dùng ở evaluator serverUpdated.

      ConstraintKey: 'BizDocId'
   ============================================================================= */
IF OBJECT_ID('dbo.usp_Newtecons_B30ConsPermitDetail_UpdateBuiltinOrder', 'P') IS NOT NULL
    DROP PROCEDURE dbo.usp_Newtecons_B30ConsPermitDetail_UpdateBuiltinOrder;
GO

CREATE PROCEDURE dbo.usp_Newtecons_B30ConsPermitDetail_UpdateBuiltinOrder
    @_BizDocId varchar(36)
AS
BEGIN
    SET NOCOUNT ON;

    WITH cte AS (
        SELECT BuiltinOrder,
               NewOrder = ROW_NUMBER() OVER (ORDER BY BuiltinOrder, Id)
        FROM dbo.B30ConsPermitDetail
        WHERE BizDocId = @_BizDocId AND IsActive = 1
    )
    UPDATE cte SET BuiltinOrder = NewOrder;

    /* Đồng bộ ngày chứng từ từ hồ sơ cha xuống chi tiết */
    UPDATE d
        SET d.DocDate = h.DocDate
    FROM dbo.B30ConsPermitDetail d
    INNER JOIN dbo.B30ConsPermit h ON h.BizDocId = d.BizDocId
    WHERE d.BizDocId = @_BizDocId
      AND (d.DocDate IS NULL OR d.DocDate <> h.DocDate);
END
GO
PRINT 'Created dbo.usp_Newtecons_B30ConsPermitDetail_UpdateBuiltinOrder';
GO


/* =============================================================================
   5. usp_B30ConsPermit_VoucherForm
      Cấp dữ liệu cho chức năng "Mẫu in".
      Result set 1: thông tin hồ sơ (đầu phiếu)
      Result set 2: chi tiết tình trạng GPXD (bảng in)
   ============================================================================= */
IF OBJECT_ID('dbo.usp_B30ConsPermit_VoucherForm', 'P') IS NOT NULL
    DROP PROCEDURE dbo.usp_B30ConsPermit_VoucherForm;
GO

CREATE PROCEDURE dbo.usp_B30ConsPermit_VoucherForm
    @_Id         int         = NULL,
    @_BranchCode char(3)     = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @BizDocId varchar(36);
    SELECT @BizDocId = BizDocId FROM dbo.B30ConsPermit WHERE Id = @_Id;

    SELECT * FROM dbo.vB30ConsPermit_Explorer WHERE Id = @_Id;

    SELECT * FROM dbo.vB30ConsPermitDetail_Report
    WHERE BizDocId = @BizDocId
    ORDER BY BuiltinOrder;
END
GO
PRINT 'Created dbo.usp_B30ConsPermit_VoucherForm';
GO

PRINT '=== 03_functions_procedures.sql completed ===';
GO
