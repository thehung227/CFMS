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

// ************************* KHÁC
// Form mail
export class LayoutEmailTemplateExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'B00EmailTemplate',
                FilterKey: "IsActive = 1",
                OrderBy: 'Id',
                RowPage: 500
            }
        }
    }

    parentGrid = [
        {
            header: 'Tham số gửi mail',
            binding: 'HrmEmailProfileCode',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            width: 400,
            dataType: 'String'
        }
    ]
}

export class LayoutEmailTemplateEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'B00EmailTemplate',
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
                new LookupBoxInput({
                    key: 'HrmEmailProfileCode',
                    label: 'Tham số gửi mail',
                    lookupKey: 'HrmEmailProfile',
                    lookupfilter: "IsActive=1",
                    validators: [Validators.required],
                    binding: {
                    },
                    col: 12,
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CommandWeb',
                    label: 'Chứng từ gửi mail',
                    lookupKey: 'CommandWeb',
                    lookupfilter: "IsActive=1",
                    validators: [Validators.required],
                    binding: {
                    },
                    col: 6,
                }, this.srv, this.parentData),
                new DateBoxInput({
                    key: 'EffectiveDate',
                    label: 'Ngày áp dụng',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Diễn giải',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12
                }),
                new TextBoxInput({
                    key: 'NameSend',
                    label: 'Tên người gửi',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Cc',
                    label: 'Cc',
                    type: 'text',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Bcc',
                    label: 'Bcc',
                    type: 'text',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'FilePath',
                    label: 'Tên file email mẫu',
                    type: 'text',
                    col: 6
                }),
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'Thư mẫu',
                //     col: 6
                // }, this.srv),
                new CheckBoxInput({
                    key: 'IsAdjust',
                    label: 'Có điều chỉnh',
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'IsAttachFile',
                    label: 'Đính kèm chứng từ',
                    col: 6
                }),
                // new CheckBoxInput({
                //     key: 'IsConfirm',
                //     label: 'Xác nhận thư',
                //     col: 6
                // }),
            ]
        })
    ];
    width: 250
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

