import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { SupportLLTCComponent } from './supportlltc.component';
import { SupportLLTCEditorComponent } from './supportlltc-editor/supportlltc-editor.component';
import { SupportLLTCExplorerComponent } from './supportlltc-explorer/supportlltc-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { SupportLLTCExplorerChildComponent } from './supportlltc-explorer/supportlltc-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const supportlltcRoutes: Routes = [
    {
        path: '', component: SupportLLTCComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: SupportLLTCExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: SupportLLTCEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: SupportLLTCEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: SupportLLTCEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(supportlltcRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        SupportLLTCComponent,
        SupportLLTCEditorComponent,
        SupportLLTCExplorerComponent,
        SupportLLTCExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [SupportLLTCComponent]
})

export class SupportLLTCModule { }
