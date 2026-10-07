/* =============================================================================
   Module : Hồ sơ đã duyệt (route /main/hosodaduyet/index)
   File   : 01_usp_NEW_HoSoDaDuyet.sql
   Mô tả  : Danh sách các bước duyệt mà người đăng nhập ĐÃ DUYỆT (ApproveStatus = '1',
            EmployeeCodeApprove = người duyệt), kèm link mở màn approved* ở chế độ chỉ xem.

   Nguồn logic: usp_Coteccons_ApproveNotifications_New (bản 2026-10-01)
     - cùng các bảng hồ sơ ghép với B30BizDocApprove theo BizDocId,
     - cùng bảng ánh xạ DocCode -> _LinkCommandWeb, nhưng KHÔNG xét ApproveSend
       (hồ sơ bị trả về sau khi mình duyệt vẫn mở màn approved* để xem),
     - Id trả về = B30BizDocApprove.Id của bước mình duyệt (màn approved* nạp theo Id này);
       riêng TO (B30TotalBudget) dùng Id hồ sơ như SP gốc.
   Khác SP gốc: chỉ SELECT, không UPDATE/INSERT danh mục, không ghi bảng BackGround.

   Hiệu năng: IX_B30BizDocApprove_EmployeeCodeApprove đang DISABLED (kiểm tra 06/10/2026)
   nên bước 1 quét B30BizDocApprove (~0,9 triệu dòng). Khoảng ngày bị giới hạn tối đa 366 ngày.
   Không tự tạo / rebuild index trong script này (cần DBA đánh giá ảnh hưởng tốc độ ghi).

   Ngày giờ: FinishDate / StartDate lưu UTC -> lọc và trả về theo giờ VN (+7).
   ============================================================================= */
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROC dbo.usp_NEW_HoSoDaDuyet
	@_EmployeeCode NVARCHAR(16) = N'',
	@_BranchCode CHAR(3) = 'N01',
	@_ProductCostId VARCHAR(16) = '',		-- '' = mọi gói thầu
	@_DocDate1 DATE = NULL,					-- ngày duyệt từ (giờ VN), mặc định 3 tháng trước
	@_DocDate2 DATE = NULL,					-- ngày duyệt đến (giờ VN), mặc định hôm nay
	@_UserId INT = -1						-- giữ cùng chữ ký với usp_Coteccons_ApproveNotifications
