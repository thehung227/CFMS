import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';

import { BaseExplorerService } from '../../../base/base.service-explorer';
import { ParameterContract } from '../../../contracts/parameter.contract';
import { BravoCtorEnum } from '../../../core/enum/type.enum';
import { SystemConstants } from '../../../core/common/system.constants';
import { Global } from '../../../shared/global';

/**
 * Hồ sơ đã duyệt: các bước duyệt mà người đăng nhập đã bấm Duyệt (usp_NEW_HoSoDaDuyet).
 * Nhấp đúp / nút Xem mở màn approved* tương ứng với ?view=1 - base editor ẩn và chặn
 * các nút Duyệt, Trả lại, Đề xuất trả, chỉ còn nút Thoát.
 */
@Component({
  selector: 'hosodaduyet-explorer',
  templateUrl: './hosodaduyet-explorer.component.html',
  styleUrls: ['../../_baseform/newt-modern.css']
})

export class HoSoDaDuyetExplorerComponent implements OnInit {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;

  data = new wjcCore.CollectionView([]);
  showLoading = false;

  fromDate: string;
  toDate: string;
  onlyCurrentProduct = false;
  keyword = '';
  totalCount = 0;

  columns = [
    { header: 'Loại hồ sơ', binding: 'Ten_Ct', width: 220 },
    { header: 'Số hồ sơ', binding: 'DocNo', width: 170 },
    { header: 'Gói thầu / Phòng ban', binding: 'ProductName', width: 260 },
    { header: 'Đối tượng', binding: 'CustomerName', width: 220 },
    { header: 'Nội dung', binding: 'Description', width: 300 },
    { header: 'Bước', binding: 'ApproveGroup', width: 70, dataType: wjcCore.DataType.Number, align: 'center' },
    { header: 'Ngày duyệt', binding: 'FinishDate', width: 140, dataType: wjcCore.DataType.Date, format: 'dd/MM/yyyy HH:mm' },
    { header: 'Ngày đến hạn', binding: 'StartDate', width: 140, dataType: wjcCore.DataType.Date, format: 'dd/MM/yyyy HH:mm' },
    { header: 'Tình trạng hồ sơ', binding: 'DocStatusName', width: 190 },
    { header: 'Người gửi duyệt', binding: 'EmployeeNameSend', width: 170 }
  ];

  constructor(private srv: BaseExplorerService,
    private router: Router,
    titleService: Title) {
    titleService.setTitle('Hồ sơ đã duyệt');
  }

  ngOnInit() {
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    this.toDate = this.toInputDate(today);
    this.fromDate = this.toInputDate(from);

    this.grid.autoGenerateColumns = false;
    this.grid.isReadOnly = true;
    this.grid.selectionMode = wjcGrid.SelectionMode.Row;
    this.grid.headersVisibility = wjcGrid.HeadersVisibility.Column;
    this.grid.columnHeaders.rows.defaultSize = 38;
    this.grid.rows.defaultSize = 32;

    for (let c of this.columns) {
      const col = new wjcGrid.Column();
      for (let prop in c)
        col[prop] = c[prop];
      this.grid.columns.push(col);
    }

    // Duyệt trễ hạn: tô chữ cam cho cột Ngày duyệt.
    this.grid.formatItem.addHandler((s: wjcGrid.FlexGrid, e: wjcGrid.FormatItemEventArgs) => {
      if (e.panel.cellType != wjcGrid.CellType.Cell) return;
      const item = s.rows[e.row].dataItem;
      const isLate = item && !(item instanceof wjcCore.CollectionViewGroup) && item['IsLate']
        && s.columns[e.col].binding == 'FinishDate';
      wjcCore.toggleClass(e.cell, 'hsd-late', !!isLate);
    });

    this.grid.hostElement.addEventListener('dblclick', (e: MouseEvent) => {
      const ht = this.grid.hitTest(e);
      if (ht.cellType == wjcGrid.CellType.Cell)
        this.openSelected();
    });

    this.load();
  }

  async load() {
    this.showLoading = true;
    try {
      const params = new Array<ParameterContract>();
      params.push(this.param('EmployeeCode', this.storage(SystemConstants.CURRENT_EMPLOYEE)));
      params.push(this.param('BranchCode', this.storage(SystemConstants.CURRENT_BRANCH)));
      params.push(this.param('ProductCostId', this.onlyCurrentProduct ? this.storage(SystemConstants.PRODUCTCOSTID) : ''));
      params.push(this.param('DocDate1', (this.fromDate || '').replace(/-/g, '')));
      params.push(this.param('DocDate2', (this.toDate || '').replace(/-/g, '')));
      params.push(this.param('UserId', localStorage.getItem(SystemConstants.CURRENT_USERID)));

      const res = await this.srv.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_NEW_HoSoDaDuyet', params)
        .toPromise();

      const rows = <any[]>(res && res['data'] ? res['data'] : []);
      for (let r of rows) {
        r.FinishDate = r.FinishDate ? new Date(r.FinishDate) : null;
        r.StartDate = r.StartDate ? new Date(r.StartDate) : null;
      }

      this.data = new wjcCore.CollectionView(rows);
      this.data.filter = (item: any) => this.matchKeyword(item);
      this.data.groupDescriptions.push(new wjcCore.PropertyGroupDescription('Ten_Ct'));
      this.grid.itemsSource = this.data;
      this.grid.groupHeaderFormat = '<b>{value}</b> ({count:n0} hồ sơ)';
      this.totalCount = rows.length;
    }
    catch (ex) {
      console.log(ex);
      alert('Không tải được danh sách hồ sơ đã duyệt.');
    }
    finally {
      this.showLoading = false;
    }
  }

  get visibleCount(): number {
    return this.data ? this.data.items.length : 0;
  }

  onKeywordChange() {
    if (this.data) this.data.refresh();
  }

  collapseGroups(level: number) {
    this.grid.collapseGroupsToLevel(level);
  }

  openSelected() {
    const item = this.grid.collectionView ? this.grid.collectionView.currentItem : null;
    if (!item || item instanceof wjcCore.CollectionViewGroup) {
      alert('Chọn một hồ sơ để xem.');
      return;
    }
    if (!item['_LinkCommandWeb']) {
      alert('Loại hồ sơ "' + (item['Ten_Ct'] || item['DocCode']) + '" chưa có màn hình xem trên web.');
      return;
    }
    this.router.navigate([item['_LinkCommandWeb'], item['Id']], { queryParams: { view: 1 } });
  }

  private matchKeyword(item: any): boolean {
    const kw = (this.keyword || '').trim().toLowerCase();
    if (!kw) return true;
    return ['Ten_Ct', 'DocNo', 'ProductName', 'CustomerName', 'Description', 'EmployeeNameSend']
      .some(f => item[f] != null && item[f].toString().toLowerCase().indexOf(kw) > -1);
  }

  private param(name: string, value: any): ParameterContract {
    const p = new ParameterContract();
    p.ParameterName = '@_' + name;
    p.ParameterValue = value;
    return p;
  }

  private storage(key: string): string {
    const v = localStorage.getItem(key);
    return v ? v.replace(/"/gi, '') : '';
  }

  private toInputDate(d: Date): string {
    const pad = (n: number) => (n < 10 ? '0' : '') + n;
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
}
