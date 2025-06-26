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
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';

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
import { LayoutPaymentProposalExplorer } from '../Layout';
import { BaseExplorerComponent } from '../../_baseform/base-explorer.component';
import { BaseEditorService } from '../../../base/base.service-editor';
import { BaseExplorerService } from '../../../base/base.service-explorer';
import { forEach } from '@angular/router/src/utils/collection';
import { DialogComponent } from '../../../ui/dialog/dialog.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'paymentproposal-explorer',
  templateUrl: './paymentproposal-explorer.component.html',
  styleUrls: ['./paymentproposal-explorer.component.css']
})

export class PaymentProposalExplorerComponent extends BaseExplorerComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('gridChild') gridChild: wjcGrid.FlexGrid;
  @ViewChild('contentFilter') contentFilter: ElementRef;
  @ViewChild('dialogFrm') dialogFrm: DialogComponent;
  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;
  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;

  pathPage = ['/main', 'paymentproposal', 'detail'];
  _layoutDeclare: LayoutPaymentProposalExplorer = new LayoutPaymentProposalExplorer();

  constructor(srv: BaseExplorerService,
    router: Router,
    ics: InputControlService, titleService: Title,route: ActivatedRoute) {
      super(srv, router, ics, titleService,route)
    this.zParentTableName = this._layoutDeclare.layout.Structure.Parent.Name;
    this.zFilterKey = this._layoutDeclare.layout.Structure.Parent.FilterKey;
    this.rowPage = this._layoutDeclare.layout.Structure.Parent.RowPage;
    this.fieldOrderBy = this._layoutDeclare.layout.Structure.Parent.OrderBy;
    this.pageNumber = 1;
  }

  async ngOnInit() {
    await this.init(this.pathPage).then();
    this.grid.columns[0].width = 45;
    this.grid.rowHeaders.columns.maxSize = 2;
  }

  ngAfterViewInit() {

    // this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

    //   if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
    //     let data = s.rows[e.row].dataItem;


    //     if (data.groupDescription == undefined && data['NotApproveSend'] == true) {
    //       wjcCore.setCss(e.cell, {
    //         backgroundColor: '#FA8072', //
    //         color:'#fff',
    //         fontWeight: '', //bold
    //       });

    //     }
    //     else {
    //       wjcCore.setCss(e.cell, {
    //         backgroundColor: '',
    //         color:''
    //       });
    //     }

    //     if (data.groupDescription != undefined) {
    //       let flag = false;
    //       for (let i in data.items) {
    //         if (data.items[i]['NotApproveSend'] == true) {
    //           flag = true;
    //         }
    //       }

    //       if (flag) {
    //         wjcCore.setCss(e.cell, {
    //           backgroundColor: '#FA8072',
    //         });
    //       }
    //     }

    //   }
    // });

  }

  onSubmit(formData: FormGroup) {
    this.submit(formData);
  }

  getPercent(num1: number, num2: number) {
    return Math.round((num1 / num2) * 100).toString() + '%';
  }

  
  
  showPrintVoucher(flex: wjcGrid.FlexGrid, layoutName?: string) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

    let html = this.printVoucher(flex,layoutName);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  ngOnDestroy() {
    this.destroy();
  }

}
