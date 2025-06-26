import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PurchaseOtherBudgetComponent } from './purchaseotherbudget.component';
import { PurchaseOtherBudgetEditorComponent } from './purchaseotherbudget-editor/purchaseotherbudget-editor.component';
import { PurchaseOtherBudgetExplorerComponent } from './purchaseotherbudget-explorer/purchaseotherbudget-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PurchaseOtherBudgetExplorerChildComponent } from './purchaseotherbudget-explorer/purchaseotherbudget-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const purchaseotherbudgetRoutes: Routes = [
    {
        path: '', component: PurchaseOtherBudgetComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PurchaseOtherBudgetExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PurchaseOtherBudgetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PurchaseOtherBudgetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PurchaseOtherBudgetEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(purchaseotherbudgetRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PurchaseOtherBudgetComponent,
        PurchaseOtherBudgetEditorComponent,
        PurchaseOtherBudgetExplorerComponent,
        PurchaseOtherBudgetExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PurchaseOtherBudgetComponent]
})

export class PurchaseOtherBudgetModule { }
