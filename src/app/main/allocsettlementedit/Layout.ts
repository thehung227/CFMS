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
export class LayoutAllocSettlementEditExplorer implements IExplorerFormulaDeclaration {

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocCCM_Explore',
                //FilterKey: "(ProductCostId0 = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode IN ('P5') AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId0 IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                FilterKey: "((ProductCostId = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'P5' AND IsActive=1 AND PayTeamType IN ('02') AND ApproveSend=1)",
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
            Text: 'TBTT chi phí phân bổ - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "TBTT chi phí phân bổ",
                    FileName: "TBTT chi phí phân bổ - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "10.TBTT_Thue_MuaHang.docx",
                    ExcelName: "",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: "MAU2",
                    Name: "Bảng KLTT chi phí phân bổ",
                    FileName: "Bảng KTLL chi phí phân bổ - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "Bang_KLTT_Bill_ChiPhi_PhanBo.docx",
                    ExcelName: "5.Bang_KLTT_NTP_NCC.xlsx",
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
        // {
        //     header: 'Đợt TT số',
        //     binding: 'PayRequireNum',
        //     width: 100,
        //     dataType: 'String'
        // },
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
            header: 'Tổng GTTT đến kỳ trước',
            binding: 'Amount_TTKyTruoc',
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
        // {
        //     header: 'Gói thầu/ PB',
        //     binding: 'ProductName',
        //     width: 300,
        //     dataType: 'String'
        // },
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

export class LayoutAllocSettlementEditEditor implements IEditorFormulaDeclaration {

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
                    PayTeamType: '02'
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
                    IsView: 'view', // chỉ hiển thị, không lưu
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
                    IsView: 'view', // chỉ hiển thị, không lưu
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
                    IsView: 'view', // chỉ hiển thị, không lưu
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                }
               
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'TBTT chi phí phân bổ - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}',
            Command: 'usp_B30BizDocCCM_VoucherForm_TachBill',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "TBTT chi phí phân bổ",
                    FileName: "TBTT chi phí phân bổ - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "10.TBTT_Thue_MuaHang.docx",
                    ExcelName: "",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: "MAU2",
                    Name: "Bảng KLQT chi phí phân bổ",
                    FileName: "Bảng KTQL chi phí phân bổ - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "Bang_KLQT_Bill_ChiPhi_PhanBo.docx",
                    ExcelName: "11.Bang_KLQT_Ver2_PhanBo.xlsx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: "MAU3",
                    Name: "Biên bản thanh lý",
                    FileName: "Biên bản thanh lý - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "ED-F19 Bien ban quyet toan HD mua ban - Bill phan bo.docx",
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

    // Màn điều chỉnh: KHÔNG khai báo evaluator nào để
    //  - không validate số liệu (serverUpdating rỗng, bỏ Validators.required),
    //  - không tự tính lại số liệu trên form/lưới và sau khi lưu (columnChanged*, serverUpdated rỗng),
    //  - không tải lại / chạy lại quy trình duyệt (không có nút Gửi duyệt, Tải dữ liệu).
    evaluators = {};

    serverConstraint: string[] = [];

    serverUpdating: string[] = [];

    serverUpdated: string[] = [];

    buttonLoadChild: string[] = [];

    buttonCommand: string[] = [];

    columnChanged: any = {};

    columnChangedChild = [];

    columnsReadOnly = [];

    linkReporter = {
        'btnHdPl': {
            directory: 'regcontract_view',
            type: 'detail',
            command: "{EXPR=DocCode_HdPl} == 'C3' ? 'detailc3' : {EXPR=DocCode_HdPl} == 'C4' ? 'detailc4' : ''",
            key: 'Id_HdPl'
        }
    }

