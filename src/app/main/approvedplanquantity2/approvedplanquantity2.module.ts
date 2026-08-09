import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedPlanQuantity2Component } from './approvedplanquantity2.component';
import { ApprovedPlanQuantity2EditorComponent } from './approvedplanquantity2-editor/approvedplanquantity2-editor.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedplanquantity2Routes: Routes = [
    {
        path: '', component: ApprovedPlanQuantity2Component,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'detail', component: ApprovedPlanQuantity2EditorComponent, resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedPlanQuantity2EditorComponent, resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedplanquantity2Routes),
        UIModule
    ],
    declarations: [
        ApprovedPlanQuantity2Component,
        ApprovedPlanQuantity2EditorComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedPlanQuantity2Component]
})

export class ApprovedPlanQuantity2Module { }
