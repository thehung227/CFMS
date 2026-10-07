/* =============================================================================
   Module : Kế hoạch bê tông (concretebudget, B30Budget DocCode H9 / BudgetTypeCode 6)
   File   : 01_usp_NEW_CheckConcreteBudget.sql
   Mô tả  : Bổ sung kiểm tra khi Gửi duyệt: "Khối lượng tính toán (chưa gồm hao hụt)"
            (B30BudgetDetail.Quantity) của từng dòng phải bằng tổng khối lượng chi tiết
            tháng bên concretebudgetdetail (B30ConcreteBudgetDetail.Quantity01..12).
            - Chạy với mọi quy trình duyệt: đặt TRƯỚC điều kiện ProcessCode = 'P-1102'
              (phiếu H9 hiện đều dùng P-261 nên đặt sau sẽ không bao giờ chạy).
            - Một dòng có thể có nhiều B30ConcreteBudget (mở nút "..." nhiều lần):
              lấy phiếu mới nhất có dòng chi tiết.
            - Dòng chưa nhập chi tiết tháng: tổng chi tiết = 0.
            - So sánh làm tròn 4 số lẻ (Quantity là numeric(15,4), chi tiết numeric(18,5)).
            Các kiểm tra cũ giữ nguyên.
   Gọi từ : concretebudget-editor.component.ts > checkKhoiLuong_KeHoach_PO (nút Gửi duyệt)
   Rollback: 99_rollback_usp_NEW_CheckConcreteBudget.sql
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
			@_ItemCode NVARCHAR(512) = '',
			@_ErrorMessageKL NVARCHAR(192) = N''

	SELECT @_Stt = Stt FROM dbo.B30Budget WHERE Id = @_Id

	SELECT TOP (0) * FROM dbo.B30Budget

	--Tổng KL tính toán từng dòng phải bằng tổng KL chi tiết tháng (concretebudgetdetail)
	;WITH ChiTiet AS
	(
		SELECT t1.BuiltinOrder, t1.ItemNo, t1.ItemName, t1.Quantity,
			   ROUND(ISNULL(ct.TotalQuantity, 0), 4) AS TotalQuantityCT
		FROM dbo.B30BudgetDetail t1
			OUTER APPLY
			(
				SELECT TOP (1) SUM(d.Quantity01 + d.Quantity02 + d.Quantity03 + d.Quantity04 + d.Quantity05 + d.Quantity06
								 + d.Quantity07 + d.Quantity08 + d.Quantity09 + d.Quantity10 + d.Quantity11 + d.Quantity12) AS TotalQuantity
				FROM dbo.B30ConcreteBudget cb
					INNER JOIN dbo.B30ConcreteBudgetDetail d ON d.BizDocId = cb.BizDocId
				WHERE cb.ParentBizDocId = CAST(t1.Id AS VARCHAR(16))
				GROUP BY cb.Id
				ORDER BY cb.Id DESC
			) ct
		WHERE t1.Stt = @_Stt
	)
	SELECT TOP (1) @_ErrorMessageKL = N'Tổng KL tính toán (chưa gồm HH) phải bằng tổng KL chi tiết tháng: '
									+ FORMAT(Quantity, N'#,##0.####') + N' <> ' + FORMAT(TotalQuantityCT, N'#,##0.####')
									+ N'. STT ' + ItemNo + N' - MÃ HÀNG: ' + ItemName
	FROM ChiTiet
	WHERE Quantity <> TotalQuantityCT
	ORDER BY BuiltinOrder

	IF @_ErrorMessageKL <> N''
	BEGIN
		SET @_Error = 1
		SET @_ErrorMessage = @_ErrorMessageKL
		RETURN 0
	END

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
