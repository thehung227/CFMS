/* =============================================================================
   Module : Tab "Thanh toán 3 bên" trên Bill (billsupp / billsettlement)
   File   : 03_procedures.sql
   Mô tả  : 1. ufn_Newtecons_BizDocCCMTripartite_LuyKeKyTruoc - lũy kế thanh toán 3 bên các kỳ trước
            2. usp_Newtecons_BillThanhToan_LoadTT3Ben         - nạp lưới (EvaluatorQueryLoadChild)
            3. usp_Newtecons_BizDocCCMTripartite_UpdateAmount - tính lại số tiền sau khi lưu
            4. usp_Newtecons_TT3Ben_GetAmount                 - tổng TT 3 bên của Bill, hiển thị trên
                                                                 màn thanh toán / quyết toán / duyệt
   Chạy   : sau 02_view.sql

   Công thức "Thanh toán kỳ này" (PayAmount):
       ROUND(PayPercent x (Amount_THDenKyNay - Amount_TongThucHienKyTruoc), 0 nếu VND / 2 nếu ngoại tệ)
       = % x Giá trị thực hiện riêng kỳ này (gồm VAT) của Bill.
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* -----------------------------------------------------------------------------
   1. Lũy kế "Thanh toán đến kỳ trước" theo từng (đối tượng, hợp đồng)

   Bill kỳ trước - cùng quy tắc với usp_Coteccons_Bill_TongGiaTriThanhToanDenCacKyTruoc:
     cùng hợp đồng (ParentBizDocId) + gói thầu + đối tác + đơn vị, DocDate <= ngày Bill,
     IsActive = 1, khác Bill hiện tại và
       - B4: đã có phiếu thanh toán liên kết (B30BizDocCCM.BizDocId_TT)
       - QT: đã có hồ sơ liên kết (B30BizDoc.BizDocId_PL)
   Số của mỗi kỳ = PayAmount (thanh toán kỳ này) đã lưu trên Bill đó.
   -------------------------------------------------------------------------- */
IF OBJECT_ID('dbo.ufn_Newtecons_BizDocCCMTripartite_LuyKeKyTruoc', 'IF') IS NOT NULL
    DROP FUNCTION dbo.ufn_Newtecons_BizDocCCMTripartite_LuyKeKyTruoc;
GO

CREATE FUNCTION dbo.ufn_Newtecons_BizDocCCMTripartite_LuyKeKyTruoc
(
    @_BizDocId          VARCHAR(16),     -- Bill hiện tại ('' khi lập mới)
    @_ParentBizDocId    VARCHAR(16),     -- Hợp đồng trên Bill
    @_ProductCostId     NVARCHAR(50),
    @_CustomerCode      NVARCHAR(50),    -- Đối tác của Bill
    @_BranchCode        CHAR(3),
    @_DocDate           SMALLDATETIME    -- Ngày Bill
)
RETURNS TABLE
AS
RETURN
(
    SELECT  t.CustomerCode,
            t.BizDocId_C1,
            SUM(t.PayAmount) AS PayAmountPrev
    FROM dbo.B30BizDocCCM AS biz
        INNER JOIN dbo.B30BizDocCCMTripartite AS t ON t.BizDocId = biz.BizDocId
    WHERE biz.ParentBizDocId = @_ParentBizDocId
      AND biz.ProductCostId  = @_ProductCostId
      AND biz.CustomerCode   = @_CustomerCode
      AND biz.BranchCode     = @_BranchCode
      AND biz.DocDate       <= @_DocDate
      AND biz.IsActive       = 1
      AND biz.BizDocId      <> @_BizDocId
      AND (
            (biz.DocCode = 'B4' AND EXISTS (SELECT 1 FROM dbo.B30BizDocCCM AS tt
                                            WHERE tt.BizDocId_TT = biz.BizDocId AND tt.IsActive = 1))
         OR (biz.DocCode = 'QT' AND EXISTS (SELECT 1 FROM dbo.B30BizDoc AS pl
                                            WHERE pl.BizDocId_PL = biz.BizDocId AND pl.IsActive = 1))
          )
    GROUP BY t.CustomerCode, t.BizDocId_C1
);
GO

