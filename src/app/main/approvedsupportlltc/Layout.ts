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


export class LayoutApprovedSupportLLTCExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_BizDocVBExplorer',
                FilterKey: "ApproveSend = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'V1' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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
            width: 400,
            dataType: 'String',
            isContentHtml: true
        },
        {
            header: 'Kế hoạch',
            binding: 'InfoBudget',
            width: 0,
            dataType: 'String'
        },
        {
            header: 'Gói thầu',
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

export class LayoutApprovedSupportLLTCEditor implements IEditorFormulaDeclaration {

    buttonLoadChild: string[];
    serverUpdated: string[];
    buttonCommand: string[];
    constructor(private srv?: any,
        private parentData?: any) { }

    evaluators = {
        'Evaluator_ServerUpdating_UpdateStatusByApproveStatus': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,Id,ApproveStatus,{VAR=Branch.Ma_Dvcs},EmployeeCodeNext,DocCode,{VAR=User.Id},Comment,ApproveStatusWeb',
            Command: 'usp_Cotec_UpdateStatusByApproveStatus'
        }
    };

    approveGrid = 1;

    serverConstraint = [
    ]

    serverUpdating = [

    ]

    columnChanged = {

    };

    linkReporter = {
        'btnHdPl': {
            directory: 'consdocumentfile',
            type: 'detail',
            key: 'IdBizDocVB',
        }
    }

    columnsReadOnly = [];

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_CCMBudgetEdit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'K7',
                    BizDocId: '',
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB30CCMBudgetDetail2_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        CCMBudgetId: 'Parent.CCMBudgetId',
                        BuiltinOrder: '1'
                    }
                },
                {
                    Name: 'vB30BizDocApprove_AEditBudget',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: 'Parent.CCMBudgetId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    }
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.CCMBudgetId',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30CCMBudgetDetail1_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    IsView: 'view',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        CCMBudgetId: 'Parent.CCMBudgetId',
                        BuiltinOrder: '1'
                    }
                },
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.CCMBudgetId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                    }
                },
            ]
        },
        PrintDocument: {
            Key: 'CCMBudgetViewer',
            Text: 'Theo dõi hỗ trợ LLTC - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30CCMBudget_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng phân bổ & theo dõi chi phí hỗ trợ",
                    FileName: "Bảng phân bổ & theo dõi chi phí hỗ trợ - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "K7_Tong_Hop_Chi_Phi_Ho_Tro.docx",
                    // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
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
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu',
                    lookupKey: 'ProductCost',
                    // binding: {
                    //     InvestorCode: 'CustomerCode'
                    // },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType='1' AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: 'IsGroup=0 AND IsActive=1',//"(Code IN (SELECT Code FROM dbo.ufn_Coteccons_Filter_ProcessCodeByBizDocC3('{EXPR=ProductCostId}','{EXPR=ParentBizDocId}','{EXPR=DocCode}','{VAR=Branch.Ma_Dvcs}')))",//('{EXPR=PayTeamType}' = '00') OR 
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'Amount_DoanhThu',
                    label: 'Doanh thu dự án',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                // new NumberBoxInput({
                //     key: 'TiSuat_LN',
                //     label: 'Tỉ suất LN (%)',
                //     isReadOnly: 'true',
                //     style: 'background-color:#F8F0D7;border-radius:8px;',
                //     col: 6,
                //     type: 'number',
                //     format: 'P2'
                // }),
                new NumberBoxInput({
                    key: 'TotalOriginalAmountC',
                    label: 'Tổng GT hỗ trợ kỳ này',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                }),
                new NumberBoxInput({
                    key: 'TiSuat_LNDT',
                    label: 'Tỉ lệ (%)/ Doanh thu',
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                    col: 6,
                    type: 'number',
                    format: 'P2'
                }),
                new NumberBoxInput({
                    key: 'TotalPaymentAmountC',
                    label: 'Lũy kế GT hỗ trợ đến kỳ này',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'TiSuat_LNBGD',
                    label: 'Tỉ lệ (%)/ Doanh thu',
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                    col: 6,
                    type: 'number',
                    format: 'P2'
                }),
                new NumberBoxInput({
                    key: 'NumberOfDays',
                    label: 'Số ngày thực hiện',
                    type: 'number',
                    dataType: 'n0',
                    isDisabled: 'true',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'DeptCode',
                    label: 'Bộ phận',
                    lookupKey: 'Dept',
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'PositionCode',
                    label: 'Cấp bậc duyệt',
                    lookupKey: 'Position',
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCode',
                    label: 'Người duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 6
                }, this.srv, this.parentData),
                new RichTextBoxInput({
                    key: 'Comment',
                    label: 'Ý kiến',
                    col: 12
                }),
                new LookupBoxInput({
                    key: 'EmployeeCodeSend',
                    label: 'Người gửi duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new UploadInput({
                    key: 'FilePath',
                    label: 'File đính kèm',
                    col: 6,
                    isOnlyDownload: true,
                    folderId: '{EXPR=IdCCMBudget}'
                }, this.srv)
            ]
        })
    ];

    childColumns = [
        {
            header: 'Mã XD/ME',
            binding: 'CodeMEXD',
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='INCURRED'",
            width: 150,
            
        },
        {
            header: 'Nhà thầu phụ',
            binding: 'CustomerCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Customer_CCM2',
            bindingList: {
                NameBinding: 'CustomerName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
            width: 120,
            validators: "{EXPR=CustomerCode} == ''",
            validatorMessage: 'Mã đối tượng, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên nhà thầu',
            binding: 'CustomerName',
            width: 300,
            isReadOnly: 'true'
        },
        {
            header: 'Mã hỗ trợ',
            binding: 'JobCode',
            dataType: 'Array',
            lookupKey: 'Job',
            bindingList: {
                Name: 'JobName'
            },
            // multiSelection: true,
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ActivityCode='LV-019'",
            width: 100
        },
        {
            header: 'Phân loại hỗ trợ',
            binding: 'JobName',
            isRequired: true,
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Nội dung hỗ trợ',
            binding: 'Remark',
            width: 200
        },
        {
            header: 'Id hợp đồng',
            binding: 'ParentBizDocId',
            width: 150,
            dataType: 'Array',
            lookupKey: 'BizDoc_CTC',
            bindingList: {
                DocInfo: 'DocInfo'
            },
            lookupfilter: "((((ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (ContractType IN ('HD-10','HD-14') AND CustomerCode = '{EXPR=CustomerCode}')) AND DocCode IN ('C2','C3') AND IsActive=1 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}')"
        },
        {
            header: 'Thông tin hợp đồng',
            binding: 'DocInfo',
            width: 300,
            isReadOnly: 'true'
        },
        // {
        //     header: 'Giá trị thi công dự kiến',
        //     binding: 'Amount1',
        //     dataType: 'Number',
        //     width: 120,
        //     isReadOnly: 'true'
        // },
        // {
        //     header: 'Giá trị thực hiện đến kỳ này',
        //     binding: 'Amount2',
        //     dataType: 'Number',
        //     width: 120,
        //     isReadOnly: 'true'
        // },
        // {
        //     header: 'Tổng giá trị hỗ trợ đến kỳ trước',
        //     binding: 'Amount3',
        //     dataType: 'Number',
        //     width: 120,
        //     isReadOnly: 'true'
        // },
        {
            header: 'Giá trị hỗ trợ kỳ này',
            binding: 'Amount4',
            dataType: 'Number',
            width: 150
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
            header: 'Người duyệt được chỉ định',
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
        // {
        //     header: 'Được trả lại hồ sơ',
        //     binding: 'ApproveReturn',
        //     dataType: 'Boolean',
        //     width: 80,
        //     isReadOnly: 'true'
        // },
        // {
        //     header: 'Trả về cấp bậc',
        //     binding: 'PositionCodeReturn',
        //     width: 150,
        //     isReadOnly: 'true'
        // }
    ];

    childColumns2 = [
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
            width: 200
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

    childColumns3 = [
        {
            header: 'Nhà thầu phụ',
            binding: 'CustomerCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Customer_CCM2',
            bindingList: {
                NameBinding: 'CustomerName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
            width: 120
        },
        {
            header: 'Tên nhà thầu',
            binding: 'CustomerName',
            width: 300,
            isReadOnly: 'true'
        },
       
        // {
        //     header: 'Id hợp đồng',
        //     binding: 'BizDocId_C1',
        //     width: 150,
        //     dataType: 'Array',
        //     lookupKey: 'BizDoc_CTC',
        //     bindingList: {
        //         DocInfo: 'DocInfo'
        //     },
        //     lookupfilter: "IsActive=1"
        // },
        {
            header: 'Thông tin hợp đồng',
            binding: 'DocInfo',
            width: 300,
            isReadOnly: 'true'
        },
        {
            header: 'Giá trị HĐ/PLHĐ (Chưa VAT)',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: 'Giá trị thi công dự kiến',
            binding: 'OriginalAmount1',
            dataType: 'Number',
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: 'Giá trị thực hiện đến kỳ này',
            binding: 'OriginalAmount2',
            dataType: 'Number',
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: 'Tổng giá trị hỗ trợ đến kỳ trước',
            binding: 'OriginalAmount3',
            dataType: 'Number',
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: 'Giá trị hỗ trợ kỳ này',
            binding: 'OriginalAmount4',
            dataType: 'Number',
            width: 150
        },
        {
            header: 'Lũy kế Giá trị hỗ trợ đến kỳ này',
            binding: 'OriginalAmount5',
            dataType: 'Number',
            width: 150
        },
        {
            header: 'Tỷ lệ',
            binding: 'CostPercent',
            dataType: 'Number',
            width: 150,
            type: 'number',
            format: 'P2'
        }
    ];

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
            dataType: 'Object'
        }
    ]
}