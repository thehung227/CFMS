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
import { LayoutPermissionCTCEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";

@Component({
    selector: 'app-permissionCTC-editor-form',
    templateUrl: './permissionCTC-editor.component.html',
    styleUrls: ['./permissionCTC-editor.component.css']
})

export class PermissionCTCEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'permissionCTC', 'index'];
  indexPage_Editor = ['/main', 'permissionCTC', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutPermissionCTCEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid];
    this.init().then();
    this.grid.allowSorting = true;
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any) {
    this.submit(formData, this.indexPage_Editor);
  }

  deleteSelectedRows(flex: wjcGrid.FlexGrid) {
    if (flex) {
      var selected = [];

      for (let k in flex.selectedRows) {
        let _idrowdel = flex.selectedRows[k]._idx;
        if (flex.selectedRows[k].dataItem != undefined) {
          for (var i = 0; i < flex.rows.length; i++) {
            if (i == _idrowdel) {
              selected.push(flex.rows[i].dataItem);
              break;
            }
          }
        }
      }

      // delete the selected items
      for (var i = 0; i < selected.length; i++) {
        flex.itemsSource.remove(selected[i]);
      }
    }
  }
}
