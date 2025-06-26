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


export class LayoutApprovedBcnDebtCollectionExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_BizDocVBExplorer',
                FilterKey: "ApproveSend = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'V4' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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

export class LayoutApprovedBcnDebtCollectionEditor implements IEditorFormulaDeclaration {

    buttonLoadChild: string[];
   
    buttonCommand: string[];
    constructor(private srv?: any,
        private parentData?: any) { }

    evaluators = {
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ParentKey,Stt',
            Command: 'usp_Debt_UpdateWhenSave_Approve'
        }
    };

    // approveGrid = 1;

    serverConstraint = [
    ]

    serverUpdated = [
        'Evaluator_UpdateInfo_WhenApproveSend'
     ];

    serverUpdating = [

    ]

    columnChanged = {

    };

    linkReporter = {
        'btnBaoCao3': {
            directory: 'reporterquarter',
            type: 'view',
            key: 'REP01_DXTCQ',
            parameter: { 'Commandkey': 'REP01_DXTCQ', 'ProductCostId': '{EXPR=ProductCostId}', 'BizDocId': '{EXPR=BizDocId}', 'Ma_Dvcs': '{VAR=Branch.Ma_Dvcs}' }
        }
    }

    columnsReadOnly = [];

    layout = {
        Structure: {
            Parent: {
                Name: 'B20DebtProject',
                IsView: 'view',
                DefaultValues: {
                    // BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    // DocCode: 'V1',
                    // BizDocId: '',
                    // Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB20DebtDetail_Edit',
                    IsView: 'view',
                    ParentKey: 'ParentKey',
                    ChildKey: 'CKey',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1',
                    }
                },
                {
                    Name: 'vB20DebtDetail1',
                    IsView: 'view',
                    ParentKey: 'ParentKey',
                    ChildKey: 'CKey',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1',
                    }
                },
                {
                    Name: 'vB20DebtDetail2',
                    ParentKey: 'ParentKey',
                    ChildKey: 'ChildKey',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1',
                        IsChild: true,
                    }
                }
              
            ]
        },
        PrintDocument: {
            Key: 'Viewer_TCBN',
            Text: 'Mẫu in xác nhận hoàn thành dự án - {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_B30BizDocVB_WorkFlow_GetPrintData_XNHTDA',
            Command_WorkFlow: 'usp_B30BizDocVB_WorkFlow_GetPrintData_XNHTDA',
            LayoutPrint: [
                {
                    Layout: 'MAU9',
                    Name: 'WorkFlow',
                    FileName: 'WorkFlow xác nhận hoàn thành dự án - {EXPR=ProductName} - {EXPR=DocNo}',
                    WordName: 'WorkFlow_XNHTDA.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ]
        }
    };

    panels: PanelBase[] = [
        new TablePanel({
            label: 'Panel 1',
            col: 12,
            controls: [
                // new DateBoxInput({
                //     key: 'DocDate',
                //     label: 'Ngày lập',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }),
               
                new LookupBoxInput({
                    key: 'EmployeeCode',
                    label: 'Chỉ Huy Trưởng',
                    lookupKey: 'Employee',
                    lookupfilter: "IsGroup=0",
                  
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Stt',
                    label: 'Số HĐ ký với NH',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    visible: 'false',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }),
                new TextBoxInput({
                    key: 'ParentKey',
                    label: 'Số HĐ ký với NH',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    visible: 'false',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }),
                new CheckBoxInput({
                    key: 'CompleteApproved',
                    label: 'Đã hoàn thiện duyệt',
                    isDisabled: 'true',
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
            header: 'Id hợp đồng CĐT',
            binding: 'BizDocId_C2',
            dataType: 'Array',
            lookupKey: 'BizDoc',
            lookupfilter: "DocCode='C2' AND CompletedApprove=1 AND IsActive=1 AND ProductCostId = '{EXPR=ProductCostId}'",
            hideValueMember: true,
            width: 150
        },
        {
            header: 'Gói thầu',
            binding: 'Description0',
            width: 400,
            wordWrap: 'true'
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
            isReadOnly: 'true'
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
            isReadOnly: 'true'
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
            header: 'Tiêu đề',
            binding: 'IsChild',
            dataType: 'Boolean',
            width: 0
        },
    ];
   
}
