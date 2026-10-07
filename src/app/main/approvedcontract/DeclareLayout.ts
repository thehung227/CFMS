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

// phê duyệt trình ký hợp đồng, phụ lục
export class LayoutApprovedContractExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_Explorer',
                FilterKey: "ApproveSend = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode IN ('C3','C4') AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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
            header: 'HĐ/PLHĐ',
            binding: 'InfoBudget',
            width: 0,
            dataType: 'String'
        },
        {
            header: 'Gói thầu/ PB',
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

export class LayoutApprovedContractEditor implements IEditorFormulaDeclaration {
    buttonLoadChild: string[];
    serverUpdated: string[];
    buttonCommand: string[];
    constructor(private srv?: any,
        private parentData?: any) { }


    approveGrid = 0;

    evaluators = {
        'Evaluator_ServerUpdating_UpdateStatusByApproveStatus': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,Id,ApproveStatus,{VAR=Branch.Ma_Dvcs},EmployeeCodeNext,DocCode,{VAR=User.Id},Comment,ApproveStatusWeb',
            Command: 'usp_Cotec_UpdateStatusByApproveStatus_SongSong'
        }
    };

    serverConstraint = [
    ]

    serverUpdating = [

    ]

    columnChanged = {

    };

    columnsReadOnly = [];

    linkReporter = {
        'btnPhuLucA': {
            directory: 'unitprice_view',
            type: 'detail',//bao cao: view, explorer: index, editor: detail
            key: 'Id_PLA'
        },
        'btnTaskId': {
            directory: 'investtask',
            type: 'detail',//bao cao: view, explorer: index, editor: detail
            key: 'Id_Task',
            parameter: { 'Commandkey': 'investtask-editor', 'ProductCostId': '{EXPR=ProductCostId}', 'DocDate': '{EXPR=DocDate}'}
        },
        'btnBizDocId_GT': {
            directory: 'regcontract_viewCT',
            type: 'detail',//bao cao: view, explorer: index, editor: detail
            key: 'Id_BizDocId_GT',
            command: "detailc3"
        }
    };

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'ApproveGroup'
                },
                {
                    Name: 'vB30BizDocPayment_EditWeb',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder'
                },
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder'
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
                    Name: 'vB30BizDocAtchDoc',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder'
                },   
                {
                    Name: 'vB20BizDocDiscount',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1'

                    }
                },
                {
                    Name: 'vB20TripartitePayment',
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
            Key: 'BizDocCCMViewer',
            Text: 'Bảng đơn giá, khối lượng - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng đơn giá, khối lượng",
                    FileName: "Bảng đơn giá, khối lượng - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "2.Bang_Don_Gia_Khoi_Luong.docx",
                    ExcelName: "2.Bang_DonGia_KhoiLuong.xlsx",
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
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
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
                new DateBoxInput({
                    key: 'SignDate',
                    label: 'Ngày ký',
                    type: 'date',
                    isReadOnly: 'true',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'LastDocNo',
                    label: 'Số HĐ tay',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    lookupfilter: '',
                    //lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    binding: {
                        ProductType: 'ProductType'
                    },
                    hideValueMember: true,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId0',
                    label: 'Gói thầu thanh toán',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN ('1','3') AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    col: 12,
                    visible: "'{EXPR=ProductType}' == '3'",
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    type: 'text',
                    col: 12,
                    isDisabled: 'true'
                }),
                new MultiSelectInput({
                    key: 'ActivityCode',
                    label: 'Lĩnh vực',
                    lookupKey: 'Activity',
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true',
                }, this.srv),
                new LookupBoxInput({
                    key: 'ContractType',
                    label: 'Loại hợp đồng',
                    validators: [Validators.required],
                    binding: {
                        TaxCode: 'TaxCode'
                    },
                    lookupKey: 'ContractType',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    hideValueMember: false,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new MultiSelectInput({
                    key: 'JobCode',
                    label: 'Công việc',
                    //lookupfilter: "'{EXPR=ActivityCode}'='' OR ActivityCode IN (SELECT Val FROM dbo.ufn_sys_SplitString('{EXPR=ActivityCode}',','))",
                    lookupKey: 'Job',
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
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
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Address',
                    label: 'Địa chỉ',
                    type: 'text',
                    col: 6,
                    isDisabled: 'true'
                }),
                new TextBoxInput({
                    key: 'ContactPerson',
                    label: 'Đại diện ký HĐ',
                    type: 'text',
                    col: 6,
                    validators: [Validators.required],
                    isDisabled: 'true'
                }),
                new LookupBoxInput({
                    key: 'Position',
                    label: 'Chức vụ',
                    lookupKey: 'JobPositionCCM',
                    lookupfilter: 'IsActive=1 AND IsGroup=0',
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'AuthorizeNo',
                    label: 'Ủy quyền số',
                    type: 'text',
                    col: 6,
                    isDisabled: 'true'
                }),
                new DateBoxInput({
                    key: 'AuthorizeDate',
                    label: 'Ngày UQ',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isDisabled: 'true'
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
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'CusBankName',
                    label: 'Ngân hàng',
                    type: 'text',
                    col: 6,
                    isDisabled: 'true',
                    validators: [Validators.required]
                }),
                new LookupBoxInput({
                    key: 'CurrencyCode',
                    label: 'Mã tiền tệ',
                    lookupKey: 'Currency',
                    lookupfilter: "IsActive=1 AND IsGroup=0",
                    hideValueMember: false,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'BizDocId_PL',
                    label: 'Phụ lục, Khối lượng',
                    lookupKey: 'BizDocCCM',
                    lookupfilter: "IsActive=1 AND DocCode = 'PL' AND CustomerCode='{EXPR=CustomerCode}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=BizDocId}'",// AND ParentBizDocId='{EXPR=BizDocId}'",
                    binding: {
                        OriginalAmount: 'ContractValue',
                        Id: 'Id_PLA'
                    },
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    hideValueMember: true
                }, this.srv, this.parentData),

                new NumberBoxInput({
                    key: 'ContractValue',
                    label: 'Giá trị HĐ (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new CheckBoxInput({
                    key: 'ValueByConstructReal',
                    label: 'GTHĐ theo t. tế thi công',
                    col: 6,
                    isDisabled: 'true'
                }),
                new LookupBoxInput({
                    key: 'BizDocId_GT',
                    label: 'Phiếu giao thầu, giao việc',
                    lookupKey: 'BizDoc_CTC',
                    binding: {
                    },
                    // validators: [Validators.required],
                    lookupfilter: "DocCode = 'C3'",
                    hideValueMember: true,
                    col: 6,
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Discount',
                    label: 'Hợp đồng có chiết khấu',
                    col: 6,
                    isDisabled: 'true',
                    isNewRow: 'true'
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
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'ContractValueAddVAT',
                    label: 'Giá trị HĐ (gồm VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'PercentOfWarranty',
                    label: '% bảo hành',
                    type: 'number',
                    format: 'P2',
                    min: 0,
                    max: 1,
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'ValueOfWarranty',
                    label: 'GT bảo hành (có VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'DayOfWarranty',
                    label: 'Thời hạn bảo hành (tháng)',
                    type: 'number',
                    col: 6,
                    isDisabled: 'true'
                }),
                new TextBoxInput({
                    key: 'Remark',
                    label: 'Ghi chú',
                    type: 'text',
                    col: 12,
                    isDisabled: 'true'
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsGroup=0",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ClassCode1',
                    label: 'TT back theo CĐT',
                    lookupKey: 'Class',
                    lookupfilter: "IsActive=1 AND ParentCode='DT_CDT_CD'",
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'TransType',
                    label: 'Bao thanh toán',
                    lookupKey: 'Class',
                    lookupfilter: "IsActive=1 AND ParentCode='LOAITT'",
                    hideValueMember: false,
                    styleLabel: 'color:red;font-size:20px;',
                    // style: 'font-size:20px; font-weight:bold; -webkit-animation: my 700ms infinite; -moz-animation: my 700ms infinite; -o-animation: my 700ms infinite; animation: my 700ms infinite;',
                    col: 6,
                    
                }, this.srv, this.parentData),   
                new LookupBoxInput({
                    key: 'ClassCode3',
                    label: 'Thanh toán 3 bên',
                    lookupKey: 'Class',
                    lookupfilter: "IsActive=1 AND ParentCode='LOAITT'",
                    hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),  
                new ButtonInput({
                    key: 'btnBizDocId_GT',
                    label: 'Xem phiếu giao thầu',
                    col: 6
                }), 
                new LookupBoxInput({
                    key: 'BizDocId_GT',
                    label: 'Phiếu giao thầu, giao việc',
                    lookupKey: 'BizDoc_CTC',
                    binding: {
                        Id: 'Id_BizDocId_GT'
                    },
                    // validators: [Validators.required],
                    lookupfilter: "DocCode = 'C3'",
                    hideValueMember: true,
                    col: 6,
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
                    isDisabled: 'true',
                    binding: {
                        Id: 'Id_Task'
                    },
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                    col: 6
                }, this.srv, this.parentData),   
                new NumberBoxInput({
                    key: 'NumberOfDays',
                    label: 'Số ngày thực hiện',
                    type: 'number',
                    dataType: 'n0',
                    isDisabled: 'true',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'DeptCode',
                    label: 'Bộ phận',
                    lookupKey: 'Dept',
                    hideValueMember: false,
                    isReadOnly: 'true',
                   
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'PositionCode',
                    label: 'Cấp bậc duyệt',
                    lookupKey: 'Position',
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCode',
                    label: 'Người duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 6
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'OperationCode',
                    label: '123',
                    type: 'text',
                    col: 6,
                    visible: 'false'
                }),
                new TextBoxInput({
                    key: 'ProcessTypeCode',
                    label: 'ProcessTypeCode',
                    type: 'text',
                    col: 6,
                    visible: 'false'
                }),
                new LookupBoxInput({
                    key: 'ProcessCodeNext',
                    label: 'Quy trình duyệt tiếp theo',
                    lookupKey: 'Process',
                    visible: "'{EXPR=OperationCode}' == 'Y'",
                    lookupfilter: "ProcessTypeCode = '{EXPR=ProcessTypeCode}' AND ProcessSegment = 'PS02' AND Code IN (SELECT Code FROM dbo.ufn_Coteccons_Filter_ProcessCodeByProduct('{EXPR=ProductCostId}','{EXPR=ActivityCode}','{EXPR=ContractType}','{VAR=Branch.Ma_Dvcs}'))",
                    hideValueMember: false,
                    
                    col: 12,
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }, this.srv, this.parentData),
                new RichTextBoxInput({
                    key: 'Comment',
                    label: 'Ý kiến',
                    col: 12
                }),
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'File đính kèm HĐ đã ký',
                //     col: 6,
                //     isOnlyDownload: true,
                //     folderId: '{EXPR=IdBizDoc}'
                // }, this.srv)
            ]
        })
    ];

    childColumns = [
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
            width: 250
        },
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
    ];

    childColumns1 = [
        {
            header: 'Phương thức',
            binding: 'ClassCode1',
            width: 70,
            dataType: 'Array',
            lookupKey: 'Class',
            bindingList: {
                Name: 'Description'
            },
            lookupfilter: "ParentCode='PaymentType' AND Code IN ('00','01','02','03','04','05','06')"
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
            header: 'Tỉ lệ (%) (CĐT)',
            binding: 'PayPercent_C2',
            dataType: 'Number',
            width: 70,
            format: 'P2'
        },
         {
            header: 'Thời hạn (CĐT) (Ngày)',
            binding: 'NumberOfDay_C2',
            dataType: 'Number',
            width: 150
        },
    ];

    childColumns2 = [
        {
            header: 'Mã tài liệu',
            binding: 'DocumentCode',
            width: 80,
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
            allowRemove: false,
            allowView: true,
            allowDownLoad: true,
            allowUpload: false,
            folderId: '{EXPR=IdBizDoc}'
        }
    ];

    childColumns3 = [
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

    childColumns4 = [
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

    childColumns5 = [
        {
            header: 'Mã tài liệu',
            binding: 'DocumentCode',
            width: 80,
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
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 600,
            dataType: 'Object',
            allowRemove: false,
            allowView: true,
            allowDownLoad: true,
            allowUpload: false,
            folderId: '{EXPR=IdBizDoc}'
        }
    ];
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

    childColumns7 = [
       {
            header: 'NCC',
            binding: 'CustomerCode',
            width: 100,
            dataType: 'Array',
            lookupKey: 'Customer_CCM2',
            bindingList: {
                Name: 'CustomerName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND Code LIKE 'SI-%'",
        },
        {
            header: 'Tên NCC',
            binding: 'CustomerName',
            allowEditing: false,
            width: 300,
            isReadOnly: 'true'
        },
         {
            header: 'Id hợp đồng',
            binding: 'BizDocId_C1',
            width: 200,
            dataType: 'Array',
            lookupKey: 'BizDoc2',
            bindingList: {
                DocInfo: 'DocInfo',
                ContractType: 'ContractType'
            },
            // displayMember: 'DocInfo',
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
            lookupfilter: "((DocCode = 'C3' AND ClassCode3 = '01' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}'))"
        },
        {
            header: 'Thông tin hợp đồng',
            binding: 'DocInfo',
            width: 200,
            isReadOnly: 'true'
        },
        {
            header: 'Loại hợp đồng',
            binding: 'ContractType',
            width: 100,
            isReadOnly: 'true'
        },
    ]
}

export class LayoutApprovedAppendixEditor implements IEditorFormulaDeclaration {

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

    approveGrid = 0;

    serverConstraint = [
    ]

    serverUpdating = [

    ]

    columnChanged = {

    };

    columnsReadOnly = [];

    linkReporter = {
        'btnPhuLucA': {
            directory: 'unitprice_view',
            type: 'detail',
            key: 'Id_PLA'
        },
        'btnHdPl': {
            directory: 'regcontract_viewCT',
            type: 'detail',
            command: "detailc3",
            key: 'Id_HdPl'
        }
    };

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'ApproveGroup'
                },
                {
                    Name: 'vB30BizDocPayment_EditWeb',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder'
                },
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder'
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
                    Name: 'vB30BizDocAtchDoc',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder'
                },     
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Bảng đơn giá, khối lượng - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng đơn giá, khối lượng",
                    FileName: "Bảng đơn giá, khối lượng - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "2.Bang_Don_Gia_Khoi_Luong.docx",
                    ExcelName: "2.Bang_DonGia_KhoiLuong.xlsx",
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
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new DateBoxInput({
                    key: 'SignDate',
                    label: 'Ngày ký',
                    type: 'date',
                    isReadOnly: 'true',
                    format: 'dd/MM/yyyy',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    lookupfilter: '',
                    //lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    binding: {
                        ProductType: 'ProductType'
                    },
                    hideValueMember: true,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId0',
                    label: 'Gói thầu thanh toán',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN ('1','3') AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    col: 12,
                    visible: "'{EXPR=ProductType}' == '3'",
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Hợp đồng',
                    lookupKey: 'BizDoc_CTC',
                    lookupfilter: "DocCode = ('C3') AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND DocDate <= '{EXPR=DocDate}' AND ProductCostId='{EXPR=ProductCostId}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    binding: {
                        CustomerCode: 'CustomerCode',
                        ContactPerson: 'ContactPerson',
                        Position: 'Position',
                        AuthorizeNo: 'AuthorizeNo',
                        AuthorizeDate: 'AuthorizeDate',
                        ContractValue: 'ContractValue',
                        ContractType: 'ContractType',
                        ActivityCode: 'ActivityCode',
                        JobCode: 'JobCode',
                        CusBankAccountNo: 'CusBankAccountNo',
                        ProcessCode: 'ProcessCode',
                        Id: 'Id_HdPl'
                    },
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung phụ lục',
                    type: 'text',
                    col: 12,
                    isDisabled: 'true'
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
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),

                new MultiSelectInput({
                    key: 'ActivityCode',
                    label: 'Lĩnh vực',
                    lookupKey: 'Activity',
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 6
                }, this.srv),
                new MultiSelectInput({
                    key: 'JobCode',
                    label: 'Công việc',
                    //lookupfilter: "'{EXPR=ActivityCode}'='' OR ActivityCode IN (SELECT Val FROM dbo.ufn_sys_SplitString('{EXPR=ActivityCode}',','))",
                    lookupKey: 'Job',
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Đối tác',
                    validators: [Validators.required],
                    lookupKey: 'Customer_CCM2',
                    lookupfilter: "(('{EXPR=ProductType}'=3 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%') OR Code IN (SELECT A.CustomerCode FROM B30CCMBudgetDetail A INNER JOIN B30CCMBudget B ON A.CCMBudgetId = B.CCMBudgetId WHERE (A.CompletedApproveDetail=1 OR A.Loai_Dt = 'DTC') AND B.CompletedApprove=1 AND B.IsActive=1 AND B.DocCode='K1' AND B.ProductCostId ='{EXPR=ProductCostId}' GROUP BY A.CustomerCode UNION ALL SELECT CustomerCode FROM dbo.B10NotCheckBill WHERE (('{EXPR=DocDate}' BETWEEN BeginDate AND EndDate AND EndDate IS NOT NULL) OR (BeginDate <= '{EXPR=DocDate}' AND EndDate IS NULL)) AND IsActive = 1 AND ProductCostId = '{EXPR=ProductCostId}'))",
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
                    binding: {
                        Description: 'CusBankName'
                    },
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
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
                    col: 6,
                    isDisabled: 'true'
                }),
                new TextBoxInput({
                    key: 'ContactPerson',
                    label: 'Đại diện ký HĐ',
                    type: 'text',
                    col: 6,
                    isDisabled: 'true'
                }),
                new LookupBoxInput({
                    key: 'Position',
                    label: 'Chức vụ',
                    lookupKey: 'JobPositionCCM',
                    lookupfilter: 'IsActive=1 AND IsGroup=0',
                    hideValueMember: false,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'AuthorizeNo',
                    label: 'Ủy quyền số',
                    type: 'text',
                    col: 6,
                    isDisabled: 'true'
                }),
                new DateBoxInput({
                    key: 'AuthorizeDate',
                    label: 'Ngày UQ',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isDisabled: 'true'
                }),
                new LookupBoxInput({
                    key: 'CurrencyCode',
                    label: 'Mã tiền tệ',
                    lookupKey: 'Currency',
                    lookupfilter: "IsActive=1 AND IsGroup=0",
                    hideValueMember: false,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'ContractValue',
                    label: 'Giá trị HĐ (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'SubContractBeforeValue',
                    label: 'Giá trị PL trước (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'BizDocId_PL',
                    label: 'Phụ lục, Khối lượng',
                    lookupKey: 'BizDocCCM',
                    lookupfilter: "IsActive=1 AND DocCode = 'PL' AND CustomerCode='{EXPR=CustomerCode}' AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=BizDocId}'",// AND ParentBizDocId='{EXPR=BizDocId}'",
                    binding: {
                        OriginalAmount: 'SubContractValue'
                    },
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    hideValueMember: true
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'SubContractValue0',
                    label: 'Giá trị PL (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'SubContractValue',
                    label: 'GT điều chỉnh (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new CheckBoxInput({
                    key: 'ValueByConstructReal',
                    label: 'GT PLHĐ theo t. tế thi công',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'TotalOfValue',
                    label: 'Tổng giá trị HĐ (chưa VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
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
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'TotalOfValueAddVAT',
                    label: 'Tổng giá trị HĐ (gồm VAT)',
                    type: 'number',
                    isUsingLabel: false,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'DayOfWarranty',
                    label: 'Thời hạn bảo hành (tháng)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new CheckBoxInput({
                    key: 'IsDiscount',
                    label: 'Hợp đồng có chiết khấu',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Remark',
                    label: 'Ghi chú',
                    type: 'text',
                    col: 12,
                    isDisabled: 'true'
                }),
                new TextBoxInput({
                    key: 'OperationCode',
                    label: '123',
                    type: 'text',
                    col: 6,
                    visible: 'false'
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsGroup=0",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'TransType',
                    label: 'Bao thanh toán',
                    lookupKey: 'Class',
                    styleLabel: 'color:red;font-size:20px;',
                    lookupfilter: "IsActive=1 AND ParentCode='LOAITT'",
                    hideValueMember: false,
                    col: 6,
                    
                }, this.srv, this.parentData),   
                new CheckBoxInput({
                    key: 'AdjustedPay',
                    label: 'Điều chỉnh PTTT',
                    col: 6,
                    isDisabled: 'true'
                }),
                new ButtonInput({
                    key: 'btnHdPl',
                    label: 'Xem hợp đồng',
                    style: 'background-color:#9cc09c;',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'NumberOfDays',
                    label: 'Số ngày thực hiện',
                    type: 'number',
                    dataType: 'n0',
                    isDisabled: 'true',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'DeptCode',
                    label: 'Bộ phận',
                    lookupKey: 'Dept',
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'PositionCode',
                    label: 'Cấp bậc duyệt',
                    lookupKey: 'Position',
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCode',
                    label: 'Người duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 6
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'OperationCode',
                    label: '123',
                    type: 'text',
                    col: 6,
                    visible: 'false'
                }),
                new TextBoxInput({
                    key: 'ProcessTypeCode',
                    label: '456',
                    type: 'text',
                    col: 6,
                    visible: 'false'
                }),
                new LookupBoxInput({
                    key: 'ProcessCodeNext',
                    label: 'Quy trình duyệt tiếp theo',
                    lookupKey: 'Process',
                    visible: "'{EXPR=OperationCode}' == 'Y'",
                    lookupfilter: "ProcessTypeCode = '{EXPR=ProcessTypeCode}' AND ProcessSegment = 'PS02' AND Code IN (SELECT Code FROM dbo.ufn_Coteccons_Filter_ProcessCodeByProduct('{EXPR=ProductCostId}','{EXPR=ActivityCode}','{EXPR=ContractType}','{VAR=Branch.Ma_Dvcs}'))",
                    hideValueMember: false,
                    
                    col: 12,
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }, this.srv, this.parentData),
                new RichTextBoxInput({
                    key: 'Comment',
                    label: 'Ý kiến',
                    col: 12
                }),
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'File PLHĐ đã ký',
                //     col: 6,
                //     isOnlyDownload: true,
                //     folderId: '{EXPR=IdBizDoc}'
                // }, this.srv)
            ]
        })
    ];

    childColumns = [
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
            width: 250
        },
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
    ];

    childColumns1 = [
        {
            header: 'Phương thức',
            binding: 'ClassCode1',
            width: 70,
            dataType: 'Array',
            lookupKey: 'Class',
            bindingList: {
                Name: 'Description'
            },
            lookupfilter: "ParentCode='PaymentType' AND Code IN ('00','01','02','03','04','05','06')"
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
            header: 'Tỉ lệ (%) (CĐT)',
            binding: 'PayPercent_C2',
            dataType: 'Number',
            width: 70,
            format: 'P2'
        },
         {
            header: 'Thời hạn (CĐT) (Ngày)',
            binding: 'NumberOfDay_C2',
            dataType: 'Number',
            width: 150
        },
    ]

    childColumns2 = [
        {
            header: 'Mã tài liệu',
            binding: 'DocumentCode',
            width: 80,
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
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 600,
            dataType: 'Object',
            allowRemove: false,
            allowView: true,
            allowDownLoad: true,
            allowUpload: false,
            folderId: '{EXPR=IdBizDoc}'
        }
    ]

    childColumns3 = [
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

    childColumns4 = [
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
        
    childColumns5 = [
        {
            header: 'Mã tài liệu',
            binding: 'DocumentCode',
            width: 80,
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
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 600,
            dataType: 'Object',
            allowRemove: false,
            allowView: true,
            allowDownLoad: true,
            allowUpload: false,
            folderId: '{EXPR=IdBizDoc}'
        }
    ];

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
