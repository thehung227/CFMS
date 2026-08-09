import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanQuantity2Component } from './planquantity2.component';
import { PlanQuantity2EditorComponent } from './planquantity2-editor/planquantity2-editor.component';
import { PlanQuantity2ExplorerComponent } from './planquantity2-explorer/planquantity2-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PlanQuantity2ExplorerChildComponent } from './planquantity2-explorer/planquantity2-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const planquantity2Routes: Routes = [
    {
        path: '', component: PlanQuantity2Component,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanQuantity2ExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PlanQuantity2EditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PlanQuantity2EditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PlanQuantity2EditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(planquantity2Routes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PlanQuantity2Component,
        PlanQuantity2EditorComponent,
        PlanQuantity2ExplorerComponent,
        PlanQuantity2ExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanQuantity2Component]
})

export class PlanQuantity2Module { }
