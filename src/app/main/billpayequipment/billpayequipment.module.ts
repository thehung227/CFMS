import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillPayEquipmentComponent } from './billpayequipment.component';
import { BillPayEquipmentEditorComponent } from './billpayequipment-editor/billpayequipment-editor.component';
import { BillPayEquipmentExplorerComponent } from './billpayequipment-explorer/billpayequipment-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';

import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { BillPayEquipmentExplorerChildComponent } from './billpayequipment-explorer/billpayequipment-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billpayequipmentRoutes: Routes = [
    {
        path: '', component: BillPayEquipmentComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillPayEquipmentExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillPayEquipmentEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillPayEquipmentEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billpayequipmentRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        BillPayEquipmentComponent,
        BillPayEquipmentEditorComponent,
        BillPayEquipmentExplorerComponent,
        BillPayEquipmentExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillPayEquipmentComponent]
})

export class BillPayEquipmentModule { }
