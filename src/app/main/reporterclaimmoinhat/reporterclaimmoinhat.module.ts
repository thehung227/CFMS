import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { ReporterClaimMoiNhatComponent } from './reporterclaimmoinhat.component';

import { InputControlService } from './../../ui/input/InputControlService';
import { AuthenService } from './../../core/services/authen.service';
import { BaseReporterService } from '../../base/base.service-reporter';
import { PermissionResolve } from '../../base/resolver';

const reporterclaimmoinhatRoutes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: ReporterClaimMoiNhatComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id', component: ReporterClaimMoiNhatComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id/:params', component: ReporterClaimMoiNhatComponent,resolve: { permission: PermissionResolve } }
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(reporterclaimmoinhatRoutes),
        UIModule
    ],
    declarations: [
        ReporterClaimMoiNhatComponent
    ],
    providers: [
        BaseReporterService,
        InputControlService,
        AuthenService,
        PermissionResolve
    ],
    exports: [ReporterClaimMoiNhatComponent]
})

export class ReporterClaimMoiNhatModule { }


