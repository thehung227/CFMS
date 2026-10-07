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


//Kế hoạch mua hàng dự án
export class LayoutPurchaseOtherBudgetExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30Budget',
                FilterKey: "TypeXDME = 'XD' AND (ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode='H7' AND BudgetTypeCode = '6' AND IsActive=1",// AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'BudgetDate DESC, DocNo DESC',
                RowPage: 50
            },
            Child: {
                Name: 'vB30BizDocApprove_BudgetExplorer',
                ParentKey: 'Stt',
                ChildKey: 'BizDocId',
                OrderBy: 'ApproveGroup'
            }
        },
        PrintDocument: {
            Key: 'CCMBudgetViewer',
            Text: 'Kế hoạch ký kết hợp đồng - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30CCMBudget_VoucherForm',
            LayoutPrint: [
                // {
                //     Layout: "MAU1",
                //     Name: "Kế hoạch ký kết hợp đồng",
                //     FileName: "Kế hoạch ký kết hợp đồng - {EXPR=ProductName} - {EXPR=DocNo}",
                //     WordName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                //     // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
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
        // {
        //     header: 'Gói thầu',
        //     binding: 'ProductName',
        //     width: 400
        // },
        {
            header: 'Số kế hoạch',
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
            width: 120,
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
            width: 130,
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
        }
    ]
}

