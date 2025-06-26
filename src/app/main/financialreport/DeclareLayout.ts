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
export class LayoutFinancialReportExplorer implements IExplorerFormulaDeclaration {

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30CCMBudget_Explore',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'K2' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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
        //     parameter: { 'Commandkey': 'financialreport-editor', 'ProcessCode': '{EXPR=ProcessCode}'}
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

export class LayoutFinancialReportEditor implements IEditorFormulaDeclaration {

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
                    Name: 'vB30CCMBudgetDetail1_Edit',
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
                    Name: 'vB30CCMBudgetDetail_Edit',
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
            OutputTable: 2
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
        // 'Evaluator_ServerConstraint_DefaultDocNo',
        // //'Evaluator_ServerConstraint_Lay_TenCongViec'
        // 'Evaluator_ServerConstraint_Check_ImportedExcel'
    ];

    serverUpdating = [
        // 'Evaluator_ServerConstraint_B30CCMBudget_Check_Unique_DocNo',
        // 'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep',
        // 'Evaluator_ServerConstraint_Check_ApproveSent_NotChange'
    ];

    serverUpdated: string[] = [
        // 'Evaluator_ServerUpdated_BuiltinOrder',
        // // 'Evaluator_UpdateInfo_WhenApproveSend',
        // 'Evaluator_ServerUpdated_CreateFormula',
        // 'Evaluator_ServerUpdated_CCMBudgetDetail_UpdateFromParent'
    ]

    buttonLoadChild: string[] = [
        // 'Evaluator_ServerConstraint_B30CCMBudget_Check_Unique_DocNo',
        // 'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep',
        // // 'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        // //
        // // 'Evaluator_ServerConstraint_Approve_GetData',
        // 'Evaluator_ServerConstraint_K2_LoadPrevious'
    ];

    buttonCommand: string[] = [
    ];

    importCommand: string[] = [
        // 'Evaluator_ServerConstraint_DeleteDataImport'
    ]

    columnChanged = {
        ProductCostId: {
            Evaluators: [
                'Evaluator_ServerContrains_GetAmountBillPaid'
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
                        'Evaluator_ServerContrains_GetAmountBillPaid'
                    ]
                },
                CustomerCode: {
                    Evaluators: [
                        'Evaluator_ServerContrains_GetAmountBillPaid'
                    ]
                },
                BizDocId_C1: {
                    Evaluators: [
                        'Evaluator_ServerContrains_GetAmountBillPaid'
                    ]
                },
                JobCode: {
                    Evaluators: [
                        'Evaluator_ServerContrains_GetAmountBillPaid'
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
            directory: 'reporterfinancialreport',
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
                    lookupfilter: "IsActive=1",
                    hideValueMember: false,
                    
                    col: 12
                }, this.srv, this.parentData),
                // new NumberBoxInput({
                //     key: 'Amount_DoanhThu',
                //     label: 'Doanh thu',
                //     isDisabled: 'true',
                //     col: 6
                // }),
                new NumberBoxInput({
                    key: 'Amount_DoanhThu',
                    label: 'Doanh thu',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_ChiPhi',
                    label: 'Chi phí',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_LoiNhuan',
                    label: 'Lợi nhuận',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'TiSuat_LN',
                    label: 'Tỉ suất lợi nhuận B',
                    isDisabled: 'true',
                    format: 'P2',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'HeSoQuanLy',
                    label: 'Hệ số quản lý công ty (Dự kiến)',
                    
                    format: 'P2',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'HeSoThueTNDN',
                    label: 'Thuế TNDN (Dự kiến)',
                    
                    format: 'P2',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_ChiPhiQL',
                    label: 'Chi phí quản lý công ty',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_ThueTNDN',
                    label: 'Thuế TNDN',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_LoiNhuanRong',
                    label: 'Lãi ròng',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'TiSuatLNRong',
                    label: 'Tỉ suất lợi nhuận C',
                    isDisabled: 'true',
                    format: 'P2',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'FromDate',
                    label: 'Từ ngày',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    
                    col: 6
                }),
                new DateBoxInput({
                    key: 'ToDate',
                    label: 'Đến ngày',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    
                    col: 6
                }),
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
                new UploadInput({
                    key: 'FilePath',
                    label: 'Đính kèm DTCP đã ký',
                    col: 6
                }, this.srv),
                new ButtonInput({
                    key: 'btnBaoCao',
                    label: 'Báo cáo tài chính công trường công trường',
                    col: 6
                }),
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
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: 'Công việc',
            binding: 'JobCode',
            dataType: 'Array',
            lookupKey: 'Job_CCM',
            bindingList: {
                Name: 'JobName'
            },
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            multiSelection: true,
            isReadOnly: 'true',
            width: 100
        },
        {
            header: 'Nội dung công việc',
            binding: 'JobName',
            isReadOnly: 'true',
            width: 250
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
            header: 'Giá trị dự trù',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true',
            validators: "{EXPR=OriginalAmount} < {EXPR=AmountPaid} && {EXPR=AmountPaid} != 0",
            validatorMessage: 'Giá trị dự trù không được nhỏ hơn giá trị đã thực hiện',
            ignoreError: 1
        },
        {
            header: 'Id hợp đồng',
            binding: 'BizDocId_C1',
            width: 200,
            dataType: 'Array',
            isReadOnly: 'true',
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
            width: 200,
            isReadOnly: 'true',
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
        },
        // {
        //     header: 'Dòng tiêu đề',
        //     binding: 'IsTitleRow',
        //     dataType: 'Boolean',
        //     width: 50
        // },
        // {
        //     header: 'Bậc',
        //     binding: 'Level',
        //     dataType: 'Number',
        //     width: 50,
        //     format: 'n0'
        // },
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
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: 'Mã XD/ME',
            binding: 'CodeMEXD',
            dataType: 'Array',
            lookupKey: 'KHC',
            
            
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ClassCode1='01'",
            
            width: 100
        },
        {
            header: 'Mã ưu tiên chi',
            binding: 'CodeKHC',
            dataType: 'Array',
            lookupKey: 'KHC',
            
            
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ClassCode1='02'",
            
            width: 100
        },
        {
            header: 'Công việc',
            binding: 'JobCode',
            dataType: 'Array',
            lookupKey: 'Job_CCM',
            isReadOnly: 'true',
            bindingList: {
                Name: 'JobName'
            },
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            multiSelection: true,
            width: 100
        },
        {
            header: 'Nội dung công việc',
            binding: 'JobName',
            isReadOnly: 'true',
            width: 250
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
            header: 'Giá trị dự trù',
            binding: 'OriginalAmount',
            isReadOnly: 'true',
            dataType: 'Number',
            width: 150,
            validators: "{EXPR=OriginalAmount} < {EXPR=AmountPaid} && {EXPR=AmountPaid} != 0",
            validatorMessage: 'Giá trị dự trù không được nhỏ hơn giá trị đã thực hiện',
            ignoreError: 1
        },
        {
            header: 'Id hợp đồng',
            binding: 'BizDocId_C1',
            width: 200,
            isReadOnly: 'true',
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
            isReadOnly: 'true',
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
        },
        // {
        //     header: 'Dòng tiêu đề',
        //     binding: 'IsTitleRow',
        //     dataType: 'Boolean',
        //     width: 50
        // },
        // {
        //     header: 'Bậc',
        //     binding: 'Level',
        //     dataType: 'Number',
        //     width: 50,
        //     format: 'n0'
        // },
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

    childColumns2 = [
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

    childColumns3 = [
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

