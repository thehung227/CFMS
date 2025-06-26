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

// Danh mục đối tượng
export class LayoutCustomerExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB20Customer',
                FilterKey: "IsGroup = 0 AND IsActive = 1 AND (ParentId IN (8, 9) OR Code IN ('CI-00073'))",// AND ProductCostId <> ''" AND ProductCostId = '{VAR=Filter.ProductCostId}'
                OrderBy: 'Name',
                RowPage: 50
            },
            Child: {
                Name: 'vB30BizDocApprove_ExplorerCustomer',
                ParentKey: 'CCMBudgetId',
                ChildKey: 'BizDocId',
                OrderBy: 'ApproveGroup'
            }
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'KLTT ĐTC- {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
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
        },
        // CopiedValues: {
        //     parameter: { 'Commandkey': 'itemslist-editor', 'ParentCode': '{EXPR=ParentCode}', 'ParentId': '{EXPR=ParentId}', 'ItemGroupType': '{EXPR=ItemGroupType}' }
        // }
    }

    lookup3 = {
        Table: 'B00TMCtcDocStatus',
        Filter: "CommandWeb = 'rowsPage' AND IsActive=1",
    }

    parentGrid = [
        {
            header: 'Mã đối tượng',
            binding: 'Code',
            width: 120,
            dataType: 'String'
        },
        {
            header: 'Tên đối tượng',
            binding: 'Name',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Công việc',
            binding: 'JobName',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Thị trường',
            binding: 'TerritoryName',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Phân loại',
            binding: 'CustomerLevelCode',
            width: 100,
            dataType: 'String'
        },
        {
            header: 'Người liên hệ',
            binding: 'Person',
            width: 100,
            dataType: 'String'
        },
        {
            header: 'Điện thoại',
            binding: 'PersonTel',
            width: 100,
            dataType: 'String'
        },
        {
            header: 'Chức vụ',
            binding: 'PersonPosition',
            width: 100,
            dataType: 'String'
        },
        {
            header: 'Mã số thuế',
            binding: 'TaxRegNo',
            width: 100,
            dataType: 'String'
        },
        {
            header: 'Số CMND',
            binding: 'IdCardNo',
            width: 100,
            dataType: 'String'
        },
        {
            header: 'Địa chỉ',
            binding: 'Address',
            width: 300,
            dataType: 'String'
        },
        {
            header: '_Email',
            binding: 'Email',
            width: 100,
            dataType: 'String'
        },
        {
            header: 'Ghi chú',
            binding: 'Notes',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Sửa đổi cuối',
            binding: 'ModifiedByName',
            width: 250,
            dataType: 'String'
        },
        {
            header: 'Đã gửi duyệt',
            binding: 'ApproveSend',
            width: 110,
            dataType: 'Boolean'
        },
        {
            header: 'Có hiệu lực',
            binding: 'CompletedApprove',
            width: 110,
            dataType: 'Boolean'
        },
        {
            header: 'Id_',
            binding: 'Id',
            width: 0,
            dataType: 'Number'
        },
        {
            header: 'Loại đối tượng',
            binding: 'CustomerTypeName',
            width: 0,
            dataType: 'String'
        },
        {
            header: 'Nhóm đối tượng',
            binding: 'ParentName',
            width: 0,
            dataType: 'String'
        },
    ]

    childGrid = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
        },
        // {
        //     header: 'Bộ phận',
        //     binding: 'DeptName',
        //     width: 250,
        //     dataType: 'String'
        // },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 200,
            dataType: 'String'
        },
        // {
        //     header: 'Người thực hiện',
        //     binding: 'EmployeeName',
        //     width: 150
        // },
        {
            header: 'Người đã thực hiện',
            binding: 'EmployeeNameApprove',
            width: 150
        },
        {
            header: 'Đã xử lý',
            binding: 'ApproveStatus',
            width: 80,
            dataType: 'Boolean',
            textAlign: 'center'
        },
        {
            header: 'Trạng thái',
            binding: 'ApproveStatusName',
            width: 100
        },
        {
            header: 'Ý kiến',
            binding: 'Comment',
            width: 200,
            dataType: 'String',
            isContentHtml: true
        },
        {
            header: 'Số ngày thực hiện',
            binding: 'NumberOfDays',
            width: 150,
            dataType: 'Number',
            format: 'n0'
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
    ]
}

