import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ExAuxiliarySuppliesComponent } from './exauxiliarysupplies.component';
import { ExAuxiliarySuppliesEditorComponent } from './exauxiliarysupplies-editor/exauxiliarysupplies-editor.component';
import { ExAuxiliarySuppliesExplorerComponent } from './exauxiliarysupplies-explorer/exauxiliarysupplies-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { ExAuxiliarySuppliesExplorerChildComponent } from './exauxiliarysupplies-explorer/exauxiliarysupplies-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const exauxiliarysuppliesRoutes: Routes = [
    {
        path: '', component: ExAuxiliarySuppliesComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ExAuxiliarySuppliesExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ExAuxiliarySuppliesEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ExAuxiliarySuppliesEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ExAuxiliarySuppliesEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(exauxiliarysuppliesRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        ExAuxiliarySuppliesComponent,
        ExAuxiliarySuppliesEditorComponent,
        ExAuxiliarySuppliesExplorerComponent,
        ExAuxiliarySuppliesExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ExAuxiliarySuppliesComponent]
})

export class ExAuxiliarySuppliesModule { }
