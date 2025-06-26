import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP03_CPVP',
            text: 'Báo cáo chi phí phòng ban',
            command: 'usp_Kth_TongHopChiPhiTheoKhoanMuc_CreateColumn',
            ctorArg: { 'Commandkey': 'REP03_CPVP', 'Ma_Dvcs': 'A01', 'RepType': '2', 'ExpenseAccount': '621,622,623,627,641,642,811', 'ReduceAccount': '152,153,155,156,157,2294,11,14,33' },
            outputjson: 0,
            bAllowGrandTotal: [0],
            JsonColumnPos:{
                grdReport: 2
            },
            nCollapseNodesOnCreate: { '0': 1 },
            parameters: [
                {
                    className: 'DateBoxInput',
                    key: 'DocDate1',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    label: 'Từ ngày'
                },
                {
                    className: 'DateBoxInput',
                    key: 'DocDate2',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    label: 'Đến ngày'
                },
                {
                    className: 'LookupBoxInput',
                    key: 'DeptCode',
                    lookupKey: 'Dept',
                    label: 'Phòng ban',
                    lookupfilter: "IsGroup=0 AND IsActive=1"
                },
                {
                    className: 'LookupBoxInput',
                    key: 'Ma_Dvcs',
                    lookupKey: 'Branch',
                    lookupfilter: "Ma_Dvcs ='{VAR=Branch.Ma_Dvcs}'",
                    label: 'Đơn vị',
                    validators: [Validators.required]
                }
            ],
            data: {
                grdReport: [
                    {
                        header: 'STT',
                        binding: 'Stt',
                        width: 50
                    },
                 
                    {
                        header: 'Nội dung',
                        binding: 'Description',
                        width: 300
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
                            label: "BÁO CAO CHI PHÍ PHÒNG BAN",
                            style: "text-align: center;",
                            styleobject: { "text-align": "center", "color": "blue", "font-size": "14pt" },
                            colspan: 12,
                            height: 50,
                            col: 1
                        }
                    ],
                 
                    2: [
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