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


export class LayoutApprovedSolPPExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_BizDocVBExplorer',
                FilterKey: "ApproveSend = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'V1' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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

export class LayoutApprovedSolPPEditor implements IEditorFormulaDeclaration {

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
            key: 'IdBizDoc',
        }
    }

    columnsReadOnly = [];

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'SO',
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
                    Name: 'vB30BizDocApprove_AEditContract',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder'
                },                
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder'
                }
            ]
        },
        PrintDocument: {
            Key: 'BizDocViewer',
            Text: 'Mẫu in đề nghị mua hàng',
            Command: 'usp_B30BizDoc_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Đề nghị mua hàng",
                    FileName: "Đề nghị mua hàng - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "BM-F006b-Rev00 De Nghi Mua Hang.docx",
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
                new DateBoxInput({
                    key: 'DocDate',
                    label: 'Ngày lập',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số đơn hàng',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    validators: [Validators.required],
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN ('1','3') AND BranchCode='{VAR=Branch.Ma_Dvcs}'",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: true,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }, this.srv, this.parentData),
                // new TextBoxInput({
                //     key: 'Description',
                //     label: 'Nội dung',
                //     type: 'text',
                //     validators: [Validators.required],
                //     col: 12,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;',
                //     labelCol: 5
                // }),
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
                    labelCol: 5
                }, this.srv, this.parentData),                  
                new LookupBoxInput({
                    key: 'PositionCode',
                    label: 'Cấp bậc duyệt',
                    lookupKey: 'Position',
                    hideValueMember: false,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCodeSend',
                    label: 'Người gửi duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCode',
                    label: 'Người duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Comment',
                    label: 'Ý kiến',
                    col: 12,
                    // style: 'background-color:#F8F0D7;border-radius:8px;'
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
            header: 'Tên hồ sơ',
            binding: 'Description',
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 270,
            dataType: 'Object',
            allowRemove: false,
            allowView: true,
            allowDownLoad: true,
            allowUpload: false,
            folderId: '{EXPR=IdBizDoc}'
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
            width: 100,
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
            width: 150
        },
        {
            header: 'Người thực hiện',
            binding: 'EmployeeName',
            width: 150
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