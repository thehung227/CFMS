import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PermissionCTCComponent } from './permissionCTC.component';
import { PermissionCTCEditorComponent } from './permissionCTC-editor/permissionCTC-editor.component';
import { PermissionCTCExplorerComponent } from './permissionCTC-explorer/permissionCTC-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const permissionCTCRoutes: Routes = [
    {
        path: '', component: PermissionCTCComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PermissionCTCExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PermissionCTCEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PermissionCTCEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PermissionCTCEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(permissionCTCRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        PermissionCTCComponent,
        PermissionCTCEditorComponent,
        PermissionCTCExplorerComponent,

    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PermissionCTCComponent]
})

export class PermissionCTCModule { }
