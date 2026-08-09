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
import { LayoutPlanQuantity2Editor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinter } from "../planquantity2-explorer/planquantity2-printer.data";
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';
import * as wjcGridXlsx from 'wijmo/wijmo.grid.xlsx';
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { SystemConstants } from "../../../core/common/system.constants";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-planquantity2-editor-form',
  templateUrl: './planquantity2-editor.component.html',
  styleUrls: ['./planquantity2-editor.component.css']
})

export class PlanQuantity2EditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  focusedGrid: wjcGrid.FlexGrid;
  focusedGridName: string = 'Chi tiết';
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('grid5') grid5: wjcGrid.FlexGrid;
  @ViewChild('grid6') grid6: wjcGrid.FlexGrid;
  @ViewChild('grid7') grid7: wjcGrid.FlexGrid;
  @ViewChild('grid8') grid8: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  layoutPrint: LayoutPrinter = new LayoutPrinter();

  indexPage = ['/main', 'planquantity2', 'index'];
  folderName = 'Ke_Hoach_KhoiLuong';
  indexPage_Editor = ['/main', 'planquantity2', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutPlanQuantity2Editor(service, this.parentData);
    this._layoutPrinter = this.layoutPrint.Layout;
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4, this.grid5, this.grid6, this.grid7, this.grid8];
    this.init();
    //this.grid1.isReadOnly = true;
    this.grid1.allowAddNew = true;
    this.grid2.allowAddNew = false;
    this.grid3.isReadOnly = true;
    this.grid4.allowAddNew = false;
    this.grid5.allowAddNew = true;
    this.grid6.allowAddNew = true;
    this.grid7.allowAddNew = true;
    this.grid8.allowAddNew = true;

    this.dbClickCellContent(this.grid3);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    const formatTitleRow = (s, e: wjcGrid.FormatItemEventArgs) => {
      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;
        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data['IsTitleRow'] == true) {
            wjcCore.setCss(e.cell, { color: 'blue', fontWeight: 'bold' });
          } else {
            wjcCore.setCss(e.cell, { color: '', fontWeight: '' });
          }
        }
      }
    };

    this.grid.formatItem.addHandler(formatTitleRow);
    this.grid5.formatItem.addHandler(formatTitleRow);
    this.grid6.formatItem.addHandler(formatTitleRow);
    this.grid7.formatItem.addHandler(formatTitleRow);
    this.grid8.formatItem.addHandler(formatTitleRow);

    // P-1605: khóa sửa QtyCDT/QtyBCH + không thêm dòng mới trên 5 lưới BOQ.
    for (let entry of this.getBoqGrids()) {
      const _g = entry.grid;
      const _tab = entry.tabName;
      _g.itemsSourceChanged.addHandler(() => this.applyProcessLockQty());
      // Chốt chặn cuối: đánh giá ProcessCode ngay lúc bắt đầu sửa ô -> luôn theo giá trị quy trình hiện tại
      _g.beginningEdit.addHandler((s: wjcGrid.FlexGrid, e: wjcGrid.CellRangeEventArgs) => {
        let _binding = s.columns[e.col].binding;
        if ((_binding == 'QtyCDT' || _binding == 'QtyBCH') && this.getProcessCode() == 'P-1605') {
          e.cancel = true;
        }
      });
      // Đánh dấu tab khi USER thực sự sửa QtyCDT/QtyBCH (gõ tay hoặc dán) -> miễn nhiễm với nạp lại tự động
      const _markEdited = (s: wjcGrid.FlexGrid, e: wjcGrid.CellRangeEventArgs) => {
        let _binding = s.columns[e.col].binding;
        if (_binding == 'QtyCDT' || _binding == 'QtyBCH') {
          this._qtyEditedTabs.add(_tab);
        }
      };
      _g.cellEditEnded.addHandler(_markEdited);
      _g.pastedCell.addHandler(_markEdited);
    }

    this.focusedGrid = this.grid;
    this.focusedGridName = 'Xây tô ốp lát';
  }

  setActiveTab(grid: wjcGrid.FlexGrid, name: string) {
    this.focusedGrid = grid;
    this.focusedGridName = name;
  }

  ngOnDestroy() {
    this.destroy();
  }

  // Danh sách 5 lưới BOQ (phân cấp theo ItemNo) + tên tab tương ứng
  getBoqGrids(): { grid: wjcGrid.FlexGrid, tabName: string }[] {
    return [
      { grid: this.grid, tabName: 'Xây tô ốp lát' },
      { grid: this.grid5, tabName: 'Sơn nước' },
      { grid: this.grid6, tabName: 'Trần, vách' },
      { grid: this.grid7, tabName: 'Đá ốp lát' },
      { grid: this.grid8, tabName: 'Epoxy, Khác' },
    ];
  }

  // Lấy mã quy trình hiện tại — ưu tiên form control (giá trị live), fallback parentData
  getProcessCode(): string {
    if (this.editorFrm && this.editorFrm.controls['ProcessCode'])
      return this.editorFrm.controls['ProcessCode'].value;
    if (this.parentData && this.parentData['ProcessCode'] != null)
      return this.parentData['ProcessCode'];
    return '';
  }

  _processSubReady = false;
  _origAllowAddNew = new Map<wjcGrid.FlexGrid, boolean>();
  // Tập tên tab mà user đã tự tay sửa QtyCDT/QtyBCH (miễn nhiễm với nạp lại tự động).
  // Chỉ xóa khi "Tải dữ liệu" (dữ liệu bị thay hoàn toàn) — xem onClick().
  _qtyEditedTabs = new Set<string>();

  // P-1605: khóa read-only QtyCDT/QtyBCH + không thêm dòng mới trên 5 lưới BOQ.
  // Đăng ký lắng nghe ProcessCode 1 lần để cập nhật khóa NGAY khi user đổi quy trình duyệt.
  applyProcessLockQty() {
    if (!this._processSubReady && this.editorFrm && this.editorFrm.controls['ProcessCode']) {
      this._processSubReady = true;
      const sub = this.editorFrm.controls['ProcessCode'].valueChanges.subscribe(() => this.onProcessCodeChanged());
      this.subscription.add(sub);
    }
    this.applyProcessLockState();
  }

  onProcessCodeChanged() {
    this.applyProcessLockState();
    // Chống lách: khi đổi VỀ P-1605 mà user đã tự tay sửa QtyCDT/QtyBCH -> cảnh báo ngay
    if (this.getProcessCode() == 'P-1605' && this._qtyEditedTabs.size > 0) {
      alert('Quy trình P-1605: không được thay đổi giá trị "Khối lượng (CĐT)", "Khối lượng (BCH)". Tab bị thay đổi: ' + Array.from(this._qtyEditedTabs).join(', '));
    }
  }

  applyProcessLockState() {
    let _lock = this.getProcessCode() == 'P-1605';
    for (let entry of this.getBoqGrids()) {
      const grid = entry.grid;
      if (!grid || !grid.columns) { continue; }

      // Khóa sửa 2 cột QtyCDT/QtyBCH
      for (let binding of ['QtyCDT', 'QtyBCH']) {
        let col = grid.columns.getColumn(binding);
        if (col) { col.isReadOnly = _lock; }
      }

      // Khóa thêm dòng mới (lưu giá trị gốc để khôi phục đúng khi rời P-1605)
      if (!this._origAllowAddNew.has(grid)) { this._origAllowAddNew.set(grid, grid.allowAddNew); }
      grid.allowAddNew = _lock ? false : this._origAllowAddNew.get(grid);
    }
  }

  // "Tải dữ liệu" (kế thừa từ version kế hoạch trước): dữ liệu nạp tự động, KHÔNG phải user sửa.
  // Nạp xong -> xóa cờ đã-sửa (thao tác sửa trước đó bị dữ liệu kế thừa ghi đè hợp lệ).
  async onClick(state?: any) {
    await super.onClick(state);
    this._qtyEditedTabs.clear();
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    // Bật loading NGAY khi click Lưu/Gửi duyệt để user không thao tác/click thêm.
    // Mọi nhánh kết thúc (lỗi validation, lỗi check, hoàn tất) đều phải tắt loading qua _stopLoading().
    this.showLoading = true;
    const _stopLoading = () => this.showLoading = false;

    // Chống lách P-1605: nếu đang ở P-1605 mà user đã tự tay sửa QtyCDT/QtyBCH -> chặn lưu.
    if (this.getProcessCode() == 'P-1605' && this._qtyEditedTabs.size > 0) {
      _stopLoading();
      alert('Quy trình P-1605: không được thay đổi giá trị "Khối lượng (CĐT)", "Khối lượng (BCH)" — không thể lưu. Tab bị thay đổi: ' + Array.from(this._qtyEditedTabs).join(', '));
      return;
    }

    // Các lưới BOQ phân cấp theo ItemNo và tên tab tương ứng
    const boqGrids = this.getBoqGrids();

    // Kiểm tra tính đúng đắn của ItemNo (định dạng + đúng phân cấp) trước khi lưu
    for (let entry of boqGrids) {
      const itemNoErrors = this.validateItemNoHierarchy(entry.grid, 'ItemNo');
      if (itemNoErrors.length > 0) {
        _stopLoading();
        alert('[' + entry.tabName + '] Lỗi STT:\n\n▪ ' + itemNoErrors.join('\n▪ '));
        return;
      }
    }

    // Tính SubTotal khối lượng cho các dòng cha trước khi kiểm tra & lưu
    const subTotalFields = ['QtyCDT', 'QtyBCH'];
    for (let i = 1; i <= 10; i++) {
      subTotalFields.push('Qty' + String(i).padStart(2, '0'));
    }
    this.computeSubTotals(boqGrids.map(e => e.grid), subTotalFields, 'ItemNo');

    let _numEror = 0;
    for (let i in this.gridArray) {
      if (this.gridArray[i].itemsSource.items.length == 0 && (i == '2' || i == '4')) {
        _numEror += 1;
        break;
      }
    }

    if (_numEror > 0) {
      _stopLoading();
      alert('Các Tab dữ liệu (Liên kết đối tác, Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có) hoặc điền đầy đủ thông tin.');
      return;
    }

    for (let item of this.grid4.itemsSource.items) {
      if (!item['CustomerCode']) {
        _stopLoading();
        alert('Yêu cầu khai báo đầy đủ Mã đối tượng ở Tab Liên kết đối tác.');
        return;
      }

      if (item['CustomerCode'] !== 'HT001' && !item['BizDocId_C1']) {
        _stopLoading();
        alert('Yêu cầu khai báo Hợp đồng cho các NTP có Mã khác SOL ở Tab Liên kết đối tác.');
        return;
      }
    }

    const fmtVN = function (n: number): string {
      const parts = Math.round(n).toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return parts.join(',');
    };

    const gridsToValidate = [
      { grid: this.grid, tabName: 'Xây tô ốp lát', qtyFrom: 1, qtyTo: 10 },
      { grid: this.grid5, tabName: 'Sơn nước', qtyFrom: 1, qtyTo: 10 },
      { grid: this.grid6, tabName: 'Trần, vách', qtyFrom: 1, qtyTo: 10 },
      { grid: this.grid7, tabName: 'Đá ốp lát', qtyFrom: 1, qtyTo: 10 },
      { grid: this.grid8, tabName: 'Epoxy, Khác', qtyFrom: 1, qtyTo: 10 },
    ];

    for (let entry of gridsToValidate) {
      const qtyFields: string[] = [];
      for (let i = entry.qtyFrom; i <= entry.qtyTo; i++) {
        qtyFields.push('Qty' + String(i).padStart(2, '0'));
      }
      const qtyLabel = 'Qty' + String(entry.qtyFrom).padStart(2, '0') + ' → Qty' + String(entry.qtyTo).padStart(2, '0');
      for (let item of entry.grid.itemsSource.items) {
        if (item['IsTitleRow'] == true) { continue; }
        let totalQty = 0;
        for (let j = 0; j < qtyFields.length; j++) {
          const v = parseFloat(item[qtyFields[j]]);
          if (!isNaN(v)) { totalQty += v; }
        }
        const qtyBCHRaw = parseFloat(item['QtyBCH']);
        const qtyBCH = isNaN(qtyBCHRaw) ? 0 : qtyBCHRaw;
        if (Math.round(totalQty) > Math.round(qtyBCH)) {
          _stopLoading();
          alert('[' + entry.tabName + '] LỖI STT ' + item['ItemNo'] + ': Tổng ' + qtyLabel + ' (' + fmtVN(totalQty) + ') vượt quá KH Khối lượng BCH Tính (' + fmtVN(qtyBCH) + '). Vui lòng kiểm tra lại.');
          return;
        }
      }
    }

    for (let entry of gridsToValidate) {
      for (let item of entry.grid.itemsSource.items) {
        if ((!item['JobCode'] || !item['Unit']) && item['IsTitleRow'] == false) {
          _stopLoading();
          alert('[' + entry.tabName + '] Mã khối lượng, Đơn vị tính: không được bỏ trắng giá trị, STT: ' + item['ItemNo']);
          return;
        }
      }
    }

    for (let entry of gridsToValidate) {
      this.checkUniqueColGrid(entry.grid, 'ItemNo');
      if (this._errorUnique) {
        _stopLoading();
        alert('[' + entry.tabName + '] Số thứ tự đã bị trùng, giá trị: ' + this._valueDuplicate);
        return;
      }
    }

    for (let entry of gridsToValidate) {
      const checkResult = this.checkUniqueField(entry.grid, ['ActivityCode', 'JobCode'], 'ItemNo', 'IsTitleRow');
      if (checkResult.isDuplicate) {
        let msg = `[${entry.tabName}] LỖI: Trùng lặp cặp Hạng mục + Mã khối lượng trong danh sách!\n\n`;
        checkResult.errors.forEach(err => {
          msg += `▪ Mã [ ${err.duplicateValue} ] trùng tại các STT: ${err.duplicateLabels.join(', ')}\n`;
        });
        msg += `\nVui lòng kiểm tra và chỉnh sửa lại trước khi lưu.`;
        _stopLoading();
        alert(msg);
        return;
      }
    }

    // Kiểm tra cặp Hạng mục + Mã khối lượng trùng giữa các grid
    const crossGridTracker = new Map<string, { display: string, entries: { tabName: string, itemNo: any }[] }>();
    for (let entry of gridsToValidate) {
      for (let item of entry.grid.itemsSource.items) {
        if (item['IsTitleRow'] == true) continue;
        const code = item['ActivityCode'];
        const job = item['JobCode'];
        if (!code || !job) continue;
        const key = String(code).trim() + '' + String(job).trim();
        let tracked = crossGridTracker.get(key);
        if (!tracked) {
          tracked = { display: code + ' - ' + job, entries: [] };
          crossGridTracker.set(key, tracked);
        }
        tracked.entries.push({ tabName: entry.tabName, itemNo: item['ItemNo'] });
      }
    }

    const crossErrors: { code: string, entries: { tabName: string, itemNo: any }[] }[] = [];
    crossGridTracker.forEach(tracked => {
      const tabsWithCode = new Set(tracked.entries.map(e => e.tabName));
      if (tabsWithCode.size > 1) crossErrors.push({ code: tracked.display, entries: tracked.entries });
    });

    if (crossErrors.length > 0) {
      let msg = `LỖI: Cặp Hạng mục + Mã khối lượng bị trùng giữa các tab!\n\n`;
      crossErrors.forEach(err => {
        msg += `▪ [Hạng mục - Mã khối lượng]: [ ${err.code} ] xuất hiện tại:\n`;
        err.entries.forEach(e => msg += `   - [${e.tabName}] STT ${e.itemNo}\n`);
      });
      msg += `\nVui lòng kiểm tra và chỉnh sửa lại trước khi lưu.`;
      _stopLoading();
      alert(msg);
      return;
    }


    let _errorSave1 = false;
    for (let item of this.grid2.itemsSource.items) {
      if (item['EmployeeCode'] == '') {
        _errorSave1 = true;
        break;
      }
      else
        if (item['EmployeeCode'].toString().indexOf(',') > 0 && item['EmployeeCodeReal'] == '') {
          _errorSave1 = true;
          break;
        }
    }

    if (isApproveSend == true) {
      if (_errorSave1) {
        _stopLoading();
        alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
        return;
      }

      // checkQuanLyKhoiLuong() có thể chạy lâu -> loading đã bật từ đầu hàm, giữ đến khi hoàn tất
      this.checkQuanLyKhoiLuong().then(() => {
        if (!this._errCheck) {
          this.submit(formData, this.indexPage, isApproveSend).then(() => {
            if (this.allowSendMail) {
              this.sendMail(formData, 'M3', this.id, false, '1');
            }
            _stopLoading();
          }).catch(() => _stopLoading());
        }
        else {
          _stopLoading();
          alert(this._errMess);
        }
      }).catch(() => _stopLoading());
    }
    else
      this.submit(formData, this.indexPage_Editor).then(() => _stopLoading()).catch(() => _stopLoading());

  }

  showPrintVoucher(input: any) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher(input);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  exportGridToExcel() {
    const docNo = this.parentData['DocNo'] || 'ChiTiet';
    const targetGrid = this.focusedGrid || this.grid;
    const sheetName = this.focusedGridName || 'Chi tiết';
    wjcGridXlsx.FlexGridXlsxConverter.save(
      targetGrid,
      { includeColumnHeaders: true, includeCellStyles: true },
      `QLKL hoàn thiện - ${sheetName} - ${docNo}.xlsx`
    );
  }

  exportHtmlWorkFlow(input: any, extInput?: string) {
    if (this.parentData["CompletedApprove"] == false) {
      alert('Hồ sơ chưa hoàn thiện duyệt, không thể in ấn workflow');
      return;
    }
    else
      this.exportHtml_WorkFlow('WorkFlow_KHKK.docx', 'WorkFlow KHKK - {VAR=ProductName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }

  output: Array<Object>;
  _errCheck: boolean = false;
  _errMess: string;

  async checkQuanLyKhoiLuong() {
    this.showLoading = true;
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();
    const param4 = new ParameterContract();
    const param5 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('ProductCostId');
    param1.ParameterValue = this.editorFrm.controls['ProductCostId'].value;
    params.push(param1);

    param2.ParameterName = Global.convertParameterName('BranchCode');
    param2.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
    params.push(param2);

    param3.ParameterName = Global.convertParameterName('Id');
    param3.ParameterValue = this.id;
    params.push(param3);

    param4.ParameterName = Global.convertParameterName('CCMBudgetId');
    param4.ParameterValue = this.parentData['CCMBudgetId'];
    params.push(param4);

    param5.ParameterName = Global.convertParameterName('DocCode');
    param5.ParameterValue = this.parentData['DocCode'];
    params.push(param5);

    let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_CheckKeHoach_TheoDoiKhoiLuong', params)
      .toPromise().then();

    this.output = <Array<Object>>(_data['output']);
    this._errCheck = this.output['@_Error'];
    // Nội dung trả về ngăn cách các câu bằng '||' -> tách thành mỗi câu một dòng (\n) khi hiển thị
    let _rawMess = this.output['@_ErrorMessage'];
    this._errMess = _rawMess
      ? String(_rawMess).split('||').map(s => s.trim()).filter(s => s.length > 0).join('\n')
      : _rawMess;

    // if (this._errCheck) {
    //   alert(this._errMess + '. Kiểm tra lại Kế hoạch Khối lượng');
    //   this.showLoading = false;
    // }
    // else {
    //   alert('Kiểm tra Kế hoạch Khối lượng thành công, không có lỗi!');
    //   this.showLoading = false;
    // }
  }
}
