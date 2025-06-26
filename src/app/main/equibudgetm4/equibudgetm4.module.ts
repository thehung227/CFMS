import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { EquiBudgetM4Component } from './equibudgetm4.component';
import { EquiBudgetM4EditorComponent } from './equibudgetm4-editor/equibudgetm4-editor.component';
import { EquiBudgetM4ExplorerComponent } from './equibudgetm4-explorer/equibudgetm4-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { EquiBudgetM4ExplorerChildComponent } from './equibudgetm4-explorer/equibudgetm4-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const equibudgetm4Routes: Routes = [
    {
        path: '', component: EquiBudgetM4Component,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: EquiBudgetM4ExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: EquiBudgetM4EditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: EquiBudgetM4EditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: EquiBudgetM4EditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(equibudgetm4Routes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        EquiBudgetM4Component,
        EquiBudgetM4EditorComponent,
        EquiBudgetM4ExplorerComponent,
        EquiBudgetM4ExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [EquiBudgetM4Component]
})

export class EquiBudgetM4Module { }
