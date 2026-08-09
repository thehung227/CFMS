import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
  public Layout = [
    {
      key: "REP07_KHDT_KLCDT",
      text: "Kế hoạch doanh thu và xác nhận KL CĐT",
      command: "usp_KeHoachDoanhThuKL_BDH",

      ctorArg: { Commandkey: "REP07_KHDT_KLCDT" },
      // outputjson: 0,

      // JsonColumnPos: {
      //     grdReport: 11
      // },
      subTotals: { "0": "ProjectManager" },
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
        // {
        //     className: 'DateBoxInput',
        //     key: 'DocDate1',
        //     type: 'date',
        //     format: 'dd/MM/yyyy',
        //     label: 'Từ ngày'
        // },
        {
          className: "DateBoxInput",
          key: "DocDate",
          type: "date",
          format: "dd/MM/yyyy",
          label: "Đến ngày",
        },
        {
          className: "LookupBoxInput",
          key: "ProductCostId",
          lookupKey: "ProductCost",
          label: "Gói thầu",
          lookupfilter:
            "IsGroup=0 AND IsActive=1 AND ProductType = 1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
          hideValueMember: false,
          // validators: [Validators.required]
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
            header: "STT",
            binding: "BuiltinOrder",
            width: 80,
            isColumnOriginal: true,
          },

          {
            header: "DỰ ÁN",
            binding: "ProductName",
            width: 200,
            isColumnOriginal: true,
          },

          {
            header: "KẾ HOẠCH DOANH THU",
            columns: [
              {
                header: "Lũy kế Kế hoạch doanh thu",
                binding: "Amount_DoanhThu",
                width: 150,
                align: "right",
                aggregate: "Sum",
              },
              {
                header: "Lũy kế thực tế DT đã xác nhận",
                binding: "Amount_DoanhThuKT",
                width: 150,
                align: "right",
                aggregate: "Sum",
              },
              {
                header: "DT còn phải xác nhận trong tháng",
                binding: "Amount_DoanhThuConLai",
                width: 150,
                align: "right",
                aggregate: "Sum",
              },
              {
                header: "Lũy kế KL thi công kế hoạch",
                binding: "Amount_ThiCong",
                width: 150,
                align: "right",
                aggregate: "Sum",
              },
              {
                header: "Lũy kế KL thi công kế hoạch (Tam suất)",
                binding: "Amount_ThiCongTamS",
                width: 150,
                align: "right",
                aggregate: "Sum",
              },
              {
                header: "Khối lượng thi công dở dang",
                binding: "TonKho1",
                width: 150,
                align: "right",
                aggregate: "Sum",
              },

              {
                header: "Tổng chi phí dự án",
                binding: "TotalAmountCP",
                width: 150,
                align: "right",
                aggregate: "Sum",
              },
              {
                header: "Tồn kho theo chi phí",
                binding: "TonKho2",
                width: 150,
                align: "right",
                aggregate: "Sum",
              },
              {
                header: "Thi công lũy kế BQ 3 tháng",
                binding: "KhoiLuongBQ3Thang",
                width: 150,
                align: "right",
                aggregate: "Sum",
              },
              {
                header: "Tồn kho theo BQ",
                binding: "TonKho3",
                width: 150,
                align: "right",
                aggregate: "Sum",
              },

              {
                header: "Lũy kế KL thực hiện (bill đã up)",
                binding: "Amount_ThucHienNotVAT",
                width: 150,
                align: "right",
                aggregate: "Sum",
              },
              {
                header: "Doanh thu tối thiểu",
                binding: "Amount511Min",
                width: 150,
                align: "right",
                aggregate: "Sum",
              },
              {
                header: "Doanh thu báo cáo tài chính",
                binding: "Amount511BCTC",
                width: 150,
                align: "right",
                aggregate: "Sum",
              },
              {
                header: "Khối lượng thi công cần duyệt",
                binding: "Amount_ThiCongChuaDuyet",
                width: 150,
                align: "right",
                aggregate: "Sum",
              },
            ],
          },
          {
            header: "Số dư 154",
            columns: [
              {
                header: "Nợ",
                binding: "No154",
                width: 150,
                align: "right",
                aggregate: "Sum",
              },
              {
                header: "Có",
                binding: "Co154",
                width: 150,
                align: "right",
                aggregate: "Sum",
              },
              {
                header: "Dư cuối",
                binding: "Cuoi154",
                width: 150,
                align: "right",
                aggregate: "Sum",
              },
            ],
          },
          {
            header: "Nhận định",
            binding: "NhanDinh",
            width: 200,
            isColumnOriginal: true,
          },
          {
            header: "TÌNH TRẠNG XÁC NHẬN KHỐI LƯỢNG",
            columns: [
              {
                header: "Claim đã duyệt",
                binding: "ClaimDaDuyet",
                width: 150,
                isColumnOriginal: true,
              },
              {
                header: "Claim đang trình",
                binding: "ClaimDangTrinh",
                width: 150,
                isColumnOriginal: true,
              },
              {
                header: "KL cần trình CĐT",
                binding: "ClaimCanTrinh",
                width: 150,
                isColumnOriginal: true,
              },
            ],
          },
          {
            header: "TÌNH TRẠNG CLAIM ĐANG TRÌNH",
            columns: [
              {
                header: "Số Claim đang trình",
                binding: "IPCNo",
                width: 150,
                isColumnOriginal: true,
              },
              {
                header: "Giá trị Claim đang trình",
                binding: "AmountDangTrinh",
                width: 150,
                align: "right",
                aggregate: "Sum",
              },
              {
                header: "Số ngày duyệt theo hợp đồng",
                binding: "SoNgayDuyetHD",
                width: 150,
                align: "right",
              },
              {
                header: "Ngày duyệt lý thuyết (Theo HĐ)",
                binding: "DateDuyetLyThuyet",
                width: 150,
              },
              {
                header: "Số ngày trễ (Theo HĐ)",
                binding: "SoNgayTre",
                width: 150,
                align: "right",
              },
              {
                header: "Số ngày duyệt (theo quy trình BCH)",
                binding: "SoNgayDuyetBCH",
                width: 150,
                align: "right",
              },
              {
                header: "Ngày duyệt lý thuyết (Theo quy trình BCH)",
                binding: "DateDuyetBCH",
                width: 150,
                align: "right",
              },

              {
                header: "Số ngày trễ (theo quy trình BCH)",
                binding: "SoNgayTre1",
                width: 150,
                align: "right",
              },
            ],
          },
          {
            header: "THÔNG TIN HỢP ĐỒNG",
            columns: [
              {
                header: "Ngày lập claim (CFMS)",
                binding: "ClaimDate",
                width: 150,
                isColumnOriginal: true,
              },
              {
                header: "Cách thức trình Claim",
                binding: "HinhThucTrinhClaim",
                width: 150,
                isColumnOriginal: true,
              },
              {
                header: "Ngày trình Claim theo HĐ",
                binding: "MocTrinhClaim",
                width: 150,
                align: "right",
              },
              {
                header: "Tổng thời gian duyệt",
                binding: "TongThoiGianDuyet",
                width: 150,
                align: "right",
              },
              {
                header: "Bên phê duyệt 1",
                binding: "PheDuyet1",
                width: 150,
              },
              {
                header: "Số ngày",
                binding: "SoNgay1",
                width: 150,
                align: "right",
              },
              {
                header: "Bên phê duyệt 2",
                binding: "PheDuyet2",
                width: 150,
              },
              {
                header: "Số ngày",
                binding: "SoNgay2",
                width: 150,
                align: "right",
              },
              {
                header: "Bên phê duyệt 3",
                binding: "PheDuyet3",
                width: 150,
              },
              {
                header: "Số ngày",
                binding: "SoNgay3",
                width: 150,
                align: "right",
              },
              {
                header: "Bên phê duyệt 4",
                binding: "PheDuyet4",
                width: 150,
              },
              {
                header: "Số ngày",
                binding: "SoNgay4",
                width: 150,
                align: "right",
              },
            ],
          },
          {
            header: "MÃ DỰ ÁN",
            binding: "ProductCode",
            width: 200,
            isColumnOriginal: true,
          },
          {
            header: "GIÁM ĐỐC ĐIỀU HÀNH",
            binding: "ProjectManager",
            width: 200,
            isColumnOriginal: true,
          },
          {
            header: "Nhóm công tác",
            binding: "_FormatStyleWeb",
            width: 0,
            align: "center",
            isColumnOriginal: true,
          },
          {
            header: "Nhóm công tác",
            binding: "_FormatStyleKey",
            width: 100,
            align: "center",
            isColumnOriginal: true,
          },
        ],
      },
    },
  ];
}
