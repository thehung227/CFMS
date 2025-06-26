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
export class LayoutPlanCashFlowSiteExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30CCMBudget_Explore',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'K6' AND IsActive=1",// AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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
                    FileName: 'WorkFlow KHDT - {EXPR=ProductName} - {EXPR=DocNo}',
                    WordName: 'WorkFlow_KHDT.docx',
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

export class LayoutPlanCashFlowSiteEditor implements IEditorFormulaDeclaration {

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
                    DocCode: 'K6',
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
                {
                    Name: 'vB30CCMBudgetDetail1_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    // Sort: 'BuiltinOrder',
                    DefaultValues: {
                        CCMBudgetId: 'Parent.CCMBudgetId',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        Quantity9: '0'
                    }
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
        'Evaluator_OriginalAmount_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'OriginalAmount',
            Value: 'OriginalAmount1+OriginalAmount2',
            Tables: 4
        },
        'Evaluator_PaymentAmount_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'PaymentAmount',
            Value: 'OriginalAmount4+OriginalAmount5',
            Tables: 4
        },
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
        'Evaluator_AmountLimit_SetValue': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: 'AmountLimit',
            Value: 'Amount_ThiCong',
            Tables: 0
        },
        // server constraint
        'Evaluator_ServerConstraint_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,DocCode,DocDate',
            Command: 'ufn_B30CCMBudget_DefaultDocNo',
            zExpr: "ProductCostId != '' AND Id<0",
            DataMember: 'DocNo'
        },
        // 'Evaluator_ServerConstraint_Create_DocNo2': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: 'ProductCostId,DocCode,{VAR=Branch.Ma_Dvcs}',
        //     Command: 'ufn_Coteccons_TinhSoRev',
        //     zExpr: "ProductCostId != ''",
        //     DataMember: 'DocNo2'
        // },
        // 'Evaluator_ServerConstraint_Check_Create_DocNo2': {
        //     EvaluatorName: 'EvaluatorValidate',
        //     ConstraintKey: 'ProductCostId,DocCode,{VAR=Branch.Ma_Dvcs},CustomerCode',
        //     Command: 'ufn_Coteccons_CheckSoRev',
        //     zExpr: 'Id < 0',
        //     MessageText: 'Không thể tạo kế hoạch kí kết vượt quá 2 phiên bản',
        //     IgnoreError: 0
        // },
        // 'Evaluator_ServerConstraint_Lay_TenCongViec': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: 'JobCode',
        //     Command: 'usp_Coteccons_LayTenCongViec',
        //     zExpr: "JobCode != ''",
        //     DataMember: 'JobName',
        //     Tables: 0
        // },
        // 'Evaluator_ServerConstraint_Check_Add_ThauPhu_NhaCungCap': {
        //     EvaluatorName: 'EvaluatorValidate',
        //     ConstraintKey: 'Loai_Dt,CompletedApproveDetail,ApproveSend',
        //     Command: 'ufn_Coteccons_Check_YeuCauDuyet_TPNCC',
        //     MessageText: 'Yêu cầu trình duyệt lại khi thêm NTP/NCC',
        //     IgnoreError: 0,
        //     Tables: 0
        // },        
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,CustomerCode,CategoryCode,DocCode,Id,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_CheckVer0_ChuaDuyetXong',
            MessageText: 'Không thể lập mới khi chưa hoàn thiện duyệt phiên bản trước',
            IgnoreError: 0,
            zExpr: 'Id < 0'
        },
        'Evaluator_ServerConstraint_Check_DoanhThuKeToan': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'CCMBudgetId,DocCode,ProductCostId,DocDate',
            Command: 'ufn_CheckDoanhThu',
            MessageText: 'Doanh thu kế hoạch không khớp với doanh thu kế toán đã hạch toán !!!!',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerConstraint_Check_TongThu': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'CCMBudgetId',
            Command: 'ufn_CheckTongThu',
            MessageText: 'Tổng Thu không được phải nằm trong khoảng Tổng doanh thu * 1.08 đến Tổng doanh thu * 1.1 !!!!',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerConstraint_Check_KhoiLuong': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'CCMBudgetId,ToDate',
            Command: 'ufn_CheckKhoiLuong',
            MessageText: 'Ngày hoàn thành thi công không đúng với tháng phát sinh KL thi công cuối cùng !!!!',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
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
        'Evaluator_ServerConstraint_Check_CheckPaymentAmountK1': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,CustomerCode,{VAR=Branch.Ma_Dvcs},ProcessCode,TotalPaymentAmountC',
            Command: 'ufn_Coteccons_CCMBudget_CheckPayAmountK1',
            MessageText: 'Tổng dự trù thanh toán đã thay đổi, yêu cầu chọn Quy trình duyệt phù hợp',
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
            ConstraintKey: 'DocDate,ProductCostId,{VAR=Branch.Ma_Dvcs},Id',
            Command: 'usp_SOL_BcDongTienDuAn_LoadData',
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
        'Evaluator_ServerConstraint_CCMBudgetDetail1_LoadPrevious': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,CCMBudgetId',
            Command: 'usp_PlanCashFlowSite_LoadData',
            // zExpr: "ProductCostId != '' && CustomerCode != ''",
            OutputTable: 4
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
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend_SongSong',
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerUpdated_CCMBudgetDetail_UpdateFromParent': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CCMBudgetId',
            Command: 'usp_Coteccons_CCMBudgetDetail_UpdateFromParentWEB'
        }
    };

    serverConstraint = [
        'Evaluator_ServerConstraint_DefaultDocNo'
    ];

    serverUpdating = [
        'Evaluator_ServerConstraint_Check_DoanhThuKeToan',
        'Evaluator_ServerConstraint_Check_TongThu',
        'Evaluator_ServerConstraint_Check_KhoiLuong',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        // 'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep'
    ]

    serverUpdated = [
        'Evaluator_ServerUpdated_BuiltinOrder',
        'Evaluator_UpdateInfo_WhenApproveSend',
        // 'Evaluator_ServerUpdated_CreateFormula',
         'Evaluator_ServerUpdated_CCMBudgetDetail_UpdateFromParent'
    ];

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_K6_LoadPrevious',
        'Evaluator_ServerConstraint_Approve_GetData'
    ];

    buttonLoadChild2: string[] = [
        'Evaluator_ServerConstraint_CCMBudgetDetail1_LoadPrevious'
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
        }
    };

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
                Amount_ThiCong: {
                    Evaluators: [
                        //'Evaluator_CCMBudgetDetail_Amount',
                        'Evaluator_AmountLimit_SetValue'
                    ]
                }
            }
        },
        {
            Tables: 4,
            columnChanged: {
                OriginalAmount1: {
                    Evaluators: [
                        //'Evaluator_CCMBudgetDetail_Amount',
                        'Evaluator_OriginalAmount_Calculate'
                    ]
                },
                OriginalAmount2: {
                    Evaluators: [
                        //'Evaluator_CCMBudgetDetail_Amount',
                        'Evaluator_OriginalAmount_Calculate'
                    ]
                },
                OriginalAmount4: {
                    Evaluators: [
                        //'Evaluator_CCMBudgetDetail_Amount',
                        'Evaluator_PaymentAmount_Calculate'
                    ]
                },
                OriginalAmount5: {
                    Evaluators: [
                        //'Evaluator_CCMBudgetDetail_Amount',
                        'Evaluator_PaymentAmount_Calculate'
                    ]
                }

            }
        }
       
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
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND RowId = '{VAR=Filter.ProductCostId}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive=1 AND ParentId=283",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'TotalAmountBill',
                    label: 'Tổng DOANH THU',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'Amount_DoanhThu',
                    label: 'Tổng THU',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'Amount_ChiPhi',
                    label: 'Tổng CHI',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'AmountLimit',
                    label: 'Tổng KLTC',
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
                new DateBoxInput({
                    key: 'ToDate',
                    label: 'Ngày h.thành thi công cập nhật',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Ghi chú',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12
                }),
                new RichTextBoxInput({
                    key: 'Reason',
                    label: 'Nguyên nhân âm thu chi sâu',
                    
              
                    col: 12
                }),
                new RichTextBoxInput({
                    key: 'Remedy',
                    label: 'Biện pháp khắc phục',
                    
                    
                    col: 12
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
                }),
                new CheckBoxInput({
                    key: 'IsGeneralDirector',
                    label: 'Quy trình qua TGĐ',
                    col: 6,
                    isDisabled: 'true',
                    isNewRow: true
                }),
            ]
        })
    ];

    childColumns = [
        {
            header: 'Thời gian',
            binding: 'EstimatedTimeDelivery',
            isRequired: true,
            width: 120,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Khối lượng thi công',
            binding: 'Amount_ThiCong',
            dataType: 'Number',
            width: 200
        },
        {
            header: 'Khối lượng thi công - XD',
            binding: 'Amount_ThiCongXD',
            dataType: 'Number',
            width: 150
        },
        {
            header: 'Khối lượng thi công - ME',
            binding: 'Amount_ThiCongME',
            dataType: 'Number',
            width: 150
        },
        {
            header: 'Kế hoạch DOANH THU',
            binding: 'OpenPlanAmount',
            dataType: 'Number',
            width: 200
        },
        {
            header: 'Kế hoạch DOANH THU - XD',
            binding: 'OpenPlanAmountXD',
            dataType: 'Number',
            width: 200
        },
        {
            header: 'Kế hoạch DOANH THU - ME',
            binding: 'OpenPlanAmountME',
            dataType: 'Number',
            width: 200
        },
        {
            header: 'Kế hoạch THU',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 200
        },
        {
            header: 'Thực tế THU',
            binding: 'OriginalAmountBak',
            dataType: 'Number',
            width: 200,
            exprReadOnly: "{EXPR=IsOld} != '0' || {EXPR=IsOld} != ''"
        },
        {
            header: 'Kế hoạch CHI',
            binding: 'PaymentAmount',
            dataType: 'Number',
            width: 200,
            
        },   
        {
            header: 'Thực tế chi',
            binding: 'PaymentAmountBak',
            dataType: 'Number',
            width: 200,
            exprReadOnly: "{EXPR=IsOld} != '0' || {EXPR=IsOld} != ''"
        },  
        {
            header: 'THU - CHI',
            binding: 'Amount',
            dataType: 'Number',
            width: 200,
            isReadOnly: 'true'
        },
        {
            header: 'Lũy kế THU',
            binding: 'AmountLNKT_KT',
            dataType: 'Number',
            width: 200,
            isReadOnly: 'true'
        }, 
        {
            header: 'Lũy kế CHI',
            binding: 'AmountLNCT_KT',
            dataType: 'Number',
            width: 200,
            isReadOnly: 'true'
        },
        {
            header: 'Lũy kế THU - CHI',
            binding: 'AcumDiscountAmount',
            dataType: 'Number',
            width: 200,
            isReadOnly: 'true'
        },
        {
            header: 'Lũy kế THU kỳ trước',
            binding: 'OriginalAmount1',
            dataType: 'Number',
            width: 200,
            isReadOnly: 'true'
        }, 
        {
            header: 'Lũy kế CHI kỳ trước',
            binding: 'OriginalAmount2',
            dataType: 'Number',
            width: 200,
            isReadOnly: 'true'
        },
        {
            header: 'Lũy kế THU - CHI kỳ trước',
            binding: 'OriginalAmount3',
            dataType: 'Number',
            width: 200,
            isReadOnly: 'true'
        },
          {
            header: 'Ghi chú',
            binding: 'Remark',
            width: 300
        }   ,
        {
            header: 'Kế hoạch THU',
            binding: 'OriginalAmountBak',
            dataType: 'Number',
            width: 0
        },    
        {
            header: 'Kế hoạch CHI',
            binding: 'PaymentAmountBak',
            dataType: 'Number',
            width: 0
        } ,
        {
            header: 'Kế hoạch THU',
            binding: 'OriginalAmount4',
            dataType: 'Number',
            width: 0
        },    
        {
            header: 'Kế hoạch CHI',
            binding: 'OriginalAmount5',
            dataType: 'Number',
            width: 0
        }                                                                               
        // {
        //     header: 'Dòng tiêu đề',
        //     binding: 'IsTitleRow',
        //     dataType: 'Boolean',
        //     width: 0,
        //     isReadOnly: 'true'
        // },
        // {
        //     header: 'Bậc',
        //     binding: 'Level',
        //     dataType: 'Number',
        //     width: 0,
        //     format: 'n0',
        //     isReadOnly: 'true'
        // },
        // {
        //     header: 'Công thức',
        //     binding: 'Formula',
        //     width: 0,
        //     isReadOnly: 'true'
        // }
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
    ];

    childColumns3 = [
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

    childColumns4 = [
        {
            header: 'STT',
            binding: 'BuiltinOrder',
            width: 60,
            isReadOnly: 'true'
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            width: 200
        },
      
        {
            header: 'Tổng Thu',
            binding: 'OriginalAmount',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 200
        },
        {
            header: 'Thu NSC',
            binding: 'OriginalAmount1',
            dataType: 'Number',
            width: 200
        },
        {
            header: 'Thu New',
            binding: 'OriginalAmount2',
            dataType: 'Number',
            width: 200
        },
        {
            header: 'Tổng Chi',
            binding: 'PaymentAmount',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 200
        },   
        {
            header: 'Chi NSC',
            binding: 'OriginalAmount4',
            dataType: 'Number',
            width: 200
        },
        {
            header: 'Chi New',
            binding: 'OriginalAmount5',
            dataType: 'Number',
            width: 200
        },
       
        {
            header: 'Lũy kế chênh lệch',
            binding: 'AcumDiscountAmount',
            dataType: 'Number',
            width: 200,
            isReadOnly: 'true'
        }
     
    ];

}