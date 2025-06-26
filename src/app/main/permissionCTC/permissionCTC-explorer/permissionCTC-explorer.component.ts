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
import { LayoutPermissionCTCExplorer } from '../DeclareLayout';
import { BaseExplorerComponent } from '../../_baseform/base-explorer.component';
import { BaseEditorService } from '../../../base/base.service-editor';
import { BaseExplorerService } from '../../../base/base.service-explorer';
import { Title } from '@angular/platform-browser';
import { CryptoExtension } from '../../../core/extensions/crypto.extension';

@Component({
  selector: 'permissionCTC-explorer',
  templateUrl: './permissionCTC-explorer.component.html',
  styleUrls: ['./permissionCTC-explorer.component.css']
})

export class PermissionCTCExplorerComponent extends BaseExplorerComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('contentFilter') contentFilter: ElementRef;
  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

  pathPage = ['/main', 'permissionCTC', 'detail'];
  _layoutDeclare: LayoutPermissionCTCExplorer = new LayoutPermissionCTCExplorer()

  constructor(srv: BaseExplorerService,
    router: Router,
    ics: InputControlService, titleService: Title,route: ActivatedRoute) {
      super(srv, router, ics, titleService,route)
    this.zParentTableName = this._layoutDeclare.layout.Structure.Parent.Name;
    this.zFilterKey = this._layoutDeclare.layout.Structure.Parent.FilterKey;
    this.rowPage = this._layoutDeclare.layout.Structure.Parent.RowPage;
    this.fieldOrderBy = this._layoutDeclare.layout.Structure.Parent.OrderBy;
    this.pageNumber = 1;
  }

  async ngOnInit() {
    await this.init(this.pathPage).then();

    this.doubleClickGrid(this.grid);
    // this.setFormatItem(this.grid);
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: FormGroup) {
    this.submit(formData);
  }

  // openPemission()
  // {
  //   let host = this.grid.hostElement;
  //   let self = this;
  //   let key = this.grid.selectedItems[0]['IdUP'];

  //   if (key) {
  //     this.navigateUrl.push(key);
  //     this.navigateUrl[0] = '#/main';
  //     window.open(this.navigateUrl.join('/'));
  //     this.navigateUrl.pop();
  //   }

  // }



  openPemission() {
    let host = this.grid.hostElement;
    let self = this;
    let key = this.grid.selectedItems[0]['IdPp'];

    let data: any;

    data = this.grid.selectedItems[0];

    if (key != null) {
      this.pathPage.push(key);
      self.router.navigate(this.pathPage);
    }
    else {
      this.pathPage.push('-1');

      let paramsEdit = {'Commandkey':'permissionCTC-editor','PositionCode':'{EXPR=Code}'}

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

      if (paramsEdit != undefined && paramsEdit != null){
        let _value = encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(paramsEdit)));
        this.pathPage.push(_value);
      }

      self.router.navigate(this.pathPage);
    }
  }

  doubleClickGrid(grid: wjcGrid.FlexGrid) {

    let host = grid.hostElement;
    let self = this;

    host.addEventListener('dblclick', function (e) {
    });
  }

  private _groupBy = 'DeptName';
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
    this.grid.collapseGroupsToLevel(0);
  }  
}
