import { Global } from "../../shared/global";
import { Validators } from "@angular/forms";

export class LayoutData {
    public Layout = [
        {
            key: 'REP01_CCM_TENDERSELECTION',
            text: 'Phân tích giá thầu',
            command: 'usp_New_PhanTichHieuQuaDoiTacMoi_Id',
            ctorArg: { 'Commandkey': 'REP01_CCM_TENDERSELECTION', 'ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}'), 'nUserId': Global.convertConfig('{VAR=User.Id}') },
            outputjson: 0,
            totalGrid: 1,
            JsonColumnPos: {
                grdReport: 3
            },
            subTotals: {},
            nCollapseNodesOnCreate: { '1': 0 },
            title: {
                cols:2,
                row: {
                    0: [
                        {
                            label: "",
                            style: "color: green;text-align: center",
                            styleobject: {"color": "blue","text-align": "left"},
                            colspan:12,
                            col: 1
                        }
                    ],
                    1: [
                        {
                            label: "PHÂN TÍCH GIÁ THẦU",
                            style: "text-align: center;",
                            styleobject: {"text-align": "center","color": "blue","font-size":"14pt"},
                            colspan:12,
                            height:50,
                            col: 1
                        }
                    ],
                    2: [
                        {
                            label: "Gói thầu: {VAR=ProductName}",
                            style: "text-align: center",
                            styleobject: {"text-align": "center","color": "blue"},
                            col: 1,
                            colspan: 12
                        }
                    ],                
                    3: [
                        {
                            label: "Từ ngày: {VAR=FromDateStr} Đến ngày: {VAR=ToDateStr}",
                            style: "text-align: center",
                            styleobject: {"text-align": "center","color": "blue"},
                            col: 1,
                            colspan: 12
                        }
                    ],
                    4: [
                        {
                            label: "Số kế hoạch: {VAR=DocNo}",
                            style: "text-align: center",
                            styleobject: {"text-align": "center","color": "blue"},
                            col: 1,
                            colspan: 12
                        }
                    ]
                }
            },
            data: {
                grdReport: [
                   
                    {
                        header: 'Nội dung',
                        binding: 'Description',
                        width: 200,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Giá BĐ',
                        binding: 'GiaBD',
                        width: 150,
                        align: 'right'
                    },
                    {
                        header: 'Giá trị giao thầu',
                        binding: 'GiaTriGiaoThau',
                        width: 150,
                        align: 'right'
                    },
                   
                ]
            },
            styles: {
                grdReport : {
                    rows : [
                     
                    ],
                    columns: [
                      
                        
                    ]
                },
              
            },
            parameters: [
                // {
                //     className: 'DateBoxInput',
                //     key: 'DocDate1',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     label: 'Từ ngày'
                // },
                // {
                //     className: 'DateBoxInput',
                //     key: 'DocDate2',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     label: 'Đến ngày'
                // },
                {
                    className: 'LookupBoxInput',
                    key: 'ProductCostId',
                    lookupKey: 'ProductCost',
                    label: 'Gói thầu',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    isContentHtml: false,
                    validators: [Validators.required]
                },
                {
                    className: 'LookupBoxInput',
                    key: 'BizDocId',
                    lookupKey: 'BizDocVB',
                    label: 'So sánh thầu',
                    lookupfilter: "ProductCostId = '{EXPR=ProductCostId}' AND IsGroup=0 AND IsActive=1 AND DocCode='A5'",
                    isContentHtml: false,
                    validators: [Validators.required]
                },
          
               
            ],
            // summary: {
            //     cols:2,
            //     row: {
            //         0: [
            //             {
            //                 label: "TRƯỞNG PHÒNG CCM                                                                                                                                                 KẾ TOÁN TRƯỞNG",
            //                 style: "color: green;text-align: center",
            //                 styleobject: {"color": "green","text-align": "center"},
            //                 colspan:12,
            //                 col: 1
            //             }
            //         ]
            //     }
            // },
            // formatGroup: {
            //     grdReport : [
            //         {
            //             level: -1,
            //             style: { fontWeight: '' }
            //         },
            //         {
            //             level: 0,
            //             style: {color: 'red', fontWeight:'bold'}
            //         },
            //         {
            //             level: 1,
            //             style: {color: 'green', fontWeight:'bold'}
            //         }
            //     ]
            // },
        }
    ]
}