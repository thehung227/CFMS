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
import { LayoutApprovedCreditContractEditor } from "../Layout";
import { Global } from "../../../shared/global";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { SystemConstants } from "../../../core/common/system.constants";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { Console } from "console";

@Component({
  selector: 'app-approvedcreditcontract-editor-form',
  templateUrl: './approvedcreditcontract-editor.component.html',
  styleUrls: ['./approvedcreditcontract-editor.component.css']
})

export class ApprovedCreditContractEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  // @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'solinv', 'index'];
  folderName = 'Hop_Dong_Han_Muc_Tin_Dung';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedCreditContractEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1];
    this.init().then(() => {
      this.showDefaultFile();
    });
    this.grid.isReadOnly = true;
    this.grid1.isReadOnly = true;
    // this.grid2.isReadOnly = true;

    // this.dbClickCellContent(this.grid2);
    this.doubleClickGrid(this.grid);

  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    // this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

    //   if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
    //     let data = s.rows[e.row].dataItem;

    //     if (e.panel.cellType == wjcGrid.CellType.Cell) {
    //       if (data['RowId_Import'] == '' || data['RowId_Import'] == null) {
    //         wjcCore.setCss(e.cell, {
    //           color: 'red'
    //         });
    //       }
    //       else {
    //         wjcCore.setCss(e.cell, {
    //           color: '',
    //           // fontWeight: '',
    //           // backgroundColor: ''
    //         });
    //       }
    //     }
    //   }
    // });
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

  output: any;
  _errItemSets: boolean = false;
  _errMess: any;

  filesUpload2: File[] = [];
  isLoading = false;
  async onClick(state: any, callPrint: boolean = false) {
    let txt;
    if (state == 0) txt = 'Trả lại';
    else
      if (state == 1) txt = 'Duyệt';
      else
        if (state == 3) txt = 'Đề xuất trả';

    let r = confirm("Xác nhận thao tác: " + txt.toUpperCase());

    if (r == true) {
      // try {
      //   for (let row of this.grid.itemsSource.sourceCollection) {
      //     if (row['Data'] != undefined) {
      //       this.filesUpload2.push(row['Data']);
      //       ;
      //     }
      //   }
      // }
      // catch (e) { }
      // let params = new Array<ParameterContract>();
      // const param1 = new ParameterContract();
      // const param2 = new ParameterContract();
      // const param3 = new ParameterContract();

      // let _value = this.editorFrm.controls['DocDate2'].value;
      // if (_value instanceof Date) {
      //   _value = _value.toISOString();
      //   param1.ParameterName = Global.convertParameterName('DocDate2');
      //   param1.ParameterValue = _value;
      //   params.push(param1);
      // }

      // param2.ParameterName = Global.convertParameterName('Stt');
      // param2.ParameterValue = this.editorFrm.controls['Stt'].value.toString();
      // params.push(param2);

      // try {
      //   // let paramXML = new ParameterContract();
      //   // paramXML.ParameterName = this.convertParameterName('B30BizDocApprove');
      //   // paramXML.ParameterValue = 'B30BizDocApprove';
      //   // params.push(paramXML);

      //   let ds = Global.getDataSetContract()
      //   //   {
      //   //     name: 'B30BizDocApprove',
      //   //     collection: Global.createColection(this.grid.itemsSource)
      //   //   }
      //   // )

      //   let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Update_EmployeeCodeNext_WhenApprove', params, ds)
      //     .toPromise().then();

      //   this.output = <Array<Object>>(_data['output']);
      //   this._errItemSets = this.output['@_Error'];
      //   this._errMess = this.output['@_ErrorMessage'];
      // }
      // catch (ex) {
      //   console.log(ex);
      // }

      // if (this._errItemSets && this.parentData['PositionCode'] == 'CB-005') {
      //   alert('Yêu cầu cập nhật người duyệt chỉ định tiếp theo!!!')
      //   this.showLoading = true;
      // }
      // else {
      this.showLoading = true;
      this.parentData["ApproveStatus"] = state;
      this.parentData["ApproveStatusWeb"] = state;

      this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
        if (this.parentData["CompleteApprove"]) {
          this.sendMail(this.editorFrm, 'C8', this.parentData['IdBizDoc'], false, state).then(() => {
            // if (callPrint)
            //   this.exportHtml_WorkFlow('WorkFlow_YeuCauXuatHoaDon.docx', 'WorkFlow Hóa đơn - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', this.parentData['IdAccDoc'], 'HD', 'DocCode').then(() => { this.router.navigate(['/main', 'notifications', 'index']); });
            // else
            this.router.navigate(['/main', 'notifications', 'index'])
          })
        }
        else 
          this.router.navigate(['/main', 'notifications', 'index'])
      });
      // });
    // }
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
     
      let p = this._service.dowload(folder, this.parentData['IdBizDoc'].toString(), fileName).toPromise();
   
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
