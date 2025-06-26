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

// Phiếu nhập kho
export class LayoutExWareMaterialsExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30AccDocEquip_ExploreInventory',
                FilterKey: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'X3' AND IsActive=1 AND ProductCostId='{VAR=Filter.ProductCostId}' AND ItemGroupCode NOT IN ('THEP')",
                OrderBy: 'DocDate DESC,DocNo DESC',
                RowPage: 50
            },
            Child: {
                Name: 'vB30BizDocApprove_AccDocEquipExplorer',
                ParentKey: 'Stt',
                ChildKey: 'BizDocId',
                OrderBy: 'ApproveGroup'
            }
        }
    }

    lookup1 = {
        Table: 'vB20Item_MenuFilter',
        Filter: "IsGroup=1 AND IsActive=1 AND ClassCode3 = 'TM'",// AND IsShowMenuWeb = 1
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
            header: 'Ngày lập',
            binding: 'DocDate',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Số phiếu',
            binding: 'DocNo',
            width: 130,
            dataType: 'String'
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            width: 250
        },
      
        {
            header: 'Nhóm hàng',
            binding: 'ItemGroupCode',
            width: 110,
            dataType: 'String'
        },
        {
            header: 'Ngày hoàn thiện duyệt',
            binding: 'FinishDate',
            width: 180,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Đã gửi duyệt',
            binding: 'ApproveSend',
            width: 110,
            dataType: 'Boolean'
        },
        {
            header: 'Hoàn thiện duyệt',
            binding: 'CompletedApprove',
            width: 110,
            dataType: 'Boolean'
        },
      
        // {
        //     header: 'Đang xử lý',
        //     binding: 'XuLyTiepTheo',
        //     width: 200,
        //     dataType: 'String'
        // },
        {
            header: 'Người tạo',
            binding: 'FullName',
            width: 200,
            dataType: 'String'
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

export class LayoutExWareMaterialsEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30AccDocEquip_EditInventory',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'X3',
                    DocStatus: '1',
                    Stt: '',
                    CurrencyCode: 'VND',
                    Id: -1,
                    DocGroup: 2,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    TransCode: '3211'
                }
            },
            Child: [
                {
                    Name: 'vB30AccDocEquipInventory_Edit',
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        DocCode: 'Parent.DocCode',
                        DocGroup: 2,
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        ProductCostId: 'Parent.ProductCostId',
                        CustomerCode: 'Parent.CustomerCode',
                        TransCode: 'Parent.TransCode',
                        WarehouseCode: 'Parent.WarehouseCode',
                        Gia_Tb_Tt: 0
                    }
                },
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.Stt',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    }
                },
                {
                    Name: 'vB30AccDocPurchaseAssess_Edit',
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1'
                    }
                },
                {
                    Name: 'vB30BizDocApprove_EditAccDocEquip',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.Stt',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId'
                }
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Bảng chi tiết phiếu xuất kho',
            Command: 'usp_AccDocEquip_VoucherForm',
            Command_WorkFlow: 'usp_AccDocEquip_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng tổng hợp",
                    FileName: "Bảng chi tiết phiếu xuất kho",
                    WordName: "CCM_PhieuXuatKho.docx",
                    // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
            ]
   
    },
        LinkCommand: [
          
            {
                Text: "Từ kế hoạch mua hàng",
                Name: "LinkCommand2",
                Command: "usp_Newtecons_Budget_GetData_AccDoc",
                GroupBy: "DocNo",
                ConstraintKey: "DocDate,ProductCostId,Stt,ItemGroupCode,CustomerCode,AccDocEquipTypeCode",
                Tables: 0,
                SendData: {
                    ConstraintKey: "CustomerCode,Stt,DocDate",
                    ParameterXmlPopup: "B30BizDocDetail",
                    Command: "usp_Web_SendN3FromH7",
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
                        header: "Tên hàng",
                        binding: "Description0",
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
                        format: "n2",
                        width: 120
                    }
                ]
            }
        ]
    };

    evaluators = {
        'Evaluator_ServerConstraint_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},DocCode,ProductCostId,ItemGroupCode,DocDate,Stt',
            Command: 'ufn_B30AccDocEquip_AutoCreateDocNo',
            DataMember: 'DocNo'
        },
        'Evaluator_B30AccDocPurchaseAssess_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'BizDocId_PO',
            Command: 'usp_TMCtc_B30AccDocPurchaseAssess_GetData',
            OutputTable: 2
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,ParentBizDocId,ProductCostId0',
            Command: 'usp_B30BizDocApprove_GetData',
            OutputTable: 3
        },
        'Evaluator_B30BizDocDocument_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'BizDocId_PO,DocCode',
            Command: 'usp_TMCtc_B30AccDocDocument_GetDefault',
            OutputTable: 1
        },
        'Evaluator_B30AccDocInventory_Quantity': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Quantity",
            Value: "Quantity9*ConvertRate9",
            Tables: 0
        },
        'Evaluator_B30AccDocInventory_OriginalAmount9': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount9",
            Value: "Math.round(Quantity9*OriginalUnitCost)",
            Tables: 0
        },
        'Evaluator_ServerUpdated_Calculate': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Stt',
            Command: 'usp_SOL_UpdateAfterSave_AccDocEquip'
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},{VAR=EmptyField_BizDocId},{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode,Stt',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_B30AccDocInventory_OriginalAmount3': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount3",
            Value: "Math.round(OriginalAmount9*TaxRate)",
            Tables: 0
        },
        //phải khai báo cột dưới lưới để khỏi lỗi dataMap
        'Evaluator_WarehouseCode_BindingFromParent': {
            EvaluatorName: 'EvaluatorBindingChildAll',
            DataMember: 'WarehouseCode',
            Value: 'WarehouseCode',
            Tables: 0
        },
        'Evaluator_B30BizDocDetail_Set_ItemGroupCode': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'ItemGroupCode',
            Value: 'ItemGroupCode',
            Tables: 0
        },
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,ItemGroupCode,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_CheckVer0_ChuaDuyetXong_AccDocEquip',
            MessageText: 'Không thể lập mới khi chưa hoàn thiện duyệt phiên bản trước',
            IgnoreError: 0,
            zExpr: 'Id < 0'
        },
    };

    serverConstraint = [
        
    ];

    serverUpdating = [
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep'
    ]

    serverUpdated = [
        'Evaluator_ServerConstraint_DefaultDocNo',
        'Evaluator_ServerUpdated_Calculate',
        'Evaluator_UpdateInfo_WhenApproveSend'
    ];

    buttonLoadChild: string[] = [
        // 'Evaluator_B30AccDocPurchaseAssess_GetData',
        // 'Evaluator_B30BizDocDocument_GetData',
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
                'Evaluator_B30BizDocDocument_GetData'
            ]
        },
        WarehouseCode: {
            Evaluators: [
                'Evaluator_WarehouseCode_BindingFromParent'
            ]
        },
        ItemGroupCode: {
            Evaluators: [
                'Evaluator_B30BizDocDetail_Set_ItemGroupCode'
            ]
        },
    };

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
                Quantity9: {
                    Evaluators: [
                        'Evaluator_B30AccDocInventory_Quantity',
                        'Evaluator_B30AccDocInventory_OriginalAmount9'
                    ]
                },
                OriginalUnitCost: {
                    Evaluators: [
                        'Evaluator_B30AccDocInventory_OriginalAmount9'
                    ]
                },
                ConvertRate9: {
                    Evaluators: [
                        'Evaluator_B30AccDocInventory_Quantity'
                    ]
                },
                OriginalAmount9: {
                    Evaluators: [
                        'Evaluator_B30AccDocInventory_OriginalAmount3'
                    ]
                },
                TaxCode: {
                    Evaluators: [
                        'Evaluator_B30AccDocInventory_OriginalAmount3'
                    ]
                },
                ItemCode: {
                    Evaluators: [
                        'Evaluator_B30BizDocDetail_Set_ItemGroupCode'
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
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    validators: [Validators.required],
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'ParentBizDocId',
                //     label: 'Hợp đồng',
                //     lookupKey: 'BizDoc_CTC',
                //     binding: {
                //         CustomerCode: 'CustomerCode'
                //     },
                //     validators: [Validators.required],
                //     lookupfilter: "BizDocId IN (SELECT BizDocId FROM dbo.ufn_SOL_FilterContactOnBill('{EXPR=ProductCostId}','{EXPR=ProductCostId}','{EXPR=DocDate}','{VAR=Branch.Ma_Dvcs}'))",
                //     hideValueMember: true,
                //     col: 12
                // }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'CustomerCode',
                //     label: 'Đối tượng',
                //     lookupKey: 'Customer',
                //     binding: {
                //         Name: 'Person',
                //         Address: 'Address'
                //     },
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
                //     hideValueMember: false,
                //     validators: [Validators.required],
                //     col: 12
                // }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'Stt_Ref',
                //     label: 'Số phiếu nhập kho',
                //     lookupKey: 'AccDocEquip',
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}'",
                //     hideValueMember: false,
                //     validators: [Validators.required],
                //     col: 12
                // }, this.srv, this.parentData),
                // new TextBoxInput({
                //     key: 'Person',
                //     label: 'Họ và tên',
                //     type: 'text',
                //     col: 12
                // }),
                // new TextBoxInput({
                //     key: 'Address',
                //     label: 'Địa chỉ',
                //     type: 'text',
                //     col: 12
                // }),
                new LookupBoxInput({
                    key: 'AccDocEquipTypeCode',
                    label: 'Loại xuất',
                    lookupKey: 'Category',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    validators: [Validators.required],
                    hideValueMember: true,
                    maxRow: 20,
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ItemGroupCode',
                    label: 'Nhóm hàng',
                    lookupKey: 'Item',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ParentId IN (3203,3205,3978)",
                    validators: [Validators.required],
                    hideValueMember: true,
                    maxRow: 20,
                    col: 6,
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'TransCode',
                //     label: 'Nghiệp vụ',
                //     lookupKey: 'Trans',
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND TransTypeCode=21 AND Code<>'2199'",
                //     hideValueMember: false,
                //     validators: [Validators.required],
                //     col: 6
                // }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'WarehouseCode',
                //     label: 'Kho xuất',
                //     lookupKey: 'Warehouse',
                //     lookupfilter: "IsGroup=0 AND IsActive=1",
                //     hideValueMember: false,
                //     validators: [Validators.required],
                //     col: 6,
                //     style: 'background-color:#F8F0D7;border-radius:8px;'
                // }, this.srv, this.parentData),
                // new DateBoxInput({
                //     key: 'DocDate2',
                //     label: 'Ngày nhận thực tế',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     validators: [Validators.required],
                //     col: 6
                // }),
               
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    type: 'text',
                    placeHolder: 'test abc',
                    col: 12,
                    validators: [Validators.required],
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND DocStatus=4 AND Ma_Ct='{EXPR=DocCode}'",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12
                }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'ProductCostId0',
                //     lookupKey: 'ProductCost',
                //     validators: [Validators.required],
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3)",
                //     hideValueMember: true,
                //     col: 12,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }, this.srv, this.parentData),
               
                new NumberBoxInput({
                    key: 'OriginalAmount9Total',
                    label: 'Tổng tiền (Chưa VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'OriginalAmountTotal',
                    label: 'Tổng tiền (Gồm VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
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
                }),
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'File đính kèm',
                //     col: 6
                // }, this.srv),
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
                Name: 'Description0'
            },
            lookupfilter: "IsActive=1 AND Code LIKE 'XD%'", //ParentId IN (SELECT Id FROM B20Item WHERE Code = '{EXPR=ItemGroupCode}') AND
            validators: "{EXPR=ItemCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1,
            isReadOnly: 'true'
        },
        {
            header: 'Tên mặt hàng',
            binding: 'Description0',
            dataType: 'String',
            width: 200,
            isReadOnly: 'true'
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
            binding: 'TradeMark',
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
            header: 'Tổng đã nhập',
            binding: 'Quantity1',
            dataType: 'Number',
            width: 120,
            isReadOnly: 'true',
            format: 'n2'
        },
        {
            header: 'Tổng đã xuất',
            binding: 'Quantity2',
            dataType: 'Number',
            width: 120,
            isReadOnly: 'true',
            format: 'n2'
        },
        {
            header: 'SL tồn kho',
            binding: 'Quantity8',
            dataType: 'Number',
            width: 120,
            isReadOnly: 'true',
            format: 'n2'
        },
        {
            header: 'SL xuất đợt này',
            binding: 'Quantity9',
            dataType: 'Number',
            isReadOnly: 'true',
            validators: "{EXPR=Quantity9} == 0",
            validatorMessage: 'Không được bỏ trắng giá trị',
            width: 120,
            format: 'n2'
        },
        {
            header: 'Đơn giá',
            binding: 'OriginalUnitCost',
            dataType: 'Number',
            
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: 'Thành tiền',
            binding: 'OriginalAmount9',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
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
            format: "n0",
            width: 120,
            isReadOnly: 'true'
        },
        // {
        //     header: 'Ngày xuất thực tế',
        //     binding: 'EstimatedTimeDelivery',
        //     isRequired: false,
        //     width: 100,
        //     dataType: 'Date',
        //     format: 'dd/MM/yyyy'
        // },
        // {
        //     header: 'Mã đối tượng nhận',
        //     binding: 'SupplierCode',
        //     isRequired: true,
        //     dataType: 'Array',
        //     lookupKey: 'Customer_CCM2',
        //     bindingList: {
        //         NameBinding: 'SupplierName'
        //     },
        //     lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
        //     width: 200,
        //     validators: "{EXPR=CustomerCode} == ''",
        //     validatorMessage: 'Mã đối tượng, không được bỏ trắng giá trị',
        //     ignoreError: 1
        // },
        // {
        //     header: 'Tên đối tượng nhận',
        //     binding: 'SupplierName',
        //     width: 300,
        //     isReadOnly: "true",
        // },
        {
            header: "Tiền VAT VND",
            dataType: "Number",
            binding: "Amount3",
            format: "n2",
            width: 0
        },
      
        {
            header: 'Ghi chú',
            binding: 'Remark',
            width: 300
        },
        {
            header: 'Hệ số quy đổi',
            binding: 'ConvertRate9',
            width: 0,
            dataType: 'Number',
            format: 'n4'
        },
        {
            header: 'SL quy đổi',
            binding: 'Quantity',
            dataType: 'Number',
            width: 0,
            format: 'n2'
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
            header: 'Tk Nợ',
            binding: 'DebitAccount',
            width: 0,
            isReadOnly: 'true'
        },
        {
            header: 'Kế thừa',
            binding: 'RowIdInherit',
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: 'Kho',
            binding: 'WarehouseCode',
            width: 0,
            isReadOnly: 'true'
        },
        {
            header: 'Loại đơn hàng',
            dataType: 'Array',
            lookupKey: 'Item',
            lookupfilter: "IsGroup=1 AND IsActive=1 AND ParentId IN (3205) AND Code NOT IN ('BETONG','THEP')",
            binding: 'ItemGroupCode',
            isReadOnly: 'true',
            width: 150
        },
    ];

    childColumns1 = [
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
            dataType: 'Object',
            validators: "{EXPR=FilePath}==0",
            validatorMessage: 'Yêu cầu đính kèm tài liệu',
            ignoreError: 1
            //exprReadOnly: "{EXPR=Attached} == true && {EXPR=Description} != ''"
        }
    ];

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
            width: 250,
            validators: "({EXPR=Bad} == true || {EXPR=Star2} == true) && ({EXPR=Normal} == false && {EXPR=Star4} == false && {EXPR=Good} ==false) && {EXPR=Remark} == ''",
            validatorMessage: 'Yêu cầu nhập Diễn giải khi đánh giá 1 sao hoặc 2 sao',
            ignoreError: 1
        }
    ];

    childColumns3 = [
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
            bindingList: {
                Name: 'EmployeeName'
            },
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId}' AND PositionCode = '{EXPR=PositionCode}')",
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
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId}' AND PositionCode = '{EXPR=PositionCode}')",
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
    ];

    childColumns4 = [
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
    ];
}