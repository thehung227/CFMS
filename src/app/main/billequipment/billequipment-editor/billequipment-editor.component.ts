import { Component, ViewChild, OnInit, OnDestroy, ElementRef, HostListener } from "@angular/core";
import { BaseEditorComponent } from "../../_baseform/base-editor.component";
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';
import { CollectionView } from 'wijmo/wijmo';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcInput from 'wijmo/wijmo.angular2.input';
import { DynamicFormPanelComponent } from "../../../ui/form/dynamic-form-panel.component";
import { BaseEditorService } from "../../../base/base.service-editor";
import { ActivatedRoute, Router } from "@angular/router";
import { PanelControlService } from "../../../ui/panel/PanelControlService";
import { LayoutBillEquipmentEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { SystemConstants } from "../../../core/common/system.constants";

@Component({
  selector: 'app-billequipment-editor-form',
  templateUrl: './billequipment-editor.component.html',
  styleUrls: ['./billequipment-editor.component.css']
})

export class BillEquipmentEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'billequipment', 'index'];
  indexPage_Editor = ['/main', 'billequipment', 'detail'];
  output: Array<Object>;
  _errBCTC: boolean = false;
  _errMess: string;
  showDialog2 = false;

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutBillEquipmentEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1];
    this.init();
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data['NoChangeInBill'] == false) {
            wjcCore.setCss(e.cell, {
              color: 'red',
              // fontWeight: '',
              // backgroundColor: ''
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

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any) {
    let _errorSave = false;
    for (let item of this.grid.itemsSource.items) {
      if (item['ProductCostId'] == '') {
        _errorSave = true;
        break;
      }
    }

    //if (this.taidulieu == true || this.id > 0) {
    this.checkUniqueColGrid(this.grid, 'ItemNo');
    if (this._errorUnique == false) {
      if (_errorSave == false) {
        this.postXML(formData).then(() => {
          if (this._errBCTC == false) {
            this.submit(formData, this.indexPage_Editor);
          }
          else
            alert(this._errMess);
        });
      }
      else
        alert('Mã gói thầu không được bỏ trống giá trị');
    }
    else
      alert('Số thứ tự không được trùng hoặc bỏ trống, giá trị: ' + this._valueDuplicate);
    //}
    //else
    //  alert('Yêu cầu "Tải dữ liệu" trước khi lập chi tiết khối lượng thanh toán');
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

  confirmDialog2() {
    if (this.editorFrm.valid) {
      this.showDialog2 = true;
    }
  }

  closeDialog2() {
    this.showDialog2 = false;
  }

  async postXML(formData: any) {
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();
    const param4 = new ParameterContract();
    const param5 = new ParameterContract();
    const param6 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('ProductCostId');
    param1.ParameterValue = formData.value['ProductCostId'];
    params.push(param1);

    param2.ParameterName = Global.convertParameterName('ParentBizDocId');
    param2.ParameterValue = formData.value['ParentBizDocId'];
    params.push(param2);

    param3.ParameterName = Global.convertParameterName('CustomerCode');
    param3.ParameterValue = formData.value['CustomerCode'];
    params.push(param3);

    param4.ParameterName = Global.convertParameterName('JobCode');
    param4.ParameterValue = formData.value['JobCode'];
    params.push(param4);

    let _value = formData.value['DocDate'];
    if (_value instanceof Date) {
      _value = _value.toISOString();
      param5.ParameterName = Global.convertParameterName('DocDate');
      param5.ParameterValue = _value;
      params.push(param5);
    }

    param6.ParameterName = Global.convertParameterName('BranchCode');
    param6.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
    params.push(param6);

    try {
      let paramXML = new ParameterContract();
      paramXML.ParameterName = this.convertParameterName('B30BizDocCCMDetail_Edit');
      paramXML.ParameterValue = 'B30BizDocCCMDetail_Edit';
      params.push(paramXML);

      let ds = Global.getDataSetContract(
        {
          name: 'B30BizDocCCMDetail_Edit',
          collection: this.grid.itemsSource.items
        }
      )

      let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Coteccons_BillThanhToan_CheckGiaTriThucHien_BCTCKHKK', params, ds)
        .toPromise().then();

      this.output = <Array<Object>>(_data['output']);
      this._errBCTC = this.output['@_Error'];
      this._errMess = this.output['@_ErrorMessage'];
      // this.dataAdjust = new wjcCore.CollectionView(_data['data'][0]);
      // this.gridAdjust.itemsSource = new wjcCore.CollectionView(_data['data'][0]);
      // this.dataEffective = new wjcCore.CollectionView(_data['data'][1]);
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async mergeDataGrid(formData: any) {
    this.showDialog2 = false;
    if (this.editorFrm.valid)
      this.showLoading = true;

    let cbSumValue = document.getElementsByName('ckbSumAmount')[0]['checked'];

    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();
    const param4 = new ParameterContract();
    const param5 = new ParameterContract();

    param1.ParameterName = this.convertParameterName('B30BizDocCCMDetail_Edit');
    param1.ParameterValue = 'B30BizDocCCMDetail_Edit';
    params.push(param1);

    param2.ParameterName = this.convertParameterName('B30BizDocCCMMedial_Edit');
    param2.ParameterValue = 'B30BizDocCCMMedial_Edit';
    params.push(param2);

    param3.ParameterName = this.convertParameterName('TaxCode');
    param3.ParameterValue = formData.value['TaxCode'];;
    params.push(param3);

    param4.ParameterName = this.convertParameterName('PayRequireNum');
    param4.ParameterValue = formData.value['PayRequireNum'];;
    params.push(param4);    

    param5.ParameterName = this.convertParameterName('MergeInvoice');
    param5.ParameterValue = cbSumValue;
    params.push(param5);     

    let gridtmp: wjcGrid.FlexGrid = this.gridArray[0];

    let ds;
    let XMLObject1;
    let XMLObject2;

    XMLObject1 = {
      name: 'B30BizDocCCMDetail_Edit',
      collection: this.gridArray[0].itemsSource.items
    }

    XMLObject2 = {
      name: 'B30BizDocCCMMedial_Edit',
      collection: this.gridArray[1].itemsSource.items
    }

    ds = Global.getDataSetContract(XMLObject1, XMLObject2);

    let data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_TMCtc_MergePurchaseBill', params, ds).toPromise();

    if (data['data'][0].length > 0) {
      let ds: CollectionView = gridtmp.itemsSource;

      var selected = [];
      for (let i = 0; i < gridtmp.rows.length; i++) {
        selected.push(gridtmp.rows[i].dataItem);
      }

      for (let i = 0; i < selected.length; i++) {
        ds.remove(selected[i]);
      }

      for (let row of data['data'][0]) {
        ds.itemsAdded.push(row);
        ds.sourceCollection.push(row);
      }

      for (let column of gridtmp.itemsSource['defaultRow']) {
        for (let row of gridtmp.itemsSource.sourceCollection) {
          if (row[column] == null || row[column] == undefined)
            row[column] = gridtmp.itemsSource['defaultRow'][column];
        }
      }

      // ds.sourceCollection = data;
    }
    else
      gridtmp.itemsSource.sourceCollection = [];

    gridtmp.itemsSource.refresh();

    this.showLoading = false;
  }
}
