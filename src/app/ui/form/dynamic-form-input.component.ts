import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { InputBase } from './../input/InputBase';
import { LookupBoxInput } from '../input/LookupBoxInput';

import * as wjcCore from 'wijmo/wijmo';
import * as wjcInput from 'wijmo/wijmo.angular2.input';
import { MultiSelectInput } from '../input/MultiSelectInput';
import { UploadInput } from '../input/UploadInput';
import { TextBoxInput } from '../input/TextBoxInput';
import { Subscription } from 'rxjs';
import { RichTextBoxInput } from '../input/RichTextBoxInput';


@Component({
  selector: 'df-input',
  templateUrl: './dynamic-form-input.component.html',
  styleUrls: ['dynamic-form-input.component.css']
})

export class DynamicFormInputComponent {
  @Input() input: InputBase<any>;
  @Input() form: FormGroup;
  @Input() dataSource: any;
  @Input() isUsingBinding: boolean;

  @ViewChild('wjAuto') wjAuto: wjcInput.WjAutoComplete;
  @ViewChild('wjNumber') wjNumber: wjcInput.WjInputNumber;
  @ViewChild('wjinput') wjinput: any;
  @ViewChild('wjDate') wjDate: wjcInput.WjInputDate;
  @ViewChild('wjMultiSelect') wjMultiSelect: wjcInput.WjMultiSelect;
  @ViewChild('fileInput') fileInput: any;

  @Output('clickCommand') clickCommand = new EventEmitter();
  @Output('downloadCommand') downloadCommand = new EventEmitter();
  @Output('valueChanged') valueChanged = new EventEmitter();
  @Output('toogle') toogle = new EventEmitter();

  subscription: Subscription;

  constructor() {
    this.subscription = new Subscription();

  }
  
  tooglePin(u, e) {
    this.toogle.emit({
      data: u,
      event: e
    });
  }
  get isValid() { return this.form.controls[this.input.key].valid; }

  get errorMessage() {
    const control = this.form.controls[this.input.key];

    if (!this.isValid) {
      if (control && control.hasError('required')) {
        return 'Không bỏ trắng giá trị';
      }
      if (control && control.hasError('minlength')) {
        return 'Chưa đủ độ dài';
      }
      if (control && control.hasError('ccmmessage1')) {
        return 'Không được để trống giá trị hoàn ứng';
      }
      return 'Giá trị nhập không hợp lệ';
    }

    return '';
  }

  private get data(): wjcCore.CollectionView {
    if (this.wjAuto) {
      return this.wjAuto.itemsSource;
    }

    return new wjcCore.CollectionView();
  }

  clickCustom() {
    this.clickCommand.emit(this.input.key);
  }


  onGotFocus(control: InputBase<any>) {
    if (control instanceof MultiSelectInput) {
      let arr = [];
      // if (this.wjMultiSelect.checkedItems.length >= 1) {
      for (let i of this.wjMultiSelect.checkedItems) {
        arr.push(i["ValueMember"]);
      }
      let input = <HTMLInputElement>document.getElementById("alterInput" + control.key);
      input.value = arr.join(',');
      input.removeAttribute("readonly");
      input.select();
    } else if (control instanceof LookupBoxInput) {
      if (this.wjAuto.selectedItem) {
        this.wjAuto.inputElement.value = this.wjAuto.selectedItem["ValueMember"];
      } else {
        this.wjAuto.inputElement.value = '';
      }
    }
  }

  onLostFocus(control: InputBase<any>) {
    if (control instanceof MultiSelectInput) {
      let arr = [];
      // if (this.wjMultiSelect.checkedItems.length >= 1) {
      for (let i of this.wjMultiSelect.checkedItems) {
        let display = control.hideValueMember ? i["DisplayMember"] : i["ValueMember"] + ": " + i["DisplayMember"];
        arr.push(display);
      }
      let input = <HTMLInputElement>document.getElementById("alterInput" + control.key);
      input.value = arr.join(',');
      input.setAttribute("readonly", "");
      //Dương thêm 8/6
      this.valueChanged.emit(input);
    } else if (control instanceof LookupBoxInput) {
      let i = this.wjAuto.selectedItem;
      if (i) {
        let display = control.hideValueMember ? i["DisplayMember"] : i["ValueMember"] + ": " + i["DisplayMember"];
        this.wjAuto.inputElement.value = display;
      } else {
        this.wjAuto.inputElement.value = '';
      }

    } else if (control instanceof TextBoxInput) {
        this.valueChanged.emit(control);
    }
    // if (this.isUsingBinding) {
    //   if(control instanceof LookupBoxInput && this.wjAuto.selectedItem['ValueMember']){
    //     // this.bindingValue();
    //     // this.valueChanged.emit(this.input);
    //   } else  if(control instanceof MultiSelectInput && this.wjMultiSelect.checkedItems.length > 0 ) {
    //     // this.bindingValue();
    //     // this.valueChanged.emit(this.input);
    //   }
    // }
  }
  
