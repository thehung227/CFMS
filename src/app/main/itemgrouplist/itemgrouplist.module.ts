import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ItemGroupListComponent } from './itemgrouplist.component';
import { ItemGroupListEditorComponent } from './itemgrouplist-editor/itemgrouplist-editor.component';
import { ItemGroupListExplorerComponent } from './itemgrouplist-explorer/itemgrouplist-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const itemgrouplistRoutes: Routes = [
    {
        path: '', component: ItemGroupListComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ItemGroupListExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ItemGroupListEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ItemGroupListEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ItemGroupListEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(itemgrouplistRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        ItemGroupListComponent,
        ItemGroupListEditorComponent,
        ItemGroupListExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ItemGroupListComponent]
})

export class ItemGroupListModule { }
