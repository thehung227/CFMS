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

export class LayoutImWareMaterialsPopupExplorer implements IExplorerFormulaDeclaration {

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30CCMBudgetDetail_Edit',
                FilterKey: "1=1",
                OrderBy: 'Id',
                RowPage: 50
            }
        }
    }

    parentGrid = [
        {
            header: 'Id',
            binding: 'Id',
            width: 50,
            dataType: 'Number'
        }

    ]
}

export class LayoutImWareMaterialsPopupEditor implements IEditorFormulaDeclaration {
    buttonLoadChild: string[];
    constructor(private srv?: any,
        private parentData?: any) {
    }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30AccDocEquipInventory_Edit',
                DefaultValues: {
                }
            },
            Child: [
                {
                    Name: 'vB30AccDocEquipInventoryPhys',
                    ParentKey: 'RowId',
                    ChildKey: 'RowId_SourceDoc',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1',
                        DocCode: 'Parent.DocCode',
                        DocDate: 'Parent.DocDate',
                    }
                }
            ]
        }
    };

    evaluators = {
        'Evaluator_ServerUpdated_UpdateWhenSave': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'RowId',
            Command: 'usp_B30AccDocEquipInventory_WhenSave'
        },
    };

    buttonCommand: string[];
    serverConstraint: string[];
    serverUpdated = [
        'Evaluator_ServerUpdated_UpdateWhenSave'
    ];
    columnChanged: any;
    columnsReadOnly: string[];
    linkReporter: any;
    serverUpdating: string[] = []



    panels: PanelBase[] = [
        new TablePanel({
            label: 'Panel 1',
            col: 12,
            controls: [
                new TextBoxInput({
                    key: 'RowId',
                    label: '',
                    validators: [Validators.required],
                    isReadOnly: 'true',
                    style: 'display:none;',
                    isUsingLabel: false,
                    col: 12,
                })
            ]
        })
    ];

    childColumns = [
        {
            header: 'Ngày thực tế',
            binding: 'WarehouseDate',
           
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false	
        },
        
        {
            header: 'Số lượng nhập kho',
            binding: 'Quantity',
            dataType: 'Number',
            width: 150,
            format: 'n2'
        },
        {
            header: 'Ghi chú',
            binding: 'Description',
            width: 300
        },
    ];

}