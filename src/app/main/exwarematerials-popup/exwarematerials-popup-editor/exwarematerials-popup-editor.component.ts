import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  ElementRef,
  HostListener,
  Input,
} from "@angular/core";
import { BaseEditorComponent } from "../../_baseform/base-editor.component";
import { WjGridModule } from "wijmo/wijmo.angular2.grid";
import { WjInputModule } from "wijmo/wijmo.angular2.input";

import * as wjcCore from "wijmo/wijmo";
import * as wjcGrid from "wijmo/wijmo.grid";
import * as wjcInput from "wijmo/wijmo.angular2.input";
import { DynamicFormPanelComponent } from "../../../ui/form/dynamic-form-panel.component";
import { BaseEditorService } from "../../../base/base.service-editor";
import { ActivatedRoute, Router } from "@angular/router";
import { PanelControlService } from "../../../ui/panel/PanelControlService";
import { LayoutExWareMaterialsPopupEditor } from "../DeclareLayout";
import { SystemConstants } from "../../../core/common/system.constants";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-exwarematerials-popup-editor-form",
  templateUrl: "./exwarematerials-popup-editor.component.html",
  styleUrls: ["./exwarematerials-popup-editor.component.css"],
})
export class ExWareMaterialsPopupEditorComponent
  extends BaseEditorComponent
  implements OnInit, OnDestroy
{
  @ViewChild("grid") grid: wjcGrid.FlexGrid;
  @ViewChild("dfpanel") _dfpanel: DynamicFormPanelComponent;
  @Input() popup: wjcInput.WjPopup;

  indexPage = ["/main", "exwarematerials", "detail"];
  indexPage_Editor = ["/main", "exwarematerials", "detail"];
  constructor(
    service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router,
    titleService: Title
  ) {
    super(service, route, pcs, elRef, router, titleService);
    this.id = -1;
    this._layoutDeclare = new LayoutExWareMaterialsPopupEditor(
      service,
      this.parentData
    );
  }

  @HostListener("window:resize", [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid];
    this.init();
  }

  setId() {
    this.id = Number(
      localStorage.getItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE)
    );
  }
  ngAfterViewInit() {
    this.dfpanel = this._dfpanel;
    this.afterViewInit();
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any) {
    let _errorSave1: Boolean = false;
    for (let item of this.grid.itemsSource.items) {
      if (
        item["WarehouseDate"] == "" ||
        item["WarehouseDate"] == undefined ||
        item["BizDocId_C1"] == "" ||
        item["Quantity"] == "0"
      ) {
        _errorSave1 = true;
        break;
      }
    }
    if (_errorSave1 == false) {
      this.submitChild(formData).then(() => {
        this.popup.hide();
        localStorage.removeItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE);
        location.reload();
      });
    } else alert("Yêu cầu nhập đầy đủ ô (Ngày thực xuất, số lượng xuất, và Id hợp đồng");
  }

  closePopup() {
    this.popup.hide();
  }
}
