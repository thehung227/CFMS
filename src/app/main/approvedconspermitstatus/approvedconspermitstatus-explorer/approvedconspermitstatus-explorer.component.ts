import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';

import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { InputControlService } from './../../../ui/input/InputControlService';
import { BaseExplorerComponent } from '../../_baseform/base-explorer.component';
import { BaseExplorerService } from '../../../base/base.service-explorer';
import { DialogComponent } from '../../../ui/dialog/dialog.component';
import { LayoutApprovedConsPermitStatusExplorer } from '../Layout';

@Component({
    selector: 'approvedconspermitstatus-explorer',
    templateUrl: './approvedconspermitstatus-explorer.component.html',
    styleUrls: ['./approvedconspermitstatus-explorer.component.css']
})

export class ApprovedConsPermitStatusExplorerComponent extends BaseExplorerComponent implements OnInit, OnDestroy {

    @ViewChild('grid') grid: wjcGrid.FlexGrid;
    @ViewChild('contentFilter') contentFilter: ElementRef;
    @ViewChild('dialogFrm') dialogFrm: DialogComponent;
    @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
    @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

    pathPage = ['/main', 'approvedconspermitstatus', 'detail'];
    _layoutDeclare: LayoutApprovedConsPermitStatusExplorer = new LayoutApprovedConsPermitStatusExplorer();

    constructor(srv: BaseExplorerService,
        router: Router,
        ics: InputControlService,
        titleService: Title,
        route: ActivatedRoute) {
        super(srv, router, ics, titleService, route);
        this.zParentTableName = this._layoutDeclare.layout.Structure.Parent.Name;
        this.zFilterKey = this._layoutDeclare.layout.Structure.Parent.FilterKey;
        this.rowPage = this._layoutDeclare.layout.Structure.Parent.RowPage;
        this.fieldOrderBy = this._layoutDeclare.layout.Structure.Parent.OrderBy;
        this.pageNumber = 1;
    }

    ngOnInit() {
        this.init(this.pathPage);
    }

    onSubmit(formData: FormGroup) {
        this.submit(formData);
    }

    showPrintVoucher(flex: wjcGrid.FlexGrid, layoutName?: string) {
        let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        let html = this.printVoucher(flex, layoutName);

        html.then(data => {
            popupWin.document.write(data);
            popupWin.document.close();
        });
    }

    private _groupBy = 'ProductName';
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
                    var groupDesc = new wjcCore.PropertyGroupDescription(groupNames[i]);
                    cv.groupDescriptions.push(groupDesc);
                }
                cv.refresh();
            }
            cv.endUpdate();
            this.grid.groupHeaderFormat = '<b>{value}</b> ({count:n0} mục) ';
        }
        this.grid.collapseGroupsToLevel(1);
    }

    ngOnDestroy() {
        this.destroy();
    }
}
