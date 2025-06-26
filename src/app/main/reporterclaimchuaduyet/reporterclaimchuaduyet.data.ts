import { Global } from "../../shared/global";

export class LayoutData{
    public Layout = [
        {
            key: 'REP04_CPCT',
            text: 'Báo cáo tổng hợp Claim trình CĐT nhưng chưa duyệt',
            command: 'usp_GetDataClaim',
           
            
            ctorArg: { 'Commandkey': 'REP04_CPCT'},
            // outputjson: 0,
            bAllowGrandTotal: [0],
            // JsonColumnPos:{
            //     grdReport: 2
            // },
            subTotals: { '0': 'ProjectManager' },
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
                    className: 'DateBoxInput',
                    key: 'DocDate',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    label: 'Đến ngày'
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
                    },
                    {
                        header: 'Số Claim/IPC',
                        binding: 'ClaimNo',
                        width: 110,
                        isColumnOriginal: true
                    },
                    {
                        header: 'KL Tháng',
                        binding: 'Description',
                        width: 110,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Gói thầu',
                        binding: 'DescriptionBiz',
                        width: 110,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Giá trị (Chưa VAT)',
                        binding: 'OriginalWorkAmount',
                        width: 150,
                        isColumnOriginal: true,
                        aggregate:"Sum",
                    },
                    {
                        header: 'Tồn kho đầu tháng',
                        binding: 'TonKho',
                        width: 150,
                        isColumnOriginal: true,
                        aggregate:"Sum",
                    },
                    {
                        header: 'Khối lượng thi công tháng này',
                        binding: 'Amount_ThiCongKyNay',
                        width: 150,
                        isColumnOriginal: true,
                        aggregate:"Sum",
                    },
                    {
                        header: 'Ngày BCH trình',
                        binding: 'ActualDate',
                        width: 100,
                        format: 'dd/MM/yyyy',
                        isColumnOriginal: true
                    },
                    {
                        header: 'Ngày hoàn thành duyệt dự kiến',
                        binding: 'PlanDate',
                        width: 150,
                        format: 'dd/MM/yyyy',
                        isColumnOriginal: true
                    },
                    {
                        header: 'Ngày lập',
                        binding: 'ClaimDate',
                        width: 100,
                        format: 'dd/MM/yyyy',
                        isColumnOriginal: true
                    },
                    {
                        header: 'Loại Claim',
                        binding: 'LoaiClaim',
                        width: 150,
                        isColumnOriginal: true
                    },
                   
                ]
            }
        }
    ]
}