AS
BEGIN
	SET NOCOUNT ON;

	SELECT @_EmployeeCode = LTRIM(RTRIM(ISNULL(@_EmployeeCode, N''))),
		   @_BranchCode = ISNULL(@_BranchCode, ''),
		   @_ProductCostId = ISNULL(@_ProductCostId, '')

	IF @_EmployeeCode = N'' RETURN;

	IF @_DocDate2 IS NULL SET @_DocDate2 = CAST(DATEADD(HOUR, 7, GETUTCDATE()) AS DATE);
	IF @_DocDate1 IS NULL SET @_DocDate1 = DATEADD(MONTH, -3, @_DocDate2);
	IF @_DocDate1 > @_DocDate2 SET @_DocDate1 = @_DocDate2;
	IF DATEDIFF(DAY, @_DocDate1, @_DocDate2) > 366 SET @_DocDate1 = DATEADD(DAY, -366, @_DocDate2);

	DECLARE @_FromUtc DATETIME = DATEADD(HOUR, -7, CAST(@_DocDate1 AS DATETIME)),
			@_ToUtc DATETIME = DATEADD(HOUR, -7, DATEADD(DAY, 1, CAST(@_DocDate2 AS DATETIME)));

	------------------------------------------------------------------------------
	-- 1. Các bước duyệt người này đã duyệt trong kỳ
	------------------------------------------------------------------------------
	IF OBJECT_ID('tempdb..#ap') IS NOT NULL DROP TABLE #ap
	SELECT ap.Id, ap.BizDocId, ap.ApproveGroup, ap.PositionCode, ap.FinishDate, ap.StartDate, ap.EmployeeCodeSend
	INTO #ap
	FROM dbo.B30BizDocApprove ap
	WHERE ap.ApproveStatus = '1'
		  AND ap.EmployeeCodeApprove = @_EmployeeCode
		  AND ap.FinishDate >= @_FromUtc AND ap.FinishDate < @_ToUtc
		  AND ISNULL(NULLIF(ap.BranchCode, ''), @_BranchCode) = @_BranchCode

	IF OBJECT_ID('tempdb..#doc') IS NOT NULL DROP TABLE #doc
	CREATE TABLE #doc (
		BizDocId NVARCHAR(128) COLLATE DATABASE_DEFAULT NOT NULL,
		SrcOrder TINYINT NOT NULL,
		DocCode NVARCHAR(16) COLLATE DATABASE_DEFAULT NULL,
		DocNo NVARCHAR(256) COLLATE DATABASE_DEFAULT NULL,
		ProductCostId NVARCHAR(64) COLLATE DATABASE_DEFAULT NULL,
		CustomerCode NVARCHAR(128) COLLATE DATABASE_DEFAULT NULL,
		Description NVARCHAR(MAX) COLLATE DATABASE_DEFAULT NULL,
		ApproveSend BIT NULL,
		CompletedApprove BIT NULL,
		ItemGroupCode NVARCHAR(64) COLLATE DATABASE_DEFAULT NULL,
		PayTeamType NVARCHAR(16) COLLATE DATABASE_DEFAULT NULL,
		IdDoc INT NULL
	);

	IF NOT EXISTS (SELECT 1 FROM #ap) GOTO _OUTPUT

	CREATE INDEX IX_ap_BizDocId ON #ap (BizDocId);

	------------------------------------------------------------------------------
	-- 2. Thông tin hồ sơ: cùng các bảng nguồn với usp_Coteccons_ApproveNotifications_New
	------------------------------------------------------------------------------
	INSERT INTO #doc
	SELECT biz.BizDocId, 1, biz.DocCode, biz.DocNo, biz.ProductCostId, biz.CustomerCode, biz.Description,
		   biz.ApproveSend, biz.CompletedApprove, biz.ItemGroupCode, biz.PayTeamType, biz.Id
	FROM dbo.B30BizDoc biz
	WHERE biz.BizDocId IN (SELECT BizDocId FROM #ap) AND biz.IsActive = 1

	INSERT INTO #doc
	SELECT bud.Stt, 2, bud.DocCode, bud.DocNo, bud.ProductCostId, 'HT001', N'',
		   bud.ApproveSend, bud.CompletedApprove, '', '', bud.Id
	FROM dbo.B30Budget bud
	WHERE bud.Stt IN (SELECT BizDocId FROM #ap) AND bud.IsActive = 1

	INSERT INTO #doc
	SELECT bud.CCMBudgetId, 3, bud.DocCode, bud.DocNo, bud.ProductCostId, 'HT001', N'',
		   bud.ApproveSend, bud.CompletedApprove, '', '', bud.Id
	FROM dbo.B30TotalBudget bud
	WHERE bud.CCMBudgetId IN (SELECT BizDocId FROM #ap) AND bud.IsActive = 1

	INSERT INTO #doc
	SELECT ccm.BizDocId, 4, ccm.DocCode, ccm.DocNo, ccm.ProductCostId, ccm.CustomerCode, ISNULL(j.Name, N''),
		   ccm.ApproveSend, ccm.CompletedApprove, '', ccm.PayTeamType, ccm.Id
	FROM dbo.B30BizDocCCM ccm
		 LEFT OUTER JOIN dbo.B20Job j ON j.Code = ccm.JobCode
	WHERE ccm.BizDocId IN (SELECT BizDocId FROM #ap) AND ccm.IsActive = 1

	INSERT INTO #doc
	SELECT bud.CCMBudgetId, 5, bud.DocCode, bud.DocNo, bud.ProductCostId, bud.CustomerCode, N'',
		   bud.ApproveSend, bud.CompletedApprove, '', '', bud.Id
	FROM dbo.B30CCMBudget bud
	WHERE bud.CCMBudgetId IN (SELECT BizDocId FROM #ap) AND bud.IsActive = 1

	INSERT INTO #doc
	SELECT acc.Stt, 6, acc.DocCode, acc.DocNo, acc.ProductCostId1, acc.CustomerCode, acc.Description,
		   acc.ApproveSend, acc.CompletedApprove, acc.ItemGroupCode, '', acc.Id
	FROM dbo.vB30AccDoc_EditPurchaseWeb acc
	WHERE acc.Stt IN (SELECT BizDocId FROM #ap) AND acc.IsActive = 1 AND acc.DocCode = 'NH'

	INSERT INTO #doc
	SELECT vb.BizDocId, 7, vb.DocCode, vb.DocNo, IIF(vb.DocCode = 'O1', vb.ProductCostId0, vb.ProductCostId),
		   vb.CustomerCode, vb.Description, vb.ApproveSend, vb.CompletedApprove, '', '', vb.Id
	FROM dbo.B30BizDocVB vb
	WHERE vb.BizDocId IN (SELECT BizDocId FROM #ap) AND vb.IsActive = 1

	INSERT INTO #doc
	SELECT task.CCMBudgetId, 8, task.DocCode, task.DocRefNo, task.ProductCostId, task.CustomerCode, task.Subject,
		   task.ApproveSend, task.CompletedApprove, '', '', task.Id
	FROM dbo.B30Task task
	WHERE task.CCMBudgetId IN (SELECT BizDocId FROM #ap) AND task.IsActive = 1

	INSERT INTO #doc
	SELECT cl.Stt, 9, cl.DocCode, cl.ClaimNo, cl.ProductCostId, '', cl.Description,
		   cl.ApproveSend, cl.CompletedApprove, '', '', cl.Id
	FROM dbo.B30Claim cl
	WHERE cl.Stt IN (SELECT BizDocId FROM #ap) AND cl.IsActive = 1

	INSERT INTO #doc
	SELECT acc.Stt, 10, acc.DocCode, acc.DocNo, 'PROD001636', '', acc.Description,
		   acc.ApproveSend, acc.CompletedApprove, acc.ItemGroupCode, '', acc.Id
	FROM dbo.B30AccDoc acc
	WHERE acc.Stt IN (SELECT BizDocId FROM #ap) AND acc.IsActive = 1 AND acc.DocCode IN ('BN','GN')

	INSERT INTO #doc
	SELECT acc.Stt, 11, acc.DocCode, acc.DocNo, acc.ProductCostId, '', acc.Description,
		   acc.ApproveSend, acc.CompletedApprove, acc.ItemGroupCode, '', acc.Id
	FROM dbo.B30AccDocEquip acc
	WHERE acc.Stt IN (SELECT BizDocId FROM #ap) AND acc.IsActive = 1 AND acc.DocCode IN ('N3','X3')

	INSERT INTO #doc
	SELECT acc.EquiBudgetId, 12, acc.DocCode, acc.DocNo, acc.ProductCostId, '', acc.Description,
		   acc.ApproveSend, acc.CompletedApprove, '', '', acc.Id
	FROM dbo.B30EquiBudget acc
	WHERE acc.EquiBudgetId IN (SELECT BizDocId FROM #ap) AND acc.IsActive = 1

	INSERT INTO #doc
	SELECT acc.BizDocId, 13, acc.DocCode, '', acc.ProductCostId, '', acc.Description,
		   acc.ApproveSend, acc.CompletedApprove, '', '', acc.Id
	FROM dbo.B30HSQT acc
	WHERE acc.BizDocId IN (SELECT BizDocId FROM #ap) AND acc.IsActive = 1

	INSERT INTO #doc
	SELECT acc.BizDocId, 14, acc.DocCode, acc.DocNo, acc.ProductCostId, '', acc.Description,
		   acc.ApproveSend, acc.CompletedApprove, '', '', acc.Id
	FROM dbo.B30ConsPermit acc
	WHERE acc.BizDocId IN (SELECT BizDocId FROM #ap) AND acc.IsActive = 1

	------------------------------------------------------------------------------
	-- 3. Kết quả
	------------------------------------------------------------------------------
_OUTPUT:

	;WITH d AS (
		-- Phòng khi cùng BizDocId xuất hiện ở nhiều bảng: lấy theo thứ tự nguồn như SP gốc
		SELECT *, ROW_NUMBER() OVER (PARTITION BY BizDocId ORDER BY SrcOrder) AS _Rn
		FROM #doc
	)
	SELECT IIF(d.DocCode = 'TO', d.IdDoc, ap.Id) AS Id,
		   ap.Id AS ApproveId,
		   d.IdDoc,
		   ap.BizDocId,
		   d.DocCode,
		   CASE WHEN d.DocCode = 'K2' AND dmgt.ProductType IN ('2','3') THEN N'Dự toán chi phí văn phòng'
				WHEN d.DocCode = 'TO' THEN N'Tổng hợp đề xuất thanh toán'
				WHEN d.DocCode = 'LC' THEN N'Hợp đồng tiền gửi'
				ELSE ISNULL(ct.Ten_Ct, d.DocCode)
		   END AS Ten_Ct,
		   d.DocNo,
		   d.ProductCostId,
		   COALESCE(dmgt.Name, prj.Name, d.ProductCostId) AS ProductName,
		   dmdt.Name AS CustomerName,
		   d.Description,
		   ap.ApproveGroup,
		   ap.PositionCode,
		   DATEADD(HOUR, 7, ap.FinishDate) AS FinishDate,
		   DATEADD(HOUR, 7, ap.StartDate) AS StartDate,
		   CAST(IIF(ap.StartDate IS NOT NULL AND ap.FinishDate > ap.StartDate, 1, 0) AS BIT) AS IsLate,
		   nvs.Name AS EmployeeNameSend,
		   d.ApproveSend,
		   d.CompletedApprove,
		   CASE WHEN d.CompletedApprove = 1 THEN N'Đã hoàn thiện duyệt'
				WHEN d.ApproveSend = 1 THEN N'Đang trong quy trình duyệt'
				ELSE N'Đã trả lại / chưa gửi duyệt'
		   END AS DocStatusName,
		   CASE
				WHEN d.DocCode = 'K1' THEN '/main/approvedplansigncon/detail'
				WHEN d.DocCode = 'K2' THEN '/main/approvedplancostrevcons/detail'
				WHEN d.DocCode = 'S2' THEN '/main/approvedplansetlement/detail'
				WHEN d.DocCode = 'H3' THEN '/main/approvedsupportlltc/detail'
				WHEN d.DocCode = 'K3' THEN '/main/approvedplanequipcost/detail'
				WHEN d.DocCode = 'K4' THEN '/main/approvedcostdeduction/detail'
				WHEN d.DocCode = 'K5' THEN '/main/approvedplanlossdetail/detail'
				WHEN d.DocCode = 'K6' THEN '/main/approvedplancashflowsite/detail'
				WHEN d.DocCode = 'KD' THEN '/main/approvedplanrevenueadjust/detail'
				WHEN d.DocCode = 'K7' THEN '/main/approvedplanaftersales/detail'
				WHEN d.DocCode = 'K8' THEN '/main/approvedplanquantity/detail'
				WHEN d.DocCode = 'M6' THEN '/main/approvedplanquantity2/detail'
				WHEN d.DocCode = 'K9' AND ap.PositionCode IN ('CB-077') THEN '/main/approvedpaymentproposalgddh/detail'
				WHEN d.DocCode = 'K9' THEN '/main/approvedpaymentproposal/detail'
				WHEN d.DocCode = 'C2' THEN '/main/approvedcontractinvestor/detail'
				WHEN d.DocCode = 'C3' THEN '/main/approvedcontract/detailc3'
				WHEN d.DocCode = 'LC' THEN '/main/approveddepositcontract/detail'
				WHEN d.DocCode = 'C4' THEN '/main/approvedcontract/detailc4'
				WHEN d.DocCode = 'C5' THEN '/main/approvedsettlement/detail'
				WHEN d.DocCode = 'C8' THEN '/main/approvedcreditcontract/detail'
				WHEN d.DocCode = 'P2' THEN '/main/approvedbillpayteam/detail'
				WHEN d.DocCode = 'P3' THEN '/main/approvedbillpaydept/detail'
				WHEN d.DocCode = 'P4' THEN '/main/approvedbillpaysupp/detail'
				WHEN d.DocCode = 'P5' AND d.PayTeamType IN ('02') THEN '/main/approvedallocsettlement/detail'
				WHEN d.DocCode = 'P5' THEN '/main/approvedbillpayequipment/detail'
				WHEN d.DocCode = 'P6' THEN '/main/approvedbillinternalequip/detail'
				WHEN d.DocCode = 'S1' THEN '/main/approvedsettlementrecords/detail'
				WHEN d.DocCode = 'PO' AND d.ItemGroupCode = 'THEP' THEN '/main/approvedpurchaseorder/detail'
				WHEN d.DocCode = 'PO' AND d.ItemGroupCode = 'BETONG' THEN '/main/approvedsolpoconcrete/detail'
				WHEN d.DocCode = 'PO' THEN '/main/approvedpurchaseotherorder/detail'
				WHEN d.DocCode = 'P8' THEN '/main/approvedauxiliarymaterialsorder/detail'
				WHEN d.DocCode = 'N3' AND d.ItemGroupCode = 'BETONG' THEN '/main/approvedimsolpoconcrete/detail'
				WHEN d.DocCode = 'N3' AND d.ItemGroupCode = 'VTPHU' THEN '/main/approvedimauxiliarysupplies/detail'
				WHEN d.DocCode = 'N3' AND d.ItemGroupCode = 'THEP' THEN '/main/approvedsolpn/detail'
				WHEN d.DocCode = 'N3' THEN '/main/approvedimwarematerials/detail'
				WHEN d.DocCode = 'X3' AND d.ItemGroupCode = 'VTPHU' THEN '/main/approvedexauxiliarysupplies/detail'
				WHEN d.DocCode = 'X3' AND d.ItemGroupCode = 'THEP' THEN '/main/approvedsolpx/detail'
				WHEN d.DocCode = 'X3' THEN '/main/approvedexwarematerials/detail'
				WHEN d.DocCode = 'PP' THEN '/main/approvedsolpp/detail'
				WHEN d.DocCode = 'NH' THEN '/main/approvedpurchasingnote/detail'
				WHEN d.DocCode = 'H2' THEN '/main/approvedpurchasebudget/detail'
				WHEN d.DocCode = 'H7' THEN '/main/approvedpurchaseotherbudget/detail'
				WHEN d.DocCode = 'H9' THEN '/main/approvedconcretebudget/detail'
				WHEN d.DocCode = 'L2' THEN '/main/approvedauxiliarymaterialsbuget/detail'
				WHEN d.DocCode = 'H8' THEN '/main/approvedmaterialusagestatus/detail'
				WHEN d.DocCode = 'CL' THEN '/main/approvedplanclaim/detail'
				WHEN d.DocCode = 'C7' THEN '/main/approvedsettlementclaim/detail'
				WHEN d.DocCode = 'V1' AND ap.PositionCode IN ('CB-103','CB-133') THEN '/main/approvedinternalsysdocument/detail'
				WHEN d.DocCode = 'V1' THEN '/main/approvedinternaldocument/detail'
				WHEN d.DocCode = 'V2' THEN '/main/approvedregisteremail/detail'
				WHEN d.DocCode = 'V8' THEN '/main/approvedcancelregistrationemail/detail'
				WHEN d.DocCode = 'V9' THEN '/main/approvedspendingplan/detail'
				WHEN d.DocCode = 'A1' THEN '/main/approvedproposalrevenueexpen/detail'
				WHEN d.DocCode = 'A2' THEN '/main/approvedproposalquarterly/detail'
				WHEN d.DocCode = 'I1' THEN '/main/approvedincurred/detail'
				WHEN d.DocCode = 'I3' THEN '/main/approvedregisterincurred/detail'
				WHEN d.DocCode = 'TT' THEN '/main/approvedinvesttask/detail'
				WHEN d.DocCode = 'MS' THEN '/main/approvedbuyingtask/detail'
				WHEN d.DocCode = 'GU' THEN '/main/approvedguaranteetask/detail'
				WHEN d.DocCode = 'G1' THEN '/main/approveddeposittask/detail'
				WHEN d.DocCode = 'G3' THEN '/main/approvedfalnloctask/detail'
				WHEN d.DocCode = 'V3' THEN '/main/approvedconfirmprofile/detail'
				WHEN d.DocCode = 'V4' THEN '/main/approveddocumentary/detail'
				WHEN d.DocCode = 'V5' THEN '/main/approvedexaminationrecords/detail'
				WHEN d.DocCode = 'V6' THEN '/main/approvedsafepunish/detail'
				WHEN d.DocCode = 'M4' THEN '/main/approvedequibudgetm4/detail'
				WHEN d.DocCode = 'M5' THEN '/main/approvedequibudgetm5/detail'
				WHEN d.DocCode = 'V7' THEN '/main/approveddocaftersales/detail'
				WHEN d.DocCode IN ('BN','GN') THEN '/main/approvedunc/detail'
				WHEN d.DocCode = 'TU' THEN '/main/approvedrequestsadvances/detail'
				WHEN d.DocCode = 'HU' THEN '/main/approvedrequestsreimbursement/detail'
				WHEN d.DocCode = 'L1' THEN '/main/approvedliquidationasset/detail'
				WHEN d.DocCode = 'FR' THEN '/main/approvedprofiledocument/detail'
				WHEN d.DocCode = 'TO' THEN '/main/paymentproposaltotal/detail'
				WHEN d.DocCode = 'A5' THEN '/main/approvedtenderselection/detail'
				WHEN d.DocCode = 'D3' THEN '/main/approvedconcreteloss/detail'
				WHEN d.DocCode = 'D4' THEN '/main/approvedsteelloss/detail'
				WHEN d.DocCode = 'O1' THEN '/main/approvedpartnerevaluation/detail'
				WHEN d.DocCode = 'O2' THEN '/main/approvedconfirmprojectcomplete/detail'
				WHEN d.DocCode = 'E2' THEN '/main/approvedregisteruser/detail'
				WHEN d.DocCode = 'E1' THEN '/main/approvedpaymentextraproposal/detail'
				WHEN d.DocCode = 'PS' THEN '/main/approvedsubconincurred/detail'
				ELSE ''
		   END AS _LinkCommandWeb
	FROM #ap ap
		 INNER JOIN d ON d.BizDocId = ap.BizDocId AND d._Rn = 1
		 LEFT OUTER JOIN dbo.B00DmCt ct ON ct.Ma_Ct = d.DocCode
		 LEFT OUTER JOIN dbo.B20Product dmgt ON dmgt.RowId = d.ProductCostId
		 LEFT OUTER JOIN dbo.B20Project prj ON prj.RowId = d.ProductCostId
		 LEFT OUTER JOIN dbo.B20Customer dmdt ON dmdt.Code = d.CustomerCode
		 LEFT OUTER JOIN dbo.B20Employee nvs ON nvs.Code = ap.EmployeeCodeSend
	WHERE (d.ProductCostId = @_ProductCostId OR @_ProductCostId = '')
	ORDER BY ap.FinishDate DESC
END
GO

/* Kiểm tra (chỉ đọc):
EXEC dbo.usp_NEW_HoSoDaDuyet @_EmployeeCode = N'16980421', @_DocDate1 = '20260901', @_DocDate2 = '20261006';
*/

/* Rollback:
DROP PROC IF EXISTS dbo.usp_NEW_HoSoDaDuyet;
*/
