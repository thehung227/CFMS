import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillPaySuppEditComponent } from './billpaysuppedit.component';
import { BillPaySuppEditEditorComponent } from './billpaysuppedit-editor/billpaysuppedit-editor.component';
import { BillPaySuppEditExplorerComponent } from './billpaysuppedit-explorer/billpaysuppedit-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { BillPaySuppEditExplorerChildComponent } from './billpaysuppedit-explorer/billpaysuppedit-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billpaysuppeditRoutes: Routes = [
    {
        path: '', component: BillPaySuppEditComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillPaySuppEditExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillPaySuppEditEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillPaySuppEditEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: BillPaySuppEditEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billpaysuppeditRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        BillPaySuppEditComponent,
        BillPaySuppEditEditorComponent,
        BillPaySuppEditExplorerComponent,
        BillPaySuppEditExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillPaySuppEditComponent]
})

export class BillPaySuppEditModule { }
