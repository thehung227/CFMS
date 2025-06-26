import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP03_SafePunish',
            text: 'Thống kê biên bản phạt an toàn',
            command: 'usp_Newtecons_ThongKeBienBanPhatAnToan',
            ctorArg: { 'Commandkey': 'REP03_SafePunish','ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}') },
            subTotals: { '0': 'ProjectManager,ProductName' },
            nCollapseNodesOnCreate: { '0': 3 },
            bAllowGrandTotal: [0],
            parameters: [
                {
                    className: 'DateBoxInput',
                    key: 'DocDate1',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    label: 'Từ ngày lập biên bản'
                },
                {
                    className: 'DateBoxInput',
                    key: 'DocDate2',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    label: 'Đến ngày lập biên bản'
                },
                {
                    className: 'LookupBoxInput',
                    key: 'ProductCostId',
                    lookupKey: 'ProductCost',
                    label: 'Gói thầu',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: false
                }
            ],
            data: {
                grdReport: [
                
                    {
                        header: 'Nội dung - Đối tượng',
                        binding: 'CustomerName',
                        width: 300
                    },
                    {
                        header: 'Số tiền phạt',
                        binding: 'TotalAmount',
                        width: 150,
                        aggregate: 'Sum'
                    },
                    {
                        header: 'Phân loại',
                        binding: 'ClassName',
                        width: 150
                    },
                    {
                        header: 'Ngày lập biên bản',
                        binding: 'StartDate',
                        width: 150
                    },
                    {
                        header: 'Số biên bản (hệ thống)',
                        binding: 'DocNo',
                        width: 150
                    },
                    {
                        header: 'Nội dung vi phạm',
                        binding: 'Description',
                        width: 300
                    },
                    {
                        header: 'Số hợp đồng',
                        binding: 'BizDocNo',
                        width: 150
                    },
                    {
                        header: 'Tên Đội/Nhóm',
                        binding: 'ContractGroup',
                        width: 150
                    },
                    {
                        header: 'Tên dự án',
                        binding: 'ProductName',
                        width: 150
                    },
                    {
                        header: 'Mã dự án',
                        binding: 'ProductCode',
                        width: 150
                    },
                    {
                        header: 'GDDH',
                        binding: 'ProjectManager',
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
                            label: "THỐNG KÊ BIÊN BẢN PHẠT AN TOÀN",
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
                    ],
                    3: [
                        {
                            label: "Từ ngày: {VAR=FromDateStr} Đến ngày: {VAR=ToDateStr}",
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