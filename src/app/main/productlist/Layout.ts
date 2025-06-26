import { PanelBase } from "../../ui/panel/PanelBase";
import { TablePanel } from "../../ui/panel/TablePanel";
import { DateBoxInput } from "../../ui/input/DateBoxInput";
import { TextBoxInput } from "../../ui/input/TextBoxInput";
import { LookupBoxInput } from "../../ui/input/LookupBoxInput";
import { Validators } from "@angular/forms";
import { ButtonInput } from "../../ui/input/ButtonInput";
import { CheckBoxInput } from "../../ui/input/CheckBoxInput";
import { NumberBoxInput } from "../../ui/input/NumberBoxInput";
import { IEditorFormulaDeclaration } from ".././IEditorDeclare";
import { IExplorerFormulaDeclaration } from ".././IExplorerDeclare";
import { UploadInput } from "../../ui/input/UploadInput";
import { MultiSelectInput } from "../../ui/input/MultiSelectInput";
import { SystemConstants } from "../../core/common/system.constants";
import { UploadImage } from "../../ui/input/UploadImage";
import { getElement } from "wijmo/wijmo";
import { RichTextBoxInput } from "../../ui/input/RichTextBoxInput";

// constructor(private srv?: any,
//     private parentData?: any) {
// }

// ProductList
export class LayoutProductListExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB20Product',
                FilterKey: "IsActive = 1 AND ISNULL(BranchCode,'') = '{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')) OR RowId IN (SELECT RowId FROM  dbo.ufn_Coteccons_DuAn_Theo_NhanVien('{VAR=User.Ma_CbNv}')))",
                OrderBy: 'Name',
                RowPage: 1000000,
                DefaultValues: {
                    CurrencyCode: 'VND'
                }
            },
            Child: {
                Name: '',
                ParentKey: '',
                ChildKey: '',
                OrderBy: ''
            }
        },
    }

    parentGrid = [
        {
            header: 'Tên dự án gói thầu',
            binding: 'Name',
            width: 800
        },
        {
            header: 'Năm',
            binding: 'Year',
            width: 100,
            dataType: 'String'
        },
    ]
}

export class LayoutNotificationsExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: '',
                FilterKey: "",
                OrderBy: '',
                RowPage: 50
            }
        },
        CopiedValues: {
            parameter: { 'Commandkey': 'purchasingnote-editor', 'ProductCostId0': '{EXPR=ProductCostId0}', 'ProductCostId1': '{EXPR=ProductCostId}', 'ProductCostId': '{EXPR=ProductCostId1}', 'BizDocId_PO': '{EXPR=BizDocId}', 'CustomerCode': '{EXPR=CustomerCode}' }
        }
    }

    parentGrid = [
        {
            header: 'Loại hồ sơ',
            binding: 'Ten_Ct',
            width: 300,
            align: 'left'
        },
        {
            header: 'Đối tượng',
            binding: 'CustomerName',
            width: 300
        },
        {
            header: 'Nội dung',
            binding: 'Description',
            width: 300
        },
        {
            header: 'Đợt TT',
            binding: 'PayRequireNum',
            width: 80
        },
        {
            header: 'Giá trị đề nghị TT',
            binding: 'Amount_DeNghiTT',
            dataType: 'Number',
            format: 'n0',
            width: 150
        },
        {
            header: 'Ngày trưởng đơn vị duyệt',
            binding: 'Ngay_Truong_Don_Vi',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            width: 0
        },
        {
            header: 'Ngày đến hạn',
            binding: 'StartDate',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            width: 120
        },
        {
            header: 'Đến hạn (ngày)',
            binding: 'DayOfDelay',
            dataType: 'Number',
            format: 'n0',
            width: 100
        },
        {
            header: 'Ngày cấp bậc trước duyệt',
            binding: 'Ngay_Cap_Bac_Truoc',
            dataType: 'Date',
            format: 'dd/MM/yyyy',
            textAlign: 'center',
            width: 130
        },
        {
            header: 'Người gửi duyệt',
            binding: 'EmployeeNameSend',
            width: 130
        },
        {
            header: 'Người duyệt tiếp',
            binding: 'EmployeeNameNext',
            width: 150
        },
        {
            header: '_Id',
            binding: 'Id',
            width: 0
        },
        {
            header: 'Kiểu hồ sơ',
            binding: 'DocType',
            width: 0
        },
        {
            header: 'Số hồ sơ',
            binding: 'DocNo',
            width: 0
        },
        // {
        //     header: 'Link',
        //     binding: '_LinkCommandWeb',
        //     width: 0
        // }
    ]
}