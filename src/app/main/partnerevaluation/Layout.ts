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

// *********************************HỢP ĐỒNG, PHỤ LỤC, QUYẾT TOÁN

// Trình ký hợp đồng, phụ lục
export class LayoutPartnerEvaluationExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocVB_Explorer',
                FilterKey: "(ProductCostId0 = '{VAR=Filter.ProductCostId}') AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode='O1' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId0 IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'ProductName,CustomerName',
                RowPage: 50
            },
            Child: {
                Name: 'vB30BizDocApprove_ExplorerBizDocVB',
                ParentKey: 'BizDocId',
                ChildKey: 'BizDocId'
            }
        },
        PrintDocument: {
            Key: 'Viewer_TCBN',
            Text: 'Mẫu in trình ký HĐ, PLHĐ - {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_Coteccons_WorkFlow_GetPrintData',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: 'MAU9',
                    Name: 'WorkFlow',
                    FileName: 'WorkFlow HĐ,PLHĐ - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}',
                    WordName: 'WorkFlow_HD_CDT.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ]
        }
    }

    parentGrid = [
        {
            header: 'Đối tác',
            binding: 'NameDG',
            width: 300
        },
        {
            header: 'Nội dung hợp đồng',
            binding: 'DocName',
            width: 300
        },
        {
            header: 'Số',
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
            header: 'Ngày hoàn thiện duyệt',
            binding: 'FinishDate',
            width: 180,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        // {
        //     header: 'Đã gửi duyệt',
        //     binding: 'ApproveSend',
        //     width: 150,
        //     dataType: 'Boolean'
        // },
        // {
        //     header: 'Hoàn thiện duyệt',
        //     binding: 'CompletedApprove',
        //     width: 100,
        //     dataType: 'Boolean'
        // },
        {
            header: 'Đang xử lý',
            binding: 'XuLyTiepTheo',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Gói thầu/ PB',
            binding: 'ProductName',
            width: 0,
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
            header: 'Id',
            binding: 'Id',
            width: 50,
            dataType: 'Number'
        },
        {
            header: 'Mã Ct',
            binding: 'DocCode',
            width: 0
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
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 200,
            dataType: 'String'
        },
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
        }
    ]
}

export class LayoutPartnerEvaluationEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocVB_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'O1',
                    BizDocId: '',
                    CurrencyCode: 'VND',
                    ExchangeRate: '1',
                    Id: -1,
                    IsWebData: true,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate())),
                    ProductCostId0: '{VAR=Filter.ProductCostId}'
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
            Key: 'Viewer_TCBN',
            Text: 'Mẫu in trình ký HĐ, PLHĐ - {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_Coteccons_WorkFlow_GetPrintData',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [
                {
                    Layout: 'MAU9',
                    Name: 'WorkFlow',
                    FileName: 'WorkFlow HĐ,PLHĐ - {EXPR=ProductName} - {EXPR=CustomerName} - {EXPR=DocNo}',
                    WordName: 'WorkFlow_HD_CDT.docx',
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

    evaluators = {

        'Evaluator_ServerConstraint_CTC_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,ClassCode1,DocCode,DocNo,Id',
            Command: 'ufn_B30BizDoc_DefaultDocNo_DanhGiaDT',
            DataMember: 'DocNo'
        },
      
        'Evaluator_ServerConstraint_DocumentDetail_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ContractType,{VAR=Branch.Ma_Dvcs},{VAR=IsGetPayment_False},DocCode',
            Command: 'usp_Web_B30BizDocDocument_GetData2',
            zExpr: 'ApproveSend == false',
            OutputTable: 1
        },
        'Evaluator_ServerConstraint_BizDocVBDetail3_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ClassCode1',
            Command: 'usp_Web_B30BizDocVBDetail3_GetData',
            zExpr: 'ApproveSend == false',
            OutputTable: 6
        },
        // 'Evaluator_ServerConstraint_Approve_GetData': {
        //     EvaluatorName: 'EvaluatorQueryLoadChild',
        //     ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,{VAR=EmptyField_ParentBizDocId}',
        //     Command: 'usp_B30BizDocApprove_GetData',
        //     OutputTable: 2
        // },
        
        'Evaluator_ServerConstraint_Check_ApproveSent_NotChange': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'BizDocId,DocCode,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Conteccons_NotChangeWhenApproveSent',
            MessageText: 'Không được thay đổi khi đã gửi duyệt',
            IgnoreError: 0
        },
        'Evaluator_ServerConstraint_Detail_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'ClassCode1,ClassCode2',
            Command: 'usp_Load_Evaluation',
            OutputTable: 0
        },
        // 'Evaluator_ServerConstraint_Document_GetData': {
        //     EvaluatorName: 'EvaluatorQueryLoadChild',
        //     ConstraintKey: 'DocCode',
        //     Command: 'usp_Load_Docment01',
        //     OutputTable: 1
        // },
        //không đổi tên
        // 'Evaluator_UpdateInfo_WhenApproveSend': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: '{VAR=User.EmployeeCode},BizDocId,{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode',
        //     Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend_SongSong',
        //     zExpr: 'ApproveSend == true AND CompletedApprove == false'
        // },
        'Evaluator_ServerUpdated_BizDocDetail_UpdateFromParent': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_B30BizDocVB_UpdateInfo_WhenSaveA5'
        }
    }

    serverConstraint = [
        'Evaluator_ServerConstraint_CTC_DefaultDocNo',
        // 'Evaluator_ServerConstraint_Approve_GetData'

    ]

    serverUpdating: string[] = [
       'Evaluator_ServerConstraint_Check_ApproveSent_NotChange'
    ]

    serverUpdated: string[] = [    
        'Evaluator_ServerUpdated_BizDocDetail_UpdateFromParent',
        // 'Evaluator_UpdateInfo_WhenApproveSend'
    ]

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_Detail_GetData',
        // 'Evaluator_ServerConstraint_Document_GetData',
        // 'Evaluator_ServerConstraint_Approve_GetData',
        'Evaluator_ServerConstraint_BizDocVBDetail3_GetData'
    ]

    buttonCommand: string[] = [

    ]

    columnChanged = {
        // ProcessCode: {
        //     Evaluators: [
        //         'Evaluator_ServerConstraint_Approve_GetData'
        //     ]
        // },
    };

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {
               
            }
        }
    ];

    columnsReadOnly = [];

    linkReporter = {
        'btnPhuLucA': {
            directory: 'unitprice',
            type: 'detail',//bao cao: view, explorer: index, editor: detail
            key: 'Id_PLA',
            parameter: { 'Commandkey': 'unitprice-editor', 'ProductCostId': '{EXPR=ProductCostId}', 'ParentBizDocId': '{EXPR=BizDocId}', 'DocDate': '{EXPR=DocDate}', 'CustomerCode': '{EXPR=CustomerCode}', 'TaxCode': '{EXPR=TaxCode}', 'TaxRate': '{EXPR=TaxRate}', 'ParentId': '{EXPR=Id}' }
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
                // new LookupBoxInput({
                //     key: 'ProcessCode',
                //     label: 'Quy trình duyệt',
                //     lookupKey: 'Approve',
                //     validators: [Validators.required],
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND DocStatus=4 AND Ma_Ct='{EXPR=DocCode}'",
                //    // validators: [Validators.required],
                //     hideValueMember: false,
                //     col: 12
                // }, this.srv, this.parentData),
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
                new RichTextBoxInput({
                    key: 'Remark',
                    label: 'Nhận xét đánh giá',
                    validators: [Validators.required],
                    type: 'text',
                    rowSpans: '3',
                    col: 12
                }),
       
                // new CheckBoxInput({
                //     key: 'ApproveSend',
                //     label: 'Đã gửi duyệt',
                //     col: 6,
                //     isNewRow: true,
                //     isDisabled: 'true'
                // }),
                // new CheckBoxInput({
                //     key: 'CompletedApprove',
                //     label: 'Đã hoàn thiện duyệt',
                //     isDisabled: 'true',
                //     col: 6
                // })
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
        // {
        //     header: 'Xem',
        //     binding: 'Pass',
        //     width: 150,
        //     isReadOnly: 'true',
        //     isContentHtml: true,
        //     wordWrap: true
        // }
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
            validators: "{EXPR=Attached} == true && {EXPR=Description} != 'Theo mẫu công ty ban hành' && {EXPR=FilePath}==0",
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
            validators: "{EXPR=ContactName} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
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
            validators: "{EXPR=PhoneNo} == ''",
            validatorMessage: 'Không được bỏ trắng giá trị',
            ignoreError: 1
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
