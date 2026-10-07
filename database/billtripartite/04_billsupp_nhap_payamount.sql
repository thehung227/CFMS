/* =============================================================================
   Module : Tab "Thanh toán 3 bên" trên Bill (billsupp / billsettlement)
   File   : 04_billsupp_nhap_payamount.sql
   Mô tả  : Bill B4 (billsupp) và QT (billsettlement) chuyển sang NHẬP TRỰC TIẾP
            "Thanh toán kỳ này" (PayAmount), không tính theo PayPercent nữa.
              1. usp_Newtecons_BillThanhToan_LoadTT3Ben         - trả PayAmount đã lưu trên Bill
              2. usp_Newtecons_BizDocCCMTripartite_UpdateAmount - giữ PayAmount đã lưu,
                                                                  chỉ tính lại PayAmountPrev / PayAmountTotal
   Chạy   : sau 03_procedures.sql
   Ghi chú: viết lại từ definition đang chạy trên DB ngày 2026-09-22 (Ncc lấy thẳng
            CustomerCode + BizDocId_C1 từ B20TripartitePayment), KHÔNG phải bản trong
            03_procedures.sql (đã cũ).
            Mục 2 cùng hành vi với bản đang chạy trên DB (đã giữ PayAmount), chỉ bỏ biến thừa.
            Chặn tổng "Thanh toán kỳ này" <= Giá trị đề nghị thanh toán làm ở client.
            Cột PayPercent vẫn giữ trong bảng (DEFAULT 0), không còn dùng.
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* -----------------------------------------------------------------------------
   1. Nạp tab "Thanh toán 3 bên" của Bill
      PayAmount = giá trị đã lưu trên Bill (dòng mới / Bill lập mới = 0)
   -------------------------------------------------------------------------- */
ALTER PROC dbo.usp_Newtecons_BillThanhToan_LoadTT3Ben
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

    IF OBJECT_ID('tempdb..#Prev') IS NOT NULL DROP TABLE #Prev;

    SELECT  CustomerCode, BizDocId_C1, PayAmountPrev
    INTO #Prev
    FROM dbo.ufn_Newtecons_BizDocCCMTripartite_LuyKeKyTruoc(@_BizDocId, @_ParentBizDocId, @_ProductCostId,
                                                            @_CustomerCode, @_BranchCode, @_DocDate);

    ;WITH Ncc AS (
        SELECT DISTINCT tp.CustomerCode, tp.BizDocId_C1
        FROM dbo.B20TripartitePayment AS tp WITH (NOLOCK)
        WHERE tp.BizDocId = @_ParentBizDocId
          AND tp.CustomerCode <> ''
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
    FROM Ncc AS k
        LEFT OUTER JOIN dbo.B30BizDoc   AS hd  WITH (NOLOCK) ON hd.BizDocId = k.BizDocId_C1
        LEFT OUTER JOIN dbo.B20Customer AS cus WITH (NOLOCK) ON cus.Code = k.CustomerCode
        LEFT OUTER JOIN #Prev           AS p
                ON p.CustomerCode = k.CustomerCode AND p.BizDocId_C1 = k.BizDocId_C1
        OUTER APPLY (
            SELECT TOP 1 x.PayPercent, x.PayAmount
            FROM dbo.B30BizDocCCMTripartite AS x WITH (NOLOCK)
            WHERE @_BizDocId <> ''
              AND x.BizDocId     = @_BizDocId
              AND x.BizDocId_C1  = k.BizDocId_C1
              AND x.CustomerCode = k.CustomerCode
            ORDER BY x.Id DESC
        ) AS old
        CROSS APPLY (
            SELECT ISNULL(old.PayAmount, 0) AS PayAmount     -- nhập tay, giữ giá trị đã lưu
        ) AS cur
    ORDER BY BuiltinOrder;

    DROP TABLE #Prev;
END
GO

/* -----------------------------------------------------------------------------
   2. Tính lại số tiền sau khi lưu (serverUpdated, chạy SAU RoundAmount)
      Giữ PayAmount người dùng nhập; tính lại lũy kế kỳ trước + tổng cộng tại thời điểm lưu.
   -------------------------------------------------------------------------- */
ALTER PROCEDURE dbo.usp_Newtecons_BizDocCCMTripartite_UpdateAmount
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
            @_DocDate           SMALLDATETIME = NULL;

    SELECT  @_ParentBizDocId = ParentBizDocId,
            @_ProductCostId  = ProductCostId,
            @_CustomerCode   = CustomerCode,
            @_BranchCode     = BranchCode,
            @_DocDate        = DocDate
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
        PayAmountTotal = ISNULL(p.PayAmountPrev, 0) + t.PayAmount,
        BranchCode     = @_BranchCode
    FROM dbo.B30BizDocCCMTripartite AS t
        LEFT OUTER JOIN #Prev AS p
                ON p.CustomerCode = t.CustomerCode AND p.BizDocId_C1 = t.BizDocId_C1
    WHERE t.BizDocId = @_BizDocId;

    DROP TABLE #Prev;
END
GO

PRINT '=== 04_billsupp_nhap_payamount.sql completed ===';
GO
