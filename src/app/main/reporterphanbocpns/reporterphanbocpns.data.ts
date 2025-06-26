import { Global } from "../../shared/global";

export class LayoutData{
    public Layout = [
        {
            key: 'REP04_DTTCN',
            text: 'Báo cáo phân bổ chi phí nhân sự',
            command: 'usp_BangPhanBoChiPhiNhanSu',
           
            
            ctorArg: { 'Commandkey': 'REP04_DTTCN'},
            outputjson: 0,
            bAllowGrandTotal: [0],
            JsonColumnPos:{
                grdReport: 30
            },
            subTotals: { '0': 'EmployeeName' },
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
                    label: 'Từ ngày'
                },
                {
                    className: 'DateBoxInput',
                    key: 'DocDate2',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    label: 'Đến ngày'
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
                        header: 'TÊN DỰ ÁN/GÓI THẦU',
                        binding: 'ProductCostName',
                        width: 250,
                        isColumnOriginal: true
                    },
                    {
                        header: 'THỰC TẾ P.KẾ TOÁN',
                        binding: 'Total01',
                        dataType: 'Number',
                        width: 150,
                        format: 'n0',
                        isColumnOriginal: true
                    },
                    {
                        header: 'CHÊNH LỆCH PKTVÀ PHÂN BỔ',
                        binding: 'Total02',
                        dataType: 'Number',
                        width: 150,
                        format: 'n0',
                        isColumnOriginal: true
                    },
                    {
                        header: 'TỔNG PHÂN BỔ (XD+MEP)',
                        binding: 'Total03',
                        dataType: 'Number',
                        width: 150,
                        format: 'n0',
                        isColumnOriginal: true
                    },
                    {
                        header: 'XD',
                        binding: 'Total04',
                        dataType: 'Number',
                        width: 150,
                        format: 'n0',
                        isColumnOriginal: true
                    },
                    {
                        header: 'ME',
                        binding: 'Total05',
                        dataType: 'Number',
                        width: 150,
                        format: 'n0',
                        isColumnOriginal: true
                    },
                    {
                        header: 'TỔNG NS TRUNG BÌNH (XD+MEP)',
                        binding: 'Total06',
                        dataType: 'Number',
                        width: 150,
                        format: 'n0',
                        isColumnOriginal: true
                    },
                    {
                        header: 'NS TRUNG BÌNH XD',
                        binding: 'Total07',
                        dataType: 'Number',
                        width: 150,
                        format: 'n0',
                        isColumnOriginal: true
                    },
                    {
                        header: 'NS TRUNG BÌNH MEP',
                        binding: 'Total08',
                        dataType: 'Number',
                        width: 150,
                        format: 'n0',
                        isColumnOriginal: true
                    },
                    {
                        
                        header: 'THỐNG KẾ CHI PHÍ XD'	,
                        columns: [
                            {
                                header: '1.Lương và PC XD',
                                binding: 'AmountXD01',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                            {
                                header: '2.BHXH',
                                binding: 'AmountXD02',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                            {
                                header: '3.Kinh phí CĐ',
                                binding: 'AmountXD03',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                            {
                                header: '4.Thưởng',
                                binding: 'AmountXD04',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                            {
                                header: '5.PC Cơm',
                                binding: 'AmountXD05',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                            {
                                header: '6.Hỗ trợ: Tạm hoãn, nghĩ việc/thôi việc',
                                binding: 'AmountXD06',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                            {
                                header: '7.Du lịch(nghỉ việc)',
                                binding: 'AmountXD07',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                            {
                                header: '8.Dự phòng 1',
                                binding: 'AmountXD08',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                            {
                                header: '9.Dự phòng 2',
                                binding: 'AmountXD09',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                            {
                                header: '10.Nhân sự',
                                binding: 'AmountXD10',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                        ]
                       						
                    },
                    {
                        header: 'THỐNG KẾ CHI PHÍ ME'	,
                        columns: [
                            {
                                header: '1.Lương và PC ME',
                                binding: 'AmountME01',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                            {
                                header: '2.BHXH',
                                binding: 'AmountME02',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                            {
                                header: '3.Kinh phí CĐ',
                                binding: 'AmountME03',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                            {
                                header: '4.Thưởng',
                                binding: 'AmountME04',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                            {
                                header: '5.PC Cơm',
                                binding: 'AmountME05',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                            {
                                header: '6.Hỗ trợ: Tạm hoãn, nghĩ việc/thôi việc',
                                binding: 'AmountME06',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                            {
                                header: '7.Du lịch(nghỉ việc)',
                                binding: 'AmountME07',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                            {
                                header: '8.Dự phòng 1',
                                binding: 'AmountME08',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                            {
                                header: '9.Dự phòng 2',
                                binding: 'AmountME09',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                            {
                                header: '10.Nhân sự',
                                binding: 'AmountME10',
                                dataType: 'Number',
                                width: 150,
                                format: 'n0',
                                isColumnOriginal: true
                            },
                        ]
                       						
                    },
                ]
            }
        }
    ]
}