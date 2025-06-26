import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP07_KQT_TDPS',
            text: 'Báo cáo tổng hợp tình trạng thu hồi công nợ',
            command: 'usp_CFMS_BangTinhTrangQuyetToanDuAn',
            ctorArg: { 'Commandkey': 'REP07_KQT_TDPS' },
            subTotals: { '0': 'ProjectManager' },
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
                        width: 60,
                         
                    },
                    {
                        header: 'Dự án/Gói thầu',
                        binding: 'ProductCostId',
                        dataType: 'Array',
                        lookupKey: 'ProductCost',
                        bindingList: {
                            ProductName: 'Description0'
                        },
                        lookupfilter: "ProductType IN ('1','3','2') AND IsGroup = 0 AND IsActive = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}'",
                        hideValueMember: true,
                        width: 0,
                         isReadOnly: 'true'
                    },
                    {
                        header: 'Tên dự án',
                        binding: 'ProductName',
                        width: 400,
                        wordWrap: 'true',
                         isReadOnly: 'true'
                    },
                   
                    // {
                    //     header: 'Gói thầu',
                    //     binding: 'Description0',
                    //     width: 400,
                    //     wordWrap: 'true',
                    //      isReadOnly: 'true'
                    // },
                    
                 
                    {
                        header: 'Tổng',
                        binding: 'Total',
                        dataType: 'Number',
                        isRequired: true,
                        width: 100,
                         isReadOnly: 'true'
                    },
                    {
                        header: 'Đã duyệt',
                        binding: 'Approved',
                        dataType: 'Number',
                        isRequired: true,
                        width: 100,
                         isReadOnly: 'true'
                    },
                    {
                        header: 'Đang trình',
                        binding: 'DangTrinh',
                        dataType: 'Number',
                        isRequired: true,
                        width: 100,
                         isReadOnly: 'true'
                    },
                    {
                        header: 'Chưa trình',
                        binding: 'ChuaTrinh',
                        dataType: 'Number',
                        isRequired: true,
                        width: 100,
                         isReadOnly: 'true'
                    },
                    {
                        header: 'Tỷ lệ đã duyệt/Tổng',
                        binding: 'TyLeDaDuyet',
                        dataType: 'Number',
                        format: 'p2',
                        isRequired: true,
                        min: 0,
                        max: 1,
                        width: 60,
                          isReadOnly: 'true'
                    },
                    {
                        header: 'Đã ký cứng',
                        binding: 'DaKyCung',
                        dataType: 'Number',
                        isRequired: true,
                        width: 100,
                         isReadOnly: 'true'
                    },
                    {
                        header: 'Chưa ký cứng',
                        binding: 'ChuaKyCung',
                        dataType: 'Number',
                        isRequired: true,
                        width: 100,
                         isReadOnly: 'true'
                    },
                    {
                        header: 'Tỷ lệ đã ký/Tổng',
                        binding: 'TyLeDaKy',
                        dataType: 'Number',
                        format: 'p2',
                        isRequired: true,
                        min: 0,
                        max: 1,
                        width: 60,
                          isReadOnly: 'true'
                    },
                    {
                        header: 'Kế hoạch BCH cam kết (kỳ trước)',
                        binding: 'KeHoachBCHKyTruoc',
                        width: 350,
                        wordWrap: 'true',
                         isReadOnly: 'true'
                    },
                    {
                        header: 'Kế hoạch BCH cam kết (kỳ này)',
                        binding: 'KeHoachBCHKyNay',
                        width: 350,
                        wordWrap: 'true'
                    },
                    {
                        header: 'Nguyên nhân chậm trễ',
                        binding: 'Reason',
                        width: 350,
                        wordWrap: 'true'
                    },
                    {
                        header: 'Ghi chú',
                        binding: 'Remark',
                        width: 350,
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