import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ProfileDocumentComponent } from './profiledocument.component';
import { ProfileDocumentEditorComponent } from './profiledocument-editor/profiledocument-editor.component';
import { ProfileDocumentExplorerComponent } from './profiledocument-explorer/profiledocument-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { ProfileDocumentExplorerChildComponent } from './profiledocument-explorer/profiledocument-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const profiledocumentRoutes: Routes = [
    {
        path: '', component: ProfileDocumentComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ProfileDocumentExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ProfileDocumentEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ProfileDocumentEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ProfileDocumentEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(profiledocumentRoutes),
        UIModule,
        WjGridModule,
        WjGridDetailModule,        
        WjGridFilterModule
    ],
    declarations: [
        ProfileDocumentComponent,
        ProfileDocumentEditorComponent,
        ProfileDocumentExplorerComponent,
        ProfileDocumentExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ProfileDocumentComponent]
})

export class ProfileDocumentModule { }