/* -----------------------------------------------------------------------------
   2. Nạp tab "Thanh toán 3 bên" của Bill (dữ liệu lũy kế)

   - Dòng        : TẤT CẢ hợp đồng/phụ lục (C3, C4) còn hiệu lực của các NCC khai báo ở tab
                   "Thanh toán 3 bên" của hợp đồng trên Bill, trong cùng gói thầu + đơn vị
                   (bỏ qua chính hợp đồng của Bill)
                   UNION các dòng đã thanh toán ở kỳ trước, để lũy kế không bị mất khi
                   NCC/hợp đồng không còn trong danh sách.
   - % thanh toán: giữ lại giá trị đã lưu trên Bill (nếu có); dòng mới = 0.
   - Số tiền     : PayAmountPrev  = lũy kế các kỳ trước (hàm ở mục 1)
                   PayAmount      = PayPercent x (Amount_THDenKyNay - Amount_TongThucHienKyTruoc)
                   PayAmountTotal = PayAmountPrev + PayAmount
   - CHỈ ĐỌC dữ liệu hợp đồng, không ghi vào B20TripartitePayment / B30BizDoc.

   Tham số nhận theo tên từ ConstraintKey:
       'ParentBizDocId,BizDocId,ProductCostId,CustomerCode,DocDate,{VAR=Branch.Ma_Dvcs}'
   -------------------------------------------------------------------------- */
IF OBJECT_ID('dbo.usp_Newtecons_BillThanhToan_LoadTT3Ben', 'P') IS NOT NULL
    DROP PROCEDURE dbo.usp_Newtecons_BillThanhToan_LoadTT3Ben;
GO

