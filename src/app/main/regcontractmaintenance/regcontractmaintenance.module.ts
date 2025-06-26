import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { RegContractMaintenanceComponent } from './regcontractmaintenance.component';
import { RegContractMaintenanceEditorComponent } from './regcontractmaintenance-editor/regcontractmaintenance-editor.component';
import { RegAppendixMaintenanceEditorComponent } from './regappendixmaintenance-editor/regappendixmaintenance-editor.component';
import { RegContractMaintenanceExplorerComponent } from './regcontractmaintenance-explorer/regcontractmaintenance-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { RegContractMaintenanceExplorerChildComponent } from './regcontractmaintenance-explorer/regcontractmaintenance-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const regcontractmaintenanceRoutes: Routes = [
    {
        path: '', component: RegContractMaintenanceComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: RegContractMaintenanceExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc3', component: RegContractMaintenanceEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc3/:id', component: RegContractMaintenanceEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc3/:id/:params', component: RegContractMaintenanceEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc4', component: RegAppendixMaintenanceEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc4/:id', component: RegAppendixMaintenanceEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detailc4/:id/:params', component: RegAppendixMaintenanceEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(regcontractmaintenanceRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        RegContractMaintenanceComponent,
        RegContractMaintenanceEditorComponent,
        RegAppendixMaintenanceEditorComponent,
        RegContractMaintenanceExplorerComponent,
        RegContractMaintenanceExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [RegContractMaintenanceComponent]
})

export class RegContractMaintenanceModule { }
