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


export class LayoutApprovedSetlementStatusExplorer implements IExplorerFormulaDeclaration {
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

export class LayoutApprovedSetlementStatusEditor implements IEditorFormulaDeclaration {

    buttonLoadChild: string[];
   
    buttonCommand: string[];
    constructor(private srv?: any,
        private parentData?: any) { }

    evaluators = {
        'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ParentKey,Stt',
            Command: 'usp_Debt_UpdateWhenSave_Approve'
        }
    };

    // approveGrid = 1;

    serverConstraint = [
    ]

    serverUpdated = [
        'Evaluator_UpdateInfo_WhenApproveSend'
     ];

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
                Name: 'B20SetlementProject',
                IsView: 'view',
                DefaultValues: {
                    // BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    // DocCode: 'V1',
                    // BizDocId: '',
                    // Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB20SetlementDetail',
                    ParentKey: 'ParentKey',
                    ChildKey: 'ChildKey',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        Stt: 'Parent.Stt',
                        BuiltinOrder: '1',
                        IsChild: true,
                    }
                }
              
            ]
        },
        PrintDocument: {
            Key: 'Viewer_TCBN',
            Text: 'Mẫu in xác nhận hoàn thành dự án - {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_B30BizDocVB_WorkFlow_GetPrintData_XNHTDA',
            Command_WorkFlow: 'usp_B30BizDocVB_WorkFlow_GetPrintData_XNHTDA',
            LayoutPrint: [
                {
                    Layout: 'MAU9',
                    Name: 'WorkFlow',
                    FileName: 'WorkFlow xác nhận hoàn thành dự án - {EXPR=ProductName} - {EXPR=DocNo}',
                    WordName: 'WorkFlow_XNHTDA.docx',
                    FolderPath: "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/"
                }
            ]
        }
    };

    panels: PanelBase[] = [
        new TablePanel({
            label: 'Panel 1',
            col: 12,
            controls: [
                // new DateBoxInput({
                //     key: 'DocDate',
                //     label: 'Ngày lập',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     col: 6,
                //     isReadOnly: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;'
                // }),
               
                new LookupBoxInput({
                    key: 'EmployeeCode',
                    label: 'PTDA',
                    lookupKey: 'Employee',
                    lookupfilter: "IsGroup=0",
                  
                    hideValueMember: true,
                    col: 12
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Stt',
                    label: 'Số HĐ ký với NH',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    visible: 'false',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }),
                new TextBoxInput({
                    key: 'ParentKey',
                    label: 'Số HĐ ký với NH',
                    type: 'text',
                    validators: [Validators.required],
                    col: 12,
                    isReadOnly: 'true',
                    visible: 'false',
                    style: 'background-color:#F1EDED;border-radius:8px;',
                    labelCol: 5
                }),
                new CheckBoxInput({
                    key: 'CompleteApproved',
                    label: 'Đã hoàn thiện duyệt',
                    isDisabled: 'true',
                    col: 6
                }),
            ]
        })
    ];

    childColumns = [
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 60,
             
        },
        {
            header: 'Dự án/Gói thầu',
            binding: 'ProductCostId',
            dataType: 'Array',
            lookupKey: 'ProductCost',
            bindingList: {
                ProductName: 'Description0'
            },
            lookupfilter: "ProductType IN ('1','3','2') AND IsGroup = 0 AND IsActive = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}'",
            hideValueMember: true,
            width: 0,
             isReadOnly: 'true'
        },
        {
            header: 'Tên dự án',
            binding: 'ProductName',
            width: 400,
            wordWrap: 'true',
             isReadOnly: 'true'
        },
       
        // {
        //     header: 'Gói thầu',
        //     binding: 'Description0',
        //     width: 400,
        //     wordWrap: 'true',
        //      isReadOnly: 'true'
        // },
        
     
        {
            header: 'Tổng',
            binding: 'Total',
            dataType: 'Number',
            isRequired: true,
            width: 100,
             isReadOnly: 'true'
        },
        {
            header: 'Đã duyệt',
            binding: 'Approved',
            dataType: 'Number',
            isRequired: true,
            width: 100,
             isReadOnly: 'true'
        },
        {
            header: 'Đang trình',
            binding: 'DangTrinh',
            dataType: 'Number',
            isRequired: true,
            width: 100,
             isReadOnly: 'true'
        },
        {
            header: 'Chưa trình',
            binding: 'ChuaTrinh',
            dataType: 'Number',
            isRequired: true,
            width: 100,
             isReadOnly: 'true'
        },
        {
            header: 'Tỷ lệ đã duyệt/Tổng',
            binding: 'TyLeDaDuyet',
            dataType: 'Number',
            format: 'p2',
            isRequired: true,
            min: 0,
            max: 1,
            width: 60,
              isReadOnly: 'true'
        },
        {
            header: 'Đã ký cứng',
            binding: 'DaKyCung',
            dataType: 'Number',
            isRequired: true,
            width: 100,
             isReadOnly: 'true'
        },
        {
            header: 'Chưa ký cứng',
            binding: 'ChuaKyCung',
            dataType: 'Number',
            isRequired: true,
            width: 100,
             isReadOnly: 'true'
        },
        {
            header: 'Tỷ lệ đã ký/Tổng',
            binding: 'TyLeDaKy',
            dataType: 'Number',
            format: 'p2',
            isRequired: true,
            min: 0,
            max: 1,
            width: 60,
              isReadOnly: 'true'
        },
        {
            header: 'Kế hoạch BCH cam kết (kỳ trước)',
            binding: 'KeHoachBCHKyTruoc',
            width: 350,
            wordWrap: 'true',
             isReadOnly: 'true'
        },
        {
            header: 'Kế hoạch BCH cam kết (kỳ này)',
            binding: 'KeHoachBCHKyNay',
            width: 350,
            wordWrap: 'true'
        },
        {
            header: 'Nguyên nhân chậm trễ',
            binding: 'Reason',
            width: 350,
            wordWrap: 'true'
        },
        {
            header: 'Ghi chú',
            binding: 'Remark',
            width: 350,
            wordWrap: 'true'
        },
    ]
   
}
