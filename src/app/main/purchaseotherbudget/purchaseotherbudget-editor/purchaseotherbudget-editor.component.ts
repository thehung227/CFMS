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
import { LayoutPurchaseOtherBudgetEditor } from "../Layout";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { SystemConstants } from "../../../core/common/system.constants";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-purchaseotherbudget-editor-form',
  templateUrl: './purchaseotherbudget-editor.component.html',
  styleUrls: ['./purchaseotherbudget-editor.component.css']
})

export class PurchaseOtherBudgetEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;

  indexPage = ['/main', 'purchaseotherbudget', 'index'];
  folderName = 'Ke_Hoach_Mua_Hang';
  indexPage_Editor = ['/main', 'purchaseotherbudget', 'detail'];
  output: Array<Object>;
  _errBCTC: boolean = false;
  _errMess: string;
  // ===== Right-click row menu state (ONLY for grid Chi tiết) =====
  rowMenuVisible: boolean = false;
  rowMenuStyle: any = {}; // { left: '100px', top: '200px' }

  private _rowMenuGrid: wjcGrid.FlexGrid | null = null;
  private _rowMenuRowIndex: number = -1;

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutPurchaseOtherBudgetEditor(service, this.parentData);
  }



  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(_evt: MouseEvent) {
    this.hideRowMenu();
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(evt: KeyboardEvent) {
    if (evt.key === 'Escape') this.hideRowMenu();
  }

  private hideRowMenu() {
    this.rowMenuVisible = false;
    this._rowMenuGrid = null;
    this._rowMenuRowIndex = -1;
  }


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
          else {
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
    var cv: any = this.grid && (this.grid as any).collectionView;


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
                      this.sendMail(formData, 'H7', this.id, false, '1');
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

  openRowContextMenu(evt: MouseEvent, grid: wjcGrid.FlexGrid) {
    evt.preventDefault();
    evt.stopPropagation();

    if (!grid) return;

    const ht = grid.hitTest(evt);

    // chỉ mở menu khi click phải lên vùng cell (không phải header)
    if (!ht || ht.cellType !== wjcGrid.CellType.Cell || ht.row < 0) {
      this.hideRowMenu();
      return;
    }

    this._rowMenuGrid = grid;
    this._rowMenuRowIndex = ht.row;

    // select đúng dòng đang click phải
    try {
      grid.select(new wjcGrid.CellRange(ht.row, 0, ht.row, grid.columns.length - 1), true);
    } catch (e) { }

    this.rowMenuStyle = { left: `${evt.clientX}px`, top: `${evt.clientY}px` };
    this.rowMenuVisible = true;
  }

  onInsertRowAtCursor() {
    if (!this._rowMenuGrid || this._rowMenuRowIndex < 0) return;
    this.insertRowAt(this._rowMenuGrid, this._rowMenuRowIndex);
    this.hideRowMenu();
  }

  onInsertRowBelowCursor() {
    if (!this._rowMenuGrid || this._rowMenuRowIndex < 0) return;
    this.insertRowAt(this._rowMenuGrid, this._rowMenuRowIndex + 1);
    this.hideRowMenu();
  }

  onDeleteRowAtCursor() {
    if (!this._rowMenuGrid || this._rowMenuRowIndex < 0) return;

    // chọn đúng row rồi dùng lại hàm deleteSelectedRows(grid) đang có
    try {
      this._rowMenuGrid.select(new wjcGrid.CellRange(this._rowMenuRowIndex, 0, this._rowMenuRowIndex, 0), true);
    } catch (e) { }

    this.deleteSelectedRows(this._rowMenuGrid);
    this.hideRowMenu();
  }

  protected deleteSelectedRows(flex: wjcGrid.FlexGrid) {
    if (flex) {
      // get list of selected items
      var selected = [];

      for (let k in flex.selectedRows) {
        let _idrowdel = flex.selectedRows[k]._idx;
        for (var i = 0; i < flex.rows.length; i++) {
          if (i == _idrowdel) {
            let data = flex.rows[i].dataItem;
            // Không xóa những dòng là tiêu đề
             if (data && (data['IsTitleRow'] == true || data['IsTitleRow'] == 1 || data['isTitleRows'] == 1 || data['IsLink'] == true || data['IsLink'] == 1)) {
              continue;
            }
            selected.push(data);
            break;
          }
        }
      }

      for (var i = 0; i < selected.length; i++) {
        flex.itemsSource.remove(selected[i]);
      }
    }
  }
  private insertRowAt(grid: wjcGrid.FlexGrid, insertIndex: number) {
    if (!grid || !grid.collectionView) return;

    const view: any = grid.collectionView;

    // clamp index
    if (insertIndex < 0) insertIndex = 0;

    // 1. Tạo dòng mới dựa trên cấu trúc mặc định (defaultRow) đã được BaseEditorComponent khởi tạo
    let newItem: any = view['defaultRow'] ? JSON.parse(JSON.stringify(view['defaultRow'])) : {};

    // 2. Thiết lập các thông tin cơ bản để có thể lưu vào database
    newItem['Id'] = -1; // Đánh dấu là dòng mới
    if (this.parentData && this.parentData['Stt']) {
      newItem['Stt'] = this.parentData['Stt']; // Gán Stt của Parent để liên kết dữ liệu
    }

    // Wijmo thường dùng sourceCollection
    if (Array.isArray(view.sourceCollection)) {
      if (insertIndex > view.sourceCollection.length) insertIndex = view.sourceCollection.length;
      view.sourceCollection.splice(insertIndex, 0, newItem);

      // 3. Quan trọng: Đẩy vào itemsAdded để BaseEditorComponent.submit có thể nhận diện và lưu
      if (view.trackChanges) {
        view.itemsAdded.push(newItem);
      }

      view.refresh();
    } else if (Array.isArray(view.items)) {
      if (insertIndex > view.items.length) insertIndex = view.items.length;
      view.items.splice(insertIndex, 0, newItem);

      if (view.trackChanges) {
        view.itemsAdded.push(newItem);
      }

      view.refresh();
    }

    // focus vào dòng mới
    try {
      setTimeout(() => {
        grid.select(new wjcGrid.CellRange(insertIndex, 0, insertIndex, 0), true);
        grid.scrollIntoView(insertIndex, 0);
        grid.startEditing(false);
      }, 100);
    } catch (e) { }
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
