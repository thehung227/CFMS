import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PerformWarrantyEquipComponent } from './performwarrantyequip.component';
import { PerformWarrantyEquipEditorComponent } from './performwarrantyequip-editor/performwarrantyequip-editor.component';
import { PerformWarrantyEquipExplorerComponent } from './performwarrantyequip-explorer/performwarrantyequip-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const performwarrantyequipRoutes: Routes = [
    {
        path: '', component: PerformWarrantyEquipComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PerformWarrantyEquipExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PerformWarrantyEquipEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PerformWarrantyEquipEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PerformWarrantyEquipEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(performwarrantyequipRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        PerformWarrantyEquipComponent,
        PerformWarrantyEquipEditorComponent,
        PerformWarrantyEquipExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PerformWarrantyEquipComponent]
})

export class PerformWarrantyEquipModule { }
