import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { ReporterPlanCostRevConsComponent } from './reporterplancostrevcons.component';

import { InputControlService } from './../../ui/input/InputControlService';
import { AuthenService } from './../../core/services/authen.service';
import { BaseReporterService } from '../../base/base.service-reporter';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const reporterplancostrevconsRoutes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: ReporterPlanCostRevConsComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id', component: ReporterPlanCostRevConsComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id/:params', component: ReporterPlanCostRevConsComponent,resolve: { permission: PermissionResolve } }
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(reporterplancostrevconsRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        ReporterPlanCostRevConsComponent
    ],
    providers: [
        BaseReporterService,
        InputControlService,
        AuthenService,
        PermissionResolve
    ],
    exports: [ReporterPlanCostRevConsComponent]
})

export class ReporterPlanCostRevConsModule { }