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

import { LayoutData } from './reportertonghopthanhtoan.data';

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
    selector: 'reportertonghopthanhtoan',
    templateUrl: './reportertonghopthanhtoan.component.html',
    styleUrls: ['./reportertonghopthanhtoan.component.css']
})

export class ReporterTongHopThanhToanComponent extends BaseReporterComponent {
    @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

    _layoutDeclare: LayoutData = new LayoutData();
    
    constructor( srv: BaseReporterService,
         ics: InputControlService,
         route: ActivatedRoute,
         router: Router, titleService: Title) {
        super(srv,ics,route,router,titleService);
        this.layoutData = this._layoutDeclare;
        this.commandKey = this._layoutDeclare.Layout[0].key;
    }
}
