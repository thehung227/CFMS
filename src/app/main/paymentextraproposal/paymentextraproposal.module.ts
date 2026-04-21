import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PaymentExtraProposalComponent } from './paymentextraproposal.component';
import { PaymentExtraProposalEditorComponent } from './paymentextraproposal-editor/paymentextraproposal-editor.component';
import { PaymentExtraProposalExplorerComponent } from './paymentextraproposal-explorer/paymentextraproposal-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PaymentExtraProposalExplorerChildComponent } from './paymentextraproposal-explorer/paymentextraproposal-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const paymentextraproposalRoutes: Routes = [
    {
        path: '', component: PaymentExtraProposalComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PaymentExtraProposalExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PaymentExtraProposalEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PaymentExtraProposalEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PaymentExtraProposalEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(paymentextraproposalRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PaymentExtraProposalComponent,
        PaymentExtraProposalEditorComponent,
        PaymentExtraProposalExplorerComponent,
        PaymentExtraProposalExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PaymentExtraProposalComponent]
})

export class PaymentExtraProposalModule { }
