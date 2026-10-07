/* =============================================================================
   Module : Tối ưu Explorer thanh toán / hợp đồng
   File   : 01_ufn_GoiThau_Theo_NhanVien_inline.sql
   Mô tả  : Đổi dbo.ufn_Coteccons_GoiThau_Theo_NhanVien từ multi-statement TVF sang inline TVF.
            Giữ nguyên tên, tham số, tên + kiểu cột trả về (RowId VARCHAR(24)) vì hàm được gọi
            ở 379 chỗ trong frontend và trong usp_CCM_PlanRevenue.
            SQL Server không cho ALTER từ multi-statement sang inline nên phải DROP + CREATE
            trong 1 transaction. Hàm hiện không có GRANT riêng nên không mất quyền.
            Đã so sánh với bản cũ: 5 nhân viên, 1.732 dòng, 0 khác biệt.
   Chạy   : sau 00_measure_and_backup.sql
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

BEGIN TRANSACTION;
GO

IF OBJECT_ID('dbo.ufn_Coteccons_GoiThau_Theo_NhanVien') IS NOT NULL
    DROP FUNCTION dbo.ufn_Coteccons_GoiThau_Theo_NhanVien;
GO

CREATE FUNCTION dbo.ufn_Coteccons_GoiThau_Theo_NhanVien
(
	@_Ma_CbNv NVARCHAR(16) = ''
)
RETURNS TABLE
AS
RETURN
	SELECT CAST(p.RowId AS VARCHAR(24)) AS RowId
	FROM dbo.B20Product p
	WHERE p.RowId IN
	(
		SELECT ProductCostId FROM dbo.B20ProductHuman WHERE EmployeeCode = ISNULL(@_Ma_CbNv, '') AND IsActive = 1
		UNION ALL
		SELECT ProductCostId FROM dbo.B20ProductHumanPay WHERE EmployeeCode = ISNULL(@_Ma_CbNv, '') AND IsActive = 1
		UNION ALL
		SELECT ProductCostId FROM dbo.B20ProductHumanPurchase WHERE EmployeeCode = ISNULL(@_Ma_CbNv, '') AND IsActive = 1
	);
GO

-- CREATE lỗi thì huỷ luôn lệnh DROP ở trên
IF OBJECT_ID('dbo.ufn_Coteccons_GoiThau_Theo_NhanVien', 'IF') IS NOT NULL
    COMMIT TRANSACTION;
ELSE
BEGIN
    ROLLBACK TRANSACTION;
    RAISERROR(N'Tạo inline function thất bại - đã rollback, hàm cũ vẫn giữ nguyên.', 16, 1);
END
GO
