import { Component, ViewChild, OnInit, OnDestroy, ElementRef, HostListener } from "@angular/core";
import { BaseEditorComponent } from "../../_baseform/base-editor.component";

import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { DynamicFormPanelComponent } from "../../../ui/form/dynamic-form-panel.component";
import { BaseEditorService } from "../../../base/base.service-editor";
import { ActivatedRoute, Router } from "@angular/router";
import { PanelControlService } from "../../../ui/panel/PanelControlService";
import { LayoutApprovedPlanCostOfficeEditor } from "../DeclareLayout";
import { PlanCostOfficeFields, planCostOfficeSummary, planCostOfficeIsOverRow } from "../../plancostoffice/DeclareLayout";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { Global } from "../../../shared/global";

@Component({
  selector: 'app-approvedplancostoffice-editor-form',
  templateUrl: './approvedplancostoffice-editor.component.html',
  // Giao diện dùng chung với màn hình lập (plancostoffice-editor)
  styleUrls: ['../../plancostoffice/plancostoffice-editor/plancostoffice-editor.component.css',
    './approvedplancostoffice-editor.component.css']
})

export class ApprovedPlanCostOfficeEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'plancostrevcons', 'index'];
  folderName = '01.Ke_Hoach_DoanhThu_ChiPhi';

  activeTab: string = 'detail';

  /** Số liệu hiển thị (chỉ xem, không chặn duyệt). */
  summary = planCostOfficeSummary([]);

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedPlanCostOfficeEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2];
    this.init();
    this.grid.isReadOnly = true;
    this.grid1.isReadOnly = true;
    this.grid2.isReadOnly = true;

    this.dbClickCellContent(this.grid1);

    this.grid.itemsSourceChanged.addHandler(() => this.refreshSummary());
    this.grid.formatItem.addHandler((s: wjcGrid.FlexGrid, e: wjcGrid.FormatItemEventArgs) => {
      if (e.panel.cellType != wjcGrid.CellType.Cell) return;
      let binding = s.columns[e.col] ? s.columns[e.col].binding : '';
      if (binding != PlanCostOfficeFields.SpentAmount && binding != PlanCostOfficeFields.CurAmount) return;
      let item = s.rows[e.row] ? s.rows[e.row].dataItem : null;
      wjcCore.toggleClass(e.cell, 'pco-cell-over', planCostOfficeIsOverRow(item));
    });
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any) {
    this.submit(formData, this.indexPage);
  }

  backClick() {
    this._location.back();
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    let grid = tab == 'workflow' ? this.grid1 : tab == 'approve' ? this.grid2 : this.grid;
    this.onTabClick(grid);
    setTimeout(() => { try { grid.invalidate(true); } catch (e) { } }, 0);
  }

  refreshSummary() {
    let cv: any = this.grid ? this.grid.collectionView : null;
    this.summary = planCostOfficeSummary(cv ? cv.sourceCollection : []);
  }

  fmt(value: number): string {
    return wjcCore.Globalize.format(value || 0, 'n0');
  }

  async onClick(state: any) {
    if (Global.convertConfig('{VAR=User.Ma_CbNv}') != this.parentData['EmployeeCode'])
      alert("User đăng nhập không đúng với người duyệt!!!");
    else {
      this.isLoading = true;
      this.parentData["ApproveStatus"] = state;
      this.parentData["ApproveStatusWeb"] = state;
      this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
        this.sendMail(this.editorFrm, 'K2', this.parentData['IdCCMBudget'], false, state).then(() => {
          this.router.navigate(['/main', 'notifications', 'index']);
        });
      });
    }
  }
}
