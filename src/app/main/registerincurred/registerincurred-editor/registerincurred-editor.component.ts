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
import { LayoutRegisterIncurredEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";

import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { SystemConstants } from "../../../core/common/system.constants";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";

@Component({
  selector: 'app-registerincurred-editor-form',
  templateUrl: './registerincurred-editor.component.html',
  styleUrls: ['./registerincurred-editor.component.css']
})

export class RegisterIncurredEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'registerincurred', 'index'];
  indexPage_Editor = ['/main', 'registerincurred', 'detail'];
  folderName = 'Phat_Sinh_CDT';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutRegisterIncurredEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();
    this.grid2.allowAddNew = false;
    this.grid3.allowAddNew = false;
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
    this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data['IsTitleRow'] == true) {
            wjcCore.setCss(e.cell, {
              color: 'blue',
              fontWeight: 'bold',
              backgroundColor: '#f8f1e6'
            });
          } else if (data['_FormatStyleKey'] == 'BOLD') {
            wjcCore.setCss(e.cell, {
              fontWeight: 'bold',
              backgroundColor: ''
            });
          }
          else if (data['_FormatStyleKey'] == 'Subtotal0') {
            wjcCore.setCss(e.cell, {
              fontWeight: 'bold',
              backgroundColor: '#fdf5e6'
            });
          }
          else if (data['_FormatStyleKey'] == 'GrandTotal') {
            wjcCore.setCss(e.cell, {
              fontWeight: 'bold',
              backgroundColor: '#fafad2'
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
  }

  output: any;
  _err: boolean = false;
  _errMess: any;

  async checkData(formData: any) {
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('Id');
    param1.ParameterValue = this.id;
    params.push(param1);

    try {
      let paramXML = new ParameterContract();
      paramXML.ParameterName = this.convertParameterName('B30RegisterIncurred');
      paramXML.ParameterValue = 'B30RegisterIncurred';
      params.push(paramXML);

      let ds = Global.getDataSetContract(
        {
          name: 'B30RegisterIncurred',
          collection: Global.createColection(this.grid.itemsSource)
        }
      )
      let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_B30RegisterIncurred_CheckData', params, ds)
        .toPromise().then();

      this.output = <Array<Object>>(_data['output']);
      this._err = this.output['@_Error'];
      this._errMess = this.output['@_ErrorMessage'];
    }
    catch (ex) {
      console.log(ex);
    }
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    let _numEror = 0;
    // for (let i in this.gridArray) {
    if ((this.gridArray[0].itemsSource.items.length == 0) || (this.gridArray[1].itemsSource.items.length == 0) || (this.gridArray[2].itemsSource.items.length == 0)) {
      _numEror += 1;
    }
    // }

    let _errorSave = false;
    for (let item of this.grid1.itemsSource.items) {
      if (item['Attached'] == true && (item['FilePath'] == '' || item['FilePath'] == undefined)) {
        _errorSave = true;
        break;
      }
    }

    let _errorSave1 = false;
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
    console.log(isApproveSend)
    if (isApproveSend == true) {
      this.checkData(formData).then(() => {
        if (this._err == false) {
          if (_numEror == 0) {

            if (_errorSave == false) {
              if (_errorSave1 == false) {
                this.submit(formData, this.indexPage, isApproveSend).then(() => {
                  if (this.allowSendMail) {
                    this.sendMail(formData, 'I3', this.id, false, '1');
                  }
                });
              }
              else
                alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
            }
            else
              alert('Yêu cầu đính kèm tài liệu trước khi gửi duyệt!');
          }

          else
            alert('Các Tab dữ liệu (Tài liệu đính kèm, Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu cập nhật đầy đủ thông tin.');
        }
        else {
          alert(this._errMess);
          this.showLoading = false;
        }

      })
    }
    else
      this.submit(formData, this.indexPage_Editor);
  };


showPrintVoucher(input: any) {
  let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  let html = this.printVoucher(input);

  html.then(data => {
    popupWin.document.write(data);
    popupWin.document.close();
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

ngOnDestroy() {
  this.destroy();
}
}
