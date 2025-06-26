import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedEquiBudgetM4Component } from './approvedequibudgetm4.component';
import { ApprovedEquiBudgetM4EditorComponent } from './approvedequibudgetm4-editor/approvedequibudgetm4-editor.component';
import { ApprovedEquiBudgetM4ExplorerComponent } from './approvedequibudgetm4-explorer/approvedequibudgetm4-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedequibudgetm4Routes: Routes = [
    {
        path: '', component: ApprovedEquiBudgetM4Component,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedEquiBudgetM4ExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedEquiBudgetM4EditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedEquiBudgetM4EditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedequibudgetm4Routes),
        UIModule
    ],
    declarations: [
        ApprovedEquiBudgetM4Component,
        ApprovedEquiBudgetM4EditorComponent,
        ApprovedEquiBudgetM4ExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedEquiBudgetM4Component]
})

export class ApprovedEquiBudgetM4Module { }
