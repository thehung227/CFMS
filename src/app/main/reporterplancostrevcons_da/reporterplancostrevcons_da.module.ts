import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { ReporterPlanCostRevCons_DAComponent } from './reporterplancostrevcons_da.component';

import { InputControlService } from './../../ui/input/InputControlService';
import { AuthenService } from './../../core/services/authen.service';
import { BaseReporterService } from '../../base/base.service-reporter';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const reporterplancostrevcons_daRoutes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: ReporterPlanCostRevCons_DAComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id', component: ReporterPlanCostRevCons_DAComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id/:params', component: ReporterPlanCostRevCons_DAComponent,resolve: { permission: PermissionResolve } }
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(reporterplancostrevcons_daRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        ReporterPlanCostRevCons_DAComponent
    ],
    providers: [
        BaseReporterService,
        InputControlService,
        AuthenService,
        PermissionResolve
    ],
    exports: [ReporterPlanCostRevCons_DAComponent]
})

export class ReporterPlanCostRevCons_DAModule { }