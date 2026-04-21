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


export class LayoutApprovedSettlementRecordsExplorer implements IExplorerFormulaDeclaration {
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

export class LayoutApprovedSettlementRecordsEditor implements IEditorFormulaDeclaration {

    buttonLoadChild: string[];
   
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

    // approveGrid = 1;

    serverConstraint = [
    ]

    serverUpdated = [
        
     ];

    serverUpdating = [

    ]

    columnChanged = {

    };

    linkReporter = {
         'btnBaoCao': {
            directory: 'reporterhsqtgiatri',
            type: 'view',
            key: 'REP04_QTHSQT_GIA_TRI',
            parameter: { 'Commandkey': 'REP04_QTHSQT_GIA_TRI', 'Id': '{EXPR=Id}', 'ProductCostId': '{EXPR=ProductCostId}'}
        }
    }

    columnsReadOnly = [];

    layout = {
        Structure: {
            Parent: {
                Name: 'vB30BizDocApprove_ApproveHSQT',
                
                DefaultValues: {
                    // BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    // DocCode: 'V1',
                    // BizDocId: '',
                    // Id: -1
                }
            },
            Child: [
                 {
                    Name: 'vB30HSQTQuyTrinh',
                    ParentKey: 'IdClaim',
                    ChildKey: 'ParentId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        ParentId: 'Parent.Id',
                        BuiltinOrder: '1'
                    }
                },
                {
                    Name: 'vB30HSQTGiaTri',
                    ParentKey: 'IdClaim',
                    ChildKey: 'ParentId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        ParentId: 'Parent.Id',
                        BuiltinOrder: '1'
                    }
                },
                {
                    Name: 'vB30HSQTKeHoachChiTiet',
                    ParentKey: 'IdClaim',
                    ChildKey: 'ParentId',
                    Sort: 'BuiltinOrder',
                    DefaultValues: {
                        ParentId: 'Parent.Id',
                        BuiltinOrder: '1',
                        IsTitleRow: true
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
                new DateBoxInput({
                    key: 'DocDate',
                    label: 'Ngày lập',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    validators: [Validators.required],
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'ProductCostId',
                    label: 'Gói thầu',
                    lookupKey: 'ProductCost',
                 
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1) AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    col: 12
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProcessCode',
                    label: 'Quy trình duyệt',
                    lookupKey: 'Approve',
                    lookupfilter: "IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: false,
                    col: 12,
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Description',
                    label: 'Ghi chú',
                    type: 'text',
                    isNewRow: true,
                    col: 12
                }),
                 new NumberBoxInput({
                    key: 'DoanhThuBCTC',
                    label: 'DOANH THU BCTC',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    isNewRow: true,
                    
                }),
                new NumberBoxInput({
                    key: 'GiaTriQuyetToanDuKien',
                    label: 'GT DỰ KIẾN QT CĐT ( chưa VAT)',
                    type: 'number',
                    isReadOnly: 'true',
                    col: 6,
                }),
                new NumberBoxInput({
                    key: 'DoanhThuConLaiPhaiXN',
                    label: 'DT CÒN LẠI PHẢI XÁC NHẬN(CHƯA VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                    isNewRow: true,
                    
                }),
                new NumberBoxInput({
                    key: 'GTPhaiThuDenQT',
                    label: 'GT PHẢI THU ĐẾN QT (TC TRỰC TIẾP)(GỒM VAT)',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                }),

                 new NumberBoxInput({
                    key: 'NgayDuyetTheoHD',
                    label: 'Số ngày duyệt theo HĐ',
                    type: 'number',
                    col: 6,
                    isReadOnly: 'true',
                }),
                new NumberBoxInput({
                    key: 'Rate1',
                    label: '% đã TT/GT dự kiến QT (TC trực tiếp)',
                    type: 'number',
                    col: 6,
                    format: 'p2',
                    isReadOnly: 'true',
                }),
                new DateBoxInput({
                    key: 'NgayHoanThanhThiCongThucTe',
                    label: 'Ngày hoàn thành thi công',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    isReadOnly: 'true',
                      isNewRow: true,
                    col: 6
                }),
                new DateBoxInput({
                    key: 'NgayCamKetKyQuyetToan',
                    label: 'Ngày cam kết quyết toán',
                    type: 'date',
                    isReadOnly: 'true',
                    format: 'dd/MM/yyyy',
                    
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
                // new LookupBoxInput({
                //     key: 'InformMethod',
                //     label: 'Kiểu thông báo',
                //     lookupKey: 'Class',
                //     lookupfilter: "ParentCode='InformMethod'",
                //     hideValueMember: false,
                //     isDisabled: 'true',
                //     style: 'background-color:#F1EDED;border-radius:8px;',
                //     col: 6
                // }, this.srv, this.parentData),
                 new ButtonInput({
                    key: 'btnBaoCao',
                    label: 'Báo cáo trình hồ sơ quyết toán',
                    col: 6
                }),
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
            header: 'STT',
            binding: 'ItemNo',
            width: 60,
             
        },
        {
            header: 'Bộ phận tiếp nhận/Xử lý',
            binding: 'BoPhanTiepNhanXuLy',
            width: 150,
            wordWrap: 'true',
        },
        {
            header: 'Tên hồ sơ',
            binding: 'TenHoSo',
            width: 200,
            wordWrap: 'true',
        },
       {
            header: 'Số lượng hồ sơ',
            binding: 'SoLuongHoSo',
            dataType: 'Number',
            isRequired: true,
            width: 60,
        },
        {
            header: 'Hình thức hồ sơ',
            binding: 'HinhThucHoSo',
            dataType: 'Array',
            lookupKey: 'Class',
            bindingList: {
                Name: 'TenHinhThucHoSo'
            },
            lookupfilter: "IsActive=1 AND ParentCode='HinhThucHoSo'",
            hideValueMember: true,
            width: 100,
        },
         {
            header: 'Hình thức hồ sơ',
            binding: 'TenHinhThucHoSo',
            width: 100,
            wordWrap: 'true',
             isReadOnly: 'true'
        },
         {
            header: 'Số ngày xử lý',
            binding: 'SoNgayXuLy',
            dataType: 'Number',
            isRequired: true,
            width: 60,
        },
        {
            header: 'Ghi chú',
            binding: 'GhiChu',
            width: 350,
            wordWrap: 'true'
        }
    ]

    childColumns1 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 60,
             
        },
       
        // {
        //     header: 'Tên dự án',
        //     binding: 'ProductName',
        //     width: 180,
        //     wordWrap: 'true',
        //      isReadOnly: 'true'
        // },
       
        {
            header: 'Gói thầu',
            binding: 'GoiThau',
            width: 250,
            wordWrap: 'true',
            isReadOnly: 'true'
        },
        
       
        {
            header: 'GT PS CĐT chưa duyệt ( chưa VAT)',
            binding: 'GiaTriPhatSinhCDTChuaDuyet_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 120,
            aggregate: 'Sum'
        },
         {
            header: 'Cam kết ký PLHĐ chốt PS'	,
            binding: 'CamKetKyPLHDChotPhatSinh',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100
        },
         {
            header: 'Ngày hoàn thành TC thực tế'	,
            binding: 'NgayHoanThanhThiCongThucTe',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:120
        },
         {
            header: 'Ngày ký TOC'	,
            binding: 'NgayKyTOC',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100
        },
         {
            header: 'Tình trạng ký TOC',
            binding: 'TinhTrangKyTOC',
            dataType: 'Array',
            lookupKey: 'Class',
            bindingList: {
                // DocName: 'Description0'
            },
            lookupfilter: "IsActive=1 AND ParentCode='KyTOC'",
            hideValueMember: true,
            width: 100
        },
          {
            header: 'Ngày cam kết ký QT'	,
            binding: 'NgayCamKetKyQuyetToan',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100							
        },
          {
            header: 'Tình trạng HSQT',
            binding: 'TinhTrangHoSoQuyetToan',
            width: 150,
            wordWrap: 'true'
        },
         {
            header: 'Nguyên nhân chậm kế hoạch so với kế hoạch trước',
            binding: 'NguyenNhanChamKeHoach',
            width: 250,
            wordWrap: 'true'
        },
        {
            header: 'GT dự kiến QT CĐT (TC trực tiếp) chưa VAT',
            binding: 'GiaTriDuKienQT_TrucTiep_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 160,
            aggregate: 'Sum'
        },
      {
            header: 'GT dự kiến QT CĐT (TC NSC) chưa VAT',
            binding: 'GiaTriDuKienQT_NSC_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            aggregate: 'Sum'
        },
         {
            header: 'Tổng GT dự kiến QT CĐT chưa VAT',
            binding: 'TongGiaTriDuKienQT_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
         {
            header: 'DT đã xác nhận (TC trực tiếp) chưa VAT',
            binding: 'DoanhThuDaXacNhan_TrucTiep_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            aggregate: 'Sum'
        },
      {
            header: 'DT đã xác nhận (TC NSC) chưa VAT',
            binding: 'DoanhThuDaXacNhan_NSC_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            aggregate: 'Sum'
        },
         {
            header: 'Tổng DT đã xác nhận chưa VAT',
            binding: 'TongDoanhThuDaXacNhan_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
        {
            header: 'DT còn lại (TC trực tiếp) chưa VAT',
            binding: 'DoanhThuConLai_TrucTiep_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
      {
            header: 'DT còn lại (TC NSC) chưa VAT',
            binding: 'DoanhThuConLai_NSC_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
         {
            header: 'Tổng DT còn lại chưa VAT',
            binding: 'TongDoanhThuConLai_ChuaVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
       
        {
            header: 'GT dự kiến QT CĐT(TC trực tiếp) (gồm VAT)',
            binding: 'GiaTriDuKienQT_TrucTiep_GomVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            aggregate: 'Sum'
        },
      {
            header: 'GT dự kiến QT CĐT (TC NSC) (gồm VAT)',
            binding: 'GiaTriDuKienQT_NSC_GomVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            aggregate: 'Sum'
        },
         {
            header: 'Tổng GT dự kiến QT CĐT gồm VAT',
            binding: 'TongGiaTriDuKienQT_GomVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
         {
            header: 'GT CĐT đã TT (TC trực tiếp) gồm VAT',
            binding: 'CDTThanhToan_TrucTiep_GomVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            aggregate: 'Sum'
        },
      {
            header: 'GT CĐT đã TT (TC NSC) gồm VAT',
            binding: 'CDTThanhToan_NSC_GomVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            aggregate: 'Sum'
        },
         {
            header: 'Tổng GT CĐT đã TT gồm VAT',
            binding: 'CDTThanhToan_GomVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
        {
            header: 'GT phải thu đến QT (TC trực tiếp) gồm VAT',
            binding: 'PhaiThuConLai_TrucTiep_GomVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
        {
            header: 'GT phải thu đến QT (NSC) gồm VAT',
            binding: 'PhaiThuConLai_NSC_GomVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
     {
            header: 'Tổng GT phải thu đến QT gồm VAT',
            binding: 'PhaiThuConLai_GomVAT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true',
            aggregate: 'Sum'
        },
    ]

    childColumns2 = [
        {
            header: 'STT',
            binding: 'ItemNo',
            width: 60,
             
        },
        {
            header: 'Bộ phận tiếp nhận/Xử lý',
            binding: 'BoPhanTiepNhanXuLy',
            width: 150,
            wordWrap: 'true',
        },
        {
            header: 'Tên hồ sơ',
            binding: 'TenHoSo',
            width: 200,
            wordWrap: 'true',
        },
       {
            header: 'Số lượng hồ sơ',
            binding: 'SoLuong',
            dataType: 'Number',
            isRequired: true,
            width: 60,
        },
        {
            header: 'Hình thức hồ sơ',
            binding: 'HinhThucHoSo',
            dataType: 'Array',
            lookupKey: 'Class',
            bindingList: {
                Name: 'TenHinhThucHoSo'
            },
            lookupfilter: "IsActive=1 AND ParentCode='HinhThucHoSo'",
            hideValueMember: true,
            width: 100,
        },
         {
            header: 'Hình thức hồ sơ',
            binding: 'TenHinhThucHoSo',
            width: 100,
            wordWrap: 'true',
             isReadOnly: 'true'
        },
         {
            header: 'Số ngày xử lý',
            binding: 'SoNgayXuLy',
            dataType: 'Number',
            isRequired: true,
            width: 60,
        },
         {
            header: 'Kế hoạch trình hồ sơ'	,
            binding: 'KeHoach_NgayTrinhHoSo',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100							
        },
         {
            header: 'Ngày đến hạn phê duyệt'	,
            binding: 'KeHoach_NgayDenHanPheDuyet',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100,
             isReadOnly: 'true'							
        },
        {
            header: 'Ghi chú',
            binding: 'KeHoach_GhiChu',
            width: 350,
            wordWrap: 'true'
        },
          {
            header: 'Ngày trình hồ sơ thực tế'	,
            binding: 'ThucTe_NgayTrinhHoSo',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100							
        },
        {
            header: 'Ngày hoàn thành thực tế'	,
            binding: 'ThucTe_NgayHoanThanh',
            dataType: 'Date',
            isRequired: false,
            format: 'dd/MM/yyyy',
            width:100							
        },
        {
            header: 'Tình trạng',
            binding: 'TinhTrang',
            width: 150,
            wordWrap: 'true'
        },
         {
            header: 'Số ngày quá hạn',
            binding: 'SoNgayQuaHan',
            dataType: 'Number',
            isRequired: true,
            width: 60,
            aggregate: 'Sum'
        },
         {
            header: 'Nguyên nhân/ Giải pháp',
            binding: 'ThucTe_GhiChu',
            width: 350,
            wordWrap: 'true'
        },
        {
            header: 'Gói thầu',
            binding: 'GoiThau',
            width: 0,
            wordWrap: 'true'
        },
    ];

    childColumns3 = [
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
    ]

    childColumns4 = [
        // {
        //     header: 'Mã tài liệu',
        //     binding: 'DocumentCode',
        //     width: 80,
        //     dataType: 'Array',
        //     lookupKey: 'Document',
        //     lookupfilter: 'IsGroup=0 AND IsActive=1'
        // },
        {
            header: 'Tên tài liệu',
            binding: 'Description',
            width: 250,
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
            folderId: '{EXPR=IdClaim}'
        }
    ]
   
}
