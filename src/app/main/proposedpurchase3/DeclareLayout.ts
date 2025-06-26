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

// Danh sách đề nghị mua hàng (CHT)
export class LayoutProposedPurchase3Explorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_ExplorePP3',
                //FilterKey: "(ProductCostId1 = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'PP' AND IsActive=1 AND ApproveSend = 1 AND ('{VAR=User.IsAdmin}'='True' OR (ItemGroupCode IN (SELECT ItemGroupCode FROM dbo.ufn_TMCtc_NhomHang_Theo_NhanVien('{VAR=User.Ma_CbNv}','{VAR=Filter.ProductCostId}')) AND ProductCostId IN (SELECT ProductCostId FROM dbo.ufn_TMCtc_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",          
                FilterKey: "(ProductCostId1 = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'PP' AND IsActive=1 AND IsSplitVoucher=0 AND ApproveSend = 1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId1 IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'DocNo DESC, EstimatedTimeDeliveryMin',
                RowPage: 50,
                DefaultValues: {
                    CurrencyCode: 'VND'
                }
            },
            Child: {
                Name: 'vB30BizDocApprove_Explorer',
                ParentKey: 'BizDocId',
                ChildKey: 'BizDocId',
                OrderBy: 'ApproveGroup'
            },
            Child1: {
                Name: 'vB30BizDoc_Explore',
                ParentKey: 'BizDocId',
                ChildKey: 'ParentBizDocId',
                OrderBy: 'DocNo'
            },
        },
        PrintDocument: {
            Key: 'BizDocViewer',
            Text: 'Mẫu in Đề nghị mua hàng',
            Command: 'usp_B30BizDoc_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Đề nghị mua hàng",
                    FileName: "Đề nghị mua hàng - {EXPR=DocNo}",
                    WordName: "BM-F006b-Rev00 De Nghi Mua Hang.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ],
            PrintGrid: [
                {
                    header: 'STT/ No',
                    binding: 'OrderNo',
                    width: 30,
                    dataType: 'String',
                    align: 'center'
                },
                {
                    header: 'Tên hàng hóa/ Iterm',
                    binding: 'ItemName',
                    width: 140,
                    dataType: 'String'
                },
                {
                    header: 'Thương hiệu/ Brand',
                    width: 60,
                    dataType: 'String'
                },
                {
                    header: 'Số lượng/ Quantity',
                    binding: 'Quantity',
                    width: 60,
                    dataType: 'Number',
                    format: 'n0'
                },
                {
                    header: 'Qui đổi/ Convert',
                    binding: 'Quantity8',
                    width: 60,
                    dataType: 'Number',
                    format: 'n3'
                },
                {
                    header: 'Đơn giá/ Price',
                    binding: 'OriginalUniCost',
                    width: 60,
                    dataType: 'Number'
                },
                {
                    header: 'Thành tiền/ Total',
                    binding: 'OriginalAmount',
                    width: 70,
                    dataType: 'Number'
                },
                {
                    header: 'Thời gian nhận hàng/ Delivery time',
                    binding: 'EstimatedTimeDelivery',
                    width: 80,
                    dataType: 'Date',
                    format: 'dd/MM/yyyy'
                },
                {
                    header: 'Ghi chú/ mark',
                    binding: 'ReceiptTeam',
                    width: 80,
                    dataType: 'String'
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
        Filter: "IsGroup=0 AND CommandWeb = 'proposedpurchase3'",
        ColumnFilter: 'DocStatusKeyTM'
    }

    lookup3 = {
        Table: 'B00TMCtcDocStatus',
        Filter: "CommandWeb = 'rowsPage'",
    }

    menu = {
        Table: 'B20Item',
        Filter: "IsGroup=1 AND IsActive=1 AND ClassCode3 = 'TM'",
        parameter: { 'Commandkey': 'proposedpurchase2-editor', 'ItemGroupCode': '{EXPR=Code}' }
    }

    linkwizard = {
        key: 'WIZARD_CTC_TINHGIA',
        parameter: { 'Commandkey': 'WIZARD_CTC_TINHGIA', 'BizDocId': '{EXPR=BizDocId}', 'BranchCode': '{EXPR=BranchCode}', 'DocDate1': '{EXPR=DocDate}', 'ItemGroupCode': '{EXPR=ItemGroupCode}', 'UserName': '{VAR=User.UserName}' }
    }

    parentGrid = [
        {
            header: 'Ngày phiếu',
            binding: 'DocDate',
            width: 100,
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Số phiếu',
            binding: 'DocNo',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Số theo dõi',
            binding: 'DocNo2',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Người tạo',
            binding: 'FullName',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Nhận hàng từ ngày',
            binding: 'EstimatedTimeDeliveryMin',
            width: 170,
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Đến ngày',
            binding: 'EstimatedTimeDeliveryMax',
            width: 200,
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Số ngày',
            binding: 'DateDiff_MinMax',
            width: 100,
            dataType: 'Number'
        },
        {
            header: 'Thông tin khác',
            binding: 'Description',
            width: 250,
            dataType: 'String'
        },
        {
            header: 'Gói thầu',
            binding: 'TenGoiThau',
            width: 200,
            dataType: 'String'
        },
        {
            header: '_Id',
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

    childGrid1 = [
        {
            header: 'Ngày lập',
            binding: 'DocDate',
            format: 'dd/MM/yyyy',
            width: 120
        },
        {
            header: 'Số đơn hàng',
            binding: 'DocNo',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Nhà cung cấp',
            binding: 'CustomerName',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Tổng tiền hàng',
            binding: 'OriginalAmount',
            width: 150,
            dataType: 'Number'
        },
        {
            header: 'Trạng thái',
            binding: 'DocStatusName',
            width: 150,
            dataType: 'String'
        }
    ]
}

export class LayoutProposedPurchase3Editor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    // Khai báo view lấy dữ liệu <Tables> B7
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_EditPP',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'PP',
                    DocStatus: '1',
                    BizDocId: '',
                    CurrencyCode: 'VND',
                    Id: -1,
                    IsWebData: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                },
                ResetNewAsCopy: 'Id,BizDocId'
            },
            Child: [
                {
                    Name: 'vB30BizDocDetail_EditPP',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        CCMBudgetId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        DocDate: 'Parent.DocDate'
                    },
                    ResetNewAsCopy: 'Id,BizDocId,RowId'
                },
                {
                    Name: 'vB30BizDocRecepitPerson_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        CCMBudgetId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    },
                    ResetNewAsCopy: 'Id,BizDocId,RowId'
                }
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Mẫu in Đề nghị mua hàng',
            Command: 'usp_B30BizDoc_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Đề nghị mua hàng",
                    FileName: "Đề nghị mua hàng - {EXPR=DocNo}",
                    WordName: "BM-F006b-Rev00 De Nghi Mua Hang.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ],
            PrintGrid: [
                {
                    header: 'STT/ No',
                    binding: 'OrderNo',
                    width: 30,
                    dataType: 'String',
                    align: 'center'
                },
                {
                    header: 'Tên hàng hóa/ Iterm',
                    binding: 'ItemName',
                    width: 140,
                    dataType: 'String'
                },
                {
                    header: 'Thương hiệu/ Brand',
                    width: 60,
                    dataType: 'String'
                },
                {
                    header: 'Số lượng/ Quantity',
                    binding: 'Quantity',
                    width: 60,
                    dataType: 'Number',
                    format: 'n0'
                },
                {
                    header: 'Qui đổi/ Convert',
                    binding: 'Quantity8',
                    width: 60,
                    dataType: 'Number',
                    format: 'n3'
                },
                {
                    header: 'Đơn giá/ Price',
                    binding: 'OriginalUniCost',
                    width: 60,
                    dataType: 'Number'
                },
                {
                    header: 'Thành tiền/ Total',
                    binding: 'OriginalAmount',
                    width: 70,
                    dataType: 'Number'
                },
                {
                    header: 'Thời gian nhận hàng/ Delivery time',
                    binding: 'EstimatedTimeDelivery',
                    width: 80,
                    dataType: 'Date',
                    format: 'dd/MM/yyyy'
                },
                {
                    header: 'Ghi chú/ mark',
                    binding: 'ReceiptTeam',
                    width: 80,
                    dataType: 'String'
                }
            ]
        }
    };

    menu = {
        Table: 'vB20Item',
        Filter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ParentId = (SELECT Id FROM B20Item WHERE Code={EXPR=ItemGroupCode})",
        FieldSearch: 'Name',
        OrderBy: 'Name',
        RowItem: 1000,
        AddToColumn: { 'ItemCode': 'Code', 'Description': 'Name', 'Unit': 'Unit', 'ConvertRate9': '1', 'Quantity9': '1' },
        DuplicationField: 'ItemCode',
        ColumnEdit: 'Quantity9',
        ColumnShow: 'QuantityShowWeb',
        ColumnInput: 'QuantityInputWeb',
        PrimaryField: 'Code'

    }

    evaluators = {
        'Evaluator_DocDate_DefaultFromParent': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'DocDate',
            Value: 'DocDate',
            Tables: 0
        },
        'Evaluator_Set_ItemGroupCode_BindingFromParent': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'ItemGroupCode',
            Value: 'ItemGroupCode',
            Tables: 0,
            zExpr: "ItemGroupCode != ''"
        },
        'Evaluator_Set_ProductCostId_BindingFromParent': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'ProductCostId',
            Value: 'ProductCostId',
            Tables: 1,
            zExpr: "ProductCostId != ''"
        },
        'Evaluator_Set_EstimatedTimeDelivery_BindingFromParent': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'EstimatedTimeDelivery',
            Value: 'EstimatedCompletionDate',
            Tables: 0
        },
        'Evaluator_BizDocDetail_Quantity_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Quantity",
            Value: "Quantity9*ConvertRate9",
            Tables: 0
        },
        //server constraint
        'Evaluator_ServerConstraint_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},DocCode,DocDate,{VAR=VoucherCode_DN},ProductCostId',
            Command: 'ufn_AutoGenVoucherNoByPrefix_BizDoc_VoucherCode',
            DataMember: 'DocNo',
            zExpr: "ProductCostId != ''"
        },
        'Evaluator_ServerConstraint_QuyDoi_TrongLuongThep': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ItemCode,Quantity9,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_TrongLuongThepQuyDoi',
            zExpr: "Quantity9 != ''",
            DataMember: 'Quantity8',
            Tables: 0
        },
        'Evaluator_TotalQuantity_Calculate': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "TotalQuantity",
            Value: 'Quantity9',
            Tables: 0
        },
        'Evaluator_TotalQuantity_QuyDoi_Calculate': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "TotalQuantity_QuyDoi",
            Value: 'Quantity8',
            Tables: 0
        },
        //server constrain with xml
        'Evaluator_ServerConstraint_LoadReceiptTeamCode': {
            EvaluatorName: 'EvaluatorQueryXmlLoadChild',
            ConstraintKey: 'BranchCode',
            ParameterXmlName: 'B30BizDocDetailPP',
            Tables: 0,
            Command: 'usp_TMCtc_LoadReceiptTeamCode',
            zExpr: "ReceiptTeamCode != ''",
            OutputTable: 1
        },
        //server updated
        'Evaluator_ServerUpdated_BuiltinOrder': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=TableNames_B30CCMBudgetDetail},{VAR=Keys_B30CCMBudgetDetail},{VAR=FieldOrders2_B30CCMBudgetDetail},CCMBudgetId,{VAR=EmptyField_BizDocId},{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_Web_SetBuiltionOrder'
        },
        'Evaluator_ServerUpdating_UpdateStatusByApproveStatus': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Id',
            Command: 'usp_Coteccons_BizDocPP_UpdateDocStatus'
        },
        'Evaluator_GetMin_ReceiptTeamCode': {
            EvaluatorName: 'EvaluatorFirstChild',
            DataMember: "ReceiptTeamCode",
            Value: 'ReceiptTeamCode',
            Tables: 1
        },
        'Evaluator_Set_ReceiptTeamCode_BindingFromParent': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'ReceiptTeamCode',
            Value: 'ReceiptTeamCode',
            Tables: 0,
            zExpr: '1==0'
        },
        'Evaluator_B30BizDocDetail_CopiedValue': {
            EvaluatorName: 'EvaluatorCopiedValues',
            DataMember: 'ItemCode,ReceiptTeamCode,Description',
            Tables: 0
        }
    };

    serverConstraint = [
        //'Evaluator_ServerConstraint_DefaultDocNo'
    ];

    serverUpdating = [
    ]

    serverUpdated = [
    ];

    buttonLoadChild: string[];

    buttonCommand: string[] = [
    ];

    importCommand: string[] = [
    ]

    columnChanged = {
        // ItemGroupCode:{
        //     Evaluators:[
        //         'Evaluator_Set_ItemGroupCode_BindingFromParent'
        //     ]
        // },
        // EstimatedCompletionDate:{
        //     Evaluators:[
        //         'Evaluator_Set_EstimatedTimeDelivery_BindingFromParent'
        //     ]
        // },
        // ProductCostId:{
        //     Evaluators:[
        //         'Evaluator_Set_ProductCostId_BindingFromParent'
        //     ]
        // },
    };

    rowAdded = [
        // {
        //     Tables:0,
        //     Evaluators:[
        //         'Evaluator_Set_EstimatedTimeDelivery_BindingFromParent',
        //         'Evaluator_Set_ReceiptTeamCode_BindingFromParent',
        //         //'Evaluator_Set_ItemGroupCode_BindingFromParent',
        //         'Evaluator_B30BizDocDetail_CopiedValue'                
        //     ]
        // },
        // {
        //     Tables:1,
        //     Evaluators:[
        //         'Evaluator_Set_ProductCostId_BindingFromParent'
        //     ]
        // }
    ]

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
                Quantity9: {
                    Evaluators: [
                        //'Evaluator_ServerConstraint_QuyDoi_TrongLuongThep',
                        //'Evaluator_TotalQuantity_Calculate'
                    ]
                },
                Quantity8: {
                    Evaluators: [
                        'Evaluator_TotalQuantity_QuyDoi_Calculate'
                    ]
                },
                ReceiptTeamCode: {
                    Evaluators: [
                        //'Evaluator_ServerConstraint_LoadReceiptTeamCode'
                    ]
                }
            }
        },
        {
            Tables: 1,
            columnChanged: {
                ReceiptTeamCode: {
                    Evaluators: [
                        //'Evaluator_GetMin_ReceiptTeamCode'
                    ]
                }
            }
        }
    ];

    columnsReadOnly = [];

    linkReporter = {
        // 'btnBaoCao': {
        //     directory: 'reporterplansigncon',
        //     type: 'view',
        //     key: 'REP02_CCM_KHKK'
        // }
    }

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
                    col: 12,
                    labelCol: 5,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số phiếu',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12,
                    labelCol: 5,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                // new TextBoxInput({
                //     key: 'DocNo2',
                //     label: 'Số theo dõi',
                //     type: 'text',
                //     validators: [Validators.required],
                //     col: 12,
                //     labelCol: 5
                // }),                 
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
                    labelCol: 5,
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
                    labelCol: 5,
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
                    labelCol: 5,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CategoryCode',
                    label: 'Hạng mục',
                    lookupKey: 'Category',
                    binding: {
                    },
                    labelCol: 5,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ItemGroupCode',
                    label: 'Nhóm hàng',
                    lookupKey: 'Item',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ClassCode3= 'TM'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12,
                    labelCol: 5,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCode',
                    label: 'Người đại diện',
                    lookupKey: 'Employee',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHumanPurchase WHERE PositionCode IN ('CB-012','CB-015') AND ProductCostId = '{EXPR=ProductCostId}')",
                    hideValueMember: true,
                    col: 12,
                    labelCol: 5,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new DateBoxInput({
                    key: 'EstimatedCompletionDate',
                    label: 'Ngày cần nhận hàng',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 12,
                    labelCol: 5,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Thông tin khác',
                    type: 'text',
                    col: 12,
                    labelCol: 5,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'TotalQuantity',
                    label: 'Tổng số lượng',
                    type: 'number',
                    format: 'n4',
                    col: 12,
                    labelCol: 5,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'TotalQuantity_QuyDoi',
                    label: 'Tổng số lượng quy đổi',
                    type: 'number',
                    format: 'n4',
                    col: 12,
                    labelCol: 5,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new UploadInput({
                    key: 'FilePath',
                    label: 'File đính kèm',
                    col: 12,
                    labelCol: 5,
                    isOnlyDownload: true
                }, this.srv),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    labelCol: 5,
                    col: 12,
                    isDisabled: 'true'
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
            header: 'Hàng hóa, vật tư',
            binding: 'ItemCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Item',
            bindingList: {
                Name: 'Description',
                Unit: 'Unit'
            },
            lookupfilter: "ParentId IN (SELECT Id FROM B20Item WHERE Code = '{EXPR=ItemGroupCode}') AND IsActive=1 AND IsGroup=0 AND BranchCode = '{VAR=Branch.Ma_Dvcs}'",
            width: '2.5*',
            validators: "{EXPR=ItemCode} == ''",
            validatorMessage: 'Giá trị nhập không hợp lệ',
            ignoreError: 1
        },
        {
            header: 'Diễn giải',
            binding: 'Description',
            isRequired: true,
            width: '2.5*'
        },
        {
            header: 'Đặc tả',
            binding: 'Remark',
            width: '1.0*'
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            dataType: 'Array',
            lookupKey: 'ItemUnit',
            bindingList: {
                ConvertRate: 'ConvertRate9'
            },
            lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND ItemCode='{EXPR=ItemCode}'",
            width: '0.8*'
        },
        {
            header: 'Số lượng',
            binding: 'Quantity9',
            dataType: 'Number',
            step: 1,
            format: 'n2',
            isRequired: true,
            width: '1.0*',
            validators: "{EXPR=Quantity9} < 0",
            validatorMessage: 'Giá trị nhập không hợp lệ',
            ignoreError: 1
        },
        {
            header: 'Quy đổi (kg)',
            binding: 'Quantity8',
            dataType: 'Number',
            format: 'n4',
            isReadOnly: 'true',
            width: '1.0*'
        },
        {
            header: 'Ngày nhận hàng',
            binding: 'EstimatedTimeDelivery',
            width: '1.5*',
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Đơn vị nhận hàng',
            binding: 'ReceiptTeamCode',
            width: '1.5*',
            dataType: 'Array',
            lookupKey: 'ReceiptTeam',
            lookupfilter: "ProductCostId1 = '{EXPR=ProductCostId1}' AND ItemGroupCode = '{EXPR=ItemGroupCode}'"
        },
        {
            header: 'Nhóm hàng',
            binding: 'ItemGroupCode',
            width: 0,
            isReadOnly: 'true'
        }
    ];

    childColumns1 = [
        {
            header: 'STT',
            binding: 'BuiltinOrder',
            dataType: 'Number',
            format: 'n0',
            width: 0
        },
        {
            header: 'Đơn vị nhận hàng',
            binding: 'ReceiptTeamCode',
            width: '1.5*',
            dataType: 'Array',
            lookupKey: 'ReceiptTeam',
            lookupfilter: "ProductCostId1 = '{EXPR=ProductCostId1}' AND ItemGroupCode = '{EXPR=ItemGroupCode}'"
        },
        {
            header: 'Người nhận hàng',
            binding: 'ReceiptPerson',
            width: '2*',
            dataType: 'Array',
            lookupKey: 'ReceiptPerson',
            lookupfilter: "ParentCode = '{EXPR=ReceiptTeamCode}'"
        },
        {
            header: 'SĐT',
            binding: 'PhoneNo',
            width: '1.5*'
        },
        {
            header: 'Chức vụ',
            binding: 'Position',
            width: '1.5*'
        },
        {
            header: 'Công trường',
            binding: 'ProductCostId',
            width: 0
        }
    ];
}