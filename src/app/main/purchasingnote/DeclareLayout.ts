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


// Nhập hàng công trường
export class LayoutPurchasingNoteExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30AccDoc_ExplorePurchaseWeb',
                //FilterKey: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'NH' AND IsActive=1",
                FilterKey: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'NH' AND IsActive=1 AND (ItemGroupCode IN (SELECT ItemGroupCode FROM dbo.ufn_TMCtc_NhomHang_Theo_NhanVien('{VAR=User.Ma_CbNv}','{VAR=Filter.ProductCostId}'))) AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId1 IN (SELECT RowId FROM dbo.ufn_TMCtc_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}','{VAR=Filter.ProductCostId}')))",
                OrderBy: 'DocNo',
                RowPage: 50,
                DefaultValues: {
                    CurrencyCode: 'VND'
                }
            },
            Child: {
                Name: 'vB30BizDocApprove_AccDocExplorer',
                ParentKey: 'Stt',
                ChildKey: 'BizDocId',
                OrderBy: 'ApproveGroup'
            }
        }
    }

    lookup1 = {
        Table: 'vB20Item_MenuFilter',
        Filter: "IsGroup=1 AND IsActive=1 AND ClassCode3 = 'TM' AND IsShowMenuWeb = 1",
        ColumnFilter: 'ItemGroupCode'
    }

    lookup2 = {
        Table: 'B00TMCtcDocStatus',
        Filter: "IsGroup=0 AND CommandWeb = 'purchasingnote'",
        ColumnFilter: 'DocStatusKeyNH'
    }

    lookup3 = {
        Table: 'B00TMCtcDocStatus',
        Filter: "CommandWeb = 'rowsPage'",
    }

    parentGrid = [
        {
            header: 'Số phiếu',
            binding: 'DocNo',
            width: 130,
            dataType: 'String'
        },
        {
            header: 'Ngày',
            binding: 'DocDate',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'

        },
        {
            header: 'Đối tượng',
            binding: 'CustomerName',
            width: 300
        },
        {
            header: 'Gói thầu',
            binding: 'ProductName',
            width: 300
        },
        {
            header: 'Nhóm hàng',
            binding: 'ItemGroupCode',
            width: 110,
            dataType: 'String'
        },
        {
            header: 'Số đơn hàng',
            binding: 'DocNo_PO',
            width: 130,
            dataType: 'String'
        },
        {
            header: 'Số đề nghị',
            binding: 'DocNo_PP',
            width: 130,
            dataType: 'String'
        },
        {
            header: 'Đã gửi duyệt',
            binding: 'ApproveSend',
            width: 110,
            dataType: 'Boolean'
        },
        {
            header: 'Id',
            binding: 'Id',
            width: 100,
            dataType: 'Number'
        }
    ]

    childGrid = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
        },
        {
            header: 'Bộ phận',
            binding: 'DeptName',
            width: 250,
            dataType: 'String'
        },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 200,
            dataType: 'String'
        },
        // {
        //     header: 'Người thực hiện',
        //     binding: 'EmployeeName',
        //     width: 150
        // },
        {
            header: 'Người đã thực hiện',
            binding: 'EmployeeNameApprove',
            width: 150
        },
        {
            header: 'Số ngày thực hiện',
            binding: 'NumberOfDays',
            width: 150,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Duyệt',
            binding: 'ApproveStatus',
            width: 80,
            dataType: 'Boolean',
            textAlign: 'center'
        },
        {
            header: 'Ngày đến hạn',
            binding: 'StartDate',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy HH:mm'
        },
        {
            header: 'Ngày hoàn thành',
            binding: 'FinishDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy HH:mm',
            width: 150
        },
        // {
        //     header: 'Ý kiến',
        //     binding: 'Comment',
        //     width: 400,
        //     dataType: 'String',
        //     isContentHtml: true
        // }
    ]
}

export class LayoutPurchasingNoteEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    // Khai báo view lấy dữ liệu <Tables> B7
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30AccDoc_EditPurchaseWeb',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'NH',
                    DocStatus: '1',
                    Stt: '',
                    CurrencyCode: 'VND',
                    Id: -1,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB30AccDocDocument_Edit',
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    }
                },
                {
                    Name: 'vB30BizDocApprove_AEditNMTM',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30AccDocPurchaseAssess_Edit',
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30AccDocPurchaseWeb_Edit',
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        DocCode: 'Parent.DocCode',
                        DocGroup: 1,
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        ProductCostId0: 'Parent.ProductCostId0',
                        ProductCostId1: 'Parent.ProductCostId1',
                        ProductCostId: 'Parent.ProductCostId',
                        CustomerCode: 'Parent.CustomerCode'
                    }
                }
            ]
        }
    };

    evaluators = {
        'Evaluator_ServerConstraint_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},DocCode,DocDate,{VAR=VoucherCode_DN}',
            Command: 'ufn_AutoGenVoucherNoByPrefix_AccDoc_VoucherCode',
            zExpr: "Id < 0",
            DataMember: 'DocNo'
        },
        'Evaluator_ServerUpdating_UpdateStatusByApproveStatus': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Id',
            Command: 'usp_Coteccons_AccDocNH_UpdateDocStatus'
        },
        'Evaluator_B30AccDocPurchaseWeb_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'BizDocId_PO',
            Command: 'usp_Coteccons_Purchase_ConvertFromB30BizDoc_PO',
            OutputTable: 3
        },
        'Evaluator_B30AccDocPurchaseAssess_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'BizDocId_PO',
            Command: 'usp_TMCtc_B30AccDocPurchaseAssess_GetData',
            OutputTable: 2
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId1,BizDocId_PO',
            Command: 'usp_TMCtc_B30BizDocApprove_GetData',
            OutputTable: 1
        },
        'Evaluator_B30AccDocDocument_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'BizDocId_PO',
            Command: 'usp_TMCtc_B30AccDocDocument_GetDefault',
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_QuyDoi_Quantity8': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Quantity8",
            Value: "Quantity9*ConvertRate0",
            Tables: 3
        },
        'Evaluator_B30AccDocPurchaseWeb_OriginalAmount9': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount9",
            Value: "Math.round(Quantity9*OriginalUnitCost)",
            zExpr: 'CalPriceByExchange == false',
            Tables: 3
        },
        'Evaluator_B30AccDocPurchaseWeb_OriginalAmount9_CTC': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount9",
            Value: "Math.round(Quantity8*OriginalUnitCost)",
            zExpr: 'CalPriceByExchange == true',
            Tables: 3
        },
        'Evaluator_B30AccDocPurchaseWeb_AmountAdjust': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "AmountAdjust",
            Value: "Math.round(QuantityAdjust*UnitCostAdjust)",
            Tables: 3
        },
        'Evaluator_SuppInvoiceCode_BindingFromParent': {
            EvaluatorName: 'EvaluatorBindingChildAll',
            DataMember: 'SuppInvoiceCode',
            Value: 'SuppInvoiceCode',
            Tables: 3
        },
        'Evaluator_NumRoundChild_BindingFromParent': {
            EvaluatorName: 'EvaluatorBindingChildAll',
            DataMember: 'NumRoundChild',
            Value: 'NumRound',
            Tables: 3
        },
        'Evaluator_ServerConstraint_QuantityAdjust_Round': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "QuantityAdjust",
            Value: "CalPriceByExchange == true ? (Math.round(Quantity8 * NumRoundChild) / NumRoundChild) : (Math.round(Quantity9 * NumRoundChild) / NumRoundChild)",
            Tables: 3,
            zExpr: "NumRoundChild != 0"
        }
    };

    serverConstraint = [

    ];

    serverUpdating = [

    ]

    serverUpdated = [

    ];

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_DefaultDocNo',
        'Evaluator_B30AccDocPurchaseWeb_GetData'
    ]

    buttonCommand: string[] = [
    ];

    importCommand: string[] = [
    ]

    columnChanged = {
        ProcessCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_Approve_GetData',
                'Evaluator_B30AccDocPurchaseAssess_GetData',
                'Evaluator_B30AccDocDocument_GetData'
            ]
        },
        SuppInvoiceCode: {
            Evaluators: [
                'Evaluator_SuppInvoiceCode_BindingFromParent'
            ]
        },
        NumRound: {
            Evaluators: [
                'Evaluator_NumRoundChild_BindingFromParent'
            ]
        }
    };

    columnChangedChild = [
        {
            Tables: 3,
            columnChanged: {
                Quantity9: {
                    Evaluators: [
                        'Evaluator_ServerConstraint_QuyDoi_Quantity8',
                        'Evaluator_B30AccDocPurchaseWeb_OriginalAmount9'
                    ]
                },
                Quantity8: {
                    Evaluators: [
                        'Evaluator_B30AccDocPurchaseWeb_OriginalAmount9_CTC'
                    ]
                },
                OriginalUnitCost: {
                    Evaluators: [
                        'Evaluator_B30AccDocPurchaseWeb_OriginalAmount9',
                        'Evaluator_B30AccDocPurchaseWeb_OriginalAmount9_CTC'
                    ]
                },
                QuantityAdjust: {
                    Evaluators: [
                        'Evaluator_B30AccDocPurchaseWeb_AmountAdjust'
                    ]
                },
                UnitCostAdjust: {
                    Evaluators: [
                        'Evaluator_B30AccDocPurchaseWeb_AmountAdjust'
                    ]
                },
                ConvertRate0: {
                    Evaluators: [
                        'Evaluator_ServerConstraint_QuyDoi_Quantity8'
                    ]
                },
                NumRoundChild: {
                    Evaluators: [
                        'Evaluator_ServerConstraint_QuantityAdjust_Round',
                        'Evaluator_B30AccDocPurchaseWeb_AmountAdjust'
                    ]
                }
            }
        }
    ];

    columnsReadOnly = [];

    linkReporter = {

    }

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
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số phiếu',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Nhà cung cấp',
                    lookupKey: 'Customer_CCM2',
                    binding: {
                        Name: 'Person',
                        Address: 'Address'
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId0',
                    label: 'Dự án',
                    lookupKey: 'Project0',
                    binding: {
                    },
                    lookupfilter: "IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' ",
                    hideValueMember: true,
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
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
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Hạng mục',
                    lookupKey: 'Project2',
                    binding: {
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId1 = '{EXPR=ProductCostId1}'",
                    hideValueMember: true,
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    visible: 'false'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CategoryCode',
                    label: 'Hạng mục',
                    lookupKey: 'Category',
                    binding: {
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    visible: 'false'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'BizDocId_PO',
                    label: 'Đơn đặt hàng mua',
                    lookupKey: 'BizDoc_CTC',
                    lookupfilter: "DocCode='PO' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND DocDate <= '{EXPR=DocDate}' AND Post_TheKho=1",
                    hideValueMember: true,
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Process',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentId=91",
                    hideValueMember: false,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ItemGroupCode',
                    label: 'Nhóm hàng',
                    lookupKey: 'Item',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ClassCode3= 'TM'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'SuppInvoiceCode',
                    label: 'Hóa đơn nhà cung cấp',
                    lookupKey: 'SuppInvoice',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND IsPaid=0 AND CustomerCode='{EXPR=CustomerCode}' AND ProductCostId='{EXPR=ProductCostId1}' AND ItemCode='{EXPR=ItemGroupCode}'",
                    hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'NumRound',
                    label: 'Làm tròn SL điều chỉnh',
                    lookupKey: 'Class',
                    lookupfilter: "ParentCode='NumRound'",
                    hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'File đính kèm',
                //     col: 6
                // }, this.srv),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    col: 6,
                    isDisabled: 'true'
                }),
                new CheckBoxInput({
                    key: 'CompletedApprove',
                    label: 'Đã hoàn thành duyệt',
                    isDisabled: 'true',
                    col: 6
                })
            ]
        })
    ];

    childColumns = [
        {
            header: 'Tên tài liệu',
            binding: 'Description',
            width: 250,
            validators: "{EXPR=Description} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 600,
            dataType: 'Object',
            validators: "{EXPR=FilePath}==0",
            validatorMessage: 'Yêu cầu đính kèm tài liệu',
            ignoreError: 1
            //exprReadOnly: "{EXPR=Attached} == true && {EXPR=Description} != ''"
        }
    ]

    childColumns1 = [
        {
            header: 'TT duyệt',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
            isReadOnly: 'true'
        },
        {
            header: 'Mã bộ phận',
            binding: 'DeptCode',
            width: 0,
            dataType: 'Array',
            lookupKey: 'Dept',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            isReadOnly: 'true'
        },
        {
            header: 'Tên bộ phận',
            binding: 'DeptName',
            width: 0,
            isReadOnly: 'true'
        },
        {
            header: 'Mã cấp bậc',
            binding: 'PositionCode',
            width: 0,
            dataType: 'Array',
            lookupKey: 'Position',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            isReadOnly: 'true'
        },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Mã nhân viên',
            binding: 'EmployeeCode',
            width: 150,
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId1}' AND PositionCode = '{EXPR=PositionCode}' UNION SELECT EmployeeCode FROM dbo.B10PurchaseHuman WHERE IsActive = 1 AND PositionCode = '{EXPR=PositionCode}')",
            validators: "{EXPR=EmployeeCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên nhân viên',
            binding: 'EmployeeName',
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Nhân viên duyệt được chỉ định',
            binding: 'EmployeeCodeReal',
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId1}' AND PositionCode = '{EXPR=PositionCode}')",
            width: 250,
            validators: "{EXPR=EmployeeCode} != '' && {EXPR=EmployeeCode}.toString().indexOf(',') > 0 && {EXPR=EmployeeCodeReal} == ''",
            validatorMessage: 'Không được bỏ trống giá trị',
            ignoreError: 1
        }
    ]

    childColumns2 = [
        {
            header: 'Tiêu chí',
            binding: 'Description',
            width: 450,
            isReadOnly: 'true'
        },
        {
            header: '⭐',
            binding: 'Bad',
            width: 100,
            dataType: 'Boolean'
        },
        {
            header: '⭐⭐',
            binding: 'Star2',
            width: 100,
            dataType: 'Boolean'
        },
        {
            header: '⭐⭐⭐',
            binding: 'Normal',
            width: 100,
            dataType: 'Boolean'
        },
        {
            header: '⭐⭐⭐⭐',
            binding: 'Star4',
            width: 100,
            dataType: 'Boolean'
        },
        {
            header: '⭐⭐⭐⭐⭐',
            binding: 'Good',
            width: 100,
            dataType: 'Boolean'
        },
        {
            header: 'Diễn giải',
            binding: 'Remark',
            width: 500,
            validators: "({EXPR=Bad} == true || {EXPR=Star2} == true) && ({EXPR=Normal} == false && {EXPR=Star4} == false && {EXPR=Good} ==false) && {EXPR=Remark} == ''",
            validatorMessage: 'Yêu cầu nhập Diễn giải khi đánh giá 1 sao hoặc 2 sao',
            ignoreError: 1
        }
    ]

    childColumns3 = [
        {
            header: 'Mã vật tư',
            binding: 'ItemCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Item',
            bindingList: {
                Name: 'Description',
                Unit: 'Unit',
                ConvertRate0: 'ConvertRate0'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentId IN (SELECT Id FROM B20Item WHERE Code = '{EXPR=ItemGroupCode}' AND IsActive=1)",
            width: 150
        },
        {
            header: 'Tên vật tư',
            binding: 'Description',
            isRequired: true,
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            dataType: 'Array',
            lookupKey: 'ItemUnit',
            lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND ItemCode={EXPR=ItemCode}",
            width: 80,
            isReadOnly: 'true'
        },
        {
            header: 'Đơn hàng mua',
            binding: 'BizDocId_PO',
            dataType: 'Array',
            lookupKey: 'BizDoc_CTC',
            hideValueMember: true,
            width: 0,
            isReadOnly: 'true'
        },
        {
            header: 'SL đơn hàng đặt',
            binding: 'QuantityPO',
            dataType: 'Number',
            width: 90,
            isReadOnly: 'true',
            format: 'n2'
        },
        {
            header: 'SL thực nhập',
            binding: 'Quantity9',
            dataType: 'Number',
            width: 100,
            format: 'n2'
        },
        {
            header: 'Quy đổi',
            binding: 'Quantity8',
            dataType: 'Number',
            width: 100,
            format: 'n4',
            isReadOnly: 'true'
        },
        {
            header: 'Đơn giá',
            binding: 'OriginalUnitCost',
            dataType: 'Number',
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: 'Thành tiền',
            binding: 'OriginalAmount9',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 100
        },
        {
            header: 'Mã thương hiệu',
            binding: 'TradeMarkCode',
            width: 150,
            dataType: 'Array',
            lookupKey: 'TradeMark',
            bindingList: {
                //Name: 'TradeMarkName'
            },
            lookupfilter: "IsActive=1 AND ItemGroupCode='{EXPR=ItemGroupCode}' AND Code IN (SELECT t.Val FROM dbo.B20ProductTradeMark OUTER APPLY dbo.ufn_sys_SplitString(TradeMarkCode,',') t WHERE ProductCostId='{EXPR=ProductCostId}')"
        },
        {
            header: 'Ngày thực nhận',
            binding: 'ReceiptDate',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Số lượng điều chỉnh',
            binding: 'QuantityAdjust',
            dataType: 'Number',
            format: 'n3',
            width: 90
        },
        {
            header: 'Đơn giá điều chỉnh',
            binding: 'UnitCostAdjust',
            dataType: 'Number',
            width: 90
        },
        {
            header: 'Thành tiền',
            binding: 'AmountAdjust',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 100
        },
        {
            header: 'Hóa đơn NCC',
            binding: 'SuppInvoiceCode',
            width: 100,
            dataType: 'Array',
            lookupKey: 'SuppInvoice',
            bindingList: {

            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND IsPaid=0 AND CustomerCode='{EXPR=CustomerCode}' AND ProductCostId='{EXPR=ProductCostId1}' AND ItemCode='{EXPR=ItemGroupCode}'"
        },
        {
            header: 'Tính giá theo ĐvQđ',
            binding: 'CalPriceByExchange',
            width: 100,
            dataType: 'Boolean',
            isReadOnly: 'true'
        },
        {
            header: 'Ghi chú',
            binding: 'Note',
            width: 0
        },
        {
            header: 'Hệ số',
            binding: 'ConvertRate0',
            width: 0,
            dataType: 'Number'
        },
        {
            header: 'NumRoundChild_',
            binding: 'NumRoundChild',
            dataType: 'Number',
            width: 0,
            isReadOnly: 'true',
            format: 'n2'
        },
        {
            header: 'SL còn lại đơn hàng',
            binding: 'QuantityPO_Remain',
            dataType: 'Number',
            width: 0,
            isReadOnly: 'true',
            format: 'n2'
        }
    ];
}
