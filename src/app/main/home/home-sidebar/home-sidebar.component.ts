import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core'
import { SystemConstants } from '../../../core/common/system.constants';
import { Global } from '../../../shared/global';


@Component({
    selector: 'app-home-sidebar',
    templateUrl: './home-sidebar.component.html',
    styleUrls: ['./home-sidebar.component.css']
})

export class HomeSidebarComponent implements OnInit, OnDestroy {

    isSysAdmin: string;
    isSubAdmin: string;

    //All
    isPermissionAll_commandplan: boolean;
    isPermissionAll_commandplanfinace: boolean;
    isPermissionAll_plansigncon: boolean;
    isPermissionAll_plancostrevcons: boolean;
    isPermissionAll_confirmprojectcomplete: boolean;
    
    isPermissionAll_planpayment: boolean;
    isPermissionAll_planupdate: boolean;
    isPermissionAll_supportlltc: boolean;
    
    isPermissionAll_financialreport: boolean;
    isPermissionAll_plancostoffice: boolean;

    isPermissionAll_commanddoc: boolean;
    isPermissionAll_commandquanlykho: boolean;
    isPermissionAll_regcontractinvestor: boolean;
    isPermissionAll_regcontractccminvestor: boolean;
    isPermissionAll_regcontractinvestorview: boolean;
    isPermissionAll_internaldocument: boolean;
    isPermissionAll_profiledocument: boolean;
    isPermissionAll_investtask: boolean;
    isPermissionAll_buyingtask: boolean;
    isPermissionAll_billinvestor: boolean;
    isPermissionAll_materialusagestatus: boolean;
    isPermissionAll_materialmeusagestatus: boolean;
    
    isPermissionAll_registeremail: boolean;
    isPermissionAll_registeruser: boolean;
    isPermissionAll_equibudgetm4: boolean;
    isPermissionAll_equibudgetm5: boolean;
    isPermissionAll_cancelregistrationemail: boolean;
    isPermissionAll_guaranteetask: boolean;
    isPermissionAll_guaranteetaskatch: boolean;
    isPermissionAll_boqinvestor: boolean;
    isPermissionAll_deposittask: boolean;
    isPermissionAll_falnloctask: boolean;
    isPermissionAll_liquidationasset: boolean;
    isPermissionAll_documentary: boolean;
    isPermissionAll_examinationrecords: boolean;
    isPermissionAll_lettertopartner: boolean;
    isPermissionAll_requestsadvances: boolean;
    isPermissionAll_requestsreimbursement: boolean;
    isPermissionAll_planequipcost: boolean;
    isPermissionAll_planlossdetail: boolean;
    isPermissionAll_costdeduction: boolean;
    isPermissionAll_docaftersales: boolean;
    isPermissionAll_approveddocaftersalessurvay: boolean;
    
    isPermissionAll_commandcontract: boolean;
    isPermissionAll_regcontract: boolean;
    isPermissionAll_reginvestmentcontract: boolean;
    isPermissionAll_contract: boolean;
    isPermissionAll_appendix: boolean;
    isPermissionAll_regcontract_view: boolean;
    isPermissionAll_billpaysupp_view: boolean;
    isPermissionAll_billpaysuppedit: boolean;
    isPermissionAll_regcontract_viewCT: boolean;

    isPermissionAll_commandbill: boolean;
    isPermissionAll_unitprice: boolean;
    isPermissionAll_unitccmprice: boolean;
    
    isPermissionAll_confirmprofile: boolean;
    isPermissionAll_billteam: boolean;
    isPermissionAll_billsupp: boolean;
    isPermissionAll_billmain: boolean;
    isPermissionAll_billequipment: boolean;

    isPermissionAll_commandbillpay: boolean;
    isPermissionAll_billpayteam: boolean;
    isPermissionAll_billpaysupp: boolean;
    isPermissionAll_billpaybuilding: boolean;
    isPermissionAll_billpaymain: boolean;
    isPermissionAll_billpaydept: boolean;
    isPermissionAll_billeditpaydept: boolean;
    isPermissionAll_billeditpayteam: boolean;
    isPermissionAll_billewi: boolean;
    isPermissionAll_billinternalequip: boolean;
    isPermissionAll_billpayequipment: boolean;
    isPermissionAll_billeditpayequipment: boolean;
    isPermissionAll_consdocument: boolean;
    isPermissionAll_plantimekeeping: boolean;
    isPermissionAll_partnerevaluation: boolean;

    isPermissionAll_commandsettlement: boolean;
    isPermissionAll_settlement: boolean;
    isPermissionAll_planclaim: boolean;
    isPermissionAll_planequipclaim: boolean;
    isPermissionAll_settlementclaim: boolean;
    isPermissionAll_planccmclaim: boolean;
    isPermissionAll_planquantity: boolean;
    isPermissionAll_plancashflowsite: boolean;
    isPermissionAll_planclaimvalue: boolean;
    isPermissionAll_planaftersales: boolean;
    isPermissionAll_performwarranty: boolean;

    isPermissionAll_commanddocument: boolean;
    isPermissionAll_settlement_doc: boolean;
    isPermissionAll_mainlement: boolean;

