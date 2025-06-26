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


export class LayoutApprovedCreditContractExplorer implements IExplorerFormulaDeclaration {
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

export class LayoutApprovedCreditContractEditor implements IEditorFormulaDeclaration {

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
                Name: 'vB30BizDocApprove_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'C8',
                    BizDocId: '',
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder'
                },                
                      
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    // DefaultValues: {
                    //     BizDocId: '',
                    //     BuiltinOrder: '1',
                    //     DocDate: 'Parent.DocDate'
                    // }
                },
                // {
                //     Name: 'B30BizDocInterestRate',
                //     ParentKey: 'BizDocId',
                //     ChildKey: 'BizDocId',
                //     Sort: 'BuiltinOrder',
                //     // DefaultValues: {
                //     //     Stt: 'Parent.Stt',
                //     //     BuiltinOrder: '1',
                //     //     DocDate: 'Parent.DocDate',
                //     //     DocCode: 'Parent.DocCode',
                //     //     DocGroup: 2,
                //     //     BranchCode: '{VAR=Branch.Ma_Dvcs}',
                //     //     ProductCostId: 'Parent.ProductCostId',
                //     //     CustomerCode: 'Parent.CustomerCode',
                //     //     TransCode: 'Parent.TransCode'
                //     // }
                // },
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Phiếu yêu cầu xuất hóa đơn - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30AccDoc_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: 'MAU9',
                    Name: 'Phiếu yêu cầu xuất hóa đơn',
                    FileName: 'WorkFlow Hóa đơn - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}',
                    WordName: 'WorkFlow_YeuCauXuatHoaDon.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ]
        }
    };

    panels: PanelBase[] = [
        new TablePanel({
            label: 'Panel 1',
            col: 12,
            controls: [
                new DateBoxInput({
                    key: 'SignDate',
                    label: 'Ngày ký',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }),
              
                new TextBoxInput({
                    key: 'DocNoReal',
                    label: 'Số HĐ ký với NH',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    validators: [Validators.required],
                    lookupfilter: "IsGroup=0 AND IsActive=1",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: true,
                    col: 12,
                    visible: 'false',
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12,
                    
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Ngân hàng',
                    lookupKey: 'Customer',
                    binding: {
                        Name: 'Person',
                        Address: 'Address'
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12,
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }, this.srv, this.parentData),
               
                new NumberBoxInput({
                    key: 'TotalOfValue',
                    label: 'Tổng hạn mức tín dụng',
                    type: 'number',
                    col: 12,
                    labelCol: 5,
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'ValueOfGuarantee',
                    label: 'Hạn mức vay',
                    type: 'number',
                    col: 12,
                    labelCol: 5,
                    
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'NumberCol1',
                    label: 'Hạn mức thấu chi',
                    type: 'number',
                    col: 12,
                    labelCol: 5,
                    
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'ValueOfWork',
                    label: 'Hạn mức LC',
                    type: 'number',
                    col: 12,
                    labelCol: 5,
                    
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'ValueOfWarranty',
                    label: 'Hạn mức bảo lãnh',
                    type: 'number',
                    col: 12,
                    labelCol: 5,
                    
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'AriseValue',
                    label: 'Hạn mức bao thanh toán',
                    type: 'number',
                    col: 12,
                    labelCol: 5,
                    
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new DateBoxInput({
                    key: 'EffectiveDate',
                    label: 'Thời hạn duy trì hạn mức',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    labelCol: 5,
                    col: 12,
            
                }),
                new TextBoxInput({
                    key: 'Remark',
                    label: 'Ghi chú',
                    type: 'text',
                    col: 12,
                    labelCol: 5,
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: '',
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12,
                    visible: 'false',
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }, this.srv, this.parentData),    
               
              
                new LookupBoxInput({
                    key: 'PositionCode',
                    label: 'Cấp bậc duyệt',
                    lookupKey: 'Position',
                    hideValueMember: false,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCode',
                    label: 'Người duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCodeSend',
                    label: 'Người gửi duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }, this.srv, this.parentData),
               
                // new NumberBoxInput({
                //     key: 'LoanOriginalAmount',
                //     label: 'TỔNG TIỀN',
                //     type: 'number',
                //     labelCol: 5,
                //     col: 12,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F8F0D7;border-radius:8px;'
                // }),
                new NumberBoxInput({
                    key: 'ApproveGroup',
                    label: 'Thứ tự duyệt',
                    col: 12,
                    visible: 'false',
                    labelCol: 5
                }),
                new TextBoxInput({
                    key: 'Stt',
                    label: 'Số thứ tự',
                    type: 'text',
                    visible: 'false',
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }),
                new TextBoxInput({
                    key: 'Comment',
                    label: 'Ý kiến',
                    col: 12,
                    // style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                // new ButtonInput({
                //     key: 'btnHdPl',
                //     label: 'Bổ sung file',
                //     style: 'background-color:#9cc09c;',
                //     col: 6
                // }),                
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'File đính kèm',
                //     col: 6,
                //     isOnlyDownload: true,
                //     folderId: '{EXPR=IdBudget}'
                // }, this.srv)
            ]
        })
    ];

    childColumns = [
        // {
        //     header: 'Mã tài liệu',
        //     binding: 'DocumentCode',
        //     width: 80,
        //     dataType: 'Array',
        //     lookupKey: 'Document',
        //     lookupfilter: 'IsGroup=0 AND IsActive=1'
        // },
        // {
        //     header: 'Tên hồ sơ',
        //     binding: 'Description',
        //     width: 180,
        //     isReadOnly: 'true'
        // },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 430,
            dataType: 'Object',
            allowRemove: false,
            allowView: true,
            allowDownLoad: true,
            allowUpload: false,
            folderId: '{EXPR=IdBizDoc}'
        }
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
            width: 150
        },
        {
            header: 'Người thực hiện',
            binding: 'EmployeeName',
            width: 150
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
    // childColumns2 = [
    //     {
    //         header: '%/(Năm)',
    //         binding: 'InterestRate',
    //         isRequired: true,
    //         width: 100,
    //         format: 'P2',
    //         dataType: 'Number'
    //     },
    //     {
    //         header: 'Ghi chú',
    //         binding: 'Description',
    //         width: 250
    //     },
    //     {
    //         header: 'Ngày hiệu lực',
    //         binding: 'EffectiveDate',
    //         isRequired: false,
    //         width: 150,
    //         format: 'dd/MM/yyyy',
    //         dataType: 'Date'
    //     },
    // ];
}