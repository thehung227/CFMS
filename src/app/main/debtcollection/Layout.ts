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
export class LayoutDebtCollectionExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB20Debt',
                FilterKey: "IsActive=1 AND ('{VAR=User.IsAdmin}'='True')", //AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))
                OrderBy: 'DocDate DESC',
                RowPage: 50,
                // DefaultValues: {
                //     CurrencyCode: 'VND'
                // }
            },
            Child: {
                Name: 'B20DebtProject',
                ParentKey: 'Stt',
                ChildKey: 'Stt',
                OrderBy: 'EmployeeCode'
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
            header: 'Giám Đốc Điều Hành',
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

export class LayoutDebtCollectionEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    // Khai báo view lấy dữ liệu <Tables> B7
    layout = {
        Structure: {
            Parent: {
                Name: 'vB20Debt',
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
                    Name: 'vB20DebtDetail',
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    // Sort: 'BuiltinOrder',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1'
                    }
                },
                {
                    Name: 'vB20DebtDetail1',
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    // Sort: 'BuiltinOrder',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1'
                    }
                },
                {
                    Name: 'vB20DebtDetail2',
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    Sort: 'ProductCostId,IsTitleRow,Itemno',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1',
                        IsTitleRow: true
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
            ConstraintKey: 'EmployeeCode,Stt',
            Command: 'usp_BCN_CongNoChuDauTu',
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_Detail1_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'EmployeeCode,Stt',
            Command: 'usp_BCN_CongNoChuDauTu_ChuaDenHan',
            OutputTable: 1
        },
        'Evaluator_ServerConstraint_Detail2_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'EmployeeCode,Stt',
            Command: 'usp_B20DebtDetail2_LoadFromOldVersion',
            OutputTable: 2
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Stt',
            Command: 'usp_Debt_UpdateWhenSave'
        }
       
    };

    serverConstraint = [
       
    ];

    serverUpdating = [
       
    ]

    serverUpdated = [
       'Evaluator_UpdateInfo_WhenApproveSend'
    ];

    buttonLoadChild = [
       'Evaluator_ServerConstraint_Detail_GetData',
       'Evaluator_ServerConstraint_Detail1_GetData',
       'Evaluator_ServerConstraint_Detail2_GetData'
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
            key: 'NEW_DebtCollection',
            parameter: { 'Commandkey': 'NEW_DebtCollection', 'EmployeeCode': '{EXPR=EmployeeCode}'}
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
                    label: 'GĐĐH',
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
                    label: 'Tình trạng thu hồi công nợ',
                    col: 6
                }),
            ]
        })
    ];

    childColumns = [
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 60,
             
        },
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
            width: 0,
             isReadOnly: 'true'
        },
        // {
        //     header: 'Tên dự án',
        //     binding: 'ProductName',
        //     width: 180,
        //     wordWrap: 'true',
        //      isReadOnly: 'true'
        // },
       
        {
            header: 'Gói thầu',
            binding: 'Description0',
            width: 400,
            wordWrap: 'true',
             isReadOnly: 'true'
        },
        
      
        {
            header: 'IPC số',
            binding: 'ClaimNo',
            width: 200,
            wordWrap: 'true',
             isReadOnly: 'true'
        },
        {
            header: 'Dự kiến giá trị Quyết toán',
            binding: 'ContractValue',
            dataType: 'Number',
            isRequired: true,
            width: 120,
             isReadOnly: 'true'
        },
        {
            header: 'CĐT đã thanh toán',
            binding: 'DaThuLuyKe',
            dataType: 'Number',
            isRequired: true,
            width: 120,
             isReadOnly: 'true'
        },
     
        {
            header: '% TT',
            binding: 'RateTT',
            dataType: 'Number',
            format: 'p2',
            isRequired: true,
            min: 0,
            max: 1,
            width: 60
        },
        {
            header: 'Dự kiến số tiền phải thu',
            binding: 'TienNo',
            dataType: 'Number',
            isRequired: true,
            width: 120,
             isReadOnly: 'true'
        },
        
        {
            header: 'Ngày đến hạn'	,
            binding: 'DueDate',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100,
            isReadOnly: 'true'						
        },
        {
            header: 'Số ngày quá hạn',
            binding: 'DateDue',
            dataType: 'Number',
            isRequired: true,
            width: 150,
             isReadOnly: 'true'
        },
        {
            header: 'Ngày cam kết thu hồi công nợ'	,
            binding: 'CommitmentDate',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:140					
        },
        {
            header: 'Lý do/Vướng mắc chưa hoàn thành các mốc cam kết',
            binding: 'Note',
            width: 350,
            wordWrap: 'true'
        },
        {
            header: 'CHT',
            binding: 'EmployeeCodeCHT',
            width: 150,
            wordWrap: 'true'
        },
        {
            header: 'CHT',
            binding: 'EmployeeNameCHT',
            width: 150,
            wordWrap: 'true'
        },
        {
            header: 'ProductCostId0',
            binding: 'ProductCostId0',
            width: 0,
             isReadOnly: 'true'
        },
        {
            header: 'Id hợp đồng CĐT',
            binding: 'BizDocId_C2',
            width: 0,
             isReadOnly: 'true'
        },
        {
            header: 'Id Claim',
            binding: 'Stt_CL',
            width: 0,
             isReadOnly: 'true'
        },
    ]

    childColumns1 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 60,
             
        },
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
            width: 0,
             isReadOnly: 'true'
        },
      
      
        {
            header: 'Gói thầu',
            binding: 'Description0',
            width: 400,
            wordWrap: 'true',
             isReadOnly: 'true'
        },
        
     
        {
            header: 'IPC số',
            binding: 'ClaimNo',
            width: 200,
            wordWrap: 'true',
             isReadOnly: 'true'
        },
        {
            header: 'Dự kiến giá trị Quyết toán',
            binding: 'ContractValue',
            dataType: 'Number',
            isRequired: true,
            width: 120,
             isReadOnly: 'true'
        },
        {
            header: 'CĐT đã thanh toán',
            binding: 'DaThuLuyKe',
            dataType: 'Number',
            isRequired: true,
            width: 120,
             isReadOnly: 'true'
        },
     
        {
            header: '% TT',
            binding: 'RateTT',
            dataType: 'Number',
            format: 'p2',
            isRequired: true,
            min: 0,
            max: 1,
            width: 60
        },
        {
            header: 'Dự kiến số tiền phải thu',
            binding: 'TienNo',
            dataType: 'Number',
            isRequired: true,
            width: 120,
             isReadOnly: 'true'
        },
      
        {
            header: 'Ngày đến hạn'	,
            binding: 'DueDate',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100,
            isReadOnly: 'true'						
        },
        {
            header: 'Số ngày quá hạn',
            binding: 'DateDue',
            dataType: 'Number',
            isRequired: true,
            width: 150,
             isReadOnly: 'true'
        },
        {
            header: 'Ngày cam kết thu hồi công nợ'	,
            binding: 'CommitmentDate',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:140					
        },
        {
            header: 'Lý do/Vướng mắc chưa hoàn thành các mốc cam kết',
            binding: 'Note',
            width: 350,
            wordWrap: 'true'
        },
        {
            header: 'CHT',
            binding: 'EmployeeCodeCHT',
            width: 150,
            wordWrap: 'true'
        },
        {
            header: 'CHT',
            binding: 'EmployeeNameCHT',
            width: 150,
            wordWrap: 'true'
        },
        {
            header: 'ProductCostId0',
            binding: 'ProductCostId0',
            width: 0,
             isReadOnly: 'true'
        },
        {
            header: 'Id hợp đồng CĐT',
            binding: 'BizDocId_C2',
            width: 0,
             isReadOnly: 'true'
        },
        {
            header: 'Id Claim',
            binding: 'Stt_CL',
            width: 0,
             isReadOnly: 'true'
        },
    ]

    childColumns2 = [
        {
            header: 'Tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 80
        },
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 60,
             
        },
        {
            header: 'Mã công trình',
            binding: 'ProductCostId',
            dataType: 'Array',
            lookupKey: 'ProductCost',
            bindingList: {
                ProductName: 'Description0'
            },
            lookupfilter: "ProductType IN ('1','3','2') AND IsGroup = 0 AND IsActive = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}'",
            hideValueMember: true,
            width: 100
        },
        // {
        //     header: 'Tên dự án',
        //     binding: 'ProductName',
        //     width: 180,
        //     wordWrap: 'true',
        //      isReadOnly: 'true'
        // },
       
        {
            header: 'Gói thầu',
            binding: 'Description0',
            width: 400,
            wordWrap: 'true'
        },
        {
            header: 'Id hợp đồng CĐT',
            binding: 'BizDocId_C2',
            width: 0,
             isReadOnly: 'true'
        },
       
        
        {
            header: 'Id Claim',
            binding: 'Stt_CL',
            width: 0,
             isReadOnly: 'true'
        },
        {
            header: 'IPC số',
            binding: 'ClaimNo',
            width: 200,
            wordWrap: 'true'
        },
        {
            header: 'Dự kiến giá trị Quyết toán',
            binding: 'ContractValue',
            dataType: 'Number',
            isRequired: true,
            width: 120
        },
        {
            header: 'CĐT đã thanh toán',
            binding: 'DaThuLuyKe',
            dataType: 'Number',
            isRequired: true,
            width: 120
        },
     
        {
            header: '% TT',
            binding: 'RateTT',
            dataType: 'Number',
            format: 'p2',
            isRequired: true,
            min: 0,
            max: 1,
            width: 60
        },
        {
            header: 'Dự kiến số tiền phải thu',
            binding: 'TienNo',
            dataType: 'Number',
            isRequired: true,
            width: 120
        },
        {
            header: 'Cam kết ký PLHĐ chốt phát sinh'	,
            binding: 'DatePS',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100
        },
        {
            header: 'Hoàn thành PLHĐ',
            binding: 'IsDatePS',
            dataType: 'Boolean',
            width: 80,
            // isReadOnly: 'true'
        },
        {
            header: 'Cam kết TOC'	,
            binding: 'DateTOC',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100							
        },
        {
            header: 'Hoàn thành TOC',
            binding: 'IsDateTOC',
            dataType: 'Boolean',
            width: 80,
            // isReadOnly: 'true'
        },
        {
            header: 'Cam kết ký QT/Xuất HĐ'	,
            binding: 'DateQT',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100							
        },
        {
            header: 'Hoàn thành QT',
            binding: 'IsDateQT',
            dataType: 'Boolean',
            width: 80,
            // isReadOnly: 'true'
        },
        {
            header: 'Ngày đến hạn'	,
            binding: 'DueDate',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100					
        },
        {
            header: 'Số ngày quá hạn',
            binding: 'DateDue',
            dataType: 'Number',
            isRequired: true,
            width: 150,
             isReadOnly: 'true'
        },
        {
            header: 'Ngày cam kết thu hồi công nợ'	,
            binding: 'CommitmentDate',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:140					
        },
        {
            header: 'Lý do/Vướng mắc chưa hoàn thành các mốc cam kết',
            binding: 'Note',
            width: 350,
            wordWrap: 'true'
        },
        {
            header: 'CHT',
            binding: 'EmployeeCodeCHT',
            width: 150,
            wordWrap: 'true'
        },
        {
            header: 'CHT',
            binding: 'EmployeeNameCHT',
            width: 150,
            wordWrap: 'true'
        },
        {
            header: 'ProductCostId0',
            binding: 'ProductCostId0',
            width: 0,
             isReadOnly: 'true'
        },
    ];
}