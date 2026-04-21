import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { PanelBase } from './../panel/PanelBase';
import { BravoCtorEnum } from '../../core/enum/type.enum';
import { Global } from '../../shared/global';
import { ParameterContract } from '../../contracts/parameter.contract';
import { BaseService } from '../../base/base.service';


import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcInput from 'wijmo/wijmo.angular2.input';
import { InputBase } from '../input/InputBase';
import { LookupBoxInput } from '../input/LookupBoxInput';
import { global } from '@angular/core/src/util';
import { error } from 'util';
import { CollectionView } from 'wijmo/wijmo';
import { MultiSelectInput } from '../input/MultiSelectInput';
import { UploadInput } from '../input/UploadInput';
import { NumberBoxInput } from '../input/NumberBoxInput';
import { DateBoxInput } from '../input/DateBoxInput';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';
import { SystemConstants } from '../../core/common/system.constants';
import { UploadImage } from '../input/UploadImage';
import { CryptoExtension } from '../../core/extensions/crypto.extension';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'df-panel',
  templateUrl: './dynamic-form-panel.component.html',
  styleUrls: ['./dynamic-form-panel.component.css']
})

export class DynamicFormPanelComponent implements OnDestroy {


  @Input() panel: PanelBase;
  @Input() form: FormGroup;

  @Output('clickCommand') clickCommand = new EventEmitter();
  @Output('valueChanged') valueChanged = new EventEmitter();

  columnChanged: any;
  columnChangedChild: any;
  evaluators: any;
  serverConstraint: any;
  serverUpdating: any;
  serverUpdated: any;
  linkReporter: any;
  buttonCommand: any;

  isUsingEvaluator = false;
  isUsingBinding = false;
  dataMember: any;
  builtinOrder: any;
  grid: any;
  parentData: any;
  paramsDefault: any;
  gridArray: wjcGrid.FlexGrid[];

  totalErrorChild: number = 0;

  subscription: Subscription;

  constructor(private service: BaseService) {
    this.subscription = new Subscription();

  }
  updateValueForm(data: {}) {
    for (let j in this.panel.controls) {
      let control = this.panel.controls[j];
      try {
        if (data[control.key] != undefined)
          if (control instanceof DateBoxInput) {
            if (data[control.key] == (new Date(Date.UTC(1900, 0, 1))).toISOString())
              continue;
            else
              this.form.get(control.key).setValue(data[control.key]);

          } else if (control instanceof MultiSelectInput) {
            //200118: Dương fix filter F3
            if (control.lookupfilter.indexOf('{EXPR=') > 0)
              control.lookupfilterCurrent = '';
            else
              control.lookupfilterCurrent = control.translate_expr(control.lookupfilter, data);

            control.getLookupData('^' + data[control.key], false).then(() => {
              if (control instanceof MultiSelectInput) {
                if (control.selectedItems.length > 0) {
                  // this.form.get(control.key).reset();

                  this.isUsingEvaluator = false;
                  this.form.get(control.key).setValue(control.selectedItems, { onlySeft: true, emitEvent: false });
                  this.isUsingEvaluator = true;

                }
              }
            });
          } else if (control instanceof NumberBoxInput) {
            this.form.get(control.key).setValue(Number(data[control.key]));
          } else if (control instanceof UploadInput) {
            control.fileNameDownLoad = data[control.key];
            this.form.get(control.key).setValue(data[control.key]);
          } else if (control instanceof UploadImage) {
            //control.src = data[control.key];
            this.form.get(control.key).setValue(data[control.key]);
          }
          else {
            this.form.get(control.key).setValue(data[control.key]);
          }
      }
      catch (e) {
      }
    }
  }

