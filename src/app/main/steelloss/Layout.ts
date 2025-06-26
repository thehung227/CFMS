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
export class LayoutSteelLossExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_Explore',
                FilterKey: "DocCode='D4' AND IsActive= 1 AND ProductCostId <> '' AND ProductCostId0 <> '' AND (ProductCostId = '{VAR=Filter.ProductCostId}' OR ProductCostId0='{VAR=Filter.ProductCostId}') AND YEAR(DocDate)>=2021 AND IsWebData=1",
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
            header: 'Tổng khối lượng thực tế',
            binding: 'NumberCol1',
            width: 150,
            dataType: 'Number',
            
        },
        {
            header: '% hao hụt (so với KL CĐT)',
            binding: 'NumberCol8',
            width: 150,
            dataType: 'Number',
            format: 'P2'
        },
        {
            header: '% hao hụt (so với KL tính toán)',
            binding: 'NumberCol9',
            width: 150,
            dataType: 'Number',
            format: 'P2'
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

export class LayoutSteelLossEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'D4',
                    DocStatus: '1',
                    BizDocId: '',
                    CurrencyCode: 'VND',
                    Id: -1,
                    IsWebData: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    ProductCostId0: '{VAR=Filter.ProductCostId}',
                    ItemGroupCode: 'THEP'
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
                    },
                    // frozenColumns: 3
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
                    Name: 'vB30BizDocDetail01_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        DocDate: 'Parent.DocDate',
                    },
                    // frozenColumns: 3
                },
            ]
        },
        PrintDocument: {
            Key: 'BizDocViewer',
            Text: 'Mẫu in hao hụt Thép',
            Command: 'usp_B30BizDoc_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Hao hụt thép",
                    FileName: "Tổng hợp hao hụt thép - {EXPR=DocNo}",
                    WordName: "CCM_TongHopHaoHutThep.docx",
                    ExcelName: "CCM_TongHopHaoHutThep.xlsx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ]
        },
        LinkCommand: [
          
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
            Command: 'usp_NEW_UpdateAfterSave_BizDoc'
        },
        'Evaluator_ServerUpdated_CreateDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,DocCode,DocNo,Id',
            Command: 'ufn_B30BizDoc_DefaultDocNo_Ver2',
            DataMember: 'DocNo',
            // zExpr: "DocNo == ''"
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},BizDocId,{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true AND CompletedApprove == false'
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
            ConstraintKey: 'BizDocId,DocCode,{VAR=Branch.Ma_Dvcs},{VAR=User.Id}',
            Command: 'ufn_Conteccons_NotChangeWhenApproveSent_User',
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
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_CheckVer0_ChuaDuyetXong_D3',
            MessageText: 'Không thể lập mới khi chưa hoàn thiện duyệt phiên bản trước',
            IgnoreError: 0,
            zExpr: 'Id < 0'
        },
        'Evaluator_ServerConstraint_Load_VerTruoc': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'BizDocId,ProductCostId',
            Command: 'usp_Coteccons_HaoHutThep_LoadVerTruoc',
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_Load_HaoHut': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId',
            Command: 'usp_SteelLoss_LoadDetail1',
            OutputTable: 4
        },
        'Evaluator_ServerUpdated_CreateFormula': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Coteccons_CreateFormula_BizDocDetail_Stell',
            
        },
        'Evaluator_ServerUpdated_CreateFormula01': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Coteccons_CreateFormula_BizDocDetail01_Stell',
            
        },
    };

    serverConstraint = [

    ];

    serverUpdating = [
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep'
        // 'Evaluator_ServerConstraint_Check_UserModified'
    ]

    serverUpdated = [
        'Evaluator_ServerUpdated_CreateDocNo',
        'Evaluator_ServerUpdated_CreateFormula',
        'Evaluator_ServerUpdated_CreateFormula01',
        'Evaluator_UpdateInfo_AfterSave',
        'Evaluator_UpdateInfo_WhenApproveSend'
        
    ];

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_Approve_GetData',
        'Evaluator_ServerConstraint_Load_VerTruoc',
        'Evaluator_ServerConstraint_Load_HaoHut'
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
               
            }
        }
    ];

    columnsReadOnly = [];

    linkReporter = {
        'btnBaoCao': {
            directory: 'reportersteelloss',
            type: 'view',
            key: 'REP01_HHBT',
            parameter: { 'Commandkey': 'REP01_HHBT', 'ProductCostId': '{EXPR=ProductCostId}', 'BizDocId': '{EXPR=BizDocId}', 'Ma_Dvcs': '{VAR=Branch.Ma_Dvcs}' }
        }
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
                    label: 'Số hồ sơ',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo2',
                    label: 'Cập nhật đến tháng',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6
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
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive=1 AND DocStatus=4 AND Ma_Ct='{EXPR=DocCode}'",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
              
                new NumberBoxInput({
                    key: 'NumberCol1',
                    label: 'Khối lượng đã mua hàng',
                    type: "Number",
                    format: "n3",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                // new NumberBoxInput({
                //     key: 'NumberCol4',
                //     label: 'Tổng BOQ CĐT (m3)',
                //     type: "Number",
                //     format: "n3",
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#FAF5D0;border-radius:8px;'
                // }),
                // new NumberBoxInput({
                //     key: 'NumberCol5',
                //     label: 'Tổng KL tính toán (m3)',
                //     type: "Number",
                //     format: "n3",
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#FAF5D0;border-radius:8px;'
                // }),
                new NumberBoxInput({
                    key: 'NumberCol2',
                    label: 'Chênh lệch KL (Thực tế - CĐT)',
                    type: "Number",
                    format: "n3",
                    isNewRow: true,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'NumberCol8',
                    label: '% hao hụt (so với KL CĐT)',
                    type: "Number",
                    format: "p2",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'NumberCol3',
                    label: 'Chênh lệch KL (Thực tế - Tính toán)',
                    type: "Number",
                    format: "n3",
                    isNewRow: true,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'NumberCol9',
                    label: '% hao hụt (so với KL tính toán)',
                    type: "Number",
                    format: "p2",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                  new NumberBoxInput({
                    key: 'NumberCol4',
                    label: 'KL hao hụt có nguyên nhân',
                    type: "Number",
                    format: "n3",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'NumberCol6',
                    label: '% hao hụt có nguyên nhân',
                    type: "Number",
                    format: "p2",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'NumberCol5',
                    label: 'KL hao hụt không rõ nguyên nhân',
                    type: "Number",
                    format: "n3",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'NumberCol7',
                    label: '% hao hụt không rõ nguyên nhân',
                    type: "Number",
                    format: "p2",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'Remark',
                    label: 'Nguyên nhân/Ghi chú',
                    type: 'text',
                    col: 12
                }),
                new ButtonInput({
                    key: 'btnBaoCao',
                    label: 'Bảng hao hụt chi tiết',
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
            header: 'STT',
            binding: 'ItemNo',
            isReadOnly: 'true',
            width: 100
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            isReadOnly: 'true',
            width: 300
        },
       
        {
            header: 'Khối lượng',
            binding: 'Quantity9',
            dataType: 'Number',
            width: 100,
            format: 'n3',
            exprReadOnly: "{EXPR=ItemNo} == '1.1' || {EXPR=ItemNo} == '1.2'"
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsGiftItem',
            dataType: 'Boolean',
            width: 0
        },
        {
            header: 'Đánh giá của CHT, Trưởng P/B',
            binding: 'Fomular',
            isReadOnly: 'true',
            width: 0
        },
        {
            header: 'Ngày',
            binding: 'DocDate',
            isReadOnly: 'true',
            width: 0
        }
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
            header: 'STT',
            binding: 'ItemNo',
            isReadOnly: 'true',
            width: 100
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            isReadOnly: 'true',
            width: 300
        },
       
        {
            header: 'Khối lượng',
            binding: 'Quantity9',
            dataType: 'Number',
            width: 100,
            format: 'n3'
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsGiftItem',
            dataType: 'Boolean',
            width: 0
        },
        {
            header: 'Đánh giá của CHT, Trưởng P/B',
            binding: 'Note',
            isReadOnly: 'true',
            width: 0
        },
        {
            header: 'Ngày',
            binding: 'DocDate',
            isReadOnly: 'true',
            width: 0
        }
    ];
}