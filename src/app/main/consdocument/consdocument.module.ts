import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ConsDocumentComponent } from './consdocument.component';
import { ConsDocumentEditorComponent } from './consdocument-editor/consdocument-editor.component';
import { ConsDocumentExplorerComponent } from './consdocument-explorer/consdocument-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const consdocumentRoutes: Routes = [
    {
        path: '', component: ConsDocumentComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ConsDocumentExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ConsDocumentEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ConsDocumentEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ConsDocumentEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(consdocumentRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        ConsDocumentComponent,
        ConsDocumentEditorComponent,
        ConsDocumentExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ConsDocumentComponent]
})

export class ConsDocumentModule { }
