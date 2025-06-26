import { Component, ViewChild, Inject, OnInit, OnDestroy } from '@angular/core';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { element } from 'protractor';
import { LayoutProposedPurchase2Explorer } from '../DeclareLayout';
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
  selector: 'proposedpurchase2-explorer-child',
  templateUrl: './proposedpurchase2-explorer-child.html',

})
export class ProposedPurchase2ExplorerChildComponent implements OnInit, OnDestroy {

  @ViewChild('gridChild') gridChild: wjcGrid.FlexGrid;
  @ViewChild('gridChild1') gridChild1: wjcGrid.FlexGrid;

  pathPage = ['/main', 'approvedproposedpurchase2', 'detail'];
  pathPage1 = ['/main', 'purchaseorder', 'detail'];
  _layoutDeclare: LayoutProposedPurchase2Explorer = new LayoutProposedPurchase2Explorer();

  datachild: wjcCore.CollectionView;
  datachild1: wjcCore.CollectionView;
  zChildTableName: string = '';
  zChildTableName1: string = '';


  constructor(private _service: BaseExplorerService,
    protected router: Router,
    protected ics: InputControlService) {
    this.zChildTableName = this._layoutDeclare.layout.Structure.Child.Name;
    //this.zChildTableName1 = this._layoutDeclare.layout.Structure.Child1.Name;
  }

  async ngOnInit() {

    this.gridChild.autoGenerateColumns = false;
    this.gridChild.columns.clear();
    this.createColumnGroups(this.gridChild, this._layoutDeclare.childGrid, 0);
    this.gridChild.isReadOnly = true;

    this.gridChild.selectionMode = wjcGrid.SelectionMode.RowRange;
    this.gridChild.allowSorting = false;
    this.gridChild.rows.defaultSize = 25;
    //this.onTabClick(0);



    // this.gridChild1.autoGenerateColumns = false;
    // this.gridChild1.columns.clear();
    // this.createColumnGroups(this.gridChild1, this._layoutDeclare.childGrid1, 0);
    // this.gridChild1.isReadOnly = true;

    // this.gridChild1.selectionMode = wjcGrid.SelectionMode.RowRange;
    // this.gridChild1.allowSorting = false;
    // this.gridChild1.rows.defaultSize = 25;
  }

  ngAfterViewInit() {
    this.fetchDataChild();
    //this.fetchDataChild1();
  }

  // onTabClick(gridNum: number) {
  //   switch (gridNum) {
  //     case 0:
  //       this.gridChild.columns.clear();
  //       this.createColumnGroups(this.gridChild, this._layoutDeclare.childGrid, 0);
  //       break;
  //     case 1:
  //       this.gridChild1.columns.clear();
  //       this.createColumnGroups(this.gridChild1, this._layoutDeclare.childGrid1, 0);
  //       break;
  //   }
  // }

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

  // fetchDataChild1() {
  //   let filterChild1 = this._layoutDeclare.layout.Structure.Child1.ChildKey + "='" + localStorage.getItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE) + "'";

  //   this._service.fetchDataSelect(Global.DataExplorerEndpoint, this.zChildTableName1, filterChild1, 1, 50, 'DocNo')
  //     .subscribe(data => {
  //       this.gridChild1.itemsSource = new wjcCore.CollectionView(data);
  //       this.datachild1 = new wjcCore.CollectionView(data);
  //     });
  //   //localStorage.removeItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE);
  // }

  ngOnDestroy() {
    // this.destroy();
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

  async openGridChild(grid: wjcGrid.FlexGrid, navigateUrl: any[]) {
    let host = grid.hostElement;
    let self = this;

    if (grid.selectedItems[0] != undefined) {

      //kiểm tra quyền của QS có được xem giá
      let params = new Array<ParameterContract>();
      const param1 = new ParameterContract();
      const param2 = new ParameterContract();

      param1.ParameterName = Global.convertParameterName('IdBizDoc');
      param1.ParameterValue = grid.selectedItems[0]['Id'];
      params.push(param1);

      param2.ParameterName = Global.convertParameterName('nUserId');
      param2.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID);
      params.push(param2);

      let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_TMCtc_Check_UserIsSeePrice', params).toPromise().then();

      let output = <Array<Object>>(_data['output']);
      let _err = output['@_Error'];
      let _errMess = output['@_ErrorMessage'];
 
      if (_err == false) {
        let key = grid.selectedItems[0]['Id'];
        navigateUrl.push(key);
        //navigateUrl[0] = '#/main';
        //window.open(navigateUrl.join('/'));

        self.router.navigate(navigateUrl);
      }
      else
        alert(_errMess);
    }
  }
}