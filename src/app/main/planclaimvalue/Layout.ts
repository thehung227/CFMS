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

// Kế hoạch Claim
export class LayoutPlanClaimValueExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30Claim_Explorer',
                FilterKey: "DocCode = 'CV' AND (ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND IsActive=1",// AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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
                // {
                //     Layout: 'MAU9',
                //     Name: 'WorkFlow',
                //     FileName: 'WorkFlow KHKK - {EXPR=ProductName} - {EXPR=DocNo}',
                //     WordName: 'WorkFlow_KHKK.docx',
                //     FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                // }
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
        {
            header: 'Gói thầu',
            binding: 'ProductName',
            width: 250
        },
        {
            header: 'Số claim',
            binding: 'ClaimNo',
            width: 120,
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

export class LayoutPlanClaimValueEditor implements IEditorFormulaDeclaration {

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
                    DocCode: 'CV',
                    IsWebData: true,
                    ClaimDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    TaxRate: 0.10,
                    CurrencyCode: 'VND'
                }
            },
            Child: [
                {
                    Name: 'vB30ClaimDetail_EditCV',
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        BuiltinOrder: '1'
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
                    Name: 'vB30ClaimIncurredDetail',
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        BuiltinOrder: '1'
                    },
                    IgnoreSave: true
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
        // 'Evaluator_ServerConstraint_DefaultDocNo': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,DocCode,DocDate',
        //     Command: 'ufn_B30CCMBudget_DefaultDocNo',
        //     zExpr: "ProductCostId != ''",
        //     DataMember: 'DocNo'
        // },
        // 'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep': {
        //     EvaluatorName: 'EvaluatorValidate',
        //     ConstraintKey: 'ProductCostId,CustomerCode,DocCode,Id,{VAR=Branch.Ma_Dvcs}',
        //     Command: 'ufn_Coteccons_CheckVer0_ChuaDuyetXong',
        //     zExpr: 'Id < 0',
        //     MessageText: 'Không thể lập mới khi chưa hoàn thiện duyệt KHKK trước',
        //     IgnoreError: 0
        // },
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'Stt,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Conteccons_NotChangeWhenApproveSent',
            MessageText: 'Không được thay đổi khi đã gửi duyệt',
            IgnoreError: 0
        },
        // 'Evaluator_OriginalWorkAmount_Calculate': {
        //     EvaluatorName: 'EvaluatorSumChild',
        //     DataMember: "OriginalWorkAmount",
        //     Value: "PerformThisPeriodAmount",
        //     Tables: 0
        // },
        'Evaluator_AmountThucHien_Calculate': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "AmountThucHien",
            Value: "PerformThisPeriodAmount",
            Tables: 0
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,{VAR=EmptyField_ParentBizDocId}',
            Command: 'usp_B30BizDocApprove_GetData',
            OutputTable: 3
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},{VAR=EmptyField_BizDocId},{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode,Stt',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true'
        },
        // 'Evaluator_OriginalWorkAmountInclueTax_Calculator': {
        //     EvaluatorName: 'EvaluatorCaculate',
        //     DataMember: 'OriginalWorkAmountInclueTax',
        //     Value: 'Math.round(OriginalWorkAmount+(OriginalWorkAmount*TaxRate))'
        // },
        'Evaluator_AmountThucHienVAT_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'AmountThucHienVAT',
            Value: 'Math.round(AmountThucHien+(AmountThucHien*TaxRate))'
        },
        'Evaluator_JKVAT_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'JKVAT',
            Value: 'Math.round((AmountThucHien*TaxRate))'
        },
        // 'Evaluator_OriginalAdvanceAmount_Calculator': {
        //     EvaluatorName: 'EvaluatorCaculate',
        //     DataMember: 'OriginalAdvanceAmount',
        //     Value: '(Math.round((AmountTamUng/AmountContract) * 100)/100)*AmountThucHien'
        // },
        'Evaluator_OriginalKeepAmount_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'OriginalKeepAmount',
            Value: 'Math.round(AmountThucHienVAT*KeepPercent)'
         
        },
        'Evaluator_OriginalClaimAmount_AutoValue': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'OriginalClaimAmount',
            Value: 'Math.round(AmountThucHien*RateTH)+Math.round(JKVAT*RateTHVAT)+AmountTamUng-OriginalAdvanceAmount-OriginalDeductionAmount'
        },
        'Evaluator_Child_OriginalAmount_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'OriginalAmount',
            Value: 'Math.round(Quantity*UnitCost)',
            Tables: 0
        },
        'Evaluator_ServerConstraint_ClaimDetail_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,BizDocId,ClaimDate,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Newtecons_GetNearClaim',
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_ClaimIncurredDetail_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,BizDocId,ClaimDate,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Newtecons_GetBill_Incurred',
            OutputTable: 5
        },
        'Evaluator_ServerConstraint_Amount_TTKyTruoc': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ClaimDate,ProductCostId,TaxRate,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Newtecons_GetContractInvestor',
            DataMember: 'AmountContract,AmountVO,ContractVO_VAT,TotalAmountContract'
        },
        'Evaluator_ServerConstraint_AmountTongTTDenKyTruoc': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ClaimDate,Stt,ProductCostId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_GetClaim_KyTruoc',
            DataMember: 'AmountTongTTDenKyTruoc'
        },
        'Evaluator_Child_AcumPerformAmount_AutoValue': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "AcumPerformAmount",
            Value: "PerformLastPeriodAmount+PerformThisPeriodAmount",
            Tables: 0
        },
        'Evaluator_Child_AcumPerformQuantity_AutoValue': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "AcumPerformQuantity",
            Value: "PerformLastPeriodQuantity+PerformThisPeriodQuantity",
            OTables: 0
        },
        'Evaluator_ServerUpdated_B30Claim': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Stt',
            Command: 'usp_SolB30Claim_Calculate'
        },        
    };

    serverConstraint = [
        'Evaluator_ServerConstraint_Amount_TTKyTruoc'
    ];

    serverUpdating = [
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange'
    ]

    serverUpdated = [
        'Evaluator_ServerUpdated_B30Claim',
        'Evaluator_UpdateInfo_WhenApproveSend'
    ];

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_ClaimDetail_GetData'
    ];

    buttonCommand: string[] = [

    ];

    importCommand: string[] = [

    ]

    columnChanged = {
        ProductCostId: {
            Evaluators: [
                'Evaluator_ServerConstraint_Amount_TTKyTruoc',
                'Evaluator_ServerConstraint_AmountTongTTDenKyTruoc'
            ]            
        },
        ProcessCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_Approve_GetData'
            ]
        },
        OriginalWorkAmount: {
            Evaluators: [
                // 'Evaluator_OriginalWorkAmountInclueTax_Calculator'
            ]            
        },
        TaxRate: {
            Evaluators: [
                'Evaluator_JKVAT_Calculator',
                'Evaluator_AmountThucHienVAT_Calculator',
                // 'Evaluator_OriginalWorkAmountInclueTax_Calculator'
            ]              
        },
        AmountTamUng: {
            Evaluators: [
                'Evaluator_OriginalClaimAmount_AutoValue'
                // 'Evaluator_OriginalAdvanceAmount_Calculator'
            ] 
        },
        AmountContract: {
            Evaluators: [
                'Evaluator_OriginalAdvanceAmount_Calculator'
            ] 
        },
        AmountThucHien: {
            Evaluators: [
                'Evaluator_JKVAT_Calculator',
                'Evaluator_AmountThucHienVAT_Calculator',
                'Evaluator_OriginalClaimAmount_AutoValue'
                // 'Evaluator_OriginalAdvanceAmount_Calculator'
            ] 
        },
        AmountThucHienVAT: {
            Evaluators: [
                // 'Evaluator_OriginalKeepAmount_Calculator',
                'Evaluator_OriginalClaimAmount_AutoValue'
            ]             
        },
        KeepPercent: {
            Evaluators: [
                'Evaluator_OriginalKeepAmount_Calculator'
            ]               
        },
        OriginalWorkAmountInclueTax: {
            Evaluators: [
                // 'Evaluator_OriginalClaimAmount_AutoValue'
            ]            
        },
        OriginalKeepAmount: {
            Evaluators: [
                'Evaluator_OriginalClaimAmount_AutoValue'
            ]            
        },
        RateTH: {
            Evaluators: [
                'Evaluator_OriginalClaimAmount_AutoValue'
            ]            
        },
        RateTHVAT: {
            Evaluators: [
                'Evaluator_OriginalClaimAmount_AutoValue'
            ]            
        },
        OriginalAdvanceAmount: {
            Evaluators: [
                'Evaluator_OriginalClaimAmount_AutoValue'
            ]            
        },
        OriginalDeductionAmount: {
            Evaluators: [
                'Evaluator_OriginalClaimAmount_AutoValue'
            ]            
        },
    };

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
                PerformLastPeriodAmount: {
                    Evaluators: [
                        // 'Evaluator_OriginalWorkAmount_Calculate',
                        
                        // 'Evaluator_Child_AcumPerformAmount_AutoValue'
                        // 'Evaluator_OriginalWorkAmountInclueTax_Calculator',
                        // 'Evaluator_AmountThucHienVAT_Calculator'
                    ]            
                },
                PerformThisPeriodAmount: {
                    Evaluators: [
                        'Evaluator_Child_AcumPerformAmount_AutoValue',
                        // 'Evaluator_OriginalWorkAmount_Calculate',
                        'Evaluator_AmountThucHien_Calculate'
                        
                        // 'Evaluator_OriginalWorkAmountInclueTax_Calculator',
                        // 'Evaluator_AmountThucHienVAT_Calculator'
                    ]            
                },
                PerformLastPeriodQuantity: {
                    Evaluators: [
                        // 'Evaluator_OriginalWorkAmount_Calculate',
                        
                        // 'Evaluator_Child_AcumPerformQuantity_AutoValue'
                        // 'Evaluator_OriginalWorkAmountInclueTax_Calculator',
                        // 'Evaluator_AmountThucHienVAT_Calculator'
                    ]            
                },
                PerformThisPeriodQuantity: {
                    Evaluators: [
                        // 'Evaluator_OriginalWorkAmount_Calculate',
                        
                        // 'Evaluator_Child_AcumPerformQuantity_AutoValue'
                        // 'Evaluator_OriginalWorkAmountInclueTax_Calculator',
                        // 'Evaluator_AmountThucHienVAT_Calculator'
                    ]            
                },
                UnitCost: {
                    Evaluators: [
                        'Evaluator_Child_OriginalAmount_Calculator'
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
                    label: 'Số claim/ IPC',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    // isReadOnly: 'true',
                    // style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu',
                    lookupKey: 'ProductCost',
                    binding: {
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND RowId = '{VAR=Filter.ProductCostId}'",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'BizDocId',
                    label: 'Hợp đồng',
                    lookupKey: 'BizDoc',
                    binding: {
                    },
                    lookupfilter: "DocCode='C2' AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId='{EXPR=ProductCostId}'",
                    //lookupfilter: "DocCode='C2' AND (BranchCode='{VAR=Branch.Ma_Dvcs}') AND (ProductCostId='{EXPR=ProductCostId}' OR ISNULL('{EXPR=ProductCostId}','')='') AND Post_TheKho=1",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'TaxRate',
                    label: 'Thuế suất (%)',
                    type: 'number',
                    format: 'P2',
                    min: 0,
                    max: 1,
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'IsTamUng',
                    label: 'Tạm ứng',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'AmountContract',
                    label: 'Giá trị Hợp đồng (A)',
                    type: 'number',
                    col: 6,
                    isNewRow: true
                }),
                new CheckBoxInput({
                    key: 'IsQT',
                    label: 'Quyết toán',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'AmountVO',
                    label: 'Giá trị VO (B)',
                    type: 'number',
                    col: 6,
                    isNewRow: true
                }),
                new CheckBoxInput({
                    key: 'IsQT0',
                    label: 'Sau quyết toán',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'ContractVO_VAT',
                    label: 'Thuế VAT (A + B) * %',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'TotalAmountContract',
                    label: 'Tổng giá trị HĐ ước tính',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'DayOfPayment',
                    label: 'Thời hạn t. toán (ngày)',
                    type: 'number',
                    col: 6
                }),         
                new NumberBoxInput({
                    key: 'AmountThucHien',
                    label: 'Giá trị thực hiện (K)',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isDisabled: "'{EXPR=IsTamUng}'=='true'"
                }),
                new DateBoxInput({
                    key: 'CreateDate',
                    label: 'Ngày Claim kế hoạch',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6
                }),                   
                new NumberBoxInput({
                    key: 'JKVAT',
                    label: 'Thuế VAT (K * %)',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isDisabled: 'true'
                }),
                new DateBoxInput({
                    key: 'CreateDate1',
                    label: 'Ngày Claim thực tế',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    // validators: [Validators.required],
                    col: 6
                }), 
                new NumberBoxInput({
                    key: 'AmountThucHienVAT',
                    label: 'Giá trị thực hiện (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),      
                new NumberBoxInput({
                    key: 'KeepPercent',
                    label: 'Tỉ lệ % giữ lại',
                    type: 'number',
                    format: 'P2',
                    min: 0,
                    max: 1,
                    col: 6,
                    isDisabled: "'{EXPR=IsTamUng}'=='true'"
                }),                
             
               
               
                       
                new NumberBoxInput({
                    key: 'OriginalKeepAmount',
                    label: 'Tiền giữ lại (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),   
               
                new DateBoxInput({
                    key: 'ApprovalDate1',
                    label: 'Ngày duyệt thực tế',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    // validators: [Validators.required],
                    
                    col: 6,
                }),   
                new NumberBoxInput({
                    key: 'RateTH',
                    label: '% thanh toán trước VAT',
                    type: 'number',
                    format: 'P2',
                    min: 0,
                    max: 1,
                    col: 6
                }),          
                new NumberBoxInput({
                    key: 'RateTHVAT',
                    label: '% thanh toán VAT',
                    type: 'number',
                    format: 'P2',
                    min: 0,
                    max: 1,
                    col: 6
                }),                               
                new NumberBoxInput({
                    key: 'AmountTamUng',
                    label: 'Giá trị tạm ứng (J)',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                }),                 
                new CheckBoxInput({
                    key: 'IsBaoLanh',
                    label: 'Bảo lãnh bảo hành',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'OriginalAdvanceAmount',
                    label: 'Hoàn trả tạm ứng',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isDisabled: "'{EXPR=IsTamUng}'=='true'"
                }),
                new NumberBoxInput({
                    key: 'WarrantyValue',
                    label: 'Giữ lại bảo hành (nếu có)',
                    type: 'number',
                    col: 6,
                    isDisabled: "'{EXPR=IsTamUng}'=='true'"
                }), 
                new NumberBoxInput({
                    key: 'OriginalDeductionAmount',
                    label: 'Khấu trừ khác',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isDisabled: "'{EXPR=IsTamUng}'=='true'"
                }),  
                new DateBoxInput({
                    key: 'EndWarranty',
                    label: 'Ngày hết bảo hành',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isDisabled: "'{EXPR=IsTamUng}'=='true'"
                }),
                new NumberBoxInput({
                    key: 'AmountTongTTDenKyNay',
                    label: 'Tổng T. toán đến kỳ này',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'AmountTongTTDenKyTruoc',
                    label: 'Tổng T. toán đến kỳ trước',
                    type: 'number',
                    col: 6,
                    isDisabled: "'{EXPR=IsTamUng}'=='true'"
                }),
                new NumberBoxInput({
                    key: 'OriginalClaimAmount',
                    label: 'Giá trị thanh toán kỳ này',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new DateBoxInput({
                    key: 'PaymentDate',
                    label: 'Ngày T. toán kế hoạch',
                    type: 'date',
                    isNewRow: true,
                    format: 'dd/MM/yyyy',
                    col: 6,
                    validators: [Validators.required]
                }),
                // new DateBoxInput({
                //     key: 'PaymentDateThucTe',
                //     label: 'Ngày T. toán thực tế',
                //     type: 'date',
                   
                //     format: 'dd/MM/yyyy',
                //     col: 6,
                //     validators: [Validators.required]
                // }),
                new TextBoxInput({
                    key: 'Remark',
                    label: 'Ghi chú',
                    type: 'text',
                    col: 12
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive=1 AND Ma_Ct='CL'",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
                // new ButtonInput({
                //     key: 'btnBaoCao',
                //     label: 'Báo cáo điều chỉnh kế hoạch ký kết',
                //     col: 6
                // }),  
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'Đính kèm KHKKHĐ đã ký',
                //     col: 6
                // }, this.srv),
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
            header: 'Stt',
            binding: 'ItemNo',
            isRequired: true,
            width: 120
        },
        {
            header: 'Diễn giải',
            binding: 'Description',
            width: 300
        },
        {
            header: 'Đơn vị',
            binding: 'Unit',
            isRequired: true,
            width: 120
        },
        // {
        //     header: 'Khối lượng theo hợp đồng',
        //     binding: 'ContractQuantity',
        //     dataType: 'Number',
        //     isRequired: true,
        //     width: 110
        // },
        // {
        //     header: 'Khối lượng thực hiện kỳ trước',
        //     binding: 'PerformLastPeriodQuantity',
        //     dataType: 'Number',
        //     isRequired: true,
        //     width: 110
        // },
        // {
        //     header: 'Khối lượng thực hiện kỳ này',
        //     binding: 'PerformThisPeriodQuantity',
        //     dataType: 'Number',
        //     isRequired: true,
        //     width: 110
        // },
        // {
        //     header: 'Khối lượng lũy kế thực hiện',
        //     binding: 'AcumPerformQuantity',
        //     dataType: 'Number',
        //     isRequired: true,
         
        // },
        // {
        //     header: '% khối lượng thực hiện',
        //     binding: 'QuantityRate',
        //     dataType: 'Number',
        //     isRequired: true,
        //     width: 110,
            
        //     min: 0,
        //     max: 1,
        //     format: 'p2'
        // },
        {
            header: 'Giá trị theo hợp đồng',
            binding: 'ContractAmount',
            dataType: 'Number',
            isRequired: true,
            width: 110
        },
        {
            header: 'Giá trị thực hiện kỳ trước',
            binding: 'PerformLastPeriodAmount',
            dataType: 'Number',
            isRequired: true,
            width: 110
        },
        {
            header: 'Giá trị thực hiện kỳ này',
            binding: 'PerformThisPeriodAmount',
            dataType: 'Number',
            isRequired: true,
            width: 110
        },
        {
            header: 'Giá trị lũy kế thực hiện',
            binding: 'AcumPerformAmount',
            dataType: 'Number',
            isRequired: true,
            width: 110
        },
        {
            header: 'Ghi chú',
            binding: 'Remark',
            width: 300
        },
        {
            header: 'Id_Bill',
            binding: 'ParentRowId',
            width: 100
        },
        {
            header: 'Thông tin Bill',
            binding: 'BillInfo',
            width: 200
        },
        {
            header: 'Click',
            binding: 'BtnBOQ',
            
            dataType: 'Object',
            isButton: true,
            textButton: '...',
            width: 70,
            linkCommand: {
                directory: 'boqinvestorclaim',
                type: 'detail',
                key: 'Id_BOQ',
                parameter: { 'Commandkey': 'boqinvestorclaim-editor', 'BizDocId_BOQ': '{EXPR=BizDocId_BOQBILL}','ParentBizDocId': '{EXPR=RowId}', 'CustomerCode': '{EXPR=CustomerCode}', 'ProductCostId': '{EXPR=ProductCostId}'}
            }
        },
        {
            header: 'Id_BOQ',
            binding: 'Id_BOQ',
            dataType: 'Number',
            width: 100
        },
        {
            header: 'BOQ',
            binding: 'BizDocId_BOQ',
            width: 100
        },
        {
            header: 'RowIdId_BOQ',
            binding: 'BizDocId_BOQBILL',
            width: 100
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
    ];
    childColumns5 = [
      
        {
            header: 'Stt',
            binding: 'ItemNo',
            isRequired: true,
            width: 120
        },
        {
            header: 'Diễn giải',
            binding: 'Description',
            width: 300
        },
        {
            header: 'Đơn vị',
            binding: 'Unit',
            isRequired: true,
            width: 120
        },
        // {
        //     header: 'Khối lượng theo hợp đồng',
        //     binding: 'ContractQuantity',
        //     dataType: 'Number',
        //     isRequired: true,
        //     width: 110
        // },
        // {
        //     header: 'Khối lượng thực hiện kỳ trước',
        //     binding: 'PerformLastPeriodQuantity',
        //     dataType: 'Number',
        //     isRequired: true,
        //     width: 110
        // },
        // {
        //     header: 'Khối lượng thực hiện kỳ này',
        //     binding: 'PerformThisPeriodQuantity',
        //     dataType: 'Number',
        //     isRequired: true,
        //     width: 110
        // },
        // {
        //     header: 'Khối lượng lũy kế thực hiện',
        //     binding: 'AcumPerformQuantity',
        //     dataType: 'Number',
        //     isRequired: true,
         
        // },
        // {
        //     header: '% khối lượng thực hiện',
        //     binding: 'QuantityRate',
        //     dataType: 'Number',
        //     isRequired: true,
        //     width: 110,
            
        //     min: 0,
        //     max: 1,
        //     format: 'p2'
        // },
        {
            header: 'Giá trị theo hợp đồng',
            binding: 'ContractAmount',
            dataType: 'Number',
            isRequired: true,
            width: 110
        },
        {
            header: 'Giá trị thực hiện kỳ trước',
            binding: 'PerformLastPeriodAmount',
            dataType: 'Number',
            isRequired: true,
            width: 110
        },
        {
            header: 'Giá trị thực hiện kỳ này',
            binding: 'PerformThisPeriodAmount',
            dataType: 'Number',
            isRequired: true,
            width: 110
        },
        {
            header: 'Giá trị lũy kế thực hiện',
            binding: 'AcumPerformAmount',
            dataType: 'Number',
            isRequired: true,
            width: 110
        },
        {
            header: 'Ghi chú',
            binding: 'Remark',
            width: 300
        },
        {
            header: 'Id_Bill',
            binding: 'ParentRowId',
            width: 100
        },
        {
            header: 'Thông tin Bill',
            binding: 'BillInfo',
            width: 200
        },
        {
            header: 'Click',
            binding: 'BtnBOQ',
            
            dataType: 'Object',
            isButton: true,
            textButton: '...',
            width: 70,
            linkCommand: {
                directory: 'boqinvestorclaim',
                type: 'detail',
                key: 'Id_BOQ',
                parameter: { 'Commandkey': 'boqinvestorclaim-editor', 'BizDocId_BOQ': '{EXPR=BizDocId_BOQBILL}','ParentBizDocId': '{EXPR=RowId}', 'CustomerCode': '{EXPR=CustomerCode}', 'ProductCostId': '{EXPR=ProductCostId}'}
            }
        },
        {
            header: 'BOQ',
            binding: 'BizDocId_BOQ',
            width: 100
        },
        {
            header: 'RowIdId_BOQ',
            binding: 'BizDocId_BOQBILL',
            width: 100
        }
    ];
}