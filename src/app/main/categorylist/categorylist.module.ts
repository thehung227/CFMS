import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { CategoryListComponent } from './categorylist.component';
import { CategoryListEditorComponent } from './categorylist-editor/categorylist-editor.component';
import { CategoryListExplorerComponent } from './categorylist-explorer/categorylist-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const categorylistRoutes: Routes = [
    {
        path: '', component: CategoryListComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: CategoryListExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: CategoryListEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: CategoryListEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: CategoryListEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(categorylistRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        CategoryListComponent,
        CategoryListEditorComponent,
        CategoryListExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [CategoryListComponent]
})

export class CategoryListModule { }
