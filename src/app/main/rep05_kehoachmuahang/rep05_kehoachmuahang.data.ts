import { Validators } from "@angular/forms";

export class LayoutData {
    public Layout = [
        {
            key: 'REP01_KHMH',
            text: 'Báo cáo kế hoạch mua hàng',
            command: 'usp_B30Budget_GetData_Dynamic',
            ctorArg: { 'Commandkey': 'REP01_KHMH', 'BudgetTypeCode': '6', 'CurrencyCode0': 'VND', 'BranchCode': 'N01' },
            nCollapseNodesOnCreate: { '0': 1 },
            subTotals: { '0': 'ProductCostInfo,ItemGroupCode' },
            bAllowGrandTotal: [0],
            // outputjson: 0,
            // JsonColumnPos: {
            //     grdReport: 3 //thứ tự xuất hiện cột động tính từ Col 0
            // },
            styles: {
                grdReport: {
                    rows: [
                        // {
                        //     expr: "'{EXPR=ItemNo}' == '21'",
                        //     style: {
                        //         color: 'green'
                        //     } 
                        // }
                    ],
                    columns: [
                        // {
                        //     name: 'OriginalAmount',
                        //     style: {
                        //         backgroundColor: 'rgb(192, 255, 192)'
                        //     }
                        // }
                    ]
                }
            },
            parameters: [
              
                {
                    className: 'LookupBoxInput',
                    key: 'ProductCostId',
                    lookupKey: 'ProductCost',
                    label: 'Gói thầu',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType = 1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: false,

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
                    className: 'LookupBoxInput',
                    key: 'ItemGroupCode',
                    lookupKey: 'Item',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ParentId IN (3205) AND Code<>'BETONG'",
                    label: 'Nhóm hàng'
                },
                {
                    className: 'LookupBoxInput',
                    key: 'TypeXDME',
                    lookupKey: 'Class',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='INCURRED' AND Code IN ('XD','ME')",
                    label: 'Loại XD/ME',
                    validators: [Validators.required]
                }
            ],
            data: {
                grdReport: [
                    {
                        header: 'Stt',
                        binding: '_Stt',
                        width: 80,
                        align: 'center',
                        isColumnOriginal: true
                    },
                    {
                        header: 'Thời gian',
                        binding: 'FromDate',
                        width: 120,
                        align: 'right',
                        format: 'dd/MM/yyyy',
                        isColumnOriginal: true
                    },
                    {
                        header: 'Nhóm hàng',
                        binding: 'ItemGroupCode',
                        width: 120,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Mã hàng',
                        binding: 'ItemCode',
                        width: 120,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Tên hàng',
                        binding: 'ItemName',
                        width: 300,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Đvt',
                        binding: 'Unit',
                        width: 80,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Danh mục vật tư',
                        binding: 'TradeMarkList',
                        width: 300,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Hạng mục sử dụng',
                        binding: 'CategoryName',
                        dataType: 'String',
                        width: 150
                    },
                    {
                        header: 'Khối lượng BoQ',
                        binding: 'QuantityBOQ',
                        dataType: 'Number',
                        width: 150,
                         format: 'n2',
                        aggregate: 'Sum'
                    },
                    {
                        header: 'Đơn giá BĐ',
                        binding: 'UnitCostBD',
                        dataType: 'Number',
                        width: 120
                    },
                    {
                        header: 'Thành tiền BĐ',
                        binding: 'OriginalAmountBD',
                        dataType: 'Number',
                        width: 150,
                        aggregate: 'Sum'
                    },
                    {
                        header: 'Mã sản phẩm được duyệt',
                        binding: 'ProductName',
                        dataType: 'String',
                        width: 150
                    },
                    {
                        header: 'Thương hiệu được duyệt',
                        binding: 'TradeMarkCode',
                        width: 300,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Tên xuất xứ',
                        binding: 'TenXuatXu',
                        dataType: 'String',
                        width: 120,
                        isReadOnly: 'true'
                    },
                    {
                        header: 'Khối lượng kế hoạch (Tính toán)',
                        binding: 'Quantity',
                        dataType: 'Number',
                        width: 150,
                         format: 'n2',
                        aggregate: 'Sum'
                    },
                    {
                        header: 'Đơn giá NCC',
                        binding: 'OriginalPrice',
                        dataType: 'Number',
                        width: 120
                    },
                    {
                        header: 'Thành tiền NCC',
                        binding: 'OriginalAmount',
                        dataType: 'Number',
                        width: 150,
                        aggregate: 'Sum'
                    },
                    {
                        header: 'Khối lượng lũy kế (đơn hàng đã đặt)',
                        binding: 'QuantityAccum',
                        dataType: 'Number',
                        width: 150,
                        isReadOnly: 'true',
                        aggregate: 'Sum'
                    },
                    {
                        header: 'Thành tiền lũy kế (Đơn hàng đã đặt)',
                        binding: 'AmountPO',
                        dataType: 'Number',
                        width: 150,
                        aggregate: 'Sum'
                    },
                    {
                        header: 'Tên dự án',
                        binding: 'ProductCostInfo',
                        width: 300,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Loại XD/ME',
                        binding: 'TypeXDME',
                        width: 100,
                        isColumnOriginal: true
                    },
                    {
                       
                      
                        width:100,
                     
                        header: 'Code Tháng',
                        binding: 'CodeThang',
                        
                    
                      
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
                            label: "BÁO CÁO KẾ HOẠCH MUA HÀNG",
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
                    ]
                }
            }
        }
    ]
}