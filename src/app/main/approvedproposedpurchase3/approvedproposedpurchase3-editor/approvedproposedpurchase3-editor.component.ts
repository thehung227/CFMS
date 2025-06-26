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
import { LayoutApprovedProposedPurchase3Editor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { Global } from "../../../shared/global";
import { CollectionView } from "wijmo/wijmo";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { Location } from "../../../../../node_modules/@angular/common";

@Component({
  selector: 'app-approvedproposedpurchase3-editor-form',
  templateUrl: './approvedproposedpurchase3-editor.component.html',
  styleUrls: ['./approvedproposedpurchase3-editor.component.css']
})

export class ApprovedProposedPurchase3EditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('searchItemText') searchItemText: string;

  indexPage = ['/main', 'approvedproposedpurchase3', 'index'];
  indexPage_Editor = ['/main', 'approvedproposedpurchase3', 'detail'];
  folderName = '09.De_Nghi_Mua_Hang';
  folderNameSendMail = '09.De_Nghi_Mua_Hang';

  viewDetail: Array<Object>;
  htmlShow: any;
  idBizDoc: any;

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedProposedPurchase3Editor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid];
    this.init();
    this.grid.isReadOnly = true;
    this.grid.allowAddNew = false;
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel;
    this.afterViewInit();
    this.showPrintVoucher(this.id);
  }

  backClick(){
    this._location.back();
  }

  ngOnDestroy() {
    this.destroy();
  }

  updatedView(s: wjcGrid.FlexGrid, e: wjcCore.EventArgs) {
    s.autoSizeRows();
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    let _numEror = 0;
    if (this.gridArray[0].itemsSource.items.length == 0) {
      _numEror += 1;
    }

    let _errorSave = false;
    for (let item of this.grid.itemsSource.items) {
      if (item['Quantity9'] < 0 || item['ItemCode'] == '') {
        _errorSave = true;
        break;
      }
    }

    if (_errorSave == false) {
      if (isApproveSend == true) {
        //this.editorFrm.controls['DocStatus'].setValue(2);
        this.submit(formData, this.indexPage, isApproveSend);
      }
      else
        this.submit(formData, this.indexPage_Editor);
    }
    else
      alert('Dữ liệu đề nghị mua không hợp lệ');
  }

  async showPopup(row: any, form: any) {

    this.viewDetail = row;

    form.show(true);

  }

  isLoading = false;
  async onClick_Approve(formData: any, state: any) {
    this.isLoading = true;
    this.parentData["ApproveStatus"] = state;
    this.parentData["ApproveStatusWeb"] = state;

    this.dfpanel.runConstraint('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
      this.getInfoTemplateMail(formData, this.idBizDoc).then(() => {
        // this.router.navigate(this.indexPage);
        this.backClick();
      });
    });
  }

  showAttach(folder: string, fileName: string) {

    var x = document.getElementById("viewfileattach");
    var y = document.getElementById("fileView");
    folder = Global.translateAutoText(folder, this.parentData);
    fileName = Global.translateAutoText(fileName, this.parentData);

    if (folder && fileName) {
      let p = this._service.dowload(folder, this.idBizDoc.toString(), fileName).toPromise();
      p.then(blob => {
        if (fileName.toUpperCase().endsWith('PDF') == true || fileName.toUpperCase().endsWith('JPG') == true || fileName.toUpperCase().endsWith('PNG') == true || fileName.toUpperCase().endsWith('JPEG') == true || fileName.toUpperCase().endsWith('GIF') == true) {
          let url = window.URL.createObjectURL(blob);
          y.setAttribute('data', url);
          if (x.style.display == 'none') {
            x.style.display = "block";
          }
          else {
            x.style.display = "none";
          }
        }
      });

    }
  }

  async showPrintVoucher(input: any) {
    let layoutPrint = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0];

    let _data = await this._service.fetchDataChild(Global.DataExplorerEndpoint, 'vB30BizDocApprove_Edit', "Id = " + input).toPromise().then();

    this.idBizDoc = _data[0]['IdBizDoc'];

    let html = this.showHtmlEditor(layoutPrint['WordName'], layoutPrint['FileName'], layoutPrint['FolderPath'], _data[0]['IdBizDoc']);
    html.then(data => {
      this.htmlShow = data;
      document.getElementById('htmlShow').innerHTML = data;
      this.showDialog = false;
    });
  }

  cancelVoucherClickAndMail(state: any) {
    this.parentData["ApproveStatus"] = state;
    this.parentData["ApproveStatusWeb"] = state;

    this.cancelVoucherClick(this.idBizDoc).then(() => {
      this.getInfoTemplateMail(this.editorFrm, this.idBizDoc, 'x');
    });
  }

}
