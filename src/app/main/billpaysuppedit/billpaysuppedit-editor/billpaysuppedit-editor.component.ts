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
import { LayoutBillPaySuppEditEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinter } from "../billpaysuppedit-explorer/billpaysuppedit-printer.data";
import { LayoutPrinterWordFlow } from "../../_printerlayout/workflow/workflowTT-printer.data";
import { FormGroup } from "@angular/forms";
import { SystemConstants } from "../../../core/common/system.constants";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { Popup } from "wijmo/wijmo.input";

@Component({
  selector: 'app-billpaysuppedit-editor-form',
  templateUrl: './billpaysuppedit-editor.component.html',
  styleUrls: ['./billpaysuppedit-editor.component.css']
})

export class BillPaySuppEditEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {
  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('grid5') grid5: wjcGrid.FlexGrid;
    @ViewChild('dataPopup') dataPopup: Popup;

  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  layoutPrint: LayoutPrinter = new LayoutPrinter();
  layoutPrintWordFlow: LayoutPrinterWordFlow = new LayoutPrinterWordFlow();
  indexPage = ['/main', 'billpaysuppedit', 'index'];
  folderName = '06.Thanh_Toan_TP_NCC';
  indexPage_Editor = ['/main', 'billpaysuppedit', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutBillPaySuppEditEditor(service, this.parentData);
    this._layoutPrinter = this.layoutPrint.Layout;
    this._layoutPrinter_WordFlow = this.layoutPrintWordFlow.Layout;
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }
  isSysAdmin: string;
  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4, this.grid5];
    this.isSysAdmin = localStorage.getItem(SystemConstants.CURRENT_ISSYSADMIN);
    this.init().then()
    // this.init().then(() => {
      
    //   if (this.isSysAdmin == 'true') {
    //     this.grid1.isReadOnly = false;
    //     this.grid2.isReadOnly = false;
    //     this.grid3.isReadOnly = false;
    //     this.grid4.isReadOnly = false;
    //   }
    //   else {
    //     this.grid1.isReadOnly = true;
    //     this.grid2.isReadOnly = true;
    //     this.grid3.isReadOnly = true;
    //     this.grid4.isReadOnly = true;
    //   }
    // });
   
    this.grid1.allowAddNew = false;
    this.grid2.allowAddNew = false;
    this.grid.isReadOnly = true;
    // this.grid1.isReadOnly = true;
    // this.grid2.isReadOnly = true;
    // this.grid3.isReadOnly = true;
    // this.grid4.isReadOnly = true;

    this.grid4.allowAddNew = false;

    this.dbClickCellContent(this.grid3);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
     this.grid5.formatItem.addHandler((s: wjcGrid.FlexGrid, e: wjcGrid.FormatItemEventArgs) => {
              if (e.panel.cellType != wjcGrid.CellType.Cell) return;
              let col = s.columns[e.col];
              if (!col || col.binding != 'HrefLink') return;
        
              let url = (s.getCellData(e.row, e.col, false) || '').toString().trim();
              if (url) {
                e.cell.innerHTML = '<button type="button" class="btn btn-link" '
                  + 'style="padding:0;color:#1565c0;text-decoration:underline;cursor:pointer;" '
                  + 'onclick="event.stopPropagation();window.open(\'' + url.replace(/'/g, "\\'") + '\',\'_blank\')">'
                  + 'Link</button>';
              } else {
                e.cell.innerHTML = '';
              }
            });
  }

  ngOnDestroy() {
    this.destroy();
  }
  
 output: any;
  _err: boolean = false;
  _errMess: any;
  onSubmit(formData: any) {
    let _numEror = 0;
    // for (let i in this.gridArray) {
    if ((this.gridArray[1].itemsSource.items.length == 0) || (this.gridArray[2].itemsSource.items.length == 0)) {
      _numEror += 1;
    }
    // }
    // if(formData instanceof FormGroup) {
    //   formData.get('ClassCode1').value;
    // console.log('###########',formData.get('ClassCode1').value)

    // }
    let _errorSave1 = false;
    let _errorSave2 = false;
    for (let item of this.grid2.itemsSource.items) {
      if (item['EmployeeCode'] == '') {
        _errorSave1 = true;
        break;
      }
      else
        if (item['EmployeeCode'].toString().indexOf(',') > 0 && item['EmployeeCodeReal'] == '') {
          _errorSave1 = true;
          break;
        }
    }
    if(formData instanceof FormGroup) {
      if (formData.get('ClassCode1').value != 'CD01' && (formData.get('Date_Liquidation').value == '' || formData.get('Date_Liquidation').value == null || formData.get('Date_Liquidation').value == undefined)) {
        _errorSave2 = true;
      }
    }
    
    // this.checkUniqueColGrid(this.grid2, 'ApproveGroup');
    this.submit(formData, this.indexPage_Editor);
  }

  showPrintVoucher(input: any) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher(input);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
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

async onClick_2(state?: any) {
    try {
      this.showDialog = false;//Thêm dialog

      if (this.editorFrm.valid) {
        this.showLoading = true;
        this.taidulieu = true;
      }

      for (let command of this._layoutDeclare.buttonLoadChild2) {
        if (this.editorFrm.valid)
          await this.dfpanel.runConstraint(command).then();
      }

      this.showLoading = false;
    }
    catch (ex) {
      alert("Xảy ra lỗi trong quá trình thực hiện");
      console.log(ex);
      this.showLoading = false;
    }
  }

_errItemSets: boolean = false;
dataPopupContent: any = null;
async saveData(formData: any,state: any) {
    this.showLoading = true;
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('BizDocId');
    param1.ParameterValue = this.parentData['BizDocId'];
    params.push(param1);

    param2.ParameterName = Global.convertParameterName('nUserId');
    param2.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID);
    params.push(param2);

    param3.ParameterName = Global.convertParameterName('ProductCostId');
    param3.ParameterValue = this.editorFrm.controls['ProductCostId'].value.toString();
    params.push(param3);



    let _data: any = null;

    try {
      let paramXML = new ParameterContract();
      paramXML.ParameterName = this.convertParameterName('B30BizDocContactInfo');
      paramXML.ParameterValue = 'B30BizDocContactInfo';
      params.push(paramXML);

      let ds = Global.getDataSetContract(
        {
          name: 'B30BizDocContactInfo',
          collection: Global.createColection(this.grid5.itemsSource)
        }
      )
      let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_CFMS_AutoCreateAccountDocument_Bill', params, ds)
        .toPromise().then();

      this.output = <Array<Object>>(_data['data']);

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
      // Lấy phần tử đầu tiên nếu output là mảng
      // if (Array.isArray(output) && output.length > 0) {
      //   this.dataPopupContent = output[0]; // 👈 lấy hóa đơn đầu tiên
      // } else {
      //   this.dataPopupContent = output || _data;
      // }
      this.dataPopupContent = this.output[0];

      console.log('Data để show popup:', this.dataPopupContent);
      if (this.dataPopup) {
        this.dataPopup.show(true);
        
      }
      // location.reload()
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

  closePopup() {
    this.dataPopup.hide();     // Ẩn popup
    location.reload();         // Reload lại trang
  }
  
  exportHtmlWorkFlow(input: any, extInput?: string) {
    this.exportHtml_WorkFlow('WorkFlow_TT.docx', 'WorkFlow TP.NCC - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }
}
