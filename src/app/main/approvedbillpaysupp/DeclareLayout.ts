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

// Phê duyệt thanh toán thầu phụ/ nhà cung cấp
export class LayoutApprovedBillPaySuppExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_ExplorerCCM',
                FilterKey: "ApproveSend = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'P4' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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
            header: 'Thanh toán',
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

export class LayoutApprovedBillPaySuppEditor implements IEditorFormulaDeclaration {

    buttonLoadChild: string[];
    serverUpdated: string[];
    buttonCommand: string[];
    constructor(private srv?: any,
        private parentData?: any) { }

    approveGrid = 0;

    evaluators = {
        'Evaluator_ServerUpdating_UpdateStatusByApproveStatus': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,Id,ApproveStatus,{VAR=Branch.Ma_Dvcs},EmployeeCodeNext,DocCode,{VAR=User.Id},Comment,ApproveStatusWeb',
            Command: 'usp_Cotec_UpdateStatusByApproveStatus'
        },
        'Evaluator_ServerUpdating_UpdateDate_Liquidation': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,Date_Liquidation',
            Command: 'usp_New_Date_Liquidation'
        }
    };

    serverConstraint = [
    ]

    serverUpdating = [

    ]

    columnChanged = {

    };

    columnsReadOnly = [];

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_EditCCM',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'P4',
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'ApproveGroup'
                },
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder'
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
            Text: 'Bảng KLTT NTP/NCC- {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocCCM_VoucherForm_TachBill',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            Command_TongHop: 'usp_CCM_BillSupp_TongHop',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng KLTT TP.NCC",
                    FileName: "Bảng KTLL TP.NCC - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=Amount_DeNghiTT_Str}",
                    WordName: "5.Bang_KLTT_NTP_NCC_Ver2.docx",
                    ExcelName: "5.Bang_KLTT_NTP_NCC_Ver2.xlsx",
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

    linkReporter = {
        'btnPhuLucA': {
            directory: 'billsupp',
            type: 'detail',
            key: 'Id_TT'
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
                    key: 'MonthlyVolume',
                    label: 'Khối lượng tháng',
                    type: 'text',
                    
                    col: 6
                }),
                new TextBoxInput({
                    key: 'LastDocNo',
                    label: 'Số TT tay',
                    dataType: 'text',
                    col: 6,
                    validators: [Validators.required],
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    validators: [Validators.required],
                    lookupfilter: '',
                    //lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: true,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Hợp đồng',
                    lookupKey: 'BizDoc_CTC',
                    binding: {
                        CustomerCode: 'CustomerCode',
                        JobCode: 'JobCode',
                        ContractType: 'ContractType',
                        CurrencyCode: 'CurrencyCode',
                        Id: 'Id_HdPl',
                        DocCode: 'DocCode_HdPl'
                    },
                    lookupfilter: "IsActive=1",
                    hideValueMember: true,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
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
                    lookupfilter: "",
                    hideValueMember: false,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'PayRequireNum',
                    label: 'Yêu cầu thanh toán số',
                    dataType: 'text',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new MultiSelectInput({
                    key: 'JobCode',
                    label: 'Công việc',
                    lookupKey: 'Job',
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv),
                new LookupBoxInput({
                    key: 'PayTeamType',
                    label: 'Loại thanh toán',
                    lookupKey: 'Class',
                    lookupfilter: "ParentCode='PayTeamType' AND Code IN ('00','01','03','04','05','07')",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ContractType',
                    label: 'Loại hợp đồng',
                    lookupKey: 'ContractType',
                    hideValueMember: false,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'ContractValue',
                    label: 'GTHĐ ban đầu (gồm VAT)',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'SubContractValue',
                    label: 'Điều chỉnh HĐ (gồm VAT)',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'Amount_HDPL',
                    label: 'GTHĐ đ.chỉnh (gồm VAT)',
                    col: 6,
                    isDisabled: 'true'
                }),
                // new ButtonInput({
                //     key: 'btnPhuLucA',
                //     label: 'Bảng khối lượng thanh toán',
                //     col: 6,
                //     isDisabled: "'{EXPR=PayTeamType}' != '01'"
                // }),
                new ButtonInput({
                    key: 'btnPhuLucA',
                    label: 'Bảng khối lượng thanh toán',
                    col: 6
                   
                }),
                new NumberBoxInput({
                    key: 'Amount_KHKK',
                    label: 'Giá trị KHKK (chưa VAT)',
                    col: 6,
                    isDisabled: 'true'
                }),
               
                new LookupBoxInput({
                    key: 'BizDocId_TT',
                    label: 'Bảng KL thanh toán',
                    lookupKey: 'BizDocCCM',
                    hideValueMember: true,
                    binding: {
                        DocNo: 'DocNo',
                        Id: 'Id_TT'
                    },
                    lookupfilter: "DocCode IN ('B4') AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}' AND CustomerCode='{EXPR=CustomerCode}'  AND BizDocId NOT IN (SELECT BizDocId_TT FROM B30BizDocCCM WHERE DocCode='P4' AND IsActive=1 AND BizDocId_TT <>'' AND BizDocId <> '{EXPR=BizDocId}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}')",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'Amount_BCTC',
                    label: 'Giá trị BCTC (chưa VAT)',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'Amount_ThiCong',
                    label: 'Tổng giá trị khoán thi công',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'Amount_TamUng',
                    label: 'Giá trị tạm ứng',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'Amount_THDenKyNay',
                    label: 'Giá trị t.hiện đến kỳ này',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'Amount_HoanTra',
                    label: 'Giá trị hoàn trả tạm ứng',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'Amount_TTKyNay',
                    label: 'Giá trị TT đến kỳ này',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'Amount_TTKyTruoc',
                    label: 'Tổng GTTT đến kỳ trước',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'Amount_KhauTruBaoHanh',
                    label: 'Khấu trừ khác (tiền phạt, tiện ích,...)',
                    col: 6,
                    
                    // isDisabled: "'{EXPR=PayTeamType}' != '03'"
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new LookupBoxInput({
                    key: 'CurrencyCode',
                    label: 'Mã tiền tệ',
                    lookupKey: 'Currency',
                    lookupfilter: "IsActive=1 AND IsGroup=0",
                    hideValueMember: false,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'Amount_TongTTDenKyNay',
                    label: 'Tổng GTTT đến kỳ này',
                    col: 6,
                    isDisabled: 'true'
                }),
                new MultiSelectInput({
                    key: 'ListInvoice',
                    label: 'Hóa đơn thiết bị',
                    lookupKey: 'InvoiceCems',
                    lookupfilter: "IsActive=1",
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    // isDisabled: 'true',
                    // hideValueMember: false,
                    col: 6
                }, this.srv),
                new NumberBoxInput({
                    key: 'Amount_DeNghiTT',
                    label: 'Giá trị đề nghị thanh toán',
                    col: 6,
                    isDisabled: 'true'
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive=1 AND IsGroup=0",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'TransType',
                    label: 'Bao thanh toán',
                    lookupKey: 'Class',
                    lookupfilter: "IsActive=1 AND ParentCode='LOAITT'",
                    hideValueMember: false,
                    col: 6,
                    
                }, this.srv, this.parentData),   
                new TextBoxInput({
                    key: 'Description',
                    label: 'Ghi chú',
                    dataType: 'text',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new DateBoxInput({
                    key: 'Date_Liquidation',
                    label: 'Ngày tính hạn thanh toán',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    
                    style: 'background-color:#FFFF00;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'DueDate',
                    label: 'Hạn thanh toán (Ngày)',
                    col: 6,
                    format: 'N0',
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new DateBoxInput({
                    key: 'DateDue',
                    label: 'Ngày đến hạn thanh toán',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    isDisabled: 'true',
                    col: 6,
                    
                    
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                //
                // new NumberBoxInput({
                //     key: 'NumberOfDays',
                //     label: 'Số ngày thực hiện',
                //     type: 'number',
                //     dataType: 'n0',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
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
                new ButtonInput({
                    key: 'btnHdPl',
                    label: 'Xem hợp đồng',
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
                //     label: 'File TBTT đính kèm',
                //     col: 6,
                //     isOnlyDownload: true,
                //     folderId: '{EXPR=IdBizDocCCM}'
                // }, this.srv)
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
            width: 250,
            isReadOnly: 'true'
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
            folderId: '{EXPR=IdBizDocCCM}'
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
    ]  
    childColumns3 = [
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
        
       
        },
        {
            header: 'Ký hiệu',
            binding: 'AtchFormNo',
            allowEditing: true,
            width: 150,
         
          
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