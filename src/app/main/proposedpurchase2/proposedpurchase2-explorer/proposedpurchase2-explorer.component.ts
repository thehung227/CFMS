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
import { LayoutProposedPurchase2Explorer } from '../DeclareLayout';
import { BaseExplorerComponent } from '../../_baseform/base-explorer.component';
import { BaseEditorService } from '../../../base/base.service-editor';
import { BaseExplorerService } from '../../../base/base.service-explorer';
import { forEach } from '@angular/router/src/utils/collection';
import { DialogComponent } from '../../../ui/dialog/dialog.component';
import { Title } from '@angular/platform-browser';
import { LayoutPrinter } from './proposedpurchase2-printer.data';
import { SystemConstants } from '../../../core/common/system.constants';
import { ProposedPurchase2ExplorerChildComponent } from './proposedpurchase2-explorer-child.component';

@Component({
  selector: 'proposedpurchase2-explorer',
  templateUrl: './proposedpurchase2-explorer.component.html',
  styleUrls: ['./proposedpurchase2-explorer.component.css'],
  
})

export class ProposedPurchase2ExplorerComponent extends BaseExplorerComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('gridChild') gridChild: wjcGrid.FlexGrid;
  @ViewChild('contentFilter') contentFilter: ElementRef;

  @ViewChild('dialogFrm') dialogFrm: DialogComponent;
  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;

  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

  layoutPrint: LayoutPrinter = new LayoutPrinter();

  pathPage = ['/main', 'proposedpurchase2', 'detail'];
  _layoutDeclare: LayoutProposedPurchase2Explorer = new LayoutProposedPurchase2Explorer();
  
  constructor(srv: BaseExplorerService,
    router: Router,
    ics: InputControlService, titleService: Title,route: ActivatedRoute) {
      super(srv, router, ics, titleService,route)
    this.zParentTableName = this._layoutDeclare.layout.Structure.Parent.Name;
    this.zFilterKey = this._layoutDeclare.layout.Structure.Parent.FilterKey;
    this.rowPage = this._layoutDeclare.layout.Structure.Parent.RowPage;
    this.fieldOrderBy = this._layoutDeclare.layout.Structure.Parent.OrderBy;
    this.zMenuTableName = this._layoutDeclare.menu.Table;
    this.zMenuFilterKey = this._layoutDeclare.menu.Filter;
    this.zMenuTableNameLookup1 = this._layoutDeclare.lookup1.Table;
    this.zMenuFilterKeyLookup1 = this._layoutDeclare.lookup1.Filter;
    this.zMenuColumnFilterLookup1 = this._layoutDeclare.lookup1.ColumnFilter;
    this.zMenuTableNameLookup2 = this._layoutDeclare.lookup2.Table;
    this.zMenuFilterKeyLookup2 = this._layoutDeclare.lookup2.Filter;
    this.zMenuColumnFilterLookup2 = this._layoutDeclare.lookup2.ColumnFilter;
    
    this.zMenuTableNameLookup3 = this._layoutDeclare.lookup3.Table;
    this.zMenuFilterKeyLookup3 = this._layoutDeclare.lookup3.Filter;

    this.pageNumber = 1;
    this._layoutPrinter = this.layoutPrint.Layout;
  }

  async ngOnInit() {
    await this.init(this.pathPage).then();
    this.grid.columns[0].width = 45;
    this.grid.rowHeaders.columns.maxSize = 2;
  }

  ngAfterViewInit() {
    
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

  private _groupBy = 'DocStatusNameTM';
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
            var groupDesc = new wjcCore.PropertyGroupDescription(groupName);
            cv.groupDescriptions.push(groupDesc);
        }
        cv.refresh();
      }
      cv.endUpdate();
      this.grid.groupHeaderFormat = '<b>{value}</b> ({count:n0} mục) ';
    }
    this.grid.collapseGroupsToLevel(0);
  }

  showPrintVoucher(flex: wjcGrid.FlexGrid, layoutName?: string) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

    let html = this.printVoucher(flex, layoutName);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

}
