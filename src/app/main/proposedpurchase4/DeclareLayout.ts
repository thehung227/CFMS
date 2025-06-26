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

// Danh sách đề nghị mua hàng (MH)
export class LayoutProposedPurchase4Explorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_ExplorePP4',
                // FilterKey: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'PP' AND IsActive=1 AND DocStatus = 4 AND ApproveSend = 1 AND (ItemGroupCode IN (SELECT ItemGroupCode FROM dbo.ufn_TMCtc_NhomHang_Theo_NhanVien('{VAR=User.Ma_CbNv}','{VAR=Filter.ProductCostId}'))) AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId1 IN (SELECT RowId FROM dbo.ufn_TMCtc_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}','{VAR=Filter.ProductCostId}')))",
                FilterKey: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'PP' AND IsActive=1 AND DocStatus = 4 AND ApproveSend = 1 AND (ItemGroupCode IN (SELECT ItemGroupCode FROM dbo.ufn_TMCtc_NhomHang_Theo_NhanVien('{VAR=User.Ma_CbNv}','{VAR=Filter.ProductCostId}')))",
                OrderBy: 'DocNo DESC, EstimatedTimeDeliveryMin',
                RowPage: 50,
                DefaultValues: {
                    CurrencyCode: 'VND'
                }
            },
            Child: {
                Name: 'vB30BizDoc_Explore',
                ParentKey: 'BizDocId',
                ChildKey: 'ParentBizDocId',
                OrderBy: 'DocNo'
            }
        },
        PrintDocument: {
            Key: 'BizDocViewer',
            Text: 'Mẫu in Đề nghị mua hàng',
            Command: 'usp_B30BizDoc_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Đề nghị mua hàng",
                    FileName: "Đề nghị mua hàng - {EXPR=DocNo}",
                    WordName: "BM-F006b-Rev00 De Nghi Mua Hang.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ],
            PrintGrid: [
                {
                    header: 'STT/ No',
                    binding: 'OrderNo',
                    width: 30,
                    dataType: 'String',
                    align: 'center'
                },
                {
                    header: 'Tên hàng hóa/ Iterm',
                    binding: 'ItemName',
                    width: 140,
                    dataType: 'String'
                },
                {
                    header: 'Thương hiệu/ Brand',
                    width: 60,
                    dataType: 'String'
                },
                {
                    header: 'Số lượng/ Quantity',
                    binding: 'Quantity',
                    width: 60,
                    dataType: 'Number',
                    format: 'n0'
                },
                {
                    header: 'Qui đổi/ Convert',
                    binding: 'Quantity8',
                    width: 60,
                    dataType: 'Number',
                    format: 'n3'
                },
                {
                    header: 'Đơn giá/ Price',
                    binding: 'OriginalUniCost',
                    width: 60,
                    dataType: 'Number'
                },
                {
                    header: 'Thành tiền/ Total',
                    binding: 'OriginalAmount',
                    width: 70,
                    dataType: 'Number'
                },
                {
                    header: 'Thời gian nhận hàng/ Delivery time',
                    binding: 'EstimatedTimeDelivery',
                    width: 80,
                    dataType: 'Date',
                    format: 'dd/MM/yyyy'
                },
                {
                    header: 'Ghi chú/ mark',
                    binding: 'ReceiptTeam',
                    width: 80,
                    dataType: 'String'
                }
            ]
        },
        CopiedValues: {
            parameter: { 'Commandkey': 'supplierquotes-editor', 'BizDocId_PP': '{EXPR=BizDocId}', 'ProductCostId0': '{EXPR=ProductCostId0}', 'ProductCostId1': '{EXPR=ProductCostId1}', 'ProductCostId': '{EXPR=ProductCostId}'}
        }
    }

    menu = {
        Table: 'B20Item',
        Filter: "IsGroup=1 AND IsActive=1 AND ClassCode3 = 'TM'",
        parameter: { 'Commandkey': 'proposedpurchase2-editor', 'ItemGroupCode': '{EXPR=Code}' }
    }

    lookup1 = {
        Table: 'vB20Item_MenuFilter',
        Filter: "IsGroup=1 AND IsActive=1 AND ClassCode3 = 'TM' AND IsShowMenuWeb = 1",
        ColumnFilter: 'ItemGroupCode'
    }

    lookup2 = {
        Table: 'B00TMCtcDocStatus',
        Filter: "IsGroup=0 AND CommandWeb = 'proposedpurchase4'",
        ColumnFilter: 'DocStatusKeyTM'
    }

    lookup3 = {
        Table: 'B00TMCtcDocStatus',
        Filter: "CommandWeb = 'rowsPage'",
    }

    linkwizard = {
        key: 'WIZARD_CTC_TINHGIA',
        parameter: { 'Commandkey': 'WIZARD_CTC_TINHGIA', 'BizDocId': '{EXPR=BizDocId}', 'BranchCode': '{EXPR=BranchCode}', 'DocDate1': '{EXPR=DocDate}', 'ItemGroupCode': '{EXPR=ItemGroupCode}', 'UserName': '{VAR=User.UserName}' }
    }

    parentGrid = [
        {
            header: 'Ngày phiếu',
            binding: 'DocDate',
            width: 100,
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
            header: 'Số phiếu',
            binding: 'DocNo',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Số theo dõi',
            binding: 'DocNo2',
            width: 0,
            dataType: 'String'
        },
        {
            header: 'Quy trình duyệt',
            binding: 'ProcessName',
            width: 250,
            dataType: 'String'
        },        
        {
            header: 'Người tạo',
            binding: 'FullName',
            width: 200,
            dataType: 'String'
        },
        {
            header: 'Nhận hàng từ ngày',
            binding: 'EstimatedTimeDeliveryMin',
            width: 170,
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Đến ngày',
            binding: 'EstimatedTimeDeliveryMax',
            width: 200,
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Số ngày',
            binding: 'DateDiff_MinMax',
            width: 100,
            dataType: 'Number'
        },
        {
            header: 'Thông tin khác',
            binding: 'Description',
            width: 250,
            dataType: 'String'
        },
        {
            header: 'Gói thầu',
            binding: 'TenGoiThau',
            width: 200,
            dataType: 'String'
        },
        {
            header: '_Id',
            binding: 'Id',
            width: 100,
            dataType: 'Number'
        }
    ]

    childGrid = [
        {
            header: 'Ngày lập',
            binding: 'DocDate',
            format: 'dd/MM/yyyy',
            width: 120
        },
        {
            header: 'Số đơn hàng',
            binding: 'DocNo',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Nhà cung cấp',
            binding: 'CustomerName',
            width: 300,
            dataType: 'String'
        },
        {
            header: 'Tổng tiền hàng',
            binding: 'OriginalAmount',
            width: 150,
            dataType: 'Number'
        },
        {
            header: 'Trạng thái',
            binding: 'DocStatusName',
            width: 150,
            dataType: 'String'
        }
    ]
}

