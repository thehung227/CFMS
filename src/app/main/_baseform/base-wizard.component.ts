import { Component, HostListener, ElementRef, EventEmitter, Output, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import * as wjcGridXlsx from 'wijmo/wijmo.grid.xlsx';
import * as wjcXlsx from 'wijmo/wijmo.xlsx';

// SERVICE
import { BaseEditorService } from './../../base/base.service-editor';

// CONTRACTS
import { ParameterContract } from './../../contracts/parameter.contract';
import { DataSetContract } from './../../contracts/dataset.contract';
import { ColumnContract } from './../../contracts/column.contract';
import { RowContract } from './../../contracts/row.contract';
import { TableContract } from './../../contracts/table.contract';

import { DataRowState } from './../../core/enum/type.enum';

// WIJMO
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcInput from 'wijmo/wijmo.angular2.input';

import { Global } from './../../shared/global';
import { BravoCtorEnum } from './../../core/enum/type.enum';

import { ActivatedRoute, Router } from '@angular/router';

import { InputBase } from './../../ui/input/InputBase';
import { TextBoxInput } from './../../ui/input/TextBoxInput';
import { DateBoxInput } from './../../ui/input/DateBoxInput';
import { CheckBoxInput } from './../../ui/input/CheckBoxInput';
import { LookupBoxInput } from './../../ui/input/LookupBoxInput';
import { ButtonInput } from './../../ui/input/ButtonInput';
import { UploadInput } from './../../ui/input/UploadInput';

import { PanelControlService } from './../../ui/panel/PanelControlService';

import { DynamicFormPanelComponent } from './../../ui/form/dynamic-form-panel.component';
import { PanelBase } from './../../ui/panel/PanelBase';
import { TablePanel } from './../../ui/panel/TablePanel';
import { DynamicFormEditorInputComponent } from './../../ui/form/editor/dynamic-form-editor-input.component';

import { SystemConstants } from './../../core/common/system.constants';
import { BravoSiteStorage } from './../../core/domain/bravo.site.storage';
import { NumberBoxInput } from '../../ui/input/NumberBoxInput';
import { InputDate, InputNumber, AutoComplete, InputDateTime, MultiAutoComplete, MultiSelect, Popup } from 'wijmo/wijmo.input';
import { CollectionView, SortDescription, DataType } from 'wijmo/wijmo';
import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http';
import { MultiSelectInput } from '../../ui/input/MultiSelectInput';
import { Console } from '@angular/core/src/console';
import { Subscription } from 'rxjs/Subscription';
import { saveAs as importedSaveAs } from "file-saver";
import { Title } from '@angular/platform-browser';
import { BaseWizardService } from '../../base/base.service-wizard';
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';


export abstract class BaseWizardComponent implements OnDestroy, OnInit {
    inputs: any[];
    panel: PanelBase;
    @ViewChild('dfpanel') dfpanel: DynamicFormPanelComponent;

    protected showDialog = false;
    protected gridArray: wjcGrid.FlexGrid[];
    datafilter: wjcCore.CollectionView;
    dataEditor: wjcCore.CollectionView;
    dataEditor1: wjcCore.CollectionView;
    dataEditor2: wjcCore.CollectionView;
    dataEditor3: wjcCore.CollectionView;
    dataEditor4: wjcCore.CollectionView;
    dataEditor5: wjcCore.CollectionView;
    dataAdjust: wjcCore.CollectionView;
    dataReport: wjcCore.CollectionView;

    dataEditor6: wjcCore.CollectionView;
    dataEditor7: wjcCore.CollectionView;
    dataEditor8: wjcCore.CollectionView;
    dataEditor9: wjcCore.CollectionView;
    dataEffective: wjcCore.CollectionView;

    @ViewChild('gridFilter') gridFilter: wjcGrid.FlexGrid;

    @ViewChild('gridEditor') gridEditor: wjcGrid.FlexGrid;
    @ViewChild('gridEditor1') gridEditor1: wjcGrid.FlexGrid;
    @ViewChild('gridEditor2') gridEditor2: wjcGrid.FlexGrid;
    @ViewChild('gridEditor3') gridEditor3: wjcGrid.FlexGrid;
    @ViewChild('gridEditor4') gridEditor4: wjcGrid.FlexGrid;
    @ViewChild('gridEditor5') gridEditor5: wjcGrid.FlexGrid;

    @ViewChild('gridAdjust') gridAdjust: wjcGrid.FlexGrid;
    @ViewChild('gridReport') gridReport: wjcGrid.FlexGrid;
    @ViewChild('gridEffective') gridEffective: wjcGrid.FlexGrid;

    @ViewChild('gridEditor6') gridEditor6: wjcGrid.FlexGrid;
    @ViewChild('gridEditor7') gridEditor7: wjcGrid.FlexGrid;
    @ViewChild('gridEditor8') gridEditor8: wjcGrid.FlexGrid;
    @ViewChild('gridEditor9') gridEditor9: wjcGrid.FlexGrid;
    
    @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;
    protected id: number = -1;
    protected editorFrm: FormGroup;
    protected _layoutDeclare: any;
    protected _columnChangeChild: any;
    protected _serverConstraint: any;
    protected _evaluator: any;
    protected folderName;
    //   protected deleteRows: string[];
    //   protected _rowIdex;
    //   protected errorMessage: string;
    showLoading = false;

    subscription: Subscription;
    protected paramsRoute: any;
    protected zCommandKey: string;

    protected output: Array<Object>;
    paramsReport: {};

    tab0Click = false;
    tab1Click = false;
    tab2Click = false;
    tab3Click = false;

    constructor(protected _service: BaseWizardService,
        private route: ActivatedRoute,
        private pcs: PanelControlService,
        private elRef: ElementRef,
        private router: Router,
        private titleService: Title
    ) {
        const sub = this.route.params.subscribe(param => {
            if (this.zCommandKey && this.zCommandKey != param['id']) {
                this.zCommandKey = param['id'];
                this.paramsRoute = param['params'];
                //this.initialize();
            }
            else {
                this.zCommandKey = param['id'];
                this.paramsRoute = param['params'];
            }

        });
        this.subscription = new Subscription();

        this.subscription.add(sub);

        if (this.paramsRoute) {
            let dataPara = <Array<string>>JSON.parse(this.paramsRoute);


            if (dataPara != undefined && dataPara != null) {
                if (dataPara['Commandkey'] == this.zCommandKey) {
                    this.paramsReport = dataPara;
                }
            }
        }
    }

    public setTitle(newTitle: string) {
        this.titleService.setTitle(newTitle);
    }

    handleKeyDown(event: any) {
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    }

    async ngOnInit() {
        this.gridArray = [this.gridFilter, this.gridEditor, this.gridEditor1, this.gridEditor2, this.gridEditor3, this.gridEditor4, this.gridEditor5, this.gridEditor6, this.gridEditor7, this.gridEditor8, this.gridEditor9, this.gridAdjust, this.gridReport, this.gridEffective];
        await this.initialize();
        await this.init();

        this.gridEditor.isReadOnly = true;
        //this.gridEditor1.isReadOnly = true;
        this.gridEditor2.isReadOnly = true;
        this.gridEditor3.isReadOnly = true;
        this.gridEditor4.isReadOnly = true;
        this.gridAdjust.isReadOnly = true;
        this.gridReport.isReadOnly = true;
        this.gridEditor6.isReadOnly = true;
        //this.gridEditor7.isReadOnly = true;

        for (let i in this.gridArray) {
            if (i != '7' && i != '0') {
                this.gridArray[i].rowHeaders.columns.maxSize = 2;
            }
        }

        if (this.paramsReport != undefined) {
            // for (let control in this.paramsReport) {
            //   if (this.paramsReport[control] && this.editorFrm.controls[control]) {
            //       console.log(this.editorFrm.controls[control]);
            //       console.log(this.paramsReport[control]);
            //     this.editorFrm.controls[control].setValue(this.paramsReport[control]);
            //   }
            // }
            await this.dfpanel.updateValueForm(this.paramsReport);
        }

        this.dfpanel.parentData = this.editorFrm.value;

        for (let i in this.gridArray) {
            this.gridArray[i].hostElement.addEventListener('click', (e: any) => {
                var rowSelection = this.gridArray[i].selection.row;
                if (wjcCore.hasClass(e.target, 'custom-check-box')) {
                    var groupData = this.gridArray[i].rows[rowSelection].dataItem;
                    let _rowLen = groupData.items.length;
                    for (let i = 0; i < _rowLen; i++) {

                        // this.gridArray[i].beginUpdate();
                        this.gridArray[i].setCellData(i + rowSelection + 1, 0, e.target.checked);
                        // this.gridArray[i].endUpdate();
                    }
                }
            }, true);
        }
    }

    ngAfterViewInit() {

        this.gridArray[1].formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

            if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
                let data = s.rows[e.row].dataItem;

                if (e.panel.cellType == wjcGrid.CellType.Cell) {
                    if (data['_FormatStyleKey'] == 1) {
                        wjcCore.setCss(e.cell, {
                            color: 'blue',
                            fontWeight: 'bold',
                            backgroundColor: '#f8f1e6'
                        });
                    } else
                        if (data['_FormatStyleKey'] == -1) {
                            wjcCore.setCss(e.cell, {
                                color: 'white',
                                fontWeight: '',
                                backgroundColor: 'white'
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

        for (let grid of this._layoutDeclare[0]['nextEdit']['style']) {

            this.gridArray[grid.Table].formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

                if (grid.type == 'MINROW' || grid.type == 'MAXROW') {
                    if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined && s.rows[e.row].dataItem['groupDescription'] == undefined) {
                        let data = s.rows[e.row].dataItem;
                        let exprRow = grid.exprRow;
                        exprRow = Global.translateAutoText(exprRow, data);

                        if (eval(exprRow)) {

                            if (e.panel.cellType === wjcGrid.CellType.Cell) {

                                let columnEnd;
                                let _valueflag = 0;
                                if (grid.columnEnd != undefined)
                                    columnEnd = grid.columnEnd + 1;
                                else
                                    columnEnd = s.columns.length;

                                for (let i = grid.columnStart; i < columnEnd; i++) {
                                    let value = s.cells.getCellData(e.row, i, false);
                                    if (grid.type == 'MINROW') {
                                        if (value > 0 && (_valueflag == 0 || value <= _valueflag)) {
                                            _valueflag = value;
                                        }
                                    }
                                    else if (grid.type == 'MAXROW') {
                                        if (value > _valueflag && value > 0) {
                                            _valueflag = value;
                                        }
                                    }

                                }

                                if (Global.replaceString(e.cell.innerHTML, ',') == _valueflag.toString()) {
                                    wjcCore.setCss(e.cell, {
                                        color: 'red',
                                        fontWeight: 'bold',
                                    });
                                }
                                else {
                                    wjcCore.setCss(e.cell, {
                                        color: '',
                                        fontWeight: '',
                                    });
                                }

                            }
                        }
                    }
                }
                else if (grid.type == 'MINCOLUMN' || grid.type == 'MAXCOLUMN') {

                    if (e.panel.cellType === wjcGrid.CellType.Cell) {
                        let columnEnd;
                        if (grid.columnEnd != undefined)
                            columnEnd = grid.columnEnd + 1;
                        else
                            columnEnd = s.columns.length;

                        let valueArr = []
                        for (let i = grid.columnStart; i < columnEnd; i++) {

                            let _valueflag = 0;
                            for (let _r = 0; _r < s.rows.length; _r++) {


                                let value = s.cells.getCellData(_r, i);

                                if (grid.type == 'MINCOLUMN') {
                                    if (value > 0 && (_valueflag == 0 || value <= _valueflag)) {
                                        _valueflag = value;
                                    }
                                }
                                else if (grid.type == 'MAXCOLUMN') {
                                    if (value > _valueflag && value > 0) {
                                        _valueflag = value;
                                    }
                                }


                            }
                            valueArr.push(_valueflag);

                        }
                        for (let _v in valueArr) {
                            if (Global.replaceString(e.cell.innerHTML, ',') == valueArr[_v].toString() && e.col == Number(_v) + grid.columnStart) {
                                wjcCore.setCss(e.cell, {
                                    color: 'red',
                                    fontWeight: 'bold',
                                });
                            }
                            else {
                                wjcCore.setCss(e.cell, {
                                    color: '',
                                    fontWeight: '',
                                });
                            }
                        }
                    }
                }
                else {
                    if (e.panel.cellType === wjcGrid.CellType.Cell) {
                        let columnEnd;
                        if (grid.columnEnd != undefined)
                            columnEnd = grid.columnEnd + 1;
                        else
                            columnEnd = s.columns.length;

                        for (let i = grid.columnStart; i < columnEnd; i++) {

                            let _valueflag = 0;
                            for (let _r = 0; _r < s.rows.length; _r++) {

                                if (e.col >= grid.columnStart && e.col <= columnEnd) {
                                    wjcCore.setCss(e.cell, {
                                        backgroundColor: '#FDF9EA'
                                    });
                                }
                                else {
                                    wjcCore.setCss(e.cell, {
                                        backgroundColor: ''
                                    });
                                }



                            }

                        }
                    }
                }
            });
        }




    }

    // add a footer row to the grid
    createAggregateGrid(grid: wjcGrid.FlexGrid) {

        var row = new wjcGrid.GroupRow();
        grid.columnFooters.rows.clear();
        grid.columnFooters.rows.push(row);
        grid.bottomLeftCells.setCellData(0, 0, '\u03A3');

        grid.columnFooters.setCellData(0, 0, 'Tổng cộng');

        let _t = new wjcCore.GroupDescription();
        row.dataItem = new wjcCore.CollectionViewGroup(_t, '', 0, true);
    }

    grouAggregateGrid(groupBy: string, data: wjcCore.CollectionView) {
        data.groupDescriptions.clear();
        var groups = groupBy ? groupBy.split(',') : [];
        for (var i = 0; i < groups.length; i++) {
            data.groupDescriptions.push(new wjcCore.PropertyGroupDescription(groups[i]));
        }
    }

    // private updateAggregateRow(grid, aggregateRow) {
    //     if (aggregateRow && this.bAllowGrandTotal) {
    //         grid.setCellData(aggregateRow.index, 0, "Tổng cộng: ", false);
    //         for (var i = 0; i < grid.columns.length; i++) {
    //             var col = grid.columns[i];
    //             col.allowMerging = true;
    //             if (col.binding && col.aggregate) {
    //                 var value = wjcCore.getAggregate(col.aggregate, grid.collectionView.items, col.binding)
    //                 grid.setCellData(aggregateRow.index, col.index, value, false);
    //             }
    //         }
    //     }
    // }

    async initialize() {
        this.inputs = [];
        this._layoutDeclare[0].parameters.forEach(param => {
            switch (param.className) {
                case 'LookupBoxInput':
                    let _lb = new LookupBoxInput({
                        key: param.key,
                        label: param.label,
                        lookupKey: param['lookupKey'],
                        lookupfilter: param['lookupfilter'],
                        isContentHtml: false,
                        isReadOnly: param['isReadOnly'],
                        hideValueMember: param['hideValueMember']
                    }, this._service, null);

                    this.inputs.push(_lb);
                    break;
                case 'MultiSelectInput':
                    let _mt = new MultiSelectInput({
                        key: param.key,
                        label: param.label,
                        lookupKey: param['lookupKey'],
                        lookupfilter: param['lookupfilter'],
                        isContentHtml: false,
                        isReadOnly: param['isReadOnly']
                    }, this._service);

                    this.inputs.push(_mt);
                    break;
                case 'DateBoxInput':
                    let _db = new DateBoxInput({
                        key: param.key,
                        label: param.label,
                        type: 'date',
                        format: 'dd/MM/yyyy',
                        isReadOnly: param['isReadOnly']
                    });

                    this.inputs.push(_db);
                    break;

                default:
                    let _tb = new TextBoxInput({
                        key: param.key,
                        label: param.label,
                        type: 'text',
                        isReadOnly: param['isReadOnly']
                    })

                    this.inputs.push(_tb);
                    break;
            }
        });
        this.panel = new TablePanel({
            label: 'Panel 1',
            col: 12, controls: this.inputs, className: ''
        });
        this.editorFrm = this.pcs.toFormGroup([this.panel]);


    }
    async init() {

        if (document.getElementById("titleName"))
            this.setTitle('Newtecons - ' + document.getElementById("titleName").innerText);

        this.showLoading = true;




        this.panel.controls.forEach(control => {
            if (control instanceof LookupBoxInput) {
                control.controlCollection = this.controlCollection;
            }
        })
        await this.setupDataSource().then();
        this.onInitialComplete();
        this.showLoading = false;

    }


    onInitialComplete() {
        console.log('########################## onInitialComplete');

        this.dfpanel.columnChangedChild = this._columnChangeChild;
        this.dfpanel.evaluators = this._evaluator;
        this.dfpanel.serverConstraint = this._serverConstraint;
        this.dfpanel.gridArray = this.gridArray;
        this.dfpanel.isUsingEvaluator = true;
        this.dfpanel.isUsingBinding = true;

        for (let i in this.dfpanel.gridArray) {
            // this.sort('BuiltinOrder', Number(i), true);
            let ds: CollectionView = this.dfpanel.gridArray[i].itemsSource;
            ds.trackChanges = true;

            this.dfpanel.gridArray[i].cellEditEnded.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {
                let column = this.dfpanel.gridArray[i].columns[e.col].binding;
                this.cellValueChanged(i, column, e);
            })
            // console.log(this.gridArray[i]);
        }

    }

    async setupDataSource() {

        let index = 0;
        if (this._layoutDeclare[0].filterGrid.gridFilter != undefined) {
            this.gridArray[0].itemsSource = new CollectionView();
            this.gridArray[0].itemsSource.trackChanges = true;
            index = 0;
        }

        if (this._layoutDeclare[0]['nextEdit']['data'] != undefined) {
            let childs = this._layoutDeclare[0]['nextEdit']['data'];
            for (let i = 1; i <= 8; i++) {
                this.gridArray[i].itemsSource = new CollectionView();
                this.gridArray[i].itemsSource.trackChanges = true;
                index = i;
            }
        }
        if (this._layoutDeclare[0]['nextAdjust']['data'] != undefined) {
            let childs = this._layoutDeclare[0]['nextAdjust']['data'];
            // for (let i = 1; i <= 2; i++) {
                this.gridArray[9].itemsSource = new CollectionView();
                this.gridArray[9].itemsSource.trackChanges = true;
                this.gridArray[11].itemsSource = new CollectionView();
                this.gridArray[11].itemsSource.trackChanges = true;
            // }
        }
        if (this._layoutDeclare[0]['nextResult']['data'] != undefined) {
            this.gridArray[index + 2].itemsSource = new CollectionView();
            this.gridArray[index + 2].itemsSource.trackChanges = true;
        }
    }

    async loadFilterGrid(formData: FormGroup) {
        let params = new Array<ParameterContract>();
        let flagParam = false;


        try {
            let _layout = this._layoutDeclare[0].filterGrid;

            let _paramFilter = _layout['parameters'].split(',');
            for (let i in _paramFilter) {
                let key = _paramFilter[i];
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



            this.showLoading = true;

            this.gridFilter.columns.clear();

            this.gridFilter.autoGenerateColumns = false;
            this.bindColumnGroups(this.gridFilter, _layout.gridFilter);

            let _command = _layout['command'];
            let _data = await this._service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, _command, params)
                .toPromise().then();

            this.datafilter = new wjcCore.CollectionView(_data);
            this.gridFilter.itemsSource = new wjcCore.CollectionView(_data);

            this.showLoading = false;

            let x = document.getElementById('gridFilter');
            if (x.style.display == 'none')
                x.style.display = 'block';
        }
        finally {
        }
    }

    convertParameterName(pzName: string) {
        let DbParamPrefixOld: string = '@_';
        let DbParamPrefix: string = '@';

        return pzName.startsWith(DbParamPrefixOld) || pzName.startsWith(DbParamPrefix) ?
            pzName : DbParamPrefixOld + pzName;
    }

    protected deleteSelectedRows(flex: wjcGrid.FlexGrid) {
        if (flex) {
            // get list of selected items
            var selected = [];

            //let _idrowdel = flex.selectedRows[0]._idx;

            for (let k in flex.selectedRows) {
                let _idrowdel = flex.selectedRows[k]._idx;
                for (var i = 0; i < flex.rows.length; i++) {
                    if (i == _idrowdel) {
                        selected.push(flex.rows[i].dataItem);
                        break;
                    }
                }
            }

            for (var i = 0; i < selected.length; i++) {
                //deleteRowFromDatabase(selected[i]);
                flex.itemsSource.remove(selected[i]);
            }
        }
    }

    protected async cellValueChanged(index: string, column: string, e: wjcGrid.FormatItemEventArgs) {
       await this.dfpanel.onCellValueChanged(index, column, e);
    }

    resizeWidthControls() {

        let _elements = this.elRef.nativeElement.querySelectorAll('.form-group-custom');
        let _elementsInput = this.elRef.nativeElement.querySelectorAll('.form-group-custom .wj-control');
        let _elementsButton = this.elRef.nativeElement.querySelectorAll('.form-group-custom button');


        let _j = 0;
        _elementsButton.forEach(item => {

            _elementsButton[_j].style.width = item.offsetWidth - 40 + 'px';

            for (let pn of this._layoutDeclare.panels) {
                for (let ct of pn.controls) {
                    if (ct['key'] == item['id'])
                        _elementsButton[_j].style = ct['style'];
                }

            }

            _j++;

        })

        let _i = 0;
        _elements.forEach(item => {

            // khoa set style panel đầu phiếu
            if (item.children[1])
                if (item.children[1].children[0]) {
                    for (let pn of this._layoutDeclare.panels) {
                        for (let ct of pn.controls)
                            if (item.children[1]['id'] == ct['key'] && ct['style'] != undefined) {
                                item.children[1].children[0]['style'] = ct['style'];
                            }
                    }
                }
        })
    }

    afterViewInit() {
        this.resizeWidthControls();
    }

    bindColumnGroups(flex: wjcGrid.FlexGrid, columnGroups: any): void {

        // create the columns
        flex.allowSorting = false;
        this.createColumnGroups(flex, columnGroups, 0);

        var colHdrs = flex.columnHeaders;
        for (var nRow = 0; nRow < colHdrs.rows.length - 1; nRow++)
            for (var nCol = 0; nCol < colHdrs.columns.length; nCol++) {
                var data = colHdrs.getCellData(nRow, nCol, false);
                if (!data && (nRow - 1) >= 0)
                    colHdrs.setCellData(nRow, nCol, colHdrs.getCellData(nRow - 1, nCol, true));
            }

        let _formatItem = (s, e: wjcGrid.FormatItemEventArgs) => {

            if (e.panel.cellType === wjcGrid.CellType.ColumnHeader) {
                // e.cell.innerHTML = '<div><input type="text" style="width:100%;"></input></br><div>' + e.cell.innerHTML + '</div></div>';

                let column = flex.columns[e.col];
                if (column.dataType == wjcCore.DataType.Boolean) {
                    e.cell.innerHTML = '<div><input type="checkbox">' + e.cell.innerHTML + '</div>';

                    var cnt = 0;
                    for (var i = 0; i < flex.rows.length; i++) {
                        if (s.getCellData(i, e.col) == true) cnt++;
                    }

                    var cb = e.cell.getElementsByTagName('input')[0];

                    cb.checked = cnt > 0;
                    cb.indeterminate = cnt > 0 && cnt < flex.rows.length;

                    // apply checkbox value to cells
                    cb.addEventListener('click', function (e) {
                        flex.beginUpdate();
                        for (var i = 0; i < flex.rows.length; i++) {
                            flex.setCellData(i, column.index, cb.checked);
                        }
                        flex.endUpdate();
                    });

                }
                else {
                    e.cell.innerHTML = '<div>' + e.cell.innerHTML + '</div>';
                }


                wjcCore.setCss(e.cell, {
                    display: 'table',
                    tableLayout: 'fixed',
                    // fontSize: '12px',
                });

                wjcCore.setCss(e.cell.children[0], {
                    display: 'table-cell',
                    verticalAlign: 'middle',
                    textAlign: 'center',
                    // fontSize: '12px',
                });


            }

            let editRange = flex.editRange;
            if (e.panel.cellType === wjcGrid.CellType.Cell && editRange && editRange.row === e.row && editRange.col === e.col) {

                let column = flex.columns[e.col];
                let _col = columnGroups.find(_c => _c['binding'] == column['binding']);
                let expr = _col['exprReadOnly'];

                if (_col['exprReadOnly']) {
                    let ds = flex.itemsSource.sourceCollection[e.row];
                    expr = this.dfpanel.fn_translate_expr_grid(expr, ds)
                    if (eval(expr)) {
                        flex.endUpdate();
                        return;
                    }
                    // else
                    // {
                    //   e.cell.setAttribute("class","none");
                    // }
                }

                this.createEditor(flex, column, columnGroups, e);;

            }

            if (e.panel.cellType === wjcGrid.CellType.Cell) {
                let column = flex.columns[e.col];

                let _col = columnGroups.find(_c => _c['binding'] == column['binding']);
                let exprValidators = _col['validators']
                if (_col['validators']) {
                    let ds = flex.itemsSource.sourceCollection[e.row];
                    exprValidators = this.dfpanel.fn_translate_expr_grid(exprValidators, ds)
                    if (eval(exprValidators)) {
                        e.cell.classList.add('wj-state-invalid');
                    }
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

    async createEditor(flex: wjcGrid.FlexGrid, column: any, columnGroups: any, e: wjcGrid.FormatItemEventArgs) {
        let _lookup;
        let editorRoot = document.createElement('div');
        let input;
        let filelabel;
        let fileinput;
        var _row = e.row;

        let _value = flex.itemsSource.sourceCollection[_row][column['binding']];
        let _col = columnGroups.find(_c => _c['binding'] == column['binding']);

        if (_col.dataType === 'Date') {
            if (column.format.includes('HH:mm:ss')) {
                input = new InputDateTime(editorRoot);
                input.mask = '99/99/9999';
                input.format = column.format;
                input.hostElement.style.width = '100%';
                input.isAnimated = true;
                let d = <InputDateTime>input;

                d.valueChanged.addHandler(() => {
                    if (d.value != undefined && d.value != null) {
                        let date = d.value;
                        let _value = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                        d.value = _value;
                    }
                });

            } else {
                input = new InputDate(editorRoot);
                input.mask = '99/99/9999';
                input.format = column.format;
                input.hostElement.style.width = '100%';
                input.isAnimated = true;
                let d = <InputDateTime>input;

                d.valueChanged.addHandler(() => {
                    if (d.value != undefined && d.value != null) {
                        let date = d.value;
                        let _value = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                        d.value = _value;
                    }
                });
            }
            if (_value != undefined)
                input.value = _value;
        } else if (_col.dataType === 'Number') {
            input = new InputNumber(editorRoot);
            input.format = column.format;
            input.step = columnGroups[column.index].step;
            input.min = columnGroups[column.index].min;
            input.max = columnGroups[column.index].max;
            if (_value != undefined)
                input.value = _value;
        } else if (_col.dataType === 'Array') {

            if (_col['multiSelection'] == true) {
                input = new MultiSelect(editorRoot);
            } else {
                input = new AutoComplete(editorRoot);
            }

            if (input instanceof AutoComplete) {
                _lookup = new LookupBoxInput({
                    key: column.name,
                    lookupKey: _col['lookupKey'],
                    binding: _col['bindingList'],
                    lookupfilter: _col['lookupfilter'],
                    hideValueMember: _col['hideValueMember'],
                    col: 6
                }, this._service, flex.itemsSource.sourceCollection[_row]);

                input.itemsSource = _lookup.options;
                input.displayMemberPath = 'DisplayMember';
                input.selectedValuePath = 'ValueMember';
                input.isContentHtml = true;
                input.isRequired = false;
                input.autoExpandSelection = true;
                input.hostElement.style.width = '100%';
                input.isAnimated = true;
                input.listBox.formatItem.addHandler((s, e: any) => {

                    if (e.data) {
                        e.item.innerHTML = '<strong>' + e.data.ValueMember + '</strong>' + ': ' + e.data.DisplayMember;
                    } else {
                        e.item.innerHTML = '';

                    }
                });
                input.isDroppedDownChanging.addHandler(async () => {
                    let _valueFirst = '';
                    try {
                        if (input.itemsSource.items[0])
                            _valueFirst = input.itemsSource.items[0]['ValueMember'];
                    }
                    finally { }

                    let tmp = input.text || '';
                    if (input.itemsSource.items.length <= 1 && !_valueFirst && tmp == _valueFirst) {
                        // this.input.lookupfilterCurrent = this.translate_expr(this.input.lookupfilter);

                        _lookup.lookupfilterCurrent = Global.translateAutoText(_lookup.lookupfilter, flex.itemsSource.sourceCollection[_row]);
                        await _lookup.getLookupData('').then();
                        if (input.itemsSource.items.length != _lookup.options.items.length)
                            input.itemsSource = _lookup.options;
                    }
                    else if (input.itemsSource.items.length == 1 && _valueFirst && input.text.indexOf(_valueFirst) == 0) {
                        // this.input.lookupfilterCurrent = this.translate_expr(this.input.lookupfilter);
                        _lookup.lookupfilterCurrent = Global.translateAutoText(_lookup.lookupfilter, flex.itemsSource.sourceCollection[_row]);
                        await _lookup.getLookupData('#' + _valueFirst, true).then();
                    }
                });
                input.itemsSourceFunction = async (query, max, callback) => {
                    if (input.text) {
                        // this.input.lookupfilterCurrent = this.translate_expr(this.input.lookupfilter);
                        _lookup.lookupfilterCurrent = Global.translateAutoText(_lookup.lookupfilter, flex.itemsSource.sourceCollection[_row]);
                        await _lookup.getLookupData(input.text, false, callback).then();
                    }
                }

                if (_value) {
                    _lookup.lookupfilterCurrent = Global.translateAutoText(_lookup.lookupfilter, flex.itemsSource.sourceCollection[_row]);
                    //Xử lý đặc biệt wizard (Khoa fix 0307: chọn 1 lần, chọn lại lên nhiều row)
                    //   await _lookup.getLookupData('#' + _value, true).then();
                    await _lookup.getLookupData('').then();
                }
            } else if (input instanceof MultiSelect) {
                _lookup = new MultiSelectInput({
                    key: column.name,
                    lookupKey: _col['lookupKey'],
                    binding: _col['bindingList'],
                    lookupfilter: _col['lookupfilter'],
                    hideValueMember: true,
                    col: 6
                }, this._service);
                input.itemsSource = _lookup.options;
                input.displayMemberPath = 'DisplayMember';
                input.selectedValuePath = 'ValueMember';
                input.checkedMemberPath = 'State';
                input.maxHeaderItems = 10;
                input.isContentHtml = true;
                input.isRequired = false;
                input.autoExpandSelection = true;
                input.hostElement.style.width = '100%';
                input.isAnimated = true;
                input.inputElement.id = "alterInput" + _lookup.key;
                input.inputElement.outerHTML += '<input wj-part="input" type="text" class="wj-form-control" style="display:none;" readonly="">';

                input.gotFocus.addHandler(() => {
                    input.removeEventListener(input.hostElement, 'keypress');
                    input.removeEventListener(input.hostElement, 'keydown');
                    input.removeEventListener(input.inputElement, 'click');

                    let alterInput = <HTMLInputElement>document.getElementById("alterInput" + _lookup.key);
                    input.listBox.gotFocus.addHandler(() => {
                        alterInput.focus();
                    });
                    var tid;

                    alterInput.addEventListener('keyup', () => {
                        if (input.isDroppedDown == false)
                            input.isDroppedDown = true;
                        let arr = [];
                        for (let i = 0; i < input.checkedItems.length; i++) {
                            arr.push(input.checkedItems[i]['ValueMember']);
                        }
                        if (tid != undefined) {
                            clearTimeout(tid);
                        }
                        tid = setTimeout(() => {
                            _lookup.getLookupData('^' + arr.join(',') + '?' + alterInput.value, true).then(() => {
                            });
                        }, 500);

                    });
                    alterInput.removeAttribute("readonly");
                    alterInput.select();
                })

                input.listBox.gotFocus.addHandler(() => {
                    let alterInput = <HTMLInputElement>document.getElementById("alterInput" + _lookup.key);
                    alterInput.focus();
                })

                input.listBox.formatItem.addHandler((s, e: any) => {
                    // console.log(e.item.innerHTML);
                    if (e.data) {
                        let display = '<strong>' + e.data.ValueMember + '</strong>' + ': ' + e.data.DisplayMember;
                        let checked = e.data.State ? ' checked ' : ' ';
                        let html = '<label><input type="checkbox"' + checked + '> ' + display + ' </label>';
                        e.item.innerHTML = html;
                    }
                });

                if (!_value) _value = '';
                _lookup.lookupfilterCurrent = Global.translateAutoText(_lookup.lookupfilter, flex.itemsSource.sourceCollection[e.row]);
                await _lookup.getLookupData('^' + _value, true).then(
                    () => { }
                );
            }

        } else if (_col.dataType === 'Object') {
            let _col = columnGroups.find(_c => _c['binding'] == column['binding']);

            input = document.createElement('div');

            if (input instanceof HTMLElement) {
                input.className = 'wj-input';
                if (!_value) _value = 'Nhấn để chọn file'
                input.innerHTML = `<div class="wj-input-group " >
             <span wj-part="btn-dec" class="wj-input-group-btn" tabindex="-1" >
             <button class="wj-btn wj-btn-default" type="button" tabindex="-1"><i class="fa fa-times" aria-hidden="true"></i><\/button><\/span>
             <label class="wj-form-control btn">
             <input type="file" id="inputChildFile" wj-part="input" class="wj-form-control btn" style="width:0;opacity: 0;" />
             <i class="fa fa-upload" aria-hidden="true"></i> `+ _value + `</label>
             <span wj-part="btn-inc" class="wj-input-group-btn" tabindex="-1" >
             <button class="wj-btn wj-btn-default" type="button" tabindex="-1"><i class="fa fa-download" aria-hidden="true"></i><\/button><\/span><\/div>`;

                filelabel = input.getElementsByTagName('label').item(0);
                fileinput = input.getElementsByTagName('input').item(0);
                fileinput.addEventListener('change', (e) => {
                    filelabel.textContent = fileinput.files[0].name;
                });

                let filebtn1 = input.getElementsByTagName('button').item(0);
                filebtn1.addEventListener('click', (e) => {
                    filelabel.textContent = 'Nhấn để chọn file';
                    flex.endUpdate();
                });

                let filebtn2 = input.getElementsByTagName('button').item(1);
                filebtn2.addEventListener('click', (e) => {
                    let _file: string = filelabel.textContent != 'Nhấn để chọn file' ? filelabel.textContent.trim() : '';
                    let _folderName = this.editorFrm.controls['ProductCostId'].value.toString() + '\\' + this.folderName;
                    if (_folderName && this.id > 0 && _file) {
                        let child_FolderId: string;
                        if (!_col['folderId'] && _col['folderId'] == null) {
                            child_FolderId = this.id.toString();
                        } else {
                            child_FolderId = this.translate_expr(_col['folderId']);
                        }
                        const sub = this._service.dowload(_folderName, child_FolderId, _file).subscribe(blob => {
                            if (_file.toUpperCase().endsWith('PDF') == false)
                                importedSaveAs(blob, _file);
                            else {
                                let url = window.URL.createObjectURL(blob);
                                window.open(url);
                            }
                        });
                        this.subscription.add(sub);
                    }
                    flex.endUpdate();
                    return;
                });
            }
            editorRoot = input;

        } else return;

        e.cell.appendChild(editorRoot);
        editorRoot.focus();
        input.focus();
        if (fileinput) {
            filelabel.focus();
        }

        if (e.cell.firstChild) {
            e.cell.firstElementChild.setAttribute('style', 'display:none');
        }
        // cellEditEnding that updates cell with user's input
        let editEndingEH = (s, args) => {
            flex.cellEditEnding.removeHandler(editEndingEH);
            if (!args.cancel) {
                args.cancel = true;
                let _c = flex.columns[args.col];
                let _col = columnGroups.find(c => c['binding'] == _c['binding']);

                if (_col.dataType == 'Array') {
                    let arr = [];
                    if (input instanceof MultiSelect) {
                        let arr = [];
                        for (let i = 0; i < input.checkedItems.length; i++) {
                            arr.push(input.checkedItems[i]['ValueMember']);
                        }
                        flex.itemsSource.sourceCollection[args.row][column['binding']] = arr.join(',');
                        let alterInput = <HTMLInputElement>document.getElementById("alterInput" + _lookup.key);
                        alterInput.setAttribute("readonly", "");
                        for (const source in _lookup.binding) {
                            let arrBind = [];
                            for (let i = 0; i < input.checkedItems.length; i++) {
                                arrBind.push(input.checkedItems[i][source]);
                            }
                            let des = _lookup.binding[source];
                            flex.itemsSource.sourceCollection[args.row][des] = arrBind.join(',');
                        }
                    }
                    else { //Dương fix ngày 13.04
                        if (input.text)
                            _value = input.selectedValue;
                        else
                            _value = '';

                        if (_value != undefined) {
                            flex.itemsSource.sourceCollection[args.row][column['binding']] = _value;
                            for (const source in _lookup.binding) {
                                let des = _lookup.binding[source];
                                if (_value != '')
                                    flex.itemsSource.sourceCollection[args.row][des] = input.itemsSource.items[input.itemsSource._idx][source];
                                else
                                    flex.itemsSource.sourceCollection[args.row][des] = '';
                            }
                        }
                    }
                    flex.itemsSource.refresh();
                } else if (_col.dataType == 'Object') {
                    let name = '';
                    if (!filelabel.textContent.includes('Nhấn để chọn file')) {
                        name = filelabel.textContent.trim();
                    }
                    if (name) {
                        flex.setCellData(args.row, args.col, name);
                        flex.itemsSource.sourceCollection[args.row]['Data'] = fileinput.files[0];
                    }
                    else {
                        flex.setCellData(args.row, args.col, '');
                    }
                } else if (input.value != undefined)
                    flex.setCellData(args.row, args.col, input.value);
                // this.filesUpload.i
            }
        };
        flex.cellEditEnding.removeHandler(editEndingEH);

        // subscribe the handler to the cellEditEnding event
        flex.cellEditEnding.addHandler(editEndingEH);

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
                col.dataType = DataType.String;
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


    protected _controlCollection: InputBase<any>[] = [];
    public get controlCollection(): InputBase<any>[] {
        this.panel.controls.forEach(lk => {
            this._controlCollection.push(lk);
        });

        return this._controlCollection;
    }


    private translate_expr(expr) {
        if (!expr) { return expr; }
        let _result = expr;
        let controls: string[] = [];
        for (const control in this.editorFrm.controls) {
            controls.push(control);
        }
        controls.sort((a, b) => b.length - a.length);

        for (const control of controls) {
            let patern = '{EXPR=' + control + '}';

            if (_result.indexOf(patern) > -1) {
                let value
                if (this.editorFrm.contains(control))
                    value = this.editorFrm[control].value;

                do {
                    _result = _result.replace(patern, value);
                }
                while (_result.indexOf(patern) > -1)
            }
        }
        return _result;
    }

    realXML(xml: string, _listCol: string, grid: wjcGrid.FlexGrid) {
        let layoutWeb = [];

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
                colList.push(tempData['Column_' + colArr[i]][0]);
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
                    if (colList[col]['Aggregate'] != undefined)
                        _aggregate = colList[col]['Aggregate'][0];

                    if (colList[col]['DataTypeWeb'] != undefined)
                        _dataType = colList[col]['DataTypeWeb'][0];

                    colOutput.push({
                        'header': colList[col]['Name'][0], 'binding': colList[col]['Name'][0], 'aggregate': _aggregate, 'align': 'right', 'dataType':_dataType
                    });
                }
            }

        });
        grid.columns.clear();
        for (let _c in colOutput) {
            this._layoutDeclare[0]['nextEdit']['data'][gridName].push(colOutput[_c]);
        }

        this.createColumnGroups(grid, this._layoutDeclare[0]['nextEdit']['data'][gridName], 0);
    }

    async postXML(formData: FormGroup) {

        this.tab0Click = true;
        let params = new Array<ParameterContract>();
        let flagParam = false;

        let constraintKey = this._layoutDeclare[0]['nextEdit']['constraintkey'].split(',');

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

            let paramXML = new ParameterContract();
            paramXML.ParameterName = this.convertParameterName(this._layoutDeclare[0]['nextEdit']['tablename']);
            paramXML.ParameterValue = this._layoutDeclare[0]['nextEdit']['tablename'];

            params.push(paramXML);

            let ds = Global.getDataSetContract (
                {
                    name: this._layoutDeclare[0]['nextEdit']['tablename'],
                    collection: this.gridArray[this._layoutDeclare[0]['nextEdit']['griddata']].itemsSource.items //this.grid1.itemsSource.items
                }
            )
            this.showLoading = true;

            if (this.tab1Click == false) {
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor != undefined) {
                    this.gridEditor.columns.clear();

                    this.gridEditor.autoGenerateColumns = false;
                    this.bindColumnGroups(this.gridEditor, this._layoutDeclare[0]['nextEdit']['data'].gridEditor);
                }
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor1 != undefined) {
                    this.gridEditor1.columns.clear();

                    this.gridEditor1.autoGenerateColumns = false;
                    this.bindColumnGroups(this.gridEditor1, this._layoutDeclare[0]['nextEdit']['data'].gridEditor1);
                }
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor2 != undefined) {
                    this.gridEditor2.columns.clear();

                    this.gridEditor2.autoGenerateColumns = false;
                    this.bindColumnGroups(this.gridEditor2, this._layoutDeclare[0]['nextEdit']['data'].gridEditor2);
                }
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor3 != undefined) {
                    this.gridEditor3.columns.clear();

                    this.gridEditor3.autoGenerateColumns = false;
                    this.bindColumnGroups(this.gridEditor3, this._layoutDeclare[0]['nextEdit']['data'].gridEditor3);
                }
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor4 != undefined) {
                    this.gridEditor4.columns.clear();

                    this.gridEditor4.autoGenerateColumns = false;
                    this.bindColumnGroups(this.gridEditor4, this._layoutDeclare[0]['nextEdit']['data'].gridEditor4);
                }
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor5 != undefined) {
                    this.gridEditor5.columns.clear();

                    this.gridEditor5.autoGenerateColumns = false;
                    this.bindColumnGroups(this.gridEditor5, this._layoutDeclare[0]['nextEdit']['data'].gridEditor5);
                }
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor6 != undefined) {
                    this.gridEditor6.columns.clear();

                    this.gridEditor6.autoGenerateColumns = false;
                    this.bindColumnGroups(this.gridEditor6, this._layoutDeclare[0]['nextEdit']['data'].gridEditor6);
                }
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor7 != undefined) {
                    this.gridEditor7.columns.clear();

                    this.gridEditor7.autoGenerateColumns = false;
                    this.bindColumnGroups(this.gridEditor7, this._layoutDeclare[0]['nextEdit']['data'].gridEditor7);
                }
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor8 != undefined) {
                    this.gridEditor8.columns.clear();

                    this.gridEditor8.autoGenerateColumns = false;
                    this.bindColumnGroups(this.gridEditor8, this._layoutDeclare[0]['nextEdit']['data'].gridEditor8);
                }
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor9 != undefined) {
                    this.gridEditor9.columns.clear();

                    this.gridEditor9.autoGenerateColumns = false;
                    this.bindColumnGroups(this.gridEditor9, this._layoutDeclare[0]['nextEdit']['data'].gridEditor9);
                }
                let output_xml: string;
                let output_col: string;
                let output_xml2: string;
                let output_col2: string;
                let output_xml3: string;
                let output_col3: string;
                let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, this._layoutDeclare[0]['nextEdit']['command'], params, ds)
                    .toPromise().then();

                this.dataEditor = new wjcCore.CollectionView(_data['data'][0]);
                this.dataEditor1 = new wjcCore.CollectionView(_data['data'][1]);
                this.dataEditor2 = new wjcCore.CollectionView(_data['data'][2]);
                this.dataEditor3 = new wjcCore.CollectionView(_data['data'][3]);
                this.dataEditor4 = new wjcCore.CollectionView(_data['data'][4]);
                this.dataEditor5 = new wjcCore.CollectionView(_data['data'][5]);
                this.dataEditor6 = new wjcCore.CollectionView(_data['data'][6]);
                this.dataEditor7 = new wjcCore.CollectionView(_data['data'][7]);
                this.dataEditor8 = new wjcCore.CollectionView(_data['data'][8]);
                this.dataEditor9 = new wjcCore.CollectionView(_data['data'][9]);
                this.output = <Array<Object>>(_data['output']);


                output_xml = this.output['@_LAYOUT_XML'];
                output_col = this.output['@_COLUMN_OUPUT'];
                output_xml2 = this.output['@_LAYOUT_XML2'];
                output_col2 = this.output['@_COLUMN_OUPUT2'];
                output_xml3 = this.output['@_LAYOUT_XML3'];
                output_col3 = this.output['@_COLUMN_OUPUT3'];

                this.realXML(output_xml, output_col, this.gridEditor);
                this.realXML(output_xml2, output_col2, this.gridEditor3);
                this.realXML(output_xml3, output_col3, this.gridEditor5);
            }

            this.createAggregateGrid(this.gridEditor5);
            
            //console.log(_data);
            //this.data2 = new wjcCore.CollectionView(_data);

            this.showLoading = false;

            this.onTabClick(1);
            this.nextStep('step1', 'tabstep1', 'step2', 'tabstep2');

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

    nextStep(stepname1: string, tabstepname1: string, stepname2: string, tabstepname2: string) {
        document.getElementById(stepname1).classList.remove('active');
        document.getElementById(tabstepname1).classList.remove('active');
        document.getElementById(tabstepname1).classList.add('disabled');
        document.getElementById(stepname2).classList.add('active');
        document.getElementById(tabstepname2).classList.remove('disabled');
        document.getElementById(tabstepname2).classList.add('active');
    }

    previousStep(stepname1: string, tabstepname1: string, stepname2: string, tabstepname2: string) {
        document.getElementById(stepname2).classList.remove('active');
        document.getElementById(tabstepname2).classList.remove('active');
        document.getElementById(tabstepname2).classList.add('disabled');
        document.getElementById(stepname1).classList.add('active');
        document.getElementById(tabstepname1).classList.remove('disabled');
        document.getElementById(tabstepname1).classList.add('active');
    }


    onTabClick(tabIndex: number) {
        // // if(gridtmp.columns.length<2)

        switch (tabIndex) {
            case 0:
                this.gridFilter.columns.clear();
                this.createColumnGroups(this.gridFilter, this._layoutDeclare[0].filterGrid.gridFilter, 0);
                break;
            case 1:
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor != undefined) {
                    this.gridEditor.columns.clear();
                    this.createColumnGroups(this.gridEditor, this._layoutDeclare[0]['nextEdit']['data'].gridEditor, 0);
                }
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor1 != undefined) {
                    this.gridEditor1.columns.clear();
                    this.createColumnGroups(this.gridEditor1, this._layoutDeclare[0]['nextEdit']['data'].gridEditor1, 0);
                }
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor2 != undefined) {
                    this.gridEditor2.columns.clear();
                    this.createColumnGroups(this.gridEditor2, this._layoutDeclare[0]['nextEdit']['data'].gridEditor2, 0);
                }
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor3 != undefined) {
                    this.gridEditor3.columns.clear();
                    this.createColumnGroups(this.gridEditor3, this._layoutDeclare[0]['nextEdit']['data'].gridEditor3, 0);
                }
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor4 != undefined) {
                    this.gridEditor4.columns.clear();
                    this.createColumnGroups(this.gridEditor4, this._layoutDeclare[0]['nextEdit']['data'].gridEditor4, 0);
                }
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor5 != undefined) {
                    this.gridEditor5.columns.clear();
                    this.createColumnGroups(this.gridEditor5, this._layoutDeclare[0]['nextEdit']['data'].gridEditor5, 0);
                }
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor6 != undefined) {
                    this.gridEditor6.columns.clear();
                    this.createColumnGroups(this.gridEditor6, this._layoutDeclare[0]['nextEdit']['data'].gridEditor6, 0);
                }
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor7 != undefined) {
                    this.gridEditor7.columns.clear();
                    this.createColumnGroups(this.gridEditor7, this._layoutDeclare[0]['nextEdit']['data'].gridEditor7, 0);
                }
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor8 != undefined) {
                    this.gridEditor8.columns.clear();
                    this.createColumnGroups(this.gridEditor8, this._layoutDeclare[0]['nextEdit']['data'].gridEditor8, 0);
                }
                if (this._layoutDeclare[0]['nextEdit']['data'].gridEditor9 != undefined) {
                    this.gridEditor9.columns.clear();
                    this.createColumnGroups(this.gridEditor9, this._layoutDeclare[0]['nextEdit']['data'].gridEditor9, 0);
                }
                break;
            case 2:
                if (this._layoutDeclare[0]['nextAdjust']['data'].gridAdjust != undefined) {
                    this.gridAdjust.columns.clear();
                    this.createColumnGroups(this.gridAdjust, this._layoutDeclare[0]['nextAdjust']['data'].gridAdjust, 0);
                }
                if (this._layoutDeclare[0]['nextAdjust']['data'].gridEffective != undefined) {
                    this.gridEffective.columns.clear();
                    this.createColumnGroups(this.gridEffective, this._layoutDeclare[0]['nextAdjust']['data'].gridEffective, 0);
                }
                break;
            case 3:
                if (this._layoutDeclare[0]['nextResult']['data'].gridReport != undefined) {
                    this.gridReport.columns.clear();
                    this.createColumnGroups(this.gridReport, this._layoutDeclare[0]['nextResult']['data'].gridReport, 0);
                }
                break;
        }

    }

    
    async postXMLAdjust(formData: FormGroup) {
        

        this.tab1Click = true;
        let params = new Array<ParameterContract>();
        let flagParam = false;

        let constraintKey = this._layoutDeclare[0]['nextAdjust']['constraintkey'].split(',');

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

            let paramXML = new ParameterContract();
            paramXML.ParameterName = this.convertParameterName(this._layoutDeclare[0]['nextAdjust']['tablename']);
            paramXML.ParameterValue = this._layoutDeclare[0]['nextAdjust']['tablename'];

            let paramXML2 = new ParameterContract();
            paramXML2.ParameterName = this.convertParameterName(this._layoutDeclare[0]['nextAdjust']['tablename2']);
            paramXML2.ParameterValue = this._layoutDeclare[0]['nextAdjust']['tablename2'];

            let paramXML3 = new ParameterContract();
            paramXML3.ParameterName = this.convertParameterName(this._layoutDeclare[0]['nextAdjust']['tablename3']);
            paramXML3.ParameterValue = this._layoutDeclare[0]['nextAdjust']['tablename3'];

            let paramXML4 = new ParameterContract();
            paramXML4.ParameterName = this.convertParameterName(this._layoutDeclare[0]['nextAdjust']['tablename4']);
            paramXML4.ParameterValue = this._layoutDeclare[0]['nextAdjust']['tablename4'];

            let paramXML5 = new ParameterContract();
            paramXML5.ParameterName = this.convertParameterName(this._layoutDeclare[0]['nextAdjust']['tablename5']);
            paramXML5.ParameterValue = this._layoutDeclare[0]['nextAdjust']['tablename5'];

            params.push(paramXML);
            params.push(paramXML2);
            params.push(paramXML3);
            params.push(paramXML4);
            params.push(paramXML5);

            let ds = Global.getDataSetContract(
                {
                    name: this._layoutDeclare[0]['nextAdjust']['tablename'],
                    collection: this.gridArray[this._layoutDeclare[0]['nextAdjust']['griddata']].itemsSource.items //this.grid1.itemsSource.items
                },
                {
                    name: this._layoutDeclare[0]['nextAdjust']['tablename2'],
                    collection: this.gridArray[this._layoutDeclare[0]['nextAdjust']['griddata2']].itemsSource.items //this.grid1.itemsSource.items
                },
                {
                    name: this._layoutDeclare[0]['nextAdjust']['tablename3'],
                    collection: this.gridArray[this._layoutDeclare[0]['nextAdjust']['griddata3']].itemsSource.items //this.grid1.itemsSource.items
                },
                {
                    name: this._layoutDeclare[0]['nextAdjust']['tablename4'],
                    collection: this.gridArray[this._layoutDeclare[0]['nextAdjust']['griddata4']].itemsSource.items //this.grid1.itemsSource.items
                },
                {
                    name: this._layoutDeclare[0]['nextAdjust']['tablename5'],
                    collection: this.gridArray[this._layoutDeclare[0]['nextAdjust']['griddata5']].itemsSource.items //this.grid1.itemsSource.items
                }
            )

            this.showLoading = true;
            if (this.tab2Click == false) {
                if (this._layoutDeclare[0]['nextAdjust']['data'].gridAdjust != undefined) {
                    this.gridAdjust.columns.clear();

                    this.gridAdjust.autoGenerateColumns = false;
                    this.bindColumnGroups(this.gridAdjust, this._layoutDeclare[0]['nextAdjust']['data'].gridAdjust);
                }

                if (this._layoutDeclare[0]['nextAdjust']['data'].gridEffective != undefined) {
                    this.gridEffective.columns.clear();

                    this.gridEffective.autoGenerateColumns = false;
                    this.bindColumnGroups(this.gridEffective, this._layoutDeclare[0]['nextAdjust']['data'].gridEffective);
                }

                let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, this._layoutDeclare[0]['nextAdjust']['command'], params, ds)
                    .toPromise().then();

                this.dataAdjust = new wjcCore.CollectionView(_data['data'][0]);
                this.gridAdjust.itemsSource = new wjcCore.CollectionView(_data['data'][0]);

                this.dataEffective = new wjcCore.CollectionView(_data['data'][1]);
                //this.gridEffective.itemsSource = new wjcCore.CollectionView(_data['data'][1]);
            }

            //this.grouAggregateGrid('CustomerName', this.dataAdjust); //CustomerCode: theo cột cần Group.
            
            this.showLoading = false;

            this.nextStep('step2', 'tabstep2', 'step3', 'tabstep3');
            this.onTabClick(2);

        }
        finally {

        }


    }
    collapseAllGrid(level: number){
        for(let i in this.gridArray){
            this.gridArray[i].collapseGroupsToLevel(level);
        }
    }
    
    async SaveHtml(formData:any){       
       
        const params = new Array<ParameterContract>();
        let constraintKey = ['BizDocId'];

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

            let html = await document.getElementById("step2").innerHTML;

            const param2 = new ParameterContract();
            param2.ParameterName = Global.convertParameterName('Data');
            param2.ParameterValue = html
            params.push(param2);

            this.showLoading = true;

            let _data = await this._service.postData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_TMCtc_SaveHtmlCalPrice', params)
            .toPromise().then(()=>{
                this.postXMLAdjust(formData);
            });

            this.showLoading = false;
        }
        finally {

        }
      
    }
    async postXMLResult(formData: FormGroup) {
        this.tab2Click = true;
        this.showDialog = true;

        let params = new Array<ParameterContract>();
        let flagParam = false;

        let constraintKey = this._layoutDeclare[0]['nextResult']['constraintkey'].split(',');

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

            let paramXML = new ParameterContract();
            paramXML.ParameterName = this.convertParameterName(this._layoutDeclare[0]['nextResult']['tablename']);
            paramXML.ParameterValue = this._layoutDeclare[0]['nextResult']['tablename'];
            params.push(paramXML);

            let paramXML2 = new ParameterContract();
            paramXML2.ParameterName = this.convertParameterName(this._layoutDeclare[0]['nextResult']['tablename2']);
            paramXML2.ParameterValue = this._layoutDeclare[0]['nextResult']['tablename2'];
            params.push(paramXML2);

            let paramXML3 = new ParameterContract();
            paramXML3.ParameterName = this.convertParameterName(this._layoutDeclare[0]['nextResult']['tablename3']);
            paramXML3.ParameterValue = this._layoutDeclare[0]['nextResult']['tablename3'];
            params.push(paramXML3);

            let paramXML4 = new ParameterContract();
            paramXML4.ParameterName = this.convertParameterName(this._layoutDeclare[0]['nextResult']['tablename4']);
            paramXML4.ParameterValue = this._layoutDeclare[0]['nextResult']['tablename4'];
            params.push(paramXML4);

            let paramXML5 = new ParameterContract();
            paramXML5.ParameterName = this.convertParameterName(this._layoutDeclare[0]['nextResult']['tablename5']);
            paramXML5.ParameterValue = this._layoutDeclare[0]['nextResult']['tablename5'];
            params.push(paramXML5);

            let paramXML6 = new ParameterContract();
            paramXML6.ParameterName = this.convertParameterName(this._layoutDeclare[0]['nextResult']['tablename6']);
            paramXML6.ParameterValue = this._layoutDeclare[0]['nextResult']['tablename6'];
            params.push(paramXML6);

            let paramXML7 = new ParameterContract();
            paramXML7.ParameterName = this.convertParameterName(this._layoutDeclare[0]['nextResult']['tablename7']);
            paramXML7.ParameterValue = this._layoutDeclare[0]['nextResult']['tablename7'];
            params.push(paramXML7);

            let paramXML8 = new ParameterContract();
            paramXML8.ParameterName = this.convertParameterName(this._layoutDeclare[0]['nextResult']['tablename8']);
            paramXML8.ParameterValue = this._layoutDeclare[0]['nextResult']['tablename8'];
            params.push(paramXML8);

            let ds = Global.getDataSetContract(
                {
                    name: this._layoutDeclare[0]['nextResult']['tablename'],
                    collection: this.gridArray[this._layoutDeclare[0]['nextResult']['griddata']].itemsSource.items //this.grid1.itemsSource.items
                },
                {
                    name: this._layoutDeclare[0]['nextResult']['tablename2'],
                    collection: this.gridArray[this._layoutDeclare[0]['nextResult']['griddata2']].itemsSource.items //this.grid1.itemsSource.items
                },
                {
                    name: this._layoutDeclare[0]['nextResult']['tablename3'],
                    collection: this.gridArray[this._layoutDeclare[0]['nextResult']['griddata3']].itemsSource.items //this.grid1.itemsSource.items
                },
                {
                    name: this._layoutDeclare[0]['nextResult']['tablename4'],
                    collection: this.gridArray[this._layoutDeclare[0]['nextResult']['griddata4']].itemsSource.items //this.grid1.itemsSource.items
                },
                {
                    name: this._layoutDeclare[0]['nextResult']['tablename5'],
                    collection: this.gridArray[this._layoutDeclare[0]['nextResult']['griddata5']].itemsSource.items //this.grid1.itemsSource.items
                },
                {
                    name: this._layoutDeclare[0]['nextResult']['tablename6'],
                    collection: this.gridArray[this._layoutDeclare[0]['nextResult']['griddata6']].itemsSource.items //this.grid1.itemsSource.items
                },
                {
                    name: this._layoutDeclare[0]['nextResult']['tablename7'],
                    collection: this.gridArray[this._layoutDeclare[0]['nextResult']['griddata7']].itemsSource.items //this.grid1.itemsSource.items
                },
                {
                    name: this._layoutDeclare[0]['nextResult']['tablename8'],
                    collection: this.gridArray[this._layoutDeclare[0]['nextResult']['griddata8']].itemsSource.items //this.grid1.itemsSource.items
                }
            )

            this.showLoading = true;
            if (this.tab3Click == false) {
                if (this._layoutDeclare[0]['nextResult']['data'].gridReport != undefined) {
                    this.gridReport.columns.clear();

                    this.gridReport.autoGenerateColumns = false;
                    this.bindColumnGroups(this.gridReport, this._layoutDeclare[0]['nextResult']['data'].gridReport);
                }

                let output_xml: string;
                let output_col: string;

                let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, this._layoutDeclare[0]['nextResult']['command'], params, ds)
                    .toPromise().then();

                this.dataReport = new wjcCore.CollectionView(_data['data'][0]);
                this.output = <Array<Object>>(_data['output']);

                output_xml = this.output['@_LAYOUT_XML'];
                output_col = this.output['@_COLUMN_OUPUT'];


                if (output_col != undefined && output_xml != undefined)
                    this.realXML(output_xml, output_col, this.gridReport);
            }

            this.grouAggregateGrid('DocNo', this.dataReport);

            this.showLoading = false;

            this.nextStep('step3', 'tabstep3', 'step4', 'tabstep4');
            this.onTabClick(3);
        }
        finally {
            this.showDialog = false;
        }


    }  

    _applyGroup(_grid: wjcGrid.FlexGrid, colGroup: string, isCheckBoxGroup?: boolean) {
        if (_grid.collectionView) {
            var cv = _grid.collectionView;
            // for(let i in cv.items)
            // {
            //     if (cv.items[i]['ItemCode'] == 'Tổng tiền')
            //     {
            //         cv.items.splice(Number(i),1);
            //     }
            // }
            if (cv != null) {
                cv.beginUpdate();
                cv.groupDescriptions.clear();

                if (colGroup.indexOf(',') > -1) {
                    var groupNames = colGroup.split(',');
                    for (var i = 0; i < groupNames.length; i++) {
                        var groupName = groupNames[i];
                        var groupDesc = new wjcCore.PropertyGroupDescription(groupName);
                        cv.groupDescriptions.push(groupDesc);
                    }
                    cv.refresh();
                }
                else {
                    var groupDesc = new wjcCore.PropertyGroupDescription(colGroup);
                    cv.groupDescriptions.push(groupDesc);
                    cv.refresh();
                }
                
                cv.endUpdate();
            }

            _grid.collapseGroupsToLevel(0);
            
            if (isCheckBoxGroup)
            _grid.groupHeaderFormat = '<input type="checkbox" class="custom-check-box"><b>{value}</b> ({count:n0} mục)';
            else
            _grid.groupHeaderFormat = '<b>{value}</b> ({count:n0} mục)';
        }
    }

    _applyGroup_Chuoi(_grid: wjcGrid.FlexGrid, colGroup: string, isCheckBoxGroup?: boolean) {
        if (_grid.collectionView) {
            var cv = _grid.collectionView;
            // for(let i in cv.items)
            // {
            //     if (cv.items[i]['ItemCode'] == 'Tổng tiền')
            //     {
            //         cv.items.splice(Number(i),1);
            //     }
            // }
            if (cv != null) {
                cv.beginUpdate();
                cv.groupDescriptions.clear();

                if (colGroup.indexOf(',') > -1) {
                    var groupNames = colGroup.split(',');
                    for (var i = 0; i < groupNames.length; i++) {
                        var groupName = groupNames[i];
                        var groupDesc = new wjcCore.PropertyGroupDescription(groupName);
                        cv.groupDescriptions.push(groupDesc);
                    }
                    cv.refresh();
                }
                else {
                    var groupDesc = new wjcCore.PropertyGroupDescription(colGroup);
                    cv.groupDescriptions.push(groupDesc);
                    cv.refresh();
                }
                
                cv.endUpdate();
            }

            _grid.collapseGroupsToLevel(0);
            
            if (isCheckBoxGroup)
            _grid.groupHeaderFormat = '<input type="checkbox" class="custom-check-box"><b>{value}</b>';
            else
            _grid.groupHeaderFormat = '<b>{value}</b>';
        }
    }
    async splitButtonItemClicked(s: wjcInput.WjMenu, e: wjcCore.EventArgs, grid: wjcGrid.FlexGrid) {
        var menu = s;

        const params = new Array<ParameterContract>();
        const param = new ParameterContract();
        const param1 = new ParameterContract();
        const param2 = new ParameterContract();
        const param3 = new ParameterContract();

        param.ParameterName = Global.convertParameterName('ItemCode ');
        param.ParameterValue = grid.selectedItems[0]['ItemCode'];
        params.push(param);

        param1.ParameterName = Global.convertParameterName('TradeMarkCode');
        param1.ParameterValue = grid.selectedItems[0]['TradeMarkCode'];
        params.push(param1);

        param2.ParameterName = Global.convertParameterName('BranchCode');
        param2.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
        params.push(param2);

        param3.ParameterName = Global.convertParameterName('Quantity');
        param3.ParameterValue = Number(grid.selectedItems[0]['Quantity9']);
        params.push(param3);

        if (menu.isDroppedDown) {
            // the click was on a menu item
            //alert('option **' + menu.selectedItem.value + '** is now the default');
            //this.editExplorer(this.grid,this.pathPage);


            if (menu.selectedItem.value == 'NumberUp') {
                let _data = await this._service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_TMCtc_GetNumberUpDown', params).toPromise().then();

                let dataStore;
                dataStore = new Array(_data);

                let _numUp = dataStore[0][0]['NumberUp'];

                if (_numUp) {
                    let index = 0;
                    for (index = 0; index < grid.columns.length; index++) {
                        if (grid.columns[index].binding == 'Quantity9') {
                            break;
                        }
                    }

                    if (wjcCore.isNumber(_numUp))
                        _numUp = this.dfpanel.replaceDecimal(_numUp);

                    grid.setCellData(grid.selectedRows[0].index, index, _numUp);

                    for (let obj of this._columnChangeChild) {
                        if (obj['Tables'] == 9) {
                            for (const col in obj.columnChanged) {
                                if (col == 'Quantity9') {
                                    const evals = obj.columnChanged[col]['Evaluators'];
                                    for (const eva in evals) {
                                        await  this.dfpanel.runEvaluatorChild(evals[eva], grid.selectedRows[0].index)
                                    }
                                }
                            }
                        }
                    }
                }

            }
            if (menu.selectedItem.value == 'NumberDown') {
                let _data = await this._service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_TMCtc_GetNumberUpDown', params).toPromise().then();

                let dataStore;
                dataStore = new Array(_data);

                let _numDown = dataStore[0][0]['NumberDown'];

                if (_numDown) {
                    let index = 0;
                    for (index = 0; index < grid.columns.length; index++) {
                        if (grid.columns[index].binding == 'Quantity9') {
                            break;
                        }
                    }

                    if (wjcCore.isNumber(_numDown))
                        _numDown = this.dfpanel.replaceDecimal(_numDown);

                    grid.setCellData(grid.selectedRows[0].index, index, _numDown);

                    for (let obj of this._columnChangeChild) {
                        if (obj['Tables'] == 9) {
                            for (const col in obj.columnChanged) {
                                if (col === 'Quantity9') {
                                    const evals = obj.columnChanged[col]['Evaluators'];
                                    for (const eva in evals) {
                                        await  this.dfpanel.runEvaluatorChild(evals[eva], grid.selectedRows[0].index)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            // the click was on the button
            alert('running **' + menu.selectedItem.value + '**');
        }
    }

    //Thêm dialog
    confirmDialog() {
        this.showDialog = true;
    }
    closeDialog() {
        this.showDialog = false;
    }
    //Hết Thêm dialog


    showCompare(grid: wjcGrid.FlexGrid, formData: FormGroup) {

        let params = new Array<ParameterContract>();

        let constraintKey = ['UserName', 'BizDocId'];

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

            let paramXML1 = new ParameterContract();
            paramXML1.ParameterName = this.convertParameterName('gridEditor5');
            paramXML1.ParameterValue = 'gridEditor5';

            params.push(paramXML1);

            let ds = Global.getDataSetContract(
                {
                    name: 'gridEditor5',
                    collection: grid.itemsSource.items
                }
            )

            this.showLoading = true;

            this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_TMCtc_SoSanhHieuQuaTinhGia_PP3', params, ds)
                .toPromise().then(_data => {
                    this.dataEditor7 = new wjcCore.CollectionView(_data['data'][0]);

                });

            this.showLoading = false;
        }
        finally {

        }


        // let pop = this.comparePopup;
        // pop.show();
    }



    async showAttachQR(flex: wjcGrid.FlexGrid) {
        let folder = flex.selectedRows[0].dataItem['ProductCostId'] + '//11.Bao_Gia_Nha_Cung_Cap';
        let fileName = flex.selectedRows[0].dataItem['FilePath'];
        let id = flex.selectedRows[0].dataItem['Id'];       
        
        if (folder && fileName) {
          
          let p = this._service.dowload(folder, id.toString(), fileName).toPromise();
          p.then(blob => {
            
            if (fileName.toUpperCase().endsWith('PDF') == true || fileName.toUpperCase().endsWith('JPG') == true || fileName.toUpperCase().endsWith('PNG') == true || fileName.toUpperCase().endsWith('JPEG') == true || fileName.toUpperCase().endsWith('GIF') == true) {
              let url = window.URL.createObjectURL(blob);
              window.open(url);
            }
          });
        }
        else{
          alert('Không tồn tại file đính kèm trên báo giá!');
        }
      }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}