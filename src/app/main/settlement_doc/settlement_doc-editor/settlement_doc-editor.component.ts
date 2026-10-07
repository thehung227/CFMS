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
import { LayoutSettlement_DocEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinterWordFlow } from "../../_printerlayout/workflow/workflow-printer.data";

@Component({
  selector: 'app-settlement_doc-editor-form',
  templateUrl: './settlement_doc-editor.component.html',
  styleUrls: ['./settlement_doc-editor.component.css']
})

export class Settlement_DocEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  layoutPrintWordFlow: LayoutPrinterWordFlow = new LayoutPrinterWordFlow();

  indexPage = ['/main', 'settlement_doc', 'index'];
  folderName = '04.Quyet_Toan_Hop_Dong';
  indexPage_Editor = ['/main', 'settlement_doc', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutSettlement_DocEditor(service, this.parentData);
    this._layoutPrinter_WordFlow = this.layoutPrintWordFlow.Layout;
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init().then(() => this.refreshTongThanhToan3Ben());
    this.grid.allowAddNew = false;
    this.grid1.allowAddNew = false;
    this.grid2.isReadOnly = true;

    this.dbClickCellContent(this.grid2);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
     this.grid3.formatItem.addHandler((s: wjcGrid.FlexGrid, e: wjcGrid.FormatItemEventArgs) => {
              if (e.panel.cellType != wjcGrid.CellType.Cell) return;
              let col = s.columns[e.col];
              if (!col || col.binding != 'HrefLink') return;
        
              let url = (s.getCellData(e.row, e.col, false) || '').toString().trim();
              if (url) {
                e.cell.innerHTML = '<button type="button" class="btn btn-link" '
                  + 'style="padding:0;color:#1565c0;text-decoration:underline;cursor:pointer;" '
                  + 'onclick="event.stopPropagation();window.open(\'' + url.replace(/'/g, "\\'") + '\',\'_blank\')">'
                  + 'Link</button>';
              } else {
                e.cell.innerHTML = '';
              }
            });
  }

  // Đầu phiếu: Tổng giá trị thanh toán 3 bên của Bảng KLQT liên kết và Số tiền còn lại
  async refreshTongThanhToan3Ben() {
    await this.dfpanel.runConstraint('Evaluator_ServerConstraint_Amount_TT3Ben');
    await this.dfpanel.runConstraint('Evaluator_Amount_ConLaiTT3Ben_Calculate');
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    let _numEror = 0;
    for (let i in this.gridArray) {
      if (this.gridArray[i].itemsSource.items.length == 0 && i != '2' && i != '3' && i != '1') {
        _numEror += 1;
        break;
      }
    }

    let _errorSave1 = false;
    for (let item of this.grid1.itemsSource.items) {
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

    // this.checkUniqueColGrid(this.grid1, 'ApproveGroup');
    // if (this._errorUnique == false) {
      if (_numEror == 0) {
        if (isApproveSend == true) {
          let _errorSave = false;
          for (let item of this.grid1.itemsSource.items) {
            if (item['Attached'] == true && item['Description'] != 'Theo mẫu công ty ban hành' && (item['FilePath'] == '' || item['FilePath'] == undefined)) {
              _errorSave = false;
              break;
            }
          }
          if (_errorSave) {
            alert('Yêu cầu đính kèm tài liệu trước khi gửi duyệt!');
          }
          else {
            if (_errorSave1 == false) {
              this.submit(formData, this.indexPage, isApproveSend).then(() => {
                if (this.allowSendMail) {
                  this.sendMail(formData, 'C5', this.id, false, '1');
                }
              });
            } else
              alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị')
          }
        }
        else
          this.submit(formData, this.indexPage_Editor);
      }
      else {
        alert('Các Tab chi tiết cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có).');
      }
    }
  //   else
  //     alert('Dữ liệu STT duyệt đang bị trùng, giá trị trùng: ' + this._valueDuplicate);
  // }

async onClick_2(state?: any) {
    try {
      this.showDialog = false;//Thêm dialog

      if (this.editorFrm.valid) {
        this.showLoading = true;
        this.taidulieu = true;
      }

      for (let command of this._layoutDeclare.buttonLoadChild2) {
        if (this.editorFrm.valid)
          await this.dfpanel.runConstraint(command).then();
      }

      this.showLoading = false;
    }
    catch (ex) {
      alert("Xảy ra lỗi trong quá trình thực hiện");
      console.log(ex);
      this.showLoading = false;
    }
  }
  
  showPrintVoucher_WorklFlow(input: any, gridForm?: wjcGrid.FlexGrid, extInput?: string) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher_WordFlow(input, 'MAU1', gridForm, extInput, 'DocCode');

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  exportHtmlWorkFlow(input: any, extInput?: string) {
    this.exportHtml_WorkFlow('WorkFlow_QT.docx', 'WorkFlow QT - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }
}
