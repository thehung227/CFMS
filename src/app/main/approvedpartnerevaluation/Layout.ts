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


export class LayoutApprovedPartnerEvaluationExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_BizDocVBExplorer',
                FilterKey: "ApproveSend = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'V4' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
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

export class LayoutApprovedPartnerEvaluationEditor implements IEditorFormulaDeclaration {

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
        'btnBaoCao3': {
            directory: 'reporterquarter',
            type: 'view',
            key: 'REP01_DXTCQ',
            parameter: { 'Commandkey': 'REP01_DXTCQ', 'ProductCostId': '{EXPR=ProductCostId}', 'BizDocId': '{EXPR=BizDocId}', 'Ma_Dvcs': '{VAR=Branch.Ma_Dvcs}' }
        }
    }

    columnsReadOnly = [];

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_BizDocVBEdit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'V1',
                    BizDocId: '',
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB30BizDocVBDetail_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1',
                        DocDate: 'Parent.DocDate',
                        EstimatedPaymentDate: 'Parent.DocDate'
                    }
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
                    ChildKey: 'BizDocId'
                },
                {
                    Name: 'vB30BizDocVBDetail2_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        BuiltinOrder: '1'
                    }
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
                    Name: 'vB30BizDocVBDetail3_Edit',
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
            Text: 'Bảng tổng hợp Bill - {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_B30BizDocVB_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: "MAU1",
                    Name: "Bảng tổng hợp",
                    FileName: "Bảng tổng hợp đề xuất thu chi - {EXPR=ProductName} - {EXPR=DocNo}",
                    WordName: "BM_DeXuatChiQuy.docx",
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
                    col: 6,
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số hồ sơ',
                    type: 'text',
                     validators: [Validators.required],
                    col: 6,
                }),
                new DateBoxInput({
                    key: 'SignDate',
                    label: 'Ngày đánh giá',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'DeptCode',
                    label: 'Bộ phận đánh giá',
                    lookupKey: 'Class',
                    lookupfilter: "IsActive=1 AND IsGroup = 0 AND ParentCode='LoaiDG'",
                    validators: [Validators.required],
                   // validators: [Validators.required],
                    hideValueMember: true,
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ClassCode1',
                    label: 'Loại đánh giá',
                    lookupKey: 'Class',
                    lookupfilter: "IsActive=1 AND ParentCode='TypeOfReview'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ClassCode2',
                    label: 'Loại đối tác',
                    lookupKey: 'Class',
                    lookupfilter: "IsActive=1 AND ParentCode='TypePartner'",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu/ PB',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    validators: [Validators.required],
                    binding: {
                        ProductType: 'ProductType',
                        Code: 'ProductCode'
                    },
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new MultiSelectInput({
                    key: 'JobCode',
                    label: 'Công việc',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    validators: [Validators.required],
                    //lookupfilter: "'{EXPR=ActivityCode}'='' OR ActivityCode IN (SELECT Val FROM dbo.ufn_sys_SplitString('{EXPR=ActivityCode}',','))",
                    lookupKey: 'Job',
                    hideValueMember: false,
                    col: 12,
                }, this.srv),
                new MultiSelectInput({
                    key: 'ActivityCode',
                    label: 'Lĩnh vực',
                    lookupKey: 'Activity',
                    validators: [Validators.required],
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    hideValueMember: false,
                    col: 12,
                }, this.srv),
                new TextBoxInput({
                    key: 'Description',
                    validators: [Validators.required],
                    label: 'Hạng mục đánh giá',
                    type: 'text',
                    col: 12
                }),
              
                new LookupBoxInput({
                    key: 'CourseTypeCode',
                    label: 'Loại hình',
                    lookupKey: 'Class',
                    lookupfilter: "IsActive=1 AND ParentCode='TypeOfReview0'",
                    validators: [Validators.required],
              
                    hideValueMember: true,
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'TaxRegNo',
                    validators: [Validators.required],
                    lookupKey: 'CustomerDG',
                    lookupfilter: "IsActive=1 AND IsGroup = 0",
                    label: 'Mã số thuế',
                    
                    col: 12
                }, this.srv, this.parentData),
                // new LookupBoxInput({
                //     key: 'CustomerCode',
                //     label: 'Tên đối tác',
                //     lookupKey: 'Customer',
                   
                //     lookupfilter: "IsActive=1 AND IsGroup = 0",
                //     hideValueMember: true,
                //     col: 6
                // }, this.srv, this.parentData),
               
                new LookupBoxInput({
                    key: 'ParentBizDocId',
                    label: 'Hợp đồng',
                    lookupKey: 'BizDoc_CTC',
                    lookupfilter: "IsActive = 1 AND DocCode = 'C3'  AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND DocDate <= '{EXPR=DocDate}' AND ProductCostId='{EXPR=ProductCostId}'",
                    hideValueMember: true,
                    binding: {
                        CustomerCode: 'CustomerCode',
                        ContractType: 'ContractType',
                        CusBankAccountNo: 'CusBankAccountNo',
                        TaxCode: 'TaxCode'
                    },
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    validators: [Validators.required],
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND DocStatus=4 AND Ma_Ct='{EXPR=DocCode}'",
                   // validators: [Validators.required],
                    hideValueMember: false,
                    col: 12
                }, this.srv, this.parentData),
                new NumberBoxInput({
                    key: 'NumberCol1',
                    label: 'Điểm đánh giá',
                    type: 'number',
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    col: 6,
                }),
                new LookupBoxInput({
                    key: 'ClassCode3',
                    label: 'Phân loại đánh giá',
                    lookupKey: 'Class',
                    lookupfilter: "IsActive=1 AND ParentCode='ClassOfReview'",
                    isReadOnly: 'true',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    hideValueMember: true,
                    col: 6
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'PositionCode',
                    label: 'Cấp bậc duyệt',
                    lookupKey: 'Position',
                    hideValueMember: false,
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
                    key: 'Remark',
                    label: 'Nhận xét đánh giá',
                    validators: [Validators.required],
                    type: 'text',
                    rowSpans: '3',
                    col: 12
                }),
            
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
        {
            header: 'Mã đánh giá',
            binding: 'PositionCode',
            bindingList: {
                Name: 'PositionName',
            },
            allowEditing: false,
            isRequired: true,
            isReadOnly: 'true',
            dataType: 'Array',
            lookupKey: 'Evaluation',
            lookupfilter: "IsActive=1 AND IsGroup = 0",
            width: 150
        },
        {
            header: 'Đánh giá Chỉ huy trưởng, Trưởng PB',
            binding: 'PositionName',
            allowEditing: false,
            isReadOnly: 'true',
            width: 300
        },
        {
            header: 'Hệ số',
            binding: 'ThisPeriod',
            dataType: 'Number',
            format: 'N2',
            isReadOnly: 'true',
            width: 150
        },
        {
            header: 'Đánh giá thang điểm 10',
            binding: 'NextPeriod',
            format: 'N2',
            dataType: 'Number',
            min:0,
            max:10,
            width: 150
        },
        {
            header: 'Xem',
            binding: 'Pass',
            dataType: 'Object',
            isButton: true,
            textButton: '💡',
            width: 50
        },
    ]
    childColumns1 = [
      
        {
            header: 'Tên tài liệu',
            binding: 'Description',
            width: 250,
            isReadOnly: 'true'
        },
        {
            header: 'Yêu cầu đính kèm',
            binding: 'Attached',
            dataType: 'Boolean',
            width: 80,
            isReadOnly: 'true'
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 400,
            dataType: 'Object',
            //validators: "{EXPR=Description} != '' && {EXPR=Description} == 'Yêu cầu đính kèm' && {EXPR=FilePath}==0",
            allowRemove: false,
            allowView: true,
            allowDownLoad: true,
            allowUpload: false,
            folderId: '{EXPR=IdBizDocVB}'
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
            width: 230,
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
            width: 230,
            isReadOnly: 'true'
        },
        {
            header: 'Mã nhân viên',
            binding: 'EmployeeCode',
            width: 150,
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId='{EXPR=ProductCostId0}') AND PositionCode = '{EXPR=PositionCode}' UNION SELECT EmployeeCode FROM B20ProductHumanPay WHERE IsActive = 1)",
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
            header: 'Người duyệt được chỉ định',
            binding: 'EmployeeCodeReal',
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId='{EXPR=ProductCostId0}') AND PositionCode = '{EXPR=PositionCode}' UNION SELECT EmployeeCode FROM B20ProductHumanPay WHERE IsActive = 1)",
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
    ]

    childColumns3 = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center'
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
    childColumns4 = [
        {
            header: 'Phân loại nơi khảo sát',
            binding: 'PositionCode',
            allowEditing: false,
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "IsActive=1 AND ParentCode='ClassLocation'",
            width: 100
        },
        {
            header: 'Tên nơi khảo sát',
            binding: 'PositionName',
            allowEditing: false,
            width: 300
        },
        {
            header: 'Địa chỉ nơi khảo sát',
            binding: 'Description',
            allowEditing: false,
            width: 300
        }
    ]

    childColumns5 = [
        {
            header: 'Tên người liên lạc',
            binding: 'ContactName',
            width: 200,
            
        },
        {
            header: 'Chức vụ',
            binding: 'JobTitleName',
            width: 200,
            // validators: "{EXPR=ContactName} == ''",
            // validatorMessage: 'Không được bỏ trắng giá trị',
            // ignoreError: 1
        },
        {
            header: 'Số điện thoại',
            binding: 'PhoneNo',
            width: 150,
           
        },
        {
            header: 'Địa chỉ Email',
            binding: 'Email',
            width: 200,
         
        },
        {
            header: 'Địa chỉ liên lạc',
            binding: 'Address',
            width: 500,
         
        }
    ]
    childColumns6 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            allowEditing: false,
            isReadOnly: 'true',
            width: 100
        },
        {
            header: 'Chỉ tiêu đánh giá',
            binding: 'PositionName',
            allowEditing: false,
            isReadOnly: 'true',
            width: 300
        },
        {
            header: 'Nội dung đánh giá',
            binding: 'Description',
            allowEditing: false,
            
            width: 300
        },
        {
            header: 'Dòng tiêu đề',
            binding: 'IsTitleRow',
            dataType: 'Boolean',
            width: 0,
            isReadOnly: 'true'
        }
        // {
        //     header: 'Xem',
        //     binding: 'Pass',
        //     width: 150,
        //     isReadOnly: 'true',
        //     isContentHtml: true,
        //     wordWrap: true
        // }
    ]
}
