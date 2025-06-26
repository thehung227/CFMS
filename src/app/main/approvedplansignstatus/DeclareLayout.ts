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

// *********************************PHÊ DUYỆT

// phê duyệt ký kêt hợp đồng
export class LayoutApprovedPlanSignStatusExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_CCMBudgetExplorer',
                FilterKey: "ApproveSend = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'K1' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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

export class LayoutApprovedPlanSignStatusEditor implements IEditorFormulaDeclaration {

    buttonLoadChild: string[];
    serverUpdated: string[];
    buttonCommand: string[];
    constructor(private srv?: any,
        private parentData?: any) { }

    evaluators = {
        'Evaluator_ServerUpdating_UpdateStatusByApproveStatus': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Stt,Id,{VAR=User.Id}',
            Command: 'usp_PlanSign_UpdateStatusByApproveStatus'
        }
    };

    approveGrid = 1;

    serverConstraint = [
    ]

    serverUpdating = [

    ]

    columnChanged = {

    };

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
                Name: 'vB30BizDocApprove_PlanSignEdit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'K1',
                    CCMBudgetId: '',
                    CurrencyCode: 'VND',
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB20PlanSignDetail',
                    ParentKey: 'BizDocId',
                    ChildKey: 'Stt',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        CCMBudgetId: '',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    }
                },
                {
                    Name: 'vB20PlanSignDetail1',
                    ParentKey: 'BizDocId',
                    ChildKey: 'Stt',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: '',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    }
                },
               
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
                    WordName: "1.Ke_Hoach_Ky_Ket_Hop_Dong_Ver1.docx",
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
                    key: 'DocDate',
                    label: 'Ngày lập',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6
                }),
               
                // new LookupBoxInput({
                //     key: 'TypeXDME',
                //     label: 'Loại hình',
                //     lookupKey: 'Class',
          
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='INCURRED' AND Code IN ('XD','ME')",
                //     hideValueMember: false,
                //     validators: [Validators.required],
                //     col: 6
                // }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    //lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 6
                }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'EmployeeCode',
                //     label: 'PTDA XD',
                //     lookupKey: 'Employee',
                //     lookupfilter: "IsActive=1 AND IsGroup=0",
                //     validators: [Validators.required],
                //     hideValueMember: true,
                //     isReadOnly: 'true',
                //     col: 6
                // }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'EmployeeCode1',
                //     label: 'PTDA ME',
                //     lookupKey: 'Employee',
                //     lookupfilter: "IsActive=1 AND IsGroup=0",
                //     validators: [Validators.required],
                //     hideValueMember: true,
                //     isReadOnly: 'true',
                //     col: 6
                // }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Ghi chú',
                    type: 'text',
                    isNewRow: true,
                    col: 12
                }),
                // new NumberBoxInput({
                //     key: 'ApproveGroup',
                //     label: 'STT duyệt',
                //     type: 'number',
                //     dataType: 'n0',
                //     isDisabled: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;',
                //     col: 6
                // }),
                new NumberBoxInput({
                    key: 'NumberOfDays',
                    label: 'Số ngày thực hiện',
                    type: 'number',
                    dataType: 'n0',
                    isDisabled: 'true',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'DeptCode',
                    label: 'Bộ phận',
                    lookupKey: 'Dept',
                    hideValueMember: false,
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
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: 'Thời gian dự kiến ký kết',
            binding: 'EstimatedTimeDelivery',
            isRequired: false,
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isReadOnly: 'true'
        },
        {
            header: 'Thời gian thi công',
            binding: 'EstimatedQuotationDate',
            width: 106,
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false,
            isReadOnly: 'true'
        },
        {
            header: 'Mã XD/ME',
            binding: 'CodeMEXD',
            dataType: 'Array',
            lookupKey: 'KHC',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ClassCode1='01'",
            width: 150,
            isReadOnly: 'true'
        },
       
        {
            header: 'Công tác',
            binding: 'JobName',
            isRequired: true,
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Nhóm đối tượng',
            binding: 'Loai_Dt',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "ParentCode='Loai_Dt_CCM'",
            width: 100,
            isReadOnly: 'true'
        },
       
        {
            header: 'Tên NTP/NCC',
            binding: 'CustomerName',
            width: 300,
            isReadOnly: 'true'
        },
        {
            header: 'Người đàm phán cuối cùng',
            binding: 'PartNo',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'JobPositionCCM',
            lookupfilter: "IsGroup=0 AND Code IN ('GDDH','GDDA')",
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: 'Chức vụ ký HĐ',
            binding: 'Chuc_Vu',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'JobPositionCCM',
            lookupfilter: 'IsGroup=0',
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: 'Giá trị ký kết dự kiến (chưa VAT)',
            binding: 'OriginalAmount',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Không ký',
            binding: 'ItemGroupCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "ParentCode='KHKK' AND Code IN ('K')",
            width: 100
        },
        // {
        //     header: 'Trách nhiệm',
        //     binding: 'BudgetTypeCode',
        //     dataType: 'Array',
        //     lookupKey: 'Class',
        //     isRequired: true,
        //     lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode = 'BudgetType'",
        //     width: 150
        // },
        {
            header: 'Nguyễn nhân trễ',
            binding: 'Reason',
            width: 250
        },
    ]

    childColumns1 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: 'Thời gian dự kiến ký kết',
            binding: 'EstimatedTimeDelivery',
            isRequired: false,
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isReadOnly: 'true'
        },
        {
            header: 'Thời gian thi công',
            binding: 'EstimatedQuotationDate',
            width: 106,
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false	,
            isReadOnly: 'true'
        },
        {
            header: 'Mã XD/ME',
            binding: 'CodeMEXD',
            dataType: 'Array',
            lookupKey: 'KHC',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ClassCode1='01'",
            width: 150,
            isReadOnly: 'true'
            // isReadOnly: 'true'
        },
       
        {
            header: 'Công tác',
            binding: 'JobName',
            isRequired: true,
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Nhóm đối tượng',
            binding: 'Loai_Dt',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "ParentCode='Loai_Dt_CCM'",
            width: 100,
            isReadOnly: 'true'
        },
        
        {
            header: 'Tên NTP/NCC',
            binding: 'CustomerName',
            width: 300,
            isReadOnly: 'true'
        },
        {
            header: 'Người đàm phán cuối cùng',
            binding: 'PartNo',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'JobPositionCCM',
            lookupfilter: "IsGroup=0 AND Code IN ('GDDH','GDDA')",
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: 'Chức vụ ký HĐ',
            binding: 'Chuc_Vu',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'JobPositionCCM',
            lookupfilter: 'IsGroup=0',
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: 'Giá trị ký kết dự kiến (chưa VAT)',
            binding: 'OriginalAmount',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Không ký',
            binding: 'ItemGroupCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "ParentCode='KHKK' AND Code IN ('K')",
            width: 100
        },
        // {
        //     header: 'Trách nhiệm',
        //     binding: 'BudgetTypeCode',
        //     dataType: 'Array',
        //     lookupKey: 'Class',
        //     isRequired: true,
        //     lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode = 'BudgetType'",
        //     width: 150
        // },
        {
            header: 'Nguyễn nhân trễ',
            binding: 'Reason',
            width: 250
        },
    ]
}
