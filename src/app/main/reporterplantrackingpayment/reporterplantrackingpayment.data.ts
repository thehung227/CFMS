import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
  public Layout = [
    {
      key: "REP07_THEODOITQT",
      text: "BẢNG THEO DÕI THANH/QUYẾT TOÁN",
      command: "usp_LLTC_BaoCaoTaiChinhCongTruong_THQT_Report",

      ctorArg: { Commandkey: "REP07_THEODOITQT" },
      // outputjson: 0,

      // JsonColumnPos: {
      //     grdReport: 11
      // },
      subTotals: { "0": "ProductName0" },
      nCollapseNodesOnCreate: { "0": 1 },
      rowHeader: {
        0: [
          {
            height: 41,
          },
          {
            height: 41,
          },
        ],
      },

      parameters: [
        {
            className: 'NumberBoxInput',
            key: 'SoNgayChuaThanhToan',
            type: 'number',
            format: 'n0',
            label: 'Số ngày chưa thanh toán'
        },
       {
            className: 'NumberBoxInput',
            key: 'TuSoLanViPham',
            type: 'number',
            format: 'n0',
            label: 'Từ số lần vi phạm'
        },
          {
            className: 'NumberBoxInput',
            key: 'DenSoLanViPham',
            type: 'number',
            format: 'n0',
            label: 'Đến số lần vi phạm'
        },
        
        // {
        //     className: 'LookupBoxInput',
        //     key: 'BranchCode',
        //     lookupKey: 'Branch',
        //     lookupfilter: "Ma_Dvcs ='{VAR=Branch.Ma_Dvcs}'",
        //     label: 'Đơn vị',
        //     validators: [Validators.required]
        // }
      ],

      // summary: {
      //     cols:2,
      //     row: {
      //         0: [
      //             {
      //                 label: TRƯỞNG PHÒNG THIẾT BỊ,
      //                 style: color: green;text-align: center,
      //                 styleobject: {color: blue,text-align: center,font-weight: bold},
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
            binding: 'ItemNo',
            isRequired: true,
            width: 100
          },
          {
            header: 'Id dự án',
            dataType: 'Array',
            binding: 'ProductCostId0',
            lookupKey: 'ProductCost',
            bindingList: {
              ProductCostInfo: 'ProductName0'
            },
            lookupfilter: "ProductType IN (1,3) AND IsGroup = 0 AND IsActive = 1 AND BranchCode = '{VAR=Branch.Ma_Dvcs}'",
            hideValueMember: true,
            width: 150
          },
          {
            header: 'Tên dự án',
            binding: 'ProductName0',
            width: 250,
            isReadOnly: 'true'
          },
          {
            header: 'Id hợp đồng',
            binding: 'BizDocId_C1',
            width: 200,
            dataType: 'Array',
            lookupKey: 'BizDoc2',
            bindingList: {
              DocInfo: 'DocInfo',
              CustomerCode: 'CustomerCode',
              CUstomerName: 'CustomerName',
            },
            lookupfilter: "((DocCode = 'C3' AND FilePath IS NOT NULL AND (ProductCostId='{EXPR=ProductCostId0}' OR ProductCostId0='{EXPR=ProductCostId0}')) OR (DocCode='C3' AND IsFinishLC = 1) AND (Closed = 0 AND CompletedApprove=1 AND BranchCode='{VAR=Branch.Ma_Dvcs}'))"
          },
          {
            header: 'Nội dung hợp đồng',
            binding: 'DocInfo',
            width: 200,
            isReadOnly: 'true'
          },
          {
            header: 'Loại HĐ',
            binding: 'ContractType',
            width: 100,
            isReadOnly: 'true'
          },
          {
            header: 'Mã NTP/NCC',
            binding: 'CustomerCode',
            isRequired: true,
            dataType: 'Array',
            lookupKey: 'Customer_CCM2',
            bindingList: {
              NameBinding: 'CustomerName'
            },
            lookupfilter: "IsGroup=0 AND IsActive=1 AND List_BranchCode LIKE '%'+'{VAR=Branch.Ma_Dvcs}'+'%'",
            width: 100
          },
          {
            header: 'Tên NTP/NCC',
            binding: 'CustomerName',
            width: 300,
            isReadOnly: 'true'
          },
          {
            header: 'Ngày ký HĐ',
            binding: 'SignDate',
            isRequired: false,
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isReadOnly: 'true'
          },
          {
            header: 'Ngày thanh toán gần nhất',
            binding: 'PaymentDate',
            isRequired: false,
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            isReadOnly: 'true'
          },
          {
            header: 'Số bill đang trình',
            binding: 'BillNo',
            width: 150,
            isReadOnly: 'true'
          },
          {
            header: 'Số ngày chưa thanh toán',
            binding: 'SoNgayChuaThanhToan',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true'
          },
          {
            header: 'Mốc quyết toán',
            binding: 'EstimatedTimeDelivery',
            isRequired: false,
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
          },
          {
            header: 'Số ngày chưa hoàn thành QT',
            binding: 'SoNgayChuaHTQT',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true'
          },
       
          {
            header: 'Số lần vi phạm lũy kế',
            binding: 'SoLanViPhamLuyKe',
            dataType: 'Number',
            width: 150,
            isReadOnly: 'true'
          },
          {
            header: 'Tình trạng',
            binding: 'TenTinhTrang',
            width: 100,
            isReadOnly: 'true'
          },
          {
            header: 'Ghi chú',
            binding: 'Remark',
            width: 250,
            isReadOnly: 'true'
          },
        ],
      },
    },
  ];
}
