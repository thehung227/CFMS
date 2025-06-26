import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { DepositContractComponent } from './depositcontract.component';
import { DepositContractEditorComponent } from './depositcontract-editor/depositcontract-editor.component';
import { DepositContractExplorerComponent } from './depositcontract-explorer/depositcontract-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { DepositContractExplorerChildComponent } from './depositcontract-explorer/depositcontract-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const depositcontractRoutes: Routes = [
    {
        path: '', component: DepositContractComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: DepositContractExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: DepositContractEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: DepositContractEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: DepositContractEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(depositcontractRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        DepositContractComponent,
        DepositContractEditorComponent,
        DepositContractExplorerComponent,
        DepositContractExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [DepositContractComponent]
})

export class DepositContractModule { }
