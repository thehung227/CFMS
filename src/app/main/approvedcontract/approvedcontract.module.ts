import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedContractComponent } from './approvedcontract.component';
import { ApprovedContractEditorComponent } from './approvedcontract-editor/approvedcontract-editor.component';
import { ApprovedAppendixEditorComponent } from './approvedappendix-editor/approvedappendix-editor.component';
import { ApprovedContractExplorerComponent } from './approvedcontract-explorer/approvedcontract-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedcontractRoutes: Routes = [
    {
        path: '', component: ApprovedContractComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedContractExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc3', component: ApprovedContractEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc3/:id', component: ApprovedContractEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc4', component: ApprovedAppendixEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc4/:id', component: ApprovedAppendixEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedcontractRoutes),
        UIModule
    ],
    declarations: [
        ApprovedContractComponent,
        ApprovedContractEditorComponent,
        ApprovedAppendixEditorComponent,
        ApprovedContractExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedContractComponent]
})

export class ApprovedContractModule { }
