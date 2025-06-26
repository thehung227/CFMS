import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { CustomerComponent } from './customer.component';
import { CustomerEditorComponent } from './customer-editor/customer-editor.component';
import { CustomerExplorerComponent } from './customer-explorer/customer-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { CustomerExplorerChildComponent } from './customer-explorer/customer-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const customerRoutes: Routes = [
    {
        path: '', component: CustomerComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: CustomerExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: CustomerEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: CustomerEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: CustomerEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(customerRoutes),
        UIModule,
        WjGridModule,
        WjGridDetailModule,        
        WjGridFilterModule
    ],
    declarations: [
        CustomerComponent,
        CustomerEditorComponent,
        CustomerExplorerComponent,
        CustomerExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [CustomerComponent]
})

export class CustomerModule { }
