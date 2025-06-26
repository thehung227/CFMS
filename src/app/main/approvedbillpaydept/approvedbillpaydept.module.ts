import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedBillPayDeptComponent } from './approvedbillpaydept.component';
import { ApprovedBillPayDeptEditorComponent } from './approvedbillpaydept-editor/approvedbillpaydept-editor.component';
import { ApprovedBillPayDeptExplorerComponent } from './approvedbillpaydept-explorer/approvedbillpaydept-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedbillpaydeptRoutes: Routes = [
    {
        path: '', component: ApprovedBillPayDeptComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedBillPayDeptExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedBillPayDeptEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedBillPayDeptEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedbillpaydeptRoutes),
        UIModule
    ],
    declarations: [
        ApprovedBillPayDeptComponent,
        ApprovedBillPayDeptEditorComponent,
        ApprovedBillPayDeptExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedBillPayDeptComponent]
})

export class ApprovedBillPayDeptModule { }
