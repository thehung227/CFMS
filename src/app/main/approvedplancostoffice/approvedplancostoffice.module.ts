import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedPlanCostOfficeComponent } from './approvedplancostoffice.component';
import { ApprovedPlanCostOfficeEditorComponent } from './approvedplancostoffice-editor/approvedplancostoffice-editor.component';
import { ApprovedPlanCostOfficeExplorerComponent } from './approvedplancostoffice-explorer/approvedplancostoffice-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedplancostofficeRoutes: Routes = [
    {
        path: '', component: ApprovedPlanCostOfficeComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedPlanCostOfficeExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedPlanCostOfficeEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedPlanCostOfficeEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedplancostofficeRoutes),
        UIModule
    ],
    declarations: [
        ApprovedPlanCostOfficeComponent,
        ApprovedPlanCostOfficeEditorComponent,
        ApprovedPlanCostOfficeExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedPlanCostOfficeComponent]
})

export class ApprovedPlanCostOfficeModule { }
