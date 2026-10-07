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

// Phê duyệt quyết toán
export class LayoutApprovedSettlementExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_Explorer',
                FilterKey: "ApproveSend = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'C5' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'ProductName,BizDocId,ApproveGroup',
                RowPage: 50
            }
        }
    }

    parentGrid = [
        {
            header: 'STT duyệt',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
        },
        {
            header: 'Bộ phận',
            binding: 'DeptName',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Người đã thực hiện',
            binding: 'EmployeeNameApprove',
            width: 150
        },
        {
            header: 'Số ngày thực hiện',
            binding: 'NumberOfDays',
            width: 150,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Duyệt',
            binding: 'ApproveStatus',
            width: 80,
            dataType: 'Boolean',
            textAlign: 'center'
        },
        {
            header: 'Ý kiến',
            binding: 'Comment',
            width: 200,
            dataType: 'String',
            isContentHtml: true
        },
        {
            header: 'HĐ/PLHĐ',
            binding: 'InfoBudget',
            width: 0,
            dataType: 'String'
        },
        {
            header: 'Gói thầu/ PB',
            binding: 'ProductName',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Đối tác',
            binding: 'CustomerName',
            width: 300,
            dataType: 'String'
        }
    ]
}

export class LayoutApprovedSettlementEditor implements IEditorFormulaDeclaration {

   
    serverUpdated: string[];
     buttonCommand: string[] = [];
    constructor(private srv?: any,
        private parentData?: any) { }

    approveGrid = 0;

