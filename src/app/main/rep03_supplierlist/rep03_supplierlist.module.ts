import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { Rep03_SupplierListComponent } from './rep03_supplierlist.component';

import { InputControlService } from './../../ui/input/InputControlService';
import { AuthenService } from './../../core/services/authen.service';
import { BaseReporterService } from '../../base/base.service-reporter';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const rep03_supplierlistRoutes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: Rep03_SupplierListComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id', component: Rep03_SupplierListComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id/:params', component: Rep03_SupplierListComponent,resolve: { permission: PermissionResolve } }
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(rep03_supplierlistRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        Rep03_SupplierListComponent
    ],
    providers: [
        BaseReporterService,
        InputControlService,
        AuthenService,
        PermissionResolve
    ],
    exports: [Rep03_SupplierListComponent]
})

export class Rep03_SupplierListModule { }