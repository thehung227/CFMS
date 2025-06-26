import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../../ui/ui.module';

import * as wjOData from 'wijmo/wijmo.odata';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcInput from 'wijmo/wijmo.angular2.input';
import * as wjcGridDetail from 'wijmo/wijmo.grid.detail';

import * as moment from 'moment';

import { InputControlService } from './../../../ui/input/InputControlService';

import { Global } from './../../../shared/global';
import { Router, ActivatedRoute } from '@angular/router';

import { InputBase } from './../../../ui/input/InputBase';
import { DropDownInput } from './../../../ui/input/DropDownInput';
import { TextBoxInput } from './../../../ui/input/TextBoxInput';
import { DateBoxInput } from './../../../ui/input/DateBoxInput';
import { NumberBoxInput } from './../../../ui/input/NumberBoxInput';
import { CheckBoxInput } from './../../../ui/input/CheckBoxInput';

import { ParameterContract } from './../../../contracts/parameter.contract';
import { BravoCtorEnum } from './../../../core/enum/type.enum';
import { LayoutSetlementStatusExplorer } from '../Layout';
import { BaseExplorerComponent } from '../../_baseform/base-explorer.component';
import { BaseEditorService } from '../../../base/base.service-editor';
import { BaseExplorerService } from '../../../base/base.service-explorer';
import { forEach } from '@angular/router/src/utils/collection';
import { DialogComponent } from '../../../ui/dialog/dialog.component';
import { Title } from '@angular/platform-browser';
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';
import { MailForm } from '../../../ui/mail-form/mail-form';
import { Expression } from '../../../shared/expression';
import { SystemConstants } from '../../../core/common/system.constants';

@Component({
  selector: 'setlementstatus-explorer',
  templateUrl: './setlementstatus-explorer.component.html',
  styleUrls: ['./setlementstatus-explorer.component.css']
})

export class SetlementStatusExplorerComponent extends BaseExplorerComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('gridChild') gridChild: wjcGrid.FlexGrid;
  @ViewChild('contentFilter') contentFilter: ElementRef;
  @ViewChild('dialogFrm') dialogFrm: DialogComponent;
  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;
  @ViewChild('inputTime') inputTime: ElementRef;
  @ViewChild('inputPlace') inputPlace: ElementRef;
  
  pathPage = ['/main', 'setlementstatus', 'detail'];
  _layoutDeclare: LayoutSetlementStatusExplorer = new LayoutSetlementStatusExplorer();
  showButtonCancelPO = false;
  folderNameSendMail = 'TinhTrangQTDuAn';

  output: Array<Object>;
  _errBCTC: boolean = false;
  _errMess: string;
  
  constructor(private srv: BaseExplorerService, router: Router, ics: InputControlService, titleService: Title, route: ActivatedRoute) {
    super(srv, router, ics, titleService, route)
    this.zParentTableName = this._layoutDeclare.layout.Structure.Parent.Name;
    this.zFilterKey = this._layoutDeclare.layout.Structure.Parent.FilterKey;
    this.rowPage = this._layoutDeclare.layout.Structure.Parent.RowPage;
    this.fieldOrderBy = this._layoutDeclare.layout.Structure.Parent.OrderBy;

    this.pageNumber = 1;

    // this.zMenuTableNameLookup1 = this._layoutDeclare.lookup1.Table;
    // this.zMenuFilterKeyLookup1 = this._layoutDeclare.lookup1.Filter;
    // this.zMenuColumnFilterLookup1 = this._layoutDeclare.lookup1.ColumnFilter;
    // this.zMenuTableNameLookup2 = this._layoutDeclare.lookup2.Table;
    // this.zMenuFilterKeyLookup2 = this._layoutDeclare.lookup2.Filter;
    // this.zMenuColumnFilterLookup2 = this._layoutDeclare.lookup2.ColumnFilter;

    // this.zMenuTableNameLookup3 = this._layoutDeclare.lookup3.Table;
    // this.zMenuFilterKeyLookup3 = this._layoutDeclare.lookup3.Filter;
  }

  async ngOnInit() {
    await this.init(this.pathPage).then();
    this.grid.columns[0].width = 45;

    this.grid.rowHeaders.columns.maxSize = 2;
  }

  ngAfterViewInit() {

  }

  private _groupBy = 'TypeXDME';
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
    this.grid.collapseGroupsToLevel(1);
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: FormGroup) {
    this.submit(formData);
  }

