import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedBillPayMainComponent } from './approvedbillpaymain.component';
import { ApprovedBillPayMainEditorComponent } from './approvedbillpaymain-editor/approvedbillpaymain-editor.component';
import { ApprovedBillPayMainExplorerComponent } from './approvedbillpaymain-explorer/approvedbillpaymain-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedbillpaymainRoutes: Routes = [
    {
        path: '', component: ApprovedBillPayMainComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedBillPayMainExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedBillPayMainEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedBillPayMainEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedbillpaymainRoutes),
        UIModule
    ],
    declarations: [
        ApprovedBillPayMainComponent,
        ApprovedBillPayMainEditorComponent,
        ApprovedBillPayMainExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedBillPayMainComponent]
})

export class ApprovedBillPayMainModule { }
