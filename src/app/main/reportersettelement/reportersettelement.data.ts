import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'New_Settelement',
            text: 'Theo dõi quyết toán dự án',
            command: 'usp_Kct_BaoCaoTaiChinhCongTruong_THQT',
            ctorArg: {
                'Commandkey': 'New_Settelement',
                'ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}')
            },
            totalGrid: 4,
            subTotals: { '1': 'ParentItemName' },
            nCollapseNodesOnCreate: { '0': 0 },
            bAllowGrandTotal: [
            ],
            parameters: [
              
                {
                    className: 'LookupBoxInput',
                    key: 'ProductCostId',
                    lookupKey: 'ProductCost',
                    label: 'Công trình/ Phòng, ban',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN ('1','3') AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'CCMBudgetId',
                    lookupKey: 'CCMBudget',
                    label: 'Version kế hoạch',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND DocCode='K2' AND ProductCostId='{EXPR=ProductCostId}'",
                    hideValueMember: false,
                    isContentHtml: false,
                    validators: [Validators.required]
                }
            ],
            data: {
                grdReport: [
                    {
                        header: 'Nội dung',
                        binding: 'DESCRIPTION',
                        width: 150
                    },
                    {
                        header: 'HĐ Dự án',
                        columns: [
                            {
                                header: 'XD',
                                binding: 'TotalHDDAXD',
                                width: 150,
                                format: 'n0'
                                
                            },
                            {
                                header: 'ME',
                                binding: 'TotalHDDA',
                                width: 150,
                                format: 'n0'
                                
                            },
                            {
                                header: 'Tổng cộng',
                                binding: 'TotalHDDA',
                                width: 150,
                                format: 'n0'
                            },
                        ]
                    },
                   
                    {
                        header: 'HĐ NT',
                        binding: 'TotalNT',
                        width: 150
                    },
                    {
                        header: 'Tổng',
                        binding: 'TotalBill',
                        width: 150,
                        format: 'n0'
                    }
                ],
                grdReport1: [
                    {
                        header: 'STT',
                        binding: '_Stt',
                        width: 120
                    },
                    {
                        header: 'Đối tác',
                        binding: 'CustomerName',
                        width: 300
                    },
                    {
                        header: 'Nội dung hợp đồng',
                        binding: 'JobName',
                        width: 200
                    },
                    {
                        header: 'Số hợp đồng',
                        binding: 'DocNo',
                        width: 150
                    },
                    {
                        header: 'Loại hợp đồng',
                        binding: 'ContractType',
                        width: 100
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
                        header: 'QT bản cứng',
                        binding: 'IsAtch',
                        width: 150
                    },
                    {
                        binding: 'StatusBiz',
                        header: 'Trạng thái QT',
                        width: 150
                    },
                    {
                        binding: 'DanhGiaCDA',
                        header: 'Đánh giá cuối dự án',
                        width: 150
                    },
                    {
                        binding: 'DiemDG',
                        header: 'Điểm đánh giá',
                        width: 150
                    },
                    {
                        binding: 'PhanLoaiDG',
                        header: 'Phân loại đánh giá',
                        width: 350
                    },
                    {
                        binding: 'NhanXet',
                        header: 'Nhận xét',
                        width: 350
                    },
                    {
                        binding: 'Amount_BaoHanh',
                        header: 'Giá trị bảo hành',
                        width: 150
                    },
                    {
                        binding: 'DayOfWarranty',
                        header: 'Thời gian bảo hành (tháng)',
                        width: 150
                    },  
                    {
                        binding: 'FromDate',
                        header: 'Bắt đầu',
                        width: 150
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
                            label: "THEO DÕI QUYẾT TOÁN DỰ ÁN",
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
                    }
                ],
                grdReport1: [
                    {
                        level: -1,
                        style: { fontWeight: '' }
                    },
                    {
                        level: 0,
                        style: { fontWeight: 'bold' }
                    }
                ]
            }
        }
    ]
}
