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

// Danh mục tiêu chuẩn
export class LayoutBaremListExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB20Barem_Explorer',
                FilterKey: "IsActive = 1 AND ISNULL(BranchCode,'') = '{VAR=Branch.Ma_Dvcs}'",
                OrderBy: 'Id', //rất quan trọng, lỗi méo tìm đc đâu
                RowPage: 50
            }
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'KLTT ĐTC- {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            LayoutPrint: [],
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'ItemNo',
                    width: 70,
                    dataType: 'String'
                },
                {
                    header: 'Giá trị thực hiện',
                    binding: 'Amount_Th',
                    width: 110,
                    dataType: 'Number'
                }
            ]
        }
    }

    lookup3 = {
        Table: 'B00TMCtcDocStatus',
        Filter: "CommandWeb = 'rowsPage'",
    }

    parentGrid = [
        {
            header: 'Mã đối tượng',
            binding: 'CustomerCode',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Tên đối tượng',
            binding: 'CustomerName',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Nhóm hàng',
            binding: 'ItemGroupCode',
            width: 0,
            dataType: 'String'
        },
        {
            header: 'Công ty',
            binding: 'BranchCode',
            width: 0,
            dataType: 'String'
        },
        {
            header: 'Id_Bravo',
            binding: 'Id',
            width: 0,
            dataType: 'Number'
        }
    ]
}

export class LayoutBaremListEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB20Barem_Editor',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1,
                    IsGroup: 0,
                    ParentId: -1
                }
            },
            Child: [
                {
                    Name: 'vB20BaremDetail_Editor',
                    ParentKey: 'RowId',
                    ChildKey: 'ParentRowId',
                    DefaultValues: {
                        ParentId: -1,
                        Id: -1,
                        BuiltinOrder: 1,
                        CustomerCode: 'Parent.CustomerCode'
                    }
                },
                {
                    Name: 'vB20BaremDetailRound_Editor',
                    ParentKey: 'RowId',
                    ChildKey: 'ParentRowId',
                    DefaultValues: {
                    }
                }
            ]
        }
    }

    evaluators = {
        // 'Evaluator_ServerUpdated_BaremDetail_UpdateFromParent': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: 'BizDocId',
        //     Command: ''
        // }
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
                    key: 'CustomerCode',
                    label: 'Đối tượng',
                    lookupKey: 'Customer_CCM2',
                    binding: {
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    type: 'text',
                    col: 12
                }),
                new LookupBoxInput({
                    key: 'ItemGroupCode',
                    label: 'Nhóm hàng',
                    lookupKey: 'Item',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ParentId IN (3203,3205)",
                    validators: [Validators.required],
                    hideValueMember: true,
                    binding: {
                    },
                    col: 12
                }, this.srv, this.parentData)
            ]
        })
    ];

    childColumns = [
        {
            header: 'Phi thép',
            binding: 'PhiThep',
            dataType: 'String',
            width: 100,
            validators: "{EXPR=PhiThep} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Trọng lượng',
            binding: 'Weight',
            dataType: 'Number',
            format: 'n4',
            width: 100
        }
    ];

    childColumns1 = [
        {
            header: 'Phi thép',
            binding: 'PhiThep',
            dataType: 'String',
            width: 100,
            validators: "{EXPR=PhiThep} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Mã thương hiệu',
            binding: 'TradeMarkCode',
            width: 400,
            dataType: 'Array',
            lookupKey: 'TradeMark',
            lookupfilter: "IsGroup=0 AND IsActive=1",
            validators: "{EXPR=TradeMarkCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Số lượng',
            binding: 'Quantity',
            dataType: 'Number',
            format: 'n2',
            width: 100
        }
    ]
}