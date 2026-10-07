import { Component, ViewChild, OnInit, OnDestroy, ElementRef } from "@angular/core";
import { BaseEditorComponent } from "../../_baseform/base-editor.component";

import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { DynamicFormPanelComponent } from "../../../ui/form/dynamic-form-panel.component";
import { BaseEditorService } from "../../../base/base.service-editor";
import { ActivatedRoute, Router } from "@angular/router";
import { PanelControlService } from "../../../ui/panel/PanelControlService";
import { LayoutAllocSettlementEditEditor } from "../Layout";
import { Title } from "@angular/platform-browser";

/**
 * Điều chỉnh quyết toán chi phí phân bổ (P5 - PayTeamType 02).
 * Chỉ cho sửa số liệu và bổ sung tài liệu đính kèm của hồ sơ đã gửi duyệt:
 *  - không validate số liệu, không tự tính lại (Layout không khai báo evaluator),
 *  - không gửi duyệt / tải lại bước duyệt; các tab Bước duyệt, WorkFlow, Hóa đơn chỉ xem
 *    và được khai báo IsView = 'view' nên không nằm trong dữ liệu lưu.
 */
@Component({
  selector: 'app-allocsettlementedit-editor-form',
  templateUrl: './allocsettlementedit-editor.component.html',
  styleUrls: ['./allocsettlementedit-editor.component.css']
})

export class AllocSettlementEditEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {
  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  indexPage = ['/main', 'allocsettlementedit', 'index'];
  folderName = 'Thanh_Toan_ChiPhi_PhanBo';
  indexPage_Editor = ['/main', 'allocsettlementedit', 'detail'];

  activeTab = 'detail';
  showConfirmSave = false;

  /**
   * Khung nội dung của đầu phiếu, cùng cơ chế với màn contract: `key` là field ĐẦU
   * TIÊN của khung theo thứ tự trong Layout.panels. Không tách nhiều TablePanel vì
   * base editor chỉ quản lý panel đầu (@ViewChild('dfpanel')), nên giữ một panel và
   * chèn thanh tiêu đề vào giữa các field - xem renderFieldGroupHeaders().
   */
  private fieldGroups = [
    { key: 'DocNo', title: 'Thông tin hồ sơ', icon: 'fa-file-text-o' },
    { key: 'ContractValue', title: 'Giá trị hợp đồng', icon: 'fa-handshake-o' },
    { key: 'TaxCode', title: 'Số liệu điều chỉnh', icon: 'fa-pencil-square-o' },
    { key: 'Date_CCMPrint', title: 'Tiến độ luân chuyển hồ sơ', icon: 'fa-clock-o' },
    { key: 'FilePath', title: 'Trạng thái & tài liệu đính kèm', icon: 'fa-paperclip' }
  ];

  private _fieldGroupsRendered = false;

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutAllocSettlementEditEditor(service, this.parentData);
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4];
    this.init();
    // Chi tiết: sửa số liệu dòng có sẵn, không thêm dòng mới.
    this.grid.allowAddNew = false;
    // Tài liệu đính kèm: được thêm dòng để bổ sung file.
    this.grid1.allowAddNew = true;
    // Bước duyệt / WorkFlow / Hóa đơn: chỉ xem.
    for (let g of [this.grid2, this.grid3, this.grid4]) {
      g.allowAddNew = false;
      g.isReadOnly = true;
    }

    this.dbClickCellContent(this.grid3);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    // df-panel dựng control bất đồng bộ -> thử lại lần 2 cho chắc.
    setTimeout(() => this.renderFieldGroupHeaders(), 0);
    setTimeout(() => this.renderFieldGroupHeaders(), 800);

    this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {
      if (e.panel.cellType != wjcGrid.CellType.Cell || !s.rows[e.row] || !s.rows[e.row].dataItem)
        return;

      let data = s.rows[e.row].dataItem;
      wjcCore.setCss(e.cell, { color: data['NoChangeInBill'] == false ? 'red' : '' });
      // Đánh dấu dòng đã sửa trong phiên để người dùng biết dòng nào sẽ được lưu.
      wjcCore.toggleClass(e.cell, 'adj-row-edited', this.isRowEdited(s, data));
    });
  }

  ngOnDestroy() {
    this.destroy();
  }

  get canSave(): boolean {
    return this.parentData && this.parentData['Id'] > 0 && this.showLoading != true
      && (this.isSysAdmin == 'true' || this.isPermisionEdiAll_isSave);
  }

  editedCount(g: wjcGrid.FlexGrid): number {
    let cv = g && <wjcCore.CollectionView>g.itemsSource;
    if (!cv || !cv.itemsEdited)
      return 0;
    return cv.itemsEdited.length + cv.itemsAdded.length + cv.itemsRemoved.length;
  }

  private isRowEdited(g: wjcGrid.FlexGrid, item: any): boolean {
    let cv = <wjcCore.CollectionView>g.itemsSource;
    return !!cv && !!cv.itemsEdited && cv.itemsEdited.indexOf(item) > -1;
  }

  selectTab(key: string, g: wjcGrid.FlexGrid) {
    this.activeTab = key;
    // Lưới vừa hiện ra cần dựng lại cột và tính lại kích thước.
    setTimeout(() => this.onTabClick(g));
  }

  // Enter trên form hoặc nút Lưu đều đi qua hộp xác nhận.
  onSubmit(formData: any) {
    if (!this.canSave)
      return;
    this.showConfirmSave = true;
  }

  confirmSave() {
    this.showConfirmSave = false;
    this.submit(this.editorFrm, this.indexPage_Editor);
  }

  private renderFieldGroupHeaders() {
    if (this._fieldGroupsRendered) return;

    let inserted = 0;

    for (let group of this.fieldGroups) {
      let element = document.getElementById(group.key);
      if (!element) continue;

      let row = this.closestFormRow(element);
      if (!row || !row.parentElement) continue;

      let previous = row.previousElementSibling;
      if (previous && previous.className.indexOf('cps-group-head') > -1) {
        inserted++;
        continue;
      }

      let head = document.createElement('div');
      head.className = 'cps-group-head';
      head.innerHTML = '<i class="fa ' + group.icon + '" aria-hidden="true"></i>' + group.title;

      row.parentElement.insertBefore(head, row);
      inserted++;
    }

    if (inserted == this.fieldGroups.length) this._fieldGroupsRendered = true;
  }

  /** Div .form-row gần nhất mà df-panel sinh ra cho từng control. */
  private closestFormRow(element: HTMLElement): HTMLElement | null {
    let node: HTMLElement = element;

    while (node && node.parentElement) {
      if (node.className && node.className.indexOf('form-row') > -1) return node;
      node = node.parentElement;
    }

    return null;
  }

  exportHtmlWorkFlow(input: any, extInput?: string) {
    if (this.parentData["CompletedApprove"] == false) {
      alert('Hồ sơ chưa hoàn thiện duyệt, không thể in ấn workflow');
      return;
    }
    this.exportHtml_WorkFlow('WorkFlow_TT.docx', 'WorkFlow thuê, mua hàng - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }
}