    isPermissionAll_commandreportccm: boolean;
    isPermissionAll_commandtckt: boolean;
    isPermissionAll_commandbdsdt: boolean;
    isPermissionAll_reporterincurred: boolean; 
    isPermissionAll_reporterdebtcollection: boolean;    
    isPermissionAll_reporterpn: boolean;    
    isPermissionAll_reporterpx: boolean;    
    isPermissionAll_reporterplancostrevcons: boolean;    
    isPermissionAll_reporterplancostme: boolean;    
    isPermissionAll_reporterplancostoffice: boolean;    
    isPermissionAll_reporterbillpaydept: boolean;    
    isPermissionAll_reporterplancostrevcons_ss: boolean; 
    isPermissionAll_reporterplancostoffice_ss: boolean; 
    isPermissionAll_reporterplansigncon: boolean;  
    isPermissionAll_reporterkehoachquy: boolean;  
    isPermissionAll_reporterplanquantity: boolean;  
    isPermissionAll_reporterplancashflowsite: boolean;  
    
    isPermissionAll_reporterpricingcal: boolean; 
    isPermissionAll_reporterbillthanhtoan: boolean;
    isPermissionAll_reporterbillequip: boolean;
    isPermissionAll_reporterthuchi: boolean;
    isPermissionAll_reporterchiphithoidiem: boolean;
    isPermissionAll_reporterhanthanhtoan: boolean;
    isPermissionAll_reporterplanpayment: boolean;
    isPermissionAll_reporterphanbocpns: boolean;
    isPermissionAll_reportertonghopthanhtoan: boolean;
    isPermissionAll_reportercongno: boolean;
    isPermissionAll_reporterdoanhthuchiphi: boolean;
    isPermissionAll_reporterdoanhthuchiphithang: boolean;
    isPermissionAll_reporterdongthutheocongno: boolean;
    isPermissionAll_reporterdutrudaucongtruong: boolean;
    isPermissionAll_reporterdoanhthuchiphithanggddh: boolean;
    isPermissionAll_reporterkhoiluongthuchienthang: boolean;
    isPermissionAll_reportercpbch: boolean;
    isPermissionAll_reportercpvp: boolean;
    isPermissionAll_reporterbillthanhtoan_mh: boolean;
    isPermissionAll_reporterdutruthanhtoan_mh: boolean;
    isPermissionAll_reporterproducthuman: boolean;
    isPermissionAll_reporterclaimchuaduyet: boolean;
    isPermissionAll_reporterclaimmoinhat: boolean;
    isPermissionAll_rep01_bkddh_mua: boolean;
    isPermissionAll_rep02_thddh_mua: boolean;
    isPermissionAll_rep03_supplierlist: boolean;
    isPermissionAll_rep03_menulist: boolean;
    isPermissionAll_rep04_lichsubiendonggia: boolean;
    isPermissionAll_reportertitrongmuahang: boolean;
    isPermissionAll_reporterbctctonghop: boolean;
    isPermissionAll_rep05_kehoachmuahang: boolean;
    isPermissionAll_rep05_kehoachbetong: boolean;
    isPermissionAll_rep05_haohutvattu: boolean;
    isPermissionAll_reportercongnohoadon: boolean;
    isPermissionAll_reporterdocumentary: boolean;
    isPermissionAll_reportersettelement: boolean;
    isPermissionAll_reporterpartnerevaluation: boolean;
    isPermissionAll_regcontractmaintenance: boolean;
    isPermissionAll_reporterpropose: boolean;
    isPermissionAll_reporterclaim: boolean;
    
    isPermissionAll_commandecommerce: boolean;
    isPermissionAll_itemgrouplist: boolean;
    isPermissionAll_itemslist: boolean;   
    isPermissionAll_invoicecost: boolean;   
    isPermissionAll_incurred: boolean;   
    isPermissionAll_registerincurred: boolean;   
    isPermissionAll_proposalrevenueexpen: boolean;   
    isPermissionAll_proposalquarterly: boolean;   
    isPermissionAll_incurredccm: boolean;    
    isPermissionAll_baremlist: boolean;
    isPermissionAll_projectlist: boolean;
    isPermissionAll_equiplist: boolean;
    isPermissionAll_groupequiplist: boolean;
    isPermissionAll_productlist: boolean;
    isPermissionAll_receiptteam: boolean;
    isPermissionAll_safepunish: boolean;
    isPermissionAll_trademark: boolean;
    isPermissionAll_supplierquotes: boolean;
    isPermissionAll_supplierquotesinvite: boolean;
    isPermissionAll_proposedpurchase2: boolean;
    isPermissionAll_proposedpurchase: boolean;
    isPermissionAll_proposedpurchase3: boolean;
    isPermissionAll_proposedpurchase4: boolean;
    isPermissionAll_purchaseorder: boolean;
    isPermissionAll_purchasebchorder: boolean;
    isPermissionAll_purchaseotherorder: boolean;
    isPermissionAll_purchaseorder2: boolean;
    isPermissionAll_purchasingnote: boolean;
    isPermissionAll_supplierinfo: boolean;
    isPermissionAll_depositcontract: boolean;
    isPermissionAll_creditcontract: boolean;
    isPermissionAll_supplierinvoice: boolean;
    isPermissionAll_purchasebudget: boolean;
    isPermissionAll_concretebudget: boolean;
    isPermissionAll_purchaseotherbudget: boolean;
    isPermissionAll_auxiliarymaterialsbuget: boolean;
    isPermissionAll_auxiliarymaterialsorder: boolean;
    isPermissionAll_spendingplan: boolean;
    isPermissionAll_categorylist: boolean;
    isPermissionAll_paymentproposal: boolean;
    isPermissionAll_paymentextraproposal: boolean;
    isPermissionAll_paymentmeproposal: boolean;
    isPermissionAll_paymentccmproposal: boolean;
    isPermissionAll_billinvesment: boolean;
    isPermissionAll_paymentproposaltotal: boolean;
    isPermissionAll_unc: boolean;
    isPermissionAll_solpp: boolean;
    isPermissionAll_solpn: boolean;
    isPermissionAll_imwarematerials: boolean;
    isPermissionAll_exwarematerials: boolean;
    isPermissionAll_imsolpoconcrete: boolean;
    isPermissionAll_solpx: boolean;
    isPermissionAll_solpoconcrete: boolean;
    isPermissionAll_concreteloss: boolean;
    isPermissionAll_steelloss: boolean;
    isPermissionAll_customer: boolean;
    isPermissionAll_planstaffcost: boolean;
    isPermissionAll_planprojectinex: boolean;
    isPermissionAll_tenderselection: boolean;
    isPermissionAll_pricelibrary: boolean;
    isPermissionAll_debtcollection: boolean;
    isPermissionAll_setlementstatus: boolean;
    isPermissionAll_settlementrecords: boolean;
    isPermissionAll_plansignstatus: boolean;
    isPermissionAll_deadlineproject: boolean;
    
