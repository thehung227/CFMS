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
import { LayoutDocumentaryEditor } from "../Layout";
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-documentary-editor-form',
  templateUrl: './documentary-editor.component.html',
  styleUrls: ['./documentary-editor.component.css']
})

export class DocumentaryEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {
  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'documentary', 'index'];
  indexPage_Editor = ['/main', 'documentary', 'detail'];
  folderName = 'Van_Ban_Noi_Bo';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutDocumentaryEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2];
    this.init();
    this.grid1.isReadOnly = false;
    this.grid2.isReadOnly = true;

    this.dbClickCellContent(this.grid2);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    let _numEror = 0;
    // for (let i in this.gridArray) {
    if ((this.gridArray[0].itemsSource.items.length == 0) || (this.gridArray[1].itemsSource.items.length == 0)) {
      _numEror += 1;
    }
    // }

    let _errorSave = false;
    for (let item of this.grid.itemsSource.items) {
      if (item['FilePath'] == '' || item['FilePath'] == undefined) {
        _errorSave = true;
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

    if (_numEror == 0) {
      if (isApproveSend == true) {
        if (_errorSave == false) {
          if (_errorSave1 == false) {
            this.submit(formData, this.indexPage, isApproveSend).then(() => {
              if (this.allowSendMail) {
                this.sendMail(formData, 'V4', this.id, false, '1');
              }
            });
          }
          else
            alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
        }
        else
          alert('Yêu cầu đính kèm tài liệu trước khi gửi duyệt!');
      }
      else
        this.submit(formData, this.indexPage_Editor);
    }
    else
      alert('Các Tab dữ liệu (Tài liệu đính kèm, Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu cập nhật đầy đủ thông tin.');
  }

  showPrintVoucher(input: any) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher(input);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  ngOnDestroy() {
    this.destroy();
  }
}
