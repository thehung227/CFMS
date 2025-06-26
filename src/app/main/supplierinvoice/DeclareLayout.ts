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

//Danh mục hóa đơn nhà cung cấp
export class LayoutSupplierInvoiceExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB20SuppInvoice_Explorer',
                //FilterKey: "IsActive = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (ItemCode IN (SELECT ItemGroupCode FROM dbo.ufn_TMCtc_NhomHang_Theo_NhanVien('{VAR=User.Ma_CbNv}','{VAR=Filter.ProductCostId}'))) AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_TMCtc_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}','{VAR=Filter.ProductCostId}')))",
                FilterKey: "IsActive = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (ItemCode IN (SELECT ItemGroupCode FROM dbo.ufn_TMCtc_NhomHang_Theo_NhanVien('{VAR=User.Ma_CbNv}','{VAR=Filter.ProductCostId}')))",
                OrderBy: 'Code',
                RowPage: 50
            }
        }
    }

    parentGrid = [
        {
            header: 'Số hóa đơn',
            binding: 'Code',
            width: 100,
            dataType: 'String'
        },
        {
            header: 'Ngày lập',
            binding: 'DocDate',
            width: 120,
            dataType: 'Date',
            format: 'dd/MM/yyy'
        },        
        {
            header: 'Ngày hóa đơn',
            binding: 'InvoiceDate',
            width: 120,
            dataType: 'Date',
            format: 'dd/MM/yyy'
        },
        {
            header: 'Ngày nhận',
            binding: 'ReceiptDate',
            width: 120,
            dataType: 'Date',
            format: 'dd/MM/yyy'
        },
        {
            header: 'Ngày đến hạn TT',
            binding: 'DueDate',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyy'
        }, 
        {
            header: 'Ngày thanh toán',
            binding: 'PaymentDate',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyy'
        },
        {
            header: 'Giá trị trước VAT',
            binding: 'AmountBeforeTax',
            width: 150,
            dataType: 'Number'
        },
        {
            header: 'Giá trị sau VAT',
            binding: 'AmountAfterTax',
            width: 150,
            dataType: 'Number'
        },
        {
            header: 'Nhóm hàng',
            binding: 'ItemCode',
            width: 100,
            dataType: 'String'
        },
        {
            header: 'Nhà cung cấp',
            binding: 'CustomerName',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Gói thầu',
            binding: 'ProductName',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Đã thanh toán',
            binding: 'IsPaid',
            width: 120,
            dataType: 'Boolean'
        },
        {
            header: 'Người tạo',
            binding: 'FullName',
            width: 150,
            dataType: 'String'
        }
    ]
}

export class LayoutSupplierInvoiceEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB20SuppInvoice_Editor',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1,
                    IsGroup: 0,
                    ParentId: -1,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                },
                ResetNewAsCopy: 'Id,CreatedBy,Code,AmountBeforeTax,AmountTax,AmountAfterTax',
                ResetValueForm: {
                    InvoiceDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    ReceiptDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    Code: "",
                    CreatedBy: -1,
                    FilePath: "",
                    AmountBeforeTax: 0,
                    AmountTax: 0,
                    AmountAfterTax: 0
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
            ConstraintKey: 'Code,{VAR=ColumnName_Code},{VAR=TableName_B20SuppInvoice},Id,CreatedAt',
            Command: 'usp_COTECCONS_UniqueCatg',
            MessageText: 'Số hóa đơn đã có giá trị tương tự',
            IgnoreError: 0
        },
        'Evaluator_AmountAferTax_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "AmountAfterTax",
            Value: "Math.round(AmountBeforeTax + AmountTax)"
        }
    }

    serverConstraint = [

    ]

    serverUpdating = [
        //'Evaluator_ServerConstraint_Check_CodeUnique'
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
        AmountBeforeTax: {
            Evaluators: [
                'Evaluator_AmountAferTax_Calculate'
            ]
        },
        AmountTax: {
            Evaluators: [
                'Evaluator_AmountAferTax_Calculate'
            ]
        }
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
                    label: 'Ngày lập',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    isDisabled: 'true',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    validators: [Validators.required],
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1, 3) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Nhà cung cấp',
                    lookupKey: 'Customer_CCM2',
                    binding: {
                    },
                    validators: [Validators.required],
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%' AND Code IN (SELECT CustomerCode FROM dbo.B20SupplierInfo WHERE IsActive = 1 GROUP BY CustomerCode)",
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Code',
                    label: 'Số hóa đơn',
                    validators: [Validators.required],
                    mask: '0000000',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'InvoiceDate',
                    label: 'Ngày hóa đơn',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6
                }),
                new DateBoxInput({
                    key: 'ReceiptDate',
                    label: 'Ngày nhận',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'AmountBeforeTax',
                    label: 'Giá trị trước VAT',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'AmountTax',
                    label: 'Tiền thuế',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'AmountAfterTax',
                    label: 'Giá trị sau VAT',
                    col: 6,
                    isReadOnly: 'true'
                }),
                new LookupBoxInput({
                    key: 'ItemCode',
                    label: 'Nhóm hàng',
                    lookupKey: 'Item',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ClassCode3= 'TM'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 6
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'NumDueDate',
                    label: 'Thời hạn Công nợ',
                    col: 6,
                    isNewRow: true
                }),
                new DateBoxInput({
                    key: 'DueDate',
                    label: 'Ngày đến hạn TT',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    isDisabled: 'true',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'PaymentDate',
                    label: 'Ngày thanh toán',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'IsPaid',
                    label: 'Đã thanh toán',
                    col: 6
                }),
                new UploadInput({
                    key: 'FilePath',
                    label: 'Đính kèm',
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