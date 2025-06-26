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
import { LayoutBillPayMainEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinter } from "../billpaymain-explorer/billpaymain-printer.data";
import { LayoutPrinterWordFlow } from "../../_printerlayout/workflow/workflowTT-printer.data";

@Component({
  selector: 'app-billpaymain-editor-form',
  templateUrl: './billpaymain-editor.component.html',
  styleUrls: ['./billpaymain-editor.component.css']
})

export class BillPayMainEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {
  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  layoutPrint: LayoutPrinter = new LayoutPrinter();
  layoutPrintWordFlow: LayoutPrinterWordFlow = new LayoutPrinterWordFlow();
  indexPage = ['/main', 'billpaymain', 'index'];
  folderName = '06.Thanh_Toan_TP_NCC';
  indexPage_Editor = ['/main', 'billpaymain', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutBillPayMainEditor(service, this.parentData);
    this._layoutPrinter = this.layoutPrint.Layout;
    this._layoutPrinter_WordFlow = this.layoutPrintWordFlow.Layout;
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();
    this.grid1.allowAddNew = false;
    this.grid2.allowAddNew = false;
    this.grid3.isReadOnly = true;

    this.dbClickCellContent(this.grid3);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    let _numEror = 0;
    // for (let i in this.gridArray) {
    if ((this.gridArray[1].itemsSource.items.length == 0) || (this.gridArray[2].itemsSource.items.length == 0)) {
      _numEror += 1;
    }
    // }

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

    this.checkUniqueColGrid(this.grid2, 'ApproveGroup');
    if (this._errorUnique == false) {
      if (_numEror == 0) {
        if (isApproveSend == true) {
          let _errorSave = false;
          for (let item of this.grid1.itemsSource.items) {
            if (item['Attached'] == true && item['Description'] != 'Theo mẫu công ty ban hành' && (item['FilePath'] == '' || item['FilePath'] == undefined)) {
              _errorSave = true;
              break;
            }
          }
          if (_errorSave) {
            alert('Yêu cầu đính kèm tài liệu trước khi gửi duyệt!');
          }
          else {
            // this.editorFrm.controls['ApproveSend'].setValue(true);
            // this.dfpanel.runConstraint('Evaluator_UpdateApproveSend').then();
            // window.close();
            if (_errorSave1 == false) {
              this.submit(formData, this.indexPage, isApproveSend).then(() => {
                if (this.allowSendMail) {
                  this.sendMail(formData, 'P4', this.id, false, '1');
                }
              });
            } else
              alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
          }
        }
        else
          this.submit(formData, this.indexPage_Editor);
        // this.submit(formData, this.indexPage_Editor).then(()=>{
        //   location.reload(false);
        // });
      }
      else {
        alert('Các Tab dữ liệu (Tài liệu đính kèm, Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có) hoặc điền đầy đủ thông tin.');
      }
    }
    else
      alert('Dữ liệu STT duyệt đang bị trùng, giá trị trùng: ' + this._valueDuplicate);
  }

  showPrintVoucher(input: any) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher(input);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
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
    this.exportHtml_WorkFlow('WorkFlow_TT.docx', 'WorkFlow TP.NCC - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }
}
