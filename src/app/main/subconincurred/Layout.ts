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

// *********************************K7

// Theo dõi phát sinh nhà thầu phụ
export class LayoutSubconIncurredExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30CCMBudget_Explore',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'PS' AND IsActive=1", //AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))
                OrderBy: 'ProductName,DocDate DESC,DocNo DESC',
                RowPage: 50,
                // DefaultValues: {
                //     CurrencyCode: 'VND'
                // }
            },
            Child: {
                Name: 'vB30BizDocApprove_CCMBudgetExplorer',
                ParentKey: 'CCMBudgetId',
                ChildKey: 'BizDocId',
                OrderBy: 'ApproveGroup'
            }
        },
        PrintDocument: {
            Key: 'CCMBudgetViewer',
            Text: 'Theo dõi hỗ trợ LLTC - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30CCMBudget_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Phát sinh NTP, NCC",
                    FileName: "Phát sinh NTP, NCC - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "PS_Theo_doi_phat_sinh_NTP_NCC.docx",
                    // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
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
                }
            ]
        },

        // CopiedValues: {
        //     parameter: { 'Commandkey': 'plansigncon-editor', 'StageCode': '{EXPR=StageCode}' }
        // }
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
            header: 'Doanh thu dự kiến',
            binding: 'Amount_DoanhThu',
            width: 200,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Ngày hoàn thiện',
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
        //     width: 350,
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

