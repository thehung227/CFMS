import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedBillPaySuppComponent } from './approvedbillpaysupp.component';
import { ApprovedBillPaySuppEditorComponent } from './approvedbillpaysupp-editor/approvedbillpaysupp-editor.component';
import { ApprovedBillPaySuppExplorerComponent } from './approvedbillpaysupp-explorer/approvedbillpaysupp-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedbillpaysuppRoutes: Routes = [
    {
        path: '', component: ApprovedBillPaySuppComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedBillPaySuppExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedBillPaySuppEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedBillPaySuppEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedbillpaysuppRoutes),
        UIModule
    ],
    declarations: [
        ApprovedBillPaySuppComponent,
        ApprovedBillPaySuppEditorComponent,
        ApprovedBillPaySuppExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedBillPaySuppComponent]
})

export class ApprovedBillPaySuppModule { }
