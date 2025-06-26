import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'New_WeeklyReport',
            text: 'Báo cáo tuần CHT',
            command: 'usp_Newtecons_WeeklyReport',
            ctorArg: {
                'Commandkey': 'New_WeeklyReport',
                'ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}')
            },
            totalGrid: 4,
            subTotals: {},
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
                }
            ],
            data: {
                grdReport: [
                    {
                        header: '',
                        binding: 'Remark',
                        width: 150
                    },
                    {
                        header: 'Tổng dự trù chi phí Thiết bị',
                        binding: 'TongDuTruCPTB',
                        width: 150,
                        format: 'n0'
                    },
                    {
                        header: 'Lũy kế dự trù chi phí Thiết bị',
                        binding: 'LuyKeDuTruTB1',
                        width: 150
                    },
                    {
                        header: 'Lũy kế thực tế chi phí Thiết bị',
                        binding: 'LuyKeThucTeCPTB',
                        width: 150,
                        format: 'n0'
                    }
                ],
                grdReport1: [
                    {
                        header: 'Stt',
                        binding: 'BuiltinOrder',
                        width: 120
                    },
                    {
                        header: 'Công tác',
                        binding: 'EmployeeGroupName',
                        width: 300
                    },
                    {
                        header: 'Số lượng định biên (đến hiện tại)',
                        binding: 'QuantityBudget',
                        width: 150
                    },
                    {
                        header: 'Số lượng thực tế',
                        binding: 'Quantity',
                        width: 150
                    }
                ],
                grdReport2: [
                  
                    {
                        header: 'Tổng dự trù CP BCH',
                        binding: 'OriginalAmount1',
                        width: 150,
                        format: 'n0'
                    },
                    {
                        header: 'Lũy kế dự trù CP BCH',
                        binding: 'CostPercent1',
                        width: 150,
                        format: 'n0'
                    },
                    {
                        header: 'Lũy kế thực tế CP BCH',
                        binding: 'Amount_KT',
                        width: 150,
                        format: 'n0'
                    },
                    {
                        header: 'Đánh giá & Giải pháp',
                        binding: 'Account',
                        width: 150
                    }
                ],
                grdReport3: [
                    {
                        header: 'Stt',
                        binding: 'Code',
                        width: 120
                    },
                    {
                        header: 'Nội dung',
                        binding: 'Name',
                        width: 300
                    },
                    {
                        header: 'Số tiền (Tỷ đồng)',
                        binding: 'Amount',
                        width: 150,
                        format: 'n2'
                    },
                    {
                        header: 'Ghi chú',
                        binding: 'Remark',
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
                            label: "BÁO CÁO TUẦN CHT",
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
