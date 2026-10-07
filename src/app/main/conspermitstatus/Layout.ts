import { PanelBase } from "../../ui/panel/PanelBase";
import { TablePanel } from "../../ui/panel/TablePanel";
import { DateBoxInput } from "../../ui/input/DateBoxInput";
import { TextBoxInput } from "../../ui/input/TextBoxInput";
import { LookupBoxInput } from "../../ui/input/LookupBoxInput";
import { CheckBoxInput } from "../../ui/input/CheckBoxInput";
import { Validators } from "@angular/forms";
import { IEditorFormulaDeclaration } from ".././IEditorDeclare";
import { IExplorerFormulaDeclaration } from ".././IExplorerDeclare";
import { NONAME } from "dns";

/**
 * TÌNH TRẠNG GIẤY PHÉP XÂY DỰNG (GPXD)
 *
 * Bảng   : B30ConsPermit (cha) / B30ConsPermitDetail (chi tiết)
 * DocCode: 'GP'
 * Đính kèm và bước duyệt dùng lại các bảng chuẩn của hệ thống.
 */

/** Số ngày cảnh báo "Sắp đến hạn" trên panel Tổng quan hồ sơ. */
export const CONS_PERMIT_DUE_SOON_DAYS = 30;

/** Mã tình trạng GPXD - khớp danh mục Class/ConsPermitStatus và cột PermitStatus. */
export const CONS_PERMIT_STATUS = {
    NONE: '0',      // Chưa có
    HAS: '1'        // Đã có
};


export class LayoutConsPermitStatusExplorer implements IExplorerFormulaDeclaration {

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30ConsPermit_Explorer',
                FilterKey: "(ProductCostId = '{VAR=Filter.ProductCostId}') AND IsActive = 1 AND DocCode = 'GP' AND ISNULL(BranchCode,'') = '{VAR=Branch.Ma_Dvcs}'",
                OrderBy: 'DocDate DESC,DocNo DESC',
                RowPage: 50
            },
             Child: {
                Name: 'vB30BizDocApprove_AEditConsPermit',
                ParentKey: 'BizDocId',
                ChildKey: 'BizDocId',
                OrderBy: 'ApproveGroup'
            }
        },
        PrintDocument: {
            Key: 'ConsPermitViewer',
            Text: 'Tình trạng giấy phép xây dựng - {VAR=ProductName} - {VAR=DocNo}',
            Command: 'usp_B30ConsPermit_VoucherForm',
            Command_WorkFlow: 'usp_Coteccons_WorkFlow_GetPrintData',
            LayoutPrint: [],
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'BuiltinOrder',
                    width: 60,
                    dataType: 'Number',
                    align: 'center'
                },
                {
                    header: 'Giai đoạn',
                    binding: 'StageName',
                    width: 150,
                    dataType: 'String'
                },
                {
                    header: 'ID Hợp đồng CĐT / LOA',
                    binding: 'ContractLOANo',
                    width: 160,
                    dataType: 'String'
                },
                {
                    header: 'Tình trạng GPXD',
                    binding: 'PermitStatusName',
                    width: 130,
                    dataType: 'String'
                },
                {
                    header: 'Số GPXD / Văn bản',
                    binding: 'PermitNo',
                    width: 160,
                    dataType: 'String'
                },
                {
                    header: 'Ngày cấp / Phát hành',
                    binding: 'IssuedDate',
                    width: 130,
                    dataType: 'Date',
                    format: 'dd/MM/yyyy'
                },
                {
                    header: 'Ngày có GPXD dự kiến',
                    binding: 'ExpectedDate',
                    width: 130,
                    dataType: 'Date',
                    format: 'dd/MM/yyyy'
                },
                {
                    header: 'Ghi chú',
                    binding: 'Description',
                    width: 200,
                    dataType: 'String'
                }
            ]
        }
    };

    parentGrid = [
        {
            header: 'Gói thầu/ PB',
            binding: 'ProductName',
            width: 300,
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
        },
        {
            header: 'Tổng số hồ sơ',
            binding: 'TotalDetail',
            width: 110,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Đã có GPXD',
            binding: 'TotalHasPermit',
            width: 110,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Chưa có GPXD',
            binding: 'TotalNoPermit',
            width: 110,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Sắp đến hạn',
            binding: 'TotalDueSoon',
            width: 110,
            dataType: 'Number',
            format: 'n0'
        },
        {
            header: 'Đã gửi duyệt',
            binding: 'ApproveSend',
            width: 110,
            dataType: 'Boolean'
        },
        {
            header: 'Hoàn thiện duyệt',
            binding: 'CompletedApprove',
            width: 130,
            dataType: 'Boolean'
        },
        {
            header: 'Đang xử lý',
            binding: 'XuLyTiepTheo',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Người lập',
            binding: 'FullName',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Id',
            binding: 'Id',
            width: 0,
            dataType: 'Number'
        }
    ];

    childGrid = [
        {
            header: 'STT',
            binding: 'ApproveGroup',
            dataType: 'Number',
            width: 50,
            align: 'center'
        },
        // {
        //     header: 'Bộ phận',
        //     binding: 'DeptName',
        //     width: 250,
        //     dataType: 'String'
        // },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 200,
            dataType: 'String'
        },
        // {
        //     header: 'Người thực hiện',
        //     binding: 'EmployeeName',
        //     width: 150
        // },
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
        },
    ]
}


