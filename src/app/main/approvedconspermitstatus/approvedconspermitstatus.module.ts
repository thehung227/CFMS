import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedConsPermitStatusComponent } from './approvedconspermitstatus.component';
import { ApprovedConsPermitStatusEditorComponent } from './approvedconspermitstatus-editor/approvedconspermitstatus-editor.component';
import { ApprovedConsPermitStatusExplorerComponent } from './approvedconspermitstatus-explorer/approvedconspermitstatus-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedconspermitstatusRoutes: Routes = [
    {
        path: '', component: ApprovedConsPermitStatusComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedConsPermitStatusExplorerComponent, resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedConsPermitStatusEditorComponent, resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedConsPermitStatusEditorComponent, resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ApprovedConsPermitStatusEditorComponent, resolve: { permission: PermissionResolve } }
        ]
    },
];

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedconspermitstatusRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        ApprovedConsPermitStatusComponent,
        ApprovedConsPermitStatusEditorComponent,
        ApprovedConsPermitStatusExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedConsPermitStatusComponent]
})

export class ApprovedConsPermitStatusModule { }
