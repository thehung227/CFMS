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

// *********************************PHÂN QUYỀN

export class LayoutPermissionExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB00UserList_Web',
                FilterKey: "(BranchCode = '{VAR=Branch.Ma_Dvcs}' OR ISNULL(BranchCode,'') = '') AND ParentId > 1 AND UserName <> 'dev'",
                OrderBy: 'OrderByUser',
                RowPage: 2000,
                DefaultValues: {
                }
            }
        }
    }

    parentGrid = [
        {
            header: 'Người sử dụng',
            binding: 'UserNameDisplay',
            width: 200
        },
        {
            header: 'Tên đầy đủ',
            binding: 'FullName',
            width: 400,
            dataType: 'String'
        },
        {
            header: 'Tên nhân viên',
            binding: 'EmployeeName',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Email',
            binding: 'Email',
            width: 300,
            dataType: 'String'
        }
    ]
}

export class LayoutPermissionEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB00UserPermissionWeb_Editor',
                DefaultValues: {
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB00PermissionWeb_Editor',
                    ParentKey: 'Id',
                    ChildKey: 'ParentId',
                    DefaultValues: {
                        UserId: 'Parent.UserId'
                    }
                }
            ]
        }
    };

    evaluators = {
        'Evaluator_UserId_DefaultFromParent': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'UserId',
            Value: 'UserId',
            Tables: 0
        },
        'Evaluator_Get_PermissionByUser': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'Id,UserId',
            Command: 'usp_Coteccons_GetB00PermissionWeb',
            zExpr: 'UserId > 0',
            OutputTable: 0
        },
        'Evaluator_LoadData_Child': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'UserId',
            Command: 'usp_Web_GetCommandWeb_ForPermission',
            OutputTable: 0
        },
    };

    serverConstraint = [

    ];

    serverUpdating = [

    ]

    serverUpdated = [];

    buttonLoadChild: string[] = [
        'Evaluator_LoadData_Child'
    ];

    buttonCommand: string[] = [

    ];

    importCommand: string[] = [

    ]

    columnChanged = {

    };

    columnChangedChild = [
    ];

    rowAdded = [
        {
            Tables: 0,
            Evaluators: [
                'Evaluator_UserId_DefaultFromParent'
            ]
        }
    ]
    //Không dùng
    columnsReadOnly = [];

    linkReporter = {

    }

    panels: PanelBase[] = [
        new TablePanel({
            label: 'Panel 1',
            col: 12,
            controls: [
                new LookupBoxInput({
                    key: 'UserName',
                    label: 'Người dùng',
                    lookupKey: 'UserListWeb',
                    validators: [Validators.required],
                    lookupfilter: "IsActive=1",
                    binding: {
                        Id: 'UserId',
                        IsGroup: 'IsGroup'
                    },
                    hideValueMember: false,
                    col: 6,
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'UserId',
                    label: 'UserId',
                    col: 6,
                    isDisabled: 'true'
                }),
                // new TextBoxInput({
                //     key: 'Description',
                //     label: 'Nội dung',
                //     type: 'text',
                //     col: 12,
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // })

            ]
        })
    ];

    childColumns = [
        {
            header: 'CommandId',
            binding: 'CommandId',
            width: 0,
            isReadOnly: 'true'
        },
        {
            header: 'CommandKey',
            binding: 'CommandKey',
            dataType: 'Array',
            lookupKey: 'CommandWeb',
            lookupfilter: "IsActive=1",
            bindingList: {
                Id: 'CommandId',
                Text: 'Text'
            },
            width: 250
        },
        {
            header: 'Text',
            binding: 'Text',
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Xem',
            binding: 'IsDisplay',
            dataType: 'Boolean',
            checkAll: true,
            width: 100
        },
        {
            header: 'Tạo mới',
            binding: 'IsAddNew',
            dataType: 'Boolean',
            checkAll: true,
            width: 100
        },
        {
            header: 'Cập nhật',
            binding: 'IsEdit',
            dataType: 'Boolean',
            checkAll: true,
            width: 100
        },
        {
            header: 'Xóa',
            binding: 'IsDelete',
            dataType: 'Boolean',
            checkAll: true,
            width: 100
        },
        {
            header: 'Lưu',
            binding: 'IsSave',
            dataType: 'Boolean',
            checkAll: true,
            width: 100
        },
        {
            header: 'Gửi duyệt',
            binding: 'IsApprove',
            dataType: 'Boolean',
            checkAll: true,
            width: 100
        },
        // {
        //     header: 'Khôi phục',
        //     binding: 'IsRecall',
        //     dataType: 'Boolean',
        //     width: 100
        // },
        {
            header: 'In ấn',
            binding: 'IsPrint',
            dataType: 'Boolean',
            checkAll: true,
            width: 100
        },
        // {
        //     header: 'Kết xuất',
        //     binding: 'IsExport',
        //     dataType: 'Boolean',
        //     checkAll: true,
        //     width: 100
        // },
        {
            header: 'UserId',
            binding: 'UserId',
            width: 0,
            dataType: 'Number'
        }
    ];
}
