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

// phê duyệt đơn hàng mua
export class LayoutApprovedConcreteLossExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_Explorer',
                FilterKey: "ApproveSend = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'PO' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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

export class LayoutApprovedConcreteLossEditor implements IEditorFormulaDeclaration {

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
            directory: 'reporterconcreteloss',
            type: 'view',
            key: 'REP01_HHBT',
            parameter: { 'Commandkey': 'REP01_HHBT', 'ProductCostId': '{EXPR=ProductCostId}', 'BizDocId': '{EXPR=BizDocId}', 'Ma_Dvcs': '{VAR=Branch.Ma_Dvcs}' }
        }
    }

    columnsReadOnly = [];

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_Edit',//vB30BizDocApprove_Edit
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocDetail_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'ApproveGroup'
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
                    Name: 'vB30BizDocApprove_AEditContract',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                }
            ]
        },
        PrintDocument: {
            Key: 'BizDocViewer',
            Text: 'Mẫu in hao hụt bê tông',
            Command: 'usp_B30BizDoc_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Hao hụt bê tông",
                    FileName: "Tổng hợp hao hụt bê tông - {EXPR=CustomerName} - {EXPR=DocNo}",
                    WordName: "CCM_TongHopHaoHutBeTong.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ]
        },
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
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số hồ sơ',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo2',
                    label: 'Cập nhật đến tháng',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu',
                    lookupKey: 'ProductCost',
                 
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),

                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive=1 AND DocStatus=4 AND Ma_Ct='{EXPR=DocCode}'",
                    validators: [Validators.required],
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
              
                new NumberBoxInput({
                    key: 'NumberCol1',
                    label: 'Tổng KL thực tế (m3)',
                    type: "Number",
                    format: "n3",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'NumberCol4',
                    label: 'Tổng BOQ CĐT (m3)',
                    type: "Number",
                    format: "n3",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'NumberCol5',
                    label: 'Tổng KL tính toán (m3)',
                    type: "Number",
                    format: "n3",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'NumberCol2',
                    label: 'Chênh lệch KL (Thực tế - CĐT) (m3)',
                    type: "Number",
                    format: "n3",
                    isNewRow: true,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'NumberCol8',
                    label: '% hao hụt (so với KL CĐT)',
                    type: "Number",
                    format: "p2",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'NumberCol3',
                    label: 'Chênh lệch KL (Thực tế - Tính toán) (m3)',
                    type: "Number",
                    format: "n3",
                    isNewRow: true,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'NumberCol9',
                    label: '% hao hụt (so với KL tính toán)',
                    type: "Number",
                    format: "p2",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'Remark',
                    label: 'Nguyên nhân/Ghi chú',
                    type: 'text',
                    col: 12
                }),
                new ButtonInput({
                    key: 'btnBaoCao',
                    label: 'Bảng hao hụt chi tiết',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'PositionCode',
                    label: 'Cấp bậc duyệt',
                    lookupKey: 'Position',
                    hideValueMember: false,
                    isDisabled: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 6,
           
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCode',
                    label: 'Người duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    isDisabled: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 6,
             
                }, this.srv, this.parentData),
                new RichTextBoxInput({
                    key: 'Comment',
                    label: 'Ý kiến',
                    col: 12
                }),
              
            ]
        })
    ];

    childColumns = [
        {
            header: 'Ngày đổ',
            binding: 'EstimatedTimeDelivery',
            width: 80,
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isReadOnly: 'true',
        },
        {
            header: 'Mã cấu kiện',
            binding: 'TradeMarkCode',
            dataType: 'Array',
            lookupKey: 'Class',
            // bindingList: {
            //     Name: 'Description',
            // },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='CAUKIEN'",
            width: 0
        },
        {
            header: 'Tên cấu kiện',
            binding: 'Description',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'Khu vực',
            binding: 'XuatXu',
            width: 150,
            isReadOnly: 'true',
        },
        {
            header: 'Vị trí',
            binding: 'NhanHieu',
            width: 150,
            isReadOnly: 'true',
        },
        {
            header: 'Cường độ',
            dataType: 'Array',
            lookupKey: 'Size',
            lookupfilter: "ItemGroupCode = '{EXPR=ItemGroupCode}'",
            binding: 'ProductSize',
            width: 0
        },
         {
            header: 'Cường độ',
            binding: 'ProductSizeName',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'Độ sụt',
            dataType: 'Array',
            lookupKey: 'Species',
            lookupfilter: "ItemGroupCode = '{EXPR=ItemGroupCode}'",
            binding: 'ItemSpeciesCode',
            width: 0
        },
        {
            header: 'Tên độ sụt',
            binding: 'ItemSpeciesName',
            isReadOnly: 'true',
            width: 150
        },
      
        {
            header: 'Phụ gia',
            binding: 'ItemSurfaceName',
            
            width: 150,
            isReadOnly: 'true',
        },
       
        {
            header: 'BOQ CĐT (m3)',
            binding: 'Quantity1',
            dataType: 'Number',
            width: 100,
            format: 'n3'
        },
        {
            header: 'Khối lượng tính toán (m3)',
            binding: 'Quantity2',
            dataType: 'Number',
            width: 100,
            format: 'n3',
            isReadOnly: 'true',
        },
        {
            header: 'Khối lượng đặt hàng (m3)',
            binding: 'Quantity3',
            dataType: 'Number',
            width: 100,
            format: 'n3',
            isReadOnly: 'true',
        },
        {
            header: 'Khối lượng thực tế',
            binding: 'Quantity9',
            dataType: 'Number',
            width: 100,
            format: 'n3',
            isReadOnly: 'true',
        },
        {
            header: 'NCC',
            binding: 'CustomerName1',
            width: 200,
            isReadOnly: 'true'
        },
        // {
        //     header: 'Số đợt Bill NCC',
        //     binding: 'DotBill',
        //     dataType: 'Number',
        //     width: 100,
        //     format: 'n0'
        // },
        {
            header: 'Phương pháp đổ',
            binding: 'PhuongPhapDo',
            width: 200,
            isReadOnly: 'true'
        },
        {
            header: 'NTP bơm',
            binding: 'CustomerName2',
            width: 200,
            isReadOnly: 'true',
        },
        {
            header: 'NTP thi công',
            binding: 'CustomerName3',
            width: 200,
            isReadOnly: 'true',
        },
        {
            header: 'Tên GS',
            binding: 'ReceiptPerson',
            width: 200,
            isReadOnly: 'true',
        },
        
        {
            header: 'Ghi chú',
            binding: 'Remark',
            width: 300
        },
        {
            header: 'Chênh lệch KL (TT - CĐT)',
            binding: 'QuantityTTCDT',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150,
            format: 'n3'
        },
        {
            header: 'Chênh lệch KL (Thực tế-CĐT)',
            binding: 'QuantityCDT',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150,
            format: 'n3'
        },
        {
            header: 'Chênh lệch KL (Thực tế-Tính toán)',
            binding: 'QuantityTT',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150,
            format: 'n3'
        },
        {
            header: '% hao hụt (so với KL CĐT)',
            binding: 'RateCDT',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 100,
            format: 'p2'
        },
        {
            header: '% hao hụt (so với KL tính toán)',
            binding: 'RateTT',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 100,
            format: 'p2'
        },
        {
            header: 'Dữ liệu mới',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 80,
            isReadOnly: 'true'
        },
        {
            header: 'Ngày',
            binding: 'DocDate',
            isReadOnly: 'true',
            width: 0
        }
    ];

    childColumns1 = [
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
    ];

    childColumns2 = [
        {
            header: 'Tên tài liệu',
            binding: 'Description',
            width: 250,
            validators: "{EXPR=Description} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
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
            //exprReadOnly: "{EXPR=Attached} == true && {EXPR=Description} != ''"
        }
    ];

    childColumns3 = [
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
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId='{EXPR=ProductCostId0}') AND PositionCode = '{EXPR=PositionCode}')",
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
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId='{EXPR=ProductCostId0}') AND PositionCode = '{EXPR=PositionCode}')",
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
}
