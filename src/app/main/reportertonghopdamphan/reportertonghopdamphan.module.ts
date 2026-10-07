import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ReporterTongHopDamPhanComponent } from './reportertonghopdamphan.component';

import { AuthenService } from './../../core/services/authen.service';
import { BaseReporterService } from '../../base/base.service-reporter';
import { PermissionResolve } from '../../base/resolver';

const reportertonghopdamphanRoutes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: ReporterTongHopDamPhanComponent, resolve: { permission: PermissionResolve } },
    { path: 'view/:id', component: ReporterTongHopDamPhanComponent, resolve: { permission: PermissionResolve } }
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        RouterModule.forChild(reportertonghopdamphanRoutes)
    ],
    declarations: [
        ReporterTongHopDamPhanComponent
    ],
    providers: [
        BaseReporterService,
        AuthenService,
        PermissionResolve
    ],
    exports: [ReporterTongHopDamPhanComponent]
})

export class ReporterTongHopDamPhanModule { }
