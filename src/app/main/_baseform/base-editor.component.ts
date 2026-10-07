import { Component, HostListener, ElementRef, EventEmitter, Output, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import * as wjcGridXlsx from 'wijmo/wijmo.grid.xlsx';
import * as wjcXlsx from 'wijmo/wijmo.xlsx';

// SERVICE
import { BaseEditorService } from './../../base/base.service-editor';

// CONTRACTS
import { ParameterContract } from './../../contracts/parameter.contract';
import { DataSetContract } from './../../contracts/dataset.contract';
import { ColumnContract } from './../../contracts/column.contract';
import { RowContract } from './../../contracts/row.contract';
import { TableContract } from './../../contracts/table.contract';

import { DataRowState } from './../../core/enum/type.enum';

// WIJMO
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcInput from 'wijmo/wijmo.angular2.input';

import { Global } from './../../shared/global';
import { GridRowUtil } from './../../shared/grid-row.util';
import { BravoCtorEnum } from './../../core/enum/type.enum';

import { ActivatedRoute, Router } from '@angular/router';

import { InputBase } from './../../ui/input/InputBase';
import { TextBoxInput } from './../../ui/input/TextBoxInput';
import { DateBoxInput } from './../../ui/input/DateBoxInput';
import { CheckBoxInput } from './../../ui/input/CheckBoxInput';
import { LookupBoxInput } from './../../ui/input/LookupBoxInput';
import { ButtonInput } from './../../ui/input/ButtonInput';
import { UploadInput } from './../../ui/input/UploadInput';

import { PanelControlService } from './../../ui/panel/PanelControlService';

import { DynamicFormPanelComponent } from './../../ui/form/dynamic-form-panel.component';
import { PanelBase } from './../../ui/panel/PanelBase';
import { TablePanel } from './../../ui/panel/TablePanel';
import { DynamicFormEditorInputComponent } from './../../ui/form/editor/dynamic-form-editor-input.component';

import { SystemConstants } from './../../core/common/system.constants';
import { BravoSiteStorage } from './../../core/domain/bravo.site.storage';
import { NumberBoxInput } from '../../ui/input/NumberBoxInput';
import { InputDate, InputNumber, AutoComplete, InputDateTime, MultiAutoComplete, MultiSelect, Popup } from 'wijmo/wijmo.input';
import { CollectionView, SortDescription, DataType } from 'wijmo/wijmo';
import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http';
import { MultiSelectInput } from '../../ui/input/MultiSelectInput';
import { Console } from '@angular/core/src/console';
import { Subscription } from 'rxjs/Subscription';
import { saveAs as importedSaveAs } from "file-saver";
import { Title } from '@angular/platform-browser';
import { UploadImage } from '../../ui/input/UploadImage';
import { UrlConstants } from '../../core/common/url.constants';
import { invalid } from 'moment';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { CryptoExtension } from '../../core/extensions/crypto.extension';
import { CKEDITOR, CKEditorExtension } from '../../core/extensions/ckeditor.extension';

// @Component({
//   selector: 'base-editor-form',
//   templateUrl: './base-editor-form.component.html',
//   styleUrls: ['./base-editor-form.component.css']
// })

export abstract class BaseEditorComponent implements OnDestroy {

  // initialCompleted = new EventEmitter();
  protected isSysAdmin: string;
  protected id: number = -1;
  protected gridArray: wjcGrid.FlexGrid[];
  protected dfpanel: DynamicFormPanelComponent;
  protected editorFrm: FormGroup;
  protected parentData = {};
  protected _layoutDeclare: any;
  protected filesUpload: File[] = [];
  protected imageUpload: File[] = [];
  protected deleteRows: string[];
  protected _rowIdex;
  protected errorMessage: string;
  protected indexPage;
  protected folderName;
  protected folderNameSendMail;
  showLoading = false;

  subscription: Subscription;
  protected paramsDefault: {};
  protected paramsRoute: any;
  protected zCommandKey: string;

  protected inputs: InputBase<any>[] = [];

  protected dataItem: Array<Object>;
  protected zItemTableName: string;
  protected zItemFilterKey: string;
  protected pageNumber: number = 1;
  protected rowItem: number;
  protected orderBy: string;

  protected searchItemText: string;

  //Khoannt: Thêm dialog
  protected showDialog = false;
  protected dialogAgree = false;
  protected titleConfirmDialog: string;
  //Khoannt: Hết Thêm dialog

  //Kit: In ấn
  protected dataPrint: wjcCore.CollectionView;
  protected outputPrint: Array<Object>;
  protected gridPrint: wjcGrid.FlexGrid;
  protected _layoutPrinter: any;

  protected _layoutPrinter_WordFlow: any;
  protected listLayoutPrint: Array<Object>;
  protected layoutPrint: any;

  protected isPermisionEdiAll_isSave: boolean;
  protected isPermisionEdiAll_isApprove: boolean;
  protected isPermisionEdiAll_isExport: boolean;
  protected isPermisionEdiAll_isPrint: boolean;


  //// Dương: url img
  protected urlImg: string = Global.ImgEndpoint;

  protected listlinkCommandPopup: Array<Object>;

  richtextMail: CKEDITOR.editor;

  SendMailObject = {
    from: '',
    nameSend: '',
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    plainTextMessage: '',
    htmlMessage: null,
    files: [],
    mailToken: '',
    smtpOptions: { server: '', user: '', password: '', port: 25, useSsl: true, requiresAuthentication: true },
    //replacement: null,
    exportOption: null,
    mailType: ''
  }

  protected allowSendMail: boolean = true;
  protected _errAmount: boolean = false;
  protected _errMess: any;

  constructor(protected _service: BaseEditorService,
    protected route: ActivatedRoute,
    protected pcs: PanelControlService,
    protected elRef: ElementRef,
    protected router: Router,
    protected titleService: Title
  ) {

    localStorage.removeItem(SystemConstants.RETURN_URL);

    let permission = this.route.snapshot.data['permission'];
    let permission2 = <Array<Object>>JSON.parse(localStorage.getItem(SystemConstants.PERMISSION_DATA));

    const sub = this.route.params.subscribe(param => {
      // if (params.indexOf('id') >= 0)
      this.id = param['id'];
      let _value = param['params'];
      if (_value) {
        this.paramsRoute = CryptoExtension.decrypt(decodeURIComponent(_value));
      }
      else { this.paramsRoute = _value; }

      if (this.id == -1) {
        this.id = undefined;
      }
    });
    this.subscription = new Subscription();

    this.subscription.add(sub);

    this.zCommandKey = router.url.split('/')[2] + '-' + router.url.split('/')[3].replace('detail', 'editor');

    // ?view=1 (mở từ màn "Hồ sơ đã duyệt"): chỉ xem nội dung, chỉ còn nút Thoát.
    this.isViewOnly = this.route.snapshot.queryParams['view'] == '1';
    if (this.isViewOnly)
      this.enableViewOnlyMode();

    this.setPermission(permission, permission2);

    if (Global.getPermissionAll(permission, permission2, this.zCommandKey, 'IsDisplay') == false && localStorage.getItem(SystemConstants.CURRENT_ISSYSADMIN) == 'false') {
      alert('Người sử dụng hiện thời không có quyền truy cập!');
      this.router.navigate([UrlConstants.HOME]);
    }

    if (this.paramsRoute) {
      if (this.paramsRoute == 'copy') {
        console.log('NewAsCopy');
      }
      else if (this.paramsRoute == 'split') {
        console.log('Split ProposedPurchase');
      }
      else {
        let dataPara = <Array<string>>JSON.parse(this.paramsRoute);
        if (dataPara != undefined && dataPara != null) {
          if (dataPara['Commandkey'] == this.zCommandKey)
            this.paramsDefault = dataPara;
        }
      }
    }
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  /** true khi mở bằng ?view=1 - xem hồ sơ đã duyệt, không cho Lưu / Duyệt / Trả lại / Đề xuất trả. */
  isViewOnly = false;

  /**
   * Các nút thao tác nằm riêng trong template từng màn approved*, nên khoá chung tại host:
   * class newt-view-only ẩn mọi <button> trên thanh công cụ (styles.css; nút Thoát là thẻ <a>),
   * đồng thời chặn click / submit ở pha capture phòng khi CSS chưa áp dụng.
   */
  private enableViewOnlyMode() {
    const host: HTMLElement = this.elRef.nativeElement;
    host.classList.add('newt-view-only');

    host.addEventListener('click', (e: Event) => {
      const target: any = e.target;
      if (target && target.closest && target.closest('.box-header .box-tools button')) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    host.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    }, true);
  }

  handleKeyDown(event: any) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }
  }

  onTabClick(gridtmp: wjcGrid.FlexGrid) {
    // // if(gridtmp.columns.length<2)
    gridtmp.columns.clear();
    switch (this.gridArray.indexOf(gridtmp)) {
      case 0:
        this.createColumnGroups(gridtmp, this._layoutDeclare.childColumns, 0);
        break;
      case 1:
        this.createColumnGroups(gridtmp, this._layoutDeclare.childColumns1, 0);
        break;
      case 2:
        this.createColumnGroups(gridtmp, this._layoutDeclare.childColumns2, 0);
        break;
      case 3:
        this.createColumnGroups(gridtmp, this._layoutDeclare.childColumns3, 0);
        break;
      case 4:
        this.createColumnGroups(gridtmp, this._layoutDeclare.childColumns4, 0);
        break;
      case 5:
        this.createColumnGroups(gridtmp, this._layoutDeclare.childColumns5, 0);
        break;
      case 6:
        this.createColumnGroups(gridtmp, this._layoutDeclare.childColumns6, 0);
        break;
      case 7:
        this.createColumnGroups(gridtmp, this._layoutDeclare.childColumns7, 0);
        break;
      case 8:
        this.createColumnGroups(gridtmp, this._layoutDeclare.childColumns8, 0);
        break;
      case 9:
        this.createColumnGroups(gridtmp, this._layoutDeclare.childColumns9, 0);
        break;
      case 10:
        this.createColumnGroups(gridtmp, this._layoutDeclare.childColumns10, 0);
        break;
    }
  }

  async init() {

    if (document.getElementById("titleName"))
      this.setTitle('Newtecons - ' + document.getElementById("titleName").innerText);

    this.isSysAdmin = localStorage.getItem(SystemConstants.CURRENT_ISSYSADMIN);
    this.showLoading = true;

    for (let i in this.gridArray) {

      this.gridArray[i].columns.clear();
      this.gridArray[i].autoGenerateColumns = false;
      switch (Number(i)) {
        case 0:
          this.bindColumnGroups(this.gridArray[i], this._layoutDeclare.childColumns);
          break;
        case 1:
          this.bindColumnGroups(this.gridArray[i], this._layoutDeclare.childColumns1);
          break;
        case 2:
          this.bindColumnGroups(this.gridArray[i], this._layoutDeclare.childColumns2);
          break;
        case 3:
          this.bindColumnGroups(this.gridArray[i], this._layoutDeclare.childColumns3);
          break;
        case 4:
          this.bindColumnGroups(this.gridArray[i], this._layoutDeclare.childColumns4);
          break;
        case 5:
          this.bindColumnGroups(this.gridArray[i], this._layoutDeclare.childColumns5);
          break;
        case 6:
          this.bindColumnGroups(this.gridArray[i], this._layoutDeclare.childColumns6);
          break;
        case 7:
          this.bindColumnGroups(this.gridArray[i], this._layoutDeclare.childColumns7);
          break;
        case 8:
          this.bindColumnGroups(this.gridArray[i], this._layoutDeclare.childColumns8);
          break;
        case 9:
          this.bindColumnGroups(this.gridArray[i], this._layoutDeclare.childColumns9);
          break;
        case 10:
          this.bindColumnGroups(this.gridArray[i], this._layoutDeclare.childColumns10);
          break;
      }
      this.gridArray[i].columnHeaders.rows[0].height = 42;
      this.gridArray[i].rowHeaders.columns[0].width = 45;
      this.gridArray[i].rows.defaultSize = 25;
      this.gridArray[i].selectionMode = wjcGrid.SelectionMode.CellRange;
    }

    if (this.gridPrint) {
      this.gridPrint.autoGenerateColumns = false;
      this.gridPrint.isReadOnly = true;
      this.createColumnGroups(this.gridPrint, this._layoutDeclare.layout.PrintDocument.PrintGrid, 0);
      this.mergeColumnGroups(this.gridPrint);
    }

    if (this._layoutDeclare.layout.PrintDocument != undefined) {
      this.listLayoutPrint = this._layoutDeclare.layout.PrintDocument.LayoutPrint;

      this.layoutPrint = this.listLayoutPrint[0];
    }

    if (this._layoutDeclare.layout.LinkCommand != undefined) {
      this.listlinkCommandPopup = this._layoutDeclare.layout.LinkCommand;
    }

    // this.initialCompleted.subscribe((mess)=>this.onInitialComplete(mess));
    // this.initialCompleted.next('Completed')
    await this.setupDataSource().then();
    this.onInitialComplete();
    await this.dfpanel.set_Visible_Expr();

    await this.dfpanel.set_Disabled_Expr();

    await this.dfpanel.set_Readonly_Expr();

    // await this.dfpanel.set_Format_Expr(this.paramsDefault);


    // if (this.paramsDefault !=undefined && (this.id == -1 || this.id == undefined)) {
    //   for (let control in this.paramsDefault) {
    //     if (this.paramsDefault[control]) {
    //       this.parentData[control] = this.paramsDefault[control];
    //       this.dfpanel.parentData[control] = this.paramsDefault[control];
    //     }
    //   }
    //   await this.dfpanel.updateValueForm(this.paramsDefault);

    // }

    //Khoa replace code, chạy evaluator khi truyền tham số sang Editor
    if (this.paramsDefault != undefined && (this.id == -1 || this.id == undefined)) {
      await this.inputParams();


      for (let control in this.paramsDefault) {
        if (this.paramsDefault[control]) {
          this.parentData[control] = this.paramsDefault[control];
          this.dfpanel.parentData[control] = this.paramsDefault[control];
        }
      }

      await this.dfpanel.updateValueForm(this.paramsDefault);

      for (let i in this.inputs) {
        if (this.paramsDefault[this.inputs[i].key]) {
          await this.dfpanel.onValueChanged(this.inputs[i]);
          // console.log('****************' + this.inputs[i].key);
        }
      }

    }

    if (this.paramsRoute == 'copy') {
      await this.resetValueForm().then(() => {
        console.log('resetValueForm success!');
      });
      this.parentData['Status'] = 'copy';
      this.dfpanel.parentData['Status'] = 'copy';
      this.parentData['FilePath'] = '';
      this.dfpanel.parentData['FilePath'] = '';
    }

    if (this.paramsRoute == 'split') {
      this.parentData['IsSplitVoucher'] = true;
      this.dfpanel.parentData['IsSplitVoucher'] = true;
      this.parentData['DocStatus'] = 4;
      this.dfpanel.parentData['DocStatus'] = 4;
      this.parentData['Status'] = 'split';
      this.dfpanel.parentData['Status'] = 'split';
    }

    if (this._layoutDeclare['menu']) {
      await this.fetchDataItem();
      for (let i = 0; i < this.dataItem.length; i++) {
        let value: number = 0;

        for (let j = 0; j < this.gridArray[0].itemsSource.items.length; j++) {

          if (this.dataItem[i][this._layoutDeclare['menu'].PrimaryField] == this.gridArray[0].itemsSource.items[j][this._layoutDeclare['menu'].DuplicationField]) {
            value += Number(this.gridArray[0].itemsSource.items[j][this._layoutDeclare['menu'].ColumnEdit]);
            this.dataItem[i][this._layoutDeclare['menu'].ColumnInput] = this.gridArray[0].itemsSource.items[j][this._layoutDeclare['menu'].ColumnEdit];
          }
        }

        this.dataItem[i][this._layoutDeclare['menu'].ColumnShow] = value.toString();

      }
    }

    this.showLoading = false;

  }


  async fetchDataItem() {
    this.zItemFilterKey = this.dfpanel.translate_expr_Filter_sql(this.zItemFilterKey, this.paramsDefault, this.parentData);

    let _data = await this._service.fetchDataSelect(Global.DataEditorEndpoint, this.zItemTableName, this.zItemFilterKey, this.pageNumber, this.rowItem, this.orderBy).toPromise().then();
    this.dataItem = await <Array<Object>>(_data);

  }


  async resetValueForm() {
    if (this._layoutDeclare.layout.Structure.Parent.ResetValueForm != undefined) {
      let _resetValue = this._layoutDeclare.layout.Structure.Parent.ResetValueForm;

      await this.inputParams();

      for (let control in _resetValue) {
        if (_resetValue[control]) {
          this.parentData[control] = _resetValue[control];
          this.dfpanel.parentData[control] = _resetValue[control];
        }
      }

      await this.dfpanel.updateValueForm(_resetValue);

      for (let i in this.inputs) {
        if (_resetValue[this.inputs[i].key]) {
          await this.dfpanel.onValueChanged(this.inputs[i]);
          // console.log('****************' + this.inputs[i].key);
        }
      }
    }
  }


  async exportHtml(name: string, fileName: string, folderPath: string, _idTT?: number) {
    this.showLoading = true;

    let _command = this._layoutDeclare.layout.PrintDocument.Command;

    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    if (_idTT != undefined && _idTT != null && _idTT > 0)
      param1.ParameterValue = _idTT
    else
      param1.ParameterValue = this.id
    params.push(param1);

    let ctor1 = CryptoExtension.encrypt(_command);
    const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

    let body = {
      "storeName": ctor1,
      "params": ctor2
    }

    this._service.exportHtml(folderPath + name, body).subscribe(data => {

      //     let _htmlDetail = ''
      //     if (this.gridPrint) {
      //         this.dataPrint = new wjcCore.CollectionView(data['data']);
      //         this.gridPrint.itemsSource = new wjcCore.CollectionView(data['data']);
      //         _htmlDetail = this.renderTable(this.gridPrint);
      //     }

      let _title = fileName;

      if (_title == '' || _title == null || _title == undefined) {
        _title = this._layoutDeclare.layout.PrintDocument.Text;
      }

      let _html = `<html>
    <head>
    <title>`+ Global.translateAutoText(_title, this.parentData) + `</title>
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


  async showHtmlEditor(name: string, fileName: string, folderPath: string, input: any) {
    let _command = this._layoutDeclare.layout.PrintDocument.Command;


    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = input;
    params.push(param1);

    let ctor1 = CryptoExtension.encrypt(_command);
    const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

    let body = {
      "storeName": ctor1,
      "params": ctor2
    }

    let _data = await this._service.exportHtml(folderPath + name, body).toPromise().then();

    if (_data['html'].toString().indexOf('____________________') > -1) {
      _data['html'] = _data['html'].replace(/____________________/gi, '<img src="' + this.urlImg + _data['output']['@_ChuKyLCVien'] + '" alt="image not available" style="width: 100px;height: 100px;"/>');
    }

    if (_data['html'].toString().indexOf('___________________') > -1) {
      _data['html'] = _data['html'].replace(/___________________/gi, '<img src="' + this.urlImg + _data['output']['@_ChuKyTeo'] + '" alt="image not available" style="width: 100px;height: 100px;"/>');
    }

    return _data['html'];
  }

  async exportWord(name: string, fileName: string, folderPath: string) {
    this.showLoading = true;

    let _command = this._layoutDeclare.layout.PrintDocument.Command;

    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = this.id;
    params.push(param1);

    let ctor1 = CryptoExtension.encrypt(_command);
    const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

    let body = {
      "storeName": ctor1,
      "params": ctor2
    }

    fileName = Global.translateAutoText(fileName, this.parentData);
    this._service.exportWord(folderPath, name, body).subscribe(blob => {
      let extension = name.endsWith(".docx") ? ".docx" : ".doc";
      importedSaveAs(blob, fileName + extension);
      this.showLoading = false;
    });
  }

  async exportExcel(name: string, fileName: string, folderPath: string) {
    this.showLoading = true;

    let _command = this._layoutDeclare.layout.PrintDocument.Command;

    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = this.id;
    params.push(param1);

    let ctor1 = CryptoExtension.encrypt(_command);
    const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

    let body = {
      "storeName": ctor1,
      "params": ctor2
    }

    try {
      fileName = Global.translateAutoText(fileName, this.parentData);
    }
    catch (ex) {
      console.log('Global.translateAutoText: ' + ex);
    }

    this._service.exportExcel(folderPath, name, body).subscribe(blob => {
      let extension = name.endsWith(".xlsx") ? ".xlsx" : ".xls";
      importedSaveAs(blob, fileName + extension);
      this.showLoading = false;
    });
  }



  onInitialComplete() {
    console.log('########################## onInitialComplete');
    this.elRef.nativeElement.querySelector('.form-group-custom input').focus();
    this.dfpanel.columnChanged = this._layoutDeclare.columnChanged;
    this.dfpanel.columnChangedChild = this._layoutDeclare.columnChangedChild;
    this.dfpanel.evaluators = this._layoutDeclare.evaluators;
    this.dfpanel.serverConstraint = this._layoutDeclare.serverConstraint;
    this.dfpanel.serverUpdating = this._layoutDeclare.serverUpdating;
    this.dfpanel.serverUpdated = this._layoutDeclare.serverUpdated;
    this.dfpanel.buttonCommand = this._layoutDeclare.buttonCommand;
    this.dfpanel.parentData = this.parentData;
    this.dfpanel.gridArray = this.gridArray;
    this.dfpanel.isUsingEvaluator = true;
    this.dfpanel.isUsingBinding = true;
    this.dfpanel.linkReporter = this._layoutDeclare.linkReporter;

    if (this._layoutDeclare.approveGrid != undefined) {
      let _i = this._layoutDeclare.approveGrid;
      let data = this.gridArray[_i].itemsSource.sourceCollection;
      for (let r of data) {
        if (r['Id'] == this.parentData['Id']) {
          this._rowIdex = r;
        }
      }
    }

    for (let i in this.gridArray) {
      // this.sort('BuiltinOrder', Number(i), true);
      let ds: CollectionView = this.gridArray[i].itemsSource;
      ds.trackChanges = true;

      this.gridArray[i].cellEditEnded.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {
        // Dòng nhóm không có record -> evaluator sẽ eval chuỗi còn {EXPR=...} và ném SyntaxError.
        if (GridRowUtil.itemOf(this.gridArray[i], e.row) == null) return;
        let column = this.gridArray[i].columns[e.col].binding;
        this.cellValueChanged(i, column, e);
        if (s.columns[e.col].wordWrap) {
          this.autoSizeVisibleRows(s, true);
        }

      })
      // console.log(this.gridArray[i]);
    }

    for (let control of this.dfpanel.panel.controls) {
      if (control.key == 'FilePath') {
        if (control instanceof UploadInput) {
          control.folderName = this.editorFrm.controls['ProductCostId'].value.toString() + '\\' + control.command;

          if (!control.folderId && control.folderId == null)
            control.parentId = this.id;
          else
            control.parentId = this.translate_expr(control.folderId);
          break;
        }
      }
      if (control.key == 'ImagePath') {
        if (control instanceof UploadImage) {
          control.src = this.urlImg + '4.img\\' + this.zCommandKey + '\\' + this.editorFrm.controls['ImagePath'].value.toString();
          break;
        }
      }
    }


    if (this._layoutDeclare['menu']) {
      this.zItemTableName = this._layoutDeclare['menu'].Table;
      this.zItemFilterKey = this._layoutDeclare['menu'].Filter;
      this.rowItem = this._layoutDeclare['menu'].RowItem;
      this.orderBy = this._layoutDeclare['menu'].OrderBy;
    }
  }

  protected deleteSelectedRows(flex: wjcGrid.FlexGrid) {
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

      for (var i = 0; i < selected.length; i++) {
        //deleteRowFromDatabase(selected[i]);
        flex.itemsSource.remove(selected[i]);
      }
    }
  }

  protected async cellValueChanged(index: string, column: string, e: wjcGrid.FormatItemEventArgs) {
    await this.dfpanel.onCellValueChanged(index, column, e);

    if (this.dataItem) {
      for (let i = 0; i < this.dataItem.length; i++) {
        let value: number = 0;

        for (let j = 0; j < this.gridArray[0].itemsSource.items.length; j++) {

          if (this.dataItem[i][this._layoutDeclare['menu'].PrimaryField] == this.gridArray[0].itemsSource.items[j][this._layoutDeclare['menu'].DuplicationField]) {
            value += Number(this.gridArray[0].itemsSource.items[j][this._layoutDeclare['menu'].ColumnEdit]);
            this.dataItem[i][this._layoutDeclare['menu'].ColumnInput] = this.gridArray[0].itemsSource.items[j][this._layoutDeclare['menu'].ColumnEdit];
          }
        }

        this.dataItem[i][this._layoutDeclare['menu'].ColumnShow] = value.toString();

      }
    }
  }

  resizeWidthControls() {

    let _elements = this.elRef.nativeElement.querySelectorAll('.form-group-custom');
    let _elementsInput = this.elRef.nativeElement.querySelectorAll('.form-group-custom .wj-control');
    let _elementsButton = this.elRef.nativeElement.querySelectorAll('.form-group-custom button');


    let _j = 0;
    _elementsButton.forEach(item => {

      _elementsButton[_j].style.width = item.offsetWidth - 40 + 'px';

      for (let pn of this._layoutDeclare.panels) {
        for (let ct of pn.controls) {
          if (ct['key'] == item['id'])
            _elementsButton[_j].style = ct['style'];
        }

      }

      _j++;

    })

    let _i = 0;
    _elements.forEach(item => {

      // khoa set style panel đầu phiếu
      if (item.children[1])
        if (item.children[1].children[0]) {
          for (let pn of this._layoutDeclare.panels) {
            for (let ct of pn.controls)
              if (item.children[1]['id'] == ct['key'] && ct['style'] != undefined) {
                item.children[1].children[0]['style'] = ct['style'];
              }
          }
        }
    })
  }

  afterViewInit() {
    this.resizeWidthControls();
  }

  public async setupDataSource() {
    this.editorFrm = this.pcs.toFormGroup(this._layoutDeclare.panels);
    this._layoutDeclare.panels.forEach(panel => {
      panel.controls.forEach(control => {
        if (control instanceof LookupBoxInput) {
          control.controlCollection = this.controlCollection;
        } else if (control instanceof UploadInput) {
          control.command = this.folderName;

          if (!control.folderId && control.folderId == null)
            control.parentId = this.id;
          else
            control.parentId = this.translate_expr(control.folderId);
        }
      })
    })


    if (this.id && this.id != -1 && this._layoutDeclare.layout) {
      let filterKey = 'Id=' + this.id;

      let tableParentName = this._layoutDeclare.layout.Structure.Parent.Name;
      if (!tableParentName) {
        alert('Parent Table Name is not declare');
        return;
      }

      let data = await this._service.fetchData(Global.DataEditorEndpoint, this._layoutDeclare.layout.Structure, filterKey)
        .toPromise();

      let _parent = data[this._layoutDeclare.layout.Structure.Parent.Name][0];
      this.dfpanel.updateValueForm(_parent);
      for (let key in _parent) {
        this.parentData[key] = _parent[key];
      }
      if (this._layoutDeclare.layout.Structure.Child != undefined) {
        let childs = this._layoutDeclare.layout.Structure.Child;
        for (let i = 0; i < childs.length; i++) {
          this.gridArray[i].itemsSource = new CollectionView(data[childs[i].Name]);
          if (childs[i].frozenColumns)
            this.gridArray[i].frozenColumns = Number(childs[i].frozenColumns);

          //Khoa fix boom 24.01.2018
          let datadefault = await this._service.getDefaultSchema(Global.DataEditorEndpoint, this._layoutDeclare.layout.Structure, childs[i].Name).toPromise();
          this.gridArray[i].itemsSource['defaultRow'] = datadefault[0];
        }
      }
    }
    else {
      let tableParentName = this._layoutDeclare.layout.Structure.Parent.Name;
      let data = await this._service.getDefaultSchema(Global.DataEditorEndpoint, this._layoutDeclare.layout.Structure, tableParentName)
        .toPromise();
      for (let key in data[0]) {
        this.parentData[key] = data[0][key];
      }

      let _defaultValues = this._layoutDeclare.layout.Structure.Parent.DefaultValues;
      for (let key in _defaultValues) {
        let _value = _defaultValues[key];
        if (typeof (_value) == 'string') {
          this.parentData[key] = Global.convertConfig(_value);
        } else {
          this.parentData[key] = _defaultValues[key];
        }
      }

      this.dfpanel.updateValueForm(this.parentData);

      // console.log(this.editorFrm);

      if (this._layoutDeclare.layout.Structure.Child != undefined) {
        let childs = this._layoutDeclare.layout.Structure.Child;
        for (let i = 0; i < childs.length; i++) {
          this.gridArray[i].itemsSource = new CollectionView();
          this.gridArray[i].itemsSource.trackChanges = true;
          if (childs[i].frozenColumns)
            this.gridArray[i].frozenColumns = Number(childs[i].frozenColumns);

          //Khoa fix boom 24.01.2018
          let datadefault = await this._service.getDefaultSchema(Global.DataEditorEndpoint, this._layoutDeclare.layout.Structure, childs[i].Name).toPromise();
          this.gridArray[i].itemsSource['defaultRow'] = datadefault[0];
        }
      }
    }


  }

  destroy() {
    this.hideRowMenu();
    if (this.gridArray && this.gridArray.length > 0) {
      for (let grid of this.gridArray) {
        if (grid.itemsSource != null) {
          grid.itemsSource = null;
        }
      }
    }
  }
  _checkErrGrid: number;
  bindColumnGroups(flex: wjcGrid.FlexGrid, columnGroups: any): void {
    this._checkErrGrid = 0;
    if (this.paramsDefault != undefined) {

      let lenghtGroup = columnGroups.length;
      let controls: string[] = [];

      for (let pn of this._layoutDeclare.panels) {
        for (let ct of pn.controls)
          controls.push(ct['key']);
      }

      controls.sort((a, b) => b.length - a.length);

      let spliceColumns = [];

      for (let i in columnGroups) {
        if (columnGroups[i]['hiden']) {

          let _expr = columnGroups[i]['hiden'];

          for (const control of controls) {
            let patern = '{EXPR=' + control + '}';
            if (_expr.indexOf(patern) > -1) {
              let value = this.paramsDefault[control];

              if (value instanceof Date) {
                if (value != null)
                  value = value.toISOString();
              }

              do {
                _expr = _expr.replace(patern, value);
              }
              while (_expr.indexOf(patern) > -1)
            }
          }
          if (eval(_expr)) {
            spliceColumns.push(i);
          }
        }

        if (columnGroups[i]['exprFormat'] != undefined) {

          let _expr = columnGroups[i]['exprFormat'];

          _expr = Global.translateAutoText(_expr, this.paramsDefault);

          let fomatEnd = 'n0';
          fomatEnd = eval(_expr);
          columnGroups[i]['format'] = fomatEnd;

        }
      }

      for (let i in spliceColumns) {
        if (columnGroups.length == lenghtGroup)
          columnGroups.splice(spliceColumns[i], 1);
        else {
          let _diff = lenghtGroup - columnGroups.length;
          columnGroups.splice(spliceColumns[i] - _diff, 1);
        }
      }
    }

    // create the columns
    flex.allowAddNew = true;
    flex.allowSorting = false;
    this.createColumnGroups(flex, columnGroups, 0);
    this.mergeColumnGroups(flex);

    var colHdrs = flex.columnHeaders;
    for (var nRow = 0; nRow < colHdrs.rows.length - 1; nRow++)
      for (var nCol = 0; nCol < colHdrs.columns.length; nCol++) {
        var data = colHdrs.getCellData(nRow, nCol, false);
        if (!data && (nRow - 1) >= 0)
          colHdrs.setCellData(nRow, nCol, colHdrs.getCellData(nRow - 1, nCol, true));
      }

    let _formatItem = (s, e: wjcGrid.FormatItemEventArgs) => {
      if (e.panel.cellType === wjcGrid.CellType.TopLeft) {
        // e.cell.innerHTML = '<div><button style="width: 30px;height: 30px;" title="Thêm mới"><i class="fa fa-plus-square" aria-hidden="true"></i></button></div>';
        // wjcCore.setCss(e.cell, {
        //   display: 'table',
        //   tableLayout: 'fixed',
        //   fontSize: '12px',
        // });

        // wjcCore.setCss(e.cell.children[0], {
        //   display: 'table-cell',
        //   verticalAlign: 'middle',
        //   textAlign: 'center',
        //   fontSize: '12px',
        // });

      }

      if (e.panel.cellType === wjcGrid.CellType.ColumnHeader) {
        //// e.cell.innerHTML = '<div><input type="text" style="width:100%;"></input></br><div>' + e.cell.innerHTML + '</div></div>';
        //e.cell.innerHTML = '<div>' + e.cell.innerHTML + '</div>';

        // //Khoa fix checkbox all column 20.04
        let column = flex.columns[e.col];
        let _col = columnGroups.find(_c => _c['binding'] == column['binding']);

        if (_col != undefined && column.dataType == wjcCore.DataType.Boolean && _col['checkAll']) {
          e.cell.innerHTML = '<div><input type="checkbox">' + e.cell.innerHTML + '</div>';

          var cnt = 0;
          for (var i = 0; i < flex.rows.length - 1; i++) {
            if (s.getCellData(i, e.col) == true) cnt++;
          }

          var cb = e.cell.getElementsByTagName('input')[0];
          cb.checked = cnt > 0;
          cb.indeterminate = cnt > 0 && cnt < flex.rows.length - 1;

          // apply checkbox value to cells
          cb.addEventListener('click', function (e) {
            flex.beginUpdate();
            for (var i = 0; i < flex.rows.length - 1; i++) {
              flex.setCellData(i, column.index, cb.checked);
            }
            flex.endUpdate();
          });

        }
        else {
          e.cell.innerHTML = '<div>' + e.cell.innerHTML + '</div>';
        }
        //////////


        wjcCore.setCss(e.cell, {
          display: 'table',
          tableLayout: 'fixed',
          // fontSize: '12px',
        });

        wjcCore.setCss(e.cell.children[0], {
          display: 'table-cell',
          verticalAlign: 'middle',
          textAlign: 'center',
          // fontSize: '12px',
        });
      }

      let editRange = flex.editRange;
      if (e.panel.cellType === wjcGrid.CellType.Cell && editRange && editRange.row === e.row && editRange.col === e.col) {
        // Dòng nhóm (GroupRow) không có record dữ liệu -> không tạo editor.
        let _itemEdit = GridRowUtil.itemOfArgs(e);
        if (_itemEdit == null) return;

        let column = flex.columns[e.col];
        let _col = columnGroups.find(_c => _c['binding'] == column['binding']);
        let expr = _col['exprReadOnly'];
        try {

          if (_col['exprReadOnly']) {
            expr = this.dfpanel.fn_translate_expr_grid(expr, _itemEdit)
            if (eval(expr)) {
              flex.endUpdate();
              return;
            }
            // else
            // {
            //   e.cell.setAttribute("class","none");
            // }
          }
        } catch (ex) { }
        this.createEditor(flex, column, columnGroups, e, _itemEdit);

      }
      if (e.panel.cellType === wjcGrid.CellType.Cell) {
        let column = flex.columns[e.col];

        // Record của dòng; null khi là GroupRow hoặc dòng "thêm mới" chưa có dữ liệu.
        // KHÔNG return sớm ở đây: nút isButton vẫn phải hiện trên dòng thêm mới.
        let _itemCell = GridRowUtil.itemOfArgs(e);
        let _isGroupRow = GridRowUtil.isGroupRow(flex, e.row);

        let _col = columnGroups.find(_c => _c['binding'] == column['binding']);
        let exprValidators = _col['validators']
        try {
          if (_col['validators'] && _itemCell) {
            exprValidators = this.dfpanel.fn_translate_expr_grid(exprValidators, _itemCell);
            if (eval(exprValidators)) {
              e.cell.classList.add('wj-state-invalid');
              if (_col['validatorMessage']) {
                e.cell.setAttribute('title', _col['validatorMessage']);
              }
              if (_col['ignoreError'] == 0) {
                this.editorFrm.setErrors({ "error": _col['validatorMessage'] });
                //this._checkErrGrid += 1;
              }
            } else {
              //this._checkErrGrid -= 1;
              e.cell.setAttribute('title', '');
            }
          }

               if (_col["isButton"] && !_isGroupRow) {
                  let btnLink = document.createElement('button');
                  if (btnLink instanceof HTMLButtonElement) {
                     btnLink.type = 'button'
                     btnLink.classList.add('btn', 'btn-primary');
                     btnLink.textContent = _col['textButton'] || '...'
                     btnLink.style.width = "100%";
                     btnLink.style.height = "100%";
                     btnLink.style.padding = "inherit";

                     btnLink.addEventListener("click", () => { 
                      this.ButtonGridClick(flex, _col) });
                  }

                  e.cell.textContent = "";
                  e.cell.appendChild(btnLink);
                  e.cell.style.padding = "1px";
               }
        } catch (ex) { }

        let exprReadOnly = _col['exprReadOnly']
        try {
          if (_col['exprReadOnly'] && _itemCell) {
            exprReadOnly = this.dfpanel.fn_translate_expr_grid(exprReadOnly, _itemCell);

            if (eval(exprReadOnly)) {
              e.cell.classList.add('wj-state-disabled');
            }
          }
        } catch (ex) { }

        // // if (_col['dataType'] === 'Array') {
        // //   let i = flex.itemsSource.sourceCollection[e.row];
        // //   if (i != undefined) {
        // //     if (i["DisplayMember"] && i["ValueMember"]) {
        // //       let display = _col['hideValueMember'] ? i[_col['DisplayMember']] : i[_col['binding']] + ": " + i[_col['DisplayMember']];

        // //       e.cell.innerText = display;
        // //     }
        // //   }
        // // }
      }
      // console.log(this._checkErrGrid);
    };

    flex.formatItem.removeHandler(_formatItem);
    flex.formatItem.addHandler(_formatItem);

    // set autosize row header

    let _itemsSourceChanged = (s: wjcGrid.FlexGrid, e) => {
      setTimeout(function () {
        for (var n = 0; n < s.columnHeaders.rows.length; n++) {
          // enable wrapping on first header row
          var row = s.columnHeaders.rows[n];
          row.wordWrap = true;
        }
      });
    }

    flex.itemsSourceChanged.removeHandler(_itemsSourceChanged);
    flex.itemsSourceChanged.addHandler(_itemsSourceChanged);

    // let _pasting = (s: wjcGrid.FlexGrid, e: wjcGrid.CellRangeEventArgs) => {
    //   let clip = s.getClipString();
    //   let rows = s._clipToRows(clip);
    //   let data: CollectionView = s.itemsSource;

    //   if (s.selection.row == s.rows.length - 1) {
    //   } else {
    //     e.cancel = true;
    //   }
    // }

    // let _pasted = (s: wjcGrid.FlexGrid, e: wjcGrid.CellRangeEventArgs) => {
    //   this.rowAddedEvent(s);
    // }

    // flex.pasting.removeHandler(_pasting);
    // flex.pasting.addHandler(_pasting);
    // flex.pasted.removeHandler(_pasted);
    // flex.pasted.addHandler(_pasted);
  }

  async ButtonGridClick(grid: wjcGrid.FlexGrid, column: any) {
    let host = grid.hostElement;
    let self = this;
    let key = grid.selectedItems[0]['Id'];
    let data: any = grid.selectedItems[0];
    let linkCommand = column['linkCommand'];

    if (key && linkCommand) {
      let navigateUrl = [];
      navigateUrl.push('#/main');

      let _dic = linkCommand['directory'];

      if (_dic.indexOf('{EXPR=') > -1) {

        _dic = Global.translate_expr_control(_dic, data, this.parentData);

        if (eval(_dic) == '') {
          alert('Không xác định được thông tin điều hướng. Vui lòng kiểm tra lại dữ liệu!');
          return;
        }
        navigateUrl.push(eval(_dic));
      }
      else {
        navigateUrl.push(linkCommand['directory']);
      }

      if (linkCommand['command'] != undefined) {
        let _cmd = linkCommand['command'];

        if (_cmd.indexOf('{EXPR=') > -1) {

          _cmd = Global.translate_expr_control(_cmd, data, this.parentData);

          try {
            if (eval(_cmd) != '')
              navigateUrl.push(eval(_cmd));
          }
          catch (e) {

          }
        }
        else
          navigateUrl.push(linkCommand['command']);
      }
      else
        navigateUrl.push(linkCommand['type']);


         if (linkCommand['type'] == 'view') {
            navigateUrl.push(linkCommand['key']);
         }
         else {
            if (data[linkCommand['key']] == '0' || data[linkCommand['key']] == null) {
               navigateUrl.push('-1');
            }
            else {
               navigateUrl.push(data[linkCommand['key']]);
            }
         }
         let paramsReport: any[];
      
         paramsReport = linkCommand['parameter'];
         
         for (let control in paramsReport) {
            if (paramsReport[control].toString().indexOf('{EXPR=') > -1) {
            
               paramsReport[control] = Global.translate_Parameter_linkCommand(paramsReport[control], data, this.parentData);
               if (paramsReport[control].toString().indexOf('?') > -1) {
                  paramsReport[control] = eval(paramsReport[control]);
               }
                
            }
            if (paramsReport[control].toString().indexOf('{VAR=') > -1)
               paramsReport[control] = Global.convertConfig(paramsReport[control]);

            paramsReport[control] = this.replaceString(paramsReport[control], "'");
            
         }

         localStorage.removeItem(SystemConstants.PARAMETER_LINKREPORT);
         localStorage.setItem(SystemConstants.PARAMETER_LINKREPORT, JSON.stringify(paramsReport));

         if (paramsReport != undefined && paramsReport != null && (this.parentData[linkCommand['key']] == '0' || this.parentData[linkCommand['key']] == null)) {
            let _value = encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(paramsReport)));
            navigateUrl.push(_value);
         }

         window.open(navigateUrl.join('/'));
      }
   }

  async createEditor(flex: wjcGrid.FlexGrid, column: any, columnGroups: any, e: wjcGrid.FormatItemEventArgs, dataItem?: any) {
    let _lookup;
    let editorRoot = document.createElement('div');
    let input;
    let filelabel: HTMLLabelElement;
    let fileinput;

      let button: HTMLButtonElement;

    // Lấy thẳng record của dòng thay vì sourceCollection[e.row]: khi lưới có group,
    // chỉ số dòng lưới lệch với chỉ số sourceCollection đúng bằng số GroupRow phía trên.
    let _item = (dataItem != null) ? dataItem : GridRowUtil.itemOfArgs(e);
    if (_item == null) return;   // GroupRow / dòng không có record -> không tạo editor

    let _value = _item[column['binding']];
    let _col = columnGroups.find(_c => _c['binding'] == column['binding']);

    if (_col.dataType === 'Date') {
      // isRequired=true: cột ngày bắt buộc -> control chặn clear (không cho về null).
      // isRequired=false hoặc không khai báo: cho phép xóa giá trị về null.
      let dateRequired = (_col.isRequired === true);
      if (column.format.includes('HH:mm:ss')) {
        input = new InputDateTime(editorRoot);
        input.isRequired = dateRequired;
        input.format = column.format;
        input.hostElement.style.width = '100%';
        input.isAnimated = true;
        input.timeStep = _col.timeStep || 15;
        let d = <InputDateTime>input;
        d.inputTime.isRequired = dateRequired;

        d.valueChanged.addHandler(() => {
          if (d.value != undefined && d.value != null) {
            let date = d.value;
            let _value = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            d.value = _value;
          } else if (!dateRequired) {
            // Xóa giá trị: ghi null xuống model ngay khi control clear (mirror form panel onDateChanged),
            // không phụ thuộc timing commit của cellEditEnding.
            _item[column['binding']] = null;
          }
        });

      } else {
        input = new InputDate(editorRoot);
        input.isRequired = dateRequired;
        input.format = column.format;
        input.hostElement.style.width = '100%';
        input.isAnimated = true;
        let d = <InputDateTime>input;

        d.valueChanged.addHandler(() => {
          if (d.value != undefined && d.value != null) {
            let date = d.value;
            let _value = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            d.value = _value;
          } else if (!dateRequired) {
            // Xóa giá trị: ghi null xuống model ngay khi control clear (mirror form panel onDateChanged),
            // không phụ thuộc timing commit của cellEditEnding.
            _item[column['binding']] = null;
          }
        });
      }
      if (_value != undefined)
        input.value = _value;
    } else if (_col.dataType === 'Number') {

      // let fomatEnd = 'n0';
      // if (columnGroups[column.index].exprFormat){
      //   let _exprFommat = columnGroups[column.index].exprFormat;
      //   _exprFommat = Global.translateAutoText(_exprFommat, flex.itemsSource.sourceCollection[_row], this.parentData);

      //   fomatEnd = eval(_exprFommat);
      // }

      input = new InputNumber(editorRoot);
      input.format = column.format;
      input.step = columnGroups[column.index].step;
      input.min = columnGroups[column.index].min;
      input.max = columnGroups[column.index].max;
      if (_value != undefined)
        input.value = _value;
    } else if (_col.dataType === 'Array') {

      if (_col['multiSelection'] == true) {
        input = new MultiSelect(editorRoot);
      } else {
        input = new AutoComplete(editorRoot);
      }

      if (input instanceof AutoComplete) {
        _lookup = new LookupBoxInput({
          key: column.name,
          lookupKey: _col['lookupKey'],
          binding: _col['bindingList'],
          lookupfilter: _col['lookupfilter'],
          hideValueMember: _col['hideValueMember'],
          col: 6
        }, this._service, _item);

        input.itemsSource = _lookup.options;
        input.displayMemberPath = 'DisplayMember';
        input.selectedValuePath = 'ValueMember';
        input.isContentHtml = true;
        input.isRequired = false;
        input.autoExpandSelection = true;
        input.hostElement.style.width = '100%';
        input.isAnimated = true;
        input.listBox.formatItem.addHandler((s, e: any) => {

          if (e.data) {
            e.item.innerHTML = '<strong>' + e.data.ValueMember + '</strong>' + ': ' + e.data.DisplayMember;
          } else {
            e.item.innerHTML = '';

          }
        });
        input.isDroppedDownChanging.addHandler(async () => {
          let _valueFirst = '';
          try {
            if (input.itemsSource.items[0])
              _valueFirst = input.itemsSource.items[0]['ValueMember'];
          }
          finally { }

          let tmp = input.text || '';
          if (input.itemsSource.items.length <= 1 && !_valueFirst && tmp == _valueFirst) {
            // this.input.lookupfilterCurrent = this.translate_expr(this.input.lookupfilter);

            _lookup.lookupfilterCurrent = Global.translateAutoText(_lookup.lookupfilter, _item, this.parentData);
            await _lookup.getLookupData('').then();
            if (input.itemsSource.items.length != _lookup.options.items.length)
              input.itemsSource = _lookup.options;
          }
          else if (input.itemsSource.items.length == 1 && _valueFirst && input.text.indexOf(_valueFirst) == 0) {
            // this.input.lookupfilterCurrent = this.translate_expr(this.input.lookupfilter);
            _lookup.lookupfilterCurrent = Global.translateAutoText(_lookup.lookupfilter, _item, this.parentData);
            await _lookup.getLookupData('#' + _valueFirst, true).then();
          }
        });
        input.itemsSourceFunction = async (query, max, callback) => {
          if (input.text) {
            // this.input.lookupfilterCurrent = this.translate_expr(this.input.lookupfilter);
            _lookup.lookupfilterCurrent = Global.translateAutoText(_lookup.lookupfilter, _item, this.parentData);
            await _lookup.getLookupData(input.text, false, callback).then();
          }
        }

        if (_value) {
          _lookup.lookupfilterCurrent = Global.translateAutoText(_lookup.lookupfilter, _item, this.parentData);
          await _lookup.getLookupData('#' + _value, true).then();
        }
      } else if (input instanceof MultiSelect) {
        _lookup = new MultiSelectInput({
          key: column.name,
          lookupKey: _col['lookupKey'],
          binding: _col['bindingList'],
          lookupfilter: _col['lookupfilter'],
          hideValueMember: true,
          col: 6
        }, this._service);
        input.itemsSource = _lookup.options;
        input.displayMemberPath = 'DisplayMember';
        input.selectedValuePath = 'ValueMember';
        input.checkedMemberPath = 'State';
        input.maxHeaderItems = 10;
        input.isContentHtml = true;
        input.isRequired = false;
        input.autoExpandSelection = true;
        input.hostElement.style.width = '100%';
        input.isAnimated = true;
        input.inputElement.id = "alterInput" + _lookup.key;
        input.inputElement.outerHTML += '<input wj-part="input" type="text" class="wj-form-control" style="display:none;" readonly="">';

        input.gotFocus.addHandler(() => {
          input.removeEventListener(input.hostElement, 'keypress');
          input.removeEventListener(input.hostElement, 'keydown');
          input.removeEventListener(input.inputElement, 'click');

          let alterInput = <HTMLInputElement>document.getElementById("alterInput" + _lookup.key);
          input.listBox.gotFocus.addHandler(() => {
            alterInput.focus();
          });
          var tid;

          alterInput.addEventListener('keyup', () => {
            if (input.isDroppedDown == false)
              input.isDroppedDown = true;
            let arr = [];
            for (let i = 0; i < input.checkedItems.length; i++) {
              arr.push(input.checkedItems[i]['ValueMember']);
            }
            if (tid != undefined) {
              clearTimeout(tid);
            }
            tid = setTimeout(() => {
              _lookup.getLookupData('^' + arr.join(',') + '?' + alterInput.value, true).then(() => {
              });
            }, 500);

          });
          alterInput.removeAttribute("readonly");
          alterInput.select();
        })

        input.listBox.gotFocus.addHandler(() => {
          let alterInput = <HTMLInputElement>document.getElementById("alterInput" + _lookup.key);
          alterInput.focus();
        })

        input.listBox.formatItem.addHandler((s, e: any) => {
          // console.log(e.item.innerHTML);
          if (e.data) {
            let display = '<strong>' + e.data.ValueMember + '</strong>' + ': ' + e.data.DisplayMember;
            let checked = e.data.State ? ' checked ' : ' ';
            let html = '<label><input type="checkbox"' + checked + '> ' + display + ' </label>';
            e.item.innerHTML = html;
          }
        });

        if (!_value) _value = '';
        _lookup.lookupfilterCurrent = Global.translateAutoText(_lookup.lookupfilter, _item, this.parentData);
        await _lookup.getLookupData('^' + _value, true).then(
          () => { }
        );
      }

    } else if (_col.dataType === 'Object') {
         if (_col['isButton']) {
            input = document.createElement('button');
            if (input instanceof HTMLButtonElement) {
               input.type = 'button'
               input.classList.add('btn', 'btn-primary');
               input.textContent = "Bấm"
               input.style.width = "100%";
               input.style.height = "100%";
               input.style.padding = "inherit";

               button = input;
            }
            //editorRoot = input;
         }
         else {
      let fileData = _item['Data'];
      let filePath = _item['FilePath'];
      let fileLink = _item['LinkFile'];

   
      
      let _idLinkFile, _fileLinkFolder;
            if (!wjcCore.isNullOrWhiteSpace(fileLink)) {
               _idLinkFile = fileLink.substring(fileLink.lastIndexOf('\\') + 1);
               _fileLinkFolder = fileLink.replace(_idLinkFile, '');
            }
      input = document.createElement('div');

      if (input instanceof HTMLElement) {
        input.className = 'wj-input';
        if (!_value) _value = 'Nhấn để chọn file'

        let iconUpload = _col['allowUpload'] ? `<i class="fa fa-upload" aria-hidden="true"></i> ` : ''

        input.innerHTML = `<div class="wj-input-group " >
        
         <span wj-part="btn-dec" class="wj-input-group-btn" tabindex="-1">
         <button class="wj-btn wj-btn-default" type="button" tabindex="-1"><i class="fa fa-times" aria-hidden="true"></i><\/button><\/span>
         <span wj-part="btn-inc" class="wj-input-group-btn" tabindex="-1" >
         <button class="wj-btn wj-btn-default" type="button" tabindex="-1"><i class="fa fa-download" aria-hidden="true"></i><\/button><\/span>
         <span wj-part="btn-inc" class="wj-input-group-btn" tabindex="-1" >
         <button class="wj-btn wj-btn-default" type="button" tabindex="-1"><i class="fa fa-file-pdf-o" aria-hidden="true"></i><\/button><\/span>
         <label class="wj-form-control btn">
         <input type="file" id="inputChildFile" wj-part="input" class="wj-form-control btn" style="width:0;opacity: 0;" />
         `+ iconUpload + _value + `</label><\/div>`;

        filelabel = input.getElementsByTagName('label').item(0);
        fileinput = input.getElementsByTagName('input').item(0);
        if (fileData != undefined && fileData != null && filePath) {
          filelabel.setAttribute('title', 'file chờ upload.');
          filelabel.style.border = '1px solid green';
        }
        if (_col['allowUpload'] == false)
          fileinput.addEventListener('click', (e) => {
            e.preventDefault();
          });
        fileinput.addEventListener('change', (e) => {
          filelabel.textContent = fileinput.files[0].name;
        });

        let btns = input.getElementsByTagName('button');
        let filebtn1 = btns.item(0);
        if (_col['allowRemove'] == false) {
          filebtn1.style.display = 'none';
          filebtn1.parentElement.style.display = 'none';
        }

        filebtn1.addEventListener('click', (e) => {
          filelabel.textContent = 'Nhấn để chọn file';
          flex.endUpdate();
        });

        let clicked = (e: any, b: boolean) => {
          let _file: string = filelabel.textContent != 'Nhấn để chọn file' ? filelabel.textContent.trim() : '';
          let _folderName;
          if (!wjcCore.isNullOrWhiteSpace(_fileLinkFolder)) {
            _folderName = _fileLinkFolder;
         }
         else {
            _folderName = this.editorFrm.controls['ProductCostId'].value.toString() + '\\' + this.folderName;

        
         }
console.log(_col['folderId'])
          if (_folderName && this.id > 0 && _file) {
            let child_FolderId: string;
            if (!wjcCore.isNullOrWhiteSpace(_idLinkFile)) {
               child_FolderId = _idLinkFile;
            }
            else if (!_col['folderId'] && _col['folderId'] == null) {
              child_FolderId = this.id.toString();
              
            } else {
              child_FolderId = this.translate_expr(_col['folderId']);
           
            }

            let name = b ? _file + '.pdf' : _file;
            if (name.endsWith('.pdf.pdf')) {
              name.replace('.pdf.pdf', '.pdf');
            }
            
            let _div = document.createElement('div');
            _div.innerHTML = `<div style="height:25px;position: fixed;bottom: 45%;left: 20%;right: 20%;background-color:transparent;"><div class='childProgressBar' style="position: relative;text-align:center;    
            height:100%;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            color: #ffffff;
            padding: 5px 10px;
            background: -moz-linear-gradient(
              top,
              #bbff7a 0%,
              #a8e56d 50%,
              #95cc61 92%,
              #82b255);
            background: -webkit-gradient(
              linear, left top, left bottom,
              from(#bbff7a),
              color-stop(0.50, #a8e56d),
              color-stop(0.92, #95cc61),
              to(#82b255));
            -moz-border-radius: 6px;
            -webkit-border-radius: 6px;
            border-radius: 6px;
            border: 1px solid #12190C;
            -moz-box-shadow:
              0px 1px 1px rgba(000,000,000,0.5),
              inset 1px 2px 0px rgba(255,255,255,0.4);
            -webkit-box-shadow:
              0px 1px 1px rgba(000,000,000,0.5),
              inset 1px 2px 0px rgba(255,255,255,0.4);
            box-shadow:
              0px 1px 1px rgba(000,000,000,0.5),
              inset 1px 2px 0px rgba(255,255,255,0.4);
            text-shadow:
              1px 1px 2px rgba(000,000,000,0.7),
              0px 1px 0px rgba(255,255,255,0.4);"><\/div><\/div>`
            document.getElementsByTagName('section').item(0).appendChild(_div);
            let _bar = <HTMLDivElement>document.getElementsByClassName('childProgressBar').item(0);
            let prosub = this._service.downloadProgress.subscribe(
              data => {
                let childProgress = (Math.round(data * 100) / 100).toString() + '%';
                _bar.style.width = childProgress;
                _bar.innerText = childProgress;
                if (data == 100) {
                  setTimeout(() => {
                    _div.remove();
                    flex.endUpdate();

                  }, 300);
                }
              }, error => {
                _div.remove();
              });
            this.subscription.add(prosub);
        
            const sub = this._service.dowload(_folderName, child_FolderId, name).subscribe(blob => {

              if (name.toUpperCase().endsWith('PDF') == false || (blob.size / 1024) > 10240)
                importedSaveAs(blob, name);
              else {
                //let url = window.URL.createObjectURL(blob);
                
                console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&& Mobile:", this.isMobileMenu())
                if(this.isMobileMenu()){
                  window.open(window.URL.createObjectURL(blob));
                }
                else{
                  let params = { 'folderName': _folderName, 'id': child_FolderId, 'name': name }
                  let navigateUrl: any = ['#/main', 'documentview', 'detail', encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)))];
                  window.open(navigateUrl.join('/'));
                }
                

                //window.open(url);
              }
            });
            this.subscription.add(sub);
          }
          flex.endUpdate();
          return;
        }

        let filebtn2 = btns.item(1);
        if (_col['allowDownload'] == false || (fileData != undefined && fileData != null) || !filePath) {
          filebtn2.style.display = 'none';
          filebtn2.parentElement.style.display = 'none';

        }
        filebtn2.addEventListener('click', (e) => clicked(e, false));
        let filebtn3 = btns.item(2);
        if ((_col['allowView'] == false ||
          _value.toUpperCase().indexOf('.DOC') <= 0 && _value.toUpperCase().indexOf('.XLS') <= 0 && _value.toUpperCase().indexOf('.PDF') <= 0)
          || (fileData != undefined && fileData != null) || !filePath) {
          filebtn3.style.display = 'none';
          filebtn3.parentElement.style.display = 'none';
        }
        filebtn3.addEventListener('click', (e) => clicked(e, true));
      }
      editorRoot = input;
         }


    } else return;

    e.cell.appendChild(editorRoot);
    editorRoot.focus();
    input.focus();
    if (fileinput) {
      filelabel.focus();
    }

    if (e.cell.firstChild) {
      e.cell.firstElementChild.setAttribute('style', 'display:none');
    }
    // cellEditEnding that updates cell with user's input
    let editEndingEH = (s, args) => {
      flex.cellEditEnding.removeHandler(editEndingEH);
      if (!args.cancel) {
        args.cancel = true;
        let _c = flex.columns[args.col];
        let _col = columnGroups.find(c => c['binding'] == _c['binding']);

        // Phân giải lại record theo args.row: mọi thao tác GHI dữ liệu dùng object này,
        // chỉ toạ độ lưới (setCellData) mới dùng args.row/args.col.
        let _target = GridRowUtil.itemOfArgs(args);
        if (_target == null) _target = _item;
        if (_target == null) return;

        if (_col.dataType == 'Array') {
          let arr = [];
          if (input instanceof MultiSelect) {
            let arr = [];
            for (let i = 0; i < input.checkedItems.length; i++) {
              arr.push(input.checkedItems[i]['ValueMember']);
            }
            _target[column['binding']] = arr.join(',');
            let alterInput = <HTMLInputElement>document.getElementById("alterInput" + _lookup.key);
            alterInput.setAttribute("readonly", "");
            for (const source in _lookup.binding) {
              let arrBind = [];
              for (let i = 0; i < input.checkedItems.length; i++) {
                arrBind.push(input.checkedItems[i][source]);
              }
              let des = _lookup.binding[source];
              _target[des] = arrBind.join(',');
            }
          }
          else { //Dương fix ngày 13.04
            if (input.text)
              _value = input.selectedValue;
            else
              _value = '';

            if (_value != undefined) {
              _target[column['binding']] = _value;
              for (const source in _lookup.binding) {
                let des = _lookup.binding[source];
                if (_value != '')
                  _target[des] = input.itemsSource.items[input.itemsSource._idx][source];
                else
                  _target[des] = '';
              }
            }
          }
          this.refreshAfterEdit(flex, _target, args.col, [column['binding']].concat(this.bindingTargets(_lookup)));
        } else if (_col.dataType == 'Object') {
               if (!_col['isButton']) {
          let name = '';
          let _fileData = _target['Data']
          if (!filelabel.textContent.includes('Nhấn để chọn file')) {
            name = filelabel.textContent.trim();
          }

          if (name) {
            if (_fileData != null) {
              if (_fileData.name == name) return;
            }
            else {
              flex.setCellData(args.row, args.col, name);
              _target['Data'] = fileinput.files[0];
            }

          }
          else {
            flex.setCellData(args.row, args.col, '');
          }
               }

        } else if (_col.dataType === 'Date' && input.value == null && _col.isRequired !== true) {
          // Xóa ngày về null: Wijmo setCellData CHẶN null cho cột Date qua type-check
          // (changeType(null,Date)=null, getType(null)=Object != Date => return false),
          // nên ghi thẳng xuống record giống nhánh Array/Object để giá trị null được giữ lại.
          _target[_c['binding']] = null;
          this.refreshAfterEdit(flex, _target, args.col, [_c['binding']]);
        } else if (input.value != undefined)
          flex.setCellData(args.row, args.col, input.value);
        // this.filesUpload.i
      }
    };
    flex.cellEditEnding.removeHandler(editEndingEH);

    // subscribe the handler to the cellEditEnding event
    flex.cellEditEnding.addHandler(editEndingEH);

  }

  /** Danh sách cột đích mà lookup ghi giá trị sang (bindingList). */
  protected bindingTargets(lookup: any): string[] {
    let result: string[] = [];
    if (lookup && lookup.binding) {
      for (const source in lookup.binding) {
        if (lookup.binding[source]) result.push(lookup.binding[source]);
      }
    }
    return result;
  }

  /**
   * Cập nhật lưới sau khi ghi thẳng giá trị xuống record (bypass setCellData).
   *
   * Trước đây gọi thẳng itemsSource.refresh(). Với lưới có group, refresh() dựng lại
   * toàn bộ nhóm NGAY TRONG cellEditEnding => dòng đang sửa nhảy sang nhóm khác trước khi
   * cellEditEnded / evaluator kịp chạy => evaluator đọc ghi nhầm record.
   *
   * Nay: chỉ vẽ lại; nếu giá trị vừa ghi có tham gia khoá group thì hoãn việc gom nhóm lại
   * sang macrotask kế tiếp và đưa selection bám theo chính record đó.
   */
  protected refreshAfterEdit(flex: wjcGrid.FlexGrid, item: any, colIndex: number, touchedBindings: string[]) {
    let cv: any = flex.itemsSource;

    if (!GridRowUtil.hasGrouping(flex)) {
      if (cv && cv.refresh) cv.refresh();   // hành vi cũ, giữ nguyên cho lưới không group
      return;
    }

    flex.invalidate(true);

    if (GridRowUtil.affectsGrouping(flex, touchedBindings)) {
      setTimeout(() => {
        let _cv: any = flex.collectionView;
        if (!_cv) return;
        _cv.refresh();
        _cv.moveCurrentTo(item);
        let r = GridRowUtil.rowIndexOf(flex, item);
        if (r >= 0) flex.select(new wjcGrid.CellRange(r, colIndex), true);
      });
    }
  }

  /**
   * Cột được tính/hiển thị phía client, không tồn tại trong bảng hoặc view tương ứng.
   * Khai báo trên layout: childColumnsNotSave = { <chỉ số lưới>: ['Col1', 'Col2'] }.
   * Không khai báo -> luôn trả về false (giữ nguyên hành vi cũ cho mọi form khác).
   */
  protected isColumnNotSave(gridIndex: number, binding: string): boolean {
    let _config = this._layoutDeclare ? this._layoutDeclare['childColumnsNotSave'] : undefined;
    if (!_config || !binding) return false;

    let _columns = _config[gridIndex];
    return _columns instanceof Array && _columns.indexOf(binding) > -1;
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
        col.dataType = DataType.String;
        // copy properties from group
        for (var prop in group) {
          if (prop in col) {
            if (prop != 'dataType') {
              col[prop] = group[prop];
            }
            else {
              if (group[prop] != 'Array') {
                col[prop] = group[prop];
              }
            }
          }
        }

        // Cột ngày: chuẩn hóa isRequired về boolean để việc xóa về NULL hoạt động đúng theo khai báo layout.
        // - isRequired=true  -> col.isRequired=true  : Wijmo chặn commit null (cột bắt buộc, không cho clear).
        // - isRequired=false / KHÔNG khai báo -> col.isRequired=false (boolean) : setCellData cho phép ghi null.
        //   (Bắt buộc ép về boolean false vì nếu để undefined, type-check của Wijmo vẫn chặn null cho cột Date.)
        if (group.dataType === 'Date') {
          col.isRequired = (group.isRequired === true);
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

  protected commitPendingGridEdits() {
    if (!this.gridArray || this.gridArray.length == 0) return;

    for (let grid of this.gridArray) {
      if (!grid) continue;

      try {
        // 1) Đóng editor của ô đang gõ dở để giá trị được ghi xuống dòng.
        if (grid.finishEditing) grid.finishEditing();

        let cv: any = grid.itemsSource;
        if (!cv) continue;

        // 2) Chốt dòng đang sửa -> vào itemsEdited.
        if (cv.isEditingItem && cv.commitEdit) cv.commitEdit();

        // 3) Chốt dòng vừa thêm/dán -> vào sourceCollection + itemsAdded.
        if (cv.isAddingNew && cv.commitNew) cv.commitNew();
      }
      catch (ex) {
        console.log('commitPendingGridEdits', ex);
      }
    }
  }

  IsSubmit = false;
  protected async submit(formData: FormGroup, navigateUrl: any[], isApproveSend?: boolean, func?: Promise<void>) {
    if (this.isViewOnly)
      return;
    try {
      this.showLoading = true;

      this.commitPendingGridEdits();
      if (this.paramsRoute == 'copy')
        this.id = -1

      if (this.paramsRoute == 'split')
        this.id = -1

      if (isApproveSend == true) {
        this.editorFrm.controls['ApproveSend'].setValue(true);
      }

      if (this._layoutDeclare.serverUpdating)
        for (let command of this._layoutDeclare.serverUpdating) {
          if (formData.valid)
            await this.dfpanel.runConstraint(command).then();// => console.log(command + '- success'));
        }

      if (formData.invalid) {
        this.allowSendMail = false;
        this.showLoading = false;
        return false;
      }

      //////////////////////////////////////////////////////////
      if (!this._layoutDeclare.layout) {
        alert('Declare layout data');
        return;
      }

      let parentTableName = this._layoutDeclare.layout.Structure.Parent.Name;
      let isView = this._layoutDeclare.layout.Structure.Parent.IsView;

      if (!parentTableName) {
        alert('Parent Table Name is not declare');
        return;
      }
      this.IsSubmit = true;
      this._layoutDeclare.panels.forEach(panel => {
        panel.controls.forEach(control => {
          if (control instanceof UploadInput) {
            if (control.file)
              this.filesUpload.push(control.file);
          }
        })
      });

      this._layoutDeclare.panels.forEach(panel => {
        panel.controls.forEach(control => {
          if (control instanceof UploadImage) {
            if (control.file)
              this.imageUpload.push(control.file);
          }
        })
      });

      let _ds = new DataSetContract();

      let _tbParent = new TableContract(parentTableName);

      if (formData && formData.value) {

        for (let key in formData.value) {
          const _colContract = new ColumnContract();
          _colContract.ColumnName = key;

          _tbParent.Columns.push(_colContract);
        }

        for (let key in this.parentData) {
          if (!formData.contains(key)) {
            const _colContract = new ColumnContract();
            _colContract.ColumnName = key;

            _tbParent.Columns.push(_colContract);
          }
        }

        let _defaultValues = this.id > -1 ? {} : this._layoutDeclare.layout.Structure.Parent.DefaultValues;

        let _row = this.createRow(this.parentData, _defaultValues, formData.value, _tbParent.Columns);

        if (!this.id) {
          _row.RowState = DataRowState.Added;
        } else {
          if (this.id > -1) {
            _row.RowState = DataRowState.Modified;
          }
          else {
            _row.RowState = DataRowState.Added;
          }
        }

        if (this.paramsRoute == 'copy') {

          let newAsCopyLstParent = this._layoutDeclare.layout.Structure.Parent.ResetNewAsCopy.split(',');
          for (let _col in newAsCopyLstParent) {
            let _coltmp;
            if (newAsCopyLstParent[_col] == 'Id' || newAsCopyLstParent[_col] == 'CreatedBy' || newAsCopyLstParent[_col] == 'ModifiedBy') {

              _coltmp = _tbParent.Columns.find(col => col.ColumnName == newAsCopyLstParent[_col]);
              _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = -1;
            }
            else {
              _coltmp = _tbParent.Columns.find(col => col.ColumnName == newAsCopyLstParent[_col]);
              if (this.editorFrm.controls[_coltmp.ColumnName] != undefined) {

                if (this.editorFrm.controls[_coltmp.ColumnName] instanceof NumberBoxInput)
                  _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = 0;
                else
                  _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = '';
              }
              else {
                _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = '';
              }
            }
          }
        }

        if (this.paramsRoute == 'split') {

          let splitLstParent = this._layoutDeclare.layout.Structure.Parent.ResetWhenSplit.split(',')

          if (this._layoutDeclare.layout.Structure.Parent.CopyWhenSplit) {
            let copyValueWhenSplit = this._layoutDeclare.layout.Structure.Parent.CopyWhenSplit;

            for (let _w in copyValueWhenSplit) {
              let colFrom = copyValueWhenSplit[_w].FromColumn;
              let colTo = copyValueWhenSplit[_w].ToColumn;


              let _coltmp = _tbParent.Columns.find(col => col.ColumnName == colFrom);
              let _coltmp2 = _tbParent.Columns.find(col => col.ColumnName == colTo);

              _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp2)] = _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)];
            }
          }

          for (let _col in splitLstParent) {
            let _coltmp;
            if (splitLstParent[_col] == 'Id') {

              _coltmp = _tbParent.Columns.find(col => col.ColumnName == splitLstParent[_col]);
              _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = -1;
            }
            else {

              _coltmp = _tbParent.Columns.find(col => col.ColumnName == splitLstParent[_col])

              //_row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = '';

              if (this.editorFrm.controls[_coltmp.ColumnName] != undefined) {

                if (this.editorFrm.controls[_coltmp.ColumnName] instanceof NumberBoxInput)
                  _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = 0;
                else
                  _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = '';
              }
              else {
                _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = '';
              }
            }
          }

        }

        _tbParent.Rows.push(_row);

        if (this.id > -1) {
          let _coltmp = _tbParent.Columns.find(col => col.ColumnName == 'ModifiedBy');

          _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = Number(localStorage.getItem(SystemConstants.CURRENT_USERID));

          _coltmp = _tbParent.Columns.find(col => col.ColumnName == 'ModifiedAt');

          let today = new Date();
          let date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
          _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = date;

        }
        else {
          let _coltmp = _tbParent.Columns.find(col => col.ColumnName == 'CreatedBy');

          _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = Number(localStorage.getItem(SystemConstants.CURRENT_USERID));
        }

        if (!_ds.Tables.find(tb => tb.TableName == _tbParent.TableName)) {
          _ds.Tables.push(_tbParent);
        }
      }
      
      // if (this._layoutDeclare.layout.Structure.Child != undefined) {
      let childs = this._layoutDeclare.layout.Structure.Child;
      for (let i = 0; i < childs.length; i++) {
        if (childs[i].IsView == 'view') {
          continue;
        }
   
        if ((!childs[i].Name || !childs[i].ParentKey || !childs[i].ChildKey)) {
          continue;
        }

        let _tbChild = new TableContract(childs[i].Name);
        if (this.gridArray[i].columns) {
          for (let j = 0; j < this.gridArray[i].columns.length; j++) {
            // Cột chỉ để hiển thị (khai báo trong childColumnsNotSave) không có trong bảng/view -> không đưa vào payload lưu.
            if (this.isColumnNotSave(i, this.gridArray[i].columns[j].binding)) continue;
            let _colContract = new ColumnContract();
            _colContract.ColumnName = this.gridArray[i].columns[j].binding;
            // Gửi kèm DataType cho cột ngày: server tạo DataTable rỗng và suy kiểu cột từ dòng đầu;
            // nếu dòng đầu trống thì cột bị hiểu sai kiểu -> mất cả cột ngày khi lưu. Khai báo rõ để server không đoán.
            if (this.gridArray[i].columns[j].dataType == wjcCore.DataType.Date)
              _colContract.DataType = 'System.DateTime';

            _tbChild.Columns.push(_colContract);
          }
        }
        const _defaultValuesChild = childs[i].DefaultValues;

        for (const key in _defaultValuesChild) {
          let _colContract = new ColumnContract();
          _colContract.ColumnName = key as string;
          let _coltmp = _tbChild.Columns.find(col => col.ColumnName == key);
          if (_coltmp == undefined)
            _tbChild.Columns.push(_colContract);
        }

        if (this.gridArray[i]) {
          for (let j in this.gridArray[i].itemsSource.itemsRemoved[0]) {
            let _colContract = new ColumnContract();
            _colContract.ColumnName = j as string;
            let _coltmp = _tbChild.Columns.find(col => col.ColumnName == j);
            if (_coltmp == undefined)
              _tbChild.Columns.push(_colContract);
          }
          for (let j in this.gridArray[i].itemsSource.itemsEdited[0]) {
            let _colContract = new ColumnContract();
            _colContract.ColumnName = j as string;
            let _coltmp = _tbChild.Columns.find(col => col.ColumnName == j);
            if (_coltmp == undefined)
              _tbChild.Columns.push(_colContract);
          }
          for (let j in this.gridArray[i].itemsSource.itemsAdded[0]) {
            let _colContract = new ColumnContract();
            _colContract.ColumnName = j as string;
            let _coltmp = _tbChild.Columns.find(col => col.ColumnName == j);
            if (_coltmp == undefined)
              _tbChild.Columns.push(_colContract);
          }

        }

        if (this.paramsRoute == 'copy' && childs[i].ResetNewAsCopy != undefined) {
          this.gridArray[i].itemsSource.itemsAdded.clear();

          if (this.gridArray[i].itemsSource.items.length > 0) {
            for (let k = 0; k < this.gridArray[i].itemsSource.items.length; k++) {
              this.gridArray[i].itemsSource.itemsAdded.push(this.gridArray[i].itemsSource.items[k]);
            }
          }

          let newAsCopyLst = childs[i].ResetNewAsCopy.split(',')

          for (let _k = 0; _k < this.gridArray[i].itemsSource.itemsAdded.length; _k++) {
            for (let _col in newAsCopyLst) {
              if (newAsCopyLst[_col] == 'Id')
                this.gridArray[i].itemsSource.itemsAdded[_k][newAsCopyLst[_col]] = -1;
              else
                this.gridArray[i].itemsSource.itemsAdded[_k][newAsCopyLst[_col]] = ''
            }
          }

          for (let __k = 0; __k < this.gridArray[i].itemsSource.items.length; __k++) {
            for (let _col in newAsCopyLst) {
              if (newAsCopyLst[_col] == 'Id')
                this.gridArray[i].itemsSource.items[__k][newAsCopyLst[_col]] = -1;
              else
                this.gridArray[i].itemsSource.items[__k][newAsCopyLst[_col]] = ''
            }
          }

          this.gridArray[i].itemsSource.itemsEdited.clear();
          this.gridArray[i].itemsSource.itemsRemoved.clear();
        }

        if (this.paramsRoute == 'split') {
          this.gridArray[i].itemsSource.itemsAdded.clear();

          if (this.gridArray[i].itemsSource.items.length > 0) {
            for (let k = 0; k < this.gridArray[i].itemsSource.items.length; k++) {
              this.gridArray[i].itemsSource.itemsAdded.push(this.gridArray[i].itemsSource.items[k]);
            }
          }

          let splitLst = childs[i].ResetWhenSplit.split(',')

          for (let _k = 0; _k < this.gridArray[i].itemsSource.itemsAdded.length; _k++) {
            for (let _col in splitLst) {
              if (splitLst[_col] == 'Id')
                this.gridArray[i].itemsSource.itemsAdded[_k][splitLst[_col]] = -1;
              else
                this.gridArray[i].itemsSource.itemsAdded[_k][splitLst[_col]] = ''
            }
          }

          for (let __k = 0; __k < this.gridArray[i].itemsSource.items.length; __k++) {
            for (let _col in splitLst) {
              if (splitLst[_col] == 'Id')
                this.gridArray[i].itemsSource.items[__k][splitLst[_col]] = -1;
              else
                this.gridArray[i].itemsSource.items[__k][splitLst[_col]] = ''
            }
          }

          this.gridArray[i].itemsSource.itemsEdited.clear();
          this.gridArray[i].itemsSource.itemsRemoved.clear();
        }


        if (this.gridArray[i].itemsSource && this.gridArray[i].itemsSource.itemsAdded.length > 0) {
          for (let _n = 0; _n < this.gridArray[i].itemsSource.itemsAdded.length; _n++) {
            let added = this.gridArray[i].itemsSource.itemsAdded[_n];
            let _row = this.createRow(this.gridArray[i].itemsSource['defaultRow'], _defaultValuesChild, added, _tbChild.Columns, _tbParent.Rows[0], _tbParent.Columns, this.gridArray[i])
            _row.RowState = DataRowState.Added;

            _tbChild.Rows.push(_row);
          }
        }
        if (this.gridArray[i].itemsSource && this.gridArray[i].itemsSource.itemsEdited.length > 0) {
          for (let _n = 0; _n < this.gridArray[i].itemsSource.itemsEdited.length; _n++) {
            let edited = this.gridArray[i].itemsSource.itemsEdited[_n];
            let _row = this.createRow(this.gridArray[i].itemsSource['defaultRow'], _defaultValuesChild, edited, _tbChild.Columns, _tbParent.Rows[0], _tbParent.Columns, this.gridArray[i])
            _row.RowState = DataRowState.Modified;
            _tbChild.Rows.push(_row);
          }
        }
        if (this.gridArray[i].itemsSource && this.gridArray[i].itemsSource.itemsRemoved.length > 0) {
          for (let _n = 0; _n < this.gridArray[i].itemsSource.itemsRemoved.length; _n++) {
            let removed = this.gridArray[i].itemsSource.itemsRemoved[_n];
            let _row = this.createRow(this.gridArray[i].itemsSource['defaultRow'], _defaultValuesChild, removed, _tbChild.Columns, _tbParent.Rows[0], _tbParent.Columns, this.gridArray[i])
            _row.RowState = DataRowState.Deleted;
            _tbChild.Rows.push(_row);
          }
        }

        for (const row of _tbChild.Rows) {
          if (this.id > -1) {
            let _coltmp = _tbChild.Columns.find(col => col.ColumnName == 'ModifiedBy');

            row.CurrentItems[_tbChild.Columns.indexOf(_coltmp)] = Number(localStorage.getItem(SystemConstants.CURRENT_USERID));

            _coltmp = _tbChild.Columns.find(col => col.ColumnName == 'ModifiedAt');

            let today = new Date();
            let date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
            row.CurrentItems[_tbChild.Columns.indexOf(_coltmp)] = date;

          }
          else {
            let _coltmp = _tbChild.Columns.find(col => col.ColumnName == 'CreatedBy');

            row.CurrentItems[_tbChild.Columns.indexOf(_coltmp)] = Number(localStorage.getItem(SystemConstants.CURRENT_USERID));
          }
        }

        if (!_ds.Tables.find(tb => tb.TableName == _tbParent.TableName)) {
          _ds.Tables.push(_tbParent);
        }

        if (!_ds.Tables.find(tb => tb.TableName === _tbChild.TableName)) {
          _ds.Tables.push(_tbChild);
        }
      }
    let newChilds = this._layoutDeclare.layout.Structure.Child.filter(d=>d.IsView !== "view");
    this._layoutDeclare.layout.Structure.Child = newChilds;

      // } HUNG
      let data = await this._service.post({
        Layout: this._layoutDeclare.layout.Structure,
        EditorData: _ds
      }).toPromise();

      if (data instanceof Object) {
      }
      else {
        if (data != 'Deleted row information cannot be accessed through the row.') {
          alert(data);
          this.isLoading = false;
          return;
        }
      }
      //2201: xử lý view thành table
      try {
        if (this.id == -1 || this.id == undefined) {
          let _tbName = this._layoutDeclare.layout.Structure.Parent.Name;
          if (_tbName.startsWith('v')) {
            if (_tbName.indexOf('_') > - 1)
              _tbName = _tbName.substr(1, _tbName.indexOf('_') - 1);
            else
              _tbName = _tbName.substr(1, _tbName.length);
          }

          let _parent = data[_tbName][0];

          for (let key in _parent) {
            this.parentData[key] = _parent[key];
          }

          this.dfpanel.updateValueForm(_parent);
        }


        try {
          for (let grid of this.gridArray) {
            for (let row of grid.itemsSource.sourceCollection) {
              if (row['Data'] != undefined) {
                this.filesUpload.push(row['Data']);
              }
            }
          }
        }
        catch (e) { }

        this.upLoadFiles().then(async (result) => {
          // this.showLoading = true;
          // console.log(result);
          if (result) {
            let IsAttachParentFail = false;
            let ListIdDetail = Array<string>();

            let parentKey = '';
            let childs = this._layoutDeclare.layout.Structure.Child;
            let idxchild: number;
            for (let i = 0; i < childs.length; i++) {
              if (childs[i].Name = 'vB30BizDocDocument') {
                idxchild = i;
                parentKey = childs[i].ParentKey;
              }
            }

            for (let file of result) {
              if (file.exist == false) {
                if (file.fileName == this.parentData['FilePath']) {
                  IsAttachParentFail = true;
                } else {
                  for (let row of this.gridArray[idxchild].itemsSource.sourceCollection) {
                    if (row['FilePath'] == file.fileName) {
                      ListIdDetail.push(file.fileName);
                    }

                  }
                }
              }
            }

            const params = new Array<ParameterContract>();
            const param1 = new ParameterContract();
            const param2 = new ParameterContract();
            const param3 = new ParameterContract();
            const param4 = new ParameterContract();
            const param5 = new ParameterContract();
            const param6 = new ParameterContract();

            param1.ParameterName = this.convertParameterName('TableName');
            param1.ParameterValue = this._layoutDeclare.layout.Structure.Parent.Name;
            params.push(param1);


            param2.ParameterName = this.convertParameterName('ParentKeyName');
            param2.ParameterValue = parentKey;
            params.push(param2);

            param3.ParameterName = this.convertParameterName('Id');
            param3.ParameterValue = this.id;
            params.push(param3);

            param4.ParameterName = this.convertParameterName('ListIdDetail');
            param4.ParameterValue = ListIdDetail.join(',');
            params.push(param4);

            param5.ParameterName = this.convertParameterName('TableDetail');
            param5.ParameterValue = 'B30BizDocDocument';
            params.push(param5);

            param6.ParameterName = this.convertParameterName('IsAttachParentFail');
            param6.ParameterValue = IsAttachParentFail;
            params.push(param6);


            let _data = await this._service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Ctc_RemoveFilePath', params).toPromise();

            if (isApproveSend == false || isApproveSend == undefined || isApproveSend == null) {
              navigateUrl.push(this.parentData['Id']);
            }

            if (this._layoutDeclare.serverUpdated != undefined && this._layoutDeclare.serverUpdated.length > 0) {
              for (let i = 0; i < this._layoutDeclare.serverUpdated.length; i++) {
                await this.dfpanel.runConstraint(this._layoutDeclare.serverUpdated[i]).then(() => {
                  if (i == this._layoutDeclare.serverUpdated.length - 1) {
                    if (func == null || func == undefined) {
                      this.router.navigate(['main']).then(() => {
                        this.router.navigate(navigateUrl).then(() => {
                          if (navigateUrl.length > 3)
                            navigateUrl.pop();
                          this.IsSubmit = false;
                          // if (isApproveSend == false || isApproveSend == undefined || isApproveSend == null)
                          //   location.reload(false);
                        })
                      });
                    }
                    else {
                      func.then(() => {

                      });
                    }
                  }
                });
              }
            } else {
              this.router.navigate(['main']).then(() => {
                this.router.navigate(navigateUrl).then(() => {
                  if (navigateUrl.length > 3)
                    navigateUrl.pop();
                  this.IsSubmit = false;
                })
              });
            }
          }
        });
      }
      catch (ex) {
        alert("Xảy ra lỗi trong quá trình thực hiện");
        console.log('Submit error. ' + ex);
        this.router.navigate(['main']).then(() => {
          this.router.navigate(navigateUrl).then(() => {
            if (navigateUrl.length > 3)
              navigateUrl.pop();
          })
        });
      }
    }
    catch (ex) {
      alert("Xảy ra lỗi trong quá trình thực hiện.");
      console.log(ex);
    }
  }

  protected async submitNoUpdated(formData: FormGroup, navigateUrl: any[], isApproveSend?: boolean, func?: Promise<void>) {
    try {
      this.showLoading = true;
      if (this.paramsRoute == 'copy')
        this.id = -1

      if (this.paramsRoute == 'split')
        this.id = -1

      if (isApproveSend == true) {
        this.editorFrm.controls['ApproveSend'].setValue(true);
      }

      // if (this._layoutDeclare.serverUpdating)
      //   for (let command of this._layoutDeclare.serverUpdating) {
      //     if (formData.valid)
      //       await this.dfpanel.runConstraint(command).then();// => console.log(command + '- success'));
      //   }

      // if (formData.invalid) {
      //   this.allowSendMail = false;
      //   this.showLoading = false;
      //   return false;
      // }

      //////////////////////////////////////////////////////////
      if (!this._layoutDeclare.layout) {
        alert('Declare layout data');
        return;
      }

      let parentTableName = this._layoutDeclare.layout.Structure.Parent.Name;
      if (!parentTableName) {
        alert('Parent Table Name is not declare');
        return;
      }
      this.IsSubmit = true;
      this._layoutDeclare.panels.forEach(panel => {
        panel.controls.forEach(control => {
          if (control instanceof UploadInput) {
            if (control.file)
              this.filesUpload.push(control.file);
          }
        })
      });

      this._layoutDeclare.panels.forEach(panel => {
        panel.controls.forEach(control => {
          if (control instanceof UploadImage) {
            if (control.file)
              this.imageUpload.push(control.file);
          }
        })
      });

      let _ds = new DataSetContract();

      let _tbParent = new TableContract(parentTableName);

      if (formData && formData.value) {

        for (let key in formData.value) {
          const _colContract = new ColumnContract();
          _colContract.ColumnName = key;

          _tbParent.Columns.push(_colContract);
        }

        for (let key in this.parentData) {
          if (!formData.contains(key)) {
            const _colContract = new ColumnContract();
            _colContract.ColumnName = key;

            _tbParent.Columns.push(_colContract);
          }
        }

        let _defaultValues = this.id > -1 ? {} : this._layoutDeclare.layout.Structure.Parent.DefaultValues;

        let _row = this.createRow(this.parentData, _defaultValues, formData.value, _tbParent.Columns);

        if (!this.id) {
          _row.RowState = DataRowState.Added;
        } else {
          if (this.id > -1) {
            _row.RowState = DataRowState.Modified;
          }
          else {
            _row.RowState = DataRowState.Added;
          }
        }

        if (this.paramsRoute == 'copy') {

          let newAsCopyLstParent = this._layoutDeclare.layout.Structure.Parent.ResetNewAsCopy.split(',');
          for (let _col in newAsCopyLstParent) {
            let _coltmp;
            if (newAsCopyLstParent[_col] == 'Id' || newAsCopyLstParent[_col] == 'CreatedBy' || newAsCopyLstParent[_col] == 'ModifiedBy') {

              _coltmp = _tbParent.Columns.find(col => col.ColumnName == newAsCopyLstParent[_col]);
              _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = -1;
            }
            else {
              _coltmp = _tbParent.Columns.find(col => col.ColumnName == newAsCopyLstParent[_col]);
              if (this.editorFrm.controls[_coltmp.ColumnName] != undefined) {

                if (this.editorFrm.controls[_coltmp.ColumnName] instanceof NumberBoxInput)
                  _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = 0;
                else
                  _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = '';
              }
              else {
                _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = '';
              }
            }
          }
        }

        if (this.paramsRoute == 'split') {

          let splitLstParent = this._layoutDeclare.layout.Structure.Parent.ResetWhenSplit.split(',')

          if (this._layoutDeclare.layout.Structure.Parent.CopyWhenSplit) {
            let copyValueWhenSplit = this._layoutDeclare.layout.Structure.Parent.CopyWhenSplit;

            for (let _w in copyValueWhenSplit) {
              let colFrom = copyValueWhenSplit[_w].FromColumn;
              let colTo = copyValueWhenSplit[_w].ToColumn;


              let _coltmp = _tbParent.Columns.find(col => col.ColumnName == colFrom);
              let _coltmp2 = _tbParent.Columns.find(col => col.ColumnName == colTo);

              _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp2)] = _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)];
            }
          }

          for (let _col in splitLstParent) {
            let _coltmp;
            if (splitLstParent[_col] == 'Id') {

              _coltmp = _tbParent.Columns.find(col => col.ColumnName == splitLstParent[_col]);
              _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = -1;
            }
            else {

              _coltmp = _tbParent.Columns.find(col => col.ColumnName == splitLstParent[_col])

              //_row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = '';

              if (this.editorFrm.controls[_coltmp.ColumnName] != undefined) {

                if (this.editorFrm.controls[_coltmp.ColumnName] instanceof NumberBoxInput)
                  _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = 0;
                else
                  _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = '';
              }
              else {
                _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = '';
              }
            }
          }

        }

        _tbParent.Rows.push(_row);

        if (this.id > -1) {
          let _coltmp = _tbParent.Columns.find(col => col.ColumnName == 'ModifiedBy');

          _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = Number(localStorage.getItem(SystemConstants.CURRENT_USERID));

          _coltmp = _tbParent.Columns.find(col => col.ColumnName == 'ModifiedAt');

          let today = new Date();
          let date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
          _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = date;

        }
        else {
          let _coltmp = _tbParent.Columns.find(col => col.ColumnName == 'CreatedBy');

          _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = Number(localStorage.getItem(SystemConstants.CURRENT_USERID));
        }

        if (!_ds.Tables.find(tb => tb.TableName == _tbParent.TableName)) {
          _ds.Tables.push(_tbParent);
        }
      }

      // if (this._layoutDeclare.layout.Structure.Child != undefined) {
      let childs = this._layoutDeclare.layout.Structure.Child;
      for (let i = 0; i < childs.length; i++) {
        if (!childs[i].Name || !childs[i].ParentKey || !childs[i].ChildKey) {
          continue;
        }

        let _tbChild = new TableContract(childs[i].Name);
        if (this.gridArray[i].columns) {
          for (let j = 0; j < this.gridArray[i].columns.length; j++) {
            // Cột chỉ để hiển thị (khai báo trong childColumnsNotSave) không có trong bảng/view -> không đưa vào payload lưu.
            if (this.isColumnNotSave(i, this.gridArray[i].columns[j].binding)) continue;
            let _colContract = new ColumnContract();
            _colContract.ColumnName = this.gridArray[i].columns[j].binding;
            // Gửi kèm DataType cho cột ngày: server tạo DataTable rỗng và suy kiểu cột từ dòng đầu;
            // nếu dòng đầu trống thì cột bị hiểu sai kiểu -> mất cả cột ngày khi lưu. Khai báo rõ để server không đoán.
            if (this.gridArray[i].columns[j].dataType == wjcCore.DataType.Date)
              _colContract.DataType = 'System.DateTime';

            _tbChild.Columns.push(_colContract);
          }
        }
        const _defaultValuesChild = childs[i].DefaultValues;

        for (const key in _defaultValuesChild) {
          let _colContract = new ColumnContract();
          _colContract.ColumnName = key as string;
          let _coltmp = _tbChild.Columns.find(col => col.ColumnName == key);
          if (_coltmp == undefined)
            _tbChild.Columns.push(_colContract);
        }

        if (this.gridArray[i]) {
          for (let j in this.gridArray[i].itemsSource.itemsRemoved[0]) {
            let _colContract = new ColumnContract();
            _colContract.ColumnName = j as string;
            let _coltmp = _tbChild.Columns.find(col => col.ColumnName == j);
            if (_coltmp == undefined)
              _tbChild.Columns.push(_colContract);
          }
          for (let j in this.gridArray[i].itemsSource.itemsEdited[0]) {
            let _colContract = new ColumnContract();
            _colContract.ColumnName = j as string;
            let _coltmp = _tbChild.Columns.find(col => col.ColumnName == j);
            if (_coltmp == undefined)
              _tbChild.Columns.push(_colContract);
          }
          for (let j in this.gridArray[i].itemsSource.itemsAdded[0]) {
            let _colContract = new ColumnContract();
            _colContract.ColumnName = j as string;
            let _coltmp = _tbChild.Columns.find(col => col.ColumnName == j);
            if (_coltmp == undefined)
              _tbChild.Columns.push(_colContract);
          }

        }

        if (this.paramsRoute == 'copy' && childs[i].ResetNewAsCopy != undefined) {
          this.gridArray[i].itemsSource.itemsAdded.clear();

          if (this.gridArray[i].itemsSource.items.length > 0) {
            for (let k = 0; k < this.gridArray[i].itemsSource.items.length; k++) {
              this.gridArray[i].itemsSource.itemsAdded.push(this.gridArray[i].itemsSource.items[k]);
            }
          }

          let newAsCopyLst = childs[i].ResetNewAsCopy.split(',')

          for (let _k = 0; _k < this.gridArray[i].itemsSource.itemsAdded.length; _k++) {
            for (let _col in newAsCopyLst) {
              if (newAsCopyLst[_col] == 'Id')
                this.gridArray[i].itemsSource.itemsAdded[_k][newAsCopyLst[_col]] = -1;
              else
                this.gridArray[i].itemsSource.itemsAdded[_k][newAsCopyLst[_col]] = ''
            }
          }

          for (let __k = 0; __k < this.gridArray[i].itemsSource.items.length; __k++) {
            for (let _col in newAsCopyLst) {
              if (newAsCopyLst[_col] == 'Id')
                this.gridArray[i].itemsSource.items[__k][newAsCopyLst[_col]] = -1;
              else
                this.gridArray[i].itemsSource.items[__k][newAsCopyLst[_col]] = ''
            }
          }

          this.gridArray[i].itemsSource.itemsEdited.clear();
          this.gridArray[i].itemsSource.itemsRemoved.clear();
        }

        if (this.paramsRoute == 'split') {
          this.gridArray[i].itemsSource.itemsAdded.clear();

          if (this.gridArray[i].itemsSource.items.length > 0) {
            for (let k = 0; k < this.gridArray[i].itemsSource.items.length; k++) {
              this.gridArray[i].itemsSource.itemsAdded.push(this.gridArray[i].itemsSource.items[k]);
            }
          }

          let splitLst = childs[i].ResetWhenSplit.split(',')

          for (let _k = 0; _k < this.gridArray[i].itemsSource.itemsAdded.length; _k++) {
            for (let _col in splitLst) {
              if (splitLst[_col] == 'Id')
                this.gridArray[i].itemsSource.itemsAdded[_k][splitLst[_col]] = -1;
              else
                this.gridArray[i].itemsSource.itemsAdded[_k][splitLst[_col]] = ''
            }
          }

          for (let __k = 0; __k < this.gridArray[i].itemsSource.items.length; __k++) {
            for (let _col in splitLst) {
              if (splitLst[_col] == 'Id')
                this.gridArray[i].itemsSource.items[__k][splitLst[_col]] = -1;
              else
                this.gridArray[i].itemsSource.items[__k][splitLst[_col]] = ''
            }
          }

          this.gridArray[i].itemsSource.itemsEdited.clear();
          this.gridArray[i].itemsSource.itemsRemoved.clear();
        }


        if (this.gridArray[i].itemsSource && this.gridArray[i].itemsSource.itemsAdded.length > 0) {
          for (let _n = 0; _n < this.gridArray[i].itemsSource.itemsAdded.length; _n++) {
            let added = this.gridArray[i].itemsSource.itemsAdded[_n];
            let _row = this.createRow(this.gridArray[i].itemsSource['defaultRow'], _defaultValuesChild, added, _tbChild.Columns, _tbParent.Rows[0], _tbParent.Columns, this.gridArray[i])
            _row.RowState = DataRowState.Added;

            _tbChild.Rows.push(_row);
          }
        }
        if (this.gridArray[i].itemsSource && this.gridArray[i].itemsSource.itemsEdited.length > 0) {
          for (let _n = 0; _n < this.gridArray[i].itemsSource.itemsEdited.length; _n++) {
            let edited = this.gridArray[i].itemsSource.itemsEdited[_n];
            let _row = this.createRow(this.gridArray[i].itemsSource['defaultRow'], _defaultValuesChild, edited, _tbChild.Columns, _tbParent.Rows[0], _tbParent.Columns, this.gridArray[i])
            _row.RowState = DataRowState.Modified;
            _tbChild.Rows.push(_row);
          }
        }
        if (this.gridArray[i].itemsSource && this.gridArray[i].itemsSource.itemsRemoved.length > 0) {
          for (let _n = 0; _n < this.gridArray[i].itemsSource.itemsRemoved.length; _n++) {
            let removed = this.gridArray[i].itemsSource.itemsRemoved[_n];
            let _row = this.createRow(this.gridArray[i].itemsSource['defaultRow'], _defaultValuesChild, removed, _tbChild.Columns, _tbParent.Rows[0], _tbParent.Columns, this.gridArray[i])
            _row.RowState = DataRowState.Deleted;
            _tbChild.Rows.push(_row);
          }
        }

        for (const row of _tbChild.Rows) {
          if (this.id > -1) {
            let _coltmp = _tbChild.Columns.find(col => col.ColumnName == 'ModifiedBy');

            row.CurrentItems[_tbChild.Columns.indexOf(_coltmp)] = Number(localStorage.getItem(SystemConstants.CURRENT_USERID));

            _coltmp = _tbChild.Columns.find(col => col.ColumnName == 'ModifiedAt');

            let today = new Date();
            let date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
            row.CurrentItems[_tbChild.Columns.indexOf(_coltmp)] = date;

          }
          else {
            let _coltmp = _tbChild.Columns.find(col => col.ColumnName == 'CreatedBy');

            row.CurrentItems[_tbChild.Columns.indexOf(_coltmp)] = Number(localStorage.getItem(SystemConstants.CURRENT_USERID));
          }
        }

        if (!_ds.Tables.find(tb => tb.TableName == _tbParent.TableName)) {
          _ds.Tables.push(_tbParent);
        }

        if (!_ds.Tables.find(tb => tb.TableName === _tbChild.TableName)) {
          _ds.Tables.push(_tbChild);
        }
      }
      // }
      let data = await this._service.post({
        Layout: this._layoutDeclare.layout.Structure,
        EditorData: _ds
      }).toPromise();

      if (data instanceof Object) {
      }
      else {
        if (data != 'Deleted row information cannot be accessed through the row.') {
          alert(data);
          this.isLoading = false;
          return;
        }
      }
      //2201: xử lý view thành table
      try {
        if (this.id == -1 || this.id == undefined) {
          let _tbName = this._layoutDeclare.layout.Structure.Parent.Name;
          if (_tbName.startsWith('v')) {
            if (_tbName.indexOf('_') > - 1)
              _tbName = _tbName.substr(1, _tbName.indexOf('_') - 1);
            else
              _tbName = _tbName.substr(1, _tbName.length);
          }

          let _parent = data[_tbName][0];

          for (let key in _parent) {
            this.parentData[key] = _parent[key];
          }

          this.dfpanel.updateValueForm(_parent);
        }


        try {
          for (let grid of this.gridArray) {
            for (let row of grid.itemsSource.sourceCollection) {
              if (row['Data'] != undefined) {
                this.filesUpload.push(row['Data']);
              }
            }
          }
        }
        catch (e) { }

        this.upLoadFiles().then(async (result) => {
          this.showLoading = false;
          // console.log(result);
        });
      }
      catch (ex) {
        alert("Xảy ra lỗi trong quá trình thực hiện");
        console.log('Submit error. ' + ex);
        this.router.navigate(['main']).then(() => {
          this.router.navigate(navigateUrl).then(() => {
            if (navigateUrl.length > 3)
              navigateUrl.pop();
          })
        });
      }
    }
    catch (ex) {
      alert("Xảy ra lỗi trong quá trình thực hiện.");
      this.showLoading = false;
      console.log(ex);
    }
  }

  protected async submitXML(formData: FormGroup, navigateUrl: any[], isApproveSend?: boolean, func?: Promise<void>) {
    console.log('submitXML');
    if (this.paramsRoute == 'copy')
      this.id = -1

    if (this.paramsRoute == 'split')
      this.id = -1

    if (isApproveSend == true) {
      this.editorFrm.controls['ApproveSend'].setValue(true);
    }

    if (this._layoutDeclare.serverUpdating)
      for (let command of this._layoutDeclare.serverUpdating) {
        if (formData.valid)
          await this.dfpanel.runConstraint(command).then();// => console.log(command + '- success'));
      }

    if (formData.invalid) {
      this.allowSendMail = false;
      return;
    } else {
      this.showLoading = true;
    }

    //////////////////////////////////////////////////////////
    if (!this._layoutDeclare.layout) {
      alert('Declare layout data');
      return;
    }

    let parentTableName = this._layoutDeclare.layout.Structure.Parent.Name;
    if (!parentTableName) {
      alert('Parent Table Name is not declare');
      return;
    }
    this._layoutDeclare.panels.forEach(panel => {
      panel.controls.forEach(control => {
        if (control instanceof UploadInput) {
          if (control.file)
            this.filesUpload.push(control.file);
        }
      })
    });

    this._layoutDeclare.panels.forEach(panel => {
      panel.controls.forEach(control => {
        if (control instanceof UploadImage) {
          if (control.file)
            this.imageUpload.push(control.file);
        }
      })
    });

    let _ds = new DataSetContract();

    let _tbParent = new TableContract(parentTableName);

    if (formData && formData.value) {

      for (let key in formData.value) {
        const _colContract = new ColumnContract();
        _colContract.ColumnName = key;

        _tbParent.Columns.push(_colContract);
      }

      for (let key in this.parentData) {
        if (!formData.contains(key)) {
          const _colContract = new ColumnContract();
          _colContract.ColumnName = key;

          _tbParent.Columns.push(_colContract);
        }
      }

      let _defaultValues = this.id > -1 ? {} : this._layoutDeclare.layout.Structure.Parent.DefaultValues;
      let _row = this.createRow(this.parentData, _defaultValues, formData.value, _tbParent.Columns);

      if (!this.id) {
        _row.RowState = DataRowState.Added;
      } else {
        if (this.id > -1) {
          _row.RowState = DataRowState.Modified;
        }
        else {
          _row.RowState = DataRowState.Added;
        }
      }

      if (this.paramsRoute == 'copy') {

        let newAsCopyLstParent = this._layoutDeclare.layout.Structure.Parent.ResetNewAsCopy.split(',')
        for (let _col in newAsCopyLstParent) {
          let _coltmp;
          if (newAsCopyLstParent[_col] == 'Id') {

            _coltmp = _tbParent.Columns.find(col => col.ColumnName == newAsCopyLstParent[_col]);
            _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = -1;
          }
          else {
            _coltmp = _tbParent.Columns.find(col => col.ColumnName == newAsCopyLstParent[_col])

            _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = '';
          }
        }

      }

      if (this.paramsRoute == 'split') {

        let splitLstParent = this._layoutDeclare.layout.Structure.Parent.ResetWhenSplit.split(',')

        if (this._layoutDeclare.layout.Structure.Parent.CopyWhenSplit) {
          let copyValueWhenSplit = this._layoutDeclare.layout.Structure.Parent.CopyWhenSplit;

          for (let _w in copyValueWhenSplit) {
            let colFrom = copyValueWhenSplit[_w].FromColumn;
            let colTo = copyValueWhenSplit[_w].ToColumn;


            let _coltmp = _tbParent.Columns.find(col => col.ColumnName == colFrom);
            let _coltmp2 = _tbParent.Columns.find(col => col.ColumnName == colTo);

            _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp2)] = _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)];
          }
        }

        for (let _col in splitLstParent) {
          let _coltmp;
          if (splitLstParent[_col] == 'Id') {

            _coltmp = _tbParent.Columns.find(col => col.ColumnName == splitLstParent[_col]);
            _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = -1;
          }
          else {
            _coltmp = _tbParent.Columns.find(col => col.ColumnName == splitLstParent[_col])

            _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = '';
          }
        }

      }

      _tbParent.Rows.push(_row);


      if (this.id > -1) {
        let _coltmp = _tbParent.Columns.find(col => col.ColumnName == 'ModifiedBy');

        _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = Number(localStorage.getItem(SystemConstants.CURRENT_USERID));

        _coltmp = _tbParent.Columns.find(col => col.ColumnName == 'ModifiedAt');

        let today = new Date();
        let date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
        _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = date;

      }
      else {
        let _coltmp = _tbParent.Columns.find(col => col.ColumnName == 'CreatedBy');

        _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = Number(localStorage.getItem(SystemConstants.CURRENT_USERID));
      }

      if (!_ds.Tables.find(tb => tb.TableName == _tbParent.TableName)) {
        _ds.Tables.push(_tbParent);
      }
    }

    // if (this._layoutDeclare.layout.Structure.Child != undefined) {
    let childs = this._layoutDeclare.layout.Structure.Child;
    for (let i = 0; i < childs.length; i++) {
      if (!childs[i].Name || !childs[i].ParentKey || !childs[i].ChildKey) {
        continue;
      }

      let _tbChild = new TableContract(childs[i].Name);
      if (this.gridArray[i].columns) {
        for (let j = 0; j < this.gridArray[i].columns.length; j++) {
          // Cột chỉ để hiển thị (khai báo trong childColumnsNotSave) không có trong bảng/view -> không đưa vào payload lưu.
          if (this.isColumnNotSave(i, this.gridArray[i].columns[j].binding)) continue;
          let _colContract = new ColumnContract();
          _colContract.ColumnName = this.gridArray[i].columns[j].binding;
          // Gửi kèm DataType cho cột ngày: server tạo DataTable rỗng và suy kiểu cột từ dòng đầu;
          // nếu dòng đầu trống thì cột bị hiểu sai kiểu -> mất cả cột ngày khi lưu. Khai báo rõ để server không đoán.
          if (this.gridArray[i].columns[j].dataType == wjcCore.DataType.Date)
            _colContract.DataType = 'System.DateTime';

          _tbChild.Columns.push(_colContract);
        }
      }
      const _defaultValuesChild = childs[i].DefaultValues;

      for (const key in _defaultValuesChild) {
        let _colContract = new ColumnContract();
        _colContract.ColumnName = key as string;
        let _coltmp = _tbChild.Columns.find(col => col.ColumnName == key);
        if (_coltmp == undefined)
          _tbChild.Columns.push(_colContract);
      }

      if (this.gridArray[i]) {
        for (let j in this.gridArray[i].itemsSource.itemsRemoved[0]) {
          let _colContract = new ColumnContract();
          _colContract.ColumnName = j as string;
          let _coltmp = _tbChild.Columns.find(col => col.ColumnName == j);
          if (_coltmp == undefined)
            _tbChild.Columns.push(_colContract);
        }
        for (let j in this.gridArray[i].itemsSource.itemsEdited[0]) {
          let _colContract = new ColumnContract();
          _colContract.ColumnName = j as string;
          let _coltmp = _tbChild.Columns.find(col => col.ColumnName == j);
          if (_coltmp == undefined)
            _tbChild.Columns.push(_colContract);
        }
        for (let j in this.gridArray[i].itemsSource.itemsAdded[0]) {
          let _colContract = new ColumnContract();
          _colContract.ColumnName = j as string;
          let _coltmp = _tbChild.Columns.find(col => col.ColumnName == j);
          if (_coltmp == undefined)
            _tbChild.Columns.push(_colContract);
        }
        let _coltmp = _tbChild.Columns.find(col => col.ColumnName == 'RowState');
        if (_coltmp == undefined) {
          let _colContract = new ColumnContract();
          _colContract.ColumnName = 'RowState';
          _tbChild.Columns.push(_colContract);
        }
      }

      if (this.paramsRoute == 'copy') {
        this.gridArray[i].itemsSource.itemsAdded.clear();

        if (this.gridArray[i].itemsSource.items.length > 0) {
          for (let k = 0; k < this.gridArray[i].itemsSource.items.length; k++) {
            this.gridArray[i].itemsSource.itemsAdded.push(this.gridArray[i].itemsSource.items[k]);
          }
        }

        let newAsCopyLst = childs[i].ResetNewAsCopy.split(',')

        for (let _k = 0; _k < this.gridArray[i].itemsSource.itemsAdded.length; _k++) {
          for (let _col in newAsCopyLst) {
            if (newAsCopyLst[_col] == 'Id')
              this.gridArray[i].itemsSource.itemsAdded[_k][newAsCopyLst[_col]] = -1;
            else
              this.gridArray[i].itemsSource.itemsAdded[_k][newAsCopyLst[_col]] = ''
          }

        }

        for (let __k = 0; __k < this.gridArray[i].itemsSource.items.length; __k++) {
          for (let _col in newAsCopyLst) {
            if (newAsCopyLst[_col] == 'Id')
              this.gridArray[i].itemsSource.items[__k][newAsCopyLst[_col]] = -1;
            else
              this.gridArray[i].itemsSource.items[__k][newAsCopyLst[_col]] = ''
          }
        }

        this.gridArray[i].itemsSource.itemsEdited.clear();
        this.gridArray[i].itemsSource.itemsRemoved.clear();
      }

      if (this.paramsRoute == 'split') {
        this.gridArray[i].itemsSource.itemsAdded.clear();

        if (this.gridArray[i].itemsSource.items.length > 0) {
          for (let k = 0; k < this.gridArray[i].itemsSource.items.length; k++) {
            this.gridArray[i].itemsSource.itemsAdded.push(this.gridArray[i].itemsSource.items[k]);
          }
        }

        let splitLst = childs[i].ResetWhenSplit.split(',')

        for (let _k = 0; _k < this.gridArray[i].itemsSource.itemsAdded.length; _k++) {
          for (let _col in splitLst) {
            if (splitLst[_col] == 'Id')
              this.gridArray[i].itemsSource.itemsAdded[_k][splitLst[_col]] = -1;
            else
              this.gridArray[i].itemsSource.itemsAdded[_k][splitLst[_col]] = ''
          }
        }

        for (let __k = 0; __k < this.gridArray[i].itemsSource.items.length; __k++) {
          for (let _col in splitLst) {
            if (splitLst[_col] == 'Id')
              this.gridArray[i].itemsSource.items[__k][splitLst[_col]] = -1;
            else
              this.gridArray[i].itemsSource.items[__k][splitLst[_col]] = ''
          }
        }

        this.gridArray[i].itemsSource.itemsEdited.clear();
        this.gridArray[i].itemsSource.itemsRemoved.clear();
      }


      if (this.gridArray[i].itemsSource && this.gridArray[i].itemsSource.itemsAdded.length > 0) {
        for (let _n = 0; _n < this.gridArray[i].itemsSource.itemsAdded.length; _n++) {
          let added = this.gridArray[i].itemsSource.itemsAdded[_n];
          let _row = this.createRow(this.gridArray[i].itemsSource['defaultRow'], _defaultValuesChild, added, _tbChild.Columns, _tbParent.Rows[0], _tbParent.Columns, this.gridArray[i])
          _row.RowState = DataRowState.Added;
          _row.CurrentItems['RowState'] = 'Added';
          _tbChild.Rows.push(_row);
        }
      }
      if (this.gridArray[i].itemsSource && this.gridArray[i].itemsSource.itemsEdited.length > 0) {
        for (let _n = 0; _n < this.gridArray[i].itemsSource.itemsEdited.length; _n++) {
          let edited = this.gridArray[i].itemsSource.itemsEdited[_n];
          let _row = this.createRow(this.gridArray[i].itemsSource['defaultRow'], _defaultValuesChild, edited, _tbChild.Columns, _tbParent.Rows[0], _tbParent.Columns, this.gridArray[i])
          _row.RowState = DataRowState.Modified;
          _row.CurrentItems['RowState'] = 'Modified';
          _tbChild.Rows.push(_row);
        }
      }
      if (this.gridArray[i].itemsSource && this.gridArray[i].itemsSource.itemsRemoved.length > 0) {
        for (let _n = 0; _n < this.gridArray[i].itemsSource.itemsRemoved.length; _n++) {
          let removed = this.gridArray[i].itemsSource.itemsRemoved[_n];
          let _row = this.createRow(this.gridArray[i].itemsSource['defaultRow'], _defaultValuesChild, removed, _tbChild.Columns, _tbParent.Rows[0], _tbParent.Columns, this.gridArray[i])
          _row.RowState = DataRowState.Deleted;
          _row.CurrentItems['RowState'] = 'Deleted';
          _tbChild.Rows.push(_row);
        }
      }


      // //ở trên là như cách cũ lấy dòng dưới lưới cần thiết, ử dưới này là lấy tất cả theo a muốn
      // if (this.gridArray[i].itemsSource && this.gridArray[i].itemsSource.items.length > 0) {
      //   for (let _n = 0; _n < this.gridArray[i].itemsSource.items.length; _n++) {
      //     let items = this.gridArray[i].itemsSource.items[_n];
      //     let _row = this.createRow(this.gridArray[i].itemsSource['defaultRow'], _defaultValuesChild, items, _tbChild.Columns, _tbParent.Rows[0], _tbParent.Columns, this.gridArray[i])
      //     _row.RowState = DataRowState.Unchanged;
      //     _tbChild.Rows.push(_row);
      //   }
      // }

      for (const row of _tbChild.Rows) {
        if (this.id > -1) {
          let _coltmp = _tbChild.Columns.find(col => col.ColumnName == 'ModifiedBy');

          row.CurrentItems[_tbChild.Columns.indexOf(_coltmp)] = Number(localStorage.getItem(SystemConstants.CURRENT_USERID));

          _coltmp = _tbChild.Columns.find(col => col.ColumnName == 'ModifiedAt');

          let today = new Date();
          let date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
          row.CurrentItems[_tbChild.Columns.indexOf(_coltmp)] = date;

        }
        else {
          let _coltmp = _tbChild.Columns.find(col => col.ColumnName == 'CreatedBy');

          row.CurrentItems[_tbChild.Columns.indexOf(_coltmp)] = Number(localStorage.getItem(SystemConstants.CURRENT_USERID));
        }
      }

      if (!_ds.Tables.find(tb => tb.TableName == _tbParent.TableName)) {
        _ds.Tables.push(_tbParent);
      }

      if (!_ds.Tables.find(tb => tb.TableName === _tbChild.TableName)) {
        _ds.Tables.push(_tbChild);
      }
    }
    // }
    let data = await this._service.post({
      Layout: this._layoutDeclare.layout.Structure,
      EditorData: _ds
    }, true, this.id).toPromise();

    if (data instanceof Object) {
    }
    else {
      if (data != 'Deleted row information cannot be accessed through the row.') {
        alert(data);
        this.isLoading = false;
        return;
      }
    }
    //2201: xử lý view thành table
    try {
      if (this.id == -1 || this.id == undefined) {
        let _tbName = this._layoutDeclare.layout.Structure.Parent.Name;
        if (_tbName.startsWith('v')) {
          _tbName = _tbName.substr(1, _tbName.indexOf('_') - 1);
        }

        let _parent = data[_tbName][0];

        for (let key in _parent) {
          this.parentData[key] = _parent[key];
        }

        this.dfpanel.updateValueForm(_parent);
      }


      try {
        for (let grid of this.gridArray) {
          for (let row of grid.itemsSource.sourceCollection) {
            if (row['Data'] != undefined) {
              this.filesUpload.push(row['Data']);
            }
          }
        }
      }
      catch (e) { }

      this.upLoadFiles().then(async (result) => {
        // this.showLoading = true;
        console.log(result);
        if (result) {
          let IsAttachParentFail = false;
          let ListIdDetail = Array<string>();

          let parentKey = '';
          let childs = this._layoutDeclare.layout.Structure.Child;
          let idxchild: number;
          for (let i = 0; i < childs.length; i++) {
            if (childs[i].Name = 'vB30BizDocDocument') {
              idxchild = i;
              parentKey = childs[i].ParentKey;
            }
          }

          for (let file of result) {
            if (file.exist == false) {
              if (file.fileName == this.parentData['FilePath']) {
                IsAttachParentFail = true;
              } else {
                for (let row of this.gridArray[idxchild].itemsSource.sourceCollection) {
                  if (row['FilePath'] == file.fileName) {
                    ListIdDetail.push(file.fileName);
                  }

                }
              }
            }
          }

          const params = new Array<ParameterContract>();
          const param1 = new ParameterContract();
          const param2 = new ParameterContract();
          const param3 = new ParameterContract();
          const param4 = new ParameterContract();
          const param5 = new ParameterContract();
          const param6 = new ParameterContract();

          param1.ParameterName = this.convertParameterName('TableName');
          param1.ParameterValue = this._layoutDeclare.layout.Structure.Parent.Name;
          params.push(param1);


          param2.ParameterName = this.convertParameterName('ParentKeyName');
          param2.ParameterValue = parentKey;
          params.push(param2);

          param3.ParameterName = this.convertParameterName('Id');
          param3.ParameterValue = this.id;
          params.push(param3);

          param4.ParameterName = this.convertParameterName('ListIdDetail');
          param4.ParameterValue = ListIdDetail.join(',');
          params.push(param4);

          param5.ParameterName = this.convertParameterName('TableDetail');
          param5.ParameterValue = 'B30BizDocDocument';
          params.push(param5);

          param6.ParameterName = this.convertParameterName('IsAttachParentFail');
          param6.ParameterValue = IsAttachParentFail;
          params.push(param6);


          let _data = await this._service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Ctc_RemoveFilePath', params).toPromise();

          if (isApproveSend == false || isApproveSend == undefined || isApproveSend == null) {
            navigateUrl.push(this.parentData['Id']);
          }

          if (this._layoutDeclare.serverUpdated != undefined && this._layoutDeclare.serverUpdated.length > 0) {
            for (let i = 0; i < this._layoutDeclare.serverUpdated.length; i++) {
              await this.dfpanel.runConstraint(this._layoutDeclare.serverUpdated[i]).then(() => {
                if (i == this._layoutDeclare.serverUpdated.length - 1) {
                  if (func == null || func == undefined) {
                    this.router.navigate(['main']).then(() => {
                      this.router.navigate(navigateUrl).then(() => {
                        if (navigateUrl.length > 3)
                          navigateUrl.pop();

                        // if (isApproveSend == false || isApproveSend == undefined || isApproveSend == null)
                        //   location.reload(false);
                      })
                    });
                  }
                  else {
                    func.then(() => {

                    });
                  }
                }
              });
            }
          } else {
            this.router.navigate(['main']).then(() => {
              this.router.navigate(navigateUrl).then(() => {
                if (navigateUrl.length > 3)
                  navigateUrl.pop();
              })
            });
          }
        }
      });
    }
    catch (ex) {
      console.log('Submit error. ' + ex);
      this.router.navigate(['main']).then(() => {
        this.router.navigate(navigateUrl).then(() => {
          if (navigateUrl.length > 3)
            navigateUrl.pop();
        })
      });
    }

    // this.showLoading = false;
  }

  protected async submitChild(formData: FormGroup) {

    if (this._layoutDeclare.serverUpdating)
      for (let command of this._layoutDeclare.serverUpdating) {
        if (formData.valid)
          await this.dfpanel.runConstraint(command).then();// => console.log(command + '- success'));
      }

    if (formData.invalid) {
      return;
    } else {
      this.showLoading = true;
    }

    //////////////////////////////////////////////////////////
    if (!this._layoutDeclare.layout) {
      alert('Declare layout data');
      return;
    }

    let parentTableName = this._layoutDeclare.layout.Structure.Parent.Name;
    if (!parentTableName) {
      alert('Parent Table Name is not declare');
      return;
    }
    this._layoutDeclare.panels.forEach(panel => {
      panel.controls.forEach(control => {
        if (control instanceof UploadInput) {
          if (control.file)
            this.filesUpload.push(control.file);
        }
      })
    });

    this._layoutDeclare.panels.forEach(panel => {
      panel.controls.forEach(control => {
        if (control instanceof UploadImage) {
          if (control.file)
            this.imageUpload.push(control.file);
        }
      })
    });

    let _ds = new DataSetContract();

    let _tbParent = new TableContract(parentTableName);

    if (formData && formData.value) {
      for (let key in formData.value) {
        const _colContract = new ColumnContract();
        _colContract.ColumnName = key;

        _tbParent.Columns.push(_colContract);
      }

      for (let key in this.parentData) {
        if (!formData.contains(key)) {
          const _colContract = new ColumnContract();
          _colContract.ColumnName = key;

          _tbParent.Columns.push(_colContract);
        }
      }

      let _defaultValues = this.id > -1 ? {} : this._layoutDeclare.layout.Structure.Parent.DefaultValues;
      let _row = this.createRow(this.parentData, _defaultValues, formData.value, _tbParent.Columns);

      if (!this.id) {
        _row.RowState = DataRowState.Added;
      } else {
        if (this.id > -1) {
          _row.RowState = DataRowState.Modified;
        }
        else {
          _row.RowState = DataRowState.Added;
        }
      }

      _tbParent.Rows.push(_row);


      if (this.id > -1) {
        let _coltmp = _tbParent.Columns.find(col => col.ColumnName == 'ModifiedBy');

        _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = Number(localStorage.getItem(SystemConstants.CURRENT_USERID));

        _coltmp = _tbParent.Columns.find(col => col.ColumnName == 'ModifiedAt');

        let today = new Date();
        let date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
        _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = date;

      }
      else {
        let _coltmp = _tbParent.Columns.find(col => col.ColumnName == 'CreatedBy');

        _row.CurrentItems[_tbParent.Columns.indexOf(_coltmp)] = Number(localStorage.getItem(SystemConstants.CURRENT_USERID));
      }

      if (!_ds.Tables.find(tb => tb.TableName == _tbParent.TableName)) {
        _ds.Tables.push(_tbParent);
      }
    }

    // if (this._layoutDeclare.layout.Structure.Child != undefined) {
    let childs = this._layoutDeclare.layout.Structure.Child;
    for (let i = 0; i < childs.length; i++) {
      if (!childs[i].Name || !childs[i].ParentKey || !childs[i].ChildKey) {
        continue;
      }

      let _tbChild = new TableContract(childs[i].Name);
      if (this.gridArray[i].columns) {
        for (let j = 0; j < this.gridArray[i].columns.length; j++) {
          // Cột chỉ để hiển thị (khai báo trong childColumnsNotSave) không có trong bảng/view -> không đưa vào payload lưu.
          if (this.isColumnNotSave(i, this.gridArray[i].columns[j].binding)) continue;
          let _colContract = new ColumnContract();
          _colContract.ColumnName = this.gridArray[i].columns[j].binding;
          // Gửi kèm DataType cho cột ngày: server tạo DataTable rỗng và suy kiểu cột từ dòng đầu;
          // nếu dòng đầu trống thì cột bị hiểu sai kiểu -> mất cả cột ngày khi lưu. Khai báo rõ để server không đoán.
          if (this.gridArray[i].columns[j].dataType == wjcCore.DataType.Date)
            _colContract.DataType = 'System.DateTime';

          _tbChild.Columns.push(_colContract);
        }
      }
      const _defaultValuesChild = childs[i].DefaultValues;

      for (const key in _defaultValuesChild) {
        let _colContract = new ColumnContract();
        _colContract.ColumnName = key as string;
        let _coltmp = _tbChild.Columns.find(col => col.ColumnName == key);
        if (_coltmp == undefined)
          _tbChild.Columns.push(_colContract);
      }

      if (this.gridArray[i]) {
        for (let j in this.gridArray[i].itemsSource.itemsRemoved[0]) {
          let _colContract = new ColumnContract();
          _colContract.ColumnName = j as string;
          let _coltmp = _tbChild.Columns.find(col => col.ColumnName == j);
          if (_coltmp == undefined)
            _tbChild.Columns.push(_colContract);
        }
        for (let j in this.gridArray[i].itemsSource.itemsEdited[0]) {
          let _colContract = new ColumnContract();
          _colContract.ColumnName = j as string;
          let _coltmp = _tbChild.Columns.find(col => col.ColumnName == j);
          if (_coltmp == undefined)
            _tbChild.Columns.push(_colContract);
        }
        for (let j in this.gridArray[i].itemsSource.itemsAdded[0]) {
          let _colContract = new ColumnContract();
          _colContract.ColumnName = j as string;
          let _coltmp = _tbChild.Columns.find(col => col.ColumnName == j);
          if (_coltmp == undefined)
            _tbChild.Columns.push(_colContract);
        }

      }


      if (this.gridArray[i].itemsSource && this.gridArray[i].itemsSource.itemsAdded.length > 0) {
        for (let _n = 0; _n < this.gridArray[i].itemsSource.itemsAdded.length; _n++) {
          let added = this.gridArray[i].itemsSource.itemsAdded[_n];
          let _row = this.createRow(this.gridArray[i].itemsSource['defaultRow'], _defaultValuesChild, added, _tbChild.Columns, _tbParent.Rows[0], _tbParent.Columns, this.gridArray[i])
          _row.RowState = DataRowState.Added;

          _tbChild.Rows.push(_row);
        }
      }
      if (this.gridArray[i].itemsSource && this.gridArray[i].itemsSource.itemsEdited.length > 0) {
        for (let _n = 0; _n < this.gridArray[i].itemsSource.itemsEdited.length; _n++) {
          let edited = this.gridArray[i].itemsSource.itemsEdited[_n];
          let _row = this.createRow(this.gridArray[i].itemsSource['defaultRow'], _defaultValuesChild, edited, _tbChild.Columns, _tbParent.Rows[0], _tbParent.Columns, this.gridArray[i])
          _row.RowState = DataRowState.Modified;
          _tbChild.Rows.push(_row);
        }
      }
      if (this.gridArray[i].itemsSource && this.gridArray[i].itemsSource.itemsRemoved.length > 0) {
        for (let _n = 0; _n < this.gridArray[i].itemsSource.itemsRemoved.length; _n++) {
          let removed = this.gridArray[i].itemsSource.itemsRemoved[_n];
          let _row = this.createRow(this.gridArray[i].itemsSource['defaultRow'], _defaultValuesChild, removed, _tbChild.Columns, _tbParent.Rows[0], _tbParent.Columns, this.gridArray[i])
          _row.RowState = DataRowState.Deleted;
          _tbChild.Rows.push(_row);
        }
      }

      for (const row of _tbChild.Rows) {
        if (this.id > -1) {
          let _coltmp = _tbChild.Columns.find(col => col.ColumnName == 'ModifiedBy');

          row.CurrentItems[_tbChild.Columns.indexOf(_coltmp)] = Number(localStorage.getItem(SystemConstants.CURRENT_USERID));

          _coltmp = _tbChild.Columns.find(col => col.ColumnName == 'ModifiedAt');

          let today = new Date();
          let date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
          row.CurrentItems[_tbChild.Columns.indexOf(_coltmp)] = date;

        }
        else {
          let _coltmp = _tbChild.Columns.find(col => col.ColumnName == 'CreatedBy');

          row.CurrentItems[_tbChild.Columns.indexOf(_coltmp)] = Number(localStorage.getItem(SystemConstants.CURRENT_USERID));
        }
      }

      if (!_ds.Tables.find(tb => tb.TableName == _tbParent.TableName)) {
        _ds.Tables.push(_tbParent);
      }

      if (!_ds.Tables.find(tb => tb.TableName === _tbChild.TableName)) {
        _ds.Tables.push(_tbChild);
      }
    }
    // }
    let data = await this._service.post({
      Layout: this._layoutDeclare.layout.Structure,
      EditorData: _ds
    }).toPromise();

    if (data instanceof Object) {
    }
    else {
      if (data != 'Deleted row information cannot be accessed through the row.') {
        alert(data);
        this.isLoading = false;
        return;
      }
    }
    //2201: xử lý view thành table
    try {
      if (this.id == -1 || this.id == undefined) {
        let _tbName = this._layoutDeclare.layout.Structure.Parent.Name;
        if (_tbName.startsWith('v')) {
          _tbName = _tbName.substr(1, _tbName.indexOf('_') - 1);
        }

        let _parent = data[_tbName][0];

        for (let key in _parent) {
          this.parentData[key] = _parent[key];
        }

        this.dfpanel.updateValueForm(_parent);
      }

      if (this._layoutDeclare.serverUpdated != undefined && this._layoutDeclare.serverUpdated.length > 0) {
        for (let i = 0; i < this._layoutDeclare.serverUpdated.length; i++) {
          await this.dfpanel.runConstraint(this._layoutDeclare.serverUpdated[i]).then(() => {
            if (i == this._layoutDeclare.serverUpdated.length - 1) {
            }
          });
        }
      }

    }
    catch (ex) {
      console.log('Submit error. ' + ex);
    }

    this.showLoading = false;
  }

  createRow(schemaRow: any, defaultRow: any, valueRow: any, columns: any, parentRow?: RowContract, parentColumns?: ColumnContract[], flex?: wjcGrid.FlexGrid): RowContract {
    // this.parentData, _defaultValues, formData.value, _tbParent.Columns

    let _row = new RowContract();

    _row.CurrentItems = new Array<any>();

    for (let _nCol = 0; _nCol < columns.length; _nCol++) {

      let value = schemaRow[columns[_nCol].ColumnName];

      let value2 = defaultRow ? defaultRow[columns[_nCol].ColumnName] : undefined;

      if (parentRow && parentColumns)
        value2 = this.updateFromParent(value2, parentRow, parentColumns);

      let value3 = valueRow[columns[_nCol].ColumnName];

      if (value2 != undefined && value2 != null) {
        value = value2;
      }

      if (value3 != undefined && value3 != null) {
        value = value3;
      }

      if ((value instanceof Date) || (value2 instanceof Date) || (value3 instanceof Date)) {
        if (value2 !== undefined) value = value2;
        if (value3 !== undefined) value = value3;
      }

      if (columns[_nCol].ColumnName == 'BuiltinOrder' && flex != undefined && flex != null) {
        let index = flex.itemsSource._view.indexOf(valueRow);
        value = index + 1;
      }

      if (columns[_nCol].ColumnName == 'FilePath') {
        let _value = <string>value;
        for (let file of this.filesUpload) {
          if (_value.includes(file.name)) {
            value = file.name;
            break;
          }
        }
      }

      if (columns[_nCol].ColumnName == 'ImagePath') {
        let _value = <string>value;
        for (let file of this.imageUpload) {
          if (_value.includes(file.name)) {
            value = file.name;
            break;
          }
        }
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
          // value = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
        }
      }

      _row.CurrentItems.push(value);
    }

    return _row;
  }

  upLoadFiles() {
    if (this.filesUpload.length > 0) {
      return this._service.upLoad(this.filesUpload, this.editorFrm.controls['ProductCostId'].value.toString() + '\\' + this.folderName, this.parentData['Id']).toPromise();
    }
    else if (this.imageUpload.length > 0) {
      return this._service.upLoadImage(this.imageUpload, this.zCommandKey).toPromise();
    }
    return Promise.resolve('Upload files ok');
  }

  // upLoadFiles() {
  //   if (this.filesUpload.length > 0) {
  //     let prosub = this._service.uploadProgress.subscribe(
  //       data => {
  //           let progress = (Math.round(data * 100) / 100).toString() + '%';
  //           console.log(progress);
  //           if (data == 100) {
  //               setTimeout(() => {
  //               }, 300);
  //           }
  //       }, error => {
  //       }
  //     );
  //     this.subscription.add(prosub);
  //     return this._service.upLoadNew(this.filesUpload, this.editorFrm.controls['ProductCostId'].value.toString() + '\\' + this.folderName, this.parentData['Id']).toPromise();
  //   }
  //   else if (this.imageUpload.length > 0) {
  //     return this._service.upLoadImage(this.imageUpload, this.zCommandKey).toPromise();
  //   }
  //   return Promise.resolve('Upload files ok');
  // }

  translateAutoText(zExpr: any): any {
    if (!zExpr) { return zExpr; }

    const _jsonData = localStorage.getItem(SystemConstants.CURRENT_USER);
    const _staticData: BravoSiteStorage = JSON.parse(_jsonData);

    if (typeof zExpr === 'string') {
      if (zExpr.startsWith('{VAR=')) {
        const _field = zExpr.substring(5, zExpr.indexOf('}', 0));
        return !_staticData[_field] ? zExpr : _staticData[_field];
      }
    }

    return zExpr;
  }

  updateFromParent(zExpr: string, pRow: RowContract, pCol: ColumnContract[]) {
    if (typeof zExpr === 'string' && zExpr.startsWith('Parent.')) {
      const _field = zExpr.substring(7);
      const _n = pCol.findIndex(col => col.ColumnName === _field);

      return pRow.CurrentItems[_n];
    }

    return zExpr;
  }

  // tslint:disable-next-line:member-ordering
  protected _controlCollection: InputBase<any>[] = [];
  public get controlCollection(): InputBase<any>[] {
    this._layoutDeclare.panels.forEach(panel => {
      panel.controls.forEach(lk => {
        this._controlCollection.push(lk);
      });
    });

    return this._controlCollection;
  }

  isLoading = false;
  taidulieu: boolean = false;
  //Thêm dialog
  confirmDialog() {
    if (this.editorFrm.valid) {
      this.showDialog = true;
    }
  }
  //Hết Thêm dialog
  async onClick(state?: any) {
    try {
      this.showDialog = false;//Thêm dialog

      if (this.editorFrm.valid) {
        this.showLoading = true;
        this.taidulieu = true;
      }

      for (let command of this._layoutDeclare.buttonLoadChild) {
        if (this.editorFrm.valid)
          await this.dfpanel.runConstraint(command).then();
      }

      this.showLoading = false;
    }
    catch (ex) {
      alert("Xảy ra lỗi trong quá trình thực hiện");
      console.log(ex);
      this.showLoading = false;
    }
  }

  //Thêm dialog
  closeDialog() {
    this.showDialog = false;
  }
  //Hết Thêm dialog

  async onClickNoneValid(state?: any) {
    this.showDialog = false;//Thêm dialog
    if (this.editorFrm.valid)
      this.showLoading = true;
    for (let command of this._layoutDeclare.buttonLoadChild) {
      await this.dfpanel.runConstraint(command).then();
    }

    this.showLoading = false;
  }

  async import(table: string, folder: string) {
    if (this.editorFrm.valid) {
      let input = document.getElementById('importControl');
      if (input instanceof HTMLInputElement) {
        let fileImport = [];
        if (input.files.length <= 0) return;
        this.showLoading = true;
        fileImport.push(input.files[0]);
        // console.log(this.filesUpload);
        await this._service.import(fileImport, folder, table, this.editorFrm.get("ProductCostId").value, Global.convertConfig('{VAR=User.UserName}'), Global.convertConfig('{VAR=Branch.Ma_Dvcs}'));
        await this.dfpanel.runConstraint('Evaluator_ServerConstraint_LoadDataImport').then(async () => {
          // let _event = new wjcGrid.FormatItemEventArgs(new wjcGrid.GridPanel(this.gridArray[0], wjcGrid.CellType.Cell, this.gridArray[0].rows, this.gridArray[0].columns, this.gridArray[0].hostElement), this.gridArray[0].viewRange, this.gridArray[0].cells.getCellElement(0, 0));
          if (this._layoutDeclare.importCommand.length > 0)
            for (let command of this._layoutDeclare.importCommand) {
              if (this.editorFrm.valid)
                await this.dfpanel.runConstraint(command, undefined, null).then(() => console.log(command + ' ..success'));
            }
        });
        this.showLoading = false;
      }
    }
  }

  //khóa sort ngày
  sort(column: string, gridIndex: number, ascending: boolean) {
    // if (this.gridArray[gridIndex].itemsSource) {
    //   var sd = new SortDescription(column, ascending);
    //   let ds: CollectionView = this.gridArray[gridIndex].itemsSource;
    //   ds.sortDescriptions.push(sd);
    //   this.gridArray[gridIndex].itemsSource.refresh();
    // }
  }

  //zoom
  protected isVisiblePanel = true;
  onclickCollapsablePanel(gridtmp: wjcGrid.FlexGrid[]) {
    if (this.isVisiblePanel) {
      this.isVisiblePanel = false;

      for (let i in gridtmp) {
        gridtmp[i].columns.clear();
        switch (this.gridArray.indexOf(gridtmp[i])) {
          case 0:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns, 0);
            break;
          case 1:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns1, 0);
            break;
          case 2:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns2, 0);
            break;
          case 3:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns3, 0);
            break;
          case 4:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns4, 0);
            break;
          case 5:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns5, 0);
            break;
          case 6:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns6, 0);
            break;
          case 7:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns7, 0);
            break;
          case 8:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns8, 0);
            break;
          case 9:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns9, 0);
            break;
          case 10:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns10, 0);
            break;
        }
      }
    }
    else {
      this.isVisiblePanel = true;
      for (let i in gridtmp) {
        gridtmp[i].columns.clear();
        switch (this.gridArray.indexOf(gridtmp[i])) {
          case 0:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns, 0);
            break;
          case 1:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns1, 0);
            break;
          case 2:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns2, 0);
            break;
          case 3:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns3, 0);
            break;
          case 4:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns4, 0);
            break;
          case 5:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns5, 0);
            break;
          case 6:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns6, 0);
            break;
          case 7:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns7, 0);
            break;
          case 8:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns8, 0);
            break;
          case 9:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns9, 0);
            break;
          case 10:
            this.createColumnGroups(gridtmp[i], this._layoutDeclare.childColumns10, 0);
            break;
        }
      }
    }
  }


  resetBuiltinOrder(grid: wjcGrid.FlexGrid) {
    let colSort = this._layoutDeclare.layout.Structure.Child[this.dfpanel.gridArray.indexOf(grid)].Sort;
    // Bỏ qua dòng nhóm: nếu đánh số theo chỉ số lưới thì GroupRow cũng chiếm một số thứ tự.
    let _no = 0;
    for (let i = 0; i < grid.rows.length - 1; i++) {
      if (GridRowUtil.itemOf(grid, i) == null) continue;
      grid.setCellData(i, colSort, ++_no);
    }
  }

  async rowAddedEvent(grid: wjcGrid.FlexGrid) {
    let declares = this._layoutDeclare.rowAdded;
    if (!declares || declares.length <= 0) return;

    // Tra cứu theo Tables (chỉ số lưới) thay vì theo vị trí trong mảng rowAdded:
    // nếu chỉ khai báo cho lưới 0 mà sự kiện đến từ lưới 1 thì trước đây sẽ ném TypeError.
    let gridIndex = this.dfpanel.gridArray.indexOf(grid);
    let declare = declares.find((d: any) => Number(d['Tables']) === gridIndex);
    if (!declare) declare = declares[gridIndex];
    if (!declare || !declare['Evaluators']) return;

    for (let rowadd of declare['Evaluators']) {
      await this.dfpanel.runConstraint(rowadd, undefined, null).then(() => console.log(rowadd + ' ..success'));
    }
  }

  // ==========================================================================
  // Menu chuột phải trên lưới: chèn dòng tại vị trí bất kỳ
  //
  // Cách dùng trên template:
  //   <wj-flex-grid ... (contextmenu)="openRowContextMenu($event, grid)">
  // và đặt khối menu (xem plansignstatus-editor.component.html) ở cuối template.
  //
  // Dòng chèn thêm sẽ được chép sẵn giá trị của DÒNG ĐANG ĐỨNG (dòng bấm chuột phải)
  // theo đúng khai báo EvaluatorCopiedValues trong rowAdded của Layout.
  // ==========================================================================

  rowMenuVisible: boolean = false;
  rowMenuStyle: any = {};
  protected _rowMenuGrid: any = null;
  protected _rowMenuRowIndex: number = -1;

  private _rowMenuDismiss = (evt?: any) => {
    if (evt && evt.type === 'keydown' && evt.key !== 'Escape') return;
    this.hideRowMenu();
  };

  openRowContextMenu(evt: MouseEvent, grid: wjcGrid.FlexGrid) {
    evt.preventDefault();
    evt.stopPropagation();

    if (!grid) return;

    const ht = grid.hitTest(evt);

    // Chỉ mở menu khi bấm phải vào vùng ô dữ liệu (bỏ qua header và dòng nhóm).
    if (!ht || ht.cellType !== wjcGrid.CellType.Cell || ht.row < 0 ||
      GridRowUtil.itemOf(grid, ht.row) == null) {
      this.hideRowMenu();
      return;
    }

    this._rowMenuGrid = grid;
    this._rowMenuRowIndex = ht.row;

    try {
      grid.select(new wjcGrid.CellRange(ht.row, 0, ht.row, grid.columns.length - 1), true);
    } catch (e) { }

    this.rowMenuStyle = { left: `${evt.clientX}px`, top: `${evt.clientY}px` };
    this.rowMenuVisible = true;

    // Đăng ký lắng nghe để đóng menu; chỉ tồn tại khi menu đang mở nên không ảnh
    // hưởng hiệu năng của các màn hình không dùng tính năng này.
    setTimeout(() => {
      document.addEventListener('click', this._rowMenuDismiss);
      document.addEventListener('keydown', this._rowMenuDismiss);
    }, 0);
  }

  hideRowMenu() {
    document.removeEventListener('click', this._rowMenuDismiss);
    document.removeEventListener('keydown', this._rowMenuDismiss);
    this.rowMenuVisible = false;
    this._rowMenuGrid = null;
    this._rowMenuRowIndex = -1;
  }

  /** Chèn dòng mới NGAY TRÊN dòng đang đứng. */
  onInsertRowAtCursor() {
    let grid = this._rowMenuGrid, row = this._rowMenuRowIndex;
    this.hideRowMenu();
    if (grid && row >= 0) this.insertRowAt(grid, row, false);
  }

  /** Chèn dòng mới NGAY DƯỚI dòng đang đứng. */
  onInsertRowBelowCursor() {
    let grid = this._rowMenuGrid, row = this._rowMenuRowIndex;
    this.hideRowMenu();
    if (grid && row >= 0) this.insertRowAt(grid, row, true);
  }

  /** Xóa dòng đang đứng (dùng lại deleteSelectedRows sẵn có). */
  onDeleteRowAtCursor() {
    let grid = this._rowMenuGrid, row = this._rowMenuRowIndex;
    this.hideRowMenu();
    if (!grid || row < 0) return;

    try {
      grid.select(new wjcGrid.CellRange(row, 0, row, 0), true);
    } catch (e) { }
    this.deleteSelectedRows(grid);
  }

  /**
   * Chèn một dòng mới cạnh dòng lưới `gridRowIndex`.
   *
   * @param below false = chèn phía trên dòng đang đứng, true = chèn phía dưới.
   *
   * Lưu ý về chỉ số: `gridRowIndex` là CHỈ SỐ DÒNG CỦA LƯỚI, còn thao tác splice phải dùng
   * chỉ số trong sourceCollection — hai giá trị này lệch nhau khi lưới có group.
   */
  protected insertRowAt(grid: wjcGrid.FlexGrid, gridRowIndex: number, below: boolean) {
    if (!grid || !grid.collectionView) return;

    const view: any = grid.collectionView;
    const src = view.sourceCollection;
    if (!Array.isArray(src)) return;

    // Dòng đang đứng = nguồn để chép dữ liệu.
    let sourceItem = GridRowUtil.itemOf(grid, gridRowIndex);
    if (sourceItem == null) return;

    let at = src.indexOf(sourceItem);
    if (at < 0) at = src.length; else if (below) at = at + 1;

    // 1. Dựng dòng mới từ cấu trúc mặc định của bảng con.
    let newItem: any = view['defaultRow'] ? JSON.parse(JSON.stringify(view['defaultRow'])) : {};
    newItem['Id'] = -1;
    if (this.parentData && this.parentData['Stt'] != undefined) {
      newItem['Stt'] = this.parentData['Stt'];
    }

    // 2. Chép giá trị từ dòng đang đứng, CHỈ những cột được khai báo ở EvaluatorCopiedValues.
    //    Làm TRƯỚC khi refresh để dòng mới rơi vào đúng nhóm của dòng nguồn.
    let gridIndex = this.dfpanel.gridArray.indexOf(grid);
    this.dfpanel.applyCopiedValues(gridIndex, newItem, sourceItem, this.copiedValueEvaluators(gridIndex));

    // 3. Chèn và đánh dấu là dòng thêm mới để submit() nhận diện.
    if (at > src.length) at = src.length;
    src.splice(at, 0, newItem);
    if (view.trackChanges && view.itemsAdded) {
      view.itemsAdded.push(newItem);
    }
    view.refresh();

    // 4. Đưa con trỏ về dòng vừa chèn (tìm lại theo record vì group có thể đã đổi vị trí).
    setTimeout(() => {
      let r = GridRowUtil.rowIndexOf(grid, newItem);
      if (r < 0) return;
      try {
        grid.select(new wjcGrid.CellRange(r, 0, r, 0), true);
        grid.scrollIntoView(r, 0);
        grid.startEditing(false);
      } catch (e) { }
    }, 50);
  }

  /** Tên các evaluator EvaluatorCopiedValues khai báo trong rowAdded của lưới. */
  protected copiedValueEvaluators(gridIndex: number): string[] {
    let declares = this._layoutDeclare.rowAdded;
    if (!declares || declares.length <= 0 || gridIndex < 0) return [];

    let declare = declares.find((d: any) => Number(d['Tables']) === gridIndex);
    if (!declare) declare = declares[gridIndex];
    return (declare && declare['Evaluators']) ? declare['Evaluators'] : [];
  }

  setDisplayPanel() {
    let styles = {
      'display': this.isVisiblePanel ? 'block' : 'none'
    };
    return styles;
  }

  setHeightGrid() {

    let height = {
      'height': this.isVisiblePanel ? Math.round(screen.height / 2).toString() + 'px' : Math.round((screen.height / 4) * 3).toString() + 'px'
    };

    return height;
  }

  private translate_expr(expr) {
    if (!expr) { return expr; }
    let _result = expr;
    let controls: string[] = [];
    for (const control in this.editorFrm.controls) {
      controls.push(control);
    }
    for (const control in this.parentData) {
      if (!this.editorFrm.contains(control)) {
        controls.push(control);
      }
    }
    controls.sort((a, b) => b.length - a.length);

    for (const control of controls) {
      let patern = '{EXPR=' + control + '}';

      if (_result.indexOf(patern) > -1) {
        let value
        if (this.editorFrm.contains(control))
          value = this.editorFrm[control].value;
        else
          value = this.parentData[control];

        do {
          _result = _result.replace(patern, value);
        }
        while (_result.indexOf(patern) > -1)
      }
    }
    // console.log(_result);
    return _result;
  }

  closeWindow() {
    window.close();
  }

  @ViewChild('importPopup') importPopup: Popup
  @ViewChild('importNumber') importNumber: wjcInput.WjInputNumber;
  @ViewChild('importGrid') importGrid: wjcGrid.FlexGrid;

  importExcel() {
    let fileInput = <HTMLInputElement>document.getElementById('importControl');
    if (fileInput.files[0]) {
      wjcGridXlsx.FlexGridXlsxConverter.load(this.importGrid, fileInput.files[0], { includeColumnHeaders: true });
    }
  }

  openDialog() {
    let pop = this.importPopup;
    this.importNumber.placeholder = 'Start Row';
    pop.show();
    let fileInput = <HTMLInputElement>document.getElementById('importControl');
    fileInput.click();

    this.importGrid.allowAddNew = false;
    this.importGrid.rowHeaders.columns[0].width = 43;
    this.importGrid.selectionMode = wjcGrid.SelectionMode.RowRange;
  }

  async updateImportTo(gridtmp: wjcGrid.FlexGrid) {

    let rows = this.importGrid.rows;
    let cols = this.importGrid.columns;
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

    if (rows.length > 0) {
      let startRow = this.importNumber.value - 1;
      startRow = startRow < 0 ? 0 : startRow;
      //
      for (let r = startRow; r < rows.length; r++) {
        let row = {};
        let defines = 0;
        for (var c = 0; c < cols.length; c++) {
          let _v = this.importGrid.getCellData(r, c, false);
          let col = gridtmp.columns.getColumn(this.importGrid.columns[c].header);

          if (col != null)
            // if (col.dataType == wjcCore.DataType.Date && _v) {
            //   let date = new Date(_v);
            //   _v = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            //   row[col.binding] = _v;
            // }
            if (col.dataType == wjcCore.DataType.Date) {
              // Cột Date: đọc bền vững -> luôn ra Date hợp lệ hoặc null (DB cho phép NULL).
              // Wijmo suy luận kiểu cột importGrid theo Ô ĐẦU TIÊN; nếu ô đầu trống, cột bị gán sai kiểu
              // và các ô ngày bên dưới có thể trả về số serial Excel / chuỗi -> parser strict cũ biến thành null,
              // gây mất cả cột. importCellToDate xử lý mọi dạng (Date / số serial / '#dd/MM/yyyy').
              row[col.binding] = this.importCellToDate(_v);
            }
            else {
              row[col.binding] = _v
            }

          if (col != null)
            if (row[col.binding] && row[col.binding] != null) {
              defines++;
            }
        }
        if (defines >= 2) {
          ds.itemsAdded.push(row);
          ds.sourceCollection.push(row);
        }
      }

      for (let column of gridtmp.itemsSource['defaultRow']) {
        for (let row of gridtmp.itemsSource.sourceCollection) {
          if (row[column] == null || row[column] == undefined) {
            //boom Dương 09052018
            let _v = gridtmp.itemsSource['defaultRow'][column];
            if (gridtmp.columns[column].dataType == wjcCore.DataType.Date) {
              let date = _v;
              _v = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
              row[column] = _v;
            }
            else
              row[column] = _v;
          }
        }
      }
      // ds.sourceCollection = data;
    }
    else
      gridtmp.itemsSource.sourceCollection = [];

    gridtmp.itemsSource.refresh();
    this.fixSourceCollection(gridtmp);

    if (this._layoutDeclare.importCommand.length > 0)
      for (let command of this._layoutDeclare.importCommand) {
        if (this.editorFrm.valid) {
          try {
            await this.dfpanel.runConstraint(command, undefined, null).then(() => console.log(command + ' ..success'));
          } catch (exception) {

          }
        }
      }

    this.importPopup.hide();
  }

  deleteImportRow() {
    let selected = [];

    //let _idrowdel = flex.selectedRows[0]._idx;

    for (let k in this.importGrid.selectedRows) {
      let _idrowdel = this.importGrid.selectedRows[k]._idx;
      for (var i = 0; i < this.importGrid.rows.length; i++) {
        if (i == _idrowdel) {
          selected.push(this.importGrid.rows[i]);
          break;
        }
      }
    }
    for (let i = 0; i < selected.length; i++) {
      this.importGrid.rows.remove(selected[i]);
    }
  }

  fixSourceCollection(gridtmp: wjcGrid.FlexGrid) {
    let data = gridtmp.itemsSource.sourceCollection;
    for (let r = 0; r < data.length; r++) {
      for (let c = 0; c < gridtmp.columns.length; c++) {
        let _value = data[r][gridtmp.columns[c].binding];
        if (gridtmp.columns[c].dataType == wjcCore.DataType.Number) {
          _value = Number(_value);
          if (isNaN(_value)) {
            gridtmp.itemsSource.sourceCollection[r][gridtmp.columns[c].binding] = 0;
          } else {
            gridtmp.itemsSource.sourceCollection[r][gridtmp.columns[c].binding] = _value;

          }
        } else if (gridtmp.columns[c].dataType == wjcCore.DataType.Boolean) {
          _value = Boolean(_value);

          if (!_value) {
            data[r][gridtmp.columns[c].binding] = false;
          } else {
            data[r][gridtmp.columns[c].binding] = _value;

          }
        }
      }
    }
    gridtmp.itemsSource.refresh();

  }

  // Đọc giá trị ô ngày khi import về Date (UTC midnight) hoặc null, không phụ thuộc kiểu cột mà Wijmo suy luận.
  // Xử lý cả 3 dạng có thể xảy ra: Date object, số serial Excel, và chuỗi theo quy định '#dd/MM/yyyy'.
  importCellToDate(v: any): Date {
    if (v == null || v === '') return null;
    if (v instanceof Date)
      return isNaN(v.getTime()) ? null : new Date(Date.UTC(v.getFullYear(), v.getMonth(), v.getDate()));
    // Số serial Excel (số ngày kể từ 1899-12-30) - xảy ra khi Wijmo gán sai kiểu cột do ô đầu tiên trống.
    if (typeof v === 'number' && !isNaN(v)) {
      let d = new Date(Date.UTC(1899, 11, 30) + Math.round(v) * 86400000);
      return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    }
    // Chuỗi theo quy định '#dd/MM/yyyy' (chấp nhận thiếu '#' / khoảng trắng để bền hơn, vẫn hiểu dd/MM/yyyy).
    let a = /^#?\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*$/.exec('' + v);
    return a ? new Date(Date.UTC(+a[3], +a[2] - 1, +a[1])) : null;
  }

  //boom của Khoa, chạy evalutator khi truyền tham số sang Editor
  inputParams() {

    let _parameters = this._layoutDeclare.panels[0].controls;

    this.inputs = [];
    _parameters.forEach(param => {
      // console.log(param);
      switch (param.className) {
        case 'LookupBoxInput':
          let _lb = new LookupBoxInput({
            key: param.key,
            label: param.label,
            lookupKey: param['lookupKey'],
            lookupfilter: param['lookupfilter'],
            hideValueMember: false
          }, this._service, null);

          this.inputs.push(_lb);
          break;

        case 'DateBoxInput':
          let _db = new DateBoxInput({
            key: param.key,
            label: param.label,
            type: 'date',
            format: 'dd/MM/yyyy',
          });

          this.inputs.push(_db);
          break;

        default:
          let _tb = new TextBoxInput({
            key: param.key,
            label: param.label,
            type: 'text'
          })

          this.inputs.push(_tb);
          break;
      }
    });
  }

  //Kit: 27/03/2018: Đưa in vào editor đặt hàng Quý Đỗ
  //08/03/2018: In chứng từ

  convertParameterName(pzName: string) {
    const DbParamPrefixOld = '@_';
    const DbParamPrefix = '@';

    return pzName.startsWith(DbParamPrefixOld) || pzName.startsWith(DbParamPrefix) ?
      pzName : DbParamPrefixOld + pzName;
  }

  async printVoucher(input: string, layoutName: string = 'MAU1', gridForm?: wjcGrid.FlexGrid, extInput?: string, extVar?: string) {

    let _command = this._layoutDeclare.layout.PrintDocument.Command;

    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = input;
    params.push(param1);

    if (extInput != '' && extInput != undefined && extInput != null) {
      param2.ParameterName = this.convertParameterName(extVar);
      param2.ParameterValue = extInput;
      params.push(param2);
    }

    let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, _command, params)
      .toPromise().then();

    let _htmlDetail = ''
    if (this.gridPrint) {
      this.dataPrint = new wjcCore.CollectionView(_data['data']);
      this.gridPrint.itemsSource = new wjcCore.CollectionView(_data['data']);
      _htmlDetail = this.renderTable(this.gridPrint);
    }

    let _htmlDetailForm = ''
    if (gridForm) {
      _htmlDetailForm = this.renderTable(gridForm);
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

    if (_html.toString().indexOf('{VAR=BravoDetailForm}') > -1) {
      _html = _html.replace(/{VAR=BravoDetailForm}/gi, _htmlDetailForm);
    }

    _html += '</body></html>'
    return _html;
  }

  async printVoucher_WordFlow(input: string, layoutName: string = 'MAU1', gridForm?: wjcGrid.FlexGrid, extInput?: string, extVar?: string) {

    let _command = this._layoutDeclare.layout.PrintDocument.Command_WorkFlow;

    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = input;
    params.push(param1);

    if (extInput != '' && extInput != undefined && extInput != null) {
      param2.ParameterName = this.convertParameterName(extVar);
      param2.ParameterValue = extInput;
      params.push(param2);
    }

    let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, _command, params)
      .toPromise().then();

    let _htmlDetail = ''
    if (this.gridPrint) {
      this.dataPrint = new wjcCore.CollectionView(_data['data']);
      this.gridPrint.itemsSource = new wjcCore.CollectionView(_data['data']);
      _htmlDetail = this.renderTable(this.gridPrint);
    }

    let _htmlDetailForm = ''
    if (gridForm) {
      _htmlDetailForm = this.renderTable(gridForm);
    }

    this.outputPrint = <Array<Object>>(_data['output']);

    let _title;
    // for (let lo of this._layoutDeclare.layout.PrintDocument.LayoutPrint) {
    //   if (lo['Layout'] == layoutName) {
    //     _title = lo['FileName'];
    //   }
    // }

    if (_title == '' || _title == null || _title == undefined) {
      _title = this._layoutDeclare.layout.PrintDocument.Text;
    }

    let _html = `<html>
    <head>
      <title>`+ this.translate_output(_title, this.outputPrint) + `</title>
     </head>`;
    _html += '<body onload="window.print();window.close()">';


    _html += this.translate_output(this._layoutPrinter_WordFlow[0][layoutName], this.outputPrint);

    if (_html.toString().indexOf('{VAR=BravoDetail}') > -1) {
      _html = _html.replace(/{VAR=BravoDetail}/gi, _htmlDetail);
    }

    if (_html.toString().indexOf('{VAR=BravoDetailForm}') > -1) {
      _html = _html.replace(/{VAR=BravoDetailForm}/gi, _htmlDetailForm);
    }

    _html += '</body></html>'
    return _html;
  }

  async exportHtml_WorkFlow(name: string, fileName: string, folderPath: string, _idTT?: number, extInput?: string, extVar?: string) {
    this.showLoading = true;

    let _command = this._layoutDeclare.layout.PrintDocument.Command_WorkFlow;

    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    if (_idTT != undefined && _idTT != null && _idTT > 0)
      param1.ParameterValue = _idTT
    else
      param1.ParameterValue = this.id
    params.push(param1);

    if (extInput != '' && extInput != undefined && extInput != null) {
      param2.ParameterName = this.convertParameterName(extVar);
      param2.ParameterValue = extInput;
      params.push(param2);
    }


    let ctor1 = CryptoExtension.encrypt(_command);
    const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

    let body = {
      "storeName": ctor1,
      "params": ctor2
    }

    this._service.exportHtml(folderPath + name, body).subscribe(data => {

      //     let _htmlDetail = ''
      //     if (this.gridPrint) {
      //         this.dataPrint = new wjcCore.CollectionView(data['data']);
      //         this.gridPrint.itemsSource = new wjcCore.CollectionView(data['data']);
      //         _htmlDetail = this.renderTable(this.gridPrint);
      //     }
      this.outputPrint = <Array<Object>>(data['output']);

      let _title = fileName;

      if (_title == '' || _title == null || _title == undefined) {
        _title = this._layoutDeclare.layout.PrintDocument.Text;
      }

      let _html = `<html>
    <head>
    <title>`+ this.translate_output(_title, this.outputPrint) + `</title>
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

  translate_output(expr, row: any) {
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
    var tbl = '<table style="border-spacing: 0px; border-top: solid 1px black;border-left: solid 1px black;">';

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

  exportEditor(title: string) {
    let workbook = <wjcXlsx.Workbook>Global.createWorkBook(title, this._layoutDeclare.panels[0].controls, this.editorFrm.value, this.gridArray[0]);
    workbook.save(title + '.xlsx');
  }

  // getPermission(commandKey: string, option: string) {
  //   return Global.getPermission(commandKey, option);
  // }

  setPermission(data: any, data2: any) {
    this.isPermisionEdiAll_isSave = Global.getPermissionAll(data, data2, this.zCommandKey, 'IsSave');
    this.isPermisionEdiAll_isApprove = Global.getPermissionAll(data, data2, this.zCommandKey, 'IsApprove');
    this.isPermisionEdiAll_isExport = Global.getPermissionAll(data, data2, this.zCommandKey, 'IsExport');
    this.isPermisionEdiAll_isPrint = Global.getPermissionAll(data, data2, this.zCommandKey, 'IsPrint');
  }

  ///SEND MAIL EDITOR

  protected completedApprove: any;
  async sendMail(data: any, docCode?: string, id?: number, isAttachFiles: boolean = false, _state?: any) {
    this.subscription = new Subscription();

    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();
    const param4 = new ParameterContract();
    const param5 = new ParameterContract();
    const param6 = new ParameterContract();
    const param7 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('ProductCostId');
    param1.ParameterValue = data.controls['ProductCostId'].value;
    params.push(param1);

    param2.ParameterName = Global.convertParameterName('nUserId');
    param2.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID);
    params.push(param2);

    // if (data.controls['ItemGroupCode'] != undefined) {
    //   param3.ParameterName = Global.convertParameterName('ItemGroupCode');
    //   param3.ParameterValue = data.controls['ItemGroupCode'].value;
    //   params.push(param3);
    // }
    // else {
    //   param3.ParameterName = Global.convertParameterName('ItemGroupCode');
    //   param3.ParameterValue = '';
    //   params.push(param3);
    // }

    param4.ParameterName = Global.convertParameterName('DocCode');
    param4.ParameterValue = docCode;
    params.push(param4);

    param5.ParameterName = Global.convertParameterName('Id');
    param5.ParameterValue = id;
    params.push(param5);

    param6.ParameterName = Global.convertParameterName('BranchCode');
    param6.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
    params.push(param6);

    param7.ParameterName = Global.convertParameterName('State');
    param7.ParameterValue = _state;
    params.push(param7);

    let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Coteccons_GetInfoSendMail', params)
      .toPromise().then();

    let _commnetHtml = _data['output']['@_Comment'];
    let _configMail = _data['data'];

    if (_configMail[0]['EmailTo'] != undefined) {
      if (_configMail.length > 0) {
        this.SendMailObject.from = _configMail[0]['EmailAddress'];
        this.SendMailObject.to = _configMail[0]['EmailTo'];
        this.SendMailObject.cc = _configMail[0]['EmailCC'];
        this.SendMailObject.subject = _configMail[0]['Subject'];
        //this.SendMailObject.plainTextMessage = _configMail[0]['Content'];
        this.SendMailObject.nameSend = _configMail[0]['UserName'];
        this.SendMailObject.mailType = _configMail[0]['MailType'];

        this.SendMailObject.smtpOptions.server = _configMail[0]['EmailServerName'];
        this.SendMailObject.smtpOptions.useSsl = Boolean(_configMail[0]['EmailServerEnable_SSL']);
        this.SendMailObject.smtpOptions.port = Number(_configMail[0]['EmailServerPort']);
        this.SendMailObject.smtpOptions.user = _configMail[0]['EmailAccountName'];
        this.SendMailObject.smtpOptions.password = _configMail[0]['usc'];
        this.SendMailObject.smtpOptions.requiresAuthentication = _configMail[0]['IsRequiresAuthen'];
        this.SendMailObject.mailToken = localStorage.getItem(SystemConstants.MAIL_TOKEN).replace(/"/gi, '');

        if (isAttachFiles) {
          let file = { source: '', des: '' };
          file.des = data.controls['ProductCostId'].value + '/' + this.folderNameSendMail + '/' + id + '/' + data.controls['DocNo'].value.replace(/\//gi, '-') + '.pdf';
          file.source = _configMail[0]['TemplatePath'];
          this.SendMailObject.files.push(file);

          if (_configMail[0]['NumOfAttachFile'])
            for (let index = 0; index < Number(_configMail[0]['NumOfAttachFile']); index++) {
              let file1 = { source: '', des: '' };
              if (_configMail[0]['AttachFile' + index] !== '' && _configMail[0]['AttachFile' + index] !== undefined) {
                file1.des = data.controls['ProductCostId'].value + '/' + this.folderNameSendMail + '/' + id + '/' + _configMail[0]['AttachFile' + index];
                file1.source = '';
                this.SendMailObject.files.push(file1);
              }
            }

          const params = new Array<ParameterContract>();
          const param1 = new ParameterContract();
          const param2 = new ParameterContract();

          param1.ParameterName = Global.convertParameterName('Id');
          param1.ParameterValue = id;
          params.push(param1);

          param2.ParameterName = Global.convertParameterName('DocCode');
          param2.ParameterValue = docCode;
          params.push(param2);
       
          let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, _configMail[0]['Command'], params)
            .toPromise().then();

          //this.SendMailObject.replacement = _data['output'];

          let ctor1 = CryptoExtension.encrypt(_configMail[0]['Command']);
          const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

          let exportOption = {
            "storeName": ctor1,
            "params": ctor2
          }
          this.SendMailObject.exportOption = exportOption;
        }

        //fill file
        let ctor1 = CryptoExtension.encrypt('usp_Coteccons_GetInfoSendMail');
        const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));
        let emailBodyTemplate: string = _configMail[0]['EmailBody']
    
        let body = {
          "storeName": ctor1,
          "params": ctor2
        }

        let completedApprove = _configMail[0]['CompletedApprove'];
        // let operationCode = _configMail[0]['OperationCode'];
        let docCode1 = _configMail[0]['DocCode'];
        let _html: any;
    
        if (_state != undefined && _state == '0') {
          await this._service.exportHtml(emailBodyTemplate, body).toPromise().then(data => {
            _html = data['html'];

            if (_html.toString().indexOf('______________________________') > -1) {
              if (_commnetHtml != '' && _commnetHtml != undefined && _commnetHtml != null) {
                _html = _html.replace(/______________________________/gi, _commnetHtml);
              }
              else {
                _html = _html.replace(/______________________________/gi, ' .');
              }
            }
            this.SendMailObject.htmlMessage = _html;

            let arrTo = this.SendMailObject.to.split(';');
            if (arrTo.length == 1) {
              if (localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '') == 'A01') {
                const sub = this._service.sendMailNotAuthen(Global.MailEndPoint, this.SendMailObject).subscribe();
                this.subscription.add(sub);
              }
              else {
                const sub = this._service.sendMailApi(Global.MailEndPoint, this.SendMailObject).subscribe((result) => {
                });
                //const sub = this._service.sendMail(Global.MailEndPoint, this.SendMailObject).subscribe();
                this.subscription.add(sub);
              }
            }
            else if (arrTo.length > 1) {
              if (localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '') == 'A01') {
                const sub = this._service.sendMailNotAuthen(Global.MailEndPoint, this.SendMailObject).subscribe();
                this.subscription.add(sub);
              }
              else {
                const sub = this._service.sendMailApi(Global.MailEndPoint, this.SendMailObject).subscribe((result) => {
                });
                //const sub = this._service.sendMailToMulti(Global.MailEndPoint, this.SendMailObject).subscribe();
                this.subscription.add(sub);
              }
            }
          });
          console.log('JobReturn');
        }
        else
          if (completedApprove == false || completedApprove == 0 || completedApprove == '0') {
            console.log('JobRemind');
            await this._service.exportHtml(emailBodyTemplate, body).toPromise().then(data => {
              _html = data['html'];

              if (_html.toString().indexOf('______________________________') > -1) {
                if (_commnetHtml != '' && _commnetHtml != undefined && _commnetHtml != null) {
                  _html = _html.replace(/______________________________/gi, _commnetHtml);
                }
                else {
                  _html = _html.replace(/______________________________/gi, ' .');
                }
              }
              this.SendMailObject.htmlMessage = _html;

              let arrTo = this.SendMailObject.to.split(';');
              if (arrTo.length == 1) {
                if (localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '') == 'A01') {
                  const sub = this._service.sendMailNotAuthen(Global.MailEndPoint, this.SendMailObject).subscribe();
                  this.subscription.add(sub);
                }
                else {
                  const sub = this._service.sendMailApi(Global.MailEndPoint, this.SendMailObject).subscribe((result) => {
                  });
                  //const sub = this._service.sendMail(Global.MailEndPoint, this.SendMailObject).subscribe();
                  this.subscription.add(sub);
                }
              }
              else if (arrTo.length > 1) {
                if (localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '') == 'A01') {
                  const sub = this._service.sendMailNotAuthen(Global.MailEndPoint, this.SendMailObject).subscribe();
                  this.subscription.add(sub);
                }
                else {
                  const sub = this._service.sendMailApi(Global.MailEndPoint, this.SendMailObject).subscribe((result) => {
                  });
                  //const sub = this._service.sendMailToMulti(Global.MailEndPoint, this.SendMailObject).subscribe();
                  this.subscription.add(sub);
                }
              }
            });
          }
          else
          if (docCode1 == 'CL') {
         
            await this._service.exportHtml('/5.TemplateMail/CCM_HoanThanhDuyet_Claim.docx', body).toPromise().then(data => {
              _html = data['html'];
              if (_html.toString().indexOf('______________________________') > -1) {
                if (_commnetHtml != '' && _commnetHtml != undefined && _commnetHtml != null) {
                  _html = _html.replace(/______________________________/gi, _commnetHtml);
                }
                else {
                  _html = _html.replace(/______________________________/gi, ' .');
                }
              }
              this.SendMailObject.htmlMessage = _html;

              let arrTo = this.SendMailObject.to.split(';');
              if (arrTo.length == 1) {
                if (localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '') == 'A01') {
                  const sub = this._service.sendMailNotAuthen(Global.MailEndPoint, this.SendMailObject).subscribe();
                  this.subscription.add(sub);
                }
                else {
                  const sub = this._service.sendMailApi(Global.MailEndPoint, this.SendMailObject).subscribe((result) => {
                  });
                  //const sub = this._service.sendMail(Global.MailEndPoint, this.SendMailObject).subscribe();
                  this.subscription.add(sub);
                }

              }
              else if (arrTo.length > 1) {
                if (localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '') == 'A01') {
                  const sub = this._service.sendMailNotAuthen(Global.MailEndPoint, this.SendMailObject).subscribe();
                  this.subscription.add(sub);
                }
                else {
                  const sub = this._service.sendMailApi(Global.MailEndPoint, this.SendMailObject).subscribe((result) => {
                  });
                  //const sub = this._service.sendMailToMulti(Global.MailEndPoint, this.SendMailObject).subscribe();
                  this.subscription.add(sub);
                }
              }
            });
          }
          else 
            {
            console.log('JobCompleted');
            await this._service.exportHtml(emailBodyTemplate, body).toPromise().then(data => {
              _html = data['html'];
              if (_html.toString().indexOf('______________________________') > -1) {
                if (_commnetHtml != '' && _commnetHtml != undefined && _commnetHtml != null) {
                  _html = _html.replace(/______________________________/gi, _commnetHtml);
                }
                else {
                  _html = _html.replace(/______________________________/gi, ' .');
                }
              }
              this.SendMailObject.htmlMessage = _html;

              let arrTo = this.SendMailObject.to.split(';');
              if (arrTo.length == 1) {
                if (localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '') == 'A01') {
                  const sub = this._service.sendMailNotAuthen(Global.MailEndPoint, this.SendMailObject).subscribe();
                  this.subscription.add(sub);
                }
                else {
                  const sub = this._service.sendMailApi(Global.MailEndPoint, this.SendMailObject).subscribe((result) => {
                  });
                  //const sub = this._service.sendMail(Global.MailEndPoint, this.SendMailObject).subscribe();
                  this.subscription.add(sub);
                }

              }
              else if (arrTo.length > 1) {
                if (localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '') == 'A01') {
                  const sub = this._service.sendMailNotAuthen(Global.MailEndPoint, this.SendMailObject).subscribe();
                  this.subscription.add(sub);
                }
                else {
                  const sub = this._service.sendMailApi(Global.MailEndPoint, this.SendMailObject).subscribe((result) => {
                  });
                  //const sub = this._service.sendMailToMulti(Global.MailEndPoint, this.SendMailObject).subscribe();
                  this.subscription.add(sub);
                }
              }
            });
          }
        //console.log(this.SendMailObject);

        // let arrTo = this.SendMailObject.to.split(';');
        // if (arrTo.length == 1) {
        //   if (localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '') == 'A01') {
        //     const sub = await this._service.sendMailNotAuthen(Global.MailEndPoint, this.SendMailObject).subscribe();
        //     this.subscription.add(sub);
        //   }
        //   else {
        //     const sub = await this._service.sendMail(Global.MailEndPoint, this.SendMailObject).subscribe();
        //     this.subscription.add(sub);
        //   }

        // }
        // else if (arrTo.length > 1) {
        //   if (localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '') == 'A01') {
        //     const sub = await this._service.sendMailNotAuthen(Global.MailEndPoint, this.SendMailObject).subscribe();
        //     this.subscription.add(sub);
        //   }
        //   else {
        //     const sub = await this._service.sendMailToMulti(Global.MailEndPoint, this.SendMailObject).subscribe();
        //     this.subscription.add(sub);
        //   }
        // }
      }
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
    htmlMessage: null,
    files: [],
    mailToken: '',
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

  async getInfoTemplateMail(data: any, id?: number, approveGroup?: string) {
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
    param3.ParameterValue = data.controls['ProductCostId'].value;
    params.push(param3);

    param4.ParameterName = Global.convertParameterName('nUserId');
    param4.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID);
    params.push(param4);

    param5.ParameterName = Global.convertParameterName('ItemGroupCode');
    param5.ParameterValue = data.controls['ItemGroupCode'].value;
    params.push(param5);

    param6.ParameterName = Global.convertParameterName('DocCode');
    param6.ParameterValue = this.parentData['DocCode'];
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
      file.des = data.controls['ProductCostId'].value + '/' + this.folderNameSendMail + '/' + id + '/' + data.controls['DocNo'].value.replace(/\//gi, '-') + '.pdf';
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
        this.richtextMail = CKEditorExtension.create("Nội dung", "richtextmail", this.MailInfo.htmlMessage);
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
          //const sub = await this._service.sendMail(Global.MailEndPoint, this.MailInfo).subscribe();
          // sử dụng cách mới ớ dưới đây
          const sub = this._service.sendMailApi(Global.MailEndPoint, this.MailInfo).subscribe((result) => {
          });
          this.subscription.add(sub);
        }
        else if (arrTo.length > 1) {
          //const sub = await this._service.sendMailToMulti(Global.MailEndPoint, this.MailInfo).subscribe();
          const sub = this._service.sendMailApi(Global.MailEndPoint, this.MailInfo).subscribe((result) => {
          });
          this.subscription.add(sub);
        }
      }
      else {
        this.sendMailConfirm();
      }
    }

  }

  closeFormEmail() {
    this.frmEmailPopup.hide();
    location.reload();
  }
  //popup gửi mail
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
      const sub = this._service.sendMailApi(Global.MailEndPoint, this.SendMailObject).subscribe((result) => {
        if (result.success == false) {
          alert('Tiến trình không thành công');
        }
      });

      this.subscription.add(sub);

      if (func != null || func != undefined) {
        func.then(() => {
          console.log('update sended email sendMail....!');
        })
      }
    }
    else if (arrTo.length > 1) {
      //const sub = await this._service.sendMailToMulti(Global.MailEndPoint, this.SendMailObject).subscribe();
      const sub = this._service.sendMailApi(Global.MailEndPoint, this.SendMailObject).subscribe((result) => {
        if (result.success == false) {
          alert('Tiến trình không thành công');
        }
      });
      this.subscription.add(sub);
      if (func != null || func != undefined) {
        func.then(() => {
          console.log('update sended email sendMailToMulti....!');
        })
      }
    }

    this.frmEmailPopup.hide();

    if (reload) {
      this.router.navigate(['/main', 'notifications_tm', 'index']);
      // this.router.navigate(['main']).then(() => {
      //   this.router.navigate(this.indexPage).then(() => {
      //   })
      // });
    }

  }
  //xác nhận trong Email
  async sendMailConfirm() {
    this.subscription = new Subscription();

    this.SendMailObject.from = this.MailInfo.from;
    this.SendMailObject.to = this.MailInfo.to;
    this.SendMailObject.cc = this.MailInfo.cc;
    this.SendMailObject.subject = this.MailInfo.subject;
    this.SendMailObject.nameSend = this.MailInfo.nameSend;
    this.SendMailObject.mailType = this.MailInfo.mailType;
    // this.SendMailObject.htmlMessage = this.MailInfo.htmlMessage;

    // console.log(this.MailInfo.htmlMessage);

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


    this.MailConfirm.from = this.MailInfo.from;
    this.MailConfirm.to = this.MailInfo.toConfirm;
    this.MailConfirm.subject = 'V/v: Xác nhận email gủi đi - ' + this.MailInfo.subject;
    this.MailConfirm.nameSend = this.MailInfo.nameSend;
    this.MailConfirm.mailType = this.MailInfo.mailType;

    this.MailConfirm.smtpOptions.server = this.MailInfo.smtpOptions.server;
    this.MailConfirm.smtpOptions.useSsl = this.MailInfo.smtpOptions.useSsl;
    this.MailConfirm.smtpOptions.port = this.MailInfo.smtpOptions.port;
    this.MailConfirm.smtpOptions.user = this.MailInfo.smtpOptions.user;
    this.MailConfirm.smtpOptions.password = this.MailInfo.smtpOptions.password;
    this.MailConfirm.smtpOptions.requiresAuthentication = this.MailInfo.smtpOptions.requiresAuthentication;
    this.MailConfirm.mailToken = localStorage.getItem(SystemConstants.MAIL_TOKEN).replace(/"/gi, '');


    //Xử lý lưu htmlMessage xuống db
    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('CommandWeb');
    param1.ParameterValue = this.zCommandKey;
    params.push(param1);

    param2.ParameterName = Global.convertParameterName('KeySend');
    param2.ParameterValue = this.id
    params.push(param2);

    param3.ParameterName = Global.convertParameterName('EmailData');
    param3.ParameterValue = this.MailInfo.htmlMessage;//encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(this.MailInfo.htmlMessage)));
    params.push(param3);


    let _data = await this._service.postData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Web_B00EmailSendLog_Insert', params)
      .toPromise().then();

    this.MailConfirm.htmlMessage = this.MailInfo.htmlMessage + `
    <a target="_blank" href="`+ Global.MailEndPoint + `/sendasync?body=` + encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(this.SendMailObject))) + '&keySend=' + this.id + '&command=' + this.zCommandKey + `" style="background-color: greenyellow;">Chấp nhận</a>`

    let arrTo = this.MailConfirm.to.split(',');
    if (arrTo.length == 1) {

      //const sub = await this._service.sendMail(Global.MailEndPoint, this.MailConfirm).subscribe();
      const sub = this._service.sendMailApi(Global.MailEndPoint, this.MailConfirm).subscribe((result) => {
      });
      this.subscription.add(sub);
    }
    else if (arrTo.length > 1) {
      //const sub = await this._service.sendMailToMulti(Global.MailEndPoint, this.MailConfirm).subscribe();
      const sub = this._service.sendMailApi(Global.MailEndPoint, this.MailConfirm).subscribe((result) => {
      });
      this.subscription.add(sub);
    }
  }


  @ViewChild('inputCancelNote') inputCancelNote: string;
  async cancelVoucherClick(input: number) {
    this.showLoading = true;
    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();


    param1.ParameterName = Global.convertParameterName('Id');
    param1.ParameterValue = input;
    params.push(param1);

    param2.ParameterName = Global.convertParameterName('Note');
    param2.ParameterValue = this.inputCancelNote['nativeElement'].value;
    params.push(param2);

    let _data = await this._service.postData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_TMCtc_Cancel_btnClick', params)
      .toPromise().then();

    this.showLoading = false;
    this.showDialog = false;
  }

  showDialogCancel(text: string) {
    this.showDialog = true;
    this.titleConfirmDialog = text;
  }

  hideDialogCancel() {
    this.showDialog = false;
  }

  autoSizeVisibleRows(flex: wjcGrid.FlexGrid, force: boolean) {
    var rng = flex.viewRange;
    for (var r = rng.row; r <= rng.row2; r++) {
      if (flex.rows[r] != undefined)
        if (force || flex.rows[r].height == null) {
          flex.autoSizeRow(r, false)
        }
    }
  }

  @ViewChild('frmPopupTooltip') frmPopupTooltip: Popup
  @ViewChild('contentPopupTooltip') contentPopupTooltip: string

  dbClickCellContent(flex: wjcGrid.FlexGrid) {
    let pop = this.frmPopupTooltip;

    if (!flex.isReadOnly)
      return;

    let host = flex.hostElement;
    let self = this;

    host.addEventListener('dblclick', () => {
      var sel = flex.selection;

      let _content = flex.getCellData(sel.row, sel.col, true);

      this.contentPopupTooltip['nativeElement'].innerHTML = _content;

      (<HTMLElement>this.contentPopupTooltip['nativeElement']).style.userSelect = 'text';

      pop.show();

    });
  }


  @ViewChild('linkCommandPopup') linkCommandPopup: Popup
  @ViewChild('linkCommandGrid') linkCommandGrid: wjcGrid.FlexGrid;
  orderSelect: number;

  async openLinkCommand(data: any) {
    let pop = this.linkCommandPopup;
    pop.show();

    this.linkCommandGrid.rows.clear();
    this.linkCommandGrid.columns.clear();
    this.linkCommandGrid.autoGenerateColumns = false;
    this.bindColumnGroups(this.linkCommandGrid, data.grid);

    await this.loadDataLinkCommand(data);
    if (!wjcCore.isNullOrWhiteSpace(data.GroupBy))
      this.createAggregateGroupBy(data.GroupBy, this.linkCommandGrid.itemsSource);
    this.orderSelect = 0;
  }

  createAggregateGroupBy(groupBy: string, data: wjcCore.CollectionView) {
    data.groupDescriptions.clear();
    var groups = groupBy ? groupBy.split(',') : [];
    for (var i = 0; i < groups.length; i++) {
      data.groupDescriptions.push(new wjcCore.PropertyGroupDescription(groups[i]));
    }
  }

  async loadDataLinkCommand(info: any) {

    const keys = info.ConstraintKey.split(',');

    for (let control in this.editorFrm.controls)
      this.parentData[control] = this.editorFrm.get(control).value;

    const params = this.dfpanel.fn_build_paramater(keys, this.parentData);

    let data = await this._service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, info.Command, params).toPromise();

    this.linkCommandGrid.itemsSource = new wjcCore.CollectionView(data);

    localStorage.removeItem(SystemConstants.INFO_LINKCOMMAND);
    localStorage.setItem(SystemConstants.INFO_LINKCOMMAND, JSON.stringify(info));


  }

  async sendDataTo(flex: wjcGrid.FlexGrid) {

    let dataLinkCommand: any = <Array<Object>>JSON.parse(localStorage.getItem(SystemConstants.INFO_LINKCOMMAND));


    const keys = dataLinkCommand.SendData.ConstraintKey.split(',');
    let gridtmp: wjcGrid.FlexGrid = this.gridArray[Number(dataLinkCommand.SendData.OutputTable)];
    const flagParam = false;
    for (let control in this.editorFrm.controls)
      this.parentData[control] = this.editorFrm.get(control).value;
    const params = this.dfpanel.fn_build_paramater(keys, this.parentData);

    let paramXMLPopup = new ParameterContract();
    paramXMLPopup.ParameterName = this.convertParameterName(dataLinkCommand.SendData.ParameterXmlPopup);
    paramXMLPopup.ParameterValue = dataLinkCommand.SendData.ParameterXmlPopup;

    params.push(paramXMLPopup);

    // if (dataLinkCommand.SendData.ParameterXmlName1) {
    //   let paramXML1 = new ParameterContract();
    //   paramXML1.ParameterName = this.convertParameterName(dataLinkCommand.SendData.ParameterXmlName1);
    //   paramXML1.ParameterValue = dataLinkCommand.SendData.ParameterXmlName1;
    //   params.push(paramXML1);
    // }

    // if (dataLinkCommand.SendDataParameterXmlName2) {
    //   let paramXML2 = new ParameterContract();
    //   paramXML2.ParameterName = this.convertParameterName(dataLinkCommand.SendData.ParameterXmlName2);
    //   paramXML2.ParameterValue = dataLinkCommand.SendDataParameterXmlName2;
    //   params.push(paramXML2);

    // }

    let XMLObjectPopup = {
      name: dataLinkCommand.SendData.ParameterXmlPopup,
      collection: this.linkCommandGrid.itemsSource.items
    }

    let ds;
    // let XMLObject1;
    // let XMLObject2;

    ds = Global.getDataSetContract(XMLObjectPopup);

    // if (dataLinkCommand.SendData.ParameterXmlName1) {
    //   XMLObject1 = {
    //     name: dataLinkCommand.SendData.ParameterXmlName1,
    //     collection: this.gridArray[dataLinkCommand.SendData.TableXml1].itemsSource.items
    //   }

    //   ds = Global.getDataSetContract(XMLObjectPopup, XMLObject1);
    // }

    // if (dataLinkCommand.SendData.ParameterXmlName2) {
    //   XMLObject2 = {
    //     name: dataLinkCommand.SendData.ParameterXmlName2,
    //     collection: this.gridArray[dataLinkCommand.SendData.TableXml2].itemsSource.items
    //   }
    //   ds = Global.getDataSetContract(XMLObjectPopup, XMLObject1, XMLObject2);
    // }

    let data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, dataLinkCommand.SendData.Command, params, ds).toPromise().then();

    if (data['data'][0].length > 0) {
      let ds: CollectionView = gridtmp.itemsSource;

      if (dataLinkCommand.SendData.OverWriteOldData || dataLinkCommand.SendData.OverWriteOldData == undefined) {
        var selected = [];
        for (let i = 0; i < gridtmp.rows.length; i++) {
          selected.push(gridtmp.rows[i].dataItem); // <--> gridtmp.itemsSource.items[i]
        }

        for (let i = 0; i < selected.length; i++) {
          ds.remove(selected[i]);
        }
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

    //QUYDV: xử lý thêm trả ra Output từ Procedure 10/12/2021
    let cols = '';
    if (dataLinkCommand.SendData.DataMember) {
      cols = dataLinkCommand.SendData.DataMember.split(',');
      for (const col of cols) {
        if (data['output']) {
          this.parentData[col] = data['output']['@_' + col];
          // if (this.editorFrm.controls[col] instanceof DateBoxInput)
          //    this.editorFrm.controls[col].setValue((new Date(data['output']['@_' + col])).toISOString());
          // else
          this.editorFrm.controls[col].setValue(this.parentData[col]);
        }
      }
    }

    this.linkCommandPopup.hide();
  }

  checkSelectPopup(row: any) {
    let dataLinkCommand: any = <Array<Object>>JSON.parse(localStorage.getItem(SystemConstants.INFO_LINKCOMMAND));
    if (dataLinkCommand.SendData.ColumnCheckBox) {
      let col = dataLinkCommand.SendData.ColumnCheckBox;
      let index = 0;
      for (index = 0; index < this.linkCommandGrid.columns.length; index++) {
        if (this.linkCommandGrid.columns[index].binding == col) {
          break;
        }
      }

      if (row instanceof wjcGrid.GroupRow) {
        for (let _i = 0; _i < row.dataItem.items.length; _i++) {
          let _row = row.dataItem.items[_i];
          this.updateRowSelect(dataLinkCommand, _row, row.index + _i + 1, index);
        }
      }
      else {
        this.updateRowSelect(dataLinkCommand, row.dataItem, row._idx, index);
      }

      // let _value = true;

      // if (row.dataItem[dataLinkCommand.SendData.ColumnCheckBox]) {
      //   _value = false;
      // }

      // this.linkCommandGrid.setCellData(row._idx, index, _value);

      // if (_value)
      //   this.orderSelect += 1;
      // else
      //   this.orderSelect -= 1;

      // if (dataLinkCommand.SendData.CheckBoxOrder) {
      //   let colOrder = dataLinkCommand.SendData.CheckBoxOrder;
      //   let indexOrder = 0;
      //   for (indexOrder = 0; indexOrder < this.linkCommandGrid.columns.length; indexOrder++) {
      //     if (this.linkCommandGrid.columns[indexOrder].binding == colOrder) {
      //       break;
      //     }
      //   }
      //   if (_value)
      //     this.linkCommandGrid.setCellData(row._idx, indexOrder, this.orderSelect);
      //   else
      //     this.linkCommandGrid.setCellData(row._idx, indexOrder, 0);

      // }
    }

  }

  updateRowSelect(dataLinkCommand: any, dataItem: any, rowIdx: number, columnIdx: number) {
    let _value = true;

    if (dataItem[dataLinkCommand.SendData.ColumnCheckBox]) {
      _value = false;
    }

    this.linkCommandGrid.setCellData(rowIdx, columnIdx, _value);

    if (_value)
      this.orderSelect += 1;
    else
      this.orderSelect -= 1;

    if (dataLinkCommand.SendData.CheckBoxOrder) {
      let colOrder = dataLinkCommand.SendData.CheckBoxOrder;
      let indexOrder = 0;
      for (indexOrder = 0; indexOrder < this.linkCommandGrid.columns.length; indexOrder++) {
        if (this.linkCommandGrid.columns[indexOrder].binding == colOrder) {
          break;
        }
      }
      if (_value)
        this.linkCommandGrid.setCellData(rowIdx, indexOrder, this.orderSelect);
      else
        this.linkCommandGrid.setCellData(rowIdx, indexOrder, 0);

    }
  }

  openbravoDropdown() {
    document.getElementById("bravoDropdown").classList.toggle("bravo-show");
  }

  isMobileMenu() {
    if ($(window).width() < 991) {
        return true;
    }
    return false;
}

  //QuyDv: check duplicate data on grid
  protected _errorUnique: boolean;
  protected _valueDuplicate: any;
  checkUniqueColGrid(flex: wjcGrid.FlexGrid, field: string) {
    if (flex) {
      let _arr: any = flex.itemsSource.items;

      this._errorUnique = false;

      for (let i = 0; i < _arr.length; i++) {
        for (let j = i + 1; j < _arr.length; j++) {
          if (_arr[i][field] == _arr[j][field]) {
            this._errorUnique = true;
            this._valueDuplicate = _arr[i][field];
            break;
          }
        }
        if (this._errorUnique == true) break;
      }
    }
  }

  checkUniqueColGridNotIncludedEmpty(flex: wjcGrid.FlexGrid, field: string, fieldWarning?: string) {
    if (flex) {
      let _arr: any = flex.itemsSource.items;

      this._errorUnique = false;

      for (let i = 0; i < _arr.length; i++) {
        for (let j = i + 1; j < _arr.length; j++) {
          if (_arr[i][field] != '' && _arr[j][field] != '' && _arr[i][field] != undefined && _arr[j][field] != undefined)
            if (_arr[i][field] == _arr[j][field]) {
              this._errorUnique = true;
              this._valueDuplicate = _arr[i][field] + ': ' + _arr[i][fieldWarning];
              break;
            }
        }
        if (this._errorUnique == true) break;
      }
    }
  }

  checkUniqueField(
    flex: wjcGrid.FlexGrid,
    checkField: string | string[],
    labelField: string,
    excludeField: string
  ): { isDuplicate: boolean, errors: { duplicateValue: any, duplicateLabels: any[] }[] } {

    const items: any[] = flex.itemsSource.items || [];

    // Cho phép kiểm trùng theo 1 field hoặc theo khóa ghép nhiều field
    const fields: string[] = Array.isArray(checkField) ? checkField : [checkField];

    // Dùng Map để lưu: { Khóa_gom_nhóm => { Giá_trị_hiển_thị, Mảng_các_labelField } }
    const valueTracker = new Map<string, { display: any, labels: any[] }>();

    // Bước 1: Quét toàn bộ lưới và gom nhóm dữ liệu
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item) continue;
      if (excludeField && item[excludeField] == true) continue;

      // Lấy giá trị của tất cả các field tạo nên khóa, bỏ qua dòng nếu có phần nào bỏ trắng
      const parts = fields.map(f => item[f]);
      if (parts.some(v => v === null || v === undefined || v === '')) continue;

      // Khóa gom nhóm: ép chuỗi và nối bằng ký tự phân tách hiếm để tránh nhầm lẫn
      const key = parts.map(v => String(v).trim()).join('');

      // Giá trị hiển thị: giữ nguyên giá trị gốc khi chỉ kiểm 1 field
      const display = fields.length > 1 ? parts.join(' - ') : parts[0];

      // Lấy nhãn, nếu không truyền labelField thì lấy số thứ tự dòng làm nhãn phụ
      const label = labelField ? item[labelField] : `Dòng ${i + 1}`;

      // Nếu Map đã có khóa này, đẩy thêm label mới vào mảng
      if (valueTracker.has(key)) {
        valueTracker.get(key).labels.push(label);
      }
      // Nếu chưa có, tạo mới với một mảng chứa label đầu tiên
      else {
        valueTracker.set(key, { display: display, labels: [label] });
      }
    }

    // Bước 2: Lọc ra các nhóm có từ 2 label trở lên (tức là bị trùng)
    const duplicateErrors: { duplicateValue: any, duplicateLabels: any[] }[] = [];

    valueTracker.forEach(entry => {
      if (entry.labels.length > 1) {
        duplicateErrors.push({
          duplicateValue: entry.display,
          duplicateLabels: entry.labels
        });
      }
    });

    // Bước 3: Trả về kết quả tổng hợp
    return {
      isDuplicate: duplicateErrors.length > 0,
      errors: duplicateErrors
    };
  }

  // ===== Phân cấp theo STT (ItemNo dạng '1', '1.1', '1.1.1', ...) =====

  // Lấy ItemNo của dòng cha (bỏ đoạn cuối sau dấu '.'). Ví dụ '1.1.1' -> '1.1', '1' -> ''
  protected getParentItemNo(no: string): string {
    const idx = no.lastIndexOf('.');
    return idx > 0 ? no.substring(0, idx) : '';
  }

  // Độ sâu của ItemNo = số dấu '.' (cấp 0 = '1', cấp 1 = '1.1', ...)
  protected itemNoDepth(no: string): number {
    return (no.match(/\./g) || []).length;
  }

  /**
   * Tính SubTotal: gom giá trị các dòng con lên dòng cha theo phân cấp ItemNo.
   * Dòng cha (có ít nhất 1 dòng con) bị reset về 0 rồi cộng dồn từ cấp sâu nhất lên,
   * nên dòng cha trung gian đã gom đủ con trước khi cộng tiếp lên ông.
   * @param grids       Danh sách lưới áp dụng.
   * @param sumFields   Các cột cần tính tổng (vd ['QtyCDT','QtyBCH','Qty01',...]) — tham số hóa, không cố định.
   * @param itemNoField Cột chứa STT phân cấp (mặc định 'ItemNo').
   */
  computeSubTotals(grids: wjcGrid.FlexGrid[], sumFields: string[], itemNoField: string = 'ItemNo'): void {
    if (!grids || !sumFields || sumFields.length == 0) { return; }

    for (let grid of grids) {
      if (!grid || !grid.itemsSource) { continue; }
      const items: any[] = grid.itemsSource.items;

      // Lập bản đồ ItemNo -> dòng dữ liệu
      const byNo = new Map<string, any>();
      for (let it of items) {
        const no = (it[itemNoField] == null ? '' : String(it[itemNoField]).trim());
        if (no !== '') { byNo.set(no, it); }
      }

      // Xác định các dòng cha (có ít nhất 1 dòng con)
      const parentNos = new Set<string>();
      byNo.forEach((_row, no) => {
        const parentNo = this.getParentItemNo(no);
        if (parentNo && byNo.has(parentNo)) { parentNos.add(parentNo); }
      });

      // Tính tổng vào accumulator riêng (CHƯA ghi vào dòng) — tránh mutate dòng trong lúc cộng dồn
      const sums: { [no: string]: { [field: string]: number } } = {};
      parentNos.forEach(no => {
        sums[no] = {};
        for (let f of sumFields) { sums[no][f] = 0; }
      });

      // Cộng dồn từ cấp sâu nhất lên. Giá trị mỗi node đóng góp cho cha:
      //  - node là cha -> dùng tổng đã tính của chính nó (sums[no]) (đã đủ vì xử lý sâu trước)
      //  - node là lá  -> dùng giá trị thực trên dòng
      const sortedNos = Array.from(byNo.keys()).sort((a, b) => this.itemNoDepth(b) - this.itemNoDepth(a));
      for (let no of sortedNos) {
        const parentNo = this.getParentItemNo(no);
        if (!parentNo || !byNo.has(parentNo)) { continue; }
        const isParent = parentNos.has(no);
        for (let f of sumFields) {
          const v = isParent ? sums[no][f] : parseFloat(byNo.get(no)[f]);
          if (!isNaN(v)) { sums[parentNo][f] = (sums[parentNo][f] || 0) + v; }
        }
      }

      // Ghi giá trị vào dòng cha QUA edit-transaction của CollectionView,
      // để Wijmo đăng ký dòng vào itemsEdited -> mới được gửi lên server khi lưu.
      // Dùng chính itemsSource vì submit() đọc itemsSource.itemsEdited để dựng payload.
      const cv: any = grid.itemsSource;
      parentNos.forEach(no => {
        const row = byNo.get(no);
        if (cv && cv.editItem) { cv.editItem(row); }
        for (let f of sumFields) { row[f] = sums[no][f]; }
        if (cv && cv.commitEdit) { cv.commitEdit(); }
      });

      if (cv && cv.refresh) { cv.refresh(); }
    }
  }

  /**
   * Kiểm tra tính đúng đắn của ItemNo trên một lưới:
   *  - Định dạng: các số nguyên dương ngăn cách bằng dấu '.', vd '1', '1.1', '2.10.3'.
   *  - Phân cấp: mỗi dòng con phải có dòng cha tồn tại (vd có '1.1.1.1' thì phải có '1.1.1').
   * @returns Danh sách thông báo lỗi (rỗng nếu hợp lệ).
   */
  validateItemNoHierarchy(flex: wjcGrid.FlexGrid, itemNoField: string = 'ItemNo'): string[] {
    const errors: string[] = [];
    if (!flex || !flex.itemsSource) { return errors; }
    const items: any[] = flex.itemsSource.items;

    const formatRegex = /^\d+(\.\d+)*$/;
    const allNos = new Set<string>();

    // Lượt 1: kiểm tra định dạng + gom tập ItemNo
    for (let it of items) {
      const raw = it[itemNoField];
      const no = (raw == null ? '' : String(raw).trim());
      if (no === '') {
        errors.push('Có dòng bị bỏ trống STT.');
        continue;
      }
      if (!formatRegex.test(no)) {
        errors.push('STT "' + no + '" không hợp lệ: chỉ gồm các số ngăn cách bằng dấu chấm.');
        continue;
      }
      allNos.add(no);
    }

    // Lượt 2: kiểm tra dòng cha tồn tại (đúng phân cấp, không nhảy cấp)
    allNos.forEach(no => {
      const parentNo = this.getParentItemNo(no);
      if (parentNo && !allNos.has(parentNo)) {
        errors.push('STT "' + no + '" thiếu dòng cha "' + parentNo + '" (sai phân cấp).');
      }
    });

    return errors;
  }

  //Quydv
  wordWrapGrid() {
    let scrollPositionChanged = (s, e) => {
      this.autoSizeVisibleRows(s, false);
    }

    let loadedRows = (s, e) => {
      // setTimeout(() => {
      //   this.autoSizeVisibleRows(s, false);
      // }, 50);
      this.autoSizeVisibleRows(s, false);
    }

    let resizedColumn = (s, e) => { // column resized
      // setTimeout(() => {
      //   this.autoSizeVisibleRows(s, true);
      // }, 50);
      this.autoSizeVisibleRows(s, true);
    }
    let cellEditEnded = (s, e) => { // cell edited
      if (s.columns[e.col].wordWrap) {
        this.autoSizeVisibleRows(s, true);
      }
    }

    let rowEditEnded = (s, e) => { // whole row undo
      if (e.cancel) {
        this.autoSizeVisibleRows(s, true);
      }
    }


    for (let i in this.gridArray) {
      this.gridArray[i].scrollPositionChanged.removeHandler(scrollPositionChanged);
      this.gridArray[i].scrollPositionChanged.addHandler(scrollPositionChanged);

      this.gridArray[i].loadedRows.removeHandler(loadedRows);
      this.gridArray[i].loadedRows.addHandler(loadedRows);

      this.gridArray[i].resizedColumn.removeHandler(resizedColumn);
      this.gridArray[i].resizedColumn.addHandler(resizedColumn);

      this.gridArray[i].rowEditEnded.removeHandler(rowEditEnded);
      this.gridArray[i].rowEditEnded.addHandler(rowEditEnded);
    }
  }

  downloadFile(folder: string, name: string) {
    if (name) {
      const sub = this._service.dowload(folder, '', name).subscribe(blob => {
        if (name.toUpperCase().endsWith('PDF') == false || (blob.size / 1024) > 10240)
          importedSaveAs(blob, name);
        else {
          let url = window.URL.createObjectURL(blob);
          window.open(url);
        }
      });
      this.subscription.add(sub);
    }
  }

  isValidEmail(email: string): boolean {
    // Biểu thức chính quy kiểm tra email
    // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  }

  protected get lastSaveTimeKey(): string {
    return `lastSaveTime_${this.id || 'new'}`;
  }

  protected getLastSaveTime(): Date | null {
    const saved = localStorage.getItem(this.lastSaveTimeKey);
    return saved ? new Date(saved) : null;
  }

  protected setLastSaveTime(date: Date): void {
    localStorage.setItem(this.lastSaveTimeKey, date.toISOString());
  }

  protected clearLastSaveTime(): void {
    localStorage.removeItem(this.lastSaveTimeKey);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
