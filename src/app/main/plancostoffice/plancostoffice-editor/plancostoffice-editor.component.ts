import { Component, ViewChild, OnInit, OnDestroy, ElementRef, HostListener } from "@angular/core";
import { BaseEditorComponent } from "../../_baseform/base-editor.component";

import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { DynamicFormPanelComponent } from "../../../ui/form/dynamic-form-panel.component";
import { BaseEditorService } from "../../../base/base.service-editor";
import { ActivatedRoute, Router } from "@angular/router";
import { PanelControlService } from "../../../ui/panel/PanelControlService";
import {
  LayoutPlanCostOfficeEditor, PLANCOSTOFFICE_PROCESS_GDDH, PlanCostOfficeFields, PlanCostOfficeTotals,
  planCostOfficeSummary, planCostOfficeIsOverRow
} from "../DeclareLayout";
import { SystemConstants } from "../../../core/common/system.constants";
import { PlanCostOfficePopupEditorComponent } from "../../plancostoffice-popup/plancostoffice-popup-editor/plancostoffice-popup-editor.component";
import { Title } from "@angular/platform-browser";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

/** Store thống kê chi phí văn phòng công ty: 1 dòng / khoản mục, cột D_<DeptCode> = chi phí trực tiếp của bộ phận. */
const SPENT_COMMAND = 'usp_Kqt_ThongKeChiPhiVPCTY_CCM';

const F = PlanCostOfficeFields;
const T = PlanCostOfficeTotals;

@Component({
  selector: 'app-plancostoffice-editor-form',
  templateUrl: './plancostoffice-editor.component.html',
  styleUrls: ['./plancostoffice-editor.component.css']
})

