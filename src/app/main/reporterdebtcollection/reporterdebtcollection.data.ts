import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP07_KQT_TDPS',
            text: 'Báo cáo tổng hợp tình trạng thu hồi công nợ',
            command: 'usp_BCN_BangTongHopTinhHinhThuHoiCongNo',
            ctorArg: { 'Commandkey': 'REP07_KQT_TDPS' },
            subTotals: { '0': 'GroupName,EmployeeName,GroupName1,LoaiClaim' },
            nCollapseNodesOnCreate: {},
            parameters: [
               
                {
                    className: 'LookupBoxInput',
                    key: 'EmployeeCode',
                    lookupKey: 'Employee',
                    label: 'Khối',
                    lookupfilter: "Code IN ('16040221','00050315','00020208','0000002','15581120')",
                    hideValueMember: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'Stt',
                    lookupKey: 'Debt',
                    label: 'Version',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND EmployeeCode='{EXPR=EmployeeCode}'",
                    hideValueMember: false
                }
             
            ],
            data: {
                grdReport: [
                    {
                        header: 'STT',
                        binding: 'ItemNo',
                        
                        width: 100
                    },
                    {
                        header: 'Gói thầu',
                        binding: 'Description0',
                        width: 400,
                        wordWrap: 'true'
                    },
                    {
                        header: 'IPC số',
                        binding: 'ClaimNo',
                        width: 200,
                        wordWrap: 'true',
                    },
                    {
                        header: 'Dự kiến giá trị Quyết toán',
                        binding: 'ContractValue',
                        dataType: 'Number',
                   aggregate: 'Sum',
                        width: 120
                    },
                    {
                        header: 'CĐT đã thanh toán',
                        binding: 'DaThuLuyKe',
                        dataType: 'Number',
                        aggregate: 'Sum',
                        width: 120
                    },
                 
                    {
                        header: '% TT',
                        binding: 'RateTT',
                        dataType: 'Number',
                        format: 'p2',
                 
                        min: 0,
                        max: 1,
                        width: 60
                    },
                    {
                        header: 'Dự kiến số tiền phải thu',
                        binding: 'TienNo',
                        aggregate: 'Sum',
                        dataType: 'Number',
             
                        width: 120
                    },
                    {
                        header: 'Cam kết ký PLHĐ chốt phát sinh'	,
                        binding: 'DatePS',
                        dataType: 'Date',
                      
                        format: 'dd/MM/yyyy',
                        width:100
                    },
                
                    {
                        header: 'Cam kết TOC'	,
                        binding: 'DateTOC',
                        dataType: 'Date',
           
                        format: 'dd/MM/yyyy',
                        width:100							
                    },
                  
                    {
                        header: 'Cam kết ký QT/Xuất HĐ'	,
                        binding: 'DateQT',
                        dataType: 'Date',
               
                        format: 'dd/MM/yyyy',
                        width:100							
                    },
                   
                    {
                        header: 'Ngày đến hạn'	,
                        binding: 'DueDate',
                        dataType: 'Date',
                   
                        format: 'dd/MM/yyyy',
                        width:100,
                        isReadOnly: 'true'						
                    },
                    {
                        header: 'Số ngày quá hạn',
                        binding: 'DateDue',
                        dataType: 'Number',
                   
                        width: 150,
                         isReadOnly: 'true'
                    },
                    {
                        header: 'Ngày cam kết thu hồi công nợ'	,
                        binding: 'CommitmentDate',
                        dataType: 'Date',
               
                        format: 'dd/MM/yyyy',
                        width:140					
                    },
                    {
                        header: 'Lý do/Vướng mắc chưa hoàn thành các mốc cam kết',
                        binding: 'Note',
                        width: 350,
                        wordWrap: 'true'
                    },
                    {
                        header: 'Tên dự án',
                        binding: 'GroupName1',
                        width: 200,
                        wordWrap: 'true'
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
                            label: "TÌNH TRẠNG THU HỒI CÔNG NỢ",
                            style: "text-align: center;",
                            styleobject: { "text-align": "center", "color": "blue", "font-size": "14pt" },
                            colspan: 12,
                            height: 50,
                            col: 1
                        }
                    ],
                    
                   
                }
            },
            formatGroup: {
                grdReport : [
                    {
                        level: 0,
                        style: {color: '#990000', fontWeight:'bold',backgroundColor: 'white'}
                    },
                    {
                        level: 1,
                        style: {color: 'red', fontWeight:'bold',backgroundColor: 'white'}
                    },
                    {
                        level: 2,
                        style: {color: 'blue', fontWeight:'bold',backgroundColor: 'white'}
                    },
                    {
                        level: 3,
                        style: {color: '#00CD00', fontWeight:'bold',backgroundColor: 'white'}
                    },
                    {
                        level: 4,
                        style: {color: 'blue',  fontWeight:'bold',backgroundColor: 'white'}
                    },
                    {
                        level: 5,
                        style: {color: 'blue', fontWeight:'bold',backgroundColor: 'white'}
                    },
                    {
                        level: 6,
                        style: {color: 'blue', fontWeight:'bold', backgroundColor: 'white'}
                    },
                    {
                        level: 7,
                        style: {color: 'blue', fontWeight:'bold',backgroundColor: 'white'}
                    },
                    {
                        level: -1,
                        style: {color: '', fontWeight:'',backgroundColor: ''}
                    }
                ]
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