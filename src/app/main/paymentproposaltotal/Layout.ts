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

// *********************************KẾ HOẠCH

// Kế hoạch dòng tiền dự án
export class LayoutPaymentProposalTotalExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30TotalBudget_Explore',
                FilterKey: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'TO' AND IsActive=1",// AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'DocDate DESC,DocNo DESC',
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
                // {
                //     Layout: "MAU1",
                //     Name: "Kế hoạch ký kết hợp đồng",
                //     FileName: "Kế hoạch ký kết hợp đồng - {EXPR=ProductName} - {EXPR=DocNo}",
                //     WordName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                //     // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                //     FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                // },
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
            parameter: { 'Commandkey': 'plansigncon-editor', 'StageCode': '{EXPR=StageCode}' }
        }
    }

    parentGrid = [
        {
            header: 'Gói thầu',
            binding: 'ProductName',
            width: 200
        },
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
        // {
        //     header: 'Giá trị ký kế dự kiến (chưa VAT)',
        //     binding: 'OriginalAmount',
        //     width: 200,
        //     dataType: 'Number',
        //     format: 'n0'
        // },
        // {
        //     header: 'Giá trị thanh toán dự kiến (chưa VAT)',
        //     binding: 'PaymentAmount',
        //     width: 200,
        //     dataType: 'Number',
        //     format: 'n0'
        // },
        {
            header: 'Đã gửi duyệt',
            binding: 'ApproveSend',
            width: 120,
            dataType: 'Boolean'
        },
        {
            header: 'Hoàn thiện duyệt',
            binding: 'CompletedApprove',
            width: 150,
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
        },
    ]
}

export class LayoutPaymentProposalTotalEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    // Khai báo view lấy dữ liệu <Tables> B7
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30TotalBudget_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'TO',
                    DocStatus: '1',
                    CCMBudgetId: '',
                    CurrencyCode: 'VND',
                    Id: -1,
                    IsWebData: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB30TotalBudgetDetail_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    // Sort: 'BuiltinOrder',
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
                    Name: 'vB30TotalBudgetDetail2_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    // Sort: 'BuiltinOrder',
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
                    Name: 'vB30TotalBudgetProduct_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    DefaultValues: {
                        CCMBudgetId: 'Parent.CCMBudgetId',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30TotalBudgetCustomer_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    DefaultValues: {
                        CCMBudgetId: 'Parent.CCMBudgetId',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30TotalBudgetBank_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    DefaultValues: {
                        CCMBudgetId: 'Parent.CCMBudgetId',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30TotalBudgetView',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    IsView: 'view',
                    DefaultValues: {
                        CCMBudgetId: 'Parent.CCMBudgetId',
                        // DocDate: 'Parent.DocDate',
                        // BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30TotalBudgetLoan_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    IsView: 'view',
                    DefaultValues: {
                        CCMBudgetId: 'Parent.CCMBudgetId',
                        // DocDate: 'Parent.DocDate',
                        // BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30TotalBudgetCashFlow_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    IsView: 'view',
                    DefaultValues: {
                        CCMBudgetId: 'Parent.CCMBudgetId',
                        // DocDate: 'Parent.DocDate',
                        // BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                }
               
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'TBTT TP/NCC - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "TBTT NTP.NCC",
                    FileName: "TBTT NTP.NCC - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "6.TBTT_NTP_NCC.docx",
                    ExcelName: "",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: "MAU2",
                    Name: "TBTT_TP_NCC_KBCTC",
                    FileName: "TBTT TP/NCC - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "6.TBTT_NTP_NCC_KBCTC.docx",
                    ExcelName: "",
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
        // 'Evaluator_CCMBudgetDetail_Amount': {
        //     EvaluatorName: 'EvaluatorCaculate',
        //     DataMember: 'Amount',
        //     Value: 'OriginalAmount',
        //     Tables: 0
        // },        
      
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CCMBudgetId',
            Command: 'usp_Coteccons_UpdateInfo_WhenSave',
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerUpdating_UpdateStatusByApproveStatus': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,Id,ApproveStatus,{VAR=Branch.Ma_Dvcs},EmployeeCodeNext,DocCode,{VAR=User.Id},Comment,ApproveStatusWeb',
            Command: 'usp_Cotec_UpdateStatusByApproveStatus'
        }
       
    };

    serverConstraint = [
        // 'Evaluator_ServerConstraint_DefaultDocNo'
    ];

    serverUpdating = [
        // 'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        // 'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep'
    ]

    serverUpdated = [
        
        // 'Evaluator_ServerUpdated_BuiltinOrder',
        'Evaluator_UpdateInfo_WhenApproveSend',
        // 'Evaluator_ServerUpdated_CreateFormula',
        //  'Evaluator_ServerUpdated_CCMBudgetDetail_UpdateFromParent'
    ];

    buttonLoadChild: string[] = [
      
    ];

    buttonCommand: string[] = [

    ];

    importCommand: string[] = [

    ]

    columnChanged = {
       
    };

    columnChangedChild = [
       
    ];

    columnsReadOnly = [];

    linkReporter = {
        'btnBaoCao': {
            directory: 'reporterclaim',
            type: 'view',
            key: 'REP01_CLAIM',
            parameter: { 'Commandkey': 'REP01_CLAIM', 'CCMBudgetId': '{EXPR=CCMBudgetId}'}
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
                    label: 'Gói thầu/Phòng, ban',
                    lookupKey: 'ProductCost',
                    binding: {
                        ProductType: 'ProductType'
                    },
                    isReadOnly: 'true',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'TotalOriginalAmountC',
                    label: 'Tổng tiền thanh toán',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'Amount_DoanhThu',
                    label: 'Tổng chi phí BCH',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'Amount_ChiPhi',
                    label: 'Tổng chi phí TP/NCC',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'TotalPaymentAmountC',
                    label: 'Tổng tiền được duyệt',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'TongDinhMuc',
                    label: 'GT xác nhận theo Bao thanh toán',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'TotalAmountBank',
                    label: 'Tiền không kỳ hạn',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'TotalAmountSend',
                    label: 'Tiền gửi kỳ hạn đến 3 tháng',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'AmountBankLong',
                    label: 'Tiền gửi kỳ hạn trên 3 tháng đến 1 năm',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'TotalAmountBankSend',
                    label: 'Tổng tiền',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new ButtonInput({
                    key: 'btnBaoCao',
                    label: 'Báo cáo tổng hợp kế hoạch CĐT TT',
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    col: 6,
                    isDisabled: 'true',
                    isNewRow: true
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
            header: 'Bill thanh toán',
            binding: 'BtnBOQ',
            
            dataType: 'Object',
            isButton: true,
            textButton: 'Xem bill',
            width: 70,
            linkCommand: {
                directory: "{EXPR=DocCode_Link} == 'P4' ? 'billpaysupp' : {EXPR=DocCode_Link} == 'P3' ? 'billpaydept' : {EXPR=DocCode_Link} == 'C5' ? 'settlement' : ''",
                type: 'detail',
                key: 'Id_Link',
                // parameter: { 'Commandkey': "{EXPR=DocCode_Link} == 'P4' ? 'billpaysupp-editor' : {EXPR=DocCode_Link} == 'P3' ? 'billpaydept-editor' : {EXPR=DocCode_Link} == 'C5' ? 'settlement-editor' : ''"}
            }
        },
        {
            header: 'Mã đối tượng',
            binding: 'CustomerCode',
            dataType: 'Array',
            lookupKey: 'Customer_CCM2',
            isReadOnly: 'true',
            bindingList: {
                Name: 'CustomerName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
            width: 100
        },
        {
            header: 'Tên đối tượng',
            binding: 'CustomerName',
            width: 250,
            isReadOnly: 'true',
        },
      
          {
            header: 'BCH đề xuất',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true',
        },   
        {
            header: 'Kế toán đề xuất',
            binding: 'PaymentAmount',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true',
        },   
        {
            header: 'Tên công trường',
            binding: 'ProductName',
            isReadOnly: 'true',
            width: 250,
        },
       
        {
            header: 'Ghi chú',
            binding: 'Description',
        
            width: 200
        } ,
        {
            header: 'Số tiền duyệt',
            binding: 'AmountApproved',
            dataType: 'Number',
            width: 150,
            
            
        },   
        {
            header: 'Ngân hàng',
            binding: 'BankCode',
            dataType: 'Array',
            lookupKey: 'Customer',
            bindingList: {
                CodeOld1: 'BankName',
            },
            lookupfilter:"IsActive = 1 AND IsGroup = 0 AND Code LIKE 'B%'",
            width: 200
        } ,
        {
            header: 'Tên Ngân hàng',
            binding: 'BankName',
          
            width: 200
        } ,
        {
            header: 'Hình thức thanh toán',
            binding: 'PaymentsType',
            width: 150,
            dataType: 'Array',
            lookupKey: 'Class',
            bindingList: {
            },
            // displayMember: 'DocInfo',
            lookupfilter: "ParentCode='PAYMENTTYPE' AND Code IN ('VAY','LCUPAS','TC')"
            // lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        },  
   
        {
            header: 'Id Bill',
            binding: 'ParentBizDocId',
            width: 0,
            dataType: 'Array',
            lookupKey: 'BizDocCCM',
            bindingList: {
                DocNo: 'BillNoInfo',
            },
            // displayMember: 'DocInfo',
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
            // lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        },  
        {
            header: 'Id hợp đồng',
            binding: 'Id_TT',
            width: 0,
           
            // displayMember: 'DocInfo',
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
            // lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        },                                                                               
       
    ];

    childColumns1 = [
        {
            header: 'Bill thanh toán',
            binding: 'BtnBOQ',
            
            dataType: 'Object',
            isButton: true,
            textButton: 'Xem bill',
            width: 70,
            linkCommand: {
                directory: "{EXPR=DocCode_Link} == 'P4' ? 'billpaysupp' : {EXPR=DocCode_Link} == 'P3' ? 'billpaydept' : {EXPR=DocCode_Link} == 'C5' ? 'settlement' : ''",
                type: 'detail',
                key: 'Id_Link',
                // parameter: { 'Commandkey': "{EXPR=DocCode_Link} == 'P4' ? 'billpaysupp-editor' : {EXPR=DocCode_Link} == 'P3' ? 'billpaydept-editor' : {EXPR=DocCode_Link} == 'C5' ? 'settlement-editor' : ''"}
            }
        },
        {
            header: 'Khối lượng tháng',
            binding: 'JobName',
            isReadOnly: 'true',
            width: 150,
        },
        {
            header: 'Bill không hóa đơn',
            binding: 'IsNotInvoice',
            dataType: 'Boolean',
            width: 100
        },
        {
            header: 'Loại Bao Thanh Toán',
            binding: 'IsBTT',
            dataType: 'Boolean',
            width: 100
        },
        {
            header: 'Mã đối tượng',
            binding: 'CustomerCode',
            dataType: 'Array',
            lookupKey: 'Customer_CCM2',
            isReadOnly: 'true',
            bindingList: {
                Name: 'CustomerName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
            width: 100
        },
        {
            header: 'Tên đối tượng',
            binding: 'CustomerName',
            isReadOnly: 'true',
            width: 250,
        },
        {
            header: 'Số ngày quá hạn',
            binding: 'DayQH',
            dataType: 'Number',
            width: 90,
            isReadOnly: 'true'
        },
        {
            header: 'Số tiền còn lại của BILL',
            binding: 'OpenPlanAmount',
            dataType: 'Number',
            width: 100, 
        },   
         {
            header: 'BCH đề xuất',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true',
        },   
        {
            header: 'Kế toán đề xuất',
            binding: 'PaymentAmount',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true',
        },   
        
        {
            header: 'Tên công trường',
            binding: 'ProductName',
            isReadOnly: 'true',
            width: 250,
        },
        {
            header: 'Loại bill',
            binding: 'Description',
            
            width: 200
        } ,
        {
            header: 'Lý do chi',
            binding: 'Remark',
            
            width: 200
        } ,
      
        {
            header: 'Số tiền duyệt',
            binding: 'AmountApproved',
            dataType: 'Number',
            width: 150,

        },   
       
        {
            header: 'Ngân hàng',
            binding: 'BankCode',
            dataType: 'Array',
            lookupKey: 'Customer',
            bindingList: {
                CodeOld1: 'BankName',
            },
            lookupfilter:"IsActive = 1 AND IsGroup = 0 AND Code LIKE 'B%'",
            width: 200
        } ,
        {
            header: 'Tên Ngân hàng',
            binding: 'BankName',
          
            width: 200
        } ,
        {
            header: 'Hình thức thanh toán',
            binding: 'PaymentsType',
            width: 150,
            dataType: 'Array',
            lookupKey: 'Class',
            bindingList: {
            },
            // displayMember: 'DocInfo',
            lookupfilter: "ParentCode='PAYMENTTYPE' AND Code IN ('VAY','LCUPAS','TC')"
            // lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        }, 
     
        {
            header: 'Kỳ hạn',
            binding: 'PeriodSend',
            width: 200,
            // dataType: 'Array',
            // lookupKey: 'Class',
            // bindingList: {
            // },
            // // displayMember: 'DocInfo',
            // lookupfilter: "ParentCode='PeriodSend'"
            // lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        }, 
        {
            header: 'Lãi suất',
            binding: 'InterestRate',
            dataType: 'Number',
            width: 100,
            format: 'P2'
        },
        {
            header: 'Ghi chú',
            binding: 'LoaiDeXuat',
            
            width: 200
        } ,
        {
            header: 'User đề xuất',
            binding: 'UserName',
            isReadOnly: 'true',
            width: 250,
        },
        {
            header: 'Id Bill',
            binding: 'ParentBizDocId',
            width: 0,
            dataType: 'Array',
            lookupKey: 'BizDocCCM',
            bindingList: {
                DocNo: 'BillNoInfo',
            },
            // displayMember: 'DocInfo',
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
            // lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        },  
        {
            header: 'Id hợp đồng',
            binding: 'BizDocId_C1',
            width: 0,
            dataType: 'Array',
            lookupKey: 'BizDoc2',
            bindingList: {
                DocInfo: 'DocInfo',
            },
            // displayMember: 'DocInfo',
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
            // lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        }, 
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 0
        },
    ]

    childColumns2 = [
        {
            header: 'Công trường',
            binding: 'ProductCostId',
            isReadOnly: 'true',
            width: 100
        },
        {
            header: 'Tên công trường',
            binding: 'ProductName',
            isReadOnly: 'true',
            width: 250,
        },
         {
            header: 'Nhóm CĐT',
            binding: 'GeneralProject',
            isReadOnly: 'true',
            width: 250,
        },
        {
            header: 'Chênh lệch thu chi (Trước DXTT)',
            binding: 'Amount1',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },   
        {
            header: 'Số tiền thanh toán',
            binding: 'Amount',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },   
        {
            header: 'Chênh lệch thu chi (gồm DXTT)',
            binding: 'Amount2',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        }, 
        {
            header: 'Thu chi kế hoạch',
            binding: 'Amount4',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        }  
    
    ]
    childColumns3 = [
        {
            header: 'Thầu phụ/Nhà cung cấp',
            binding: 'CustomerCode',
            isReadOnly: 'true',
            width: 100
        },
        {
            header: 'Tên thầu phụ/Nhà cung cấp',
            binding: 'CustomerName',
            isReadOnly: 'true',
            width: 250,
        },
      
        {
            header: 'Số tiền thanh toán',
            binding: 'Amount',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },   
    
    ]

    childColumns4 = [
        {
            header: 'Ngân hàng',
            binding: 'CustomerCode',
            isReadOnly: 'true',
            width: 100
        },
        {
            header: 'Tên ngân hàng',
            binding: 'CustomerName',
            isReadOnly: 'true',
            width: 350,
        },
      
        {
            header: 'Tiền không kỳ hạn',
            binding: 'AmountBank',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },   
        {
            header: 'Tiền gửi kỳ hạn đến 3 tháng',
            binding: 'AmountSend',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },    
        {
            header: 'Tiền gửi KH trên 3 tháng đến 1 năm',
            binding: 'AmountBankLong',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },    
        {
            header: 'Tổng cộng',
            binding: 'TotalAmount',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },   
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 0
        },
    ]

    childColumns5 = [
        {
            header: 'Hình thức thanh toán',
            binding: 'PaymentsType',
            isReadOnly: 'true',
            width: 100
        },
        {
            header: 'Ngân hàng',
            binding: 'BankName',
            isReadOnly: 'true',
            width: 300
        },
       
        {
            header: 'Tiền không kỳ hạn',
            binding: 'AmountApproved',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        }
    ]

    childColumns6 = [
        {
            header: 'Ngân hàng',
            binding: 'CustomerCode',
            isReadOnly: 'true',
            width: 100
        },
        {
            header: 'Tên ngân hàng',
            binding: 'CustomerName',
            isReadOnly: 'true',
            width: 350,
        },
        {
            header: 'Hạn mức',
            binding: 'AmountHanMuc',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },   
        {
            header: 'Vay, LC Upas đến kỳ trước',
            binding: 'PeriosAmountLoan',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },    
        {
            header: 'Vay, LC Upas kỳ này',
            binding: 'AmountApproved',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },    
        {
            header: 'Tổng vay, LC Upas đến hết kỳ này',
            binding: 'TotalAmountLoan',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },   
        // {
        //     header: 'Dư nợ đến kỳ này',
        //     binding: 'DuNoConLai',
        //     dataType: 'Number',
        //     width: 150,
        //     isReadOnly: 'true'
        // }
    ]

    childColumns7 = [
        {
            header: 'Tháng',
            binding: 'EstimatedTimeDelivery',
            isRequired: true,
            width: 120,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Vay, LC Upas',
            binding: 'ThisAmountLoan',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },  
        {
            header: 'Bảo lãnh thanh toán',
            binding: 'BaoLanhThanhToan',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },   
        {
            header: 'LC',
            binding: 'AmountLC',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },    
         
        {
            header: 'Thue',
            binding: 'AmountThue',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },   
        {
            header: 'Tổng',
            binding: 'TotalAmount',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        }
    ]
}