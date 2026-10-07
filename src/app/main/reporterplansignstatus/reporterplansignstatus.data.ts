import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
  public Layout = [
    {
      key: "REP07_THEODOIHD",
      text: "BẢNG THEO DÕI HỢP ĐỒNG + TẠM ỨNG ĐẦU",
      command: "usp_LLTC_PlanSignStatus_Report",

      ctorArg: { Commandkey: "REP07_THEODOIHD" },
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
        // {
        //     className: 'DateBoxInput',
        //     key: 'DocDate1',
        //     type: 'date',
        //     format: 'dd/MM/yyyy',
        //     label: 'Từ ngày'
        // },
       
        {
          className: "LookupBoxInput",
          key: "ReportType",
          lookupKey: "Class",
          label: "Loại báo cáo",
          lookupfilter:
            "ParentCode = 'LLTC_RP'",
          hideValueMember: false,
          // validators: [Validators.required]
        },
         {
          className: "NumberBoxInput",
          key: "SoNgayTreHD",
          label: "Số ngày ký hợp đồng"
          // validators: [Validators.required]
        },
         {
          className: "NumberBoxInput",
          key: "SoNgayTamUng",
          label: "Số ngày tạm ứng"
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
            header: 'STT',
            binding: 'ItemNo',
            isRequired: true,
            width: 100
        },
       
       
          {
            header: 'Mã NTP/NCC',
            binding: 'CustomerCode',
            
            width: 100,
            // validators: "{EXPR=CustomerCode} == ''",
            // validatorMessage: 'Mã đối tượng, không được bỏ trắng giá trị',
            // ignoreError: 1
        },
        {
            header: 'Tên NTP/NCC',
            binding: 'CustomerName',
            width: 300,
            isReadOnly: 'true'
        },
          {
            header: 'Gói thầu',
            binding: 'JobName',
            isRequired: true,
            width: 250
        },
       {
            header: 'Ngày chốt',
            binding: 'EstimatedTimeDelivery',
            isRequired: false,
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
       
        {
            header: 'Nội dung hợp đồng',
            binding: 'DocInfo',
            width: 200,
            isReadOnly: 'true'
        },
        {
            header: 'File đính kèm',
            binding: 'FilePath',
            width: 200,
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
            header: 'Số ngày hoàn thành HĐ',
            binding: 'SoNgayTre',
            dataType: 'Number',
            isRequired: true,
            width: 150
        },
          {
            header: 'Tạm ứng',
            binding: 'StatusSign',
            width: 100,
            dataType: 'Array',
            lookupKey: 'ClassDes',
            // lookupfilter: "BranchCode = '{VAR=Branch.Ma_Dvcs}' AND CompletedApprove=1 AND CustomerCode = '{EXPR=CustomerCode}' AND (DocCode = 'C3' OR (DocCode='C4' AND IsSubContractPay=1)) AND (((ProductCostId = '{EXPR=ProductCostId}' OR ProductCostId0 = '{EXPR=ProductCostId}')) OR (ContractType IN ('HD-14','HD-08','HD-16')))"
            lookupfilter: "ParentCode='SYSCONFIG_YES_NO'",
        },
        {
            header: 'Ngày tạm ứng',
            binding: 'EstimatedQuotationDate',
            isRequired: false,
            width: 100,
            dataType: 'Date',
            format: 'dd/MM/yyyy'
        },
         {
            header: 'Số ngày tạm ứng',
            binding: 'SoNgayTamUng',
            dataType: 'Number',
            isRequired: true,
            width: 150,
            isReadOnly: 'true'
        },
         {
            header: 'Tên dự án',
            binding: 'ProductName0',
            width: 250,
            isReadOnly: 'true'
        },
        ],
      },
    },
  ];
}
