import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { SettlementRecordsComponent } from './settlementrecords.component';
import { SettlementRecordsEditorComponent } from './settlementrecords-editor/settlementrecords-editor.component';
import { SettlementRecordsExplorerComponent } from './settlementrecords-explorer/settlementrecords-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { SettlementRecordsExplorerChildComponent } from './settlementrecords-explorer/settlementrecords-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const settlementrecordsRoutes: Routes = [
    {
        path: '', component: SettlementRecordsComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: SettlementRecordsExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: SettlementRecordsEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: SettlementRecordsEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: SettlementRecordsEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(settlementrecordsRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        SettlementRecordsComponent,
        SettlementRecordsEditorComponent,
        SettlementRecordsExplorerComponent,
        SettlementRecordsExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [SettlementRecordsComponent]
})

export class SettlementRecordsModule { }
