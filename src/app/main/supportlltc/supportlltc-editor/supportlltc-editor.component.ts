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
import { LayoutSupportLLTCEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';

@Component({
  selector: 'app-supportlltc-editor-form',
  templateUrl: './supportlltc-editor.component.html',
  styleUrls: ['./supportlltc-editor.component.css']
})

export class SupportLLTCEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;

  indexPage = ['/main', 'supportlltc', 'index'];
  folderName = 'Theo_Doi_Ho_Tro_LLTC';
  indexPage_Editor = ['/main', 'supportlltc', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutSupportLLTCEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4];
    this.init();
    //this.grid1.isReadOnly = true;
    this.grid1.allowAddNew = false;
    this.grid2.isReadOnly = true;
    this.grid3.isReadOnly = true;

    this.dbClickCellContent(this.grid2);
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
      if (this.gridArray[i].itemsSource.items.length == 0 && (i == '0' || i == '1')) {
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

    if (isApproveSend == true) {
    if (_numEror == 0) {
      
        if (_errorSave1 == false) {
          this.submit(formData, this.indexPage, isApproveSend).then(() => {
            if (this.allowSendMail) {
              this.sendMail(formData, 'H3', this.id, false, '1');
            }
          });
        }
        else
          alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
     
    }
    else
      alert('Các Tab dữ liệu (Chi tiết, Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có) hoặc điền đầy đủ thông tin.');
    }
    else
      this.submit(formData, this.indexPage_Editor);
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
    if (this.parentData["CompletedApprove"] == false) {
      alert('Hồ sơ chưa hoàn thiện duyệt, không thể in ấn workflow');
      return;
    }
    else
      this.exportHtml_WorkFlow('WorkFlow_KHKK.docx', 'WorkFlow KHKK - {VAR=ProductName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }
}
