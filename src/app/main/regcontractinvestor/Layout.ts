import { PanelBase } from "../../ui/panel/PanelBase";
import { TablePanel } from "../../ui/panel/TablePanel";
import { DateBoxInput } from "../../ui/input/DateBoxInput";
import { TextBoxInput } from "../../ui/input/TextBoxInput";
import { LookupBoxInput } from "../../ui/input/LookupBoxInput";
import { Validators } from "@angular/forms";
import { ButtonInput } from "../../ui/input/ButtonInput";
import { CheckBoxInput } from "../../ui/input/CheckBoxInput";
import { NumberBoxInput } from "../../ui/input/NumberBoxInput";
import { IEditorFormulaDeclaration } from ".././IEditorDeclare";
import { IExplorerFormulaDeclaration } from ".././IExplorerDeclare";
import { UploadInput } from "../../ui/input/UploadInput";
import { MultiSelectInput } from "../../ui/input/MultiSelectInput";
import { SystemConstants } from "../../core/common/system.constants";
import { UploadImage } from "../../ui/input/UploadImage";
import { getElement } from "wijmo/wijmo";
import { RichTextBoxInput } from "../../ui/input/RichTextBoxInput";
import { Global } from "../../shared/global";

// *********************************HỢP ĐỒNG, PHỤ LỤC, QUYẾT TOÁN

// Trình ký hợp đồng, phụ lục
export class LayoutRegContractInvestorExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_Explore',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode='C2' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'ProductName,CustomerName',
                RowPage: 50
            },
            Child: {
                Name: 'vB30BizDocApprove_Explorer',
                ParentKey: 'BizDocId',
                ChildKey: 'BizDocId'
            }
        },
        PrintDocument: {
            Key: 'Viewer_TCBN',
            Text: 'Mẫu in trình ký HĐ, PLHĐ - {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_Coteccons_WorkFlow_GetPrintData',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: 'MAU9',
                    Name: 'WorkFlow',
                    FileName: 'WorkFlow HĐ,PLHĐ - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}',
                    WordName: 'WorkFlow_HD_CDT.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ]
        }
    }

    parentGrid = [
        {
            header: 'Đối tác',
            binding: 'CustomerName',
            width: 300
        },
        {
            header: 'Nội dung hợp đồng',
            binding: 'DocName',
            width: 300
        },
        {
            header: 'Số',
            binding: 'DocNo',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Ngày lập',
            binding: 'DocDate',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        // {
        //     header: 'Công việc',
        //     binding: 'JobCode',
        //     width: 100
        // },
        {
            header: 'Ngày hoàn thiện duyệt',
            binding: 'FinishDate',
            width: 180,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Giá trị HĐ (chưa VAT)',
            binding: 'ContractValue',
            width: 180,
            dataType: 'Number'
        },
        {
            header: 'Giá trị PLHĐ (chưa VAT)',
            binding: 'SubContractValue',
            width: 180,
            dataType: 'Number'
        },
        {
            header: 'Đã gửi duyệt',
            binding: 'ApproveSend',
            width: 150,
            dataType: 'Boolean'
        },
        {
            header: 'Hoàn thiện duyệt',
            binding: 'CompletedApprove',
            width: 100,
            dataType: 'Boolean'
        },
        // {
        //     header: 'Hồ sơ hủy',
        //     binding: 'ClosedApprove',
        //     width: 80,
        //     dataType: 'Boolean'
        // },
        {
            header: 'Đang xử lý',
            binding: 'XuLyTiepTheo',
            width: 150,
            dataType: 'String'
        },
        // {
        //     header: 'Số quyết toán',
        //     binding: 'DocNo_C5',
        //     width: 200,
        //     dataType: 'String'
        // },
        {
            header: 'Gói thầu/ PB',
            binding: 'ProductName',
            width: 0,
            dataType: 'String'
        },
        {
            header: 'Người lập',
            binding: 'FullName',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Người gửi duyệt',
            binding: 'EmployeeNameSend',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Id',
            binding: 'Id',
            width: 50,
            dataType: 'Number'
        },
        {
            header: 'Mã Ct',
            binding: 'DocCode',
            width: 0
        }
    ]

    childGrid = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
        },
        // {
        //     header: 'Bộ phận',
        //     binding: 'DeptName',
        //     width: 250,
        //     dataType: 'String'
        // },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 200,
            dataType: 'String'
        },
        // {
        //     header: 'Người thực hiện',
        //     binding: 'EmployeeName',
        //     width: 150
        // },
        {
            header: 'Người đã thực hiện',
            binding: 'EmployeeNameApprove',
            width: 150
        },
        {
            header: 'Đã xử lý',
            binding: 'ApproveStatus',
            width: 80,
            dataType: 'Boolean',
            textAlign: 'center'
        },
        {
            header: 'Trạng thái',
            binding: 'ApproveStatusName',
            width: 100
        },
        {
            header: 'Ý kiến',
            binding: 'Comment',
            width: 200,
            dataType: 'String',
            isContentHtml: true
        },
        {
            header: 'Số ngày thực hiện',
            binding: 'NumberOfDays',
            width: 150,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Ngày đến hạn',
            binding: 'StartDate',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy HH:mm'
        },
        {
            header: 'Ngày hoàn thành',
            binding: 'FinishDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy HH:mm',
            width: 150
        }
    ]
}

export class LayoutRegContractInvestorEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'C2',
                    BizDocId: '',
                    CurrencyCode: 'VND',
                    ExchangeRate: '1',
                    Id: -1,
                    IsWebData: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    ProductCostId0: '{VAR=Filter.ProductCostId}'
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocPayment_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        EstimatedPaymentDate: 'Parent.DocDate'
                    }
                },
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                    }
                },
                {
                    Name: 'vB30BizDocApprove_AEditContract',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId'
                },
                {
                    Name: 'vB30BizDocContactInfo_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30BizDocDetail_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        CustomerCode: 'Parent.CustomerCode',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                }
            ]
        },
        PrintDocument: {
            Key: 'Viewer_TCBN',
            Text: 'Mẫu in trình ký HĐ, PLHĐ - {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_Coteccons_WorkFlow_GetPrintData',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: 'MAU9',
                    Name: 'WorkFlow',
                    FileName: 'WorkFlow HĐ,PLHĐ - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}',
                    WordName: 'WorkFlow_HD_CDT.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }

            ],
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'BuiltinOrder',
                    width: 50,
                    dataType: 'Number',
                    align: 'center'
                },
                {
                    header: 'Tên file',
                    binding: 'FilePath',
                    width: 600,
                    dataType: 'String',
                    align: 'left'
                }
            ]
        }
    }

    evaluators = {
        'Evaluator_ValueOfWarranty_Caculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'ValueOfWarranty',
            Value: 'Math.round(ContractValueAddVAT*PercentOfWarranty)'
        },
        'Evaluator_ContractValueAddVAT_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'ContractValueAddVAT',
            Value: 'Math.round(ContractValue+(ContractValue*TaxRate))',
            zExpr: "IsAdjusted != 1",
        },
       
        'Evaluator_TotalOfValue_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'TotalOfValue',
            Value: 'SubContractBeforeValue+AmountRevised+ContractValue0'
        },
        'Evaluator_TotalOfValueAddVAT_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'TotalOfValueAddVAT',
            Value: 'SubContractBeforeValueAddVAT+TotalAmountRevisedAddVAT+ContractValueAddVAT0',
            
        },
        'Evaluator_Set_GuaranteePercent_1': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'GuaranteePercent',
            Value: "GuaranteeCheck == 1 ? PayPercent : 0",
            Tables: 0
        },
        'Evaluator_Set_OriginalAmount': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'OriginalAmount',
            Value: "'ClassCode1'== '00' || 'ClassCode1' =='01' ? Math.round(PayPercent*ContractValue_BindingWeb) : Math.round(PayPercent*ContractValueAddVAT_BindingWeb)",
            Tables: 0
        },
        'Evaluator_ContractValue_Reset': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'ContractValue',
            Value: "ValueByConstructReal == 1 ? 0 : ContractValue"
        },
        'Evaluator_AmountRevised_Autovalue': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'AmountRevised',
            Value: 'ContractValue',
          
        },
        'Evaluator_TotalAmountRevisedAddVAT_Autovalue': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'TotalAmountRevisedAddVAT',
            Value: 'Math.round(AmountRevised+(AmountRevised*TaxRate))'
        },
        //
        // 'Evaluator_Set_ContractValue_BindingWeb_FromParent': {
        //     EvaluatorName: 'EvaluatorBindingChild',
        //     DataMember: 'ContractValue_BindingWeb',
        //     Value: 'ContractValue',
        //     Tables: 0
        // },
        'Evaluator_Set_ContractValueAddVAT_BindingWeb_FromParent': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'ContractValueAddVAT_BindingWeb',
            Value: 'ContractValueAddVAT',
            Tables: 0
        },
        //        
        'Evaluator_ServerConstraint_CTC_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ParentBizDocId0,ProductCostId,ContractType,DocCode,{VAR=Branch.Ma_Dvcs},Id',
            Command: 'ufn_Coteccons_B30BizDoc_DefaultDocNo_CFMS',
            DataMember: 'DocNo2',
            zExpr: "ProductCostId != '' && ContractType != ''"
        },
        'Evaluator_ServerConstraint_GetActivityCode_FromJobCode': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'JobCode',
            Command: 'usp_Coteccons_GetActivityCode_FromJobCode',
            DataMember: 'ActivityCode'
        },
        'Evaluator_ServerConstraint_GetContractValue': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ParentBizDocId0',
            Command: 'usp_Update_GetContractValue',
            DataMember: 'ContractValue0,ContractValueAddVAT0'
        },
        'Evaluator_ServerConstraint_B30BizDoc_Check_Unique_DocNo': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},BizDocId,DocCode,DocNo',
            Command: 'ufn_B30BizDoc_CheckUniqueDocNo',
            zExpr: "DocNo != '' AND 1=2",
            MessageText: 'Số hợp đồng/PLHĐ đã tồn tại',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_DocDateWithDateOfProduct': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,DocDate',
            Command: 'ufn_Coteccons_CheckDateOfContract',
            zExpr: "ProductCostId != ''",
            MessageText: 'Ngày lập hồ sơ phải sau ngày bắt đầu của gói thầu',
            IgnoreError: 0
        },
       
        'Evaluator_ServerConstraint_DocumentDetail_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ContractType,{VAR=Branch.Ma_Dvcs},{VAR=IsGetPayment_False},DocCode',
            Command: 'usp_Web_B30BizDocDocument_GetData2',
            zExpr: 'ApproveSend == false',
            OutputTable: 1
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,{VAR=EmptyField_ParentBizDocId},ProductCostId0',
            Command: 'usp_B30BizDocApprove_GetData',
            OutputTable: 2
        },
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'BizDocId,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Conteccons_NotChangeWhenApproveSent',
            MessageText: 'Không được thay đổi khi đã gửi duyệt',
            IgnoreError: 0
        },
      
        'Evaluator_ServerConstraint_Check_GiaTriHDPLHD_BCTC': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,BizDocId,ParentBizDocId,JobCode,CustomerCode,ContractValue,SubContractValue,TaxRate,DocDate,ValueByConstructReal,CCMBudgetRowId,{VAR=Branch.Ma_Dvcs}",
            Command: 'ufn_Coteccons_HDPLHD_CheckGiaTri_BCTC',
            MessageText: 'Giá trị Hợp đồng + PLHĐ đã vượt quá hạn mức Kế hoạch doanh thu, chi phí - Liên hệ CHT cập nhật',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerConstraint_Check_GiaTriHDPLHD_KHKK': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,BizDocId,ParentBizDocId,JobCode,CustomerCode,ContractValue,SubContractValue,TaxRate,DocDate,ValueByConstructReal,CCMBudgetRowId,{VAR=Branch.Ma_Dvcs}",
            Command: 'ufn_Coteccons_HDPLHD_CheckGiaTri_KHKK',
            MessageText: 'Giá trị Hợp đồng + PLHĐ đã vượt quá hạn mức Kế hoạch ký kết Hợp đồng - Liên hệ QS cập nhật',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerConstraint_CheckCCMBudgetRowId_C3C4': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "DocCode,IsSubContractPay,CCMBudgetRowId,ProductType,ProductCostId",
            Command: 'ufn_Coteccons_CheckCCMBudgetRowId_C3C4',
            MessageText: 'Yêu cầu chỉ định "Giá trị dự trù" theo kế hoạch cho hợp đồng này.',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_CheckOpenAmount': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,ContractType,OpenKeepAmount",
            Command: 'ufn_SOL_B30BizDoc_RequireOpenAmount',
            MessageText: 'Yêu cầu khai báo Giá gốc (nếu có) hoặc nhập bằng không',
            IgnoreError: 0
        },
        //không đổi tên
        'Evaluator_UpdateApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Coteccons_B30BizDoc_SetApproveSend'
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},BizDocId,{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend_SongSong',
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerUpdated_UpdateValueOfC3C4': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,Id,DocCode,BizDocId_PL,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_UpdateValueOfC3C4',
            //zExpr: ""'BizDocId_PL != ''"
        },
        //PL A
        'Evaluator_Parent_ContractValue_Calculate': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "ContractValue",
            Value: 'OriginalAmount',
            Tables: 5
        },
        'Evaluator_ServerConstraint_SubContractBeforeValue': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,ParentBizDocId0,DocDate,{VAR=Branch.Ma_Dvcs},CreatedAt',
            Command: 'usp_Coteccons_C4_GiaTriPhuLucTruoc_C2',
            DataMember: 'SubContractBeforeValue,SubContractBeforeValueAddVAT'
        },
     
      
        'Evaluator_ServerUpdated_BizDocDetail_UpdateFromParent': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Coteccons_BizDocDetail_UpdateFromParentWEB_Calculate'
        }
    }

    serverConstraint = [
        'Evaluator_ServerConstraint_CTC_DefaultDocNo',
        'Evaluator_ServerConstraint_SubContractBeforeValue',
        'Evaluator_ServerConstraint_GetContractValue'
    ]

    serverUpdating: string[] = [
       
        // 'Evaluator_ServerConstraint_B30BizDoc_Check_Unique_DocNo',
        // 'Evaluator_ServerConstraint_Check_ApproveSent_NotChange'
    ]

    serverUpdated: string[] = [    
        'Evaluator_ServerUpdated_BizDocDetail_UpdateFromParent',
        'Evaluator_UpdateInfo_WhenApproveSend'
    ]

    buttonLoadChild: string[] = [
        // 'Evaluator_ServerConstraint_B30BizDoc_Check_Unique_DocNo',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange', 
        'Evaluator_ServerConstraint_DocumentDetail_GetData',
        'Evaluator_ServerConstraint_Approve_GetData'
    ]

    buttonCommand: string[] = [

    ]

    columnChanged = {
        TaxCode: {
            Evaluators: [
                'Evaluator_ContractValueAddVAT_Calculator',
                
                'Evaluator_TotalOfValue_Calculator',
                'Evaluator_TotalOfValueAddVAT_Calculator'
            ]
        },
       
        ParentBizDocId: {
            Evaluators: [

                // 'Evaluator_Set_ContractValue_BindingWeb_FromParent',
               'Evaluator_ContractValueAddVAT_Calculator',
               'Evaluator_AmountRevised_Autovalue',
               'Evaluator_TotalAmountRevisedAddVAT_Autovalue',
                'Evaluator_TotalOfValue_Calculator',
                'Evaluator_TotalOfValueAddVAT_Calculator'
            ]
        },
        ParentBizDocId0: {
            Evaluators: [

                // 'Evaluator_Set_ContractValue_BindingWeb_FromParent',
               'Evaluator_ContractValueAddVAT_Calculator',
               'Evaluator_AmountRevised_Autovalue',
               'Evaluator_TotalAmountRevisedAddVAT_Autovalue',
                'Evaluator_TotalOfValue_Calculator',
                'Evaluator_TotalOfValueAddVAT_Calculator'
            ]
        },
        ContractValue: {
            Evaluators: [

                // 'Evaluator_Set_ContractValue_BindingWeb_FromParent',
               'Evaluator_ContractValueAddVAT_Calculator',
               'Evaluator_AmountRevised_Autovalue',
               'Evaluator_TotalAmountRevisedAddVAT_Autovalue',
                'Evaluator_TotalOfValue_Calculator',
                'Evaluator_TotalOfValueAddVAT_Calculator'
            ]
        },
        ContractValueAddVAT: {
            Evaluators: [
                // 'Evaluator_Set_ContractValueAddVAT_BindingWeb_FromParent',
                
               'Evaluator_TotalAmountRevisedAddVAT_Autovalue',
                'Evaluator_TotalOfValue_Calculator',
                'Evaluator_TotalOfValueAddVAT_Calculator'
            ]
        },
        AmountRevised: {
            Evaluators: [
                'Evaluator_TotalOfValue_Calculator',
                'Evaluator_TotalOfValueAddVAT_Calculator',
                'Evaluator_TotalAmountRevisedAddVAT_Autovalue'
            ]
        },
        TotalAmountRevisedAddVAT: {
            Evaluators: [
                
                'Evaluator_TotalOfValueAddVAT_Calculator'
            ]
        },

        ProcessCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_Approve_GetData'
            ]
        },
        ContractType: {
            Evaluators: [
                'Evaluator_ServerConstraint_DocumentDetail_GetData'
            ]
        },
        SubContractValue: {
            Evaluators: [
                
                'Evaluator_TotalOfValue_Calculator',
                'Evaluator_TotalOfValueAddVAT_Calculator'
            ]
        }
    };

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
                GuaranteeCheck: {
                    Evaluators: [
                        'Evaluator_Set_GuaranteePercent_1'
                    ]
                },
                PayPercent: {
                    Evaluators: [
                        'Evaluator_Set_OriginalAmount',
                        'Evaluator_Set_GuaranteePercent_1'
                    ]
                },
                ContractValue_BindingWeb: {
                    Evaluators: [
                        'Evaluator_Set_OriginalAmount'
                    ]
                },
                ContractValueAddVAT_BindingWeb: {
                    Evaluators: [
                        'Evaluator_Set_OriginalAmount'
                    ]
                }
            }
        }
    ];

    columnsReadOnly = [];

    linkReporter = {
        'btnPhuLucA': {
            directory: 'unitprice',
            type: 'detail',//bao cao: view, explorer: index, editor: detail
            key: 'Id_PLA',
            parameter: { 'Commandkey': 'unitprice-editor', 'ProductCostId': '{EXPR=ProductCostId}', 'ParentBizDocId': '{EXPR=BizDocId}', 'DocDate': '{EXPR=DocDate}', 'CustomerCode': '{EXPR=CustomerCode}', 'TaxCode': '{EXPR=TaxCode}', 'TaxRate': '{EXPR=TaxRate}', 'ParentId': '{EXPR=Id}' }
        },
        'btnAccountAtch': {
            directory: 'regcontractattach',
            type: 'detail',
            parameter: { 'Commandkey': 'regcontractattach-editor' },
            key: 'Id'
        },
        'btnHdPl': {
            directory: 'regcontractinvestor',
            type: 'detail',
            parameter: { 'Commandkey': 'regcontractinvestor-editor' },
            key: 'Id_HdPl'
        },
    };

    panels: PanelBase[] = [
        new TablePanel({
            label: 'Panel 1',
            col: 12,
            controls: [
                new DateBoxInput({
                    key: 'DocDate',
                    label: 'Ngày trình ký',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    // isDisabled: 'true'
                }),
                new TextBoxInput({
                    key: 'DocNo2',
                    label: 'Số HĐ/ PLHĐ hệ thống',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    // style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số HĐ/ PLHĐ bản cứng',
                    type: 'text',
                    // validators: [Validators.required],
                    col: 6,
                    
                    // style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new DateBoxInput({
                    key: 'SignDate',
                    label: 'Ngày ký',
                    type: 'date',
                    format: 'dd/MM/yyyy',

                    col: 6
                }),
                new LookupBoxInput({
                    key: 'ClassCode2',
                    label: 'Loại hồ sơ',
                    lookupKey: 'Class',
                    lookupfilter: "IsActive=1 AND ParentCode='LoaiTrinhKy'",
                    validators: [Validators.required],
                    style: 'background-color:#F8F0D7',
                    hideValueMember: true,
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ContractType',
                    label: 'Loại hợp đồng/ PLHĐ',
                    validators: [Validators.required],
                    binding: {
                        TaxCode: 'TaxCode'
                    },
                    lookupKey: 'ContractType',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND Ma_Ct = '{EXPR=DocCode}'",
                    style: 'background-color:#F8F0D7',
                    hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProjectContractType',
                    label: 'Hình thức hợp đồng',
                    validators: [Validators.required],
                 
                    lookupKey: 'Class',
                    lookupfilter: "ParentCode='ProjectContractType'",
                    style: 'background-color:#F8F0D7',
                    hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    binding: {
                        ProductType: 'ProductType',
                        Code: 'ProductCode'
                    },
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ParentBizDocId0',
                    label: 'Hợp đồng',
                    lookupKey: 'BizDoc_CTC',
                    lookupfilter: "IsActive = 1 AND DocCode = 'C2'  AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND DocDate <= '{EXPR=DocDate}' AND ProductCostId='{EXPR=ProductCostId}'",
                    hideValueMember: true,
                    visible: "'{EXPR=ClassCode2}' == '4' || '{EXPR=ClassCode2}' == '6' || '{EXPR=ClassCode2}' == '3'",
        
                    binding: {
                        CustomerCode: 'CustomerCode',
                        // ContractValue: 'ContractValue0',
                        // ContractValueAddVAT: 'ContractValueAddVAT0',
                        ContractType: 'ContractType',
                        CusBankAccountNo: 'CusBankAccountNo',
                        // ProcessCode: 'ProcessCode',
                        TaxCode: 'TaxCode'
                    },
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Hợp đồng',
                    lookupKey: 'BizDoc_CTC',
                    lookupfilter: "IsActive = 1 AND DocCode = 'C2'  AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND DocDate <= '{EXPR=DocDate}' AND ProductCostId='{EXPR=ProductCostId}'",
                    hideValueMember: true,
                    isReadOnly: 'true',
                    visible: "false",
                    binding: {
                        CustomerCode: 'CustomerCode',
                        // ContractValue: 'ContractValue0',
                        // ContractValueAddVAT: 'ContractValueAddVAT0',
                        ContractType: 'ContractType',
                        CusBankAccountNo: 'CusBankAccountNo',
                        // ProcessCode: 'ProcessCode',
                        TaxCode: 'TaxCode'
                    },
                    col: 12
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'DocName',
                    label: 'Nội dung',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12
                }),

                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Khách hàng',
                    validators: [Validators.required],
                    lookupKey: 'Customer',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    hideValueMember: false,
                    binding: {
                        Name: 'CustomerName',
                        Address: 'Address'
                    },
                    col: 12
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Address',
                    label: 'Địa chỉ',
                    type: 'text',
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'ContractValue0',
                    label: 'Giá trị HĐ (trước VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                }),
                new LookupBoxInput({
                    key: 'CurrencyCode',
                    label: 'Mã tiền tệ',
                    lookupKey: 'Currency',
                    lookupfilter: "IsActive=1 AND IsGroup=0",
                    hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'ContractValueAddVAT0',
                    label: 'Giá trị HĐ (sau VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    isNewRow: true
                }),
                new LookupBoxInput({
                    key: 'TaxCode',
                    label: 'Thuế',
                    lookupKey: 'Tax',
                    hideValueMember: false,
                    lookupfilter: "Type=1 AND IsActive=1 AND IsGroup=0 AND IsDefault = 1",
                    binding: {
                        Rate: 'TaxRate',
                        IsAdjusted: 'IsAdjusted'
                    },
                    col: 6
                }, this.srv, this.parentData),
               
                 new NumberBoxInput({
                    key: 'SubContractBeforeValue',
                    label: 'Giá trị các phụ lục trước (Trước VAT)',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'SubContractBeforeValueAddVAT',
                    label: 'Giá trị các phụ lục trước (Sau VAT)',
                    type: 'number',
                    col: 6,
                    
                    isDisabled: "{EXPR=IsAdjusted} != 1",
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
             
                new NumberBoxInput({
                    key: 'ContractValue',
                    label: 'Giá trị HĐ/PLHĐ (trước VAT)',
                    type: 'number',
                    col: 6,
                    isNewRow: true
                }),
              
                new NumberBoxInput({
                    key: 'ContractValueAddVAT',
                    label: 'Giá trị HĐ/PLHĐ (sau VAT)',
                    type: 'number',
                    col: 6
                }),
                
                // new NumberBoxInput({
                //     key: 'SubContractValue',
                //     label: 'Giá trị phụ lục này (Chưa VAT)',
                //     type: 'number',
                //     isNewRow: true,
                //     col: 6
                // }),
                // new NumberBoxInput({
                //     key: 'SubContractValue0',
                //     label: 'Giá trị phụ lục này (Gồm VAT)',
                //     type: 'number',
                //     col: 6
                // }),
                new NumberBoxInput({
                    key: 'AmountRevised',
                    label: 'GT phát sinh tăng/giảm (trước VAT)',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    
                }),
                new NumberBoxInput({
                    key: 'TotalAmountRevisedAddVAT',
                    label: 'GT phát sinh tăng/giảm (sau VAT)',
                    type: 'number',
                    col: 6,
                    
                    
                }),
                new NumberBoxInput({
                    key: 'TotalOfValue',
                    label: 'GT sau đ.chỉnh (trước VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    // isDisabled: 'true',
                    isNewRow: true
                }),
                new NumberBoxInput({
                    key: 'TotalOfValueAddVAT',
                    label: 'GT sau đ.chỉnh (sau VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                    // isDisabled: 'true',
                    
                }),
               
                // new NumberBoxInput({
                //     key: 'ExchangeRate',
                //     label: 'Tỷ giá (tạm tính)',
                //     type: 'number',
                //     col: 6
                // }),                
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND DocStatus=4 AND Ma_Ct='{EXPR=DocCode}'",
                    // lookupfilter: "ProcessCode IN (SELECT Code FROM dbo.ufn_Coteccons_Filter_ProcessCodeByProduct('{EXPR=ProductCostId}','{EXPR=ActivityCode}','{EXPR=ContractType}','{VAR=Branch.Ma_Dvcs}'))",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Remark',
                    label: 'Ghi chú',
                    type: 'text',
                    col: 12
                }),
                new DateBoxInput({
                    key: 'FromDate',
                    label: 'Ngày bắt đầu thi công',
                    type: 'date',
                    format: 'dd/MM/yyyy',

                    col: 6
                }),
                new DateBoxInput({
                    key: 'ToDate',
                    label: 'Ngày kết thúc thi công',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    // validators: [Validators.required],
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'NumDayApprove',
                    label: 'Số ngày duyệt theo HĐ',
                    type: 'number',
                    col: 6,
                    // isDisabled: 'true',
                    isNewRow: true
                }),
                new NumberBoxInput({
                    key: 'NumDayPayment',
                    label: 'Số ngày thanh toán theo HĐ',
                    type: 'number',
                    col: 6,
                   
                }),
                new CheckBoxInput({
                    key: 'IsQt',
                    label: 'Đã có biên bản quyết toán',
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    col: 6,
                    isDisabled: 'true'
                }),
                new CheckBoxInput({
                    key: 'CompletedApprove',
                    label: 'Đã hoàn thiện duyệt',
                    col: 6,
                    isDisabled: 'true'
                }),
                new ButtonInput({
                    key: 'btnAccountAtch',
                    label: 'Đính kèm file scan',
                    style: 'background-color:#9cc09c;',
                    col: 6,
                    isDisabled: "'{EXPR=Id}' < 0"
                }),
                new ButtonInput({
                    key: 'btnHdPl',
                    label: 'Xem hợp đồng',
                    style: 'background-color:#9cc09c;',
                    col: 6
                }),
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'File HĐ đã ký',
                //     col: 6,
                //     isOnlyDownload: true
                // }, this.srv)
            ]
        })
    ];

    childColumns = [
        {
            header: 'Loại',
            binding: 'ClassCode1',
            width: 70,
            dataType: 'Array',
            lookupKey: 'Class',
            bindingList: {
                Name: 'Description'
            },
            lookupfilter: "ParentCode='PaymentType' AND Code IN ('00','01','02','03','04','05','06')"
        },
        {
            header: 'Diễn giải',
            binding: 'Description',
            allowEditing: false,
            width: 300
        },
        {
            header: 'Tỉ lệ (%)',
            binding: 'PayPercent',
            dataType: 'Number',
            width: 70,
            min: 0,
            max: 1,
            format: 'P2'
        },
        {
            header: 'Giá trị',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 150
        },
        {
            header: 'Thời hạn (ngày)',
            binding: 'NumberOfDay',
            dataType: 'Number',
            width: 150
        },
        {
            header: 'Bảo lãnh',
            binding: 'GuaranteeCheck',
            dataType: 'Boolean',
            width: 50
        },
        {
            header: '% bảo lãnh',
            binding: 'GuaranteePercent',
            dataType: 'Number',
            width: 100,
            format: 'P2'
        },
        {
            header: 'ContractValue',
            binding: 'ContractValue_BindingWeb',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 0
        },
        {
            header: 'ContractValueAddVAT',
            binding: 'ContractValueAddVAT_BindingWeb',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 0
        }
    ]

    childColumns1 = [
        {
            header: 'Mã tài liệu',
            binding: 'DocumentCode',
            width: 80,
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Document',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            isReadOnly: 'true'
        },
        {
            header: 'Tên tài liệu',
            binding: 'DocumentName',
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Yêu cầu đính kèm',
            binding: 'Attached',
            dataType: 'Boolean',
            width: 80,
            isReadOnly: 'true'
        },
        {
            header: 'Link SharePoint',
            binding: 'Description',
            width: 300
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 400,
            dataType: 'Object',
            //validators: "{EXPR=Description} != '' && {EXPR=Description} == 'Yêu cầu đính kèm' && {EXPR=FilePath}==0",
            validators: "{EXPR=Attached} == true && {EXPR=Description} != 'Theo mẫu công ty ban hành' && {EXPR=FilePath}==0",
            validatorMessage: 'Yêu cầu đính kèm tài liệu',
            ignoreError: 1
            //exprReadOnly: "{EXPR=Attached} == true && {EXPR=Description} != ''"
        }
    ]

    childColumns2 = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
            isReadOnly: 'true'
        },
        {
            header: 'Mã bộ phận',
            binding: 'DeptCode',
            width: 0,
            dataType: 'Array',
            lookupKey: 'Dept',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            isReadOnly: 'true'
        },
        {
            header: 'Tên bộ phận',
            binding: 'DeptName',
            width: 230,
            isReadOnly: 'true'
        },
        {
            header: 'Mã cấp bậc',
            binding: 'PositionCode',
            width: 0,
            dataType: 'Array',
            lookupKey: 'Position',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            isReadOnly: 'true'
        },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 230,
            isReadOnly: 'true'
        },
        {
            header: 'Mã nhân viên',
            binding: 'EmployeeCode',
            width: 150,
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId='{EXPR=ProductCostId0}') AND PositionCode = '{EXPR=PositionCode}' UNION SELECT EmployeeCode FROM B20ProductHumanPay WHERE IsActive = 1)",
            validators: "{EXPR=EmployeeCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên nhân viên',
            binding: 'EmployeeName',
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Người duyệt được chỉ định',
            binding: 'EmployeeCodeReal',
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId='{EXPR=ProductCostId0}') AND PositionCode = '{EXPR=PositionCode}' UNION SELECT EmployeeCode FROM B20ProductHumanPay WHERE IsActive = 1)",
            width: 120,
            validators: "{EXPR=EmployeeCode} != '' && {EXPR=EmployeeCode}.toString().indexOf(',') > 0 && {EXPR=EmployeeCodeReal} == ''",
            validatorMessage: 'Không được bỏ trống giá trị',
            ignoreError: 1
        },
        {
            header: 'Số ngày xử lý',
            binding: 'NumberOfDays',
            width: 70,
            isReadOnly: 'true'
        },
        {
            header: 'Được trả lại hồ sơ',
            binding: 'ApproveReturn',
            dataType: 'Boolean',
            width: 80,
            isReadOnly: 'true'
        },
        // {
        //     header: 'Trả về cấp bậc',
        //     binding: 'PositionCodeReturn',
        //     width: 150,
        //     isReadOnly: 'true'
        // }
    ]

    childColumns3 = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center'
        },
        // {
        //     header: 'Cấp bậc duyệt',
        //     binding: 'PositionName',
        //     width: 250
        // },
        {
            header: 'Người thực hiện',
            binding: 'EmployeeName',
            width: 250
        },
        {
            header: 'Trạng thái',
            binding: 'ApproveStatusName',
            width: 100
        },
        {
            header: 'Ý kiến',
            binding: 'Comment',
            width: 250,
            isContentHtml: true,
            wordWrap: true
        },
        {
            header: 'Ngày đến hạn',
            binding: 'StartDate',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy HH:mm'
        },
        {
            header: 'Ngày hoàn thành',
            binding: 'FinishDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy HH:mm',
            width: 150
        }
    ]

    childColumns4 = [
        {
            header: 'Tên người liên lạc',
            binding: 'ContactName',
            width: 200,
            validators: "{EXPR=ContactName} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Số điện thoại',
            binding: 'PhoneNo',
            width: 150,
            validators: "{EXPR=PhoneNo} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Địa chỉ Email',
            binding: 'Email',
            width: 200,
            validators: "{EXPR=Email} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Địa chỉ liên lạc',
            binding: 'Address',
            width: 500,
            validators: "{EXPR=Address} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        }
    ]

    childColumns5 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 100,
            isRequired: true,
        },
        {
            header: 'Diễn giải',
            binding: 'Description',
            allowEditing: false,
            width: 350,
            isRequired: true,
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 50,
            isRequired: true,
        },
        {
            header: 'Khối lượng',
            binding: 'Quantity9',
            dataType: 'Number',
            width: 80,
            format: 'n3',
            isRequired: true,
        },
        {
            header: 'Đơn giá Tổng',
            binding: 'OriginalUnitCost',
            dataType: 'Number',
            width: 100
        },
        {
            header: 'Thành tiền',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
            //exprReadOnly: "{EXPR=CurrencyCode} == 'VND'"
        },
        {
            header: 'Loại thuế',
            binding: 'TaxCode',
            width: 100,
            dataType: 'Array',
            lookupKey: 'Tax',
            bindingList: {
                Rate: 'TaxRate'
            },
            lookupfilter: "Type=1 AND IsActive=1 AND IsGroup=0 AND IsDefault = 1",
        },
        {
            header: '% VAT',
            binding: 'TaxRate',
            width: 80
        },
        {
            header: 'Tiền thuế',
            binding: 'OriginalAmount3',
            dataType: 'Number',
            width: 120
        },
        {
            header: 'Ghi chú',
            binding: 'Remark',
            allowEditing: true,
            width: 250
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 0,
            isReadOnly: 'true'
        },
        {
            header: 'Bậc',
            binding: 'Level',
            dataType: 'Number',
            width: 0,
            format: 'n0',
            isReadOnly: 'true'
        },
        {
            header: 'Công thức',
            binding: 'Formula',
            width: 0,
            isReadOnly: 'true'
        }
    ]
}
