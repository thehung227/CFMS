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
import { LayoutPurchasingNoteEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { Location } from "../../../../../node_modules/@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";

@Component({
  selector: 'app-purchasingnote-editor-form',
  templateUrl: './purchasingnote-editor.component.html',
  styleUrls: ['./purchasingnote-editor.component.css']
})

export class PurchasingNoteEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'purchasingnote', 'index'];
  indexPage_Editor = ['/main', 'purchasingnote', 'detail'];
  folderName = '10.Phieu_Nhap_Hang';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutPurchasingNoteEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();
    this.grid1.allowAddNew = false;
    this.grid2.allowAddNew = false;
    this.grid3.allowAddNew = true;
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

  }

  backClick() {
    this._location.back();
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any, isApproveSend?: boolean, closePO?: boolean) {

    let _errDanhGia: Boolean = false;
    let _errRemark: Boolean = false;
    let _errDes: Boolean = false;
    let _errorSave1: Boolean = false;
    let _numEror = 0;

    for (let item of this.grid2.itemsSource.items) {
      if (item['Bad'] == false && item['Star2'] == false && item['Normal'] == false && item['Star4'] == false && item['Good'] == false) {
        _errDanhGia = true;
        break;
      }
    }

    for (let item of this.grid2.itemsSource.items) {
      if ((item['Bad'] == true || item['Star2'] == true) && item['Normal'] == false && item['Star4'] == false && item['Good'] == false && (item['Remark'] == '' || item['Remark'] == undefined)) {
        _errRemark = true;
        break;
      }
    }

    if (this.grid.itemsSource.items.length > 0) {
      for (let item of this.grid.itemsSource.items) {
        if (item['Description'] == '' || item['Description'] == undefined) {
          _errDes = true;
          break;
        }
      }
    }
    else
      _errDes = true;


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

    if (this.gridArray[3].itemsSource.items.length == 0) {
      _numEror += 1;
    }

    if (_errDes == false) {
      if (_numEror == 0) {
        if (_errRemark == false) {
          if (isApproveSend == true) {
            if (_errorSave1 == false) {
              this.submit(formData, this.indexPage, isApproveSend).then(() => {
                if (this.allowSendMail) {
                  this.getInfoTemplateMail(formData, this.id);
                }
              });
            }
            else
              alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
          }
          else
            if (closePO == true) {
              this.submit(formData, this.indexPage_Editor).then(() => {
                this.dfpanel.runConstraint('Evaluator_ServerUpdating_UpdateStatusByApproveStatus');
              });
            }
            else
              this.submit(formData, this.indexPage_Editor);
        }
        else
          alert('Yêu cầu nhập Diễn giải khi đánh giá 1 sao hoặc 2 sao');
      }
      else
        alert('Yêu cầu chọn "Tải đơn hàng" để lấy dữ liệu chi tiết đơn hàng.');
    }
    else
      alert('Dữ liệu đính kèm cần ít nhất 1 dòng để lưu hoặc Tên tài liệu không được bỏ trắng.')
  }

  // isLoading = false;
  // async onClick(formData: any) {
  //   this.isLoading = true;
  //   this.dfpanel.runConstraint('Evaluator_ServerUpdating_UpdateStatusByApproveStatus');
  //   //this.getInfoTemplateMail(formData, this.id).then(() => {
  //   this.router.navigate(this.indexPage);
  //   //});
  // }

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

  deleteSelectedRows(flex: wjcGrid.FlexGrid) {
    if (flex) {
      // get list of selected items
      var selected = [];

      //let _idrowdel = flex.selectedRows[0]._idx;

      for (let k in flex.selectedRows) {
        let _idrowdel = flex.selectedRows[k]._idx;
        for (var i = 0; i < flex.rows.length; i++) {
          if (i == _idrowdel) {
            selected.push(flex.rows[i].dataItem);
            break;
          }
        }
      }

      // delete the selected items
      for (var i = 0; i < selected.length; i++) {
        //deleteRowFromDatabase(selected[i]);
        flex.itemsSource.remove(selected[i]);
      }
    }
  }

}
