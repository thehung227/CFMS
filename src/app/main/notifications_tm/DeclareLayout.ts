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

export class LayoutNotifications_TmExplorer implements IExplorerFormulaDeclaration {
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
            parameter: { 'Commandkey': 'purchasingnote-editor', 'ProductCostId0': '{EXPR=ProductCostId0}', 'ProductCostId1': '{EXPR=ProductCostId1}', 'ProductCostId': '{EXPR=ProductCostId}', 'BizDocId_PO': '{EXPR=BizDocId}', 'CustomerCode': '{EXPR=CustomerCode}', 'ProcessCode': '{EXPR=ProcessCode}', 'ItemGroupCode': '{EXPR=ItemGroupCode}' }
        }
    }

    parentGrid = [
        {
            header: 'Loại hồ sơ',
            binding: 'Ten_Ct',
            width: 200
        },
        {
            header: 'Nhóm hàng',
            binding: 'ItemGroupCode',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Nhà cung cấp',
            binding: 'CustomerName',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Số đề nghị',
            binding: 'DocNoPP',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Ngày lập',
            binding: 'DocDatePP',
            format: 'dd/MM/yyyy',
            width: 120
        },
        {
            header: 'Số đơn hàng',
            binding: 'DocNo',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Ngày lập đơn',
            binding: 'DocDate',
            format: 'dd/MM/yyyy',
            width: 120
        },
        {
            header: 'Gói thầu',
            binding: 'ProductName',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Thời gian đến hạn',
            binding: 'StartDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy HH:mm',
            width: 130
        },
        {
            header: 'Thời hạn (giờ)',
            binding: 'DayOfDelay',
            dataType: 'Number',
            format: 'n0',
            width: 120
        },
        {
            header: 'Id hồ sơ',
            binding: 'Id',
            width: 0
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
