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
import { LayoutApprovedPurchasingNoteEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { Global } from "../../../shared/global";

@Component({
    selector: 'app-approvedpurchasingnote-editor-form',
    templateUrl: './approvedpurchasingnote-editor.component.html',
    styleUrls: ['./approvedpurchasingnote-editor.component.css']
})

export class ApprovedPurchasingNoteEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'settlement', 'index'];
  folderName = '10.Phieu_Nhap_Hang';
  
  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedPurchasingNoteEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2];
    this.init();
    this.grid.allowAddNew = false;
    this.grid1.isReadOnly = true;
    this.grid1.allowAddNew = false;
    this.grid2.isReadOnly = true;
    this.grid2.allowAddNew = false;
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    // this.wordWrapGrid();
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any) {
    this.submit(formData, this.indexPage);
  }

  backClick(){
    this._location.back();
  }

  isLoading = false;
  async onClick(state:any) {
    if (Global.convertConfig('{VAR=User.Ma_CbNv}') != this.parentData['EmployeeCode'])
    alert("User đăng nhập không đúng với người duyệt!!!");
  else {
    this.isLoading = true;
    this.parentData["ApproveStatus"] = state;
    this.parentData["ApproveStatusWeb"] = state;

    this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
      this.getInfoTemplateMail(this.editorFrm, this.parentData['IdAccDoc']).then(() => { this.backClick() });
      // this.sendMail(this.editorFrm, 'NH', this.parentData['IdAccDoc'], false);
      // this.router.navigate(this.indexPage);
      // this.backClick();
    });
  }
}
}
