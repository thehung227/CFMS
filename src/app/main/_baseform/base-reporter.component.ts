import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as wjcGridXlsx from 'wijmo/wijmo.grid.xlsx';
import * as wjcXlsx from 'wijmo/wijmo.xlsx';

import * as wjOData from 'wijmo/wijmo.odata';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcInput from 'wijmo/wijmo.angular2.input';
import * as wjcChart from 'wijmo/wijmo.chart';

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

import { BaseReporterService } from './../../base/base.service-reporter';
import { InputControlService } from './../../ui/input/InputControlService';


import * as CryptoJS from 'crypto-js';
import { Subscription } from 'rxjs/Subscription';
import { Title } from '@angular/platform-browser';
import { SystemConstants } from '../../core/common/system.constants';
import { APP_BASE_HREF } from '@angular/common';
import { CryptoExtension } from '../../core/extensions/crypto.extension';
import { UrlConstants } from '../../core/common/url.constants';
import { MultiSelectInput } from '../../ui/input/MultiSelectInput';
import { saveAs as importedSaveAs } from "file-saver";

export abstract class BaseReporterComponent implements OnInit, OnDestroy {
    protected gridArray: wjcGrid.FlexGrid[];
    data: wjcCore.CollectionView;
    data1: wjcCore.CollectionView;
    data2: wjcCore.CollectionView;
    data3: wjcCore.CollectionView;
    data4: wjcCore.CollectionView;
    data5: wjcCore.CollectionView;

    @ViewChild('grid') grid: wjcGrid.FlexGrid;
    @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
    @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
    @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
    @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
    @ViewChild('grid5') grid5: wjcGrid.FlexGrid;

    @ViewChild('contentFilter') contentFilter: ElementRef;

    @ViewChild('pieChart') pieChart: wjcChart.FlexPie;

    protected layoutData: any;
    protected commandKey: string;
    protected form: FormGroup;
    protected inputs: InputBase<any>[] = [];
    protected text: string;

    protected isUsingFilter: boolean = true;
    protected contentFilterHeight: number = 783;
    protected body: HTMLBodyElement = document.getElementsByTagName('body')[0];
    protected bIsRunReport: boolean = true;
    subscription: Subscription;

    protected output: Array<Object>;
    protected paramsRoute: any;
    protected groupList: any;
    protected bAllowGrandTotal: number[];
    protected nCollapseNodesOnCreate: any;
    protected totalGrid: number;

    protected allowFilter: boolean = false;

    protected allowChart: boolean = false;
    protected chartType: string = '';
    protected dataChart: wjcCore.CollectionView;
    protected columnsChart: any;
    protected bindingX: string = '';
    protected wjPropertyAxis: string = '';
    protected formatAxis: string = '';
    protected legendPosition: string = '';
    protected stacking: string = '';
    protected rotated: boolean = false;
    protected valuePie: string = '';
    protected namePie: string = '';
    protected chartWidth: number = 0;
    protected tableIndex: number = 0;
    protected chartPalette: wjcChart.Palettes;
    protected selectionPie: any;

    paramsReport: {};

    lstColGroup: string[] = [];

    constructor(protected srv: BaseReporterService,
        private ics: InputControlService,
        private route: ActivatedRoute,
        private router: Router, titleService: Title) {
        const sub = this.route.params.subscribe(param => {
            // if (this.commandKey && this.commandKey != param['id']) {
            //     this.commandKey = param['id'];
            //     this.paramsRoute = param['params'];

            // }
            // else {
            //     this.commandKey = param['id'];
            //     this.paramsRoute = param['params'];                
            // }

            this.commandKey = param['id'];
            let _value = param['params'];

            if (_value) {
                this.paramsRoute = CryptoExtension.decrypt(decodeURIComponent(_value));
            }
            else { this.paramsRoute = _value; }
        });
        this.subscription = new Subscription();
        this.subscription.add(sub);

        if (this.paramsRoute) {
            let dataPara = <Array<string>>JSON.parse(this.paramsRoute);

            if (dataPara != undefined && dataPara != null) {

                if (dataPara['Commandkey'] == this.commandKey) {
                    this.paramsReport = dataPara;
                }
            }
        }

    }

    async ngOnInit() {
        this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4, this.grid5];

        this.grid.autoGenerateColumns = false;
        this.grid.isReadOnly = true;
        if (this.grid1) {
            this.grid1.autoGenerateColumns = false;
            this.grid1.isReadOnly = true;
            this.grid1.allowDragging = wjcGrid.AllowDragging.Both;
            this.grid1.columnHeaders.rows[0].height = 41;
            this.grid1.rows.defaultSize = 25;
            this.grid1.columnHeaders.rows.forEach(row => {
                row.wordWrap = true;
            });
        }
        if (this.grid2) {
            this.grid2.autoGenerateColumns = false;
            this.grid2.isReadOnly = true;
            this.grid2.allowDragging = wjcGrid.AllowDragging.Both;
            this.grid2.columnHeaders.rows[0].height = 41;
            this.grid2.rows.defaultSize = 25;
            this.grid2.columnHeaders.rows.forEach(row => {
                row.wordWrap = true;
            });
        }

        if (this.grid3) {
            this.grid3.autoGenerateColumns = false;
            this.grid3.isReadOnly = true;
            this.grid3.allowDragging = wjcGrid.AllowDragging.Both;
            this.grid3.columnHeaders.rows[0].height = 41;
            this.grid3.rows.defaultSize = 25;
            this.grid3.columnHeaders.rows.forEach(row => {
                row.wordWrap = true;
            });
        }

        if (this.grid4) {
            this.grid4.autoGenerateColumns = false;
            this.grid4.isReadOnly = true;
            this.grid4.allowDragging = wjcGrid.AllowDragging.Both;
            this.grid4.columnHeaders.rows[0].height = 41;
            this.grid4.rows.defaultSize = 25;
            this.grid4.columnHeaders.rows.forEach(row => {
                row.wordWrap = true;
            });
        }

        if (this.grid5) {
            this.grid5.autoGenerateColumns = false;
            this.grid5.isReadOnly = true;
            this.grid5.allowDragging = wjcGrid.AllowDragging.Both;
            this.grid5.columnHeaders.rows[0].height = 41;
            this.grid5.rows.defaultSize = 25;
            this.grid5.columnHeaders.rows.forEach(row => {
                row.wordWrap = true;
            });
        }

        this.grid.allowDragging = wjcGrid.AllowDragging.Both;
        this.grid.columnHeaders.rows[0].height = 41;
        this.grid.rows.defaultSize = 25;
        this.grid.columnHeaders.rows.forEach(row => {
            row.wordWrap = true;
        });

        this.initialize().then(() => {
            if (this.layoutData.Layout[0].totalGrid) {
                this.totalGrid = this.layoutData.Layout[0].totalGrid;
            }
            else {
                this.totalGrid = 1;
            }

            if (this.layoutData.Layout[0].subTotals) {
                this.groupList = this.layoutData.Layout[0].subTotals;
            }

            if (this.layoutData.Layout[0].nCollapseNodesOnCreate) {
                this.nCollapseNodesOnCreate = this.layoutData.Layout[0].nCollapseNodesOnCreate;
            }

            if (this.layoutData.Layout[0].bAllowGrandTotal) {
                this.bAllowGrandTotal = this.layoutData.Layout[0].bAllowGrandTotal;
            }

            if (this.layoutData.Layout[0].ctorArg) {
                this.ics.updateValueForm(this.inputs, this.form, this.layoutData.Layout[0].ctorArg);
            }

            if (this.paramsReport) {
                this.ics.updateValueForm(this.inputs, this.form, this.paramsReport);
            }
        });

        this.createChart();
        this.downloadAfterClick(this.grid);

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