    isPermissionAll_TMDvcs: boolean;
    currentActive: Element;

    constructor() { 
    }

    ngOnInit() { 
        let permission = <Array<Object>>JSON.parse(localStorage.getItem(SystemConstants.PERMISSION_DATA_POSITION));
        let permission2 = <Array<Object>>JSON.parse(localStorage.getItem(SystemConstants.PERMISSION_DATA));

        this.isSysAdmin = localStorage.getItem(SystemConstants.CURRENT_ISSYSADMIN);
        this.isSubAdmin = localStorage.getItem(SystemConstants.CURRENT_ISSUBADMIN);

        this.isPermissionAll_commandplan = Global.getPermissionAll(permission,permission2,'commandplan', 'IsDisplay');
        this.isPermissionAll_commandplanfinace = Global.getPermissionAll(permission,permission2,'commandplanfinace', 'IsDisplay');
        this.isPermissionAll_plansigncon = Global.getPermissionAll(permission,permission2,'plansigncon-explorer', 'IsDisplay');
        this.isPermissionAll_materialusagestatus = Global.getPermissionAll(permission,permission2,'materialusagestatus-explorer', 'IsDisplay');
        this.isPermissionAll_materialmeusagestatus = Global.getPermissionAll(permission,permission2,'materialmeusagestatus-explorer', 'IsDisplay');
        this.isPermissionAll_planupdate = Global.getPermissionAll(permission,permission2,'planupdate-explorer', 'IsDisplay');
        this.isPermissionAll_equibudgetm4 = Global.getPermissionAll(permission,permission2,'equibudgetm4-explorer', 'IsDisplay');
        this.isPermissionAll_equibudgetm5 = Global.getPermissionAll(permission,permission2,'equibudgetm5-explorer', 'IsDisplay');
        this.isPermissionAll_plancostrevcons = Global.getPermissionAll(permission,permission2,'plancostrevcons-explorer', 'IsDisplay');
        this.isPermissionAll_confirmprojectcomplete = Global.getPermissionAll(permission,permission2,'confirmprojectcomplete-explorer', 'IsDisplay');
        this.isPermissionAll_planpayment = Global.getPermissionAll(permission,permission2,'planpayment-explorer', 'IsDisplay');
        this.isPermissionAll_financialreport = Global.getPermissionAll(permission,permission2,'financialreport-explorer', 'IsDisplay');
        this.isPermissionAll_plancostoffice = Global.getPermissionAll(permission,permission2,'plancostoffice-explorer', 'IsDisplay');
        this.isPermissionAll_regcontractmaintenance = Global.getPermissionAll(permission,permission2,'regcontractmaintenance-explorer', 'IsDisplay');

        this.isPermissionAll_commanddoc = Global.getPermissionAll(permission,permission2,'commanddoc', 'IsDisplay');
        this.isPermissionAll_commandtckt = Global.getPermissionAll(permission,permission2,'commandtckt', 'IsDisplay');
        this.isPermissionAll_commandbdsdt = Global.getPermissionAll(permission,permission2,'commandbdsdt', 'IsDisplay');
        this.isPermissionAll_commandquanlykho = Global.getPermissionAll(permission,permission2,'commandquanlykho', 'IsDisplay');
        this.isPermissionAll_unc = Global.getPermissionAll(permission,permission2,'unc-explorer', 'IsDisplay');
        this.isPermissionAll_confirmprofile = Global.getPermissionAll(permission,permission2,'confirmprofile-explorer', 'IsDisplay');
        this.isPermissionAll_investtask = Global.getPermissionAll(permission,permission2,'investtask-explorer', 'IsDisplay');
        this.isPermissionAll_buyingtask = Global.getPermissionAll(permission,permission2,'buyingtask-explorer', 'IsDisplay');
        this.isPermissionAll_billinvestor = Global.getPermissionAll(permission,permission2,'billinvestor-explorer', 'IsDisplay');
        this.isPermissionAll_billinvesment = Global.getPermissionAll(permission,permission2,'billinvesment-explorer', 'IsDisplay');
        this.isPermissionAll_boqinvestor = Global.getPermissionAll(permission,permission2,'boqinvestor-explorer', 'IsDisplay');
        this.isPermissionAll_spendingplan = Global.getPermissionAll(permission,permission2,'spendingplan-explorer', 'IsDisplay');
        this.isPermissionAll_internaldocument = Global.getPermissionAll(permission,permission2,'internaldocument-explorer', 'IsDisplay');
        this.isPermissionAll_profiledocument = Global.getPermissionAll(permission,permission2,'profiledocument-explorer', 'IsDisplay');
        this.isPermissionAll_regcontractinvestor = Global.getPermissionAll(permission,permission2,'regcontractinvestor-explorer', 'IsDisplay');
        this.isPermissionAll_regcontractccminvestor = Global.getPermissionAll(permission,permission2,'regcontractccminvestor-explorer', 'IsDisplay');
        this.isPermissionAll_regcontractinvestorview = Global.getPermissionAll(permission,permission2,'regcontractinvestorview-explorer', 'IsDisplay');
        this.isPermissionAll_registeremail = Global.getPermissionAll(permission,permission2,'registeremail-explorer', 'IsDisplay');
        this.isPermissionAll_registeruser = Global.getPermissionAll(permission,permission2,'registeruser-explorer', 'IsDisplay');
        this.isPermissionAll_cancelregistrationemail = Global.getPermissionAll(permission,permission2,'cancelregistrationemail-explorer', 'IsDisplay');
        this.isPermissionAll_guaranteetask = Global.getPermissionAll(permission,permission2,'guaranteetask-explorer', 'IsDisplay');
        this.isPermissionAll_guaranteetaskatch = Global.getPermissionAll(permission,permission2,'guaranteetaskatch-explorer', 'IsDisplay');
        this.isPermissionAll_deposittask = Global.getPermissionAll(permission,permission2,'deposittask-explorer', 'IsDisplay');
        this.isPermissionAll_falnloctask = Global.getPermissionAll(permission,permission2,'falnloctask-explorer', 'IsDisplay');
        this.isPermissionAll_liquidationasset = Global.getPermissionAll(permission,permission2,'liquidationasset-explorer', 'IsDisplay');
        this.isPermissionAll_proposalrevenueexpen = Global.getPermissionAll(permission,permission2,'proposalrevenueexpen-explorer', 'IsDisplay');
        this.isPermissionAll_proposalquarterly = Global.getPermissionAll(permission,permission2,'proposalquarterly-explorer', 'IsDisplay');
        this.isPermissionAll_documentary = Global.getPermissionAll(permission,permission2,'documentary-explorer', 'IsDisplay');
        this.isPermissionAll_examinationrecords = Global.getPermissionAll(permission,permission2,'examinationrecords-explorer', 'IsDisplay');
        this.isPermissionAll_lettertopartner = Global.getPermissionAll(permission,permission2,'lettertopartner-explorer', 'IsDisplay');
        this.isPermissionAll_requestsadvances = Global.getPermissionAll(permission,permission2,'requestsadvances-explorer', 'IsDisplay');
        this.isPermissionAll_requestsreimbursement = Global.getPermissionAll(permission,permission2,'requestsreimbursement-explorer', 'IsDisplay');
        this.isPermissionAll_planequipcost = Global.getPermissionAll(permission,permission2,'planequipcost-explorer', 'IsDisplay');
        this.isPermissionAll_planlossdetail = Global.getPermissionAll(permission,permission2,'planlossdetail-explorer', 'IsDisplay');
        this.isPermissionAll_plancashflowsite = Global.getPermissionAll(permission,permission2,'plancashflowsite-explorer', 'IsDisplay');
        this.isPermissionAll_costdeduction = Global.getPermissionAll(permission,permission2,'costdeduction-explorer', 'IsDisplay');
        this.isPermissionAll_plantimekeeping = Global.getPermissionAll(permission,permission2,'plantimekeeping-explorer', 'IsDisplay');
        this.isPermissionAll_plantimekeeping = Global.getPermissionAll(permission,permission2,'plantimekeeping-explorer', 'IsDisplay');
        this.isPermissionAll_planquantity = Global.getPermissionAll(permission,permission2,'planquantity-explorer', 'IsDisplay');
        this.isPermissionAll_partnerevaluation = Global.getPermissionAll(permission,permission2,'partnerevaluation-explorer', 'IsDisplay');

        this.isPermissionAll_commandcontract = Global.getPermissionAll(permission,permission2,'commandcontract', 'IsDisplay');
        this.isPermissionAll_regcontract = Global.getPermissionAll(permission,permission2,'regcontract-explorer', 'IsDisplay');
        this.isPermissionAll_reginvestmentcontract = Global.getPermissionAll(permission,permission2,'reginvestmentcontract-explorer', 'IsDisplay');
        this.isPermissionAll_contract = Global.getPermissionAll(permission,permission2,'contract-explorer', 'IsDisplay'); 
        this.isPermissionAll_appendix = Global.getPermissionAll(permission,permission2,'appendix-explorer', 'IsDisplay');  
        this.isPermissionAll_regcontract_view = Global.getPermissionAll(permission,permission2,'regcontract_view-explorer', 'IsDisplay');
        this.isPermissionAll_regcontract_viewCT = Global.getPermissionAll(permission,permission2,'regcontract_viewCT-explorer', 'IsDisplay');
        this.isPermissionAll_billpaysupp_view = Global.getPermissionAll(permission,permission2,'billpaysupp_view-explorer', 'IsDisplay');

        this.isPermissionAll_commandbill = Global.getPermissionAll(permission,permission2,'commandbill', 'IsDisplay');        

        this.isPermissionAll_commandbillpay = Global.getPermissionAll(permission,permission2,'commandbillpay', 'IsDisplay');
        this.isPermissionAll_billpayteam = Global.getPermissionAll(permission,permission2,'billpayteam-explorer', 'IsDisplay');
        this.isPermissionAll_billpaysupp = Global.getPermissionAll(permission,permission2,'billpaysupp-explorer', 'IsDisplay');
        this.isPermissionAll_depositcontract = Global.getPermissionAll(permission,permission2,'depositcontract-explorer', 'IsDisplay');
        this.isPermissionAll_creditcontract = Global.getPermissionAll(permission,permission2,'creditcontract-explorer', 'IsDisplay');
        this.isPermissionAll_billpaysuppedit = Global.getPermissionAll(permission,permission2,'billpaysuppedit-explorer', 'IsDisplay');
        this.isPermissionAll_billpaybuilding = Global.getPermissionAll(permission,permission2,'billpaybuilding-explorer', 'IsDisplay');
        this.isPermissionAll_billpaymain = Global.getPermissionAll(permission,permission2,'billpaymain-explorer', 'IsDisplay');
        this.isPermissionAll_billpaydept = Global.getPermissionAll(permission,permission2,'billpaydept-explorer', 'IsDisplay');        
        this.isPermissionAll_billeditpaydept = Global.getPermissionAll(permission,permission2,'billeditpaydept-explorer', 'IsDisplay');        
        this.isPermissionAll_billeditpayteam = Global.getPermissionAll(permission,permission2,'billeditpayteam-explorer', 'IsDisplay');        
        this.isPermissionAll_billewi = Global.getPermissionAll(permission,permission2,'billewi-explorer', 'IsDisplay');        
        this.isPermissionAll_billinternalequip = Global.getPermissionAll(permission,permission2,'billinternalequip-explorer', 'IsDisplay');   
        this.isPermissionAll_debtcollection = Global.getPermissionAll(permission,permission2,'debtcollection-explorer', 'IsDisplay');  
        this.isPermissionAll_setlementstatus = Global.getPermissionAll(permission,permission2,'setlementstatus-explorer', 'IsDisplay');  
        this.isPermissionAll_settlementrecords = Global.getPermissionAll(permission,permission2,'settlementrecords-explorer', 'IsDisplay');  
        this.isPermissionAll_plansignstatus = Global.getPermissionAll(permission,permission2,'plansignstatus-explorer', 'IsDisplay');        
        this.isPermissionAll_deadlineproject = Global.getPermissionAll(permission,permission2,'deadlineproject-explorer', 'IsDisplay');        
        this.isPermissionAll_billpayequipment = Global.getPermissionAll(permission,permission2,'billpayequipment-explorer', 'IsDisplay'); 
        this.isPermissionAll_billeditpayequipment = Global.getPermissionAll(permission,permission2,'billeditpayequipment-explorer', 'IsDisplay'); 
        this.isPermissionAll_consdocument = Global.getPermissionAll(permission,permission2,'consdocument-explorer', 'IsDisplay');
        this.isPermissionAll_docaftersales = Global.getPermissionAll(permission,permission2,'docaftersales-explorer', 'IsDisplay');
        this.isPermissionAll_planaftersales = Global.getPermissionAll(permission,permission2,'planaftersales-explorer', 'IsDisplay');
        this.isPermissionAll_paymentproposal = Global.getPermissionAll(permission,permission2,'paymentproposal-explorer', 'IsDisplay');
        this.isPermissionAll_paymentextraproposal = Global.getPermissionAll(permission,permission2,'paymentextraproposal-explorer', 'IsDisplay');
        this.isPermissionAll_paymentmeproposal = Global.getPermissionAll(permission,permission2,'paymentmeproposal-explorer', 'IsDisplay');
        this.isPermissionAll_paymentccmproposal = Global.getPermissionAll(permission,permission2,'paymentccmproposal-explorer', 'IsDisplay');
        this.isPermissionAll_paymentproposaltotal = Global.getPermissionAll(permission,permission2,'paymentproposaltotal-explorer', 'IsDisplay');
        this.isPermissionAll_approveddocaftersalessurvay = Global.getPermissionAll(permission,permission2,'approveddocaftersalessurvay-explorer', 'IsDisplay');

        this.isPermissionAll_commandsettlement = Global.getPermissionAll(permission,permission2,'commandsettlement', 'IsDisplay');
        this.isPermissionAll_settlement = Global.getPermissionAll(permission,permission2,'settlement-explorer', 'IsDisplay');    
        this.isPermissionAll_safepunish = Global.getPermissionAll(permission,permission2,'safepunish-explorer', 'IsDisplay');    
        this.isPermissionAll_mainlement = Global.getPermissionAll(permission,permission2,'mainlement-explorer', 'IsDisplay');    
        this.isPermissionAll_planclaim = Global.getPermissionAll(permission,permission2,'planclaim-explorer', 'IsDisplay'); 
        this.isPermissionAll_planequipclaim = Global.getPermissionAll(permission,permission2,'planequipclaim-explorer', 'IsDisplay'); 
        this.isPermissionAll_settlementclaim = Global.getPermissionAll(permission,permission2,'settlementclaim-explorer', 'IsDisplay'); 
        this.isPermissionAll_planccmclaim = Global.getPermissionAll(permission,permission2,'planccmclaim-explorer', 'IsDisplay'); 
        this.isPermissionAll_planclaimvalue = Global.getPermissionAll(permission,permission2,'planclaimvalue-explorer', 'IsDisplay');      
        
        this.isPermissionAll_commanddocument = Global.getPermissionAll(permission,permission2,'commanddocument', 'IsDisplay');
        this.isPermissionAll_supportlltc = Global.getPermissionAll(permission,permission2,'supportlltc-explorer', 'IsDisplay');
        this.isPermissionAll_tenderselection = Global.getPermissionAll(permission,permission2,'tenderselection-explorer', 'IsDisplay');
        this.isPermissionAll_settlement_doc = Global.getPermissionAll(permission,permission2,'settlement_doc-explorer', 'IsDisplay');

        this.isPermissionAll_commandreportccm = Global.getPermissionAll(permission,permission2,'commandreportccm', 'IsDisplay');
        this.isPermissionAll_reporterplancostrevcons = Global.getPermissionAll(permission,permission2,'reporterplancostrevcons', 'IsDisplay');
        this.isPermissionAll_reporterpn = Global.getPermissionAll(permission,permission2,'reporterpn', 'IsDisplay');
        this.isPermissionAll_reporterpx = Global.getPermissionAll(permission,permission2,'reporterpx', 'IsDisplay');
        this.isPermissionAll_reporterplancostme = Global.getPermissionAll(permission,permission2,'reporterplancostme', 'IsDisplay');
        this.isPermissionAll_reporterplancostoffice = Global.getPermissionAll(permission,permission2,'reporterplancostoffice', 'IsDisplay');
        this.isPermissionAll_reporterbillpaydept = Global.getPermissionAll(permission,permission2,'reporterbillpaydept', 'IsDisplay');
        this.isPermissionAll_reportertonghopthanhtoan = Global.getPermissionAll(permission,permission2,'reportertonghopthanhtoan', 'IsDisplay');
        this.isPermissionAll_reporterplancostrevcons_ss = Global.getPermissionAll(permission,permission2,'reporterplancostrevcons_ss', 'IsDisplay');
        this.isPermissionAll_reporterplancostoffice_ss = Global.getPermissionAll(permission,permission2,'reporterplancostoffice_ss', 'IsDisplay');
        this.isPermissionAll_reporterplansigncon = Global.getPermissionAll(permission,permission2,'reporterplansigncon', 'IsDisplay');    
        this.isPermissionAll_reporterbctctonghop = Global.getPermissionAll(permission,permission2,'reporterbctctonghop', 'IsDisplay');                
        this.isPermissionAll_reporterpricingcal = Global.getPermissionAll(permission,permission2,'reporterpricingcal', 'IsDisplay');
        this.isPermissionAll_reporterkehoachquy = Global.getPermissionAll(permission,permission2,'reporterkehoachquy', 'IsDisplay');
        this.isPermissionAll_reporterdoanhthuchiphi = Global.getPermissionAll(permission,permission2,'reporterdoanhthuchiphi', 'IsDisplay');
        this.isPermissionAll_reporterdutrudaucongtruong = Global.getPermissionAll(permission,permission2,'reporterdutrudaucongtruong', 'IsDisplay');
        this.isPermissionAll_reporterdoanhthuchiphithang = Global.getPermissionAll(permission,permission2,'reporterdoanhthuchiphithang', 'IsDisplay');
        this.isPermissionAll_reporterdongthutheocongno = Global.getPermissionAll(permission,permission2,'reporterdongthutheocongno', 'IsDisplay');
        this.isPermissionAll_reporterdoanhthuchiphithanggddh = Global.getPermissionAll(permission,permission2,'reporterdoanhthuchiphithanggddh', 'IsDisplay');
        this.isPermissionAll_reporterkhoiluongthuchienthang = Global.getPermissionAll(permission,permission2,'reporterkhoiluongthuchienthang', 'IsDisplay');
        this.isPermissionAll_reporterbillthanhtoan = Global.getPermissionAll(permission,permission2,'reporterbillthanhtoan', 'IsDisplay');
        this.isPermissionAll_reporterbillequip = Global.getPermissionAll(permission,permission2,'reporterbillequip', 'IsDisplay');
        this.isPermissionAll_reporterthuchi = Global.getPermissionAll(permission,permission2,'reporterthuchi', 'IsDisplay');
        this.isPermissionAll_reporterplanquantity = Global.getPermissionAll(permission,permission2,'reporterplanquantity', 'IsDisplay');
        this.isPermissionAll_reporterchiphithoidiem = Global.getPermissionAll(permission,permission2,'reporterchiphithoidiem', 'IsDisplay');
        this.isPermissionAll_reporterhanthanhtoan = Global.getPermissionAll(permission,permission2,'reporterhanthanhtoan', 'IsDisplay');
        this.isPermissionAll_reporterplancashflowsite = Global.getPermissionAll(permission,permission2,'reporterplancashflowsite', 'IsDisplay');
        this.isPermissionAll_reporterclaimchuaduyet = Global.getPermissionAll(permission,permission2,'reporterclaimchuaduyet', 'IsDisplay');
        this.isPermissionAll_reporterclaimmoinhat = Global.getPermissionAll(permission,permission2,'reporterclaimmoinhat', 'IsDisplay');
        this.isPermissionAll_reportercongno = Global.getPermissionAll(permission,permission2,'reportercongno', 'IsDisplay');
        this.isPermissionAll_reportercpbch = Global.getPermissionAll(permission,permission2,'reportercpbch', 'IsDisplay');
        this.isPermissionAll_reportercpvp = Global.getPermissionAll(permission,permission2,'reportercpvp', 'IsDisplay');
        this.isPermissionAll_reporterplanpayment = Global.getPermissionAll(permission,permission2,'reporterplanpayment', 'IsDisplay');
        this.isPermissionAll_reporterbillthanhtoan_mh = Global.getPermissionAll(permission,permission2,'reporterbillthanhtoan_mh', 'IsDisplay');
        this.isPermissionAll_reporterdutruthanhtoan_mh = Global.getPermissionAll(permission,permission2,'reporterdutruthanhtoan_mh', 'IsDisplay');
        this.isPermissionAll_reportertitrongmuahang = Global.getPermissionAll(permission,permission2,'reportertitrongmuahang', 'IsDisplay');
        this.isPermissionAll_reporterphanbocpns = Global.getPermissionAll(permission,permission2,'reporterphanbocpns', 'IsDisplay');
        this.isPermissionAll_reporterproducthuman = Global.getPermissionAll(permission,permission2,'reporterproducthuman', 'IsDisplay');
        this.isPermissionAll_rep01_bkddh_mua = Global.getPermissionAll(permission,permission2,'rep01_bkddh_mua', 'IsDisplay');
        this.isPermissionAll_rep02_thddh_mua = Global.getPermissionAll(permission,permission2,'rep02_thddh_mua', 'IsDisplay');
        this.isPermissionAll_rep03_supplierlist = Global.getPermissionAll(permission,permission2,'rep03_supplierlist', 'IsDisplay');
        this.isPermissionAll_rep03_menulist = Global.getPermissionAll(permission,permission2,'rep03_menulist', 'IsDisplay');
        this.isPermissionAll_rep04_lichsubiendonggia = Global.getPermissionAll(permission,permission2,'rep04_lichsubiendonggia', 'IsDisplay');
        this.isPermissionAll_rep05_kehoachmuahang = Global.getPermissionAll(permission,permission2,'rep05_kehoachmuahang', 'IsDisplay'); 
        this.isPermissionAll_rep05_kehoachbetong = Global.getPermissionAll(permission,permission2,'reporterconcretebudget', 'IsDisplay');          
        this.isPermissionAll_rep05_haohutvattu = Global.getPermissionAll(permission,permission2,'rep05_haohutvattu', 'IsDisplay');        
        this.isPermissionAll_reportercongnohoadon = Global.getPermissionAll(permission,permission2,'reportercongnohoadon', 'IsDisplay');
        this.isPermissionAll_reporterincurred = Global.getPermissionAll(permission,permission2,'reporterincurred', 'IsDisplay');
        this.isPermissionAll_reporterdebtcollection = Global.getPermissionAll(permission,permission2,'reporterdebtcollection', 'IsDisplay');
        this.isPermissionAll_reporterdocumentary = Global.getPermissionAll(permission,permission2,'reporterdocumentary', 'IsDisplay');
        this.isPermissionAll_reportersettelement = Global.getPermissionAll(permission,permission2,'reportersettelement', 'IsDisplay');
        this.isPermissionAll_reporterpartnerevaluation = Global.getPermissionAll(permission,permission2,'reporterpartnerevaluation', 'IsDisplay');
        this.isPermissionAll_reporterpropose = Global.getPermissionAll(permission,permission2,'reporterpropose', 'IsDisplay');
        this.isPermissionAll_reporterclaim = Global.getPermissionAll(permission,permission2,'reporterclaim', 'IsDisplay');
        this.isPermissionAll_planstaffcost = Global.getPermissionAll(permission,permission2,'planstaffcost-explorer', 'IsDisplay');
        this.isPermissionAll_planprojectinex = Global.getPermissionAll(permission,permission2,'planprojectinex-explorer', 'IsDisplay');

        this.isPermissionAll_commandecommerce = Global.getPermissionAll(permission,permission2,'commandecommerce', 'IsDisplay');
        this.isPermissionAll_itemgrouplist = Global.getPermissionAll(permission,permission2,'itemgrouplist-explorer', 'IsDisplay'); 
        this.isPermissionAll_itemslist = Global.getPermissionAll(permission,permission2,'itemslist-explorer', 'IsDisplay'); 
        this.isPermissionAll_invoicecost = Global.getPermissionAll(permission,permission2,'invoicecost-explorer', 'IsDisplay'); 
        this.isPermissionAll_incurred = Global.getPermissionAll(permission,permission2,'incurred-explorer', 'IsDisplay'); 
        this.isPermissionAll_registerincurred = Global.getPermissionAll(permission,permission2,'registerincurred-explorer', 'IsDisplay'); 
        this.isPermissionAll_incurredccm = Global.getPermissionAll(permission,permission2,'incurredccm-explorer', 'IsDisplay'); 
        this.isPermissionAll_baremlist = Global.getPermissionAll(permission,permission2,'baremlist-explorer', 'IsDisplay');   
        this.isPermissionAll_projectlist = Global.getPermissionAll(permission,permission2,'projectlist-explorer', 'IsDisplay');  
        this.isPermissionAll_equiplist = Global.getPermissionAll(permission,permission2,'equiplist-explorer', 'IsDisplay');  
        this.isPermissionAll_groupequiplist = Global.getPermissionAll(permission,permission2,'groupequiplist-explorer', 'IsDisplay');  
        this.isPermissionAll_productlist = Global.getPermissionAll(permission,permission2,'productlist-explorer', 'IsDisplay');  
        this.isPermissionAll_receiptteam = Global.getPermissionAll(permission,permission2,'receiptteam-explorer', 'IsDisplay');  
        this.isPermissionAll_trademark = Global.getPermissionAll(permission,permission2,'trademark-explorer', 'IsDisplay');  
        this.isPermissionAll_supplierquotes = Global.getPermissionAll(permission,permission2,'supplierquotes-explorer', 'IsDisplay');   
        this.isPermissionAll_supplierquotesinvite = Global.getPermissionAll(permission,permission2,'supplierquotesinvite-explorer', 'IsDisplay');      
        this.isPermissionAll_proposedpurchase2 = Global.getPermissionAll(permission,permission2,'proposedpurchase2-explorer', 'IsDisplay'); 
        
        this.isPermissionAll_performwarranty = Global.getPermissionAll(permission,permission2,'performwarranty-explorer', 'IsDisplay'); 
        this.isPermissionAll_solpp = Global.getPermissionAll(permission,permission2,'solpp-explorer', 'IsDisplay'); 
        this.isPermissionAll_solpn = Global.getPermissionAll(permission,permission2,'solpn-explorer', 'IsDisplay'); 
        this.isPermissionAll_imwarematerials = Global.getPermissionAll(permission,permission2,'imwarematerials-explorer', 'IsDisplay'); 
        this.isPermissionAll_imsolpoconcrete = Global.getPermissionAll(permission,permission2,'imsolpoconcrete-explorer', 'IsDisplay'); 
        this.isPermissionAll_exwarematerials = Global.getPermissionAll(permission,permission2,'exwarematerials-explorer', 'IsDisplay'); 
        this.isPermissionAll_solpx = Global.getPermissionAll(permission,permission2,'solpx-explorer', 'IsDisplay'); 
                                          
        this.isPermissionAll_proposedpurchase3 = Global.getPermissionAll(permission,permission2,'proposedpurchase3-explorer', 'IsDisplay');   
        this.isPermissionAll_proposedpurchase4 = Global.getPermissionAll(permission,permission2,'proposedpurchase4-explorer', 'IsDisplay');              
        this.isPermissionAll_purchaseorder = Global.getPermissionAll(permission,permission2,'purchaseorder-explorer', 'IsDisplay');
        this.isPermissionAll_purchasebchorder = Global.getPermissionAll(permission,permission2,'purchasebchorder-explorer', 'IsDisplay');
        this.isPermissionAll_purchaseotherorder = Global.getPermissionAll(permission,permission2,'purchaseotherorder-explorer', 'IsDisplay');
        this.isPermissionAll_solpoconcrete = Global.getPermissionAll(permission,permission2,'solpoconcrete-explorer', 'IsDisplay');
        this.isPermissionAll_concreteloss = Global.getPermissionAll(permission,permission2,'concreteloss-explorer', 'IsDisplay');
        this.isPermissionAll_steelloss = Global.getPermissionAll(permission,permission2,'steelloss-explorer', 'IsDisplay');
        this.isPermissionAll_purchaseorder2 = Global.getPermissionAll(permission,permission2,'purchaseorder2-explorer', 'IsDisplay');        
        this.isPermissionAll_purchasingnote = Global.getPermissionAll(permission,permission2,'purchasingnote-explorer', 'IsDisplay');    
        this.isPermissionAll_supplierinfo = Global.getPermissionAll(permission,permission2,'supplierinfo-explorer', 'IsDisplay');   
        this.isPermissionAll_supplierinvoice = Global.getPermissionAll(permission,permission2,'supplierinvoice-explorer', 'IsDisplay');
        this.isPermissionAll_purchaseotherbudget = Global.getPermissionAll(permission,permission2,'purchaseotherbudget-explorer', 'IsDisplay');    
        this.isPermissionAll_auxiliarymaterialsbuget = Global.getPermissionAll(permission,permission2,'auxiliarymaterialsbuget-explorer', 'IsDisplay');    
        this.isPermissionAll_auxiliarymaterialsorder = Global.getPermissionAll(permission,permission2,'auxiliarymaterialsorder-explorer', 'IsDisplay');    
        this.isPermissionAll_purchasebudget = Global.getPermissionAll(permission,permission2,'purchasebudget-explorer', 'IsDisplay');  
        this.isPermissionAll_concretebudget = Global.getPermissionAll(permission,permission2,'concretebudget-explorer', 'IsDisplay');    
        this.isPermissionAll_categorylist = Global.getPermissionAll(permission,permission2,'categorylist-explorer', 'IsDisplay');
        this.isPermissionAll_customer = Global.getPermissionAll(permission,permission2,'customer-explorer', 'IsDisplay');
        this.isPermissionAll_pricelibrary = Global.getPermissionAll(permission,permission2,'pricelibrary-explorer', 'IsDisplay');

        if (localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '') != 'N01')
            this.isPermissionAll_TMDvcs = false;
        else
            this.isPermissionAll_TMDvcs = true;
    }

    get showUserName()
    {
        return JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USERNAME));
    }

    get showUserFullName() {
        return JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USERFULLNAME));
    }
    
    getPermission(commandKey: string, option: string)
    {
        return Global.getPermission(commandKey,option);
    }

    getPermissionPosition(commandKey: string, option: string)
    {
        return Global.getPermissionPosition(commandKey,option);
    }

    getModule(commandKey: string)
    {
        let moduleUser = localStorage.getItem(SystemConstants.MODULE_ALLOW);
        let modulePerm = Global.getModule(commandKey,localStorage.getItem(SystemConstants.CURRENT_USERID));
        moduleUser = moduleUser.replace(/"/gi,'');
        if (moduleUser == modulePerm || moduleUser == '')
        {
            return 1;
        }
    }

    clickItem(e) {
        let _aTag = e.target;
        if (_aTag instanceof HTMLElement) {
            if (this.currentActive) {
                this.currentActive.classList.remove('active');
            }

            _aTag.parentElement.classList.add('active');
            this.currentActive = _aTag.parentElement;
        }
    }

    clickParentItem(e) {
        // if (this.currentActive && !this.currentActive.classList.contains('active')) {
        //     this.currentActive.classList.add('active');
        // }
    }

    ngOnDestroy(): void {
    }
}