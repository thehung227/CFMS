import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { GroupEquipListComponent } from './groupequiplist.component';
import { GroupEquipListEditorComponent } from './groupequiplist-editor/groupequiplist-editor.component';
import { GroupEquipListExplorerComponent } from './groupequiplist-explorer/groupequiplist-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const groupequiplistRoutes: Routes = [
    {
        path: '', component: GroupEquipListComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: GroupEquipListExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: GroupEquipListEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: GroupEquipListEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: GroupEquipListEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(groupequiplistRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        GroupEquipListComponent,
        GroupEquipListEditorComponent,
        GroupEquipListExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [GroupEquipListComponent]
})

export class GroupEquipListModule { }
