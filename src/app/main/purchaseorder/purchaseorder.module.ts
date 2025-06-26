import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PurchaseOrderComponent } from './purchaseorder.component';
import { PurchaseOrderEditorComponent } from './purchaseorder-editor/purchaseorder-editor.component';
import { PurchaseOrderExplorerComponent } from './purchaseorder-explorer/purchaseorder-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PurchaseOrderExplorerChildComponent } from './purchaseorder-explorer/purchaseorder-explorer-child.component';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const purchaseorderRoutes: Routes = [
    {
        path: '', component: PurchaseOrderComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PurchaseOrderExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PurchaseOrderEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PurchaseOrderEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(purchaseorderRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        PurchaseOrderComponent,
        PurchaseOrderEditorComponent,
        PurchaseOrderExplorerComponent,
        PurchaseOrderExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PurchaseOrderComponent]
})

export class PurchaseOrderModule { }
