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

// Danh mục thương hiệu
export class LayoutTradeMarkExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB20TradeMark',
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
            header: 'Mã thương hiệu',
            binding: 'Code',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Tên thương hiệu',
            binding: 'Name',
            width: 300,
            dataType: 'String'
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

export class LayoutTradeMarkEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB20TradeMark',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1,
                    IsGroup: 0,
                    ParentId: -1
                }
            },
            Child: [
                {
                    Name: 'B30BizDocSalesman',
                    ParentKey: 'Id',
                    ChildKey: 'ParentId',
                    DefaultValues: {
                    }
                }
            ]
        }
    }

    evaluators = {
        'Evaluator_ServerConstraint_Check_CodeUnique': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'Code,{VAR=ColumnName_Code},{VAR=TableName_B20TradeMark},Id,CreatedAt',
            Command: 'usp_COTECCONS_UniqueCatg',
            MessageText: 'Mã - đã có giá trị tương tự',
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
                new TextBoxInput({
                    key: 'Code',
                    label: 'Mã thương hiệu',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12
                }),
                new TextBoxInput({
                    key: 'Name',
                    label: 'Tên thương hiệu',
                    validators: [Validators.required],
                    col: 12
                }),
                new LookupBoxInput({
                    key: 'ItemGroupCode',
                    label: 'Nhóm hàng',
                    lookupKey: 'Item',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ParentId IN (3203,3205)",
                    validators: [Validators.required],
                    hideValueMember: true,
                    binding: {
                    },
                    col: 12
                }, this.srv, this.parentData)
            ]
        })
    ];

    childColumns = [
        {
            header: 'Cột Id',
            binding: 'Id',
            dataType: 'Number',
            format: 'n0',
            width: 0
        }
    ]
}