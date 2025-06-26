import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { Rep04_LichSuBienDongGiaComponent } from './rep04_lichsubiendonggia.component';

import { InputControlService } from './../../ui/input/InputControlService';
import { AuthenService } from './../../core/services/authen.service';
import { BaseReporterService } from '../../base/base.service-reporter';
import { PermissionResolve } from '../../base/resolver';
import { WjChartModule } from 'wijmo/wijmo.angular2.chart';
import { WjGaugeModule } from 'wijmo/wijmo.angular2.gauge';

const rep04_lichsubiendonggiaRoutes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: Rep04_LichSuBienDongGiaComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id', component: Rep04_LichSuBienDongGiaComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id/:params', component: Rep04_LichSuBienDongGiaComponent,resolve: { permission: PermissionResolve } }
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(rep04_lichsubiendonggiaRoutes),
        UIModule,
        WjChartModule,WjGaugeModule
    ],
    declarations: [
        Rep04_LichSuBienDongGiaComponent
    ],
    providers: [
        BaseReporterService,
        InputControlService,
        AuthenService,
        PermissionResolve
    ],
    exports: [Rep04_LichSuBienDongGiaComponent]
})

export class Rep04_LichSuBienDongGiaModule { }