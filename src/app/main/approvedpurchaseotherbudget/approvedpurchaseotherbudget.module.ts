import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedPurchaseOtherBudgetComponent } from './approvedpurchaseotherbudget.component';
import { ApprovedPurchaseOtherBudgetEditorComponent } from './approvedpurchaseotherbudget-editor/approvedpurchaseotherbudget-editor.component';
import { ApprovedPurchaseOtherBudgetExplorerComponent } from './approvedpurchaseotherbudget-explorer/approvedpurchaseotherbudget-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedpurchaseotherbudgetRoutes: Routes = [
    {
        path: '', component: ApprovedPurchaseOtherBudgetComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedPurchaseOtherBudgetExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedPurchaseOtherBudgetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedPurchaseOtherBudgetEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedpurchaseotherbudgetRoutes),
        UIModule
    ],
    declarations: [
        ApprovedPurchaseOtherBudgetComponent,
        ApprovedPurchaseOtherBudgetEditorComponent,
        ApprovedPurchaseOtherBudgetExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedPurchaseOtherBudgetComponent]
})

export class ApprovedPurchaseOtherBudgetModule { }
