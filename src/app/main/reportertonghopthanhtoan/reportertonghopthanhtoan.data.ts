import { Global } from "../../shared/global";
import { Validators } from "@angular/forms";

export class LayoutData {
    public Layout = [
        {
            key: 'REP04_THDXTT',
            text: 'Báo cáo tài chính',
            command: 'usp_Newtecons_TongHopThanhToan',
            ctorArg: { 'Commandkey': 'REP04_THDXTT' },
            // outputjson: 0,
            totalGrid: 2,
            JsonColumnPos: {
                // grdReport: 7
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
                        header: 'STT',
                        binding: 'BuiltinOrder',
                        width: 60,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Mã đối tượng',
                        binding: 'CustomerCode',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Tên đối tượng',
                        binding: 'CustomerName',
                        width: 225,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Ngân hàng',
                        binding: 'BankName',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Công trình',
                        binding: 'ProductName',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Số tiền',
                        binding: 'PaymentAmount',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Ghi chú',
                        binding: 'Description',
                        width: 150,
                        isColumnOriginal: true
                    },
                   
                ],
                grdReport1: [
                    {
                        header: 'STT',
                        binding: 'BuiltinOrder',
                        width: 60,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Mã đối tượng',
                        binding: 'CustomerCode',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Tên đối tượng',
                        binding: 'CustomerName',
                        width: 225,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Ngân hàng',
                        binding: 'BankName',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Công trình',
                        binding: 'ProductName',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Số tiền',
                        binding: 'PaymentAmount',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Ghi chú',
                        binding: 'Description',
                        width: 150,
                        isColumnOriginal: true
                    },
                   
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
                    key: 'CCMBudgetId',
                    lookupKey: 'TotalBudget',
                    label: 'Tổng hợp ĐXTT',
                    lookupfilter: "DocCode='K9' AND IsActive=1",
                    isContentHtml: false,
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