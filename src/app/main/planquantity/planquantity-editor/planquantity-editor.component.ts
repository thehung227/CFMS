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
import { LayoutPlanQuantityEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinter } from "../planquantity-explorer/planquantity-printer.data";
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';

@Component({
  selector: 'app-planquantity-editor-form',
  templateUrl: './planquantity-editor.component.html',
  styleUrls: ['./planquantity-editor.component.css']
})

export class PlanQuantityEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  layoutPrint: LayoutPrinter = new LayoutPrinter();

  indexPage = ['/main', 'planquantity', 'index'];
  folderName = 'Ke_Hoach_KhoiLuong';
  indexPage_Editor = ['/main', 'planquantity', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutPlanQuantityEditor(service, this.parentData);
    this._layoutPrinter = this.layoutPrint.Layout;
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();
    //this.grid1.isReadOnly = true;
    this.grid1.allowAddNew = true;
    this.grid2.allowAddNew = false;
    this.grid3.isReadOnly = true;

    this.dbClickCellContent(this.grid3);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    // this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

    //   if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
    //     let data = s.rows[e.row].dataItem;

    //     if (e.panel.cellType == wjcGrid.CellType.Cell) {
    //       if (data['InheritanceRowId'] == '') {
    //         wjcCore.setCss(e.cell, {
    //           color: 'red'
    //         });
    //       }
    //       else {
    //         wjcCore.setCss(e.cell, {
    //           color: '',
    //           // fontWeight: '',
    //           // backgroundColor: ''
    //         });
    //       }
    //     }
    //   }
    // });
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    let _numEror = 0;
    for (let i in this.gridArray) {
      if (this.gridArray[i].itemsSource.items.length == 0 && i != '1' && i != '3') {
        _numEror += 1;
        break;
      }
    }

    let _errorSave = false;
    for (let item of this.grid.itemsSource.items) {
      if (item['JobCode'] == '' && item['IsTitleRow'] == false) {
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

    if (_numEror == 0) {
      if (isApproveSend == true) {
        if (_errorSave == false) {
          if (_errorSave1 == false) {
            this.submit(formData, this.indexPage, isApproveSend).then(() => {
              if (this.allowSendMail) {
                this.sendMail(formData, 'K8', this.id, false, '1');
              }
            });
          }
          else
            alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
        }
        else
          alert('Mã khối lượng: không được bỏ trắng giá trị');
      }
      else
        this.submit(formData, this.indexPage_Editor);
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
            if (_arr[i][field] != 'A0100000010020C3')
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
    if (this.parentData["CompletedApprove"] == false) {
      alert('Hồ sơ chưa hoàn thiện duyệt, không thể in ấn workflow');
      return;
    }
    else
      this.exportHtml_WorkFlow('WorkFlow_KHKK.docx', 'WorkFlow KHKK - {VAR=ProductName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }
}
