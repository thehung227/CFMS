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

import { LayoutData } from './reporterplanconsmexd.data';

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
    selector: 'reporterplanconsmexd',
    templateUrl: './reporterplanconsmexd.component.html',
    styleUrls: ['./reporterplanconsmexd.component.css']
})

export class ReporterPlanConsMexdComponent extends BaseReporterComponent {
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

        this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

            if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
                let data = s.rows[e.row].dataItem;

                if (e.panel.cellType == wjcGrid.CellType.Cell) {
                    if (data['IsTitleRow'] == true && data['ItemNo'] != 'C4') {
                        wjcCore.setCss(e.cell, {
                            color: 'blue',
                            fontWeight: 'bold',
                            backgroundColor: '#f8f1e6',
                            format: 'N0',
                        });
                    } else 
                    if (data['IsTitleRow'] == true && data['ItemNo'] == 'C4') {
                        wjcCore.setCss(e.cell, {
                            color: 'blue',
                            fontWeight: 'bold',
                            backgroundColor: '#f8f1e6',
                            format: 'P2',
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
                            backgroundColor: '',
                            format: 'P2',
                        });
                    }

                    // if (data['IsTitleRow'] == true && data['ItemNo'] == 'E') {
                    //     wjcCore.setCss(e.cell, {
                    //         color: 'blue',
                    //         fontWeight: 'bold',
                    //         backgroundColor: 'yellow',
                    //         format: ',.1%'
                    //     });

                    // }
                    // else {
                    //     wjcCore.setCss(e.cell, {
                    //         color:'',
                    //         fontWeight:'',
                    //         backgroundColor: '',
                    //         format: ''
                    //     });
                    // }
                }
            }
        });

    this.grid1.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

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

                    // if (data['IsTitleRow'] == true && data['ItemNo'] == 'E') {
                    //     wjcCore.setCss(e.cell, {
                    //         color: 'blue',
                    //         fontWeight: 'bold',
                    //         backgroundColor: 'yellow',
                    //         format: ',.1%'
                    //     });

                    // }
                    // else {
                    //     wjcCore.setCss(e.cell, {
                    //         color:'',
                    //         fontWeight:'',
                    //         backgroundColor: '',
                    //         format: ''
                    //     });
                    // }
                }
            }
        });

    }
}
