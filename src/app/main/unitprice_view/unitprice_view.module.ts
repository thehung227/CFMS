import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { UnitPrice_ViewComponent } from './unitprice_view.component';
import { UnitPrice_ViewEditorComponent } from './unitprice_view-editor/unitprice_view-editor.component';
import { UnitPrice_ViewExplorerComponent } from './unitprice_view-explorer/unitprice_view-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const unitprice_viewRoutes: Routes = [
    {
        path: '', component: UnitPrice_ViewComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: UnitPrice_ViewExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: UnitPrice_ViewEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: UnitPrice_ViewEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: UnitPrice_ViewEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(unitprice_viewRoutes),
        UIModule
    ],
    declarations: [
        UnitPrice_ViewComponent,
        UnitPrice_ViewEditorComponent,
        UnitPrice_ViewExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [UnitPrice_ViewComponent]
})

export class UnitPrice_ViewModule { }
