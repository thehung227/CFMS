import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ItemsListComponent } from './itemslist.component';
import { ItemsListEditorComponent } from './itemslist-editor/itemslist-editor.component';
import { ItemsListExplorerComponent } from './itemslist-explorer/itemslist-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const itemslistRoutes: Routes = [
    {
        path: '', component: ItemsListComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ItemsListExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ItemsListEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ItemsListEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ItemsListEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(itemslistRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        ItemsListComponent,
        ItemsListEditorComponent,
        ItemsListExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ItemsListComponent]
})

export class ItemsListModule { }
