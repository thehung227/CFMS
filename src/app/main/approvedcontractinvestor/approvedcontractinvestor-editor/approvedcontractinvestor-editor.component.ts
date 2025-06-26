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
import { LayoutApprovedContractInvestorEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { AutoSizeMode } from "wijmo/wijmo.grid";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { Global } from "../../../shared/global";

@Component({
  selector: 'app-approvedcontractinvestor-editor-form',
  templateUrl: './approvedcontractinvestor-editor.component.html',
  styleUrls: ['./approvedcontractinvestor-editor.component.css']
})

export class ApprovedContractInvestorEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'regcontractinvestor', 'index'];
  folderName = 'Hop_Dong_Phu_Luc';
  folderNameSendMail = 'Hop_Dong_Phu_Luc';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router,
    titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedContractInvestorEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4];
    this.init();
    this.grid.isReadOnly = true;
    this.grid1.isReadOnly = true;
    // this.grid2.isReadOnly = true;
    this.grid.allowAddNew = false;
    this.grid1.allowAddNew = false;
    this.grid2.allowAddNew = false;
    this.grid3.isReadOnly = true;
    this.grid4.isReadOnly = true;

    this.dbClickCellContent(this.grid);
    this.doubleClickGrid(this.grid2);
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
      // await this.dfpanel.runConstraint('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
      //   setTimeout(() => {
      //     window.close();
      //   }, 1000);
      // });
      this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
        this.sendMail(this.editorFrm, 'C2', this.parentData['IdBizDoc'], false, state).then(() => {
          this.router.navigate(['/main', 'notifications', 'index']);
        });
      });
      // this.backClick();
    }
  }

  async doubleClickGrid(grid: wjcGrid.FlexGrid) {
    grid.addEventListener(grid.hostElement, 'dblclick', (e) => {
      if (grid.selectedItems[0]) {
        // let key = grid.selectedItems[0]['Id'];
        // let fileName = grid.selectedItems[0]['FilePath'] + '.pdf';
        let _description = grid.selectedItems[0]['Description'];

        // let folder = "{EXPR=ProductCostId}\\" + this.folderName;

        // folder = Global.translateAutoText(folder, this.parentData);
        if (_description)
          window.open(_description);

      }
    }
    );
  }

  showDocumentInNewTab(id: any) {
    //exportHtml(layoutPrint.WordName,layoutPrint.FileName, layoutPrint.FolderPath, parentData?.Id_PLA)
    let _command = this._layoutDeclare.layout.PrintDocument.Command;
    let _wordName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].WordName;
    let _folderPath = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].FolderPath;
    let _fileName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].FileName;

    let params = { 'command': _command, 'wordName': _wordName, 'folderPath': _folderPath, 'fileName': _fileName, 'id': id };
    let navigateUrl: any = ['#/main', 'documentview', 'detail', encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)))];
    window.open(navigateUrl.join('/'));
  }
}
