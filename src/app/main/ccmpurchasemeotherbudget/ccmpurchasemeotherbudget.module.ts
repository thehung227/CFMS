import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { CcmPurchaseMeOtherBudgetComponent } from './ccmpurchasemeotherbudget.component';
import { CcmPurchaseMeOtherBudgetEditorComponent } from './ccmpurchasemeotherbudget-editor/ccmpurchasemeotherbudget-editor.component';
import { CcmPurchaseMeOtherBudgetExplorerComponent } from './ccmpurchasemeotherbudget-explorer/ccmpurchasemeotherbudget-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { CcmPurchaseMeOtherBudgetExplorerChildComponent } from './ccmpurchasemeotherbudget-explorer/ccmpurchasemeotherbudget-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const ccmpurchasemeotherbudgetRoutes: Routes = [
    {
        path: '', component: CcmPurchaseMeOtherBudgetComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: CcmPurchaseMeOtherBudgetExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: CcmPurchaseMeOtherBudgetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: CcmPurchaseMeOtherBudgetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: CcmPurchaseMeOtherBudgetEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(ccmpurchasemeotherbudgetRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        CcmPurchaseMeOtherBudgetComponent,
        CcmPurchaseMeOtherBudgetEditorComponent,
        CcmPurchaseMeOtherBudgetExplorerComponent,
        CcmPurchaseMeOtherBudgetExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [CcmPurchaseMeOtherBudgetComponent]
})

export class CcmPurchaseMeOtherBudgetModule { }
