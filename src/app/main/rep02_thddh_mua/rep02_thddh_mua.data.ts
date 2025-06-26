import { Validators } from "@angular/forms";

export class LayoutData {
    public Layout = [
        {
            key: 'REP01_THDDH_MUA',
            text: 'Bảng tổng hợp giá trị đặt hàng theo tháng',
            command: 'usp_Vth_TongHopDonDatHangTheoNhom',
            ctorArg: { 'Commandkey': 'REP01_THDDH_MUA', 'DocGroup': '1', 'DocCode': 'PO', 'GroupType': '1', 'CurrencyCode0': 'VND', 'Ma_Dvcs': 'C01'},
            nCollapseNodesOnCreate: { '0': 1 },
            outputjson: 0,
            JsonColumnPos: {
                grdReport: 2 //thứ tự xuất hiện cột động tính từ Col 0
            },
            styles: {
                grdReport : {
                    rows : [
                        // {
                        //     expr: "'{EXPR=ItemNo}' == '21'",
                        //     style: {
                        //         color: 'green'
                        //     } 
                        // }
                    ],
                    columns: [
                        // {
                        //     name: 'OriginalAmount',
                        //     style: {
                        //         backgroundColor: 'rgb(192, 255, 192)'
                        //     }
                        // }
                    ]
                }            
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
                    key: 'CustomerCode',
                    lookupKey: 'Customer',
                    label: 'Đối tượng',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%' AND Code IN (SELECT CustomerCode FROM dbo.B20SupplierInfo WHERE IsActive = 1 GROUP BY CustomerCode)",
                    hideValueMember: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'ItemCode',
                    lookupKey: 'Item',
                    label: 'Mặt hàng',
                    lookupfilter: "IsActive=1 AND ClassCode3='TM'",
                    hideValueMember: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'CreatedBy',
                    lookupKey: 'UserList2',
                    label: 'Người lập',
                    lookupfilter: "IsActive=1 AND IsGroup=0 AND Ma_CbNv IN (SELECT EmployeeCode FROM B20ProductHumanPurchase WHERE PositionCode = 'CB-040' AND IsActive = 1 GROUP BY EmployeeCode)",
                    hideValueMember: false
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
                    key: 'ProductCostType',
                    lookupKey: 'Class',
                    label: 'Loại Gói thầu',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='ProductCostType'",
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
                        header: 'Mã đối tác',
                        binding: 'GroupCode',
                        width: 120,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Tên đối tác',
                        binding: 'GroupName',
                        width: 400,
                        isColumnOriginal: true
                    }
                ]
            },
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
                            label: "BẢNG TỔNG HỢP GIÁ TRỊ ĐẶT HÀNG THEO THÁNG",
                            style: "text-align: center;",
                            styleobject: {"text-align": "center","color": "blue","font-size":"14pt"},
                            colspan:12,
                            height:50,
                            col: 1
                        }
                    ],              
                    2: [
                        {
                            label: "Từ ngày: {VAR=FromDateStr} Đến ngày: {VAR=ToDateStr}",
                            style: "text-align: center",
                            styleobject: {"text-align": "center","color": "blue"},
                            col: 1,
                            colspan: 12
                        }
                    ],
                    3: [
                        {
                            label: "Đối tượng: {VAR=CustomerName}",
                            style: "text-align: center",
                            styleobject: {"text-align": "center","color": "blue"},
                            col: 1,
                            colspan: 12
                        }
                    ],                      
                    4: [
                        {
                            label: "Mặt hàng: {VAR=ItemName}",
                            style: "text-align: center",
                            styleobject: {"text-align": "center","color": "blue"},
                            col: 1,
                            colspan: 12
                        }
                    ],
                    5: [
                        {
                            label: "Người lập đơn: {VAR=UserName}",
                            style: "text-align: center",
                            styleobject: {"text-align": "center","color": "blue"},
                            col: 1,
                            colspan: 12
                        }
                    ]
                }
            }
        }
    ]
}