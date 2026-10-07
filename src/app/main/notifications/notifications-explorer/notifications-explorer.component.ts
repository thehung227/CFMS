import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
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
import { Location } from '@angular/common';

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
import { toSearchText, matchesAllWords } from '../../../shared/search-text';

/** Trạng thái một hồ sơ - cùng quy tắc tô màu dòng trên lưới. */
type RowStatus = 'returned' | 'overdue' | 'ontime';

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

  /** Lọc nhanh: thẻ trạng thái + ô tìm kiếm (không dấu). Áp lên dữ liệu gốc allRows. */
  kpis = [
    { key: 'all', label: 'Tất cả hồ sơ', icon: 'fa-folder-open-o' },
    { key: 'overdue', label: 'Quá hạn / đến hạn', icon: 'fa-exclamation-circle' },
    { key: 'returned', label: 'Bị trả lại', icon: 'fa-reply' },
    { key: 'ontime', label: 'Còn trong hạn', icon: 'fa-clock-o' }
  ];
  stats = { all: 0, overdue: 0, returned: 0, ontime: 0 };
  statusFilter = 'all';
  searchText = '';
  private allRows: any[] = [];
  private rowSearchText = new Map<any, string>();
  private searchTimer: any;
 

  constructor(private srv: BaseExplorerService,
    private router: Router,
    private location: Location,
    private ics: InputControlService, titleService: Title) {
  }
  nUserId: string;

  async ngOnInit() {
    this.nUserId = localStorage.getItem(SystemConstants.CURRENT_USERID);
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

    this.setRows(_data['data'] || []);
    this.showLoading = false;
  }

  /** Số hồ sơ đang hiển thị (sau lọc nhanh + bộ lọc cột của lưới). */
  get visibleCount(): number {
    return this.data && this.data.items ? this.data.items.length : 0;
  }

  setStatusFilter(key: string) {
    this.statusFilter = this.statusFilter === key ? 'all' : key;
    this.applyQuickFilter();
  }

  onSearchInput(value: string) {
    this.searchText = value;
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.applyQuickFilter(), 150);
  }

  clearQuickFilter() {
    this.searchText = '';
    this.statusFilter = 'all';
    this.applyQuickFilter();
  }

  private setRows(rows: any[]) {
    const bindings = this._layoutDeclare.parentGrid.map(c => c['binding']).filter(b => !!b);
    this.allRows = rows;
    this.rowSearchText.clear();
    this.stats = { all: rows.length, overdue: 0, returned: 0, ontime: 0 };

    rows.forEach(row => {
      this.stats[this.rowStatus(row)]++;
      this.rowSearchText.set(row, toSearchText(bindings.map(b => row[b]).join(' ')));
    });

    this.data = new wjcCore.CollectionView(this.filterRows());
    this.grid.itemsSource = this.data;
  }

  private applyQuickFilter() {
    if (this.data) {
      // Đổi sourceCollection giữ nguyên nhóm (DocType, ProductName) và bộ lọc cột đang chọn.
      this.data.sourceCollection = this.filterRows();
    }
  }

  private filterRows(): any[] {
    const query = toSearchText(this.searchText);
    const words = query ? query.split(' ') : [];
    return this.allRows.filter(row =>
      (this.statusFilter === 'all' || this.rowStatus(row) === this.statusFilter) &&
      (!words.length || matchesAllWords(words, this.rowSearchText.get(row) || '')));
  }

  private rowStatus(row: any): RowStatus {
    if (row['CheckReturn'] > 0) {
      return 'returned';
    }
    if ((row['DayOfDelay'] < 0) || row['DayOfDelay'] == 0) {
      return 'overdue';
    }
    return 'ontime';
  }

  async ApprovedAll(resetProductCostId: boolean = false) {
    // Duyệt đúng các dòng đang hiển thị (đã qua lọc nhanh / lọc cột) -> xác nhận trước khi ghi.
    if (!this.visibleCount || !confirm('Duyệt theo lô ' + this.visibleCount + ' hồ sơ đang hiển thị?')) {
      return;
    }
    this.showLoading = true;
    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param4 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('EmployeeCode');
    param1.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_EMPLOYEE).replace(/"/gi, '');
    params.push(param1);

    param2.ParameterName = this.convertParameterName('BranchCode');
    param2.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
    params.push(param2);

    param4.ParameterName = this.convertParameterName('UserId');
    param4.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID);
    params.push(param4);

    const rawData = this.grid.itemsSource._pgView;

    const selectedColumns = ['Id','ApproveGroup']; // <-- Chỉ định các cột bạn muốn lấy

    const filteredData = this.grid.itemsSource._pgView.map(row => {
      let newRow = {};
      selectedColumns.forEach(key => newRow[key] = row[key]);
      return newRow;
    });

  const jsonData = JSON.stringify(filteredData);

    let paramJson = new ParameterContract();
    paramJson.ParameterName = '@_JsonData';
    paramJson.ParameterValue = jsonData;
    params.push(paramJson);
    
    await this.srv.getDataOutput(
      Global.DATA_ENDPOINT,
      BravoCtorEnum.StoreProcedure,
      'usp_DuyetTheoLo',
      params
    ).toPromise();

    this.LoadStore();
    // let _data = await this.srv.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Coteccons_ApproveNotifications', params)
    //   .toPromise().then();

    // this.data = new wjcCore.CollectionView(_data['data']);
    // this.grid.itemsSource = new wjcCore.CollectionView(_data['data']);
    // this.showLoading = false;
  }

  // Kéo lưới cao tới sát footer: vị trí đầu lưới đổi theo header (thẻ KPI có thể xuống dòng) nên đo lúc chạy.
  @HostListener('window:resize')
  fitGridHeight() {
    const host: HTMLElement = this.grid && this.grid.hostElement;
    if (!host) return;
    const footer = document.querySelector('.main-footer') as HTMLElement;
    const top = host.getBoundingClientRect().top + window.pageYOffset;
    const bottomGap = (footer ? footer.offsetHeight : 0) + 24; // padding đáy .nt-inbox + viền card
    host.style.height = Math.max(420, window.innerHeight - top - bottomGap) + 'px';
    this.grid.invalidate();
  }

  ngAfterViewInit() {
    setTimeout(() => this.fitGridHeight());

    this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          const status = this.rowStatus(data);
          wjcCore.setCss(e.cell, {
            color: status === 'returned' ? 'orange' : status === 'overdue' ? 'red' : ''
          });

          // Không chỉ dựa vào màu: thêm icon trạng thái ở cột "Loại hồ sơ".
          if (status !== 'ontime' && s.columns[e.col].binding === 'Ten_Ct') {
            const icon = status === 'returned' ? 'fa-reply' : 'fa-exclamation-circle';
            const title = status === 'returned' ? 'Bị trả lại' : 'Quá hạn / đến hạn';
            e.cell.innerHTML = '<i class="fa ' + icon + '" title="' + title + '" style="margin-right:6px"></i>' +
              wjcCore.escapeHtml(e.cell.textContent);
          }
        }
      }
    });
  }

  itemsSourceChangedHandler() {
    this._applyGroup();
  }

  /** Nhấp đúp vào ô dữ liệu -> mở hồ sơ ở tab mới (bỏ qua header, viền cột, dòng nhóm). */
  doubleClickGrid(grid: wjcGrid.FlexGrid) {
    grid.hostElement.addEventListener('dblclick', (e: MouseEvent) => {
      const ht = grid.hitTest(e);
      if (ht.cellType !== wjcGrid.CellType.Cell || ht.row < 0 || grid.rows[ht.row] instanceof wjcGrid.GroupRow) {
        return;
      }
      const item = grid.rows[ht.row].dataItem;
      if (item) {
        this.openRecord(item);
      }
    });
  }

  editExplorer(grid: wjcGrid.FlexGrid) {
    if (!grid.selectedItems[0]) {
      alert('Chọn dữ liệu hợp lệ để thực hiện!');
    }
    else {
      this.openRecord(grid.selectedItems[0]);
    }
  }

  /** Mở hồ sơ ở tab mới (trước đây dùng router.navigate trong cùng tab). */
  private openRecord(item: any) {
    const link = item['_LinkCommandWeb'];
    const key = item['Id'];
    let navigateUrl: any[];

    if (item['DocCode'] == 'PO' && item['ApproveSend'] == 0) {
      // Sao chép cấu hình: không ghi đè {EXPR=...} gốc, vì màn này vẫn mở để chọn hồ sơ khác.
      const paramsEdit = Object.assign({}, this._layoutDeclare.layout.CopiedValues.parameter);

      for (let control in paramsEdit) {

        if (paramsEdit[control].toString().indexOf('{EXPR=') > -1) {
          paramsEdit[control] = Global.translateAutoText(paramsEdit[control], item);
          if (paramsEdit[control].toString().indexOf('?') > -1)
            paramsEdit[control] = eval(paramsEdit[control]);
        }

        if (paramsEdit[control].toString().indexOf('{VAR=') > -1)
          paramsEdit[control] = Global.convertConfig(paramsEdit[control]);

        paramsEdit[control] = Global.replaceString(paramsEdit[control], "'");
      }

      navigateUrl = [link, '-1', encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(paramsEdit)))];
    }
    else if (key) {
      navigateUrl = [link, key];
    }
    else {
      return;
    }

    // Cùng cách mã hoá URL như router.navigate; prepareExternalUrl thêm "#" (useHash).
    const url = this.location.prepareExternalUrl(this.router.serializeUrl(this.router.createUrlTree(navigateUrl)));
    const tab = window.open(url, '_blank');
    if (!tab) {
      alert('Trình duyệt đã chặn mở tab mới. Vui lòng cho phép popup cho trang này.');
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