    evaluators = {
        // Thanh toán 3 bên của Bill quyết toán liên kết (không lưu):
        //   Tổng lấy từ tab 3 bên của Bill (BizDocId_PL); Còn lại = Số tiền phải TT đợt này - Tổng
        'Evaluator_ServerConstraint_Amount_TT3Ben': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId_PL',
            Command: 'usp_Newtecons_TT3Ben_GetAmount',
            DataMember: 'Amount_TT3Ben'
        },
        'Evaluator_Amount_ConLaiTT3Ben_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'Amount_ConLaiTT3Ben',
            Value: 'ValueOfPayPeriod - Amount_TT3Ben'
        },
        'Evaluator_ServerUpdating_UpdateStatusByApproveStatus': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,Id,ApproveStatus,{VAR=Branch.Ma_Dvcs},EmployeeCodeNext,DocCode,{VAR=User.Id},Comment,ApproveStatusWeb',
            Command: 'usp_Cotec_UpdateStatusByApproveStatus'
        },
        'Evaluator_ServerConstraint_Load_InvoiceBizzi': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,CustomerCode,BizDocId',
            Command: 'usp_CFMS_InvoiceBizzi_LoadData',
       
            OutputTable: 4
        }
    };
    buttonLoadChild: string[] = [
         'Evaluator_ServerConstraint_Load_InvoiceBizzi'
    ];
    serverConstraint = [
    ]

    serverUpdating = [

    ]

    columnChanged = {

    };

    columnsReadOnly = [];

    linkReporter = {
        'btnPhuLucA': {
            directory: 'billsettlement',
            type: 'detail',
            key: 'Id_TT',
            parameter: { 'Commandkey': 'billsettlement-editor', 'ProductCostId': '{EXPR=ProductCostId}', 'ParentBizDocId': '{EXPR=ParentBizDocId}', 'DocDate': '{EXPR=DocDate}', 'CustomerCode': '{EXPR=CustomerCode}', 'DocNo': '{EXPR=DocNo}' }
        },
        'btnHdPl': {
            directory: 'regcontract_viewCT',
            type: 'detail',
            command: "{EXPR=DocCode_HdPl} == 'C3' ? 'detailc3' : {EXPR=DocCode_HdPl} == 'C4' ? 'detailc4' : ''",
            key: 'Id_HdPl'
        },
        'btnBillKyTruoc': {
            directory: 'billpaysupp_view',
            type: 'detail',
            key: 'Id_BillKyTruoc'
        },
        'btnTaskId': {
            directory: 'partnerevaluation',
            type: 'detail',//bao cao: view, explorer: index, editor: detail
            key: 'Id_Task',
            parameter: { 'Commandkey': 'partnerevaluation-editor', 'ProductCostId': '{EXPR=ProductCostId}', 'DocDate': '{EXPR=DocDate}'}
        },
    }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_Edit',
                IsView: 'view',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'C5',
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    IsView: 'view',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'ApproveGroup'
                },
                {
                    Name: 'vB30BizDocDocument',
                    IsView: 'view',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder'
                },
                {
                    Name: 'vB30BizDocApprove_AEditContract',
                    IsView: 'view',
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
                    Name: 'vB30BizDoc_HDPLHDList',
                    IsView: 'view',
                    ParentKey: 'ParentBizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30BizDocContactInfo_Approved',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    // Thanh toán 3 bên của Bảng KLQT liên kết (grid5): chỉ xem, không lưu
                    Name: 'vB30BizDocCCMTripartite_Edit',
                    IsView: 'view',
                    ParentKey: 'BizDocId_PL',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder'
                }
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Bảng KLQT- {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocCCM_VoucherForm_TachBill',
            Command_TongHop: 'usp_CCM_BillSupp_TongHop_QT',
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
            ]
        }
    };

    panels: PanelBase[] = [
        new TablePanel({
            label: 'Panel 1',
            col: 12,
            controls: [
                new DateBoxInput({
                    key: 'DocDate',
                    label: 'Ngày',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số quyết toán',
                    type: 'text',
                    isReadOnly: 'true',
                    col: 6,
                    validators: [Validators.required],
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'PayTeamType',
                    label: 'Loại quyết toán',
                    lookupKey: 'Class',
                    lookupfilter: "ParentCode='PayTeamType' AND Code IN ('02','08')",
                    hideValueMember: false,
                    
                    col: 6,
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    lookupfilter: '',
                    //lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Hợp đồng/ PL',
                    validators: [Validators.required],
                    lookupKey: 'BizDoc_CTC',
                    lookupfilter: "(DocCode = 'C3' OR (DocCode = 'C4' AND  IsSubContractPay = 1)) AND CompletedApprove=1 AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId='{EXPR=ProductCostId}'",
                    hideValueMember: true,
                    binding: {
                        ContractType: 'ContractType',
                        CusBankAccountNo: 'CusBankAccountNo',
                        CusBankName: 'CusBankName',
                        CustomerCode: 'CustomerCode',
                        ContactPerson: 'ContactPerson',
                        Position: 'Position',
                        AuthorizeNo: 'AuthorizeNo',
                        AuthorizeDate: 'AuthorizeDate',
                        ContractValue: 'ContractValue',
                        CurrencyCode: 'CurrencyCode',
                        TaxCode: 'TaxCode',
                        TaxRate: 'TaxRate',
                        JobCode: 'JobCode',
                        ActivityCode: 'ActivityCode',
                        Id: 'Id_HdPl'
                    },
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Đối tác',
                    lookupKey: 'Customer_CCM2',
                    lookupfilter: "(('{EXPR=ProductType}'=3 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%') OR Code IN (SELECT A.CustomerCode FROM B30CCMBudgetDetail A INNER JOIN B30CCMBudget B ON A.CCMBudgetId = B.CCMBudgetId WHERE (A.CompletedApproveDetail=1 OR A.Loai_Dt = 'DTC') AND B.CompletedApprove=1 AND B.IsActive=1 AND B.DocCode='K1' AND B.ProductCostId ='{EXPR=ProductCostId}' GROUP BY A.CustomerCode))",
                    hideValueMember: false,
                    binding: {
                        Name: 'CustomerName',
                        Address: 'Address'
                    },
                    col: 12,
                    isReadOnly: 'true',
                    validators: [Validators.required],
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new MultiSelectInput({
                    key: 'ActivityCode',
                    label: 'Lĩnh vực',
                    lookupKey: 'Activity',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv),
                new LookupBoxInput({
                    key: 'ContractType',
                    label: 'Loại hợp đồng',
                    validators: [Validators.required],
                    lookupKey: 'ContractType',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    binding: {
                        ClassCode1: 'ClassCode1'
                    },
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),
                new MultiSelectInput({
                    key: 'JobCode',
                    label: 'Công việc',
                    lookupfilter: "'{EXPR=ActivityCode}'='' OR ActivityCode IN (SELECT Val FROM dbo.ufn_sys_SplitString('{EXPR=ActivityCode}',','))",
                    lookupKey: 'Job',
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv),
                new LookupBoxInput({
                    key: 'CusBankAccountNo',
                    label: 'Tài khoản',
                    lookupKey: 'CustomerBankAccount',
                    lookupfilter: "CustomerCode='{EXPR=CustomerCode}'",
                    hideValueMember: false,
                    binding: {
                        Description: 'CusBankName'
                    },
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Address',
                    label: 'Địa chỉ',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'CusBankName',
                    label: 'Ngân hàng',
                    type: 'text',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'ContactPerson',
                    label: 'Đại diện ký QT',
                    type: 'text',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'Position',
                    label: 'Chức vụ',
                    lookupKey: 'JobPositionCCM',
                    lookupfilter: 'IsActive=1 AND IsGroup=0',
                    hideValueMember: false,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'AuthorizeNo',
                    label: 'Ủy quyền số',
                    type: 'text',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new DateBoxInput({
                    key: 'AuthorizeDate',
                    label: 'Ngày UQ',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
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
                    key: 'ContractValue',
                    label: 'Giá trị HĐ (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
              
                new NumberBoxInput({
                    key: 'SubContractValue',
                    label: 'GT các PLHĐ (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'TotalOfValue',
                    label: 'Tổng số tiền thanh toán',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'AriseValue',
                    label: 'PS tăng/giảm (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'Amount_TamUng',
                    label: 'Tạm ứng',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_HoanTra',
                    label: 'Hoàn trả',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'ValueOfPay',
                    label: 'Trừ các đợt t.toán trước',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'ValueOfWork',
                    label: 'Giá trị QT (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'ValueOfWarranty',
                    label: 'Số tiền giữ lại bảo hành',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new LookupBoxInput({
                    key: 'TaxCode',
                    label: 'Thuế',
                    lookupKey: 'Tax',
                    binding: {
                        Rate: 'TaxRate'
                    },
                    lookupfilter: "Type=1 AND IsActive=1 AND IsGroup=0 AND IsDefault = 1",
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new CheckBoxInput({
                    key: 'Bao_Lanh_Bao_Hanh',
                    label: 'Bảo lãnh bảo hành',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'ValueOfWorkAddVAT',
                    label: 'Giá trị QT (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'ValueOfGuarantee',
                    label: 'Giá trị bảo lãnh',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new DateBoxInput({
                    key: 'FromDate',
                    label: 'Ngày bắt đầu bảo hành',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'Amount_KhauTru',
                    label: 'Khấu trừ khác (Tiền phạt, tiện ích ...)',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6
                }),
             
                new NumberBoxInput({
                    key: 'DayOfWarranty',
                    label: 'Thời hạn bảo hành(tháng)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'ValueOfPayPeriod',
                    label: 'Số tiền phải TT đợt này',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6
                }),
                // Thanh toán 3 bên: không lưu, lấy từ tab "Thanh toán 3 bên" của Bảng KLQT
                new NumberBoxInput({
                    key: 'Amount_TT3Ben',
                    label: 'Tổng giá trị thanh toán 3 bên',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_ConLaiTT3Ben',
                    label: 'Số tiền còn lại',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'EndDate',
                    label: 'Ngày kết thúc bảo hành',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    isUsingLabel: false,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new ButtonInput({
                    key: 'btnPhuLucA',
                    label: 'Bảng khối lượng quyết toán',
                    col: 6,
                   isNewRow: true
                }),
                new LookupBoxInput({
                    key: 'BizDocId_PL',
                    label: 'Bảng KLQT',
                    lookupKey: 'BizDocCCM',
                    hideValueMember: true,
                    binding: {
                        Amount_TongTTDenKyNay: 'TotalOfValue',
                        Amount_TTKyTruoc: 'ValueOfPay',
                        Amount_DeNghiTT: 'ValueOfPayPeriod',
                        Amount_BaoHanh: 'ValueOfWarranty',
                        Amount_THDenKyNayNotVAT: 'ValueOfWork',
                        Amount_THDenKyNay: 'ValueOfWorkAddVAT',
                        Id: 'Id_TT'
                    },
                    lookupfilter: '',
                    //lookupfilter: "DocCode LIKE 'B%' AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}' AND BizDocId NOT IN (SELECT BizDocId_PL FROM B30BizDoc WHERE IsActive=1 AND BizDocId_PL <> '' AND BizDocId <> '{EXPR=BizDocId}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}' UNION SELECT BizDocId_TT FROM B30BizDocCCM WHERE IsActive=1 AND BizDocId_TT <> '' AND BizDocId <> '{EXPR=BizDocId}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}')",
                    //lookupfilter: "DocCode = 'QT' AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}' AND BizDocId NOT IN (SELECT BizDocId_PL FROM B30BizDoc WHERE IsActive=1 AND BizDocId_PL <> '' AND BizDocId <> '{EXPR=BizDocId}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}')",
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new ButtonInput({
                    key: 'btnHdPl',
                    label: 'Xem hợp đồng',
                    style: 'background-color:#9cc09c;',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: '',
                    //lookupfilter: "ParentId=10 AND Code IN (SELECT Code FROM dbo.ufn_Coteccons_Filter_ProcessCodeByBizDocC3('{EXPR=ParentBizDocId}','{EXPR=DocCode}'))",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new ButtonInput({
                    key: 'btnTaskId',
                    label: 'Xem đánh giá cuối dự án',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'TaskId',
                    label: 'Đánh giá cuối dự án',
                    lookupKey: 'BizDocVB',
                    lookupfilter: "IsActive=1 AND CompletedApprove=1 AND ProductCostId0='{EXPR=ProductCostId}' AND DocCode = 'O1' AND ParentBizDocId='{EXPR=ParentBizDocId}' AND ClassCode1='3'",
                    hideValueMember: false,
                    binding: {
                        Id: 'Id_Task'
                    },
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                    col: 6
                }, this.srv, this.parentData),  
                new NumberBoxInput({
                    key: 'NumberOfDays',
                    label: 'Số ngày thực hiện',
                    type: 'number',
                    dataType: 'n0',
                    col: 6,
                    isDisabled: 'true'
                }),
                new LookupBoxInput({
                    key: 'DeptCode',
                    label: 'Bộ phận',
                    lookupKey: 'Dept',
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'PositionCode',
                    label: 'Cấp bậc duyệt',
                    lookupKey: 'Position',
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCode',
                    label: 'Người duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new ButtonInput({
                    key: 'btnBillKyTruoc',
                    label: 'Xem bill kỳ trước',
                    style: 'background-color:#9cc09c;',
                    col: 6
                }),
                new RichTextBoxInput({
                    key: 'Comment',
                    label: 'Ý kiến',
                    col: 12
                }),
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'File QT đính kèm',
                //     col: 6,
                //     isOnlyDownload: true,
                //     folderId: '{EXPR=IdBizDoc}'
                // }, this.srv),
            ]
        })
    ];

    childColumns = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
        },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 250
        },
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

    childColumns1 = [
        {
            header: 'Mã tài liệu',
            binding: 'DocumentCode',
            width: 80,
            isReadOnly: 'true',
        },
        {
            header: 'Tên tài liệu',
            binding: 'DocumentName',
            width: 250,
            isReadOnly: 'true',
        },
        {
            header: 'Yêu cầu đính kèm',
            binding: 'Attached',
            dataType: 'Boolean',
            width: 60,
            isReadOnly: 'true',
        },
        {
            header: 'Ghi chú',
            binding: 'Description',
            width: 250,
            isReadOnly: 'true',
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 600,
            dataType: 'Object',
            allowRemove: false,
            allowView: true,
            allowDownLoad: true,
            allowUpload: false,
            folderId: '{EXPR=IdBizDoc}'
        }
    ];

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
    ]  ;
    childColumns3 = [
        {
            header: 'Loại hồ sơ',
            binding: 'DocuName',
            width: 120
        },
        {
            header: 'Ngày hiệu lực',
            binding: 'EffectiveDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy HH:mm',
            width: 150
        },
        {
            header: 'Số hồ sơ',
            binding: 'DocNo',
            width: 250
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            width: 400
        },
        {
            header: 'Giá trị (chưa VAT)',
            binding: 'SubContractValue',
            width: 150,
            dataType: 'Number'
        },
        {
            header: 'Giá trị (gồm VAT)',
            binding: 'SubContractValueAddVAT',
            width: 150,
            dataType: 'Number'
        },
        {
            header: 'Id',
            binding: 'Id',
            width: 0,
            dataType: 'Number'
        }
    ]

    childColumns4 = [
          {
            header: 'Chọn hóa đơn',
            binding: 'IsSelected',
            dataType: 'Boolean',
            width: 80
        },
           {
            header: 'Ngày nhận hóa đơn',
            binding: 'ReceivedAt',
            width: 150,
            dataType: 'Date',
            isReadOnly: 'true',
            format: 'dd/MM/yyyy'
        },
         {
            header: 'Ngày hóa đơn',
            binding: 'AtchDocDate',
            width: 150,
            dataType: 'Date',
            isReadOnly: 'true',
            format: 'dd/MM/yyyy'
        },
          {
            header: 'Số hóa đơn',
            binding: 'AtchDocNo',
            width: 150,
            dataType: 'Array',
            isReadOnly: 'true',
            lookupKey: 'InvoiceBizzi',
             bindingList: {
                IssuedDate: 'AtchDocDate',
                InvoiceId: 'InvoiceId',
                InvoiceSeries: 'AtchFormNo',
                TotalAmountWithoutVat: 'AmountBeforeTax',
                TotalAmountWithVat: 'Amount'
            },
            lookupfilter: "ProductCostId = '{EXPR=ProductCostId}' AND ApprovalStatus = 'PENDING' AND SellerTaxCode = '{EXPR=TaxRegNo}'"
        },
        // {
        //     header: 'Số hóa đơn',
        //     binding: 'AtchDocNo',
        //     allowEditing: true,
        //     width: 150,
        //     validators: "{EXPR=AtchDocNo} == ''",
        //     validatorMessage: 'Không được bỏ trắng giá trị',
        // },
        {
            header: 'Ký hiệu',
            binding: 'AtchFormNo',
            allowEditing: true,
            width: 150,
            isReadOnly: 'true',
            validators: "{EXPR=AtchDocNo} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
        },
        {
            header: 'Giá trị trước thuế',
            binding: 'AmountBeforeTax',
            width: 150,
            isReadOnly: 'true',
            dataType: 'Number'
        },
        {
            header: 'Giá trị sau thuế',
            binding: 'Amount',
            width: 150,
            isReadOnly: 'true',
            dataType: 'Number'
        },
         {
            header: 'Nội dung hóa đơn',
            binding: 'InvoiceItemsFirst',
            allowEditing: true,
            width: 250,
            isReadOnly: 'true',
          
        },
        {
            header: 'Link',
            binding: 'HrefLink',
            allowEditing: false,
            isReadOnly: 'true',
            width: 200

        },
        {
            header: 'Hóa đơn Bizzi',
            binding: 'InvoiceId',
            allowEditing: true,
            width: 0,
            isReadOnly: 'true',
            validatorMessage: 'Không được bỏ trắng giá trị',
        },
    ]

    // Tab "Thanh toán 3 bên" (grid5): chỉ xem
    childColumns5 = [
        {
            header: 'STT',
            binding: 'BuiltinOrder',
            dataType: 'Number',
            width: 60,
            format: 'n0',
            isReadOnly: 'true'
        },
        {
            header: 'Mã đối tượng',
            binding: 'CustomerCode',
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: 'Tên đối tượng',
            binding: 'CustomerName',
            width: 300,
            isReadOnly: 'true'
        },
        {
            header: 'Id hợp đồng',
            binding: 'BizDocId_C1',
            width: 160,
            isReadOnly: 'true'
        },
        {
            header: 'Nội dung hợp đồng',
            binding: 'ContractDescription',
            width: 350,
            isReadOnly: 'true'
        },
        {
            header: 'Thanh toán kỳ này',
            binding: 'PayAmount',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Thanh toán đến kỳ trước',
            binding: 'PayAmountPrev',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Tổng cộng',
            binding: 'PayAmountTotal',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        }
    ]
}

