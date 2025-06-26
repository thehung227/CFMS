import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PaymentMeProposalComponent } from './paymentmeproposal.component';
import { PaymentMeProposalEditorComponent } from './paymentmeproposal-editor/paymentmeproposal-editor.component';
import { PaymentMeProposalExplorerComponent } from './paymentmeproposal-explorer/paymentmeproposal-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PaymentMeProposalExplorerChildComponent } from './paymentmeproposal-explorer/paymentmeproposal-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const paymentmeproposalRoutes: Routes = [
    {
        path: '', component: PaymentMeProposalComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PaymentMeProposalExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PaymentMeProposalEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PaymentMeProposalEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PaymentMeProposalEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(paymentmeproposalRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PaymentMeProposalComponent,
        PaymentMeProposalEditorComponent,
        PaymentMeProposalExplorerComponent,
        PaymentMeProposalExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PaymentMeProposalComponent]
})

export class PaymentMeProposalModule { }