  // tslint:disable-next-line:member-ordering
  flag = false;
  onSelectedIndexChanged(control: LookupBoxInput) {
    // setTimeout(() => {
    //   if (control.defaultValue[control.key] && !this.flag) {
    //     console.log('---------------------------------------------------');
    //     control.lookupfilter = this.translate_expr(control.lookupfilter);
    //     control.getLookupData(control.defaultValue[control.key]);
    //     this.flag = true;
    //   }
    // }, 1000);
    // this.form.controls[this.input.key].setValue(this.data.items[this.data._idx][source]);
  }

  async onKeyPress(e) {
    if (this.input instanceof LookupBoxInput) {

      if (this.input.options._idx == -1) {
        this.input.lookupfilterCurrent = this.translate_expr(this.input.lookupfilter);
        await this.input.getLookupData(this.wjAuto.text).then();
        // if(!this.wjAuto.isDroppedDown)
        //     this.wjAuto.isDroppedDown = true;
      }
    }
  }

  getQueries = this.getQueriesFunc.bind(this);
  async getQueriesFunc(query, max, callback) {
    if (this.input instanceof LookupBoxInput) {
      if (this.wjAuto) {
        this.input.lookupfilterCurrent = this.translate_expr(this.input.lookupfilter);
        await this.input.getLookupData(this.wjAuto.text, false, callback).then();
      }
    }
  }

  onDateChanged(e) {
    if (this.wjDate) {
      if (this.wjDate.value != undefined && this.wjDate.value != null) {
        let date = this.wjDate.value;
        let _value = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        this.form.get(this.input.key).setValue(_value);
      }
    }
  }

  onNumberChanged(e) {
    // console.log(e);
    this.form.get(this.input.key).setValue(this.wjNumber.value);
  }

