import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanSignStatusComponent } from './plansignstatus.component';
import { PlanSignStatusEditorComponent } from './plansignstatus-editor/plansignstatus-editor.component';
import { PlanSignStatusExplorerComponent } from './plansignstatus-explorer/plansignstatus-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { PlanSignStatusExplorerChildComponent } from './plansignstatus-explorer/plansignstatus-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const plansignstatusRoutes: Routes = [
    {
        path: '', component: PlanSignStatusComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanSignStatusExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PlanSignStatusEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PlanSignStatusEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PlanSignStatusEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(plansignstatusRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        PlanSignStatusComponent,
        PlanSignStatusEditorComponent,
        PlanSignStatusExplorerComponent,
        PlanSignStatusExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanSignStatusComponent]
})

export class PlanSignStatusModule { }
