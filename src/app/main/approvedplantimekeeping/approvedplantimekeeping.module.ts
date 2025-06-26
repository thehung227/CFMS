import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedPlanTimeKeepingComponent } from './approvedplantimekeeping.component';
import { ApprovedPlanTimeKeepingEditorComponent } from './approvedplantimekeeping-editor/approvedplantimekeeping-editor.component';
import { ApprovedPlanTimeKeepingExplorerComponent } from './approvedplantimekeeping-explorer/approvedplantimekeeping-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedplantimekeepingRoutes: Routes = [
    {
        path: '', component: ApprovedPlanTimeKeepingComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedPlanTimeKeepingExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedPlanTimeKeepingEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedPlanTimeKeepingEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedplantimekeepingRoutes),
        UIModule
    ],
    declarations: [
        ApprovedPlanTimeKeepingComponent,
        ApprovedPlanTimeKeepingEditorComponent,
        ApprovedPlanTimeKeepingExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedPlanTimeKeepingComponent]
})

export class ApprovedPlanTimeKeepingModule { }
