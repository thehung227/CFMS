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
import { LayoutPaymentExtraProposalEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { SystemConstants } from "../../../core/common/system.constants";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-paymentextraproposal-editor-form',
  templateUrl: './paymentextraproposal-editor.component.html',
  styleUrls: ['./paymentextraproposal-editor.component.css']
})

export class PaymentExtraProposalEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;

  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;

  indexPage = ['/main', 'paymentextraproposal', 'index'];
  folderName = 'De_Xuat_Thanh_Toan';
  indexPage_Editor = ['/main', 'paymentextraproposal', 'detail'];
  output: Array<Object>;
  _errBCTC: boolean = false;
  _errMess: string;

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutPaymentExtraProposalEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();
    //this.grid1.isReadOnly = true;
    this.grid.allowAddNew = false;
    this.grid1.allowAddNew = false;
    this.grid2.isReadOnly = true;
    this.grid3.isReadOnly = true;
   
    // this.grid5.allowAddNew = false;

    this.dbClickCellContent(this.grid2);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data['EstimatedTimeDelivery'] < this.parentData["DocDate"] && data['IsTitleRow'] == false) {
            wjcCore.setCss(e.cell, {
              color: 'red',
              fontWeight: ''
            });
          }
          else
            if (data['IsTitleRow'] == true) {
              wjcCore.setCss(e.cell, {
                color: 'black',
                fontWeight: 'bold'
              });
            }
            else {
              wjcCore.setCss(e.cell, {
                color: '',
                fontWeight: '',
                // backgroundColor: ''
              });
            }
        }
      }
    });

  
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    let _numEror = 0;
    // for (let i in this.gridArray) {
    //   if (this.gridArray[i].itemsSource.items.length == 0 && i != '0' && i != '2' && i != '3' && i != '4' && i != '5') {
    //     _numEror += 1;
    //     break;
    //   }
    // }

    let _errorSave = false;
    // for (let item of this.grid.itemsSource.items) {
    //   if (item['OpenPlanAmount'] < item['OriginalAmount'] && item['IsTitleRow'] == false && item['OriginalAmount'] > 0) {
    //     _errorSave = true;
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

    let _errorSave2 = false;
    // if (formData.controls['AmountME'].value == 0) {
    //   _errorSave2 = true;
    // }

    if (_numEror == 0) {
      //if (this.taidulieu == true || this.id > 0) {
      // this.checkUniqueColGridNotIncludedEmpty(this.grid, 'BizDocId_C1', 'DocInfo').then(() => {
      //   if (this._errorUnique == false) {
      if (isApproveSend == true) {
            if (_errorSave == false) {
              if (_errorSave1 == false) {

                this.checkNhapLieu(formData).then(() => {
                  if (this._errBCTC == false) {
                    this.submit(formData, this.indexPage, isApproveSend).then(() => {
                      if (this.allowSendMail) {
                        this.sendMail(formData, 'E1', this.id, false, '1');
                      }
                    })
                  }
                  else {
                    alert(this._errMess);
                    this.showLoading = false;
                  }
                });
              }

              else
                alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');

            }
            else
              alert('Giá trị đề xuất không được lớn hơn giá trị BILL thanh toán !!!');
            // }
            // else
            //   alert('Mã đối tượng, mã công việc, ngày dự kiến ký kết, loại đối tác: không được bỏ trắng giá trị');
          
      }
      else
        this.submit(formData, this.indexPage_Editor);
      //   }
      //   else
      //     alert('Id Hợp đồng đã bị trùng, giá trị: ' + this._valueDuplicate);
      // });
      //}
      //else
      //  alert('Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu chi tiết.');
    }
    else {
      alert('Tab dữ liệu (Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có) hoặc điền đầy đủ thông tin.');
    }
  }

  async checkNhapLieu(formData: any) {
    this.showLoading = true;
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();
    const param4 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('ProductCostId');
    param1.ParameterValue = formData.value['ProductCostId'];
    params.push(param1);

    param2.ParameterName = Global.convertParameterName('BranchCode');
    param2.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
    params.push(param2);

    param3.ParameterName = Global.convertParameterName('Id');
    param3.ParameterValue = this.id;
    params.push(param3);

    param4.ParameterName = Global.convertParameterName('UserId');
    param4.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID).replace(/"/gi, '');
    params.push(param4);

    let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_CTC_CheckDeXuatThanhToan_E1', params)
      .toPromise().then();

    this.output = <Array<Object>>(_data['output']);
    this._errBCTC = this.output['@_Error'];
    this._errMess = this.output['@_ErrorMessage'];
  }

  async checkUniqueColGridNotIncludedEmpty(flex: wjcGrid.FlexGrid, field: string, fieldWarning?: string) {
    if (flex) {
      let _arr: any = flex.itemsSource.items;

      this._errorUnique = false;

      for (let i = 0; i < _arr.length; i++) {
        for (let j = i + 1; j < _arr.length; j++) {
          if (_arr[i][field] != '' && _arr[j][field] != '' && _arr[i][field] != undefined && _arr[j][field] != undefined) {
            if (_arr[i][field] != 'C0100000021358C3' && _arr[i][field] != 'B0100000027018C3')
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

  async onClick_3(state?: any) {
    try {
      this.showDialog = false;//Thêm dialog

      if (this.editorFrm.valid) {
        this.showLoading = true;
        this.taidulieu = true;
      }

      for (let command of this._layoutDeclare.buttonLoadChild3) {
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

  showPrintVoucher(input: any) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher(input);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  // deleteSelectedRows(flex: wjcGrid.FlexGrid) {
  //   this.dfpanel.runConstraint('Evaluator_ServerConstraint_Check_ApproveSent_NotChange').then();
  //   if (flex) {
  //     var selected = [];

  //     for (let k in flex.selectedRows) {
  //       let _idrowdel = flex.selectedRows[k]._idx;
  //       if (flex.selectedRows[k].dataItem != undefined) {
  //         let _CompletedApproveDetail = flex.selectedRows[k].dataItem['CompletedApproveDetail'];
  //         let _InheritanceRowId = flex.selectedRows[k].dataItem['InheritanceRowId'];
  //         for (var i = 0; i < flex.rows.length; i++) {
  //           if (i == _idrowdel && (_CompletedApproveDetail == false || _CompletedApproveDetail == null || _CompletedApproveDetail == undefined) && (_InheritanceRowId == '' || _InheritanceRowId == null || _InheritanceRowId == undefined)) {
  //             selected.push(flex.rows[i].dataItem);
  //             break;
  //           }
  //         }
  //       }
  //     }

  //     // delete the selected items
  //     for (var i = 0; i < selected.length; i++) {
  //       flex.itemsSource.remove(selected[i]);
  //     }
  //   }
  // }

  exportHtmlWorkFlow(input: any, extInput?: string) {
    if (this.parentData["CompletedApprove"] == false) {
      alert('Hồ sơ chưa hoàn thiện duyệt, không thể in ấn workflow');
      return;
    }
    else
      this.exportHtml_WorkFlow('WorkFlow_KHKK.docx', 'WorkFlow KHKK - {VAR=ProductName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }
}
