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

// Bill thanh toán đội nhóm
export class LayoutBillTeamExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocCCM_Explore',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode='B2' AND IsActive=1  AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'ProductName,CustomerName,DocNo DESC',
                RowPage: 50
            }
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Bảng KLTT ĐTC- {VAR=TenGoiThau} - {VAR=CustomerName} - {EXPR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng KLTT ĐTC",
                    FileName: "Bảng KTLL ĐTC - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "3.Bang_KLTT_DTC.docx",
                    ExcelName: "3.Bang_KLTT_DTC.xlsx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ],
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'ItemNo',
                    width: 70,
                    dataType: 'String'
                },
                {
                    header: 'Nội dung',
                    binding: 'Description',
                    width: 250,
                    dataType: 'String'
                },
                {
                    header: 'Đvt',
                    binding: 'Unit',
                    width: 50,
                    dataType: 'String'
                },
                {
                    header: 'Khối lượng HĐ',
                    binding: 'Quantity_Hd',
                    width: 80,
                    dataType: 'Number',
                    format: 'n2'
                },
                {
                    header: 'Khối lượng',
                    binding: 'Quantity',
                    width: 80,
                    dataType: 'Number',
                    format: 'n2'
                },
                {
                    header: 'Đơn giá',
                    binding: 'OriginalUnitCost',
                    width: 100,
                    dataType: 'Number',
                    format: 'n2'
                },
                {
                    header: 'Thành tiền',
                    binding: 'OriginalAmount',
                    width: 110,
                    dataType: 'Number'
                },
                {
                    header: '%',
                    binding: 'Percent_Th',
                    width: 70,
                    dataType: 'Number',
                    format: "p2"
                },
                {
                    header: 'Giá trị thực hiện',
                    binding: 'Amount_Th',
                    width: 110,
                    dataType: 'Number'
                }
            ]
        }
    }

    parentGrid = [
        {
            header: 'Đội nhóm',
            binding: 'CustomerName',
            width: 300
        },
        {
            header: 'Số',
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
            header: 'Số hợp đồng/PLHĐ',
            binding: 'DocNo_Hd',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Ngày hợp đồng/PLHĐ',
            binding: 'DocDate_Hd',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Tổng GT thanh toán đến kỳ này',
            binding: 'Amount_TongTTDenKyNay',
            width: 150,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Giá trị đề nghị thanh toán',
            binding: 'Amount_DeNghiTT',
            width: 150,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Gói thầu/PB',
            binding: 'ProductName',
            width: 300
        },
        {
            header: 'Người lập',
            binding: 'FullName',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Id',
            binding: 'Id',
            width: 50,
            dataType: 'Number'
        }
    ]
}

