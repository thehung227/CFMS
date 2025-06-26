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
import { LayoutProjectListEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinter } from "../projectlist-explorer/projectlist-printer.data";

@Component({
  selector: 'app-projectlist-editor-form',
  templateUrl: './projectlist-editor.component.html',
  styleUrls: ['./projectlist-editor.component.css']
})

export class ProjectListEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'projectlist', 'index'];
  indexPage_Editor = ['/main', 'projectlist', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutProjectListEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
  }

  onSubmit(formData: any) {
    let _errorSave = false;
    for (let item of this.grid.itemsSource.items) {
      if (item['PositionCode'] == '' || item['EmployeeCode'] == '') {
        _errorSave = true;
        break;
      }
    }

    for (let item of this.grid1.itemsSource.items) {
      if (item['TradeMarkCode'] == '' || item['TradeMarkCode'] == undefined || item['ItemGroupCode'] == '') {
        _errorSave = true;
        break;
      }
    }

    for (let item of this.grid2.itemsSource.items) {
      if (item['ItemCode'] == '') {
        _errorSave = true;
        break;
      }
    }

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
