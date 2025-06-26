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
import { LayoutBillPayBuildingEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinter } from "../billpaybuilding-explorer/billpaybuilding-printer.data";
import { LayoutPrinterWordFlow } from "../../_printerlayout/workflow/workflowTT-printer.data";
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'app-billpaybuilding-editor-form',
  templateUrl: './billpaybuilding-editor.component.html',
  styleUrls: ['./billpaybuilding-editor.component.css']
})

export class BillPayBuildingEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {
  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  layoutPrint: LayoutPrinter = new LayoutPrinter();
  layoutPrintWordFlow: LayoutPrinterWordFlow = new LayoutPrinterWordFlow();
  indexPage = ['/main', 'billpaybuilding', 'index'];
  folderName = 'Thanh_Toan_TP_NCC';
  indexPage_Editor = ['/main', 'billpaybuilding', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutBillPayBuildingEditor(service, this.parentData);
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
    for (let i in this.gridArray) {
      if (this.gridArray[i].itemsSource.items.length == 0 && i != '0' && i != '3' && i != '4') {
        _numEror += 1;
        break;
      }
    }

    let _errorSave1 = false;
    let _errorSave2 = false;
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
    if(formData instanceof FormGroup) {
      if (formData.get('ClassCode1').value != 'CD01' && (formData.get('Date_Liquidation').value == '' || formData.get('Date_Liquidation').value == null || formData.get('Date_Liquidation').value == undefined)) {
        _errorSave2 = true;
      }
    }

    this.checkUniqueColGrid(this.grid, 'ItemNo');
    if (_errorSave2 == false) {
    if (this._errorUnique == false) {
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
              }
              else
                alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
            }
          }
          else
            this.submit(formData, this.indexPage_Editor);
        }
        else {
          alert('Các Tab dữ liệu (Tài liệu đính kèm, Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có) hoặc điền đầy đủ thông tin.');
        }
      }
      else
        alert('Dữ liệu STT bước duyệt đang bị trùng, giá trị trùng: ' + this._valueDuplicate);
    }
    else
      alert('Dữ liệu STT đang bị trùng, giá trị trùng: ' + this._valueDuplicate);
  }
  else 
  alert('Yêu cầu nhập Ngày tính hạn thanh toán');
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
    if (this.parentData["CompletedApprove"] == false) {
      alert('Hồ sơ chưa hoàn thiện duyệt, không thể in ấn workflow');
      return;
    }
    else
      this.exportHtml_WorkFlow('WorkFlow_TT.docx', 'WorkFlow TP.NCC - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }

  deleteSelectedRows(flex: wjcGrid.FlexGrid) {
    this.dfpanel.runConstraint('Evaluator_ServerConstraint_Check_ApproveSent_NotChange').then();
    if (flex) {
      var selected = [];
      for (let k in flex.selectedRows) {
        let _idrowdel = flex.selectedRows[k]._idx;

        if (flex.selectedRows[k].dataItem != undefined) {
          let _id = flex.selectedRows[k].dataItem['Id'];
          let _ktrow = flex.selectedRows[k].dataItem['NoChangeInBill'];

          for (var i = 0; i < flex.rows.length; i++) {
            if (i == _idrowdel && (_ktrow == false || _ktrow == null || _ktrow == undefined)) {//(_id < 0 || _id == null || _id == undefined) && 
              selected.push(flex.rows[i].dataItem);
              break;
            }
          }
        }
      }

      for (var i = 0; i < selected.length; i++) {
        flex.itemsSource.remove(selected[i]);
      }
    }
  }
}
