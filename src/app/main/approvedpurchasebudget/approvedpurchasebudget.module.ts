import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedPurchaseBudgetComponent } from './approvedpurchasebudget.component';
import { ApprovedPurchaseBudgetEditorComponent } from './approvedpurchasebudget-editor/approvedpurchasebudget-editor.component';
import { ApprovedPurchaseBudgetExplorerComponent } from './approvedpurchasebudget-explorer/approvedpurchasebudget-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedpurchasebudgetRoutes: Routes = [
    {
        path: '', component: ApprovedPurchaseBudgetComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedPurchaseBudgetExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedPurchaseBudgetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedPurchaseBudgetEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedpurchasebudgetRoutes),
        UIModule
    ],
    declarations: [
        ApprovedPurchaseBudgetComponent,
        ApprovedPurchaseBudgetEditorComponent,
        ApprovedPurchaseBudgetExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedPurchaseBudgetComponent]
})

export class ApprovedPurchaseBudgetModule { }
