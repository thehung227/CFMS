import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'CTC_HumanReport',
            text: 'Nhân sự tham gia gói thầu',
            command: 'usp_Kct_BaoCaoTheoDoiDuAn',
            ctorArg: { 'Commandkey': 'CTC_HumanReport', 'Ma_Dvcs': 'C01', 'ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}') },
            subTotals: { '0': 'PositionName' },
            nCollapseNodesOnCreate: { '0': 2 },
            parameters: [
                {
                    className: 'LookupBoxInput',
                    key: 'ProductCostId',
                    lookupKey: 'ProductCost',
                    label: 'Gói thầu',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: false,
                    validators: [Validators.required]
                },
                // {
                //     className: 'LookupBoxInput',
                //     key: 'EmployeeCode',
                //     lookupKey: 'Employee',
                //     label: 'Nhân viên',
                //     lookupfilter: "IsGroup=0 AND IsActive=1 AND BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
                //     hideValueMember: false
                // },
                // {
                //     className: 'LookupBoxInput',
                //     key: 'PositionCode',
                //     lookupKey: 'Position',
                //     label: 'Vai trò',
                //     lookupfilter: "IsGroup=0 AND IsActive=1",
                //     hideValueMember: false
                // },
                {
                    className: 'LookupBoxInput',
                    key: 'IsActiveStatus',
                    lookupKey: 'Class',
                    label: 'Trạng thái',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='IsActiveStatus'",
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
                        header: 'Mã nhân sự',
                        binding: 'EmployeeCode',
                        width: 100
                    },
                    {
                        header: 'Tên nhân sự',
                        binding: 'EmployeeName',
                        width: 250
                    },
                    {
                        header: 'Tên gói thầu',
                        binding: 'ProductName',
                        width: 300
                    },
                    {
                        header: 'Vai trò nhân sự',
                        binding: 'PositionName',
                        width: 250
                    },
                    {
                        header: '_Email',
                        binding: 'Email',
                        width: 250
                    },
                    {
                        header: 'Điện thoại',
                        binding: 'Tel',
                        width: 250
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
                            label: "NHÂN SỰ THAM GIA GÓI THẦU",
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
                ]
            }
        }
    ]
}