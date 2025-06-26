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
import { LayoutRegContract_ViewEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinterWordFlow } from "../../_printerlayout/workflow/workflow-printer.data";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { SystemConstants } from "../../../core/common/system.constants";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-regcontract_view-editor-form',
  templateUrl: './regcontract_view-editor.component.html',
  styleUrls: ['./regcontract_view-editor.component.css']
})

export class RegContract_ViewEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

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

  indexPage = ['/main', 'regcontract_view', 'index'];
  folderName = '02.Hop_Dong_Phu_Luc';
  indexPage_Editor = ['/main', 'regcontract_view', 'detailc3'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutRegContract_ViewEditor(service, this.parentData);
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
        this.grid6.isReadOnly = true;
      }
      else {
      
        this.grid6.isReadOnly = false;
      }

    });
    this.grid.isReadOnly = true;
    // this.grid1.isReadOnly = true;
    this.grid2.isReadOnly = true;        
    this.grid3.isReadOnly = true;
    this.grid5.isReadOnly = true;

    this.dbClickCellContent(this.grid3);
    this.doubleClickGrid(this.grid5);

  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

  }

  ngOnDestroy() {
    this.destroy();
  }

  async onSubmit(formData: any, isApproveSend?: boolean) {
    let _numEror = 0;
    for (let i in this.gridArray) {
      if (this.gridArray[i].itemsSource.items.length == 0 && i != '3') {
        _numEror += 1;
        break;
      }
    }

    if (_numEror == 0) {
      if (isApproveSend == true) {
        let _errorSave = false;
        for (let item of this.grid1.itemsSource.items) {
          if (item['Attached'] == true && item['Description'] != 'Theo mẫu công ty ban hành' && (item['FilePath']=='' || item['FilePath'] == undefined)) {
            _errorSave = true;
            break;
          }
        }
        if (_errorSave) {
          alert('Yêu cầu đính kèm tài liệu trước khi gửi duyệt!');
        }
        else {
          // this.editorFrm.controls['ApproveSend'].setValue(true);
          // this.dfpanel.runConstraint('Evaluator_UpdateApproveSend').then();
          // window.close();
          this.submit(formData, this.indexPage, isApproveSend);
        }
      }
      else
        this.submit(formData, this.indexPage_Editor).then(()=>{
          location.reload();
        });
    }
    else {
      alert('Các Tab chi tiết cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có).');
    }
  }

  doubleClickGrid(grid: wjcGrid.FlexGrid) {
    let navigateUrl: any[] = [];
    let host = grid.hostElement;
    let self = this;

    host.addEventListener('dblclick', function (e) {
      if (grid.selectedItems[0] != null && grid.selectedItems[0] != undefined) {
        let key = grid.selectedItems[0]['Id'];
        let link = grid.selectedItems[0]['_LinkCommandWeb'];

        if (key) {
          navigateUrl.push(link);
          navigateUrl.push(key);

          window.open(navigateUrl.join('/'));   //phải có #

          // self.router.navigate(navigateUrl); //không có #

          navigateUrl = [];
        }
      }
    });
  }


  showPrintVoucher_WorklFlow(input: any, gridForm?: wjcGrid.FlexGrid, extInput?: string) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher_WordFlow(input, 'MAU1', gridForm, extInput, 'DocCode');

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }
}