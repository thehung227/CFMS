import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../../ui/ui.module';

import * as wjOData from 'wijmo/wijmo.odata';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcInput from 'wijmo/wijmo.angular2.input';
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';

import * as moment from 'moment';

import { InputControlService } from './../../../ui/input/InputControlService';

import { Global } from './../../../shared/global';
import { Router, ActivatedRoute } from '@angular/router';

import { InputBase } from './../../../ui/input/InputBase';
import { DropDownInput } from './../../../ui/input/DropDownInput';
import { TextBoxInput } from './../../../ui/input/TextBoxInput';
import { DateBoxInput } from './../../../ui/input/DateBoxInput';
import { NumberBoxInput } from './../../../ui/input/NumberBoxInput';
import { CheckBoxInput } from './../../../ui/input/CheckBoxInput';

import { ParameterContract } from './../../../contracts/parameter.contract';
import { BravoCtorEnum } from './../../../core/enum/type.enum';
import { LayoutSupplierQuotesExplorer } from '../DeclareLayout';
import { BaseExplorerComponent } from '../../_baseform/base-explorer.component';
import { BaseEditorService } from '../../../base/base.service-editor';
import { BaseExplorerService } from '../../../base/base.service-explorer';
import { DialogComponent } from '../../../ui/dialog/dialog.component';
import { Title } from '@angular/platform-browser';
import { LayoutPrinter } from './supplierquotes-printer.data';
import { SystemConstants } from '../../../core/common/system.constants';

@Component({
    selector: 'supplierquotes-explorer',
    templateUrl: './supplierquotes-explorer.component.html',
    styleUrls: ['./supplierquotes-explorer.component.css']
})

export class SupplierQuotesExplorerComponent extends BaseExplorerComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('contentFilter') contentFilter: ElementRef;
  @ViewChild('dialogFrm') dialogFrm: DialogComponent;
  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

  layoutPrint: LayoutPrinter = new LayoutPrinter();

  pathPage = ['/main', 'supplierquotes', 'detail'];
  _layoutDeclare :LayoutSupplierQuotesExplorer = new LayoutSupplierQuotesExplorer()

  showDialog2 = false;

  constructor(private srv: BaseExplorerService,
    router: Router,
    ics: InputControlService, titleService: Title,route: ActivatedRoute) {
      super(srv, router, ics, titleService,route)
      this.zParentTableName = this._layoutDeclare.layout.Structure.Parent.Name;
      this.zFilterKey = this._layoutDeclare.layout.Structure.Parent.FilterKey;
      this.rowPage = this._layoutDeclare.layout.Structure.Parent.RowPage;
      this.fieldOrderBy = this._layoutDeclare.layout.Structure.Parent.OrderBy;
      this.pageNumber = 1;
      this._layoutPrinter = this.layoutPrint.Layout;

    this.zMenuTableNameLookup1 = this._layoutDeclare.lookup1.Table;
    this.zMenuFilterKeyLookup1 = this._layoutDeclare.lookup1.Filter;
    this.zMenuColumnFilterLookup1 = this._layoutDeclare.lookup1.ColumnFilter;
    
    this.zMenuTableNameLookup2 = this._layoutDeclare.lookup2.Table;
    this.zMenuFilterKeyLookup2 = this._layoutDeclare.lookup2.Filter;
    this.zMenuColumnFilterLookup2 = this._layoutDeclare.lookup2.ColumnFilter;

    this.zMenuTableNameLookup3 = this._layoutDeclare.lookup3.Table;
    this.zMenuFilterKeyLookup3 = this._layoutDeclare.lookup3.Filter;
  }

  ngOnInit() {
    this.init(this.pathPage);
  }

  onSubmit(formData: FormGroup) {
    this.submit(formData);
  }

  private _groupBy = 'TenGoiThau';
  get groupBy(): string {
    return this._groupBy;
  }
  set groupBy(value: string) {
    if (this._groupBy != value) {
      this._groupBy = value;
      this._applyGroup();
    }
  }

  _applyGroup() {
    var cv = this.grid.collectionView;
    if (cv != null) {

      cv.beginUpdate();
      cv.groupDescriptions.clear();
      if (this.groupBy) {
        var groupNames = this.groupBy.split(',');
        for (var i = 0; i < groupNames.length; i++) {
          var groupName = groupNames[i];
          // group everything else by value
          var groupDesc = new wjcCore.PropertyGroupDescription(groupName);
          cv.groupDescriptions.push(groupDesc);
        }
        cv.refresh();
      }
      cv.endUpdate();
      this.grid.groupHeaderFormat = '<b>{value}</b> ({count:n0} mục) ';
    }
    this.grid.collapseGroupsToLevel(1);
  }

  showPrintVoucher(flex: wjcGrid.FlexGrid, layoutName?: string) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

    let html = this.printVoucher(flex,layoutName);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  doubleClickGrid(grid: wjcGrid.FlexGrid, navigateUrl: any[]) {

    let host = grid.hostElement;
    let self = this;

    host.addEventListener('dblclick', function (e) {
      if (grid.selectedItems[0] != null && localStorage.getItem(SystemConstants.ALLOW_DBLCLICK) == 'true') {
        let key = grid.selectedItems[0]['Id'];
        if (key) {
          navigateUrl.push(key);

          navigateUrl[0] = '#/main';
          window.open(navigateUrl.join('/'));
          navigateUrl.pop();

          // self.router.navigate(navigateUrl);
        }
      }
    });
  }
  

  showDialogMuiltiUpdate(){
    this.showDialog2 =true;
  }

  hideDialogMuiltiUpdate(){
    this.showDialog2 =false;
  }

  async updateMultiEffective(grid: wjcGrid.FlexGrid){

    this.showLoading = true;
    let lstId: string = '';
    for(let item of grid.selectedItems){
      if (item['Id'] != undefined){
        lstId = lstId + ',' + item['Id'];
      }
    }
    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();


    param1.ParameterName = Global.convertParameterName('ListId');
    param1.ParameterValue = lstId;
    params.push(param1);

    param2.ParameterName = Global.convertParameterName('UserName');
    param2.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERNAME);
    params.push(param2);

    let _data = await this.srv.postData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_B30BizDoc_UpdateCloseQR', params)
      .toPromise().then(()=>{
        this.showLoading = false;
        this.showDialog2 = false;
      });
    location.reload();
  }
  

  ngOnDestroy() {
    this.destroy();
  }
  
}
