import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { BillPaySupp_ViewComponent } from './billpaysupp_view.component';
import { BillPaySupp_ViewEditorComponent } from './billpaysupp_view-editor/billpaysupp_view-editor.component';
import { BillPaySupp_ViewExplorerComponent } from './billpaysupp_view-explorer/billpaysupp_view-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { BillPaySupp_ViewExplorerChildComponent } from './billpaysupp_view-explorer/billpaysupp_view-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const billpaysupp_viewRoutes: Routes = [
    {
        path: '', component: BillPaySupp_ViewComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: BillPaySupp_ViewExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: BillPaySupp_ViewEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: BillPaySupp_ViewEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: BillPaySupp_ViewEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(billpaysupp_viewRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        BillPaySupp_ViewComponent,
        BillPaySupp_ViewEditorComponent,
        BillPaySupp_ViewExplorerComponent,
        BillPaySupp_ViewExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [BillPaySupp_ViewComponent]
})

export class BillPaySupp_ViewModule { }
