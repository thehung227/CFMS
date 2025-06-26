import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillEquipmentComponent } from './billequipment.component';
import { BillEquipmentEditorComponent } from './billequipment-editor/billequipment-editor.component';
import { BillEquipmentExplorerComponent } from './billequipment-explorer/billequipment-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billequipmentRoutes: Routes = [
    {
        path: '', component: BillEquipmentComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillEquipmentExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillEquipmentEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillEquipmentEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: BillEquipmentEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billequipmentRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        BillEquipmentComponent,
        BillEquipmentEditorComponent,
        BillEquipmentExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillEquipmentComponent]
})

export class BillEquipmentModule { }
