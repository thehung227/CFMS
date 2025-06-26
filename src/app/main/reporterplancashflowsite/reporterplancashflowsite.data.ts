import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP_ProjectCashFlow',
            text: 'Báo cáo dòng tiền dự án',
            command: 'usp_SOL_BcDongTienDuAn',
            ctorArg: { 
                Commandkey: 'REP_ProjectCashFlow', 
                Ma_Dvcs: 'A01', 
                ProductCostId: Global.convertConfig('{VAR=Filter.ProductCostId}'),
                Account: '111,112,341',
                CurrencyCode0: 'VND'
            },
            subTotals: { '0': 'ProductName' },
            nCollapseNodesOnCreate: { '0': 1 },
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
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType='1' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}'))", // AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))
                    hideValueMember: false,
                    validators: [Validators.required]
                },
                {
                    className: 'LookupBoxInput',
                    key: 'CCMBudgetId',
                    lookupKey: 'CCMBudget',
                    label: 'Kế hoạch',
                    lookupfilter: "ProductCostId = '{EXPR=ProductCostId}' AND IsGroup=0 AND IsActive=1 AND DocCode='K6' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                    isContentHtml: false,
                    validators: [Validators.required]
                },
                {
                    className: 'LookupBoxInput',
                    key: 'Ma_Dvcs',
                    lookupKey: 'Branch',
                    lookupfilter: "Ma_Dvcs ='{VAR=Branch.Ma_Dvcs}'",
                    label: 'Đơn vị',
                    validators: [Validators.required]
                }
            ],
            data: {
                grdReport: [
                    {
                        header: 'Công trình',
                        binding: 'ProductName',
                        width: 300
                    },
                    {
                        header: 'Thời gian',
                        binding: 'DocDate',
                        width: 100
                    },
                    {
                        header: 'KẾ HOẠCH',
                        columns: [
                            {
                                header: 'Thi công',
                                binding: 'KeHoachKhoiLuongThiCong',
                                width: 120,
                                aggregate: 'Sum'
                            },
                            {
                                header: 'Doanh Thu',
                                binding: 'KeHoachDoanhThu',
                                width: 120,
                                aggregate: 'Sum'
                            },
                            {
                                header: '% Doanh Thu',
                                binding: 'RateDoanhThu',
                                width: 90,
                                format: 'P2'
                            },
                            {
                                header: 'Thu',
                                binding: 'KeHoachThu',
                                width: 120,
                                aggregate: 'Sum'
                            },
                            {
                                header: '% Thu',
                                binding: 'RateThu',
                                width: 90,
                                format: 'P2'
                            },
                            {
                                header: 'Chi',
                                binding: 'KeHoachChi',
                                width: 120,
                                aggregate: 'Sum'
                            },
                            {
                                header: '% chi',
                                binding: 'RateChi',
                                width: 90,
                                format: 'P2'
                            },
                            {
                                header: 'Lũy kế Thu - Chi',
                                binding: 'LK_KH_ThuChi',
                                width: 120
                             
                            },
                        ]
                    },
                    {
                        header: 'Giá trị thực hiện (Chưa VAT)',
                        binding: 'AmountThucHienNotVAT',
                        aggregate: 'Max',
                        width: 120
                    },
                    {
                        header: 'THỰC TẾ',
                        columns: [
                            {
                                header: 'Doanh Thu',
                                binding: 'DoanhThuThucTe',
                                width: 120,
                                aggregate: 'Sum'
                            },
                            {
                                header: 'Thu',
                                binding: 'ThucTeThu',
                                width: 120,
                                aggregate: 'Sum'
                            },
                            {
                                header: 'Chi',
                                binding: 'ThucTeChi',
                                width: 120,
                                aggregate: 'Sum'
                            },
                            {
                                header: 'Lũy kế Thu - Chi',
                                binding: 'LK_TT_ThuChi',
                                width: 120
                            },
                        ]
                    },
                    {
                        header: 'Ghi chú',
                        binding: 'Description',
                        width: 300
                    },
                    // {
                    //     header: 'Gói thanh toán',
                    //     binding: 'ProductCostId',
                    //     width: 120
                    // },
                    // {
                    //     header: 'Gói đại diện',
                    //     binding: 'ProductCostId0',
                    //     width: 120
                    // }
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
                            label: "BÁO CÁO DÒNG TIỀN DỰ ÁN",
                            style: "text-align: center;",
                            styleobject: { "text-align": "center", "color": "blue", "font-size": "14pt" },
                            colspan: 12,
                            height: 50,
                            col: 1
                        }
                    ],
                    2: [
                        {
                            label: "Gói thầu: {VAR=ProductName}",
                            style: "text-align: center",
                            styleobject: { "text-align": "center", "color": "blue" },
                            col: 1,
                            colspan: 12
                        }
                    ],
                    3: [
                        {
                            label: "Từ ngày: {VAR=FromDateStr} Đến ngày: {VAR=ToDateStr}",
                            style: "text-align: center",
                            styleobject: { "text-align": "center", "color": "blue" },
                            col: 1,
                            colspan: 12
                        }
                    ],
                    4: [
                        {
                            label: "Đối tác: {VAR=CustomerName}",
                            style: "text-align: center",
                            styleobject: { "text-align": "center", "color": "blue" },
                            col: 1,
                            colspan: 12
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