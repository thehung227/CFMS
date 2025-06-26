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

import { LayoutData } from './reporterkhautruver1.data';

import * as CryptoJS from 'crypto-js';
import { Subscription } from 'rxjs/Subscription';
import { Title } from '@angular/platform-browser';
import { BaseReporterService } from '../../base/base.service-reporter';
import { BaseReporterComponent } from '../_baseform/base-reporter.component';
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';

@Component({
    selector: 'reporterkhautruver1',
    templateUrl: './reporterkhautruver1.component.html',
    styleUrls: ['./reporterkhautruver1.component.css']
})

export class ReporterKhautruVer1Component extends BaseReporterComponent {
    @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

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
        this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

            if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
                let data = s.rows[e.row].dataItem;

                if (e.panel.cellType == wjcGrid.CellType.Cell) {
                    if (data['IsTitleRow'] == true) {
                        wjcCore.setCss(e.cell, {
                            color: 'blue',
                            fontWeight: 'bold',
                            backgroundColor: '#f8f1e6'
                        });
                    } else if (data['_FormatStyleKey'] == 'BOLD') {
                        wjcCore.setCss(e.cell, {
                            fontWeight: 'bold',
                            backgroundColor: ''
                        });
                    }
                    else if (data['_FormatStyleKey'] == 'Subtotal0') {
                        wjcCore.setCss(e.cell, {
                            fontWeight: 'bold',
                            backgroundColor: '#fdf5e6'
                        });
                    }
                    else if (data['_FormatStyleKey'] == 'GrandTotal') {
                        wjcCore.setCss(e.cell, {
                            fontWeight: 'bold',
                            backgroundColor: '#fafad2'
                        });
                    }
                    else {
                        wjcCore.setCss(e.cell, {
                            color: '',
                            fontWeight: '',
                            backgroundColor: ''
                        });
                    }
                }
            }
        });

    }
}
