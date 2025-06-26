import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedGuaranteeTaskComponent } from './approvedguaranteetask.component';
import { ApprovedGuaranteeTaskEditorComponent } from './approvedguaranteetask-editor/approvedguaranteetask-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedguaranteetaskRoutes: Routes = [
    {
        path: '', component: ApprovedGuaranteeTaskComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedGuaranteeTaskEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedGuaranteeTaskEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedguaranteetaskRoutes),
        UIModule
    ],
    declarations: [
        ApprovedGuaranteeTaskComponent,
        ApprovedGuaranteeTaskEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedGuaranteeTaskComponent]
})

export class ApprovedGuaranteeTaskModule { }
