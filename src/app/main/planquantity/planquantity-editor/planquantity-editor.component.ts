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
import { LayoutPlanQuantityEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinter } from "../planquantity-explorer/planquantity-printer.data";
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';
import * as wjcGridXlsx from 'wijmo/wijmo.grid.xlsx';
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { SystemConstants } from "../../../core/common/system.constants";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-planquantity-editor-form',
  templateUrl: './planquantity-editor.component.html',
  styleUrls: ['./planquantity-editor.component.css']
})

export class PlanQuantityEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  layoutPrint: LayoutPrinter = new LayoutPrinter();

  indexPage = ['/main', 'planquantity', 'index'];
  folderName = 'Ke_Hoach_KhoiLuong';
  indexPage_Editor = ['/main', 'planquantity', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutPlanQuantityEditor(service, this.parentData);
    this._layoutPrinter = this.layoutPrint.Layout;
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4];
    this.init();
    //this.grid1.isReadOnly = true;
    this.grid1.allowAddNew = true;
    this.grid2.allowAddNew = false;
    this.grid3.isReadOnly = true;
    this.grid4.allowAddNew = false;

    this.dbClickCellContent(this.grid3);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    // Với quy trình P-1604: khóa (read-only) 2 cột OriginalAmount/PaymentAmount để không edit được trên giao diện.
    // Áp dụng khi lưới Chi tiết khối lượng nạp dữ liệu (lúc này parentData/ProcessCode đã có).
    this.grid.itemsSourceChanged.addHandler(() => this.applyProcessLockAmount());

    // Chốt chặn cuối: đánh giá ProcessCode ngay lúc bắt đầu sửa ô -> luôn theo giá trị quy trình hiện tại,
    // kể cả khi user vừa đổi ProcessCode trong lúc nhập liệu.
    this.grid.beginningEdit.addHandler((s: wjcGrid.FlexGrid, e: wjcGrid.CellRangeEventArgs) => {
      let _binding = s.columns[e.col].binding;
      if ((_binding == 'OriginalAmount' || _binding == 'PaymentAmount') && this.getProcessCode() == 'P-1604') {
        e.cancel = true;
      }
    });

    // Đánh dấu khi USER thực sự sửa 2 cột amount (gõ tay hoặc dán) -> miễn nhiễm với mọi nạp lại tự động.
    const _markEdited = (s: wjcGrid.FlexGrid, e: wjcGrid.CellRangeEventArgs) => {
      let _binding = s.columns[e.col].binding;
      if (_binding == 'OriginalAmount' || _binding == 'PaymentAmount') {
        this._amountUserEdited = true;
      }
    };
    this.grid.cellEditEnded.addHandler(_markEdited);
    this.grid.pastedCell.addHandler(_markEdited);

    this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data['IsTitleRow'] == true) {
            wjcCore.setCss(e.cell, {
              color: 'blue',
              fontWeight: 'bold'
            });
          }
          else {
            wjcCore.setCss(e.cell, {
              color: '',
              fontWeight: '',
              // backgroundColor: ''
            });
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.destroy();
  }

  // Lấy mã quy trình hiện tại
  getProcessCode(): string {
    if (this.editorFrm && this.editorFrm.controls['ProcessCode'])
      return this.editorFrm.controls['ProcessCode'].value;
    if (this.parentData && this.parentData['ProcessCode'] != null)
      return this.parentData['ProcessCode'];
    return '';
  }

  _processSubReady = false;
  _origAllowAddNew: boolean = null;
  // Cờ đánh dấu user đã tự tay sửa OriginalAmount/PaymentAmount (miễn nhiễm với nạp lại tự động).
  // Chỉ reset khi "Tải dữ liệu" (dữ liệu bị thay hoàn toàn) — xem onClick().
  _amountUserEdited = false;

  // P-1604: khóa read-only 2 cột OriginalAmount/PaymentAmount VÀ không cho thêm dòng mới trên lưới Chi tiết khối lượng.
  // Đăng ký lắng nghe ProcessCode 1 lần để cập nhật khóa NGAY khi user đổi quy trình duyệt trong lúc nhập liệu.
  applyProcessLockAmount() {
    if (!this._processSubReady && this.editorFrm && this.editorFrm.controls['ProcessCode']) {
      this._processSubReady = true;
      const sub = this.editorFrm.controls['ProcessCode'].valueChanges.subscribe(() => this.onProcessCodeChanged());
      this.subscription.add(sub);
    }
    this.applyProcessLockState();
  }

  onProcessCodeChanged() {
    this.applyProcessLockState();
    if (this.getProcessCode() == 'P-1604' && this._amountUserEdited) {
      alert('Quy trình P-1604: không được thay đổi giá trị "KL BoQ" và "KL BCH Tính".');
    }
  }

  applyProcessLockState() {
    if (!this.grid || !this.grid.columns) { return; }
    let _lock = this.getProcessCode() == 'P-1604';

    // Khóa sửa 2 cột amount
    for (let binding of ['OriginalAmount', 'PaymentAmount']) {
      let col = this.grid.columns.getColumn(binding);
      if (col) { col.isReadOnly = _lock; }
    }

    // Khóa thêm dòng mới (lưu giá trị gốc để khôi phục đúng khi rời P-1604)
    if (this._origAllowAddNew == null) { this._origAllowAddNew = this.grid.allowAddNew; }
    this.grid.allowAddNew = _lock ? false : this._origAllowAddNew;
  }

  // "Tải dữ liệu" (kế thừa từ version kế hoạch trước): là dữ liệu nạp tự động, KHÔNG phải user sửa.
  // Nạp xong -> xóa cờ đã-sửa (thao tác sửa trước đó bị dữ liệu kế thừa ghi đè hợp lệ).
  async onClick(state?: any) {
    await super.onClick(state);
    this._amountUserEdited = false;
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    // Bật loading NGAY khi click Lưu/Gửi duyệt để user không thao tác/click thêm.
    // Mọi nhánh kết thúc (lỗi validation, lỗi check, hoàn tất) đều phải tắt loading qua _stopLoading().
    this.showLoading = true;
    const _stopLoading = () => this.showLoading = false;

    // Chống lách P-1604: nếu đang ở P-1604 mà user đã tự tay sửa 2 cột amount -> chặn lưu.
    if (this.getProcessCode() == 'P-1604' && this._amountUserEdited) {
      _stopLoading();
      alert('Quy trình P-1604: không được thay đổi giá trị "KL BoQ" và "KL BCH Tính".');
      return;
    }

    // Kiểm tra tính đúng đắn của ItemNo (định dạng + đúng phân cấp) trên lưới Chi tiết khối lượng
    const itemNoErrors = this.validateItemNoHierarchy(this.grid, 'ItemNo');
    if (itemNoErrors.length > 0) {
      _stopLoading();
      alert('[Chi tiết khối lượng] Lỗi STT:\n\n▪ ' + itemNoErrors.join('\n▪ '));
      return;
    }

    // Tính SubTotal khối lượng cho các dòng cha theo phân cấp ItemNo
    const subTotalFields = ['OriginalAmount', 'PaymentAmount'];
    for (let i = 1; i <= 10; i++) {
      subTotalFields.push('Month' + String(i).padStart(2, '0'));
    }
    this.computeSubTotals([this.grid], subTotalFields, 'ItemNo');

    let _numEror = 0;
    for (let i in this.gridArray) {
      if (this.gridArray[i].itemsSource.items.length == 0 && i != '1' && i != '3') {
        _numEror += 1;
        break;
      }
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

    for (let item of this.grid.itemsSource.items) {
      if ((!item['JobCode'] || !item['Unit']) && item['IsTitleRow'] == false) {
        _stopLoading();
        alert('Mã khối lượng, Đơn vị tính: không được bỏ trắng giá trị, STT: ' + item['ItemNo']);
        return;
      }
    }

    const ntpFields = [
      'Month01', 'Month02', 'Month03', 'Month04', 'Month05', 'Month06',
      'Month07', 'Month08', 'Month09', 'Month10'
    ];

    const fmtVN = function (n: number): string {
      const parts = Math.round(n).toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return parts.join(',');
    };

    for (let item of this.grid.itemsSource.items) {
      if (item['IsTitleRow'] == true) { continue; }
      let totalNtp = 0;
      for (let j = 0; j < ntpFields.length; j++) {
        const v = parseFloat(item[ntpFields[j]]);
        if (!isNaN(v)) { totalNtp += v; }
      }
      const paymentRaw = parseFloat(item['PaymentAmount']);
      const payment = isNaN(paymentRaw) ? 0 : paymentRaw;
      if (Math.round(totalNtp) > Math.round(payment)) {
        _stopLoading();
        alert('LỖI STT ' + item['ItemNo'] + ': Tổng NTP 01 → NTP 10 (' + fmtVN(totalNtp) + ') vượt quá KH Khối lượng BCH Tính (' + fmtVN(payment) + '). Vui lòng kiểm tra lại.');
        return;
      }
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

    if (_numEror > 0) {
      _stopLoading();
      alert('Các Tab dữ liệu (Chi tiết, Liên kết đối tác, Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có) hoặc điền đầy đủ thông tin.');
      return;
    }

    const checkResult = this.checkUniqueField(this.grid, ['ActivityCode', 'JobCode'], 'ItemNo', 'IsTitleRow');

    if (checkResult.isDuplicate) {
      let msg = `LỖI: Trùng lặp cặp Hạng mục + Mã khối lượng trong danh sách!\n\n`;

      // Duyệt qua từng nhóm lỗi để tạo câu thông báo
      checkResult.errors.forEach(err => {
        msg += `▪ [Hạng mục - Mã khối lượng]: [ ${err.duplicateValue} ] trùng tại các STT: ${err.duplicateLabels.join(', ')}\n`;
      });

      msg += `\nVui lòng kiểm tra và chỉnh sửa lại trước khi lưu.`;

      _stopLoading();
      alert(msg);
      return;
    }

    this.checkUniqueColGrid(this.grid, 'ItemNo');
    if (this._errorUnique) {
      _stopLoading();
      alert('Số thứ tự đã bị trùng, giá trị: ' + this._valueDuplicate);
      return;
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
              this.sendMail(formData, 'K5', this.id, false, '1');
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
    wjcGridXlsx.FlexGridXlsxConverter.save(
      this.grid,
      { includeColumnHeaders: true, includeCellStyles: true },
      `QLKL kết cấu - ${docNo}.xlsx`
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
