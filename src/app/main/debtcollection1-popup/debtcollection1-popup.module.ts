import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { DebtCollection1PopupComponent } from './debtcollection1-popup.component';
import { DebtCollection1PopupEditorComponent } from './debtcollection1-popup-editor/debtcollection1-popup-editor.component';


import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const debtcollection1popupRoutes: Routes = [
    {
        path: '', component: DebtCollection1PopupComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            
            { path: 'detail', component: DebtCollection1PopupEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: DebtCollection1PopupEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(debtcollection1popupRoutes),
        UIModule
    ],
    declarations: [
        DebtCollection1PopupComponent,
        DebtCollection1PopupEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [DebtCollection1PopupComponent]
})

export class DebtCollection1PopupModule { }
