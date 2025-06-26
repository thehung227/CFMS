import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillSuppComponent } from './billsupp.component';
import { BillSuppEditorComponent } from './billsupp-editor/billsupp-editor.component';
import { BillSuppExplorerComponent } from './billsupp-explorer/billsupp-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billsuppRoutes: Routes = [
    {
        path: '', component: BillSuppComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillSuppExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillSuppEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillSuppEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: BillSuppEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billsuppRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        BillSuppComponent,
        BillSuppEditorComponent,
        BillSuppExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillSuppComponent]
})

export class BillSuppModule { }
