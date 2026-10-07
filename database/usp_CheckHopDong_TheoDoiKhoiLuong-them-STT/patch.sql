/*
  Bổ sung "STT: <ItemNo>" trước câu thông báo vượt kế hoạch khối lượng
  SP: dbo.usp_CheckHopDong_TheoDoiKhoiLuong (dùng chung cho billsupp + billsettlement)

  Cách áp dụng: SSMS -> Modify SP -> thay 2 khối dưới đây -> Execute.
  Mỗi cặp (Hạng mục, Mã QLKL) có thể gộp từ nhiều dòng chi tiết -> liệt kê tất cả ItemNo, ngăn cách bằng ', '.
*/

------------------------------------------------------------------------
-- KHỐI 1 (thay đoạn tạo #T_KhoiLuongBill trong phần "version2")
------------------------------------------------------------------------
		SELECT	Temp.HangMuc_QLKL,
				Temp.Ma_QLKL,
				SUM(Temp.Quantity9) AS Quantity9,
				STUFF((
					SELECT N', ' + RTRIM(dt2.ItemNo)
					FROM dbo.B30BizDocCCMDetail dt2
					WHERE dt2.BizDocId = @_BizDocId
						  AND dt2.IsTitleRow = 0
						  AND dt2.Ma_QLKL = Temp.HangMuc_QLKL
						  AND dt2.PartNo = Temp.Ma_QLKL
						  AND dt2.Quantity9 * dt2.Percent_Th <> 0
					ORDER BY dt2.ItemNo
					FOR XML PATH(''), TYPE
				).value('.', 'NVARCHAR(MAX)'), 1, 2, N'') AS ItemNo
		INTO #T_KhoiLuongBill
		FROM (
			SELECT	dt.PartNo AS Ma_QLKL,
					dt.Ma_QLKL AS HangMuc_QLKL,
					dt.Quantity9 * dt.Percent_Th AS Quantity9
			FROM dbo.B30BizDocCCMDetail dt
			WHERE dt.BizDocId = @_BizDocId
				  AND dt.Ma_QLKL <> ''
				  AND dt.IsTitleRow = 0
				  AND dt.Quantity9 * dt.Percent_Th <> 0
		) Temp
		GROUP BY Temp.HangMuc_QLKL,
				 Temp.Ma_QLKL

------------------------------------------------------------------------
-- KHỐI 2 (thay câu ghép @ThongBao)
------------------------------------------------------------------------
		SELECT @ThongBao
			= ISNULL(@ThongBao + '|| ', '') + N'STT: ' + ISNULL(tmp1.ItemNo,'') + N' - Hạng mục: ' + ISNULL(tmp1.HangMuc_QLKL,'') + N' .Mã khối lượng: ' + ISNULL(tmp1.Ma_QLKL,'')
			  + N' vượt kế hoạch. (' + FORMAT(ISNULL(tmp1.Quantity9,0),'N0') + ' > ' + FORMAT(ISNULL(tmp2.GiaTriKL,0),'N0') + ') '
		FROM #T_KhoiLuongBill tmp1
			 LEFT JOIN #T_KLKeHoach tmp2 ON tmp1.HangMuc_QLKL = tmp2.ActivityCode AND tmp1.Ma_QLKL = tmp2.JobCode
		WHERE ROUND(tmp1.Quantity9,0) > ROUND(tmp2.GiaTriKL,0)
			  OR tmp2.GiaTriKL IS NULL
