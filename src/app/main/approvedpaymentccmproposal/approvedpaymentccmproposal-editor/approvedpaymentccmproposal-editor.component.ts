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
import { LayoutApprovedPaymentCcmProposalEditor } from "../Layout";
import { timeout } from "q";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { SystemConstants } from "../../../core/common/system.constants";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-approvedpaymentccmproposal-editor-form',
  templateUrl: './approvedpaymentccmproposal-editor.component.html',
  styleUrls: ['./approvedpaymentccmproposal-editor.component.css']
})

export class ApprovedPaymentCcmProposalEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;

  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'paymentproposal', 'index'];
  folderName = 'De_Xuat_Thanh_Toan';
  folderNameSendMail = 'De_Xuat_Thanh_Toan';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedPaymentCcmProposalEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2];
    this.init();
    // .then(() => {
    //   if (this.parentData['PositionCode'] == 'CB-006') {
    //     this.grid.isReadOnly = false;
    //   }
    //   else {
    //     this.grid.isReadOnly = true;
    //   }
    // })

    this.grid1.isReadOnly = true;
    this.grid2.isReadOnly = true;
    this.grid.allowSorting = true;

    this.dbClickCellContent(this.grid1);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data['EstimatedTimeDelivery'] < this.parentData["DocDate"] && data['IsTitleRow']== false ) {
            wjcCore.setCss(e.cell, {
              color: 'red',
              fontWeight: ''
            });
          }
          else
          if (data['IsTitleRow'] == true) {
            wjcCore.setCss(e.cell, {
              color: 'black',
              fontWeight: 'bold'
            });
          }
          else {
            wjcCore.setCss(e.cell, {
              color: '',
              fontWeight: '',
              // backgroundColor: ''
            });
          }
        }
      }
    });
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

  output: any;
  _errItemSets: boolean = false;
  _errMess: any;

  filesUpload2: File[] = [];
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
      try {
        for (let row of this.grid.itemsSource.sourceCollection) {
          if (row['Data'] != undefined) {
            this.filesUpload2.push(row['Data']);
            ;
          }
        }
      }
      catch (e) { }

      let params = new Array<ParameterContract>();
      const param1 = new ParameterContract();
      const param2 = new ParameterContract();
      const param3 = new ParameterContract();
      const param4 = new ParameterContract();
      const param5 = new ParameterContract();
      const param6 = new ParameterContract();

      // let _value = formData.value['DocDate'];
      // if (_value instanceof Date) {
      //   _value = _value.toISOString();
      //   param1.ParameterName = Global.convertParameterName('DocDate');
      //   param1.ParameterValue = _value;
      //   params.push(param1);
      // }


      param3.ParameterName = Global.convertParameterName('BranchCode');
      param3.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
      params.push(param3);

      param1.ParameterName = Global.convertParameterName('IdCCMBudget');
      param1.ParameterValue = this.editorFrm.controls['IdCCMBudget'].value.toString();
      params.push(param1);

      // param2.ParameterName = Global.convertParameterName('TongDinhMuc');
      // param2.ParameterValue = this.editorFrm.controls['TongDinhMuc'].value.toString();
      // params.push(param2);

      param4.ParameterName = Global.convertParameterName('Amount_ChiPhiQL');
      param4.ParameterValue = this.editorFrm.controls['Amount_ChiPhiQL'].value.toString();
      params.push(param4);

      param5.ParameterName = Global.convertParameterName('PositionCode');
      param5.ParameterValue = this.editorFrm.controls['PositionCode'].value.toString();
      params.push(param5);

      param6.ParameterName = Global.convertParameterName('State');
      param6.ParameterValue = state.toString();
      params.push(param6);

      try {
        let paramXML = new ParameterContract();
        paramXML.ParameterName = this.convertParameterName('B30CCMBudgetDetail');
        paramXML.ParameterValue = 'B30CCMBudgetDetail';
        params.push(paramXML);

        let ds = Global.getDataSetContract(
          {
            name: 'B30CCMBudgetDetail',
            collection: Global.createColection(this.grid.itemsSource)
          }
        )

        let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_B30CCMBudget_UpdateInfo_WhenApprove', params, ds)
          .toPromise().then();

        this.output = <Array<Object>>(_data['output']);
console.log( this.output)

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
      this.showLoading = true;

      this.parentData["ApproveStatus"] = state;
      this.parentData["ApproveStatusWeb"] = state;
      // await this.dfpanel.runConstraint('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(()=>{
      //   setTimeout(() => {
      //     window.close();
      //   }, 1000);
      // });

      this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
        this.sendMail(this.editorFrm, 'K9', this.parentData['IdCCMBudget'], false, state).then(() => {
          this.router.navigate(['/main', 'notifications', 'index']);
        });
      });
    }
      // this.backClick();
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
