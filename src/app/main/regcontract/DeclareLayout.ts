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

export class LayoutRegContractExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_Explore',
                FilterKey: "(ContractType NOT IN ('HD-18') AND ProductCostId = '{VAR=Filter.ProductCostId}') AND CompletedApprove=0 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode IN ('C3','C4') AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'ProductName,CustomerName',
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
            Text: 'Mẫu in trình ký HĐ, PLHĐ - {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_B30BizDoc_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [

                {
                    Layout: 'MAU4',
                    Name: 'Hợp đồng mua bán',
                    FileName: 'Hợp đồng mua bán - {EXPR=ProductName} - {EXPR=CustomerName}',
                    WordName: 'C002.1-Dieu kien rieng hop dong mua ban.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: 'MAU5',
                    Name: 'Hợp đồng thầu phụ',
                    FileName: 'Hợp đồng thầu phụ - {EXPR=ProductName} - {EXPR=CustomerName}',
                    WordName: 'C003.1-Dieu kien rieng hop dong thau phu.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: 'MAU6',
                    Name: 'Hợp đồng đội thi công',
                    FileName: 'Hợp đồng đội thi công - {EXPR=ProductName} - {EXPR=CustomerName}',
                    WordName: 'C004.1 - Dieu kien rieng hop dong Doi thi cong.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: 'MAU7',
                    Name: 'Hợp đồng dịch vụ',
                    FileName: 'Hợp đồng dịch vụ - {EXPR=ProductName} - {EXPR=CustomerName}',
                    WordName: 'BM-C006.1--Hop-dong-Dich-vu.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: 'MAU8',
                    Name: 'Hợp đồng thuê nhà bên cho thuê chịu thuế',
                    FileName: 'Hợp đồng thuê nhà bên cho thuê chịu thuế - {EXPR=ProductName} - {EXPR=CustomerName}',
                    WordName: 'C005.6-Hop dong thue nha Ben cho thue chiu thue.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: 'MAU9',
                    Name: 'Hợp đồng thuê nhà bên thuê chịu thuế',
                    FileName: 'Hợp đồng thuê nhà bên thuê chịu thuế - {EXPR=ProductName} - {EXPR=CustomerName}',
                    WordName: 'C005.7-Hop dong thue nha Ben thue chiu thue.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: 'MAU10',
                    Name: 'Hợp đồng thuê thiết bị',
                    FileName: 'Hợp đồng thuê thiết bị - {EXPR=ProductName} - {EXPR=CustomerName}',
                    WordName: 'BM-C005.1--Hop-dong-thue TB.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: 'MAU11',
                    Name: 'Phụ lục hợp đồng',
                    FileName: 'Phụ lục hợp đồng - {EXPR=ProductName} - {EXPR=CustomerName}',
                    WordName: 'BM-C009-Rev00--Phu-Luc-Hop-Dong.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: 'MAU12',
                    Name: 'WorkFlow',
                    FileName: 'WorkFlow HĐ,PLHĐ - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}',
                    WordName: 'WorkFlow_HD.docx',
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
            header: 'Nội dung hợp đồng',
            binding: 'Description',
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
        // {
        //     header: 'Ngày hoàn thiện duyệt',
        //     binding: 'FinishDate',
        //     width: 180,
        //     dataType: 'Date',
        //     format: 'dd/MM/yyyy'
        // },
        {
            header: 'Giá trị HĐ (chưa VAT)',
            binding: 'ContractValue',
            width: 180,
            dataType: 'Number'
        },
        {
            header: 'Giá trị PLHĐ (chưa VAT)',
            binding: 'SubContractValue',
            width: 180,
            dataType: 'Number'
        },
        {
            header: 'Đã gửi duyệt',
            binding: 'ApproveSend',
            width: 150,
            dataType: 'Boolean'
        },
        // {
        //     header: 'Hoàn thiện duyệt',
        //     binding: 'CompletedApprove',
        //     width: 100,
        //     dataType: 'Boolean'
        // },
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
        // {
        //     header: 'Số quyết toán',
        //     binding: 'DocNo_C5',
        //     width: 200,
        //     dataType: 'String'
        // },
        {
            header: 'Gói thầu/ PB',
            binding: 'ProductName',
            width: 0,
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
            header: 'Mã Ct',
            binding: 'DocCode',
            width: 0
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
            width: 150
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
        }
    ]
}

