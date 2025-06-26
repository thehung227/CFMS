import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedMaterialUsageStatusComponent } from './approvedmaterialusagestatus.component';
import { ApprovedMaterialUsageStatusEditorComponent } from './approvedmaterialusagestatus-editor/approvedmaterialusagestatus-editor.component';
import { ApprovedMaterialUsageStatusExplorerComponent } from './approvedmaterialusagestatus-explorer/approvedmaterialusagestatus-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedmaterialusagestatusRoutes: Routes = [
    {
        path: '', component: ApprovedMaterialUsageStatusComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedMaterialUsageStatusExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedMaterialUsageStatusEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedMaterialUsageStatusEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedmaterialusagestatusRoutes),
        UIModule
    ],
    declarations: [
        ApprovedMaterialUsageStatusComponent,
        ApprovedMaterialUsageStatusEditorComponent,
        ApprovedMaterialUsageStatusExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedMaterialUsageStatusComponent]
})

export class ApprovedMaterialUsageStatusModule { }
