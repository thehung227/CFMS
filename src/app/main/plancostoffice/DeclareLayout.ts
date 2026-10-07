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

/**
 * Luồng duyệt có Giám đốc điều hành (GĐĐH) cho Dự toán chi phí văn phòng.
 * ĐIỀN mã quy trình (B20Approve.ProcessCode, thuộc nhóm G-005) vào mảng này, ví dụ: ['P-2xx'].
 *
 * Khi gửi duyệt:
 *  - Tổng chi phí đã thực hiện > Tổng dự trù kỳ trước -> BẮT BUỘC chọn 1 luồng trong danh sách này.
 *  - Chưa vượt                                      -> KHÔNG được chọn luồng trong danh sách này.
 */
export const PLANCOSTOFFICE_PROCESS_GDDH: string[] = [];

/**
 * Cột lưu trữ trên B30CCMBudgetDetail của lưới chi tiết (dùng chung editor + màn hình duyệt).
 * Không dùng OriginalAmount2/3/4: store UpdateFromParentWEB cộng dồn chúng vào OriginalAmount của K2.
 */
export const PlanCostOfficeFields = {
    ExpenseCatg: 'ExpenseCatgCode',   // Mã chi phí
    PrevAmount: 'OpenPlanAmount',     // Dự trù version trước
    SpentAmount: 'PaymentAmount',     // Chi phí đã thực hiện (trực tiếp, không phân bổ)
    CurAmount: 'OriginalAmount1',     // Dự trù kỳ này
    OriginalCost: 'CostAmount',       // Nguyên giá
    Reason: 'Remark'                  // Lý do
};

/** Cột lưu trữ trên B30CCMBudget của phần tổng hợp đầu phiếu. */
export const PlanCostOfficeTotals = {
    PrevTotal: 'ThuChiKyTruoc',       // Tổng dự trù kỳ trước
    CurTotal: 'Amount_ChiPhi',        // Tổng dự trù kỳ này (server tính lại = SUM(OriginalAmount1) khi lưu)
    SpentTotal: 'TotalPaymentAmountC',// Thực hiện tới hiện tại
    SpentRate: 'TiSuat_LN'            // % thực hiện = Thực hiện / Tổng dự trù kỳ này
};

function toNumber(value: any): number {
    let n = Number(value);
    return isNaN(n) ? 0 : n;
}

/** Dòng có chi phí đã thực hiện > dự trù kỳ này. */
export function planCostOfficeIsOverRow(row: any): boolean {
    return !!row && toNumber(row[PlanCostOfficeFields.SpentAmount]) > toNumber(row[PlanCostOfficeFields.CurAmount]);
}

/** Tổng hợp lưới chi tiết (bỏ dòng tiêu đề) - dùng chung editor + màn hình duyệt. */
export function planCostOfficeSummary(rows: any[]) {
    const f = PlanCostOfficeFields;
    let s = { prevTotal: 0, curTotal: 0, spentTotal: 0, rate: 0, rowCount: 0, overRows: [] as string[] };
    for (let r of rows || []) {
        if (!r || r['IsTitleRow'] == true) continue;
        s.rowCount++;
        s.prevTotal += toNumber(r[f.PrevAmount]);
        s.curTotal += toNumber(r[f.CurAmount]);
        s.spentTotal += toNumber(r[f.SpentAmount]);
        if (planCostOfficeIsOverRow(r)) s.overRows.push((r[f.ExpenseCatg] || '').toString().trim());
    }
    s.rate = s.curTotal != 0 ? s.spentTotal / s.curTotal : 0;
    return s;
}

/** Cột lưới chi tiết (6 cột) - màn hình duyệt dùng lại với isReadOnly. */
export function planCostOfficeDetailColumns(readOnly: boolean): any[] {
    const f = PlanCostOfficeFields;
    return [
        {
            header: 'Mã chi phí',
            binding: f.ExpenseCatg,
            dataType: 'Array',
            lookupKey: 'ExpenseCatg',
            bindingList: {
                Name: 'Description'
            },
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            multiSelection: false,
            isReadOnly: readOnly,
            width: 160
        },
        {
            header: 'Dự trù version trước',
            binding: f.PrevAmount,
            dataType: 'Number',
            format: 'n0',
            isReadOnly: true,
            width: 170
        },
        {
            header: 'Chi phí đã thực hiện',
            binding: f.SpentAmount,
            dataType: 'Number',
            format: 'n0',
            isReadOnly: true,
            width: 170
        },
        {
            header: 'Dự trù kỳ này',
            binding: f.CurAmount,
            dataType: 'Number',
            format: 'n0',
            isReadOnly: readOnly,
            width: 170
        },
        {
            header: 'Nguyên giá',
            binding: f.OriginalCost,
            dataType: 'Number',
            format: 'n0',
            isReadOnly: readOnly,
            width: 160
        },
        {
            header: 'Lý do',
            binding: f.Reason,
            isReadOnly: readOnly,
            width: '*'
        }
    ];
}

