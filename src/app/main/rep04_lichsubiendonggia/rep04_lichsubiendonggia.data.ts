import { Validators } from "@angular/forms";

export class LayoutData {
    public Layout = [
        {
            key: 'REP04_LichSuBienDongGia',
            text: 'Lịch sử biến động giá vật tư',
            command: 'usp_TMCtc_REP_LichSuBienDongGiaVatTu',
            ctorArg: { 'Commandkey': 'REP04_LichSuBienDongGia', 'BranchCode': 'C01' },
            outputjson: 0,
            JsonColumnPos: {
                grdReport: 2
            },
            dataChart: {
                tableIndex: 0,
                chartType: 'Line',
                bindingX: 'DocDate',
                wjPropertyAxis: 'AxisX',
                formatAxis: 'dd/MM/yyyy'
            },
            // frozen: {
            //     grdReport: {columns: 2, rows: 1}
            // },
            styles: {
                grdReport : {
                    rows : [
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
                    key: 'ItemCode',
                    lookupKey: 'Item',
                    label: 'Nhóm hàng',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ClassCode3='TM'",
                    hideValueMember: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'TradeMarkCode',
                    lookupKey: 'TradeMark',
                    label: 'Thương hiệu',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
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
                        header: 'Thời gian',
                        binding: 'DocDate',
                        width: 100,
                        isColumnOriginal: true
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
                            label: "LỊCH SỬ BIẾN ĐỘNG GIÁ VẬT TƯ",
                            style: "text-align: center;",
                            styleobject: { "text-align": "center", "color": "blue", "font-size": "14pt" },
                            colspan: 12,
                            height: 50,
                            col: 1
                        }
                    ]
                }
            },
            // formatGroup: {
            //     grdReport: [
            //         {
            //             level: -1,
            //             style: { fontWeight: '' }
            //         },
            //         {
            //             level: 0,
            //             style: { fontWeight: 'bold' }
            //         }
            //     ]
            // }
        }
    ]
}