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
import { LayoutUNCEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { Location } from "../../../../../node_modules/@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { SystemConstants } from "../../../core/common/system.constants";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-unc-editor-form',
  templateUrl: './unc-editor.component.html',
  styleUrls: ['./unc-editor.component.css']
})

export class UNCEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'unc', 'index'];
  indexPage_Editor = ['/main', 'unc', 'detail'];
  folderName = 'Uy_Nhiem_Chi';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutUNCEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();
    this.grid.isReadOnly = true;
    this.grid2.allowAddNew = false;
    this.grid3.isReadOnly = true;

    this.dbClickCellContent(this.grid3);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data['RowId_Import'] == '' || data['RowId_Import'] == null) {
            wjcCore.setCss(e.cell, {
              color: 'red'
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

  backClick() {
    this._location.back();
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any, isApproveSend?: boolean, isClose?: boolean) {
    let _errorSave1: Boolean = false;
    let _errorSave2: Boolean = false;
    let _numEror = 0;

    for (let i in this.gridArray) {
      if (this.gridArray[i].itemsSource.items.length == 0 && (i == '1' || i == '2')) {
        _numEror += 1;
        break;
      }
    }

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

    for (let item of this.grid1.itemsSource.items) {
      if ((item['FilePath'] == '' || item['FilePath'] == undefined) && item['FilePath'] == 1) {
        _errorSave2 = true;
        break;
      }
    }

    if (_numEror == 0) {
      if (isApproveSend == true) {
        if (_errorSave1 == false) {
          if (_errorSave2 == false) {
            this.submit(formData, this.indexPage, isApproveSend).then(() => {
              if (this.allowSendMail) {
                this.sendMail(formData, 'BN', this.id, false, '1');
              }
            });
          }
          else
            alert('Đính kèm đầy đủ hồ sơ được yêu cầu khi gửi duyệt');
        }
        else
          alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
      }
      else
          this.submit(formData, this.indexPage_Editor);
    }
    else
      alert('Tài liệu đính kèm và Bước duyệt, vui lòng nhập đầy đủ dữ liệu để lưu.');
  }

  showDocumentInNewTab(bizdocid: string) {
    let id = bizdocid.substring(3, bizdocid.length - 2);
    let _command = 'usp_B30BizDoc_VoucherForm';
    let _wordName = 'BM-F006a-Rev01 Don Dat Hang.docx';
    let _folderPath = '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/';
    let _fileName = 'Đơn hàng mua';

    let params = { 'command': _command, 'wordName': _wordName, 'folderPath': _folderPath, 'fileName': _fileName, 'id': id };
    let navigateUrl: any = ['#/main', 'documentview', 'detail', encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)))];
    window.open(navigateUrl.join('/'));
  }

  exportHtmlWorkFlow(input: any, extInput?: string) {
    if (this.parentData["CompletedApprove"] == false) {
      alert('Hồ sơ chưa hoàn thiện duyệt, không thể in ấn workflow');
      return;
    }
    else
      this.exportHtml_WorkFlow('WorkFlow_YeuCauXuatHoaDon.docx', 'WorkFlow Invoice - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }

  deleteSelectedRows(flex: wjcGrid.FlexGrid) {
    if (flex) {
      var selected = [];
      for (let k in flex.selectedRows) {
        let _idrowdel = flex.selectedRows[k]._idx;

        if (flex.selectedRows[k].dataItem != undefined) {
          for (var i = 0; i < flex.rows.length; i++) {
            if (i == _idrowdel && i > 0) {
              selected.push(flex.rows[i].dataItem);
              break;
            }
          }
        }
      }

      for (var i = 0; i < selected.length; i++) {
        flex.itemsSource.remove(selected[i]);
      }
    }
  }
}