export class LayoutConsPermitStatusEditor implements IEditorFormulaDeclaration {

    constructor(private srv?: any,
        private parentData?: any) {
    }

    /**
     * Thứ tự Child PHẢI khớp gridArray khai báo trong editor component:
     *   [0] grid  - Chi tiết tình trạng GPXD
     *   [1] grid1 - Danh sách tài liệu đính kèm
     *   [2] grid2 - Bước duyệt
     *   [3] grid3 - Workflow (nhật ký duyệt)
     */
    layout = {
        Structure: {
            Parent: {
                Name: 'vB30ConsPermit_Edit',
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    DocCode: 'GP',
                    BizDocId: '',
                    Id: -1,
                    DocDate: new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()))
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

    evaluators = {
        /** Sinh số hồ sơ tự động TTGPXD_01, chỉ khi thêm mới. */
        'Evaluator_ServerConstraint_DefaultDocNo': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},ProductCostId,DocCode,Id',
            Command: 'ufn_Newtecons_B30ConsPermit_DefaultDocNo',
            DataMember: 'DocNo',
            zExpr: "Id < 0"
        },

        /** Chặn lưu khi Business Key (BranchCode, DocCode, DocNo) bị trùng. */
        'Evaluator_ServerConstraint_CheckUniqueDocNo': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: '{VAR=Branch.Ma_Dvcs},BizDocId,DocCode,DocNo',
            Command: 'ufn_Newtecons_B30ConsPermit_CheckUniqueDocNo',
            MessageText: 'Số hồ sơ đã tồn tại, vui lòng kiểm tra lại',
            IgnoreError: 0
        },

        /** Không cho sửa hồ sơ do người khác lập. */
        'Evaluator_ServerConstraint_Check_UserModified': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: '{VAR=User.Id},BizDocId,DocCode',
            Command: 'ufn_Coteccons_CheckUser_ModifiedBy',
            MessageText: 'Không được điều chỉnh dữ liệu của người dùng khác',
            IgnoreError: 0,
            zExpr: 'Id > 0 && ApproveSend == false'
        },

        /** Nút "Tải dữ liệu": nạp danh sách tài liệu đính kèm vào lưới [1]. */
        'Evaluator_ServerConstraint_Document_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'BizDocId,DocDate,{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Newtecons_B30ConsPermitDocument_GetData',
            DataMember: '',
            OutputTable: 1
        },

        /** Nạp bước duyệt theo quy trình đã chọn vào lưới [2]. */
        'Evaluator_ServerConstraint_Approve_GetData': {
            EvaluatorName: 'EvaluatorQueryLoadChild',
            ConstraintKey: 'DocDate,ProcessCode,{VAR=Branch.Ma_Dvcs},ProductCostId,ParentBizDocId',
            Command: 'usp_B30BizDocApprove_GetData',
            DataMember: '',
            OutputTable: 2
        },

        /** Sau khi lưu: đánh lại số thứ tự dòng chi tiết. */
        'Evaluator_ServerUpdated_BuiltinOrder': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'BizDocId',
            Command: 'usp_Newtecons_B30ConsPermitDetail_UpdateBuiltinOrder'
        },

        /** Thêm dòng mới: kế thừa Giai đoạn / ID Hợp đồng CĐT-LOA của dòng liền trên. */
        'Evaluator_Detail_CopiedValue': {
            EvaluatorName: 'EvaluatorCopiedValues',
            DataMember: 'StageCode,ContractLOANo',
            Tables: 0
        },

          'Evaluator_UpdateInfo_WhenApproveSend': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: '{VAR=User.EmployeeCode},BizDocId,{VAR=EmptyField_CCMBudgetId},{VAR=Branch.Ma_Dvcs},DocCode',
            Command: 'usp_Coteccons_UpdateInfo_WhenApproveSend_SongSong',
            zExpr: 'ApproveSend == true'
        },
    };

    serverConstraint = [
        'Evaluator_ServerConstraint_DefaultDocNo'
    ];

    serverUpdating = [
        'Evaluator_ServerConstraint_CheckUniqueDocNo',
        'Evaluator_ServerConstraint_Check_UserModified'
    ];

    serverUpdated: string[] = [
        'Evaluator_ServerUpdated_BuiltinOrder',
        'Evaluator_UpdateInfo_WhenApproveSend'
    ];

    buttonLoadChild: string[] = [
        'Evaluator_ServerConstraint_Document_GetData',
        'Evaluator_ServerConstraint_Approve_GetData'
    ];

    buttonCommand: string[] = [];

    importCommand: string[] = [];

    rowAdded = [
        {
            Tables: 0,
            Evaluators: [
                'Evaluator_Detail_CopiedValue'
            ]
        }
    ];

    columnChanged = {
        ProcessCode: {
            Evaluators: [
                'Evaluator_ServerConstraint_Approve_GetData'
            ]
        }
    };

    columnChangedChild = [
        {
            Tables: 0,
            columnChanged: {}
        }
    ];

    columnsReadOnly = [];

    linkReporter = {};

    /** Khối "Thông tin chung" ở đầu phiếu. */
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
                    col: 6
                }),
                new TextBoxInput({
                    key: 'DocNo',
                    label: 'Số',
                    type: 'text',
                    validators: [Validators.required],
                    isReadOnly: 'true',
                    col: 6,
                    style: 'background-color:#F1EDED;border-radius:8px;'
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu',
                    lookupKey: 'ProductCost',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN ('1','3') AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    validators: [Validators.required],
                    hideValueMember: true,
                    col: 6
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
                    col: 6
                }, this.srv, this.parentData),
                new CheckBoxInput({
                    key: 'CompletedApprove',
                    label: 'Đã hoàn thành duyệt',
                    isDisabled: 'true',
                    col: 6
                })
            ]
        })
    ];

    /** [0] Lưới "Danh sách tình trạng giấy phép xây dựng". */
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
                Name: 'PermitStatusName'
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
        {
            /**
             * Cột chỉ để hiển thị 2 nút Nhân bản / Xóa (render trong
             * registerBadgeRenderers của editor component). Không tồn tại trong
             * view nên phải khai báo ở childColumnsNotSave bên dưới.
             */
            header: 'Thao tác',
            binding: 'Actions',
            width: 100,
            align: 'center',
            isReadOnly: 'true'
        }
    ];

    /** Cột chỉ hiển thị phía client - không gửi lên server khi lưu. */
    childColumnsNotSave = {
        0: ['Actions']
    };

    /** [1] Lưới "Danh sách tài liệu đính kèm". */
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
            isRequired: true
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
            validators: "{EXPR=Attached} == true && {EXPR=FilePath}==0",
            validatorMessage: 'Yêu cầu đính kèm tài liệu',
            ignoreError: 1
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
            header: 'Mã bộ phận',
            binding: 'DeptCode',
            width: 0,
            dataType: 'Array',
            lookupKey: 'Dept',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            isReadOnly: 'true'
        },
        {
            header: 'Tên bộ phận',
            binding: 'DeptName',
            width: 220,
            isReadOnly: 'true'
        },
        {
            header: 'Mã cấp bậc',
            binding: 'PositionCode',
            width: 0,
            dataType: 'Array',
            lookupKey: 'Position',
            lookupfilter: 'IsGroup=0 AND IsActive=1',
            isReadOnly: 'true'
        },
        {
            header: 'Cấp bậc duyệt',
            binding: 'PositionName',
            width: 220,
            isReadOnly: 'true'
        },
        {
            header: 'Mã nhân viên',
            binding: 'EmployeeCode',
            width: 150,
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
            width: 220,
            isReadOnly: 'true'
        },
        {
            header: 'Nhân viên duyệt được chỉ định',
            binding: 'EmployeeCodeReal',
            dataType: 'Array',
            lookupKey: 'Employee',
            lookupfilter: "IsActive=1 AND Code IN (SELECT EmployeeCode FROM B20ProductHuman WHERE IsActive = 1 AND ProductCostId='{EXPR=ProductCostId}' AND PositionCode = '{EXPR=PositionCode}')",
            width: 180,
            validators: "{EXPR=EmployeeCode} != '' && {EXPR=EmployeeCode}.toString().indexOf(',') > 0 && {EXPR=EmployeeCodeReal} == ''",
            validatorMessage: 'Không được bỏ trống giá trị',
            ignoreError: 1
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

    /** [3] Lưới "Workflow" - nhật ký duyệt, chỉ đọc. */
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