// Kế hoạch chi phí công trường
export class LayoutPlanCostOfficeExplorer implements IExplorerFormulaDeclaration {

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30CCMBudget_Explore',
                FilterKey: "(ProductType IN ('2','3') AND ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'K2' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'ProductName,DocDate DESC,DocNo DESC',
                RowPage: 50
            },
            Child: {
                Name: 'vB30BizDocApprove_CCMBudgetExplorer',
                ParentKey: 'CCMBudgetId',
                ChildKey: 'BizDocId'
                
            }
        }
        // CopiedValues: {
        //     parameter: { 'Commandkey': 'plancostrevcons-editor', 'ProcessCode': '{EXPR=ProcessCode}'}
        // }
    }

    parentGrid = [
        {
            header: 'Gói thầu',
            binding: 'ProductName',
            width: 400
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
            header: 'Số kế hoạch',
            binding: 'DocNo',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Hạng mục',
            binding: 'Description',
            width: 300
        },
        {
            header: 'Giá trị DT ban đầu',
            binding: 'Amount_DoanhThu',
            width: 150,
            format: 'N0'
        },
        {
            header: 'Giá trị CP ban đầu',
            binding: 'Amount_ChiPhi',
            width: 150,
            format: 'N0'
        },
        {
            header: 'Lợi nhuận',
            binding: 'Amount_LoiNhuan',
            width: 150,
            format: 'N0'
        },
        {
            header: 'Tỉ suất LN/DT (%)',
            binding: 'TiSuat_LN',
            width: 150,
            format: 'P2'
        },
        {
            header: 'Gửi duyệt',
            binding: 'ApproveSend',
            width: 100
        },
        {
            header: 'Hoàn thiện duyệt',
            binding: 'CompletedApprove',
            width: 100
        },
        // {
        //     header: 'Hồ sơ hủy',
        //     binding: 'ClosedApprove',
        //     width: 100
        // },
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
            align: 'center',
        },
        {
            header: 'Bộ phận',
            binding: 'DeptName',
            width: 250,
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
        }
    ]
}

export class LayoutPlanCostOfficeEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30CCMBudget_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'K2',
                    CCMBudgetId: '',
                    DocStatus: '4',
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
                    Sort: 'ItemNo',
                    DefaultValues: {
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        CCMBudgetId: 'Parent.CCMBudgetId',
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
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        BizDocId: 'Parent.CCMBudgetId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
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
                }
            ]
        }
    };

    evaluators = {
        // 'Evaluator_CCMBudgetDetail_Amount': {
        //     EvaluatorName: 'EvaluatorCaculate',
        //     DataMember: 'Amount',
        //     Value: 'OriginalAmount',
        //     Tables: 0
        // },

        //constraint
        'Evaluator_ServerConstraint_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,DocCode,DocDate',
            Command: 'ufn_B30CCMBudget_DefaultDocNo',
            zExpr: "ProductCostId != ''",
            DataMember: 'DocNo'
        },
        'Evaluator_ServerConstraint_B30CCMBudget_Check_Unique_DocNo': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},CCMBudgetId,DocCode,DocNo',
            Command: 'ufn_B30CCMBudget_CheckUniqueDocNo',
            MessageText: 'Số phiếu kế hoạch đã tồn tại',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,{VAR=EmptyField_ParentBizDocId}',
            Command: 'usp_B30BizDocApprove_GetData',
            DataMember: '',
            OutputTable: 1
        },
        'Evaluator_ServerConstraint_K2_LoadPrevious': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,DocCode,CCMBudgetId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_B30CCMBudgetK2_LoadPrevious',
            zExpr: "ProductCostId != ''",
            DataMember: '',
            OutputTable: 0
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
        'Evaluator_ServerConstraint_Check_ImportedExcel': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Id,DocCode,ProductCostId,{VAR=ParentBizDocId},CustomerCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_CheckImported',
            DataMember: 'CountImport',
            zExpr: "ProductCostId != ''"
        },
        // 'Evaluator_ServerConstraint_Lay_TenCongViec': {
        //     EvaluatorName: 'EvaluatorQueryChild',
        //     ConstraintKey: 'JobCode',
        //     Command: 'usp_Coteccons_LayTenCongViec',
        //     zExpr: "JobCode != ''",
        //     DataMember: 'JobName',
        //     Tables: 0
        // },
        //không đổi tên
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
        'Evaluator_ServerContrains_GetAmountBillPaid': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'DocDate,ProductCostId,CustomerCode,BizDocId_C1,{VAR=Branch.Ma_Dvcs},ItemNo,JobCode,OriginalAmount',
            DataMember: 'AmountPaid',
            Command: 'usp_Coteccons_GetAmountBillPaid',
            Tables: 0
        },

        //updated
        'Evaluator_ServerUpdated_CreateFormula': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CCMBudgetId',
            Command: 'usp_Coteccons_CreateFormula_CCMBudgetDetail'
        },
        'Evaluator_ServerUpdated_BuiltinOrder': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=TableNames_B30CCMBudgetDetail},{VAR=Keys_B30CCMBudgetDetail},{VAR=FieldOrders_B30CCMBudgetDetail},CCMBudgetId,{VAR=EmptyField_BizDocId},{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_Web_SetBuiltionOrder'
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
        //'Evaluator_ServerConstraint_Lay_TenCongViec'
        'Evaluator_ServerConstraint_Check_ImportedExcel'
    ];

    serverUpdating = [
        'Evaluator_ServerConstraint_B30CCMBudget_Check_Unique_DocNo',
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep',
        // 'Evaluator_ServerConstraint_Check_ApproveSent_NotChange'
    ];

    serverUpdated: string[] = [
        'Evaluator_ServerUpdated_BuiltinOrder',
        'Evaluator_UpdateInfo_WhenApproveSend',
        'Evaluator_ServerUpdated_CreateFormula',
        'Evaluator_ServerUpdated_CCMBudgetDetail_UpdateFromParent'
    ]

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_B30CCMBudget_Check_Unique_DocNo',
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep',
        // 'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        //
        'Evaluator_ServerConstraint_Approve_GetData'
        // Lưới chi tiết do PlanCostOfficeEditorComponent.loadDetailData() dựng (thay K2_LoadPrevious)
    ];

    buttonCommand: string[] = [
    ];

    importCommand: string[] = [
        // 'Evaluator_ServerConstraint_DeleteDataImport'
    ]

    columnChanged = {
        ProductCostId: {
            Evaluators: [
                // 'Evaluator_ServerContrains_GetAmountBillPaid'
            ]
        },
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
                OriginalAmount: {
                    Evaluators: [
                        //'Evaluator_CCMBudgetDetail_Amount',
                        // 'Evaluator_ServerContrains_GetAmountBillPaid'
                    ]
                },
                CustomerCode: {
                    Evaluators: [
                        // 'Evaluator_ServerContrains_GetAmountBillPaid'
                    ]
                },
                BizDocId_C1: {
                    Evaluators: [
                        // 'Evaluator_ServerContrains_GetAmountBillPaid'
                    ]
                },
                JobCode: {
                    Evaluators: [
                        // 'Evaluator_ServerContrains_GetAmountBillPaid'
                    ]
                },
            }
        },
        {
            Tables: 1,
            columnChanged: {

            }
        },
    ];

    columnsReadOnly = [];

    linkReporter = {
        'btnBaoCao': {
            directory: 'reporterplancostoffice',
            type: 'view',
            key: 'REP01_CCM_TCVP',
            parameter: { 'Commandkey': 'REP01_CCM_TCVP', 'ProductCostId': '{EXPR=ProductCostId}', 'CCMBudgetId': '{EXPR=CCMBudgetId}', 'Ma_Dvcs': '{VAR=Branch.Ma_Dvcs}' }
        },
        'btnBaoCaoSoSanh': {
            directory: 'reporterplancostoffice_ss',
            type: 'view',
            key: 'REP01_CCM_TCCT',
            parameter: { 'Commandkey': 'REP01_CCM_TCCT', 'ProductCostId': '{EXPR=ProductCostId}', 'CCMBudgetId': '{EXPR=CCMBudgetId}', 'Ma_Dvcs': '{VAR=Branch.Ma_Dvcs}' }
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
                    col: 6
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số kế hoạch',
                    type: 'text',
                    validators: [Validators.required],
                    isReadOnly: 'true',
                    col: 6,
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'DeptCode',
                    label: 'Bộ phận',
                    lookupKey: 'Dept',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Hạng mục',
                    type: 'text',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive=1 AND ParentId=(SELECT Id FROM B20Approve WHERE ProcessCode = 'G-005')",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12
                }, this.srv, this.parentData),
                // Tổng hợp: tính lại từ lưới chi tiết (PlanCostOfficeEditorComponent.recalcTotals)
                new NumberBoxInput({
                    key: 'ThuChiKyTruoc',
                    label: 'Tổng dự trù kỳ trước',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'TotalPaymentAmountC',
                    label: 'Thực hiện tới hiện tại',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_ChiPhi',
                    label: 'Tổng dự trù kỳ này',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'TiSuat_LN',
                    label: '% thực hiện',
                    isDisabled: 'true',
                    format: 'P2',
                    col: 6
                }),
                new UploadInput({
                    key: 'FilePath',
                    label: 'Đính kèm',
                    col: 6
                }, this.srv),
                new ButtonInput({
                    key: 'btnBaoCao',
                    label: 'Dự toán chi phí',
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    col: 6,
                    isDisabled: 'true'
                }),
                new ButtonInput({
                    key: 'btnBaoCaoSoSanh',
                    label: 'So sánh chi phí',
                    col: 6
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

    childColumns = planCostOfficeDetailColumns(false);

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
            isReadOnly: 'true',
            dataType: 'Array',
            lookupKey: 'Dept',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 0
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
            width: 0,
            isReadOnly: 'true',
            dataType: 'Array',
            lookupKey: 'Position',
            lookupfilter: 'IsGroup=0 AND IsActive=1'
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
            validatorMessage: 'Không được bỏ trắng giá trị',
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
    ]

    childColumns2 = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
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

