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

// Danh mục đơn vị nhận hàng
export class LayoutReceiptTeamExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB20ReceiptTeam',
                FilterKey: "IsActive = 1",
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
            header: 'Mã đơn vị',
            binding: 'Code',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Tên đơn vị nhận hàng',
            binding: 'Name',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Nhóm hàng',
            binding: 'ItemGroupName',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Gói thầu',
            binding: 'TenGoiThau',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Đã khóa',
            binding: 'Lock',
            width: 100,
            dataType: 'Boolean'
        },
        {
            header: 'Công ty',
            binding: 'BranchCode',
            width: 0,
            dataType: 'String'
        },
        {
            header: 'Id_Bravo',
            binding: 'Id',
            width: 0,
            dataType: 'Number'
        }
    ]
}

export class LayoutReceiptTeamEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB20ReceiptTeam',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB20ReceiptTeamDetail_Edit',
                    ParentKey: 'Code',
                    ChildKey: 'ParentCode',
                    DefaultValues: {
                    }
                }
            ]
        }
    }

    evaluators = {
        'Evaluator_ServerConstraint_Check_CodeUnique': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'Code,{VAR=ColumnName_Code},{VAR=TableName_B20ReceiptTeam},Id,CreatedAt',
            Command: 'usp_COTECCONS_UniqueCatg',
            MessageText: 'Mã đơn vị đã có giá trị tương tự',
            IgnoreError: 0
        },
    }

    serverConstraint = [

    ]

    serverUpdating = [
        'Evaluator_ServerConstraint_Check_CodeUnique'
    ]

    serverUpdated: string[] = [

    ]

    buttonLoadChild: string[] = [

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
                    lookupKey: 'Project0',
                    binding: {
                    },
                    lookupfilter: "IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' ",
                    validators: [Validators.required],
                    hideValueMember: true,
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
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'ProductCostId',
                //     label: 'Hạng mục',
                //     lookupKey: 'Project2',
                //     binding: {
                //     },
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId1 = '{EXPR=ProductCostId1}'",
                //     hideValueMember: true,
                //     col: 12
                // }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ItemGroupCode',
                    label: 'Nhóm hàng',
                    lookupKey: 'Item',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ClassCode3= 'TM'",
                    validators: [Validators.required],
                    binding: {
                    },
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Code',
                    label: 'Mã đơn vị',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12
                }),
                new TextBoxInput({
                    key: 'Name',
                    label: 'Tên đơn vị nhận hàng',
                    validators: [Validators.required],
                    col: 12
                }),
                new CheckBoxInput({
                    key: 'Lock',
                    label: 'Khóa',
                    col: 6
                }),
            ]
        })
    ];

    childColumns = [
        {
            header: 'Tên người nhận hàng',
            binding: 'Name',
            dataType: 'String',
            width: 300,
            validators: "{EXPR=Name} == ''",
            validatorMessage: 'Người nhận hàng không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Điện thoại',
            binding: 'Phone',
            dataType: 'String',
            width: 200
        },
        {
            header: 'Chức vụ',
            binding: 'Position',
            dataType: 'String',
            width: 300
        }
    ]
}