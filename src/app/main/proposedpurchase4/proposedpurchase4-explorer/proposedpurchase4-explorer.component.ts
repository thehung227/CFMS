import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../../ui/ui.module';

import * as wjOData from 'wijmo/wijmo.odata';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcInput from 'wijmo/wijmo.angular2.input';
import * as wjcGridDetail from 'wijmo/wijmo.grid.detail';
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
import { LayoutProposedPurchase4Explorer } from '../DeclareLayout';
import { BaseExplorerComponent } from '../../_baseform/base-explorer.component';
import { BaseEditorService } from '../../../base/base.service-editor';
import { BaseExplorerService } from '../../../base/base.service-explorer';
import { forEach } from '@angular/router/src/utils/collection';
import { DialogComponent } from '../../../ui/dialog/dialog.component';
import { Title } from '@angular/platform-browser';
import { LayoutPrinter } from './proposedpurchase4-printer.data';
import { SystemConstants } from '../../../core/common/system.constants';

@Component({
  selector: 'proposedpurchase4-explorer',
  templateUrl: './proposedpurchase4-explorer.component.html',
  styleUrls: ['./proposedpurchase4-explorer.component.css'],

})

export class ProposedPurchase4ExplorerComponent extends BaseExplorerComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('gridChild') gridChild: wjcGrid.FlexGrid;
  @ViewChild('contentFilter') contentFilter: ElementRef;

  @ViewChild('dialogFrm') dialogFrm: DialogComponent;
  @ViewChild('dialogFrm2') dialogFrm2: DialogComponent;
  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;

  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

  layoutPrint: LayoutPrinter = new LayoutPrinter();

  pathPage = ['/main', 'proposedpurchase3', 'detail'];
  _layoutDeclare: LayoutProposedPurchase4Explorer = new LayoutProposedPurchase4Explorer();

  showDialog2 = false;

  constructor(private srv: BaseExplorerService,
    router: Router,
    ics: InputControlService, titleService: Title, route: ActivatedRoute) {
    super(srv, router, ics, titleService, route)
    this.zParentTableName = this._layoutDeclare.layout.Structure.Parent.Name;
    this.zFilterKey = this._layoutDeclare.layout.Structure.Parent.FilterKey;
    this.rowPage = this._layoutDeclare.layout.Structure.Parent.RowPage;
    this.fieldOrderBy = this._layoutDeclare.layout.Structure.Parent.OrderBy;
    this.zMenuTableName = this._layoutDeclare.menu.Table;
    this.zMenuFilterKey = this._layoutDeclare.menu.Filter;
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

  async ngOnInit() {
    await this.init(this.pathPage).then();
    this.grid.columns[0].width = 70;
    this.grid.rowHeaders.columns.maxSize = 2;
  }

  ngAfterViewInit() {

    this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {
    });


  }

  resizeWidthControls() { }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: FormGroup) {
    this.submit(formData);
  }

  getPercent(num1: number, num2: number) {
    return Math.round((num1 / num2) * 100).toString() + '%';
  }

  private _groupBy = 'TenGoiThau,ItemGroupName,DocStatusNameTM';
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
    this.grid.collapseGroupsToLevel(3);
  }

  showPrintVoucher(flex: wjcGrid.FlexGrid, layoutName?: string) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

    let html = this.printVoucher(flex, layoutName);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  splitButtonItemClicked(s: wjcInput.WjMenu, e: wjcCore.EventArgs) {
    var menu = s;

    let linkwizard = { 'Commandkey': 'WIZARD_CTC_TINHGIA', 'BizDocId': '{EXPR=BizDocId}', 'BranchCode': '{EXPR=BranchCode}', 'DocDate1': '{EXPR=LastYear}', 'ItemGroupCode': '{EXPR=ItemGroupCode}', 'UserName': '{VAR=User.UserName}', 'ProductCostId': '{EXPR=ProductCostId}' };
    if (menu.isDroppedDown) {
      // the click was on a menu item
      //alert('option **' + menu.selectedItem.value + '** is now the default');
      //this.editExplorer(this.grid,this.pathPage);


      if (menu.selectedItem.value == 'CalPrice') {
        let _idxColHdr = this.grid.selection.col;
        let _colName = this.grid.columnHeaders.columns[_idxColHdr]['binding']

        if (this.grid.selectedRows[0].dataItem['IsVoucherParent'] == 1) {
          alert('Không tính giá trên đề nghị gốc!')
        }
        else {
          this.openWizardWithParams(['/main', 'wizardcalcprice', 'wizard'], this.grid.selectedRows[0].dataItem, linkwizard);
        }
        // console.log(_idxColHdr);
        // console.log(this.grid.columnHeaders.columns[_idxColHdr]['header']);
        // console.log(this.grid.selectedRows[0].dataItem[_colName]);
        // alert(this.grid.columnHeaders.columns[_idxColHdr]['header'] + '  -  ' + this.grid.selectedRows[0].dataItem[_colName]);
      }

      if (menu.selectedItem.value == 'Split') {
        this.copyAndSplitEditor(this.grid, ['/main', 'proposedpurchase2', 'detail']);
      }

      if (menu.selectedItem.value == 'InviteBG') {
        this.openEditorWithParams_NewTab(['/main', 'supplierquotes', 'detail'], this.grid);
      }
    }
    else {
      // the click was on the button
      alert('running **' + menu.selectedItem.value + '**');
    }
  }

  openWizardWithParams(navigateUrl: any[], data: any, linkWizard: any) {
    let self = this;
    navigateUrl[0] = '#/main';
    navigateUrl.push(this._layoutDeclare.linkwizard.key);

    let paramsEdit = linkWizard;

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

    if (paramsEdit != undefined && paramsEdit != null)
      navigateUrl.push(JSON.stringify(paramsEdit));

    window.open(navigateUrl.join('/'));
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

  showDialogStatusUpdate() {
    this.showDialog2 = true;
  }

  hideDialogStatusUpdate() {
    this.showDialog2 = false;
  }

  async updateStatus(grid: wjcGrid.FlexGrid) {

    this.showLoading = true;
    let lstId: string = '';
    for (let item of grid.selectedItems) {
      if (item['Id'] != undefined) {
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

    let _data = await this.srv.postData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_TMCtc_B30BizDocPP_UpdateStatus', params)
      .toPromise().then(() => {
        this.showLoading = false;
        this.showDialog2 = false;
      });
    location.reload();
  }

}
