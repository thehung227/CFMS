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

// Kế hoạch ngân hàng sách phòng ban
export class LayoutEquiBudgetM5Explorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30EquiBudget_Explore',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'M5' AND IsActive=1",// AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'ProductName,DocDate DESC,DocNo DESC',
                RowPage: 50,
                DefaultValues: {
                    CurrencyCode: 'VND'
                }
            },
            Child: {
                Name: 'vB30BizDocApprove_EquiBudgetExplorer',
                ParentKey: 'EquiBudgetId',
                ChildKey: 'BizDocId',
                OrderBy: 'ApproveGroup'
            }
        },
        PrintDocument: {
            Key: 'CCMBudgetViewer',
            Text: 'Bảng quyết toán chi phí sử dụng thiết bị - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30EquiBudget_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                // {
                //     Layout: "MAU1",
                //     Name: "Kế hoạch ký kết hợp đồng",
                //     FileName: "Kế hoạch ký kết hợp đồng - {EXPR=ProductName} - {EXPR=DocNo}",
                //     WordName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                //     // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                //     FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                // },
                {
                    Layout: 'MAU9',
                    Name: 'Bảng quyết toán chi phí sử dụng thiết bị',
                    FileName: 'Bảng quyết toán chi phí sử dụng thiết bị',
                    WordName: 'BangQuyetToanCPSDTB.docx',
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
        },
        CopiedValues: {
            parameter: { 'Commandkey': 'plansigncon-editor', 'StageCode': '{EXPR=StageCode}' }
        }
    }

    parentGrid = [
        {
            header: 'Gói thầu',
            binding: 'ProductName',
            width: 200
        },
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
        // {
        //     header: 'Giá trị ký kế dự kiến (chưa VAT)',
        //     binding: 'OriginalAmount',
        //     width: 200,
        //     dataType: 'Number',
        //     format: 'n0'
        // },
        // {
        //     header: 'Giá trị thanh toán dự kiến (chưa VAT)',
        //     binding: 'PaymentAmount',
        //     width: 200,
        //     dataType: 'Number',
        //     format: 'n0'
        // },
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
        },
        {
            header: 'Yêu cầu gửi duyệt',
            binding: 'NotApproveSend',
            width: 0,
            dataType: 'Boolean'
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

export class LayoutEquiBudgetM5Editor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    // Khai báo view lấy dữ liệu <Tables> B7
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30EquiBudget_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'M5',
                    DocStatus: '4',
                    EquiBudgetId: '',
                    CurrencyCode: 'VND',
                    Id: -1,
                    IsWebData: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB30EquiBudgetDetail_Edit',
                    ParentKey: 'EquiBudgetId',
                    ChildKey: 'EquiBudgetId',
                    // Sort: 'BuiltinOrder',
                    DefaultValues: {
                        EquiBudgetId: 'Parent.EquiBudgetId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        Quantity9: '0'
                    }
                },
                {
                    Name: 'vB30BizDocApprove_EquiBudgetEdit',
                    ParentKey: 'EquiBudgetId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: 'Parent.EquiBudgetId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    }
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'EquiBudgetId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.EquiBudgetId',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                }
                
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

    evaluators = {
      
        'Evaluator_TotalOriginalAmount_SetValue': {
            EvaluatorName: 'EvaluatorSumChild',
            DataMember: 'TotalOriginalAmountC',
            Value: 'OriginalAmount',
            Tables: 0
        },
 
        // server constraint
        'Evaluator_ServerConstraint_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,DocCode,DocDate',
            Command: 'ufn_B30EquiBudget_DefaultDocNo',
            zExpr: "ProductCostId != ''",
            DataMember: 'DocNo'
        },
      
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,{VAR=EmptyField_ParentBizDocId},ProductCostId0',
            Command: 'usp_B30BizDocApprove_GetData',
            OutputTable: 1
        },

        'Evaluator_ServerConstraint_CCMBudgetDetail2_LoadPrevious': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId',
            Command: 'usp_DuTruDauCongTruong_GetData',
            zExpr: "ProductCostId != ''",
            OutputTable: 0
        },
        // không đổi tên 
      
        'Evaluator_UpdateApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'EquiBudgetId',
            Command: 'usp_Coteccons_B30EquiBudget_SetApproveSend'
        },
        // server updated
        'Evaluator_ServerUpdated_CreateFormula': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'EquiBudgetId',
            Command: 'usp_Coteccons_CreateFormula_EquipBudgetDetail'
        },
        'Evaluator_ServerUpdated_BuiltinOrder': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=TableNames_B30EquiBudgetDetail},{VAR=Keys_B30EquiBudgetDetail},{VAR=FieldOrders_B30EquiBudgetDetail},EquiBudgetId,{VAR=EmptyField_BizDocId},{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_Web_SetBuiltionOrder_Equip'
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},{VAR=EmptyField_BizDocId},EquiBudgetId,{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend_Equip',
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerUpdated_CCMBudgetDetail_UpdateFromParent': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CCMBudgetId,DocCode',
            Command: 'usp_Coteccons_CCMBudgetDetail_UpdateFromParentWEB'
        }
    };

    serverConstraint = [
        'Evaluator_ServerConstraint_DefaultDocNo'
    ];

    serverUpdating = [
        
    ]

    serverUpdated = [
        'Evaluator_ServerUpdated_BuiltinOrder',
        'Evaluator_UpdateInfo_WhenApproveSend',
        'Evaluator_ServerUpdated_CreateFormula',
        // 'Evaluator_ServerUpdated_CCMBudgetDetail_UpdateFromParent'
    ];

    buttonLoadChild: string[] = [

        //getdataforchild
        'Evaluator_ServerConstraint_CCMBudgetDetail2_LoadPrevious',
        
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
        // {
        //     Tables: 0,
        //     columnChanged: {
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
            directory: 'reporterdutrudaucongtruong',
            type: 'view',
            key: 'REP04_DTDCT',
            parameter: { 'Commandkey': 'REP04_DTDCT', 'EquiBudgetId': '{EXPR=EquiBudgetId}' }
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
                    label: 'Số kế hoạch',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Công trường',
                    lookupKey: 'ProductCost',
           
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType=1  AND RowId = '{VAR=Filter.ProductCostId}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive=1 AND Ma_Ct='{EXPR=DocCode}'",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
                
                new NumberBoxInput({
                    key: 'TotalOriginalAmountC',
                    label: 'Tổng chi phí quyết toán',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'TotalPaymentAmountC',
                    label: 'Tổng chi phí dự trù',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'DiscountAmount',
                    label: 'Tổng giá trị hao hụt',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
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
            header: 'Chi phí khác',
            binding: 'Amount_CPK',
            dataType: 'Number',
            width: 150,
            // isReadOnly: 'true'
        },  
        {
            header: 'VTTB KH 100%',
            binding: 'Amount_VTTBKH',
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
            header: 'Mã công việc',
            binding: 'JobCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Job',
            bindingList: {
                Name: 'JobName'
            },
            multiSelection: true,
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 150,
            validators: "{EXPR=JobCode} == ''",
            validatorMessage: 'Mã công việc, không được bỏ trắng giá trị',
            ignoreError: 1,
            isReadOnly: 'true'
        },
        {
            header: 'Tên công việc',
            binding: 'JobName',
            isRequired: true,
            width: 250,
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
            lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
            width: 100,
            validators: "{EXPR=CustomerCode} == ''",
            validatorMessage: 'Mã đối tượng, không được bỏ trắng giá trị',
            ignoreError: 1,
            isReadOnly: 'true'
        },
        {
            header: 'Tên đối tác',
            binding: 'CustomerName',
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Ngày thi công trên tiến độ CĐT',
            binding: 'WorkStartDate',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Ngày thi công thực tế',
            binding: 'WorkStartDateReal',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Dự phòng tất cả chậm trễ',
            binding: 'PreventiveDays',
            dataType: 'Number',
            width: 110
        },
        {
            header: 'Gia công, sản xuất, chuyển hàng',
            binding: 'MachineDays',
            dataType: 'Number',
            width: 130
        },
        {
            header: 'Triển khai hợp đồng',
            binding: 'DocumentDays',
            dataType: 'Number',
            width: 90
        },
        {
            header: 'Ngày kí hợp đồng',
            binding: 'ContractSignalDate',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isReadOnly: 'true'
        },
        {
            header: 'Thời gian duyệt mẫu',
            binding: 'SampleApproveDays',
            dataType: 'Number',
            width: 100
        },
        {
            header: 'Ngày chốt gói thầu',
            binding: 'AgreeDate',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isReadOnly: 'true'
        },
        {
            header: 'Thời gian đàm phán',
            binding: 'NegotiateDays',
            dataType: 'Number',
            width: 90
        },
        {
            header: 'QS gửi báo giá về CCM',
            binding: 'QSToCCMDate',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isReadOnly: 'true'
        },
        {
            header: 'TP/NCC báo giá',
            binding: 'SupplierQuoteDays',
            dataType: 'Number',
            width: 120
        },
        {
            header: 'QS mời TP/NCC báo giá',
            binding: 'QSInviteQuoteDate',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isReadOnly: 'true'
        },
        {
            header: 'Trạng thái',
            binding: 'StatusCode',
            // dataType: 'Array',
            // lookupKey: 'Class',
            // lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode = 'BudgetType'",
            width: 150
        },
    ];
}