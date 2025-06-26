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
import { LayoutApprovedRequestsReimbursementEditor } from "../Layout";
import { timeout } from "q";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";

@Component({
  selector: 'app-approvedrequestsreimbursement-editor-form',
  templateUrl: './approvedrequestsreimbursement-editor.component.html',
  styleUrls: ['./approvedrequestsreimbursement-editor.component.css']
})

export class ApprovedRequestsReimbursementEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'requestsreimbursement', 'index'];1
  folderName = 'Trinh_Dau_Tu_GQCV';
  folderNameSendMail = 'Trinh_Dau_Tu_GQCV';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedRequestsReimbursementEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();
    this.grid.allowAddNew = false;
    this.grid1.isReadOnly = true;
    this.grid2.isReadOnly = true;
    this.grid3.isReadOnly = true;
    this.grid.allowSorting = true;

    this.dbClickCellContent(this.grid1);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel;
    this.afterViewInit();
    //this.wordWrapGrid();
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any) {
    this.submit(formData, this.indexPage);
  }

  backClick() {
    this._location.back();
  }

  isLoading = false;
  async onClick(state: any) {
    let txt;
    if (state == 0) txt = 'Trả lại';
    else
      if (state == 1) txt = 'Duyệt';
      else
        if (state == 3) txt = 'Đề xuất trả';

    let r = confirm("Xác nhận thao tác: " + txt.toUpperCase());

    if (r == true) {
      this.showLoading = true;
      this.parentData["ApproveStatus"] = state;
      this.parentData["ApproveStatusWeb"] = state;

      this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
        this.sendMail(this.editorFrm, 'HU', this.parentData['IdTask'], false, state).then(() => {
          this.router.navigate(['/main', 'notifications', 'index']);
        });
      });
      // this.backClick();
    }
  }

  showDocumentInNewTab(id: any) {
    //exportHtml(layoutPrint.WordName,layoutPrint.FileName, layoutPrint.FolderPath, parentData?.IdCCMBudget)
    let _command = this._layoutDeclare.layout.PrintDocument.Command;
    let _wordName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].WordName;
    let _folderPath = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].FolderPath;
    let _fileName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].FileName;

    let params = { 'command': _command, 'wordName': _wordName, 'folderPath': _folderPath, 'fileName': _fileName, 'id': id };
    let navigateUrl: any = ['#/main', 'documentview', 'detail', encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)))];
    window.open(navigateUrl.join('/'));
  }
}
