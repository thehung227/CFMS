import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { SettlementAttachComponent } from './settlementattach.component';
import { SettlementAttachEditorComponent } from './settlementattach-editor/settlementattach-editor.component';
import { SettlementAttachExplorerComponent } from './settlementattach-explorer/settlementattach-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { SettlementAttachExplorerChildComponent } from './settlementattach-explorer/settlementattach-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const settlementattachRoutes: Routes = [
    {
        path: '', component: SettlementAttachComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: SettlementAttachExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: SettlementAttachEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: SettlementAttachEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: SettlementAttachEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(settlementattachRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        SettlementAttachComponent,
        SettlementAttachEditorComponent,
        SettlementAttachExplorerComponent,
        SettlementAttachExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [SettlementAttachComponent]
})

export class SettlementAttachModule { }
