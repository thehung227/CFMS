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

// Phiếu nhập kho
export class LayoutDeadlineProjectExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30Task_Explore',
                FilterKey: "((ProductCostId = '{VAR=Filter.ProductCostId}')) AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND TaskDocCode = 'G4' AND IsActive=1",
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
            Text: 'Kế hoạch ký kết hợp đồng - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30CCMBudget_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                // {
                //     Layout: "MAU1",
                //     Name: "Kế hoạch ký kết hợp đồng",
                //     FileName: "Kế hoạch ký kết hợp đồng - {EXPR=ProductName} - {EXPR=DocNo}",
                //     WordName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                //     // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                //     FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                // },
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
        },
        Mail: {
            ProfileFilter: "Code = 'BRAVO_CTC'",
            Template: {
                Command: "usp_Coteccons_GetInfoSendMail",
                Parameters: {
                    ProductCostId: "{VAR=Filter.ProductCostId}",
                    nUserId: "{VAR=User.Id}",
                    DocCode: "PO",
                    Id: "{EXPR=Id}",
                    BranchCode: "{VAR=Branch.Ma_Dvcs}",
                    State: "1"
                },
                FolderPath: "/5.TemplateMail/",
                FileName: "PO_GuiNhaCungCap.docx"
            },
            FileAttach: {
                Command: "usp_B30BizDoc_VoucherForm",
                Parameters: {
                    DocCode: "PO",
                    Id: "{EXPR=Id}"
                },
                SourcePath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/BM-F006a-Rev01 Don Dat Hang Mua - Approved.docx",
                DestinationPath: "{VAR=Filter.ProductCostId}/Don_Hang_Mua/{EXPR=Id}/",
                FileName: "{EXPR=DocNo}.pdf"
            },
            Expr: "1==1",
            Message: "Đơn hàng chưa hoàn thành duyệt, không thể gửi mail cho Nhà cung cấp."
        },
        CancelMail: {
            Command: "usp_SOL_DuyetHuyHoSo",
            Expr: "{EXPR=CompletedApprove}==true",
            Message: "Đơn hàng chưa hoàn thành duyệt."
        }
        // CopiedValues: {
        //     parameter: { 'Commandkey': 'plansigncon-editor', 'StageCode': '{EXPR=StageCode}' }
        // }
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
            header: 'Ghi chú',
            binding: 'Description',
            width: 200
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
            header: 'Id',
            binding: 'Id',
            width: 50,
            dataType: 'Number'
        }
        
    ]

    childGrid = [
        {
            header: 'Chỉ huy trưởng',
            binding: 'Description',
      
            width: 200,
          
        },
        {
            header: 'Hoàn thành',
            binding: 'CompleteApproved',
            dataType: 'Boolean',
            width: 80,
            isReadOnly: 'true'
        },
        // {
        //     header: 'Bộ phận',
        //     binding: 'DeptName',
        //     width: 350,
        //     dataType: 'String'
        // },
        
    ]
}

export class LayoutDeadlineProjectEditor implements IEditorFormulaDeclaration {

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
                    DocCode: 'G4',
                    CCMBudgetId: '',
                    Id: -1,
                    TaskDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
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
            Key: 'BizDocCCMViewer',
            Text: 'Bảng tracking công việc',
            Command: 'usp_Report_ThongKeJobDeadLine_GetPrinData',
            Command_TongHop: 'usp_CCM_BillSupp_TongHop',
            LayoutPrint: [
               
                {
                    Layout: "MAU1",
                    Name: "Bảng tracking công việc",
                    FileName: "Bảng tracking công việc",
                    WordName: "5.Bang_KLTT_NTP_NCC.docx",
                    ExcelName: "PKSCP_TRACKINGCONGVIEC.xlsx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
               
                
            ],
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'ItemNo',
                    width: 70,
                    dataType: 'String'
                },
                {
                    header: 'Mã QLKL',
                    binding: 'PartNo',
                    width: 250,
                    dataType: 'String'
                },
                {
                    header: 'Tên QLKL',
                    binding: 'TenQLKL',
                    width: 250,
                    dataType: 'String'
                },
               
