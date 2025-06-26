import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BOQInvestorComponent } from './boqinvestor.component';
import { BOQInvestorEditorComponent } from './boqinvestor-editor/boqinvestor-editor.component';
import { BOQInvestorExplorerComponent } from './boqinvestor-explorer/boqinvestor-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BOQInvestorExplorerChildComponent } from './boqinvestor-explorer/boqinvestor-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const boqinvestorRoutes: Routes = [
    {
        path: '', component: BOQInvestorComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BOQInvestorExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BOQInvestorEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BOQInvestorEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: BOQInvestorEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(boqinvestorRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        BOQInvestorComponent,
        BOQInvestorEditorComponent,
        BOQInvestorExplorerComponent,
        BOQInvestorExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BOQInvestorComponent]
})

export class BOQInvestorModule { }
