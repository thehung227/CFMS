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
import { LayoutPlanCostRevConsEditor } from "../DeclareLayout";
import { SystemConstants } from "../../../core/common/system.constants";
import { PlanCostRevConsPopupEditorComponent } from "../../plancostrevcons-popup/plancostrevcons-popup-editor/plancostrevcons-popup-editor.component";
import { Title } from "@angular/platform-browser";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { Console } from "console";

@Component({
  selector: 'app-plancostrevcons-editor-form',
  templateUrl: './plancostrevcons-editor.component.html',
  styleUrls: ['./plancostrevcons-editor.component.css']
})

export class PlanCostRevConsEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('popupEditorFrm') popupEditorFrm: PlanCostRevConsPopupEditorComponent;

  indexPage = ['/main', 'plancostrevcons', 'index'];
  folderName = '01.Ke_Hoach_DoanhThu_ChiPhi';
  indexPage_Editor = ['/main', 'plancostrevcons', 'detail'];
  output: Array<Object>;
  _errBCTC: boolean = false;
  _errMess: string;

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutPlanCostRevConsEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();
    // this.grid1.isReadOnly = true;
    this.grid1.allowAddNew = false;
    this.grid2.isReadOnly = true;
    this.grid3.allowAddNew = false;


    this.dbClickCellContent(this.grid2);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    this.setupTienDoGrid();

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

  /** Các cột tiến độ được tính phía client, không ghi vào record (xem childColumnsNotSave trên layout). */
  private readonly _tienDoColumns = ['TongSoThang', 'DaThucHien', 'ConLai', 'RateTienDo'];

  /**
   * Vẽ 4 cột tiến độ của lưới Tiến độ. Tính lại mỗi lần vẽ ô thay vì ghi vào dataItem để:
   * - giá trị tự nhảy ngay khi người dùng sửa StartDateBCH / ToDateBCH,
   * - không làm phát sinh cột lạ trong payload khi Lưu (payload lấy theo thuộc tính của record).
   */
  private setupTienDoGrid() {
    if (!this.grid3) return;

    this.grid3.formatItem.addHandler((s: wjcGrid.FlexGrid, e: wjcGrid.FormatItemEventArgs) => {
      if (e.panel.cellType != wjcGrid.CellType.Cell) return;

      let _column = s.columns[e.col];
      if (!_column || this._tienDoColumns.indexOf(_column.binding) < 0) return;

      let _row = s.rows[e.row];
      let _item = _row ? _row.dataItem : null;
      if (_item == undefined) {
        e.cell.textContent = '';
        return;
      }

      let _value = this.calcTienDo(_item)[_column.binding];
      e.cell.textContent = (_value == null) ? '' : wjcCore.Globalize.format(_value, _column.format);
    });

    // Wijmo chỉ vẽ lại ô vừa sửa, trong khi 4 cột trên phụ thuộc cả 2 cột ngày -> ép vẽ lại cả lưới.
    this.grid3.cellEditEnded.addHandler((s: wjcGrid.FlexGrid, e: wjcGrid.CellRangeEventArgs) => {
      let _binding = s.columns[e.col] ? s.columns[e.col].binding : '';
      if (_binding == 'StartDateBCH' || _binding == 'ToDateBCH') {
        s.invalidate();
      }
    });
  }

  /**
   * TongSoThang  = chênh lệch tháng lịch giữa StartDateBCH và ToDateBCH (bỏ qua phần ngày).
   * DaThucHien   = chênh lệch tháng lịch từ StartDateBCH đến hôm nay, kẹp trong [0, TongSoThang].
   * ConLai       = TongSoThang - DaThucHien.
   * RateTienDo   = DaThucHien / TongSoThang, bằng 0 khi TongSoThang <= 0 (tránh chia cho 0).
   * Thiếu ngày để tính -> trả null để ô hiển thị trống thay vì số sai.
   */
  private calcTienDo(item: any): any {
    let _start = this.toDateOrNull(item['StartDateBCH']);
    let _to = this.toDateOrNull(item['ToDateBCH']);

    let _tongSoThang = (_start && _to) ? this.monthDiff(_start, _to) : null;

    let _daThucHien = null;
    if (_start) {
      _daThucHien = Math.max(0, this.monthDiff(_start, new Date()));
      if (_tongSoThang != null && _tongSoThang > 0)
        _daThucHien = Math.min(_daThucHien, _tongSoThang);
      else if (_tongSoThang != null)
        _daThucHien = 0;
    }

    let _conLai = (_tongSoThang != null && _daThucHien != null) ? _tongSoThang - _daThucHien : null;

    // Thiếu ngày để tính -> để trống như 3 cột trên; TongSoThang <= 0 -> 0 (tránh chia cho 0).
    let _rate = null;
    if (_tongSoThang != null)
      _rate = (_tongSoThang > 0 && _daThucHien != null) ? _daThucHien / _tongSoThang : 0;

    return {
      TongSoThang: _tongSoThang,
      DaThucHien: _daThucHien,
      ConLai: _conLai,
      RateTienDo: _rate
    };
  }

  /** Số tháng lịch giữa 2 mốc: (năm2-năm1)*12 + (tháng2-tháng1). */
  private monthDiff(from: Date, to: Date): number {
    return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  }

  /** Dữ liệu ngày từ server có thể là Date hoặc chuỗi; ngày <= 01/01/1900 được coi như trống. */
  private toDateOrNull(value: any): Date {
    if (value == null || value === '') return null;

    let _date = (value instanceof Date) ? value : new Date(value);
    if (isNaN(_date.getTime())) return null;
    if (_date <= new Date(1900, 0, 1)) return null;

    return _date;
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

    // let _errorSave0 = false;
    // for (let item of this.grid.itemsSource.items) {
    //   if (item['OriginalAmount1'] < item['AmountPaid'] && item['AmountPaid'] != 0) {
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
    if (this._errorUnique == false) {
      this.checkUniqueColGridNotIncludedEmpty(this.grid, 'BizDocId_C1', 'DocInfo').then(() => {
        if (this._errorUnique == false) {
          if (_numEror == 0) {
            //if (this.taidulieu == true || this.id > 0) {
            // if (_errorSave0 == false) {
              if (isApproveSend == true) {
                if (_errorSave1 == false) {
                  // this.editorFrm.controls['ApproveSend'].setValue(true);
                  // this.dfpanel.runConstraint('Evaluator_UpdateApproveSend').then();
                  // window.close();
                  this.checkDuTruHopDong(formData).then(() => {
                    if (this._errBCTC == false) {
                      this.submit(formData, this.indexPage, isApproveSend).then(() => {
                        if (this.allowSendMail) {
                          this.sendMail(formData, 'K2', this.id, false, '1');
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
                  alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
              }
              else
                this.submit(formData, this.indexPage_Editor);
            // }
            // else
            //   alert('Khối lượng dã thực hiện vượt quá số tiền dự trù');
            //}
            //else
            //  alert('Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu chi tiết."');
          }
          else {
            alert('Các Tab dữ liệu (Chi tiết, Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có) hoặc điền đầy đủ thông tin.');
          }
        }
        else
          alert('Số thứ tự hoặc Id Hợp đồng đã bị trùng, giá trị: ' + this._valueDuplicate);
      });
  }
  else
            alert('Số thứ tự đã bị trùng, giá trị: ' + this._valueDuplicate);
}

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

  async checkDuTruHopDong(formData: any) {
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

    let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_CTC_CheckHopDongKhongDuTruBCTC', params)
      .toPromise().then();

    this.output = <Array<Object>>(_data['output']);
    this._errBCTC = this.output['@_Error'];
    this._errMess = this.output['@_ErrorMessage'];
  }

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
          let _InheritanceRowId = flex.selectedRows[k].dataItem['InheritanceRowId'];
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
