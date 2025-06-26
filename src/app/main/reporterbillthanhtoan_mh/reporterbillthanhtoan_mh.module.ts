import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { ReporterBillThanhtoan_MhComponent } from './reporterbillthanhtoan_mh.component';

import { InputControlService } from './../../ui/input/InputControlService';
import { AuthenService } from './../../core/services/authen.service';
import { BaseReporterService } from '../../base/base.service-reporter';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const reporterbillthanhtoan_mhRoutes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: ReporterBillThanhtoan_MhComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id', component: ReporterBillThanhtoan_MhComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id/:params', component: ReporterBillThanhtoan_MhComponent,resolve: { permission: PermissionResolve } }
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(reporterbillthanhtoan_mhRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        ReporterBillThanhtoan_MhComponent
    ],
    providers: [
        BaseReporterService,
        InputControlService,
        AuthenService,
        PermissionResolve
    ],
    exports: [ReporterBillThanhtoan_MhComponent]
})

export class ReporterBillThanhtoan_MhModule { }