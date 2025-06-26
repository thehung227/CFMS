import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { Rep01_Bkddh_MuaComponent } from './rep01_bkddh_mua.component';

import { InputControlService } from './../../ui/input/InputControlService';
import { AuthenService } from './../../core/services/authen.service';
import { BaseReporterService } from '../../base/base.service-reporter';
import { PermissionResolve } from '../../base/resolver';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';

const rep01_bkddh_muaRoutes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: Rep01_Bkddh_MuaComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id', component: Rep01_Bkddh_MuaComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id/:params', component: Rep01_Bkddh_MuaComponent,resolve: { permission: PermissionResolve } }
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(rep01_bkddh_muaRoutes),
        UIModule,
        WjGridFilterModule
    ],
    declarations: [
        Rep01_Bkddh_MuaComponent
    ],
    providers: [
        BaseReporterService,
        InputControlService,
        AuthenService,
        PermissionResolve
    ],
    exports: [Rep01_Bkddh_MuaComponent]
})

export class Rep01_Bkddh_MuaModule { }