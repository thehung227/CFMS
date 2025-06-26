import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { Notifications_TmComponent } from './notifications_tm.component';
// import { Notifications_TmEditorComponent } from './notifications_tm-editor/notifications_tm-editor.component';
import { Notifications_TmExplorerComponent } from './notifications_tm-explorer/notifications_tm-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const notifications_tmRoutes: Routes = [
    {
        path: '', component: Notifications_TmComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: Notifications_TmExplorerComponent,resolve: { permission: PermissionResolve } },
            // { path: 'detail', component: Notifications_TmEditorComponent,resolve: { permission: PermissionResolve } },
            // { path: 'detail/:id', component: Notifications_TmEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(notifications_tmRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        Notifications_TmComponent,
        // Notifications_TmEditorComponent,
        Notifications_TmExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [Notifications_TmComponent]
})

export class Notifications_TmModule { }
