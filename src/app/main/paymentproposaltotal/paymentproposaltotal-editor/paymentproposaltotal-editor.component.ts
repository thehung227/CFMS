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
import { LayoutPaymentProposalTotalEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';

@Component({
  selector: 'app-paymentproposaltotal-editor-form',
  templateUrl: './paymentproposaltotal-editor.component.html',
  styleUrls: ['./paymentproposaltotal-editor.component.css']
})

export class PaymentProposalTotalEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('grid5') grid5: wjcGrid.FlexGrid;
  @ViewChild('grid6') grid6: wjcGrid.FlexGrid;
  @ViewChild('grid7') grid7: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;

  indexPage = ['/main', 'paymentproposaltotal', 'index'];
  indexPage_Editor = ['/main', 'paymentproposaltotal', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutPaymentProposalTotalEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4, this.grid5, this.grid6, this.grid7];
    this.init();
    //this.grid1.isReadOnly = true;
    this.grid1.allowAddNew = false;
    this.grid2.isReadOnly = true;

    this.dbClickCellContent(this.grid2);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    this.grid1.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data['CustomerCode'] == '' || data['CustomerCode'] == null) {
            wjcCore.setCss(e.cell, {
              color: 'blue',
              fontWeight: 'bold',
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

    this.grid4.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data['IsTitleRow'] == true) {
            wjcCore.setCss(e.cell, {
              color: 'blue',
              fontWeight: 'bold',
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
    // let _numEror = 0;
    // for (let i in this.gridArray) {
    //   if (this.gridArray[i].itemsSource.items.length == 0 && i != '0' && i != '2' && i != '3') {
    //     _numEror += 1;
    //     break;
    //   }
    // }

    let _errorSave = false;
    for (let item of this.grid1.itemsSource.items) {
      if (item['OpenPlanAmount'] + 500 < item['AmountApproved'] && item['AmountApproved'] != 0 && item['IsTitleRow'] == false) {
    
        _errorSave = true;
        break;
      }
    }
  
    // let _errorSave1 = false;
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

    if (_errorSave == false) {
      this.submit(formData, this.indexPage_Editor);
    } else
    alert('Giá trị duyệt không được lớn hơn giá trị còn lại của BILL');
           
    
  }

  isLoading = false;
  async onClick(state: any) {
    let txt;
    if (state == 0) txt = 'Trả lại';
    else
      if (state == 1) txt = 'Duyệt';
      else
        if (state == 3) txt = 'Đề xuất trả';

    let r = confirm("Xác nhận thao tác: " + txt.toUpperCase());

    if (r == true) {
      this.showLoading = true;
      this.parentData["ApproveStatus"] = state;
      this.parentData["ApproveStatusWeb"] = state;

      this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
        this.sendMail(this.editorFrm, 'TO', this.parentData['IdTotal'], false, state).then(() => {
          this.router.navigate(['/main', 'notifications', 'index']);
        });
      });
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

  exportHtmlWorkFlow(flex: wjcGrid.FlexGrid) {
    if (flex) {
      for (let k in flex.selectedRows) {
        if (flex.selectedRows[k].dataItem != undefined) {
          let _Id_TT = flex.selectedRows[k].dataItem['Id_TT'];
          this.exportHtml_WorkFlow('WorkFlow TT.docx', 'WorkFlow TT - {VAR=ProductName} - {VAR=CustomerName}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', _Id_TT, 'K9');
          // for (var i = 0; i < flex.rows.length; i++) {
          //   if (i == _idrowdel && (_Id_TT == false )) {
          //     selected.push(flex.rows[i].dataItem);
          //     break;
          //   }
          // }
        }
      }

      // delete the selected items
  
    }
   
  }
}
