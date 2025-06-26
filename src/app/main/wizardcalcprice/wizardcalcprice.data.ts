import { lang } from "moment";

export class LayoutData {
    public static Layout = [
        {
            key: 'WIZARD_CTC_TINHGIA',
            text: 'Tính giá mua hàng',
            parameters: [
                {
                    className: 'DateBoxInput',
                    key: 'DocDate1',
                    type: 'date',
                    format: 'dd/MM/yyyy',
                    label: 'Ngày hiệu lực'
                },
                {
                    className: 'LookupBoxInput',
                    key: 'ProductCostId',
                    lookupKey: 'Project2',
                    type: 'lookup',
                    label: 'Hạng mục',
                    isReadOnly: 'true'
                },
                {
                    className: 'LookupBoxInput',
                    key: 'ProductCostId0',
                    lookupKey: 'ProductCost',
                    type: 'lookup',
                    label: 'Báo giá cho gói thầu',
                    lookupfilter: "IsActive=1 AND ProductType=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND RowId IN (SELECT ProductCostId1 FROM B20Project WHERE RowId = '{EXPR=ProductCostId}' AND IsActive=1)",
                },
                {
                    className: 'MultiSelectInput',
                    key: 'CustomerCode',
                    lookupKey: 'Customer_CCM2',
                    type: 'lookup',
                    label: 'Nhà cung cấp được chọn',
                    lookupfilter: "Code IN (SELECT CustomerCode FROM B30BizDoc WHERE ItemGroupCode = '{EXPR=ItemGroupCode}' AND DocCode = 'QR' AND IsActive=1 AND EffectiveDate >= '{EXPR=DocDate1}') AND ParentId IN (8,9,12) AND IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
                },
                {
                    className: 'MultiSelectInput',
                    key: 'TradeMarkCode',
                    lookupKey: 'TradeMark',
                    type: 'lookup',
                    label: 'Thương hiệu được chọn',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ItemGroupCode = '{EXPR=ItemGroupCode}' AND (Code IN (SELECT t.Val FROM dbo.B20ProductTradeMark OUTER APPLY dbo.ufn_sys_SplitString(TradeMarkCode,',') t WHERE ProductCostId='{EXPR=ProductCostId}') OR '{EXPR=ProductCostId}'='')",
                },
                {
                    className: 'TextBoxInput',
                    key: 'ItemGroupCode',
                    type: 'text',
                    label: 'Nhóm hàng',
                    isDisabled: 'true',
                    isReadOnly: 'true'
                },
                {
                    className: 'LookupBoxInput',
                    key: 'BranchCode',
                    lookupKey: 'Branch',
                    type: 'lookup',
                    lookupfilter: "Ma_Dvcs ='{VAR=Branch.Ma_Dvcs}'",
                    label: 'Đơn vị',
                    isReadOnly: 'true'
                },
                {
                    className: 'LookupBoxInput',
                    key: 'UserName',
                    lookupKey: 'UserListWeb',
                    type: 'lookup',
                    label: 'Chuyên viên tính giá',
                    isReadOnly: 'true'
                },
                {
                    className: 'LookupBoxInput',
                    key: 'BizDocId',
                    lookupKey: 'BizDoc_CTC',
                    type: 'lookup',
                    lookupfilter: "DocCode = 'PP' AND IsActive=1",
                    label: 'Đề nghị được chọn',
                    isReadOnly: 'true',
                    hideValueMember: true,
                }
            ],
            filterGrid: {
                command: 'usp_TMCtc_SupplierQuotations',
                parameters: 'DocDate1,CustomerCode,BranchCode,BizDocId,ProductCostId0',
                gridFilter: [
                    {
                        header: 'Chọn',
                        binding: 'SelectRow',
                        width: 50,
                        dataType: 'Boolean'
                    },
                    {
                        header: 'BizDocId',
                        binding: 'BizDocId',
                        width: 0,
                    },
                    {
                        header: 'Ngày báo giá',
                        binding: 'DocDate',
                        width: 120,
                        dataType: 'Date',
                        format: 'dd/MM/yyyy',
                        isReadOnly: 'true'
                    },
                    {
                        header: 'Ngày hiệu lực',
                        binding: 'EffectiveDate',
                        width: 120,
                        dataType: 'Date',
                        format: 'dd/MM/yyyy',
                        isReadOnly: 'true'
                    },
                    {
                        header: 'Số báo giá',
                        binding: 'DocNo',
                        width: 150,
                        isReadOnly: 'true'
                    },
                    {
                        header: 'Nhà cung cấp',
                        binding: 'CustomerName',
                        width: 350,
                        isReadOnly: 'true'
                    },
                    {
                        header: 'BG giữ giá',
                        binding: 'IsFixPrice',
                        width: 120,
                        dataType: 'Boolean',
                        isReadOnly: 'true'
                    },
                    {
                        header: 'Loại báo giá',
                        binding: 'LoaiBaoGia',
                        width: 150,
                        isReadOnly: 'true'
                    },
                    {
                        header: 'Dự án',
                        binding: 'TenDuAn',
                        width: 350,
                        isReadOnly: 'true'
                    },
                    {
                        header: 'File báo giá',
                        binding: 'FilePath',
                        width: 200,
                        isReadOnly: 'true'
                    },
                    {
                        header: 'Ghi chú',
                        binding: 'Description',
                        width: 350,
                        isReadOnly: 'true'
                    }
                ]
            },
            nextEdit: {
                command: 'usp_TMCtc_SoSanhGia',
                tablename: 'B30BizDocQR',
                griddata: 0,
                constraintkey: 'BizDocId,TradeMarkCode,BranchCode,UserName',
                style: [
                    {
                        Table: 1,
                        TableName: 'gridEditor',
                        type: 'MINROW',
                        exprRow: "{EXPR=_FormatStyleKey} == 1",
                        columnStart: 2,
                        css: ''
                    },
                    {
                        Table: 4,
                        TableName: 'gridEditor3',
                        type: 'MINROW',
                        exprRow: "1==1",
                        columnStart: 2,
                        css: ''
                    },
                    {
                        Table: 6,
                        TableName: 'gridEditor5',
                        type: '',
                        exprRow: "1==1",
                        columnStart: 5,
                        css: ''
                    }
                ],
                data: {
                    gridEditor: [
                        {
                            header: 'Mã vật tư',
                            binding: 'ItemCode',
                            width: 100,
                            dataType: 'String'
                        },
                        {
                            header: 'Nhà cung cấp',
                            binding: 'CustomerName',
                            width: 350,
                        }
                    ],
                    gridEditor1: [
                        {
                            header: 'Chọn',
                            binding: 'ColCheck',
                            width: 50,
                            dataType: 'Boolean'
                        },
                        {
                            header: 'Mã vật tư',
                            binding: 'ItemCode',
                            width: 100,
                            dataType: 'String'
                        },
                        // {
                        //     header: 'Số lượng',
                        //     binding: 'Quantity9',
                        //     width: 100,
                        //     dataType: 'Number'
                        // },
                        // {
                        //     header: 'Quy đổi',
                        //     binding: 'Quantity8',
                        //     width: 100,
                        //     dataType: 'Number'
                        // },
                        {
                            header: 'Nhà cung cấp',
                            binding: 'CustomerName',
                            width: 350,
                        },
                        {
                            header: 'Thương hiệu',
                            binding: 'TradeMarkCode',
                            width: 100,
                        },
                        {
                            header: 'Đơn giá',
                            binding: 'OriginalUnitCost',
                            width: 100,
                            dataType: 'Number'
                        },
                        {
                            header: 'Thành tiền',
                            binding: 'OriginalAmount',
                            width: 100,
                            dataType: 'Number',
                            aggregate: 'Sum'
                        },
                        {
                            header: '_RowId',
                            binding: 'RowId',
                            width: 0,
                            isReadOnly: 'true'
                        },
                        {
                            header: 'Stt',
                            binding: 'BuiltinOrder',
                            width: 0,
                            dataType: 'Number',
                            isReadOnly: 'true'
                        }
                    ],
                    gridEditor2: [
                        {
                            header: 'Mã vật tư',
                            binding: 'ItemCode',
                            width: 150,
                            dataType: 'String'
                        },
                        // {
                        //     header: 'Số lượng',
                        //     binding: 'Quantity9',
                        //     width: 100,
                        //     dataType: 'Number'
                        // },
                        // {
                        //     header: 'Quy đổi',
                        //     binding: 'Quantity8',
                        //     width: 100,
                        //     dataType: 'Number'
                        // },
                        {
                            header: 'Nhà cung cấp',
                            binding: 'CustomerCode',
                            width: 350,
                        },
                        {
                            header: 'Thương hiệu',
                            binding: 'TradeMarkCode',
                            width: 100,
                        },
                        {
                            header: 'Đơn giá',
                            binding: 'OriginalUnitCost',
                            width: 100,
                            dataType: 'Number'
                        }
                    ],
                    gridEditor3: [
                        {
                            header: 'Mã vật tư',
                            binding: 'ItemCode',
                            width: 150,
                            dataType: 'String'
                        },
                        // {
                        //     header: 'Số lượng',
                        //     binding: 'Quantity9',
                        //     width: 100,
                        //     dataType: 'Number'
                        // },
                        // {
                        //     header: 'Quy đổi',
                        //     binding: 'Quantity8',
                        //     width: 100,
                        //     dataType: 'Number'
                        // },
                        {
                            header: 'Nhà cung cấp',
                            binding: 'CustomerName',
                            width: 350,
                        }
                    ],
                    gridEditor4: [
                        // {
                        //     header: 'Chọn',
                        //     binding: 'ColCheck',
                        //     width: 50,
                        //     dataType: 'Boolean'
                        // },
                        {
                            header: 'Mã vật tư',
                            binding: 'ItemCode',
                            width: 100,
                            dataType: 'String'
                        },
                        // {
                        //     header: 'Số lượng',
                        //     binding: 'Quantity9',
                        //     width: 100,
                        //     dataType: 'Number'
                        // },
                        // {
                        //     header: 'Quy đổi',
                        //     binding: 'Quantity8',
                        //     width: 100,
                        //     dataType: 'Number'
                        // },
                        {
                            header: 'Nhà cung cấp',
                            binding: 'CustomerName',
                            width: 350,
                        },
                        {
                            header: 'Thương hiệu',
                            binding: 'TradeMarkCode',
                            width: 100,
                        },
                        {
                            header: 'Đơn giá',
                            binding: 'OriginalUnitCost',
                            width: 100,
                            dataType: 'Number'
                        },
                        {
                            header: '_RowId',
                            binding: 'RowId',
                            width: 0,
                            isReadOnly: 'true'
                        },
                        {
                            header: 'Stt',
                            binding: 'BuiltinOrder',
                            width: 0,
                            dataType: 'Number',
                            isReadOnly: 'true'
                        }
                    ],
                    gridEditor5: [
                        {
                            header: 'Chọn',
                            binding: 'ColCheck',
                            width: 50,
                            dataType: 'Boolean'
                        },
                        {
                            header: 'Mã vật tư',
                            binding: 'ItemCode',
                            width: 100,
                            dataType: 'Array',
                            lookupKey: 'Item',
                            lookupfilter: "IsActive=1 AND IsGroup=0"
                        },
                        {
                            header: 'Nhà cung cấp',
                            binding: 'CustomerCode',
                            width: 350,
                            dataType: 'Array',
                            lookupKey: 'QRLKW_Customer',
                            lookupfilter: "ItemCode = '{EXPR=ItemCode}' AND UserName = '{VAR=User.UserName}' AND BizDocId = '{EXPR=BizDocId}'",
                            bindingList: {
                                TradeMarkCode: 'TradeMarkCode',
                                OriginalUnitCost: 'OriginalUnitCost'
                            }
                        },
                        {
                            header: 'Thương hiệu',
                            binding: 'TradeMarkCode',
                            width: 100,
                            dataType: 'Array',
                            lookupKey: 'QRLKW_TradeMark',
                            lookupfilter: "ItemCode ='{EXPR=ItemCode}' AND CustomerCode = '{EXPR=CustomerCode}' AND UserName = '{VAR=User.UserName}' AND BizDocId = '{EXPR=BizDocId}'",
                            bindingList: {
                                OriginalUnitCost: 'OriginalUnitCost'
                            }
                        },
                        {
                            header: 'Đơn giá',
                            binding: 'OriginalUnitCost',
                            width: 100,
                            dataType: 'Number'
                        },
                        {
                            header: '_RowId',
                            binding: 'RowId',
                            width: 0,
                            isReadOnly: 'true'
                        },
                        {
                            header: 'Stt',
                            binding: 'BuiltinOrder',
                            width: 0,
                            dataType: 'Number',
                            isReadOnly: 'true'
                        }
                    ],
                    gridEditor6: [
                        {
                            header: 'Mã nhà cung cấp',
                            binding: 'CustomerCode',
                            width: 120
                        },
                        {
                            header: 'Tên nhà cung cấp',
                            binding: 'CustomerName',
                            width: 300
                        },
                        {
                            header: 'Tổng tiền (min NCC)',
                            binding: 'AmountMinTheoDt',
                            width: 150,
                            dataType: 'Number',
                            format: 'n0',
                        },
                        {
                            header: 'Tổng tiền (chọn)',
                            binding: 'GiaChon',
                            width: 150,
                            dataType: 'Number',
                            format: 'n0',
                        },
                        {
                            header: 'Chênh lệch',
                            binding: 'ChenhLech',
                            width: 150,
                            dataType: 'Number',
                            format: 'n0',
                        }
                    ],
                    gridEditor7: [
                        {
                            header: 'Mã nhà cung cấp',
                            binding: 'CustomerCode',
                            width: 120
                        },
                        {
                            header: 'Tên nhà cung cấp',
                            binding: 'CustomerName',
                            width: 300
                        },
                        {
                            header: 'Tổng tiền (min NCC)',
                            binding: 'AmountMinTheoDt',
                            width: 150,
                            dataType: 'Number',
                            format: 'n0',
                        },
                        {
                            header: 'Tổng tiền (chọn)',
                            binding: 'GiaChon',
                            width: 150,
                            dataType: 'Number',
                            format: 'n0',
                        },
                        {
                            header: 'Chênh lệch',
                            binding: 'ChenhLech',
                            width: 150,
                            dataType: 'Number',
                            format: 'n0',
                        }
                    ]
                }
            },
            nextAdjust: {
                command: 'usp_TMCtc_DieuChinh_DonHangMua',
                tablename: 'gridEditor1',
                griddata: 2,
                tablename2: 'gridEditor4',
                griddata2: 5,
                tablename3: 'gridEditor5',
                griddata3: 6,
                tablename4: 'gridEditor6',
                griddata4: 7,
                tablename5: 'gridEditor7',
                griddata5: 8,            
                constraintkey: 'BizDocId,BranchCode',
                data: {
                    gridAdjust: [
                        {
                            header: 'Ngày',
                            binding: 'DocDate',
                            width: 100,
                            format: 'dd/MM/yyyy'
                        },
                        {
                            header: 'Mã đối tượng',
                            binding: 'CustomerCode',
                            width: 100
                        },
                        {
                            header: 'Tên đối tượng',
                            binding: 'CustomerName',
                            width: 0
                        },
                        {
                            header: 'Mã hàng',
                            binding: 'ItemCode',
                            width: 100
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
                            dataType: 'Number',
                            format: 'n2',
                            aggregate: 'Sum'
                        },
                        {
                            header: 'Quy đổi',
                            binding: 'Quantity8',
                            width: 100,
                            dataType: 'Number',
                            format: 'n4',
                            aggregate: 'Sum'
                        },
                        {
                            header: 'Đơn giá',
                            binding: 'OriginalUnitCost',
                            width: 100,
                            dataType: 'Number',
                            format: 'n2'
                        },
                        {
                            header: 'Thành tiền',
                            binding: 'OriginalAmount',
                            width: 100,
                            dataType: 'Number',
                            format: 'n0',
                            aggregate: 'Sum'
                        },
                        {
                            header: 'Thương hiệu',
                            binding: 'TradeMarkCode',
                            width: 100
                        },
                        {
                            header: '_RowId',
                            binding: 'RowId',
                            width: 0,
                            isReadOnly: 'true'
                        },
                        {
                            header: 'Stt',
                            binding: 'BuiltinOrder',
                            width: 100,
                            dataType: 'Number',
                            isReadOnly: 'true'
                        }
                    ],
                    gridEffective: [
                        {
                            header: 'Chọn',
                            binding: 'ColCheck',
                            width: 50,
                            dataType: 'Boolean'
                        },
                        {
                            header: 'Mã nhà cung cấp',
                            binding: 'CustomerCode',
                            width: 120
                        },
                        {
                            header: 'Tên nhà cung cấp',
                            binding: 'CustomerName',
                            width: 300
                        },
                        {
                            header: 'Tổng tiền (min NCC)',
                            binding: 'AmountMinTheoDt',
                            width: 150,
                            dataType: 'Number',
                            format: 'n0',
                        },
                        {
                            header: 'Tổng tiền (chọn)',
                            binding: 'GiaChon',
                            width: 150,
                            dataType: 'Number',
                            format: 'n0',
                        },
                        {
                            header: 'Chênh lệch',
                            binding: 'ChenhLech',
                            width: 150,
                            dataType: 'Number',
                            format: 'n0',
                        }                        
                    ]
                }
            },
            nextResult: {
                command: 'usp_TMCtc_TaoDonHangMua',
                tablename: 'gridAdjust',
                griddata: 9,
                tablename2: 'B30BizDocQR',
                griddata2: 0,
                tablename3: 'gridEditor1',
                griddata3: 2,
                tablename4: 'gridEditor5',
                griddata4: 6,
                tablename5: 'gridEditor6',
                griddata5: 7,
                tablename6: 'gridEditor7',
                griddata6: 8,
                tablename7: 'gridEffective',
                griddata7: 11,
                tablename8: 'gridEditor3',
                griddata8: 4,                    
                constraintkey: 'BizDocId,BranchCode,UserName',
                data: {
                    gridReport: [
                        {
                            header: 'Ngày',
                            binding: 'DocDate',
                            width: 100,
                            format: 'dd/MM/yyyy'
                        },
                        {
                            header: 'Số đơn hàng',
                            binding: 'DocNo',
                            width: 150
                        },
                        {
                            header: 'Tên đối tượng',
                            binding: 'CustomerName',
                            width: 200
                        },
                        {
                            header: 'Mã vật tư',
                            binding: 'ItemCode',
                            width: 120
                        },
                        {
                            header: 'Tên vật tư',
                            binding: 'Description',
                            width: 200
                        },
                        {
                            header: 'Đvt',
                            binding: 'Unit',
                            width: 80
                        },
                        {
                            header: 'Số lượng',
                            binding: 'Quantity9',
                            width: 100,
                            format: 'n2',
                            aggregate: 'Sum'
                        },
                        {
                            header: 'Quy đổi (kg)',
                            binding: 'Quantity8',
                            width: 100,
                            format: 'n2',
                            aggregate: 'Sum'
                        },
                        {
                            header: 'Thương hiệu',
                            binding: 'TradeMarkCode',
                            width: 100
                        }
                    ]
                }
            }
        }
    ]

