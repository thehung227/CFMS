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

export class LayoutApprovedSettlementClaimEditor implements IEditorFormulaDeclaration {

    buttonLoadChild: string[];
    serverUpdated: string[];
    buttonCommand: string[];
    constructor(private srv?: any,
        private parentData?: any) { }

    evaluators = {
        'Evaluator_ServerUpdating_UpdateStatusByApproveStatus': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,Id,ApproveStatus,{VAR=Branch.Ma_Dvcs},EmployeeCodeNext,DocCode,{VAR=User.Id},Comment,ApproveStatusWeb',
            Command: 'usp_Cotec_UpdateStatusByApproveStatus_SongSong'
        }
    };

    approveGrid = 0;

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
                    DocCode: 'C7'
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.Stt',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.ClaimDate',
                    }
                },
                {
                    Name: 'vB30BizDocApprove_EditClaim',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: 'Parent.Stt',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.ClaimDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    }
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.Stt',
                        DocDate: 'Parent.ClaimDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30ClaimDetail',
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1',
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
                    label: 'Ngày lập',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'ClaimNo',
                    label: 'Số hồ sơ',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    // isReadOnly: 'true',
                    // style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'LoaiClaim',
                    label: 'Loại Claim',
                    lookupKey: 'Class',
                    binding: {
                    },
                    
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='LOAIQTCLAIM'",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 6
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'HardDocNo',
                    label: 'Số quyết toán (bản cứng)',
                    type: 'text',
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
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",// AND RowId = '{VAR=Filter.ProductCostId}'",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 6
                }, this.srv, this.parentData),
                new DateBoxInput({
                    key: 'HardSignDate',
                    label: 'Ngày ký (bản cứng)',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    
                }),
               
               
                new LookupBoxInput({
                    key: 'BizDocIdList',
                    label: 'Hợp đồng',
                    lookupKey: 'BizDocC2',
                    binding: {
                       
                    },
                    lookupfilter: "IsActive=1",
                    //lookupfilter: "DocCode='C2' AND (BranchCode='{VAR=Branch.Ma_Dvcs}') AND (ProductCostId='{EXPR=ProductCostId}' OR ISNULL('{EXPR=ProductCostId}','')='') AND Post_TheKho=1",
                    hideValueMember: false,
                  
                    col: 12
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'ContractValue0',
                    label: 'Giá trị HĐ (trước VAT)',
                    type: 'number',
                    col: 6
                }),
                // new NumberBoxInput({
                //     key: 'ContractValueAddVAT0',
                //     label: 'Giá trị HĐ (sau VAT)',
                //     type: 'number',
                //     col: 6
                // }),
                new NumberBoxInput({
                    key: 'SubContractBeforeValue',
                    label: 'Giá trị các phụ lục (Trước VAT)',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    
                }),
                // new NumberBoxInput({
                //     key: 'SubContractBeforeValueAddVAT',
                //     label: 'Giá trị các phụ lục (Sau VAT)',
                //     type: 'number',
                //     col: 6,
                    
                // }),
                new NumberBoxInput({
                    key: 'AmountRevised',
                    label: 'GT phát sinh tăng/giảm (trước VAT)',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    
                }),
                new LookupBoxInput({
                    key: 'TaxCode',
                    label: 'Thuế',
                    lookupKey: 'Tax',
                    binding: {
                        Rate: 'TaxRate',
                        IsAdjusted: 'IsAdjusted'
                    },
                    lookupfilter: "Type=1 AND IsActive=1 AND IsGroup=0 AND IsDefault = 1",
                    hideValueMember: false,
                    col: 6,
                    //isDisabled: 'true'
                }, this.srv, this.parentData),
                // new NumberBoxInput({
                //     key: 'TotalAmountRevisedAddVAT',
                //     label: 'GT phát sinh tăng/giảm (sau VAT)',
                //     type: 'number',
                //     col: 6
                // }),
                new NumberBoxInput({
                    key: 'OriginalWorkAmount',
                    label: 'Giá trị quyết toán',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                // new CheckBoxInput({
                //     key: 'IsQT',
                //     label: 'Quyết toán',
                //     col: 6,
                //     isDisabled: 'true'
                // }),                              
           
                new NumberBoxInput({
                    key: 'OriginalWorkAmountInclueTax',
                    label: 'Giá trị quyết toán (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                    // style: 'background-color:#F1EDED;border-radius:8px;',
                }),
                new NumberBoxInput({
                    key: 'TotalAmountPayment',
                    label: 'Tổng số tiền thanh toán',
                    type: 'number',
                    col: 6,
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    isReadOnly: 'true',
                    // style: 'background-color:#F1EDED;border-radius:8px;',
                }),
                new NumberBoxInput({
                    key: 'AmountTongTTDenKyTruoc',
                    label: 'Trừ các đợt T.Toán trước',
                    type: 'number',
                    col: 6,
                   
                    // style: 'background-color:#F1EDED;border-radius:8px;',
                }),
                new NumberBoxInput({
                    key: 'OriginalDeductionAmount',
                    label: 'Khấu trừ khác (Phạt)',
                    type: 'number',
                    col: 6
                   
                }),
            
                new NumberBoxInput({
                    key: 'WarrantyValue',
                    label: 'Giữ lại bảo hành (nếu có)',
                    type: 'number',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'OriginalClaimAmount',
                    label: 'Số tiền phải TT đợt này',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    type: 'number',
                    col: 6,
                    isNewRow: true,
                    isReadOnly: 'true'
                    // style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new DateBoxInput({
                    key: 'BeginWarranty',
                    label: 'Ngày bắt đầu bảo hành',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'NumberWarranty',
                    label: 'Thời hạn bảo hành (Tháng)',
                    type: 'number',
                    // isDisabled: 'true',
                    col: 6,
                   
                }),
                new DateBoxInput({
                    key: 'EndWarranty',
                    label: 'Ngày kết thúc bảo hành',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isReadOnly: 'true'
                }),
                new DateBoxInput({
                    key: 'BeginWork',
                    label: 'Ngày bắt đầu thi công',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'EndWork',
                    label: 'Ngày kết thúc thi công',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'DateSignTOC',
                    label: 'Ngày ký TOC',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
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
                // new LookupBoxInput({
                //     key: 'EmployeeCodeSend',
                //     label: 'Người gửi duyệt',
                //     lookupKey: 'Employee',
                //     hideValueMember: false,
                //     col: 6,
                //     isDisabled: 'true'
                // }, this.srv, this.parentData),
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'File đính kèm',
                //     col: 6,
                //     isOnlyDownload: true,
                //     folderId: '{EXPR=IdCCMBudget}'
                // }, this.srv)
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
            allowRemove: false,
            allowView: true,
            allowDownLoad: true,
            allowUpload: false,
            folderId: '{EXPR=IdClaim}'
        }
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
            width: 250,
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
    ]
    childColumns3 = [
       
        {
            header: 'Số hồ sơ',
            binding: 'DocNo2',
            isRequired: true,
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: 'Số bản cứng',
            binding: 'HardDocNo',
            isRequired: true,
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: 'Nội dung',
            binding: 'BizDescription',
            width: 300,
            isReadOnly: 'true'
        },
        {
            header: 'GT tăng/giảm (Trước VAT)',
            binding: 'AmountRevised',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'GT tăng/giảm (Sau VAT)',
            binding: 'TotalAmountRevisedAddVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Thời gian BH (Theo bảo lãnh/giữ tiền)',
            binding: 'ContractQuantity',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: 'Thời gian BH (theo cam kết)',
            binding: 'PerformLastPeriodQuantity',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
        {
            header: 'Tổng thời gian bảo hành',
            binding: 'TongTGBH',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Ngày bắt đầu BH',
            binding: 'BeginDateBH',
            isRequired: true,
            width: 120,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Ngày kết thúc BH',
            binding: 'EndDateBH',
            isRequired: true,
            width: 120,
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isReadOnly: 'true'
        },
        {
            header: 'Số bản cứng',
            binding: 'ParentRowId',
            isRequired: true,
            width: 0,
            isReadOnly: 'true'
        },
    ];
}