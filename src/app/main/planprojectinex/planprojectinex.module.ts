import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanProjectInExComponent } from './planprojectinex.component';
import { PlanProjectInExEditorComponent } from './planprojectinex-editor/planprojectinex-editor.component';
import { PlanProjectInExExplorerComponent } from './planprojectinex-explorer/planprojectinex-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PlanProjectInExExplorerChildComponent } from './planprojectinex-explorer/planprojectinex-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const planprojectinexRoutes: Routes = [
    {
        path: '', component: PlanProjectInExComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanProjectInExExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PlanProjectInExEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PlanProjectInExEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PlanProjectInExEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(planprojectinexRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PlanProjectInExComponent,
        PlanProjectInExEditorComponent,
        PlanProjectInExExplorerComponent,
        PlanProjectInExExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanProjectInExComponent]
})

export class PlanProjectInExModule { }
