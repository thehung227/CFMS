/* =============================================================================
   Module : Tối ưu Explorer thanh toán / hợp đồng
   File   : 04_view_vB30CCMBudget_Explore.sql
   Mô tả  : Explorer paymentproposal / paymentccmproposal / paymentextraproposal / plan* ...
            - Subquery FinishDate gộp vào OUTER APPLY t (4 lần đọc B30BizDocApprove mỗi dòng -> 3).
            - Bỏ OUTER APPLY dt_BTCTA / dt_BTCTB / dt_BTCTC: không cột nào được SELECT
              (Amount_DoanhThu, Amount_ChiPhi lấy từ bảng B30CCMBudget).
            XuLyTiepTheo, ApproveDateCHT (TOP 1 không ORDER BY) giữ nguyên để không đổi kết quả.
            Tên / thứ tự / kiểu cột không đổi.
            Đã so sánh với view cũ: dự án nhiều phiếu nhất, 396 dòng, 0 khác biệt.
   Chạy   : sau 01
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER VIEW dbo.vB30CCMBudget_Explore
AS
SELECT  CCMBudget.Id, CCMBudget.ParentId, CCMBudget.BranchCode, CCMBudget.CCMBudgetId, CCMBudget.DocCode,
        CCMBudget.DocNo, CCMBudget.DocDate, CCMBudget.CurrencyCode, CCMBudget.ContactCode, CCMBudget.ContactPerson,
        CCMBudget.ExchangeRate, CCMBudget.CustomerCode, CCMBudget.EmployeeCode, CCMBudget.Address, CCMBudget.Description,
        Employee.Name AS EmployeeName, DmDt.Name AS CustomerName, DmDt.TaxRegNo AS Ma_So_Thue,
        CAST(detail.Amount AS Numeric(18, 2)) AS Amount,
        CAST(detail.OriginalAmount AS Numeric(18, 2)) AS OriginalAmount,
        CAST(detail.Amount3 AS Numeric(18, 2)) AS Amount3,
        CAST(detail.OriginalAmount3 AS Numeric(18, 2)) AS OriginalAmount3,
        CAST(detail.OriginalAmount + detail.OriginalAmount3 AS Numeric(18, 2)) AS TotalOriginalAmount,
        CAST(detail.Amount + detail.Amount3 AS Numeric(18, 2)) AS TotalAmount,

        CCMBudget.IsActive, CCMBudget.EffectiveDate, CCMBudget.FinishedDate,
        CCMBudget.DueDate,
        (CASE WHEN CCMBudget.DueDate <> 0 THEN DATEADD(day, CCMBudget.DueDate-1, CCMBudget.DocDate)
            ELSE NULL END) AS DueDate_Tt, CCMBudget.Closed,
        CCMBudget.TerritoryCode, Territory.Name AS TerritoryName,
        CAST(CAST(CCMBudget.DocStatus AS nvarchar(8)) + N'. ' + Doc.DocStatusName AS nvarchar(50)) AS DocStatusName,
        CAST(CAST(CCMBudget.DocStatus AS nvarchar(8)) + N'. ' + Doc.DocStatusName_English AS nvarchar(50)) AS DocStatusName_English,
        CAST(CAST(CCMBudget.DocStatus AS nvarchar(8)) + N'. ' + Doc.DocStatusName_Japanese AS nvarchar(50)) AS DocStatusName_Japanese,
        CAST(CAST(CCMBudget.DocStatus AS nvarchar(8)) + N'. ' + Doc.DocStatusName_Chinese AS nvarchar(50)) AS DocStatusName_Chinese,
        CAST(CAST(CCMBudget.DocStatus AS nvarchar(8)) + N'. ' + Doc.DocStatusName_Custom AS nvarchar(50)) AS DocStatusName_Custom,
        Doc.Lock, Doc.Post_SoCai, Doc.Post_TheKho, Doc.IsCancelled,

		Pro.Name AS ProductName,
        (CCMBudget.DeptCode + ': ' + Dept.Name) AS DeptName, -- 8/4/2015: CuongNc thêm đề nghị mua hàng
         CCMBudget.CreatedBy, CCMBudget.CreatedAt, CCMBudget.ModifiedBy, CCMBudget.ModifiedAt, CCMBudget.timestamp
		,CCMBudget.ProductCostId, CCMBudget.DocNo2, detail.PaymentAmount
		,dml.Name AS AppendixContractName
		,CCMBudget.ApproveSend
		,CCMBudget.CompletedApprove
		,CCMBudget.ClosedApprove
		,CCMBudget.ProcessCode
		,CCMBudget.StageCode
		,'' AS DaXuLy
		,(SELECT TOP 1 p.Name FROM B30BizDocApprove da LEFT JOIN dbo.B20Employee p ON IIF(da.EmployeeCodeReal = '', da.EmployeeCode, da.EmployeeCodeReal) = p.Code WHERE (da.ApproveStatus = '' OR da.ApproveStatus = '0') AND da.BizDocId = CCMBudget.CCMBudgetId AND CCMBudget.ApproveSend = 1 ORDER BY da.ApproveGroup) AS XuLyTiepTheo
		,t.FinishDate
		,(SELECT TOP 1 DATEADD(hh, 7, da.FinishDate) FROM B30BizDocApprove da WHERE da.BizDocId = CCMBudget.CCMBudgetId AND da.FinishDate IS NOT NULL AND da.ApproveGroup = 1) AS ApproveDateCHT
		,CCMBudget.Amount_DoanhThu
		,CCMBudget.Amount_ChiPhi
		,CCMBudget.Amount_LoiNhuan AS Amount_LoiNhuan
		,CCMBudget.TiSuat_LN AS TiSuat_LN
		,ulist.FullName
		,t.EmployeeNameSend
		,IIF(duyet.CompletedApproveDetail = 0, 1, 0) AS NotApproveSend, pro.ProductType, CCMBudget.TiSuatLNRong, CCMBudget.TongDinhMuc, t.DateSend
		, CCMBudget.ThuChiKyTruoc, CCMBudget.ThuChiKyNayBCH, CCMBudget.AmountLimit--, CCMBudget.Amount_DoanhThu
		, CCMBudget.TransType
FROM dbo.B30CCMBudget AS CCMBudget
    LEFT OUTER JOIN dbo.B20Employee AS Employee ON CCMBudget.EmployeeCode = Employee.Code
    LEFT OUTER JOIN dbo.B20Customer AS DmDt ON CCMBudget.CustomerCode = DmDt.Code
    LEFT OUTER JOIN dbo.B20Territory AS Territory ON CCMBudget.TerritoryCode = Territory.Code
	LEFT OUTER JOIN dbo.B20Product AS Pro ON CCMBudget.ProductCostId = Pro.RowId
    LEFT OUTER JOIN dbo.B00DocStatus AS Doc ON CCMBudget.DocStatus = Doc.DocStatusKey
LEFT OUTER JOIN dbo.B20Dept Dept ON CCMBudget.DeptCode = Dept.Code
	LEFT OUTER JOIN dbo.B20Class dml ON CCMBudget.StageCode = dml.Code AND dml.ParentCode='StageCode'
	LEFT OUTER JOIN dbo.B00UserList ulist ON CCMBudget.CreatedBy = ulist.Id
    OUTER APPLY
    (
       SELECT CCMBudgetId,
			  SUM(Amount) AS Amount, SUM(OriginalAmount) AS OriginalAmount,
			  SUM(Amount3) AS Amount3, SUM(OriginalAmount3) AS OriginalAmount3,
              MIN(EstimatedTimeDelivery) AS EstimatedTimeDelivery,
			  SUM(PaymentAmount) AS PaymentAmount
        FROM dbo.B30CCMBudgetDetail
        WHERE CCMBudgetId = CCMBudget.CCMBudgetId
        GROUP BY CCMBudgetId
    ) AS detail
	OUTER APPLY
	(
		SELECT TOP 1 dt.CompletedApproveDetail
		FROM dbo.B30CCMBudgetDetail dt
		WHERE dt.CCMBudgetId = CCMBudget.CCMBudgetId AND dt.Loai_Dt IN ('NTP', 'NCC') AND dt.CompletedApproveDetail = 0 AND CCMBudget.ApproveSend = 0
	) duyet
	OUTER APPLY
	(
		-- LEFT JOIN + IIF giữ đúng kết quả INNER JOIN cũ: DateSend chỉ tính dòng có người gửi hợp lệ
		SELECT MAX(nv.Name) AS EmployeeNameSend,
			   MAX(IIF(nv.Code IS NOT NULL, ap.DateSend, NULL)) AS DateSend,
			   IIF(CCMBudget.CompletedApprove = 1, MAX(DATEADD(hh, 7, ap.FinishDate)), NULL) AS FinishDate
		FROM dbo.B30BizDocApprove ap LEFT JOIN dbo.B20Employee nv ON ap.EmployeeCodeSend = nv.Code
		WHERE CCMBudget.CCMBudgetId = ap.BizDocId
	) t
GO
