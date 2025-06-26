import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { SupplierQuotesComponent } from './supplierquotes.component';
import { SupplierQuotesEditorComponent } from './supplierquotes-editor/supplierquotes-editor.component';
import { SupplierQuotesExplorerComponent } from './supplierquotes-explorer/supplierquotes-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const supplierquotesRoutes: Routes = [
    {
        path: '', component: SupplierQuotesComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: SupplierQuotesExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: SupplierQuotesEditorComponent ,resolve: { permission: PermissionResolve }},
            { path: 'detail/:id', component: SupplierQuotesEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: SupplierQuotesEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(supplierquotesRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        SupplierQuotesComponent,
        SupplierQuotesEditorComponent,
        SupplierQuotesExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [SupplierQuotesComponent]
})

export class SupplierQuotesModule { }
