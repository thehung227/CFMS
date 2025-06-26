import { PanelBase } from "../../ui/panel/PanelBase";
import { TablePanel } from "../../ui/panel/TablePanel";
import { DateBoxInput } from "../../ui/input/DateBoxInput";
import { TextBoxInput } from "../../ui/input/TextBoxInput";
import { LookupBoxInput } from "../../ui/input/LookupBoxInput";
import { Validators } from "@angular/forms";
import { ButtonInput } from "../../ui/input/ButtonInput";
import { CheckBoxInput } from "../../ui/input/CheckBoxInput";
import { NumberBoxInput } from "../../ui/input/NumberBoxInput";
import { IEditorFormulaDeclaration } from "../IEditorDeclare";
import { IExplorerFormulaDeclaration } from "../IExplorerDeclare";
import { UploadInput } from "../../ui/input/UploadInput";
import { MultiSelectInput } from "../../ui/input/MultiSelectInput";
import { SystemConstants } from "../../core/common/system.constants";
import { UploadImage } from "../../ui/input/UploadImage";
import { getElement } from "wijmo/wijmo";
import { RichTextBoxInput } from "../../ui/input/RichTextBoxInput";
import { Global } from "../../shared/global";

export class LayoutProposalRevenueExpenExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocVB_Explorer',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}' OR ProductCostId0 = '{VAR=Filter.ProductCostId}') AND DocCode = 'A1' AND IsActive = 1 AND ISNULL(BranchCode,'') = '{VAR=Branch.Ma_Dvcs}'",
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
            Text: 'WorkFlow VBQLNB - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocVB_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "WorkFlow VBQLNB",
                    FileName: "WorkFlow VBQLNB - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "WorkFlow_VBQLNB.docx",
                    // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
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
            header: 'Tên văn bản',
            binding: 'Description',
            width: 250
        },
        {
            header: 'Số văn bản',
            binding: 'DocNo',
            width: 150,
            dataType: 'String'
        },
        // {
        //     header: 'Phòng/ ban',
        //     binding: 'ProductName',
        //     width: 250
        // },
        {
            header: 'Ngày hoàn thiện duyệt',
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

export class LayoutProposalRevenueExpenEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocVB_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1,
                    DocCode: 'A1',
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    DocStatus: '4'

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
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    }
                },
              
            ]
           
               
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Bảng tổng hợp Bill - {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_B30BizDocVB_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng tổng hợp",
                    FileName: "Bảng tổng hợp đề xuất thu chi - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "BM_DeXuatChiTet.docx",
                    // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
            ]
   
    }
    }

    evaluators = {
        'Evaluator_ServerConstraint_CTC_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,DocCode,DocNo,Id',
            Command: 'ufn_B30BizDocVB_DefaultDocNo',
            DataMember: 'DocNo'
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,ParentBizDocId',
            Command: 'usp_B30BizDocApprove_GetData',
            DataMember: '',
            OutputTable: 1
        },
        'Evaluator_ServerConstraint_K2_LoadPrevious': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_NEW_BcDoanhThuChiPhi_LoadDXThuChi',
            zExpr: "ProductCostId != ''",
            OutputTable: 3
        },
        'Evaluator_ServerConstraint_K6_LoadWorkDone': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'CCMBudgetId',
            Command: 'usp_CCMBudget_LoadWorkDone',
            // zExpr: "ProductCostId != ''",
            OutputTable: 4
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},BizDocId,{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true && CompletedApprove == false'
        },
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'BizDocId,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Conteccons_NotChangeWhenApproveSent',
            MessageText: 'Không được thay đổi khi đã gửi duyệt',
            IgnoreError: 0
        },
        'Evaluator_ServerUpdated_BuiltinOrder': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_Web_SetBuiltionOrder_BizDocVB'
        },
        'Evaluator_ServerUpdated_CreateFormula': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,Date1,Date2',
            Command: 'usp_B30BizDocVB_UpdateInfo_WhenSaveA5'
        },
        'Evaluator_ServerConstraint_Check_TotalAmount': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'BizDocId',
            Command: 'ufn_Newtecons_CheckTotalAmount',
            MessageText: 'Tổng giá trị Thanh toán BCH đề xuất > Tổng giá trị Thanh toán theo Hợp đồng -> Kiểm tra lại !!!',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerConstraint_Check_AmountDate': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'BizDocId',
            Command: 'ufn_Newtecons_CheckDateThuDuKien',
            MessageText: 'Yêu cầu nhập ngày dự kiến Thu tiền hoặc ngày dự kiến TT theo HĐ !!!',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
        // 'Evaluator_InsertApprove_WhenSaved': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: 'BizDocId,DocCode',
        //     Command: 'usp_SOL_InsertApprove_WhenSaved',
        //     // zExpr: 'ApproveSend == true'
        // }
    }

    serverConstraint = [
'Evaluator_ServerConstraint_CTC_DefaultDocNo'
    ]

    serverUpdating = [
        'Evaluator_ServerConstraint_Check_AmountDate',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_TotalAmount'
    ]

    serverUpdated: string[] = [
        // 'Evaluator_InsertApprove_WhenSaved',
        'Evaluator_ServerUpdated_BuiltinOrder',
        'Evaluator_ServerUpdated_CreateFormula',
        'Evaluator_UpdateInfo_WhenApproveSend'
    ]

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_K2_LoadPrevious',
        
    ];

    buttonCommand: string[] = [

    ]

    importCommand: string[] = [

    ]

    columnChanged = {
        ProcessCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_Approve_GetData'
            ]
        }
    };

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
            }
        }
    ];

    columnsReadOnly = [];

    linkReporter = {
        'btnBaoCao': {
            directory: 'reporterpropose',
            type: 'view',
            key: 'REP01_DXTCT',
            parameter: { 'Commandkey': 'REP01_DXTCT', 'ProductCostId': '{EXPR=ProductCostId}', 'Ma_Dvcs': '{VAR=Branch.Ma_Dvcs}' }
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
                    label: 'Số',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    validators: [Validators.required],
                    lookupfilter: "(RowId = '{VAR=Filter.ProductCostId}') AND IsGroup=0 AND IsActive=1 AND ProductType IN ('1','3') AND BranchCode='{VAR=Branch.Ma_Dvcs}'",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12
                }),

                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "DocStatus=4 AND IsActive=1 AND Ma_Ct='{EXPR=DocCode}'",//AND DocCode='{EXPR=DocCode}'",//"(Code IN (SELECT Code FROM dbo.ufn_Coteccons_Filter_ProcessCodeByBizDocC3('{EXPR=ProductCostId}','{EXPR=ParentBizDocId}','{EXPR=DocCode}','{VAR=Branch.Ma_Dvcs}')))",//('{EXPR=PayTeamType}' = '00') OR 
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12
                }, this.srv, this.parentData),
                new ButtonInput({
                    key: 'btnBaoCao',
                    label: 'Báo cáo đề xuất thu chi Tết',
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
        // {
        //     header: 'Mã tài liệu',
        //     binding: 'DocumentCode',
        //     width: 80,
        //     dataType: 'Array',
        //     lookupKey: 'Document',
        //     lookupfilter: 'IsGroup=0 AND IsActive=1'
        // },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 500,
            dataType: 'Object',
            validators: "{EXPR=FilePath}==0",
            validatorMessage: 'Yêu cầu đính kèm tài liệu',
            ignoreError: 1
        },
        {
            header: 'Link SharePoint',
            binding: 'Description',
            width: 500,
            validators: "{EXPR=Description}==''",
            validatorMessage: 'Yêu cầu có link SharePoint',
            ignoreError: 1
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
            header: 'Mã Ưu tiên chi',
            binding: 'CodeKHC',
            dataType: 'Array',
            lookupKey: 'KHC',
            isReadOnly: 'true',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ClassCode1='02'",
            width: 100
        },
       
        {
            header: 'Tên đối tượng',
            binding: 'CustomerName',
            width: 250,
            isReadOnly: 'true',
        },
       
        {
            header: 'Thông tin hợp đồng',
            binding: 'DocInfo',
            width: 200,
            isReadOnly: 'true'

        },
        {
            header: 'Tổng cộng',
            binding: 'OriginalAmount',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'GTTT trong tháng 11/23 (Bill đã up)',
            binding: 'Amount1',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'GTTT trong tháng 11/23 (Bill dự trù)',
            binding: 'PlanAmount1',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'GTTT trong tháng 12/23 (Bill đã up)',
            binding: 'Amount2',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'GTTT trong tháng 12/23 (Bill dự trù)',
            binding: 'PlanAmount2',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'GTTT trong tháng 01/24 (Bill đã up)',
            binding: 'Amount3',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'GTTT trong tháng 01/24 (Bill dự trù)',
            binding: 'PlanAmount3',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'GTTT trong tháng 02/24 (Bill đã up)',
            binding: 'Amount4',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'GTTT trong tháng 02/24 (Bill dự trù)',
            binding: 'PlanAmount4',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'Tổng cộng',
            binding: 'ThisPeriod',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'GTTT trong tháng 11/23 - BCH đề xuất',
            binding: 'Amount5',
            dataType: 'Number',
          
            width: 150
        },
        {
            header: 'GTTT trong tháng 12/23 - BCH đề xuất',
            binding: 'Amount6',
            dataType: 'Number',
          
            width: 150
        },
        {
            header: 'GTTT trong tháng 01/24 - BCH đề xuất',
            binding: 'Amount7',
            dataType: 'Number',
           
            width: 150
        },
        {
            header: 'GTTT trong tháng 02/24 - BCH đề xuất TT trước tết',
            binding: 'Amount8',
            dataType: 'Number',
           
            width: 200
        },
        {
            header: 'GTTT trong tháng 02/24 - BCH đề xuất TT sau tết',
            binding: 'Amount9',
            dataType: 'Number',
           
            width: 200
        },
        // {
        //     header: 'Ngày tính hạn TT',
        //     binding: 'ThisDateNC',
        //     dataType: 'Date',
        //     format: 'dd/MM/yyyy',
        //     width: 150
        // },
    
        // {
        //     header: 'Ngày tính hạn TT',
        //     binding: 'NextDateNC',
        //     dataType: 'Date',
        //     format: 'dd/MM/yyyy',
        //     width: 150
        // },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50
        },
        {
            header: 'Mã đối tượng',
            binding: 'CustomerCode',
            dataType: 'Array',
            lookupKey: 'Customer_CCM2',
            bindingList: {
                Name: 'CustomerName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
            width: 0
        },
        {
            header: 'Id hợp đồng',
            binding: 'BizDocId_C1',
            width: 0,
            dataType: 'Array',
            lookupKey: 'BizDoc2',
            bindingList: {
                DocInfo: 'DocInfo',
                ContractType: 'ContractType'
            },
            // displayMember: 'DocInfo',
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
            lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        },
    ]

    childColumns4 = [
        {
            header: 'Thời gian',
            binding: 'DateJob',
            isRequired: true,
            width: 120,
            dataType: 'Date',
            format: 'MM/yyyy'
        },
        {
            header: 'Claim',
            binding: 'ItemNo',
            isRequired: true,
            width: 100
        },
       
     
       
        {
            header: 'Gói thầu',
            binding: 'ProductName',
            width: 200, 
        },
        {
            header: 'Ngày duyệt claim và xuất hóa đơn',
            binding: 'StartDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false,
            width: 150
        },
       
       
        {
            header: 'Giá trị thanh toán',
            binding: 'OriginalAmount',
            dataType: 'Number',

            width: 200
        },
        {
            header: 'Thời gian thanh toán theo HĐ',
            binding: 'EndDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false,
            width: 150
        },
       
        {
            header: 'Dự kiến thu lần 1',
            binding: 'Amount1',
            dataType: 'Number',

            width: 200
        },
        {
            header: 'Ngày thu',
            binding: 'Date1',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false,
            width: 150
        },
        {
            header: 'Dự kiến thu lần 2',
            binding: 'Amount2',
            dataType: 'Number',

            width: 200
        },
        {
            header: 'Ngày thu',
            binding: 'Date2',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false,
            width: 150
        },
        {
            header: 'Dự kiến thu lần 3',
            binding: 'Amount3',
            dataType: 'Number',

            width: 200
        },
        {
            header: 'Ngày thu',
            binding: 'Date3',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false,
            width: 150
        },
        {
            header: 'Dự kiến không thu được trước tết',
            binding: 'ThisPeriod',
            dataType: 'Number',

            width: 200
        },
        // {
        //     header: 'Ngày tính hạn TT',
        //     binding: 'ThisDateNC',
        //     dataType: 'Date',
        //     format: 'dd/MM/yyyy',
        //     width: 150
        // },
    
        // {
        //     header: 'Ngày tính hạn TT',
        //     binding: 'NextDateNC',
        //     dataType: 'Date',
        //     format: 'dd/MM/yyyy',
        //     width: 150
        // },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50
        },
        {
            header: 'Mã đối tượng',
            binding: 'CustomerCode',
            dataType: 'Array',
            lookupKey: 'Customer_CCM2',
            bindingList: {
                Name: 'CustomerName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
            width: 0
        },
        {
            header: 'Id hợp đồng',
            binding: 'BizDocId_C1',
            width: 0,
            dataType: 'Array',
            lookupKey: 'BizDoc2',
            bindingList: {
                DocInfo: 'DocInfo',
                ContractType: 'ContractType'
            },
            // displayMember: 'DocInfo',
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
            lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        },
    ]
}
