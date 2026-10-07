import { Component, ViewChild, OnInit, OnDestroy, ElementRef, HostListener } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";

import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';

import { BaseEditorComponent } from "../../_baseform/base-editor.component";
import { BaseEditorService } from "../../../base/base.service-editor";
import { PanelControlService } from "../../../ui/panel/PanelControlService";
import { DynamicFormPanelComponent } from "../../../ui/form/dynamic-form-panel.component";

import { LayoutApprovedConsPermitStatusEditor, CONS_PERMIT_DUE_SOON_DAYS, CONS_PERMIT_STATUS } from "../Layout";

@Component({
  selector: 'app-approvedconspermitstatus-editor-form',
  templateUrl: './approvedconspermitstatus-editor.component.html',
  styleUrls: ['./approvedconspermitstatus-editor.component.css']
})

export class ApprovedConsPermitStatusEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  /** Thứ tự phải khớp layout.Structure.Child trong Layout.ts */
  @ViewChild('grid') grid: wjcGrid.FlexGrid;      // [0] Chi tiết tình trạng GPXD
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;    // [1] Tài liệu đính kèm
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;    // [2] Bước duyệt
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;    // [3] Workflow

  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  @ViewChild('documentCard') documentCard: ElementRef;

  indexPage = ['/main', 'approvedconspermitstatus', 'index'];
  folderName = '13.Giay_Phep_Xay_Dung';
  folderNameSendMail = '13.Giay_Phep_Xay_Dung';

  /** Tab đang hiển thị: 'detail' | 'document' | 'approve' | 'workflow' */
  activeTab: string = 'detail';

  /** Từ khóa lọc nhanh trên lưới chi tiết */
  searchText: string = '';

  /** Lọc theo tình trạng GPXD: '' | 'has' | 'none' | 'due' */
  statusFilter: string = '';

  /** Số liệu panel "Tổng quan hồ sơ". */
  summary = { total: 0, hasPermit: 0, noPermit: 0, dueSoon: 0 };

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router,
    titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService);
    this._layoutDeclare = new LayoutApprovedConsPermitStatusEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();

    // Màn hình duyệt: toàn bộ dữ liệu hồ sơ chỉ để xem.
    this.grid.isReadOnly = true;
    this.grid1.isReadOnly = true;
    this.grid2.isReadOnly = true;
    this.grid3.isReadOnly = true;

    this.grid.allowAddNew = false;
    this.grid1.allowAddNew = false;
    this.grid2.allowAddNew = false;

    // Double-click ô "Ý kiến" -> mở popup xem nội dung đầy đủ.
    this.dbClickCellContent(this.grid3);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel;
    this.afterViewInit();

    this.registerBadgeRenderers();
    this.registerSummaryWatchers();
  }

  ngOnDestroy() {
    this.destroy();
  }

  // ==========================================================================
  // Duyệt / Trả lại / Đề xuất trả
  // ==========================================================================

  /**
   * @param state 0 = trả lại, 1 = duyệt, 3 = đề xuất trả
   */
  async onClick(state: any) {
    this.showLoading = true;

    this.parentData['ApproveStatus'] = state;
    this.parentData['ApproveStatusWeb'] = state;

    this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
      this.sendMail(this.editorFrm, 'GP', this.parentData['IdConsPermit'], false, state).then(() => {
        this.router.navigate(['/main', 'notifications', 'index']);
      });
    });
  }

  onSubmit(formData: any) {
    this.submit(formData, this.indexPage);
  }

  backClick() {
    this._location.back();
  }

  showPrintVoucher(input: any) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher(input);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  exportHtmlWorkFlow(input: any, extInput?: string) {
    if (this.parentData['CompletedApprove'] == false) {
      alert('Hồ sơ chưa hoàn thiện duyệt, không thể in ấn workflow');
      return;
    }
    this.exportHtml_WorkFlow('WorkFlow_TT.docx',
      'WorkFlow Tình trạng GPXD - {VAR=DocNo}',
      '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }

  // ==========================================================================
  // Tab
  // ==========================================================================

  /**
   * Card "Danh sách tài liệu đính kèm" luôn hiển thị dưới khối tab (giống module
   * lập), nên tab "Đính kèm" chỉ cuộn màn hình xuống card đó.
   */
  selectTab(tab: string) {
    this.activeTab = tab;
    switch (tab) {
      case 'detail':
        this.onTabClick(this.grid);
        this.refreshGrid(this.grid);
        break;
      case 'document':
        this.onTabClick(this.grid1);
        this.refreshGrid(this.grid1);
        this.scrollToDocumentCard();
        break;
      case 'approve':
        this.onTabClick(this.grid2);
        this.refreshGrid(this.grid2);
        break;
      case 'workflow':
        this.onTabClick(this.grid3);
        this.refreshGrid(this.grid3);
        break;
    }
  }

  /** Lưới nằm trong tab bị ẩn không đo được kích thước, cần vẽ lại khi hiện. */
  private refreshGrid(grid: wjcGrid.FlexGrid) {
    if (!grid) return;
    setTimeout(() => {
      try {
        grid.invalidate(true);
      } catch (e) { }
    }, 0);
  }

  onValueChanged(input: any) {
    if (this.dfpanel && input) {
      this.dfpanel.onValueChanged(input);
    }
  }

  private scrollToDocumentCard() {
    setTimeout(() => {
      if (!this.documentCard || !this.documentCard.nativeElement) return;
      let element: HTMLElement = this.documentCard.nativeElement;
      if (element.scrollIntoView) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' } as any);
      }
    }, 50);
  }

  // ==========================================================================
  // Tìm kiếm nhanh trên lưới chi tiết
  // ==========================================================================

  applySearch() {
    const view: any = this.grid ? this.grid.collectionView : null;
    if (!view) return;

    let term = (this.searchText || '').trim().toLowerCase();
    let status = this.statusFilter;

    if (!term && !status) {
      view.filter = null;
      view.refresh();
      return;
    }

    let limit = new Date();
    limit.setHours(0, 0, 0, 0);
    limit.setDate(limit.getDate() + CONS_PERMIT_DUE_SOON_DAYS);

    view.filter = (item: any) => {
      if (!item) return true;

      if (term) {
        let matched = false;
        let fields = ['StageCode', 'ContractLOANo', 'PermitNo', 'Description'];
        for (let field of fields) {
          let value = item[field];
          if (value != undefined && value.toString().toLowerCase().indexOf(term) > -1) {
            matched = true;
            break;
          }
        }
        if (!matched) return false;
      }

      if (!status) return true;

      let hasPermit = item['PermitStatus'] != undefined
        && item['PermitStatus'].toString() === CONS_PERMIT_STATUS.HAS;

      if (status == 'has') return hasPermit;
      if (status == 'none') return !hasPermit;

      if (status == 'due') {
        if (hasPermit) return false;
        let expected = item['ExpectedDate'];
        if (!expected) return false;
        let expectedDate = expected instanceof Date ? expected : new Date(expected);
        if (isNaN(expectedDate.getTime())) return false;
        return expectedDate <= limit;
      }

      return true;
    };

    view.refresh();
  }

  setStatusFilter(status: string) {
    this.statusFilter = status;
    this.applySearch();
  }

  clearSearch() {
    this.searchText = '';
    this.applySearch();
  }

  // ==========================================================================
  // Panel "Tổng quan hồ sơ"
  // ==========================================================================

  refreshSummary() {
    let result = { total: 0, hasPermit: 0, noPermit: 0, dueSoon: 0 };

    const view: any = this.grid ? this.grid.collectionView : null;
    const items = view && Array.isArray(view.sourceCollection) ? view.sourceCollection : [];

    let limit = new Date();
    limit.setHours(0, 0, 0, 0);
    limit.setDate(limit.getDate() + CONS_PERMIT_DUE_SOON_DAYS);

    for (let item of items) {
      if (!item) continue;
      result.total++;

      let status = item['PermitStatus'] != undefined ? item['PermitStatus'].toString() : '';
      if (status == CONS_PERMIT_STATUS.HAS) {
        result.hasPermit++;
        continue;
      }

      result.noPermit++;

      let expected = item['ExpectedDate'];
      if (!expected) continue;
      let expectedDate = expected instanceof Date ? expected : new Date(expected);
      if (isNaN(expectedDate.getTime())) continue;
      if (expectedDate <= limit) result.dueSoon++;
    }

    this.summary = result;
  }

  private registerSummaryWatchers() {
    if (!this.grid) return;

    this.grid.itemsSourceChanged.addHandler(() => {
      this.bindCollectionChanged();
      this.refreshSummary();
    });

    this.bindCollectionChanged();
    setTimeout(() => this.refreshSummary(), 300);
  }

  private _collectionWatched: any = null;
  private bindCollectionChanged() {
    const view: any = this.grid ? this.grid.collectionView : null;
    if (!view || view === this._collectionWatched) return;

    this._collectionWatched = view;
    if (view.collectionChanged) {
      view.collectionChanged.addHandler(() => this.refreshSummary());
    }
  }

  // ==========================================================================
  // Hiển thị: badge trạng thái trên lưới
  // ==========================================================================

  /**
   * Ô đang mở editor hay không - xem base-editor.component.ts:1036-1059.
   * Không bỏ qua ô đang sửa thì việc ghi đè innerHTML sẽ xoá mất editor.
   */
  private isCellEditing(flex: wjcGrid.FlexGrid, e: wjcGrid.FormatItemEventArgs): boolean {
    let editRange = flex.editRange;
    return editRange != null && editRange.row === e.row && editRange.col === e.col;
  }

  private registerBadgeRenderers() {

    this.grid.formatItem.addHandler((s: wjcGrid.FlexGrid, e: wjcGrid.FormatItemEventArgs) => {
      if (e.panel.cellType !== wjcGrid.CellType.Cell) return;
      if (this.isCellEditing(s, e)) return;

      let column = s.columns[e.col];
      if (!column || column.binding !== 'PermitStatus') return;

      let item = s.rows[e.row] ? s.rows[e.row].dataItem : null;
      if (item == null) return;

      let hasPermit = item['PermitStatus'] != undefined
        && item['PermitStatus'].toString() === CONS_PERMIT_STATUS.HAS;
      let text = e.cell.textContent;
      e.cell.innerHTML = '<span class="cps-badge ' +
        (hasPermit ? 'cps-badge-success' : 'cps-badge-warning') + '">' + text + '</span>';
    });

    this.grid1.formatItem.addHandler((s: wjcGrid.FlexGrid, e: wjcGrid.FormatItemEventArgs) => {
      if (e.panel.cellType !== wjcGrid.CellType.Cell) return;
      if (this.isCellEditing(s, e)) return;

      let column = s.columns[e.col];
      if (!column || column.binding !== 'Attached') return;

      let item = s.rows[e.row] ? s.rows[e.row].dataItem : null;
      if (item == null) return;

      let required = item['Attached'] == true;
      e.cell.innerHTML = '<span class="cps-badge ' +
        (required ? 'cps-badge-info' : 'cps-badge-muted') + '">' +
        (required ? 'Bắt buộc' : 'Không bắt buộc') + '</span>';
    });
  }
}
