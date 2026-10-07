-- =============================================================================
-- Rollback "Tổng hợp đàm phán mua hàng" (đảo ngược 01 + 02 + 03).
-- CẢNH BÁO: bước 4 xoá 2 cột NegotiationStatus / EfficiencyRate => MẤT dữ liệu đã nhập.
-- Trước khi chạy bước 4, chạy lại bản cũ của vB30BudgetDetail_Edit và
-- usp_Newtecons_B30CCMBudget_LoadPrevious (lấy từ git / bản sao lưu) vì cả hai đang tham chiếu 2 cột này.
-- =============================================================================
SET NOCOUNT ON
GO

-- 1. Báo cáo
DROP PROCEDURE IF EXISTS dbo.usp_Kct_TongHopDamPhanMuaHang;
GO

-- 2. Quyền + menu
DECLARE @Id INT = (SELECT Id FROM dbo.B00CommandWeb WHERE CommandKey = 'reportertonghopdamphan');
IF @Id IS NOT NULL
BEGIN
    DELETE FROM dbo.B00PermissionWebPosition WHERE CommandId = @Id;
    DELETE FROM dbo.B00PermissionWeb WHERE CommandId = @Id;
    DELETE FROM dbo.B00CommandWeb WHERE Id = @Id;
END
GO

-- 3. Danh mục tình trạng đàm phán
DELETE FROM dbo.B20Class WHERE ParentCode = 'NEGOSTATUS';
GO

-- 4. Cột mới (chỉ chạy sau khi đã khôi phục view + SP cũ)
/*
ALTER TABLE dbo.B30BudgetDetail DROP CONSTRAINT DF_B30BudgetDetail_NegotiationStatus;
ALTER TABLE dbo.B30BudgetDetail DROP COLUMN NegotiationStatus;
ALTER TABLE dbo.B30BudgetDetail DROP CONSTRAINT DF_B30BudgetDetail_EfficiencyRate;
ALTER TABLE dbo.B30BudgetDetail DROP COLUMN EfficiencyRate;
*/
