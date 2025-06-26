import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedInvestmentContractComponent } from './approvedinvestmentcontract.component';
import { ApprovedInvestmentContractEditorComponent } from './approvedinvestmentcontract-editor/approvedinvestmentcontract-editor.component';
import { ApprovedInvestmentAppendixEditorComponent } from './approvedinvestmentappendix-editor/approvedinvestmentappendix-editor.component';
import { ApprovedInvestmentContractExplorerComponent } from './approvedinvestmentcontract-explorer/approvedinvestmentcontract-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedinvestmentcontractRoutes: Routes = [
    {
        path: '', component: ApprovedInvestmentContractComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedInvestmentContractExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc3', component: ApprovedInvestmentContractEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc3/:id', component: ApprovedInvestmentContractEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc4', component: ApprovedInvestmentAppendixEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc4/:id', component: ApprovedInvestmentAppendixEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedinvestmentcontractRoutes),
        UIModule
    ],
    declarations: [
        ApprovedInvestmentContractComponent,
        ApprovedInvestmentContractEditorComponent,
        ApprovedInvestmentAppendixEditorComponent,
        ApprovedInvestmentContractExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedInvestmentContractComponent]
})

export class ApprovedInvestmentContractModule { }
