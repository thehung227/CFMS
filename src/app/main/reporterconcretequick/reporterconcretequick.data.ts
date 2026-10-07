import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

// Báo cáo nhanh sản lượng bê tông dự án (mẫu Excel "Copy of TONG HOP_Rev06.xlsx" - sheet "Báo cáo nhanh _ DA")
// SP: dbo.usp_Kct_BaoCaoNhanhSanLuongBeTong_DuAn (database/baocaonhanhbetongda/)
export class LayoutData {
    public Layout = [
        {
            key: 'REP07_BCNBT',
            text: 'Báo cáo nhanh sản lượng bê tông dự án',
            command: 'usp_Kct_BaoCaoNhanhSanLuongBeTong_DuAn',
            // ProductCostId không phải tham số lọc: component tự điền theo phiếu đang mở
            // (tham số trên url) hoặc gói thầu đang chọn của phiên làm việc.
            ctorArg: { 'Commandkey': 'REP07_BCNBT', 'ProductCostId': '' },
            parameters: [
                {
                    className: 'DateBoxInput',
                    key: 'DocDate',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    label: 'Ngày báo cáo'
                }
            ],
            data: {
                grdReport: [
                    {
                        header: 'Tháng',
                        binding: 'Thang',
                        width: 170,
                        dataType: 'String'
                    },
                    {
                        header: 'BOQ',
                        columns: [
                            {
                                header: 'KL',
                                binding: 'QuantityBOQ',
                                dataType: 'Number',
                                width: 130,
                                format: 'n2',
                                align: 'right'
                            },
                            {
                                header: 'Thành tiền',
                                binding: 'AmountBOQ',
                                dataType: 'Number',
                                width: 190,
                                format: 'n0',
                                align: 'right'
                            }
                        ]
                    },
                    {
                        header: 'KL tính toán (chưa gồm hao hụt)',
                        columns: [
                            {
                                header: 'KL',
                                binding: 'QuantityChuaHH',
                                dataType: 'Number',
                                width: 130,
                                format: 'n2',
                                align: 'right'
                            },
                            {
                                header: 'Thành tiền',
                                binding: 'AmountChuaHH',
                                dataType: 'Number',
                                width: 190,
                                format: 'n0',
                                align: 'right'
                            }
                        ]
                    },
                    {
                        header: 'KL tính toán (gồm hao hụt)',
                        columns: [
                            {
                                header: 'KL',
                                binding: 'QuantityGomHH',
                                dataType: 'Number',
                                width: 130,
                                format: 'n2',
                                align: 'right'
                            },
                            {
                                header: 'Thành tiền',
                                binding: 'AmountGomHH',
                                dataType: 'Number',
                                width: 190,
                                format: 'n0',
                                align: 'right'
                            }
                        ]
                    }
                ]
            },
            title: {
                cols: 2,
                row: {
                    0: [
                        {
                            label: "BÁO CÁO NHANH SẢN LƯỢNG BÊ TÔNG DỰ ÁN",
                            style: "text-align: center;",
                            styleobject: { "text-align": "center", "color": "#1F4E79", "font-size": "14pt", "font-weight": "bold" },
                            colspan: 7,
                            height: 40,
                            col: 1
                        }
                    ],
                    1: [
                        {
                            label: "Dự án: {VAR=ProductName} - Kế hoạch: {VAR=DocNo} - Ngày báo cáo: {VAR=DocDateStr}",
                            style: "text-align: center;",
                            styleobject: { "text-align": "center", "color": "blue" },
                            colspan: 7,
                            col: 1
                        }
                    ],
                    2: [
                        {
                            label: "TỔNG KL BOQ (m³): {VAR=TongKLBOQ}",
                            style: "text-align: left;",
                            styleobject: { "text-align": "left", "font-weight": "bold" },
                            colspan: 2,
                            col: 1
                        },
                        {
                            label: "TỔNG KL CHƯA HAO HỤT (m³): {VAR=TongKLChuaHH}",
                            style: "text-align: left;",
                            styleobject: { "text-align": "left", "font-weight": "bold" },
                            colspan: 2,
                            col: 3
                        },
                        {
                            label: "TỔNG KL GỒM HAO HỤT (m³): {VAR=TongKLGomHH}",
                            style: "text-align: left;",
                            styleobject: { "text-align": "left", "font-weight": "bold" },
                            colspan: 3,
                            col: 5
                        }
                    ],
                    3: [
                        {
                            label: "TỔNG GIÁ TRỊ BOQ (VNĐ): {VAR=TongGTBOQ}",
                            style: "text-align: left;",
                            styleobject: { "text-align": "left", "font-weight": "bold" },
                            colspan: 2,
                            col: 1
                        },
                        {
                            label: "TỔNG GIÁ TRỊ CHƯA HAO HỤT (VNĐ): {VAR=TongGTChuaHH}",
                            style: "text-align: left;",
                            styleobject: { "text-align": "left", "font-weight": "bold" },
                            colspan: 2,
                            col: 3
                        },
                        {
                            label: "TỔNG GIÁ TRỊ GỒM HAO HỤT (VNĐ): {VAR=TongGTGomHH}",
                            style: "text-align: left;",
                            styleobject: { "text-align": "left", "font-weight": "bold" },
                            colspan: 3,
                            col: 5
                        }
                    ]
                }
            }
        }
    ]
}
