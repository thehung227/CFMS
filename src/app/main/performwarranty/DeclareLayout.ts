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


export class LayoutPerformWarrantyExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30Warranty',
                FilterKey: "IsActive=1",
                OrderBy: 'DocDate',
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
            header: 'Ngày lập',
            binding: 'DocDate',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            width: 400,
            dataType: 'String'
        },
        {
            header: 'Công trường',
            binding: 'ProductName',
            width: 400,
            dataType: 'String'
        }
    ]
}

export class LayoutPerformWarrantyEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30Warranty',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1,
                    IsGroup: 0,
                    ParentId: -1,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB30WarrantyEquip_Edit',
                    ParentKey: 'Stt',
                    Sort: 'BuiltinOrder',
                    ChildKey: 'ParentRowId',
                    DefaultValues: {
                        ParentRowId: 'Parent.RowId',
                        BuiltinOrder: '1',
                    }
                },
                {
                    Name: 'vB30BizDocContactInfo_Edit',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.Stt',
                        BuiltinOrder: '1',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.Stt',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                    }
                } 
            ]
        }
    }

    evaluators = {
        'Evaluator_ServerConstraint_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,Id',
            Command: 'ufn_B30Warranty_DefaultDocNo',
            zExpr: "DocNo == ''",
            DataMember: 'DocNo'
        },
    }

    serverConstraint = [
        'Evaluator_ServerConstraint_DefaultDocNo'
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
                new DateBoxInput({
                    key: 'DocDate',
                    label: 'Ngày bảo hành, bảo trì',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số chứng từ',
                    dataType: 'text',
                    col: 6,
                    validators: [Validators.required],
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    validators: [Validators.required],
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
               
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    validators: [Validators.required],
                    col: 12
                }),
                new DateBoxInput({
                    key: 'FinishDateWaranty',
                    label: 'Ngày hoàn thành',
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
                directory: 'performwarrantyequip',
                type: 'detail',
                key: 'Id',
                parameter: { 'Commandkey': 'performwarrantyequip-editor'}
            }
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
    childColumns2 = [
        {
            header: 'Ghi chú',
            binding: 'Description',
            width: 250
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 500,
            dataType: 'Object',
            //validators: "{EXPR=Description} != '' && {EXPR=Description} == 'Yêu cầu đính kèm' && {EXPR=FilePath}==0",
            validators: "{EXPR=Attached} == true && {EXPR=Description} != 'Theo mẫu công ty ban hành' && {EXPR=FilePath}==0",
            validatorMessage: 'Yêu cầu đính kèm tài liệu',
            ignoreError: 1
            //exprReadOnly: "{EXPR=Attached} == true && {EXPR=Description} != ''"
        }
    ];

}
