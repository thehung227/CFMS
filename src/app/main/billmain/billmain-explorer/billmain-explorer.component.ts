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
import { LayoutBillMainExplorer } from '../DeclareLayout';
import { BaseExplorerComponent } from '../../_baseform/base-explorer.component';
import { BaseEditorService } from '../../../base/base.service-editor';
import { BaseExplorerService } from '../../../base/base.service-explorer';
import { DialogComponent } from '../../../ui/dialog/dialog.component';
import { Title } from '@angular/platform-browser';
import { LayoutPrinter } from './billmain-printer.data';

@Component({
    selector: 'billmain-explorer',
    templateUrl: './billmain-explorer.component.html',
    styleUrls: ['./billmain-explorer.component.css']
})

export class BillMainExplorerComponent extends BaseExplorerComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('contentFilter') contentFilter: ElementRef;
  @ViewChild('dialogFrm') dialogFrm: DialogComponent;
  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;
  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  
  layoutPrint: LayoutPrinter = new LayoutPrinter();

  pathPage = ['/main', 'billmain', 'detail'];
  _layoutDeclare :LayoutBillMainExplorer = new LayoutBillMainExplorer()

  constructor(srv: BaseExplorerService,
    router: Router,
    ics: InputControlService, titleService: Title,route: ActivatedRoute) {
      super(srv, router, ics, titleService,route)
      this.zParentTableName = this._layoutDeclare.layout.Structure.Parent.Name;
      this.zFilterKey = this._layoutDeclare.layout.Structure.Parent.FilterKey;
      this.rowPage = this._layoutDeclare.layout.Structure.Parent.RowPage;
      this.fieldOrderBy = this._layoutDeclare.layout.Structure.Parent.OrderBy;
      this.pageNumber = 1;
      this._layoutPrinter = this.layoutPrint.Layout;
  }

  ngOnInit() {
    this.init(this.pathPage);
  }
  
  private _groupBy = 'ProductName,CustomerName';
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

  onSubmit(formData: FormGroup) {
    this.submit(formData);
  }

  ngOnDestroy() {
    this.destroy();
  }

  
}
