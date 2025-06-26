import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedInvestTaskComponent } from './approvedinvesttask.component';
import { ApprovedInvestTaskEditorComponent } from './approvedinvesttask-editor/approvedinvesttask-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedinvesttaskRoutes: Routes = [
    {
        path: '', component: ApprovedInvestTaskComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedInvestTaskEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedInvestTaskEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedinvesttaskRoutes),
        UIModule
    ],
    declarations: [
        ApprovedInvestTaskComponent,
        ApprovedInvestTaskEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedInvestTaskComponent]
})

export class ApprovedInvestTaskModule { }
