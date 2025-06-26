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
export class LayoutApprovedSolPNEditor implements IEditorFormulaDeclaration {

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
                    Name: 'vB30AccDocEquipInventory_Edit',
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
                },
                {
                    Name: 'vB30BizDocContactInfo_Edit',
                    ParentKey: 'Stt',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.Stt',
                        BuiltinOrder: '1',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                }
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Mẫu in Đề nghị mua hàng',
            Command: 'usp_B30BizDoc_VoucherForm',
            LayoutPrint: [
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
                new LookupBoxInput({
                    key: 'WarehouseCode',
                    label: 'Kho nhập',
                    lookupKey: 'Warehouse',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }, this.srv, this.parentData),
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
                    key: 'TotalQuantity',
                    label: 'Tổng số lượng',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F8F0D7;border-radius:8px;'
                }),
                new NumberBoxInput({
                    key: 'OriginalAmount9Total',
                    label: 'Tổng tiền',
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
            header: 'Mã vật tư',
            binding: 'ItemCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Item',
            bindingList: {
                Name: 'Description0',
                Unit: 'Unit',
                ConvertRate: 'ConvertRate9',
                ItemAccount: 'DebitAccount'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1",// AND ParentId IN (SELECT Id FROM B20Item WHERE Code='{EXPR=ItemGroupCode}' AND IsActive=1)",
            width: 150
        },
        {
            header: 'Tên vật tư',
            binding: 'Description0',
            width: 450,
            isReadOnly: 'true'
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            dataType: 'Array',
            lookupKey: 'ItemUnit',
            lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND ItemCode={EXPR=ItemCode}",
            width: 80
        },
        {
            header: 'SL đơn hàng',
            binding: 'Quantity8',
            dataType: 'Number',
            width: 120,
            isReadOnly: 'true',
            format: 'n2'
        },
        {
            header: 'SL thực nhập',
            binding: 'Quantity9',
            dataType: 'Number',
            width: 120,
            format: 'n2'
        },
        {
            header: 'Đơn giá',
            binding: 'OriginalUnitCost',
            dataType: 'Number',
            width: 120
        },
        {
            header: 'Thành tiền',
            binding: 'OriginalAmount9',
            dataType: 'Number',
            isReadOnly: 'true',
            width: 150
        },
        // {
        //     header: 'Hệ số quy đổi',
        //     binding: 'ConvertRate9',
        //     width: 0,
        //     dataType: 'Number',
        //     format: 'n4'
        // },
        // {
        //     header: 'SL quy đổi',
        //     binding: 'Quantity',
        //     dataType: 'Number',
        //     width: 0,
        //     format: 'n2'
        // },
        // {
        //     header: 'Đơn hàng mua',
        //     binding: 'BizDocId_PO',
        //     dataType: 'Array',
        //     lookupKey: 'BizDoc_CTC',
        //     hideValueMember: true,
        //     width: 0,
        //     isReadOnly: 'true'
        // },
        // {
        //     header: 'Tk Nợ',
        //     binding: 'DebitAccount',
        //     width: 0,
        //     isReadOnly: 'true'
        // },
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

    childColumns5 = [
        {
            header: 'Ngày hóa đơn',
            binding: 'AtchDocDate',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Số hóa đơn',
            binding: 'AtchDocNo',
            allowEditing: true,
            width: 150,
            validators: "{EXPR=AtchDocNo} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
        },
        {
            header: 'Ký hiệu',
            binding: 'AtchFormNo',
            allowEditing: true,
            width: 150,
            validators: "{EXPR=AtchDocNo} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
        },
        {
            header: 'Giá trị trước thuế',
            binding: 'AmountBeforeTax',
            width: 150,
            dataType: 'Number'
        },
        {
            header: 'Giá trị sau thuế',
            binding: 'Amount',
            width: 150,
            dataType: 'Number'
        },
        {
            header: 'Ngày nhận đủ hồ sơ',
            binding: 'DateReceive',
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
    ];
}