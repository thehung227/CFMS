import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { DebtCollection2PopupComponent } from './debtcollection2-popup.component';
import { DebtCollection2PopupEditorComponent } from './debtcollection2-popup-editor/debtcollection2-popup-editor.component';


import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const debtcollection2popupRoutes: Routes = [
    {
        path: '', component: DebtCollection2PopupComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            
            { path: 'detail', component: DebtCollection2PopupEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: DebtCollection2PopupEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(debtcollection2popupRoutes),
        UIModule
    ],
    declarations: [
        DebtCollection2PopupComponent,
        DebtCollection2PopupEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [DebtCollection2PopupComponent]
})

export class DebtCollection2PopupModule { }
