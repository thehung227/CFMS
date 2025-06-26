import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcGridDetail from 'wijmo/wijmo.grid.detail';
import * as wjcGridXlsx from 'wijmo/wijmo.grid.xlsx';
import * as wjcInput from 'wijmo/wijmo.angular2.input';
import * as wjcXlsx from 'wijmo/wijmo.xlsx';

import { ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputBase } from '../../ui/input/InputBase';
import { Router, ActivatedRoute } from '@angular/router';
import { InputControlService } from '../../ui/input/InputControlService';
import { Global, FilterCommand } from '../../shared/global';
import { ParameterContract } from '../../contracts/parameter.contract';
import { DateBoxInput } from '../../ui/input/DateBoxInput';
import { CheckBoxInput } from '../../ui/input/CheckBoxInput';
import { TextBoxInput } from '../../ui/input/TextBoxInput';
import { BravoCtorEnum } from '../../core/enum/type.enum';
import { CollectionView } from 'wijmo/wijmo';
import { Command } from 'selenium-webdriver';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { SystemConstants } from '../../core/common/system.constants';
import { UrlConstants } from '../../core/common/url.constants';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { Title } from '@angular/platform-browser';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { saveAs as importedSaveAs } from "file-saver";
import { CryptoExtension } from '../../core/extensions/crypto.extension';
import { CKEDITOR, CKEditorExtension } from '../../core/extensions/ckeditor.extension';
import { Popup } from '../../../../node_modules/wijmo/wijmo.input';
import { Expression } from '../../shared/expression';
import { MailForm } from '../../ui/mail-form/mail-form';

export abstract class BaseExplorerComponent implements OnDestroy {

  protected isSysAdmin: string;
  protected data: wjcCore.CollectionView;
  protected datachild: wjcCore.CollectionView;

  protected grid: wjcGrid.FlexGrid;
  protected gridChild: wjcGrid.FlexGrid;

  protected contentFilter: ElementRef;

  protected form: FormGroup;
  protected inputs: InputBase<any>[] = [];

  protected dialogFrm: DialogComponent;
  protected dialogFrm2: DialogComponent;

  protected isUsingFilter: boolean = false;
  protected contentFilterHeight: number = 500;
  protected body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  protected zParentTableName: string;
  protected zFilterKey: string;

  protected pageNumber: number = 1;
  protected rowPage: number;
  protected fieldOrderBy: string;

  protected filterData = [];

  protected _layoutDeclare: any;
  protected navigateUrl: any;

  protected totalPage: number;
  showLoading = false;
  subscription: Subscription;
  protected zChildTableName: string;

  protected zCommandKey: string;

  protected showDialog = false;
  protected dialogAgree = false;
  protected titleConfirmDialog: string;

  protected dataPrint: wjcCore.CollectionView;
  protected outputPrint: Array<Object>;
  protected gridPrint: wjcGrid.FlexGrid;
  protected _layoutPrinter: any;
  protected listLayoutPrint: Array<Object>;

  protected dataMenu: Array<Object>;
  protected dataExlorer: Array<Object>;

  protected zMenuTableName: string;
  protected zMenuFilterKey: string;

  protected zMenuTableNameLookup1: string;
  protected zMenuFilterKeyLookup1: string;
  protected zMenuColumnFilterLookup1: string;

  protected zMenuTableNameLookup2: string;
  protected zMenuFilterKeyLookup2: string;
  protected zMenuColumnFilterLookup2: string;

  protected zMenuTableNameLookup3: string;
  protected zMenuFilterKeyLookup3: string;

  protected isPermisionExAll_isAddNew: boolean;
  protected isPermisionExAll_isEdit: boolean;
  protected isPermisionExAll_isDelete: boolean;
  protected isPermisionExAll_isRecall: boolean;
  protected isPermisionExAll_isPrint: boolean;
  protected isPermisionExAll_isExport: boolean;


  //// Dương: url img
  protected urlImg: string = Global.ImgEndpoint;

  protected _lookup1Value: string;
  protected lookup1List: Array<Object>;
  protected _lookup2Value: string;
  protected lookup2List: Array<Object>;
  protected _lookup3Value: string;
  protected lookup3List: Array<Object>;



  // protected _filterKeyApply: string;

  protected localFilter: Array<FilterCommand>;

  //Mail explorer
  richtextMail: CKEDITOR.editor;
  protected folderNameSendMail;

  SendMailObject = {
    from: '',
    nameSend: '',
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    plainTextMessage: '',
    mailToken: '',
    htmlMessage: null,
    files: [],
    smtpOptions: { server: '', user: '', password: '', port: 25, useSsl: true, requiresAuthentication: true },
    //replacement: null,
    exportOption: null,
    mailType: ''
  }

  constructor(private _service: BaseExplorerService,
    protected router: Router,
    protected ics: InputControlService,
    protected titleService: Title,
    protected route: ActivatedRoute
  ) {
    let permission = this.route.snapshot.data['permission'];
    let permission2 = <Array<Object>>JSON.parse(localStorage.getItem(SystemConstants.PERMISSION_DATA));

    this.zCommandKey = router.url.split('/')[2] + '-' + router.url.split('/')[3].replace('index', 'explorer');
    this.setPermission(permission, permission2);

    this.subscription = new Subscription();

    if (Global.getPermissionAll(permission, permission2, this.zCommandKey, 'IsDisplay') == false && localStorage.getItem(SystemConstants.CURRENT_ISSYSADMIN) == 'false') {
      alert('Người sử dụng hiện thời không có quyền truy cập!');
      this.router.navigate([UrlConstants.HOME]);
    }

  }

  async addFilterCache(_key: string, _filter?: string, _filter1?: string, _filter2?: string) {

    this.localFilter = JSON.parse(localStorage.getItem(SystemConstants.FILTER_DATA));

    let fc = this.localFilter.find(obj => obj['key'] == _key);

    let _indexfc = this.localFilter.indexOf(fc);

    if (fc != undefined) {
      let filterTmp = fc;

      if (_filter != '' && _filter != null)
        filterTmp.filter = _filter;
      else if (_filter == null)
        filterTmp.filter = filterTmp.filter;
      else if (_filter == '')
        filterTmp.filter = '';

      if (_filter1 != '' && _filter1 != null)
        filterTmp.filter1 = _filter1;
      else if (_filter1 == null)
        filterTmp.filter1 = filterTmp.filter1;
      else if (_filter1 == '')
        filterTmp.filter1 = '';


      if (_filter2 != '' && _filter2 != null)
        filterTmp.filter2 = _filter2;
      else if (_filter2 == null)
        filterTmp.filter2 = filterTmp.filter2;
      else if (_filter2 == '')
        filterTmp.filter2 = '';

      filterTmp.lookup1 = this._lookup1Value;
      filterTmp.lookup2 = this._lookup2Value;
      filterTmp.lookup3 = this._lookup3Value;

      this.localFilter.splice(_indexfc, 1, filterTmp);
    }
    else {

      if (_filter == null || _filter == '')
        _filter = '';

      if (_filter1 == null || _filter1 == '')
        _filter1 = '';

      if (_filter2 == null || _filter2 == '')
        _filter2 = '';

      this.localFilter.push({ key: this.zCommandKey, filter: _filter, filter1: _filter1, filter2: _filter2, lookup1: this._lookup1Value, lookup2: this._lookup2Value, lookup3: this._lookup3Value });
    }

    localStorage.removeItem(SystemConstants.FILTER_DATA);
    localStorage.setItem(SystemConstants.FILTER_DATA, JSON.stringify(this.localFilter));
  }

  getFilterFromCache(_key: string): string {
    let fc = this.localFilter.find(obj => obj['key'] == _key);

    return fc.filter + ' ' + fc.filter1 + ' ' + fc.filter2;
  }

