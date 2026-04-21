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

// Danh mục đơn vị nhận hàng
export class LayoutIncurredCcmExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocVB_Explorer',
                FilterKey: "IsActive = 1 AND DocCode = 'I1' AND ProductCostId = '{VAR=Filter.ProductCostId}'",
                OrderBy: 'DocDate',
                RowPage: 500
            },
            Child: {
                Name: 'vB30BizDocApprove_ExplorerBizDocVB',
                ParentKey: 'BizDocId',
                ChildKey: 'BizDocId',
                OrderBy: 'ApproveGroup'
            }
        },
        PrintDocument: {
        }
    }
   
    lookup3 = {
        Table: 'B00TMCtcDocStatus',
        Filter: "CommandWeb = 'rowsPage'",
    }

    parentGrid = [
        {
            header: 'Ngày',
            binding: 'DocDate',
            width: 300,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Ngày gửi duyệt',
            binding: 'DateSend',
            width: 180,
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
            header: 'Tổng giá trị chưa trình',
            binding: 'TotalAmount',
            width: 150,
            dataType: 'Number'
        },
        {
            header: 'Tổng giá trị trình',
            binding: 'TongGiaTriTrinh',
            width: 150,
            dataType: 'Number'
        },
        {
            header: 'Tổng giá trị PS đã duyệt',
            binding: 'TotalAmountApprove',
            width: 150,
            dataType: 'Number'
        },
        {
            header: 'Tổng giá trị còn lại',
            binding: 'DiffAmount',
            width: 150,
            dataType: 'Number'
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
            header: 'ProductCostId',
            binding: 'ProductCostId',
            width: 0,
            dataType: 'String'
        },
        {
            header: 'ProductName',
            binding: 'ProductName',
            width: 0,
            dataType: 'String'
        },
        {
            header: 'Công ty',
            binding: 'BranchCode',
            width: 0,
            dataType: 'String'
        },
        {
            header: 'Id_Bravo',
            binding: 'Id',
            width: 0,
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
        // {
        //     header: 'Bộ phận',
        //     binding: 'DeptName',
        //     width: 250,
        //     dataType: 'String'
        // },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 150,
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



export class LayoutIncurredCcmEditor implements IEditorFormulaDeclaration {

    linkReporter = {
        'btnBaoCao': {
            directory: 'reporterincurred',
            type: 'view',
            key: 'REP07_KQT_TDPS',
            parameter: { 'Commandkey': 'REP07_KQT_TDPS', 'ProductCostId': '{EXPR=ProductCostId}', 'Id': '{EXPR=Id}' }
        }
    };

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocVB_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1,
                    DocCode:'I1',
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB30Incurred',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BuiltinOrder: '1',
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
                    Name: 'vB30BizDocApprove_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
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
                }
            ]
        }
    }

    evaluators = {
        'Evaluator_ServerConstraint_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,DocCode,DocNo,Id',
            Command: 'ufn_B30BizDocVB_DefaultDocNo',
            zExpr: "ProductCostId != ''",
            DataMember: 'DocNo'
        },
        'Evaluator_ServerConstraint_GetAmountDoanhThu': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ProductCostId,DocDate',
            Command: 'ufn_B30BizDocVB_GetAmountDoanhThu',
            zExpr: "ProductCostId != ''",
            DataMember: 'Amount_DoanhThu'
        },
        'Evaluator_ServerConstraint_Detail_LoadData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProductCostId,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_B30IncurredCcm_LoaidPreviousData',
       
            OutputTable: 0
        },
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId',
            Command: 'usp_B30BizDocApprove_GetData_IncurredCcm',
           
            OutputTable: 2
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},BizDocId,{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true'
        },
        'Evaluator_ServerUpdated_CreateFormula': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Coteccons_CreateFormula_Incurred'
        },
        'Evaluator_ServerUpdated_BuiltinOrder': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,{VAR=Branch.Ma_Dvcs}',
            Command: 'usp_Coteccons_Web_SetBuiltionOrder_Incurred'
        },
    }

    serverConstraint = [
        // 'Evaluator_ServerConstraint_DefaultDocNo',
        // 'Evaluator_ServerConstraint_GetAmountDoanhThu',
        // 'Evaluator_ServerConstraint_Approve_GetData'
    ]

    serverUpdating = [
        // 'Evaluator_UpdateInfo_WhenApproveSend'
    ]

    serverUpdated: string[] = [
        'Evaluator_ServerUpdated_CreateFormula',
        'Evaluator_ServerUpdated_BuiltinOrder'

    ]

    buttonLoadChild: string[] = [
        // 'Evaluator_ServerConstraint_Detail_LoadData'
    ];

    buttonCommand: string[] = [

    ]

    importCommand: string[] = [

    ]

    columnChanged = {
        ProcessCode: {
            Evaluators: [
                // 'Evaluator_ServerConstraint_Approve_GetData',
             
            ]
        }
    };

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
            }
        }
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
                    
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6
                }),  
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/Phòng, ban',
                    lookupKey: 'ProductCost',
                    binding: {
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND RowId = '{VAR=Filter.ProductCostId}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'ProductCostId',
                //     label: 'Hạng mục',
                //     lookupKey: 'Project2',
                //     binding: {
                //     },
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId1 = '{EXPR=ProductCostId1}'",
                //     hideValueMember: true,
                //     col: 12
                // }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    // lookupfilter: "IsActive=1",
                    lookupfilter: "IsActive=1 AND Ma_Ct='{EXPR=DocCode}'",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'Amount_DoanhThu',
                    label: 'Doanh Thu BCTC',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'TotalAmount',
                    label: 'Tổng giá trị chưa trình',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'TongGiaTriTrinh',
                    label: 'Tổng PS trình',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'TotalAmountApprove',
                    label: 'Giá trị PS đã duyệt',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'DiffAmount',
                    label: 'PS đã trình chưa được duyệt',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'TotalAmountBCTC',
                    label: 'Giá trị PS đã cập nhật BCTC',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new ButtonInput({
                    key: 'btnBaoCao',
                    label: 'Báo cáo theo dõi Phát sinh',
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi',
                    col: 6,
                    isNewRow: 'true',
                    isDisabled: 'true'
                }),
                new CheckBoxInput({
                    key: 'CompletedApprove',
                    label: 'Đã hoàn thiện',
                    isDisabled: 'true',
                    col: 6
                }) ,
                // new NumberBoxInput({
                //     key: 'Id',
                //     label: 'Tổng giá trị chưa trình',
                //     col: 6,
                //     isVisible: false,
                //     //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                // }),      
            ]
        })
    ];

    childColumns = [
        {
            header: 'STT',
            binding: 'ItemNo',
            
            width: 100
        },
        {
            header: 'Số VO',
            binding: 'IncurredCcmCode',
            
            width: 150
        },
        {
            header: 'XD/ME',
            binding: 'ClassCode1',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='CLAIM' AND Code NOT IN ('TK')",
            width: 150,
        },
        {
            header: 'Diễn giải',
            binding: 'Description',
            width: 300
        },
        {
            header: 'Họp - Ghi chú',
            binding: 'MeetingRemark',
            isRequired: true,
            width: 150
        },
        {
            header: 'Họp - BCH cam kết'	,
            binding: 'MeetingBCHDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false,
            width:100							
        },
        {
            header: 'Ngày bắt đầu thi công'	,
            binding: 'DateBeginTC',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            width:100,
            isRequired: false					
        },
        {
            header: '% đã thi công',
            binding: 'RateTC',
            dataType: 'Number',
            width: 80,
            format: 'p2'
        },
        {
            header: 'Giá trị chưa trình (Chưa VAT)',
            binding: 'GiaTriChuaTrinh',
            dataType: 'Number',
            width: 150,
            format: 'n0'
        },
        {
            header: 'Giá trị trình (chưa VAT)',
            binding: 'GiaTriTrinh',
            dataType: 'Number',
            width: 150,
            format: 'n0'
        },
        {
            header: '% đánh giá đạt được (PS đã trình)',
            binding: 'RateDat',
            dataType: 'Number',
            width: 80,
            format: 'p2'
        },
        {
            header: 'Giá trị đánh giá PS đã trình (Chưa VAT)',
            binding: 'GiaTriDanhGia',
            dataType: 'Number',
            width: 150,
            format: 'n0'
        },
        {
            header: 'Giá trị PS được duyệt (Chưa VAT)',
            binding: 'GiaTriPsDaDuyet',
            dataType: 'Number',
            width: 150,
            format: 'n0'
        },
        {
            header: 'Số PLHĐ/ VO đã duyệt ',
            binding: 'DocNoVODuyet',
            
            width: 150
        },
        {
            header: 'Giá trị PS đã trình nhưng chưa duyệt',
            binding: 'GiaTriDaTrinhChuaDuyet',
            dataType: 'Number',
            width: 150,
            format: 'n0'
        },
        // {
        //     header: 'Ngày bắt đầu tính toán'	,
        //     binding: 'StartDateBudget',
        //     dataType: 'Date',
        //     format: 'dd/MM/yyyy',
        //     width:100							
        // },
        // {
        //     header: 'Ngày kết thúc tính toán'	,
        //     binding: 'EndDateBudget',
        //     dataType: 'Date',
        //     format: 'dd/MM/yyyy',
        //     width:100							
        // },
        {
            header: 'Ngày trình/ gửi thông tin lần đầu'	,
            binding: 'DateQLKL',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100							
        },
        {
            header: 'Tình trạng QLKL'	,
            binding: 'StatusQLKL',
            width:100,
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='PSCDT'",							
        },
        {
            header: 'Ngày trình duyệt TVGS'	,
            binding: 'DateTVGS',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false,
            width:100							
        },
        {
            header: 'Tình trạng TVGS'	,
            binding: 'StatusTVGS',
            width:100,
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='PSCDT'",						
        },
        {
            header: 'Ngày trình duyệt BQL'	,
            binding: 'DateBQLApprove',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100							
        },
        {
            header: 'Tình trạng BQL'	,
            binding: 'StatusBQL',
            width:100,
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='PSCDT'",						
        },
        {
            header: 'Ngày trình duyệt CDT'	,
            binding: 'DateCDT',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100							
        },
        {
            header: 'Tình trạng CDT'	,
            binding: 'StatusCDT',
            width:100,
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='PSCDT'",								
        },
        {
            header: 'Ngày CĐT phê duyệt'	,
            binding: 'DateApprove',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false,
            width:100							
        },
        {
            header: 'Số SI/RFI',
            binding: 'SIRFINO',
            isRequired: true,
            width: 150
        },
       
        {
            header: 'PS không được duyệt (nhưng có PS chi phí)',
            binding: 'GiaTriPsKhongDuyet',
            dataType: 'Number',
            width: 150,
            format: 'n0'
        },
        {
            header: 'Giá trị PS đã cập nhật BCTC',
            binding: 'AmountPSBCTC',
            dataType: 'Number',
            width: 150,
            format: 'n0'
        },
        {
            header: 'Chi phí',
            binding: 'ChiPhi',
            dataType: 'Number',
            width: 150,
            format: 'n0'
        },
        {
            header: 'TP/NCC',
            binding: 'CustomerName',
            
            width: 250
        },
        {
            header: 'Ghi chú',
            binding: 'Remark',
            isRequired: true,
            width: 200
        },
         {
            header: 'Ghi chú',
            binding: 'Remark',
            isRequired: true,
            width: 200
        },
        {
            header: 'Duyệt chủ trương'	,
            binding: 'PolicyStatus',
            width:100,
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='POLICYSTATUS'",								
        },
        {
        header: 'Giá trị đánh giá PS đã trình (Chưa VAT)',
        binding: 'RowInheris',
        dataType: 'Number',
        width: 0,
        format: 'n0'
         },
    ]

    childColumns1 = [
      
        {
            header: 'Tên tài liệu',
            binding: 'DocumentName',
            width: 250,
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
            lookupfilter: "IsActive=1",
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