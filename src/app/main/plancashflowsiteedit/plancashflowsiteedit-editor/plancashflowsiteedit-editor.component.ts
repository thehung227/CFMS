import { Component, ViewChild, OnInit, OnDestroy, ElementRef } from "@angular/core";
import { BaseEditorComponent } from "../../_baseform/base-editor.component";

import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { DynamicFormPanelComponent } from "../../../ui/form/dynamic-form-panel.component";
import { BaseEditorService } from "../../../base/base.service-editor";
import { ActivatedRoute, Router } from "@angular/router";
import { PanelControlService } from "../../../ui/panel/PanelControlService";
import { LayoutPlanCashFlowSiteEditEditor } from "../Layout";
import { Title } from "@angular/platform-browser";

/**
 * Admin điều chỉnh kế hoạch dòng tiền dự án (K6) - tách riêng khỏi màn plancashflowsite.
 * Chỉ sửa số liệu của hồ sơ đã có:
 *  - không validate, không tự tính lại (Layout không khai báo evaluator),
 *  - không gửi duyệt / tải lại dữ liệu; tab Bước duyệt, WorkFlow chỉ xem
 *    và được khai báo IsView = 'view' nên không nằm trong dữ liệu lưu.
 */
@Component({
  selector: 'app-plancashflowsiteedit-editor-form',
  templateUrl: './plancashflowsiteedit-editor.component.html',
  styleUrls: ['../../_baseform/newt-modern.css']
})

export class PlanCashFlowSiteEditEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;

  indexPage = ['/main', 'plancashflowsiteedit', 'index'];
  folderName = 'Ke_Hoach_Dong_Tien';
  indexPage_Editor = ['/main', 'plancashflowsiteedit', 'detail'];

  activeTab = 'detail';
  showConfirmSave = false;

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutPlanCashFlowSiteEditEditor(service, this.parentData);
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4];
    this.init();
    // Chi tiết, Kế hoạch thu chi tháng, Đính kèm: được sửa như màn gốc.
    // Bước duyệt / WorkFlow: chỉ xem.
    for (let g of [this.grid1, this.grid2]) {
      g.allowAddNew = false;
      g.isReadOnly = true;
    }

    this.dbClickCellContent(this.grid2);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    // Đánh dấu dòng đã sửa trong phiên để người dùng biết dòng nào sẽ được lưu.
    for (let g of [this.grid, this.grid4]) {
      g.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {
        if (e.panel.cellType != wjcGrid.CellType.Cell || !s.rows[e.row] || !s.rows[e.row].dataItem)
          return;
        wjcCore.toggleClass(e.cell, 'adj-row-edited', this.isRowEdited(s, s.rows[e.row].dataItem));
      });
    }
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

  exportHtmlWorkFlow(input: any, extInput?: string) {
    if (this.parentData["CompletedApprove"] == false) {
      alert('Hồ sơ chưa hoàn thiện duyệt, không thể in ấn workflow');
      return;
    }
    this.exportHtml_WorkFlow('WorkFlow_KHKK.docx', 'WorkFlow KHKK - {VAR=ProductName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }
}
