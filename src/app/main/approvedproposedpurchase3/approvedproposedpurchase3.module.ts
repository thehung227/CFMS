import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedProposedPurchase3Component } from './approvedproposedpurchase3.component';
import { ApprovedProposedPurchase3ExplorerComponent } from './approvedproposedpurchase3-explorer/approvedproposedpurchase3-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { ApprovedProposedPurchase3EditorComponent } from './approvedproposedpurchase3-editor/approvedproposedpurchase3-editor.component';
import { PermissionResolve } from '../../base/resolver';

const approvedproposedpurchase3Routes: Routes = [
    {
        path: '', component: ApprovedProposedPurchase3Component,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedProposedPurchase3ExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedProposedPurchase3EditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedProposedPurchase3EditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ApprovedProposedPurchase3EditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedproposedpurchase3Routes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        ApprovedProposedPurchase3Component,
        ApprovedProposedPurchase3ExplorerComponent,
        ApprovedProposedPurchase3EditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedProposedPurchase3Component]
})

export class ApprovedProposedPurchase3Module { }
