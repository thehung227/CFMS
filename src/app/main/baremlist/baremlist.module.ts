import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BaremListComponent } from './baremlist.component';
import { BaremListEditorComponent } from './baremlist-editor/baremlist-editor.component';
import { BaremListExplorerComponent } from './baremlist-explorer/baremlist-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const baremlistRoutes: Routes = [
    {
        path: '', component: BaremListComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BaremListExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BaremListEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BaremListEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: BaremListEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(baremlistRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        BaremListComponent,
        BaremListEditorComponent,
        BaremListExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BaremListComponent]
})

export class BaremListModule { }
