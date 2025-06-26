import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedEquiBudgetM5Component } from './approvedequibudgetm5.component';
import { ApprovedEquiBudgetM5EditorComponent } from './approvedequibudgetm5-editor/approvedequibudgetm5-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedequibudgetm5Routes: Routes = [
    {
        path: '', component: ApprovedEquiBudgetM5Component,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedEquiBudgetM5EditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedEquiBudgetM5EditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedequibudgetm5Routes),
        UIModule
    ],
    declarations: [
        ApprovedEquiBudgetM5Component,
        ApprovedEquiBudgetM5EditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedEquiBudgetM5Component]
})

export class ApprovedEquiBudgetM5Module { }
