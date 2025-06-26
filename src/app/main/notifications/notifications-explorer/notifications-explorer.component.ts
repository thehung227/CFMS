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
import { Router } from '@angular/router';

import { InputBase } from './../../../ui/input/InputBase';
import { DropDownInput } from './../../../ui/input/DropDownInput';
import { TextBoxInput } from './../../../ui/input/TextBoxInput';
import { DateBoxInput } from './../../../ui/input/DateBoxInput';
import { NumberBoxInput } from './../../../ui/input/NumberBoxInput';
import { CheckBoxInput } from './../../../ui/input/CheckBoxInput';

import { ParameterContract } from './../../../contracts/parameter.contract';
import { BravoCtorEnum } from './../../../core/enum/type.enum';
import { LayoutNotificationsExplorer } from '../DeclareLayout';
import { BaseExplorerComponent } from '../../_baseform/base-explorer.component';
import { BaseEditorService } from '../../../base/base.service-editor';
import { BaseExplorerService } from '../../../base/base.service-explorer';
import { DialogComponent } from '../../../ui/dialog/dialog.component';
import { Title } from '@angular/platform-browser';
import { SystemConstants } from '../../../core/common/system.constants';
import { CryptoExtension } from '../../../core/extensions/crypto.extension';
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';

@Component({
  selector: 'notifications-explorer',
  templateUrl: './notifications-explorer.component.html',
  styleUrls: ['./notifications-explorer.component.css']
})

export class NotificationsExplorerComponent {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('contentFilter') contentFilter: ElementRef;
  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

  data: wjcCore.CollectionView;
  _layoutDeclare: LayoutNotificationsExplorer = new LayoutNotificationsExplorer()
  showLoading = false;

  pathPage = ['/main', 'notifications', 'detail'];

  constructor(private srv: BaseExplorerService,
    private router: Router,
    private ics: InputControlService, titleService: Title) {
  }

  async ngOnInit() {
    this.data = new wjcCore.CollectionView();
    this.grid.autoGenerateColumns = false;
    this.grid.isReadOnly = true;
    this.grid.rowHeaders.columns.maxSize = 2;
    this.grid.columnHeaders.rows[0].height = 41;
    // //this.grid.headersVisibility = wjcGrid.HeadersVisibility.None;

    this.bindColumnGroups(this.grid, this._layoutDeclare.parentGrid);

    // // this.grid.columnHeaders.rows.forEach(row => {
    // //     row.wordWrap = true;
    // // });
    this.LoadStore();
    this.doubleClickGrid(this.grid);
  }

  async LoadStore(resetProductCostId: boolean = false) {
    this.showLoading = true;
    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();
    const param4 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('EmployeeCode');
    param1.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_EMPLOYEE).replace(/"/gi, '');
    params.push(param1);

    param2.ParameterName = this.convertParameterName('BranchCode');
    param2.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
    params.push(param2);

    //lúc mới vào, chưa chọn gói thầu sẽ null
    if (resetProductCostId == false && (localStorage.getItem(SystemConstants.PRODUCTCOSTID) != null || localStorage.getItem(SystemConstants.PRODUCTCOSTID)) != undefined) {
      param3.ParameterName = this.convertParameterName('ProductCostId');
      param3.ParameterValue = localStorage.getItem(SystemConstants.PRODUCTCOSTID).replace(/"/gi, '');
      params.push(param3);
    }

    param4.ParameterName = this.convertParameterName('UserId');
    param4.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID);
    params.push(param4);

    let _data = await this.srv.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Coteccons_ApproveNotifications', params)
      .toPromise().then();

    this.data = new wjcCore.CollectionView(_data['data']);
    this.grid.itemsSource = new wjcCore.CollectionView(_data['data']);
    this.showLoading = false;
  }

