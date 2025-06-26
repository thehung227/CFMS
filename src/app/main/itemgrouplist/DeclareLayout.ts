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

//Danh mục nhóm vật tư hàng hóa
export class LayoutItemGroupListExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB20Item_TMExplorer',//vB20Item_Explore
                FilterKey: "IsActive = 1 AND ClassCode3 = 'TM' AND IsGroup=1 AND (ISNULL(BranchCode,'') = '{VAR=Branch.Ma_Dvcs}' OR ISNULL(BranchCode,'') = '')",
                OrderBy: 'Code',
                RowPage: 50
            }
        }
    }

    parentGrid = [
        {
            header: 'Tên tên nhóm',
            binding: 'Name',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Mã nhóm',
            binding: 'Code',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Mã công việc',
            binding: 'JobCode',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Nhóm',
            binding: 'ItemGroupName',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Id_Bravo',
            binding: 'Id',
            width: 0,
            dataType: 'Number'
        },
        {
            header: 'Loại nhóm',
            binding: 'ItemGroupTypeName',
            width: 0,
            dataType: 'String'
        },
        {
            header: 'Công ty',
            binding: 'BranchCode',
            width: 0,
            dataType: 'String'
        }
    ]
}

export class LayoutItemGroupListEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB20Item_TMEdit',//vB20Item
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1,
                    ClassCode3: 'TM',
                    IsGroup: 1,
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
        'Evaluator_ServerConstraint_Check_CodeUnique': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'Code,{VAR=ColumnName_Code},{VAR=TableName_B20Item},Id,CreatedAt',
            Command: 'usp_COTECCONS_UniqueCatg',
            MessageText: 'Mã - đã có giá trị tương tự',
            IgnoreError: 0
        },
    }

    serverConstraint = [

    ]

    serverUpdating = [
        'Evaluator_ServerConstraint_Check_CodeUnique'
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
                    key: 'ItemGroupType',
                    label: 'Loại nhóm hàng',
                    lookupKey: 'Class',
                    lookupfilter: "IsActive=1 AND ParentCode='TMCtc_ItemGroupType'",
                    hideValueMember: true,
                    binding: {
                    },
                    col: 6,
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Code',
                    label: 'Mã nhóm',
                    validators: [Validators.required],
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Name',
                    label: 'Tên nhóm',
                    validators: [Validators.required],
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'IsShowMenuWeb',
                    label: 'Hiển thị menu đặt hàng',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'GenusList',
                    label: 'Chủng loại',
                    col: 12
                }),
                new TextBoxInput({
                    key: 'SizeList',
                    label: 'Kích thước',
                    col: 12
                }),
                new LookupBoxInput({
                    key: 'JobCode',
                    label: 'Công việc',
                    lookupKey: 'Job',
                    lookupfilter: "IsActive=1 AND IsGroup=0",
                    hideValueMember: true,
                    binding: {
                    },
                    col: 6,
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ItemGroupCode',
                    label: 'Nhóm hàng',
                    lookupKey: 'ItemGroup',
                    lookupfilter: "IsActive=1 AND IsGroup=0 AND Code LIKE 'Z%'",
                    hideValueMember: true,
                    binding: {
                    },
                    col: 6,
                }, this.srv, this.parentData),
                new UploadImage({
                    key: 'ImagePath',
                    label: 'Hình ảnh',
                    col: 6
                }, this.srv)
            ]
        })
    ];

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