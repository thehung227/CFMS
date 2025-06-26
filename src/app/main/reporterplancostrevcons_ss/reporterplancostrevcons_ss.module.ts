import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { ReporterPlanCostRevCons_SSComponent } from './reporterplancostrevcons_ss.component';

import { InputControlService } from './../../ui/input/InputControlService';
import { AuthenService } from './../../core/services/authen.service';
import { BaseReporterService } from '../../base/base.service-reporter';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const reporterplancostrevcons_ssRoutes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: ReporterPlanCostRevCons_SSComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id', component: ReporterPlanCostRevCons_SSComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id/:params', component: ReporterPlanCostRevCons_SSComponent,resolve: { permission: PermissionResolve } }
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(reporterplancostrevcons_ssRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        ReporterPlanCostRevCons_SSComponent
    ],
    providers: [
        BaseReporterService,
        InputControlService,
        AuthenService,
        PermissionResolve
    ],
    exports: [ReporterPlanCostRevCons_SSComponent]
})

export class ReporterPlanCostRevCons_SSModule { }