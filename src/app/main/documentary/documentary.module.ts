import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { DocumentaryComponent } from './documentary.component';
import { DocumentaryEditorComponent } from './documentary-editor/documentary-editor.component';
import { DocumentaryExplorerComponent } from './documentary-explorer/documentary-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { DocumentaryExplorerChildComponent } from './documentary-explorer/documentary-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const documentaryRoutes: Routes = [
    {
        path: '', component: DocumentaryComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: DocumentaryExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: DocumentaryEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: DocumentaryEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: DocumentaryEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(documentaryRoutes),
        UIModule,
        WjGridModule,
        WjGridDetailModule,        
        WjGridFilterModule
    ],
    declarations: [
        DocumentaryComponent,
        DocumentaryEditorComponent,
        DocumentaryExplorerComponent,
        DocumentaryExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [DocumentaryComponent]
})

export class DocumentaryModule { }
