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

export class LayoutPlanCostRevConsPopupExplorer implements IExplorerFormulaDeclaration {

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

export class LayoutPlanCostRevConsPopupEditor implements IEditorFormulaDeclaration {
    buttonLoadChild: string[];
    constructor(private srv?: any,
        private parentData?: any) {
    }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30CCMBudgetDetail_Edit',
                DefaultValues: {
                }
            },
            Child: [
                {
                    Name: 'B30CCMBudgetOption',
                    ParentKey: 'RowId',
                    ChildKey: 'RowId_SourceDoc',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        CCMBudgetId: 'Parent.CCMBudgetId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                    }
                }
            ]
        }
    };

    evaluators: {};

    buttonCommand: string[];
    serverConstraint: string[];
    serverUpdated: string[];
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
                    key: 'CCMBudgetId',
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
            header: 'Ngày điều chỉnh',
            binding: 'DocDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            width: 100
        },
        {
            header: 'Diễn giải',
            binding: 'Description',
            width: 300
        },
        {
            header: 'Giá trị điều chỉnh',
            binding: 'Amount',
            dataType: 'Number',
            width: 150
        }
    ];

}