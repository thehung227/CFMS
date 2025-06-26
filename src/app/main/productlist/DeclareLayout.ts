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


export class LayoutProductListExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'B20Product',
                FilterKey: "IsActive=1 AND IsGroup=0 AND ProductType='1'",
                OrderBy: 'Code',
                RowPage: 500
            }
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'KLTT ĐTC- {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
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
            header: 'Tên',
            binding: 'Name',
            width: 400,
            dataType: 'String'
        },
        {
            header: 'Mã',
            binding: 'Code',
            width: 130,
            dataType: 'String'
        }
    ]
}

export class LayoutProductListEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'B20Product',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1,
                     IsGroup: 0,
                    ParentId: -1
                }
            },
            Child: [
                {
                    Name: 'vB20ProductEquip_Edit',
                    ParentKey: 'RowId',
                    Sort: 'BuiltinOrder',
                    ChildKey: 'ParentRowId',
                    DefaultValues: {
                        ParentRowId: 'Parent.RowId',
                        BuiltinOrder: '1',
                    }
                },
                {
                    Name: 'vB30BizDocContactInfo_Edit',
                    ParentKey: 'RowId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.RowId',
                        BuiltinOrder: '1',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                } 
            ]
        }
    }

    evaluators = {
        'Evaluator_SendMail': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'RowId',
            Command: 'usp_Newtecons_SendMail'
        },
    }

    serverConstraint = [
        
    ]

    serverUpdating = [

    ]

    serverUpdated: string[] = [
        'Evaluator_SendMail'
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
               
                new TextBoxInput({
                    key: 'Code',
                    label: 'Mã dự án',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6
                }),
               
                new TextBoxInput({
                    key: 'Name',
                    label: 'Tên dự án',
                    validators: [Validators.required],
                    col: 12
                }),
                new DateBoxInput({
                    key: 'WarrantyStartDate',
                    label: 'Ngày bắt đầu bảo hành',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
               
            ]
        })
    ];

    childColumns = [
        
        {
            header: 'Stt',
            binding: 'ItemNo',
            dataType: 'String',
            width: 100
        },
        {
            header: 'Thiết bị',
            binding: 'EquipCode',
            dataType: 'Array',
            lookupKey: 'EquipLookup',
            bindingList: {
                Name: 'EquipName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1",
            width: 100
        },
        {
            header: 'Thiết bị',
            binding: 'EquipName',
            dataType: 'String',
           
            width: 150
        },
        {
            header: 'Ghi chú',
            binding: 'Description',
            dataType: 'String',
            width: 250
        },
        {
            header: 'Click',
            binding: 'BtnBOQ',
            
            dataType: 'Object',
            isButton: true,
            textButton: '...',
            width: 70,
            linkCommand: {
                directory: 'equipproduct',
                type: 'detail',
                key: 'Id',
                parameter: { 'Commandkey': 'equipproduct-editor'}
            }
        },
        {
            header: 'Ngày bảo hành cuối',
            binding: 'LastCheckTime',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy HH:mm'
        },
        {
            header: 'Id',
            binding: 'Id',
            dataType: 'Number',
            width: 0
        }
    ]
    childColumns1 = [
        {
            header: 'Tên người liên lạc',
            binding: 'ContactName',
            width: 200,
            validators: "{EXPR=ContactName} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Số điện thoại',
            binding: 'PhoneNo',
            width: 150,
            validators: "{EXPR=PhoneNo} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Địa chỉ Email',
            binding: 'Email',
            width: 200,
            validators: "{EXPR=Email} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Địa chỉ liên lạc',
            binding: 'Address',
            width: 300,
            validators: "{EXPR=Address} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        } ,
        {
            header: 'Gửi email',
            binding: 'IsMail',
            dataType: 'Boolean',
            width: 50
        },
    ]  

}
