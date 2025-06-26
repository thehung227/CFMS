import { Global } from "../../shared/global";
import { Validators } from "@angular/forms";

export class LayoutData {
    public Layout = [
        {
            key: 'REP01_CCM_BILLBCH',
            text: 'Báo cáo thanh toán chi phí BCH/PB',
            command: 'usp_B30BizDocCCM_CheckBillBCH',
            ctorArg: { 'Commandkey': 'REP01_CCM_BILLBCH', 'Ma_Dvcs': 'C01', 'ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}') },
            subTotals: {},
            
         
            nCollapseNodesOnCreate: { '0': 1 },
            bAllowGrandTotal: [0],
            parameters: [
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
                    key: 'BizDocId',
                    lookupKey: 'BizDocCCM',
                    label: 'Bill BCH',
                    lookupfilter: 'IsActive=1',
                    
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
                        header: 'Mã công việc',
                        binding: 'ExpenseCatgCode',
                        width: 120,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Tên công việc',
                        binding: 'ExpenseName',
                        width: 200,
                        isColumnOriginal: true
                    },
                  
                    {
                        header: 'Lũy kế tới kỳ trước',
                        binding: 'PaymentAmountKyTruoc',
                        width: 150,
                        isColumnOriginal: true,
                        aggregate: 'Sum'
                    },
                    {
                        header: 'Kỳ này',
                        binding: 'TotalOriginalAmount',
                        width: 150,
                        align: 'right',
                        aggregate: 'Sum'
                    },
                    {
                        header: 'Lũy kế tới kỳ này',
                        binding: 'PaymentAmount',
                        width: 150,
                        isColumnOriginal: true,
                        align: 'right',
                        aggregate: 'Sum'
                    },
                    {
                        header: 'Kỳ này (Gồm VAT)',
                        binding: 'TotalOriginalAmountVAT',
                        width: 150,
                        align: 'right',
                        aggregate: 'Sum'
                    },
                    {
                        header: 'BCTC',
                        binding: 'AmountBCTC',
                        width: 150,
                        isColumnOriginal: true,
                        align: 'right',
                        aggregate: 'Sum'
                    },
                    {
                        header: 'Giá trị Kế toán (Chưa VAT)',
                        binding: 'AmountKeToan',
                        width: 150,
                        isColumnOriginal: true,
                        align: 'right',
                        aggregate: 'Sum'
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
                            label: "BẢNG TỔNG HỢP THANH TOÁN BCH/PB",
                            style: "text-align: center;",
                            styleobject: { "text-align": "center", "color": "blue", "font-size": "14pt" },
                            colspan: 12,
                            height: 50,
                            col: 1
                        }
                    ]
                   
                }
            }
           
        }
    ]
}