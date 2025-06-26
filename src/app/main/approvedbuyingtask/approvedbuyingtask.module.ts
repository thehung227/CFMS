import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedBuyingTaskComponent } from './approvedbuyingtask.component';
import { ApprovedBuyingTaskEditorComponent } from './approvedbuyingtask-editor/approvedbuyingtask-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedbuyingtaskRoutes: Routes = [
    {
        path: '', component: ApprovedBuyingTaskComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedBuyingTaskEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedBuyingTaskEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedbuyingtaskRoutes),
        UIModule
    ],
    declarations: [
        ApprovedBuyingTaskComponent,
        ApprovedBuyingTaskEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedBuyingTaskComponent]
})

export class ApprovedBuyingTaskModule { }
