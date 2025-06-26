import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillPayEquipmentAttachComponent } from './billpayequipmentattach.component';
import { BillPayEquipmentAttachEditorComponent } from './billpayequipmentattach-editor/billpayequipmentattach-editor.component';
import { BillPayEquipmentAttachExplorerComponent } from './billpayequipmentattach-explorer/billpayequipmentattach-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';

import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { BillPayEquipmentAttachExplorerChildComponent } from './billpayequipmentattach-explorer/billpayequipmentattach-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billpayequipmentattachRoutes: Routes = [
    {
        path: '', component: BillPayEquipmentAttachComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillPayEquipmentAttachExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillPayEquipmentAttachEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillPayEquipmentAttachEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billpayequipmentattachRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        BillPayEquipmentAttachComponent,
        BillPayEquipmentAttachEditorComponent,
        BillPayEquipmentAttachExplorerComponent,
        BillPayEquipmentAttachExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillPayEquipmentAttachComponent]
})

export class BillPayEquipmentAttachModule { }
