import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PurchaseMeOtherBudgetComponent } from './purchasemeotherbudget.component';
import { PurchaseMeOtherBudgetEditorComponent } from './purchasemeotherbudget-editor/purchasemeotherbudget-editor.component';
import { PurchaseMeOtherBudgetExplorerComponent } from './purchasemeotherbudget-explorer/purchasemeotherbudget-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PurchaseMeOtherBudgetExplorerChildComponent } from './purchasemeotherbudget-explorer/purchasemeotherbudget-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const purchasemeotherbudgetRoutes: Routes = [
    {
        path: '', component: PurchaseMeOtherBudgetComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PurchaseMeOtherBudgetExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PurchaseMeOtherBudgetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PurchaseMeOtherBudgetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PurchaseMeOtherBudgetEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(purchasemeotherbudgetRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PurchaseMeOtherBudgetComponent,
        PurchaseMeOtherBudgetEditorComponent,
        PurchaseMeOtherBudgetExplorerComponent,
        PurchaseMeOtherBudgetExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PurchaseMeOtherBudgetComponent]
})

export class PurchaseMeOtherBudgetModule { }
