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

export class Expression {

   static runFunction(expr) {
      let result: any;
      if (!expr || typeof expr !== 'string') return expr;
      if (expr == '{SYSFUNC=TODAY()}') {

         //let _date = new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), (new Date()).getHours(), (new Date()).getMinutes(), (new Date()).getSeconds(), (new Date()).getMilliseconds()));
         let _date = new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()));
         _date.setHours(_date.getHours() - 7);
         result = _date;

      }

      if (expr == '{SYSFUNC=GETYEAR()}') {
         result = new Date().getFullYear();

      }

      if (expr == '{SYSFUNC=GETTIME()}') {
         result = new Date(Date.UTC((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()), (new Date).getHours(), (new Date).getMinutes(), (new Date).getSeconds(), (new Date).getMilliseconds());
      }

      // if (expr.indexOf("{SYSFUNC=GETCONFIG('") > -1 && expr.endsWith("')}")) {
      //    let _config = JSON.parse(localStorage.getItem(SystemConstants.SYSTEM_ALL))[0];

      //    let _varKey = expr.substring(20, expr.length - 3);

      //    _config.forEach(cf => {
      //       if (cf['VarKey'] == _varKey) {
      //          result = cf['VarValue'];
      //       }
      //    });
      // }

      // if (expr.indexOf("{SYSFUNC=GETUSER('") > -1 && expr.endsWith("')}")) {
      //    let _user = JSON.parse(localStorage.getItem(SystemConstants.SYSTEM_ALL))[1];


      //    let column = expr.substring(18, expr.length - 3);

      //    result = _user[0][column];
      // }

      // if (expr.indexOf("{SYSFUNC=GETBRANCH('") > -1 && expr.endsWith("')}")) {
      //    let _branch = JSON.parse(localStorage.getItem(SystemConstants.SYSTEM_ALL))[2];
      //    let _version = localStorage.getItem(SystemConstants.WEB_VERSION).replace(/"/gi, "");

      //    let column = expr.substring(20, expr.length - 3);
      //    _branch.forEach(cf => {
      //       if (_version == "Bravo7") {
      //          if (cf['Ma_Dvcs'] == localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '')) {
      //             result = cf[column];
      //          }
      //       }
      //       else {
      //          if (cf['BranchCode'] == localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '')) {
      //             result = cf[column];
      //          }
      //       }

      //    });
      // }

      // if (expr.indexOf("{SYSFUNC=GETFISCALYEAR('") > -1 && expr.endsWith("')}")) {
      //    let _fiscal = JSON.parse(localStorage.getItem(SystemConstants.SYSTEM_ALL))[3];
      //    let _version = localStorage.getItem(SystemConstants.WEB_VERSION).replace(/"/gi, "");

      //    let column = expr.substring(24, expr.length - 3);

      //    _fiscal.forEach(cf => {
      //       if (_version == "Bravo7") {
      //          if (cf['Ma_Dvcs'] == localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '')) {
      //             result = cf[column];
      //          }
      //       }
      //       else {
      //          if (cf['BranchCode'] == localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '')) {
      //             result = cf[column];
      //          }
      //       }
      //    });
      // }

      return result;
   }

   static translateParameter(expr, row: any) {
      let _result = expr;
      if (!expr) { return true; }

      let controls: string[] = [];


      for (const control in row) {
         controls.push(control);
      }
      controls.sort((a, b) => b.length - a.length);

      for (const control of controls) {
         let patern = '{EXPR=' + control + '}';

         if (_result.indexOf(patern) > -1) {

            let value = row[control];

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

      return _result;

   }

   static translateFilterKey(filter: string) {
      if (wjcCore.isNullOrWhiteSpace(filter))
         return filter;
      else {
         let _fArr: string[] = filter.split(' ');
         for (let i = 0; i < _fArr.length; i++) {
            if (_fArr[i].indexOf('SYSFUNC=') > -1) {
               let _value = _fArr[i];
               if (_value.startsWith("'") && _value.endsWith("'")) {
                  _value = _value.substr(1, _value.length - 2);
                  _fArr[i] = "'" + Expression.runFunction(_value) + "'";
               }
               else {
                  _fArr[i] = Expression.runFunction(_value);
               }
            }
         }

         return _fArr.join(' ');
      }
   }

   static convertFileName(str: string) {
      if (wjcCore.isString(str))
         return str = str.replace(/\//gi, '_');
      else
         return ""
   }

   static remove_non_ascii(str: string) {

      if (wjcCore.isString(str)) {
         // let _config = JSON.parse(localStorage.getItem(SystemConstants.WEB_CONFIG));
         let isRemoveUnicode = true;//_config['RemoveUnicodeFileName'] || false;

         if (isRemoveUnicode) {
            let AccentsMap = [
               "aàảãáạăằẳẵắặâầẩẫấậ",
               "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
               "dđ", "DĐ",
               "eèẻẽéẹêềểễếệ",
               "EÈẺẼÉẸÊỀỂỄẾỆ",
               "iìỉĩíị",
               "IÌỈĨÍỊ",
               "oòỏõóọôồổỗốộơờởỡớợ",
               "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
               "uùủũúụưừửữứự",
               "UÙỦŨÚỤƯỪỬỮỨỰ",
               "yỳỷỹýỵ",
               "YỲỶỸÝỴ"
            ];
            for (var i = 0; i < AccentsMap.length; i++) {
               var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
               var char = AccentsMap[i][0];
               str = str.replace(re, char);
            }
            str = str.replace(/\s/g, '_');
            return str;
            // return str.replace(/[^\x20-\x7E]/g, '');

         }
         else
            return str;
      }

      else
         return "no_name"


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

   static checkStringNotNumber(value): boolean {

      if ((<string>value).length > 0 && (<string>value).startsWith('0'))
         return true;
      else
         return false
   }

   static stringIsDate(value): boolean {
      if (Date.parse(value))
         return true

      return false
   }

   static checkImgage(filename: string): boolean {
      let ext = filename.split('.').pop();
      if (ext == filename) false;

      let arr = ["JPG", "JPEG", "PNG", "GIF"];
      if (arr.indexOf(ext.toUpperCase()) > -1)
         return true;
   }

   static renameFile(originalFile, newName): File {
      return new File([originalFile], newName, {
         type: originalFile.type,
         lastModified: originalFile.lastModified,
      });
   }

   static guessImageMime(data) {
      if (data.charAt(0) == '/') {
         return "image/jpeg";
      } else if (data.charAt(0) == 'R') {
         return "image/gif";
      } else if (data.charAt(0) == 'i') {
         return "image/png";
      }
   }
}
