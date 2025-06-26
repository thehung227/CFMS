import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { MaterialMeUsageStatusComponent } from './materialmeusagestatus.component';
import { MaterialMeUsageStatusEditorComponent } from './materialmeusagestatus-editor/materialmeusagestatus-editor.component';
import { MaterialMeUsageStatusExplorerComponent } from './materialmeusagestatus-explorer/materialmeusagestatus-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { MaterialMeUsageStatusExplorerChildComponent } from './materialmeusagestatus-explorer/materialmeusagestatus-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const materialmeusagestatusRoutes: Routes = [
    {
        path: '', component: MaterialMeUsageStatusComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: MaterialMeUsageStatusExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: MaterialMeUsageStatusEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: MaterialMeUsageStatusEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: MaterialMeUsageStatusEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(materialmeusagestatusRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        MaterialMeUsageStatusComponent,
        MaterialMeUsageStatusEditorComponent,
        MaterialMeUsageStatusExplorerComponent,
        MaterialMeUsageStatusExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [MaterialMeUsageStatusComponent]
})

export class MaterialMeUsageStatusModule { }
