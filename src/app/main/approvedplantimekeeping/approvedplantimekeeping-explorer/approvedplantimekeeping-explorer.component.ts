import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../../ui/ui.module';

import * as wjOData from 'wijmo/wijmo.odata';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcInput from 'wijmo/wijmo.angular2.input';

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
import { LayoutApprovedPlanTimeKeepingExplorer } from '../DeclareLayout';
import { BaseExplorerComponent } from '../../_baseform/base-explorer.component';
import { BaseEditorService } from '../../../base/base.service-editor';
import { BaseExplorerService } from '../../../base/base.service-explorer';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'approvedplantimekeeping-explorer',
  templateUrl: './approvedplantimekeeping-explorer.component.html',
  styleUrls: ['./approvedplantimekeeping-explorer.component.css']
})

export class ApprovedPlanTimeKeepingExplorerComponent extends BaseExplorerComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('contentFilter') contentFilter: ElementRef;

  pathPage = ['/main', 'approvedplantimekeeping', 'detail'];
  _layoutDeclare :LayoutApprovedPlanTimeKeepingExplorer = new LayoutApprovedPlanTimeKeepingExplorer()

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

  ngOnInit() {
    this.init(this.pathPage);
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: FormGroup) {
    this.submit(formData);
  }

  _applyGroup() {
    if (this.grid.collectionView) {
      var cv = this.grid.collectionView;
      if (cv != null) {
        cv.beginUpdate();
        cv.groupDescriptions.clear();

        var groupDesc = new wjcCore.PropertyGroupDescription('InfoBudget');
        cv.groupDescriptions.push(groupDesc);

        cv.endUpdate();
        this.grid.groupHeaderFormat = '<b>{value}</b> ({count:n0} mục) ';
      }
    }
    this.grid.collapseGroupsToLevel(0);
  }
}
