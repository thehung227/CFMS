import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { SolPPComponent } from './solpp.component';
import { SolPPEditorComponent } from './solpp-editor/solpp-editor.component';
import { SolPPExplorerComponent } from './solpp-explorer/solpp-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { SolPPExplorerChildComponent } from './solpp-explorer/solpp-explorer-child.component';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const solppRoutes: Routes = [
    {
        path: '', component: SolPPComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: SolPPExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: SolPPEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: SolPPEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(solppRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        SolPPComponent,
        SolPPEditorComponent,
        SolPPExplorerComponent,
        SolPPExplorerChildComponent,
        // SendMailComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [SolPPComponent]
})

export class SolPPModule { }