    async initialize() {

        // let _layout = this.layoutData.filter(item => item.key == this.commandKey);
        let _layout = this.layoutData.Layout;

        this.text = _layout[0].text;

        let _grdReport = _layout[0].data.grdReport;

        this.grid.columns.clear();
        this.grid.rows.clear();
        this.bindColumnGroups(this.grid, _grdReport);

        if (this.grid1 != undefined) {
            let _grdReport1 = _layout[0].data.grdReport1;

            this.grid1.columns.clear();
            this.grid1.rows.clear();
            this.bindColumnGroups(this.grid1, _grdReport1);
        }

        if (this.grid2 != undefined) {
            let _grdReport2 = _layout[0].data.grdReport2;

            this.grid2.columns.clear();
            this.grid2.rows.clear();
            this.bindColumnGroups(this.grid2, _grdReport2);
        }

        if (this.grid3 != undefined) {
            let _grdReport3 = _layout[0].data.grdReport3;

            this.grid3.columns.clear();
            this.grid3.rows.clear();
            this.bindColumnGroups(this.grid3, _grdReport3);
        }

        if (this.grid4 != undefined) {
            let _grdReport4 = _layout[0].data.grdReport4;

            this.grid4.columns.clear();
            this.grid4.rows.clear();
            this.bindColumnGroups(this.grid4, _grdReport4);
        }

        if (this.grid5 != undefined) {
            let _grdReport5 = _layout[0].data.grdReport5;

            this.grid5.columns.clear();
            this.grid5.rows.clear();
            this.bindColumnGroups(this.grid5, _grdReport5);
        }

        let _parameters = _layout[0].parameters;

        this.inputs = [];
        _parameters.forEach(param => {
            // console.log(param);
            switch (param.className) {
                case 'LookupBoxInput':
                    let _lb = new LookupBoxInput({
                        key: param.key,
                        label: param.label,
                        lookupKey: param['lookupKey'],
                        lookupfilter: param['lookupfilter'],
                        validators: param['validators'],
                        isContentHtml: false,
                        labelCol: 12
                    }, this.srv, null);

                    this.inputs.push(_lb);
                    break;
                case 'MultiSelectInput':
                    let _mt = new MultiSelectInput({
                        key: param.key,
                        label: param.label,
                        lookupKey: param['lookupKey'],
                        lookupfilter: param['lookupfilter'],
                        isContentHtml: false,
                        isReadOnly: param['isReadOnly'],
                        validators: param['validators'],
                        labelCol: 12
                    }, this.srv);

                    this.inputs.push(_mt);
                    break;
                case 'CheckBoxInput':
                    let _cb = new CheckBoxInput({
                        key: param.key,
                        label: param.label,
                    });

                    this.inputs.push(_cb);
                    break;

                case 'DateBoxInput':
                    let _db = new DateBoxInput({
                        key: param.key,
                        label: param.label,
                        type: 'date',
                        format: 'dd/MM/yyyy',
                        labelCol: 12
                    });

                    this.inputs.push(_db);
                    break;

                default:
                    let _tb = new TextBoxInput({
                        key: param.key,
                        label: param.label,
                        type: 'text'
                    })

                    this.inputs.push(_tb);
                    break;
            }
        });

        this.form = this.ics.toFormGroup(this.inputs, this.paramsReport);
    }

    setDefaultParameter() {
        for (let i in this.paramsReport) {

            for (let control in this.form.controls) {

                if (this.paramsReport[control]) {
                    let _value: any = this.paramsReport[control];

                    if (wjcCore.isNumber(_value))
                        _value = this.replaceDecimal(_value);

                    if (_value instanceof Date) {
                        if (_value != null)
                            _value = _value.toISOString();
                    }
                    this.form.controls[control].setValue(_value);
                }
            }
        }
    }

    replaceString(expr: any, symbol: string) {
        let result = '';
        for (let i = 0; i < expr.length; i++) {
            if (expr[i] == symbol)
                continue;
            result += expr[i]
        }
        return result;
    }

    // bindColumnGroups(flex: wjcGrid.FlexGrid, columnGroups: any): void {

    //     // create the columns
    //     flex.allowAddNew = true;
    //     this.createColumnGroups(flex, columnGroups, 0);

    //     // merge the headers
    //     this.mergeColumnGroups(flex);

    //     var colHdrs = flex.columnHeaders;
    //     for (var nRow = 0; nRow < colHdrs.rows.length - 1; nRow++)
    //         for (var nCol = 0; nCol < colHdrs.columns.length; nCol++) {
    //             var data = colHdrs.getCellData(nRow, nCol, false);
    //             if (!data && (nRow - 1) >= 0)
    //                 colHdrs.setCellData(nRow, nCol, colHdrs.getCellData(nRow - 1, nCol, true));
    //         }



    //     // center-align headers vertically and horizontally
    //     flex.formatItem.addHandler(function (s, e: wjcGrid.FormatItemEventArgs) {
    //         if (e.panel.cellType === wjcGrid.CellType.TopLeft) {
    //             console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

    //             // e.cell.innerHTML = '<div><button style="width: 30px;height: 30px;" title="Thêm mới"><i class="fa fa-plus-square" aria-hidden="true"></i></button></div>';
    //             // wjcCore.setCss(e.cell, {
    //             //   display: 'table',
    //             //   tableLayout: 'fixed',
    //             //   fontSize: '12px',
    //             // });

    //             // wjcCore.setCss(e.cell.children[0], {
    //             //   display: 'table-cell',
    //             //   verticalAlign: 'middle',
    //             //   textAlign: 'center',
    //             //   fontSize: '12px',
    //             // });

    //         }

    //         if (e.panel.cellType === wjcGrid.CellType.ColumnHeader) {
    //             // e.cell.innerHTML = '<div><input type="text" style="width:100%;"></input></br><div>' + e.cell.innerHTML + '</div></div>';
    //             e.cell.innerHTML = '<div>' + e.cell.innerHTML + '</div>';

    //             wjcCore.setCss(e.cell, {
    //                 display: 'table',
    //                 tableLayout: 'fixed',
    //                 fontSize: '12px',
    //             });

    //             wjcCore.setCss(e.cell.children[0], {
    //                 display: 'table-cell',
    //                 verticalAlign: 'middle',
    //                 textAlign: 'center',
    //                 fontSize: '12px',
    //             });
    //         }

    //     });

    //     // set autosize row header
    //     flex.itemsSourceChanged.addHandler(function (s: wjcGrid.FlexGrid, e) {
    //         setTimeout(function () {
    //             for (var n = 0; n < s.columnHeaders.rows.length; n++) {
    //                 // enable wrapping on first header row
    //                 var row = s.columnHeaders.rows[n];
    //                 row.wordWrap = true;

    //                 // autosize first header row
    //                 // s.autoSizeRow(n, true);
    //             }
    //         });
    //     });
    // }

