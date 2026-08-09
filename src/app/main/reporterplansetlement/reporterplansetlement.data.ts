import { Global } from "../../shared/global";
import { Validators } from "@angular/forms";

export class LayoutData {
    public Layout = [
        {
            key: 'REP01_CCM_KHQT',
            text: 'Báo cáo kế hoạch quyết toán NTP/NCC',
            command: 'usp_Kct_BaoCaoTaiChinhCongTruong_THQT_VoucherForm',
            ctorArg: { 'Commandkey': 'REP01_CCM_KHQT', 'ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}')},
    
            totalGrid: 3,
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
                            label: "BÁO CÁO KẾ HOẠCH QUYẾT TOÁN NTP/NCC",
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
                        width: 300,
                        isColumnOriginal: true
                    },
                     {
                        header: 'HĐ Nguyên tắc',
                        binding: 'CurrentInventory',
                        dataType: 'Number',
                        width: 100,
                         isColumnOriginal: true
                    
                    },
                    {
                        header: 'HĐ dự án',
                        binding: 'RequestQuantity',
                        dataType: 'Number',
                        width: 100,
                         isColumnOriginal: true
                    
                    },
                    {
                        header: 'NSC',
                        binding: 'TransferedQuantity',
                        dataType: 'Number',
                        width: 100,
                         isColumnOriginal: true
                    
                    },
                    {
                        header: 'Tổng',
                        binding: 'Quantity',
                        dataType: 'Number',
                        width: 100,
                        isColumnOriginal: true
                    
                    },
                   
                   
                ],
                grdReport1 :[
                    {
                        header: 'STT',
                        binding: 'ItemNo',
                        isRequired: true,
                        width: 100,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Mã NTP/NCC',
                        binding: 'CustomerCode',
                        isRequired: true,
                        dataType: 'Array',
                        lookupKey: 'Customer_CCM2',
                        bindingList: {
                            NameBinding: 'CustomerName'
                        },
                        lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
                        width: 100,
                        isColumnOriginal: true
                        // validators: "{EXPR=CustomerCode} == ''",
                        // validatorMessage: 'Mã đối tượng, không được bỏ trắng giá trị',
                        // ignoreError: 1
                    },
                    {
                        header: 'Tên NTP/NCC',
                        binding: 'CustomerName',
                        width: 300,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Id hợp đồng',
                        binding: 'BizDocId_C1',
                        width: 0,
                        dataType: 'Array',
                        isColumnOriginal: true,
                        lookupKey: 'BizDoc2',
                        bindingList: {
                            DocInfo: 'DocInfo',
                            ContractType: 'ContractType'
                        },
                        // displayMember: 'DocInfo',
                        // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
                        lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14','HD-07') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
                    },
                    {
                        header: 'Thông tin hợp đồng',
                        binding: 'DocInfo',
                        width: 200,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Nội dung HĐ',
                        binding: 'Description',
                        width: 300,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Loại hợp đồng',
                        binding: 'ContractType',
                        width: 100,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Hạn mức BCTC',
                        binding: 'OriginalAmount',
                        dataType: 'Number',
                        width: 0,
                        isColumnOriginal: true,
                        validators: "{EXPR=OriginalAmount} < {EXPR=AmountPaid} && {EXPR=AmountPaid} != 0",
                        validatorMessage: 'Giá trị dự trù không được nhỏ hơn giá trị đã thực hiện',
                        ignoreError: 1
                    },
                    {
                        header: 'Ngày duyệt bill cuối',
                        binding: 'EstimatedCompletionDesign',
                        dataType: 'Date',
                        format: 'dd/MM/yyyy',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Kế hoạch trình',
                        binding: 'EstimatedTimeDelivery',
                        width: 150,
                        dataType: 'Date',
                        format: 'dd/MM/yyyy',
                        isRequired: false	
                    },
                    {
                        header: 'Số lần cập nhật',
                        binding: 'SoLanThayDoi',
                        dataType: 'Number',
                        width: 100,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Số tháng delay so với KH01',
                        binding: 'SoThangThayDoi',
                        dataType: 'Number',
                        width: 100,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Tên NTP/NCC',
                        binding: 'JobName',
                        width: 0,
                        isColumnOriginal: true
                    },
                ],

                  grdReport2 :[
                    {
                        header: 'STT',
                        binding: 'ItemNo',
                        isRequired: true,
                        width: 100,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Mã NTP/NCC',
                        binding: 'CustomerCode',
                        isRequired: true,
                        dataType: 'Array',
                        lookupKey: 'Customer_CCM2',
                        bindingList: {
                            NameBinding: 'CustomerName'
                        },
                        lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
                        width: 100,
                        isColumnOriginal: true
                        // validators: "{EXPR=CustomerCode} == ''",
                        // validatorMessage: 'Mã đối tượng, không được bỏ trắng giá trị',
                        // ignoreError: 1
                    },
                    {
                        header: 'Tên NTP/NCC',
                        binding: 'CustomerName',
                        width: 300,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Id hợp đồng',
                        binding: 'BizDocId_C1',
                        width: 0,
                        dataType: 'Array',
                        isColumnOriginal: true,
                        lookupKey: 'BizDoc2',
                        bindingList: {
                            DocInfo: 'DocInfo',
                            ContractType: 'ContractType'
                        },
                        // displayMember: 'DocInfo',
                        // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND (CompletedApprove=1 OR DocStatus=4) AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1) OR DocCode='C2') AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
                        lookupfilter: "((DocCode = 'C3' AND (ProductCostId='{EXPR=ProductCostId}' OR ProductCostId0='{EXPR=ProductCostId}') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND ContractType IN ('HD-10','HD-14','HD-07') AND CustomerCode = '{EXPR=CustomerCode}') OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
                    },
                    {
                        header: 'Thông tin hợp đồng',
                        binding: 'DocInfo',
                        width: 200,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Nội dung HĐ',
                        binding: 'Description',
                        width: 300,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Loại hợp đồng',
                        binding: 'ContractType',
                        width: 100,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Hạn mức BCTC',
                        binding: 'OriginalAmount',
                        dataType: 'Number',
                        width: 0,
                        isColumnOriginal: true,
                        validators: "{EXPR=OriginalAmount} < {EXPR=AmountPaid} && {EXPR=AmountPaid} != 0",
                        validatorMessage: 'Giá trị dự trù không được nhỏ hơn giá trị đã thực hiện',
                        ignoreError: 1
                    },
                    {
                        header: 'Ngày duyệt bill cuối',
                        binding: 'Remark',
                        dataType: 'Date',
                        format: 'dd/MM/yyyy',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Kế hoạch hoàn thành ký',
                        binding: 'EstimatedTimeDelivery',
                        width: 150,
                        dataType: 'Date',
                        format: 'dd/MM/yyyy',
                        isRequired: false	
                    },
                    {
                        header: 'Số lần cập nhật',
                        binding: 'SoLanThayDoi',
                        dataType: 'Number',
                        width: 100,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Số tháng delay so với KH01',
                        binding: 'SoThangThayDoi',
                        dataType: 'Number',
                        width: 100,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Tên NTP/NCC',
                        binding: 'JobName',
                        width: 0,
                        isColumnOriginal: true
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
                grdReport1 : { 
                    rows : [
                    ],
                    columns: [
                      
                    ]
                }          
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
                    key: 'CCMBudgetId',
                    lookupKey: 'CCMBudget',
                    label: 'Kế hoạch DTCP',
                    lookupfilter: "ProductCostId = '{EXPR=ProductCostId}' AND IsGroup=0 AND IsActive=1 AND DocCode='S2' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                    isContentHtml: false,
                    validators: [Validators.required]
                },
                // {
                //     className: 'TextBoxInput',
                //     key: 'Account',
                //     label: 'Tài khoản',
                // },
              
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