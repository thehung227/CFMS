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


export class LayoutApprovedSpendingPlanExplorer implements IExplorerFormulaDeclaration {
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

export class LayoutApprovedSpendingPlanEditor implements IEditorFormulaDeclaration {

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
        'btnHdPl': {
            directory: 'consdocumentfile',
            type: 'detail',
            key: 'IdBizDocVB',
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
                    Name: 'B30CCMBudgetWorkdone',
                    ParentKey: 'BizDocId',
                    ChildKey: 'CCMBudgetId',
                    // Sort: 'BuiltinOrder',
                    DefaultValues: {
                        CCMBudgetId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
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
                    FileName: "Bảng tổng hợp kế hoạch chi tết - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "BM_KeHoachChiTet.docx",
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
                    style: 'background-color:#F1EDED;border-radius:8px;',
                  
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số văn bản',
                    type: 'text',
                   
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                  
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ Phòng ban',
                    lookupKey: 'ProductCost',
                   
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN ('1','3') AND BranchCode='{VAR=Branch.Ma_Dvcs}'",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: true,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                  
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
               
                }),
                // new LookupBoxInput({
                //     key: 'CustomerCode',
                //     label: 'Khách hàng',
                //     lookupKey: 'Customer',
                //     lookupfilter: '',
                //     validators: [Validators.required],
                //     hideValueMember: false,
                //     col: 12,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;',
                //     labelCol: 5
                // }, this.srv, this.parentData),
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
                // new LookupBoxInput({
                //     key: 'ClassCode1',
                //     label: 'Loại văn bản',
                //     lookupKey: 'Class',
                //     validators: [Validators.required],
                //     lookupfilter: "IsGroup=0 AND IsActive=1",
                //     hideValueMember: true,
                //     col: 12,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;',
                //     labelCol: 5
                // }, this.srv, this.parentData),                   
                // new TextBoxInput({
                //     key: 'DocNoReplace',
                //     label: 'Thay thế văn bản',
                //     type: 'text',
                //     col: 12,
                //     isDisabled: 'true',
                //     labelCol: 5
                // }),          
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
            width: 50,
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
            header: 'GTTT của C.việc TC tháng 11/23 (chưa TC) (1)',
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
            header: 'GTTT của C.việc TC tháng 12/23 (chưa TC) (2)',
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
            header: 'GTTT của C.việc TC tháng 1/24 (chưa TC) (3)',
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


    childColumns4 = [
     
        {
            header: 'Mã',
            binding: 'JobCode',
            width: 200,
            isReadOnly: 'true'
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            width: 800,
            isReadOnly: 'true'
        },
       
        {
            header: 'Số tiền',
            binding: 'Amount',
            dataType: 'Number',
            width: 150
        }
                                                      
       
    ];
}