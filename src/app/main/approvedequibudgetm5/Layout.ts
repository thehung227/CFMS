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

export class LayoutApprovedEquiBudgetM5Editor implements IEditorFormulaDeclaration {

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

    approveGrid = 0;

    serverConstraint = [
    ]

    serverUpdating = [

    ]

    columnChanged = {

    };

    linkReporter = {
        'btnBaoCao': {
            directory: 'reporterdutrudaucongtruong',
            type: 'view',
            key: 'REP04_DTDCT',
            parameter: { 'Commandkey': 'REP04_DTDCT', 'EquiBudgetId': '{EXPR=EquiBudgetId}' }
        }
    }

    columnsReadOnly = [];

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_EquiBudgetEdit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'M4',
                    // EquiBudgetId: '',
                    CurrencyCode: 'VND',
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB30EquiBudgetDetail_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'EquiBudgetId',
                     Sort: 'BuiltinOrder',
                    DefaultValues: {
                        // CCMBudgetId: '',
                        // BuiltinOrder: '1',
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
                // {
                //     Name: 'vB30BizDocApprove_EquiBudgetEdit',
                //     ParentKey: 'BizDocId',
                //     ChildKey: 'BizDocId',
                //     Sort: 'BuiltinOrder',
                //     DefaultValues: {
                //         // BizDocId: 'Parent.BizDocId',
                //         BuiltinOrder: '1',
                //         DocDate: 'Parent.DocDate'
                //     }
                // }
               
            ]
        },
        PrintDocument: {
            Key: 'CCMBudgetViewer',
            Text: 'Bảng quyết toán chi phí sử dụng thiết bị - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30EquiBudget_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng quyết toán chi phí sử dụng thiết bị",
                    FileName: "Bảng quyết toán chi phí sử dụng thiết bị",
                    WordName: "BangQuyetToanCPSDTB.docx",
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
                    col: 12,
                    labelCol: 5,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số kế hoạch',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12,
                    labelCol: 5,
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
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                    col: 12,
                    labelCol: 5,
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
                    col: 12,
                    labelCol: 5,
                }, this.srv, this.parentData),
                
                new UploadInput({
                    key: 'FilePath',
                    label: 'File đính kèm',
                    col: 12,
                    labelCol: 5,
                    isOnlyDownload: true,
                    folderId: '{EXPR=IdCCMBudget}'
                }, this.srv),              
                new NumberBoxInput({
                    key: 'NumberOfDays',
                    label: 'Số ngày thực hiện',
                    type: 'number',
                    dataType: 'n0',
                    isNewRow: true,
                    isDisabled: 'true',
                    col: 12,
                    labelCol: 5,
                }),
                new LookupBoxInput({
                    key: 'DeptCode',
                    label: 'Bộ phận',
                    lookupKey: 'Dept',
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 12,
                    labelCol: 5,
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'PositionCode',
                    label: 'Cấp bậc duyệt',
                    lookupKey: 'Position',
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 12,
                    labelCol: 5,
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCode',
                    label: 'Người duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 12,
                    labelCol: 5,
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
               
                new TextBoxInput({
                    key: 'Comment',
                    label: 'Ý kiến',
                    col: 12,
                    labelCol: 5,
                }),
                new LookupBoxInput({
                    key: 'EmployeeCodeSend',
                    label: 'Người gửi duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    col: 12,
                    labelCol: 5,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
               
            ]
        })
    ];

    childColumns = [
        {
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 80
        },
        {
            header: 'Diễn giải',
            binding: 'Description',
            width: 250
        },
        {
            header: 'Thiết bị nâng hạ',
            binding: 'Amount_NangHa',
            dataType: 'Number',
            width: 150,
            // isReadOnly: 'true'
        }, 
        {
            header: 'Thiết bị bao che',
            binding: 'Amount_BaoChe',
            dataType: 'Number',
            width: 150,
            // isReadOnly: 'true'
        },        
        {
            header: 'Thiết bị chống sàn',
            binding: 'Amount_ChongSan',
            dataType: 'Number',
            width: 150,
            // isReadOnly: 'true'
        },
        {
            header: 'Coppha Nhôm',
            binding: 'Amount_Coppha',
            dataType: 'Number',
            width: 150,
            // isReadOnly: 'true'
        }, 
        {
            header: 'Chi phí khác & VTTB KH 100%',
            binding: 'Amount_CPK',
            dataType: 'Number',
            width: 150,
            // isReadOnly: 'true'
        }, 
        {
            header: 'Chi phí vận chuyển',
            binding: 'Amount_CPVC',
            dataType: 'Number',
            width: 150,
            // isReadOnly: 'true'
        },
        {
            header: 'Chi phí hao hụt - mất mát (GTHH)',
            binding: 'Amount_CPHH',
            dataType: 'Number',
            width: 150,
            // isReadOnly: 'true'
        }, 
        {
            header: 'Tổng chi phí QT (GTSD)',
            binding: 'Amount_TongCPQT',
            dataType: 'Number',
            width: 150,
            // isReadOnly: 'true'
        }, 
        {
            header: 'Tổng chi phí dự trù /KHKKHĐ (GTDT)',
            binding: 'Amount_TongCPDT',
            dataType: 'Number',
            width: 150,
            // isReadOnly: 'true'
        },                                                                        
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50,
            isReadOnly: 'true'
        },
 
        {
            header: 'Bậc',
            binding: 'Level',
            dataType: 'Number',
            width: 0,
            format: 'n0',
            isReadOnly: 'true'
        },
        {
            header: 'Công thức',
            binding: 'Formula',
            width: 0,
            isReadOnly: 'true'
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
            // lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId}' AND PositionCode = '{EXPR=PositionCode}')",
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

    // childColumns2 = [
    //     {
    //         header: 'STT',
    //         binding: 'ApproveGroup',
    //         dataType: 'Number',
    //         width: 50,
    //         align: 'center'
    //     },
    //     // // {
    //     // //     header: 'Cấp bậc duyệt',
    //     // //     binding: 'PositionName',
    //     // //     width: 250
    //     // // },
    //     // {
    //     //     header: 'Người thực hiện',
    //     //     binding: 'EmployeeName',
    //     //     width: 250
    //     // },
    //     // {
    //     //     header: 'Trạng thái',
    //     //     binding: 'ApproveStatusName',
    //     //     width: 100
    //     // },
    //     // {
    //     //     header: 'Ý kiến',
    //     //     binding: 'Comment',
    //     //     width: 250,
    //     //     isContentHtml: true,
    //     //     wordWrap: true
    //     // },
    //     // {
    //     //     header: 'Ngày đến hạn',
    //     //     binding: 'StartDate',
    //     //     width: 150,
    //     //     dataType: 'Date',
    //     //     format: 'dd/MM/yyyy HH:mm'
    //     // },
    //     // {
    //     //     header: 'Ngày hoàn thành',
    //     //     binding: 'FinishDate',
    //     //     dataType: 'Date',
    //     //     format: 'dd/MM/yyyy HH:mm',
    //     //     width: 150
    //     // }
    // ];
}