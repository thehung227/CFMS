import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { SafePunishComponent } from './safepunish.component';
import { SafePunishEditorComponent } from './safepunish-editor/safepunish-editor.component';
import { SafePunishExplorerComponent } from './safepunish-explorer/safepunish-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { SafePunishExplorerChildComponent } from './safepunish-explorer/safepunish-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const safepunishRoutes: Routes = [
    {
        path: '', component: SafePunishComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: SafePunishExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: SafePunishEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: SafePunishEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: SafePunishEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(safepunishRoutes),
        UIModule,
        WjGridModule,
        WjGridDetailModule,        
        WjGridFilterModule
    ],
    declarations: [
        SafePunishComponent,
        SafePunishEditorComponent,
        SafePunishExplorerComponent,
        SafePunishExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [SafePunishComponent]
})

export class SafePunishModule { }
