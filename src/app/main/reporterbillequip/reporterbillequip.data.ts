import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP01_PTB_ThanhToan',
            text: 'Báo cáo tình trạng thanh toán',
            command: 'usp_PTB_BangTongHopDeNghiThanhToanBill',
            ctorArg: { 'Commandkey': 'REP01_PTB_ThanhToan', 'Ma_Dvcs': 'C01', 'CompletedApprove': '2' },
             subTotals: { '0': 'ProductName2,GroupName,DocNoContract' },
             nCollapseNodesOnCreate: { '0': 2 },
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
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType = 1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'CustomerCode',
                    lookupKey: 'Customer_CCM2',
                    label: 'Đối tượng',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
                    hideValueMember: false
                },
                // {
                //     className: 'LookupBoxInput',
                //     key: 'CompletedApprove',
                //     lookupKey: 'Class',
                //     label: 'Trạng thái',
                //     lookupfilter: "ParentCode='CompletedApprove'",
                //     hideValueMember: false
                // },
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
                        header: 'Loại thanh toán',
                        binding: 'PayTeamName',
                        width: 150
                    },
                    {
                        header: 'Yêu cầu thanh toán số',
                        binding: 'PayRequireNum',
                        width: 50
                    },
                    {
                        header: 'Số hợp đồng',
                        binding: 'DocNoContract',
                        width: 150
                    },
                    {
                        header: 'Giá trị hợp đồng',
                        binding: 'ContractAmountAddVAT',
                        width: 150
                    },
                    {
                        header: 'Thầu phụ, NCC',
                        binding: 'CustomerName',
                        width: 300
                    },
                    {
                        header: 'Nội dung hợp đồng',
                        binding: 'DescriptionContract',
                        width: 300
                    },
                    {
                        header: 'Công việc',
                        binding: 'JobName',
                        width: 400
                    },
                    {
                        header: 'Giá trị thực hiện (gồm VAT)',
                        binding: 'Amount_THDenKyNay',
                        width: 150
                    },
                    {
                        header: 'Giá trị thanh toán đến kỳ này',
                        binding: 'Amount_TongTTDenKyNay',
                        width: 150
                    },
                    {
                        header: 'Lũy kế đến kỳ trước',
                        binding: 'Amount_TTKyTruoc',
                        width: 150
                    },
                    {
                        header: 'Giá trị đề nghị thanh toán',
                        binding: 'Amount_DeNghiTT',
                        width: 150,
                        aggregate: 'Sum'
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
                        header: 'Đã gửi duyệt',
                        binding: 'ApproveSend',
                        width: 80,
                        dataType: 'Boolean'
                    },
                    {
                        header: 'Hoàn thành duyệt',
                        binding: 'CompletedApprove',
                        width: 80,
                        dataType: 'Boolean'
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
                            label: "BÁO CÁO TÌNH TRẠNG THANH TOÁN",
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