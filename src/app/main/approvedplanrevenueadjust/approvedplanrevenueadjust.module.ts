import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedPlanRevenueAdjustComponent } from './approvedplanrevenueadjust.component';
import { ApprovedPlanRevenueAdjustEditorComponent } from './approvedplanrevenueadjust-editor/approvedplanrevenueadjust-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedplanrevenueadjustRoutes: Routes = [
    {
        path: '', component: ApprovedPlanRevenueAdjustComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedPlanRevenueAdjustEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedPlanRevenueAdjustEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedplanrevenueadjustRoutes),
        UIModule
    ],
    declarations: [
        ApprovedPlanRevenueAdjustComponent,
        ApprovedPlanRevenueAdjustEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedPlanRevenueAdjustComponent]
})

export class ApprovedPlanRevenueAdjustModule { }
