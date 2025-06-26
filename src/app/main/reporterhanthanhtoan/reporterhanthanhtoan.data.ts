import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP07_KQT_BCTC',
            text: 'Báo cáo theo dõi công nợ tại thời điểm',
            command: 'usp_Vct_BangTongHopDeNghiThanhToanBill_TheoHanThanhToan',
            ctorArg: { 'Commandkey': 'REP07_KQT_HTT', 'BranchCode': 'N01'},
            // subTotals: { '0': 'ProductName,CustomerName' },
            treeNode: [0],
            showTotalGroup: false,
            bAllowGrandTotal: [0],
            nCollapseNodesOnCreate: {'0': 3},
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
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode = 'REP01_LoaiPsCnCt'",
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
                },
                {
                    className: 'CheckBoxInput',
                    key: 'IsEqip',
                 
                    label: 'Phòng Thiết Bị',
                    
                },
                {
                    className: 'CheckBoxInput',
                    key: 'IsGroupGD',
                 
                    label: 'Không nhóm theo GDDH',
                    
                },
            ],
            data: {
                grdReport: [
                    {
                        header: 'Chứng từ',
                        columns: [
                            {
                                header: 'Ngày',
                                binding: 'DocDate',
                                width: 100,
                                format:'dd/MM/yyyy'
                            },
                          
                            {
                                header: 'Số',
                                binding: 'DocNo',
                                width: 100
                            },
                        ]
                    },
                    {
                        header: 'Nội dung',
                        binding: 'Description',
                        width: 300
                    },
                    {
                        header: 'NTP/NCC',
                        columns: [
                            {
                                header: 'Mã',
                                binding: 'CustomerCode',
                                width: 100
                            },
                          
                            {
                                header: 'Tên',
                                binding: 'CustomerName',
                                width: 300
                            },
                        ]
                    },
                   
                    {
                        header: 'GT đề nghị',
                        binding: 'Amount_DeNghiTT',
                        width: 120,
                        aggregate: 'Sum'
                    },
                    {
                        header: 'Hạn thanh toán',
                        columns: [
                            {
                                header: 'Ngày tính hạn thanh toán',
                                binding: 'Date_Liquidation',
                                width: 100,
                                format:'dd/MM/yyyy'
                            },
                          
                            {
                                header: 'Hạn thanh toán',
                                binding: 'DueDate',
                                width: 100
                            },
                            {
                                header: 'Ngày hạn thanh toán',
                                binding: 'DateDue',
                                width: 100,
                                format:'dd/MM/yyyy'
                            },
                        ]
                    },
                    {
                        header: 'Thanh toán',
                        columns: [
                            {
                                header: 'Trong hạn',
                                binding: 'TimelyPayments',
                                width: 100,
                                aggregate: 'Sum'
                                
                            },
                            {
                                header: 'Quá hạn',
                                binding: 'OverduePayment',
                                width: 100,
                                aggregate: 'Sum'
                                
                            },
                            {
                                header: 'Ngày thanh toán',
                                binding: 'DocDateUNC',
                                width: 100,
                                format:'dd/MM/yyyy'
                            },
                        ]
                    },
                    {
                        header: 'Công nợ',
                        columns: [
                            {
                                header: 'Trong hạn',
                                binding: 'NotDueDebt',
                                width: 100,
                                aggregate: 'Sum'
                                
                            },
                            {
                                header: 'Quá hạn 30 ngày',
                                binding: 'NotDueDebt30',
                                width: 100,
                                aggregate: 'Sum'
                                
                            },
                            {
                                header: 'Quá hạn 30 đến 60 ngày',
                                binding: 'NotDueDebt60',
                                width: 100,
                                aggregate: 'Sum'
                                
                            },
                            {
                                header: 'Quá hạn trên 60 ngày',
                                binding: 'NotDueDebt90',
                                width: 100,
                                aggregate: 'Sum'
                                
                            },
                            {
                                header: 'Tổng Quá hạn',
                                binding: 'OverdueDebt',
                                width: 100,
                                aggregate: 'Sum'
                                
                            },
                            {
                                header: 'Ngày Quá hạn',
                                binding: 'DayNotDueDebt',
                                width: 100,
                                aggregate: 'Sum'
                                
                            }
                        ]
                    },
   
                
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