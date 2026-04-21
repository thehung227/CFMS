import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP07_KHBT',
            text: 'Báo cáo kế hoạch bê tông',
            command: 'usp_BaoCaoKeHoachBeTong',
            ctorArg: { 'Commandkey': 'REP07_KHBT' },
            subTotals: { '0': 'ProductName' },
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
               
              
             
            ],
            data: {
                grdReport: [
                    {
                        header: 'Kế hoạch tháng',
                        binding: 'FromDate',
                        width: 80,
                        dataType: 'Date',
                        format: 'dd/MM/yyyy'
                    },
                    {
                        header: 'Nhóm hàng',
                        binding: 'ItemGroupCode',
                        width: 150
                    },
                    {
                        header: 'Cường dộ',
                        binding: 'ProductSizeName',
                        isReadOnly: 'true',
                        width: 150
                    },
                    {
                        header: 'Đồ sụt/xòe',
                        binding: 'ItemSpeciesName',
                        width: 150
                    },
                    {
                        header: 'Tên hàng hóa',
                        binding: 'ItemName',
                        width: 250
                    },
                    {
                        header: 'Tiêu chuẩn kỹ thuật/Spec khác',
                        binding: 'CategoryName',
                        width: 150
                    },
                  
                    {
                        header: 'ĐVT',
                        binding: 'Unit',
                        isReadOnly: 'true',
                        width: 80
                    },
                    
                    {
                        header: 'Khối lượng BOQ',
                        binding: 'QuantityBOQ',
                        dataType: 'Number',
                        width: 100,
                        format: 'n0',
                         aggregate: 'Sum'
                    },
                    {
                        header: 'Đơn giá BĐ (Chưa VAT)',
                        binding: 'UnitCostBD',
                        dataType: 'Number',
                        width: 100,
                        format: 'n0'
                    },
                    {
                        header: 'Thành tiền BĐ (Chưa VAT)',
                        binding: 'OriginalAmountBD',
                        dataType: 'Number',
                        width: 150,
                        format: 'n0',
                         aggregate: 'Sum'
                    },
                     {
                        header: 'Khối lượng tính toán (Chưa gồm HH)',
                        binding: 'Quantity',
                        dataType: 'Number',
                        width: 100,
                        format: 'n0',
                         aggregate: 'Sum'
                    },
                      {
                        header: '% hao hụt cho phép',
                        binding: 'ConcerlossRate',
                        dataType: 'Number',
                        width: 100,
                        format: 'p2'
                    },
                     {
                        header: 'Khối lượng tính toán (Gồm HH)',
                        binding: 'TotalQuantity',
                        dataType: 'Number',
                        width: 100,
                        format: 'n0',
                         aggregate: 'Sum'
                    },
                    {
                        header: 'Thành tiền tính toán (Gồm HH)',
                        binding: 'OriginalAmount',
                        dataType: 'Number',
                        width: 150,
                        format: 'n0',
                         aggregate: 'Sum'
                    },
                     {
                        header: 'Khối lượng thực tế đã thi công',
                        binding: 'KhoiLuongDatHang',
                        dataType: 'Number',
                        width: 100,
                        format: 'n0',
                         aggregate: 'Sum'
                    },
                     {
                        header: 'Khối lượng còn lại',
                        binding: 'DiffQuantity',
                        dataType: 'Number',
                        width: 100,
                        format: 'n0',
                         aggregate: 'Sum'
                    },
                    {
                        header: 'Ghi chú',
                        binding: 'Remark',
                        width: 200
                    },
                   
                    {
                        header: 'Tên dự án',
                        binding: 'ProductName',
                        width: 300
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
                            label: "BÁO CÁO KẾ HOẠCH BÊ TÔNG",
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