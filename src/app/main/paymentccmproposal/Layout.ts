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
export class LayoutPaymentCcmProposalExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30CCMBudget_Explore',
                FilterKey: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'K9' AND IsActive=1",// AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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

export class LayoutPaymentCcmProposalEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    // Khai báo view lấy dữ liệu <Tables> B7
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30CCMBudget_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'K9',
                    DocStatus: '1',
                    CCMBudgetId: '',
                    CurrencyCode: 'VND',
                    Id: -1,
                    IsWebData: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    ProductCostId: '{VAR=Filter.ProductCostId}',
                }
            },
            Child: [
                {
                    Name: 'vB30CCMBudgetDetail_Edit',
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
        // 'Evaluator_CCMBudgetDetail_Amount': {
        //     EvaluatorName: 'EvaluatorCaculate',
        //     DataMember: 'Amount',
        //     Value: 'OriginalAmount',
        //     Tables: 0
        // },        
        'Evaluator_CCMBudgetDetail_Set_ApproveSend': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'ApproveSend',
            Value: 'ApproveSend',
            Tables: 0
        },
        'Evaluator_TotalOriginalAmount_SetValue': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: 'TotalOriginalAmountC',
            Value: 'OriginalAmount',
            Tables: 0
        },
        'Evaluator_TotalPaymentAmount_SetValue': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: 'TotalPaymentAmountC',
            Value: 'PaymentAmount',
            Tables: 0
        },
        'Evaluator_ThuChiKyTruoc_Calculate': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ProductCostId,DocDate',
            Command: 'usp_Kqt_ThuChiTheoCongTrinh_GetDeXuat',
            DataMember: "ThuChiKyTruoc",
            zExpr: "ProductCostId != ''"
            // Value: "CurrencyCode == 'VND' ? Math.round(Amount_THDenKyNay*Percent_Th) : (Amount_THDenKyNay*Percent_Th)"
        },
        'Evaluator_Amount_Limit_Calculate': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ProductCostId,DocDate',
            Command: 'usp_Kqt_ThuChiLuyKeKeHoach',
            DataMember: "AmountLimit",
            zExpr: "ProductCostId != ''"
            // Value: "CurrencyCode == 'VND' ? Math.round(Amount_THDenKyNay*Percent_Th) : (Amount_THDenKyNay*Percent_Th)"
        },
        'Evaluator_Load_ProcessCode': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'AmountLimit,ThuChiKyTruoc,ProductCostId',
            Command: 'usp_Newtecons_Load_Approve_K9',
            DataMember: "ProcessCode",
            zExpr: "ProductCostId != ''"
            // Value: "CurrencyCode == 'VND' ? Math.round(Amount_THDenKyNay*Percent_Th) : (Amount_THDenKyNay*Percent_Th)"
        },
        // server constraint
        'Evaluator_ServerConstraint_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,DocCode,DocDate',
            Command: 'ufn_B30CCMBudget_DefaultDocNo',
            zExpr: "ProductCostId != '' AND Id<0",
            DataMember: 'DocNo'
        },
            
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,CustomerCode,CategoryCode,DocCode,Id,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_CheckVer0_ChuaDuyetXong',
            MessageText: 'Không thể lập mới khi chưa hoàn thiện duyệt phiên bản trước',
            IgnoreError: 0,
            zExpr: 'Id < 0'
        },
        'Evaluator_ServerConstraint_Check_Ver0_KhongSua_KhiDaDuyet': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'CCMBudgetId,DocNo2,CompletedApprove',
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
        'Evaluator_ServerConstraint_Check_ImportedExcel': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Id,DocCode,ProductCostId,{VAR=ParentBizDocId},CustomerCode,{VAR=Branch.Ma_Dvcs},{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_CheckImported',
            DataMember: 'CountImport',
            zExpr: "ProductCostId != ''"
        },
        'Evaluator_ServerConstraint_Check_OriginalAmount': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'CCMBudgetId',
            Command: 'ufn_CheckDeSuatThanhToan',
            MessageText: 'Tồn tại Bill chưa thanh toán hết !!! Phải đề xuất thanh toán hết bill trước có cùng hợp đồng',
            zExpr: 'ApproveSend == true',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_Amount_DoanhThu': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'CCMBudgetId',
            Command: 'ufn_CheckGiaTriDeXuatCuaBCH',
            MessageText: 'Giá trị BCH đề xuất > giá trị được cho phép !!!',
            zExpr: 'ApproveSend == true',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,{VAR=EmptyField_ParentBizDocId}',
            Command: 'usp_B30BizDocApprove_GetData',
            OutputTable: 1
        },
        'Evaluator_ServerConstraint_K6_LoadPrevious': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProductCostId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Vct_BangTongHopDeNghiThanhToanBill_TheoHanThanhToan_Getdata',
            zExpr: "ProductCostId != ''",
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_CCMBudgetDetail2_LoadPrevious': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,CustomerCode,DocCode,CCMBudgetId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Ctc_CCMBudgetDetail2_LoadPrevious',
            zExpr: "ProductCostId != '' && CustomerCode != ''",
            OutputTable: 3
        },
        // không đổi tên 
        'Evaluator_ServerConstraint_LoadDataImport': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,{VAR=Branch.Ma_Dvcs},{VAR=User.UserName}',
            Command: 'usp_Coteccons_CCMBudgetDetail_ImportForWeb',
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_DeleteDataImport': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ProductCostId,{VAR=Branch.Ma_Dvcs},{VAR=User.UserName}',
            Command: 'usp_Coteccons_CCMBudgetDetail_DeleteForWeb'
        },
        'Evaluator_UpdateApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CCMBudgetId',
            Command: 'usp_Coteccons_B30CCMBudget_SetApproveSend'
        },
        // server updated
        'Evaluator_ServerUpdated_CreateFormula': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CCMBudgetId',
            Command: 'usp_Coteccons_CreateFormula_CCMBudgetDetail'
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
            Command: 'usp_Coteccons_CCMBudgetDetail_UpdateFromParentWEB',
            zExpr: 'ApproveSend == false'
        }
    };

    serverConstraint = [
        'Evaluator_ServerConstraint_DefaultDocNo'
    ];

    serverUpdating = [
        'Evaluator_ServerConstraint_Check_OriginalAmount',
        'Evaluator_ServerConstraint_Check_Amount_DoanhThu',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        // 'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep'
    ]

    serverUpdated = [
        
        // 'Evaluator_ServerUpdated_BuiltinOrder',
        'Evaluator_UpdateInfo_WhenApproveSend',
        // 'Evaluator_ServerUpdated_CreateFormula',
         'Evaluator_ServerUpdated_CCMBudgetDetail_UpdateFromParent'
    ];

    buttonLoadChild: string[] = [
        'Evaluator_ThuChiKyTruoc_Calculate',
        'Evaluator_Amount_Limit_Calculate',
        'Evaluator_Load_ProcessCode',
        'Evaluator_ServerConstraint_K6_LoadPrevious',
        'Evaluator_ServerConstraint_Approve_GetData'
    ];

    buttonCommand: string[] = [

    ];

    importCommand: string[] = [

    ]

    columnChanged = {
        ProductCostId: {
            Evaluators: [
                'Evaluator_Amount_Limit_Calculate',
                'Evaluator_ThuChiKyTruoc_Calculate',
            ]
        },
        ProcessCode: {
            Evaluators: [
                
                'Evaluator_ServerConstraint_Approve_GetData'
            ]
        }
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
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND RowId = '{VAR=Filter.ProductCostId}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive=1 AND Ma_Ct='{EXPR=DocCode}'",
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'TotalAmountBill',
                    label: 'Tổng Bill',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'Amount_DoanhThu',
                    label: 'Tổng tiền BCH đề xuất',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'Amount_ChiPhi',
                    label: 'Tổng tiền kế toán duyệt',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'AmountLimit',
                    label: 'Thu chi lũy kế kế hoạch',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                   
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'TongDinhMuc',
                    label: 'Đinh mức thanh toán tuần',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    isNewRow: true,
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'ThuChiKyTruoc',
                    label: 'Thu chi thực tế kỳ trước',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                   
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'ThuChiKyNayBCH',
                    label: 'Thu chi kỳ này theo BCH',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                   
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'ThuChiKyNayKT',
                    label: 'Thu chi kỳ này theo Kế toán',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                   
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'Amount_ChiPhiQL',
                    label: 'Tổng tiền GĐĐH duyệt',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                // new ButtonInput({
                //     key: 'btnBaoCao',
                //     label: 'Báo cáo điều chỉnh kế hoạch ký kết',
                //     col: 6
                // }),  
                new UploadInput({
                    key: 'FilePath',
                    label: 'Đính kèm',
                    col: 6
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
            header: 'Mã dự án',
            binding: 'ProductName0',
            width: 100
        },
        {
            header: 'Mã đối tượng',
            binding: 'CustomerCode',
            dataType: 'Array',
            lookupKey: 'Customer_CCM2',
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
        },
        {
            header: 'Thông tin hợp đồng',
            binding: 'DocInfo',
            width: 200,
            isReadOnly: 'true'
        },
       
        {
            header: 'Bill thanh toán',
            binding: 'BillNoInfo',
            width: 200,
            isReadOnly: 'true'
        },
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
            header: 'Không ưu tiên',
            binding: 'IsGiftItem',
            dataType: 'Boolean',
            width: 90
        }, 
        {
            header: 'Ngày đến hạn thanh toán',
            binding: 'EstimatedTimeDelivery',
            isRequired: true,
            width: 120,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Số ngày quá hạn',
            binding: 'NumberOfDay',
            dataType: 'Number',
            width: 90,
            isReadOnly: 'true'
        },
        {
            header: 'Số tiền bill',
            binding: 'AmountBill',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Số tiền chưa thanh toán',
            binding: 'OpenPlanAmount',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Số tiền đề xuất',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 150
        },
        {
            header: 'BCH',
            binding: 'CheckBCH',
            dataType: 'Boolean',
            width: 50
        }, 
        {
            header: 'Số hóa đơn',
            binding: 'ItemNo',
            width: 150
        },
        {
            header: 'Hình thức thanh toán',
            binding: 'PaymentsType',
            width: 150,
            dataType: 'Array',
            lookupKey: 'Class',
            bindingList: {
            },
            // displayMember: 'DocInfo',
            lookupfilter: "ParentCode='PAYMENTTYPE' AND Code IN ('VAY','LCUPAS')"
            // lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        }, 
        // {
        //     header: 'Số tiền KT duyệt',
        //     binding: 'PaymentAmount',
        //     dataType: 'Number',
        //     width: 150,
        //     isReadOnly: 'true'
        // },   
       
        {
            header: 'Loại Hợp đồng',
            binding: 'Description',
            
            width: 200
        } ,
        {
            header: 'Ghi chú',
            binding: 'Remark',
            
            width: 200
        } ,
        {
            header: 'WorkFlow đính kèm',
            binding: 'FilePath',
            width: 600,
            dataType: 'Object',
            //validators: "{EXPR=Description} != '' && {EXPR=Description} == 'Yêu cầu đính kèm' && {EXPR=FilePath}==0",
            //exprReadOnly: "{EXPR=Attached} == true && {EXPR=Description} != ''"
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
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50
        }, 
        {
            header: 'Id Bill',
            binding: 'Id_Link',
            width: 0
        }, 
        {
            header: 'Id Bill',
            binding: 'DocCode_Link',
            width: 0
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
       
    ];

    childColumns1 = [
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
        // {
        //     header: 'Được trả hồ sơ',
        //     binding: 'ApproveReturn',
        //     width: 100,
        //     dataType: 'Boolean',
        //     isReadOnly: 'true'
        // },
        // {
        //     header: 'Trả về cấp bậc',
        //     binding: 'PositionCodeReturn',
        //     width: 100,
        //     isReadOnly: 'true'
        // }
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
    ]
}