    bindColumnGroups(flex: wjcGrid.FlexGrid, columnGroups: any): void {

        // create the columns
        flex.allowSorting = true;
        this.createColumnGroups(flex, columnGroups, 0);

        // merge the headers
        this.mergeColumnGroups(flex);

        var colHdrs = flex.columnHeaders;
        for (var nRow = 0; nRow < colHdrs.rows.length - 1; nRow++)
            for (var nCol = 0; nCol < colHdrs.columns.length; nCol++) {
                var data = colHdrs.getCellData(nRow, nCol, false);
                if (!data && (nRow - 1) >= 0)
                    colHdrs.setCellData(nRow, nCol, colHdrs.getCellData(nRow - 1, nCol, true));
            }

        let _formatItem = (s, e: wjcGrid.FormatItemEventArgs) => {

            if (e.panel.cellType === wjcGrid.CellType.ColumnHeader) {
                //e.cell.innerHTML = '<div><input type="text" style="width:100%;"></input></br><div>' + e.cell.innerHTML + '</div></div>';

                // let column = flex.columns[e.col];
                // if (column.dataType == wjcCore.DataType.Boolean) {
                //     e.cell.innerHTML = '<div><input type="checkbox">' + e.cell.innerHTML + '</div>';

                //     var cnt = 0;
                //     for (var i = 0; i < flex.rows.length; i++) {
                //         if (s.getCellData(i, e.col) == true) cnt++;
                //     }

                //     var cb = e.cell.getElementsByTagName('input')[0];

                //     cb.checked = cnt > 0;
                //     cb.indeterminate = cnt > 0 && cnt < flex.rows.length;

                //     // apply checkbox value to cells
                //     cb.addEventListener('click', function (e) {
                //         flex.beginUpdate();
                //         for (var i = 0; i < flex.rows.length; i++) {
                //             flex.setCellData(i, column.index, cb.checked);
                //         }
                //         flex.endUpdate();
                //     });

                // }
                // else {
                //     e.cell.innerHTML = '<div>' + e.cell.innerHTML + '</div>';
                // }
                e.cell.innerHTML = '<div>' + e.cell.innerHTML + '</div>';

                wjcCore.setCss(e.cell, {
                    display: 'table',
                    tableLayout: 'fixed',
                    // fontSize: '12px',
                });

                wjcCore.setCss(e.cell.children[0], {
                    display: 'table-cell',
                    verticalAlign: 'middle',
                    textAlign: 'center'
                    // fontSize: '12px',
                },

                );

                wjcCore.setCss(e.cell.children[0], {
                    textAlign: '-webkit-center'
                },

                );

                wjcCore.setCss(e.cell.children[0], {
                    textAlign: '-moz-center'
                },

                );
            }

            if (e.panel.cellType === wjcGrid.CellType.Cell) {
                var column = flex.columns[e.col];
                switch (column.name) {
                    case 'link':
                        let dataItem = e.panel.rows[e.row].dataItem;
                        if (dataItem) {
                            let _value = dataItem[column.binding];
                            if (_value) {
                                // href="' + _value + '"
                                let link = '<a class="downLoadFileAttach" (click)="downloadAfterClick(grid)" href="javascript:void(0);" rel="nofollow" style="color:#00a08a"><i class="fa fa-download" aria-hidden="true"></i>  Tải tệp đính kèm</a>';
                                //let link = '<button (click)="downloadAfterClick(grid)">Click</button>'
                                e.cell.innerHTML = link;

                                wjcCore.setCss(e.cell, {
                                    hover: '-moz-center'
                                });

                                e.cell.style.textAlign = 'center';
                            }
                        }
                        break;
                }
            }
        }
        flex.formatItem.removeHandler(_formatItem);
        flex.formatItem.addHandler(_formatItem);

        // set autosize row header

        let _itemsSourceChanged = (s: wjcGrid.FlexGrid, e) => {
            setTimeout(function () {
                for (var n = 0; n < s.columnHeaders.rows.length; n++) {
                    // enable wrapping on first header row
                    var row = s.columnHeaders.rows[n];
                    row.wordWrap = true;
                }
            });
        }

        flex.itemsSourceChanged.removeHandler(_itemsSourceChanged);
        flex.itemsSourceChanged.addHandler(_itemsSourceChanged);
    }

    mergeColumnGroups(flex: wjcGrid.FlexGrid) {
        // merge headers
        var colHdrs = flex.columnHeaders;
        flex.allowMerging = wjcGrid.AllowMerging.AllHeaders;

        if(this.layoutData.Layout[0].rowHeader){
            let dataRowGrid = this.layoutData.Layout[0].rowHeader[this.gridArray.indexOf(flex)];
            // merge horizontally
            for (var r = 0; r < colHdrs.rows.length; r++) {
                colHdrs.rows[r].height = dataRowGrid[r].height;
                colHdrs.rows[r].wordWrap = true;
                colHdrs.rows[r].allowMerging = true;
            }

            // merge vertically
            for (var c = 0; c < colHdrs.columns.length; c++) {
                colHdrs.columns[c].allowMerging = true;
            }

        }
        else{
            // merge horizontally
            for (var r = 0; r < colHdrs.rows.length; r++) {
                colHdrs.rows[r].height = 41;
                colHdrs.rows[r].wordWrap = true;
                colHdrs.rows[r].allowMerging = true;
            }

            // merge vertically
            for (var c = 0; c < colHdrs.columns.length; c++) {
                colHdrs.columns[c].allowMerging = true;
            }
        }

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

    createChart() {
        if (this.layoutData.Layout[0].dataChart) {
            let data = this.layoutData.Layout[0].dataChart;
            this.allowChart = true;

            this.chartType = data.chartType;
            this.bindingX = data.bindingX;
            this.wjPropertyAxis = data.wjPropertyAxis || 'Axis';
            this.formatAxis = data.formatAxis || '';
            this.legendPosition = data.legendPosition || 'None';
            this.stacking = data.stacking || 'None';
            this.rotated = data.rotated || false;

            if (data.chartType == 'Pie') {
                this.valuePie = data.valuePie;
                this.namePie = data.namePie;
                this.chartPalette = wjcChart.Palettes[data.chartPalette];
            }
            //this.contentFilterHeight = this.contentFilterHeight + 357;

            this.chartWidth = document.getElementById('box-content').clientWidth - 300;

            this.tableIndex = data.tableIndex || 0;
        }
    }

    toogleFilter() {
        this.isUsingFilter = !this.isUsingFilter;
        // this.contentFilterHeight = this.contentFilter.nativeElement.offsetHeight - 50;
        this.body.classList.add('sidebar-collapse');
    }

    showLoading = false;
    async onSubmit(formData: FormGroup) {

        let params = new Array<ParameterContract>();
        let flagParam = false;



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
                    _value = _value.toISOString();
                }

                if (_value instanceof Array) {
                    let _valueLst = ''
                    for (let i in _value) {
                        _valueLst = _valueLst + ',' + _value[i]['ValueMember']
                    }

                    _value = _valueLst.slice(1, _valueLst.length);
                }

                param.ParameterName = this.convertParameterName(key);
                param.ParameterValue = _value;

                params.push(param);
            }

            for (let key in this.layoutData.Layout[0].ctorArg) {
                if (formData.controls[key] == undefined && key != 'Commandkey') {
                    let param = new ParameterContract();
                    let _value = this.layoutData.Layout[0].ctorArg[key];

                    if (_value instanceof Date) {
                        if (key.endsWith('_custom')) {
                            param.ParameterOperator = "<=";
                        }
                        else {
                            param.ParameterOperator = ">=";
                        }
                        _value = _value.toISOString();
                    }

                    param.ParameterName = this.convertParameterName(key);
                    param.ParameterValue = _value;

                    params.push(param);
                }

            }

            // let _layout = this.layoutData.filter(item => item.key == this.commandKey);
            let _layout = this.layoutData.Layout;

            let _command = _layout[0].command;
            let output_xml: string;
            let output_col: string;
            let output_json: string;

            this.showLoading = true;

            if (this.totalGrid == 1) {
                let _data = await this.srv.getMultiDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, _command, params)
                    .toPromise().then();

                this.data = new wjcCore.CollectionView(_data['data'][0]);
                this.output = <Array<Object>>(_data['output']);

