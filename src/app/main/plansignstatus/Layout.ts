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
export class LayoutPlanSignStatusExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB20PlanSign',
                FilterKey: "IsActive=1 AND ('{VAR=User.IsAdmin}'='True')", //AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))
                OrderBy: 'DocDate DESC',
                RowPage: 50,
                // DefaultValues: {
                //     CurrencyCode: 'VND'
                // }
            },
            Child: {
                Name: 'vB30BizDocApprove_PlanSignEx',
                ParentKey: 'Stt',
                ChildKey: 'BizDocId',
                OrderBy: 'BuiltinOrder'
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
        },
        Mail: {
            ProfileFilter: "Code = 'BRAVO_CTC'",
            Template: {
                Command: "usp_Coteccons_GetInfoSendMail",
                Parameters: {
                    ProductCostId: "{VAR=Filter.ProductCostId}",
                    nUserId: "{VAR=User.Id}",
                    DocCode: "H8",
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
        // {
        //     header: 'CCMBudgetId',
        //     binding: 'CCMBudgetId',
        //     width: 200
        // },
       
        // {
        //     header: 'Số Rev',
        //     binding: 'DocNo2',
        //     width: 60,
        //     dataType: 'String'
        // },
       
        {
            header: 'Ngày',
            binding: 'DocDate',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
       {
            header: 'Gói thầu',
            binding: 'ProductName',
            width: 200
        },
        {
            header: 'Nội dung',
            binding: 'Description',
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
        {
            header: 'Bộ phận',
            binding: 'DeptName',
            width: 350,
            dataType: 'String'
        },
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

export class LayoutPlanSignStatusEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    // Khai báo view lấy dữ liệu <Tables> B7
    layout = {
        Structure: {
            Parent: {
                Name: 'vB20PlanSign',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Stt: '',
                    Id: -1,
                    
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB20PlanSignDetail',
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    // Sort: 'BuiltinOrder',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1'
                    }
                },
                {
                    Name: 'vB20PlanSignDetail1',
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    // Sort: 'BuiltinOrder',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1'
                    }
                }
               
            ]
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
                //     FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                // }
            ],
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
                            width: 190,
                            dataType: 'String'
                        },
                    ]
                },
                {
                    header: 'Người ký HĐ',
                    binding: 'Ten_Chuc_Vu',
                    width: 105,
                    dataType: 'String'
                },
                {
                    header: 'Giá trị dự kiến ký kết (chưa VAT)',
                    binding: 'OriginalAmount',
                    width: 112,
                    dataType: 'Number'
                },
                {
                    header: 'Giá trị thanh toán dự kiến (chưa VAT)',
                    binding: 'PaymentAmount',
                    width: 105,
                    dataType: 'Number'
                }
            ]
        }
    };

    evaluators = {
        'Evaluator_ServerConstraint_Detail_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'Stt,EmployeeCode',
            Command: 'usp_Kct_BaoCaoTaiChinhCongTruong_THQT_GetData',
            OutputTable: 0
        },
       
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Stt',
            Command: 'usp_Setlement_UpdateWhenSave'
        }
       
    };

    serverConstraint = [
       
    ];

    serverUpdating = [
       
    ]

    serverUpdated = [
    //    'Evaluator_UpdateInfo_WhenApproveSend'
    ];

    buttonLoadChild = [
       'Evaluator_ServerConstraint_Detail_GetData'
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
            directory: 'reporterplansignstatus',
            type: 'view',
            key: 'NEW_PlanSignStatus',
            parameter: { 'Commandkey': 'NEW_PlanSignStatus'}
        }
    }

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
                    col: 6
                }),
               
                // new LookupBoxInput({
                //     key: 'TypeXDME',
                //     label: 'Loại hình',
                //     lookupKey: 'Class',
          
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='INCURRED' AND Code IN ('XD','ME')",
                //     hideValueMember: false,
                //     validators: [Validators.required],
                //     col: 6
                // }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    //lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCode',
                    label: 'PTDA XD',
                    lookupKey: 'Employee',
                    lookupfilter: "IsActive=1 AND IsGroup=0",
                    validators: [Validators.required],
                    hideValueMember: true,
                    isReadOnly: 'true',
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCode1',
                    label: 'PTDA ME',
                    lookupKey: 'Employee',
                    lookupfilter: "IsActive=1 AND IsGroup=0",
                    validators: [Validators.required],
                    hideValueMember: true,
                    isReadOnly: 'true',
                    col: 6
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Ghi chú',
                    type: 'text',
                    isNewRow: true,
                    col: 12
                }),
                new TextBoxInput({
                    key: 'Stt',
                    label: 'Số HĐ ký với NH',
                    type: 'text',
                    
                    col: 12,
                    isReadOnly: 'true',
                    visible: 'false',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }),
                new ButtonInput({
                    key: 'btnBaoCao',
                    label: 'Tình trạng QT dự án',
                    col: 6
                }),
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
            header: 'Thời gian dự kiến ký kết',
            binding: 'EstimatedTimeDelivery',
            isRequired: false,
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Thời gian thi công',
            binding: 'EstimatedQuotationDate',
            width: 106,
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false	
        },
        {
            header: 'Mã XD/ME',
            binding: 'CodeMEXD',
            dataType: 'Array',
            lookupKey: 'KHC',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ClassCode1='01'",
            width: 150,
            // isReadOnly: 'true'
        },
        {
            header: 'Mã Công tác',
            binding: 'JobCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Job',
            bindingList: {
                Name: 'JobName'
            },
            multiSelection: true,
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 150,
            // validators: "{EXPR=JobCode} == ''",
            // validatorMessage: 'Mã công việc, không được bỏ trắng giá trị',
            // ignoreError: 1
        },
        {
            header: 'Công tác',
            binding: 'JobName',
            isRequired: true,
            width: 250
        },
        {
            header: 'Nhóm đối tượng',
            binding: 'Loai_Dt',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "ParentCode='Loai_Dt_CCM'",
            width: 100
        },
        {
            header: 'Mã NTP/NCC',
            binding: 'CustomerCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Customer_CCM2',
            bindingList: {
                NameBinding: 'CustomerName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
            width: 200,
            // validators: "{EXPR=CustomerCode} == ''",
            // validatorMessage: 'Mã đối tượng, không được bỏ trắng giá trị',
            // ignoreError: 1
        },
        {
            header: 'Tên NTP/NCC',
            binding: 'CustomerName',
            width: 300
        },
        {
            header: 'Người đàm phán cuối cùng',
            binding: 'PartNo',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'JobPositionCCM',
            lookupfilter: "IsGroup=0 AND Code IN ('GDDH','GDDA')",
            width: 100
        },
        {
            header: 'Chức vụ ký HĐ',
            binding: 'Chuc_Vu',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'JobPositionCCM',
            lookupfilter: 'IsGroup=0',
            width: 100
        },
        {
            header: 'Giá trị ký kết dự kiến (chưa VAT)',
            binding: 'OriginalAmount',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: 'Không ký',
            binding: 'ItemGroupCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "ParentCode='KHKK' AND Code IN ('K')",
            width: 100
        },
        // {
        //     header: 'Trách nhiệm',
        //     binding: 'BudgetTypeCode',
        //     dataType: 'Array',
        //     lookupKey: 'Class',
        //     isRequired: true,
        //     lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode = 'BudgetType'",
        //     width: 150
        // },
        {
            header: 'Nguyễn nhân trễ',
            binding: 'Reason',
            width: 250
        },
    ]

    childColumns1 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 100
        },
        {
            header: 'Thời gian dự kiến ký kết',
            binding: 'EstimatedTimeDelivery',
            isRequired: false,
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Thời gian thi công',
            binding: 'EstimatedQuotationDate',
            width: 106,
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false	
        },
        {
            header: 'Mã XD/ME',
            binding: 'CodeMEXD',
            dataType: 'Array',
            lookupKey: 'KHC',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ClassCode1='01'",
            width: 150,
            // isReadOnly: 'true'
        },
        {
            header: 'Mã Công tác',
            binding: 'JobCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Job',
            bindingList: {
                Name: 'JobName'
            },
            multiSelection: true,
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 150,
            // validators: "{EXPR=JobCode} == ''",
            // validatorMessage: 'Mã công việc, không được bỏ trắng giá trị',
            // ignoreError: 1
        },
        {
            header: 'Công tác',
            binding: 'JobName',
            isRequired: true,
            width: 250
        },
        {
            header: 'Nhóm đối tượng',
            binding: 'Loai_Dt',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "ParentCode='Loai_Dt_CCM'",
            width: 100
        },
        {
            header: 'Mã NTP/NCC',
            binding: 'CustomerCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Customer_CCM2',
            bindingList: {
                NameBinding: 'CustomerName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
            width: 200,
            // validators: "{EXPR=CustomerCode} == ''",
            // validatorMessage: 'Mã đối tượng, không được bỏ trắng giá trị',
            // ignoreError: 1
        },
        {
            header: 'Tên NTP/NCC',
            binding: 'CustomerName',
            width: 300
        },
        {
            header: 'Người đàm phán cuối cùng',
            binding: 'PartNo',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'JobPositionCCM',
            lookupfilter: "IsGroup=0 AND Code IN ('GDDH','GDDA')",
            width: 100
        },
        {
            header: 'Chức vụ ký HĐ',
            binding: 'Chuc_Vu',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'JobPositionCCM',
            lookupfilter: 'IsGroup=0',
            width: 100
        },
        {
            header: 'Giá trị ký kết dự kiến (chưa VAT)',
            binding: 'OriginalAmount',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: 'Không ký',
            binding: 'ItemGroupCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "ParentCode='KHKK' AND Code IN ('K')",
            width: 100
        },
        // {
        //     header: 'Trách nhiệm',
        //     binding: 'BudgetTypeCode',
        //     dataType: 'Array',
        //     lookupKey: 'Class',
        //     isRequired: true,
        //     lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode = 'BudgetType'",
        //     width: 150
        // },
        {
            header: 'Nguyễn nhân trễ',
            binding: 'Reason',
            width: 250
        },
    ]

  
}