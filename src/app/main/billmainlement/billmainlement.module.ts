import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillMainlementComponent } from './billmainlement.component';
import { BillMainlementEditorComponent } from './billmainlement-editor/billmainlement-editor.component';
import { BillMainlementExplorerComponent } from './billmainlement-explorer/billmainlement-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billmainlementRoutes: Routes = [
    {
        path: '', component: BillMainlementComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillMainlementExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillMainlementEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillMainlementEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: BillMainlementEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billmainlementRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        BillMainlementComponent,
        BillMainlementEditorComponent,
        BillMainlementExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillMainlementComponent]
})

export class BillMainlementModule { }
