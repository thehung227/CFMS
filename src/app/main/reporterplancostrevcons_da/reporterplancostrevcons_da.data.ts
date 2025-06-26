import { Global } from "../../shared/global";
import { Validators } from "@angular/forms";

export class LayoutData {
    public Layout = [
        {
            key: 'REP01_CCM_TCCT3',
            text: 'Báo cáo tài chính - dự án',
            command: 'usp_Kct_BaoCaoTaiChinhCongTruong_DuAn',
            ctorArg: { 'Commandkey': 'REP01_CCM_TCCT3', 'Ma_Dvcs': 'C01', 'Account': '131,331', 'ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}')},
            outputjson: 0,
            JsonColumnPos: {
                grdReport: 4
            },
            title: {
                cols:2,
                row: {
                    0: [
                        {
                            label: "",
                            style: "color: green;text-align: center",
                            styleobject: {"color": "blue","text-align": "left"},
                            colspan:12,
                            col: 1
                        }
                    ],
                    1: [
                        {
                            label: "DỰ TOÁN CHI PHÍ - DỰ ÁN",
                            style: "text-align: center;",
                            styleobject: {"text-align": "center","color": "blue","font-size":"14pt"},
                            colspan:12,
                            height:50,
                            col: 1
                        }
                    ],
                    2: [
                        {
                            label: "Dự án: {VAR=ProductName}",
                            style: "text-align: center",
                            styleobject: {"text-align": "center","color": "blue"},
                            col: 1,
                            colspan: 12
                        }
                    ],                
                    3: [
                        {
                            label: "Từ ngày: {VAR=FromDateStr} Đến ngày: {VAR=ToDateStr}",
                            style: "text-align: center",
                            styleobject: {"text-align": "center","color": "blue"},
                            col: 1,
                            colspan: 12
                        }
                    ]
                }
            },
            data: {
                grdReport: [
                    {
                        header: 'Stt',
                        binding: 'ItemNo',
                        width: 80,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Nội dung',
                        binding: 'JobName',
                        width: 200,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Mã đối tượng',
                        binding: 'CustomerCode',
                        width: 100,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Tên đối tượng',
                        binding: 'CustomerName',
                        width: 200,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Số hợp đồng',
                        binding: 'DocNo_BizDoc',
                        width: 100,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Giá trị HĐ + PLHĐ (chưa VAT)',
                        binding: 'Amount_BizDoc',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Giá trị đã thực hiện (chưa VAT)',
                        binding: 'AmountD_TT',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Giá trị thanh toán đã được duyệt (gồm VAT)',
                        binding: 'AmountTH_TT',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Giá trị quyết toán (chưa VAT)',
                        binding: 'AmountQT',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Giá trị đã chi (chưa VAT)',
                        binding: 'Amount_UNC',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Ghi chú',
                        binding: 'Ghi_Chu_TT',
                        width: 100,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Kế toán kiểm tra lợi nhuận công trường',
                        binding: 'AmountLNCT_KT',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Kế toán kiểm tra lợi nhuận kế toán',
                        binding: 'AmountLNKT_KT',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Số liệu kế toán cập nhật',
                        binding: 'Amount_KT',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Chênh lệch số liệu',
                        binding: 'AmountCl_KT',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Ghi chú',
                        binding: 'Ghi_Chu_KT',
                        width: 100,
                        isColumnOriginal: true
                    }
                ]
            },
            styles: {
                grdReport : {
                    rows : [
                        // {
                        //     expr: "'{EXPR=ItemNo}' == '21'",
                        //     style: {
                        //         color: 'green'
                        //     } 
                        // },
                        // {
                        //     expr: "{EXPR=IsTitleRow} == true",
                        //     style: {
                        //         backgroundColor: '#f8f1e6'
                        //     }
                        // }
                    ],
                    columns: [
                        {
                            name: 'OriginalAmount',
                            style: {
                                backgroundColor: 'rgb(192, 255, 192)'
                            }
                        },
                        {
                            name: 'AmountD_TT',
                            style: {
                                backgroundColor: 'MistyRose'
                            }
                        },
                        {
                            name: 'AmountTH_TT',
                            style: {
                                backgroundColor: 'MistyRose'
                            }
                        },
                        {
                            name: 'AmountQT',
                            style: {
                                backgroundColor: 'MistyRose'
                            }
                        },
                        {
                            name: 'Amount_UNC',
                            style: {
                                backgroundColor: 'MistyRose'
                            }
                        }
                        
                    ]
                }            
            },
            parameters: [
                {
                    className: 'LookupBoxInput',
                    key: 'ProductCostId',
                    lookupKey: 'ProductCost',
                    label: 'Gói thầu',
                    lookupfilter: "DeptCode='' AND IsGroup=1 AND IsActive=1 AND ProductType='0' AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    isContentHtml: false,
                    validators: [Validators.required]
                },
                {
                    className: 'MultiSelectInput',
                    key: 'CCMBudgetId',
                    lookupKey: 'CCMBudget',
                    label: 'Version kế hoạch',
                    lookupfilter: "IsActive=1 AND DocCode='K2' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ProductCostId IN (SELECT RowId FROM B20Product WHERE ParentId = (SELECT Id FROM dbo.B20Product WHERE RowId = '{EXPR=ProductCostId}'))",
                    hideValueMember: false,
                    validators: [Validators.required]
                },
                // {
                //     className: 'TextBoxInput',
                //     key: 'Account',
                //     label: 'Tài khoản',
                // },
                {
                    className: 'LookupBoxInput',
                    key: 'Ma_Dvcs',
                    lookupKey: 'Branch',
                    lookupfilter: "Ma_Dvcs ='{VAR=Branch.Ma_Dvcs}'",
                    label: 'Đơn vị',
                    validators: [Validators.required]
                }
            ]
        }
    ]
}