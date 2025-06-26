import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ProjectListComponent } from './projectlist.component';
import { ProjectListEditorComponent } from './projectlist-editor/projectlist-editor.component';
import { ProjectListExplorerComponent } from './projectlist-explorer/projectlist-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const projectlistRoutes: Routes = [
    {
        path: '', component: ProjectListComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ProjectListExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ProjectListEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ProjectListEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ProjectListEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(projectlistRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        ProjectListComponent,
        ProjectListEditorComponent,
        ProjectListExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ProjectListComponent]
})

export class ProjectListModule { }
