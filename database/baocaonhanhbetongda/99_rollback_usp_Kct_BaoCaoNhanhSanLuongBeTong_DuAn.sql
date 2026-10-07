/* =============================================================================
   Rollback : 01_usp_Kct_BaoCaoNhanhSanLuongBeTong_DuAn.sql
   Mô tả    : Xoá stored procedure "Báo cáo nhanh sản lượng bê tông dự án".
              SP chỉ đọc dữ liệu, không ghi, nên rollback chỉ cần DROP.
              Phía web: gỡ module src/app/main/reporterconcretequick, route
              'reporterconcretequick' trong src/app/main/main.routes.ts và nút
              "Báo cáo nhanh sản lượng bê tông" trên 2 explorer
              (concretebudget, approvedconcretebudget).
   ============================================================================= */

IF OBJECT_ID('dbo.usp_Kct_BaoCaoNhanhSanLuongBeTong_DuAn', 'P') IS NOT NULL
	DROP PROC dbo.usp_Kct_BaoCaoNhanhSanLuongBeTong_DuAn
GO

IF OBJECT_ID('dbo.usp_Kct_BaoCaoNhanhSanLuongBeTong_DuAn', 'P') IS NULL
	PRINT 'Rollback OK: dbo.usp_Kct_BaoCaoNhanhSanLuongBeTong_DuAn da duoc xoa.'
ELSE
	PRINT 'Rollback FAIL: dbo.usp_Kct_BaoCaoNhanhSanLuongBeTong_DuAn van con.'
GO
