import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedBillEwiComponent } from './approvedbillewi.component';
import { ApprovedBillEwiEditorComponent } from './approvedbillewi-editor/approvedbillewi-editor.component';
import { ApprovedBillEwiExplorerComponent } from './approvedbillewi-explorer/approvedbillewi-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedbillewiRoutes: Routes = [
    {
        path: '', component: ApprovedBillEwiComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedBillEwiExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedBillEwiEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedBillEwiEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedbillewiRoutes),
        UIModule
    ],
    declarations: [
        ApprovedBillEwiComponent,
        ApprovedBillEwiEditorComponent,
        ApprovedBillEwiExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedBillEwiComponent]
})

export class ApprovedBillEwiModule { }
