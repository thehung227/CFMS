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

// Tổng hợp so sánh chọn thầu
export class LayoutTenderSelectionExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocVB_Explorer',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND DocCode = 'A5' AND IsActive = 1",
                OrderBy: 'Id', //rất quan trọng, lỗi méo tìm đc đâu
                RowPage: 50
            },
            Child: {
                Name: 'vB30BizDocApprove_ExplorerBizDocVB',
                ParentKey: 'BizDocId',
                ChildKey: 'BizDocId',
                OrderBy: 'ApproveGroup'
            }
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'WorkFlow - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocVB_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                // {
                //     Layout: "MAU1",
                //     Name: "WorkFlow Đánh giá QLTC",
                //     FileName: "WorkFlow Đánh giá QLTC - {EXPR=ProductName} - {EXPR=DocNo}",
                //     WordName: "WorkFlow_DGQLTC.docx",
                //     // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                //     FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                // }
            ],
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
        }
    }

    parentGrid = [
        {
            header: 'Ngày lập',
            binding: 'DocDate',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Số hồ sơ',
            binding: 'DocNo',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            width: 250
        },
        // {
        //     header: 'Phòng/ ban',
        //     binding: 'ProductName',
        //     width: 250
        // },
        {
            header: 'Ngày hoàn thiện',
            binding: 'FinishDate',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Đã gửi duyệt',
            binding: 'ApproveSend',
            width: 150,
            dataType: 'Boolean'
        },
        {
            header: 'Hoàn thành duyệt',
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
        // {
        //     header: 'Loại',
        //     binding: 'Loai_Chon_Thau',
        //     width: 150,
        //     dataType: 'String'
        // },
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
            width: 150,
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

export class LayoutTenderSelectionEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocVB_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1,
                    DocCode: 'A5',
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    DocStatus: '4',
                    // ProductCostId0: 'PROD000421'
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
                        DocDate: 'Parent.DocDate',
                    }
                },
                {
                    Name: 'vB30BizDocApprove_AEditBizDocVB',
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
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30BizDocVBDetail_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    }
                },
                {
                    Name: 'vB30BizDocVBDetail3_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1'
                    }
                },
            ]
        }
       
    }

    evaluators = {
        'Evaluator_ServerConstraint_CTC_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,ParentBizDocId,ClassCode3,DocCode,DocNo,Id',
            Command: 'ufn_B30BizDocVB_DefaultDocNo_Tender',
            DataMember: 'DocNo'
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,ParentBizDocId',
            Command: 'usp_B30BizDocApprove_GetData',
            DataMember: '',
            zExpr: 'ApproveSend == false',
            OutputTable: 1
        },
        'Evaluator_ServerConstraint_Attach_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'BizDocId,ProductCostId',
            Command: 'usp_TenderSelection_LoadAttach',
            DataMember: '',
            OutputTable: 0
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},BizDocId,{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true && CompletedApprove == false'
        },
        'Evaluator_UpdateInfo_WhenSave': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,Date1,Date2',
            Command: 'usp_B30BizDocVB_UpdateInfo_WhenSaveA5',
            // zExpr: 'ApproveSend == false'
        },
        // 'Evaluator_InsertApprove_WhenSaved': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: 'BizDocId,DocCode',
        //     Command: 'usp_SOL_InsertApprove_WhenSaved',
        //     zExpr: 'CompletedApprove == false'
        // },
        // 'Evaluator_ServerConstraint_B30BizDocVBDetail3_GetData': {
        //     EvaluatorName: 'EvaluatorQueryLoadChild',
        //     ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId',
        //     Command: 'usp_A3_B30BizDocVBDetail3_GetData',
        //     DataMember: '',
        //     OutputTable: 4
        // },
        // 'Evaluator_ServerUpdated_CreateFormula_BizDocVBDetail3': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: 'BizDocId',
        //     Command: 'usp_SOL_CreateFormula_BizDocVBDetail3'
        // },
        'Evaluator_BizDocVB_NumberCol3_Calc': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "NumberCol3",
            Value: "(NumberCol1-NumberCol2)/NumberCol1"
        },
        'Evaluator_BizDocVB_DiffNumber_Calc': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "DiffNumber",
            Value: "NumberCol1-NumberCol2"
        },
        'Evaluator_BizDocVB_TotalRate_Calc': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "TotalRate",
            Value: "Rate",
            Tables: 4
        }
    }

    serverConstraint = [
        'Evaluator_ServerConstraint_CTC_DefaultDocNo',
        // 'Evaluator_ServerConstraint_Approve_GetData'
        // 'Evaluator_ServerConstraint_Attach_GetData'
    ]

    serverUpdating = [

    ]

    serverUpdated: string[] = [
        // 'Evaluator_UpdateInfo_WhenApproveSend',
        'Evaluator_UpdateInfo_WhenSave'
    ]

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_Approve_GetData',
        'Evaluator_ServerConstraint_Attach_GetData'
    ];

    buttonCommand: string[] = [

    ]

    importCommand: string[] = [

    ]

    columnChanged = {
       
        NumberCol1: {
            Evaluators: [
                'Evaluator_BizDocVB_NumberCol3_Calc',
                'Evaluator_BizDocVB_DiffNumber_Calc'
            ]
        },
        NumberCol2: {
            Evaluators: [
                'Evaluator_BizDocVB_NumberCol3_Calc',
                'Evaluator_BizDocVB_DiffNumber_Calc'
            ]
        }
    };

    columnChangedChild = [
        {
            Tables: 4,
            columnChanged: {
                Rate: {
                    Evaluators: [
                        'Evaluator_BizDocVB_TotalRate_Calc'
                    ]
                },
            }
        }
    ];

    columnsReadOnly = [];

    linkReporter = {
        'btnBaoCao': {
            directory: 'reportertenderselection',
            type: 'view',
            key: 'REP01_CCM_TENDERSELECTION',
            parameter: { 'Commandkey': 'REP01_CCM_TENDERSELECTION', 'ProductCostId': '{EXPR=ProductCostId}', 'BizDocId': '{EXPR=BizDocId}'}
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
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
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
                new DateBoxInput({
                    key: 'Date1',
                    label: 'Ngày chốt gói thầu',
                    dataType: 'date',
                    isRequired: true,
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    validators: [Validators.required],
                    // isReadOnly: 'true',
                     isNewRow: true,
                }),
                new LookupBoxInput({
                    key: 'ClassCode3',
                    label: 'Loại so sánh',
                    lookupKey: 'Class',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='TenderType'",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Version',
                    lookupKey: 'BizDocVB',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND DocCode='A5' AND ClassCode3='01' AND ProductCostId='{VAR=Filter.ProductCostId}'",
                    visible: "'{EXPR=ClassCode3}' != '01'",
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    hideValueMember: false,
                    // validators: [Validators.required],
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    validators: [Validators.required],
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    lookupfilter: "RowId = '{VAR=Filter.ProductCostId}' AND IsGroup=0 AND IsActive=1 AND ProductType IN ('1','3') AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
               
                new LookupBoxInput({
                    key: 'SubjectCode',
                    label: 'Công việc',
                    lookupKey: 'Job_CCM',
                    hideValueMember: false,
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    col: 12,
                    binding: {
                        ActivityCode: 'ActivityCode',
                        // Address: 'Address'
                    },
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ActivityCode',
                    label: 'Lĩnh vực',
                    lookupKey: 'Activity',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    // isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    type: 'text',
                    col: 12
                }),
                new NumberBoxInput({
                    key: 'NumberCol1',
                    label: 'Giá BĐ',
                    type: 'number',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'ClassCode1',
                    label: 'Loại hình',
                    lookupKey: 'Class',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='INCURRED' AND Code IN ('XD','ME')",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 6
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'NumberCol2',
                    label: 'Đơn giá chọn',
                    type: 'number',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    col: 6,
                    isNewRow: true
                }),
                new NumberBoxInput({
                    key: 'DiffNumber',
                    label: 'Chênh lệch',
                    type: 'number',
                    
                    isDisabled: 'true',
                    col: 6,
                    // isNewRow: true
                }),
                // new LookupBoxInput({
                //     key: 'ClassCode2',
                //     label: 'Loại đối tác',
                //     lookupKey: 'Class',
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='CustomerType'",
                //     hideValueMember: false,
                //     validators: [Validators.required],
                //     col: 6
                // }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'NumberCol3',
                    label: 'Chênh lệch (%)',
                    type: 'number',
                    
                    col: 6,
                    
                    isDisabled: 'true',
                    format: 'P2'
                    // isReadOnly: 'true',
                    // style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'TotalRate',
                    label: 'Tổng % giao thầu',
                    type: 'number',
                    col: 6,
                    // isNewRow: true,
                    isDisabled: 'true',
                    format: 'P2'
                    // isReadOnly: 'true',
                    // style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'TotalAmount',
                    label: 'HQ đàm phán đã vào BCTC',
                    type: 'number',
                    
                   
                    col: 6,
                    // isNewRow: true
                }),
                new NumberBoxInput({
                    key: 'TotalAmountBCTC',
                    label: 'HQ Khác đã vào BCTC đầu dự án',
                    type: 'number',
                    
                    
                    col: 6,
                    // isNewRow: true
                }),
               
              
                // new LookupBoxInput({
                //     key: 'CustomerCode',
                //     label: 'NTP/ NCC chọn',
                //     validators: [Validators.required],
                //     lookupKey: 'Customer',
                //     lookupfilter: "IsGroup=0 AND IsActive=1",
                //     hideValueMember: false,
                //     binding: {
                //     },
                //     col: 12
                // }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description1',
                    label: 'Ghi chú',
                    type: 'text',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    col: 12
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "DocStatus=4 AND IsActive=1 AND Ma_Ct='{EXPR=DocCode}' AND ProcessCode IN (SELECT Code FROM dbo.ufn_BizDocVB_Filter_ProcessCodeByXDME('{EXPR=ClassCode1}','{EXPR=DocCode}'))",
                    hideValueMember: false,
                    validators: [Validators.required],
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    col: 12
                }, this.srv, this.parentData),
                new ButtonInput({
                    key: 'btnBaoCao',
                    label: 'Phân tích gói thầu',
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    col: 6,
                    isNewRow: true,
                    isDisabled: 'true'
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
            header: 'File trình duyệt',
            binding: 'FilePath',
            width: 500,
            dataType: 'Object',
            // validators: "{EXPR=FilePath}==0",
            // validatorMessage: 'Yêu cầu đính kèm tài liệu',
            // ignoreError: 1
        },
        {
            header: 'Yêu cầu đính kèm',
            binding: 'Attached',
            dataType: 'Boolean',
            width: 80,
            isReadOnly: 'true'
        },
        // {
        //     header: 'Link SharePoint',
        //     binding: 'LinkSharePoint',
        //     width: 150,
        //     // validators: "{EXPR=Description}==''",
        //     // validatorMessage: 'Yêu cầu có link SharePoint',
        //     // ignoreError: 1
        // },
        {
            header: 'Diễn giải',
            binding: 'Description',
            width: 250,
            // validators: "{EXPR=Description}==''",
            // validatorMessage: 'Không được bỏ trắng giá trị',
            // ignoreError: 1
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
            width: 200,
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
            width: 200,
            isReadOnly: 'true'
        },
        {
            header: 'Mã nhân viên',
            binding: 'EmployeeCode',
            width: 150,
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
            width: 250,
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

    childColumns3 = [
        {
            header: 'Mã bộ phận',
            binding: 'DeptCode',
            width: 100,
            dataType: 'Array',
            lookupKey: 'Dept',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            bindingList: {
                Name: "DeptName"
            }
        },
        {
            header: 'Tên bộ phận',
            binding: 'DeptName',
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Mã cấp bậc',
            binding: 'PositionCode',
            width: 100,
            dataType: 'Array',
            lookupKey: 'Position',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            bindingList: {
                Name: "PositionName"
            }
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
            lookupfilter: "IsActive=1 AND IsGroup=0",
            bindingList: {
                Name: "EmployeeName"
            }
            // validators: "{EXPR=EmployeeCode} == ''",
            // validatorMessage: 'Không được bỏ trắng giá trị',
            // ignoreError: 1
        },
        {
            header: 'Tên nhân viên',
            binding: 'EmployeeName',
            width: 250,
            isReadOnly: 'true'
        },
    ]

    childColumns4 = [
        {
            header: 'Mã đối tượng',
            binding: 'CustomerCode',
            width: 150,
            dataType: 'Array',
            lookupKey: 'Customer',
            lookupfilter: "IsGroup=0 AND IsActive=1",
            bindingList: {
                Name: "CustomerName",
                TaxRegNo: "TaxRegNo"
            }
        },
       
        {
            header: 'Tên đối tượng',
            binding: 'CustomerName',
            width: 400,
            
        },
        {
            header: 'Mã số thuế',
            binding: 'TaxRegNo',
            width: 150,
            validators: "{EXPR=TaxRegNo}==''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'NC/NTP/NCC',
            binding: 'CourseTypeCode',
            width: 150,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "ParentCode = 'CustomerType'"
        },
        {
            header: 'Phạm vi thị trường',
            binding: 'TeritoryCode',
            width: 150,
            dataType: 'Array',
            lookupKey: 'Territory',
            lookupfilter: "IsGroup=0 AND IsActive=1",
            validators: "{EXPR=TeritoryCode}==''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Chọn (Có/Không)',
            binding: 'CousrseCode',
            width: 100,
            dataType: 'Array',
            hideValueMember: true,
            lookupKey: 'Class',
            lookupfilter: "ParentCode = 'TypeSelect'"
        },
        {
            header: '% giao thầu',
            binding: 'Rate',
            dataType: 'Number',
            width: 70,
            min: 0,
            max: 1,
            format: 'P2'
        },
        {
            header: 'Lý do không chọn',
            binding: 'Reason',
            width: 200
        },
        {
            header: 'Cũ/mới',
            binding: 'TypeCustomer',
            width: 100,
            dataType: 'Array',
            hideValueMember: true,
            lookupKey: 'Class',
            lookupfilter: "ParentCode = 'LoaiDoiTac'"
        },
        {
            header: 'Giá báo lần đầu BCH',
            binding: 'UnitCostFirstBCH',
            dataType: 'Number',
            width: 100,
       
            format: 'N0'
        },
        {
            header: 'Giá báo Final BCH',
            binding: 'UnitCostFinalBCH',
            dataType: 'Number',
            width: 100,
       
            format: 'N0'
        },
      
        {
            header: 'Ghi chú',
            binding: 'Remark',
            width: 300
        },
        {
            header: 'Id hợp đồng',
            binding: 'BizDocId_C1',
            width: 200,
            dataType: 'Array',
            lookupKey: 'BizDoc2',
            bindingList: {
                DocInfo: 'DocInfo',
                
            },
            // displayMember: 'DocInfo',
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
            lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14','HD-07') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        },
        {
            header: 'Thông tin hợp đồng',
            binding: 'DocInfo',
            width: 200,
            isReadOnly: 'true'
        },
        {
            header: 'Địa chỉ liên hệ',
            binding: 'Address',
            width: 200,
            validators: "{EXPR=Address}==''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Người liên hệ',
            binding: 'ContractPerson',
            width: 100,
            validators: "{EXPR=ContractPerson}==''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Chức danh',
            binding: 'JobTitle',
            width: 150,
            validators: "{EXPR=JobTitle}==''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'SĐT liên hệ',
            binding: 'PhoneNo',
            width: 150,
            validators: "{EXPR=PhoneNo}==''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Email',
            binding: 'Email',
            width: 150
        },
        {
            header: 'Website',
            binding: 'Website',
            width: 150
        },
        {
            header: 'Người giới thiệu',
            binding: 'EmployeeName',
            width: 150,
            validators: "{EXPR=EmployeeName}==''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        }
    ];
}