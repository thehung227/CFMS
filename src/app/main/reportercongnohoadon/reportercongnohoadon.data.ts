import { Validators } from "@angular/forms";

export class LayoutData {
    public Layout = [
        {
            key: 'congnohoadon',
            text: 'Báo cáo công nợ hóa đơn - mua hàng',
            command: 'usp_TMCtc_BaoCaoCongNoHoaDon',
            ctorArg: { 'Commandkey': 'congnohoadon', 'CurrencyCode0': 'VND', 'Ma_Dvcs': 'C01' },
            subTotals: { '0': 'ProductName,ItemGroupName' },
            nCollapseNodesOnCreate: { '0': 1 },
            parameters: [
                {
                    className: 'DateBoxInput',
                    key: 'DocDate1',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    label: 'Ngày hóa đơn Từ'
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
                    key: 'ItemCode',
                    lookupKey: 'Item',
                    label: 'Nhóm hàng',
                    lookupfilter: "IsActive=1 AND IsGroup=1 AND ClassCode3='TM'",
                    hideValueMember: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'CreatedBy',
                    lookupKey: 'UserList2',
                    label: 'Người lập',
                    lookupfilter: "IsActive=1 AND IsGroup=0 AND Ma_CbNv IN (SELECT EmployeeCode FROM B20ProductHumanPurchase WHERE PositionCode = 'CB-040' AND IsActive = 1 GROUP BY EmployeeCode)",
                    hideValueMember: false
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
                    className: 'LookupBoxInput',
                    key: 'InvoiceStatus',
                    lookupKey: 'Class',
                    label: 'Trạng thái',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='InvoiceStatus'",
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
            data: {
                grdReport: [
                    {
                        header: 'Nhóm hàng',
                        binding: 'ItemCode',
                        width: 150
                    },
                    {
                        header: 'Nhà cung cấp',
                        binding: 'CustomerName',
                        width: 300
                    },
                    {
                        header: 'Số hóa đơn',
                        binding: 'Code',
                        width: 100
                    },
                    {
                        header: 'Ngày hóa đơn',
                        binding: 'InvoiceDate',
                        width: 120,
                        dataType: 'Date',
                        format: 'dd/MM/yyyy'
                    },
                    {
                        header: 'Ngày đến hạn',
                        binding: 'DueDate',
                        width: 120,
                        dataType: 'Date',
                        format: 'dd/MM/yyyy'
                    },
                    {
                        header: 'Ngày thanh toán',
                        binding: 'PaymentDate',
                        width: 120,
                        dataType: 'Date',
                        format: 'dd/MM/yyyy'
                    },                    
                    {
                        header: 'Trễ/ Sớm',
                        binding: 'DayDelay',
                        width: 120,
                        dataType: 'Number',
                        format: 'N0'
                    },
                    {
                        header: 'Giá trị trước VAT',
                        binding: 'AmountBeforeTax',
                        width: 120
                    },
                    {
                        header: 'Giá trị sau VAT',
                        binding: 'AmountAfterTax',
                        width: 120
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
                            label: "BÁO CÁO CÔNG NỢ HÓA ĐƠN - MUA HÀNG",
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