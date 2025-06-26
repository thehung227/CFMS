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


export class LayoutApprovedRegisterIncurredExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_BizDocVBExplorer',
                FilterKey: "ApproveSend = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'I1' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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

export class LayoutApprovedRegisterIncurredEditor implements IEditorFormulaDeclaration {

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

    approveGrid = 1;

    serverConstraint = [
    ]

    serverUpdating = [

    ]

    columnChanged = {

    };

    linkReporter = {
        'btnBaoCao': {
            directory: 'reporterincurred',
            type: 'view',
            key: 'REP07_KQT_TDPS',
            parameter: { 'Commandkey': 'REP07_KQT_TDPS', 'ProductCostId': '{EXPR=ProductCostId}', 'Id': '{EXPR=IdBizDocVB}' }
        }
    };

    columnsReadOnly = [];

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_BizDocVBEdit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'I1',
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
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: '',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate'
                    }
                },
                {
                    Name: 'vB30Incurred',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BuiltinOrder: '1',
                    }
                }
            ]
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'Bảng tổng hợp Bill - {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_B30BizDocVB_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng tổng hợp",
                    FileName: "Bảng tổng hợp PS CĐT - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "CCM_TongHopPhatSinhCDT.docx",
                    // ExcelName: "1.Ke_Hoach_Ky_Ket_Hop_Dong.docx",
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                },
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
                    
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6
                }),  
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/Phòng, ban',
                    lookupKey: 'ProductCost',
                    binding: {
                    },
                    lookupfilter: "IsGroup=0",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'ProductCostId',
                //     label: 'Hạng mục',
                //     lookupKey: 'Project2',
                //     binding: {
                //     },
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId1 = '{EXPR=ProductCostId1}'",
                //     hideValueMember: true,
                //     col: 12
                // }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Nội dung',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    // lookupfilter: "IsActive=1",
                    lookupfilter: "IsActive=1 AND Ma_Ct='{EXPR=DocCode}'",
                    hideValueMember: false,
                    validators: [Validators.required],
                    col: 12
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'Amount_DoanhThu',
                    label: 'Doanh Thu BCTC',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'TongGiaTriTrinh',
                    label: 'Giá trị PS kỳ này',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'TotalAmount',
                    label: 'Giá trị PS kỳ trước',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new NumberBoxInput({
                    key: 'TotalAmountApprove',
                    label: 'Tổng giá trị PS đến kỳ này',
                    col: 6,
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
              
                new NumberBoxInput({
                    key: 'NumberCol1',
                    label: '% Doanh thu',
                    col: 6,
                    format: 'P2',
                    isDisabled: 'true',
                    //format: "'{EXPR=CurrencyCode}' != 'VND' ? 'N2' : 'N0'"
                }),
                new LookupBoxInput({
                    key: 'PositionCode',
                    label: 'Cấp bậc duyệt',
                    lookupKey: 'Position',
                    hideValueMember: false,
                    isNewRow: 'true',
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
             
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmployeeCode',
                    label: 'Người duyệt',
                    lookupKey: 'Employee',
                    hideValueMember: false,
                    col: 6,
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
             
                }, this.srv, this.parentData),
                new RichTextBoxInput({
                    key: 'Comment',
                    label: 'Ý kiến',
                    col: 12
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
            header: 'Link SharePoint',
            binding: 'Description',
            width: 130,
            isReadOnly: 'true'
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 300,
            dataType: 'Object',
            allowRemove: false,
            allowView: true,
            allowDownLoad: true,
            allowUpload: true,
            folderId: '{EXPR=IdBizDocVB}'
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
            width: 50,
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
            width: 200
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

    childColumns3 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            
            width: 100
        },
        {
            header: 'XD/ME',
            binding: 'ClassCode1',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='INCURRED'",
            width: 150,
        },
        {
            header: 'Công tác thi công',
            binding: 'Description',
            width: 300
        },
        {
            header: 'Ngày bắt đầu thi công (dự kiến)'	,
            binding: 'StartDateBudget',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            width:100,
            isRequired: false					
        },
        {
            header: 'Ngày thi công xong (dự kiến)'	,
            binding: 'EndDateBudget',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            width:100,
            isRequired: false					
        },
        // {
        //     header: 'Giá trị chưa trình (Chưa VAT)',
        //     binding: 'GiaTriChuaTrinh',
        //     dataType: 'Number',
        //     width: 150,
        //     format: 'n0'
        // },
        {
            header: 'Giá trị (chưa VAT)',
            binding: 'GiaTriTrinh',
            dataType: 'Number',
            width: 150,
            format: 'n0'
        },
        {
            header: 'Kế hoạch trình phát sinh'	,
            binding: 'PlanFinishDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            width:100,
            isRequired: false					
        },
        {
            header: 'Căn cứ thi công',
            binding: 'PlanDetail',
            isRequired: true,
            width: 150
        },
        {
            header: 'Khu vực thi công',
            binding: 'SIRFINO',
            isRequired: true,
            width: 150
        },
        {
            header: 'Lý do thi công phát sinh',
            binding: 'Reason',
            isRequired: true,
            width: 250
        },
    
       
      
      
        {
            header: 'Ghi chú',
            binding: 'Remark',
            isRequired: true,
            width: 200
        },
        {
        header: 'Giá trị đánh giá PS đã trình (Chưa VAT)',
        binding: 'RowInheris',
        dataType: 'Number',
        width: 0,
        format: 'n0'
         },
    ]
}