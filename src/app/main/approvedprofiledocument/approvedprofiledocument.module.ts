import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedProfileDocumentComponent } from './approvedprofiledocument.component';
import { ApprovedProfileDocumentEditorComponent } from './approvedprofiledocument-editor/approvedprofiledocument-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedprofiledocumentRoutes: Routes = [
    {
        path: '', component: ApprovedProfileDocumentComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedProfileDocumentEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedProfileDocumentEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedprofiledocumentRoutes),
        UIModule
    ],
    declarations: [
        ApprovedProfileDocumentComponent,
        ApprovedProfileDocumentEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedProfileDocumentComponent]
})

export class ApprovedProfileDocumentModule { }