    // Trường định danh / quy trình: chỉ xem. Trường số liệu: cho sửa tự do, không validate, không tính lại.
    panels: PanelBase[] = [
        new TablePanel({
            label: 'Thông tin hồ sơ',
            col: 12,
            controls: [
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số hồ sơ',
                    dataType: 'text',
                    col: 6,
                    isDisabled: 'true'
                }),
                new DateBoxInput({
                    key: 'DocDate',
                    label: 'Ngày lập',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    col: 6,
                    isDisabled: 'true'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    col: 12,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Hợp đồng',
                    lookupKey: 'BizDoc_CTC',
                    lookupfilter: "BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    col: 12,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Nhà cung cấp',
                    lookupKey: 'Customer_CCM2',
                    hideValueMember: false,
                    col: 12,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'PayTeamType',
                    label: 'Loại thanh toán',
                    lookupKey: 'Class',
                    lookupfilter: "ParentCode='PayTeamType'",
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'JobCode',
                    label: 'Công việc',
                    lookupKey: 'Job_CCM',
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ContractType',
                    label: 'Loại hợp đồng',
                    lookupKey: 'ContractType',
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CurrencyCode',
                    label: 'Mã tiền tệ',
                    lookupKey: 'Currency',
                    lookupfilter: "IsActive=1 AND IsGroup=0",
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'ContractValue',
                    label: 'Giá trị HĐ (chưa VAT)',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'SubContractValue',
                    label: 'Giá trị PLHĐ (chưa VAT)',
                    col: 6,
                    isDisabled: 'true'
                }),
                new NumberBoxInput({
                    key: 'Amount_HDPL',
                    label: 'Giá trị HĐ + PLHĐ (chưa VAT)',
                    col: 6,
                    isDisabled: 'true'
                }),
                new ButtonInput({
                    key: 'btnHdPl',
                    label: 'Xem hợp đồng',
                    col: 6
                }),

                // ----- Số liệu được phép điều chỉnh -----
                new LookupBoxInput({
                    key: 'TaxCode',
                    label: 'Thuế',
                    lookupKey: 'Tax',
                    lookupfilter: "Type=1 AND IsActive=1 AND IsGroup=0 AND IsDefault = 1",
                    binding: {
                        Rate: 'TaxRate'
                    },
                    hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'Amount_TamUng',
                    label: 'Giá trị tạm ứng',
                    type: 'number',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_HoanTra',
                    label: 'Giá trị hoàn trả tạm ứng',
                    type: 'number',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_ThiCongNotVAT',
                    label: 'Tổng giá trị thi công (chưa VAT)',
                    type: 'number',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_ThiCong',
                    label: 'Tổng giá trị thi công (gồm VAT)',
                    type: 'number',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_THDenKyNayNotVAT',
                    label: 'Tổng GTTH đến kỳ này (chưa VAT)',
                    type: 'number',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_THDenKyNay',
                    label: 'Tổng GTTH đến kỳ này (gồm VAT)',
                    type: 'number',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_TTKyTruoc',
                    label: 'Tổng GTTT đến kỳ trước',
                    type: 'number',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_TongTTDenKyNay',
                    label: 'Tổng GTTT đến kỳ này',
                    type: 'number',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'Amount_DeNghiTT',
                    label: 'Giá trị đề nghị thanh toán',
                    type: 'number',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Ghi chú',
                    dataType: 'text',
                    col: 12
                }),

                // ----- Tiến độ luân chuyển hồ sơ (cùng key/nhãn với settlement_doc) -----
                // 5 cột Date_CCMPrint, Ngay_Phan_Phoi, Date_ReceiveFromCustomer, Date_BHC, Remark2
                // được thêm vào B30BizDocCCM bởi database/allocsettlementedit/02_add_columns_B30BizDocCCM.sql
                new DateBoxInput({
                    key: 'Date_CCMPrint',
                    label: 'Ngày CCM hoàn thành',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    style: 'background-color:#FAF5D0;border-radius:8px;',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'Ngay_Phan_Phoi',
                    label: 'Chuyển cho đối tác',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    style: 'background-color:#FAF5D0;border-radius:8px;',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'ConfirmedDate',
                    label: 'Ngày GĐDA ký',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    style: 'background-color:#FAF5D0;border-radius:8px;',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'Date_ReceiveFromCustomer',
                    label: 'Nhận từ đối tác',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    style: 'background-color:#FAF5D0;border-radius:8px;',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'FinishedDate',
                    label: 'Ngày đóng dấu',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    style: 'background-color:#FAF5D0;border-radius:8px;',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'HandoverDate',
                    label: 'Ngày chuyển kế toán',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    style: 'background-color:#FAF5D0;border-radius:8px;',
                    col: 6
                }),
                new DateBoxInput({
                    key: 'Date_BHC',
                    label: 'Ngày chuyển BCH',
                    dataType: 'date',
                    format: 'dd/MM/yyyy',
                    style: 'background-color:#FAF5D0;border-radius:8px;',
                    col: 6
                }),
                new TextBoxInput({
                    key: 'Remark2',
                    label: 'Thông tin khác',
                    dataType: 'text',
                    col: 6
                }),

                // ----- Trạng thái & tài liệu -----
                new UploadInput({
                    key: 'FilePath',
                    label: 'Đính kèm hồ sơ đã ký',
                    col: 6
                }, this.srv),

                // ----- Quy trình duyệt: chỉ xem -----
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    col: 6,
                    isDisabled: 'true'
                }),
                new CheckBoxInput({
                    key: 'CompletedApprove',
                    label: 'Đã hoàn thiện duyệt',
                    col: 6,
                    isDisabled: 'true'
                })
            ]
        })
    ];

    childColumns = [
        {
            header: 'Id gói thầu',
            dataType: 'Array',
            binding: 'ProductCostId',
            lookupKey: 'ProductCost',
            bindingList: {
                ProductCostInfo: 'ProductCostInfo'
            },
            lookupfilter: "ProductType IN (1,3) AND IsGroup = 0 AND IsActive = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}'",
            hideValueMember: true,
            width: 120
        },
        {
            header: 'Tên gói thầu',
            binding: 'ProductCostInfo',
            width: 250
        },
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 70
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            allowEditing: false,
            width: 250
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 50
        },
        // {
        //     header: 'KL hợp đồng',
        //     binding: 'Quantity_Hd',
        //     dataType: 'Number',
        //     width: 100,
        //     format: 'n3',
        //     isReadOnly: 'true',
        //     // exprReadOnly: '1==1'
        // },
        // {
        //     header: 'Khối lượng',
        //     binding: 'Quantity9',
        //     dataType: 'Number',
        //     // validators: "{EXPR=Quantity9} > {EXPR=Quantity_Hd}",
        //     // validatorMessage: 'Khối lượng thi công không được vượt quá khối lượng hợp đồng',
        //     // ignoreError: 1,
        //     width: 100,
        //     format: 'n3'
        // },
        // {
        //     header: 'Đơn giá',
        //     binding: 'OriginalUnitCost',
        //     dataType: 'Number',
        //     width: 150,
        //     format: 'n2',
        //     exprReadOnly: "{EXPR=InheritanceRowIdPL} != ''"
        // },
        // {
        //     header: 'Lũy kế đến kỳ trước (gồm VAT)',
        //     binding: 'PaymentAmount',
        //     dataType: 'Number',
        //     width: 150,
        //     // isReadOnly: 'true'
        // },
        {
            header: 'Giá trị kỳ này (chưa VAT)',
            binding: 'OriginalAmount',
            width: 150,
            dataType: 'Number'
            // //exprFormat: "'{EXPR=CurrencyCode}' == 'VND' ? 'n0' : 'n2'"
        },
        {
            header: 'Loại thuế',
            binding: 'TaxCode',
            width: 100,
            dataType: 'Array',
            lookupKey: 'Tax',
            bindingList: {
                Rate: 'TaxRate'
            },
            lookupfilter: "Type=1 AND IsActive=1 AND IsGroup=0 AND IsDefault = 1",
            // isReadOnly: 'true'
        },
        {
            header: '% VAT',
            binding: 'TaxRate',
            width: 80
        },
        {
            header: 'Tiền thuế',
            binding: 'OriginalAmount3',
            dataType: 'Number',
            width: 150,
            // isReadOnly: 'true'
        },
        {
            header: 'Tổng tiền',
            binding: 'TotalOriginalAmount',
            dataType: 'Number',
            width: 150
        },
        {
            header: '% thực hiện',
            binding: 'Percent_Th',
            dataType: 'Number',
            width: 110,
            format: 'p2'
        },
        {
            header: 'Giá trị thực hiện (Chưa VAT)',
            binding: 'Amount_ThNotVAT',
            width: 150,
            dataType: 'Number'
            //exprFormat: "'{EXPR=CurrencyCode}' == 'VND' ? 'n0' : 'n2'"
        },
        {
            header: 'Giá trị thực hiện',
            binding: 'Amount_Th',
            width: 150,
            dataType: 'Number'
            //exprFormat: "'{EXPR=CurrencyCode}' == 'VND' ? 'n0' : 'n2'"
        },
        {
            header: 'Ghi chú',
            binding: 'Remark',
            allowEditing: true,
            width: 200
        },
        // {
        //     header: 'Mã chi phí',
        //     binding: 'Ma_QLKL',
        //     dataType: 'Array',
        //     lookupKey: 'DmQLKL',
        //     lookupfilter: 'IsGroup=0 AND IsActive=1',
        //     width: 150
        // },
        // {
        //     header: 'Mã khấu trừ',
        //     binding: 'Ma_KhauTru',
        //     dataType: 'Array',
        //     lookupKey: 'DmKhauTru',
        //     lookupfilter: 'IsActive=1',
        //     width: 100
        // },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 50,
            isReadOnly: 'true'
        },
        {
            header: 'Bậc',
            binding: 'Level',
            dataType: 'Number',
            width: 0,
            format: 'n0',
            isReadOnly: 'true'
        },
        {
            header: 'Công thức',
            binding: 'Formula',
            width: 300,
            isReadOnly: 'true'
        },
        {
            header: 'Dòng kế thừa PL',
            binding: 'InheritanceRowIdPL',
            width: 0,
            isReadOnly: 'true'
        },
        {
            header: 'Dòng kế thừa',
            binding: 'InheritanceRowId',
            width: 0,
            isReadOnly: 'true'
        },
    ]

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
            lookupKey: 'Employee'
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
            width: 120
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

     childColumns4 = [
         {
            header: 'Chọn hóa đơn',
            binding: 'IsSelected',
            dataType: 'Boolean',
            width: 80
        },
          {
            header: 'Số hóa đơn',
            binding: 'AtchDocNo',
            width: 150,
            dataType: 'Array',
            isReadOnly: 'true',

            lookupKey: 'InvoiceBizzi',
             bindingList: {
                IssuedDate: 'AtchDocDate',
                InvoiceId: 'InvoiceId',
                InvoiceSeries: 'AtchFormNo',
                TotalAmountWithoutVat: 'AmountBeforeTax',
                TotalAmountWithVat: 'Amount'
            },
            lookupfilter: "ProductCostId = '{EXPR=ProductCostId}' AND ApprovalStatus = 'PENDING' AND SellerTaxCode = '{EXPR=TaxRegNo}'"
        },
        {
            header: 'Ngày hóa đơn',
            binding: 'AtchDocDate',
            width: 150,
            dataType: 'Date',
            isReadOnly: 'true',
            format: 'dd/MM/yyyy'
        },
        // {
        //     header: 'Số hóa đơn',
        //     binding: 'AtchDocNo',
        //     allowEditing: true,
        //     width: 150,
        //     validators: "{EXPR=AtchDocNo} == ''",
        //     validatorMessage: 'Không được bỏ trắng giá trị',
        // },
        {
            header: 'Ký hiệu',
            binding: 'AtchFormNo',
            allowEditing: true,
            width: 150,
            isReadOnly: 'true',
        },
        {
            header: 'Giá trị trước thuế',
            binding: 'AmountBeforeTax',
            width: 150,
            isReadOnly: 'true',
            dataType: 'Number'
        },
        {
            header: 'Giá trị sau thuế',
            binding: 'Amount',
            width: 150,
            isReadOnly: 'true',
            dataType: 'Number'
        },
        {
            header: 'Ngày nhận đủ hồ sơ',
            binding: 'DateReceive',
            width: 150,
            dataType: 'Date',

            format: 'dd/MM/yyyy'
        },
        {
            header: 'Hóa đơn Bizzi',
            binding: 'InvoiceId',
            allowEditing: true,
            width: 0,
            isReadOnly: 'true',
        },
    ];
}