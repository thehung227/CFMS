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

// Thanh toán thuê, mua hàng
export class LayoutBillPayEquipmentAttachExplorer implements IExplorerFormulaDeclaration {

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocCCM_Explore',
                //FilterKey: "(ProductCostId0 = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode IN ('P5') AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId0 IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                FilterKey: "((ProductCostId0 = '{VAR=Filter.ProductCostId}' OR ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'P5' AND IsActive=1)",
                OrderBy: 'ProductName,CustomerName,DocDate DESC,DocNo DESC',
                RowPage: 50
            },
            Child: {
                Name: 'vB30BizDocApprove_ExplorerCCM',
                ParentKey: 'BizDocId',
                ChildKey: 'BizDocId'
            }
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'TBTT thuê/mua hàng tập trung - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "TBTT thuê/mua hàng tập trung",
                    FileName: "TBTT thuê/mua hàng tập trung - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "10.TBTT_Thue_MuaHang.docx",
                    ExcelName: "",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: 'MAU9',
                    Name: 'WorkFlow',
                    FileName: 'WorkFlow TT - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}',
                    WordName: 'WorkFlow_TT.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                } 
            ],
            PrintGrid: [

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
            header: 'Nội dung hợp đồng',
            binding: 'Description_Hd',
            width: 400
        },
        {
            header: 'Đợt TT số',
            binding: 'PayRequireNum',
            width: 100,
            dataType: 'String'
        },
        {
            header: 'Ngày hoàn thiện duyệt',
            binding: 'FinishDate',
            width: 180,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'GT đề nghị t.toán',
            binding: 'Amount_DeNghiTT',
            width: 150
        },
        {
            header: 'Tổng GTTT đến kỳ này',
            binding: 'Amount_TongTTDenKyNay',
            width: 170
        },
        {
            header: 'Công việc',
            binding: 'JobCode',
            width: 100,
            dataType: 'String'
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
            header: 'Số hồ sơ',
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
            header: 'Số hợp đồng',
            binding: 'DocNo_Hd',
            width: 200
        },
        {
            header: 'Gói thầu/ PB',
            binding: 'ProductName',
            width: 300,
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

export class LayoutBillPayEquipmentAttachEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocCCM_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'P5',
                    BizDocId: '',
                    DocStatus: '4',
                    CurrencyCode: 'VND',
                    Id: -1,
                    IsWebData: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    PayTeamType: '01',
                    ProductCostId0: '{VAR=Filter.ProductCostId}'
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocCCMDetail_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    }
                },
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    }
                },
                {
                    Name: 'vB30BizDocApprove_AEditPayment',
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
            Key: 'BizDocCCMViewer',
            Text: 'TBTT thuê/mua hàng tập trung - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "TBTT thuê/mua hàng tập trung",
                    FileName: "TBTT thuê/mua hàng tập trung - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "10.TBTT_Thue_MuaHang.docx",
                    ExcelName: "",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ],
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
        'Evaluator_ServerConstraint_CTC_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ParentBizDocId,DocCode,{VAR=Branch.Ma_Dvcs},ProductCostId,CustomerCode,Id',
            Command: 'ufn_Coteccons_B30BizDocCCM_DefaultDocNo',
            DataMember: 'DocNo'
        },
        'Evaluator_ServerConstraint_DefaultPayRequireNum': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ProductCostId,CustomerCode,ParentBizDocId,{VAR=Branch.Ma_Dvcs},Id',//'BizDocId,BranchCode,ParentBizDocId,CustomerCode,ProductCostId'
            Command: 'ufn_B30BizDocCCM_DefaultPayRequireNum_2',//'ufn_B30BizDocCCM_DefaultPayRequireNum',
            DataMember: 'PayRequireNum',
            zExpr: "Id < 0"
        },
        'Evaluator_ServerConstraint_GetValue_From_BillThanhToan': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "BizDocId_TT,{VAR=Branch.Ma_Dvcs},{VAR=DocCodeB5}",
            Command: 'usp_Coteccons_GetValue_FormThanhToan',
            DataMember: 'Amount_ThiCong,Amount_THDenKyNay,Amount_TTKyNay,Amount_TamUng,Amount_HoanTra,Amount_TongTTDenKyNay,Amount_TTKyTruoc,Amount_DeNghiTT,Amount_ThiCongNotVAT,Amount_THDenKyNayNotVAT'
        },
        'Evaluator_ServerConstraint_GetValue_ContractValue': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "ParentBizDocId,{VAR=Branch.Ma_Dvcs},{VAR=DocCodeC3}",
            Command: 'ufn_Coteccons_GetValueContract_SubContract2',
            DataMember: 'ContractValue'
        },
        'Evaluator_ServerConstraint_GetValue_SubContractValue': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "ParentBizDocId,{VAR=Branch.Ma_Dvcs},{VAR=DocCodeC4}",
            Command: 'ufn_Coteccons_GetValueContract_SubContract2',
            DataMember: 'SubContractValue'
        },
        'Evaluator_ServerConstraint_GetValue_Amount_HDPL': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: "ParentBizDocId,{VAR=Branch.Ma_Dvcs},{VAR=DocCodeC34}",
            Command: 'ufn_Coteccons_GetValueContract_SubContract2',
            DataMember: 'Amount_HDPL'
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId0,ParentBizDocId,ProductCostId',
            Command: 'usp_B30BizDocApprove_GetDataBillPurchase',
            DataMember: '',
            OutputTable: 2
        },
        'Evaluator_ServerConstraint_DocumentDetail_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ContractType,{VAR=Branch.Ma_Dvcs},{VAR=IsGetPayment_True},DocCode',
            Command: 'usp_Web_B30BizDocDocument_GetData2',
            DataMember: '',
            OutputTable: 1
        },
        'Evaluator_ServerConstraint_Check_ThanhToan_KhongLapMoiKhiChuaDuyetCu': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,ParentBizDocId,CustomerCode,DocCode,{VAR=Branch.Ma_Dvcs},Id',
            Command: 'ufn_Coteccons_ThanhToan_KhongLapMoiKhiChuaDuyetCu',
            zExpr: "ProductCostId != ''",// && BizDocId_TT == ''
            MessageText: 'Không thể lập mới khi chưa hoàn thiện duyệt thanh toán trước',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_ThanhToan_KhongLapMoiKhiChuaDuyetCu2': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,ParentBizDocId,CustomerCode,DocCode,{VAR=Branch.Ma_Dvcs},Id',
            Command: 'ufn_Coteccons_ThanhToan_KhongLapMoiKhiChuaDuyetCu',
            zExpr: "ProductCostId != '' && BizDocId_TT == ''",
            MessageText: 'Không thể lập mới khi chưa hoàn thiện duyệt thanh toán trước',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_ThanhToan_TamUng': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,ParentBizDocId,CustomerCode,PayTeamType,{VAR=Branch.Ma_Dvcs},Id',
            Command: 'ufn_Coteccons_CheckUnique_TamUngChuaCoHopDong',
            MessageText: '"Tạm ứng theo thư giao thầu/ Phiếu giao việc" vượt quá 3 lần',
            zExpr: "'PayTeamType'.toString() == '00'.toString()",
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
        'Evaluator_ServerConstraint_Check_LapBill_GoiThauDaiDien': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId0,DocCode,{VAR=Branch.Ma_Dvcs},Id',
            Command: 'ufn_Coteccons_CheckGoiThauLapBillP5',
            MessageText: 'Gói thầu đang chọn (gói thầu đại diện) không thuộc phạm vi lập bill thuê, mua hàng',
            IgnoreError: 0
        },
        'Evaluator_ServerUpdating_Check_YeuCauBangKLTT': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'PayTeamType,DocCode,BizDocId_TT,{VAR=Branch.Ma_Dvcs},Id',
            Command: 'ufn_Coteccons_YeuCauBangKLTT',
            MessageText: 'Thanh toán/ Tạm ứng theo hợp đồng, yêu cầu lập Bảng KL thanh toán',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },        
        'Evaluator_Amount_TongTTDenKyNay_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_TongTTDenKyNay",
            Value: "Amount_TamUng",
            zExpr: "'PayTeamType'.toString() == '00'.toString()"
        },
        'Evaluator_Amount_DeNghiTT_Calculate': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "Amount_DeNghiTT",
            Value: "Amount_TamUng",
            zExpr: "'PayTeamType'.toString() == '00'.toString()"
        },
        //không đổi tên
        // 'Evaluator_UpdateApproveSend': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: 'BizDocId',
        //     Command: 'usp_Coteccons_B30BizDocCCM_SetApproveSend'
        // },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},BizDocId,{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerUpdated_UpdateValueOfTBTT': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,Id,BizDocId_TT,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_UpdateValueOfTBTT',
            //zExpr: "BizDocId_TT != ''"
        }
    }

    serverConstraint = [
        // 'Evaluator_ServerConstraint_CTC_DefaultDocNo',
        // 'Evaluator_ServerConstraint_DefaultPayRequireNum',
        // 'Evaluator_ServerConstraint_GetValue_ContractValue',
        // 'Evaluator_ServerConstraint_GetValue_SubContractValue',
        // 'Evaluator_ServerConstraint_GetValue_Amount_HDPL',
        // 'Evaluator_ServerConstraint_GetValue_From_BillThanhToan',
    ]

    serverUpdating = [
        // 'Evaluator_ServerConstraint_Check_ThanhToan_KhongLapMoiKhiChuaDuyetCu',
        // 'Evaluator_ServerConstraint_Check_ThanhToan_TamUng',
        // 'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        // 'Evaluator_ServerConstraint_Check_UserModified',
        // 'Evaluator_ServerConstraint_Check_LapBill_GoiThauDaiDien',
        // 'Evaluator_ServerUpdating_Check_YeuCauBangKLTT'
    ]

    serverUpdated: string[] = [
        // 'Evaluator_UpdateInfo_WhenApproveSend',
        // 'Evaluator_ServerUpdated_UpdateValueOfTBTT'
    ]

    buttonLoadChild: string[] = [
        // 'Evaluator_ServerConstraint_Check_ThanhToan_KhongLapMoiKhiChuaDuyetCu',
        // 'Evaluator_ServerConstraint_Check_ThanhToan_TamUng',
        // 'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        // 'Evaluator_ServerConstraint_Check_UserModified',
        // 'Evaluator_ServerConstraint_Approve_GetData',
        // 'Evaluator_ServerConstraint_DocumentDetail_GetData'
    ];

    buttonCommand: string[] = [

    ]

    columnChanged: any = {
        // Amount_TamUng: {
        //     Evaluators: [
        //         'Evaluator_Amount_TongTTDenKyNay_Calculate',
        //         'Evaluator_Amount_DeNghiTT_Calculate'
        //     ]
        // },
        // ProcessCode: {
        //     Evaluators: [
        //         'Evaluator_ServerConstraint_Approve_GetData'
        //     ]
        // }
    }

    columnsReadOnly = [];

    linkReporter = {
        'btnPhuLucA': {
            directory: 'billequipment',
            type: 'detail',
            key: 'Id_TT',
            parameter: { 'Commandkey': 'billequipment-editor', 'ProductCostId': '{EXPR=ProductCostId}', 'ParentBizDocId': '{EXPR=ParentBizDocId}', 'DocDate': '{EXPR=DocDate}', 'CustomerCode': '{EXPR=CustomerCode}', 'PayTeamType': '{EXPR=PayTeamType}', 'DocNo': '{EXPR=DocNo}', 'JobCode': '{EXPR=JobCode}', 'ParentId': '{EXPR=Id}', 'PayRequireNum': '{EXPR=PayRequireNum}', 'CurrencyCode': '{EXPR=CurrencyCode}', 'ProductCostId0': '{EXPR=ProductCostId0}' },
            evaluator: 'Evaluator_ServerConstraint_Check_ThanhToan_KhongLapMoiKhiChuaDuyetCu2'
        },
        'btnHdPl': {
            directory: 'regcontract_view',
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
                // new DateBoxInput({
                //     key: 'DocDate',
                //     label: 'Ngày lập',
                //     dataType: 'date',
                //     format: 'dd/MM/yyyy',
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }),
                // new TextBoxInput({
                //     key: 'DocNo',
                //     label: 'Số thanh toán',
                //     dataType: 'text',
                //     col: 6,
                //     validators: [Validators.required],
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }),
                // new LookupBoxInput({
                //     key: 'PayTeamType',
                //     label: 'Loại thanh toán',
                //     lookupKey: 'Class',
                //     lookupfilter: "ParentCode='PayTeamType' AND Code='01'",
                //     hideValueMember: false,
                //     validators: [Validators.required],
                //     col: 6,
                //     style: 'background-color:#F8F0D7;border-radius:8px;'
                // }, this.srv, this.parentData),
                // new TextBoxInput({
                //     key: 'PayRequireNum',
                //     label: 'Yêu cầu thanh toán số',
                //     dataType: 'text',
                //     mask: '000',
                //     col: 6,
                //     //isReadOnly: 'true',
                //     //style: 'background-color:#F1EDED;border-radius:8px;'
                // }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB thanh toán',
                    lookupKey: 'ProductCost',
                    validators: [Validators.required],
                    //lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType = '3' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1, 3) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    isDisabled: 'true',
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Hợp đồng',
                    lookupKey: 'BizDoc_CTC',
                    binding: {
                        CustomerCode: 'CustomerCode',
                        JobCode: 'JobCode',
                        ContractType: 'ContractType',
                        CurrencyCode: 'CurrencyCode',
                        Id: 'Id_HdPl',
                        DocCode: 'DocCode_HdPl'
                    },
                    validators: [Validators.required],
                    lookupfilter: "(((DocCode = 'C3' OR (DocCode = 'C4' AND IsSubContractPay = 1)) AND ProductCostId='{VAR=Filter.ProductCostId}') OR (DocCode='C3' AND IsSubContractPay = 1) OR (DocCode='C3' AND ContractType IN ('HD-08','HD-14','HD-16'))) AND Closed = 0 AND CompletedApprove=1 AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ContractTypeFilter='B4'",
                    hideValueMember: true,
                    //isDisabled: "'{EXPR=PayTeamType}' == '00'",// || '{EXPR=PayTeamType}' == '03'",
                    isDisabled: 'true',
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Nhà cung cấp',
                    lookupKey: 'Customer_CCM2',
                    binding: {
                        Name: 'Person',
                        Address: 'Address',
                        Person: 'ContactPerson'
                    },
                    validators: [Validators.required],
                    lookupfilter: "(('{EXPR=ProductType}'=3 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%') OR Code IN (SELECT A.CustomerCode FROM B30CCMBudgetDetail A INNER JOIN B30CCMBudget B ON A.CCMBudgetId = B.CCMBudgetId WHERE (A.CompletedApproveDetail=1 AND A.Loai_Dt IN ('NTP','NCC')) AND B.CompletedApprove=1 AND B.IsActive=1 AND B.DocCode='K1' AND B.ProductCostId ='{EXPR=ProductCostId}' GROUP BY A.CustomerCode))",
                    hideValueMember: false,
                    // isReadOnly: "'{EXPR=PayTeamType}' != '00'",
                    isDisabled: 'true',
                    col: 12
                }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'JobCode',
                //     label: 'Công việc',
                //     lookupKey: 'Job_CCM',
                //     hideValueMember: false,
                //     //isDisabled: 'true',
                //     col: 6
                // }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'ContractType',
                //     label: 'Loại hợp đồng',
                //     lookupKey: 'ContractType',
                //     hideValueMember: false,
                //     isDisabled: 'true',
                //     col: 6
                // }, this.srv, this.parentData),
                // new NumberBoxInput({
                //     key: 'ContractValue',
                //     label: 'GTHĐ ban đầu (gồm VAT)',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                // new NumberBoxInput({
                //     key: 'SubContractValue',
                //     label: 'Điều chỉnh HĐ (gồm VAT)',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                // new NumberBoxInput({
                //     key: 'Amount_HDPL',
                //     label: 'GTHĐ đ.chỉnh (gồm VAT)',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                // new ButtonInput({
                //     key: 'btnPhuLucA',
                //     label: 'Bảng khối lượng thanh toán',
                //     col: 6,
                //     isDisabled: "'{EXPR=PayTeamType}' != '01' || '{EXPR=Id}' < 0"
                // }),
                // new LookupBoxInput({
                //     key: 'BizDocId_TT',
                //     label: 'Bảng KL thanh toán',
                //     lookupKey: 'BizDocCCM',
                //     hideValueMember: true,
                //     binding: {
                //         //DocNo: 'DocNo',
                //         Id: 'Id_TT'
                //     },
                //     lookupfilter: "ParentId = '{EXPR=Id}' AND '{EXPR=Id}'>0 AND DocCode='B5'",
                //     //lookupfilter: "DocCode IN ('B5') AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}' AND CustomerCode='{EXPR=CustomerCode}'  AND BizDocId NOT IN (SELECT BizDocId_TT FROM B30BizDocCCM WHERE DocCode='P5' AND IsActive=1 AND BizDocId_TT <>'' AND BizDocId <> '{EXPR=BizDocId}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}')",
                //     //validators: [Validators.required],
                //     col: 6,
                //     isDisabled: "'{EXPR=PayTeamType}' == '00' || '{EXPR=PayTeamType}' == '03'"
                // }, this.srv, this.parentData),
                // new NumberBoxInput({
                //     key: 'Amount_ThiCong',
                //     label: 'Tổng giá trị thi công',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                // new NumberBoxInput({
                //     key: 'Amount_TamUng',
                //     label: 'Giá trị tạm ứng',
                //     col: 6,
                //     isDisabled: "'{EXPR=PayTeamType}' != '00'"
                // }),
                // new NumberBoxInput({
                //     key: 'Amount_THDenKyNay',
                //     label: 'Tổng GTTH đến kỳ này',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                // new NumberBoxInput({
                //     key: 'Amount_HoanTra',
                //     label: 'Giá trị hoàn trả tạm ứng',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                // new NumberBoxInput({
                //     key: 'Amount_TongTTDenKyNay',
                //     label: 'Tổng GTTT đến kỳ này',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                // // new NumberBoxInput({
                // //     key: 'Amount_TTKyNay',
                // //     label: 'Giá trị TT đến kỳ này',
                // //     col: 6,
                // //     isDisabled: 'true'
                // // }),
                // new NumberBoxInput({
                //     key: 'Amount_TTKyTruoc',
                //     label: 'Tổng GTTT đến kỳ trước',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                // new NumberBoxInput({
                //     key: 'Amount_DeNghiTT',
                //     label: 'Giá trị đề nghị thanh toán',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                // new LookupBoxInput({
                //     key: 'CurrencyCode',
                //     label: 'Mã tiền tệ',
                //     lookupKey: 'Currency',
                //     lookupfilter: "IsActive=1 AND IsGroup=0",
                //     hideValueMember: false,
                //     col: 6,
                //     //isDisabled: 'true'
                // }, this.srv, this.parentData),
                // new ButtonInput({
                //     key: 'btnHdPl',
                //     label: 'Xem hợp đồng',
                //     style: 'background-color:#9cc09c;',
                //     col: 6
                // }),
                // new LookupBoxInput({
                //     key: 'ProcessCode',
                //     label: 'Quy trình duyệt',
                //     lookupKey: 'Process',
                //     lookupfilter: "(Code IN (SELECT Code FROM dbo.ufn_Coteccons_Filter_ProcessCodeByBizDocC3('{EXPR=ProductCostId}','{EXPR=ParentBizDocId}','{EXPR=DocCode}','{VAR=Branch.Ma_Dvcs}')))",//('{EXPR=PayTeamType}' = '00') OR 
                //     hideValueMember: false,
                //     validators: [Validators.required],
                //     col: 12
                // }, this.srv, this.parentData),
                // new TextBoxInput({
                //     key: 'Description',
                //     label: 'Ghi chú',
                //     dataType: 'text',
                //     col: 6
                // }),
                // new LookupBoxInput({
                //     key: 'BizDocId_CD',
                //     label: 'Hóa đơn điện tử',
                //     lookupKey: 'ConsDocument',
                //     lookupfilter: "CompletedApprove=1 AND IsActive=1 AND BizDocId NOT IN (SELECT BizDocId_CD FROM B30BizDocCCM WHERE IsActive=1 AND BizDocId_CD<>'' AND Id<>'{EXPR=Id}' GROUP BY BizDocId_CD) AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}' AND CustomerCode='{EXPR=CustomerCode}'",
                //     hideValueMember: true,
                //     col: 6
                // }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId0',
                    label: 'Gói thầu đại diện',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    col: 12,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                // new CheckBoxInput({
                //     key: 'ApproveSend',
                //     label: 'Đã gửi duyệt',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                // new CheckBoxInput({
                //     key: 'CompletedApprove',
                //     label: 'Đã hoàn thiện duyệt',
                //     isDisabled: 'true',
                //     col: 6
                // }),
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'Đính kèm TBTT đã ký',
                //     col: 6
                // }, this.srv)
                new DateBoxInput({
                    key: 'ConfirmedDate',
                    label: 'Ngày nhận hóa đơn',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'FinishedDate',
                    label: 'Ngày thanh toán',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isNewRow: true,
                    validators: [Validators.required],
                }),
            ]
        })
    ];

    childColumns = [
        {
            header: 'Ngày hóa đơn',
            binding: 'AtchDocDate',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Số hóa đơn',
            binding: 'AtchDocNo',
            allowEditing: true,
            width: 150
        },
        {
            header: 'Mẫu số',
            binding: 'AtchFormNo',
            allowEditing: true,
            width: 150
        },
        {
            header: 'Số seri',
            binding: 'AtchSerialNo',
            allowEditing: true,
            width: 150
        },
        {
            header: 'Đối tượng VAT',
            binding: 'TaxRegName',
            allowEditing: true,
            width: 250
        },
        {
            header: 'Mã số VAT',
            binding: 'TaxRegNo',
            allowEditing: true,
            width: 150
        },
        {
            header: 'Số tài khoản ngân hàng',
            binding: 'BankAccountNo',
            allowEditing: true,
            width: 150
        }
    ];

    childColumns1 = [
        {
            header: 'Mã tài liệu',
            binding: 'DocumentCode',
            width: 80,
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Document',
            lookupfilter: 'IsGroup=0 AND IsActive=1'
        },
        {
            header: 'Tên tài liệu',
            binding: 'DocumentName',
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

    childColumns2 = [
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
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId='{EXPR=ProductCostId0}') AND PositionCode = '{EXPR=PositionCode}')",
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
            header: 'Người duyệt được chỉ định',
            binding: 'EmployeeCodeReal',
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId='{EXPR=ProductCostId0}') AND PositionCode = '{EXPR=PositionCode}')",
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
        // {
        //     header: 'Trả về cấp bậc',
        //     binding: 'PositionCodeReturn',
        //     width: 150,
        //     isReadOnly: 'true'
        // }
    ]

    childColumns3 = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
            textAlign: 'center'
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