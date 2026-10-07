-- =============================================================================
-- KẾ HOẠCH MUA HÀNG VLXD (H7): bổ sung thông tin đàm phán trên lưới chi tiết
--
--   1. B30BudgetDetail: thêm NegotiationStatus (Tình trạng đàm phán) và
--      EfficiencyRate (% hiệu quả so với BD, lưu dạng tỷ lệ: 0.0512 = 5.12%).
--      Ngày dự kiến kết thúc sử dụng dùng cột có sẵn ToDate.
--   2. B20Class ParentCode = 'NEGOSTATUS': danh mục lookup Tình trạng đàm phán.
--      Mã 1 < 2 < 3 theo tiến độ (báo cáo lấy MIN để ra tình trạng "chậm nhất").
--   3. vB30BudgetDetail_Edit: trả thêm 3 cột trên + NegotiationStatusName.
--   4. usp_Newtecons_B30CCMBudget_LoadPrevious: chép thêm ToDate và 2 cột mới khi
--      "Tải dữ liệu" từ phiếu trước (trước đây ToDate bị mất khi lập phiếu mới).
--
-- Chạy 1 lần, chạy lại được (idempotent). Rollback: 99_rollback.sql
-- 06/10/2026: Tạo mới
-- =============================================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 1. Cột mới -------------------------------------------------------------------
IF COL_LENGTH('dbo.B30BudgetDetail', 'NegotiationStatus') IS NULL
	ALTER TABLE dbo.B30BudgetDetail
		ADD NegotiationStatus NVARCHAR(16) NOT NULL
			CONSTRAINT DF_B30BudgetDetail_NegotiationStatus DEFAULT ('');
GO

IF COL_LENGTH('dbo.B30BudgetDetail', 'EfficiencyRate') IS NULL
	ALTER TABLE dbo.B30BudgetDetail
		ADD EfficiencyRate NUMERIC(8, 6) NOT NULL
			CONSTRAINT DF_B30BudgetDetail_EfficiencyRate DEFAULT ((0));
GO

-- 2. Danh mục Tình trạng đàm phán ---------------------------------------------
;WITH src AS
(
	SELECT Code, Name
	FROM (VALUES (N'1', N'Chưa bắt đầu'),
				 (N'2', N'Đang đàm phán'),
				 (N'3', N'Đã chốt')) v (Code, Name)
)
INSERT INTO dbo.B20Class (ParentId, IsGroup, ParentCode, Code, Name, IsActive)
SELECT -1, 0, 'NEGOSTATUS', s.Code, s.Name, 1
FROM src s
WHERE NOT EXISTS (SELECT 1 FROM dbo.B20Class c WHERE c.ParentCode = 'NEGOSTATUS' AND c.Code = s.Code);
GO

