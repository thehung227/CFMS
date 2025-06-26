import { PanelBase } from "../../ui/panel/PanelBase";
import { TablePanel } from "../../ui/panel/TablePanel";
import { DateBoxInput } from "../../ui/input/DateBoxInput";
import { TextBoxInput } from "../../ui/input/TextBoxInput";
import { LookupBoxInput } from "../../ui/input/LookupBoxInput";
import { Validators } from "@angular/forms";
import { ButtonInput } from "../../ui/input/ButtonInput";
import { CheckBoxInput } from "../../ui/input/CheckBoxInput";
import { NumberBoxInput } from "../../ui/input/NumberBoxInput";
import { IEditorFormulaDeclaration } from "../IEditorDeclare";
import { IExplorerFormulaDeclaration } from "../IExplorerDeclare";
import { UploadInput } from "../../ui/input/UploadInput";
import { MultiSelectInput } from "../../ui/input/MultiSelectInput";
import { SystemConstants } from "../../core/common/system.constants";
import { UploadImage } from "../../ui/input/UploadImage";
import { getElement } from "wijmo/wijmo";
import { RichTextBoxInput } from "../../ui/input/RichTextBoxInput";
import { Global } from "../../shared/global";

// Tài liệu công trường
export class LayoutDocAfterSalesFileExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocVB_Explorer',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND IsActive = 1 AND ISNULL(BranchCode,'') = '{VAR=Branch.Ma_Dvcs}'",
                OrderBy: 'Id', //rất quan trọng, lỗi méo tìm đc đâu
                RowPage: 50
            },
			Child: {
                Name: 'vB30BizDocApprove_ExplorerBizDocVB',
                ParentKey: 'BizDocId',
                ChildKey: 'BizDocId',
                OrderBy: 'ApproveGroup'
            }
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Chấp thuận văn bản - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocVB_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Chấp thuận văn bản",
                    FileName: "Chấp thuận văn bản - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "Don_Gia_Goc_Goi_Thau.docx",
                    // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ],
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'ItemNo',
                    width: 70,
                    dataType: 'String'
                },
                {
                    header: 'Giá trị thực hiện',
                    binding: 'Amount_Th',
                    width: 110,
                    dataType: 'Number'
                }
            ]
        }
    }
    parentGrid = [
        {
            header: 'Số văn bản',
            binding: 'DocNo',
            width: 130,
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
            header: 'Diễn giải',
            binding: 'Description',
            width: 250
        },
        {
            header: 'Phòng/ ban',
            binding: 'ProductName',
            width: 250
        },
        {
            header: 'Ngày hoàn thiện duyệt',
            binding: 'FinishDate',
            width: 180,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Đã gửi duyệt',
            binding: 'ApproveSend',
            width: 150,
            dataType: 'Boolean'
        },
        {
            header: 'Hoàn thành duyệt',
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
            width: 100,
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

export class LayoutDocAfterSalesFileEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocVB_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1,
                    DocCode: 'V7',
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocVBDetail_Edit',
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
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,ParentBizDocId',
            Command: 'usp_B30BizDocApprove_GetData',
            DataMember: '',
            OutputTable: 1
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},BizDocId,{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend == true'
        }
    
    }

    serverConstraint = [

    ]

    serverUpdating = [

    ]

    serverUpdated: string[] = [

    ]

    buttonLoadChild: string[] = [

    ];

    buttonCommand: string[] = [

    ]

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
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                // new TextBoxInput({
                //     key: 'DocNo',
                //     label: 'Số văn bản',
                //     type: 'text',
                //     validators: [Validators.required],
                //     col: 6
                // }),  
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Dự án',
                    lookupKey: 'ProductCost',
                    validators: [Validators.required],
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN ('1','3') AND BranchCode='{VAR=Branch.Ma_Dvcs}'",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: true,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'User01',
                    label: '1. Ông/ Bà',
                    type: 'text',
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Position01',
                    label: 'Chức vụ',
                    type: 'text',
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 6
                }), 
                // new TextBoxInput({
                //     key: 'User02',
                //     label: '2. Ông/ Bà',
                //     type: 'text',
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;',
                //     col: 6
                // }),
                // new TextBoxInput({
                //     key: 'Position02',
                //     label: 'Chức vụ',
                //     type: 'text',
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;',
                //     col: 6
                // }),                                     
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình',
                    lookupKey: 'Approve',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND Ma_Ct='{EXPR=DocCode}'",//"(Code IN (SELECT Code FROM dbo.ufn_Coteccons_Filter_ProcessCodeByBizDocC3('{EXPR=ProductCostId}','{EXPR=ParentBizDocId}','{EXPR=DocCode}','{VAR=Branch.Ma_Dvcs}')))",//('{EXPR=PayTeamType}' = '00') OR 
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    type: 'text',
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 12
                }),  
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi',
                    col: 6,
                    isDisabled: 'true'
                }),
                new CheckBoxInput({
                    key: 'CompletedApprove',
                    label: 'Đã hoàn thiện',
                    isDisabled: 'true',
                    col: 6
                })                         
            ]
        })
    ];

    childColumns = [
        {
            header: 'Hệ thống',
            binding: 'ProductName',
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Lỗi',
            binding: 'ErrorName',
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Vị trí',
            binding: 'PositionName',
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Hình ảnh lỗi',
            binding: 'FilePath',
            width: 300,
            dataType: 'Object',
            allowRemove: false,
            allowView: true,
            allowDownLoad: true,
            allowUpload: false
        },
        {
            header: 'Thời gian',
            binding: 'StartDate',
            width: 120,
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isReadOnly: 'true'
        },
        {
            header: 'Nhà thầu bảo hành',
            binding: 'BuildingContractor',
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Người liên lạc của BQLTN',
            binding: 'EmployeeName',
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Điện thoại',
            binding: 'PhoneNo',
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Email người xử lý',
            binding: 'Email',
            width: 200
        },  
        {
            header: 'Ghi chú',
            binding: 'Remark',
            width: 300
        }
    ]

    childColumns1 = [
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
            width: 250
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 500,
            dataType: 'Object'
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
            header: 'Cấp bậc',
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
            ignoreError: 1,
            isReadOnly: 'true'
        },
        // {
        //     header: 'Số ngày xử lý',
        //     binding: 'NumberOfDays',
        //     width: 70,
        //     isReadOnly: 'true'
        // },
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
    ]

    childColumns3 = [
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
