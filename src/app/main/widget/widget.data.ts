export class LayoutData{
    public static Layout = [
        {
            key: 'REP01_CCM_TCCT',
            text: 'Dự trù công trường',
            command: 'usp_Kct_BaoCaoTaiChinhCongTruong',
            data: {
                grdReport: [
                    {
                        header: 'Stt',
                        binding: 'ItemNo',
                        width: 80
                    },
                    {
                        header: 'Nội dung',
                        binding: 'JobName',
                        width: 200
                    },
                    {
                        header: 'Mã đối tượng',
                        binding: 'CustomerCode',
                        width: 100
                    },
                    {
                        header: 'Tên đối tượng',
                        binding: 'CustomerName',
                        width: 200
                    },
                    {
                        header: 'Giá trị',
                        binding: 'OriginalAmount',
                        width: 150
                    },
                    {
                        header: 'Giá trị điều chỉnh (lần cuối)',
                        binding: 'Amount_DC',
                        width: 150
                    },
                    {
                        header: 'Số hợp đồng',
                        binding: 'DocNo_BizDoc',
                        width: 100
                    },
                    {
                        header: 'Giá trị HĐ + PLHĐ (chưa VAT)',
                        binding: 'Amount_BizDoc',
                        width: 150
                    },
                    {
                        header: 'Giá trị đã thực hiện (chưa VAT)',
                        binding: 'AmountD_TT',
                        width: 150
                    },
                    {
                        header: 'Giá trị thanh toán đã được duyệt (chưa VAT)',
                        binding: 'AmountTH_TTNoVAT',
                        width: 150
                    },
                    {
                        header: 'Giá trị thanh toán đã được duyệt (gồm VAT)',
                        binding: 'AmountTH_TT',
                        width: 150
                    },
                    {
                        header: 'Giá trị quyết toán (chưa VAT)',
                        binding: 'AmountQT',
                        width: 150
                    },
                    {
                        header: 'Ghi chú',
                        binding: 'Ghi_Chu_TT',
                        width: 100
                    },
                    {
                        header: 'Kế toán kiểm tra lợi nhuận công trường',
                        binding: 'AmountLNCT_KT',
                        width: 150
                    },
                    {
                        header: 'Kế toán kiểm tra lợi nhuận kế toán',
                        binding: 'AmountLNKT_KT',
                        width: 150
                    },
                    {
                        header: 'Số liệu kế toán cập nhật',
                        binding: 'Amount_KT',
                        width: 150
                    },
                    {
                        header: 'Chênh lệch số liệu',
                        binding: 'AmountCl_KT',
                        width: 150
                    },
                    {
                        header: 'Ghi chú',
                        binding: 'Ghi_Chu_KT',
                        width: 100
                    }
                ],
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
                        lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN (1,3) AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                        isContentHtml: false
                    },
                    {
                        className: 'LookupBoxInput',
                        key: 'Ma_Dvcs',
                        lookupKey: 'Branch',
                        lookupfilter: "Ma_Dvcs ='{VAR=Branch.Ma_Dvcs}'",
                        label: 'Đơn vị'
                    }
                ]
            }
        }
    ]
}