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
import { LayoutPurchaseOrderEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";

@Component({
  selector: 'app-purchaseorder-editor-form',
  templateUrl: './purchaseorder-editor.component.html',
  styleUrls: ['./purchaseorder-editor.component.css']
})

export class PurchaseOrderEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'purchaseorder', 'index'];
  indexPage_Editor = ['/main', 'purchaseorder', 'detail'];
  folderName = 'Don_Hang_Mua';
  folderNameSendMail = 'Don_Hang_Mua'

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutPurchaseOrderEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();

    this.grid1.allowAddNew = false;
    this.grid3.isReadOnly = true;
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

  }

  backClick() {
    this._location.back();
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    let _errorSave0: boolean = false;
    for (let i in this.gridArray) {
      if (this.gridArray[i].itemsSource.items.length == 0 && i != '0' && i != '2' && i != '3') {
        _errorSave0 = true;
        break;
      }
    }

    let _errorSave1: boolean = false;
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

    let _errorSave2 = false;
    for (let item of this.grid2.itemsSource.items) {
      if (item['Description'] == '' || item['Description'] == undefined || item['FilePath'] == '' || item['FilePath'] == undefined) {
        _errorSave2 = true;
        break;
      }
    }

    if (isApproveSend == true) {
      if (_errorSave0 == false) {
        if (_errorSave1 == false) {
          if (_errorSave2 == false) {
            this.submit(formData, this.indexPage, isApproveSend).then(() => {
              if (this.allowSendMail) {
                this.sendMail(formData, 'PO', this.id, false, '1');
              }
            });
          }
          else
            alert('Tài liệu đính kèm không được bỏ trống.');
        }
        else
          alert('Không được bỏ trống nhân sự duyệt hồ sơ.');
      }
      else
        alert('Dữ liệu (Chi tiết đơn hàng, Bước duyệt) cần ít nhất 1 dòng để thực hiện.');
    }
    else
      this.submit(formData, this.indexPage_Editor);
  }
}
