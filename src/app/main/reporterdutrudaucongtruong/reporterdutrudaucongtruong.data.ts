import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData{
    public Layout = [
        {
            key: 'REP04_DTDCT',
            text: 'Báo cáo dự trù đầu công trường',
            command: 'usp_BaoCao_DuTruDauCongTruong',
            ctorArg: { 'Commandkey': 'REP04_DTDCT'},
            outputjson: 0,
            
            JsonColumnPos:{
                grdReport: 5
            },
            
            nCollapseNodesOnCreate: { '0': 1 },
            rowHeader: {
                0: [
                    {
                        height: 41
                    },
                    {
                        height: 41
                    }
                ]
            },
            
            parameters: [
                {
                    className: 'LookupBoxInput',
                    key: 'EquiBudgetId',
                    lookupKey: 'EquiBudget',
                    label: 'Dự trù đầu công trường',
                    lookupfilter: "IsActive=1 AND DocCode='M4'",
                    isContentHtml: false,
                    validators: [Validators.required]
                },
              
              
            ],
           
            // summary: {
            //     cols:2,
            //     row: {
            //         0: [
            //             {
            //                 label: "TRƯỞNG PHÒNG THIẾT BỊ",
            //                 style: "color: green;text-align: center",
            //                 styleobject: {"color": "blue","text-align": "center","font-weight": "bold"},
            //                 colspan:12,
            //                 col: 1
            //             }
            //         ]
            //     }
            // },
           
            data: {
                grdReport: [
                    {
                        header: 'STT',
                        binding: 'ItemNo',
                        width: 60,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Mã NCC',
                        binding: 'CustomerCode',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Nhà cung cấp',
                        binding: 'Description',
                        width: 225,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Chi phí',
                        binding: 'Ten_Cp',
                        width: 200,
                        isColumnOriginal: true
                    },
                   
                ]
            }
        }
    ]
}