  ngAfterViewInit() {

    this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          console.log(data['CheckReturn'])
          if (data['CheckReturn'] > 0) {
            wjcCore.setCss(e.cell, {
              color: 'Orange',
              //fontWeight: 'Bold',
              // backgroundColor: ''
            });
          }
          else
          if (data['DayOfDelay'] <= 0) {
            wjcCore.setCss(e.cell, {
              color: 'red',
              //fontWeight: 'Bold',
              // backgroundColor: ''
            });
          }
          else {
            wjcCore.setCss(e.cell, {
              color: '',
              // fontWeight: '',
              // backgroundColor: ''
            });
          }
        }
      }
    });
  }

  itemsSourceChangedHandler() {
    this._applyGroup();
  }

  doubleClickGrid(grid: wjcGrid.FlexGrid) {
    let navigateUrl: any[] = [];
    let host = grid.hostElement;
    let self = this;

    let paramsEdit = this._layoutDeclare.layout.CopiedValues.parameter;

    host.addEventListener('dblclick', function (e) {
      if (grid.selectedItems[0] != null && grid.selectedItems[0] != undefined) {
        let key = grid.selectedItems[0]['Id'];
        let link = grid.selectedItems[0]['_LinkCommandWeb'];

        let doccode = grid.selectedItems[0]['DocCode'];
        let approvesend = grid.selectedItems[0]['ApproveSend'];

        let EmployeeCode = grid.selectedItems[0]['EmployeeCode_t2'];
        let PositionCode = grid.selectedItems[0]['PositionCode'];
        // localStorage.removeItem(SystemConstants.PRODUCTCOSTID);
        // localStorage.setItem(SystemConstants.PRODUCTCOSTID, grid.selectedItems[0]['ProductCostId']);

        if (doccode == 'PO' && approvesend == 0) {
          navigateUrl.push(link);
          navigateUrl.push('-1');

          for (let control in paramsEdit) {

            if (paramsEdit[control].toString().indexOf('{EXPR=') > -1) {
              paramsEdit[control] = Global.translateAutoText(paramsEdit[control], grid.selectedItems[0]);
              if (paramsEdit[control].toString().indexOf('?') > -1)
                paramsEdit[control] = eval(paramsEdit[control]);
            }

            if (paramsEdit[control].toString().indexOf('{VAR=') > -1)
              paramsEdit[control] = Global.convertConfig(paramsEdit[control]);

            paramsEdit[control] = Global.replaceString(paramsEdit[control], "'");
          }

          if (paramsEdit != undefined && paramsEdit != null) {
            let _value = encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(paramsEdit)));
            navigateUrl.push(_value);
          }

          self.router.navigate(navigateUrl);

          navigateUrl = [];
        }
        else {
          if (key) {
            navigateUrl.push(link);
            navigateUrl.push(key);

            //window.open(navigateUrl.join('/'));
            self.router.navigate(navigateUrl);

            navigateUrl = [];
          }
        }
      }
    });
  }

  editExplorer(grid: wjcGrid.FlexGrid) {
    let navigateUrl: any[] = [];
    let host = grid.hostElement;
    let self = this;

    let paramsEdit = this._layoutDeclare.layout.CopiedValues.parameter;

    if (!grid.selectedItems[0]) {
      alert('Chọn dữ liệu hợp lệ để thực hiện!');
    }
    else {
      if (grid.selectedItems[0] != null && grid.selectedItems[0] != undefined) {
        let key = grid.selectedItems[0]['Id'];
        let link = grid.selectedItems[0]['_LinkCommandWeb'];

        let doccode = grid.selectedItems[0]['DocCode'];
        let approvesend = grid.selectedItems[0]['ApproveSend'];

        if (doccode == 'PO' && approvesend == 0) {
          navigateUrl.push(link);
          navigateUrl.push('-1');

          for (let control in paramsEdit) {

            if (paramsEdit[control].toString().indexOf('{EXPR=') > -1) {
              paramsEdit[control] = Global.translateAutoText(paramsEdit[control], grid.selectedItems[0]);
              if (paramsEdit[control].toString().indexOf('?') > -1)
                paramsEdit[control] = eval(paramsEdit[control]);
            }

            if (paramsEdit[control].toString().indexOf('{VAR=') > -1)
              paramsEdit[control] = Global.convertConfig(paramsEdit[control]);

            paramsEdit[control] = Global.replaceString(paramsEdit[control], "'");
          }

          if (paramsEdit != undefined && paramsEdit != null) {
            let _value = encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(paramsEdit)));
            navigateUrl.push(_value);
          }

          self.router.navigate(navigateUrl);

          navigateUrl = [];
        }
        else {
          if (key) {
            navigateUrl.push(link);
            navigateUrl.push(key);

            //window.open(navigateUrl.join('/'));
            self.router.navigate(navigateUrl);

            navigateUrl = [];
          }
        }
      }
    }
  }

  private _groupBy = 'DocType,ProductName';
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
    this.grid.collapseGroupsToLevel(2);
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

  bindColumnGroups(flex: wjcGrid.FlexGrid, columnGroups: any): void {

    // create the columns
    flex.allowSorting = true;
    this.createColumnGroups(flex, columnGroups, 0);

    var colHdrs = flex.columnHeaders;
    for (var nRow = 0; nRow < colHdrs.rows.length - 1; nRow++)
      for (var nCol = 0; nCol < colHdrs.columns.length; nCol++) {
        var data = colHdrs.getCellData(nRow, nCol, false);
        if (!data && (nRow - 1) >= 0)
          colHdrs.setCellData(nRow, nCol, colHdrs.getCellData(nRow - 1, nCol, true));
      }

    let _formatItem = (s, e: wjcGrid.FormatItemEventArgs) => {

      if (e.panel.cellType === wjcGrid.CellType.ColumnHeader) {
        // e.cell.innerHTML = '<div><input type="text" style="width:100%;"></input></br><div>' + e.cell.innerHTML + '</div></div>';

        let column = flex.columns[e.col];
        if (column.dataType == wjcCore.DataType.Boolean) {
          e.cell.innerHTML = '<div><input type="checkbox">' + e.cell.innerHTML + '</div>';

          var cnt = 0;
          for (var i = 0; i < flex.rows.length; i++) {
            if (s.getCellData(i, e.col) == true) cnt++;
          }

          var cb = e.cell.getElementsByTagName('input')[0];

          cb.checked = cnt > 0;
          cb.indeterminate = cnt > 0 && cnt < flex.rows.length;

          // apply checkbox value to cells
          cb.addEventListener('click', function (e) {
            flex.beginUpdate();
            for (var i = 0; i < flex.rows.length; i++) {
              flex.setCellData(i, column.index, cb.checked);
            }
            flex.endUpdate();
          });

        }
        else {
          e.cell.innerHTML = '<div>' + e.cell.innerHTML + '</div>';
        }


        wjcCore.setCss(e.cell, {
          display: 'table',
          tableLayout: 'fixed',
          // fontSize: '12px',
        });

        wjcCore.setCss(e.cell.children[0], {
          display: 'table-cell',
          verticalAlign: 'middle',
          textAlign: 'center'
          // fontSize: '12px',
        },

        );

        wjcCore.setCss(e.cell.children[0], {
          textAlign: '-webkit-center'
        },

        );

        wjcCore.setCss(e.cell.children[0], {
          textAlign: '-moz-center'
        },

        );
      }

    }
    flex.formatItem.removeHandler(_formatItem);
    flex.formatItem.addHandler(_formatItem);

    // set autosize row header

    let _itemsSourceChanged = (s: wjcGrid.FlexGrid, e) => {
      setTimeout(function () {
        for (var n = 0; n < s.columnHeaders.rows.length; n++) {
          // enable wrapping on first header row
          var row = s.columnHeaders.rows[n];
          row.wordWrap = true;
        }
      });
    }

    flex.itemsSourceChanged.removeHandler(_itemsSourceChanged);
    flex.itemsSourceChanged.addHandler(_itemsSourceChanged);
  }
}
