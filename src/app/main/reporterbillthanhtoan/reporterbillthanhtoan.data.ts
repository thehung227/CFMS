import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP01_BKBill_ThanhToan',
            text: 'Bảng tổng hợp đề nghị thanh toán NTP/NCC/ĐTC',
            command: 'usp_Vct_BangTongHopDeNghiThanhToanBill',
            ctorArg: { 'Commandkey': 'REP01_BKBill_ThanhToan', 'Ma_Dvcs': 'C01', 'CompletedApprove': '2', 'ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}') },
            subTotals: { '0': 'Ten_Ct,ProductName2' },
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
                    key: 'ProductCostId',
                    lookupKey: 'ProductCost',
                    label: 'Gói thầu',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: false,
                    validators: [Validators.required]
                },
                {
                    className: 'LookupBoxInput',
                    key: 'CustomerCode',
                    lookupKey: 'Customer_CCM2',
                    label: 'Đối tượng',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
                    hideValueMember: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'CompletedApprove',
                    lookupKey: 'Class',
                    label: 'Trạng thái',
                    lookupfilter: "ParentCode='CompletedApprove'",
                    hideValueMember: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'GDDAApprove',
                    lookupKey: 'Class',
                    label: 'Trạng thái GDDA',
                    lookupfilter: "ParentCode='CompletedApprove'",
                    hideValueMember: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'CCMApprove',
                    lookupKey: 'Class',
                    label: 'Trạng thái CCM',
                    lookupfilter: "ParentCode='CompletedApprove'",
                    hideValueMember: false
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
                        binding: 'SoTT_Ttoan',
                        width: 50
                    },
                    {
                        header: 'Đợt thanh toán',
                        binding: 'PayRequireNum',
                        width: 50
                    },
                    {
                        header: 'Mã đối tác',
                        binding: 'CustomerCode',
                        width: 100
                    },
                    {
                        header: 'Đối tác',
                        binding: 'CustomerName',
                        width: 300
                    },
                    {
                        header: 'Diễn giải (Công việc & Đợt TT)',
                        binding: 'Description',
                        width: 400
                    },
                    {
                        header: 'Giá trị đề nghị thanh toán kỳ này',
                        binding: 'Amount_DeNghiTT',
                        width: 150,
                        aggregate: 'Sum'
                    },
                    {
                        header: 'Giá trị lũy kế',
                        binding: 'Amount_TongTTDenKyNay',
                        width: 150
                    },
                    {
                        header: 'Giá trị thực hiện (Chưa VAT)',
                        binding: 'Amount_THDenKyNayNotVAT',
                        width: 150,
                        aggregate: 'Sum'
                    },
                    {
                        header: 'Giá trị thực hiện (gồm VAT)',
                        binding: 'Amount_THDenKyNay',
                        width: 150,
                        aggregate: 'Sum'
                    },
                    
                    {
                        header: 'Mã quy trình',
                        binding: 'ProcessCode',
                        width: 80
                    },
                    {
                        header: 'Quy trình duyệt',
                        binding: 'ProcessName',
                        width: 300
                    },
                    {
                        header: 'Phòng KSCP & HĐ',
                        columns: [
                            {
                                header: 'Không duyệt',
                                binding: 'CCMNotApprove',
                                width: 100,
                                dataType: 'Boolean'
                            },
                            {
                                header: 'Duyệt',
                                binding: 'CCMApprove',
                                width: 100,
                                dataType: 'Boolean'
                            },
                            {
                                header: 'Ý kiến',
                                binding: 'CCMComment',
                                width: 200,
                                isContentHtml: true
                            },
                        ]
                    },
                    {
                        header: 'Phòng Tài chính - Kế toán',
                        columns: [
                            {
                                header: 'Không duyệt',
                                binding: 'AccNotApprove',
                                width: 100,
                                dataType: 'Boolean'
                            },
                            {
                                header: 'Duyệt',
                                binding: 'AccApprove',
                                width: 100,
                                dataType: 'Boolean'
                            },
                            {
                                header: 'Giá trị thanh toán',
                                binding: 'AmountUNC',
                                width: 150
                            },
                            {
                                header: 'Ngày thanh toán',
                                binding: 'DocDateUNC',
                                width: 150
                            },
                            {
                                header: 'Ý kiến',
                                binding: 'AccComment',
                                width: 200,
                                isContentHtml: true
                            },
                            {
                                header: 'Số hợp đồng',
                                binding: 'DocNoC',
                                width: 300
                            },
                        ]
                    },
                    {
                        header: 'GĐDA',
                        columns: [
                            {
                                header: 'Không duyệt',
                                binding: 'GDDANotApprove',
                                width: 100,
                                dataType: 'Boolean'
                            },
                            {
                                header: 'Duyệt',
                                binding: 'GDDAApprove',
                                width: 100,
                                dataType: 'Boolean'
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
                            label: "",
                            style: "color: green;text-align: center",
                            styleobject: { "color": "blue", "text-align": "left" },
                            colspan: 12,
                            col: 1
                        }
                    ],
                    1: [
                        {
                            label: "BẢNG TỔNG HỢP THANH TOÁN NTP/NCC/ĐTC",
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
                    ],
                    4: [
                        {
                            label: "Đối tác: {VAR=CustomerName}",
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