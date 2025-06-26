import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ProposedPurchase3Component } from './proposedpurchase3.component';
import { ProposedPurchase3ExplorerComponent } from './proposedpurchase3-explorer/proposedpurchase3-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { ProposedPurchase3ExplorerChildComponent } from './proposedpurchase3-explorer/proposedpurchase3-explorer-child.component';
import { ProposedPurchase3EditorComponent } from './proposedpurchase3-editor/proposedpurchase3-editor.component';
import { PermissionResolve } from '../../base/resolver';

const proposedpurchase3Routes: Routes = [
    {
        path: '', component: ProposedPurchase3Component,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ProposedPurchase3ExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ProposedPurchase3EditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ProposedPurchase3EditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ProposedPurchase3EditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(proposedpurchase3Routes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        ProposedPurchase3Component,
        ProposedPurchase3ExplorerComponent,
        ProposedPurchase3ExplorerChildComponent,
        ProposedPurchase3EditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ProposedPurchase3Component]
})

export class ProposedPurchase3Module { }
