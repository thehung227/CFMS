import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP07_DXTCT',
            text: 'Báo cáo đề xuất chi tiền Tết',
            command: 'usp_B30BizDocVB_DeXuatThuChiTet',
            ctorArg: { 'Commandkey': 'REP07_DXTCT' },
            subTotals: {},
            bAllowGrandTotal: [0],
            nCollapseNodesOnCreate: {},
            parameters: [
               
                {
                    className: 'LookupBoxInput',
                    key: 'ProductCostId',
                    lookupKey: 'ProductCost',
                    label: 'Gói thầu',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType = 1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: false
                }
              
             
            ],
            data: {
                grdReport: [
                    {
                        header: 'Mã ưu tiên chi',
                        binding: 'CodeKHC',
                        
                        width: 150
                    },
                    {
                        header: 'Đối tượng',
                        binding: 'CustomerName',
                        
                        width: 250
                    },
                    {
                        header: 'Hợp đồng',
                        binding: 'ContractNo',
                     
                        width: 150,
                    },
                    {
                        header: 'Giá trị thanh toán theo điều khoản hợp đồng'	,
                        columns: [
                            {
                                header: 'Tổng cộng',
                                binding: 'OriginalAmount',
                                dataType: 'Number',
                                width: 150,
                                aggregate:'Sum',
                                format: 'n0'
                            },
                           
                            {
                                header: 'Giá trị thanh toán trong tháng 11/23'	,
                                columns: [
                                    {
                                        header: 'Bill đã up',
                                        binding: 'Amount1',
                                        dataType: 'Number',
                                        width: 150,
                                        aggregate:'Sum',
                                        format: 'n0'
                                    }, 
                                    {
                                        header: 'Bill dự trù',
                                        binding: 'PlanAmount1',
                                        dataType: 'Number',
                                        width: 150,
                                        aggregate:'Sum',
                                        format: 'n0'
                                    } 
                                ]
                            },
                            {
                                header: 'Giá trị thanh toán trong tháng 12/23'	,
                                columns: [
                                    {
                                        header: 'Bill đã up',
                                        binding: 'Amount2',
                                        dataType: 'Number',
                                        width: 150,
                                        aggregate:'Sum',
                                        format: 'n0'
                                    }, 
                                    {
                                        header: 'Bill dự trù',
                                        binding: 'PlanAmount2',
                                        dataType: 'Number',
                                        width: 150,
                                        aggregate:'Sum',
                                        format: 'n0'
                                    } 
                                ]
                            },
                            {
                                header: 'Giá trị thanh toán trong tháng 01/24'	,
                                columns: [
                                    {
                                        header: 'Bill đã up',
                                        binding: 'Amount3',
                                        dataType: 'Number',
                                        width: 150,
                                        aggregate:'Sum',
                                        format: 'n0'
                                    }, 
                                    {
                                        header: 'Bill dự trù',
                                        binding: 'PlanAmount3',
                                        dataType: 'Number',
                                        width: 150,
                                        aggregate:'Sum',
                                        format: 'n0'
                                    } 
                                ]
                            },
                            {
                                header: 'Giá trị thanh toán trong tháng 02/24'	,
                                columns: [
                                    {
                                        header: 'Bill đã up',
                                        binding: 'Amount4',
                                        dataType: 'Number',
                                        aggregate:'Sum',
                                        width: 150,
                                        format: 'n0'
                                    }, 
                                    {
                                        header: 'Bill dự trù',
                                        binding: 'PlanAmount4',
                                        dataType: 'Number',
                                        aggregate:'Sum',
                                        width: 150,
                                        format: 'n0'
                                    } 
                                ]
                            },
                        ]
                       						
                    },
                    {
                        header: 'Giá trị thanh toán theo BCH đề xuất'	,
                        columns: [
                            {
                                header: 'Tổng cộng',
                                binding: 'ThisPeriod',
                                dataType: 'Number',
                                aggregate:'Sum',
                                width: 150,
                                format: 'n0'
                            },
                           
                            {
                                header: 'Giá trị thanh toán trong tháng 11/23'	,
                                binding: 'Amount5',
                                dataType: 'Number',
                                aggregate:'Sum',
                                width: 150,
                                format: 'n0'
                            },
                            {
                                header: 'Giá trị thanh toán trong tháng 12/23'	,
                                binding: 'Amount6',
                                dataType: 'Number',
                                aggregate:'Sum',
                                width: 150,
                                format: 'n0'
                            },
                            {
                                header: 'Giá trị thanh toán trong tháng 01/24'	,
                                binding: 'Amount7',
                                dataType: 'Number',
                                aggregate:'Sum',
                                width: 150,
                                format: 'n0'
                            },
                            {
                                header: 'Giá trị thanh toán trong tháng 02/24 - Trước tết'	,
                                binding: 'Amount8',
                                dataType: 'Number',
                                aggregate:'Sum',
                                width: 150,
                                format: 'n0'
                            },
                            {
                                header: 'Giá trị thanh toán trong tháng 02/24 - Sau tết'	,
                                binding: 'Amount9',
                                dataType: 'Number',
                                aggregate:'Sum',
                                width: 150,
                                format: 'n0'
                            },
                        ]
                       						
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
                            label: "BÁO CÁO THEO DÕI PHÁT SINH",
                            style: "text-align: center;",
                            styleobject: { "text-align": "center", "color": "blue", "font-size": "14pt" },
                            colspan: 12,
                            height: 50,
                            col: 1
                        }
                    ],
                    2: [
                        {
                            label: "Gói thầu: {VAR=ProductName}",
                            style: "text-align: center",
                            styleobject: { "text-align": "center", "color": "blue" },
                            col: 1,
                            colspan: 12
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
            //         },
            //         {
            //             level: 1,
            //             style: { fontWeight: 'bold' }
            //         }
            //     ]
            // }
        }
    ]
}