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
export class LayoutBillPayBuildingExplorer implements IExplorerFormulaDeclaration {

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocCCM_Explore',
                FilterKey: "ProductCostId = '{VAR=Filter.ProductCostId}' AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode IN ('P6') AND IsActive=1",//  AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'ProductName,CustomerName,DocNo_Hd,DocDate DESC',
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
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "TBTT NTP.NCC",
                    FileName: "TBTT NTP.NCC - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "6.TBTT_NTP_NCC_VP.docx",
                    ExcelName: "",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: "MAU2",
                    Name: "Bảng KLTT TP.NCC",
                    FileName: "Bảng KTLL TP.NCC - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "5.Bang_KLTT_NTP_NCC.docx",
                    ExcelName: "5.Bang_KLTT_NTP_NCC.xlsx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: 'MAU9',
                    Name: 'WorkFlow',
                    FileName: 'WorkFlow TT - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}',
                    WordName: 'WorkFlow_TT.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ]
        }
    }

    lookup1 = {
        Table: 'B20Currency',
        Filter: "IsActive =1 AND Code <> 'VND'",
        ColumnFilter: ''
    }

    defaultWhenNew = { 'Commandkey': 'billpaybuilding-editor', 'CurrencyCode': '{FORM=_lookup1Value}' }

    defaultWhenEdit = { 'Commandkey': 'billpaybuilding-editor', 'CurrencyCode': '{EXPR=CurrencyCode}' }

    parentGrid = [
        {
            header: 'Đối tác',
            binding: 'CustomerName',
            width: 250
        },
        {
            header: 'Nội dung hợp đồng',
            binding: 'Description_Hd',
            width: 300
        },
        // {
        //     header: 'Đợt TT số',
        //     binding: 'PayRequireNum',
        //     width: 100,
        //     dataType: 'String'
        // },
        {
            header: 'Ngày hoàn thiện',
            binding: 'FinishDate',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'GT đề nghị t.toán',
            binding: 'Amount_DeNghiTT',
            width: 150
        },
        {
            header: 'Tổng TT đến kỳ này',
            binding: 'Amount_TongTTDenKyNay',
            width: 170
        },
        {
            header: 'Tổng TT đến kỳ trước',
            binding: 'Amount_TTKyTruoc',
            width: 170
        },
        {
            header: 'Công việc',
            binding: 'JobCode',
            width: 100
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
        // {
        //     header: 'Gói thầu/ PB',
        //     binding: 'ProductName',
        //     width: 300,
        //     dataType: 'String'
        // },
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

export class LayoutBillPayBuildingEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocCCM_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'P6',
                    BizDocId: '',
                    DocStatus: '4',
                    ExchangeRate: '1',
                    Id: -1,
                    IsWebData: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    ProductCostId0: '{VAR=Filter.ProductCostId}'
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
                    Name: "Thông báo thanh toán",
                    FileName: "TBTT - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "6.TBTT_NTP_NCC_VP.docx",
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
            ConstraintKey: 'ParentBizDocId,DocCode,{VAR=Branch.Ma_Dvcs},ProductCostId,CustomerCode,Id',
            Command: 'ufn_Coteccons_B30BizDocCCM_DefaultDocNo',
            DataMember: 'DocNo'
            //zExpr: "'PayTeamType'.toString() != '00'.toString()"
        },
        'Evaluator_ServerConstraint_CTC_DefaultDocNoUnique': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ParentBizDocId,DocCode,{VAR=Branch.Ma_Dvcs},ProductCostId,CustomerCode,Id',
            Command: 'ufn_Coteccons_B30BizDocCCM_DefaultDocNo',
            DataMember: 'DocNoUnique'
            //zExpr: "'PayTeamType'.toString() != '00'.toString()"
        },
        // // 'Evaluator_ServerConstraint_CTC_DefaultDocNo_TamUng': {
        // //     EvaluatorName: 'EvaluatorQuery',
        // //     ConstraintKey: 'DocCode,ProductCostId,PayTeamType,CustomerCode,{VAR=Branch.Ma_Dvcs},Id',
        // //     Command: 'ufn_Coteccons_B30BizDocCCM_DefaultDocNo_TamUng',
        // //     DataMember: 'DocNo',
        // //     zExpr: "'PayTeamType'.toString() == '00'.toString()"
        // // },
        // 'Evaluator_ServerConstraint_DefaultPayRequireNum': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: 'ProductCostId,CustomerCode,ParentBizDocId,{VAR=Branch.Ma_Dvcs},Id',
        //     Command: 'ufn_B30BizDocCCM_DefaultPayRequireNum_2',
        //     DataMember: 'PayRequireNum',
        //     zExpr: "Id < 0"
        // },
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
        // 'Evaluator_ServerConstraint_GetValue_From_BillThanhToan': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: "BizDocId_TT,{VAR=Branch.Ma_Dvcs},{VAR=DocCodeB4}",
        //     Command: 'usp_Coteccons_GetValue_FormThanhToan',
        //     DataMember: 'Amount_ThiCong,Amount_THDenKyNay,Amount_TTKyNay,Amount_TamUng,Amount_HoanTra,Amount_TongTTDenKyNay,Amount_TTKyTruoc,Amount_DeNghiTT,Amount_ThiCongNotVAT,Amount_THDenKyNayNotVAT,Amount_KhauTruBaoHanh'
        // },
        'Evaluator_ServerConstraint_GetValue_ContractValue': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "ParentBizDocId,{VAR=Branch.Ma_Dvcs},{VAR=DocCodeC3}",
            Command: 'ufn_Coteccons_GetValueContract_SubContract2',
            DataMember: 'ContractValue'
        },
        'Evaluator_ServerConstraint_GetValue_SubContractValue': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "ParentBizDocId,{VAR=Branch.Ma_Dvcs},{VAR=DocCodeC4}",
            Command: 'ufn_Coteccons_GetValueContract_SubContract2',
            DataMember: 'SubContractValue'
        },
        'Evaluator_ServerConstraint_GetValue_Amount_HDPL': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "ParentBizDocId,{VAR=Branch.Ma_Dvcs},{VAR=DocCodeC34}",
            Command: 'ufn_Coteccons_GetValueContract_SubContract2',
            DataMember: 'Amount_HDPL'
        },
        'Evaluator_ServerConstraint_GetValue_TienGiuLaiBaoHanh': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "ProductCostId,ParentBizDocId,PayTeamType,{VAR=Branch.Ma_Dvcs},Id",
            Command: 'usp_Coteccons_GetAmount_GiuLaiQuyetToan',
            DataMember: 'Amount_DeNghiTT,Amount_TTKyTruoc,Amount_THDenKyNay,Amount_TTKyNay,Amount_TongTTDenKyNay,Amount_ThiCong,Amount,Amount_TamUng,Amount_HoanTra,Amount_DeNghiTTTemp',
            zExpr: "'PayTeamType'.toString() == '03'.toString()"
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,ParentBizDocId,ProductCostId0',
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
            zExpr: "ProductCostId != ''",// && BizDocId_TT == ''
            MessageText: 'Không thể lập mới khi chưa hoàn thiện duyệt thanh toán trước',
            IgnoreError: 0
        },
        // 'Evaluator_ServerConstraint_Check_ThanhToan_KhongLapMoiKhiChuaDuyetCu2': {
        //     EvaluatorName: 'EvaluatorValidate',
        //     ConstraintKey: 'ProductCostId,ParentBizDocId,CustomerCode,DocCode,{VAR=Branch.Ma_Dvcs},Id',
        //     Command: 'ufn_Coteccons_ThanhToan_KhongLapMoiKhiChuaDuyetCu',
        //     zExpr: "ProductCostId != '' && BizDocId_TT == ''",
        //     MessageText: 'Không thể lập mới khi chưa hoàn thiện duyệt thanh toán trước',
        //     IgnoreError: 0
        // },
        'Evaluator_ServerConstraint_Check_ThanhToan_TamUng': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,ParentBizDocId,CustomerCode,PayTeamType,{VAR=Branch.Ma_Dvcs},Id',
            Command: 'ufn_Coteccons_CheckUnique_TamUngChuaCoHopDong',
            MessageText: 'Tạm ứng vượt quá 3 lần',
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
        'Evaluator_ServerConstraint_Check_GiaTriThucHien_BCTC': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,ParentBizDocId,CustomerCode,Amount_THDenKyNayNotVAT,TaxRate,DocDate,{VAR=Branch.Ma_Dvcs}",
            Command: 'ufn_Coteccons_BillThanhToan_CheckGiaTriThucHien_BCTC',
            MessageText: 'Giá trị thực hiện đã vượt quá hạn mức Dự trù - Liên hệ CHT cập nhật',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_GiaTriThucHien_KHKK': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,ParentBizDocId,CustomerCode,Amount_THDenKyNayNotVAT,TaxRate,DocDate,{VAR=Branch.Ma_Dvcs}",
            Command: 'ufn_Coteccons_BillThanhToan_CheckGiaTriThucHien_KHKK',
            MessageText: 'Giá trị thực hiện đã vượt quá hạn mức Kế hoạch ký kết Hợp đồng - Liên hệ QS cập nhật',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_GiaTriThucHien_QuyCheTaiChinh': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ParentBizDocId,CustomerCode,Amount_THDenKyNayNotVAT,{VAR=Branch.Ma_Dvcs},TaxRate",
            Command: 'ufn_Coteccons_BillThanhToan_CheckQuyCheTaiChinh',
            MessageText: 'Giá trị thực hiện vượt quá giá trị hợp đồng theo quy định, cần bổ sung PLHĐ',
            IgnoreError: 0
        },
        // 'Evaluator_ServerConstraint_Check_DoiTuongTTKhongHopDong': {
        //     EvaluatorName: 'EvaluatorValidate',
        //     ConstraintKey: 'ParentBizDocId,CustomerCode',
        //     Command: 'ufn_Sol_CheckDoiTuong_TTKhongHopDong',
        //     MessageText: 'Đối tượng lập Thanh toán không có hợp đồng [SOL] - không hợp lệ',
        //     IgnoreError: 0
        // },
        // 'Evaluator_ServerConstraint_Check_LoaiThanhToan_LoaiHopDong': {
        //     EvaluatorName: 'EvaluatorValidate',
        //     ConstraintKey: "ProductCostId,ParentBizDocId,CustomerCode,PayTeamType,ContractType,{VAR=Branch.Ma_Dvcs}",
        //     Command: 'ufn_Coteccons_CheckPayTeamTypeContractType',
        //     MessageText: 'Tạm ứng theo thư giao thầu, phiếu giao việc không đúng Loại hợp đồng',
        //     IgnoreError: 0
        // },
        // 'Evaluator_Amount_TongTTDenKyNay_Calculate': {
        //     EvaluatorName: 'EvaluatorCaculate',
        //     DataMember: "Amount_TongTTDenKyNay",
        //     Value: "Amount_TamUng - Amount_TTKyTruoc",
        //     zExpr: "'PayTeamType'.toString() == '00'.toString()"
        // },
        'Evaluator_Amount_TongTTDenKyNay_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_TongTTDenKyNay",
            Value: "Amount_TTKyNay + Amount_TamUng + Amount_HoanTra + Amount_KhauTruBaoHanh", // + Amount_TTVatTu
            zExpr: "TaxCode != 'V10D'"
        },
        'Evaluator_Amount_DeNghiTT_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_DeNghiTT",
            Value: "Amount_TongTTDenKyNay + Amount_TTKyTruoc",
            //zExpr: "'PayTeamType'.toString() == '00'.toString()"
        },
        // 'Evaluator_Amount_TTKyNay_Calculate': {
        //     EvaluatorName: 'EvaluatorCaculate',
        //     DataMember: "Amount_TTKyNay",
        //     Value: "Amount_TamUng",
        //     zExpr: "'PayTeamType'.toString() == '00'.toString()"
        // },
        'Evaluator_Amount_TTKyNay_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_TTKyNay",
            Value: "CurrencyCode == 'VND' ? Math.round(Amount_THDenKyNay*Percent_Th) : (Amount_THDenKyNay*Percent_Th)"
        },
        'Evaluator_Amount_DeNghiTT_Calculate_KhauTruBaoHanh': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_DeNghiTT",
            Value: "Amount_DeNghiTTTemp + Amount_KhauTruBaoHanh",
            zExpr: "'PayTeamType'.toString() == '03'.toString()"
        },
      
        'Evaluator_ServerConstraint_Load_PL': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ParentBizDocId,BizDocId,DocDate,CustomerCode,ProductCostId,{VAR=Branch.Ma_Dvcs},DocCode,DocNo',
            Command: 'usp_Coteccons_BillThanhToan_LoadPLA',
            OutputTable: 0
        },
        //serverupdated
        'Evaluator_ServerUpdated_BuiltinOrder': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=TableNames_B30BizDocCCMDetail},{VAR=Keys_B30BizDocCCMDetail},{VAR=FieldOrders_B30BizDocCCMDetail},{VAR=EmptyField_CCMBudgetId},BizDocId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_Web_SetBuiltionOrder'
        },
        'Evaluator_ServerUpdated_CreateFormula_BizDocCCMDetail': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Coteccons_CreateFormula_BizDocCCMDetail'
        },
        'Evaluator_ServerUpdated_BizDocCCMDetail_UpdateFromParent': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Coteccons_BizDocCCMDetail_UpdateFromParentWEB_CalculateBill'
        },
        'Evaluator_ServerUpdated_Amount_KHKK_BCTC_HD': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ProductCostId,ParentBizDocId,CustomerCode,DocDate,{VAR=Branch.Ma_Dvcs},Id',
            Command: 'usp_Coteccons_UpdateAmountBill_KHKK_BCTC'
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},BizDocId,{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerConstraint_Amount_KHKK_BCTC': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ProductCostId,ParentBizDocId,CustomerCode,DocDate,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_GetAmount_KHKK_BCTC',
            DataMember: 'Amount_KHKK,Amount_BCTC',
            zExpr: "ProductCostId != '' && ParentBizDocId != '' && CustomerCode != ''"
        },
        'Evaluator_ServerConstraint_Amount_TTKyTruoc': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,ProductCostId,ParentBizDocId,{VAR=Branch.Ma_Dvcs},DocCode,DocDate,CustomerCode',
            Command: 'usp_Coteccons_Bill_TongGiaTriThanhToanDenCacKyTruoc_New',
            DataMember: 'Amount_TTKyTruoc,Amount_TamUng,Amount_KhauTruBaoHanh,Amount_TongThiCongKyTruoc,Amount_TongThucHienKyTruoc,Amount_TongThiCongKyTruocVAT,Amount_TongThucHienKyTruocVAT',
            zExpr: "ProductCostId != '' && ParentBizDocId != '' && CustomerCode != ''"
        },
        'Evaluator_ServerConstraint_Amount_TamUng_Compare_Amount_HoanTra': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "Amount_HoanTra,Amount_TamUng,{VAR=CompareOperator_Gt}",
            Command: 'ufn_Coteccons_Compare2Number',
            MessageText: 'Giá trị hoàn trả tạm ứng không được vượt quá giá trị tạm ứng',
            IgnoreError: 0
        },
        'Evaluator_Amount_ThiCong_Calculate': { //Tổng giá trị thi công (chưa VAT)
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "Amount_ThiCongNotVAT",
            Value: "OriginalAmount",
            Tables: 0
        },
        'Evaluator_Amount_THDenKyNay_Calculate': { //Tổng GTTH đến kỳ này (chưa VAT)
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "Amount_THDenKyNayNotVAT",
            Value: "Amount_Th",
            Tables: 0
        },
        'Evaluator_Amount_ThiCong_AddVAT': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_ThiCong",
            Value: "CurrencyCode == 'VND' ? Math.round(Amount_ThiCongNotVAT+(TaxRate*Amount_ThiCongNotVAT)) : (Amount_ThiCongNotVAT+(TaxRate*Amount_ThiCongNotVAT))"
        },
        'Evaluator_Amount_THDenKyNay_AddVAT': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_THDenKyNay",
            Value: "CurrencyCode == 'VND' ? Math.round(Amount_THDenKyNayNotVAT+(TaxRate*Amount_THDenKyNayNotVAT)) : (Amount_THDenKyNayNotVAT+(TaxRate*Amount_THDenKyNayNotVAT))"
        },
        'Evaluator_BizDocDetail_OriginalAmount9': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount",
            Value: "NumberDayLease==0 ? Math.round(Quantity9*OriginalUnitCost) : Math.round(Quantity9*OriginalUnitCost*NumberDayLease)",
            Tables: 0
        },
        'Evaluator_BizDocDetail_OriginalUnitCost': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalUnitCost",
            Value: "UnitCostVT+UnitCostNC",
            Tables: 0
        },
        'Evaluator_Amount_Th_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_Th",
            Value: "Math.round(OriginalAmount*Percent_Th)",
            Tables: 0
        },
        'Evaluator_ServerConstraint_Get_PercentTemp': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ParentBizDocId',
            Command: 'usp_Coteccons_GetPercentFromC3C4_New',
            DataMember: 'TaxCode,TaxRate,Percent_Th'//,Percent_TtVt,Percent_HUng,Amount_TamUng,Percent_01A'
        },
        'Evaluator_ServerConstraint_ReGet_PercentTemp': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ParentBizDocId',
            Command: 'usp_Coteccons_GetPercentFromC3C4_New',
            DataMember: 'TaxCode,TaxRate,Percent_Th',//,Percent_TtVt,Percent_HUng,Amount_TamUng,Percent_01A',
            zExpr: "(TaxCode != 'V10D' && TaxCode != 'V00D') || PayTeamType != '04'"// && ParentBizDocId != 'C0100000021358C3' && ParentBizDocId != 'B0100000027018C3'"
        },
        'Evaluator_ServerConstraint_Check_ImportedExcel': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Id,DocCode,ProductCostId,ParentBizDocId,CustomerCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_CheckImported',
            DataMember: 'CountImport',
            zExpr: "ProductCostId != '' && ParentBizDocId != ''"
        },
        //áp dụng lúc thay đổi thuế VAT
        'Evaluator_Amount_ThiCongKyNay_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_ThiCongKyNay",
            Value: "Amount_ThiCongNotVAT - Amount_TongThiCongKyTruoc"
        },
        'Evaluator_Amount_ThucHienKyNay_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_ThucHienKyNay",
            Value: "Amount_THDenKyNayNotVAT - Amount_TongThucHienKyTruoc"
        },
        // 'Evaluator_Amount_ThiCongKyNayAddVAT_Calculate': {
        //     EvaluatorName: 'EvaluatorCaculate',
        //     DataMember: "Amount_ThiCongKyNayAddVAT",
        //     Value: "CurrencyCode == 'VND' ? Math.round(Amount_ThiCongKyNay * (1 + TaxRate)) : (Amount_ThiCongKyNay * (1 + TaxRate))"
        // },
        // 'Evaluator_Amount_ThucHienKyNayAddVAT_Calculate': {
        //     EvaluatorName: 'EvaluatorCaculate',
        //     DataMember: "Amount_ThucHienKyNayAddVAT",
        //     Value: "CurrencyCode == 'VND' ? Math.round(Amount_ThucHienKyNay * (1 + TaxRate)) : (Amount_ThucHienKyNay * (1 + TaxRate))"
        // }
    }

    serverConstraint = [
        'Evaluator_ServerConstraint_Check_ImportedExcel',
        'Evaluator_ServerConstraint_CTC_DefaultDocNo',
        'Evaluator_ServerConstraint_CTC_DefaultDocNoUnique',
        'Evaluator_ServerConstraint_GetValue_ContractValue',
        'Evaluator_ServerConstraint_GetValue_SubContractValue',
        'Evaluator_ServerConstraint_GetValue_Amount_HDPL',
        'Evaluator_ServerConstraint_GetValue_TienGiuLaiBaoHanh'
    ]

    serverUpdating = [
        'Evaluator_ServerConstraint_ParentBizDocId_PayTeamType_Unique',
        'Evaluator_ServerConstraint_Exists_Settlement',
        'Evaluator_ServerConstraint_Check_ThanhToan_TamUng',
        'Evaluator_ServerConstraint_Check_ThanhToan_KhongLapMoiKhiChuaDuyetCu',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_UserModified',
        // 'Evaluator_ServerUpdating_Check_MonitorQuantity',
        // 'Evaluator_ServerConstraint_Check_DoiTuongTTKhongHopDong',
        // 'Evaluator_ServerUpdating_Check_UpFileContact',
        'Evaluator_ServerConstraint_Amount_TamUng_Compare_Amount_HoanTra',
        'Evaluator_ServerConstraint_Check_GiaTriThucHien_BCTC',
        'Evaluator_ServerConstraint_Check_GiaTriThucHien_KHKK',
        'Evaluator_ServerConstraint_Check_GiaTriThucHien_QuyCheTaiChinh'
    ]

    serverUpdated: string[] = [
        'Evaluator_ServerUpdated_BuiltinOrder',
        'Evaluator_ServerUpdated_CreateFormula_BizDocCCMDetail',
        'Evaluator_ServerUpdated_BizDocCCMDetail_UpdateFromParent', //tính toàn bộ giá trị bill (high important)
        'Evaluator_ServerUpdated_Amount_KHKK_BCTC_HD',
        'Evaluator_UpdateInfo_WhenApproveSend'
    ]

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_Approve_GetData',
        'Evaluator_ServerConstraint_DocumentDetail_GetData',
        'Evaluator_ServerConstraint_Amount_TTKyTruoc',
        'Evaluator_ServerConstraint_Amount_KHKK_BCTC',
        'Evaluator_ServerConstraint_Load_PL'
    ];

    buttonCommand: string[] = [
        'Evaluator_Amount_ThiCong_Calculate',
        'Evaluator_Amount_THDenKyNay_Calculate'
    ]

    importCommand: string[] = [
        'Evaluator_Amount_ThiCong_Calculate',
        'Evaluator_Amount_THDenKyNay_Calculate'
    ]

    columnChanged: any = {
        ProcessCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_Approve_GetData'
            ]
        },
        ParentBizDocId: {
            Evaluators: [
                'Evaluator_ServerConstraint_Get_PercentTemp'
            ]
        },
        TaxCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_ReGet_PercentTemp',
                'Evaluator_Amount_ThiCong_AddVAT',
                'Evaluator_Amount_THDenKyNay_AddVAT'
            ]
        },
        Amount_ThiCongNotVAT: {
            Evaluators: [
                'Evaluator_Amount_ThiCong_AddVAT',
                'Evaluator_Amount_ThiCongKyNay_Calculate'
            ]
        },
        Amount_THDenKyNayNotVAT: {
            Evaluators: [
                'Evaluator_Amount_THDenKyNay_AddVAT',
                'Evaluator_Amount_ThucHienKyNay_Calculate'
            ]
        },
        Amount_THDenKyNay: {
            Evaluators: [
                'Evaluator_Amount_TTKyNay_Calculate'
            ]
        },
        Percent_Th: {
            Evaluators: [
                'Evaluator_Amount_TTKyNay_Calculate'
            ]
        },
        Amount_TTKyNay: {
            Evaluators: [
                'Evaluator_Amount_TongTTDenKyNay_Calculate'
            ]
        },
        Amount_TamUng: {
            Evaluators: [
                'Evaluator_Amount_TongTTDenKyNay_Calculate'
            ]
        },
        Amount_HoanTra: {
            Evaluators: [
                'Evaluator_Amount_TongTTDenKyNay_Calculate'
            ]
        },
        Amount_KhauTruBaoHanh: {
            Evaluators: [
                'Evaluator_Amount_TongTTDenKyNay_Calculate',
                'Evaluator_Amount_DeNghiTT_Calculate_KhauTruBaoHanh'
            ]
        },
        Amount_TongTTDenKyNay: {
            Evaluators: [
                'Evaluator_Amount_DeNghiTT_Calculate'
            ]
        },
        Amount_TTKyTruoc: {
            Evaluators: [
                'Evaluator_Amount_DeNghiTT_Calculate'
            ]
        },
        // Amount_ThiCongKyNay: {
        //     Evaluators: [
        //         'Evaluator_Amount_ThiCongKyNayAddVAT_Calculate'
        //     ]
        // },
        // Amount_ThucHienKyNay: {
        //     Evaluators: [
        //         'Evaluator_Amount_ThucHienKyNayAddVAT_Calculate'
        //     ]
        // }
    }

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
                Quantity9: {
                    Evaluators: [
                        'Evaluator_BizDocDetail_OriginalAmount9'
                    ]
                },
                OriginalUnitCost: {
                    Evaluators: [
                        'Evaluator_BizDocDetail_OriginalAmount9'
                    ]
                },
                OriginalAmount: {
                    Evaluators: [
                        'Evaluator_Amount_Th_Calculator',
                        'Evaluator_Amount_ThiCong_Calculate'
                    ]
                },
                Percent_Th: {
                    Evaluators: [
                        'Evaluator_Amount_Th_Calculator'
                    ]
                },
                Amount_Th: {
                    Evaluators: [
                        'Evaluator_Amount_THDenKyNay_Calculate',
                        //'Evaluator_Amount_ThucHien_Muc1_Calculate'
                    ]
                },
                UnitCostNC: {
                    Evaluators: [
                        'Evaluator_BizDocDetail_OriginalUnitCost'
                    ]
                },
                UnitCostVT: {
                    Evaluators: [
                        'Evaluator_BizDocDetail_OriginalUnitCost'
                    ]
                },
                NumberDayLease: {
                    Evaluators: [
                        'Evaluator_BizDocDetail_OriginalAmount9'
                    ]
                }
            }
        }
    ];

    columnsReadOnly = [];

    linkReporter = {
        'btnPhuLucA': {
            directory: 'billsupp',
            type: 'detail',
            key: 'Id_TT',
            parameter: { 'Commandkey': 'billsupp-editor', 'ProductCostId': '{EXPR=ProductCostId}', 'ParentBizDocId': '{EXPR=ParentBizDocId}', 'DocDate': '{EXPR=DocDate}', 'CustomerCode': '{EXPR=CustomerCode}', 'PayTeamType': '{EXPR=PayTeamType}', 'DocNo': '{EXPR=DocNo}', 'CurrencyCode': '{EXPR=CurrencyCode}', 'ParentId': '{EXPR=Id}' },
            evaluator: 'Evaluator_ServerConstraint_Check_ThanhToan_KhongLapMoiKhiChuaDuyetCu2'
        },
        'btnHdPl': {
            directory: 'regcontract_view',
            type: 'detail',
            command: "{EXPR=DocCode_HdPl} == 'C3' ? 'detailc3' : {EXPR=DocCode_HdPl} == 'C4' ? 'detailc4' : ''",
            key: 'Id_HdPl'
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
                    label: 'Số hồ sơ',
                    dataType: 'text',
                    col: 6,
                    validators: [Validators.required],
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new DateBoxInput({
                    key: 'EstimatedCompletionDate',
                    label: 'Ngày ghi nhận chi phí',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    
                    // style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'PayTeamType',
                    label: 'Loại thanh toán',
                    lookupKey: 'Class',
                    lookupfilter: "ParentCode='PayTeamType' AND Code IN ('00','01','03','04')",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 6,
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }, this.srv, this.parentData),
                // new TextBoxInput({
                //     key: 'PayRequireNum',
                //     label: 'Yêu cầu thanh toán số',
                //     dataType: 'text',
                //     mask: '000',
                //     col: 6,
                //     //isReadOnly: 'true',
                //     //style: 'background-color:#F1EDED;border-radius:8px;'
                // }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    validators: [Validators.required],
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",// AND ('{VAR=User.IsAdmin}'='True' OR RowId = '{VAR=Filter.ProductCostId}' OR RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: true,
                    isNewRow: true,
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
                        NumberOfDay: 'DueDate',
                        CurrencyCode: 'CurrencyCode',
                        ClassCode1: 'ClassCode1',
                        //CurrencyCode: 'CurrencyCode',
                        Id: 'Id_HdPl',
                        DocCode: 'DocCode_HdPl'
                    },
                    validators: [Validators.required],
                    lookupfilter: "(((DocCode = 'C3' OR (DocCode = 'C4' AND IsSubContractPay = 1)) AND ProductCostId='{EXPR=ProductCostId}' AND ContractTypeFilter='B4') OR (DocCode='C3' AND IsSubContractPay = 1)) AND Closed = 0 AND CompletedApprove=1 AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
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
                    lookupfilter: "('{EXPR=PayTeamType}' = '04' OR '{EXPR=ProductType}'=3 OR Code IN (SELECT A.CustomerCode FROM B30CCMBudgetDetail A INNER JOIN B30CCMBudget B ON A.CCMBudgetId = B.CCMBudgetId WHERE (A.CompletedApproveDetail=1 AND A.Loai_Dt IN ('NTP','NCC')) AND B.CompletedApprove=1 AND B.IsActive=1 AND B.DocCode='K1' AND B.ProductCostId ='{EXPR=ProductCostId}' GROUP BY A.CustomerCode)) AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
                    hideValueMember: false,
                    isDisabled: "'{EXPR=PayTeamType}' != '04'",//'{EXPR=PayTeamType}' != '00' && 
                    col: 12
                }, this.srv, this.parentData),
                new MultiSelectInput({
                    key: 'JobCode',
                    label: 'Công việc',
                    lookupKey: 'Job',
                    hideValueMember: false,
                    isDisabled: "'{EXPR=PayTeamType}' != '04'",
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
                    label: 'Giá trị HĐ (chưa VAT)',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_KHKK',
                    label: 'Giá trị KHKK (chưa VAT)',
                    type: 'number',
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;',
                    col: 6,
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'SubContractValue',
                    label: 'Giá trị PLHĐ (chưa VAT)',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_BCTC',
                    label: 'Giá trị KHDTCP (chưa VAT)',
                    type: 'number',
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;',
                    col: 6,
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_HDPL',
                    label: 'Giá trị HĐ + PLHĐ (chưa VAT)',
                    col: 6,
                    isDisabled: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new LookupBoxInput({
                    key: 'TaxCode',
                    label: 'Thuế',
                    lookupKey: 'Tax',
                    hideValueMember: false,
                    lookupfilter: "IsActive=1 AND IsGroup=0 AND IsDefault = 1",
                    binding: {
                        Rate: 'TaxRate'
                    },
                    col: 6,
                    validators: [Validators.required],
                    style: 'background-color:#FAF5D0;border-radius:8px;',
                    // isDisabled: "'{EXPR=PayTeamType}' != '04'"
                }, this.srv, this.parentData),
              

                new NumberBoxInput({
                    key: 'Amount_TongThiCongKyTruoc',
                    label: 'GTTC lũy kế kỳ trước (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;',
                }),
                new NumberBoxInput({
                    key: 'Amount_TongThucHienKyTruoc',
                    label: 'GTTH lũy kế kỳ trước (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;',
                }),
                // new NumberBoxInput({
                //     key: 'Amount_ThiCongKyNay',
                //     label: 'GT thi công kỳ này (chưa VAT)',
                //     type: 'number',
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#FAF5D0;border-radius:8px;',
                // }),
                // new NumberBoxInput({
                //     key: 'Amount_ThucHienKyNay',
                //     label: 'GT thực hiện kỳ này (chưa VAT)',
                //     type: 'number',
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#FAF5D0;border-radius:8px;',
                // }),
                new NumberBoxInput({
                    key: 'Amount_ThiCongNotVAT',
                    label: 'Tổng GTTC lũy kế kỳ này (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_THDenKyNayNotVAT',
                    label: 'Tổng GTTH lũy kế kỳ này (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_ThiCong',
                    label: 'Tổng GTTC lũy kế kỳ này (Gồm VAT)',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_THDenKyNay',
                    label: 'Tổng GTTH lũy kế kỳ này (Gồm VAT)',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Percent_Th',
                    label: '% thanh toán',
                    type: 'number',
                    format: 'p3',
                    min: 0,
                    max: 1,
                    col: 6,
                    isDisabled: "{EXPR=TaxCode} != 'V10D' && {EXPR=TaxCode} != 'V00D'"
                }),
                new NumberBoxInput({
                    key: 'Amount_TTKyNay',
                    label: 'Tổng GT thanh toán kỳ này',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                // new ButtonInput({
                //     key: 'btnPhuLucA',
                //     label: 'Bảng khối lượng thanh toán',
                //     col: 6,
                //     isDisabled: "('{EXPR=PayTeamType}' != '01' && '{EXPR=PayTeamType}' != '04')  || '{EXPR=Id}' < 0"
                // }),
                // new LookupBoxInput({
                //     key: 'BizDocId_TT',
                //     label: 'Bảng KL thanh toán',
                //     lookupKey: 'BizDocCCM',
                //     hideValueMember: true,
                //     binding: {
                //         //DocNo: 'DocNo',
                //         Id: 'Id_TT'
                //     },
                //     lookupfilter: "ParentId = '{EXPR=Id}' AND '{EXPR=Id}'>0 AND DocCode='B4'",
                //     //lookupfilter: "DocCode IN ('B4') AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}' AND CustomerCode='{EXPR=CustomerCode}'  AND BizDocId NOT IN (SELECT BizDocId_TT FROM B30BizDocCCM WHERE DocCode='P4' AND IsActive=1 AND BizDocId_TT <>'' AND BizDocId <> '{EXPR=BizDocId}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}')",
                //     //validators: [Validators.required],
                //     col: 6,
                //     isDisabled: "'{EXPR=PayTeamType}' == '00' || '{EXPR=PayTeamType}' == '03'"
                // }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CurrencyCode',
                    label: 'Mã tiền tệ',
                    lookupKey: 'Currency',
                    lookupfilter: "IsActive=1 AND IsGroup=0",
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'Amount_TamUng',
                    label: 'Giá trị tạm ứng',
                    col: 6,
                    isDisabled: "'{EXPR=PayTeamType}' != '00'",
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                // new DateBoxInput({
                //     key: 'ConfirmedDate',
                //     label: 'Ngày kế toán nhận hóa đơn',
                //     dataType: 'date',
                //     format: 'dd/MM/yyyy',
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F8F0D7;border-radius:8px;'
                // }),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Ghi chú',
                    dataType: 'text',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_HoanTra',
                    label: 'Giá trị hoàn trả tạm ứng',
                    col: 6,
                    // isDisabled: 'true',
                    // format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: 'ParentId=230 AND IsActive=1 AND DocStatus=4',
                    // lookupfilter: "(Code IN (SELECT Code FROM dbo.ufn_Coteccons_Filter_ProcessCodeByBizDocC3('{EXPR=ProductCostId}','{EXPR=ParentBizDocId}','{EXPR=DocCode}','{VAR=Branch.Ma_Dvcs}')))",//('{EXPR=PayTeamType}' = '00') OR 
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 6
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'Amount_KhauTruBaoHanh',
                    label: 'Khấu trừ khác (tiền phạt, tiện ích,...)',
                    col: 6,
                    // isDisabled: "'{EXPR=PayTeamType}' != '03'"
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new ButtonInput({
                    key: 'btnHdPl',
                    label: 'Xem hợp đồng',
                    style: 'background-color:#9cc09c;',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_TongTTDenKyNay',
                    label: 'Tổng GTTT đến kỳ này',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'Amount_TTKyTruoc',
                    label: 'Tổng GTTT đến kỳ trước',
                    col: 6,
                    isDisabled: "'{EXPR=CountImport}' == 'true'",
                    // // isDisabled: "'{EXPR=PayTeamType}' != '00'"
                    // //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new CheckBoxInput({
                    key: 'CompletedApprove',
                    label: 'Đã hoàn thiện duyệt',
                    isDisabled: 'true',
                    col: 6
                }),
                // new LookupBoxInput({
                //     key: 'BizDocId_CD',
                //     label: 'Hóa đơn điện tử',
                //     lookupKey: 'ConsDocument',
                //     lookupfilter: "CompletedApprove=1 AND IsActive=1 AND BizDocId NOT IN (SELECT BizDocId_CD FROM B30BizDocCCM WHERE IsActive=1 AND BizDocId_CD<>'' AND Id<>'{EXPR=Id}' GROUP BY BizDocId_CD) AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}' AND CustomerCode='{EXPR=CustomerCode}'",
                //     hideValueMember: true,
                //     col: 6
                // }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'Amount_DeNghiTT',
                    label: 'Giá trị đề nghị thanh toán',
                    col: 6,
                    isDisabled: "'{EXPR=PayTeamType}' != '03'",//'{EXPR=PayTeamType}' != '00' && 
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new LookupBoxInput({
                    key: 'ClassCode1',
                    label: 'TT back theo CĐT',
                    lookupKey: 'Class',
                    lookupfilter: "IsActive=1 AND ParentCode='DT_CDT_CD'",
                    isDisabled: 'true',
                    // hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'DueDate',
                    label: 'Hạn thanh toán (Ngày)',
                    col: 6,
                    format: 'N0',
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
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
                new LookupBoxInput({
                    key: 'ProductCostId0',
                    label: '',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    col: 12,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
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
            header: 'STT',
            binding: 'ItemNo',
            width: 100
        },
        // {
        //     header: 'Hạng mục QLKL',
        //     binding: 'PartNo',
        //     dataType: 'Array',
        //     lookupKey: 'PlanQuantityHM',
        //     lookupfilter: "ProductCostId='{VAR=Filter.ProductCostId}'",
        //     width: 130,
        //     // hidden: "'{EXPR=PayTeamType}'=='01'"
        // },
        // {
        //     header: 'Mã QL Khối lượng',
        //     binding: 'Ma_QLKL',
        //     dataType: 'Array',
        //     lookupKey: 'DmQLKL',
        //     lookupfilter: 'IsGroup=0 AND IsActive=1',
        //     width: 130,
        //     hidden: true
        // },
        {
            header: 'Diễn giải',
            binding: 'Description',
            allowEditing: false,
            width: 250
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 50
        },
        {
            header: 'KL hợp đồng',
            binding: 'Quantity_Hd',
            dataType: 'Number',
            width: 100,
            format: 'n3',
            isReadOnly: 'true',
            // exprReadOnly: '1==1'
        },
        {
            header: 'KL thi công',
            binding: 'Quantity9',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 100,
            format: 'n3'
        },
        {
            header: 'Đơn giá',
            binding: 'OriginalUnitCost',
            dataType: 'Number',
            width: 150,
            format: 'n2',
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != ''"
        },
        {
            header: 'Thành tiền',
            binding: 'OriginalAmount',
            width: 150,
            dataType: 'Number',
            isReadOnly: 'true'
            // //exprFormat: "'{EXPR=CurrencyCode}' == 'VND' ? 'n0' : 'n2'"
        },
        {
            header: '% thực hiện',
            binding: 'Percent_Th',
            dataType: 'Number',
            width: 110,
            min: 0,
            max: 1,
            format: 'p2'
        },
        {
            header: 'Giá trị thực hiện',
            binding: 'Amount_Th',
            width: 150,
            dataType: 'Number',
            isReadOnly: 'true'
            // //exprFormat: "'{EXPR=CurrencyCode}' == 'VND' ? 'n0' : 'n2'"
        },
        {
            header: 'Loại thuế',
            binding: 'TaxCode',
            width: 100,
            dataType: 'Array',
            lookupKey: 'Tax',
            bindingList: {
                Rate: 'TaxRate'
            },
            lookupfilter: "Type=1 AND IsActive=1 AND IsGroup=0 AND IsDefault = 1",
        },
        {
            header: 'Đơn giá VT',
            binding: 'UnitCostVT',
            dataType: 'Number',
            width: 100
        },
        {
            header: 'Đơn giá NC',
            binding: 'UnitCostNC',
            dataType: 'Number',
            width: 100
        },
        {
            header: 'Thời gian thuê (thiết bị)',
            binding: 'NumberDayLease',
            dataType: 'Number',
            width: 100,
            format: 'n2'
        },
        // {
        //     header: '% VAT',
        //     binding: 'TaxRate',
        //     width: 80
        // },
        // {
        //     header: 'Tiền thuế',
        //     binding: 'OriginalAmount3',
        //     dataType: 'Number',
        //     width: 120
        // },         
        {
            header: 'Ghi chú',
            binding: 'Remark',
            allowEditing: true,
            width: 200
        },
        // {
        //     header: 'Mã khấu trừ',
        //     binding: 'Ma_KhauTru',
        //     dataType: 'Array',
        //     lookupKey: 'DmKhauTru',
        //     lookupfilter: 'IsActive=1',
        //     width: 100
        // },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50,
            isReadOnly: 'true'
        },
        {
            header: 'Bậc',
            binding: 'Level',
            dataType: 'Number',
            width: 0,
            format: 'n0',
            isReadOnly: 'true'
        },
        {
            header: 'Công thức',
            binding: 'Formula',
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Dòng kế thừa PL',
            binding: 'InheritanceRowIdPL',
            width: 0,
            isReadOnly: 'true'
        },
        {
            header: 'Dòng kế thừa',
            binding: 'InheritanceRowId',
            width: 0,
            isReadOnly: 'true'
        },
    ]

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
            width: 80,
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
            width: 500,
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
            lookupfilter: "IsActive=1",
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
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId0}' AND PositionCode = '{EXPR=PositionCode}')",
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
            header: 'Mẫu số',
            binding: 'AtchFormNo',
            allowEditing: true,
            width: 150,
            validators: "{EXPR=AtchDocNo} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
        },
        {
            header: 'Số seri',
            binding: 'AtchSerialNo',
            allowEditing: true,
            width: 150,
            validators: "{EXPR=AtchDocNo} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
        }
    ];

}
