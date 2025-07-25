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

// Phê duyệt thanh toán phân bổ
export class LayoutApprovedBillPayEquipmentExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_ExplorerCCM',
                FilterKey: "ApproveSend = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'P5' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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

export class LayoutApprovedBillPayEquipmentEditor implements IEditorFormulaDeclaration {

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
                    DocCode: 'P5',
                    Id: -1
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
                    Name: 'vB30BizDocContactInfo_Approved',
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
            Text: 'Bảng KLTT thuê, mua hàng- {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocCCM_VoucherForm',//_ConvertNumericToText',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng KLTT TP.NCC",
                    FileName: "Bảng KLTT thuê, mua hàng - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "Bang_KLTT_Bill_ChiPhi_PhanBo.docx",
                    ExcelName: "Bang_KLTT_Bill_ChiPhi_PhanBo.xlsx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ],
            PrintGrid: [
            ]
        }
    };

    linkReporter = {
        'btnPhuLucA': {
            directory: 'billequipment_view',
            type: 'detail',
            key: 'Id_TT'
        },
        'btnHdPl': {
            directory: 'regcontract_view',
            type: 'detail',
            command: "{EXPR=DocCode_HdPl} == 'C3' ? 'detailc3' : {EXPR=DocCode_HdPl} == 'C4' ? 'detailc4' : ''",
            key: 'Id_HdPl'
        },
        'btnHdDt': {
            directory: 'consdocument',
            type: 'detail',
            key: 'Id_HdDt'
        },
        'btnDinhKemHD': {
            directory: 'billpayequipmentattach',
            type: 'detail',
            key: 'IdBizDocCCM',
            parameter: { 'Commandkey': 'billpayequipmentattach-editor' }
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
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số hồ sơ',
                    dataType: 'text',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'PayTeamType',
                    label: 'Loại thanh toán',
                    lookupKey: 'Class',
                    lookupfilter: "ParentCode='PayTeamType' AND Code IN ('01','03')",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                // new TextBoxInput({
                //     key: 'PayRequireNum',
                //     label: 'Yêu cầu thanh toán số',
                //     dataType: 'text',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB thanh toán',
                    lookupKey: 'ProductCost',
                    validators: [Validators.required],
                    lookupfilter: '',
                    //lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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
                        ContractType: 'ContractType'
                    },
                    validators: [Validators.required],
                    lookupfilter: '',
                    //lookupfilter: "DocCode IN ('C3','C4') AND CompletedApprove=1 AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId='{EXPR=ProductCostId}'",
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
                    lookupfilter: "(('{EXPR=ProductType}'=3 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%') OR Code IN (SELECT A.CustomerCode FROM B30CCMBudgetDetail A INNER JOIN B30CCMBudget B ON A.CCMBudgetId = B.CCMBudgetId WHERE (A.CompletedApproveDetail=1) AND B.CompletedApprove=1 AND B.IsActive=1 AND B.DocCode='K1' AND B.ProductCostId ='{EXPR=ProductCostId}'))",
                    hideValueMember: false,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'JobCode',
                    label: 'Công việc',
                    lookupKey: 'Job_CCM',
                    hideValueMember: false,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                    col: 6
                }, this.srv),
                new LookupBoxInput({
                    key: 'ContractType',
                    label: 'Loại hợp đồng',
                    lookupKey: 'ContractType',
                    hideValueMember: false,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'ContractValue',
                    label: 'Giá trị HĐ (chưa VAT)',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
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
                    validators: [Validators.required],
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'SubContractValue',
                    label: 'Giá trị PLHĐ (chưa VAT)',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'Amount_HDPL',
                    label: 'Giá trị HĐ + PLHĐ (chưa VAT)',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'Amount_TamUng',
                    label: 'Giá trị tạm ứng',
                    type: 'number',
                    isDisabled: "'{EXPR=PayTeamType}' != '00'",
                    col: 6,
                    
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_HoanTra',
                    label: 'Giá trị hoàn trả tạm ứng',
                    type: 'number',
                    col: 6,
                  ///  validators: [Validators.ccmmessage1],
                    style: 'background-color:#CCFF66;border-radius:8px;',
                    
                    
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_ThiCongNotVAT',
                    label: 'Tổng giá trị thi công (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_ThiCong',
                    label: 'Tổng giá trị thi công (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_THDenKyNayNotVAT',
                    label: 'Tổng GTTH đến kỳ này (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_THDenKyNay',
                    label: 'Tổng GTTH đến kỳ này (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'Amount_TTKyTruoc',
                    label: 'Tổng GTTT đến kỳ trước',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'Amount_TongTTDenKyNay',
                    label: 'Tổng GTTT đến kỳ này',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;'
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
                // new ButtonInput({
                //     key: 'btnPhuLucA',
                //     label: 'Bảng khối lượng thanh toán',
                //     col: 6
                // }),
                // new LookupBoxInput({
                //     key: 'BizDocId_TT',
                //     label: 'Bảng KL thanh toán',
                //     lookupKey: 'BizDocCCM',
                //     hideValueMember: true,
                //     binding: {
                //         DocNo: 'DocNo',
                //         Id: 'Id_TT'
                //     },
                //     lookupfilter: "DocCode IN ('B5') AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}' AND CustomerCode='{EXPR=CustomerCode}'",
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }, this.srv, this.parentData),
                // new NumberBoxInput({
                //     key: 'Amount_ThiCong',
                //     label: 'Tổng giá trị thi công',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                // new NumberBoxInput({
                //     key: 'Amount_TamUng',
                //     label: 'Giá trị tạm ứng',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                // new NumberBoxInput({
                //     key: 'Amount_THDenKyNay',
                //     label: 'Tổng GTTH đến kỳ này',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                // new NumberBoxInput({
                //     key: 'Amount_HoanTra',
                //     label: 'Giá trị hoàn trả tạm ứng',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                // new NumberBoxInput({
                //     key: 'Amount_TTKyNay',
                //     label: 'Giá trị TT đến kỳ này',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                new NumberBoxInput({
                    key: 'Amount_DeNghiTT',
                    label: 'Giá trị đề nghị thanh toán',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Ghi chú',
                    dataType: 'text',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
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
                    lookupfilter: 'IsActive=1 AND DocStatus=4',
                    //lookupfilter: "(('{EXPR=PayTeamType}' = '00') OR Code IN (SELECT Code FROM dbo.ufn_Coteccons_Filter_ProcessCodeByBizDocC3('{EXPR=ParentBizDocId}','{EXPR=DocCode}'))) AND ParentId=7",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId0',
                    label: 'Gói thầu/ PB đại diện',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: true,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData), 
                // new LookupBoxInput({
                //     key: 'BizDocId_CD',
                //     label: 'Hóa đơn điện tử',
                //     lookupKey: 'ConsDocument',
                //     lookupfilter: "",
                //     hideValueMember: true,
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }, this.srv, this.parentData),
                // new ButtonInput({
                //     key: 'btnHdDt',
                //     label: 'Xem hóa đơn',
                //     style: 'background-color:#9cc09c;',
                //     col: 6
                // }),
                // new DateBoxInput({
                //     key: 'ConfirmedDate',
                //     label: 'Ngày nhận hóa đơn',
                //     dataType: 'date',
                //     format: 'dd/MM/yyyy',
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#FAF5D0;border-radius:8px;'
                // }),
                // new DateBoxInput({
                //     key: 'FinishedDate',
                //     label: 'Ngày thanh toán',
                //     dataType: 'date',
                //     format: 'dd/MM/yyyy',
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#FAF5D0;border-radius:8px;'
                // }),
                // new NumberBoxInput({
                //     key: 'ApproveGroup',
                //     label: 'STT duyệt',
                //     type: 'number',
                //     dataType: 'n0',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
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
                // new LookupBoxInput({
                //     key: 'InformMethod',
                //     label: 'Kiểu thông báo',
                //     lookupKey: 'Class',
                //     lookupfilter: "ParentCode='InformMethod'",
                //     hideValueMember: false,
                //     col: 6,
                //     isDisabled: 'true'
                // }, this.srv, this.parentData),
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
                new LookupBoxInput({
                    key: 'EmployeeCodeSend',
                    label: 'Người gửi duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new ButtonInput({
                    key: 'btnDinhKemHD',
                    label: 'Đính kèm bổ sung hồ sơ',
                    col: 6,
                    isDisabled: "{EXPR=PositionCode} != 'CB-006'"
                }),
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
            header: 'STT',
            binding: 'ItemNo',
            width: 70
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            allowEditing: false,
            width: 250
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 50
        },
        // {
        //     header: 'KL hợp đồng',
        //     binding: 'Quantity_Hd',
        //     dataType: 'Number',
        //     width: 100,
        //     format: 'n3',
        //     isReadOnly: 'true',
        //     // exprReadOnly: '1==1'
        // },
        // {
        //     header: 'Khối lượng',
        //     binding: 'Quantity9',
        //     dataType: 'Number',
        //     // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
        //     // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
        //     // ignoreError: 1,
        //     width: 100,
        //     format: 'n3'
        // },
        // {
        //     header: 'Đơn giá',
        //     binding: 'OriginalUnitCost',
        //     dataType: 'Number',
        //     width: 150,
        //     format: 'n2',
        //     exprReadOnly: "{EXPR=InheritanceRowIdPL} != ''"
        // },
        // {
        //     header: 'Lũy kế đến kỳ trước (gồm VAT)',
        //     binding: 'PaymentAmount',
        //     dataType: 'Number',
        //     width: 150,
        //     // isReadOnly: 'true'
        // },
        {
            header: 'Giá trị kỳ này (chưa VAT)',
            binding: 'OriginalAmount',
            width: 150,
            dataType: 'Number'
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
            // isReadOnly: 'true'
        },
        {
            header: '% VAT',
            binding: 'TaxRate',
            width: 80,
            isReadOnly: 'true'
        },
        {
            header: 'Tiền thuế',
            binding: 'OriginalAmount3',
            dataType: 'Number',
            width: 150,
            // isReadOnly: 'true'
        },
        {
            header: 'Tổng tiền',
            binding: 'TotalOriginalAmount',
            dataType: 'Number',
            width: 150,
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
            header: 'Giá trị thực hiện (Chưa VAT)',
            binding: 'Amount_ThNotVAT',
            width: 150,
            dataType: 'Number',
            isReadOnly: 'true',
            exprReadOnly: "{EXPR=InheritanceRowIdPL} != '' || {EXPR=InheritanceRowId} != ''"
            //exprFormat: "'{EXPR=CurrencyCode}' == 'VND' ? 'n0' : 'n2'"
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
            header: 'Ghi chú',
            binding: 'Remark',
            allowEditing: true,
            width: 200
        },
        // {
        //     header: 'Mã chi phí',
        //     binding: 'Ma_QLKL',
        //     dataType: 'Array',
        //     lookupKey: 'DmQLKL',
        //     lookupfilter: 'IsGroup=0 AND IsActive=1',
        //     width: 150
        // },
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
            width: 300,
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
            width: 240
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

    childColumns2 = [
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
            width: 500,
            dataType: 'Object',
            allowRemove: false,
            allowView: true,
            allowDownLoad: true,
            allowUpload: false,
            folderId: '{EXPR=IdBizDocCCM}'
        }
    ];

    childColumns3 = [
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
            width: 230,
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
            width: 230,
            isReadOnly: 'true'
        },
        {
            header: 'Mã nhân viên',
            binding: 'EmployeeCode',
            width: 150,
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
            header: 'Người duyệt được chỉ định',
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
     childColumns4 = [
         {
            header: 'Chọn hóa đơn',
            binding: 'IsSelected',
            dataType: 'Boolean',
            width: 80
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
        {
            header: 'Ngày hóa đơn',
            binding: 'AtchDocDate',
            width: 150,
            dataType: 'Date',
            isReadOnly: 'true',
            format: 'dd/MM/yyyy'
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
            header: 'Ngày nhận đủ hồ sơ',
            binding: 'DateReceive',
            width: 150,
            dataType: 'Date',

            format: 'dd/MM/yyyy'
        },
        {
            header: 'Hóa đơn Bizzi',
            binding: 'InvoiceId',
            allowEditing: true,
            width: 0,
            isReadOnly: 'true',
            validatorMessage: 'Không được bỏ trắng giá trị',
        },
    ];
}