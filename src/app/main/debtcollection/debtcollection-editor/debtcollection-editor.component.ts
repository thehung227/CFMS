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
import { LayoutDebtCollectionEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { Location } from "../../../../../node_modules/@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { SystemConstants } from "../../../core/common/system.constants";
import { DebtCollectionPopupEditorComponent } from "../../debtcollection-popup/debtcollection-popup-editor/debtcollection-popup-editor.component";
import { DebtCollection1PopupEditorComponent } from "../../debtcollection1-popup/debtcollection1-popup-editor/debtcollection1-popup-editor.component";
import { DebtCollection2PopupEditorComponent } from "../../debtcollection2-popup/debtcollection2-popup-editor/debtcollection2-popup-editor.component";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { data } from "jquery";

@Component({
  selector: 'app-debtcollection-editor-form',
  templateUrl: './debtcollection-editor.component.html',
  styleUrls: ['./debtcollection-editor.component.css']
})

export class DebtCollectionEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;

  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('popupEditorFrm') popupEditorFrm: DebtCollectionPopupEditorComponent;
  @ViewChild('popupEditorFrm1') popupEditorFrm1: DebtCollection1PopupEditorComponent;
  @ViewChild('popupEditorFrm2') popupEditorFrm2: DebtCollection2PopupEditorComponent;
  indexPage = ['/main', 'debtcollection', 'index'];
  indexPage_Editor = ['/main', 'debtcollection', 'detail'];
  folderName = 'Phieu_Nhap_Kho';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutDebtCollectionEditor(service, this.parentData);
  }

  
  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2];
    this.init();
    this.grid.allowAddNew = false;
    this.grid1.allowAddNew = false;
  
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

    this.grid1.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

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

    this.grid2.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

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


  output: any;
  _errItemSets: boolean = false;
  _errMess: any;

async saveData(formData: any,state: any) {
    this.showLoading = true;
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('Stt');
    param1.ParameterValue = this.editorFrm.controls['Stt'].value.toString();
    params.push(param1);

    try {
      let paramXML = new ParameterContract();
      paramXML.ParameterName = this.convertParameterName('B20DebtDetail');
      paramXML.ParameterValue = 'B20DebtDetail';
      params.push(paramXML);

      let paramXML1 = new ParameterContract();
      paramXML1.ParameterName = this.convertParameterName('B20DebtDetail1');
      paramXML1.ParameterValue = 'B20DebtDetail1';
      params.push(paramXML1);

      let paramXML2 = new ParameterContract();
      paramXML2.ParameterName = this.convertParameterName('B20DebtDetail2');
      paramXML2.ParameterValue = 'B20DebtDetail2';
      params.push(paramXML2);

      let ds = Global.getDataSetContract(
        {
          name: 'B20DebtDetail',
          collection: Global.createColection(this.grid.itemsSource)
        },
        {
          name: 'B20DebtDetail1',
          collection: Global.createColection(this.grid1.itemsSource)
        },
        {
          name: 'B20DebtDetail2',
          collection: Global.createColection(this.grid2.itemsSource)
        }
      )
      
      let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_B20Debt_SendMail', params, ds)
        .toPromise().then();
    
      this.output = <Array<Object>>(_data['output']);
      
      this._errItemSets = this.output['@_Error'];
      this._errMess = this.output['@_ErrorMessage'];
    }
    catch (ex) {
      console.log(ex);
    }

    if (this._errItemSets) {
      alert(this._errMess)
      this.showLoading = true;
    }
    else
    {
      location.reload()
      // console.log(this.parentData['Id'])
      // this.indexPage_Editor.push(this.parentData['Id']);
      // this.router.navigate(['main']).then(() => {
      //   this.router.navigate(this.indexPage_Editor).then(() => {
      //     if (this.indexPage_Editor.length > 3)
      //     this.indexPage_Editor.pop();
      //   })
      // });
    }
  }

  async showPopup(row: any, form: any) {

    localStorage.removeItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE);
    localStorage.setItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE, row.dataItem['Id']);
    this.popupEditorFrm.setId();
    await this.popupEditorFrm.setupDataSource();
    await this.popupEditorFrm.onInitialComplete();
    form.show(true);
  }

  async showPopup1(row: any, form: any) {

    localStorage.removeItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE);
    localStorage.setItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE, row.dataItem['Id']);
    console.log(this.popupEditorFrm1)
    this.popupEditorFrm1.setId();
    await this.popupEditorFrm1.setupDataSource();
    await this.popupEditorFrm1.onInitialComplete();
    form.show(true);
  }

  async showPopup2(row: any, form: any) {

    localStorage.removeItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE);
    localStorage.setItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE, row.dataItem['Id']);
    console.log(this.popupEditorFrm2)
    this.popupEditorFrm2.setId();
    await this.popupEditorFrm2.setupDataSource();
    await this.popupEditorFrm2.onInitialComplete();
    form.show(true);
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
