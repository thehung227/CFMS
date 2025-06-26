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
import { LayoutApprovedBillPayTeamEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { Global } from "../../../shared/global";

@Component({
  selector: 'app-approvedbillpayteam-editor-form',
  templateUrl: './approvedbillpayteam-editor.component.html',
  styleUrls: ['./approvedbillpayteam-editor.component.css']
})

export class ApprovedBillPayTeamEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'billpayteam', 'index'];
  folderName = '05.Thanh_Toan_Doi_Nhom';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedBillPayTeamEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2];
    this.init();
    this.grid.isReadOnly = true;
    this.grid.allowAddNew = false;
    this.grid1.allowAddNew = false;
    this.grid2.isReadOnly = true;

    this.dbClickCellContent(this.grid);
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

  isLoading = false;
  async onClick(state: any, callPrint: boolean = false) {
    if (Global.convertConfig('{VAR=User.Ma_CbNv}') != this.parentData['EmployeeCode'])
      alert("User đăng nhập không đúng với người duyệt!!!");
    else {
      this.isLoading = true;
      this.parentData["ApproveStatus"] = state;
      this.parentData["ApproveStatusWeb"] = state;
      this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
        this.sendMail(this.editorFrm, 'P2', this.parentData['IdBizDocCCM'], false, state).then(() => {
          if (callPrint)
            this.exportHtml_WorkFlow('WorkFlow_TT.docx', 'WorkFlow TP.NCC - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=Amount_DeNghiTT_Str}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', this.parentData['IdBizDocCCM'], 'P2', 'DocCode').then(() => { this.router.navigate(['/main', 'notifications', 'index']); });
          else
            this.router.navigate(['/main', 'notifications', 'index']);
        });
      });
      //this.backClick();
    }
  }
  showDocumentInNewTab(id: any) {
    //exportHtml(layoutPrint.WordName,layoutPrint.FileName, layoutPrint.FolderPath, parentData?.Id_TT)
    let _command = this._layoutDeclare.layout.PrintDocument.Command;
    let _wordName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].WordName;
    let _folderPath = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].FolderPath;
    let _fileName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].FileName;

    let params = { 'command': _command, 'wordName': _wordName, 'folderPath': _folderPath, 'fileName': _fileName, 'id': id };
    let navigateUrl: any = ['#/main', 'documentview', 'detail', encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)))];
    window.open(navigateUrl.join('/'));
  }
}
