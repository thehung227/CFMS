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


export class LayoutApprovedProposalQuarterlyExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_BizDocVBExplorer',
                FilterKey: "ApproveSend = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'V4' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'ProductName,BizDocId,ApproveGroup',
                RowPage: 50
            }
        }
    }

    parentGrid = [
        {
            header: 'STT duyệt',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
        },
        {
            header: 'Bộ phận',
            binding: 'DeptName',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Người đã thực hiện',
            binding: 'EmployeeNameApprove',
            width: 150
        },
        {
            header: 'Số ngày thực hiện',
            binding: 'NumberOfDays',
            width: 150,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Duyệt',
            binding: 'ApproveStatus',
            width: 80,
            dataType: 'Boolean',
            textAlign: 'center'
        },
        {
            header: 'Ý kiến',
            binding: 'Comment',
            width: 400,
            dataType: 'String',
            isContentHtml: true
        },
        {
            header: 'Kế hoạch',
            binding: 'InfoBudget',
            width: 0,
            dataType: 'String'
        },
        {
            header: 'Gói thầu',
            binding: 'ProductName',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Đối tác',
            binding: 'CustomerName',
            width: 300,
            dataType: 'String'
        }
    ]
}

export class LayoutApprovedProposalQuarterlyEditor implements IEditorFormulaDeclaration {

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

    approveGrid = 1;

    serverConstraint = [
    ]

    serverUpdating = [

    ]

    columnChanged = {

    };

    linkReporter = {
        'btnBaoCao3': {
            directory: 'reporterquarter',
            type: 'view',
            key: 'REP01_DXTCQ',
            parameter: { 'Commandkey': 'REP01_DXTCQ', 'ProductCostId': '{EXPR=ProductCostId}', 'BizDocId': '{EXPR=BizDocId}', 'Ma_Dvcs': '{VAR=Branch.Ma_Dvcs}' }
        }
    }

