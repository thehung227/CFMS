import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PaymentProposalComponent } from './paymentproposal.component';
import { PaymentProposalEditorComponent } from './paymentproposal-editor/paymentproposal-editor.component';
import { PaymentProposalExplorerComponent } from './paymentproposal-explorer/paymentproposal-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PaymentProposalExplorerChildComponent } from './paymentproposal-explorer/paymentproposal-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const paymentproposalRoutes: Routes = [
    {
        path: '', component: PaymentProposalComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PaymentProposalExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PaymentProposalEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PaymentProposalEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PaymentProposalEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(paymentproposalRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PaymentProposalComponent,
        PaymentProposalEditorComponent,
        PaymentProposalExplorerComponent,
        PaymentProposalExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PaymentProposalComponent]
})

export class PaymentProposalModule { }