  async init(navigateUrl: any[]) {

    this.addFilterCache(this.zCommandKey, this.zFilterKey, null, null);

    if (document.getElementById("titleName"))
      this.setTitle('Newtecons - ' + document.getElementById("titleName").innerText);

    this.isSysAdmin = localStorage.getItem(SystemConstants.CURRENT_ISSYSADMIN);
    this.data = new wjcCore.CollectionView();

    const sub = this._service.initialize(Global.DataExplorerEndpoint, this.zParentTableName, this.getFilterFromCache(this.zCommandKey))
      .subscribe(data => {
        try {
          this.getCountData();
        }
        catch (e) { };

        this.fetchData();

        if (this.zMenuTableName != '' && this.zMenuTableName != undefined)
          this.fetchDataMenu();

        if (this.zMenuTableNameLookup1 != '' && this.zMenuTableNameLookup1 != undefined)
          this.fetchDataLookup1();

        if (this.zMenuTableNameLookup2 != '' && this.zMenuTableNameLookup2 != undefined)
          this.fetchDataLookup2();

        if (this.zMenuTableNameLookup3 != '' && this.zMenuTableNameLookup3 != undefined)
          this.fetchDataLookup3();
      });

    this.subscription.add(sub);

    this.grid.autoGenerateColumns = false;
    this.grid.isReadOnly = true;
    this.grid.selectionMode = wjcGrid.SelectionMode.RowRange;
    this.createColumnGroups(this.grid, this._layoutDeclare.parentGrid, 0);

    if (this._layoutDeclare.layout.PrintDocument != undefined)
      this.listLayoutPrint = this._layoutDeclare.layout.PrintDocument.LayoutPrint;

    if (this.gridPrint) {
      this.gridPrint.autoGenerateColumns = false;
      this.gridPrint.isReadOnly = true;
      this.createColumnGroups(this.gridPrint, this._layoutDeclare.layout.PrintDocument.PrintGrid, 0);
      this.mergeColumnGroups(this.gridPrint);

      // this.grouAggregateGrid(this._layoutDeclare.layout.PrintDocument.GroupCols,this.dataPrint);
      // this.createAggregateGrid(this.gridPrint);

    }
    localStorage.removeItem(SystemConstants.ALLOW_DBLCLICK);
    localStorage.setItem(SystemConstants.ALLOW_DBLCLICK, 'true');

    this.doubleClickGrid(this.grid, navigateUrl);

    this.grid.allowDragging = wjcGrid.AllowDragging.Columns;

    let _countCol = this.grid.columns.length;
    for (let _nCol = 0; _nCol < _countCol; _nCol++) {
      let _col = this.grid.columns[_nCol];
      let _input = {
        key: _col.binding,
        label: _col.header,
        type: _col.dataType,
        isChecked: false
      }
      this.filterData.push(_input);
    }
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  fetchData() {
    this.showLoading = true;
    // this._filterKeyApply = this.zFilterKey;

    const sub = this._service.fetchData(Global.DataExplorerEndpoint, this.zParentTableName, this.getFilterFromCache(this.zCommandKey), 1, this.rowPage, this.fieldOrderBy)
      .subscribe(data => {
        this.grid.itemsSource = new wjcCore.CollectionView(data);
        this.grid.itemsSource.pageSize = this.rowPage;

        this.dataExlorer = <Array<Object>>(data);
        this.showLoading = false;
      });
    this.subscription.add(sub);

  }

  async getCountData() {
    // this._filterKeyApply = this.zFilterKey;

    let dataCount = await this._service.getCountData(Global.DataExplorerEndpoint, this.zParentTableName, this.getFilterFromCache(this.zCommandKey))
      .toPromise().then();

    this.totalPage = Math.floor(dataCount / this.rowPage) + 1;

  }

  async fetchDataMenu() {

    let _data = await this._service.fetchDataChild(Global.DataExplorerEndpoint, this.zMenuTableName, this.zMenuFilterKey)
      .toPromise().then();
    this.dataMenu = await <Array<Object>>(_data);
  }

  async fetchDataLookup1() {

    let _data = await this._service.fetchDataChild(Global.DataExplorerEndpoint, this.zMenuTableNameLookup1, this.zMenuFilterKeyLookup1)
      .toPromise().then();
    this.lookup1List = await <Array<Object>>(_data);
  }

  async fetchDataLookup2() {

    let _data = await this._service.fetchDataSelect(Global.DataExplorerEndpoint, this.zMenuTableNameLookup2, this.zMenuFilterKeyLookup2, 1, 1000, 'DocStatusKey')
      .toPromise().then();

    this.lookup2List = await <Array<Object>>(_data);
  }

  async fetchDataLookup3() {

    let _data = await this._service.fetchDataChild(Global.DataExplorerEndpoint, this.zMenuTableNameLookup3, this.zMenuFilterKeyLookup3)
      .toPromise().then();

    this.lookup3List = await <Array<Object>>(_data);
  }

  get lookup1(): string {
    return this._lookup1Value;
  }

  set lookup1(value: string) {
    if (this._lookup1Value != value) {
      this._lookup1Value = value;
      if (value != undefined)
        this.filterDataWithLookup();
    }
  }

  get lookup2(): string {
    return this._lookup2Value;
  }

  set lookup2(value: string) {
    if (this._lookup2Value != value) {
      this._lookup2Value = value;
      if (value != undefined)
        this.filterDataWithLookup();
    }
  }

  get lookup3(): string {
    return this._lookup3Value;
  }

  set lookup3(value: string) {
    if (this._lookup3Value != value) {
      this._lookup3Value = value;
      if (value != undefined)
        this.filterDataWithLookup();
    }
  }

  async filterDataWithLookup() {
    let __filterKey = '';
    if (this._lookup1Value != undefined && this.zMenuColumnFilterLookup1 != '' && this.zMenuColumnFilterLookup1 != undefined) {
      __filterKey = __filterKey + ' AND ' + this.zMenuColumnFilterLookup1 + "='" + this._lookup1Value + "'"
    }

    if (this._lookup2Value != undefined) {
      __filterKey = __filterKey + ' AND ' + this.zMenuColumnFilterLookup2 + "='" + this._lookup2Value + "'"
    }

    if (this._lookup3Value != undefined) {
      this.rowPage = Number.parseInt(this._lookup3Value);
    }

    this.addFilterCache(this.zCommandKey, this.zFilterKey, __filterKey, '');

    // this._filterKeyApply = __filterKey;

    const sub = await this._service.fetchData(Global.DataExplorerEndpoint, this.zParentTableName, this.getFilterFromCache(this.zCommandKey), 1, this.rowPage, this.fieldOrderBy)
      .subscribe(data => {
        this.grid.beginUpdate();
        // this.grid.itemsSource.sourceCollection = data;
        this.grid.itemsSource = new wjcCore.CollectionView(data);
        // this.grid.itemsSource.refresh();
        this.grid.endUpdate();
      });
    this.subscription.add(sub);

    await this._service.getCountData(Global.DataExplorerEndpoint, this.zParentTableName, this.getFilterFromCache(this.zCommandKey))
      .toPromise().then(dataCount => {
        this.totalPage = Math.floor(dataCount / this.rowPage) + 1;
      });

    // const sub = this._service.filterData(Global.DataExplorerEndpoint, this.zParentTableName, this.zFilterKey, params)
    //     .subscribe(data => {
    //       this.grid.itemsSource.sourceCollection = data;
    //       this.grid.itemsSource.refresh();
    //     });
    //   this.subscription.add(sub);

  }

  movePage(_numPage: number) {
    if (_numPage <= 1) {
      this.pageNumber = 1;
    }
    else {
      if (_numPage >= this.totalPage) {
        this.pageNumber = this.totalPage;
      }
      else {
        this.pageNumber = _numPage;
      }
    }

    const sub = this._service.fetchData(Global.DataExplorerEndpoint, this.zParentTableName, this.getFilterFromCache(this.zCommandKey), this.pageNumber, this.rowPage, this.fieldOrderBy)
      .subscribe(data => {
        this.grid.beginUpdate();
        this.grid.itemsSource = new wjcCore.CollectionView(data);
        this.grid.itemsSource.pageSize = this.rowPage;
        this.grid.endUpdate();

      });
    this.subscription.add(sub);

  }

  destroy() {
    if (this.inputs != null)
      this.inputs = null;

    if (this.filterData != null)
      this.filterData = null;

    if (this.grid.itemsSource != null)
      this.grid.itemsSource = null;
  }

  itemsSourceChangedHandler() {
    this._applyGroup();
  }

  toogleFilter() {

    this.isUsingFilter = !this.isUsingFilter;
    this.contentFilterHeight = this.contentFilter.nativeElement.offsetHeight;
    this.body.classList.add('sidebar-collapse');
    this.grid.refresh(false);

    if (this.grid) {

      let _nMinCol;
      let _nMaxCol;
      if (this.grid.columns[this.grid.selection.col].header == null && this.grid.columns[this.grid.selection.col].binding == null) {
        _nMinCol = 1; _nMaxCol = 1;
      }
      else {
        _nMinCol = Math.min(this.grid.selection.col, this.grid.selection.col2);
        _nMaxCol = Math.max(this.grid.selection.col, this.grid.selection.col2);
      }



      this.inputs = [];
      for (let _nCol = _nMinCol; _nCol <= _nMaxCol; _nCol++) {
        let _col = this.grid.columns[_nCol];

        this.pushControls({
          key: _col.binding,
          label: _col.header,
          required: false,
          dataType: _col.dataType
        });
      }

      this.filterData.forEach(item => item.isChecked = false);
      for (let n = 0; n < this.inputs.length; n++) {
        this.filterData.filter(item => item.key == this.inputs[n].key)
          .forEach(item => item.isChecked = true);
      }


      this.form = this.ics.toFormGroup(this.inputs);


    }

    if (!this.isUsingFilter) {
      this.addFilterCache(this.zCommandKey, this.zFilterKey, null, '').then(() => {
        this.fetchData();
      })
    }
  }

  tooglePin(e) {
    let data = e.data;
    let ev: HTMLElement = e.event.target.children[0];

    if (ev.classList.contains('fa-rotate-90')) {
      ev.classList.remove('fa-rotate-90');
    }
    else {
      ev.classList.add('fa-rotate-90');

      if (this.inputs.length > 1) {
        this.inputs = this.inputs.filter(item => item.key != data.key);

        this.filterData.forEach(item => item.isChecked = false);
        for (let n = 0; n < this.inputs.length; n++) {
          this.filterData.filter(x => x.key == this.inputs[n].key)
            .forEach(item => item.isChecked = true);
        }

        this.form.removeControl(data.key);
      }
    }
  }

  doubleClickGrid(grid: wjcGrid.FlexGrid, navigateUrl: any[]) {

    let host = grid.hostElement;
    let self = this;

    host.addEventListener('dblclick', function (e) {
      if (grid.selectedItems[0] != null && localStorage.getItem(SystemConstants.ALLOW_DBLCLICK) == 'true') {
        let key = grid.selectedItems[0]['Id'];
        if (key) {
          navigateUrl.push(key);

          // navigateUrl[0] = '#/main';
          // window.open(navigateUrl.join('/'));
          // navigateUrl.pop();

          self.router.navigate(navigateUrl);
        }
      }
    });
  }

  clickGridParentShowDetail(grid: wjcGrid.FlexGrid, gridChild: wjcGridDetail.FlexGridDetailProvider, row: any, option?: boolean) {

    let host = grid.hostElement;
    let self = this;
    let colName = this._layoutDeclare.layout.Structure.Child.ParentKey;
    let value = '';

    let key = grid.selectedItems[0][colName];
    localStorage.removeItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE);
    localStorage.setItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE, key);

