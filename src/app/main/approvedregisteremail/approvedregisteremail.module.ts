import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedRegisterEmailComponent } from './approvedregisteremail.component';
import { ApprovedRegisterEmailEditorComponent } from './approvedregisteremail-editor/approvedregisteremail-editor.component';
import { ApprovedRegisterEmailExplorerComponent } from './approvedregisteremail-explorer/approvedregisteremail-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedregisteremailRoutes: Routes = [
    {
        path: '', component: ApprovedRegisterEmailComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedRegisterEmailExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedRegisterEmailEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedRegisterEmailEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedregisteremailRoutes),
        UIModule
    ],
    declarations: [
        ApprovedRegisterEmailComponent,
        ApprovedRegisterEmailEditorComponent,
        ApprovedRegisterEmailExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedRegisterEmailComponent]
})

export class ApprovedRegisterEmailModule { }
