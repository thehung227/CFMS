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
import { LayoutContractEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinterWordFlow } from "../../_printerlayout/workflow/workflow-printer.data";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { SystemConstants } from "../../../core/common/system.constants";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-contract-editor-form',
  templateUrl: './contract-editor.component.html',
  styleUrls: ['./contract-editor.component.css']
})

export class ContractEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('grid5') grid5: wjcGrid.FlexGrid;
  @ViewChild('grid6') grid6: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  layoutPrintWordFlow: LayoutPrinterWordFlow = new LayoutPrinterWordFlow();

  indexPage = ['/main', 'contract', 'index'];
  folderName = '02.Hop_Dong_Phu_Luc';
  indexPage_Editor = ['/main', 'contract', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutContractEditor(service, this.parentData);
    this._layoutPrinter_WordFlow = this.layoutPrintWordFlow.Layout;
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }
  output: any;
  _errItemSets: boolean = false;
  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4, this.grid5, this.grid6];
    this.init().then(async ()=>{
  
      let _value;
      const params = new Array<ParameterContract>();
      const param = new ParameterContract();
      const param1 = new ParameterContract();
      
      param.ParameterName = Global.convertParameterName('nUserId');
      param.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID);
      params.push(param);

      _value = localStorage.getItem(SystemConstants.PRODUCTCOSTID).replace(/"/gi, '');

      param1.ParameterName = Global.convertParameterName('ProductCostId');
      param1.ParameterValue = _value;
      params.push(param1);

      let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_GetDeptCodeFromEmployee', params) .toPromise().then();
      this.output = <Array<Object>>(_data['output']);
      this._errItemSets = this.output['@_Error'];
     
      if (this._errItemSets == true) {
        console.log(this._errItemSets)
        // this.grid5.isReadOnly = true;
      }
      else {
      
        // this.grid5.isReadOnly = false;
      }

    });
    this.grid.allowAddNew = false;
    this.grid1.allowAddNew = false;
    this.grid2.isReadOnly = true;
    this.grid3.isReadOnly = true;

    this.dbClickCellContent(this.grid3);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any) {

 

    if ((formData.controls['FilePath'].value != '' && (formData.controls['EstimatedCompletionDate'].value == null || formData.controls['EstimatedCompletionDate'].value == undefined || formData.controls['EstimatedCompletionDate'].value == ''))) {
      alert('Yêu cầu nhập ngày đính kèm !!!');
    }
    else
      this.submit(formData, this.indexPage_Editor);
    // this.submit(formData, this.indexPage_Editor).then(()=>{
    //   location.reload(false);
    // });
  }

  showPrintVoucher_WorklFlow(input: any, gridForm?: wjcGrid.FlexGrid, extInput?: string) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher_WordFlow(input, 'MAU1', gridForm, extInput, 'DocCode');

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  exportHtmlWorkFlow(input: any, extInput?: string){
    this.exportHtml_WorkFlow('WorkFlow_HD.docx', 'WorkFlow HD,PLHD - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }
}
