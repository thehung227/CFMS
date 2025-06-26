import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedPlanAfterSalesComponent } from './approvedplanaftersales.component';
import { ApprovedPlanAfterSalesEditorComponent } from './approvedplanaftersales-editor/approvedplanaftersales-editor.component';
import { ApprovedPlanAfterSalesExplorerComponent } from './approvedplanaftersales-explorer/approvedplanaftersales-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedplanaftersalesRoutes: Routes = [
    {
        path: '', component: ApprovedPlanAfterSalesComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedPlanAfterSalesExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedPlanAfterSalesEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedPlanAfterSalesEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedplanaftersalesRoutes),
        UIModule
    ],
    declarations: [
        ApprovedPlanAfterSalesComponent,
        ApprovedPlanAfterSalesEditorComponent,
        ApprovedPlanAfterSalesExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedPlanAfterSalesComponent]
})

export class ApprovedPlanAfterSalesModule { }
