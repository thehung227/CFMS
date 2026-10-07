/* =============================================================================
   Module : Tab "Thanh toán 3 bên" trên Bill (billsupp / billsettlement)
   File   : 02_view.sql
   Mô tả  : View lưới mà DeclareLayout.ts trỏ tới (Child thứ 6, grid5).
            Cùng kiểu với vB20TripartitePayment: bảng gốc đứng đầu, LEFT JOIN để lấy
            tên đối tượng và nội dung hợp đồng (chỉ hiển thị, không lưu).
   Chạy   : sau 01_table.sql
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

IF OBJECT_ID('dbo.vB30BizDocCCMTripartite_Edit', 'V') IS NOT NULL
    DROP VIEW dbo.vB30BizDocCCMTripartite_Edit;
GO

CREATE VIEW dbo.vB30BizDocCCMTripartite_Edit
AS
SELECT
    t.Id,
    t.ParentId,
    t.IsGroup,
    t.BizDocId,
    t.BuiltinOrder,
    t.BranchCode,
    t.CustomerCode,
    t.BizDocId_C1,
    t.PayPercent,
    t.PayAmountPrev,     -- Thanh toán đến kỳ trước
    t.PayAmount,         -- Thanh toán kỳ này
    t.PayAmountTotal,    -- Tổng cộng
    t.CreatedBy,
    t.CreatedAt,
    t.ModifiedBy,
    t.ModifiedAt,
    t.[timestamp],
    ISNULL(cus.Name, N'')       AS CustomerName,          -- Tên đối tượng
    ISNULL(hd.Description, N'') AS ContractDescription    -- Nội dung hợp đồng
FROM dbo.B30BizDocCCMTripartite AS t
    LEFT OUTER JOIN dbo.B20Customer AS cus ON cus.Code = t.CustomerCode
    LEFT OUTER JOIN dbo.B30BizDoc   AS hd  ON hd.BizDocId = t.BizDocId_C1;
GO

PRINT '=== 02_view.sql completed ===';
GO