export class LayoutRegContractEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'C3',
                    DocStatus: '4',
                    BizDocId: '',
                    CurrencyCode: 'VND',
                    ExchangeRate: '1',
                    Id: -1,
                    IsWebData: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocPayment_EditWeb',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        EstimatedPaymentDate: 'Parent.DocDate'
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
                },
                {
                    Name: 'vB30BizDocContactInfo_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },      
                {
                    Name: 'vB30BizDocAtchDoc',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',

                    }
                },       
                {
                    Name: 'vB20BizDocDiscount',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1'

                    }
                }          
            ]
        },
        PrintDocument: {
            Key: 'WorkFlow',
            Text: 'Cover workflow - {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_B30BizDoc_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [],
            PrintGrid: [ //không dùng đến
                {
                    header: 'STT',
                    binding: 'BuiltinOrder',
                    width: 50,
                    dataType: 'Number',
                    align: 'center'
                },
                // {
                //     header: 'Tên file',
                //     binding: 'FilePath',
                //     width: 600,
                //     dataType: 'String',
                //     align: 'left'
                // }
            ]
        }
    }

    evaluators = {
        'Evaluator_ValueOfWarranty_Caculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'ValueOfWarranty',
            Value: 'Math.round(ContractValueAddVAT*PercentOfWarranty)'
        },
        'Evaluator_ContractValueAddVAT_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'ContractValueAddVAT',
            Value: 'Math.round(ContractValue+(ContractValue*TaxRate))',
            zExpr: "TaxCode != 'V10D'"
        },
        'Evaluator_ContractValueAddVAT_Calculator_Custom': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'ContractValueAddVAT',
            Value: 'Math.round(ContractValue+(ContractValue*TaxRate))',
            zExpr: "TaxCode == 'V10D' && ContractValue ==''"
        },
        'Evaluator_TotalOfValue_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'TotalOfValue',
            Value: 'SubContractValue+SubContractBeforeValue+ContractValue'
        },
        'Evaluator_TotalOfValueAddVAT_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'TotalOfValueAddVAT',
            Value: 'Math.round(TotalOfValue+(TotalOfValue*TaxRate))'
        },
        'Evaluator_Set_GuaranteePercent_1': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'GuaranteePercent',
            Value: "GuaranteeCheck == 1 ? PayPercent : 0",
            Tables: 0
        },
        'Evaluator_Set_OriginalAmount': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'OriginalAmount',
            Value: "CheckVAT == 1 ? Math.round(PayPercent*ContractValue_BindingWeb) : Math.round(PayPercent*ContractValueAddVAT_BindingWeb)",
            Tables: 0
        },
        'Evaluator_ContractValue_Reset': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'ContractValue',
            Value: "ValueByConstructReal == 1 ? 0 : ContractValue"
        },

        //
        'Evaluator_Set_ContractValue_BindingWeb_FromParent': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'ContractValue_BindingWeb',
            Value: 'ContractValue',
            Tables: 0
        },
        'Evaluator_Set_ContractValueAddVAT_BindingWeb_FromParent': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'ContractValueAddVAT_BindingWeb',
            Value: 'ContractValueAddVAT',
            Tables: 0
        },
        //        
        'Evaluator_ServerConstraint_CTC_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ParentBizDocId,ProductCostId,ContractType,DocCode,{VAR=Branch.Ma_Dvcs},DocDate,Id',
            Command: 'ufn_Coteccons_B30BizDoc_DefaultDocNo_New',
            DataMember: 'DocNo',
            zExpr: "ProductCostId != '' && ContractType != ''"
        },
        'Evaluator_ServerConstraint_GetActivityCode_FromJobCode': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'JobCode',
            Command: 'usp_Coteccons_GetActivityCode_FromJobCode',
            DataMember: 'ActivityCode'
        },
        'Evaluator_ServerConstraint_B30BizDoc_Check_Unique_DocNo': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},BizDocId,DocCode,DocNo',
            Command: 'ufn_B30BizDoc_CheckUniqueDocNo',
            zExpr: "DocNo != ''",
            MessageText: 'Số hợp đồng/PLHĐ đã tồn tại',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_DocDateWithDateOfProduct': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,DocDate',
            Command: 'ufn_Coteccons_CheckDateOfContract',
            zExpr: "ProductCostId != ''",
            MessageText: 'Ngày lập hồ sơ phải sau ngày bắt đầu của gói thầu',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_BizDocPayment_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ContractType,{VAR=Branch.Ma_Dvcs},BizDocId_PL,TaxRate',
            Command: 'usp_Web_B30BizDocPayment_GetData',
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_DocumentDetail_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ContractType,{VAR=Branch.Ma_Dvcs},{VAR=IsGetPayment_False},DocCode',
            Command: 'usp_Web_B30BizDocDocument_GetData2',
            OutputTable: 1
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,{VAR=EmptyField_ParentBizDocId}',
            Command: 'usp_B30BizDocApprove_GetData_Bak',
            OutputTable: 2
        },
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'BizDocId,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Conteccons_NotChangeWhenApproveSent',
            MessageText: 'Không được thay đổi khi đã gửi duyệt',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_GiaTriHDPLHD_PL': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "BizDocId_PL,BizDocId",
            Command: 'ufn_Newtecons_CheckGiaTriBangKhoiLuong',
            MessageText: 'Giá trị chinh không khớp với bảng phụ lục. Vui lòng chọn lại bảng phụ lục!!',
            IgnoreError: 0,
            zExpr: "ApproveSend == true"
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
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend_SongSong',
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerUpdated_UpdateValueOfC3C4': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,Id,DocCode,BizDocId_PL,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_UpdateValueOfC3C4',
            //zExpr: ""'BizDocId_PL != ''"
        },
        'Evaluator_ServerConstraint_Check_GiaTriHDPLHD_BCTC': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,BizDocId,ParentBizDocId,JobCode,CustomerCode,ContractValue,SubContractValue,TaxRate,DocDate,ValueByConstructReal,CCMBudgetRowId,{VAR=Branch.Ma_Dvcs}",
            Command: 'ufn_Coteccons_HDPLHD_CheckGiaTri_BCTC',
            MessageText: 'Giá trị Hợp đồng + PLHĐ đã vượt quá hạn mức Kế hoạch doanh thu, chi phí - Liên hệ CHT cập nhật',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerConstraint_Check_GiaTriHDPLHD_KHKK': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,BizDocId,ParentBizDocId,JobCode,CustomerCode,ContractValue,SubContractValue,TaxRate,DocDate,ValueByConstructReal,CCMBudgetRowId,{VAR=Branch.Ma_Dvcs}",
            Command: 'ufn_Coteccons_HDPLHD_CheckGiaTri_KHKK',
            MessageText: 'Giá trị Hợp đồng + PLHĐ đã vượt quá hạn mức Kế hoạch ký kết Hợp đồng - Liên hệ QS cập nhật',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerConstraint_ResetInfo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'CustomerCode,BizDocId',
            Command: 'usp_Newtecons_ResetValue',
            DataMember: 'CusBankAccountNo,CusBankName'
        },
        'Evaluator_ServerUpdated_UpdateCCMBudget': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,CCMBudgetRowId',
            Command: 'usp_UpdateB30CCMBudget_FromB30BizDoc'
        },
        'Evaluator_InsertApprove_WhenSaved': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,DocCode',
            Command: 'usp_SOL_InsertApprove_WhenSaved',
            // zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerConstraint_Check_PLHD': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ParentBizDocId,ProductCostId,DocCode",
            Command: 'ufn_Coteccons_CheckBizDocPL_C5',
            MessageText: 'Đã tồn tại Quyết toán đang trình duyệt. Không được up HĐ/PLHĐ !!!',
            IgnoreError: 0,
            zExpr: "ApproveSend == true"
        },
        'Evaluator_ServerConstraint_Check_LinkDuTru': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,DocCode,BizDocId",
            Command: 'ufn_Check_LinkDuTru',
            MessageText: 'Chưa chọn Giá trị dự trù link với BCTC/KHKKHD. Vui lòng link trước khi gửi duyệt !!!',
            IgnoreError: 0,
            zExpr: "ApproveSend == true"
        },
        'Evaluator_ServerConstraint_Check_BlockBill': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,{VAR=User.Id}",
            Command: 'ufn_Coteccons_BillThanhToan_BlockBill',
            MessageText: 'Dự án tạm ngừng up hợp đồng. Liên hệ phòng KSCP.',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
    }

    serverConstraint = [
        'Evaluator_ServerConstraint_CTC_DefaultDocNo',
        'Evaluator_ServerConstraint_GetActivityCode_FromJobCode'
    ]

    serverUpdating: string[] = [
        'Evaluator_ServerConstraint_B30BizDoc_Check_Unique_DocNo',
        'Evaluator_ServerConstraint_Check_DocDateWithDateOfProduct',
        'Evaluator_ServerConstraint_Check_GiaTriHDPLHD_BCTC',
        'Evaluator_ServerConstraint_Check_GiaTriHDPLHD_KHKK',
        'Evaluator_ServerConstraint_Check_GiaTriHDPLHD_PL',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_PLHD',
        // 'Evaluator_ServerConstraint_Check_BlockBill',
        'Evaluator_ServerConstraint_Check_LinkDuTru'
    ]

    serverUpdated: string[] = [
        'Evaluator_InsertApprove_WhenSaved',
        'Evaluator_UpdateInfo_WhenApproveSend',
        'Evaluator_ServerUpdated_UpdateValueOfC3C4',
         'Evaluator_ServerUpdated_UpdateCCMBudget'
    ]

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_B30BizDoc_Check_Unique_DocNo',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        //
        'Evaluator_ServerConstraint_BizDocPayment_GetData',
        'Evaluator_ServerConstraint_DocumentDetail_GetData',
        'Evaluator_ServerConstraint_Approve_GetData'
    ]

    buttonCommand: string[] = [

    ]

    columnChanged = {
        // TaxCode: {
        //     Evaluators: [
        //         'Evaluator_ContractValueAddVAT_Calculator',
        //     ]
        // },
        ContractValue: {
            Evaluators: [
                // 'Evaluator_ContractValueAddVAT_Calculator',
                'Evaluator_Set_ContractValue_BindingWeb_FromParent'
            ]
        },
        ContractValueAddVAT: {
            Evaluators: [
                'Evaluator_Set_ContractValueAddVAT_BindingWeb_FromParent',
                'Evaluator_ValueOfWarranty_Caculator'
            ]
        },
        PercentOfWarranty: {
            Evaluators: [
                'Evaluator_ValueOfWarranty_Caculator'
            ]
        },
        ValueByConstructReal: {
            Evaluators: [
                // 'Evaluator_ContractValue_Reset'
            ]
        },
        ProcessCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_Approve_GetData'
            ]
        },
        ContractType: {
            Evaluators: [
                'Evaluator_ServerConstraint_DocumentDetail_GetData'
            ]
        },
        CustomerCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_ResetInfo'
            ]
        }
        // JobCode: {
        //     Evaluators: [
        //         'Evaluator_ServerConstraint_GetActivityCode_FromJobCode'
        //     ]
        // }
    };

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
                GuaranteeCheck: {
                    Evaluators: [
                        'Evaluator_Set_GuaranteePercent_1'
                    ]
                },
                PayPercent: {
                    Evaluators: [
                        'Evaluator_Set_OriginalAmount',
                        'Evaluator_Set_GuaranteePercent_1'
                    ]
                },
                CheckVAT: {
                    Evaluators: [
                        'Evaluator_Set_OriginalAmount'
                    ]
                },
                ContractValue_BindingWeb: {
                    Evaluators: [
                        'Evaluator_Set_OriginalAmount'
                    ]
                },
                ContractValueAddVAT_BindingWeb: {
                    Evaluators: [
                        'Evaluator_Set_OriginalAmount'
                    ]
                }
            }
        }
    ];

    columnsReadOnly = [];

    linkReporter = {
        'btnPhuLucA': {
            directory: 'unitprice',
            type: 'detail',//bao cao: view, explorer: index, editor: detail
            key: 'Id_PLA',
            parameter: { 'Commandkey': 'unitprice-editor', 'ProductCostId': '{EXPR=ProductCostId}', 'TaskId': '{EXPR=TaskId}', 'ParentBizDocId': '{EXPR=BizDocId}', 'DocDate': '{EXPR=DocDate}', 'CustomerCode': '{EXPR=CustomerCode}', 'TaxCode': '{EXPR=TaxCode}', 'TaxRate': '{EXPR=TaxRate}', 'ParentId': '{EXPR=Id}' }
        },
        'btnTaskId': {
            directory: 'investtask',
            type: 'detail',//bao cao: view, explorer: index, editor: detail
            key: 'Id_Task',
            parameter: { 'Commandkey': 'investtask-editor', 'ProductCostId': '{EXPR=ProductCostId}', 'DocDate': '{EXPR=DocDate}'}
        }
    };

    panels: PanelBase[] = [
        new TablePanel({
            label: 'Panel 1',
            col: 12,
            controls: [
                // new LookupBoxInput({
                //     key: 'DocCode',
                //     label: 'Loại trình ký',
                //     lookupKey: 'DmCt',
                //     lookupfilter: "Ma_Ct IN ('C3','C4')",
                //     validators: [Validators.required],
                //     hideValueMember: false,
                //     isReadOnly: 'true',
                //     col: 12
                // }, this.srv, this.parentData),
                
                new DateBoxInput({
                    key: 'DocDate',
                    label: 'Ngày lập',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isDisabled: 'true'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số hợp đồng',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                // new DateBoxInput({
                //     key: 'SignDate',
                //     label: 'Ngày ký',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     // validators: [Validators.required],
                //     col: 6
                // }),
                new TextBoxInput({
                    key: 'LastDocNo',
                    label: 'Số HĐ tay (nếu có)',
                    type: 'text',
                    //validators: [Validators.required],
                    col: 6,
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    binding: {
                        ProductType: 'ProductType'
                    },
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId0',
                    label: 'Gói thầu thanh toán',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN ('1','3') AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    col: 12,
                    visible: "'{EXPR=ProductType}' == '3'"
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12
                }),
                new MultiSelectInput({
                    key: 'ActivityCode',
                    label: 'Lĩnh vực',
                    lookupKey: 'Activity',
                    hideValueMember: false,
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    validators: [Validators.required],
                    isDisabled: 'true',
                    col: 6
                }, this.srv),
                new LookupBoxInput({
                    key: 'ContractType',
                    label: 'Loại hợp đồng',
                    validators: [Validators.required],
                    binding: {
                        TaxCode: 'TaxCode'
                    },
                    lookupKey: 'ContractType',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND Code NOT IN ('HD-18','HD-17','BP.HD-01','BP.HD-02','BP.HD-03','BP.HD-04')",
                    style: 'background-color:#F8F0D7',
                    hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),
                new MultiSelectInput({
                    key: 'JobCode',
                    label: 'Công việc',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    //lookupfilter: "'{EXPR=ActivityCode}'='' OR ActivityCode IN (SELECT Val FROM dbo.ufn_sys_SplitString('{EXPR=ActivityCode}',','))",
                    lookupKey: 'Job',
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 6
                }, this.srv),
                new CheckBoxInput({
                    key: 'IsSubContractPay',
                    label: 'CT được TT theo HĐNT',
                    col: 6,
                    visible: "'{EXPR=ContractType}' == 'HD-14' || '{EXPR=ContractType}' == 'HD-08'"
                }),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Đối tác',
                    validators: [Validators.required],
                    lookupKey: 'Customer_CCM2',
                    lookupfilter: "(('{EXPR=ProductType}'=3 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%') OR Code IN (SELECT Code FROM dbo.ufn_Coteccons_Filter_CustomerCode('{EXPR=ProductCostId}','{EXPR=DocDate}','{EXPR=DocCode}','{VAR=Branch.Ma_Dvcs}')))",
                    hideValueMember: false,
                    binding: {
                        Name: 'CustomerName',
                        Address: 'Address',
                        Person: 'ContactPerson'
                    },
                    col: 6
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Address',
                    label: 'Địa chỉ',
                    type: 'text',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'ContactPerson',
                    label: 'Đại diện ký HĐ',
                    type: 'text',
                    validators: [Validators.required],
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
                    key: 'CusBankAccountNo',
                    label: 'Tài khoản',
                    lookupKey: 'CustomerBankAccount',
                    lookupfilter: "CustomerCode='{EXPR=CustomerCode}'",
                    hideValueMember: false,
                    validators: [Validators.required],
                    binding: {
                        Description: 'CusBankName'
                    },
                    col: 6
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'CusBankName',
                    label: 'Ngân hàng',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'CurrencyCode',
                    label: 'Mã tiền tệ',
                    lookupKey: 'Currency',
                    lookupfilter: "IsActive=1 AND IsGroup=0",
                    hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),
                new ButtonInput({
                    key: 'btnPhuLucA',
                    label: 'Bảng đơn giá, khối lượng',
                    col: 6,
                    style: 'margin-bottom:2px;',
                    isDisabled: "'{EXPR=Id}' < 0"
                }),
                new LookupBoxInput({
                    key: 'BizDocId_PL',
                    label: 'Phụ lục, Khối lượng',
                    lookupKey: 'BizDocCCM',
                    lookupfilter: "IsActive=1 AND DocCode = 'PL' AND CustomerCode='{EXPR=CustomerCode}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=BizDocId}'",
                    binding: {
                        OriginalAmount: 'ContractValue',
                        TotalOriginalAmount: 'ContractValueAddVAT',
                        Id: 'Id_PLA'
                    },
                    col: 6,
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                    isDisabled: "'{EXPR=Id}' < 0",
                    hideValueMember: true
                }, this.srv, this.parentData),

                new NumberBoxInput({
                    key: 'ContractValue',
                    label: 'Giá trị HĐ (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new CheckBoxInput({
                    key: 'ValueByConstructReal',
                    label: 'GTHĐ theo t. tế thi công',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'TaxCode',
                    label: 'Thuế',
                    lookupKey: 'Tax',
                    hideValueMember: false,
                    lookupfilter: "Type=1 AND IsActive=1 AND IsGroup=0 AND IsDefault = 1",
                    binding: {
                        Rate: 'TaxRate'
                    },
                    col: 6
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'ContractValueAddVAT',
                    label: 'Giá trị HĐ (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: "{EXPR=TaxCode} != 'V10D'",
                }),
                new NumberBoxInput({
                    key: 'PercentOfWarranty',
                    label: '% bảo hành',
                    type: 'number',
                    format: 'P2',
                    min: 0,
                    max: 1,
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'ValueOfWarranty',
                    label: 'GT bảo hành (có VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'DayOfWarranty',
                    label: 'Thời hạn bảo hành (tháng)',
                    type: 'number',
                    col: 6,
                }),
                new LookupBoxInput({
                    key: 'BizDocId_GT',
                    label: 'Phiếu giao thầu, giao việc',
                    lookupKey: 'BizDoc_CTC',
                    binding: {
                    },
                    // validators: [Validators.required],
                    lookupfilter: "DocCode = 'C3' AND ProductCostId='{EXPR=ProductCostId}' AND Closed = 0 AND CompletedApprove=1 AND IsActive=1 AND DocDate <= '{EXPR=DocDate}' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ContractType IN ('HD-21','HD-15')",
                    hideValueMember: true,
                    col: 6,
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Remark',
                    label: 'Ghi chú',
                    type: 'text',
                    col: 12
                }),
                // new LookupBoxInput({
                //     key: 'CustomerCode2',
                //     label: 'Đội thi công (LLTC)',
                //     lookupKey: 'BuildTeam',
                //     lookupfilter: "(CustomerCode='{EXPR=CustomerCode}' AND IsGroup=0 AND IsActive=1)",
                //     hideValueMember: false,
                //     binding: {
                //     },
                //     col: 6
                // }, this.srv, this.parentData), 
                new LookupBoxInput({
                    key: 'ClassCode1',
                    label: 'TT back theo CĐT',
                    lookupKey: 'Class',
                    lookupfilter: "IsActive=1 AND ParentCode='DT_CDT_CD'",
                    hideValueMember: false,
                    col: 6,
                    validators: [Validators.required]
                }, this.srv, this.parentData),   
                new CheckBoxInput({
                    key: 'InvestorPartner',
                    label: 'Đối tác do CĐT chỉ định/ giới thiệu',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'TransType',
                    label: 'Bao thanh toán',
                    lookupKey: 'Class',
                    validators: [Validators.required],
                    lookupfilter: "IsActive=1 AND ParentCode='LOAITT'",
                    hideValueMember: false,
                    col: 6,
                    
                }, this.srv, this.parentData),   
                new CheckBoxInput({
                    key: 'IsFixPrice',
                    label: 'Hợp đồng quản lý khối lượng',
                    col: 6,
                    isNewRow: true
                }),
              
               
                new CheckBoxInput({
                    key: 'IsDiscount',
                    label: 'Hợp đồng có chiết khấu',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive = 1 AND ParentId = 229 AND IsGroup = 0 AND DocStatus > 1",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
                new ButtonInput({
                    key: 'btnTaskId',
                    label: 'Xem tờ trình',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'TaskId',
                    label: 'Tờ trình',
                    lookupKey: 'Task',
                    lookupfilter: "IsActive=1 AND CompletedApprove=1",
                    hideValueMember: false,
                    binding: {
                        Id: 'Id_Task'
                    },
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                    col: 6
                }, this.srv, this.parentData),   
                new LookupBoxInput({
                    key: 'CCMBudgetRowId',
                    label: 'Giá trị dự trù',
                    lookupKey: 'CCMBudgetRowId',
                    lookupfilter: "ProductCostId='{EXPR=ProductCostId}' AND CustomerCode='{EXPR=CustomerCode}'",
                    hideValueMember: false,
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                    col: 12
                }, this.srv, this.parentData),                           
                // new LookupBoxInput({
                //     key: 'DeptCode',
                //     label: 'Bộ phận xử lý',
                //     lookupKey: 'Dept',
                //     lookupfilter: "IsActive=1 AND IsGroup=0 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                //     hideValueMember: false,
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }, this.srv, this.parentData),
                // new DateBoxInput({
                //     key: 'HandoverDate',
                //     label: 'Ngày nhận',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }),
                // new DateBoxInput({
                //     key: 'ToDate',
                //     label: 'Từ ngày',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }),
                // new DateBoxInput({
                //     key: 'FromDate',
                //     label: 'Đến ngày',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }),
                // new LookupBoxInput({
                //     key: 'UploadFile',
                //     label: 'Trình ký file cứng',
                //     lookupKey: 'Class',
                //     lookupfilter: "ParentCode='UploadFile'",
                //     hideValueMember: false,
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }, this.srv, this.parentData),
                // new MultiSelectInput({
                //     key: 'Phan_Phoi',
                //     label: 'Phân phối',
                //     lookupKey: 'Class',
                //     lookupfilter: "ParentCode='PhanPhoi'",
                //     hideValueMember: false,
                //     col: 6,
                //     isDisabled: 'true'
                // }, this.srv),
                // new DateBoxInput({
                //     key: 'Ngay_Phan_Phoi',
                //     label: 'Ngày phân phối',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }),
                // new DateBoxInput({
                //     key: 'ConfirmedDate',
                //     label: 'Ngày ký',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'ExchangeRate',
                    label: 'Tỷ giá (tạm tính)',
                    type: 'number',
                    col: 6
                }),
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'File HĐ đã ký',
                //     col: 6,
                //     isOnlyDownload: true
                // }, this.srv)
            ]
        })
    ];

    childColumns = [
        {
            header: 'Phương thức',
            binding: 'ClassCode1',
            width: 70,
            dataType: 'Array',
            lookupKey: 'Class',
            bindingList: {
                Name: 'Description'
            },
            lookupfilter: "ParentCode='PaymentType' AND Code IN ('00','01','01A','02','03','03A','04','05','06')"
        },
        {
            header: 'Diễn giải',
            binding: 'Description',
            allowEditing: false,
            width: 300
        },
        {
            header: 'Tỉ lệ (%)',
            binding: 'PayPercent',
            dataType: 'Number',
            width: 70,
            min: 0,
            max: 1,
            format: 'P2'
        },
        {
            header: 'Trước VAT',
            binding: 'CheckVAT',
            dataType: 'Boolean',
            width: 50
        },
        {
            header: 'Giá trị',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 150
        },
        {
            header: 'Thời hạn (ngày)',
            binding: 'NumberOfDay',
            dataType: 'Number',
            width: 150
        },
        {
            header: 'Bảo lãnh',
            binding: 'GuaranteeCheck',
            dataType: 'Boolean',
            width: 50
        },
        {
            header: '% bảo lãnh',
            binding: 'GuaranteePercent',
            dataType: 'Number',
            width: 100,
            format: 'P2'
        },
        {
            header: 'ContractValue',
            binding: 'ContractValue_BindingWeb',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 0
        },
        {
            header: 'ContractValueAddVAT',
            binding: 'ContractValueAddVAT_BindingWeb',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 0
        }
    ]

    childColumns1 = [
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
        },
        
       
    ]

    childColumns2 = [
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

    childColumns3 = [
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
            width: 150
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

    childColumns4 = [
        {
            header: 'Tên người liên lạc',
            binding: 'ContactName',
            width: 200,
            validators: "{EXPR=ContactName} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Chức vụ',
            binding: 'JobTitleName',
            width: 200,
            validators: "{EXPR=JobTitleName} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Số điện thoại',
            binding: 'PhoneNo',
            width: 150,
            validators: "{EXPR=PhoneNo} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Địa chỉ Email',
            binding: 'Email',
            width: 200,
            validators: "{EXPR=Email} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Địa chỉ liên lạc',
            binding: 'Address',
            width: 300,
            validators: "{EXPR=Address} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        } ,
        {
            header: 'Nhận thông báo thanh toán',
            binding: 'IsNotification',
            dataType: 'Boolean',
            width: 80
        },    
    ]    
   
    childColumns5 = [
      
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
          
            //exprReadOnly: "{EXPR=Attached} == true && {EXPR=Description} != ''"
        }
    ]

    childColumns6 = [
        {
            header: 'Doanh thu từ',
            binding: 'FromAmount',
            dataType: 'Number',
            width: 150
        },
        {
            header: 'Doanh thu đến',
            binding: 'ToAmount',
            dataType: 'Number',
            width: 150
        },
        {
            header: '% chiết khấu',
            binding: 'DiscountRate',
            dataType: 'Number',
            width: 100,
            format: 'P2'
        },
        {
            header: 'Ghi chú',
            binding: 'Description',
            width: 250
        }
    ]
}

export class LayoutRegAppendixEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'C4',
                    BizDocId: '',
                    DocStatus: '4',
                    CurrencyCode: 'VND',
                    ExchangeRate: '1',
                    Id: -1,
                    IsWebData: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocPayment_EditWeb',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        EstimatedPaymentDate: 'Parent.DocDate'
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
                {
                    Name: 'vB30BizDocApprove_AEditContract',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BranchCode: '{VAR=Branch.Ma_Dvcs}',
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
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
                    Name: 'vB30BizDocContactInfo_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                } ,
                {
                    Name: 'vB30BizDocVBDetail_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    }
                }  ,
                 {
            Name: 'vB30BizDocAtchDoc',
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
            Key: 'WorkFlow',
            Text: 'Cover workflow - {VAR=TenGoiThau} - {VAR=CustomerName}',
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
        'Evaluator_SubContractValue0_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'SubContractValue0',
            Value: 'SubContractValue'
        },
        'Evaluator_ValueOfWarranty_Caculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'ValueOfWarranty',
            Value: 'Math.round(ContractValueAddVAT*PercentOfWarranty)'
        },
        'Evaluator_ContractValueAddVAT_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'ContractValueAddVAT',
            Value: 'Math.round(ContractValue+(ContractValue*TaxRate))'
        },
        'Evaluator_TotalOfValue_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'TotalOfValue',
            Value: 'SubContractValue + SubContractBeforeValue + ContractValue'
        },
        'Evaluator_TotalOfValueAddVAT_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'TotalOfValueAddVAT',
            Value: 'ContractValueAddVAT+AriseValue+SubContractBeforeValueAddVAT'
        },
        'Evaluator_Set_GuaranteePercent_1': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'GuaranteePercent',
            Value: 'GuaranteeCheck == 1 ? PayPercent : 0',
            Tables: 0
        },
        'Evaluator_Set_OriginalAmount_PL': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'OriginalAmount',
            Value: "CheckVAT=1 ? Math.round(PayPercent*TotalOfValue_BindingWeb) : Math.round(PayPercent*TotalOfValueAddVAT_BindingWeb)",
            Tables: 0
        },
        'Evaluator_SubContractValue_Reset': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: 'SubContractValue',
            Value: "ValueByConstructReal == 1 ? 0 : 0"
        },
        //
        'Evaluator_Set_TotalOfValue_BindingWeb_FromParent': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'TotalOfValue_BindingWeb',
            Value: 'TotalOfValue',
            Tables: 0
        },
        'Evaluator_Set_TotalOfValueAddVAT_BindingWeb_FromParent': {
            EvaluatorName: 'EvaluatorBindingChild',
            DataMember: 'TotalOfValueAddVAT_BindingWeb',
            Value: 'TotalOfValueAddVAT',
            Tables: 0
        },

        'Evaluator_ServerConstraint_CTC_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ParentBizDocId,ProductCostId,ContractType,DocCode,{VAR=Branch.Ma_Dvcs},DocDate,Id',
            Command: 'ufn_Coteccons_B30BizDoc_DefaultDocNo_New',
            DataMember: 'DocNo',
            zExpr: "ParentBizDocId != '' && ProductCostId != '' && ContractType != ''"
        },
        'Evaluator_ServerConstraint_GetActivityCode_FromJobCode': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'JobCode',
            Command: 'usp_Coteccons_GetActivityCode_FromJobCode',
            DataMember: 'ActivityCode'
        },
        'Evaluator_ServerConstraint_B30BizDoc_Check_Unique_DocNo': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},BizDocId,DocCode,DocNo',
            Command: 'ufn_B30BizDoc_CheckUniqueDocNo',
            MessageText: 'Số hợp đồng/PLHĐ đã tồn tại',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_DocDateWithDateOfProduct': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,DocDate',
            Command: 'ufn_Coteccons_CheckDateOfContract',
            zExpr: "ProductCostId != ''",
            MessageText: 'Ngày lập hồ sơ phải sau ngày bắt đầu của gói thầu',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_BizDocPayment_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ContractType,{VAR=Branch.Ma_Dvcs},BizDocId_PL,TaxRate,AdjustedPay',
            Command: 'usp_Web_B30BizDocPayment_GetData',
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_DocumentDetail_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ContractType,{VAR=Branch.Ma_Dvcs},{VAR=IsGetPayment_False},DocCode',
            Command: 'usp_Web_B30BizDocDocument_GetData2',
            OutputTable: 1
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,ParentBizDocId',
            Command: 'usp_B30BizDocApprove_GetData_Bak',
            OutputTable: 2
        },
        'Evaluator_ServerConstraint_Check_PLHD_KhongLapMoiKhiChuaDuyetCu': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ProductCostId,ParentBizDocId,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_PLHD_KhongLapMoiKhiChuaDuyetCu',
            zExpr: "Id < 0",
            MessageText: 'Không thể lập mới khi chưa hoàn thiện duyệt PLHĐ trước',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'BizDocId,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Conteccons_NotChangeWhenApproveSent',
            MessageText: 'Không được thay đổi khi đã gửi duyệt',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_SubContractBeforeValue': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,ParentBizDocId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_C4_GiaTriPhuLucTruoc',
            DataMember: 'SubContractBeforeValue,SubContractBeforeValueAddVAT'
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
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend_SongSong',
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerUpdated_UpdateValueOfC3C4': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,Id,DocCode,BizDocId_PL,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_UpdateValueOfC3C4',
            //zExpr: ""'BizDocId_PL != ''"
        },
        'Evaluator_ServerConstraint_Check_GiaTriHDPLHD_BCTC': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,BizDocId,ParentBizDocId,JobCode,CustomerCode,ContractValue,SubContractValue,TaxRate,DocDate,ValueByConstructReal,CCMBudgetRowId,{VAR=Branch.Ma_Dvcs}",
            Command: 'ufn_Coteccons_HDPLHD_CheckGiaTri_BCTC',
            MessageText: 'Giá trị Hợp đồng + PLHĐ đã vượt quá hạn mức Kế hoạch doanh thu, chi phí - Liên hệ CHT cập nhật',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerConstraint_Check_LinkDuTru': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,BizDocId",
            Command: 'ufn_Coteccons_HDPLHD_Check_LinkDuTru',
            MessageText: 'Hợp đồng chưa được dự trù trong BCTC hoặc KHKK. Yêu cầu nhập vào giá trị dự trù !!!',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerConstraint_Check_GiaTriHDPLHD_PL': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "BizDocId_PL,BizDocId",
            Command: 'ufn_Newtecons_CheckGiaTriBangKhoiLuong',
            MessageText: 'Giá trị chính không khớp với bảng phụ lục. Vui lòng chọn lại bảng phụ lục!!',
            IgnoreError: 0,
            zExpr: "ApproveSend == true"
        },
        'Evaluator_ServerConstraint_Check_GiaTriHDPLHD_KHKK': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,BizDocId,ParentBizDocId,JobCode,CustomerCode,ContractValue,SubContractValue,TaxRate,DocDate,ValueByConstructReal,CCMBudgetRowId,{VAR=Branch.Ma_Dvcs}",
            Command: 'ufn_Coteccons_HDPLHD_CheckGiaTri_KHKK',
            MessageText: 'Giá trị Hợp đồng + PLHĐ đã vượt quá hạn mức Kế hoạch ký kết Hợp đồng - Liên hệ QS cập nhật',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_InsertApprove_WhenSaved': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,DocCode',
            Command: 'usp_SOL_InsertApprove_WhenSaved',
            // zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerConstraint_Check_PLHD': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ParentBizDocId,ProductCostId,DocCode",
            Command: 'ufn_Coteccons_CheckBizDocPL_C5',
            MessageText: 'Đã tồn tại Quyết toán đang trình duyệt. Không được up quyết toán !!!',
            IgnoreError: 0,
            zExpr: "ApproveSend == true"
        },
        'Evaluator_ServerConstraint_PLHDExists_Settlement': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'ParentBizDocId,{VAR=Branch.Ma_Dvcs},Id',
            Command: 'ufn_Coteccons_PLHD_CheckTonTaiQuyetToan',
            MessageText: 'Không thể lập PLHĐ cho hợp đồng đã lập quyết toán',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Check_BlockBill': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: "ProductCostId,{VAR=User.Id}",
            Command: 'ufn_Coteccons_BillThanhToan_BlockBill',
            MessageText: 'Dự án tạm ngừng up PLHĐ. Liên hệ phòng KSCP.',
            IgnoreError: 0,
            zExpr: 'ApproveSend == true'
        },
    }

    serverConstraint = [
        'Evaluator_ServerConstraint_CTC_DefaultDocNo',
        'Evaluator_ServerConstraint_SubContractBeforeValue',
        'Evaluator_ServerConstraint_GetActivityCode_FromJobCode'
    ]

    serverUpdating: string[] = [
        'Evaluator_ServerConstraint_B30BizDoc_Check_Unique_DocNo',
        'Evaluator_ServerConstraint_PLHDExists_Settlement',
        'Evaluator_ServerConstraint_Check_DocDateWithDateOfProduct',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_GiaTriHDPLHD_BCTC',
        'Evaluator_ServerConstraint_Check_GiaTriHDPLHD_KHKK',
        'Evaluator_ServerConstraint_Check_GiaTriHDPLHD_PL',
        // 'Evaluator_ServerConstraint_Check_BlockBill',
        'Evaluator_ServerConstraint_Check_PLHD_KhongLapMoiKhiChuaDuyetCu',
        'Evaluator_ServerConstraint_Check_PLHD'
    ]

    serverUpdated: string[] = [
        'Evaluator_InsertApprove_WhenSaved',
        'Evaluator_UpdateInfo_WhenApproveSend',
        'Evaluator_ServerUpdated_UpdateValueOfC3C4'
    ]

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_B30BizDoc_Check_Unique_DocNo',
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange',
        'Evaluator_ServerConstraint_Check_LinkDuTru',
        'Evaluator_ServerConstraint_Check_PLHD_KhongLapMoiKhiChuaDuyetCu',
        //
        'Evaluator_ServerConstraint_DocumentDetail_GetData',
        'Evaluator_ServerConstraint_Approve_GetData'
    ];

    buttonCommand: string[] = [

    ]

    columnChanged = {
        TaxCode: {
            Evaluators: [
                'Evaluator_TotalOfValueAddVAT_Calculator'
            ]
        },
        TaxRate: {
            Evaluators: [
                'Evaluator_TotalOfValueAddVAT_Calculator'
            ]
        },
        ContractValue: {
            Evaluators: [
                'Evaluator_TotalOfValue_Calculator'
            ]
        },
        // SubContractValue0: {
        //     Evaluators: [
        //         'Evaluator_SubContractValue_Calculator'
        //     ]
        // },
        SubContractValue: {
            Evaluators: [
                'Evaluator_TotalOfValue_Calculator',
                'Evaluator_SubContractValue0_Calculator'
            ]
        },
        SubContractBeforeValue: {
            Evaluators: [
                'Evaluator_TotalOfValue_Calculator'
            ]
        },
        TotalOfValue: {
            Evaluators: [
                'Evaluator_TotalOfValueAddVAT_Calculator',
                // 'Evaluator_Set_TotalOfValue_BindingWeb_FromParent'
            ]
        },
        // TotalOfValueAddVAT: {
        //     Evaluators: [
        //         // 'Evaluator_Set_TotalOfValueAddVAT_BindingWeb_FromParent'
        //     ]
        // },
        ValueByConstructReal: {
            // Evaluators: [
            //     // 'Evaluator_SubContractValue_Reset'
            // ]
        },
        AdjustedPay: {
            Evaluators: [
                'Evaluator_ServerConstraint_BizDocPayment_GetData'
            ]
        },
        ProcessCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_Approve_GetData'
            ]
        },
        ContractType: {
            Evaluators: [
                'Evaluator_ServerConstraint_DocumentDetail_GetData'
            ]
        }
        // JobCode: {
        //     Evaluators: [
        //         'Evaluator_ServerConstraint_GetActivityCode_FromJobCode'
        //     ]
        // }
    };

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
                GuaranteeCheck: {
                    Evaluators: [
                        'Evaluator_Set_GuaranteePercent_1'
                    ]
                },
                PayPercent: {
                    Evaluators: [
                        'Evaluator_Set_OriginalAmount_PL',
                        'Evaluator_Set_GuaranteePercent_1'
                    ]
                },
                CheckVAT: {
                    Evaluators: [
                        'Evaluator_Set_OriginalAmount_PL'
                    ]
                },
                TotalOfValue_BindingWeb: {
                    Evaluators: [
                        'Evaluator_Set_OriginalAmount_PL'
                    ]
                },
                TotalOfValueAddVAT_BindingWeb: {
                    Evaluators: [
                        'Evaluator_Set_OriginalAmount_PL'
                    ]
                }
            }
        }
    ];

    columnsReadOnly = [];

    linkReporter = {
        'btnPhuLucA': {
            directory: 'unitprice',
            type: 'detail',//bao cao: view, explorer: index, editor: detail
            key: 'Id_PLA',
            parameter: { 'Commandkey': 'unitprice-editor', 'ProductCostId': '{EXPR=ProductCostId}', 'ParentBizDocId': '{EXPR=BizDocId}', 'DocDate': '{EXPR=DocDate}', 'CustomerCode': '{EXPR=CustomerCode}', 'TaxCode': '{EXPR=TaxCode}', 'TaxRate': '{EXPR=TaxRate}', 'ParentId': '{EXPR=Id}' }
        },
        'btnHdPl': {
            directory: 'regcontract_viewCT',
            type: 'detail',
            command: 'detailc3',
            key: 'Id_HdPl'
        },
        'btnTaskId': {
            directory: 'investtask',
            type: 'detail',//bao cao: view, explorer: index, editor: detail
            key: 'Id_Task',
            parameter: { 'Commandkey': 'investtask-editor', 'ProductCostId': '{EXPR=ProductCostId}', 'DocDate': '{EXPR=DocDate}'}
        }
    };

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
                    isDisabled: 'true'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số phụ lục',
                    type: 'text',
                    isReadOnly: 'true',
                    col: 6,
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                // new DateBoxInput({
                //     key: 'SignDate',
                //     label: 'Ngày ký',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     // validators: [Validators.required],
                //     col: 6
                // }),
                new TextBoxInput({
                    key: 'LastDocNo',
                    label: 'Số phụ lục HĐ tay (nếu có)',
                    type: 'text',
                    //validators: [Validators.required],
                    col: 6,
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    binding: {
                        ProductType: 'ProductType'
                    },
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId0',
                    label: 'Gói thầu thanh toán',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN ('1','3') AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    col: 12,
                    visible: "'{EXPR=ProductType}' == '3'"
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Hợp đồng',
                    lookupKey: 'BizDoc_CTC',
                    lookupfilter: "((DocCode = ('C3') AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND DocDate <= '{EXPR=DocDate}' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId IN (SELECT RowId FROM B20Product WHERE ParentRowId='{EXPR=ProductCostId}'))) OR ContractType IN ('HD-14','HD-20'))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    binding: {
                        CustomerCode: 'CustomerCode',
                        ContactPerson: 'ContactPerson',
                        Position: 'Position',
                        AuthorizeNo: 'AuthorizeNo',
                        AuthorizeDate: 'AuthorizeDate',
                        ContractValue: 'ContractValue',
                        ContractValueAddVAT: 'AriseValue',
                        ContractType: 'ContractType',
                        ActivityCode: 'ActivityCode',
                        JobCode: 'JobCode',
                        CusBankAccountNo: 'CusBankAccountNo',
                        ProcessCode: 'ProcessCode',
                        Id: 'Id_HdPl'
                    },
                    col: 12
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung phụ lục',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12
                }),
                new LookupBoxInput({
                    key: 'ContractType',
                    label: 'Loại hợp đồng',
                    validators: [Validators.required],
                    lookupKey: 'ContractType',
                    binding: {
                        TaxCode: 'TaxCode'
                    },
                    hideValueMember: false,
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    style: 'background-color:#F8F0D7',
                    col: 6,
                    // isDisabled: 'true'
                }, this.srv, this.parentData),

                new MultiSelectInput({
                    key: 'ActivityCode',
                    label: 'Lĩnh vực',
                    lookupKey: 'Activity',
                    lookupfilter: 'IsGroup=0 AND IsActive=1',
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 6
                }, this.srv),
                new MultiSelectInput({
                    key: 'JobCode',
                    label: 'Công việc',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    //lookupfilter: "'{EXPR=ActivityCode}'='' OR ActivityCode IN (SELECT Val FROM dbo.ufn_sys_SplitString('{EXPR=ActivityCode}',','))",
                    lookupKey: 'Job',
                    hideValueMember: false,
                    col: 6
                }, this.srv),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Đối tác',
                    validators: [Validators.required],
                    lookupKey: 'Customer_CCM2',
                    lookupfilter: "(('{EXPR=ProductType}'=3 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%') OR Code IN (SELECT Code FROM dbo.ufn_Coteccons_Filter_CustomerCode('{EXPR=ProductCostId}','{EXPR=DocDate}','{EXPR=DocCode}','{VAR=Branch.Ma_Dvcs}')))",
                    hideValueMember: false,
                    binding: {
                        Name: 'CustomerName',
                        Address: 'Address',
                        Person: 'ContactPerson'
                    },
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CusBankAccountNo',
                    label: 'Tài khoản',
                    lookupKey: 'CustomerBankAccount',
                    lookupfilter: "CustomerCode='{EXPR=CustomerCode}'",
                    hideValueMember: false,
                    validators: [Validators.required],
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
                    col: 6
                }),
                new TextBoxInput({
                    key: 'CusBankName',
                    label: 'Ngân hàng',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6
                }),
                new TextBoxInput({
                    key: 'ContactPerson',
                    label: 'Đại diện ký HĐ',
                    type: 'text',
                    validators: [Validators.required],
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
                new NumberBoxInput({
                    key: 'ContractValue',
                    label: 'Giá trị HĐ (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'SubContractBeforeValue',
                    label: 'Giá trị PL trước (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new ButtonInput({
                    key: 'btnPhuLucA',
                    label: 'Bảng đơn giá, khối lượng',
                    col: 6,
                    style: 'margin-bottom:2px;',
                    isDisabled: "'{EXPR=Id}' < 0"
                }),
                new LookupBoxInput({
                    key: 'BizDocId_PL',
                    label: 'Phụ lục, Khối lượng',
                    lookupKey: 'BizDocCCM',
                    lookupfilter: "IsActive=1 AND DocCode = 'PL' AND CustomerCode='{EXPR=CustomerCode}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=BizDocId}'",
                    binding: {
                        OriginalAmount: 'SubContractValue',
                        TotalOriginalAmount: 'ContractValueAddVAT'
                    },
                    col: 6,
                    style: 'background-color:#FAF5D0;border-radius:8px;',
                    isDisabled: "'{EXPR=Id}' < 0",
                    hideValueMember: true
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'SubContractValue0',
                    label: 'Giá trị PL (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'SubContractValue',
                    label: 'GT điều chỉnh (chưa VAT)',
                    type: 'number',
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'ValueByConstructReal',
                    label: 'GT PLHĐ theo t. tế thi công',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'TotalOfValue',
                    label: 'Tổng giá trị HĐ (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new LookupBoxInput({
                    key: 'TaxCode',
                    label: 'Thuế',
                    lookupKey: 'Tax',
                    hideValueMember: false,
                    lookupfilter: "Type=1 AND IsActive=1 AND IsGroup=0 AND IsDefault = 1",
                    binding: {
                        Rate: 'TaxRate'
                    },
                    col: 6,
                    //isDisabled: 'true'
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'TotalOfValueAddVAT',
                    label: 'Tổng giá trị HĐ (gồm VAT)',
                    type: 'number',
                    isUsingLabel: false,
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'DayOfWarranty',
                    label: 'Thời hạn bảo hành (tháng)',
                    type: 'number',
                    col: 6,
                }),
                new CheckBoxInput({
                    key: 'IsSubContractPay',
                    label: 'PL được t.toán (cty TV)',
                    col: 6,
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive = 1 AND ParentId = 229 AND IsGroup = 0 AND DocStatus > 1",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12,
                    //isDisabled: 'true'
                }, this.srv, this.parentData),
                new ButtonInput({
                    key: 'btnTaskId',
                    label: 'Xem tờ trình',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'TaskId',
                    label: 'Tờ trình',
                    lookupKey: 'Task',
                    lookupfilter: "ProductCostId='{EXPR=ProductCostId}' AND IsActive=1 AND CompletedApprove=1",
                    hideValueMember: false,
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                    binding: {
                        Id: 'Id_Task'
                    },
                    col: 6
                }, this.srv, this.parentData), 
                new LookupBoxInput({
                    key: 'TransType',
                    label: 'Bao thanh toán',
                    validators: [Validators.required],
                    lookupKey: 'Class',
                    lookupfilter: "IsActive=1 AND ParentCode='LOAITT'",
                    hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),   
                new TextBoxInput({
                    key: 'Remark',
                    label: 'Ghi chú',
                    type: 'text',
                    col: 12
                }),
                // new DateBoxInput({
                //     key: 'FromDate',
                //     label: 'Từ ngày',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                // new DateBoxInput({
                //     key: 'ToDate',
                //     label: 'Đến ngày',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                // new LookupBoxInput({
                //     key: 'DeptCode',
                //     label: 'Bộ phận xử lý',
                //     lookupKey: 'Dept',
                //     lookupfilter: "IsActive=1 AND IsGroup=0 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                //     hideValueMember: false,
                //     col: 6,
                //     isDisabled: 'true'
                // }, this.srv, this.parentData),
                // new DateBoxInput({
                //     key: 'HandoverDate',
                //     label: 'Ngày nhận',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     col: 6,
                //     isDisabled: 'true'
                // }),
                // new MultiSelectInput({
                //     key: 'Phan_Phoi',
                //     label: 'Phân phối',
                //     lookupKey: 'Class',
                //     lookupfilter: "ParentCode='PhanPhoi'",
                //     hideValueMember: false,
                //     col: 6,
                //     isDisabled: 'true'
                // }, this.srv),
                // new LookupBoxInput({
                //     key: 'UploadFile',
                //     label: 'Trình ký file cứng',
                //     lookupKey: 'Class',
                //     lookupfilter: "ParentCode='UploadFile'",
                //     hideValueMember: false,
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }, this.srv, this.parentData),
                // new DateBoxInput({
                //     key: 'Ngay_Phan_Phoi',
                //     label: 'Ngày phân phối',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }),
                // new DateBoxInput({
                //     key: 'ConfirmedDate',
                //     label: 'Ngày ký',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }),
                new CheckBoxInput({
                    key: 'AdjustedPay',
                    label: 'Điều chỉnh PTTT',
                    col: 6,
                }),
                new ButtonInput({
                    key: 'btnHdPl',
                    label: 'Xem hợp đồng',
                    style: 'background-color:#9cc09c;',
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'ExchangeRate',
                    label: 'Tỷ giá (tạm tính)',
                    type: 'number',
                    col: 6
                }),
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'File PLHĐ đã ký',
                //     col: 6,
                //     isOnlyDownload: true
                // }, this.srv)
            ]
        })

    ];

    childColumns = [
        {
            header: 'Phương thức',
            binding: 'ClassCode1',
            width: 70,
            dataType: 'Array',
            lookupKey: 'Class',
            bindingList: {
                Name: 'Description'
            },
            lookupfilter: "ParentCode='PaymentType' AND Code IN ('00','01','01A','02','03','03A','04','05','06')"
        },
        {
            header: 'Diễn giải',
            binding: 'Description',
            allowEditing: false,
            width: 400
        },
        {
            header: 'Tỉ lệ (%)',
            binding: 'PayPercent',
            dataType: 'Number',
            width: 70,
            min: 0,
            max: 1,
            format: 'P2'
        },
        {
            header: 'Trước VAT',
            binding: 'CheckVAT',
            dataType: 'Boolean',
            width: 50
        },
        {
            header: 'Giá trị',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 150
        },
        {
            header: 'Thời hạn (ngày)',
            binding: 'NumberOfDay',
            dataType: 'Number',
            width: 150
        },
        {
            header: 'Bảo lãnh',
            binding: 'GuaranteeCheck',
            dataType: 'Boolean',
            width: 50
        },
        {
            header: '% bảo lãnh',
            binding: 'GuaranteePercent',
            dataType: 'Number',
            width: 100,
            format: 'P2'
        },
        {
            header: 'TotalOfValue',
            binding: 'TotalOfValue_BindingWeb',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 0
        },
        {
            header: 'TotalOfValueAddVAT',
            binding: 'TotalOfValueAddVAT_BindingWeb',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 0
        }
    ]

    childColumns1 = [
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

    childColumns2 = [
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

    childColumns3 = [
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
            width: 150
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

    childColumns4 = [
        {
            header: 'Tên người liên lạc',
            binding: 'ContactName',
            width: 200,
            validators: "{EXPR=ContactName} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Chức vụ',
            binding: 'JobTitleName',
            width: 200,
            validators: "{EXPR=JobTitleName} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Số điện thoại',
            binding: 'PhoneNo',
            width: 150,
            validators: "{EXPR=PhoneNo} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Địa chỉ Email',
            binding: 'Email',
            width: 200,
            validators: "{EXPR=Email} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Địa chỉ liên lạc',
            binding: 'Address',
            width: 300,
            validators: "{EXPR=Address} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Nhận thông báo thanh toán',
            binding: 'IsNotification',
            dataType: 'Boolean',
            width: 80
        },  
    ]     

    childColumns5 = [
        {
            header: 'Mã bộ phận',
            binding: 'DeptCode',
            width: 100,
            dataType: 'Array',
            lookupKey: 'Dept',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            bindingList: {
                Name: "DeptName"
            }
        },    
        {
            header: 'Tên bộ phận',
            binding: 'DeptName',
            width: 250,
            isReadOnly: 'true'
        },        
        {
            header: 'Mã cấp bậc',
            binding: 'PositionCode',
            width: 100,
            dataType: 'Array',
            lookupKey: 'Position',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            bindingList: {
                Name: "PositionName"
            }
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
            lookupfilter: "IsActive=1 AND IsGroup=0",
            bindingList: {
                Name: "EmployeeName"
            }            
            // validators: "{EXPR=EmployeeCode} == ''",
            // validatorMessage: 'Không được bỏ trắng giá trị',
            // ignoreError: 1
        },
        {
            header: 'Tên nhân viên',
            binding: 'EmployeeName',
            width: 250,
            isReadOnly: 'true'
        },            
    ]

    childColumns6 = [
      
        {
            header: 'Ghi chú',
            binding: 'Description',
            width: 250
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 600,
            dataType: 'Object'
            //validators: "{EXPR=Description} != '' && {EXPR=Description} == 'Yêu cầu đính kèm' && {EXPR=FilePath}==0",


            //exprReadOnly: "{EXPR=Attached} == true && {EXPR=Description} != ''"
        }
    ]
}