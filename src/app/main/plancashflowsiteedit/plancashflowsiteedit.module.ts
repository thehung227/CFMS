import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanCashFlowSiteEditComponent } from './plancashflowsiteedit.component';
import { PlanCashFlowSiteEditEditorComponent } from './plancashflowsiteedit-editor/plancashflowsiteedit-editor.component';
import { PlanCashFlowSiteEditExplorerComponent } from './plancashflowsiteedit-explorer/plancashflowsiteedit-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PlanCashFlowSiteEditExplorerChildComponent } from './plancashflowsiteedit-explorer/plancashflowsiteedit-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const plancashflowsiteeditRoutes: Routes = [
    {
        path: '', component: PlanCashFlowSiteEditComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanCashFlowSiteEditExplorerComponent,resolve: { permission: PermissionResolve } },
            // Màn admin: chỉ sửa hồ sơ đã có, không tạo mới
            { path: 'detail/:id', component: PlanCashFlowSiteEditEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(plancashflowsiteeditRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PlanCashFlowSiteEditComponent,
        PlanCashFlowSiteEditEditorComponent,
        PlanCashFlowSiteEditExplorerComponent,
        PlanCashFlowSiteEditExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanCashFlowSiteEditComponent]
})

export class PlanCashFlowSiteEditModule { }
