import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { ReporterPlanCashFlowSiteComponent } from './reporterplancashflowsite.component';

import { InputControlService } from './../../ui/input/InputControlService';
import { AuthenService } from './../../core/services/authen.service';
import { BaseReporterService } from '../../base/base.service-reporter';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const reporterplancashflowsiteRoutes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: ReporterPlanCashFlowSiteComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id', component: ReporterPlanCashFlowSiteComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id/:params', component: ReporterPlanCashFlowSiteComponent,resolve: { permission: PermissionResolve } }
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(reporterplancashflowsiteRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        ReporterPlanCashFlowSiteComponent
    ],
    providers: [
        BaseReporterService,
        InputControlService,
        AuthenService,
        PermissionResolve
    ],
    exports: [ReporterPlanCashFlowSiteComponent]
})

export class ReporterPlanCashFlowSiteModule { }