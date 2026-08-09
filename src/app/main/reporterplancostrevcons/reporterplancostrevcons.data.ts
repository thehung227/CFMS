import { Global } from "../../shared/global";
import { Validators } from "@angular/forms";

export class LayoutData {
    public Layout = [
        {
            key: 'REP01_CCM_TCCT',
            text: 'Báo cáo tài chính',
            command: 'usp_Kct_BaoCaoTaiChinhCongTruong',
            ctorArg: { 'Commandkey': 'REP01_CCM_TCCT', 'Ma_Dvcs': 'C01', 'Account': '131,331', 'ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}'), 'nUserId': Global.convertConfig('{VAR=User.Id}') },
            outputjson: 0,
            totalGrid: 2,
            JsonColumnPos: {
                grdReport: 7
            },
            subTotals: { '1': 'Ten_Ct' },
            nCollapseNodesOnCreate: { '1': 0 },
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
                            label: "BÁO CÁO TÀI CHÍNH CÔNG TRƯỜNG",
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
                            label: "Số kế hoạch: {VAR=DocNo}",
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
                        header: 'Mã XD/ME',
                        binding: 'TypeMEXD',
                        width: 120,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Mã ưu tiên chi',
                        binding: 'CodeKHC',
                        width: 120,
                        isColumnOriginal: true
                    },
                     {
                        header: 'Mã Gói thầu',
                        binding: 'ItemGroupCode',
                        width: 120,
                        isColumnOriginal: true
                    },
                      {
                        header: 'Tên Gói thầu',
                        binding: 'BidName',
                        width: 120,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Mã công việc',
                        binding: 'JobCode',
                        width: 120,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Tên công việc',
                        binding: 'JobName',
                        width: 200,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Nội dung - Đối tượng',
                        binding: 'CustomerName',
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
                        header: 'Số hợp đồng',
                        binding: 'DocNo_BizDoc',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Theo dõi HĐ (đã ký bản cứng)',
                        binding: 'IsAtch',
                        width: 120
                    },
                    {
                        header: 'Giá trị HĐ/PLHĐ (Trước VAT)',
                        binding: 'Amount_BizDoc',
                        width: 150,
                        isColumnOriginal: true
                    },
                    // {
                    //     header: 'Dự trù BCTC = 1+2+3',
                    //     binding: 'OriginalAmountStr',
                    //     width: 150,
                    //     align: 'right'
                    // },
                    {
                        header: 'Dự trù CT & CCM (Trước VAT)',
                        binding: 'OriginalAmount1',
                        width: 150,
                        align: 'right'
                    },
                    // {
                    //     header: 'Giá trị bổ sung 1 (2)',
                    //     binding: 'OriginalAmount2',
                    //     width: 150,
                    //     align: 'right'
                    // },
                    // {
                    //     header: 'Giá trị bổ sung 2 (PKT) (3)',
                    //     binding: 'OriginalAmount3',
                    //     width: 150,
                    //     align: 'right'
                    // },
                    // {
                    //     header: 'GT CV đã xác nhận (Trước VAT) - Bill riêng',
                    //     binding: 'OriginalAmount_Spec',
                    //     width: 150,
                    //     isColumnOriginal: true,
                    //     align: 'right'
                    // },
                    {
                        header: 'GT công việc đã xác nhận (Trước VAT)',
                        binding: 'AmountD_TT',
                        width: 150,
                        isColumnOriginal: true,
                        align: 'right'
                    },
                    {
                        header: 'GT công việc đã xuất HĐ (Trước VAT)',
                        binding: 'Amount_KT',
                        width: 150,
                        isColumnOriginal: true,
                        align: 'right'
                    },
                    {
                        header: 'GT đã thực hiện, chưa xuất HĐ (Trước VAT)',
                        binding: 'OpenPlanAmount',
                        width: 150,
                        isColumnOriginal: true,
                        align: 'right'
                    },
                    {
                        header: 'Dự trù chi phí còn lại (trước VAT)',
                        binding: 'AmountCl_KT',
                        width: 150,
                        isColumnOriginal: true,
                        align: 'right'
                    },
                   
