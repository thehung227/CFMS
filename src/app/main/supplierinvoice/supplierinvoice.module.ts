import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { SupplierInvoiceComponent } from './supplierinvoice.component';
import { SupplierInvoiceEditorComponent } from './supplierinvoice-editor/supplierinvoice-editor.component';
import { SupplierInvoiceExplorerComponent } from './supplierinvoice-explorer/supplierinvoice-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const supplierinvoiceRoutes: Routes = [
    {
        path: '', component: SupplierInvoiceComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: SupplierInvoiceExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: SupplierInvoiceEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: SupplierInvoiceEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: SupplierInvoiceEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(supplierinvoiceRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        SupplierInvoiceComponent,
        SupplierInvoiceEditorComponent,
        SupplierInvoiceExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [SupplierInvoiceComponent]
})

export class SupplierInvoiceModule { }
