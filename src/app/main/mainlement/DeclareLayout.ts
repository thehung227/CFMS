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

// Quyết toán hợp đồng
export class LayoutMainlementExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_Explore',
                FilterKey: "(IsMaintenance = 'true' AND ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode IN ('C5') AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'ProductName,CustomerName,DocNo DESC',
                RowPage: 50
            },
            Child: {
                Name: 'vB30BizDocApprove_Explorer',
                ParentKey: 'BizDocId',
                ChildKey: 'BizDocId'
            }
        },
        PrintDocument: {
            Key: 'Viewer_TCBN',
            Text: 'Mẫu in Quyết toán',
            Command: 'usp_B30BizDoc_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: 'MAU0',
                    Name: 'Chấp thuận quyết toán NTP.NCC.DTC',
                    FileName: 'Chấp thuận quyết toán, thanh lý HĐ NTP.NCC.DTC - {EXPR=ProductName} - {EXPR=CustomerName}',
                    WordName: 'BM-B012a-Rev03--Chap-thuan-quyet-toan-thanh-ly-hop-dong-NTP-CC-DTC.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: 'MAU1',
                    Name: 'Chấp thuận quyết toán NTP.NCC.DTC.ME',
                    FileName: 'Chấp thuận quyết toán, thanh lý HĐ NTP.NCC.DTC.ME - {EXPR=ProductName} - {EXPR=CustomerName}',
                    WordName: 'BM-B012a-Rev03--Chap-thuan-quyet-toan-thanh-ly-hop-dong-NTP-CC-DTC-ME.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: 'MAU2',
                    Name: 'Chấp thuận quyết toán NTP.NCC.DTC.TB',
                    FileName: 'Chấp thuận quyết toán, thanh lý HĐ NTP.NCC.DTC.TB - {EXPR=ProductName} - {EXPR=CustomerName}',
                    WordName: 'BM-B012a-Rev03--Chap-thuan-quyet-toan-thanh-ly-hop-dong-NTP-CC-DTC-TB.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: "MAU5",
                    Name: "TBQT NTP.NCC",
                    FileName: "TBQT NTP.NCC - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "9.TBQT_TPNCC.docx",
                    ExcelName: "",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: "MAU3",
                    Name: "TBQT NTP.NCC - ME",
                    FileName: "TBQT NTP.NCC ME - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "9.TBQT_TPNCC_ME.docx",
                    ExcelName: "",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: "MAU4",
                    Name: "TBQT NTP.NCC - TB",
                    FileName: "TBQT NTP.NCC TB - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "9.TBQT_TPNCC_TB.docx",
                    ExcelName: "",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                // {
                //     Layout: 'MAU1',
                //     Name: 'Thông báo quyết toán TP/NCC',
                //     FileName: 'TBQT TP/NCC - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}',
                //     WordName: "9.TBQT_TPNCC.docx",
                //     FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                // },
                // {
                //     Layout: 'MAU2',
                //     Name: 'Thông báo quyết toán ĐTC',
                //     FileName: 'TBQT ĐTC - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}',
                //     WordName: "8.TBQT_DTC.docx",
                //     FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                // },
                {
                    Layout: 'MAU3',
                    Name: 'Biên bản quyết toán HĐ mua bán',
                    FileName: 'Biên bản quyết toán, thanh lý - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}',
                    WordName: 'BM-C010a-Rev00--Bien-Ban-Quyet-Toan-HD-mua-ban.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: 'MAU4',
                    Name: 'Biên bản quyết toán HĐ thầu phụ',
                    FileName: 'Biên bản quyết toán, thanh lý - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}',
                    WordName: 'BM-C010-Rev00--Bien-Ban-Quyet-Toan-HD-thau-phu.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: 'MAU9',
                    Name: 'WorkFlow',
                    FileName: 'WorkFlow QT - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=ValueOfPayPeriod_Str}',
                    WordName: 'WorkFlow_QT.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ]
        }
    }

    parentGrid = [
        {
            header: 'Đối tác',
            binding: 'CustomerName',
            width: 300
        },
        {
            header: 'Số',
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
            header: 'Quy trình duyệt',
            binding: 'ProcessName',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Đã gửi duyệt',
            binding: 'ApproveSend',
            width: 110,
            dataType: 'Boolean'
        },
        {
            header: 'Hoàn thiện duyệt',
            binding: 'CompletedApprove',
            width: 110,
            dataType: 'Boolean'
        },
        // {
        //     header: 'Hồ sơ hủy',
        //     binding: 'ClosedApprove',
        //     width: 80,
        //     dataType: 'Boolean'
        // },
        {
            header: 'Đang xử lý',
            binding: 'XuLyTiepTheo',
            width: 150,
            dataType: 'String'
        },
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
            header: 'Gói thầu/ PB',
            binding: 'ProductName',
            width: 0,
            dataType: 'String'
        }

    ]

    childGrid = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
        },
        {
            header: 'Bộ phận',
            binding: 'DeptName',
            width: 250,
            dataType: 'String'
        },
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

