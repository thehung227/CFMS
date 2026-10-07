import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ConsPermitStatusComponent } from './conspermitstatus.component';
import { ConsPermitStatusEditorComponent } from './conspermitstatus-editor/conspermitstatus-editor.component';
import { ConsPermitStatusExplorerComponent } from './conspermitstatus-explorer/conspermitstatus-explorer.component';
import { ConsPermitStatusExplorerChildComponent } from './conspermitstatus-explorer/conspermitstatus-explorer-child.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const conspermitstatusRoutes: Routes = [
    {
        path: '', component: ConsPermitStatusComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ConsPermitStatusExplorerComponent, resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ConsPermitStatusEditorComponent, resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ConsPermitStatusEditorComponent, resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ConsPermitStatusEditorComponent, resolve: { permission: PermissionResolve } }
        ]
    },
];

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(conspermitstatusRoutes),
        UIModule,
        WjGridFilterModule,
        WjGridDetailModule
    ],
    declarations: [
        ConsPermitStatusComponent,
        ConsPermitStatusEditorComponent,
        ConsPermitStatusExplorerComponent,
        ConsPermitStatusExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ConsPermitStatusComponent]
})

export class ConsPermitStatusModule { }
