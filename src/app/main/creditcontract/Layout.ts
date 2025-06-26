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

// Ủy nhiệm chi
export class LayoutCreditContractExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_Explore',
                FilterKey: "BranchCode='{VAR=Branch.Ma_Dvcs}' AND DocCode='C8' AND IsActive=1",
                OrderBy: 'DocStatusName, DocDate DESC,DocNo DESC',
                RowPage: 50
            },
            Child: {
                Name: 'vB30BizDocApprove_Explorer',
                ParentKey: 'BizDocId',
                ChildKey: 'BizDocId',
                OrderBy: 'ApproveGroup'
            }
        },
        PrintDocument: {
            Key: 'Viewer_TCBN',
            Text: 'Mẫu in trình ký HĐ hạn mức tín dụng - {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_B30BizDoc_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [

        
                {
                    Layout: 'MAU12',
                    Name: 'WorkFlow',
                    FileName: 'WorkFlow HĐ hạn mức tín dụng - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}',
                    WordName: 'WorkFlow_HDHMTD.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ]
        }
    }

    // lookup1 = {
    //     Table: 'vB20Item_MenuFilter',
    //     Filter: "IsGroup=1 AND IsActive=1 AND ClassCode3 = 'TM'",// AND IsShowMenuWeb = 1
    //     ColumnFilter: 'ItemGroupCode'
    // }

    // lookup2 = {
    //     Table: 'B00TMCtcDocStatus',
    //     Filter: "IsGroup=0 AND CommandWeb = 'purchasingnote'",
    //     ColumnFilter: 'DocStatusKeyNH'
    // }

    // lookup3 = {
    //     Table: 'B00TMCtcDocStatus',
    //     Filter: "CommandWeb = 'rowsPage'",
    // }

    parentGrid = [
        {
            header: 'Trạng thái',
            binding: 'DocStatusName',
            width: 150,
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
            header: 'Số phiếu',
            binding: 'DocNo',
            width: 100,
            dataType: 'String'
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            width: 250
        },
        {
            header: 'Đối tượng',
            binding: 'CustomerName',
            width: 200
        },
        {
            header: 'Tiền gửi',
            binding: 'LoanOriginalAmount',
            width: 110
        },
      
      
        {
            header: 'Đã gửi duyệt',
            binding: 'ApproveSend',
            width: 110,
            dataType: 'Boolean'
        },
        {
            header: 'Hoàn thiện duyệt',
            binding: 'CompletedApprove',
            width: 110,
            dataType: 'Boolean'
        },
        {
            header: 'Người tạo',
            binding: 'CreateName',
            width: 200,
            dataType: 'String'
        },
  
        {
            header: 'Id',
            binding: 'Id',
            width: 100,
            dataType: 'Number'
        }
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

export class LayoutCreditContractEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    // Khai báo view lấy dữ liệu <Tables> B7
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'C8',
                    LoanContractType: '2',
                    IsWebData: 1,
                    DocStatus: '1',
                    CurrencyCode: 'VND',
                    ExchangeRate:1,
                    ProductCostId:'PROD001636',
                    TransCode: '3206',
                    Id: -1,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    // ProductCostId0: '{VAR=Filter.ProductCostId}'
                }
            },
            Child: [
              
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    }
                },
                {
                    Name: 'vB30BizDocApprove_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId'
                }
            ]
        },
        PrintDocument: {
            Key: 'Viewer_TCBN',
            Text: 'Mẫu in trình ký HĐ hạn mức tín dụng - {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_B30BizDoc_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [

        
                {
                    Layout: 'MAU12',
                    Name: 'WorkFlow',
                    FileName: 'WorkFlow HĐ hạn mức tín dụng - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}',
                    WordName: 'WorkFlow_HDHMTD.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ]
        }
    };

    evaluators = {
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId',
            Command: 'usp_B30BizDocApprove_GetData',
            DataMember: '',
            OutputTable: 1
        },
        'Evaluator_ServerConstraint_CTC_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,DocCode,DocNo,Id',
            Command: 'ufn_B30BizDoc_DefaultDocNo_Contract',
            DataMember: 'DocNo',
            zExpr: "ProductCostId != ''"
        },
        // 'Evaluator_UpdateInfo_WhenInsert': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: 'BizDocId',
        //     Command: 'usp_Auto_Calculate',

        // },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},BizDocId,{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend==true'
        }
    };

    serverConstraint = [
        'Evaluator_ServerConstraint_CTC_DefaultDocNo'
    ];

    serverUpdating = [
        
    ]

    serverUpdated = [
        // 'Evaluator_UpdateInfo_WhenInsert',
        'Evaluator_UpdateInfo_WhenApproveSend'
    ];

    buttonLoadChild: string[] = [

    ]

    buttonCommand: string[] = [
    ];

    importCommand: string[] = [
    ]

    columnChanged = {
        SignDate: {
            Evaluators: [
                'Evaluator_ServerConstraint_CTC_DefaultDocNo'
            ]
        },
        ProcessCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_Approve_GetData'
            ]
        }
    };

    columnChangedChild = [
    ];

    columnsReadOnly = [];

    linkReporter = {

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
                    col: 6,
                    
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số hợp đồng hệ thống',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new DateBoxInput({
                    key: 'SignDate',
                    label: 'Ngày ký',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6,
                    
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNoReal',
                    label: 'Số hợp đồng ký NH',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB đại diện',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    hideValueMember: true,
                    validators: [Validators.required],
                    visible: 'false',
                    col: 12,
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    type: 'text',
                    col: 12,
                    
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Ngân hàng',
                    lookupKey: 'Customer',
                    binding: {
                        Name: 'Person',
                        Address: 'Address'
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12,
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
           
               
                new NumberBoxInput({
                    key: 'TotalOfValue',
                    label: 'Tổng hạn mức tín dụng',
                    type: 'number',
                    col: 6,
                    
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'ValueOfGuarantee',
                    label: 'Hạn mức vay',
                    type: 'number',
                    col: 6,
                    
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'NumberCol1',
                    label: 'Hạn mức thấu chi',
                    type: 'number',
                    col: 6,
                    
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'ValueOfWork',
                    label: 'Hạn mức LC',
                    type: 'number',
                    col: 6,
                    
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'ValueOfWarranty',
                    label: 'Hạn mức bảo lãnh',
                    type: 'number',
                    col: 6,
                    
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'AriseValue',
                    label: 'Hạn mức bao thanh toán',
                    type: 'number',
                    col: 6,
                    
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
             
                new DateBoxInput({
                    key: 'EffectiveDate',
                    label: 'Thời hạn duy trì hạn mức',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6,
                    
                }),
              
                new TextBoxInput({
                    key: 'Remark',
                    label: 'Ghi chú',
                    type: 'text',
                    col: 12,
                    
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND DocStatus=4 AND Ma_Ct='{EXPR=DocCode}'",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 6
                }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'CurrencyCode',
                //     label: 'Mã tiền tệ',
                //     lookupKey: 'Currency',
                //     lookupfilter: "IsActive=1 AND IsGroup=0",
                //     hideValueMember: false,
                //     col: 6,
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }, this.srv, this.parentData),
              
                // new NumberBoxInput({
                //     key: 'Id',
                //     label: 'Id',
                //     type: 'number',
                //     col: 6,
                    
                //     style: 'background-color:#F8F0D7;border-radius:8px;'
                // }),
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'File đính kèm',
                //     col: 6
                // }, this.srv),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    col: 6,
                    isNewRow: true,
                    isDisabled: 'true'
                }),
                new CheckBoxInput({
                    key: 'CompletedApprove',
                    label: 'Đã hoàn thành duyệt',
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
            width: 600,
            dataType: 'Object',
            //exprReadOnly: "{EXPR=Attached} == true && {EXPR=Description} != ''"
        }
    ]

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
            width: 0,
            dataType: 'Array',
            lookupKey: 'Dept',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            isReadOnly: 'true'
        },
        {
            header: 'Tên bộ phận',
            binding: 'DeptName',
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Mã cấp bậc',
            binding: 'PositionCode',
            width: 0,
            dataType: 'Array',
            lookupKey: 'Position',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
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
            width: 120,
            dataType: 'Array',
            lookupKey: 'Employee',
            // lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId0}' AND PositionCode = '{EXPR=PositionCode}')",
            validators: "{EXPR=EmployeeCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên nhân viên',
            binding: 'EmployeeName',
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Nhân viên duyệt được chỉ định',
            binding: 'EmployeeCodeReal',
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId0}' AND PositionCode = '{EXPR=PositionCode}')",
            width: 120,
            validators: "{EXPR=EmployeeCode} != '' && {EXPR=EmployeeCode}.toString().indexOf(',') > 0 && {EXPR=EmployeeCodeReal} == ''",
            validatorMessage: 'Không được bỏ trống giá trị',
            ignoreError: 1
        },
        {
            header: 'Số ngày xử lý',
            binding: 'NumberOfDays',
            width: 70,
            isReadOnly: 'true'
        },
        {
            header: 'Được trả lại hồ sơ',
            binding: 'ApproveReturn',
            dataType: 'Boolean',
            width: 80,
            isReadOnly: 'true'
        },
        // {
        //     header: 'Trả về cấp bậc',
        //     binding: 'PositionCodeReturn',
        //     width: 150,
        //     isReadOnly: 'true'
        // }
    ]

    childColumns2 = [
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
}