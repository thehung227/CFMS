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

// Kế hoạch Quản lý khối lượng
export class LayoutPlanQuantity2Explorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30CCMBudget_Explore',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'M6' AND IsActive=1", //AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))
                OrderBy: 'ProductName,DocDate DESC,DocNo DESC',
                RowPage: 50,
                // DefaultValues: {
                //     CurrencyCode: 'VND'
                // }
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
        },
        // CopiedValues: {
        //     parameter: { 'Commandkey': 'plansigncon-editor', 'StageCode': '{EXPR=StageCode}' }
        // }
    }

    parentGrid = [
        // {
        //     header: 'CCMBudgetId',
        //     binding: 'CCMBudgetId',
        //     width: 200
        // },
        // {
        //     header: 'Gói thầu',
        //     binding: 'ProductName',
        //     width: 200
        // },
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
            width: 120,
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
        //     width: 350,
        //     dataType: 'String'
        // },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 180,
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

export class LayoutPlanQuantity2Editor implements IEditorFormulaDeclaration {

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
                    DocCode: 'M6',
                    DocStatus: '4',
                    CCMBudgetId: '',
                    Id: -1,
                    IsWebData: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB30CCMBudgetDetailKL1_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    // Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    },
                    frozenColumns: 4
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
                    ChildKey: 'BizDocId'
                },
                {
                    Name: 'vB30CCMBudgetMapSupp_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BuiltinOrder: '1'
                    }
                },
                {
                    Name: 'vB30CCMBudgetDetailKL2_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    frozenColumns: 4
                },
                {
                    Name: 'vB30CCMBudgetDetailKL3_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    frozenColumns: 4
                },
                {
                    Name: 'vB30CCMBudgetDetailKL4_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    frozenColumns: 4
                },
                {
                    Name: 'vB30CCMBudgetDetailKL5_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    frozenColumns: 4
                }
            ]
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
                //     FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                // }
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
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,DocCode,DocDate',
            Command: 'ufn_B30CCMBudget_DefaultDocNo',
             zExpr: "ProductCostId != '' && DocNo == ''",
            DataMember: 'DocNo'
        },
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,CustomerCode,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_CheckVer0_ChuaDuyetXong',
            MessageText: 'Không thể lập mới khi chưa hoàn thiện duyệt phiên bản trước',
            IgnoreError: 0,
            zExpr: 'Id < 0'
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
            OutputTable: 2
        },
        'Evaluator_ServerConstraint_M3_LoadPreviousKL1': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,DocCode,CCMBudgetId,{VAR=TableNames_B30CCMBudgetDetailKL1}',
            Command: 'usp_B30CCMBudgetDetailKL_LoadPrevious',
            zExpr: "ProductCostId != ''",
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_M3_LoadPreviousKL2': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,DocCode,CCMBudgetId,{VAR=TableNames_B30CCMBudgetDetailKL2}',
            Command: 'usp_B30CCMBudgetDetailKL_LoadPrevious',
            zExpr: "ProductCostId != ''",
            OutputTable: 5
        },
        'Evaluator_ServerConstraint_M3_LoadPreviousKL3': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,DocCode,CCMBudgetId,{VAR=TableNames_B30CCMBudgetDetailKL3}',
            Command: 'usp_B30CCMBudgetDetailKL_LoadPrevious',
            zExpr: "ProductCostId != ''",
            OutputTable: 6
        },
        'Evaluator_ServerConstraint_M3_LoadPreviousKL4': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,DocCode,CCMBudgetId,{VAR=TableNames_B30CCMBudgetDetailKL4}',
            Command: 'usp_B30CCMBudgetDetailKL_LoadPrevious',
            zExpr: "ProductCostId != ''",
            OutputTable: 7
        },
        'Evaluator_ServerConstraint_M3_LoadPreviousKL5': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,DocCode,CCMBudgetId,{VAR=TableNames_B30CCMBudgetDetailKL5}',
            Command: 'usp_B30CCMBudgetDetailKL_LoadPrevious',
            zExpr: "ProductCostId != ''",
            OutputTable: 8
        },
        'Evaluator_ServerConstraint_MapSupp_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,DocCode,CCMBudgetId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_B30CCMBudgetMapSupp_GetData',
            zExpr: "ProductCostId != ''",
            OutputTable: 4
        },
        // BuiltinOrder
        'Evaluator_B30CCMBudgetDetailKL1_BuiltinOrder': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=TableNames_B30CCMBudgetDetailKL1},{VAR=Keys_B30CCMBudgetDetail},{VAR=FieldOrders_B30CCMBudgetDetail},CCMBudgetId',
            Command: 'usp_Coteccons_Web_SetBuiltionOrder'
        },
        'Evaluator_B30CCMBudgetDetailKL2_BuiltinOrder': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=TableNames_B30CCMBudgetDetailKL2},{VAR=Keys_B30CCMBudgetDetail},{VAR=FieldOrders_B30CCMBudgetDetail},CCMBudgetId',
            Command: 'usp_Coteccons_Web_SetBuiltionOrder'
        },
        'Evaluator_B30CCMBudgetDetailKL3_BuiltinOrder': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=TableNames_B30CCMBudgetDetailKL3},{VAR=Keys_B30CCMBudgetDetail},{VAR=FieldOrders_B30CCMBudgetDetail},CCMBudgetId',
            Command: 'usp_Coteccons_Web_SetBuiltionOrder'
        },
        'Evaluator_B30CCMBudgetDetailKL4_BuiltinOrder': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=TableNames_B30CCMBudgetDetailKL4},{VAR=Keys_B30CCMBudgetDetail},{VAR=FieldOrders_B30CCMBudgetDetail},CCMBudgetId',
            Command: 'usp_Coteccons_Web_SetBuiltionOrder'
        },
        'Evaluator_B30CCMBudgetDetailKL5_BuiltinOrder': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=TableNames_B30CCMBudgetDetailKL5},{VAR=Keys_B30CCMBudgetDetail},{VAR=FieldOrders_B30CCMBudgetDetail},CCMBudgetId',
            Command: 'usp_Coteccons_Web_SetBuiltionOrder'
        },
        // CreateFormula
        'Evaluator_ServerUpdated_CreateFormula_KL1': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CCMBudgetId,{VAR=TableNames_B30CCMBudgetDetailKL1}',
            Command: 'usp_SOL_CreateFormula_CCMBudgetDetailKL'
        },
        'Evaluator_ServerUpdated_CreateFormula_KL2': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CCMBudgetId,{VAR=TableNames_B30CCMBudgetDetailKL2}',
            Command: 'usp_SOL_CreateFormula_CCMBudgetDetailKL'
        },
        'Evaluator_ServerUpdated_CreateFormula_KL3': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CCMBudgetId,{VAR=TableNames_B30CCMBudgetDetailKL3}',
            Command: 'usp_SOL_CreateFormula_CCMBudgetDetailKL'
        },
        'Evaluator_ServerUpdated_CreateFormula_KL4': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CCMBudgetId,{VAR=TableNames_B30CCMBudgetDetailKL4}',
            Command: 'usp_SOL_CreateFormula_CCMBudgetDetailKL'
        },
        'Evaluator_ServerUpdated_CreateFormula_KL5': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CCMBudgetId,{VAR=TableNames_B30CCMBudgetDetailKL5}',
            Command: 'usp_SOL_CreateFormula_CCMBudgetDetailKL'
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},{VAR=EmptyField_BizDocId},CCMBudgetId,{VAR=Branch.Ma_Dvcs},ProductCostId,DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true'
        },
         'Evaluator_ServerUpdated_CCMBudgetDetail_UpdateFromParent': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CCMBudgetId,DocCode',
            Command: 'usp_Coteccons_CCMBudgetDetail_UpdateFromParentWEB_Khoiluong'
        },
        'Evaluator_ServerConstraint_LoadAttact': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId',
            Command: 'usp_PlanQuantity_LoadAttact',
            OutputTable: 1
        },
    };

    serverConstraint = [
        'Evaluator_ServerConstraint_DefaultDocNo',
    ];

    serverUpdating = [
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep'
    ]

    serverUpdated = [
        'Evaluator_B30CCMBudgetDetailKL1_BuiltinOrder',
        'Evaluator_B30CCMBudgetDetailKL2_BuiltinOrder',
        'Evaluator_B30CCMBudgetDetailKL3_BuiltinOrder',
        'Evaluator_B30CCMBudgetDetailKL4_BuiltinOrder',
        'Evaluator_B30CCMBudgetDetailKL5_BuiltinOrder',
        'Evaluator_ServerUpdated_CreateFormula_KL1',
        'Evaluator_ServerUpdated_CreateFormula_KL2',
        'Evaluator_ServerUpdated_CreateFormula_KL3',
        'Evaluator_ServerUpdated_CreateFormula_KL4',
        'Evaluator_ServerUpdated_CreateFormula_KL5',
        'Evaluator_ServerUpdated_CCMBudgetDetail_UpdateFromParent',
        'Evaluator_UpdateInfo_WhenApproveSend'
    ];

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep',
        //getdataforchild
        'Evaluator_ServerConstraint_Approve_GetData',
        'Evaluator_ServerConstraint_MapSupp_GetData',
        'Evaluator_ServerConstraint_LoadAttact',
        'Evaluator_ServerConstraint_M3_LoadPreviousKL1',
        'Evaluator_ServerConstraint_M3_LoadPreviousKL2',
        'Evaluator_ServerConstraint_M3_LoadPreviousKL3',
        'Evaluator_ServerConstraint_M3_LoadPreviousKL4',
        'Evaluator_ServerConstraint_M3_LoadPreviousKL5'
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
                    label: 'Ngày lập',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số hồ sơ',
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
                    // binding: {
                    //     InvestorCode: 'CustomerCode'
                    // },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND RowId = '{VAR=Filter.ProductCostId}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12,
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    type: 'text',
                    // validators: [Validators.required],
                    col: 12
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND (Ma_Ct='{EXPR=DocCode}' OR Ma_Ct = 'K8')",
                    // lookupfilter: "ProcessCode IN (SELECT Code FROM dbo.ufn_Coteccons_Filter_ProcessCodeKHKKProduct('{EXPR=ProductCostId}','{VAR=Branch.Ma_Dvcs}'))",
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
                //     label: 'Đính kèm',
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
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 100
        },
        {
            header: 'Hạng mục',
            binding: 'ActivityCode',
            width: 200,
            validators: "{EXPR=ActivityCode} == ''",
            validatorMessage: 'Mã hạng mục, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Mã khối lượng',
            binding: 'JobCode',
            dataType: 'Array',
            lookupKey: 'DmQLKL', //từ: vB20DmQLKL
            // bindingList: {
            //     Name: 'JobName'
            // },
            // multiSelection: true,
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 100,
            validators: "{EXPR=JobCode} == ''",
            validatorMessage: 'Mã khối lượng, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên công tác',
            binding: 'JobName',
            isRequired: true,
            width: 250
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 100
        },
        {
            header: 'KH Khối lượng (CĐT)',
            binding: 'QtyCDT',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'KH Khối lượng (BCH Tính)',
            binding: 'QtyBCH',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'NTP 01',
            binding: 'Qty01',
            width: 110,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 02',
            binding: 'Qty02',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 03',
            binding: 'Qty03',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 04',
            binding: 'Qty04',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 05',
            binding: 'Qty05',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 06',
            binding: 'Qty06',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 07',
            binding: 'Qty07',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 08',
            binding: 'Qty08',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 09',
            binding: 'Qty09',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 10',
            binding: 'Qty10',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50,
            isReadOnly: 'true'
        },
        // {
        //     header: 'Bậc',
        //     binding: 'Level',
        //     dataType: 'Number',
        //     width: 50,
        //     format: 'n0',
        //     isReadOnly: 'true'
        // },
        // {
        //     header: 'Công thức',
        //     binding: 'Formula',
        //     width: 250,
        //     isReadOnly: 'true'
        // }
    ];

    childColumns1 = [
        {
            header: 'Tên tài liệu',
            binding: 'Description',
            width: 250
        },
             {
            header: 'Yêu cầu đính kèm',
            binding: 'Attached',
            dataType: 'Boolean',
            width: 60,
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
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM dbo.ufn_B30BizDocApprove_GetEmployee('{EXPR=ProductCostId}','{EXPR=ProductCostId}','{EXPR=PositionCode}'))",
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
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM dbo.ufn_B30BizDocApprove_GetEmployee('{EXPR=ProductCostId}','{EXPR=ProductCostId}','{EXPR=PositionCode}'))",
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
            width: 120,
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
    ];

    childColumns4 = [
        {
            header: 'Code NTP',
            binding: 'Title',
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: 'Mã đối tượng',
            binding: 'CustomerCode',
            width: 150,
            dataType: 'Array',
            lookupKey: 'Customer',
            lookupfilter: "IsGroup=0 AND IsActive=1",
            bindingList: {
                Name: "CustomerName"
            },
            validators: "{EXPR=CustomerCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên đối tượng',
            binding: 'CustomerName',
            width: 400,
            isReadOnly: 'true'
        },
        {
            header: 'Id hợp đồng',
            binding: 'BizDocId_C1',
            width: 150,
            dataType: 'Array',
            lookupKey: 'BizDoc_CTC',
            bindingList: {
                DocInfo: 'DocInfo'
            },
            lookupfilter: "BizDocId IN (SELECT BizDocId FROM dbo.ufn_SOL_FilterContactOnCostReve('{EXPR=ProductCostId}','{EXPR=CustomerCode}'))"
        },
        {
            header: 'Nội dung hợp đồng',
            binding: 'DocInfo',
            width: 600,
            isReadOnly: 'true'
        },
    ];

    childColumns5 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 100
        },
        {
            header: 'Hạng mục',
            binding: 'ActivityCode',
            width: 150,
            validators: "{EXPR=ActivityCode} == ''",
            validatorMessage: 'Mã hạng mục, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Mã khối lượng',
            binding: 'JobCode',
            dataType: 'Array',
            lookupKey: 'DmQLKL',
            // bindingList: {
            //     Name: 'JobName'
            // },
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 150,
            validators: "{EXPR=JobCode} == ''",
            validatorMessage: 'Mã khối lượng, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên công tác',
            binding: 'JobName',
            isRequired: true,
            width: 250
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 100
        },
        {
            header: 'KH Khối lượng (CĐT)',
            binding: 'QtyCDT',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'KH Khối lượng (BCH Tính)',
            binding: 'QtyBCH',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'NTP 11',
            binding: 'Qty01',
            width: 110,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 12',
            binding: 'Qty02',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 13',
            binding: 'Qty03',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 14',
            binding: 'Qty04',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 15',
            binding: 'Qty05',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 16',
            binding: 'Qty06',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 17',
            binding: 'Qty07',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 18',
            binding: 'Qty08',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 19',
            binding: 'Qty09',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 20',
            binding: 'Qty10',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50,
            isReadOnly: 'true'
        },
    ];

    childColumns6 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 100
        },
        {
            header: 'Hạng mục',
            binding: 'ActivityCode',
            width: 150,
            validators: "{EXPR=ActivityCode} == ''",
            validatorMessage: 'Mã hạng mục, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Mã khối lượng',
            binding: 'JobCode',
            dataType: 'Array',
            lookupKey: 'DmQLKL',
            // bindingList: {
            //     Name: 'JobName'
            // },
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 150,
            validators: "{EXPR=JobCode} == ''",
            validatorMessage: 'Mã khối lượng, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên công tác',
            binding: 'JobName',
            isRequired: true,
            width: 250
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 100
        },
        {
            header: 'KH Khối lượng (CĐT)',
            binding: 'QtyCDT',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'KH Khối lượng (BCH Tính)',
            binding: 'QtyBCH',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'NTP 21',
            binding: 'Qty01',
            width: 110,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 22',
            binding: 'Qty02',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 23',
            binding: 'Qty03',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 24',
            binding: 'Qty04',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 25',
            binding: 'Qty05',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 26',
            binding: 'Qty06',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 27',
            binding: 'Qty07',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 28',
            binding: 'Qty08',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 29',
            binding: 'Qty09',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 30',
            binding: 'Qty10',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50,
            isReadOnly: 'true'
        },
    ];

    childColumns7 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 100
        },
        {
            header: 'Hạng mục',
            binding: 'ActivityCode',
            width: 150,
            validators: "{EXPR=ActivityCode} == ''",
            validatorMessage: 'Mã hạng mục, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Mã khối lượng',
            binding: 'JobCode',
            dataType: 'Array',
            lookupKey: 'DmQLKL',
            // bindingList: {
            //     Name: 'JobName'
            // },
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 150,
            validators: "{EXPR=JobCode} == ''",
            validatorMessage: 'Mã khối lượng, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên công tác',
            binding: 'JobName',
            isRequired: true,
            width: 250
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 100
        },
        {
            header: 'KH Khối lượng (CĐT)',
            binding: 'QtyCDT',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'KH Khối lượng (BCH Tính)',
            binding: 'QtyBCH',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'NTP 31',
            binding: 'Qty01',
            width: 110,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 32',
            binding: 'Qty02',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 33',
            binding: 'Qty03',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 34',
            binding: 'Qty04',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 35',
            binding: 'Qty05',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 36',
            binding: 'Qty06',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 37',
            binding: 'Qty07',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 38',
            binding: 'Qty08',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 39',
            binding: 'Qty09',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 40',
            binding: 'Qty10',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50,
            isReadOnly: 'true'
        },
    ];

    childColumns8 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 100
        },
        {
            header: 'Hạng mục',
            binding: 'ActivityCode',
            width: 150,
            validators: "{EXPR=ActivityCode} == ''",
            validatorMessage: 'Mã hạng mục, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Mã khối lượng',
            binding: 'JobCode',
            dataType: 'Array',
            lookupKey: 'DmQLKL',
            // bindingList: {
            //     Name: 'JobName'
            // },
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 150,
            validators: "{EXPR=JobCode} == ''",
            validatorMessage: 'Mã khối lượng, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên công tác',
            binding: 'JobName',
            isRequired: true,
            width: 250
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 100
        },
        {
            header: 'KH Khối lượng (CĐT)',
            binding: 'QtyCDT',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'KH Khối lượng (BCH Tính)',
            binding: 'QtyBCH',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'NTP 41',
            binding: 'Qty01',
            width: 110,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 42',
            binding: 'Qty02',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 43',
            binding: 'Qty03',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 44',
            binding: 'Qty04',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 45',
            binding: 'Qty05',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 46',
            binding: 'Qty06',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 47',
            binding: 'Qty07',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 48',
            binding: 'Qty08',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 49',
            binding: 'Qty09',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 50',
            binding: 'Qty10',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50,
            isReadOnly: 'true'
        },
    ];
}