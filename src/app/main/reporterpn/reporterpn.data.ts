import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP03_ReporterPn',
            text: 'Báo cáo nhập kho',
            command: 'usp_CCM_AccDocEquip_TongHopNhapKho',
            ctorArg: { 'Commandkey': 'REP03_ReporterPn','ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}') },
            subTotals: { '0': 'DocDate,CustomerName' },
            nCollapseNodesOnCreate: { '0': 3 },
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
                    key: 'ItemGroupCode',
                    lookupKey: 'Item',
                    label: 'Nhóm hàng',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ParentId IN (3205)",
                    hideValueMember: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'ProductCostId',
                    lookupKey: 'ProductCost',
                    label: 'Gói thầu',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: false,
                    // validators: [Validators.required]
                }
            ],
            data: {
                grdReport: [
                
                    {
                        header: 'Mã vật tư',
                        binding: 'ItemCode',
                        width: 150
                    },
                    {
                        header: 'Ngày nhập kho',
                        binding: 'ReceiptDate',
                        type: 'date',
                        format: 'dd/MM/yyyy',
                        width: 100
                    },
                    {
                        header: 'Tên vật tư',
                        binding: 'ItemName',
                        width: 300,
                        
                    },
                    {
                        header: 'Thương hiệu',
                        binding: 'TradeMark',
                        width: 150
                    },
                    {
                        header: 'Đvt',
                        binding: 'Unit',
                        width: 60
                    },
                    {
                        header: 'Số lượng',
                        binding: 'Quantity9',
                        width: 100,
                        aggregate: 'Sum'
                    },
                    {
                        header: 'Đơn giá',
                        binding: 'UnitCost',
                        width: 150
                    },
                    {
                        header: 'Thành tiền',
                        binding: 'Amount',
                        width: 150,
                        aggregate: 'Sum'
                    },                  
                    {
                        header: 'DocDate',
                        binding: 'Ngày nhập kho',
                        width: 0
                    },
                    {
                        header: 'NCC',
                        binding: 'CustomerName',
                        width: 150
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
                            label: "BÁO CÁO NHẬP KHO",
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