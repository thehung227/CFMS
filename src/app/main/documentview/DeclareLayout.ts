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

// Form xem tài liệu
export class LayoutDocumentViewExplorer implements IExplorerFormulaDeclaration {
    layout: any;
    parentGrid: any;
}

export class LayoutDocumentViewEditor implements IEditorFormulaDeclaration {
    evaluators: any;
    buttonCommand: string[];
    buttonLoadChild: string[];
    serverConstraint: string[];
    serverUpdated: string[];
    serverUpdating: string[];
    columnChanged: any;
    columnsReadOnly: string[];
    layout: any;
    panels: PanelBase[];
    linkReporter: any;
    constructor(private srv?: any,
        private parentData?: any) { }
}