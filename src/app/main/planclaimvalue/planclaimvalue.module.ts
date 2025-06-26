import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanClaimValueComponent } from './planclaimvalue.component';
import { PlanClaimValueEditorComponent } from './planclaimvalue-editor/planclaimvalue-editor.component';
import { PlanClaimValueExplorerComponent } from './planclaimvalue-explorer/planclaimvalue-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PlanClaimValueExplorerChildComponent } from './planclaimvalue-explorer/planclaimvalue-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const planclaimvalueRoutes: Routes = [
    {
        path: '', component: PlanClaimValueComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanClaimValueExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PlanClaimValueEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PlanClaimValueEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PlanClaimValueEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(planclaimvalueRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PlanClaimValueComponent,
        PlanClaimValueEditorComponent,
        PlanClaimValueExplorerComponent,
        PlanClaimValueExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanClaimValueComponent]
})

export class PlanClaimValueModule { }
