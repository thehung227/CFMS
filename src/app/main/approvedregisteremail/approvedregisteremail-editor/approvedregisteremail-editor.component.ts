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
import { LayoutApprovedRegisterEmailEditor } from "../Layout";
import { Global } from "../../../shared/global";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-approvedregisteremail-editor-form',
  templateUrl: './approvedregisteremail-editor.component.html',
  styleUrls: ['./approvedregisteremail-editor.component.css']
})

export class ApprovedRegisterEmailEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'consdocument', 'index'];
  folderName = 'Dang_Ky_Email';
  folderNameSendMail = 'Dang_Ky_Email';

  output: Array<Object>;
  _err: boolean = false;
  _errMess: string;

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedRegisterEmailEditor(service, this.parentData);
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

    this.dbClickCellContent(this.grid1);
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
    navigateUrl.push('#/main/consdocumentfile/detail');
    navigateUrl.push(_id);
    window.open(navigateUrl.join('/'));
  }

  isLoading = false;
  async onClick(state: any, formData?: any) {
    if (Global.convertConfig('{VAR=User.Ma_CbNv}') == this.parentData['EmployeeCode'] || 1==1) {
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
        if (state == 1 || state == 3)
          this.updateB30BizDocVBDetail(formData).then(() => {
            if (this._err == false) {
              this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
                this.sendMail(this.editorFrm, 'V2', this.parentData['IdBizDocVB'], false, state).then(() => {
                  this.router.navigate(['/main', 'notifications', 'index']);
                });
              });
            }
            else
              alert(this._errMess);
          });
        else
          this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
            this.sendMail(this.editorFrm, 'V2', this.parentData['IdBizDocVB'], false, state).then(() => {
              this.router.navigate(['/main', 'notifications', 'index']);
            });
          });
      }
    }
    else
      alert('Người sử dụng hiện thời không có quyền thực hiện chức năng này');
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

  async updateB30BizDocVBDetail(formData: any) {
    if (this.editorFrm.valid)
      this.showLoading = true;

    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();
    const param4 = new ParameterContract();
    const param5 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = formData.value['IdBizDocVB'];
    params.push(param1);

    param2.ParameterName = this.convertParameterName('B30BizDocVBDetail_Edit');
    param2.ParameterValue = 'B30BizDocVBDetail_Edit';
    params.push(param2);

    param3.ParameterName = this.convertParameterName('PositionCode');
    param3.ParameterValue = formData.value['PositionCode'];
    params.push(param3);

    let ds;
    let XMLObject1;

    XMLObject1 = {
      name: 'B30BizDocVBDetail_Edit',
      collection: this.gridArray[0].itemsSource.items
    }

    ds = Global.getDataSetContract(XMLObject1);

    let data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_NEW_CapNhatDangKyEmail', params, ds).toPromise().then();
    // console.log(params);

    this.output = <Array<Object>>(data['output']);
    this._err = this.output['@_Error'];
    this._errMess = this.output['@_ErrorMessage'];

    // let gridtmp: wjcGrid.FlexGrid = this.gridArray[0];

    // if (data['data'][0].length > 0) {
    //   let ds: CollectionView = gridtmp.itemsSource;

    //   var selected = [];
    //   for (let i = 0; i < gridtmp.rows.length; i++) {
    //     selected.push(gridtmp.rows[i].dataItem);
    //   }

    //   for (let i = 0; i < selected.length; i++) {
    //     ds.remove(selected[i]);
    //   }

    //   for (let row of data['data'][0]) {
    //     ds.itemsAdded.push(row);
    //     ds.sourceCollection.push(row);
    //   }

    //   for (let column of gridtmp.itemsSource['defaultRow']) {
    //     for (let row of gridtmp.itemsSource.sourceCollection) {
    //       if (row[column] == null || row[column] == undefined)
    //         row[column] = gridtmp.itemsSource['defaultRow'][column];
    //     }
    //   }

    //   // ds.sourceCollection = data;
    // }
    // else
    //   gridtmp.itemsSource.sourceCollection = [];

    // gridtmp.itemsSource.refresh();

    this.showLoading = false;
  }

  // async sendEmailForEachUser(formData: any) {
  //   if (this.editorFrm.valid)
  //     this.showLoading = true;

  //   let params = new Array<ParameterContract>();
  //   const param1 = new ParameterContract();

  //   param1.ParameterName = this.convertParameterName('Id');
  //   param1.ParameterValue = formData.value['IdBizDocVB'];
  //   params.push(param1);

  //   let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_SOL_V2SendMailForEachUser', params)
  //     .toPromise().then();
  // }
}
