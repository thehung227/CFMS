import { Global } from "../../shared/global";
import { Validators } from "@angular/forms";

export class LayoutData {
    public Layout = [
        {
            key: 'Rep03_SupplierList',
            text: 'Báo cáo danh mục đối tác',
            command: 'usp_TMCtc_REPGetSupplierInfo',
            ctorArg: { 'Commandkey': 'Rep03_SupplierList', 'BranchCode': 'C01'},
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
                            label: "BẢNG KÊ DANH MỤC ĐỐI TÁC",
                            style: "text-align: center;",
                            styleobject: {"text-align": "center","color": "blue","font-size":"14pt"},
                            colspan:12,
                            height:50,
                            col: 1
                        }
                    ],              
                    2: [
                        {
                            label: "Đối tượng: {VAR=CustomerName}",
                            style: "text-align: center",
                            styleobject: {"text-align": "center","color": "blue"},
                            col: 1,
                            colspan: 12
                        }
                    ],                      
                    3: [
                        {
                            label: "Nhóm hàng: {VAR=ItemName}",
                            style: "text-align: center",
                            styleobject: {"text-align": "center","color": "blue"},
                            col: 1,
                            colspan: 12
                        }
                    ],
                    4: [
                        {
                            label: "Khu vực: {VAR=TerritoryName}",
                            style: "text-align: center",
                            styleobject: {"text-align": "center","color": "blue"},
                            col: 1,
                            colspan: 12
                        }
                    ],
                    5: [
                        {
                            label: "Khu vực: {VAR=TerritoryName}",
                            style: "text-align: center",
                            styleobject: {"text-align": "center","color": "blue"},
                            col: 1,
                            colspan: 12
                        }
                    ]
                }
            },
            subTotals: { '0': 'ItemGroupName' },
            nCollapseNodesOnCreate: { '0': 1 },
            data: {
                grdReport: [
                    {
                        header: 'Nhóm hàng',
                        binding: 'ItemGroupCode',
                        width: 100
                    },
                    {
                        header: 'Mã đối tác',
                        binding: 'CustomerCode',
                        width: 100
                    },
                    {
                        header: 'Tên đối tác',
                        binding: 'CustomerName',
                        width: 200
                    },
                    {
                        header: 'Liên hệ',
                        binding: 'ContactPerson',
                        width: 100
                    },
                    {
                        header: 'SĐT',
                        binding: 'PhoneNo',
                        width: 200
                    },
                    {
                        header: 'E-mail',
                        binding: 'Email',
                        width: 100
                    },
                    {
                        header: 'Địa chỉ',
                        binding: 'Address',
                        width: 150
                    },
                    {
                        header: 'Khu vực',
                        binding: 'TerritoryName',
                        width: 100
                    },
                    {
                        header: 'Phân loại',
                        binding: 'ClassCode1',
                        width: 100
                    },
                    {
                        header: 'Xếp hạng năm',
                        binding: 'CustomerRank',
                        width: 120
                    },
                ]
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
                        //     },
                        //     noStyle: {
                        //         backgroundColor: ''
                        //     }
                        // }                        
                    ]
                }            
            },
            parameters: [
                {
                    className: 'LookupBoxInput',
                    key: 'CustomerCode',
                    lookupKey: 'Customer',
                    label: 'Đối tác',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%' AND Code IN (SELECT CustomerCode FROM dbo.B20SupplierInfo WHERE IsActive = 1 GROUP BY CustomerCode)",
                    isContentHtml: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'ItemGroupCode',
                    lookupKey: 'Item',
                    label: 'Nhóm hàng',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND ClassCode3='TM'",
                    isContentHtml: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'TerritoryCode',
                    lookupKey: 'Territory',
                    label: 'Khu vục',
                    lookupfilter: "IsGroup=1 AND IsActive=1 AND Code IN ('NN','VN','MB','MT','MN')",
                    isContentHtml: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'ClassCode1',
                    lookupKey: 'Class',
                    label: 'Phân loại',
                    lookupfilter: "ParentCode = 'Loai_Dt_CCM' AND Code <> 'DTC'",
                    isContentHtml: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'BranchCode',
                    lookupKey: 'Branch',
                    lookupfilter: "Ma_Dvcs ='{VAR=Branch.Ma_Dvcs}'",
                    label: 'Đơn vị',
                    validators: [Validators.required]
                }
            ]
        }
    ]
}