import { SystemConstants } from "../core/common/system.constants";
import * as wjcCore from 'wijmo/wijmo';

import * as wjcXlsx from 'wijmo/wijmo.xlsx';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { InputBase } from "../ui/input/InputBase";
import { LookupBoxInput } from "../ui/input/LookupBoxInput";
import { DataSetContract } from "../contracts/dataset.contract";
import { TableContract } from "../contracts/table.contract";
import { ColumnContract } from "../contracts/column.contract";
import { RowContract } from "../contracts/row.contract";
import { DataRowState, BravoCtorEnum } from "../core/enum/type.enum";
import { ParameterContract } from "../contracts/parameter.contract";
import { FormControl } from "@angular/forms";
import * as wjcGridXlsx from 'wijmo/wijmo.grid.xlsx';

export class Global {
  public static get MainEndPoint() {
    return localStorage.getItem(SystemConstants.API_ENDPOINT).replace(/"/gi, '');
  };
  public static get InvEndPoint() {
    return localStorage.getItem(SystemConstants.API_ENDPOINT).replace(/"/gi, '') + '/api/inv/';
  };
  public static get DATA_ENDPOINT() {
    return localStorage.getItem(SystemConstants.API_ENDPOINT).replace(/"/gi, '') + '/api/base/';
  };
  public static get DataExplorerEndpoint() {
    return localStorage.getItem(SystemConstants.API_ENDPOINT).replace(/"/gi, '') + '/api/explorer/';
  };
  public static get DataEditorEndpoint() {
    return localStorage.getItem(SystemConstants.API_ENDPOINT).replace(/"/gi, '') + '/api/editor/';
  };
  public static get LookupEndpoint() {
    return localStorage.getItem(SystemConstants.API_ENDPOINT).replace(/"/gi, '') + '/api/lookup/';
  };
  public static get UploadEndpoint() {
    return localStorage.getItem(SystemConstants.API_ENDPOINT).replace(/"/gi, '') + '/api/File/';
  };
  public static get ImgEndpoint() {
    return localStorage.getItem(SystemConstants.API_ENDPOINT).replace(/"/gi, '') + '/api/File/getImg?name=';
  };
  public static get CertificateAuthorityEndPoint() { return localStorage.getItem(SystemConstants.API_ENDPOINT).replace(/"/gi, '') + '/api/CertificateAuthority/'; };
  public static get MailEndPoint() {
    return localStorage.getItem(SystemConstants.API_ENDPOINT).replace(/"/gi, '') + '/api/mail/';
  };
  public static alertNoClick = 'Chức năng này không khả dụng!';

  public static VAR = {
    '{VAR=Branch.Ma_Dvcs}': {
      Name: 'BranchCode',
      Value: '{VAR=Branch.Ma_Dvcs}'
    },
    '{VAR=User.Id}': {
      Name: 'nUserId',
      Value: '{VAR=User.Id}'
    },
    '{VAR=User.UserName}': {
      Name: 'UserName',
      Value: '{VAR=User.UserName}'
    },
    '{VAR=User.FullName}': {
      Name: 'FullName',
      Value: '{VAR=User.FullName}'
    },
    '{VAR=User.Ma_CbNv}': {
      Name: 'Ma_CbNv',
      Value: '{VAR=User.Ma_CbNv}'
    },
    '{VAR=User.EmployeeCode}': {
      Name: 'EmployeeCode',
      Value: '{VAR=User.Ma_CbNv}'
    },
    '{VAR=User.IsAdmin}': {
      Name: 'IsAdmin',
      Value: '{VAR=User.IsAdmin}'
    },
    '{VAR=LoaiC3}': {
      Name: 'LoaiC3',
      Value: 'C3'
    },
    '{VAR=LoaiC4}': {
      Name: 'LoaiC4',
      Value: 'C4'
    },
    '{VAR=LoaiC34}': {
      Name: 'LoaiC34',
      Value: 'C34'
    },
    '{VAR=DocCodeB2}': {
      Name: 'DocCode',
      Value: 'B2'
    },
    '{VAR=DocCodeB4}': {
      Name: 'DocCode',
      Value: 'B4'
    },
    '{VAR=DocCodeB5}': {
      Name: 'DocCode',
      Value: 'B5'
    },
    '{VAR=DocCodeC3}': {
      Name: 'DocCode',
      Value: 'C3'
    },
    '{VAR=DocCodeC4}': {
      Name: 'DocCode',
      Value: 'C4'
    },
    '{VAR=DocCodeC34}': {
      Name: 'DocCode',
      Value: 'C34'
    },
    '{VAR=TaxRate0}': {
      Name: 'TaxRate',
      Value: '0'
    },
    '{VAR=CompareOperator_Gt}': {
      Name: 'CompareOperator',
      Value: '>'
    },
    '{VAR=EmptyField_ParentBizDocId}': {
      Name: 'ParentBizDocId',
      Value: ""
    },
    '{VAR=EmptyField_CustomerCode}': {
      Name: 'CustomerCode',
      Value: ""
    },
    '{VAR=ParentBizDocId}': {
      Name: 'ParentBizDocId',
      Value: "CTC"
    },
    //để sinh BuiltinOder theo tables
    '{VAR=TableNames_B30CCMBudgetDetail}': {
      Name: 'TableNames',
      Value: 'B30CCMBudgetDetail'
    },
    '{VAR=Keys_B30CCMBudgetDetail}': {
      Name: 'Keys',
      Value: 'CCMBudgetId'
    },
    '{VAR=FieldOrders_B30CCMBudgetDetail}': {
      Name: 'FieldOrders',
      Value: 'ItemNo'
    },
    '{VAR=TableNames_B30EquiBudgetDetail}': {
      Name: 'TableNames',
      Value: 'B30EquiBudgetDetail'
    },
    '{VAR=Keys_B30EquiBudgetDetail}': {
      Name: 'Keys',
      Value: 'EquiBudgetId'
    },
    '{VAR=FieldOrders_B30EquiBudgetDetail}': {
      Name: 'FieldOrders',
      Value: 'ItemNo'
    },
    '{VAR=FieldOrders2_B30CCMBudgetDetail}': {
      Name: 'FieldOrders',
      Value: 'EstimatedTimeDelivery'//'JobCode'
    },
    '{VAR=EmptyField_CCMBudgetId}': {
      Name: 'CCMBudgetId',
      Value: ""
    },

    '{VAR=TableNames_B30BizDocCCMDetail}': {
      Name: 'TableNames',
      Value: 'B30BizDocCCMDetail'
    },
    '{VAR=TableNames_B30BizDocCCMDetail01}': {
      Name: 'TableNames',
      Value: 'B30BizDocCCMDetail01'
    },
    '{VAR=TableNames_B30BizDocCCMDetail02}': {
      Name: 'TableNames',
      Value: 'B30BizDocCCMDetail02'
    },
    '{VAR=TableNames_B30BizDocCCMDetail03}': {
      Name: 'TableNames',
      Value: 'B30BizDocCCMDetail03'
    },
    '{VAR=TableNames_B30BizDocCCMDetail04}': {
      Name: 'TableNames',
      Value: 'B30BizDocCCMDetail04'
    },
    '{VAR=Keys_B30BizDocCCMDetail}': {
      Name: 'Keys',
      Value: 'BizDocId'
    },
    '{VAR=FieldOrders_B30BizDocCCMDetail}': {
      Name: 'FieldOrders',
      Value: 'ItemNo'
    },
    '{VAR=EmptyField_BizDocId}': {
      Name: 'BizDocId',
      Value: ""
    },
    '{VAR=EmptyField_EquiBudgetId}': {
      Name: 'EquiBudgetId',
      Value: ""
    },
    '{VAR=IsGetPayment_True}': {
      Name: 'IsGetPayment',
      Value: "true"
    },
    '{VAR=IsGetPayment_False}': {
      Name: 'IsGetPayment',
      Value: "false"
    },
    '{VAR=ContractType_BCHPB}': {
      Name: 'ContractType',
      Value: "TT-03"
    },
    '{VAR=ContractType_QT}': {
      Name: 'ContractType',
      Value: "QT-01"
    },
    '{VAR=DocCodeP2}': {
      Name: 'DocCode',
      Value: 'P2'
    },
    '{VAR=DocCodeP4}': {
      Name: 'DocCode',
      Value: 'P4'
    },
    '{VAR=VoucherCode_DN}': {
      Name: 'VoucherCode',
      Value: 'CTC'
    },
    '{VAR=ProductCostId_Empty}': {
      Name: 'ProductCostId',
      Value: "''"
    },
    '{VAR=ColumnName_Code}': {
      Name: 'ColumnName',
      Value: 'Code'
    },
    '{VAR=TableName_B20ReceiptTeam}': {
      Name: 'TableName',
      Value: 'B20ReceiptTeam'
    },
    '{VAR=TableName_B20TradeMark}': {
      Name: 'TableName',
      Value: 'B20TradeMark'
    },
    '{VAR=TableName_B20Item}': {
      Name: 'TableName',
      Value: 'B20Item'
    },
    '{VAR=Filter.ProductCostId}': {
      Name: 'ProductCostId',
      Value: '{VAR=Filter.ProductCostId}'
    },
    '{VAR=TableName_B20SuppInvoice}': {
      Name: 'TableName',
      Value: 'B20SuppInvoice'
    },
    '{VAR=TableName_B20Category}': {
      Name: 'TableName',
      Value: 'B20Category'
    },
    '{VAR=TableNames_B30BizDocDetail}': {
      Name: 'TableNames',
      Value: 'B30BizDocDetail'
    }
  }

  static displayReviver(value) {
    if (typeof value === 'string') {
      var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(?:([\+-])(\d{2})\:(\d{2}))?Z?$/.exec(value);
      if (a) {
        var date = new Date(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]);
        return date;
      }
    }
    return value;
  }

  static valueReviver(value) {
    if (typeof value === 'string') {
      var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(?:([\+-])(\d{2})\:(\d{2}))?Z?$/.exec(value);
      if (a) {
        var date = new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
        return date;
      }
    }
    return value;
  }

  static convertConfig(key: string) {
    let today = new Date();
    let date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()));
    // console.log(date.getTime());
    // console.log((<Date>Global.valueReviver(localStorage.getItem(SystemConstants.LAST_ACTION_AT))).getTime());
    // console.log(date.getTime() - (<Date>Global.valueReviver(localStorage.getItem(SystemConstants.LAST_ACTION_AT))).getTime());
    let date2: any = localStorage.getItem(SystemConstants.LAST_ACTION_AT);
    if (date2 == undefined)
      date2 = date;
    else
      date2 = <Date>Global.valueReviver(date2);

    if ((date.getTime() - date2.getTime()) > 7200000) {
      if (location.href.indexOf('login') < 0) {
        alert('Phiên làm việc đã hết hiệu lực. Vui lòng đăng nhập lại.');

        let _sso_data = JSON.parse(localStorage.getItem(SystemConstants.SSO_DATA));
        if (_sso_data) {
          localStorage.removeItem(SystemConstants.RETURN_URL);
          localStorage.removeItem(SystemConstants.CURRENT_USER);
          localStorage.removeItem(SystemConstants.CURRENT_BRANCH);
          localStorage.removeItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE);
          localStorage.removeItem(SystemConstants.PERMISSION_DATA);
          localStorage.removeItem(SystemConstants.MODULE_ALLOW);
          localStorage.removeItem(SystemConstants.PARAMETER_LINKREPORT);
          localStorage.removeItem(SystemConstants.PRODUCTCOSTID);
          localStorage.removeItem(SystemConstants.PRODUCTNAME);
          localStorage.removeItem(SystemConstants.PERMISSION_DATA_POSITION);
          localStorage.setItem(SystemConstants.LINKREDIRECT, '');

          window.location.href = (<string>_sso_data['Logout']).replace("{clientId}", _sso_data['ClientId']).replace("{urlApp}", _sso_data['UrlApp']);
        }
        // else
        //   location.replace('#/login');
        window.location.href = "https://cfms.newtecons.vn";
      }
    }

    let date3: Date = null
    if(localStorage.getItem(SystemConstants.CURRENT_USER)){
      date3 = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER))[".issued"];
    }
     
    let date4 = new Date(date3);

    // if ((date.getTime() - date4.getTime()) > 3600000) {
    //   if (location.href.indexOf('login') < 0) {
    //     alert('Thời gian máy trạm khác với thời gian hệ thống, vui lòng thay đổi thiết lập!');
    //     location.replace('#/login');
    //   }
    // }

    localStorage.setItem(SystemConstants.LAST_ACTION_AT, date.toISOString());

    if (key != "") {
      key = key.replace(/{VAR=Branch.Ma_Dvcs}/gi, JSON.parse(localStorage.getItem(SystemConstants.CURRENT_BRANCH)));
      key = key.replace(/{VAR=User.Id}/gi, JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USERID)));
      key = key.replace(/{VAR=User.UserName}/gi, JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USERNAME)));
      key = key.replace(/{VAR=User.Ma_CbNv}/gi, JSON.parse(localStorage.getItem(SystemConstants.CURRENT_EMPLOYEE)));
      key = key.replace(/{VAR=User.IsAdmin}/gi, JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USERISADMIN)));
      key = key.replace(/{VAR=User.FullName}/gi, JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USERFULLNAME)));

      let _filterProductCostId = '', _filterProductCostIdParent = ''
      if (localStorage.getItem(SystemConstants.PRODUCTCOSTID) != null || localStorage.getItem(SystemConstants.PRODUCTCOSTID) != undefined) {
        _filterProductCostId = localStorage.getItem(SystemConstants.PRODUCTCOSTID);
      }
      if (localStorage.getItem(SystemConstants.PRODUCTCOSTID_PARENT) != null || localStorage.getItem(SystemConstants.PRODUCTCOSTID_PARENT) != undefined) {
        _filterProductCostIdParent = localStorage.getItem(SystemConstants.PRODUCTCOSTID_PARENT);
      }
      key = key.replace(/{VAR=Filter.ProductCostId}/gi, _filterProductCostId);
      key = key.replace(/{VAR=Filter.ProductCostIdParent}/gi, _filterProductCostIdParent);

    }

    return key;
  }

  static getPermission(commandKey: string, option?: string) {

    let _result = true;
    let _permission = <Array<Object>>JSON.parse(localStorage.getItem(SystemConstants.PERMISSION_DATA));

    for (let i in _permission) {
      if (_permission[i]['CommandKey'] == commandKey) {
        _result = Boolean(_permission[i][option]);
      }
    }

    return _result;
  }

  static getPermissionPosition(commandKey: string, option?: string) {

    let _result = true;
    let _permission = <Array<Object>>JSON.parse(localStorage.getItem(SystemConstants.PERMISSION_DATA_POSITION));

    for (let i in _permission) {
      if (_permission[i]['CommandKey'] == commandKey) {
        _result = Boolean(_permission[i][option]);
      }
    }

    let _arrayuser = ['233', '234', '235', '236', '249', '364', '2233', '2742'];
    if (_arrayuser.indexOf(localStorage.getItem(SystemConstants.CURRENT_USERID)) < 0) {
      if (localStorage.getItem(SystemConstants.PRODUCTCOSTID) == '' || localStorage.getItem(SystemConstants.PRODUCTCOSTID) == undefined || localStorage.getItem(SystemConstants.PRODUCTCOSTID) == null) {
        _result = false;
      }
    }

    return _result;
  }

  static getPermissionPosition_New(data: any, commandKey: string, option?: string) {

    let _result = true;
    //let _permission = <Array<Object>>JSON.parse(localStorage.getItem(SystemConstants.PERMISSION_DATA_POSITION));

    for (let i in data) {
      if (data[i]['CommandKey'] == commandKey) {
        _result = Boolean(data[i][option]);
      }
    }

    return _result;
  }

  static getPermissionAll(data1: any, data2: any, commandKey: string, option?: string) {
    let _result = false;
    //let _permission = <Array<Object>>JSON.parse(localStorage.getItem(SystemConstants.PERMISSION_DATA_POSITION));

    let _allow1 = null;
    let _allow2 = false;
    for (let i in data1) {
      if (data1[i] != undefined && data1[i] != null)
        if (data1[i]['CommandKey'] == commandKey) {
          _allow1 = Boolean(data1[i][option]);
        }
    }

    for (let j in data2) {
      if (data2[j] != undefined && data2[j] != null)
        if (data2[j]['CommandKey'] == commandKey) {
          _allow2 = Boolean(data2[j][option]);
        }
    }

    if (_allow1 != null) {
      if (_allow1 && _allow2)
        _result = true;
      else if (_allow1 && !_allow2)
        _result = true;
      else if (!_allow1 && _allow2)
        _result = false;
      else _result = false;
    }
    else {
      _result = _allow2;
    }

    return _result;
  }

  //Dương thêm 
  static translateAutoText(expr: string, row: any, extraRow?: any): string {
    let _result = expr;

    let controls: string[] = [];

    for (const control in row) {
      controls.push(control);
    }

    if (extraRow) {
      for (const control in extraRow) {
        controls.push(control);
      }
    }

    controls.sort((a, b) => b.length - a.length);

    for (const control of controls) {
      let patern = '{EXPR=' + control + '}';
      if (_result.toString().indexOf(patern) > -1) {
        // console.log(row);
        // console.log(extraRow);
        let value = row[control];
        // console.log(value);
        if (value == undefined)
          value = extraRow[control];

        if (value instanceof Date) {
          if (value != null)
            value = value.toISOString();
        }
        else
          if (value instanceof Array) {
            value = value.copyWithin(0, 0);
            let arr = [];
            for (let i in value) {
              arr.push(value[i]['ValueMember']);
            }
            value = arr.join(',');
          }

        do {
          _result = _result.replace(patern, value);
        }
        while (_result.indexOf(patern) > -1)
      }
    }

    return _result;
  }

  static translate_expr_control(expr, row: any, child?: any) {
   let _result = expr;
   if (child != undefined) {
     if (!expr) { return true; }

     let controls: string[] = [];

     if (child)
       for (const control in child) {
         controls.push(control);
       }

     for (const control in row) {
       controls.push(control);
     }
     controls.sort((a, b) => b.length - a.length);

     for (const control of controls) {
       let patern = '{EXPR=' + control + '}';
       if (_result.indexOf(patern) > -1) {

         let value = row[control];
         if (value == undefined)
           value = child[control];

         if (value instanceof Date) {
           if (value != null)
             value = '\'' + value.toISOString() + '\'';
         } else {

           value = this.replaceDecimal(value);
         }
         do {
           _result = _result.replace(patern, value);
         }
         while (_result.indexOf(patern) > -1)
       }
     }

     if (_result.indexOf(' AND ') > -1) {
       _result = _result.split(' AND ').join(' && ');
     }
     if (_result.indexOf(' OR ') > -1) {
       _result = _result.split(' OR ').join(' || ');
     }
   }
   return _result;

 }

 static replaceDecimal(value) {
   const _var = typeof (value);
   if (!value) {
     return '0';
     // return '\'\'';
   }
   let _val = value;
   if (value instanceof String) {
     if (!value.startsWith('\0'))
       _val = Number(value.split(',').join(''));
   }

   if (isNaN(_val)) {
     return '\'' + value + '\'';
   } else {
     return _val;
   }
 }
  static translateOutput(expr, row: any) {
    let _result = expr;

    let controls: string[] = [];

    for (const control in row) {
      if (control.startsWith('@_', 0))
        controls.push(control.substring(2, control.length));
    }
    controls.sort((a, b) => b.length - a.length);

    for (const control of controls) {
      let patern = '{VAR=' + control + '}';

      if (_result.indexOf(patern) > -1) {

        let value = row['@_' + control];

        if (value instanceof Date) {
          if (value != null)
            value = value.toLocaleDateString();
        }


        if (wjcCore.isNumber(value)) {
          if (value != null && value != '0') {
            value = this.formatFactory(value);
          }
        }

        do {
          _result = _result.replace(patern, value);
        }
        while (_result.indexOf(patern) > -1)
      }
    }

    return _result;

  }

  static translate_Parameter_linkCommand(expr, row: any, child?: any) {
   let _result = expr;
   if (child != undefined) {
     if (!expr) { return true; }

     let controls: string[] = [];

     if (child)
       for (const control in child) {
         controls.push(control);
       }

     for (const control in row) {
       controls.push(control);
     }
     controls.sort((a, b) => b.length - a.length);

     for (const control of controls) {
       let patern = '{EXPR=' + control + '}';
       if (_result.indexOf(patern) > -1) {

         let value = row[control];
         if (value == undefined)
           value = child[control];

         if (value instanceof Date) {
           if (value != null)
             value = '\'' + value.toISOString() + '\'';
         }
         do {
           _result = _result.replace(patern, value);
         }
         while (_result.indexOf(patern) > -1)
       }
     }

     if (_result.indexOf(' AND ') > -1) {
       _result = _result.split(' AND ').join(' && ');
     }
     if (_result.indexOf(' OR ') > -1) {
       _result = _result.split(' OR ').join(' || ');
     }
   }
   return _result;

 }

  static formatFactory(value: number | string, fractionSize: number = 0): string {
    let [integer, fraction = ""] = (value || "").toString()
      .split('.');

    fraction = fractionSize > 0
      ? ',' + (fraction + '000000').substring(0, fractionSize)
      : "";

    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    if (integer == '') {
      fraction = ''
    }
    return integer + fraction;
  }

  static getModule(dashboard: string, userId: string) {

    let _result = '';
    let _permission = <Array<Object>>JSON.parse(localStorage.getItem(SystemConstants.PERMISSION_DATA));

    for (let i in _permission) {
      if (_permission[i]['CommandKey'] == dashboard && _permission[i]['UserId'] == userId) {
        _result = _permission[i]['Module']
      }
    }

    return _result;
  }

  static createWorkBook(title: string, controls: any[], dataParent: any, gridChild: wjcGrid.FlexGrid): wjcXlsx.IWorkbook {

    // Namespace and XlsxConverter shortcuts.
    var xcNs = wjcXlsx;
    var book = new xcNs.Workbook();
    var dateFormat = xcNs.Workbook.toXlsxDateFormat('d'),
      stdNumWidth = 100,
      simpleCaptionStyle = new xcNs.WorkbookStyle(),
      accentCaptionStyle = new xcNs.WorkbookStyle(),
      totalCaptionStyle = new xcNs.WorkbookStyle(),
      valueStyle = new xcNs.WorkbookStyle(),
      highlightedValueStyle = new xcNs.WorkbookStyle(),
      tableHeaderStyle = new xcNs.WorkbookStyle(),
      tableFooterCurrencyStyle = new xcNs.WorkbookStyle(),
      tableValueStyle = new xcNs.WorkbookStyle(),
      alterTableValueStyle = new xcNs.WorkbookStyle(),
      tableDateStyle = new xcNs.WorkbookStyle(),
      tableCurrencyStyle = new xcNs.WorkbookStyle(),
      tableIntegerStyle = new xcNs.WorkbookStyle(),
      tableTextStyle = new xcNs.WorkbookStyle(),
      alterTableDateStyle = new xcNs.WorkbookStyle(),
      alterTableCurrencyStyle = new xcNs.WorkbookStyle(),
      alterTableIntegerStyle = new xcNs.WorkbookStyle(),
      alterTableTextStyle = new xcNs.WorkbookStyle(),
      valueDateStyle = new xcNs.WorkbookStyle(),
      valueCurrencyStyle = new xcNs.WorkbookStyle(),
      valueIntegerStyle = new xcNs.WorkbookStyle();

    simpleCaptionStyle.hAlign = xcNs.HAlign.Right;

    accentCaptionStyle.font = new xcNs.WorkbookFont();
    accentCaptionStyle.font.color = '#808097';

    totalCaptionStyle.basedOn = simpleCaptionStyle;
    totalCaptionStyle.font = new xcNs.WorkbookFont();
    totalCaptionStyle.font.bold = true;
    totalCaptionStyle.hAlign = xcNs.HAlign.Right;

    valueStyle.font = new xcNs.WorkbookFont();
    valueStyle.font.family = 'Arial';
    valueStyle.vAlign = xcNs.VAlign.Center;
    valueStyle.indent = 1;

    highlightedValueStyle.basedOn = valueStyle;
    highlightedValueStyle.fill = new xcNs.WorkbookFill();
    highlightedValueStyle.fill.color = '#e1e1e1';

    tableHeaderStyle.font = new xcNs.WorkbookFont();
    tableHeaderStyle.font.bold = true;
    tableHeaderStyle.fill = new xcNs.WorkbookFill();
    tableHeaderStyle.fill.color = '#f0ffff';

    tableFooterCurrencyStyle.basedOn = tableHeaderStyle;
    tableFooterCurrencyStyle.format = xcNs.Workbook.toXlsxNumberFormat('c2');
    tableFooterCurrencyStyle.hAlign = xcNs.HAlign.Right;

    tableValueStyle.fill = new xcNs.WorkbookFill();
    tableValueStyle.fill.color = '#ffffe6';
    tableValueStyle.indent = 1;
    tableValueStyle.wordWrap = true;
    tableValueStyle.vAlign = xcNs.VAlign.Center;

    alterTableValueStyle.fill = new xcNs.WorkbookFill();
    alterTableValueStyle.fill.color = '#fff';
    alterTableValueStyle.indent = 1;
    alterTableValueStyle.wordWrap = true;
    alterTableValueStyle.vAlign = xcNs.VAlign.Center;

    tableDateStyle.basedOn = tableValueStyle;
    tableDateStyle.format = xcNs.Workbook.toXlsxDateFormat('dd/MM/yyyy');

    tableCurrencyStyle.basedOn = tableValueStyle;
    tableCurrencyStyle.format = xcNs.Workbook.toXlsxNumberFormat('c2');

    tableIntegerStyle.basedOn = tableValueStyle;
    tableIntegerStyle.format = xcNs.Workbook.toXlsxNumberFormat('#,##0');

    tableTextStyle.basedOn = tableValueStyle;
    tableTextStyle.hAlign = xcNs.HAlign.Left;

    alterTableDateStyle.basedOn = alterTableValueStyle;
    alterTableDateStyle.format = xcNs.Workbook.toXlsxDateFormat('dd/MM/yyyy');

    alterTableCurrencyStyle.basedOn = alterTableValueStyle;
    alterTableCurrencyStyle.format = xcNs.Workbook.toXlsxNumberFormat('c2');

    alterTableIntegerStyle.basedOn = alterTableValueStyle;
    alterTableIntegerStyle.format = xcNs.Workbook.toXlsxNumberFormat('#,##0');

    alterTableTextStyle.basedOn = alterTableValueStyle;
    alterTableTextStyle.hAlign = xcNs.HAlign.Left;

    valueDateStyle.basedOn = valueStyle;
    valueDateStyle.format = xcNs.Workbook.toXlsxDateFormat('dd/MM/yyyy');

    valueCurrencyStyle.basedOn = valueStyle;
    valueCurrencyStyle.format = xcNs.Workbook.toXlsxNumberFormat('c2');

    valueIntegerStyle.basedOn = valueStyle;
    valueIntegerStyle.format = xcNs.Workbook.toXlsxNumberFormat('#,##0');



    var sheet = new xcNs.WorkSheet(),
      rows = sheet.rows;

    book.sheets.push(sheet);
    sheet.name = 'Sheet';

    sheet.columns[0] = new wjcXlsx.WorkbookColumn();
    sheet.columns[0].width = '1ch';
    sheet.columns[1] = new wjcXlsx.WorkbookColumn();
    sheet.columns[2] = new wjcXlsx.WorkbookColumn();
    sheet.columns[3] = new wjcXlsx.WorkbookColumn();
    sheet.columns[4] = new wjcXlsx.WorkbookColumn();
    sheet.columns[5] = new wjcXlsx.WorkbookColumn();
    sheet.columns[6] = new wjcXlsx.WorkbookColumn();
    sheet.columns[7] = new wjcXlsx.WorkbookColumn();
    sheet.columns[8] = new wjcXlsx.WorkbookColumn();
    sheet.columns[9] = new wjcXlsx.WorkbookColumn();
    sheet.columns[10] = new wjcXlsx.WorkbookColumn();
    // rows[0] = new xcNs.WorkbookRow();
    // rows[0].cells[8] = new xcNs.WorkbookCell();
    // rows[0].cells[8].colSpan = 3;
    // rows[0].cells[8].value = 'For Office Use Only';
    // rows[0].cells[8].style = new xcNs.WorkbookStyle();
    // rows[0].cells[8].style.basedOn = highlightedValueStyle;
    // rows[0].cells[8].style.font = new xcNs.WorkbookFont();
    // rows[0].cells[8].style.font.italic = true;

    rows[1] = new xcNs.WorkbookRow();
    rows[1].height = 45;
    rows[1].cells[1] = new xcNs.WorkbookCell();
    rows[1].cells[1].value = title.toUpperCase();
    rows[1].cells[1].colSpan = 10;
    rows[1].cells[1].style = new xcNs.WorkbookStyle();
    rows[1].cells[1].style.basedOn = accentCaptionStyle;
    rows[1].cells[1].style.font = new xcNs.WorkbookFont();
    rows[1].cells[1].style.font.size = 32;
    rows[1].cells[1].style.font.bold = true;

    let index = 3;
    for (let c in dataParent) {
      let _cRow;
      let _cCol;
      let k = index % 1;
      if (k == 0.5) {
        _cRow = index - 0.5;
        _cCol = 6;
      } else {
        _cCol = 1;
        _cRow = index;
      }

      if (rows[_cRow] == undefined)
        rows[_cRow] = new xcNs.WorkbookRow();

      let control = <InputBase<any>>controls.find(control => { return control.key == c });
      rows[_cRow].cells[_cCol] = new xcNs.WorkbookCell();
      rows[_cRow].cells[_cCol].value = control.label + ':';
      rows[_cRow].cells[_cCol].style = accentCaptionStyle;
      rows[_cRow].cells[_cCol].colSpan = 2;

      rows[_cRow].cells[_cCol + 2] = new xcNs.WorkbookCell();
      rows[_cRow].cells[_cCol + 2].colSpan = 2;

      if (control.controlType == 'date') {
        rows[_cRow].cells[_cCol + 2].value = dataParent[c];
        rows[_cRow].cells[_cCol + 2].style = valueDateStyle;
      } else if (control.controlType == 'number') {
        rows[_cRow].cells[_cCol + 2].value = dataParent[c];
        rows[_cRow].cells[_cCol + 2].style = valueIntegerStyle;
      } else if (control.controlType == 'lookup') {
        let lookup = <LookupBoxInput>control;
        let item = lookup.options.sourceCollection.find(item => { return item['ValueMember'] == dataParent[c] });
        let display: string = ''
        if (item)
          display = item['DisplayMember'];
        display = display.replace('<strong>', '');
        display = display.replace('</strong>', '');
        rows[_cRow].cells[_cCol + 2].value = display;
        rows[_cRow].cells[_cCol + 2].style = valueStyle;
      } else {
        rows[_cRow].cells[_cCol + 2].value = dataParent[c].toString();
        rows[_cRow].cells[_cCol + 2].style = valueStyle;
      }
      index += 0.5;
    }
    index += 2;
    index -= index % 1;
    //================ Expense items table ==========================
    // Table header
    rows[index] = new xcNs.WorkbookRow();
    rows[index].style = new xcNs.WorkbookStyle();
    rows[index].style.hAlign = xcNs.HAlign.Center;
    let widthCols = {};

    let dataChild = gridChild.itemsSource.items;
    for (let c in dataChild[0]) {
      let j = gridChild.columns.indexOf(c);
      if (j >= 0) {
        if (j >= 10) {
          sheet.columns[j + 1] = new wjcXlsx.WorkbookColumn();
        }
        rows[index].cells[j + 1] = new xcNs.WorkbookCell();
        let header = gridChild.columns.getColumn(c).header;
        rows[index].cells[j + 1].value = header;
        rows[index].cells[j + 1].style = tableHeaderStyle;
        rows[index].cells[j + 1].colSpan = 1;
        widthCols[j + 1] = header.length + 4;

        // rows[index].cells[j + 1].style.borders = new wjcXlsx.WorkbookBorder();
        // rows[index].cells[j + 1].style.borders.top = new wjcXlsx.WorkbookBorderSetting();
        // rows[index].cells[j + 1].style.borders.top.style = wjcXlsx.BorderStyle.Thin;
        // if (j == 0) {
        //   rows[index].cells[j + 1].style.borders.left = new wjcXlsx.WorkbookBorderSetting();
        //   rows[index].cells[j + 1].style.borders.left.style = wjcXlsx.BorderStyle.Thin;
        // }
      }
    }

    // Table items
    index++;
    for (let i = 0; i < dataChild.length; i++) {
      let rowIdx = index + i;
      rows[rowIdx] = new xcNs.WorkbookRow();
      for (let c in dataChild[i]) {
        let _j = gridChild.columns.indexOf(c)
        if (_j >= 0) {
          rows[rowIdx].cells[_j + 1] = new xcNs.WorkbookCell();
          let _value = dataChild[i][c];
          let leng: number = _value.toString().length + 4;
          if (widthCols == undefined)
            widthCols[_j + 1] = leng;
          else if (leng > widthCols[_j + 1] && leng < 50) {
            widthCols[_j + 1] = leng;
          }
          else if (leng > widthCols[_j + 1] && leng > 50) {
            widthCols[_j + 1] = 50;
            let level = leng / 50;
            if (leng % 50 > 0)
              level++;
            rows[rowIdx].height = level * rows[rowIdx].height;
          }

          let dataType = gridChild.columns.getColumn(c).dataType;
          if (dataType == wjcCore.DataType.Date) {
            rows[rowIdx].cells[_j + 1].value = _value;
            rows[rowIdx].cells[_j + 1].style = i % 2 == 0 ? alterTableDateStyle : tableDateStyle;
          } else if (dataType == wjcCore.DataType.Number) {
            rows[rowIdx].cells[_j + 1].value = _value;
            rows[rowIdx].cells[_j + 1].style = i % 2 == 0 ? alterTableIntegerStyle : tableIntegerStyle;
          } else {
            rows[rowIdx].cells[_j + 1].value = _value.toString();
            rows[rowIdx].cells[_j + 1].style = i % 2 == 0 ? alterTableTextStyle : tableTextStyle;
          }
          rows[rowIdx].cells[_j + 1].colSpan = 1;


          // if(rows[rowIdx].cells[_j + 1].style.borders == undefined)
          //   rows[rowIdx].cells[_j + 1].style.borders = new wjcXlsx.WorkbookBorder();

          // if (_j == 0) {
          //   rows[rowIdx].cells[_j + 1].style.borders.left = new wjcXlsx.WorkbookBorderSetting();
          //   rows[rowIdx].cells[_j + 1].style.borders.left.style = wjcXlsx.BorderStyle.Thin;
          // } else if (_j==gridChild.columns.length-1) {
          //   rows[rowIdx].cells[_j + 1].style.borders.right = new wjcXlsx.WorkbookBorderSetting();
          //   rows[rowIdx].cells[_j + 1].style.borders.right.style = wjcXlsx.BorderStyle.Thin;
          // }
          // if(i == dataChild.length - 1) {
          //   rows[rowIdx].cells[_j + 1].style.borders.bottom = new wjcXlsx.WorkbookBorderSetting();
          //   rows[rowIdx].cells[_j + 1].style.borders.bottom.style = wjcXlsx.BorderStyle.Thin;
          // }
        }
      }
    }

    for (let i = 0; i < gridChild.columns.length; i++) {
      let column = sheet.columns[i + 1];
      if (column != undefined) {
        column.autoWidth = true;
        let w = widthCols[i + 1];
        column.width = w + 'ch';
      }
    }
    return book;
  }

  static getDataSetContract(...tables: any[]): DataSetContract {
    let ds = new DataSetContract();
    ds.Tables = new Array<TableContract>()

    for (let tb in tables) {
      let table = new TableContract(tables[tb].name);
      let data = tables[tb].collection;
      for (let c in data[0]) {
        let col = new ColumnContract();
        col.ColumnName = c;
        table.Columns.push(col);
      }

      for (let r = 0; r < data.length; r++) {
        let row = new RowContract();
        row.RowState = DataRowState.Unchanged;
        row.CurrentItems = new Array<any>();
        for (let c in data[r]) {
          let _value = data[r][c];
          if (_value instanceof Date)
            _value = _value.toISOString();
          row.CurrentItems.push(_value);
        }
        table.Rows.push(row);
      }
      ds.Tables.push(table);
    }
    return ds;
  }

  static getDataSetContractCreateRow(...tables: any[]): DataSetContract {
    let ds = new DataSetContract();
    ds.Tables = new Array<TableContract>()

    for (let tb in tables) {
      let table = new TableContract(tables[tb].name);
      let data = tables[tb].collection;
      let defaultRow = tables[tb].defaultRow || [];
      let defaultValuesChild = tables[tb].defaultValuesChild || [];

      for (let c in data[0]) {
        let col = new ColumnContract();
        col.ColumnName = c;
        table.Columns.push(col);
      }

      for (let r = 0; r < data.length; r++) {
        let row = this.createRow(defaultRow, defaultValuesChild, data, table.Columns)
        table.Rows.push(row);
      }
      ds.Tables.push(table);
    }
    return ds;
  }

  private static createRow(schemaRow: any, defaultRow: any, valueRow: any, columns: any, parentRow?: RowContract, parentColumns?: ColumnContract[], flex?: wjcGrid.FlexGrid): RowContract {

    let _row = new RowContract();

    _row.CurrentItems = new Array<any>();

    for (let _nCol = 0; _nCol < columns.length; _nCol++) {
      let value = schemaRow[columns[_nCol].ColumnName];

      let value2 = defaultRow ? defaultRow[columns[_nCol].ColumnName] : undefined;

      let value3 = valueRow[columns[_nCol].ColumnName];
      if (value2) value = value2;
      if (value3) value = value3;
      if (columns[_nCol].ColumnName == 'BuiltinOrder' && flex != undefined && flex != null) {
        let index = flex.itemsSource._view.indexOf(valueRow);
        value = index + 1;
      }

      if (columns[_nCol].ColumnName == 'CreatedAt') {
        value = null;
      }

      if (value instanceof Array) {
        let arr = [];
        for (let i in value) {
          arr.push(value[i]['ValueMember']);
        }
        value = arr.join(',');
      }
      if (value instanceof Date) {
        if (value <= (new Date(1900, 1, 1)))
          value = null;
        else {
          var date = value;
          value = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        }
      }
      _row.CurrentItems.push(value);
    }

    return _row;
  }

  // static createColection(data: any): any {
  //   let _colection = [];
  //   let _length = data.length;
  //   let itemSelect = data[_length - 1];
  //   let lstColSelect = [];

  //   for (var col in itemSelect) {
  //     lstColSelect.push(col);
  //   }

  //   let jSonObjectString: string = ''

  //   for (let _c in itemSelect) {
  //     jSonObjectString = jSonObjectString + '"' + _c + '":"",';
  //   }

  //   for (let item of data) {
  //     let itemTmp = JSON.parse('{' + jSonObjectString.substring(0, jSonObjectString.length - 1) + '}');
  //     for (var col in item) {
  //       if (lstColSelect.find(_c => _c === col)) {
  //         itemTmp[col] = item[col];
  //       }
  //     }
  //     _colection.push(itemTmp);
  //   }

  //   return _colection;
  // }

  static createColection(data: any): any {
    let _colection = [];
    let itemSelect = data.defaultRow;
    let lstColSelect = [];
    let dataItems: any = data.items;

    for (var col in itemSelect) {
      lstColSelect.push(col);
    }

    let jSonObjectString: string = ''

    for (let _c in itemSelect) {
      let value;
      if (wjcCore.isNumber(itemSelect[_c]) || wjcCore.isBoolean(itemSelect[_c])) {
        value = itemSelect[_c];
      }
      else if (itemSelect[_c] instanceof Date) {
        if (itemSelect[_c] <= (new Date(Date.UTC(1900, 1, 1)))) {
          value = new Date(Date.UTC(1900, 1, 1, 0, 0, 0));
          value = '"' + value.toISOString() + '"';
        }
        else {
          var date = itemSelect[_c];
          //value = new Date(Date.UTC(date.getFullYear(),date.getMonth(), date.getDate(),0,0,0));
          value = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
          value = '"' + value.toISOString() + '"';
        }
      }
      else {
        value = '"' + itemSelect[_c] + '"'
      }
      jSonObjectString = jSonObjectString + '"' + _c + '":' + value + ',';
    }

    for (let item of dataItems) {
      let itemTmp = JSON.parse('{' + jSonObjectString.substring(0, jSonObjectString.length - 1) + '}');
      for (var col in item) {

        if (lstColSelect.find(_c => _c === col)) {
          let value = item[col];

          if (wjcCore.isDate(value)) {
            let date = value;
            value = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
            value = value.toISOString();
          }
          itemTmp[col] = value;
        }
      }
      _colection.push(itemTmp);
    }

    return _colection;
  }

  static convertParameterName(pzName: string) {
    const DbParamPrefixOld = '@_';
    const DbParamPrefix = '@';

    return pzName.startsWith(DbParamPrefixOld) || pzName.startsWith(DbParamPrefix) ?
      pzName : DbParamPrefixOld + pzName;
  }

  static validateArray(control: FormControl) {
    if (control.value instanceof Array) {
      if (control.value.length > 0) {
        if (control.value[0]["ValueMember"]) {
          return null;
        }
      }
    }
    return {
      validateArray: {
        valid: false
      }
    };
  }

  static replaceString(expr: any, symbol: string) {
    let result = '';
    for (let i = 0; i < expr.length; i++) {
      if (expr[i] == symbol)
        continue;
      result += expr[i]
    }

    return result;
  }

  static convertViewName(pzViewName: string) {
    if (pzViewName.startsWith('vB'))
      if (pzViewName.includes("_"))
        return pzViewName.substring(1, pzViewName.indexOf("_"));
      else
        return pzViewName.substring(1);
    else return pzViewName;
  }

  //k dùng
  static translateImageOutput(expr, row: any) {
    let _result = expr;

    let controls: string[] = [];

    for (const control in row) {
      if (control.startsWith('@_', 0))
        controls.push(control.substring(2, control.length));
    }
    controls.sort((a, b) => b.length - a.length);

    for (const control of controls) {
      let patern = 'Khoannt' + control + 'Duongnht';


      if (_result.indexOf(patern) > -1) {

        let value = row['@_' + control];

        if (value instanceof Date) {
          if (value != null)
            value = value.toLocaleDateString();
        }


        if (wjcCore.isNumber(value)) {
          if (value != null && value != '0') {
            value = this.formatFactory(value);
          }
        }

        do {
          _result = _result.replace(patern, value);
        }
        while (_result.indexOf(patern) > -1)
      }
    }

    return _result;

  }

  static exportMultiGrid(name: string, title: any, summary: any, grids: Array<wjcGrid.FlexGrid>, rowHeader: any, output) {
    let workbooks = new Array<wjcXlsx.Workbook>();
    let maxcol = 0;

    let _workbook: wjcXlsx.Workbook;
    let _summaryWb: wjcXlsx.Workbook;
    if (title != null) {
      _workbook = this.createTitleGrid(grids[0].hostElement.parentElement, title, output);
    }
    if (summary != null) {
      _summaryWb = this.createTitleGrid(grids[0].hostElement.parentElement, summary, output);
    }
    let _rowIndex = 0;

    for (let i = 0; i < grids.length; i++) {
      let grid = grids[i];
      if (grid.columns.length > maxcol)
        maxcol = grid.columns.length;
      let wb = wjcGridXlsx.FlexGridXlsxConverter.save(grid, {
        includeColumnHeaders: true,

        includeCellStyles: true,

        formatItem: false ? this._exportFormatItem : null
      });
      for (let j = 0; j < grid.columns.length; j++) {
        if (grid.columns[j].width == 0) {
          wb.sheets[0].columns[j].visible = false;
        }
        if (grid.columns[j].isContentHtml == true) {
          for (let k = 0; k < wb.sheets[0].rows.length; k++) { //k < grid.itemsSource.sourceCollection.length;
            if (wb.sheets[0].rows[k].cells[j].value != '') {
              wb.sheets[0].rows[k].cells[j].value = this.htmlToPlainTex(wb.sheets[0].rows[k].cells[j].value)
            }
          }
        }
      }

      // <!-- Định dạng header-->
      if(rowHeader){
        for(let k = 0; k< rowHeader[grids.indexOf(grid)].length; k++){
          let rowHeader = wb.sheets[0].rows[k].cells;
          for(let col in rowHeader){
            rowHeader[col].style.vAlign = wjcXlsx.VAlign.Center;
            rowHeader[col].style.hAlign = wjcXlsx.HAlign.Center;
            rowHeader[col].style.wordWrap = true;
            rowHeader[col].style.fill.color = '#ffffff';
          }
        }
      }
      else{
        let rowHeader = wb.sheets[0].rows[0].cells;
          for(let col in rowHeader){
            rowHeader[col].style.vAlign = wjcXlsx.VAlign.Center;
            rowHeader[col].style.hAlign = wjcXlsx.HAlign.Center;
            rowHeader[col].style.wordWrap = true;
            rowHeader[col].style.fill.color = '#ffffff';
          }
      }
      workbooks.push(wb);
    }


    let start = 0;
    if (title == undefined) {

      _workbook = workbooks[0];
      start = 1;
    } else {
      for (let i in workbooks[0].sheets[0].columns) {
        let col = workbooks[0].sheets[0].columns[i];
        if (Number(i) < _workbook.sheets[0].columns.length) {

          _workbook.sheets[0].columns[i] = col;
        }
        else {
          _workbook.sheets[0].columns.push(col)
        }
      }
    }

    for (let i = start; i < workbooks.length; i++) {
      let rows = workbooks[i].sheets[0].rows;
      _workbook.sheets[0].rows.push(new wjcXlsx.WorkbookRow);

      rows[0].style.vAlign = wjcXlsx.VAlign.Center;
      // rows[0].style.hAlign = wjcXlsx.HAlign.Center;

      for (let row of rows) {
        _workbook.sheets[0].rows.push(row);
      }
    }

    if (_summaryWb != null && _summaryWb != undefined) {
      let rows = _summaryWb.sheets[0].rows;
      for (let row of rows) {
        _workbook.sheets[0].rows.push(row);
      }
    }


    _workbook.save(name + '.xlsx');
  }


  private static createTitleGrid(ele: HTMLElement, title: any, output: any): wjcXlsx.Workbook {
    let root = document.createElement("div");
    let grid = new wjcGrid.FlexGrid(root);
    let rows = title["row"];
    let data = [];
    for (let r in rows) {
      let row = {};
      for (let i in rows[r]) {
        let _value = rows[r][i].label;
        _value = this.translateOutput(_value, output);
        let _style = rows[r][i].styleobject;
        row["_col" + i] = _value;
        row["_style_col" + i] = JSON.stringify(_style);

      }
      data.push(row);
    }
    grid.itemsSource = data;
    let _format = (s: wjcGrid.FlexGrid, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.itemsSource[e.row];

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (e.panel == s.cells && s.columns[e.col].binding.startsWith('_col') && data['_style' + s.columns[e.col].binding] != undefined) {
            wjcCore.setCss(e.cell, JSON.parse(data['_style' + s.columns[e.col].binding]));
          }
        }
      }


    };
    grid.formatItem.addHandler(_format);
    root.hidden = true;
    ele.appendChild(root);

    let wb = wjcGridXlsx.FlexGridXlsxConverter.save(grid, {

      includeCellStyles: true, includeColumnHeaders: false,
      includeRowHeaders: false,
      includeColumns: function (column) {
        return column.binding.startsWith('_col');
      },
      formatItem: this._exportFormatItem
    });
    for (let i in wb.sheets[0].rows) {
      let row = wb.sheets[0].rows[i];
      for (let j in row.cells) {
        let cell = row.cells[j];
        cell.colSpan = rows[i][j].colspan;
      }
    }
    root.remove();
    return wb;
  }


  private static _exportFormatItem(args: wjcGridXlsx.XlsxFormatItemEventArgs) {
    var p = args.panel,
      row = args.row,
      col = args.col,
      xlsxCell = args.xlsxCell,
      cell: HTMLElement,
      color: string;

    // if (p.cellType === wjcGrid.CellType.Cell) {
    //   if (p.columns[col].isContentHtml === true) {
    //     if (xlsxCell.value) {
    //       console.log(xlsxCell);
    //       // if (!xlsxCell.style.font) {
    //       //   xlsxCell.style.font = {};
    //       // }
    //       // xlsxCell.style.font.color = (<string>xlsxCell.value).toLowerCase();
    //     }
    //   }
    // }
  }

  static htmlToPlainTex(html: string) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  static convertParamsToSqlStringFilter(data: any) {
    let _filter: string = ''
    for (let i in data) {
      if (data[i]) {
        if (data[i]['ParameterOperator']) {
          let date = new Date(data[i]['ParameterValue']);
          let columnName = ''
          if (data[i]['ParameterName'].indexOf('_custom') > -1)
            columnName = data[i]['ParameterName'].replace('_custom', '')
          else
            columnName = data[i]['ParameterName']

          _filter = _filter + ' AND ' + columnName + data[i]['ParameterOperator'] + "'" + date.toISOString() + "'";

        }
        else {
          if (wjcCore.isBoolean(data[i]['ParameterValue'])) {
            if (data[i]['ParameterValue'] === true)
              _filter = _filter + ' AND ' + data[i]['ParameterName'] + " = 1";
            else
              _filter = _filter + ' AND ' + data[i]['ParameterName'] + " = 0";

          }
          else if (wjcCore.isNumber(data[i]['ParameterValue'])) {
            _filter = _filter + ' AND ' + data[i]['ParameterName'] + " = " + data[i]['ParameterValue'];
          }
          else
            _filter = _filter + ' AND ' + data[i]['ParameterName'] + " like N'%" + data[i]['ParameterValue'] + "%'"
        }
      }
    }
    return _filter;
  }

}

export class FilterCommand {
  key: string
  filter: string
  filter1: string
  filter2: string
  lookup1: any
  lookup2: any
  lookup3: any
}
