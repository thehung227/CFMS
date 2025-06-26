import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { DebtCollectionComponent } from './debtcollection.component';
import { DebtCollectionEditorComponent } from './debtcollection-editor/debtcollection-editor.component';
import { DebtCollectionExplorerComponent } from './debtcollection-explorer/debtcollection-explorer.component';
import { DebtCollectionPopupComponent } from '../debtcollection-popup/debtcollection-popup.component';
import { DebtCollectionPopupEditorComponent } from '../debtcollection-popup/debtcollection-popup-editor/debtcollection-popup-editor.component';
import { DebtCollection1PopupComponent } from '../debtcollection1-popup/debtcollection1-popup.component';
import { DebtCollection1PopupEditorComponent } from '../debtcollection1-popup/debtcollection1-popup-editor/debtcollection1-popup-editor.component';
import { DebtCollection2PopupComponent } from '../debtcollection2-popup/debtcollection2-popup.component';
import { DebtCollection2PopupEditorComponent } from '../debtcollection2-popup/debtcollection2-popup-editor/debtcollection2-popup-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { DebtCollectionExplorerChildComponent } from './debtcollection-explorer/debtcollection-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const debtcollectionRoutes: Routes = [
    {
        path: '', component: DebtCollectionComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: DebtCollectionExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: DebtCollectionEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: DebtCollectionEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: DebtCollectionEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(debtcollectionRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        DebtCollectionComponent,
        DebtCollectionEditorComponent,
        DebtCollectionExplorerComponent,
        DebtCollectionExplorerChildComponent,
        DebtCollectionPopupComponent,
        DebtCollectionPopupEditorComponent,
        DebtCollection1PopupComponent,
        DebtCollection1PopupEditorComponent,
        DebtCollection2PopupComponent,
        DebtCollection2PopupEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [DebtCollectionComponent]
})

export class DebtCollectionModule { }
