import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ItemSizeComponent } from './itemsize.component';
import { ItemSizeEditorComponent } from './itemsize-editor/itemsize-editor.component';
import { ItemSizeExplorerComponent } from './itemsize-explorer/itemsize-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const itemsizeRoutes: Routes = [
    {
        path: '', component: ItemSizeComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ItemSizeExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ItemSizeEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ItemSizeEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ItemSizeEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(itemsizeRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        ItemSizeComponent,
        ItemSizeEditorComponent,
        ItemSizeExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ItemSizeComponent]
})

export class ItemSizeModule { }
