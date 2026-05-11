import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ProjectValueTableComponent } from './projectvaluetable.component';
import { ProjectValueTableEditorComponent } from './projectvaluetable-editor/projectvaluetable-editor.component';
import { ProjectValueTableExplorerComponent } from './projectvaluetable-explorer/projectvaluetable-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { ProjectValueTableExplorerChildComponent } from './projectvaluetable-explorer/projectvaluetable-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const projectvaluetableRoutes: Routes = [
    {
        path: '', component: ProjectValueTableComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ProjectValueTableExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ProjectValueTableEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ProjectValueTableEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ProjectValueTableEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(projectvaluetableRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        ProjectValueTableComponent,
        ProjectValueTableEditorComponent,
        ProjectValueTableExplorerComponent,
        ProjectValueTableExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ProjectValueTableComponent]
})

export class ProjectValueTableModule { }
