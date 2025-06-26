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

// Danh mục đơn vị nhận hàng
export class LayoutInvoiceCostExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'B10KqtDate',
                FilterKey: "IsActive = 1",
                OrderBy: 'DocDate',
                RowPage: 500
            }
        },
        PrintDocument: {
        }
    }

    lookup3 = {
        Table: 'B00TMCtcDocStatus',
        Filter: "CommandWeb = 'rowsPage'",
    }

    parentGrid = [
        {
            header: 'Ngày',
            binding: 'DocDate',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'ProductCosId',
            binding: 'ProductCosId',
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

export class LayoutInvoiceCostEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'B10KqtDate',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB10KqtCostInvoice',
                    ParentKey: 'Id',
                    ChildKey: 'ParentId',
                    DefaultValues: {
                        BuiltinOrder: '1',
                    }
                }
            ]
        }
    }

    evaluators = {
        'Evaluator_ServerConstraint_GetCongNo': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProductCostId',
            Command: 'usp_Vct_BangTongHopDeNghiThanhToanBill_GetData',
            DataMember: '',
            OutputTable: 0
        },
    }

    serverConstraint = [
        'Evaluator_ServerConstraint_GetCongNo'
    ]

    serverUpdating = [
        // 'Evaluator_ServerConstraint_Check_CodeUnique'
    ]

    serverUpdated: string[] = [

    ]

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_GetCongNo'
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
                    label: 'Ngày lập',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6,
                    
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/Phòng, ban',
                    lookupKey: 'ProductCost',
                    binding: {
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND RowId = '{VAR=Filter.ProductCostId}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'ProductCostId',
                //     label: 'Hạng mục',
                //     lookupKey: 'Project2',
                //     binding: {
                //     },
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId1 = '{EXPR=ProductCostId1}'",
                //     hideValueMember: true,
                //     col: 12
                // }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12
                })
            ]
        })
    ];

    childColumns = [
        {
            header: 'Mã NTP/NCC',
            binding: 'CustomerCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Customer',
            bindingList: {
                Name: 'CustomerName'
            },
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 100
        },
        {
            header: 'Tên NTP/NCC',
            binding: 'CustomerName',
            width: 300,
            isReadOnly: 'true'
        },
        {
            header: 'Giá trị đã xuất (Chưa VAT)',
            binding: 'InvoiceAmount',
            dataType: 'Number',
            width: 100,
            format: 'n0'
        },
        {
            header: 'Giá trị đã xuất (Gồm VAT)',
            binding: 'InvoiceAmountVAT',
            dataType: 'Number',
            width: 100,
            format: 'n0'
        },
        {
            header: 'Giá trị đã đưa về KT (Chưa VAT)',
            binding: 'AccountInAmount',
            dataType: 'Number',
            width: 100,
            format: 'n0'
        },
        {
            header: 'Giá trị đã đưa về KT (Gồm VAT)',
            binding: 'AccountInAmountVAT',
            dataType: 'Number',
            width: 100,
            format: 'n0'
        },
        {
            header: 'Giá trị chưa đưa về KT (Chưa VAT)',
            binding: 'NotAccountInAmount',
            dataType: 'Number',
            width: 100,
            format: 'n0'
        },
        {
            header: 'Giá trị chưa đưa về KT (Gồm VAT)',
            binding: 'NotAccountInAmountVAT',
            dataType: 'Number',
            width: 100,
            format: 'n0'
        },
        {
            header: 'Giá trị NCC chưa xác nhận (Chưa VAT)',
            binding: 'NotCusConfirmAmount',
            dataType: 'Number',
            width: 100,
            format: 'n0'
        },
        {
            header: 'Giá trị NCC chưa xác nhận (Gồm VAT)',
            binding: 'NotCusConfirmAmountVAT',
            dataType: 'Number',
            width: 100,
            format: 'n0'
        },
        {
            header: 'Giá trị NTP chưa xác nhận (Chưa VAT)',
            binding: 'NotSupConfirmAmount',
            dataType: 'Number',
            width: 100,
            format: 'n0'
        },
        {
            header: 'Giá trị NTP chưa xác nhận (Gồm VAT)',
            binding: 'NotSubConfirmAmountVAT',
            dataType: 'Number',
            width: 100,
            format: 'n0'
        }
    ]
}