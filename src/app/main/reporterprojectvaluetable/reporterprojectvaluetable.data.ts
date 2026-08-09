import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";
import { format } from "url";

export class LayoutData {
    public Layout = [
        {
            key: 'REP03_ProjectValueTable',
            text: 'Bảng ước tính giá trị thực hiện dự án',
            command: 'usp_Kct_GiaTriTonKhoUocTinhTaiThoiDiem_Report',
            ctorArg: { 'Commandkey': 'REP03_ProjectValueTable', 'ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}')},
            nCollapseNodesOnCreate: { '0': 1 },
            subTotals: {},
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
                    validators: [Validators.required]

                },
                
            ],
            data: {
                grdReport: [
                    {
                        header: 'Stt',
                        binding: 'ItemNo',
                        width: 80,
                        align: 'center',
                        isColumnOriginal: true
                    },
                
                  
                    {
                        header: 'Nội dung',
                        binding: 'Description',
                        width: 300,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Nhóm công tác',
                        binding: 'JobGroupCode',
                        width: 80,
                        align: 'center',
                        isColumnOriginal: true
                    },
                    {
                        header: 'Dự trù BCTC',
                        binding: 'Amount1',
                        dataType: 'Number',
                        width: 150,
                        aggregate: 'Sum'
                    },
                    {
                        header: '% thi công',
                        binding: 'Rate1',
                        dataType: 'Number',
                        format: 'p2',
                        width: 150,
                    },
                   {
                        header: 'Giá trị đặt hàng/Thi công',
                        binding: 'Amount2',
                        dataType: 'Number',
                        width: 150,
                        aggregate: 'Sum'
                    }, 
                    {
                        header: 'Giá trị đã lên bill',
                        binding: 'Amount3',
                        dataType: 'Number',
                        width: 150,
                        aggregate: 'Sum'
                    }, 
                    {
                        header: 'Giá trị hóa đơn',
                        binding: 'Amount4',
                        dataType: 'Number',
                        width: 150,
                        aggregate: 'Sum'
                    }, 
                    {
                        header: 'Giá trị thực hiện dự trù',
                        binding: 'Amount5',
                        dataType: 'Number',
                        width: 150,
                        aggregate: 'Sum'
                    }, 
                    {
                        header: 'Nhóm công tác',
                        binding: '_FormatStyleWeb',
                        width: 0,
                        align: 'center',
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
                            label: "BẢNG ƯỚC TÍNH GIÁ TRỊ THỰC HIỆN DỰ ÁN",
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