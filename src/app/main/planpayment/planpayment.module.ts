import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { PlanPaymentComponent } from './planpayment.component';
import { PlanPaymentEditorComponent } from './planpayment-editor/planpayment-editor.component';
import { PlanPaymentExplorerComponent } from './planpayment-explorer/planpayment-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { PlanPaymentExplorerChildComponent } from './planpayment-explorer/planpayment-explorer-child.component';
// import { PlanPaymentPopupComponent } from '../planpayment-popup/planpayment-popup.component';
// import { PlanPaymentPopupEditorComponent } from '../planpayment-popup/planpayment-popup-editor/planpayment-popup-editor.component';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { PermissionResolve } from '../../base/resolver';

const planpaymentRoutes: Routes = [
    {
        path: '', component: PlanPaymentComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: PlanPaymentExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: PlanPaymentEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: PlanPaymentEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id/:params', component: PlanPaymentEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(planpaymentRoutes),
        UIModule,
        FormsModule,
        HttpModule,
        WjGridModule,
        WjGridDetailModule,
        WjGridFilterModule
    ],
    declarations: [
        PlanPaymentComponent,
        PlanPaymentEditorComponent,
        PlanPaymentExplorerComponent,
        PlanPaymentExplorerChildComponent,
        // PlanPaymentPopupComponent,
        // PlanPaymentPopupEditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [PlanPaymentComponent]
})

export class PlanPaymentModule { }
