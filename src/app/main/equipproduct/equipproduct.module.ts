import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { EquipProductComponent } from './equipproduct.component';
import { EquipProductEditorComponent } from './equipproduct-editor/equipproduct-editor.component';
import { EquipProductExplorerComponent } from './equipproduct-explorer/equipproduct-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const equipproductRoutes: Routes = [
    {
        path: '', component: EquipProductComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: EquipProductExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: EquipProductEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: EquipProductEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: EquipProductEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(equipproductRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        EquipProductComponent,
        EquipProductEditorComponent,
        EquipProductExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [EquipProductComponent]
})

export class EquipProductModule { }
