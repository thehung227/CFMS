import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP05_TiTrongMuaHang',
            text: 'Báo cáo tỉ trọng mua hàng - gói thầu',
            command: 'usp_TMCtc_BaoCaoTiTrongMuaHang',
            ctorArg: { 'Commandkey': 'REP05_TiTrongMuaHang', 'Ma_Dvcs': 'C01', 'ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}') },
            subTotals: { '0': 'ItemGroupName' },
            nCollapseNodesOnCreate: { '0': 0 },
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
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType = 1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",// AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: false,
                    validators: [Validators.required]
                },
                {
                    className: 'MultiSelectInput',
                    key: 'ItemCode',
                    lookupKey: 'Item',
                    label: 'Nhóm hàng',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ClassCode3='TM' AND (BranchCode='{VAR=Branch.Ma_Dvcs}' OR BranchCode='')",
                    hideValueMember: false
                },
                {
                    className: 'MultiSelectInput',
                    key: 'CustomerCode',
                    lookupKey: 'Customer',
                    label: 'Đối tác',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%' AND Code IN (SELECT CustomerCode FROM dbo.B20SupplierInfo WHERE IsActive = 1 GROUP BY CustomerCode)",
                    hideValueMember: false
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
            dataChart: {
                tableIndex: 1,
                chartType: 'Pie',
                legendPosition: 'Right',
                valuePie: 'ColValue',
                namePie: 'ColName',
                chartPalette: 'cyborg',
                selection: {
                    primaryKey:'ColName0',
                    tableSelection: 0,
                    foreignKey: 'ItemGroupCode',
                    operation: '=',
                    chartType: 'Pie',
                    legendPosition: 'Right',
                    valuePie: 'Amount_DuTruKK',
                    namePie: 'CustomerName',
                    chartPalette: 'cyborg'
                }
                // chartType: 'Line',
                // bindingX: 'GroupName',
                // stacking: '0',//none, Stacked, Stacked 100%
                // rotated: false,
                // wjPropertyAxis: 'AxisX',
                // formatAxis: 'dd/MM/yyyy',
                // legendPosition: 'Bottom',//Left,Top,Right,Bottom
                // valuePie:'Amount',
                // namePie:'GroupName'
            },
            data: {
                grdReport: [
                    {
                        header: 'Nhóm hàng',
                        binding: 'ItemGroupCode',
                        width: 100
                    },
                    {
                        header: 'Mã đối tác',
                        binding: 'CustomerCode',
                        width: 100
                    },
                    {
                        header: 'Tên đối tác',
                        binding: 'CustomerName',
                        width: 300
                    },
                    {
                        header: 'Kế hoạch ký kết',
                        columns: [
                            {
                                header: 'Dự trù ký kết',
                                binding: 'Amount_DuTruKK',
                                width: 150,
                                aggregate: 'Sum'
                            },
                            {
                                header: 'Dự trù thanh toán',
                                binding: 'Amount_DuTruTT',
                                width: 150,
                                aggregate: 'Sum'
                            }
                        ]
                    },
                    {
                        header: 'Dự trù BCTC',
                        binding: 'Amount_DuTruBCTC',
                        width: 150,
                        aggregate: 'Sum'
                    },                    
                    {
                        header: 'Giá trị thanh toán đã duyệt',
                        binding: 'Amount_Bill',
                        width: 150,
                        aggregate: 'Sum'
                    },
                    {
                        header: 'DỰ KIẾN THỰC HIỆN',
                        columns: [
                            {
                                header: 'Giá trị Đơn hàng',
                                binding: 'Amount_DKTH',
                                width: 180,
                                aggregate: 'Sum'
                            },
                            {
                                header: 'Kiểm tra Đơn hàng',
                                binding: 'Amount_KTDH',
                                width: 180,
                                aggregate: 'Sum'
                            },
                            {
                                header: 'Cộng Dự kiến thực hiện',
                                binding: 'Amount_DKTHSum',
                                width: 180,
                                aggregate: 'Sum'
                            },
                            {
                                header: 'Giá trị Nhập hàng',
                                binding: 'Amount_NH',
                                width: 180,
                                aggregate: 'Sum'
                            },
                            {
                                header: 'Kiểm tra Nhập hàng',
                                binding: 'Amount_KTNH',
                                width: 180,
                                aggregate: 'Sum'
                            },
                            {
                                header: 'Cộng Dự kiến Thanh toán',
                                binding: 'Amount_DKTT',
                                width: 180,
                                aggregate: 'Sum'
                            }
                        ]
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
                            label: "BÁO CÁO TỈ TRỌNG MUA HÀNG",
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