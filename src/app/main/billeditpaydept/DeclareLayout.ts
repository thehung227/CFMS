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

// Thanh toán ban chỉ huy/ phòng ban
export class LayoutBillEditPayDeptExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocCCM_Explore',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND ContractTypeBCH = 'Y' AND DocCode IN ('P3') AND IsActive=1  AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'ProductName,DocDate DESC,DocNo DESC',
                RowPage: 50
            },
            Child: {
                Name: 'vB30BizDocApprove_ExplorerCCM',
                ParentKey: 'BizDocId',
                ChildKey: 'BizDocId'
            }
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'TBTT BCH/PB - {VAR=TenGoiThau} - {VAR=DocNo}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "TBTT CP_BCH",
                    FileName: "TBTT CP_BCH - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "7.TBTT_CP_BCH_0.docx",
                    ExcelName: "",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: "MAU2",
                    Name: "TBTT_CP_BCH_KBCTC",
                    FileName: "TBTT CP_BCH - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "7.TBTT_CP_BCH_KBCTC.docx",
                    ExcelName: "",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: 'MAU9',
                    Name: 'WorkFlow',
                    FileName: 'WorkFlow TT - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=TotalOriginalAmount_Str}',
                    WordName: 'WorkFlow_TT.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }  
            ],
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'ItemNo',
                    width: 44
                },
                {
                    header: 'Nội dung công việc',
                    binding: 'Description',
                    width: 261,
                    dataType: 'String'
                },
                {
                    header: 'Lũy kế đến kỳ trước (gồm VAT)',
                    binding: 'PaymentAmount',
                    width: 121,
                    dataType: 'Number'
                },
                {
                    header: 'Giá trị kỳ này',
                    binding: 'TotalOriginalAmount',
                    width: 126,
                    dataType: 'Number'
                },
                {
                    header: 'Ghi chú',
                    binding: 'Remark',
                    width: 158
                }
            ]
        }
    }

    parentGrid = [
        {
            header: 'Ngày',
            binding: 'DocDate',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'

        },
        {
            header: 'Đợt TT số',
            binding: 'PayRequireNum',
            width: 100,
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
            header: 'Tổng tiền (trước VAT)',
            binding: 'OriginalAmount',
            width: 170,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Tiền thuế',
            binding: 'OriginalAmount3',
            width: 120,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Tổng tiền (gồm VAT)',
            binding: 'TotalOriginalAmount',
            width: 170,
            dataType: 'Number',
            format: 'n0'
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
        //     header: 'Hồ sơ hủy',
        //     binding: 'ClosedApprove',
        //     width: 80,
        //     dataType: 'Boolean'
        // },
        {
            header: 'Đang xử lý',
            binding: 'XuLyTiepTheo',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Số hồ sơ',
            binding: 'DocNo',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Người lập',
            binding: 'FullName',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Người gửi duyệt',
            binding: 'EmployeeNameSend',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Gói thầu/ PB',
            binding: 'ProductName',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Id',
            binding: 'Id',
            width: 50,
            dataType: 'Number'
        },
        {
            header: 'Đang xử lý',
            binding: 'IsProcessing',
            width: 120,
            dataType: 'Boolean'
        },

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

export class LayoutBillEditPayDeptEditor implements IEditorFormulaDeclaration {


    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocCCM_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'P3',
                    BizDocId: '',
                    DocStatus: '4',
                    CurrencyCode: 'VND',
                    ContractType: 'Y',
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
                        DocDate: 'Parent.DocDate'
                    }
                },
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                    }
                },
                {
                    Name: 'vB30BizDocApprove_AEditPayment',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    }
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                }
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'TBTT BCH/PB - {VAR=TenGoiThau} - {VAR=DocNo}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "TBTT CP_BCH",
                    FileName: "TBTT CP_BCH - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "7.TBTT_CP_BCH.docx",
                    ExcelName: "",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ],
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'BuiltinOrder',
                    width: 50,
                    dataType: 'Number',
                    align: 'center'
                },
                {
                    header: 'Tên file',
                    binding: 'FilePath',
                    width: 600,
                    dataType: 'String',
                    align: 'left'
                }
            ]
        }
    }

    evaluators = {
        'Evaluator_ServerConstraint_CTC_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=EmptyField_ParentBizDocId},DocCode,{VAR=Branch.Ma_Dvcs},ProductCostId,CustomerCode,DocDate,Id',
            Command: 'ufn_Coteccons_B30BizDocCCM_DefaultDocNo_New',
            DataMember: 'DocNo'
        },
        'Evaluator_ServerConstraint_CheckUniqueDocNo': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},BizDocId,DocCode,DocNo',
            Command: 'ufn_B30BizDocCCM_CheckUniqueDocNo',
            MessageText: 'Số phiếu thanh toán đã tồn tại',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_DefaultPayRequireNum': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,{VAR=Branch.Ma_Dvcs},{VAR=EmptyField_ParentBizDocId},CustomerCode,ProductCostId',
            Command: 'ufn_B30BizDocCCM_DefaultPayRequireNum',
            DataMember: 'PayRequireNum',
            zExpr: "Id < 0"
        },

        'Evaluator_ServerConstraint_Load_ThanhToanTruoc': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,DocCode,BizDocId,{VAR=Branch.Ma_Dvcs},DocDate,DocNo,PayTeamType,ContractType',
            Command: 'usp_Coteccons_ThanhToanBCH_PB_LoadPrevious2_New',
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_DocumentDetail_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,{VAR=ContractType_BCHPB},{VAR=Branch.Ma_Dvcs},{VAR=IsGetPayment_True},DocCode',
            Command: 'usp_Web_B30BizDocDocument_GetData2',
            DataMember: '',
            OutputTable: 1
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,{VAR=EmptyField_ParentBizDocId}',
            Command: 'usp_B30BizDocApprove_GetData',
            OutputTable: 2
        },
        'Evaluator_ServerConstraint_Check_ThanhToan_KhongLapMoiKhiChuaDuyetCu': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,{VAR=EmptyField_ParentBizDocId},{VAR=EmptyField_CustomerCode},DocCode,{VAR=Branch.Ma_Dvcs},DocDate,ContractType,Id',
            Command: 'ufn_Coteccons_ThanhToan_KhongLapMoiKhiChuaDuyetCu_New',
            zExpr: "ProductCostId != ''",
            MessageText: 'Không thể lập mới khi chưa hoàn thiện duyệt thanh toán trước',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'BizDocId,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Conteccons_NotChangeWhenApproveSent',
            MessageText: 'Không được thay đổi khi đã gửi duyệt',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_ImportedExcel': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Id,DocCode,ProductCostId,{VAR=ParentBizDocId},CustomerCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_CheckImported',
            DataMember: 'CountImport',
            zExpr: "ProductCostId != ''"
        },
        'Evaluator_ServerConstraint_Check_UserModified': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: '{VAR=User.Id},BizDocId,DocCode',
            Command: 'ufn_Coteccons_CheckUser_ModifiedBy',
            MessageText: 'Không được điều chỉnh dữ liệu của người dùng khác',
            IgnoreError: 0,
            zExpr: 'Id > 0 && ApproveSend == false'
        },

        'Evaluator_BizDocDetail_OriginalAmount3': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'OriginalAmount3',
            Value: 'Math.round(OriginalAmount*TaxRate)',
            Tables: 0
        },
        'Evaluator_BizDocDetail_TotalOriginalAmount': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'TotalOriginalAmount',
            Value: 'Math.round(OriginalAmount+OriginalAmount3)',
            Tables: 0
        },

       'Evaluator_ServerConstraint_Amount_TTKyTruoc': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,ProductCostId,{VAR=Branch.Ma_Dvcs},DocCode,DocDate,PayTeamType,ContractType',
            Command: 'usp_Coteccons_P3_TongGiaTriThanhToanDenKyTruoc_New',
            DataMember: 'Amount_TTKyTruoc,Amount_TamUng,Amount_HoanTra',
            zExpr: "ProductCostId != ''"
        },
        'Evaluator_Amount_TongTTDenKyNay_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'Amount_TongTTDenKyNay',
            Value: 'Amount_TTKyTruoc+Amount_DeNghiTT',
            Tables: 0
        },
        'Evaluator_Amount_DeNghiTT_Calculate': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "Amount_DeNghiTT",
            Value: "TotalOriginalAmount",
            Tables: 0,
            zExpr: "'PayTeamType'.toString() != '00'.toString()",
        },
        'Evaluator_Amount_DeNghiTT_Calculate_TU': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'Amount_DeNghiTT',
            Value: 'Amount_TamUng + Amount_GiuLai',
            Tables: 0,
            zExpr: "'PayTeamType'.toString() == '00'.toString()",
        },
        //không đổi tên 
        'Evaluator_ServerConstraint_LoadDataImport': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,{VAR=Branch.Ma_Dvcs},{VAR=User.UserName}',
            Command: 'usp_Coteccons_BizDocCCMDetail_ImportForWeb',
            OutputTable: 0
        },
        //updated
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
        'Evaluator_UpdateApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Coteccons_B30BizDocCCM_SetApproveSend'
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},BizDocId,{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerUpdated_BizDocCCMDetail_UpdateFromParent': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Coteccons_BizDocCCMDetail_UpdateFromParentWEB'
        },
        'Evaluator_ServerUpdated_BizDocCCM_RoundAmount': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Newtecons_BizDocCCM_UpdateAmountFromChild'
        }
    }

    serverConstraint = [
        // 'Evaluator_ServerConstraint_CTC_DefaultDocNo',
        // 'Evaluator_ServerConstraint_Check_ImportedExcel',
        // 'Evaluator_ServerConstraint_Amount_TTKyTruoc',
        // 'Evaluator_ServerConstraint_DefaultPayRequireNum',
        // 'Evaluator_ServerConstraint_Approve_GetData'
    ]

    serverUpdating = [
        // 'Evaluator_Amount_DeNghiTT_Calculate',
        // 'Evaluator_Amount_TongTTDenKyNay_Calculate',
        // 'Evaluator_ServerConstraint_CheckUniqueDocNo',
        // 'Evaluator_ServerConstraint_Check_ThanhToan_KhongLapMoiKhiChuaDuyetCu',
        //  'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        // 'Evaluator_ServerConstraint_Check_UserModified'
    ]

    serverUpdated: string[] = [
        'Evaluator_ServerUpdated_BuiltinOrder',
        // 'Evaluator_UpdateInfo_WhenApproveSend',
        'Evaluator_ServerUpdated_CreateFormula_BizDocCCMDetail',
        'Evaluator_ServerUpdated_BizDocCCMDetail_UpdateFromParent',
        'Evaluator_ServerUpdated_BizDocCCM_RoundAmount'
    ]

    buttonLoadChild: string[] = [
        // 'Evaluator_ServerConstraint_CheckUniqueDocNo',
        // 'Evaluator_ServerConstraint_Check_ThanhToan_KhongLapMoiKhiChuaDuyetCu',
        // 'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        // 'Evaluator_ServerConstraint_Check_UserModified',
        
        'Evaluator_ServerConstraint_Amount_TTKyTruoc',
        // 'Evaluator_ServerConstraint_DocumentDetail_GetData',
        // 'Evaluator_ServerConstraint_Approve_GetData',
        // 'Evaluator_ServerConstraint_Load_ThanhToanTruoc'
    ];

    buttonCommand: string[] = [
        //'Evaluator_Amount_TongTTDenKyNay_Calculate',
        //'Evaluator_Amount_DeNghiTT_Calculate'
    ]

    importCommand: string[] = [
        'Evaluator_Amount_DeNghiTT_Calculate',
        'Evaluator_Amount_TongTTDenKyNay_Calculate'
    ]

    columnChanged: any = {
        PayTeamType: {
            Evaluators: [
                'Evaluator_Amount_DeNghiTT_Calculate_TU',
                'Evaluator_Amount_DeNghiTT_Calculate',
            ]
        },
        Amount_TamUng: {
            Evaluators: [
                'Evaluator_Amount_DeNghiTT_Calculate_TU'
            ]
        },
        Amount_HoanTra: {
            Evaluators: [
                'Evaluator_Amount_DeNghiTT_Calculate_TU'
            ]
        },
        Amount_TTKyTruoc: {
            Evaluators: [
                'Evaluator_Amount_TongTTDenKyNay_Calculate'
            ]
        },
        Amount_DeNghiTT: {
            Evaluators: [
                'Evaluator_Amount_TongTTDenKyNay_Calculate'
            ]
        },
        ProcessCode: {
            Evaluators: [
                // 'Evaluator_ServerConstraint_Approve_GetData'
            ]
        }
    }

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
                OriginalAmount: {
                    Evaluators: [
                        'Evaluator_BizDocDetail_OriginalAmount3',
                        'Evaluator_BizDocDetail_TotalOriginalAmount'
                    ]
                },
                TaxCode: {
                    Evaluators: [
                        'Evaluator_BizDocDetail_OriginalAmount3'
                    ]
                },
                OriginalAmount3: {
                    Evaluators: [
                        'Evaluator_BizDocDetail_TotalOriginalAmount'
                    ]
                },
                TotalOriginalAmount: {
                    Evaluators: [
                        'Evaluator_Amount_DeNghiTT_Calculate'
                    ]
                }
            }
        }
    ];

    columnsReadOnly = [];
    linkReporter = {
        'btnBaoCao': {
            directory: 'reporterbillpaydept',
            type: 'view',
            key: 'REP01_CCM_BILLBCH',
            parameter: { 'Commandkey': 'REP01_CCM_BILLBCH', 'BizDocId': '{EXPR=BizDocId}'}
        }
    }
    panels: PanelBase[] = [
        new TablePanel({
            label: 'Panel 1',
            col: 12,
            controls: [
                new DateBoxInput({
                    key: 'DocDate',
                    label: 'Ngày',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    
                    style: 'background-color:#F1EDED;border-radius:8px;',
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số thanh toán',
                    col: 6,
                    validators: [Validators.required],
                    // isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                }),
                new TextBoxInput({
                    key: 'LastDocNo',
                    label: 'Số TT cũ (nếu có)',
                    type: 'text',
                    col: 12,
                    style: 'background-color:#F1EDED;border-radius:8px;',
                }),
                new LookupBoxInput({
                    key: 'PayTeamType',
                    label: 'Loại thanh toán',
                    lookupKey: 'Class',
                    lookupfilter: "ParentCode='PayTeamType' AND Code IN ('00','01','06')",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 6,
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12,
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'PayRequireNum',
                    label: 'Yêu cầu thanh toán số',
                    dataType: 'text',
                    mask: '000',
                    col: 6,
                    // isReadOnly: 'true',
                    // style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Đối tượng',
                    lookupKey: 'Customer',
                    binding: {
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND CustomerType = '1' AND Code LIKE 'E-%' AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 6,
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "ProcessCode IN (SELECT Code FROM dbo.ufn_Coteccons_Filter_ProcessCodeByProduct_P3('{EXPR=ProductCostId}','{VAR=Branch.Ma_Dvcs}'))",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12,
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Ghi chú',
                    col: 12,
                }),
                new NumberBoxInput({
                    key: 'Amount_TamUng',
                    label: 'Giá trị tạm ứng',
                    col: 6,
                    // isDisabled: "'{EXPR=PayTeamType}' != '00'",
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_HoanTra',
                    label: 'Giá trị hoàn trả tạm ứng đến kỳ trước',
                    col: 6,
                    isDisabled: 'true',
                    isNewRow: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_GiuLai',
                    label: 'Giá trị hoàn trả tạm ứng kỳ này',
                    col: 6,
                    isNewRow: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_TTKyTruoc',//'PaymentAmount_KyTruoc',
                    label: 'Tổng GTTT đến kỳ trước (gồm VAT)',
                    col: 6,
                    isNewRow: 'true',
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    //isDisabled: "'{EXPR=CountImport}' == 'true'"
                }),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'Amount_DeNghiTT',//'TotalOriginalAmount',
                    label: 'GTTT kỳ này (gồm VAT)',
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'CompletedApprove',
                    label: 'Đã hoàn thiện duyệt',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_TongTTDenKyNay',//'PaymentAmount_KyNay',
                    label: 'Tổng GTTT đến kỳ này (gồm VAT)',
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 6
                }),
                new ButtonInput({
                    key: 'btnBaoCao',
                    label: 'Báo cáo bill thanh toán BCH/PB',
                    col: 6
                }),
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'Đính kèm TBTT đã ký',
                //     col: 6
                // }, this.srv)
            ]
        }),
    ];

    childColumns = [
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 50
        },
      
      
        {
            header: 'Diễn giải',
            binding: 'Description',
            width: 250
        },
        {
            header: 'Số hóa đơn',
            binding: 'AtchDocNo',
            width: 100
        },
   
       
         {
            header: 'Ngày hóa đơn',
            binding: 'AtchDocDate',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
      
        // {
        //     header: 'Đối tượng VAT',
        //     binding: 'TaxRegName',
        //     width: 200
        // },
        {
            header: 'MST NCC',
            binding: 'TaxRegNo',
            allowEditing: true,
            width: 100
        },
         {
            header: 'Người nhận tiền',
            binding: 'DesignerEmployeeCode',
            width: 100,
            dataType: 'Array',
             bindingList: {
                Name: 'EmployeeName'
            },
            lookupKey: 'Customer',
            lookupfilter: "IsActive=1 AND IsGroup=0 AND Code LIKE 'E-%'"
            // lookupfilter: "IsGroup=0 AND IsParentAccount=0 AND LEFT(Code,3) IN (SELECT Val FROM dbo.ufn_sys_SplitString((SELECT ListAccount FROM dbo.B20ExpenseCatg WHERE Code = '{EXPR=ExpenseCatgCode}'), ','))"
        },
         
          {
            header: 'Giá trị thanh toán',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 100
        },
         {
            header: 'Người nhận tiền',
            binding: 'EmployeeName',
            isReadOnly: 'true',
            width: 200
        },
          {
            header: 'Số seri',
            binding: 'AtchSerialNo',
            width: 100
        },
        {
            header: 'Giá trị hóa đơn (chưa VAT)',
            binding: 'Amount_ThNotVAT',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 120
        },
       
        {
            header: 'VAT',
            binding: 'Amount3_Th',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 120
        },
         {
            header: 'Giá trị hóa đơn (gồm VAT)',
            binding: 'Amount_Th',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 120
        },
      
       
       
        
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            isReadOnly: 'true',
            width: 50
        },
        {
            header: 'Bậc',
            binding: 'Level',
            dataType: 'Number',
            width: 50,
            isReadOnly: 'true',
            format: 'n0'
        },
        {
            header: 'Công thức',
            binding: 'Formula',
            width: 200,
            isReadOnly: 'true'
        },

         {
            header: 'Invoice',
            binding: 'InvoiceId',
            width: 200,
            isReadOnly: 'true'
        }
    ];

    childColumns1 = [
        {
            header: 'Mã tài liệu',
            binding: 'DocumentCode',
            width: 80,
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Document',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            isReadOnly: 'true'
        },
        {
            header: 'Tên tài liệu',
            binding: 'DocumentName',
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Yêu cầu đính kèm',
            binding: 'Attached',
            dataType: 'Boolean',
            width: 60,
            isReadOnly: 'true'
        },
        {
            header: 'Ghi chú',
            binding: 'Description',
            width: 250
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 600,
            dataType: 'Object',
            //validators: "{EXPR=Description} != '' && {EXPR=Description} == 'Yêu cầu đính kèm' && {EXPR=FilePath}==0",
            validators: "{EXPR=Attached} == true && {EXPR=Description} != 'Theo mẫu công ty ban hành' && {EXPR=FilePath}==0",
            validatorMessage: 'Yêu cầu đính kèm tài liệu',
            ignoreError: 1
            //exprReadOnly: "{EXPR=Attached} == true && {EXPR=Description} != ''"
        }
    ]

    childColumns2 = [
        {
            header: 'STT duyệt',
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
            width: 150,
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
        {
            header: 'Được trả lại hồ sơ',
            binding: 'ApproveReturn',
            dataType: 'Boolean',
            width: 80,
            isReadOnly: 'true'
        },
        {
            header: 'Trả về cấp bậc',
            binding: 'PositionCodeReturn',
            width: 150,
            isReadOnly: 'true'
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
}
