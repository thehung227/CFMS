import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillPaySuppComponent } from './billpaysupp.component';
import { BillPaySuppEditorComponent } from './billpaysupp-editor/billpaysupp-editor.component';
import { BillPaySuppExplorerComponent } from './billpaysupp-explorer/billpaysupp-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { BillPaySuppExplorerChildComponent } from './billpaysupp-explorer/billpaysupp-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billpaysuppRoutes: Routes = [
    {
        path: '', component: BillPaySuppComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillPaySuppExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillPaySuppEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillPaySuppEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: BillPaySuppEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billpaysuppRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        BillPaySuppComponent,
        BillPaySuppEditorComponent,
        BillPaySuppExplorerComponent,
        BillPaySuppExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillPaySuppComponent]
})

export class BillPaySuppModule { }
