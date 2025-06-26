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

import { LayoutData } from './reporterkhoiluongthuchienthang.data';

import * as CryptoJS from 'crypto-js';
import { Subscription } from 'rxjs/Subscription';
import { Title } from '@angular/platform-browser';
import { BaseReporterService } from '../../base/base.service-reporter';
import { BaseReporterComponent } from '../_baseform/base-reporter.component';

@Component({
    selector: 'reporterkhoiluongthuchienthang',
    templateUrl: './reporterkhoiluongthuchienthang.component.html',
    styleUrls: ['./reporterkhoiluongthuchienthang.component.css']
})

export class ReporterKhoiLuongThucHienThangComponent extends BaseReporterComponent {

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
                    if (data['_FormatStyleKey'] == 'BOLD') {
                        wjcCore.setCss(e.cell, {
                            color: 'green',
                            fontWeight: 'bold'
                        });
                    }
                    else
                        if (data['Status'] == 'Cập nhật') {
                            wjcCore.setCss(e.cell, {
                                color: 'red'
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
