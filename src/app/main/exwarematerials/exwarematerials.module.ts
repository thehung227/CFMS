import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ExWareMaterialsComponent } from './exwarematerials.component';
import { ExWareMaterialsEditorComponent } from './exwarematerials-editor/exwarematerials-editor.component';
import { ExWareMaterialsExplorerComponent } from './exwarematerials-explorer/exwarematerials-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { ExWareMaterialsExplorerChildComponent } from './exwarematerials-explorer/exwarematerials-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { ExWareMaterialsPopupEditorComponent } from '../exwarematerials-popup/exwarematerials-popup-editor/exwarematerials-popup-editor.component';

const exwarematerialsRoutes: Routes = [
    {
        path: '', component: ExWareMaterialsComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ExWareMaterialsExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ExWareMaterialsEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ExWareMaterialsEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ExWareMaterialsEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(exwarematerialsRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        ExWareMaterialsComponent,
        ExWareMaterialsEditorComponent,
        ExWareMaterialsExplorerComponent,
        ExWareMaterialsExplorerChildComponent,
        ExWareMaterialsPopupEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ExWareMaterialsComponent]
})

export class ExWareMaterialsModule { }
