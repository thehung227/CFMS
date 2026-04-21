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

// Bill quyết toán thi công
export class LayoutBillSettlementExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocCCM_Explore',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode='QT' AND IsActive=1  AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'ProductName,CustomerName,DocNo DESC',
                RowPage: 50
            }
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Bảng KLQT thi công - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng KLQT thi công",
                    FileName: "Bảng KLQT thi công - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "11.Bang_KLQT.docx",
                    ExcelName: "11.Bang_KLQT.xlsx",
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
            header: 'Đối tượng',
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
            header: 'Ngày',
            binding: 'DocDate',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Số hợp đồng',
            binding: 'DocNo_Hd',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Ngày hợp đồng',
            binding: 'DocDate_Hd',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Tổng giá trị thanh toán đến kì này',
            binding: 'Amount_TongTTDenKyNay',
            width: 150,
            textAlign: 'right',
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Giá trị đề nghị thanh toán',
            binding: 'Amount_DeNghiTT',
            width: 150,
            textAlign: 'right',
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Gói thầu/ PB',
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

export class LayoutBillSettlementEditor implements IEditorFormulaDeclaration {
    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocCCM_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'QT',
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
                        CustomerCode: 'Parent.Customer',
                        TaxCode: 'Parent.TaxCode'
                    }
                },
                {
                    Name: 'vB30BizDocCCMDetail01_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        CustomerCode: 'Parent.Customer',
                        TaxCode: 'Parent.TaxCode'
                    }
                },
                {
                    Name: 'vB30BizDocCCMDetail02_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        CustomerCode: 'Parent.Customer',
                        TaxCode: 'Parent.TaxCode'
                    }
                },
                {
                    Name: 'vB30BizDocCCMDetail03_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        CustomerCode: 'Parent.Customer',
                        TaxCode: 'Parent.TaxCode'
                    }
                },
                {
                    Name: 'vB30BizDocCCMDetail04_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        CustomerCode: 'Parent.Customer',
                        TaxCode: 'Parent.TaxCode'
                    }
                },
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Bảng KLQT thi công - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocCCM_VoucherForm_TachBill',
            Command_TongHop: 'usp_CCM_BillSupp_TongHop',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng KLQT thi công",
                    FileName: "Bảng KLQT thi công - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "11.Bang_KLQT_Ver2.docx",
                    ExcelName: "11.Bang_KLQT_Ver2.xlsx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: "MAU2",
                    Name: "Bảng Tổng hợp KLTT",
                    FileName: "Bảng TH KLTT TP.NCC",
                    WordName: "5.Bang_TH_KLTT.docx",
                    ExcelName: "",
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
        'Evaluator_Amount_ThiCong_Calculate': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "Amount_ThiCongNotVAT",
            Value: "OriginalAmount",
            Tables: 0
        },
        'Evaluator_Amount_THDenKyNay_Calculate': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "Amount_THDenKyNayNotVAT",
            Value: "Amount_Th",
            Tables: 0
        },
        // 'Evaluator_Amount_ThiCong_AddVAT': {
        //     EvaluatorName: 'EvaluatorCaculate',
        //     DataMember: "Amount_ThiCong",
        //     Value: "Math.round(Amount_ThiCongNotVAT+(TaxRate*Amount_ThiCongNotVAT))"
        // },
        'Evaluator_Amount_ThiCong_AddVAT': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_ThiCong",
            Value: "CurrencyCode == 'VND' ? Math.round(Amount_TongThiCongKyTruoc+((Amount_ThiCongNotVAT-Amount_TongThiCongKyTruocNotVAT)+(TaxRate*(Amount_ThiCongNotVAT-Amount_TongThiCongKyTruocNotVAT)))) : (Amount_TongThiCongKyTruoc+((Amount_ThiCongNotVAT-Amount_TongThiCongKyTruocNotVAT)+(TaxRate*(Amount_ThiCongNotVAT-Amount_TongThiCongKyTruocNotVAT))))"
        },
        // 'Evaluator_Amount_THDenKyNay_AddVAT': {
        //     EvaluatorName: 'EvaluatorCaculate',
        //     DataMember: "Amount_THDenKyNay",
        //     Value: "Math.round(Amount_THDenKyNayNotVAT+(TaxRate*Amount_THDenKyNayNotVAT))"
        // },
        'Evaluator_Amount_THDenKyNay_AddVAT': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_THDenKyNay",
            Value: "CurrencyCode == 'VND' ? Math.round(Amount_TongThucHienKyTruoc+((Amount_THDenKyNayNotVAT-Amount_TongThucHienKyTruocNotVAT)+(TaxRate*(Amount_THDenKyNayNotVAT-Amount_TongThucHienKyTruocNotVAT)))) : (Amount_TongThucHienKyTruoc+((Amount_THDenKyNayNotVAT-Amount_TongThucHienKyTruocNotVAT)+(TaxRate*(Amount_THDenKyNayNotVAT-Amount_TongThucHienKyTruocNotVAT))))"
            // Value: "CurrencyCode == 'VND' ? Math.round(Amount_THDenKyNayNotVAT+(TaxRate*Amount_THDenKyNayNotVAT)) : (Amount_THDenKyNayNotVAT+(TaxRate*Amount_THDenKyNayNotVAT))"
        },

        //EvaluatorCaculate
        'Evaluator_Amount_TTKyNay_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_TTKyNay",
            Value: "Math.round(Amount_THDenKyNay)"
        },
        'Evaluator_Amount_TongTTDenKyNay_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_TongTTDenKyNay",
            Value: "Amount_TTKyNay - Amount_BaoHanh + Amount_KhauTruBaoHanh"
        },
        'Evaluator_Amount_DeNghiTT_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_DeNghiTT",
            Value: "Amount_TongTTDenKyNay + Amount_TTKyTruoc"
        },
        'Evaluator_Amount_HoanTra_Equals_Amount_TamUng': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'Amount_HoanTra',
            Value: "-Amount_TamUng",
            zExpr: "DocNo.indexOf('/QT.') > -1"
        },
        'Evaluator_Amount_BaoHanh_Calculate': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ParentBizDocId,Amount_THDenKyNay,Percent_BH,IsBeforeVAT,Amount_THDenKyNayNotVAT',
            Command: 'usp_Amount_BaoHanh_Calculate',
            DataMember: "Amount_BaoHanh"
        },

        //child
        'Evaluator_BizDocDetail_OriginalAmount9': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount",
            Value: "Math.round(Quantity9*OriginalUnitCost)",
            Tables: 0
        },
        'Evaluator_BizDocDetail01_OriginalAmount9': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount",
            Value: "Math.round(Quantity9*OriginalUnitCost)",
            Tables: 1
        },
        'Evaluator_BizDocDetail02_OriginalAmount9': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount",
            Value: "Math.round(Quantity9*OriginalUnitCost)",
            Tables: 2
        },
        'Evaluator_BizDocDetail03_OriginalAmount9': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount",
            Value: "Math.round(Quantity9*OriginalUnitCost)",
            Tables: 3
        },
        'Evaluator_BizDocDetail04_OriginalAmount9': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount",
            Value: "Math.round(Quantity9*OriginalUnitCost)",
            Tables: 4
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
        'Evaluator_Amount_Th01_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_Th",
            Value: "Math.round(OriginalAmount*Percent_Th)",
            Tables: 1
        },
        'Evaluator_Amount_Th02_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_Th",
            Value: "Math.round(OriginalAmount*Percent_Th)",
            Tables: 2
        },
        'Evaluator_Amount_Th03_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_Th",
            Value: "Math.round(OriginalAmount*Percent_Th)",
            Tables: 3
        },
        'Evaluator_Amount_Th04_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_Th",
            Value: "Math.round(OriginalAmount*Percent_Th)",
            Tables: 4
        },
        //contrainst
        'Evaluator_ServerConstraint_CheckUniqueDocNo': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},BizDocId,DocCode,DocNo',
            Command: 'ufn_B30BizDocCCM_CheckUniqueDocNo',
            MessageText: 'Số phiếu bảng KLQT đã tồn tại.',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_ImportedExcel': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Id,DocCode,ProductCostId,ParentBizDocId,CustomerCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_CheckImported',
            DataMember: 'CountImport',
            zExpr: "ProductCostId != '' && ParentBizDocId != ''"
        },
        'Evaluator_ServerConstraint_Load_PL': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ParentBizDocId,BizDocId,DocDate,CustomerCode,ProductCostId,{VAR=Branch.Ma_Dvcs},DocCode,DocNo',
            Command: 'usp_Coteccons_BillThanhToan_LoadPLA',
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_Load_PL01': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ParentBizDocId,BizDocId,DocDate,CustomerCode,ProductCostId,{VAR=Branch.Ma_Dvcs},DocCode,DocNo',
            Command: 'usp_Coteccons_BillThanhToan_LoadPLA01',
            OutputTable: 1
        },
        'Evaluator_ServerConstraint_Load_PL02': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ParentBizDocId,BizDocId,DocDate,CustomerCode,ProductCostId,{VAR=Branch.Ma_Dvcs},DocCode,DocNo',
            Command: 'usp_Coteccons_BillThanhToan_LoadPLA02',
            OutputTable: 2
        },
        'Evaluator_ServerConstraint_Load_PL03': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,ParentBizDocId,BizDocId,DocCode,{VAR=Branch.Ma_Dvcs},{VAR=User.Id}',
            Command: 'usp_NEW_LoadBillDefect',
            OutputTable: 3
        },
        'Evaluator_ServerConstraint_Load_PL04': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ParentBizDocId,BizDocId,DocDate,CustomerCode,ProductCostId,{VAR=Branch.Ma_Dvcs},DocCode,DocNo',
            Command: 'usp_Coteccons_BillThanhToan_LoadPLA04',
            OutputTable: 4
        },
        'Evaluator_ServerConstraint_Amount_TTKyTruoc': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,ProductCostId,ParentBizDocId,{VAR=Branch.Ma_Dvcs},DocCode,DocDate,CustomerCode',
            Command: 'usp_Coteccons_Bill_TongGiaTriThanhToanDenCacKyTruoc',
            DataMember: 'Amount_TTKyTruoc,Amount_TamUng,Amount_TongThiCongKyTruocNotVAT,Amount_TongThiCongKyTruoc,Amount_TongThucHienKyTruocNotVAT,Amount_TongThucHienKyTruoc',
            zExpr: "ProductCostId != '' && ParentBizDocId != '' && CustomerCode != ''"
        },

        'Evaluator_ServerConstraint_Amount_HDPL': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "ParentBizDocId,{VAR=Branch.Ma_Dvcs},{VAR=LoaiC34}",
            Command: 'ufn_Coteccons_GetValueContract_SubContract',
            DataMember: 'Amount_HDPL'
        },
        'Evaluator_ServerConstraint_ContractValue': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "ParentBizDocId,{VAR=Branch.Ma_Dvcs},{VAR=LoaiC3}",
            Command: 'ufn_Coteccons_GetValueContract_SubContract',
            DataMember: 'ContractValue'
        },
        'Evaluator_ServerConstraint_Amount_KHKK_BCTC': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ProductCostId,ParentBizDocId,CustomerCode,DocDate,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_GetAmount_KHKK_BCTC',
            DataMember: 'Amount_KHKK,Amount_BCTC',
            zExpr: "ProductCostId != '' && ParentBizDocId != '' && CustomerCode != ''"
        },
        'Evaluator_ServerConstraint_Get_PercentTemp': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ParentBizDocId',
            Command: 'usp_Coteccons_GetPercentFromC3C4',
            DataMember: 'TaxCode,TaxRate,Percent_Th,Percent_HUng,CustomerCode,CurrencyCode,Percent_BH'
        },
        //check
        'Evaluator_ServerConstraint_Check_ThanhToan_KhongLapMoiKhiChuaDuyetCu': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,ParentBizDocId,CustomerCode,DocCode,{VAR=Branch.Ma_Dvcs},Id',//{VAR=DocCodeP4}
            Command: 'ufn_Coteccons_ThanhToan_KhongLapMoiKhiChuaDuyetCu',
            zExpr: "ProductCostId != ''",
            MessageText: 'Không thể lập mới khi chưa hoàn thiện duyệt thanh toán trước',
            IgnoreError: 0
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
            ConstraintKey: "ProductCostId,ParentBizDocId,CustomerCode,Amount_THDenKyNay,TaxRate,DocDate,{VAR=Branch.Ma_Dvcs}",
            Command: 'ufn_Coteccons_BillThanhToan_CheckGiaTriThucHien',
            MessageText: 'Giá trị thực hiện đã vượt quá hạn mức KHKK hoặc BCTC, yêu cầu điều chỉnh KHKK hoặc BCTC',
            IgnoreError: 0
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
        'Evaluator_ServerConstraint_Check_GiaTriThiCong': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,ParentBizDocId,CustomerCode,Amount_ThiCong,TaxRate,DocDate,{VAR=Branch.Ma_Dvcs}",
            Command: 'ufn_Coteccons_BillThanhToan_CheckGiaTriThiCong',
            MessageText: 'Giá trị thi công vượt đã quá hạn mức',
            IgnoreError: 1
        },
        'Evaluator_ServerConstraint_Check_GiaTriThucHien_QuyCheTaiChinh': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ParentBizDocId,CustomerCode,Amount_THDenKyNayNotVAT,{VAR=Branch.Ma_Dvcs},TaxRate",
            Command: 'ufn_Coteccons_BillThanhToan_CheckQuyCheTaiChinh',
            MessageText: 'Giá trị thực hiện vượt quá giá trị hợp đồng theo quy định, cần bổ sung PLHĐ',
            zExpr: '1=2',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Amount_TamUng_Compare_Amount_HoanTra': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "Amount_HoanTra,Amount_TamUng,{VAR=CompareOperator_Gt}",
            Command: 'ufn_Coteccons_Compare2Number',
            MessageText: 'Giá trị hoàn trả tạm ứng không được vượt quá giá trị tạm ứng',
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
        'Evaluator_ServerUpdated_CreateFormula_BizDocCCMDetail01': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Coteccons_CreateFormula_BizDocCCMDetail01'
        },
        'Evaluator_ServerUpdated_CreateFormula_BizDocCCMDetail02': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Coteccons_CreateFormula_BizDocCCMDetail02'
        },
        'Evaluator_ServerUpdated_CreateFormula_BizDocCCMDetail03': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Coteccons_CreateFormula_BizDocCCMDetail03'
        },
        'Evaluator_ServerUpdated_CreateFormula_BizDocCCMDetail04': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Coteccons_CreateFormula_BizDocCCMDetail04'
        },
        'Evaluator_ServerUpdated_BuiltinOrder': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=TableNames_B30BizDocCCMDetail},{VAR=Keys_B30BizDocCCMDetail},{VAR=FieldOrders_B30BizDocCCMDetail},{VAR=EmptyField_CCMBudgetId},BizDocId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_Web_SetBuiltionOrder'
        },
        'Evaluator_ServerUpdated_BuiltinOrder01': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=TableNames_B30BizDocCCMDetail01},{VAR=Keys_B30BizDocCCMDetail},{VAR=FieldOrders_B30BizDocCCMDetail},{VAR=EmptyField_CCMBudgetId},BizDocId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_Web_SetBuiltionOrder'
        },
        'Evaluator_ServerUpdated_BuiltinOrder02': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=TableNames_B30BizDocCCMDetail02},{VAR=Keys_B30BizDocCCMDetail},{VAR=FieldOrders_B30BizDocCCMDetail},{VAR=EmptyField_CCMBudgetId},BizDocId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_Web_SetBuiltionOrder'
        },
        'Evaluator_ServerUpdated_BuiltinOrder03': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=TableNames_B30BizDocCCMDetail03},{VAR=Keys_B30BizDocCCMDetail},{VAR=FieldOrders_B30BizDocCCMDetail},{VAR=EmptyField_CCMBudgetId},BizDocId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_Web_SetBuiltionOrder'
        },
        'Evaluator_ServerUpdated_BuiltinOrder04': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=TableNames_B30BizDocCCMDetail04},{VAR=Keys_B30BizDocCCMDetail},{VAR=FieldOrders_B30BizDocCCMDetail},{VAR=EmptyField_CCMBudgetId},BizDocId,{VAR=Branch.Ma_Dvcs}',
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
        'Evaluator_ServerConstraint_Amount_KHKK_BCTC',
        'Evaluator_ServerConstraint_ContractValue'
    ]

    serverUpdating = [
        // 'Evaluator_Amount_ThiCong_Calculate',
        //'Evaluator_Amount_THDenKyNay_Calculate',
        'Evaluator_ServerConstraint_CheckUniqueDocNo',
        'Evaluator_ServerConstraint_Exists_Settlement',
        'Evaluator_ServerConstraint_Check_ThanhToan_KhongLapMoiKhiChuaDuyetCu',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        // 'Evaluator_ServerConstraint_Check_GiaTriThucHien_BCTC',
        // 'Evaluator_ServerConstraint_Check_GiaTriThucHien_KHKK',
        ////'Evaluator_ServerConstraint_Check_GiaTriThiCong',
        // 'Evaluator_ServerConstraint_Check_GiaTriThucHien_QuyCheTaiChinh',
        'Evaluator_ServerConstraint_Amount_TamUng_Compare_Amount_HoanTra',
        'Evaluator_ServerConstraint_Check_UserModified'
    ]

    serverUpdated: string[] = [
        'Evaluator_ServerUpdated_BuiltinOrder',
        'Evaluator_ServerUpdated_CreateFormula_BizDocCCMDetail',
        'Evaluator_ServerUpdated_BizDocCCMDetail_UpdateFromParent',
        'Evaluator_ServerUpdated_Amount_KHKK_BCTC',
        'Evaluator_ServerUpdated_BizDocCCM_RoundAmount'
    ]

    buttonLoadChild = [
        'Evaluator_ServerConstraint_CheckUniqueDocNo',
        'Evaluator_ServerConstraint_Exists_Settlement',
        'Evaluator_ServerConstraint_Check_ThanhToan_KhongLapMoiKhiChuaDuyetCu',
        // 'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_UserModified',
        //
        'Evaluator_ServerConstraint_Amount_TTKyTruoc',
        // 'Evaluator_ServerConstraint_Amount_HDPL',
        // 'Evaluator_ServerConstraint_Amount_KHKK_BCTC',
        'Evaluator_ServerConstraint_Load_PL',
        'Evaluator_ServerConstraint_Load_PL01',
        'Evaluator_ServerConstraint_Load_PL02',
        'Evaluator_ServerConstraint_Load_PL03',
        'Evaluator_ServerConstraint_Load_PL04'
    ]

    buttonCommand: string[] = [
        'Evaluator_Amount_ThiCong_Calculate',
        'Evaluator_Amount_THDenKyNay_Calculate'
    ]

    importCommand: string[] = [
        'Evaluator_Amount_ThiCong_Calculate',
        'Evaluator_Amount_THDenKyNay_Calculate'
        
    ]

    columnChanged = {
        ParentBizDocId: {
            Evaluators: [
                'Evaluator_ServerConstraint_Get_PercentTemp'
            ]
        },
        Amount_ThiCongNotVAT: {
            Evaluators: [
                'Evaluator_Amount_ThiCong_AddVAT'
            ]
        },
        Amount_THDenKyNayNotVAT: {
            Evaluators: [
                'Evaluator_Amount_THDenKyNay_AddVAT'
            ]
        },
        Amount_THDenKyNay: {
            Evaluators: [
                'Evaluator_Amount_TTKyNay_Calculate',
                'Evaluator_Amount_BaoHanh_Calculate',
                // 'Evaluator_ServerConstraint_Check_GiaTriThucHien_BCTC',
                // 'Evaluator_ServerConstraint_Check_GiaTriThucHien_KHKK',
                // 'Evaluator_ServerConstraint_Check_GiaTriThucHien_QuyCheTaiChinh'
            ]
        },
        Amount_TamUng: {
            Evaluators: [
                'Evaluator_Amount_HoanTra_Equals_Amount_TamUng'
            ]
        },
        Amount_TTKyNay: {
            Evaluators: [
                'Evaluator_Amount_TongTTDenKyNay_Calculate'
            ]
        },
        Percent_BH: {
            Evaluators: [
                'Evaluator_Amount_BaoHanh_Calculate',
            ]
        },
        Amount_BaoHanh: {
            Evaluators: [
                'Evaluator_Amount_TongTTDenKyNay_Calculate'
            ]
        },
        Amount_KhauTruBaoHanh: {
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
        TaxCode: {
            Evaluators: [
                'Evaluator_Amount_ThiCong_AddVAT',
                'Evaluator_Amount_THDenKyNay_AddVAT'
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
                }
            }
        },
        {
            Tables: 1,
            columnChanged: {
                Quantity9: {
                    Evaluators: [
                        'Evaluator_BizDocDetail01_OriginalAmount9'
                    ]
                },
                OriginalUnitCost: {
                    Evaluators: [
                        'Evaluator_BizDocDetail01_OriginalAmount9'
                    ]
                },
                OriginalAmount: {
                    Evaluators: [
                        'Evaluator_Amount_Th01_Calculator'
                    ]
                },
                Percent_Th: {
                    Evaluators: [
                        'Evaluator_Amount_Th01_Calculator',
                        // 'Evaluator_Amount_TTKyNay_Calculate',
                    ]
                },
               
            }
        },
        {
            Tables: 2,
            columnChanged: {
                Quantity9: {
                    Evaluators: [
                        'Evaluator_BizDocDetail02_OriginalAmount9'
                    ]
                },
                OriginalUnitCost: {
                    Evaluators: [
                        'Evaluator_BizDocDetail02_OriginalAmount9'
                    ]
                },
                OriginalAmount: {
                    Evaluators: [
                        'Evaluator_Amount_Th02_Calculator'
                    ]
                },
                Percent_Th: {
                    Evaluators: [
                        'Evaluator_Amount_Th02_Calculator',
                        // 'Evaluator_Amount_TTKyNay_Calculate',
                    ]
                }
            }
        },
        {
            Tables: 3,
            columnChanged: {
                Quantity9: {
                    Evaluators: [
                        'Evaluator_BizDocDetail03_OriginalAmount9'
                    ]
                },
                OriginalUnitCost: {
                    Evaluators: [
                        'Evaluator_BizDocDetail03_OriginalAmount9'
                    ]
                },
                OriginalAmount: {
                    Evaluators: [
                        'Evaluator_Amount_Th03_Calculator'
                    ]
                },
                Percent_Th: {
                    Evaluators: [
                        'Evaluator_Amount_Th03_Calculator',
                        // 'Evaluator_Amount_TTKyNay_Calculate',
                    ]
                }
            }
        },
        {
            Tables: 4,
            columnChanged: {
                Quantity9: {
                    Evaluators: [
                        'Evaluator_BizDocDetail04_OriginalAmount9'
                    ]
                },
                OriginalUnitCost: {
                    Evaluators: [
                        'Evaluator_BizDocDetail04_OriginalAmount9'
                    ]
                },
                OriginalAmount: {
                    Evaluators: [
                        'Evaluator_Amount_Th04_Calculator'
                    ]
                },
                Percent_Th: {
                    Evaluators: [
                        'Evaluator_Amount_Th04_Calculator',
                        // 'Evaluator_Amount_TTKyNay_Calculate',
                    ]
                }
            }
        }
    ];

    rowAdded = [
        {
            Tables: 0,
            Evaluators: [
                //'Evaluator_Amount_ThiCong_Calculate',
                //'Evaluator_Amount_THDenKyNay_Calculate'
            ]
        }
    ]

    columnsReadOnly: string[];

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
                    labelCol: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số quyết toán',
                    type: 'text',
                    isReadOnly: 'true',
                    col: 6,
                    style: 'background-color:#F1EDED;border-radius:8px;',
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
                    // isReadOnly: 'true',
                    // style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Hợp đồng/phụ lục',
                    lookupKey: 'BizDoc_CTC',
                    validators: [Validators.required],
                    lookupfilter: "(((DocCode = 'C3' OR (DocCode = 'C4' AND IsSubContractPay = 1)) AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId IN (SELECT RowId FROM B20Product WHERE ParentRowId='{EXPR=ProductCostId}') OR ProductCostId IN (SELECT ParentRowId FROM B20Product WHERE RowId='{EXPR=ProductCostId}' AND ParentRowId <> '') ) AND ContractTypeFilter='B4') OR (DocCode='C3' AND IsSubContractPay = 1)) AND Closed = 0 AND CompletedApprove=1 AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    //lookupfilter: "DocCode IN ('C3','C4') AND CompletedApprove=1 AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId='{EXPR=ProductCostId}' AND ContractTypeFilter='B4'",
                    hideValueMember: true,
                    binding: {
                        TaxCode: 'TaxCode',
                        TiLe_ThanhToan: 'Percent_Th',
                        Tile_TtVt: 'Percent_TtVt',
                        TiLe_TamUng: 'Percent_TUng',
                        TiLe_HoanUng: 'Percent_HUng',
                        TiLe_KhauTruTamUng: 'Percent_01A',
                        TiLe_QuyetToan: 'Percent_QT',
                        TiLe_BaoHanh: 'Percent_BH',
                        //OriginalAmount_TamUng: 'Amount_TamUng',
                        CustomerCode: 'CustomerCode',
                        CurrencyCode: 'CurrencyCode'
                    },
                    col: 12,
                    // isReadOnly: 'true',
                    // style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Đối tác',
                    lookupKey: 'Customer_CCM2',
                    validators: [Validators.required],
                    lookupfilter: "(('{EXPR=ProductType}'=3 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%') OR Code IN (SELECT A.CustomerCode FROM B30CCMBudgetDetail A INNER JOIN B30CCMBudget B ON A.CCMBudgetId = B.CCMBudgetId WHERE (A.CompletedApproveDetail=1 OR A.Loai_Dt = 'DTC') AND B.CompletedApprove=1 AND B.IsActive=1 AND B.DocCode='K1' AND B.ProductCostId ='{EXPR=ProductCostId}' GROUP BY A.CustomerCode))",
                    hideValueMember: false,
                    binding: {
                        Name: 'Person',
                        Address: 'Address'
                    },
                    col: 12,
                    // isReadOnly: 'true',
                    // style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 6
                }, this.srv, this.parentData),
                // new NumberBoxInput({
                //     key: 'Percent_QT',
                //     label: '% quyết toán',
                //     type: 'number',
                //     format: 'p3',
                //     min: 0,
                //     max: 1,
                //     col: 6,
                //     labelCol: 6
                // }),
                new NumberBoxInput({
                    key: 'Amount_HDPL',
                    label: 'Giá trị hợp đồng + phụ lục (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    labelCol: 6
                }),
                new NumberBoxInput({
                    key: 'ContractValue',
                    label: 'Giá trị hợp đồng (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    labelCol: 6
                }),
                new NumberBoxInput({
                    key: 'Percent_BH',
                    label: '% bảo hành',
                    type: 'number',
                    format: 'p3',
                    //isDisabled: 'true',
                    min: 0,
                    max: 1,
                    col: 12,
                    labelCol: 6
                }),
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
                    key: 'Amount_TongThiCongKyTruocNotVAT',
                    label: 'Tổng giá trị thi công đến kỳ trước(chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    labelCol: 6,
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_TongThiCongKyTruoc',
                    label: 'Tổng giá trị thi công đến kỳ trước(gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    labelCol: 6,
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_ThiCongNotVAT',
                    label: 'Tổng giá trị thi công (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    labelCol: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_ThiCong',
                    label: 'Tổng giá trị thi công (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: '{EXPR=TaxCode} != "V10D"',
                    labelCol: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_TongThucHienKyTruocNotVAT',
                    label: 'Tổng GTTH đến kỳ trước(chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    labelCol: 6,
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_TongThucHienKyTruoc',
                    label: 'Tổng GTTH đến kỳ trước(gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    labelCol: 6,
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_THDenKyNayNotVAT',
                    label: 'Tổng giá trị thực hiện (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    labelCol: 6,
                }),
                new NumberBoxInput({
                    key: 'Amount_THDenKyNay',
                    label: 'Tổng giá trị thực hiện (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: '{EXPR=TaxCode} != "V10D"',
                    labelCol: 6,
                }),
                new NumberBoxInput({
                    key: 'Amount_TamUng',
                    label: 'Giá trị tạm ứng',
                    type: 'number',
                    col: 6,
                    labelCol: 6,
                    //isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'Amount_TTKyNay',
                    label: 'Tổng giá trị quyết toán (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    labelCol: 6
                }),
               
                new NumberBoxInput({
                    key: 'Amount_HoanTra',
                    label: 'Giá trị hoàn trả tạm ứng',
                    type: 'number',
                    col: 6,
                    labelCol: 6,
                    //isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'Amount_KhauTruBaoHanh',
                    label: 'Khấu trừ khác (tiền phạt, tiện ích,...)',
                    col: 6,
                    labelCol: 6
                    // isDisabled: "'{EXPR=PayTeamType}' != '03'"
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_BaoHanh',
                    label: 'GT giữ lại bảo hành (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    labelCol: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_TongTTDenKyNay',
                    label: 'Tổng GTTT đến kỳ này (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    labelCol: 6
                }),
               
               
                new NumberBoxInput({
                    key: 'Amount_TTKyTruoc',
                    label: 'Tổng GTTT đến kỳ trước (gồm VAT)',
                    type: 'number',
                    col: 6,
                    labelCol: 6,
                    isDisabled: 'true'
                }),
             
                new NumberBoxInput({
                    key: 'Amount_DeNghiTT',
                    label: 'Giá trị đề nghị thanh toán (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    labelCol: 6
                }),
                new LookupBoxInput({
                    key: 'TaxCode',
                    label: 'Thuế',
                    lookupKey: 'Tax',
                    hideValueMember: false,
                    lookupfilter: "Type=1 AND IsActive=1 AND IsGroup=0 AND IsDefault = 1",
                    binding: {
                        Rate: 'TaxRate'
                    },
                    col: 6,
                    labelCol: 6,
                    //isDisabled: 'true'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CurrencyCode',
                    label: 'Mã tiền tệ',
                    lookupKey: 'Currency',
                    lookupfilter: "IsActive=1 AND IsGroup=0",
                    hideValueMember: false,
                    col: 6,
                    labelCol: 6,
                    //isDisabled: 'true'
                }, this.srv, this.parentData)
            ]
        })
    ];

    childColumns = [
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 100
        },
        {
            header: 'Hạng mục QLKL',
            binding: 'Ma_QLKL',
            dataType: 'Array',
            lookupKey: 'PlanQuantityHM',
            lookupfilter: "ProductCostId='{VAR=Filter.ProductCostId}'",
            width: 130,
            // hidden: "'{EXPR=PayTeamType}'=='01'"
        },
      
        {
            header: 'Mã Quản lý KL',
            binding: 'PartNo',
            dataType: 'Array',
            lookupKey: 'DmQLKL',
            lookupfilter: 'IsActive=1',
            width: 100
        },
          {
            header: 'Đội (+/-)',
            binding: 'CustomerCode',
            dataType: 'Array',
            lookupKey: 'Customer',
            lookupfilter: "IsGroup=0 AND IsActive=1",
            width: 100
        },
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
            header: 'Khối lượng hợp đồng',
            binding: 'Quantity_Hd',
            dataType: 'Number',
            width: 100,
            format: 'n3',
            isReadOnly: 'true',
            // exprReadOnly: '1==1'
        },
        {
            header: 'Khối lượng thi công',
            binding: 'Quantity9',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 100,
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
            dataType: 'Number',
            width: 150
        },
        {
            header: 'Loại thuế',
            binding: 'TaxCode',
            width: 60,
            dataType: 'Array',
            lookupKey: 'Tax',
       
            lookupfilter: "Type=1 AND IsActive=1 AND IsGroup=0 AND IsDefault = 1",
        },
        {
            header: 'Id gói thầu',
            dataType: 'Array',
            binding: 'ProductCostId',
            lookupKey: 'ProductCost',
            bindingList: {
                ProductCostInfo: 'ProductCostInfo'
            },
            lookupfilter: "ProductType IN (1,3) AND IsGroup = 0 AND IsActive = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}'",
            hideValueMember: true,
            width: 120
        },
        // {
        //     header: 'Giá trị thực hiện (nhóm 1.)',
        //     binding: 'Amount_ThucHien_Muc1',
        //     dataType: 'Number',
        //     width: 150,
        //     format: 'n0'
        // },
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
            lookupfilter: 'IsActive=1',
            width: 100
        },
        {
            header: 'Mã khấu trừ',
            binding: 'Ma_KhauTru',
            dataType: 'Array',
            lookupKey: 'DmKhauTru',
            lookupfilter: 'IsActive=1',
            width: 100
        },
        {
            header: 'Ghi chú',
            binding: 'Remark',
            allowEditing: true,
            width: 200
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
            width: 300
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
            header: 'Tên QLKL',
            binding: 'TenQLKL',
            width: 250,
            isReadOnly: 'true'
        },
         {
            header: 'Khối lượng trước',
            binding: 'RequestQuantity',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 0,
            format: 'n3'
        },
        {
            header: 'Đơn giá trước',
            binding: 'ChartUnitCost',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 0,
            format: 'n2'
        },
         {
            header: 'Giá trị trước',
            binding: 'AmountAcumPrePeriod',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 0,
            format: 'n2'
        },
        {
            header: 'Ghi chú',
            binding: 'RemarkCCM',
            allowEditing: true,
            width: 0
        },
         {
            header: '% thực hiện',
            binding: 'Rate1',
            dataType: 'Number',
            width: 0,
            min: 0,
            max: 1,
            format: 'p2'
        },
    ]

    childColumns1 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 100
        },
        {
            header: 'Hạng mục QLKL',
            binding: 'Ma_QLKL',
            dataType: 'Array',
            lookupKey: 'PlanQuantityHM',
            lookupfilter: "ProductCostId='{VAR=Filter.ProductCostId}'",
            width: 130,
            // hidden: "'{EXPR=PayTeamType}'=='01'"
        },
      
        {
            header: 'Mã Quản lý KL',
            binding: 'PartNo',
            dataType: 'Array',
            lookupKey: 'DmQLKL',
            lookupfilter: 'IsActive=1',
            width: 100
        },
          {
            header: 'Đội (+/-)',
            binding: 'CustomerCode',
            dataType: 'Array',
            lookupKey: 'Customer',
            lookupfilter: "IsGroup=0 AND IsActive=1",
            width: 100
        },
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
            header: 'Khối lượng hợp đồng',
            binding: 'Quantity_Hd',
            dataType: 'Number',
            width: 100,
            format: 'n3'
            // exprReadOnly: '1==1'
        },
        {
            header: 'Khối lượng thi công',
            binding: 'Quantity9',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 100,
            format: 'n3'
        },
        {
            header: 'Đơn giá VNĐ',
            binding: 'OriginalUnitCost',
            dataType: 'Number',
            width: 150,
            format: 'n2',
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''"
        },
        {
            header: 'Thành tiền VNĐ',
            binding: 'OriginalAmount',
            width: 150,
            dataType: 'Number',
            //exprFormat: "'{EXPR=CurrencyCode}' == 'VND' ? 'n0' : 'n2'"
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''",
            isReadOnly: 'true'
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
            isReadOnly: 'true',
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''"
            //exprFormat: "'{EXPR=CurrencyCode}' == 'VND' ? 'n0' : 'n2'"
        },
        {
            header: 'Loại thuế',
            binding: 'TaxCode',
            width: 60,
            dataType: 'Array',
            lookupKey: 'Tax',
       
            lookupfilter: "Type=1 AND IsActive=1 AND IsGroup=0 AND IsDefault = 1",
        },
        {
            header: 'Đơn giá VT (chưa VAT)',
            binding: 'UnitCostVT',
            dataType: 'Number',
            width: 100,
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''"
        },
        {
            header: 'Đơn giá NC (chưa VAT)',
            binding: 'UnitCostNC',
            dataType: 'Number',
            width: 100,
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''"
        },
      
        {
            header: 'Mã khấu trừ',
            binding: 'Ma_KhauTru',
            dataType: 'Array',
            lookupKey: 'DmKhauTru',
            lookupfilter: 'IsActive=1',
            width: 100
        },
        {
            header: 'Ghi chú',
            binding: 'Remark',
            allowEditing: true,
            width: 200
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
            width: 300
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
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: 'Tên QLKL',
            binding: 'TenQLKL',
            width: 250,
            isReadOnly: 'true'
        },
         {
            header: 'Khối lượng trước',
            binding: 'RequestQuantity',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 0,
            format: 'n3'
        },
        {
            header: 'Đơn giá trước',
            binding: 'ChartUnitCost',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 0,
            format: 'n2'
        },
         {
            header: 'Giá trị trước',
            binding: 'AmountAcumPrePeriod',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 0,
            format: 'n2'
        },
        {
            header: 'Ghi chú',
            binding: 'RemarkCCM',
            allowEditing: true,
            width: 0
        },
         {
            header: '% thực hiện',
            binding: 'Rate1',
            dataType: 'Number',
            width: 0,
            min: 0,
            max: 1,
            format: 'p2'
        },
    ];

    childColumns2 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 100
        },
        {
            header: 'Hạng mục QLKL',
            binding: 'Ma_QLKL',
            dataType: 'Array',
            lookupKey: 'PlanQuantityHM',
            lookupfilter: "ProductCostId='{VAR=Filter.ProductCostId}'",
            width: 130,
            // hidden: "'{EXPR=PayTeamType}'=='01'"
        },
      
        {
            header: 'Mã Quản lý KL',
            binding: 'PartNo',
            dataType: 'Array',
            lookupKey: 'DmQLKL',
            lookupfilter: 'IsActive=1',
            width: 100
        },
          {
            header: 'Đội (+/-)',
            binding: 'CustomerCode',
            dataType: 'Array',
            lookupKey: 'Customer',
            lookupfilter: "IsGroup=0 AND IsActive=1",
            width: 100
        },
        {
            header: 'Id hợp đồng',
            binding: 'BizDocId_C1',
            width: 200,
            dataType: 'Array',
            lookupKey: 'BizDoc2',
            bindingList: {
                DocInfo: 'DocInfo',
                ContractType: 'ContractType'
            },
            // displayMember: 'DocInfo',
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
            lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        },
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
            header: 'Khối lượng hợp đồng',
            binding: 'Quantity_Hd',
            dataType: 'Number',
            width: 100,
            format: 'n3'
            // exprReadOnly: '1==1'
        },
        {
            header: 'Khối lượng thi công',
            binding: 'Quantity9',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 100,
            format: 'n3'
        },
        {
            header: 'Đơn giá VNĐ',
            binding: 'OriginalUnitCost',
            dataType: 'Number',
            width: 150,
            format: 'n2',
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''"
        },
        {
            header: 'Thành tiền VNĐ',
            binding: 'OriginalAmount',
            width: 150,
            dataType: 'Number',
            //exprFormat: "'{EXPR=CurrencyCode}' == 'VND' ? 'n0' : 'n2'"
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''",
            isReadOnly: 'true'
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
            isReadOnly: 'true',
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''"
            //exprFormat: "'{EXPR=CurrencyCode}' == 'VND' ? 'n0' : 'n2'"
        },
        {
            header: 'Loại thuế',
            binding: 'TaxCode',
            width: 60,
            dataType: 'Array',
            lookupKey: 'Tax',
       
            lookupfilter: "Type=1 AND IsActive=1 AND IsGroup=0 AND IsDefault = 1",
        },
        {
            header: 'Đơn giá VT (chưa VAT)',
            binding: 'UnitCostVT',
            dataType: 'Number',
            width: 100,
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''"
        },
        {
            header: 'Đơn giá NC (chưa VAT)',
            binding: 'UnitCostNC',
            dataType: 'Number',
            width: 100,
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''"
        },
      
        {
            header: 'Mã khấu trừ',
            binding: 'Ma_KhauTru',
            dataType: 'Array',
            lookupKey: 'DmKhauTru',
            lookupfilter: 'IsActive=1',
            width: 100
        },
        {
            header: 'Ghi chú',
            binding: 'Remark',
            allowEditing: true,
            width: 200
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
            width: 300
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
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: 'Tên QLKL',
            binding: 'TenQLKL',
            width: 250,
            isReadOnly: 'true'
        },
         {
            header: 'Khối lượng trước',
            binding: 'RequestQuantity',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 0,
            format: 'n3'
        },
        {
            header: 'Đơn giá trước',
            binding: 'ChartUnitCost',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 0,
            format: 'n2'
        },
         {
            header: 'Giá trị trước',
            binding: 'AmountAcumPrePeriod',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 0,
            format: 'n2'
        },
        {
            header: 'Ghi chú',
            binding: 'RemarkCCM',
            allowEditing: true,
            width: 0
        },
         {
            header: '% thực hiện',
            binding: 'Rate1',
            dataType: 'Number',
            width: 0,
            min: 0,
            max: 1,
            format: 'p2'
        },
    ];

    childColumns3 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 100
        },
        {
            header: 'Hạng mục QLKL',
            binding: 'Ma_QLKL',
            dataType: 'Array',
            lookupKey: 'PlanQuantityHM',
            lookupfilter: "ProductCostId='{VAR=Filter.ProductCostId}'",
            width: 130,
            // hidden: "'{EXPR=PayTeamType}'=='01'"
        },
      
        {
            header: 'Mã Quản lý KL',
            binding: 'PartNo',
            dataType: 'Array',
            lookupKey: 'DmQLKL',
            lookupfilter: 'IsActive=1',
            width: 100
        },
          {
            header: 'Đội (+/-)',
            binding: 'CustomerCode',
            dataType: 'Array',
            lookupKey: 'Customer',
            lookupfilter: "IsGroup=0 AND IsActive=1",
            width: 100
        },
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
            header: 'Khối lượng hợp đồng',
            binding: 'Quantity_Hd',
            dataType: 'Number',
            width: 100,
            format: 'n3'
            // exprReadOnly: '1==1'
        },
        {
            header: 'Khối lượng thi công',
            binding: 'Quantity9',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 100,
            format: 'n3'
        },
        {
            header: 'Đơn giá VNĐ',
            binding: 'OriginalUnitCost',
            dataType: 'Number',
            width: 150,
            format: 'n2',
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''"
        },
        {
            header: 'Thành tiền VNĐ',
            binding: 'OriginalAmount',
            width: 150,
            dataType: 'Number',
            //exprFormat: "'{EXPR=CurrencyCode}' == 'VND' ? 'n0' : 'n2'"
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''",
            isReadOnly: 'true'
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
            isReadOnly: 'true',
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''"
            //exprFormat: "'{EXPR=CurrencyCode}' == 'VND' ? 'n0' : 'n2'"
        },
        {
            header: 'Loại thuế',
            binding: 'TaxCode',
            width: 60,
            dataType: 'Array',
            lookupKey: 'Tax',
       
            lookupfilter: "Type=1 AND IsActive=1 AND IsGroup=0 AND IsDefault = 1",
        },
        {
            header: 'Đơn giá VT (chưa VAT)',
            binding: 'UnitCostVT',
            dataType: 'Number',
            width: 100,
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''"
        },
        {
            header: 'Đơn giá NC (chưa VAT)',
            binding: 'UnitCostNC',
            dataType: 'Number',
            width: 100,
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''"
        },
      
        {
            header: 'Mã khấu trừ',
            binding: 'Ma_KhauTru',
            dataType: 'Array',
            lookupKey: 'DmKhauTru',
            lookupfilter: 'IsActive=1',
            width: 100
        },
        {
            header: 'Ghi chú',
            binding: 'Remark',
            allowEditing: true,
            width: 200
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
            width: 300
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
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: 'Tên QLKL',
            binding: 'TenQLKL',
            width: 250,
            isReadOnly: 'true'
        },
         {
            header: 'Khối lượng trước',
            binding: 'RequestQuantity',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 0,
            format: 'n3'
        },
        {
            header: 'Đơn giá trước',
            binding: 'ChartUnitCost',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 0,
            format: 'n2'
        },
         {
            header: 'Giá trị trước',
            binding: 'AmountAcumPrePeriod',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 0,
            format: 'n2'
        },
        {
            header: 'Ghi chú',
            binding: 'RemarkCCM',
            allowEditing: true,
            width: 0
        },
         {
            header: '% thực hiện',
            binding: 'Rate1',
            dataType: 'Number',
            width: 0,
            min: 0,
            max: 1,
            format: 'p2'
        },
    ];

    childColumns4 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 100
        },
        {
            header: 'Hạng mục QLKL',
            binding: 'Ma_QLKL',
            dataType: 'Array',
            lookupKey: 'PlanQuantityHM',
            lookupfilter: "ProductCostId='{VAR=Filter.ProductCostId}'",
            width: 130,
            // hidden: "'{EXPR=PayTeamType}'=='01'"
        },
      
        {
            header: 'Mã Quản lý KL',
            binding: 'PartNo',
            dataType: 'Array',
            lookupKey: 'DmQLKL',
            lookupfilter: 'IsActive=1',
            width: 100
        },
          {
            header: 'Đội (+/-)',
            binding: 'CustomerCode',
            dataType: 'Array',
            lookupKey: 'Customer',
            lookupfilter: "IsGroup=0 AND IsActive=1",
            width: 100
        },
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
            header: 'Khối lượng hợp đồng',
            binding: 'Quantity_Hd',
            dataType: 'Number',
            width: 100,
            format: 'n3'
            // exprReadOnly: '1==1'
        },
        {
            header: 'Khối lượng thi công',
            binding: 'Quantity9',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 100,
            format: 'n3'
        },
        {
            header: 'Đơn giá VNĐ',
            binding: 'OriginalUnitCost',
            dataType: 'Number',
            width: 150,
            format: 'n2',
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''"
        },
        {
            header: 'Thành tiền VNĐ',
            binding: 'OriginalAmount',
            width: 150,
            dataType: 'Number',
            //exprFormat: "'{EXPR=CurrencyCode}' == 'VND' ? 'n0' : 'n2'"
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''",
            isReadOnly: 'true'
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
            isReadOnly: 'true',
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''"
            //exprFormat: "'{EXPR=CurrencyCode}' == 'VND' ? 'n0' : 'n2'"
        },
        {
            header: 'Loại thuế',
            binding: 'TaxCode',
            width: 60,
            dataType: 'Array',
            lookupKey: 'Tax',
       
            lookupfilter: "Type=1 AND IsActive=1 AND IsGroup=0 AND IsDefault = 1",
        },
        {
            header: 'Đơn giá VT (chưa VAT)',
            binding: 'UnitCostVT',
            dataType: 'Number',
            width: 100,
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''"
        },
        {
            header: 'Đơn giá NC (chưa VAT)',
            binding: 'UnitCostNC',
            dataType: 'Number',
            width: 100,
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''"
        },
      
        {
            header: 'Mã khấu trừ',
            binding: 'Ma_KhauTru',
            dataType: 'Array',
            lookupKey: 'DmKhauTru',
            lookupfilter: 'IsActive=1',
            width: 100
        },
        {
            header: 'Ghi chú',
            binding: 'Remark',
            allowEditing: true,
            width: 200
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
            width: 300
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
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: 'Tên QLKL',
            binding: 'TenQLKL',
            width: 250,
            isReadOnly: 'true'
        },
         {
            header: 'Khối lượng trước',
            binding: 'RequestQuantity',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 0,
            format: 'n3'
        },
        {
            header: 'Đơn giá trước',
            binding: 'ChartUnitCost',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 0,
            format: 'n2'
        },
         {
            header: 'Giá trị trước',
            binding: 'AmountAcumPrePeriod',
            dataType: 'Number',
            // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
            // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
            // ignoreError: 1,
            width: 0,
            format: 'n2'
        },
        {
            header: 'Ghi chú',
            binding: 'RemarkCCM',
            allowEditing: true,
            width: 0
        },
         {
            header: '% thực hiện',
            binding: 'Rate1',
            dataType: 'Number',
            width: 0,
            min: 0,
            max: 1,
            format: 'p2'
        },
    ]
}