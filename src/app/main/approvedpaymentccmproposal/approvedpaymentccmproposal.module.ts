import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedPaymentCcmProposalComponent } from './approvedpaymentccmproposal.component';
import { ApprovedPaymentCcmProposalEditorComponent } from './approvedpaymentccmproposal-editor/approvedpaymentccmproposal-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedpaymentccmproposalRoutes: Routes = [
    {
        path: '', component: ApprovedPaymentCcmProposalComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedPaymentCcmProposalEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedPaymentCcmProposalEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedpaymentccmproposalRoutes),
        UIModule
    ],
    declarations: [
        ApprovedPaymentCcmProposalComponent,
        ApprovedPaymentCcmProposalEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedPaymentCcmProposalComponent]
})

export class ApprovedPaymentCcmProposalModule { }
