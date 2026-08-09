import { Validators } from "@angular/forms";

export class LayoutData {
    public Layout = [
        {
            key: 'REP01_KHMH',
            text: 'Báo cáo tình trạng hao hụt vật tư',
            command: 'usp_B30Budget_Report',
            ctorArg: { 'Commandkey': 'REP01_KHMH'},
            nCollapseNodesOnCreate: { '0': 1 },
            subTotals: { '0': 'ProductCostInfo,TypeXDME' },
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
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType = 1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: false,

                },
               {
                    className: 'LookupBoxInput',
                    key: 'ItemGroupCode',
                    lookupKey: 'Item',
                    label: 'Nhóm hàng',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ParentId IN (3205) AND Code<>'BETONG'",
                    hideValueMember: false,

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
                        binding: 'ItemNo',
                        width: 80,
                        isColumnOriginal: true
                    },
                   
                    {
                        header: 'Mô tả',
                        binding: 'ItemName',
                        width: 300,
                        isColumnOriginal: true
                    },
                      {
                        header: 'Mã sản phẩm',
                        binding: 'ProductName',
                        dataType: 'String',
                        width: 150
                    },
                      {
                        header: 'Thương hiệu',
                        binding: 'TradeMarkCode',
                        dataType: 'String',
                        width: 150
                    },
                     {
                        header: 'Hạng mục sử dụng',
                        binding: 'CategoryName',
                        dataType: 'String',
                        width: 150
                    },
                    {
                        header: 'Đvt',
                        binding: 'Unit',
                        width: 80,
                        isColumnOriginal: true
                    },
                    
                   {
                    header: 'KL Kế hoạch',
                    columns: [
                    {
                        header: 'KL BoQ',
                        binding: 'QuantityBOQ',
                        dataType: 'Number',
                        width: 150,
                         format: 'n2',
                    },
                    {
                        header: 'KL HĐ NCC',
                        binding: 'QuantityNCC',
                        dataType: 'Number',
                        width: 150,
                         format: 'n2',
                    },
                    {
                        header: 'KL HĐ NTP',
                        binding: 'QuantityNTP',
                        dataType: 'Number',
                        width: 150,
                         format: 'n2',
                    },
                     {
                        header: 'KL IPC',
                        binding: 'QuantityIPC',
                        dataType: 'Number',
                        width: 150,
                         format: 'n2',
                    },
                    {
                        header: 'KL BCH (Tính Toán)',
                        binding: 'Quantity',
                        dataType: 'Number',
                        width: 150,
                         format: 'n2',
                    },
                  
                ]
                },
                {
                    header: 'Thực tế',
                    columns: [
                        {
                            header: 'KL sử dụng vật tư theo tiến độ thi công',
                            columns: [
                                 {
                                    header: 'Đánh giá % KL đến kỳ này',
                                    binding: 'TaxRate',
                                    dataType: 'Number',
                                    width: 150,
                                    format: 'p2',
                                },
                                 {
                                    header: 'KL đánh giá đến kỳ này',
                                    binding: 'Amount3',
                                    dataType: 'Number',
                                    width: 150,
                                    format: 'n2',
                                },
                            ]
                        },
                        {
                        header: 'KL đã đặt hàng (NCC)',
                        binding: 'QuantityAccum',
                        dataType: 'Number',
                        width: 150,
                         format: 'n2',
                    },
                   
                   
                    
                     {
                        header: 'KL đã nhận hàng (NCC)',
                        binding: 'ImQuantity',
                        dataType: 'Number',
                        width: 150,
                         format: 'n2',
                    },
                    {
                        header: 'KL đã cấp phát/Sử dụng (NTP)',
                        binding: 'ExQuantity',
                        dataType: 'Number',
                        width: 150,
                         format: 'n2',
                    },
                    {
                        header: 'Tồn kho',
                        binding: 'CloseQuantity',
                        dataType: 'Number',
                        width: 150,
                         format: 'n2',
                    },
                  
                ]
                },
                 {
                    header: 'Hao hụt',
                    columns: [
                    {
                        header: 'KL Hao hụt',
                        binding: 'ConcerlossQuantity',
                        dataType: 'Number',
                        width: 150,
                         format: 'n2',
                    },
                    {
                        header: '% hao hụt',
                        binding: 'ConcerlossRate',
                        dataType: 'Number',
                        width: 150,
                         format: 'p2',
                    },
                   
                  
                ]
                },
                   {
                        header: 'Ghi chú',
                        binding: 'Remark',
                        width: 300,
                        isColumnOriginal: true
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
                            label: "BÁO CÁO TÌNH TRẠNG HAO HỤT VẬT TƯ",
                            style: "text-align: center;",
                            styleobject: { "text-align": "center", "color": "blue", "font-size": "14pt" },
                            colspan: 12,
                            height: 50,
                            col: 1
                        }
                    ],
                   
                }
            }
        }
    ]
}