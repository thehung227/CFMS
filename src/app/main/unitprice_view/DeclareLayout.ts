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

// *********************************PHỤ LỤC A, BILL THANH TOÁN

// Đơn giá khối lượng
export class LayoutUnitPriceExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocCCM_Explore',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode='PL' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'ProductName,CustomerName,DocNo DESC',
                RowPage: 50
            }
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Bảng đơn giá, khối lượng HĐ- {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng đơn giá, khối lượng",
                    FileName: "Bảng đơn giá, khối lượng - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "2.Bang_Don_Gia_Khoi_Luong.docx",
                    ExcelName: "2.Bang_DonGia_KhoiLuong.xlsx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ],
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'ItemNo',
                    width: 50,
                    dataType: 'String'
                },
                {
                    header: 'Nội dung',
                    binding: 'Description',
                    width: 300,
                    dataType: 'String'
                },
                {
                    header: 'Đvt',
                    binding: 'Unit',
                    width: 40,
                    dataType: 'String',
                    textAlign: 'center'
                },
                {
                    header: 'Khối lượng',
                    binding: 'Quantity',
                    width: 100,
                    dataType: 'Number',
                    format: 'n2'
                },
                {
                    header: 'Đơn giá',
                    binding: 'OriginalUnitCost',
                    width: 100,
                    dataType: 'Number',
                    format: 'n2'
                },
                {
                    header: 'Thành tiền',
                    binding: 'OriginalAmount',
                    width: 110,
                    dataType: 'Number'
                }
            ]
        }
    }

    parentGrid = [
        {
            header: 'Đối tượng',
            binding: 'CustomerName',
            width: 300
        },
        {
            header: 'Số',
            binding: 'DocNo',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Ngày lập',
            binding: 'DocDate',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'

        },
        {
            header: 'Số hợp đồng/PLHĐ',
            binding: 'DocNo_Hd',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Ngày hợp đồng/PLHĐ',
            binding: 'DocDate_Hd',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Giá trị',
            binding: 'OriginalAmount',
            width: 150,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Gói thầu/PB',
            binding: 'ProductName',
            width: 300
        },
        {
            header: 'Người lập',
            binding: 'FullName',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Id',
            binding: 'Id',
            width: 50,
            dataType: 'Number'
        }
    ]
}

