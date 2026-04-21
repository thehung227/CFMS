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
import { LayoutConcreteLossEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-concreteloss-editor-form',
  templateUrl: './concreteloss-editor.component.html',
  styleUrls: ['./concreteloss-editor.component.css']
})

export class ConcreteLossEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'concreteloss', 'index'];
  indexPage_Editor = ['/main', 'concreteloss', 'detail'];
  folderName = 'Hao_Hut_Be_Tong';
  folderNameSendMail = 'Hao_Hut_Be_Tong'

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutConcreteLossEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();

    this.grid1.allowAddNew = false;
    this.grid3.isReadOnly = true;
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
    
    this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let column = e.panel.columns[e.col].binding;
        let data = s.rows[e.row].dataItem;
        
        // if (e.panel.cellType == wjcGrid.CellType.Cell) {
        //           if (data["IsTitleRow"] == true) {
        //             wjcCore.setCss(e.cell, {
        //               color: "red",
        //               fontWeight: "",
        //               backgroundColor: "",
        //             });
        //           } else {
        //             wjcCore.setCss(e.cell, {
        //               color: "",
        //               fontWeight: "",
        //               backgroundColor: "",
        //             });
        //           }
        //         }

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (column == 'QuantityTTCDT') {
            wjcCore.setCss(e.cell, {
              color: 'red',
              fontWeight: 'bold',
              backgroundColor: ''
            });
          }
          else
            if (column == 'QuantityCDT') {
              wjcCore.setCss(e.cell, {
                color: 'red',
                fontWeight: 'bold',
                backgroundColor: ''
              });
            }
          else
            if (column == 'Quantity1') {
              wjcCore.setCss(e.cell, {
                color: 'red',
                fontWeight: 'bold',
                backgroundColor: ''
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

  backClick() {
    this._location.back();
  }

  ngOnDestroy() {
    this.destroy();
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
      paramXML.ParameterName = this.convertParameterName('B30BizDocDetail');
      paramXML.ParameterValue = 'B30BizDocDetail';
      params.push(paramXML);

      let ds = Global.getDataSetContract(
        {
          name: 'B30BizDocDetail',
          collection: Global.createColection(this.grid3.itemsSource)
        }
      )
      let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_B30BizDocDetail_CheckD3', params, ds)
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
    let _errorSave0: boolean = false;
    for (let i in this.gridArray) {
      if (this.gridArray[i].itemsSource.items.length == 0 && i != '2' && i != '3') {
        _errorSave0 = true;
        break;
      }
    }

    let _errorSave1: boolean = false;
    for (let item of this.grid1.itemsSource.items) {
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

    let _errorSave2 = false;
    for (let item of this.grid2.itemsSource.items) {
      if (item['Description'] == '' || item['Description'] == undefined || item['FilePath'] == '' || item['FilePath'] == undefined) {
        _errorSave2 = true;
        break;
      }
    }

    if (isApproveSend == true) {
      this.checkData(formData).then(() => {
        if (this._err == false) {
          if (_errorSave0 == false) {
            if (_errorSave1 == false) {
              if (_errorSave2 == false) {
                this.submit(formData, this.indexPage, isApproveSend).then(() => {
                  if (this.allowSendMail) {
                    this.sendMail(formData, 'D3', this.id, false, '1');
                  }
                });
              }
              else
                alert('Tài liệu đính kèm không được bỏ trống.');
            }
            else
              alert('Không được bỏ trống nhân sự duyệt hồ sơ.');
          }
          else
            alert('Dữ liệu (Chi tiết đơn hàng, Bước duyệt) cần ít nhất 1 dòng để thực hiện.');
        }
        else {
          alert(this._errMess);
          this.showLoading = false;
        }
      })
    }
    else
      this.submit(formData, this.indexPage_Editor);
  }

protected deleteSelectedRows(flex: wjcGrid.FlexGrid) {
      if (flex) {
        // get list of selected items
        var selected = [];
  
        for (let k in flex.selectedRows) {
          let _idrowdel = flex.selectedRows[k]._idx;
          for (var i = 0; i < flex.rows.length; i++) {
            if (i == _idrowdel) {
              let data = flex.rows[i].dataItem;
              // Không xóa những dòng là tiêu đề
              if (data && (data['IsGiftItem'] == true || data['IsGiftItem'] == 1 || data['IsGiftItem'] == 1)) {
                continue;
              }
              selected.push(data);
              break;
            }
          }
        }
  
        for (var i = 0; i < selected.length; i++) {
          flex.itemsSource.remove(selected[i]);
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
