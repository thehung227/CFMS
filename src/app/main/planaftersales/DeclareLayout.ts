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

// constructor(private srv?: any,
//     private parentData?: any) {
// }

// *********************************KẾ HOẠCH

// Kế hoạch Ký kết hợp đồng
export class LayoutPlanAfterSalesExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30CCMBudget_Explore',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'K7' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'ProductName,DocDate DESC,DocNo DESC',
                RowPage: 50,
                DefaultValues: {
                    CurrencyCode: 'VND'
                }
            },
            Child: {
                Name: 'vB30BizDocApprove_CCMBudgetExplorer',
                ParentKey: 'CCMBudgetId',
                ChildKey: 'BizDocId',
                OrderBy: 'ApproveGroup'
            }
        },
        PrintDocument: {
            Key: 'CCMBudgetViewer',
            Text: 'Kế hoạch ký kết hợp đồng - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30CCMBudget_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Dự trù chi phí bảo hành",
                    FileName: "Dự trù chi phí bảo hành - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "Du_Tru_Chi_Phi_Bao_Hanh.docx",
                    // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: 'MAU9',
                    Name: 'WorkFlow',
                    FileName: 'WorkFlow KHKK - {EXPR=ProductName} - {EXPR=DocNo}',
                    WordName: 'WorkFlow_KHKK.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ],
            // GroupCols: 'Loai_Dt',
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'BuiltinOrder',
                    width: 73,
                    dataType: 'String',
                    align: 'center'
                },
                {
                    header: 'Thời gian ký kết dự kiến',
                    binding: 'EstimatedTimeDelivery',
                    width: 106,
                    dataType: 'Date',
                    format: 'dd/MM/yyyy'
                },
                {
                    header: 'Nội dung',
                    columns: [
                        {
                            header: 'Công tác',
                            binding: 'JobName',
                            width: 163,
                            dataType: 'String'
                        },
                        {
                            header: 'ĐTC/TP/NCC',
                            binding: 'CustomerName',
                            width: 200,
                            dataType: 'String'
                        },
                    ]
                },
                {
                    header: 'Người ký HĐ',
                    binding: 'Chuc_Vu',
                    width: 105,
                    dataType: 'String'
                },
                {
                    header: 'Giá trị dự kiến ký kết (chưa VAT)',
                    binding: 'OriginalAmount',
                    width: 112,
                    dataType: 'Number',
                    aggregate: 'Sum'
                },
                {
                    header: 'Giá trị thanh toán dự kiến (chưa VAT)',
                    binding: 'PaymentAmount',
                    width: 105,
                    dataType: 'Number',
                    aggregate: 'Sum'
                },
                {
                    header: 'Loại ĐT',
                    binding: 'Loai_Dt',
                    width: 0,
                    dataType: 'String'
                },
            ]
        },
        CopiedValues: {
            parameter: { 'Commandkey': 'planaftersales-editor', 'StageCode': '{EXPR=StageCode}' }
        }
    }

    parentGrid = [
        // {
        //     header: 'CCMBudgetId',
        //     binding: 'CCMBudgetId',
        //     width: 200
        // },
        {
            header: 'Gói thầu',
            binding: 'ProductName',
            width: 400
        },
        // {
        //     header: 'Số Rev',
        //     binding: 'DocNo2',
        //     width: 60,
        //     dataType: 'String'
        // },
        {
            header: 'Số kế hoạch',
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
        {
            header: 'Ngày hoàn thiện duyệt',
            binding: 'FinishDate',
            width: 180,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Giá trị ký kế dự kiến (chưa VAT)',
            binding: 'OriginalAmount',
            width: 200,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Giá trị thanh toán dự kiến (chưa VAT)',
            binding: 'PaymentAmount',
            width: 200,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Đã gửi duyệt',
            binding: 'ApproveSend',
            width: 100,
            dataType: 'Boolean'
        },
        {
            header: 'Hoàn thiện duyệt',
            binding: 'CompletedApprove',
            width: 100,
            dataType: 'Boolean'
        },
        {
            header: 'Đang xử lý',
            binding: 'XuLyTiepTheo',
            width: 150,
            dataType: 'String'
        },
       
        // {
        //     header: 'Hồ sơ hủy',
        //     binding: 'ClosedApprove',
        //     width: 100,
        //     dataType: 'Boolean'
        // },
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
            header: 'Yêu cầu gửi duyệt',
            binding: 'NotApproveSend',
            width: 0,
            dataType: 'Boolean'
        }
    ]

    childGrid = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center'
        },
        {
            header: 'Bộ phận',
            binding: 'DeptName',
            width: 350,
            dataType: 'String'
        },
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
        },
    ]
}

export class LayoutPlanAfterSalesEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }
1
    // Khai báo view lấy dữ liệu <Tables> B7
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30CCMBudget_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'K7',
                    DocStatus: '4',
                    CCMBudgetId: '',
                    CurrencyCode: 'VND',
                    Id: -1,
                    IsWebData: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB30CCMBudgetDetail_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        CCMBudgetId: 'Parent.CCMBudgetId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        Chuc_Vu: 'GDDA',
                        Quantity9: '0',
                        BudgetTypeCode: 'BT01'
                    }
                },
                {
                    Name: 'vB30BizDocApprove_AEditBudget',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: 'Parent.CCMBudgetId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    }
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.CCMBudgetId',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.CCMBudgetId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                    }
                },
            ]
        },
        PrintDocument: {
            Key: 'CCMBudgetViewer',
            Text: 'Kế hoạch ký kết hợp đồng - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30CCMBudget_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Kế hoạch ký kết hợp đồng",
                    FileName: "Kế hoạch ký kết hợp đồng - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ],
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'BuiltinOrder',
                    width: 73,
                    dataType: 'String',
                    align: 'center'
                },
                {
                    header: 'Thời gian ký kết dự kiến',
                    binding: 'EstimatedTimeDelivery',
                    width: 106,
                    dataType: 'Date',
                    format: 'dd/MM/yyyy'
                },
                {
                    header: 'Nội dung',
                    columns: [
                        {
                            header: 'Công tác',
                            binding: 'JobName',
                            width: 163,
                            dataType: 'String'
                        },
                        {
                            header: 'ĐTC/TP/NCC',
                            binding: 'CustomerName',
                            width: 190,
                            dataType: 'String'
                        },
                    ]
                },
                {
                    header: 'Người ký HĐ',
                    binding: 'Ten_Chuc_Vu',
                    width: 105,
                    dataType: 'String'
                },
                {
                    header: 'Giá trị dự kiến ký kết (chưa VAT)',
                    binding: 'OriginalAmount',
                    width: 112,
                    dataType: 'Number'
                },
                {
                    header: 'Giá trị thanh toán dự kiến (chưa VAT)',
                    binding: 'PaymentAmount',
                    width: 105,
                    dataType: 'Number'
                }
            ]
        }
    };

    evaluators = {
        // 'Evaluator_TotalOriginalAmount_Calculate': {
        //     EvaluatorName: 'EvaluatorCaculate',
        //     DataMember: '_TotalOriginalAmount',
        //     Value: '_OriginalAmount+_OriginalAmount3'
        // },
        // 'Evaluator_OriginalAmount_Calculate': {
        //     EvaluatorName: 'EvaluatorSumChild',
        //     DataMember: '_OriginalAmount',
        //     Value: 'OriginalAmount',
        //     Tables: 0
        // },
        // 'Evaluator_OriginalAmount3_Calculate': {
        //     EvaluatorName: 'EvaluatorSumChild',
        //     DataMember: '_OriginalAmount3',
        //     Value: 'OriginalAmount3',
        //     Tables: 0
        // },
        // 'Evaluator_PaymentAmount_Calculate': {
        //     EvaluatorName: 'EvaluatorSumChild',
        //     DataMember: '_PaymentAmount',
        //     Value: 'PaymentAmount',
        //     Tables: 0
        // },
  
        'Evaluator_TotalOriginalAmount_SetValue': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: 'TotalOriginalAmountC',
            Value: 'OriginalAmount',
            Tables: 0
        },
        'Evaluator_TotalPaymentAmountC_SetValue': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'DocDate,ProductCostId,{VAR=Branch.Ma_Dvcs}',
            DataMember: 'TotalPaymentAmountC',
            Command: 'usp_Coteccons_GetAmountMaintema',
        },
        'Evaluator_InfoAccount_SetValue': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ProductCostId,DocDate',
            DataMember: 'Amount_ChiPhiKT,TongDinhMuc',
            Command: 'usp_Get_InfoBaoHanh',
        },
        // 'Evaluator_CCMBudgetDetail_Amount': {
        //     EvaluatorName: 'EvaluatorCaculate',
        //     DataMember: 'Amount',
        //     Value: 'OriginalAmount',
        //     Tables: 0
        // },

        // server constraint
        'Evaluator_ServerConstraint_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,DocCode,DocDate',
            Command: 'ufn_B30CCMBudget_DefaultDocNo',
            zExpr: "ProductCostId != ''",
            DataMember: 'DocNo'
        },
 
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,CustomerCode,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_CheckVer0_ChuaDuyetXong',
            zExpr: 'Id < 0',
            MessageText: 'Không thể lập mới khi chưa hoàn thiện duyệt KHKK trước',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_Ver0_KhongSua_KhiDaDuyet': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'CCMBudgetId,DocNo2,CompletedApprov',
            Command: 'ufn_Coteccons_Check_DaDuyet_K1',
            MessageText: 'Không thể điều chỉnh ver 0 đã hoàn thiện duyệt',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'CCMBudgetId,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Conteccons_NotChangeWhenApproveSent',
            MessageText: 'Không được thay đổi khi đã gửi duyệt',
            IgnoreError: 0
        },

        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,{VAR=EmptyField_ParentBizDocId}',
            Command: 'usp_B30BizDocApprove_GetData',
            OutputTable: 1
        },
        
    
        'Evaluator_UpdateApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CCMBudgetId',
            Command: 'usp_Coteccons_B30CCMBudget_SetApproveSend'
        },
        'Evaluator_ServerContrains_GetAmountBillPaid': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'DocDate,ProductCostId,CustomerCode,BizDocId_C1,{VAR=Branch.Ma_Dvcs},ItemNo,JobCode,OriginalAmount',
            DataMember: 'AmountPaid',
            Command: 'usp_Coteccons_GetAmountBillPaid',
            Tables: 0
        },
        'Evaluator_ServerContrains_GetAmountLimit': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ProductCostId,DocDate,{VAR=Branch.Ma_Dvcs}',
            DataMember: 'AmountLimit',
            zExpr: "ProductCostId != ''",
            Command: 'ufn_Coteccons_GetValueBaoHanh'
        },
          'Evaluator_TotalOriginalAmount_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'TongHanMucBaoHanh',
            Value: 'AmountLimit+Amount_ChiPhiQL'
        },
        // server updated
        'Evaluator_ServerUpdated_usp_Coteccons_GuiDuyetLai': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ApproveSend,DocCode,CCMBudgetId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_GuiDuyetLai'
        },
        'Evaluator_ServerConstraint_K1_LoadPrevious': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,CCMBudgetId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_B30CCMBudgetK7_LoadPrevious',
            zExpr: "ProductCostId != ''",
            OutputTable: 0
        },
        'Evaluator_ServerUpdated_BuiltinOrder': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=TableNames_B30CCMBudgetDetail},{VAR=Keys_B30CCMBudgetDetail},{VAR=FieldOrders2_B30CCMBudgetDetail},CCMBudgetId,{VAR=EmptyField_BizDocId},{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_Web_SetBuiltionOrder2'
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},{VAR=EmptyField_BizDocId},CCMBudgetId,{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerUpdated_CCMBudgetDetail_UpdateFromParent': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CCMBudgetId',
            Command: 'usp_Coteccons_CCMBudgetDetail_UpdateFromParentWEB'
        }
       
    };

    serverConstraint = [
        'Evaluator_ServerConstraint_DefaultDocNo',
        'Evaluator_ServerContrains_GetAmountLimit'
    ];

    serverUpdating = [
        //'Evaluator_CCMBudgetDetail_Amount',
        'Evaluator_TotalOriginalAmount_SetValue',
    //  'Evaluator_ServerConstraint_Check_BlockBill',
        'Evaluator_ServerConstraint_Check_Ver0_KhongSua_KhiDaDuyet',
        // 'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep'
    ]

    serverUpdated = [
        'Evaluator_ServerUpdated_BuiltinOrder',
        'Evaluator_UpdateInfo_WhenApproveSend',
        
        'Evaluator_ServerUpdated_CCMBudgetDetail_UpdateFromParent',
        'Evaluator_ServerContrains_GetAmountBillPaid',
        'Evaluator_TotalPaymentAmountC_SetValue',
    ];

    buttonLoadChild: string[] = [
        'Evaluator_ServerContrains_GetAmountLimit',
        'Evaluator_ServerConstraint_Check_Ver0_KhongSua_KhiDaDuyet',
        // 'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep',
        //getdataforchild
        'Evaluator_ServerConstraint_Approve_GetData',
        'Evaluator_ServerConstraint_K1_LoadPrevious',
        'Evaluator_ServerContrains_GetAmountBillPaid'
    ];

    buttonCommand: string[] = [
        'Evaluator_TotalOriginalAmount_SetValue'
    ];

    columnChanged = {
        ProductCostId: {
            Evaluators: [
                'Evaluator_TotalPaymentAmountC_SetValue',
                'Evaluator_ServerContrains_GetAmountBillPaid',
                'Evaluator_ServerContrains_GetAmountLimit',
                'Evaluator_InfoAccount_SetValue'
            ]
        },
        ApproveSend: {
            Evaluators: [
                // 'Evaluator_CCMBudgetDetail_Set_ApproveSend',
            ]
        },
        ProcessCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_Approve_GetData'
            ]
        },
        AmountLimit: {
            Evaluators: [
                'Evaluator_TotalOriginalAmount_Calculate'
            ]
        },
        Amount_ChiPhiQL: {
            Evaluators: [
                'Evaluator_TotalOriginalAmount_Calculate'
            ]
        }
    };

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
                OriginalAmount: {
                    Evaluators: [
                        'Evaluator_ServerContrains_GetAmountBillPaid',
                        'Evaluator_TotalOriginalAmount_SetValue'
                    ]
                },
                 BizDocId_C1: {
                    Evaluators: [
                        'Evaluator_ServerContrains_GetAmountBillPaid',
                        'Evaluator_TotalPaymentAmountC_SetValue'
                    ]
                },
                JobCode: {
                    Evaluators: [
                        'Evaluator_ServerContrains_GetAmountBillPaid'
                    ]
                },
                AmountPaid: {
                    Evaluators: [
                        'Evaluator_TotalPaymentAmountC_SetValue'
                    ]
                },
            }
        },
        // {
        //     Tables: 1,
        //     columnChanged: {
        //         ApproveSend: {
        //             Evaluators: [

        //             ]
        //         }
        //     }
        // }
    ];

    columnsReadOnly = [];

    linkReporter = {
        'btnBaoCao': {
            directory: 'reporterplanaftersales',
            type: 'view',
            key: 'REP02_CCM_KHKK',
            parameter: { 'Commandkey': 'REP02_CCM_KHKK', 'ProductCostId': '{EXPR=ProductCostId}', 'CCMBudgetId': '{EXPR=CCMBudgetId}', 'BranchCode': '{VAR=Branch.Ma_Dvcs}' }
        }
    }

    panels: PanelBase[] = [
        new TablePanel({
            label: 'Panel 1',
            col: 12,
            controls: [
                new DateBoxInput({
                    key: 'DocDate',
                    label: 'Ngày',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số kế hoạch',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu',
                    lookupKey: 'ProductCost',
                    binding: {
                        InvestorCode: 'CustomerCode',
                        
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 6
                }, this.srv, this.parentData),
                // new TextBoxInput({
                //     key: 'DocNo2',
                //     label: 'Số Rev',
                //     type: 'text',
                //     validators: [Validators.required],
                //     isReadOnly: 'true',
                //     col: 6,
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Chủ đầu tư',
                    lookupKey: 'Customer_CCM2',
                    binding: {
                        Name: 'Person',
                        Address: 'Address'
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
                    hideValueMember: false,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    validators: [Validators.required],
                    col: 6
                }, this.srv, this.parentData),
               
               
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND Ma_Ct='{EXPR=DocCode}'",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'TongDinhMuc',
                    label: 'Tổng quỹ bảo hành',
                    type: 'number',
                    isReadOnly: 'true',
                    col: 6,
                    validators: [Validators.required]
                }),
                new NumberBoxInput({
                    key: 'Amount_ChiPhiQL',
                    label: 'Hạn mức BH được duyệt thêm',
                    type: 'number',
                    
                    col: 6,
                    validators: [Validators.required]
                }),
                new NumberBoxInput({
                    key: 'AmountLimit',
                    label: 'HM BCTC',
                    type: 'number',
                    isDisabled: "({EXPR=ProductCostId} != 'PROD000099')",
                    col: 6,
                    validators: [Validators.required]
                }),
                new NumberBoxInput({
                    key: 'TongHanMucBaoHanh',
                    label: 'Tổng hạn mức bảo hành',
                    type: 'number',
                    isReadOnly: 'true',
                    col: 6,
                    validators: [Validators.required]
                }),
                new NumberBoxInput({
                    key: 'TotalOriginalAmountC',
                    label: 'Tổng giá trị dự trù',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'TotalPaymentAmountC',
                    label: 'Giá trị đã xác nhận (Bill)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'OriginalAmount',
                    label: 'Tổng dự trù (1+2+3+4)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'Amount_ChiPhiKT',
                    label: 'Giá trị BH đã hạch toán',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new DateBoxInput({
                    key: 'FromDate',
                    label: 'Ngày bắt đầu bảo hành đợt này',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6,
                    
                    style: 'border-radius:8px;'
                }),
                new DateBoxInput({
                    key: 'ToDate',
                    label: 'Ngày kết thúc bảo hành đợt này',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6,
                    
                    style: 'border-radius:8px;'
                }),
                new DateBoxInput({
                    key: 'EffectiveDate',
                    label: 'Ngày bắt đầu bảo hành',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6,
                    
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
               
                
                new DateBoxInput({
                    key: 'EstimatedCompletionDate',
                    label: 'Ngày kết thúc bảo hành',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6,
                    
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                // new ButtonInput({
                //     key: 'btnBaoCao',
                //     label: 'Báo cáo điều chỉnh kế hoạch ký kết',
                //     col: 6
                // }),  
              
               
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    col: 6,
                    isDisabled: 'true'
                }),
                new CheckBoxInput({
                    key: 'CompletedApprove',
                    label: 'Đã hoàn thiện duyệt',
                    isDisabled: 'true',
                    col: 6
                })
            ]
        })
    ];

    childColumns = [
        {
            header: 'Ngày nhận yêu cầu',
            binding: 'EstimatedTimeDelivery',
            isRequired: true,
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Mã Công việc',
            binding: 'JobCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Job',
            bindingList: {
                Name: 'JobName'
            },
            multiSelection: true,
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 150,
            validators: "{EXPR=JobCode} == ''",
            validatorMessage: 'Mã công việc, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Nội dung công việc',
            binding: 'JobName',
            isRequired: true,
            width: 250
        },
        {
            header: 'Đơn vị thực hiện',
            binding: 'CustomerCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Customer_CCM2',
            bindingList: {
                NameBinding: 'CustomerName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
            width: 200,
            validators: "{EXPR=CustomerCode} == ''",
            validatorMessage: 'Mã đối tượng, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên đơn vị thực hiện',
            binding: 'CustomerName',
            width: 300
        },
        {
            header: 'Giá trị dự trù (1234)',
            binding: 'OriginalAmount',
            isReadOnly: 'true',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: 'Giá trị dự trù',
            binding: 'OriginalAmount1',
            
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: 'Yêu cầu bảo hành',
            binding: 'ParentBizDocId',
            width: 200,
            dataType: 'Array',
            lookupKey: 'BizDocVB',
            bindingList: {
                DocInfo: 'DocInfoVB'
            },
            // displayMember: 'DocInfo',
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
            lookupfilter: "(DocCode = 'V7' AND ProductCostId='{EXPR=ProductCostId}' AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}')"
        },
        {
            header: 'Thông tin yêu cầu',
            binding: 'DocInfoVB',
            width: 200,
            isReadOnly: 'true'
        },
        {
            header: 'Id hợp đồng',
            binding: 'BizDocId_C1',
            width: 200,
            dataType: 'Array',
            lookupKey: 'BizDoc2',
            bindingList: {
                DocInfo: 'DocInfo',
                ContractType: 'ContractType'
            },
            // displayMember: 'DocInfo',
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
            lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14','HD-18') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        },
        {
            header: 'Thông tin hợp đồng',
            binding: 'DocInfo',
            width: 200,
            isReadOnly: 'true'
        },
        {
            header: 'Loại hợp đồng',
            binding: 'ContractType',
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: 'Ghi chú',
            binding: 'Remark',
            width: 200
        },
        // {
        //     header: 'KT kiểm tra LNCT',
        //     binding: 'AmountLNCT_KT',
        //     dataType: 'Number',
        //     width: 150
        // },
        // {
        //     header: 'KT kiểm tra LNKT',
        //     binding: 'AmountLNKT_KT',
        //     dataType: 'Number',
        //     width: 150
        // },
        // {
        //     header: '% dự phòng phí',
        //     binding: 'CostPercent',
        //     dataType: 'Number',
        //     format: 'n3',
        //     width: 100
        // },
        {
            header: 'Giá trị đã TT',
            binding: 'AmountPaid',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 100
        }
    ];

    childColumns1 = [
        {
            header: 'TT duyệt',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
            isReadOnly: 'true'

        },
        {
            header: 'Mã bộ phận',
            binding: 'DeptCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Dept',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 0,
            isReadOnly: 'true'
        },
        {
            header: 'Bộ phận',
            binding: 'DeptName',
            width: 300,
            isReadOnly: 'true'
        },
        {
            header: 'Mã cấp bậc',
            binding: 'PositionCode',
            dataType: 'Array',
            lookupKey: 'Position',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 0,
            isReadOnly: 'true'
        },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Mã nhân viên',
            binding: 'EmployeeCode',
            width: 100,
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId}' AND PositionCode = '{EXPR=PositionCode}')",
            validators: "{EXPR=EmployeeCode} == ''",
            validatorMessage: 'Không được bỏ trống giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên nhân viên',
            binding: 'EmployeeName',
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Nhân viên duyệt được chỉ định',
            binding: 'EmployeeCodeReal',
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId}' AND PositionCode = '{EXPR=PositionCode}')",
            width: 120,
            validators: "{EXPR=EmployeeCode} != '' && {EXPR=EmployeeCode}.toString().indexOf(',') > 0 && {EXPR=EmployeeCodeReal} == ''",
            validatorMessage: 'Không được bỏ trống giá trị',
            ignoreError: 1
        },
        {
            header: 'Số ngày xử lý',
            binding: 'NumberOfDays',
            dataType: 'Number',
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: 'Được trả hồ sơ',
            binding: 'ApproveReturn',
            width: 100,
            dataType: 'Boolean',
            isReadOnly: 'true'
        },
        {
            header: 'Trả về cấp bậc',
            binding: 'PositionCodeReturn',
            width: 100,
            isReadOnly: 'true'
        }
    ];

    childColumns2 = [
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
    ];

    childColumns3 = [
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
            width: 60,
            isReadOnly: 'true'
        },
        {
            header: 'Ghi chú',
            binding: 'Description',
            width: 250
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 600,
            dataType: 'Object',
            //validators: "{EXPR=Description} != '' && {EXPR=Description} == 'Yêu cầu đính kèm' && {EXPR=FilePath}==0",
            validators: "{EXPR=Attached} == true && {EXPR=Description} != 'Theo mẫu công ty ban hành' && {EXPR=FilePath}==0",
            validatorMessage: 'Yêu cầu đính kèm tài liệu',
            ignoreError: 1
            //exprReadOnly: "{EXPR=Attached} == true && {EXPR=Description} != ''"
        }
    ]

}