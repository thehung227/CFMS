import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { SetlementStatusComponent } from './setlementstatus.component';
import { SetlementStatusEditorComponent } from './setlementstatus-editor/setlementstatus-editor.component';
import { SetlementStatusExplorerComponent } from './setlementstatus-explorer/setlementstatus-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { SetlementStatusExplorerChildComponent } from './setlementstatus-explorer/setlementstatus-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const setlementstatusRoutes: Routes = [
    {
        path: '', component: SetlementStatusComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: SetlementStatusExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: SetlementStatusEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: SetlementStatusEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: SetlementStatusEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(setlementstatusRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        SetlementStatusComponent,
        SetlementStatusEditorComponent,
        SetlementStatusExplorerComponent,
        SetlementStatusExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [SetlementStatusComponent]
})

export class SetlementStatusModule { }
