import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { UNCComponent } from './unc.component';
import { UNCEditorComponent } from './unc-editor/unc-editor.component';
import { UNCExplorerComponent } from './unc-explorer/unc-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { UNCExplorerChildComponent } from './unc-explorer/unc-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const uncRoutes: Routes = [
    {
        path: '', component: UNCComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: UNCExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: UNCEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: UNCEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: UNCEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(uncRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        UNCComponent,
        UNCEditorComponent,
        UNCExplorerComponent,
        UNCExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [UNCComponent]
})

export class UNCModule { }
