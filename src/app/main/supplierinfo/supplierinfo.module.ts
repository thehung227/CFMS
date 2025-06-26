import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { SupplierInfoComponent } from './supplierinfo.component';
import { SupplierInfoEditorComponent } from './supplierinfo-editor/supplierinfo-editor.component';
import { SupplierInfoExplorerComponent } from './supplierinfo-explorer/supplierinfo-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const supplierinfoRoutes: Routes = [
    {
        path: '', component: SupplierInfoComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: SupplierInfoExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: SupplierInfoEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: SupplierInfoEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: SupplierInfoEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(supplierinfoRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        SupplierInfoComponent,
        SupplierInfoEditorComponent,
        SupplierInfoExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [SupplierInfoComponent]
})

export class SupplierInfoModule { }
