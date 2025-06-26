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
import { LayoutRegisterEmailEditor } from "../Layout";
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-registeremail-editor-form',
  templateUrl: './registeremail-editor.component.html',
  styleUrls: ['./registeremail-editor.component.css']
})

export class RegisterEmailEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {
  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'registeremail', 'index'];
  indexPage_Editor = ['/main', 'registeremail', 'detail'];
  folderName = 'Dang_Ky_Email';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutRegisterEmailEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();
    this.grid2.isReadOnly = false;
    this.grid3.isReadOnly = true;
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    let _numEror = 0;
    // for (let i in this.gridArray) {
    if ((this.grid.itemsSource.items.length == 0) || (this.grid2.itemsSource.items.length == 0)) {
      _numEror += 1;
    }
    // }

    let _errorSave0 = false;
    for (let item of this.grid.itemsSource.items) {
      if (this.grid.itemsSource.items.length > 0)
        if (item['EmployeeName'] == '' || item['EmployeeName'] == undefined || item['Description'] == '' || item['Description'] == undefined) {
          _errorSave0 = true;
          break;
        }
    }

    let _errorSave = false;
    for (let item of this.grid1.itemsSource.items) {
      if (this.grid1.itemsSource.items.length > 0)
        if (item['FilePath'] == '' || item['FilePath'] == undefined) {
          _errorSave = true;
          break;
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

    let _errorSave2 = false;
    // if (this.grid.itemsSource.items.length > 0)
    //   for (let item of this.grid.itemsSource.items) {
    //     if (item['Description'].toString().indexOf('@') < 0 || item['Description'].toString().indexOf(' ') > 0) {
    //       _errorSave2 = true;
    //       break;
    //     }
    //   }

    if (_numEror == 0) {
      if (_errorSave0 == false) {
        if (_errorSave2 == false) {
          if (isApproveSend == true) {
            if (_errorSave == false) {
              if (_errorSave1 == false) {
                this.submit(formData, this.indexPage, isApproveSend).then(() => {
                  if (this.allowSendMail) {
                    this.sendMail(formData, 'V2', this.id, false, '1');
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
          alert('Địa chỉ email không hợp lệ: sai định dạng, chứa khoảng trắng');
      }
      else
        alert('Họ tên hoặc Email cá nhân, không được bỏ trắng giá trị');
    }
    else
      alert('Các Tab dữ liệu (Danh sách Email, Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu cập nhật đầy đủ thông tin.');
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
