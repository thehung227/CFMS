import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { RegInvestmentContractComponent } from './reginvestmentcontract.component';
import { RegInvestmentContractEditorComponent } from './reginvestmentcontract-editor/reginvestmentcontract-editor.component';
import { RegInvestmentAppendixEditorComponent } from './reginvestmentappendix-editor/reginvestmentappendix-editor.component';
import { RegInvestmentContractExplorerComponent } from './reginvestmentcontract-explorer/reginvestmentcontract-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { RegInvestmentContractExplorerChildComponent } from './reginvestmentcontract-explorer/reginvestmentcontract-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const reginvestmentcontractRoutes: Routes = [
    {
        path: '', component: RegInvestmentContractComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: RegInvestmentContractExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc3', component: RegInvestmentContractEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc3/:id', component: RegInvestmentContractEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc3/:id/:params', component: RegInvestmentContractEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc4', component: RegInvestmentAppendixEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc4/:id', component: RegInvestmentAppendixEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc4/:id/:params', component: RegInvestmentAppendixEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(reginvestmentcontractRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        RegInvestmentContractComponent,
        RegInvestmentContractEditorComponent,
        RegInvestmentAppendixEditorComponent,
        RegInvestmentContractExplorerComponent,
        RegInvestmentContractExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [RegInvestmentContractComponent]
})

export class RegInvestmentContractModule { }
