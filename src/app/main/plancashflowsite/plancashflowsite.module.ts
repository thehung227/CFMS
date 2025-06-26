import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanCashFlowSiteComponent } from './plancashflowsite.component';
import { PlanCashFlowSiteEditorComponent } from './plancashflowsite-editor/plancashflowsite-editor.component';
import { PlanCashFlowSiteExplorerComponent } from './plancashflowsite-explorer/plancashflowsite-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PlanCashFlowSiteExplorerChildComponent } from './plancashflowsite-explorer/plancashflowsite-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const plancashflowsiteRoutes: Routes = [
    {
        path: '', component: PlanCashFlowSiteComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanCashFlowSiteExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PlanCashFlowSiteEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PlanCashFlowSiteEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PlanCashFlowSiteEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(plancashflowsiteRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PlanCashFlowSiteComponent,
        PlanCashFlowSiteEditorComponent,
        PlanCashFlowSiteExplorerComponent,
        PlanCashFlowSiteExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanCashFlowSiteComponent]
})

export class PlanCashFlowSiteModule { }
