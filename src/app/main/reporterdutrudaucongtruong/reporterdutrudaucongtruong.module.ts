import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from '../../ui/ui.module';

import { ReporterDuTruDauCongTruongComponent } from './reporterdutrudaucongtruong.component';

import { InputControlService } from '../../ui/input/InputControlService';
import { AuthenService } from '../../core/services/authen.service';
import { BaseReporterService } from '../../base/base.service-reporter';
import { PermissionResolve } from '../../base/resolver';

const reporterdutrudaucongtruongRoutes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: ReporterDuTruDauCongTruongComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id', component: ReporterDuTruDauCongTruongComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id/:params', component: ReporterDuTruDauCongTruongComponent,resolve: { permission: PermissionResolve } }
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(reporterdutrudaucongtruongRoutes),
        UIModule
    ],
    declarations: [
        ReporterDuTruDauCongTruongComponent
    ],
    providers: [
        BaseReporterService,
        InputControlService,
        AuthenService,
        PermissionResolve
    ],
    exports: [ReporterDuTruDauCongTruongComponent]
})

export class ReporterDuTruDauCongTruongModule { }


