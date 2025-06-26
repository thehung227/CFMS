export class LayoutData{
    public Layout = [
        {
            key: 'REP02_CCM_KHKK',
            text: 'Báo cáo điều chỉnh kế hoạch ký kết',
            command: 'usp_Coteccons_CCM_TheoDoiKeHoachKyKet',
            parameters: [
                // {
                //     className: 'DateBoxInput',
                //     key: 'DocDate1',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     label: 'Từ ngày'
                // },
                // {
                //     className: 'DateBoxInput',
                //     key: 'DocDate2',
                //     type: 'date',
                //     format: 'dd/MM/yyyy',
                //     label: 'Đến ngày'
                // },
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
                    key: 'CCMBudgetId',
                    lookupKey: 'CCMBudget',
                    label: 'Kế hoạch KKHĐ',
                    lookupfilter: "ProductCostId = '{EXPR=ProductCostId}' AND IsGroup=0 AND IsActive=1 AND DocCode='K1' AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR ProductCostId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                    hideValueMember: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'BranchCode',
                    lookupKey: 'Branch',
                    lookupfilter: "Ma_Dvcs ='{VAR=Branch.Ma_Dvcs}'",
                    label: 'Đơn vị'
                }
            ],
            data: {
                grdReport: [
                    {
                        header: 'Thời gian dự kiến ký kết',
                        binding: 'EstimatedTimeDelivery',
                        width: 100,
                        format: 'dd/MM/yyyy'
                    },
                    {
                        header: 'Công tác',
                        binding: 'JobName',
                        width: 300
                    },
                    {
                        header: 'Tên đối tượng',
                        binding: 'CustomerName',
                        width: 200
                    },
                    {
                        header: 'Loại đối tượng',
                        binding: 'Loai_Dt',
                        width: 80
                    },  
                    {
                        header: 'Chức vụ',
                        binding: 'Chuc_Vu',
                        width: 80
                    },                      
                    {
                        header: 'Giá trị ký kết dự kiến (chưa VAT)',
                        binding: 'OriginalAmount',
                        width: 120
                    },
                    {
                        header: 'Giá trị thanh toán dự kiến (chưa VAT)',
                        binding: 'PaymentAmount',
                        width: 120
                    },
                    {
                        header: 'Ghi chú',
                        binding: 'Remark',
                        width: 100
                    },
                    {
                        header: 'Trạng thái',
                        binding: 'Status',
                        width: 100
                    },
                    {
                        header: 'Nội dung sửa',
                        binding: 'StatusRemark',
                        width: 300
                    },
                    {
                        header: 'Ngày tạo',
                        binding: 'CreatedAt',
                        width: 100
                    },
                    {
                        header: 'Ngày sửa',
                        binding: 'ModifiedAt',
                        width: 100
                    }
                ]
            }
        }
    ]
}