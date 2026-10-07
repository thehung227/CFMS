import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanTrackingPaymentComponent } from './plantrackingpayment.component';
import { PlanTrackingPaymentEditorComponent } from './plantrackingpayment-editor/plantrackingpayment-editor.component';
import { PlanTrackingPaymentExplorerComponent } from './plantrackingpayment-explorer/plantrackingpayment-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { BrowserModule } from '@angular/platform-browser';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PermissionResolve } from '../../base/resolver';
import { PlanTrackingPaymentExplorerChildComponent } from './plantrackingpayment-explorer/plantrackingpayment-explorer-child.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const plantrackingpaymentRoutes: Routes = [
    {
        path: '', component: PlanTrackingPaymentComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanTrackingPaymentExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PlanTrackingPaymentEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PlanTrackingPaymentEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PlanTrackingPaymentEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(plantrackingpaymentRoutes),
        UIModule,
        WjGridFilterModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule
    ],
    declarations: [
        PlanTrackingPaymentComponent,
        PlanTrackingPaymentEditorComponent,
        PlanTrackingPaymentExplorerComponent,
        PlanTrackingPaymentExplorerChildComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanTrackingPaymentComponent]
})

export class PlanTrackingPaymentModule { }
