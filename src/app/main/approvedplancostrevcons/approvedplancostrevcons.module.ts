import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedPlanCostRevConsComponent } from './approvedplancostrevcons.component';
import { ApprovedPlanCostRevConsEditorComponent } from './approvedplancostrevcons-editor/approvedplancostrevcons-editor.component';
import { ApprovedPlanCostRevConsExplorerComponent } from './approvedplancostrevcons-explorer/approvedplancostrevcons-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedplancostrevconsRoutes: Routes = [
    {
        path: '', component: ApprovedPlanCostRevConsComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedPlanCostRevConsExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedPlanCostRevConsEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedPlanCostRevConsEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedplancostrevconsRoutes),
        UIModule
    ],
    declarations: [
        ApprovedPlanCostRevConsComponent,
        ApprovedPlanCostRevConsEditorComponent,
        ApprovedPlanCostRevConsExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedPlanCostRevConsComponent]
})

export class ApprovedPlanCostRevConsModule { }
