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
import { timeout } from "q";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { LayoutApprovedDocAfterSalesSurvayEditor } from "../Layout";
import { Global } from "../../../shared/global";

@Component({
  selector: 'app-approveddocaftersalessurvay-editor-form',
  templateUrl: './approveddocaftersalessurvay-editor.component.html',
  styleUrls: ['./approveddocaftersalessurvay-editor.component.css']
})

export class ApprovedDocAfterSalesSurvayEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'docaftersalessurvay', 'index'];
  folderName = 'Yeu_Cau_Bao_Hanh';
  folderNameSendMail = 'Yeu_Cau_Bao_Hanh';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedDocAfterSalesSurvayEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();
    this.grid.allowAddNew = false;
    this.grid1.allowAddNew = false;
    this.grid2.isReadOnly = true;
    this.grid3.isReadOnly = true;

    this.dbClickCellContent(this.grid3);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

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

  openWindow(_id: any) {
    let navigateUrl = [];
    navigateUrl.push('#/main/docaftersalesfile/detail');
    navigateUrl.push(_id);
    window.open(navigateUrl.join('/'));
  }

  isLoading = false;
  async onClick(state: any) {
    if (Global.convertConfig('{VAR=User.Ma_CbNv}') != this.parentData['EmployeeCode'])
    alert("User đăng nhập không đúng với người duyệt!!!");
  else {
    this.showLoading = true;
    this.parentData["ApproveStatus"] = state;
    this.parentData["ApproveStatusWeb"] = state;

    this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
      this.sendMail(this.editorFrm, 'V7', this.parentData['IdBizDocVB'], false, state).then(() => {
        this.router.navigate(['/main', 'notifications', 'index']);
      });
    });
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

  async showPrintInNewTab(id: any) {
    this.exportHtml_WorkFlow('Phieu_Yeu_Cau_Bao_Hanh.docx', 'Yêu cầu bảo hành - {VAR=TenGoiThau} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', id, '', '');
  }
}
