import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP01_KHMHVTPHU',
            text: 'Báo cáo kế hoạch mua hàng vật tư phụ',
            command: 'usp_B30Budget_ReportVTPHU',
            ctorArg: { 'Commandkey': 'REP01_KHMHVTPHU', 'ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}')},
            nCollapseNodesOnCreate: { '0': 1 },
            subTotals: { '0': 'ProductName' },
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
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType = 1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: false,

                },
                
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
                        header: 'Nhóm hàng',
                        binding: 'ItemGroupCode',
                        width: 120,
                        isColumnOriginal: true
                    },
                  
                    {
                        header: 'Tên nhóm hàng',
                        binding: 'ItemGroupName',
                        width: 300,
                        isColumnOriginal: true
                    },
                   
                    {
                        header: 'Chi phí dự trù (trước VAT)',
                        binding: 'OriginalAmount',
                        dataType: 'Number',
                        width: 150,
                        aggregate: 'Sum'
                    },
                    
                    {
                        header: 'Chi phí đã đặt hàng (Trước VAT)',
                        binding: 'AmountPO',
                        dataType: 'Number',
                        width: 150,
                        aggregate: 'Sum'
                    },
                    {
                        header: 'Chi phí còn lại (Trước VAT)',
                        binding: 'DiffAmount',
                        dataType: 'Number',
                        width: 150,
                        aggregate: 'Sum'
                    },
                    
                    {
                        header: 'Tên dự án',
                        binding: 'ProductName',
                        width: 300,
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
                            label: "BÁO CÁO KẾ HOẠCH MUA HÀNG VẬT TƯ PHỤ",
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