import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { SolPNComponent } from './solpn.component';
import { SolPNEditorComponent } from './solpn-editor/solpn-editor.component';
import { SolPNExplorerComponent } from './solpn-explorer/solpn-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { SolPNExplorerChildComponent } from './solpn-explorer/solpn-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const solpnRoutes: Routes = [
    {
        path: '', component: SolPNComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: SolPNExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: SolPNEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: SolPNEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: SolPNEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(solpnRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        SolPNComponent,
        SolPNEditorComponent,
        SolPNExplorerComponent,
        SolPNExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [SolPNComponent]
})

export class SolPNModule { }
