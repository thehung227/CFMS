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

// Phê duyệt kế hoạch ký kết chi phí công trường
export class LayoutApprovedPlanCostRevConsExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_CCMBudgetExplorer',
                FilterKey: "ApproveSend = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'K2' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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
            width: 100,
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

export class LayoutApprovedPlanCostRevConsEditor implements IEditorFormulaDeclaration {
    buttonLoadChild: string[];
    serverUpdated: string[];
    buttonCommand: string[];
    columnChanged: any;

    approveGrid = 1;

    constructor(private srv?: any,
        private parentData?: any) { }

    evaluators = {
        'Evaluator_ServerUpdating_UpdateStatusByApproveStatus': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,Id,ApproveStatus,{VAR=Branch.Ma_Dvcs},EmployeeCodeNext,DocCode,{VAR=User.Id},Comment,ApproveStatusWeb',
            Command: 'usp_Cotec_UpdateStatusByApproveStatus_SongSong'
        }

    }

    serverConstraint = [

    ]

    serverUpdating = [

    ]

    linkReporter = {
        'btnBaoCao': {
            directory: 'reporterplancostrevcons',
            type: 'view',
            key: 'REP01_CCM_TCCT',
            parameter: { 'Commandkey': 'REP01_CCM_TCCT', 'ProductCostId': '{EXPR=ProductCostId}', 'CCMBudgetId': '{EXPR=CCMBudgetId}', 'Ma_Dvcs': '{VAR=Branch.Ma_Dvcs}' }
        }
    }

    columnsReadOnly = [];

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_CCMBudgetEdit',
                IsView: 'view',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'K2',
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
                    IsView: 'view',
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
                    IsView: 'view',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        BizDocId: 'Parent.CCMBudgetId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                    }
                }                
            ]
        }
    }

    panels: PanelBase[] = [
        new TablePanel({
            label: 'Panel 1',
            col: 12,
            controls: [
                new DateBoxInput({
                    key: 'DocDate',
                    label: 'Ngày',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6,
                    isDisabled: 'true'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số kế hoạch',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    isDisabled: 'true'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Hạng mục',
                    type: 'text',
                    col: 12,
                    isDisabled: 'true'
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: 'ParentId=233',
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                // new NumberBoxInput({
                //     key: 'Amount_DoanhThu',
                //     label: 'Doanh thu',
                //     isDisabled: 'true',
                //     col: 6
                // }),
                new NumberBoxInput({
                    key: 'Amount_DoanhThu',
                    label: 'Doanh thu',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_ChiPhi',
                    label: 'Chi phí',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_LoiNhuan',
                    label: 'Lợi nhuận',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'TiSuat_LN',
                    label: 'Tỉ suất lợi nhuận B',
                    isDisabled: 'true',
                    format: 'P2',
                    col: 6
                }),
                 new NumberBoxInput({
                    key: 'TotalOriginalAmountC',
                    label: 'Doanh thu tài chính',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'TotalPaymentAmountC',
                    label: 'Chi phí tài chính',
                    isDisabled: 'true',
                    col: 6
                }),
                // new NumberBoxInput({
                //     key: 'HeSoQuanLy',
                //     label: 'Hệ số quản lý công ty (Dự kiến)',
                    
                //     format: 'P2',
                //     col: 6
                // }),
                // new NumberBoxInput({
                //     key: 'HeSoThueTNDN',
                //     label: 'Thuế TNDN (Dự kiến)',
                    
                //     format: 'P2',
                //     col: 6
                // }),
                // new NumberBoxInput({
                //     key: 'Amount_ChiPhiQL',
                //     label: 'Chi phí quản lý công ty',
                //     isDisabled: 'true',
                //     col: 6
                // }),
                // new NumberBoxInput({
                //     key: 'Amount_ThueTNDN',
                //     label: 'Thuế TNDN',
                //     isDisabled: 'true',
                //     col: 6
                // }),
                // new NumberBoxInput({
                //     key: 'Amount_LoiNhuanRong',
                //     label: 'Lãi ròng',
                //     isDisabled: 'true',
                //     col: 6
                // }),
                // new NumberBoxInput({
                //     key: 'TiSuatLNRong',
                //     label: 'Tỉ suất lợi nhuận C',
                //     isDisabled: 'true',
                //     format: 'P2',
                //     col: 6
                // }),
                new DateBoxInput({
                    key: 'FromDate1',
                    label: 'Tiến độ theo HĐ (Từ ngày)',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'ToDate1',
                    label: 'Tiến độ theo HĐ (Đến ngày)',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'FromDate',
                    label: 'Tiến độ BCH (Từ ngày)',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'ToDate',
                    label: 'Tiến độ BCH (Đến ngày)',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'NumberOfDays',
                    label: 'Số ngày thực hiện',
                    type: 'number',
                    dataType: 'n0',
                    col: 6,
                    isDisabled: 'true'
                }),
                new LookupBoxInput({
                    key: 'DeptCode',
                    label: 'Bộ phận',
                    lookupKey: 'Dept',
                    lookupFilter: '',
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'PositionCode',
                    label: 'Cấp bậc duyệt',
                    lookupKey: 'Position',
                    lookupFilter: '',
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCode',
                    label: 'Người duyệt',
                    lookupKey: 'Employee',
                    lookupFilter: '',
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
                //     col: 6
                // }, this.srv, this.parentData),
                new RichTextBoxInput({
                    key: 'Comment',
                    label: 'Ý kiến',
                    col: 12
                }),
                new ButtonInput({
                    key: 'btnBaoCao',
                    label: 'Dự trù công trường',
                    col: 6
                }),
                new UploadInput({
                    key: 'FilePath',
                    label: 'File BCTC đính kèm',
                    col: 6,
                    isOnlyDownload: true,
                    folderId: '{EXPR=IdCCMBudget}'
                }, this.srv)
            ]
        })
    ];

    childColumns = [
         {
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 100
        },
         {
            header: 'Gói thầu',
            binding: 'ItemGroupCode',
            dataType: 'Array',
            lookupKey: 'BidPackage',
            lookupfilter: "IsGroup=0 AND IsActive=1",
            width: 150,
            // isReadOnly: 'true'
        },
        {
            header: 'Mã XD/ME',
            binding: 'CodeMEXD',
            dataType: 'Array',
            lookupKey: 'KHC',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ClassCode1='01'",
            width: 150,
            // isReadOnly: 'true'
        },
        {
            header: 'Công việc',
            binding: 'JobCode',
            dataType: 'Array',
            lookupKey: 'Job_CCM',
            bindingList: {
                Name: 'JobName'
            },
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            multiSelection: true,
            width: 100
        },
        {
            header: 'Nội dung công việc',
            binding: 'JobName',
            width: 250
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
            width: 100
        },
        {
            header: 'Tên đối tượng',
            binding: 'CustomerName',
            width: 250,
        },
       
        {
            header: 'Dự trù CT & CCM (Trước VAT)',
            binding: 'OriginalAmount1',
            dataType: 'Number',
            width: 150
         
        },
       
        {
            header: 'Giá trị đã TH, Chưa làm bill, chưa xuất HĐ',
            binding: 'OpenPlanAmount',
            dataType: 'Number',
            width: 150,
           
            ignoreError: 1
        },
        {
            header: 'Id hợp đồng',
            binding: 'BizDocId_C1',
            width: 200,
            dataType: 'Array',
            lookupKey: 'BizDoc2',
            bindingList: {
                DocInfo: 'DocInfo',
                ContractType: 'ContractType'
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
            header: 'Loại hợp đồng',
            binding: 'ContractType',
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: 'Ghi chú',
            binding: 'Remark',
            width: 200
        },
       
        {
            header: 'Mã ưu tiên chi',
            binding: 'CodeKHC',
            dataType: 'Array',
            lookupKey: 'KHC',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ClassCode1='02'",
            width: 150,
            isReadOnly: 'true'
        },
        // {
        //     header: 'KT kiểm tra LNCT',
        //     binding: 'AmountLNCT_KT',
        //     dataType: 'Number',
        //     width: 150
        // },
        // {
        //     header: 'KT kiểm tra LNKT',
        //     binding: 'AmountLNKT_KT',
        //     dataType: 'Number',
        //     width: 150
        // },
        // {
        //     header: '% dự phòng phí',
        //     binding: 'CostPercent',
        //     dataType: 'Number',
        //     format: 'n3',
        //     width: 100
        // },
        {
            header: 'Giá trị đã TT',
            binding: 'AmountPaid',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 100
        },
        {
            header: 'Dự trù BCTC',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 0,
            isReadOnly: 'true',
            validators: "{EXPR=OriginalAmount} < {EXPR=AmountPaid} && {EXPR=AmountPaid} != 0",
            validatorMessage: 'Giá trị dự trù không được nhỏ hơn giá trị đã thực hiện',
            ignoreError: 1
        },
         {
            header: 'Giá trị bổ sung 1 (2)',
            binding: 'OriginalAmount2',
            dataType: 'Number',
            width: 0,
            isReadOnly: 'true',
         
        },
        {
            header: 'Giá trị bổ sung 2 (PKT) (3)',
            binding: 'OriginalAmount3',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 0
         
        },
        {
            header: 'Giá trị bổ sung 2 (PKT) (3)',
            binding: 'OriginalAmount4',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 0
         
        },
        {
            header: 'Giá trị bổ sung 2 (PKT) (3)',
            binding: 'OriginalAmount5',
            isReadOnly: 'true',
            dataType: 'Number',
            width: 0
         
        },
         {
            header: 'Giá trị bổ sung 2 (PKT) (3)',
            binding: 'OriginalAmountPlan3',
            isReadOnly: 'true',
            dataType: 'Number',
            width: 0
         
        },
         {
            header: 'Giá trị bổ sung 2 (PKT) (3)',
            binding: 'OriginalAmountPlus',
            isReadOnly: 'true',
            dataType: 'Number',
            width: 0
         
        },
         {
            header: 'Giá trị bổ sung 2 (PKT) (3)',
            binding: 'CostAmount',
            isReadOnly: 'true',
            dataType: 'Number',
            width: 0
         
        },
         {
            header: 'Giá trị bổ sung 2 (PKT) (3)',
            binding: 'NoSign',
            isReadOnly: 'true',
     
            width: 0
         
        },
        // {
        //     header: 'Dòng tiêu đề',
        //     binding: 'IsTitleRow',
        //     dataType: 'Boolean',
        //     width: 50
        // },
        // {
        //     header: 'Bậc',
        //     binding: 'Level',
        //     dataType: 'Number',
        //     width: 50,
        //     format: 'n0'
        // },
        // {
        //     header: 'Công thức',
        //     binding: 'Formula',
        //     width: 500
        // },
        // {
        //     header: 'Tự áp công thức',
        //     binding: 'ManualFormula',
        //     dataType: 'Boolean',
        //     width: 80
        // }
    ]

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

    childColumns2 = [
        {
            header: 'TT duyệt',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
            isReadOnly: 'true'
        },
        {
            header: 'Mã bộ phận',
            binding: 'DeptCode',
            isReadOnly: 'true',
            dataType: 'Array',
            lookupKey: 'Dept',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 0
        },
        {
            header: 'Bộ phận',
            binding: 'DeptName',
            width: 300,
            isReadOnly: 'true'
        },
        {
            header: 'Mã cấp bậc',
            binding: 'PositionCode',
            width: 0,
            isReadOnly: 'true',
            dataType: 'Array',
            lookupKey: 'Position',
            lookupfilter: 'IsGroup=0 AND IsActive=1'
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
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên nhân viên',
            binding: 'EmployeeName',
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Nhân viên duyệt được chỉ định',
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
            header: 'Được trả hồ sơ',
            binding: 'ApproveReturn',
            width: 100,
            dataType: 'Boolean',
            isReadOnly: 'true'
        },
        {
            header: 'Trả về cấp bậc',
            binding: 'PositionCodeReturn',
            width: 100,
            isReadOnly: 'true'
        }
    ]    
}