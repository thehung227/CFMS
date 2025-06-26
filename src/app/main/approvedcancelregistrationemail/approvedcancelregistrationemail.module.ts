import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedCancelRegistrationEmailComponent } from './approvedcancelregistrationemail.component';
import { ApprovedCancelRegistrationEmailEditorComponent } from './approvedcancelregistrationemail-editor/approvedcancelregistrationemail-editor.component';
import { ApprovedCancelRegistrationEmailExplorerComponent } from './approvedcancelregistrationemail-explorer/approvedcancelregistrationemail-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedcancelregistrationemailRoutes: Routes = [
    {
        path: '', component: ApprovedCancelRegistrationEmailComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedCancelRegistrationEmailExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedCancelRegistrationEmailEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedCancelRegistrationEmailEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedcancelregistrationemailRoutes),
        UIModule
    ],
    declarations: [
        ApprovedCancelRegistrationEmailComponent,
        ApprovedCancelRegistrationEmailEditorComponent,
        ApprovedCancelRegistrationEmailExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedCancelRegistrationEmailComponent]
})

export class ApprovedCancelRegistrationEmailModule { }
