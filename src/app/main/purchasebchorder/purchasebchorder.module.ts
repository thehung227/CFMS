import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PurchaseBchOrderComponent } from './purchasebchorder.component';
import { PurchaseBchOrderEditorComponent } from './purchasebchorder-editor/purchasebchorder-editor.component';
import { PurchaseBchOrderExplorerComponent } from './purchasebchorder-explorer/purchasebchorder-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PurchaseBchOrderExplorerChildComponent } from './purchasebchorder-explorer/purchasebchorder-explorer-child.component';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const purchasebchorderRoutes: Routes = [
    {
        path: '', component: PurchaseBchOrderComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PurchaseBchOrderExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PurchaseBchOrderEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PurchaseBchOrderEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(purchasebchorderRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        PurchaseBchOrderComponent,
        PurchaseBchOrderEditorComponent,
        PurchaseBchOrderExplorerComponent,
        PurchaseBchOrderExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PurchaseBchOrderComponent]
})

export class PurchaseBchOrderModule { }