CREATE PROCEDURE dbo.usp_Newtecons_BillThanhToan_LoadTT3Ben
(
    @_ParentBizDocId    VARCHAR(16)   = '',     -- Hợp đồng trên Bill (B30BizDoc)
    @_BizDocId          VARCHAR(16)   = '',     -- Bill hiện tại (B30BizDocCCM), '' khi lập mới
    @_ProductCostId     NVARCHAR(50)  = N'',    -- Gói thầu của Bill
    @_CustomerCode      NVARCHAR(50)  = N'',    -- Đối tác của Bill
    @_DocDate           SMALLDATETIME = NULL,   -- Ngày Bill
    @_BranchCode        CHAR(3)       = ''
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT  @_ParentBizDocId = ISNULL(@_ParentBizDocId, ''),
            @_BizDocId       = ISNULL(@_BizDocId, ''),
            @_ProductCostId  = ISNULL(@_ProductCostId, N''),
            @_CustomerCode   = ISNULL(@_CustomerCode, N''),
            @_DocDate        = ISNULL(@_DocDate, GETDATE()),
            @_BranchCode     = ISNULL(@_BranchCode, '');

    DECLARE @_Amount_THKyNay NUMERIC(18,2) = 0, @_DecimalRound INT = 0;

    -- Giá trị thực hiện riêng kỳ này (gồm VAT) = Tổng GTTH đến kỳ này - Tổng GTTH đến kỳ trước
    SELECT  @_Amount_THKyNay = ISNULL(Amount_THDenKyNay, 0) - ISNULL(Amount_TongThucHienKyTruoc, 0),
            @_DecimalRound   = IIF(CurrencyCode = 'VND', 0, 2)
    FROM dbo.B30BizDocCCM WITH (NOLOCK)
    WHERE BizDocId = @_BizDocId;

    IF OBJECT_ID('tempdb..#Prev') IS NOT NULL DROP TABLE #Prev;

    SELECT  CustomerCode, BizDocId_C1, PayAmountPrev
    INTO #Prev
    FROM dbo.ufn_Newtecons_BizDocCCMTripartite_LuyKeKyTruoc(@_BizDocId, @_ParentBizDocId, @_ProductCostId,
                                                            @_CustomerCode, @_BranchCode, @_DocDate);

    ;WITH Ncc AS (
        SELECT DISTINCT tp.CustomerCode
        FROM dbo.B20TripartitePayment AS tp WITH (NOLOCK)
        WHERE tp.BizDocId = @_ParentBizDocId
          AND tp.CustomerCode <> ''
    ),
    Keys AS (
        SELECT  n.CustomerCode, hd.BizDocId AS BizDocId_C1
        FROM Ncc AS n
            INNER JOIN dbo.B30BizDoc AS hd WITH (NOLOCK)
                    ON hd.CustomerCode = n.CustomerCode
        WHERE hd.BranchCode    = @_BranchCode
          AND hd.IsActive      = 1
          AND hd.DocCode       IN ('C3', 'C4')
          AND hd.ProductCostId = @_ProductCostId
          AND hd.BizDocId     <> @_ParentBizDocId
        UNION
        SELECT  p.CustomerCode, p.BizDocId_C1
        FROM #Prev AS p
    )
    SELECT  ROW_NUMBER() OVER (ORDER BY k.CustomerCode, hd.DocDate, hd.DocNo) AS BuiltinOrder,
            k.CustomerCode,
            ISNULL(cus.Name, N'')       AS CustomerName,
            k.BizDocId_C1,
            ISNULL(hd.Description, N'') AS ContractDescription,
            ISNULL(old.PayPercent, 0)   AS PayPercent,
            ISNULL(p.PayAmountPrev, 0)                 AS PayAmountPrev,    -- Thanh toán đến kỳ trước
            cur.PayAmount,                                                  -- Thanh toán kỳ này
            ISNULL(p.PayAmountPrev, 0) + cur.PayAmount AS PayAmountTotal,   -- Tổng cộng
            CAST(@_BranchCode AS NVARCHAR(3)) AS BranchCode
    FROM Keys AS k
        LEFT OUTER JOIN dbo.B30BizDoc   AS hd  WITH (NOLOCK) ON hd.BizDocId = k.BizDocId_C1
        LEFT OUTER JOIN dbo.B20Customer AS cus WITH (NOLOCK) ON cus.Code = k.CustomerCode
        LEFT OUTER JOIN #Prev           AS p
                ON p.CustomerCode = k.CustomerCode AND p.BizDocId_C1 = k.BizDocId_C1
        OUTER APPLY (
            SELECT TOP 1 x.PayPercent
            FROM dbo.B30BizDocCCMTripartite AS x WITH (NOLOCK)
            WHERE @_BizDocId <> ''
              AND x.BizDocId     = @_BizDocId
              AND x.BizDocId_C1  = k.BizDocId_C1
              AND x.CustomerCode = k.CustomerCode
            ORDER BY x.Id DESC
        ) AS old
        CROSS APPLY (
            SELECT ROUND(ISNULL(old.PayPercent, 0) * @_Amount_THKyNay, @_DecimalRound) AS PayAmount
        ) AS cur
    ORDER BY BuiltinOrder;

    DROP TABLE #Prev;
END
GO

/* -----------------------------------------------------------------------------
   3. Tính lại số tiền sau khi lưu (serverUpdated, chạy SAU bước làm tròn
      Evaluator_ServerUpdated_BizDocCCM_RoundAmount vì bước đó cập nhật Amount_THDenKyNay).
      Tính lại cả lũy kế kỳ trước để khớp dữ liệu tại thời điểm lưu.
   -------------------------------------------------------------------------- */
IF OBJECT_ID('dbo.usp_Newtecons_BizDocCCMTripartite_UpdateAmount', 'P') IS NOT NULL
    DROP PROCEDURE dbo.usp_Newtecons_BizDocCCMTripartite_UpdateAmount;
GO

CREATE PROCEDURE dbo.usp_Newtecons_BizDocCCMTripartite_UpdateAmount
(
    @_BizDocId VARCHAR(16) = ''
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @_ParentBizDocId    VARCHAR(16)   = '',
            @_ProductCostId     NVARCHAR(50)  = N'',
            @_CustomerCode      NVARCHAR(50)  = N'',
            @_BranchCode        CHAR(3)       = '',
            @_DocDate           SMALLDATETIME = NULL,
            @_Amount_THKyNay    NUMERIC(18,2) = 0,
            @_DecimalRound      INT           = 0;

    SELECT  @_ParentBizDocId = ParentBizDocId,
            @_ProductCostId  = ProductCostId,
            @_CustomerCode   = CustomerCode,
            @_BranchCode     = BranchCode,
            @_DocDate        = DocDate,
            @_Amount_THKyNay = ISNULL(Amount_THDenKyNay, 0) - ISNULL(Amount_TongThucHienKyTruoc, 0),
            @_DecimalRound   = IIF(CurrencyCode = 'VND', 0, 2)
    FROM dbo.B30BizDocCCM
    WHERE BizDocId = @_BizDocId;

    IF @@ROWCOUNT = 0 RETURN;

    IF OBJECT_ID('tempdb..#Prev') IS NOT NULL DROP TABLE #Prev;

    SELECT  CustomerCode, BizDocId_C1, PayAmountPrev
    INTO #Prev
    FROM dbo.ufn_Newtecons_BizDocCCMTripartite_LuyKeKyTruoc(@_BizDocId, @_ParentBizDocId, @_ProductCostId,
                                                            @_CustomerCode, @_BranchCode, @_DocDate);

    UPDATE t
    SET PayAmountPrev  = ISNULL(p.PayAmountPrev, 0),
        PayAmount      = x.PayAmount_New,
        PayAmountTotal = ISNULL(p.PayAmountPrev, 0) + x.PayAmount_New,
        BranchCode     = @_BranchCode
    FROM dbo.B30BizDocCCMTripartite AS t
        LEFT OUTER JOIN #Prev AS p
                ON p.CustomerCode = t.CustomerCode AND p.BizDocId_C1 = t.BizDocId_C1
        CROSS APPLY (
            SELECT ROUND(t.PayPercent * @_Amount_THKyNay, @_DecimalRound) AS PayAmount_New
        ) AS x
    WHERE t.BizDocId = @_BizDocId;

    DROP TABLE #Prev;
END
GO

/* -----------------------------------------------------------------------------
   4. Tổng giá trị thanh toán 3 bên (kỳ này) của một Bill

   Dùng cho màn không có lưới tab 3 bên (EvaluatorQuery, DataMember 'Amount_TT3Ben'):
     - billpaysupp / billpaysuppedit / approvedbillpaysupp : ConstraintKey 'BizDocId_TT' (Bill B4)
     - settlement_doc / approvedsettlement                  : ConstraintKey 'BizDocId_PL' (Bill QT)
   "Số tiền còn lại" tính ở client = Giá trị đề nghị thanh toán của màn hình - Amount_TT3Ben.
   -------------------------------------------------------------------------- */
IF OBJECT_ID('dbo.usp_Newtecons_TT3Ben_GetAmount', 'P') IS NOT NULL
    DROP PROCEDURE dbo.usp_Newtecons_TT3Ben_GetAmount;
GO

CREATE PROCEDURE dbo.usp_Newtecons_TT3Ben_GetAmount
(
    @_BizDocId_TT   VARCHAR(16) = '',   -- Bill B4 trên phiếu thanh toán
    @_BizDocId_PL   VARCHAR(16) = ''    -- Bill QT trên hồ sơ quyết toán
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @_BillId VARCHAR(16) = IIF(ISNULL(@_BizDocId_TT, '') <> '', @_BizDocId_TT, ISNULL(@_BizDocId_PL, ''));

    SELECT ISNULL(SUM(t.PayAmount), 0) AS Amount_TT3Ben
    FROM dbo.B30BizDocCCMTripartite AS t WITH (NOLOCK)
    WHERE @_BillId <> ''
      AND t.BizDocId = @_BillId;
END
GO

PRINT '=== 03_procedures.sql completed ===';
GO
