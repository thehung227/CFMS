import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { UnitPriceComponent } from './unitprice.component';
import { UnitPriceEditorComponent } from './unitprice-editor/unitprice-editor.component';
import { UnitPriceExplorerComponent } from './unitprice-explorer/unitprice-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const unitpriceRoutes: Routes = [
    {
        path: '', component: UnitPriceComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: UnitPriceExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: UnitPriceEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: UnitPriceEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: UnitPriceEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(unitpriceRoutes),
        UIModule
    ],
    declarations: [
        UnitPriceComponent,
        UnitPriceEditorComponent,
        UnitPriceExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [UnitPriceComponent]
})

export class UnitPriceModule { }
