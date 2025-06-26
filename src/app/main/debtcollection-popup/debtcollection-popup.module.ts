import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { DebtCollectionPopupComponent } from './debtcollection-popup.component';
import { DebtCollectionPopupEditorComponent } from './debtcollection-popup-editor/debtcollection-popup-editor.component';


import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const debtcollectionpopupRoutes: Routes = [
    {
        path: '', component: DebtCollectionPopupComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            
            { path: 'detail', component: DebtCollectionPopupEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: DebtCollectionPopupEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(debtcollectionpopupRoutes),
        UIModule
    ],
    declarations: [
        DebtCollectionPopupComponent,
        DebtCollectionPopupEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [DebtCollectionPopupComponent]
})

export class DebtCollectionPopupModule { }
