import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP07_HHBT',
            text: 'Báo cáo hao hụt bê tông chi tiết',
            command: 'usp_B30BizDoc_HaoHutBeTong',
            ctorArg: { 'Commandkey': 'REP07_HHBT' },
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
                },
                {
                    className: 'LookupBoxInput',
                    key: 'BizDocId',
                    lookupKey: 'BizDoc',
                    label: 'Version',
                    lookupfilter: "IsActive=1 AND ProductCostId = '{VAR=Filter.ProductCostId}'",
                    hideValueMember: false
                }
              
             
            ],
            data: {
                grdReport: [
                    {
                        header: 'Ngày đổ',
                        binding: 'EstimatedTimeDelivery',
                        width: 80,
                        dataType: 'Date',
                        format: 'dd/MM/yyyy'
                    },
                   
                    {
                        header: 'Cấu kiện',
                        binding: 'Description',
                        isReadOnly: 'true',
                        width: 150
                    },
                    {
                        header: 'Khu vực',
                        binding: 'XuatXu',
                        width: 150
                    },
                    {
                        header: 'Vị trí',
                        binding: 'NhanHieu',
                        width: 150
                    },
                    {
                        header: 'Cường độ',
                        binding: 'ProductSizeName',
                        width: 150
                    },
                  
                    {
                        header: 'Độ sụt',
                        binding: 'ItemSpecName',
                        isReadOnly: 'true',
                        width: 150
                    },
                    
                    {
                        header: 'Phụ gia',
                        binding: 'ItemSurfaceName',
                        isReadOnly: 'true',
                        width: 150
                    },
                   
                    {
                        header: 'Khối lượng CĐT (m3)',
                        binding: 'Quantity1',
                        dataType: 'Number',
                        width: 100,
                        format: 'n3'
                    },
                    {
                        header: 'Khối lượng tính toán (m3)',
                        binding: 'Quantity2',
                        dataType: 'Number',
                        width: 100,
                        format: 'n3'
                    },
                    {
                        header: 'Số lượng thực tế',
                        binding: 'Quantity9',
                        dataType: 'Number',
                        width: 100,
                        format: 'n3'
                    },
                    {
                        header: 'NCC',
                        binding: 'CustomerName1',
                        width: 200
                    },
                    {
                        header: 'Số đợt Bill NCC',
                        binding: 'DotBill',
                        dataType: 'Number',
                        width: 100,
                        format: 'n0'
                    },
                    {
                        header: 'Phương pháp đổ',
                        binding: 'PhuongPhapDo',
                        width: 200
                    },
                    {
                        header: 'NTP bơm',
                        binding: 'CustomerName2',
                        width: 200
                    },
                    {
                        header: 'NTP thi công',
                        binding: 'CustomerName3',
                        width: 200
                    },
                    {
                        header: 'Tên GS',
                        binding: 'ReceiptPerson',
                        width: 200
                    },
                    
                    {
                        header: 'Ghi chú',
                        binding: 'Remark',
                        width: 300
                    },
                    {
                        header: 'Chênh lệch KL (TT - CĐT)',
                        binding: 'QuantityTTCDT',
                        dataType: 'Number',
                        isReadOnly: 'true',
                        width: 150,
                        format: 'n3'
                    },
                    {
                        header: 'Chênh lệch KL (Thực tế-CĐT)',
                        binding: 'QuantityCDT',
                        dataType: 'Number',
                        isReadOnly: 'true',
                        width: 150,
                        format: 'n3'
                    },
                    {
                        header: 'Chênh lệch KL (Thực tế-Tính toán)',
                        binding: 'QuantityTT',
                        dataType: 'Number',
                        isReadOnly: 'true',
                        width: 150,
                        format: 'n3'
                    },
                    {
                        header: '% hao hụt (so với KL CĐT)',
                        binding: 'RateCDT',
                        dataType: 'Number',
                        isReadOnly: 'true',
                        width: 100,
                        format: 'p2'
                    },
                    {
                        header: '% hao hụt (so với KL tính toán)',
                        binding: 'RateTT',
                        dataType: 'Number',
                        isReadOnly: 'true',
                        width: 100,
                        format: 'p2'
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
                            label: "BÁO CÁO HAO HỤT BÊ TÔNG CHI TIẾT",
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