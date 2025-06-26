import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { UnitCcmPriceComponent } from './unitccmprice.component';
import { UnitCcmPriceEditorComponent } from './unitccmprice-editor/unitccmprice-editor.component';
import { UnitCcmPriceExplorerComponent } from './unitccmprice-explorer/unitccmprice-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const unitccmpriceRoutes: Routes = [
    {
        path: '', component: UnitCcmPriceComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: UnitCcmPriceExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: UnitCcmPriceEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: UnitCcmPriceEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: UnitCcmPriceEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(unitccmpriceRoutes),
        UIModule
    ],
    declarations: [
        UnitCcmPriceComponent,
        UnitCcmPriceEditorComponent,
        UnitCcmPriceExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [UnitCcmPriceComponent]
})

export class UnitCcmPriceModule { }
