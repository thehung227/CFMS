import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedPlanLossDetailComponent } from './approvedplanlossdetail.component';
import { ApprovedPlanLossDetailEditorComponent } from './approvedplanlossdetail-editor/approvedplanlossdetail-editor.component';
import { ApprovedPlanLossDetailExplorerComponent } from './approvedplanlossdetail-explorer/approvedplanlossdetail-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedplanlossdetailRoutes: Routes = [
    {
        path: '', component: ApprovedPlanLossDetailComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedPlanLossDetailExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedPlanLossDetailEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedPlanLossDetailEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedplanlossdetailRoutes),
        UIModule
    ],
    declarations: [
        ApprovedPlanLossDetailComponent,
        ApprovedPlanLossDetailEditorComponent,
        ApprovedPlanLossDetailExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedPlanLossDetailComponent]
})

export class ApprovedPlanLossDetailModule { }