export class LayoutBillTeamEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocCCM_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'B2',
                    BizDocId: '',
                    DocStatus: '4',
                    CurrencyCode: 'VND',
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
                        DocDate: 'Parent.DocDate',
                        CustomerCode: 'Parent.CustomerCode',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                }
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Bảng KLTT ĐTC- {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng KLTT đội thi công",
                    FileName: "Bảng KTLL ĐTC - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "3.Bang_KLTT_DTC.docx",
                    ExcelName: "3.Bang_KLTT_DTC.xlsx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ],
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'ItemNo',
                    width: 70,
                    dataType: 'String'
                },
                {
                    header: 'Nội dung',
                    binding: 'Description',
                    width: 250,
                    dataType: 'String'
                },
                {
                    header: 'Đvt',
                    binding: 'Unit',
                    width: 50,
                    dataType: 'String'
                },
                {
                    header: 'Khối lượng HĐ',
                    binding: 'Quantity_Hd',
                    width: 80,
                    dataType: 'Number',
                    format: 'n2'
                },
                {
                    header: 'Khối lượng',
                    binding: 'Quantity',
                    width: 80,
                    dataType: 'Number',
                    format: 'n2'
                },
                {
                    header: 'Đơn giá',
                    binding: 'OriginalUnitCost',
                    width: 100,
                    dataType: 'Number',
                    format: 'n2'
                },
                {
                    header: 'Thành tiền',
                    binding: 'OriginalAmount',
                    width: 110,
                    dataType: 'Number'
                },
                {
                    header: '%',
                    binding: 'Percent_Th',
                    width: 70,
                    dataType: 'Number',
                    format: "p2"
                },
                {
                    header: 'Giá trị thực hiện',
                    binding: 'Amount_Th',
                    width: 110,
                    dataType: 'Number'
                }
            ]
        }
    }

    evaluators = {
        'Evaluator_Amount_ThiCongNotVAT_Calculate': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "Amount_ThiCongNotVAT",
            Value: 'OriginalAmount',
            Tables: 0
        },
        'Evaluator_Amount_THDenKyNayNotVAT_Calculate': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "Amount_THDenKyNayNotVAT",
            Value: "Amount_Th",
            Tables: 0
        },
        'Evaluator_Amount_ThiCong_Calculate': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "Amount_ThiCong",
            Value: 'OriginalAmount',
            Tables: 0
        },
        'Evaluator_Amount_THDenKyNay_Calculate': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "Amount_THDenKyNay",
            Value: "Amount_Th",
            Tables: 0
        },
        'Evaluator_Amount_TongTTDenKyNay_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_TongTTDenKyNay",
            Value: "Amount_THDenKyNay + Amount_TamUng + Amount_HoanTra" //Amount_TTKyNay + Amount_TamUng + Amount_HoanTra
        },
        'Evaluator_Amount_DeNghiTT_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_DeNghiTT",
            Value: "Amount_TongTTDenKyNay + Amount_TTKyTruoc"
        },
        'Evaluator_Amount_TTKyNay_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_TTKyNay",
            Value: "Math.round(Amount_THDenKyNay*Percent_Th)"
        },
        'Evaluator_Amount_HoanTra_calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_HoanTra",
            Value: "Math.round(-Amount_THDenKyNay*Percent_HUng)"
        },
        //child
        'Evaluator_BizDocDetail_OriginalAmount9': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount",
            Value: "Math.round(Quantity9*OriginalUnitCost)",
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
        'Evaluator_Amount_ThucHien_Muc1_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_ThucHien_Muc1",
            Value: "Amount_Th",
            zExpr: "(ItemNo).toString().indexOf('1.') == 0",
            Tables: 0
        },

        //contrainst
        'Evaluator_ServerConstraint_CheckUniqueDocNo': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},BizDocId,DocCode,DocNo',
            Command: 'ufn_B30BizDocCCM_CheckUniqueDocNo',
            MessageText: 'Số phiếu bảng KLTT đã tồn tại.',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_ImportedExcel': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Id,DocCode,ProductCostId,ParentBizDocId,CustomerCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_CheckImported',
            DataMember: 'CountImport',
            zExpr: "ProductCostId != '' && ParentBizDocId != ''"
        },
        'Evaluator_ServerConstraint_Exists_Settlement': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ParentBizDocId,ProductCostId,PayTeamType,{VAR=Branch.Ma_Dvcs},Id',
            Command: 'ufn_Coteccons_ThanhToan_CheckExists_Settlement',
            MessageText: 'Không thể thanh toán cho hợp đồng đã lập quyết toán',
            IgnoreError: 0,
            zExpr: "'PayTeamType'.toString() != '03'.toString()"
        },
        'Evaluator_ServerConstraint_Load_PL': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ParentBizDocId,BizDocId,DocDate,CustomerCode,ProductCostId,{VAR=Branch.Ma_Dvcs},DocCode,DocNo',
            Command: 'usp_Coteccons_BillThanhToan_LoadPLA',
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_Amount_TTKyTruoc': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,ProductCostId,ParentBizDocId,{VAR=Branch.Ma_Dvcs},DocCode,DocDate,CustomerCode',
            Command: 'usp_Coteccons_Bill_TongGiaTriThanhToanDenCacKyTruoc_New',
            DataMember: 'Amount_TTKyTruoc,Amount_TamUng',
            zExpr: "ProductCostId != '' && ParentBizDocId != '' && CustomerCode != ''"
        },
        'Evaluator_ServerConstraint_Amount_HDPL': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "ParentBizDocId,{VAR=Branch.Ma_Dvcs},{VAR=LoaiC34}",
            Command: 'ufn_Coteccons_GetValueContract_SubContract',
            DataMember: 'Amount_HDPL'
        },
        'Evaluator_ServerConstraint_Amount_KHKK_BCTC': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ProductCostId,ParentBizDocId,CustomerCode,DocDate,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_GetAmount_KHKK_BCTC',
            DataMember: 'Amount_KHKK,Amount_BCTC',
            zExpr: "ProductCostId != '' && ParentBizDocId != '' && CustomerCode != ''"
        },
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'BizDocId,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Conteccons_NotChangeWhenApproveSent_Bill',
            MessageText: 'Không được thay đổi khi đã gửi duyệt',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_GiaTriThucHien': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,ParentBizDocId,CustomerCode,Amount_THDenKyNay,{VAR=TaxRate0},DocDate,{VAR=Branch.Ma_Dvcs}",
            Command: 'ufn_Coteccons_BillThanhToan_CheckGiaTriThucHien',
            MessageText: 'Giá trị thực hiện đã vượt quá hạn mức KHKK hoặc BCTC, yêu cầu điều chỉnh KHKK hoặc BCTC',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_GiaTriThucHien_BCTC': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,ParentBizDocId,CustomerCode,Amount_THDenKyNay,{VAR=TaxRate0},DocDate,{VAR=Branch.Ma_Dvcs},{VAR=User.Id}",
            Command: 'ufn_Coteccons_BillThanhToan_CheckGiaTriThucHien_BCTC',
            MessageText: 'Giá trị thực hiện đã vượt quá hạn mức Dự trù - Liên hệ CHT cập nhật',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_GiaTriThucHien_KHKK': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,ParentBizDocId,CustomerCode,Amount_THDenKyNay,{VAR=TaxRate0},DocDate,{VAR=Branch.Ma_Dvcs},{VAR=User.Id}",
            Command: 'ufn_Coteccons_BillThanhToan_CheckGiaTriThucHien_KHKK',
            MessageText: 'Giá trị thực hiện đã vượt quá hạn mức Kế hoạch ký kết Hợp đồng - Liên hệ QS cập nhật',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_GiaTriThiCong': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,ParentBizDocId,CustomerCode,Amount_ThiCong,{VAR=TaxRate0},DocDate,{VAR=Branch.Ma_Dvcs}",
            Command: 'ufn_Coteccons_BillThanhToan_CheckGiaTriThiCong',
            MessageText: 'Giá trị thi công vượt đã quá hạn mức',
            IgnoreError: 1
        },
        'Evaluator_ServerConstraint_Check_GiaTriThucHien_QuyCheTaiChinh': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ParentBizDocId,CustomerCode,Amount_THDenKyNay,{VAR=Branch.Ma_Dvcs},{VAR=TaxRate0}",
            Command: 'ufn_Coteccons_BillThanhToan_CheckQuyCheTaiChinh',
            MessageText: 'Giá trị thực hiện vượt quá giá trị hợp đồng theo quy định, cần bổ sung PLHĐ',
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
        'Evaluator_ServerConstraint_Amount_TamUng_Compare_Amount_HoanTra': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "Amount_HoanTra,Amount_TamUng,{VAR=CompareOperator_Gt}",
            Command: 'ufn_Coteccons_Compare2Number',
            MessageText: 'Giá trị hoàn trả tạm ứng không được vượt quá giá trị tạm ứng',
            IgnoreError: 0
        },
        //không đổi tên 
        'Evaluator_ServerConstraint_LoadDataImport': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,{VAR=Branch.Ma_Dvcs},{VAR=User.UserName}',
            Command: 'usp_Coteccons_BizDocCCMDetail_ImportForWeb',
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_DeleteDataImport': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ProductCostId,{VAR=Branch.Ma_Dvcs},{VAR=User.UserName}',
            Command: 'usp_Coteccons_BizDocCCMDetail_DeleteForWeb'
        },
        //serverupdated
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
        'Evaluator_ServerUpdated_BizDocCCMDetail_UpdateFromParent': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Coteccons_BizDocCCMDetail_UpdateFromParentWEB'
        },
        'Evaluator_ServerUpdated_Amount_KHKK_BCTC': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ProductCostId,ParentBizDocId,CustomerCode,DocDate,{VAR=Branch.Ma_Dvcs},Id',
            Command: 'usp_Coteccons_UpdateAmountBill_KHKK_BCTC'
        },
        'Evaluator_ServerUpdated_BizDocCCMDetail_RoundAmount': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_CTC_RoundAmount_ChiTietKhoiLuong'
        },
        'Evaluator_ServerUpdated_BizDocCCM_RoundAmount': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Newtecons_BizDocCCM_UpdateAmountFromChild'
        }
    }

    serverConstraint = [
        'Evaluator_ServerConstraint_Amount_TTKyTruoc',
        'Evaluator_ServerConstraint_Check_ImportedExcel',
        'Evaluator_ServerConstraint_Amount_HDPL',
        'Evaluator_ServerConstraint_Amount_KHKK_BCTC'
    ]

    serverUpdating = [
        'Evaluator_Amount_ThiCongNotVAT_Calculate',
        'Evaluator_Amount_THDenKyNayNotVAT_Calculate',
        'Evaluator_Amount_ThiCong_Calculate',
        'Evaluator_Amount_THDenKyNay_Calculate',

        'Evaluator_ServerConstraint_CheckUniqueDocNo',
        'Evaluator_ServerConstraint_Exists_Settlement',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_GiaTriThucHien_BCTC',
        'Evaluator_ServerConstraint_Check_GiaTriThucHien_KHKK',
        ////'Evaluator_ServerConstraint_Check_GiaTriThiCong',
        'Evaluator_ServerConstraint_Check_GiaTriThucHien_QuyCheTaiChinh',
        'Evaluator_ServerConstraint_Amount_TamUng_Compare_Amount_HoanTra',
        'Evaluator_ServerConstraint_Check_UserModified'
    ]

    serverUpdated: string[] = [
        'Evaluator_ServerUpdated_BuiltinOrder',
        'Evaluator_ServerUpdated_CreateFormula_BizDocCCMDetail',
        'Evaluator_ServerUpdated_BizDocCCMDetail_UpdateFromParent',
        'Evaluator_ServerUpdated_Amount_KHKK_BCTC',
        'Evaluator_ServerUpdated_BizDocCCM_RoundAmount'
        //'Evaluator_ServerUpdated_BizDocCCMDetail_RoundAmount'
    ]

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_CheckUniqueDocNo',
        'Evaluator_ServerConstraint_Exists_Settlement',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_UserModified',
        'Evaluator_ServerConstraint_Amount_TTKyTruoc',
        'Evaluator_ServerConstraint_Amount_HDPL',
        'Evaluator_ServerConstraint_Amount_KHKK_BCTC',
        'Evaluator_ServerConstraint_Load_PL'
    ];

    buttonCommand: string[] = [
        'Evaluator_Amount_ThiCongNotVAT_Calculate',
        'Evaluator_Amount_THDenKyNayNotVAT_Calculate',
        'Evaluator_Amount_ThiCong_Calculate',
        'Evaluator_Amount_THDenKyNay_Calculate'
    ]

    importCommand: string[] = [
        'Evaluator_Amount_ThiCongNotVAT_Calculate',
        'Evaluator_Amount_THDenKyNayNotVAT_Calculate',
        'Evaluator_Amount_ThiCong_Calculate',
        'Evaluator_Amount_THDenKyNay_Calculate'
    ]

    columnChanged = {
        Amount_THDenKyNay: {
            Evaluators: [
                ////'Evaluator_Amount_HoanTra_calculate',
                'Evaluator_Amount_TongTTDenKyNay_Calculate',
                'Evaluator_ServerConstraint_Check_GiaTriThucHien_BCTC',
                'Evaluator_ServerConstraint_Check_GiaTriThucHien_KHKK',
                'Evaluator_ServerConstraint_Check_GiaTriThucHien_QuyCheTaiChinh'
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
        Percent_Th: {
            Evaluators: [
                'Evaluator_Amount_TTKyNay_Calculate'
            ]
        },
        Percent_HUng: {
            Evaluators: [
                'Evaluator_Amount_HoanTra_calculate'
            ]
        }
    };

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
                        'Evaluator_Amount_ThiCong_Calculate',
                        'Evaluator_Amount_Th_Calculator',
                        'Evaluator_Amount_ThiCongNotVAT_Calculate',
                        'Evaluator_Amount_THDenKyNayNotVAT_Calculate'
                    ]
                },
                Percent_Th: {
                    Evaluators: [
                        'Evaluator_Amount_Th_Calculator'
                    ]
                },
                Amount_Th: {
                    Evaluators: [
                        'Evaluator_Amount_THDenKyNay_Calculate'
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
                }
            }
        }
    ];

    rowAdded = [
        {
            Tables: 0,
            Evaluators: [
                // 'Evaluator_Amount_ThiCong_Calculate',
                // 'Evaluator_Amount_THDenKyNay_Calculate',
            ]
        }
    ]

    columnsReadOnly = [];

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
                    col: 6,
                    // isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 6
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số thanh toán',
                    type: 'text',
                    isReadOnly: 'true',
                    validators: [Validators.required],
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 6,
                    labelCol: 6
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Hợp đồng/phụ lục',
                    lookupKey: 'BizDoc_CTC',
                    lookupfilter: "(((DocCode = 'C3' OR (DocCode = 'C4' AND IsSubContractPay = 1)) AND ProductCostId='{EXPR=ProductCostId}' AND ContractTypeFilter='B2') OR (DocCode = 'C3' AND IsSubContractPay = 1)) AND Closed = 0 AND CompletedApprove=1 AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    binding: {
                        //CustomerCode: 'CustomerCode'
                        ////OriginalAmount_TamUng: 'Amount_TamUng'
                    },
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Đội nhóm',
                    lookupKey: 'Customer_CCM2',
                    lookupfilter: '',
                    //lookupfilter: "((('{EXPR=PayTeamType}' = '00' OR '{EXPR=PayTeamType}' = '04') OR ('{EXPR=ProductType}'=3) OR Code IN (SELECT A.CustomerCode FROM B30CCMBudgetDetail A INNER JOIN B30CCMBudget B ON A.CCMBudgetId = B.CCMBudgetId WHERE (A.CompletedApproveDetail=1 AND A.Loai_Dt = 'DTC') AND B.CompletedApprove=1 AND B.IsActive=1 AND B.DocCode='K1' AND B.ProductCostId ='{EXPR=ProductCostId}' GROUP BY A.CustomerCode)) AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%')",
                    validators: [Validators.required],
                    binding: {
                        Name: 'Person',
                        Address: 'Address'
                    },
                    hideValueMember: false,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 6
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'Amount_KHKK',
                    label: 'Giá trị KHKK (chưa VAT)',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6,
                    labelCol: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_BCTC',
                    label: 'Giá trị BCTC (chưa VAT)',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6,
                    labelCol: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_HDPL',
                    label: 'Giá trị HĐ + PLHĐ (gồm VAT)',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6,
                    labelCol: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_ThiCong',
                    label: 'Tổng giá trị thi công',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6,
                    labelCol: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_TamUng',
                    label: 'Giá trị tạm ứng',
                    type: 'number',
                    col: 6,
                    labelCol: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_THDenKyNay',
                    label: 'Tổng GT thực hiện đến kỳ này',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6,
                    labelCol: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_HoanTra',
                    label: 'Giá trị hoàn trả tạm ứng',
                    type: 'number',
                    col: 6,
                    labelCol: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_TongTTDenKyNay',
                    label: 'Tổng GTTT đến kỳ này',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6,
                    labelCol: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_TTKyTruoc',
                    label: 'Tổng GTTT đến kỳ trước',
                    type: 'number',
                    col: 6,
                    isDisabled: "'{EXPR=CountImport}' == 'true'",
                    labelCol: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_DeNghiTT',
                    label: 'Giá trị đề nghị thanh toán',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6,
                    labelCol: 6
                })
            ]
        })
    ];

    childColumns = [
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 80
        },
        {
            header: 'Diễn giải',
            binding: 'Description',
            width: 250
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 50
        },
        {
            header: 'Khối lượng hợp đồng',
            binding: 'Quantity_Hd',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 100,
            format: 'n3'
            // exprReadOnly: '1==1'
        },
        {
            header: 'Khối lượng thi công',
            binding: 'Quantity9',
            dataType: 'Number',
            width: 100,
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            format: 'n3'
        },
        {
            header: 'Đơn giá VNĐ',
            binding: 'OriginalUnitCost',
            dataType: 'Number',
            width: 100,
            format: 'n2',
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != ''"
        },
        {
            header: 'Thành tiền VNĐ',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 150
        },
        {
            header: '% thanh toán',
            binding: 'Percent_Th',
            dataType: 'Number',
            // step: 0.1,
            min: 0,
            max: 1,
            width: 110,
            format: 'p2'
        },
        {
            header: 'Giá trị thực hiện',
            binding: 'Amount_Th',
            dataType: 'Number',
            width: 150
        },
        {
            header: 'Đơn giá VT (chưa VAT)',
            binding: 'UnitCostVT',
            dataType: 'Number',
            width: 100
        },
        {
            header: 'Đơn giá NC (chưa VAT)',
            binding: 'UnitCostNC',
            dataType: 'Number',
            width: 100
        },
        {
            header: 'Mã Quản lý KL',
            binding: 'Ma_QLKL',
            dataType: 'Array',
            lookupKey: 'DmQLKL',
            bindingList: {
            },
            lookupfilter: 'IsActive=1',
            width: 100
        },
        {
            header: 'Mã khấu trừ',
            binding: 'Ma_KhauTru',
            dataType: 'Array',
            lookupKey: 'DmKhauTru',
            bindingList: {
            },
            lookupfilter: 'IsActive=1',
            width: 100
        },
        {
            header: 'Ghi chú',
            binding: 'Remark',
            allowEditing: true,
            width: 150
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50
        },
        {
            header: 'Bậc',
            binding: 'Level',
            dataType: 'Number',
            width: 50,
            format: 'n0'
        },
        {
            header: 'Công thức',
            binding: 'Formula',
            width: 200
        },
        {
            header: 'Tự áp công thức',
            binding: 'ManualFormula',
            dataType: 'Boolean',
            width: 80
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
        {
            header: 'Giá trị thực hiện (nhóm 1.)',
            binding: 'Amount_ThucHien_Muc1',
            dataType: 'Number',
            width: 0,
            format: 'n2',
            isReadOnly: 'true'
        }
    ]
}