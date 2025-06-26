import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { SteelLossComponent } from './steelloss.component';
import { SteelLossEditorComponent } from './steelloss-editor/steelloss-editor.component';
import { SteelLossExplorerComponent } from './steelloss-explorer/steelloss-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { SteelLossExplorerChildComponent } from './steelloss-explorer/steelloss-explorer-child.component';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const steellossRoutes: Routes = [
    {
        path: '', component: SteelLossComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: SteelLossExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: SteelLossEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: SteelLossEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(steellossRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        SteelLossComponent,
        SteelLossEditorComponent,
        SteelLossExplorerComponent,
        SteelLossExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [SteelLossComponent]
})

export class SteelLossModule { }
