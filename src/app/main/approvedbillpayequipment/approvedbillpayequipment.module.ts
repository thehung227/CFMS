import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedBillPayEquipmentComponent } from './approvedbillpayequipment.component';
import { ApprovedBillPayEquipmentEditorComponent } from './approvedbillpayequipment-editor/approvedbillpayequipment-editor.component';
import { ApprovedBillPayEquipmentExplorerComponent } from './approvedbillpayequipment-explorer/approvedbillpayequipment-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedbillpayequipmentRoutes: Routes = [
    {
        path: '', component: ApprovedBillPayEquipmentComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedBillPayEquipmentExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedBillPayEquipmentEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedBillPayEquipmentEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedbillpayequipmentRoutes),
        UIModule
    ],
    declarations: [
        ApprovedBillPayEquipmentComponent,
        ApprovedBillPayEquipmentEditorComponent,
        ApprovedBillPayEquipmentExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedBillPayEquipmentComponent]
})

export class ApprovedBillPayEquipmentModule { }
