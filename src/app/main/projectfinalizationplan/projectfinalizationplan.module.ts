import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ProjectFinalizationPlanComponent } from './projectfinalizationplan.component';
import { ProjectFinalizationPlanEditorComponent } from './projectfinalizationplan-editor/projectfinalizationplan-editor.component';
import { ProjectFinalizationPlanExplorerComponent } from './projectfinalizationplan-explorer/projectfinalizationplan-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { ProjectFinalizationPlanExplorerChildComponent } from './projectfinalizationplan-explorer/projectfinalizationplan-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const projectfinalizationplanRoutes: Routes = [
    {
        path: '', component: ProjectFinalizationPlanComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ProjectFinalizationPlanExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ProjectFinalizationPlanEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ProjectFinalizationPlanEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ProjectFinalizationPlanEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(projectfinalizationplanRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        ProjectFinalizationPlanComponent,
        ProjectFinalizationPlanEditorComponent,
        ProjectFinalizationPlanExplorerComponent,
        ProjectFinalizationPlanExplorerChildComponent,
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ProjectFinalizationPlanComponent]
})

export class ProjectFinalizationPlanModule { }
