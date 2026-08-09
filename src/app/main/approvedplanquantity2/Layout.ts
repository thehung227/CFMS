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

// phê duyệt ký kêt hợp đồng
export class LayoutApprovedPlanQuantity2Explorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_CCMBudgetExplorer',
                FilterKey: "ApproveSend = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'K1' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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

export class LayoutApprovedPlanQuantity2Editor implements IEditorFormulaDeclaration {

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
                Name: 'vB30BizDocApprove_CCMBudgetEdit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'M3',
                    CCMBudgetId: '',
                    CurrencyCode: 'VND',
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB30CCMBudgetDetailKL1_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'CCMBudgetId',
                    Sort: 'BuiltinOrder',
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder'
                },
                {
                    Name: 'vB30BizDocApprove_AEditBudget',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: 'Parent.CCMBudgetId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
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
                {
                    Name: 'vB30CCMBudgetMapSupp_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BuiltinOrder: '1'
                    }
                },
                {
                    Name: 'vB30CCMBudgetDetailKL2_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'CCMBudgetId',
                    Sort: 'BuiltinOrder',
                },
                {
                    Name: 'vB30CCMBudgetDetailKL3_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'CCMBudgetId',
                    Sort: 'BuiltinOrder',
                },
                {
                    Name: 'vB30CCMBudgetDetailKL4_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'CCMBudgetId',
                    Sort: 'BuiltinOrder',
                },
                {
                    Name: 'vB30CCMBudgetDetailKL5_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'CCMBudgetId',
                    Sort: 'BuiltinOrder',
                }
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
                    lookupfilter: "",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    type: 'text',
                    col: 12,
                    isReadOnly: 'true',
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
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 100
        },
        {
            header: 'Hạng mục',
            binding: 'ActivityCode',
            width: 150,
            validators: "{EXPR=ActivityCode} == ''",
            validatorMessage: 'Mã hạng mục, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Mã khối lượng',
            binding: 'JobCode',
            dataType: 'Array',
            lookupKey: 'DmQLKL', //từ: vB20DmQLKL
            bindingList: {
                Name: 'JobName'
            },
            // multiSelection: true,
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 150,
            validators: "{EXPR=JobCode} == ''",
            validatorMessage: 'Mã khối lượng, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên công tác',
            binding: 'JobName',
            isRequired: true,
            width: 250
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 100
        },
        {
            header: 'KH Khối lượng (CĐT)',
            binding: 'QtyCDT',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'KH Khối lượng (BCH Tính)',
            binding: 'QtyBCH',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'NTP 01',
            binding: 'Qty01',
            width: 110,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 02',
            binding: 'Qty02',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 03',
            binding: 'Qty03',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 04',
            binding: 'Qty04',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 05',
            binding: 'Qty05',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 06',
            binding: 'Qty06',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 07',
            binding: 'Qty07',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 08',
            binding: 'Qty08',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 09',
            binding: 'Qty09',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 10',
            binding: 'Qty10',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50,
            isReadOnly: 'true'
        },
        // {
        //     header: 'Bậc',
        //     binding: 'Level',
        //     dataType: 'Number',
        //     width: 50,
        //     format: 'n0',
        //     isReadOnly: 'true'
        // },
        // {
        //     header: 'Công thức',
        //     binding: 'Formula',
        //     width: 250,
        //     isReadOnly: 'true'
        // }
    ];

    childColumns1 = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
        },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 250
        },
        {
            header: 'Người thực hiện',
            binding: 'EmployeeName',
            width: 230
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
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
            isReadOnly: 'true'
        },
        {
            header: 'Mã bộ phận',
            binding: 'DeptCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Dept',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 0,
            isReadOnly: 'true'
        },
        {
            header: 'Bộ phận',
            binding: 'DeptName',
            width: 300,
            isReadOnly: 'true'
        },
        {
            header: 'Mã cấp bậc',
            binding: 'PositionCode',
            dataType: 'Array',
            lookupKey: 'Position',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 0,
            isReadOnly: 'true'
        },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Mã nhân viên',
            binding: 'EmployeeCode',
            width: 100,
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM dbo.ufn_B30BizDocApprove_GetEmployee('{EXPR=ProductCostId}','{EXPR=ProductCostId}','{EXPR=PositionCode}'))",
            validators: "{EXPR=EmployeeCode} == ''",
            validatorMessage: 'Không được bỏ trống giá trị',
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
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM dbo.ufn_B30BizDocApprove_GetEmployee('{EXPR=ProductCostId}','{EXPR=ProductCostId}','{EXPR=PositionCode}'))",
            width: 120,
            validators: "{EXPR=EmployeeCode} != '' && {EXPR=EmployeeCode}.toString().indexOf(',') > 0 && {EXPR=EmployeeCodeReal} == ''",
            validatorMessage: 'Không được bỏ trống giá trị',
            ignoreError: 1
        },
        {
            header: 'Số ngày xử lý',
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
    ];

    childColumns3 = [
        {
            header: 'Tên tài liệu',
            binding: 'Description',
            width: 250
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 500,
            dataType: 'Object',
            allowRemove: false,
            allowView: true,
            allowDownLoad: true,
            allowUpload: false,
            folderId: '{EXPR=IdCCMBudget}'
        }
    ];

    childColumns4 = [
        {
            header: 'Code NTP',
            binding: 'Title',
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: 'Mã đối tượng',
            binding: 'CustomerCode',
            width: 150,
            dataType: 'Array',
            lookupKey: 'Customer',
            lookupfilter: "IsGroup=0 AND IsActive=1",
            bindingList: {
                Name: "CustomerName"
            },
            validators: "{EXPR=CustomerCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên đối tượng',
            binding: 'CustomerName',
            width: 400,
            isReadOnly: 'true'
        },
        {
            header: 'Id hợp đồng',
            binding: 'BizDocId_C1',
            width: 150,
            dataType: 'Array',
            lookupKey: 'BizDoc_CTC',
            bindingList: {
                DocInfo: 'DocInfo'
            },
            lookupfilter: "BizDocId IN (SELECT BizDocId FROM dbo.ufn_SOL_FilterContactOnCostReve('{EXPR=ProductCostId}','{EXPR=CustomerCode}'))"
        },
        {
            header: 'Nội dung hợp đồng',
            binding: 'DocInfo',
            width: 600,
            isReadOnly: 'true'
        },
    ];

    childColumns5 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 100
        },
        {
            header: 'Hạng mục',
            binding: 'ActivityCode',
            width: 150,
            validators: "{EXPR=ActivityCode} == ''",
            validatorMessage: 'Mã hạng mục, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Mã khối lượng',
            binding: 'JobCode',
            dataType: 'Array',
            lookupKey: 'DmQLKL',
            bindingList: {
                Name: 'JobName'
            },
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 150,
            validators: "{EXPR=JobCode} == ''",
            validatorMessage: 'Mã khối lượng, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên công tác',
            binding: 'JobName',
            isRequired: true,
            width: 250
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 100
        },
        {
            header: 'KH Khối lượng (CĐT)',
            binding: 'QtyCDT',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'KH Khối lượng (BCH Tính)',
            binding: 'QtyBCH',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'NTP 11',
            binding: 'Qty01',
            width: 110,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 12',
            binding: 'Qty02',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 13',
            binding: 'Qty03',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 14',
            binding: 'Qty04',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 15',
            binding: 'Qty05',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 16',
            binding: 'Qty06',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 17',
            binding: 'Qty07',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 18',
            binding: 'Qty08',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 19',
            binding: 'Qty09',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 20',
            binding: 'Qty10',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50,
            isReadOnly: 'true'
        },
    ];

    childColumns6 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 100
        },
        {
            header: 'Hạng mục',
            binding: 'ActivityCode',
            width: 150,
            validators: "{EXPR=ActivityCode} == ''",
            validatorMessage: 'Mã hạng mục, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Mã khối lượng',
            binding: 'JobCode',
            dataType: 'Array',
            lookupKey: 'DmQLKL',
            bindingList: {
                Name: 'JobName'
            },
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 150,
            validators: "{EXPR=JobCode} == ''",
            validatorMessage: 'Mã khối lượng, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên công tác',
            binding: 'JobName',
            isRequired: true,
            width: 250
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 100
        },
        {
            header: 'KH Khối lượng (CĐT)',
            binding: 'QtyCDT',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'KH Khối lượng (BCH Tính)',
            binding: 'QtyBCH',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'NTP 21',
            binding: 'Qty01',
            width: 110,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 22',
            binding: 'Qty02',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 23',
            binding: 'Qty03',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 24',
            binding: 'Qty04',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 25',
            binding: 'Qty05',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 26',
            binding: 'Qty06',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 27',
            binding: 'Qty07',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 28',
            binding: 'Qty08',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 29',
            binding: 'Qty09',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 30',
            binding: 'Qty10',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50,
            isReadOnly: 'true'
        },
    ];

    childColumns7 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 100
        },
        {
            header: 'Hạng mục',
            binding: 'ActivityCode',
            width: 150,
            validators: "{EXPR=ActivityCode} == ''",
            validatorMessage: 'Mã hạng mục, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Mã khối lượng',
            binding: 'JobCode',
            dataType: 'Array',
            lookupKey: 'DmQLKL',
            bindingList: {
                Name: 'JobName'
            },
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 150,
            validators: "{EXPR=JobCode} == ''",
            validatorMessage: 'Mã khối lượng, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên công tác',
            binding: 'JobName',
            isRequired: true,
            width: 250
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 100
        },
        {
            header: 'KH Khối lượng (CĐT)',
            binding: 'QtyCDT',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'KH Khối lượng (BCH Tính)',
            binding: 'QtyBCH',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'NTP 31',
            binding: 'Qty01',
            width: 110,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 32',
            binding: 'Qty02',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 33',
            binding: 'Qty03',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 34',
            binding: 'Qty04',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 35',
            binding: 'Qty05',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 36',
            binding: 'Qty06',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 37',
            binding: 'Qty07',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 38',
            binding: 'Qty08',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 39',
            binding: 'Qty09',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 40',
            binding: 'Qty10',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50,
            isReadOnly: 'true'
        },
    ];

    childColumns8 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 100
        },
        {
            header: 'Hạng mục',
            binding: 'ActivityCode',
            width: 150,
            validators: "{EXPR=ActivityCode} == ''",
            validatorMessage: 'Mã hạng mục, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Mã khối lượng',
            binding: 'JobCode',
            dataType: 'Array',
            lookupKey: 'DmQLKL',
            bindingList: {
                Name: 'JobName'
            },
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 150,
            validators: "{EXPR=JobCode} == ''",
            validatorMessage: 'Mã khối lượng, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên công tác',
            binding: 'JobName',
            isRequired: true,
            width: 250
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 100
        },
        {
            header: 'KH Khối lượng (CĐT)',
            binding: 'QtyCDT',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'KH Khối lượng (BCH Tính)',
            binding: 'QtyBCH',
            dataType: 'Number',
            isRequired: true,
            width: 110,
            format: 'n2',
        },
        {
            header: 'NTP 41',
            binding: 'Qty01',
            width: 110,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 42',
            binding: 'Qty02',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 43',
            binding: 'Qty03',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 44',
            binding: 'Qty04',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 45',
            binding: 'Qty05',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 46',
            binding: 'Qty06',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 47',
            binding: 'Qty07',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 48',
            binding: 'Qty08',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 49',
            binding: 'Qty09',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'NTP 50',
            binding: 'Qty10',
            width: 120,
            format: 'n2',
            dataType: 'Number'
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50,
            isReadOnly: 'true'
        },
    ];
}
