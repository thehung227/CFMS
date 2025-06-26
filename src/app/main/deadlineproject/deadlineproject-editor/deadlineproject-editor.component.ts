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
import { LayoutDeadlineProjectEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { Location } from "../../../../../node_modules/@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { SystemConstants } from "../../../core/common/system.constants";
import { DeadlineProjectPopupEditorComponent } from "../../deadlineproject-popup/deadlineproject-popup-editor/deadlineproject-popup-editor.component";
// import { DeadlineProject1PopupEditorComponent } from "../../deadlineproject1-popup/deadlineproject1-popup-editor/deadlineproject1-popup-editor.component";
// import { DeadlineProject2PopupEditorComponent } from "../../deadlineproject2-popup/deadlineproject2-popup-editor/deadlineproject2-popup-editor.component";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { data } from "jquery";

@Component({
  selector: 'app-deadlineproject-editor-form',
  templateUrl: './deadlineproject-editor.component.html',
  styleUrls: ['./deadlineproject-editor.component.css']
})

export class DeadlineProjectEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
 

  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('popupEditorFrm') popupEditorFrm: DeadlineProjectPopupEditorComponent;
  // @ViewChild('popupEditorFrm1') popupEditorFrm1: DeadlineProject1PopupEditorComponent;
  // @ViewChild('popupEditorFrm2') popupEditorFrm2: DeadlineProject2PopupEditorComponent;
  indexPage = ['/main', 'deadlineproject', 'index'];
  indexPage_Editor = ['/main', 'deadlineproject', 'detail'];
  folderName = 'DeadLine_Du_An';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutDeadlineProjectEditor(service, this.parentData);
  }

  
  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid];
    this.init();
    // this.grid.allowAddNew = false;
  
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();


    this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data['IsTitleRow'] == true) {
            wjcCore.setCss(e.cell, {
              color: '',
              fontWeight: 'bold',
               backgroundColor: '#CCF381'
            });
          }
          else {
            wjcCore.setCss(e.cell, {
              color: '',
              fontWeight: '',
              backgroundColor: ''
            });
          }
        }
      }
    });

   
  }
  onSubmit(formData: any, isApproveSend?: boolean) {
    this.submit(formData, this.indexPage_Editor);
}
  backClick() {
    this._location.back();
  }

  ngOnDestroy() {
    this.destroy();
  }


  
  async showPopup(row: any, form: any) {

    localStorage.removeItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE);
    localStorage.setItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE, row.dataItem['Id']);
    this.popupEditorFrm.setId();
    await this.popupEditorFrm.setupDataSource();
    await this.popupEditorFrm.onInitialComplete();
    form.show(true);
  }

  // async showPopup1(row: any, form: any) {

  //   localStorage.removeItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE);
  //   localStorage.setItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE, row.dataItem['Id']);
  //   console.log(this.popupEditorFrm1)
  //   this.popupEditorFrm1.setId();
  //   await this.popupEditorFrm1.setupDataSource();
  //   await this.popupEditorFrm1.onInitialComplete();
  //   form.show(true);
  // }

  // async showPopup2(row: any, form: any) {

  //   localStorage.removeItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE);
  //   localStorage.setItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE, row.dataItem['Id']);
  //   console.log(this.popupEditorFrm2)
  //   this.popupEditorFrm2.setId();
  //   await this.popupEditorFrm2.setupDataSource();
  //   await this.popupEditorFrm2.onInitialComplete();
  //   form.show(true);
  // }

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
