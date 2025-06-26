import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillEquipment_ViewComponent } from './billequipment_view.component';
import { BillEquipment_ViewEditorComponent } from './billequipment_view-editor/billequipment_view-editor.component';
import { BillEquipment_ViewExplorerComponent } from './billequipment_view-explorer/billequipment_view-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billequipment_viewRoutes: Routes = [
    {
        path: '', component: BillEquipment_ViewComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillEquipment_ViewExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillEquipment_ViewEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillEquipment_ViewEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: BillEquipment_ViewEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billequipment_viewRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        BillEquipment_ViewComponent,
        BillEquipment_ViewEditorComponent,
        BillEquipment_ViewExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillEquipment_ViewComponent]
})

export class BillEquipment_ViewModule { }
