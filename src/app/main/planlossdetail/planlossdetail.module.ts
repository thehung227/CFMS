import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanLossDetailComponent } from './planlossdetail.component';
import { PlanLossDetailEditorComponent } from './planlossdetail-editor/planlossdetail-editor.component';
import { PlanLossDetailExplorerComponent } from './planlossdetail-explorer/planlossdetail-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PlanLossDetailExplorerChildComponent } from './planlossdetail-explorer/planlossdetail-explorer-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const planlossdetailRoutes: Routes = [
    {
        path: '', component: PlanLossDetailComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanLossDetailExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PlanLossDetailEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PlanLossDetailEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PlanLossDetailEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(planlossdetailRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PlanLossDetailComponent,
        PlanLossDetailEditorComponent,
        PlanLossDetailExplorerComponent,
        PlanLossDetailExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanLossDetailComponent]
})

export class PlanLossDetailModule { }
