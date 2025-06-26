import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP07_BCKTVER1_VER1',
            text: 'Báo cáo khấu trừ',
            command: 'usp_BizDocCCM_BaoCaoKhauTru',
            ctorArg: { 'Commandkey': 'REP07_BCKTVER1_VER1' }, 
            subTotals: { '0': 'CustomerName' },
            bAllowGrandTotal: [0],
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
                    className: 'LookupBoxInput',
                    key: 'ProductCostId',
                    lookupKey: 'ProductCost',
                    label: 'Gói thầu',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType = 1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: false,
                    validators: [Validators.required]
                }
             
            ],
            data: {
                grdReport: [
                    {
                        header: 'Hạng mục QLKL',
                        binding: 'Ma_QLKL',
                        width:100
                        },
                    {
                        header: 'CẦN TRỪ'	,
                        columns: [
                            {
                            header: 'TÊN THẦU PHỤ CẦN TRỪ',
                            binding: 'CustomerNamePlus',
                            width:200	
                            },
                            {
                                header: 'NỘI DUNG',
                                binding: 'DescriptionPlus',
                                width:200	
                            },
                            {
                                header: 'KL',
                                binding: 'Quantity9Plus',
                                dataType: 'Number',
                                width: 100,
                                aggregate:'Sum',
                                align: 'right',
                                format: 'n2'
                            },
                            {
                                header: 'ĐƠN GIÁ',
                                binding: 'OriginalUnitCostPlus',
                                dataType: 'Number',
                                width: 150,
                                format: 'n2'
                            },
                            {
                                header: 'THÀNH TIỀN',
                                binding: 'OriginalAmountPlus',
                                dataType: 'Number',
                                aggregate:'Sum',
								 align: 'right',
                                width: 150,
                                format: 'n0'
                            },
                            {
                                header: '%',
                                binding: 'Percent_ThPlus',
                                dataType: 'Number',
                                width: 100,
                                format: 'n0'
                            },
                            {
                                header: 'GIÁ TRỊ ĐÃ THANH TOÁN',
                                binding: 'Amount_ThPlus',
                                dataType: 'Number',
                                width: 150,
                                aggregate:'Sum',
                                align: 'right',
                                format: 'n0'
                            },
                            {
                                header: 'THẦU PHỤ ĐÃ THI CÔNG',
                                binding: 'CustomerName0',
                                width:200	
                            },
                            {
                                header: 'SỐ HỢP ĐỒNG',
                                binding: 'DocNoPlus',
                                width:150	
                            },
                        ]
                       						
                    },
                    {
                        header: 'ĐÃ TRỪ'	,
                        columns: [
                            {
                                header: 'TÊN THẦU PHỤ ĐÃ BỊ TRỪ',
                                binding: 'CustomerName1',
                                width:200	
                            },
                            {
                                header: 'SỐ HỢP ĐỒNG',
                                binding: 'DocNoDeduct',
                                width:150	
                            },
                            {
                                header: 'NỘI DUNG',
                                binding: 'DescriptionDeduct',
                                width:200	
                            },
                            {
                                header: 'KL',
                                binding: 'Quantity9Deduct',
                                dataType: 'Number',
                                width: 100,
                                aggregate:'Sum',
                                align: 'right',
                                format: 'n2'
                            },
                            {
                                header: 'ĐƠN GIÁ',
                                binding: 'OriginalUnitCostDeduct',
                                dataType: 'Number',
                                width: 150,
                                format: 'n2'
                            },
                            {
                                header: 'THÀNH TIỀN',
                                binding: 'OriginalAmountDeduct',
                                dataType: 'Number',
                                width: 150,
                                aggregate:'Sum',
                                align: 'right',
                                format: 'n0'
                            },
                            {
                                header: '%',
                                binding: 'Percent_ThDeduct',
                                dataType: 'Number',
                                width: 100,
                                format: 'n0'
                            },
                            {
                                header: 'GIÁ TRỊ ĐÃ THANH TOÁN',
                                binding: 'Amount_ThDeduct',
                                dataType: 'Number',
                                width: 150,
                                aggregate:'Sum',
                                align: 'right',
                                format: 'n0'
                            },
                            {
                                header: 'THẦU PHỤ ĐÃ THI CÔNG',
                                binding: 'CustomerNameDeduct',
                                width:200	
                            },
                           
                        ]
                       						
                    },
                    {
                        header: 'CÒN LẠI'	,
                        columns: [
                            {
                                header: 'CÒN PHẢI TRỪ (THEO THÀNH TIỀN)',
                                binding: 'DiffAmount1',
                                dataType: 'Number',
                                width: 150,
                                aggregate:'Sum',
                                align: 'right',
                                format: 'n0'
                            },
                            {
                                header: 'CÒN PHẢI TRỪ (THEO THỰC THANH TOÁN)',
                                binding: 'DiffAmount2',
                                dataType: 'Number',
                                width: 150,
                                aggregate:'Sum',
                                align: 'right',
                                format: 'n0'
                            }, 
                        ]
                       						
                    },
                    
                    {
                        header: 'DỰ ÁN/GÓI THẦU',
                        binding: 'ProductName',
                        isRequired: true,
                        width: 150
                    },
                    {
                        header: 'TÊN THẦU PHỤ CẦN TRỪ',
                        binding: 'CustomerNamePlus',
                        width:0	
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
                            label: "BÁO CÁO THEO DÕI KHẤU TRỪ",
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
            formatGroup: {
                grdReport: [
                    {
                        level: -1,
                        style: { fontWeight: '' }
                    },
                    {
                        level: 0,
                        style: { fontWeight: 'bold' }
                    },
                    {
                        level: 1,
                        style: { fontWeight: 'bold' }
                    }
                ]
            }
        }
    ]
}