import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ImWareMaterialsPopupComponent } from './imwarematerials-popup.component';
import { ImWareMaterialsPopupEditorComponent } from './imwarematerials-popup-editor/imwarematerials-popup-editor.component';


import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const imwarematerialspopupRoutes: Routes = [
    {
        path: '', component: ImWareMaterialsPopupComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            
            { path: 'detail', component: ImWareMaterialsPopupEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ImWareMaterialsPopupEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(imwarematerialspopupRoutes),
        UIModule
    ],
    declarations: [
        ImWareMaterialsPopupComponent,
        ImWareMaterialsPopupEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ImWareMaterialsPopupComponent]
})

export class ImWareMaterialsPopupModule { }