    gridChild.showDetail(row, option);

    grid.selectedItems[0] = null;
  }

  clickGridParentHideDetail(gridChild: wjcGridDetail.FlexGridDetailProvider, row: any) {
    localStorage.setItem(SystemConstants.ALLOW_DBLCLICK, 'true');

    gridChild.hideDetail(row);
  }

  clickGridParent(grid: wjcGrid.FlexGrid) {
    let host = grid.hostElement;
    let self = this;
    let colName = this._layoutDeclare.layout.Structure.Child.ParentKey;
    let value = '';

    host.addEventListener('click', function (e) {
      if (grid.selectedItems[0] != undefined) {
        let key = grid.selectedItems[0][colName];
        if (key) {
          localStorage.removeItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE);
          localStorage.setItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE, key);
        }
      }
    });
  }

  editExplorer(grid: wjcGrid.FlexGrid, navigateUrl: any[], command?: string) {
    let host = grid.hostElement;
    let self = this;
    let key = grid.selectedItems[0]['Id'];

    if (key) {
      // navigateUrl.push(key);
      // navigateUrl[0] = '#/main';
      // window.open(navigateUrl.join('/'));
      // navigateUrl.pop();

      navigateUrl.push(key);
      self.router.navigate(navigateUrl);
    }
  }

  editEditorWithParams(grid: wjcGrid.FlexGrid, navigateUrl: any[]) {
    let host = grid.hostElement;
    let self = this;
    let key = grid.selectedItems[0]['Id'];
    let data: any = grid.selectedItems[0];
    if (key) {
      navigateUrl.push(key);
      let paramsEdit: any[];
      paramsEdit = this._layoutDeclare.defaultWhenEdit;

      for (let control in paramsEdit) {

        if (paramsEdit[control].toString().indexOf('{EXPR=') > -1) {
          if (data != null) {
            paramsEdit[control] = this.translate_Parameter_Explorer(paramsEdit[control], data);
            if (paramsEdit[control].toString().indexOf('?') > -1)
              paramsEdit[control] = eval(paramsEdit[control]);
          }
        }

        if (paramsEdit[control].toString().indexOf('{VAR=') > -1)
          paramsEdit[control] = Global.convertConfig(paramsEdit[control]);

        paramsEdit[control] = this.replaceString(paramsEdit[control], "'");
      }

      if (paramsEdit != undefined && paramsEdit != null) {
        let _value = encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(paramsEdit)));
        navigateUrl.push(_value);
      }
    }

    self.router.navigate(navigateUrl);

  }

  editorOpen(grid: wjcGrid.FlexGrid, navigateUrl: any[], command?: string) {
    let host = grid.hostElement;
    let self = this;
    let key = grid.selectedItems[0]['Id'];

    if (key) {
      navigateUrl.push(key);
      navigateUrl[0] = '#/main';
      window.open(navigateUrl.join('/'));
      navigateUrl.pop();

      // navigateUrl.push(key);
      // self.router.navigate(navigateUrl);
    }
  }

  editExplorerCard(navigateUrl: any[], id: string) {
    if (id) {
      navigateUrl.push(id);
      navigateUrl[0] = '#/main';
      window.open(navigateUrl.join('/'));
      navigateUrl.pop();
    }
    // navigateUrl.push(key);
    // self.router.navigate(navigateUrl);
  }

  openWindow(navigateUrl: any[]) {
    navigateUrl[0] = '#/main';
    window.open(navigateUrl.join('/'));
  }

  openEditorWithParams(navigateUrl: any[], data: any) {
    let self = this;

    //navigateUrl[0] = '#/main';
    navigateUrl.push('-1');

    let paramsEdit: any[];
    paramsEdit = this._layoutDeclare.menu.parameter;

    for (let control in paramsEdit) {

      if (paramsEdit[control].toString().indexOf('{EXPR=') > -1) {
        paramsEdit[control] = this.translate_Parameter_Explorer(paramsEdit[control], data);
        if (paramsEdit[control].toString().indexOf('?') > -1)
          paramsEdit[control] = eval(paramsEdit[control]);
      }

      if (paramsEdit[control].toString().indexOf('{VAR=') > -1)
        paramsEdit[control] = Global.convertConfig(paramsEdit[control]);

      paramsEdit[control] = this.replaceString(paramsEdit[control], "'");
    }

    if (paramsEdit != undefined && paramsEdit != null) {
      let _value = encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(paramsEdit)));
      navigateUrl.push(_value);
    }


    //window.open(navigateUrl.join('/'));
    self.router.navigate(navigateUrl);
  }

  newEditorWithDefault(navigateUrl: any[], data: any, lookup1?: any, lookup2?: any) {
    let self = this;

    //navigateUrl[0] = '#/main';
    navigateUrl.push('-1');

    let paramsEdit: any[];
    paramsEdit = this._layoutDeclare.defaultWhenNew;

    for (let control in paramsEdit) {

      if (paramsEdit[control].toString().indexOf('{EXPR=') > -1) {
        if (data != null) {
          paramsEdit[control] = this.translate_Parameter_Explorer(paramsEdit[control], data);
          if (paramsEdit[control].toString().indexOf('?') > -1)
            paramsEdit[control] = eval(paramsEdit[control]);
        }
      }

      if (paramsEdit[control].toString().indexOf('{VAR=') > -1)
        paramsEdit[control] = Global.convertConfig(paramsEdit[control]);

      if (paramsEdit[control].toString().indexOf('{FORM=_lookup1Value}') > -1) {
        if (lookup1 != null) {
          paramsEdit[control] = paramsEdit[control].replace('{FORM=_lookup1Value}', lookup1);
        }
      }

      if (paramsEdit[control].toString().indexOf('{FORM=_lookup2Value}') > -1) {
        if (lookup2 != null) {
          paramsEdit[control] = paramsEdit[control].replace('{FORM=_lookup2Value}', lookup2);
        }
      }

      paramsEdit[control] = this.replaceString(paramsEdit[control], "'");
    }

    if (paramsEdit != undefined && paramsEdit != null) {
      let _value = encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(paramsEdit)));
      navigateUrl.push(_value);
    }


    //window.open(navigateUrl.join('/'));
    self.router.navigate(navigateUrl);
  }


  openEditorWithParams_2(navigateUrl: any[], grid: wjcGrid.FlexGrid) {
    let self = this;
    //navigateUrl[0] = '#/main';
    //let key = grid.selectedItems[0]['Id'];

    navigateUrl.push('-1');

    let paramsEdit: any[];

    paramsEdit = this._layoutDeclare.layout.CopiedValues.parameter;

    for (let control in paramsEdit) {

      if (paramsEdit[control].toString().indexOf('{EXPR=') > -1) {
        paramsEdit[control] = this.translate_Parameter_Explorer(paramsEdit[control], grid.selectedItems[0]);
        if (paramsEdit[control].toString().indexOf('?') > -1)
          paramsEdit[control] = eval(paramsEdit[control]);
      }

      if (paramsEdit[control].toString().indexOf('{VAR=') > -1)
        paramsEdit[control] = Global.convertConfig(paramsEdit[control]);

      paramsEdit[control] = this.replaceString(paramsEdit[control], "'");
    }


    if (paramsEdit != undefined && paramsEdit != null) {
      let _value = encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(paramsEdit)));
      navigateUrl.push(_value);
    }

    //window.open(navigateUrl.join('/'));
    self.router.navigate(navigateUrl);
  }

  openEditorWithParams_NewTab(navigateUrl: any[], grid: wjcGrid.FlexGrid) {
    let self = this;
    //navigateUrl[0] = '#/main';
    //let key = grid.selectedItems[0]['Id'];

    navigateUrl.push('-1');

    let paramsEdit: any[];

    paramsEdit = this._layoutDeclare.layout.CopiedValues.parameter;

    for (let control in paramsEdit) {

      if (paramsEdit[control].toString().indexOf('{EXPR=') > -1) {
        paramsEdit[control] = this.translate_Parameter_Explorer(paramsEdit[control], grid.selectedItems[0]);
        if (paramsEdit[control].toString().indexOf('?') > -1)
          paramsEdit[control] = eval(paramsEdit[control]);
      }

      if (paramsEdit[control].toString().indexOf('{VAR=') > -1)
        paramsEdit[control] = Global.convertConfig(paramsEdit[control]);

      paramsEdit[control] = this.replaceString(paramsEdit[control], "'");
    }


    if (paramsEdit != undefined && paramsEdit != null) {
      let _value = encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(paramsEdit)));
      navigateUrl.push(_value);
    }

    navigateUrl[0] = '#/main';
    window.open(navigateUrl.join('/'));
    // self.router.navigate(navigateUrl);
  }

  copyEditor(grid: wjcGrid.FlexGrid, navigateUrl: any[]) {
    let host = grid.hostElement;
    let self = this;
    let key = grid.selectedItems[0]['Id'];

    if (key) {
      navigateUrl.push(key);
      navigateUrl[0] = '#/main';
      navigateUrl.push(encodeURIComponent(CryptoExtension.encrypt('copy')));
      window.open(navigateUrl.join('/'));
    }
  }

  copyAndSplitEditor(grid: wjcGrid.FlexGrid, navigateUrl: any[]) {
    let host = grid.hostElement;
    let self = this;
    let key = grid.selectedItems[0]['Id'];

    if (key) {
      navigateUrl.push(key);
      navigateUrl[0] = '#/main';
      navigateUrl.push(encodeURIComponent(CryptoExtension.encrypt('split')));
      window.open(navigateUrl.join('/'));
    }
  }

  submit(formData: FormGroup) {
    let params = new Array<ParameterContract>();
    let flagParam = false;

    for (let key in formData.value) {
      let param = new ParameterContract();
      let _value = formData.value[key];

      if (_value instanceof Date) {
        if (key.endsWith('_custom')) {
          param.ParameterOperator = "<=";
        }
        else {
          param.ParameterOperator = ">=";
        }
      }

      param.ParameterName = key;
      param.ParameterValue = _value;

      params.push(param);
    }

    let _sqlKey = Global.convertParamsToSqlStringFilter(params);

    this.addFilterCache(this.zCommandKey, this.zFilterKey, null, _sqlKey);

    // const sub = this._service.filterData(Global.DataExplorerEndpoint, this.zParentTableName, this.getFilterFromCache(this.zCommandKey), params)
    //   .subscribe(data => {
    //     this.grid.itemsSource.sourceCollection = data;
    //     this.grid.itemsSource.refresh();
    //   });
    // this.subscription.add(sub);

    const sub = this._service.fetchData(Global.DataExplorerEndpoint, this.zParentTableName, this.getFilterFromCache(this.zCommandKey), 1, this.rowPage, this.fieldOrderBy)
      .subscribe(data => {
        this.grid.beginUpdate();
        // this.grid.itemsSource.sourceCollection = data;
        this.grid.itemsSource = new wjcCore.CollectionView(data);
        // this.grid.itemsSource.refresh();
        this.grid.endUpdate();
      });
    this.subscription.add(sub);

    this._service.getCountData(Global.DataExplorerEndpoint, this.zParentTableName, this.getFilterFromCache(this.zCommandKey))
      .toPromise().then(dataCount => {
        this.totalPage = Math.floor(dataCount / this.rowPage) + 1;
      });

  }

  pushControls(control: {
    key?: string,
    label?: string,
    required?: boolean,
    dataType?: number
  }) {
    switch (control.dataType) {
      case 4: {
        this.inputs.push(new DateBoxInput({
          key: control.key,
          label: control.label + ' >=',
          required: control.required
        }));

        this.inputs.push(new DateBoxInput({
          key: control.key + '_custom',
          label: control.label + ' <=',
          required: control.required
        }));

        break;
      }
      case 3: {
        this.inputs.push(new CheckBoxInput({
          key: control.key,
          label: control.label,
          required: control.required
        }));

        break;
      }
      default: {
        this.inputs.push(new TextBoxInput({
          key: control.key,
          label: control.label,
          required: control.required,
          type: 'text'
        }));

        break;
      }
    }
  }

  updateCheckedOptions(e, t) {
    if (e.target.checked && this.inputs.filter(x => x.key != t.key).length > 0) {
      this.pushControls({
        key: t.key,
        label: t.label,
        required: t.required,
        dataType: t.type
      });

      if (t.type == 4) {
        this.form.addControl(t.key, this.ics.toFormGroup(this.inputs).get(t.key));

        let keyCustom = t.key + '_custom';
        this.form.addControl(keyCustom, this.ics.toFormGroup(this.inputs).get(keyCustom));
      }
      else {
        this.form.addControl(t.key, this.ics.toFormGroup(this.inputs).get(t.key));
      }
    }
    else {
      if (this.inputs.length > 1)
        this.inputs = this.inputs.filter(item => item.key != t.key);
    }
  }

  _applyGroup() {
    if (this.grid.collectionView) {
      var cv = this.grid.collectionView;
      if (cv != null) {
        cv.beginUpdate();
        cv.groupDescriptions.clear();

        var groupDesc = new wjcCore.PropertyGroupDescription('ProductName');
        cv.groupDescriptions.push(groupDesc);
        this.grid.groupHeaderFormat = '<b>{value}</b> ({count:n0} mục) ';
        cv.endUpdate();
      }
      this.grid.collapseGroupsToLevel(0);
    }
  }

  createColumnGroups(flex: wjcGrid.FlexGrid, columnGroups: any, level: number) {
    // prepare to generate columns
    var colHdrs = flex.columnHeaders;


    // add an extra header row if necessary
    if (level >= colHdrs.rows.length) {
      colHdrs.rows.splice(colHdrs.rows.length, 0, new wjcGrid.Row());
    }

    // loop through the groups adding columns or groups
    for (var i = 0; i < columnGroups.length; i++) {
      var group = columnGroups[i];
      if (!group.columns) {

        // create a single column
        var col = new wjcGrid.Column();

        // copy properties from group
        for (var prop in group) {
          if (prop in col) {
            col[prop] = group[prop];
          }
        }

        // add the new column to the grid, set the header
        flex.columns.push(col);
        colHdrs.setCellData(level, colHdrs.columns.length - 1, group.header);
      }
      else {

        // get starting column index for this group
        var colIndex = colHdrs.columns.length;

        // create columns for this group
        this.createColumnGroups(flex, group.columns, level + 1);

        // set headers for this group
        for (var j = colIndex; j < colHdrs.columns.length; j++) {
          colHdrs.setCellData(level, j, group.header);
        }
      }
    }
  }

  mergeColumnGroups(flex: wjcGrid.FlexGrid) {

    // merge headers
    var colHdrs = flex.columnHeaders;
    flex.allowMerging = wjcGrid.AllowMerging.AllHeaders;

    // merge horizontally
    for (var r = 0; r < colHdrs.rows.length; r++) {
      colHdrs.rows[r].allowMerging = true;
    }

    // merge vertically
    for (var c = 0; c < colHdrs.columns.length; c++) {
      colHdrs.columns[c].allowMerging = true;
    }


    // fill empty cells with content from cell above
    //for (var c = 0; c < colHdrs.columns.length; c++) {
    //    for (var r = 1; r < colHdrs.rows.length; r++) {
    //        var hdr = colHdrs.getCellData(r, c, false);
    //        if (!hdr || hdr == colHdrs.columns[c].binding) {
    //            var hdr = colHdrs.getCellData(r - 1, c, false);
    //            colHdrs.setCellData(r, c, hdr);
    //        }
    //    }
    //}


    // handle top-left panel
    //for (var c = 0; c < flex.topLeftCells.columns.length; c++) {
    //    flex.topLeftCells.columns[c].allowMerging = true;
    //}
  }

  // Đình chỉ
  convertParameterName(pzName: string) {
    const DbParamPrefixOld = '@_';
    const DbParamPrefix = '@';

    return pzName.startsWith(DbParamPrefixOld) || pzName.startsWith(DbParamPrefix) ?
      pzName : DbParamPrefixOld + pzName;
  }


  // deleteExplorer(grid: wjcGrid.FlexGrid) {

  //   let host = grid.hostElement;
  //   let self = this;


  //   const params = new Array<ParameterContract>();
  //   const param = new ParameterContract();
  //   const param1 = new ParameterContract();
  //   const param2 = new ParameterContract();

  //   param.ParameterName = this.convertParameterName('TableName');
  //   param.ParameterValue = this._layoutDeclare.layout.Structure.Parent['Name'];
  //   params.push(param);

  //   param1.ParameterName = this.convertParameterName('Id');
  //   param1.ParameterValue = grid.selectedItems[0]['Id'];
  //   params.push(param1);

  //   param2.ParameterName = this.convertParameterName('Value');
  //   param2.ParameterValue = 0;
  //   params.push(param2);

  //   this._service.getData(Global.DataEditorEndpoint, BravoCtorEnum.StoreProcedure, 'usp_Web_UpdateIsActive', params)
  //     .toPromise();

  //   this.deleteSelectedRows(this.grid);

  // }




  confirmDialog(grid: wjcGrid.FlexGrid, columnName: string) {
    if (grid.selectedItems[0]['ApproveSend'] == true && this.isSysAdmin == 'false') {
      alert('Hồ sơ đã gửi duyệt, không thể xóa');
      return;
    }
    else {
      if (grid.selectedItems[0][columnName] != undefined) {
        this.showDialog = true;
        this.titleConfirmDialog = grid.selectedItems[0][columnName];
      }
    }
  }

  approveExplorer(grid: wjcGrid.FlexGrid, option: boolean) {

    if (option) {
      let host = grid.hostElement;
      let self = this;

      const params = new Array<ParameterContract>();
      const param = new ParameterContract();
      const param1 = new ParameterContract();
      const param2 = new ParameterContract();
      const param3 = new ParameterContract();

      param.ParameterName = this.convertParameterName('TableName');
      param.ParameterValue = this._layoutDeclare.layout.Structure.Parent['Name'];
      params.push(param);

      param1.ParameterName = this.convertParameterName('Id');
      param1.ParameterValue = grid.selectedItems[0]['Id'];
      params.push(param1);

      param2.ParameterName = this.convertParameterName('Value');
      param2.ParameterValue = 0;
      params.push(param2);

      param3.ParameterName = this.convertParameterName('nUserId');
      param3.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID);
      params.push(param3);

      this._service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Web_UpdateInvestorConfirm', params)
        .toPromise();

      location.reload()
      //this.deleteSelectedRows(this.grid);
      
      // if (grid) {
      //   // get list of selected items
      //   var selected = [];

      //   let _idrowdel = grid.selectedRows[0]._idx;

      //   selected.push(grid.rows[_idrowdel].dataItem);


      //   // delete the selected items
      //   for (var i = 0; i < selected.length; i++) {
      //     //deleteRowFromDatabase(selected[i]);
      //     grid.itemsSource.remove(selected[i]);
      //   }
      // }

      this.showDialog = false;
    }
    else {
      this.showDialog = false;
    }
  }

  deleteExplorer(grid: wjcGrid.FlexGrid, option: boolean) {

    if (option) {
      let host = grid.hostElement;
      let self = this;

      const params = new Array<ParameterContract>();
      const param = new ParameterContract();
      const param1 = new ParameterContract();
      const param2 = new ParameterContract();
      const param3 = new ParameterContract();

      param.ParameterName = this.convertParameterName('TableName');
      param.ParameterValue = this._layoutDeclare.layout.Structure.Parent['Name'];
      params.push(param);

      param1.ParameterName = this.convertParameterName('Id');
      param1.ParameterValue = grid.selectedItems[0]['Id'];
      params.push(param1);

      param2.ParameterName = this.convertParameterName('Value');
      param2.ParameterValue = 0;
      params.push(param2);

      param3.ParameterName = this.convertParameterName('nUserId');
      param3.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID);
      params.push(param3);

      this._service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Web_UpdateIsActive', params)
        .toPromise();

      //this.deleteSelectedRows(this.grid);

      if (grid) {
        // get list of selected items
        var selected = [];

        let _idrowdel = grid.selectedRows[0]._idx;

        selected.push(grid.rows[_idrowdel].dataItem);


        // delete the selected items
        for (var i = 0; i < selected.length; i++) {
          //deleteRowFromDatabase(selected[i]);
          grid.itemsSource.remove(selected[i]);
        }
      }

      this.showDialog = false;
    }
    else {
      this.showDialog = false;
    }
  }


  deleteSelectedRows(flex: wjcGrid.FlexGrid) {
    if (flex) {
      // get list of selected items
      var selected = [];

      //let _idrowdel = flex.selectedRows[0]._idx;

      for (let k in flex.selectedRows) {
        let _idrowdel = flex.selectedRows[k]._idx;
        for (var i = 0; i < flex.rows.length; i++) {
          if (i == _idrowdel) {
            selected.push(flex.rows[i].dataItem);
            break;
          }
        }
      }

      // delete the selected items
      for (var i = 0; i < selected.length; i++) {
        //deleteRowFromDatabase(selected[i]);
        flex.itemsSource.remove(selected[i]);
      }
    }
  }

  export() {
    wjcGridXlsx.FlexGridXlsxConverter.save(this.grid,
      {
        includeColumnHeaders: true,
        includeCellStyles: false,
        formatItem: false ? this._exportFormatItem : null
      },
      'DataExport.xlsx');
  }

  _exportFormatItem(args: wjcGridXlsx.XlsxFormatItemEventArgs) {
    var p = args.panel,
      row = args.row,
      col = args.col,
      xlsxCell = args.xlsxCell,
      cell: HTMLElement,
      color: string;

    if (p.cellType === wjcGrid.CellType.Cell) {
      if (p.columns[col].binding === 'color') {
        //color = p.rows[row].dataItem['color'];
        if (xlsxCell.value) {
          if (!xlsxCell.style.font) {
            xlsxCell.style.font = {};
          }
          xlsxCell.style.font.color = (<string>xlsxCell.value).toLowerCase();
        }
      } else if (p.columns[col].binding === 'active' && p.rows[row] instanceof wjcGrid.GroupRow) {
        cell = args.getFormattedCell();
        xlsxCell.value = cell.textContent.trim();
        xlsxCell.style.hAlign = wjcXlsx.HAlign.Left;
      }
    }
  }

  async exportHtml(flex: wjcGrid.FlexGrid, name: string, fileName: string, folderPath: string) {

    if (name.includes('WorkFlow')) {
      // if (flex.selectedItems[0]['CompletedApprove'] == false) {
      //   alert('Hồ sơ chưa hoàn thiện duyệt, không thể in ấn workflow');
      //   return;
      // }
      // else {
      this.exportHtml_WorkFlow(flex, name, fileName, folderPath);
      return;
      // }
    }

    if (name == '5.Bang_KLTT_NTP_NCC_0.docx') {
      this.exportHtml_BillSupp(flex, name, fileName, folderPath);
      return;
    }

    this.showLoading = true;

    let _command = this._layoutDeclare.layout.PrintDocument.Command;

    let _docstatus = flex.selectedItems[0]['DocStatus'];
    let _doccode = flex.selectedItems[0]['DocCode'];
    if (_docstatus == '4' && _doccode == 'PP')
      name = name.replace('.docx', '_Approved.docx');

    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = flex.selectedItems[0]['Id'];
    params.push(param1);

    let ctor1 = CryptoExtension.encrypt(_command);
    const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

    let body = {
      "storeName": ctor1,
      "params": ctor2
    }

    this._service.exportHtml(folderPath + name, body).subscribe(data => {

      let _title = fileName;

      if (_title == '' || _title == null || _title == undefined) {
        _title = this._layoutDeclare.layout.PrintDocument.Text;
      }

      let _html = `<html><head>
        <title>`+ Global.translateAutoText(_title, flex.selectedRows[0].dataItem) + `</title>
        </head>`;
      _html += '<body onload="window.print();window.close()">';

      _html += Global.translateImageOutput(data['html'], data['output']);

      if (_html.toString().indexOf('_______________________') > -1) {
        _html = _html.replace(/_______________________/gi, data['output']['@_Comment']);
      }

      if (_html.toString().indexOf('______________________') > -1) {
        _html = _html.replace(/______________________/gi, data['output']['@_Description']);
      }

      if (_html.toString().indexOf('____________________') > -1) {
        _html = _html.replace(/____________________/gi, '<img src="' + this.urlImg + data['output']['@_ChuKyLCVien'] + '" alt="image not available" style="width: 100px;height: 100px;"/>');
      }

      if (_html.toString().indexOf('___________________') > -1) {
        _html = _html.replace(/___________________/gi, '<img src="' + this.urlImg + data['output']['@_ChuKyTeo'] + '" alt="image not available" style="width: 100px;height: 100px;"/>');
      }

  

  
      _html += '</body></html>'

      this.showLoading = false;

      let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

      popupWin.document.write(_html);

      popupWin.document.close();
    });

  }

  async exportWord(flex: wjcGrid.FlexGrid, name: string, fileName: string, folderPath: string) {

    if (name.includes('WorkFlow')) {
      // if (flex.selectedItems[0]['CompletedApprove'] == false) {
      //   alert('Hồ sơ chưa hoàn thiện duyệt, không thể in ấn workflow');
      //   return;
      // }
      // else {
      this.exportWord_WorkFlow(flex, name, fileName, folderPath);
      return;
      // }
    }

    if (name == '5.Bang_KLTT_NTP_NCC_0.docx') {
      this.exportWord_BillSupp(flex, name, fileName, folderPath);
      return;
    }

    this.showLoading = true;

    let _command = this._layoutDeclare.layout.PrintDocument.Command;

    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = flex.selectedItems[0]['Id'];
    params.push(param1);

    let ctor1 = CryptoExtension.encrypt(_command);
    const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

    let body = {
      "storeName": ctor1,
      "params": ctor2
    }

    fileName = Global.translateAutoText(fileName, flex.selectedRows[0].dataItem);
    this._service.exportWord(folderPath, name, body).subscribe(blob => {
      let extension = name.endsWith(".docx") ? ".docx" : ".doc";
      importedSaveAs(blob, fileName + extension);
      this.showLoading = false;
    });
  }

  async exportExcel(flex: wjcGrid.FlexGrid, name: string, fileName: string, folderPath: string) {
    this.showLoading = true;

    let _command = this._layoutDeclare.layout.PrintDocument.Command;

    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = flex.selectedItems[0]['Id'];
    params.push(param1);

    let ctor1 = CryptoExtension.encrypt(_command);
    const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

    let body = {
      "storeName": ctor1,
      "params": ctor2
    }

    fileName = Global.translateAutoText(fileName, flex.selectedRows[0].dataItem);
    this._service.exportExcel(folderPath, name, body).subscribe(blob => {
      let extension = name.endsWith(".xlsx") ? ".xlsx" : ".xls";
      importedSaveAs(blob, fileName + extension);
      this.showLoading = false;
    });
  }

  async exportHtml_WorkFlow(flex: wjcGrid.FlexGrid, name: string, fileName: string, folderPath: string) {
    this.showLoading = true;

    let _command = this._layoutDeclare.layout.PrintDocument.Command_WorkFlow;

    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = flex.selectedItems[0]['Id'];
    params.push(param1);

    param2.ParameterName = this.convertParameterName('DocCode');
    param2.ParameterValue = flex.selectedItems[0]['DocCode'];
    params.push(param2);


    let ctor1 = CryptoExtension.encrypt(_command);
    const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

    let body = {
      "storeName": ctor1,
      "params": ctor2
    }

    this._service.exportHtml(folderPath + name, body).subscribe(data => {

      this.outputPrint = <Array<Object>>(data['output']);

      let _title = fileName;

      if (_title == '' || _title == null || _title == undefined) {
        _title = this._layoutDeclare.layout.PrintDocument.Text;
      }

      let _html = `<html>
                    <head>
                    <title>`+ Global.translateAutoText(_title, flex.selectedRows[0].dataItem) + `</title>
                        </head>`;
      _html += '<body onload="window.print();window.close()">';

      _html += Global.translateImageOutput(data['html'], data['output']);

      if (_html.toString().indexOf('______________________________') > -1) {
        _html = _html.replace(/______________________________/gi, this.outputPrint['@_Comment']);
      }

      _html += '</body></html>'

      this.showLoading = false;

      let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

      popupWin.document.write(_html);

      popupWin.document.close();
    });
  }

  async exportHtml_BillSupp(flex: wjcGrid.FlexGrid, name: string, fileName: string, folderPath: string) {
    this.showLoading = true;

    let _command = this._layoutDeclare.layout.PrintDocument.Command_BillSupp;

    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = flex.selectedItems[0]['Id'];
    params.push(param1);

    param2.ParameterName = this.convertParameterName('DocCode');
    param2.ParameterValue = flex.selectedItems[0]['DocCode'];
    params.push(param2);


    let ctor1 = CryptoExtension.encrypt(_command);
    const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

    let body = {
      "storeName": ctor1,
      "params": ctor2
    }

    this._service.exportHtml(folderPath + name, body).subscribe(data => {

      this.outputPrint = <Array<Object>>(data['output']);

      let _title = fileName;

      if (_title == '' || _title == null || _title == undefined) {
        _title = this._layoutDeclare.layout.PrintDocument.Text;
      }

      let _html = `<html>
                    <head>
                    <title>`+ Global.translateAutoText(_title, flex.selectedRows[0].dataItem) + `</title>
                        </head>`;
      _html += '<body onload="window.print();window.close()">';

      _html += Global.translateImageOutput(data['html'], data['output']);

      if (_html.toString().indexOf('______________________________') > -1) {
        _html = _html.replace(/______________________________/gi, this.outputPrint['@_Comment']);
      }

      _html += '</body></html>'

      this.showLoading = false;

      let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

      popupWin.document.write(_html);

      popupWin.document.close();
    });
  }

  async exportWord_WorkFlow(flex: wjcGrid.FlexGrid, name: string, fileName: string, folderPath: string) {
    this.showLoading = true;

    let _command = this._layoutDeclare.layout.PrintDocument.Command_WorkFlow;

    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = flex.selectedItems[0]['Id'];
    params.push(param1);

    param2.ParameterName = this.convertParameterName('DocCode');
    param2.ParameterValue = flex.selectedItems[0]['DocCode'];
    params.push(param2);

    let ctor1 = CryptoExtension.encrypt(_command);
    const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

    let body = {
      "storeName": ctor1,
      "params": ctor2
    }

    fileName = Global.translateAutoText(fileName, flex.selectedRows[0].dataItem);
    this._service.exportWord(folderPath, name, body).subscribe(blob => {
      let extension = name.endsWith(".docx") ? ".docx" : ".doc";
      importedSaveAs(blob, fileName + extension);
      this.showLoading = false;
    });
  }

  async exportWord_BillSupp(flex: wjcGrid.FlexGrid, name: string, fileName: string, folderPath: string) {
    this.showLoading = true;

    let _command = this._layoutDeclare.layout.PrintDocument.Command_BillSupp;

    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = flex.selectedItems[0]['Id'];
    params.push(param1);

    param2.ParameterName = this.convertParameterName('DocCode');
    param2.ParameterValue = flex.selectedItems[0]['DocCode'];
    params.push(param2);

    let ctor1 = CryptoExtension.encrypt(_command);
    const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

    let body = {
      "storeName": ctor1,
      "params": ctor2
    }

    fileName = Global.translateAutoText(fileName, flex.selectedRows[0].dataItem);
    this._service.exportWord(folderPath, name, body).subscribe(blob => {
      let extension = name.endsWith(".docx") ? ".docx" : ".doc";
      importedSaveAs(blob, fileName + extension);
      this.showLoading = false;
    });
  }

  //08/03/2018: In chứng từ
  async printVoucher(flex: wjcGrid.FlexGrid, layoutName: string = 'MAU1') {
    let _command = this._layoutDeclare.layout.PrintDocument.Command;

    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = flex.selectedItems[0]['Id'];
    params.push(param1);

    let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, _command, params)
      .toPromise().then();

    let _htmlDetail = ''
    if (this.gridPrint) {
      this.dataPrint = new wjcCore.CollectionView(_data['data']);
      this.gridPrint.itemsSource = new wjcCore.CollectionView(_data['data']);
      _htmlDetail = this.renderTable(this.gridPrint);
    }
    this.outputPrint = <Array<Object>>(_data['output']);

    let _title;
    for (let lo of this._layoutDeclare.layout.PrintDocument.LayoutPrint) {
      if (lo['Layout'] == layoutName) {
        _title = lo['FileName'];
      }

    }

    if (_title == '' || _title == null || _title == undefined) {
      _title = this._layoutDeclare.layout.PrintDocument.Text;
    }

    let _html = `<html>
    <head>
      <title>`+ this.translate_output(_title, this.outputPrint) + `</title>
     </head>`;
    _html += '<body onload="window.print();window.close()">';


    _html += this.translate_output(this._layoutPrinter[0][layoutName], this.outputPrint);

    if (_html.toString().indexOf('{VAR=BravoDetail}') > -1) {
      _html = _html.replace(/{VAR=BravoDetail}/gi, _htmlDetail);
    }

    if (_html.toString().indexOf('___________________') > -1) {
      _html = _html.replace(/___________________/gi, this.outputPrint['@_ChuKyTeo']);
    }

    if (_html.toString().indexOf('____________________') > -1) {
      _html = _html.replace(/____________________/gi, this.outputPrint['@_ChuKyLCVien']);
    }

    _html += '</body></html>'
    return _html;
  }

  translate_output(expr, row: any) {
    // let _result:string = expr;

    // let controls: string[] = [];

    // for (const control in row) {
    //   if (control.startsWith('@_', 0))
    //     controls.push(control.substring(2, control.length));
    // }
    // controls.sort((a, b) => b.length - a.length);
    // console.log(_result);
    // for (const control of controls) {
    //   // let patern = '{VAR=' + control + '}';
    //   let pa = new RegExp('[{]VAR='+control+'(:[0-9a-zA-z]{2})?[}]','gmi');
    //   console.log(pa);
    //   let value = row['@_' + control];
    // console.log(value);

    //   _result.replace(pa,value);
    // console.log(_result);

    // if (_result.indexOf(patern) > -1) {
    //   let value = row['@_' + control];

    //   if (value instanceof Date) {
    //     if (value != null)
    //       value = value.toLocaleDateString();
    //   }


    //   if (wjcCore.isNumber(value)) {
    //     if (value != null && value != '0') {
    //       value = Global.formatFactory(value);
    //     }
    //   }

    //   do {
    //     _result = _result.replace(patern, value);
    //   }
    //   while (_result.indexOf(patern) > -1)
    // }
    // }
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
            value = this.transform(value);
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

  replaceString(expr: any, symbol: string) {
    let result = '';
    for (let i = 0; i < expr.length; i++) {
      if (expr[i] == symbol)
        continue;
      result += expr[i]
    }

    return result;
  }

  translate_Parameter_Explorer(expr, row: any) {


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

  transform(value: number | string, fractionSize: number = 0): string {
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

  //Xử lý in detail
  renderTable(flex: wjcGrid.FlexGrid) {

    // start table
    var tbl = '<table style="border-spacing: 0px; border-top: solid 1px black;border-left: solid 1px black;font-size:' + flex.hostElement.style.fontSize + '">';

    // headers
    if (flex.headersVisibility & wjcGrid.HeadersVisibility.Column) {
      tbl += '<thead>';
      for (var r = 0; r < flex.columnHeaders.rows.length; r++) {
        tbl += this.renderRow(flex.columnHeaders, r);
      }
      tbl += '</thead>';
    }

    // body
    tbl += '<tbody>';
    for (var r = 0; r < flex.rows.length; r++) {
      tbl += this.renderRow(flex.cells, r);
    }
    tbl += '</tbody>';

    // done
    tbl += '</table>';
    return tbl;
  }

  renderRow(panel: wjcGrid.GridPanel, r: number) {

    let cs
    var tr = '',
      row = panel.rows[r],
      nextCol = -1;
    if (row.renderSize > 0) {

      // start row/group row
      tr += row instanceof wjcGrid.GroupRow
        ? '<tr style="font-weight:bold;height:2em;border-top:2px solid grey">'
        : '<tr>';

      // render each column
      for (var c = 0; c < panel.columns.length; c++) {
        var col = panel.columns[c];

        if (col.renderSize > 0 && c >= nextCol) {
          var colSpan = '', mergedRange = null;
          var rowSpan = '';

          // get cell content
          var content = panel.getCellData(r, c, true),
            data = panel.getCellData(r, c, false),
            isHtml = row.isContentHtml || col.isContentHtml


          if (!isHtml && wjcCore.isString(data)) {
            content = wjcCore.escapeHtml(content);
          }
          if (wjcCore.isBoolean(data)) {
            content = data ? '&#9745;' : '&#9744;';
          }
          if (wjcCore.isNumber(data)) {
            let fractionSize = 0
            if (col['format'] != undefined)
              fractionSize = Number(col['format'].substr(1, 1));

            //Khoa đổi 25/04
            if (col['format'] != undefined) {
              if (col['format'].substr(0, 1) == 'n' || col['format'].substr(0, 1) == 'p')
                fractionSize = Number(col['format'].substr(1, 1));

              if (col['format'].substr(0, 1) == 'p') {
                let cvt = data * 100;
                content = cvt.toFixed(0) + " %";
              }
              else {
                content = this.transform(data, fractionSize);
              }
            }
            else
              content = this.transform(data, fractionSize);
          }
          if (row instanceof wjcGrid.GroupRow && c == panel.columns.firstVisibleIndex) {
            content = row.getGroupHeader();
          }

          // handle merged cells
          mergedRange = panel.grid.getMergedRange(panel, r, c, false);
          if (mergedRange && mergedRange.columnSpan > 1) {
            colSpan = ' colspan="' + mergedRange.columnSpan + '"';
            nextCol = c + mergedRange.columnSpan;
          }
          if (mergedRange && mergedRange.rowSpan > 1) {
            rowSpan = ' rowspan="' + mergedRange.rowSpan + '"';
          }


          // get cell style
          var style = 'width:' + (mergedRange ? mergedRange.getRenderSize(panel).width : col.renderSize) + 'px;';
          var styleTH = 'width:' + (mergedRange ? mergedRange.getRenderSize(panel).width : col.renderSize) + 'px;';


          if (col.getAlignment()) {
            style += 'text-align:' + col.getAlignment() + ';';
          }

          styleTH += 'text-align:center;valign:center;background-color:#f8f1e6;';

          // add cell to row
          if (panel.cellType == wjcGrid.CellType.ColumnHeader) {

            if (r == 0)
              tr += '<th style="border-right: solid 1px black;border-bottom: solid 1px black;' + styleTH + '"' + colSpan + rowSpan + '>' + content + '</th>';

            else if (rowSpan == '' && r > 0)
              tr += '<th style="border-right: solid 1px black;border-bottom: solid 1px black;' + styleTH + '"' + colSpan + '>' + content + '</th>';
          } else {

            if (panel.rows[r].dataItem['IsTitleRow'] == true) {
              style += 'font-weight:bold;color:blue;background-color:#f8f1e6;'
              tr += '<td style="border-right: solid 1px black;border-bottom: solid 1px black;' + style + '"' + colSpan + '>' + content + '</td>';
            }
            else {
              tr += '<td style="border-right: solid 1px black;border-bottom: solid 1px black;' + style + '"' + colSpan + '>' + content + '</td>';
            }
          }
        }
      }


      // close row
      tr += '</tr>';
    }
    return tr;
  }

  // getPermission(commandKey: string, option: string) {
  //   return Global.getPermission(commandKey, option);
  // }

  setPermission(data: any, data2: any) {
    this.isPermisionExAll_isAddNew = Global.getPermissionAll(data, data2, this.zCommandKey, 'IsAddNew');
    this.isPermisionExAll_isEdit = Global.getPermissionAll(data, data2, this.zCommandKey, 'IsEdit');
    this.isPermisionExAll_isDelete = Global.getPermissionAll(data, data2, this.zCommandKey, 'IsDelete');
    this.isPermisionExAll_isRecall = Global.getPermissionAll(data, data2, this.zCommandKey, 'IsRecall');
    this.isPermisionExAll_isPrint = Global.getPermissionAll(data, data2, this.zCommandKey, 'IsPrint');
    this.isPermisionExAll_isExport = Global.getPermissionAll(data, data2, this.zCommandKey, 'IsExport');
  }

  createAggregateGrid(grid: wjcGrid.FlexGrid) {

    var row = new wjcGrid.GroupRow();
    grid.columnFooters.rows.clear();
    grid.columnFooters.rows.push(row);
    grid.bottomLeftCells.setCellData(0, 0, '\u03A3');

    grid.columnFooters.setCellData(0, 0, 'Tổng cộng');

    let _t = new wjcCore.GroupDescription();
    row.dataItem = new wjcCore.CollectionViewGroup(_t, '', 0, true);
  }

  grouAggregateGrid(groupBy: string, data: wjcCore.CollectionView) {
    data.groupDescriptions.clear();
    var groups = groupBy ? groupBy.split(',') : [];
    for (var i = 0; i < groups.length; i++) {
      data.groupDescriptions.push(new wjcCore.PropertyGroupDescription(groups[i]));
    }
  }


  @ViewChild('frmEmailPopup') frmEmailPopup: Popup
  @ViewChild('inputEmail') inputEmail: string;
  //@ViewChild('inputPassword') inputPassword: string;
  @ViewChild('inputTo') inputTo: string;
  @ViewChild('inputCC') inputCC: string;
  // @ViewChild('inputBCC') inputBCC: string;
  @ViewChild('inputSubject') inputSubject: string;
  @ViewChild('inputplainTextMessage') inputplainTextMessage: string;

  MailInfo = {
    from: '',
    nameSend: '',
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    plainTextMessage: '',
    mailToken: '',
    htmlMessage: null,
    files: [],
    smtpOptions: { server: '', user: '', password: '', port: 25, useSsl: true, requiresAuthentication: true },
    //replacement: null,
    exportOption: null,
    toConfirm: '',
    mailType: ''
  }

  MailConfirm = {
    from: '',
    nameSend: '',
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    plainTextMessage: '',
    mailToken: '',
    htmlMessage: null,
    files: [],
    smtpOptions: { server: '', user: '', password: '', port: 25, useSsl: true, requiresAuthentication: true },
    //replacement: null,
    exportOption: null,
    mailType: ''
  }

  async getInfoTemplateMail(data: any, id?: number, approveGroup?: string, func?: Promise<void>) {
    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();
    const param4 = new ParameterContract();
    const param5 = new ParameterContract();
    const param6 = new ParameterContract();
    const param7 = new ParameterContract();


    let commandStore: string;
    let templatePath: string;
    let filePath: string;

    if (approveGroup != undefined) {
      param1.ParameterName = Global.convertParameterName('CommandKey');
      param1.ParameterValue = this.zCommandKey + approveGroup;
      params.push(param1);
    }
    else {
      param1.ParameterName = Global.convertParameterName('CommandKey');
      param1.ParameterValue = this.zCommandKey;
      params.push(param1);
    }

    param2.ParameterName = Global.convertParameterName('BranchCode');
    param2.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
    params.push(param2);

    param3.ParameterName = Global.convertParameterName('ProductCostId');
    param3.ParameterValue = data['ProductCostId'];
    params.push(param3);

    param4.ParameterName = Global.convertParameterName('nUserId');
    param4.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID);
    params.push(param4);

    if (data['ItemGroupCode']) {
      param5.ParameterName = Global.convertParameterName('ItemGroupCode');
      param5.ParameterValue = data['ItemGroupCode'];
      params.push(param5);
    }

    param6.ParameterName = Global.convertParameterName('DocCode');
    param6.ParameterValue = data['DocCode'];
    params.push(param6);

    param7.ParameterName = Global.convertParameterName('Id');
    param7.ParameterValue = id;
    params.push(param7);

    let isAttachFiles = false;
    let isConfirmMail = false;
    let isAdjust = false;

    await this._service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_TMCtc_GetInfoTemplateSendMail', params).toPromise().then(_data => {
      if (_data[0] != undefined) {
        isAttachFiles = _data[0]['IsAttachFile'];
        isConfirmMail = _data[0]['IsConfirm'];
        isAdjust = _data[0]['IsAdjust'];


        commandStore = _data[0]['Command'];
        templatePath = _data[0]['TemplatePath'];
        filePath = _data[0]['FilePath'];

        this.MailInfo.from = _data[0]['EmailAddress'];
        this.MailInfo.cc = _data[0]['EmailCc'];
        this.MailInfo.bcc = _data[0]['Bcc'];
        this.MailInfo.nameSend = _data[0]['UserName'];
        this.MailInfo.to = _data[0]['EmailTo'];
        this.MailInfo.subject = _data[0]['Subject'];
        this.MailInfo.mailType = _data[0]['MailType'];
        //mail nhận confirm
        this.MailInfo.toConfirm = _data[0]['EmailConfirm'];


        this.MailInfo.smtpOptions.server = _data[0]['EmailServerName'];
        this.MailInfo.smtpOptions.port = _data[0]['EmailServerPort'];
        this.MailInfo.smtpOptions.user = _data[0]['EmailAccountName'];
        this.MailInfo.smtpOptions.password = _data[0]['usc'];
        this.MailInfo.smtpOptions.useSsl = _data[0]['EmailServerEnable_SSL'];
        this.MailInfo.smtpOptions.requiresAuthentication = _data[0]['IsRequiresAuthen'];
        this.MailInfo.mailToken = localStorage.getItem(SystemConstants.MAIL_TOKEN).replace(/"/gi, '');
      }
    });

    if (isAttachFiles) {

      let file = { source: '', des: '' };
      file.des = data['ProductCostId'] + '/' + this.folderNameSendMail + '/' + id + '/' + data['DocNo'].replace(/\//gi, '-') + '.pdf';
      file.source = templatePath;

      this.MailInfo.files.push(file);

      const params = new Array<ParameterContract>();
      const param1 = new ParameterContract();

      param1.ParameterName = Global.convertParameterName('Id');
      param1.ParameterValue = id;
      params.push(param1);

      let _dataAttach = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, commandStore, params)
        .toPromise().then();

      //this.MailInfo.replacement = _dataAttach['output'];

      let ctor1 = CryptoExtension.encrypt(commandStore);
      const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

      let exportOption = {
        "storeName": ctor1,
        "params": ctor2
      }
      this.MailInfo.exportOption = exportOption;
    }

    const paramsSe = new Array<ParameterContract>();
    const paramsSe1 = new ParameterContract();
    const paramsSe2 = new ParameterContract();
    paramsSe1.ParameterName = this.convertParameterName('Id');
    paramsSe1.ParameterValue = id;
    paramsSe.push(paramsSe1);

    paramsSe.push(param4);//nUserId
    paramsSe.push(param6);//DocCode

    let ctor1 = CryptoExtension.encrypt('usp_Web_BindingTemplateEmail');
    const ctor2 = CryptoExtension.encrypt(JSON.stringify(paramsSe));

    let body = {
      "storeName": ctor1,
      "params": ctor2
    }

    let _html = await this._service.exportHtml('/5.TemplateMail/' + filePath, body).toPromise().then();

    this.MailInfo.htmlMessage = _html['html'];

    if (isAdjust) {
      let pop = this.frmEmailPopup;
      if (this.richtextMail == undefined) {
        this.richtextMail = CKEditorExtension.create("Nội dung", "richtextmail", this.MailInfo.htmlMessage, 200);
      }

      this.inputCC['nativeElement'].value = this.MailInfo.cc;
      this.inputTo['nativeElement'].value = this.MailInfo.to;
      this.inputSubject['nativeElement'].value = this.MailInfo.subject;
      // this.inputBCC['nativeElement'].value = MailInfo.bcc;
      pop.show();
    }
    else {
      if (!isConfirmMail) {
        let arrTo = this.MailInfo.to.split(';');
        if (arrTo.length == 1) {
          this._service.sendMailApi(Global.MailEndPoint, this.MailInfo).toPromise().then((result) => {
            if (result.success == false) {
              alert('Tiến trình không thành công');
              location.reload();
            }
            //await this._service.sendMail(Global.MailEndPoint, this.MailInfo).toPromise().then(() => {
            if (func != null || func != undefined) {
              func.then(() => {
                console.log('success mail....!');
              })
            }
          });
          // this.subscription.add(sub);
        }
        else if (arrTo.length > 1) {
          this._service.sendMailApi(Global.MailEndPoint, this.MailInfo).toPromise().then((result) => {
            if (result.success == false) {
              alert('Tiến trình không thành công');
              location.reload();
            }

            //await this._service.sendMailToMulti(Global.MailEndPoint, this.MailInfo).toPromise().then(() => {
            if (func != null || func != undefined) {
              func.then(() => {
                console.log('success mail muilti....!');
              })
            }
          });
          // this.subscription.add(sub);
        }
      }

    }

  }

  closeFormEmail() {
    this.frmEmailPopup.hide();
    location.reload();
  }

  async sendMailCustom(reload?: boolean, func?: Promise<void>) {
    this.SendMailObject.from = this.MailInfo.from;
    this.SendMailObject.to = this.inputTo['nativeElement'].value;
    this.SendMailObject.cc = this.inputCC['nativeElement'].value;
    this.SendMailObject.subject = this.inputSubject['nativeElement'].value;
    this.SendMailObject.nameSend = this.MailInfo.nameSend;
    this.SendMailObject.mailType = this.MailInfo.mailType;
    this.SendMailObject.htmlMessage = '<body style="font-family:' + "'Times New Roman'" + ';">' + this.richtextMail.getData() + '</body>';
    
    this.SendMailObject.smtpOptions.server = this.MailInfo.smtpOptions.server;
    this.SendMailObject.smtpOptions.port = this.MailInfo.smtpOptions.port;
    this.SendMailObject.smtpOptions.user = this.MailInfo.smtpOptions.user;
    this.SendMailObject.smtpOptions.password = this.MailInfo.smtpOptions.password;
    this.SendMailObject.smtpOptions.useSsl = this.MailInfo.smtpOptions.useSsl;
    this.SendMailObject.smtpOptions.requiresAuthentication = this.MailInfo.smtpOptions.requiresAuthentication;
    this.SendMailObject.mailToken = localStorage.getItem(SystemConstants.MAIL_TOKEN).replace(/"/gi, '');

    if (this.MailInfo.files.length > 0) {
      this.SendMailObject.files = this.MailInfo.files;
      //this.SendMailObject.replacement = this.MailInfo.replacement;
      this.SendMailObject.exportOption = this.MailInfo.exportOption;
    }

    let arrTo = this.SendMailObject.to.split(';');
    if (arrTo.length == 1) {
      
      //const sub = await this._service.sendMail(Global.MailEndPoint, this.SendMailObject).subscribe();
      const sub = this._service.sendMailApi(Global.MailEndPoint, this.SendMailObject).subscribe(result => {
  
        if (result.success == false) {
          alert('Tiến trình không thành công');
          location.reload();
        }

      });

      this.subscription.add(sub);

      if (func != null || func != undefined) {
        func.then(() => {
          console.log('update sended email....!');
        })
      }
    }
    else if (arrTo.length > 1) {
      //const sub = await this._service.sendMailToMulti(Global.MailEndPoint, this.SendMailObject).subscribe();
      const sub = this._service.sendMailApi(Global.MailEndPoint, this.SendMailObject).subscribe(result => {
        if (result.success == false) {
          alert('Tiến trình không thành công');
          location.reload();
        }

      });
      this.subscription.add(sub);
      if (func != null || func != undefined) {
        func.then(() => {
          console.log('update sended email....!');
        })
      }
    }

    this.frmEmailPopup.hide();

    if (reload) {
      //location.reload(false);
      // //this.router.navigate(['/main', 'notifications', 'index']);
      // // this.router.navigate(['main']).then(() => {
      // //   this.router.navigate(this.indexPage).then(() => {
      // //   })
      // // });
    }

  }

  async updateSendMailSupplier(id: any) {
    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('Id');
    param1.ParameterValue = id
    params.push(param1);

    let _data = await this._service.postData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_TMCtc_UpdateSendMailSupplier', params)
      .toPromise().then();
  }

  clearFilterExplorer() {
    this.addFilterCache(this.zCommandKey, this.zFilterKey, '', '').then(() => {
      this.fetchData();
    });
  }

  async exportHtmlWithCheck(flex: wjcGrid.FlexGrid, name: string, fileName: string, folderPath: string) {
    this.showLoading = true;

    let _command = this._layoutDeclare.layout.PrintDocument.Command;

    let completedapprove = flex.selectedItems[0]['CompletedApprove'];

    if (completedapprove != 1) {
      alert('Không thể in phiếu chưa hoàn thành duyệt');
      return;
    }

    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = flex.selectedItems[0]['Id'];
    params.push(param1);

    let ctor1 = CryptoExtension.encrypt(_command);
    const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

    let body = {
      "storeName": ctor1,
      "params": ctor2
    }

    this._service.exportHtml(folderPath + name, body).subscribe(data => {

      let _title = fileName;

      if (_title == '' || _title == null || _title == undefined) {
        _title = this._layoutDeclare.layout.PrintDocument.Text;
      }

      let _html = `<html><head>
        <title>`+ Global.translateAutoText(_title, flex.selectedRows[0].dataItem) + `</title>
        </head>`;
      _html += '<body onload="window.print();window.close()">';

      _html += Global.translateImageOutput(data['html'], data['output']);

      if (_html.toString().indexOf('____________________') > -1) {
        _html = _html.replace(/____________________/gi, '<img src="' + this.urlImg + data['output']['@_ChuKyLCVien'] + '" alt="image not available" style="width: 100px;height: 100px;"/>');
      }

      if (_html.toString().indexOf('___________________') > -1) {
        _html = _html.replace(/___________________/gi, '<img src="' + this.urlImg + data['output']['@_ChuKyTeo'] + '" alt="image not available" style="width: 100px;height: 100px;"/>');
      }


      _html += '</body></html>'

      this.showLoading = false;

      let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

      popupWin.document.write(_html);

      popupWin.document.close();
    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
