/* =============================================================================
   Module : Tối ưu Explorer thanh toán / hợp đồng
   File   : 99_rollback.sql
   Mô tả  : Hoàn tác 05 (index) và 01 (hàm). Chạy phần cần hoàn tác.
            View (02..04): chạy lại file ALTER đã sao lưu ở 00_measure_and_backup.sql.
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* ---------- Hoàn tác 05_indexes.sql ---------- */
DROP INDEX IF EXISTS IX_B30BizDocCCM_ProductCostId_DocCode ON dbo.B30BizDocCCM;
DROP INDEX IF EXISTS IX_B30BizDoc_ProductCostId_DocCode ON dbo.B30BizDoc;
DROP INDEX IF EXISTS IX_B20ProductHuman_EmployeeCode ON dbo.B20ProductHuman;
DROP INDEX IF EXISTS IX_B30CCMBudget_ProductCostId_DocCode ON dbo.B30CCMBudget;
GO

-- Chỉ khi đã chạy bước 2: trả index BizDocId về dạng không INCLUDE như ban đầu
IF EXISTS (
    SELECT 1 FROM sys.index_columns ic JOIN sys.indexes i ON i.object_id = ic.object_id AND i.index_id = ic.index_id
    WHERE i.object_id = OBJECT_ID('dbo.B30BizDocApprove') AND i.name = 'IX_B30BizDocApprove_BizDocId'
      AND ic.is_included_column = 1)
    CREATE NONCLUSTERED INDEX IX_B30BizDocApprove_BizDocId
        ON dbo.B30BizDocApprove (BizDocId)
        WITH (DROP_EXISTING = ON, ONLINE = ON, SORT_IN_TEMPDB = ON);
GO

/* ---------- Hoàn tác 01: trả hàm về multi-statement TVF (định nghĩa gốc, sửa lần cuối 2025-09-23) ---------- */
BEGIN TRANSACTION;
GO

IF OBJECT_ID('dbo.ufn_Coteccons_GoiThau_Theo_NhanVien') IS NOT NULL
    DROP FUNCTION dbo.ufn_Coteccons_GoiThau_Theo_NhanVien;
GO

CREATE FUNCTION dbo.ufn_Coteccons_GoiThau_Theo_NhanVien
(
	@_Ma_CbNv NVARCHAR(16) = ''
)
RETURNS @_Tbl_Project TABLE(RowId VARCHAR(24))
AS
BEGIN
	SET @_Ma_CbNv = ISNULL(@_Ma_CbNv,'')

	INSERT INTO @_Tbl_Project(RowId)
	SELECT RowId
	FROM dbo.B20Product p
		 INNER JOIN
		 (
			SELECT ProductCostId FROM dbo.B20ProductHuman WHERE EmployeeCode = @_Ma_CbNv AND IsActive = 1
			UNION
			SELECT ProductCostId FROM dbo.B20ProductHumanPay WHERE EmployeeCode = @_Ma_CbNv AND IsActive = 1
			UNION
			SELECT ProductCostId FROM dbo.B20ProductHumanPurchase WHERE EmployeeCode = @_Ma_CbNv AND IsActive = 1
		 ) gt ON p.RowId = gt.ProductCostId

	RETURN
END
GO

IF OBJECT_ID('dbo.ufn_Coteccons_GoiThau_Theo_NhanVien', 'TF') IS NOT NULL
    COMMIT TRANSACTION;
ELSE
BEGIN
    ROLLBACK TRANSACTION;
    RAISERROR(N'Khôi phục hàm thất bại - đã rollback.', 16, 1);
END
GO
