import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedInternalSysDocumentComponent } from './approvedinternalsysdocument.component';
import { ApprovedInternalSysDocumentEditorComponent } from './approvedinternalsysdocument-editor/approvedinternalsysdocument-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedinternalsysdocumentRoutes: Routes = [
    {
        path: '', component: ApprovedInternalSysDocumentComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedInternalSysDocumentEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedInternalSysDocumentEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedinternalsysdocumentRoutes),
        UIModule
    ],
    declarations: [
        ApprovedInternalSysDocumentComponent,
        ApprovedInternalSysDocumentEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedInternalSysDocumentComponent]
})

export class ApprovedInternalSysDocumentModule { }
