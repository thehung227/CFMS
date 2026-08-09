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
import { LayoutApprovedPlanSetlementEditor } from "../DeclareLayout";
import { timeout } from "q";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { Global } from "../../../shared/global";

@Component({
  selector: 'app-approvedplansetlement-editor-form',
  templateUrl: './approvedplansetlement-editor.component.html',
  styleUrls: ['./approvedplansetlement-editor.component.css']
})

export class ApprovedPlanSetlementEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
    @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
    @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
    @ViewChild('grid5') grid5: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'plansetlement', 'index'];
   folderName = 'Ke_Hoach_Quyet_Toan_NTP_NCC';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedPlanSetlementEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4, this.grid5];
    this.init();
    this.grid.isReadOnly = true;
    this.grid1.isReadOnly = true;
    this.grid2.isReadOnly = true;
    this.grid.allowSorting = true;

    this.dbClickCellContent(this.grid1);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
// Apply group by 'Gói thầu' for subtotals on grid2
    this.grid.itemsSourceChanged.addHandler(() => {
      this.applyGroupGrid2();
    });

  this.grid4.itemsSourceChanged.addHandler(() => {
      this.applyGroupGrid4();
    });

    this.grid5.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data['Remark'] == 'GrandTotal') {
            wjcCore.setCss(e.cell, {
              backgroundColor: '#d5a074',
              fontWeight: 'bold'
            });
          }
          else
            if (data['Remark'] == 'Total') {
            wjcCore.setCss(e.cell, {
              backgroundColor: '#faefe7',
              fontWeight: 'bold'
            });
          }
          else {
            wjcCore.setCss(e.cell, {

              fontWeight: '',
              backgroundColor: ''
            });
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
      this.isLoading = true;
      this.parentData["ApproveStatus"] = state;
      this.parentData["ApproveStatusWeb"] = state;
      // await this.dfpanel.runConstraint('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(()=>{
      //   setTimeout(() => {
      //     window.close();
      //   }, 1000);
      // });

      this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
        this.sendMail(this.editorFrm, 'S2', this.parentData['IdCCMBudget'], false, state).then(() => {
          this.router.navigate(['/main', 'notifications', 'index']);
        });
      });
      // this.backClick();
    }
  }

applyGroupGrid2() {
      var cv = this.grid.collectionView;
      if (cv != null) {
        cv.beginUpdate();
        cv.groupDescriptions.clear();
        var groupDesc = new wjcCore.PropertyGroupDescription("JobName");
        cv.groupDescriptions.push(groupDesc);
        cv.endUpdate();
      }
      this.grid.groupHeaderFormat = "<b>{value}</b>";
    }

applyGroupGrid4() {
      var cv = this.grid4.collectionView;
      if (cv != null) {
        cv.beginUpdate();
        cv.groupDescriptions.clear();
        var groupDesc = new wjcCore.PropertyGroupDescription("JobName");
        cv.groupDescriptions.push(groupDesc);
        cv.endUpdate();
      }
      this.grid4.groupHeaderFormat = "<b>{value}</b>";
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
