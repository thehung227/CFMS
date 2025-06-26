import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP07_CLAIM',
            text: 'Báo cáo tổng hợp kế hoạch thu tiền tuần',
            command: 'usp_B30CCMBudget_GetClaimWeek',
            ctorArg: { 'Commandkey': 'REP07_CLAIM' },
            subTotals: { '0': 'ProjectManager,ProductName' },
            bAllowGrandTotal: [0],
            nCollapseNodesOnCreate: {},
            parameters: [
               
                {
                    className: 'LookupBoxInput',
                    key: 'CCMBudgetId',
                    lookupKey: 'TotalBudget',
                    label: 'Đề xuất',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    hideValueMember: false
                }
              
             
            ],
            data: {
                grdReport: [
                    {
                        header: 'Claim',
                        binding: 'ClaimNo',
                        
                        width: 150
                    },
                    {
                        header: 'Hợp đồng',
                        binding: 'BizDocDescription',
                        
                        width: 250
                    },
                    {
                        header: 'Số tiền nợ',
                        binding: 'DebtAmount',
                        dataType: 'Number',
                        width: 150,
                        aggregate:'Sum',
                        format: 'n0'
                    },
                    {
                        header: 'Số ngày quá hạn',
                        binding: 'NumberOfDay',
                        dataType: 'Number',
                        width: 150,
                     
                        format: 'n0'
                    },
                    {
                        header: 'Kế hoạch CĐT thanh toán',
                        binding: 'PlanPaymentAmount',
                        dataType: 'Number',
                        width: 150,
                        aggregate:'Sum',
                        format: 'n0'
                    },
                    {
                        header: 'Ngày CĐT dự kiến TT',
                        binding: 'EstimatedTimeDelivery',
                        isRequired: false,
                        format: 'dd/MM/yyyy',
                        width: 120,
                        dataType: 'Date',
                    },
                    {
                        header: 'Hợp đồng',
                        binding: 'ProjectManger',
                        
                        width: 0
                    },
                    {
                        header: 'Hợp đồng',
                        binding: 'ProductName',
                        
                        width: 0
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