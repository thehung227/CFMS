import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { NotificationsComponent } from './notifications.component';
 import { NotificationsEditorComponent } from './notifications-editor/notifications-editor.component';
import { NotificationsExplorerComponent } from './notifications-explorer/notifications-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const notificationsRoutes: Routes = [
    {
        path: '', component: NotificationsComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: NotificationsExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: NotificationsEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: NotificationsEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(notificationsRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        NotificationsComponent,
        NotificationsEditorComponent,
        NotificationsExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [NotificationsComponent]
})

export class NotificationsModule { }
