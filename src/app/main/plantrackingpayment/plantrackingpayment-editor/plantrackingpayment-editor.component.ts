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
import { LayoutPlanTrackingPaymentEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { Location } from "../../../../../node_modules/@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { SystemConstants } from "../../../core/common/system.constants";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { data } from "jquery";

@Component({
  selector: 'app-plantrackingpayment-editor-form',
  templateUrl: './plantrackingpayment-editor.component.html',
  styleUrls: ['./plantrackingpayment-editor.component.css']
})

export class PlanTrackingPaymentEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;


  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'plantrackingpayment', 'index'];
  indexPage_Editor = ['/main', 'plantrackingpayment', 'detail'];
  folderName = 'TinhTrangQTDuAn';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutPlanTrackingPaymentEditor(service, this.parentData);
  }

  
  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid,this.grid1,this.grid2,this.grid3];
    this.init();
    this.grid.allowAddNew = true;
  
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
    this.grid.itemsSourceChanged.addHandler(() => {
      this.applyGroupGrid2();
    });

    this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      // GroupRow cũng có _data != undefined nhưng dataItem là CollectionViewGroup, không phải record.
      if (s.rows[e.row] instanceof wjcGrid.GroupRow) return;

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

      // GroupRow cũng có _data != undefined nhưng dataItem là CollectionViewGroup, không phải record.
      if (s.rows[e.row] instanceof wjcGrid.GroupRow) return;

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
    this.commitPendingGridEdits();
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

applyGroupGrid2() {
      var cv = this.grid.collectionView;
      if (cv != null) {
        cv.beginUpdate();
        cv.groupDescriptions.clear();
        var groupDesc = new wjcCore.PropertyGroupDescription("ProductName0");
        cv.groupDescriptions.push(groupDesc);
        cv.endUpdate();
      }
      this.grid.groupHeaderFormat = "<b>{value}</b>";
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
