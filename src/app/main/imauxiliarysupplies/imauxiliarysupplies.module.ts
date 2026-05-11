import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ImAuxiliarySuppliesComponent } from './imauxiliarysupplies.component';
import { ImAuxiliarySuppliesEditorComponent } from './imauxiliarysupplies-editor/imauxiliarysupplies-editor.component';
import { ImAuxiliarySuppliesExplorerComponent } from './imauxiliarysupplies-explorer/imauxiliarysupplies-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { ImAuxiliarySuppliesExplorerChildComponent } from './imauxiliarysupplies-explorer/imauxiliarysupplies-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const imauxiliarysuppliesRoutes: Routes = [
    {
        path: '', component: ImAuxiliarySuppliesComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ImAuxiliarySuppliesExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ImAuxiliarySuppliesEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ImAuxiliarySuppliesEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ImAuxiliarySuppliesEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(imauxiliarysuppliesRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        ImAuxiliarySuppliesComponent,
        ImAuxiliarySuppliesEditorComponent,
        ImAuxiliarySuppliesExplorerComponent,
        ImAuxiliarySuppliesExplorerChildComponent,
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ImAuxiliarySuppliesComponent]
})

export class ImAuxiliarySuppliesModule { }
