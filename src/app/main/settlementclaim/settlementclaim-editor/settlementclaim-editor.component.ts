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
import { LayoutSettlementClaimEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';
import { UploadInput } from "../../../ui/input/UploadInput";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { Global } from "../../../shared/global";

@Component({
  selector: 'app-settlementclaim-editor-form',
  templateUrl: './settlementclaim-editor.component.html',
  styleUrls: ['./settlementclaim-editor.component.css']
})

export class SettlementClaimEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('grid5') grid5: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;

  indexPage = ['/main', 'settlementclaim', 'index'];
  folderName = 'Claim';
  indexPage_Editor = ['/main', 'settlementclaim', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutSettlementClaimEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4, this.grid5];
    this.init();
    this.grid.isReadOnly = true;
    this.grid1.isReadOnly = true;
    this.grid2.allowAddNew = true;
    this.grid3.allowAddNew = false;
    this.grid5.allowAddNew = false;
    this.grid4.isReadOnly = true;

    this.dbClickCellContent(this.grid4);
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
    // for (let i in this.gridArray) {
    if (this.gridArray[3].itemsSource.items.length == 0) {
      _numEror += 1;
      // break;
    }
    // }
    
    let _errorSave = false;
    for (let item of this.grid2.itemsSource.items) {
      if (item['Attached'] == true && (item['FilePath'] == '' || item['FilePath'] == undefined)) {
        _errorSave = true;
        break;
      }
    }

    let _errorSave1 = false;
    for (let item of this.grid3.itemsSource.items) {
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
    if (isApproveSend == true) {
    if (_numEror == 0) {
      
        if (_errorSave == false) {
        if (_errorSave1 == false) {
          this.submit(formData, this.indexPage, isApproveSend).then(() => {
            if (this.allowSendMail) {
              this.sendMail(formData, 'C7', this.id, false, '1');
            }
          });
        }
        else
          alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
      }
      else
        alert('Tab dữ liệu (Tài liệu đính kèm) cần có dữ liệu để Lưu. Yêu cầu đính kèm đầy đủ hồ sơ.');
    //   else
    //     if (this.parentData["CompletedApprove"] == false) {
    //       this.submit(formData, this.indexPage_Editor);
    //     }
    //       this.showLoading = true;
       
    }
    else {
      alert('Tab dữ liệu (Bước duyệt, Tài liệu đính kèm) cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có) hoặc điền đầy đủ thông tin.');
    }
  } 
  else 
    if (this.parentData["CompletedApprove"] == false) {
      this.submit(formData, this.indexPage_Editor);
    }
      this.showLoading = true;
  // else {
  //   alert('Tab dữ liệu (Tài liệu đính kèm) cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có) hoặc điền đầy đủ thông tin.');
  // }
}

  exportHtmlWorkFlow(input: any, extInput?: string) {
    if (this.parentData["CompletedApprove"] == false) {
      alert('Hồ sơ chưa hoàn thiện duyệt, không thể in ấn workflow');
      return;
    }
    else
      this.exportHtml_WorkFlow('WorkFlow_QuyetToan_CDTKH.docx', 'WorkFlow Quyết toán - {VAR=TenGoiThau} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }

  showPrintVoucher(input: any) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher(input);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }
}