  async clickCustom(key: string) {

    this.clickCommand.emit(key);

    let _linkReporter: any;

    _linkReporter = this.linkReporter[key];


    let ds = {}

    for (let ctrl in this.form.controls) {
      ds[ctrl] = this.form.controls[ctrl].value;
    }

    let _expr = ''
    if (_linkReporter['expr'] != undefined && _linkReporter['expr'] != null && _linkReporter['expr'] != '') {
      _expr = _linkReporter['expr'];
      if (_expr.indexOf('{EXPR=') > -1) {

        _expr = this.translate_expr_control(_expr, ds, this.parentData);
        if (!eval(_expr)) {
          alert('Sai điều kiện, Không được phép thực hiện!');
          return;
        }

      }

    }

    let _evaluator = ''
    if (_linkReporter['evaluator'] != undefined && _linkReporter['evaluator'] != null && _linkReporter['evaluator'] != '') {
      _evaluator = _linkReporter['evaluator'];
      await this.runConstraint(_evaluator).then(() => {
        if (this.form.invalid) {
          //alert('Yêu cầu chọn đầy đủ trường dữ liệu bắt buộc trước khi thực hiện!');
          return;
        }
        else {
          let navigateUrl = [];
          navigateUrl.push('#/main');

          let _dic = _linkReporter['directory'];

          if (_dic.indexOf('{EXPR=') > -1) {

            _dic = this.translate_expr_control(_dic, ds, this.parentData);

            if (eval(_dic) == '') {
              alert('Không xác định được thông tin điều hướng. Vui lòng kiểm tra lại dữ liệu!');
              return;
            }
            navigateUrl.push(eval(_dic));
          }
          else {
            navigateUrl.push(_linkReporter['directory']);
          }

          if (_linkReporter['command'] != undefined) {
            let _cmd = _linkReporter['command'];

            if (_cmd.indexOf('{EXPR=') > -1) {

              _cmd = this.translate_expr_control(_cmd, ds, this.parentData);

              try {
                if (eval(_cmd) != '')
                  navigateUrl.push(eval(_cmd));
              }
              catch (e) {

              }
            }
            else
              navigateUrl.push(_linkReporter['command']);
          }
          else
            navigateUrl.push(_linkReporter['type']);


          if (_linkReporter['type'] == 'view') {
            navigateUrl.push(_linkReporter['key']);
          }
          else {
            if (this.parentData[_linkReporter['key']] == '0' || this.parentData[_linkReporter['key']] == null) {
              navigateUrl.push('-1');
            }
            else {
              navigateUrl.push(this.parentData[_linkReporter['key']]);
            }
          }
          let paramsReport: any[];

          paramsReport = this.linkReporter[key]['parameter'];

          for (let control in paramsReport) {
            if (paramsReport[control].toString().indexOf('{EXPR=') > -1) {
              paramsReport[control] = this.translate_Parameter_linkCommand(paramsReport[control], ds, this.parentData);
                if (paramsReport[control].toString().indexOf('?') > -1) {
                  try {
                      let expr = paramsReport[control].toString();
                      // Bỏ phần {EXPR=} nếu vẫn còn
                      expr = expr.replace(/^\{EXPR=/, '').replace(/\}$/, '');
                      paramsReport[control] = eval(expr);
                  } catch (e) {
                      console.error('Lỗi eval EXPR:', e);
                      paramsReport[control] = null; // hoặc giá trị mặc định
                  }
              }
            }
            if (paramsReport[control].toString().indexOf('{VAR=') > -1)
              paramsReport[control] = Global.convertConfig(paramsReport[control]);

            paramsReport[control] = this.replaceString(paramsReport[control], "'");
          }

          localStorage.removeItem(SystemConstants.PARAMETER_LINKREPORT);
          localStorage.setItem(SystemConstants.PARAMETER_LINKREPORT, JSON.stringify(paramsReport));

          if (paramsReport != undefined && paramsReport != null && (this.parentData[_linkReporter['key']] == '0' || this.parentData[_linkReporter['key']] == null)) {
            let _value = encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(paramsReport)));
            navigateUrl.push(_value);
          }

          window.open(navigateUrl.join('/'));
        }
      });
    }
    else {
      let navigateUrl = [];
      navigateUrl.push('#/main');

      let _dic = _linkReporter['directory'];

      if (_dic.indexOf('{EXPR=') > -1) {

        _dic = this.translate_expr_control(_dic, ds, this.parentData);

        if (eval(_dic) == '') {
          alert('Không xác định được thông tin điều hướng. Vui lòng kiểm tra lại dữ liệu!');
          return;
        }
        navigateUrl.push(eval(_dic));
      }
      else {
        navigateUrl.push(_linkReporter['directory']);
      }

      if (_linkReporter['command'] != undefined) {
        let _cmd = _linkReporter['command'];

        if (_cmd.indexOf('{EXPR=') > -1) {

          _cmd = this.translate_expr_control(_cmd, ds, this.parentData);

          try {
            if (eval(_cmd) != '')
              navigateUrl.push(eval(_cmd));
          }
          catch (e) {

          }
        }
        else
          navigateUrl.push(_linkReporter['command']);
      }
      else
        navigateUrl.push(_linkReporter['type']);


      if (_linkReporter['type'] == 'view') {
        navigateUrl.push(_linkReporter['key']);
      }
      else {
        if (this.parentData[_linkReporter['key']] == '0' || this.parentData[_linkReporter['key']] == null) {
          navigateUrl.push('-1');
        }
        else {
          navigateUrl.push(this.parentData[_linkReporter['key']]);
        }
      }
      let paramsReport: any[];
console.log(this.linkReporter[key]['parameter'])

      paramsReport = this.linkReporter[key]['parameter'];

      for (let control in paramsReport) {
        if (paramsReport[control].toString().indexOf('{EXPR=') > -1) {
          paramsReport[control] = this.translate_Parameter_linkCommand(paramsReport[control], ds, this.parentData);
          if (paramsReport[control].toString().indexOf('?') > -1)
            paramsReport[control] = eval(paramsReport[control]);
        }
        if (paramsReport[control].toString().indexOf('{VAR=') > -1)
          paramsReport[control] = Global.convertConfig(paramsReport[control]);

        paramsReport[control] = this.replaceString(paramsReport[control], "'");
      }

      localStorage.removeItem(SystemConstants.PARAMETER_LINKREPORT);
      localStorage.setItem(SystemConstants.PARAMETER_LINKREPORT, JSON.stringify(paramsReport));

      if (paramsReport != undefined && paramsReport != null && (this.parentData[_linkReporter['key']] == '0' || this.parentData[_linkReporter['key']] == null)) {
        let _value = encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(paramsReport)));
        navigateUrl.push(_value);
      }

      window.open(navigateUrl.join('/'));
    }

  }

  // onValueChanged(e) {
  //     this.valueChanged.emit(e);
  // }

  async onCellValueChanged(index: string, column: string, e: wjcGrid.FormatItemEventArgs) {
    if (this.isUsingEvaluator) {
      if (this.columnChangedChild)
        for (let obj of this.columnChangedChild) {
          if (obj['Tables'] == index) {
            for (const col in obj['columnChanged']) {
              if (col === column) {
                console.log('column Changed Child ----' + e);
                const evals = obj['columnChanged'][col]['Evaluators'];
                for (const eva in evals) {
                  await this.runEvaluator(evals[eva], e);
                }
              }
            }
          }
        }
    }
  }

  async onValueChanged(e: InputBase<any>) {
    if (this.isUsingEvaluator) {
      for (const col in this.columnChanged) {
        if (col === e.key) {
          console.log('Value Changed ----' + e.key);
          const evals = this.columnChanged[col]['Evaluators'];
          for (const eva in evals) {
            await this.runEvaluator(evals[eva]);
          }
          break;
        }
      }

      if (this.serverConstraint !== undefined)
        for (const evaluator of this.serverConstraint) {
          this.runConstraint(evaluator, e.key);
        }
    }

    this.set_Visible_Expr();
    this.set_Disabled_Expr();
    this.set_Readonly_Expr();

    if (e.key == 'ProductCostId') {
      for (let control of this.panel.controls) {
        if (control.key == 'FilePath') {
          if (control instanceof UploadInput)
            if (this.form.controls['ProductCostId'].value != null)
              control.folderName = this.form.controls['ProductCostId'].value.toString() + '\\' + control.command;

          break;
        }
      }
    }
  }

  set_Disabled_Expr() {
    let ds = {}

    for (let ctrl in this.form.controls) {
      ds[ctrl] = this.form.controls[ctrl].value;
    }

    for (let control of this.panel.controls) {
      if (control.isDisabled) {

        let _element = document.getElementById(control.key);

        let _exprRun = control.isDisabled;
        _exprRun = this.translate_expr_control(_exprRun, ds, this.parentData);
        // console.log('_exprRun: ' + _exprRun);
        if (_exprRun.indexOf('{EXPR=') <= -1)
          if (eval(_exprRun)) {
            if (_element) {
              _element.setAttribute("disabled", "disabled");
              let _childs = _element.getElementsByTagName('input');
              for (let i = 0; i < _childs.length; i++) {
                _childs.item(i).setAttribute("disabled", "disabled");
              }
              if (this.form.controls[control.key].validator != null) {
                this.form.controls[control.key].clearValidators();
                this.form.controls[control.key].updateValueAndValidity();
                if (control instanceof LookupBoxInput) {
                  if (this.form.controls[control.key].value == null)
                    this.form.controls[control.key].setValue('');
                }
              }
            }
          }
          else {
            if (_element) {
              _element.removeAttribute("disabled");
              let _childs = _element.getElementsByTagName('input');
              for (let i = 0; i < _childs.length; i++) {
                _childs.item(i).removeAttribute("disabled");
              }
              if (this.form.controls[control.key].validator == null && control.validators) {
                this.form.controls[control.key].setValidators(control.validators);
                this.form.controls[control.key].updateValueAndValidity();
                if (control instanceof LookupBoxInput) {
                  if (this.form.controls[control.key].value == null)
                    this.form.controls[control.key].setValue('');
                }
              }
            }
          }
      }
    }
  }
  set_Readonly_Expr() {
    let ds = {}

    for (let ctrl in this.form.controls) {
      ds[ctrl] = this.form.controls[ctrl].value;
    }

    for (let control of this.panel.controls) {
      if (control.isReadOnly) {

        let _element = document.getElementById(control.key);

        let _exprRun = control.isReadOnly;
        _exprRun = this.translate_expr_control(_exprRun, ds, this.parentData);
        //console.log('_exprRun: ' + _exprRun);
        if (eval(_exprRun)) {
          if (control.controlType == 'number') {
            let wjnumber = <wjcInput.WjInputNumber>control.element;
            wjnumber.isReadOnly = true;
          } else {
            if (_element) {
              _element.setAttribute("readonly", "readonly");
              let _childs = _element.getElementsByTagName('input');
              for (let i = 0; i < _childs.length; i++) {
                _childs.item(i).setAttribute("readonly", "readonly");
              }
              if (this.form.controls[control.key].validator != null) {
                this.form.controls[control.key].clearValidators();
                this.form.controls[control.key].updateValueAndValidity();
                if (control instanceof LookupBoxInput) {
                  if (this.form.controls[control.key].value == null)
                    this.form.controls[control.key].setValue('');
                }
              }
            }
          }
        }
        else {
          if (control.controlType == 'number') {
            let wjnumber = <wjcInput.WjInputNumber>control.element;
            wjnumber.isReadOnly = false;
          } else {
            if (_element) {
              _element.removeAttribute("readonly");
              let _childs = _element.getElementsByTagName('input');
              for (let i = 0; i < _childs.length; i++) {
                _childs.item(i).removeAttribute("readonly");
              }
              if (this.form.controls[control.key].validator == null && control.validators) {
                this.form.controls[control.key].setValidators(control.validators);
                this.form.controls[control.key].updateValueAndValidity();
                if (control instanceof LookupBoxInput) {
                  if (this.form.controls[control.key].value == null)
                    this.form.controls[control.key].setValue('');
                }
              }
            }
          }
        }
      }
    }
  }
  set_Visible_Expr() {
    let ds = {}

    for (let ctrl in this.form.controls) {
      ds[ctrl] = this.form.controls[ctrl].value;
    }

    for (let control of this.panel.controls) {
      if (control.visible) {

        let _element = document.getElementById(control.key).parentElement;

        let _exprRun = control.visible;
        _exprRun = Global.translateAutoText(_exprRun, ds, this.parentData);

        if (eval(_exprRun)) {
          if (_element) {
            // _element.setAttribute('*ngIf','false');
            _element.style.display = 'block';
          }
        }
        else {
          if (_element) {
            // _element.setAttribute('*ngIf','true');
            _element.style.display = 'none';

          }
        }
      }
    }
  }

  set_Format_Expr(data: any) {
    if (data) {

      for (let control of this.panel.controls) {
        if (control.controlType == 'number') {

          let fomatEnd = 'N0';

          if (control['format']) {
            let _exprRun = control['format'];
            if (_exprRun.indexOf('{EXPR=') > -1) {
              _exprRun = Global.translateAutoText(_exprRun, data);
              fomatEnd = eval(_exprRun);
              control['format'] = fomatEnd;
            }
          }
        }
      }
    }
  }

  async runConstraint(key: string, column?: string, e?: wjcGrid.FormatItemEventArgs) {
    const evaluator = this.evaluators[key];
    let col;
    if (this.evaluators[key] != undefined)
      if (evaluator['ConstraintKey'])
        col = evaluator['ConstraintKey'].split(',');

    if (this.evaluators[key] != undefined)
      if (column) {
        if (col.includes(column)) {
          if (e != undefined)
            await this.runEvaluator(key, e);
          else
            await this.runEvaluator(key);

        }
      } else {
        if (e != undefined)
          await this.runEvaluator(key, e);
        else
          await this.runEvaluator(key);

      }
  }

  //Dương chuối
  runConstraintVer2(key: string, column?: string, e?: wjcGrid.FormatItemEventArgs) {
    const evaluator = this.evaluators[key];
    let col;
    if (this.evaluators[key] != undefined)
      if (evaluator['ConstraintKey'])
        col = evaluator['ConstraintKey'].split(',');

    if (this.evaluators[key] != undefined)
      if (column) {
        if (col.includes(column)) {
          if (e != undefined)
            return this.runEvaluator(key, e);
          else
            return this.runEvaluator(key);

        }
      } else {
        if (e != undefined)
          return this.runEvaluator(key, e);
        else
          return this.runEvaluator(key);

      }
  }

  _event: wjcGrid.FormatItemEventArgs;
  async runEvaluator(key: string, e?: wjcGrid.FormatItemEventArgs) {
    let evaluator;
    evaluator = this.evaluators[key];
    let flag = true;

    if (!e) {
      for (let control in this.form.controls) {
        this.parentData[control] = this.form.get(control).value;
      }
      if (evaluator['zExpr']) {
        let expr = this.fn_translate_expr(evaluator['zExpr'], this.parentData);
        // console.log('zExpr: ' + expr);
        flag = eval(expr);
      }

      if (flag) {
        console.log(key);

        const evaluteName = evaluator['EvaluatorName'];
        if (evaluteName === 'EvaluatorQuery') {
          await this.fn_Evaluator_Query(evaluator);
        } else if (evaluteName === 'EvaluatorQueryLoadChild') {
          await this.fn_Evaluator_Query_LoadChild(evaluator);
        } else if (evaluteName === 'EvaluatorQueryXmlLoadChild') {
          await this.fn_Evaluator_QueryXml_LoadChild(evaluator);
        } else if (evaluteName === 'EvaluatorCaculate') {
          this.fn_evaluator_Calculate(evaluator);
        } else if (evaluteName === 'EvaluatorSumChild') {
          this.fn_Evaluator_SumChild(evaluator);
        } else if (evaluteName === 'EvaluatorAttribute') {
          this.fn_Evaluator_SetAtrribute(evaluator);
        } else if (evaluteName === 'EvaluatorScript') {
          // fn_Evaluator_RunScript();
        } else if (evaluteName === 'EvaluatorValidate') {
          await this.fn_Evaluator_Validate(evaluator);
          //EvaluatorBindingChild: lưu ý, cột phải có khai báo trên Layout
        } else if (evaluteName === 'EvaluatorBindingChild') {
          await this.fn_Evaluator_Binding_Child(evaluator);
        } else if (evaluteName === 'EvaluatorBindingChildAll') {
          await this.fn_Evaluator_Binding_ChildAll(evaluator);
        } else if (evaluteName === 'EvaluatorFirstChild') {
          await this.fn_Evaluator_First_Child(evaluator);
        } else if (evaluteName === 'EvaluatorLastChild') {
          await this.fn_Evaluator_Last_Child(evaluator);
        } else if (evaluteName === 'EvaluatorCopiedValues') {
          await this.fn_Evaluator_CopiedValue_Child(evaluator);
        } else {
          this.fn_Evaluator_Default(evaluator);
        }
      }
    } else {
      this._event = e;

      if (evaluator['zExpr']) {
        let ds = this.gridArray[evaluator['Tables']].itemsSource;
        let defaultRow = this.gridArray[evaluator['Tables']].itemsSource['defaultRow'];
        const expr = this.fn_translate_expr(evaluator['zExpr'], ds.sourceCollection[e.row], defaultRow);
        flag = eval(expr);
      }
      if (flag) {
        console.log('evaluators: ' + key);

        const evaluteName = evaluator['EvaluatorName'];
        if (evaluteName === 'EvaluatorQuery') {
          await this.fn_Evaluator_Query_Child(evaluator, e.row);
        }
        // else if (evaluteName === 'EvaluatorQueryLoadChild') {
        //   this.fn_Evaluator_Query_LoadChild(evaluator, e.row);
        // }
        else if (evaluteName === 'EvaluatorQueryXmlLoadChild') {
          await this.fn_Evaluator_QueryXml_LoadChild(evaluator, e.row);
        } else if (evaluteName === 'EvaluatorCaculate') {
          await this.fn_evaluator_Calculate_Child(evaluator, e.row);
        } else if (evaluteName === 'EvaluatorSumChild') {
          this.fn_Evaluator_SumChild(evaluator);
        } else if (evaluteName === 'EvaluatorFirstChild') {
          await this.fn_Evaluator_First_Child(evaluator);
        } else if (evaluteName === 'EvaluatorLastChild') {
          await this.fn_Evaluator_Last_Child(evaluator);
        } else if (evaluteName === 'EvaluatorAttribute') {
          this.fn_Evaluator_SetAtrribute(evaluator);
        } else if (evaluteName === 'EvaluatorScript') {
          // fn_Evaluator_RunScript();
        } else if (evaluteName === 'EvaluatorValidate') {
          await this.fn_Evaluator_Validate_Child(evaluator, e.row);
        } else if (evaluteName === 'EvaluatorValidateXML') {
          await this.fn_Evaluator_Validate_Child_XML(evaluator, e.row);
        } else {
          this.fn_Evaluator_Default(evaluator);
        }
      }
    }


  }

  //Khoa: 19/01/2018 thêm chạy evaluator lưới
  async runEvaluatorChild(key: string, rowIndex: number) {
    let evaluator;
    // if(this.evaluators.contains(key))
    evaluator = this.evaluators[key];
    let flag = true;

    if (evaluator['zExpr']) {
      let ds = this.gridArray[evaluator['Tables']].itemsSource.sourceCollection[rowIndex];
      let defaultRow = this.gridArray[evaluator['Tables']].itemsSource["defaultRow"];
      const expr = this.fn_translate_expr(evaluator['zExpr'], ds, defaultRow);

      flag = eval(expr);
    }
    if (flag) {
      const evaluteName = evaluator['EvaluatorName'];
      if (evaluteName === 'EvaluatorQuery') {
        await this.fn_Evaluator_Query_Child(evaluator, rowIndex);
      }
      else if (evaluteName === 'EvaluatorCaculate') {
        await this.fn_evaluator_Calculate_Child(evaluator, rowIndex);
      } else if (evaluteName === 'EvaluatorSumChild') {
        this.fn_Evaluator_SumChild(evaluator);
      } else if (evaluteName === 'EvaluatorFirstChild') {
        await this.fn_Evaluator_First_Child(evaluator);
      } else if (evaluteName === 'EvaluatorLastChild') {
        await this.fn_Evaluator_Last_Child(evaluator);
      } else if (evaluteName === 'EvaluatorAttribute') {
        this.fn_Evaluator_SetAtrribute(evaluator);
      } else if (evaluteName === 'EvaluatorScript') {
        // fn_Evaluator_RunScript();
      } else if (evaluteName === 'EvaluatorValidate') {
        await this.fn_Evaluator_Validate_Child(evaluator, rowIndex);
      } else if (evaluteName === 'EvaluatorValidateXML') {
        await this.fn_Evaluator_Validate_Child_XML(evaluator, rowIndex);
      } else {
        this.fn_Evaluator_Default(evaluator);
      }
    }
  }

  // private fn_Evaluator_Default(evaluator) {
  //   if (this.form.contains(evaluator['DataMember']))
  //     this.form.get(evaluator['DataMember']).setValue(evaluator['Value']);
  // }

  private fn_Evaluator_Default(evaluator) {
    let value: any;
    if (wjcCore.isString(evaluator['Value'])) {
      value = this.fn_translate_expr(evaluator['Value'], this.parentData);
      value = value.replace("''", 0);
    }
    else {
      value = evaluator['Value'];
    }

    let col = evaluator['DataMember'];

    if (this.form.contains(col))
      this.form.get(col).setValue(eval(value));
    else
      this.parentData[col] = eval(value);
  }

  private fn_Evaluator_SetAtrribute(evaluator) {
    // tslint:disable-next-line:no-eval
    // const flag = eval(this.fn_translate_expr(evaluator['Expr']));
    // if (flag) {
    //     const value = this.fn_translate_expr(evaluator['Value']);
    //     const _lk = this.lookupCollection.find(lk => lk.key === evaluator['DataMember']);
    //     _lk.extrafilter = value;
    // }

  }

  private fn_evaluator_Calculate(evaluator) {
    let value = this.fn_translate_expr(evaluator['Value'], this.parentData);
    console.log(value);
    // value = value.replace("TaxRate", 0);
    // value = value.replace("Percent_Th", 0);
    // value = value.replace("Percent_TUng", 0);
    // value = value.replace("Percent_HUng", 0);
    // value = value.replace("Amount_ThiCong", 0);
    // value = value.replace("Amount_THDenKyNay", 0);

    value = value.replace("''", 0);
    let col = evaluator['DataMember'];
    if (this.form.contains(col))
      this.form.get(col).setValue(eval(value));
    else
      this.parentData[col] = eval(value);
  }

  private async fn_evaluator_Calculate_Child(evaluator, rowIndex?: number) {

    //boom của Dương
    //let ds = this.gridArray[evaluator['Tables']].itemsSource;
    //let value = this.fn_translate_expr(evaluator['Value'], ds.sourceCollection[rowIndex], ds.itemsRemoved);

    let ds = this.gridArray[evaluator['Tables']].itemsSource.sourceCollection[rowIndex];
    let defaultRow = this.gridArray[evaluator['Tables']].itemsSource['defaultRow'];
    let value = this.fn_translate_expr(evaluator['Value'], ds, defaultRow);

    // value = value.replace("NoChangeInBill", 0);
    // value = value.replace("Amount_ThucHien_Muc1", 0);
    // value = value.replace("PayPercent", 0);
    // value = value.replace("GuaranteeCheck", 0);

    let col = evaluator['DataMember'];
    let gridtmp = this.gridArray[evaluator['Tables']];
    let index = 0;
    for (index = 0; index < gridtmp.columns.length; index++) {
      // console.log(gridtmp.columns[index].binding);
      if (gridtmp.columns[index].binding == col) {
        break;
      }
    }

    let _value = eval(value);

    //gridtmp.setCellData(this._event.row, index, Number(_value));
    try {
      gridtmp.setCellData(rowIndex, index, Number(_value));
    }
    catch (ex) { }
    await this.onCellValueChanged(evaluator['Tables'], col, this._event)
  }

  private fn_Evaluator_SumChild(evaluator) {
    let value: number = 0

    let gridtmp: wjcGrid.FlexGrid = this.gridArray[evaluator['Tables']];
    if (gridtmp) {
      let data = gridtmp.itemsSource.sourceCollection;

      for (let i = 0; i < data.length; i++) {
        if ((data[i][evaluator['Value']]))
          value += Number(data[i][evaluator['Value']]);
        else
          value += 0;
      }
    }

    let col = evaluator['DataMember'];
    if (this.form.contains(col))
      this.form.get(evaluator['DataMember']).setValue(value);
    else
      this.parentData[col] = value;
  }

  private async fn_Evaluator_First_Child(evaluator) {
    let value: any;
    let gridtmp: wjcGrid.FlexGrid = this.gridArray[evaluator['Tables']];
    if (gridtmp) {
      let data = gridtmp.itemsSource.sourceCollection;

      value = data[0][evaluator['Value']];

      if (wjcCore.isNumber(value))
        value = this.replaceDecimal(value);

      if (value instanceof Date) {
        //if (value != null)
        //Trên giao diện cùng value  
        //value =  '\'' + value.toISOString() + '\'';
      }
    }


    let col = evaluator['DataMember'];
    if (this.form.contains(col)) {
      this.form.get(evaluator['DataMember']).setValue(value);
      await this.onCellValueChanged(evaluator['Tables'], col, this._event);
    }
    else
      this.parentData[col] = value;
  }

  private async fn_Evaluator_Last_Child(evaluator) {
    let value: any;

    let gridtmp: wjcGrid.FlexGrid = this.gridArray[evaluator['Tables']];
    if (gridtmp) {
      let data = gridtmp.itemsSource.sourceCollection;
      value = data[data.length - 1][evaluator['Value']];

      if (wjcCore.isNumber(value))
        value = this.replaceDecimal(value);

      if (value instanceof Date) {
        //if (value != null)
        //Trên giao diện cùng value  
        //value =  '\'' + value.toISOString() + '\'';
      }
    }


    let col = evaluator['DataMember'];
    if (this.form.contains(col)) {
      this.form.get(evaluator['DataMember']).setValue(value);
      await this.onCellValueChanged(evaluator['Tables'], col, this._event);
    }
    else
      this.parentData[col] = value;
  }

  convertParameterName(pzName: string) {
    const DbParamPrefixOld = '@_';
    const DbParamPrefix = '@';

    return pzName.startsWith(DbParamPrefixOld) || pzName.startsWith(DbParamPrefix) ?
      pzName : DbParamPrefixOld + pzName;
  }

  private async fn_Evaluator_Query(evaluator) {
    const keys = evaluator['ConstraintKey'].split(',');
    let cols = '';
    if (evaluator['DataMember'])
      cols = evaluator['DataMember'].split(',');
    const params = new Array<ParameterContract>();
    const flagParam = false;
    try {
      for (let control in this.form.controls) {
        this.parentData[control] = this.form.get(control).value;
      }

      const params = this.fn_build_paramater(keys, this.parentData);
      if (evaluator['Command'].includes('ufn_')) {
        const params = this.fn_build_paramater_ufn(evaluator['Command'], keys);
        let data = await this.service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Web_ExecuteFunction', params)
          .toPromise();
        if (data != undefined)
          for (const col of cols) {
            //Dương Thêm nhờ Khoadđ tư vấn tận tình
            if (this.parentData[col] != data[0]['Value']) {
              this.setParentValue(col, data[0]['Value']);
            }
          }
      }
      else {
        let data = await this.service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, evaluator['Command'], params)
          .toPromise();
        for (const col of cols) {
          if (data != null && data[0] != undefined)
            if (this.parentData[col] != data[0][col])
              //Dương Thêm nhờ Khoadđ tư vấn tận tình
              this.setParentValue(col, data[0][col]);
        }
      }
    }
    finally {
    }
  }

  private async fn_Evaluator_Query_Child(evaluator, rowIndex: number) {

    const keys = evaluator['ConstraintKey'].split(',');
    let cols = '';
    if (evaluator['DataMember'])
      cols = evaluator['DataMember'].split(',');
    const params = new Array<ParameterContract>();
    const flagParam = false;


    try {
      let gridtmp: wjcGrid.FlexGrid = this.gridArray[Number(evaluator['Tables'])];
      let row = gridtmp.itemsSource.sourceCollection[rowIndex];
      const params = this.fn_build_paramater(keys, row);

      // let index = 0;
      // for (index = 0; index < gridtmp.columns.length; index++) {
      // // console.log(gridtmp.columns[index].binding);
      // if (gridtmp.columns[index].binding == col) {
      //   break;
      // }
      // }

      if (evaluator['Command'].includes('ufn_')) {

        const params = this.fn_build_paramater_child_ufn(evaluator['Command'], keys, Number(evaluator['Tables']))

        let data = await this.service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Web_ExecuteFunction', params)
          .toPromise();
        for (const col of cols) {
          let index = 0;
          for (index = 0; index < gridtmp.columns.length; index++) {
            if (gridtmp.columns[index].binding == col) {
              break;
            }
          }
          //this.setChildValue(rowIndex, col, evaluator['Tables'], data[0]['Value']);
          gridtmp.setCellData(rowIndex, index, data[0]['Value']);
          await this.onCellValueChanged(evaluator['Tables'], col, this._event)
        }

      }
      else {
        let data = await this.service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, evaluator['Command'], params)
          .toPromise();
        for (const col of cols) {
          let index = 0;
          for (index = 0; index < gridtmp.columns.length; index++) {
            if (gridtmp.columns[index].binding == col) {
              break;
            }
          }
          //this.setChildValue(rowIndex, col, evaluator['Tables'], data[0]['Value']);
          gridtmp.setCellData(rowIndex, index, data[0][col]);//data[0]['Value']
          await this.onCellValueChanged(evaluator['Tables'], col, this._event)
        }

      }
    }
    finally {
    }
  }

  output: any;
  _error: boolean = false;
  _errorMess: any;

  isLock: boolean = false;
  private async fn_Evaluator_Validate(evaluator) {
    const keys = evaluator['ConstraintKey'].split(',');

    for (let control in this.form.controls)
      this.parentData[control] = this.form.get(control).value;
    if (evaluator['Command']) {
      if (evaluator['Command'].includes('ufn_')) {
        const params = this.fn_build_paramater_ufn(evaluator['Command'], keys);
        let data = await this.service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Web_ExecuteFunction', params)
          .toPromise();
        if (data)
          if (data['0']['Value'] == '1') {
            if (evaluator['IgnoreError'] == '0') {
              this.form.setErrors({ "error": evaluator['MessageText'] });
            } else {
              console.log(evaluator['MessageText']);
            }
          }
      }
      else {
        for (let control in this.form.controls)
          this.parentData[control] = this.form.get(control).value;
        const params = this.fn_build_paramater(keys, this.parentData);
        let data = await this.service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, evaluator['Command'], params).toPromise().then();

        // //Kit: ép ZonePromise thành Array
        // let dataStore;
        // dataStore = new Array(data);
        // let _value = dataStore[0][0]['Value'];
        // /////////
        // if (_value == '1') {
        //   if (evaluator['IgnoreError'] == '0') {
        //     this.form.setErrors({ "error": evaluator['MessageText'] });
        //   } else {
        //     console.log(evaluator['MessageText']);
        //   }
        // }

        //15022023: QUYDV sửa lại code trên, bị lỗi --> chuyển từ getData sang getDataOuput
        this.output = <Array<Object>>(data['output']);
        this._error = this.output['@_Error'];
        this._errorMess = this.output['@_ErrorMessage'];
        if (this._error) {
          if (this._errorMess == '')
            this.form.setErrors({ "error": evaluator['MessageText'] });
          else
            this.form.setErrors({ "error": this._errorMess });
        }
      }
    } else {
      const expr = this.fn_translate_expr(evaluator['Expression'], this.parentData);
      let flag = eval(expr);
      if (flag == true) {
        if (evaluator['IgnoreError'] == '0') {
          this.form.setErrors({ "error": evaluator['MessageText'] });
        } else {
          console.log(evaluator['MessageText']);
        }
      }
    }
  }

  private async fn_Evaluator_Validate_Child(evaluator, rowIndex: number) {
    const keys = evaluator['ConstraintKey'].split(',');
    let cols = '';
    if (evaluator['DataMember'])
      cols = evaluator['DataMember'].split(',');
    const params = new Array<ParameterContract>();
    const flagParam = false;

    try {
      let gridtmp: wjcGrid.FlexGrid = this.gridArray[Number(evaluator['Tables'])];
      let row = gridtmp.itemsSource.sourceCollection[rowIndex];
      const params = this.fn_build_paramater(keys, row);

      if (evaluator['Command'].includes('ufn_')) {
        const params = this.fn_build_paramater_child_ufn(evaluator['Command'], keys, Number(evaluator['Tables']))
        this.service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Web_ExecuteFunction', params)
          .toPromise().then(data => {
            if (data['0']['Value'] == '1') {
              if (evaluator['IgnoreError'] == '0') {
                this.form.setErrors({ "error": evaluator['MessageText'] });
                this.totalErrorChild = this.totalErrorChild + 1;
              } else {
                console.log(evaluator['MessageText']);
              }
            }
            else {
              this.totalErrorChild = this.totalErrorChild - 1;

              if (this.totalErrorChild <= 0) {
                this.form.setErrors(null);
              }
            }
          });


      }
      else {
        let data = await this.service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, evaluator['Command'], params)
          .toPromise().then(data => {

            if (data['0']['Value'] == '1') {
              if (evaluator['IgnoreError'] == '0') {
                this.form.setErrors({ "error": evaluator['MessageText'] });
                this.totalErrorChild = this.totalErrorChild + 1;
              } else {
                console.log(evaluator['MessageText']);
              }
            }
            else {
              this.totalErrorChild = this.totalErrorChild - 1;


              if (this.totalErrorChild <= 0) {

                this.form.setErrors(null);
              }
            }
          });


      }
    }
    finally {
    }

  }

  private async fn_Evaluator_Validate_Child_XML(evaluator, rowIndex: number) {
    const keys = evaluator['ConstraintKey'].split(',');
    let cols = '';
    if (evaluator['DataMember'])
      cols = evaluator['DataMember'].split(',');
    const params = new Array<ParameterContract>();
    const flagParam = false;


    try {
      let gridtmp: wjcGrid.FlexGrid = this.gridArray[Number(evaluator['Tables'])];

      let row = gridtmp.itemsSource.sourceCollection[rowIndex];
      const params = this.fn_build_paramater(keys, row);

      if (evaluator['Command'].includes('ufn_')) {

        const params = this.fn_build_paramater_child_ufn(evaluator['Command'], keys, Number(evaluator['Tables']))
        this.service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Web_ExecuteFunction', params)
          .toPromise().then(data => {
            if (data['0']['Value'] == '1') {
              if (evaluator['IgnoreError'] == '0') {
                this.form.setErrors({ "error": evaluator['MessageText'] });
              } else {
                console.log(evaluator['MessageText']);
              }
            }
            else {
              this.form.setErrors(null);
            }
          });


      }
      else {
        let flag = false;
        let paramXML = new ParameterContract();
        paramXML.ParameterName = this.convertParameterName(evaluator['ParameterXmlName']);
        paramXML.ParameterValue = evaluator['ParameterXmlName'];

        params.push(paramXML);

        let ds = Global.getDataSetContract(
          {
            name: evaluator['ParameterXmlName'],
            collection: gridtmp.itemsSource.items //this.grid1.itemsSource.items
          }
        )

        let data = await this.service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, evaluator['Command'], params, ds).toPromise().then(
          data => {
            let dataStore;
            dataStore = new Array(data);

            let _value = dataStore[0]['data'][0][0]['Value'];
            console.log(_value);
            if (_value == '1') {
              if (evaluator['IgnoreError'] == '0') {
                flag = true;
                this.form.setErrors({ "error": evaluator['MessageText'] });
              } else {
                console.log(evaluator['MessageText']);
              }
            }
            else {

              this.form.setErrors(null);
            }
          }
        );
        if (flag) {
          this.form.setErrors({ "error": evaluator['MessageText'] });
        }

      }
    }
    catch (ex) {
      console.log(ex);
    }

  }

  //Kit: 19/01/2018 Xử lý binding cha xuống con
  private async fn_Evaluator_Binding_Child(evaluator) {

    let ds = this.gridArray[evaluator['Tables']].itemsSource.sourceCollection;
    if (ds.length <= 0)
      return;

    let value;
    if (evaluator['Value']) {
      value = this.parentData[evaluator['Value']];
    }

    let colchild = evaluator['DataMember'];

    let gridtmp = this.gridArray[evaluator['Tables']];

    let _tableIndex;
    _tableIndex = evaluator['Tables'];


    let index = 0;
    for (index = 0; index < gridtmp.columns.length; index++) {
      if (gridtmp.columns[index].binding == colchild) {
        break;
      }
    }

    if (wjcCore.isNumber(value))
      value = this.replaceDecimal(value);

    if (value instanceof Date) {
      //if (value != null)
      //Trên giao diện cùng value  
      //value =  '\'' + value.toISOString() + '\'';

    }

    let _length = 0;
    if (gridtmp.allowAddNew && !gridtmp.isReadOnly)
      _length = gridtmp.rows.length - 1;
    else
      _length = gridtmp.rows.length;

    for (let i = 0; i < _length; i++) {
      if (gridtmp.rows[i].dataItem[colchild] != null && gridtmp.rows[i].dataItem[colchild] != '') {
        continue;
      }
      else {
        gridtmp.setCellData(i, index, value);
      }


      for (let obj of this.columnChangedChild) {
        if (obj['Tables'] == _tableIndex) {
          for (const col in obj['columnChanged']) {
            if (col === colchild) {
              const evals = obj['columnChanged'][col]['Evaluators'];
              for (const eva in evals) {
                await this.runEvaluatorChild(evals[eva], i)
              }
            }
          }
        }
      }
    }
  }

  fn_Evaluator_Binding_ChildAll(evaluator) {
    let ds = this.gridArray[evaluator['Tables']].itemsSource.sourceCollection;
    if (ds.length <= 0)
      return;

    let value;
    if (evaluator['Value']) {
      value = this.parentData[evaluator['Value']];
    }

    let colchild = evaluator['DataMember'];

    let gridtmp = this.gridArray[evaluator['Tables']];

    let _tableIndex;
    _tableIndex = evaluator['Tables'];


    let index = 0;
    for (index = 0; index < gridtmp.columns.length; index++) {
      if (gridtmp.columns[index].binding == colchild) {
        break;
      }
    }

    if (wjcCore.isNumber(value))
      value = this.replaceDecimal(value);

    if (value instanceof Date) {
      //if (value != null)
      //Trên giao diện cùng value  
      //value =  '\'' + value.toISOString() + '\'';

    }

    let _length = 0;
    if (gridtmp.allowAddNew && !gridtmp.isReadOnly)
      _length = gridtmp.rows.length - 1;
    else
      _length = gridtmp.rows.length;

    for (let i = 0; i < _length; i++) {

      gridtmp.setCellData(i, index, value);


      for (let obj of this.columnChangedChild) {
        if (obj['Tables'] == _tableIndex) {
          for (const col in obj['columnChanged']) {
            if (col === colchild) {
              const evals = obj['columnChanged'][col]['Evaluators'];
              for (const eva in evals) {
                this.runEvaluatorChild(evals[eva], i)
              }
            }
          }
        }
      }
    }
  }

  // setParentValue(col: string, value: any) {
  //   if (this.form.contains(col))
  //     try {
  //       this.form.get(col).setValue(value);
  //     }
  //     catch (e) {
  //       this.form.get(col).setValue(Number(value));
  //     }
  //   else
  //     this.parentData[col] = value;
  // }

  //Duong fix 04042018
  setParentValue(col: string, value: any) {
    if (this.form.contains(col))
      try {
        let data = {};
        data[col] = value;
        this.updateValueForm(data);
      }
      catch (e) {
        // this.form.get(col).setValue(Number(value));
      }
    else
      this.parentData[col] = value;
  }

  setChildValue(row: number, col: string, gridIndex: number, value: any) {
    this.gridArray[gridIndex].itemsSource.sourceCollection[row][col] = value;
  }

  private async fn_Evaluator_Query_LoadChild(evaluator, rowIndex?: number) {

    const keys = evaluator['ConstraintKey'].split(',');
    let gridtmp: wjcGrid.FlexGrid = this.gridArray[Number(evaluator['OutputTable'])];
    const flagParam = false;
    for (let control in this.form.controls)
      this.parentData[control] = this.form.get(control).value;

    const params = this.fn_build_paramater(keys, this.parentData);

    let data = await this.service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, evaluator['Command'], params).toPromise();

    let ds: CollectionView = gridtmp.itemsSource;
    ds.itemsAdded.clear();
    ds.itemsEdited.clear();

    var selected = [];
    for (let i = 0; i < gridtmp.rows.length; i++) {
      selected.push(gridtmp.rows[i].dataItem);
    }

    for (let i = 0; i < selected.length; i++) {
      ds.remove(selected[i]);
    }


    if (data.length > 0) {
      for (let row of data) {
        ds.itemsAdded.push(row);
        ds.sourceCollection.push(row);
      }

      for (let column of gridtmp.itemsSource['defaultRow']) {
        for (let row of gridtmp.itemsSource.sourceCollection) {
          if (row[column] == null || row[column] == undefined)
            row[column] = gridtmp.itemsSource['defaultRow'][column];
        }
      }
    }
    // else
    //   gridtmp.itemsSource.sourceCollection = [];

    gridtmp.itemsSource.refresh();

    for (let command of this.buttonCommand) {
      if (this.form.valid)
        await this.runConstraint(command, undefined, null).then();
    }
  }

  private async fn_Evaluator_QueryXml_LoadChild(evaluator, rowIndex?: number) {

    const keys = evaluator['ConstraintKey'].split(',');
    let gridtmp: wjcGrid.FlexGrid = this.gridArray[Number(evaluator['OutputTable'])];
    const flagParam = false;
    for (let control in this.form.controls)
      this.parentData[control] = this.form.get(control).value;
    const params = this.fn_build_paramater(keys, this.parentData);

    let paramXML = new ParameterContract();
    paramXML.ParameterName = this.convertParameterName(evaluator['ParameterXmlName']);
    paramXML.ParameterValue = evaluator['ParameterXmlName'];

    params.push(paramXML);

    let ds = Global.getDataSetContract(
      {
        name: evaluator['ParameterXmlName'],
        collection: this.gridArray[evaluator['Tables']].itemsSource.items //this.grid1.itemsSource.items
      }
    )

    let data = await this.service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, evaluator['Command'], params, ds).toPromise();

    if (data['data'][0].length > 0) {
      let ds: CollectionView = gridtmp.itemsSource;

      var selected = [];
      for (let i = 0; i < gridtmp.rows.length; i++) {
        selected.push(gridtmp.rows[i].dataItem);
      }

      for (let i = 0; i < selected.length; i++) {
        ds.remove(selected[i]);
      }

      for (let row of data['data'][0]) {
        ds.itemsAdded.push(row);
        ds.sourceCollection.push(row);
      }

      for (let column of gridtmp.itemsSource['defaultRow']) {
        for (let row of gridtmp.itemsSource.sourceCollection) {
          if (row[column] == null || row[column] == undefined)
            row[column] = gridtmp.itemsSource['defaultRow'][column];
        }
      }

      // ds.sourceCollection = data;
    }
    else
      gridtmp.itemsSource.sourceCollection = [];

    gridtmp.itemsSource.refresh();

    for (let command of this.buttonCommand) {
      if (this.form.valid)
        await this.runConstraint(command, undefined, null).then();
    }



  }

  private async fn_Evaluator_CopiedValue_Child(evaluator) {

    let gridtmp: wjcGrid.FlexGrid = this.gridArray[Number(evaluator['Tables'])];


    var selected = [];
    let rowNew = gridtmp.itemsSource.items.length - 1;
    if (rowNew < 1)
      return;
    selected.push(gridtmp.rows[rowNew - 1].dataItem);

    let ds = this.gridArray[evaluator['Tables']].itemsSource.sourceCollection;
    if (ds.length < 0)
      return;

    let listCopied = evaluator['DataMember'].split(',');

    for (let _col in listCopied) {
      let value;
      value = selected[0][listCopied[_col]];

      let colchild = listCopied[_col];

      let _tableIndex;
      _tableIndex = evaluator['Tables'];

      let index = 0;
      for (index = 0; index < gridtmp.columns.length; index++) {
        if (gridtmp.columns[index].binding == colchild) {
          break;
        }
      }

      if (wjcCore.isNumber(value))
        value = this.replaceDecimal(value);

      if (value instanceof Date) {
        //if (value != null)
        //Trên giao diện cùng value  
        //value =  '\'' + value.toISOString() + '\'';
      }

      gridtmp.setCellData(rowNew, index, value);
      //this.onCellValueChanged(evaluator['Tables'], colchild, this._event)
    }

  }

  fn_build_paramater(keys: string, row: any) {
    const params = new Array<ParameterContract>();
    for (const key of keys) {
      const param = new ParameterContract();
      let _value;
      if (key.includes('{VAR=')) {
        let tmp = Global.VAR[key];
        param.ParameterName = this.convertParameterName(tmp.Name);
        param.ParameterValue = Global.convertConfig(tmp.Value);
        params.push(param);
      }
      else {
        if (row) {
          _value = row[key];
          if (_value instanceof Date) {
            if (_value != null)
              _value = _value.toISOString();
          }

          if (_value instanceof Array) {
            let _valueLst = ''
            for (let i in _value) {
              _valueLst = _valueLst + ';' + _value[i]['ValueMember']
            }

            _value = _valueLst.slice(1, _valueLst.length);
          }

          param.ParameterName = this.convertParameterName(key);
          param.ParameterValue = _value;
          params.push(param);
        }
      }
    }
    return params;
  }


  fn_build_paramater_ufn(ufn_Name: string, keys: string) {

    const params = new Array<ParameterContract>();
    const param = new ParameterContract();
    param.ParameterName = '@_FunctionName'
    param.ParameterValue = ufn_Name;
    params.push(param);

    const param2 = new ParameterContract();

    param2.ParameterName = '@_Parameter'

    let value_para = '';


    for (const key of keys) {

      const param = new ParameterContract();
      if (key.includes('{VAR=')) {
        let tmp = Global.VAR[key];
        value_para = value_para + ',' + Global.convertConfig(tmp.Value);
      }
      else {

        let _value;
        if (this.form.contains(key)) {
          _value = this.form.get(key).value;

        } else {
          _value = this.parentData[key];
        }
        if (_value instanceof Date) {
          if (_value != null)
            _value = _value.toISOString();
        } else if (_value instanceof Array) {
          let _valueLst = ''
          for (let i in _value) {
            _valueLst = _valueLst + ';' + _value[i]['ValueMember']
          }

          _value = _valueLst.slice(1, _valueLst.length);
        }
        if (!_value && _value != 0) _value = '\'\'';
        value_para = value_para + ',' + _value;
      }
    }
    param2.ParameterValue = value_para;
    params.push(param2);


    return params;
  }

  fn_build_paramater_child_ufn(ufn_Name: string, keys: string, TableIndex: number) {

    const params = new Array<ParameterContract>();
    const param = new ParameterContract();
    param.ParameterName = '@_FunctionName'
    param.ParameterValue = ufn_Name;
    params.push(param);

    const param2 = new ParameterContract();

    param2.ParameterName = '@_Parameter'

    let value_para = '';

    for (const key of keys) {
      if (key.includes('{VAR=')) {
        let tmp = Global.VAR[key];
        value_para = value_para + ',' + Global.convertConfig(tmp.Value);
      }
      else {

        let _value;

        if (this.gridArray[TableIndex].itemsSource.currentItem[key] != undefined) {
          //console.log(this.gridArray[TableIndex].itemsSource.currentItem[key]);
          _value = this.gridArray[TableIndex].itemsSource.currentItem[key];

        } else {
          _value = this.parentData[key];
        }
        if (_value instanceof Date) {
          if (_value != null)
            _value = _value.toISOString();
        }

        // if (!_value) 
        // {
        //   _value = '\'\'';
        // }
        value_para = value_para + ',' + _value;
      }
    }
    param2.ParameterValue = value_para;
    params.push(param2);

    return params;
  }


  fn_translate_expr(expr, row: any, child?: any) {
    if (!expr) { return true; }

    let _result = expr;
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
      // console.log(control);
      // console.log(row[control]);
      if (_result.indexOf(control) > -1) {
        let value = row[control];

        if (value == undefined)
          value = child[control];

        if (value instanceof Array) {
          value = value.copyWithin(0, 0);
          let arr = [];
          for (let i in value) {
            arr.push(value[i]['ValueMember']);
          }
          value = arr.join(',');
        }

        if (value instanceof Date) {
          if (value != null)
            value = '\'' + value.toISOString() + '\'';
        } else {
          value = this.replaceDecimal(value);
        }

        do {
          _result = _result.replace(control, value);
        }
        while (_result.indexOf(control) > -1)
      }
    }
    /*
        ///PARENT dương
        if (expr.indexOf('PARENT.') >= 0) {
          for (const control of this.parentData) {
            console.log('kakakakakakkakakaa');
            // console.log(control);
            // console.log(row[control]);
            if (_result.indexOf('PARENT.' + control) > -1) {
              console.log('hahahahahahhahaha');
    
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
                _result = _result.replace(control, value);
              }
              while (_result.indexOf(control) > -1)
            }
          }
        }
        //
    */
    if (_result.indexOf(' AND ') > -1) {
      _result = _result.split(' AND ').join(' && ');
    }
    if (_result.indexOf(' OR ') > -1) {
      _result = _result.split(' OR ').join(' || ');
    }

    return _result;
  }



  translate_expr_control(expr, row: any, child?: any) {
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

  fn_translate_expr_grid(expr, row: any, child?: any) {
    if (!expr) { return true; }

    let _result = expr;
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

    return _result;
  }

  replaceDecimal(value) {
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

  child(alias, name) {
    const dictionaries = {};
    dictionaries[alias] = name;

    return dictionaries;
  }

  parent(name) {
    return '#' + name;
  }

  sum(column) {
    // var total = 0;

    // $.each(column, function (key, value) {
    //     $.each(this.data.ChildData.Rows, function (indexRow, row) {
    //         $.each(row.Cells, function (indexCell, cell) {
    //             if (cell.Name == value && this.replaceDecimal(cell.Value) != 0) {
    //                 total += this.replaceDecimal(cell.Value);
    //             }
    //         })
    //     })
    // })

    // return total;
  }

  isNull(expresion, replace) {
    if (expresion == null) {
      return replace;
    }
    return expresion;
  }

  replaceString(expr: any, symbol: string) {
    let result = '';
    for (let i = 0; i < expr.length; i++) {
      if (expr[i] == symbol)
        continue;
      result += expr[i]
    }

    return result;
  }


  translate_Parameter_linkCommand(expr, row: any, child?: any) {
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

  translate_expr_Filter_sql(expr, row: any, child?: any) {
    let _result = expr;

    if (row == undefined) {
      let controls: string[] = [];

      if (child)
        for (const control in child) {
          controls.push(control);
        }

      controls.sort((a, b) => b.length - a.length);

      for (const control of controls) {
        let patern = '{EXPR=' + control + '}';
        if (_result.indexOf(patern) > -1) {
          let value = child[control];

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
    }
    else {
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

      }
    }
    return _result;

  }

  fn_translate_expr_grid_sql(expr, row: any, child?: any) {
    if (!expr) { return true; }

    let _result = expr;
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

    return _result;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
