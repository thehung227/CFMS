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


export class LayoutApprovedPurchaseOtherBudgetExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_BudgetExplorer',
                FilterKey: "ApproveSend = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'K4' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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

export class LayoutApprovedPurchaseOtherBudgetEditor implements IEditorFormulaDeclaration {

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
                Name: 'vB30BizDocApprove_BudgetEdit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'H2',
                    Stt: '',
                    CurrencyCode: 'VND',
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB30BudgetDetail_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'Stt',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        Stt: '',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    }
                },
                {
                    Name: 'vB30BizDocApprove_EditBudget',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                    
                    }
                },
                {
                    Name: 'vB30BizDocApproveLog_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                    
                    }
                },
                {
                    Name: 'vB30BizDocDocument',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                    
                    }
                },
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Bảng chi tiết phiếu xuất kho',
            Command: 'usp_B30Budget_VoucherForm_Approve',
            // Command_WorkFlow: '',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Kế hoạch mua hàng dự án",
                    FileName: "Kế hoạch mua hàng - {EXPR=DocNo}",
                    ExcelName: "CCM_KeHoachVLXD.xlsx",
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
                    key: 'BudgetDate',
                    label: 'Ngày',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số kế hoạch',
                    type: 'text',
                    validators: [Validators.required],
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu',
                    lookupKey: 'ProductCost',
                    // lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                // new DateBoxInput({
                //     key: 'Date1',
                //     label: 'Thời gian sử dụng từ',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     validators: [Validators.required],
                //     col: 6
                // }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive=1 AND Ma_Ct = '{EXPR=DocCode}'",
                 
                    hideValueMember: false,
                    col: 6
                }, this.srv, this.parentData),
             
                new LookupBoxInput({
                    key: 'TypeXDME',
                    label: 'Loại hình',
                    lookupKey: 'Class',
          
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='INCURRED' AND Code IN ('XD','ME')",
                    hideValueMember: false,
             
                    col: 6
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'TotalAmount',
                    label: 'Tổng tiền BĐ (Chưa VAT)',
                    type: "Number",
                    format: "n0",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
                }),
              
                new NumberBoxInput({
                    key: 'BudgetAmount',
                    label: 'Tổng tiền NCC (Chưa VAT)',
                    type: "Number",
                    format: "n0",
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#FAF5D0;border-radius:8px;'
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
                new RichTextBoxInput({
                    key: 'Comment',
                    label: 'Ý kiến',
                    col: 12
                }),
                // new LookupBoxInput({
                //     key: 'EmployeeCodeSend',
                //     label: 'Người gửi duyệt',
                //     lookupKey: 'Employee',
                //     hideValueMember: false,
                //     col: 6,
                //     isDisabled: 'true'
                // }, this.srv, this.parentData),
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
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 100
        },
        {
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            width:100,
            isRequired: false,	
            header: 'Tháng',
            binding: 'FromDate',
            
        
          
        },        
        {
            header: 'Mã nhóm hàng',
            binding: 'ItemGroupCode',
            width: 150,
            dataType: 'Array',
            lookupKey: 'Item',
            lookupfilter: "IsGroup=1 AND IsActive=1 AND ParentId IN (3205) AND Code<>'BETONG'",
            validators: "{EXPR=ItemGroupCode} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Mã hàng',
            binding: 'ItemCode',
            width: 200,
            dataType: 'Array',
            lookupKey: 'PriceLibrary',
            bindingList: {
                Name: 'ItemName',
                Unit: 'Unit'
            },
            lookupfilter: "IsActive=1 AND Code LIKE 'XD%'", //ParentId IN (SELECT Id FROM B20Item WHERE Code = '{EXPR=ItemGroupCode}') AND
            validators: "{EXPR=ItemCode} == '' && {EXPR=IsTitleRow} == 'false'",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên mặt hàng (Theo TVG)',
            binding: 'ItemName',
            dataType: 'String',
            width: 200,
            // isReadOnly: 'true'
        },
         {
            header: 'Tên mặt hàng (Theo Hợp Đồng NCC)',
            binding: 'OriginName',
            dataType: 'String',
            width: 200,
            isReadOnly: 'true'
        },
        {
            header: 'Danh mục vật tư',
            binding: 'TradeMarkList',
            width: 200,
            dataType: 'Array',
            lookupKey: 'TradeMark',
            multiSelection: true,
            lookupfilter: "IsGroup=0 AND IsActive=1",
            // validators: "{EXPR=TradeMarkCode} == ''",
            // validatorMessage: 'Không được bỏ trắng giá trị',
            // ignoreError: 1
        },
        {
            header: 'Hạng mục sử dụng',
            binding: 'CategoryName',
            dataType: 'String',
            width: 150
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            dataType: 'Array',
            lookupfilter: "IsActive=1 AND ParentCode = 'DmDvt'",
            lookupKey: 'Class',
            width: 80
        },
        {
            header: 'Khối lượng BoQ',
            binding: 'QuantityBOQ',
            dataType: 'Number',
            width: 150,
             format: 'n2'
        },
        {
            header: 'Đơn giá BĐ',
            binding: 'UnitCostBD',
            dataType: 'Number',
            width: 120
        },
        {
            header: 'Thành tiền BĐ',
            binding: 'OriginalAmountBD',
            dataType: 'Number',
            width: 150
        },
        {
            header: 'Mã sản phẩm được duyệt',
            binding: 'ProductName',
            dataType: 'String',
            width: 150
        },
        {
            header: 'Thương hiệu được duyệt',
            binding: 'TradeMarkCode',
            width: 200,
            dataType: 'Array',
            lookupKey: 'TradeMark',
            // multiSelection: true,
            lookupfilter: "IsGroup=0 AND IsActive=1",
            // validators: "{EXPR=TradeMarkCode} == ''",
            // validatorMessage: 'Không được bỏ trắng giá trị',
            // ignoreError: 1
        },
        {
            header: 'Xuất xứ',
            binding: 'XuatXu',
            dataType: 'Array',
            bindingList: {
                Name: 'TenXuatXu',
                
            },
            lookupKey: 'Class',
            lookupfilter: "ParentCode = 'QUOCGIA'",
            width: 100
        },
        {
            header: 'Tên xuất xứ',
            binding: 'TenXuatXu',
            dataType: 'String',
            width: 120,
            isReadOnly: 'true'
        },
       
        {
            header: 'Khối lượng kế hoạch (Tính toán)',
            binding: 'Quantity',
            dataType: 'Number',
            width: 150,
             format: 'n2'
        },
        {
            header: 'Đơn giá NCC',
            binding: 'OriginalPrice',
            dataType: 'Number',
            width: 120
        },
        {
            header: 'Thành tiền NCC',
            binding: 'OriginalAmount',
            dataType: 'Number',
            width: 150
        },
        // {
        //     header: 'Loại thuế',
        //     binding: 'TaxCode',
        //     isRequired: true,
        //     dataType: 'Array',
        //     lookupKey: 'Tax',
        //     bindingList: {
        //         Rate: 'TaxRate'
        //     },
        //     lookupfilter: "IsGroup=0 AND IsActive=1 AND Type = '1'",
        //     width: 90
        // },
        // {
        //     header: '% VAT',
        //     binding: 'TaxRate',
        //     dataType: 'Number',
        //     format: 'P2',
        //     width: 90
        // },
        // {
        //     header: 'Tiền VAT',
        //     binding: 'Amount3',
        //     dataType: 'Number',
        //     width: 150
        // },
        {
            header: 'Khối lượng lũy kế (đơn hàng đã đặt)',
            binding: 'QuantityAccum',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
        },
       
        {
            header: 'Ghi chú',
            binding: 'Remark',
            dataType: 'String',
            width: 350
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 60,
            isReadOnly: 'true'
        },
        {
            header: 'Link',
            binding: 'IsLink',
            dataType: 'Boolean',
            width: 60,
            isReadOnly: 'true'
        },
        {
            header: 'Dòng kế thừa',
            binding: 'RowIdInherist',
            dataType: 'String',
            width: 0
        },
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
        {
            header: 'Mã bộ phận',
            binding: 'DeptCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Dept',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 0,
            isReadOnly: 'true'
        },
        {
            header: 'Bộ phận',
            binding: 'DeptName',
            width: 300,
            isReadOnly: 'true'
        },
        {
            header: 'Mã cấp bậc',
            binding: 'PositionCode',
            dataType: 'Array',
            lookupKey: 'Position',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            width: 0,
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
            width: 100,
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId}' AND PositionCode = '{EXPR=PositionCode}')",
            validators: "{EXPR=EmployeeCode} == ''",
            validatorMessage: 'Không được bỏ trống giá trị',
            ignoreError: 1
        },
        {
            header: 'Tên nhân viên',
            binding: 'EmployeeName',
            width: 150,
            isReadOnly: 'true'
        },
        {
            header: 'Người duyệt được chỉ định',
            binding: 'EmployeeCodeReal',
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId}' AND PositionCode = '{EXPR=PositionCode}')",
            width: 120,
            validators: "{EXPR=EmployeeCode} != '' && {EXPR=EmployeeCode}.toString().indexOf(',') > 0 && {EXPR=EmployeeCodeReal} == ''",
            validatorMessage: 'Không được bỏ trống giá trị',
            ignoreError: 1
        },
        // {
        //     header: 'Số ngày xử lý',
        //     binding: 'NumberOfDays',
        //     dataType: 'Number',
        //     width: 100,
        //     isReadOnly: 'true'
        // },
        // {
        //     header: 'Được trả hồ sơ',
        //     binding: 'ApproveReturn',
        //     width: 100,
        //     dataType: 'Boolean',
        //     isReadOnly: 'true'
        // },
        // {
        //     header: 'Trả về cấp bậc',
        //     binding: 'PositionCodeReturn',
        //     width: 100,
        //     isReadOnly: 'true'
        // }
    ];

    childColumns2 = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center'
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

    childColumns3 = [
        {
            header: 'Diễn giải',
            binding: 'Description',
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
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 500,
            dataType: 'Object',
            allowRemove: false,
            allowView: true,
            allowDownLoad: true,
            allowUpload: false,
            folderId: '{EXPR=IdBudget}'
        }
    ]

}