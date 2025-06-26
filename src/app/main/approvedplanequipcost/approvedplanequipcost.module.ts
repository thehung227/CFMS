import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';

import { ApprovedPlanEquipCostComponent } from './approvedplanequipcost.component';
import { ApprovedPlanEquipCostEditorComponent } from './approvedplanequipcost-editor/approvedplanequipcost-editor.component';
import { ApprovedPlanEquipCostExplorerComponent } from './approvedplanequipcost-explorer/approvedplanequipcost-explorer.component';

import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import { UIModule } from './../../ui/ui.module';

import { InputControlService } from './../../ui/input/InputControlService';
import { PanelControlService } from './../../ui/panel/PanelControlService';
import { BaseExplorerService } from '../../base/base.service-explorer';
import { PermissionResolve } from '../../base/resolver';

const approvedplanequipcostRoutes: Routes = [
    {
        path: '', component: ApprovedPlanEquipCostComponent,
        children: [
            { path: '', redirectTo: 'index', pathMatch: 'full' },
            { path: 'index', component: ApprovedPlanEquipCostExplorerComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail', component: ApprovedPlanEquipCostEditorComponent,resolve: { permission: PermissionResolve } },
            { path: 'detail/:id', component: ApprovedPlanEquipCostEditorComponent,resolve: { permission: PermissionResolve } }
        ]
    },
]

@NgModule({
    imports: [
        CommonModule,
        WjGridModule, WjInputModule,
        FormsModule, ReactiveFormsModule,
        HttpModule,
        RouterModule.forChild(approvedplanequipcostRoutes),
        UIModule
    ],
    declarations: [
        ApprovedPlanEquipCostComponent,
        ApprovedPlanEquipCostEditorComponent,
        ApprovedPlanEquipCostExplorerComponent
    ],
    providers: [
        BaseExplorerService,
        InputControlService,
        PanelControlService,
        PermissionResolve
    ],
    exports: [ApprovedPlanEquipCostComponent]
})

export class ApprovedPlanEquipCostModule { }
