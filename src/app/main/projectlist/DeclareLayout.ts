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

// Danh mục Dự án/ gói thầu mua hàng
export class LayoutProjectListExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB20Project_Explorer',
                FilterKey: "IsGroup=0 AND IsActive=1",
                OrderBy: 'Code',
                RowPage: 500
            }
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'KLTT ĐTC- {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'ItemNo',
                    width: 70,
                    dataType: 'String'
                },
                {
                    header: 'Giá trị thực hiện',
                    binding: 'Amount_Th',
                    width: 110,
                    dataType: 'Number'
                }
            ]
        }
    }

    lookup3 = {
        Table: 'B00TMCtcDocStatus',
        Filter: "CommandWeb = 'rowsPage'",
    }

    parentGrid = [
        {
            header: 'Tên',
            binding: 'Name',
            width: 400,
            dataType: 'String'
        },
        {
            header: 'Mã',
            binding: 'Code',
            width: 130,
            dataType: 'String'
        },
        {
            header: 'Địa chỉ',
            binding: 'Address',
            width: 0,
            dataType: 'String'
        },
        {
            header: 'Tỉnh/ thành',
            binding: 'TerritoryName',
            width: 300,
            dataType: 'String'
        }
    ]
}

export class LayoutProjectListEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB20Project_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB20ProductHumanPurchase',
                    ParentKey: 'RowId',
                    ChildKey: 'ProductCostId',
                    DefaultValues: {
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB20ProductTradeMark',
                    ParentKey: 'RowId',
                    ChildKey: 'ProductCostId',
                    DefaultValues: {
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB20ProductOriginalPrice_Edit',
                    ParentKey: 'RowId',
                    ChildKey: 'ProductCostId',
                    DefaultValues: {
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB20ProductPurchaseLimit_Edit',
                    ParentKey: 'RowId',
                    ChildKey: 'ProductCostId',
                    DefaultValues: {
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                }
            ]
        }
    }

    evaluators = {
        'Evaluator_ServerConstraint_DefaultCode': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ProductCostId1,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_TM_TaoMaHangMuc',
            zExpr: "ProductCostId1 != ''",
            DataMember: 'Code'
        },
        'Evaluator_ServerConstraint_LoadGrid': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId1',
            Command: 'usp_TMCtc_GetPosition_ProductPurchase',
            zExpr: "ProductCostId1 != ''",
            OutputTable: 0
        }
    }

    serverConstraint = [
        'Evaluator_ServerConstraint_DefaultCode'
    ]

    serverUpdating = [

    ]

    serverUpdated: string[] = [

    ]

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_LoadGrid'
    ];

    buttonCommand: string[] = [

    ]

    importCommand: string[] = [

    ]

    columnChanged = {

    };

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
            }
        }
    ];

    columnsReadOnly = [];

    panels: PanelBase[] = [
        new TablePanel({
            label: 'Panel 1',
            col: 12,
            controls: [
                new LookupBoxInput({
                    key: 'ProductCostId0',
                    label: 'Dự án',
                    lookupKey: 'ProductCost',
                    binding: {
                        Address: 'Address',
                        Name: 'Product0Name'
                    },
                    lookupfilter: "IsActive=1 AND ProductType=0 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Address',
                    label: 'Địa chỉ dự án',
                    col: 12
                }),
                new TextBoxInput({
                    key: 'Product0Name',
                    label: 'Tên công trình',
                    col: 12
                }),
                new LookupBoxInput({
                    key: 'ProductCostId1',
                    label: 'Gói thầu',
                    lookupKey: 'ProductCost',
                    binding: {
                        //Code: 'Code',
                        Name: 'Name',
                        TerritoryCode: 'TerritoryCode',
                        //ProductCostId0: 'ProductCostId0'
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId0 = '{EXPR=ProductCostId0}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Code',
                    label: 'Mã hạng mục',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'TerritoryCode',
                    label: 'Tỉnh/ thành',
                    lookupKey: 'Territory',
                    lookupfilter: "IsActive=1",
                    validators: [Validators.required],
                    binding: {
                    },
                    hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Name',
                    label: 'Tên hạng mục',
                    validators: [Validators.required],
                    col: 12
                }),
                new TextBoxInput({
                    key: 'InvoiceInfo',
                    label: 'Thông tin xuất hóa đơn',
                    type: 'text',
                    col: 12,
                    validators: [Validators.required]
                }),
            ]
        })
    ];

    childColumns = [
        {
            header: 'Mã cấp bậc',
            binding: 'PositionCode',
            width: 100,
            dataType: 'Array',
            lookupKey: 'Position',
            lookupfilter: "IsGroup=0 AND IsActive=1",
            bindingList: {
                Name: 'PositionName'
            },
            validators: "{EXPR=PositionCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên cấp bậc',
            binding: 'PositionName',
            dataType: 'String',
            width: 230
        },
        {
            header: 'Mã nhân viên',
            binding: 'EmployeeCode',
            width: 100,
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsGroup=0 AND IsActive=1",
            bindingList: {
                Name: 'EmployeeName',
                Tel: 'PhoneNo',
                Email: 'Email'
            },
            validators: "{EXPR=EmployeeCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên nhân viên',
            binding: 'EmployeeName',
            dataType: 'String',
            width: 230
        },
        {
            header: 'Email',
            binding: 'Email',
            dataType: 'String',
            width: 230
        },
        {
            header: 'SĐT',
            binding: 'PhoneNo',
            dataType: 'String',
            width: 100
        },
        {
            header: 'Mã nhóm hàng',
            binding: 'ItemGroupCode',
            width: 200,
            dataType: 'Array',
            lookupKey: 'Item',
            multiSelection: true,
            bindingList: {
                Name: 'ItemGroupName'
            },
            lookupfilter: "IsGroup=1 AND IsActive=1 AND ClassCode3 = 'TM' AND IsShowMenuWeb = 1"
        },
        // {
        //     header: 'Tên nhóm hàng',
        //     binding: 'ItemGroupName',
        //     dataType: 'String',
        //     width: 230
        // },
        {
            header: 'Xem giá',
            binding: 'IsSeePrice',
            dataType: 'Boolean',
            width: 50
        }
    ]

    childColumns1 = [
        // {
        //     header: 'Thời gian',
        //     binding: 'DocDate',
        //     isRequired: true,
        //     width: 100,
        //     dataType: 'Date',
        //     format: 'dd/MM/yyyy'
        // },        
        {
            header: 'Mã nhóm hàng',
            binding: 'ItemGroupCode',
            width: 100,
            dataType: 'Array',
            lookupKey: 'Item',
            bindingList: {
                Name: 'ItemGroupName'
            },
            lookupfilter: "IsGroup=1 AND IsActive=1 AND ClassCode3 = 'TM' AND IsShowMenuWeb = 1",
            validators: "{EXPR=ItemGroupCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên nhóm hàng',
            binding: 'ItemGroupName',
            dataType: 'String',
            width: 250
        },
        {
            header: 'Mã thương hiệu',
            binding: 'TradeMarkCode',
            width: 400,
            dataType: 'Array',
            lookupKey: 'TradeMark',
            multiSelection: true,
            bindingList: {
                Name: 'TradeMarkName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ItemGroupCode = '{EXPR=ItemGroupCode}'",
            validators: "{EXPR=TradeMarkCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        // {
        //     header: 'Tên thương hiệu',
        //     binding: 'TradeMarkName',
        //     dataType: 'String',
        //     width: 0
        // },
        {
            header: 'Hạn mức giá trị mua hàng',
            binding: 'LimitAmount',
            dataType: 'Number',
            width: 200
        }
    ]

    childColumns2 = [
        {
            header: 'Mã nhóm hàng',
            binding: 'ItemGroupCode',
            width: 200,
            dataType: 'Array',
            lookupKey: 'Item',
            bindingList: {
            },
            lookupfilter: "IsGroup=1 AND IsActive=1 AND ClassCode3='TM' AND IsShowMenuWeb = 1",
            validators: "{EXPR=ItemGroupCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Mã hàng',
            binding: 'ItemCode',
            width: 200,
            dataType: 'Array',
            lookupKey: 'Item',
            bindingList: {
                Name: 'ItemName',
                Unit: 'Unit'
            },
            lookupfilter: "ParentId IN (SELECT Id FROM B20Item WHERE Code = '{EXPR=ItemGroupCode}') AND IsActive=1 AND IsGroup=0 AND BranchCode = '{VAR=Branch.Ma_Dvcs}'",
            validators: "{EXPR=ItemCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên mặt hàng',
            binding: 'ItemName',
            dataType: 'String',
            width: 250
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            dataType: 'String',
            width: 80
        },
        {
            header: 'Đơn giá gốc (VNĐ)',
            binding: 'OriginalPrice',
            dataType: 'Number',
            format: 'n2',
            width: 150
        },
        {
            header: 'Ghi chú',
            binding: 'Remark',
            dataType: 'String',
            width: 300
        }
    ]

    childColumns3 = [
        {
            header: 'Mã nhóm hàng',
            binding: 'ItemGroupCode',
            width: 200,
            dataType: 'Array',
            lookupKey: 'Item',
            bindingList: {
            },
            lookupfilter: "IsGroup=1 AND IsActive=1 AND ClassCode3='TM' AND IsShowMenuWeb = 1",
            validators: "{EXPR=ItemGroupCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Mã hàng',
            binding: 'ItemCode',
            width: 300,
            dataType: 'Array',
            lookupKey: 'Item',
            bindingList: {
                Name: 'ItemName',
                //RequireAttribute: 'RequireAttribute',
            },
            lookupfilter: "ParentId IN (SELECT Id FROM B20Item WHERE Code = '{EXPR=ItemGroupCode}') AND IsActive=1 AND IsGroup=0 AND BranchCode = '{VAR=Branch.Ma_Dvcs}'",
            validators: "{EXPR=ItemCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên mặt hàng',
            binding: 'ItemName',
            dataType: 'String',
            width: 500
        },
        // {
        //     header: 'Đặc tả',
        //     binding: 'Description',
        //     dataType: 'String',
        //     width: 150,
        //     validators: "{EXPR=RequireAttribute} == true && {EXPR=Description} == ''",
        //     validatorMessage: 'Không được bỏ trắng giá trị',
        //     ignoreError: 1
        // },
        // {
        //     header: 'Yêu cầu đặc tả',
        //     binding: 'RequireAttribute',
        //     width: 0,
        //     isReadOnly: 'true'
        // },
    ]
}
