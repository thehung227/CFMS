import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { ReporterDuTruThanhToan_MhComponent } from './reporterdutruthanhtoan_mh.component';

import { InputControlService } from './../../ui/input/InputControlService';
import { AuthenService } from './../../core/services/authen.service';
import { BaseReporterService } from '../../base/base.service-reporter';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { WjChartModule } from 'wijmo/wijmo.angular2.chart';
import { WjGaugeModule } from 'wijmo/wijmo.angular2.gauge';

const reporterdutruthanhtoan_mhRoutes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: ReporterDuTruThanhToan_MhComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id', component: ReporterDuTruThanhToan_MhComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id/:params', component: ReporterDuTruThanhToan_MhComponent,resolve: { permission: PermissionResolve } }
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(reporterdutruthanhtoan_mhRoutes),
        UIModule,
        WjGridFilterModule,
        WjChartModule,WjGaugeModule
    ],
    declarations: [
        ReporterDuTruThanhToan_MhComponent
    ],
    providers: [
        BaseReporterService,
        InputControlService,
        AuthenService,
        PermissionResolve
    ],
    exports: [ReporterDuTruThanhToan_MhComponent]
})

export class ReporterDuTruThanhToan_MhModule { }