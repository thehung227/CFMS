import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanRevenueAdjustEditComponent } from './planrevenueadjustedit.component';
import { PlanRevenueAdjustEditEditorComponent } from './planrevenueadjustedit-editor/planrevenueadjustedit-editor.component';
import { PlanRevenueAdjustEditExplorerComponent } from './planrevenueadjustedit-explorer/planrevenueadjustedit-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PlanRevenueAdjustEditExplorerChildComponent } from './planrevenueadjustedit-explorer/planrevenueadjustedit-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const planrevenueadjusteditRoutes: Routes = [
    {
        path: '', component: PlanRevenueAdjustEditComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanRevenueAdjustEditExplorerComponent,resolve: { permission: PermissionResolve } },
            // Màn admin: chỉ sửa hồ sơ đã có, không tạo mới
            { path: 'detail/:id', component: PlanRevenueAdjustEditEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(planrevenueadjusteditRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PlanRevenueAdjustEditComponent,
        PlanRevenueAdjustEditEditorComponent,
        PlanRevenueAdjustEditExplorerComponent,
        PlanRevenueAdjustEditExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanRevenueAdjustEditComponent]
})

export class PlanRevenueAdjustEditModule { }
