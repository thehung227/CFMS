import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP01_REPORTINVENTORY_DT',
            text: 'Báo cáo chi tiết sổ kho',
            command: 'usp_Vcd_TongHopNhapXuatTonTheoMucGia_Equip_Report_Detail',
            ctorArg: { 'Commandkey': 'REP01_REPORTINVENTORY_DT', 'ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}')},
            nCollapseNodesOnCreate: { '0': 1 },
            subTotals: { },
            // bAllowGrandTotal: [0],
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
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType = 1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
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
                        header: 'Nhóm hàng',
                        binding: 'ItemGroupCode',
                        width: 120,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Tên nhóm hàng',
                        binding: 'ItemGroupName',
                        width: 200,
                        isColumnOriginal: true
                    },
                  
                    {
                        header: 'Tên mặt hàng',
                        binding: 'ItemName',
                        width: 300,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Đvt',
                        binding: 'Unit',
                        width: 80,
                        isColumnOriginal: true
                    },
                   {
                        header: 'Ngày nhập/xuất',
                        binding: 'DocDate',
                        width: 100,
                        align: 'right',
                        format: 'dd/MM/yyyy',
                        isColumnOriginal: true
                    },
                     {
                        header: 'Số phiếu Nhập/Xuất',
                        binding: 'DocNo',
                        width: 120,
                        isColumnOriginal: true
                    },
                    {
                        header: 'KL đặt hàng',
                        binding: 'QuantityPO',
                        dataType: 'Number',
                        width: 150,
                         format: 'n2',
                        aggregate: 'Sum'
                    },
                    {
                        header: 'KL đã nhập kho',
                        binding: 'ReceiptQuantity',
                        dataType: 'Number',
                        width: 150,
                         format: 'n2',
                        aggregate: 'Sum'
                    },
                    {
                        header: 'KL đã cấp phát',
                        binding: 'DeliveryQuantity',
                        dataType: 'Number',
                        width: 150,
                         format: 'n2',
                        aggregate: 'Sum'
                    },
                    {
                        header: 'KL tồn kho',
                        binding: 'CloseQuantity',
                        dataType: 'Number',
                        width: 150,
                         format: 'n2',
                        aggregate: 'Sum'
                    },
                    {
                        header: 'Đơn giá đặt hàng (Trước VAT)',
                        binding: 'UnitCost',
                        dataType: 'Number',
                        width: 120
                    },
                    {
                        header: 'Thành tiền nhập kho',
                        binding: 'ReceiptAmount',
                        dataType: 'Number',
                        width: 150,
                        aggregate: 'Sum'
                    },
                     {
                        header: 'Thành tiền xuất kho',
                         columns: [
                            {
                                header: 'Tổng',
                                binding: 'DeliveryAmount',
                                dataType: 'Number',
                                width: 150,
                                aggregate: 'Sum'
                            },
                            {
                                header: 'Trừ tiền',
                                binding: 'TruTien',
                                width: 80
                            },
                            {
                                header: 'Không trừ',
                                binding: 'KhongTru',
                                width: 80
                            },
                        ]
                    },
                     {
                        header: 'Thành tiền tồn kho',
                        binding: 'CloseBal',
                        dataType: 'Number',
                        width: 150,
                        aggregate: 'Sum'
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
                            label: "BÁO CÁO SỔ KHO",
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