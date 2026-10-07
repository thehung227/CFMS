/* =============================================================================
   Rollback : 01_usp_Kct_BaoCaoKeHoachBeTong_TongHop.sql
   Mô tả    : Xoá stored procedure báo cáo THỐNG KÊ SẢN LƯỢNG BÊ TÔNG KẾ HOẠCH -
              TỔNG HỢP ALL DA. SP chỉ đọc dữ liệu, không ghi, nên rollback chỉ cần DROP.
              Layout báo cáo web (nếu đã khai báo) cần bỏ trước khi chạy file này.
   ============================================================================= */

IF OBJECT_ID('dbo.usp_Kct_BaoCaoKeHoachBeTong_TongHop', 'P') IS NOT NULL
	DROP PROC dbo.usp_Kct_BaoCaoKeHoachBeTong_TongHop
GO

IF OBJECT_ID('dbo.usp_Kct_BaoCaoKeHoachBeTong_TongHop', 'P') IS NULL
	PRINT 'Rollback OK: dbo.usp_Kct_BaoCaoKeHoachBeTong_TongHop da duoc xoa.'
ELSE
	PRINT 'Rollback FAIL: dbo.usp_Kct_BaoCaoKeHoachBeTong_TongHop van con.'
GO
