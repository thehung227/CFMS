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

// *********************************KẾ HOẠCH

// Trình đầu tư, GQCV
export class LayoutLiquidationAssetExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30Task_Explore',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND TaskDocCode = 'L1' AND IsActive=1",
                OrderBy: 'ProductName,DocDate DESC,DocNo DESC',
                RowPage: 50,
                DefaultValues: {
                }
            },
            Child: {
                Name: 'vB30BizDocApprove_TaskExplorer',
                ParentKey: 'CCMBudgetId',
                ChildKey: 'BizDocId',
                OrderBy: 'ApproveGroup'
            }
        },
        PrintDocument: {
            Key: 'CCMBudgetViewer',
            Text: 'Trình thanh lý - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30Task_VoucherForm',
            Command_WorkFlow: 'usp_B30Task_VoucherForm_WorkFlow',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Trình thanh lý",
                    FileName: "Trình thanh lý - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "Form-Trình thanh lý.doc",
                    // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: 'MAU9',
                    Name: 'WorkFlow',
                    FileName: 'WorkFlow KHKK - {EXPR=ProductName} - {EXPR=DocNo}',
                    WordName: 'WorkFlow_ThanhLyTaiSan.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ],
            // GroupCols: 'Loai_Dt',
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'BuiltinOrder',
                    width: 73,
                    dataType: 'String',
                    align: 'center'
                },
                {
                    header: 'Thời gian ký kết dự kiến',
                    binding: 'EstimatedTimeDelivery',
                    width: 106,
                    dataType: 'Date',
                    format: 'dd/MM/yyyy'
                },
                {
                    header: 'Nội dung',
                    columns: [
                        {
                            header: 'Công tác',
                            binding: 'JobName',
                            width: 163,
                            dataType: 'String'
                        },
                        {
                            header: 'ĐTC/TP/NCC',
                            binding: 'CustomerName',
                            width: 200,
                            dataType: 'String'
                        },
                    ]
                },
                {
                    header: 'Người ký HĐ',
                    binding: 'Chuc_Vu',
                    width: 105,
                    dataType: 'String'
                },
                {
                    header: 'Giá trị dự kiến ký kết (chưa VAT)',
                    binding: 'OriginalAmount',
                    width: 112,
                    dataType: 'Number',
                    aggregate: 'Sum'
                },
                {
                    header: 'Giá trị thanh toán dự kiến (chưa VAT)',
                    binding: 'PaymentAmount',
                    width: 105,
                    dataType: 'Number',
                    aggregate: 'Sum'
                },
                {
                    header: 'Loại ĐT',
                    binding: 'Loai_Dt',
                    width: 0,
                    dataType: 'String'
                },
            ]
        }
    }

    parentGrid = [
        {
            header: 'Gói thầu/ Phòng, ban',
            binding: 'ProductName',
            width: 200
        },
        {
            header: 'Số hồ sơ',
            binding: 'DocNo',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Ngày lập',
            binding: 'DocDate',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Hạng mục, công việc',
            binding: 'Subject',
            width: 200
        },
        {
            header: 'Số tiền',
            binding: 'Amount',
            width: 150,
            dataType: "Number",
            format: 'N0'
        },        
        {
            header: 'Ngày hoàn thiện duyệt',
            binding: 'FinishDate',
            width: 180,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Đã gửi duyệt',
            binding: 'ApproveSend',
            width: 120,
            dataType: 'Boolean'
        },
        {
            header: 'Hoàn thiện duyệt',
            binding: 'CompletedApprove',
            width: 150,
            dataType: 'Boolean'
        },
        {
            header: 'Đang xử lý',
            binding: 'XuLyTiepTheo',
            width: 150,
            dataType: 'String'
        },
        // {
        //     header: 'Hồ sơ hủy',
        //     binding: 'ClosedApprove',
        //     width: 100,
        //     dataType: 'Boolean'
        // },
        {
            header: 'Người lập',
            binding: 'FullName',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Người gửi duyệt',
            binding: 'EmployeeNameSend',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Id',
            binding: 'Id',
            width: 50,
            dataType: 'Number'
        }
    ]

    childGrid = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center'
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

export class LayoutLiquidationAssetEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    // Khai báo view lấy dữ liệu <Tables> B7
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30Task_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'L1',
                    CCMBudgetId: '',
                    Id: -1,
                    TaskDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
              
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.CCMBudgetId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.TaskDate',
                    }
                },
                {
                    Name: 'vB30BizDocApprove_AEditTask',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: 'Parent.CCMBudgetId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.TaskDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    }
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.CCMBudgetId',
                        DocDate: 'Parent.TaskDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30TaskDetail_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    DefaultValues: {
                        CCMBudgetId: 'Parent.CCMBudgetId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.TaskDate'
                    }
                }
            ]
        },
        PrintDocument: {
            Key: 'CCMBudgetViewer',
            Text: 'Trình đầu tư, GQCV - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30Task_VoucherForm',
            Command_WorkFlow: 'usp_B30Task_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Trình GQCV",
                    FileName: "Trình GQCV - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "NSTH-F28 Phieu trinh giai quyet cong viec.docx",
                    // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: "MAU2",
                    Name: "Trình đầu tư",
                    FileName: "Trình đầu tư - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "NSTH-F29 To trinh duyet dau tu.docx",
                    // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                // {
                //     Layout: 'MAU9',
                //     Name: 'WorkFlow',
                //     FileName: 'WorkFlow KHKK - {EXPR=ProductName} - {EXPR=DocNo}',
                //     WordName: 'WorkFlow_KHKK.docx',
                //     FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                // }
            ],
            // GroupCols: 'Loai_Dt',
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'BuiltinOrder',
                    width: 73,
                    dataType: 'String',
                    align: 'center'
                },
            ]
        }
    };

    evaluators = {
        'Evaluator_ServerConstraint_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,TaskTypeCode,DocCode,Id',
            Command: 'ufn_B30Task_DefaultDocNo',
            zExpr: "ProductCostId != ''",
            DataMember: 'DocRefNo'
        },
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'CCMBudgetId,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Conteccons_NotChangeWhenApproveSent',
            MessageText: 'Không được thay đổi khi đã gửi duyệt',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,{VAR=EmptyField_ParentBizDocId}',
            Command: 'usp_B30BizDocApprove_GetData',
            OutputTable: 1
        },
    
        'Evaluator_TaskDetail_OriginalAmount9': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount",
            Value: "Math.round(Quantity9*OriginalUnitCost)",
            Tables: 3
        },
        'Evaluator_Parent_TotalQuantity_Calculate': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "TotalQuantity",
            Value: 'Quantity9',
            Tables: 3
        },
        'Evaluator_Parent_Amount_Calculate': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "Amount",
            Value: 'OriginalAmount',
            Tables: 3
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},{VAR=EmptyField_BizDocId},CCMBudgetId,{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerUpdated_TaskDetail_UpdateFromParent': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CCMBudgetId',
            Command: 'usp_Newtecons_TaskDetail_UpdateFromParentWEB_Calculate'
        }
    };

    serverConstraint = [
        'Evaluator_ServerConstraint_DefaultDocNo'
    ];

    serverUpdating = [
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange'
    ]

    serverUpdated = [
        'Evaluator_Parent_Amount_Calculate',
        'Evaluator_ServerUpdated_TaskDetail_UpdateFromParent',
        'Evaluator_UpdateInfo_WhenApproveSend',
    ];

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Approve_GetData'
    ];

    buttonCommand: string[] = [

    ];

    importCommand: string[] = [

    ]

    columnChanged = {
        ProcessCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_Approve_GetData'
            ]
        },
       
    };

    columnChangedChild = [
        {
            Tables: 3,
            columnChanged: {
                Quantity9: {
                    Evaluators: [
                        "Evaluator_TaskDetail_OriginalAmount9",
                        'Evaluator_Parent_TotalQuantity_Calculate'
                    ]
                },
                OriginalUnitCost: {
                    Evaluators: [
                        "Evaluator_TaskDetail_OriginalAmount9"
                    ]
                },
                OriginalAmount: {
                    Evaluators: [
                        "Evaluator_Parent_Amount_Calculate",
                    ]
                }
            }
        }
    ];

    columnsReadOnly = [];

    linkReporter = {
        'btnBaoCao': {
            directory: 'reporterplansigncon',
            type: 'view',
            key: 'REP02_CCM_KHKK',
            parameter: { 'Commandkey': 'REP02_CCM_KHKK', 'ProductCostId': '{EXPR=ProductCostId}', 'CCMBudgetId': '{EXPR=CCMBudgetId}', 'BranchCode': '{VAR=Branch.Ma_Dvcs}' }
        }
    }

    panels: PanelBase[] = [
        new TablePanel({
            label: 'Panel 1',
            col: 12,
            controls: [
                new DateBoxInput({
                    key: 'TaskDate',
                    label: 'Ngày lập',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocRefNo',
                    label: 'Số hồ sơ',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/Phòng, ban',
                    lookupKey: 'ProductCost',
                    binding: {
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND RowId = '{VAR=Filter.ProductCostId}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),          
                new TextBoxInput({
                    key: 'Subject',
                    label: 'Hạng mục, công việc',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12
                }),
                new TextBoxInput({
                    key: 'Comment',
                    label: 'Đơn vị thanh lý',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12
                }),
                new NumberBoxInput({
                    key: 'TotalQuantity',
                    label: 'Tổng khối lượng',
                    validators: [Validators.required],
                    isReadOnly: 'true',
                    col: 6
                }),
           
                new NumberBoxInput({
                    key: 'Amount',
                    label: 'Tổng giá trị',
                    validators: [Validators.required],
                    isReadOnly: 'true',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive=1 AND Ma_Ct='{EXPR=DocCode}'",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
                new RichTextBoxInput({
                    key: 'Description',
                    label: 'Các căn cứ',
                    
                    validators: [Validators.required],
                    col: 12
                }),
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
            header: 'Ghi chú',
            binding: 'Description',
            width: 250
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 500,
            dataType: 'Object',
            //validators: "{EXPR=Description} != '' && {EXPR=Description} == 'Yêu cầu đính kèm' && {EXPR=FilePath}==0",
            validators: "{EXPR=Attached} == true && {EXPR=Description} != 'Theo mẫu công ty ban hành' && {EXPR=FilePath}==0",
            validatorMessage: 'Yêu cầu đính kèm tài liệu',
            ignoreError: 1
            //exprReadOnly: "{EXPR=Attached} == true && {EXPR=Description} != ''"
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
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Dept',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 0,
            isReadOnly: 'true'
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
            dataType: 'Array',
            lookupKey: 'Position',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 0,
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
            width: 100,
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId}' AND PositionCode = '{EXPR=PositionCode}')",
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

    childColumns2 = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center'
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
    childColumns3 = [
        {
            header: 'STT',
            binding: 'BuiltinOrder',
            width: 100
        },
        {
            header: 'Diễn giải',
            binding: 'Description',
            allowEditing: false,
            width: 250
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 50
        },
        {
            header: 'Khối lượng',
            binding: 'Quantity9',
            dataType: 'Number',
            width: 100,
            format: 'n3'
            // exprReadOnly: '1==1'
        },
        {
            header: 'Đơn giá VNĐ',
            binding: 'OriginalUnitCost',
            dataType: 'Number',
            width: 150,
            format: 'n2'
        },
        {
            header: 'Thành tiền VNĐ',
            binding: 'OriginalAmount',
            width: 150,
            dataType: 'Number',
            //exprFormat: "'{EXPR=CurrencyCode}' == 'VND' ? 'n0' : 'n2'"
        },
        {
            header: 'Ghi chú',
            binding: 'Remark',
            allowEditing: true,
            width: 200
        }
    ];
}