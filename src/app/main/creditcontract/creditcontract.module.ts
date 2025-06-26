import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { CreditContractComponent } from './creditcontract.component';
import { CreditContractEditorComponent } from './creditcontract-editor/creditcontract-editor.component';
import { CreditContractExplorerComponent } from './creditcontract-explorer/creditcontract-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { CreditContractExplorerChildComponent } from './creditcontract-explorer/creditcontract-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const creditcontractRoutes: Routes = [
    {
        path: '', component: CreditContractComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: CreditContractExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: CreditContractEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: CreditContractEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: CreditContractEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(creditcontractRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        CreditContractComponent,
        CreditContractEditorComponent,
        CreditContractExplorerComponent,
        CreditContractExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [CreditContractComponent]
})

export class CreditContractModule { }
