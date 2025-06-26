import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PurchaseOtherOrderComponent } from './purchaseotherorder.component';
import { PurchaseOtherOrderEditorComponent } from './purchaseotherorder-editor/purchaseotherorder-editor.component';
import { PurchaseOtherOrderExplorerComponent } from './purchaseotherorder-explorer/purchaseotherorder-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PurchaseOtherOrderExplorerChildComponent } from './purchaseotherorder-explorer/purchaseotherorder-explorer-child.component';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const purchaseotherorderRoutes: Routes = [
    {
        path: '', component: PurchaseOtherOrderComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PurchaseOtherOrderExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PurchaseOtherOrderEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PurchaseOtherOrderEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(purchaseotherorderRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        PurchaseOtherOrderComponent,
        PurchaseOtherOrderEditorComponent,
        PurchaseOtherOrderExplorerComponent,
        PurchaseOtherOrderExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PurchaseOtherOrderComponent]
})

export class PurchaseOtherOrderModule { }
