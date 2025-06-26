import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { ReporterProposeComponent } from './reporterpropose.component';

import { InputControlService } from './../../ui/input/InputControlService';
import { AuthenService } from './../../core/services/authen.service';
import { BaseReporterService } from '../../base/base.service-reporter';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const reporterproposeRoutes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: ReporterProposeComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id', component: ReporterProposeComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id/:params', component: ReporterProposeComponent,resolve: { permission: PermissionResolve } }
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(reporterproposeRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        ReporterProposeComponent
    ],
    providers: [
        BaseReporterService,
        InputControlService,
        AuthenService,
        PermissionResolve
    ],
    exports: [ReporterProposeComponent]
})

export class ReporterProposeModule { }