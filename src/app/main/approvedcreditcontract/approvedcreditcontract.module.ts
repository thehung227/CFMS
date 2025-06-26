import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedCreditContractComponent } from './approvedcreditcontract.component';
import { ApprovedCreditContractEditorComponent } from './approvedcreditcontract-editor/approvedcreditcontract-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedcreditcontractRoutes: Routes = [
    {
        path: '', component: ApprovedCreditContractComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedCreditContractEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedCreditContractEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedcreditcontractRoutes),
        UIModule
    ],
    declarations: [
        ApprovedCreditContractComponent,
        ApprovedCreditContractEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedCreditContractComponent]
})

export class ApprovedCreditContractModule { }
