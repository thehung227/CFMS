import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { MaterialUsageStatusComponent } from './materialusagestatus.component';
import { MaterialUsageStatusEditorComponent } from './materialusagestatus-editor/materialusagestatus-editor.component';
import { MaterialUsageStatusExplorerComponent } from './materialusagestatus-explorer/materialusagestatus-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { MaterialUsageStatusExplorerChildComponent } from './materialusagestatus-explorer/materialusagestatus-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const materialusagestatusRoutes: Routes = [
    {
        path: '', component: MaterialUsageStatusComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: MaterialUsageStatusExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: MaterialUsageStatusEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: MaterialUsageStatusEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: MaterialUsageStatusEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(materialusagestatusRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        MaterialUsageStatusComponent,
        MaterialUsageStatusEditorComponent,
        MaterialUsageStatusExplorerComponent,
        MaterialUsageStatusExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [MaterialUsageStatusComponent]
})

export class MaterialUsageStatusModule { }
