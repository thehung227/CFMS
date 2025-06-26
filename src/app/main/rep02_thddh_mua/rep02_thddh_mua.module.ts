import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { Rep02_Thddh_MuaComponent } from './rep02_thddh_mua.component';

import { InputControlService } from './../../ui/input/InputControlService';
import { AuthenService } from './../../core/services/authen.service';
import { BaseReporterService } from '../../base/base.service-reporter';
import { PermissionResolve } from '../../base/resolver';

const rep02_thddh_muaRoutes: Routes = [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: Rep02_Thddh_MuaComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id', component: Rep02_Thddh_MuaComponent,resolve: { permission: PermissionResolve } },
    { path: 'view/:id/:params', component: Rep02_Thddh_MuaComponent,resolve: { permission: PermissionResolve } }
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(rep02_thddh_muaRoutes),
        UIModule
    ],
    declarations: [
        Rep02_Thddh_MuaComponent
    ],
    providers: [
        BaseReporterService,
        InputControlService,
        AuthenService,
        PermissionResolve
    ],
    exports: [Rep02_Thddh_MuaComponent]
})

export class Rep02_Thddh_MuaModule { }