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
import { format } from "url";

// Phiếu nhập kho
export class LayoutSettlementRecordsExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30HSQT',
                FilterKey: "IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))", //AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))
                OrderBy: 'DocDate DESC',
                RowPage: 50,
                // DefaultValues: {
                //     CurrencyCode: 'VND'
                // }
            },
            Child: {
                Name: 'vB30BizDocApprove_S1Explorer',
                ParentKey: 'BizDocId',
                ChildKey: 'BizDocId',
                OrderBy: 'ApproveGroup'
            }
        },
        PrintDocument: {
            Key: 'CCMBudgetViewer',
            Text: 'Quy trình hồ sơ quyết toán - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30CCMBudget_VoucherForm',
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
        },
        // CopiedValues: {
        //     parameter: { 'Commandkey': 'plansigncon-editor', 'StageCode': '{EXPR=StageCode}' }
        // }
    }

    parentGrid = [
        // {
        //     header: 'CCMBudgetId',
        //     binding: 'CCMBudgetId',
        //     width: 200
        // },
        // {
        //     header: 'Gói thầu',
        //     binding: 'ProductName',
        //     width: 200
        // },
        // {
        //     header: 'Số Rev',
        //     binding: 'DocNo2',
        //     width: 60,
        //     dataType: 'String'
        // },
       
        {
            header: 'Ngày',
            binding: 'DocDate',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
       {
            header: 'Số hồ sơ',
            binding: 'DocNo',
            width: 150,
            dataType: 'String'
        },
       
        {
            header: 'Dự án',
            binding: 'ProductName',
            width: 400,
            dataType: 'String'
        },
        {
            header: 'Ngày hoàn thiện',
            binding: 'HoanThanhDuyet',
            width: 150,
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
        {
            header: 'Người tạo',
            binding: 'FullName',
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

export class LayoutSettlementRecordsEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    // Khai báo view lấy dữ liệu <Tables> B7
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30HSQT',
                DefaultValues: {
                    Id: -1,
                    DocCode: 'S1',
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB30HSQTQuyTrinh',
                    ParentKey: 'Id',
                    ChildKey: 'ParentId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        ParentId: 'Parent.Id',
                        BuiltinOrder: '1'
                    }
                },
                {
                    Name: 'vB30HSQTGiaTri',
                    ParentKey: 'Id',
                    ChildKey: 'ParentId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        ParentId: 'Parent.Id',
                        BuiltinOrder: '1'
                    }
                },
                {
                    Name: 'vB30HSQTKeHoachChiTiet',
                    ParentKey: 'Id',
                    ChildKey: 'ParentId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        ParentId: 'Parent.Id',
                        BuiltinOrder: '1',
                        IsTitleRow: true
                    }
                },
                {
                    Name: 'vB30BizDocApprove_EditHSQT',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    }
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                    }
                },
            ]
        },
        PrintDocument: {
            Key: 'CCMBudgetViewer',
            Text: 'Trình duyệt hồ sơ quyết toán - {VAR=ProductName} - {VAR=DocNo}',
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
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,{VAR=EmptyField_ParentBizDocId}',
            Command: 'usp_B30BizDocApprove_GetData',
            OutputTable: 3
        },
        'Evaluator_ServerConstraint_Detail2_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'BizDocId,ProductCostId',
            Command: 'usp_B30HSQT_LoadData',
            OutputTable: 1
        },
        'Evaluator_ServerConstraint_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ProductCostId,DocCode,Id,DocDate',
            Command: 'ufn_B30HSQT_DefaultDocNo',
            zExpr: "ProductCostId != ''",
            DataMember: 'DocNo'
        },
        'Evaluator_ServerConstraint_Detail_LoadPrevious': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ProductCostId',
            Command: 'usp_B30HSQTDetail_LoadPrevious',
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_Detail3_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'Id',
            Command: 'usp_B30HSQT_LoadKeHoachChiTiet',
            OutputTable: 2
        },
        'Evaluator_ServerConstraint_Detail3_GetData_ButtonLoadChild': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'Id,ProductCostId',
            Command: 'usp_B30HSQT_LoadKeHoachChiTiet_LoadChild',
            OutputTable: 2
        },
         'Evaluator_Amount_TongGiaTriDuKienQT_ChuaVAT_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'TongGiaTriDuKienQT_ChuaVAT',
            Value: 'Math.round(GiaTriDuKienQT_TrucTiep_ChuaVAT+GiaTriDuKienQT_NSC_ChuaVAT)',
            Tables: 1
        },
        'Evaluator_Amount_TongDoanhThuDaXacNhan_ChuaVAT_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'TongDoanhThuDaXacNhan_ChuaVAT',
            Value: 'DoanhThuDaXacNhan_TrucTiep_ChuaVAT+DoanhThuDaXacNhan_NSC_ChuaVAT',
            Tables: 1
        },
        'Evaluator_Amount_DoanhThuConLai_TrucTiep_ChuaVAT_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'DoanhThuConLai_TrucTiep_ChuaVAT',
            Value: 'GiaTriDuKienQT_TrucTiep_ChuaVAT-DoanhThuDaXacNhan_TrucTiep_ChuaVAT',
            Tables: 1
        },
        'Evaluator_Amount_DoanhThuConLai_NSC_ChuaVAT_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'DoanhThuConLai_NSC_ChuaVAT',
            Value: 'GiaTriDuKienQT_NSC_ChuaVAT-DoanhThuDaXacNhan_NSC_ChuaVAT',
            Tables: 1
        },
        'Evaluator_Amount_TongDoanhThuConLai_ChuaVAT_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'TongDoanhThuConLai_ChuaVAT',
            Value: 'DoanhThuConLai_TrucTiep_ChuaVAT+DoanhThuConLai_NSC_ChuaVAT',
            Tables: 1
        },


        'Evaluator_Amount_TongGiaTriDuKienQT_GomVAT_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'TongGiaTriDuKienQT_GomVAT',
            Value: 'GiaTriDuKienQT_TrucTiep_GomVAT+GiaTriDuKienQT_NSC_GomVAT',
            Tables: 1
        },
        'Evaluator_Amount_CDTThanhToan_GomVAT_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'CDTThanhToan_GomVAT',
            Value: 'CDTThanhToan_TrucTiep_GomVAT+CDTThanhToan_NSC_GomVAT',
            Tables: 1
        },
        'Evaluator_Amount_PhaiThuConLai_TrucTiep_GomVAT_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'PhaiThuConLai_TrucTiep_GomVAT',
            Value: 'GiaTriDuKienQT_TrucTiep_GomVAT-CDTThanhToan_TrucTiep_GomVAT',
            Tables: 1
        },
        'Evaluator_Amount_PhaiThuConLai_NSC_GomVAT_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'PhaiThuConLai_NSC_GomVAT',
            Value: 'GiaTriDuKienQT_NSC_GomVAT-CDTThanhToan_NSC_GomVAT',
            Tables: 1
        },
        'Evaluator_Amount_PhaiThuConLai_GomVAT_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'PhaiThuConLai_GomVAT',
            Value: 'PhaiThuConLai_TrucTiep_GomVAT+PhaiThuConLai_NSC_GomVAT',
            Tables: 1
        },
        'Evaluator_UpdateInfo_WhenSave': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'Id',
            Command: 'usp_B30HSQT_UpdateWhenSave'
        },
         'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},BizDocId,{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true'
        }
       
    };

    serverConstraint = [
        'Evaluator_ServerConstraint_Approve_GetData',
        'Evaluator_ServerConstraint_DefaultDocNo'
    ];

    serverUpdating = [
       
    ]

    serverUpdated = [
        'Evaluator_UpdateInfo_WhenSave',
       'Evaluator_UpdateInfo_WhenApproveSend'
    ];

    buttonLoadChild = [
        'Evaluator_ServerConstraint_Detail_LoadPrevious',
        'Evaluator_ServerConstraint_Detail3_GetData_ButtonLoadChild',
        'Evaluator_ServerConstraint_Approve_GetData',
       'Evaluator_ServerConstraint_Detail2_GetData'
    ];

    buttonLoadChild2 = [
       
       'Evaluator_ServerConstraint_Detail3_GetData'
    ];

    buttonCommand: string[] = [
       
    ];

    importCommand: string[] = [
        
    ]

    columnChanged = {
       
    };

    columnChangedChild = [
        {
            Tables: 2,
            columnChanged: {
             GiaTriDuKienQT_TrucTiep_ChuaVAT : {
                Evaluators: [
                    'Evaluator_Amount_TongGiaTriDuKienQT_ChuaVAT_Calculate',
                    'Evaluator_Amount_DoanhThuConLai_TrucTiep_ChuaVAT_Calculate',
                    'Evaluator_Amount_TongDoanhThuConLai_ChuaVAT_Calculate'
                ]
             },
             GiaTriDuKienQT_NSC_ChuaVAT : {
                Evaluators: [
                    'Evaluator_Amount_TongGiaTriDuKienQT_ChuaVAT_Calculate',
                    'Evaluator_Amount_DoanhThuConLai_NSC_ChuaVAT_Calculate',
                    'Evaluator_Amount_TongDoanhThuConLai_ChuaVAT_Calculate'
                ]
             },
              DoanhThuDaXacNhan_TrucTiep_ChuaVAT : {
                Evaluators: [
                    'Evaluator_Amount_TongDoanhThuDaXacNhan_ChuaVAT_Calculate',
                    'Evaluator_Amount_DoanhThuConLai_TrucTiep_ChuaVAT_Calculate',
                    'Evaluator_Amount_TongDoanhThuConLai_ChuaVAT_Calculate'
                ]
             },
             DoanhThuDaXacNhan_NSC_ChuaVAT : {
                Evaluators: [
                    'Evaluator_Amount_TongDoanhThuDaXacNhan_ChuaVAT_Calculate',
                     'Evaluator_Amount_DoanhThuConLai_NSC_ChuaVAT_Calculate',
                     'Evaluator_Amount_TongDoanhThuConLai_ChuaVAT_Calculate'
                ]
             },
              DoanhThuConLai_TrucTiep_ChuaVAT : {
                Evaluators: [
                    'Evaluator_Amount_TongDoanhThuConLai_ChuaVAT_Calculate'
                ]
             },
             DoanhThuConLai_NSC_ChuaVAT : {
                Evaluators: [
                    'Evaluator_Amount_TongDoanhThuConLai_ChuaVAT_Calculate'
                ]
             },
             GiaTriDuKienQT_TrucTiep_GomVAT : {
                Evaluators: [
                    'Evaluator_Amount_TongGiaTriDuKienQT_GomVAT_Calculate',
                    'Evaluator_Amount_PhaiThuConLai_TrucTiep_GomVAT_Calculate',
                    'Evaluator_Amount_PhaiThuConLai_GomVAT_Calculate'
                ]
             },
             GiaTriDuKienQT_NSC_GomVAT : {
                Evaluators: [
                    'Evaluator_Amount_TongGiaTriDuKienQT_GomVAT_Calculate',
                    'Evaluator_Amount_PhaiThuConLai_NSC_GomVAT_Calculate',
                    'Evaluator_Amount_PhaiThuConLai_GomVAT_Calculate'
                ]
             },
             CDTThanhToan_TrucTiep_GomVAT : {
                Evaluators: [
                    'Evaluator_Amount_CDTThanhToan_GomVAT_Calculate',
                    'Evaluator_Amount_PhaiThuConLai_TrucTiep_GomVAT_Calculate',
                    'Evaluator_Amount_PhaiThuConLai_GomVAT_Calculate'
                ]
             },
             CDTThanhToan_NSC_GomVAT : {
                Evaluators: [
                    'Evaluator_Amount_CDTThanhToan_GomVAT_Calculate',
                    'Evaluator_Amount_PhaiThuConLai_NSC_GomVAT_Calculate',
                    'Evaluator_Amount_PhaiThuConLai_GomVAT_Calculate'
                ]
             }
            }
        },
    ];

    columnsReadOnly = [];

    linkReporter = {
        'btnBaoCao': {
            directory: 'reporterhsqtgiatri',
            type: 'view',
            key: 'REP04_QTHSQT_GIA_TRI',
            parameter: { 'Commandkey': 'REP04_QTHSQT_GIA_TRI', 'Id': '{EXPR=Id}', 'ProductCostId': '{EXPR=ProductCostId}'}
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
                    col: 6
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
                    label: 'Gói thầu',
                    lookupKey: 'ProductCost',
                 
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    validators: [Validators.required],
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND Ma_Ct='S1'",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12,
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Ghi chú',
                    type: 'text',
                    isNewRow: true,
                    col: 12
                }),
                new NumberBoxInput({
                    key: 'DoanhThuBCTC',
                    label: 'DOANH THU BCTC',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    isNewRow: true,
                    
                }),
                new NumberBoxInput({
                    key: 'GiaTriQuyetToanDuKien',
                    label: 'GT dự kiến QT CĐT (Chưa VAT)',
                    type: 'number',
                    isReadOnly: 'true',
                    col: 6,
                }),
                new NumberBoxInput({
                    key: 'DoanhThuConLaiPhaiXN',
                    label: 'DT còn phải xác nhận (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    isNewRow: true,
                    
                }),
                new NumberBoxInput({
                    key: 'GTPhaiThuDenQT',
                    label: 'GT phải thu đến QT (TC trực tiếp)(gồm VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                }),

                 new NumberBoxInput({
                    key: 'SoNgayDuyetTheoHD',
                    label: 'Số ngày duyệt theo HĐ',
                    type: 'number',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Rate1',
                    label: '% đã TT/GT dự kiến QT (TC trực tiếp)',
                    type: 'number',
                    col: 6,
                    format: 'p2',
                    isReadOnly: 'true',
                }),
                new DateBoxInput({
                    key: 'NgayHoanThanhThiCongThucTe',
                    label: 'Ngày hoàn thành thi công',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    isReadOnly: 'true',
                      isNewRow: true,
                    col: 6
                }),
                new DateBoxInput({
                    key: 'NgayCamKetKyQuyetToan',
                    label: 'Ngày cam kết quyết toán',
                    type: 'date',
                    isReadOnly: 'true',
                    format: 'dd/MM/yyyy',
                    
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    type: 'boolean',
                    col: 6,
                    isDisabled: 'true',
                    isNewRow: true
                }),
                new CheckBoxInput({
                    key: 'CompletedApprove',
                    label: 'Đã hoàn thiện duyệt',
                    type: 'boolean',
                    col: 6,
                    isDisabled: 'true'
                }),
                new ButtonInput({
                    key: 'btnBaoCao',
                    label: 'Báo cáo trình hồ sơ quyết toán',
                    col: 6
                }),
            ]
        })
    ];

    childColumns = [
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 60,
             
        },
        {
            header: 'Bộ phận tiếp nhận/Xử lý',
            binding: 'BoPhanTiepNhanXuLy',
            width: 150,
            wordWrap: 'true',
        },
        {
            header: 'Tên hồ sơ',
            binding: 'TenHoSo',
            width: 200,
            wordWrap: 'true',
        },
       {
            header: 'Số lượng hồ sơ',
            binding: 'SoLuongHoSo',
            dataType: 'Number',
            isRequired: true,
            width: 60,
        },
        {
            header: 'Hình thức hồ sơ',
            binding: 'HinhThucHoSo',
            dataType: 'Array',
            lookupKey: 'ClassDes',
            // bindingList: {
            //     Name: 'TenHinhThucHoSo'
            // },
            lookupfilter: "IsActive=1 AND ParentCode='HinhThucHoSo'",
            hideValueMember: true,
            width: 100,
        },
        //  {
        //     header: 'Hình thức hồ sơ',
        //     binding: 'TenHinhThucHoSo',
        //     width: 100,
        //     wordWrap: 'true',
        //      isReadOnly: 'true'
        // },
         {
            header: 'Số ngày xử lý',
            binding: 'SoNgayXuLy',
            dataType: 'Number',
            isRequired: true,
            width: 60,
        },
        {
            header: 'Ghi chú',
            binding: 'GhiChu',
            width: 350,
            wordWrap: 'true'
        }
    ]

    childColumns1 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 60,
             
        },
        {
            header: 'Gói thầu',
            binding: 'BizDocId_C2',
            dataType: 'Array',
            lookupKey: 'BizDoc',
            bindingList: {
                DocName: 'GoiThau'
            },
            lookupfilter: "IsActive=1 AND DocCode='C2' AND ProductCostId = '{VAR=Filter.ProductCostId}'",
            hideValueMember: true,
            width: 100
        },
        // {
        //     header: 'Tên dự án',
        //     binding: 'ProductName',
        //     width: 180,
        //     wordWrap: 'true',
        //      isReadOnly: 'true'
        // },
       
        {
            header: 'Gói thầu',
            binding: 'GoiThau',
            width: 250,
            wordWrap: 'true'
        },
        
       
        {
            header: 'GT PS CĐT chưa duyệt ( chưa VAT)',
            binding: 'GiaTriPhatSinhCDTChuaDuyet_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 120,
            aggregate: 'Sum'
        },
         {
            header: 'Cam kết ký PLHĐ chốt PS'	,
            binding: 'CamKetKyPLHDChotPhatSinh',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100
        },
         {
            header: 'Ngày hoàn thành TC thực tế'	,
            binding: 'NgayHoanThanhThiCongThucTe',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:120
        },
         {
            header: 'Ngày ký TOC'	,
            binding: 'NgayKyTOC',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100
        },
         {
            header: 'Tình trạng ký TOC',
            binding: 'TinhTrangKyTOC',
            dataType: 'Array',
            lookupKey: 'ClassDes',
            bindingList: {
                // DocName: 'Description0'
            },
            lookupfilter: "IsActive=1 AND ParentCode='KyTOC'",
            hideValueMember: true,
            width: 100
        },
          {
            header: 'Ngày cam kết ký QT'	,
            binding: 'NgayCamKetKyQuyetToan',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100							
        },
          {
            header: 'Tình trạng HSQT',
            binding: 'TinhTrangHoSoQuyetToan',
            width: 150,
            wordWrap: 'true'
        },
         {
            header: 'Nguyên nhân chậm kế hoạch so với kế hoạch trước',
            binding: 'NguyenNhanChamKeHoach',
            width: 250,
            wordWrap: 'true'
        },
        {
            header: 'GT dự kiến QT CĐT (TC trực tiếp) chưa VAT',
            binding: 'GiaTriDuKienQT_TrucTiep_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 160,
            aggregate: 'Sum'
        },
      {
            header: 'GT dự kiến QT CĐT (TC NSC) chưa VAT',
            binding: 'GiaTriDuKienQT_NSC_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            aggregate: 'Sum'
        },
         {
            header: 'Tổng GT dự kiến QT CĐT chưa VAT',
            binding: 'TongGiaTriDuKienQT_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
         {
            header: 'DT đã xác nhận (TC trực tiếp) chưa VAT',
            binding: 'DoanhThuDaXacNhan_TrucTiep_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            aggregate: 'Sum'
        },
      {
            header: 'DT đã xác nhận (TC NSC) chưa VAT',
            binding: 'DoanhThuDaXacNhan_NSC_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            aggregate: 'Sum'
        },
         {
            header: 'Tổng DT đã xác nhận chưa VAT',
            binding: 'TongDoanhThuDaXacNhan_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
        {
            header: 'DT còn lại (TC trực tiếp) chưa VAT',
            binding: 'DoanhThuConLai_TrucTiep_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
      {
            header: 'DT còn lại (TC NSC) chưa VAT',
            binding: 'DoanhThuConLai_NSC_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
         {
            header: 'Tổng DT còn lại chưa VAT',
            binding: 'TongDoanhThuConLai_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
       
        {
            header: 'GT dự kiến QT CĐT(TC trực tiếp) (gồm VAT)',
            binding: 'GiaTriDuKienQT_TrucTiep_GomVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            aggregate: 'Sum'
        },
      {
            header: 'GT dự kiến QT CĐT (TC NSC) (gồm VAT)',
            binding: 'GiaTriDuKienQT_NSC_GomVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            aggregate: 'Sum'
        },
         {
            header: 'Tổng GT dự kiến QT CĐT gồm VAT',
            binding: 'TongGiaTriDuKienQT_GomVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
         {
            header: 'GT CĐT đã TT (TC trực tiếp) gồm VAT',
            binding: 'CDTThanhToan_TrucTiep_GomVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            aggregate: 'Sum'
        },
      {
            header: 'GT CĐT đã TT (TC NSC) gồm VAT',
            binding: 'CDTThanhToan_NSC_GomVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            aggregate: 'Sum'
        },
         {
            header: 'Tổng GT CĐT đã TT gồm VAT',
            binding: 'CDTThanhToan_GomVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
        {
            header: 'GT phải thu đến QT (TC trực tiếp) gồm VAT',
            binding: 'PhaiThuConLai_TrucTiep_GomVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
        {
            header: 'GT phải thu đến QT (NSC) gồm VAT',
            binding: 'PhaiThuConLai_NSC_GomVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
     {
            header: 'Tổng GT phải thu đến QT gồm VAT',
            binding: 'PhaiThuConLai_GomVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
        {
            header: 'Số ngày quá hạn',
            binding: 'ParentRowId',
            dataType: 'Number',
            isRequired: true,
            width: 0,
            aggregate: 'Sum',
            isReadOnly: 'true'	
        },
    ]

    childColumns2 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 60,
            isReadOnly: 'true'		
             
        },
        {
            header: 'Bộ phận tiếp nhận/Xử lý',
            binding: 'BoPhanTiepNhanXuLy',
            width: 150,
            wordWrap: 'true',
            isReadOnly: 'true'		
        },
        {
            header: 'Tên hồ sơ',
            binding: 'TenHoSo',
            width: 200,
            wordWrap: 'true',
            isReadOnly: 'true'		
        },
       {
            header: 'Số lượng hồ sơ',
            binding: 'SoLuong',
            dataType: 'Number',
            isRequired: true,
            width: 60,
            isReadOnly: 'true'		
        },
        {
            header: 'Hình thức hồ sơ',
            binding: 'HinhThucHoSo',
            dataType: 'Array',
            lookupKey: 'ClassDes',
           
            lookupfilter: "IsActive=1 AND ParentCode='HinhThucHoSo'",
            hideValueMember: true,
            width: 100,
            isReadOnly: 'true'		
        },
         
         {
            header: 'Số ngày xử lý',
            binding: 'SoNgayXuLy',
            dataType: 'Number',
            isRequired: true,
            width: 60,
            isReadOnly: 'true'		
        },
         {
            header: 'Kế hoạch trình hồ sơ'	,
            binding: 'KeHoach_NgayTrinhHoSo',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100,
            						
        },
         {
            header: 'Ngày đến hạn phê duyệt'	,
            binding: 'KeHoach_NgayDenHanPheDuyet',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100,
             isReadOnly: 'true'							
        },
        {
            header: 'Ghi chú',
            binding: 'KeHoach_GhiChu',
            width: 350,
            wordWrap: 'true',
            isReadOnly: 'true'		
        },
          {
            header: 'Ngày trình hồ sơ thực tế'	,
            binding: 'ThucTe_NgayTrinhHoSo',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100							
        },
        {
            header: 'Ngày hoàn thành thực tế'	,
            binding: 'ThucTe_NgayHoanThanh',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100							
        },
        {
            header: 'Tình trạng',
            binding: 'TinhTrang',
            dataType: 'Array',
            lookupKey: 'ClassDes',
            bindingList: {
                // DocName: 'Description0'
            },
            lookupfilter: "IsActive=1 AND ParentCode='TINHTRANGHSQT'",
            hideValueMember: true,
            width: 100
        },
       
         {
            header: 'Số ngày quá hạn',
            binding: 'SoNgayQuaHan',
            dataType: 'Number',
            isRequired: true,
            width: 60,
            aggregate: 'Sum',
            isReadOnly: 'true'	
        },
         {
            header: 'Nguyên nhân/ Giải pháp',
            binding: 'ThucTe_GhiChu',
            width: 350,
            wordWrap: 'true'
        },
        {
            header: 'Gói thầu',
            binding: 'GoiThau',
            width: 0,
            wordWrap: 'true'
        },
        {
            header: 'Số ngày quá hạn',
            binding: 'ParentRowId',
            dataType: 'Number',
            isRequired: true,
            width: 0,
            aggregate: 'Sum',
            isReadOnly: 'true'	
        },
    ];

    childColumns3 = [
        {
            header: 'STT duyệt',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
            isReadOnly: 'true'
        },
        {
            header: 'Mã bộ phận',
            binding: 'DeptCode',
            width: 0,
            dataType: 'Array',
            lookupKey: 'Dept',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            isReadOnly: 'true'
        },
        {
            header: 'Tên bộ phận',
            binding: 'DeptName',
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Mã cấp bậc',
            binding: 'PositionCode',
            width: 0,
            dataType: 'Array',
            lookupKey: 'Position',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
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
            width: 150,
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
            width: 250,
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
            width: 70,
            isReadOnly: 'true'
        },
        {
            header: 'Được trả lại hồ sơ',
            binding: 'ApproveReturn',
            dataType: 'Boolean',
            width: 80,
            isReadOnly: 'true'
        },
        {
            header: 'Trả về cấp bậc',
            binding: 'PositionCodeReturn',
            width: 150,
            isReadOnly: 'true'
        }
    ]

    childColumns4 = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
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

    childColumns5 = [
        // {
        //     header: 'Mã tài liệu',
        //     binding: 'DocumentCode',
        //     width: 80,
        //     dataType: 'Array',
        //     lookupKey: 'Document',
        //     lookupfilter: 'IsGroup=0 AND IsActive=1'
        // },
        {
            header: 'Tên tài liệu',
            binding: 'Description',
            width: 250,
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 500,
            dataType: 'Object'
        }
    ]
}