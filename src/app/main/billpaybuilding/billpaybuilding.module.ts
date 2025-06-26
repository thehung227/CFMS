import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillPayBuildingComponent } from './billpaybuilding.component';
import { BillPayBuildingEditorComponent } from './billpaybuilding-editor/billpaybuilding-editor.component';
import { BillPayBuildingExplorerComponent } from './billpaybuilding-explorer/billpaybuilding-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { BillPayBuildingExplorerChildComponent } from './billpaybuilding-explorer/billpaybuilding-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billpaybuildingRoutes: Routes = [
    {
        path: '', component: BillPayBuildingComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillPayBuildingExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillPayBuildingEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillPayBuildingEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: BillPayBuildingEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billpaybuildingRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        BillPayBuildingComponent,
        BillPayBuildingEditorComponent,
        BillPayBuildingExplorerComponent,
        BillPayBuildingExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillPayBuildingComponent]
})

export class BillPayBuildingModule { }