export class LayoutSubconIncurredEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    // Khai báo view lấy dữ liệu <Tables> B7
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30CCMBudget_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'PS',
                    DocStatus: '4',
                    CCMBudgetId: '',
                    // ProductCostId: '{VAR=Filter.ProductCostId}',
                    Id: -1,
                    IsWebData: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB30CCMBudgetDetail2_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        CCMBudgetId: 'Parent.CCMBudgetId',
                        BuiltinOrder: '1'
                    }
                },
                {
                    Name: 'vB30BizDocApprove_AEditBudget',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: 'Parent.CCMBudgetId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    }
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.CCMBudgetId',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30CCMBudgetDetail1_Edit',
                    ParentKey: 'CCMBudgetId',
                    ChildKey: 'CCMBudgetId',
                    IsView: 'view',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        CCMBudgetId: 'Parent.CCMBudgetId',
                        BuiltinOrder: '1'
                    }
                },
            ]
        },
        PrintDocument: {
            Key: 'CCMBudgetViewer',
            Text: 'Phát sinh NTP, NCC - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30CCMBudget_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Phát sinh NTP, NCC",
                    FileName: "Phát sinh NTP, NCC - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "PS_Theo_doi_phat_sinh_NTP_NCC.docx",
                    // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ],
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'BuiltinOrder',
                    width: 73,
                    dataType: 'String',
                    align: 'center'
                }
            ]
        }
    };

    evaluators = {
        // server constraint
        'Evaluator_ServerConstraint_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,DocCode,Id',
            Command: 'ufn_B30CCMBudget_DefaultDocNo',
            zExpr: "ProductCostId != ''",
            DataMember: 'DocNo'
        },
        'Evaluator_ServerConstraint_Check_ChuaHoanThienDuyetVerTruoc_KhongTaoVerTiep': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,CustomerCode,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_CheckVer0_ChuaDuyetXong',
            MessageText: 'Không thể lập mới khi chưa hoàn thiện duyệt phiên bản trước',
            IgnoreError: 0,
            zExpr: 'Id < 0'
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
        // 'Evaluator_ServerConstraint_CCMBudgetDetail2_LoadPrevious': {
        //     EvaluatorName: 'EvaluatorQueryLoadChild',
        //     ConstraintKey: 'ProductCostId,CustomerCode,DocCode,CCMBudgetId,{VAR=Branch.Ma_Dvcs}',
        //     Command: 'usp_Ctc_CCMBudgetDetail2_LoadPrevious',
        //     zExpr: "ProductCostId != '' && CustomerCode != ''",
        //     OutputTable: 3
        // },
        // server updated
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},{VAR=EmptyField_BizDocId},CCMBudgetId,{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerUpdated_CCMBudgetDetail2_UpdateFromParent': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CCMBudgetId,DocDate,ProductCostId,DocCode,{VAR=User.Id}',
            Command: 'usp_CCMBudgetDetail2_UpdateFromParentWEB_PS'
        }
    };

    serverConstraint = [
        'Evaluator_ServerConstraint_DefaultDocNo'
    ];

    serverUpdating = [
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange'
    ]

    serverUpdated = [
        'Evaluator_UpdateInfo_WhenApproveSend',
        'Evaluator_ServerUpdated_CCMBudgetDetail2_UpdateFromParent'
    ];

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        //getdataforchild
        'Evaluator_ServerConstraint_Approve_GetData',
        // 'Evaluator_ServerConstraint_CCMBudgetDetail2_LoadPrevious'
    ];

    buttonCommand: string[] = [

    ];

    importCommand: string[] = [

    ];

    columnChanged = {
        ProcessCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_Approve_GetData'
            ]
        }
    };

    columnChangedChild = [
        // {
        //     Tables: 0,
        //     columnChanged: {
        //         OriginalAmount: {
        //             Evaluators: [
        //                 'Evaluator_TotalOriginalAmount_SetValue'
        //             ]
        //         },
        //         PaymentAmount: {
        //             Evaluators: [
        //                 'Evaluator_TotalPaymentAmount_SetValue'
        //             ]
        //         },
        //     }
        // },
        // {
        //     Tables: 1,
        //     columnChanged: {
        //         ApproveSend: {
        //             Evaluators: [

        //             ]
        //         }
        //     }
        // }
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
                    key: 'DocDate',
                    label: 'Ngày lập',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
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
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu',
                    lookupKey: 'ProductCost',
                    // binding: {
                    //     InvestorCode: 'CustomerCode'
                    // },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType='1' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND RowId = '{VAR=Filter.ProductCostId}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12,
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND DocStatus=4 AND Ma_Ct='{EXPR=DocCode}'",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'Amount_DoanhThu',
                    label: 'Doanh thu dự án',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                // new ButtonInput({
                //     key: 'btnBaoCao',
                //     label: 'Báo cáo điều chỉnh kế hoạch ký kết',
                //     col: 6
                // }),  
                // new NumberBoxInput({
                //     key: 'Amount_LoiNhuan',
                //     label: 'Lợi nhuận',
                //     type: 'number',
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }),
                new NumberBoxInput({
                    key: 'TiSuat_LN',
                    label: 'Tỉ suất LN (%)',
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 6,
                    type: 'number',
                    format: 'P2'
                }),
                new NumberBoxInput({
                    key: 'TotalOriginalAmountC',
                    label: 'GTPS kỳ này',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#e3fff3;border-radius:8px;',
                }),
                new NumberBoxInput({
                    key: 'TiSuat_LNDT',
                    label: 'Tỉ lệ GTPS kỳ này/ Doanh thu',
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 6,
                    type: 'number',
                    format: 'P2'
                }),
                // new NumberBoxInput({
                //     key: 'TotalPaymentAmountC',
                //     label: 'Tổng GTPS đã có DT tương ứng',
                //     type: 'number',
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#e3fff3;border-radius:8px;',
                // }),
                new NumberBoxInput({
                    key: 'TongDinhMuc',
                    label: 'Tổng GTPS đến kỳ này (chưa có DT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#e3fff3;border-radius:8px;',
                }),
                new NumberBoxInput({
                    key: 'TiSuat_LNBGD',
                    label: 'Tỉ lệ GTPS đến kỳ này/ Doanh thu',
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 6,
                    type: 'number',
                    format: 'P2'
                }),
                new UploadInput({
                    key: 'FilePath',
                    label: 'Đính kèm',
                    col: 6
                }, this.srv),
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
            header: 'Mã XD/ME',
            binding: 'CodeMEXD',
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='INCURRED'",
            width: 150,
            
        },
        {
            header: 'Nhà thầu phụ',
            binding: 'CustomerCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Customer_CCM2',
            bindingList: {
                NameBinding: 'CustomerName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1",
            width: 120,
            validators: "{EXPR=CustomerCode} == ''",
            validatorMessage: 'Mã đối tượng, không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên nhà thầu',
            binding: 'CustomerName',
            width: 300,
            isReadOnly: 'true'
        },
        {
            header: 'Mã phát sinh',
            binding: 'JobCode',
            dataType: 'Array',
            lookupKey: 'Class',
            bindingList: {
                Name: 'JobName'
            },
            // multiSelection: true,
            // lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='PSNTPNCC'",
            lookupfilter: "IsActive=1 AND ParentCode = 'PS_KDT' OR (ParentCode = 'PS_DTTK' AND Code <> 'PS_KDT')",
            width: 130
        },
        {
            header: 'Nội dung phát sinh',
            binding: 'JobName',
            isRequired: true,
            width: 250
        },
        {
            header: 'Nội dung hỗ trợ',
            binding: 'Remark',
            width: 200
        },
        // {
        //     header: 'Phân loại phát sinh',
        //     binding: 'StatusCode',
        //     dataType: 'Array',
        //     lookupKey: 'Class',
        //     lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='PSNTPNCC'",
        //     width: 80
        // },
        {
            header: 'Id hợp đồng',
            binding: 'ParentBizDocId',
            width: 150,
            dataType: 'Array',
            lookupKey: 'BizDoc2',
            bindingList: {
                DocInfo: 'DocInfo'
            },
             lookupfilter: "((DocCode = 'C3' AND FilePath IS NOT NULL AND (ProductCostId='{EXPR=ProductCostId0}' OR ProductCostId0='{EXPR=ProductCostId0}')) OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        },
        {
            header: 'Thông tin hợp đồng',
            binding: 'DocInfo',
            width: 300,
            isReadOnly: 'true'
        },
        {
            header: 'Giá trị phát sinh kỳ này',
            binding: 'Amount4',
            dataType: 'Number',
            width: 120
        },
        // {
        //     header: 'Giá trị PS đã có doanh thu',
        //     binding: 'Amount3',
        //     dataType: 'Number',
        //     width: 120
        // },
        // {
        //     header: 'Ghi chú',
        //     binding: 'Remark',
        //     width: 200
        // },
        // {
        //     header: 'PS đã được CĐT duyệt',
        //     binding: 'ColBool1',
        //     dataType: 'Boolean',
        //     width: 100
        // }
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
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM dbo.ufn_B30BizDocApprove_GetEmployee('{EXPR=ProductCostId}','{EXPR=ProductCostId0}','{EXPR=PositionCode}'))",
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
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM dbo.ufn_B30BizDocApprove_GetEmployee('{EXPR=ProductCostId}','{EXPR=ProductCostId0}','{EXPR=PositionCode}'))",
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
    ];

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
            header: 'Nhà thầu phụ',
            binding: 'CustomerCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Customer_CCM2',
            bindingList: {
                NameBinding: 'CustomerName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
            width: 120
        },
        {
            header: 'Tên nhà thầu',
            binding: 'CustomerName',
            width: 300,
            isReadOnly: 'true'
        },
       
        // {
        //     header: 'Id hợp đồng',
        //     binding: 'BizDocId_C1',
        //     width: 150,
        //     dataType: 'Array',
        //     lookupKey: 'BizDoc_CTC',
        //     bindingList: {
        //         DocInfo: 'DocInfo'
        //     },
        //     lookupfilter: "IsActive=1"
        // },
        {
            header: 'Thông tin hợp đồng',
            binding: 'DocInfo',
            width: 300,
            isReadOnly: 'true'
        },
        {
            header: 'Giá trị HĐ/PLHĐ (Chưa VAT)',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: 'Giá trị thi công dự kiến',
            binding: 'OriginalAmount1',
            dataType: 'Number',
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: 'Giá trị thực hiện đến kỳ này',
            binding: 'OriginalAmount2',
            dataType: 'Number',
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: 'Tổng giá trị hỗ trợ đến kỳ trước',
            binding: 'OriginalAmount3',
            dataType: 'Number',
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: 'Giá trị hỗ trợ kỳ này',
            binding: 'OriginalAmount4',
            dataType: 'Number',
            width: 150
        },
        {
            header: 'Lũy kế Giá trị hỗ trợ đến kỳ này',
            binding: 'OriginalAmount5',
            dataType: 'Number',
            width: 150
        },
        {
            header: 'Tỷ lệ',
            binding: 'CostPercent',
            dataType: 'Number',
            width: 150,
            type: 'number',
            format: 'P2'
        }
    ];
}