export class LayoutMainlementEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'C5',
                    DocStatus: '4',
                    BizDocId: '',
                    ExchangeRate: '1',
                    IsMaintenance: true,
                    CurrencyCode: 'VND',
                    Id: -1,
                    IsWebData: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
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
                {
                    Name: 'vB30BizDocApprove_AEditContract',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
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
                }
            ]
        },
        PrintDocument: {
            Key: 'WorkFlow',
            Text: 'Cover workflow - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30BizDoc_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [],
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'BuiltinOrder',
                    width: 50,
                    dataType: 'Number',
                    align: 'center'
                },
                {
                    header: 'Tên file',
                    binding: 'FilePath',
                    width: 600,
                    dataType: 'String',
                    align: 'left'
                }
            ]
        }
    }

    evaluators = {
        'Evaluator_AriseValue_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'AriseValue',
            Value: "ValueOfWork-ContractValue-SubContractValue"
        },
        'Evaluator_ValueOfWorkAddVAT_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'ValueOfWorkAddVAT',
            Value: 'Math.round(ValueOfWork+(ValueOfWork*TaxRate))'
        },
        'Evaluator_Set_ValueOfGuarantee': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'ValueOfGuarantee',
            Value: "Bao_Lanh_Bao_Hanh == 1 ? ValueOfWarranty : 0"
        },
        //
        'Evaluator_ServerConstraint_SubContractValue': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ParentBizDocId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_C5_GiaTriCacPhuLuc',
            DataMember: 'SubContractValue'
        },
        // 'Evaluator_ServerConstraint_GetAmountFromBillLast': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: 'ProductCostId,ParentBizDocId,{VAR=Branch.Ma_Dvcs}',
        //     Command: 'usp_Coteccons_GetAmountForC5',
        //     DataMember: 'TotalOfValue,ValueOfPay,ValueOfPayPeriod'
        // },
        //
        'Evaluator_ServerConstraint_ToDate': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'FromDate,DayOfWarranty',
            Command: 'usp_Coteccons_Web_DateAdd',
            DataMember: 'ToDate'
        },
        'Evaluator_ServerConstraint_CTC_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ParentBizDocId,ProductCostId,ContractType,DocCode,{VAR=Branch.Ma_Dvcs},Id',
            Command: 'ufn_Coteccons_B30BizDoc_DefaultDocNo',
            DataMember: 'DocNo',
            zExpr: "ParentBizDocId != '' && ProductCostId != '' && ContractType != ''"
        },
        'Evaluator_ServerConstraint_B30BizDoc_Check_Unique_DocNo': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},BizDocId,DocCode,DocNo',
            Command: 'ufn_B30BizDoc_CheckUniqueDocNo',
            MessageText: 'Số quyết toán đã tồn tại',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_DocumentDetail_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,{VAR=ContractType_QT},{VAR=Branch.Ma_Dvcs},{VAR=IsGetPayment_True},DocCode',
            Command: 'usp_Web_B30BizDocDocument_GetData2',
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,BranchCode,ProductCostId,ParentBizDocId',
            Command: 'usp_B30BizDocApprove_GetData',
            OutputTable: 1
        },
        'Evaluator_ServerConstraint_ActitityCode_GetData': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ParentBizDocId',
            Command: 'usp_CTC_Get_ActivityCodeForC5',
            DataMember: 'ActivityCode'
        },
        'Evaluator_ServerConstraint_JobCode_GetData': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ParentBizDocId',
            Command: 'usp_CTC_Get_JobCodeForC5',
            DataMember: 'JobCode'
        },
        // 'Evaluator_ServerConstraint_UniqueQT': {
        //     EvaluatorName: 'EvaluatorValidate',
        //     ConstraintKey: 'ParentBizDocId,{VAR=Branch.Ma_Dvcs}',
        //     Command: 'ufn_Coteccons_CheckUnique_ParentBizDocId_C5',
        //     zExpr: "Id < 0",
        //     MessageText: 'Hợp đồng này đã lập quyết toán',
        //     IgnoreError: 0
        // },
        'Evaluator_ServerConstraint_Check_QuyetToan_KhongLapMoiKhiChuaDuyetCu': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,ParentBizDocId,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_QuyetToan_KhongLapMoiKhiChuaDuyetCu',
            zExpr: "Id < 0",
            MessageText: 'Không thể lập mới khi chưa hoàn thiện duyệt quyết toán trước',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_QuyetToan_KhongLapMoiKhiChuaDuyetThanhToan': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,ParentBizDocId,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_QuyetToan_KhongLapMoiKhiChuaDuyetThanhToan',
            zExpr: "Id < 0",
            MessageText: 'Không thể lập quyết toán khi thanh toán trước chưa được duyệt',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'BizDocId,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Conteccons_NotChangeWhenApproveSent',
            MessageText: 'Không được thay đổi khi đã gửi duyệt',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_UserModified': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: '{VAR=User.Id},BizDocId,DocCode',
            Command: 'ufn_Coteccons_CheckUser_ModifiedBy',
            MessageText: 'Không được điều chỉnh dữ liệu của người dùng khác',
            IgnoreError: 0,
            zExpr: 'Id > 0 && ApproveSend == false'
        },
        'Evaluator_Reset_CustomerCode': {
            DataMember: 'CustomerCode',
            Value: "''",
            zExpr: "ParentBizDocId == ''"
        },
        //không đổi tên
        'Evaluator_UpdateApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Coteccons_B30BizDoc_SetApproveSend'
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},BizDocId,{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerConstraint_Check_BlockBill': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "DocDate,ProductCostId,{VAR=User.Id}",
            Command: 'ufn_CheckBillBaoHanh',
            MessageText: 'Đã quá 30 ngày kể từ thời gian kết thúc bảo hành dự kiến, trình ký lại Kế hoạch Bảo hành đợt này.',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
    }

    serverConstraint = [
        'Evaluator_ServerConstraint_CTC_DefaultDocNo',
        'Evaluator_ServerConstraint_SubContractValue',
        // //'Evaluator_ServerConstraint_ActitityCode_GetData',
        // //'Evaluator_ServerConstraint_JobCode_GetData'
        // 'Evaluator_ServerConstraint_ToDate'
    ]

    serverUpdating = [
        'Evaluator_ServerConstraint_B30BizDoc_Check_Unique_DocNo',
        'Evaluator_ServerConstraint_Check_QuyetToan_KhongLapMoiKhiChuaDuyetCu',
        'Evaluator_ServerConstraint_Check_QuyetToan_KhongLapMoiKhiChuaDuyetThanhToan',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_UserModified',
        'Evaluator_ServerConstraint_Check_BlockBill'
    ];

    serverUpdated: string[] = [
        'Evaluator_UpdateInfo_WhenApproveSend'
    ]

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_B30BizDoc_Check_Unique_DocNo',
        'Evaluator_ServerConstraint_Check_QuyetToan_KhongLapMoiKhiChuaDuyetCu',
        'Evaluator_ServerConstraint_Check_QuyetToan_KhongLapMoiKhiChuaDuyetThanhToan',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_UserModified',
        //
        'Evaluator_ServerConstraint_DocumentDetail_GetData',
        'Evaluator_ServerConstraint_Approve_GetData',
    ];

    buttonCommand: string[] = [

    ];

    columnChanged = {
        ValueOfWork: {
            Evaluators: [
                'Evaluator_ValueOfWorkAddVAT_Calculator',
                'Evaluator_AriseValue_Calculator'
            ]
        },
        TaxCode: {
            Evaluators: [
                "Evaluator_ValueOfWorkAddVAT_Calculator"
            ]
        },
        Bao_Lanh_Bao_Hanh: {
            Evaluators: [
                "Evaluator_Set_ValueOfGuarantee"
            ]
        },
        ValueOfWarranty: {
            Evaluators: [
                "Evaluator_Set_ValueOfGuarantee"
            ]
        },
        ProcessCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_Approve_GetData'
            ]
        },
        // ParentBizDocId: { 
        //     Evaluators: [
        //       'Evaluator_Reset_CustomerCode'
        //     ]          
        // }
    };

    columnsReadOnly = [];

    linkReporter = {
        'btnPhuLucA': {
            directory: 'billmainlement',
            type: 'detail',
            key: 'Id_TT',
            parameter: { 'Commandkey': 'billmainlement-editor', 'ProductCostId': '{EXPR=ProductCostId}', 'ParentBizDocId': '{EXPR=ParentBizDocId}', 'DocDate': '{EXPR=DocDate}', 'CustomerCode': '{EXPR=CustomerCode}', 'DocNo': '{EXPR=DocNo}', 'ParentId': '{EXPR=Id}' }
        },
        'btnHdPl': {
            directory: 'regcontract_viewCT',
            type: 'detail',
            command: "{EXPR=DocCode_HdPl} == 'C3' ? 'detailc3' : {EXPR=DocCode_HdPl} == 'C4' ? 'detailc4' : ''",
            key: 'Id_HdPl'
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
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số quyết toán',
                    type: 'text',
                    isReadOnly: 'true',
                    col: 6,
                    validators: [Validators.required],
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Hợp đồng/ PL',
                    validators: [Validators.required],
                    lookupKey: 'BizDoc_CTC',
                    lookupfilter: "(DocCode = 'C3' OR (DocCode = 'C4' AND  IsSubContractPay = 1)) AND ContractType IN ('HD-18') AND CompletedApprove=1 AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId='{EXPR=ProductCostId}'",
                    hideValueMember: true,
                    binding: {
                        ContractType: 'ContractType',
                        CusBankAccountNo: 'CusBankAccountNo',
                        CusBankName: 'CusBankName',
                        CustomerCode: 'CustomerCode',
                        ContactPerson: 'ContactPerson',
                        Position: 'Position',
                        AuthorizeNo: 'AuthorizeNo',
                        AuthorizeDate: 'AuthorizeDate',
                        ContractValue: 'ContractValue',
                        ContractValueAddVAT: 'ContractValueAddVAT',
                        CurrencyCode: 'CurrencyCode',
                        TaxCode: 'TaxCode',
                        TaxRate: 'TaxRate',
                        JobCode: 'JobCode',
                        ActivityCode: 'ActivityCode',
                        Id: 'Id_HdPl',
                        DocCode: 'DocCode_HdPl'
                    },
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Đối tác',
                    lookupKey: 'Customer_CCM2',
                    lookupfilter: "(('{EXPR=ProductType}'=3 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%') OR Code IN (SELECT A.CustomerCode FROM B30CCMBudgetDetail A INNER JOIN B30CCMBudget B ON A.CCMBudgetId = B.CCMBudgetId WHERE (A.CompletedApproveDetail=1 OR A.Loai_Dt = 'DTC') AND B.CompletedApprove=1 AND B.IsActive=1 AND B.DocCode='K1' AND B.ProductCostId ='{EXPR=ProductCostId}' GROUP BY A.CustomerCode))",
                    hideValueMember: false,
                    binding: {
                        Name: 'CustomerName',
                        Address: 'Address'
                    },
                    col: 12,
                    isReadOnly: 'true',
                    validators: [Validators.required],
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new MultiSelectInput({
                    key: 'ActivityCode',
                    label: 'Lĩnh vực',
                    lookupKey: 'Activity',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv),
                new LookupBoxInput({
                    key: 'ContractType',
                    label: 'Loại hợp đồng',
                    validators: [Validators.required],
                    lookupKey: 'ContractType',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    binding: {
                        ClassCode1: 'ClassCode1'
                    },
                    isDisabled: 'true',
                    hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),
                new MultiSelectInput({
                    key: 'JobCode',
                    label: 'Công việc',
                    lookupfilter: "'{EXPR=ActivityCode}'='' OR ActivityCode IN (SELECT Val FROM dbo.ufn_sys_SplitString('{EXPR=ActivityCode}',','))",
                    lookupKey: 'Job',
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv),
                new LookupBoxInput({
                    key: 'CusBankAccountNo',
                    label: 'Tài khoản',
                    lookupKey: 'CustomerBankAccount',
                    lookupfilter: "CustomerCode='{EXPR=CustomerCode}'",
                    hideValueMember: false,
                    binding: {
                        Description: 'CusBankName'
                    },
                    col: 6
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Address',
                    label: 'Địa chỉ',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    isDisabled: 'true'
                }),
                new TextBoxInput({
                    key: 'CusBankName',
                    label: 'Ngân hàng',
                    type: 'text',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'ContactPerson',
                    label: 'Đại diện ký QT',
                    type: 'text',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'Position',
                    label: 'Chức vụ',
                    lookupKey: 'JobPositionCCM',
                    lookupfilter: 'IsActive=1 AND IsGroup=0',
                    hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'AuthorizeNo',
                    label: 'Ủy quyền số',
                    type: 'text',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'AuthorizeDate',
                    label: 'Ngày UQ',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'CurrencyCode',
                    label: 'Mã tiền tệ',
                    lookupKey: 'Currency',
                    lookupfilter: "IsActive=1 AND IsGroup=0",
                    hideValueMember: false,
                    col: 6,
                    //isDisabled: 'true'
                }, this.srv, this.parentData),
                new ButtonInput({
                    key: 'btnPhuLucA',
                    label: 'Bảng khối lượng quyết toán',
                    col: 6,
                    isDisabled: "'{EXPR=Id}' < 0"
                }),
                new NumberBoxInput({
                    key: 'ContractValue',
                    label: 'Giá trị HĐ (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'ContractValueAddVAT',
                    label: 'Giá trị HĐ (gồm VAT)',
                    type: 'number',
                    col: 6,
                    visible: 'false'
                }),
                new NumberBoxInput({
                    key: 'Amount_TamUng',
                    label: 'Tạm ứng',
                    type: 'number',
                    col: 6,
                    visible: 'false'
                }),
                new NumberBoxInput({
                    key: 'Amount_HoanTra',
                    label: 'Hoàn trả',
                    type: 'number',
                    col: 6,
                    visible: 'false'
                }),
                new LookupBoxInput({
                    key: 'BizDocId_PL',
                    label: 'Bảng KLQT',
                    lookupKey: 'BizDocCCM',
                    hideValueMember: true,
                    binding: {
                        Amount_TongTTDenKyNay: 'TotalOfValue',
                        Amount_TTKyTruoc: 'ValueOfPay',
                        Amount_DeNghiTT: 'ValueOfPayPeriod',
                        Amount_BaoHanh: 'ValueOfWarranty',
                        Amount_TamUng: 'Amount_TamUng',
                        Amount_HoanTra: 'Amount_HoanTra',
                        Amount_THDenKyNayNotVAT: 'ValueOfWork',
                        Amount_THDenKyNay: 'ValueOfWorkAddVAT',
                        Amount_KhauTruBaoHanh: 'Amount_KhauTru',
                        Id: 'Id_TT'
                    },
                    //lookupfilter: "DocCode LIKE 'B%' AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}' AND BizDocId NOT IN (SELECT BizDocId_PL FROM B30BizDoc WHERE IsActive=1 AND BizDocId_PL <> '' AND BizDocId <> '{EXPR=BizDocId}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}' UNION SELECT BizDocId_TT FROM B30BizDocCCM WHERE IsActive=1 AND BizDocId_TT <> '' AND BizDocId <> '{EXPR=BizDocId}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}')",
                    //lookupfilter: "DocCode = 'QT' AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}' AND BizDocId NOT IN (SELECT BizDocId_PL FROM B30BizDoc WHERE IsActive=1 AND BizDocId_PL <> '' AND BizDocId <> '{EXPR=BizDocId}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}')",
                    //validators: [Validators.required],
                    lookupfilter: "ParentId = '{EXPR=Id}' AND '{EXPR=Id}' > 0 AND DocCode='QT'",
                    col: 6,
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'SubContractValue',
                    label: 'GT các PLHĐ (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'TotalOfValue',
                    label: 'Tổng số tiền thanh toán',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'AriseValue',
                    label: 'PS tăng/giảm (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'ValueOfPay',
                    label: 'Trừ các đợt t.toán trước',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'ValueOfWork',
                    label: 'Giá trị QT (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'ValueOfWarranty',
                    label: 'Số tiền giữ lại bảo hành',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new LookupBoxInput({
                    key: 'TaxCode',
                    label: 'Thuế',
                    lookupKey: 'Tax',
                    binding: {
                        Rate: 'TaxRate'
                    },
                    lookupfilter: "Type=1 AND IsActive=1 AND IsGroup=0 AND IsDefault = 1",
                    hideValueMember: false,
                    col: 6,
                    //isDisabled: 'true'
                }, this.srv, this.parentData),
                new CheckBoxInput({
                    key: 'Bao_Lanh_Bao_Hanh',
                    label: 'Bảo lãnh bảo hành',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'ValueOfWorkAddVAT',
                    label: 'Giá trị QT (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'ValueOfGuarantee',
                    label: 'Giá trị bảo lãnh',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new DateBoxInput({
                    key: 'FromDate',
                    label: 'Ngày bắt đầu bảo hành',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'ValueOfPayPeriod',
                    label: 'Số tiền phải TT đợt này',
                    type: 'number',
                    isDisabled: 'true',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'DayOfWarranty',
                    label: 'Thời hạn bảo hành(tháng)',
                    type: 'number',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'EndDate',
                    label: 'Ngày kết thúc bảo hành',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    isUsingLabel: false,
                    col: 6,
                    // isReadOnly: 'true',
                    // style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND Ma_Ct='{EXPR=DocCode}'",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Remark',
                    label: 'Ghi chú',
                    type: 'text',
                    col: 12
                }),
                new DateBoxInput({
                    key: 'Date_CCMPrint',
                    label: 'Ngày CCM hoàn thành',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    isDisabled: 'true',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'Ngay_Phan_Phoi',
                    label: 'Chuyển cho đối tác',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    isDisabled: 'true',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'ConfirmedDate',
                    label: 'Ngày GĐDA ký',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    isDisabled: 'true',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'Date_ReceiveFromCustomer',
                    label: 'Nhận từ đối tác',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    isDisabled: 'true',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'FinishedDate',
                    label: 'Ngày đóng dấu',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    isDisabled: 'true',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'HandoverDate',
                    label: 'Ngày chuyển kế toán',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    isDisabled: 'true',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Remark2',
                    label: 'Thông tin khác',
                    type: 'text',
                    isDisabled: 'true',
                    col: 12
                }),                
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    col: 6,
                    isDisabled: 'true'
                }),
                new ButtonInput({
                    key: 'btnHdPl',
                    label: 'Xem hợp đồng',
                    style: 'background-color:#9cc09c;',
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'CompletedApprove',
                    label: 'Hoàn thành duyệt',
                    col: 6,
                    isDisabled: 'true'
                }),
                new UploadInput({
                    key: 'FilePath',
                    label: 'File quyết toán đã ký',
                    col: 6,
                    isOnlyDownload: true
                }, this.srv)
            ]
        }),
    ];

    childColumns = [
        {
            header: 'Mã tài liệu',
            binding: 'DocumentCode',
            width: 80,
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Document',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            isReadOnly: 'true'
        },
        {
            header: 'Tên tài liệu',
            binding: 'DocumentName',
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Yêu cầu đính kèm',
            binding: 'Attached',
            dataType: 'Boolean',
            width: 60,
            isReadOnly: 'true'
        },
        {
            header: 'Ghi chú',
            binding: 'Description',
            width: 250
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

    childColumns1 = [
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

    childColumns2 = [
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
}