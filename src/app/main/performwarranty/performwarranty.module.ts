import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PerformWarrantyComponent } from './performwarranty.component';
import { PerformWarrantyEditorComponent } from './performwarranty-editor/performwarranty-editor.component';
import { PerformWarrantyExplorerComponent } from './performwarranty-explorer/performwarranty-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const performwarrantyRoutes: Routes = [
    {
        path: '', component: PerformWarrantyComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PerformWarrantyExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PerformWarrantyEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PerformWarrantyEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PerformWarrantyEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(performwarrantyRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        PerformWarrantyComponent,
        PerformWarrantyEditorComponent,
        PerformWarrantyExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PerformWarrantyComponent]
})

export class PerformWarrantyModule { }
