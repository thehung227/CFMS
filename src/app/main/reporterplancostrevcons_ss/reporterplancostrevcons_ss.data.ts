import { Global } from "../../shared/global";
import { Validators } from "@angular/forms";

export class LayoutData {
    public Layout = [
        {
            key: 'REP01_CCM_TCCT2',
            text: 'Báo cáo tài chính - so sánh',
            command: 'usp_Kct_BaoCaoTaiChinhCongTruong_SoSanh',
            ctorArg: { 'Commandkey': 'REP01_CCM_TCCT2', 'Ma_Dvcs': 'N01', 'Account': '131,331', 'ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}')},
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
                            label: "DỰ TOÁN CHI PHÍ - SO SÁNH",
                            style: "text-align: center;",
                            styleobject: {"text-align": "center","color": "blue","font-size":"14pt"},
                            colspan:12,
                            height:50,
                            col: 1
                        }
                    ],
                    2: [
                        {
                            label: "Gói thầu: {VAR=ProductName}",
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
                    ],
                    4: [
                        {
                            label: "Số kế hoạch trước: {VAR=DocNo_VerT}  - Số kế hoạch sau: {VAR=DocNo_VerS}",
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
                        width: 80
                    },
                    {
                        header: 'Nội dung',
                        binding: 'JobName',
                        width: 200
                    },
                    {
                        header: 'Mã đối tượng',
                        binding: 'CustomerCode',
                        width: 100
                    },
                    {
                        header: 'Tên đối tượng',
                        binding: 'CustomerName',
                        width: 200
                    },
                    {
                        header: 'Giá trị trước',
                        binding: 'OriginalAmount',
                        width: 150
                    },
                    {
                        header: 'Giá trị sau',
                        binding: 'OriginalAmount1',
                        width: 150
                    },
                    {
                        header: 'Tăng/ giảm',
                        binding: 'Amount_ChenhLech',
                        width: 150
                    },
                    {
                        header: 'Số hợp đồng',
                        binding: 'DocNo_BizDoc',
                        width: 100
                    },
                    {
                        header: 'Giá trị HĐ + PLHĐ (chưa VAT)',
                        binding: 'Amount_BizDoc',
                        width: 150
                    },
                    {
                        header: 'Giá trị công việc đã xác nhận (trước VAT VAT)',
                        binding: 'AmountD_TT',
                        width: 150
                    },
                    {
                        header: 'Giá trị thanh toán đã được duyệt (gồm VAT)',
                        binding: 'AmountTH_TT',
                        width: 150
                    },
                    {
                        header: 'Giá trị quyết toán đã duyệt (chưa VAT)',
                        binding: 'AmountQT',
                        width: 150
                    },
                    {
                        header: 'Giá trị quyết toán đang trình (chưa VAT)',
                        binding: 'AmountQTDangTrinh',
                        width: 150
                    },
                    {
                        header: 'Giá trị đã chi (chưa VAT)',
                        binding: 'Amount_UNC',
                        width: 150
                    },
                    {
                        header: 'Ghi chú',
                        binding: 'Ghi_Chu_TT',
                        width: 100
                    },
                    // {
                    //     header: 'Kế toán kiểm tra lợi nhuận công trường',
                    //     binding: 'AmountLNCT_KT',
                    //     width: 150
                    // },
                    // {
                    //     header: 'Kế toán kiểm tra lợi nhuận kế toán',
                    //     binding: 'AmountLNKT_KT',
                    //     width: 150
                    // },
                    {
                        header: 'GT công việc đã xuất HĐ (Trước VAT)',
                        binding: 'Amount_KT',
                        width: 150
                    },
                    {
                        header: 'Chênh lệch số liệu',
                        binding: 'AmountCl_KT',
                        width: 150
                    },
                    {
                        header: 'Ghi chú',
                        binding: 'Ghi_Chu_KT',
                        width: 100
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
                            },
                            noStyle: {
                                backgroundColor: ''
                            }
                        },
                        {
                            name: 'OriginalAmount1',
                            style: {
                                backgroundColor: 'rgb(255, 255, 128)'
                            },
                            noStyle: {
                                backgroundColor: ''
                            }
                        },
                        {
                            name: 'AmountD_TT',
                            style: {
                                backgroundColor: 'MistyRose'
                            },
                            noStyle: {
                                backgroundColor: ''
                            }
                        },
                        {
                            name: 'AmountTH_TT',
                            style: {
                                backgroundColor: 'MistyRose'
                            },
                            noStyle: {
                                backgroundColor: ''
                            }
                        },
                        {
                            name: 'AmountQT',
                            style: {
                                backgroundColor: 'MistyRose'
                            },
                            noStyle: {
                                backgroundColor: ''
                            }
                        },
                        {
                            name: 'Amount_UNC',
                            style: {
                                backgroundColor: 'MistyRose'
                            },
                            noStyle: {
                                backgroundColor: ''
                            }
                        }
                        
                    ]
                }            
            },
            parameters: [
                // {
                //     className: 'DateBoxInput',
                //     key: 'DocDate1',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     label: 'Từ ngày'
                // },
                // {
                //     className: 'DateBoxInput',
                //     key: 'DocDate2',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     label: 'Đến ngày'
                // },
                {
                    className: 'LookupBoxInput',
                    key: 'ProductCostId',
                    lookupKey: 'ProductCost',
                    label: 'Gói thầu',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    isContentHtml: false,
                    validators: [Validators.required]
                },
                {
                    className: 'LookupBoxInput',
                    key: 'CCMBudgetId',
                    lookupKey: 'CCMBudget',
                    label: 'Version trước',
                    lookupfilter: "ProductCostId = '{EXPR=ProductCostId}' AND IsGroup=0 AND IsActive=1 AND DocCode='K2' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                    isContentHtml: false,
                    validators: [Validators.required]
                },
                {
                    className: 'LookupBoxInput',
                    key: 'CCMBudgetId1',
                    lookupKey: 'CCMBudget',
                    label: 'Version sau',
                    lookupfilter: "ProductCostId = '{EXPR=ProductCostId}' AND IsGroup=0 AND IsActive=1 AND DocCode='K2' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                    isContentHtml: false,
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