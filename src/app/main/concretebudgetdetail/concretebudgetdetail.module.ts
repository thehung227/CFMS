import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ConcreteBudgetDetailComponent } from './concretebudgetdetail.component';
import { ConcreteBudgetDetailEditorComponent } from './concretebudgetdetail-editor/concretebudgetdetail-editor.component';
import { ConcreteBudgetDetailExplorerComponent } from './concretebudgetdetail-explorer/concretebudgetdetail-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { ConcreteBudgetDetailExplorerChildComponent } from './concretebudgetdetail-explorer/concretebudgetdetail-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const concretebudgetdetailRoutes: Routes = [
    {
        path: '', component: ConcreteBudgetDetailComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ConcreteBudgetDetailExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ConcreteBudgetDetailEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ConcreteBudgetDetailEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ConcreteBudgetDetailEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(concretebudgetdetailRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        ConcreteBudgetDetailComponent,
        ConcreteBudgetDetailEditorComponent,
        ConcreteBudgetDetailExplorerComponent,
        ConcreteBudgetDetailExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ConcreteBudgetDetailComponent]
})

export class ConcreteBudgetDetailModule { }