  async onDroppedDownChanging(control: any, e: wjcCore.CancelEventArgs) {
    let _valueFirst = '';
    if (control instanceof LookupBoxInput) {
      try {
        if (this.wjAuto.itemsSource.items[0])
          _valueFirst = this.wjAuto.itemsSource.items[0]['ValueMember'];
      }
      finally { }

      let tmp = this.wjAuto.text || '';
      // if (this.data.items.length <= 1 && !_valueFirst && tmp == _valueFirst) {
      if (tmp == '') {
        control.lookupfilterCurrent = this.translate_expr(control.lookupfilter);
        await control.getLookupData('').then();
        if (this.wjAuto.itemsSource.items.length != control.options.items.length)
          this.wjAuto.itemsSource = control.options;
      }
      else if (this.wjAuto.itemsSource.items.length == 1 && _valueFirst && this.wjAuto.text.indexOf(_valueFirst) == 0) {
        control.lookupfilterCurrent = this.translate_expr(control.lookupfilter);

        await control.getLookupData('#' + _valueFirst, true).then();
      }
    } else if (control instanceof MultiSelectInput) {
      if (this.wjMultiSelect.isDroppedDown == false && this.wjMultiSelect.checkedItems.length < 1) {
        control.lookupfilterCurrent = this.translate_expr(control.lookupfilter);
        let input = <HTMLInputElement>document.getElementById("alterInput" + control.key);
        let arr = [];
        for (let i = 0; i < this.wjMultiSelect.checkedItems.length; i++) {
          arr.push(this.wjMultiSelect.checkedItems[i]['ValueMember']);
        }
        control.getLookupData('^' + arr.join(','), true);
      }
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    if (this.input.isReadOnly) {
      let _element = document.getElementById(this.input.key);
      if (_element) {
        _element.setAttribute("readonly", "readonly");
        let _childs = _element.getElementsByTagName('input');
        for (let i = 0; i < _childs.length; i++) {
          _childs.item(i).setAttribute("readonly", "readonly");
        }
      }

    }

    if (this.input.isDisabled) {
      let _element = document.getElementById(this.input.key);
      if (_element) {
        _element.setAttribute("disabled", "disabled");
        let _childs = _element.getElementsByTagName('input');
        for (let i = 0; i < _childs.length; i++) {
          _childs.item(i).setAttribute("disabled", "disabled");
        }
      }
    }

    const sub = this.form.get(this.input.key).valueChanges.subscribe(val => {
      if (this.input.controlType != 'lookup' && this.input.controlType != 'multiselect' && this.input.controlType != 'richtextbox' && this.input.controlType != 'textbox') {
        this.valueChanged.emit(this.input);
      }
      else {
        if (this.input instanceof LookupBoxInput) {
          let _value = this.form.get(this.input.key).value;

          if (_value && this.input.options._idx == -1 && !this.flag) {
            if (this.input.lookupfilter.indexOf('{EXPR=') > 0)
              this.input.lookupfilterCurrent = '';
            else
              this.input.lookupfilterCurrent = this.translate_expr(this.input.lookupfilter);
            this.input.getLookupData(_value, true).then();

            this.flag = true;
          }
          else if (this.input.options._idx > -1 && this.wjAuto.selectedItem != null && this.wjAuto.selectedItem != undefined && this.wjAuto.selectedItem['ValueMember']) {
            if (this.isUsingBinding)
              this.bindingValue();

            this.valueChanged.emit(this.input);
          }
        }
        else if (this.input instanceof MultiSelectInput) {
          let _value = this.form.get(this.input.key).value;
          let arr = [];
          for (let i = 0; i < _value.length; i++) {
            arr.push(_value[i]['DisplayMember']);
          }
          let input = <HTMLInputElement>document.getElementById("alterInput" + this.input.key);
          input.value = arr.join(',');
          // this.valueChanged.emit(this.input);
        } else if (this.input instanceof UploadInput) {

        } else if (this.input instanceof RichTextBoxInput) {
        }
      }
    });

    this.subscription.add(sub);


    // if (this.input instanceof RichTextBoxInput && this.richtextInput != undefined) {
    //   this.richtextInput.on('change', () => {
    //     this.form.get(this.input.key).setValue(this.richtextInput.getData(), { onlySeft: true, emitEvent: true });
    //   });
    // }
  }

  private translate_expr(expr) {
    if (!expr) { return expr; }
    let _result = expr;
    let controls: string[] = [];
    for (const control in this.form.controls) {
      controls.push(control);
    }

    for (let control in this.dataSource) {
      controls.push(control);
    }

    controls.sort((a, b) => b.length - a.length);

    for (const control of controls) {
      let patern = '{EXPR=' + control + '}';
      if (_result.indexOf(patern) > -1) {
        let value;

        if (this.form.contains(control))
          value = this.form.get(control).value;

        if (value == undefined) {
          value = this.dataSource[control];
        }
        if (value instanceof Array) {
          value = value.copyWithin(0, 0);
          let arr = [];
          for (let i in value) {
            arr.push(value[i]['ValueMember']);
          }
          value = arr.join(',');
        }
        else if (value instanceof Date) {
          if (value != null)
            value = value.toISOString();
        }

        do {
          _result = _result.replace(patern, value);
        }
        while (_result.indexOf(patern) > -1)
      }
    }
    return _result;
  }

  async bindingValue() {
    if (this.form) {

      const lookup = this.input;
      if (lookup instanceof LookupBoxInput) {
        if (lookup.binding) {
          // tslint:disable-next-line:forin
          for (const source in lookup.binding) {
            let des = lookup.binding[source];
            let isDate = false;
            if (des.includes('#')) {
              des = des.replace('#', '');
              isDate = true;
            }
            let isOverride = false;
            if (des.includes('(')) {
              des = des.replace('(', '');
              des = des.replace(')', '');
              isOverride = true;
            }
            if (!this.form.contains(des)) {
              if (this.data.items[this.data._idx] != undefined) {

                if (this.data.items[this.data._idx][source] != undefined) {
                  this.dataSource[des] = this.data.items[this.data._idx][source];
                } else {
                  this.dataSource[des] = null;
                }
              }
              continue;
            }

            const _control = lookup.controlCollection.find(_c => _c.key === des);
            switch (_control.controlType) {
              case 'lookup':
                if (_control instanceof LookupBoxInput) {
                  if (this.data.items[this.data._idx] != undefined) {
                    if (this.data.items[this.data._idx][source] != undefined) {
                      _control.lookupfilterCurrent = this.translate_expr(_control.lookupfilter);
                      await _control.getLookupData(this.data.items[this.data._idx][source], true).then();
                    } else {
                      _control.lookupfilterCurrent = this.translate_expr(_control.lookupfilter);
                      await _control.getLookupData('', true).then();
                    }
                  }
                }
                break;
              case 'multiselect':
                if (_control instanceof MultiSelectInput) {
                  if (this.data.items[this.data._idx] != undefined) {
                    if (this.data.items[this.data._idx][source] != undefined) {

                      _control.lookupfilterCurrent = this.translate_expr(_control.lookupfilter);
                      _control.getLookupData('^' + this.data.items[this.data._idx][source], false).then(() => {
                        if (_control instanceof MultiSelectInput) {
                          if (_control.selectedItems.length > 0) {
                            // this.form.get(control.key).reset();
                            this.form.get(_control.key).setValue(_control.selectedItems, { onlySeft: true, emitEvent: false });

                          }
                        }
                      });
                    } else {
                      _control.lookupfilterCurrent = this.translate_expr(_control.lookupfilter);
                      _control.getLookupData('^', false).then(() => {
                        if (_control.selectedItems.length > 0) {
                          this.form.get(_control.key).setValue(_control.selectedItems, { onlySeft: true, emitEvent: false });
                        }
                      });
                    }
                  } 
                }
                break;
              case 'number':
                if (this.data.items[this.data._idx] != undefined) {
                  if (this.data.items[this.data._idx][source] != undefined) {
                    this.form.controls[des].setValue(this.data.items[this.data._idx][source]);
                  } else {
                    this.form.controls[des].setValue(0);
                  }
                }
                break;
              case 'textbox':
                if (this.data.items[this.data._idx] != undefined) {
                  if (this.data.items[this.data._idx][source] != undefined) {
                    this.form.controls[des].setValue(this.data.items[this.data._idx][source]);
                  } else {
                    this.form.controls[des].setValue('');
                  }
                }
                break;
              default:
                if (this.data.items[this.data._idx] != undefined) {
                  if (this.data.items[this.data._idx][source] != undefined) {
                    this.form.controls[des].setValue(this.data.items[this.data._idx][source]);
                  } else {
                    this.form.controls[des].setValue(null);
                  }
                }
                break;
            }
          }
        }
      }
    }
  }
  isFirst = true;
  onCheckedItemsChanged(control: MultiSelectInput) {
    // console.log(this.form.get(control.key).value);
  }
  onDroppedDown(control: MultiSelectInput) {
    if (this.input instanceof MultiSelectInput) {
      if (this.wjMultiSelect.isDroppedDown && this.wjMultiSelect.checkedItems.length < 1) {
        control.lookupfilterCurrent = this.translate_expr(control.lookupfilter);
        // console.log(control.lookupfilterCurrent);
        control.getLookupData('^', true);
      }
    }
  }


  fileChanged() {
    let file = this.fileInput.nativeElement.files[0];
    
    if (this.input instanceof UploadInput) {
      if (file) {
        this.input.file = file;
        this.input.fileName = file.name;
        try{
          this.form.get(this.input.key).setValue(file.name);
        }
        catch(e){
        }
        
      } else {
        this.input.file = undefined;
        this.input.fileName = '';
        try{
          this.form.get(this.input.key).setValue('');
        }
        catch(e){
        }
      }
    }
  }


  init(control: InputBase<any>) {
    if (control instanceof MultiSelectInput) {
      this.wjMultiSelect.inputElement.id = "alterInput" + control.key;
      this.wjMultiSelect.inputElement.outerHTML += '<input wj-part="input" type="text" class="wj-form-control" style="display:none;" readonly="">';
      this.wjMultiSelect.removeEventListener(this.wjMultiSelect.hostElement, 'keypress');
      this.wjMultiSelect.removeEventListener(this.wjMultiSelect.hostElement, 'keydown');
      this.wjMultiSelect.removeEventListener(this.wjMultiSelect.inputElement, 'click');

      let input = <HTMLInputElement>document.getElementById("alterInput" + control.key);
      this.wjMultiSelect.listBox.formatItem.addHandler((s, e: any) => {
        // console.log(e.item.innerHTML);
        if (e.data) {
          let display = '<strong>' + e.data.ValueMember + '</strong>' + ': ' + e.data.DisplayMember;
          let checked = e.data.State ? ' checked ' : ' ';
          let html = '<label><input type="checkbox"' + checked + '> ' + display + ' </label>';
          e.item.innerHTML = html;
        }
      });
      this.wjMultiSelect.listBox.gotFocus.addHandler(() => {
        input.focus();
      });
      var tid;
      input.addEventListener('keyup', () => {
        if (this.wjMultiSelect.isDroppedDown == false)
          this.wjMultiSelect.isDroppedDown = true;
        let arr = [];
        for (let i = 0; i < this.wjMultiSelect.checkedItems.length; i++) {
          arr.push(this.wjMultiSelect.checkedItems[i]['ValueMember']);
        }
        if (tid != undefined) {
          clearTimeout(tid);
        }

        tid = setTimeout(() => {
          control.getLookupData('^' + arr.join(',') + '?' + input.value, true).then(() => {
          });
        }, 500)
      });
    } else if (control instanceof LookupBoxInput) {
      this.wjAuto.listBox.formatItem.addHandler((s, e: any) => {

        if (e.data) {
          e.item.innerHTML = '<strong>' + e.data.ValueMember + '</strong>' + ': ' + e.data.DisplayMember;
        } else {
          e.item.innerHTML = '';

        }
      });
    }
  }

  download(view: boolean) {
    if (this.input instanceof UploadInput) {
      let name = view ? this.input.fileNameDownLoad + '.pdf' : this.input.fileNameDownLoad;
      this.input.downloadFile(this.input.folderName, this.input.parentId, name);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