export class LayoutPurchaseOtherBudgetEditor implements IEditorFormulaDeclaration {
    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) {
    }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30Budget',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    BudgetTypeCode: '6',
                    BudgetStyleCode: '1',
                    CurrencyCode: 'VND',
                    DocCode: 'H7',
                    TypeXDME: 'XD',
                    Id: -1,
                    IsWebData: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    BudgetDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB30BudgetDetail_Edit',
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    }
                },
                {
                    Name: 'vB30BizDocApprove_EditBudget',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    }
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.Stt',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.BudgetDate',
                    }
                },
            ]
        },
        PrintDocument: {
            Key: 'BizDocViewer',
            Text: 'Mẫu in đơn hàng mua',
            Command: 'usp_B30Budget_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Kế hoạch mua hàng dự án",
                    FileName: "Kế hoạch mua hàng - {EXPR=DocNo}",
                    ExcelName: "CCM_KeHoachVLXD.xlsx",
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
        // server constraint
        'Evaluator_ServerConstraint_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,DocCode,Stt,DocDate,TypeXDME',
            Command: 'ufn_B30Budget_DefaultDocNo_VLXD',
            zExpr: "ProductCostId != ''",
            DataMember: 'DocNo'
        },
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'Stt,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Conteccons_NotChangeWhenApproveSent',
             zExpr: 'ApproveSend == true && CompletedApprove == false',
            MessageText: 'Không được thay đổi khi đã gửi duyệt',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,{VAR=EmptyField_ParentBizDocId}',
            Command: 'usp_B30BizDocApprove_GetData',
            OutputTable: 1
        },
        'Evaluator_ServerConstraint_Detail_LoadPrevious': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId,DocCode,Stt,{VAR=Branch.Ma_Dvcs},TypeXDME',
            Command: 'usp_Newtecons_B30CCMBudget_LoadPrevious',
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_Attach_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId',
            Command: 'usp_PurchaseOtherBudget_LoadAttach',
            OutputTable: 3
        },
        'Evaluator_ServerConstraint_Check_KhongLapMoiKhiChuaDuyetCu': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,DocCode,{VAR=Branch.Ma_Dvcs},TypeXDME,Id',
            Command: 'ufn_Coteccons_B30Budget_KhongLapMoiKhiChuaDuyetCu_VLXD',
            zExpr: "ProductCostId != '' && CompletedApprove == false",
            MessageText: 'Không thể lập mới khi chưa hoàn thiện duyệt hồ sơ trước',
            IgnoreError: 0
        },
        'Evaluator_B30BudgetDetail_OriginalAmount': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount",
            Value: "Math.round(Quantity*OriginalPrice)",
            Tables: 0
        },
        'Evaluator_B30BudgetDetail_OriginalAmountBD': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmountBD",
            Value: "Math.round(QuantityBOQ*UnitCostBD)",
            Tables: 0
        },
        'Evaluator_B30BudgetDetail_Amount3': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount3",
            Value: "Math.round(OriginalAmount*TaxRate)",
            Tables: 0
        },
        'Evaluator_B30BudgetDetail_ConcerlossQuantity': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "ConcerlossQuantity",
            Value: "Quantity*(1+ConcerlossRate)",
            Tables: 0
        },
        // server updated
    
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},{VAR=EmptyField_BizDocId},{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode,Stt',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true && CompletedApprove == false' 
        },
        'Evaluator_ServerUpdated_BudgetDetail_UpdateFromParent': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Stt',
            Command: 'usp_Coteccons_B30BudgetDetail_UpdateFromParent'
        },
        'Evaluator_ServerUpdated_BuiltinOrder': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Stt,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Newtecons_B30Budget_SetBuiltionOrder'
        },
        'Evaluator_ServerUpdated_CreateFormula': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Stt',
            Command: 'usp_Newtecons_CreateFormular_CCMBudgetDetail_B30Budget'
        },
    };

    serverConstraint = [
        'Evaluator_ServerConstraint_DefaultDocNo'
    ];

    serverUpdating = [
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_KhongLapMoiKhiChuaDuyetCu'
    ]

    serverUpdated = [
        'Evaluator_ServerUpdated_BuiltinOrder',
      
        'Evaluator_ServerUpdated_BudgetDetail_UpdateFromParent',
          'Evaluator_ServerUpdated_CreateFormula',
        'Evaluator_UpdateInfo_WhenApproveSend'
        
    ];

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_Approve_GetData',
        'Evaluator_ServerConstraint_Attach_GetData',
        'Evaluator_ServerConstraint_Detail_LoadPrevious'
    ];

    buttonCommand: string[] = [

    ];

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
                QuantityBOQ: {
                    Evaluators: [
                        'Evaluator_B30BudgetDetail_OriginalAmountBD'
                    ]
                },
                UnitCostBD: {
                    Evaluators: [
                        'Evaluator_B30BudgetDetail_OriginalAmountBD'
                    ]
                },
                Quantity: {
                    Evaluators: [
                        'Evaluator_B30BudgetDetail_OriginalAmount',
                        'Evaluator_B30BudgetDetail_ConcerlossQuantity'
                    ]
                },
                 ConcerlossRate: {
                    Evaluators: [
                       
                        'Evaluator_B30BudgetDetail_ConcerlossQuantity'
                    ]
                },
                OriginalPrice: {
                    Evaluators: [
                        'Evaluator_B30BudgetDetail_OriginalAmount'
                    ]
                },
                TaxCode: {
                    Evaluators: [
                        'Evaluator_B30BudgetDetail_Amount3'
                    ]
                },
                TaxRate: {
                    Evaluators: [
                        'Evaluator_B30BudgetDetail_Amount3'
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
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND RowId = '{VAR=Filter.ProductCostId}'",
                    //lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'TypeXDME',
                    label: 'Loại hình',
                    lookupKey: 'Class',
                    isReadOnly: 'true',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='INCURRED' AND Code IN ('XD','ME')",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 6
                }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'BudgetCode',
                //     label: 'Nhóm hàng',
                //     lookupKey: 'Class',
                //     lookupfilter: "ParentCode='NHOMOTHER'",
                //     hideValueMember: true,
                //     col: 6
                    
                // }, this.srv, this.parentData),
                // new DateBoxInput({
                //     key: 'Date1',
                //     label: 'Thời gian sử dụng từ',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     validators: [Validators.required],
                //     col: 6
                // }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive=1 AND Ma_Ct = '{EXPR=DocCode}'",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
             
               
                new NumberBoxInput({
                    key: 'TotalAmount',
                    label: 'Tổng tiền BĐ (Chưa VAT)',
                    type: "Number",
                    format: "n0",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
              
                new NumberBoxInput({
                    key: 'BudgetAmount',
                    label: 'Tổng tiền NCC (Chưa VAT)',
                    type: "Number",
                    format: "n0",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
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
                }),
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'Đính kèm',
                //     col: 6
                // }, this.srv),
            ]
        })
    ];

    childColumns = [
        {
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 100,
            exprReadOnly: "{EXPR=IsPO} == true",
        },
        {
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            width:100,
            isRequired: false,	
            header: 'Ngày dự kiến sử dụng',
            binding: 'FromDate',
            exprReadOnly: "{EXPR=IsPO} == true",
            validators: "{EXPR=IsTitleRow} == 0 && {EXPR=FromDate} == 0",
            validatorMessage: 'Bắt buộc nhập Ngày dự kiến sử dụng',
            ignoreError: 1
        },
        {
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            width: 100,
            isRequired: false,
            header: 'Ngày dự kiến kết thúc sử dụng',
            binding: 'ToDate',
            exprReadOnly: "{EXPR=IsPO} == true",
            validators: "{EXPR=IsTitleRow} == 0 && {EXPR=ToDate} == 0",
            validatorMessage: 'Bắt buộc nhập Ngày dự kiến kết thúc sử dụng',
            ignoreError: 1
        },
        {
            header: 'Mã gói thầu',
            binding: 'ItemGroupCode',
            width: 150,
            dataType: 'Array',
            lookupKey: 'BidPackage',
             bindingList: {
                Name: 'BidPackageName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1",
            validators: "{EXPR=ItemGroupCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1,
            exprReadOnly: "{EXPR=IsPO} == true",
        },
        {
            header: 'Tên gói thầu',
            binding: 'BidPackageName',
            dataType: 'String',
            width: 200,
            isReadOnly: 'true'
            // isReadOnly: 'true'
        },
        {
            header: 'Mã hàng (Mã TVG)',
            binding: 'ItemCode',
            width: 200,
            dataType: 'Array',
            lookupKey: 'PriceLibrary',
            bindingList: {
                Name: 'ItemName',
                Unit: 'Unit'
            },
            lookupfilter: "IsActive=1", //ParentId IN (SELECT Id FROM B20Item WHERE Code = '{EXPR=ItemGroupCode}') AND
            validators: "{EXPR=ItemCode} == '' && {EXPR=IsTitleRow} == 'false'",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1,
            exprReadOnly: "{EXPR=IsPO} == true",
        },
        {
            header: 'Tên mặt hàng (Theo Mã TVG)',
            binding: 'ItemName',
            dataType: 'String',
            width: 200,
            exprReadOnly: "{EXPR=IsPO} == true",
            // isReadOnly: 'true'
        },
        {
            header: 'Tên mặt hàng (Theo Hợp Đồng NCC)',
            binding: 'OriginName',
            dataType: 'String',
            width: 200,
            exprReadOnly: "{EXPR=IsPO} == true",
            // isReadOnly: 'true'
        },
        {
            header: 'Danh mục vật tư',
            binding: 'TradeMarkList',
            width: 200,
            dataType: 'Array',
            lookupKey: 'TradeMark',
            multiSelection: true,
            lookupfilter: "IsGroup=0 AND IsActive=1",
            exprReadOnly: "{EXPR=IsPO} == true",
            // validators: "{EXPR=TradeMarkCode} == ''",
            // validatorMessage: 'Không được bỏ trắng giá trị',
            // ignoreError: 1
        },
        {
            header: 'Hạng mục sử dụng',
            binding: 'CategoryName',
            dataType: 'String',
            width: 150,
            exprReadOnly: "{EXPR=IsPO} == true",
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            dataType: 'Array',
            lookupfilter: "IsActive=1 AND ParentCode = 'DmDvt'",
            lookupKey: 'Class',
            width: 80,
            exprReadOnly: "{EXPR=IsPO} == true",
        },
        {
            header: 'Khối lượng BoQ',
            binding: 'QuantityBOQ',
            dataType: 'Number',
            width: 150,
             format: 'n2'
        },
        {
            header: 'Đơn giá BĐ',
            binding: 'UnitCostBD',
            dataType: 'Number',
            width: 120,
            exprReadOnly: "{EXPR=IsPO} == true",
        },
        {
            header: 'Thành tiền BĐ',
            binding: 'OriginalAmountBD',
            dataType: 'Number',
            width: 150,
            exprReadOnly: "{EXPR=IsPO} == true",
        },
        {
            header: 'Mã sản phẩm được duyệt',
            binding: 'ProductName',
            dataType: 'String',
            width: 150,
            exprReadOnly: "{EXPR=IsPO} == true",
        },
        {
            header: 'Thương hiệu được duyệt',
            binding: 'TradeMarkCode',
            width: 200,
            dataType: 'Array',
            lookupKey: 'TradeMark',
            // multiSelection: true,
            lookupfilter: "IsGroup=0 AND IsActive=1",
            exprReadOnly: "{EXPR=IsPO} == true",
            // validators: "{EXPR=TradeMarkCode} == ''",
            // validatorMessage: 'Không được bỏ trắng giá trị',
            // ignoreError: 1
        },
        {
            header: 'Xuất xứ',
            binding: 'XuatXu',
            dataType: 'Array',
            bindingList: {
                Name: 'TenXuatXu',
                
            },
            lookupKey: 'Class',
            lookupfilter: "ParentCode = 'QUOCGIA'",
            width: 100,
            exprReadOnly: "{EXPR=IsPO} == true",
        },
        {
            header: 'Tên xuất xứ',
            binding: 'TenXuatXu',
            dataType: 'String',
            width: 120,
            isReadOnly: 'true'
        },
       
        {
            header: 'Khối lượng (Tính toán)',
            binding: 'Quantity',
            dataType: 'Number',
            width: 150,
             format: 'n2'
        },
         {
            header: '% hao hụt cho phép',
            binding: 'ConcerlossRate',
            dataType: 'Number',
            width: 150,
             format: 'p2'
        },
         {
            header: 'Khối lượng kế hoạch (gồm Hao hụt)',
            binding: 'ConcerlossQuantity',
            dataType: 'Number',
            width: 150,
             format: 'n2',
            isReadOnly: 'true'
        },
        // {
        //     header: 'Đơn giá NCC',
        //     binding: 'OriginalPrice',
        //     dataType: 'Number',
        //     width: 120,
        //     exprReadOnly: "{EXPR=IsPO} == true",
        // },
        // {
        //     header: 'Thành tiền NCC',
        //     binding: 'OriginalAmount',
        //     dataType: 'Number',
        //     width: 150,
        //     exprReadOnly: "{EXPR=IsPO} == true",
        // },
        // {
        //     header: 'Loại thuế',
        //     binding: 'TaxCode',
        //     isRequired: true,
        //     dataType: 'Array',
        //     lookupKey: 'Tax',
        //     bindingList: {
        //         Rate: 'TaxRate'
        //     },
        //     lookupfilter: "IsGroup=0 AND IsActive=1 AND Type = '1'",
        //     width: 90
        // },
        // {
        //     header: '% VAT',
        //     binding: 'TaxRate',
        //     dataType: 'Number',
        //     format: 'P2',
        //     width: 90
        // },
        // {
        //     header: 'Tiền VAT',
        //     binding: 'Amount3',
        //     dataType: 'Number',
        //     width: 150
        // },
        {
            header: 'Khối lượng lũy kế (đơn hàng đã đặt)',
            binding: 'QuantityAccum',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },
       
        {
            header: 'Ghi chú',
            binding: 'Remark',
            dataType: 'String',
            width: 350
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 60,
            isReadOnly: 'true'
        },
        {
            header: 'Link',
            binding: 'IsLink',
            dataType: 'Boolean',
            width: 60,
            isReadOnly: 'true'
        },
        {
            header: 'Dòng kế thừa',
            binding: 'RowIdInherist',
            dataType: 'String',
            width: 0
        },
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
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Dept',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 0,
            isReadOnly: 'true'
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
        // {
        //     header: 'Số ngày xử lý',
        //     binding: 'NumberOfDays',
        //     dataType: 'Number',
        //     width: 100,
        //     isReadOnly: 'true'
        // },
        // {
        //     header: 'Được trả hồ sơ',
        //     binding: 'ApproveReturn',
        //     width: 100,
        //     dataType: 'Boolean',
        //     isReadOnly: 'true'
        // },
        // {
        //     header: 'Trả về cấp bậc',
        //     binding: 'PositionCodeReturn',
        //     width: 100,
        //     isReadOnly: 'true'
        // }
    ];

    childColumns2 = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center'
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
    ];

    childColumns3 = [
        {
            header: 'Diễn giải',
            binding: 'Description',
            width: 250
        },
        {
            header: 'Yêu cầu đính kèm',
            binding: 'Attached',
            dataType: 'Boolean',
            width: 60,
            isReadOnly: 'true'
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 600,
            dataType: 'Object',
            //validators: "{EXPR=Description} != '' && {EXPR=Description} == 'Yêu cầu đính kèm' && {EXPR=FilePath}==0",
            validators: "{EXPR=Attached} == true && {EXPR=Description} != 'Theo mẫu công ty ban hành' && {EXPR=FilePath}==0",
            validatorMessage: 'Yêu cầu đính kèm tài liệu',
            ignoreError: 1
            //exprReadOnly: "{EXPR=Attached} == true && {EXPR=Description} != ''"
        }
    ]

}
