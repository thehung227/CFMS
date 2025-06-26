import { Global } from "../../shared/global";
import { Validators } from "@angular/forms";

export class LayoutData {
    public Layout = [
        {
            key: 'Rep03_MenuList',
            text: 'Báo cáo danh mục Newtecons',
            command: 'usp_GetDataFromTable',
            ctorArg: { 'Commandkey': 'Rep03_MenuList'},
            title: {
                cols:2,
                row: {
                    0: [
                        {
                            label: "DANH MỤC NEWTECONS",
                            style: "color: green;text-align: center",
                            styleobject: {"text-align": "center","color": "blue","font-size":"14pt"},
                            colspan:2,
                            col: 1
                        }
                    ]
                }
            },
            data: {
                grdReport: [
                    {
                        header: 'Mã',
                        binding: 'Code',
                        width: 100
                    },
                    {
                        header: 'Tên',
                        binding: 'Name',
                        width: 350
                    },
                    {
                        header: 'MST',
                        binding: 'TaxRegNo',
                        width: 350
                    }
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
                    key: 'LookupKey',
                    lookupKey: 'LookupExport',
                    label: 'Danh mục',
                    isContentHtml: false
                },
            ]
        }
    ]
}