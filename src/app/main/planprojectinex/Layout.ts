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
export class LayoutPlanProjectInExExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB20ProjectInEx',
                FilterKey: "IsActive=1 AND (EmployeeCode='{VAR=User.Ma_CbNv}' OR '{VAR=User.IsAdmin}'='True')", //AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))
                OrderBy: 'DocDate DESC',
                RowPage: 50,
                // DefaultValues: {
                //     CurrencyCode: 'VND'
                // }
            },
            Child: {
                Name: 'vB20ProjectInExDetail',
                ParentKey: 'Stt',
                ChildKey: 'Stt',
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
            binding: 'DocDate',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
      
        {
            header: 'Giám Đốc Dự Án',
            binding: 'EmployeeName',
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
            binding: 'BuiltinOrder',
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
            header: 'Dự án',
            binding: 'ProductName',
            width: 180,
            dataType: 'String'
        },
        // {
        //     header: 'Người thực hiện',
        //     binding: 'EmployeeName',
        //     width: 150
        // },
       
        {
            header: 'Thực tế thu chi',
            binding: 'ThisAmount',
            width: 150,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Hạn mức thu chi',
            binding: 'LimitAmount',
            width: 150,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Số tiền được chi',
            binding: 'OriginalAmount',
            width: 150,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Tỉ lệ chi XD',
            binding: 'RateXD',
            width: 100,
            
            format: 'p2'
        },
        {
            header: 'Số tiền được chi XD',
            binding: 'PaymentAmountXD',
            width: 150,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Tỉ lệ chi ME',
            binding: 'RateME',
            width: 100,
            
            format: 'p2'
        },
        {
            header: 'Số tiền được chi ME',
            binding: 'PaymentAmountME',
            width: 150,
            dataType: 'Number',
            format: 'n0'
        },
    ]
}

export class LayoutPlanProjectInExEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    // Khai báo view lấy dữ liệu <Tables> B7
    layout = {
        Structure: {
            Parent: {
                Name: 'vB20ProjectInEx',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Stt: '',
                    EmployeeCode: '{VAR=User.Ma_CbNv}',
                    Id: -1,
                    
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB20ProjectInExDetail',
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
            Command: 'usp_Newtecons_LoadProductGDDA',
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_RateME_AutoCalculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "RateME",
            Value: "1-RateXD",
            Tables: 0
        },
        'Evaluator_ServerConstraint_PaymentAmountXD_AutoCalculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "PaymentAmountXD",
            Value: "Math.round(OriginalAmount*RateXD)",
            Tables: 0
        },
        'Evaluator_ServerConstraint_PaymentAmountME_AutoCalculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "PaymentAmountME",
            Value: "Math.round(OriginalAmount*RateME)",
            Tables: 0
        },
    };

    serverConstraint = [
       
    ];

    serverUpdating = [
       
    ]

    serverUpdated = [
       
    ];

    buttonLoadChild: string[] = [
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
                RateXD: {
                    Evaluators: [
                        'Evaluator_ServerConstraint_RateME_AutoCalculate',
                        'Evaluator_ServerConstraint_PaymentAmountXD_AutoCalculate',
                        'Evaluator_ServerConstraint_PaymentAmountME_AutoCalculate'
                    ]
                },
            RateME: {
                    Evaluators: [
                        // 'Evaluator_ServerConstraint_RateME_AutoCalculate',
                        
                        'Evaluator_ServerConstraint_PaymentAmountME_AutoCalculate'
                    ]
                }
            }
        },
    ];

    columnsReadOnly = [];

    linkReporter = {
        'btnBaoCao': {
            directory: 'reporterplanprojectinex',
            type: 'view',
            key: 'NEW_PlanProjectInEx',
            parameter: { 'Commandkey': 'NEW_PlanProjectInEx', 'DocDate': '{EXPR=DocDate}'}
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
                new LookupBoxInput({
                    key: 'EmployeeCode',
                    label: 'GDDA',
                    lookupKey: 'Employee',
                    lookupfilter: "IsActive=1 AND IsGroup=0",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 6
                }, this.srv, this.parentData),
               
                new TextBoxInput({
                    key: 'Description',
                    label: 'Ghi chú',
                    type: 'text',
                    isNewRow: true,
                    col: 12
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
                ProductName: 'ProductCostInfo'
            },
            lookupfilter: "ProductType IN ('1','3','2') AND IsGroup = 0 AND IsActive = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}'",
            hideValueMember: true,
            width: 120,
             isReadOnly: 'true'
        },
        {
            header: 'Tên gói thầu',
            binding: 'ProductName',
            width: 250,
             isReadOnly: 'true'
        },
        {
            header: 'Chênh lệch thu chi kỳ này',
            binding: 'ThisAmount',
            dataType: 'Number',
            isRequired: true,
            width: 150,
             isReadOnly: 'true'
        },
        {
            header: 'Hạn mức chênh lệch thu chi',
            binding: 'LimitAmount',
            dataType: 'Number',
            isRequired: true,
            width: 150,
             isReadOnly: 'true'
        },
        {
            header: 'Số tiền được chi tối đa',
            binding: 'OriginalAmount',
            dataType: 'Number',
            isRequired: true,
            width: 150,
             isReadOnly: 'true'
        },
        {
            header: 'Tỉ lệ chi XD',
            binding: 'RateXD',
            dataType: 'Number',
            format: 'p2',
            isRequired: true,
            min: 0,
            max: 1,
            width: 100
        },
        {
            header: 'Số tiền được chi XD',
            binding: 'PaymentAmountXD',
            dataType: 'Number',
            isRequired: true,
            width: 150,
             isReadOnly: 'true'
        },
        {
            header: 'Tỉ lệ chi ME',
            binding: 'RateME',
            dataType: 'Number',
            format: 'p2',
            isRequired: true,
            min: 0,
            max: 1,
            width: 100,
             isReadOnly: 'true'
        },
        {
            header: 'Số tiền được chi ME',
            binding: 'PaymentAmountME',
            dataType: 'Number',
            isRequired: true,
            width: 150,
             isReadOnly: 'true'
        },
    ];
}