                if (this.allowChart) {
                    this.dataChart = new wjcCore.CollectionView(_data['data'][this.tableIndex]);
                    this.valuePie = this.layoutData.Layout[0].dataChart.valuePie;
                    this.namePie = this.layoutData.Layout[0].dataChart.namePie;

                    if (this.layoutData.Layout[0].outputjson != undefined) {
                        let jSonObj = JSON.parse(this.output['@_LAYOUT_JSON']);
                        this.columnsChart = jSonObj[0]['grdReport'];
                    }
                }

            } else if (this.totalGrid == 2) {
                let _data = await this.srv.getMultiDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, _command, params)
                    .toPromise().then();


                this.data = new wjcCore.CollectionView(_data['data'][0]);
                this.data1 = new wjcCore.CollectionView(_data['data'][1]);
                this.output = <Array<Object>>(_data['output']);
            } else if (this.totalGrid == 3) {
                let _data = await this.srv.getMultiDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, _command, params)
                    .toPromise().then();


                this.data = new wjcCore.CollectionView(_data['data'][0]);
                this.data1 = new wjcCore.CollectionView(_data['data'][1]);
                this.data2 = new wjcCore.CollectionView(_data['data'][2]);

                this.output = <Array<Object>>(_data['output']);
            } else if (this.totalGrid == 4) {
                let _data = await this.srv.getMultiDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, _command, params)
                    .toPromise().then();


                this.data = new wjcCore.CollectionView(_data['data'][0]);
                this.data1 = new wjcCore.CollectionView(_data['data'][1]);
                this.data2 = new wjcCore.CollectionView(_data['data'][2]);
                this.data3 = new wjcCore.CollectionView(_data['data'][3]);

                this.output = <Array<Object>>(_data['output']);
            } else if (this.totalGrid == 5) {
                let _data = await this.srv.getMultiDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, _command, params)
                    .toPromise().then();


                this.data = new wjcCore.CollectionView(_data['data'][0]);
                this.data1 = new wjcCore.CollectionView(_data['data'][1]);
                this.data2 = new wjcCore.CollectionView(_data['data'][2]);
                this.data3 = new wjcCore.CollectionView(_data['data'][3]);
                this.data4 = new wjcCore.CollectionView(_data['data'][4]);

                this.output = <Array<Object>>(_data['output']);
            } else if (this.totalGrid == 6) {
                let _data = await this.srv.getMultiDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, _command, params)
                    .toPromise().then();


                this.data = new wjcCore.CollectionView(_data['data'][0]);
                this.data1 = new wjcCore.CollectionView(_data['data'][1]);
                this.data2 = new wjcCore.CollectionView(_data['data'][2]);
                this.data3 = new wjcCore.CollectionView(_data['data'][3]);
                this.data4 = new wjcCore.CollectionView(_data['data'][4]);
                this.data5 = new wjcCore.CollectionView(_data['data'][5]);

                this.output = <Array<Object>>(_data['output']);
            }


            if (this.layoutData.Layout[0].treeNode) {
                if (this.layoutData.Layout[0].treeNode.length > 1) {
                    for (let i in this.layoutData.Layout[0].treeNode) {

                        if (this.layoutData.Layout[0].treeNode[i] == 0) {
                            this.lstColGroup.push(this.output['@_ListColGroupWeb']);

                            this.createColumnsTreeNode(this.gridArray[i], this.output['@_ListColGroupWeb']);
                        }
                        else {
                            if (this.output['@_ListColGroupWeb' + i.toString()] != undefined) {
                                this.lstColGroup.push(this.output['@_ListColGroupWeb' + i.toString()]);

                                this.createColumnsTreeNode(this.gridArray[i], this.output['@_ListColGroupWeb' + i.toString()]);
                            }
                        }


                    }
                }
                else if (this.layoutData.Layout[0].treeNode == true || this.layoutData.Layout[0].treeNode[0] == 0) {
                    this.lstColGroup.push(this.output['@_ListColGroupWeb']);

                    this.createColumnsTreeNode(this.gridArray[0], this.output['@_ListColGroupWeb']);
                }
            }



            output_xml = this.output['@_LAYOUT_XML'];
            output_col = this.output['@_COLUMN_OUPUT'];
            output_json = this.output['@_LAYOUT_JSON'];



            if (this.layoutData.Layout[0].outputjson != undefined) {
                this.readJson(output_json, this.gridArray[this.layoutData.Layout[0].outputjson])
            }


            if (this.layoutData.Layout[0].outputgrid != undefined) {

                this.realXML(output_xml, output_col, this.gridArray[this.layoutData.Layout[0].outputgrid]);
            }

            if (this.bAllowGrandTotal != undefined) {
                for (let i in this.bAllowGrandTotal) {
                    this.createAggregateGrid(this.gridArray[this.bAllowGrandTotal[i]]);
                }


                //this.createAggregateGrid(this.grid);
            }

            this.showLoading = false;

            if (this.totalGrid == 1) {
                this.paintGrid(this.grid, 'grdReport');
                this.formatGroupByGrid(this.grid, 'grdReport');
                this.frozenGrid(this.grid, 'grdReport')

            } else if (this.totalGrid == 2) {
                this.paintGrid(this.grid1, 'grdReport1');
                this.formatGroupByGrid(this.grid1, 'grdReport1');
                this.frozenGrid(this.grid1, 'grdReport1')

            } else if (this.totalGrid == 3) {
                this.paintGrid(this.grid2, 'grdReport');
                this.formatGroupByGrid(this.grid2, 'grdReport');
            } else if (this.totalGrid == 4) {
                this.paintGrid(this.grid3, 'grdReport');
                this.formatGroupByGrid(this.grid3, 'grdReport');
            } else if (this.totalGrid == 5) {
                this.paintGrid(this.grid4, 'grdReport');
                this.formatGroupByGrid(this.grid4, 'grdReport');
            } else if (this.totalGrid == 6) {
                this.paintGrid(this.grid5, 'grdReport');
                this.formatGroupByGrid(this.grid5, 'grdReport');
            }

            // this.srv.getDataEncrypt(Global.MainEndPoint , _command, params)
            //     .subscribe(data => {

            //         this.data = new wjcCore.CollectionView(data);
            //         this.bIsRunReport = true;
            //     });
        }
        finally {
            //this.showLoading = false;
            //this.bIsRunReport = true;
        }

    }

    async createColumnsTreeNode(grid: wjcGrid.FlexGrid, _listCol: string) {

        let colOutput = [];
        let colArr = _listCol.split(',');

        for (let col in colArr) {

            colOutput.push({
                'header': colArr[col], 'binding': colArr[col], 'isColumnOriginal': true, 'width': 0
            })
        }

        grid.columns.clear();
        for (let _c in colOutput) {
            let _col = this.layoutData.Layout[0].data['grdReport'].find(_cTmp => _cTmp['binding'] == colOutput[_c]['binding']);
            if (_col == undefined) {
                this.layoutData.Layout[0].data['grdReport'].push(colOutput[_c]);
            }
            //this.layoutData.Layout[0].data['grdReport'].push(colOutput[_c]);
        }

        this.bindColumnGroups(grid, this.layoutData.Layout[0].data['grdReport']);

    }

    ngOnDestroy() {
        if (this.inputs != null)
            this.inputs = null;

        if (this.data != null)
            this.data = null;

        this.subscription.unsubscribe();
    }

    convertParameterName(pzName: string) {
        let DbParamPrefixOld: string = '@_';
        let DbParamPrefix: string = '@';

        return pzName.startsWith(DbParamPrefixOld) || pzName.startsWith(DbParamPrefix) ?
            pzName : DbParamPrefixOld + pzName;
    }




    print(html: string) {
        let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        //popupWin.document.open();

        popupWin.document.write(html);
        popupWin.document.close();
    }

    // renders a FlexGrid as a printer-friendly table element
    renderTable(flex: wjcGrid.FlexGrid) {

        // start table
        var tbl = '<table style="border-spacing: 0px; border-top: dashed 1px black;border-left: dashed 1px black;">';

        // headers
        if (flex.headersVisibility & wjcGrid.HeadersVisibility.Column) {
            tbl += '<thead>';
            for (var r = 0; r < flex.columnHeaders.rows.length; r++) {
                tbl += this.renderRow(flex.columnHeaders, r);
            }
            tbl += '</thead>';
        }

        // body
        tbl += '<tbody>';
        for (var r = 0; r < flex.rows.length; r++) {
            tbl += this.renderRow(flex.cells, r);
        }
        tbl += '</tbody>';

        // done
        tbl += '</table>';
        return tbl;
    }

    renderRow(panel: wjcGrid.GridPanel, r: number) {

        let cs
        var tr = '',
            row = panel.rows[r],
            nextCol = -1;
        if (row.renderSize > 0) {

            // start row/group row
            tr += row instanceof wjcGrid.GroupRow
                ? '<tr style="font-weight:bold;height:2em;border-top:2px solid grey">'
                : '<tr>';

            // render each column
            for (var c = 0; c < panel.columns.length; c++) {
                var col = panel.columns[c];

                if (col.renderSize > 0 && c >= nextCol) {
                    var colSpan = '', mergedRange = null;
                    var rowSpan = '';

                    // get cell content
                    var content = panel.getCellData(r, c, true),
                        data = panel.getCellData(r, c, false),
                        isHtml = row.isContentHtml || col.isContentHtml


                    if (!isHtml && wjcCore.isString(data)) {
                        content = wjcCore.escapeHtml(content);
                    }
                    if (wjcCore.isBoolean(data)) {
                        content = data ? '&#9745;' : '&#9744;';
                    }
                    if (row instanceof wjcGrid.GroupRow && c == panel.columns.firstVisibleIndex) {
                        content = row.getGroupHeader();
                    }

                    // handle merged cells
                    mergedRange = panel.grid.getMergedRange(panel, r, c, false);
                    if (mergedRange && mergedRange.columnSpan > 1) {
                        colSpan = ' colspan="' + mergedRange.columnSpan + '"';
                        nextCol = c + mergedRange.columnSpan;
                    }
                    if (mergedRange && mergedRange.rowSpan > 1) {
                        rowSpan = ' rowspan="' + mergedRange.rowSpan + '"';
                    }


                    // get cell style
                    var style = 'width:' + (mergedRange ? mergedRange.getRenderSize(panel).width : col.renderSize) + 'px;';
                    var styleTH = 'width:' + (mergedRange ? mergedRange.getRenderSize(panel).width : col.renderSize) + 'px;';

                    if (col.getAlignment()) {
                        style += 'text-align:' + col.getAlignment() + ';';
                    }

                    styleTH += 'text-align:center;valign:center;background-color:#f8f1e6;';

                    // add cell to row
                    if (panel.cellType == wjcGrid.CellType.ColumnHeader) {

                        if (r == 0)
                            tr += '<th style="border-right: solid 1px black;border-bottom: solid 1px black;' + styleTH + '"' + colSpan + rowSpan + '>' + content + '</th>';

                        else if (rowSpan == '' && r > 0)
                            tr += '<th style="border-right: solid 1px black;border-bottom: solid 1px black;' + styleTH + '"' + colSpan + '>' + content + '</th>';
                    } else {

                        if (panel.rows[r].dataItem['IsTitleRow'] == true) {
                            style += 'font-weight:bold;color:blue;background-color:#f8f1e6;'
                            tr += '<td style="border-right: solid 1px black;border-bottom: solid 1px black;' + style + '"' + colSpan + '>' + content + '</td>';
                        }
                        else {
                            tr += '<td style="border-right: solid 1px black;border-bottom: solid 1px black;' + style + '"' + colSpan + '>' + content + '</td>';
                        }
                    }
                }
            }


            // close row
            tr += '</tr>';
        }
        return tr;
    }

    renderTitle() {

        // console.log(this.output);
        // start table
        var tit = '<table width="100%">';
        // body
        tit += '<tbody>';

        let _title = this.layoutData.Layout[0].title;
        let _cols: any;

        if (_title != undefined) {
            _cols = _title['cols'];


            tit += '<tr>';
            tit += '<td colspan="' + _cols + '" style="width:100px;text-align: center;font-size: 20pt;font-weight: bold;">' + this.layoutData.Layout[0].text + '</td>'
            tit += '</tr>';


            for (let i in _title['row']) {
                tit += '<tr>';
                for (let j = 0; j < _title['row'][i].length; j++) {

                    tit += '<td style="' + _title['row'][i][j]['style'] + '" ';
                    if (_title['row'][i][j]['colspan'])
                        tit += 'colspan="' + _title['row'][i][j]['colspan'] + '"';

                    tit += '>' + this.translate_output(_title['row'][i][j]['label'], this.output);
                    tit += '</td>';
                }
                tit += '</tr>';
            }

            tit += '</tbody>';

            // done
            tit += '</table>';

            return tit;
        }
        //         <table width="100%">
        //     <tbody>
        //        <tr>
        //         <td colspan="2" style="width:100px;text-align: center;font-size: 20pt;font-weight: bold;">BÁO CÁO CHI PHÍ CÔNG TRƯỜNG</td>
        //       </tr>
        //       <tr>
        //         <td style="width: 50%;text-align: right;">Từ ngày: 07/03/2018</td>
        //         <td style="width: 50%;text-align: left;">Đến ngày: 07/03/2018</td>
        //       </tr>      

        //     </tbody>
        //   </table>
    }

    printDocument(flex: wjcGrid.FlexGrid) {

        // this.renderTitle();

        let _html = '<body onload="window.print();window.close()">';
        _html += this.renderTitle();
        if (flex) {
            var tbl = this.renderTable(flex);
            _html += tbl;
        }

        _html += '</body>'

        this.print(_html);
    }

    async exportExcel(name: string, folderPath: string, formData: FormGroup) {
        this.showLoading = true;

        let _command = this.layoutData.Layout[0].command;

        const params = new Array<ParameterContract>();

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
                _value = _value.toISOString();
            }

            if (_value instanceof Array) {
                let _valueLst = ''
                for (let i in _value) {
                    _valueLst = _valueLst + ',' + _value[i]['ValueMember']
                }

                _value = _valueLst.slice(1, _valueLst.length);
            }

            param.ParameterName = this.convertParameterName(key);
            param.ParameterValue = _value;

            params.push(param);
        }

        for (let key in this.layoutData.Layout[0].ctorArg) {
            if (formData.controls[key] == undefined && key != 'Commandkey') {
                let param = new ParameterContract();
                let _value = this.layoutData.Layout[0].ctorArg[key];

                if (_value instanceof Date) {
                    if (key.endsWith('_custom')) {
                        param.ParameterOperator = "<=";
                    }
                    else {
                        param.ParameterOperator = ">=";
                    }
                    _value = _value.toISOString();
                }

                param.ParameterName = this.convertParameterName(key);
                param.ParameterValue = _value;

                params.push(param);
            }
        }

        let ctor1 = CryptoExtension.encrypt(_command);
        const ctor2 = CryptoExtension.encrypt(JSON.stringify(params));

        let body = {
            "storeName": ctor1,
            "params": ctor2
        }

        this.srv.exportExcel(folderPath, name, body).subscribe(blob => {
            let extension = name.endsWith(".xlsx") ? ".xlsx" : ".xls";
            importedSaveAs(blob, name);
            this.showLoading = false;
        });

        // this.srv.exportHtml(folderPath + name, body).subscribe(data => {

        //     let _title = this.layoutData.Layout[0].Text;

        //     let _html = `<html>
        //                 <head>
        //                     <title>`+ _title + `</title>
        //                 </head>`;
        //     _html += '<body onload="window.print();window.close()">';

        //     _html += Global.translateImageOutput(data['html'], data['output']);

        //     _html += '</body></html>'

        //     this.showLoading = false;

        //     let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

        //     popupWin.document.write(_html);

        //     popupWin.document.close();
        // });
    }


    translate_output(expr, row: any) {
        let _result = expr;


        let controls: string[] = [];

        for (const control in row) {
            if (control.startsWith('@_', 0))
                controls.push(control.substring(2, control.length));
        }
        controls.sort((a, b) => b.length - a.length);

        for (const control of controls) {
            let patern = '{VAR=' + control + '}';
            if (_result.indexOf(patern) > -1) {

                let value = row['@_' + control];

                if (value instanceof Date) {
                    if (value != null)
                        value = value.toLocaleDateString();
                    else {
                        value = this.replaceDecimal(value);
                    }
                }

                do {
                    _result = _result.replace(patern, value);
                }
                while (_result.indexOf(patern) > -1)
            }
        }


        return _result;

    }

    replaceDecimal(value) {

        const _var = typeof (value);
        if (!value) {
            return '0';
            // return '\'\'';
        }
        let _val = value;
        if (value instanceof String) {
            if (!value.startsWith('\0'))
                _val = Number(value.split(',').join(''));
        }
        if (isNaN(_val)) {
            return '\'' + value + '\'';
        } else {
            return _val;
        }
    }


    // //Kit: 17/04/2018 Xử Output XML
    realXML(xml: string, _listCol: string, grid: wjcGrid.FlexGrid) {
        let layoutWWeb = [];
        if (_listCol == null) return;

        var parseString = require('xml2js').parseString;

        let colOutput = [];
        let gridName: string;
        parseString(xml, function (err, result) {

            for (let element in result) {
                gridName = element;
            }
            let colArr = _listCol.split(',');
            let tempData = result[gridName]['Cols'][0];
            let colList = [];
            for (let i in colArr) {
                if (tempData['Column_' + colArr[i]] != undefined) {
                    colList.push(tempData['Column_' + colArr[i]][0]);
                }

            }
            for (let col in colList) {
                let _lookupKey;
                let _lookupFilter;
                let _lookupBinding = {};

                if (colList[col]['LookupWeb'] != undefined) {
                    let _lookup = colList[col]['LookupWeb'][0];
                    _lookupKey = _lookup['LookupKey'][0];
                    _lookupFilter = _lookup['LookupFilter'][0];

                    _lookupBinding = { OriginalUnitCost: _lookup['Binding'][0].split(",")[0], OriginalAmount: _lookup['Binding'][0].split(",")[1], TradeMarkCodeSelect: _lookup['Binding'][0].split(",")[2], OriginalUnitCostSelect: _lookup['Binding'][0].split(",")[3] }

                    colOutput.push({
                        'header': colList[col]['Name'][0], 'binding': colList[col]['Name'][0], 'dataType': 'Array', 'lookupKey': _lookupKey,
                        'lookupfilter': _lookupFilter, 'bindingList': _lookupBinding
                    });
                }
                else {
                    let _aggregate = 'Sum';
                    let _dataType = 'String';
                    let _width = 100;

                    if (colList[col]['Aggregate'] != undefined)
                        _aggregate = colList[col]['Aggregate'][0];

                    if (colList[col]['DataTypeWeb'] != undefined)
                        _dataType = colList[col]['DataTypeWeb'][0];

                    if (colList[col]['Width'] != undefined)
                        _width = colList[col]['Width'][0];


                    colOutput.push({
                        'header': colList[col]['Text'][0], 'binding': colList[col]['Name'][0], 'aggregate': _aggregate, 'align': 'right', 'dataType': _dataType, 'width': Number(_width)
                    });
                }
            }

        });
        grid.columns.clear();

        for (let _c in colOutput) {

            let _col = this.layoutData.Layout[0].data[gridName].find(_cTmp => _cTmp['binding'] == colOutput[_c]['binding']);

            let _indexCol = this.layoutData.Layout[0].data[gridName].indexOf(_col);

            if (_col != undefined) {
                this.layoutData.Layout[0].data[gridName].splice(_indexCol, 1);
            }
        }

        for (let _c in colOutput) {

            let _col = this.layoutData.Layout[0].data[gridName].find(_cTmp => _cTmp['binding'] == colOutput[_c]['binding']);

            if (_col == undefined) {
                this.layoutData.Layout[0].data[gridName].push(colOutput[_c]);
            }
        }

        this.bindColumnGroups(grid, this.layoutData.Layout[0].data[gridName]);

    }

    // readJson(jsonString: string, grid: wjcGrid.FlexGrid) {
    //     let gridName: string;



    //     var objJson = JSON.parse(jsonString);
    //     for (let element in objJson[0]) {
    //         gridName = element;
    //     }

    //     // for(let c of objJson[0][gridName]){
    //     //     this.layoutData.Layout[0].data[gridName].push(c);
    //     // }

    //     grid.columns.clear();

    //     for (let _c in objJson[0][gridName]) {

    //         let _col = this.layoutData.Layout[0].data[gridName].find(_cTmp => _cTmp['binding'] == objJson[0][gridName][_c]['binding']);

    //         let _indexCol = this.layoutData.Layout[0].data[gridName].indexOf(_col);

    //         if (_col != undefined) {
    //             this.layoutData.Layout[0].data[gridName].splice(_indexCol,1);
    //         }
    //     }

    //     for (let _c in objJson[0][gridName]) {

    //         let _col = this.layoutData.Layout[0].data[gridName].find(_cTmp => _cTmp['binding'] == objJson[0][gridName][_c]['binding']);

    //         if (_col == undefined) {
    //             this.layoutData.Layout[0].data[gridName].push(objJson[0][gridName][_c]);
    //         }
    //     }

    //     this.bindColumnGroups(grid, this.layoutData.Layout[0].data[gridName]);

    // }

    readJson(jsonString: string, grid: wjcGrid.FlexGrid) {
        let gridName: string;

        let colOutput = [];
        var objJson = JSON.parse(jsonString); //lỗi khi parse

        if (objJson == null) return;

        for (let element in objJson[0]) {
            gridName = element;
        }

        for (let c of objJson[0][gridName]) {
            colOutput.push(c);
        }

        grid.columns.clear();

        let startRemove: number;
        let numColRemove: number = 0;
        let numColOriginal: number = 0;

        for (let _c of this.layoutData.Layout[0].data[gridName]) {
            let _col = this.layoutData.Layout[0].data[gridName].find(_cTmp => (_cTmp['isColumnOriginal'] == false || _cTmp['isColumnOriginal'] == undefined) && _c['binding'] == _cTmp['binding']);
            let _colOriginal = this.layoutData.Layout[0].data[gridName].find(_cTmp => _cTmp['isColumnOriginal'] == true && _c['binding'] == _cTmp['binding']);
            let _indexCol = this.layoutData.Layout[0].data[gridName].indexOf(_col);
            if (_col != undefined) {
                numColRemove = numColRemove + 1;
            }

            if (_colOriginal != undefined) {
                numColOriginal = numColOriginal + 1;
            }

        }

        let _indexInsert;
        if (this.layoutData.Layout[0].JsonColumnPos) {
            _indexInsert = this.layoutData.Layout[0].JsonColumnPos[gridName];
            startRemove = this.layoutData.Layout[0].JsonColumnPos[gridName];
        }
        else {
            startRemove = numColOriginal;
        }

        if (numColRemove > 0) {
            this.layoutData.Layout[0].data[gridName].splice(startRemove, numColRemove);
        }

        for (let _c in colOutput) {
            if (this.layoutData.Layout[0].JsonColumnPos) {

                this.layoutData.Layout[0].data[gridName].splice(_indexInsert, 0, colOutput[_c]);
                _indexInsert += 1;
            }
            else {
                this.layoutData.Layout[0].data[gridName].push(colOutput[_c]);
            }
        }

        this.bindColumnGroups(grid, this.layoutData.Layout[0].data[gridName]);

    }

    async postXML(formData: FormGroup) {
        let params = new Array<ParameterContract>();
        let flagParam = false;

        let constraintKey = this.layoutData.Layout[0].postxml['constraintkey'].split(',');

        try {
            for (let i in constraintKey) {

                let key = constraintKey[i];

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

            let paramXML = new ParameterContract();
            paramXML.ParameterName = this.convertParameterName(this.layoutData.Layout[0].postxml['tablename']);
            paramXML.ParameterValue = this.layoutData.Layout[0].postxml['tablename'];

            params.push(paramXML);

            let ds = Global.getDataSetContract(
                {
                    name: this.layoutData.Layout[0].postxml['tablename'],
                    collection: this.gridArray[this.layoutData.Layout[0].postxml['griddata']].itemsSource.items //this.grid1.itemsSource.items
                }
            )
            let _data = await this.srv.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, this.layoutData.Layout[0].postxml['command'], params, ds)
                .toPromise().then();

            this.data2 = new wjcCore.CollectionView(_data);

            this.showLoading = false;

            // this.srv.getDataEncrypt(Global.MainEndPoint , _command, params)
            //     .subscribe(data => {

            //         this.data = new wjcCore.CollectionView(data);
            //         this.bIsRunReport = true;
            //     });
        }
        finally {
            //this.showLoading = false;
            //this.bIsRunReport = true;
        }


    }

    // _applyGroup(_grid: wjcGrid.FlexGrid, colGroup: string) {
    //     if (_grid.collectionView) {
    //       var cv = _grid.collectionView;
    //       if (cv != null) {
    //         cv.beginUpdate();
    //         cv.groupDescriptions.clear();

    //         var groupDesc = new wjcCore.PropertyGroupDescription(colGroup);
    //         cv.groupDescriptions.push(groupDesc);
    //         _grid.groupHeaderFormat = '<b>{value}</b> ({count:n0} mục) ';
    //         cv.endUpdate();
    //       }
    //       _grid.collapseGroupsToLevel(1);
    //     }
    //   }

    _applyGroup(_grid: wjcGrid.FlexGrid) {
        var cv = _grid.collectionView;
        if (cv != null) {
            cv.beginUpdate();
            cv.groupDescriptions.clear();

            let _groupList = this.groupList[this.gridArray.indexOf(_grid)];
            if (_groupList) {
                var groupNames = _groupList.split(',');
                for (var i = 0; i < groupNames.length; i++) {
                    var groupName = groupNames[i];
                    var groupDesc = new wjcCore.PropertyGroupDescription(groupName);
                    cv.groupDescriptions.push(groupDesc);
                }
                cv.refresh();
            }
            cv.endUpdate();
            if (this.layoutData.Layout[0].showTotalGroup !== undefined){
                if(this.layoutData.Layout[0].showTotalGroup == false){
                    console.log(this.layoutData.Layout[0].showTotalGroup);
                    _grid.groupHeaderFormat = '<b>{value}</b>';
                }
                else{
                    _grid.groupHeaderFormat = '<b>{value}</b> ({count:n0} mục) ';
                }
            }
            else{
                _grid.groupHeaderFormat = '<b>{value}</b> ({count:n0} mục) ';
            }

        }


        if (this.nCollapseNodesOnCreate) {
            _grid.collapseGroupsToLevel(Number(this.nCollapseNodesOnCreate[this.gridArray.indexOf(_grid)]));
        }
        else {
            _grid.collapseGroupsToLevel(0);
        }
    }

    _applyGroupTreeNode(_grid: wjcGrid.FlexGrid) {
        let colGroup = this.lstColGroup[this.gridArray.indexOf(_grid)];

        var cv = _grid.collectionView;
        if (cv != null) {

            cv.beginUpdate();
            cv.groupDescriptions.clear();
            if (colGroup) {
                var groupNames = colGroup.split(',');
                for (var i = 0; i < groupNames.length; i++) {
                    var groupName = groupNames[i];

                    var groupDesc = new wjcCore.PropertyGroupDescription(groupName);
                    cv.groupDescriptions.push(groupDesc);
                }
                cv.refresh();
            }

            // for (let i in cv.groups) {
            //     if (cv.groups[i].name == '') {
            //         cv.groups.splice()
            //     }
            // }

            cv.endUpdate();
            if (this.layoutData.Layout[0].showTotalGroup !== undefined){
                if(this.layoutData.Layout[0].showTotalGroup == false){
                    _grid.groupHeaderFormat = '<b>{value}</b>';
                }
                else{
                    _grid.groupHeaderFormat = '<b>{value}</b> ({count:n0} mục) ';
                }
            }
            else{
                _grid.groupHeaderFormat = '<b>{value}</b> ({count:n0} mục) ';
            }
        }
        let lstRemove = [];
        for (let _r = 0; _r < _grid.rows.length; _r++) {
            if (_grid.rows[_r]._data.groups != undefined) {
                if (_grid.rows[_r]._data.name == "") {
                    // _grid.rows.removeAt(_r);
                    // _grid.rows.remove(_grid.rows[_r]);
                    lstRemove.push(_grid.rows[_r]);
                }
            }

        }

        for (let item of lstRemove) {
            _grid.rows.remove(item);

        }

        if (this.nCollapseNodesOnCreate) {
            _grid.collapseGroupsToLevel(Number(this.nCollapseNodesOnCreate[this.gridArray.indexOf(_grid)]));
        }
        else {
            _grid.collapseGroupsToLevel(0);
        }
    }

    itemsSourceChangedHandler(_grid: wjcGrid.FlexGrid) {
        let indexGrid = this.gridArray.indexOf(_grid);
        if (this.layoutData.Layout[0].treeNode) {
            if (this.layoutData.Layout[0].treeNode.indexOf(indexGrid) > -1) {
                this._applyGroupTreeNode(_grid);
            }
        }

        if (this.layoutData.Layout[0].subTotals) {
            if (this.layoutData.Layout[0].subTotals[indexGrid] != undefined) {
                this._applyGroup(_grid);
            }

        }
    }

    createAggregateGrid(grid: wjcGrid.FlexGrid) {

        var row = new wjcGrid.GroupRow();
        grid.columnFooters.rows.clear();
        grid.columnFooters.rows.push(row);
        grid.bottomLeftCells.setCellData(0, 0, '\u03A3');

        grid.columnFooters.setCellData(0, 0, 'Tổng cộng');
        grid.columnFooters.hostElement.style.textAlign = 'center';
        let _t = new wjcCore.GroupDescription();
        row.dataItem = new wjcCore.CollectionViewGroup(_t, '', 0, true);
    }

    paintGrid(grid: wjcGrid.FlexGrid, element: string) {
        if (this.layoutData.Layout[0].styles != undefined) {
            let style = this.layoutData.Layout[0].styles[element];

            let _format = (s, e: wjcGrid.FormatItemEventArgs) => {

                if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
                    let data = s.rows[e.row].dataItem;

                    if (e.panel.cellType == wjcGrid.CellType.Cell) {


                        //format column
                        for (let column of style.columns) {
                            if (e.panel == s.cells && s.columns[e.col].binding == column.name) {

                                wjcCore.setCss(e.cell, column.style);

                                if (column.cell != undefined) {

                                    for (let cell of column.cell) {

                                        let exprCell = cell.expr;

                                        exprCell = Global.translateAutoText(exprCell, data);

                                        if (eval(exprCell)) {
                                            wjcCore.setCss(e.cell, cell.style);
                                        }
                                        else {
                                            wjcCore.setCss(e.cell, cell.noStyle);
                                        }
                                    }
                                }
                            }

                        }
                        //format row
                        for (let row of style.rows) {
                            let exprRow = row.expr;

                            exprRow = Global.translateAutoText(exprRow, data);
                            if (eval(exprRow)) {
                                wjcCore.setCss(e.cell, row.style);
                            }
                            else {
                                wjcCore.setCss(e.cell, row.noStyle);
                            }

                        }

                        //format cell theo dữ liệu trả ra
                        // for(let col in data){
                        //     if (data[col] != null && data[col] != '' && data[col] != undefined){
                        //         if(e.panel == s.cells && data[col].toString().indexOf('{') > -1 && s.columns[e.col].binding == col){
                        //             let _value = data[col].toString().substring(0,data[col].toString().indexOf('{'))
                        //             let _style = JSON.parse(data[col].toString().substring(data[col].toString().indexOf('{'),data[col].toString().indexOf('}')+1));

                        //             wjcCore.setText(e.cell, _value);
                        //             wjcCore.setCss(e.cell, _style);
                        //         }
                        //     }
                        // }


                    }

                    if (e.panel.cellType == wjcGrid.CellType.ColumnHeader) {
                        wjcCore.setCss(e.cell, { textAlign: "center" });
                    }
                }
            };

            grid.formatItem.removeHandler(_format);
            grid.formatItem.addHandler(_format);
        }
    }

    // exportExcelWijmo(filename: string) {
    //     wjcGridXlsx.FlexGridXlsxConverter.save(this.grid, {
    //         includeColumnHeaders: true,
    //         includeColumns: function (column) {
    //             return column.width !== 0;
    //         },
    //         includeCellStyles: true,

    //         formatItem: false ? this._exportFormatItem : null
    //     }, filename + '.xlsx');
    // }

    // _exportFormatItem(args: wjcGridXlsx.XlsxFormatItemEventArgs) {
    //     var p = args.panel,
    //         row = args.row,
    //         col = args.col,
    //         xlsxCell = args.xlsxCell,
    //         cell: HTMLElement,
    //         color: string;

    //     if (p.cellType === wjcGrid.CellType.Cell) {
    //         if (p.columns[col].binding === 'color') {
    //             //color = p.rows[row].dataItem['color'];
    //             if (xlsxCell.value) {
    //                 if (!xlsxCell.style.font) {
    //                     xlsxCell.style.font = {};
    //                 }
    //                 xlsxCell.style.font.color = (<string>xlsxCell.value).toLowerCase();
    //             }
    //         } else if (p.columns[col].binding === 'active' && p.rows[row] instanceof wjcGrid.GroupRow) {
    //             cell = args.getFormattedCell();
    //             xlsxCell.value = cell.textContent.trim();
    //             xlsxCell.style.hAlign = wjcXlsx.HAlign.Left;
    //         }
    //     }
    // }

    exportExcelWijmo() {
        this.showLoading = true;
        let grids = new Array<wjcGrid.FlexGrid>();
        grids.push(this.grid)
        if (this.totalGrid >= 2) {
            grids.push(this.grid1)
        }
        if (this.totalGrid >= 3) {
            grids.push(this.grid2)
        }
        if (this.totalGrid >= 4) {
            grids.push(this.grid3)
        }
        if (this.totalGrid >= 5) {
            grids.push(this.grid4)
        }
        if (this.totalGrid >= 6) {
            grids.push(this.grid5)
        }
        Global.exportMultiGrid(this.layoutData.Layout[0].text, this.layoutData.Layout[0].title, this.layoutData.Layout[0].summary, grids, this.layoutData.Layout[0].rowHeader, this.output);
        this.showLoading = false;
    }

    _exportFormatItem(args: wjcGridXlsx.XlsxFormatItemEventArgs) {
        var p = args.panel,
            row = args.row,
            col = args.col,
            xlsxCell = args.xlsxCell,
            cell: HTMLElement,
            color: string;

        if (p.cellType === wjcGrid.CellType.Cell) {
            if (p.columns[col].isContentHtml === true) {
                //color = p.rows[row].dataItem['color'];
                if (xlsxCell.value) {
                    if (!xlsxCell.style.font) {
                        xlsxCell.style.font = {};
                    }
                    xlsxCell.style.font.color = (<string>xlsxCell.value).toLowerCase();
                }
            }
        }
    }

    formatGroupByGrid(grid: wjcGrid.FlexGrid, element: string) {
        if (this.layoutData.Layout[0].formatGroup != undefined) {
            let _formatGroup = this.layoutData.Layout[0].formatGroup[element];

            let _format = (s, e: wjcGrid.FormatItemEventArgs) => {
                if (s.rows[e.row] != undefined && s.rows[e.row]._data.items != undefined) {

                    let _lv = s.rows[e.row]._data._level;

                    for (let i in _formatGroup) {
                        if (e.panel.cellType == wjcGrid.CellType.Cell && _lv == _formatGroup[i]['level']) {

                            wjcCore.setCss(e.cell, _formatGroup[_lv]['style']);
                        }
                        else {
                            wjcCore.setCss(e.cell, null);
                        }
                    }

                }
                else {
                    let _noStyle = _formatGroup.find(_cTmp => _cTmp['level'] == -1)
                    wjcCore.setCss(e.cell, _noStyle.style);
                }
            };

            grid.formatItem.removeHandler(_format);
            grid.formatItem.addHandler(_format);
        }
    }

    keyDownEvent(e: any, grid: wjcGrid.FlexGrid) {
        if (e.ctrlKey) {
            if (e.keyCode == 189) {
                grid.collapseGroupsToLevel(0);
                e.preventDefault();
            } else if (e.keyCode == 187) {
                grid.collapseGroupsToLevel(5);
                e.preventDefault();
            } else if (e.keyCode == 70) {
                if (this.allowFilter == false)
                    this.allowFilter = true;
                else
                    this.allowFilter = false;
                e.preventDefault();
            }
        }
    }


    mergeCells(flex: wjcGrid.FlexGrid, element: string) {

        if (this.layoutData.Layout[0].columnAllowMerge != undefined) {
            let _listColumnAllow = this.layoutData.Layout[0].columnAllowMerge[element];
            flex.allowMerging = wjcGrid.AllowMerging.All;
            for (let i = 0; i < flex.columns.length; i++) {
                if (_listColumnAllow.indexOf(flex.columns[i].binding) >= 0) {
                    flex.cells[0].allowMerging = true;
                }
                else {
                    flex.columns[i].allowMerging = false;

                }
            }
        }
    }

    frozenGrid(flex: wjcGrid.FlexGrid, element: string) {
        if (this.layoutData.Layout[0].frozen) {
            if (this.layoutData.Layout[0].frozen[element].columns != undefined) {
                flex.frozenColumns = this.layoutData.Layout[0].frozen[element].columns;
            }
            if (this.layoutData.Layout[0].frozen[element].rows != undefined) {
                flex.frozenRows = this.layoutData.Layout[0].frozen[element].rows;
            }
        }

    }

    clickPieSlice(flex?: wjcGrid.FlexGrid) {
        let _selectedIndex = this.pieChart._selectionIndex;
        if (this.layoutData.Layout[0].dataChart.selection) {

            this.selectionPie = this.layoutData.Layout[0].dataChart.selection;
            let sliceSelect = this.pieChart.itemsSource.items[_selectedIndex];

            let _value = this.pieChart.itemsSource.items[_selectedIndex][this.selectionPie.primaryKey]
            if (flex) {
                let data;
                if (this.selectionPie.operation == '=') {
                    data = flex.itemsSource.items.filter(item => item[this.selectionPie.foreignKey] == _value);
                }

                this.valuePie = this.selectionPie.valuePie;
                this.namePie = this.selectionPie.namePie;
                this.dataChart = new wjcCore.CollectionView(data);
            }


        }
    }

    downloadAfterClick(grid: wjcGrid.FlexGrid) {

        let host = grid.hostElement;
        let self = this;

        host.addEventListener('click', (e) => {
            let existDownLoad: boolean = false;
            let _linkDownLoad = <HTMLElement>(e.srcElement);
            if (_linkDownLoad.getElementsByClassName('downLoadFileAttach').length > 0 || _linkDownLoad.innerHTML.indexOf('Tải tệp đính kèm') > -1)
                existDownLoad = true
            if (existDownLoad) {
                let _folderName: string = grid.selectedItems[0]['Link'];
                let child_FolderId: any = grid.selectedItems[0]['Id'];
                let name: string = grid.selectedItems[0]['FilePath'];
console.log(_folderName);
console.log(child_FolderId);
console.log(name);
                if (name) {
                    const sub = this.srv.dowload(_folderName, child_FolderId, name).subscribe(blob => {

                        importedSaveAs(blob, name);

                        //Tạm đóng mở file pdf
                        // if (name.toUpperCase().endsWith('PDF') == false)
                        //   importedSaveAs(blob, name);
                        // else {
                        //   let url = window.URL.createObjectURL(blob);

                        //   let params = { 'folderName': _folderName, 'id': child_FolderId, 'name': name }
                        //   let navigateUrl: any = ['#/main', 'documentview', 'detail', encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)))];
                        //   window.open(navigateUrl.join('/'));

                        //   //window.open(url);
                        // }
                    });
                    this.subscription.add(sub);
                }
                else {
                    alert('Không tìm thấy file.')
                }
            }
        });
    }
}
