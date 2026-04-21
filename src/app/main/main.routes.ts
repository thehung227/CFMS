import { Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { PermissionResolve } from '../base/resolver';

export const mainRoutes: Routes = [
    {
        // localhost:8888/main
        path: '', component: MainComponent,
        children: [
            // localhost:8888/main
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            // localhost:8888/main/home
            { path: 'home', loadChildren: './home/home.module#HomeModule' },
            // localhost:8888/main/plansigncon
            { path: 'plansigncon', loadChildren: './plansigncon/plansigncon.module#PlanSignConModule' },
            { path: 'planquantity', loadChildren: './planquantity/planquantity.module#PlanQuantityModule' },
            { path: 'planupdate', loadChildren: './planupdate/planupdate.module#PlanUpdateModule' },
            { path: 'approvedplanquantity', loadChildren: './approvedplanquantity/approvedplanquantity.module#ApprovedPlanQuantityModule' },
            { path: 'approvedtenderselection', loadChildren: './approvedtenderselection/approvedtenderselection.module#ApprovedTenderSelectionModule' },
            { path: 'approvedunc', loadChildren: './approvedunc/approvedunc.module#ApprovedUNCModule' },
            // localhost:8888/main/approvedplansigncon
            { path: 'approvedplansigncon', loadChildren: './approvedplansigncon/approvedplansigncon.module#ApprovedPlanSignConModule' },
            { path: 'approvedplancashflowsite', loadChildren: './approvedplancashflowsite/approvedplancashflowsite.module#ApprovedPlanCashFlowSiteModule' },
            // localhost:8888/main/plancostrevcons
            { path: 'investtask', loadChildren: './investtask/investtask.module#InvestTaskModule' },
            { path: 'spendingplan', loadChildren: './spendingplan/spendingplan.module#SpendingPlanModule' },
            { path: 'proposalrevenueexpen', loadChildren: './proposalrevenueexpen/proposalrevenueexpen.module#ProposalRevenueExpenModule' },
            { path: 'approvedproposalrevenueexpen', loadChildren: './approvedproposalrevenueexpen/approvedproposalrevenueexpen.module#ApprovedProposalRevenueExpenModule' },
            { path: 'proposalquarterly', loadChildren: './proposalquarterly/proposalquarterly.module#ProposalQuarterlyModule' },
            { path: 'approvedspendingplan', loadChildren: './approvedspendingplan/approvedspendingplan.module#ApprovedSpendingPlanModule' },
            { path: 'tenderselection', loadChildren: './tenderselection/tenderselection.module#TenderSelectionModule' },
            { path: 'supportlltc', loadChildren: './supportlltc/supportlltc.module#SupportLLTCModule' },
            { path: 'buyingtask', loadChildren: './buyingtask/buyingtask.module#BuyingTaskModule' },
            { path: 'guaranteetask', loadChildren: './guaranteetask/guaranteetask.module#GuaranteeTaskModule' },
            { path: 'guaranteetaskatch', loadChildren: './guaranteetaskatch/guaranteetaskatch.module#GuaranteeTaskAtchModule' },
            { path: 'billinvestor', loadChildren: './billinvestor/billinvestor.module#BillInvestorModule' },
            { path: 'deposittask', loadChildren: './deposittask/deposittask.module#DepositTaskModule' },
            { path: 'falnloctask', loadChildren: './falnloctask/falnloctask.module#FalnLocTaskModule' },
            { path: 'confirmprofile', loadChildren: './confirmprofile/confirmprofile.module#ConfirmProfileModule' },
            { path: 'unc', loadChildren: './unc/unc.module#UNCModule' },

            { path: 'plancostrevcons', loadChildren: './plancostrevcons/plancostrevcons.module#PlanCostRevConsModule' },
            { path: 'planpayment', loadChildren: './planpayment/planpayment.module#PlanPaymentModule' },
            { path: 'financialreport', loadChildren: './financialreport/financialreport.module#FinancialReportModule' },

            { path: 'internaldocument', loadChildren: './internaldocument/internaldocument.module#InternalDocumentModule' },
            { path: 'profiledocument', loadChildren: './profiledocument/profiledocument.module#ProfileDocumentModule' },

            { path: 'regcontractinvestor', loadChildren: './regcontractinvestor/regcontractinvestor.module#RegContractInvestorModule' },
            { path: 'regcontractccminvestor', loadChildren: './regcontractccminvestor/regcontractccminvestor.module#RegContractCcmInvestorModule' },
            { path: 'regcontractattach', loadChildren: './regcontractattach/regcontractattach.module#RegContractAttachModule' },
            { path: 'regcontractinvestorview', loadChildren: './regcontractinvestorview/regcontractinvestorview.module#RegContractInvestorViewModule' },
            { path: 'regcontractmaintenance', loadChildren: './regcontractmaintenance/regcontractmaintenance.module#RegContractMaintenanceModule' },
            { path: 'registeremail', loadChildren: './registeremail/registeremail.module#RegisterEmailModule' },
            { path: 'approvedregisteremail', loadChildren: './approvedregisteremail/approvedregisteremail.module#ApprovedRegisterEmailModule' },
            { path: 'registeruser', loadChildren: './registeruser/registeruser.module#RegisterUserModule' },
            { path: 'approvedregisteruser', loadChildren: './approvedregisteruser/approvedregisteruser.module#ApprovedRegisterUserModule' },
            { path: 'cancelregistrationemail', loadChildren: './cancelregistrationemail/cancelregistrationemail.module#CancelRegistrationEmailModule' },
            { path: 'approvedcancelregistrationemail', loadChildren: './approvedcancelregistrationemail/approvedcancelregistrationemail.module#ApprovedCancelRegistrationEmailModule' },
            { path: 'liquidationasset', loadChildren: './liquidationasset/liquidationasset.module#LiquidationAssetModule' },
            { path: 'documentary', loadChildren: './documentary/documentary.module#DocumentaryModule' },
            { path: 'examinationrecords', loadChildren: './examinationrecords/examinationrecords.module#ExaminationRecordsModule' },
            { path: 'lettertopartner', loadChildren: './lettertopartner/lettertopartner.module#LetterToPartnerModule' },
            { path: 'requestsadvances', loadChildren: './requestsadvances/requestsadvances.module#RequestsAdvancesModule' },
            { path: 'requestsreimbursement', loadChildren: './requestsreimbursement/requestsreimbursement.module#RequestsReimbursementModule' },
            { path: 'planequipcost', loadChildren: './planequipcost/planequipcost.module#PlanEquipCostModule' },
            { path: 'planlossdetail', loadChildren: './planlossdetail/planlossdetail.module#PlanLossDetailModule' },
            { path: 'costdeduction', loadChildren: './costdeduction/costdeduction.module#CostDeductionModule' },
            { path: 'docaftersales', loadChildren: './docaftersales/docaftersales.module#DocAfterSalesModule' },
            { path: 'docaftersalesfile', loadChildren: './docaftersalesfile/docaftersalesfile.module#DocAfterSalesFileModule' },
            { path: 'plantimekeeping', loadChildren: './plantimekeeping/plantimekeeping.module#PlanTimeKeepingModule' },
            { path: 'planaftersales', loadChildren: './planaftersales/planaftersales.module#PlanAfterSalesModule' },
            { path: 'approvedplanaftersales', loadChildren: './approvedplanaftersales/approvedplanaftersales.module#ApprovedPlanAfterSalesModule' },
            
            { path: 'approvedinternaldocument', loadChildren: './approvedinternaldocument/approvedinternaldocument.module#ApprovedInternalDocumentModule' },
            { path: 'approvedinternalsysdocument', loadChildren: './approvedinternalsysdocument/approvedinternalsysdocument.module#ApprovedInternalSysDocumentModule' },
            { path: 'approvedsupportlltc', loadChildren: './approvedsupportlltc/approvedsupportlltc.module#ApprovedSupportLLTCModule' },
            { path: 'approvedprofiledocument', loadChildren: './approvedprofiledocument/approvedprofiledocument.module#ApprovedProfileDocumentModule' },
            { path: 'approvedguaranteetask', loadChildren: './approvedguaranteetask/approvedguaranteetask.module#ApprovedGuaranteeTaskModule' },
            { path: 'approvedbillinvestor', loadChildren: './approvedbillinvestor/approvedbillinvestor.module#ApprovedBillInvestorModule' },
            { path: 'approveddeposittask', loadChildren: './approveddeposittask/approveddeposittask.module#ApprovedDepositTaskModule' },
            { path: 'approvedfalnloctask', loadChildren: './approvedfalnloctask/approvedfalnloctask.module#ApprovedFalnLocTaskModule' },
            { path: 'approvedcontractinvestor', loadChildren: './approvedcontractinvestor/approvedcontractinvestor.module#ApprovedContractInvestorModule' },
            { path: 'approvedinvesttask', loadChildren: './approvedinvesttask/approvedinvesttask.module#ApprovedInvestTaskModule' },
            { path: 'approvedbuyingtask', loadChildren: './approvedbuyingtask/approvedbuyingtask.module#ApprovedBuyingTaskModule' },
            { path: 'approvedconfirmprofile', loadChildren: './approvedconfirmprofile/approvedconfirmprofile.module#ApprovedConfirmProfileModule' },
            { path: 'approvedliquidationasset', loadChildren: './approvedliquidationasset/approvedliquidationasset.module#ApprovedLiquidationAssetModule' },
            { path: 'approveddocumentary', loadChildren: './approveddocumentary/approveddocumentary.module#ApprovedDocumentaryModule' },
            { path: 'approvedexaminationrecords', loadChildren: './approvedexaminationrecords/approvedexaminationrecords.module#ApprovedExaminationRecordsModule' },
            { path: 'approvedsettlementrecords', loadChildren: './approvedsettlementrecords/approvedsettlementrecords.module#ApprovedSettlementRecordsModule' },
            { path: 'approvedlettertopartner', loadChildren: './approvedlettertopartner/approvedlettertopartner.module#ApprovedLetterToPartnerModule' },
            { path: 'approvedrequestsadvances', loadChildren: './approvedrequestsadvances/approvedrequestsadvances.module#ApprovedRequestsAdvancesModule' },
            { path: 'approvedrequestsreimbursement', loadChildren: './approvedrequestsreimbursement/approvedrequestsreimbursement.module#ApprovedRequestsReimbursementModule' },
            { path: 'approvedplanequipcost', loadChildren: './approvedplanequipcost/approvedplanequipcost.module#ApprovedPlanEquipCostModule' },
           
            { path: 'approvedplanlossdetail', loadChildren: './approvedplanlossdetail/approvedplanlossdetail.module#ApprovedPlanLossDetailModule' },
            { path: 'approvedcostdeduction', loadChildren: './approvedcostdeduction/approvedcostdeduction.module#ApprovedCostDeductionModule' },
            { path: 'approveddocaftersales', loadChildren: './approveddocaftersales/approveddocaftersales.module#ApprovedDocAfterSalesModule' },
            { path: 'approveddocaftersalessurvay', loadChildren: './approveddocaftersalessurvay/approveddocaftersalessurvay.module#ApprovedDocAfterSalesSurvayModule' },
            { path: 'approvedplantimekeeping', loadChildren: './approvedplantimekeeping/approvedplantimekeeping.module#ApprovedPlanTimeKeepingModule' },

            // localhost:8888/main/approvedplancostrevcons
            { path: 'approvedplancostrevcons', loadChildren: './approvedplancostrevcons/approvedplancostrevcons.module#ApprovedPlanCostRevConsModule' },
            { path: 'approvedplancostoffice', loadChildren: './approvedplancostoffice/approvedplancostoffice.module#ApprovedPlanCostOfficeModule' },
             // localhost:8888/main/plancostoffice
            
              { path: 'plancostoffice', loadChildren: './plancostoffice/plancostoffice.module#PlanCostOfficeModule' },
             { path: 'plancashflowsite', loadChildren: './plancashflowsite/plancashflowsite.module#PlanCashFlowSiteModule' },
             { path: 'paymentproposal', loadChildren: './paymentproposal/paymentproposal.module#PaymentProposalModule' },
              { path: 'paymentextraproposal', loadChildren: './paymentextraproposal/paymentextraproposal.module#PaymentExtraProposalModule' },
             { path: 'paymentmeproposal', loadChildren: './paymentmeproposal/paymentmeproposal.module#PaymentMeProposalModule' },
             { path: 'paymentccmproposal', loadChildren: './paymentccmproposal/paymentccmproposal.module#PaymentCcmProposalModule' },
             
            // localhost:8888/main/contract
            { path: 'contract', loadChildren: './contract/contract.module#ContractModule' },
            // localhost:8888/main/appendix
            { path: 'appendix', loadChildren: './appendix/appendix.module#AppendixModule' },
            // localhost:8888/main/settlement
            { path: 'settlement', loadChildren: './settlement/settlement.module#SettlementModule' },
            { path: 'planclaim', loadChildren: './planclaim/planclaim.module#PlanClaimModule' },
            { path: 'planequipclaim', loadChildren: './planequipclaim/planequipclaim.module#PlanEquipClaimModule' },
            { path: 'settlementclaim', loadChildren: './settlementclaim/settlementclaim.module#SettlementClaimModule' },
            { path: 'planccmclaim', loadChildren: './planccmclaim/planccmclaim.module#PlanCcmClaimModule' },
            { path: 'approvedplanclaim', loadChildren: './approvedplanclaim/approvedplanclaim.module#ApprovedPlanClaimModule' },
            { path: 'approvedsettlementclaim', loadChildren: './approvedsettlementclaim/approvedsettlementclaim.module#ApprovedSettlementClaimModule' },
            { path: 'planclaimvalue', loadChildren: './planclaimvalue/planclaimvalue.module#PlanClaimValueModule' },
            { path: 'partnerevaluation', loadChildren: './partnerevaluation/partnerevaluation.module#PartnerEvaluationModule' },
            { path: 'confirmprojectcomplete', loadChildren: './confirmprojectcomplete/confirmprojectcomplete.module#ConfirmProjectCompleteModule' },
            { path: 'debtcollection', loadChildren: './debtcollection/debtcollection.module#DebtCollectionModule' },
            { path: 'setlementstatus', loadChildren: './setlementstatus/setlementstatus.module#SetlementStatusModule' },
            { path: 'settlementrecords', loadChildren: './settlementrecords/settlementrecords.module#SettlementRecordsModule' },
            { path: 'plansignstatus', loadChildren: './plansignstatus/plansignstatus.module#PlanSignStatusModule' },
            { path: 'deadlineproject', loadChildren: './deadlineproject/deadlineproject.module#DeadlineProjectModule' },
            { path: 'approvedpartnerevaluation', loadChildren: './approvedpartnerevaluation/approvedpartnerevaluation.module#ApprovedPartnerEvaluationModule' },
            { path: 'approvedplansignstatus', loadChildren: './approvedplansignstatus/approvedplansignstatus.module#ApprovedPlanSignStatusModule' },
            { path: 'reporterhsqtgiatri', loadChildren: './reporterhsqtgiatri/reporterhsqtgiatri.module#ReporterHsqtGiatriModule' },
            { path: 'approvedconfirmprojectcomplete', loadChildren: './approvedconfirmprojectcomplete/approvedconfirmprojectcomplete.module#ApprovedConfirmProjectCompleteModule' },
            // localhost:8888/main/settlement_doc
            { path: 'settlement_doc', loadChildren: './settlement_doc/settlement_doc.module#Settlement_DocModule' },            
            // localhost:8888/main/regcontract
            { path: 'regcontract', loadChildren: './regcontract/regcontract.module#RegContractModule' },
            { path: 'reginvestmentcontract', loadChildren: './reginvestmentcontract/reginvestmentcontract.module#RegInvestmentContractModule' },
            // localhost:8888/main/unitprice
            { path: 'unitprice', loadChildren: './unitprice/unitprice.module#UnitPriceModule' },
            { path: 'unitccmprice', loadChildren: './unitccmprice/unitccmprice.module#UnitCcmPriceModule' },
            { path: 'boqinvestor', loadChildren: './boqinvestor/boqinvestor.module#BOQInvestorModule' },
            { path: 'concretebudgetdetail', loadChildren: './concretebudgetdetail/concretebudgetdetail.module#ConcreteBudgetDetailModule' },
            { path: 'boqinvestorclaim', loadChildren: './boqinvestorclaim/boqinvestorclaim.module#BOQInvestorClaimModule' },
            // localhost:8888/main/unitprice_view
            { path: 'unitprice_view', loadChildren: './unitprice_view/unitprice_view.module#UnitPrice_ViewModule' },            
            // localhost:8888/main/billteam
            { path: 'billteam', loadChildren: './billteam/billteam.module#BillTeamModule' },
            // localhost:8888/main/billsupp
            { path: 'billsupp', loadChildren: './billsupp/billsupp.module#BillSuppModule' },
            { path: 'billmain', loadChildren: './billmain/billmain.module#BillMainModule' },
            // localhost:8888/main/billequipment
            { path: 'billequipment', loadChildren: './billequipment/billequipment.module#BillEquipmentModule' },
            { path: 'billeditpayequipment', loadChildren: './billeditpayequipment/billeditpayequipment.module#BillEditPayEquipmentModule' },
            { path: 'billinvesment', loadChildren: './billinvesment/billinvesment.module#BillInvesmentModule' },
            // localhost:8888/main/billpayteam
            { path: 'billpayteam', loadChildren: './billpayteam/billpayteam.module#BillPayTeamModule' },
            // localhost:8888/main/billpaysupp
            { path: 'billpaysupp', loadChildren: './billpaysupp/billpaysupp.module#BillPaySuppModule' },
            { path: 'billpaysuppedit', loadChildren: './billpaysuppedit/billpaysuppedit.module#BillPaySuppEditModule' },
            
            { path: 'billpaysuppattach', loadChildren: './billpaysuppattach/billpaysuppattach.module#BillPaySuppAttachModule' },
            { path: 'settlementattach', loadChildren: './settlementattach/settlementattach.module#SettlementAttachModule' },
            
            { path: 'equibudgetm4', loadChildren: './equibudgetm4/equibudgetm4.module#EquiBudgetM4Module' },
            { path: 'equibudgetm5', loadChildren: './equibudgetm5/equibudgetm5.module#EquiBudgetM5Module' },
            { path: 'billpaysupp_view', loadChildren: './billpaysupp_view/billpaysupp_view.module#BillPaySupp_ViewModule' },
            { path: 'billpaybuilding', loadChildren: './billpaybuilding/billpaybuilding.module#BillPayBuildingModule' },
            { path: 'billpaymain', loadChildren: './billpaymain/billpaymain.module#BillPayMainModule' },
            // localhost:8888/main/billpaydept
            { path: 'billpaydept', loadChildren: './billpaydept/billpaydept.module#BillPayDeptModule' },
            { path: 'billeditpaydept', loadChildren: './billeditpaydept/billeditpaydept.module#BillEditPayDeptModule' },
            { path: 'billeditpayteam', loadChildren: './billeditpayteam/billeditpayteam.module#BillEditPayTeamModule' },
            { path: 'billewi', loadChildren: './billewi/billewi.module#BillEwiModule' },
            { path: 'approvedbillewi', loadChildren: './approvedbillewi/approvedbillewi.module#ApprovedBillEwiModule' },
            { path: 'billinternalequip', loadChildren: './billinternalequip/billinternalequip.module#BillInternalEquipModule' },
            { path: 'planstaffcost', loadChildren: './planstaffcost/planstaffcost.module#PlanStaffCostModule' },
            { path: 'planprojectinex', loadChildren: './planprojectinex/planprojectinex.module#PlanProjectInExModule' },
            { path: 'pricelibrary', loadChildren: './pricelibrary/pricelibrary.module#PriceLibraryModule' },
            // localhost:8888/main/billpayequipment
            { path: 'billpayequipment', loadChildren: './billpayequipment/billpayequipment.module#BillPayEquipmentModule' },
            { path: 'approvedsafepunish', loadChildren: './approvedsafepunish/approvedsafepunish.module#ApprovedSafePunishModule' },
            // localhost:8888/main/billsettlement
            { path: 'billsettlement', loadChildren: './billsettlement/billsettlement.module#BillSettlementModule' },   
            { path: 'billmainlement', loadChildren: './billmainlement/billmainlement.module#BillMainlementModule' },      
            { path: 'mainlement', loadChildren: './mainlement/mainlement.module#MainlementModule' },            
            // localhost:8888/main/approvedcontract
            { path: 'approvedcontract', loadChildren: './approvedcontract/approvedcontract.module#ApprovedContractModule' },
            { path: 'approvedbillinternalequip', loadChildren: './approvedbillinternalequip/approvedbillinternalequip.module#ApprovedBillInternalEquipModule' },
            { path: 'approvedequibudgetm4', loadChildren: './approvedequibudgetm4/approvedequibudgetm4.module#ApprovedEquiBudgetM4Module' },
            { path: 'approvedequibudgetm5', loadChildren: './approvedequibudgetm5/approvedequibudgetm5.module#ApprovedEquiBudgetM5Module' },
             // localhost:8888/main/approvedbillpayteam
            { path: 'approvedbillpayteam', loadChildren: './approvedbillpayteam/approvedbillpayteam.module#ApprovedBillPayTeamModule' },
            { path: 'approvedproposalquarterly', loadChildren: './approvedproposalquarterly/approvedproposalquarterly.module#ApprovedProposalQuarterlyModule' },
            { path: 'approvedpaymentproposal', loadChildren: './approvedpaymentproposal/approvedpaymentproposal.module#ApprovedPaymentProposalModule' },
            { path: 'approvedpaymentextraproposal', loadChildren: './approvedpaymentextraproposal/approvedpaymentextraproposal.module#ApprovedPaymentExtraProposalModule' },
            { path: 'approvedpaymentproposalgddh', loadChildren: './approvedpaymentproposalgddh/approvedpaymentproposalgddh.module#ApprovedPaymentProposalGddhModule' },
            { path: 'approvedpaymentccmproposal', loadChildren: './approvedpaymentccmproposal/approvedpaymentccmproposal.module#ApprovedPaymentCcmProposalModule' },
            { path: 'paymentproposaltotal', loadChildren: './paymentproposaltotal/paymentproposaltotal.module#PaymentProposalTotalModule' },
             // localhost:8888/main/approvedbillpaysupp
            { path: 'approvedbillpaysupp', loadChildren: './approvedbillpaysupp/approvedbillpaysupp.module#ApprovedBillPaySuppModule' },
            { path: 'approvedbillpaymain', loadChildren: './approvedbillpaymain/approvedbillpaymain.module#ApprovedBillPayMainModule' },
              // localhost:8888/main/approvedbillpayteam
            { path: 'approvedbillpaydept', loadChildren: './approvedbillpaydept/approvedbillpaydept.module#ApprovedBillPayDeptModule' },
            { path: 'approvedmaterialusagestatus', loadChildren: './approvedmaterialusagestatus/approvedmaterialusagestatus.module#ApprovedMaterialUsageStatusModule' },
            { path: 'approvedmaterialmeusagestatus', loadChildren: './approvedmaterialmeusagestatus/approvedmaterialmeusagestatus.module#ApprovedMaterialMeUsageStatusModule' },
            
             // localhost:8888/main/approvedbillpayequipment
             { path: 'approvedbillpayequipment', loadChildren: './approvedbillpayequipment/approvedbillpayequipment.module#ApprovedBillPayEquipmentModule' },            
            // localhost:8888/main/reporterplancostrevcons
            { path: 'reporterplancostrevcons',loadChildren : './reporterplancostrevcons/reporterplancostrevcons.module#ReporterPlanCostRevConsModule' },
            { path: 'reporterphanbocpns',loadChildren : './reporterphanbocpns/reporterphanbocpns.module#ReporterPhanBoCpnsModule' },
            { path: 'reporterplanconsmexd',loadChildren : './reporterplanconsmexd/reporterplanconsmexd.module#ReporterPlanConsMexdModule' },
            { path: 'reportertenderselection',loadChildren : './reportertenderselection/reportertenderselection.module#ReporterTenderSelectionModule' },
            { path: 'reporterpn',loadChildren : './reporterpn/reporterpn.module#ReporterPnModule' },
            { path: 'reporterpx',loadChildren : './reporterpx/reporterpx.module#ReporterPxModule' },
            { path: 'reporterplancostme',loadChildren : './reporterplancostme/reporterplancostme.module#ReporterPlancostMeModule' },
            { path: 'reporterpropose',loadChildren : './reporterpropose/reporterpropose.module#ReporterProposeModule' },
            { path: 'reporterquarter',loadChildren : './reporterquarter/reporterquarter.module#ReporterQuarterModule' },
            { path: 'reporterclaim',loadChildren : './reporterclaim/reporterclaim.module#ReporterClaimModule' },
            { path: 'reporterplancostoffice',loadChildren : './reporterplancostoffice/reporterplancostoffice.module#ReporterPlanCostOfficeModule' },
            { path: 'reporterbillpaydept',loadChildren : './reporterbillpaydept/reporterbillpaydept.module#ReporterBillpaydeptModule' },
            { path: 'reportersafepunish',loadChildren : './reportersafepunish/reportersafepunish.module#ReporterSafepunishModule' },
            // localhost:8888/main/reporterplancostrevcons_ss
            { path: 'reporterplancostrevcons_ss',loadChildren : './reporterplancostrevcons_ss/reporterplancostrevcons_ss.module#ReporterPlanCostRevCons_SSModule' },            
            // localhost:8888/main/reporterplancostrevcons_da
            { path: 'reporterplancostrevcons_da',loadChildren : './reporterplancostrevcons_da/reporterplancostrevcons_da.module#ReporterPlanCostRevCons_DAModule' },            
            { path: 'reporterplancostoffice_ss',loadChildren : './reporterplancostoffice_ss/reporterplancostoffice_ss.module#ReporterPlanCostOffice_SSModule' },            
            // localhost:8888/main/reporterplansigncon
            { path: 'reporterplansigncon',loadChildren : './reporterplansigncon/reporterplansigncon.module#ReporterPlanSignConModule' },
            // localhost:8888/main/reporterbillthanhtoan
            { path: 'reporterbillthanhtoan',loadChildren : './reporterbillthanhtoan/reporterbillthanhtoan.module#ReporterBillThanhtoanModule' },
            { path: 'reporterclaimchuaduyet',loadChildren : './reporterclaimchuaduyet/reporterclaimchuaduyet.module#ReporterClaimChuaDuyetModule' },
            { path: 'reporterclaimmoinhat',loadChildren : './reporterclaimmoinhat/reporterclaimmoinhat.module#ReporterClaimMoiNhatModule' },
            { path: 'reporterbillequip',loadChildren : './reporterbillequip/reporterbillequip.module#ReporterBillEquipModule' },
            // localhost:8888/main/reporterthuchi
            { path: 'reporterthuchi',loadChildren : './reporterthuchi/reporterthuchi.module#ReporterThuChiModule' },
            { path: 'reportertonghopthanhtoan',loadChildren : './reportertonghopthanhtoan/reportertonghopthanhtoan.module#ReporterTongHopThanhToanModule' },
            { path: 'reporterchiphithoidiem',loadChildren : './reporterchiphithoidiem/reporterchiphithoidiem.module#ReporterChiPhiThoiDiemModule' },
            { path: 'reporterbctctonghop',loadChildren : './reporterbctctonghop/reporterbctctonghop.module#ReporterBctcTongHopModule' },
            { path: 'reporterhanthanhtoan',loadChildren : './reporterhanthanhtoan/reporterhanthanhtoan.module#ReporterHanThanhToanModule' },
            { path: 'reportercongno',loadChildren : './reportercongno/reportercongno.module#ReporterCongNoModule' },
            { path: 'reportercpbch',loadChildren : './reportercpbch/reportercpbch.module#ReporterCPBCHModule' },
            { path: 'reporterincurred',loadChildren : './reporterincurred/reporterincurred.module#ReporterIncurredModule' },
            { path: 'reporterdebtcollection',loadChildren : './reporterdebtcollection/reporterdebtcollection.module#ReporterDebtCollectionModule' },
            { path: 'reportersetlementstatus',loadChildren : './reportersetlementstatus/reportersetlementstatus.module#ReporterSetlementStatusModule' },
            { path: 'reporterkhautru',loadChildren : './reporterkhautru/reporterkhautru.module#ReporterKhautruModule' },
            { path: 'reporterplanpayment',loadChildren : './reporterplanpayment/reporterplanpayment.module#ReporterPlanPaymentModule' },
            { path: 'reporterkhautruver1',loadChildren : './reporterkhautruver1/reporterkhautruver1.module#ReporterKhautruVer1Module' },
            { path: 'reportercpvp',loadChildren : './reportercpvp/reportercpvp.module#ReporterCPVPModule' },
            { path: 'reporterplanquantity',loadChildren : './reporterplanquantity/reporterplanquantity.module#ReporterPlanQuantityModule' },
            { path: 'reporterplanstaffcost',loadChildren : './reporterplanstaffcost/reporterplanstaffcost.module#ReporterPlanStaffCostModule' },
            { path: 'reporterdoanhthuchiphi',loadChildren : './reporterdoanhthuchiphi/reporterdoanhthuchiphi.module#ReporterDoanhThuChiPhiModule' },
            { path: 'reporterdocumentary',loadChildren : './reporterdocumentary/reporterdocumentary.module#ReporterDocumentaryModule' },
            { path: 'reportersettelement',loadChildren : './reportersettelement/reportersettelement.module#ReporterSettelementModule' },
            { path: 'reporterpartnerevaluation',loadChildren : './reporterpartnerevaluation/reporterpartnerevaluation.module#ReporterPartnerEvaluationModule' },
            { path: 'reporterdoanhthuchiphithang',loadChildren : './reporterdoanhthuchiphithang/reporterdoanhthuchiphithang.module#ReporterDoanhThuChiPhiThangModule' },
            { path: 'reporterdoanhthuchiphithanggddh',loadChildren : './reporterdoanhthuchiphithanggddh/reporterdoanhthuchiphithanggddh.module#ReporterDoanhThuChiPhiThangGDDHModule' },
            { path: 'reporterdongthutheocongno',loadChildren : './reporterdongthutheocongno/reporterdongthutheocongno.module#ReporterDongThuTheoCongNoModule' },
            { path: 'reporterkhoiluongthuchienthang',loadChildren : './reporterkhoiluongthuchienthang/reporterkhoiluongthuchienthang.module#ReporterKhoiLuongThucHienThangModule' },
            { path: 'reporterkehoachquy',loadChildren : './reporterkehoachquy/reporterkehoachquy.module#ReporterKeHoachQuyModule' },
            { path: 'reporterdutrudaucongtruong',loadChildren : './reporterdutrudaucongtruong/reporterdutrudaucongtruong.module#ReporterDuTruDauCongTruongModule' },
            // localhost:8888/main/reporterbillthanhtoan_mh
            { path: 'reporterbillthanhtoan_mh',loadChildren : './reporterbillthanhtoan_mh/reporterbillthanhtoan_mh.module#ReporterBillThanhtoan_MhModule' },  
            { path: 'reporterplancashflowsite',loadChildren : './reporterplancashflowsite/reporterplancashflowsite.module#ReporterPlanCashFlowSiteModule' },              
            // localhost:8888/main/reporterproducthuman
            { path: 'reporterproducthuman',loadChildren : './reporterproducthuman/reporterproducthuman.module#ReporterProductHumanModule' },                      
            // localhost:8888/main/approvedsettlement
            { path: 'approvedsettlement',loadChildren : './approvedsettlement/approvedsettlement.module#ApprovedSettlementModule' },
            // localhost:8888/main/approvedpurchasingnote
            { path: 'approvedpurchasingnote',loadChildren : './approvedpurchasingnote/approvedpurchasingnote.module#ApprovedPurchasingNoteModule' },            
            // localhost:8888/main/permission
            { path: 'permission',loadChildren : './permission/permission.module#PermissionModule' },
            // localhost:8888/main/permissionCTC
            { path: 'permissionCTC',loadChildren : './permissionCTC/permissionCTC.module#PermissionCTCModule' },            
            // localhost:8888/main/permission
            { path: 'widget',loadChildren : './widget/widget.module#WidgetModule' },
            // localhost:8888/main/notifications
            { path: 'notifications',loadChildren : './notifications/notifications.module#NotificationsModule' },
            // localhost:8888/main/notifications_tm
            { path: 'notifications_tm',loadChildren : './notifications_tm/notifications_tm.module#Notifications_TmModule' },            
            // localhost:8888/main/proposedpurchase
            { path: 'proposedpurchase',loadChildren : './proposedpurchase/proposedpurchase.module#ProposedPurchaseModule' }, 
            // localhost:8888/main/proposedpurchase2
            { path: 'proposedpurchase2',loadChildren : './proposedpurchase2/proposedpurchase2.module#ProposedPurchase2Module' }, 
            // localhost:8888/main/proposedpurchase3
            { path: 'proposedpurchase3',loadChildren : './proposedpurchase3/proposedpurchase3.module#ProposedPurchase3Module' }, 
            // localhost:8888/main/proposedpurchase4
            { path: 'proposedpurchase4',loadChildren : './proposedpurchase4/proposedpurchase4.module#ProposedPurchase4Module' },   
            // localhost:8888/main/approvedproposedpurchase3
            { path: 'approvedproposedpurchase3', loadChildren: './approvedproposedpurchase3/approvedproposedpurchase3.module#ApprovedProposedPurchase3Module' },                      
            // localhost:8888/main/purchaseorder
            { path: 'purchaseorder',loadChildren : './purchaseorder/purchaseorder.module#PurchaseOrderModule' },
            { path: 'purchasebchorder',loadChildren : './purchasebchorder/purchasebchorder.module#PurchaseBchOrderModule' },
            // localhost:8888/main/approvedpurchaseorder
            { path: 'approvedpurchaseorder', loadChildren: './approvedpurchaseorder/approvedpurchaseorder.module#ApprovedPurchaseOrderModule' },    
            { path: 'purchaseotherorder',loadChildren : './purchaseotherorder/purchaseotherorder.module#PurchaseOtherOrderModule' },
            { path: 'materialusagestatus',loadChildren : './materialusagestatus/materialusagestatus.module#MaterialUsageStatusModule' },
            { path: 'materialmeusagestatus',loadChildren : './materialmeusagestatus/materialmeusagestatus.module#MaterialMeUsageStatusModule' },
            // localhost:8888/main/approvedpurchaseorder
            { path: 'approvedpurchaseotherorder', loadChildren: './approvedpurchaseotherorder/approvedpurchaseotherorder.module#ApprovedPurchaseOtherOrderModule' },          
            // localhost:8888/main/purchasingnote
            { path: 'purchasingnote',loadChildren : './purchasingnote/purchasingnote.module#PurchasingNoteModule' },
            // localhost:8888/main/reporterpricingcal
            { path: 'reporterpricingcal',loadChildren : './reporterpricingcal/reporterpricingcal.module#ReporterPricingCalModule' },
            // localhost:8888/main/productlist
            { path: 'productlist',loadChildren : './productlist/productlist.module#ProductListModule' },
            // localhost:8888/main/regcontract_view
            { path: 'regcontract_view', loadChildren: './regcontract_view/regcontract_view.module#RegContract_ViewModule' },
            // localhost:8888/main/itemslist
            { path: 'itemslist', loadChildren: './itemslist/itemslist.module#ItemsListModule' },
            { path: 'itemspecies', loadChildren: './itemspecies/itemspecies.module#ItemSpeciesModule' },
            { path: 'invoicecost', loadChildren: './invoicecost/invoicecost.module#InvoiceCostModule' },
            { path: 'incurred', loadChildren: './incurred/incurred.module#IncurredModule' },
            { path: 'registerincurred', loadChildren: './registerincurred/registerincurred.module#RegisterIncurredModule' },
           
            { path: 'incurredccm', loadChildren: './incurredccm/incurredccm.module#IncurredCcmModule' },
            // localhost:8888/main/itemgrouplist
            { path: 'itemgrouplist', loadChildren: './itemgrouplist/itemgrouplist.module#ItemGroupListModule' },
            { path: 'itemsurface', loadChildren: './itemsurface/itemsurface.module#ItemSurfaceModule' },
            // localhost:8888/main/receiptteam
            { path: 'receiptteam', loadChildren: './receiptteam/receiptteam.module#ReceiptTeamModule' },         
            // localhost:8888/main/trademark
            { path: 'trademark', loadChildren: './trademark/trademark.module#TradeMarkModule' },                                 
            // localhost:8888/main/supplierquotes
            { path: 'supplierquotes', loadChildren: './supplierquotes/supplierquotes.module#SupplierQuotesModule' },  
            { path: 'solpp', loadChildren: './solpp/solpp.module#SolPPModule' },    
            { path: 'solpn', loadChildren: './solpn/solpn.module#SolPNModule' }, 
            { path: 'imwarematerials', loadChildren: './imwarematerials/imwarematerials.module#ImWareMaterialsModule' }, 
            { path: 'exwarematerials', loadChildren: './exwarematerials/exwarematerials.module#ExWareMaterialsModule' },   
            { path: 'imsolpoconcrete', loadChildren: './imsolpoconcrete/imsolpoconcrete.module#ImSolPoConcreteModule' }, 
            { path: 'solpx', loadChildren: './solpx/solpx.module#SolPXModule' },    
            { path: 'safepunish', loadChildren: './safepunish/safepunish.module#SafePunishModule' },    
            // localhost:8888/main/supplierquotesinvite
            { path: 'supplierquotesinvite', loadChildren: './supplierquotesinvite/supplierquotesinvite.module#SupplierQuotesInviteModule' },               
            // localhost:8888/main/projectlist
            { path: 'projectlist', loadChildren: './projectlist/projectlist.module#ProjectListModule' },
            { path: 'equiplist', loadChildren: './equiplist/equiplist.module#EquipListModule' }, 
            { path: 'groupequiplist', loadChildren: './groupequiplist/groupequiplist.module#GroupEquipListModule' },  
            { path: 'equipproduct', loadChildren: './equipproduct/equipproduct.module#EquipProductModule' },  
            { path: 'performwarranty', loadChildren: './performwarranty/performwarranty.module#PerformWarrantyModule' },  
            { path: 'performwarrantyequip', loadChildren: './performwarrantyequip/performwarrantyequip.module#PerformWarrantyEquipModule' },  
            { path: 'depositcontract', loadChildren: './depositcontract/depositcontract.module#DepositContractModule' }, 
            { path: 'creditcontract', loadChildren: './creditcontract/creditcontract.module#CreditContractModule' }, 
            { path: 'approveddepositcontract', loadChildren: './approveddepositcontract/approveddepositcontract.module#ApprovedDepositContractModule' },  
            { path: 'approvedcreditcontract', loadChildren: './approvedcreditcontract/approvedcreditcontract.module#ApprovedCreditContractModule' },  
              
            // localhost:8888/main/wizard
            { path: 'wizardcalcprice',loadChildren : './wizardcalcprice/wizardcalcprice.module#WizardCalcPriceModule' },   
            // localhost:8888/main/baremlist
            { path: 'baremlist', loadChildren: './baremlist/baremlist.module#BaremListModule' },      
            // localhost:8888/main/contract
            { path: 'sendmail', loadChildren: './sendmail/sendmail.module#SendMailModule' },
            // localhost:8888/main/emailtemplate
            { path: 'emailtemplate', loadChildren: './emailtemplate/emailtemplate.module#EmailTemplateModule' },     
            // localhost:8888/main/consdocument
            { path: 'consdocument', loadChildren: './consdocument/consdocument.module#ConsDocumentModule' },
            // localhost:8888/main/regcontract_viewCT
            { path: 'regcontract_viewCT', loadChildren: './regcontract_viewCT/regcontract_viewCT.module#RegContract_ViewCTModule' },
            // localhost:8888/main/documentview
            { path: 'documentview', loadChildren: './documentview/documentview.module#DocumentViewModule' },
            // localhost:8888/main/supplierinfo
            { path: 'supplierinfo', loadChildren: './supplierinfo/supplierinfo.module#SupplierInfoModule' },
            // localhost:8888/main/supplierinvoice
            { path: 'supplierinvoice', loadChildren: './supplierinvoice/supplierinvoice.module#SupplierInvoiceModule' },
            // localhost:8888/main/purchasebudget
            { path: 'purchasebudget', loadChildren: './purchasebudget/purchasebudget.module#PurchaseBudgetModule' },
            { path: 'concretebudget', loadChildren: './concretebudget/concretebudget.module#ConcreteBudgetModule' },
            { path: 'purchaseotherbudget', loadChildren: './purchaseotherbudget/purchaseotherbudget.module#PurchaseOtherBudgetModule' },
            { path: 'auxiliarymaterialsbuget', loadChildren: './auxiliarymaterialsbuget/auxiliarymaterialsbuget.module#AuxiliaryMaterialsBugetModule' },
            { path: 'auxiliarymaterialsorder', loadChildren: './auxiliarymaterialsorder/auxiliarymaterialsorder.module#AuxiliaryMaterialsOrderModule' },
            // localhost:8888/main/approvedpurchasebudget
            { path: 'approvedpurchasebudget', loadChildren: './approvedpurchasebudget/approvedpurchasebudget.module#ApprovedPurchaseBudgetModule' },
            { path: 'approvedauxiliarymaterialsbuget', loadChildren: './approvedauxiliarymaterialsbuget/approvedauxiliarymaterialsbuget.module#ApprovedAuxiliaryMaterialsBugetModule' },
            { path: 'approvedauxiliarymaterialsorder', loadChildren: './approvedauxiliarymaterialsorder/approvedauxiliarymaterialsorder.module#ApprovedAuxiliaryMaterialsOrderModule' },
            { path: 'approvedconcretebudget', loadChildren: './approvedconcretebudget/approvedconcretebudget.module#ApprovedConcreteBudgetModule' },
            { path: 'approvedpurchaseotherbudget', loadChildren: './approvedpurchaseotherbudget/approvedpurchaseotherbudget.module#ApprovedPurchaseOtherBudgetModule' },
            { path: 'approvedsolpoconcrete', loadChildren: './approvedsolpoconcrete/approvedsolpoconcrete.module#ApprovedSolPoConcreteModule' },
            { path: 'approvedsolpp', loadChildren: './approvedsolpp/approvedsolpp.module#ApprovedSolPPModule' },
            { path: 'approveddebtcollection', loadChildren: './approveddebtcollection/approveddebtcollection.module#ApprovedDebtCollectionModule' },
            { path: 'approvedsetlementstatus', loadChildren: './approvedsetlementstatus/approvedsetlementstatus.module#ApprovedSetlementStatusModule' },
            { path: 'approvedbcndebtcollection', loadChildren: './approvedbcndebtcollection/approvedbcndebtcollection.module#ApprovedBcnDebtCollectionModule' },
            { path: 'approvedincurred', loadChildren: './approvedincurred/approvedincurred.module#ApprovedIncurredModule' },
            { path: 'approvedregisterincurred', loadChildren: './approvedregisterincurred/approvedregisterincurred.module#ApprovedRegisterIncurredModule' },
            { path: 'approvedsolpn', loadChildren: './approvedsolpn/approvedsolpn.module#ApprovedSolPNModule' },
            { path: 'approvedimwarematerials', loadChildren: './approvedimwarematerials/approvedimwarematerials.module#ApprovedImWareMaterialsModule' },
            { path: 'approvedimsolpoconcrete', loadChildren: './approvedimsolpoconcrete/approvedimsolpoconcrete.module#ApprovedImSolPoConcreteModule' },
            { path: 'approvedexwarematerials', loadChildren: './approvedexwarematerials/approvedexwarematerials.module#ApprovedExWareMaterialsModule' },
            { path: 'approvedsolpx', loadChildren: './approvedsolpx/approvedsolpx.module#ApprovedSolPXModule' },
            { path: 'approvedconcreteloss', loadChildren: './approvedconcreteloss/approvedconcreteloss.module#ApprovedConcreteLossModule' },
            { path: 'approvedsteelloss', loadChildren: './approvedsteelloss/approvedsteelloss.module#ApprovedSteelLossModule' },
            { path: 'solpoconcrete', loadChildren: './solpoconcrete/solpoconcrete.module#SolPOConcreteModule' },
            { path: 'concreteloss', loadChildren: './concreteloss/concreteloss.module#ConcreteLossModule' },
            { path: 'steelloss', loadChildren: './steelloss/steelloss.module#SteelLossModule' },
            { path: 'customer', loadChildren: './customer/customer.module#CustomerModule' },
            // { path: 'approvedsolpoconcrete', loadChildren: './approvedsolpoconcrete/approvedsolpoconcrete.module#ApprovedSolPOConcreteModule' },
            // localhost:8888/main/rep01_bkddh_mua
            { path: 'rep01_bkddh_mua',loadChildren : './rep01_bkddh_mua/rep01_bkddh_mua.module#Rep01_Bkddh_MuaModule' },
            // localhost:8888/main/rep02_thddh_mua
            { path: 'rep02_thddh_mua',loadChildren : './rep02_thddh_mua/rep02_thddh_mua.module#Rep02_Thddh_MuaModule' },
            // localhost:8888/main/rep03_supplierlist
            { path: 'rep03_supplierlist',loadChildren : './rep03_supplierlist/rep03_supplierlist.module#Rep03_SupplierListModule' },                
            // localhost:8888/main/categorylist
            { path: 'categorylist',loadChildren : './categorylist/categorylist.module#CategoryListModule' },
            { path: 'itemsize',loadChildren : './itemsize/itemsize.module#ItemSizeModule' },
            // localhost:8888/main/billequipment_view
            { path: 'billequipment_view', loadChildren: './billequipment_view/billequipment_view.module#BillEquipment_ViewModule' },      
            // localhost:8888/main/rep04_lichsubiendonggia
            { path: 'rep04_lichsubiendonggia',loadChildren : './rep04_lichsubiendonggia/rep04_lichsubiendonggia.module#Rep04_LichSuBienDongGiaModule' },  
            // localhost:8888/main/reporterdutruthanhtoan_mh
            { path: 'reporterdutruthanhtoan_mh',loadChildren : './reporterdutruthanhtoan_mh/reporterdutruthanhtoan_mh.module#ReporterDuTruThanhToan_MhModule' },                                     
            // localhost:8888/main/reportertitrongmuahang
            { path: 'reportertitrongmuahang',loadChildren : './reportertitrongmuahang/reportertitrongmuahang.module#ReporterTiTrongMuaHangModule' },      
            // localhost:8888/main/rep05_kehoachmuahang
            { path: 'rep05_kehoachmuahang',loadChildren : './rep05_kehoachmuahang/rep05_kehoachmuahang.module#Rep05_KeHoachMuaHangModule' },      
            { path: 'reporterconcretebudget',loadChildren : './reporterconcretebudget/reporterconcretebudget.module#ReporterConcreteBudgetModule' },      
            { path: 'rep05_haohutvattu',loadChildren : './rep05_haohutvattu/rep05_haohutvattu.module#Rep05_HaoHutVatTuModule' },      
            // localhost:8888/main/reportercongnohoadon
            { path: 'reportercongnohoadon',loadChildren : './reportercongnohoadon/reportercongnohoadon.module#ReporterCongNoHoaDonModule' },
            { path: 'reporterconcreteloss',loadChildren : './reporterconcreteloss/reporterconcreteloss.module#ReporterConcreteLossModule' },
            { path: 'rep03_menulist',loadChildren : './rep03_menulist/rep03_menulist.module#Rep03_MenuListModule' }
        ]
    }
]
