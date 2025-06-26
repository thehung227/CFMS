import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedPaymentProposalAccountComponent } from './approvedpaymentproposalaccount.component';
import { ApprovedPaymentProposalAccountEditorComponent } from './approvedpaymentproposalaccount-editor/approvedpaymentproposalaccount-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedpaymentproposalaccountRoutes: Routes = [
    {
        path: '', component: ApprovedPaymentProposalAccountComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedPaymentProposalAccountEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedPaymentProposalAccountEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedpaymentproposalaccountRoutes),
        UIModule
    ],
    declarations: [
        ApprovedPaymentProposalAccountComponent,
        ApprovedPaymentProposalAccountEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedPaymentProposalAccountComponent]
})

export class ApprovedPaymentProposalAccountModule { }