export class LayoutUnitPriceEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocCCM_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'PL',
                    BizDocId: '',
                    DocStatus: '4',
                    CurrencyCode: 'VND',
                    Id: -1,
                    IsWebData: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocCCMDetail_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        CustomerCode: 'Parent.CustomerCode',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                }
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Bảng đơn giá, khối lượng HĐ- {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng đơn giá, khối lượng",
                    FileName: "Bảng đơn giá, khối lượng - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "2.Bang_Don_Gia_Khoi_Luong.docx",
                    ExcelName: "2.Bang_DonGia_KhoiLuong.xlsx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ],
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'ItemNo',
                    width: 70,
                    dataType: 'String'
                },
                {
                    header: 'Nội dung',
                    binding: 'Description',
                    width: 250,
                    dataType: 'String'
                },
                {
                    header: 'Đvt',
                    binding: 'Unit',
                    width: 50,
                    dataType: 'String'
                },
                {
                    header: 'Khối lượng',
                    binding: 'Quantity',
                    width: 100,
                    dataType: 'Number',
                    format: 'n2'
                },
                {
                    header: 'Đơn giá',
                    binding: 'OriginalUnitCost',
                    width: 100,
                    dataType: 'Number',
                    format: 'n2'
                },
                {
                    header: 'Thành tiền',
                    binding: 'OriginalAmount',
                    width: 110,
                    dataType: 'Number'
                }
            ]
        }
    };

    evaluators = {
        'Evaluator_Parent_OriginalAmount_Calculate': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "OriginalAmount",
            Value: 'OriginalAmount',
            Tables: 0
        },
        'Evaluator_BizDocDetail_OriginalAmount9': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount",
            Value: "Math.round(Quantity9*OriginalUnitCost)",
            Tables: 0
        },
        'Evaluator_BizDocDetail_OriginalUnitCost': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalUnitCost",
            Value: "UnitCostVT+UnitCostNC",
            Tables: 0
        },
        //
        'Evaluator_ServerConstraint_CTC_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ParentBizDocId,DocCode,{VAR=Branch.Ma_Dvcs},ProductCostId,CustomerCode,Id',
            Command: 'ufn_Coteccons_B30BizDocCCM_DefaultDocNo',
            DataMember: 'DocNo',
            zExpr: "ParentBizDocId != '' && ProductCostId != ''"
        },
        'Evaluator_ServerConstraint_B30BizDocCCM_Check_Unique_DocNo': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},BizDocId,DocCode,DocNo',
            Command: 'ufn_B30BizDocCCM_CheckUniqueDocNo',
            MessageText: 'Số phiếu bảng đơn giá, khối lượng đã tồn tại',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Load_Cv': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocNo,CustomerCode',
            Command: 'usp_B10BillCCM_lLoad_Cv',
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'BizDocId,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Conteccons_NotChangeWhenApproveSent_Bill',
            IgnoreError: 0,
            MessageText: "Không được thay đổi khi đã gửi duyệt"
        },
        'Evaluator_ServerConstraint_Check_ImportedExcel': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Id,DocCode,ProductCostId,ParentBizDocId,CustomerCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_CheckImported',
            DataMember: 'CountImport',
            zExpr: "ProductCostId != '' && ParentBizDocId != ''"
        },
        //không đổi tên 
        'Evaluator_ServerConstraint_LoadDataImport': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,{VAR=Branch.Ma_Dvcs},{VAR=User.UserName}',
            Command: 'usp_Coteccons_BizDocCCMDetail_ImportForWeb',
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_DeleteDataImport': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ProductCostId,{VAR=Branch.Ma_Dvcs},{VAR=User.UserName}',
            Command: 'usp_Coteccons_BizDocCCMDetail_DeleteForWeb'
        },
        //serverupdated
        'Evaluator_ServerUpdated_CreateFormula_BizDocCCMDetail': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Coteccons_CreateFormula_BizDocCCMDetail'
        },
        'Evaluator_ServerUpdated_BuiltinOrder': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=TableNames_B30BizDocCCMDetail},{VAR=Keys_B30BizDocCCMDetail},{VAR=FieldOrders_B30BizDocCCMDetail},{VAR=EmptyField_CCMBudgetId},BizDocId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_Web_SetBuiltionOrder'
        },
        'Evaluator_ServerUpdated_BizDocCCMDetail_UpdateFromParent': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Coteccons_BizDocCCMDetail_UpdateFromParentWEB'
        },
        'Evaluator_ServerUpdated_BizDocCCMDetail_RoundAmount': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Coteccons_BizDocCCMDetail_UpdateFromParentWEB'
        }
    };

    serverConstraint: string[] = [
        'Evaluator_ServerConstraint_CTC_DefaultDocNo',
        'Evaluator_ServerConstraint_Check_ImportedExcel'
    ]

    serverUpdating: string[] = [
        'Evaluator_ServerConstraint_B30BizDocCCM_Check_Unique_DocNo',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
    ]

    serverUpdated: string[] = [
        'Evaluator_ServerUpdated_BuiltinOrder',
        'Evaluator_ServerUpdated_CreateFormula_BizDocCCMDetail',
        'Evaluator_ServerUpdated_BizDocCCMDetail_UpdateFromParent'
    ]

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_B30BizDocCCM_Check_Unique_DocNo',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        //
        'Evaluator_ServerConstraint_Load_Cv'
    ];

    buttonCommand: string[] = [
        'Evaluator_Parent_OriginalAmount_Calculate'
    ]

    importCommand: string[] = [
        'Evaluator_Parent_OriginalAmount_Calculate'
    ]

    columnChanged = {

    };

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
                Quantity9: {
                    Evaluators: [
                        "Evaluator_BizDocDetail_OriginalAmount9"
                    ]
                },
                OriginalUnitCost: {
                    Evaluators: [
                        "Evaluator_BizDocDetail_OriginalAmount9"
                    ]
                },
                OriginalAmount: {
                    Evaluators: [
                        "Evaluator_Parent_OriginalAmount_Calculate"
                    ]
                },
                UnitCostNC: {
                    Evaluators: [
                        'Evaluator_BizDocDetail_OriginalUnitCost'
                    ]
                },
                UnitCostVT: {
                    Evaluators: [
                        'Evaluator_BizDocDetail_OriginalUnitCost'
                    ]
                }
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
                    label: 'Ngày',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số',
                    type: 'text',
                    isReadOnly: 'true',
                    col: 6,
                    validators: [Validators.required],
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                    hideValueMember: true,
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Hợp đồng/phụ lục',
                    lookupKey: 'BizDoc_CTC',
                    lookupfilter: "DocCode IN ('C3','C4') AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId='{EXPR=ProductCostId}'",
                    binding: {
                        CustomerCode: 'CustomerCode',
                        CurrencyCode: 'CurrencyCode',
                        TaxCode: 'TaxCode',
                        TaxRate: 'TaxRate'
                    },
                    hideValueMember: true,
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Đối tác',
                    lookupKey: 'Customer_CCM2',
                    lookupfilter: "(('{EXPR=ProductType}'=3 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%') OR Code IN (SELECT A.CustomerCode FROM B30CCMBudgetDetail A INNER JOIN B30CCMBudget B ON A.CCMBudgetId = B.CCMBudgetId WHERE (A.CompletedApproveDetail=1 OR A.Loai_Dt = 'DTC') AND B.CompletedApprove=1 AND B.IsActive=1 AND B.DocCode='K1' AND B.ProductCostId ='{EXPR=ProductCostId}' GROUP BY A.CustomerCode))",
                    binding: {
                        Name: 'Person',
                        Address: 'Address'
                    },
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CurrencyCode',
                    label: 'Mã tiền tệ',
                    lookupKey: 'Currency',
                    lookupfilter: "IsActive=1 AND IsGroup=0",
                    hideValueMember: false,
                    // isReadOnly: 'true',
                    // style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'TaxCode',
                    label: 'Thuế',
                    lookupKey: 'Tax',
                    hideValueMember: false,
                    lookupfilter: "Type=1 AND IsActive=1 AND IsGroup=0 AND IsDefault = 1",
                    binding: {
                        Rate: 'TaxRate'
                    },
                    col: 6,
                    //isDisabled: 'true'
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'OriginalAmount',
                    label: 'Tổng giá trị',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'TaxRate',
                    label: 'Thuế suất',
                    isDisabled: 'true',
                    col: 6,
                    visible: 'false'
                }),
                new NumberBoxInput({
                    key: 'ExchangeRate',
                    label: 'Tỷ giá (tạm tính)',
                    type: 'number',
                    col: 6
                })
            ]
        })
    ];

    childColumns = [
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 100,
            isRequired: true,
        },
        {
            header: 'Diễn giải',
            binding: 'Description',
            allowEditing: false,
            width: 350,
            isRequired: true,
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 50,
            isRequired: true,
        },
        {
            header: 'Khối lượng hợp đồng',
            binding: 'Quantity9',
            dataType: 'Number',
            width: 100,
            format: 'n3',
            isRequired: true,
        },
        {
            header: 'Đơn giá tổng (chưa VAT)',
            binding: 'OriginalUnitCost',
            dataType: 'Number',
            width: 100
        },
        {
            header: 'Thành tiền VNĐ',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Đơn giá VT (chưa VAT)',
            binding: 'UnitCostVT',
            dataType: 'Number',
            width: 100
        },
        {
            header: 'Đơn giá NC (chưa VAT)',
            binding: 'UnitCostNC',
            dataType: 'Number',
            width: 100
        },
        {
            header: 'Nhãn hiệu, xuất xứ',
            binding: 'NhanHieu_XuatXu',
            allowEditing: true,
            width: 150
        },
        {
            header: 'Ghi chú',
            binding: 'Remark',
            allowEditing: true,
            width: 150
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50
        },
        {
            header: 'Bậc',
            binding: 'Level',
            dataType: 'Number',
            width: 50,
            format: 'n0'
        },
        {
            header: 'Công thức',
            binding: 'Formula',
            width: 200
        },
        {
            header: 'Tự áp công thức',
            binding: 'ManualFormula',
            dataType: 'Boolean',
            width: 80
        }
    ];

}
