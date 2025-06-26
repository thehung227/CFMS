import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedPlanSignStatusComponent } from './approvedplansignstatus.component';
import { ApprovedPlanSignStatusEditorComponent } from './approvedplansignstatus-editor/approvedplansignstatus-editor.component';
import { ApprovedPlanSignStatusExplorerComponent } from './approvedplansignstatus-explorer/approvedplansignstatus-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedplansignstatusRoutes: Routes = [
    {
        path: '', component: ApprovedPlanSignStatusComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedPlanSignStatusExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedPlanSignStatusEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedPlanSignStatusEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedplansignstatusRoutes),
        UIModule
    ],
    declarations: [
        ApprovedPlanSignStatusComponent,
        ApprovedPlanSignStatusEditorComponent,
        ApprovedPlanSignStatusExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedPlanSignStatusComponent]
})

export class ApprovedPlanSignStatusModule { }
