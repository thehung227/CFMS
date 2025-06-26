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

// Tài liệu công trường
export class LayoutConsDocumentExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30ConsDocument_Explorer',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND IsActive = 1 AND ISNULL(BranchCode,'') = '{VAR=Branch.Ma_Dvcs}'",
                OrderBy: 'Id', //rất quan trọng, lỗi méo tìm đc đâu
                RowPage: 50
            }
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'KLTT ĐTC- {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            LayoutPrint: [],
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'ItemNo',
                    width: 70,
                    dataType: 'String'
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
            header: 'Gói thầu/ PB',
            binding: 'ProductName',
            width: 400,
            dataType: 'String'
        },
        {
            header: 'Diễn giải',
            binding: 'Description',
            width: 400,
            dataType: 'String'
        },
        {
            header: 'Id_Bravo',
            binding: 'Id',
            width: 0,
            dataType: 'Number'
        }
    ]
}

export class LayoutConsDocumentEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30ConsDocument_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1,
                    DocCode: 'UL',
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
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
                    Name: 'vB30ConsDocumentDetail_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
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
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                }
            ]
        }
    }

    evaluators = {
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,ParentBizDocId',
            Command: 'usp_B30BizDocApprove_GetData',
            DataMember: '',
            OutputTable: 2
        }
    }

    serverConstraint = [

    ]

    serverUpdating = [

    ]

    serverUpdated: string[] = [

    ]

    buttonLoadChild: string[] = [

    ];

    buttonCommand: string[] = [

    ]

    importCommand: string[] = [

    ]

    columnChanged = {
        ProcessCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_Approve_GetData'
            ]
        }
    };

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
            }
        }
    ];

    columnsReadOnly = [];

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
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    validators: [Validators.required],
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN ('1','3') AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Hợp đồng',
                    lookupKey: 'BizDoc_CTC',
                    binding: {
                        CustomerCode: 'CustomerCode'
                    },
                    validators: [Validators.required],
                    lookupfilter: "(((DocCode = 'C3' OR (DocCode = 'C4' AND IsSubContractPay = 1)) AND ProductCostId='{EXPR=ProductCostId}' AND ContractTypeFilter='B4') OR (DocCode='C3' AND IsSubContractPay = 1)) AND Closed = 0 AND CompletedApprove=1 AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    col: 12
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
                    col: 12
                }, this.srv, this.parentData), 
                new TextBoxInput({
                    key: 'TaxRegNo',
                    label: 'Mã số thuế',
                    type: 'text',
                    validators: [Validators.required],
                    isDisabled: 'true',
                    col: 6
                }),                               
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Process',
                    lookupfilter: 'IsGroup=0 AND IsActive=1',//"(Code IN (SELECT Code FROM dbo.ufn_Coteccons_Filter_ProcessCodeByBizDocC3('{EXPR=ProductCostId}','{EXPR=ParentBizDocId}','{EXPR=DocCode}','{VAR=Branch.Ma_Dvcs}')))",//('{EXPR=PayTeamType}' = '00') OR 
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12
                }, this.srv, this.parentData),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    col: 6,
                    isDisabled: 'true'
                }),
                new CheckBoxInput({
                    key: 'CompletedApprove',
                    label: 'Đã hoàn thiện duyệt',
                    isDisabled: 'true',
                    col: 6
                })                          
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
            width: 250,
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 500,
            dataType: 'Object'
        }
    ]

    childColumns1 = [
        {
            header: 'Mã hàng',
            binding: 'ItemCode',
            width: 150
        },
        {
            header: 'Tên hàng',
            binding: 'Description',
            width: 250
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 50
        },
        {
            header: 'Số lượng',
            binding: 'Quantity',
            dataType: 'Number',
            width: 150,
            format: 'n2'
        },
        {
            header: 'Đơn giá',
            binding: 'UnitPrice',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: 'Thành tiền',
            binding: 'Amount',
            dataType: 'Number',
            isRequired: true,
            width: 150
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
}