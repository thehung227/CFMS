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
import { LayoutEquipListEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinter } from "../equiplist-explorer/equiplist-printer.data";

@Component({
  selector: 'app-equiplist-editor-form',
  templateUrl: './equiplist-editor.component.html',
  styleUrls: ['./equiplist-editor.component.css']
})

export class EquipListEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'equiplist', 'index'];
  indexPage_Editor = ['/main', 'equiplist', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutEquipListEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid];
    this.init();
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
  }

  onSubmit(formData: any) {
    let _errorSave = false;
    // for (let item of this.grid.itemsSource.items) {
    //   if (item['PositionCode'] == '' || item['EmployeeCode'] == '') {
    //     _errorSave = true;
    //     break;
    //   }
    // }



    // for (let item of this.grid3.itemsSource.items) {
    //   if (item['Description'] == '') {
    //     _errorSave = true;
    //     break;
    //   }
    // }

    //this.checkUniqueColGrid(this.grid, 'PositionCode');    
    //if (this._errorUnique == false) {
      if (_errorSave == false) {
        this.submit(formData, this.indexPage_Editor);
      }
      else
        alert('Dữ liệu dòng chi tiết không được bỏ trống giá trị');
    // }
    // else
    //   alert('Trùng dữ liệu: ' + this._valueDuplicate);
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
