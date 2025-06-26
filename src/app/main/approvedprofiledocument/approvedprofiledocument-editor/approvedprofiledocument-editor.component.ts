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
import { LayoutApprovedProfileDocumentEditor } from "../Layout";
import { Global } from "../../../shared/global";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { SystemConstants } from "../../../core/common/system.constants";
import { Console } from "console";

@Component({
  selector: 'app-approvedprofiledocument-editor-form',
  templateUrl: './approvedprofiledocument-editor.component.html',
  styleUrls: ['./approvedprofiledocument-editor.component.css']
})

export class ApprovedProfileDocumentEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'profiledocument', 'index'];
  folderName = 'Bao_Cao_Tai_Chinh';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedProfileDocumentEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2];
    this.init().then(() => {
      this.showDefaultFile();
    });
    this.grid.isReadOnly = false;
    this.grid1.isReadOnly = true;
    this.grid2.isReadOnly = true;

    this.dbClickCellContent(this.grid2);
    this.doubleClickGrid(this.grid);

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
     
     if (this.filesUpload2.length > 0)
        await this._service.upLoad(this.filesUpload2, this.editorFrm.controls['ProductCostId'].value.toString() + '\\' + this.folderName, this.parentData['IdBizDocVB']).toPromise().then();
   
      let params = new Array<ParameterContract>();
      const param1 = new ParameterContract();
  
      param1.ParameterName = Global.convertParameterName('BranchCode');
      param1.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
      params.push(param1);
   
      try {
        let paramXML = new ParameterContract();
        paramXML.ParameterName = this.convertParameterName('B30BizDocDocument');
        paramXML.ParameterValue = 'B30BizDocDocument';
        params.push(paramXML);
  
        let ds = Global.getDataSetContract(
          {
            name: 'B30BizDocDocument',
            collection: this.grid.itemsSource.items
          }
        )
  
        let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Newtecons_UpdateAtch_WhenApprove', params, ds)
          .toPromise().then();
  
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

      this.showLoading = true;
      this.parentData["ApproveStatus"] = state;
      this.parentData["ApproveStatusWeb"] = state;

      this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
       
        this.sendMail(this.editorFrm, 'FR', this.parentData['IdBizDocVB'], false, state).then(() => {
          
          this.router.navigate(['/main', 'notifications', 'index']);
        });
      });
    }
  }

  async doubleClickGrid(grid: wjcGrid.FlexGrid) {
    grid.addEventListener(grid.hostElement, 'click', (e) => {
      
      if (grid.selectedItems[0]) {
        // let key = grid.selectedItems[0]['Id'];
        let fileName = grid.selectedItems[0]['FilePath'] + '.pdf';
        let _description = grid.selectedItems[0]['Description'];

        var x = document.getElementById("viewfileattach");
        var y = document.getElementById("fileView");
        var z = document.getElementById('htmlShow');
        var w = document.getElementById('fileViewInfo');

        x.style.display = "block";
        y.style.display = "block";
        z.style.display = "none";
        w.style.display = "none";
        
        let folder = "{EXPR=ProductCostId}\\" + this.folderName;

        folder = Global.translateAutoText(folder, this.parentData);

        // window.open(_description);
        
        if (folder && fileName) {
          let p = this._service.dowload(folder, this.parentData['IdBizDocVB'].toString(), fileName).toPromise();
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
        let p = this._service.dowload(folder, this.parentData['IdBizDocVB'].toString(), fileName).toPromise();
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
