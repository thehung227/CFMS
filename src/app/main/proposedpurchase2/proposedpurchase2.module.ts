import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ProposedPurchase2Component } from './proposedpurchase2.component';
import { ProposedPurchase2EditorComponent } from './proposedpurchase2-editor/proposedpurchase2-editor.component';
import { ProposedPurchase2ExplorerComponent } from './proposedpurchase2-explorer/proposedpurchase2-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { ProposedPurchase2ExplorerChildComponent } from './proposedpurchase2-explorer/proposedpurchase2-explorer-child.component';
import { PermissionResolve } from '../../base/resolver';

const proposedpurchase2Routes: Routes = [
    {
        path: '', component: ProposedPurchase2Component,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ProposedPurchase2ExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ProposedPurchase2EditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ProposedPurchase2EditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ProposedPurchase2EditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(proposedpurchase2Routes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        ProposedPurchase2Component,
        ProposedPurchase2EditorComponent,
        ProposedPurchase2ExplorerComponent,
        ProposedPurchase2ExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ProposedPurchase2Component]
})

export class ProposedPurchase2Module { }
