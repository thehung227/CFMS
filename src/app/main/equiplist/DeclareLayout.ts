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


export class LayoutEquipListExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB20Equip_Explorer',
                FilterKey: "IsActive=1 AND IsGroup=0",
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
            header: 'Nhóm',
            binding: 'ParentCode',
            width: 0,
            dataType: 'String'
        }
    ]
}

export class LayoutEquipListEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB20Equip_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1,
                     IsGroup: 0,
                    ParentId: -1
                }
            },
            Child: [
                {
                    Name: 'vB20EquipDetail_Edit',
                    ParentKey: 'RowId',
                    Sort: 'BuiltinOrder',
                    ChildKey: 'ParentRowId',
                    DefaultValues: {
                        ParentRowId: 'Parent.RowId',
                        BuiltinOrder: '1',
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
                new CheckBoxInput({
                    key: 'IsGroup',
                    label: 'Là nhóm thiết bị',
                    type: 'boolean',
                    validators: [Validators.required],
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'Id_Parent',
                    label: 'Mã nhóm',
                    lookupKey: 'Equip',
                    lookupfilter: "IsActive=1 AND IsGroup=1",
                    binding: {
                        Id: 'ParentId'
                    },
                    hideValueMember: false,
                    isNewRow: true,
                    col: 6
                },this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Code',
                    label: 'Mã thiết bị',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6
                }),
               
                new TextBoxInput({
                    key: 'Name',
                    label: 'Tên thiết bị',
                    validators: [Validators.required],
                    col: 12
                }),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Ghi chú',
                    
                    col: 12
                }),
                new TextBoxInput({
                    key: 'ParentId',
                    label: 'Ghi chú',
                    
                    col: 12,
                    visible: 'false'
                })
            ]
        })
    ];

    childColumns = [
        
        {
            header: 'Stt',
            binding: 'ItemNo',
            dataType: 'String',
            width: 100
        },
        {
            header: 'Nội dung',
            binding: 'Description0',
            dataType: 'String',
            width: 250
        },
        {
            header: 'Lịch bảo trì',
            binding: 'ScheduleCheck',
            dataType: 'Array',
            lookupKey: 'Class',
            bindingList: {
                Name: 'ScheduleName'
            },
            lookupfilter: "ParentCode='SCHELDULE'",
            width: 100
        },
        {
            header: 'Lịch bảo trì',
            binding: 'ScheduleName',
            dataType: 'String',
            width: 200
        },
        {
            header: 'Ghi chú',
            binding: 'Notes',
            dataType: 'String',
            width: 250
        }
    ]

}