async cancelPOSupplier(grid: wjcGrid.FlexGrid) {
    if (grid.collectionView.currentItem != null) {
      // // this.getInfoTemplateMail(grid.collectionView.currentItem, grid.collectionView.currentItem['Id'], 'x');
      let reason = prompt("Bạn đang yêu cầu HỦY ĐƠN HÀNG MUA. Vui lòng nhập Lý do hủy đơn hàng:");
      if (reason) {
        if (this._layoutDeclare.layout.CancelMail) {
          let _eval = Expression.translateParameter(this._layoutDeclare.layout.CancelMail.Expr, grid.selectedItems[0]);
          if (eval(_eval)) {
            const params = new Array<ParameterContract>();
            const param1 = new ParameterContract();
            const param2 = new ParameterContract();
            const param3 = new ParameterContract();
            const param4 = new ParameterContract();
            const param5 = new ParameterContract();

            // param1.ParameterName = Global.convertParameterName('Id');
            // param1.ParameterValue = grid.selectedItems[0]['Id'];
            // params.push(param1);

            param2.ParameterName = Global.convertParameterName('DocCode');
            param2.ParameterValue = grid.selectedItems[0]['DocCode'];
            params.push(param2);

            param3.ParameterName = Global.convertParameterName('Reason');
            param3.ParameterValue = reason;
            params.push(param3);

            param4.ParameterName = Global.convertParameterName('nUserId');
            param4.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID).replace(/"/gi, '');
            params.push(param4);

            param5.ParameterName = Global.convertParameterName('BranchCode');
            param5.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
            params.push(param5);

            let _data = await this.srv.postData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, this._layoutDeclare.layout.CancelMail.Command, params)
              .toPromise().then();

            alert('Thông báo gửi mail: ' + _data[0]['Column1']);
          }
          else
            alert(this._layoutDeclare.layout.CancelMail.Message);
        }
        else
          alert('Chưa khai báo thông tin gửi mail');
      }
      else
        alert("Yêu cầu không thành công. Bạn chưa cung cấp Lý do hủy đơn hàng.");
    }
    else
      alert("Vui lòng chọn 01 đơn hàng để thực hiện.");
  }

  reSendMailPOSupplier(grid: wjcGrid.FlexGrid) {
    if (grid.collectionView.currentItem != null)
      this.getInfoTemplateMail(grid.collectionView.currentItem, grid.collectionView.currentItem['Id'], '2').then(() => {
        this.updateSendMailSupplier(grid.collectionView.currentItem['Id']);
      });
  }
async updateSendMailSupplier(id: any) {
    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('Id');
    param1.ParameterValue = id
    params.push(param1);

    let _data = await this.srv.postData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_TMCtc_UpdateSendMailSupplier', params)
      .toPromise().then();
  }

  async sendMail(mailForm: MailForm, flex: wjcGrid.FlexGrid) {
  
    const params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('Id');
    param1.ParameterValue = flex.selectedItems[0]['Id'];
    params.push(param1);

    let _data = await this.srv.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_B30Budget_GetInfoSendMail', params)
    .toPromise().then();

    this.output = <Array<Object>>(_data['output']);
  
    this.inputTo['nativeElement'].value = this.output['@_EmailTo'];
    this.inputCC['nativeElement'].value = this.output['@_EmailCC'];
    this.inputSubject['nativeElement'].value = this.output['@_Subject'];
   
    mailForm.show();
  }

  async sendMailStore(grid: wjcGrid.FlexGrid) {
    // if (grid.collectionView.currentItem != null) {
      const params = new Array<ParameterContract>();
      const param1 = new ParameterContract();
      const param2 = new ParameterContract();
      const param3 = new ParameterContract();
      const param4 = new ParameterContract();
      const param5 = new ParameterContract();
      const param6 = new ParameterContract();


      param1.ParameterName = Global.convertParameterName('Id');
      param1.ParameterValue = grid.selectedItems[0]['Id'];
      params.push(param1);

      param2.ParameterName = Global.convertParameterName('EmailTo');
      param2.ParameterValue = this.inputTo['nativeElement'].value;
      params.push(param2);

      param3.ParameterName = Global.convertParameterName('EmailCC');
      param3.ParameterValue = this.inputCC['nativeElement'].value;
      params.push(param3);

      param4.ParameterName = Global.convertParameterName('Subject');
      param4.ParameterValue = this.inputSubject['nativeElement'].value;
      params.push(param4);

      param5.ParameterName = Global.convertParameterName('AddressMeeting');
      param5.ParameterValue = this.inputPlace.nativeElement.value;
      params.push(param5);

      param6.ParameterName = Global.convertParameterName('TimeMeeting');
      param6.ParameterValue = this.inputTime.nativeElement.value;
      params.push(param6);

      let _data = await this.srv.postData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_B20Debt_ThuMoiHop', params)
        .toPromise().then();

        alert('Thông báo gửi mail: Thành công!');

        this.frmEmailPopup.hide();
  }


  getPercent(num1: number, num2: number) {
    return Math.round((num1 / num2) * 100).toString() + '%';
  }
}
