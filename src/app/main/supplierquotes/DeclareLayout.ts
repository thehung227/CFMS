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

// Báo giá nhà cung cấp
export class LayoutSupplierQuotesExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_Explore',
                //FilterKey: "DocCode='QR' AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND IsActive=1 AND (ItemGroupCode IN (SELECT ItemGroupCode FROM dbo.ufn_TMCtc_NhomHang_Theo_NhanVien('{VAR=User.Ma_CbNv}','{VAR=Filter.ProductCostId}'))) AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId1 = '' OR ProductCostId1 IN (SELECT RowId FROM dbo.ufn_TMCtc_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}','{VAR=Filter.ProductCostId}')))",
                FilterKey: "IsDone=1 AND DocCode='QR' AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND IsActive=1 AND (ItemGroupCode IN (SELECT ItemGroupCode FROM dbo.ufn_TMCtc_NhomHang_Theo_NhanVien('{VAR=User.Ma_CbNv}','{VAR=Filter.ProductCostId}')))",
                OrderBy: 'DocNo,DocDate',
                RowPage: 50
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
                },
                {
                    header: '%',
                    binding: 'Percent_Th',
                    width: 50,
                    dataType: 'Number',
                    format: "p2"
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

    lookup1 = {
        Table: 'vB20Item_MenuFilter',
        Filter: "IsGroup=1 AND IsActive=1 AND ClassCode3 = 'TM' AND IsShowMenuWeb = 1",
        ColumnFilter: 'ItemGroupCode'
    }
    lookup2 = {
        Table: 'B00TMCtcDocStatus',
        Filter: "IsGroup=0 AND CommandWeb = 'supplierquotes'",
        ColumnFilter: 'Closed'
    }
    lookup3 = {
        Table: 'B00TMCtcDocStatus',
        Filter: "CommandWeb = 'rowsPage'",
    }

    parentGrid = [
        {
            header: 'Số',
            binding: 'DocNo',
            width: 160,
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
            header: 'Ngày hiệu lực',
            binding: 'EffectiveDate',
            width: 120,
            dataType: 'Date',
            format: 'dd/MM/yyyy'

        },
        {
            header: 'Diễn giải',
            binding: 'Description',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Đối tượng',
            binding: 'CustomerName',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Người tạo',
            binding: 'FullName',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Gói thầu',
            binding: 'TenGoiThau',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Nhóm hàng',
            binding: 'ItemGroupName',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Id báo giá',
            binding: 'Id',
            width: 100,
            dataType: 'Number'
        }
    ]
}

export class LayoutSupplierQuotesEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_Edit',
                ResetNewAsCopy: 'Id,BizDocId,FilePath,CreatedBy',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'QR',
                    BizDocId: '',
                    DocStatus: '4',
                    CurrencyCode: 'VND',
                    Id: -1,
                    IsWebData: true,
                    IsDone: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                },
                ResetValueForm: {
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    CreatedBy: -1,
                    IsSplitVoucher: true,
                    BizDocId: "",
                    FilePath: ""
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocDetail_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        CustomerCode: 'Parent.CustomerCode',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    },
                    Sort: 'BuiltinOrder',
                    ResetNewAsCopy: 'Id,BizDocId,RowId,CustomerCode'
                }
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'KLTT ĐTC- {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_TMCtc_ExportSupplierQuotes',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Báo giá NCC",
                    FileName: "Báo giá NCC - {EXPR=CustomerName} - {EXPR=TenGoiThau}",
                    WordName: "",
                    ExcelName: "FORM_BaoGiaNCC.xlsx",
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
                },
                {
                    header: '%',
                    binding: 'Percent_Th',
                    width: 50,
                    dataType: 'Number',
                    format: "p2"
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

    evaluators = {
        //contrainst
        'Evaluator_ServerConstraint_CTC_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},DocCode,DocDate,{VAR=VoucherCode_DN},ItemGroupCode',
            Command: 'ufn_AutoGenVoucherNoByPrefix_BizDoc_VoucherCodeWEB',
            DataMember: 'DocNo',
            zExpr: "ItemGroupCode != '' || ItemGroupCode != 0"
        },
        'Evaluator_ServerConstraint_CheckUniqueDocNo': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},BizDocId,DocCode,DocNo',
            Command: 'ufn_B30BizDoc_CheckUniqueDocNo',
            MessageText: 'Số phiếu đã tồn tại',
            IgnoreError: 0
        },
        'Evaluator_ItemGroupCode_Binding_FromParent': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'ItemGroupCode',
            Value: 'ItemGroupCode',
            Tables: 0
        },
        'Evaluator_ServerConstraint_LoadItem': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,ItemGroupCode,TradeMarkCodeList,{VAR=Branch.Ma_Dvcs},BizDocId_PP',
            Command: 'usp_Coteccons_TM_LoadItemForTradeMark',
            zExpr: "ItemGroupCode != '' && TradeMarkCodeList != ''",
            OutputTable: 0
        },
        // 'Evaluator_ServerConstraint_TradeMarkCodeList_GetValue': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: 'ProductCostId,ItemGroupCode,{VAR=Branch.Ma_Dvcs}',
        //     Command: 'usp_Coteccons_TM_GetTradeMarkCodeList',
        //     DataMember: 'TradeMarkCodeList',
        //     zExpr: "ProductCostId != '' && ItemGroupCode != ''"//&& '{EXPR=TradeMarkCodeList}' != ''"
        // },
        'Evaluator_ServerConstraint_Supplier_GetInfo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CustomerCode,ItemGroupCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_TMCtc_GetSupplierInfo',
            DataMember: 'ShortName,ContactPerson,ContactPhoneNo,ContactEmail',
            zExpr: "CustomerCode != '' && ItemGroupCode != ''"
        },
        'Evaluator_ServerConstraint_Check_UserModified': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: '{VAR=User.Id},BizDocId,DocCode',
            Command: 'ufn_Coteccons_CheckUser_ModifiedBy',
            MessageText: 'Không được điều chỉnh dữ liệu của người dùng khác',
            IgnoreError: 0,
            zExpr: 'Id > 0 && IsSplitVoucher == 0'
        },
    }

    serverConstraint = [
        'Evaluator_ServerConstraint_CTC_DefaultDocNo',
        'Evaluator_ServerConstraint_Supplier_GetInfo'
    ]

    serverUpdating = [
        'Evaluator_ServerConstraint_CheckUniqueDocNo',
        'Evaluator_ServerConstraint_Check_UserModified'
    ]

    serverUpdated: string[] = [

    ]

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_LoadItem',
        'Evaluator_ServerConstraint_Check_UserModified'
    ];

    buttonCommand: string[] = [

    ]

    importCommand: string[] = [

    ]

    columnChanged = {
        ItemGroupCode: {
            Evaluators: [
                'Evaluator_ItemGroupCode_Binding_FromParent'
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

    rowAdded = [
        {
            Tables: 0,
            Evaluators: [
                'Evaluator_ItemGroupCode_Binding_FromParent'
            ]
        }
    ]

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
                    col: 6
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số',
                    type: 'text',
                    isReadOnly: 'true',
                    validators: [Validators.required],
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'ProductCostId0',
                    label: 'Dự án',
                    lookupKey: 'Project0',
                    binding: {
                    },
                    lookupfilter: "IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' ",
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId1',
                    label: 'Gói thầu',
                    lookupKey: 'Project1',
                    binding: {
                        RowId: 'ProductCostId'
                    },
                    lookupfilter: "IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId0 = '{EXPR=ProductCostId0}'",
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Hạng mục',
                    lookupKey: 'Project2',
                    binding: {
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId1 = '{EXPR=ProductCostId1}'",
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Nhà cung cấp',
                    lookupKey: 'Customer_CCM2',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%' AND Code IN (SELECT CustomerCode FROM dbo.B20SupplierInfo WHERE IsActive = 1 GROUP BY CustomerCode)",
                    validators: [Validators.required],
                    binding: {
                        Name: 'Person',
                        Address: 'Address',
                        ShortName: 'ShortName'
                    },
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ClassCode1',
                    label: 'Loại báo giá',
                    lookupKey: 'Class',
                    binding: {
                    },
                    lookupfilter: "ParentCode='BGType'",
                    hideValueMember: true,
                    validators: [Validators.required],
                    col: 6
                }, this.srv, this.parentData),                
                new NumberBoxInput({
                    key: 'TimeAliveOfQR',
                    label: 'Thời gian báo giá (giờ)',
                    type: 'number',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'ItemGroupCode',
                    label: 'Nhóm hàng',
                    lookupKey: 'Item',
                    lookupfilter: "IsShowMenuWeb = 1 AND IsGroup=1 AND IsActive=1 AND ClassCode3 = 'TM' AND (Code IN (SELECT ItemGroupCode FROM B20ProductTradeMark WHERE ProductCostId='{EXPR=ProductCostId}') OR '{EXPR=ProductCostId}'='')",
                    validators: [Validators.required],
                    binding: {
                    },
                    hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'ShortName',
                    label: 'Tên viết tắt',
                    type: 'text',
                    col: 6,
                    validators: [Validators.required]
                }),
                new TextBoxInput({
                    key: 'ContactPerson',
                    label: 'Người liên hệ',
                    type: 'text',
                    col: 6,
                    validators: [Validators.required]
                }),
                new TextBoxInput({
                    key: 'ContactPhoneNo',
                    label: 'Số điện thoại',
                    type: 'text',
                    col: 6,
                    validators: [Validators.required]
                }),
                new TextBoxInput({
                    key: 'ContactEmail',
                    label: 'Email',
                    type: 'text',
                    col: 6,
                    validators: [Validators.required]
                }),
                new LookupBoxInput({
                    key: 'TerritoryCode',
                    label: 'Tỉnh/ thành',
                    lookupKey: 'Territory',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    validators: [Validators.required],
                    binding: {
                    },
                    hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),
                new DateBoxInput({
                    key: 'EffectiveDate',
                    label: 'Ngày hiệu lực',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    //validators: [Validators.required]
                }),
                new DateBoxInput({
                    key: 'FinishedDate',
                    label: 'Ngày hết hiệu lực',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    //validators: [Validators.required]
                }),
                new MultiSelectInput({
                    key: 'TradeMarkCodeList',
                    label: 'Thương hiệu',
                    lookupKey: 'TradeMark',
                    lookupfilter: "IsActive=1 AND ItemGroupCode='{EXPR=ItemGroupCode}' AND (Code IN (SELECT t.Val FROM dbo.B20ProductTradeMark OUTER APPLY dbo.ufn_sys_SplitString(TradeMarkCode,',') t WHERE ProductCostId='{EXPR=ProductCostId}') OR '{EXPR=ProductCostId}'='')",
                    validators: [Validators.required],
                    binding: {
                    },
                    hideValueMember: false,
                    col: 6
                }, this.srv),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Thông tin khác',
                    type: 'text',
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'IsFixPrice',
                    label: 'Báo giá giữ giá',
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'Closed',
                    label: 'Hết hiệu lực',
                    col: 6
                }),
                new UploadInput({
                    key: 'FilePath',
                    label: 'Báo giá đính kèm',
                    col: 6
                }, this.srv),
                new CheckBoxInput({
                    key: 'IsSplitVoucher',
                    label: 'Bản sao',
                    isDisabled: 'true',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'BizDocId',
                    label: '_BizDocId',
                    type: 'text',
                    visible: 'false',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'BizDocId_PP',
                    label: '_BizDocId_PP',
                    type: 'text',
                    visible: 'false',
                    col: 6
                })
            ]
        })
    ];

    childColumns = [
        {
            header: 'STT',
            binding: 'BuiltinOrder',
            dataType: 'Number',
            format: 'n0',
            width: 0
        },
        {
            header: 'Thương hiệu',
            binding: 'TradeMarkCode',
            width: 150,
            dataType: 'Array',
            lookupKey: 'TradeMark',
            lookupfilter: "CHARINDEX(Code,'{EXPR=TradeMarkCodeList}') > 0", //ItemGroupCode = '{EXPR=ItemGroupCode}' AND 
            bindingList: {
            },
            validators: "{EXPR=TradeMarkCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Mã hàng',
            binding: 'ItemCode',
            width: 150,
            dataType: 'Array',
            lookupKey: 'Item',
            bindingList: {
                Name: 'Description0',
                Unit: 'Unit',
                Unit0: 'Unit0'
            },
            lookupfilter: "IsStopBusiness=0 AND ClassCode3 = 'TM' AND IsGroup=0 AND IsActive=1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND ParentId IN (SELECT Id FROM B20Item WHERE Code = '{EXPR=ItemGroupCode}')",
            validators: "{EXPR=ItemCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên vật tư',
            binding: 'Description0',
            width: 250
        },
        {
            header: 'Đvt (gốc)',
            binding: 'Unit',
            // dataType: 'Array',
            // lookupKey: 'ItemUnit',
            // bindingList: {
            // },
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND ItemCode='{EXPR=ItemCode}'",
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: 'Đvt (quy đổi)',
            binding: 'Unit0',
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: 'Đơn giá (tính giá)',
            binding: 'OriginalUnitCost',
            dataType: 'Number',
            width: 120,
            format: 'n2'
        },
        {
            header: 'Đơn giá (theo dõi)',
            binding: 'ChartUnitCost',
            dataType: 'Number',
            width: 140,
            format: 'n2'
        },
        {
            header: 'Tính giá theo quy đổi',
            binding: 'CalPriceByExchange',
            dataType: 'Boolean',
            width: 140,
            isReadOnly: 'true'
        },
        {
            header: 'Nhóm hàng',
            binding: 'ItemGroupCode',
            isReadOnly: 'true',
            dataType: 'Array',
            lookupKey: 'Item',
            width: 0
        }
    ]
}