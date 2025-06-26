import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { FalnLocTaskComponent } from './falnloctask.component';
import { FalnLocTaskEditorComponent } from './falnloctask-editor/falnloctask-editor.component';
import { FalnLocTaskExplorerComponent } from './falnloctask-explorer/falnloctask-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { FalnLocTaskExplorerChildComponent } from './falnloctask-explorer/falnloctask-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const falnloctaskRoutes: Routes = [
    {
        path: '', component: FalnLocTaskComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: FalnLocTaskExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: FalnLocTaskEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: FalnLocTaskEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: FalnLocTaskEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(falnloctaskRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        FalnLocTaskComponent,
        FalnLocTaskEditorComponent,
        FalnLocTaskExplorerComponent,
        FalnLocTaskExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [FalnLocTaskComponent]
})

export class FalnLocTaskModule { }
