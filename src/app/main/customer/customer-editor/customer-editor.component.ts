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
import { LayoutCustomerEditor } from "../Layout";
import { Title } from "@angular/platform-browser";


@Component({
  selector: 'app-customer-editor-form',
  templateUrl: './customer-editor.component.html',
  styleUrls: ['./customer-editor.component.css']
})

export class CustomerEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('grid5') grid5: wjcGrid.FlexGrid;
  @ViewChild('grid6') grid6: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'customer', 'index'];
  indexPage_Editor = ['/main', 'customer', 'detail'];
  folderName = 'Doi_Tuong';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutCustomerEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4, this.grid5, this.grid6];
    this.init().then(() => {
      if (this.parentData['ApproveSend'] == true)
        this.grid.isReadOnly = true;
    });

    this.grid2.allowAddNew = false;
    this.grid3.isReadOnly = true;
    this.grid5.isReadOnly = true;

    this.dbClickCellContent(this.grid3);
    this.doubleClickGrid(this.grid5);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    let _numEror = 0;
    // for (let i in this.gridArray) {
    // if (this.gridArray[1].itemsSource.items != undefined)
    //   if (this.gridArray[1].itemsSource.items.length == 0) {
    //     _numEror += 1;
    //     // break;
    //   }
    // }    

    // if (this.gridArray[2].itemsSource.items != undefined)
    //   if (this.gridArray[2].itemsSource.items.length == 0) {
    //     _numEror += 1;
    //   }

    let _errorSave3 = false;
    // for (let item of this.grid.itemsSource.items) {
    //   if (item["BankAccountNo"].toString().indexOf(' ') > 0)
    //     _errorSave3 = true;
    //   break;
    // }

    // let _errorSave = false;
    // for (let item of this.grid.itemsSource.items) {
    //   if (item['BankAccountNo'] == '' || item['Description'] == '' || item['Province'] == '') {
    //     _errorSave = true;
    //     break;
    //   }
    // }

    let _errorSave = false;
    // for (let item of this.grid1.itemsSource.items) {
    //   if (item['Attached'] == true && item['Description'] != 'Theo mẫu công ty ban hành' && !(item['FilePath'])) {
    //     _errorSave = true;
    //     break;
    //   }
    // }

    let _errorSave1 = false;
    // for (let item of this.grid2.itemsSource.items) {
    //   if (item['EmployeeCode'] == '') {
    //     _errorSave1 = true;
    //     break;
    //   }
    //   else
    //     if (item['EmployeeCode'].toString().indexOf(',') > 0 && item['EmployeeCodeReal'] == '') {
    //       _errorSave1 = true;
    //       break;
    //     }
    // }

    let _errorSave2 = false;
    // for (let item of this.grid1.itemsSource.items) {
    //   if (item['JobCode'] == '' || item['JobCode'] == undefined || item['JobName'] == '') {
    //     _errorSave2 = true;
    //     break;
    //   }
    // }

    if (_numEror == 0) {
      if (_errorSave3 == false) {
        if (isApproveSend == true) {
          if (_errorSave == false) {
            if (_errorSave2 == false) {
              if (_errorSave1 == false) {
                this.submit(formData, this.indexPage, isApproveSend).then(() => {
                  if (this.allowSendMail) {
                    this.sendMail(formData, 'CUS', this.id, false, '1');
                  }
                });
              }
              else
                alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
            }
            else
              alert('Thông tin Tab (Công việc) không được bỏ trắng');
          }
          else
            alert('Yêu cầu đính kèm tài liệu trước khi gửi duyệt!');
        }
        else
          this.submit(formData, this.indexPage_Editor);
      }
      else
        alert('Số Tài khoản ngân hàng không được chứa khoảng trắng');
    }
    else
      alert('Các Tab dữ liệu (Công việc, Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu điền đầy đủ thông tin hoặc Tải dữ liệu.');
  }

  showPrintVoucher(input: any) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher(input);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  doubleClickGrid(grid: wjcGrid.FlexGrid) {
    let navigateUrl: any[] = [];
    let host = grid.hostElement;
    let self = this;

    host.addEventListener('dblclick', function (e) {
      if (grid.selectedItems[0] != null && grid.selectedItems[0] != undefined) {
        let key = grid.selectedItems[0]['Id'];
        let link = grid.selectedItems[0]['_LinkCommandWeb'];

        if (key) {
          navigateUrl.push(link);
          navigateUrl.push(key);

          window.open(navigateUrl.join('/'));   //phải có #

          // self.router.navigate(navigateUrl); //không có #

          navigateUrl = [];
        }
      }
    });
  }

  ngOnDestroy() {
    this.destroy();
  }
}
