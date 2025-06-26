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

// Phiếu kế toán khác - Chi phí
export class LayoutJournalEntriesExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30AccDoc_ExploreJournalEntry',
                FilterKey: "BranchCode='{VAR=Branch.Ma_Dvcs}' AND DocCode='PK' AND IsActive=1 AND ProductCostId <> '' AND ProductCostId='{VAR=Filter.ProductCostId}' AND CountCongTrinh<=1",
                OrderBy: 'DocDate DESC,DocNo DESC',
                RowPage: 50
            },
            Child: {
                Name: 'vB30BizDocApprove_AccDocExplorer',
                ParentKey: 'Stt',
                ChildKey: 'BizDocId',
                OrderBy: 'ApproveGroup'
            }
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Phiếu kế toán khác - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30AccDoc_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: 'MAU1',
                    Name: 'Phiếu kế toán khác - Chi phí',
                    FileName: 'Phiếu kế toán - Chi phí - {EXPR=DocNo}',
                    WordName: 'PhieuThuChuyenKhoan.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ]
        }
    }

    // lookup1 = {
    //     Table: 'vB20Item_MenuFilter',
    //     Filter: "IsGroup=1 AND IsActive=1 AND ClassCode3 = 'TM'",// AND IsShowMenuWeb = 1
    //     ColumnFilter: 'ItemGroupCode'
    // }

    // lookup2 = {
    //     Table: 'B00TMCtcDocStatus',
    //     Filter: "IsGroup=0 AND CommandWeb = 'purchasingnote'",
    //     ColumnFilter: 'DocStatusKeyNH'
    // }

    // lookup3 = {
    //     Table: 'B00TMCtcDocStatus',
    //     Filter: "CommandWeb = 'rowsPage'",
    // }

    parentGrid = [
        {
            header: 'Trạng thái',
            binding: 'DocStatusName',
            width: 120,
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
            header: 'Số phiếu',
            binding: 'DocNo',
            width: 100,
            dataType: 'String'
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            width: 250
        },
        {
            header: 'Đối tượng',
            binding: 'CustomerName',
            width: 200
        },
        {
            header: 'Thành tiền',
            binding: 'TotalOriginalAmount',
            width: 110
        },
        // {
        //     header: 'Tiền VAT',
        //     binding: 'TotalOriginalAmount3',
        //     width: 110
        // },
        // {
        //     header: 'Tổng tiền',
        //     binding: 'TotalOriginalAmount',
        //     width: 110
        // },
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
        {
            header: 'Người tạo',
            binding: 'CreateName',
            width: 200,
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
        // {
        //     header: 'Bộ phận',
        //     binding: 'DeptName',
        //     width: 250,
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

export class LayoutJournalEntriesEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    // Khai báo view lấy dữ liệu <Tables> B7
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30AccDoc_EditJournalEntry',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'PK',
                    Id: -1,
                    FiscalYear: new Date((new Date()).getFullYear()),
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    ProductCostId0: '{VAR=Filter.ProductCostId}'
                }
            },
            Child: [
                {
                    Name: 'vB30AccDocJournalEntry_Edit',
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    Sort: 'BuiltinOrder',
                    // DefaultValues: {
                    //     Stt: 'Parent.Stt',
                    //     BuiltinOrder: '1',
                    //     DocDate: 'Parent.DocDate',
                    //     DocCode: 'Parent.DocCode',
                    //     DocGroup: 1,
                    //     BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    //     ProductCostId: 'Parent.ProductCostId',
                    //     CustomerCode: 'Parent.CustomerCode',
                    //     TransCode: 'Parent.TransCode'
                    // }
                },
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.Stt',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    }
                },
                {
                    Name: 'vB30BizDocApprove_EditAccDoc',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.Stt',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId'
                }
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Phiếu yêu cầu xuất hóa đơn - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30AccDoc_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                // {
                //     Layout: 'MAU9',
                //     Name: 'Phiếu yêu cầu xuất hóa đơn',
                //     FileName: 'WorkFlow Hóa đơn - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}',
                //     WordName: 'WorkFlow_YeuCauXuatHoaDon.docx',
                //     FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                // }
            ]
        }
    };

    evaluators = {
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId',
            Command: 'usp_B30BizDocApprove_GetData',
            DataMember: '',
            OutputTable: 2
        },
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},{VAR=EmptyField_BizDocId},{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},ProductCostId,DocCode,Stt',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend',
            zExpr: 'ApproveSend==true && CompletedApprove==false'
        }
    };

    serverConstraint = [

    ];

    serverUpdating = [
        
    ]

    serverUpdated = [
        'Evaluator_UpdateInfo_WhenApproveSend'
    ];

    buttonLoadChild: string[] = [

    ]

    buttonCommand: string[] = [
    ];

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
    ];

    columnsReadOnly = [];

    linkReporter = {

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
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số phiếu',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Đối tượng',
                    lookupKey: 'Customer',
                    binding: {
                        Name: 'Person',
                        Address: 'Address'
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Person',
                    label: 'Họ tên',
                    type: 'text',
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'Address',
                    label: 'Địa chỉ',
                    type: 'text',
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Diễn giải',
                    type: 'text',
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    lookupfilter: "",
                    hideValueMember: true,
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND DocStatus=4 AND Ma_Ct='{EXPR=DocCode}'",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 6
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'TotalOriginalAmount',
                    label: 'TỔNG TIỀN',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'File đính kèm',
                //     col: 6
                // }, this.srv),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    col: 6,
                    isNewRow: true,
                    isDisabled: 'true'
                }),
                new CheckBoxInput({
                    key: 'CompletedApprove',
                    label: 'Đã hoàn thành duyệt',
                    isDisabled: 'true',
                    col: 6
                })
            ]
        })
    ];

    childColumns = [
        {
            header: '',
            binding: 'Button',
            dataType: 'Object',
            isButton: true,
            textButton: 'Xem bill',
            width: 80,
            linkCommand: {
                directory: "{EXPR=DocCodeCCM} == 'P4' ? 'billpaysupp' : {EXPR=DocCodeCCM} == 'P3' ? 'billpaydept' : {EXPR=DocCodeCCM} == 'C5' ? 'settlement' : ''",
                type: 'detail',
                key: 'IdCCM',
                // parameter: { 'Commandkey': 'billpaysupp-editor'}
            }
        },
        {
            header: 'Tk Nợ',
            binding: 'DebitAccount',
            isRequired: true,
            width: 80,
            isReadOnly: 'true'
        },
        {
            header: 'Tk Có',
            binding: 'CreditAccount',
            isRequired: true,
            width: 80,
            isReadOnly: 'true'
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            isRequired: true,
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Đối tượng',
            binding: 'CustomerName',
            width: 250
        },
        {
            header: 'Khoản mục phí',
            binding: 'ExpenseCatgCode',
            width: 100
        },
        {
            header: 'Công trình',
            binding: 'ProductCostInfo',
            width: 250
        },
        {
            header: 'Hợp đồng',
            binding: 'DocInfo_C1',
            width: 200
        },
        {
            header: 'Bill thanh toán',
            binding: 'DocInfo_CCM',
            // isRequired: true,
            // dataType: 'Array',
            // lookupKey: 'ProductCost',
            // lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
            width: 150
        },
        {
            header: 'Thành tiền',
            binding: 'OriginalAmount9',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        }
    ];

    childColumns1 = [
        // {
        //     header: 'Tên tài liệu',
        //     binding: 'Description',
        //     width: 250,
        //     validators: "{EXPR=Description} == ''",
        //     validatorMessage: 'Không được bỏ trắng giá trị',
        //     ignoreError: 1,
        //     isReadOnly: 'true'
        // },
        // {
        //     header: 'Yêu cầu đính kèm',
        //     binding: 'Attached',
        //     dataType: 'Boolean',
        //     width: 80,
        //     isReadOnly: 'true'
        // },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 600,
            dataType: 'Object',
            validators: "{EXPR=FilePath}==0",
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
            width: 120,
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