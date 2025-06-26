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
import { LayoutProposedPurchase4Editor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { Global } from "../../../shared/global";
import { CollectionView } from "wijmo/wijmo";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { Location } from "../../../../../node_modules/@angular/common";

@Component({
  selector: 'app-proposedpurchase4-editor-form',
  templateUrl: './proposedpurchase4-editor.component.html',
  styleUrls: ['./proposedpurchase4-editor.component.css']
})

export class ProposedPurchase4EditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  

  indexPage = ['/main', 'purchaseorder', 'index'];
  folderName = '12.Don_Hang_Mua';
  folderNameQR = '11.Bao_Gia_Nha_Cung_Cap';

  htmlShow: any;

  listButtonQR=[];
  idPP: any;
  idCalPrice: any;
  
  showDialogCheck = false;

  isLast: boolean;
  idBizDoc: number;
  voucherNotApprove: number;
  docNoPP: string;
  lstDocNoPO: string;
  lstIdPO: string;
  approvedGroup: string;

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutProposedPurchase4Editor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid];
    this.init();
    this.grid.isReadOnly = true;
  }

  async ngAfterViewInit() {
    this.dfpanel = this._dfpanel; 
    this.afterViewInit();

    this.showPrintVoucher(this.id);
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any) {
    alert("Chức năng không tồn tại");
  }

  backClick(){
    this._location.back();
  }

  isLoading = false;

  async showPrintVoucher(input: any) {
    var x = document.getElementById("viewfileattach");
    var y = document.getElementById("fileView");
    var z =  document.getElementById('htmlShow');

    x.style.display = "none";
    y.style.display = "none";
    z.style.display = "block";

    this.showLoading = true;

    let layoutPrint = this._layoutDeclare.layout.PrintDocument.LayoutPrint;
    let _data = await this._service.fetchDataChild(Global.DataExplorerEndpoint, 'vB30BizDoc_Edit', "Id = " + input).toPromise().then();

    this.idPP = _data[0]['Id_HdPl'];

    this.listButtonQR = [];

    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('IdListQR');
    param1.ParameterValue = _data[0]['IdListQR'];
    params.push(param1);

    let _dataIdListQR = await this._service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_TMCtc_GetShortNameSupplier', params).toPromise().then();
    for (let i in _dataIdListQR[0]['ShortName'].split(',')) {
      this.listButtonQR.push({ 'Id': _dataIdListQR[0]['ShortName'].split(',')[i] });
    }

    // for(let i in _data[0]['IdListQR'].split(',')){
    //   this.listButtonQR.push({'Id':_data[0]['IdListQR'].split(',')[i]});
    // }

    this.idCalPrice = _data[0]['IdCalPrice'];

    if (_data[0]['ItemGroupCode'] == 'THEP') {

      let html = this.showHtmlEditor(layoutPrint[0]['WordName'], layoutPrint[0]['FileName'], layoutPrint[0]['FolderPath'],input);
      html.then(data => {
        this.htmlShow = data;
        this.showLoading = false;
        document.getElementById('htmlShow').innerHTML = data;
      });
    }
    else {
      let html = this.showHtmlEditor(layoutPrint[1]['WordName'], layoutPrint[1]['FileName'], layoutPrint[1]['FolderPath'], input);
      html.then(data => {
        this.htmlShow = data;
        this.showLoading = false;
        document.getElementById('htmlShow').innerHTML = data;
      });
    }
  }

  async showVoucherQR(name: string, fileName: string, folderPath: string, id: number) {

    var x = document.getElementById("viewfileattach");
    var y = document.getElementById("fileView");
    var z =  document.getElementById('htmlShow');

    x.style.display = "none";
    y.style.display = "none";
    z.style.display = "block";

    if (id != undefined && id != null && id > 0)
    {
    this.showLoading = true;

    
    let _command = 'usp_B30BizDoc_VoucherForm';


    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = id
    params.push(param1);

    let ctor1 = CryptoExtension.encrypt(_command);
    const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

    let body = {
      "storeName": ctor1,
      "params": ctor2
    }

    this._service.exportHtml(folderPath + name, body).subscribe(data => {

      //     let _htmlDetail = ''
      //     if (this.gridPrint) {
      //         this.dataPrint = new wjcCore.CollectionView(data['data']);
      //         this.gridPrint.itemsSource = new wjcCore.CollectionView(data['data']);
      //         _htmlDetail = this.renderTable(this.gridPrint);
      //     }

      let _title = fileName;

      if (_title == '' || _title == null || _title == undefined) {
        _title = this._layoutDeclare.layout.PrintDocument.Text;
      }

      let _html = `<html>
    <head>
    <title>`+ Global.translateAutoText(_title, this.parentData) + `</title>
        </head>`;
      _html += '<body onload="window.print();window.close()">';

      _html += Global.translateImageOutput(data['html'], data['output']);

      _html += '</body></html>'

      this.showLoading = false;

        document.getElementById('htmlShow').innerHTML = _html;

      // let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

      // popupWin.document.write(_html);

      // popupWin.document.close();
      
    });
  }
  else {alert("Không tồn tại báo giá!")}
    
  }

  async showAttachQR(folder: string, id: string) {
    id = id.substring(id.indexOf('-') + 2, id.length);

    var x = document.getElementById("viewfileattach");
    var y = document.getElementById("fileView");
    var z = document.getElementById('htmlShow');

    x.style.display = "block";
    y.style.display = "block";
    z.style.display = "none";

    folder = Global.translateAutoText(folder, this.parentData);
    
    let _data = await this._service.fetchDataChild(Global.DataExplorerEndpoint, 'B30BizDoc', "Id = " + id).toPromise().then();

    let fileName = _data[0]['FilePath'];

    if (folder && fileName) {
      
      let p = this._service.dowload(folder, id.toString(), fileName).toPromise();
      p.then(blob => {
        
        if (fileName.toUpperCase().endsWith('PDF') == true || fileName.toUpperCase().endsWith('JPG') == true || fileName.toUpperCase().endsWith('PNG') == true || fileName.toUpperCase().endsWith('JPEG') == true || fileName.toUpperCase().endsWith('GIF') == true) {                
          let url = window.URL.createObjectURL(blob);
          y.setAttribute('data', url);
          // if (x.style.display == 'none') {
          //   x.style.display = "block";
          // }
          // else {
          //   x.style.display = "none";
          // }
        }
      });
    }
    else{
      alert('Không tồn tại file đính kèm trên báo giá!');
    }
  }

  async showVoucherPP(name: string, fileName: string, folderPath: string) {

    var x = document.getElementById("viewfileattach");
    var y = document.getElementById("fileView");
    var z =  document.getElementById('htmlShow');

    x.style.display = "none";
    y.style.display = "none";
    z.style.display = "block";

    this.showLoading = true;

    let _command = 'usp_B30BizDoc_VoucherForm';


    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = this.idPP;
    params.push(param1);

    let ctor1 = CryptoExtension.encrypt(_command);
    const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

    let body = {
      "storeName": ctor1,
      "params": ctor2
    }

    this._service.exportHtml(folderPath + name, body).subscribe(data => {

      let _title = fileName;

      if (_title == '' || _title == null || _title == undefined) {
        _title = this._layoutDeclare.layout.PrintDocument.Text;
      }

      let _html = `<html>
    <head>
    <title>`+ Global.translateAutoText(_title, this.parentData) + `</title>
        </head>`;
      _html += '<body onload="window.print();window.close()">';

      _html += Global.translateImageOutput(data['html'], data['output']);

      _html += '</body></html>'

      this.showLoading = false;

      document.getElementById('htmlShow').innerHTML = _html;

      // let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

      // popupWin.document.write(_html);

      // popupWin.document.close();
    });
    
  }

  async showVoucher_CalPrice(name: string, fileName: string, folderPath: string) {
    var x = document.getElementById("viewfileattach");
    var y = document.getElementById("fileView");
    var z =  document.getElementById('htmlShow');

    x.style.display = "none";
    y.style.display = "none";
    z.style.display = "block";

    this.showLoading = true;

    let _command = 'usp_TMCtc_B40PriceCalculate_VoucherForm';


    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = this.idCalPrice;
    params.push(param1);

    const param2 = new ParameterContract();

    param2.ParameterName = this.convertParameterName('IdBizDoc');
    param2.ParameterValue = this.parentData['IdBizDoc'];
    params.push(param2);

    let ctor1 = CryptoExtension.encrypt(_command);
    const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

    let body = {
      "storeName": ctor1,
      "params": ctor2
    }

    this._service.exportHtml(folderPath + name, body).subscribe(data => {

      let _title = fileName;

      if (_title == '' || _title == null || _title == undefined) {
        _title = this._layoutDeclare.layout.PrintDocument.Text;
      }

      let _html = `<html>
    <head>
    <title>`+ Global.translateAutoText(_title, this.parentData) + `</title>
        </head>`;
      _html += '<body onload="window.print();window.close()">';

      _html += Global.translateImageOutput(data['html'], data['output']);

      _html += '</body></html>'

      this.showLoading = false;

      document.getElementById('htmlShow').innerHTML = _html;

      // let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

      // popupWin.document.write(_html);

      // popupWin.document.close();
    });
    
  }

  getCalPriceForm(){
    this._service.fetchDataChild(Global.DataExplorerEndpoint, 'B40HtmlCalPrice', "IdPP = " + this.idPP).toPromise().then(data=>{
        this.showLoading = false;
        document.getElementById('htmlShow').innerHTML = data[0]['Data'];
    });

  }
}
