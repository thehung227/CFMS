import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { DocumentViewComponent } from './documentview.component';
import { DocumentViewEditorComponent } from './documentview-editor/documentview-editor.component';
import { DocumentViewExplorerComponent } from './documentview-explorer/documentview-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const documentviewRoutes: Routes = [
    {
        path: '', component: DocumentViewComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: DocumentViewExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: DocumentViewEditorComponent,resolve: { permission: PermissionResolve } },
            // { path: 'detail/:id', component: DocumentViewEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:params', component: DocumentViewEditorComponent,resolve: { permission: PermissionResolve } },
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(documentviewRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        DocumentViewComponent,
        DocumentViewEditorComponent,
        DocumentViewExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [DocumentViewComponent]
})

export class DocumentViewModule { }
