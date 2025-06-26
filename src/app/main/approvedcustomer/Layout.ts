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

export class LayoutApprovedCustomerEditor implements IEditorFormulaDeclaration {

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
        'btnBaoCao': {
            directory: 'reporterplansigncon',
            type: 'view',
            key: 'REP02_CCM_KHKK',
            parameter: { 'Commandkey': 'REP02_CCM_KHKK', 'ProductCostId': '{EXPR=ProductCostId}', 'CCMBudgetId': '{EXPR=CCMBudgetId}', 'BranchCode': '{VAR=Branch.Ma_Dvcs}' }
        }
    }

    columnsReadOnly = [];

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_CustomerEdit',
                DefaultValues: {
                }
            },
            Child: [
                {
                    Name: 'vB20CustomerBankAccount_Edit',
                    ParentKey: 'Code',
                    ChildKey: 'CustomerCode',
                    DefaultValues: {
                    }
                },
                {
                    Name: 'vB20CustomerCCMInfo',
                    ParentKey: 'Code',
                    ChildKey: 'CustomerCode',
                    DefaultValues: {
                    }
                },
                {
                    Name: 'vB30BizDocApprove_EditCustomer',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                    }
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                    }
                },
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                    }
                },
            ]
        },
        PrintDocument: {
            Key: 'CCMBudgetViewer',
            Text: 'Kế hoạch ký kết hợp đồng - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30CCMBudget_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Kế hoạch ký kết hợp đồng",
                    FileName: "Kế hoạch ký kết hợp đồng - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "1.Ke_Hoach_Ky_Ket_Hop_Dong_XemDuyet.docx",
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
                // new LookupBoxInput({
                //     key: 'ParentCode',
                //     label: 'Nhóm đối tượng',
                //     lookupKey: 'ItemGroupTMCode',
                //     lookupfilter: "IsActive=1",
                //     hideValueMember: true,
                //     binding: {
                //         ItemGroupType: 'ItemGroupType',
                //         Id: 'ParentId'
                //     },
                //     col: 6,
                // }, this.srv, this.parentData),
                new DateBoxInput({
                    key: 'DateSend',
                    label: 'Ngày gửi duyệt',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    visible: 'false'
                }),                
                new TextBoxInput({
                    key: 'Code',
                    label: 'Mã đối tượng',
                    type: 'text',
                    validators: [Validators.required],
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Name',
                    label: 'Tên đối tượng',
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    isNewRow: true
                }),
                new TextBoxInput({
                    key: 'Address',
                    label: 'Địa chỉ',
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    isNewRow: true
                }),                
                new LookupBoxInput({
                    key: 'CustomerType',
                    label: 'Loại đối tượng',
                    lookupKey: 'Class',
                    lookupfilter: "ParentCode='DMDT_Loai_Dt'",
                    hideValueMember: true,
                    validators: [Validators.required],
                    binding: {
                    },
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'TerritoryCode',
                    label: 'Phạm vi thị trường',
                    lookupKey: 'Territory',
                    lookupfilter: 'IsActive=1',
                    hideValueMember: false,
                    // validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                }, this.srv, this.parentData),                 
                new TextBoxInput({
                    key: 'Person0',
                    label: 'Người đại diện (theo PL)',
                    col: 6,
                    // validators: [Validators.required],
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',                    
                    isNewRow: true
                }),
                new TextBoxInput({
                    key: 'Person',
                    label: 'Người liên hệ',
                    col: 6,
                    // validators: [Validators.required],
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',                    
                }),      
                new TextBoxInput({
                    key: 'PersonTel',
                    label: 'SĐT người liên hệ',
                    col: 6,
                    // validators: [Validators.required],
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',                    
                }),
                new TextBoxInput({
                    key: 'Email',
                    label: 'Email người liên hệ',
                    col: 6,
                    // validators: [Validators.required],
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',                    
                }),                 
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'Giấy chứng nhận ĐKDN',
                //     col: 6
                // }, this.srv),
                new TextBoxInput({
                    key: 'IdCardNo',
                    label: 'Số CMND',
                    isNewRow: true,
                    visible: "'{EXPR=CustomerType}'=='0' || '{EXPR=CustomerType}'=='1'",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                }),
                new TextBoxInput({
                    key: 'TaxRegNo',
                    label: 'Mã số thuế',
                    visible: "'{EXPR=CustomerType}'!='0' && '{EXPR=CustomerType}'!='1'",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                }),
                new LookupBoxInput({
                    key: 'CustomerLevelCode',
                    label: 'Phân loại',
                    lookupKey: 'CustomerLevel',
                    lookupfilter: 'IsGroup=0 AND IsActive=1',
                    hideValueMember: false,
                    // validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Notes',
                    label: 'Ghi chú',
                    col: 6,
                    // validators: [Validators.required],
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                }),
                new CheckBoxInput({
                    key: 'IsSCRelation',
                    label: 'Đối tác CĐT chỉ định',
                    col: 6,
                    isDisabled: 'true'
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: 'ParentId=78 AND IsActive=1 AND DocStatus=4', 
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    isNewRow: true
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ phòng, ban',
                    lookupKey: 'ProductCost',
                    // lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND RowId = '{VAR=Filter.ProductCostId}'",
                    validators: [Validators.required],
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
                // new LookupBoxInput({
                //     key: 'InformMethod',
                //     label: 'Kiểu thông báo',
                //     lookupKey: 'Class',
                //     lookupfilter: "ParentCode='InformMethod'",
                //     hideValueMember: false,
                //     isDisabled: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;',
                //     col: 6
                // }, this.srv, this.parentData),
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
            ]
        })
    ];

    childColumns = [
        {
            header: 'Số tài khoản',
            binding: 'BankAccountNo',
            width: 200
        },
        {
            header: 'Mã ngân hàng',
            binding: 'BankCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Bank',
            bindingList: {
                Name: 'Description',
                Province: 'Province'
            },
            // multiSelection: true,
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 200,
            validators: "{EXPR=BankCode} == ''",
            validatorMessage: 'Mã ngân hàng, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên ngân hàng',
            binding: 'Description',
            width: 300,
            isReadOnly: 'true'
        },
        {
            header: 'Tỉnh, thành phố',
            binding: 'Province',
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Tên người nhận',
            binding: 'CustomerName',
            width: 300,
            isReadOnly: 'true'
        }
    ];

    childColumns1 = [
        {
            header: 'Mã công việc',
            binding: 'JobCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Job',
            bindingList: {
                Name: 'JobName'
            },
            // multiSelection: true,
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 150,
            validators: "{EXPR=JobCode} == ''",
            validatorMessage: 'Mã công việc, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên công việc',
            binding: 'JobName',
            isRequired: true,
            width: 450
        },
    ]    

    childColumns2 = [
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
            isReadOnly: 'true',
            dataType: 'Array',
            lookupKey: 'Dept',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 0
        },
        {
            header: 'Bộ phận',
            binding: 'DeptName',
            width: 300,
            isReadOnly: 'true'
        },
        {
            header: 'Mã cấp bậc',
            binding: 'PositionCode',
            width: 0,
            isReadOnly: 'true',
            dataType: 'Array',
            lookupKey: 'Position',
            lookupfilter: 'IsGroup=0 AND IsActive=1'
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
            width: 100,
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
            width: 150,
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
            dataType: 'Number',
            width: 100,
            isReadOnly: 'true'
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
        },        
        {
            header: 'Được trả hồ sơ',
            binding: 'ApproveReturn',
            width: 100,
            dataType: 'Boolean',
            isReadOnly: 'true'
        },
        // {
        //     header: 'Trả về cấp bậc',
        //     binding: 'PositionCodeReturn',
        //     width: 100,
        //     isReadOnly: 'true'
        // }
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

    childColumns4 = [
        {
            header: 'Ghi chú',
            binding: 'Description',
            width: 250
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
            folderId: "{EXPR=IdCustomer}"
        }
    ]
}