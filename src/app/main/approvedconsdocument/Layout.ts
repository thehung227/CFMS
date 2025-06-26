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


export class LayoutApprovedConsDocumentExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_ConsDocumentExplorer',
                FilterKey: "ApproveSend = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'CD' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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

export class LayoutApprovedConsDocumentEditor implements IEditorFormulaDeclaration {

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
    }

    columnsReadOnly = [];

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_ConsDocumentEdit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'CD',
                    BizDocId: '',
                    Id: -1
                }
            },
            Child: [
                // {
                //     Name: 'vB30ConsDocumentDetail_Edit',
                //     ParentKey: 'BizDocId',
                //     ChildKey: 'BizDocId',
                //     Sort: 'BuiltinOrder',
                //     DefaultValues: {
                //         BizDocId: '',
                //         BuiltinOrder: '1',
                //         DocDate: 'Parent.DocDate'
                //     }
                // },
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
                    Name: 'vB30BizDocApprove_AEditConsDocument',
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
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: '',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    }
                }
            ]
        },
        PrintDocument: {
            Key: 'CCMBudgetViewer',
            Text: 'Kế hoạch ký kết hợp đồng - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30ConsDocument_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Thông tin hóa đơn",
                    FileName: "Thông tin hóa đơn - {EXPR=ProductName}",
                    WordName: "Hoa_Don_Dau_Vao.docx",
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
                    type: 'text',
                    validators: [Validators.required],
                    isDisabled: 'true',
                    col: 6
                }),                  
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    validators: [Validators.required],
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN ('1','3') AND BranchCode='{VAR=Branch.Ma_Dvcs}'",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
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
                        CustomerCode: 'CustomerCode'
                    },
                    validators: [Validators.required],
                    lookupfilter: "(((DocCode = 'C3' OR (DocCode = 'C4' AND IsSubContractPay = 1)) AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId='{EXPR=ProductCostId0}') AND ContractTypeFilter='B4') OR (DocCode='C3' AND IsSubContractPay = 1)) AND Closed = 0 AND CompletedApprove=1 AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Đối tượng',
                    lookupKey: 'Customer',
                    binding: {
                        TaxRegNo: 'TaxRegNo'
                    },
                    validators: [Validators.required],
                    lookupfilter: '',
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData), 
                new TextBoxInput({
                    key: 'TaxRegNo',
                    label: 'Mã số thuế đối tác',
                    type: 'text',
                    validators: [Validators.required],
                    isDisabled: 'true',
                    col: 6
                }),    
                new TextBoxInput({
                    key: 'TaxRegNoFileXml',
                    label: 'Mã số thuế file XML',
                    type: 'text',
                    validators: [Validators.required],
                    isDisabled: 'true',
                    col: 6
                }),                             
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    type: 'text',
                    isDisabled: 'true',
                    col: 12
                }),
                new NumberBoxInput({
                    key: 'TotalAmount9',
                    label: 'Tổng tiền (trước VAT)',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'TotalAmount3',
                    label: 'Tiền thuế (VAT)',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'TotalAmount',
                    label: 'Tổng tiền (gồm VAT)',
                    col: 6,
                    isDisabled: 'true'
                }),
                new TextBoxInput({
                    key: 'SearchCode',
                    label: 'Mã tra cứu',
                    type: 'text',
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'SearchLink',
                    label: 'Link tra cứu',
                    type: 'text',
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 12
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: '',
                    // lookupfilter: 'IsGroup=0 AND IsActive=1 AND ParentId=96',//"(Code IN (SELECT Code FROM dbo.ufn_Coteccons_Filter_ProcessCodeByBizDocC3('{EXPR=ProductCostId}','{EXPR=ParentBizDocId}','{EXPR=DocCode}','{VAR=Branch.Ma_Dvcs}')))",//('{EXPR=PayTeamType}' = '00') OR 
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId0',
                    label: 'Gói thầu đại diện',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",// AND RowId IN ('PROD002239','PROD002238','PROD001728')",
                    hideValueMember: true,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
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
        {
            header: 'Tên tài liệu',
            binding: 'Description',
            width: 150,
        },
        {
            header: 'Yêu cầu đính kèm',
            binding: 'Attached',
            dataType: 'Boolean',
            width: 150,
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
            folderId: '{EXPR=IdConsDocument}'
        }
    ]

    childColumns1 = [
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
}