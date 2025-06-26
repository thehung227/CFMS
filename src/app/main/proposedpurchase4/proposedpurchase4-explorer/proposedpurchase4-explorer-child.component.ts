import { Component, ViewChild, Inject, OnInit, OnDestroy } from '@angular/core';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { element } from 'protractor';
import { LayoutProposedPurchase4Explorer } from '../DeclareLayout';
import { BaseExplorerService } from '../../../base/base.service-explorer';
import { Router } from '@angular/router';
import { InputControlService } from '../../../ui/input/InputControlService';
import { BaseExplorerComponent } from '../../_baseform/base-explorer.component';
import { concat } from 'rxjs/observable/concat';
import { Global } from '../../../shared/global';
import { forEach } from '@angular/router/src/utils/collection';
import { SystemConstants } from '../../../core/common/system.constants';
import { ParameterContract } from '../../../contracts/parameter.contract';
import { BravoCtorEnum } from '../../../core/enum/type.enum';


@Component({
  selector: 'proposedpurchase4-explorer-child',
  templateUrl: './proposedpurchase4-explorer-child.html',

})
export class ProposedPurchase4ExplorerChildComponent implements OnInit, OnDestroy {

  @ViewChild('gridChild') gridChild: wjcGrid.FlexGrid;

  pathPage = ['/main', 'purchaseorder', 'detail'];
  _layoutDeclare: LayoutProposedPurchase4Explorer = new LayoutProposedPurchase4Explorer();

  datachild: wjcCore.CollectionView;
  zChildTableName: string = '';



  constructor(private _service: BaseExplorerService,
    protected router: Router,
    protected ics: InputControlService) {
    this.zChildTableName = this._layoutDeclare.layout.Structure.Child.Name;
  }

  // constructor(srv: BaseExplorerService,
  //   router: Router,
  //   ics: InputControlService) {
  //   super(srv, router, ics)
  //   this.zChildTableName = this._layoutDeclare.layout.Structure.Child.Name;
  // }

  ngOnInit() {


    this.gridChild.autoGenerateColumns = false;
    this.gridChild.isReadOnly = true;
    this.gridChild.selectionMode = wjcGrid.SelectionMode.RowRange;
    this.gridChild.allowSorting = false;
    // this.gridChild.rowHeaders.columns.maxSize = 0;

    this.gridChild.rows.defaultSize = 25;

    this.createColumnGroups(this.gridChild, this._layoutDeclare.childGrid, 0);

    this.doubleClickGrid(this.gridChild, this.pathPage);

  }

  ngAfterViewInit() {
    this.fetchDataChild();
  }

  async fetchDataChild() {

    // let filterChild = this._layoutDeclare.layout.Structure.Child.ChildKey + "='" + localStorage.getItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE) + "'";

    // this._service.fetchDataSelect(Global.DataExplorerEndpoint, this.zChildTableName, filterChild, 1, 50, 'DocNo')
    //   .subscribe(data => {
    //     this.gridChild.itemsSource = new wjcCore.CollectionView(data);
    //     this.datachild = new wjcCore.CollectionView(data);
    //   });

    // //localStorage.removeItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE);
    
    //QUYDV: sửa lại lấy từ Store
    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('ParentBizDocId');
    param1.ParameterValue = localStorage.getItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE).replace(/"/gi, '');
    params.push(param1);

    let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_TMCtc_GetPO_OfSplitPP', params)
      .toPromise().then();

    this.datachild = new wjcCore.CollectionView(_data['data']);
    this.gridChild.itemsSource = new wjcCore.CollectionView(_data['data']); 
  }

  convertParameterName(pzName: string) {
    const DbParamPrefixOld = '@_';
    const DbParamPrefix = '@';

    return pzName.startsWith(DbParamPrefixOld) || pzName.startsWith(DbParamPrefix) ?
      pzName : DbParamPrefixOld + pzName;
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

  doubleClickGrid(grid: wjcGrid.FlexGrid, navigateUrl: any[]) {

    localStorage.removeItem(SystemConstants.ALLOW_DBLCLICK);
    localStorage.setItem(SystemConstants.ALLOW_DBLCLICK, 'false');

    grid.hostElement.addEventListener('dblclick', function (e: Event) {
      e.preventDefault();
      //alert('Không sử dụng double click trên lưới con');
    });
  }

  openGridChild(grid: wjcGrid.FlexGrid, navigateUrl: any[]) {
    let host = grid.hostElement;
    let self = this;

    if (grid.selectedItems[0] != undefined) {
      let key = grid.selectedItems[0]['Id'];
      navigateUrl.push(key);
      //navigateUrl[0] = '#/main';
      //window.open(navigateUrl.join('/'));

      self.router.navigate(navigateUrl);
    }
  }

  ngOnDestroy() {
    // this.destroy();
  }
}