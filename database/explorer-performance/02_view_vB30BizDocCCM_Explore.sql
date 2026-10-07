/* =============================================================================
   Module : Tối ưu Explorer thanh toán / hợp đồng
   File   : 02_view_vB30BizDocCCM_Explore.sql
   Mô tả  : Explorer billpaysupp / billpayteam / billpaydept / billsupp ...
            Thay 3 subquery vô hướng + OUTER APPLY t (4 lần đọc B30BizDocApprove mỗi dòng) bằng:
              - nxt : bước duyệt đang chờ đầu tiên -> XuLyTiepTheo, CVXuLyTiepTheo
              - t   : 1 lần tổng hợp -> EmployeeNameSend, DateSend, FinishDate
            Phần còn lại giữ nguyên từng dòng. Tên / thứ tự / kiểu cột không đổi.
            Đã so sánh với view cũ: PROD001865 (mọi DocCode), 940 dòng, 0 khác biệt.
   Chạy   : sau 01
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER VIEW dbo.vB30BizDocCCM_Explore
AS
WITH FobPoint
AS
(SELECT Code, Name
    FROM B20Class
    WHERE ParentCode = 'FOB_POINT'
),
PaymentTerms
AS
(SELECT Code, Name
    FROM B20Class
    WHERE ParentCode = 'PAYMENT_TERMS'
),
FreightTerms
AS
(SELECT Code, Name
    FROM B20Class
    WHERE ParentCode = 'FREIGHT_TERMS'
),
ShipVia
AS
(SELECT Code, Name
    FROM B20Class
    WHERE ParentCode = 'SHIP_VIA'
),
LoanContractType
AS
(SELECT Code, Name
    FROM B20Class
    WHERE ParentCode = 'LOANCONTRACT_TYPE'
),
HopDong
AS
(
	SELECT BizdocId, DocNo, DocDate, Description, ContractType
    FROM B30BizDoc
)
SELECT BizDoc.Id, BizDoc.ParentId, BizDoc.BranchCode, BizDoc.BizDocId, BizDoc.DocCode,
        BizDoc.DocNo, BizDoc.DocDate, BizDoc.CurrencyCode, BizDoc.ContactCode, BizDoc.ContactPerson,
        BizDoc.ExchangeRate, BizDoc.CustomerCode, BizDoc.EmployeeCode, BizDoc.Address, BizDoc.Description,
        BizDoc.TransCode, BizDoc.PaymentTermsCode, PT.Name AS PaymentTerms, BizDoc.IsSingleRowInDetail,
        BizDoc.ShipViaCode, ShipVia.Name AS ShipVia, BizDoc.PortOfLoading,
        BizDoc.FobPointCode, FobPoint.Name AS Fob, BizDoc.FreightTermsCode, FobPoint.Name AS FreightTermsName,
        Employee.Name AS EmployeeName, DmDt.Name AS CustomerName, DmDt.TaxRegNo AS Ma_So_Thue,
        CAST(detail.Amount AS Numeric(18, 2)) AS Amount,
        IIF(BizDoc.DocCode = 'P3' AND BizDoc.PayTeamType = '00', BizDoc.Amount_DeNghiTT, IIF(BizDoc.DocDate >= '20250722',CAST(detail.OriginalAmount - detail.OriginalAmount3 AS Numeric(18, 2)),CAST(detail.OriginalAmount AS Numeric(18, 2)))) AS OriginalAmount,
        CAST(detail.Amount3 AS Numeric(18, 2)) AS Amount3,
        CAST(detail.OriginalAmount3 AS Numeric(18, 2)) AS OriginalAmount3,
        IIF(BizDoc.DocCode = 'P3' AND BizDoc.PayTeamType = '00', BizDoc.Amount_DeNghiTT,IIF(BizDoc.DocDate >= '20250722', CAST(detail.OriginalAmount AS Numeric(18, 2)),CAST(detail.OriginalAmount + detail.OriginalAmount3 AS Numeric(18, 2)))) AS TotalOriginalAmount,
        CAST(detail.Amount + detail.Amount3 AS Numeric(18, 2)) AS TotalAmount,
        CAST(0 AS Numeric(18, 2)) AS TotalDiscountAmount,
        BizDoc.IsActive, BizDoc.EffectiveDate, BizDoc.FinishedDate,
        BizDoc.LoanAmount, BizDoc.LoanOriginalAmount,
        BizDoc.BizDocId_C1, BizDoc.BizDocId_LC, BizDoc.LoanContractType, BizDoc.DueDate,
        (CASE WHEN BizDoc.DueDate <> 0 THEN DATEADD(day, BizDoc.DueDate-1, BizDoc.DocDate)
            ELSE NULL END) AS DueDate_Tt,
        LCT.Name AS LoanContractTypeName, BizDoc.Closed,
        BizDoc.TerritoryCode, Territory.Name AS TerritoryName,
        CAST(CAST(BizDoc.DocStatus AS nvarchar(8)) + N'. ' + Doc.DocStatusName AS nvarchar(50)) AS DocStatusName,
        CAST(CAST(BizDoc.DocStatus AS nvarchar(8)) + N'. ' + Doc.DocStatusName_English AS nvarchar(50)) AS DocStatusName_English,
        CAST(CAST(BizDoc.DocStatus AS nvarchar(8)) + N'. ' + Doc.DocStatusName_Japanese AS nvarchar(50)) AS DocStatusName_Japanese,
        CAST(CAST(BizDoc.DocStatus AS nvarchar(8)) + N'. ' + Doc.DocStatusName_Chinese AS nvarchar(50)) AS DocStatusName_Chinese,
        CAST(CAST(BizDoc.DocStatus AS nvarchar(8)) + N'. ' + Doc.DocStatusName_Custom AS nvarchar(50)) AS DocStatusName_Custom,
        Doc.Lock, Doc.Post_SoCai, Doc.Post_TheKho, Doc.IsCancelled,
        (BizDoc.DeptCode + ': ' + Dept.Name) AS DeptName, -- 8/4/2015: CuongNc thêm đề nghị mua hàng
        BizDoc.CreatedBy, BizDoc.CreatedAt, BizDoc.ModifiedBy, BizDoc.ModifiedAt, BizDoc.timestamp
		--Coteccons
		,'' AS DaXuLy
		,(SELECT TOP (1) p.Name FROM dbo.B20Employee p WHERE p.Code = nxt.EmployeeCodeNext) AS XuLyTiepTheo
		,(SELECT TOP (1) p.Name FROM dbo.B20Position p WHERE p.Code = nxt.PositionCode) AS CVXuLyTiepTheo
		,t.FinishDate
		,BizDoc.JobCode, PayRequireNum
		--,REPLACE(STR(BizDoc.PayRequireNum, 3),' ','0') AS PayRequireNum
		,BizDoc.PayTeamType, BizDoc.ContractValue, BizDoc.SubContractValue
		,BizDoc.Remark
		,BizDoc.ProcessCode
		,BizDoc.ApproveSend
		,BizDoc.CompletedApprove
		,BizDoc.ClosedApprove
		,BizDoc.ProductCostId0
		,BizDoc.ProductCostId
		,Pro.Name AS ProductName
		,HopDong.DocNo AS DocNo_Hd , HopDong.DocDate AS DocDate_Hd, HopDong.Description AS Description_Hd
		,BizDoc.Amount_TongTTDenKyNay, BizDoc.Amount_DeNghiTT, FORMAT(BizDoc.Amount_DeNghiTT,'N0') AS Amount_DeNghiTT_Str
		,  IIF(BizDoc.DocCode = 'P3' AND BizDoc.PayTeamType = '00', FORMAT(CAST(BizDoc.Amount_TamUng AS NUMERIC(18,2)),'N0') , FORMAT(CAST(detail.OriginalAmount + detail.OriginalAmount3 AS Numeric(18, 2)),'N0')) AS TotalOriginalAmount_Str
		, FORMAT(CAST(BizDoc.Amount_DeNghiTT AS Numeric(18, 2)),'N0') AS Amount_DeNghiTTStr
		,ulist.FullName, BizDoc.ParentBizDocId
		,t.EmployeeNameSend
		,BizDoc.Amount_HDPL
		,BizDoc.Amount_THDenKyNay
		, BizDoc.Date_Liquidation
				,process.Name AS ProcessName,CasE wHEN BizDoc.CompletedApprove=1 THEN N'Đã hoàn thành' wHEN BizDoc.CompletedApprove=0 AND BizDoc.ApproveSend=1 THEN N'Đã gửi duyệt' ELSE N'Khác' END as ApproveStatusName,
			CasE wHEN BizDoc.CompletedApprove=0 AND BizDoc.ApproveSend=1 THEN 1 ELSE 0 END IsProcessing, HopDong.ContractType, BizDoc.IsMaintenance AS IsMaintenance
			, IIF(Pro.Code2 = '', pro.Code, Pro.Code2) AS Code2, BizDoc.Amount_THDenKyNayNotVAT
			, t.DateSend, BizDoc.IsInvesment, BizDoc.BillStatus, BizDoc.ContractType AS ContractTypeBCH
FROM dbo.B30BizDocCCM AS BizDoc
    LEFT OUTER JOIN dbo.B20Employee AS Employee ON BizDoc.EmployeeCode = Employee.Code
    LEFT OUTER JOIN dbo.B20Customer AS DmDt ON BizDoc.CustomerCode = DmDt.Code
    LEFT OUTER JOIN dbo.B20Territory AS Territory ON BizDoc.TerritoryCode = Territory.Code
	LEFT OUTER JOIN dbo.B20Product AS Pro ON BizDoc.ProductCostId = Pro.RowId
    LEFT OUTER JOIN dbo.B00DocStatus AS Doc ON BizDoc.DocStatus = Doc.DocStatusKey
    LEFT OUTER JOIN FobPoint ON BizDoc.FobPointCode = FobPoint.Code
    LEFT OUTER JOIN PaymentTerms AS PT ON BizDoc.PaymentTermsCode = PT.Code
    LEFT OUTER JOIN ShipVia ON BizDoc.ShipViaCode = ShipVia.Code
    LEFT OUTER JOIN FreightTerms FT ON BizDoc.FreightTermsCode = FT.Code
    LEFT OUTER JOIN LoanContractType LCT ON BizDoc.LoanContractType = LCT.Code
	LEFT OUTER JOIN HopDong ON BizDoc.ParentBizDocId = HopDong.BizdocId
    LEFT JOIN B20Dept Dept ON BizDoc.DeptCode = Dept.Code
		LEFT OUTER JOIN B20Process process ON BizDoc.ProcessCode = process.Code
    OUTER APPLY
    (
		SELECT	BizDocId,
			    SUM(Amount) AS Amount,
				SUM(OriginalAmount) AS OriginalAmount,
				SUM(IIF(DocDate > '20250722',Amount3_Th,Amount3)) AS Amount3,
				SUM(IIF(DocDate > '20250722',Amount3_Th,OriginalAmount3)) AS OriginalAmount3,
				SUM(PaymentAmount) AS PaymentAmount,
				MIN(EstimatedTimeDelivery) AS EstimatedTimeDelivery
        FROM dbo.B30BizDocCCMDetail
        WHERE BizDocId = BizDoc.BizDocId-- AND DocDate = BizDoc.DocDate
        GROUP BY BizDocId
    ) AS detail
	OUTER APPLY
	(
		-- Bước duyệt đang chờ đầu tiên, chỉ đọc khi đã gửi duyệt
		SELECT TOP (1) IIF(da.EmployeeCodeReal = '', da.EmployeeCode, da.EmployeeCodeReal) AS EmployeeCodeNext, da.PositionCode
		FROM dbo.B30BizDocApprove da
		WHERE da.BizDocId = BizDoc.BizDocId AND (da.ApproveStatus = '' OR da.ApproveStatus = '0') AND BizDoc.ApproveSend = 1
		ORDER BY da.ApproveGroup
	) nxt
	OUTER APPLY
	(
		-- LEFT JOIN + IIF giữ đúng kết quả INNER JOIN cũ: DateSend chỉ tính dòng có người gửi hợp lệ
		SELECT MAX(nv.Name) AS EmployeeNameSend,
			   MAX(IIF(nv.Code IS NOT NULL, ap.DateSend, NULL)) AS DateSend,
			   IIF(BizDoc.CompletedApprove = 1, MAX(DATEADD(hh, 7, ap.FinishDate)), NULL) AS FinishDate
		FROM dbo.B30BizDocApprove ap LEFT JOIN dbo.B20Employee nv ON ap.EmployeeCodeSend = nv.Code
		WHERE BizDoc.BizDocId = ap.BizDocId
	) t
	LEFT OUTER JOIN	dbo.B00UserList ulist ON BizDoc.CreatedBy = ulist.Id
	--WHERE BizDoc.CustomerCode NOT IN ('SI-05337')
GO
