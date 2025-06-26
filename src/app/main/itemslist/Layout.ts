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
import { Global } from "../../shared/global";

// Danh mục vật tư, hàng hóa
export class LayoutItemsListExplorer implements IExplorerFormulaDeclaration {
    layout = {
        Structure: {
            Parent: {
                Name: 'vB20Item_Explore',
                FilterKey: "IsActive=1 AND IsShowMenuWeb=1 AND IsGroup=0",
                OrderBy: 'ParentParentName,ParentName,Name',
                RowPage: 100
            }
        },
        PrintDocument: {
            Key: 'BizDocCCMViewer',
            Text: 'KLTT ĐTC- {VAR=TenGoiThau} - {VAR=CustomerName}',
            Command: 'usp_B30BizDocCCM_VoucherForm',
            PrintGrid: [
                {
                    header: 'STT',
                    binding: 'ItemNo',
                    width: 70,
                    dataType: 'String'
                },
                {
                    header: 'Giá trị thực hiện',
                    binding: 'Amount_Th',
                    width: 110,
                    dataType: 'Number'
                }
            ]
        },
        CopiedValues: {
            parameter: { 'Commandkey': 'itemslist-editor', 'ParentCode': '{EXPR=ParentCode}', 'ParentId': '{EXPR=ParentId}' }
        }
    }

    lookup1 = {
        Table: 'vB20Item_MenuFilter',
        Filter: "IsGroup=1 AND IsActive=1 AND ClassCode3 = 'TM'",
        ColumnFilter: 'ParentCode'
    }

    lookup3 = {
        Table: 'B00TMCtcDocStatus',
        Filter: "CommandWeb = 'rowsPage'",
    }

    parentGrid = [
        {
            header: 'Mã vật tư',
            binding: 'Code',
            width: 180,
            dataType: 'String'
        },
        {
            header: 'Tên vật tư',
            binding: 'Name',
            width: 700,
            dataType: 'String'
        },
        {
            header: 'Nhóm hàng',
            binding: 'ParentName',
            width: 150,
            dataType: 'String'
        },
        {
            header: 'Đvt',
            binding: 'Unit',
            width: 80,
            dataType: 'String'
        },
        {
            header: 'Đvt quy đổi',
            binding: 'Unit0',
            width: 100,
            dataType: 'String'
        },
        // {
        //     header: 'Hệ số quy đổi',
        //     binding: 'ConvertRate0',
        //     width: 120,
        //     dataType: 'Number',
        //     format: 'N4'
        // },
        // {
        //     header: 'Ngừng KD',
        //     binding: 'IsStopBusiness',
        //     width: 100,
        //     dataType: 'Boolean'
        // },
        // {
        //     header: 'Giá theo quy đổi',
        //     binding: 'CalPriceByExchange',
        //     width: 130,
        //     dataType: 'Boolean'
        // },
        // {
        //     header: 'Tên vật tư đại diện',
        //     binding: 'ProductItemName',
        //     width: 300,
        //     dataType: 'String'
        // },
        {
            header: 'Id_',
            binding: 'Id',
            width: 0,
            dataType: 'Number'
        }
    ]
}

export class LayoutItemsListEditor implements IEditorFormulaDeclaration {

    linkReporter: any;

    constructor(private srv?: any,
        private parentData?: any) { }

    layout = {
        Structure: {
            Parent: {
                Name: 'vB20Item_EditWeb',//vB20Item_TMEdit
                DefaultValues: {
                    BranchCode: '{VAR=Branch.Ma_Dvcs}',
                    Id: -1,
                    ItemType: '2',
                    ConvertRate0: 1,
                    IsShowMenuWeb: 1,
                    IsGroup: 0,
                    ParentId: -1
                }
            },
            Child: [
                {
                    Name: 'B30BizDocSalesman',
                    ParentKey: 'Id',
                    ChildKey: 'ParentId',
                    DefaultValues: {
                    }
                }
            ]
        }
    }

