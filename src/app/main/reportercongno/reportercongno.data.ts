import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP07_KQT_CN',
            text: 'Báo cáo theo dõi công nợ tại thời điểm',
            command: 'usp_Vct_BangTongHopDeNghiThanhToanBill_TheoHanThanhToan_TongHop',
            ctorArg: { 'Commandkey': 'REP07_KQT_CN', 'BranchCode': 'N01'},
            // subTotals: { '0': 'ProductName,CustomerName' },
            
            showTotalGroup: false,
            bAllowGrandTotal: [0],
           
            parameters: [
                {
                    className: 'DateBoxInput',
                    key: 'DocDate1',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    label: 'Từ ngày'
                },
                {
                    className: 'DateBoxInput',
                    key: 'DocDate2',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    label: 'Đến ngày'
                },
                {
                    className: 'LookupBoxInput',
                    key: 'ProductCostId',
                    lookupKey: 'ProductCost',
                    label: 'Gói thầu',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType = 1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: false
                },
                {
                    className: 'MultiSelectInput',
                    key: 'ContractType',
                    lookupKey: 'ContractType',
                    label: 'Loại hợp đồng',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    hideValueMember: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'DocType',
                    lookupKey: 'Class',
                    label: 'Lấy dữ liệu',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode = 'BCHTT'",
                    hideValueMember: false,
                    validators: [Validators.required]
                },
                {
                    className: 'LookupBoxInput',
                    key: 'RepType',
                    lookupKey: 'Class',
                    label: 'Loại báo cáo',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode = 'REP01_CNHTT'",
                    hideValueMember: false,
                    validators: [Validators.required]
                },
                {
                    className: 'LookupBoxInput',
                    key: 'CompletedApprove',
                    lookupKey: 'Class',
                    label: 'Trạng thái kế toán',
                    lookupfilter: "ParentCode='CompletedApprove'",
                    hideValueMember: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'GDDAApprove',
                    lookupKey: 'Class',
                    label: 'Trạng thái GDDA',
                    lookupfilter: "ParentCode='CompletedApprove'",
                    hideValueMember: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'CCMApprove',
                    lookupKey: 'Class',
                    label: 'Trạng thái CCM',
                    lookupfilter: "ParentCode='CompletedApprove'",
                    hideValueMember: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'BranchCode',
                    lookupKey: 'Branch',
                    lookupfilter: "Ma_Dvcs ='{VAR=Branch.Ma_Dvcs}'",
                    label: 'Đơn vị',
                    validators: [Validators.required]
                }
            ],
            data: {
                grdReport: [
                    {
                      
                            
                          
                           
                                header: 'STT',
                                binding: '_Stt',
                                width: 100
                           
                       
                    },
                    {
                        header: 'Nội dung',
                        binding: 'GroupName',
                        width: 300
                    },
                    
                    {
                        header: 'GT đề nghị',
                        binding: 'Amount_DeNghiTT',
                        width: 120,
                        aggregate: 'Sum'
                    },
                    {
                        header: 'GT đã thanh toán',
                        binding: 'AmountUNC',
                        width: 120,
                        aggregate: 'Sum'
                    },
                    {
                        header: 'GT còn lại',
                        binding: 'DiffAmount',
                        width: 120,
                        aggregate: 'Sum'
                    }
                
                ]
            },
            title: {
                cols: 2,
                row: {
                    0: [
                        {
                            label: "",
                            style: "color: green;text-align: center",
                            styleobject: { "color": "blue", "text-align": "left" },
                            colspan: 12,
                            col: 1
                        }
                    ],
                    1: [
                        {
                            label: "BÁO CÁO THEO DÕI CÔNG NỢ TẠI THỜI ĐIỂM",
                            style: "text-align: center;",
                            styleobject: { "text-align": "center", "color": "blue", "font-size": "14pt" },
                            colspan: 12,
                            height: 50,
                            col: 1
                        }
                    ]
                   
                }
            },
            formatGroup: {
                grdReport: [
                    {
                        level: -1,
                        style: { fontWeight: '' }
                    },
                    {
                        level: 0,
                        style: { fontWeight: 'bold' }
                    },
                    {
                        level: 1,
                        style: { fontWeight: 'bold' }
                    }
                ]
            }
        }
    ]
}