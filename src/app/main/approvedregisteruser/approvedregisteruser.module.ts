import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedRegisterUserComponent } from './approvedregisteruser.component';
import { ApprovedRegisterUserEditorComponent } from './approvedregisteruser-editor/approvedregisteruser-editor.component';
import { ApprovedRegisterUserExplorerComponent } from './approvedregisteruser-explorer/approvedregisteruser-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedregisteruserRoutes: Routes = [
    {
        path: '', component: ApprovedRegisterUserComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedRegisterUserExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedRegisterUserEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedRegisterUserEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedregisteruserRoutes),
        UIModule
    ],
    declarations: [
        ApprovedRegisterUserComponent,
        ApprovedRegisterUserEditorComponent,
        ApprovedRegisterUserExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedRegisterUserComponent]
})

export class ApprovedRegisterUserModule { }
