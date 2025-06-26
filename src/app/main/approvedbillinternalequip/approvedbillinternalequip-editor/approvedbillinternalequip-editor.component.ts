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
import { LayoutApprovedBillInternalEquipEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { Global } from "../../../shared/global";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { SystemConstants } from "../../../core/common/system.constants";

@Component({
  selector: 'app-approvedbillinternalequip-editor-form',
  templateUrl: './approvedbillinternalequip-editor.component.html',
  styleUrls: ['./approvedbillinternalequip-editor.component.css']
})

export class ApprovedBillInternalEquipEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'billpaydept', 'index'];
  folderName = '08.Thanh_Toan_BCH';
  // indexPage_Editor = ['/main', 'approvedbillinternalequip', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedBillInternalEquipEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init().then(() => {
      // this.showDefaultFile();
      this.showPrintVoucher(this.id);
    });
    this.grid.isReadOnly = true;
    this.grid1.isReadOnly = true;
    this.grid.allowAddNew = false;
    this.grid1.allowAddNew = false;
    // this.grid2.allowAddNew = false;
    this.grid3.isReadOnly = true;

    this.dbClickCellContent(this.grid);
    this.doubleClickGrid(this.grid);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    this.grid1.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data['IsTitleRow'] == true) {
            wjcCore.setCss(e.cell, {
              // color: 'red',
              fontWeight: 'bold',
              backgroundColor: '#CCFFFF'
            });
          }
          else
          if (data['ItemNo'] == 'C') {
            wjcCore.setCss(e.cell, {
              // color: 'red',
              fontWeight: 'bold',
              backgroundColor: '#66FFCC'
            });
          }
          else {
            wjcCore.setCss(e.cell, {
              color: '',
              // fontWeight: '',
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

  output: any;
  _errItemSets: boolean = false;
  _errMess: any;

  filesUpload2: File[] = [];
  // isLoading = false;

  async onSubmit(formData: any) {
    try {
        for (let row of this.grid2.itemsSource.sourceCollection) {
          if (row['Data'] != undefined) {
            this.filesUpload2.push(row['Data']);
          }
        }
      }
      catch (e) { }

      await this._service.upLoad(this.filesUpload2, this.editorFrm.controls['ProductCostId'].value.toString() + '\\' + this.folderName, this.editorFrm.controls['IdBizDocCCM'].value.toString()).toPromise().then()

      let params = new Array<ParameterContract>();
      const param1 = new ParameterContract();
      const param2 = new ParameterContract();
  
      param1.ParameterName = Global.convertParameterName('BranchCode');
      param1.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
      params.push(param1);
  
      param2.ParameterName = Global.convertParameterName('IdBizDocCCM');
      param2.ParameterValue = this.editorFrm.controls['IdBizDocCCM'].value.toString();
      params.push(param2);
   
      try {
        let paramXML = new ParameterContract();
        paramXML.ParameterName = this.convertParameterName('B30BizDocDocument');
        paramXML.ParameterValue = 'B30BizDocDocument';
        params.push(paramXML);
        
      
        let ds = Global.getDataSetContract(
          {
            name: 'B30BizDocDocument',
            collection: Global.createColection(this.grid2.itemsSource)
          }
        )
    
        let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Newtecons_UpdateAtch_WhenApprove', params, ds)
          .toPromise().then();

          this.output = <Array<Object>>(_data['output']);
      
          this._errItemSets = this.output['@_Error'];
          this._errMess = this.output['@_ErrorMessage'];
        // this.output = <Array<Object>>(_data['output']);
        // this._errBCTC = this.output['@_Error'];
        // this._errMess = this.output['@_ErrorMessage'];
        // this.dataAdjust = new wjcCore.CollectionView(_data['data'][0]);
        // this.gridAdjust.itemsSource = new wjcCore.CollectionView(_data['data'][0]);
        // this.dataEffective = new wjcCore.CollectionView(_data['data'][1]);
      }
      catch (ex) {
        console.log(ex);
      };

       if (this._errItemSets) {
      alert(this._errMess)
      this.showLoading = true;
    }
    else
    {
      location.reload()
      // console.log(this.parentData['Id'])
      // this.indexPage_Editor.push(this.parentData['Id']);
      // this.router.navigate(['main']).then(() => {
      //   this.router.navigate(this.indexPage_Editor).then(() => {
      //     if (this.indexPage_Editor.length > 3)
      //     this.indexPage_Editor.pop();
      //   })
      // });
    }

      // this.showLoading = true;
      // this.submit(formData, this.indexPage);
  }

  backClick() {
    this._location.back();
  }

  isLoading = false;
  async onClick(state: any, callPrint: boolean = false) {
    if (Global.convertConfig('{VAR=User.Ma_CbNv}') != this.parentData['EmployeeCode'])
      alert("User đăng nhập không đúng với người duyệt!!!");
    else {
      this.isLoading = true;
      this.parentData["ApproveStatus"] = state;
      this.parentData["ApproveStatusWeb"] = state;
      // await this.dfpanel.runConstraint('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(()=>{
      //   setTimeout(() => {
      //     window.close();
      //   }, 1000);
      // });
      this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
        this.sendMail(this.editorFrm, 'P6', this.parentData['IdBizDocCCM'], false, state).then(() => {
          if (callPrint)
            this.exportHtml_WorkFlow('WorkFlow_TT.docx', 'WorkFlow TP.NCC - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=Amount_DeNghiTT_Str}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', this.parentData['IdBizDocCCM'], 'P3', 'DocCode').then(() => { this.router.navigate(['/main', 'notifications', 'index']); });
          else
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
          let p = this._service.dowload(folder, this.parentData['IdBizDocCCM'].toString(), fileName).toPromise();
          p.then(blob => {
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

  showDefaultFile() {
    if (this.gridArray[0].itemsSource.items) {
      // let key = grid.selectedItems[0]['Id'];
      let fileName = this.grid.itemsSource.items[0]['FilePath'] + '.pdf';
      let _description = this.grid.itemsSource.items[0]['Description'];

      var x = document.getElementById("viewfileattach");
      var y = document.getElementById("fileView");
      var z = document.getElementById('htmlShow');

      x.style.display = "block";
      y.style.display = "block";
      z.style.display = "none";

      let folder = "{EXPR=ProductCostId}\\" + this.folderName;

      folder = Global.translateAutoText(folder, this.parentData);

      if (folder && fileName) {
        let p = this._service.dowload(folder, this.parentData['IdBizDocCCM'].toString(), fileName).toPromise();
        p.then(blob => {
          if (fileName.toUpperCase().endsWith('PDF') == true || fileName.toUpperCase().endsWith('JPG') == true || fileName.toUpperCase().endsWith('PNG') == true || fileName.toUpperCase().endsWith('JPEG') == true || fileName.toUpperCase().endsWith('GIF') == true) {
            let url = window.URL.createObjectURL(blob);
            y.setAttribute('data', url);

            // if (y instanceof HTMLIFrameElement)
            //   y.src = _description + "&amp;action=embedview&amp;wdAr=1.7777777777777777";
            // // y.setAttribute('src', _description + "&amp;action=embedview&amp;wdAr=1.7777777777777777");
          }
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
    let html = this.showHtmlEditor(layoutPrint[0]['WordName'], layoutPrint[0]['FileName'], layoutPrint[0]['FolderPath'], this.parentData['IdBizDocCCM']);
    html.then(data => {
      this.showLoading = false;
      document.getElementById('htmlShow').innerHTML = data;
    });

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
