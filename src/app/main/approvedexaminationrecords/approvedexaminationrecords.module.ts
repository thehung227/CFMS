import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedExaminationRecordsComponent } from './approvedexaminationrecords.component';
import { ApprovedExaminationRecordsEditorComponent } from './approvedexaminationrecords-editor/approvedexaminationrecords-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedexaminationrecordsRoutes: Routes = [
    {
        path: '', component: ApprovedExaminationRecordsComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedExaminationRecordsEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedExaminationRecordsEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedexaminationrecordsRoutes),
        UIModule
    ],
    declarations: [
        ApprovedExaminationRecordsComponent,
        ApprovedExaminationRecordsEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedExaminationRecordsComponent]
})

export class ApprovedExaminationRecordsModule { }
