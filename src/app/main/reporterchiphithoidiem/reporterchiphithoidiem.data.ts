import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP07_KQT_BCTC',
            text: 'Báo cáo chi phí công trình tại thời điểm',
            command: 'usp_Newtecons_SiteCostReport',
            ctorArg: { 'Commandkey': 'REP07_KQT_CPCTTD', 'BranchCode': 'N01', 'ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}') },
            subTotals: {},
            nCollapseNodesOnCreate: {},
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
                    hideValueMember: false,
                    validators: [Validators.required]
                },
                {
                    className: 'LookupBoxInput',
                    key: 'BranchCode',
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
                        binding: 'ExplanationCode',
                        width: 50
                    },
                    {
                        header: 'DIỄN GIẢI',
                        binding: 'Description',
                        width: 400
                    },
                    {
                        header: 'GIÁ TRỊ TRƯỚC THUẾ',
                        binding: 'ThisPeriod',
                        width: 120
                    },
                    {
                        header: 'THUẾ VAT',
                        binding: 'ThisPeriodVAT',
                        width: 120
                    },
                    {
                        header: 'TỔNG PHẢI TRẢ',
                        binding: 'ThisPeriodTotal',
                        width: 120
                    },
                    {
                        header: 'TỔNG SỐ TIỀN ĐÃ THANH TOÁN',
                        binding: 'YTD',
                        width: 120
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
                            label: "BÁO CÁO CHI PHÍ THEO CÔNG TRÌNH TẠI THỜI ĐIỂM",
                            style: "text-align: center;",
                            styleobject: { "text-align": "center", "color": "blue", "font-size": "14pt" },
                            colspan: 12,
                            height: 50,
                            col: 1
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