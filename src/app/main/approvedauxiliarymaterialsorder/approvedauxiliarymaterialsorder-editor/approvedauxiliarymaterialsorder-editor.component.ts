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
import { LayoutApprovedAuxiliaryMaterialsOrderEditor } from "../Layout";
import { timeout } from "q";
import { Title } from "@angular/platform-browser";
import { LayoutPrinter } from '../../proposedpurchase2/proposedpurchase2-explorer/proposedpurchase2-printer.data';
import { Global } from "../../../shared/global";
import { Location } from "@angular/common";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { SystemConstants } from "../../../core/common/system.constants";

@Component({
  selector: 'app-approvedauxiliarymaterialsorder-editor-form',
  templateUrl: './approvedauxiliarymaterialsorder-editor.component.html',
  styleUrls: ['./approvedauxiliarymaterialsorder-editor.component.css']
})

export class ApprovedAuxiliaryMaterialsOrderEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;


  indexPage = ['/main', 'purchaseorder', 'index'];
  //indexPage = ['/main', 'notifications', 'index'];
  folderName = 'Don_Hang_Mua';
  folderNameQR = 'Bao_Gia_Nha_Cung_Cap';
  folderNameSendMail = 'Don_Hang_Mua';

  layoutPrint: LayoutPrinter = new LayoutPrinter();
  htmlShow: any;

  listButtonQR = [];
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

  output: Array<Object>;
  _errMess: string;
  _tongGiaTriPO: number;
  _tongDuTru: number;

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedAuxiliaryMaterialsOrderEditor(service, this.parentData);
    this._layoutPrinter = this.layoutPrint.Layout;
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2];
    this.init().then(() => {
      // let completed = this.parentData["ApproveStatus"];
      // if (completed === '' || completed == '0')
      //   this.getB40ProcureExpected();
      this.showPrintVoucher(this.id);
    });
    this.grid.isReadOnly = true;
    this.grid1.isReadOnly = true;
    this.grid2.isReadOnly = true;
    // this.grid3.isReadOnly = true;
    // this.grid3.headersVisibility = wjcGrid.HeadersVisibility.Row;

    this.doubleClickGrid(this.grid);
    this.dbClickCellContent(this.grid2);
  }

  async ngAfterViewInit() {
    this.dfpanel = this._dfpanel;
    this.afterViewInit();

    // this.checkVoucherAndPosition();
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any) {
    this.submit(formData, this.indexPage);
  }

  backClick() {
    // this._location.back();
    if (window.history.length > 1)
      window.history.back()
    else
      window.close();
  }

  isLoading = false;

  checkVoucherAndPosition() {
    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = this.id
    params.push(param1);

    this._service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_TMCtc_CheckPONotApprove', params).toPromise().then(_data => {
      this.isLast = _data[0]['Value1'];
      this.idBizDoc = _data[0]['Value2'];
      this.voucherNotApprove = _data[0]['Value3'];
      this.docNoPP = _data[0]['Value4'];
      this.lstIdPO = _data[0]['Value5'];
      this.lstDocNoPO = _data[0]['Value6'];
      this.approvedGroup = _data[0]['Value7'];
    });

  }

  checkVoucher() {
    if (this.voucherNotApprove != undefined && this.voucherNotApprove != null && this.voucherNotApprove > 0)
      this.showDialogCheck = true;
    else if (this.voucherNotApprove != undefined && this.voucherNotApprove != null && this.voucherNotApprove == 0) {
      this.onClick(1);
    }
  }

  // async onClick(state: any) {
  //   this.showLoading = true;

  //   if (!this.isLast) {
  //     this.parentData["ApproveStatus"] = state;
  //     this.parentData["ApproveStatusWeb"] = state;
  //     this.dfpanel.runConstraint('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
  //       this.showDialogCheck = false;
  //       this.getInfoTemplateMail(this.editorFrm, this.idBizDoc, this.approvedGroup).then(() => {
  //         this.backClick()
  //       });
  //       //this.sendMail(this.editorFrm, 'PO', this.parentData['IdBizDoc'], false);
  //       //this.router.navigate(this.indexPage);    
  //       //this.backClick();
  //     });
  //   }
  //   else {
  //     this.parentData["ApproveStatus"] = state;
  //     this.parentData["ApproveStatusWeb"] = state;
  //     this.dfpanel.runConstraint('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
  //       this.showDialogCheck = false;
  //       this.getInfoTemplateMail(this.editorFrm, this.idBizDoc, this.approvedGroup).then(() => {
  //         // if (Number(this._tongGiaTriPO) >= (0.8 * Number(this._tongDuTru)))
  //         //   this.getInfoTemplateMail(this.editorFrm, this.idBizDoc, '3').then();
  //       });
  //       //this.sendMail(this.editorFrm, 'PO', this.parentData['IdBizDoc'], false);
  //       //this.router.navigate(this.indexPage);    
  //       //this.backClick();
  //     });
  //   }
  // }

  async onClick(state: any) {
    let txt;
    if (state == 0) txt = 'Trả lại';
    else
      if (state == 1) txt = 'Duyệt';
      else
        if (state == 3) txt = 'Đề xuất trả';

    let r = confirm("Xác nhận thao tác: " + txt.toUpperCase());

    if (r == true) {
      if (Global.convertConfig('{VAR=User.Ma_CbNv}') != this.parentData['EmployeeCode'])
      alert("User đăng nhập không đúng với người duyệt!!!");
    else {
      this.showLoading = true;
      this.parentData["ApproveStatus"] = state;
      this.parentData["ApproveStatusWeb"] = state;

      this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
        this.sendMail(this.editorFrm, 'P8', this.parentData['IdBizDoc'], true, state).then(() => {
          this.router.navigate(['/main', 'notifications', 'index']);
        });
      });
    }
  }
  }

  async showPrintVoucher(input: any) {
    this.showLoading = true;
    var x = document.getElementById("viewfileattach");
    var y = document.getElementById("fileView");
    var z = document.getElementById('htmlShow');

    x.style.display = "none";
    y.style.display = "none";
    z.style.display = "flex";
    // z.style.alignItems = "center";
    z.style.justifyContent = "center";

    let layoutPrint = this._layoutDeclare.layout.PrintDocument.LayoutPrint;
    // let _data = await this._service.fetchDataChild(Global.DataExplorerEndpoint, 'vB30BizDocApprove_Edit', "Id = " + input).toPromise().then();
    // console.log(_data[0]['IdBizDoc']);
    let html = this.showHtmlEditor(layoutPrint[0]['WordName'], layoutPrint[0]['FileName'], layoutPrint[0]['FolderPath'], this.parentData['IdBizDoc']);
    html.then(data => {
      this.showLoading = false;
      document.getElementById('htmlShow').innerHTML = data;
    });
  }

  async doubleClickGrid(grid: wjcGrid.FlexGrid) {
    grid.addEventListener(grid.hostElement, 'dblclick', (e) => {
      if (grid.selectedItems[0]) {
        // let key = grid.selectedItems[0]['Id'];
        let fileName = grid.selectedItems[0]['FilePath'] + '.pdf';
        let _description = grid.selectedItems[0]['Description'];

        var x = document.getElementById("viewfileattach");
        var y = document.getElementById("fileView");
        var z = document.getElementById('htmlShow');
        // var w = document.getElementById('fileViewInfo');

        x.style.display = "block";
        y.style.display = "block";
        z.style.display = "none";
        // w.style.display = "none";

        let folder = "{EXPR=ProductCostId}\\" + this.folderName;

        folder = Global.translateAutoText(folder, this.parentData);

        if (folder && fileName) {
          let p = this._service.dowload(folder, this.parentData['IdBizDoc'].toString(), fileName).toPromise();
          p.then(blob => {
            // if (_description)
            // window.open(_description);

            if (fileName.toUpperCase().endsWith('PDF') == true || fileName.toUpperCase().endsWith('JPG') == true || fileName.toUpperCase().endsWith('PNG') == true || fileName.toUpperCase().endsWith('JPEG') == true || fileName.toUpperCase().endsWith('GIF') == true) {
              let url = window.URL.createObjectURL(blob);
              y.setAttribute('data', url);

              // if (y instanceof HTMLIFrameElement)
              //   y.src = _description + "&amp;action=embedview&amp;wdAr=1.7777777777777777";
              // // y.setAttribute('src', _description + "&amp;action=embedview&amp;wdAr=1.7777777777777777");
            }
          });
        }
        else {
          alert('Không tồn tại file đính kèm trên server.');
        }
      }
    }
    );
  }

  async zshowPrintVoucher(input: any) {
    var x = document.getElementById("viewfileattach");
    var y = document.getElementById("fileView");
    var z = document.getElementById('htmlShow');

    x.style.display = "none";
    y.style.display = "none";
    z.style.display = "flex";
    z.style.alignItems = "center";
    z.style.justifyContent = "center";

    this.showLoading = true;

    let layoutPrint = this._layoutDeclare.layout.PrintDocument.LayoutPrint;
    let _data = await this._service.fetchDataChild(Global.DataExplorerEndpoint, 'vB30BizDocApprove_Edit', "Id = " + input).toPromise().then();

    this.idPP = _data[0]['IdPP'];
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

    // for (let i in _data[0]['IdListQR'].split(',')) {
    //   this.listButtonQR.push({ 'Id': _data[0]['IdListQR'].split(',')[i] });
    // }

    this.idCalPrice = _data[0]['IdCalPrice'];

    if (_data[0]['ItemGroupCode'] == 'THEP') {

      let html = this.showHtmlEditor(layoutPrint[0]['WordName'], layoutPrint[0]['FileName'], layoutPrint[0]['FolderPath'], _data[0]['IdBizDoc']);
      html.then(data => {
        this.htmlShow = data;
        this.showLoading = false;
        document.getElementById('htmlShow').innerHTML = data;
      });
    }
    else {
      let html = this.showHtmlEditor(layoutPrint[1]['WordName'], layoutPrint[1]['FileName'], layoutPrint[1]['FolderPath'], _data[0]['IdBizDoc']);
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
    var z = document.getElementById('htmlShow');

    x.style.display = "none";
    y.style.display = "none";
    z.style.display = "block";

    if (id != undefined && id != null && id > 0) {
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
    else { alert("Không tồn tại báo giá!") }

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
    else {
      alert('Không tồn tại file đính kèm trên báo giá!');
    }
  }

  async showVoucherPP(name: string, fileName: string, folderPath: string) {

    var x = document.getElementById("viewfileattach");
    var y = document.getElementById("fileView");
    var z = document.getElementById('htmlShow');

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

      //     let _htmlDetail = ''
      //     if (this.gridPrint) {
      //         this.dataPrint = new wjcCore.CollectionView(data['data']);
      //         this.gridPrint.itemsSource = new wjcCore.CollectionView(data['data']);
      //         _htmlDetail = this.renderTable(this.gridPrint);
      //     }
      let _commnetHtml = data['output']['@_Comment'];

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

      if (_html.toString().indexOf('______________________________') > -1) {
        if (_commnetHtml != '' && _commnetHtml != undefined && _commnetHtml != null) {
          _html = _html.replace(/______________________________/gi, _commnetHtml);
        }
        else {
          _html = _html.replace(/______________________________/gi, ' .');
        }
      }

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
    var z = document.getElementById('htmlShow');

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

  getCalPriceForm() {
    this._service.fetchDataChild(Global.DataExplorerEndpoint, 'B40HtmlCalPrice', "IdPP = " + this.idPP).toPromise().then(data => {
      this.showLoading = false;
      document.getElementById('htmlShow').innerHTML = data[0]['Data'];
    });
  }

  skipApprove() {
    this.showDialogCheck = false;
  }

  cancellistVoucherAndMail() {
    this.cancellistVoucher(this.lstIdPO).then(() => {
      this.getInfoTemplateMail(this.editorFrm, this.idBizDoc, 'x').then(() => {
        this.backClick();
      });
    });
  }

  async cancellistVoucher(listId: string) {
    this.showLoading = true;
    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();
    const param4 = new ParameterContract();

    if (listId != '' && listId != null && listId != undefined) {
      param1.ParameterName = Global.convertParameterName('IdList');
      param1.ParameterValue = listId;
      params.push(param1);
    }
    else {
      param1.ParameterName = Global.convertParameterName('IdList');
      param1.ParameterValue = this.idBizDoc;
      params.push(param1);
    }

    param2.ParameterName = Global.convertParameterName('Note');
    param2.ParameterValue = this.inputCancelNote['nativeElement'].value;
    params.push(param2);

    param3.ParameterName = Global.convertParameterName('Id');
    param3.ParameterValue = this.id;
    params.push(param3);

    param4.ParameterName = Global.convertParameterName('BranchCode');
    param4.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/'/gi, '');
    params.push(param4);

    let _data = await this._service.postData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_TMCtc_Cancel_ListIdPO', params)
      .toPromise().then();

    this.showLoading = false;
    this.showDialog = false;
  }

  async sendMailSupplierAndUpdate() {
    this.sendMailCustom(true, this.updateSendMailSupplier(this.idBizDoc));
    // .then(() => {
    //   this.updateSendMailSupplier(this.idBizDoc);
    // });
  }

  async updateSendMailSupplier(id: number) {
    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('Id');
    param1.ParameterValue = id
    params.push(param1);

    let _data = await this._service.postData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_TMCtc_UpdateSendMailSupplier', params)
      .toPromise().then();
  }

  async getB40ProcureExpected() {
    this.showLoading = true;
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();
    const param4 = new ParameterContract();
    const param5 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('Id');
    param1.ParameterValue = this.id;
    params.push(param1);

    param2.ParameterName = this.convertParameterName('IdBizDoc');
    param2.ParameterValue = this.parentData["IdBizDoc"];
    params.push(param2);

    param3.ParameterName = this.convertParameterName('ItemGroupCode');
    param3.ParameterValue = this.parentData["ItemGroupCode"];
    params.push(param3);

    param4.ParameterName = this.convertParameterName('ProductCostId');
    param4.ParameterValue = this.parentData["ProductCostId1"];
    params.push(param4);

    param5.ParameterName = this.convertParameterName('BranchCode');
    param5.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');;
    params.push(param5);

    let gridtmp: wjcGrid.FlexGrid = this.grid3;

    let data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_TMCtc_GetB40ProcureExpected', params).toPromise().then();

    this.output = <Array<Object>>(data['output']);
    this._errMess = this.output['@_ColorKey'];
    this._tongGiaTriPO = this.output['@_TongGiaTriPO'];
    this._tongDuTru = this.output['@_TongDuTru'];

    if (data['data'].length > 0) {
      let ds: wjcCore.CollectionView = gridtmp.itemsSource;

      var selected = [];
      for (let i = 0; i < gridtmp.rows.length; i++) {
        selected.push(gridtmp.rows[i].dataItem);
      }

      for (let i = 0; i < selected.length; i++) {
        ds.remove(selected[i]);
      }

      for (let row of data['data']) {
        ds.itemsAdded.push(row);
        ds.sourceCollection.push(row);
      }

      for (let column of gridtmp.itemsSource['defaultRow']) {
        for (let row of gridtmp.itemsSource.sourceCollection) {
          if (row[column] == null || row[column] == undefined)
            row[column] = gridtmp.itemsSource['defaultRow'][column];
        }
      }
    }
    else
      gridtmp.itemsSource.sourceCollection = [];

    gridtmp.itemsSource.refresh();

    this.showLoading = false;
  }
}
