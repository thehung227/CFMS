import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedBillInternalEquipComponent } from './approvedbillinternalequip.component';
import { ApprovedBillInternalEquipEditorComponent } from './approvedbillinternalequip-editor/approvedbillinternalequip-editor.component';
import { ApprovedBillInternalEquipExplorerComponent } from './approvedbillinternalequip-explorer/approvedbillinternalequip-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedbillinternalequipRoutes: Routes = [
    {
        path: '', component: ApprovedBillInternalEquipComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedBillInternalEquipExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedBillInternalEquipEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedBillInternalEquipEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedbillinternalequipRoutes),
        UIModule
    ],
    declarations: [
        ApprovedBillInternalEquipComponent,
        ApprovedBillInternalEquipEditorComponent,
        ApprovedBillInternalEquipExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedBillInternalEquipComponent]
})

export class ApprovedBillInternalEquipModule { }
