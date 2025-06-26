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

// Danh mục vật tư, hàng hóa
export class LayoutPriceLibraryExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'B20PriceLibrary',
                FilterKey: "IsActive=1 AND IsGroup=0",
                OrderBy: 'Code',
                RowPage: 100
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

    // lookup1 = {
    //     Table: 'vB20Item_MenuFilter',
    //     Filter: "IsGroup=1 AND IsActive=1 AND ClassCode3 = 'TM'",
    //     ColumnFilter: 'ParentCode'
    // }

    // lookup3 = {
    //     Table: 'B00TMCtcDocStatus',
    //     Filter: "CommandWeb = 'rowsPage'",
    // }

    parentGrid = [
        {
            header: 'Mã',
            binding: 'Code',
            width: 180,
            dataType: 'String'
        },
        {
            header: 'Tên',
            binding: 'Name',
            width: 700,
            dataType: 'String'
        },
        {
            header: 'Thuộc tính 1',
            binding: 'Properties01',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Thuộc tính 2',
            binding: 'Properties02',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Thuộc tính 3',
            binding: 'Properties03',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Thuộc tính 4',
            binding: 'Properties04',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Thuộc tính 5',
            binding: 'Properties05',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Thuộc tính 6',
            binding: 'Properties06',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Thuộc tính 7',
            binding: 'Properties07',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Thuộc tính 8',
            binding: 'Properties08',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Thuộc tính 9',
            binding: 'Properties09',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Thuộc tính 10',
            binding: 'Properties10',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Id_',
            binding: 'Id',
            width: 0,
            dataType: 'Number'
        }
    ]
}

export class LayoutPriceLibraryEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'B20PriceLibrary',//vB20Item_TMEdit
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1,
                    ItemType: '2',
                    ConvertRate0: 1,
                    IsShowMenuWeb: 1,
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
       

    }

    serverConstraint = [

    ]

    serverUpdating = [
       
    ]

    serverUpdated: string[] = [
      
    ]

    buttonLoadChild: string[] = [
        // 'Evaluator_ServerConstraint_CreateItemName_GachOpLat',
        // 'Evaluator_ServerConstraint_CreateItemName_OngThep'
    ];

    buttonCommand: string[] = [

    ]

    importCommand: string[] = [

    ]

    columnChanged = {
       
    };

    columnChangedChild = [
        // {
        //     Tables: 0,
        //     columnChanged: {
        //     }
        // }
    ];

    columnsReadOnly = [];

    panels: PanelBase[] = [
        new TablePanel({
            label: 'Panel 1',
            col: 12,
            controls: [
                new TextBoxInput({
                    key: 'Code',
                    label: 'Mã',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Name',
                    label: 'Tên',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12,
                    isNewRow: true
                }),
                new TextBoxInput({
                    key: 'Properties01',
                    label: 'Thuộc tính 1',
                    type: 'text',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Properties02',
                    label: 'Thuộc tính 2',
                    type: 'text',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Properties03',
                    label: 'Thuộc tính 3',
                    type: 'text',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Properties04',
                    label: 'Thuộc tính 4',
                    type: 'text',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Properties05',
                    label: 'Thuộc tính 5',
                    type: 'text',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Properties06',
                    label: 'Thuộc tính 6',
                    type: 'text',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Properties07',
                    label: 'Thuộc tính 7',
                    type: 'text',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Properties08',
                    label: 'Thuộc tính 8',
                    type: 'text',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Properties09',
                    label: 'Thuộc tính 9',
                    type: 'text',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Properties10',
                    label: 'Thuộc tính 10',
                    type: 'text',
                    col: 6
                }),
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