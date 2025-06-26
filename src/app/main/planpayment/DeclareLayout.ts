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

// Kế hoạch chi phí công trường
export class LayoutPlanPaymentExplorer implements IExplorerFormulaDeclaration {

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30PaymentPlan_Explore',
                FilterKey: "((ProductType <> '3' OR ProductCostId = 'PROD001610') AND ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'I2' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'ProductName,DocDate DESC,DocNo DESC',
                RowPage: 50
            },
            Child: {
                Name: 'vB30BizDocApprove_PaymentPlanExplorer',
                ParentKey: 'CCMBudgetId',
                ChildKey: 'BizDocId'
            }
        }
        // CopiedValues: {
        //     parameter: { 'Commandkey': 'planpayment-editor', 'ProcessCode': '{EXPR=ProcessCode}'}
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
            header: 'Số DTCP',
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
            header: 'Giá trị CP ban đầu',
            binding: 'Amount_ChiPhi',
            width: 150,
            format: 'N0'
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

export class LayoutPlanPaymentEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30PaymentPlan_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'I2',
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
                    Name: 'vB30PaymentPlanDetail_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    Sort: 'BuiltinOrder',
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
            Command: 'ufn_B30PaymentPlan_DefaultDocNo',
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
        'Evaluator_ServerConstraint_K2_LoadPrevious': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProductCostId',
            Command: 'usp_PaymentPlan_GetBCTC',
            zExpr: "ProductCostId != ''",
            DataMember: '',
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,CustomerCode,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_CheckVer0_ChuaDuyetXong_PaymentPlan',
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
            DataMember: '',
            OutputTable: 1
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},{VAR=EmptyField_BizDocId},CCMBudgetId,{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true'
        },
    };

    serverConstraint = [
        'Evaluator_ServerConstraint_DefaultDocNo',

    ];

    serverUpdating = [
        'Evaluator_ServerConstraint_B30CCMBudget_Check_Unique_DocNo',
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange'
    ];

    serverUpdated: string[] = [

    ]

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_B30CCMBudget_Check_Unique_DocNo',
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Approve_GetData',
        'Evaluator_ServerConstraint_K2_LoadPrevious'
    ];

    buttonCommand: string[] = [
    ];

    importCommand: string[] = [
        // 'Evaluator_ServerConstraint_DeleteDataImport'
    ]

    columnChanged = {
        ProcessCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_Approve_GetData'
            ]
        }
    };

    columnChangedChild = [
    ];

    columnsReadOnly = [];

    linkReporter = {
        'btnPayment': {
            directory: 'planupdate',
            type: 'detail',
            parameter: { 'Commandkey': 'planupdate-editor'},
            key: 'Id'
        },
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
                new TextBoxInput({
                    key: 'Description',
                    label: 'Hạng mục',
                    type: 'text',
                    col: 12
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive=1 AND ParentId=233 AND ProcessTypeCode NOT IN ('PT03')",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12
                }, this.srv, this.parentData),
                new ButtonInput({
                    key: 'btnPayment',
                    label: 'Cập nhật kế hoạch thanh toán',
                    style: 'background-color:#9cc09c;',
                    col: 6
                }),
                // new NumberBoxInput({
                //     key: 'Amount_DoanhThu',
                //     label: 'Doanh thu',
                //     isDisabled: 'true',
                //     col: 6
                // }),


                // new NumberBoxInput({
                //     key: 'Amount_LoiNhuan',
                //     label: 'Lợi nhuận',
                //     isDisabled: 'true',
                //     col: 6
                // }),
                // new NumberBoxInput({
                //     key: 'TiSuat_LN',
                //     label: 'Tỉ suất LN (%)',
                //     isDisabled: 'true',
                //     col: 6,
                //     type: 'number',
                //     format: 'P2'
                // }),

                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    col: 6,
                    isNewRow: true,
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
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            isReadOnly: 'true',
            width: 100
        },
        {
            header: 'Mã XD/ME',
            binding: 'CodeMEXD',
            dataType: 'Array',
            lookupKey: 'KHC',
            isReadOnly: 'true',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ClassCode1='01'",
            width: 100
        },
        {
            header: 'Mã ưu tiên chi',
            binding: 'CodeKHC',
            dataType: 'Array',
            isReadOnly: 'true',
            lookupKey: 'KHC',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ClassCode1='02'",
            width: 100
        },

        {
            header: 'Nội dung công việc',
            binding: 'JobName',
            isReadOnly: 'true',
            width: 250
        },

        {
            header: 'Tên đối tượng',
            binding: 'CustomerName',
            width: 250,
            isReadOnly: 'true',
        },

        {
            header: 'Thông tin hợp đồng',
            binding: 'DocInfo',
            width: 200,
            isReadOnly: 'true'
        },

        {
            header: 'Số tiền đã thi công nhưng chưa up bill',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 150

        },
        {
            header: 'Ngày tính hạn TT',
            binding: 'EstimatedTimeDelivery',
            dataType: 'Date',
            width: 150,
            format: 'dd/MM/yyyy'
        },
        {
            header: 'KL thi công/CC tháng',
            binding: 'Description',
            width: 150
        },
        {
            header: 'Số tiền dự trù cho Nhân công',
            binding: 'Amount_ThiCong',
            dataType: 'Number',
            width: 150

        },
        {
            header: 'Ngày tính hạn TT',
            binding: 'RequestDate',
            dataType: 'Date',
            width: 150,
            format: 'dd/MM/yyyy'
        },


        {
            header: 'Giá trị đã TH, Chưa làm bill, chưa xuất HĐ',
            binding: 'OpenPlanAmount',
            dataType: 'Number',
            width: 0,

            ignoreError: 1
        },
        {
            header: 'Công việc',
            binding: 'JobCode',
            dataType: 'Array',
            isReadOnly: 'true',
            lookupKey: 'Job_CCM',
            bindingList: {
                Name: 'JobName'
            },
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            multiSelection: true,
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
                ContractType: 'ContractType'
            },
            // displayMember: 'DocInfo',
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
            lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        },
        {
            header: 'Loại hợp đồng',
            binding: 'ContractType',
            width: 0,
            isReadOnly: 'true'
        },
        {
            header: 'BuiltinOrder',
            binding: 'BuiltinOrder',
            width: 0,
            isReadOnly: 'true'
        },
        {
            header: 'Formula',
            binding: 'Formula',
            width: 0,
            isReadOnly: 'true'
        },
        {
            header: 'Loại hợp đồng',
            binding: 'ContractType',
            width: 0,
            isReadOnly: 'true'
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
            width: 0
        },



        {
            header: 'Ghi chú',
            binding: 'Remark',
            width: 0
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
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 0
        },
        {
            header: 'Bậc',
            binding: 'Level',
            dataType: 'Number',
            width: 0,
            format: 'n0'
        },
        // {
        //     header: 'Công thức',
        //     binding: 'Formula',
        //     width: 500
        // },
        // {
        //     header: 'Tự áp công thức',
        //     binding: 'ManualFormula',
        //     dataType: 'Boolean',
        //     width: 80
        // }
    ]

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

