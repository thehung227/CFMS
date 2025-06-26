import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PaymentCcmProposalComponent } from './paymentccmproposal.component';
import { PaymentCcmProposalEditorComponent } from './paymentccmproposal-editor/paymentccmproposal-editor.component';
import { PaymentCcmProposalExplorerComponent } from './paymentccmproposal-explorer/paymentccmproposal-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PaymentCcmProposalExplorerChildComponent } from './paymentccmproposal-explorer/paymentccmproposal-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const paymentccmproposalRoutes: Routes = [
    {
        path: '', component: PaymentCcmProposalComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PaymentCcmProposalExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PaymentCcmProposalEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PaymentCcmProposalEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PaymentCcmProposalEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(paymentccmproposalRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PaymentCcmProposalComponent,
        PaymentCcmProposalEditorComponent,
        PaymentCcmProposalExplorerComponent,
        PaymentCcmProposalExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PaymentCcmProposalComponent]
})

export class PaymentCcmProposalModule { }
