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

// Đơn đặt hàng mua bê tông
export class LayoutSolPOConcreteExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_Explore',
                FilterKey: "ItemGroupCode='BETONG' AND DocCode='PO' AND IsActive= 1 AND ProductCostId <> '' AND ProductCostId0 <> '' AND (ProductCostId = '{VAR=Filter.ProductCostId}' OR ProductCostId0='{VAR=Filter.ProductCostId}') AND YEAR(DocDate)>=2021 AND IsWebData=1",
                OrderBy: 'DocStatusName,DocDate DESC,DocNo DESC',
                RowPage: 50
            },
            Child: {
                Name: 'vB30BizDocApprove_Explorer',
                ParentKey: 'BizDocId',
                ChildKey: 'BizDocId'
            }
        },
        PrintDocument: {
            Key: 'BizDocViewer',
            Text: 'Mẫu in đơn hàng mua',
            Command: 'usp_B30BizDoc_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Đơn đặt hàng mua",
                    FileName: "Đơn hàng mua - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "BM-F006a-Rev01 Don Dat Hang Mua.docx",
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
                }
            ]
        },
        Mail: {
            ProfileFilter: "Code = 'BRAVO_CTC'",
            Template: {
                Command: "usp_Coteccons_GetInfoSendMail",
                Parameters: {
                    ProductCostId: "{VAR=Filter.ProductCostId}",
                    nUserId: "{VAR=User.Id}",
                    DocCode: "PO",
                    Id: "{EXPR=Id}",
                    BranchCode: "{VAR=Branch.Ma_Dvcs}",
                    State: "1"
                },
                FolderPath: "/5.TemplateMail/",
                FileName: "PO_GuiNhaCungCapBetong.docx"
            },
            FileAttach: {
                Command: "usp_B30BizDoc_VoucherForm",
                Parameters: {
                    DocCode: "PO",
                    Id: "{EXPR=Id}"
                },
                SourcePath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/Don_Hang_Mua - Be tong - Approved.docx",
                DestinationPath: "{VAR=Filter.ProductCostId}/Don_Hang_Mua/{EXPR=Id}/",
                FileName: "{EXPR=DocNo}.pdf"
            },
            Expr: "{EXPR=CompletedApprove}==true",
            Message: "Đơn hàng chưa hoàn thành duyệt, không thể gửi mail cho Nhà cung cấp."
        },
        CancelMail: {
            Command: "usp_SOL_DuyetHuyHoSo",
            Expr: "{EXPR=CompletedApprove}==true",
            Message: "Đơn hàng chưa hoàn thành duyệt."
        }
    }

    lookup1 = {
        Table: 'vB20Item_MenuFilter',
        Filter: "IsGroup=1 AND IsActive=1 AND ClassCode3 = 'TM'",
        ColumnFilter: 'ItemGroupCode'
    }

    lookup2 = {
        Table: 'B00TMCtcDocStatus',
        Filter: "IsGroup=0 AND CommandWeb = 'purchaseorder'",
        ColumnFilter: 'DocStatusKeyTM'
    }

    lookup3 = {
        Table: 'B00TMCtcDocStatus',
        Filter: "CommandWeb = 'rowsPage'",
    }

    parentGrid = [
        {
            header: 'Loại đơn hàng',
            binding: 'ItemGroupName',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Số đơn hàng',
            binding: 'DocNo',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Ngày lập',
            binding: 'DocDate',
            format: 'dd/MM/yyyy',
            width: 120
        },
        {
            header: 'Ngày hoàn thiện',
            binding: 'FinishDate',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Nhà cung cấp',
            binding: 'CustomerName',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Tiền hàng',
            binding: 'OriginalAmount',
            width: 150,
            dataType: 'Number'
        },
        {
            header: 'Tiền thuế',
            binding: 'OriginalAmount3',
            width: 150,
            dataType: 'Number'
        },
        {
            header: 'Tổng tiền',
            binding: 'TotalOriginalAmount',
            width: 150,
            dataType: 'Number'
        },
        {
            header: 'Đã gửi duyệt',
            binding: 'ApproveSend',
            width: 120,
            dataType: 'Boolean'
        },
        {
            header: 'Hoàn thiện duyệt',
            binding: 'CompletedApprove',
            width: 120,
            dataType: 'Boolean'
        },
        // {
        //     header: 'Gửi nhà cung cấp',
        //     binding: 'SendMailSupplier',
        //     width: 120,
        //     dataType: 'Boolean'
        // },
        {
            header: 'Đang xử lý',
            binding: 'XuLyTiepTheo',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Người tạo',
            binding: 'FullName',
            width: 150,
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
        // {
        //     header: 'Bộ phận',
        //     binding: 'DeptName',
        //     width: 250,
        //     dataType: 'String'
        // },
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
            header: 'Đã xử lý',
            binding: 'ApproveStatus',
            width: 80,
            dataType: 'Boolean',
            textAlign: 'center'
        },
        {
            header: 'Trạng thái',
            binding: 'ApproveStatusName',
            width: 100
        },
        {
            header: 'Ý kiến',
            binding: 'Comment',
            width: 200,
            dataType: 'String',
            isContentHtml: true
        },
        {
            header: 'Số ngày thực hiện',
            binding: 'NumberOfDays',
            width: 150,
            dataType: 'Number',
            format: 'n0'
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
    ]
}

export class LayoutSolPOConcreteEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'PO',
                    DocStatus: '1',
                    BizDocId: '',
                    CurrencyCode: 'VND',
                    Id: -1,
                    IsWebData: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    ProductCostId0: '{VAR=Filter.ProductCostId}',
                    ItemGroupCode: 'BETONG'
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocDetail_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        DocDate: 'Parent.DocDate',
                    }
                },
                {
                    Name: 'vB30BizDocApprove_AEditContract',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                    }
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId'
                },
                {
                    Name: 'vB30BizDocContactInfo_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },   

            ]
        },
        PrintDocument: {
            Key: 'BizDocViewer',
            Text: 'Mẫu in đơn hàng mua',
            Command: 'usp_B30BizDoc_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Đơn đặt hàng mua",
                    FileName: "Đơn hàng mua bê tông - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "Don_Hang_Mua - Be tong - Approved.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ]
        },
        LinkCommand: [
          
            {
                Text: "Từ Đề nghị mua",
                Name: "LinkCommand2",
                Command: "usp_SOL_PP_GetData",
                GroupBy: "DocNo",
                ConstraintKey: "DocDate,ProductCostId,BizDocId,ItemGroupCode,CustomerCode",
                Tables: 0,
                SendData: {
                    ConstraintKey: "CustomerCode",
                    ParameterXmlPopup: "B30BizDocDetail",
                    Command: "usp_Web_SendPOFromPP",
                    OutputTable: 0,
                    CheckBoxOrder: "Rank1",
                    ColumnCheckBox: "IsTransfer",
                    DataMember: "ContactPerson,ContactPhoneNo,EstimatedTimeDelivery",
                },
                grid: [
                    {
                        header: "Chọn",
                        binding: "IsTransfer",
                        dataType: "Boolean",
                        width: 0
                    },
                    {
                        header: "Rank1",
                        binding: "Rank1",
                        dataType: "Number",
                        format: "n0",
                        width: 0
                    },
                    {
                        header: "Ngày",
                        binding: "DocDate",
                        datatype: "Date",
                        format: "dd/MM/yyyy",
                        width: 100
                    },
                    {
                        header: "Số hồ sơ",
                        binding: "DocNo",
                        width: 120
                    },
                    {
                        header: "Mã hàng",
                        binding: "ItemCode",
                        width: 100
                    },
                    {
                        header: "Tên hàng",
                        binding: "ItemName",
                        width: 200
                    },
                    {
                        header: "Số lượng đặt hàng",
                        binding: "Quantity9",
                        dataType: "Number",
                        format: "n3",
                        width: 120
                    },
                    {
                        header: "Số lượng đã thực hiện",
                        binding: "ExQuantity9",
                        dataType: "Number",
                        format: "n3",
                        width: 140
                    },
                    {
                        header: "Số lượng còn lại",
                        binding: "DiffQuantity",
                        dataType: "Number",
                        format: "n3",
                        width: 120
                    }
                ]
            }
        ]
    };

    evaluators = {
        // 'Evaluator_ServerConstraint_TrongLuongTamTinh_Quantity8': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: 'ItemCode,CustomerCode,Quantity9,{VAR=Branch.Ma_Dvcs}',
        //     Command: 'ufn_Ricons_TrongLuongMUATamTinh',
        //     DataMember: 'Quantity8',
        //     Tables: 0
        // },
        'Evaluator_BizDocDetail_OriginalAmount': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount",
            Value: "Math.round(Quantity9*OriginalUnitCost)",
            Tables: 0
        },
        'Evaluator_BizDocDetail_Quantity': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Quantity",
            Value: "Quantity9*ConvertRate9",
            Tables: 0
        },
        'Evaluator_BizDocDetail_OriginalAmount3': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount3",
            Value: "Math.round(OriginalAmount*TaxRate)",
            Tables: 0
        },
        'Evaluator_UpdateInfo_AfterSave': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_SOL_UpdateAfterSave_BizDoc'
        },
        'Evaluator_ServerUpdated_CreateDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Id,{VAR=Branch.Ma_Dvcs},DocCode,DocNo,DocDate',
            Command: 'usp_TMCtc_CreateDocNoPO',
            zExpr: "DocNo == ''"
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},BizDocId,{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,ProductCostId0',
            Command: 'usp_B30BizDocApprove_GetData',
            zExpr: "ProcessCode != '' && ProductCostId != ''",
            OutputTable: 1
        },
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'BizDocId,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Conteccons_NotChangeWhenApproveSent',
            MessageText: 'Không được thay đổi khi đã gửi duyệt',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_UserModified': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: '{VAR=User.Id},BizDocId,DocCode',
            Command: 'ufn_Coteccons_CheckUser_ModifiedBy',
            MessageText: 'Không được điều chỉnh dữ liệu của người dùng khác',
            IgnoreError: 0,
            zExpr: 'Id > 0'
        },
        'Evaluator_ServerConstraint_Check_PurchasePlan': {
            EvaluatorName: "EvaluatorValidate",
            ConstraintKey: "BizDocId,ProductCostId,ProcessCode,DocCode,{VAR=Branch.Ma_Dvcs}",
            Command: "ufn_SOL_CheckPurchasePlan",
            MessageText: "Số lượng đặt hàng vượt hạn mức dự trù. Yêu cầu cập nhật Kế hoạch mua hàng.",
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        }
    };

    serverConstraint = [

    ];

    serverUpdating = [
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_UserModified',
        'Evaluator_ServerConstraint_Check_PurchasePlan'
    ]

    serverUpdated = [
        'Evaluator_ServerUpdated_CreateDocNo',
        'Evaluator_UpdateInfo_AfterSave',
        'Evaluator_UpdateInfo_WhenApproveSend'
    ];

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_Approve_GetData'
    ]

    buttonCommand: string[] = [
    ];

    importCommand: string[] = [
    ]

    columnChanged = {
        ProcessCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_Approve_GetData'
            ]
        }
    };

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
                Quantity9: {
                    Evaluators: [
                        'Evaluator_BizDocDetail_OriginalAmount',
                        'Evaluator_BizDocDetail_Quantity'
                    ]
                },
                OriginalUnitCost: {
                    Evaluators: [
                        'Evaluator_BizDocDetail_OriginalAmount'
                    ]
                },
                ConvertRate9: {
                    Evaluators: [
                        'Evaluator_BizDocDetail_Quantity'
                    ]
                },
                OriginalAmount: {
                    Evaluators: [
                        'Evaluator_BizDocDetail_OriginalAmount3'
                    ]
                },
                TaxCode: {
                    Evaluators: [
                        'Evaluator_BizDocDetail_OriginalAmount3'
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
                    label: 'Ngày lập',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số đơn hàng',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu',
                    lookupKey: 'ProductCost',
                 
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Hợp đồng',
                    lookupKey: 'BizDoc_CTC',
                    binding: {
                        CustomerCode: 'CustomerCode'
                    },
                     validators: [Validators.required],
                    lookupfilter: "(((DocCode = 'C3' OR (DocCode = 'C4' AND IsSubContractPay = 1)) AND ProductCostId='{EXPR=ProductCostId}' AND ContractTypeFilter='B4') OR (DocCode='C3' AND IsSubContractPay = 1)) AND Closed = 0 AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Đối tượng',
                    lookupKey: 'Customer',
                    binding: {
                        Address: "Address",
                        // Person: "ContactPerson"
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND IsStopWorking=0",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Address',
                    label: 'Địa chỉ',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12,
                    // isDisabled: 'true'
                }),
                new LookupBoxInput({
                    key: 'ItemGroupCode',
                    label: 'Loại đơn hàng',
                    lookupKey: 'Item',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND Code='BETONG'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    maxRow: 20,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'NguoiNhanHang',
                    label: 'Người liên hệ (QS)',
                    type: 'text',
                    isNewRow: true,
                    validators: [Validators.required],
                    col: 6
                }),
                new TextBoxInput({
                    key: 'CMNDNguoiNhan',
                    label: 'SĐT người liên hệ',
                    validators: [Validators.required],
                    type: 'text',
                    col: 6
                }),
                
                new TextBoxInput({
                    key: 'PortOfLoading',
                    label: 'Địa điểm giao hàng',
                    validators: [Validators.required],

                    type: 'text',
                    col: 12
                }),
               
                new TextBoxInput({
                    key: 'Description',
                    label: 'Thỏa thuận khác',
                    type: 'text',
                    col: 12
                }),
                // new LookupBoxInput({
                //     key: 'ProcessCode',
                //     label: 'Quy trình duyệt',
                //     lookupKey: 'Approve',
                //     lookupfilter: "IsActive=1 AND DocStatus=4 AND Ma_Ct='{EXPR=DocCode}'",
                //     validators: [Validators.required],
                //     hideValueMember: false,
                //     col: 12
                // }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'TaxCode',
                    label: 'Thuế',
                    lookupKey: 'Tax',
                    hideValueMember: false,
                    isNewRow: true,
                    lookupfilter: "Type=1 AND IsActive=1 AND IsGroup=0 AND IsDefault=1",
                    binding: {
                        Rate: 'TaxRate'
                    },
                    col: 6,
                    validators: [Validators.required]
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'TotalOriginalAmount',
                    label: 'Tổng tiền (gồm VAT)',
                    type: "Number",
                    format: "n0",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId0',
                    label: 'Gói thầu/ PB đại diện',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new CheckBoxInput({
                    key: 'AdjustedPay',
                    label: 'Ẩn công trình trên PO',
                    type: 'boolean',
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    type: 'boolean',
                    col: 6,
                    isDisabled: 'true',
                    isNewRow: true
                }),
                new CheckBoxInput({
                    key: 'CompletedApprove',
                    label: 'Đã hoàn thiện duyệt',
                    type: 'boolean',
                    col: 6,
                    isDisabled: 'true'
                })
            ]
        })
    ];

    childColumns = [
        {
            header: 'Stt',
            binding: 'ItemNo',
            width: 100
        },
        {
            header: 'Ngày đổ',
            binding: 'Ngay_Cap',
            width: 80,
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false	
        },
        {
            header: 'Thời gian bắt đầu đổ',
            binding: 'ProductDesignNo',
            width: 80
        },
       
        {
            header: 'Mã hàng',
            binding: 'RowId_EP',
            dataType: 'Array',
            lookupKey: 'BudgetDetailR',
            bindingList: {
                ItemName: 'Description',
                ProductSize: 'ProductSize',
                ProductSizeName: 'ProductSizeName',
                ItemSpeciesCode: 'ItemSpeciesCode',
                ItemSpeciesName: 'ItemSpeciesName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductCostId='{EXPR=ProductCostId}' AND ItemGroupCode = 'BETONG'",
            width: 150
        },
        {
            header: 'Tên hàng hóa',
            binding: 'Description',
            isReadOnly: 'true',
            width: 250
        },
        
       
        {
            header: 'Cấu kiện',
            dataType: 'Array',
            lookupKey: 'CauKienDes',
            bindingList: {
                Code: 'TradeMarkCode',
            },
            lookupfilter: "IsGroup=0 AND IsActive=1",
            binding: 'Note',
            width: 150
        },
        {
            header: 'Khu vực',
            binding: 'Khu_Vuc',
            width: 150
        },
        {
            header: 'Vị trí',
            binding: 'Vi_Tri',
            width: 150
        },
        {
            header: 'Đvt',
            dataType: 'Array',
            // bindingList: {
            //     ConvertRate: 'ConvertRate9'
            // },
            lookupKey: 'ItemUnit',
            
            binding: 'Unit',
            width: 80,
        },
        // {
        //     header: 'Ngày dự kiến giao',
        //     binding: 'EstimatedTimeDelivery',
        //     width: 80,
        //     dataType: 'Date',
        //     format: 'dd/MM/yyyy'
        // },
        {
            header: 'KL tính toán',
            binding: 'Quantity8',
            dataType: 'Number',
            width: 150,
         
             format: 'n2',
        },
        {
            header: 'KL đặt hàng',
            binding: 'Quantity9',
            dataType: 'Number',
            width: 100,
            format: 'n3'
        },
        // {
        //     header: 'Hệ số quy đổi',
        //     binding: 'ConvertRate9',
        //     dataType: 'Number',
        //     width: 100,
        //     isReadOnly: 'true',
        //     format: 'n4'
        // },
        // {
        //     header: 'Số lượng quy đổi',
        //     binding: 'Quantity',
        //     dataType: 'Number',
        //     width: 90,
        //     format: 'n3'
        // },
        {
            header: 'Đơn giá bê tông (VNĐ)',
            binding: 'OriginalUnitCost',
            dataType: 'Number',
            width: 100,
            format: 'n2'
        },
        {
            header: 'Đơn giá VND',
            binding: 'UnitCost',
            dataType: 'Number',
            width: 0,
            format: 'n2'
        },
        {
            header: 'Thành tiền bê tông (VNĐ)',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 120,
            format: 'n2'
        },
        {
            header: 'Thành tiền VND',
            binding: 'Amount',
            dataType: 'Number',
            width: 0,
            format: 'n2'
        },
        {
            header: "Loại thuế",
            dataType: "Array",
            bindingList: {
                Rate: "TaxRate"
            },
            lookupKey: "Tax",
            lookupfilter: "Type='1' AND IsGroup=0 AND IsActive=1 AND IsDefault=1",
            binding: "TaxCode",
            maxRow: 20,
            width: 100
        },
        {
            header: "% VAT",
            dataType: "Number",
            isReadOnly: "true",
            binding: "TaxRate",
            format: "p2",
            width: 85
        },
        {
            header: "Tiền VAT",
            dataType: "Number",
            binding: "OriginalAmount3",
            format: "n2",
            width: 120
        },
        {
            header: "Tiền VAT VND",
            dataType: "Number",
            binding: "Amount3",
            format: "n2",
            width: 0
        },
         {
            header: "Phương pháp đổ",
            dataType: "Array",
            bindingList: {
            },
            lookupKey: "Class",
            lookupfilter: "IsGroup=0 AND IsActive = 1 AND ParentCode = 'PPD'",
            binding: "TransCode",
            multiSelection: true,
            maxRow: 20,
            width: 100
        },
        {
            header: 'Mô tả chi tiết nhu cầu về bơm',
            binding: 'PhuongPhapDo',
     
            width: 250
        },
        {
            header: "NCC bơm",
            dataType: "Array",
            bindingList: {
                Name: "CustomerName1"
            },
            lookupKey: "Customer",
            lookupfilter: "IsGroup=0 AND IsActive = 1 AND Code LIKE 'SI-%'",
            binding: "CustomerCode1",
            maxRow: 20,
            width: 100
        },
           {
            header: 'Tên NCC bơm',
            binding: 'CustomerName1',
     
            width: 250
        },
         {
            header: "NTP thi công",
            dataType: "Array",
            bindingList: {
                Name: "CustomerName2"
            },
            lookupKey: "Customer",
            lookupfilter: "IsGroup=0 AND IsActive = 1 AND Code LIKE 'SI-%'",
            binding: "CustomerCode2",
            maxRow: 20,
            width: 100
        },
           {
            header: 'Tên NTP thi công',
            binding: 'CustomerName2',
     
            width: 250
        },
          {
            header: 'Tên giám sát',
            binding: 'CustomerName3',
     
            width: 250
        },
        // {
        //     header: "Số lượng (Lũy kế)",
        //     dataType: "Number",
        //     binding: "Quantity8",
        //     format: "n3",
        //     width: 85
        // },
        {
            header: 'Ghi chú',
            binding: 'Remark',
            width: 300
        },
        {
            header: 'Đối tượng',
            binding: 'CustomerCode',
            isReadOnly: 'true',
            width: 0
        },
        {
            header: 'Ngày',
            binding: 'DocDate',
            isReadOnly: 'true',
            width: 0
        },
        {
            header: 'Tên hàng hóa',
            binding: 'ProductSize',
            width: 0
        },
        {
            header: 'Tên hàng hóa',
            binding: 'ItemSpeciesCode',
            width: 0
        },
         {
            header: 'Tên hàng hóa',
            binding: 'TradeMarkCode',
            width: 0
        },
         {
            header: 'Cường độ',
            dataType: 'Array',
            lookupKey: 'SizeDes',
            isReadOnly: 'true',
            lookupfilter: "ItemGroupCode = '{EXPR=ItemGroupCode}'",
            bindingList: {
                Code: 'ProductSize'
            },
            binding: 'ProductSizeName',
            width: 0
        },
        
        {
            header: 'Độ sụt',
            dataType: 'Array',
            isReadOnly: 'true',
            lookupKey: 'SpeciesName',
            lookupfilter: "ItemGroupCode = '{EXPR=ItemGroupCode}'",
            bindingList: {
                Code: 'ItemSpeciesCode'
            },
            binding: 'ItemSpeciesName',
            width: 0
        },
        
        {
            header: 'Phụ gia',
            dataType: 'Array',
            lookupKey: 'Surface',
            isReadOnly: 'true',

            lookupfilter: "ItemGroupCode = '{EXPR=ItemGroupCode}'",
            binding: 'ItemSurfaceCode',
            width: 0
        },
    ];

    childColumns1 = [
        {
            header: 'STT',
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
            width: 250,
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
            width: 120,
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId='{EXPR=ProductCostId0}') AND PositionCode = '{EXPR=PositionCode}')",
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
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId='{EXPR=ProductCostId0}') AND PositionCode = '{EXPR=PositionCode}')",
            width: 120,
            validators: "{EXPR=EmployeeCode} != '' && {EXPR=EmployeeCode}.toString().indexOf(',') > 0 && {EXPR=EmployeeCodeReal} == ''",
            validatorMessage: 'Không được bỏ trống giá trị',
            ignoreError: 1
        },
        {
            header: 'Số ngày xử lý',
            binding: 'NumberOfDays',
            width: 70,
            isReadOnly: 'true'
        },
        {
            header: 'Được trả lại hồ sơ',
            binding: 'ApproveReturn',
            dataType: 'Boolean',
            width: 80,
            isReadOnly: 'true'
        },
        // {
        //     header: 'Trả về cấp bậc',
        //     binding: 'PositionCodeReturn',
        //     width: 150,
        //     isReadOnly: 'true'
        // }
    ]

    childColumns2 = [
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

    childColumns3 = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
        },
        // {
        //     header: 'Cấp bậc duyệt',
        //     binding: 'PositionName',
        //     width: 250
        // },
        {
            header: 'Người thực hiện',
            binding: 'EmployeeName',
            width: 250
        },
        {
            header: 'Trạng thái',
            binding: 'ApproveStatusName',
            width: 100
        },
        {
            header: 'Ý kiến',
            binding: 'Comment',
            width: 250,
            isContentHtml: true,
            wordWrap: true
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
        }
    ]
     childColumns4 = [
        {
            header: 'Tên người liên lạc',
            binding: 'ContactName',
            width: 200,
            validators: "{EXPR=ContactName} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Chức vụ',
            binding: 'JobTitleName',
            width: 200,
            validators: "{EXPR=JobTitleName} == ''",
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
        }   
    ]   
}