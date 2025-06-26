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
import { LayoutBillInternalEquipEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinter } from "../billinternalequip-explorer/billinternalequip-printer.data";
import { LayoutPrinterWordFlow } from "../../_printerlayout/workflow/workflowTT-printer.data";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { SystemConstants } from "../../../core/common/system.constants";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-billinternalequip-editor-form',
  templateUrl: './billinternalequip-editor.component.html',
  styleUrls: ['./billinternalequip-editor.component.css']
})

export class BillInternalEquipEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  layoutPrint: LayoutPrinter = new LayoutPrinter();
  layoutprintWordFlow: LayoutPrinterWordFlow = new LayoutPrinterWordFlow();

  indexPage = ['/main', 'billinternalequip', 'index'];
  folderName = '08.Thanh_Toan_BCH';
  indexPage_Editor = ['/main', 'billinternalequip', 'detail'];
  output: Array<Object>;
  _errBCTC: boolean = false;
  _errMess: string;

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutBillInternalEquipEditor(service, this.parentData);
    this._layoutPrinter = this.layoutPrint.Layout;
    this._layoutPrinter_WordFlow = this.layoutprintWordFlow.Layout;
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();

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
          if (data['IsTitleRow'] == true) {
            wjcCore.setCss(e.cell, {
              // color: 'red',
              fontWeight: 'bold',
              backgroundColor: '#CCFFFF'
            });
          }
          else
          if (data['ItemNo'] == 'C') {
            wjcCore.setCss(e.cell, {
              // color: 'red',
              fontWeight: 'bold',
              backgroundColor: '#66FFCC'
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
  
  showPrintVoucher(input: any) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher(input);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    let _numEror = 0;
    // if ((this.gridArray[0].itemsSource.items.length == 0 && formData.get('PayTeamType').value != '00') || (this.gridArray[2].itemsSource.items.length == 0) || (this.gridArray[1].itemsSource.items.length == 0)) {
    //   _numEror += 1;
    // }
    
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

    let _errorSave2 = false;
    // for (let item of this.grid.itemsSource.items) {
    //   if (item['EquipTypeCode'] == '' || item['ExpenseCatgCode'] == '') {
    //     _errorSave2 = true;
    //     break;
    //   }
    // }

    this.checkUniqueColGrid(this.grid, 'ItemNo');
    if (this._errorUnique == false) {
      if (_numEror == 0) {
        if (isApproveSend == true) {
          // this.checkBCTC(formData).then(() => {
          //   if (this._errBCTC == false) {
          let _errorSave = false;
          for (let item of this.grid1.itemsSource.items) {
            if (item['Attached'] == true && item['Description'] != 'Theo mẫu công ty ban hành' && (item['FilePath'] == '' || item['FilePath'] == undefined)) {
              _errorSave = true;
              break;
            }
          }
          if (_errorSave) {
            alert('Yêu cầu đính kèm tài liệu trước khi gửi duyệt!');
          }
          else
            if (_errorSave2) {
              alert('Tab "Chi tiết" ô "Loại chi phí, Mã Công việc" phải có dữ liệu!');
            }
            else {
              // this.editorFrm.controls['ApproveSend'].setValue(true);
              // this.dfpanel.runConstraint('Evaluator_UpdateApproveSend').then();
              // window.close();
              if (_errorSave1 == false) {
                this.submit(formData, this.indexPage, isApproveSend).then(() => {
                  if (this.allowSendMail) {
                    this.sendMail(formData, 'P6', this.id, false, '1');
                  }
                });
              } else
                alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị')
            }
          //   }
          //   else {
          //     alert(this._errMess);
          //     this.showLoading = false;
          //   }
          // });
        }
        else
          this.submit(formData, this.indexPage_Editor);
        // this.submit(formData, this.indexPage_Editor).then(()=>{
        //   location.reload(false);
        // });
      }
      else {
        alert('Các Tab dữ liệu (Chi tiết, Tài liệu đính kèm, Bước duyệt) cần có ít nhất 1 dòng để lưu. Yêu cầu nhấn "Tải dữ liệu" để tải dữ liệu (nếu có) hoặc điền đầy đủ thông tin.');
      }
    }
    else
      alert('Số thứ tự không được trùng hoặc bỏ trắng, giá trị: ' + this._valueDuplicate);
  }

  ngOnDestroy() {
    this.destroy();
  }


  // async checkBCTC(formData: any) {
  //   this.showLoading = true;
  //   let params = new Array<ParameterContract>();
  //   const param1 = new ParameterContract();
  //   const param2 = new ParameterContract();
  //   const param3 = new ParameterContract();
  //   const param4 = new ParameterContract();

  //   param1.ParameterName = Global.convertParameterName('Id');
  //   param1.ParameterValue = this.id;
  //   params.push(param1);

  //   param2.ParameterName = Global.convertParameterName('ProductCostId');
  //   param2.ParameterValue = formData.value['ProductCostId'];
  //   params.push(param2);

  //   param3.ParameterName = Global.convertParameterName('BranchCode');
  //   param3.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
  //   params.push(param3);

  //   param4.ParameterName = Global.convertParameterName('UserId');
  //   param4.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID).replace(/"/gi, '');
  //   params.push(param4);



  //   let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Check_BCTC_Payment', params)
  //     .toPromise().then();

  //   this.output = <Array<Object>>(_data['output']);
  //   this._errBCTC = this.output['@_Error'];
  //   this._errMess = this.output['@_ErrorMessage'];
  // }

  deleteSelectedRows(flex: wjcGrid.FlexGrid) {
    this.dfpanel.runConstraint('Evaluator_ServerConstraint_Check_ApproveSent_NotChange').then();
    if (flex) {
      var selected = [];
      for (let k in flex.selectedRows) {
        let _idrowdel = flex.selectedRows[k]._idx;

        if (flex.selectedRows[k].dataItem != undefined) {
          let _id = flex.selectedRows[k].dataItem['Id'];
          let _ktrow = flex.selectedRows[k].dataItem['NoChangeInBill'];

          for (var i = 0; i < flex.rows.length; i++) {
            if (i == _idrowdel && (_ktrow == false || _ktrow == null || _ktrow == undefined)) {//(_id < 0 || _id == null || _id == undefined) && 
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

  showPrintVoucher_WorklFlow(input: any, gridForm?: wjcGrid.FlexGrid, extInput?: string) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher_WordFlow(input, 'MAU1', gridForm, extInput, 'DocCode');

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  exportHtmlWorkFlow(input: any, extInput?: string) {
    this.exportHtml_WorkFlow('WorkFlow_TT.docx', 'WorkFlow BCH.PB - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }
}
