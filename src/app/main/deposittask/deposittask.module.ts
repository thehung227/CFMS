import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { DepositTaskComponent } from './deposittask.component';
import { DepositTaskEditorComponent } from './deposittask-editor/deposittask-editor.component';
import { DepositTaskExplorerComponent } from './deposittask-explorer/deposittask-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { DepositTaskExplorerChildComponent } from './deposittask-explorer/deposittask-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const deposittaskRoutes: Routes = [
    {
        path: '', component: DepositTaskComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: DepositTaskExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: DepositTaskEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: DepositTaskEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: DepositTaskEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(deposittaskRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        DepositTaskComponent,
        DepositTaskEditorComponent,
        DepositTaskExplorerComponent,
        DepositTaskExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [DepositTaskComponent]
})

export class DepositTaskModule { }
