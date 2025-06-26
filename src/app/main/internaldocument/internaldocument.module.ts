import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { InternalDocumentComponent } from './internaldocument.component';
import { InternalDocumentEditorComponent } from './internaldocument-editor/internaldocument-editor.component';
import { InternalDocumentExplorerComponent } from './internaldocument-explorer/internaldocument-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { InternalDocumentExplorerChildComponent } from './internaldocument-explorer/internaldocument-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const internaldocumentRoutes: Routes = [
    {
        path: '', component: InternalDocumentComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: InternalDocumentExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: InternalDocumentEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: InternalDocumentEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: InternalDocumentEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(internaldocumentRoutes),
        UIModule,
        WjGridModule,
        WjGridDetailModule,        
        WjGridFilterModule
    ],
    declarations: [
        InternalDocumentComponent,
        InternalDocumentEditorComponent,
        InternalDocumentExplorerComponent,
        InternalDocumentExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [InternalDocumentComponent]
})

export class InternalDocumentModule { }