    evaluators = {
        'Evaluator_ServerConstraint_Check_CodeUnique': {
            EvaluatorName: 'EvaluatorValidate',
            ConstraintKey: 'Code,{VAR=ColumnName_Code},{VAR=TableName_B20Item},Id,CreatedAt',
            Command: 'usp_COTECCONS_UniqueCatg',
            MessageText: 'Mã - đã có giá trị tương tự',
            IgnoreError: 0
        },
        'Evaluator_ServerUpdated_CreateCode': {
            EvaluatorName: "EvaluatorQuery",
            ConstraintKey: "Id",
            Command: "usp_SOL_B20Item_CreateCode"
        },
        Evaluator_ServerConstraint_CreateCode: {
            EvaluatorName: "EvaluatorQuery",
            ConstraintKey: "SizeCode,SpeciesCode,SurfaceCode",
            Command: "usp_SOL_B20Item_CreateInfo",
            DataMember: "Code,Name",
            zExpr: "(ParentCode=='BETONG')"
        }
        // 'Evaluator_ServerConstraint_Change_ConvertRate0': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: 'PhiThep,Length,{VAR=Branch.Ma_Dvcs}',
        //     Command: 'ufn_TMCtc_TrongLuongThepQuyDoi',
        //     DataMember: 'ConvertRate0',
        //     zExpr: "PhiThep != '' && Length != 0"
        // },
        // 'Evaluator_ServerConstraint_CreateItemName_GachOpLat': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: 'TradeMarkCode,GenusList,SizeList,ColorList',
        //     Command: 'usp_TMCtc_CreateItemName_GachOpLat',
        //     DataMember: 'Name',
        //     zExpr: "ParentId=='9126'"
        // },
        // 'Evaluator_ServerConstraint_CreateItemName_OngThep': {
        //     EvaluatorName: 'EvaluatorQuery',
        //     ConstraintKey: 'InfoTM1,DiameterOut,DiameterIn,Length',
        //     Command: 'usp_TMCtc_CreateItemName_OngThep',
        //     DataMember: 'Name',
        //     zExpr: "ParentId=='9127'"
        // },

    }

    serverConstraint = [

    ]

    serverUpdating = [
        'Evaluator_ServerConstraint_Check_CodeUnique'
    ]

    serverUpdated: string[] = [
        'Evaluator_ServerUpdated_CreateCode'
    ]

    buttonLoadChild: string[] = [
        // 'Evaluator_ServerConstraint_CreateItemName_GachOpLat',
        // 'Evaluator_ServerConstraint_CreateItemName_OngThep'
    ];

    buttonCommand: string[] = [

    ]

    importCommand: string[] = [

    ]

    columnChanged = {
        SizeCode: {
            Evaluators: [
              "Evaluator_ServerConstraint_CreateCode"
            ]
          },
          SpeciesCode: {
            Evaluators: [
              "Evaluator_ServerConstraint_CreateCode"
            ]
          },
          SurfaceCode: {
            Evaluators: [
              "Evaluator_ServerConstraint_CreateCode"
            ]
          }
        // PhiThep: {
        //     Evaluators: [
        //         'Evaluator_ServerConstraint_Change_ConvertRate0'
        //     ]
        // },
        // Length: {
        //     Evaluators: [
        //         'Evaluator_ServerConstraint_Change_ConvertRate0'
        //     ]
        // }
    };

    columnChangedChild = [
        // {
        //     Tables: 0,
        //     columnChanged: {
        //     }
        // }
    ];

    columnsReadOnly = [];

