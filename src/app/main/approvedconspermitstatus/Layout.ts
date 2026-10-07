import { PanelBase } from "../../ui/panel/PanelBase";
import { TablePanel } from "../../ui/panel/TablePanel";
import { DateBoxInput } from "../../ui/input/DateBoxInput";
import { TextBoxInput } from "../../ui/input/TextBoxInput";
import { LookupBoxInput } from "../../ui/input/LookupBoxInput";
import { CheckBoxInput } from "../../ui/input/CheckBoxInput";
import { NumberBoxInput } from "../../ui/input/NumberBoxInput";
import { RichTextBoxInput } from "../../ui/input/RichTextBoxInput";
import { Validators } from "@angular/forms";
import { IEditorFormulaDeclaration } from ".././IEditorDeclare";
import { IExplorerFormulaDeclaration } from ".././IExplorerDeclare";

/**
 * DUYỆT TÌNH TRẠNG GIẤY PHÉP XÂY DỰNG (GPXD)
 *
 * Module duyệt của conspermitstatus - chỉ đọc dữ liệu hồ sơ, người duyệt bấm
 * Duyệt / Trả lại / Đề xuất trả.
 *
 * Giao diện giữ nguyên như module lập (conspermitstatus): thứ tự Child bên dưới
 * PHẢI khớp gridArray trong editor component để các tab hiển thị đúng.
 */

/** Số ngày cảnh báo "Sắp đến hạn" trên panel Tổng quan hồ sơ. */
export const CONS_PERMIT_DUE_SOON_DAYS = 30;

/** Mã tình trạng GPXD - khớp danh mục Class/ConsPermitStatus và cột PermitStatus. */
export const CONS_PERMIT_STATUS = {
    NONE: '0',      // Chưa có
    HAS: '1'        // Đã có
};


export class LayoutApprovedConsPermitStatusExplorer implements IExplorerFormulaDeclaration {

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_ConsPermitExplorer',
                FilterKey: "ApproveSend = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'GP' AND IsActive=1 AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'ProductName,BizDocId,ApproveGroup',
                RowPage: 50
            }
        }
    };

    parentGrid = [
        {
            header: 'STT duyệt',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 80,
            align: 'center'
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
            width: 180,
            dataType: 'String'
        },
        {
            header: 'Người đã thực hiện',
            binding: 'EmployeeNameApprove',
            width: 160,
            dataType: 'String'
        },
        {
            header: 'Số ngày thực hiện',
            binding: 'NumberOfDays',
            width: 140,
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
            width: 300,
            dataType: 'String',
            isContentHtml: true
        },
        {
            header: 'Gói thầu/ PB',
            binding: 'ProductName',
            width: 280,
            dataType: 'String'
        },
        {
            header: 'Số',
            binding: 'DocNo',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Ngày lập',
            binding: 'DocDate',
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        }
    ];
}


export class LayoutApprovedConsPermitStatusEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    evaluators = {
        /** Ghi nhận kết quả duyệt: 0 = trả lại, 1 = duyệt, 3 = đề xuất trả. */
        'Evaluator_ServerUpdating_UpdateStatusByApproveStatus': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId,Id,ApproveStatus,{VAR=Branch.Ma_Dvcs},EmployeeCodeNext,DocCode,{VAR=User.Id},Comment,ApproveStatusWeb',
            Command: 'usp_Cotec_UpdateStatusByApproveStatus'
        }
    };

    /** Chỉ số lưới chứa bước duyệt - base dùng để tìm dòng duyệt hiện thời. */
    approveGrid = 2;

    serverConstraint = [];
    serverUpdating = [];
    serverUpdated: string[] = [];
    buttonLoadChild: string[] = [];
    buttonCommand: string[] = [];
    importCommand: string[] = [];

    columnChanged = {};

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {}
        }
    ];

    columnsReadOnly = [];

    linkReporter = {};

    /**
     * Thứ tự Child giữ ĐÚNG như module lập để giao diện không đổi:
     *   [0] grid  - Chi tiết tình trạng GPXD
     *   [1] grid1 - Danh sách tài liệu đính kèm
     *   [2] grid2 - Bước duyệt
     *   [3] grid3 - Workflow (nhật ký duyệt)
     */
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_ConsPermitEdit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'GP',
                    BizDocId: '',
                    Id: -1
                }
            },
            Child: [
                {
                    Name: 'vB30ConsPermitDetail_Edit',
                    ParentKey: 'BizDocId',
                    ChildKey: 'BizDocId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        DocDate: 'Parent.DocDate',
                        BuiltinOrder: '1',
                        PermitStatus: '0',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
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
                    Name: 'vB30BizDocApprove_AEditConsPermit',
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
                    DefaultValues: {
                        BizDocId: 'Parent.BizDocId',
                        DocDate: 'Parent.DocDate',
                        BranchCode: '{VAR=Branch.Ma_Dvcs}'
                    }
                }
            ]
        },
        PrintDocument: {
            Key: 'ConsPermitViewer',
            Text: 'Tình trạng giấy phép xây dựng - {VAR=DocNo}',
            Command: 'usp_B30ConsPermit_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [],
            PrintGrid: []
        }
    };

    /**
     * Khối "Thông tin chung" giữ nguyên các trường của module lập (đều khoá),
     * bổ sung thông tin bước duyệt và ô "Ý kiến" để người duyệt nhập.
     */
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
                    isReadOnly: 'true'
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số',
                    type: 'text',
                    isReadOnly: 'true',
                    col: 6,
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN ('1','3') AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: true,
                    isReadOnly: 'true',
                    col: 6,
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new CheckBoxInput({
                    key: 'ApproveSend',
                    label: 'Đã gửi duyệt',
                    isDisabled: 'true',
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive=1 AND Ma_Ct='{EXPR=DocCode}'",
                    hideValueMember: false,
                    isReadOnly: 'true',
                    col: 6,
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }, this.srv, this.parentData),
                new CheckBoxInput({
                    key: 'CompletedApprove',
                    label: 'Đã hoàn thành duyệt',
                    isDisabled: 'true',
                    col: 6
                }),

                // ---------------- Thông tin bước duyệt hiện thời ----------------
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
                new NumberBoxInput({
                    key: 'NumberOfDays',
                    label: 'Số ngày thực hiện',
                    type: 'number',
                    dataType: 'n0',
                    isDisabled: 'true',
                    col: 6
                }),
                new RichTextBoxInput({
                    key: 'Comment',
                    label: 'Ý kiến',
                    col: 12
                })
            ]
        })
    ];

    /** [0] Lưới "Danh sách tình trạng giấy phép xây dựng" - chỉ đọc. */
    childColumns = [
        {
            header: 'STT',
            binding: 'BuiltinOrder',
            width: 60,
            dataType: 'Number',
            format: 'n0',
            align: 'center'
        },
        {
            header: 'Giai đoạn',
            binding: 'StageCode',
            width: 100,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "ParentCode='ConsPermitStage'",
            hideValueMember: true,
            isRequired: true,
               bindingList: {
                Name: 'StageName'
            },
            validators: "{EXPR=StageCode} == ''",
            validatorMessage: 'Giai đoạn không được bỏ trắng',
            ignoreError: 1
        },
        {
            header: 'Giai đoạn',
            binding: 'StageName',
            width: 150,
            isReadOnly: 'true',
            dataType: 'String'
        },
        {
            header: 'ID Hợp đồng CĐT / LOA',
            binding: 'ContractLOANo',
            width: 170,
            dataType: 'String'
        },
        {
            header: 'Tình trạng GPXD',
            binding: 'PermitStatus',
            width: 90,
            dataType: 'Array',
            lookupKey: 'Class',
            lookupfilter: "ParentCode='ConsPermitStatus'",
            hideValueMember: true,
            bindingList: {
                NONAME: 'PermitStatusName'
            },
            ignoreError: 1
        },
         {
            header: 'Tình trạng GPXD',
            binding: 'PermitStatusName',
            width: 100,
            isReadOnly: 'true',
            dataType: 'String'
        },
        {
            header: 'Số GPXD / Văn bản',
            binding: 'PermitNo',
            width: 170,
            dataType: 'String'
        },
        {
            header: 'Ngày cấp / Phát hành',
            binding: 'IssuedDate',
            width: 160,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Ngày có GPXD dự kiến',
            binding: 'ExpectedDate',
            width: 170,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
        {
            header: 'Ghi chú',
            binding: 'Description',
            width: 240,
            dataType: 'String'
        },
      
    ];

    /** [1] Lưới "Danh sách tài liệu đính kèm" - chỉ xem/tải file, không sửa. */
    childColumns1 = [
        {
            header: 'STT',
            binding: 'BuiltinOrder',
            width: 60,
            dataType: 'Number',
            format: 'n0',
            align: 'center',
            isReadOnly: 'true'
        },
        {
            header: 'Diễn giải',
            binding: 'Description',
            width: 380,
            dataType: 'String',
            isReadOnly: 'true'
        },
        {
            header: 'Yêu cầu',
            binding: 'Attached',
            width: 120,
            dataType: 'Boolean',
            align: 'center',
            isReadOnly: 'true'
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 460,
            dataType: 'Object',
            allowUpload: false,
            allowRemove: false,
            allowView: true,
            allowDownLoad: true,
            folderId: '{EXPR=IdConsPermit}'
        }
    ];

    /** [2] Lưới "Bước duyệt". */
    childColumns2 = [
        {
            header: 'STT duyệt',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 80,
            align: 'center',
            isReadOnly: 'true'
        },
        {
            header: 'Tên bộ phận',
            binding: 'DeptName',
            width: 220,
            isReadOnly: 'true'
        },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 220,
            isReadOnly: 'true'
        },
        {
            header: 'Tên nhân viên',
            binding: 'EmployeeName',
            width: 220,
            isReadOnly: 'true'
        },
        {
            header: 'Số ngày xử lý',
            binding: 'NumberOfDays',
            width: 110,
            isReadOnly: 'true'
        },
        {
            header: 'Được trả lại hồ sơ',
            binding: 'ApproveReturn',
            dataType: 'Boolean',
            width: 120,
            isReadOnly: 'true'
        },
        {
            header: 'Trả về cấp bậc',
            binding: 'PositionCodeReturn',
            width: 150,
            isReadOnly: 'true'
        }
    ];

    /** [3] Lưới "Workflow" - nhật ký duyệt. */
    childColumns3 = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 60,
            align: 'center'
        },
        {
            header: 'Người thực hiện',
            binding: 'EmployeeName',
            width: 220
        },
        {
            header: 'Trạng thái',
            binding: 'ApproveStatusName',
            width: 130
        },
        {
            header: 'Ý kiến',
            binding: 'Comment',
            width: 300,
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
            width: 150,
            dataType: 'Date',
            format: 'dd/MM/yyyy HH:mm'
        }
    ];
}
