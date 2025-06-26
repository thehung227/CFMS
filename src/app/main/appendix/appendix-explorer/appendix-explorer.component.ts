import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../../ui/ui.module';

import * as wjOData from 'wijmo/wijmo.odata';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcInput from 'wijmo/wijmo.angular2.input';
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
import { LayoutAppendixExplorer } from '../DeclareLayout';
import { BaseExplorerComponent } from '../../_baseform/base-explorer.component';
import { BaseEditorService } from '../../../base/base.service-editor';
import { BaseExplorerService } from '../../../base/base.service-explorer';
import { DialogComponent } from '../../../ui/dialog/dialog.component';
import { Title } from '@angular/platform-browser';
import { LayoutPrinter } from '../../contract/contract-explorer/contract-printer.data';

@Component({
    selector: 'appendix-explorer',
    templateUrl: './appendix-explorer.component.html',
    styleUrls: ['./appendix-explorer.component.css']
})

export class AppendixExplorerComponent extends BaseExplorerComponent implements OnInit, OnDestroy {

    @ViewChild('grid') grid: wjcGrid.FlexGrid;
    @ViewChild('contentFilter') contentFilter: ElementRef;

    @ViewChild('dialogFrm') dialogFrm: DialogComponent;

    layoutPrint: LayoutPrinter = new LayoutPrinter();

    pathPage = ['/main', 'appendix', 'detail'];
    _layoutDeclare: LayoutAppendixExplorer = new LayoutAppendixExplorer()

    constructor(srv: BaseExplorerService,
        router: Router,
        ics: InputControlService, titleService: Title,route: ActivatedRoute) {
            super(srv, router, ics, titleService,route)
        this.zParentTableName = this._layoutDeclare.layout.Structure.Parent.Name;
        this.zFilterKey = this._layoutDeclare.layout.Structure.Parent.FilterKey;
        this.rowPage = this._layoutDeclare.layout.Structure.Parent.RowPage;
        this.fieldOrderBy = this._layoutDeclare.layout.Structure.Parent.OrderBy;
        this.pageNumber = 1;

        this._layoutPrinter = this.layoutPrint.Layout;
    }

    async ngOnInit() {
        await this.init(this.pathPage).then();
        this.grid.columns[0].width = 45;
        this.grid.rowHeaders.columns.maxSize = 2;
    }

    ngOnDestroy() {
        this.destroy();
    }

    onSubmit(formData: FormGroup) {
        this.submit(formData);
    }

    private _groupBy = 'ProductName,CustomerName';
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

    getPermission(commandKey: string, option: string) {
        return Global.getPermission(commandKey, option);
    }

    showPrintVoucher(flex: wjcGrid.FlexGrid, layoutName?: string) {
        let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

        let html = this.printVoucher(flex,layoutName);

        html.then(data => {
            popupWin.document.write(data);
            popupWin.document.close();
        });
    }
}
