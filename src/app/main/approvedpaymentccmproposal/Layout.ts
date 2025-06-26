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

export class LayoutApprovedPaymentCcmProposalEditor implements IEditorFormulaDeclaration {

    buttonLoadChild: string[];
    serverUpdated: string[];
    buttonCommand: string[];
    constructor(private srv?: any,
        private parentData?: any) { }

    evaluators = {
       
        'Evaluator_ServerUpdating_UpdateStatusByApproveStatus': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,Id,ApproveStatus,{VAR=Branch.Ma_Dvcs},EmployeeCodeNext,DocCode,{VAR=User.Id},Comment,ApproveStatusWeb',
            Command: 'usp_Cotec_UpdateStatusByApproveStatus'
        },
        'Evaluator_Amount_ChiPhi_Calculate': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: "Amount_ChiPhi",
            Value: "PaymentAmount",
            Tables: 0
        }
    };

    approveGrid = 1;

    serverConstraint = [
    ]

    serverUpdating = [

    ]

    columnChanged = {

    };

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
                PaymentAmount: {
                    Evaluators: [
                        'Evaluator_Amount_ChiPhi_Calculate'
                    ]
                }
            }
        }
    ];

    linkReporter = {
        'btnBaoCao': {
            directory: 'reporterplansigncon',
            type: 'view',
            key: 'REP02_CCM_KHKK',
            parameter: { 'Commandkey': 'REP02_CCM_KHKK', 'ProductCostId': '{EXPR=ProductCostId}', 'CCMBudgetId': '{EXPR=CCMBudgetId}', 'BranchCode': '{VAR=Branch.Ma_Dvcs}' }
        }
    }

    columnsReadOnly = [];

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_CCMBudgetEdit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'K9',
                    CCMBudgetId: '',
                    CurrencyCode: 'VND',
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB30CCMBudgetDetail_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'CCMBudgetId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        CCMBudgetId: '',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    }
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: '',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
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
                        DocDate: 'Parent.DocDate'
                    }
                }
              
            ]
        },
        PrintDocument: {
            Key: 'CCMBudgetViewer',
            Text: 'Kế hoạch ký kết hợp đồng - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30CCMBudget_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Kế hoạch ký kết hợp đồng",
                    FileName: "Kế hoạch ký kết hợp đồng - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "1.Ke_Hoach_Ky_Ket_Hop_Dong_XemDuyet.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ],
            PrintGrid: [
            ]
        }
    };

    panels: PanelBase[] = [
        new TablePanel({
            label: 'Panel 1',
            col: 12,
            controls: [
                new DateBoxInput({
                    key: 'DateSend',
                    label: 'Ngày gửi duyệt',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số kế hoạch',
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
                    // lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND RowId = '{VAR=Filter.ProductCostId}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive=1",
                    validators: [Validators.required],
                    hideValueMember: false,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 12
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'TotalAmountBill',
                    label: 'Tổng Bill',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'Amount_DoanhThu',
                    label: 'Tổng tiền BCH đề xuất',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'Amount_ChiPhiQL',
                    label: 'Tổng tiền GĐĐH duyệt',
                    type: 'number',
                    col: 6,
                    isDisabled: "{EXPR=PositionCode}!='CB-077'",
                }),
                new NumberBoxInput({
                    key: 'Amount_ChiPhi',
                    label: 'Tổng tiền kế toán duyệt',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                // new NumberBoxInput({
                //     key: 'TongDinhMuc',
                //     label: 'Đinh mức thanh toán tuần',
                //     type: 'number',
                //     col: 6,
                //     isDisabled: "{EXPR=PositionCode}!='CB-107' && {EXPR=PositionCode}!='CB-005'",
                //     isNewRow: true,
                  
                // }),
                new NumberBoxInput({
                    key: 'AmountLimit',
                    label: 'Thu chi lũy kế kế hoạch',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                   
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'ThuChiKyTruoc',
                    label: 'Thu chi thực tế kỳ trước',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                   
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'ThuChiKyNayBCH',
                    label: 'Thu chi kỳ này theo BCH',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                   
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'ThuChiKyNayKT',
                    label: 'Thu chi kỳ này theo Kế toán',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                   
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'NumberOfDays',
                    label: 'Số ngày thực hiện',
                    type: 'number',
                    dataType: 'n0',
                    isDisabled: 'true',
                    isNewRow: true,
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'DeptCode',
                    label: 'Bộ phận',
                    lookupKey: 'Dept',
                    isDisabled: 'true',
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'PositionCode',
                    label: 'Cấp bậc duyệt',
                    lookupKey: 'Position',
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCode',
                    label: 'Người duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCodeSend',
                    label: 'Người gửi duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 6
                }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'InformMethod',
                //     label: 'Kiểu thông báo',
                //     lookupKey: 'Class',
                //     lookupfilter: "ParentCode='InformMethod'",
                //     hideValueMember: false,
                //     isDisabled: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;',
                //     col: 6
                // }, this.srv, this.parentData),
                new RichTextBoxInput({
                    key: 'Comment',
                    label: 'Ý kiến',
                    col: 12
                }),
                new NumberBoxInput({
                    key: 'IdCCMBudget',
                    label: 'Số ngày thực hiện',
                    type: 'number',
                    dataType: 'n0',
                    visible: 'false',
                    isDisabled: 'true',
                    isNewRow: true,
                    col: 6
                }),
                // new ButtonInput({
                //     key: 'btnBaoCao',
                //     label: 'Báo cáo điều chỉnh kế hoạch ký kết',
                //     col: 6
                // }),
               
                
            ]
        })
    ];

    childColumns = [
        {
            header: 'Mã dự án',
            binding: 'ProductName0',
            width: 100
        },
        {
            header: 'Mã đối tượng',
            binding: 'CustomerCode',
            dataType: 'Array',
            lookupKey: 'Customer_CCM2',
            isReadOnly: 'true',
            bindingList: {
                Name: 'CustomerName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
            width: 100
        },
        {
            header: 'Tên đối tượng',
            binding: 'CustomerName',
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Thông tin hợp đồng',
            binding: 'DocInfo',
            width: 200,
            isReadOnly: 'true'
        },
       
        {
            header: 'Bill thanh toán',
            binding: 'BillNoInfo',
            width: 200,
            isReadOnly: 'true'
        },
        {
            header: 'Ngày đến hạn thanh toán',
            binding: 'EstimatedTimeDelivery',
            isRequired: true,
            width: 120,
            dataType: 'Date',
            isReadOnly: 'true',
            format: 'dd/MM/yyyy'
        },
       
        {
            header: 'Số tiền bill',
            binding: 'OpenPlanAmount',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Số tiền BCH đề xuất',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 150
        },
        {
            header: 'Số tiền kế toán duyệt',
            binding: 'PaymentAmount',
            dataType: 'Number',
            width: 150
        },   
        {
            header: 'WorkFlow đính kèm',
            binding: 'FilePath',
            width: 600,
            dataType: 'Object',
            allowRemove: false,
            allowView: true,
            allowDownLoad: true,
            allowUpload: false,
            folderId: '{EXPR=IdCCMBudgetLink}'
            //validators: "{EXPR=Description} != '' && {EXPR=Description} == 'Yêu cầu đính kèm' && {EXPR=FilePath}==0",
            //exprReadOnly: "{EXPR=Attached} == true && {EXPR=Description} != ''"
        },
        {
            header: 'Loại hợp đồng',
            binding: 'Description',
            
            width: 200,
            isReadOnly: 'true'
        } ,
        {
            header: 'Ghi chú',
            binding: 'Remark',
            
            width: 200
        } ,
        {
            header: 'Id Bill',
            binding: 'ParentBizDocId',
            width: 0,
            dataType: 'Array',
            lookupKey: 'BizDocCCM',
            bindingList: {
                DocNo: 'BillNoInfo',
            },
            // displayMember: 'DocInfo',
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
            // lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        },  
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50
        }, 
        {
            header: 'Id hợp đồng',
            binding: 'BizDocId_C1',
            width: 0,
            dataType: 'Array',
            lookupKey: 'BizDoc2',
            bindingList: {
                DocInfo: 'DocInfo',
            },
            // displayMember: 'DocInfo',
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
            // lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        },                                                                               
       
    ];

    childColumns1 = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
        },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 250
        },
        {
            header: 'Người thực hiện',
            binding: 'EmployeeName',
            width: 230
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
    ];

    childColumns2 = [
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
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Dept',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 0,
            isReadOnly: 'true'
        },
        // {
        //     header: 'Bộ phận',
        //     binding: 'DeptName',
        //     width: 300,
        //     isReadOnly: 'true'
        // },
        {
            header: 'Mã cấp bậc',
            binding: 'PositionCode',
            dataType: 'Array',
            lookupKey: 'Position',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 0,
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
            width: 100,
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId}' AND PositionCode = '{EXPR=PositionCode}')",
            validators: "{EXPR=EmployeeCode} == ''",
            validatorMessage: 'Không được bỏ trống giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên nhân viên',
            binding: 'EmployeeName',
            width: 150,
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
            dataType: 'Number',
            width: 100,
            isReadOnly: 'true'
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
        {
            header: 'Được trả hồ sơ',
            binding: 'ApproveReturn',
            width: 100,
            dataType: 'Boolean',
            isReadOnly: 'true'
        },
        // {
        //     header: 'Trả về cấp bậc',
        //     binding: 'PositionCodeReturn',
        //     width: 100,
        //     isReadOnly: 'true'
        // }
    ];

}