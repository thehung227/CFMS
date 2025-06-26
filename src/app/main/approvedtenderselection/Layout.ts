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

export class LayoutApprovedTenderSelectionEditor implements IEditorFormulaDeclaration {

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
            directory: 'reportertenderselection',
            type: 'view',
            key: 'REP01_CCM_TENDERSELECTION',
            parameter: { 'Commandkey': 'REP01_CCM_TENDERSELECTION', 'ProductCostId': '{EXPR=ProductCostId}', 'BizDocId': '{EXPR=BizDocId}'}
        }
    }

    columnsReadOnly = [];

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_BizDocVBEdit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'A5',
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
                    Name: 'vB30BizDocVBDetail3_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1'
                    }
                },
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'WorkFlow Đánh giá QLTC - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocVB_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "WorkFlow Đánh giá QLTC",
                    FileName: "WorkFlow Đánh giá QLTC - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "WorkFlow_DGQLTC.docx",
                    // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
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
                // new NumberBoxInput({
                //     key: 'IdBizDocVB',
                //     label: '_Id',
                //     type: 'number',
                //     dataType: 'n0',
                //     // visible: 'false',
                //     col: 12,
                //     
                // }),
                new DateBoxInput({
                    key: 'DocDate',
                    label: 'Ngày lập',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số hồ sơ',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    
                }),
                new LookupBoxInput({
                    key: 'ClassCode3',
                    label: 'Loại so sánh',
                    lookupKey: 'Class',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='TenderType'",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 6,
                    
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Version',
                    lookupKey: 'BizDocVB',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND DocCode='A5' AND ClassCode3='01' AND ProductCostId='{VAR=Filter.ProductCostId}'",
                    visible: "'{EXPR=ClassCode3}' != '01'",
                    hideValueMember: false,
                    // validators: [Validators.required],
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ Phòng ban',
                    lookupKey: 'ProductCost',
                    validators: [Validators.required],
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN ('1','3') AND BranchCode='{VAR=Branch.Ma_Dvcs}'",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: true,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    
                }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'CustomerCode',
                //     label: 'NTP/ NCC chọn',
                //     validators: [Validators.required],
                //     lookupKey: 'Customer',
                //     lookupfilter: "IsGroup=0 AND IsActive=1",
                //     hideValueMember: false,
                //     ,
                //     col: 12,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F8F0D7;border-radius:8px;',
                // }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'NumberCol1',
                    label: 'Giá BĐ',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                }),
                new NumberBoxInput({
                    key: 'NumberCol2',
                    label: 'Đơn giá chọn',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                }),
                new NumberBoxInput({
                    key: 'DiffNumber',
                    label: 'Chênh lệch',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                }),
                new NumberBoxInput({
                    key: 'NumberCol3',
                    label: 'Chênh lệch (%)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true',
                    format: 'P2',
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                }),
                new NumberBoxInput({
                    key: 'TotalAmount',
                    label: 'HQ đàm phán đã vào BCTC',
                    type: 'number',
                    
                   
                    col: 6,
                    // isNewRow: true
                }),
                new NumberBoxInput({
                    key: 'TotalAmountBCTCC',
                    label: 'HQ Khác đã vào BCTC đầu dự án',
                    type: 'number',
                    
                    
                    col: 6,
                    // isNewRow: true
                }),
                new LookupBoxInput({
                    key: 'ActivityCode',
                    label: 'Lĩnh vực',
                    lookupKey: 'Activity',
                    hideValueMember: false,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'SubjectCode',
                    label: 'Công việc',
                    lookupKey: 'Job_CCM',
                    hideValueMember: false,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'ClassCode1',
                //     label: 'Loại hình',
                //     lookupKey: 'Class',
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='CLAIM' AND Code IN ('XD','ME')",
                //     hideValueMember: false,
                //     col: 12,
                //     ,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F8F0D7;border-radius:8px;',
                // }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'ClassCode2',
                //     label: 'Loại đối tác',
                //     lookupKey: 'Class',
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='CustomerType'",
                //     hideValueMember: false,
                //     col: 12,
                //     ,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F8F0D7;border-radius:8px;',
                // }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    type: 'text',
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                }),
                new TextBoxInput({
                    key: 'Description1',
                    label: 'Ghi chú',
                    type: 'text',
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: '',
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    
                }, this.srv, this.parentData),
                new DateBoxInput({
                    key: 'Date1',
                    label: 'Ngày chốt gói thầu',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    
                }),
                // new NumberBoxInput({
                //     key: 'NumberOfDays',
                //     label: 'Số ngày thực hiện',
                //     type: 'number',
                //     dataType: 'n0',
                //     isDisabled: 'true',
                //     col: 6
                // }),
                // new LookupBoxInput({
                //     key: 'DeptCode',
                //     label: 'Bộ phận',
                //     lookupKey: 'Dept',
                //     hideValueMember: false,
                //     isDisabled: 'true',
                //     col: 6
                // }, this.srv, this.parentData),
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
                    key: 'EmployeeCodeSend',
                    label: 'Người gửi duyệt',
                    lookupKey: 'Employee',
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
                new ButtonInput({
                    key: 'btnBaoCao',
                    label: 'Phân tích gói thầu',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Comment',
                    label: 'Ý kiến',
                    col: 12,
                    // 
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
        {
            header: 'Diễn giải',
            binding: 'Description',
            width: 200,
            isReadOnly: 'true'
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 380,
            dataType: 'Object',
            allowRemove: false,
            allowView: true,
            allowDownLoad: true,
            allowUpload: false,
            folderId: '{EXPR=IdBizDocVB}'
        },
        // {
        //     header: 'Link SharePoint',
        //     binding: 'LinkSharePoint',
        //     width: 150,
        //     // validators: "{EXPR=Description}==''",
        //     // validatorMessage: 'Yêu cầu có link SharePoint',
        //     // ignoreError: 1
        // },
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
        // {
        //     header: 'Mã bộ phận',
        //     binding: 'DeptCode',
        //     width: 0,
        //     dataType: 'Array',
        //     lookupKey: 'Dept',
        //     lookupfilter: 'IsGroup=0 AND IsActive=1',
        //     isReadOnly: 'true'
        // },
        // {
        //     header: 'Tên bộ phận',
        //     binding: 'DeptName',
        //     width: 200,
        //     isReadOnly: 'true'
        // },
        // {
        //     header: 'Mã cấp bậc',
        //     binding: 'PositionCode',
        //     width: 0,
        //     dataType: 'Array',
        //     lookupKey: 'Position',
        //     lookupfilter: 'IsGroup=0 AND IsActive=1',
        //     isReadOnly: 'true'
        // },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 150,
            isReadOnly: 'true'
        },
        // {
        //     header: 'Mã nhân viên',
        //     binding: 'EmployeeCode',
        //     width: 150,
        //     dataType: 'Array',
        //     lookupKey: 'Employee',
        //     lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId}' AND PositionCode = '{EXPR=PositionCode}')",
        //     validators: "{EXPR=EmployeeCode} == ''",
        //     validatorMessage: 'Không được bỏ trắng giá trị',
        //     ignoreError: 1
        // },
        {
            header: 'Tên nhân viên',
            binding: 'EmployeeName',
            width: 180,
            isReadOnly: 'true'
        },
        // {
        //     header: 'Người duyệt được chỉ định',
        //     binding: 'EmployeeCodeReal',
        //     dataType: 'Array',
        //     lookupKey: 'Employee',
        //     lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId}' AND PositionCode = '{EXPR=PositionCode}')",
        //     width: 120,
        //     validators: "{EXPR=EmployeeCode} != '' && {EXPR=EmployeeCode}.toString().indexOf(',') > 0 && {EXPR=EmployeeCodeReal} == ''",
        //     validatorMessage: 'Không được bỏ trống giá trị',
        //     ignoreError: 1
        // },
        {
            header: 'Số ngày xử lý',
            binding: 'NumberOfDays',
            width: 70,
            isReadOnly: 'true'
        },
        // {
        //     header: 'Được trả lại hồ sơ',
        //     binding: 'ApproveReturn',
        //     dataType: 'Boolean',
        //     width: 80,
        //     isReadOnly: 'true'
        // },
        // {
        //     header: 'Trả về cấp bậc',
        //     binding: 'PositionCodeReturn',
        //     width: 150,
        //     isReadOnly: 'true'
        // }
    ];

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
            header: 'Mã đối tượng',
            binding: 'CustomerCode',
            width: 150,
            dataType: 'Array',
            lookupKey: 'Customer',
            lookupfilter: "IsGroup=0 AND IsActive=1",
            bindingList: {
                Name: "CustomerName",
                TaxRegNo: "TaxRegNo"
            }
        },
       
        {
            header: 'Tên đối tượng',
            binding: 'CustomerName',
            width: 400,
            
        },
        {
            header: 'Mã số thuế',
            binding: 'TaxRegNo',
            width: 150
        },
        {
            header: 'NC/NTP/NCC',
            binding: 'CourseTypeCode',
            width: 150,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "ParentCode = 'CustomerType'"
        },
        {
            header: 'Phạm vi thị trường',
            binding: 'TeritoryCode',
            width: 150,
            dataType: 'Array',
            lookupKey: 'Territory',
            lookupfilter: "IsGroup=0 AND IsActive=1"
        },
        {
            header: 'Chọn (Có/Không)',
            binding: 'CousrseCode',
            width: 100,
            dataType: 'Array',
            hideValueMember: true,
            lookupKey: 'Class',
            lookupfilter: "ParentCode = 'TypeSelect'"
        },
        {
            header: '% giao thầu',
            binding: 'Rate',
            dataType: 'Number',
            width: 70,
            min: 0,
            max: 1,
            format: 'P2'
        },
        {
            header: 'Lý do không chọn',
            binding: 'Reason',
            width: 200
        },
        {
            header: 'Cũ/mới',
            binding: 'TypeCustomer',
            width: 100,
            dataType: 'Array',
            hideValueMember: true,
            lookupKey: 'Class',
            lookupfilter: "ParentCode = 'LoaiDoiTac'"
        },
        {
            header: 'Giá báo lần đầu BCH',
            binding: 'UnitCostFirstBCH',
            dataType: 'Number',
            width: 100,
       
            format: 'N0'
        },
        {
            header: 'Giá báo Final BCH',
            binding: 'UnitCostFinalBCH',
            dataType: 'Number',
            width: 100,
       
            format: 'N0'
        },
      
        {
            header: 'Ghi chú',
            binding: 'Remark',
            width: 300
        },
        {
            header: 'Id hợp đồng',
            binding: 'BizDocId_C1',
            width: 200,
            dataType: 'Array',
            lookupKey: 'BizDoc2',
            bindingList: {
                DocInfo: 'DocInfo',
                
            },
            // displayMember: 'DocInfo',
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
            lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14','HD-07') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
        },
        {
            header: 'Thông tin hợp đồng',
            binding: 'DocInfo',
            width: 200,
            isReadOnly: 'true'
        },
        {
            header: 'Thông tin liên hệ',
            binding: 'Address',
            width: 200
        },
        {
            header: 'Người liên hệ',
            binding: 'ContractPerson',
            width: 100
        },
        {
            header: 'Chức danh',
            binding: 'JobTitle',
            width: 150
        },
        {
            header: 'SĐT liên hệ',
            binding: 'PhoneNo',
            width: 150
        },
        {
            header: 'Email',
            binding: 'Email',
            width: 150
        },
        {
            header: 'Website',
            binding: 'Website',
            width: 150
        },
        {
            header: 'Người giới thiệu',
            binding: 'EmployeeName',
            width: 150
        }
    ];
}