    panels: PanelBase[] = [
        new TablePanel({
            label: 'Panel 1',
            col: 12,
            controls: [
                new LookupBoxInput({
                    key: 'ParentCode',
                    label: 'Nhóm hàng',
                    lookupKey: 'Item',
                    lookupfilter: "IsGroup=1 AND IsActive=1",
                    hideValueMember: true,
                    binding: {
                        Id: 'ParentId',
                        IsSpeciesCode: 'IsSpeciesCode',
                        IsSizeCode: 'IsSizeCode',
                        IsProportionCode: 'IsProportionCode',
                        IsSurfaceCode: 'IsSurfaceCode',
                        IsAbrasionCode: 'IsAbrasionCode',
                        IsEmissionsCode: 'IsEmissionsCode',
                        IsTradeMarkCode: 'IsTradeMarkCode',
                        IsSupProductCode: 'IsSupProductCode',
                        IsOriginCode: 'IsOriginCode',
                        IsShadeColor: 'IsShadeColor'
                    },
                    col: 6,
                    validators: [Validators.required],
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'Code',
                    label: 'Mã sản phẩm',
                    type: 'text',
                    validators: [Validators.required],
                    col: 6,
                    isDisabled: "{EXPR=ParentCode}=='BETONG'",
                    isNewRow: true
                }),
                new LookupBoxInput({
                    key: 'SpeciesCode',
                    label: 'Chủng loại',
                    lookupKey: 'Species',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ItemGroupCode='{EXPR=ParentCode}'",
                    hideValueMember: true,
                    binding: {
                    },
                    col: 6,
                    visible: "{EXPR=IsSpeciesCode} == 1"
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'SizeCode',
                    label: 'Kích thước',
                    lookupKey: 'Size',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ItemGroupCode='{EXPR=ParentCode}'",
                    hideValueMember: true,
                    binding: {
                    },
                    col: 6,
                    visible: "{EXPR=IsSizeCode} == 1"
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'SurfaceCode',
                    label: 'Bề mặt',
                    lookupKey: 'Surface',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ItemGroupCode='{EXPR=ParentCode}'",
                    hideValueMember: true,
                    binding: {
                    },
                    col: 6,
                    visible: "{EXPR=IsSurfaceCode} == 1"
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'ProportionCode',
                    label: 'Tỉ trọng',
                    lookupKey: 'Class',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='TiTrong'",
                    hideValueMember: true,
                    binding: {
                    },
                    col: 6,
                    visible: "{EXPR=IsProportionCode} == 1"
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'AbrasionCode',
                    label: 'Độ mài mòn',
                    lookupKey: 'Class',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='DoMaiMon'",
                    hideValueMember: true,
                    binding: {
                    },
                    col: 6,
                    visible: "{EXPR=IsAbrasionCode} == 1"
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'EmissionsCode',
                    label: 'Phát thải',
                    lookupKey: 'Class',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ParentCode='DoPhatThai'",
                    hideValueMember: true,
                    binding: {
                    },
                    col: 6,
                    visible: "{EXPR=IsEmissionsCode} == 1"
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'TradeMarkCode',
                    label: 'Thương hiệu',
                    lookupKey: 'TradeMark',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ItemGroupCode='{EXPR=ParentCode}'",
                    hideValueMember: true,
                    binding: {
                    },
                    col: 6,
                    visible: "{EXPR=IsTradeMarkCode} == 1"
                }, this.srv, this.parentData),
                new LookupBoxInput({
                    key: 'OriginCode',
                    label: 'Xuất xứ',
                    lookupKey: 'Class',
                    lookupfilter: "IsGroup=0 AND IsActive=1 AND ItemGroupCode='XuatXu'",
                    hideValueMember: true,
                    binding: {
                    },
                    col: 6,
                    visible: "{EXPR=IsOriginCode} == 1"
                }, this.srv, this.parentData),
                new TextBoxInput({
                    key: 'ShadeColor',
                    label: 'Shade màu',
                    col: 6,
                    visible: "{EXPR=IsShadeColor} == 1"
                }),
                new TextBoxInput({
                    key: 'ExpandInfo',
                    label: 'Thông tin khác',
                    isNewRow: true,
                    col: 12,
                    visible: "'{EXPR=ParentCode}' == 'POT-05'"
                }),
                new TextBoxInput({
                    key: 'Name',
                    label: 'Tên mặt hàng',
                    validators: [Validators.required],
                    isNewRow: true,
                    col: 12
                }),
                new TextBoxInput({
                    key: 'Name2',
                    label: 'Tên xuất hóa đơn',
                    isNewRow: true,
                    col: 12
                }),
                new TextBoxInput({
                    key: 'Unit',
                    label: 'Đơn vị tính',
                    validators: [Validators.required],
                    col: 6
                }),
                new LookupBoxInput({
                    key: 'ItemGroupCode',
                    label: 'Nhóm sản phẩm',
                    lookupKey: 'ItemGroup',
                    lookupfilter: "IsGroup=0 AND IsActive=1",
                    hideValueMember: true,
                    binding: {
                    },
                    col: 6,
                    validators: [Validators.required]
                }, this.srv, this.parentData),                
                new TextBoxInput({
                    key: 'Unit0',
                    label: 'Đơn vị quy đổi',
                    col: 6
                }),
                new NumberBoxInput({
                    key: 'ConvertRate0',
                    label: 'Hệ số quy đổi',
                    dataType: 'Number',
                    format: 'N5',
                    col: 6
                }),
                // new LookupBoxInput({
                //     key: 'PhiThep',
                //     label: 'Tiêu chuẩn',
                //     lookupKey: 'BaremC01',
                //     lookupfilter: "IsActive=1 AND IdItemGroupCode='{EXPR=ParentId}'",
                //     hideValueMember: true,
                //     binding: {
                //     },
                //     col: 6
                // }, this.srv, this.parentData),
                new CheckBoxInput({
                    key: 'IsStopBusiness',
                    label: 'Vật tư ngừng KD',
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'IsShowMenuWeb',
                    label: 'Hiển thị để đặt hàng',
                    col: 6
                }),
                new CheckBoxInput({
                    key: 'IsSizeCode',
                    label: 'IsSizeCode',
                    col: 6,
                    visible: 'false'
                }),
                new CheckBoxInput({
                    key: 'IsSpeciesCode',
                    label: 'IsSpeciesCode',
                    col: 6,
                    visible: 'false'
                }),
                new CheckBoxInput({
                    key: 'IsProportionCode',
                    label: 'IsProportionCode',
                    col: 6,
                    visible: 'false'
                }),
                new CheckBoxInput({
                    key: 'IsSurfaceCode',
                    label: 'IsSurfaceCode',
                    col: 6,
                    visible: 'false'
                }),
                new CheckBoxInput({
                    key: 'IsAbrasionCode',
                    label: 'IsAbrasionCode',
                    col: 6,
                    visible: 'false'
                }),
                new CheckBoxInput({
                    key: 'IsEmissionsCode',
                    label: 'IsEmissionsCode',
                    col: 6,
                    visible: 'false'
                }),
                new CheckBoxInput({
                    key: 'IsTradeMarkCode',
                    label: 'IsTradeMarkCode',
                    col: 6,
                    visible: 'false'
                }),
                new CheckBoxInput({
                    key: 'IsSupProductCode',
                    label: 'IsSupProductCode',
                    col: 6,
                    visible: 'false'
                }),
                new CheckBoxInput({
                    key: 'IsOriginCode',
                    label: 'IsOriginCode',
                    col: 6,
                    visible: 'false'
                }),
                new CheckBoxInput({
                    key: 'IsShadeColor',
                    label: 'IsShadeColor',
                    col: 6,
                    visible: 'false'
                }),
                new NumberBoxInput({
                    key: 'ParentId',
                    label: 'ParentId',
                    isNewRow: false,
                    visible: 'false',
                    format: 'n2',
                    col: 6
                }),
                // new UploadImage({
                //     key: 'ImagePath',
                //     label: 'Hình ảnh',
                //     col: 6
                // }, this.srv)
            ]
        })
    ];

    childColumns = [
        {
            header: 'Cột Id',
            binding: 'Id',
            dataType: 'Number',
            format: 'n0',
            width: 0
        }
    ]
}