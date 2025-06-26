import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PurchasingNoteComponent } from './purchasingnote.component';
import { PurchasingNoteEditorComponent } from './purchasingnote-editor/purchasingnote-editor.component';
import { PurchasingNoteExplorerComponent } from './purchasingnote-explorer/purchasingnote-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { PurchasingNoteExplorerChildComponent } from './purchasingnote-explorer/purchasingnote-explorer-child.component';

const purchasingnoteRoutes: Routes = [
    {
        path: '', component: PurchasingNoteComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PurchasingNoteExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PurchasingNoteEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PurchasingNoteEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PurchasingNoteEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(purchasingnoteRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        PurchasingNoteComponent,
        PurchasingNoteEditorComponent,
        PurchasingNoteExplorerComponent,
        PurchasingNoteExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PurchasingNoteComponent]
})

export class PurchasingNoteModule { }
