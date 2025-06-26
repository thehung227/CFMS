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

// Đề nghị mua hàng 2 (QS)
export class LayoutProposedPurchase2Explorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_ExplorePP2',
                //FilterKey: "(ProductCostId1 = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'PP' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR (ItemGroupCode IN (SELECT ItemGroupCode FROM dbo.ufn_TMCtc_NhomHang_Theo_NhanVien('{VAR=User.Ma_CbNv}','{VAR=Filter.ProductCostId}')) AND ProductCostId IN (SELECT ProductCostId FROM dbo.ufn_TMCtc_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                FilterKey: "(ProductCostId1 = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'PP' AND IsActive=1 AND IsSplitVoucher=0 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId1 IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'DocNo DESC,EstimatedTimeDeliveryMin',
                RowPage: 50,
                DefaultValues: {
                    CurrencyCode: 'VND'
                }
            },
            Child: {
                Name: 'vB30BizDoc_Explore',
                ParentKey: 'BizDocId',
                ChildKey: 'ParentBizDocId',
                OrderBy: 'DocNo'
            }
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

    menu = {
        Table: 'vB20Item_MenuFilter',
        Filter: "IsGroup=1 AND IsActive=1 AND ClassCode3 = 'TM' AND IsShowMenuWeb = 1",
        parameter: { 'Commandkey': 'proposedpurchase2-editor', 'ItemGroupCode': '{EXPR=Code}', 'ProductCostId0': '{VAR=Filter.ProductCostIdParent}', 'ProductCostId1': '{VAR=Filter.ProductCostId}' }
    }

    lookup1 = {
        Table: 'vB20Item_MenuFilter',
        Filter: "IsGroup=1 AND IsActive=1 AND ClassCode3 = 'TM' AND IsShowMenuWeb = 1",
        ColumnFilter: 'ItemGroupCode'
    }
    lookup2 = {
        Table: 'B00TMCtcDocStatus',
        Filter: "IsGroup=0 AND CommandWeb = 'proposedpurchase2'",
        ColumnFilter: 'DocStatusKeyTM'
    }
    lookup3 = {
        Table: 'B00TMCtcDocStatus',
        Filter: "CommandWeb = 'rowsPage'",
    }

    linkwizard = {
        key: 'WIZARD_CTC_TINHGIA',
        parameter: { 'Commandkey': 'WIZARD_CTC_TINHGIA', 'BizDocId': '{EXPR=BizDocId}', 'BranchCode': '{EXPR=BranchCode}', 'DocDate1': '{EXPR=DocDate}' }
    }

    parentGrid = [
        {
            header: 'Ngày tạo',
            binding: 'CreatedAt_HaNoi',
            width: 120,
            format: 'dd/MM/yyyy HH:mm'
        },
        {
            header: 'Ngày phiếu',
            binding: 'DocDate',
            width: 110,
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
            header: 'Nhóm hàng',
            binding: 'ItemGroupName',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Nhận hàng từ ngày',
            binding: 'EstimatedTimeDeliveryMin',
            width: 120,
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Đến ngày',
            binding: 'EstimatedTimeDeliveryMax',
            width: 100,
            format: 'dd/MM/yyyy',

        },
        {
            header: 'Số ngày',
            binding: 'DateDiff_MinMax',
            width: 80,
            dataType: 'Number'
        },
        {
            header: 'Thông tin khác',
            binding: 'Description',
            width: 250,
            dataType: 'String'
        },
        {
            header: 'Người tạo',
            binding: 'FullName',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Người duyệt',
            binding: 'XuLyTiepTheo',
            width: 200,
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

export class LayoutProposedPurchase2Editor implements IEditorFormulaDeclaration {

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
                    IsShowMenuWeb: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                },
                ResetNewAsCopy: 'Id,BizDocId,CreatedBy',
                ResetWhenSplit: 'Id,BizDocId,CreatedBy',
                CopyWhenSplit: [{ FromColumn: 'BizDocId', ToColumn: 'ParentBizDocId' }],
                ResetValueForm: {
                    ApproveSend: false,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    DocNo: ""
                }
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
                    ResetNewAsCopy: 'Id,BizDocId,RowId',
                    ResetWhenSplit: 'Id,BizDocId,RowId'
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
                    ResetNewAsCopy: 'Id,BizDocId,RowId',
                    ResetWhenSplit: 'Id,BizDocId,RowId'
                },
                {
                    Name: 'vB30BizDocApprove_AEditContract',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    },
                    ResetNewAsCopy: 'Id,BizDocId,RowId',
                    ResetWhenSplit: 'Id,BizDocId,RowId'
                }
            ],
        }
    };

    menu = {
        Table: 'vB20Item_DNMH',
        Filter: "IsGroup=0 AND IsShowMenuWeb = 1 AND IsStopBusiness=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ParentId = (SELECT Id FROM B20Item WHERE Code={EXPR=ItemGroupCode}) AND Code IN (SELECT ItemCode FROM dbo.ufn_TMCtc_GetItemByPurchaseLimit('{VAR=Filter.ProductCostId}',{EXPR=ItemGroupCode},'{VAR=Branch.Ma_Dvcs}'))",
        FieldSearch: 'Name',
        OrderBy: 'Name',
        RowItem: 1000,
        AddToColumn: { 'ItemCode': 'Code', 'Description': 'Name', 'Unit': 'Unit', 'ConvertRate9': '1', 'Quantity9': '1', 'Remark': 'Remark' },
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
        // 'Evaluator_ServerConstraint_DefaultDocNo': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: '{VAR=Branch.Ma_Dvcs},DocCode,DocDate,{VAR=VoucherCode_DN},ProductCostId',
        //     Command: 'ufn_AutoGenVoucherNoByPrefix_BizDoc_VoucherCode',
        //     DataMember: 'DocNo',
        //     zExpr: "ProductCostId != ''"
        // },
        // 'Evaluator_ServerConstraint_Check_Unique_DocNo': {
        //     EvaluatorName: 'EvaluatorValidate',
        //     ConstraintKey: '{VAR=Branch.Ma_Dvcs},BizDocId,DocCode,DocNo',
        //     Command: 'ufn_B30BizDoc_CheckUniqueDocNo',
        //     MessageText: 'Số phiếu phải duy nhất',
        //     IgnoreError: 0
        // }, 
        // 'Evaluator_ServerConstraint_QuyDoi_TrongLuongThep': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: 'ItemCode,Quantity9,{VAR=Branch.Ma_Dvcs}',
        //     Command: 'ufn_Coteccons_TrongLuongThepQuyDoi',
        //     zExpr: "Quantity9 != ''",
        //     DataMember: 'Quantity8',
        //     Tables: 0
        // },
        'Evaluator_ServerConstraint_QuyDoi_TrongLuongThep': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Quantity8",
            Value: "Quantity9*ConvertRate9",
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
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,{VAR=EmptyField_ParentBizDocId}',
            Command: 'usp_B30BizDocApprove_GetData',
            OutputTable: 2
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
            DataMember: 'ReceiptTeamCode',
            Tables: 0
        },
        'Evaluator_ServerConstraint_Check_UserModified': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: '{VAR=User.Id},BizDocId,DocCode',
            Command: 'ufn_Coteccons_CheckUser_ModifiedBy',
            MessageText: 'Không được điều chỉnh dữ liệu của người dùng khác',
            IgnoreError: 0,
            zExpr: 'Id > 0 && IsSplitVoucher == 0'
        },
        'Evaluator_ServerConstraint_Check_EstimatedCompletionDate': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "DocDate,EstimatedCompletionDate",
            Command: 'ufn_TMCtc_Check_EstimatedCompletionDate',
            MessageText: 'Ngày cần nhận hàng phải lớn hơn ngày đặt hàng',
            IgnoreError: 0
        },
        // 'Evaluator_ServerConstraint_CheckChange_BizDocPP': {
        //     EvaluatorName: 'EvaluatorValidate',
        //     ConstraintKey: 'BizDocId,DocCode,{VAR=Branch.Ma_Dvcs}',
        //     Command: 'ufn_TMCtc_CheckChangeBizDocPP',
        //     MessageText: 'Không được thay đổi đề nghị khi trạng thái đã hoàn thiện',
        //     IgnoreError: 0
        // },
        //server updated
        'Evaluator_ServerUpdated_BuiltinOrder': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=TableNames_B30CCMBudgetDetail},{VAR=Keys_B30CCMBudgetDetail},{VAR=FieldOrders2_B30CCMBudgetDetail},CCMBudgetId,{VAR=EmptyField_BizDocId},{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_Web_SetBuiltionOrder'
        },
        'Evaluator_ServerUpdated_Add_B20ProductOriginalPrice': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Id',
            Command: 'usp_TMCtc_AddToProductOriginalPrice'
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},BizDocId,{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerUpdated_QuyDoi_TrongLuongThep': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_TMCtc_UpdatePP_Quantity8'
        },
        'Evaluator_ServerUpdated_BizDocDetail_UpdateFromParent': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Coteccons_BizDocDetail_UpdateFromParentWEB'
        },
        'Evaluator_DocStatus_DocNo_UpdateWhenSplit': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,Id,{VAR=Branch.Ma_Dvcs},DocNo',
            Command: 'usp_TMCtc_UpdateDocStatus_SplitPP',
            zExpr: "IsSplitVoucher == true"
        },
        'Evaluator_DocNo_Create': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Id,{VAR=Branch.Ma_Dvcs},DocCode,DocNo,DocDate',
            Command: 'usp_TMCtc_CreateDocNoPP',
            zExpr: "DocNo == ''"
        }
    };

    serverConstraint = [
    ];

    serverUpdating = [
        'Evaluator_ServerConstraint_Check_UserModified',
        'Evaluator_ServerConstraint_Check_EstimatedCompletionDate'
    ]

    serverUpdated = [
        'Evaluator_ServerUpdated_QuyDoi_TrongLuongThep',
        'Evaluator_ServerUpdated_BizDocDetail_UpdateFromParent',
        'Evaluator_ServerUpdated_Add_B20ProductOriginalPrice',
        'Evaluator_UpdateInfo_WhenApproveSend',
        'Evaluator_DocNo_Create',
        'Evaluator_DocStatus_DocNo_UpdateWhenSplit'
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
        EstimatedCompletionDate: {
            Evaluators: [
                'Evaluator_Set_EstimatedTimeDelivery_BindingFromParent'
            ]
        },
        ProcessCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_Approve_GetData'
            ]
        }
    };

    rowAdded = [
        {
            Tables: 0,
            Evaluators: [
                'Evaluator_Set_EstimatedTimeDelivery_BindingFromParent',
                'Evaluator_Set_ReceiptTeamCode_BindingFromParent',
                //'Evaluator_Set_ItemGroupCode_BindingFromParent', copy value bị mất đầu phiếu
                'Evaluator_B30BizDocDetail_CopiedValue'
            ]
        },
        {
            Tables: 1,
            Evaluators: [
                'Evaluator_Set_ProductCostId_BindingFromParent'
            ]
        }
    ]

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
                Quantity9: {
                    Evaluators: [
                        'Evaluator_ServerConstraint_QuyDoi_TrongLuongThep',
                        'Evaluator_TotalQuantity_Calculate',
                        'Evaluator_BizDocDetail_Quantity_Calculator'
                    ]
                },
                ConvertRate9: {
                    Evaluators: [
                        'Evaluator_ServerConstraint_QuyDoi_TrongLuongThep',
                        'Evaluator_BizDocDetail_Quantity_Calculator'
                    ]
                },
                Quantity8: {
                    Evaluators: [
                        'Evaluator_TotalQuantity_QuyDoi_Calculate'
                    ]
                },
                ReceiptTeamCode: {
                    Evaluators: [
                        'Evaluator_ServerConstraint_LoadReceiptTeamCode'
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
                    isReadOnly: 'true',
                    col: 12,
                    labelCol: 5
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số phiếu',
                    type: 'text',
                    col: 12,
                    labelCol: 5,
                    isReadOnly: 'true'
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
                    lookupfilter: "IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND RowId = '{VAR=Filter.ProductCostIdParent}'",
                    hideValueMember: true,
                    validators: [Validators.required],
                    isReadOnly: 'true',
                    col: 12,
                    labelCol: 5
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
                    isReadOnly: 'true',
                    validators: [Validators.required],
                    col: 12,
                    labelCol: 5
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
                    labelCol: 5
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
                    labelCol: 5
                }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'ProductCostId',
                //     label: 'Công trường',
                //     lookupKey: 'Project2',
                //     binding: {
                //     },
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                //     validators: [Validators.required],
                //     hideValueMember: true,
                //     col: 12,
                //     labelCol: 5
                // }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ItemGroupCode',
                    label: 'Nhóm hàng',
                    lookupKey: 'Item',
                    isDisabled: 'true',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ClassCode3= 'TM'", //AND BranchCode='{VAR=Branch.Ma_Dvcs}'
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12,
                    labelCol: 5
                }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'EmployeeCode',
                //     label: 'Người đại diện',
                //     lookupKey: 'Employee',
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHumanPurchase WHERE PositionCode IN ('CB-012','CB-015') AND ProductCostId = '{EXPR=ProductCostId}')",
                //     hideValueMember: true,
                //     col: 12,
                //     labelCol: 5
                // }, this.srv, this.parentData),
                new DateBoxInput({
                    key: 'EstimatedCompletionDate',
                    label: 'Ngày cần nhận hàng',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 12,
                    labelCol: 5
                }),
                new UploadInput({
                    key: 'FilePath',
                    label: 'File đính kèm',
                    col: 12,
                    labelCol: 5,
                    isOnlyDownload: false
                }, this.srv),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Thông tin khác',
                    type: 'text',
                    col: 12,
                    labelCol: 5
                }),
                new NumberBoxInput({
                    key: 'TotalQuantity',
                    label: 'Tổng khối lượng',
                    type: 'number',
                    format: 'n4',
                    col: 12,
                    labelCol: 5,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'

                }),
                new NumberBoxInput({
                    key: 'TotalQuantity_QuyDoi',
                    label: 'Tổng khối lượng quy đổi',
                    type: 'number',
                    format: 'n4',
                    col: 12,
                    labelCol: 5,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Process',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentId=35",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12,
                    labelCol: 5
                }, this.srv, this.parentData),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    labelCol: 5,
                    col: 12,
                    isDisabled: 'true'
                }),
                // new NumberBoxInput({
                //     key: 'DocStatus',
                //     label: 'Trạng thái',
                //     type: 'number',
                //     col: 12,
                //     labelCol: 5,
                //     isReadOnly: 'true'
                // })
                new TextBoxInput({
                    key: 'BizDocId',
                    label: '_BizDocId',
                    type: 'text',
                    visible: 'false',
                    labelCol: 5,
                    col: 12
                }),
                // new NumberBoxInput({
                //     key: 'Id',
                //     label: '_Id',
                //     type: 'number',
                //     visible: 'true',
                //     labelCol: 5,
                //     col: 12
                // })
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
            header: 'Mã hàng',
            binding: 'ItemCode',
            dataType: 'Array',
            lookupKey: 'ItemLimit',
            bindingList: {
                Name: 'Description',
                Unit: 'Unit',
                RequireAttribute: 'RequireAttribute',
                ConvertRate0: 'ConvertRate9',
                Remark: 'Remark'
            },
            lookupfilter: "ParentId IN (SELECT Id FROM B20Item WHERE Code = '{EXPR=ItemGroupCode}') AND IsStopBusiness=0 AND IsShowMenuWeb = 1 AND IsActive=1 AND IsGroup=0 AND BranchCode = '{VAR=Branch.Ma_Dvcs}'",
            width: '2.5*',
            validators: "{EXPR=ItemCode} == ''",
            validatorMessage: 'Giá trị nhập không hợp lệ',
            ignoreError: 1
        },
        {
            header: 'Diễn giải',
            binding: 'Description',
            width: '2.5*',
            validators: "{EXPR=Description} == ''",
            validatorMessage: 'Giá trị nhập không hợp lệ',
            ignoreError: 1
        },
        {
            header: 'Mô tả',
            binding: 'Remark',
            width: '1.0*',
            validators: "{EXPR=RequireAttribute} == true && {EXPR=Remark} == '' ",
            validatorMessage: 'Giá trị nhập không hợp lệ',
            ignoreError: 1
        },
        {
            header: 'Đvt đề nghị',
            binding: 'Unit',
            dataType: 'Array',
            lookupKey: 'ItemUnit',
            bindingList: {
                ConvertRate: 'ConvertRate9'
            },
            lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND ItemCode='{EXPR=ItemCode}'",
            width: '0.8*',
            validators: "{EXPR=Unit} == ''",
            validatorMessage: 'Giá trị nhập không hợp lệ',
            ignoreError: 1,
            isReadOnly: 'true'
        },
        {
            header: 'Số lượng',
            binding: 'Quantity9',
            dataType: 'Number',
            step: 1,
            format: 'n2',
            width: '1.0*',
            validators: "{EXPR=Quantity9} <= 0",
            validatorMessage: 'Giá trị nhập không hợp lệ',
            ignoreError: 1
        },
        {
            header: 'Quy đổi đề nghị',
            binding: 'Quantity8',
            dataType: 'Number',
            format: 'n2',
            isReadOnly: 'true',
            width: '1.0*',
            //visible: "'{EXPR=ItemGroupCode}' != 'THEP'"
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
            lookupfilter: "ProductCostId1 = '{EXPR=ProductCostId1}' AND ItemGroupCode = '{EXPR=ItemGroupCode}' AND Lock = 0",
            validators: "{EXPR=ReceiptTeamCode} == ''",
            validatorMessage: 'Giá trị nhập không hợp lệ',
            ignoreError: 1
        },
        {
            header: 'Nhóm hàng',
            binding: 'ItemGroupCode',
            width: 0,
            isReadOnly: 'true'
        },
        {
            header: 'Yêu cầu đặc tả',
            binding: 'RequireAttribute',
            width: 0,
            isReadOnly: 'true'
        },
        {
            header: 'Số lượng',
            binding: 'Quantity',
            dataType: 'Number',
            format: 'n2',
            width: 0
        },
        {
            header: 'Hệ số',
            binding: 'ConvertRate9',
            width: 0,
            format: 'n4',
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

    childColumns2 = [
        {
            header: 'STT duyệt',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 70,
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
            width: '2*',
            isReadOnly: 'true'
        },
        {
            header: 'Mã nhân viên',
            binding: 'EmployeeCode',
            width: '2*',
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId1}' AND PositionCode = '{EXPR=PositionCode}')",
            validators: "{EXPR=EmployeeCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        // {
        //     header: 'Tên nhân viên',
        //     binding: 'EmployeeName',
        //     width: '2*',
        //     isReadOnly: 'true'
        // },
        {
            header: 'Nhân viên duyệt chỉ định',
            binding: 'EmployeeCodeReal',
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE ProductCostId='{EXPR=ProductCostId1}' AND PositionCode = '{EXPR=PositionCode}')",
            width: 120,
            validators: "{EXPR=EmployeeCode} != '' && {EXPR=EmployeeCode}.toString().indexOf(',') > 0 && {EXPR=EmployeeCodeReal} == ''",
            validatorMessage: 'Không được bỏ trống giá trị',
            ignoreError: 1
        },
        // {
        //     header: 'Số ngày xử lý',
        //     binding: 'NumberOfDays',
        //     width: 70,
        //     isReadOnly: 'true'
        // },
        // {
        //     header: 'Được trả lại hồ sơ',
        //     binding: 'ApproveReturn',
        //     dataType: 'Boolean',
        //     width: 80,
        //     isReadOnly: 'true'
        // },
        // {
        //     header: 'Trả về cấp bậc',
        //     binding: 'PositionCodeReturn',
        //     width: 150,
        //     isReadOnly: 'true'
        // }
    ]
}