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
import { LayoutProposedPurchaseEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { Global } from "../../../shared/global";
import { CollectionView } from "wijmo/wijmo";

@Component({
  selector: 'app-proposedpurchase-editor-form',
  templateUrl: './proposedpurchase-editor.component.html',
  styleUrls: ['./proposedpurchase-editor.component.css']
})

export class ProposedPurchaseEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  @ViewChild('searchItemText') searchItemText: string;

  indexPage = ['/main', 'proposedpurchase', 'index'];
  indexPage_Editor = ['/main', 'proposedpurchase', 'detail'];
  folderName = '09.De_Nghi_Mua_Hang';

  viewDetail: Array<Object>;
  
  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutProposedPurchaseEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid];
    this.init();

    this.grid.allowDragging = wjcGrid.AllowDragging.Both;
    this.grid.allowSorting = true;
    this.grid.selectionMode = wjcGrid.SelectionMode.CellRange;
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

  }

  ngOnDestroy() {
    this.destroy();
  }

  updatedView(s: wjcGrid.FlexGrid, e: wjcCore.EventArgs) {
    s.autoSizeRows();
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    if (isApproveSend == true) {
      this.submit(formData, this.indexPage, isApproveSend);
    }
    else
      this.submit(formData, this.indexPage_Editor);
  }

  deleteSelectedRows(flex: wjcGrid.FlexGrid) {
    if (flex) {
      // get list of selected items
      var selected = [];

      //let _idrowdel = flex.selectedRows[0]._idx;

      for (let k in flex.selectedRows) {
        let _idrowdel = flex.selectedRows[k]._idx;
        for (var i = 0; i < flex.rows.length; i++) {
          if (i == _idrowdel) {
            selected.push(flex.rows[i].dataItem);
          }
        }
        for (let i = 0; i < this.dataItem.length; i++) {
          if (flex.itemsSource.items[_idrowdel]) {
            if (this.dataItem[i][this._layoutDeclare['menu'].PrimaryField] == flex.itemsSource.items[_idrowdel][this._layoutDeclare['menu'].DuplicationField]) {
              this.dataItem[i][this._layoutDeclare['menu'].ColumnShow] = '0';
            }
          }
        }
      }

      // delete the selected items
      for (var i = 0; i < selected.length; i++) {
        //deleteRowFromDatabase(selected[i]);
        flex.itemsSource.remove(selected[i]);
      }
    }

    this.resetBuiltinOrder(flex);
  }

  async showPopup(row: any, form: any) {

    this.viewDetail = row;

    form.show(true);

  }

  pinToCart() {

    var x = document.getElementById("pageUp");
    var y = document.getElementById("pageDown");

    if (y.style.display != 'none') {
      x.style.height = "98%";
      y.style.display = "none";
    }
    else {
      x.style.height = "47%";
      y.style.display = "block";
    }
  }
  pinToLeftRight() {

    var x = document.getElementById("pageRight");
    var y = document.getElementById("pageLeft");

    if (x.style.display != 'none') {
      y.style.marginRight = "1%";
      x.style.display = "none";
    }
    else {
      y.style.marginRight = "40%";
      x.style.display = "block";
    }

    this.grid.refresh();
  }

  isLoading = false;
  async onClick() {
    this.isLoading = true;
    await this.dfpanel.runConstraint('Evaluator_ServerUpdating_UpdateStatusByApproveStatus');
    this.router.navigate(this.indexPage);
  }

  showAttach(folder: string, fileName: string) {
    var x = document.getElementById("viewfileattach");
    var y = document.getElementById("fileView");
    folder = Global.translateAutoText(folder, this.parentData);
    fileName = Global.translateAutoText(fileName, this.parentData);

    if (folder && fileName) {
      let p = this._service.dowload(folder, this.id.toString(), fileName).toPromise();
      p.then(blob => {
        if (fileName.toUpperCase().endsWith('PDF') == true || fileName.toUpperCase().endsWith('JPG') == true || fileName.toUpperCase().endsWith('PNG') == true || fileName.toUpperCase().endsWith('JPEG') == true || fileName.toUpperCase().endsWith('GIF') == true) {
          let url = window.URL.createObjectURL(blob);
          y.setAttribute('data', url);
          if (x.style.display == 'none') {
            x.style.display = "block";
          }
          else {
            x.style.display = "none";
          }
        }
      });

    }


  }

  async filterItemAdded() {
    if (document.getElementsByName('filterItemAdded')[0]['checked']) {

    
      var itemEdded = [];
      for (var i = 0; i < this.dataItem.length; i++) {
        if (this.dataItem[i][this._layoutDeclare['menu'].ColumnShow] != 0) {
          itemEdded.push(this.dataItem[i]);
        }
      }

      this.dataItem = itemEdded;
    }
    else {
      this.fetchDataItem().then(() => {
        if (this.dataItem) {
          for (let i = 0; i < this.dataItem.length; i++) {
            let value: number = 0;
      
            for (let j = 0; j < this.gridArray[0].itemsSource.items.length; j++) {
      
              if (this.dataItem[i][this._layoutDeclare['menu'].PrimaryField] == this.gridArray[0].itemsSource.items[j][this._layoutDeclare['menu'].DuplicationField]) {
                value += Number(this.gridArray[0].itemsSource.items[j][this._layoutDeclare['menu'].ColumnEdit]);
                this.dataItem[i][this._layoutDeclare['menu'].ColumnInput]= this.gridArray[0].itemsSource.items[j][this._layoutDeclare['menu'].ColumnEdit];
              }
            }
      
            this.dataItem[i][this._layoutDeclare['menu'].ColumnShow] = value.toString();
            
          }
        }
      });


    }
  }

  async searchItem() {
    let _textSearch = this._layoutDeclare['menu'].Filter;

    _textSearch = this.dfpanel.translate_expr_Filter_sql(_textSearch, this.paramsDefault, this.parentData);

    if (this.searchItemText['nativeElement'].value) {

      _textSearch = _textSearch + ' AND ' + this._layoutDeclare['menu'].FieldSearch + " LIKE N'%" + this.searchItemText['nativeElement'].value.replace(/ /gi, '%') + "%'";
    }

    let _data = await this._service.fetchDataSelect(Global.DataEditorEndpoint, this.zItemTableName, _textSearch, this.pageNumber, this.rowItem, this.orderBy).toPromise().then();

    this.dataItem = await <Array<Object>>(_data);

    if (this.dataItem) {
      

      for (let i = 0; i < this.dataItem.length; i++) {
        let value: number = 0;
  
        for (let j = 0; j < this.gridArray[0].itemsSource.items.length; j++) {
  
          if (this.dataItem[i][this._layoutDeclare['menu'].PrimaryField] == this.gridArray[0].itemsSource.items[j][this._layoutDeclare['menu'].DuplicationField]) {
            value += Number(this.gridArray[0].itemsSource.items[j][this._layoutDeclare['menu'].ColumnEdit]);
            this.dataItem[i][this._layoutDeclare['menu'].ColumnInput]= this.gridArray[0].itemsSource.items[j][this._layoutDeclare['menu'].ColumnEdit];
          }
        }
  
        this.dataItem[i][this._layoutDeclare['menu'].ColumnShow] = value.toString();
        
      }
    }

    
  }

  async addItemToRow(item: any, gridIndex: number, arr: any) {

    let _seperate = document.getElementsByName('seperateItemAdded')[0]['checked'];

    let gridtmp: wjcGrid.FlexGrid = this.gridArray[gridIndex];
    let _colData = new Array();

    _colData = arr;
    for (let control in _colData) {
      if (_colData[control].toString().indexOf('{EXPR=') > -1) {
        _colData[control] = this.dfpanel.translate_expr_control(_colData[control], item, gridtmp.itemsSource['defaultRow']);
      }

      if (_colData[control].toString().indexOf('{VAR=') > -1)
        _colData[control] = Global.convertConfig(_colData[control]);

      _colData[control] = this.dfpanel.replaceString(_colData[control], "'");

    }
    let data = new Array<Object>();
    //let data2 = new Array<Object>();

    data[0] = _colData;
    //data2[0] = _colData;


    if (data.length > 0) {
      let ds: CollectionView = gridtmp.itemsSource;

      if (this.id == -1 || this.id == undefined) {
       // console.log('thêm mới');


        let _duplicate = false;
        for (let row in data) {
          let indexEdit = 0;
          if (!_seperate)
          {
            let _arrNumRowDup = [];
            let _numRowDupMax = 0
            for (let i = 0; i < ds.items.length; i++) {
              if (ds.items[i][this._layoutDeclare['menu'].DuplicationField] == data[row][this._layoutDeclare['menu'].DuplicationField])
              {
                _arrNumRowDup.push(i);
              }
              _numRowDupMax = Math.max(..._arrNumRowDup);
            }

          for (let i = 0; i < ds.items.length; i++) {

            if (ds.items[i][this._layoutDeclare['menu'].DuplicationField] == data[row][this._layoutDeclare['menu'].DuplicationField] && i == _numRowDupMax) {

              // let value = eval(ds.items[i][this._layoutDeclare['menu'].ColumnEdit]);


              // _duplicate = true;
              // //ds.remove(ds.itemsRemoved[i]);
              // console.log(ds);
              // ds.items[i][this._layoutDeclare['menu'].ColumnEdit] = eval(value + 1).toString();
              // ds.itemsAdded[i][this._layoutDeclare['menu'].ColumnEdit] = eval(value + 1).toString();

              let value = eval(data[row][this._layoutDeclare['menu'].ColumnEdit]);
              value = Number(value);
              _duplicate = true;

              if (value != ds.items[i][this._layoutDeclare['menu'].ColumnEdit]) {
                ds.items[i][this._layoutDeclare['menu'].ColumnEdit] = value;// eval(value).toString();
                ds.itemsAdded[i][this._layoutDeclare['menu'].ColumnEdit] = value;// eval(value).toString();
              }
              else {
                ds.items[i][this._layoutDeclare['menu'].ColumnEdit] = value + 1;// eval(value + 1).toString();
                ds.itemsAdded[i][this._layoutDeclare['menu'].ColumnEdit] = value + 1;//eval(value + 1).toString();
              }
            }

          }
        }

          if (_duplicate) {
            //console.log('Add quantity when duplicate')
          }
          else {
            if (data[row][this._layoutDeclare['menu'].ColumnEdit] == '0') {
              data[row][this._layoutDeclare['menu'].ColumnEdit] = 1
            }
            ds.itemsAdded.push(data[row]);
            ds.sourceCollection.push(data[row]);
          }

        }
      }
      else {
        ////console.log('chỉnh sửa');
        let _duplicate = false;
        for (let row in data) {
          let indexEdit = 0;
          if (!_seperate)
          {

          let _arrNumRowDup = [];
          let _numRowDupMax = 0
          for (let i = 0; i < ds.items.length; i++) {
            if (ds.items[i][this._layoutDeclare['menu'].DuplicationField] == data[row][this._layoutDeclare['menu'].DuplicationField])
            {
              _arrNumRowDup.push(i);
            }
            _numRowDupMax = Math.max(..._arrNumRowDup);
          }

          for (let i = 0; i < ds.items.length; i++) {
            
            if (ds.items[i][this._layoutDeclare['menu'].DuplicationField] == data[row][this._layoutDeclare['menu'].DuplicationField] && i == _numRowDupMax) {
             
              //let value = eval(ds.items[i][this._layoutDeclare['menu'].ColumnEdit]);
              let value = eval(data[row][this._layoutDeclare['menu'].ColumnEdit]);
              value = Number(value);
              _duplicate = true;

              // ds.items[i][this._layoutDeclare['menu'].ColumnEdit] = eval(value + 1).toString();



              if (value != ds.items[i][this._layoutDeclare['menu'].ColumnEdit]) {
                ds.items[i][this._layoutDeclare['menu'].ColumnEdit] = value;// eval(value).toString();
                if (ds.itemsEdited.length > 0) {
                  if (ds.itemsEdited[i]) {
                    if (ds.itemsEdited[i][this._layoutDeclare['menu'].DuplicationField] == data[row][this._layoutDeclare['menu'].DuplicationField]) {
                      //ds.itemsEdited[i][this._layoutDeclare['menu'].ColumnEdit] = eval(value + 1).toString();
                      ds.itemsEdited[i][this._layoutDeclare['menu'].ColumnEdit] = value ;//eval(value).toString();
                    }
                  }
                }
                if (ds.itemsAdded.length > 0) {
                  if (ds.itemsAdded[i]) {
                    if (ds.itemsAdded[i][this._layoutDeclare['menu'].DuplicationField] == data[row][this._layoutDeclare['menu'].DuplicationField]) {
                      //ds.itemsAdded[i][this._layoutDeclare['menu'].ColumnEdit] = eval(value + 1).toString();
                      ds.itemsAdded[i][this._layoutDeclare['menu'].ColumnEdit] = value;// eval(value).toString();
                    }
                  }
                }
              }
              else {
                ds.items[i][this._layoutDeclare['menu'].ColumnEdit] = value + 1;// eval(value + 1).toString();
                if (ds.itemsEdited.length > 0) {
                  if (ds.itemsEdited[i]) {
                    if (ds.itemsEdited[i][this._layoutDeclare['menu'].DuplicationField] == data[row][this._layoutDeclare['menu'].DuplicationField]) {
                      //ds.itemsEdited[i][this._layoutDeclare['menu'].ColumnEdit] = eval(value + 1).toString();
                      ds.itemsEdited[i][this._layoutDeclare['menu'].ColumnEdit] = value +1;// eval(value + 1).toString();
                    }
                  }
                }
                if (ds.itemsAdded.length > 0) {
                  if (ds.itemsAdded[i]) {
                    if (ds.itemsAdded[i][this._layoutDeclare['menu'].DuplicationField] == data[row][this._layoutDeclare['menu'].DuplicationField]) {
                      //ds.itemsAdded[i][this._layoutDeclare['menu'].ColumnEdit] = eval(value + 1).toString();
                      ds.itemsAdded[i][this._layoutDeclare['menu'].ColumnEdit] = value + 1;//eval(value + 1).toString();
                    }
                  }
                }
              }
            }

          }
        }

          if (_duplicate) {
            //console.log('Add quantity when duplicate')
          }
          else {

            if (data[row][this._layoutDeclare['menu'].ColumnEdit] == '0') {
              data[row][this._layoutDeclare['menu'].ColumnEdit] = 1;
            }
            ds.itemsAdded.push(data[row]);
            ds.sourceCollection.push(data[row]);
          }

        }
      }
    }
    else
      gridtmp.itemsSource.sourceCollection = [];


    gridtmp.itemsSource.refresh();



    for (let i = 0; i < this.dataItem.length; i++) {
      let value: number = 0;

      for (let j = 0; j < this.gridArray[0].itemsSource.items.length; j++) {

        if (this.dataItem[i][this._layoutDeclare['menu'].PrimaryField] == this.gridArray[0].itemsSource.items[j][this._layoutDeclare['menu'].DuplicationField]) {
          this.gridArray[0].itemsSource.currentItem = this.gridArray[0].itemsSource.items[j];
          await this.dfpanel.runEvaluatorChild('Evaluator_ServerConstraint_QuyDoi_TrongLuongThep', j);
          await this.dfpanel.runEvaluatorChild('Evaluator_TotalQuantity_Calculate',j);
          value += Number(this.gridArray[0].itemsSource.items[j][this._layoutDeclare['menu'].ColumnEdit]);
          this.dataItem[i][this._layoutDeclare['menu'].ColumnInput]= this.gridArray[0].itemsSource.items[j][this._layoutDeclare['menu'].ColumnEdit];
        }
      }

      this.dataItem[i][this._layoutDeclare['menu'].ColumnShow] = value.toString();
      
    }

    this.rowAddedEvent(this.gridArray[0]);
    this.resetBuiltinOrder(this.gridArray[0]);
  }

  async subItemToRow(item: any, gridIndex: number, arr: any) {

    let gridtmp: wjcGrid.FlexGrid = this.gridArray[gridIndex];
    let _colData = new Array();

    _colData = arr;
    for (let control in _colData) {
      if (_colData[control].toString().indexOf('{EXPR=') > -1) {
        _colData[control] = this.dfpanel.translate_expr_control(_colData[control], item, gridtmp.itemsSource['defaultRow']);
      }

      if (_colData[control].toString().indexOf('{VAR=') > -1)
        _colData[control] = Global.convertConfig(_colData[control]);

      _colData[control] = this.dfpanel.replaceString(_colData[control], "'");

    }
    let data = new Array<Object>();
    //let data2 = new Array<Object>();

    data[0] = _colData;
    //data2[0] = _colData;


    if (data.length > 0) {
      let ds: CollectionView = gridtmp.itemsSource;

      if (this.id == -1 || this.id == undefined) {
        //console.log('thêm mới');


        let _duplicate = false;
        for (let row in data) {
          let indexEdit = 0;
          for (let i = 0; i < ds.items.length; i++) {

            if (ds.items[i][this._layoutDeclare['menu'].DuplicationField] == data[row][this._layoutDeclare['menu'].DuplicationField]) {

              // let value = eval(ds.items[i][this._layoutDeclare['menu'].ColumnEdit]);


              // _duplicate = true;
              // //ds.remove(ds.itemsRemoved[i]);
              // console.log(ds);
              // ds.items[i][this._layoutDeclare['menu'].ColumnEdit] = eval(value + 1).toString();
              // ds.itemsAdded[i][this._layoutDeclare['menu'].ColumnEdit] = eval(value + 1).toString();

              let value = eval(data[row][this._layoutDeclare['menu'].ColumnEdit]);
              value = Number(value);
              _duplicate = true;

              if (value != ds.items[i][this._layoutDeclare['menu'].ColumnEdit]) {
                ds.items[i][this._layoutDeclare['menu'].ColumnEdit] = value ;//eval(value).toString();
                ds.itemsAdded[i][this._layoutDeclare['menu'].ColumnEdit] = value;// eval(value).toString();
              }
              else {
                if (value > 1) {
                  ds.items[i][this._layoutDeclare['menu'].ColumnEdit] = value + 1;// eval(value + '-1').toString();
                  ds.itemsAdded[i][this._layoutDeclare['menu'].ColumnEdit] = value + 1;// eval(value + '-1').toString();
                }
                else {
                  alert('Số lượng đặt hàng không hợp lệ!')
                }
              }
            }

          }

          if (_duplicate) {
            //console.log('Add quantity when duplicate')
          }
          else {
            if (data[row][this._layoutDeclare['menu'].ColumnEdit] == '0') {
              //data[row][this._layoutDeclare['menu'].ColumnEdit] = '-1'
              alert('Số lượng đặt hàng không hợp lệ!')
            }
            else {
              ds.itemsAdded.push(data[row]);
              ds.sourceCollection.push(data[row]);
            }

          }

        }
      }
      else {
        //console.log('chỉnh sửa');
        let _duplicate = false;
        for (let row in data) {
          let indexEdit = 0;
          for (let i = 0; i < ds.items.length; i++) {

            if (ds.items[i][this._layoutDeclare['menu'].DuplicationField] == data[row][this._layoutDeclare['menu'].DuplicationField]) {
              //let value = eval(ds.items[i][this._layoutDeclare['menu'].ColumnEdit]);
              let value = eval(data[row][this._layoutDeclare['menu'].ColumnEdit]);
              value = Number(value);
              if (value <= 1) {
                alert('Số lượng đặt hàng không hợp lệ!')
                return;
              }

              _duplicate = true;

              // ds.items[i][this._layoutDeclare['menu'].ColumnEdit] = eval(value + 1).toString();


              if (value != ds.items[i][this._layoutDeclare['menu'].ColumnEdit]) {
                ds.items[i][this._layoutDeclare['menu'].ColumnEdit] = value;// eval(value).toString();
                if (ds.itemsEdited.length > 0) {
                  if (ds.itemsEdited[i]) {
                    if (ds.itemsEdited[i][this._layoutDeclare['menu'].DuplicationField] == data[row][this._layoutDeclare['menu'].DuplicationField]) {
                      //ds.itemsEdited[i][this._layoutDeclare['menu'].ColumnEdit] = eval(value + 1).toString();
                      ds.itemsEdited[i][this._layoutDeclare['menu'].ColumnEdit] = value;// eval(value).toString();
                    }
                  }
                }
                if (ds.itemsAdded.length > 0) {
                  if (ds.itemsAdded[i]) {
                    if (ds.itemsAdded[i][this._layoutDeclare['menu'].DuplicationField] == data[row][this._layoutDeclare['menu'].DuplicationField]) {
                      //ds.itemsAdded[i][this._layoutDeclare['menu'].ColumnEdit] = eval(value + 1).toString();
                      ds.itemsAdded[i][this._layoutDeclare['menu'].ColumnEdit] = value;// eval(value).toString();
                    }
                  }
                }
              }
              else {
                ds.items[i][this._layoutDeclare['menu'].ColumnEdit] = value - 1;// eval(value + '-1').toString();
                if (ds.itemsEdited.length > 0) {
                  if (ds.itemsEdited[i]) {
                    if (ds.itemsEdited[i][this._layoutDeclare['menu'].DuplicationField] == data[row][this._layoutDeclare['menu'].DuplicationField]) {
                      //ds.itemsEdited[i][this._layoutDeclare['menu'].ColumnEdit] = eval(value + 1).toString();
                      ds.itemsEdited[i][this._layoutDeclare['menu'].ColumnEdit] = value -1;// eval(value + '-1').toString();
                    }
                  }
                }
                if (ds.itemsAdded.length > 0) {
                  if (ds.itemsAdded[i]) {
                    if (ds.itemsAdded[i][this._layoutDeclare['menu'].DuplicationField] == data[row][this._layoutDeclare['menu'].DuplicationField]) {
                      //ds.itemsAdded[i][this._layoutDeclare['menu'].ColumnEdit] = eval(value + 1).toString();
                      ds.itemsAdded[i][this._layoutDeclare['menu'].ColumnEdit] = value -1;// eval(value + '-1').toString();
                    }
                  }
                }
              }
            }
          }

          if (_duplicate) {
            //console.log('Add quantity when duplicate')
          }
          else {
            if (data[row][this._layoutDeclare['menu'].ColumnEdit] == '0') {
              data[row][this._layoutDeclare['menu'].ColumnEdit] = -1;
            }
            ds.itemsAdded.push(data[row]);
            ds.sourceCollection.push(data[row]);
          }

        }
      }
    }
    else
      gridtmp.itemsSource.sourceCollection = [];


    gridtmp.itemsSource.refresh();

    for (let i = 0; i < this.dataItem.length; i++) {
      let value: number = 0;

      for (let j = 0; j < this.gridArray[0].itemsSource.items.length; j++) {

        if (this.dataItem[i][this._layoutDeclare['menu'].PrimaryField] == this.gridArray[0].itemsSource.items[j][this._layoutDeclare['menu'].DuplicationField]) {
          this.gridArray[0].itemsSource.currentItem = this.gridArray[0].itemsSource.items[j];
          await this.dfpanel.runEvaluatorChild('Evaluator_ServerConstraint_QuyDoi_TrongLuongThep', j);
          await this.dfpanel.runEvaluatorChild('Evaluator_TotalQuantity_Calculate',j);
          value += Number(this.gridArray[0].itemsSource.items[j][this._layoutDeclare['menu'].ColumnEdit]);
          this.dataItem[i][this._layoutDeclare['menu'].ColumnInput]= this.gridArray[0].itemsSource.items[j][this._layoutDeclare['menu'].ColumnEdit];
        }
      }

      this.dataItem[i][this._layoutDeclare['menu'].ColumnShow] = value.toString();
      
    }

  }
}
