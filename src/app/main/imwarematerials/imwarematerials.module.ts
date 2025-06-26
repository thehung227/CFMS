import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ImWareMaterialsComponent } from './imwarematerials.component';
import { ImWareMaterialsEditorComponent } from './imwarematerials-editor/imwarematerials-editor.component';
import { ImWareMaterialsExplorerComponent } from './imwarematerials-explorer/imwarematerials-explorer.component';
import { ImWareMaterialsPopupComponent } from '../imwarematerials-popup/imwarematerials-popup.component';
import { ImWareMaterialsPopupEditorComponent } from '../imwarematerials-popup/imwarematerials-popup-editor/imwarematerials-popup-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { ImWareMaterialsExplorerChildComponent } from './imwarematerials-explorer/imwarematerials-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const imwarematerialsRoutes: Routes = [
    {
        path: '', component: ImWareMaterialsComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ImWareMaterialsExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ImWareMaterialsEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ImWareMaterialsEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ImWareMaterialsEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(imwarematerialsRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        ImWareMaterialsComponent,
        ImWareMaterialsEditorComponent,
        ImWareMaterialsExplorerComponent,
        ImWareMaterialsExplorerChildComponent,
        ImWareMaterialsPopupComponent,
        ImWareMaterialsPopupEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ImWareMaterialsComponent]
})

export class ImWareMaterialsModule { }
