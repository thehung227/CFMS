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
import { LayoutPlanSignConEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinter } from "../plansigncon-explorer/plansigncon-printer.data";
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';
import { ParameterContract } from "../../../contracts/parameter.contract";
import { SystemConstants } from "../../../core/common/system.constants";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-plansigncon-editor-form',
  templateUrl: './plansigncon-editor.component.html',
  styleUrls: ['./plansigncon-editor.component.css']
})

export class PlanSignConEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  layoutPrint: LayoutPrinter = new LayoutPrinter();

  indexPage = ['/main', 'plansigncon', 'index'];
  folderName = '00.Ke_Hoach_Ky_Ket';
  indexPage_Editor = ['/main', 'plansigncon', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutPlanSignConEditor(service, this.parentData);
    this._layoutPrinter = this.layoutPrint.Layout;
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2];
    this.init();
    //this.grid1.isReadOnly = true;
    this.grid1.allowAddNew = false;
    this.grid2.isReadOnly = true;

    this.dbClickCellContent(this.grid2);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data['IsTitleRow'] == true) {
            wjcCore.setCss(e.cell, {

              fontWeight: 'bold'
            });
          }
          else {
            wjcCore.setCss(e.cell, {

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
      paramXML.ParameterName = this.convertParameterName('B30CCMBudgetDetail');
      paramXML.ParameterValue = 'B30CCMBudgetDetail';
      params.push(paramXML);

      let ds = Global.getDataSetContract(
        {
          name: 'B30CCMBudgetDetail',
          collection: Global.createColection(this.grid.itemsSource)
        }
      )
console.log(ds)
      let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_B30CCMBudgetDetail_CheckData', params, ds)
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
    for (let i in this.gridArray) {
      if (this.gridArray[i].itemsSource.items.length == 0 && i != '2') {
        _numEror += 1;
        break;
      }
    }

    let _errorSave = false;
    for (let item of this.grid.itemsSource.items) {
      if ((item['EstimatedTimeDelivery'] == '' || item['EstimatedTimeDelivery'] == undefined || item['EstimatedQuotationDate'] == '' || item['PartNo'] == '' || item['EstimatedQuotationDate'] == undefined) && item['IsTitleRow'] == false) {
        _errorSave = true;
        break;
      }
    }

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

    if ((formData.controls['ToDate'].value == '' || formData.controls['ToDate'].value == null || formData.controls['ToDate'].value == undefined)) {
      alert('Yêu cầu nhập ngày ký BCTC cuối theo quy chế !!!');
    }
    else
      if (_numEror == 0) {
        this.checkData(formData).then(() => {
          //if (this.taidulieu == true || this.id > 0) {
          this.checkUniqueColGridNotIncludedEmpty(this.grid, 'BizDocId_C1', 'DocInfo').then(() => {
            if (this._errorUnique == false) {
              if (isApproveSend == true) {
                // this.editorFrm.controls['ApproveSend'].setValue(true);
                // this.dfpanel.runConstraint('Evaluator_UpdateApproveSend').then();
                // window.close();
                if (_errorSave == false) {
                  if (_errorSave1 == false) {
                    this.submit(formData, this.indexPage, isApproveSend).then(() => {
                      if (this.allowSendMail) {
                        this.sendMail(formData, 'K1', this.id, false, '1');
                      }
                    });
                  }
                  else
                    alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
                }
                else
                  alert('Ngày dự kiến ký kết, Ngày thi công, Người đàm phán cuối: không được bỏ trắng giá trị');
              }
              else
                this.submit(formData, this.indexPage_Editor);
            }
            else
              alert('Id Hợp đồng đã bị trùng, giá trị: ' + this._valueDuplicate);
          })
        });
        //}
        //else
        //  alert('Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu chi tiết.');
      }
      else {
        alert('Các Tab dữ liệu (Chi tiết, Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có) hoặc điền đầy đủ thông tin.');
      }
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

  showPrintVoucher(input: any) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher(input);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  deleteSelectedRows(flex: wjcGrid.FlexGrid) {
    this.dfpanel.runConstraint('Evaluator_ServerConstraint_Check_ApproveSent_NotChange').then();
    if (flex) {
      var selected = [];

      for (let k in flex.selectedRows) {
        let _idrowdel = flex.selectedRows[k]._idx;
        if (flex.selectedRows[k].dataItem != undefined) {
          let _CompletedApproveDetail = flex.selectedRows[k].dataItem['CompletedApproveDetail'];
          let _InheritanceRowId = flex.selectedRows[k].dataItem['InheritanceRowId'];
          for (var i = 0; i < flex.rows.length; i++) {
            if (i == _idrowdel && (_CompletedApproveDetail == false || _CompletedApproveDetail == null || _CompletedApproveDetail == undefined) && (_InheritanceRowId == '' || _InheritanceRowId == null || _InheritanceRowId == undefined)) {
              selected.push(flex.rows[i].dataItem);
              break;
            }
          }
        }
      }

      // delete the selected items
      for (var i = 0; i < selected.length; i++) {
        flex.itemsSource.remove(selected[i]);
      }
    }
  }

  exportHtmlWorkFlow(input: any, extInput?: string) {
    this.exportHtml_WorkFlow('WorkFlow_KHKK.docx', 'WorkFlow KHKK - {VAR=ProductName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }
}
