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
import { LayoutUnitCcmPriceEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinter } from "../unitccmprice-explorer/unitccmprice-printer.data";

@Component({
    selector: 'app-unitccmprice-editor-form',
    templateUrl: './unitccmprice-editor.component.html',
    styleUrls: ['./unitccmprice-editor.component.css']
})

export class UnitCcmPriceEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;

  // @ViewChild('flex', { static: true }) grid: wjcGrid.FlexGrid;

  freezeRows() {
      this.grid.frozenRows = this.grid.frozenRows > 0 ? 0 : 2;
  }


  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  
  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  layoutPrint: LayoutPrinter = new LayoutPrinter();

  indexPage = ['/main', 'unitccmprice', 'index'];
  indexPage_Editor = ['/main', 'unitccmprice', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutUnitCcmPriceEditor(service, this.parentData);
    this._layoutPrinter = this.layoutPrint.Layout;
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
    for (let item of this.grid.itemsSource.items) {
      if ((item['ItemName']=='' || item['UnitHD']=='' || item['Rate1']=='0' || item['Rate2'] =='0' || item['CodeMEXD'] == '' || item['PriceType'] == '') && item['IsTitleRow'] == false && item['ItemCode'] != '') {
        _errorSave = true;
        break;
      }
    }

    let _errorSave1 = false;
    for (let item of this.grid.itemsSource.items) {
      if ((item['UnitCostVT'] + item['UnitCostNC'] + item['ChartUnitCost'] + item['DiscountUnitCost']  != item['OriginalUnitCost'])  && item['IsTitleRow'] == false && item['ItemCode'] != '') {
        _errorSave1 = true;
        break;
      }
    }

    if (_errorSave == false) {
      if (_errorSave1 == false) {
        this.submit(formData, this.indexPage_Editor);
      }
      else
      alert('Tổng giá HĐ VT + NC + Trọn gói + Giá loại trừ = Đơn giá HĐ !!!');
    }
    else
    alert('Yêu cầu điền đầy đủ các mục (*) ở tab Thư viện giá !!!');
    // this.submit(formData, this.indexPage_Editor).then(()=>{
    //   location.reload(false);
    // });
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