export class LayoutProposedPurchase4Editor implements IEditorFormulaDeclaration {

    buttonLoadChild: string[];
    serverUpdated: string[];
    buttonCommand: string[];
    constructor(private srv?: any,
        private parentData?: any) { }

    evaluators = {

    };

    approveGrid = 0;

    serverConstraint = [
    ]

    serverUpdating = [

    ]

    columnChanged = {

    };

    linkReporter = {
    }

    columnsReadOnly = [];

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDoc_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'ApproveGroup'
                }
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Mẫu in Đề nghị mua hàng',
            Command: 'usp_B30BizDoc_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "THEP",
                    Name: "Đơn đặt hàng mua - thép",
                    FileName: "Đơn đặt hàng mua - {EXPR=DocNo}",
                    WordName: "BM-F006a-Rev01 Don Dat Hang.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
                {
                    Layout: "KHAC",
                    Name: "Đơn đặt hàng mua - vật tư khác",
                    FileName: "Đơn đặt hàng mua - {EXPR=DocNo}",
                    WordName: "BM-F006a-Rev01 Don Dat Hang.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ],
            PrintGrid: [
                {
                    header: 'STT/ No',
                    binding: 'OrderNo',
                    width: 30,
                    dataType: 'String',
                    align: 'center'
                },
                {
                    header: 'Tên hàng hóa/ Iterm',
                    binding: 'ItemName',
                    width: 140,
                    dataType: 'String'
                },
                {
                    header: 'Thương hiệu/ Brand',
                    width: 60,
                    dataType: 'String'
                },
                {
                    header: 'Số lượng/ Quantity',
                    binding: 'Quantity',
                    width: 60,
                    dataType: 'Number',
                    format: 'n0'
                },
                {
                    header: 'Qui đổi/ Convert',
                    binding: 'Quantity8',
                    width: 60,
                    dataType: 'Number',
                    format: 'n3'
                },
                {
                    header: 'Đơn giá/ Price',
                    binding: 'OriginalUniCost',
                    width: 60,
                    dataType: 'Number'
                },
                {
                    header: 'Thành tiền/ Total',
                    binding: 'OriginalAmount',
                    width: 70,
                    dataType: 'Number'
                },
                {
                    header: 'Thời gian nhận hàng/ Delivery time',
                    binding: 'EstimatedTimeDelivery',
                    width: 80,
                    dataType: 'Date',
                    format: 'dd/MM/yyyy'
                },
                {
                    header: 'Ghi chú/ mark',
                    binding: 'ReceiptTeam',
                    width: 80,
                    dataType: 'String'
                }
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
                    validators: [Validators.required],
                    isDisabled: 'true',
                    col: 12,
                    labelCol: 5
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12,
                    isDisabled: 'true',
                    labelCol: 5
                }),
                new LookupBoxInput({
                    key: 'CustomerCode',
                    label: 'Nhà cung cấp',
                    lookupKey: 'Customer_CCM2',
                    binding: {
                        Address: 'Address'
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 12,
                    labelCol: 5
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Address',
                    label: 'Địa chỉ',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12,
                    isDisabled: 'true',
                    labelCol: 5
                }),
                new LookupBoxInput({
                    key: 'ProductCostId0',
                    label: 'Dự án',
                    lookupKey: 'Project0',
                    binding: {
                    },
                    lookupfilter: "IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' ",
                    hideValueMember: true,
                    validators: [Validators.required],
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 12,
                    labelCol: 5
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId1',
                    label: 'Gói thầu',
                    lookupKey: 'Project1',
                    binding: {
                        RowId: 'ProductCostId'
                    },
                    lookupfilter: "IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId0 = '{EXPR=ProductCostId0}'",//AND ('{VAR=User.IsAdmin}'='True' OR RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                    hideValueMember: true,
                    validators: [Validators.required],
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 12,
                    labelCol: 5
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Hạng mục',
                    lookupKey: 'Project2',
                    binding: {
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId1 = '{EXPR=ProductCostId1}'",
                    hideValueMember: true,
                    validators: [Validators.required],
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 12,
                    labelCol: 5
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'CategoryCode',
                    label: 'Hạng mục',
                    lookupKey: 'Category',
                    binding: {
                    },
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 12,
                    labelCol: 5
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ItemGroupCode',
                    label: 'Nhóm hàng',
                    lookupKey: 'Item',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ClassCode3= 'TM'", //AND BranchCode='{VAR=Branch.Ma_Dvcs}'
                    validators: [Validators.required],
                    hideValueMember: true,
                    isDisabled: 'true',
                    col: 12,
                    labelCol: 5
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Ghi chú',
                    type: 'text',
                    isDisabled: 'true',
                    col: 12,
                    labelCol: 5
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Process',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentId=35",
                    validators: [Validators.required],
                    hideValueMember: false,
                    isDisabled: 'true',
                    col: 12,
                    labelCol: 5
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'PositionCode',
                    label: 'Cấp bậc duyệt',
                    lookupKey: 'Position',
                    hideValueMember: false,
                    isDisabled: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 12,
                    labelCol: 5
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCode',
                    label: 'Người duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    isDisabled: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 12,
                    labelCol: 5
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Comment',
                    label: 'Ý kiến',
                    col: 12,
                    style: 'background-color:#F8F0D7;border-radius:8px;',
                    labelCol: 5
                })
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