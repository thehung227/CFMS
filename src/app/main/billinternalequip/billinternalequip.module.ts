import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillInternalEquipComponent } from './billinternalequip.component';
import { BillInternalEquipEditorComponent } from './billinternalequip-editor/billinternalequip-editor.component';
import { BillInternalEquipExplorerComponent } from './billinternalequip-explorer/billinternalequip-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { BillInternalEquipExplorerChildComponent } from './billinternalequip-explorer/billinternalequip-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billinternalequipRoutes: Routes = [
    {
        path: '', component: BillInternalEquipComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillInternalEquipExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillInternalEquipEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillInternalEquipEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billinternalequipRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        BillInternalEquipComponent,
        BillInternalEquipEditorComponent,
        BillInternalEquipExplorerComponent,
        BillInternalEquipExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillInternalEquipComponent]
})

export class BillInternalEquipModule { }
