import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { CcmConcreteBudgetComponent } from './ccmconcretebudget.component';
import { CcmConcreteBudgetEditorComponent } from './ccmconcretebudget-editor/ccmconcretebudget-editor.component';
import { CcmConcreteBudgetExplorerComponent } from './ccmconcretebudget-explorer/ccmconcretebudget-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { CcmConcreteBudgetExplorerChildComponent } from './ccmconcretebudget-explorer/ccmconcretebudget-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const ccmconcretebudgetRoutes: Routes = [
    {
        path: '', component: CcmConcreteBudgetComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: CcmConcreteBudgetExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: CcmConcreteBudgetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: CcmConcreteBudgetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: CcmConcreteBudgetEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(ccmconcretebudgetRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        CcmConcreteBudgetComponent,
        CcmConcreteBudgetEditorComponent,
        CcmConcreteBudgetExplorerComponent,
        CcmConcreteBudgetExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [CcmConcreteBudgetComponent]
})

export class CcmConcreteBudgetModule { }
