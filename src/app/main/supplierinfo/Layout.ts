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

//Danh mục người liên hệ
export class LayoutSupplierInfoExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB20SupplierInfo',
                FilterKey: "IsActive=1",
                OrderBy: 'ItemGroupName DESC, CustomerCode',
                RowPage: 100
            }
        }
    }

    parentGrid = [
        // {
        //     header: 'Mã nhà cung cấp',
        //     binding: 'CustomerCode',
        //     width: 120,
        //     dataType: 'String'
        // },
        {
            header: 'Tên nhà cung cấp',
            binding: 'CustomerName',
            width: 500,
            dataType: 'String'
        },
        {
            header: 'Tên viết tắt',
            binding: 'ShortName',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Người liên hệ',
            binding: 'ContactPerson',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Điện thoại',
            binding: 'PhoneNo',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'E-mail',
            binding: 'Email',
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
            header: 'Id_',
            binding: 'Id',
            width: 0,
            dataType: 'Number'
        }
    ]
}

export class LayoutSupplierInfoEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB20SupplierInfo',
                DefaultValues: {
                    Id: -1,
                    IsGroup: 0,
                    ParentId: -1,
                    BranchCode: '{VAR=Branch.Ma_Dvcs}'
                }
            },
            Child: [
                {
                    Name: 'vB20SupplierInfoDetail_Edit',
                    ParentKey: 'Id',
                    ChildKey: 'ParentId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BuiltinOrder: '1'
                    }
                }
            ]
        }
    }

    evaluators = {
        'Evaluator_ServerConstraint_Check_Duplicate': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'CustomerCode,ItemGroupCode,Id',
            Command: 'ufn_TMCtc_CheckSupplierInfo_Duplicate',
            MessageText: 'Thông tin người liên hệ theo nhóm hàng đã tồn tại',
            IgnoreError: 0
        }
    }

    serverConstraint = [

    ]

    serverUpdating = [
        'Evaluator_ServerConstraint_Check_Duplicate'
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
                    label: 'Nhà cung cấp',
                    lookupKey: 'Customer_CCM2',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
                    validators: [Validators.required],
                    binding: {
                        Name: 'CustomerName',
                        Address: 'Address'
                    },
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'CustomerName',
                    label: 'Tên nhà cung cấp',
                    isDisabled: 'true',
                    col: 12
                }),
                new TextBoxInput({
                    key: 'CustomerAddress',
                    label: 'Địa chỉ',
                    isDisabled: 'true',
                    col: 12
                }),
                new TextBoxInput({
                    key: 'ShortName',
                    label: 'Tên viết tắt',
                    col: 12
                }),
                new LookupBoxInput({
                    key: 'ItemGroupCode',
                    label: 'Nhóm hàng',
                    lookupKey: 'Item',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ParentId IN (3203,3205,3977,3978)",
                    validators: [Validators.required],
                    hideValueMember: true,
                    binding: {
                    },
                    col: 6
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'ContactPerson',
                    label: 'Người liên hệ',
                    col: 6,
                    validators: [Validators.required]
                }),
                new TextBoxInput({
                    key: 'PhoneNo',
                    label: 'Số điện thoại',
                    col: 6,
                    validators: [Validators.required]
                }),
                new TextBoxInput({
                    key: 'Email',
                    label: 'Email To',
                    col: 6,
                    validators: [Validators.required]
                }),
                new TextBoxInput({
                    key: 'EmailCc',
                    label: 'Email Cc',
                    col: 6
                })
            ]
        })
    ];

    childColumns = [
        {
            header: 'Gói thầu',
            dataType: 'Array',
            binding: 'ProductCostId',
            lookupKey: 'ProductCost',
            bindingList: {
                ProductCostInfo: 'ProductName'
            },
            lookupfilter: "ProductType IN (1,3) AND IsGroup = 0 AND IsActive = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}'",
            hideValueMember: true,
            width: 150
        },
        {
            header: 'Tên gói thầu',
            binding: 'ProductName',
            width: 400
        },
        {
            header: 'Người liên hệ',
            binding: 'ContactPerson',
            width: 200
        },
        {
            header: 'Email To',
            binding: 'Email',
            width: 200
        },
        {
            header: 'Email Cc',
            binding: 'EmailCc',
            width: 200
        },
        {
            header: 'Số điện thoại',
            binding: 'PhoneNo',
            width: 200
        }
    ]
}