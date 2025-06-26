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

import { QuickNotifyService } from './quicknotify.service';
import { InputControlService } from './../../ui/input/InputControlService';

import { LayoutData } from './quicknotify.data';

import * as CryptoJS from 'crypto-js';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'quicknotify',
    templateUrl: './quicknotify.component.html',
    styleUrls: ['./quicknotify.component.css']
})

export class QuickNotifyComponent implements OnInit, OnDestroy {
    data: wjcCore.CollectionView;
    @ViewChild('grid') grid: wjcGrid.FlexGrid;
    @ViewChild('contentFilter') contentFilter: ElementRef;

    layoutData: any = null;
    commandKey: string;
    form: FormGroup;
    inputs: InputBase<any>[] = [];
    text: string;

    isUsingFilter: boolean = true;
    contentFilterHeight: number = 437;
    body: HTMLBodyElement = document.getElementsByTagName('body')[0];
    bIsRunReport: boolean = true;

    constructor(private srv: QuickNotifyService,
        private ics: InputControlService,
        private route: ActivatedRoute,
        private router: Router, titleService: Title) {
        this.route.params.subscribe(param => {
            if (this.commandKey && this.commandKey != param['id']) {
                this.commandKey = param['id'];
                this.initialize();
            }
            else {
                this.commandKey = param['id'];
            }
        });
    }

    ngOnInit() {
        this.grid.autoGenerateColumns = false;
        this.grid.isReadOnly = true;
        this.grid.allowDragging = wjcGrid.AllowDragging.Both;

        this.grid.columnHeaders.rows.forEach(row => {
            row.wordWrap = true;
        });

        this.initialize();
    }

    initialize() {
        let _layout = LayoutData.Layout.filter(item => item.key == this.commandKey);
        this.text = _layout[0].text;

        let _grdReport = _layout[0].data.grdReport;

        this.grid.columns.clear();
        this.grid.rows.clear();
        this.createColumnGroups(this.grid, _grdReport, 0);

        let _parameters = _layout[0].data.parameters;
        this.inputs = [];
        _parameters.forEach(param => {
            switch (param.className) {
                case 'LookupBoxInput':

                    let _lb = new LookupBoxInput({
                        key: param.name,
                        label: param.label,
                        lookupKey: param.lookupKey,
                        isContentHtml: true,
                    }, this.srv, null);

                    this.inputs.push(_lb);
                    break;

                case 'DateBoxInput':
                    let _db = new DateBoxInput({
                        key: param.name,
                        label: param.label,
                        type: 'date',
                        format: 'dd/MM/yyyy',
                    });

                    this.inputs.push(_db);
                    break;

                default:
                    let _tb = new TextBoxInput({
                        key: param.name,
                        label: param.label,
                        type: 'text'
                    })

                    this.inputs.push(_tb);
                    break;
            }
        });
        this.form = this.ics.toFormGroup(this.inputs);
    }

    createColumnGroups(flex: wjcGrid.FlexGrid, columnGroups: any, level: number) {
        // prepare to generate columns
        var colHdrs = flex.columnHeaders;

        // add an extra header row if necessary
        if (level >= colHdrs.rows.length) {
            colHdrs.rows.splice(colHdrs.rows.length, 0, new wjcGrid.Row());
        }

        // loop through the groups adding columns or groups
        for (var i = 0; i < columnGroups.length; i++) {
            var group = columnGroups[i];
            if (!group.columns) {

                // create a single column
                var col = new wjcGrid.Column();

                // copy properties from group
                for (var prop in group) {
                    if (prop in col) {
                        col[prop] = group[prop];
                    }
                }

                // add the new column to the grid, set the header
                flex.columns.push(col);
                colHdrs.setCellData(level, colHdrs.columns.length - 1, group.header);
            }
            else {

                // get starting column index for this group
                var colIndex = colHdrs.columns.length;

                // create columns for this group
                this.createColumnGroups(flex, group.columns, level + 1);

                // set headers for this group
                for (var j = colIndex; j < colHdrs.columns.length; j++) {
                    colHdrs.setCellData(level, j, group.header);
                }
            }
        }
    }

    toogleFilter() {
        this.isUsingFilter = !this.isUsingFilter;
        this.contentFilterHeight = this.contentFilter.nativeElement.offsetHeight - 50;
        this.body.classList.add('sidebar-collapse');
    }

    onSubmit(formData: FormGroup) {
        let params = new Array<ParameterContract>();
        let flagParam = false;

        // var key = CryptoJS.enc.Utf8.parse('8080808080808080');  
        // var iv = CryptoJS.enc.Utf8.parse('8080808080894832');  

        // // Encrypt 
        // var ciphertext = CryptoJS.AES.encrypt('my message', key, {
        //     keySize: 128 / 8,
        //     iv: iv,
        //     mode: CryptoJS.mode.CBC,
        //     padding: CryptoJS.pad.Pkcs7
        // });       

        // this.srv.get(ciphertext.toString());

        try {
            for (let key in formData.value) {
                let param = new ParameterContract();
                let _value = formData.value[key];

                if (_value instanceof Date) {
                    if (key.endsWith('_custom')) {
                        param.ParameterOperator = "<=";
                    }
                    else {
                        param.ParameterOperator = ">=";
                    }
                }

                param.ParameterName = this.convertParameterName(key);
                param.ParameterValue = _value;

                params.push(param);
            }

            let _layout = LayoutData.Layout.filter(item => item.key == this.commandKey);
            let _command = _layout[0].command;

            this.srv.getDataEncrypt(Global.MainEndPoint, _command, params)
                .subscribe(data => {
                    // var key = CryptoJS.enc.Utf8.parse('8080808080808080');  
                    // var iv = CryptoJS.enc.Utf8.parse('8080808080894832');  

                    // // Encrypt 
                    // var ciphertext = CryptoJS.AES.decrypt(data, key, {
                    //     keySize: 128 / 8,
                    //     iv: iv,
                    //     mode: CryptoJS.mode.CBC,
                    //     padding: CryptoJS.pad.Pkcs7
                    // });       

                    // console.log(ciphertext.toString());
                    this.data = new wjcCore.CollectionView(data);
                    this.bIsRunReport = true;
                });
        }
        finally {
            this.bIsRunReport = true;
        }
    }

    ngOnDestroy() {
        if (this.inputs != null)
            this.inputs = null;

        if (this.data != null)
            this.data = null;
    }

    convertParameterName(pzName: string) {
        let DbParamPrefixOld: string = '@_';
        let DbParamPrefix: string = '@';

        return pzName.startsWith(DbParamPrefixOld) || pzName.startsWith(DbParamPrefix) ?
            pzName : DbParamPrefixOld + pzName;
    }
}