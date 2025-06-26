import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceCostComponent } from './invoicecost.component';
import { InvoiceCostEditorComponent } from './invoicecost-editor/invoicecost-editor.component';
import { InvoiceCostExplorerComponent } from './invoicecost-explorer/invoicecost-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const invoicecostRoutes: Routes = [
    {
        path: '', component: InvoiceCostComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: InvoiceCostExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: InvoiceCostEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: InvoiceCostEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: InvoiceCostEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(invoicecostRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        InvoiceCostComponent,
        InvoiceCostEditorComponent,
        InvoiceCostExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [InvoiceCostComponent]
})

export class InvoiceCostModule { }
