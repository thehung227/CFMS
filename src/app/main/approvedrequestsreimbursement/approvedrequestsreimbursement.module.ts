import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedRequestsReimbursementComponent } from './approvedrequestsreimbursement.component';
import { ApprovedRequestsReimbursementEditorComponent } from './approvedrequestsreimbursement-editor/approvedrequestsreimbursement-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedrequestsreimbursementRoutes: Routes = [
    {
        path: '', component: ApprovedRequestsReimbursementComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedRequestsReimbursementEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedRequestsReimbursementEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedrequestsreimbursementRoutes),
        UIModule
    ],
    declarations: [
        ApprovedRequestsReimbursementComponent,
        ApprovedRequestsReimbursementEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedRequestsReimbursementComponent]
})

export class ApprovedRequestsReimbursementModule { }
