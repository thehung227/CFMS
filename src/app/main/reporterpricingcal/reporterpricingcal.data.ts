export class LayoutData{
    public Layout = [
        {
            key: 'CTC_TinhGia_TM',
            text: 'Bảng tính giá vật tư thu mua',
            command: 'usp_Coteccons_TinhGiaVatTu',
            parameters: [
                {
                    className: 'DateBoxInput',
                    key: 'DocDate',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    label: 'Ngày tính'
                },
                {
                    className: 'LookupBoxInput',
                    key: 'ProductCostId',
                    lookupKey: 'ProductCost',
                    label: 'Gói thầu',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType = 1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    isContentHtml: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'ItemGroupCode',
                    lookupKey: 'Item',
                    label: 'Nhóm hàng',
                    lookupfilter: "IsActive=1 AND IsGroup=1",
                    isContentHtml: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'BizDocId',
                    lookupKey: 'BizDoc_CTC',
                    label: 'Phiếu đề nghị',
                    lookupfilter: "IsActive=1 AND DocCode='PP' AND ProductCostId='{EXPR=ProductCostId}'",
                    isContentHtml: false
                },
                {
                    className: 'CheckBoxInput',
                    key: 'CreatePO',
                    label: 'Tạo đơn hàng mua sau khi tính giá'
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
                        header: 'Mã vật tư',
                        binding: 'ItemCode',
                        width: 80
                    },
                    {
                        header: 'Tên vật tư',
                        binding: 'ItemName',
                        width: 200
                    },
                    {
                        header: 'Số lượng',
                        binding: 'Quantity9',
                        width: 100,
                        format: 'n2'
                    },
                    {
                        header: 'Tên đối tượng',
                        binding: 'CustomerName',
                        width: 200
                    },
                    {
                        header: 'Hòa Phát',
                        binding: 'HOAPHAT',
                        width: 80
                    },  
                    {
                        header: 'Miền Nam',
                        binding: 'MIENNAM',
                        width: 80
                    },                      
                    {
                        header: 'POMINA',
                        binding: 'POMINA',
                        width: 100
                    },
                    {
                        header: 'POSCO',
                        binding: 'POSCO',
                        width: 100
                    },
                    {
                        header: 'Giá nhỏ nhất',
                        binding: 'MinPrice',
                        width: 100
                    }
                ],
                grdReport1: [
                    {
                        header: 'Mã vật tư',
                        binding: 'ItemCode',
                        width: 80
                    },
                    {
                        header: 'Tên vật tư',
                        binding: 'ItemName',
                        width: 200
                    },
                    {
                        header: 'Số lượng',
                        binding: 'Quantity9',
                        width: 100,
                        format: 'n2'
                    },
                    {
                        header: 'Tên đối tượng',
                        binding: 'CustomerName',
                        width: 200
                    },
                    {
                        header: 'Thương hiệu',
                        binding: 'TradeMarkCode',
                        width: 80
                    },  
                    {
                        header: 'Đơn giá',
                        binding: 'OriginalUnitCost',
                        width: 100
                    }
                ],
                grdReport2: [
                    {
                        header: 'Ngày',
                        binding: 'DocDate',
                        width: 80,
                        format: 'dd/MM/yyyy'
                    },
                    {
                        header: 'Số đơn hàng',
                        binding: 'DocNo',
                        width: 100
                    },
                    {
                        header: 'Tên đối tượng',
                        binding: 'CustomerName',
                        width: 200
                    },
                    {
                        header: 'Mã vật tư',
                        binding: 'ItemCode',
                        width: 80
                    },
                    {
                        header: 'Tên vật tư',
                        binding: 'ItemName',
                        width: 200
                    },
                    {
                        header: 'Số lượng',
                        binding: 'Quantity9',
                        width: 100,
                        format: 'n2'
                    }
                ]
            }
        }
    ]
}