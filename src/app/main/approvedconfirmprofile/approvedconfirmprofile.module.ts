import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedConfirmProfileComponent } from './approvedconfirmprofile.component';
import { ApprovedConfirmProfileEditorComponent } from './approvedconfirmprofile-editor/approvedconfirmprofile-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedconfirmprofileRoutes: Routes = [
    {
        path: '', component: ApprovedConfirmProfileComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedConfirmProfileEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedConfirmProfileEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedconfirmprofileRoutes),
        UIModule
    ],
    declarations: [
        ApprovedConfirmProfileComponent,
        ApprovedConfirmProfileEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedConfirmProfileComponent]
})

export class ApprovedConfirmProfileModule { }
