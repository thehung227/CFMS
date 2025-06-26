import { Validators } from "@angular/forms";
import { Global } from "../../shared/global";

export class LayoutData {
    public Layout = [
        {
            key: 'New_PartnerEvaluation',
            text: 'Báo cáo đánh giá đối tác',
            command: 'usp_New_DanhSachDanhGiaDoiTac',
            ctorArg: {
                'Commandkey': 'New_PartnerEvaluation',
                // 'ProductCostId': Global.convertConfig('{VAR=Filter.ProductCostId}')
            },
         
            bAllowGrandTotal: [
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
                    label: 'Công trình/ Phòng, ban',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ProductType IN ('1','3') AND BranchCode='{VAR=Branch.Ma_Dvcs}'",
                    hideValueMember: false
                },
                {
                    className: 'LookupBoxInput',
                    key: 'CustomerCode',
                    lookupKey: 'CustomerDG',
                    label: 'Đối tác',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    hideValueMember: false,
                    isContentHtml: false,
                    validators: [Validators.required]
                }
            ],
            data: {
                grdReport: [
                    {
                        header: 'PB/Dự án đánh giá ',
                        binding: 'ProductName',
                        width: 250
                    },
                    {
                        header: 'LOẠI ĐÁNH GIÁ',
                        binding: 'TypeOfReviewName',
                        width: 150
                    },
                    {
                        header: 'Nội dung HĐ',
                        binding: 'DocName',
                        width: 250
                    },
                    {
                        header: 'Ngày đánh giá',
                        binding: 'DocDate',
                        width: 150
                    },
                    {
                        header: 'Người đánh giá',
                        binding: 'EmployeeNameCHT',
                        width: 150
                    },
                    {
                        header: 'Điểm trung bình',
                        binding: 'NumberCol1',
                        width: 150,
                        format:'n2'
                    },
                    {
                        header: 'Đánh giá',
                        binding: 'DanhGia',
                        width: 350
                    },
                    {
                        header: 'Ghi chú về đánh giá',
                        binding: 'Remark',
                        width: 350
                    },
                    {
                        header: 'Số hợp đồng',
                        binding: 'BizDocNo',
                        width: 150
                    }
                ]
            },
            title: {
                cols: 2,
                row: {
                    0: [
                        {
                            label: "",
                            style: "color: green;text-align: center",
                            styleobject: { "color": "blue", "text-align": "left" },
                            colspan: 12,
                            col: 1
                        }
                    ],
                    1: [
                        {
                            label: "BÁO CÁO ĐÁNH GIÁ ĐỐI TÁC",
                            style: "text-align: center;",
                            styleobject: { "text-align": "center", "color": "blue", "font-size": "14pt" },
                            colspan: 12,
                            height: 50,
                            col: 1
                        }
                    ]
                }
            }
        }
    ]
}
