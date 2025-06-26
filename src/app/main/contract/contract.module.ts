import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ContractComponent } from './contract.component';
 import { ContractEditorComponent } from './contract-editor/contract-editor.component';
import { ContractExplorerComponent } from './contract-explorer/contract-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { ContractExplorerChildComponent } from './contract-explorer/contract-explorer-child.component';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const contractRoutes: Routes = [
    {
        path: '', component: ContractComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ContractExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ContractEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ContractEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(contractRoutes),
        UIModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        ContractComponent,
        ContractEditorComponent,
        ContractExplorerComponent,
        ContractExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ContractComponent]
})

export class ContractModule { }
