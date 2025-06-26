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

export class LayoutDebtCollection2PopupExplorer implements IExplorerFormulaDeclaration {

    layout = {
        Structure: {
            Parent: {
                Name: 'vB20DebtDetail1',
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

export class LayoutDebtCollection2PopupEditor implements IEditorFormulaDeclaration {
    buttonLoadChild: string[];
    constructor(private srv?: any,
        private parentData?: any) {
    }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB20DebtDetail2',
                DefaultValues: {
                }
            },
            Child: [
                {
                    Name: 'B20DebtDetailPhys2',
                    ParentKey: 'RowId',
                    ChildKey: 'RowId_SourceDoc',
                    Sort: '',
                    DefaultValues: {
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1'
                       
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
            header: 'Cam kết ký PLHĐ chốt phát sinh'	,
            binding: 'DatePS',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:120
        },
    
        {
            header: 'Cam kết TOC'	,
            binding: 'DateTOC',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:120							
        },
      
        {
            header: 'Cam kết ký QT/Xuất HĐ'	,
            binding: 'DateQT',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:120							
        },
      
        {
            header: 'Ngày cam kết thu hồi công nợ'	,
            binding: 'CommitmentDate',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:140					
        },
        
       
    ];

}