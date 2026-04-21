import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ConcreteBudgetComponent } from './concretebudget.component';
import { ConcreteBudgetEditorComponent } from './concretebudget-editor/concretebudget-editor.component';
import { ConcreteBudgetExplorerComponent } from './concretebudget-explorer/concretebudget-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { ConcreteBudgetExplorerChildComponent } from './concretebudget-explorer/concretebudget-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const concretebudgetRoutes: Routes = [
    {
        path: '', component: ConcreteBudgetComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ConcreteBudgetExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ConcreteBudgetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ConcreteBudgetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ConcreteBudgetEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(concretebudgetRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        ConcreteBudgetComponent,
        ConcreteBudgetEditorComponent,
        ConcreteBudgetExplorerComponent,
        ConcreteBudgetExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ConcreteBudgetComponent]
})

export class ConcreteBudgetModule { }
