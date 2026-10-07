import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { CcmPurchaseBudgetComponent } from './ccmpurchasebudget.component';
import { CcmPurchaseBudgetEditorComponent } from './ccmpurchasebudget-editor/ccmpurchasebudget-editor.component';
import { CcmPurchaseBudgetExplorerComponent } from './ccmpurchasebudget-explorer/ccmpurchasebudget-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { CcmPurchaseBudgetExplorerChildComponent } from './ccmpurchasebudget-explorer/ccmpurchasebudget-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const ccmpurchasebudgetRoutes: Routes = [
    {
        path: '', component: CcmPurchaseBudgetComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: CcmPurchaseBudgetExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: CcmPurchaseBudgetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: CcmPurchaseBudgetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: CcmPurchaseBudgetEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(ccmpurchasebudgetRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        CcmPurchaseBudgetComponent,
        CcmPurchaseBudgetEditorComponent,
        CcmPurchaseBudgetExplorerComponent,
        CcmPurchaseBudgetExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [CcmPurchaseBudgetComponent]
})

export class CcmPurchaseBudgetModule { }
