import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'NEW_PlanStaffCost',
            text: 'Báo cáo phân bổ chi phí nhân sự',
            command: 'usp_BangPhanBoChiPhiNhanSu',
            ctorArg: { 'Commandkey': 'NEW_PlanStaffCost'},
            bAllowGrandTotal: [0],
            frozenColumns: 1,
            // subTotals: { '0': 'ProductName,TypeName' },
            // nCollapseNodesOnCreate: { '0': 1 },
            outputjson: 0,
            JsonColumnPos: {
                grdReport: 2
            },
            parameters: [
                {
                    className: 'DateBoxInput',
                    key: 'DocDate',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    label: 'Ngày'
                },
            ],
            data: {
                grdReport: [
                    {
                        header: 'Mã Dự Án/Gói Thầu',
                        binding: 'ProductCode',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Tên Dự Án/Gói Thầu',
                        binding: 'ProductCostName',
                        width: 300,
                        isColumnOriginal: true
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
                            label: "BẢNG PHÂN BỔ CHI PHÍ NHÂN SỰ",
                            style: "text-align: center;",
                            styleobject: { "text-align": "center", "color": "blue", "font-size": "14pt" },
                            colspan: 12,
                            height: 50,
                            col: 1
                        }
                    ],
                 
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
                ]
            }
        }
    ]
}