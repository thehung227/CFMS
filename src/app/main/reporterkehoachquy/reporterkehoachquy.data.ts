import { Global } from "../../shared/global";

export class LayoutData{
    public Layout = [
        {
            key: 'REP04_CPCT',
            text: 'Báo cáo so sánh kế hoạch theo quý (DT, Dòng tiền)',
            command: 'usp_CCM_BcDoanhThuChiPhi_TheoQuy',
           
            
            ctorArg: { 'Commandkey': 'REP04_CPCT'},
            outputjson: 0,
            bAllowGrandTotal: [0],
            JsonColumnPos:{
                grdReport: 2
            },
            subTotals: { '0': 'ProjectManager' },
            nCollapseNodesOnCreate: { '0': 1 },
            rowHeader: {
                0: [
                    {
                        height: 41
                    },
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
                    className: 'DateBoxInput',
                    key: 'DocDate1',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    label: 'Đến Tháng 1'
                },
                {
                    className: 'DateBoxInput',
                    key: 'DocDate2',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    label: 'Đến Tháng 2'
                },
                {
                    className: 'DateBoxInput',
                    key: 'DocDate3',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    label: 'Đến Tháng 3'
                },
                {
                    className: 'LookupBoxInput',
                    key: 'TypeBaoCao',
                    lookupKey: 'Class',
                    label: 'Loại báo cáo',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='SSQUY'",
                    hideValueMember: false
                }
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
                        binding: '_Stt',
                        width: 60,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Công Trình',
                        binding: 'ProductName',
                        width: 225,
                        isColumnOriginal: true
                    }
                   
                ]
            }
        }
    ]
}