-- 3. View lưới chi tiết --------------------------------------------------------
CREATE OR ALTER VIEW dbo.vB30BudgetDetail_Edit
AS
SELECT bd.Id,
       bd.Stt,
       bd.BuiltinOrder,
       bd.IsGroup,
       bd.Account,
       bd.CustomerCode,
       bd.ItemCode,
       bd.Quantity,
	   bd.QuantityAccum,
       bd.Amount,
       bd.OriginalAmount,
       bd.DeptCode,
       bd.ExpenseCatgCode,
       bd.BizDocId_C1,
       bd.BizDocId_C2,
       bd.ProductCostId,
       bd.EmployeeCode,
       Bud.BranchCode,
       Bud.BudgetTypeCode,
       Cus.Name AS CustomerName,
       IIF(Bud.DocCode IN ('H7','H8','H9','L2'), bd.ItemName,item.Name) AS ItemName,
       IIF(Bud.DocCode IN ('H7','H8','H9','L2'),bd.Unit,IIF(Item.CalPriceByExchange = 1, Item.Unit0, Item.Unit)) AS Unit, --Item.Unit,
       Biz1.DocNo + ': ' + Biz1.Description AS Des_C1,
       Biz2.DocNo + ': ' + Biz2.Description AS Des_C2,
       Bud.BudgetCode,
       Class.Name AS BudgetName,
       Bud.BudgetDate,
		bd.AccDocTypeCode,
       Bud.CurrencyCode,
       Bud.Description,
       Emp.Name AS EmployeeName,
       Dept.Name AS DeptName,
       Expense.Name AS ExpenseCatgName,
       ProductCost.ProductName AS ProductCostInfo,

       bd.IsActive,
       bd.CreatedBy,
       bd.CreatedAt,
       bd.ModifiedBy,
       bd.ModifiedAt,
       bd.timestamp,
       --
       bd.TradeMarkCode,
       bd.ItemGroupCode,
       gr.Name AS ItemGroupName,
       gr.Name AS BidPackageName,
       bd.OriginalPrice,
       bd.FromDate,
       bd.ToDate,
	   bd.Remark,
	   bd.AmountXD01, bd.AmountXD02, bd.AmountXD03, bd.AmountXD04, bd.AmountXD05, bd.AmountXD06, bd.AmountXD07, bd.AmountXD08, bd.AmountXD09, bd.AmountXD10,
	   bd.AmountME01, bd.AmountME02, bd.AmountME03, bd.AmountME04, bd.AmountME05, bd.AmountME06, bd.AmountME07, bd.AmountME08, bd.AmountME09, bd.AmountME10,
	   bd.ItemNo, bd.ProductName, bd.TaxCode, bd.TaxRate, bd.Amount3, bd.CategoryName, bd.OriginName, bd.QuantityBOQ, bd.XuatXu, xx.Name AS TenXuatXu,
	   bd.IsLink, bd.RowIdInherist, bd.IsTitleRow, bd.TradeMarkList, bd.UnitCostBD, bd.OriginalAmountBD, bd.RowId, bd.Formular, bd.Level, bud.CompletedApprove,
	   bud.DocCode, Bud.TypeXDME, bd.ExQuantity, bd.ImQuantity, bd.CloseQuantity, bd.ConcerlossRate, bd.ConcerlossQuantity, bd.IsPO,
	   bd.QuantityNTP, bd.QuantityNCC, bd.QuantityIPC, bd.UnitQD, bd.ConvertRatexx, bd.ConcerlossQuantityQD, bd.KLDanhGiaQD,
       bd.ProductSize, bd.ProductSizeName, bd.ItemSpeciesCode, bd.ItemSpeciesName, bd.Quantity + bd.ConcerlossQuantity AS TotalQuantity,
       cb.Id AS Id_BOQ,
       -- 06/10/2026: thông tin đàm phán (KH mua hàng VLXD)
       bd.NegotiationStatus, ns.Name AS NegotiationStatusName, bd.EfficiencyRate
FROM dbo.B30BudgetDetail AS bd
	LEFT OUTER JOIN dbo.B30Budget AS Bud ON bd.Stt = Bud.Stt
	LEFT OUTER JOIN dbo.B20Class AS Class ON Bud.BudgetTypeCode = Class.Code AND Class.ParentCode='BUDGET_Loai_Kh'
	LEFT OUTER JOIN dbo.B20Class AS xx ON bd.XuatXu = xx.Code AND xx.ParentCode='QUOCGIA'
	LEFT OUTER JOIN dbo.B20Class AS ns ON bd.NegotiationStatus = ns.Code AND ns.ParentCode='NEGOSTATUS'
	LEFT OUTER JOIN dbo.B20Customer AS Cus ON bd.CustomerCode = Cus.Code
	LEFT OUTER JOIN dbo.B20Item AS Item ON bd.ItemCode = Item.Code
	LEFT OUTER JOIN dbo.B20BidPackage AS gr ON bd.ItemGroupCode = gr.Code
	LEFT OUTER JOIN dbo.B20PriceLibrary AS Pl ON bd.ItemCode = pl.Code
	LEFT OUTER JOIN dbo.B30BizDoc AS Biz1 ON bd.BizDocId_C1 = Biz1.BizDocId
	LEFT OUTER JOIN dbo.B30BizDoc AS Biz2 ON bd.BizDocId_C2 = Biz2.BizDocId
	LEFT OUTER JOIN dbo.B20Dept AS Dept ON bd.DeptCode = Dept.Code
	LEFT OUTER JOIN dbo.B20ExpenseCatg AS Expense ON bd.ExpenseCatgCode = Expense.Code
	LEFT OUTER JOIN dbo.B20Employee AS Emp ON bd.EmployeeCode = Emp.Code
	LEFT OUTER JOIN dbo.vB20ProductCost ProductCost ON bd.ProductCostId = ProductCost.RowId
    LEFT OUTER JOIN dbo.B30ConcreteBudget cb ON bd.Id = cb.ParentBizDocId
GO

