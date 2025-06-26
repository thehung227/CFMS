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
import { LayoutApprovedPurchaseOtherBudgetEditor } from "../Layout";
import { Global } from "../../../shared/global";

@Component({
  selector: 'app-approvedpurchaseotherbudget-editor-form',
  templateUrl: './approvedpurchaseotherbudget-editor.component.html',
  styleUrls: ['./approvedpurchaseotherbudget-editor.component.css']
})

export class ApprovedPurchaseOtherBudgetEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'purchaseotherbudget', 'index'];
  folderName = 'Ke_Hoach_Mua_Hang';
  folderNameSendMail = 'Ke_Hoach_Mua_Hang';
  
  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedPurchaseOtherBudgetEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();
    this.grid.isReadOnly = true;
    this.grid1.isReadOnly = true;
    this.grid.allowSorting = true;

    this.dbClickCellContent(this.grid1);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data['IsTitleRow'] == true) {
            wjcCore.setCss(e.cell, {
              color: 'blue',
                fontWeight: 'bold',
            });
          }
          else
          {
          if (data['IsLink'] == false) {
            wjcCore.setCss(e.cell, {
              color: 'red'
            });
          }
          else {
            wjcCore.setCss(e.cell, {
              color: '',
              // fontWeight: '',
              // backgroundColor: ''
            });
          }
        }
      }
    }
    });
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
    if (Global.convertConfig('{VAR=User.Ma_CbNv}') != this.parentData['EmployeeCode'])
    alert("User đăng nhập không đúng với người duyệt!!!");
  else {
    this.showLoading = true;
    this.parentData["ApproveStatus"] = state;
    this.parentData["ApproveStatusWeb"] = state;

    this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
      this.sendMail(this.editorFrm, 'H7', this.parentData['IdBudget'], false, state).then(() => {
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
}
