import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillMainComponent } from './billmain.component';
import { BillMainEditorComponent } from './billmain-editor/billmain-editor.component';
import { BillMainExplorerComponent } from './billmain-explorer/billmain-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billmainRoutes: Routes = [
    {
        path: '', component: BillMainComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillMainExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillMainEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillMainEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: BillMainEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billmainRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        BillMainComponent,
        BillMainEditorComponent,
        BillMainExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillMainComponent]
})

export class BillMainModule { }
