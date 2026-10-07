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
import { BaseExplorerComponent } from '../../_baseform/base-explorer.component';
import { BaseEditorService } from '../../../base/base.service-editor';
import { BaseExplorerService } from '../../../base/base.service-explorer';
import { Title } from '@angular/platform-browser';
import { LayoutApprovedConcreteBudgetExplorer } from '../Layout';
import { CryptoExtension } from '../../../core/extensions/crypto.extension';

@Component({
  selector: 'approvedconcretebudget-explorer',
  templateUrl: './approvedconcretebudget-explorer.component.html',
  styleUrls: ['./approvedconcretebudget-explorer.component.css']
})

export class ApprovedConcreteBudgetExplorerComponent extends BaseExplorerComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('contentFilter') contentFilter: ElementRef;

  pathPage = ['/main', 'approvedconcretebudget', 'detail'];
  _layoutDeclare :LayoutApprovedConcreteBudgetExplorer = new LayoutApprovedConcreteBudgetExplorer()

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

  // Mở "Báo cáo nhanh sản lượng bê tông dự án" (reporterconcretequick) ở tab mới cho gói thầu
  // của dòng đang chọn; báo cáo tự chạy nhờ tham số ProductCostId truyền trên url.
  openQuickConcreteReport(grid: wjcGrid.FlexGrid) {
    let item: any = (grid.selectedItems && grid.selectedItems.length > 0) ? grid.selectedItems[0] : null;
    let productCostId: string = item ? item['ProductCostId'] : '';

    if (!productCostId) {
      alert('Chọn 1 dòng kế hoạch bê tông trước khi mở báo cáo.');
      return;
    }

    let params = { 'Commandkey': 'REP07_BCNBT', 'ProductCostId': productCostId };
    let navigateUrl: any = ['#/main', 'reporterconcretequick', 'view', 'REP07_BCNBT',
      encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)))];

    window.open(navigateUrl.join('/'));
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
