import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { SettlementClaimComponent } from './settlementclaim.component';
import { SettlementClaimEditorComponent } from './settlementclaim-editor/settlementclaim-editor.component';
import { SettlementClaimExplorerComponent } from './settlementclaim-explorer/settlementclaim-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { SettlementClaimExplorerChildComponent } from './settlementclaim-explorer/settlementclaim-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const settlementclaimRoutes: Routes = [
    {
        path: '', component: SettlementClaimComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: SettlementClaimExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: SettlementClaimEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: SettlementClaimEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: SettlementClaimEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(settlementclaimRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        SettlementClaimComponent,
        SettlementClaimEditorComponent,
        SettlementClaimExplorerComponent,
        SettlementClaimExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [SettlementClaimComponent]
})

export class SettlementClaimModule { }
