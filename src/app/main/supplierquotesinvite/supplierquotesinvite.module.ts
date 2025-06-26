import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { SupplierQuotesInviteComponent } from './supplierquotesinvite.component';
import { SupplierQuotesInviteEditorComponent } from './supplierquotesinvite-editor/supplierquotesinvite-editor.component';
import { SupplierQuotesInviteExplorerComponent } from './supplierquotesinvite-explorer/supplierquotesinvite-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const supplierquotesinviteRoutes: Routes = [
    {
        path: '', component: SupplierQuotesInviteComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: SupplierQuotesInviteExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: SupplierQuotesInviteEditorComponent ,resolve: { permission: PermissionResolve }},
            { path: 'detail/:id', component: SupplierQuotesInviteEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: SupplierQuotesInviteEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(supplierquotesinviteRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        SupplierQuotesInviteComponent,
        SupplierQuotesInviteEditorComponent,
        SupplierQuotesInviteExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [SupplierQuotesInviteComponent]
})

export class SupplierQuotesInviteModule { }
