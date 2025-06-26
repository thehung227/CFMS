import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { EquiBudgetM5Component } from './equibudgetm5.component';
import { EquiBudgetM5EditorComponent } from './equibudgetm5-editor/equibudgetm5-editor.component';
import { EquiBudgetM5ExplorerComponent } from './equibudgetm5-explorer/equibudgetm5-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { EquiBudgetM5ExplorerChildComponent } from './equibudgetm5-explorer/equibudgetm5-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const equibudgetm5Routes: Routes = [
    {
        path: '', component: EquiBudgetM5Component,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: EquiBudgetM5ExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: EquiBudgetM5EditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: EquiBudgetM5EditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: EquiBudgetM5EditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(equibudgetm5Routes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        EquiBudgetM5Component,
        EquiBudgetM5EditorComponent,
        EquiBudgetM5ExplorerComponent,
        EquiBudgetM5ExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [EquiBudgetM5Component]
})

export class EquiBudgetM5Module { }
