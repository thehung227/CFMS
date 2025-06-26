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
import { LayoutPlanCostOfficeEditor } from "../DeclareLayout";
import { SystemConstants } from "../../../core/common/system.constants";
import { PlanCostOfficePopupEditorComponent } from "../../plancostoffice-popup/plancostoffice-popup-editor/plancostoffice-popup-editor.component";
import { Title } from "@angular/platform-browser";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { Console } from "console";

@Component({
  selector: 'app-plancostoffice-editor-form',
  templateUrl: './plancostoffice-editor.component.html',
  styleUrls: ['./plancostoffice-editor.component.css']
})

export class PlanCostOfficeEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('popupEditorFrm') popupEditorFrm: PlanCostOfficePopupEditorComponent;

  indexPage = ['/main', 'plancostoffice', 'index'];
  folderName = '01.Ke_Hoach_DoanhThu_ChiPhi';
  indexPage_Editor = ['/main', 'plancostoffice', 'detail'];
  output: Array<Object>;
  _errBCTC: boolean = false;
  _errMess: string;

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutPlanCostOfficeEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2];
    this.init();
    // this.grid1.isReadOnly = true;
    this.grid1.allowAddNew = false;
    this.grid2.isReadOnly = true;

    this.dbClickCellContent(this.grid2);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    let _numEror = 0;
    // for (let i in this.gridArray) {
    //   if (this.gridArray[i].itemsSource.items != undefined)
    //     if (isApproveSend == true && this.gridArray[i].itemsSource.items.length == 0 && i != '2') {
    //       _numEror += 1;
    //       break;
    //     }
    // }

    let _errorSave0 = false;
    // for (let item of this.grid.itemsSource.items) {
    //   if (item['OriginalAmount'] < item['AmountPaid'] && item['AmountPaid'] != 0) {
    //     _errorSave0 = true;
    //     break;
    //   }
    // }
    
    let _errorSave1 = false;
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

    this.checkUniqueColGrid(this.grid, 'ItemNo');
    // if (this._errorUnique == false)
      // this.checkUniqueColGridNotIncludedEmpty(this.grid, 'BizDocId_C1', 'DocInfo').then(() => {
       if (this._errorUnique == false) {
          if (_numEror == 0) {
            //if (this.taidulieu == true || this.id > 0) {
            if (_errorSave0 == false) {
              console.log(_errorSave0)
              if (isApproveSend == true) {
                if (_errorSave1 == false) {
                  // this.editorFrm.controls['ApproveSend'].setValue(true);
                  // this.dfpanel.runConstraint('Evaluator_UpdateApproveSend').then();
                  // window.close();
                  // this.checkDuTruHopDong(formData).then(() => {
                  //   if (this._errBCTC == false) {
                      this.submit(formData, this.indexPage, isApproveSend).then(() => {
                        if (this.allowSendMail) {
                          this.sendMail(formData, 'K2', this.id, false, '1');
                        }
                      });
                  //   }
                  //   else {
                  //     alert(this._errMess);
                  //     this.showLoading = false;
                  //   }
                  // });
                }
                else
                  alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
              }
              else
                this.submit(formData, this.indexPage_Editor);
            }
            else
              alert('Giá trị dự trù không được nhỏ hơn giá trị đã thanh toán');
            //}
            //else
            //  alert('Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu chi tiết."');
          }
          else {
            alert('Các Tab dữ liệu (Chi tiết, Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có) hoặc điền đầy đủ thông tin.');
          }
        }
      };
  

  async checkUniqueColGridNotIncludedEmpty(flex: wjcGrid.FlexGrid, field: string, fieldWarning?: string) {
    if (flex) {
      let _arr: any = flex.itemsSource.items;

      this._errorUnique = false;

      for (let i = 0; i < _arr.length; i++) {
        
        for (let j = i + 1; j < _arr.length; j++) {

          if (_arr[i][field] != '' && _arr[j][field] != '' && _arr[i][field] != undefined && _arr[j][field] != undefined) {
            if (wjcCore.asString(_arr[i][field]).trim()  != 'N0100000004237C3')
            if (_arr[i][field] == _arr[j][field]) {
              this._errorUnique = true;
              this._valueDuplicate = _arr[i][field] + ': ' + _arr[i][fieldWarning];
              break;
            }
          
          }
        }
        if (this._errorUnique == true) break;
      }
    }
  }

  // async checkDuTruHopDong(formData: any) {
  //   this.showLoading = true;
  //   let params = new Array<ParameterContract>();
  //   const param1 = new ParameterContract();
  //   const param2 = new ParameterContract();
  //   const param3 = new ParameterContract();

  //   param1.ParameterName = Global.convertParameterName('ProductCostId');
  //   param1.ParameterValue = formData.value['ProductCostId'];
  //   params.push(param1);

  //   param2.ParameterName = Global.convertParameterName('BranchCode');
  //   param2.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
  //   params.push(param2);

  //   param3.ParameterName = Global.convertParameterName('Id');
  //   param3.ParameterValue = this.id;
  //   params.push(param3);

  //   let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_CTC_CheckHopDongKhongDuTruBCTC', params)
  //     .toPromise().then();

  //   this.output = <Array<Object>>(_data['output']);
  //   this._errBCTC = this.output['@_Error'];
  //   this._errMess = this.output['@_ErrorMessage'];
  // }

  async showPopup(row: any, form: any) {

    localStorage.removeItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE);
    localStorage.setItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE, row.dataItem['Id']);
    this.popupEditorFrm.setId();
    await this.popupEditorFrm.setupDataSource();
    await this.popupEditorFrm.onInitialComplete();
    form.show(true);

  }

  deleteSelectedRows(flex: wjcGrid.FlexGrid) {
    this.dfpanel.runConstraint('Evaluator_ServerConstraint_Check_ApproveSent_NotChange').then();
    if (flex) {
      var selected = [];

      for (let k in flex.selectedRows) {
        let _idrowdel = flex.selectedRows[k]._idx;
        if (flex.selectedRows[k].dataItem != undefined) {
          let _InheritanceRowId = '';
          for (var i = 0; i < flex.rows.length; i++) {
            if (i == _idrowdel && (_InheritanceRowId == '' || _InheritanceRowId == null || _InheritanceRowId == undefined)) {
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
