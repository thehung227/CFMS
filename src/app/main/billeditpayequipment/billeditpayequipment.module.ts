import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillEditPayEquipmentComponent } from './billeditpayequipment.component';
import { BillEditPayEquipmentEditorComponent } from './billeditpayequipment-editor/billeditpayequipment-editor.component';
import { BillEditPayEquipmentExplorerComponent } from './billeditpayequipment-explorer/billeditpayequipment-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';

import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { BillEditPayEquipmentExplorerChildComponent } from './billeditpayequipment-explorer/billeditpayequipment-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billeditpayequipmentRoutes: Routes = [
    {
        path: '', component: BillEditPayEquipmentComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillEditPayEquipmentExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillEditPayEquipmentEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillEditPayEquipmentEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billeditpayequipmentRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        BillEditPayEquipmentComponent,
        BillEditPayEquipmentEditorComponent,
        BillEditPayEquipmentExplorerComponent,
        BillEditPayEquipmentExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillEditPayEquipmentComponent]
})

export class BillEditPayEquipmentModule { }
