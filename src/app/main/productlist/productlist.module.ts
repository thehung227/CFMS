import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ProductListComponent } from './productlist.component';
import { ProductListEditorComponent } from './productlist-editor/productlist-editor.component';
import { ProductListExplorerComponent } from './productlist-explorer/productlist-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const productlistRoutes: Routes = [
    {
        path: '', component: ProductListComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ProductListExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ProductListEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ProductListEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: ProductListEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(productlistRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        ProductListComponent,
        ProductListEditorComponent,
        ProductListExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ProductListComponent]
})

export class ProductListModule { }
