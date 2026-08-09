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
import { LayoutApprovedSettlementEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { Global } from "../../../shared/global";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { Popup } from "wijmo/wijmo.input";

@Component({
  selector: 'app-approvedsettlement-editor-form',
  templateUrl: './approvedsettlement-editor.component.html',
  styleUrls: ['./approvedsettlement-editor.component.css']
})

export class ApprovedSettlementEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
    @ViewChild('dataPopup') dataPopup: Popup;
  
  indexPage_Editor = ['/main', 'approvedsettlement', 'detail'];
  indexPage = ['/main', 'settlement', 'index'];
  folderName = '04.Quyet_Toan_Hop_Dong';

 dataPopupContent: any = null;

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedSettlementEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4];
    this.init();
    this.grid.isReadOnly = true;
    this.grid.allowAddNew = false;
    this.grid2.isReadOnly = true;
    
    this.grid3.isReadOnly = true;

    this.doubleClickGrid(this.grid3);
    this.dbClickCellContent(this.grid);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
      // Render cột HrefLink thành nút bấm mở link trên tab mới
          this.grid4.formatItem.addHandler((s: wjcGrid.FlexGrid, e: wjcGrid.FormatItemEventArgs) => {
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
    //this.wordWrapGrid();
  }

  ngOnDestroy() {
    this.destroy();
  }

onSubmit(formData: any) {
    this.submit(formData, this.indexPage_Editor);
  }

  backClick() {
    this._location.back();
  }

  isLoading = false;
  async onClick(state: any) {
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
        this.sendMail(this.editorFrm, 'C5', this.parentData['IdBizDoc'], false, state).then(() => {
          this.router.navigate(['/main', 'notifications', 'index']);
        });
      });
      // this.backClick();
    }
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
      _data = await this._service.postData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_CFMS_AutoCreateAccountDocument_Bill', params)
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

  async onClick_2(state?: any) {
    try {
      this.showDialog = false;//Thêm dialog

      if (this.editorFrm.valid) {
        this.showLoading = true;
        this.taidulieu = true;
      }

      for (let command of this._layoutDeclare.buttonLoadChild) {
        if (this.editorFrm.valid)
          await this.dfpanel.runConstraint(command).then();
      }

      this.showLoading = false;
    }
    catch (ex) {
         console.log(ex);
      alert("Load dữ liệu thành công");
   
      this.showLoading = false;
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
  showDocumentInNewTab(id: any) {
    //exportHtml(layoutPrint.WordName,layoutPrint.FileName, layoutPrint.FolderPath, parentData?.Id_TT)
    let _command = this._layoutDeclare.layout.PrintDocument.Command;
    let _wordName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].WordName;
    let _folderPath = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].FolderPath;
    let _fileName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].FileName;

    let params = { 'command': _command, 'wordName': _wordName, 'folderPath': _folderPath, 'fileName': _fileName, 'id': id };
    let navigateUrl: any = ['#/main', 'documentview', 'detail', encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)))];
    window.open(navigateUrl.join('/'));
  }

  showDocumentInNewTab1(id: any) {
    //exportHtml(layoutPrint.WordName,layoutPrint.FileName, layoutPrint.FolderPath, parentData?.Id_TT)
    let _command = this._layoutDeclare.layout.PrintDocument.Command_TongHop;
   
    let _wordName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[1].WordName;
    let _folderPath = this._layoutDeclare.layout.PrintDocument.LayoutPrint[1].FolderPath;
    let _fileName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[1].FileName;
    console.log(_wordName)
    let params = { 'command': _command, 'wordName': _wordName, 'folderPath': _folderPath, 'fileName': _fileName, 'id': id };
    let navigateUrl: any = ['#/main', 'documentview', 'detail', encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)))];
    window.open(navigateUrl.join('/'));
  }
}
