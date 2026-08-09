import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { Rep05_ReportInventoryComponent } from './rep05_reportinventory.component';

import { InputControlService } from './../../ui/input/InputControlService';
import { AuthenService } from './../../core/services/authen.service';
import { BaseReporterService } from '../../base/base.service-reporter';
import { PermissionResolve } from '../../base/resolver';

const rep05_reportinventoryRoutes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: Rep05_ReportInventoryComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id', component: Rep05_ReportInventoryComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id/:params', component: Rep05_ReportInventoryComponent,resolve: { permission: PermissionResolve } }
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(rep05_reportinventoryRoutes),
        UIModule
    ],
    declarations: [
        Rep05_ReportInventoryComponent
    ],
    providers: [
        BaseReporterService,
        InputControlService,
        AuthenService,
        PermissionResolve
    ],
    exports: [Rep05_ReportInventoryComponent]
})

export class Rep05_ReportInventoryModule { }