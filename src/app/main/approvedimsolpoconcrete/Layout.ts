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

// phê duyệt phiếu nhập kho
export class LayoutApprovedImSolPoConcreteEditor implements IEditorFormulaDeclaration {

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
    }

    columnsReadOnly = [];

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_AccDocEquipInventoryEdit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1,
                    DocCode: 'N3'
                }
            },
            Child: [
                {
                    Name: 'vB30AccDocEquipInventory_Edit_Betong',
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
                    //     TransCode: 'Parent.TransCode',
                    //     WarehouseCode: 'Parent.WarehouseCode',
                    //     Gia_Tb_Tt: 0
                    // }
                },
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId',
                    // DefaultValues: {
                    //     BizDocId: 'Parent.Stt',
                    //     BuiltinOrder: '1',
                    //     DocDate: 'Parent.DocDate'
                    // }
                },
                {
                    Name: 'vB30AccDocPurchaseAssess_Edit',
                    ParentKey: 'Stt',
                    ChildKey: 'Stt',
                    // DefaultValues: {
                    //     Stt: 'Parent.Stt',
                    //     BuiltinOrder: '1'
                    // }
                },
                {
                    Name: 'vB30BizDocApprove_EditAccDocEquip',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId',
                    // DefaultValues: {
                    //     BizDocId: 'Parent.Stt',
                    //     BuiltinOrder: '1',
                    //     DocDate: 'Parent.DocDate',
                    //     BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    // }
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
            Text: 'Bảng chi tiết phiếu nhập kho',
            Command: 'usp_AccDocEquip_VoucherForm',
            Command_WorkFlow: 'usp_AccDocEquip_VoucherForm',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng tổng hợp",
                    FileName: "Bảng chi tiết phiếu nhập kho",
                    WordName: "CCM_PhieuNhapKho.docx",
                    // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
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
                    label: 'Số phiếu',
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
                    validators: [Validators.required],
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Hợp đồng',
                    lookupKey: 'BizDoc_CTC',
                    binding: {
                        CustomerCode: 'CustomerCode'
                    },
                    validators: [Validators.required],
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
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
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'BizDocId_PO',
                    label: 'Đơn hàng mua',
                    lookupKey: 'BizDoc',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND CompletedApprove=1 AND ProductCostId='{EXPR=ProductCostId}' AND ParentBizDocId='{EXPR=ParentBizDocId}'",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12
                }, this.srv, this.parentData),
                // new TextBoxInput({
                //     key: 'Person',
                //     label: 'Họ và tên',
                //     type: 'text',
                //     col: 12,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }),
                // new TextBoxInput({
                //     key: 'Address',
                //     label: 'Địa chỉ',
                //     type: 'text',
                //     col: 12,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }),
                new LookupBoxInput({
                    key: 'AccDocEquipTypeCode',
                    label: 'Loại nhập',
                    lookupKey: 'Category',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    validators: [Validators.required],
                    hideValueMember: true,
                    maxRow: 20,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ItemGroupCode',
                    label: 'Nhóm hàng',
                    lookupKey: 'Item',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ParentId IN (3203,3205,3978)",
                    validators: [Validators.required],
                    hideValueMember: true,
                    maxRow: 20,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'TransCode',
                //     label: 'Nghiệp vụ',
                //     lookupKey: 'Trans',
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND TransTypeCode=21 AND Code<>'2199'",
                //     hideValueMember: false,
                //     validators: [Validators.required],
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F8F0D7;border-radius:8px;'
                // }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'WarehouseCode',
                //     label: 'Kho nhập',
                //     lookupKey: 'Warehouse',
                //     lookupfilter: "IsGroup=0 AND IsActive=1",
                //     hideValueMember: false,
                //     validators: [Validators.required],
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F8F0D7;border-radius:8px;'
                // }, this.srv, this.parentData),
                // new DateBoxInput({
                //     key: 'DocDate2',
                //     label: 'Ngày nhận thực tế',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     validators: [Validators.required],
                //     col: 6
                // }),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    type: 'text',
                    col: 12,
                    validators: [Validators.required],
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND DocStatus=4 AND Ma_Ct='{EXPR=DocCode}'",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
             
                new NumberBoxInput({
                    key: 'OriginalAmount9Total',
                    label: 'Tổng tiền (Chưa VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'OriginalAmountTotal',
                    label: 'Tổng tiền (Gồm VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                // new LookupBoxInput({
                //     key: 'ProductCostId0',
                //     lookupKey: 'ProductCost',
                //     validators: [Validators.required],
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3)",
                //     hideValueMember: true,
                //     col: 12,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'PositionCode',
                    label: 'Cấp bậc duyệt',
                    lookupKey: 'Position',
                    hideValueMember: false,
                    isDisabled: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 6
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
                    label: 'Ý kiến'
                }),
                new LookupBoxInput({
                    key: 'EmployeeCodeSend',
                    label: 'Người gửi duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    col: 6,
                    isDisabled: 'true'
                }, this.srv, this.parentData),
                // new UploadInput({
                //     key: 'FilePath',
                //     label: 'File đính kèm',
                //     isOnlyDownload: true,
                //     col: 6
                // }, this.srv),
            ]
        })
    ];

   childColumns = [
        {
            header: 'Stt',
            binding: 'SoThuTu',
            width: 60,
            isReadOnly: 'true'
        },
        {
            header: 'Ngày đổ',
            binding: 'Ngay_Do',
            width: 80,
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isReadOnly: 'true'
        },
        {
            header: 'Thời gian bắt đầu đổ',
            binding: 'Thoi_Gian_Do',
            width: 80,
            isReadOnly: 'true'
        },
       
        // {
        //     header: 'Mã hàng',
        //     binding: 'ItemCode',
        //     isReadOnly: 'true',
        //     dataType: 'Array',
        //     lookupKey: 'Item',
        //     bindingList: {
        //         Name: 'Description0',
        //         ConvertRate: 'ConvertRate9',
        //         Unit: 'Unit'
        //     },
        //     lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentId IN (SELECT Id FROM B20Item WHERE Code = '{EXPR=ItemGroupCode}')",
        //     width: 150
        // },
        {
            header: 'Tên hàng hóa',
            binding: 'Description',
            width: 250,
            isReadOnly: 'true'
        },
        
        {
            header: 'Cường độ',
            binding: 'Cuong_Do',
            width: 100,
            isReadOnly: 'true'
        },   
        {
            header: 'Độ sụt',
            binding: 'Do_Sut',
            width: 100,
            isReadOnly: 'true'
        },   
        {
            header: 'Phụ gia',
            binding: 'PhuGia',
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: 'Cấu kiện',
            binding: 'Cau_Kien',
            width: 150
        },
        {
            header: 'Khu vực',
            binding: 'Khu_Vuc',
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Vị trí',
            binding: 'Vi_Tri',
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Đvt',
            dataType: 'Array',
            // bindingList: {
            //     ConvertRate: 'ConvertRate9'
            // },
            lookupKey: 'ItemUnit',
            
            binding: 'Unit',
            width: 80,
            isReadOnly: 'true'
        },
        // {
        //     header: 'Ngày dự kiến giao',
        //     binding: 'EstimatedTimeDelivery',
        //     width: 80,
        //     dataType: 'Date',
        //     format: 'dd/MM/yyyy'
        // },
        {
            header: 'KL tính toán',
            binding: 'Khoi_Luong_Tinh_Toan',
            dataType: 'Number',
            width: 100,
             format: 'n2',
            isReadOnly: 'true'
        },
        {
            header: 'KL đặt hàng',
            binding: 'Khoi_Luong_Dat_Hang',
            dataType: 'Number',
            width: 100,
            format: 'n3',
            isReadOnly: 'true'
        },
        // {
        //     header: 'Hệ số quy đổi',
        //     binding: 'ConvertRate9',
        //     dataType: 'Number',
        //     width: 100,
        //     isReadOnly: 'true',
        //     format: 'n4'
        // },
        // {
        //     header: 'Số lượng quy đổi',
        //     binding: 'Quantity',
        //     dataType: 'Number',
        //     width: 90,
        //     format: 'n3'
        // },
        {
            header: 'Đơn giá bê tông (VNĐ)',
            binding: 'DonGiaPO',
            dataType: 'Number',
            width: 100,
            format: 'n2',
            isReadOnly: 'true'
        },
        {
            header: 'Đơn giá VND',
            binding: 'UnitCost',
            dataType: 'Number',
            width: 0,
            format: 'n2',
            isReadOnly: 'true'
        },
        {
            header: 'Thành tiền bê tông (VNĐ)',
            binding: 'ThanhTienPO',
            dataType: 'Number',
            width: 120,
            format: 'n0',
            isReadOnly: 'true'
        },
        {
            header: 'Thành tiền VND',
            binding: 'Amount',
            dataType: 'Number',
            width: 0,
            format: 'n2',
            isReadOnly: 'true'
        },
        {
            header: "Loại thuế",
            dataType: "Array",
            bindingList: {
                Rate: "TaxRate"
            },
            lookupKey: "Tax",
            lookupfilter: "Type='1' AND IsGroup=0 AND IsActive=1 AND IsDefault=1",
            binding: "TaxCode",
            maxRow: 20,
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: "% VAT",
            dataType: "Number",
            isReadOnly: "true",
            binding: "TaxRate",
            format: "p2",
            width: 85
        },
        {
            header: "Tiền VAT",
            dataType: "Number",
            binding: "Amount3PO",
            format: "n0",
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: "Tiền VAT VND",
            dataType: "Number",
            binding: "Amount3",
            format: "n2",
            width: 0,
            isReadOnly: 'true'
        },
         {
            header: "Phương pháp đổ",
        
            binding: "PhuongPhapDo",
        
            width: 100,
            isReadOnly: 'true'
        },
        {
            header: 'Mô tả chi tiết nhu cầu về bơm',
            binding: 'ChiTietBom',
     
            width: 250,
            isReadOnly: 'true'
        },
     
           {
            header: 'Tên NCC bơm',
            binding: 'NCCBom',
     
            width: 250,
            isReadOnly: 'true'
        },
        
           {
            header: 'Tên NTP thi công',
            binding: 'NTPThiCong',
     
            width: 250,
            isReadOnly: 'true'
        },
          {
            header: 'Tên giám sát',
            binding: 'TenGiamSat',
     
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'KL Bê tông thực tế',
            binding: 'Quantity9',
            dataType: 'Number',
            width: 100,
            format: 'n3'
        },
         {
            header: 'KL Bơm thực tế (m3)',
            binding: 'Quantity1',
            dataType: 'Number',
            width: 100,
            format: 'n3'
        },
         {
            header: 'KL Bơm thực tế (Theo ca bơm) - Nếu có',
            binding: 'OriginName',
     
            width: 150
        },
         {
            header: 'Ghi chú',
            binding: 'Remark',
            width: 250
           
        }

    ];

    childColumns1 = [
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
            width: 500,
            dataType: 'Object',
            allowRemove: false,
            allowView: true,
            allowDownLoad: true,
            allowUpload: false,
            folderId: '{EXPR=IdAccDoc}'
        }
    ];

    childColumns2 = [
        {
            header: 'Tiêu chí',
            binding: 'Description',
            width: 450,
            isReadOnly: 'true'
        },
        {
            header: '⭐',
            binding: 'Bad',
            width: 100,
            dataType: 'Boolean'
        },
        {
            header: '⭐⭐',
            binding: 'Star2',
            width: 100,
            dataType: 'Boolean'
        },
        {
            header: '⭐⭐⭐',
            binding: 'Normal',
            width: 100,
            dataType: 'Boolean'
        },
        {
            header: '⭐⭐⭐⭐',
            binding: 'Star4',
            width: 100,
            dataType: 'Boolean'
        },
        {
            header: '⭐⭐⭐⭐⭐',
            binding: 'Good',
            width: 100,
            dataType: 'Boolean'
        },
        {
            header: 'Diễn giải',
            binding: 'Remark',
            width: 250,
            validators: "({EXPR=Bad} == true || {EXPR=Star2} == true) && ({EXPR=Normal} == false && {EXPR=Star4} == false && {EXPR=Good} ==false) && {EXPR=Remark} == ''",
            validatorMessage: 'Yêu cầu nhập Diễn giải khi đánh giá 1 sao hoặc 2 sao',
            ignoreError: 1
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
            bindingList: {
                Name: 'EmployeeName'
            },
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

    childColumns4 = [
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
    ];
}