    columnsReadOnly = [];

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_BizDocVBEdit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'V1',
                    BizDocId: '',
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder'
                },                
                {
                    Name: 'vB30BizDocApprove_AEditBizDocVB',
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
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: '',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    }
                },
                {
                    Name: 'vB30BizDocVBDetail_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    }
                },
                {
                    Name: 'vB30BizDocVBDetail3_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    }
                },
                {
                    Name: 'vB30BizDocVBDetail2_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    },
                    frozenColumns: 5
                },
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Bảng tổng hợp Bill - {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_B30BizDocVB_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng tổng hợp",
                    FileName: "Bảng tổng hợp đề xuất thu chi - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "BM_DeXuatChiQuy.docx",
                    // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
            ]
   
    }
    };

    panels: PanelBase[] = [
        new TablePanel({
            label: 'Panel 1',
            col: 12,
            controls: [
                new DateBoxInput({
                    key: 'DocDate',
                    label: 'Ngày lập',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isReadOnly: 'true',
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
                    key: 'ClassCode1',
                    label: 'Kỳ báo cáo',
                    lookupKey: 'KyBC',
                    binding: {
                        Ngay_Bd_Cl_TC: "Ngay_Bd_Cl_TC",
                        Ngay_Dau_Ky: "Ngay_Dau_Ky",
                        Ngay_Cuoi_Ky: "Ngay_Cuoi_Ky"
                    },
                    validators: [Validators.required],
                    lookupfilter: "IsActive=1",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: true,
                    col: 6
                }, this.srv, this.parentData),
                new DateBoxInput({
                    key: 'Ngay_Bd_Cl_TC',
                    label: 'Ngày tính Chênh lệch Thu-Chi',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new DateBoxInput({
                    key: 'Ngay_Dau_Ky',
                    label: 'Ngày đầu kỳ',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new DateBoxInput({
                    key: 'Ngay_Cuoi_Ky',
                    label: 'Ngày cuối kỳ',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    validators: [Validators.required],
                    lookupfilter: "IsGroup=0",
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
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
                    lookupfilter: "DocStatus=4 AND IsActive=1 AND Ma_Ct='{EXPR=DocCode}'",//AND DocCode='{EXPR=DocCode}'",//"(Code IN (SELECT Code FROM dbo.ufn_Coteccons_Filter_ProcessCodeByBizDocC3('{EXPR=ProductCostId}','{EXPR=ParentBizDocId}','{EXPR=DocCode}','{VAR=Branch.Ma_Dvcs}')))",//('{EXPR=PayTeamType}' = '00') OR 
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'AmountChenhLechThuChi',
                    label: 'Chênh lệch thu chi',
                    type: "Number",
                    format: "n0",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'LuyKeThu',
                    label: 'Lũy kế thu (Không gồm NSC)',
                    type: "Number",
                    format: "n0",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'LuyKeChi',
                    label: 'Lũy kế chi (Không gồm NSC tiền chưa về)',
                    type: "Number",
                    format: "n0",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'TotalAmount',
                    label: 'Chênh lệch thu chi cuối kỳ dự kiến',
                    type: "Number",
                    format: "n0",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                new ButtonInput({
                    key: 'btnBaoCao3',
                    label: 'Báo cáo KH TT Bill chưa up',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'PositionCode',
                    label: 'Cấp bậc duyệt',
                    lookupKey: 'Position',
                    hideValueMember: false,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
         
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCode',
                    label: 'Người duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
             
                }, this.srv, this.parentData),
                new RichTextBoxInput({
                    key: 'Comment',
                    label: 'Ý kiến',
                    col: 12
                }),
               
                // new ButtonInput({
                //     key: 'btnHdPl',
                //     label: 'Bổ sung file',
                //     style: 'background-color:#9cc09c;',
                //     col: 6
                // }),                
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'File đính kèm',
                //     col: 6,
                //     isOnlyDownload: true,
                //     folderId: '{EXPR=IdBudget}'
                // }, this.srv)
            ]
        })
    ];

    childColumns = [
        // {
        //     header: 'Mã tài liệu',
        //     binding: 'DocumentCode',
        //     width: 80,
        //     dataType: 'Array',
        //     lookupKey: 'Document',
        //     lookupfilter: 'IsGroup=0 AND IsActive=1'
        // },
        {
            header: 'Link SharePoint',
            binding: 'Description',
            width: 130,
            isReadOnly: 'true'
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 300,
            dataType: 'Object',
            allowRemove: false,
            allowView: true,
            allowDownLoad: true,
            allowUpload: true,
            folderId: '{EXPR=IdBizDocVB}'
        }
    ]

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
            width: 0,
            dataType: 'Array',
            lookupKey: 'Dept',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            isReadOnly: 'true'
        },
        {
            header: 'Tên bộ phận',
            binding: 'DeptName',
            width: 200,
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
            width: 200,
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

    childColumns2 = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center',
        },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 200
        },
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
            header: 'STT',
            binding: 'BuiltinOrder',
            width: 100,
            isReadOnly: 'true'

        },
        {
            header: 'Mã Ưu tiên chi',
            binding: 'CodeKHC',
            dataType: 'Array',
            lookupKey: 'KHC',
            isReadOnly: 'true',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ClassCode1='02'",
            width: 100
        },
       
        {
            header: 'Tên đối tượng',
            binding: 'CustomerName',
            width: 250,
            isReadOnly: 'true',
        },
       
        {
            header: 'Thông tin bill',
            binding: 'BillInfo',
            width: 200,
            isReadOnly: 'true'

        },
        {
            header: 'Bill thanh toán',
            binding: 'BtnBOQ',
            
            dataType: 'Object',
            isButton: true,
            textButton: 'Xem bill',
            width: 70,
            linkCommand: {
                directory: "{EXPR=DocCode_Link} == 'P4' ? 'billpaysupp' : {EXPR=DocCode_Link} == 'P3' ? 'billpaydept' : {EXPR=DocCode_Link} == 'C5' ? 'settlement' : ''",
                type: 'detail',
                key: 'IdCCM',
                // parameter: { 'Commandkey': "{EXPR=DocCode_Link} == 'P4' ? 'billpaysupp-editor' : {EXPR=DocCode_Link} == 'P3' ? 'billpaydept-editor' : {EXPR=DocCode_Link} == 'C5' ? 'settlement-editor' : ''"}
            }
        },
        {
            header: 'Tổng cộng',
            binding: 'OriginalAmount',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'GTTT tháng thứ nhất kỳ BC (Bill đã up)',
            binding: 'Amount1',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'GTTT tháng thứ nhất kỳ BC (Bill dự trù)',
            binding: 'PlanAmount1',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'GTTT tháng thứ 2 kỳ BC (Bill đã up)',
            binding: 'Amount2',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'GTTT tháng thứ 2 kỳ BC (Bill dự trù)',
            binding: 'PlanAmount2',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'GTTT thứ 3 kỳ BC (Bill đã up)',
            binding: 'Amount3',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'GTTT thứ 3 kỳ BC (Bill dự trù)',
            binding: 'PlanAmount3',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'Tổng cộng đề xuất thanh toán trong kỳ',
            binding: 'ThisPeriod',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'GTTT tháng thứ nhất kỳ  BC - BCH đề xuất',
            binding: 'Amount5',
            dataType: 'Number',
          
            width: 150
        },
        {
            header: 'GTTT tháng thứ 2 kỳ  BC - BCH đề xuất',
            binding: 'Amount6',
            dataType: 'Number',
          
            width: 150
        },
        {
            header: 'GTTT tháng thứ 3 kỳ  BC - BCH đề xuất',
            binding: 'Amount7',
            dataType: 'Number',
           
            width: 150
        },

        {
            header: 'Giá trị đã TC chưa thanh toán theo kỳ',
            binding: 'Amount8',
            dataType: 'Number',
           
            width: 200
        },
      
      
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50
        },
        {
            header: 'Mã đối tượng',
            binding: 'CustomerCode',
            dataType: 'Array',
            lookupKey: 'Customer_CCM2',
            bindingList: {
                Name: 'CustomerName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
            width: 0
        },
        {
            header: 'Id hợp đồng',
            binding: 'BizDocId_C1',
            width: 0,
            dataType: 'Array',
            lookupKey: 'BizDoc2',
            bindingList: {
                DocInfo: 'DocInfo',
                ContractType: 'ContractType'
            },
            // displayMember: 'DocInfo',
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
            lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        },
    ]

    childColumns4 = [
        {
            header: 'Thời gian',
            binding: 'DateJob',
            isRequired: true,
            width: 120,
            dataType: 'Date',
            format: 'MM/yyyy'
        },
        {
            header: 'Claim',
            binding: 'ItemNo',
            isRequired: true,
            width: 100
        },
       
     
       
        {
            header: 'Gói thầu',
            binding: 'ProductName',
            width: 200, 
        },
        {
            header: 'Đã xuất hóa đơn/ Dự trù',
            binding: 'SubjectCode',
            dataType: 'Array',
            lookupKey: 'Class',
            bindingList: {
               
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='DKTHU'",
            width: 150
        },
        {
            header: 'Ngày duyệt claim và xuất hóa đơn',
            binding: 'StartDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false,
            width: 150
        },
        {
            header: 'Thời gian thanh toán theo HĐ',
            binding: 'EndDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false,
            width: 150
        },
       
        {
            header: 'Giá trị thanh toán',
            binding: 'OriginalAmount',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 200
        },
       
        {
            header: 'Giá trị thanh toán (NSC,Sol, Dcons, Back To Back)',
            binding: 'PlanAmount1',
            dataType: 'Number',

            width: 200
        },
        {
            header: 'Giá trị thanh toán (New)',
            binding: 'PlanAmount2',
            dataType: 'Number',

            width: 200
        },
        {
            header: 'Tổng Claim thu được không bao gồm NSC,Sol, Dcons back to back trong Quý',
            binding: 'ThisPeriod',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 200
        },
       
        {
            header: 'Dự kiến thu lần 1 (Phần Newtecons)',
            binding: 'Amount1',
            dataType: 'Number',

            width: 200
        },
        {
            header: 'Ngày thu',
            binding: 'Date1',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false,
            width: 150
        },
        {
            header: 'Dự kiến thu lần 2 (Phần Newtecons)',
            binding: 'Amount2',
            dataType: 'Number',
            width: 200
        },
        {
            header: 'Ngày thu',
            binding: 'Date2',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false,
            width: 150
        },
        {
            header: 'Dự kiến thu lần 3 (Phần Newtecons)',
            binding: 'Amount3',
            dataType: 'Number',

            width: 200
        },
        {
            header: 'Ngày thu',
            binding: 'Date3',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false,
            width: 150
        },
        {
            header: 'Tổng Claim KHÔNG thu được trong Quý (Phần Newtecons)',
            binding: 'NextPeriod',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 200
        },
        // {
        //     header: 'Ngày tính hạn TT',
        //     binding: 'ThisDateNC',
        //     dataType: 'Date',
        //     format: 'dd/MM/yyyy',
        //     width: 150
        // },
    
        // {
        //     header: 'Ngày tính hạn TT',
        //     binding: 'NextDateNC',
        //     dataType: 'Date',
        //     format: 'dd/MM/yyyy',
        //     width: 150
        // },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50
        },
        {
            header: 'Mã đối tượng',
            binding: 'CustomerCode',
            dataType: 'Array',
            lookupKey: 'Customer_CCM2',
            bindingList: {
                Name: 'CustomerName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
            width: 0
        },
        {
            header: 'Id hợp đồng',
            binding: 'BizDocId_C1',
            width: 0,
            dataType: 'Array',
            lookupKey: 'BizDoc2',
            bindingList: {
                DocInfo: 'DocInfo',
                ContractType: 'ContractType'
            },
            // displayMember: 'DocInfo',
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
            lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        },
    ]

    childColumns5 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            isReadOnly: 'true',
            width: 100
        },
        {
            header: 'Mã XD/ME',
            binding: 'CodeMEXD',
            dataType: 'Array',
            lookupKey: 'KHC',
            isReadOnly: 'true',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ClassCode1='01'",
            width: 150
        },
        {
            header: 'Mã Ưu tiên chi',
            binding: 'CodeKHC',
            dataType: 'Array',
            lookupKey: 'KHC',
            isReadOnly: 'true',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ClassCode1='02'",
            width: 100
        },
       
        {
            header: 'Tên đối tượng',
            binding: 'CustomerName',
            width: 250,
            isReadOnly: 'true',
        },
       
        {
            header: 'Thông tin hợp đồng',
            binding: 'DocInfo',
            width: 200,
            isReadOnly: 'true'

        },
        {
            header: 'Ngày tính hạn TT',
            binding: 'DateJob',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false,
            width: 120
        },
     
        {
            header: 'Giá trị thanh toán (Đã thi công)',
            binding: 'Amount1',
            dataType: 'Number',

            width: 150
        },
        {
            header: 'Ngày tính hạn TT (1)',
            binding: 'Date1',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false,
            width: 120
        },
        {
            header: 'GTTT của C.việc TC tháng thứ 1 kỳ BC (chưa TC) (1)',
            binding: 'Amount2',
            dataType: 'Number',

            width: 200
        },
        {
            header: 'Ngày tính hạn TT (2)',
            binding: 'Date2',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false,
            width: 120
        },
        {
            header: 'GTTT của C.việc TC tháng thứ 2 kỳ BC (chưa TC) (2)',
            binding: 'Amount3',
            dataType: 'Number',

            width: 200
        },
        {
            header: 'Ngày tính hạn TT (3)',
            binding: 'Date3',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isRequired: false,
            width: 120
        },
        {
            header: 'GTTT của C.việc TC tháng thứ 3 kỳ BC (chưa TC) (3)',
            binding: 'Amount4',
            dataType: 'Number',

            width: 200
        },
        // {
        //     header: 'Ngày tính hạn TT',
        //     binding: 'ThisDateNC',
        //     dataType: 'Date',
        //     format: 'dd/MM/yyyy',
        //     width: 150
        // },
    
        // {
        //     header: 'Ngày tính hạn TT',
        //     binding: 'NextDateNC',
        //     dataType: 'Date',
        //     format: 'dd/MM/yyyy',
        //     width: 150
        // },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50
        },
        {
            header: 'Mã đối tượng',
            binding: 'CustomerCode',
            dataType: 'Array',
            lookupKey: 'Customer_CCM2',
            bindingList: {
                Name: 'CustomerName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
            width: 0
        },
        {
            header: 'Id hợp đồng',
            binding: 'BizDocId_C1',
            width: 0,
            dataType: 'Array',
            lookupKey: 'BizDoc2',
            bindingList: {
                DocInfo: 'DocInfo',
                ContractType: 'ContractType'
            },
            // displayMember: 'DocInfo',
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
            lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        },
    ]
}
