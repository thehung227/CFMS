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
import { LayoutFinancialReportEditor } from "../DeclareLayout";
import { SystemConstants } from "../../../core/common/system.constants";

import { Title } from "@angular/platform-browser";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { Console } from "console";

@Component({
  selector: 'app-financialreport-editor-form',
  templateUrl: './financialreport-editor.component.html',
  styleUrls: ['./financialreport-editor.component.css']
})

export class FinancialReportEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  

  indexPage = ['/main', 'financialreport', 'index'];
  folderName = '01.Ke_Hoach_DoanhThu_ChiPhi';
  indexPage_Editor = ['/main', 'financialreport', 'detail'];
  output: Array<Object>;
  _errBCTC: boolean = false;
  _errMess: string;

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutFinancialReportEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4];
    this.init();
    // this.grid1.isReadOnly = true;
    this.grid1.allowAddNew = false;
    
    this.grid2.isReadOnly = true;
    this.grid3.isReadOnly = true;

    this.dbClickCellContent(this.grid2);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

  }

  ngOnDestroy() {
    this.destroy();
  }

async onClick_2(state?: any) {
    try {
      this.showDialog = false;//Thêm dialog

      if (this.editorFrm.valid) {
        this.showLoading = true;
        this.taidulieu = true;
      }

      for (let command of this._layoutDeclare.buttonLoadChild2) {
        if (this.editorFrm.valid)
          await this.dfpanel.runConstraint(command).then();
      }

      this.showLoading = false;
    }
    catch (ex) {
      alert("Xảy ra lỗi trong quá trình thực hiện");
      console.log(ex);
      this.showLoading = false;
    }
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    let _numEror = 0;
    for (let i in this.gridArray) {
      if (this.gridArray[i].itemsSource.items != undefined)
        if (isApproveSend == true && this.gridArray[i].itemsSource.items.length == 0 && i != '2') {
          _numEror += 1;
          break;
        }
    }

    let _errorSave0 = false;
    // for (let item of this.grid.itemsSource.items) {
    //   if (item['OriginalAmount'] < item['AmountPaid'] && item['AmountPaid'] != 0) {
    //     _errorSave0 = true;
    //     break;
    //   }
    // }

    let _errorSave1 = false;
    // for (let item of this.grid1.itemsSource.items) {
    //   if (item['EmployeeCode'] == '') {
    //     _errorSave1 = true;
    //     break;
    //   }
    //   else
    //     if (item['EmployeeCode'].toString().indexOf(',') > 0 && item['EmployeeCodeReal'] == '') {
    //       _errorSave1 = true;
    //       break;
    //     }
    // }

    // this.checkUniqueColGrid(this.grid, 'ItemNo');
    // if (this._errorUnique == false)
    //   this.checkUniqueColGridNotIncludedEmpty(this.grid, 'BizDocId_C1', 'DocInfo').then(() => {
    //     if (this._errorUnique == false) {
    //       if (_numEror == 0) {
    //         //if (this.taidulieu == true || this.id > 0) {
    //         if (_errorSave0 == false) {
    //           if (isApproveSend == true) {
    //             if (_errorSave1 == false) {
    //               // this.editorFrm.controls['ApproveSend'].setValue(true);
    //               // this.dfpanel.runConstraint('Evaluator_UpdateApproveSend').then();
    //               // window.close();
    //               this.checkDuTruHopDong(formData).then(() => {
    //                 if (this._errBCTC == false) {
    //                   this.submit(formData, this.indexPage, isApproveSend).then(() => {
    //                     if (this.allowSendMail) {
    //                       this.sendMail(formData, 'K2', this.id, false, '1');
    //                     }
    //                   });
    //                 }
    //                 else {
    //                   alert(this._errMess);
    //                   this.showLoading = false;
    //                 }
    //               });
    //             }
    //             else
    //               alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
    //           }
    //           else
                this.submit(formData, this.indexPage_Editor);
      //       }
      //       else
      //         alert('Giá trị dự trù không được nhỏ hơn giá trị đã thanh toán');
      //       //}
      //       //else
      //       //  alert('Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu chi tiết."');
      //     }
      //     else {
      //       alert('Các Tab dữ liệu (Chi tiết, Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có) hoặc điền đầy đủ thông tin.');
      //     }
      //   }
      //   else
      //     alert('Số thứ tự hoặc Id Hợp đồng đã bị trùng, giá trị: ' + this._valueDuplicate);
      // });
  }


  }
