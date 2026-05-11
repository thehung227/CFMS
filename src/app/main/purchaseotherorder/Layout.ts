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

// Đơn đặt hàng mua
export class LayoutPurchaseOtherOrderExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_Explore',
                FilterKey: "ItemGroupCode NOT IN ('BETONG','THEP') AND DocCode='PO' AND IsActive= 1 AND ProductCostId <> '' AND ProductCostId0 <> '' AND (ProductCostId = '{VAR=Filter.ProductCostId}' OR ProductCostId0='{VAR=Filter.ProductCostId}') AND YEAR(DocDate)>=2021 AND IsWebData=1",
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
                    WordName: "BM-F006a-Rev01 Don Dat Hang Mua VLXD.docx",
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
                FileName: "PO_GuiNhaCungCap.docx"
            },
            FileAttach: {
                Command: "usp_B30BizDoc_VoucherForm",
                Parameters: {
                    DocCode: "PO",
                    Id: "{EXPR=Id}"
                },
                SourcePath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/BM-F006a-Rev01 Don Dat Hang Mua - Approved.docx",
                DestinationPath: "{VAR=Filter.ProductCostId}/Don_Hang_Mua/{EXPR=Id}/",
                FileName: "{EXPR=DocNo}.pdf"
            },
            Expr: "1==1",
            Message: "Đơn hàng chưa hoàn thành duyệt, không thể gửi mail cho Nhà cung cấp."
        },
        CancelMail: {
            Command: "usp_SOL_DuyetHuyHoSo_VLXD",
            Expr: "{EXPR=CompletedApprove}==true",
            Message: "Đơn hàng chưa hoàn thành duyệt."
        },
    }

    lookup1 = {
        Table: 'vB20Item_MenuFilter',
        Filter: "IsGroup=1 AND IsActive=1 AND ClassCode3 = 'TM'",
        ColumnFilter: 'ItemGroupCode'
    }

    lookup2 = {
        Table: 'B00TMCtcDocStatus',
        Filter: "IsGroup=0 AND CommandWeb = 'purchaseotherorder'",
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
            header: 'Số phiếu NK',
            binding: 'DocNoNK',
            width: 150,
            dataType: 'String'
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

export class LayoutPurchaseOtherOrderEditor implements IEditorFormulaDeclaration {

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
                    ProductCostId0: '{VAR=Filter.ProductCostId}'
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
                        ConvertRate9: 1
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
                {
                    Name: 'vB30BizDocDetail01_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        DocDate: 'Parent.DocDate',
                        ConvertRate9: 1
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
                    FileName: "Đơn hàng mua - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "BM-F006a-Rev01 Don Dat Hang Mua VLXD.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
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
                FileName: "PO_GuiNhaCungCapVLXD.docx"
            },
            FileAttach: {
                // Command: "usp_B30BizDoc_VoucherForm",
                // Parameters: {
                //     DocCode: "PO",
                //     Id: "{EXPR=Id}"
                // },
                // SourcePath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/BM-F006a-Rev01 Don Dat Hang Mua - Approved.docx",
                // DestinationPath: "{VAR=Filter.ProductCostId}/Don_Hang_Mua/{EXPR=Id}/",
                // FileName: "{EXPR=DocNo}.pdf"
            },
            Expr: "1==1",
            Message: "Đơn hàng chưa hoàn thành duyệt, không thể gửi mail cho Nhà cung cấp."
        },
        CancelMail: {
            Command: "usp_SOL_DuyetHuyHoSo_VLXD",
            Expr: "{EXPR=CompletedApprove}==true",
            Message: "Đơn hàng chưa hoàn thành duyệt."
        },
        LinkCommand: [
          
            {
                Text: "Từ kế hoạch mua hàng",
                Name: "LinkCommand2",
                Command: "usp_Newtecons_Budget_GetData",
                GroupBy: "DocNo",
                ConstraintKey: "DocDate,ProductCostId,BizDocId,ItemGroupCode,CustomerCode,ClassCode1",
                Tables: 0,
                SendData: {
                    ConstraintKey: "CustomerCode,BizDocId,DocDate",
                    ParameterXmlPopup: "B30BizDocDetail",
                    Command: "usp_Web_SendPOFromH7",
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
                        binding: "BudgetDate",
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
                        header: "Tên hàng (Theo TVG)",
                        binding: "Description0",
                        width: 200
                    },
                      {
                        header: "Tên hàng (Theo HĐ NCC)",
                        binding: "Note",
                        width: 200
                    },
                    {
                        header: "ĐVT",
                        binding: "Unit",
                        width: 90
                    },
                    {
                        header: "Hạng mục sử dụng",
                        binding: "OriginName",
                        width: 200
                    },
                    {
                        header: "Mã sản phẩm",
                        binding: "ItemSurfaceName",
                        width: 150
                    },
                    {
                        header: "Thương hiệu",
                        binding: "TradeMarkCode",
                        width: 150
                    },
                    {
                        header: "Xuất xứ",
                        binding: "XuatXu",
                        width: 150
                    },
                    {
                        header: "Số lượng kế hoạch",
                        binding: "Quantity",
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
        'Evaluator_BizDocDetail01_OriginalAmount': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount",
            Value: "Math.round(Quantity9*OriginalUnitCost)",
            Tables: 5
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
        'Evaluator_BizDocDetail01_OriginalAmount3': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount3",
            Value: "Math.round(OriginalAmount*TaxRate)",
            Tables: 5
        },
        'Evaluator_UpdateInfo_AfterSave': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_SOL_UpdateAfterSave_BizDoc'
        },
        'Evaluator_ServerUpdated_CreateDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Id,{VAR=Branch.Ma_Dvcs},DocCode,DocNo,DocDate,ClassCode1',
            Command: 'usp_TMCtc_CreateDocNoPO_VTXD',
            zExpr: "ApproveSend == false"
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
        'Evaluator_ServerConstraint_GetInfo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "ProductCostId,{VAR=User.Id}",
            Command: 'usp_GetInfoSolPO',
            DataMember: 'ContactPerson,ContactPhoneNo,PortOfLoading,NguoiNhanHang,CMNDNguoiNhan'
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
            Command: "ufn_SOL_CheckPurchasePlan_VLXD",
            MessageText: "Tổng khối lượng đặt hàng đã vượt hạn mức dự trù. Yêu cầu cập nhật Kế hoạch mua hàng.",
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerConstraint_Check_BCTC': {
            EvaluatorName: "EvaluatorValidate",
            ConstraintKey: "BizDocId,ProductCostId,CustomerCode,DocCode,ItemGroupCode,{VAR=Branch.Ma_Dvcs}",
            Command: "ufn_PO_CheckHanMucTaiChinh",
            MessageText: "Tổng giá trị các đơn hàng của nhà cung cấp đã vượt hạn mức tài chính",
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_B30BizDocDetail_Set_ItemGroupCode': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'ItemGroupCode',
            Value: 'ItemGroupCode',
            Tables: 0
        },
        'Evaluator_ServerConstraint_Attach_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId',
            Command: 'usp_PurchaseOtherOrder_LoadAttach',
            OutputTable: 2
        },
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,CustomerCode,ItemGroupCode,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_CheckVer0_ChuaDuyetXong_DonHang',
            MessageText: 'Không thể lập mới khi chưa hoàn thiện duyệt phiên bản trước',
            IgnoreError: 0,
            zExpr: 'Id < 0'
        },
    };

    serverConstraint = [
        'Evaluator_ServerConstraint_GetInfo'
    ];

    serverUpdating = [
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_UserModified',
        'Evaluator_ServerConstraint_Check_PurchasePlan',
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep'
        // 'Evaluator_ServerConstraint_Check_BCTC'
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
                'Evaluator_ServerConstraint_Approve_GetData',
                'Evaluator_ServerConstraint_Attach_GetData'
            ]
        },
        ItemGroupCode: {
            Evaluators: [
                'Evaluator_B30BizDocDetail_Set_ItemGroupCode'
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
                },
                ItemCode: {
                    Evaluators: [
                        'Evaluator_B30BizDocDetail_Set_ItemGroupCode'
                    ]
                }
            }
        },
        {
            Tables: 5,
            columnChanged: {
                Quantity9: {
                    Evaluators: [
                        'Evaluator_BizDocDetail01_OriginalAmount'
                    ]
                },
                OriginalUnitCost: {
                    Evaluators: [
                        'Evaluator_BizDocDetail01_OriginalAmount'
                    ]
                },
                OriginalAmount: {
                    Evaluators: [
                        'Evaluator_BizDocDetail01_OriginalAmount3'
                    ]
                },
                TaxCode: {
                    Evaluators: [
                        'Evaluator_BizDocDetail01_OriginalAmount3'
                    ]
                },
              
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
                    binding: {
                        // DiaChiDuAn: "PortOfLoading",
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Hợp đồng',
                    lookupKey: 'BizDoc_CTC',
                    validators: [Validators.required],
                    binding: {
                        CustomerCode: 'CustomerCode',
                        DueDateHD: 'DieuKienThanhToan'
                    },
                    lookupfilter: "(((DocCode = 'C3' OR (DocCode = 'C4' AND IsSubContractPay = 1)) AND ProductCostId='{EXPR=ProductCostId}' AND ContractTypeFilter='B4') OR (DocCode='C3' AND IsSubContractPay = 1)) AND Closed = 0 AND CompletedApprove=1 AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Đối tượng',
                    lookupKey: 'Customer',
                    isReadOnly: 'true',
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
                    isReadOnly: 'true',
                    validators: [Validators.required],
                    col: 12,
                    // isDisabled: 'true'
                }),
                new LookupBoxInput({
                    key: 'ItemGroupCode',
                    label: 'Loại đơn hàng',
                    lookupKey: 'Item',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ParentId IN (3205) AND Code NOT IN ('BETONG','THEP')",
                    validators: [Validators.required],
                    hideValueMember: true,
                    maxRow: 20,
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ClassCode1',
                    label: 'Loại hình',
                    lookupKey: 'Class',
          
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='INCURRED' AND Code IN ('XD','ME')",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 6
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'ContactPerson',
                    label: 'Người nhận hàng',
                    type: 'text',
                    isNewRow: true,
                    validators: [Validators.required],
                    col: 6
                }),
                new TextBoxInput({
                    key: 'ContactPhoneNo',
                    label: 'SĐT người nhận',
                    validators: [Validators.required],
                    type: 'text',
                    col: 6
                }),
               
                new TextBoxInput({
                    key: 'NguoiNhanHang',
                    label: 'Người liên hệ',
                    type: 'text',
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
                new DateBoxInput({
                    key: 'EstimatedTimeDelivery',
                    label: 'Ngày dự kiến giao',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6
                }),
                new TextBoxInput({
                    key: 'PortOfLoading',
                    label: 'Địa điểm giao hàng',
                    type: 'text',
                    col: 12
                }),
                new TextBoxInput({
                    key: 'DieuKienThanhToan',
                    label: 'Điều kiện thanh toán',
                    type: 'text',
                    isReadOnly: 'true',
                    col: 12
                }),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Thỏa thuận khác',
                    validators: [Validators.required],
                    type: 'text',
                    col: 12
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive=1 AND DocStatus=4 AND Ma_Ct='{EXPR=DocCode}' AND ProcessCode IN ('P-263','P-266')",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'Amount',
                    label: 'Tổng tiền (chưa VAT)',
                    type: "Number",
                    format: "n0",
                    col: 6,
                    isReadOnly: 'true',
                    isNewRow: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                
             
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
            header: 'Mã hàng',
            binding: 'ItemCode',
            width: 200,
            dataType: 'Array',
            lookupKey: 'PriceLibrary',
            bindingList: {
                Name: 'Description0',
        
            },
            lookupfilter: "IsActive=1 AND Code LIKE 'XD%'", //ParentId IN (SELECT Id FROM B20Item WHERE Code = '{EXPR=ItemGroupCode}') AND
            validators: "{EXPR=ItemCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1,
             isReadOnly: 'true'
        },
        {
            header: 'Tên mặt hàng (Theo TVG)',
            binding: 'Description0',
            dataType: 'String',
            width: 200,
            isReadOnly: 'true'
        },
        {
            header: 'Tên mặt hàng (Theo HĐ NCC)',
            binding: 'Note',
            dataType: 'String',
            width: 200,
        },
        {
            header: 'Hạng mục sử dụng',
            binding: 'OriginName',
            dataType: 'String',
            width: 100,
             isReadOnly: 'true'
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            dataType: 'Array',
            lookupfilter: "IsActive=1 AND ParentCode = 'DmDvt'",
            lookupKey: 'Class',
            width: 80,
             isReadOnly: 'true'
        },
        {
            header: 'Mã sản phẩm',
            binding: 'ItemSurfaceName',
            dataType: 'String',
            width: 100,
             isReadOnly: 'true'
        },
        {
            header: 'Thương hiệu',
            dataType: 'Array',
            lookupKey: 'TradeMark',
            lookupfilter: "ItemGroupCode = '{EXPR=ItemGroupCode}'",
            binding: 'TradeMarkCode',
            isRequired: true,
            width: 150,
             isReadOnly: 'true'
        },
        {
            header: 'Xuất xứ',
            binding: 'XuatXu',
            dataType: 'Array',
            bindingList: {
                Name: 'TenXuatXu',
                
            },
            lookupKey: 'Class',
            lookupfilter: "ParentCode = 'QUOCGIA'",
            width: 100,
             isReadOnly: 'true'
        },
        {
            header: 'Tên xuất xứ',
            binding: 'TenXuatXu',
            dataType: 'String',
            width: 120,
            isReadOnly: 'true'
        },
     
        {
            header: 'Khối lượng đặt hàng',
            binding: 'Quantity9',
            dataType: 'Number',
              validators: "{EXPR=Quantity9} == 0",
            validatorMessage: 'Không được bỏ trắng giá trị',
            width: 100,
            format: 'n2'
            
        },
       
        {
            header: 'Đơn giá',
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
            format: 'n2',
             isReadOnly: 'true'
        },
        {
            header: 'Thành tiền',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 120,
            format: 'n0'
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
            validators: "{EXPR=TaxCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1,
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
            format: "n0",
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
            header: 'Hệ số quy đổi',
            binding: 'ConvertRate9',
            dataType: 'Number',
            width: 0,
            isReadOnly: 'true',
            format: 'n4'
        },
        {
            header: 'Số lượng quy đổi',
            binding: 'Quantity',
            dataType: 'Number',
            width: 0,
            format: 'n3'
        },
        {
            header: "Khối lượng đã nhập (Lũy kế)",
            dataType: "Number",
            binding: "Quantity8",
            format: "n3",
            width: 100
        },
        {
            header: 'Ghi chú',
            binding: 'Remark',
            width: 300
        },
        {
            header: 'Khối lượng kế hoạch',
            binding: 'Quantity1',
            isReadOnly: 'true',
            dataType: 'Number',
            width: 100,
            format: 'n3'
        },
        {
            header: 'Khối lượng đã đặt',
            binding: 'Quantity2',
            isReadOnly: 'true',
            dataType: 'Number',
            width: 100,
            format: 'n3'
        },
        {
            header: 'Khối lượng còn lại',
            binding: 'Quantity3',
            isReadOnly: 'true',
            dataType: 'Number',
            width: 100,
            format: 'n3'
        },
        {
            header: 'Dòng kế thừa',
            binding: 'RowId_EP',
            isReadOnly: 'true',
            width: 100
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
            header: 'Loại đơn hàng',
            dataType: 'Array',
            lookupKey: 'Item',
            lookupfilter: "IsGroup=1 AND IsActive=1 AND ParentId IN (3205) AND Code NOT IN ('BETONG','THEP')",
            binding: 'ItemGroupCode',
            isReadOnly: 'true',
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
            header: 'Yêu cầu đính kèm',
            binding: 'Attached',
            dataType: 'Boolean',
            width: 60,
            isReadOnly: 'true'
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 600,
            dataType: 'Object'
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
    childColumns5 = [
        {
            header: 'Nội dung',
            binding: 'Description',
            width: 200,
            validators: "{EXPR=Description} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 80
        },
        {
            header: 'Mã sản phẩm',
            binding: 'ItemSurfaceName',
            dataType: 'String',
            width: 100,
             isReadOnly: 'true'
        },
        {
            header: 'Khối lượng',
            binding: 'Quantity9',
            dataType: 'Number',
            width: 100,
            format: 'n3'
        },
        {
            header: "Đơn giá",
            dataType: "Number",
            binding: "OriginalUnitCost",
            format: "n2",
            width: 120
        }, 
        {
            header: "Thành tiền",
            dataType: "Number",
            binding: "OriginalAmount",
            format: "n2",
            width: 120
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
    ]   
}