import { Component, ViewChild, OnInit, OnDestroy, ElementRef, HostListener } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";

import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';

import { BaseEditorComponent } from "../../_baseform/base-editor.component";
import { BaseEditorService } from "../../../base/base.service-editor";
import { PanelControlService } from "../../../ui/panel/PanelControlService";
import { DynamicFormPanelComponent } from "../../../ui/form/dynamic-form-panel.component";

import { LayoutConsPermitStatusEditor, CONS_PERMIT_DUE_SOON_DAYS, CONS_PERMIT_STATUS } from "../Layout";

@Component({
  selector: 'app-conspermitstatus-editor-form',
  templateUrl: './conspermitstatus-editor.component.html',
  styleUrls: ['./conspermitstatus-editor.component.css']
})

export class ConsPermitStatusEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  /** Thứ tự phải khớp layout.Structure.Child trong Layout.ts */
  @ViewChild('grid') grid: wjcGrid.FlexGrid;      // [0] Chi tiết tình trạng GPXD
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;    // [1] Tài liệu đính kèm
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;    // [2] Bước duyệt
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;    // [3] Workflow

  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  @ViewChild('documentCard') documentCard: ElementRef;

  indexPage = ['/main', 'conspermitstatus', 'index'];
  indexPage_Editor = ['/main', 'conspermitstatus', 'detail'];
  folderName = '13.Giay_Phep_Xay_Dung';

  /** Tab đang hiển thị: 'detail' | 'document' | 'approve' | 'workflow' */
  activeTab: string = 'detail';

  /** Từ khóa lọc nhanh trên lưới chi tiết */
  searchText: string = '';

  /** Lọc theo tình trạng GPXD: '' | 'has' | 'none' | 'due' */
  statusFilter: string = '';

  /** Số liệu panel "Tổng quan hồ sơ" - tính lại mỗi khi lưới chi tiết đổi. */
  summary = { total: 0, hasPermit: 0, noPermit: 0, dueSoon: 0 };

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router,
    titleService: Title) {
    super(service, route, pcs, elRef, router, titleService);
    this._layoutDeclare = new LayoutConsPermitStatusEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();

    // Bước duyệt: chỉ chọn người duyệt, không tự thêm dòng.
    this.grid2.allowAddNew = false;
    // Workflow: nhật ký duyệt, chỉ đọc.
    this.grid3.isReadOnly = true;
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
  // Lưu / Gửi duyệt
  // ==========================================================================

  /**
   * Nút "Lưu"      -> onSubmit(editorFrm)
   * Nút "Gửi duyệt"-> onSubmit(editorFrm, true)
   */
  onSubmit(formData: any, isApproveSend?: boolean) {

    // Chi tiết và bước duyệt phải có dữ liệu mới lưu được.
    if (this.gridArray[0].itemsSource.items.length == 0 ||
      this.gridArray[2].itemsSource.items.length == 0) {
      alert('Các Tab dữ liệu (Chi tiết, Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" hoặc điền đầy đủ thông tin.');
      return;
    }

    // Số thứ tự dòng chi tiết không được trùng.
    this.checkUniqueColGrid(this.grid, 'BuiltinOrder');
    if (this._errorUnique == true) {
      alert('Số thứ tự không được trùng hoặc bỏ trắng, giá trị: ' + this._valueDuplicate);
      return;
    }

    if (isApproveSend != true) {
      this.submit(formData, this.indexPage_Editor);
      return;
    }

    // ----- Nhánh "Gửi duyệt": kiểm tra thêm trước khi khóa hồ sơ -----

    // Tài liệu bắt buộc phải có file đính kèm.
    for (let item of this.grid1.itemsSource.items) {
      if (item['Attached'] == true && (item['FilePath'] == '' || item['FilePath'] == undefined)) {
        alert('Yêu cầu đính kèm tài liệu bắt buộc trước khi gửi duyệt!');
        return;
      }
    }

    // Mỗi bước duyệt phải chỉ định được nhân viên.
    for (let item of this.grid2.itemsSource.items) {
      if (item['EmployeeCode'] == '' || item['EmployeeCode'] == undefined) {
        alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
        return;
      }
      if (item['EmployeeCode'].toString().indexOf(',') > 0 && item['EmployeeCodeReal'] == '') {
        alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
        return;
      }
    }

    this.submit(formData, this.indexPage, isApproveSend).then(() => {
      if (this.allowSendMail) {
        this.sendMail(formData, 'GP', this.id, false, '1');
      }
    });
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
   * Card "Danh sách tài liệu đính kèm" luôn hiển thị dưới khối tab (bám mockup),
   * nên tab "Đính kèm" chỉ cuộn màn hình xuống card đó và giữ nguyên nội dung
   * đang hiển thị là lưới chi tiết.
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

  /**
   * df-panel hiện không phát sự kiện valueChanged (dòng emit đang bị comment
   * trong dynamic-form-panel.component.ts), nhưng template vẫn khai báo binding
   * theo đúng khuôn mẫu chung của hệ thống. Khai báo sẵn để nếu sự kiện được
   * bật lại thì evaluator vẫn chạy đúng thay vì lỗi "not a function".
   */
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
  // Thanh công cụ lưới chi tiết
  // ==========================================================================

  /** Thêm một dòng mới ở cuối, hoặc ngay dưới dòng đang đứng. */
  addDetailRow() {
    if (this.isFormLocked()) return;

    let row = this.grid.selection ? this.grid.selection.row : -1;
    if (row >= 0 && this.grid.rows.length > 0) {
      this.insertRowAt(this.grid, row, true);
    } else {
      this.appendRow(this.grid);
    }
    this.refreshSummary();
  }

  /** Nhân bản dòng đang đứng (chép toàn bộ giá trị, trừ khóa). */
  duplicateDetailRow(rowIndex?: number) {
    if (this.isFormLocked()) return;

    const view: any = this.grid.collectionView;
    if (!view || !Array.isArray(view.sourceCollection)) return;

    let index = rowIndex != undefined ? rowIndex
      : (this.grid.selection ? this.grid.selection.row : -1);
    if (index < 0 || index >= this.grid.rows.length) return;

    let sourceItem = this.grid.rows[index].dataItem;
    if (sourceItem == null) return;

    let newItem: any = JSON.parse(JSON.stringify(sourceItem));
    newItem['Id'] = -1;
    newItem['BuiltinOrder'] = this.nextBuiltinOrder();

    let at = view.sourceCollection.indexOf(sourceItem);
    at = at < 0 ? view.sourceCollection.length : at + 1;

    view.sourceCollection.splice(at, 0, newItem);
    if (view.trackChanges && view.itemsAdded) {
      view.itemsAdded.push(newItem);
    }
    view.refresh();
    this.refreshSummary();
  }

  /** Xóa các dòng đang chọn của lưới chi tiết. */
  deleteDetailRows() {
    if (this.isFormLocked()) return;
    this.deleteSelectedRows(this.grid);
    this.refreshSummary();
  }

  /** Xóa dòng theo chỉ số (nút thùng rác trên cột "Thao tác"). */
  deleteDetailRowAt(rowIndex: number) {
    if (this.isFormLocked()) return;
    if (rowIndex < 0 || rowIndex >= this.grid.rows.length) return;

    try {
      this.grid.select(new wjcGrid.CellRange(rowIndex, 0, rowIndex, 0), true);
    } catch (e) { }
    this.deleteSelectedRows(this.grid);
    this.refreshSummary();
  }

  /** Thêm dòng vào lưới tài liệu đính kèm. */
  addDocumentRow() {
    if (this.isFormLocked()) return;
    this.appendRow(this.grid1);
  }

  /** Xóa dòng đang chọn của lưới tài liệu đính kèm. */
  deleteDocumentRows() {
    if (this.isFormLocked()) return;
    this.deleteSelectedRows(this.grid1);
  }

  /** Form bị khóa khi hồ sơ đã gửi duyệt. */
  isFormLocked(): boolean {
    return this.parentData && this.parentData['ApproveSend'] == true;
  }

  /** Thêm một dòng trống ở cuối lưới (dùng khi lưới chưa có dòng nào). */
  private appendRow(grid: wjcGrid.FlexGrid) {
    const view: any = grid ? grid.collectionView : null;
    if (!view || !Array.isArray(view.sourceCollection)) return;

    let newItem: any = view['defaultRow'] ? JSON.parse(JSON.stringify(view['defaultRow'])) : {};
    newItem['Id'] = -1;
    if (grid === this.grid) {
      newItem['BuiltinOrder'] = this.nextBuiltinOrder();
      if (!newItem['PermitStatus']) newItem['PermitStatus'] = CONS_PERMIT_STATUS.NONE;
    }

    view.sourceCollection.push(newItem);
    if (view.trackChanges && view.itemsAdded) {
      view.itemsAdded.push(newItem);
    }
    view.refresh();

    setTimeout(() => {
      let r = grid.rows.length - 1;
      if (r < 0) return;
      try {
        grid.select(new wjcGrid.CellRange(r, 0, r, 0), true);
        grid.scrollIntoView(r, 0);
        grid.startEditing(false);
      } catch (e) { }
    }, 50);
  }

  private nextBuiltinOrder(): number {
    const view: any = this.grid ? this.grid.collectionView : null;
    if (!view || !Array.isArray(view.sourceCollection)) return 1;

    let max = 0;
    for (let item of view.sourceCollection) {
      let value = Number(item['BuiltinOrder']);
      if (!isNaN(value) && value > max) max = value;
    }
    return max + 1;
  }

  // ==========================================================================
  // Tìm kiếm nhanh trên lưới chi tiết
  // ==========================================================================

  /**
   * Gộp ô tìm kiếm và bộ lọc tình trạng vào MỘT hàm filter duy nhất của
   * CollectionView - hai nguồn lọc ghi đè lẫn nhau nếu tách riêng.
   */
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

  /** Tính lại số liệu tổng quan từ dữ liệu gốc của lưới chi tiết. */
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

  /** Cập nhật số liệu tổng quan khi dữ liệu lưới chi tiết thay đổi. */
  private registerSummaryWatchers() {
    if (!this.grid) return;

    this.grid.cellEditEnded.addHandler(() => this.refreshSummary());
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
  // Hiển thị: badge trạng thái + nút thao tác trên lưới
  // ==========================================================================

  /**
   * Ô đang mở editor hay không.
   *
   * BaseEditorComponent dựng editor (dropdown lookup, ô nhập ngày...) ngay trong
   * formatItem, đúng bằng điều kiện này - xem base-editor.component.ts:1036-1059.
   * Handler badge bên dưới đăng ký SAU nên chạy SAU; nếu không bỏ qua ô đang sửa
   * thì việc ghi đè innerHTML sẽ xoá mất editor và người dùng không chọn được
   * giá trị trong danh sách.
   */
  private isCellEditing(flex: wjcGrid.FlexGrid, e: wjcGrid.FormatItemEventArgs): boolean {
    let editRange = flex.editRange;
    return editRange != null && editRange.row === e.row && editRange.col === e.col;
  }

  /**
   * Wijmo dựng DOM lúc chạy nên không nhận CSS scoped của Angular; các lớp badge
   * dưới đây được khai báo với ::ng-deep trong file .css của component.
   */
  private registerBadgeRenderers() {

    // --- Lưới chi tiết: badge "Tình trạng GPXD" + cột "Thao tác" ---
    this.grid.formatItem.addHandler((s: wjcGrid.FlexGrid, e: wjcGrid.FormatItemEventArgs) => {
      if (e.panel.cellType !== wjcGrid.CellType.Cell) return;
      if (this.isCellEditing(s, e)) return;

      let column = s.columns[e.col];
      if (!column) return;

      let item = s.rows[e.row] ? s.rows[e.row].dataItem : null;

      if (column.binding === 'PermitStatus' && item) {
        let hasPermit = item['PermitStatus'] != undefined
          && item['PermitStatus'].toString() === CONS_PERMIT_STATUS.HAS;
        let text = e.cell.textContent;
        e.cell.innerHTML = '<span class="cps-badge ' +
          (hasPermit ? 'cps-badge-success' : 'cps-badge-warning') + '">' + text + '</span>';
        return;
      }

      if (column.binding === 'Actions') {
        e.cell.innerHTML = '';
        e.cell.style.padding = '1px';
        if (item == null) return;

        let rowIndex = e.row;

        let btnCopy = document.createElement('button');
        btnCopy.type = 'button';
        btnCopy.className = 'cps-cell-btn cps-cell-btn-copy';
        btnCopy.title = 'Nhân bản dòng';
        btnCopy.innerHTML = '<i class="fa fa-clone"></i>';
        btnCopy.addEventListener('click', (evt) => {
          evt.stopPropagation();
          this.duplicateDetailRow(rowIndex);
        });

        let btnDelete = document.createElement('button');
        btnDelete.type = 'button';
        btnDelete.className = 'cps-cell-btn cps-cell-btn-delete';
        btnDelete.title = 'Xóa dòng';
        btnDelete.innerHTML = '<i class="fa fa-trash-o"></i>';
        btnDelete.addEventListener('click', (evt) => {
          evt.stopPropagation();
          this.deleteDetailRowAt(rowIndex);
        });

        e.cell.appendChild(btnCopy);
        e.cell.appendChild(btnDelete);
      }
    });

    // --- Lưới đính kèm: badge "Yêu cầu" và "Trạng thái file" ---
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
