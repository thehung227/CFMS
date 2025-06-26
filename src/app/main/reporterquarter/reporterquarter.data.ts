import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP07_DXTCQ',
            text: 'Báo cáo đề xuất chi tiền Quý',
            command: 'usp_B30BizDocVB_DeXuatThuChiQuy',
            ctorArg: { 'Commandkey': 'REP07_DXTCQ' },
            subTotals: {},
            outputjson: 0,
            bAllowGrandTotal: [0],
            JsonColumnPos:{
                grdReport: 2
            },
        
            nCollapseNodesOnCreate: {},
            parameters: [
               
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
                    key: 'BizDocId',
                    lookupKey: 'BizDocVB',
                    label: 'Version',
                    lookupfilter: "IsActive=1 AND ProductCostId = '{VAR=Filter.ProductCostId}'",
                    hideValueMember: false
                }
              
             
            ],
            data: {
                grdReport: [
                    {
                        header: 'Mã ưu tiên chi',
                        binding: 'CodeKHC',
                        
                        width: 150
                    },
                    {
                        header: 'Đối tượng',
                        binding: 'CustomerName',
                        
                        width: 250
                    },
                    {
                        header: 'Hợp đồng',
                        binding: 'ContractNo',
                     
                        width: 150,
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
                            label: "BÁO CÁO THEO DÕI PHÁT SINH",
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
            // formatGroup: {
            //     grdReport: [
            //         {
            //             level: -1,
            //             style: { fontWeight: '' }
            //         },
            //         {
            //             level: 0,
            //             style: { fontWeight: 'bold' }
            //         },
            //         {
            //             level: 1,
            //             style: { fontWeight: 'bold' }
            //         }
            //     ]
            // }
        }
    ]
}