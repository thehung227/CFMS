import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { AuxiliaryMaterialsBugetComponent } from './auxiliarymaterialsbuget.component';
import { AuxiliaryMaterialsBugetEditorComponent } from './auxiliarymaterialsbuget-editor/auxiliarymaterialsbuget-editor.component';
import { AuxiliaryMaterialsBugetExplorerComponent } from './auxiliarymaterialsbuget-explorer/auxiliarymaterialsbuget-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { AuxiliaryMaterialsBugetExplorerChildComponent } from './auxiliarymaterialsbuget-explorer/auxiliarymaterialsbuget-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const auxiliarymaterialsbugetRoutes: Routes = [
    {
        path: '', component: AuxiliaryMaterialsBugetComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: AuxiliaryMaterialsBugetExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: AuxiliaryMaterialsBugetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: AuxiliaryMaterialsBugetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: AuxiliaryMaterialsBugetEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(auxiliarymaterialsbugetRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        AuxiliaryMaterialsBugetComponent,
        AuxiliaryMaterialsBugetEditorComponent,
        AuxiliaryMaterialsBugetExplorerComponent,
        AuxiliaryMaterialsBugetExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [AuxiliaryMaterialsBugetComponent]
})

export class AuxiliaryMaterialsBugetModule { }
