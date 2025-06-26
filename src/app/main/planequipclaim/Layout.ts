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
export class LayoutPlanEquipClaimExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30Claim_Explorer',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND DocCode = 'CL' AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND IsActive=1",// AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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
                    FileName: 'WorkFlow Claim - {EXPR=ProductName} - {EXPR=DocNo}',
                    WordName: 'WorkFlow_ClaimThanhToan.docx',
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
            header: 'Nội dung HĐ',
            binding: 'DescriptionBiz',
            width: 250,
            dataType: 'String'
        },
        {
            header: 'Chủ đầu tư',
            binding: 'BizDocCustomerName',
            width: 250,
            dataType: 'String'
        },
        {
            header: 'Ngày lập',
            binding: 'CreatedAt',
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
            header: 'Giá trị Claim (chưa VAT)',
            binding: 'OriginalWorkAmount',
            width: 200,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Giá trị Hóa đơn (chưa VAT)',
            binding: 'OriginalAmountHD',
            width: 200,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Khối lượng tháng (date)',
            binding: 'MonthQuantityDate',
            width: 180,
            dataType: 'Date',
            format: 'MM/yyyy'
        },
        {
            header: 'Khối lượng tháng',
            binding: 'Description',
            width: 250,
            dataType: 'String'
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
        },
        {
            header: 'Công trình',
            binding: 'ProductName',
            width: 0,
            dataType: 'String'
        },
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

