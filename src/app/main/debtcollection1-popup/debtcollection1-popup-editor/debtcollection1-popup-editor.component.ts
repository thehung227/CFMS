import { Component, ViewChild, OnInit, OnDestroy, ElementRef, HostListener, Input } from "@angular/core";
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
import { LayoutDebtCollection1PopupEditor } from "../DeclareLayout";
import { SystemConstants } from "../../../core/common/system.constants";
import { Title } from "@angular/platform-browser";

@Component({
    selector: 'app-debtcollection1-popup-editor-form',
    templateUrl: './debtcollection1-popup-editor.component.html',
    styleUrls: ['./debtcollection1-popup-editor.component.css']
})

export class DebtCollection1PopupEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @Input() popup: wjcInput.WjPopup;

  indexPage = ['/main', 'debtcollection', 'detail'];
  indexPage_Editor = ['/main', 'debtcollection', 'detail'];
  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService);
    this.id = -1;
    this._layoutDeclare = new LayoutDebtCollection1PopupEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid];
    this.init();
  }

  setId()
  {
    console.log(localStorage.getItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE))
    this.id = Number(localStorage.getItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE));    
  }
  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any) {
    this.submitChild(formData).then(() => {
      this.popup.hide();
      localStorage.removeItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE);
      location.reload();
    });


  }

  closePopup()
  {
    this.popup.hide();
  }
}
