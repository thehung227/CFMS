
import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";


export class LayoutData {
    public Layout = [
        {
            key: 'REP07_KQT_BCTD',
            text: 'Báo cáo kế hoạch thanh toán',
            command: 'usp_Vct_BangTongHopDeNghiThanhToanBill_KeHoachChi_Total',


            ctorArg: { 'Commandkey': 'REP07_KQT_BCTD' },
            outputjson: 0,

            JsonColumnPos: {
                grdReport: 11
            },
            subTotals: {},
            nCollapseNodesOnCreate: { '0': 1 },
            rowHeader: {
                0: [
                    {
                        height: 41
                    },
                    {
                        height: 41
                    }
                ]
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
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType = 1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: false,
                    validators: [Validators.required]
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

            // summary: {
            //     cols:2,
            //     row: {
            //         0: [
            //             {
            //                 label: TRƯỞNG PHÒNG THIẾT BỊ,
            //                 style: color: green;text-align: center,
            //                 styleobject: {color: blue,text-align: center,font-weight: bold},
            //                 colspan:12,
            //                 col: 1
            //             }
            //         ]
            //     }
            // },

            data: {
                grdReport: [
                    {
                        header: 'Stt',
                        binding: 'ItemNo',
                        width: 80,
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
                        header: 'Giá trị thanh toán (Đã lên bill, chưa TT hết)',
                        columns: [
                            {
                                header: 'Tổng số tiền cần TT',
                                binding: 'DiffAmount',
                                width: 150,
                                align: 'right'
                            },
                            {
                                header: 'Theo CĐT',
                                binding: 'BackToBack',
                                width: 150,
                                align: 'right'
                            },
                            {
                                header: 'Khác',
                                binding: 'NotDueDebt',
                                width: 150,
                                align: 'right'
                            },
                            {
                                header: 'Quá hạn 30 ngày',
                                binding: 'NotDueDebt30',
                                width: 150,
                                align: 'right'
                            },
                            {
                                header: 'Quá hạn 60 ngày',
                                binding: 'NotDueDebt60',
                                width: 150,
                                align: 'right'
                            },
                            {
                                header: 'Trên 60 ngày',
                                binding: 'NotDueDebt90',
                                width: 150,
                                align: 'right'
                            }
                        ]

                    },
                    // {
                    //     header: 'Công việc đã CC/Thi công nhưng chưa up bill',
                    //     columns: [
                    //         {
                    //             header: 'Tổng số tiền cần TT',
                    //             binding: 'OriginalAmount',
                    //             width: 150,
                    //             align: 'right'
                    //         },
                    //         {
                    //             header: 'Ngày tính hạn TT',
                    //             binding: 'EstimatedTimeDelivery',
                    //             dataType: 'Date',
                    //             width: 150,
                    //             format: 'dd/MM/yyyy'
                    //         },
                    //         {
                    //             header: 'KL thi công/CC tháng',
                    //             binding: 'Description',
                    //             width: 150
                    //         }
                    //     ]

                    // },
                //     {
                //         header: 'Dự trù công việc chưa CC/Thi Công',
                //         columns: [
                //         {
                //             header: 'Tổng số tiền cần TT',
                //             binding: 'Amount_ThiCong',
                //             width: 150,
                //             align: 'right'
                //         },
                //         {
                //             header: 'Ngày tính hạn TT',
                //             binding: 'RequestDate',
                //             dataType: 'Date',
                //             width: 150,
                //             format: 'dd/MM/yyyy'
                //         }
                       
                //     ]
        
                //   }
                ]
            }
        }
    ]
}


