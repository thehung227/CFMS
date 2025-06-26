import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BOQInvestorClaimComponent } from './boqinvestorclaim.component';
import { BOQInvestorClaimEditorComponent } from './boqinvestorclaim-editor/boqinvestorclaim-editor.component';
import { BOQInvestorClaimExplorerComponent } from './boqinvestorclaim-explorer/boqinvestorclaim-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BOQInvestorClaimExplorerChildComponent } from './boqinvestorclaim-explorer/boqinvestorclaim-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const boqinvestorclaimRoutes: Routes = [
    {
        path: '', component: BOQInvestorClaimComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BOQInvestorClaimExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BOQInvestorClaimEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BOQInvestorClaimEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: BOQInvestorClaimEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(boqinvestorclaimRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        BOQInvestorClaimComponent,
        BOQInvestorClaimEditorComponent,
        BOQInvestorClaimExplorerComponent,
        BOQInvestorClaimExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BOQInvestorClaimComponent]
})

export class BOQInvestorClaimModule { }
