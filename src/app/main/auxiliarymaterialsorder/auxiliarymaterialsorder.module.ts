import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { AuxiliaryMaterialsOrderComponent } from './auxiliarymaterialsorder.component';
import { AuxiliaryMaterialsOrderEditorComponent } from './auxiliarymaterialsorder-editor/auxiliarymaterialsorder-editor.component';
import { AuxiliaryMaterialsOrderExplorerComponent } from './auxiliarymaterialsorder-explorer/auxiliarymaterialsorder-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { AuxiliaryMaterialsOrderExplorerChildComponent } from './auxiliarymaterialsorder-explorer/auxiliarymaterialsorder-explorer-child.component';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const auxiliarymaterialsorderRoutes: Routes = [
    {
        path: '', component: AuxiliaryMaterialsOrderComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: AuxiliaryMaterialsOrderExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: AuxiliaryMaterialsOrderEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: AuxiliaryMaterialsOrderEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(auxiliarymaterialsorderRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        AuxiliaryMaterialsOrderComponent,
        AuxiliaryMaterialsOrderEditorComponent,
        AuxiliaryMaterialsOrderExplorerComponent,
        AuxiliaryMaterialsOrderExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [AuxiliaryMaterialsOrderComponent]
})

export class AuxiliaryMaterialsOrderModule { }
