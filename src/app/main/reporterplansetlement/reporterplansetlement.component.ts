import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import * as wjOData from 'wijmo/wijmo.odata';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcInput from 'wijmo/wijmo.angular2.input';

import { Global } from './../../shared/global';
import { BravoCtorEnum } from './../../core/enum/type.enum';

import { ActivatedRoute, Router } from '@angular/router';

import { InputBase } from './../../ui/input/InputBase';
import { LookupBoxInput } from './../../ui/input/LookupBoxInput';
import { TextBoxInput } from './../../ui/input/TextBoxInput';
import { DateBoxInput } from './../../ui/input/DateBoxInput';
import { NumberBoxInput } from './../../ui/input/NumberBoxInput';
import { CheckBoxInput } from './../../ui/input/CheckBoxInput';

import { ParameterContract } from './../../contracts/parameter.contract';

import { InputControlService } from './../../ui/input/InputControlService';

import { LayoutData } from './reporterplansetlement.data';

import * as CryptoJS from 'crypto-js';
import { Subscription } from 'rxjs/Subscription';
import { take } from 'rxjs/operator/take';
import { DynamicFormPanelComponent } from '../../ui/form/dynamic-form-panel.component';
import { SystemConstants } from '../../core/common/system.constants';
import { Title } from '@angular/platform-browser';
import { BaseReporterComponent } from '../_baseform/base-reporter.component';
import { BaseReporterService } from '../../base/base.service-reporter';
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';

@Component({
    selector: 'reporterplansetlement',
    templateUrl: './reporterplansetlement.component.html',
    styleUrls: ['./reporterplansetlement.component.css']
})

export class ReporterPlanSetlementComponent extends BaseReporterComponent {
    @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;
    @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

    _layoutDeclare: LayoutData = new LayoutData();
    
    constructor( srv: BaseReporterService,
         ics: InputControlService,
         route: ActivatedRoute,
         router: Router, titleService: Title) {
        super(srv,ics,route,router,titleService);
        this.layoutData = this._layoutDeclare;
        this.commandKey = this._layoutDeclare.Layout[0].key;
    }
    ngAfterViewInit() {

        this.grid1.itemsSourceChanged.addHandler(() => {
      this.applyGroupGrid1();
        });

    this.grid2.itemsSourceChanged.addHandler(() => {
        this.applyGroupGrid2();
        });

        this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {
        
              if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
                let data = s.rows[e.row].dataItem;
        
                if (e.panel.cellType == wjcGrid.CellType.Cell) {
                  if (data['Remark'] == 'GrandTotal') {
                    wjcCore.setCss(e.cell, {
                      backgroundColor: '#d5a074',
                      fontWeight: 'bold'
                    });
                  }
                  else
                    if (data['Remark'] == 'Total') {
                    wjcCore.setCss(e.cell, {
                      backgroundColor: '#faefe7',
                      fontWeight: 'bold'
                    });
                  }
                  else {
                    wjcCore.setCss(e.cell, {
        
                      fontWeight: '',
                      backgroundColor: ''
                    });
                  }
                }
              }
            });

    

    }

    applyGroupGrid1() {
          this.applyGroupJobName(this.grid1);
        }

    applyGroupGrid2() {
          this.applyGroupJobName(this.grid2);
        }

    private applyGroupJobName(_grid: wjcGrid.FlexGrid) {
          if (_grid == undefined) return;

          var cv = _grid.collectionView;
          if (cv != null) {
            cv.beginUpdate();
            cv.groupDescriptions.clear();
            var groupDesc = new wjcCore.PropertyGroupDescription("JobName");
            cv.groupDescriptions.push(groupDesc);
            cv.endUpdate();
          }
          _grid.groupHeaderFormat = "<b>{value}</b>";
        }
}
