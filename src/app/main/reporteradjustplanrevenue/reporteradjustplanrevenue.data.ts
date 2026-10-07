import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
  public Layout = [
    {
      key: "REP07_KHDT_DC",
      text: "Kế hoạch doanh thu dự án",
      command: "usp_CCM_PlanRevenue",

      ctorArg: { 'Commandkey': 'REP07_KHDT_DC', 'nUserId': '{VAR=User.Id}' },
       outputjson: 0,
        bAllowGrandTotal: [0],
        JsonColumnPos:{
            grdReport: 6
        },
      subTotals: { "0": "GroupBy" },
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
        {
          className: "LookupBoxInput",
          key: "CCMBudgetId",
          lookupKey: "CCMBudget",
          label: "Version",
          lookupfilter:
            "IsActive = 1 AND ProductCostId = '{EXPR=ProductCostId}' AND DocCode = 'KD'",
          hideValueMember: false,
          // validators: [Validators.required]
        },
        {
          className: "LookupBoxInput",
          key: "GroupBy",
          lookupKey: "Position",
          label: "Nhóm theo báo cáo",
          lookupfilter:
            "IsActive = 1 AND Code IN ('CB-002','CB-077')",
          hideValueMember: false,
          // validators: [Validators.required]
        },
         {
             className: 'LookupBoxInput',
             key: 'nUserId',
             lookupKey: 'UserList2',
             lookupfilter: "Id ='{VAR=User.Id}'",
             label: 'User',
             validators: [Validators.required]
         }
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
            isColumnOriginal: true
          },

          {
            header: "DỰ ÁN",
            binding: "ProjectName",
            width: 200,
            isColumnOriginal: true
          },

          {
            header: "Doanh thu quý",
            columns: [
              {
                header: "Q1",
                binding: "Quy1",
                width: 150,
                align: "right",
                aggregate: "Sum"
              },
              {
                header: "Q2",
                binding: "Quy2",
                width: 150,
                align: "right",
                aggregate: "Sum"
              },
              {
                header: "Q3",
                binding: "Quy3",
                width: 150,
                align: "right",
                aggregate: "Sum"
              },
              {
                header: "Q4",
                binding: "Quy4",
                width: 150,
                align: "right",
                aggregate: "Sum"
              }
            ]
          }
         
          // {
          //   header: "Doanh thu năm",
          //   columns: [
          //     {
          //       header: "Kỳ trước",
          //       binding: "Amount_KyTruoc",
          //       width: 150,
          //       align: "right",
          //       aggregate: "Sum",
          //     },
          //     {
          //       header: "Kỳ này",
          //       binding: "Amount_KyNay",
          //       width: 150,
          //       align: "right",
          //       aggregate: "Sum",
          //     },
          //     {
          //       header: "Chênh lệch",
          //       binding: "ChenhLech",
          //       width: 150,
          //       align: "right",
          //       aggregate: "Sum",
          //     },
          //     {
          //       header: "Tình trạng",
          //       binding: "_Status",
          //       width: 150,
          //     }
          //   ],
          // },
          // {
          //   header: "GIÁM ĐỐC ĐIỀU HÀNH",
          //   binding: "GiamDocDieuHanh",
          //   width: 200,
          //   isColumnOriginal: true,
          // },
          // {
          //   header: "GIÁM ĐỐC DỰ ÁN",
          //   binding: "GiamDocDuAn",
          //   width: 200,
          //   isColumnOriginal: true,
          // },
          // {
          //   header: "CCM",
          //   binding: "CCM",
          //   width: 200,
          //   isColumnOriginal: true,
          // },
          // {
          //   header: "GIÁM ĐỐC DỰ ÁN",
          //   binding: "GroupBy",
          //   width: 0,
          //   isColumnOriginal: true,
          // },
        ]
      },
    },
  ];
}