                    {
                        header: 'Giá trị công việc Quyết toán đã duyệt (Trước VAT)',
                        binding: 'AmountQT',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Giá trị công việc Quyết toán đang trình (Trước VAT)',
                        binding: 'AmountQTDangTrinh',
                        width: 150,
                        isColumnOriginal: true
                    },
                     {
                        header: 'Giá trị đã chi',
                        binding: 'Amount_UNC',
                         width: 150,
                         isColumnOriginal: true
                     },
                    // {
                    //     header: 'Ghi chú',
                    //     binding: 'Ghi_Chu_TT',
                    //     width: 100,
                    //     isColumnOriginal: true
                    // },
                    // {
                    //     header: 'Kế toán kiểm tra lợi nhuận công trường',
                    //     binding: 'AmountLNCT_KT',
                    //     width: 150,
                    //     isColumnOriginal: true
                    // },
                    // {
                    //     header: 'Kế toán kiểm tra lợi nhuận kế toán',
                    //     binding: 'AmountLNKT_KT',
                    //     width: 150,
                    //     isColumnOriginal: true
                    // },
                    // {
                    //     header: 'Đến 30/09/2018',
                    //     binding: 'Amount_KT20190930',
                    //     width: 150,
                    //     isColumnOriginal: true
                    // },
                   
                    {
                        header: 'Khối lượng tháng',
                        binding: 'MonthlyVolume',
                        width: 200,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Theo dõi hồ sơ quyết toán (Đã ký bản cứng)',
                        binding: 'Ghi_Chu_KT',
                        width: 100,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Ghi chú',
                        binding: 'Remark',
                        width: 200,
                        isColumnOriginal: true
                    }
                ],
                grdReport1 :[
                    {
                        header: 'Mã đối tượng',
                        binding: 'CustomerCode',
                        width: 100
                    },
                    {
                        header: 'Tên đối tượng',
                        binding: 'Person',
                        width: 300
                    },
                    {
                        header: 'Số hợp đồng',
                        binding: 'DocNo_HD',
                        width: 120
                    },
                  
                    {
                        header: 'Nội dung',
                        binding: 'Description',
                        width: 400
                    },
                    {
                        header: 'Giá trị ĐNTT',
                        binding: 'Amount_DeNghiTT',
                        width: 150
                    },
                    {
                        header: 'Gửi duyệt',
                        binding: 'ApproveSend',
                        width: 100,
                        dataType: 'Boolean'
                    },
                    {
                        header: 'Hoàn thành duyệt',
                        binding: 'CompletedApprove',
                        width: 100,
                        dataType: 'Boolean'
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
                            name: 'Amount_DuTru_TheoHD',
                            style: {
                                backgroundColor: 'rgb(255,255,224)'
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
                },
                grdReport1 : { 
                    rows : [
                    ],
                    columns: [
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
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    isContentHtml: false,
                    validators: [Validators.required]
                },
                {
                    className: 'LookupBoxInput',
                    key: 'CCMBudgetId',
                    lookupKey: 'CCMBudget',
                    label: 'Kế hoạch DTCP',
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
            ],
            // summary: {
            //     cols:2,
            //     row: {
            //         0: [
            //             {
            //                 label: "TRƯỞNG PHÒNG CCM                                                                                                                                                 KẾ TOÁN TRƯỞNG",
            //                 style: "color: green;text-align: center",
            //                 styleobject: {"color": "green","text-align": "center"},
            //                 colspan:12,
            //                 col: 1
            //             }
            //         ]
            //     }
            // },
            // formatGroup: {
            //     grdReport : [
            //         {
            //             level: -1,
            //             style: { fontWeight: '' }
            //         },
            //         {
            //             level: 0,
            //             style: {color: 'red', fontWeight:'bold'}
            //         },
            //         {
            //             level: 1,
            //             style: {color: 'green', fontWeight:'bold'}
            //         }
            //     ]
            // },
        }
    ]
}