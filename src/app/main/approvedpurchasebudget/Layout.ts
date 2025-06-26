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


export class LayoutApprovedPurchaseBudgetExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_BudgetExplorer',
                FilterKey: "ApproveSend = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'K4' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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

export class LayoutApprovedPurchaseBudgetEditor implements IEditorFormulaDeclaration {

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
    }

    columnsReadOnly = [];

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_BudgetEdit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'H2',
                    Stt: '',
                    CurrencyCode: 'VND',
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB30BudgetDetail_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'Stt',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        Stt: '',
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
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Bảng tổng hợp Kế hoạch đặt hàng',
            Command: 'usp_CCM_Budget_TongHop',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng tổng hợp",
                    FileName: "Bảng tổng hợp kế hoạch đặt hàng",
                    WordName: "CCM_TongHopDonThep.docx",
                    // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
            ]
   
    }
    };

    panels: PanelBase[] = [
        new TablePanel({
            label: 'Panel 1',
            col: 12,
            controls: [
                new DateBoxInput({
                    key: 'BudgetDate',
                    label: 'Ngày',
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
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 6
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
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: '',
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'TotalQuantity',
                    label: 'Tổng khối lượng',
                    type: 'number',
                    dataType: 'n0',
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'TotalOriginalAmount',
                    label: 'Tổng giá trị',
                    type: 'number',
                    dataType: 'n0',
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                    col: 6
                }),
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
                new RichTextBoxInput({
                    key: 'Comment',
                    label: 'Ý kiến',
                    col: 12
                }),
                new LookupBoxInput({
                    key: 'EmployeeCodeSend',
                    label: 'Người gửi duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'File đính kèm',
                //     col: 6,
                //     isOnlyDownload: true,
                //     folderId: '{EXPR=IdBudget}'
                // }, this.srv)
            ]
        })
    ];

    childColumns = [
        {
            header: 'Tháng',
            binding: 'FromDate',
            // isRequired: true,
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },                
        {
            header: 'Mã nhóm hàng',
            binding: 'ItemGroupCode',
            width: 150,
            dataType: 'Array',
            lookupKey: 'Item',
            lookupfilter: "",
            validators: "{EXPR=ItemGroupCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Mã hàng',
            binding: 'ItemCode',
            width: 200,
            dataType: 'Array',
            lookupKey: 'Item',
            bindingList: {
                Name: 'ItemName',
                Unit: 'Unit'
            },
            lookupfilter: "ParentId IN (SELECT Id FROM B20Item WHERE Code = '{EXPR=ItemGroupCode}') AND IsActive=1 AND IsGroup=0 AND BranchCode = '{VAR=Branch.Ma_Dvcs}'",
            validators: "{EXPR=ItemCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên mặt hàng',
            binding: 'ItemName',
            dataType: 'String',
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            dataType: 'String',
            width: 80,
            isReadOnly: 'true'
        },
        {
            header: 'Mã thương hiệu',
            binding: 'TradeMarkCode',
            width: 300,
            dataType: 'Array',
            lookupKey: 'TradeMark',
            multiSelection: true,
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ItemGroupCode = '{EXPR=ItemGroupCode}'",
            validators: "{EXPR=TradeMarkCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Hạn mức khối lượng',
            binding: 'Quantity',
            dataType: 'Number',
            width: 150
        },
        {
            header: 'Đơn giá',
            binding: 'OriginalPrice',
            dataType: 'Number',
            width: 120
        },
        {
            header: 'Thành tiền',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 150
        },
        {
            header: 'Khối lượng lũy kế (đơn hàng đã đặt)',
            binding: 'QuantityAccum',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Mã đối tượng',
            binding: 'CustomerCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Customer_CCM2',
            bindingList: {
                NameBinding: 'CustomerName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND CompletedApprove=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
            width: 120
        },
        {
            header: 'Tên đối tượng',
            binding: 'CustomerName',
            dataType: 'String',
            width: 350,
            isReadOnly: 'true'
        },               
        // {
        //     header: 'Hạn mức giá trị mua hàng',
        //     binding: 'OriginalAmount',
        //     dataType: 'Number',
        //     width: 120
        // },
        // {
        //     header: 'Từ ngày',
        //     binding: 'FromDate',
        //     isRequired: true,
        //     width: 120,
        //     dataType: 'Date',
        //     format: 'dd/MM/yyyy'
        // },
        // {
        //     header: 'Đến ngày',
        //     binding: 'ToDate',
        //     isRequired: true,
        //     width: 120,
        //     dataType: 'Date',
        //     format: 'dd/MM/yyyy'
        // }
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
    ];
}