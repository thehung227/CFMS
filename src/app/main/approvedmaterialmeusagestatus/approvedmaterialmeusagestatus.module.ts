import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedMaterialMeUsageStatusComponent } from './approvedmaterialmeusagestatus.component';
import { ApprovedMaterialMeUsageStatusEditorComponent } from './approvedmaterialmeusagestatus-editor/approvedmaterialmeusagestatus-editor.component';
import { ApprovedMaterialMeUsageStatusExplorerComponent } from './approvedmaterialmeusagestatus-explorer/approvedmaterialmeusagestatus-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedmaterialmeusagestatusRoutes: Routes = [
    {
        path: '', component: ApprovedMaterialMeUsageStatusComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedMaterialMeUsageStatusExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedMaterialMeUsageStatusEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedMaterialMeUsageStatusEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedmaterialmeusagestatusRoutes),
        UIModule
    ],
    declarations: [
        ApprovedMaterialMeUsageStatusComponent,
        ApprovedMaterialMeUsageStatusEditorComponent,
        ApprovedMaterialMeUsageStatusExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedMaterialMeUsageStatusComponent]
})

export class ApprovedMaterialMeUsageStatusModule { }
