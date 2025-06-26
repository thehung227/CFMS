import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanCcmClaimComponent } from './planccmclaim.component';
import { PlanCcmClaimEditorComponent } from './planccmclaim-editor/planccmclaim-editor.component';
import { PlanCcmClaimExplorerComponent } from './planccmclaim-explorer/planccmclaim-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PlanCcmClaimExplorerChildComponent } from './planccmclaim-explorer/planccmclaim-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const planccmclaimRoutes: Routes = [
    {
        path: '', component: PlanCcmClaimComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanCcmClaimExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PlanCcmClaimEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PlanCcmClaimEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PlanCcmClaimEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(planccmclaimRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PlanCcmClaimComponent,
        PlanCcmClaimEditorComponent,
        PlanCcmClaimExplorerComponent,
        PlanCcmClaimExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanCcmClaimComponent]
})

export class PlanCcmClaimModule { }
