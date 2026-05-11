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
import { Title } from "@angular/platform-browser";
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';
import { LayoutMaterialUsageStatusEditor } from "../Layout";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { SystemConstants } from "../../../core/common/system.constants";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-materialusagestatus-editor-form',
  templateUrl: './materialusagestatus-editor.component.html',
  styleUrls: ['./materialusagestatus-editor.component.css']
})

export class MaterialUsageStatusEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;

  indexPage = ['/main', 'materialusagestatus', 'index'];
  folderName = 'Tinh_Trang_Su_Dung_Va_Hao_Hut';
  indexPage_Editor = ['/main', 'materialusagestatus', 'detail'];
  output: Array<Object>;
  _errBCTC: boolean = false;
  _errMess: string;

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutMaterialUsageStatusEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  columns: any[] = [];
  data: any[] = [];

 
  

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();
    //this.grid1.isReadOnly = true;
    this.grid1.allowAddNew = false;
    this.grid3.allowAddNew = false;
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
              color: 'blue',
                fontWeight: 'bold',
            });
          }
          else
          {
          if (data['IsLink'] == false) {
            wjcCore.setCss(e.cell, {
              color: 'red',
              fontWeight: '',
            });
          }
          else {
            wjcCore.setCss(e.cell, {
              color: '',
              fontWeight: '',
              // fontWeight: '',
              // backgroundColor: ''
            });
          }
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
    for (let i in this.gridArray) {
      if (this.gridArray[i].itemsSource.items.length == 0 && i != '2') {
        _numEror += 1;
        break;
      }
    }

    let _errorSave = false;
    for (let item of this.grid.itemsSource.items) {
      if (item['ItemGroupCode'] == '' || item['ItemNo'] == '') { //|| item['TradeMarkCode'] == ''
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

    let _errorSave2 = false;
    for (let item of this.grid3.itemsSource.items) {
      if (item['Attached'] == true && (item['FilePath'] == '' || item['FilePath'] == undefined)) {
        _errorSave2 = true;
        break;
      }
    }

    if (_numEror == 0) {
      //if (this.taidulieu == true || this.id > 0) {
      if (_errorSave == false) {
        if (isApproveSend == true) {
          if (_errorSave1 == false) {
            if (_errorSave2 == false) {
            this.checkKhoiLuong_KeHoach_PO(formData).then(() => {
              if (this._errBCTC == false) {
                this.submit(formData, this.indexPage, isApproveSend).then(() => {
                  if (this.allowSendMail) {
                    this.sendMail(formData, 'H8', this.id, false, '1');
                  }
                });
              }
              else {
                alert(this._errMess);
                this.showLoading = false;
              }
            });
          }
          else
          alert('Yêu cầu đính kèm đầy đủ hồ sơ');
      }
          else
            alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
        }
        else {
          this.submit(formData, this.indexPage_Editor);
        }
      }
      else
        alert('Số thứ tự, Mã nhóm hàng, mã hàng không được bỏ trắng giá trị');
      //}
      //else
      //  alert('Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu chi tiết.');
    }
    else {
      alert('Các Tab (chi tiết, dữ liệu đính kèm, bước duyệt) cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có).');
    }

  }

  onFormatItem(event: any) {
    if (event.panel.cellType === wjcGrid.CellType.Cell) {
      let col = event.panel.columns[event.col];
      let cell = event.cell;
      
      if (col.binding === 'UnitQD') {
        cell.style.backgroundColor = 'lightblue';
      } else if (col.binding === 'CloseQuantity') {
        cell.style.backgroundColor = 'lightblue';
      } else if (col.binding === 'TaxRate') {
        cell.style.backgroundColor = 'lightblue';
      } else if (col.binding === 'ConvertRatexx') {
        cell.style.backgroundColor = 'lightblue';
      } else  {
        cell.style.backgroundColor = '';
      }
    }
  }

  async checkKhoiLuong_KeHoach_PO(formData: any) {
    this.showLoading = true;
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();
    const param4 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('Id');
    param1.ParameterValue = this.id;
    params.push(param1);

    let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_B30Budget_CheckData', params)
      .toPromise().then();

    this.output = <Array<Object>>(_data['output']);
    this._errBCTC = this.output['@_Error'];
    this._errMess = this.output['@_ErrorMessage'];
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
