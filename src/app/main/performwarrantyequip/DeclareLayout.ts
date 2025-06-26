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


export class LayoutPerformWarrantyEquipExplorer implements IExplorerFormulaDeclaration {
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

export class LayoutPerformWarrantyEquipEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30WarrantyEquip_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1,
                    IsGroup: 0,
                    ParentId: -1
                }
            },
            Child: [
                {
                    Name: 'vB30WarrantyEquipDetail_Edit',
                    ParentKey: 'RowId',
                    Sort: 'BuiltinOrder',
                    ChildKey: 'ChildRowid',
                    DefaultValues: {
                        ChildRowid: 'Parent.RowId',
                        BuiltinOrder: '1',
                    }
                }
            ]
        }
    }

    evaluators = {
        'Evaluator_ServerConstraint_LoadData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'EquipCode',
            Command: 'usp_Equip_LoadData',
            OutputTable: 0
        }
    }

    serverConstraint = [

    ]

    serverUpdating = [

    ]

    serverUpdated: string[] = [

    ]

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_LoadData'
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
                    key: 'EquipCode',
                    label: 'Thiết bị',
                    binding: {

                    },
                    lookupKey: 'EquipLookup',
                    lookupfilter: "IsActive=1 AND IsGroup=0",
                    isDisabled: 'true',
                    validators: [Validators.required],
                    col: 6
                }, this.srv, this.parentData),

                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    validators: [Validators.required],
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    isDisabled: 'true',
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),

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
        },
        {
            header: 'Ngày thực hiện',
            binding: 'LastCheckTime',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy HH:mm'
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 500,
            dataType: 'Object'
          
        }
    ]

}
