/* =============================================================================
   Module : Tối ưu Explorer thanh toán / hợp đồng
   File   : 03_view_vB30BizDoc_Explore.sql
   Mô tả  : Explorer contract / appendix / depositcontract / creditcontract ...
            - 5 subquery vô hướng + OUTER APPLY t, nd, me (8 lần đọc B30BizDocApprove mỗi dòng,
              cộng duyetcuoi là 9) gom còn 3: nxt, apr, duyetcuoi (giữ nguyên).
            - NK: đọc thẳng B30AccDocEquip thay cho vB30AccDocEquip_ExploreInventory và bỏ
              dbo.Concatenate(Stt) vì view không SELECT cột Stt. Điều kiện FinishDateCHT IS NOT NULL
              viết lại bằng EXISTS tương đương. Cách nhóm (BizDocId_PO, DocNo) giữ nguyên.
            Phần còn lại giữ nguyên từng dòng. Tên / thứ tự / kiểu cột không đổi.
            Đã so sánh với view cũ: PROD001658 (mọi DocCode), 1.805 dòng, 0 khác biệt.
   Chạy   : sau 01
   ============================================================================= */

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

---- 26/03/2014 CuongNc thêm các trường CreatedBy, CreatedAt, ModifiedBy, ModifiedAt, timestamp
ALTER VIEW dbo.vB30BizDoc_Explore
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
DocStatusLC
AS
(SELECT Code, Name
    FROM B20Class
    WHERE ParentCode = 'DocStatusLC' AND IsActive=1
),
HopDong
AS
(
	SELECT BizdocId, DocNo, DocDate, Description
    FROM B30BizDoc
	WHERE DocCode IN ('C3','C4')
)
SELECT BizDoc.Id, BizDoc.ParentId, BizDoc.BranchCode, BizDoc.BizDocId, BizDoc.DocCode,
        BizDoc.DocNo, BizDoc.DocDate, BizDoc.CurrencyCode, BizDoc.ContactCode, BizDoc.ContactPerson,
        BizDoc.ExchangeRate, BizDoc.CustomerCode, BizDoc.EmployeeCode, BizDoc.Address, BizDoc.Description,
        BizDoc.TransCode, BizDoc.PaymentTermsCode, PT.Name AS PaymentTerms, BizDoc.IsSingleRowInDetail,
        BizDoc.ShipViaCode, ShipVia.Name AS ShipVia, BizDoc.PortOfLoading,
        BizDoc.FobPointCode, FobPoint.Name AS Fob, BizDoc.FreightTermsCode, FobPoint.Name AS FreightTermsName,
        Employee.Name AS EmployeeName, DmDt.Name AS CustomerName, DmDt.TaxRegNo AS Ma_So_Thue,
        CAST(detail.Amount AS NUMERIC(18, 2)) AS Amount,
        CAST(detail.OriginalAmount AS NUMERIC(18, 2)) AS OriginalAmount,
        CAST(detail.Amount3 AS NUMERIC(18, 2)) AS Amount3,
        CAST(detail.OriginalAmount3 AS NUMERIC(18, 2)) AS OriginalAmount3,
        CAST(detail.OriginalAmount + detail.OriginalAmount3 AS NUMERIC(18, 2)) AS TotalOriginalAmount,
        CAST(detail.Amount + detail.Amount3 AS NUMERIC(18, 2)) AS TotalAmount,
        CAST(disc.DiscountAmount AS NUMERIC(18, 2)) AS TotalDiscountAmount,
        BizDoc.IsActive, BizDoc.EffectiveDate,
        BizDoc.LoanAmount, BizDoc.LoanOriginalAmount,
        BizDoc.BizDocId_C1, BizDoc.BizDocId_LC, BizDoc.LoanContractType, BizDoc.DueDate,
        (CASE WHEN BizDoc.DueDate <> 0 THEN DATEADD(DAY, BizDoc.DueDate-1, BizDoc.DocDate) ELSE NULL END) AS DueDate_Tt,
        LCT.Name AS LoanContractTypeName, BizDoc.Closed,
        BizDoc.TerritoryCode, Territory.Name AS TerritoryName,
        CAST(CAST(BizDoc.DocStatus AS NVARCHAR(8)) + N'. ' + Doc.DocStatusName AS NVARCHAR(50)) AS DocStatusName,
        CAST(CAST(BizDoc.DocStatus AS NVARCHAR(8)) + N'. ' + Doc.DocStatusName_English AS NVARCHAR(50)) AS DocStatusName_English,
        CAST(CAST(BizDoc.DocStatus AS NVARCHAR(8)) + N'. ' + Doc.DocStatusName_Japanese AS NVARCHAR(50)) AS DocStatusName_Japanese,
        CAST(CAST(BizDoc.DocStatus AS NVARCHAR(8)) + N'. ' + Doc.DocStatusName_Chinese AS NVARCHAR(50)) AS DocStatusName_Chinese,
        CAST(CAST(BizDoc.DocStatus AS NVARCHAR(8)) + N'. ' + Doc.DocStatusName_Custom AS NVARCHAR(50)) AS DocStatusName_Custom,
        Doc.Lock, Doc.Post_SoCai, Doc.Post_TheKho, Doc.IsCancelled,
        (BizDoc.DeptCode + ': ' + Dept.Name) AS DeptName, -- 8/4/2015: CuongNc thêm đề nghị mua hàng
        BizDoc.CreatedBy, BizDoc.CreatedAt, BizDoc.ModifiedBy, BizDoc.ModifiedAt, BizDoc.timestamp
		--Ricons
		,UPPER(dmloai.Name) AS BizDocPOTypeName
		,nvc.Name AS NhaVanChuyen
		,BizDoc.SoXe, BizDoc.ClassCode1, BizDoc.ClassCode2, BizDoc.ClassCode3
		--Coteccons
		,'' AS DaXuLy
		,(SELECT TOP (1) p.Name FROM dbo.B20Employee p WHERE p.Code = nxt.EmployeeCodeNext) AS XuLyTiepTheo
		,apr.FinishDate

		,(SELECT TOP (1) p.Name FROM dbo.B20Position p WHERE p.Code = nxt.PositionCode) AS CVXuLyTiepTheo
		,apr.FinishDateCHT
		,apr.DateSend
		,BizDoc.JobCode
		,BizDoc.ContractValue, BizDoc.SubContractValue, BizDoc.ContractValueAddVAT, BizDoc.SubContractValue0
		,BizDoc.AriseValue
		,BizDoc.ValueOfPay, BizDoc.ValueOfWarranty, BizDoc.ValueOfPayPeriod
		,BizDoc.Remark
		,BizDoc.PercentOfWarranty, BizDoc.ValueOfGuarantee
		,BizDoc.ProcessCode, BizDoc.ContractType, BizDoc.Position
		,BizDoc.AuthorizeNo, BizDoc.AuthorizeDate -- Uỷ quyền
		,BizDoc.FromDate, BizDoc.ToDate -- Tiến độ
		,BizDoc.ContractType AS ContractTypeTmp2, BizDoc.DocDate AS DocDateTmp2, BizDoc.BranchCode AS BranchCodeTmp2
		,BizDoc.ApproveSend, BizDoc.CompletedApprove, BizDoc.ClosedApprove
		,BizDoc.ProductCostId0, BizDoc.ProductCostId1, BizDoc.ProductCostId
		,Pro.Name AS ProductName
		,Pro.Code AS ProductCode
		,dmloai1.Name AS UploadFile
		, FORMAT(BizDoc.ValueOfPayPeriod,'N0') AS ValueOfPayPeriod_Str
		--,pp.Phan_Phoi
		,BizDoc.Ngay_Phan_Phoi
		,'' AS DocNo_C5
		--,(SELECT DocNo FROM B30BizDoc qt WHERE DocCode = 'C5' AND BizDoc.BizDocId = qt.ParentBizDocId) AS DocNo_C5
		,Pro.Code2 AS ProductCode2
		,ulist.FullName
		,apr.EmployeeNameSend
		,apr.EmployeeNameApprove
		,ISNULL(detail.EstimatedTimeDelivery,BizDoc.EstimatedCompletionDate) AS EstimatedTimeDeliveryMin
		,ISNULL(detail.EstimatedTimeDelivery2, BizDoc.EstimatedCompletionDate) AS EstimatedTimeDeliveryMax
		,detail.DateDiff_MinMax
		,DATEADD(hh, 7, BizDoc.CreatedAt) AS CreatedAt_HaNoi
		,BizDoc.FilePath
		,BizDoc.TotalAdvanceAmount
		,BizDoc.OpenAdvanceAmount
		,BizDoc.DocStatus
		,BizDoc.ParentBizDocId
		,BizDoc.ItemGroupCode
		,dmvt.Name AS ItemGroupName
		,IIF(BizDoc.DocName = '', BizDoc.Description, BizDoc.DocName) AS DocName
		,BizDoc.TotalAmountRevised
		,(SELECT Name FROM dbo.B20Product WHERE RowId = BizDoc.ProductCostId1) AS TenGoiThau
		,BizDoc.DocNo2
		,CAST(DATEADD(yyyy, -1, GETDATE()) AS DATE) AS LastYear
		,BizDoc.IsPricingCalculate
		,BizDoc.IsDone
		,BizDoc.IsQt, BizDoc.ValueOfWork
		,BizDoc.Date_CCMPrint
   		,BizDoc.Date_ReceiveFromCustomer
		,BizDoc.ConfirmedDate
		,BizDoc.FinishedDate
		,BizDoc.HandoverDate
		,BizDoc.TimeAliveOfQR
		,process.Name AS ProcessName
		,BizDoc.CustomerCodeLC
		,BizDoc.IsFinishLC
		,HopDong.Description AS Description_Hd
		,HopDong.DocNo AS DocNo_HD
		,BizDoc.DocStatusLC, DocStatusLC.Name AS DocNameLC
		,BizDoc.OpenKeepAmount, BizDoc.OpenDeductionAmount
		, BizDoc.AmountRevised, BizDoc.TotalAmountRevisedAddVAT--, BizDoc.ContractType
		, BizDoc.CCMBudgetRowId, BizDoc.IsWebData, BizDoc.IsMaintenance, BizDoc.FileNo, BizDoc.IsExistsDocuments
		, IIF(Pro.Code2 = '', pro.Code, Pro.Code2) AS Code2, IIF(ISNULL(BizDoc.FilePath,'') = '',0,1) AS CheckContract
		, BizDoc.ActivityCode, BizDoc.IsSubContractPay, BizDoc.CusBankAccountNo, BizDoc.CusBankName, BizDoc.ValueByConstructReal
		, BizDoc.TaxCode, BizDoc.DayOfWarranty, BizDoc.Remark2, BizDoc.SignDate, BizDoc.ValueOfWorkAddVAT
		, Task.DocRefNo AS TaskNo, ulist1.FullName AS FullNameM, cls.Name AS ClassName2, procls.Name AS ProjectTypeName, BizDoc.TotalOfValue
		, BizDoc.TotalOfValueAddVAT, BizDoc.IsDiscount, job.Name AS JobName, ac.Name AS ActivityName, BizDoc.ProjectContractType
		, BizDoc.SubContractBeforeValue, IIF(BizDoc.IsSubContractPay = 1, BizDoc.DocNo,ISNULL(IIF(BizDoc.ClassCode2='3', BizDoc.DocNo, PBiz.DocNo), BizDoc.DocNo)) AS HopDongGoc,
		ulist.FullName AS CreateName, BizDoc.EstimatedCompletionDate, BizDoc.IsInvesment, PBiz.DocNo AS BizDocNo, BizDoc.IsSSG,
		IIF(apr.HasME = 1, 'ME', 'XD') AS TypeMEXD, BizDoc.NumberCol1, BizDoc.NumberCol8, BizDoc.NumberCol9
		, BizDoc.BillStatus, BizDoc.IsEcontract, BizDoc.TransType
		, IIF(BizDoc.TransType = '01', N'Có','') AS IsBTT, jo.Name AS PositionName, BizDoc.NumberCol2, BizDoc.NumberCol3
		, BizDoc.NumberCol4
		, BizDoc.NumberCol5
		, BizDoc.NumberCol6
		, BizDoc.NumberCol7, BizDoc.Date_Liquidation, BizDoc.NumDayApprove, BizDoc.NumDayPayment
		, duyetcuoi.EmployeeNameApproved, BizDoc.LastDocNo, NK.DocNo AS DocNoNK, BizDoc.IsGiftItem
		--, ISNULL(ter.Name, '') AS TerritoryName
