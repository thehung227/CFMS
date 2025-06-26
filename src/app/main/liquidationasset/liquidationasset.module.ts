import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { LiquidationAssetComponent } from './liquidationasset.component';
import { LiquidationAssetEditorComponent } from './liquidationasset-editor/liquidationasset-editor.component';
import { LiquidationAssetExplorerComponent } from './liquidationasset-explorer/liquidationasset-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { LiquidationAssetExplorerChildComponent } from './liquidationasset-explorer/liquidationasset-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const liquidationassetRoutes: Routes = [
    {
        path: '', component: LiquidationAssetComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: LiquidationAssetExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: LiquidationAssetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: LiquidationAssetEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: LiquidationAssetEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(liquidationassetRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        LiquidationAssetComponent,
        LiquidationAssetEditorComponent,
        LiquidationAssetExplorerComponent,
        LiquidationAssetExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [LiquidationAssetComponent]
})

export class LiquidationAssetModule { }
