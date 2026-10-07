/* =============================================================================
   Module : Kế hoạch bê tông (concretebudget)
   File   : 99_rollback_usp_NEW_CheckConcreteBudget.sql
   Mô tả  : Trả usp_NEW_CheckConcreteBudget về bản trước 01_usp_NEW_CheckConcreteBudget.sql
            (lấy từ sys.sql_modules, Modified 2026-06-30 16:03:50).
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROC dbo.usp_NEW_CheckConcreteBudget
(
	@_Id INT = -1,
	@_ProductCostId NVARCHAR(16) = '',
	@_ProcessCode NVARCHAR(16) = '',
	@_BranchCode NVARCHAR(3) = '',
	--
	@_Error BIT = 0 OUTPUT,
	@_ErrorMessage NVARCHAR(192) = N'' OUTPUT
)
AS
BEGIN
	--SELECT * FROM dbo.B20Approve WHERE ProcessCode IN ('P-1102')

	DECLARE @_Stt VARCHAR(16) = '',
			@_ItemCode NVARCHAR(512) = ''

	SELECT @_Stt = Stt FROM dbo.B30Budget WHERE Id = @_Id

	SELECT TOP (0) * FROM dbo.B30Budget

	IF @_ProcessCode NOT IN ('P-1102')
	BEGIN
		SET @_Error = 0
		SET @_ErrorMessage = N''
		RETURN 0
	END

	DECLARE @PurchaseBudget TABLE (ItemCode NVARCHAR(24) DEFAULT('') NOT NULL, Quantity NUMERIC(18,2) DEFAULT 0 NOT NULL)
	DECLARE @Quantityperform TABLE (ItemCode NVARCHAR(24) DEFAULT('') NOT NULL, Quantity NUMERIC(18,2) DEFAULT 0 NOT NULL)

	--Lấy Kế hoạch mua hàng đang thực hiện
	INSERT INTO @PurchaseBudget
	SELECT t1.ItemCode, SUM(Quantity) AS Quantity
	FROM dbo.B30BudgetDetail t1
	WHERE t1.Stt = @_Stt
	GROUP BY t1.ItemCode

	IF EXISTS (SELECT *
			   FROM dbo.B30BudgetDetail t1

			   WHERE Stt = @_Stt AND t1.QuantityAccum < t1.Quantity)
	BEGIN
		SELECT TOP (1) @_ItemCode = t1.ItemName
		FROM dbo.B30BudgetDetail t1
		WHERE Stt = @_Stt AND t1.QuantityAccum < t1.Quantity

		SET @_Error = 1
		SET @_ErrorMessage = N'Số lượng tính toán không được < hơn số lượng đã đặt hàng!. MÃ HÀNG: ' + @_ItemCode
	END

	IF EXISTS (SELECT *
			   FROM dbo.B30ConcreteBudgetDetail t1
						INNER JOIN dbo.B30ConcreteBudget t2 ON t1.BizDocId = t2.BizDocId
						INNER JOIN dbo.B30BudgetDetail t3 ON t2.ParentBizDocId = t3.Id

			   WHERE t3.Stt = @_Stt AND t1.Description = '')
	BEGIN
		SELECT TOP (1) @_ItemCode = t3.ItemName
		 FROM dbo.B30ConcreteBudgetDetail t1
						INNER JOIN dbo.B30ConcreteBudget t2 ON t1.BizDocId = t2.BizDocId
						INNER JOIN dbo.B30BudgetDetail t3 ON t2.ParentBizDocId = t3.Id

			   WHERE t3.Stt = @_Stt AND t1.Description = ''

		SET @_Error = 1
		SET @_ErrorMessage = N'Yêu cầu nhập năm kế hoạch!. MÃ HÀNG: ' + @_ItemCode
	END

	ELSE
	BEGIN
		SET @_Error = 0
		SET @_ErrorMessage = N''
	END
END
GO
