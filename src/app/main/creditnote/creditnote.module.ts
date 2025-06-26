import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { CreditNoteComponent } from './creditnote.component';
import { CreditNoteEditorComponent } from './creditnote-editor/creditnote-editor.component';
import { CreditNoteExplorerComponent } from './creditnote-explorer/creditnote-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { CreditNoteExplorerChildComponent } from './creditnote-explorer/creditnote-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const creditnoteRoutes: Routes = [
    {
        path: '', component: CreditNoteComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: CreditNoteExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: CreditNoteEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: CreditNoteEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: CreditNoteEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(creditnoteRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        CreditNoteComponent,
        CreditNoteEditorComponent,
        CreditNoteExplorerComponent,
        CreditNoteExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [CreditNoteComponent]
})

export class CreditNoteModule { }
