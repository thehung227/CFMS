import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'REP07_KQT_TDPS',
            text: 'Báo cáo theo dõi phát sinh',
            command: 'usp_Incurred_TongHop',
            ctorArg: { 'Commandkey': 'REP07_KQT_TDPS' },
            subTotals: {},
            nCollapseNodesOnCreate: {},
            parameters: [
               
                {
                    className: 'LookupBoxInput',
                    key: 'ProductCostId',
                    lookupKey: 'ProductCost',
                    label: 'Gói thầu',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType = 1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'Id',
                    lookupKey: 'BizDocVBId',
                    label: 'Version',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductCostId='{EXPR=ProductCostId}'",
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
                        header: 'Số VO',
                        binding: 'IncurredCode',
                        
                        width: 150
                    },
                    {
                        header: 'XD/ME',
                        binding: 'ClassCode1',
                     
                        width: 150,
                    },
                    {
                        header: 'Diễn giải',
                        binding: 'Description',
                        width: 300
                    },
                
                    {
                        header: 'Ngày BCH cam kết'	,
                        binding: 'MeetingBCHDate',
                        dataType: 'Date',
                        format: 'dd/MM/yyyy',
                        width:100							
                    },
                    {
                        header: 'Ghi chú BCH - Họp',
                        binding: 'MeetingRemark',
                        width: 300
                    },
                    {
                        header: 'Ngày bắt đầu thi công'	,
                        binding: 'DateBeginTC',
                        dataType: 'Date',
                        format: 'dd/MM/yyyy',
                        width:100							
                    },
                    {
                        header: '% đã thi công',
                        binding: 'RateTC',
                        dataType: 'Number',
                        width: 80,
                        format: 'p2'
                    },
                    {
                        header: 'Giá trị chưa trình (Chưa VAT)',
                        binding: 'GiaTriChuaTrinh',
                        dataType: 'Number',
                        width: 150,
                        format: 'n0'
                    },
                    {
                        header: 'Giá trị trình (chưa VAT)',
                        binding: 'GiaTriTrinh',
                        dataType: 'Number',
                        width: 150,
                        format: 'n0'
                    },
                    {
                        header: '% đánh giá đạt được (PS đã trình)',
                        binding: 'RateDat',
                        dataType: 'Number',
                        width: 80,
                        format: 'p2'
                    },
                    {
                        header: 'Giá trị đánh giá PS đã trình (Chưa VAT)',
                        binding: 'GiaTriDanhGia',
                        dataType: 'Number',
                        width: 150,
                        format: 'n0'
                    },
                    {
                        header: 'Giá trị PS được duyệt (Chưa VAT)',
                        binding: 'GiaTriPsDaDuyet',
                        dataType: 'Number',
                        width: 150,
                        format: 'n0'
                    },
                    {
                        header: 'Số PLHĐ/ VO đã duyệt ',
                        binding: 'DocNoVODuyet',
                        
                        width: 150
                    },
                    {
                        header: 'Giá trị PS đã trình nhưng chưa duyệt',
                        binding: 'GiaTriDaTrinhChuaDuyet',
                        dataType: 'Number',
                        width: 150,
                        format: 'n0'
                    },
                    // {
                    //     header: 'Kế hoạch tính toán khối lượng'	,
                    //     columns: [
                    //         {
                    //         header: 'Ngày bắt đầu tính toán',
                    //         binding: 'StartDateBudget',
                    //         dataType: 'Date',
                    //         format: 'dd/MM/yyyy',
                    //         width:100	
                    //         },
                    //         {
                    //             header: 'Ngày kết thúc tính toán'	,
                    //             binding: 'EndDateBudget',
                    //             dataType: 'Date',
                    //             format: 'dd/MM/yyyy',
                    //             width:100							
                    //         },
                    //     ]
                       						
                    // },
                    {
                        header: 'Trình duyệt phát sinh'	,
                        columns: [
                            {
                                header: 'Ngày trình duyệt QLKL'	,
                                binding: 'DateQLKL',
                                dataType: 'Date',
                                format: 'dd/MM/yyyy',
                                width:100							
                            },
                            {
                                header: 'Tình trạng QLKL'	,
                                binding: 'StatusQLKL',
                                width:100							
                            },
                            {
                                header: 'Ngày trình duyệt TVGS'	,
                                binding: 'DateTVGS',
                                dataType: 'Date',
                                format: 'dd/MM/yyyy',
                                width:100							
                            },
                            {
                                header: 'Tình trạng TVGS'	,
                                binding: 'StatusTVGS',
                                width:100							
                            },
                            {
                                header: 'Ngày trình duyệt BQL'	,
                                binding: 'DateBQLApprove',
                                dataType: 'Date',
                                format: 'dd/MM/yyyy',
                                width:100							
                            },
                            {
                                header: 'Tình trạng BQL'	,
                                binding: 'StatusBQL',
                                width:100							
                            },
                            {
                                header: 'Ngày trình duyệt CDT'	,
                                binding: 'DateCDT',
                                dataType: 'Date',
                                format: 'dd/MM/yyyy',
                                width:100							
                            },
                            {
                                header: 'Tình trạng CDT'	,
                                binding: 'StatusCDT',
                                width:100							
                            },
                            {
                                header: 'Ngày phê duyệt'	,
                                binding: 'DateApprove',
                                dataType: 'Date',
                                format: 'dd/MM/yyyy',
                                width:100							
                            },
                        ]
                       						
                    },
                    {
                        header: 'Lý do chưa duyệt',
                        binding: 'Reason',
                        isRequired: true,
                        width: 250
                    },
                    {
                        header: 'Kế hoạch hoàn thành'	,
                        binding: 'PlanFinishDate',
                        dataType: 'Date',
                        format: 'dd/MM/yyyy',
                        width:100							
                    },
                    {
                        header: 'Chi tiết kế hoạch',
                        binding: 'PlanDetail',
                        isRequired: true,
                        width: 250
                    },
                    {
                        header: 'Số SI/RFI',
                        binding: 'SIRFINO',
                        isRequired: true,
                        width: 150
                    },
                   
                    {
                        header: 'PS không được duyệt (nhưng có PS chi phí)',
                        binding: 'GiaTriPsKhongDuyet',
                        dataType: 'Number',
                        width: 150,
                        format: 'n0'
                    },
                    {
                        header: 'Giá trị PS đã cập nhật BCTC',
                        binding: 'AmountPSBCTC',
                        dataType: 'Number',
                        width: 150,
                        format: 'n0'
                    },
                    {
                        header: 'Chi phí',
                        binding: 'ChiPhi',
                        dataType: 'Number',
                        width: 150,
                        format: 'n0'
                    },
                    {
                        header: 'TP/NCC',
                        binding: 'CustomerName',
                        width: 300
                    },
                    {
                        header: 'Ghi chú',
                        binding: 'Remark',
                        isRequired: true,
                        width: 200
                    },
                    {
                        header: '_FormatStyleKey',
                        binding: 'Remark',
                        isRequired: true,
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