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

export class LayoutPermissionCTCExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB20Position',
                FilterKey: "IsActive = 1 AND (BranchCode = '{VAR=Branch.Ma_Dvcs}' OR ISNULL(BranchCode,'') = '')",
                OrderBy: 'Code',
                RowPage: 1000,
                DefaultValues: {
                }
            }
        }
    }

    parentGrid = [
        {
            header: 'Mã chức vụ',
            binding: 'Code',
            width: 200
        },
        {
            header: 'Tên đầy đủ',
            binding: 'Name',
            width: 400,
            dataType: 'String'
        },
        {
            header: 'Bộ phận',
            binding: 'DeptName',
            width: 300,
            dataType: 'String'
        }
    ]
}

export class LayoutPermissionCTCEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB00PositionPermissionWeb_Editor',
                DefaultValues: {
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB00PermissionWebPosition_Editor',
                    ParentKey: 'PositionCode',
                    ChildKey: 'PositionCode',
                    DefaultValues: {
                        UserId: 'Parent.PositionCode'
                    }
                }
            ]
        }
    };

    evaluators = {
        'Evaluator_PositionCode_DefaultFromParent': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'PositionCode',
            Value: 'PositionCode',
            Tables: 0
        },
        'Evaluator_Get_PermissionByPosition': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'Id,PositionCode',
            Command: 'usp_Coteccons_GetB00PermissionWebPosition',
            zExpr: "PositionCode != ''",
            OutputTable: 0
        },
        'Evaluator_LoadData_Child': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'PositionCode',
            Command: 'usp_Web_GetCommandWeb_ForPermissionPosition',
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
                    key: 'PositionCode',
                    label: 'Chức vụ',
                    lookupKey: 'Position',
                    validators: [Validators.required],
                    lookupfilter: "IsActive=1",
                    hideValueMember: false,
                    col: 6,
                }, this.srv, this.parentData)
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
            header: 'PositionCode',
            binding: 'PositionCode',
            width: 0
        }
    ];
}