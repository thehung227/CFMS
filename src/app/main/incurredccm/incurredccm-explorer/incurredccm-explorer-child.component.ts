import { Component, ViewChild, Inject, OnInit, OnDestroy } from '@angular/core';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { element } from 'protractor';
import { LayoutIncurredCcmExplorer } from '../DeclareLayout';
import { BaseExplorerService } from '../../../base/base.service-explorer';
import { Router } from '@angular/router';
import { InputControlService } from '../../../ui/input/InputControlService';
import { BaseExplorerComponent } from '../../_baseform/base-explorer.component';
import { concat } from 'rxjs/observable/concat';
import { Global } from '../../../shared/global';
import { forEach } from '@angular/router/src/utils/collection';
import { SystemConstants } from '../../../core/common/system.constants';
import { Popup } from '../../../../../node_modules/wijmo/wijmo.input';


@Component({
  selector: 'incurredccm-explorer-child',
  templateUrl: './incurredccm-explorer-child.html',

})
export class IncurredCcmExplorerChildComponent implements OnInit, OnDestroy {

  @ViewChild('gridChild') gridChild: wjcGrid.FlexGrid;

  pathPage = ['/main', 'approvedincurredccm', 'detail'];
  _layoutDeclare: LayoutIncurredCcmExplorer = new LayoutIncurredCcmExplorer();

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

    this.dbClickCellContent(this.gridChild);
  }

  ngAfterViewInit() {
    this.fetchDataChild();
  }

  fetchDataChild() {

    let filterChild = this._layoutDeclare.layout.Structure.Child.ChildKey + "='" + localStorage.getItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE) + "'";

    this._service.fetchDataSelect(Global.DataExplorerEndpoint, this.zChildTableName, filterChild, 1, 50, 'ApproveGroup')
      .subscribe(data => {
        this.gridChild.itemsSource = new wjcCore.CollectionView(data);
        this.datachild = new wjcCore.CollectionView(data);
      });

    //localStorage.removeItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE);
  }

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
    // if (self.zChildTableName != undefined)
    // {
    //   return;
    // }
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

    if (grid.selectedRows[0].dataItem['EmployeeCode'] == localStorage.getItem(SystemConstants.CURRENT_EMPLOYEE).replace(/"/gi, '') ||
      localStorage.getItem(SystemConstants.CURRENT_ISSYSADMIN) == 'true' ||
      grid.selectedRows[0].dataItem['PositionCode'] == localStorage.getItem(SystemConstants.POSITION_EMPLOYEE).replace(/"/gi, '')) {
      let i = grid.selectedRows[0]._idx;
      if (grid.rows[i + 1] != undefined && grid.rows[i + 1].dataItem['ApproveStatus'] == 1 && localStorage.getItem(SystemConstants.CURRENT_ISSYSADMIN) == 'false') {
        alert('Hồ sơ đã được duyệt ở cấp bậc trên, không thể duyệt lại!');
      } else
        if (grid.rows[i - 1] != undefined && grid.rows[i - 1].dataItem['ApproveStatus'] == 0 && localStorage.getItem(SystemConstants.CURRENT_ISSYSADMIN) == 'false') {
          alert('Hồ sơ chưa được duyệt ở cấp bậc dưới, không thể duyệt!');
        } else {
          let key = grid.selectedItems[0]['Id'];
          navigateUrl.push(key);

          //navigateUrl[0] = '#/main';
          //window.open(navigateUrl.join('/'));

          self.router.navigate(navigateUrl);
        }
    }
    else {
      alert('Người sử dụng hiện thời không có quyền truy cập.');
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

      pop.show();


    });
  }
}