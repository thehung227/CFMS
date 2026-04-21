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
import { LayoutApprovedTenderSelectionEditor } from "../Layout";
import { Global } from "../../../shared/global";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-approvedtenderselection-editor-form',
  templateUrl: './approvedtenderselection-editor.component.html',
  styleUrls: ['./approvedtenderselection-editor.component.css']
})

export class ApprovedTenderSelectionEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'auditlegal', 'index'];
  folderName = 'So_Sanh_Chon_Thau';
  folderNameSendMail = 'So_Sanh_Chon_Thau';

  output: Array<Object>;
  _err: boolean = false;
  _errMess: string;
  htmlShow: any;

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedTenderSelectionEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init().then(() => {
      // this.showDefaultFile();
    });
    this.grid.allowAddNew = false;
    this.grid1.isReadOnly = true;
    this.grid2.isReadOnly = true;
    this.grid3.isReadOnly = true;

    this.dbClickCellContent(this.grid2);

  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
    // this.showDefaultFile();
    // this.showPrintVoucher(this.id);
    // this.wordWrapGrid();
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
    // if (Global.convertConfig('{VAR=User.Ma_CbNv}') != this.parentData['EmployeeCode'])
    //   alert("User đăng nhập không đúng với người duyệt!!!");
    // else {
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
        // this.updateB30BizDocVBDetail(formData).then(() => {
        //   if (this._err == false) {
        this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
          this.sendMail(this.editorFrm, 'A5', this.parentData['IdBizDocVB'], false, state).then(() => {
            this.router.navigate(['/main', 'notifications', 'index']);
          });
        });
        //   }
        //   else
        //     alert(this._errMess);
        // });
      }
    // }
  }

  async doubleClickGrid(grid: wjcGrid.FlexGrid) {
    grid.addEventListener(grid.hostElement, 'dblclick', (e) => {
      if (grid.selectedItems[0]) {
        // let key = grid.selectedItems[0]['Id'];
        let fileName = grid.selectedItems[0]['FilePath'] + '.pdf';
        let _description = grid.selectedItems[0]['LinkSharePoint'];

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
          let p = this._service.dowload(folder, this.parentData['IdBizDocVB'].toString(), fileName).toPromise();
          p.then(blob => {
            // if (_description)
            //   window.open(_description);

            if (fileName.toUpperCase().endsWith('PDF') == true || fileName.toUpperCase().endsWith('JPG') == true || fileName.toUpperCase().endsWith('PNG') == true || fileName.toUpperCase().endsWith('JPEG') == true || fileName.toUpperCase().endsWith('GIF') == true) {
              let url = window.URL.createObjectURL(blob);
              y.setAttribute('data', url);

              //   // if (y instanceof HTMLIFrameElement)
              //   //   y.src = _description + "&amp;action=embedview&amp;wdAr=1.7777777777777777";
              //   // // y.setAttribute('src', _description + "&amp;action=embedview&amp;wdAr=1.7777777777777777");
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

  async showPrintVoucher(input: any) {
    this.showLoading = true;
    var x = document.getElementById("viewfileattach");
    var y = document.getElementById("fileView");
    var z = document.getElementById('htmlShow');

    x.style.display = "none";
    y.style.display = "none";
    z.style.display = "block";

    let layoutPrint = this._layoutDeclare.layout.PrintDocument.LayoutPrint;
    let _data = await this._service.fetchDataChild(Global.DataExplorerEndpoint, 'vB30BizDocApprove_BizDocVBEdit', "Id = " + input).toPromise().then();

    let html = this.showHtmlEditor(layoutPrint[0]['WordName'], layoutPrint[0]['FileName'], layoutPrint[0]['FolderPath'], _data[0]['IdBizDocVB']);
    html.then(data => {
      this.htmlShow = data;
      document.getElementById('htmlShow').innerHTML = data;
      this.showLoading = false;
    });
  }

  // async showDefaultFile() {
  //   this.showLoading = true;
  //   if (this.gridArray[0].itemsSource.items) {
  //     // let key = grid.selectedItems[0]['Id'];
  //     let fileName = this.grid.itemsSource.items[0]['FilePath'] + '.pdf';
  //     let _description = this.grid.itemsSource.items[0]['LinkSharePoint'];

  //     var x = document.getElementById("viewfileattach");
  //     var y = document.getElementById("fileView");
  //     var z = document.getElementById('htmlShow');

  //     x.style.display = "block";
  //     y.style.display = "block";
  //     z.style.display = "none";

  //     let folder = "{EXPR=ProductCostId}\\" + this.folderName;

  //     folder = Global.translateAutoText(folder, this.parentData);

  //     if (folder && fileName) {
  //       let p = this._service.dowload(folder, this.parentData['IdBizDocVB'].toString(), fileName).toPromise();
  //       p.then(blob => {
  //         if (fileName.toUpperCase().endsWith('PDF') == true || fileName.toUpperCase().endsWith('JPG') == true || fileName.toUpperCase().endsWith('PNG') == true || fileName.toUpperCase().endsWith('JPEG') == true || fileName.toUpperCase().endsWith('GIF') == true) {
  //           let url = window.URL.createObjectURL(blob);
  //           y.setAttribute('data', url);
  //           this.showLoading = false;
  //           // if (y instanceof HTMLIFrameElement)
  //           //   y.src = _description + "&amp;action=embedview&amp;wdAr=1.7777777777777777";
  //           // // y.setAttribute('src', _description + "&amp;action=embedview&amp;wdAr=1.7777777777777777");
  //         }
  //       });
  //     }
  //   }
  // }

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
    param1.ParameterValue = this.parentData['IdBizDocVB'];
    params.push(param1);

    param2.ParameterName = this.convertParameterName('B30BizDocVBDetail2_Edit');
    param2.ParameterValue = 'B30BizDocVBDetail2_Edit';
    params.push(param2);

    param3.ParameterName = this.convertParameterName('Date1');
    param3.ParameterValue = this.editorFrm.controls['Date1'].value;
    params.push(param3);

    let ds;
    let XMLObject1;

    XMLObject1 = {
      name: 'B30BizDocVBDetail2_Edit',
      collection: this.gridArray[3].itemsSource.items
    }

    ds = Global.getDataSetContract(XMLObject1);
    console.log(params);

    let data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_A2_CapNhatDanhGiaPhapLy', params, ds).toPromise().then();

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
    exportHtmlWorkFlow(input: any, extInput?: string) {
    this.exportHtml_WorkFlow('WorkFlow_SSG.docx', 'WorkFlow TP.NCC - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }
}
