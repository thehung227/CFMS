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

import { LayoutData } from './reportersetlementstatus.data';

import * as CryptoJS from 'crypto-js';
import { Subscription } from 'rxjs/Subscription';
import { Title } from '@angular/platform-browser';
import { BaseReporterService } from '../../base/base.service-reporter';
import { BaseReporterComponent } from '../_baseform/base-reporter.component';
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';

@Component({
    selector: 'reportersetlementstatus',
    templateUrl: './reportersetlementstatus.component.html',
    styleUrls: ['./reportersetlementstatus.component.css']
})



export class ReporterSetlementStatusComponent extends BaseReporterComponent {
    @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;
    @ViewChild('grid') grid: wjcGrid.FlexGrid;
    _layoutDeclare: LayoutData = new LayoutData();

    constructor(srv: BaseReporterService,
        ics: InputControlService,
        route: ActivatedRoute,
        router: Router, titleService: Title) {
        super(srv, ics, route, router, titleService);
        this.layoutData = this._layoutDeclare;
        this.commandKey = this._layoutDeclare.Layout[0].key;
    }
    ngAfterViewInit() {

      

        super.ngAfterViewInit();
        setTimeout(() => {
            if (this.grid) {
                this.grid.itemsSourceChanged.addHandler(() => {
                    setTimeout(() => {
                        this.grid.autoSizeRows();
                    });
                });
            }
        });

          
    }
  
}
