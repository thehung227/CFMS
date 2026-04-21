import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
  public Layout = [
    {
      key: "REP04_QTHSQT_GIA_TRI",
      text: "Báo cáo quy trình hồ sơ quyết toán",
      command: "usp_B30HSQT_Report",

      ctorArg: { Commandkey: "REP04_QTHSQT_GIA_TRI" },
      bAllowGrandTotal: [0],

      subTotals: { "0": "GiamDocDieuHanh,ProductName" },
      nCollapseNodesOnCreate: { "0": 1 },
      rowHeader: {
        0: [
          {
            height: 41,
          },
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
                            className: 'LookupBoxInput',
                            key: 'Id',
                            lookupKey: 'HSQT',
                            label: 'Hồ sơ quyết toán',
                            lookupfilter: "ProductCostId = '{EXPR=ProductCostId}' AND IsGroup=0 AND IsActive=1 AND DocCode='S1'",
                            isContentHtml: false,
                            validators: [Validators.required]
                        },
         {
                    className: 'LookupBoxInput',
                    key: 'ProductCostId',
                    lookupKey: 'ProductCost',
                    label: 'Gói thầu',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType = 1 AND BranchCode='{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR (RowId = '{VAR=Filter.ProductCostId}' AND RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}'))))",
                    hideValueMember: false
                },

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
            header: "STT",
            binding: "ItemNo",
            width: 60,
          },

          // {
          //     header: 'Tên dự án',
          //     binding: 'ProductName',
          //     width: 180,
          //     wordWrap: 'true',
          //      isReadOnly: 'true'
          // },
{
            header: "GĐĐH",
            binding: "GiamDocDieuHanh",
            width: 0,
            wordWrap: "true",
            isReadOnly: "true",
          },
          {
            header: "Tên dự án",
            binding: "ProductName",
            width: 0,
            wordWrap: "true",
            isReadOnly: "true",
          },
          {
            header: "Gói thầu",
            binding: "GoiThau",
            width: 250,
            wordWrap: "true",
            isReadOnly: "true",
          },
          {
            header: "Kế hoạch cam kết hoàn thành hồ sơ quyết toán",
            columns: [
              {
                header: "GT PS CĐT chưa duyệt ( chưa VAT)",
                binding: "GiaTriPhatSinhCDTChuaDuyet_ChuaVAT",
                dataType: "Number",
                isRequired: true,
                width: 120,
                aggregate: "Sum",
              },
              {
                header: "Cam kết ký PLHĐ chốt PS",
                binding: "CamKetKyPLHDChotPhatSinh",
                dataType: "Date",
                isRequired: false,
                format: "dd/MM/yyyy",
                width: 100,
              },
              {
                header: "Ngày hoàn thành TC thực tế",
                binding: "NgayHoanThanhThiCongThucTe",
                dataType: "Date",
                isRequired: false,
                format: "dd/MM/yyyy",
                width: 120,
              },
              {
                header: "Ngày ký TOC",
                binding: "NgayKyTOC",
                dataType: "Date",
                isRequired: false,
                format: "dd/MM/yyyy",
                width: 100,
              },
              {
                header: "Tình trạng ký TOC",
                binding: "TinhTrangKyTOC",
                dataType: "Array",
                lookupKey: "Class",
                bindingList: {
                  // DocName: 'Description0'
                },
                lookupfilter: "IsActive=1 AND ParentCode='KyTOC'",
                hideValueMember: true,
                width: 100,
              },
              {
                header: "Ngày cam kết ký QT",
                binding: "NgayCamKetKyQuyetToan",
                dataType: "Date",
                isRequired: false,
                format: "dd/MM/yyyy",
                width: 100,
              },
              {
                header: "Tình trạng HSQT",
                binding: "TinhTrangHoSoQuyetToan",
                width: 150,
                wordWrap: "true",
              },
              {
                header: "Nguyên nhân chậm kế hoạch so với kế hoạch trước",
                binding: "NguyenNhanChamKeHoach",
                width: 250,
                wordWrap: "true",
              },
            ],
          },
          {
            header: "DOANH THU",
            columns: [
              {
                header: "GIÁ TRỊ DỰ KIẾN QUYẾT TOÁN CĐT(Chưa VAT)",
                columns: [
                  {
                    header: "Giá trị trực tiếp",
                    binding: "GiaTriDuKienQT_TrucTiep_ChuaVAT",
                    dataType: "Number",
                    isRequired: true,
                    width: 160,
                    aggregate: "Sum",
                  },
                  {
                    header: "Giá trị NSC",
                    binding: "GiaTriDuKienQT_NSC_ChuaVAT",
                    dataType: "Number",
                    isRequired: true,
                    width: 150,
                    aggregate: "Sum",
                  },
                  {
                    header: "Tổng cộng",
                    binding: "TongGiaTriDuKienQT_ChuaVAT",
                    dataType: "Number",
                    isRequired: true,
                    width: 150,
                    isReadOnly: "true",
                    aggregate: "Sum",
                  },
                ],
              },
              {
                header: "DOANH THU ĐÃ XÁC NHẬN(CHƯA VAT)",
                columns: [
                  {
                    header: "Giá trị trực tiếp",
                    binding: "DoanhThuDaXacNhan_TrucTiep_ChuaVAT",
                    dataType: "Number",
                    isRequired: true,
                    width: 160,
                    aggregate: "Sum",
                  },
                  {
                    header: "Giá trị NSC",
                    binding: "DoanhThuDaXacNhan_NSC_ChuaVAT",
                    dataType: "Number",
                    isRequired: true,
                    width: 150,
                    aggregate: "Sum",
                  },
                  {
                    header: "Tổng cộng",
                    binding: "TongDoanhThuDaXacNhan_ChuaVAT",
                    dataType: "Number",
                    isRequired: true,
                    width: 150,
                    isReadOnly: "true",
                    aggregate: "Sum",
                  },
                ],
              },
              {
                header: "DOANH THU CÒN LẠI PHẢI XÁC NHẬN(CHƯA VAT)",
                columns: [
                  {
                    header: "Giá trị trực tiếp",
                    binding: "DoanhThuConLai_TrucTiep_ChuaVAT",
                    dataType: "Number",
                    isRequired: true,
                    width: 160,
                    aggregate: "Sum",
                  },
                  {
                    header: "Giá trị NSC",
                    binding: "DoanhThuConLai_NSC_ChuaVAT",
                    dataType: "Number",
                    isRequired: true,
                    width: 150,
                    aggregate: "Sum",
                  },
                  {
                    header: "Tổng cộng",
                    binding: "TongDoanhThuConLai_ChuaVAT",
                    dataType: "Number",
                    isRequired: true,
                    width: 150,
                    isReadOnly: "true",
                    aggregate: "Sum",
                  },
                ],
              },
                {
                header: '% DT xác nhận/GT dự kiến QT CĐT',
                binding: 'Rate1',
                dataType: 'Number',
                width: 110,
                min: 0,
                max: 1,
                format: 'p2'
            },
            ],
          },

         {
            header: "THU",
            columns: [
              {
                header: "GIÁ TRỊ DỰ KIẾN QUYẾT TOÁN CĐT(GỒM VAT)",
                columns: [
                  {
                    header: "Giá trị trực tiếp",
                    binding: "GiaTriDuKienQT_TrucTiep_GomVAT",
                    dataType: "Number",
                    isRequired: true,
                    width: 160,
                    aggregate: "Sum",
                  },
                  {
                    header: "Giá trị NSC",
                    binding: "GiaTriDuKienQT_NSC_GomVAT",
                    dataType: "Number",
                    isRequired: true,
                    width: 150,
                    aggregate: "Sum",
                  },
                  {
                    header: "Tổng cộng",
                    binding: "TongGiaTriDuKienQT_GomVAT",
                    dataType: "Number",
                    isRequired: true,
                    width: 150,
                    isReadOnly: "true",
                    aggregate: "Sum",
                  },
                ],
              },
              {
                header: "GIÁ TRỊ CĐT ĐÃ THANH TOÁN(GỒM VAT)",
                columns: [
                  {
                    header: "Giá trị trực tiếp",
                    binding: "CDTThanhToan_TrucTiep_GomVAT",
                    dataType: "Number",
                    isRequired: true,
                    width: 160,
                    aggregate: "Sum",
                  },
                  {
                    header: "Giá trị NSC",
                    binding: "CDTThanhToan_NSC_GomVAT",
                    dataType: "Number",
                    isRequired: true,
                    width: 150,
                    aggregate: "Sum",
                  },
                  {
                    header: "Tổng cộng",
                    binding: "CDTThanhToan_GomVAT",
                    dataType: "Number",
                    isRequired: true,
                    width: 150,
                    isReadOnly: "true",
                    aggregate: "Sum",
                  },
                ],
              },
               {
                header: '% đã thanh toán/GT dự kiến QT CĐT',
                binding: 'Rate2',
                dataType: 'Number',
                width: 110,
                min: 0,
                max: 1,
                format: 'p2'
            },
              {
                header: "GIÁ TRỊ CẦN PHẢI THU ĐẾN QUYẾT TOÁN(GỒM VAT)",
                columns: [
                  {
                    header: "Giá trị trực tiếp",
                    binding: "PhaiThuConLai_TrucTiep_GomVAT",
                    dataType: "Number",
                    isRequired: true,
                    width: 160,
                    aggregate: "Sum",
                  },
                  {
                    header: "Giá trị NSC",
                    binding: "PhaiThuConLai_NSC_GomVAT",
                    dataType: "Number",
                    isRequired: true,
                    width: 150,
                    aggregate: "Sum",
                  },
                  {
                    header: "Tổng cộng",
                    binding: "PhaiThuConLai_GomVAT",
                    dataType: "Number",
                    isRequired: true,
                    width: 150,
                    isReadOnly: "true",
                    aggregate: "Sum",
                  },
                ],
              },
               
            ],
          },
         

         
         
         
        ],
      },
    },
  ];
}
