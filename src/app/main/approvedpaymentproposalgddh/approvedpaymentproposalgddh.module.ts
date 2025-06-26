import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedPaymentProposalGddhComponent } from './approvedpaymentproposalgddh.component';
import { ApprovedPaymentProposalGddhEditorComponent } from './approvedpaymentproposalgddh-editor/approvedpaymentproposalgddh-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const approvedpaymentproposalgddhRoutes: Routes = [
    {
        path: '', component: ApprovedPaymentProposalGddhComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedPaymentProposalGddhEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedPaymentProposalGddhEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedpaymentproposalgddhRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        ApprovedPaymentProposalGddhComponent,
        ApprovedPaymentProposalGddhEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedPaymentProposalGddhComponent]
})

export class ApprovedPaymentProposalGddhModule { }
