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
import { LayoutProposedPurchaseExplorer } from '../Layout';
import { BaseExplorerComponent } from '../../_baseform/base-explorer.component';
import { BaseEditorService } from '../../../base/base.service-editor';
import { BaseExplorerService } from '../../../base/base.service-explorer';
import { forEach } from '@angular/router/src/utils/collection';
import { DialogComponent } from '../../../ui/dialog/dialog.component';
import { Title } from '@angular/platform-browser';
import { LayoutPrinter } from './proposedpurchase-printer.data';

@Component({
  selector: 'proposedpurchase-explorer',
  templateUrl: './proposedpurchase-explorer.component.html',
  styleUrls: ['./proposedpurchase-explorer.component.css'],
  
})

export class ProposedPurchaseExplorerComponent extends BaseExplorerComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('gridChild') gridChild: wjcGrid.FlexGrid;
  @ViewChild('contentFilter') contentFilter: ElementRef;

  @ViewChild('dialogFrm') dialogFrm: DialogComponent;
  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;

  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

  layoutPrint: LayoutPrinter = new LayoutPrinter();

  pathPage = ['/main', 'proposedpurchase', 'detail'];
  _layoutDeclare: LayoutProposedPurchaseExplorer = new LayoutProposedPurchaseExplorer();
  
  constructor(srv: BaseExplorerService,
    router: Router,
    ics: InputControlService, titleService: Title,route: ActivatedRoute) {
      super(srv, router, ics, titleService,route)
    this.zParentTableName = this._layoutDeclare.layout.Structure.Parent.Name;
    this.zFilterKey = this._layoutDeclare.layout.Structure.Parent.FilterKey;
    this.rowPage = this._layoutDeclare.layout.Structure.Parent.RowPage;
    this.fieldOrderBy = this._layoutDeclare.layout.Structure.Parent.OrderBy;
    this.zMenuTableName = this._layoutDeclare.menu.Table;
    this.zMenuFilterKey = this._layoutDeclare.menu.Filter;
    this.pageNumber = 1;
    this._layoutPrinter = this.layoutPrint.Layout;
  }

  async ngOnInit() {
    await this.init(this.pathPage).then();
    this.grid.rowHeaders.columns.maxSize = 2;
  }

  ngAfterViewInit() {

    this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;


        if (data.groupDescription == undefined && data['NotApproveSend'] == true) {
          wjcCore.setCss(e.cell, {
            backgroundColor: '#FA8072', //
            fontWeight: '', //bold
          });

        }

        else {
          wjcCore.setCss(e.cell, {
            backgroundColor: '',
          });
        }


        if (data.groupDescription != undefined) {
          let flag = false;
          for (let i in data.items) {
            if (data.items[i]['NotApproveSend'] == true) {
              flag = true;
            }
          }

          if (flag) {
            wjcCore.setCss(e.cell, {
              backgroundColor: '#FA8072',
              fontWeight: '',
            });
          }
        }

      }
    });

    
  }

  resizeWidthControls() { }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: FormGroup) {
    this.submit(formData);
  }

  getPercent(num1: number, num2: number) {
    return Math.round((num1 / num2) * 100).toString() + '%';
  }

  private _groupBy = 'DocStatusName';
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
    // if (this.grid.collectionView) {
    //     var cv = this.grid.collectionView;
    //     cv.beginUpdate();
    //     cv.groupDescriptions.clear();

    //     var groupDesc = new wjcCore.PropertyGroupDescription('ProductName');
    //     cv.groupDescriptions.push(groupDesc);

    //     cv.endUpdate();
    // }
    var cv = this.grid.collectionView;
    if (cv != null) {

      cv.beginUpdate();
      cv.groupDescriptions.clear();
      if (this.groupBy) {
        var groupNames = this.groupBy.split(',');
        for (var i = 0; i < groupNames.length; i++) {
          var groupName = groupNames[i];
          if (groupName == 'date') { // group dates by year
            var groupDesc = new wjcCore.PropertyGroupDescription(groupName, function (item, prop) {
              return item.date.getFullYear();
            });
            cv.groupDescriptions.push(groupDesc);
          } else if (groupName == 'amount') { // group amounts in ranges
            var groupDesc = new wjcCore.PropertyGroupDescription(groupName, function (item, prop) {
              return item.amount >= 5000 ? '> 5,000' : item.amount >= 500 ? '500 to 5,000' : '< 500';
            });
            cv.groupDescriptions.push(groupDesc);
          } else { // group everything else by value
            var groupDesc = new wjcCore.PropertyGroupDescription(groupName);
            cv.groupDescriptions.push(groupDesc);
          }
        }
        cv.refresh();
      }
      cv.endUpdate();
      this.grid.groupHeaderFormat = '<b>{value}</b> ({count:n0} mục) ';
    }
    this.grid.collapseGroupsToLevel(1);
  }

  showPrintVoucher(flex: wjcGrid.FlexGrid, layoutName?: string) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

    let html = this.printVoucher(flex, layoutName);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  splitButtonItemClicked(s: wjcInput.WjMenu, e: wjcCore.EventArgs) {
    var menu = s;

    if (menu.isDroppedDown) {
      // the click was on a menu item
      //alert('option **' + menu.selectedItem.value + '** is now the default');
      //this.editExplorer(this.grid,this.pathPage);


      if (menu.selectedItem.value == 'CalPrice') {
        let _idxColHdr = this.grid.selection.col;
        let _colName = this.grid.columnHeaders.columns[_idxColHdr]['binding']

        this.openWizardWithParams(['/main', 'wizardcalcprice', 'wizard'],this.grid.selectedRows[0].dataItem);
        
        // console.log(_idxColHdr);
        // console.log(this.grid.columnHeaders.columns[_idxColHdr]['header']);
        // console.log(this.grid.selectedRows[0].dataItem[_colName]);

        // alert(this.grid.columnHeaders.columns[_idxColHdr]['header'] + '  -  ' + this.grid.selectedRows[0].dataItem[_colName]);
      }
      if (menu.selectedItem.value == 'ReadXML') {
        this.realXML();
      }
    } else {
      // the click was on the button
      alert('running **' + menu.selectedItem.value + '**');
    }
  }

  openWizardWithParams(navigateUrl: any[], data: any) {
    let self = this;

    navigateUrl[0] = '#/main';
    navigateUrl.push(this._layoutDeclare.linkwizard.key);

    let paramsEdit = this._layoutDeclare.linkwizard.parameter;

    for (let control in paramsEdit) {

      if (paramsEdit[control].toString().indexOf('{EXPR=') > -1) {
        paramsEdit[control] = this.translate_Parameter_Explorer(paramsEdit[control], data);
        if (paramsEdit[control].toString().indexOf('?') > -1)
          paramsEdit[control] = eval(paramsEdit[control]);
      }

      if (paramsEdit[control].toString().indexOf('{VAR=') > -1)
        paramsEdit[control] = Global.convertConfig(paramsEdit[control]);

      paramsEdit[control] = this.replaceString(paramsEdit[control], "'");
    }

    if (paramsEdit != undefined && paramsEdit != null)
      navigateUrl.push(JSON.stringify(paramsEdit));

    window.open(navigateUrl.join('/'));
  }

  realXML() {
    let layoutWWeb = [];

    var parseString = require('xml2js').parseString;
    var xml = `<Cols>
<Column_Code>
  <Name>Code</Name>
  <Style>TextAlign:LeftTop;</Style>
  <Rows>
    <Row_0>
      <Caption>
        <Vietnamese>Mã Bravo</Vietnamese>
        <English>Key</English>
        <Chinese>关键</Chinese>
        <Japanese>キー</Japanese>
        <Custom>키.</Custom>
      </Caption>
    </Row_0>
  </Rows>
</Column_Code>
<Column_Code1>
  <Name>Code1</Name>
  <Rows>
    <Row_0>
      <Caption>
        <Vietnamese>Mã </Vietnamese>
      </Caption>
    </Row_0>
  </Rows>
  <Style>TextAlign:LeftTop;</Style>
</Column_Code1>
<Column_Name>
  <Name>Name</Name>
  <Width>354</Width>
  <Style>TextAlign:LeftTop;</Style>
  <Rows>
    <Row_0>
      <Caption>
        <Vietnamese>Tên bộ phận  </Vietnamese>
        <English>Name</English>
        <Chinese>名称</Chinese>
        <Japanese>名前</Japanese>
        <Custom>이름.</Custom>
      </Caption>
    </Row_0>
  </Rows>
</Column_Name>
<Column_BranchCode>
  <Name>BranchCode</Name>
  <Style>TextAlign:LeftTop;</Style>
  <Width>121</Width>
</Column_BranchCode>
</Cols>`
let colOutput = [];
    parseString(xml, function (err, result) {

      
      let _listCol = 'BranchCode,Code,Code1,Name';
      let colArr = _listCol.split(',');

      let tempData = result['Cols'];
      let colList = [];
      for(let i in colArr)
      {
        colList.push(tempData['Column_' + colArr[i]][0]);
      }
      for(let col in colList)
      {

        colOutput.push({
            'header': colList[col]['Name'][0], 'binding':colList[col]['Name'][0]
        })
      }

    });

    for(let _c in colOutput)
    {
      this._layoutDeclare.parentGrid.push(colOutput[_c]);
    }
    
    this.grid.columns.clear();
    this.createColumnGroups(this.grid,this._layoutDeclare.parentGrid,0);
  
  }
  showDivDisplay(id: string, disId: string)
  {
    document.getElementById(id).style.display = 'block';
    document.getElementById(disId).style.display = 'none';    
  }
}
