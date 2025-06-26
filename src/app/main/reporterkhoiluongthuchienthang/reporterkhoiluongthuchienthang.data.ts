import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData{
    public Layout = [
        {
            key: 'REP04_CPCT',
            text: 'Báo cáo TP/NCC tháng',
            command: 'usp_Vct_BangTongHopDeNghiThanhToanBill_ThongKeNCC',
           
            
            ctorArg: { 'Commandkey': 'REP04_CPCT', 'ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}')},
            outputjson: 0,
            bAllowGrandTotal: [0],
            JsonColumnPos:{
                grdReport: 11
            },
            subTotals: { '0': 'ProductName' },
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
                {
                    className: 'LookupBoxInput',
                    key: 'ProductCostId',
                    lookupKey: 'ProductCost',
                    label: 'Gói thầu',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN ('1','3') AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: false,
                    validators: [Validators.required]
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
                        header: 'TP/NCC',
                        binding: 'CustomerName',
                        width: 225,
                        isColumnOriginal: true
                    },
                    {
                        header: 'Số HĐ',
                        binding: 'DocNo',
                        width: 150,
                        isColumnOriginal: true
                    },
                    {
                        header: 'CÁC THÔNG TIN CHUNG VỀ DK THANH TOÁN TP/NCC',
                        columns: [
                            {
                                header: 'GIÁ TRỊ (CHƯA VAT)'	,
                                binding: 'Amount_HDPL',
								aggregate:'Sum',
								width:150							
                            },
                            {
                                header: 'GIÁ TRỊ (GỒM VAT)'	,
                                binding: 'Amount_HDPLVAT',
								aggregate:'Sum',
								width:150							
                            },
                            {
                                header: 'CÔNG NỢ'	,
                                binding: 'CongNo',
								width:60
                            },
                            {
                                header: 'TỶ LỆ TẠM ỨNG'	,
                                binding: 'TyLeTU',
								format: 'P2',
								width:90							
                            },
                            {
                                header: 'TỶ LỆ KHẤU TRỪ TU'	,
                                binding: 'TyLeKhaTruTU',
								format: 'P2',
								width:90							
                            },
                            {
                                header: 'TỶ LỆ TT HÀNG KỲ'	,
                                binding: 'TyLeTTKy',
								format: 'P2',
								width:90							
                            },
                            {
                                header: 'TỶ LỆ TT QUYẾT TOÁN'	,
                                binding: 'TyLeTTQT',
								format: 'P2',
								width:90							
                            },
                            {
                                header: 'TỶ LỆ TT TIỀN GIỮ LẠI'	,
                                binding: 'TyLeTTGL',
								format: 'P2',
								width:90							
                            },
                        ]
                    },
                   
                ]
            }
        }
    ]
}