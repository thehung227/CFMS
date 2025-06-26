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

export class LayoutApprovedPlanClaimEditor implements IEditorFormulaDeclaration {

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
                Name: 'vB30BizDocApprove_AClaimEdit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'CL',
                    Stt: '',
                    CurrencyCode: 'VND',
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.Stt',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.ClaimDate',
                    }
                },
                {
                    Name: 'vB30ClaimDetail', //view ảo
                    ParentKey: 'BizDocId',
                    ChildKey: 'Stt',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    },
                    IgnoreSave: true
                },
                {
                    Name: 'vB30ClaimAppoveHistory', //view ảo
                    ParentKey: 'BizDocId',
                    ChildKey: 'Stt',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    },
                    IgnoreSave: true
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.Stt',
                        DocDate: 'Parent.ClaimDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30ClaimPayment_FromAccDocSales',
                    ParentKey: 'BizDocId',
                    ChildKey: 'Stt',
                    Sort: 'DocDate',
                    DefaultValues: {
                    },
                    IgnoreSave: true
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
                    key: 'ClaimDate',
                    label: 'Ngày cập nhật',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'ClaimNo',
                    label: 'Số claim/ IPC',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    // isReadOnly: 'true',
                    // style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Khối lượng tháng',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    // isReadOnly: 'true',
                    // style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu',
                    lookupKey: 'ProductCost',
                    binding: {
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'BizDocId_C2',
                    label: 'Hợp đồng',
                    lookupKey: 'BizDoc',
                    binding: {
                    },
                    lookupfilter: "(DocCode='C2')",
                    //lookupfilter: "DocCode='C2' AND (BranchCode='{VAR=Branch.Ma_Dvcs}') AND (ProductCostId='{EXPR=ProductCostId}' OR ISNULL('{EXPR=ProductCostId}','')='') AND Post_TheKho=1",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12
                }, this.srv, this.parentData),
        
                new NumberBoxInput({
                    key: 'OriginalWorkAmount',
                    label: 'KL thi công',
                    type: 'number',
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'IsTamUng',
                    label: 'Tạm ứng',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'TaxRate',
                    label: 'Thuế suất (%)',
                    type: 'number',
                    format: 'P2',
                    min: 0,
                    max: 1,
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'IsQT',
                    label: 'Quyết toán',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'OriginalWorkAmountInclueTax',
                    label: 'KL thi công (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new CheckBoxInput({
                    key: 'IsQT0',
                    label: 'Sau quyết toán',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'KeepPercent',
                    label: 'Tỉ lệ % giữ lại',
                    type: 'number',
                    format: 'P2',
                    min: 0,
                    max: 1,
                    col: 6,
                    isDisabled: "'{EXPR=IsTamUng}'=='true'"
                }),
                new CheckBoxInput({
                    key: 'IsTTLai',
                    label: 'Thanh toán lãi',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'OriginalKeepAmount',
                    label: 'Tiền giữ lại',
                    type: 'number',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'PaymentDateReal',
                    label: 'Ngày TT tiền giữ lại',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isDisabled: "'{EXPR=IsTamUng}'=='true'"
                }),
               
                new NumberBoxInput({
                    key: 'OriginalAdvanceAmount',
                    label: 'Hoàn trả tạm ứng',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isDisabled: "'{EXPR=IsTamUng}'=='true'"
                }),
                new DateBoxInput({
                    key: 'CreateDate',
                    label: 'Ngày Claim kế hoạch',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    
                    col: 6
                }),
              
                new NumberBoxInput({
                    key: 'OriginalDeductionAmount',
                    label: 'Khấu trừ khác (Phạt)',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isDisabled: "'{EXPR=IsTamUng}'=='true'"
                }),
                new DateBoxInput({
                    key: 'ApprovalDate',
                    label: 'Ngày duyệt kế hoạch',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    
                    col: 6,
                }),
                new NumberBoxInput({
                    key: 'CollectedAmount',
                    label: 'Khấu trừ khác (Thu hộ)',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isDisabled: "'{EXPR=IsTamUng}'=='true'"
                }),
                new DateBoxInput({
                    key: 'CreateDate1',
                    label: 'Ngày Claim thực tế',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    // validators: [Validators.required],
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'OriginalClaimAmount1',
                    label: 'Giá trị thanh toán kỳ này',
                    type: 'number',
                    col: 6,
                    isNewRow: true
                }),
                new DateBoxInput({
                    key: 'PaymentDate',
                    label: 'Ngày T. toán kế hoạch',                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    
                }),
                
                new NumberBoxInput({
                    key: 'OriginalClaimAmount2',
                    label: 'Giá trị thanh toán kỳ nợ',
                    type: 'number',
                    col: 6,
                    isNewRow: true
                }),
                new DateBoxInput({
                    key: 'PaymentDateKyNo',
                    label: 'Ngày TT kế hoạch nợ',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    // validators: [Validators.required],
                    isDisabled: 'true',
                    col: 6,
                }),
               
                new NumberBoxInput({
                    key: 'OriginalClaimAmount',
                    label: 'Tổng giá trị thanh toán kỳ này',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6,
                    isNewRow: true
                }),
                new DateBoxInput({
                    key: 'ApprovalDate1',
                    label: 'Ngày duyệt thực tế',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    // validators: [Validators.required],
                    isDisabled: 'true',
                    col: 6,
                }),
                new NumberBoxInput({
                    key: 'WarrantyValue',
                    label: 'Giá trị bảo lãnh, bảo hành',
                    type: 'number',
                    col: 6,
                    isDisabled: "'{EXPR=IsTamUng}'=='true'"
                }),
                
                // new NumberBoxInput({
                //     key: 'AmountThucHien',
                //     label: 'Giá trị thực hiện (K)',
                //     type: 'number',
                //     col: 6,
                //     isNewRow: true,
                //     isDisabled: "'{EXPR=IsTamUng}'=='true'"
                // }),                
                // new NumberBoxInput({
                //     key: 'JKVAT',
                //     label: 'Thuế VAT (K * %)',
                //     type: 'number',
                //     col: 6,
                //     isNewRow: true,
                //     isDisabled: 'true'
                // }), 
                // new NumberBoxInput({
                //     key: 'AmountThucHienVAT',
                //     label: 'Giá trị thực hiện (gồm VAT)',
                //     type: 'number',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
               
                new CheckBoxInput({
                    key: 'IsBaoLanh',
                    label: 'Bảo lãnh bảo hành',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'KLThiCongBCH',
                    label: 'KL đã TC (gồm KL chưa trình/chưa duyệt) - trước VAT',
                    type: 'number',
                    labelCol: 6,
                     style: 'background-color:#ffffaa;border-radius:8px;',
                    validators: [Validators.required],
                    col: 6
                }),
                new DateBoxInput({
                    key: 'EndWarranty',
                    label: 'Ngày hết bảo hành',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isDisabled: "'{EXPR=IsTamUng}'=='true'"
                }),
                // new NumberBoxInput({
                //     key: 'AmountTongTTDenKyNay',
                //     label: 'Tổng T. toán đến kỳ này',
                //     type: 'number',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                // new NumberBoxInput({
                //     key: 'AmountTongTTDenKyTruoc',
                //     label: 'Tổng T. toán đến kỳ trước',
                //     type: 'number',
                //     col: 6,
                //     isDisabled: "'{EXPR=IsTamUng}'=='true'"
                // }),
               
              
                new TextBoxInput({
                    key: 'RemarkBCH',
                    label: 'Ghi chú ngày dự kiến hoàn thành duyệt Claim',
                    type: 'text',
                    labelCol: 6,
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    col: 12
                }),
                new TextBoxInput({
                    key: 'Remark',
                    labelCol: 6,
                    label: 'Ghi chú ngày dự kiến thanh toán cho kế toán',
                    type: 'text',
                    isDisabled: "'{EXPR=ApproveSend}' == 'true'",
                    col: 12
                }),
              
               
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive=1 AND ParentId=85",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),                
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
                // new ButtonInput({
                //     key: 'btnBaoCao',
                //     label: 'Báo cáo điều chỉnh kế hoạch ký kết',
                //     col: 6
                // }),
                new UploadInput({
                    key: 'FilePath',
                    label: 'File đính kèm',
                    col: 6,
                    isOnlyDownload: true,
                    folderId: '{EXPR=IdClaim}'
                }, this.srv)
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
            width: 500,
            dataType: 'Object',
            folderId: '{EXPR=IdClaim}'
            // //validators: "{EXPR=Description} != '' && {EXPR=Description} == 'Yêu cầu đính kèm' && {EXPR=FilePath}==0",
            // validators: "{EXPR=Attached} == true && {EXPR=Description} != 'Theo mẫu công ty ban hành' && {EXPR=FilePath}==0",
            // validatorMessage: 'Yêu cầu đính kèm tài liệu',
            // ignoreError: 1
            // //exprReadOnly: "{EXPR=Attached} == true && {EXPR=Description} != ''"
        }
    ];
    childColumns1 = [
       
        {
            header: 'Nội dung',
            binding: 'ClassCode1',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='CLAIM'",
            width: 150,
        },
        
        {
            header: 'Số tiền',
            binding: 'OriginalAmount',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: 'Ghi chú',
            binding: 'Description',
            width: 300
        }
    ];
    childColumns2 = [
        {
            header: 'Ghi chú',
            binding: 'Description',
            width: 250
        },
        {
            header: 'Số ngày theo HĐ',
            binding: 'DueDate',
            dataType: 'Number',
            width: 100
        },
        {
            header: 'Ngày duyệt (Theo HĐ)',
            binding: 'PlanDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            width: 150
        },
        {
            header: 'Ngày thực tế',
            binding: 'ActualDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            width: 150
        }
    ];
    childColumns3 = [
        {
            header: 'Ngày hóa đơn',
            binding: 'DocDate',
            isRequired: true,
            width: 120,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Số hóa đơn',
            binding: 'DocNo',
            isRequired: true,
            width: 120
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            width: 300
        },
        {
            header: 'Tiền',
            binding: 'OriginalAmount2',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: 'Tiền thuế',
            binding: 'OriginalAmount3',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: 'Tổng tiền',
            binding: 'OriginalAmount',
            dataType: 'Number',
            isRequired: true,
            width: 150
        }
    ];

   

   

  

    childColumns4 = [
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

    
}