import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { ReporterPhanBoCpnsComponent } from './reporterphanbocpns.component';

import { InputControlService } from './../../ui/input/InputControlService';
import { AuthenService } from './../../core/services/authen.service';
import { BaseReporterService } from '../../base/base.service-reporter';
import { PermissionResolve } from '../../base/resolver';

const reporterphanbocpnsRoutes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: ReporterPhanBoCpnsComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id', component: ReporterPhanBoCpnsComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id/:params', component: ReporterPhanBoCpnsComponent,resolve: { permission: PermissionResolve } }
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(reporterphanbocpnsRoutes),
        UIModule
    ],
    declarations: [
        ReporterPhanBoCpnsComponent
    ],
    providers: [
        BaseReporterService,
        InputControlService,
        AuthenService,
        PermissionResolve
    ],
    exports: [ReporterPhanBoCpnsComponent]
})

export class ReporterPhanBoCpnsModule { }


