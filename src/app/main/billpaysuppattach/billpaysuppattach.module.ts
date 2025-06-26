import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillPaySuppAttachComponent } from './billpaysuppattach.component';
import { BillPaySuppAttachEditorComponent } from './billpaysuppattach-editor/billpaysuppattach-editor.component';
import { BillPaySuppAttachExplorerComponent } from './billpaysuppattach-explorer/billpaysuppattach-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { BillPaySuppAttachExplorerChildComponent } from './billpaysuppattach-explorer/billpaysuppattach-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billpaysuppattachRoutes: Routes = [
    {
        path: '', component: BillPaySuppAttachComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillPaySuppAttachExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillPaySuppAttachEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillPaySuppAttachEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: BillPaySuppAttachEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billpaysuppattachRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        BillPaySuppAttachComponent,
        BillPaySuppAttachEditorComponent,
        BillPaySuppAttachExplorerComponent,
        BillPaySuppAttachExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillPaySuppAttachComponent]
})

export class BillPaySuppAttachModule { }
