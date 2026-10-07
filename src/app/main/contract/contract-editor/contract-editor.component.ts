import { Component, ViewChild, OnInit, OnDestroy, ElementRef, HostListener } from "@angular/core";
import { BaseEditorComponent } from "../../_baseform/base-editor.component";
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcInput from 'wijmo/wijmo.angular2.input';
import { DynamicFormPanelComponent } from "../../../ui/form/dynamic-form-panel.component";
import { BaseEditorService } from "../../../base/base.service-editor";
import { ActivatedRoute, Router } from "@angular/router";
import { PanelControlService } from "../../../ui/panel/PanelControlService";
import { LayoutContractEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinterWordFlow } from "../../_printerlayout/workflow/workflow-printer.data";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { SystemConstants } from "../../../core/common/system.constants";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-contract-editor-form',
  templateUrl: './contract-editor.component.html',
  styleUrls: ['./contract-editor.component.css']
})

export class ContractEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('grid5') grid5: wjcGrid.FlexGrid;
  @ViewChild('grid6') grid6: wjcGrid.FlexGrid;
  @ViewChild('grid7') grid7: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  layoutPrintWordFlow: LayoutPrinterWordFlow = new LayoutPrinterWordFlow();

  indexPage = ['/main', 'contract', 'index'];
  folderName = '02.Hop_Dong_Phu_Luc';
  indexPage_Editor = ['/main', 'contract', 'detail'];

  /**
   * Các khung nội dung của đầu phiếu: mỗi phần tử là một khung, `key` là field
   * ĐẦU TIÊN của khung đó theo đúng thứ tự khai báo trong DeclareLayout.panels.
   *
   * Không tách thành nhiều TablePanel được: df-panel và BaseEditorComponent chỉ
   * quản lý MỘT panel (@ViewChild('dfpanel') lấy instance đầu tiên, còn
   * set_Visible_Expr / set_Disabled_Expr / set_Readonly_Expr / updateValueForm
   * đều lặp trên this.panel.controls), nên field nằm ngoài panel đầu sẽ mất
   * disabled/readonly/visible. Vì vậy giữ nguyên một panel và chèn thanh tiêu đề
   * phân khung vào giữa các field - xem renderFieldGroupHeaders().
   */
  private fieldGroups = [
    { key: 'DocDate', title: 'Thông tin phiếu', icon: 'fa-file-text-o' },
    { key: 'CustomerCode', title: 'Thông tin đối tác', icon: 'fa-building-o' },
    { key: 'CurrencyCode', title: 'Giá trị hợp đồng & bảo hành', icon: 'fa-money' },
    { key: 'Remark', title: 'Hồ sơ trình & quy trình duyệt', icon: 'fa-check-square-o' },
    { key: 'DayOfWarranty', title: 'Điều khoản & thanh toán đặc thù', icon: 'fa-handshake-o' },
    { key: 'Date_CCMPrint', title: 'Tiến độ luân chuyển hồ sơ', icon: 'fa-clock-o' },
    { key: 'Remark2', title: 'Trạng thái & tài liệu đính kèm', icon: 'fa-paperclip' }
  ];

  /** Đã chèn xong thanh tiêu đề cho mọi khung chưa. */
  private _fieldGroupsRendered = false;

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutContractEditor(service, this.parentData);
    this._layoutPrinter_WordFlow = this.layoutPrintWordFlow.Layout;
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }
  output: any;
  _errItemSets: boolean = false;
  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4, this.grid5, this.grid6, this.grid7];
    this.init().then(async ()=>{
  
      let _value;
      const params = new Array<ParameterContract>();
      const param = new ParameterContract();
      const param1 = new ParameterContract();
      
      param.ParameterName = Global.convertParameterName('nUserId');
      param.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID);
      params.push(param);

      _value = localStorage.getItem(SystemConstants.PRODUCTCOSTID).replace(/"/gi, '');

      param1.ParameterName = Global.convertParameterName('ProductCostId');
      param1.ParameterValue = _value;
      params.push(param1);

      let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_GetDeptCodeFromEmployee', params) .toPromise().then();
      this.output = <Array<Object>>(_data['output']);
      this._errItemSets = this.output['@_Error'];
     
      if (this._errItemSets == true) {
        console.log(this._errItemSets)
        // this.grid5.isReadOnly = true;
      }
      else {
      
        // this.grid5.isReadOnly = false;
      }

    });
    this.grid.allowAddNew = false;
    this.grid1.allowAddNew = false;
    this.grid2.isReadOnly = true;
    this.grid3.isReadOnly = true;

    this.dbClickCellContent(this.grid3);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    this.registerBadgeRenderers();

    // Lần đầu chạy ngay sau khi view dựng xong; lần hai dự phòng cho trường hợp
    // df-panel còn đang render dở (lookup tải dữ liệu bất đồng bộ).
    setTimeout(() => this.renderFieldGroupHeaders(), 0);
    setTimeout(() => this.renderFieldGroupHeaders(), 800);
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any) {

 

    if ((formData.controls['FilePath'].value != '' && (formData.controls['EstimatedCompletionDate'].value == null || formData.controls['EstimatedCompletionDate'].value == undefined || formData.controls['EstimatedCompletionDate'].value == ''))) {
      alert('Yêu cầu nhập ngày đính kèm !!!');
    }
    else
      this.submit(formData, this.indexPage_Editor);
    // this.submit(formData, this.indexPage_Editor).then(()=>{
    //   location.reload(false);
    // });
  }

  showPrintVoucher_WorklFlow(input: any, gridForm?: wjcGrid.FlexGrid, extInput?: string) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher_WordFlow(input, 'MAU1', gridForm, extInput, 'DocCode');

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  exportHtmlWorkFlow(input: any, extInput?: string){
    this.exportHtml_WorkFlow('WorkFlow_HD.docx', 'WorkFlow HD,PLHD - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
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

  // ==========================================================================
  // Panel "Tổng quan hợp đồng"
  // ==========================================================================

  /**
   * Số liệu panel "Tổng quan hợp đồng", đã format sẵn thành chuỗi để template
   * không phải gọi pipe number (locale 'vi' chưa được đăng ký trong app này).
   *
   * Dùng getter - change detection gọi lại mỗi vòng - thay vì cache kèm watcher:
   * hai ô "Giá trị HĐ" là control disabled nên KHÔNG nằm trong editorFrm.value,
   * theo dõi qua valueChanges không đáng tin.
   */
  get summary() {
    return {
      contractValue: this.formatNumber(this.getFormNumber('ContractValue')),
      contractValueAddVAT: this.formatNumber(this.getFormNumber('ContractValueAddVAT'))
    };
  }

  /**
   * Đọc một ô số của đầu phiếu, trả 0 nếu chưa có giá trị.
   * Dùng get() chứ không dùng contains(): contains() báo false với control đang
   * disabled, mà đúng hai ô cần đọc ở đây đều khai báo isDisabled.
   */
  private getFormNumber(key: string): number {
    if (!this.editorFrm) return 0;

    let control = this.editorFrm.get(key);
    if (!control) return 0;

    let value = Number(control.value);
    return isNaN(value) ? 0 : value;
  }

  private formatNumber(value: number): string {
    return wjcCore.Globalize.format(value, 'n0');
  }

  // ==========================================================================
  // Chia khung nội dung cho đầu phiếu
  // ==========================================================================

  /**
   * Chèn một thanh tiêu đề trước field mở đầu mỗi khung trong fieldGroups.
   *
   * Chỉ CHÈN THÊM, không di chuyển field nào: các control do Wijmo dựng nên việc
   * bê sang cha khác dễ làm control mất trạng thái. Thanh tiêu đề dùng
   * clear:both - .form-row của hệ thống không clear float nên các ô col-md-6
   * trôi cạnh nhau, thanh này cắt mạch float và mở khung mới từ cột bên trái.
   *
   * Hàm idempotent: chạy lại không nhân đôi tiêu đề.
   */
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

  /**
   * Đi ngược lên tìm div .form-row bọc ngoài một control của đầu phiếu.
   * Gặp .form-row gần nhất là dừng, tức là .form-row df-panel sinh ra cho từng
   * control, không phải .form-row bọc cả df-panel ở template.
   */
  private closestFormRow(element: HTMLElement): HTMLElement | null {
    let node: HTMLElement = element;

    while (node && node.parentElement) {
      if (node.className && node.className.indexOf('form-row') > -1) return node;
      node = node.parentElement;
    }

    return null;
  }

  // ==========================================================================
  // Hiển thị: badge trạng thái trên lưới
  // ==========================================================================

  /**
   * Ô đang mở editor hay không.
   *
   * BaseEditorComponent dựng editor (dropdown lookup, ô nhập ngày...) ngay trong
   * formatItem. Handler badge bên dưới đăng ký SAU nên chạy SAU; nếu không bỏ qua
   * ô đang sửa thì việc ghi đè innerHTML sẽ xoá mất editor.
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
    if (!this.grid1) return;

    // Lưới tài liệu đính kèm: cột "Yêu cầu đính kèm" hiển thị dạng badge.
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
