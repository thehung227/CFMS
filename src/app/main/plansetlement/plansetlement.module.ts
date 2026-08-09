import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanSetlementComponent } from './plansetlement.component';
import { PlanSetlementEditorComponent } from './plansetlement-editor/plansetlement-editor.component';
import { PlanSetlementExplorerComponent } from './plansetlement-explorer/plansetlement-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PlanSetlementExplorerChildComponent } from './plansetlement-explorer/plansetlement-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const plansetlementRoutes: Routes = [
    {
        path: '', component: PlanSetlementComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanSetlementExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PlanSetlementEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PlanSetlementEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PlanSetlementEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(plansetlementRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PlanSetlementComponent,
        PlanSetlementEditorComponent,
        PlanSetlementExplorerComponent,
        PlanSetlementExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanSetlementComponent]
})

export class PlanSetlementModule { }
