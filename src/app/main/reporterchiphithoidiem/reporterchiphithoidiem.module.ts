import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { ReporterChiPhiThoiDiemComponent } from './reporterchiphithoidiem.component';

import { InputControlService } from './../../ui/input/InputControlService';
import { AuthenService } from './../../core/services/authen.service';
import { BaseReporterService } from '../../base/base.service-reporter';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const reporterchiphithoidiemRoutes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: ReporterChiPhiThoiDiemComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id', component: ReporterChiPhiThoiDiemComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id/:params', component: ReporterChiPhiThoiDiemComponent,resolve: { permission: PermissionResolve } }
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(reporterchiphithoidiemRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        ReporterChiPhiThoiDiemComponent
    ],
    providers: [
        BaseReporterService,
        InputControlService,
        AuthenService,
        PermissionResolve
    ],
    exports: [ReporterChiPhiThoiDiemComponent]
})

export class ReporterChiPhiThoiDiemModule { }