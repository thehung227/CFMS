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

// Kế hoạch Claim
export class LayoutBOQInvestorClaimExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BillInvestor_Explore',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'BO' AND IsActive=1",
                OrderBy: 'ProductName,DocDate DESC,DocNo DESC',
                RowPage: 50,
                DefaultValues: {
                }
            },
            Child: {
                Name: 'vB30BizDocApprove_BillExplorer',
                ParentKey: 'BizDocId',
                ChildKey: 'BizDocId',
                OrderBy: 'ApproveGroup'
            }
        },
        PrintDocument: {
            Key: 'CCMBudgetViewer',
            Text: 'Kế hoạch ký kết hợp đồng - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30Task_VoucherForm',
            Command_WorkFlow: 'usp_B30Task_VoucherForm_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Đề nghị mở bảo lãnh dự thầu",
                    FileName: "Đề nghị mở bảo lãnh dự thầu - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "BM_DeNghiMoBLDT.docx",
                    // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
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
        }
    }

    parentGrid = [
        {
            header: 'Gói thầu',
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
            header: 'Ngày hoàn thiện duyệt',
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

export class LayoutBOQInvestorClaimEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    // Khai báo view lấy dữ liệu <Tables> B7
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BIllInvestor_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'BO',
                    ProductCostId1: 'PROD001327',
                    Loai_Ct: 'BOQ_Claim',
                    BizDocId: '',
                    Id: -1,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
             
                {
                    Name: 'vB30BillInvestorDetail_Edit',
                    ParentKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        DocDate: 'Parent.DocDate',
                        BuiltinOrder: 1,
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
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
        'Evaluator_ServerConstraint_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,DocCode,Id',
            Command: 'ufn_B30BillInvestor_DefaultDocNo',
            zExpr: "ProductCostId != ''",
            DataMember: 'DocNo'
        },
        'Evaluator_TotalAmount_SetValue': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: 'TotalAmount',
            Value: 'Amount',
            Tables: 0
         },
         'Evaluator_ImplementationAmount_SetValue': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: 'ImplementationAmount',
            Value: 'ImplementationAmount',
            Tables: 0
         },
        'Evaluator_BillInvestorDetail_Amount': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount",
            Value: "Math.round(Quantity*UnitCost)",
            // zExpr: "OriginalAmount == '' || OriginalAmount == 0",
            Tables: 0
        },
        'Evaluator_BillInvestorDetail_ImplementationAmount': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "ImplementationAmount",
            Value: "Math.round(ImplementationRate*Amount)",
            // zExpr: "OriginalAmount == '' || OriginalAmount == 0",
            Tables: 0
        },
        'Evaluator_BillInvestorDetail_AcumPerformAmount': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "AcumPerformAmount",
            Value: "ImplementationAmount + PerformLastPeriodAmount",
            // zExpr: "OriginalAmount == '' || OriginalAmount == 0",
            Tables: 0
        },
        'Evaluator_ServerConstraint_BOQInvestorDetail_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'BizDocId_BOQ',
            Command: 'usp_Newtecons_LoadBOQClaim',
            OutputTable: 0
        },
        'Evaluator_ServerUpdated_BizDocCCM_RoundAmount': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Newtecons_BillInvestorDetail_Update'
        },
        'Evaluator_ServerUpdated_BizDocCCM_AutoRowSub': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_B30BillInvestor_AutoUpdateRowSub'
        }
    };

    serverConstraint = [
        'Evaluator_ServerConstraint_DefaultDocNo'
    ];

    serverUpdating = [
        
    ]

    serverUpdated = [
        'Evaluator_ServerConstraint_DefaultDocNo',
        'Evaluator_ServerUpdated_BizDocCCM_RoundAmount',
        'Evaluator_ServerUpdated_BizDocCCM_AutoRowSub'
    ];

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_BOQInvestorDetail_GetData',
        'Evaluator_TotalAmount_SetValue',
    ];

    buttonCommand: string[] = [

    ];

    importCommand: string[] = [

    ]

    columnChanged = {
        // ProcessCode: {
        //     Evaluators: [
        //         'Evaluator_ServerConstraint_Approve_GetData'
        //     ]
        // }
    };

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
                Quantity: {
                   Evaluators: [
                    'Evaluator_BillInvestorDetail_Amount',
                    'Evaluator_TotalAmount_SetValue',
                    'Evaluator_BillInvestorDetail_ImplementationAmount',
                    'Evaluator_ImplementationAmount_SetValue'
                    ]
                },
                UnitCost: {
                    Evaluators: [
                     'Evaluator_BillInvestorDetail_Amount',
                     'Evaluator_TotalAmount_SetValue',
                     'Evaluator_BillInvestorDetail_ImplementationAmount',
                     'Evaluator_ImplementationAmount_SetValue'
                     ]
                 },
                 ImplementationRate: {
                    Evaluators: [
                     'Evaluator_BillInvestorDetail_ImplementationAmount',
                     'Evaluator_ImplementationAmount_SetValue',
                     'Evaluator_BillInvestorDetail_AcumPerformAmount'
                     ]
                 },
                 ImplementationAmount: {
                    Evaluators: [
                     'Evaluator_BillInvestorDetail_AcumPerformAmount'
                     ]
                 }
            }
        },
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
                    label: 'Gói thầu/Phòng, ban',
                    lookupKey: 'ProductCost',
                    binding: {
                    },
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND RowId = '{VAR=Filter.ProductCostId}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
               
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Hạng mục',
                    lookupKey: 'ClaimDetail',
                    binding: {
                    },
                    isReadOnly: 'true',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12,
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'BizDocId_BOQ',
                    label: 'BOQ',
                    lookupKey: 'BOQ',
                    binding: {
                    },
                    isReadOnly: 'true',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12,
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Chủ đầu tư',
                    lookupKey: 'Customer_CCM2',
                    binding: {
                    },
                    isReadOnly: 'true',
                    validators: [Validators.required],
                    lookupfilter: "(IsGroup=0 AND IsActive=1)",
                    hideValueMember: false,
                    col: 12,
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
               
                new NumberBoxInput({
                    key: 'TotalAmount',
                    label: 'Tổng tiền BOQ',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                 }),
                 new NumberBoxInput({
                    key: 'ImplementationAmount',
                    label: 'Tổng tiền giá trị thực hiện',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                 }),
                // new LookupBoxInput({
                //     key: 'ProcessCode',
                //     label: 'Quy trình duyệt',
                //     lookupKey: 'Approve',
                //     lookupfilter: "IsActive=1 AND Ma_Ct='{EXPR=DocCode}'",
                //     validators: [Validators.required],
                //     hideValueMember: false,
                //     col: 12
                // }, this.srv, this.parentData),
          
            ]
        })
    ];

   
    childColumns = [
        {
            header: 'Stt',
            binding: 'ItemNo',
            width: 100
        },
        {
            header: 'Diễn giải',
            binding: 'Description',
            width: 250
        },
        {
            header: 'Đơn vị',
            binding: 'Unit',
            width: 100
        },
        {
            header: 'Giá',
            binding: 'UnitCost',
            width: 150,
            dataType: 'Number',
            format: 'n3'
        },
        {
            header: 'Khối lượng',
            binding: 'Quantity',
            width: 150,
            format: 'n3',
            dataType: 'Number'
        },
        {
            header: 'Thành tiền',
            binding: 'Amount',
            width: 150,
            dataType: 'Number'
        },
        {
            header: 'Khối lượng TH đến kỳ trước',
            binding: 'PerformLastPeriodQuantity',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 110
        },
        {
            header: 'Giá trị thực hiện đến kỳ trước',
            binding: 'PerformLastPeriodAmount',
            dataType: 'Number',
            isRequired: true,
            isReadOnly: 'true',
            width: 110
        },
        {
            header: '% thực hiện',
            binding: 'ImplementationRate',
            width: 150,
            format: 'p2',
            dataType: 'Number'
        },
        {
            header: 'Khối lượng thực hiện',
            binding: 'ImplementationQuantity',
            width: 150,
            format: 'n3',
            dataType: 'Number'
        },
        {
            header: 'Giá trị thực hiện',
            binding: 'ImplementationAmount',
            width: 150,
            format: 'n0',
            dataType: 'Number'
        },
        {
            header: 'Khối lượng lũy kế thực hiện',
            binding: 'AcumPerformQuantity',
            dataType: 'Number',
            isRequired: true,
            isReadOnly: 'true'
         
        },
        {
            header: 'Giá trị lũy kế thực hiện',
            binding: 'AcumPerformAmount',
            dataType: 'Number',
            isRequired: true,
            isReadOnly: 'true',
            width: 110
        }
       
    ];
}