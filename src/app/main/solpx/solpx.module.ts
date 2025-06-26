import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { SolPXComponent } from './solpx.component';
import { SolPXEditorComponent } from './solpx-editor/solpx-editor.component';
import { SolPXExplorerComponent } from './solpx-explorer/solpx-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { SolPXExplorerChildComponent } from './solpx-explorer/solpx-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const solpxRoutes: Routes = [
    {
        path: '', component: SolPXComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: SolPXExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: SolPXEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: SolPXEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: SolPXEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(solpxRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        SolPXComponent,
        SolPXEditorComponent,
        SolPXExplorerComponent,
        SolPXExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [SolPXComponent]
})

export class SolPXModule { }