export class PlanCostOfficeEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('popupEditorFrm') popupEditorFrm: PlanCostOfficePopupEditorComponent;

  indexPage = ['/main', 'plancostoffice', 'index'];
  folderName = '01.Ke_Hoach_DoanhThu_ChiPhi';
  indexPage_Editor = ['/main', 'plancostoffice', 'detail'];

  activeTab: string = 'detail';

  /** Số liệu tổng hợp + trạng thái kiểm tra gửi duyệt, tính lại mỗi khi lưới chi tiết đổi. */
  summary = {
    prevTotal: 0,
    curTotal: 0,
    spentTotal: 0,
    rate: 0,
    rowCount: 0,
    overRows: [] as string[],     // khoản mục có chi phí đã thực hiện > dự trù kỳ này
    exceedPrev: false,            // tổng đã thực hiện > tổng dự trù kỳ trước
    isGddhProcess: false,         // quy trình đang chọn thuộc PLANCOSTOFFICE_PROCESS_GDDH
    processOk: true
  };

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutPlanCostOfficeEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2];
    this.init();
    this.grid1.allowAddNew = false;
    this.grid2.isReadOnly = true;

    this.dbClickCellContent(this.grid2);

    this.grid.cellEditEnded.addHandler(() => this.recalcTotals());
    this.grid.itemsSourceChanged.addHandler(() => this.recalcTotals(false));
    this.grid.formatItem.addHandler((s: wjcGrid.FlexGrid, e: wjcGrid.FormatItemEventArgs) => this.highlightOverRow(s, e));
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
  }

  ngOnDestroy() {
    this.destroy();
  }

  /**
   * df-panel hiện không phát sự kiện valueChanged, template vẫn khai báo binding theo khuôn chung.
   * Khai báo sẵn để tránh lỗi "not a function" nếu sự kiện được bật lại.
   */
  onValueChanged(input: any) {
    if (this.dfpanel && input) {
      this.dfpanel.onValueChanged(input);
    }
    this.recalcTotals(false);
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    let grid = tab == 'approve' ? this.grid1 : tab == 'workflow' ? this.grid2 : this.grid;
    this.onTabClick(grid);
    // Lưới nằm trong tab bị ẩn không đo được kích thước, cần vẽ lại khi hiện.
    setTimeout(() => { try { grid.invalidate(true); } catch (e) { } }, 0);
  }

  isFormLocked(): boolean {
    return this.parentData && this.parentData['ApproveSend'] == true;
  }

  // ============================================================ TẢI DỮ LIỆU

  /** Nút "Tải dữ liệu": bước duyệt (evaluator) + dựng lại lưới chi tiết theo danh mục khoản mục phí. */
  async onClick(state?: any) {
    this.showDialog = false;
    if (!this.editorFrm.valid) return;

    this.showLoading = true;
    try {
      for (let command of this._layoutDeclare.buttonLoadChild) {
        if (this.editorFrm.valid)
          await this.dfpanel.runConstraint(command).then();
      }

      if (this.editorFrm.valid) {
        await this.loadDetailData();
        this.taidulieu = true;
      }
    }
    catch (ex) {
      alert("Xảy ra lỗi trong quá trình thực hiện");
      console.log(ex);
    }
    finally {
      this.showLoading = false;
    }
  }

  /**
   * Dựng lưới chi tiết:
   *  - Tất cả khoản mục phí (lookup ExpenseCatg) + khoản mục có ở version trước / có phát sinh chi phí.
   *  - Dự trù version trước = OriginalAmount1 của version K2 gần nhất đã hoàn thiện duyệt (cùng gói thầu).
   *  - Chi phí đã thực hiện = cột D_<Bộ phận> của usp_Kqt_ThongKeChiPhiVPCTY_CCM (trực tiếp, không phân bổ).
   *  - Dự trù kỳ này để trống cho người dùng tự điền.
   */
  private async loadDetailData() {
    let [catgs, previous, spent] = await Promise.all([
      this.fetchExpenseCatgs(),
      this.fetchPreviousVersion(),
      this.fetchSpentByCatg()
    ]);

    let codes: string[] = [];
    let names: { [code: string]: string } = {};
    let addCode = (code: string, name?: string) => {
      if (!code) return;
      if (codes.indexOf(code) < 0) codes.push(code);
      if (name && !names[code]) names[code] = name;
    };

    for (let c of catgs) addCode(c.code, c.name);
    for (let code in previous) addCode(code, previous[code].name);
    for (let code in spent) addCode(code);

    let ds: wjcCore.CollectionView = this.grid.itemsSource;
    let defaultRow = ds['defaultRow'] || {};

    // Giống EvaluatorQueryLoadChild: xóa toàn bộ dòng cũ rồi thêm mới (đánh dấu itemsAdded để submit nhận).
    ds.itemsAdded.clear();
    ds.itemsEdited.clear();
    let existing = ds.sourceCollection.slice();
    for (let item of existing) ds.remove(item);

    codes.forEach((code, i) => {
      let prev = previous[code];
      let row: any = {};
      row['ItemNo'] = this.itemNo(i + 1);
      row['IsTitleRow'] = false;
      row['ManualFormula'] = false;
      row['Description'] = names[code] || '';
      row[F.ExpenseCatg] = code;
      row[F.PrevAmount] = prev ? prev.amount : 0;
      row[F.SpentAmount] = spent[code] || 0;
      row[F.CurAmount] = 0;
      row[F.OriginalCost] = prev ? prev.originalCost : 0;
      row[F.Reason] = '';
      for (let col in defaultRow) {
        if (row[col] == null || row[col] == undefined)
          row[col] = defaultRow[col];
      }
      ds.itemsAdded.push(row);
      ds.sourceCollection.push(row);
    });

    ds.refresh();
    this.recalcTotals();
  }

  /** Danh mục khoản mục phí (chi tiết, đang dùng) theo lookup ExpenseCatg. */
  private async fetchExpenseCatgs(): Promise<Array<{ code: string, name: string }>> {
    let data: any[] = await this._service
      .getLookupNew(Global.LookupEndpoint, 'ExpenseCatg', '', 'IsGroup=0 AND IsActive=1', '', 2000)
      .toPromise();
    return (data || [])
      .map(d => ({ code: this.str(d['ValueMember']), name: this.str(d['DisplayMember']) }))
      .filter(d => d.code != '');
  }

  /** Version K2 gần nhất đã hoàn thiện duyệt của cùng gói thầu: dự trù + nguyên giá theo khoản mục. */
  private async fetchPreviousVersion(): Promise<{ [code: string]: { amount: number, originalCost: number, name: string } }> {
    let result = {};
    let productCostId = this.str(this.editorFrm.get('ProductCostId').value);
    if (!productCostId) return result;

    let filter =
      "ProductCostId = N'" + this.sqlEscape(productCostId) + "'" +
      " AND DocCode = 'K2' AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND IsActive = 1 AND CompletedApprove = 1" +
      " AND CCMBudgetId <> '" + this.sqlEscape(this.str(this.parentData['CCMBudgetId'])) + "'";

    let headers: any[] = await this._service
      .fetchDataSelect(Global.DataEditorEndpoint, 'B30CCMBudget', filter, 1, 1, 'DocDate DESC,DocNo DESC,Id DESC')
      .toPromise();
    if (!headers || headers.length == 0) return result;

    let details: any[] = await this._service
      .fetchDataSelect(Global.DataEditorEndpoint, 'B30CCMBudgetDetail',
        "CCMBudgetId = '" + this.sqlEscape(this.str(headers[0]['CCMBudgetId'])) + "'", 1, 5000, 'BuiltinOrder')
      .toPromise();

    for (let d of details || []) {
      let code = this.str(d['ExpenseCatgCode']);
      if (!code || d['IsTitleRow'] == true) continue;
      if (!result[code]) result[code] = { amount: 0, originalCost: 0, name: this.str(d['Description']) };
      result[code].amount += this.num(d['OriginalAmount1']);
      result[code].originalCost += this.num(d['CostAmount']);
    }
    return result;
  }

  /**
   * Chi phí đã thực hiện theo khoản mục của bộ phận đang chọn, từ đầu năm tới ngày lập phiếu.
   * Chỉ lấy cột trực tiếp D_<DeptCode> (store đã tách riêng phần phân bổ).
   */
  private async fetchSpentByCatg(): Promise<{ [code: string]: number }> {
    let result = {};
    let deptCode = this.str(this.editorFrm.get('DeptCode').value);
    if (!deptCode) return result;

    let docDate = this.toDate(this.editorFrm.get('DocDate').value) || new Date();
    let dateFrom = new Date(Date.UTC(docDate.getFullYear(), 0, 1));
    let dateTo = new Date(Date.UTC(docDate.getFullYear(), docDate.getMonth(), docDate.getDate()));

    let params = new Array<ParameterContract>();
    params.push(this.param('DocDate1', dateFrom.toISOString()));
    params.push(this.param('DocDate2', dateTo.toISOString()));
    params.push(this.param('Ma_Dvcs', Global.convertConfig('{VAR=Branch.Ma_Dvcs}')));

    let data = await this._service
      .getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, SPENT_COMMAND, params)
      .toPromise();

    // Cùng quy tắc đặt tên cột DeptKey trong store: '-', ' ', '.', '/' -> '_'
    let column = 'D_' + deptCode.replace(/[-. \/]/g, '_');
    for (let row of (data && data['data']) || []) {
      let code = this.str(row['ExpenseCatgCode']);
      if (!code || Number(row['ItemLevel']) != 9) continue;
      result[code] = (result[code] || 0) + this.num(row[column]);
    }
    return result;
  }

  // ============================================================ TỔNG HỢP

  /** Tính lại tổng đầu phiếu + trạng thái kiểm tra. writeForm=false: chỉ đọc (khi mới mở phiếu). */
  recalcTotals(writeForm: boolean = true) {
    let s = planCostOfficeSummary(this.detailRows());

    if (writeForm) {
      this.setHeaderValue(T.PrevTotal, s.prevTotal);
      this.setHeaderValue(T.CurTotal, s.curTotal);
      this.setHeaderValue(T.SpentTotal, s.spentTotal);
      this.setHeaderValue(T.SpentRate, Math.round(s.rate * 10000) / 10000);
    }

    let processControl = this.editorFrm ? this.editorFrm.get('ProcessCode') : null;
    let processCode = this.str(processControl ? processControl.value : '');
    let exceedPrev = s.spentTotal > s.prevTotal;
    let isGddhProcess = PLANCOSTOFFICE_PROCESS_GDDH.indexOf(processCode) > -1;

    this.summary = {
      prevTotal: s.prevTotal,
      curTotal: s.curTotal,
      spentTotal: s.spentTotal,
      rate: s.rate,
      rowCount: s.rowCount,
      overRows: s.overRows,
      exceedPrev: exceedPrev,
      isGddhProcess: isGddhProcess,
      processOk: exceedPrev == isGddhProcess
    };
  }

  private detailRows(): any[] {
    let cv: any = this.grid ? this.grid.collectionView : null;
    return cv && cv.sourceCollection ? cv.sourceCollection.filter(r => r && r['IsTitleRow'] != true) : [];
  }

  private setHeaderValue(key: string, value: number) {
    this.parentData[key] = value;
    let control = this.editorFrm.get(key);
    if (control && control.value != value) control.setValue(value);
  }

  /** Tô đỏ ô "Chi phí đã thực hiện" / "Dự trù kỳ này" của dòng vi phạm. */
  private highlightOverRow(s: wjcGrid.FlexGrid, e: wjcGrid.FormatItemEventArgs) {
    if (e.panel.cellType != wjcGrid.CellType.Cell) return;
    let binding = s.columns[e.col] ? s.columns[e.col].binding : '';
    if (binding != F.SpentAmount && binding != F.CurAmount) return;
    let item = s.rows[e.row] ? s.rows[e.row].dataItem : null;
    wjcCore.toggleClass(e.cell, 'pco-cell-over', planCostOfficeIsOverRow(item));
  }

  // ============================================================ LƯU / GỬI DUYỆT

  onSubmit(formData: any, isApproveSend?: boolean) {
    this.recalcTotals();

    let rows = this.detailRows();

    // Dòng thêm tay chưa có STT -> cấp tiếp theo (STT dùng để sắp xếp + dựng công thức phía server)
    let maxNo = 0;
    for (let r of rows) maxNo = Math.max(maxNo, Number(r['ItemNo']) || 0);
    for (let r of rows) if (!this.str(r['ItemNo'])) r['ItemNo'] = this.itemNo(++maxNo);

    if (rows.some(r => !this.str(r[F.ExpenseCatg]))) {
      alert('Mã chi phí không được bỏ trống.');
      return;
    }

    this.checkUniqueColGrid(this.grid, F.ExpenseCatg);
    if (this._errorUnique) {
      alert('Mã chi phí bị trùng: ' + this._valueDuplicate);
      return;
    }

    if (isApproveSend != true) {
      this.submit(formData, this.indexPage_Editor);
      return;
    }

    let error = this.approveSendError();
    if (error) {
      alert(error);
      return;
    }

    this.submit(formData, this.indexPage, isApproveSend).then(() => {
      if (this.allowSendMail) {
        this.sendMail(formData, 'K2', this.id, false, '1');
      }
    });
  }

  /** Các điều kiện chặn gửi duyệt; trả về thông báo lỗi hoặc '' nếu hợp lệ. */
  private approveSendError(): string {
    for (let item of this.grid1.itemsSource.items) {
      let emp = this.str(item['EmployeeCode']);
      if (emp == '' || (emp.indexOf(',') > 0 && this.str(item['EmployeeCodeReal']) == ''))
        return 'Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị';
    }

    let s = this.summary;
    if (s.overRows.length > 0) {
      return 'Không được gửi duyệt: chi phí đã thực hiện lớn hơn dự trù kỳ này ở ' + s.overRows.length +
        ' khoản mục:\n' + s.overRows.join(', ');
    }

    if (s.exceedPrev && !s.isGddhProcess) {
      if (PLANCOSTOFFICE_PROCESS_GDDH.length == 0)
        return 'Tổng chi phí đã thực hiện vượt tổng dự trù kỳ trước nhưng chưa cấu hình luồng duyệt GĐĐH ' +
          '(PLANCOSTOFFICE_PROCESS_GDDH trong plancostoffice/DeclareLayout.ts).';
      return 'Tổng chi phí đã thực hiện (' + this.fmt(s.spentTotal) + ') lớn hơn tổng dự trù kỳ trước (' +
        this.fmt(s.prevTotal) + '): bắt buộc chọn luồng duyệt có GĐĐH (' + PLANCOSTOFFICE_PROCESS_GDDH.join(', ') + ').';
    }

    if (!s.exceedPrev && s.isGddhProcess) {
      return 'Tổng chi phí đã thực hiện chưa vượt tổng dự trù kỳ trước: không được chọn luồng duyệt GĐĐH.';
    }

    return '';
  }

  // ============================================================ TIỆN ÍCH

  async showPopup(row: any, form: any) {
    localStorage.removeItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE);
    localStorage.setItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE, row.dataItem['Id']);
    this.popupEditorFrm.setId();
    await this.popupEditorFrm.setupDataSource();
    await this.popupEditorFrm.onInitialComplete();
    form.show(true);
  }

  deleteSelectedRows(flex: wjcGrid.FlexGrid) {
    this.dfpanel.runConstraint('Evaluator_ServerConstraint_Check_ApproveSent_NotChange').then();
    if (flex) {
      let selected = [];
      for (let k in flex.selectedRows) {
        if (flex.selectedRows[k].dataItem != undefined)
          selected.push(flex.selectedRows[k].dataItem);
      }
      for (let i = 0; i < selected.length; i++) {
        flex.itemsSource.remove(selected[i]);
      }
    }
    this.recalcTotals();
  }

  private param(name: string, value: any): ParameterContract {
    let p = new ParameterContract();
    p.ParameterName = Global.convertParameterName(name);
    p.ParameterValue = value;
    return p;
  }

  private itemNo(n: number): string {
    return ('000' + n).slice(-Math.max(3, n.toString().length));
  }

  private toDate(value: any): Date {
    if (!value) return null;
    let d = value instanceof Date ? value : new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  private str(value: any): string {
    return value == null || value == undefined ? '' : value.toString().trim();
  }

  private num(value: any): number {
    let n = Number(value);
    return isNaN(n) ? 0 : n;
  }

  private sqlEscape(value: string): string {
    return value.replace(/'/g, "''");
  }

  fmt(value: number): string {
    return wjcCore.Globalize.format(value || 0, 'n0');
  }
}
