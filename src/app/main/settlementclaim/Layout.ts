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

// *********************************QUYẾT TOÁN KHÁCH HÀNG / CĐT

export class LayoutSettlementClaimExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30Claim_Explorer',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND DocCode='C7' AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND IsActive=1",// AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'ProductName,ClaimDate DESC,ClaimNo DESC',
                RowPage: 50
            },
            Child: {
                Name: 'vB30BizDocApprove_ClaimExplorer',
                ParentKey: 'Stt',
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
                    FileName: 'WorkFlow Quyết toán Khách hàng - {EXPR=ProductName} - {EXPR=ClaimNo}',
                    WordName: 'WorkFlow_QuyetToan_CDTKH.docx',
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
        }
    }

    parentGrid = [
        // {
        //     header: 'Gói thầu',
        //     binding: 'ProductName',
        //     width: 250
        // },
        {
            header: 'Số claim',
            binding: 'ClaimNo',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Ngày lập',
            binding: 'ClaimDate',
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
            header: 'File scan',
            binding: 'FilePath',
            width: 230,
            dataType: 'String'
        },
        // {
        //     header: 'Giá trị ký kế dự kiến (chưa VAT)',
        //     binding: 'OriginalAmount',
        //     width: 200,
        //     dataType: 'Number',
        //     format: 'n0'
        // },
        {
            header: 'Đã gửi duyệt',
            binding: 'ApproveSend',
            width: 150,
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
        //     width: 350,
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

export class LayoutSettlementClaimEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    // Khai báo view lấy dữ liệu <Tables> B7
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30Claim_Editor',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Stt: '',
                    Id: -1,
                    DocCode: 'C7',
                    IsWebData: true,
                    ClaimDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    CurrencyCode: 'VND',
                    IsQT: true
                }
            },
            Child: [
                {
                    Name: 'vB30ClaimPayment_FromAccDocSales',
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    Sort: 'DocDate',
                    DefaultValues: {
                    },
                    IgnoreSave: true
                },
                {
                    Name: 'vB30BizDocSalesman_FromAccDocCashReceipt', //view ảo
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    Sort: 'DocDate',
                    DefaultValues: {
                    },
                    IgnoreSave: true
                },
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.Stt',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.ClaimDate',
                    }
                },
                {
                    Name: 'vB30BizDocApprove_EditClaim',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: 'Parent.Stt',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.ClaimDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    }
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.Stt',
                        DocDate: 'Parent.ClaimDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30ClaimDetail',
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1',
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
        'Evaluator_ServerConstraint_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,BizDocIdList,DocCode,DocDate,Id',
            Command: 'ufn_B30Claim_DefaultDocNo',
            zExpr: "ProductCostId != '' && BizDocIdList != ''",
            DataMember: 'ClaimNo'
        },
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'Stt,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Conteccons_NotChangeWhenApproveSent',
            MessageText: 'Không được thay đổi khi đã gửi duyệt',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,{VAR=EmptyField_ParentBizDocId}',
            Command: 'usp_B30BizDocApprove_GetData',
            OutputTable: 3
        },
        'Evaluator_ServerConstraint_ClaimDetail_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'BizDocIdList',
            Command: 'usp_ClaimDetail_LoadFromBizDocIdList',
            OutputTable: 5
        },
        'Evaluator_ServerConstraint_LoadDocument': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId',
            Command: 'usp_Claim_LoadDocument',
            OutputTable: 2
        },
        'Evaluator_ServerConstraint_ContractValue_GetData': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocIdList',
            Command: 'usp_ClaimDetail_LoadValueFromBizDocIdList',
            DataMember: 'ContractValue0,ContractValueAddVAT0,SubContractBeforeValue,SubContractBeforeValueAddVAT',
            zExpr: "BizDocIdList != ''",
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},{VAR=EmptyField_BizDocId},{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode,Stt',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend_SongSong',
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_OriginalWorkAmount_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'OriginalWorkAmount',
            Value: 'ContractValue0 + SubContractBeforeValue + AmountRevised'
        },
        'Evaluator_OriginalWorkAmountInclueTax_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'OriginalWorkAmountInclueTax',
            Value: 'Math.round(OriginalWorkAmount+(OriginalWorkAmount*TaxRate))'
        },
        'Evaluator_TotalAmountPayment_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'TotalAmountPayment',
            Value: 'OriginalWorkAmountInclueTax'
        },
        'Evaluator_OriginalClaimAmount_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'OriginalClaimAmount',
            Value: 'TotalAmountPayment + AmountTongTTDenKyTruoc + OriginalDeductionAmount - WarrantyValue + CollectedAmount'
        },
        // 'Evaluator_AmountThucHienVAT_Calculator': {
        //     EvaluatorName: 'EvaluatorCaculate',
        //     DataMember: 'AmountThucHienVAT',
        //     Value: 'Math.round(AmountThucHien * (1 + TaxRate))'
        // },
        'Evaluator_ServerUpdated_B30Claim': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Stt',
            Command: 'usp_SolB30Claim_Calculate'
        },
      
    };

    serverConstraint = [
        'Evaluator_ServerConstraint_DefaultDocNo',
        'Evaluator_ServerConstraint_ContractValue_GetData',
        'Evaluator_ServerConstraint_LoadDocument'
    ];

    serverUpdating = [
        // 'Evaluator_ServerConstraint_Check_ApproveSent_NotChange'
    ]

    serverUpdated = [
        // 'Evaluator_ServerUpdated_B30Claim',
        // 'Evaluator_UpdateInfo_WhenApproveSend'
    ];

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_Approve_GetData',
        'Evaluator_ServerConstraint_ClaimDetail_GetData'
    ];

    buttonCommand: string[] = [

    ];

    importCommand: string[] = [

    ]

    columnChanged = {
        ProcessCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_Approve_GetData'
        ]
        },
        ContractValue0: {
            Evaluators: [
                'Evaluator_OriginalWorkAmount_Calculator'
        ]
        },
        SubContractBeforeValue: {
            Evaluators: [
                'Evaluator_OriginalWorkAmount_Calculator'
        ]
        },
        AmountRevised: {
            Evaluators: [
                'Evaluator_OriginalWorkAmount_Calculator'
        ]
        },
        ContractValueAddVAT0: {
            Evaluators: [
                'Evaluator_OriginalWorkAmountInclueTax_Calculator',
                'Evaluator_TotalAmountPayment_Calculator',
                'Evaluator_OriginalClaimAmount_Calculator'
        ]
        },
        SubContractBeforeValueAddVAT: {
            Evaluators: [
                'Evaluator_OriginalWorkAmountInclueTax_Calculator',
                'Evaluator_TotalAmountPayment_Calculator',
                'Evaluator_OriginalClaimAmount_Calculator'
        ]
        },
        TotalAmountRevisedAddVAT: {
            Evaluators: [
                'Evaluator_OriginalWorkAmountInclueTax_Calculator',
                'Evaluator_TotalAmountPayment_Calculator',
                'Evaluator_OriginalClaimAmount_Calculator'
        ]
        },
        AmountTongTTDenKyTruoc: {
            Evaluators: [
                'Evaluator_OriginalWorkAmountInclueTax_Calculator',
                'Evaluator_TotalAmountPayment_Calculator',
                'Evaluator_OriginalClaimAmount_Calculator'
        ]
        },
        OriginalDeductionAmount: {
            Evaluators: [
                'Evaluator_OriginalWorkAmountInclueTax_Calculator',
                'Evaluator_TotalAmountPayment_Calculator',
                'Evaluator_OriginalClaimAmount_Calculator'
        ]
        },
        CollectedAmount: {
            Evaluators: [
                'Evaluator_OriginalWorkAmountInclueTax_Calculator',
                'Evaluator_TotalAmountPayment_Calculator',
                'Evaluator_OriginalClaimAmount_Calculator'
        ]
        },
        WarrantyValue: {
            Evaluators: [
                'Evaluator_OriginalWorkAmountInclueTax_Calculator',
                'Evaluator_TotalAmountPayment_Calculator',
                'Evaluator_OriginalClaimAmount_Calculator'
        ]
        },
        TaxCode: {
            Evaluators: [
                'Evaluator_OriginalWorkAmountInclueTax_Calculator',
                'Evaluator_TotalAmountPayment_Calculator',
                'Evaluator_OriginalClaimAmount_Calculator'
        ]
        },
        OriginalWorkAmountInclueTax: {
            Evaluators: [
                // 'Evaluator_OriginalWorkAmountInclueTax_Calculator',
                'Evaluator_TotalAmountPayment_Calculator',
                'Evaluator_OriginalClaimAmount_Calculator'
        ]
        },
       
    };

    columnChangedChild = [
        // {2
        //     Tables: 0,
        //     columnChanged: {
        //     }
        // },
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
            directory: 'reporterplansigncon',
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
                    key: 'ClaimDate',
                    label: 'Ngày lập',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'ClaimNo',
                    label: 'Số hồ sơ',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'LoaiClaim',
                    label: 'Loại Claim',
                    lookupKey: 'Class',
                    binding: {
                    },
                    
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='LOAIQTCLAIM'",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 6
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'HardDocNo',
                    label: 'Số quyết toán (bản cứng)',
                    type: 'text',
                    col: 6,
                    // isReadOnly: 'true',
                    // style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Dự án',
                    lookupKey: 'ProductCost',
                    binding: {
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",// AND RowId = '{VAR=Filter.ProductCostId}'",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 6
                }, this.srv, this.parentData),
                new DateBoxInput({
                    key: 'HardSignDate',
                    label: 'Ngày ký (bản cứng)',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    
                }),
               
                new MultiSelectInput({
                    key: 'BizDocIdList',
                    label: 'Hợp đồng',
                    lookupKey: 'BizDocC2',
                    binding: {
                       
                    },
                    lookupfilter: "(DocCode='C2') AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{VAR=Filter.ProductCostId}')",
                    //lookupfilter: "DocCode='C2' AND (BranchCode='{VAR=Branch.Ma_Dvcs}') AND (ProductCostId='{EXPR=ProductCostId}' OR ISNULL('{EXPR=ProductCostId}','')='') AND Post_TheKho=1",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12
                }, this.srv),
                new NumberBoxInput({
                    key: 'ContractValue0',
                    label: 'Giá trị HĐ (trước VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                // new NumberBoxInput({
                //     key: 'ContractValueAddVAT0',
                //     label: 'Giá trị HĐ (sau VAT)',
                //     type: 'number',
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }),
                new NumberBoxInput({
                    key: 'SubContractBeforeValue',
                    label: 'Giá trị các phụ lục (Trước VAT)',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                    
                }),
                // new NumberBoxInput({
                //     key: 'SubContractBeforeValueAddVAT',
                //     label: 'Giá trị các phụ lục (Sau VAT)',
                //     type: 'number',
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                    
                // }),
                new NumberBoxInput({
                    key: 'AmountRevised',
                    label: 'GT phát sinh tăng/giảm (trước VAT)',
                    type: 'number',
                    col: 6,
                    
                    isNewRow: true,
                    
                }),
                new LookupBoxInput({
                    key: 'TaxCode',
                    label: 'Thuế',
                    lookupKey: 'Tax',
                    binding: {
                        Rate: 'TaxRate',
                        IsAdjusted: 'IsAdjusted'
                    },
                    lookupfilter: "Type=1 AND IsActive=1 AND IsGroup=0 AND IsDefault = 1",
                    hideValueMember: false,
                    col: 6,
                    //isDisabled: 'true'
                }, this.srv, this.parentData),
                // new NumberBoxInput({
                //     key: 'TotalAmountRevisedAddVAT',
                //     label: 'GT phát sinh tăng/giảm (sau VAT)',
                //     type: 'number',
                //     isNewRow: true,
                //     col: 6
                // }),
                new NumberBoxInput({
                    key: 'OriginalWorkAmount',
                    label: 'Giá trị quyết toán',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                // new CheckBoxInput({
                //     key: 'IsQT',
                //     label: 'Quyết toán',
                //     col: 6,
                //     isDisabled: 'true'
                // }),                              
           
                new NumberBoxInput({
                    key: 'OriginalWorkAmountInclueTax',
                    label: 'Giá trị quyết toán (gồm VAT)',
                    type: 'number',
                    col: 6,
                    // isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    isDisabled: "{EXPR=IsAdjusted} != 1",
                    // style: 'background-color:#F1EDED;border-radius:8px;',
                }),
                new NumberBoxInput({
                    key: 'TotalAmountPayment',
                    label: 'Tổng số tiền thanh toán',
                    type: 'number',
                    col: 6,
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    isReadOnly: 'true',
                    // style: 'background-color:#F1EDED;border-radius:8px;',
                }),
                new NumberBoxInput({
                    key: 'AmountTongTTDenKyTruoc',
                    label: 'Trừ các đợt T.Toán trước',
                    type: 'number',
                    col: 6,
                   
                    // style: 'background-color:#F1EDED;border-radius:8px;',
                }),
                new NumberBoxInput({
                    key: 'OriginalDeductionAmount',
                    label: 'Khấu trừ khác (Phạt)',
                    type: 'number',
                    col: 6
                   
                }),
                new NumberBoxInput({
                    key: 'CollectedAmount',
                    label: 'Bù trừ công nợ (Nếu có)',
                    type: 'number',
                    col: 6
                   
                }),
                // new NumberBoxInput({
                //     key: 'WarrantyValue',
                //     label: 'Giữ lại bảo hành (nếu có)',
                //     type: 'number',
                //     col: 6
                // }),
                new NumberBoxInput({
                    key: 'OriginalClaimAmount',
                    label: 'Số tiền phải TT đợt này',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isReadOnly: 'true'
                    // style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new DateBoxInput({
                    key: 'BeginWarranty',
                    label: 'Ngày bắt đầu bảo hành',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'NumberWarranty',
                    label: 'Thời hạn bảo hành (Tháng)',
                    type: 'number',
                    // isDisabled: 'true',
                    col: 6,
                   
                }),
                new DateBoxInput({
                    key: 'EndWarranty',
                    label: 'Ngày kết thúc bảo hành',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isReadOnly: 'true'
                }),
                new DateBoxInput({
                    key: 'BeginWork',
                    label: 'Ngày bắt đầu thi công',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'EndWork',
                    label: 'Ngày kết thúc thi công',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'DateSignTOC',
                    label: 'Ngày ký trên TOC',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'ExpectedDateSignTOC',
                    label: 'Ngày ký TOC dự kiến',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'RealDateSignTOC',
                    label: 'Ngày thực tế ký TOC',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                // new NumberBoxInput({
                //     key: 'AmountTongTTDenKyNay',
                //     label: 'Tổng T. toán đến kỳ này',
                //     type: 'number',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                // new NumberBoxInput({
                //     key: 'AmountTongTTDenKyTruoc',
                //     label: 'Tổng T. toán đến kỳ trước',
                //     type: 'number',
                //     col: 6,
                //     isDisabled: "'{EXPR=IsTamUng}'=='true'"
                // }),
               
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND DocStatus=4 AND Ma_Ct='{EXPR=DocCode}'",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
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
                }),
                new UploadInput({
                    key: 'FilePath',
                    label: 'Đính kèm file đã ký',
                    col: 6
                }, this.srv),
            ]
        })
    ];

    childColumns = [
        {
            header: 'Ngày hóa đơn',
            binding: 'DocDate',
            isRequired: true,
            width: 120,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Số hóa đơn',
            binding: 'DocNo',
            isRequired: true,
            width: 120
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            width: 300
        },
        {
            header: 'Tiền',
            binding: 'OriginalAmount2',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: 'Tiền thuế',
            binding: 'OriginalAmount3',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: 'Tổng tiền',
            binding: 'OriginalAmount',
            dataType: 'Number',
            isRequired: true,
            width: 150
        }
    ];

    childColumns1 = [
        {
            header: 'Ngày thanh toán',
            binding: 'DocDate',
            isRequired: true,
            width: 120,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Số phiếu',
            binding: 'DocNo',
            isRequired: true,
            width: 120
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            width: 300
        },
        {
            header: 'Số tiền',
            binding: 'OriginalAmount',
            dataType: 'Number',
            isRequired: true,
            width: 150
        }
    ];

    childColumns2 = [
        {
            header: 'Ghi chú',
            binding: 'Description',
            width: 250
        },
        {
            header: 'Yêu cầu đính kèm',
            binding: 'Attached',
            dataType: 'Boolean',
            width: 80,
            isReadOnly: 'true'
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 500,
            dataType: 'Object',
            // //validators: "{EXPR=Description} != '' && {EXPR=Description} == 'Yêu cầu đính kèm' && {EXPR=FilePath}==0",
            // validators: "{EXPR=Attached} == true && {EXPR=Description} != 'Theo mẫu công ty ban hành' && {EXPR=FilePath}==0",
            // validatorMessage: 'Yêu cầu đính kèm tài liệu',
            // ignoreError: 1
            // //exprReadOnly: "{EXPR=Attached} == true && {EXPR=Description} != ''"
        }
    ];

    childColumns3 = [
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
            width: 250,
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
            header: 'Người duyệt được chỉ định',
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
        // {
        //     header: 'Trả về cấp bậc',
        //     binding: 'PositionCodeReturn',
        //     width: 100,
        //     isReadOnly: 'true'
        // }
    ];

    childColumns4 = [
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
    childColumns5 = [
       
        {
            header: 'Số hồ sơ',
            binding: 'DocNo2',
            isRequired: true,
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: 'Số bản cứng',
            binding: 'HardDocNo',
            isRequired: true,
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: 'Nội dung',
            binding: 'BizDescription',
            width: 300,
            isReadOnly: 'true'
        },
        {
            header: 'GT tăng/giảm (Trước VAT)',
            binding: 'AmountRevised',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'GT tăng/giảm (Sau VAT)',
            binding: 'TotalAmountRevisedAddVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Thời gian BH (Theo bảo lãnh/giữ tiền)',
            binding: 'ContractQuantity',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: 'Thời gian BH (theo cam kết)',
            binding: 'PerformLastPeriodQuantity',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: 'Tổng thời gian bảo hành',
            binding: 'TongTGBH',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Ngày bắt đầu BH',
            binding: 'BeginDateBH',
            isRequired: true,
            width: 120,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Ngày kết thúc BH',
            binding: 'EndDateBH',
            isRequired: true,
            width: 120,
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isReadOnly: 'true'
        },
        {
            header: 'Số bản cứng',
            binding: 'ParentRowId',
            isRequired: true,
            width: 0,
            isReadOnly: 'true'
        },
    ];
}