export class LayoutCustomerEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB20Customer_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    List_BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1,
                    ProductCostId: '{VAR=Filter.ProductCostId}',
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB20CustomerBankAccount_Edit',
                    ParentKey: 'Code',
                    ChildKey: 'CustomerCode',
                    DefaultValues: {
                        CustomerName: 'Parent.Name'
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
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        BizDocId: 'Parent.CCMBudgetId',
                        DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                        BuiltinOrder: '1'
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
                        BizDocId: 'Parent.CCMBudgetId',
                        BuiltinOrder: '1',
                        DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    }
                },
                {
                    Name: 'vB30BizDoc_HDPLHDListCus',
                    ParentKey: 'Code',
                    ChildKey: 'CustomerCode'
                },
                {
                    Name: 'vB20CustomerMeeting',
                    ParentKey: 'Code',
                    ChildKey: 'CustomerCode',
                    DefaultValues: {
                        BuiltinOrder: '1'
                    }
                },
            ]
        }
    }

    evaluators = {
        'Evaluator_ServerUpdating_Check_CodeUnique': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'Code,{VAR=ColumnName_Code},{VAR=TableName_B20Customer},Id,CreatedAt',
            Command: 'usp_COTECCONS_UniqueCatg',
            MessageText: 'Mã đối tượng - đã có giá trị tương tự',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_TaxRegNo': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'TaxRegNo,Code,CustomerType,Id',
            Command: 'ufn_B20Customer_TaxRegNo_CheckTrungMa',
            MessageText: 'Mã số thuế - đã có giá trị tương tự hoặc không hợp lệ (độ dài, chứa khoảng trắng)',
            IgnoreError: 0,
        },
        'Evaluator_ServerConstraint_Check_IdCardNo': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'IdCardNo,Code,CustomerType,Id',
            Command: 'ufn_B20Customer_CheckIdCardNo',
            MessageText: 'Số CMND - đã có giá trị tương tự hoặc không hợp lệ',
            IgnoreError: 0,
        },
        'Evaluator_serverUpdating_IdCardNo_TaxRegNo_CheckEmpty': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'IdCardNo,TaxRegNo,CustomerType',
            Command: 'ufn_SOL_B20Customer_CheckEmpty',
            MessageText: 'Số CMND hoặc Mã số thuế không được bỏ trắng hoặc chứa khoảng trắng',
            IgnoreError: 0,
        },
        'Evaluator_ServerConstraint_CreateCustomerCode': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Id',
            Command: 'usp_SOL_CreateCustomerCode',
            zExpr: 'ApproveSend == false'
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProcessCode,ProductCostId,{VAR=EmptyField_ParentBizDocId}',
            Command: 'usp_B30BizDocApprove_GetData',
            // DataMember: '',
            OutputTable: 2
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},{VAR=EmptyField_BizDocId},CCMBudgetId,{VAR=Branch.Ma_Dvcs},{VAR=B20Customer_DocCode},ProductCostId',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true && CompletedApprove == false'
        },
        'Evaluator_serverUpdating_CheckModified': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: '{VAR=User.Id}',
            Command: 'ufn_SOL_B20Customer_CheckModified',
            MessageText: 'Người sử dụng hiện thời không có quyền chỉnh sửa',
            IgnoreError: 0,
            zExpr: 'CompletedApprove == true'
        },
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'CCMBudgetId,{VAR=B20Customer_DocCode},{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Conteccons_NotChangeWhenApproveSent',
            MessageText: 'Không được thay đổi khi đã gửi duyệt',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true && CompletedApprove == false'
        },
        'Evaluator_ServerConstraint_Document_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId0',
            Command: 'usp_CUS_BizDocDocument_GetData',
            OutputTable: 4
        },
    }

    serverConstraint = [
        // 'Evaluator_ServerConstraint_Check_TaxRegNo',
        // 'Evaluator_ServerConstraint_Check_IdCardNo'
    ]

    serverUpdating = [
        // 'Evaluator_ServerConstraint_Check_TaxRegNo',
        // 'Evaluator_ServerConstraint_Check_IdCardNo',
        // 'Evaluator_ServerUpdating_Check_CodeUnique',
        // 'Evaluator_serverUpdating_IdCardNo_TaxRegNo_CheckEmpty',
        // 'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        // 'Evaluator_serverUpdating_CheckModified'
    ]

    serverUpdated: string[] = [
        // 'Evaluator_ServerConstraint_CreateCustomerCode',
        // 'Evaluator_UpdateInfo_WhenApproveSend'
    ]

    buttonLoadChild: string[] = [
        // 'Evaluator_ServerConstraint_Approve_GetData',
        // 'Evaluator_ServerConstraint_Document_GetData'
    ];

    buttonCommand: string[] = [

    ]

    importCommand: string[] = [

    ]

    columnChanged = {
        // ProcessCode: {
        //     Evaluators: [
        //         'Evaluator_ServerConstraint_Approve_GetData'
        //     ]
        // }
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
                    key: 'DocDate',
                    label: 'Ngày tạo',
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
                    isNewRow: true
                }),
                new TextBoxInput({
                    key: 'Address',
                    label: 'Địa chỉ',
                    validators: [Validators.required],
                    col: 12,
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
                    isNewRow: true,
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ClassCode1',
                    label: 'Xếp hạng',
                    lookupKey: 'Class',
                    lookupfilter: "IsActive=1 AND ParentCode='DanhGiaDoiTac'",
                    hideValueMember: false,
                  
                    col: 6
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'IdCardNo',
                    label: 'Số CMND',
                    visible: "'{EXPR=CustomerType}'=='0' || '{EXPR=CustomerType}'=='1'",
                    col: 6,
                    isNewRow: true
                }),
                new TextBoxInput({
                    key: 'TaxRegNo',
                    label: 'Mã số thuế',
                    visible: "'{EXPR=CustomerType}'!='0' && '{EXPR=CustomerType}'!='1'",
                    col: 6,
                    isNewRow: true
                }),
                new LookupBoxInput({
                    key: 'TerritoryCode',
                    label: 'Phạm vi thị trường',
                    lookupKey: 'Territory',
                    lookupfilter: 'IsActive=1',
                    hideValueMember: false,
                  
                    col: 6
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Person0',
                    label: 'Người đại diện (theo PL)',
                    col: 6,
                    
                    isNewRow: true
                }),
                new TextBoxInput({
                    key: 'Person',
                    label: 'Người liên hệ',
                    col: 6,
                    
                }),
                new TextBoxInput({
                    key: 'PersonTel',
                    label: 'SĐT người liên hệ',
                    col: 6,
                    
                }),
                new TextBoxInput({
                    key: 'Email',
                    label: 'Email người liên hệ',
                    col: 6,
                    // validators: [Validators.required],
                }),
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'Giấy chứng nhận ĐKDN',
                //     col: 6
                // }, this.srv),
                new TextBoxInput({
                    key: 'PersonPosition',
                    label: 'Chức vụ người liên hệ',
                    col: 6,
                    
                }),
               
                new TextBoxInput({
                    key: 'Notes',
                    label: 'Ghi chú',
                    col: 6,
                    // validators: [Validators.required],
                }),
              
                
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
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    col: 6,
                    isDisabled: 'true',
                    isNewRow: true
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
            header: 'Mã gói thầu',
            binding: 'JobCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'BidPackage',
            bindingList: {
                BidPackageName: 'JobName'
            },
            // multiSelection: true,
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 150,
            ignoreError: 1
        },
        {
            header: 'Tên gói thầu',
            binding: 'JobName',
            isRequired: true,
            isReadOnly: 'true',
            width: 450
        },
        {
            header: 'Phân loại',
            binding: 'ContractType',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            bindingList: {
                Name: 'ContractTypeName'
            },
            // multiSelection: true,
            lookupfilter: "ParentCode='BidPackageType'",
            width: 150,
            ignoreError: 1
        },
        {
            header: 'Tên phân loại',
            binding: 'ContractTypeName',
            isRequired: true,
            width: 200,
            isReadOnly: 'true'
        },
        {
            header: 'Thông tin liên hệ',
            binding: 'ContractInfo',
            isRequired: true,
            width: 200
        },
    ];

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
    ];

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
    ];

    childColumns4 = [
        {
            header: 'Ghi chú',
            binding: 'Description',
            width: 250
        },
        {
            header: 'Yêu cầu đính kèm',
            binding: 'Attached',
            dataType: 'Boolean',
            width: 80,
            isReadOnly: 'true'
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 500,
            dataType: 'Object',
            // validators: "{EXPR=Description} != '' && {EXPR=Description} == 'Yêu cầu đính kèm' && {EXPR=FilePath}==0",
            // validators: "{EXPR=Attached} == true && {EXPR=Description} != 'Theo mẫu công ty ban hành' && {EXPR=FilePath}==0",
            // validatorMessage: 'Yêu cầu đính kèm tài liệu',
            // ignoreError: 1
            // exprReadOnly: "{EXPR=Attached} == true && {EXPR=Description} != ''"
        }
    ];

    childColumns5 = [
        // {
        //     header: '',
        //     binding: 'Button',
        //     dataType: 'Object',
        //     isButton: true,
        //     textButton: 'Mở',
        //     width: 60,
        //     linkCommand: {
        //         directory: "{EXPR=DocCode} == 'C3' || {EXPR=DocCode} == 'C4' ? 'regcontract_view' : {EXPR=DocCode} == 'C1' ? 'regcontractinvestor' : ''",
        //         type: "detail",
        //         key: 'Id',
        //         command: "{EXPR=DocCode} == 'C3' ? 'detailc3' : {EXPR=DocCode} == 'C4' ? 'detailc4' : 'detail'"
        //     }
        // },
        {
            header: 'Loại hồ sơ',
            binding: 'DocuName',
            width: 120
        },
        {
            header: 'Ngày hiệu lực',
            binding: 'EffectiveDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            width: 100
        },
        {
            header: 'Số hồ sơ',
            binding: 'DocNo',
            width: 180
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            width: 250
        },
        {
            header: 'Giá trị',
            binding: 'Value',
            width: 120,
            dataType: 'Number'
        },
        {
            header: 'Id',
            binding: 'Id',
            width: 80,
            dataType: 'Number'
        },
        {
            header: 'Gói thầu',
            binding: 'ProductName',
            width: 400
        },
        {
            header: 'Đại diện ký HĐ',
            binding: 'ContactPerson',
            width: 150
        },
        {
            header: 'Chức vụ',
            binding: 'PositionName',
            width: 100
        },
        {
            header: 'Thông tin liên lạc',
            binding: 'BizContract',
            width: 350
        },
        {
            header: 'Điểm đánh giá',
            binding: 'DiemDG',
            width: 100,
            dataType: 'Number'
        },
        {
            header: 'Loại đánh giá',
            binding: 'LoaiDanhGia',
            width: 350
        },
        {
            header: 'Ghi chú đánh giá',
            binding: 'GhiChuDG',
            width: 350
        },
    ];

    childColumns6 = [
        {
            header: 'Họp',
            binding: 'TypeMeeting',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            bindingList: {
                Name: 'TypeMeetingName'
            },
            // multiSelection: true,
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='TYPEMEETING'",
            width: 80,
            ignoreError: 1
        },
        {
            header: 'Họp',
            binding: 'TypeMeetingName',
            isRequired: true,
            isReadOnly: 'true',
            width: 200
        },
        {
            header: 'Ngày họp',
            binding: 'EffectiveDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            width: 100
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            isRequired: true,
            width: 350
        },
        {
            header: 'Nơi họp',
            binding: 'AddressMeeting',
            isRequired: true,
            width: 200
        },
        {
            header: 'Thành phần',
            binding: 'Participants',
            isRequired: true,
            width: 400
        }
       
    ];
}