import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ExWareMaterialsPopupComponent } from './exwarematerials-popup.component';
import { ExWareMaterialsPopupEditorComponent } from './exwarematerials-popup-editor/exwarematerials-popup-editor.component';


import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const exwarematerialspopupRoutes: Routes = [
    {
        path: '', component: ExWareMaterialsPopupComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            
            { path: 'detail', component: ExWareMaterialsPopupEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ExWareMaterialsPopupEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(exwarematerialspopupRoutes),
        UIModule
    ],
    declarations: [
        ExWareMaterialsPopupComponent,
        ExWareMaterialsPopupEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ExWareMaterialsPopupComponent]
})

export class ExWareMaterialsPopupModule { }
