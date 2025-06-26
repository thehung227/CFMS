import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillSettlementComponent } from './billsettlement.component';
import { BillSettlementEditorComponent } from './billsettlement-editor/billsettlement-editor.component';
import { BillSettlementExplorerComponent } from './billsettlement-explorer/billsettlement-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billsettlementRoutes: Routes = [
    {
        path: '', component: BillSettlementComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillSettlementExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillSettlementEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillSettlementEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: BillSettlementEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billsettlementRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        BillSettlementComponent,
        BillSettlementEditorComponent,
        BillSettlementExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillSettlementComponent]
})

export class BillSettlementModule { }
