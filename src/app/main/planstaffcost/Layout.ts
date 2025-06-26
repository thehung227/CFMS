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

// Kế hoạch Quản lý khối lượng
export class LayoutPlanStaffCostExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30Budget',
                FilterKey: "DocCode = 'H5' AND IsActive=1", //AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))
                OrderBy: 'BudgetDate DESC',
                RowPage: 50,
                // DefaultValues: {
                //     CurrencyCode: 'VND'
                // }
            },
            Child: {
                Name: 'vB30BizDocApprove_CCMBudgetExplorer',
                ParentKey: 'Stt',
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
        //     header: 'Gói thầu',
        //     binding: 'ProductName',
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
            binding: 'BudgetDate',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
      
        {
            header: 'Ghi chú',
            binding: 'Description',
            width: 150,
            dataType: 'String'
        },
       
      
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
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center'
        },
        // {
        //     header: 'Bộ phận',
        //     binding: 'DeptName',
        //     width: 350,
        //     dataType: 'String'
        // },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 180,
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

export class LayoutPlanStaffCostEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    // Khai báo view lấy dữ liệu <Tables> B7
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30Budget',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'H5',
                    DocStatus: '4',
                    Stt: '',
                    // ProductCostId: '{VAR=Filter.ProductCostId}',
                    Id: -1,
                    
                    BudgetDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB30BudgetDetail_Edit',
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
        
    };

    serverConstraint = [
       
    ];

    serverUpdating = [
       
    ]

    serverUpdated = [
       
    ];

    buttonLoadChild: string[] = [
       
    ];

    buttonCommand: string[] = [
       
    ];

    importCommand: string[] = [
        
    ]

    columnChanged = {
       
    };

    columnChangedChild = [
       
    ];

    columnsReadOnly = [];

    linkReporter = {
        'btnBaoCao': {
            directory: 'reporterplanstaffcost',
            type: 'view',
            key: 'NEW_PlanStaffCost',
            parameter: { 'Commandkey': 'NEW_PlanStaffCost', 'DocDate': '{EXPR=DocDate}'}
        }
    }

    panels: PanelBase[] = [
        new TablePanel({
            label: 'Panel 1',
            col: 12,
            controls: [
                new DateBoxInput({
                    key: 'BudgetDate',
                    label: 'Ngày lập',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Ghi chú',
                    type: 'text',
                    isNewRow: true,
                    col: 12
                }),
                new ButtonInput({
                    key: 'btnBaoCao',
                    label: 'Bảng tổng hợp chi phí',
                    col: 6
                }),
            ]
        })
    ];

    childColumns = [
        {
            header: 'Dự án/Gói thầu',
            binding: 'ProductCostId',
            dataType: 'Array',
            lookupKey: 'ProductCost',
            bindingList: {
                ProductCostInfo: 'ProductCostInfo'
            },
            lookupfilter: "ProductType IN ('1','3','2') AND IsGroup = 0 AND IsActive = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}'",
            hideValueMember: true,
            width: 120
        },
        {
            header: 'Tên gói thầu',
            binding: 'ProductCostInfo',
            width: 250
        },
        {
            header: '1.Lương và PC XD',
            binding: 'AmountXD01',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: '1.Lương và PC ME',
            binding: 'AmountME01',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: '2.BHXH XD',
            binding: 'AmountXD02',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: '2.BHXH ME',
            binding: 'AmountME02',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: '3.Kinh phí CĐ XD',
            binding: 'AmountXD03',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: '3.Kinh phí CĐ ME',
            binding: 'AmountME03',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: '4.Thưởng XD',
            binding: 'AmountXD04',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: '4.Thưởng ME',
            binding: 'AmountME04',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: '5.PC Cơm XD',
            binding: 'AmountXD05',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: '5.PC Cơm ME',
            binding: 'AmountME05',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: '6.Hỗ trợ: Tạm hoãn, nghỉ việc/ thôi việc XD',
            binding: 'AmountXD06',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: '6.Hỗ trợ: Tạm hoãn, nghỉ việc/ thôi việc ME',
            binding: 'AmountME06',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: '7.Du lịch (nghỉ việc) XD',
            binding: 'AmountXD07',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: '7.Du lịch (nghỉ việc) ME',
            binding: 'AmountME07',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: '8. Dự phòng 1 XD',
            binding: 'AmountXD08',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: '8. Dự phòng 1 ME',
            binding: 'AmountME08',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: '9. Dự phòng 2 XD',
            binding: 'AmountXD09',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: '9. Dự phòng 2 ME',
            binding: 'AmountME09',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: '10. Nhân sự XD',
            binding: 'AmountXD10',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: '10. Nhân sự ME',
            binding: 'AmountME10',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
    ];
}