export class LayoutPlanEquipClaimEditor implements IEditorFormulaDeclaration {

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
                    ParentId: -1,
                    DocCode: 'CL',
                    IsWebData: true,
                    ClaimDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    TaxRate: 0.10,
                    CurrencyCode: 'VND'
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
                    Name: 'vB30ClaimDetail', //view ảo
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
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
                    // Sort: 'ApproveGroup',
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
                    Name: 'vB30ClaimAppoveHistory', //view ảo
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    },
                    IgnoreSave: true
                }
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
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,{VAR=EmptyField_ParentBizDocId}',
            Command: 'usp_B30BizDocApprove_GetData',
            OutputTable: 3
        },
        'Evaluator_ServerConstraint_BizDocId_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'BizDocId',
            Command: 'usp_B30ClaimApproveHistory_LoadData',
            OutputTable: 5
        },
        'Evaluator_ServerConstraint_GTTH_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Claim_GetGiaTriThucHien',
            OutputTable: 1
        },
        'Evaluator_ServerUpdating_Check_OriginalAmountClaim': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'Stt,OriginalWorkAmount',
            Command: 'ufn_Check_OriginalClaimAmount',
            MessageText: 'Giá trị thi công không khớp với bảng chi tiết Giá trị thực hiện',
            zExpr: 'ApproveSend == true && CompletedApprove == false',
            IgnoreError: 0
        },
        'Evaluator_ServerUpdating_Check_TamUng': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'Stt',
            Command: 'ufn_Check_TamUng',
            MessageText: 'Claim tạm ứng không phát sinh KL thi công !!!',
            zExpr: 'ApproveSend == true && CompletedApprove == false',
            IgnoreError: 0
        },
        'Evaluator_ServerUpdating_Check_OriginalAmountClaim1': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'OriginalClaimAmount,OriginalClaimAmount1,OriginalClaimAmount2',
            Command: 'ufn_Check_OriginalClaimAmount1',
            MessageText: 'Giá trị thanh toán = Giá trị thanh toán đợt này + Đợt nợ!!',
            zExpr: 'CompletedApprove == false',
            IgnoreError: 0
        },
        'Evaluator_ServerUpdating_Check_KLThiCongBCH': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,BizDocId,Stt,ClaimDate,OriginalWorkAmount,KLThiCongBCH',
            Command: 'ufn_Claim_Check_KLThiCongBCH',
            MessageText: 'Khối lượng đã thi công phải lớn hơn hoặc bằng lũy kế khối lượng thi công!!',
            zExpr: 'CompletedApprove == false',
            IgnoreError: 0
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},{VAR=EmptyField_BizDocId},{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode,Stt',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true && CompletedApprove == false'
        },
        'Evaluator_OriginalWorkAmountInclueTax_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'OriginalWorkAmountInclueTax',
            Value: 'Math.round(OriginalWorkAmount+(OriginalWorkAmount*TaxRate))'
        },
        'Evaluator_OriginalClaimAmount1_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'OriginalClaimAmount',
            Value: 'OriginalWorkAmountInclueTax-(OriginalKeepAmount)-(OriginalAdvanceAmount)-(OriginalDeductionAmount)-(CollectedAmount)-(UtilityOffsetAmount)-(CustodyValueAmount)',
            zExpr: 'IsTamUng == false',
        },
        'Evaluator_OriginalClaimAmount_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'OriginalClaimAmount2',
            Value: 'OriginalClaimAmount-OriginalClaimAmount1'
        },
        'Evaluator_OriginalClaimAmount_Calculator_IsTamUng': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'OriginalClaimAmount1',
            Value: 'OriginalClaimAmount',
            zExpr: 'IsTamUng == true'
        },
        'Evaluator_OriginalAdvanceAmount_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'OriginalAdvanceAmount',
            Value: '(Math.round((AmountTamUng/AmountContract) * 100)/100)*AmountThucHien'
        },
        'Evaluator_ServerConstraint_Check_TotalApproveHistory': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "Id,NumDayApprove",
            Command: 'ufn_Check_HanDuyetHoSo',
            MessageText: 'Tổng kế hoạch duyệt Claim khác với số ngày trên HĐ.',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true && CompletedApprove == false'
        },
        'Evaluator_ServerConstraint_Check_ApproveHistory': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "Id",
            Command: 'ufn_Check_BuiltinOrder4',
            MessageText: 'Yêu cầu nhập đầy đủ ngày duyệt thực tế trước khi gửi duyệt.',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_OriginalKeepAmount_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'OriginalKeepAmount',
            Value: 'Math.round(OriginalWorkAmountInclueTax*KeepPercent)'
        },
        'Evaluator_ApprovalDate1_CheckValue': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "Stt,ApprovalDate1",
            Command: 'ufn_CheckApprovalDate1',
            MessageText: 'Ngày duyệt thực tế không được nhỏ hơn ngày xuất hóa đơn.',
            IgnoreError: 0,
        },
        'Evaluator_ServerUpdated_B30Claim': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Stt',
            Command: 'usp_SolB30Claim_Calculate',
            // zExpr: 'CompletedApprove == false'
        }
    };

    serverConstraint = [
        
    ];

    serverUpdating = [
        'Evaluator_ServerUpdating_Check_OriginalAmountClaim1',
        // 'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerUpdating_Check_OriginalAmountClaim',
        'Evaluator_ServerConstraint_Check_TotalApproveHistory',
        'Evaluator_ServerUpdating_Check_KLThiCongBCH',
        'Evaluator_ServerUpdating_Check_TamUng',
        'Evaluator_ApprovalDate1_CheckValue'
    ]

    serverUpdated = [
        'Evaluator_ServerUpdated_B30Claim',
        'Evaluator_UpdateInfo_WhenApproveSend'
    ];

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_Approve_GetData',
        'Evaluator_ServerConstraint_BizDocId_GetData',
        'Evaluator_ServerConstraint_GTTH_GetData'
    ];

    buttonCommand: string[] = [

    ];

    importCommand: string[] = [

    ]

    columnChanged = {
        ProcessCode: {
            Evaluators: [
               
            ]
        },
        OriginalWorkAmount: {
            Evaluators: [
                'Evaluator_OriginalWorkAmountInclueTax_Calculator'
            ]
        },
        
        TaxRate: {
            Evaluators: [
                'Evaluator_OriginalWorkAmountInclueTax_Calculator'
            ]
        },
        // AmountTamUng: {
        //     Evaluators: [
        //         'Evaluator_OriginalAdvanceAmount_Calculator'
        //     ] 
        // },
        // AmountContract: {
        //     Evaluators: [
        //         'Evaluator_OriginalAdvanceAmount_Calculator'
        //     ] 
        // },
        // AmountThucHien: {
        //     Evaluators: [
        //         'Evaluator_OriginalAdvanceAmount_Calculator'
        //     ] 
        // },
        OriginalWorkAmountInclueTax: {
            Evaluators: [
                'Evaluator_OriginalKeepAmount_Calculator',
                'Evaluator_OriginalClaimAmount1_Calculator'
            ]
        },
        OriginalKeepAmount: {
            Evaluators: [
                
                'Evaluator_OriginalClaimAmount1_Calculator'
            ]
        },
        CollectedAmount: {
            Evaluators: [
                
                'Evaluator_OriginalClaimAmount1_Calculator'
            ]
        },
        OriginalAdvanceAmount: {
            Evaluators: [
                
                'Evaluator_OriginalClaimAmount1_Calculator'
            ]
        },
        OriginalDeductionAmount: {
            Evaluators: [
                
                'Evaluator_OriginalClaimAmount1_Calculator'
            ]
        },
        UtilityOffsetAmount: {
            Evaluators: [
                
                'Evaluator_OriginalClaimAmount1_Calculator'
            ]
        },
        CustodyValueAmount: {
            Evaluators: [
                
                'Evaluator_OriginalClaimAmount1_Calculator'
            ]
        },
        KeepPercent: {
            Evaluators: [
                'Evaluator_OriginalKeepAmount_Calculator'
            ]
        },
        OriginalClaimAmount: {
            Evaluators: [
                'Evaluator_OriginalClaimAmount_Calculator',
                'Evaluator_OriginalClaimAmount_Calculator_IsTamUng'
            ]
            
        },
        OriginalClaimAmount1: {
            Evaluators: [
                'Evaluator_OriginalClaimAmount_Calculator'
            ]
            
        },
        // OriginalClaimAmount2: {
        //     Evaluators: [
        //         'Evaluator_OriginalClaimAmount_Calculator'
        //     ]
            
        // }
        
    };

    columnChangedChild = [
        // {
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
                    label: 'Ngày cập nhật',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    col: 6
                }),
                new TextBoxInput({
                    key: 'ClaimNo',
                    label: 'Số claim/ IPC',
                    type: 'text',
                    validators: [Validators.required],
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    col: 6,
                    // isReadOnly: 'true',
                    // style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new DateBoxInput({
                    key: 'MonthQuantityDate',
                    label: 'Khối lượng tháng',
                    type: 'date',
                    format: 'MM/yyyy',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Khối lượng tháng',
                    type: 'text',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    validators: [Validators.required],
                    col: 6,
                    // isReadOnly: 'true',
                    // style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'LoaiClaim',
                    label: 'Loại Claim',
                    lookupKey: 'Class',
                    binding: {
                    },
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='LOAICLAIM'",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu',
                    lookupKey: 'ProductCost',
                    binding: {
                    },
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND RowId = '{VAR=Filter.ProductCostId}'",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'BizDocId',
                    label: 'Hợp đồng',
                    lookupKey: 'BizDoc',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    binding: {
                        NumDayPayment: 'NumDayPayment',
                        NumDayApprove: 'NumDayApprove',
                    },
                    lookupfilter: "(DocCode='C2' OR (DocCode='C3' AND ContractType='HD-12')) AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId='{EXPR=ProductCostId}'",
                    //lookupfilter: "DocCode='C2' AND (BranchCode='{VAR=Branch.Ma_Dvcs}') AND (ProductCostId='{EXPR=ProductCostId}' OR ISNULL('{EXPR=ProductCostId}','')='') AND Post_TheKho=1",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12
                }, this.srv, this.parentData),
        
                new NumberBoxInput({
                    key: 'OriginalWorkAmount',
                    label: 'KL thi công (Chưa VAT)',
                    type: 'number',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'IsTamUng',
                    label: 'Tạm ứng',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'TaxRate',
                    label: 'Thuế suất (%)',
                    type: 'number',
                    format: 'P2',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    min: 0,
                    max: 1,
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'IsQT',
                    label: 'Quyết toán',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'OriginalWorkAmountInclueTax',
                    label: 'KL thi công (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'"
                }),
                new CheckBoxInput({
                    key: 'IsQT0',
                    label: 'Sau quyết toán',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'KeepPercent',
                    label: 'Tỉ lệ % giữ lại',
                    
                    type: 'number',
                    format: 'P2',
                    min: 0,
                    max: 1,
                    col: 6,
                    isDisabled: "'{EXPR=IsTamUng}'=='true' || '{EXPR=ApproveSend}' == 'true'"
                }),
                new CheckBoxInput({
                    key: 'IsTTLai',
                    label: 'Thanh toán lãi',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'OriginalKeepAmount',
                    label: 'Tiền giữ lại',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    type: 'number',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'PaymentDateReal',
                    label: 'Ngày TT tiền giữ lại',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isDisabled: "('{EXPR=IsQT}'==false && '{EXPR=IsQT0}'==false) || '{EXPR=ApproveSend}' == 'true'"
                }),
               
                new NumberBoxInput({
                    key: 'OriginalAdvanceAmount',
                    label: 'Hoàn trả tạm ứng',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    // isDisabled: "'{EXPR=IsTamUng}'=='true' || '{EXPR=ApproveSend}' == 'true'"
                }),
                new DateBoxInput({
                    key: 'CreateDate',
                    label: 'Ngày Claim kế hoạch',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    isDisabled: 'true',
                    col: 6
                }),
              
                new NumberBoxInput({
                    key: 'OriginalDeductionAmount',
                    label: 'Khấu trừ khác (Phạt)',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isDisabled: "'{EXPR=IsTamUng}'=='true' || '{EXPR=ApproveSend}' == 'true'"
                }),
            
                new DateBoxInput({
                    key: 'ApprovalDate',
                    label: 'Ngày duyệt kế hoạch',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    isDisabled: 'true',
                    col: 6,
                }),
                new NumberBoxInput({
                    key: 'CollectedAmount',
                    label: 'Khấu trừ khác (Thanh toán hộ)',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isDisabled: "'{EXPR=IsTamUng}'=='true' || '{EXPR=ApproveSend}' == 'true'"
                }),
                new DateBoxInput({
                    key: 'CreateDate1',
                    label: 'Ngày Claim thực tế',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    
                    // validators: [Validators.required],
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'UtilityOffsetAmount',
                    label: 'Bù trừ tiện ích CĐT cấp',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isDisabled: "'{EXPR=IsTamUng}'=='true' || '{EXPR=ApproveSend}' == 'true'"
                }),
                new NumberBoxInput({
                    key: 'CustodyValueAmount',
                    label: 'Giá trị tạm giữ',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isDisabled: "'{EXPR=IsTamUng}'=='true' || '{EXPR=ApproveSend}' == 'true'"
                }),
                new NumberBoxInput({
                    key: 'OriginalClaimAmount1',
                    label: 'Giá trị thanh toán kỳ này',
                     validators: [Validators.required],
                     isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    //  isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    type: 'number',
                    col: 6,
                    isNewRow: true
                }),
                new DateBoxInput({
                    key: 'PaymentDate',
                    label: 'Ngày TT KHoạch Đ. này',      
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    validators: [Validators.required]
                }),
                
                new NumberBoxInput({
                    key: 'OriginalClaimAmount2',
                    label: 'Giá trị thanh toán kỳ nợ',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    type: 'number',
                    col: 6,
                    isNewRow: true
                }),
                new DateBoxInput({
                    key: 'PaymentDateKyNo',
                    label: 'Ngày TT KHoạch Đ.nợ',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    // validators: [Validators.required],
                    
                    col: 6,
                }),
               
                new NumberBoxInput({
                    key: 'OriginalClaimAmount',
                    label: 'Tổng giá trị thanh toán kỳ này',
                    type: 'number',
                    isDisabled: "'{EXPR=IsTamUng}'!='true'",
                    col: 6,
                    isNewRow: true
                }),
                new DateBoxInput({
                    key: 'ApprovalDate1',
                    label: 'Ngày duyệt thực tế',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    // validators: [Validators.required],
                    isDisabled: 'true',
                    col: 6,
                }),
                new NumberBoxInput({
                    key: 'WarrantyValue',
                    label: 'Giá trị bảo lãnh, bảo hành',
                    type: 'number',
                    col: 6,
                    isDisabled: "'{EXPR=IsQT}'==false && '{EXPR=IsQT0}'==false"
                }),
                
                // new NumberBoxInput({
                //     key: 'AmountThucHien',
                //     label: 'Giá trị thực hiện (K)',
                //     type: 'number',
                //     col: 6,
                //     isNewRow: true,
                //     isDisabled: "'{EXPR=IsTamUng}'=='true'"
                // }),                
                // new NumberBoxInput({
                //     key: 'JKVAT',
                //     label: 'Thuế VAT (K * %)',
                //     type: 'number',
                //     col: 6,
                //     isNewRow: true,
                //     isDisabled: 'true'
                // }), 
                // new NumberBoxInput({
                //     key: 'AmountThucHienVAT',
                //     label: 'Giá trị thực hiện (gồm VAT)',
                //     type: 'number',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
               
                new CheckBoxInput({
                    key: 'IsBaoLanh',
                    label: 'Bảo lãnh bảo hành',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'KLThiCongBCH',
                    label: 'KL đã TC lũy kế (gồm KL chưa trình/chưa duyệt) - trước VAT',
                    type: 'number',
                    labelCol: 6,
                     style: 'background-color:#ffffaa;border-radius:8px;',
                    validators: [Validators.required],
                    col: 6
                }),
                new DateBoxInput({
                    key: 'EndWarranty',
                    label: 'Ngày hết bảo hành',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    isNewRow: true,
                    col: 6,
                    isDisabled: "'{EXPR=IsQT}'==false && '{EXPR=IsQT0}'==false"
                }),
                new NumberBoxInput({
                    key: 'NumDayApprove',
                    label: 'Số ngày duyệt theo HĐ',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    isNewRow: true
                }),
                new NumberBoxInput({
                    key: 'NumDayPayment',
                    label: 'Số ngày thanh toán theo HĐ',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6,
                   
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
               
              
                new TextBoxInput({
                    key: 'RemarkBCH',
                    label: 'Ghi chú ngày dự kiến hoàn thành duyệt Claim',
                    type: 'text',
                    labelCol: 6,
                    // isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    col: 12
                }),
                new TextBoxInput({
                    key: 'Remark',
                    labelCol: 6,
                    label: 'Ghi chú ngày dự kiến thanh toán cho kế toán',
                    type: 'text',
                    // isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    col: 12
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND DocStatus=4 AND Ma_Ct='CL'",
                    validators: [Validators.required],
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    hideValueMember: false,
                    // isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    col: 12
                }, this.srv, this.parentData),
                new UploadInput({
                    key: 'FilePath',
                    label: 'Đính kèm Claim đã duyệt',
                    col: 6,
                    
                }, this.srv),
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
            header: 'Nội dung',
            binding: 'ClassCode1',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='CLAIM'",
            width: 150,
        },
        
        {
            header: 'Giá trị kỳ này (Chưa VAT)',
            binding: 'OriginalAmount',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: 'Ghi chú',
            binding: 'Description',
            width: 300
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
            // lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId}' AND PositionCode = '{EXPR=PositionCode}')",
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
            // validators: "{EXPR=EmployeeCode} != '' && {EXPR=EmployeeCode}.toString().indexOf(',') > 0 && {EXPR=EmployeeCodeReal} == ''",
            // validatorMessage: 'Không được bỏ trống giá trị',
            // ignoreError: 1
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
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 250
        },
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
            header: 'STT',
            binding: 'BuiltinOrder',
            dataType: 'Number',
            width: 50,
            align: 'center'
        },
        {
            header: 'Ghi chú',
            binding: 'Description',
            width: 250
        },
        {
            header: 'Số ngày theo HĐ',
            binding: 'DueDate',
            dataType: 'Number',
            width: 100
        },
        {
            header: 'Ngày (Kế hoạch)',
            binding: 'PlanDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            width: 150
        },
        {
            header: 'Ngày thực tế',
            binding: 'ActualDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            width: 150
        }
    ];
}