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
import { LayoutSupplierQuotesInviteEditor } from "../Layout";
import { Title } from "@angular/platform-browser";

import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { SystemConstants } from "../../../core/common/system.constants";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { UrlConstants } from "../../../core/common/url.constants";

@Component({
  selector: 'app-supplierquotesinvite-editor-form',
  templateUrl: './supplierquotesinvite-editor.component.html',
  styleUrls: ['./supplierquotesinvite-editor.component.css']
})

export class SupplierQuotesInviteEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;


  indexPage = ['/main', 'supplierquotesinvite', 'index'];
  indexPage_Editor = ['/main', 'supplierquotesinvite', 'detail'];
  folderName = '11.Bao_Gia_Nha_Cung_Cap';

  output: Array<Object>;
  _errQR: boolean = false;
  _errMess: string;

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutSupplierQuotesInviteEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.checkQRIsDone(this.id).then(() => {
      if (this._errQR == true) {
        alert(this._errMess);
        this.router.navigate([UrlConstants.HOME]);
      }
    });
    this.gridArray = [this.grid];
    this.init();
    this.grid.allowAddNew = false;
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
  }

  onSubmit(formData: any, isDone?: boolean) {
    let _errorSave = false;
    for (let item of this.grid.itemsSource.items) {
      if (item['TradeMarkCode'] == '' || item['TradeMarkCode'] == undefined || item['ItemCode'] == '' || item['ItemCode'] == undefined) {
        _errorSave = true;
        break;
      }
    }

    if (isDone === true) {
      this.editorFrm.controls['IsDone'].setValue(true);
      this.parentData['IsDone'] = true;
      this.dfpanel.parentData['IsDone'] = true;
    }

    if (_errorSave == false) {
      this.checkUniqueColGrid(this.grid).then(() => {
        if (this._errorUnique == false) {
          this.submit(formData, this.indexPage_Editor).then(() => {
            if (isDone === true) {
              this.getInfoTemplateMail(this.editorFrm, this.id, '3');
            }
          })
        }
        else
          alert('Mã hàng và Thương hiệu không được trùng, giá trị: ' + this._valueDuplicate);
      });
    }
    else
      alert('Thương hiệu, mã hàng - không được bỏ trắng giá trị!');
  }

  async checkUniqueColGrid(flex: wjcGrid.FlexGrid) {
    if (flex) {
      let _arr: any = flex.itemsSource.items;

      this._errorUnique = false;

      for (let i = 0; i < _arr.length; i++) {
        for (let j = i + 1; j < _arr.length; j++) {
          if (_arr[i]['ItemCode'] == _arr[j]['ItemCode'] && _arr[i]['TradeMarkCode'] == _arr[j]['TradeMarkCode']) {
            this._errorUnique = true;
            this._valueDuplicate = _arr[i]['ItemCode'] + ' - ' + _arr[i]['TradeMarkCode'];
            break;
          }
        }
        if (this._errorUnique == true) break;
      }
    }
  }

  async checkQRIsDone(id: number) {
    this.showLoading = true;
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('BranchCode');
    param1.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
    params.push(param1);

    param2.ParameterName = Global.convertParameterName('Id');
    param2.ParameterValue = this.id;
    params.push(param2);

    param3.ParameterName = Global.convertParameterName('nUserId');
    param3.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID);
    params.push(param3); 

    let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_TMCtc_CheckBizDocQR_IsDone', params)
      .toPromise().then();

    this.output = <Array<Object>>(_data['output']);
    this._errQR = this.output['@_Error'];
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

  ngOnDestroy() {
    this.destroy();
  }

  deleteSelectedRows(flex: wjcGrid.FlexGrid) {
    if (flex) {
      var selected = [];

      for (let k in flex.selectedRows) {
        let _idrowdel = flex.selectedRows[k]._idx;
        for (var i = 0; i < flex.rows.length; i++) {
          if (i == _idrowdel) {
            selected.push(flex.rows[i].dataItem);
            break;
          }
        }
      }

      for (var i = 0; i < selected.length; i++) {
        flex.itemsSource.remove(selected[i]);
      }
    }
  }

  private _groupBy = 'TradeMarkCode';
  get groupBy(): string {
    return this._groupBy;
  }
  set groupBy(value: string) {
    if (this._groupBy != value) {
      this._groupBy = value;
      this._applyGroup();
    }
  }

  _applyGroup() {
    var cv = this.grid.collectionView;
    if (cv != null) {

      cv.beginUpdate();
      cv.groupDescriptions.clear();
      if (this.groupBy) {
        var groupNames = this.groupBy.split(',');
        for (var i = 0; i < groupNames.length; i++) {
          var groupName = groupNames[i];
          // group everything else by value
          var groupDesc = new wjcCore.PropertyGroupDescription(groupName);
          cv.groupDescriptions.push(groupDesc);
        }
        cv.refresh();
      }
      cv.endUpdate();
      this.grid.groupHeaderFormat = '<b>{value}</b> ({count:n0} mục) ';
    }
    this.grid.collapseGroupsToLevel(0);
  }
}
