import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedConsDocumentComponent } from './approvedconsdocument.component';
import { ApprovedConsDocumentEditorComponent } from './approvedconsdocument-editor/approvedconsdocument-editor.component';
import { ApprovedConsDocumentExplorerComponent } from './approvedconsdocument-explorer/approvedconsdocument-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedconsdocumentRoutes: Routes = [
    {
        path: '', component: ApprovedConsDocumentComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedConsDocumentExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedConsDocumentEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedConsDocumentEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedconsdocumentRoutes),
        UIModule
    ],
    declarations: [
        ApprovedConsDocumentComponent,
        ApprovedConsDocumentEditorComponent,
        ApprovedConsDocumentExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedConsDocumentComponent]
})

export class ApprovedConsDocumentModule { }
