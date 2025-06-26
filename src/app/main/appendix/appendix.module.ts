import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { AppendixComponent } from './appendix.component';
import { AppendixEditorComponent } from './appendix-editor/appendix-editor.component';
import { AppendixExplorerComponent } from './appendix-explorer/appendix-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { AppendixExplorerChildComponent } from './appendix-explorer/appendix-explorer-child.component';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const appendixRoutes: Routes = [
    {
        path: '', component: AppendixComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: AppendixExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: AppendixEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: AppendixEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(appendixRoutes),
        UIModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        AppendixComponent,
        AppendixEditorComponent,
        AppendixExplorerComponent,
        AppendixExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve

    ],
    exports: [AppendixComponent]
})

export class AppendixModule { }
