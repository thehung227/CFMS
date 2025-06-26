import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PermissionComponent } from './permission.component';
import { PermissionEditorComponent } from './permission-editor/permission-editor.component';
import { PermissionExplorerComponent } from './permission-explorer/permission-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const permissionRoutes: Routes = [
    {
        path: '', component: PermissionComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PermissionExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PermissionEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PermissionEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PermissionEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(permissionRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        PermissionComponent,
        PermissionEditorComponent,
        PermissionExplorerComponent,

    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PermissionComponent]
})

export class PermissionModule { }
