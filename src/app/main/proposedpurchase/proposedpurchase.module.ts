import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ProposedPurchaseComponent } from './proposedpurchase.component';
import { ProposedPurchaseEditorComponent } from './proposedpurchase-editor/proposedpurchase-editor.component';
import { ProposedPurchaseExplorerComponent } from './proposedpurchase-explorer/proposedpurchase-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const proposedpurchaseRoutes: Routes = [
    {
        path: '', component: ProposedPurchaseComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ProposedPurchaseExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ProposedPurchaseEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ProposedPurchaseEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ProposedPurchaseEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(proposedpurchaseRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        ProposedPurchaseComponent,
        ProposedPurchaseEditorComponent,
        ProposedPurchaseExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ProposedPurchaseComponent]
})

export class ProposedPurchaseModule { }
