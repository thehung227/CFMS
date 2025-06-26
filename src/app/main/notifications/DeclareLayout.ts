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

// *************************NOTIFICATIONS
export class LayoutNotificationsExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: '',
                FilterKey: "",
                OrderBy: '',
                RowPage: 50
            }
        },
        CopiedValues: {
            parameter: { 'Commandkey': 'purchasingnote-editor', 'ProductCostId0': '{EXPR=ProductCostId0}', 'ProductCostId1': '{EXPR=ProductCostId}', 'ProductCostId': '{EXPR=ProductCostId1}', 'BizDocId_PO': '{EXPR=BizDocId}', 'CustomerCode': '{EXPR=CustomerCode}' }
        }
    }

    parentGrid = [
        {
            header: 'Loại hồ sơ',
            binding: 'Ten_Ct',
            width: 300,
            align: 'left'
        },
        {
            header: 'Đối tượng',
            binding: 'CustomerName',
            width: 300
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            width: 300
        },
        {
            header: 'Đợt TT',
            binding: 'PayRequireNum',
            width: 80
        },
        {
            header: 'Giá trị đề nghị',
            binding: 'Amount_DeNghiTT',
            dataType: 'Number',
            format: 'n0',
            width: 150
        },
        {
            header: 'Ngày trưởng đơn vị duyệt',
            binding: 'Ngay_Truong_Don_Vi',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            width: 0
        },
        {
            header: 'Ngày đến hạn',
            binding: 'StartDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            width: 120
        },
        {
            header: 'Người lập hồ sơ',
            binding: 'EmployeeNameSend',
            width: 150
        },
        {
            header: 'Người đã duyệt',
            binding: 'EmployeeNameCur',
            width: 150
        },
        {
            header: 'Người duyệt tiếp',
            binding: 'EmployeeNameNext',
            width: 150
        },
        {
            header: 'Số hồ sơ',
            binding: 'DocNo',
            width: 150
        },
        {
            header: '_Id',
            binding: 'Id',
            width: 90
        },
        {
            header: 'Kiểu hồ sơ',
            binding: 'DocType',
            width: 0
        },
      
        // {
        //     header: 'Link',
        //     binding: '_LinkCommandWeb',
        //     width: 0
        // }
    ]
}

export class LayoutNotificationsEditor implements IEditorFormulaDeclaration {

    buttonLoadChild: string[];
    evaluators: any;
    buttonCommand: string[];
    serverConstraint: string[];
    serverUpdated: string[];
    serverUpdating: string[];
    columnChanged: any;
    columnsReadOnly: string[];
    layout: any;
    panels: PanelBase[];
    childColumns: { header?: string; binding?: string; dataType?: string; format?: string; width?: number; }[];
    linkReporter: any;
    constructor(private srv?: any,
        private parentData?: any) { }

}
