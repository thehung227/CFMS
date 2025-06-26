import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedExWareMaterialsComponent } from './approvedexwarematerials.component';
import { ApprovedExWareMaterialsEditorComponent } from './approvedexwarematerials-editor/approvedexwarematerials-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedexwarematerialsRoutes: Routes = [
    {
        path: '', component: ApprovedExWareMaterialsComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedExWareMaterialsEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedExWareMaterialsEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedexwarematerialsRoutes),
        UIModule
    ],
    declarations: [
        ApprovedExWareMaterialsComponent,
        ApprovedExWareMaterialsEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedExWareMaterialsComponent]
})

export class ApprovedExWareMaterialsModule { }