FROM dbo.B30BizDoc AS BizDoc
	LEFT OUTER JOIN B30BizDoc PBiz ON BizDoc.ParentBizDocId = PBiz.BizDocId
    LEFT OUTER JOIN dbo.B20Employee AS Employee ON BizDoc.EmployeeCode = Employee.Code
    LEFT OUTER JOIN dbo.B20Customer AS DmDt ON BizDoc.CustomerCode = DmDt.Code
    LEFT OUTER JOIN vB20HRMOther_JobPositionCCM jo ON BizDoc.Position = jo.Code
	LEFT OUTER JOIN dbo.B30Task task ON BizDoc.TaskId = task.CCMBudgetId
	LEFT OUTER JOIN dbo.B20Product AS Pro ON BizDoc.ProductCostId = Pro.RowId
	LEFT OUTER JOIN dbo.B20Territory AS Territory ON Pro.TerritoryCode = Territory.Code
	LEFT OUTER JOIN B20Class procls ON Pro.ProjectTypeCode = procls.Code AND procls.ParentCode='ProjectType'
    LEFT OUTER JOIN dbo.B00DocStatus AS Doc ON BizDoc.DocStatus = Doc.DocStatusKey
    LEFT OUTER JOIN FobPoint ON BizDoc.FobPointCode = FobPoint.Code
    LEFT OUTER JOIN PaymentTerms AS PT ON BizDoc.PaymentTermsCode = PT.Code
    LEFT OUTER JOIN ShipVia ON BizDoc.ShipViaCode = ShipVia.Code
    LEFT OUTER JOIN FreightTerms FT ON BizDoc.FreightTermsCode = FT.Code
    LEFT OUTER JOIN LoanContractType LCT ON BizDoc.LoanContractType = LCT.Code
    LEFT OUTER JOIN B20Dept Dept ON BizDoc.DeptCode = Dept.Code
	LEFT OUTER JOIN B20Class dmloai1 ON BizDoc.UploadFile = dmloai1.Code AND dmloai1.ParentCode = 'UploadFile'
	LEFT OUTER JOIN B20Class cls ON BizDoc.ClassCode2 = cls.Code AND cls.ParentCode='LoaiTrinhKy'
	LEFT OUTER JOIN B20Item dmvt ON BizDoc.ItemGroupCode = dmvt.Code
	LEFT OUTER JOIN DocStatusLC DocStatusLC ON BizDoc.DocStatusLC = DocStatusLC.Code
	LEFT OUTER JOIN B20Process process ON BizDoc.ProcessCode = process.Code
	--LEFT OUTER JOIN dbo.B20Territory ter ON pro.TerritoryCode = ter.Code
    OUTER APPLY
    (
		SELECT	BizDocId, SUM(Amount) AS Amount, SUM(OriginalAmount) AS OriginalAmount,
				SUM(Amount3) AS Amount3, SUM(OriginalAmount3) AS OriginalAmount3, SUM(PaymentAmount) AS PaymentAmount,
				MIN(EstimatedTimeDelivery) AS EstimatedTimeDelivery,
				MAX(EstimatedTimeDelivery) AS EstimatedTimeDelivery2,
				COUNT(DISTINCT EstimatedTimeDelivery) AS DateDiff_MinMax
        FROM dbo.B30BizDocDetail
        WHERE BizDocId = BizDoc.BizDocId
        GROUP BY BizDocId
    ) AS detail
    OUTER APPLY
    (
		SELECT BizDocId, SUM(DiscountAmount) AS DiscountAmount
        FROM dbo.B30BizDocTradeDiscount
        WHERE BizDocId = BizDoc.BizDocId
        GROUP BY BizDocId
    ) AS disc
	--OUTER APPLY
	--(
	--	SELECT STUFF((SELECT ',' + dmloai.Name
	--					FROM dbo.B20Class dmloai
	--					WHERE CHARINDEX(Code, BizDoc.Phan_Phoi) > 0 AND dmloai.ParentCode = 'PhanPhoi'
	--					FOR XML PATH('')), 1, 1, '') AS Phan_Phoi
	--) AS pp
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
		-- 1 lần đọc thay cho FinishDate, FinishDateCHT, DateSend, t, nd, me
		-- LEFT JOIN + MAX bỏ NULL cho cùng kết quả với INNER JOIN cũ
		SELECT IIF(BizDoc.CompletedApprove = 1, MAX(DATEADD(hh, 7, ap.FinishDate)), NULL) AS FinishDate,
			   MAX(IIF(ap.ApproveGroup = 1, DATEADD(hh, 7, ap.FinishDate), NULL)) AS FinishDateCHT,
			   IIF(BizDoc.ApproveSend = 1, MAX(DATEADD(hh, 7, ap.DateSend)), NULL) AS DateSend,
			   MAX(nvSend.Name) AS EmployeeNameSend,
			   MAX(nvEmp.Name) AS EmployeeNameApprove,
			   MAX(IIF(ap.PositionCode = 'CB-030', 1, 0)) AS HasME
		FROM dbo.B30BizDocApprove ap
			LEFT JOIN dbo.B20Employee nvSend ON ap.EmployeeCodeSend = nvSend.Code
			LEFT JOIN dbo.B20Employee nvEmp ON ap.EmployeeCode = nvEmp.Code
		WHERE BizDoc.BizDocId = ap.BizDocId
	) apr
	OUTER APPLY
	(
		SELECT TOP 1 nv.Name AS EmployeeNameApproved
		FROM dbo.B30BizDocApprove ap INNER JOIN dbo.B20Employee nv ON ap.EmployeeCodeApprove = nv.Code
		WHERE BizDoc.BizDocId = ap.BizDocId AND BizDoc.CompletedApprove = 1
		ORDER BY ap.BuiltinOrder DESC
	) duyetcuoi
	LEFT OUTER JOIN B20Class dmloai ON BizDoc.ClassCode1 = dmloai.Code AND dmloai.ParentCode = 'BizDocPOType'
	LEFT OUTER JOIN B20Customer nvc ON BizDoc.CustomerCode2 = nvc.Code
	LEFT OUTER JOIN dbo.B00UserList ulist ON BizDoc.CreatedBy = ulist.Id
	LEFT OUTER JOIN dbo.B00UserList ulist1 ON BizDoc.ModifiedBy = ulist1.Id
	LEFT OUTER JOIN HopDong ON BizDoc.ParentBizDocId = HopDong.BizDocId
	LEFT OUTER JOIN dbo.B20Job job ON BizDoc.JobCode = job.Code
	LEFT OUTER JOIN dbo.B20Activity ac ON BizDoc.ActivityCode = ac.Code
	LEFT OUTER JOIN
		(
			-- Phiếu nhập kho của PO đã được CHT duyệt (ApproveGroup = 1 có FinishDate)
			SELECT Ct.BizDocId_PO, Ct.DocNo
			FROM dbo.B30AccDocEquip Ct
			WHERE Ct.IsActive = 1
				AND EXISTS (SELECT 1 FROM dbo.B30BizDocApprove da WHERE da.BizDocId = Ct.Stt AND da.ApproveGroup = 1 AND da.FinishDate IS NOT NULL)
			GROUP BY Ct.BizDocId_PO, Ct.DocNo
		) NK ON BizDoc.BizDocId = NK.BizDocId_PO
--WHERE BizDoc.CustomerCode NOT IN ('SI-05337')
GO
