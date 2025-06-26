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

// Bill thanh toán thuê thiết bị
export class LayoutBillEquipment_ViewExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocCCM_Explore',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode='B5' AND IsActive=1  AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'ProductName,CustomerName,DocNo DESC',
                RowPage: 50
            }
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

export class LayoutBillEquipment_ViewEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) {

    }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocCCM_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'B5',
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
                        PayNumber: 1
                        //TaxCode: 'Parent.TaxCode',
                        //ProductCostId: 'Parent.ProductCostId'
                    }
                },
                {
                    Name: 'vB30BizDocCCMMedial_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1'
                    }
                }
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Bảng KLTT thuê, mua hàng tập trung- {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng KLTT thuê, mua hàng",
                    FileName: "Bảng KLTT thuê, mua hàng - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "11.Bang_KLTT_Thue_Mua_Hang.docx",
                    ExcelName: "11.Bang_KLTT_Thue_Mua_Hang.xlsx",
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
            Value: "OriginalAmount",
            Tables: 0
        },
        // 'Evaluator_Amount_ThiCong_AddVAT': {
        //     EvaluatorName: 'EvaluatorCaculate',
        //     DataMember: "Amount_ThiCong",
        //     Value: "Math.round(Amount_ThiCongNotVAT+(TaxRate*Amount_ThiCongNotVAT))"
        // },
        // 'Evaluator_Amount_THDenKyNay_AddVAT': {
        //     EvaluatorName: 'EvaluatorCaculate',
        //     DataMember: "Amount_THDenKyNay",
        //     Value: "Math.round(Amount_THDenKyNayNotVAT+(TaxRate*Amount_THDenKyNayNotVAT))"
        // },
        'Evaluator_Amount_TongTTDenKyNay_Calculate': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "Amount_TongTTDenKyNay",
            Value: "PaymentAmountAddVAT",
            Tables: 0
        },
        'Evaluator_Amount_DeNghiTT_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_DeNghiTT",
            Value: "Amount_TongTTDenKyNay+Amount_TTKyTruoc"
        },
        'Evaluator_Amount_HoanUng_SumChild': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "Amount_HoanTra",
            Value: "Amount_HoanUng",
            Tables: 0
        },
        'Evaluator_Amount_Tam_Ung_SumChild': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "Amount_TamUng",
            Value: "Amount_Tam_Ung",
            Tables: 0
        },
        'Evaluator_Amount_ThiCong_AddVAT_SumChild' : {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "Amount_ThiCong",
            Value: "Amount_Th",
            Tables: 0
        },
        'Evaluator_Amount_THDenKyNay_AddVAT_SumChild': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "Amount_THDenKyNay",
            Value: "Amount_Th",
            Tables: 0
        },
        //child
        'Evaluator_BizDocDetail_OriginalAmount': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount",
            Value: "Math.round(Quantity9*OriginalUnitCost*NumberDayLease)",
            Tables: 0
        },
        'Evaluator_Amount_Th_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_Th",
            Value: "Math.round(OriginalAmount * TaxRate) + OriginalAmount",
            Tables: 0
        },
        'Evaluator_PaymentAmount_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "PaymentAmount",
            Value: "Math.round((OriginalAmount + OriginalAmount1) * Percent_Th)",
            Tables: 0
        },
        'Evaluator_OriginalAmount3_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount3",
            Value: "Math.round(PaymentAmount * TaxRate)",
            Tables: 0
        },
        'Evaluator_PaymentAmountAddVAT_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "PaymentAmountAddVAT",
            Value: "PaymentAmount + OriginalAmount3 + Amount_Tam_Ung + Amount_HoanUng",
            Tables: 0
        },
        'Evaluator_TaxCode_BindingFromParent': {
            EvaluatorName: 'EvaluatorBindingChildAll',
            DataMember: 'TaxCode',
            Value: 'TaxCode',
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
        'Evaluator_ServerConstraint_Load_Previous': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ParentBizDocId,BizDocId,DocDate,CustomerCode,ProductCostId,{VAR=Branch.Ma_Dvcs},IdNhapHang_List,DocCode',
            Command: 'usp_TMCtc_GetPurchaseDataForBill',
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_Load_NhapHang': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},IdNhapHang_List,DocCode',
            Command: 'usp_TMCtc_GetData_BizDocCCMMedial',
            OutputTable: 1
        },
        // //server constrain with xml
        // 'Evaluator_ServerConstraint_MergeKLTT': {
        //     EvaluatorName: 'EvaluatorQueryXmlLoadChild',
        //     ConstraintKey: 'BranchCode',
        //     ParameterXmlName: 'B30BizDocDetailPP',
        //     Tables: 0,
        //     Command: 'usp_TMCtc_LoadReceiptTeamCode',
        //     zExpr: "ReceiptTeamCode != ''",
        //     OutputTable: 1
        // },
        'Evaluator_ServerConstraint_Amount_HDPL': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "ParentBizDocId,{VAR=Branch.Ma_Dvcs},{VAR=LoaiC34}",
            Command: 'ufn_Coteccons_GetValueContract_SubContract',
            DataMember: 'Amount_HDPL'
        },
        'Evaluator_ServerConstraint_Get_PercentTemp': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ParentBizDocId',
            Command: 'usp_Coteccons_GetPercentFromC3C4',
            DataMember: 'TaxCode,TaxRate,Percent_Th,Percent_TtVt,Percent_HUng,Amount_TamUng,CustomerCode,CurrencyCode'
        },
        'Evaluator_ServerConstraint_Amount_TTKyTruoc': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,ProductCostId,ParentBizDocId,{VAR=Branch.Ma_Dvcs},DocCode,DocDate,CustomerCode',
            Command: 'usp_Coteccons_Bill_TongGiaTriThanhToanDenCacKyTruoc',
            DataMember: 'Amount_TTKyTruoc',
            zExpr: "ProductCostId != '' && ParentBizDocId != '' && CustomerCode != ''"
        },
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'BizDocId,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Conteccons_NotChangeWhenApproveSent_Bill',
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
        }
    }

    serverConstraint = [
        'Evaluator_ServerConstraint_Amount_TTKyTruoc',
        'Evaluator_ServerConstraint_Check_ImportedExcel',
        'Evaluator_ServerConstraint_Amount_HDPL'
    ]

    serverUpdating = [
        'Evaluator_ServerConstraint_CheckUniqueDocNo',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_UserModified',
        //
        'Evaluator_Amount_ThiCong_Calculate',
        'Evaluator_Amount_THDenKyNay_Calculate',
        'Evaluator_Amount_HoanUng_SumChild',
        'Evaluator_Amount_Tam_Ung_SumChild',
        'Evaluator_Amount_TongTTDenKyNay_Calculate',
        'Evaluator_Amount_ThiCong_AddVAT_SumChild',
        'Evaluator_Amount_THDenKyNay_AddVAT_SumChild'
    ]

    serverUpdated: string[] = [
        'Evaluator_ServerUpdated_BuiltinOrder',
        'Evaluator_ServerUpdated_CreateFormula_BizDocCCMDetail',
        'Evaluator_ServerUpdated_BizDocCCMDetail_UpdateFromParent'
    ]

    buttonLoadChild = [
        'Evaluator_ServerConstraint_CheckUniqueDocNo',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_UserModified',
        'Evaluator_ServerConstraint_Amount_TTKyTruoc',
        'Evaluator_ServerConstraint_Load_Previous',
        'Evaluator_ServerConstraint_Load_NhapHang'
    ]

    buttonCommand: string[] = [
        'Evaluator_Amount_ThiCong_Calculate',
        'Evaluator_Amount_THDenKyNay_Calculate',
        'Evaluator_Amount_HoanUng_SumChild',
        'Evaluator_Amount_Tam_Ung_SumChild',
        'Evaluator_Amount_TongTTDenKyNay_Calculate',
        'Evaluator_Amount_ThiCong_AddVAT_SumChild',
        'Evaluator_Amount_THDenKyNay_AddVAT_SumChild'
    ]

    importCommand: string[] = [
        'Evaluator_Amount_ThiCong_Calculate',
        'Evaluator_Amount_THDenKyNay_Calculate',
        'Evaluator_Amount_HoanUng_SumChild',
        'Evaluator_Amount_Tam_Ung_SumChild',
        'Evaluator_Amount_TongTTDenKyNay_Calculate',
        'Evaluator_Amount_ThiCong_AddVAT_SumChild',
        'Evaluator_Amount_THDenKyNay_AddVAT_SumChild'
    ]

    columnChanged = {
        ParentBizDocId: {
            Evaluators: [
                'Evaluator_ServerConstraint_Get_PercentTemp'
            ]
        },
        // Amount_ThiCongNotVAT: {
        //     Evaluators: [
        //         'Evaluator_Amount_ThiCong_AddVAT'
        //     ]
        // },
        // Amount_THDenKyNayNotVAT: {
        //     Evaluators: [
        //         'Evaluator_Amount_THDenKyNay_AddVAT'
        //     ]
        // },
        // TaxCode: {
        //     Evaluators: [
        //         'Evaluator_TaxCode_BindingFromParent'
        //     ]
        // },
        Amount_TongTTDenKyNay: {
            Evaluators: [
                'Evaluator_Amount_DeNghiTT_Calculate'
            ]
        },
        Amount_TTKyTruoc: {
            Evaluators: [
                'Evaluator_Amount_DeNghiTT_Calculate'
            ]
        }    
    };

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
                NumberDayLease: {
                    Evaluators: [
                        'Evaluator_BizDocDetail_OriginalAmount'
                    ]
                },
                Quantity9: {
                    Evaluators: [
                        'Evaluator_BizDocDetail_OriginalAmount'
                    ]
                },
                OriginalUnitCost: {
                    Evaluators: [
                        'Evaluator_BizDocDetail_OriginalAmount'
                    ]
                },
                OriginalAmount: {
                    Evaluators: [
                        'Evaluator_Amount_Th_Calculator',
                        'Evaluator_PaymentAmount_Calculator',
                        'Evaluator_Amount_ThiCong_Calculate',
                        'Evaluator_Amount_THDenKyNay_Calculate'
                    ]
                },
                OriginalAmount1: {
                    Evaluators: [
                        'Evaluator_PaymentAmount_Calculator'
                    ]
                },
                Percent_Th: {
                    Evaluators: [
                        'Evaluator_PaymentAmount_Calculator'
                    ]
                },
                Amount_Th: {
                    Evaluators: [
                        'Evaluator_Amount_ThiCong_AddVAT_SumChild',
                        'Evaluator_Amount_THDenKyNay_AddVAT_SumChild'
                    ]
                },
                PaymentAmount: {
                    Evaluators: [
                        'Evaluator_OriginalAmount3_Calculator'
                    ]                    
                }, 
                TaxCode: {
                    Evaluators: [
                        'Evaluator_OriginalAmount3_Calculator',
                        'Evaluator_Amount_Th_Calculator'
                    ]
                },
                OriginalAmount3: {
                    Evaluators: [
                        'Evaluator_PaymentAmountAddVAT_Calculator'
                    ]
                },
                Amount_HoanUng: {
                    Evaluators: [
                        'Evaluator_PaymentAmountAddVAT_Calculator',
                        'Evaluator_Amount_HoanUng_SumChild'
                    ]                    
                },
                Amount_Tam_Ung: {
                    Evaluators: [
                        'Evaluator_PaymentAmountAddVAT_Calculator',
                        'Evaluator_Amount_Tam_Ung_SumChild'
                    ]                    
                },
                PaymentAmountAddVAT: {
                    Evaluators: [
                        'Evaluator_Amount_TongTTDenKyNay_Calculate'
                    ]
                }               
            }
        }
    ];

    rowAdded = [
        {
            Tables: 0,
            Evaluators: [

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
                    label: 'Số thanh toán',
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
                    //lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1, 3) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
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
                    validators: [Validators.required],
                    lookupfilter: "(((DocCode = 'C3' OR (DocCode = 'C4' AND IsSubContractPay = 1)) AND ProductCostId='{VAR=Filter.ProductCostId}') OR (DocCode='C3' AND IsSubContractPay = 1) OR (DocCode='C3' AND ContractType IN ('HD-08','HD-14'))) AND Closed = 0 AND CompletedApprove=1 AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ContractTypeFilter='B4'",
                    //lookupfilter: "DocCode IN ('C3','C4') AND CompletedApprove=1 AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId='{EXPR=ProductCostId}' AND ContractTypeFilter='B4'",
                    hideValueMember: true,
                    binding: {
                        TaxCode: 'TaxCode',
                        TiLe_ThanhToan: 'Percent_Th',
                        Tile_TtVt: 'Percent_TtVt',
                        TiLe_TamUng: 'Percent_TUng',
                        TiLe_HoanUng: 'Percent_HUng',
                        CustomerCode: 'CustomerCode',
                        CurrencyCode: 'CurrencyCode'
                    },
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Đối tác',
                    lookupKey: 'Customer_CCM2',
                    validators: [Validators.required],
                    lookupfilter: "(('{EXPR=ProductType}'=3 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%') OR Code IN (SELECT A.CustomerCode FROM B30CCMBudgetDetail A INNER JOIN B30CCMBudget B ON A.CCMBudgetId = B.CCMBudgetId WHERE (A.CompletedApproveDetail=1 AND A.Loai_Dt IN ('NTP','NCC')) AND B.CompletedApprove=1 AND B.IsActive=1 AND B.DocCode='K1' AND B.ProductCostId ='{EXPR=ProductCostId}' GROUP BY A.CustomerCode))",
                    hideValueMember: false,
                    binding: {
                        Name: 'Person',
                        Address: 'Address'
                    },
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'JobCode',
                    label: 'Công việc',
                    lookupKey: 'Job_CCM',
                    hideValueMember: false,
                    labelCol: 6,
                    validators: [Validators.required],
                    col: 6,
                    isDisabled: 'true',
                }, this.srv),                
                // new NumberBoxInput({
                //     key: 'Percent_Th',
                //     label: '% thanh toán',
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
                    isDisabled: 'true',
                    labelCol: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_THDenKyNayNotVAT',
                    label: 'Tổng GTTH đến kỳ này (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    labelCol: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_THDenKyNay',
                    label: 'Tổng GTTH đến kỳ này (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    labelCol: 6
                }),   
                new NumberBoxInput({
                    key: 'Amount_TamUng',
                    label: 'Giá trị tạm ứng',
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
                    key: 'Amount_HoanTra',
                    label: 'Giá trị hoàn trả tạm ứng',
                    col: 6,
                    isDisabled: 'true',
                    labelCol: 6
                }),                             
                // new NumberBoxInput({
                //     key: 'Amount_TTKyNay',
                //     label: 'GT thanh toán đến kỳ này (gồm VAT)',
                //     type: 'number',
                //     col: 6,
                //     isDisabled: 'true',
                //     labelCol: 6
                // }),
                new NumberBoxInput({
                    key: 'Amount_TTKyTruoc',
                    label: 'Tổng GTTT đến kỳ trước (gồm VAT)',
                    type: 'number',
                    col: 6,
                    labelCol: 6,
                    isDisabled: "'{EXPR=CountImport}' == 'true'"
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
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'Amount_DeNghiTT',
                    label: 'Giá trị đề nghị thanh toán (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    labelCol: 6
                }),
                new LookupBoxInput({
                    key: 'CurrencyCode',
                    label: 'Mã tiền tệ',
                    lookupKey: 'Currency',
                    lookupfilter: "IsActive=1 AND IsGroup=0",
                    hideValueMember: false,
                    col: 6,
                    labelCol: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'PayRequireNum',
                    label: 'Yêu cầu thanh toán số',
                    dataType: 'text',
                    mask: '000',
                    col: 6,
                    labelCol: 6,
                    isDisabled: 'true'
                }),
                new MultiSelectInput({
                    key: 'IdNhapHang_List',
                    label: 'Phiếu nhập mua hàng',
                    lookupKey: 'AccDoc_NH',
                    hideValueMember: true,
                    lookupfilter: "CustomerCode='{EXPR=CustomerCode}' AND JobCode = '{EXPR=JobCode}' AND SuppInvoiceCode <> '' AND DocStatus = 4",
                    col: 12,
                    labelCol: 6,
                    isDisabled: 'true',
                }, this.srv)
            ]
        })
    ];

    childColumns = [
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
        {
            header: 'Tên gói thầu',
            binding: 'ProductCostInfo',
            width: 250
        },
        {
            header: 'Đợt t. toán',
            binding: 'PayNumber',
            width: 80
        },        
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 70
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
            header: 'Số ngày thuê',
            binding: 'NumberDayLease',
            dataType: 'Number',
            width: 100,
            format: 'n0'
        },
        {
            header: 'Khối lượng hợp đồng',
            binding: 'Quantity_Hd',
            dataType: 'Number',
            width: 100,
            format: 'n3',
            isReadOnly: 'true',
        },
        {
            header: 'Khối lượng thi công',
            binding: 'Quantity9',
            dataType: 'Number',
            width: 100,
            format: 'n3'
        },
        {
            header: 'Đơn giá',
            binding: 'OriginalUnitCost',
            dataType: 'Number',
            width: 100,
            format: 'n2'
        },
        {
            header: 'Thành tiền 1',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 150,
            format: 'n0'
        },
        {
            header: 'Thành tiền 2',
            binding: 'OriginalAmount1',
            dataType: 'Number',
            width: 150,
            format: 'n0'
        },
        {
            header: 'Giá trị thi công, thực hiện (gồm VAT)',
            binding: 'Amount_Th',
            dataType: 'Number',
            width: 150,
            format: 'n0'
        },
        {
            header: '% thanh toán',
            binding: 'Percent_Th',
            dataType: 'Number',
            width: 100,
            format: 'p2'
        },
        {
            header: 'Giá trị thanh toán (chưa VAT)',
            binding: 'PaymentAmount',
            dataType: 'Number',
            width: 150,
            format: 'n0',
            isReadOnly: 'true'
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
            header: '% VAT',
            binding: 'TaxRate',
            width: 0
        },
        {
            header: 'Tiền thuế',
            binding: 'OriginalAmount3',
            dataType: 'Number',
            width: 120
        },   
        {
            header: 'Giá trị tạm ứng',
            binding: 'Amount_Tam_Ung',
            dataType: 'Number',
            width: 120,
            format: 'n0'
        },
        {
            header: 'Giá trị hoàn ứng',
            binding: 'Amount_HoanUng',
            dataType: 'Number',
            width: 120,
            format: 'n0'
        },
        {
            header: 'Giá trị thanh toán các đợt (gồm VAT)',
            binding: 'PaymentAmountAddVAT',
            dataType: 'Number',
            width: 150,
            format: 'n0'
        }, 
        {
            header: 'Loại thiết bị',
            binding: 'EquipTypeCode',
            width: 120,
            dataType: 'Array',
            lookupKey: 'EquityType12',
            bindingList: {
            },
            lookupfilter: "IsActive=1 AND IsGroup=0",
        },    
        {
            header: 'Loại chi phí thiết bị',
            binding: 'EquipCostTypeCode',
            width: 200,
            dataType: 'Array',
            lookupKey: 'EquipCostType',
            bindingList: {
            },
            multiSelection: true,
            lookupfilter: "IsActive=1 AND IsGroup=0",
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
            header: 'Level',
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
            header: 'Dòng kế thừa',
            binding: 'InheritanceRowIdPL',
            width: 0,
            isReadOnly: 'true'
        }
    ];

    childColumns1 = [
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
            width: 0
        },
        {
            header: 'Tên gói thầu',
            binding: 'ProductCostInfo',
            width: 250
        },         
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 80
        },   
        {
            header: 'TT dòng',
            binding: 'ItemNo1',
            width: 80
        },      
        {
            header: 'Diễn giải',
            binding: 'Description',
            allowEditing: false,
            width: 300
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 50
        },   
        {
            header: 'Khối lượng',
            binding: 'Quantity9',
            dataType: 'Number',
            width: 100,
            format: 'n3'
        },
        {
            header: 'Đơn giá',
            binding: 'OriginalUnitCost',
            dataType: 'Number',
            width: 100,
            format: 'n2'
        },
        {
            header: 'Thành tiền',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 150,
            format: 'n0'
        },
        {
            header: '_IdApprove_PO',
            binding: 'IdApprove_PO',
            width: 0,
            isReadOnly: 'true'
        }, 
        {
            header: 'Số hóa đơn',
            binding: 'SuppInvoiceCode',
            width: 0,
            isReadOnly: 'true'
        }, 
        {
            header: 'Đợt t. toán',
            binding: 'PayNumber',
            width: 0,
            isReadOnly: 'true'
        }
    ];
}