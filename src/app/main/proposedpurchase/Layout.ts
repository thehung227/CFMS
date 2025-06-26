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

// constructor(private srv?: any,
//     private parentData?: any) {
// }

// Đề nghị mua hàng
export class LayoutProposedPurchaseExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_Explore',
                FilterKey: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'PP' AND IsActive=1 ",//AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'EstimatedTimeDeliveryMin',
                RowPage: 50,
                DefaultValues: {
                    CurrencyCode: 'VND'
                }
            },
            Child: {
                Name: '',
                ParentKey: '',
                ChildKey: '',
                OrderBy: ''
            }
        },
        PrintDocument: {
            Key: 'BizDocViewer',
            Text: 'Mẫu in Đề nghị mua hàng',
            Command: 'usp_B30BizDoc_VoucherForm',
            LayoutPrint: [],
            PrintGrid: [
                {
                    header: 'STT/ No',
                    binding: 'OrderNo',
                    width: 30,
                    dataType: 'String',
                    align: 'center'
                },
                {
                    header: 'Tên hàng hóa/ Iterm',
                    binding: 'ItemName',
                    width: 140,
                    dataType: 'String'
                },
                {
                    header: 'Thương hiệu/ Brand',
                    width: 60,
                    dataType: 'String'
                },
                {
                    header: 'Số lượng/ Quantity',
                    binding: 'Quantity',
                    width: 60,
                    dataType: 'Number',
                    format: 'n0'
                },
                {
                    header: 'Qui đổi/ Convert',
                    binding: 'Quantity8',
                    width: 60,
                    dataType: 'Number',
                    format: 'n3'
                },
                {
                    header: 'Đơn giá/ Price',
                    binding: 'OriginalUniCost',
                    width: 60,
                    dataType: 'Number'
                },
                {
                    header: 'Thành tiền/ Total',
                    binding: 'OriginalAmount',
                    width: 70,
                    dataType: 'Number'
                },
                {
                    header: 'Thời gian nhận hàng/ Delivery time',
                    binding: 'EstimatedTimeDelivery',
                    width: 80,
                    dataType: 'Date',
                    format: 'dd/MM/yyyy'
                },
                {
                    header: 'Ghi chú/ mark',
                    binding: 'ReceiptTeam',
                    width: 80,
                    dataType: 'String'
                }
            ]
        }
    }

    menu = {
        Table: 'B20Item',
        Filter: "IsGroup=1 AND IsActive=1 AND ClassCode3 = 'TM'",
        parameter: { 'Commandkey': 'proposedpurchase-editor', 'ItemGroupCode': '{EXPR=Code}' }
    }

    linkwizard = {
        key: 'WIZARD_CTC_TINHGIA',
        parameter: { 'Commandkey': 'WIZARD_CTC_TINHGIA', 'BizDocId': '{EXPR=BizDocId}', 'BranchCode': '{EXPR=BranchCode}', 'DocDate1': '{EXPR=DocDate}' }
    }

    parentGrid = [
        {
            header: 'Ngày phiếu',
            binding: 'DocDate',
            width: 200,
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Số phiếu',
            binding: 'DocNo',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Người tạo',
            binding: 'FullName',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Nhận hàng từ ngày',
            binding: 'EstimatedTimeDeliveryMin',
            width: 200,
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Đến ngày',
            binding: 'EstimatedTimeDeliveryMax',
            width: 200,
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Số ngày',
            binding: 'DateDiff_MinMax',
            width: 100,
            dataType: 'Number'
        }
    ]
}

export class LayoutProposedPurchaseEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    // Khai báo view lấy dữ liệu <Tables> B7
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_EditPP',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'PP',
                    DocStatus: '1',
                    BizDocId: '',
                    CurrencyCode: 'VND',
                    EmployeeCode: '{VAR=User.Ma_CbNv}',
                    Id: -1,
                    IsWebData: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocDetail_EditPP',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        CCMBudgetId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        DocDate: 'Parent.DocDate'
                    }
                }
            ],

        }
    };

    menu = {
        Table: 'vB20Item',
        Filter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ParentId = (SELECT Id FROM B20Item WHERE Code={EXPR=ItemGroupCode})",
        FieldSearch: 'Name',
        OrderBy: 'Name',
        RowItem: 1000,
        AddToColumn: { 'ItemCode': 'Code', 'Description': 'Name', 'Unit': 'Unit', 'ConvertRate9': '1', 'Quantity9': '1' },
        DuplicationField: 'ItemCode',
        ColumnEdit: 'Quantity9',
        ColumnShow: 'QuantityShowWeb',
        ColumnInput: 'QuantityInputWeb',
        PrimaryField: 'Code'

    }

    evaluators = {
        'Evaluator_DocDate_DefaultFromParent': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'DocDate',
            Value: 'DocDate',
            Tables: 0
        },
        'Evaluator_Set_ItemGroupCode_BindingFromParent': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'ItemGroupCode',
            Value: 'ItemGroupCode',
            Tables: 0,
            zExpr: '1==0'
        },
        'Evaluator_Set_ProductCostId_BindingFromParent': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'ProductCostId',
            Value: 'ProductCostId',
            Tables: 1,
            zExpr: '1==0'
        },
        'Evaluator_Set_EstimatedTimeDelivery_BindingFromParent': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'EstimatedTimeDelivery',
            Value: 'EstimatedCompletionDate',
            Tables: 0,
            zExpr: '1==0'
        },
        'Evaluator_BizDocDetail_Quantity_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Quantity",
            Value: "Quantity9*ConvertRate9",
            Tables: 0
        },
        //server constraint
        'Evaluator_ServerConstraint_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},DocCode,DocDate,{VAR=VoucherCode_DN},ProductCostId',
            Command: 'ufn_AutoGenVoucherNoByPrefix_BizDoc_VoucherCode',
            DataMember: 'DocNo',
            zExpr: "ProductCostId != ''"
        },
        // 'Evaluator_ServerConstraint_QuyDoi_TrongLuongThep': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: 'ItemCode,Quantity9,{VAR=Branch.Ma_Dvcs}',
        //     Command: 'ufn_Coteccons_TrongLuongThepQuyDoi',
        //     zExpr: "Quantity9 != ''",
        //     DataMember: 'Quantity8',
        //     Tables: 0
        // },
        'Evaluator_ServerConstraint_QuyDoi_TrongLuongThep': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Quantity8",
            Value: "Quantity9*ConvertRate9",
            Tables: 0
        },
        'Evaluator_TotalQuantity_Calculate': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "TotalQuantity",
            Value: 'Quantity9',
            Tables: 0
        },
        'Evaluator_TotalQuantity_QuyDoi_Calculate': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "TotalQuantity_QuyDoi",
            Value: 'Quantity8',
            Tables: 0
        },
        //server constrain with xml
        'Evaluator_ServerConstraint_LoadReceiptTeamCode': {
            EvaluatorName: 'EvaluatorQueryXmlLoadChild',
            ConstraintKey: 'BranchCode',
            ParameterXmlName: 'vB30BizDocDetail_EditPP',
            Tables: 0,
            Command: 'usp_TMCtc_LoadReceiptTeamCode',
            zExpr: "ReceiptTeamCode != ''",
            OutputTable: 1
        },
        //server updated
        'Evaluator_ServerUpdated_BuiltinOrder': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=TableNames_B30CCMBudgetDetail},{VAR=Keys_B30CCMBudgetDetail},{VAR=FieldOrders2_B30CCMBudgetDetail},CCMBudgetId,{VAR=EmptyField_BizDocId},{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_Web_SetBuiltionOrder'
        },
        'Evaluator_ServerUpdating_UpdateStatusByApproveStatus': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Id',
            Command: 'usp_Coteccons_BizDocPP_UpdateDocStatus'
        },
        'Evaluator_GetMin_ReceiptTeamCode': {
            EvaluatorName: 'EvaluatorFirstChild',
            DataMember: "ReceiptTeamCode",
            Value: 'ReceiptTeamCode',
            Tables: 1
        },
        'Evaluator_Set_ReceiptTeamCode_BindingFromParent': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'ReceiptTeamCode',
            Value: 'ReceiptTeamCode',
            Tables: 0,
            zExpr: '1==0'
        }
    };

    serverConstraint = [
        'Evaluator_ServerConstraint_DefaultDocNo'
    ];

    serverUpdating = [
    ]

    serverUpdated = [
    ];

    buttonLoadChild: string[];

    buttonCommand: string[] = [
    ];

    importCommand: string[] = [
    ]

    columnChanged = {
        ItemGroupCode: {
            Evaluators: [
                'Evaluator_Set_ItemGroupCode_BindingFromParent'
            ]
        },
        EstimatedCompletionDate: {
            Evaluators: [
                'Evaluator_Set_EstimatedTimeDelivery_BindingFromParent'
            ]
        },
        ProductCostId: {
            Evaluators: [
                'Evaluator_Set_ProductCostId_BindingFromParent'
            ]
        },
    };

    rowAdded = [
        {
            Tables: 0,
            Evaluators: [
                'Evaluator_Set_EstimatedTimeDelivery_BindingFromParent',
                'Evaluator_Set_ReceiptTeamCode_BindingFromParent',
                'Evaluator_Set_ItemGroupCode_BindingFromParent'
            ]
        }
    ]

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
                Quantity9: {
                    Evaluators: [
                        'Evaluator_ServerConstraint_QuyDoi_TrongLuongThep',
                        'Evaluator_TotalQuantity_Calculate',
                        'Evaluator_BizDocDetail_Quantity_Calculator'
                    ]
                },
                Quantity8: {
                    Evaluators: [
                        'Evaluator_TotalQuantity_QuyDoi_Calculate'
                    ]
                },
                ReceiptTeamCode: {
                    Evaluators: [
                        'Evaluator_ServerConstraint_LoadReceiptTeamCode'
                    ]
                }
            }
        }
    ];

    columnsReadOnly = [];

    linkReporter = {
        // 'btnBaoCao': {
        //     directory: 'reporterplansigncon',
        //     type: 'view',
        //     key: 'REP02_CCM_KHKK'
        // }
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
                    col: 12
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số phiếu',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12,
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId0',
                    label: 'Dự án',
                    lookupKey: 'Project0',
                    binding: {
                    },
                    lookupfilter: "IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' ",
                    hideValueMember: true,
                    validators: [Validators.required],
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId1',
                    label: 'Gói thầu',
                    lookupKey: 'Project1',
                    binding: {
                        RowId: 'ProductCostId'
                    },
                    lookupfilter: "IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId0 = '{EXPR=ProductCostId0}'",
                    hideValueMember: true,
                    validators: [Validators.required],
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Hạng mục',
                    lookupKey: 'Project2',
                    binding: {
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId1 = '{EXPR=ProductCostId1}'",
                    hideValueMember: true,
                    validators: [Validators.required],
                    col: 12
                }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'ProductCostId',
                //     label: 'Công trường',
                //     lookupKey: 'Project2',
                //     binding: {
                //     },
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                //     validators: [Validators.required],
                //     hideValueMember: true,
                //     col: 12,
                //     labelCol: 5

                // }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ItemGroupCode',
                    label: 'Nhóm hàng',
                    lookupKey: 'Item',
                    isDisabled: 'true',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ClassCode3= 'TM'", //AND BranchCode='{VAR=Branch.Ma_Dvcs}'
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCode',
                    label: 'Người lập',
                    lookupKey: 'Employee',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new DateBoxInput({
                    key: 'EstimatedCompletionDate',
                    label: 'Ngày cần nhận hàng',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 12
                }),
                new UploadInput({
                    key: 'FilePath',
                    label: 'File đính kèm',
                    col: 12,
                    isOnlyDownload: false
                }, this.srv),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Ghi chú',
                    type: 'text',
                    col: 12
                }),
                new NumberBoxInput({
                    key: 'TotalQuantity',
                    label: 'Tổng số lượng',
                    type: 'number',
                    format: 'n4',
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'

                }),
                new NumberBoxInput({
                    key: 'TotalQuantity_QuyDoi',
                    label: 'Tổng số lượng quy đổi',
                    type: 'number',
                    format: 'n4',
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'

                }),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    col: 12,
                    isDisabled: 'true'
                }),
                // new NumberBoxInput({
                //     key: 'DocStatus',
                //     label: 'Trạng thái',
                //     type: 'number',
                //     col: 12,
                //     labelCol: 5,
                //     isReadOnly: 'true'
                // })
            ]
        })
    ];

    childColumns = [
        {
            header: 'STT',
            binding: 'BuiltinOrder',
            dataType: 'Number',
            format: 'n0',
            width: 0
        },
        {
            header: 'Hàng hóa, vật tư',
            binding: 'ItemCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Item',
            bindingList: {
                Name: 'Description',
                Unit: 'Unit'
            },
            lookupfilter: "ParentId IN (SELECT Id FROM B20Item WHERE Code = '{EXPR=ItemGroupCode}') AND IsActive=1 AND IsGroup=0 AND BranchCode = '{VAR=Branch.Ma_Dvcs}'",
            width: '1.0*'
        },
        {
            header: 'Diễn giải',
            binding: 'Description',
            isRequired: true,
            width: '2.5*'
        },
        {
            header: 'Đặc tả',
            binding: 'Remark',
            width: '1.0*'
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            dataType: 'Array',
            lookupKey: 'ItemUnit',
            bindingList: {
                ConvertRate: 'ConvertRate9'
            },
            lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND ItemCode='{EXPR=ItemCode}'",
            width: '0.8*'
        },
        {
            header: 'Số lượng',
            binding: 'Quantity9',
            dataType: 'Number',
            step: 1,
            format: 'n2',
            isRequired: true,
            width: '1.0*'
        },
        {
            header: 'Quy đổi (kg)',
            binding: 'Quantity8',
            dataType: 'Number',
            format: 'n4',
            isReadOnly: 'true',
            width: '1.0*'
        },
        {
            header: 'Ngày nhận hàng',
            binding: 'EstimatedTimeDelivery',
            width: '1.5*',
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        }
    ];
}