import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'SOL_PlanQuantity',
            text: 'BÁO CÁO TỔNG HỢP KHỐI LƯỢNG',
            command: 'usp_SOL_BaoCaoTongHopKhoiLuong',
            ctorArg: { 'Commandkey': 'SOL_PlanQuantity', 'Ma_Dvcs': 'A01', 'DocCode': 'K8', 'ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}') },
            // subTotals: { '0': 'ProductName,TypeName' },
            // nCollapseNodesOnCreate: { '0': 1 },
            outputjson: 0,
            JsonColumnPos: {
                grdReport: 14
            },
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
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN ('1','3') AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: false,
                    validators: [Validators.required]
                },
                {
                    className: 'LookupBoxInput',
                    key: 'CCMBudgetId',
                    lookupKey: 'CCMBudget',
                    label: 'KLQL Khối lượng',
                    lookupfilter: "ProductCostId = '{EXPR=ProductCostId}' AND IsActive=1 AND DocCode='K8'",// AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                    isContentHtml: false,
                    validators: [Validators.required]
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
                        header: 'Stt',
                        binding: 'ItemNo',
                        width: 100,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Hạng mục',
                        binding: 'ActivityCode',
                        width: 100,
                        isColumnOriginal: true
                    },
                   
                    {
                        header: 'Mã khối lượng',
                        binding: 'JobCode',
                        width: 100,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Công tác',
                        binding: 'JobName',
                        width: 350,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Đvt',
                        binding: 'Unit',
                        width: 80,
                        isColumnOriginal: true
                    },
                    {
                        header: 'KH Khối lượng (CĐT)',
                        binding: 'OriginalAmount',
                        width: 150,
                        format: 'n2',
                        isColumnOriginal: true
                    },
                    {
                        header: 'KH Khối lượng (BCH)',
                        binding: 'PaymentAmount',
                        width: 150,
                        format: 'n2',
                        isColumnOriginal: true
                    },
                    {
                        header: 'KL CLaim được duyệt',
                        binding: 'QuantityClaim',
                        width: 150,
                        format: 'n2',
                        
                        // cssClass: 'main-column',
                        isColumnOriginal: true
                    },
                    {
                        header: 'Tổng KL đã thực hiện',
                        binding: 'Quantity9',
                        width: 150,
                        format: 'n2',
                        isColumnOriginal: true
                    },
                    {
                        header: 'Tổng GT đã thực hiện',
                        binding: 'Amount_Th',
                        width: 150,
                        format: 'n0',
                        isColumnOriginal: true
                    },
                    {
                        header: 'Chênh lệch (CĐT - Đã thực hiện)',
                        binding: 'ChenhLech_CDT_Th',
                        width: 150,
                        format: 'n2',
                        isColumnOriginal: true
                    },
                    {
                        header: 'Chênh lệch (BCH - Đã thực hiện)',
                        binding: 'ChenhLech_BCH_Th',
                        width: 150,
                        format: 'n2',
                        isColumnOriginal: true
                    },
                    {
                        header: 'Chênh lệch (KL Claim dc duyệt - Đã thực hiện)',
                        binding: 'ChenhLech_Claim_Th',
                        width: 150,
                        format: 'n2',
                        isColumnOriginal: true
                    },
                    {
                        header: '% KL đã thực hiện/KL claim dc duyệt',
                        binding: 'RateCLaim',
                        width: 150,
                        format: 'p2',
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
                            label: "TỔNG HỢP KHỐI LƯỢNG",
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