                {
                    header: 'Nội dung',
                    binding: 'Description',
                    width: 250,
                    dataType: 'String'
                },
                {
                    header: 'Đvt',
                    binding: 'Unit',
                    width: 50,
                    dataType: 'String'
                },
                {
                    header: 'Khối lượng HĐ',
                    binding: 'Quantity_Hd',
                    width: 80,
                    dataType: 'Number',
                    format: 'n2'
                },
                {
                    header: 'Khối lượng',
                    binding: 'Quantity',
                    width: 80,
                    dataType: 'Number',
                    format: 'n2'
                },
                {
                    header: 'Đơn giá',
                    binding: 'OriginalUnitCost',
                    width: 100,
                    dataType: 'Number',
                    format: 'n2'
                },
                {
                    header: 'Thành tiền',
                    binding: 'OriginalAmount',
                    width: 110,
                    dataType: 'Number'
                },
                {
                    header: '%',
                    binding: 'Percent_Th',
                    width: 70,
                    dataType: 'Number',
                    format: "p2"
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

    evaluators = {
        'Evaluator_ServerUpdated_BuiltinOrder': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CCMBudgetId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Newtecons_B30TaskDetail_SetBuiltionOrder'
        },
       'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CCMBudgetId',
            Command: 'usp_B30Task_UpdateWhenSave'
        }
    };

    serverConstraint = [
    
    ];

    serverUpdating = [
       
    ]

    serverUpdated = [
        'Evaluator_ServerUpdated_BuiltinOrder',
      'Evaluator_UpdateInfo_WhenApproveSend'
    ];

    buttonLoadChild = [
      
    ];

    buttonCommand: string[] = [
       
    ];

    importCommand: string[] = [
        
    ]

    columnChanged = {
       
    };

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
             
            }
        },
    ];

    columnsReadOnly = [];

    linkReporter = {
        'btnBaoCao': {
            directory: 'reporterdebtcollection',
            type: 'view',
            key: 'NEW_DeadlineProject',
            parameter: { 'Commandkey': 'NEW_DeadlineProject', 'EmployeeCode': '{EXPR=EmployeeCode}'}
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
               
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/Phòng, ban',
                    lookupKey: 'ProductCost',
                    binding: {
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
               
                new TextBoxInput({
                    key: 'Description',
                    label: 'Ghi chú',
                    
                    validators: [Validators.required],
                    col: 12
                }),
            ]
        })
    ];

    childColumns = [
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 100
        },
        {
            header: 'Mã đầu mục lớn',
            binding: 'ItemGroupCode',
            width: 60,
            dataType: 'Array',
            lookupKey: 'ItemClassCCM',
            bindingList: {
                Name: 'ItemGroupName'
            },
            lookupfilter: "IsActive=1 AND IsGroup=0",
        },
        {
            header: 'Tên đầu mục lớn',
            binding: 'ItemGroupName',
            allowEditing: false,
            isReadOnly: 'true',
            width: 250
        },
        {
            header: 'Công việc chi tiết',
            binding: 'Description',
            allowEditing: false,
            width: 250
        },
         {
            header: 'Phụ trách',
            binding: 'EmployeeCode',
            width: 120,
            dataType: 'Array',
            lookupKey: 'Employee',
            bindingList: {
                Name: 'EmployeeName'
            },
            multiSelection: true,
            lookupfilter: "IsActive=1",
            // lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId0}' AND PositionCode = '{EXPR=PositionCode}')",
            validators: "{EXPR=EmployeeCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
         {
            header: 'Phụ trách',
            binding: 'EmployeeName',
            isReadOnly: 'true',
            allowEditing: false,
            
            width: 250
        },
         {
            header: 'Ngày giao việc',
            binding: 'EstimatedTimeDelivery',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Deadline',
            binding: 'CompleteDate',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Trạng thái',
            binding: 'StatusCode',
            width: 60,
            dataType: 'Array',
            lookupKey: 'Class',
           
            lookupfilter: "ParentCode='DEADLINEST'",
        },
        {
            header: 'Tình trạng',
            binding: 'Reason',
            allowEditing: false,
            width: 250
        },    
        {
            header: 'Ghi chú',
            binding: 'Remark',
            allowEditing: true,
            width: 200
        },
        {
            header: 'Hủy',
            binding: 'IsActive',
            dataType: 'Boolean',
            width: 60
        },
    ]

   
}