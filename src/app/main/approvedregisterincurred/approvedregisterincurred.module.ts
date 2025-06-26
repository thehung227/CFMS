import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedRegisterIncurredComponent } from './approvedregisterincurred.component';
import { ApprovedRegisterIncurredEditorComponent } from './approvedregisterincurred-editor/approvedregisterincurred-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedregisterincurredRoutes: Routes = [
    {
        path: '', component: ApprovedRegisterIncurredComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedRegisterIncurredEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedRegisterIncurredEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedregisterincurredRoutes),
        UIModule
    ],
    declarations: [
        ApprovedRegisterIncurredComponent,
        ApprovedRegisterIncurredEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedRegisterIncurredComponent]
})

export class ApprovedRegisterIncurredModule { }