    public static ColumnChangedChild = [
        // {
        //     Tables: 0,
        //     columnChanged: {
        //         DocDate1: {
        //             Evaluators: [
        //                 'Evaluator_ServerConstraint_DocDate1'
        //             ]
        //         }
        //     }
        // },
        {
            Tables: 9,
            columnChanged: {
                Quantity9: {
                    Evaluators: [
                        'Evaluator_ServerConstraint_Quantity8',
                        'Evaluator_OriginalAmount_Calculator',
                        'Evaluator_OriginalAmount_Calculator_Quantity8'
                    ]
                }
            }
        }
    ]

    public static Evaluators = {
        'Evaluator_OriginalAmount_Calculator': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount",
            Value: "Quantity9*OriginalUnitCost",
            zExpr: "Quantity8 == 0",
            Tables: 9
        },
        'Evaluator_ServerConstraint_Quantity8': {
            EvaluatorName: 'EvaluatorQuery',
            ConstraintKey: 'ItemCode,Quantity9,{VAR=Branch.Ma_Dvcs}',
            Command: 'ufn_Coteccons_TrongLuongThepQuyDoi',
            zExpr: "Quantity9 != ''",
            DataMember: 'Quantity8',
            Tables: 9
        },
        'Evaluator_OriginalAmount_Calculator_Quantity8': {
            EvaluatorName: 'EvaluatorCaculate',
            DataMember: "OriginalAmount",
            Value: "Quantity8*OriginalUnitCost",
            zExpr: "Quantity8 != 0",
            Tables: 9
        },
        'Evaluator_ServerConstraint_DocDate1': {
            EvaluatorName: 'ufn_TMCtc_GetDateOneYearAgo',
            ConstraintKey: 'DocDate1',
            Command: 'ufn_Coteccons_TrongLuongThepQuyDoi',
            DataMember: 'DocDate1',
            Tables: 0
        }
    }

    public static ServerConstraint = [
    ];
}