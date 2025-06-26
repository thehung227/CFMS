import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedSpendingPlanComponent } from './approvedspendingplan.component';
import { ApprovedSpendingPlanEditorComponent } from './approvedspendingplan-editor/approvedspendingplan-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedspendingplanRoutes: Routes = [
    {
        path: '', component: ApprovedSpendingPlanComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedSpendingPlanEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedSpendingPlanEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedspendingplanRoutes),
        UIModule
    ],
    declarations: [
        ApprovedSpendingPlanComponent,
        ApprovedSpendingPlanEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedSpendingPlanComponent]
})

export class ApprovedSpendingPlanModule { }
