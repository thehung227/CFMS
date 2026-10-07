import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { CcmPurchaseOtherBudgetComponent } from './ccmpurchaseotherbudget.component';
import { CcmPurchaseOtherBudgetEditorComponent } from './ccmpurchaseotherbudget-editor/ccmpurchaseotherbudget-editor.component';
import { CcmPurchaseOtherBudgetExplorerComponent } from './ccmpurchaseotherbudget-explorer/ccmpurchaseotherbudget-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { CcmPurchaseOtherBudgetExplorerChildComponent } from './ccmpurchaseotherbudget-explorer/ccmpurchaseotherbudget-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const ccmpurchaseotherbudgetRoutes: Routes = [
    {
        path: '', component: CcmPurchaseOtherBudgetComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: CcmPurchaseOtherBudgetExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: CcmPurchaseOtherBudgetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: CcmPurchaseOtherBudgetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: CcmPurchaseOtherBudgetEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(ccmpurchaseotherbudgetRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        CcmPurchaseOtherBudgetComponent,
        CcmPurchaseOtherBudgetEditorComponent,
        CcmPurchaseOtherBudgetExplorerComponent,
        CcmPurchaseOtherBudgetExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [CcmPurchaseOtherBudgetComponent]
})

export class CcmPurchaseOtherBudgetModule { }
