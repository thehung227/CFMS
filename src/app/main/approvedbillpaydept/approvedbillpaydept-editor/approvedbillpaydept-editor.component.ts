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
import { LayoutApprovedBillPayDeptEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { Global } from "../../../shared/global";
import { Popup } from "wijmo/wijmo.input";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-approvedbillpaydept-editor-form',
  templateUrl: './approvedbillpaydept-editor.component.html',
  styleUrls: ['./approvedbillpaydept-editor.component.css']
})

export class ApprovedBillPayDeptEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('dataPopup') dataPopup: Popup;


  indexPage = ['/main', 'billpaydept', 'index'];
  folderName = '08.Thanh_Toan_BCH';
  dataPopupContent: any = null;
  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedBillPayDeptEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();
    this.grid.isReadOnly = true;
    this.grid1.isReadOnly = true;
    this.grid.allowAddNew = false;
    this.grid1.allowAddNew = false;
    this.grid2.allowAddNew = false;
    this.grid3.isReadOnly = true;

    this.dbClickCellContent(this.grid);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    this.grid1.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {
    
          if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
            let data = s.rows[e.row].dataItem;
    
            if (e.panel.cellType == wjcGrid.CellType.Cell) {
                      if (data['IsTitleRow'] == true) {
                        wjcCore.setCss(e.cell, {
                          color: '',
                          fontWeight: 'bold',
                           backgroundColor: '#CCF381'
                        });
                      }
                      else {
                        wjcCore.setCss(e.cell, {
                          color: '',
                          fontWeight: '',
                          backgroundColor: ''
                        });
                      }
                    }
          }
        });
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

output: any;
  _err: boolean = false;
  _errMess: any;
  _errItemSets: boolean = false;

async saveData(formData: any,state: any) {
    this.showLoading = true;
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('BizDocId');
    param1.ParameterValue = this.parentData['BizDocId'];
    params.push(param1);

    param2.ParameterName = Global.convertParameterName('EmployeeCodeBill');
    param2.ParameterValue = this.editorFrm.controls['EmployeeCode'].value.toString();
    params.push(param2);

    param3.ParameterName = Global.convertParameterName('ProductCostId');
    param3.ParameterValue = this.editorFrm.controls['ProductCostId'].value.toString();
    params.push(param3);



    let _data: any = null;

    try {
      _data = await this._service.postData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_CFMS_AutoCreateAccountDocument_BCH', params)
      .toPromise().then();
    
      this.output = <Array<Object>>(_data['output']);
   
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
       const output = _data && _data.output ? _data.output : _data;
      // Lấy phần tử đầu tiên nếu output là mảng
      // if (Array.isArray(output) && output.length > 0) {
      //   this.dataPopupContent = output[0]; // 👈 lấy hóa đơn đầu tiên
      // } else {
      //   this.dataPopupContent = output || _data;
      // }
      this.dataPopupContent = _data;

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
        this.sendMail(this.editorFrm, 'P3', this.parentData['IdBizDocCCM'], false, state).then(() => {
          if (callPrint)
            this.exportHtml_WorkFlow('WorkFlow_TT.docx', 'WorkFlow TP.NCC - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=Amount_DeNghiTT_Str}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', this.parentData['IdBizDocCCM'], 'P3', 'DocCode').then(() => { this.router.navigate(['/main', 'notifications', 'index']); });
          else
            this.router.navigate(['/main', 'notifications', 'index']);
        });
      });
      // this.backClick();    
    }
  }

  showDocumentInNewTab(id: any) {
    //exportHtml(layoutPrint.WordName,layoutPrint.FileName, layoutPrint.FolderPath, parentData?.IdBizDocCCM)
    let _command = this._layoutDeclare.layout.PrintDocument.Command;
    let _wordName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].WordName;
    let _folderPath = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].FolderPath;
    let _fileName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].FileName;

    let params = { 'command': _command, 'wordName': _wordName, 'folderPath': _folderPath, 'fileName': _fileName, 'id': id };
    let navigateUrl: any = ['#/main', 'documentview', 'detail', encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)))];
    window.open(navigateUrl.join('/'));
  }
}
