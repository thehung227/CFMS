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

// Thanh toán thầu phụ/ nhà cung cấp
export class LayoutBillPaySuppEditExplorer implements IExplorerFormulaDeclaration {

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocCCM_Explore',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode IN ('P4') AND IsActive=1  AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'ProductName,CustomerName,DocDate DESC,DocNo DESC',
                RowPage: 50
            },
            Child: {
                Name: 'vB30BizDocApprove_ExplorerCCM',
                ParentKey: 'BizDocId',
                ChildKey: 'BizDocId',
                OrderBy: 'ApproveGroup'
            }
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'TBTT TP/NCC - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            Command_BillSupp: 'usp_B30BizDocCCM_VoucherForm_DGKL',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "TBTT NTP.NCC",
                    FileName: "TBTT NTP.NCC - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "6.TBTT_NTP_NCC.docx",
                    ExcelName: "",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: "MAU2",
                    Name: "TBTT NTP.NCC - ME",
                    FileName: "TBTT NTP.NCC ME - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "TBTT_NTP_NCC_ME.docx",
                    ExcelName: "",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: "MAU3",
                    Name: "TBTT NTP.NCC - TB",
                    FileName: "TBTT NTP.NCC TB - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "TBTT_NTP_NCC_TB.docx",
                    ExcelName: "",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: 'MAU9',
                    Name: 'WorkFlow',
                    FileName: 'WorkFlow TT - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=Amount_DeNghiTT_Str}',
                    WordName: 'WorkFlow_TT.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: "MAU10",
                    Name: "Bảng KLTT TP.NCC",
                    FileName: "Bảng KTLL TP.NCC - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "5.Bang_KLTT_NTP_NCC_0.docx",
                    ExcelName: "5.Bang_KLTT_NTP_NCC_0.xlsx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: "MAU11",
                    Name: "TBTT NTP.NCC.TC",
                    FileName: "TBTT NTP.NCC.TC - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "6.TBTT_NTP_NCC_KBCTC.docx",
                    ExcelName: "",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
            ]
        }
    }

    lookup1 = {
        Table: 'B20Currency',
        Filter: "IsActive =1 AND Code <> 'VND'",
        ColumnFilter: ''
    }

    defaultWhenNew = { 'Commandkey': 'billpaysuppedit-editor', 'CurrencyCode': '{FORM=_lookup1Value}' }

    defaultWhenEdit = { 'Commandkey': 'billpaysuppedit-editor', 'CurrencyCode': '{EXPR=CurrencyCode}' }

    parentGrid = [
        {
            header: 'Đối tác',
            binding: 'CustomerName',
            width: 300
        },
        {
            header: 'Nội dung hợp đồng',
            binding: 'Description_Hd',
            width: 400
        },
        {
            header: 'Đợt TT số',
            binding: 'PayRequireNum',
            width: 100,
            dataType: 'String'
        },
        {
            header: 'Ngày gửi duyệt',
            binding: 'DateSend',
            width: 180,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Ngày hoàn thiện duyệt',
            binding: 'FinishDate',
            width: 180,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Quy trình duyệt',
            binding: 'ProcessName',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'GT đề nghị t.toán',
            binding: 'Amount_DeNghiTT',
            width: 150
        },
        {
            header: 'Tổng GTTT đến kỳ này',
            binding: 'Amount_TongTTDenKyNay',
            width: 170
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
            header: 'Số hồ sơ',
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
            header: 'Số hợp đồng',
            binding: 'DocNo_Hd',
            width: 200
        },
        {
            header: 'Gói thầu/ PB',
            binding: 'ProductName',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Mã T.tệ',
            binding: 'CurrencyCode',
            width: 50
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
        {
            header: 'Đề nghị TT',
            binding: 'Amount_DeNghiTT_Str',
            width: 150
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

export class LayoutBillPaySuppEditEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocCCM_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'P4',
                    BizDocId: '',
                    DocStatus: '4',
                    // CurrencyCode: 'VND',
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
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
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
                },
        
                {
                    Name: 'vB30BizDocAtchDoc',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',

                    }
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
                }
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'TBTT TP/NCC - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "TBTT NTP.NCC",
                    FileName: "TBTT NTP.NCC - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "6.TBTT_NTP_NCC.docx",
                    ExcelName: "",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: "MAU2",
                    Name: "TBTT_TP_NCC_KBCTC",
                    FileName: "TBTT TP/NCC - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "6.TBTT_NTP_NCC_KBCTC.docx",
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
            ConstraintKey: 'ParentBizDocId,DocCode,{VAR=Branch.Ma_Dvcs},ProductCostId,CustomerCode,DocDate,Id',
            Command: 'ufn_Coteccons_B30BizDocCCM_DefaultDocNo_P4',
            DataMember: 'DocNo'
            //zExpr: "'PayTeamType'.toString() != '00'.toString()"
        },
        // 'Evaluator_ServerConstraint_CTC_DefaultDocNo_TamUng': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: 'DocCode,ProductCostId,PayTeamType,CustomerCode,{VAR=Branch.Ma_Dvcs},Id',
        //     Command: 'ufn_Coteccons_B30BizDocCCM_DefaultDocNo_TamUng',
        //     DataMember: 'DocNo',
        //     zExpr: "'PayTeamType'.toString() == '00'.toString()"
        // },
        'Evaluator_ServerConstraint_DefaultPayRequireNum': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ProductCostId,CustomerCode,ParentBizDocId,{VAR=Branch.Ma_Dvcs},Id',
            Command: 'ufn_B30BizDocCCM_DefaultPayRequireNum_2',
            DataMember: 'PayRequireNum',
            //zExpr: "'PayTeamType'.toString() != '00'.toString()"
        },
        'Evaluator_ServerConstraint_ParentBizDocId_PayTeamType_Unique': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ParentBizDocId,PayTeamType,{VAR=Branch.Ma_Dvcs},Id',
            Command: 'ufn_Coteccons_ThanhToan_CheckUnique_LoaiThanhToan',
            MessageText: 'Thanh toán tiền giữ lại đã được lập',
            IgnoreError: 0,
            zExpr: "'PayTeamType'.toString() == '03'.toString()"
        },
        'Evaluator_ServerConstraint_Exists_Settlement': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ParentBizDocId,ProductCostId,PayTeamType,{VAR=Branch.Ma_Dvcs},Id',
            Command: 'ufn_Coteccons_ThanhToan_CheckExists_Settlement',
            MessageText: 'Không thể thanh toán cho hợp đồng đã lập quyết toán',
            IgnoreError: 0,
            zExpr: "'PayTeamType'.toString() != '03'.toString()"
        },
        'Evaluator_ServerConstraint_GetValue_From_BillThanhToan': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "BizDocId_TT,{VAR=Branch.Ma_Dvcs},{VAR=DocCodeB4}",
            Command: 'usp_Coteccons_GetValue_FormThanhToan',
            DataMember: 'Amount_ThiCong,Amount_THDenKyNay,Amount_TTKyNay,Amount_TamUng,Amount_HoanTra,Amount_TongTTDenKyNay,Amount_TTKyTruoc,Amount_DeNghiTT,Amount_ThiCongNotVAT,Amount_THDenKyNayNotVAT,Amount_KhauTruBaoHanh',
            // zExpr: "BizDocId_TT != ''"
        },
        'Evaluator_ServerConstraint_GetValue_ContractValue': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "ParentBizDocId,{VAR=Branch.Ma_Dvcs},{VAR=DocCodeC3}",
            Command: 'ufn_Coteccons_GetValueContract_SubContract',
            DataMember: 'ContractValue'
        },
        'Evaluator_ServerConstraint_GetValue_SubContractValue': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "ParentBizDocId,{VAR=Branch.Ma_Dvcs},{VAR=DocCodeC4}",
            Command: 'ufn_Coteccons_GetValueContract_SubContract',
            DataMember: 'SubContractValue'
        },
        'Evaluator_ServerConstraint_GetValue_DueDate': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "ParentBizDocId,PayTeamType,{VAR=Branch.Ma_Dvcs}",
            Command: 'ufn_Coteccons_GetDueDate',
            DataMember: 'DueDate'
        },
        'Evaluator_ServerConstraint_GetValue_Amount_HDPL': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "ParentBizDocId,{VAR=Branch.Ma_Dvcs},{VAR=DocCodeC34}",
            Command: 'ufn_Coteccons_GetValueContract_SubContract',
            DataMember: 'Amount_HDPL'
        },
        'Evaluator_ServerConstraint_GetValue_Amount_TamUng': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "ParentBizDocId,{VAR=Branch.Ma_Dvcs}",
            Command: 'ufn_Coteccons_GetValueContract_TamUng',
            DataMember: 'Amount_TamUng',
            zExpr: "'PayTeamType'.toString() == '00'.toString()"
        },
        'Evaluator_ServerConstraint_GetValue_TienGiuLaiBaoHanh': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "ProductCostId,ParentBizDocId,PayTeamType,{VAR=Branch.Ma_Dvcs},Id,Amount_DeNghiTT",
            Command: 'usp_Coteccons_GetAmount_GiuLaiQuyetToan',
            DataMember: 'Amount_DeNghiTT,Amount_TTKyTruoc,Amount_THDenKyNay,Amount_TTKyNay,Amount_TongTTDenKyNay,Amount_ThiCong,Amount,Amount_TamUng,Amount_HoanTra',
            zExpr: "'PayTeamType'.toString() == '03'.toString()"
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,ParentBizDocId',
            Command: 'usp_B30BizDocApprove_GetData',
            DataMember: '',
            OutputTable: 2
        },
        'Evaluator_ServerConstraint_DocumentDetail_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ContractType,{VAR=Branch.Ma_Dvcs},{VAR=IsGetPayment_True},DocCode',
            Command: 'usp_Web_B30BizDocDocument_GetData2',
            DataMember: '',
            OutputTable: 1
        },
        'Evaluator_ServerConstraint_Check_ThanhToan_KhongLapMoiKhiChuaDuyetCu': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,ParentBizDocId,CustomerCode,DocCode,{VAR=Branch.Ma_Dvcs},Id',
            Command: 'ufn_Coteccons_ThanhToan_KhongLapMoiKhiChuaDuyetCu',
            zExpr: "ProductCostId != '' && BizDocId_TT == ''",
            MessageText: 'Không thể lập mới khi chưa hoàn thiện duyệt thanh toán trước',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_ListInvoice': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ListInvoice,ProcessCode',
            Command: 'ufn_CheckProcessCode_ListInvoice',
            
            MessageText: 'Yêu cầu xác định hóa đơn !!!',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_AmountListInvoice': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ListInvoice,Amount_DeNghiTT,BizDocId_TT',
            Command: 'ufn_Get_CheckInvoiceCems_Bill',
            zExpr: "ListInvoice != '' && BizDocId_TT != ''",
            MessageText: 'Giá trị đề nghị thanh toán chưa khớp với Tổng giá trị hóa đơn !!!',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_FilePathContract': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ParentBizDocId',
            Command: 'ufn_CheclFilePathFromB30BizDoc',
            zExpr: "ParentBizDocId != ''",
            MessageText: 'Chưa đính kèm file scan HĐ đã ký !!!',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_Amount_TamUng': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ParentBizDocId,Amount_TamUng',
            Command: 'ufn_CheckGiaTriTamUngBill',
            zExpr: "ParentBizDocId != ''",
            MessageText: 'Giá trị tạm ứng vượt quá giá trị HĐ + PLHĐ !!!',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_ProcessCode': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProcessCode,ProductCostId,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_ThanhToan_CheckProcessCode',
            zExpr: "ProductCostId != '' && ProcessCode != ''",
            MessageText: 'Dự án chưa có dự trù chi phí, kiểm tra lại quy trình duyệt',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_ThanhToan_TamUng': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,CustomerCode,PayTeamType,{VAR=Branch.Ma_Dvcs},Id',
            Command: 'ufn_Coteccons_CheckUnique_TamUngChuaCoHopDong',
            MessageText: 'Chỉ được lập "Tạm ứng" tối đa 3 lần',
            zExpr: "'PayTeamType'.toString() == '00'.toString()",
            IgnoreError: 0
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
            zExpr: 'Id > 0 && ApproveSend == false'
        },
        'Evaluator_Amount_TTKyNay_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_TTKyNay",
            Value: "Amount_TamUng",
            zExpr: "'PayTeamType'.toString() == '00'.toString()"
        },
        'Evaluator_Amount_TongTTDenKyNay_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_TongTTDenKyNay",
            Value: "Amount_TamUng - Amount_TTKyTruoc + Amount_KhauTruBaoHanh",
            zExpr: "'PayTeamType'.toString() == '00'.toString()"
        },
        'Evaluator_Amount_DeNghiTT_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_DeNghiTT",
            Value: "Amount_TongTTDenKyNay + Amount_TTKyTruoc",
            zExpr: "'PayTeamType'.toString() == '00'.toString()"
        },
        'Evaluator_ServerConstraint_Check_KhongLapBCTCHangKy': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'Id,DocDate,ParentBizDocId,CustomerCode,ProductCostId',
            Command: 'ufn_SOL_Check_KhongLapBCTCDinhKy',
            MessageText: 'Không có BCTC mới nhất được cập nhật, không thể gửi thanh toán',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
        //không đổi tên
        // 'Evaluator_UpdateApproveSend': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: 'BizDocId',
        //     Command: 'usp_Coteccons_B30BizDocCCM_SetApproveSend'
        // },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},BizDocId,{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerConstraint_Amount_TTKyTruoc': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,ProductCostId,ParentBizDocId,{VAR=Branch.Ma_Dvcs},DocCode,DocDate,CustomerCode',
            Command: 'usp_Coteccons_Bill_TongGiaTriThanhToanDenKyTruoc',
            DataMember: 'Amount_TTKyTruoc',
            zExpr: "ProductCostId != '' && ParentBizDocId != '' && CustomerCode != '' AND 'PayTeamType'.toString() == '00'.toString()"
        },
        'Evaluator_ServerConstraint_Amount_KyTruoc': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,ProductCostId,ParentBizDocId,{VAR=Branch.Ma_Dvcs},DocCode,DocDate,CustomerCode',
            Command: 'usp_Coteccons_Bill_TongGiaTriTHDenKyTruoc',
            DataMember: 'Amount_ThiCongNotVAT,Amount_ThiCong,Amount_THDenKyNayNotVAT,Amount_THDenKyNay,Amount_HoanTra',
            zExpr: "ProductCostId != '' && ParentBizDocId != '' && CustomerCode != '' AND 'PayTeamType'.toString() == '00'.toString()"
        },
        'Evaluator_ServerConstraint_DateDue': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Date_Liquidation,DueDate',
            Command: 'usp_Newtecons_Web_DateAdd',
            DataMember: 'DateDue'
        },
        'Evaluator_ServerUpdated_UpdateValueOfTBTT': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,Id,BizDocId_TT,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_UpdateValueOfTBTT',
            //zExpr: "BizDocId_TT != ''"
        },
       
        'Evaluator_ServerConstraint_Check_GiaTriThucHien_BCTC': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,ParentBizDocId,CustomerCode,Amount_THDenKyNayNotVAT,TaxRate,DocDate,{VAR=Branch.Ma_Dvcs},{VAR=User.Id}",
            Command: 'ufn_Coteccons_BillThanhToan_CheckGiaTriThucHien_BCTC',
            MessageText: 'Giá trị thực hiện đã vượt quá hạn mức Dự trù - Liên hệ CHT cập nhật',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_GiaTriThucHien_KHKK': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,ParentBizDocId,CustomerCode,Amount_THDenKyNayNotVAT,TaxRate,DocDate,{VAR=Branch.Ma_Dvcs},{VAR=User.Id}",
            Command: 'ufn_Coteccons_BillThanhToan_CheckGiaTriThucHien_KHKK',
            MessageText: 'Giá trị thực hiện đã vượt quá hạn mức Kế hoạch ký kết Hợp đồng - Liên hệ QS cập nhật',
            IgnoreError: 0
        },
        'Evaluator_ServerUpdating_Check_UpFileContact': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,ParentBizDocId,DocCode,Id,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_CheckUpFileContact',
            MessageText: 'Hợp đồng, PLHĐ đã hoàn thiện duyệt quá 45 ngày hoặc bill kỳ 2 nhưng chưa upload bản ký, không được gửi thanh toán',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerUpdating_Check_Ma_QLKL': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'BizDocId_TT,PayTeamType,ParentBizDocId',
            Command: 'ufn_CheckMaQLKL',
            MessageText: 'Bảng khối lượng chưa hoàn thành chọn Mã quản lý khối lượng. Kiểm tra lại !!!',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerUpdating_Check_K6': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,{VAR=User.Id}',
            Command: 'ufn_Check_DoanhThu_DongTien_Bill',
            MessageText: 'Không phát sinh kế hoạch doanh thu trong 30 ngày. Vui lòng cập nhật kế hoạch dòng tiền !!!',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        }
    }

    serverConstraint = [
        
        'Evaluator_ServerConstraint_Amount_TTKyTruoc',
        // 'Evaluator_ServerConstraint_Amount_KyTruoc',
        // 'Evaluator_ServerConstraint_CTC_DefaultDocNo',
        // 'Evaluator_ServerConstraint_DefaultPayRequireNum',
        'Evaluator_ServerConstraint_GetValue_ContractValue',
        'Evaluator_ServerConstraint_GetValue_SubContractValue',
        'Evaluator_ServerConstraint_GetValue_Amount_HDPL',
        // 'Evaluator_ServerConstraint_GetValue_Amount_TamUng',
        'Evaluator_ServerConstraint_GetValue_TienGiuLaiBaoHanh',
        'Evaluator_ServerConstraint_GetValue_From_BillThanhToan',
        // 'Evaluator_ServerConstraint_GetValue_DueDate',
        // 'Evaluator_ServerConstraint_DateDue',
        // 'Evaluator_Amount_TTKyNay_Calculate',
        // 'Evaluator_Amount_DeNghiTT_Calculate'
    ]

    serverUpdating = [
        // 'Evaluator_ServerConstraint_Check_ListInvoice',
        // 'Evaluator_ServerConstraint_Check_AmountListInvoice',
        
        // 'Evaluator_ServerConstraint_Exists_Settlement',
        // 'Evaluator_ServerConstraint_Check_ProcessCode',
        // 'Evaluator_ServerConstraint_Check_GiaTriThucHien_BCTC',
        // 'Evaluator_ServerConstraint_Check_GiaTriThucHien_KHKK',
        // 'Evaluator_ServerConstraint_Check_ThanhToan_KhongLapMoiKhiChuaDuyetCu',
        // 'Evaluator_ServerConstraint_Check_FilePathContract',
        // 'Evaluator_ServerConstraint_Check_Amount_TamUng',
        // 'Evaluator_ServerConstraint_Check_ThanhToan_TamUng',
        // 'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        // 'Evaluator_ServerConstraint_Check_UserModified',
        // 'Evaluator_ServerUpdating_Check_UpFileContact',
        // 'Evaluator_ServerUpdating_Check_Ma_QLKL',
        // 'Evaluator_ServerUpdating_Check_K6',
        // 'Evaluator_ServerConstraint_Check_KhongLapBCTCHangKy'
        
    ]

    serverUpdated: string[] = [
        // 'Evaluator_UpdateInfo_WhenApproveSend',
        // 'Evaluator_ServerUpdated_UpdateValueOfTBTT',
        // 'Evaluator_Amount_DeNghiTT_Calculate'
    ]

    buttonLoadChild: string[] = [
        // 'Evaluator_ServerConstraint_ParentBizDocId_PayTeamType_Unique',
        'Evaluator_ServerConstraint_Amount_TTKyTruoc',
        'Evaluator_ServerConstraint_Amount_KyTruoc',
        // 'Evaluator_ServerConstraint_Exists_Settlement',
        // 'Evaluator_ServerConstraint_Check_ThanhToan_KhongLapMoiKhiChuaDuyetCu',
        // 'Evaluator_ServerConstraint_Check_ThanhToan_TamUng',
        // 'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        // 'Evaluator_ServerConstraint_Check_UserModified',
        // //
        // 'Evaluator_ServerConstraint_Approve_GetData',
        // 'Evaluator_ServerConstraint_DocumentDetail_GetData'
    ];

    buttonCommand: string[] = [

    ]

    columnChanged: any = {
        Amount_TamUng: {
            Evaluators: [
                // 'Evaluator_Amount_TTKyNay_Calculate',
                'Evaluator_Amount_TongTTDenKyNay_Calculate',
                'Evaluator_Amount_DeNghiTT_Calculate'
            ]
        },
        // Amount_KhauTruBaoHanh: {
        //     Evaluators: [
        //         'Evaluator_Amount_TongTTDenKyNay_Calculate'
        //     ]
        // },
        // ProcessCode: {
        //     Evaluators: [
        //         'Evaluator_ServerConstraint_Approve_GetData',
        //         'Evaluator_ServerConstraint_Check_ProcessCode'
        //     ]
        // },
        // Date_Liquidation: {
        //     Evaluators: [
        //         'Evaluator_ServerConstraint_GetValue_DueDate',
        //         'Evaluator_ServerConstraint_DateDue'
        //     ]
        // },
        // DueDate: {
        //     Evaluators: [
        //         'Evaluator_ServerConstraint_GetValue_DueDate',
        //         'Evaluator_ServerConstraint_DateDue'
        //     ]
        // }
    }

    columnsReadOnly = [];

    linkReporter = {
        'btnPhuLucA': {
            directory: 'billsupp',
            type: 'detail',
            key: 'Id_TT',
            parameter: { 'Commandkey': 'billsupp-editor', 'ProductCostId': '{EXPR=ProductCostId}', 'ParentBizDocId': '{EXPR=ParentBizDocId}', 'DocDate': '{EXPR=DocDate}', 'CustomerCode': '{EXPR=CustomerCode}', 'PayTeamType': '{EXPR=PayTeamType}', 'DocNo': '{EXPR=DocNo}', 'CurrencyCode': '{EXPR=CurrencyCode}', 'ParentId': '{EXPR=Id}' },
            evaluator: 'Evaluator_ServerConstraint_Check_ThanhToan_KhongLapMoiKhiChuaDuyetCu'
        },
        'btnHdPl': {
            directory: 'regcontract_viewCT',
            type: 'detail',
            command: "{EXPR=DocCode_HdPl} == 'C3' ? 'detailc3' : {EXPR=DocCode_HdPl} == 'C4' ? 'detailc4' : ''",
            key: 'Id_HdPl'
        },
        'btnAccountAtch': {
            directory: 'billpaysuppattach',
            type: 'detail',
            parameter: { 'Commandkey': 'billpaysuppattach-editor' },
            key: 'Id'
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
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
             
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số thanh toán',
                    dataType: 'text',
                    col: 6,
                    validators: [Validators.required],
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
              
                new TextBoxInput({
                    key: 'LastDocNo',
                    label: 'Số TT tay (nếu có)',
                    type: 'text',
                    col: 12,
                    
                    style: 'background-color:#F1EDED;border-radius:8px;',
                }),
                new LookupBoxInput({
                    key: 'PayTeamType',
                    label: 'Loại thanh toán',
                    lookupKey: 'Class',
                    lookupfilter: "ParentCode='PayTeamType' AND Code IN ('00','01','03','04','05','07')",
                    hideValueMember: false,
                    
                    validators: [Validators.required],
                    col: 6,
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'PayRequireNum',
                    label: 'Yêu cầu thanh toán số',
                    dataType: 'text',
                    mask: '000',
                    col: 6,
                    // isReadOnly: 'true',
                    //style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    validators: [Validators.required],
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Hợp đồng',
                    lookupKey: 'BizDoc_CTC',
                    binding: {
                        CustomerCode: 'CustomerCode',
                        JobCode: 'JobCode',
                        ContractType: 'ContractType',
                        // NumberOfDay: 'DueDate',
                        ClassCode1: 'ClassCode1',
                        //CurrencyCode: 'CurrencyCode',
                        Id: 'Id_HdPl',
                        DocCode: 'DocCode_HdPl'
                    },
                    validators: [Validators.required],
                    lookupfilter: "(((DocCode = 'C3' OR (DocCode = 'C4' AND IsSubContractPay = 1)) AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId IN (SELECT RowId FROM B20Product WHERE ParentRowId='{EXPR=ProductCostId}')) AND ContractTypeFilter='B4') OR (DocCode='C3' AND IsSubContractPay = 1)) AND Closed = 0 AND CompletedApprove=1 AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    //isDisabled: "'{EXPR=PayTeamType}' == '00'",// || '{EXPR=PayTeamType}' == '03'",
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Thầu phụ/ NCC',
                    lookupKey: 'Customer_CCM2',
                    binding: {
                        Name: 'Person',
                        Address: 'Address',
                        Person: 'ContactPerson'
                    },
                    validators: [Validators.required],
                    //lookupfilter: "((('{EXPR=PayTeamType}' = '00' OR '{EXPR=PayTeamType}' = '04') OR ('{EXPR=ProductType}'=3) OR Code IN (SELECT A.CustomerCode FROM B30CCMBudgetDetail A INNER JOIN B30CCMBudget B ON A.CCMBudgetId = B.CCMBudgetId WHERE (A.CompletedApproveDetail=1 AND A.Loai_Dt IN ('NTP','NCC')) AND B.IsActive=1 AND B.DocCode='K1' AND B.ProductCostId ='{EXPR=ProductCostId}' GROUP BY A.CustomerCode)) AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%')",
                    lookupfilter: "('{EXPR=PayTeamType}' = '04' OR '{EXPR=ProductType}'=3 OR Code IN (SELECT Code FROM dbo.ufn_Coteccons_Filter_CustomerCode('{EXPR=ProductCostId}','{EXPR=DocDate}','{EXPR=DocCode}','{VAR=Branch.Ma_Dvcs}'))) AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
                    hideValueMember: false,
                    isDisabled: "'{EXPR=PayTeamType}' != '00' && '{EXPR=PayTeamType}' != '04'",
                    col: 12
                }, this.srv, this.parentData),
                new MultiSelectInput({
                    key: 'JobCode',
                    label: 'Công việc',
                    lookupKey: 'Job',
                    hideValueMember: false,
                    isDisabled: "'{EXPR=PayTeamType}' != '00' && '{EXPR=PayTeamType}' != '04'",
                    col: 6
                }, this.srv),
                new LookupBoxInput({
                    key: 'ContractType',
                    label: 'Loại hợp đồng',
                    lookupKey: 'ContractType',
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 6
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'ContractValue',
                    label: 'GTHĐ ban đầu (gồm VAT)',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'SubContractValue',
                    label: 'Điều chỉnh HĐ (gồm VAT)',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_HDPL',
                    label: 'GTHĐ đ.chỉnh (gồm VAT)',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new ButtonInput({
                    key: 'btnPhuLucA',
                    label: 'Bảng khối lượng thanh toán',
                    col: 6,
                    isDisabled: "('{EXPR=PayTeamType}' != '01' && '{EXPR=PayTeamType}' != '04' && '{EXPR=PayTeamType}' != '05')  || '{EXPR=Id}' < 0"
                }),
                new LookupBoxInput({
                    key: 'BizDocId_TT',
                    label: 'Bảng KL thanh toán',
                    lookupKey: 'BizDocCCM',
                    hideValueMember: true,
                    binding: {
                        //DocNo: 'DocNo',
                        Id: 'Id_TT'
                    },
                    lookupfilter: "ParentId = '{EXPR=Id}' AND '{EXPR=Id}'>0 AND DocCode='B4'",
                    //lookupfilter: "DocCode IN ('B4') AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}' AND CustomerCode='{EXPR=CustomerCode}'  AND BizDocId NOT IN (SELECT BizDocId_TT FROM B30BizDocCCM WHERE DocCode='P4' AND IsActive=1 AND BizDocId_TT <>'' AND BizDocId <> '{EXPR=BizDocId}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}')",
                    //validators: [Validators.required],
                    col: 6,
                    isDisabled: "'{EXPR=PayTeamType}' == '00' || '{EXPR=PayTeamType}' == '03'"
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'Amount_ThiCong',
                    label: 'Tổng giá trị khoán thi công',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_TamUng',
                    label: 'Giá trị tạm ứng',
                    col: 6,
                    isDisabled: "'{EXPR=PayTeamType}' != '00'",
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_THDenKyNay',
                    label: 'Giá trị t.hiện đến kỳ này',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_HoanTra',
                    label: 'Giá trị hoàn trả tạm ứng',
                    col: 6,
                    // isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_TTKyNay',
                    label: 'Giá trị TT đến kỳ này',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_TTKyTruoc',
                    label: 'Tổng GTTT đến kỳ trước',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_KhauTruBaoHanh',
                    label: 'Khấu trừ khác (tiền phạt, tiện ích,...)',
                    col: 6,
                    isDisabled: "'{EXPR=PayTeamType}' != '00'"
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new LookupBoxInput({
                    key: 'CurrencyCode',
                    label: 'Mã tiền tệ',
                    lookupKey: 'Currency',
                    lookupfilter: "IsActive=1 AND IsGroup=0",
                    hideValueMember: false,
                    col: 6,
                    validators: [Validators.required],
                    //isDisabled: 'true'
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'Amount_TongTTDenKyNay',
                    label: 'Tổng GTTT đến kỳ này',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
               
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "(ProcessCode IN (SELECT Code FROM dbo.ufn_Coteccons_Filter_ProcessCodeByBizDocC3('{EXPR=ProductCostId}','{EXPR=ParentBizDocId}','{EXPR=DocCode}','{VAR=Branch.Ma_Dvcs}')))",//('{EXPR=PayTeamType}' = '00') OR 
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 6
                }, this.srv, this.parentData),
              
                new NumberBoxInput({
                    key: 'Amount_DeNghiTT',
                    label: 'Giá trị đề nghị thanh toán',
                    col: 6,
                    isDisabled: "'{EXPR=PayTeamType}' == '01' || '{EXPR=PayTeamType}' == '04'",
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
            
                new TextBoxInput({
                    key: 'Description',
                    label: 'Ghi chú',
                    dataType: 'text',
                    col: 12,
                    
                }),
                new MultiSelectInput({
                    key: 'ListInvoice',
                    label: 'Hóa đơn thiết bị',
                    lookupKey: 'InvoiceCems',
                    lookupfilter: "(ProductCostIdKT='{EXPR=ProductCostId}' AND CustomerCode='{EXPR=CustomerCode}' AND IdInvoice IN (SELECT IdInvoice FROM dbo.ufn_Get_FilterInvoiceCems('{EXPR=DocDate}','{EXPR=CustomerCode}','{EXPR=ProductCostId}','{EXPR=BizDocId}')))",//('{EXPR=PayTeamType}' = '00') OR 
                    // isDisabled: 'true',
                    // hideValueMember: false,
                    col: 6
                }, this.srv),
               
                new LookupBoxInput({
                    key: 'ClassCode1',
                    label: 'TT back theo CĐT',
                    lookupKey: 'Class',
                    lookupfilter: "IsActive=1 AND ParentCode='DT_CDT_CD'",
                    isDisabled: 'true',
                    // hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),
                new DateBoxInput({
                    key: 'Date_Liquidation',
                    label: 'Ngày tính hạn thanh toán',
                    isNewRow: 'true',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    
                    // validators: [Validators.required],
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'DueDate',
                    label: 'Hạn thanh toán (Ngày)',
                    col: 6,
                    format: 'N0',
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new LookupBoxInput({
                    key: 'TransType',
                    label: 'Bao thanh toán',
                    lookupKey: 'Class',
                    lookupfilter: "IsActive=1 AND ParentCode='LOAITT'",
                    hideValueMember: false,
                    col: 6,
                    
                }, this.srv, this.parentData),   
                new DateBoxInput({
                    key: 'DateDue',
                    label: 'Ngày đến hạn thanh toán',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    isDisabled: 'true',
                    col: 6,
                    
                    validators: [Validators.required],
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new ButtonInput({
                    key: 'btnHdPl',
                    label: 'Xem hợp đồng',
                    style: 'background-color:#9cc09c;',
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    col: 6,
                    isDisabled: 'true'
                }),
                new CheckBoxInput({
                    key: 'CompletedApprove',
                    label: 'Đã hoàn thiện duyệt',
                    isDisabled: 'true',
                    col: 6
                }),
                new ButtonInput({
                    key: 'btnAccountAtch',
                    label: 'Kế toán đính kèm',
                    style: 'background-color:#9cc09c;',
                    col: 6,
                    isDisabled: "'{EXPR=Id}' < 0"
                }),
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'Đính kèm TBTT đã ký',
                //     col: 6
                // }, this.srv)
            ]
        })
    ];

    childColumns = [
        {
            header: 'Ngày hóa đơn',
            binding: 'AtchDocDate',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Số hóa đơn',
            binding: 'AtchDocNo',
            allowEditing: true,
            width: 150
        },
        {
            header: 'Mẫu số',
            binding: 'AtchFormNo',
            allowEditing: true,
            width: 150
        },
        {
            header: 'Số seri',
            binding: 'AtchSerialNo',
            allowEditing: true,
            width: 150
        },
        {
            header: 'Đối tượng VAT',
            binding: 'TaxRegName',
            allowEditing: true,
            width: 250
        },
        {
            header: 'Mã số VAT',
            binding: 'TaxRegNo',
            allowEditing: true,
            width: 150
        },
        {
            header: 'Số tài khoản ngân hàng',
            binding: 'BankAccountNo',
            allowEditing: true,
            width: 150
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
    childColumns4 = [
      
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
          
            //exprReadOnly: "{EXPR=Attached} == true && {EXPR=Description} != ''"
        }
    ]

    childColumns5 = [
        {
            header: 'Ngày hóa đơn',
            binding: 'AtchDocDate',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Số hóa đơn',
            binding: 'AtchDocNo',
            allowEditing: true,
            width: 150,
            validators: "{EXPR=AtchDocNo} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
        },
        {
            header: 'Ký hiệu',
            binding: 'AtchFormNo',
            allowEditing: true,
            width: 150,
            validators: "{EXPR=AtchDocNo} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
        },
        {
            header: 'Giá trị trước thuế',
            binding: 'AmountBeforeTax',
            width: 150,
            dataType: 'Number'
        },
        {
            header: 'Giá trị sau thuế',
            binding: 'Amount',
            width: 150,
            dataType: 'Number'
        },
        {
            header: 'Ngày nhận đủ hồ sơ',
            binding: 'DateReceive',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
    ];
}