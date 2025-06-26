import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { RequestsReimbursementComponent } from './requestsreimbursement.component';
import { RequestsReimbursementEditorComponent } from './requestsreimbursement-editor/requestsreimbursement-editor.component';
import { RequestsReimbursementExplorerComponent } from './requestsreimbursement-explorer/requestsreimbursement-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { RequestsReimbursementExplorerChildComponent } from './requestsreimbursement-explorer/requestsreimbursement-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const requestsreimbursementRoutes: Routes = [
    {
        path: '', component: RequestsReimbursementComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: RequestsReimbursementExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: RequestsReimbursementEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: RequestsReimbursementEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: RequestsReimbursementEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(requestsreimbursementRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        RequestsReimbursementComponent,
        RequestsReimbursementEditorComponent,
        RequestsReimbursementExplorerComponent,
        RequestsReimbursementExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [RequestsReimbursementComponent]
})

export class RequestsReimbursementModule { }
