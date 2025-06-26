import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { EquipListComponent } from './equiplist.component';
import { EquipListEditorComponent } from './equiplist-editor/equiplist-editor.component';
import { EquipListExplorerComponent } from './equiplist-explorer/equiplist-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const equiplistRoutes: Routes = [
    {
        path: '', component: EquipListComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: EquipListExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: EquipListEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: EquipListEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: EquipListEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(equiplistRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        EquipListComponent,
        EquipListEditorComponent,
        EquipListExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [EquipListComponent]
})

export class EquipListModule { }
