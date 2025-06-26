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
import { LayoutBillSuppEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinter } from "../billsupp-explorer/billsupp-printer.data";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";

@Component({
  selector: 'app-billsupp-editor-form',
  templateUrl: './billsupp-editor.component.html',
  styleUrls: ['./billsupp-editor.component.css']
})

export class BillSuppEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  layoutPrint: LayoutPrinter = new LayoutPrinter();

  indexPage = ['/main', 'billsupp', 'index'];
  indexPage_Editor = ['/main', 'billsupp', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutBillSuppEditor(service, this.parentData);
    this._layoutPrinter = this.layoutPrint.Layout;
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid,this.grid1,this.grid2,this.grid3,this.grid4];
    this.init();
    this.grid3.allowAddNew = false;
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data['IsTitleRow'] == true) {
            wjcCore.setCss(e.cell, {
              color: '',
              fontWeight: 'bold',
               backgroundColor: '#CCF381'
            });
          }
          else
          if (data['NoChangeInBill'] == false) {
            wjcCore.setCss(e.cell, {
              color: 'red',
              fontWeight: '',
              // fontWeight: '',
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
    this.grid1.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data['IsTitleRow'] == true) {
            wjcCore.setCss(e.cell, {
              color: '',
              fontWeight: 'bold',
               backgroundColor: '#CCF381'
            });
          }
          else
          if (data['NoChangeInBill'] == false) {
            wjcCore.setCss(e.cell, {
              color: 'red',
              fontWeight: '',
              // fontWeight: '',
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
    this.grid2.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data['IsTitleRow'] == true) {
            wjcCore.setCss(e.cell, {
              color: '',
              fontWeight: 'bold',
               backgroundColor: '#CCF381'
            });
          }
          else
          if (data['NoChangeInBill'] == false) {
            wjcCore.setCss(e.cell, {
              color: 'red',
              fontWeight: '',
              // fontWeight: '',
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
    this.grid4.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data['IsTitleRow'] == true) {
            wjcCore.setCss(e.cell, {
              color: '',
              fontWeight: 'bold',
               backgroundColor: '#CCF381'
            });
          }
          else
          if (data['NoChangeInBill'] == false) {
            wjcCore.setCss(e.cell, {
              color: 'red',
              fontWeight: '',
              // fontWeight: '',
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

  onSubmit(formData: any) {
    //if (this.taidulieu == true || this.id > 0) {
      let _errorSave1 = false;
      for (let item of this.grid.itemsSource.items) {
        if ((item['PartNo'] == 'R8100' || item['PartNo'] == 'R8101') && item['CustomerCode'] == '') {
          _errorSave1 = true;
          break;
        }
      }

      let _errorSave2 = false;
      for (let item of this.grid2.itemsSource.items) {
        if ((item['PartNo'] == '' || item['CustomerCode'] == '' || item['BizDocId_C1'] == '') && item['IsTitleRow'] == false) {
          _errorSave2 = true;
          break;
        }
      }

      this.checkUniqueColGrid(this.grid, 'ItemNo');
      if (_errorSave1 == false) {
  
        if (_errorSave2 == false) {
    
      if (this._errorUnique == false) {
        
        this.submit(formData, this.indexPage_Editor);
      }
      else
        alert('Số thứ tự không được trùng hoặc bỏ trống, giá trị: ' + this._valueDuplicate)
    }
    else
    alert('Yêu cầu nhập đầy đủ Mã Quản lý KL, mã Đội (+/-), Id hợp đồng ở Tab "+ Bill"');
  }
    else
    alert('Yêu cầu nhập đầy đủ mã Đội (+/-)');
    //}
    //else
    //  alert('Yêu cầu "Tải dữ liệu" trước khi lập chi tiết khối lượng thanh toán');
  }

  showPrintVoucher(input: any) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher(input);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  ngOnDestroy() {
    this.destroy();
  }

  async loadAmountBill() {
    if (this._layoutDeclare.serverUpdating)
      for (let command of this._layoutDeclare.serverUpdating) {
        await this.dfpanel.runConstraint(command).then();
      }
    // this.dfpanel.runConstraint('Evaluator_ServerConstraint_Amount_KHKK_BCTC').then();
    // this.dfpanel.runConstraint('Evaluator_ServerConstraint_Amount_HDPL').then();
  }

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

  deleteSelectedRows1(flex: wjcGrid.FlexGrid) {
    // this.dfpanel.runConstraint('Evaluator_ServerConstraint_Check_ApproveSent_NotChange').then();
    if (flex) {
      var selected = [];
      console.log(selected)
      for (let k in flex.selectedRows) {
        let _idrowdel = flex.selectedRows[k]._idx;

        if (flex.selectedRows[k].dataItem != undefined) {
          let _id = flex.selectedRows[k].dataItem['Id'];
          let _ktrow = flex.selectedRows[k].dataItem['NoChangeInBill'];

          for (var i = 0; i < flex.rows.length; i++) {
            if (i == _idrowdel) {//(_id < 0 || _id == null || _id == undefined) && 
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

  showDocumentInNewTab(id: any) {
    //exportHtml(layoutPrint.WordName,layoutPrint.FileName, layoutPrint.FolderPath, parentData?.Id_TT)
    let _command = this._layoutDeclare.layout.PrintDocument.Command;
    let _wordName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].WordName;
    let _folderPath = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].FolderPath;
    let _fileName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].FileName;

    let params = { 'command': _command, 'wordName': _wordName, 'folderPath': _folderPath, 'fileName': _fileName, 'id': id };
    let navigateUrl: any = ['#/main', 'documentview', 'detail', encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)))];
    window.open(navigateUrl.join('/'));
  }

  showDocumentInNewTab1(id: any) {
    //exportHtml(layoutPrint.WordName,layoutPrint.FileName, layoutPrint.FolderPath, parentData?.Id_TT)
    let _command = this._layoutDeclare.layout.PrintDocument.Command_TongHop;
   
    let _wordName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[3].WordName;
    let _folderPath = this._layoutDeclare.layout.PrintDocument.LayoutPrint[3].FolderPath;
    let _fileName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[3].FileName;
    console.log(_wordName)
    let params = { 'command': _command, 'wordName': _wordName, 'folderPath': _folderPath, 'fileName': _fileName, 'id': id };
    let navigateUrl: any = ['#/main', 'documentview', 'detail', encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)))];
    window.open(navigateUrl.join('/'));
  }
}
