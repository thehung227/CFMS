import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ExaminationRecordsComponent } from './examinationrecords.component';
import { ExaminationRecordsEditorComponent } from './examinationrecords-editor/examinationrecords-editor.component';
import { ExaminationRecordsExplorerComponent } from './examinationrecords-explorer/examinationrecords-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { ExaminationRecordsExplorerChildComponent } from './examinationrecords-explorer/examinationrecords-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const examinationrecordsRoutes: Routes = [
    {
        path: '', component: ExaminationRecordsComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ExaminationRecordsExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ExaminationRecordsEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ExaminationRecordsEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ExaminationRecordsEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(examinationrecordsRoutes),
        UIModule,
        WjGridModule,
        WjGridDetailModule,        
        WjGridFilterModule
    ],
    declarations: [
        ExaminationRecordsComponent,
        ExaminationRecordsEditorComponent,
        ExaminationRecordsExplorerComponent,
        ExaminationRecordsExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ExaminationRecordsComponent]
})

export class ExaminationRecordsModule { }