-- 4. Tải dữ liệu từ phiếu trước: chép thêm ToDate, NegotiationStatus, EfficiencyRate
CREATE OR ALTER PROC dbo.usp_Newtecons_B30CCMBudget_LoadPrevious
(
	@_ProductCostId VARCHAR(16) = '',
	@_DocCode CHAR(2) = '',
	@_Stt VARCHAR(16) = '',
	@_BranchCode CHAR(3) = '',
	@_TypeXDME NVARCHAR(16) = ''
)
AS
BEGIN
    SET NOCOUNT ON;

	SELECT	@_ProductCostId = ISNULL(@_ProductCostId,''),
			@_DocCode = ISNULL(@_DocCode,''),
			@_Stt = ISNULL(@_Stt,''),
			@_BranchCode = ISNULL(@_BranchCode,'')

	DECLARE @_CCMBudgetId_0 VARCHAR(16) = ''

	IF @_TypeXDME = 'XD'
		SELECT TOP 1 @_CCMBudgetId_0 = Stt
		FROM dbo.B30Budget
		WHERE ProductCostId = @_ProductCostId
			  AND DocCode = @_DocCode
			  AND BranchCode = @_BranchCode
			  AND Stt <> @_Stt
			  AND TypeXDME = @_TypeXDME
			  AND IsActive = 1
			  --AND BudgetDate >= '20260129'
			  AND CompletedApprove = 1
		ORDER BY BudgetDate DESC, DocNo DESC, Id DESC
	ELSE
		SELECT TOP 1 @_CCMBudgetId_0 = Stt
		FROM dbo.B30Budget
		WHERE ProductCostId = @_ProductCostId
			  AND DocCode = @_DocCode
			  AND BranchCode = @_BranchCode
			  AND Stt <> @_Stt
			  AND TypeXDME = @_TypeXDME
			  --AND BudgetDate >= '20260129'
			  AND IsActive = 1

			  AND CompletedApprove = 1
		ORDER BY BudgetDate DESC, DocNo DESC, Id DESC

	IF ISNULL(@_CCMBudgetId_0, '') = ''
	BEGIN
		SELECT ItemNo, FromDate, ItemGroupCode, ItemCode, ItemName
		FROM dbo.B10BudgetDetailTemplate
		WHERE TypeXDME = @_TypeXDME
		RETURN
	END

	;WITH So_Luong_PO AS
			(
				SELECT	dt.RowId_EP,
						SUM(dt.Quantity) AS Quantity
				FROM dbo.B30BizDocDetail dt
					 INNER JOIN dbo.B30BizDoc biz ON dt.BizDocId = biz.BizDocId
				WHERE biz.IsActive = 1
					  AND biz.ApproveSend = 1
					  AND biz.DocCode = 'PO'
					  AND biz.ProductCostId = @_ProductCostId
					  AND biz.DocDate <= CAST(GETDATE() AS DATE)
				GROUP BY dt.RowId_EP
			)
	SELECT IIF(t1.BuiltinOrder = 1, CAST(GETDATE() AS DATE), t1.FromDate) AS FromDate, t1.ItemGroupCode, t1.ItemCode, pr.Name AS ItemName, t1.CategoryName,
			t1.Unit, t1.ProductName, t1.TradeMarkCode, t1.XuatXu, cl.Name AS TenXuatXu,
			t1.QuantityBOQ, t1.Quantity, t1.OriginalPrice, t1.OriginalAmount, t1.TaxCode, t1.TaxRate,
			t1.Amount3, t1.QuantityAccum, t1.Remark, 1 AS IsLink, IIF(t1.RowIdInherist <> '', t1.RowIdInherist, t1.RowId) AS RowIdInherist, t1.ItemNo, t1.IsTitleRow,
			t1.TradeMarkList, t1.UnitCostBD, t1.OriginalAmountBD, IIF(ISNULL(t2.RowId_EP,'') <> '', 1, 0) AS IsPO, t1.ConcerlossRate, IIF(t1.ConcerlossQuantity = 0, t1.Quantity, t1.ConcerlossQuantity) AS ConcerlossQuantity,
			-- 06/10/2026: ngày kết thúc sử dụng + thông tin đàm phán
			t1.ToDate, t1.NegotiationStatus, ns.Name AS NegotiationStatusName, t1.EfficiencyRate
	FROM dbo.B30BudgetDetail t1 LEFT OUTER JOIN dbo.B20PriceLibrary pr ON t1.ItemCode = pr.Code
			LEFT OUTER JOIN dbo.B20Class cl ON t1.XuatXu = cl.Code AND cl.ParentCode = 'QUOCGIA'
			LEFT OUTER JOIN dbo.B20Class ns ON t1.NegotiationStatus = ns.Code AND ns.ParentCode = 'NEGOSTATUS'
			LEFT JOIN So_Luong_PO t2 ON IIF(t1.RowIdInherist <> '', t1.RowIdInherist, t1.RowId) = t2.RowId_EP
	WHERE t1.Stt = @_CCMBudgetId_0
	ORDER BY t1.BuiltinOrder



			--UPDATE t1
			--SET QuantityAccum = ISNULL(t2.Quantity,0)
			--FROM dbo.B30BudgetDetail t1

			--WHERE t1.Stt = @_Stt

END
GO
