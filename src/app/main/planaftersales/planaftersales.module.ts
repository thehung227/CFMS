import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanAfterSalesComponent } from './planaftersales.component';
import { PlanAfterSalesEditorComponent } from './planaftersales-editor/planaftersales-editor.component';
import { PlanAfterSalesExplorerComponent } from './planaftersales-explorer/planaftersales-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PlanAfterSalesExplorerChildComponent } from './planaftersales-explorer/planaftersales-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const planaftersalesRoutes: Routes = [
    {
        path: '', component: PlanAfterSalesComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanAfterSalesExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PlanAfterSalesEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PlanAfterSalesEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PlanAfterSalesEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(planaftersalesRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PlanAfterSalesComponent,
        PlanAfterSalesEditorComponent,
        PlanAfterSalesExplorerComponent,
        PlanAfterSalesExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanAfterSalesComponent]
})

export class PlanAfterSalesModule { }
