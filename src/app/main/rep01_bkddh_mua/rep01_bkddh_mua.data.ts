import { Validators } from "@angular/forms";

export class LayoutData {
    public Layout = [
        {
            key: 'REP01_BKDDH_MUA',
            text: 'Báo cáo tổng hợp đơn hàng',
            command: 'usp_TMCtc_BangKeDonDatHang',
            ctorArg: { 'Commandkey': 'REP01_BKDDH_MUA', 'DocGroup': '1', 'CurrencyCode0': 'VND', 'Ma_Dvcs': 'N01' },
            subTotals: { '0': 'ProductName,ItemGroupCode,DocNo' },
            nCollapseNodesOnCreate: { '0': 2 },
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
                    key: 'CustomerCode',
                    lookupKey: 'Customer',
                    label: 'Đối tượng',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%' AND Code IN (SELECT CustomerCode FROM dbo.B20SupplierInfo WHERE IsActive = 1 GROUP BY CustomerCode)",
                    hideValueMember: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'ItemGroupCode',
                    lookupKey: 'Item',
                    label: 'Nhóm hàng',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ParentId IN (3205) AND Code NOT IN ('BETONG')",
                    hideValueMember: false
                },
               
                {
                    className: 'LookupBoxInput',
                    key: 'ProductCostId',
                    lookupKey: 'ProductCost',
                    label: 'Gói thầu',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType = 1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: false
                }, 
                {
                    className: 'CheckBoxInput',
                    key: 'IsGiftItem',
                 
                    label: 'Lấy gói giữ giá',
                    
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
                        header: 'Dự án',
                        binding: 'ProductName',
                        width: 200
                    },
                 
                    {
                        header: 'Số đơn hàng',
                        binding: 'DocNo',
                        width: 150
                    },
                
                    {
                        header: 'Nhà cung cấp',
                        binding: 'CustomerName',
                        width: 300
                    },
                    {
                        header: 'Loại đơn hàng',
                        binding: 'ItemGroupCode',
                        width: 100
                    },
                  
                    {
                        header: 'Mặt hàng',
                        binding: 'Description',
                        width: 200
                    },
               
                    {
                        header: 'Đvt',
                        binding: 'Unit',
                        width: 70
                    },
                    {
                        header: 'Thương hiệu',
                        binding: 'TradeMarkCode',
                        width: 150
                    },
                    {
                        header: 'Ngày dự kiến giao',
                        binding: 'EstimatedtimeDelivery',
                        width: 100,
                        dataType: 'Date',
                        format: 'dd/MM/yyyy'
                    },
                    {
                        header: 'Số lượng',
                        binding: 'Quantity9',
                        width: 120,
                        dataType: 'Number',
                        aggregate: 'Sum',
                        format: 'N2'
                    },
                    {
                        header: 'SL quy đổi',
                        binding: 'Quantity',
                        width: 120,
                        dataType: 'Number',
                        aggregate: 'Sum',
                        format: 'N2'
                    },
                    {
                        header: 'Đơn giá',
                        binding: 'OriginalUnitCost',
                        width: 120,
                        dataType: 'Number',
                        format: 'N2'
                    },
                    {
                        header: 'Thành tiền',
                        binding: 'OriginalAmount',
                        width: 120,
                        dataType: 'Number',
                        aggregate: 'Sum'
                    },
                    {
                        header: 'Thuế',
                        binding: 'TaxRate',
                        width: 120,
                        dataType: 'Number',
                        format: 'P0'
                    },
                    {
                        header: 'Thành tiền sau thuế',
                        binding: 'OriginalAmount9',
                        width: 120,
                        dataType: 'Number',
                        aggregate: 'Sum'
                    },
                     {
                        header: 'Loại đơn hàng',
                        binding: 'StatusPO',
                        width: 200
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
                            label: "BÁO CÁO MUA HÀNG CÔNG TRƯỜNG",
                            style: "text-align: center;",
                            styleobject: { "text-align": "center", "color": "blue", "font-size": "14pt" },
                            colspan: 12,
                            height: 50,
                            col: 1
                        }
                    ],
                    2: [
                        {
                            label: "Từ ngày: {VAR=FromDateStr} Đến ngày: {VAR=ToDateStr}",
                            style: "text-align: center",
                            styleobject: { "text-align": "center", "color": "blue" },
                            col: 1,
                            colspan: 12
                        }
                    ],
                    3: [
                        {
                            label: "Đối tượng: {VAR=CustomerName}",
                            style: "text-align: center",
                            styleobject: { "text-align": "center", "color": "blue" },
                            col: 1,
                            colspan: 12
                        }
                    ],
                    4: [
                        {
                            label: "Mặt hàng: {VAR=ItemName}",
                            style: "text-align: center",
                            styleobject: { "text-align": "center", "color": "blue" },
                            col: 1,
                            colspan: 12
                        }
                    ],
                    5: [
                        {
                            label: "Người lập đơn: {VAR=UserName}",
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