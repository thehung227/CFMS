import { AfterViewInit, Output, EventEmitter } from '@angular/core';
import { InputBase } from './InputBase';
import { WjAutoComplete } from 'wijmo/wijmo.angular2.input';
import { BaseService } from './../../base/base.service';
import { Global } from './../../shared/global';

import * as wjcCore from 'wijmo/wijmo';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

export class MultiSelectInput extends InputBase<any> {
  controlType = 'multiselect';
  lookupKey: string;
  lookupfilter: string;
  lookupfilterCurrent: string;
  options: wjcCore.CollectionView = new wjcCore.CollectionView(['']);
  binding: {};
  hideValueMember = false;
  selectedItems: any = [];
  maxRow: number;

  // defaultValue: any;

  constructor(options: {} = {},
    private service?: BaseService
  ) {
    super(options);
    this.maxRow = options['maxRow'] || 10;
    this.lookupKey = options['lookupKey'] || '';
    this.lookupfilter = options['lookupfilter'] || '';
    this.hideValueMember = options['hideValueMember'] || false;
    this.binding = options['binding'];
    // this.defaultValue = data;

    // setTimeout(() => {
    //     if (data[this.key]) {
    //         this.getLookupData(data[this.key]);
    //     }
    // }, 500);
  }

  private _bindings: string;
  private get bindingList(): string {
    if (!this.binding) {
      return '';
    } else {
      let _zBindingList = '';

      for (const key in this.binding) {
        if (_zBindingList) {
          _zBindingList += ',' + key;
        } else {
          _zBindingList += key;
        }
      }

      return _zBindingList;
    }
  }

  public translate_expr(expr, row: any) {
    if (!expr) { return expr; }
    let _result = expr;
    let controls: string[] = [];
    for (const control in row) {
      controls.push(control);
    }
    controls.sort((a, b) => b.length - a.length);

    for (const control of controls) {
      let patern = '{EXPR=' + control + '}';
      if (_result.indexOf(patern) > -1) {
        let value = row[control].value;
        if (value instanceof Date) {
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

  async getLookupData(term: string, isRefresh?: boolean, ) {
    if (this.lookupKey) {
      let dataTMP = await this.service.getLookupNew(Global.LookupEndpoint, this.lookupKey, term, this.lookupfilterCurrent, this.bindingList,this.maxRow).toPromise();

      if (!isRefresh)
        this.options.sourceCollection = [];
      let lastv = '';
      let lastid = -1;
      if (term.toString().indexOf('#') == 0) {
        lastv = term.replace('#', '');
      }
      let index = 0;
      for (let item = 0; item < dataTMP.length; item++) {
        dataTMP[item].ValueMember = dataTMP[item].ValueMember+"";
        if (dataTMP[item].ValueMember == lastv) { lastid = item; }
        dataTMP[item].DisplayMember = dataTMP[item].DisplayMember;
        if (dataTMP[item].State == true) {
          this.selectedItems.push(dataTMP[item]);
        }
        if (!isRefresh)
          this.options.sourceCollection.push(dataTMP[item]);

      }

      if (dataTMP.length > 0) {
        this.options.sourceCollection = dataTMP;
      } else {
        this.options.sourceCollection = [''];
      }

    }
  }

}

