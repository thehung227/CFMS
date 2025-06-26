import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { Settlement_DocComponent } from './settlement_doc.component';
import { Settlement_DocEditorComponent } from './settlement_doc-editor/settlement_doc-editor.component';
import { Settlement_DocExplorerComponent } from './settlement_doc-explorer/settlement_doc-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { Settlement_DocExplorerChildComponent } from './settlement_doc-explorer/settlement_doc-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const settlement_docRoutes: Routes = [
    {
        path: '', component: Settlement_DocComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: Settlement_DocExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: Settlement_DocEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: Settlement_DocEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(settlement_docRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        Settlement_DocComponent,
        Settlement_DocEditorComponent,
        Settlement_DocExplorerComponent,
        Settlement_DocExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [Settlement_DocComponent]
})

export class Settlement_DocModule { }
