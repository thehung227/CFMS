import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ItemSurfaceComponent } from './itemsurface.component';
import { ItemSurfaceEditorComponent } from './itemsurface-editor/itemsurface-editor.component';
import { ItemSurfaceExplorerComponent } from './itemsurface-explorer/itemsurface-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const itemsurfaceRoutes: Routes = [
    {
        path: '', component: ItemSurfaceComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ItemSurfaceExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ItemSurfaceEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ItemSurfaceEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ItemSurfaceEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(itemsurfaceRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        ItemSurfaceComponent,
        ItemSurfaceEditorComponent,
        ItemSurfaceExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ItemSurfaceComponent]
})

export class ItemSurfaceModule { }
